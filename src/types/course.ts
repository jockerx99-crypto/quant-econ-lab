export type Language = "sql" | "python";

export interface ExerciseDataset {
  name: string;
  tableName?: string;
  description: string;
  columns: { name: string; type: string; description: string }[];
  sampleRows?: Record<string, string | number | null>[];
}

export interface CodeConceptExplanation {
  symbol: string;
  kind:
    | "Variable"
    | "Fonction / Méthode"
    | "Paramètre"
    | "Syntaxe"
    | "Colonne / Table";
  roleInExercise: string;
}

export interface ExerciseGuide {
  theoryToPracticeLink: string;
  stepByStepPlan: string[];
  concepts: CodeConceptExplanation[];
  guidedCode: string;
}

export interface Exercise {
  id: string;
  title: string;
  category:
    | "data_prep"
    | "econometrics"
    | "pricing"
    | "alm"
    | "financial_econometrics"
    | "monte_carlo"
    | "data_engineering";
  language: Language;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  durationMinutes: number;
  description: string;
  theoryMarkdown: string;
  taskMarkdown: string;
  initialCode: string;
  solutionCode: string;
  datasets: ExerciseDataset[];
  // For SQL validation
  validationQuery?: string;
  // For Python validation (assertions code)
  testPythonCode?: string;
  hints: string[];
  guide?: ExerciseGuide;
}

export interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  exercises: Exercise[];
}
