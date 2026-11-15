"use client";

import React, { useState } from "react";
import { Terminal, Image as ImageIcon, Table as TableIcon, CheckCircle2, AlertCircle, Download, Trash2, Maximize2 } from "lucide-react";
import { SQLTableResult } from "@/hooks/useSQL";

interface ResultsViewerProps {
  language: "python" | "sql";
  stdout?: string;
  stderr?: string;
  plots?: string[];
  tables?: SQLTableResult[];
  executionTimeMs?: string;
  validation?: { passed: boolean; message: string } | null;
  isRunning?: boolean;
  onClear?: () => void;
}

export function ResultsViewer({
  stdout = "",
  stderr = "",
  plots = [],
  tables = [],
  executionTimeMs,
  validation,
  isRunning = false,
  onClear,
}: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState<"console" | "plots" | "tables" | "validation">("console");
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);

  // Auto-switch tabs if new plots or tables arrive
  React.useEffect(() => {
    if (plots && plots.length > 0) {
      setActiveTab("plots");
    } else if (tables && tables.length > 0) {
      setActiveTab("tables");
    } else if (validation) {
      setActiveTab("validation");
    }
  }, [plots, tables, validation]);

  const hasPlots = plots && plots.length > 0;
  const hasTables = tables && tables.length > 0;

  return (
    <div className="flex flex-col h-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-stone-50/70 border-b border-stone-200 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Console Tab */}
          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "console"
                ? "bg-white text-stone-900 border border-stone-300 shadow-2xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-stone-600" />
            <span>Console</span>
            {(stdout || stderr) && (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            )}
          </button>

          {/* Visualisations Tab (Python) */}
          <button
            onClick={() => setActiveTab("plots")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "plots"
                ? "bg-white text-stone-900 border border-stone-300 shadow-2xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
            <span>Graphiques</span>
            {hasPlots && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                {plots.length}
              </span>
            )}
          </button>

          {/* Tables Tab (SQL or DataFrames) */}
          <button
            onClick={() => setActiveTab("tables")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "tables"
                ? "bg-white text-stone-900 border border-stone-300 shadow-2xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-stone-600" />
            <span>Données</span>
            {hasTables && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                {tables[0]?.rowCount || 0}
              </span>
            )}
          </button>

          {/* Validation Tab */}
          {validation && (
            <button
              onClick={() => setActiveTab("validation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "validation"
                  ? "bg-white text-stone-900 border border-stone-300 shadow-2xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {validation.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span>Validation</span>
            </button>
          )}
        </div>

        {/* Clear & Duration info */}
        <div className="flex items-center gap-2">
          {executionTimeMs && (
            <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
              {executionTimeMs} ms
            </span>
          )}
          {onClear && (
            <button
              onClick={onClear}
              title="Effacer les résultats"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Viewport */}
      <div className="flex-1 overflow-auto p-4 relative font-mono text-xs">
        {/* Loading Indicator */}
        {isRunning && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-2.5">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-800 border-t-transparent" />
            <p className="text-xs text-stone-700 font-mono">Calcul WebAssembly en cours...</p>
          </div>
        )}

        {/* Console View */}
        {activeTab === "console" && (
          <div className="space-y-3">
            {stdout ? (
              <pre className="whitespace-pre-wrap font-mono text-stone-800 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                {stdout}
              </pre>
            ) : null}

            {stderr ? (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-mono whitespace-pre-wrap">
                <div className="flex items-center gap-2 font-semibold mb-1 text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Erreur d&apos;exécution</span>
                </div>
                {stderr}
              </div>
            ) : null}

            {!stdout && !stderr && !isRunning && (
              <div className="flex flex-col items-center justify-center h-36 text-stone-400 space-y-2">
                <Terminal className="w-7 h-7 stroke-1" />
                <p className="text-xs">Aucune sortie. Cliquez sur &quot;Exécuter&quot; (⌘+Entrée).</p>
              </div>
            )}
          </div>
        )}

        {/* Visualisations / Matplotlib Plots */}
        {activeTab === "plots" && (
          <div className="space-y-4">
            {hasPlots ? (
              plots.map((plotUrl, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 rounded-xl border border-stone-200 p-2 overflow-hidden shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 px-2 text-[11px] text-stone-600 font-sans border-b border-stone-200 mb-2">
                    <span className="font-semibold text-stone-800">Figure Matplotlib #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={plotUrl}
                        download={`quantecon-plot-${idx + 1}.png`}
                        className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
                        title="Télécharger l'image PNG"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </a>
                      <button
                        onClick={() => setSelectedPlot(plotUrl)}
                        className="p-1 hover:text-stone-900"
                        title="Agrandir"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plotUrl}
                    alt={`Plot ${idx + 1}`}
                    className="w-full h-auto rounded-lg object-contain bg-white border border-stone-100"
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-36 text-stone-400 space-y-2">
                <ImageIcon className="w-7 h-7 stroke-1" />
                <p className="text-xs">Aucun graphique généré. Utilisez plt.show() dans votre script Python.</p>
              </div>
            )}
          </div>
        )}

        {/* Tables / Datasets View */}
        {activeTab === "tables" && (
          <div className="space-y-4">
            {hasTables ? (
              tables.map((table, tIdx) => (
                <div key={tIdx} className="space-y-2">
                  <div className="flex items-center justify-between text-stone-500 text-[11px] font-sans">
                    <span className="font-semibold text-stone-700">
                      Résultat SQL ({table.rowCount} lignes)
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-2xs">
                    <table className="w-full border-collapse text-left text-stone-800">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                          {table.columns.map((col, cIdx) => (
                            <th key={cIdx} className="px-3 py-2 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                        {table.values.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-50/70 transition-colors">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 whitespace-nowrap text-stone-700">
                                {val === null ? (
                                  <span className="text-stone-400 italic">NULL</span>
                                ) : typeof val === "number" ? (
                                  <span className="text-emerald-700 font-medium">{val}</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-36 text-stone-400 space-y-2">
                <TableIcon className="w-7 h-7 stroke-1" />
                <p className="text-xs">Aucune table à afficher pour cette requête.</p>
              </div>
            )}
          </div>
        )}

        {/* Validation View */}
        {activeTab === "validation" && validation && (
          <div className="p-2 space-y-3">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                validation.passed
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-rose-50/80 border-rose-300 text-rose-950"
              }`}
            >
              {validation.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-semibold font-sans text-sm">
                  {validation.passed ? "Exercice Validé avec Succès !" : "Échec des Tests"}
                </h3>
                <p className="text-xs leading-relaxed font-sans text-stone-700">{validation.message}</p>
                {validation.passed && (
                  <p className="text-[11px] font-sans text-emerald-700 font-medium pt-1">
                    ✓ Le bouton &quot;Suivant&quot; est débloqué pour passer à l&apos;exercice suivant !
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Zooming Plots */}
      {selectedPlot && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPlot(null)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-white p-4 rounded-2xl border border-stone-200 shadow-xl relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedPlot} alt="Plot zoomed" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <p className="text-center text-xs text-stone-500 mt-2.5 font-sans">
              Cliquez pour fermer
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
