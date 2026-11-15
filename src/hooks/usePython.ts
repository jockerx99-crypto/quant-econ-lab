"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface PythonRunResult {
  stdout: string;
  stderr: string;
  plots: string[];
  result?: unknown;
  error?: string | null;
}

export interface PythonValidationResult {
  passed: boolean;
  message: string;
}

interface PendingPythonRequest {
  resolve: (val: unknown) => void;
  reject: (err: unknown) => void;
  type: "RUN" | "VALIDATE";
}

export function usePython() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Initialisation de Pyodide...");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<PythonRunResult>({
    stdout: "",
    stderr: "",
    plots: [],
    result: null,
    error: null,
  });
  const [validation, setValidation] = useState<PythonValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, PendingPythonRequest>>(new Map());

  // Initialize Worker
  const initWorker = useCallback(() => {
    if (typeof window === "undefined") return;

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    setIsLoading(true);
    setIsReady(false);
    setStatusMessage("Démarrage du worker Pyodide...");

    const worker = new Worker("/workers/pyodide.worker.js");
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const { type, id, message, error: workerErr, success, stdout, stderr, plots, result, passed } =
        event.data;

      switch (type) {
        case "STATUS":
          setStatusMessage(message);
          break;
        case "READY":
          setIsReady(true);
          setIsLoading(false);
          setStatusMessage("Environnement Python prêt (Pandas, Statsmodels, Matplotlib).");
          break;
        case "RUN_RESULT": {
          setIsRunning(false);
          const runRes: PythonRunResult = {
            stdout: stdout || "",
            stderr: stderr || "",
            plots: plots || [],
            result,
            error: success ? null : stderr,
          };
          setOutput(runRes);

          if (id && pendingRequests.current.has(id)) {
            const req = pendingRequests.current.get(id);
            req?.resolve(runRes);
            pendingRequests.current.delete(id);
          }
          break;
        }
        case "VALIDATE_RESULT": {
          setIsRunning(false);
          const valRes: PythonValidationResult = {
            passed: Boolean(passed),
            message: message || (passed ? "Validé !" : "Échec des assertions."),
          };
          setValidation(valRes);

          if (id && pendingRequests.current.has(id)) {
            const req = pendingRequests.current.get(id);
            req?.resolve(valRes);
            pendingRequests.current.delete(id);
          }
          break;
        }
        case "ERROR":
          setIsLoading(false);
          setIsRunning(false);
          setError(workerErr);
          if (id && pendingRequests.current.has(id)) {
            const req = pendingRequests.current.get(id);
            req?.reject(new Error(workerErr));
            pendingRequests.current.delete(id);
          }
          break;
      }
    };

    worker.onerror = (err) => {
      console.error("[Pyodide Worker Error]", err);
      setIsLoading(false);
      setIsRunning(false);
      setError("Erreur fatale dans le worker Pyodide.");
    };

    worker.postMessage({ action: "INIT" });
  }, []);

  useEffect(() => {
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [initWorker]);

  // Execute Python Code
  const runPython = useCallback(
    async (code: string, contextData?: { csv: string; varName: string }): Promise<PythonRunResult> => {
      if (!isReady || !workerRef.current) {
        throw new Error("L'environnement Python n'est pas encore initialisé.");
      }

      setIsRunning(true);
      setError(null);
      setValidation(null);

      const id = "py_" + Math.random().toString(36).substring(2, 9);

      return new Promise<PythonRunResult>((resolve, reject) => {
        // Watchdog timeout to prevent infinite loops (30s)
        const timeout = setTimeout(() => {
          if (pendingRequests.current.has(id)) {
            pendingRequests.current.delete(id);
            setIsRunning(false);
            initWorker();
            reject(
              new Error(
                "Délai d'exécution dépassé (Watchdog Timeout). Le worker a été réinitialisé pour protéger l'application."
              )
            );
          }
        }, 30000);

        pendingRequests.current.set(id, {
          resolve: (val) => {
            clearTimeout(timeout);
            resolve(val as PythonRunResult);
          },
          reject: (err) => {
            clearTimeout(timeout);
            reject(err);
          },
          type: "RUN",
        });

        workerRef.current?.postMessage({
          action: "RUN",
          id,
          code,
          contextData,
        });
      });
    },
    [isReady, initWorker]
  );

  // Validate Code
  const validatePython = useCallback(
    async (testCode: string): Promise<PythonValidationResult> => {
      if (!isReady || !workerRef.current) {
        throw new Error("Environnement Python non prêt.");
      }

      setIsRunning(true);
      const id = "val_" + Math.random().toString(36).substring(2, 9);

      return new Promise<PythonValidationResult>((resolve, reject) => {
        pendingRequests.current.set(id, {
          resolve: (val) => resolve(val as PythonValidationResult),
          reject,
          type: "VALIDATE",
        });

        workerRef.current?.postMessage({
          action: "VALIDATE",
          id,
          testCode,
        });
      });
    },
    [isReady]
  );

  const seedDataset = useCallback((varName: string, csv: string) => {
    if (workerRef.current && isReady) {
      workerRef.current.postMessage({ action: "SEED", varName, csv });
    }
  }, [isReady]);

  const resetOutput = useCallback(() => {
    setOutput({
      stdout: "",
      stderr: "",
      plots: [],
      result: null,
      error: null,
    });
    setValidation(null);
    setError(null);
  }, []);

  return {
    isReady,
    isLoading,
    statusMessage,
    isRunning,
    output,
    validation,
    error,
    runPython,
    validatePython,
    seedDataset,
    resetOutput,
    restartRuntime: initWorker,
  };
}
