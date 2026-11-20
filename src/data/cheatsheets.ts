export interface CheatSheetEntry {
  id: string;
  title: string;
  exerciseRef: string;
  syntax?: string;
  formula?: string;
  description: string;
  exampleCode: string;
  tags: string[];
}

export interface CheatSheetSection {
  id: string;
  title: string;
  subtitle: string;
  entries: CheatSheetEntry[];
}

export interface ModuleCheatSheet {
  moduleId: string;
  version: "V1" | "V2" | "V3";
  moduleNumber: number;
  title: string;
  language: "sql" | "python";
  overview: string;
  datasetsSummary: string[];
  sections: CheatSheetSection[];
}

const r = String.raw;

export const CHEAT_SHEET_MODULE_ALIASES: Record<string, string> = {
  "sql-actuariat-suite": "sql-actuariat",
  "python-econometrie-suite": "python-econometrie",
};

export function resolveCheatSheetModuleId(moduleId: string): string {
  return CHEAT_SHEET_MODULE_ALIASES[moduleId] || moduleId;
}

export const MODULE_CHEAT_SHEETS: ModuleCheatSheet[] = [
  // =========================================================================
  // V1 — MODULE 1 & MODULE 3 : SQL POUR L'ACTUARIAT & LA DATA PREP
  // =========================================================================
  {
    moduleId: "sql-actuariat",
    version: "V1",
    moduleNumber: 1,
    title: "SQL pour l'Actuariat & la Data Prep (M1 & M3)",
    language: "sql",
    overview:
      "Toutes les clauses SQL (SQLite) des Modules 1 et 3 (Suite) pour extraire, nettoyer, joindre des polices d'assurance, calculer des ratios S/P et appliquer des fonctions de fenêtrage.",
    datasetsSummary: [
      "assures : police_id, assure_id, age, sexe, region, type_contrat, bonus_malus, anciennete_permis, type_vehicule, puissance_fiscale, usage, prime_annuelle",
      "sinistres : sinistre_id, police_id, date_survenance, date_declaration, nature_sinistre, cout_dommages_materiels, cout_corporel, cout_total, responsabilite_pct, statut_dossier",
      "macro_taux : periode, euribor_3m, oat_10y, spread_credit_bbb, inflation_hicp, pib_croissance, cac40_rendement",
    ],
    sections: [
      {
        id: "sql-v1-extract",
        title: "1. Extraction, Filtrage & Tri",
        subtitle: "Projeter, filtrer les segments de portefeuille et ordonner les résultats",
        entries: [
          {
            id: "sql-v1-select-as",
            title: "Projection, Dédoublonnage & Alias",
            exerciseRef: "Ex. 1–2, 23",
            syntax: "SELECT DISTINCT col1, col2 AS alias FROM table;",
            description:
              "Sélectionne uniquement les colonnes utiles et renomme une colonne ou un calcul via `AS`. `DISTINCT` supprime les doublons.",
            exampleCode: r`SELECT DISTINCT region AS code_region, police_id, prime_annuelle AS prime_nette
FROM assures;`,
            tags: ["SELECT", "AS", "DISTINCT", "FROM", "alias", "projection"],
          },
          {
            id: "sql-v1-where-bool",
            title: "Filtrage WHERE & Logique Booléenne (AND / OR)",
            exerciseRef: "Ex. 3–6",
            syntax: "WHERE cond1 AND (cond2 OR cond3)",
            description:
              "Filtre les lignes avant toute agrégation. Attention : `AND` est prioritaire sur `OR` — utilisez toujours des parenthèses dès qu'un `OR` coexiste avec un `AND`. Les chaînes utilisent des guillemets simples `'IDF'`.",
            exampleCode: r`SELECT police_id, age, region, bonus_malus
FROM assures
WHERE region = 'IDF'
  AND (type_vehicule = 'SUV' OR type_vehicule = 'Sportive')
  AND bonus_malus > 0.8;`,
            tags: ["WHERE", "AND", "OR", "filtrage", "parenthèses"],
          },
          {
            id: "sql-v1-in-between",
            title: "Liste (IN), Intervalle (BETWEEN), Motifs (LIKE) & NULL",
            exerciseRef: "M1 Ex. 7–8 · M3 Ex. 8–11",
            syntax: "WHERE col IN ('A', 'B') | BETWEEN a AND b | LIKE '2022-%' | IS NOT NULL",
            description:
              "`IN` remplace une suite de `OR`. `BETWEEN a AND b` inclut les deux bornes. `LIKE '2022-%'` filtre par motif textuel (`%` = 0+ caractères). Testez toujours les champs vides via `IS NULL` ou `IS NOT NULL` (jamais `= NULL`).",
            exampleCode: r`SELECT sinistre_id, date_survenance, nature_sinistre, cout_corporel
FROM sinistres
WHERE date_survenance LIKE '2022-%'
  AND cout_corporel IS NOT NULL;`,
            tags: ["IN", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "intervalle", "motif"],
          },
          {
            id: "sql-v1-order-limit",
            title: "Tri (ORDER BY) & Extraction Top N (LIMIT)",
            exerciseRef: "Ex. 9–10",
            syntax: "ORDER BY col DESC LIMIT n;",
            description:
              "Trie par ordre décroissant (`DESC`) ou croissant (`ASC`, par défaut), puis ne conserve que les `n` premières lignes.",
            exampleCode: r`SELECT police_id, type_vehicule, prime_annuelle
FROM assures
ORDER BY prime_annuelle DESC
LIMIT 5;`,
            tags: ["ORDER BY", "DESC", "ASC", "LIMIT", "top"],
          },
        ],
      },
      {
        id: "sql-v1-agg",
        title: "2. Agrégations, Segmentation & Nettoyage",
        subtitle: "Résumer un portefeuille, recoder des variables et imputer les valeurs manquantes",
        entries: [
          {
            id: "sql-v1-agg-funcs",
            title: "Agrégats & Arrondi : COUNT, SUM, AVG, MIN, MAX, ROUND",
            exerciseRef: "Ex. 11–13",
            syntax: "ROUND(AVG(col), 2), COUNT(*), SUM(col), MIN(col), MAX(col)",
            description:
              "`COUNT(*)` compte toutes les lignes (y compris NULL), tandis que `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` ignorent les valeurs `NULL`.",
            exampleCode: r`SELECT COUNT(*) AS nb_polices,
       ROUND(SUM(prime_annuelle), 2) AS total_primes,
       ROUND(AVG(prime_annuelle), 2) AS prime_moyenne,
       MIN(prime_annuelle) AS prime_min,
       MAX(prime_annuelle) AS prime_max
FROM assures;`,
            tags: ["COUNT", "SUM", "AVG", "MIN", "MAX", "ROUND", "agrégation"],
          },
          {
            id: "sql-v1-groupby-having",
            title: "Regroupement (GROUP BY) & Filtrage Post-Agrégation (HAVING)",
            exerciseRef: "Ex. 14–16",
            syntax: "SELECT dim, COUNT(*) FROM table GROUP BY dim HAVING COUNT(*) >= 2;",
            description:
              "Règle d'or SQL : toute colonne du `SELECT` hors fonction d'agrégation doit figurer dans `GROUP BY`. Utilisez `WHERE` pour filtrer les lignes brutes et `HAVING` pour filtrer les groupes agrégés.",
            exampleCode: r`SELECT region,
       COUNT(*) AS nb_polices,
       ROUND(AVG(prime_annuelle), 2) AS prime_moyenne
FROM assures
GROUP BY region
HAVING COUNT(*) >= 2
ORDER BY prime_moyenne DESC;`,
            tags: ["GROUP BY", "HAVING", "WHERE", "segmentation"],
          },
          {
            id: "sql-v1-case-when",
            title: "Discrétisation & Comptage Conditionnel (CASE WHEN)",
            exerciseRef: "M1 Ex. 17 · M3 Ex. 18–19",
            syntax: "SUM(CASE WHEN cond THEN 1 ELSE 0 END) AS nb_cas",
            description:
              "Crée des classes tarifaires ou compte en une seule passe la fréquence d'un événement cible (`1` si la condition est vraie, `0` sinon).",
            exampleCode: r`SELECT COUNT(*) AS total_dossiers,
       SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves
FROM sinistres;`,
            tags: ["CASE", "WHEN", "ELSE", "END", "SUM", "catégorie", "comptage conditionnel"],
          },
          {
            id: "sql-v1-coalesce",
            title: "Gestion des Valeurs Nulles (COALESCE)",
            exerciseRef: "Ex. 18, 21",
            syntax: "COALESCE(colonne_nullable, 0.0)",
            description:
              "Remplace tout `NULL` (par ex. `cout_corporel` vide ou police sans sinistre après un `LEFT JOIN`) par une valeur numérique neutre `0.0` afin d'éviter la propagation du `NULL` dans les sommes.",
            exampleCode: r`SELECT sinistre_id,
       cout_dommages_materiels,
       COALESCE(cout_corporel, 0.0) AS corporel_impute,
       cout_total
FROM sinistres;`,
            tags: ["COALESCE", "NULL", "imputation", "cout_corporel", "cout_dommages_materiels"],
          },
        ],
      },
      {
        id: "sql-v1-joins",
        title: "3. Jointures Actuarielles, Sous-Requêtes & Ratio S/P",
        subtitle: "Relier polices et sinistres sans biaiser l'exposition au risque",
        entries: [
          {
            id: "sql-v1-inner-vs-left",
            title: "INNER JOIN, LEFT JOIN, COUNT(col) & Anti-Jointure (IS NULL)",
            exerciseRef: "M1 Ex. 19–21 · M3 Ex. 21–23",
            syntax: "LEFT JOIN sinistres s ON a.police_id = s.police_id | COUNT(s.sinistre_id)",
            description:
              "`INNER JOIN` ne garde que les assurés sinistrés. `LEFT JOIN` préserve **100 % de l'exposition** : utilisez `COUNT(s.sinistre_id)` (et non `COUNT(*)`) pour obtenir `0` sans sinistre, ou `WHERE s.sinistre_id IS NULL` pour isoler les contrats indemnes (anti-jointure).",
            exampleCode: r`SELECT a.police_id,
       a.prime_annuelle,
       COUNT(s.sinistre_id) AS nb_sinistres,
       ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police
FROM assures a
LEFT JOIN sinistres s ON a.police_id = s.police_id
GROUP BY a.police_id, a.prime_annuelle;`,
            tags: ["INNER JOIN", "LEFT JOIN", "ON", "exposition", "COALESCE", "IS NULL", "COUNT"],
          },
          {
            id: "sql-v1-subqueries",
            title: "Sous-Requêtes Scalaires & Filtrantes (IN)",
            exerciseRef: "Ex. 22–23",
            syntax: "WHERE col > (SELECT AVG(col) FROM table)",
            description:
              "Une sous-requête scalaire renvoie une valeur unique utilisable dans un comparateur (`>`, `<`). Une sous-requête multi-lignes s'utilise avec `IN (...)` pour filtrer à partir d'une autre table.",
            exampleCode: r`-- Assurés payant plus que la moyenne et ayant eu au moins un sinistre
SELECT police_id, age, region, prime_annuelle
FROM assures
WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures)
  AND police_id IN (SELECT DISTINCT police_id FROM sinistres);`,
            tags: ["subquery", "sous-requête", "AVG", "IN", "DISTINCT"],
          },
          {
            id: "sql-v1-loss-ratio",
            title: "Loss Ratio S/P (Sinistres sur Primes)",
            exerciseRef: "Ex. 24",
            syntax: "ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2)",
            formula: r`$$\text{Ratio S/P (en \%)} = \frac{\sum \text{Coûts totaux de sinistres}}{\sum \text{Primes annuelles acquises}} \times 100$$`,
            description:
              "Indicateur clé de rentabilité technique en IARD. Un S/P $> 100\\%$ signifie que les sinistres dépassent les primes encaissées. Exige un `LEFT JOIN` pour inclure les primes des polices non sinistrées.",
            exampleCode: r`SELECT a.region,
       ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp
FROM assures a
LEFT JOIN sinistres s ON a.police_id = s.police_id
GROUP BY a.region
ORDER BY ratio_sp DESC;`,
            tags: ["S/P", "loss ratio", "rentabilité", "sinistralité", "GROUP BY"],
          },
        ],
      },
      {
        id: "sql-v1-windows",
        title: "4. Fonctions de Fenêtrage (Window Functions)",
        subtitle: "Analyser des séries macroéconomiques et classer des segments sans perdre le grain",
        entries: [
          {
            id: "sql-v1-lag",
            title: "Décalage Temporel : LAG() OVER (...)",
            exerciseRef: "Ex. 25",
            syntax: "LAG(col, offset) OVER (ORDER BY periode)",
            formula: r`$$\Delta X_t = X_t - X_{t-1}$$`,
            description:
              "Accède à la ligne précédente (`offset = 1`) selon un ordre chronologique, sans recourir à une auto-jointure complexe.",
            exampleCode: r`SELECT periode,
       euribor_3m,
       LAG(euribor_3m, 1) OVER (ORDER BY periode) AS euribor_prev,
       ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY periode), 2) AS variation_taux
FROM macro_taux;`,
            tags: ["LAG", "OVER", "ORDER BY", "window", "série temporelle", "macro_taux"],
          },
          {
            id: "sql-v1-dense-rank",
            title: "Classement sans Ex-Æquo Perdus : DENSE_RANK()",
            exerciseRef: "Ex. 26",
            syntax: "DENSE_RANK() OVER (ORDER BY agrégat DESC)",
            description:
              "Attribue un rang `1, 2, 3...` sans laisser de trou en cas d'égalité (contrairement à `RANK()` qui passerait de `1` à `3`). Se combine directement après un `GROUP BY` sur un agrégat.",
            exampleCode: r`SELECT a.region,
       ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout,
       DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout
FROM assures a
LEFT JOIN sinistres s ON a.police_id = s.police_id
GROUP BY a.region
ORDER BY rang_cout ASC;`,
            tags: ["DENSE_RANK", "OVER", "classement", "sinistralité"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V1 — MODULE 2 & MODULE 4 : PYTHON POUR L'ÉCONOMÉTRIE, RISQUE & PRICING
  // =========================================================================
  {
    moduleId: "python-econometrie",
    version: "V1",
    moduleNumber: 2,
    title: "Python pour l'Économétrie, Risque & Pricing (M2 & M4)",
    language: "python",
    overview:
      "Mémento complet des Modules 2 et 4 (Suite) : Pandas, estimation MCO / OLS (Statsmodels & NumPy), prévision, diagnostics de Gauss-Markov, séries temporelles (ADF, HAC) et VaR / Duration ALM.",
    datasetsSummary: [
      "df (macro_taux préchargé) : periode, euribor_3m, oat_10y, spread_credit_bbb, inflation_hicp, pib_croissance, cac40_rendement",
      "df_actifs (portefeuilles_actifs préchargé) : ticker, nom, secteur, classe_actif, rendement_espere, volatilite, beta_marche, score_esg, ratio_sharpe",
      "Imports principaux : pandas (pd), numpy (np), statsmodels.api (sm), matplotlib.pyplot (plt)",
    ],
    sections: [
      {
        id: "py-v1-eda",
        title: "1. Exploration Pandas, Moments & Outliers",
        subtitle: "Décrire la distribution empirique et détecter les valeurs aberrantes",
        entries: [
          {
            id: "py-v1-tvm",
            title: "Valeur Temps de l'Argent (Actualisation & Capitalisation)",
            exerciseRef: "M2 Ex. 1 · M4 Ex. 1",
            syntax: "V0 = CF / ((1 + r) ** T) | VT = V0 * ((1 + r) ** T)",
            formula: r`$$V_T = V_0 (1 + r)^T \qquad ; \qquad V_0 = \frac{CF_T}{(1 + r)^T} \quad (\text{continu : } CF_T e^{-rT})$$`,
            description:
              "Un euro futur vaut moins qu'un euro immédiat : l'actualisation ramène un flux futur $CF_T$ à sa valeur présente $V_0$ au taux sans risque $r$ (vérifiez toujours si la colonne est en pourcentage `3.10` ou en décimal `0.031`).",
            exampleCode: r`flux, r_ann, T = 10_000.0, 0.031, 10
va = flux / ((1.0 + r_ann) ** T)
print(f"Valeur actuelle : {va:,.2f} EUR")`,
            tags: ["valeur temps", "actualisation", "capitalisation", "ALM", "taux"],
          },
          {
            id: "py-v1-inspect",
            title: "Exploration, Filtrage Booléen & GroupBy (.head, .describe, &)",
            exerciseRef: "M2 Ex. 1–2, 5 · M4 Ex. 1–3, 6, 9",
            syntax: "df.describe() | df[(cond1) & (cond2)] | df_actifs.groupby('col').mean()",
            description:
              "`df.shape` donne `(N, K)` et `df.describe()` résume quartiles, moyenne et écart-type. Pour filtrer en Pandas, entourez chaque condition de parenthèses et combinez avec `&` (ET) ou `|` (OU).",
            exampleCode: r`print(df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe().round(2))
df_stress = df[(df['inflation_hicp'] > 5.0) & (df['cac40_rendement'] < 0)]
print(df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean())`,
            tags: ["pandas", "head", "shape", "describe", "filtre", "groupby", "df_actifs"],
          },
          {
            id: "py-v1-moments",
            title: "Moyenne, Écart-Type, Médiane & Quantiles",
            exerciseRef: "Ex. 3–4",
            syntax: "s.mean(), s.std(), s.median(), s.quantile(q)",
            formula: r`$$\bar{x} = \frac{1}{N}\sum_{i=1}^N x_i, \qquad s = \sqrt{\frac{1}{N-1}\sum_{i=1}^N (x_i - \bar{x})^2}$$`,
            description:
              "Par défaut, `.std()` de Pandas utilise `ddof=1` (estimateur sans biais). `.quantile(0.95)` retourne le 95e centile.",
            exampleCode: r`oat_moy = df['oat_10y'].mean()
oat_vol = df['oat_10y'].std()
med_inf = df['inflation_hicp'].median()
q95_inf = df['inflation_hicp'].quantile(0.95)
print(f"OAT moy: {oat_moy:.3f} % | Vol: {oat_vol:.3f} % | Q95 Inf: {q95_inf:.2f} %")`,
            tags: ["mean", "std", "median", "quantile", "volatilité", "espérance"],
          },
          {
            id: "py-v1-corr-iqr",
            title: "Corrélation Linéaire (.corr) & Outliers IQR de Tukey",
            exerciseRef: "Ex. 6–7",
            syntax: "df[cols].corr() | IQR = Q75 - Q25",
            formula: r`$$IQR = Q_{75} - Q_{25}, \qquad \text{Seuil Haut} = Q_{75} + 1.5 \times IQR$$`,
            description:
              "La matrice `.corr()` mesure la liaison linéaire entre paires de variables. L'écart interquartile (IQR) détecte les chocs extrêmes au-dessus de $Q_{75} + 1.5 \\cdot IQR$ ou sous $Q_{25} - 1.5 \\cdot IQR$.",
            exampleCode: r`print(df[['euribor_3m', 'oat_10y', 'inflation_hicp']].corr().round(3))

q25 = df['inflation_hicp'].quantile(0.25)
q75 = df['inflation_hicp'].quantile(0.75)
iqr = q75 - q25
seuil_haut = q75 + 1.5 * iqr
print(f"IQR = {iqr:.2f} | Seuil Tukey = {seuil_haut:.2f}")`,
            tags: ["corr", "quantile", "IQR", "Tukey", "outlier"],
          },
        ],
      },
      {
        id: "py-v1-ols",
        title: "2. Régression MCO / OLS & Algèbre Matricielle",
        subtitle: "Estimer les paramètres, tester leur significativité et mesurer R²",
        entries: [
          {
            id: "py-v1-ols-fit",
            title: "Spécification OLS & Ordonnée à l'Origine (sm.add_constant)",
            exerciseRef: "Ex. 8–9, 15",
            syntax: "X = sm.add_constant(df[['x1', 'x2']]); model = sm.OLS(y, X).fit()",
            formula: r`$$Y_t = \beta_0 + \beta_1 X_{1,t} + \dots + \beta_K X_{K,t} + \varepsilon_t$$`,
            description:
              "`sm.OLS` **n'ajoute pas** automatiquement de constante $\\beta_0$ : il faut impérativement passer `sm.add_constant(...)`. Notez l'ordre `(y, X)` (variable expliquée en premier !).",
            exampleCode: r`import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
y = df['oat_10y']
model = sm.OLS(y, X).fit()
print(model.summary())`,
            tags: ["statsmodels", "OLS", "add_constant", "fit", "summary"],
          },
          {
            id: "py-v1-student",
            title: "Paramètres, Student, Intervalles (.conf_int) & Prévision (.predict)",
            exerciseRef: "M2 Ex. 10–11 · M4 Ex. 11–13, 16",
            syntax: "model.params, model.pvalues, model.conf_int(alpha=0.05), model.predict([1.0, x1])",
            formula: r`$$t_j = \frac{\hat{\beta}_j}{\operatorname{SE}(\hat{\beta}_j)}, \qquad \hat{Y}^* = \hat{\beta}_0 \cdot 1 + \hat{\beta}_1 x_1^* + \dots + \hat{\beta}_K x_K^*$$`,
            description:
              "Rejet de $H_0 : \\beta_j = 0$ si `pvalues[var] < 0.05` (équivalent à `0` hors de `model.conf_int()`). Lors d'une prévision avec `.predict([...])`, passez impérativement `1.0` en première position pour la constante.",
            exampleCode: r`print(model.conf_int(alpha=0.05).round(4))
# Prévision OAT 10Y si Euribor = 3.0% et Inflation = 2.5% (dans un modèle à 2 régresseurs)
# prev = float(model_alm.predict([1.0, 3.0, 2.5])[0])
print("P-val Euribor :", f"{model.pvalues['euribor_3m']:.4e}")`,
            tags: ["params", "pvalues", "tvalues", "conf_int", "predict", "Student"],
          },
          {
            id: "py-v1-r2-fstat",
            title: "Qualité d'Ajustement (R², R² Ajusté) & Test de Fisher",
            exerciseRef: "Ex. 12, 16",
            syntax: "model.rsquared, model.rsquared_adj, model.fvalue, model.f_pvalue",
            formula: r`$$R^2 = 1 - \frac{SCR}{SCT}, \quad \bar{R}^2 = 1 - \frac{SCR / (N - K - 1)}{SCT / (N - 1)}, \quad F = \frac{SCE / K}{SCR / (N - K - 1)}$$`,
            description:
              "$R^2$ augmente mécaniquement dès qu'on ajoute une variable ; $\\bar{R}^2$ pénalise les degrés de liberté. La statistique $F$ teste la significativité conjointe de toutes les variables explicatives.",
            exampleCode: r`print(f"R² : {model.rsquared:.4f} | R² ajusté : {model.rsquared_adj:.4f}")
print(f"F-stat : {model.fvalue:.2f} | Prob(F) : {model.f_pvalue:.4e}")`,
            tags: ["rsquared", "rsquared_adj", "fvalue", "f_pvalue", "Fisher", "R2"],
          },
          {
            id: "py-v1-ols-matrix",
            title: "Formule Matricielle MCO & Propriété des Résidus",
            exerciseRef: "Ex. 13–14",
            syntax: "beta = np.linalg.inv(X.T @ X) @ X.T @ y | model.resid",
            formula: r`$$\hat{\beta} = (X'X)^{-1}X'y, \qquad \frac{1}{N}\sum_{i=1}^N \hat{\varepsilon}_i = 0$$`,
            description:
              "Avec une constante dans $X$, les résidus $\\hat{\\varepsilon} = y - X\\hat{\\beta}$ (`model.resid`) ont toujours une moyenne nulle (aux erreurs d'arrondi flottant près) et sont orthogonaux aux régresseurs.",
            exampleCode: r`import numpy as np
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m']]).values
y = df['oat_10y'].values
beta_numpy = np.linalg.inv(X.T @ X) @ X.T @ y
print("Beta NumPy :", beta_numpy)`,
            tags: ["linalg.inv", "matrice", "resid", "résidus", "MCO"],
          },
        ],
      },
      {
        id: "py-v1-diag",
        title: "3. Diagnostics Économétriques (Gauss-Markov)",
        subtitle: "Vérifier colinéarité, homoscédasticité et normalité des erreurs",
        entries: [
          {
            id: "py-v1-vif",
            title: "Multicolinéarité : Facteur d'Inflation de Variance (VIF)",
            exerciseRef: "Ex. 17",
            syntax: "variance_inflation_factor(X.values, idx_col)",
            formula: r`$$VIF_j = \frac{1}{1 - R_j^2}$$`,
            description:
              "Mesure dans quelle mesure la variance de $\\hat{\\beta}_j$ est gonflée par la corrélation entre régresseurs. `idx_col = 0` correspond à la constante : commencez à `1` pour vos variables. Seuil d'alerte usuel : $VIF > 5$ ou $10$.",
            exampleCode: r`from statsmodels.stats.outliers_influence import variance_inflation_factor
import statsmodels.api as sm

X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
vif_euribor = variance_inflation_factor(X_multi.values, 1)
print(f"VIF Euribor : {vif_euribor:.3f}")`,
            tags: ["VIF", "multicolinéarité", "variance_inflation_factor"],
          },
          {
            id: "py-v1-bp-white",
            title: "Hétéroscédasticité : Breusch-Pagan & Robustesse White (HC1 / HC3)",
            exerciseRef: "M2 Ex. 18–19 · M4 Ex. 19–20",
            syntax: "het_breuschpagan(resid, X) | .fit(cov_type='HC1') | .fit(cov_type='HC3')",
            formula: r`$$LM = N \cdot R^2_{\text{aux}} \sim \chi^2(K)$$`,
            description:
              "Si la p-valeur de Breusch-Pagan est $< 0.05$, corrigez les écarts-types `.bse` via White (`HC1` ou **`HC3`**, recommandé sur petits échantillons $N < 50$ car il corrige par l'effet de levier $(1 - h_{tt})^2$). Les coefficients $\\hat{\\beta}$ restent inchangés.",
            exampleCode: r`from statsmodels.stats.diagnostic import het_breuschpagan
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
model = sm.OLS(df['oat_10y'], X).fit()
lm_stat, p_bp, _, _ = het_breuschpagan(model.resid, X)
print(f"Breusch-Pagan p-val : {p_bp:.4e}")

model_hc3 = sm.OLS(df['oat_10y'], X).fit(cov_type='HC3')
print("SE robustes HC3 :\n", model_hc3.bse)`,
            tags: ["Breusch-Pagan", "hétéroscédasticité", "HC1", "HC3", "White", "bse"],
          },
          {
            id: "py-v1-jb",
            title: "Normalité des Perturbations : Test de Jarque-Bera",
            exerciseRef: "Ex. 20",
            syntax: "jb_stat, p_val, skew, kurt = jarque_bera(model.resid)",
            formula: r`$$JB = \frac{N}{6}\left(S^2 + \frac{(K - 3)^2}{4}\right) \sim \chi^2(2)$$`,
            description:
              "Teste simultanément l'asymétrie ($S = 0$) et l'aplatissement gaussien ($K = 3$). Rejet de la normalité si `p_val < 0.05` (soit $JB > 5.99$).",
            exampleCode: r`from statsmodels.stats.stattools import jarque_bera

jb_stat, p_jb, skew, kurt = jarque_bera(model.resid)
print(f"JB = {jb_stat:.2f} | p-val = {p_jb:.4f} | Skew = {skew:.2f} | Kurt = {kurt:.2f}")`,
            tags: ["Jarque-Bera", "normalité", "skewness", "kurtosis"],
          },
        ],
      },
      {
        id: "py-v1-ts-alm",
        title: "4. Séries Temporelles, Matplotlib & Risque ALM",
        subtitle: "Éviter les régressions fallacieuses et chiffrer la sensibilité aux taux",
        entries: [
          {
            id: "py-v1-dw-adf",
            title: "Autocorrélation (Durbin-Watson) & Stationnarité (ADF)",
            exerciseRef: "Ex. 21–23",
            syntax: "durbin_watson(resid) | adfuller(serie.diff().dropna())",
            formula: r`$$DW = \frac{\sum_{t=2}^T (\hat{e}_t - \hat{e}_{t-1})^2}{\sum_{t=1}^T \hat{e}_t^2} \approx 2(1 - \hat{\rho}_1)$$`,
            description:
              "$DW \\approx 2$ indique l'absence d'autocorrélation d'ordre 1 ($DW \\ll 2 \\Rightarrow$ autocorrélation positive). Si `adfuller(serie)[1] > 0.05`, la série a une racine unitaire : travaillez en différences premières `.diff().dropna()`.",
            exampleCode: r`from statsmodels.stats.stattools import durbin_watson
from statsmodels.tsa.stattools import adfuller

print(f"Durbin-Watson : {durbin_watson(model.resid):.3f}")
oat_diff = df['oat_10y'].diff().dropna()
print(f"P-valeur ADF (différence 1re) : {adfuller(oat_diff)[1]:.4e}")`,
            tags: ["Durbin-Watson", "ADF", "adfuller", "diff", "stationnarité"],
          },
          {
            id: "py-v1-hac",
            title: "Estimation Robuste HAC de Newey-West",
            exerciseRef: "Ex. 24",
            syntax: "sm.OLS(y, X).fit(cov_type='HAC', cov_kwds={'maxlags': 2})",
            description:
              "Fournit des écarts-types convergents en présence simultanée d'hétéroscédasticité **et** d'autocorrélation sérielle jusqu'au retard `maxlags`.",
            exampleCode: r`import statsmodels.api as sm

df_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()
X_dyn = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp']])
model_hac = sm.OLS(df_diff['oat_10y'], X_dyn).fit(cov_type='HAC', cov_kwds={'maxlags': 2})
print(model_hac.summary())`,
            tags: ["HAC", "Newey-West", "maxlags", "autocorrélation"],
          },
          {
            id: "py-v1-plot-alm",
            title: "Graphiques, Duration, Convexité (Taylor Ordre 2) & VaR ALM",
            exerciseRef: "M2 Ex. 25–26 · M4 Ex. 25–26",
            syntax: "plt.scatter(...) / model.fittedvalues | -D_mod * dy * V0 + 0.5 * C * (dy**2) * V0",
            formula: r`$$\frac{\Delta V}{V_0} \approx -D^* \Delta y + \frac{1}{2} C (\Delta y)^2 \qquad ; \qquad \operatorname{VaR}_{95\%} = -(\mu - 1.645\,\sigma)$$` +
              "\n\n" +
              r`$$\operatorname{VaR}_{99.5\%} \text{ (Solvabilité II)} : z_{0.995} \approx 2.576 \implies \Delta V_{\text{SCR}} \approx -D^* \cdot (2.576\,\sigma_{\text{ann}}) \cdot V_0$$`,
            description:
              "`plt.scatter(x, y)` + `plt.plot(x, model.fittedvalues)` visualise la droite MCO. En risque bilanciel : le développement de Taylor à l'ordre 2 combine la **duration modifiée** $D^*$ et la **convexité** $C > 0$ (qui amortit la perte lors d'une hausse de taux $\\Delta y > 0$), tandis que la VaR paramétrique chiffre le quantile de perte à $95\\%$ ($z = 1.645$) ou $99.5\\%$ (SCR Solvabilité II).",
            exampleCode: r`# 1. Taylor ordre 1 & ordre 2 sur portefeuille obligataire (+200 bps = +0.02)
V0, D_mod, C, dy = 100_000_000, 7.0, 60.0, 0.02
perte_ord1 = -D_mod * dy * V0
perte_ord2 = perte_ord1 + 0.5 * C * (dy ** 2) * V0
print(f"Ordre 1 : {perte_ord1:,.2f} EUR | Ordre 2 (avec convexité) : {perte_ord2:,.2f} EUR")

# 2. VaR paramétrique 95% sur le CAC 40
mu, sigma = df['cac40_rendement'].mean(), df['cac40_rendement'].std()
var_95 = -(mu - 1.645 * sigma)
print(f"VaR 95% CAC 40 : {var_95:.2f}%")`,
            tags: ["matplotlib", "scatter", "fittedvalues", "duration", "convexité", "Taylor", "ALM", "VaR", "Solvabilité II"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V1 — MODULE 5 : PYTHON PROGRAMMATION POUR LA FINANCE (BASES -> ALM)
  // =========================================================================
  {
    moduleId: "python-bases-finance",
    version: "V1",
    moduleNumber: 5,
    title: "Python Programmation : Fonctions, Boucles & Finance (M5)",
    language: "python",
    overview:
      "Toutes les briques de programmation Python pure du Module 5 (24 exercices) : variables typées et f-strings, branchements if/elif/else, listes/slicing, dictionnaires, boucles for/enumerate et while (bissection), fonctions réutilisables def/return, compréhensions, algèbre matricielle sans NumPy et simulation Monte Carlo.",
    datasetsSummary: [
      "Bibliothèque standard : math (sqrt, exp, log), random (seed, gauss), time (perf_counter)",
      "Structures natives Python (list, dict, tuple) appliquées aux flux de trésorerie, portefeuilles et sinistres",
      "Benchmarks & ALM : comparaison boucle pure Python vs NumPy (Ex. 23) et stress-test de bilan multi-fonctions (Ex. 24)",
    ],
    sections: [
      {
        id: "py-v1-m5-bases",
        title: "1. Variables, Conditions & Structures de Données",
        subtitle: "Typage financier, barèmes conditionnels, listes et dictionnaires",
        entries: [
          {
            id: "py-v1-m5-vars-fstring",
            title: "Variables typées, capitalisation & formatage f-string",
            exerciseRef: "M5 Ex. 1–2",
            syntax: 'C_n = C_0 * (1 + r) ** n ; f"{valeur:,.2f}"',
            formula: r`$$C_n = C_0 (1 + r_{\text{ann}})^n \qquad ; \qquad r_{\text{mens}} = (1 + r_{\text{ann}})^{1/12} - 1$$`,
            description:
              "En Python, utilisez des flottants (`float`) ou entiers (`int`, avec séparateur `_` comme `25_000`) et privilégiez l'opérateur puissance `**` pour la capitalisation composée. Les f-strings formatent proprement montants (`:,.2f`) et taux (`:.4%`).",
            exampleCode: r`C0, r_ann, n = 25_000, 0.035, 4
C_n = C0 * (1 + r_ann) ** n
r_mens = (1 + r_ann) ** (1 / 12) - 1
print(f"Valeur future : {C_n:,.2f} EUR | Taux mensuel eq. : {r_mens:.4%}")`,
            tags: ["variables", "float", "f-string", "capitalisation", "taux équivalent"],
          },
          {
            id: "py-v1-m5-if-elif",
            title: "Branchements conditionnels if / elif / else (Barèmes & Triggers)",
            exerciseRef: "M5 Ex. 3–4",
            syntax: "if cond1: ... elif cond2: ... else: ...",
            formula: r`$$\text{SCR Ratio} = \frac{\text{Fonds Propres}}{\text{SCR}} \qquad ; \qquad \text{Bonus}_{t+1} = \max(0.50,\; \text{clip})$$`,
            description:
              "`if / elif / else` évalue des paliers mutuellement exclusifs de haut en bas (barème de frais, classification Solvabilité II, règle de bonus-malus). Écrivez les bornes dans un ordre strictement monotone (croissant ou décroissant).",
            exampleCode: r`ratio_scr = 1.42
if ratio_scr >= 1.50:
    statut = "CONFORTABLE"
elif ratio_scr >= 1.00:
    statut = "VIGILANCE"
else:
    statut = "ALERTE_SCR"
print(statut)`,
            tags: ["if", "elif", "else", "Solvabilité II", "barème"],
          },
          {
            id: "py-v1-m5-lists-slicing",
            title: "Listes, slicing [start:stop] & moyenne mobile glissante",
            exerciseRef: "M5 Ex. 5–6",
            syntax: "liste[i - w + 1 : i + 1] | zip(prix[:-1], prix[1:])",
            formula: r`$$R_t = \frac{P_t - P_{t-1}}{P_{t-1}} \qquad ; \qquad \text{MM}_k(t) = \frac{1}{k}\sum_{j=t-k+1}^{t} P_j$$`,
            description:
              "Le slicing `[a:b]` extrait une sous-liste semi-ouverte (inclut `a`, exclut `b`). En finance de marché, `zip(prix[:-1], prix[1:])` aligne instantanément $P_{t-1}$ et $P_t$ sans erreur d'indice.",
            exampleCode: r`prix = [100.0, 102.0, 99.96, 103.5, 105.0]
rendements = [(p1 - p0) / p0 for p0, p1 in zip(prix[:-1], prix[1:])]
mm3 = [sum(prix[i-2:i+1]) / 3 for i in range(2, len(prix))]
print(rendements, mm3)`,
            tags: ["list", "slicing", "zip", "rendement", "moyenne mobile"],
          },
          {
            id: "py-v1-m5-dicts",
            title: "Dictionnaires clé-valeur, .get() & agrégation par secteur",
            exerciseRef: "M5 Ex. 7–8",
            syntax: "d.get(cle, 0.0) | for k, v in d.items(): ...",
            formula: r`$$V_{\text{ptf}} = \sum_{a \in \mathcal{A}} q_a P_a \qquad ; \qquad w_s = \frac{\sum_{a \in s} V_a}{V_{\text{ptf}}}$$`,
            description:
              "Un dictionnaire associe un actif ou secteur à sa valorisation ou son poids en $O(1)$. Utilisez `d.get(cle, 0.0)` lors de l'accumulation par catégorie pour éviter `KeyError`, et `.items()` pour itérer sur paires `(cle, valeur)`.",
            exampleCode: r`positions = [("AAPL", "Tech", 12000), ("MSFT", "Tech", 8000), ("TTE", "Energie", 10000)]
par_secteur = {}
for _, secteur, val in positions:
    par_secteur[secteur] = par_secteur.get(secteur, 0.0) + val
total = sum(par_secteur.values())
poids = {s: v / total for s, v in par_secteur.items()}`,
            tags: ["dict", "get", "items", "allocation", "portefeuille"],
          },
        ],
      },
      {
        id: "py-v1-m5-loops",
        title: "2. Boucles for, while & Algorithmes Numériques",
        subtitle: "Actualisation DCF, bissection de TRI, drawdown et matrices",
        entries: [
          {
            id: "py-v1-m5-for-enumerate",
            title: "Boucles for & enumerate(flux, start=1) — Actualisation VAN",
            exerciseRef: "M5 Ex. 9–10 · Ex. 18",
            syntax: "for t, cf in enumerate(flux, start=1): van += cf / (1 + y) ** t",
            formula: r`$$\operatorname{VAN}(y) = -I_0 + \sum_{t=1}^{T} \frac{CF_t}{(1 + y)^t}$$`,
            description:
              "`enumerate(flux, start=1)` fournit simultanément l'indice temporel $t \\ge 1$ et le cash-flow $CF_t$, idéal pour sommer des flux actualisés ou bâtir un tableau d'amortissement d'emprunt ligne par ligne.",
            exampleCode: r`def van(flux, taux, investissement=0.0):
    total = -investissement
    for t, cf in enumerate(flux, start=1):
        total += cf / ((1 + taux) ** t)
    return total

print(round(van([5, 5, 105], 0.04, 100.0), 4))`,
            tags: ["for", "enumerate", "VAN", "actualisation", "cash-flows"],
          },
          {
            id: "py-v1-m5-while-bissection",
            title: "Boucle while — Recherche de TRI / YTM par bissection (dichotomie)",
            exerciseRef: "M5 Ex. 17 · Ex. 20",
            syntax: "while (hi - lo) > tol and it < max_iter: mid = 0.5 * (lo + hi)",
            formula: r`$$\operatorname{VAN}(y^*) = 0 \implies y_{k+1} = \frac{y_{\text{lo}} + y_{\text{hi}}}{2}$$`,
            description:
              "Quand une boucle n'a pas un nombre connu d'itérations (convergence d'un taux actuariel TRI ou durée de réinvestissement), `while` réduit l'intervalle `[lo, hi]` de moitié tant que la tolérance `1e-7` n'est pas atteinte, avec un garde-fou `max_iter`.",
            exampleCode: r`def tri_bissection(flux, invest, lo=-0.99, hi=2.0, tol=1e-7):
    f_lo = -invest + sum(cf / (1 + lo) ** t for t, cf in enumerate(flux, 1))
    for _ in range(100):
        mid = 0.5 * (lo + hi)
        f_mid = -invest + sum(cf / (1 + mid) ** t for t, cf in enumerate(flux, 1))
        if abs(f_mid) < tol or (hi - lo) / 2 < tol:
            return mid
        if f_lo * f_mid <= 0:
            hi = mid
        else:
            lo, f_lo = mid, f_mid
    return 0.5 * (lo + hi)`,
            tags: ["while", "bissection", "dichotomie", "TRI", "YTM"],
          },
          {
            id: "py-v1-m5-drawdown",
            title: "Tracking séquentiel en O(N) — Pic historique & Max Drawdown",
            exerciseRef: "M5 Ex. 11 · Ex. 21",
            syntax: "if v > pic: pic = v ; dd = (v - pic) / pic",
            formula: r`$$M_t = \max_{0 \le s \le t} V_s \qquad ; \qquad DD_t = \frac{V_t - M_t}{M_t} \le 0$$`,
            description:
              "En conservant le sommet courant `pic` et le pire creux `mdd` en mémoire dans une seule passe `for`, on calcule le Max Drawdown en temps $O(N)$ et mémoire $O(1)$.",
            exampleCode: r`nav = [100, 108, 95, 92, 104, 112]
pic, mdd = nav[0], 0.0
for v in nav:
    if v > pic:
        pic = v
    dd = (v - pic) / pic
    if dd < mdd:
        mdd = dd
print(f"Max Drawdown : {mdd:.2%}")`,
            tags: ["drawdown", "algorithme", "O(N)", "risque", "boucle for"],
          },
          {
            id: "py-v1-m5-nested-matrix",
            title: "Double boucle imbriquée & produit quadratique w' Sigma w",
            exerciseRef: "M5 Ex. 16 · Ex. 22",
            syntax: "for i in range(n): for j in range(n): var += w[i] * cov[i][j] * w[j]",
            formula: r`$$\sigma_p^2 = \mathbf{w}^\top \Sigma \mathbf{w} = \sum_{i=1}^{n} \sum_{j=1}^{n} w_i \, w_j \, \Sigma_{ij}$$`,
            description:
              "Avant de vectoriser sous NumPy, comprendre la double boucle imbriquée (`i` lignes, `j` colonnes) rend explicite la complexité $O(n^2)$ de la variance de portefeuille ou d'une grille d'options 2D `(S, sigma)`.",
            exampleCode: r`import math
w = [0.6, 0.4]
cov = [[0.04, 0.006], [0.006, 0.01]]
var_p = 0.0
for i in range(len(w)):
    for j in range(len(w)):
        var_p += w[i] * cov[i][j] * w[j]
vol_p = math.sqrt(var_p)`,
            tags: ["boucles imbriquées", "matrice", "Markowitz", "covariance", "grille 2D"],
          },
        ],
      },
      {
        id: "py-v1-m5-funcs",
        title: "3. Fonctions def / return, Compréhensions & Projets Finance",
        subtitle: "Architecture modulaire, programmation défensive et Monte Carlo pur Python",
        entries: [
          {
            id: "py-v1-m5-def-return",
            title: "Fonctions def, paramètres par défaut & retour multiple (tuple)",
            exerciseRef: "M5 Ex. 12–13",
            syntax: "def prix_et_duration(nominal, taux_c, mat, ytm=0.03): return prix, d_mod",
            formula: r`$$P = \sum_{t=1}^{T} \frac{C}{(1+y)^t} + \frac{N}{(1+y)^T} \qquad ; \qquad D^* = \frac{1}{1+y} \sum_{t=1}^{T} t \cdot \frac{PV(CF_t)}{P}$$`,
            description:
              "`def` encapsule une formule métier testable et réutilisable ; privilégiez toujours `return` (renvoyer une valeur ou un tuple `(prix, d_mod)`) plutôt qu'un simple `print()` qui ne peut pas être réutilisé en aval.",
            exampleCode: r`def obligation(nominal, coupon_rate, T, ytm=0.03):
    coupon = nominal * coupon_rate
    flux = [coupon] * (T - 1) + [coupon + nominal]
    pvs = [cf / (1 + ytm) ** t for t, cf in enumerate(flux, 1)]
    prix = sum(pvs)
    mac = sum(t * pv for t, pv in enumerate(pvs, 1)) / prix
    return prix, mac / (1 + ytm)

p, d_mod = obligation(1000, 0.04, 5, ytm=0.035)`,
            tags: ["def", "return", "tuple", "unpacking", "duration"],
          },
          {
            id: "py-v1-m5-guardrails",
            title: "Programmation défensive : garde-fous & retour structuré (dict)",
            exerciseRef: "M5 Ex. 14",
            syntax: 'if vol <= 0: raise ValueError("...") | return {"sharpe": ..., "alerte": ...}',
            formula: r`$$\operatorname{Sharpe} = \frac{R_p - R_f}{\sigma_p}, \quad \sigma_p > 0 \qquad ; \qquad \operatorname{Sortino} = \frac{R_p - R_f}{\sigma_{\text{down}}}$$`,
            description:
              "En production quantitative, validez les bornes d'entrée dès les premières lignes de la fonction (`guard clauses`) pour éviter des divisions par zéro ou des résultats silencieux aberrants, puis renvoyez un dictionnaire nommé facile à inspecter.",
            exampleCode: r`def ratio_sharpe(rendements, rf=0.0):
    if len(rendements) < 2:
        raise ValueError("Il faut au moins 2 observations")
    mu = sum(rendements) / len(rendements)
    var = sum((r - mu) ** 2 for r in rendements) / (len(rendements) - 1)
    if var == 0.0:
        raise ValueError("Volatilite nulle")
    return {"moyenne": mu, "vol": var ** 0.5, "sharpe": (mu - rf) / (var ** 0.5)}`,
            tags: ["raise", "ValueError", "guardrails", "dict return", "Sharpe"],
          },
          {
            id: "py-v1-m5-comprehensions",
            title: "List & Dict Comprehensions (Filtrage & Transformation concise)",
            exerciseRef: "M5 Ex. 15 · Ex. 19",
            syntax: "[f(x) for x in seq if cond(x)] | {k: g(v) for k, v in d.items()}",
            formula: r`$$S_{\text{graves}} = \{ s \in \mathcal{S} \mid C_s > 5000 \}$$`,
            description:
              "Les compréhensions remplacent une boucle `for` + `.append()` en une expression lisible pour filtrer des sinistres graves, normaliser des expositions ou réindexer des dictionnaires.",
            exampleCode: r`sinistres = [800, 6200, 1400, 12500, 4900]
graves = [c for c in sinistres if c > 5000]
ratios = {f"S{i}": c / 5000 for i, c in enumerate(graves, 1)}`,
            tags: ["list comprehension", "dict comprehension", "filtrage", "pythonique"],
          },
          {
            id: "py-v1-m5-mc-alm",
            title: "Simulation Monte Carlo pure Python & pipeline ALM multi-fonctions",
            exerciseRef: "M5 Ex. 23–24",
            syntax: "random.seed(42); Z = random.gauss(0, 1) ; math.exp((r - 0.5*sig**2)*T + sig*sqrt(T)*Z)",
            formula: r`$$S_T^{(i)} = S_0 \exp\!\left(\left(r - \frac{1}{2}\sigma^2\right)T + \sigma\sqrt{T}\,Z^{(i)}\right), \quad Z^{(i)} \sim \mathcal{N}(0, 1)$$`,
            description:
              "En pur Python (`random.gauss` + `math.exp`), une boucle génère $N$ trajectoires indépendantes. L'exercice 23 montre ensuite comment NumPy vectorisé accélère d'un facteur $> 10\\times$ ce même algorithme sur grand portefeuille, et l'exercice 24 assemble plusieurs fonctions `def` en un stress-test ALM complet.",
            exampleCode: r`import math, random
random.seed(42)
S0, K, r, sig, T, N = 100.0, 100.0, 0.03, 0.20, 1.0, 5000
payoffs = []
for _ in range(N):
    z = random.gauss(0.0, 1.0)
    ST = S0 * math.exp((r - 0.5 * sig**2) * T + sig * math.sqrt(T) * z)
    payoffs.append(max(ST - K, 0.0))
call_mc = math.exp(-r * T) * sum(payoffs) / N`,
            tags: ["Monte Carlo", "random.gauss", "math.exp", "Black-Scholes", "ALM"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V2 — MODULE 1 : SQL AVANCÉ & DATA ENGINEERING FINANCIER
  // =========================================================================
  {
    moduleId: "sql-quant",
    version: "V2",
    moduleNumber: 1,
    title: "SQL Avancé & Data Engineering Financier",
    language: "sql",
    overview:
      "Fenêtres glissantes de marché, log-rendements, drawdown, jointures temporelles ASOF, CTE récursives, covariance SQL et backtesting anti-lookahead.",
    datasetsSummary: [
      "marche_actions : id, date, ticker, nom_societe, secteur, prix_ouverture, prix_haut, prix_bas, prix_cloture, volume, rendement_journalier",
      "courbe_taux_oat : date, taux_1y, taux_2y, taux_5y, taux_10y, taux_20y, taux_30y",
      "portefeuilles_actifs : ticker, nom, secteur, classe_actif, rendement_espere, volatilite, beta_marche, score_esg, ratio_sharpe",
      "matrice_correlations : actif_a, actif_b, correlation",
    ],
    sections: [
      {
        id: "sql-v2-ts",
        title: "1. Séries Financières, Fenêtres Glissantes & Drawdown",
        subtitle: "Calculer des rendements continus, moyennes mobiles et pertes maximales",
        entries: [
          {
            id: "sql-v2-logret",
            title: "Log-Rendements Journaliers (LN & LAG)",
            exerciseRef: "Ex. 1",
            syntax: "LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date))",
            formula: r`$$r_t = \ln\left(\frac{P_t}{P_{t-1}}\right)$$`,
            description:
              "Le log-rendement est additif dans le temps ($r_{t_0 \\to t_k} = \\sum r_t$). `LAG` récupère la clôture $P_{t-1}$ ordonnée par `date` (utilisez `PARTITION BY ticker` si plusieurs actions).",
            exampleCode: r`SELECT date,
       prix_cloture,
       LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log
FROM marche_actions
WHERE ticker = 'TTE'
ORDER BY date;`,
            tags: ["LN", "LAG", "log-rendement", "marche_actions", "OVER"],
          },
          {
            id: "sql-v2-sma-golden",
            title: "Fenêtre Mobile (ROWS BETWEEN) & Signal Golden Cross",
            exerciseRef: "Ex. 2–3",
            syntax: "AVG(col) OVER (ORDER BY date ROWS BETWEEN k PRECEDING AND CURRENT ROW)",
            description:
              "`ROWS BETWEEN k PRECEDING AND CURRENT ROW` inclut la ligne courante plus les $k$ lignes précédentes (donc $k+1$ jours au total). On génère un signal via `CASE WHEN sma_courte >= sma_longue THEN 'ACHAT' ...`.",
            exampleCode: r`SELECT date,
       prix_cloture,
       AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2,
       AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4
FROM marche_actions
WHERE ticker = 'MC'
ORDER BY date;`,
            tags: ["ROWS BETWEEN", "PRECEDING", "CURRENT ROW", "moyenne mobile", "Golden Cross"],
          },
          {
            id: "sql-v2-drawdown",
            title: "Maximum Drawdown Cumulatif (UNBOUNDED PRECEDING)",
            exerciseRef: "Ex. 4",
            syntax: "MAX(prix) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
            formula: r`$$\text{Drawdown}_t \text{ (\%)} = \frac{P_t - \max_{u \le t} P_u}{\max_{u \le t} P_u} \times 100$$`,
            description:
              "Calcule le sommet historique atteint jusqu'à la date $t$ (*running peak*), puis mesure l'écart relatif en pourcentage par rapport à ce plus haut.",
            exampleCode: r`SELECT date,
       prix_cloture,
       MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule,
       ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW))
        / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct
FROM marche_actions
WHERE ticker = 'TTE'
ORDER BY date;`,
            tags: ["drawdown", "UNBOUNDED PRECEDING", "running peak", "MAX"],
          },
        ],
      },
      {
        id: "sql-v2-struct",
        title: "2. Quantiles, Jointures Asynchrones & CTE Récursives",
        subtitle: "Segmenter, aligner des horodatages différents et construire des arbres",
        entries: [
          {
            id: "sql-v2-ntile",
            title: "Déciles & Quantiles de Performance (NTILE)",
            exerciseRef: "Ex. 5",
            syntax: "NTILE(k) OVER (ORDER BY rendement_journalier DESC)",
            description:
              "Découpe les lignes en $k$ groupes égaux (quartiles pour $k=4$, déciles pour $k=10$, moitié haute/basse pour $k=2$) pour construire des portefeuilles *Long-Short*.",
            exampleCode: r`SELECT ticker, nom_societe, rendement_journalier,
       NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf
FROM marche_actions
WHERE date = '2024-01-02'
ORDER BY rendement_journalier DESC;`,
            tags: ["NTILE", "quantiles", "déciles", "ranking"],
          },
          {
            id: "sql-v2-asof",
            title: "Jointure Temporelle Asynchrone (ASOF Join / Forward-Fill)",
            exerciseRef: "Ex. 6",
            syntax: "(SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1)",
            description:
              "Lorsque deux séries n'ont pas exactement les mêmes dates (ex. jours ouvrés vs courbe OAT), une sous-requête corrélée `date <= m.date ORDER BY date DESC LIMIT 1` récupère la dernière observation connue **sans fuite du futur**.",
            exampleCode: r`SELECT m.date, m.ticker, m.prix_cloture,
       (SELECT taux_10y
        FROM courbe_taux_oat
        WHERE date <= m.date
        ORDER BY date DESC
        LIMIT 1) AS dernier_taux_10y
FROM marche_actions m
WHERE m.ticker = 'AI'
ORDER BY m.date;`,
            tags: ["ASOF", "forward-fill", "courbe_taux_oat", "sous-requête corrélée"],
          },
          {
            id: "sql-v2-recursive",
            title: "CTE Récursive & Arbre Binomial CRR (WITH RECURSIVE)",
            exerciseRef: "Ex. 7–8",
            syntax: "WITH RECURSIVE arbre(n, prix) AS (base UNION ALL récursion WHERE n < N)",
            formula: r`$$S_{n+1} = S_n \cdot u, \qquad u = 1.05$$`,
            description:
              "Permet d'itérer jusqu'à une condition d'arrêt (arbre binomial, amortissement) directement en SQL. Pour filtrer une matrice symétrique (`matrice_correlations`), excluez la diagonale avec `actif_a != actif_b`.",
            exampleCode: r`WITH RECURSIVE arbre(n, prix) AS (
  SELECT 0, 100.0
  UNION ALL
  SELECT n + 1, prix * 1.05
  FROM arbre
  WHERE n < 3
)
SELECT n, prix FROM arbre ORDER BY n;`,
            tags: ["WITH RECURSIVE", "CTE", "arbre binomial", "matrice_correlations"],
          },
        ],
      },
      {
        id: "sql-v2-quant",
        title: "3. Anomalies, Multi-Actifs & Covariance Empirique",
        subtitle: "Détecter les pics de volume, pondérer un portefeuille et estimer Cov(X,Y)",
        entries: [
          {
            id: "sql-v2-partition-filter",
            title: "Filtrer sur une Window Function (Sous-Requête Externe)",
            exerciseRef: "Ex. 9–10",
            syntax: "SELECT * FROM (SELECT ..., AVG(vol) OVER (PARTITION BY ticker) AS moy) WHERE vol > 1.15 * moy;",
            description:
              "SQL évalue `WHERE` avant les window functions : enveloppez le calcul `OVER (PARTITION BY ...)` dans une sous-requête (ou CTE) pour filtrer les anomalies de volume. Pour `portefeuilles_actifs`, filtrez directement sur `score_esg` et `ratio_sharpe`.",
            exampleCode: r`SELECT date, ticker, volume, vol_moyen
FROM (
  SELECT date, ticker, volume,
         AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen
  FROM marche_actions
)
WHERE volume > 1.15 * vol_moyen
ORDER BY date;`,
            tags: ["PARTITION BY", "anomalie", "volume", "sharpe", "ESG"],
          },
          {
            id: "sql-v2-selfjoin-cov",
            title: "Portefeuille 60/40 (Self-Join) & Covariance SQL",
            exerciseRef: "Ex. 11–12",
            syntax: "AVG(b.r * t.r) - AVG(b.r) * AVG(t.r)",
            formula: r`$$\operatorname{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]$$`,
            description:
              "En alignant deux actifs à la même `date` via une auto-jointure (`JOIN marche_actions t ON b.date = t.date`), on valorise un portefeuille pondéré ou on calcule leur covariance via la formule de Koenig-Huygens.",
            exampleCode: r`SELECT (AVG(b.rendement_journalier * t.rendement_journalier)
        - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee
FROM marche_actions b
JOIN marche_actions t ON b.date = t.date
WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';`,
            tags: ["covariance", "self-join", "portefeuille", "AVG", "Koenig-Huygens"],
          },
        ],
      },
      {
        id: "sql-v2-perf-backtest",
        title: "4. Optimisation, Backtesting & Agrégation Sectorielle",
        subtitle: "Auditer le moteur SQLite, éviter le lookahead bias et consolider",
        entries: [
          {
            id: "sql-v2-explain",
            title: "Plan d'Exécution (EXPLAIN QUERY PLAN) & Agrégats Sectoriels",
            exerciseRef: "Ex. 13, 15",
            syntax: "EXPLAIN QUERY PLAN SELECT ...;",
            description:
              "Affiche si SQLite réalise un `SEARCH` instantané sur index/clé primaire ou un `SCAN` séquentiel coûteux sur toute la table. `GROUP BY secteur` consolide les métriques de `portefeuilles_actifs`.",
            exampleCode: r`EXPLAIN QUERY PLAN
SELECT * FROM marche_actions WHERE id = 5;`,
            tags: ["EXPLAIN QUERY PLAN", "index", "optimisation", "GROUP BY", "secteur"],
          },
          {
            id: "sql-v2-backtest",
            title: "Backtesting Momentum Sans Fuite du Futur (LAG)",
            exerciseRef: "Ex. 14",
            syntax: "LAG(CASE WHEN rendement > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement",
            formula: r`$$\text{PnL}_t = \text{Position}_{t-1} \cdot r_t$$`,
            description:
              "Règle cardinale du backtesting : la position prise pour le jour $t$ ne peut dépendre que du signal observé à la clôture $t-1$ (`LAG(..., 1)`), jamais du rendement du jour même.",
            exampleCode: r`SELECT date,
       rendement_journalier,
       LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1)
           OVER (ORDER BY date) AS position_hier,
       (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1)
           OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier
FROM marche_actions
WHERE ticker = 'CW8'
ORDER BY date;`,
            tags: ["backtesting", "LAG", "PnL", "lookahead", "momentum"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V2 — MODULE 2 : ALGÈBRE MATRICIELLE & ÉCONOMÉTRIE FINANCIÈRE
  // =========================================================================
  {
    moduleId: "python-finance-econometrics",
    version: "V2",
    moduleNumber: 2,
    title: "Algèbre Matricielle & Économétrie Financière",
    language: "python",
    overview:
      "Calcul matriciel vectorisé NumPy, décomposition spectrale & PSD, PCA, Random Matrix Theory, frontière de Markowitz, modèles factoriels, GARCH(1,1) et mesures de risque (VaR / CVaR).",
    datasetsSummary: [
      "Imports principaux : numpy (np), statsmodels.api (sm), matplotlib.pyplot (plt)",
      "Conventions : poids w (N,), rendements mu (N,), covariance Sigma (N x N), séries X (T lignes x N actifs)",
    ],
    sections: [
      {
        id: "py-v2-linalg",
        title: "1. Algèbre Matricielle, Covariance & Cône PSD",
        subtitle: "Manipuler vecteurs de poids et nettoyer des matrices de covariance bruitées",
        entries: [
          {
            id: "py-v2-matmul",
            title: "Portefeuille Vectorisé : Produit Matriciel (@ et .T)",
            exerciseRef: "Ex. 1–2",
            syntax: "w @ mu | w @ Sigma @ w | np.cov(X, rowvar=False)",
            formula: r`$$\mathbb{E}[R_p] = w'\mu, \qquad \sigma_p^2 = w'\Sigma w, \qquad \sigma_p = \sqrt{w'\Sigma w}$$`,
            description:
              "En NumPy 1D, `w @ Sigma @ w` calcule directement la forme quadratique $w'\\Sigma w$. Pour une matrice de rendements $(T \\times N)$ où chaque colonne est un actif, passez impérativement `rowvar=False` à `np.cov` et `np.corrcoef`.",
            exampleCode: r`import numpy as np

rendement = float(w @ mu)
variance = float(w @ Sigma @ w)
volatilite = float(np.sqrt(variance))
Sigma_emp = np.cov(X, rowvar=False)
C_emp = np.corrcoef(X, rowvar=False)`,
            tags: ["@", "matrice", "np.cov", "np.corrcoef", "rowvar"],
          },
          {
            id: "py-v2-eigh-psd",
            title: "Décomposition Spectrale (np.linalg.eigh) & Projection PSD",
            exerciseRef: "Ex. 3–4",
            syntax: "evals, V = np.linalg.eigh(Sigma) | V @ np.diag(np.maximum(evals, 1e-6)) @ V.T",
            formula: r`$$\Sigma = V \Lambda V', \qquad \lambda_i^+ = \max(\lambda_i, \epsilon)$$`,
            description:
              "`eigh` (spécifique aux matrices symétriques) garantit des valeurs propres réelles triées en ordre **croissant**. Si une corrélation estimée présente $\\lambda_{\\min} < 0$, seuiller à $10^{-6}$ rétablit la semi-définie positivité (variance toujours $\\ge 0$).",
            exampleCode: r`evals, V = np.linalg.eigh(Sigma_perturbee)
evals_psd = np.maximum(evals, 1e-6)
Sigma_psd = V @ np.diag(evals_psd) @ V.T`,
            tags: ["eigh", "valeurs propres", "PSD", "projection", "spectrale"],
          },
        ],
      },
      {
        id: "py-v2-rmt-lw",
        title: "2. PCA, Random Matrix Theory & Shrinkage",
        subtitle: "Séparer le signal économique réel du bruit d'échantillonnage",
        entries: [
          {
            id: "py-v2-pca-mp",
            title: "PCA Courbe des Taux & Borne de Marchenko-Pastur",
            exerciseRef: "Ex. 5–6",
            syntax: "evals_desc = evals[::-1] | lambda_plus = (1 + np.sqrt(N / T))**2",
            formula: r`$$\lambda_+ = \left(1 + \sqrt{\frac{N}{T}}\right)^2, \qquad \text{Variance expliquée}_k = \frac{\lambda_k}{\sum_{j=1}^N \lambda_j}$$`,
            description:
              "En PCA sur taux OAT, les 3 premières composantes (Niveau, Pente, Courbure) expliquent $>95\\%$ de la variance. En RMT (pour $\\sigma^2=1$), seules les valeurs propres $> \\lambda_+$ portent un véritable signal factoriel.",
            exampleCode: r`evals, _ = np.linalg.eigh(np.cov(dX, rowvar=False))
valeurs_triees = evals[::-1]
ratio_explique = valeurs_triees / valeurs_triees.sum()

lambda_plus = (1.0 + np.sqrt(N / T))**2
nb_signaux = int(np.sum(evals_obs > lambda_plus))`,
            tags: ["PCA", "Marchenko-Pastur", "RMT", "variance expliquée"],
          },
          {
            id: "py-v2-lw",
            title: "Rétrécissement de Covariance : Estimateur de Ledoit-Wolf",
            exerciseRef: "Ex. 7",
            syntax: "F = np.eye(N) * (np.trace(S) / N); Sigma_lw = (1 - alpha) * S + alpha * F",
            formula: r`$$\Sigma_{\text{LW}} = (1 - \alpha) S + \alpha F, \qquad F = \frac{\operatorname{Tr}(S)}{N} I_N$$`,
            description:
              "Stabilise l'inversion $\\Sigma^{-1}$ lors de l'optimisation de Markowitz en combinant la covariance empirique $S$ et une cible diagonale $F$ d'intensité $\\alpha \\in [0,1]$.",
            exampleCode: r`alpha = 0.25
N = Sigma_sample.shape[0]
F = np.eye(N) * (np.trace(Sigma_sample) / N)
Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F`,
            tags: ["Ledoit-Wolf", "shrinkage", "covariance", "trace"],
          },
        ],
      },
      {
        id: "py-v2-markowitz",
        title: "3. Optimisation de Portefeuille de Markowitz",
        subtitle: "GMVP, frontière efficiente analytique et portefeuille de tangence",
        entries: [
          {
            id: "py-v2-gmvp",
            title: "Portefeuille de Variance Minimale Globale (GMVP)",
            exerciseRef: "Ex. 8",
            syntax: "inv_Sigma = np.linalg.inv(Sigma); w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)",
            formula: r`$$w_{\text{GMVP}} = \frac{\Sigma^{-1}\mathbf{1}}{\mathbf{1}'\Sigma^{-1}\mathbf{1}}, \qquad \sigma_{\text{GMVP}} = \frac{1}{\sqrt{\mathbf{1}'\Sigma^{-1}\mathbf{1}}}$$`,
            description:
              "Solution analytique minimisant $w'\\Sigma w$ sous contrainte budgétaire $\\mathbf{1}'w = 1$, indépendante de l'estimation bruitée des rendements espérés $\\mu$.",
            exampleCode: r`inv_Sigma = np.linalg.inv(Sigma)
ones = np.ones(len(Sigma))
w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)
vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))`,
            tags: ["GMVP", "Markowitz", "variance minimale", "inv"],
          },
          {
            id: "py-v2-frontier",
            title: "Frontière Efficiente de Markowitz (Constantes A, B, C)",
            exerciseRef: "Ex. 9",
            syntax: "var_targets = (A * mu_targets**2 - 2 * B * mu_targets + C) / Delta",
            formula: r`$$A = \mathbf{1}'\Sigma^{-1}\mathbf{1}, \quad B = \mathbf{1}'\Sigma^{-1}\mu, \quad C = \mu'\Sigma^{-1}\mu, \quad \Delta = AC - B^2$$` +
              "\n\n" +
              r`$$\sigma^2(\mu_p) = \frac{A\mu_p^2 - 2B\mu_p + C}{\Delta}$$`,
            description:
              "Décrit l'enveloppe parabolique exacte des portefeuilles optimaux dans le plan $(\\sigma, \\mu)$ sans appel à un optimiseur numérique.",
            exampleCode: r`A = float(ones @ inv_Sigma @ ones)
B = float(ones @ inv_Sigma @ mu)
C = float(mu @ inv_Sigma @ mu)
Delta = A * C - B**2
vols = np.sqrt((A * mu_targets**2 - 2 * B * mu_targets + C) / Delta)`,
            tags: ["frontière efficiente", "Markowitz", "hyperbole", "parabole"],
          },
          {
            id: "py-v2-tangency",
            title: "Portefeuille de Tangence & Ratio de Sharpe Maximal",
            exerciseRef: "Ex. 10",
            syntax: "exces = mu - rf * ones; w_T = (inv_Sigma @ exces) / (ones @ inv_Sigma @ exces)",
            formula: r`$$w_T = \frac{\Sigma^{-1}(\mu - r_f\mathbf{1})}{\mathbf{1}'\Sigma^{-1}(\mu - r_f\mathbf{1})}, \qquad S_T = \frac{\mu_T - r_f}{\sigma_T}$$`,
            description:
              "Maximise la pente de la Capital Market Line (Sharpe). Combinaison de l'actif sans risque $r_f$ et du seul portefeuille risqué tangent $w_T$.",
            exampleCode: r`exces_mu = mu - rf * ones
w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)
mu_T = float(w_tangence @ mu)
vol_T = float(np.sqrt(w_tangence @ Sigma @ w_tangence))
sharpe_opt = (mu_T - rf) / vol_T`,
            tags: ["tangence", "Sharpe", "rf", "CML"],
          },
        ],
      },
      {
        id: "py-v2-factors-risk",
        title: "4. Modèles Factoriels, GARCH(1,1) & Queues Épaisses",
        subtitle: "Décomposer la performance et quantifier les pertes extrêmes",
        entries: [
          {
            id: "py-v2-capm-ff3",
            title: "CAPM (Alpha & Bêta) et Fama-French à 3 Facteurs",
            exerciseRef: "Ex. 11–12",
            syntax: "X = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML])); sm.OLS(Y, X).fit()",
            formula: r`$$R_i = \alpha + \beta R_m + \varepsilon \qquad ; \qquad Y_t = \alpha + \beta_m MKT_t + \beta_s SMB_t + \beta_h HML_t + \varepsilon_t$$`,
            description:
              "Estime l'Alpha de Jensen (`model.params[0]`) et les expositions factorielles (`model.params[1:]`) par OLS. Utilisez `np.column_stack([...])` pour assembler plusieurs arrays 1D NumPy.",
            exampleCode: r`import statsmodels.api as sm
import numpy as np

X_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))
model = sm.OLS(Y_port, X_factors).fit()
alpha, beta_m, beta_s, beta_h = model.params`,
            tags: ["CAPM", "Fama-French", "Alpha", "Bêta", "column_stack", "OLS"],
          },
          {
            id: "py-v2-garch",
            title: "Volatilité Conditionnelle : Processus GARCH(1,1)",
            exerciseRef: "Ex. 13",
            syntax: "sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]",
            formula: r`$$\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \beta \sigma_{t-1}^2, \qquad \sigma_{\text{LT}}^2 = \frac{\omega}{1 - (\alpha + \beta)}$$`,
            description:
              "Modélise le *clustering* de volatilité. La stationnarité en covariance exige $\\alpha + \\beta < 1$. Multiplier la volatilité journalière par $\\sqrt{252}$ l'annualise.",
            exampleCode: r`var_lt = omega / (1.0 - (alpha + beta))
sigma2[0] = var_lt
for t in range(1, T):
    sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]
    eps[t] = np.sqrt(sigma2[t]) * Z[t]`,
            tags: ["GARCH", "volatilité conditionnelle", "clustering", "variance long terme"],
          },
          {
            id: "py-v2-var-cvar",
            title: "Value-at-Risk (VaR 99%) & Expected Shortfall (CVaR)",
            exerciseRef: "Ex. 14",
            syntax: "pertes = -rendements; var = np.percentile(pertes, 99); cvar = pertes[pertes >= var].mean()",
            formula: r`$$\operatorname{VaR}_\alpha(L) = q_\alpha(L), \qquad \operatorname{CVaR}_\alpha(L) = \mathbb{E}[L \mid L \ge \operatorname{VaR}_\alpha(L)]$$`,
            description:
              "Convertissez d'abord les rendements en pertes ($L = -R$). La CVaR (moyenne au-delà de la VaR) est une mesure cohérente de risque exigée par Bâle III / Solvabilité II.",
            exampleCode: r`pertes = -rendements
var_99 = float(np.percentile(pertes, 99))
cvar_99 = float(pertes[pertes >= var_99].mean())
print(f"VaR 99% : {var_99:.2%} | CVaR 99% : {cvar_99:.2%}")`,
            tags: ["VaR", "CVaR", "Expected Shortfall", "percentile", "risque"],
          },
          {
            id: "py-v2-jb-tails",
            title: "Skewness, Kurtosis & Statistique Jarque-Bera NumPy",
            exerciseRef: "Ex. 15",
            syntax: "z = (r - np.mean(r)) / np.std(r, ddof=1); JB = len(r)/6 * (S**2 + (K-3)**2 / 4)",
            formula: r`$$S = \frac{1}{T}\sum z_t^3, \quad K = \frac{1}{T}\sum z_t^4, \quad JB = \frac{T}{6}\left(S^2 + \frac{(K - 3)^2}{4}\right)$$`,
            description:
              "Un kurtosis $K > 3$ (*leptokurtique*) signale des queues épaisses (*fat tails*, ex. loi de Student) fréquentes sur les marchés. Au seuil de 5 %, on rejette la normalité dès que $JB > 5.99$.",
            exampleCode: r`z = (r - np.mean(r)) / np.std(r, ddof=1)
skew = float(np.mean(z**3))
kurt = float(np.mean(z**4))
jb_stat = float(len(r) / 6.0 * (skew**2 + ((kurt - 3.0)**2) / 4.0))`,
            tags: ["Skewness", "Kurtosis", "Jarque-Bera", "fat tails", "ddof"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V2 — MODULE 3 : SIMULATIONS DE MONTE CARLO & MODÉLISATION STOCHASTIQUE
  // =========================================================================
  {
    moduleId: "python-monte-carlo",
    version: "V2",
    moduleNumber: 3,
    title: "Simulations de Monte Carlo & Modélisation Stochastique",
    language: "python",
    overview:
      "Génération pseudo-aléatoire, Cholesky, mouvement brownien, pricing d'options (vanille, BSM, asiatique, barrière), réduction de variance, sauts de Merton, Vasicek et ruine de Lundberg.",
    datasetsSummary: [
      "Imports principaux : numpy (np), scipy.stats.norm (norm), matplotlib.pyplot (plt)",
      "Bonne pratique : toujours initialiser np.random.seed(42) en début de simulation pour la reproductibilité",
    ],
    sections: [
      {
        id: "py-v2-mc-gen",
        title: "1. Générateurs, Cholesky & Mouvements Browniens",
        subtitle: "Simuler des aléas normaux, corrélés et des trajectoires continues",
        entries: [
          {
            id: "py-v2-boxmuller",
            title: "Graine Aléatoire & Algorithme de Box-Muller",
            exerciseRef: "Ex. 1",
            syntax: "np.random.seed(42) | Z1 = np.sqrt(-2.0 * np.log(U1)) * np.cos(2.0 * np.pi * U2)",
            formula: r`$$R = \sqrt{-2\ln U_1}, \qquad Z_1 = R\cos(2\pi U_2) \sim \mathcal{N}(0,1)$$`,
            description:
              "Transforme deux variables uniformes indépendantes $U_1, U_2 \\sim \\mathcal{U}(0,1)$ en une gaussienne centrée réduite exacte. Fixez `U1` à $\\ge 10^{-10}$ pour éviter $\\ln(0)$.",
            exampleCode: r`np.random.seed(42)
U1 = np.random.uniform(1e-10, 1.0, N)
U2 = np.random.uniform(0.0, 1.0, N)
Z1 = np.sqrt(-2.0 * np.log(U1)) * np.cos(2.0 * np.pi * U2)`,
            tags: ["seed", "Box-Muller", "uniform", "gaussienne"],
          },
          {
            id: "py-v2-cholesky",
            title: "Simulation Corrélée par Factorisation de Cholesky",
            exerciseRef: "Ex. 2",
            syntax: "L = np.linalg.cholesky(Sigma); X = (L @ Z).T",
            formula: r`$$\Sigma = L L' \quad \Longrightarrow \quad X = L Z \sim \mathcal{N}(0, \Sigma)$$`,
            description:
              "Pour $\\Sigma \\in \\mathbb{R}^{d \\times d}$ définie positive, `cholesky` produit la matrice triangulaire inférieure $L$. Si $Z \\sim \\mathcal{N}(0, I_d)$ est de taille `(d, N)`, alors `X = (L @ Z).T` a exactement la covariance cible $\\Sigma$.",
            exampleCode: r`L = np.linalg.cholesky(Sigma_cible)
Z = np.random.randn(3, 50000)
X = (L @ Z).T
cov_emp = np.cov(X, rowvar=False)`,
            tags: ["Cholesky", "corrélation", "linalg.cholesky", "multivariée"],
          },
          {
            id: "py-v2-wiener-gbm",
            title: "Mouvement Brownien (Wiener) & GBM Vectorisé",
            exerciseRef: "Ex. 3–4",
            syntax: "dW = np.sqrt(dt) * np.random.randn(M, N); W[:, 1:] = np.cumsum(dW, axis=1)",
            formula: r`$$W_{t+\Delta t} = W_t + \sqrt{\Delta t}\, Z_t \quad ; \quad S_T = S_0 \exp\left(\left(\mu - \frac{1}{2}\sigma^2\right)T + \sigma\sqrt{T}\, Z\right)$$`,
            description:
              "La correction d'Itô $-\\frac{1}{2}\\sigma^2$ assure que $\\mathbb{E}[S_T] = S_0 e^{\\mu T}$. Utilisez `np.cumsum(..., axis=1)` pour générer toutes les trajectoires sans boucle `for`.",
            exampleCode: r`# Simulation terminale exacte du GBM
Z = np.random.randn(N)
S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)`,
            tags: ["Wiener", "Brownien", "GBM", "Itô", "cumsum"],
          },
        ],
      },
      {
        id: "py-v2-mc-pricing",
        title: "2. Pricing Européen, Black-Scholes & Réduction de Variance",
        subtitle: "Valoriser sous Q, quantifier l'erreur et accélérer la convergence",
        entries: [
          {
            id: "py-v2-call-q",
            title: "Call Européen sous Mesure Risque-Neutre Q",
            exerciseRef: "Ex. 5",
            syntax: "np.exp(-r * T) * np.mean(np.maximum(S_T - K, 0.0))",
            formula: r`$$C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[\max(S_T - K, 0)]$$`,
            description:
              "En univers risque-neutre $\\mathbb{Q}$, on remplace la dérive réelle $\\mu$ du GBM par le taux sans risque $r$, puis on actualise la moyenne des payoffs au taux $e^{-rT}$.",
            exampleCode: r`Z = np.random.randn(N)
S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
payoffs = np.maximum(S_T - K, 0.0)
prix_call = float(np.exp(-r * T) * np.mean(payoffs))`,
            tags: ["Call", "risque-neutre", "payoff", "pricing", "options"],
          },
          {
            id: "py-v2-bsm",
            title: "Formule Fermée de Black-Scholes-Merton",
            exerciseRef: "Ex. 6",
            syntax: "S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)",
            formula: r`$$d_1 = \frac{\ln(S_0/K) + (r + \tfrac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}, \quad C_{\text{BS}} = S_0 \Phi(d_1) - K e^{-rT}\Phi(d_2)$$`,
            description:
              "Sert de benchmark analytique exact pour valider vos estimateurs Monte Carlo via `scipy.stats.norm.cdf`.",
            exampleCode: r`from scipy.stats import norm

d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
d2 = d1 - sigma * np.sqrt(T)
prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))`,
            tags: ["Black-Scholes", "norm.cdf", "d1", "d2", "benchmark"],
          },
          {
            id: "py-v2-ic-variance",
            title: "Erreur Standard, IC 95% & Réduction de Variance",
            exerciseRef: "Ex. 7–9",
            syntax: "se = s_N / np.sqrt(N) | Y_anti = 0.5 * (Y1 + Y2) | c_star = cov[0,1] / cov[1,1]",
            formula: r`$$SE = \frac{s_N}{\sqrt{N}}, \quad IC_{95\%} = \hat{C} \pm 1.96\, SE \qquad ; \qquad X_{\text{ctrl}} = X - c^*(Y - \mathbb{E}[Y])$$`,
            description:
              "La précision Monte Carlo converge lentement en $\\mathcal{O}(1/\\sqrt{N})$ : diviser l'erreur par 10 demande $100\\times$ plus de simulations. Utilisez les **variables antithétiques** ($+Z$ et $-Z$) ou une **variable de contrôle** ($Y = e^{-rT}S_T$, d'espérance connue $S_0$) avec $c^* = \\frac{\\operatorname{Cov}(X,Y)}{\\operatorname{Var}(Y)}$.",
            exampleCode: r`# Antithétiques (+Z et -Z)
Y_anti = 0.5 * (Y_plus_Z + Y_moins_Z)

# Contrôle optimal c* avec Y = e^(-rT) * S_T (E[Y] = S0)
cov_mat = np.cov(X, Y)
c_star = cov_mat[0, 1] / cov_mat[1, 1]
X_ctrl = X - c_star * (Y - S0)`,
            tags: ["IC 95%", "erreur standard", "antithétiques", "contrôle", "convergence"],
          },
        ],
      },
      {
        id: "py-v2-mc-exotic",
        title: "3. Exotiques Path-Dependent, Sauts, Taux & Ruine",
        subtitle: "Trajectoires 2D, jump-diffusion, full revaluation, Vasicek et Solvabilité II",
        entries: [
          {
            id: "py-v2-asian-barrier",
            title: "Options Path-Dependent : Asiatique & Barrière Knock-Out",
            exerciseRef: "Ex. 10–11",
            syntax: "S_mean = np.mean(S_paths, axis=1) | actifs_vivants = (np.min(S_paths, axis=1) > B)",
            formula: r`$$P_{\text{Asiatique}} = \max(\bar{S} - K, 0), \qquad P_{\text{DOC}} = \max(S_T - K, 0) \cdot \mathbf{1}_{\{\min_t S_t > B\}}$$`,
            description:
              "Simulez une matrice de trajectoires `S_paths` de taille `(N, M+1)`. `axis=1` agrège le long de chaque trajectoire temporelle (moyenne pour l'Asiatique, minimum pour la barrière Down-and-Out).",
            exampleCode: r`log_inc = (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * np.random.randn(N, M)
log_paths = np.zeros((N, M + 1))
log_paths[:, 1:] = np.cumsum(log_inc, axis=1)
S_paths = S0 * np.exp(log_paths)

prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * (np.min(S_paths, axis=1) > B)))`,
            tags: ["Asiatique", "Barrière", "Down-and-Out", "path-dependent", "axis=1"],
          },
          {
            id: "py-v2-merton-fullreval",
            title: "Sauts de Merton (Jump-Diffusion) & VaR Full Revaluation",
            exerciseRef: "Ex. 12–13",
            syntax: "nb_sauts = np.random.poisson(lambda_jump * T, N) | np.percentile(V0 - V_T, 99)",
            formula: r`$$\kappa = e^{\mu_J + \tfrac{1}{2}\sigma_J^2} - 1, \quad \text{drift} = (r - \lambda\kappa - \tfrac{1}{2}\sigma^2)T$$`,
            description:
              "Le modèle de Merton ajoute un processus de Poisson composé générant asymétrie et queues épaisses ($K > 3$). La **VaR Full Revaluation** réévalue exactement la valeur $V_T$ d'un portefeuille optionnel non linéaire sous chaque scénario.",
            exampleCode: r`kappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0
drift_corr = (r - lambda_jump * kappa - 0.5 * sigma**2) * T
nb_sauts = np.random.poisson(lambda_jump * T, N)

# Full Revaluation VaR 99% (portefeuille 10 actions - 10 calls)
V_T = 10.0 * S_T - 10.0 * np.maximum(S_T - K, 0.0)
var_mc_99 = float(np.percentile(V0 - V_T, 99))`,
            tags: ["Merton", "Poisson", "Jump-Diffusion", "Full Revaluation", "VaR"],
          },
          {
            id: "py-v2-vasicek-lundberg",
            title: "Taux de Vasicek (Euler) & Processus de Ruine de Lundberg",
            exerciseRef: "Ex. 14–15",
            syntax: "r_paths[:, t+1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z",
            formula: r`$$dr_t = \kappa(\theta - r_t)\,dt + \sigma\,dW_t \qquad ; \qquad U_T = u + c - \sum_{k=1}^{N(T)} X_k$$`,
            description:
              "Vasicek ramène le taux court vers l'équilibre $\\theta$ à vitesse $\\kappa$. Le modèle de Cramér-Lundberg simule $N(T) \\sim \\mathcal{P}(\\lambda)$ sinistres de sévérité exponentielle : sous Solvabilité II, la probabilité de ruine $\\mathbb{P}(U_T < 0)$ doit rester $< 0.5\\%$.",
            exampleCode: r`# Stress-Testing Ruine de Lundberg (u: capital, c: primes, lambda_sin: fréquence)
nb_sin = np.random.poisson(lambda_sin, N_scenarios)
charges = np.array([np.sum(np.random.exponential(cout_moyen, k)) if k > 0 else 0.0 for k in nb_sin])
proba_ruine = float(np.mean((u + c - charges) < 0))
print(f"Proba ruine : {proba_ruine:.4%} | Solvabilité II OK : {proba_ruine < 0.005}")`,
            tags: ["Vasicek", "Euler", "Cramér-Lundberg", "ruine", "Solvabilité II", "Poisson"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V3 — MODULE 1 : CAS RÉELS SQL (PRODUCTION ACTUARIELLE & QUANT)
  // =========================================================================
  {
    moduleId: "v3-sql-cases",
    version: "V3",
    moduleNumber: 1,
    title: "Cas Réels SQL : Production Actuarielle & Quant",
    language: "sql",
    overview:
      "Architectures SQL multi-CTEs (`WITH`), prévention du fan-out 1-N, délais calendaires `JULIANDAY`, concentration Pareto 80/20, jointures ASOF multi-tables, backtests causaux et récursion financière.",
    datasetsSummary: [
      "Toutes les 7 tables SQLite sont disponibles : assures, sinistres, macro_taux, marche_actions, portefeuilles_actifs, matrice_correlations, courbe_taux_oat",
      "Règle d'or en production : pré-agréger la table enfant (sinistres) dans une CTE avant tout LEFT JOIN sur les primes (assures)",
    ],
    sections: [
      {
        id: "v3-sql-prod",
        title: "1. Pipelines Actuariels Anti-Fan-Out, Délais & Pareto",
        subtitle: "CTEs chaînées, dates SQLite et cumul glissant de réassurance",
        entries: [
          {
            id: "v3-sql-cte-sp",
            title: "CTE Anti-Fan-Out 1-N pour Ratio S/P Exact",
            exerciseRef: "V3 Cas 1, 3",
            syntax: "WITH sin_pol AS (SELECT police_id, SUM(cout_total) AS charge FROM sinistres GROUP BY police_id)",
            formula: r`$$S/P_{\text{exact}} = \frac{\sum_i \text{charge}_i}{\sum_i \text{prime}_i} \times 100 \quad (\text{sans duplication de prime})$$`,
            description:
              "Pré-agréger les sinistres au grain `police_id` garantit une relation `1:1` lors du `LEFT JOIN` avec `assures` : chaque prime n'est comptée qu'une seule fois.",
            exampleCode: r`WITH sinistres_par_police AS (
  SELECT police_id, COUNT(*) AS nb_sinistres, SUM(cout_total) AS charge_police
  FROM sinistres
  GROUP BY police_id
)
SELECT a.region,
       ROUND(SUM(COALESCE(sp.charge_police, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp_exact
FROM assures a
LEFT JOIN sinistres_par_police sp ON a.police_id = sp.police_id
GROUP BY a.region
ORDER BY ratio_sp_exact DESC;`,
            tags: ["CTE", "WITH", "fan-out", "S/P", "LEFT JOIN", "COALESCE"],
          },
          {
            id: "v3-sql-julianday-pareto",
            title: "Délais Calendaires (JULIANDAY) & Cumul Pareto (UNBOUNDED PRECEDING)",
            exerciseRef: "V3 Cas 2, 4",
            syntax: "CAST(JULIANDAY(d2) - JULIANDAY(d1) AS INTEGER) | SUM(x) OVER (ORDER BY x DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
            description:
              "`JULIANDAY(date)` convertit une date `YYYY-MM-DD` en jours juliens pour mesurer les délais de déclaration. Une fenêtre cumulative décroissante identifie les dossiers concentrant 80 % de la charge.",
            exampleCode: r`SELECT sinistre_id,
       cout_total,
       ROUND(SUM(cout_total) OVER (ORDER BY cout_total DESC, sinistre_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
             / SUM(cout_total) OVER () * 100, 2) AS pct_cumule
FROM sinistres
ORDER BY cout_total DESC, sinistre_id ASC;`,
            tags: ["JULIANDAY", "Pareto", "UNBOUNDED PRECEDING", "SUM OVER"],
          },
        ],
      },
      {
        id: "v3-sql-quant",
        title: "2. Screener Quantitatif, ASOF Multi-Tables, Backtest & Récursion",
        subtitle: "Pipelines de desk financier sans biais du futur",
        entries: [
          {
            id: "v3-sql-triangle-cov",
            title: "Triangle Inférieur/Supérieur (actif_a < actif_b) & Covariance",
            exerciseRef: "V3 Cas 7, 8",
            syntax: "FROM matrice_correlations mc JOIN portefeuilles_actifs pa ON mc.actif_a = pa.ticker ... WHERE mc.actif_a < mc.actif_b",
            formula: r`$$\operatorname{Cov}(A, B) = \rho_{A,B}\,\sigma_A\,\sigma_B$$`,
            description:
              "Filtrer `actif_a < actif_b` élimine automatiquement la diagonale (`1.00`) et les doublons symétriques `(TTE, BNP)` / `(BNP, TTE)` avant de joindre les volatilités des deux actifs.",
            exampleCode: r`SELECT mc.actif_a, mc.actif_b, mc.correlation,
       ROUND(mc.correlation * pa.volatilite * pb.volatilite, 6) AS cov_theorique
FROM matrice_correlations mc
JOIN portefeuilles_actifs pa ON mc.actif_a = pa.ticker
JOIN portefeuilles_actifs pb ON mc.actif_b = pb.ticker
WHERE mc.actif_a < mc.actif_b
ORDER BY mc.correlation ASC;`,
            tags: ["matrice_correlations", "covariance", "jointure multiple", "diversification"],
          },
          {
            id: "v3-sql-backtest-rec",
            title: "Backtest Causal Partitionné & Récursion Financière (WITH RECURSIVE)",
            exerciseRef: "V3 Cas 5, 6, 9, 10",
            syntax: "LAG(r, 1) OVER (PARTITION BY ticker ORDER BY date) | WITH RECURSIVE tab(n, k) AS (...)",
            description:
              "En multi-actifs, `PARTITION BY ticker` isole les séries de chaque titre lors du `LAG` ou du pic cumulé. `WITH RECURSIVE` permet de construire un échéancier d'emprunt amortissable ou d'actualisation sur $T$ périodes.",
            exampleCode: r`WITH RECURSIVE echeancier(annee, cap_debut, interet, amort, cap_fin) AS (
  SELECT 1, 120000.0, ROUND(120000.0 * 0.04, 2), 20000.0, 100000.0
  UNION ALL
  SELECT annee + 1, cap_fin, ROUND(cap_fin * 0.04, 2), 20000.0, cap_fin - 20000.0
  FROM echeancier WHERE annee < 6
)
SELECT * FROM echeancier;`,
            tags: ["PARTITION BY", "LAG", "backtest", "WITH RECURSIVE", "amortissement"],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // V3 — MODULE 2 : CAS RÉELS PYTHON (ACTUARIAT, ALM, QUANT & RISQUES)
  // =========================================================================
  {
    moduleId: "v3-py-cases",
    version: "V3",
    moduleNumber: 2,
    title: "Cas Réels Python : Actuariat, ALM, Quant & Risques",
    language: "python",
    overview:
      "Pipelines complets multi-étapes (25–55 lignes) : fusion IARD `pd.merge`, tarification OLS, Duration/Convexité exacte, audit ALM, PCA sur `df_taux`, Markowitz sur `df_actifs`, contribution au risque d'Euler, VaR Cornish-Fisher, Grecs BSM + Newton-Raphson et SCR Solvabilité II Stop-Loss.",
    datasetsSummary: [
      "DataFrames préchargés : df (macro_taux), df_assures (12 polices), df_sinistres (8 sinistres), df_marche (25 cotations), df_actifs (5 actifs), df_taux (12 courbes OAT 1Y–30Y)",
      "Librairies : numpy (np), pandas (pd), statsmodels.api (sm), scipy.stats (norm, skew, kurtosis), matplotlib.pyplot (plt)",
    ],
    sections: [
      {
        id: "v3-py-actuariat-alm",
        title: "1. Actuariat IARD, Immunisation Obligataire & Audit Économétrique",
        subtitle: "Pipelines DataFrames propres, fonctions def réutilisables et tests ALM",
        entries: [
          {
            id: "v3-py-merge-iard",
            title: "Fusion Anti-Fan-Out (groupby + pd.merge left) & Imputation",
            exerciseRef: "V3 Cas 1–2",
            syntax: "df_merged = df_assures.merge(sin_agg, on='police_id', how='left').fillna(0.0)",
            description:
              "Pré-agrégez d'abord `df_sinistres.groupby('police_id', as_index=False).agg(...)` avant le `.merge(..., how='left')` avec `df_assures`, puis remplacez les `NaN` des contrats sans sinistre par `0.0`.",
            exampleCode: r`sin_pol = df_sinistres.groupby('police_id', as_index=False).agg(
    nb_sinistres=('sinistre_id', 'count'),
    charge_totale=('cout_total', 'sum')
)
df_port = df_assures.merge(sin_pol, on='police_id', how='left')
df_port[['nb_sinistres', 'charge_totale']] = df_port[['nb_sinistres', 'charge_totale']].fillna(0.0)`,
            tags: ["pd.merge", "groupby", "fillna", "df_assures", "df_sinistres", "S/P"],
          },
          {
            id: "v3-py-bond-conv",
            title: "Duration Modifiée, Convexité & Taylor Ordre 2",
            exerciseRef: "V3 Cas 3–4",
            syntax: "C = sum(t * (t + 1) * CF_t / (1 + y)**(t + 2)) / P",
            formula: r`$$\frac{\Delta P}{P} \approx -D^* \Delta y + \frac{1}{2}\,C\,(\Delta y)^2$$`,
            description:
              "Sous un grand choc de taux ($\\Delta y = +300\\text{ bps}$), la Duration seule surestime la perte d'une obligation non-remboursable : le terme positif de convexité $\\frac{1}{2}C(\\Delta y)^2$ amortit la baisse de prix.",
            exampleCode: r`flux = [4.0, 4.0, 4.0, 4.0, 104.0]
t = np.arange(1, len(flux) + 1)
P = float(np.sum(np.array(flux) / (1.03 ** t)))
D_mod = float(np.sum(t * np.array(flux) / (1.03 ** (t + 1))) / P)
C = float(np.sum(t * (t + 1) * np.array(flux) / (1.03 ** (t + 2))) / P)`,
            tags: ["duration", "convexité", "Taylor", "obligation", "ALM"],
          },
        ],
      },
      {
        id: "v3-py-quant-mc",
        title: "2. PCA, Markowitz, Risque d'Euler, Black-Scholes & Solvabilité II",
        subtitle: "Algèbre linéaire sur vraies données, solveurs numériques et réassurance",
        entries: [
          {
            id: "v3-py-euler-cf",
            title: "Contribution Marginale d'Euler & VaR Cornish-Fisher",
            exerciseRef: "V3 Cas 5–8",
            syntax: "pct_contrib = (w * (Sigma @ w)) / (w @ Sigma @ w) * 100",
            formula: r`$$z_{\text{CF}}(\alpha) = z + \frac{z^2 - 1}{6}S + \frac{z^3 - 3z}{24}(K - 3) - \frac{2z^3 - 5z}{36}S^2$$`,
            description:
              "La décomposition d'Euler attribue exactement $100\\%$ de la volatilité totale aux poids $w_i$. L'approximation de Cornish-Fisher corrige le quantile gaussien $z$ par l'asymétrie $S$ et l'excès de kurtosis $(K-3)$.",
            exampleCode: r`mcr = (Sigma @ w) / np.sqrt(w @ Sigma @ w)
tcr = w * mcr
pct_contrib = tcr / np.sqrt(w @ Sigma @ w) * 100.0`,
            tags: ["Euler", "MRC", "Cornish-Fisher", "VaR", "PCA", "Markowitz"],
          },
          {
            id: "v3-py-bsm-newton-scr",
            title: "Newton-Raphson (Volatilité Implicite) & Stop-Loss Solvabilité II",
            exerciseRef: "V3 Cas 9–10",
            syntax: "sigma -= (prix_bs - prix_cote) / vega | net = np.minimum(brut, retention)",
            formula: r`$$\sigma_{n+1} = \sigma_n - \frac{C_{\text{BSM}}(\sigma_n) - C_{\text{marché}}}{\mathcal{V}(\sigma_n)} \qquad ; \qquad S_{\text{net}} = \min(S_{\text{brut}}, R)$$`,
            description:
              "Le Véga analytique étant strictement positif et lisse, Newton-Raphson converge en 4–6 itérations vers $\\sigma_{\\text{imp}}$. En réassurance Stop-Loss, caper la charge agrégée à la rétention $R$ coupe la queue droite et réduit fortement le SCR $99.5\\%$.",
            exampleCode: r`# Stop-Loss sur charges simulées (Poisson x Lognormale)
charges_nettes = np.minimum(charges_brutes, retention)
scr_net = float(np.percentile(charges_nettes, 99.5) - np.mean(charges_nettes))`,
            tags: ["Newton-Raphson", "volatilité implicite", "Grecs", "Stop-Loss", "SCR", "Solvabilité II"],
          },
        ],
      },
    ],
  },
];
