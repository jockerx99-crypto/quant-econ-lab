"use client";

import React, { useState } from "react";
import {
  X,
  Code2,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Info,
  Terminal,
} from "lucide-react";
import { Exercise } from "@/types/course";

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
  onApplySolution?: () => void;
}

export function SolutionModal({ isOpen, onClose, exercise, onApplySolution }: SolutionModalProps) {
  const [activeTab, setActiveTab] = useState<"code" | "explanation">("code");

  if (!isOpen) return null;

  // Split lines for line numbers
  const codeLines = exercise.solutionCode.split("\n");

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="solution-modal-title"
    >
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Fenêtre Pop-up de Corrigé
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    exercise.language === "python"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-sky-100 text-sky-900 border border-sky-200"
                  }`}
                >
                  {exercise.language === "python" ? "Python 3.12" : "SQL (SQLite)"}
                </span>
              </div>
              <h2
                id="solution-modal-title"
                className="text-sm sm:text-base font-semibold text-stone-900 mt-0.5 line-clamp-1"
              >
                {exercise.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Solution Information Banner */}
        <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <span className="font-semibold text-amber-900">
              Solution &amp; Démarche :
            </span>{" "}
            Le code ci-dessous correspond à la solution validée de l&apos;exercice.
            Vous pouvez l&apos;étudier avec les explications théoriques associées, ou l&apos;insérer directement dans l&apos;éditeur Monaco pour l&apos;exécuter.
          </div>
        </div>

        {/* Tabs switcher: Code solution vs Explication */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "code"
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Code de la Solution</span>
            </button>
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "explanation"
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explication & Démarche</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-stone-500">
            {codeLines.length} ligne{codeLines.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "code" ? (
            <div>
              {/* Code Container with line numbers */}
              <div className="rounded-xl border border-stone-200 bg-stone-900 text-stone-100 shadow-inner overflow-hidden">
                <div className="px-4 py-2 bg-stone-800/80 border-b border-stone-700/60 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {exercise.language === "python"
                        ? "solution.py"
                        : "requete_solution.sql"}
                    </span>
                  </div>
                  <span className="text-stone-400 text-[10px]">Lecture seule</span>
                </div>

                <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed select-text">
                  <table className="border-collapse w-full">
                    <tbody>
                      {codeLines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-stone-800/50">
                          <td className="pr-4 py-0.5 text-right text-stone-500 select-none w-8 text-[11px] font-mono border-r border-stone-800">
                            {idx + 1}
                          </td>
                          <td className="pl-4 py-0.5 whitespace-pre font-mono text-stone-100 text-xs">
                            {line || " "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hints Box */}
              {exercise.hints && exercise.hints.length > 0 && (
                <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Points clés à retenir :</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                    {exercise.hints.map((hint, i) => (
                      <li key={i} className="leading-relaxed">
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-900">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Objectif pédagogique</span>
                </div>
                <p className="text-sky-900/90">{exercise.description}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="font-semibold text-stone-900 text-xs">
                  Analyse de la solution & Justification :
                </h4>
                <div className="text-xs text-stone-600 space-y-2">
                  <p>
                    1. <strong>Structure du code</strong> : La solution résout
                    directement la contrainte demandée en respectant les bonnes
                    pratiques d&apos;écriture ({exercise.language === "python" ? "PEP 8 et vectorisation NumPy/Pandas" : "ANSI SQL et optimisation du plan de requête"}).
                  </p>
                  <p>
                    2. <strong>Validation automatique</strong> : Après avoir
                    recopié ce code dans l&apos;éditeur, cliquez sur le bouton{" "}
                    <strong>&quot;Tester le code&quot;</strong>. Le banc de test
                    vérifiera les résultats calculés et débloquera
                    l&apos;exercice suivant du curriculum.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-200 flex items-center justify-between gap-3">
          <p className="text-[11px] text-stone-500 hidden sm:block">
            Examinez la démarche, puis testez le code dans l&apos;éditeur.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onApplySolution?.();
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-400 active:scale-95 border border-amber-400 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Insérer dans l&apos;éditeur</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
