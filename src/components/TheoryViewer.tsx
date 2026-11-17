"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  BookOpen,
  CheckSquare,
  Lightbulb,
  Database,
  ChevronDown,
  ChevronRight,
  Layers,
  Table as TableIcon,
  Key,
  Search,
  Code2,
  Check,
} from "lucide-react";
import { Exercise } from "@/types/course";
import { APP_DATABASE_TABLES } from "@/data/datasets";

interface TheoryViewerProps {
  exercise: Exercise;
  onOpenDatasetModal?: (tableName: string) => void;
  onInsertCode?: (codeSnippet: string) => void;
}

export function TheoryViewer({
  exercise,
  onOpenDatasetModal,
  onInsertCode,
}: TheoryViewerProps) {
  const [showHints, setShowHints] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"theory" | "task" | "database">("theory");
  const [selectedTable, setSelectedTable] = useState<string>("assures");
  const [viewMode, setViewMode] = useState<"data" | "schema">("data");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [copiedTable, setCopiedTable] = useState<boolean>(false);

  const currentDataset =
    APP_DATABASE_TABLES.find((t) => t.tableName === selectedTable || t.name === selectedTable) ||
    APP_DATABASE_TABLES[0];

  const handleCopyTableName = (name: string) => {
    navigator.clipboard?.writeText(name);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 1500);
  };

  // Filter rows based on search
  const filteredRows = (currentDataset.sampleRows || []).filter((row) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(query)
    );
  });

  // Filter columns based on search
  const filteredColumns = currentDataset.columns.filter((col) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      col.name.toLowerCase().includes(query) ||
      col.description.toLowerCase().includes(query) ||
      col.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-stone-50/80 border-b border-stone-200 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200/50 flex-shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">{exercise.title}</h2>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-stone-500 mt-0.5 flex-wrap">
              <span className="text-sky-700 font-medium capitalize">
                {exercise.category.replace("_", " ")}
              </span>
              <span>•</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  exercise.difficulty === "Débutant"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : exercise.difficulty === "Intermédiaire"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {exercise.difficulty}
              </span>
              <span>•</span>
              <span>{exercise.durationMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Tab switch inside Theory */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200/80 flex-shrink-0">
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "theory"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Théorie
          </button>
          <button
            onClick={() => setActiveTab("task")}
            className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "task"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Consignes
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "database"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-sky-700 hover:bg-sky-50"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === "database"
                  ? "bg-sky-700 text-white"
                  : "bg-sky-100 text-sky-800"
              }`}
            >
              {APP_DATABASE_TABLES.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 md:p-4 lg:p-5 space-y-4 text-stone-700 leading-relaxed text-sm min-w-0">
        {activeTab === "theory" && (
          <div className="prose prose-stone prose-sm w-full max-w-full break-words min-w-0 prose-headings:text-stone-900 prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-stone-700 prose-code:text-sky-800 prose-code:bg-stone-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:not-italic prose-blockquote:before:content-none prose-blockquote:after:content-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[[rehypeKatex, { output: "html", throwOnError: false }]]}
            >
              {exercise.theoryMarkdown}
            </ReactMarkdown>
          </div>
        )}

        {activeTab === "task" && (
          <div className="space-y-4 min-w-0">
            <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/70 flex items-start gap-3">
              <CheckSquare className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-sky-900 leading-relaxed font-medium">
                {exercise.description}
              </div>
            </div>

            <div className="prose prose-stone prose-sm w-full max-w-full break-words min-w-0 prose-headings:text-stone-900 prose-p:text-stone-700 prose-blockquote:not-italic prose-blockquote:before:content-none prose-blockquote:after:content-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[[rehypeKatex, { output: "html", throwOnError: false }]]}
              >
                {exercise.taskMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Database Explorer Tab */}
        {activeTab === "database" && (
          <div className="space-y-4 text-xs">
            {/* Table Selector Pills */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {APP_DATABASE_TABLES.map((t) => {
                  const tName = t.tableName || t.name;
                  const isSelected = selectedTable === tName;
                  return (
                    <button
                      key={tName}
                      onClick={() => {
                        setSelectedTable(tName);
                        setSearchFilter("");
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs font-semibold"
                          : "bg-stone-100/70 text-stone-600 hover:bg-stone-200/60 border border-transparent"
                      }`}
                    >
                      <TableIcon className="w-3.5 h-3.5 text-sky-600" />
                      <span>{tName}</span>
                      <span className="text-[10px] text-stone-400 font-sans">
                        ({t.sampleRows?.length || 0})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle (Data vs Schema) */}
              <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
                <button
                  onClick={() => setViewMode("data")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === "data"
                      ? "bg-white text-stone-900 shadow-2xs font-semibold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Données ({currentDataset.sampleRows?.length || 0})
                </button>
                <button
                  onClick={() => setViewMode("schema")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === "schema"
                      ? "bg-white text-stone-900 shadow-2xs font-semibold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Colonnes ({currentDataset.columns.length})
                </button>
              </div>
            </div>

            {/* Table Details Header & Quick Actions */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {currentDataset.tableName || currentDataset.name}
                  </span>
                  <button
                    onClick={() => handleCopyTableName(currentDataset.tableName || currentDataset.name)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                    title="Copier le nom de la table"
                  >
                    {copiedTable ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Layers className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {onInsertCode && (
                    <button
                      onClick={() =>
                        onInsertCode(
                          `SELECT * FROM ${currentDataset.tableName || currentDataset.name} LIMIT 10;\n`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-[11px] font-mono transition-colors shadow-2xs cursor-pointer"
                      title="Insérer 'SELECT *' dans l'éditeur"
                    >
                      <Code2 className="w-3 h-3 text-sky-600" />
                      <span>SELECT * LIMIT 10</span>
                    </button>
                  )}
                  {onOpenDatasetModal && (
                    <button
                      onClick={() => onOpenDatasetModal(currentDataset.tableName || currentDataset.name)}
                      className="text-[11px] text-sky-700 hover:underline"
                    >
                      Agrandir
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-normal">
                {currentDataset.description}
              </p>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder={`Rechercher dans la table ${currentDataset.tableName}...`}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-400 transition-colors"
              />
            </div>

            {/* View Mode: DATA TABLE */}
            {viewMode === "data" && (
              <div className="rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="max-h-[360px] overflow-auto">
                  <table className="w-full border-collapse text-left text-xs font-mono">
                    <thead className="bg-stone-100/90 text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                      <tr>
                        <th className="py-2 px-2.5 text-center text-[10px] text-stone-400 font-sans border-r border-stone-200 w-10">
                          #
                        </th>
                        {currentDataset.columns.map((col) => (
                          <th
                            key={col.name}
                            className="py-2 px-3 whitespace-nowrap text-[11px] font-semibold text-stone-800 border-r border-stone-200/50"
                          >
                            <div className="flex items-center gap-1">
                              {col.type.includes("PK") && (
                                <Key className="w-3 h-3 text-amber-500" />
                              )}
                              <span>{col.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {filteredRows.length > 0 ? (
                        filteredRows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-sky-50/40 transition-colors"
                          >
                            <td className="py-1.5 px-2.5 text-center text-[10px] text-stone-400 bg-stone-50/50 border-r border-stone-200 select-none">
                              {rIdx + 1}
                            </td>
                            {currentDataset.columns.map((col) => {
                              const val = row[col.name];
                              const isNull = val === null || val === undefined;
                              const isNum = typeof val === "number";
                              return (
                                <td
                                  key={col.name}
                                  className={`py-1.5 px-3 whitespace-nowrap border-r border-stone-100 ${
                                    isNull
                                      ? "text-stone-300 italic text-[11px]"
                                      : isNum
                                      ? "text-sky-900 font-medium"
                                      : "text-stone-700"
                                  }`}
                                >
                                  {isNull ? "NULL" : String(val)}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={currentDataset.columns.length + 1}
                            className="py-6 text-center text-stone-400 font-sans italic"
                          >
                            Aucune ligne trouvée pour &quot;{searchFilter}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View Mode: SCHEMA / DICTIONNAIRE */}
            {viewMode === "schema" && (
              <div className="rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Colonne</th>
                      <th className="py-2.5 px-3">Type SQL</th>
                      <th className="py-2.5 px-3">Description métier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {filteredColumns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-2 px-3 text-stone-900 font-medium flex items-center gap-1.5">
                          {col.type.includes("PK") && (
                            <Key className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          )}
                          <span>{col.name}</span>
                        </td>
                        <td className="py-2 px-3 text-sky-700 whitespace-nowrap">
                          {col.type}
                        </td>
                        <td className="py-2 px-3 text-stone-600 font-sans">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Hints Accordion */}
        {exercise.hints && exercise.hints.length > 0 && activeTab !== "database" && (
          <div className="mt-6 pt-4 border-t border-stone-200">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/80 text-xs font-medium text-amber-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Indices de résolution ({exercise.hints.length})</span>
              </div>
              {showHints ? (
                <ChevronDown className="w-4 h-4 text-amber-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-amber-600" />
              )}
            </button>

            {showHints && (
              <div className="mt-2 p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 space-y-2">
                {exercise.hints.map((hint, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-stone-700 leading-normal">
                    <span className="font-mono text-amber-700 font-bold">{i + 1}.</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
