"use client";

import React, { useState } from "react";
import { X, Database, Table, Key } from "lucide-react";
import { ExerciseDataset } from "@/types/course";
import { APP_DATABASE_TABLES } from "@/data/datasets";

interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasets?: ExerciseDataset[];
  initialTableName?: string;
}

export function DatasetModal({
  isOpen,
  onClose,
  datasets,
  initialTableName,
}: DatasetModalProps) {
  const availableDatasets =
    datasets && datasets.length > 0 ? datasets : APP_DATABASE_TABLES;

  const [activeTable, setActiveTable] = useState<string>(
    initialTableName ||
      availableDatasets[0]?.tableName ||
      availableDatasets[0]?.name ||
      "assures"
  );
  const [modalViewMode, setModalViewMode] = useState<"data" | "schema">("data");

  if (!isOpen) return null;

  const currentDataset =
    availableDatasets.find(
      (d) => (d.tableName || d.name) === activeTable
    ) || availableDatasets[0];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <Database className="w-4 h-4" />
            </div>
            <span>Explorateur de Base de Données (SQLite WASM)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex items-center justify-between gap-2 px-5 py-2.5 bg-stone-100/50 border-b border-stone-200 overflow-x-auto">
          <div className="flex items-center gap-2">
            {availableDatasets.map((ds) => {
              const tName = ds.tableName || ds.name;
              return (
                <button
                  key={tName}
                  onClick={() => setActiveTable(tName)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                    activeTable === tName
                      ? "bg-white text-stone-900 border border-stone-300 shadow-xs font-semibold"
                      : "text-stone-500 hover:text-stone-800 bg-transparent border border-transparent"
                  }`}
                >
                  <Table className="w-3.5 h-3.5 text-sky-500" />
                  <span>{tName}</span>
                  <span className="text-[10px] text-stone-400 font-sans">
                    ({ds.sampleRows?.length || 0})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg text-[11px]">
            <button
              onClick={() => setModalViewMode("data")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                modalViewMode === "data"
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Lignes de Données
            </button>
            <button
              onClick={() => setModalViewMode("schema")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                modalViewMode === "schema"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Schéma des Colonnes
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-600 flex-1">
          {currentDataset && (
            <>
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-0.5 font-mono">
                  Table : {currentDataset.tableName || currentDataset.name}
                </h4>
                <p className="text-stone-500 text-xs">{currentDataset.description}</p>
              </div>

              {/* View Mode: DATA */}
              {modalViewMode === "data" && currentDataset.sampleRows && (
                <div className="rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                  <div className="max-h-[460px] overflow-auto">
                    <table className="w-full border-collapse text-left text-xs font-mono">
                      <thead className="bg-stone-50 text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-3 text-center text-[10px] text-stone-400 font-sans border-r border-stone-200 w-10">
                            #
                          </th>
                          {currentDataset.columns.map((col) => (
                            <th
                              key={col.name}
                              className="py-2.5 px-3 whitespace-nowrap text-[11px] font-semibold text-stone-800 border-r border-stone-200/50"
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
                        {currentDataset.sampleRows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-stone-50/70 transition-colors"
                          >
                            <td className="py-2 px-3 text-center text-[10px] text-stone-400 bg-stone-50/50 border-r border-stone-200 select-none">
                              {rIdx + 1}
                            </td>
                            {currentDataset.columns.map((col) => {
                              const val = row[col.name];
                              const isNull = val === null || val === undefined;
                              const isNum = typeof val === "number";
                              return (
                                <td
                                  key={col.name}
                                  className={`py-2 px-3 whitespace-nowrap border-r border-stone-100 ${
                                    isNull
                                      ? "text-stone-300 italic"
                                      : isNum
                                      ? "text-sky-900 font-medium"
                                      : "text-stone-800"
                                  }`}
                                >
                                  {isNull ? "NULL" : String(val)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View Mode: SCHEMA */}
              {modalViewMode === "schema" && (
                <div className="rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200 text-[11px]">
                        <th className="py-2.5 px-3">Colonne</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                      {currentDataset.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-2 px-3 text-stone-900 font-medium flex items-center gap-1.5">
                            {col.type.includes("PK") && (
                              <Key className="w-3 h-3 text-amber-500" />
                            )}
                            <span>{col.name}</span>
                          </td>
                          <td className="py-2 px-3 text-sky-700">{col.type}</td>
                          <td className="py-2 px-3 text-stone-600 font-sans">
                            {col.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
