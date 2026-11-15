"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type SQLCellValue = string | number | boolean | null | Uint8Array;

export interface SQLTableResult {
  columns: string[];
  values: SQLCellValue[][];
  rowCount: number;
}

export interface SQLRunResult {
  tables: SQLTableResult[];
  executionTimeMs?: string;
  error?: string | null;
}

export interface SQLValidationResult {
  passed: boolean;
  message: string;
}

interface PendingSQLRequest {
  resolve: (val: unknown) => void;
  reject: (err: unknown) => void;
}

export function useSQL() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Chargement du moteur SQLite...");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<SQLRunResult>({
    tables: [],
    executionTimeMs: undefined,
    error: null,
  });
  const [validation, setValidation] = useState<SQLValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, PendingSQLRequest>>(new Map());

  const initWorker = useCallback(() => {
    if (typeof window === "undefined") return;

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    setIsLoading(true);
    setIsReady(false);
    setStatusMessage("Démarrage du worker SQLite WASM...");

    const worker = new Worker("/workers/sql.worker.js");
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const { type, id, message, error: workerErr, tables, executionTimeMs, passed, data } = event.data;

      switch (type) {
        case "STATUS":
          setStatusMessage(message);
          break;
        case "READY":
          setIsReady(true);
          setIsLoading(false);
          setStatusMessage("Base de données SQLite prête avec tables actuarielles & macroéconomiques.");
          break;
        case "RUN_RESULT": {
          setIsRunning(false);
          const runRes: SQLRunResult = {
            tables: tables || [],
            executionTimeMs,
            error: workerErr || null,
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
          const valRes: SQLValidationResult = {
            passed: Boolean(passed),
            message: message || (passed ? "Requête validée !" : "Échec de la validation."),
          };
          setValidation(valRes);

          if (id && pendingRequests.current.has(id)) {
            const req = pendingRequests.current.get(id);
            req?.resolve(valRes);
            pendingRequests.current.delete(id);
          }
          break;
        }
        case "EXPORT_RESULT": {
          if (id && pendingRequests.current.has(id)) {
            const req = pendingRequests.current.get(id);
            req?.resolve(data || []);
            pendingRequests.current.delete(id);
          }
          break;
        }
        case "RESET_SUCCESS": {
          setIsRunning(false);
          setStatusMessage("Base de données réinitialisée.");
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
      console.error("[SQL Worker Error]", err);
      setIsLoading(false);
      setIsRunning(false);
      setError("Erreur dans le worker SQLite.");
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

  const runSQL = useCallback(
    async (query: string): Promise<SQLRunResult> => {
      if (!isReady || !workerRef.current) {
        throw new Error("Le moteur SQLite n'est pas encore prêt.");
      }

      setIsRunning(true);
      setError(null);
      setValidation(null);

      const id = "sql_" + Math.random().toString(36).substring(2, 9);

      return new Promise<SQLRunResult>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (pendingRequests.current.has(id)) {
            pendingRequests.current.delete(id);
            setIsRunning(false);
            initWorker();
            reject(new Error("Délai d'exécution SQL dépassé (Watchdog Timeout)."));
          }
        }, 15000);

        pendingRequests.current.set(id, {
          resolve: (val) => {
            clearTimeout(timeout);
            resolve(val as SQLRunResult);
          },
          reject: (err) => {
            clearTimeout(timeout);
            reject(err);
          },
        });

        workerRef.current?.postMessage({
          action: "RUN",
          id,
          query,
        });
      });
    },
    [isReady, initWorker]
  );

  const validateSQL = useCallback(
    async (testConfig: { userQuery: string; validationQuery?: string }): Promise<SQLValidationResult> => {
      if (!isReady || !workerRef.current) {
        throw new Error("Base SQL non prête.");
      }

      setIsRunning(true);
      const id = "val_sql_" + Math.random().toString(36).substring(2, 9);

      return new Promise<SQLValidationResult>((resolve, reject) => {
        pendingRequests.current.set(id, {
          resolve: (val) => resolve(val as SQLValidationResult),
          reject,
        });

        workerRef.current?.postMessage({
          action: "VALIDATE",
          id,
          testConfig,
        });
      });
    },
    [isReady]
  );

  const exportTable = useCallback(
    async (tableName: string): Promise<Record<string, SQLCellValue>[]> => {
      if (!isReady || !workerRef.current) {
        throw new Error("Base SQL non prête.");
      }

      const id = "exp_" + Math.random().toString(36).substring(2, 9);

      return new Promise<Record<string, SQLCellValue>[]>((resolve, reject) => {
        pendingRequests.current.set(id, {
          resolve: (val) => resolve(val as Record<string, SQLCellValue>[]),
          reject,
        });

        workerRef.current?.postMessage({
          action: "EXPORT",
          id,
          tableName,
        });
      });
    },
    [isReady]
  );

  const resetDatabase = useCallback(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ action: "RESET" });
    setOutput({
      tables: [],
      executionTimeMs: undefined,
      error: null,
    });
    setValidation(null);
  }, []);

  const resetOutput = useCallback(() => {
    setOutput({
      tables: [],
      executionTimeMs: undefined,
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
    runSQL,
    validateSQL,
    exportTable,
    resetDatabase,
    resetOutput,
  };
}
