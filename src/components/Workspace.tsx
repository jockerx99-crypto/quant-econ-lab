"use client";

import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  BookOpen,
  BookMarked,
  Code2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { COURSE_MODULES as COURSE_MODULES_V1 } from "@/data/courses";
import { COURSE_MODULES_V2 } from "@/data/courses_v2";
import { Exercise, CourseModule } from "@/types/course";
import { usePython } from "@/hooks/usePython";
import { useSQL } from "@/hooks/useSQL";
import { CodeEditor, getDefaultEditorCode } from "@/components/CodeEditor";
import { TheoryViewer } from "@/components/TheoryViewer";
import { ResultsViewer } from "@/components/ResultsViewer";
import { DatasetModal } from "@/components/DatasetModal";
import { SolutionModal } from "@/components/SolutionModal";
import { CheatSheetModal } from "@/components/CheatSheetModal";

const MACRO_CSV_DATA = `periode,euribor_3m,oat_10y,spread_credit_bbb,inflation_hicp,pib_croissance,cac40_rendement
2020-Q1,-0.42,-0.15,1.25,0.70,-5.4,-26.5
2020-Q2,-0.38,-0.08,1.40,0.30,-11.8,12.3
2020-Q3,-0.48,-0.22,1.10,0.20,18.2,-2.7
2020-Q4,-0.52,-0.34,0.95,-0.30,-1.4,15.6
2021-Q1,-0.54,-0.12,0.88,1.30,0.5,9.3
2021-Q2,-0.54,0.14,0.82,1.90,1.2,7.2
2021-Q3,-0.55,0.02,0.85,3.40,3.3,0.4
2021-Q4,-0.57,0.20,0.90,5.00,0.6,9.7
2022-Q1,-0.50,0.89,1.15,7.40,-0.1,-8.7
2022-Q2,-0.18,1.92,1.60,8.60,0.5,-9.5
2022-Q3,0.95,2.71,1.95,9.90,0.3,-2.5
2022-Q4,2.06,3.12,1.80,9.20,0.1,12.2
2023-Q1,2.85,2.95,1.70,6.90,0.2,13.1
2023-Q2,3.40,3.15,1.62,5.50,0.6,1.1
2023-Q3,3.85,3.40,1.55,4.30,-0.1,-4.8
2023-Q4,3.92,3.10,1.48,2.90,0.1,5.7`;

const MARCHE_CSV_DATA = `date,ticker,nom_societe,secteur,prix_ouverture,prix_haut,prix_bas,prix_cloture,volume,rendement_journalier
2024-01-02,TTE,TotalEnergies,Énergie,61.20,62.10,60.90,61.80,2500000,0.0098
2024-01-03,TTE,TotalEnergies,Énergie,61.80,62.50,61.50,62.40,2100000,0.0097
2024-01-04,TTE,TotalEnergies,Énergie,62.40,62.80,61.70,62.00,1900000,-0.0064
2024-01-05,TTE,TotalEnergies,Énergie,62.00,63.10,61.90,63.00,2800000,0.0161
2024-01-08,TTE,TotalEnergies,Énergie,63.00,63.50,62.30,62.60,2200000,-0.0063
2024-01-02,BNP,BNP Paribas,Finance,62.50,63.20,62.00,62.80,3100000,0.0048
2024-01-03,BNP,BNP Paribas,Finance,62.80,63.00,61.90,62.10,2900000,-0.0111
2024-01-04,BNP,BNP Paribas,Finance,62.10,62.90,61.80,62.70,2700000,0.0097
2024-01-05,BNP,BNP Paribas,Finance,62.70,63.80,62.50,63.50,3400000,0.0128
2024-01-08,BNP,BNP Paribas,Finance,63.50,64.10,63.00,63.20,2800000,-0.0047
2024-01-02,MC,LVMH,Luxe,730.0,742.0,728.0,738.0,450000,0.0110
2024-01-03,MC,LVMH,Luxe,738.0,745.0,732.0,735.0,410000,-0.0041
2024-01-04,MC,LVMH,Luxe,735.0,748.0,734.0,744.0,480000,0.0122
2024-01-05,MC,LVMH,Luxe,744.0,755.0,740.0,752.0,520000,0.0108
2024-01-08,MC,LVMH,Luxe,752.0,758.0,746.0,748.0,390000,-0.0053
2024-01-02,AI,Air Liquide,Industrie,175.0,177.5,174.2,176.8,620000,0.0103
2024-01-03,AI,Air Liquide,Industrie,176.8,178.0,175.5,177.2,580000,0.0023
2024-01-04,AI,Air Liquide,Industrie,177.2,178.5,176.0,176.5,540000,-0.0040
2024-01-05,AI,Air Liquide,Industrie,176.5,179.2,176.2,178.9,690000,0.0136
2024-01-08,AI,Air Liquide,Industrie,178.9,180.1,178.2,179.5,490000,0.0034
2024-01-02,CW8,Amundi MSCI World,ETF,445.0,448.2,444.0,447.5,150000,0.0056
2024-01-03,CW8,Amundi MSCI World,ETF,447.5,449.0,446.0,448.1,130000,0.0013
2024-01-04,CW8,Amundi MSCI World,ETF,448.1,451.0,447.8,450.4,170000,0.0051
2024-01-05,CW8,Amundi MSCI World,ETF,450.4,453.5,449.5,452.8,190000,0.0053
2024-01-08,CW8,Amundi MSCI World,ETF,452.8,454.0,451.2,453.2,120000,0.0009`;

