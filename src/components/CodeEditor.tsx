"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, CheckCircle, Terminal, HelpCircle, Code2 } from "lucide-react";
import { Language } from "@/types/course";

// Dynamic import of Monaco Editor with SSR disabled
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-stone-50 text-stone-400 font-mono text-xs">
      <div className="flex items-center gap-2.5">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-400 border-t-transparent" />
        Initialisation de Monaco Editor...
      </div>
    </div>
  ),
});

/**
 * Returns generic placeholder comment for empty editor state
 */
export function getDefaultEditorCode(language: Language): string {
  return language === "python"
    ? "# Écris ton code Python ici\n"
    : "-- Écris ta requête SQL ici\n";
}

interface CodeEditorProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onValidate: () => void;
  onReset: () => void;
  onRequestShowSolution?: () => void;
  isRunning: boolean;
  isReady: boolean;
  statusMessage?: string;
}

export function CodeEditor({
  language,
  code,
  onChange,
  onRun,
  onValidate,
  onReset,
  onRequestShowSolution,
  isRunning,
  isReady,
  statusMessage,
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState<number>(13);

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    // Cmd + Enter (macOS) or Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isRunning && isReady) {
        onRun();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50/70 border-b border-stone-200 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                language === "python"
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-sky-50 text-sky-800 border border-sky-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              {language === "python" ? "Python 3.12 (Pyodide)" : "SQLite (sql.js)"}
            </span>
          </div>

          <span className="hidden sm:inline-flex text-[11px] text-stone-400 font-mono">
            ⌘ + Entrée pour exécuter
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onRequestShowSolution && (
            <button
              onClick={onRequestShowSolution}
              title="Voir la solution (insérer le code de secours)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-lg transition-colors border border-stone-200 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Voir la solution</span>
            </button>
          )}

          <button
            onClick={onReset}
            title="Réinitialiser l'éditeur"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Validate / Test Button */}
          <button
            onClick={onValidate}
            disabled={isRunning || !isReady}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 active:scale-95 border border-emerald-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tester le code</span>
          </button>

          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning || !isReady}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 active:scale-95 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            {isRunning ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Calcul...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Exécuter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Container */}
      <div className="flex-1 w-full min-h-[220px] relative bg-white" onKeyDown={handleEditorKeyDown}>
        <MonacoEditor
          height="100%"
          language={language === "python" ? "python" : "sql"}
          theme="vs"
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            fontSize,
            fontFamily: "var(--font-geist-mono), 'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
            lineNumbersMinChars: 3,
            renderLineHighlight: "all",
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true,
          }}
        />

        {/* Runtime Status Toast at bottom if loading */}
        {!isReady && (
          <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-xs border border-stone-200 rounded-xl p-2.5 flex items-center gap-3 text-xs text-stone-600 shadow-md">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent flex-shrink-0" />
            <div className="truncate">{statusMessage || "Initialisation de l'environnement WASM..."}</div>
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 font-mono">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-sky-600" />
          <span>WASM Web Worker (Thread isolé)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline">UTF-8</span>
          <button
            onClick={() => setFontSize((s) => (s > 11 ? s - 1 : s))}
            className="hover:text-stone-800"
            title="Réduire taille"
          >
            A-
          </button>
          <span>{fontSize}px</span>
          <button
            onClick={() => setFontSize((s) => (s < 18 ? s + 1 : s))}
            className="hover:text-stone-800"
            title="Agrandir taille"
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}
