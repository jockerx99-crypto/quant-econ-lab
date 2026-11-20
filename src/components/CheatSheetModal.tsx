"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  X,
  BookMarked,
  Search,
  Copy,
  Check,
  Code2,
  Database,
  Sparkles,
  Hash,
  Table2,
} from "lucide-react";
import {
  MODULE_CHEAT_SHEETS,
  ModuleCheatSheet,
  resolveCheatSheetModuleId,
} from "@/data/cheatsheets";
import { Language } from "@/types/course";

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModuleId: string;
  currentLanguage: Language;
  onInsertCode?: (code: string) => void;
}

function MarkdownMath({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { output: "html", throwOnError: false }]]}
        components={{
          p: ({ children }) => <p className="m-0 leading-relaxed">{children}</p>,
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 mx-0.5 rounded bg-stone-100 border border-stone-200/80 text-stone-800 font-mono text-[11px] font-medium">
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function CheatSheetModal({
  isOpen,
  onClose,
  activeModuleId,
  currentLanguage,
  onInsertCode,
}: CheatSheetModalProps) {
  const resolvedActiveModuleId = resolveCheatSheetModuleId(activeModuleId);

  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    resolvedActiveModuleId || MODULE_CHEAT_SHEETS[0].moduleId
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync with currently active workspace module whenever modal opens
  useEffect(() => {
    if (isOpen && resolvedActiveModuleId) {
      setSelectedModuleId(resolvedActiveModuleId);
      setSearchQuery("");
    }
  }, [isOpen, resolvedActiveModuleId]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const activeSheet: ModuleCheatSheet = useMemo(() => {
    return (
      MODULE_CHEAT_SHEETS.find((m) => m.moduleId === selectedModuleId) ||
      MODULE_CHEAT_SHEETS[0]
    );
  }, [selectedModuleId]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeSheet.sections;

    return activeSheet.sections
      .map((sec) => {
        const secMatches =
          sec.title.toLowerCase().includes(q) ||
          sec.subtitle.toLowerCase().includes(q);
        const entries = secMatches
          ? sec.entries
          : sec.entries.filter((ent) => {
              const haystack = [
                ent.title,
                ent.exerciseRef,
                ent.syntax || "",
                ent.formula || "",
                ent.description,
                ent.exampleCode,
                ...ent.tags,
              ]
                .join(" ")
                .toLowerCase();
              return haystack.includes(q);
            });
        return { ...sec, entries };
      })
      .filter((sec) => sec.entries.length > 0);
  }, [activeSheet, searchQuery]);

  const totalEntriesCount = useMemo(
    () => filteredSections.reduce((acc, s) => acc + s.entries.length, 0),
    [filteredSections]
  );

  if (!isOpen) return null;

  const canInsertInEditor =
    Boolean(onInsertCode) && activeSheet.language === currentLanguage;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 1600);
    } catch {
      // Fallback ignored if clipboard is restricted
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`cheatsheet-sec-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/45 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cheat Sheet des modules"
        className="bg-white border border-stone-200 rounded-2xl w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-stone-50 border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
              <BookMarked className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-semibold text-stone-900 truncate">
                  Cheat Sheet & Formules Clés
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                    activeSheet.language === "sql"
                      ? "bg-sky-100 text-sky-800 border border-sky-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {activeSheet.language === "sql" ? (
                    <Database className="w-2.5 h-2.5" />
                  ) : (
                    <Code2 className="w-2.5 h-2.5" />
                  )}
                  {activeSheet.version} · M{activeSheet.moduleNumber} ·{" "}
                  {activeSheet.language === "sql" ? "SQL" : "Python"}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate hidden sm:block">
                {activeSheet.title} — référence rapide des formules, syntaxes et exemples du module
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la Cheat Sheet"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Switcher + Search Row */}
        <div className="px-4 sm:px-5 py-2.5 bg-stone-100/60 border-b border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 flex-shrink-0">
          {/* Module Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 no-scrollbar">
            {MODULE_CHEAT_SHEETS.map((mod) => {
              const isSelected = mod.moduleId === activeSheet.moduleId;
              const isCurrent = mod.moduleId === resolvedActiveModuleId;
              return (
                <button
                  key={mod.moduleId}
                  onClick={() => {
                    setSelectedModuleId(mod.moduleId);
                    scrollContainerRef.current?.scrollTo({ top: 0 });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? "bg-white text-stone-900 border border-stone-300 shadow-xs font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-white/60 border border-transparent"
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      mod.version === "V1"
                        ? "bg-stone-200/80 text-stone-700"
                        : mod.version === "V2"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {mod.version} M{mod.moduleNumber}
                  </span>
                  <span>
                    {mod.language === "sql" ? "SQL" : "Python"}
                  </span>
                  {isCurrent && (
                    <span
                      title="Module actif dans l'espace de travail"
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-64 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer formule, fonction, mot-clé..."
              className="w-full pl-8 pr-8 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Effacer la recherche"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Body: Optional Section Navigation Sidebar + Main Scroll Area */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left Quick Index (visible on md+) */}
          <aside className="hidden md:flex w-60 flex-col border-r border-stone-200 bg-stone-50/70 p-3 overflow-y-auto flex-shrink-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 px-2 mb-2">
              Sommaire du module
            </div>
            <div className="space-y-1">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-stone-700 hover:bg-white hover:text-stone-900 hover:shadow-2xs border border-transparent hover:border-stone-200/80 transition-all cursor-pointer"
                >
                  <div className="font-medium leading-snug">{sec.title}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {sec.entries.length} fiche{sec.entries.length > 1 ? "s" : ""}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-4 px-2 text-[11px] text-stone-500 border-t border-stone-200/70">
              <div className="flex items-center gap-1.5 font-medium text-stone-700 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Astuce rapide
              </div>
              {canInsertInEditor ? (
                <span>
                  Cliquez sur <strong>Insérer</strong> sur n&apos;importe quel exemple pour le tester immédiatement dans votre éditeur.
                </span>
              ) : (
                <span>
                  Vous consultez un module {activeSheet.language.toUpperCase()} alors que l&apos;exercice ouvert est en {currentLanguage.toUpperCase()}. Utilisez <strong>Copier</strong>.
                </span>
              )}
            </div>
          </aside>

          {/* Main Content Scrollable Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
          >
            {/* Mobile Section Quick Pills */}
            {filteredSections.length > 1 && (
              <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-medium whitespace-nowrap cursor-pointer"
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            )}

            {/* Module Overview + Datasets / Libraries Box */}
            {!searchQuery && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-stone-900">
                    {activeSheet.title}
                  </h3>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {totalEntriesCount} fiches de référence
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activeSheet.overview}
                </p>
                <div className="pt-2 border-t border-stone-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    <Table2 className="w-3.5 h-3.5 text-sky-600" />
                    {activeSheet.language === "sql"
                      ? "Tables & Colonnes disponibles"
                      : "Variables & Librairies du module"}
                  </div>
                  <ul className="space-y-1">
                    {activeSheet.datasetsSummary.map((line, i) => {
                      const [head, ...rest] = line.split(" : ");
                      return (
                        <li
                          key={i}
                          className="text-[11px] sm:text-xs text-stone-700 font-mono bg-white border border-stone-200/80 rounded-lg px-2.5 py-1.5 whitespace-normal break-words leading-relaxed"
                        >
                          <span className="font-semibold text-sky-800">
                            {head}
                          </span>
                          {rest.length > 0 && (
                            <span className="text-stone-600">
                              {" : "}
                              {rest.join(" : ")}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Empty Search State */}
            {filteredSections.length === 0 && (
              <div className="text-center py-12 px-4 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <div className="text-sm font-medium text-stone-700">
                  Aucune formule trouvée pour « {searchQuery} »
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Essayez un autre mot-clé (ex.{" "}
                  {activeSheet.language === "sql"
                    ? "COALESCE, LEFT JOIN, LAG, S/P"
                    : "OLS, VaR, Cholesky, VIF"}
                  ) ou changez de module ci-dessus.
                </p>
              </div>
            )}

            {/* Sections & Cards */}
            {filteredSections.map((section) => (
              <section
                key={section.id}
                id={`cheatsheet-sec-${section.id}`}
                className="space-y-3 scroll-mt-4"
              >
                <div className="border-b border-stone-200 pb-2">
                  <h3 className="text-sm font-bold text-stone-900">
                    {section.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {section.subtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  {section.entries.map((entry) => {
                    const isCopied = copiedId === entry.id;
                    return (
                      <article
                        key={entry.id}
                        className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-stone-300 transition-colors space-y-3"
                      >
                        {/* Entry Header */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-stone-900">
                                {entry.title}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-medium">
                                <Hash className="w-2.5 h-2.5 text-stone-400" />
                                {entry.exerciseRef}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleCopy(entry.id, entry.exampleCode)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700">Copié</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>

                            {canInsertInEditor && onInsertCode && (
                              <button
                                onClick={() => {
                                  onInsertCode(entry.exampleCode);
                                  onClose();
                                }}
                                title="Charger cet exemple dans l'éditeur"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-colors cursor-pointer"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Insérer</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Signature / Quick Syntax */}
                        {entry.syntax && (
                          <div className="font-mono text-[11px] text-stone-800 bg-stone-50 border border-stone-200/80 rounded-lg px-3 py-1.5 whitespace-normal break-words leading-relaxed">
                            {entry.syntax}
                          </div>
                        )}

                        {/* Mathematical Formula (KaTeX) */}
                        {entry.formula && (
                          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl px-4 py-2.5 text-stone-900 overflow-x-auto">
                            <MarkdownMath
                              content={entry.formula}
                              className="text-sm text-stone-900"
                            />
                          </div>
                        )}

                        {/* Explanation */}
                        <MarkdownMath
                          content={entry.description}
                          className="text-xs text-stone-600 leading-relaxed"
                        />

                        {/* Concrete Example Code */}
                        <pre className="m-0 bg-stone-100 text-stone-900 rounded-xl px-3.5 py-2.5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto border border-stone-200">
                          <code>{entry.exampleCode}</code>
                        </pre>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