const ACTIFS_CSV_DATA = `ticker,nom,secteur,classe_actif,rendement_espere,volatilite,beta_marche,score_esg,ratio_sharpe
TTE,TotalEnergies SE,Énergie,Action,0.085,0.22,0.95,78,0.25
BNP,BNP Paribas SA,Finance,Action,0.092,0.26,1.25,74,0.24
MC,LVMH Moët Hennessy,Luxe,Action,0.115,0.21,1.05,86,0.40
AI,Air Liquide SA,Industrie,Action,0.078,0.16,0.75,92,0.30
CW8,Amundi MSCI World ETF,Diversifié,ETF,0.082,0.15,1.00,80,0.35`;

const TAUX_CSV_DATA = `date,taux_1y,taux_2y,taux_5y,taux_10y,taux_20y,taux_30y
2023-01-31,2.65,2.70,2.68,2.78,3.02,3.05
2023-02-28,3.12,3.20,3.05,3.10,3.28,3.25
2023-03-31,3.25,3.15,2.85,2.88,3.10,3.12
2023-04-30,3.40,3.25,2.90,2.92,3.15,3.18
2023-05-31,3.55,3.32,2.92,2.94,3.12,3.15
2023-06-30,3.75,3.50,3.05,3.08,3.25,3.28
2023-07-31,3.85,3.58,3.10,3.15,3.32,3.35
2023-08-31,3.88,3.52,3.08,3.12,3.30,3.32
2023-09-30,3.95,3.65,3.28,3.42,3.65,3.68
2023-10-31,3.90,3.55,3.20,3.38,3.62,3.64
2023-11-30,3.70,3.22,2.82,3.02,3.28,3.30
2023-12-31,3.45,2.85,2.50,2.55,2.85,2.88`;

