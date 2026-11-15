#!/usr/bin/env python3
"""
Update src/components/Workspace.tsx with:
- V1 vs V2 curriculum toggle
- Independent position persistence for V1 and V2
- Pre-seeded financial datasets (df_marche, df_actifs, df_taux) for Python
"""

def update_workspace():
    path = "/Users/lucaspasqualis/quant-econ-lab/src/components/Workspace.tsx"
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Imports
    old_import = 'import { COURSE_MODULES } from "@/data/courses";'
    new_import = 'import { COURSE_MODULES as COURSE_MODULES_V1 } from "@/data/courses";\nimport { COURSE_MODULES_V2 } from "@/data/courses_v2";'
    content = content.replace(old_import, new_import)

    # 2. Financial CSV Data
    csv_insert_marker = "2023-Q4,3.92,3.10,1.48,2.90,0.1,5.7`;"
    financial_csvs = """2023-Q4,3.92,3.10,1.48,2.90,0.1,5.7`;

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
2023-12-31,3.45,2.85,2.50,2.55,2.85,2.88`;"""

    content = content.replace(csv_insert_marker, financial_csvs)

    # 3. State logic
    old_state = """  // Module & Exercise state with LocalStorage persistence
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_module_idx");
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed < COURSE_MODULES.length) {
          return parsed;
        }
      }
    }
    return 0;
  });

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_exercise_idx");
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    }
    // Default to Exercise 14 (index 13: "14. Groupement élémentaire (GROUP BY)") since user was there!
    return 13;
  });

  const currentModule: CourseModule = COURSE_MODULES[currentModuleIndex] || COURSE_MODULES[0];
  const currentExercise: Exercise =
    currentModule.exercises[currentExerciseIndex] || currentModule.exercises[0];"""

    new_state = """  // Curriculum Version (V1 = Fondations Actuariat, V2 = Quantitative Finance & Monte Carlo)
  const [curriculumVersion, setCurriculumVersion] = useState<"v1" | "v2">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_version");
      if (saved === "v1" || saved === "v2") return saved;
    }
    return "v1";
  });

  // Track state independently for V1 and V2
  const [moduleIndexV1, setModuleIndexV1] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_v1_module_idx") || localStorage.getItem("quantecon_module_idx");
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed < COURSE_MODULES_V1.length) return parsed;
      }
    }
    return 0;
  });

  const [exerciseIndexV1, setExerciseIndexV1] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_v1_exercise_idx") || localStorage.getItem("quantecon_exercise_idx");
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return 13; // Retain Exercise 14 (GROUP BY region)
  });

  const [moduleIndexV2, setModuleIndexV2] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_v2_module_idx");
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed < COURSE_MODULES_V2.length) return parsed;
      }
    }
    return 0;
  });

  const [exerciseIndexV2, setExerciseIndexV2] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quantecon_v2_exercise_idx");
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return 0;
  });

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
    currentModule.exercises[currentExerciseIndex] || currentModule.exercises[0];"""

    content = content.replace(old_state, new_state)

    # 4. Completed exercise IDs pre-seed
    old_completed = "return COURSE_MODULES[0].exercises.slice(0, 13).map((e) => e.id);"
    new_completed = "return COURSE_MODULES_V1[0].exercises.slice(0, 13).map((e) => e.id);"
    content = content.replace(old_completed, new_completed)

    # 5. Persist to LocalStorage
    old_persist = """  // Persist current exercise and module to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quantecon_exercise_idx", String(currentExerciseIndex));
      localStorage.setItem("quantecon_module_idx", String(currentModuleIndex));
    }
  }, [currentExerciseIndex, currentModuleIndex]);"""

    new_persist = """  // Persist current exercise and module to LocalStorage per version
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (curriculumVersion === "v1") {
        localStorage.setItem("quantecon_v1_exercise_idx", String(currentExerciseIndex));
        localStorage.setItem("quantecon_v1_module_idx", String(currentModuleIndex));
        localStorage.setItem("quantecon_exercise_idx", String(currentExerciseIndex));
        localStorage.setItem("quantecon_module_idx", String(currentModuleIndex));
      } else {
        localStorage.setItem("quantecon_v2_exercise_idx", String(currentExerciseIndex));
        localStorage.setItem("quantecon_v2_module_idx", String(currentModuleIndex));
      }
    }
  }, [currentExerciseIndex, currentModuleIndex, curriculumVersion]);"""

    content = content.replace(old_persist, new_persist)

    # 6. Seed Python datasets
    old_seed = """  // Pre-seed Python DataFrame 'df' silently with macro data whenever Pyodide is ready
  useEffect(() => {
    if (pythonEngine.isReady && currentExercise.language === "python") {
      pythonEngine.seedDataset("df", MACRO_CSV_DATA);
    }
  }, [pythonEngine.isReady, currentExercise.id, currentExercise.language]); // eslint-disable-line react-hooks/exhaustive-deps"""

    new_seed = """  // Pre-seed Python DataFrames ('df', 'df_marche', 'df_actifs', 'df_taux') whenever Pyodide is ready
  useEffect(() => {
    if (pythonEngine.isReady && currentExercise.language === "python") {
      pythonEngine.seedDataset("df", MACRO_CSV_DATA);
      pythonEngine.seedDataset("df_marche", MARCHE_CSV_DATA);
      pythonEngine.seedDataset("df_actifs", ACTIFS_CSV_DATA);
      pythonEngine.seedDataset("df_taux", TAUX_CSV_DATA);
    }
  }, [pythonEngine.isReady, currentExercise.id, currentExercise.language]); // eslint-disable-line react-hooks/exhaustive-deps"""

    content = content.replace(old_seed, new_seed)

    # 7. Navigation handlers
    old_nav = """  // Free navigation handlers (unlocked)
  const handleNextExercise = () => {
    if (currentExerciseIndex < currentModule.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else if (currentModuleIndex < COURSE_MODULES.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setCurrentExerciseIndex(0);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prev) => prev - 1);
      setCurrentExerciseIndex(COURSE_MODULES[currentModuleIndex - 1].exercises.length - 1);
    }
  };"""

    new_nav = """  // Free navigation handlers (unlocked)
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
  };"""

    content = content.replace(old_nav, new_nav)

    # 8. Header Version Switcher & Module Dropdown
    old_header_controls = """          {/* Module Switcher Dropdown */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={currentModuleIndex}
              onChange={(e) => {
                setCurrentModuleIndex(Number(e.target.value));
                setCurrentExerciseIndex(0);
              }}
              className="bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
            >
              {COURSE_MODULES.map((mod, idx) => (
                <option key={mod.id} value={idx}>
                  Module {idx + 1} : {mod.title}
                </option>
              ))}
            </select>
          </div>"""

    new_header_controls = """          {/* Curriculum Version Switcher (V1 vs V2) */}
          <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200 shadow-2xs">
            <button
              onClick={() => handleSwitchVersion("v1")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                curriculumVersion === "v1"
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200/60"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              title="Version 1 : Fondations Actuariat & Data Prep (52 exercices)"
            >
              <span>V1 : Actuariat</span>
            </button>
            <button
              onClick={() => handleSwitchVersion("v2")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                curriculumVersion === "v2"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              title="Version 2 : Quantitative Finance, Économétrie & Monte Carlo (45 exercices)"
            >
              <span>⚡ V2 : Quant & Monte Carlo</span>
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

          <div className="h-4 w-px bg-stone-200 hidden lg:block" />

          {/* Module Switcher Dropdown */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={currentModuleIndex}
              onChange={(e) => {
                setCurrentModuleIndex(Number(e.target.value));
                setCurrentExerciseIndex(0);
              }}
              className="bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors max-w-[240px] truncate cursor-pointer"
            >
              {modules.map((mod, idx) => (
                <option key={mod.id} value={idx}>
                  M{idx + 1} : {mod.title}
                </option>
              ))}
            </select>
          </div>"""

    content = content.replace(old_header_controls, new_header_controls)

    # 9. Next button disabled condition
    old_disabled = """              disabled={
                currentModuleIndex === COURSE_MODULES.length - 1 &&
                currentExerciseIndex === totalExercisesInModule - 1
              }"""
    new_disabled = """              disabled={
                currentModuleIndex === modules.length - 1 &&
                currentExerciseIndex === totalExercisesInModule - 1
              }"""
    content = content.replace(old_disabled, new_disabled)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    print("Updated Workspace.tsx successfully!")

if __name__ == '__main__':
    update_workspace()