export function Workspace() {
  // Hydration guard so SSR and initial client render match 100% (avoids React #418/#423 on ?ex= or localStorage)
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Curriculum Version (V1 = Fondations Actuariat, V2 = Quantitative Finance & Monte Carlo)
  const [curriculumVersion, setCurriculumVersion] = useState<"v1" | "v2">("v1");

  // Track state independently for V1 and V2
  const [moduleIndexV1, setModuleIndexV1] = useState<number>(0);
  const [exerciseIndexV1, setExerciseIndexV1] = useState<number>(13); // Retain Exercise 14 (GROUP BY region)
  const [moduleIndexV2, setModuleIndexV2] = useState<number>(0);
  const [exerciseIndexV2, setExerciseIndexV2] = useState<number>(0);

  const modules: CourseModule[] = curriculumVersion === "v1" ? COURSE_MODULES_V1 : COURSE_MODULES_V2;
  const currentModuleIndex = curriculumVersion === "v1" ? moduleIndexV1 : moduleIndexV2;
  const currentExerciseIndex = curriculumVersion === "v1" ? exerciseIndexV1 : exerciseIndexV2;

  const setCurrentModuleIndex = (idx: number) => {
    if (curriculumVersion === "v1") {
      setModuleIndexV1(idx);
      if (typeof window !== "undefined") localStorage.setItem("quantecon_v1_module_idx", String(idx));
    } else {
      setModuleIndexV2(idx);
      if (typeof window !== "undefined") localStorage.setItem("quantecon_v2_module_idx", String(idx));
    }
  };

  const setCurrentExerciseIndex = (idx: number) => {
    if (curriculumVersion === "v1") {
      setExerciseIndexV1(idx);
      if (typeof window !== "undefined") localStorage.setItem("quantecon_v1_exercise_idx", String(idx));
    } else {
      setExerciseIndexV2(idx);
      if (typeof window !== "undefined") localStorage.setItem("quantecon_v2_exercise_idx", String(idx));
    }
  };

  const handleSwitchVersion = (v: "v1" | "v2") => {
    setCurriculumVersion(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("quantecon_version", v);
    }
  };

  const currentModule: CourseModule = modules[currentModuleIndex] || modules[0];
  const currentExercise: Exercise =
    currentModule.exercises[currentExerciseIndex] || currentModule.exercises[0];

  // Code state: starts empty or with generic comment (never exercise.initialCode)
  const [code, setCode] = useState<string>(() => getDefaultEditorCode(currentExercise.language));

  // Completed exercises tracking (persisted in localStorage after mount)
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(() =>
    COURSE_MODULES_V1[0].exercises.slice(0, 13).map((e) => e.id)
  );

  // Mobile stacked view active tab ('theory' | 'editor' | 'results')
  const [mobileTab, setMobileTab] = useState<"theory" | "editor" | "results">("editor");

  // Solution pop-up modal state
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState<boolean>(false);

  // Dataset modal state
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState<boolean>(false);
  const [selectedDatasetTable, setSelectedDatasetTable] = useState<string>("");

  // Cheat sheet modal state
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);

  // WASM Hooks
  const pythonEngine = usePython();
  const sqlEngine = useSQL();

  // Reset code to generic comment
  const handleResetCode = useCallback(() => {
    setCode(getDefaultEditorCode(currentExercise.language));
  }, [currentExercise.language]);

  // Reveal solution: inject solutionCode directly into Monaco editor AND open the explanation modal
  const handleShowSolution = useCallback(() => {
    const solution = currentExercise.solutionCode || currentExercise.initialCode || "";
    setCode(solution);
    setIsSolutionModalOpen(true);
  }, [currentExercise.solutionCode, currentExercise.initialCode]);

  // Reset code and outputs when exercise changes (reset to empty comment, NOT exercise.initialCode)
  useEffect(() => {
    setCode(getDefaultEditorCode(currentExercise.language));
    pythonEngine.resetOutput();
    sqlEngine.resetOutput();
  }, [currentExerciseIndex, currentModuleIndex, currentExercise.id, currentExercise.language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist current exercise and module to LocalStorage per version
  useEffect(() => {
    if (!hasMounted || typeof window === "undefined") return;
    if (curriculumVersion === "v1") {
      localStorage.setItem("quantecon_v1_exercise_idx", String(currentExerciseIndex));
      localStorage.setItem("quantecon_v1_module_idx", String(currentModuleIndex));
      localStorage.setItem("quantecon_exercise_idx", String(currentExerciseIndex));
      localStorage.setItem("quantecon_module_idx", String(currentModuleIndex));
    } else {
      localStorage.setItem("quantecon_v2_exercise_idx", String(currentExerciseIndex));
      localStorage.setItem("quantecon_v2_module_idx", String(currentModuleIndex));
    }
  }, [hasMounted, currentExerciseIndex, currentModuleIndex, curriculumVersion]);

  // Restore LocalStorage & handle direct URL navigation via ?ex=py-12 on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedCompleted = localStorage.getItem("quantecon_completed_ids");
      if (savedCompleted) setCompletedExerciseIds(JSON.parse(savedCompleted));
    } catch (e) {
      console.error(e);
    }

    const savedVer = localStorage.getItem("quantecon_version");
    if (savedVer === "v1" || savedVer === "v2") setCurriculumVersion(savedVer);

    const savedV1Mod = localStorage.getItem("quantecon_v1_module_idx") || localStorage.getItem("quantecon_module_idx");
    if (savedV1Mod !== null) {
      const p = Number(savedV1Mod);
      if (!isNaN(p) && p >= 0 && p < COURSE_MODULES_V1.length) setModuleIndexV1(p);
    }
    const savedV1Ex = localStorage.getItem("quantecon_v1_exercise_idx") || localStorage.getItem("quantecon_exercise_idx");
    if (savedV1Ex !== null) {
      const p = Number(savedV1Ex);
      if (!isNaN(p) && p >= 0) setExerciseIndexV1(p);
    }
    const savedV2Mod = localStorage.getItem("quantecon_v2_module_idx");
    if (savedV2Mod !== null) {
      const p = Number(savedV2Mod);
      if (!isNaN(p) && p >= 0 && p < COURSE_MODULES_V2.length) setModuleIndexV2(p);
    }
    const savedV2Ex = localStorage.getItem("quantecon_v2_exercise_idx");
    if (savedV2Ex !== null) {
      const p = Number(savedV2Ex);
      if (!isNaN(p) && p >= 0) setExerciseIndexV2(p);
    }

    const params = new URLSearchParams(window.location.search);
    const exId = params.get("ex");
    if (exId) {
      for (let mIdx = 0; mIdx < COURSE_MODULES_V1.length; mIdx++) {
        const eIdx = COURSE_MODULES_V1[mIdx].exercises.findIndex((e) => e.id === exId);
        if (eIdx !== -1) {
          setCurriculumVersion("v1");
          setModuleIndexV1(mIdx);
          setExerciseIndexV1(eIdx);
          setHasMounted(true);
          return;
        }
      }
      for (let mIdx = 0; mIdx < COURSE_MODULES_V2.length; mIdx++) {
        const eIdx = COURSE_MODULES_V2[mIdx].exercises.findIndex((e) => e.id === exId);
        if (eIdx !== -1) {
          setCurriculumVersion("v2");
          setModuleIndexV2(mIdx);
          setExerciseIndexV2(eIdx);
          setHasMounted(true);
          return;
        }
      }
    }
    setHasMounted(true);
  }, []);

  // Synchronize URL with active exercise (?ex=...)
  useEffect(() => {
    if (!hasMounted || typeof window === "undefined" || !currentExercise?.id) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("ex") !== currentExercise.id) {
      url.searchParams.set("ex", currentExercise.id);
      window.history.replaceState({}, "", url.toString());
    }
  }, [hasMounted, currentExercise?.id]);

  // Persist completed exercise IDs to LocalStorage
  useEffect(() => {
    if (!hasMounted || typeof window === "undefined") return;
    localStorage.setItem("quantecon_completed_ids", JSON.stringify(completedExerciseIds));
  }, [hasMounted, completedExerciseIds]);

  // Pre-seed Python DataFrames ('df', 'df_marche', 'df_actifs', 'df_taux') whenever Pyodide is ready
  useEffect(() => {
    if (pythonEngine.isReady && currentExercise.language === "python") {
      pythonEngine.seedDataset("df", MACRO_CSV_DATA);
      pythonEngine.seedDataset("df_marche", MARCHE_CSV_DATA);
      pythonEngine.seedDataset("df_actifs", ACTIFS_CSV_DATA);
      pythonEngine.seedDataset("df_taux", TAUX_CSV_DATA);
    }
  }, [pythonEngine.isReady, currentExercise.id, currentExercise.language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Execute Code Handler
  const handleRunCode = useCallback(async () => {
    if (currentExercise.language === "python") {
      await pythonEngine.runPython(code, {
        csv: MACRO_CSV_DATA,
        varName: "df",
      });
    } else {
      await sqlEngine.runSQL(code);
    }
    setMobileTab("results");
  }, [code, currentExercise.language, pythonEngine, sqlEngine]);

  // Mark current exercise completed helper
  const markExerciseCompleted = useCallback((exerciseId: string) => {
    setCompletedExerciseIds((prev) => {
      if (prev.includes(exerciseId)) return prev;
      return [...prev, exerciseId];
    });
  }, []);

  // Validate Code Handler
  const handleValidateCode = useCallback(async () => {
    if (currentExercise.language === "python" && currentExercise.testPythonCode) {
      // First ensure code is run
      await pythonEngine.runPython(code, {
        csv: MACRO_CSV_DATA,
        varName: "df",
      });
      const val = await pythonEngine.validatePython(currentExercise.testPythonCode);
      if (val.passed) {
        markExerciseCompleted(currentExercise.id);
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#38bdf8", "#34d399", "#f59e0b"],
        });
      }
    } else if (currentExercise.language === "sql") {
      const val = await sqlEngine.validateSQL({
        userQuery: code,
        validationQuery: currentExercise.validationQuery,
      });
      if (val.passed) {
        markExerciseCompleted(currentExercise.id);
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#38bdf8", "#34d399", "#f59e0b"],
        });
      }
    }
    setMobileTab("results");
  }, [code, currentExercise, pythonEngine, sqlEngine, markExerciseCompleted]);

  // Check if current exercise is completed/validated
  const isCurrentCompleted =
    completedExerciseIds.includes(currentExercise.id) ||
    (currentExercise.language === "python"
      ? Boolean(pythonEngine.validation?.passed)
      : Boolean(sqlEngine.validation?.passed));

  // Free navigation handlers (unlocked)
  const handleNextExercise = () => {
    if (currentExerciseIndex < currentModule.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentExerciseIndex(0);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModIdx = currentModuleIndex - 1;
      setCurrentModuleIndex(prevModIdx);
      setCurrentExerciseIndex(modules[prevModIdx].exercises.length - 1);
    }
  };

  const handleOpenDataset = (tableName: string) => {
    setSelectedDatasetTable(tableName);
    setIsDatasetModalOpen(true);
  };

  const isCurrentLanguageReady =
    currentExercise.language === "python" ? pythonEngine.isReady : sqlEngine.isReady;
  const isCurrentRunning =
    currentExercise.language === "python" ? pythonEngine.isRunning : sqlEngine.isRunning;
  const currentStatusMessage =
    currentExercise.language === "python"
      ? pythonEngine.statusMessage
      : sqlEngine.statusMessage;

  const totalExercisesInModule = currentModule.exercises.length;
  const totalV1Exercises = COURSE_MODULES_V1.reduce((acc, m) => acc + m.exercises.length, 0);
  const progressPct = Math.round(((currentExerciseIndex + 1) / totalExercisesInModule) * 100);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-stone-50 text-stone-800 overflow-hidden font-sans">
      {/* Global Top App Bar (Notion / Stripe Light Aesthetic - Fully Responsive) */}
      <header className="h-14 border-b border-stone-200 bg-white/95 backdrop-blur-xs px-3 sm:px-4 flex items-center justify-between flex-shrink-0 z-30 shadow-2xs gap-2 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-stone-900 whitespace-nowrap">
                QuantEcon<span className="hidden sm:inline"> Lab</span>
              </span>
              <span className="hidden xl:inline-block ml-2 text-[10px] text-sky-800 font-medium px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">
                Micro-Learning
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-stone-200 hidden lg:block flex-shrink-0" />

          {/* Curriculum Version Switcher (V1 vs V2) */}
          <div className="flex items-center rounded-xl bg-stone-100 p-0.5 sm:p-1 border border-stone-200 shadow-2xs flex-shrink-0">
            <button
              onClick={() => handleSwitchVersion("v1")}
              className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                curriculumVersion === "v1"
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200/60"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              title={`Version 1 : Fondations Actuariat, Data Prep & Suites (${totalV1Exercises} exercices)`}
            >
              <span className="hidden md:inline">V1 : Actuariat</span>
              <span className="md:hidden">V1</span>
            </button>
            <button
              onClick={() => handleSwitchVersion("v2")}
              className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                curriculumVersion === "v2"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              title="Version 2 : Quantitative Finance, Économétrie & Monte Carlo (45 exercices)"
            >
              <span className="hidden xl:inline">⚡ V2 : Quant & Monte Carlo</span>
              <span className="hidden md:inline xl:hidden">⚡ V2 : Quant</span>
              <span className="md:hidden">⚡ V2</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  curriculumVersion === "v2"
                    ? "bg-white text-sky-700"
                    : "bg-sky-100 text-sky-800"
                }`}
              >
                45 ex
              </span>
            </button>
          </div>

          <div className="h-4 w-px bg-stone-200 hidden xl:block flex-shrink-0" />

          {/* Module Switcher Dropdown (visible on wide screens >= lg) */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <select
              value={currentModuleIndex}
              onChange={(e) => {
                setCurrentModuleIndex(Number(e.target.value));
                setCurrentExerciseIndex(0);
              }}
              className="bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors max-w-[115px] 2xl:max-w-[200px] truncate cursor-pointer"
            >
              {modules.map((mod, idx) => (
                <option key={mod.id} value={idx}>
                  M{idx + 1} : {mod.title}
                </option>
              ))}
            </select>
          </div>

          {/* Cheat Sheet Trigger Button (Desktop / Tablet Header) */}
          <button
            onClick={() => setIsCheatSheetOpen(true)}
            title={`Ouvrir la Cheat Sheet — ${currentModule.title}`}
            aria-label="Ouvrir la Cheat Sheet"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80 transition-colors cursor-pointer flex-shrink-0 whitespace-nowrap"
          >
            <BookMarked className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden 2xl:inline">Cheat Sheet</span>
          </button>
        </div>

        {/* STEPPER : Progress & Locked/Unlocked Next Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Engine Status Pill (hidden on tablet portrait, visible on xl) */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-mono text-stone-600">
            <span
              className={`w-2 h-2 rounded-full ${
                isCurrentLanguageReady ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
              }`}
            />
            <span>
              {currentExercise.language === "python" ? "Pyodide WASM" : "SQLite WASM"} :
            </span>
            <span className={isCurrentLanguageReady ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
              {isCurrentLanguageReady ? "Prêt" : "Chargement..."}
            </span>
          </div>

          {/* Stepper Navigation Container with Question Selector Dropdown */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200">
            {/* Prev Button */}
            <button
              onClick={handlePrevExercise}
              disabled={currentModuleIndex === 0 && currentExerciseIndex === 0}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-2xs cursor-pointer"
              title="Exercice précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Interactive Question Dropdown Navigator */}
            <div className="relative flex items-center gap-1.5">
              <select
                value={currentExerciseIndex}
                onChange={(e) => setCurrentExerciseIndex(Number(e.target.value))}
                className="bg-white border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg px-2 py-1 focus:outline-none focus:border-stone-400 cursor-pointer shadow-2xs hover:bg-stone-50 transition-colors max-w-[130px] sm:max-w-[180px] md:max-w-[150px] lg:max-w-[220px] truncate"
                title="Naviguer directement vers n'importe quelle question"
              >
                {currentModule.exercises.map((ex, idx) => {
                  const isDone = completedExerciseIds.includes(ex.id);
                  return (
                    <option key={ex.id} value={idx}>
                      {isDone ? "✓ " : ""}{idx + 1}. {ex.title.replace(/^\d+\.\s*/, "")}
                    </option>
                  );
                })}
              </select>

              {isCurrentCompleted && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="hidden md:inline">Validé</span>
                </span>
              )}
            </div>

            {/* Progress Bar (visible on xl) */}
            <div className="w-10 h-1.5 bg-stone-200 rounded-full overflow-hidden hidden xl:block" title={`Progression: ${progressPct}%`}>
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Next Button (Free navigation, always unlocked) */}
            <button
              onClick={handleNextExercise}
              disabled={
                currentModuleIndex === modules.length - 1 &&
                currentExerciseIndex === totalExercisesInModule - 1
              }
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all bg-stone-900 hover:bg-stone-800 text-white shadow-xs cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Passer à l'exercice suivant"
            >
              <span className="hidden xs:inline">Suivant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet (< lg) Compact Module Switcher Bar */}
      <div className="lg:hidden bg-white border-b border-stone-200 px-3 py-1.5 flex items-center justify-between gap-2 flex-shrink-0">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide flex-shrink-0">
          Module
        </span>
        <select
          value={currentModuleIndex}
          onChange={(e) => {
            setCurrentModuleIndex(Number(e.target.value));
            setCurrentExerciseIndex(0);
          }}
          aria-label="Sélectionner un module"
          className="flex-1 min-w-0 bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 rounded-lg px-2 py-1 focus:outline-none focus:border-stone-400 truncate cursor-pointer"
        >
          {modules.map((mod, idx) => (
            <option key={mod.id} value={idx}>
              M{idx + 1} : {mod.title} ({mod.exercises.length} ex)
            </option>
          ))}
        </select>
      </div>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden p-2 sm:p-2.5 lg:p-3 relative">
        {/* DESKTOP & TABLET: Split-Screen View (md and above) */}
        <div className="hidden md:grid md:grid-cols-12 gap-2.5 lg:gap-3 h-full min-w-0">
          {/* Left Panel: Theory & Instructions (6 cols on tablet, 5 on desktop) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 h-full overflow-hidden min-w-0">
            <TheoryViewer
              exercise={currentExercise}
              onOpenDatasetModal={handleOpenDataset}
              onInsertCode={(snippet) => setCode(snippet)}
            />
          </div>

          {/* Right Panel: Editor & Results (6 cols on tablet, 7 on desktop) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-7 h-full flex flex-col gap-2.5 lg:gap-3 overflow-hidden min-w-0">
            {/* Top Right: Code Editor (58% height) */}
            <div className="flex-[3] min-h-[280px] overflow-hidden">
              <CodeEditor
                language={currentExercise.language}
                code={code}
                onChange={setCode}
                onRun={handleRunCode}
                onValidate={handleValidateCode}
                onReset={handleResetCode}
                onRequestShowSolution={handleShowSolution}
                isRunning={isCurrentRunning}
                isReady={isCurrentLanguageReady}
                statusMessage={currentStatusMessage}
              />
            </div>

            {/* Bottom Right: Results Viewer (42% height) */}
            <div className="flex-[2] min-h-[190px] overflow-hidden">
              <ResultsViewer
                language={currentExercise.language}
                stdout={
                  currentExercise.language === "python"
                    ? pythonEngine.output.stdout
                    : undefined
                }
                stderr={
                  currentExercise.language === "python"
                    ? pythonEngine.output.stderr
                    : sqlEngine.output.error || undefined
                }
                plots={
                  currentExercise.language === "python"
                    ? pythonEngine.output.plots
                    : []
                }
                tables={
                  currentExercise.language === "sql"
                    ? sqlEngine.output.tables
                    : []
                }
                executionTimeMs={
                  currentExercise.language === "sql"
                    ? sqlEngine.output.executionTimeMs
                    : undefined
                }
                validation={
                  currentExercise.language === "python"
                    ? pythonEngine.validation
                    : sqlEngine.validation
                }
                isRunning={isCurrentRunning}
                onClear={() => {
                  pythonEngine.resetOutput();
                  sqlEngine.resetOutput();
                }}
              />
            </div>
          </div>
        </div>

        {/* MOBILE (iPhone): Stacked View (< md) */}
        <div className="md:hidden h-full flex flex-col pb-14">
          <div className="flex-1 h-full overflow-hidden">
            {mobileTab === "theory" && (
              <TheoryViewer
              exercise={currentExercise}
              onOpenDatasetModal={handleOpenDataset}
              onInsertCode={(snippet) => setCode(snippet)}
            />
            )}
            {mobileTab === "editor" && (
              <CodeEditor
                language={currentExercise.language}
                code={code}
                onChange={setCode}
                onRun={handleRunCode}
                onValidate={handleValidateCode}
                onReset={handleResetCode}
                onRequestShowSolution={handleShowSolution}
                isRunning={isCurrentRunning}
                isReady={isCurrentLanguageReady}
                statusMessage={currentStatusMessage}
              />
            )}
            {mobileTab === "results" && (
              <ResultsViewer
                language={currentExercise.language}
                stdout={
                  currentExercise.language === "python"
                    ? pythonEngine.output.stdout
                    : undefined
                }
                stderr={
                  currentExercise.language === "python"
                    ? pythonEngine.output.stderr
                    : sqlEngine.output.error || undefined
                }
                plots={
                  currentExercise.language === "python"
                    ? pythonEngine.output.plots
                    : []
                }
                tables={
                  currentExercise.language === "sql"
                    ? sqlEngine.output.tables
                    : []
                }
                executionTimeMs={
                  currentExercise.language === "sql"
                    ? sqlEngine.output.executionTimeMs
                    : undefined
                }
                validation={
                  currentExercise.language === "python"
                    ? pythonEngine.validation
                    : sqlEngine.validation
                }
                isRunning={isCurrentRunning}
                onClear={() => {
                  pythonEngine.resetOutput();
                  sqlEngine.resetOutput();
                }}
              />
            )}
          </div>

          {/* Bottom Floating iOS Tab Bar (Light & Pastel) */}
          <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-around px-2 z-40">
            <button
              onClick={() => setMobileTab("theory")}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-lg transition-colors ${
                mobileTab === "theory" ? "text-stone-900 font-semibold" : "text-stone-500"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px]">Théorie</span>
            </button>

            <button
              onClick={() => setMobileTab("editor")}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-lg transition-colors ${
                mobileTab === "editor" ? "text-stone-900 font-semibold" : "text-stone-500"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-[10px]">Éditeur</span>
            </button>

            <button
              onClick={() => setMobileTab("results")}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-lg transition-colors relative ${
                mobileTab === "results" ? "text-stone-900 font-semibold" : "text-stone-500"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px]">Résultats</span>
              {(pythonEngine.output.stdout ||
                sqlEngine.output.tables.length > 0 ||
                pythonEngine.output.plots.length > 0) && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          </nav>
        </div>
      </main>

      {/* Dataset Schema Modal */}
      <DatasetModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        datasets={currentExercise.datasets}
        initialTableName={selectedDatasetTable}
      />

      {/* Solution Pop-up Modal */}
      <SolutionModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        exercise={currentExercise}
        onApplySolution={() => {
          setCode(currentExercise.solutionCode || currentExercise.initialCode || "");
        }}
      />

      {/* Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        activeModuleId={currentModule.id}
        currentLanguage={currentExercise.language}
        onInsertCode={(snippet) => {
          setCode(snippet);
          setIsCheatSheetOpen(false);
        }}
      />

      {/* Mobile Floating Cheat Sheet Button (< sm) */}
      <button
        onClick={() => setIsCheatSheetOpen(true)}
        aria-label="Ouvrir la Cheat Sheet mobile"
        className="sm:hidden fixed bottom-4 right-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border border-indigo-500 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
      >
        <BookMarked className="w-3.5 h-3.5" />
        <span>Cheat Sheet</span>
      </button>
    </div>
  );
}
