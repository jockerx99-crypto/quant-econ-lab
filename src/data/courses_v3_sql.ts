import { CourseModule } from "@/types/course";

export const V3_SQL_CASES_MODULE: CourseModule = {
  id: "v3-sql-cases",
  title: "Cas Réels SQL : Production Actuarielle & Quant",
  subtitle: "Pipelines Multi-CTEs, Fenêtrage Avancé & Audit de Données en Production",
  icon: "Database",
  description:
    "Dix dossiers complets de niveau production (15 à 35 lignes SQL par pipeline) : audit S/P anti-fan-out, qualité data IARD, dérive tarifaire, Pareto réassurance, tableau ALM, screener multi-actifs, jointures ASOF, matrice de covariance Markowitz, backtest causal sans look-ahead bias et échéancier obligataire récursif.",
  exercises: [
    // =========================================================================
    // CAS 1 : Audit S/P Exact par Région sans Biais de Fan-Out 1-N
    // =========================================================================
    {
      id: "v3-sql-1",
      title: "1. Audit S/P Exact par Région sans Biais de Fan-Out 1-N",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 25,
      description:
        "Auditez le ratio Sinistres sur Primes (S/P) exact par région en éliminant le biais de multiplication des primes (fan-out 1-N) via une pré-agrégation par police en CTE.",
      theoryMarkdown: `
### Audit Technique IARD et Éradication du Biais de Fan-Out 1-N

#### 🎓 Cours Théorique Approfondi

En assurance Non-Vie (IARD), l'indicateur roi de rentabilité technique d'un segment $g$ (région, formule, réseau de distribution) est le **ratio Sinistres sur Primes** ($\\text{S/P}$ ou *Loss Ratio*) :

$$
\\left(\\frac{\\text{S}}{\\text{P}}\\right)_g = 100 \\times \\frac{\\sum_{i \\in g} \\sum_{k \\in \\mathcal{S}_i} C_{i,k}}{\\sum_{i \\in g} P_i}
$$

où $P_i$ désigne la prime annuelle acquise de la police $i \\in g$, et $\\mathcal{S}_i$ l'ensemble des $N_i = |\\mathcal{S}_i|$ sinistres rattachés à la police $i$, chacun de coût total $C_{i,k}$.

**Le piège fatal du *Fan-Out Trap* (explosion relationnelle $1 \\to N$) :**
En algèbre relationnelle, la table \`assures\` ($A$) a pour clé primaire \`police_id\`, tandis que \`sinistres\` ($S$) possède une relation **plusieurs-à-un ($N:1$)** vers \`assures\` (une police peut subir $0, 1, 2, \\dots, N_i$ sinistres). Si un analyste exécute directement une jointure gauche brute $A \\,\\text{LEFT JOIN}\\, S$ sur \`police_id\`, la cardinalité devient :

$$
\\sum_{i \\in g} \\max(1, N_i) \\ge |g|
$$

Chaque police ayant $N_i \\ge 2$ sinistres voit sa ligne **dupliquée $N_i$ fois**. Un \`SUM(prime_annuelle)\` naïf calcule alors :

$$
\\widehat{P}_{g}^{\\text{naïf}} = \\sum_{i \\in g} \\max(1, N_i) \\cdot P_i > \\sum_{i \\in g} P_i
$$

ce qui **gonfle artificiellement les primes acquises**, sous-estime mécaniquement le ratio $\\text{S/P}$, fausse \`COUNT(*)\` (qui compte des lignes sinistres au lieu de contrats) et peut conduire un comité de souscription à juger rentable un portefeuille déficitaire !

**Preuve de correction par factorisation relationnelle (Pré-Agrégation en CTE) :**
En appliquant d'abord l'opérateur de regroupement $\\gamma_{\\text{police\\_id}}$ sur $S$ :

$$
S_{\\text{pol}} = \\gamma_{\\text{police\\_id},\\; \\text{COUNT}(*) \\to n_i,\\; \\text{SUM}(C) \\to C_i,\\; \\text{SUM}(\\text{COALESCE}(C_{\\text{corp}}, 0)) \\to C_i^{\\text{corp}}}(S)
$$

la relation $S_{\\text{pol}}$ redevient de **cardinalité $0..1$** par \`police_id\`. La jointure $A \\,\\text{LEFT OUTER JOIN}\\, S_{\\text{pol}}$ préserve donc strictement l'unicité de chaque police ($|A \\bowtie_{\\text{left}} S_{\\text{pol}}| = |A|$) et conserve les polices sans sinistre ($N_i = 0$) grâce à \`COALESCE(..., 0)\`.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous **IFRS 17** (calcul des flux de trésorerie d'exécution et suivi de la *Loss Component* des groupes de contrats déficitaires) comme sous **Solvabilité II** (calibration du risque de prime *Non-Life Underwriting Risk*), les pipelines SQL de réconciliation comptabilité-actuariat imposent systématiquement la séparation des grains (*granularity isolation*) entre tables *Polices* ($1$), *Garanties* ($N$) et *Sinistres* ($M$) avant toute agrégation régionale.

#### 💻 Masterclass SQL de Production

Un pipeline SQL d'audit actuariel suit une architecture à deux étages via une **CTE** (*Common Table Expression*) \`WITH sinistres_par_police AS (...)\` :

1. **Étage 1 (CTE — Grain Police)** : on réduit la table \`sinistres\` au niveau \`police_id\` avec \`GROUP BY police_id\`. On y gère les valeurs nulles de \`cout_corporel\` via \`COALESCE(cout_corporel, 0.0)\` avant la somme (bien que \`SUM\` ignore \`NULL\`, \`COALESCE\` garantit explicitement \`0.0\` et protège toute arithmétique ligne à ligne).
2. **Étage 2 (Requête principale — Grain Région)** :
   - \`LEFT JOIN sinistres_par_police s ON a.police_id = s.police_id\` préserve 100 % des régions et polices à sinistre nul ;
   - \`COUNT(*)\` compte exactement le nombre de polices ;
   - \`COALESCE(SUM(s.charge_police), 0.0)\` évite que les régions sans aucun sinistre ne retournent \`NULL\` pour la charge ou le ratio ;
   - \`100.0 * ...\` force l'arithmétique flottante ;
   - \`DENSE_RANK() OVER (ORDER BY ... DESC)\` attribue un rang continu ($1, 2, 3, \\dots$) sans saut d'indice en cas d'ex æquo (par exemple toutes les régions à \`0.00\` de ratio S/P partagent le même rang).

\`\`\`sql
-- Architecture de référence : pré-agrégation au grain police avant jointure
WITH sinistres_par_police AS (
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,                          -- Nombre de dossiers sur la police
        SUM(cout_total) AS charge_police,                  -- Charge totale brute sur la police
        SUM(COALESCE(cout_corporel, 0.0)) AS charge_corporelle
    FROM sinistres
    GROUP BY police_id                                     -- Ramène le grain N:1 à 1:1
)
SELECT
    a.region,
    COUNT(*) AS nb_polices,                                -- Exact car 1 ligne = 1 police
    COALESCE(SUM(s.nb_sinistres), 0) AS nb_sinistres,
    ROUND(SUM(a.prime_annuelle), 2) AS primes_acquises
FROM assures a
LEFT JOIN sinistres_par_police s ON a.police_id = s.police_id
GROUP BY a.region;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Audit comparatif réel sur \`assures\` et \`sinistres\` mesurant l'impact chiffré du biais de *fan-out* entre une jointure directe naïve et la CTE exacte (filtré sur les régions sinistrées) :

\`\`\`sql
WITH naif AS (
  SELECT a.region,
         COUNT(*) AS lignes_apres_join,
         ROUND(SUM(a.prime_annuelle), 2) AS primes_naives,
         ROUND(COALESCE(SUM(s.cout_total), 0.0), 2) AS charge_naive
  FROM assures a
  LEFT JOIN sinistres s ON a.police_id = s.police_id
  GROUP BY a.region
),
exact AS (
  SELECT a.region,
         COUNT(*) AS polices_exactes,
         ROUND(SUM(a.prime_annuelle), 2) AS primes_exactes,
         ROUND(COALESCE(SUM(sp.charge_police), 0.0), 2) AS charge_exacte
  FROM assures a
  LEFT JOIN (
    SELECT police_id, SUM(cout_total) AS charge_police
    FROM sinistres GROUP BY police_id
  ) sp ON a.police_id = sp.police_id
  GROUP BY a.region
)
SELECT e.region, e.polices_exactes, n.lignes_apres_join,
       e.primes_exactes, n.primes_naives,
       ROUND(100.0 * e.charge_exacte / e.primes_exactes, 2) AS sp_exact_pct,
       ROUND(100.0 * n.charge_naive / n.primes_naives, 2) AS sp_naif_pct
FROM exact e
JOIN naif n ON e.region = n.region
WHERE e.charge_exacte > 0
ORDER BY sp_exact_pct DESC;
\`\`\`

\`\`\`text
region          | polices_exactes | lignes_apres_join | primes_exactes | primes_naives | sp_exact_pct | sp_naif_pct
----------------+-----------------+-------------------+----------------+---------------+--------------+------------
Grand Est       | 1               | 1                 | 890.3          | 890.3         | 1055.82      | 1055.82
IDF             | 4               | 4                 | 5210.7         | 5210.7        | 647.71       | 647.71
PACA            | 1               | 2                 | 1150           | 2300          | 471.3        | 235.65
Hauts-de-France | 1               | 1                 | 780            | 780           | 48.72        | 48.72
\`\`\`

En \`PACA\`, l'assuré \`1003\` a déclaré $2$ sinistres (\`502\` et \`503\`) : la jointure naïve duplique sa prime de $1\\,150\\text{ EUR}$ en $2\\,300\\text{ EUR}$ et **divise artificiellement par deux** le ratio S/P ($235.65\\%$ au lieu de $471.30\\%$) !
      `,
      taskMarkdown: `
Construisez un pipeline SQL complet en 2 étapes :

1. **CTE \`sinistres_par_police\`** : depuis \`sinistres\`, regroupez par \`police_id\` et calculez :
   - \`COUNT(*) AS nb_sinistres\`
   - \`SUM(cout_total) AS charge_police\`
   - \`SUM(COALESCE(cout_corporel, 0.0)) AS charge_corporelle\`
2. **Requête principale** : effectuez un \`LEFT JOIN\` de \`assures a\` avec \`sinistres_par_police s\` sur \`police_id\`, regroupez par \`a.region\` et retournez dans **cet ordre exact** :
   - \`region\` (\`a.region\`)
   - \`nb_polices\` : \`COUNT(*)\`
   - \`nb_sinistres\` : \`COALESCE(SUM(s.nb_sinistres), 0)\`
   - \`primes_acquises\` : \`ROUND(SUM(a.prime_annuelle), 2)\`
   - \`charge_totale\` : \`ROUND(COALESCE(SUM(s.charge_police), 0.0), 2)\`
   - \`charge_corporelle\` : \`ROUND(COALESCE(SUM(s.charge_corporelle), 0.0), 2)\`
   - \`ratio_sp_exact\` : \`ROUND(100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle), 2)\`
   - \`diagnostic\` : \`CASE WHEN\` sur le ratio non arrondi ($100.0 \\times \\text{charge} / \\text{primes}$) : \`> 100.0\` $\\to$ \`'Déficitaire'\`, \`>= 70.0\` $\\to$ \`'Sous surveillance'\`, sinon \`'Rentable'\`
   - \`rang_risque\` : \`DENSE_RANK() OVER (ORDER BY 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) DESC)\`

Triez le résultat par \`rang_risque ASC, a.region ASC\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH sinistres_par_police AS (
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,
        SUM(cout_total) AS charge_police,
        SUM(COALESCE(cout_corporel, 0.0)) AS charge_corporelle
    FROM sinistres
    GROUP BY police_id
)
SELECT
    a.region,
    COUNT(*) AS nb_polices,
    COALESCE(SUM(s.nb_sinistres), 0) AS nb_sinistres,
    ROUND(SUM(a.prime_annuelle), 2) AS primes_acquises,
    ROUND(COALESCE(SUM(s.charge_police), 0.0), 2) AS charge_totale,
    ROUND(COALESCE(SUM(s.charge_corporelle), 0.0), 2) AS charge_corporelle,
    ROUND(100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle), 2) AS ratio_sp_exact,
    CASE
        WHEN 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) > 100.0 THEN 'Déficitaire'
        WHEN 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) >= 70.0 THEN 'Sous surveillance'
        ELSE 'Rentable'
    END AS diagnostic,
    DENSE_RANK() OVER (
        ORDER BY 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) DESC
    ) AS rang_risque
FROM assures a
LEFT JOIN sinistres_par_police s
    ON a.police_id = s.police_id
GROUP BY a.region
ORDER BY rang_risque ASC, a.region ASC;`,
      validationQuery: `WITH sinistres_par_police AS (
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,
        SUM(cout_total) AS charge_police,
        SUM(COALESCE(cout_corporel, 0.0)) AS charge_corporelle
    FROM sinistres
    GROUP BY police_id
)
SELECT
    a.region,
    COUNT(*) AS nb_polices,
    COALESCE(SUM(s.nb_sinistres), 0) AS nb_sinistres,
    ROUND(SUM(a.prime_annuelle), 2) AS primes_acquises,
    ROUND(COALESCE(SUM(s.charge_police), 0.0), 2) AS charge_totale,
    ROUND(COALESCE(SUM(s.charge_corporelle), 0.0), 2) AS charge_corporelle,
    ROUND(100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle), 2) AS ratio_sp_exact,
    CASE
        WHEN 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) > 100.0 THEN 'Déficitaire'
        WHEN 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) >= 70.0 THEN 'Sous surveillance'
        ELSE 'Rentable'
    END AS diagnostic,
    DENSE_RANK() OVER (
        ORDER BY 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) DESC
    ) AS rang_risque
FROM assures a
LEFT JOIN sinistres_par_police s
    ON a.police_id = s.police_id
GROUP BY a.region
ORDER BY rang_risque ASC, a.region ASC;`,
      datasets: [],
      hints: [
        "Commencez par une CTE `WITH sinistres_par_police AS (SELECT police_id, COUNT(*) AS nb_sinistres, SUM(cout_total) AS charge_police, SUM(COALESCE(cout_corporel, 0.0)) AS charge_corporelle FROM sinistres GROUP BY police_id)`.",
        "Dans la requête principale, joignez `assures a` avec `LEFT JOIN sinistres_par_police s ON a.police_id = s.police_id` et enveloppez chaque agrégat issu de `s` dans `COALESCE(..., 0)` ou `COALESCE(..., 0.0)`.",
        "N'oubliez pas `DENSE_RANK() OVER (ORDER BY 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) DESC) AS rang_risque` puis terminez par `ORDER BY rang_risque ASC, a.region ASC;`.",
      ],
      guide: {
        theoryToPracticeLink:
          "Pour évaluer exactement $\\text{S/P}_g = 100 \\times \\frac{\\sum_{i \\in g} C_i}{\\sum_{i \\in g} P_i}$ sans biais de *fan-out* $1 \\to N$ (où une police ayant $N_i$ sinistres dupliquerait sa prime $P_i$), on factorise la relation \`sinistres\` au grain \`police_id\` dans la CTE \`sinistres_par_police\`. La jointure gauche \`LEFT JOIN\` préserve alors exactement les $9$ régions (y compris celles à $0$ sinistre) tout en garantissant qu'une police compte pour $1$ ligne unique.",
        stepByStepPlan: [
          "Créer la CTE `sinistres_par_police` qui agrège `sinistres` par `police_id` (`nb_sinistres`, `charge_police`, `charge_corporelle` avec `COALESCE`).",
          "Partir de `assures a` et effectuer un `LEFT JOIN sinistres_par_police s ON a.police_id = s.police_id`, puis regrouper via `GROUP BY a.region`.",
          "Calculer `nb_polices`, `nb_sinistres`, `primes_acquises`, `charge_totale`, `charge_corporelle` et `ratio_sp_exact` (arrondis à 2 décimales avec `ROUND(..., 2)`).",
          "Classifier chaque région avec `CASE WHEN` (`'Déficitaire'`, `'Sous surveillance'`, `'Rentable'`) et calculer `rang_risque` via `DENSE_RANK() OVER (ORDER BY ... DESC)`.",
          "Trier la sortie finale de manière déterministe avec `ORDER BY rang_risque ASC, a.region ASC;`.",
        ],
        concepts: [
          {
            symbol: "sinistres_par_police",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE intermédiaire ramenant la table `sinistres` (grain sinistre) au grain `police_id` (cardinalité 0..1 par contrat) pour bloquer toute duplication de primes.",
          },
          {
            symbol: "assures a / sinistres s",
            kind: "Colonne / Table",
            roleInExercise:
              "Alias courts des tables utilisées dans la requête principale : `a` porte les contrats et primes régionales, `s` pointe vers la CTE pré-agrégée.",
          },
          {
            symbol: "LEFT JOIN ... ON a.police_id = s.police_id",
            kind: "Syntaxe",
            roleInExercise:
              "Jointure externe gauche conservant l'ensemble des $12$ contrats et des $9$ régions, même lorsque aucun sinistre n'est présent dans `sinistres_par_police`.",
          },
          {
            symbol: "COALESCE(expr, 0.0)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Substitue `0.0` aux valeurs `NULL` (sur `cout_corporel` manquant ou sur les régions sans sinistre après `LEFT JOIN`), évitant la propagation de `NULL` dans les ratios.",
          },
          {
            symbol: "100.0 * ... / SUM(a.prime_annuelle)",
            kind: "Variable",
            roleInExercise:
              "Formule exacte du ratio Sinistres sur Primes exprimé en pourcentage, avec multiplicateur flottant `100.0`.",
          },
          {
            symbol: "CASE WHEN ... THEN ... ELSE ... END",
            kind: "Syntaxe",
            roleInExercise:
              "Structure de segmentation réglementaire classant chaque région en `'Déficitaire'` ($> 100\\%$), `'Sous surveillance'` ($\\ge 70\\%$) ou `'Rentable'` ($< 70\\%$).",
          },
          {
            symbol: "DENSE_RANK() OVER (ORDER BY ... DESC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Fonction de fenêtre exécutée après `GROUP BY` qui classe les régions par S/P décroissant sans laisser de trou dans les rangs en cas d'ex æquo.",
          },
          {
            symbol: "ROUND(..., 2)",
            kind: "Paramètre",
            roleInExercise:
              "Arrondit les montants en euros et les ratios en pourcentage à exactement $2$ décimales.",
          },
        ],
        guidedCode: `-- 1. CTE de pré-agrégation au grain police_id (évite le fan-out 1-N)
WITH sinistres_par_police AS (
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,
        SUM(___) AS charge_police,
        SUM(COALESCE(___, 0.0)) AS charge_corporelle
    FROM sinistres
    GROUP BY ___
)
-- 2. Jointure externe gauche sur assures et agrégation régionale
SELECT
    a.region,
    COUNT(*) AS nb_polices,
    COALESCE(SUM(s.nb_sinistres), 0) AS nb_sinistres,
    ROUND(SUM(a.prime_annuelle), 2) AS primes_acquises,
    ROUND(COALESCE(SUM(s.charge_police), 0.0), 2) AS charge_totale,
    ROUND(COALESCE(SUM(s.charge_corporelle), 0.0), 2) AS charge_corporelle,
    ROUND(100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle), 2) AS ratio_sp_exact,
    CASE
        WHEN 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) > 100.0 THEN '___'
        WHEN 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) >= 70.0 THEN '___'
        ELSE '___'
    END AS diagnostic,
    DENSE_RANK() OVER (
        ORDER BY 100.0 * COALESCE(SUM(s.charge_police), 0.0) / SUM(a.prime_annuelle) DESC
    ) AS rang_risque
FROM assures a
LEFT JOIN ___ s
    ON a.police_id = s.police_id
GROUP BY a.region
ORDER BY rang_risque ASC, a.region ASC;`,
      },
    },

    // =========================================================================
    // CAS 2 : Qualité Data & Délais de Déclaration IARD par Tranche d'Âge
    // =========================================================================
    {
      id: "v3-sql-2",
      title: "2. Qualité Data & Délais de Déclaration IARD par Tranche d'Âge (JULIANDAY)",
      category: "data_prep",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 20,
      description:
        "Mesurez les délais de déclaration en jours calendaires et le profil de sinistralité par classe d'âge à l'aide de JULIANDAY et d'une CTE d'enrichissement.",
      theoryMarkdown: `
### Modélisation des Délais de Déclaration et Triangles de Liquidation IARD

#### 🎓 Cours Théorique Approfondi

En actuariat de provisionnement (méthodes de **Chain-Ladder** et séparation IBNR / RBNS), un sinistre suit une chronologie à trois dates clés :
1. Date de survenance $T_{\\text{surv}}$ (*accident date*) ;
2. Date de déclaration à l'assureur $T_{\\text{decl}}$ (*reporting date*) ;
3. Date de clôture et de règlement définitif $T_{\\text{clos}}$ (*settlement date*).

Le **délai de déclaration** (*reporting delay*) est la variable aléatoire positive $D_k = T_{\\text{decl}, k} - T_{\\text{surv}, k} \\ge 0$ exprimée en jours calendaires. Dans la modélisation fréquence-sévérité et le calcul des provisions pour **sinistres survenus mais non encore déclarés (IBNR)**, l'espérance conditionnelle $\\mathbb{E}[D_k \\mid X_k]$ et la probabilité de clôture $\\mathbb{P}(\\text{Clos} \\mid X_k)$ dépendent des caractéristiques comportementales du conducteur $X_k$ (notamment l'âge) :

$$
\\hat{\\mu}_{D \\mid c} = \\frac{1}{n_c} \\sum_{k \\in c} D_k, \\qquad \\hat{p}_{\\text{clos} \\mid c} = 100 \\times \\frac{1}{n_c} \\sum_{k \\in c} \\mathbf{1}_{\\{\\text{statut}_k = \\text{'Clos'}\\}}
$$

**Calcul exact de durées calendaires en SQL (Jour Julien) :**
Contrairement à une chaîne de texte \`'2022-07-02' - '2022-06-30'\` (qui en SQLite effectuerait une soustraction arithmétique sur \`2022\` et renverrait \`0\` !), la fonction \`JULIANDAY(date)\` convertit une date ISO \`YYYY-MM-DD\` en nombre réel de jours écoulés depuis le midi universel du 24 novembre $-4713$ (calendrier julien astronomique). Ainsi, la différence exacte entre deux dates est :

$$
D_k = \\lfloor \\operatorname{JULIANDAY}(T_{\\text{decl}, k}) - \\operatorname{JULIANDAY}(T_{\\text{surv}, k}) \\rfloor
$$

En particulier, le passage entre \`2022-06-30\` et \`2022-07-02\` tient compte exactement des 30 jours du mois de juin ($D = 2$ jours).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Lors de l'audit de qualité des données exigé par l'article 82 de la directive **Solvabilité II** (exactitude, exhaustivité, pertinence des données de provisionnement), les actuaires contrôlent systématiquement l'absence de délais négatifs ($D_k < 0$, signe d'erreur de saisie), mesurent les retards de déclaration par segment et suivent l'avancement des règlements (\`taux_clos_pct\`) afin de calibrer les coefficients de cadence de liquidation (*development factors*).

#### 💻 Masterclass SQL de Production

Pour segmenter les sinistres selon des attributs portés par la table parente \`assures\`, on enchaîne :

1. **CTE d'enrichissement (\`sinistres_enrichis\`)** :
   - \`INNER JOIN assures a ON s.police_id = a.police_id\` rattache chaque sinistre à son conducteur ;
   - \`CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER)\` convertit la différence réelle en entier exact ;
   - \`CASE WHEN a.age < 30 THEN '< 30 ans' WHEN a.age < 50 THEN '30-49 ans' ELSE '50+ ans' END\` discrétise l'âge en $3$ classes actuarielles mutuellement exclusives et collectivement exhaustives.
2. **Agrégation & piège du tri lexicographique** :
   - Pour calculer \`taux_clos_pct\`, l'idiome SQL standard pour une proportion est \`100.0 * SUM(CASE WHEN statut_dossier = 'Clos' THEN 1 ELSE 0 END) / COUNT(*)\`.
   - Attention au tri final : en ordre alphabétique ASCII, \`'30-49 ans'\` (code \`'3'\` = 51) passe **avant** \`'< 30 ans'\` (code \`'<'\` = 60) ! Il faut donc imposer un ordre métier explicite via \`ORDER BY CASE tranche_age WHEN '< 30 ans' THEN 1 WHEN '30-49 ans' THEN 2 ELSE 3 END ASC\`.

\`\`\`sql
-- Enrichissement au grain sinistre : calcul du délai calendaire et discrétisation de l'âge
WITH sinistres_enrichis AS (
    SELECT
        s.sinistre_id,
        s.cout_total,
        s.responsabilite_pct,
        s.statut_dossier,
        CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER) AS delai_jours,
        CASE
            WHEN a.age < 30 THEN '< 30 ans'
            WHEN a.age < 50 THEN '30-49 ans'
            ELSE '50+ ans'
        END AS tranche_age
    FROM sinistres s
    INNER JOIN assures a ON s.police_id = a.police_id
)
SELECT * FROM sinistres_enrichis;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Inspection ligne à ligne des $8$ sinistres enrichis de l'âge conducteur et du délai exact \`JULIANDAY\` :

\`\`\`sql
SELECT s.sinistre_id, a.age, s.date_survenance, s.date_declaration,
       CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER) AS delai_jours,
       s.responsabilite_pct, s.cout_total, s.statut_dossier
FROM sinistres s
INNER JOIN assures a ON s.police_id = a.police_id
ORDER BY s.sinistre_id ASC;
\`\`\`

\`\`\`text
sinistre_id | age | date_survenance | date_declaration | delai_jours | responsabilite_pct | cout_total | statut_dossier
------------+-----+-----------------+------------------+-------------+--------------------+------------+---------------
501         | 28  | 2021-08-14      | 2021-08-16       | 2           | 100                | 1450       | Clos
502         | 22  | 2022-04-02      | 2022-04-03       | 1           | 0                  | 420        | Clos
503         | 22  | 2022-11-19      | 2022-11-20       | 1           | 100                | 5000       | Clos
504         | 58  | 2020-01-15      | 2020-01-16       | 1           | 0                  | 18500      | Clos
505         | 24  | 2022-09-08      | 2022-09-09       | 1           | 80                 | 11700      | En cours
506         | 41  | 2021-03-22      | 2021-03-25       | 3           | 0                  | 9400       | Clos
507         | 31  | 2022-02-11      | 2022-02-12       | 1           | 0                  | 380        | Clos
508         | 29  | 2022-06-30      | 2022-07-02       | 2           | 50                 | 2100       | Clos
\`\`\`

On constate notamment que \`508\` passe correctement de fin juin au 2 juillet ($2$ jours exacts), que la classe \`< 30 ans\` concentre les $5$ sinistres responsables (\`501\`, \`503\`, \`505\`, \`508\`) ainsi que le seul dossier \`En cours\` (\`505\`), tandis que la tranche \`50+ ans\` ne subit qu'un sinistre de Vol non responsable (\`504\`, $18\\,500\\text{ EUR}$).
      `,
      taskMarkdown: `
Construisez un pipeline SQL en 2 étapes :

1. **CTE \`sinistres_enrichis\`** : joignez \`sinistres s\` et \`assures a\` (\`INNER JOIN\` sur \`police_id\`) en calculant pour chaque sinistre :
   - \`delai_jours\` : \`CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER)\`
   - \`tranche_age\` : \`CASE WHEN a.age < 30 THEN '< 30 ans' WHEN a.age < 50 THEN '30-49 ans' ELSE '50+ ans' END\`
   - tout en conservant \`cout_total\`, \`responsabilite_pct\` et \`statut_dossier\`.
2. **Requête principale** : regroupez par \`tranche_age\` et retournez dans **cet ordre exact** :
   - \`tranche_age\`
   - \`nb_sinistres\` : \`COUNT(*)\`
   - \`delai_moyen_jours\` : \`ROUND(AVG(delai_jours), 2)\`
   - \`resp_moyenne_pct\` : \`ROUND(AVG(responsabilite_pct), 2)\`
   - \`cout_moyen\` : \`ROUND(AVG(cout_total), 2)\`
   - \`taux_clos_pct\` : \`ROUND(100.0 * SUM(CASE WHEN statut_dossier = 'Clos' THEN 1 ELSE 0 END) / COUNT(*), 2)\`

Triez dans l'ordre naturel des âges (\`'< 30 ans'\`, \`'30-49 ans'\`, \`'50+ ans'\`) via un \`ORDER BY CASE tranche_age ... END ASC\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH sinistres_enrichis AS (
    SELECT
        s.sinistre_id,
        s.cout_total,
        s.responsabilite_pct,
        s.statut_dossier,
        CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER) AS delai_jours,
        CASE
            WHEN a.age < 30 THEN '< 30 ans'
            WHEN a.age < 50 THEN '30-49 ans'
            ELSE '50+ ans'
        END AS tranche_age
    FROM sinistres s
    INNER JOIN assures a
        ON s.police_id = a.police_id
)
SELECT
    tranche_age,
    COUNT(*) AS nb_sinistres,
    ROUND(AVG(delai_jours), 2) AS delai_moyen_jours,
    ROUND(AVG(responsabilite_pct), 2) AS resp_moyenne_pct,
    ROUND(AVG(cout_total), 2) AS cout_moyen,
    ROUND(100.0 * SUM(CASE WHEN statut_dossier = 'Clos' THEN 1 ELSE 0 END) / COUNT(*), 2) AS taux_clos_pct
FROM sinistres_enrichis
GROUP BY tranche_age
ORDER BY
    CASE tranche_age
        WHEN '< 30 ans' THEN 1
        WHEN '30-49 ans' THEN 2
        ELSE 3
    END ASC;`,
      validationQuery: `WITH sinistres_enrichis AS (
    SELECT
        s.sinistre_id,
        s.cout_total,
        s.responsabilite_pct,
        s.statut_dossier,
        CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER) AS delai_jours,
        CASE
            WHEN a.age < 30 THEN '< 30 ans'
            WHEN a.age < 50 THEN '30-49 ans'
            ELSE '50+ ans'
        END AS tranche_age
    FROM sinistres s
    INNER JOIN assures a
        ON s.police_id = a.police_id
)
SELECT
    tranche_age,
    COUNT(*) AS nb_sinistres,
    ROUND(AVG(delai_jours), 2) AS delai_moyen_jours,
    ROUND(AVG(responsabilite_pct), 2) AS resp_moyenne_pct,
    ROUND(AVG(cout_total), 2) AS cout_moyen,
    ROUND(100.0 * SUM(CASE WHEN statut_dossier = 'Clos' THEN 1 ELSE 0 END) / COUNT(*), 2) AS taux_clos_pct
FROM sinistres_enrichis
GROUP BY tranche_age
ORDER BY
    CASE tranche_age
        WHEN '< 30 ans' THEN 1
        WHEN '30-49 ans' THEN 2
        ELSE 3
    END ASC;`,
      datasets: [],
      hints: [
        "Dans la CTE `sinistres_enrichis`, joignez `sinistres s` et `assures a` sur `police_id` pour accéder simultanément aux dates de sinistre et à `a.age`.",
        "Calculez le délai entier avec `CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER)` et le taux de clôture avec `100.0 * SUM(CASE WHEN statut_dossier = 'Clos' THEN 1 ELSE 0 END) / COUNT(*)`.",
        "Utilisez un `ORDER BY CASE tranche_age WHEN '< 30 ans' THEN 1 WHEN '30-49 ans' THEN 2 ELSE 3 END ASC` pour éviter que `'30-49 ans'` ne passe avant `'< 30 ans'` alphabétiquement.",
      ],
      guide: {
        theoryToPracticeLink:
          "En gestion IBNR et qualité des données, l'espérance conditionnelle du délai $D_k = \\lfloor \\operatorname{JULIANDAY}(T_{\\text{decl}, k}) - \\operatorname{JULIANDAY}(T_{\\text{surv}, k}) \\rfloor$ et le taux de règlement dépendent des variables du conducteur. La CTE \`sinistres_enrichis\` prépare le jeu de données au grain sinistre (jointure + calcul de délai + segmentation d'âge), puis la requête externe projette les indicateurs agrégés par tranche.",
        stepByStepPlan: [
          "Écrire la CTE `sinistres_enrichis` en joignant `sinistres s` et `assures a` via `INNER JOIN ... ON s.police_id = a.police_id`.",
          "Calculer `delai_jours` via `CAST(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance) AS INTEGER)` et `tranche_age` via `CASE WHEN a.age < 30 ...`.",
          "Dans le `SELECT` principal, regrouper par `tranche_age` et calculer `COUNT(*)`, les moyennes `AVG(...)` arrondies à 2 décimales et `taux_clos_pct`.",
          "Ordonner logiquement les 3 tranches avec `ORDER BY CASE tranche_age ... END ASC;`.",
        ],
        concepts: [
          {
            symbol: "sinistres_enrichis",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE préparant chaque dossier sinistre avec l'âge discrétisé du conducteur et le délai de déclaration exact en jours.",
          },
          {
            symbol: "JULIANDAY(...)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Convertit une date ISO (`'YYYY-MM-DD'`) en jour julien continu pour soustraire deux dates calendaires avec gestion exacte des longueurs de mois et années bissextiles.",
          },
          {
            symbol: "CAST(... AS INTEGER)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Convertit la différence flottante de jours juliens en nombre entier de jours calendaires.",
          },
          {
            symbol: "tranche_age",
            kind: "Variable",
            roleInExercise:
              "Dimension de segmentation (`'< 30 ans'`, `'30-49 ans'`, `'50+ ans'`) construite par `CASE WHEN` sur `a.age`.",
          },
          {
            symbol: "SUM(CASE WHEN statut_dossier = 'Clos' THEN 1 ELSE 0 END)",
            kind: "Syntaxe",
            roleInExercise:
              "Comptage conditionnel d'indicatrice $\\sum \\mathbf{1}_{\\{\\text{Clos}\\}}$ permettant de calculer le pourcentage de dossiers clôturés par tranche.",
          },
          {
            symbol: "AVG(delai_jours), AVG(responsabilite_pct), AVG(cout_total)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Moyennes empiriques par classe d'âge du retard de déclaration, de la part de responsabilité et de la sévérité moyenne.",
          },
          {
            symbol: "ORDER BY CASE tranche_age ... END",
            kind: "Syntaxe",
            roleInExercise:
              "Tri ordinal métier garantissant l'ordre croissant des âges (`< 30 ans` puis `30-49 ans` puis `50+ ans`) au lieu du tri ASCII.",
          },
        ],
        guidedCode: `-- 1. CTE d'enrichissement : jointure sinistres-assures, délai JULIANDAY et tranche d'âge
WITH sinistres_enrichis AS (
    SELECT
        s.sinistre_id,
        s.cout_total,
        s.responsabilite_pct,
        s.statut_dossier,
        CAST(JULIANDAY(___) - JULIANDAY(___) AS INTEGER) AS delai_jours,
        CASE
            WHEN a.age < 30 THEN '___'
            WHEN a.age < 50 THEN '___'
            ELSE '___'
        END AS tranche_age
    FROM sinistres s
    INNER JOIN assures a
        ON s.police_id = a.police_id
)
-- 2. Agrégation des métriques de qualité et de sinistralité par tranche d'âge
SELECT
    tranche_age,
    COUNT(*) AS nb_sinistres,
    ROUND(AVG(delai_jours), 2) AS delai_moyen_jours,
    ROUND(AVG(responsabilite_pct), 2) AS resp_moyenne_pct,
    ROUND(AVG(cout_total), 2) AS cout_moyen,
    ROUND(100.0 * SUM(CASE WHEN statut_dossier = '___' THEN 1 ELSE 0 END) / COUNT(*), 2) AS taux_clos_pct
FROM sinistres_enrichis
GROUP BY tranche_age
ORDER BY
    CASE tranche_age
        WHEN '< 30 ans' THEN 1
        WHEN '30-49 ans' THEN 2
        ELSE 3
    END ASC;`,
      },
    },

    // =========================================================================
    // CAS 3 : Surveillance Tarifaire & Détection des Écarts vs Moyenne de Formule
    // =========================================================================
    {
      id: "v3-sql-3",
      title: "3. Surveillance Tarifaire & Détection des Écarts vs Moyenne de Formule",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 25,
      description:
        "Comparez chaque contrat individuel au tarif moyen et au CRM moyen de sa formule via des fonctions de fenêtre partitionnées, et signalez les écarts tarifaires extrêmes (> ±20 %).",
      theoryMarkdown: `
### Contrôle Tarifaire, Comparaison Intra-Groupe et Fenêtres Partitionnées

#### 🎓 Cours Théorique Approfondi

En tarification technique et commerciale (GLM multiplicatif ou grille tarifaire), l'actuaire produit doit en permanence auditer la cohérence entre le niveau de prime facturé $P_i$ d'un contrat $i$, sa formule de garanties $f(i) \\in \\{\\text{Tous Risques}, \\text{Tiers Étendu}, \\text{Tiers Simple}\\}$, et le profil de risque mesuré par le **Coefficient de Réduction-Majoration** ($\\text{CRM}_i$, colonne \`bonus_malus\`).

Pour mesurer le positionnement relatif de chaque assuré *au sein de sa propre formule* sans perdre la granularité contrat, on compare $P_i$ et $\\text{CRM}_i$ aux moyennes conditionnelles intra-formule :

$$
\\bar{P}_{f(i)} = \\frac{1}{n_{f(i)}} \\sum_{j : f(j) = f(i)} P_j, \\qquad \\overline{\\text{CRM}}_{f(i)} = \\frac{1}{n_{f(i)}} \\sum_{j : f(j) = f(i)} \\text{CRM}_j
$$

L'**écart relatif en pourcentage** par rapport à la moyenne de formule s'écrit :

$$
\\Delta_i = 100 \\times \\frac{P_i - \\bar{P}_{f(i)}}{\\bar{P}_{f(i)}}
$$

Un contrat présentant $|\\Delta_i| > 20\\%$ constitue une **anomalie ou singularité tarifaire** méritant vérification :
- Si $\\Delta_i > +20\\%$ et que le CRM est élevé ($\\text{CRM}_i > \\overline{\\text{CRM}}_{f(i)}$), la sur-prime est cohérente avec la sinistralité passée et la puissance du véhicule ;
- Si $\\Delta_i > +20\\%$ malgré un CRM minimal ($0.50$), l'écart provient d'autres facteurs tarifaires (véhicule haut de gamme, forte puissance fiscale) ;
- Si $\\Delta_i < -20\\%$ malgré un CRM élevé, il peut s'agir d'une sous-tarification dangereuse (*anti-sélection*).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Dans le cadre de la gouvernance produit (**DDA / IDD — Product Oversight & Governance**) et du suivi de la marge technique, les contrôles mensuels par fenêtre partitionnée détectent automatiquement les dérives de remise commerciale, les erreurs de paramétrage moteur de tarif et les poches exposées à l'anti-sélection.

#### 💻 Masterclass SQL de Production

Comment afficher simultanément une ligne individuelle (\`police_id\`, \`prime_annuelle\`) **et** l'agrégat de son groupe (\`prime_moy_formule\`) ?
- Un \`GROUP BY type_contrat\` classique **écraserait** les $12$ contrats en $3$ lignes ;
- L'ancienne approche exigeait une sous-requête agrégée suivie d'une auto-jointure sur \`type_contrat\` ;
- L'approche moderne et performante en une seule passe utilise une **fonction de fenêtre partitionnée** : \`AVG(prime_annuelle) OVER (PARTITION BY type_contrat)\`.

Remarquez deux subtilités essentielles :
1. En l'absence de clause \`ORDER BY\` à l'intérieur de \`OVER (PARTITION BY type_contrat)\`, la fenêtre couvre **toute la partition** de la formule (tous les contrats de même \`type_contrat\`).
2. Isoler ces calculs de fenêtrage dans une **CTE \`reference_formule\`** permet ensuite, dans le \`SELECT\` principal, de réutiliser librement les alias \`prime_moy_formule\` et \`crm_moy_formule\` dans le calcul de \`ecart_prime_pct\`, dans le \`CASE WHEN\`, et même dans l'\`ORDER BY ABS(...)\` sans répéter les clauses \`OVER (...)\`.

\`\`\`sql
-- Isolation des agrégats fenêtrés dans une CTE avant le calcul des écarts
WITH reference_formule AS (
    SELECT
        police_id,
        assure_id,
        type_contrat,
        bonus_malus,
        prime_annuelle,
        AVG(prime_annuelle) OVER (PARTITION BY type_contrat) AS prime_moy_formule,
        AVG(bonus_malus) OVER (PARTITION BY type_contrat) AS crm_moy_formule
    FROM assures
)
SELECT
    police_id,
    type_contrat,
    ROUND(prime_annuelle, 2) AS prime_annuelle,
    ROUND(prime_moy_formule, 2) AS prime_moy_formule,
    ROUND(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule, 2) AS ecart_prime_pct
FROM reference_formule;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Statistiques descriptives réelles par \`type_contrat\` sur la table \`assures\` ($12$ contrats), servant de référence de comparaison pour les fenêtres \`OVER (PARTITION BY type_contrat)\` :

\`\`\`sql
SELECT type_contrat, COUNT(*) AS nb_polices,
       ROUND(AVG(prime_annuelle), 2) AS prime_moy,
       ROUND(MIN(prime_annuelle), 2) AS prime_min,
       ROUND(MAX(prime_annuelle), 2) AS prime_max,
       ROUND(AVG(bonus_malus), 2) AS crm_moy
FROM assures
GROUP BY type_contrat
ORDER BY prime_moy DESC;
\`\`\`

\`\`\`text
type_contrat | nb_polices | prime_moy | prime_min | prime_max | crm_moy
-------------+------------+-----------+-----------+-----------+--------
Tous Risques | 7          | 1068.83   | 710.8     | 2100      | 0.75
Tiers Simple | 2          | 1035      | 920       | 1150      | 1
Tiers Étendu | 3          | 585       | 490       | 645       | 0.51
\`\`\`

Par exemple, en \`Tous Risques\` (moyenne $1\\,068.83\\text{ EUR}$, CRM moyen $0.75$), la police \`1007\` ($2\\,100\\text{ EUR}$, jeune conducteur $24$ ans en Sportive $11$ CV à CRM $1.15$) affiche un écart de $+96.48\\%$, tandis que \`1004\` ($1\\,340.20\\text{ EUR}$, SUV $9$ CV malgré un CRM optimal de $0.50$) ressort à $+25.39\\%$.
      `,
      taskMarkdown: `
Construisez un pipeline SQL en 2 étapes sur la table \`assures\` :

1. **CTE \`reference_formule\`** : sélectionnez \`police_id\`, \`assure_id\`, \`type_contrat\`, \`bonus_malus\`, \`prime_annuelle\`, ainsi que deux fonctions de fenêtre partitionnées par formule :
   - \`AVG(prime_annuelle) OVER (PARTITION BY type_contrat) AS prime_moy_formule\`
   - \`AVG(bonus_malus) OVER (PARTITION BY type_contrat) AS crm_moy_formule\`
2. **Requête principale** : interrogez \`reference_formule\` et retournez dans **cet ordre exact** :
   - \`police_id\`, \`assure_id\`, \`type_contrat\`
   - \`prime_annuelle\` : \`ROUND(prime_annuelle, 2)\`
   - \`prime_moy_formule\` : \`ROUND(prime_moy_formule, 2)\`
   - \`bonus_malus\` : \`ROUND(bonus_malus, 2)\`
   - \`crm_moy_formule\` : \`ROUND(crm_moy_formule, 2)\`
   - \`ecart_prime_pct\` : \`ROUND(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule, 2)\`
   - \`statut_tarifaire\` : \`CASE WHEN\` sur l'écart non arrondi : \`> 20.0\` $\\to$ \`'Sur-tarifé (> +20%)'\`, \`< -20.0\` $\\to$ \`'Sous-tarifé (< -20%)'\`, sinon \`'Dans la norme'\`

Triez par écart absolu décroissant puis par contrat croissant : \`ORDER BY ABS(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule) DESC, police_id ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH reference_formule AS (
    SELECT
        police_id,
        assure_id,
        type_contrat,
        bonus_malus,
        prime_annuelle,
        AVG(prime_annuelle) OVER (PARTITION BY type_contrat) AS prime_moy_formule,
        AVG(bonus_malus) OVER (PARTITION BY type_contrat) AS crm_moy_formule
    FROM assures
)
SELECT
    police_id,
    assure_id,
    type_contrat,
    ROUND(prime_annuelle, 2) AS prime_annuelle,
    ROUND(prime_moy_formule, 2) AS prime_moy_formule,
    ROUND(bonus_malus, 2) AS bonus_malus,
    ROUND(crm_moy_formule, 2) AS crm_moy_formule,
    ROUND(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule, 2) AS ecart_prime_pct,
    CASE
        WHEN 100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule > 20.0 THEN 'Sur-tarifé (> +20%)'
        WHEN 100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule < -20.0 THEN 'Sous-tarifé (< -20%)'
        ELSE 'Dans la norme'
    END AS statut_tarifaire
FROM reference_formule
ORDER BY ABS(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule) DESC, police_id ASC;`,
      validationQuery: `WITH reference_formule AS (
    SELECT
        police_id,
        assure_id,
        type_contrat,
        bonus_malus,
        prime_annuelle,
        AVG(prime_annuelle) OVER (PARTITION BY type_contrat) AS prime_moy_formule,
        AVG(bonus_malus) OVER (PARTITION BY type_contrat) AS crm_moy_formule
    FROM assures
)
SELECT
    police_id,
    assure_id,
    type_contrat,
    ROUND(prime_annuelle, 2) AS prime_annuelle,
    ROUND(prime_moy_formule, 2) AS prime_moy_formule,
    ROUND(bonus_malus, 2) AS bonus_malus,
    ROUND(crm_moy_formule, 2) AS crm_moy_formule,
    ROUND(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule, 2) AS ecart_prime_pct,
    CASE
        WHEN 100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule > 20.0 THEN 'Sur-tarifé (> +20%)'
        WHEN 100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule < -20.0 THEN 'Sous-tarifé (< -20%)'
        ELSE 'Dans la norme'
    END AS statut_tarifaire
FROM reference_formule
ORDER BY ABS(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule) DESC, police_id ASC;`,
      datasets: [],
      hints: [
        "Dans la CTE `reference_formule`, calculez `AVG(prime_annuelle) OVER (PARTITION BY type_contrat)` et `AVG(bonus_malus) OVER (PARTITION BY type_contrat)` sans `GROUP BY` afin de conserver les 12 polices.",
        "L'écart relatif en pourcentage vaut `100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule`.",
        "Ajoutez `, police_id ASC` après `ABS(...) DESC` dans le `ORDER BY` pour départager proprement les contrats symétriques de `Tiers Simple` (`+11.11` et `-11.11`).",
      ],
      guide: {
        theoryToPracticeLink:
          "Pour calculer $\\Delta_i = 100 \\times \\frac{P_i - \\bar{P}_{f(i)}}{\\bar{P}_{f(i)}}$ au niveau individuel tout en connaissant l'agrégat $\\bar{P}_{f(i)}$ de la formule, la fonction de fenêtre \`AVG(...) OVER (PARTITION BY type_contrat)\` évalue la moyenne de groupe sur chaque ligne sans écraser les contrats. Encapsuler ces références dans la CTE \`reference_formule\` rend ensuite le calcul de l'écart, sa classification et son tri par \`ABS(...)\` immédiats.",
        stepByStepPlan: [
          "Créer la CTE `reference_formule` depuis `assures` avec `AVG(prime_annuelle) OVER (PARTITION BY type_contrat)` et `AVG(bonus_malus) OVER (PARTITION BY type_contrat)`.",
          "Dans la requête externe, projeter les identifiants, les valeurs individuelles et moyennes arrondies à 2 décimales.",
          "Calculer `ecart_prime_pct` via `ROUND(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule, 2)`.",
          "Classifier chaque contrat en `'Sur-tarifé (> +20%)'`, `'Sous-tarifé (< -20%)'` ou `'Dans la norme'` à l'aide de `CASE WHEN`.",
          "Trier par écart absolu décroissant `ABS(...) DESC` puis `police_id ASC` pour garantir un classement déterministe.",
        ],
        concepts: [
          {
            symbol: "reference_formule",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE enrichissant chacune des $12$ polices avec les moyennes de sa formule (`prime_moy_formule` et `crm_moy_formule`).",
          },
          {
            symbol: "OVER (PARTITION BY type_contrat)",
            kind: "Syntaxe",
            roleInExercise:
              "Définit une fenêtre regroupant toutes les lignes partageant le même `type_contrat` sans réduire le nombre de lignes du résultat.",
          },
          {
            symbol: "prime_moy_formule, crm_moy_formule",
            kind: "Variable",
            roleInExercise:
              "Benchmarks moyens $\\bar{P}_{f(i)}$ et $\\overline{\\text{CRM}}_{f(i)}$ calculés dynamiquement par formule tarifaire.",
          },
          {
            symbol: "ecart_prime_pct",
            kind: "Variable",
            roleInExercise:
              "Écart relatif en pourcentage entre la prime du contrat et la prime moyenne de sa formule.",
          },
          {
            symbol: "statut_tarifaire",
            kind: "Variable",
            roleInExercise:
              "Alerte tarifaire issue de `CASE WHEN` identifiant les contrats au-delà du corridor de tolérance $\\pm 20\\%$.",
          },
          {
            symbol: "ABS(...)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Valeur absolue permettant de classer ensemble les plus forts écarts positifs et négatifs dans `ORDER BY`.",
          },
          {
            symbol: "police_id ASC",
            kind: "Paramètre",
            roleInExercise:
              "Critère de départage déterministe en cas d'égalité stricte d'écart absolu (comme les deux contrats `Tiers Simple` à $\\pm 11.11\\%$).",
          },
        ],
        guidedCode: `-- 1. Calculer les moyennes de référence par formule via fenêtrage partitionné
WITH reference_formule AS (
    SELECT
        police_id,
        assure_id,
        type_contrat,
        bonus_malus,
        prime_annuelle,
        AVG(prime_annuelle) OVER (PARTITION BY ___) AS prime_moy_formule,
        AVG(bonus_malus) OVER (PARTITION BY ___) AS crm_moy_formule
    FROM assures
)
-- 2. Calculer l'écart relatif (%) et détecter les anomalies > +/- 20 %
SELECT
    police_id,
    assure_id,
    type_contrat,
    ROUND(prime_annuelle, 2) AS prime_annuelle,
    ROUND(prime_moy_formule, 2) AS prime_moy_formule,
    ROUND(bonus_malus, 2) AS bonus_malus,
    ROUND(crm_moy_formule, 2) AS crm_moy_formule,
    ROUND(100.0 * (___ - ___) / ___, 2) AS ecart_prime_pct,
    CASE
        WHEN 100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule > 20.0 THEN '___'
        WHEN 100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule < -20.0 THEN '___'
        ELSE '___'
    END AS statut_tarifaire
FROM reference_formule
ORDER BY ABS(100.0 * (prime_annuelle - prime_moy_formule) / prime_moy_formule) DESC, police_id ASC;`,
      },
    },

    // =========================================================================
    // CAS 4 : Courbe de Concentration Pareto (80/20) des Grands Sinistres
    // =========================================================================
    {
      id: "v3-sql-4",
      title: "4. Courbe de Concentration Pareto (80/20) des Grands Sinistres",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 25,
      description:
        "Construisez la courbe de concentration Pareto des sinistres ordonnés par sévérité décroissante et segmentez la priorité de la tranche de réassurance XS (5 000 EUR).",
      theoryMarkdown: `
### Loi de Pareto, Courbe de Lorenz Inverse et Réassurance Excess of Loss (XS)

#### 🎓 Cours Théorique Approfondi

En assurance dommages, la distribution empirique du coût individuel d'un sinistre $X > 0$ est fortement asymétrique à droite (*heavy-tailed*) et modélisée classiquement par une loi de **Pareto** ou log-normale :

$$
\\mathbb{P}(X > x) = \\left(\\frac{x_m}{x}\\right)^\\alpha, \\qquad x \\ge x_m > 0, \\quad \\alpha > 1
$$

Cette asymétrie engendre le **principe de Pareto (80/20)** : une minorité de sinistres graves (*large claims*) concentre la majorité de la charge totale indemnisée. Si l'on trie les $N$ sinistres par coût décroissant $C_{(1)} \\ge C_{(2)} \\ge \\dots \\ge C_{(N)}$, la **part cumulée de charge** au rang $k$ vaut :

$$
L_{\\text{inv}}(k) = 100 \\times \\frac{\\sum_{j=1}^{k} C_{(j)}}{\\sum_{j=1}^{N} C_{(j)}}
$$

Pour protéger ses fonds propres contre l'explosion de quelques sinistres majeurs, l'assureur cède le risque extrême via un **traité de réassurance en Excédent de Sinistre** (*Excess of Loss*, noté **XS** ou **XL**) de priorité (rétention) $P = 5\\,000\\text{ EUR}$ :

$$
C_j^{\\text{cédante}} = \\min(C_j, P), \\qquad C_j^{\\text{réassureur}} = (C_j - P)_+ = \\max(0, C_j - P)
$$

Ainsi, tout sinistre supérieur ou égal à $5\\,000\\text{ EUR}$ entre dans la couche XS et doit faire l'objet d'un suivi individuel (*large loss reporting*).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Dans le calcul du **SCR Non-Vie** sous Solvabilité II (formule standard ou modèle interne partiel), l'analyse Pareto des sinistres bruts versus nets de réassurance XS justifie le crédit de réassurance (*risk mitigation*) et permet de fixer la rétention optimale $P$ en minimisant la variance résiduelle retenue au bilan.

#### 💻 Masterclass SQL de Production

Ce cas combine deux formes complémentaires de fenêtrage analytique \`SUM() OVER (...)\` dans une **CTE \`sinistres_cumul\`** :

1. **Total global du portefeuille** : \`SUM(cout_total) OVER ()\` (parenthèses vides !) calcule la somme sur l'ensemble de la table tout en laissant chaque ligne intacte.
2. **Cumul glissant décroissant** : \`SUM(cout_total) OVER (ORDER BY cout_total DESC, sinistre_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\`.
   - **Précision critique (\`ROWS\` vs \`RANGE\`)** : sans spécifier \`ROWS BETWEEN ...\`, SQLite utilise par défaut \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. En mode \`RANGE\`, si deux sinistres avaient exactement le même \`cout_total\`, ils recevraient tous les deux le même cumul total au lieu d'incrémenter ligne par ligne ! Spécifier explicitement \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` + un critère de départage \`sinistre_id ASC\` garantit un cumul strictement monotone et auditable.

\`\`\`sql
-- Double fenêtrage : total global OVER () et cumul ordonné ROWS BETWEEN
WITH sinistres_cumul AS (
    SELECT
        sinistre_id,
        nature_sinistre,
        cout_total,
        SUM(cout_total) OVER () AS charge_totale_portefeuille,
        SUM(cout_total) OVER (
            ORDER BY cout_total DESC, sinistre_id ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cout_cumule
    FROM sinistres
)
SELECT sinistre_id, nature_sinistre, cout_total, cout_cumule
FROM sinistres_cumul
ORDER BY cout_total DESC, sinistre_id ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Simulation réelle du traité XS de priorité $5\\,000\\text{ EUR}$ sur la table \`sinistres\` (charge totale brute = $48\\,950\\text{ EUR}$) :

\`\`\`sql
SELECT
  CASE WHEN cout_total < 5000.0 THEN 'Priorité (< 5k)' ELSE 'Tranche XS (>= 5k)' END AS tranche,
  COUNT(*) AS nb_sinistres,
  ROUND(SUM(cout_total), 2) AS charge_brute,
  ROUND(SUM(CASE WHEN cout_total > 5000.0 THEN cout_total - 5000.0 ELSE 0.0 END), 2) AS part_reassureur_xs,
  ROUND(SUM(CASE WHEN cout_total > 5000.0 THEN 5000.0 ELSE cout_total END), 2) AS part_cedante
FROM sinistres
GROUP BY tranche
ORDER BY charge_brute DESC;
\`\`\`

\`\`\`text
tranche            | nb_sinistres | charge_brute | part_reassureur_xs | part_cedante
-------------------+--------------+--------------+--------------------+-------------
Tranche XS (>= 5k) | 4            | 44600        | 24600              | 20000
Priorité (< 5k)    | 4            | 4350         | 0                  | 4350
\`\`\`

La tranche XS capte $44\\,600\\text{ EUR}$ sur $48\\,950\\text{ EUR}$ ($91.11\\%$ de la charge totale) et permet à la cédante de transférer $24\\,600\\text{ EUR}$ ($50.26\\%$ du coût global) au réassureur !
      `,
      taskMarkdown: `
Construisez la courbe de concentration Pareto sur la table \`sinistres\` en 2 étapes :

1. **CTE \`sinistres_cumul\`** : sélectionnez \`sinistre_id\`, \`nature_sinistre\`, \`cout_total\`, puis calculez :
   - \`SUM(cout_total) OVER () AS charge_totale_portefeuille\`
   - \`SUM(cout_total) OVER (ORDER BY cout_total DESC, sinistre_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cout_cumule\`
2. **Requête principale** : interrogez \`sinistres_cumul\` et retournez dans **cet ordre exact** :
   - \`sinistre_id\`, \`nature_sinistre\`
   - \`cout_total\` : \`ROUND(cout_total, 2)\`
   - \`part_pct\` : \`ROUND(100.0 * cout_total / charge_totale_portefeuille, 2)\`
   - \`cout_cumule\` : \`ROUND(cout_cumule, 2)\`
   - \`part_cumulee_pct\` : \`ROUND(100.0 * cout_cumule / charge_totale_portefeuille, 2)\`
   - \`tranche_reassurance\` : \`CASE WHEN cout_total < 5000.0 THEN 'Priorité (< 5k)' ELSE 'Tranche XS (>= 5k)' END\`

Triez par \`cout_total DESC, sinistre_id ASC\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH sinistres_cumul AS (
    SELECT
        sinistre_id,
        nature_sinistre,
        cout_total,
        SUM(cout_total) OVER () AS charge_totale_portefeuille,
        SUM(cout_total) OVER (
            ORDER BY cout_total DESC, sinistre_id ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cout_cumule
    FROM sinistres
)
SELECT
    sinistre_id,
    nature_sinistre,
    ROUND(cout_total, 2) AS cout_total,
    ROUND(100.0 * cout_total / charge_totale_portefeuille, 2) AS part_pct,
    ROUND(cout_cumule, 2) AS cout_cumule,
    ROUND(100.0 * cout_cumule / charge_totale_portefeuille, 2) AS part_cumulee_pct,
    CASE
        WHEN cout_total < 5000.0 THEN 'Priorité (< 5k)'
        ELSE 'Tranche XS (>= 5k)'
    END AS tranche_reassurance
FROM sinistres_cumul
ORDER BY cout_total DESC, sinistre_id ASC;`,
      validationQuery: `WITH sinistres_cumul AS (
    SELECT
        sinistre_id,
        nature_sinistre,
        cout_total,
        SUM(cout_total) OVER () AS charge_totale_portefeuille,
        SUM(cout_total) OVER (
            ORDER BY cout_total DESC, sinistre_id ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cout_cumule
    FROM sinistres
)
SELECT
    sinistre_id,
    nature_sinistre,
    ROUND(cout_total, 2) AS cout_total,
    ROUND(100.0 * cout_total / charge_totale_portefeuille, 2) AS part_pct,
    ROUND(cout_cumule, 2) AS cout_cumule,
    ROUND(100.0 * cout_cumule / charge_totale_portefeuille, 2) AS part_cumulee_pct,
    CASE
        WHEN cout_total < 5000.0 THEN 'Priorité (< 5k)'
        ELSE 'Tranche XS (>= 5k)'
    END AS tranche_reassurance
FROM sinistres_cumul
ORDER BY cout_total DESC, sinistre_id ASC;`,
      datasets: [],
      hints: [
        "Dans la CTE `sinistres_cumul`, utilisez `SUM(cout_total) OVER ()` pour obtenir la somme totale sur toutes les lignes sans regroupement.",
        "Pour le cumul glissant, utilisez `SUM(cout_total) OVER (ORDER BY cout_total DESC, sinistre_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.",
        "N'oubliez pas d'exprimer `part_pct` et `part_cumulee_pct` en base `100.0` arrondis à 2 décimales et de trier la sortie par `cout_total DESC, sinistre_id ASC`.",
      ],
      guide: {
        theoryToPracticeLink:
          "La courbe de Pareto $L_{\\text{inv}}(k) = 100 \\times \\frac{\\sum_{j=1}^k C_{(j)}}{\\sum_{j=1}^N C_{(j)}}$ requiert simultanément le numérateur cumulatif ordonné par coût décroissant et le dénominateur constant global. En SQL, la CTE \`sinistres_cumul\` évalue ces deux grandeurs en une seule lecture grâce à \`SUM(...) OVER (ORDER BY ... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\` et \`SUM(...) OVER ()\`.",
        stepByStepPlan: [
          "Créer la CTE `sinistres_cumul` sur `sinistres` en projetant `sinistre_id`, `nature_sinistre` et `cout_total`.",
          "Y calculer `charge_totale_portefeuille` avec `SUM(cout_total) OVER ()` et `cout_cumule` via `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.",
          "Dans la requête principale, calculer `part_pct` et `part_cumulee_pct` en divisant par `charge_totale_portefeuille` (multiplié par `100.0` et arrondi à `2` décimales).",
          "Étiqueter chaque dossier en `'Priorité (< 5k)'` ou `'Tranche XS (>= 5k)'` avec `CASE WHEN`, puis trier par `cout_total DESC, sinistre_id ASC;`.",
        ],
        concepts: [
          {
            symbol: "sinistres_cumul",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE pré-calculant le total du portefeuille et le cumul glissant décroissant sur chaque sinistre.",
          },
          {
            symbol: "SUM(cout_total) OVER ()",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Fenêtre globale vide calculant $\\sum_{j=1}^N C_j$ ($48\\,950\\text{ EUR}$) sur toutes les lignes sans écraser les sinistres.",
          },
          {
            symbol: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
            kind: "Syntaxe",
            roleInExercise:
              "Cadre physique de fenêtre imposant d'additionner strictement de la première ligne triée jusqu'à la ligne courante (évitant le piège du `RANGE` par défaut).",
          },
          {
            symbol: "ORDER BY cout_total DESC, sinistre_id ASC",
            kind: "Paramètre",
            roleInExercise:
              "Ordre décroissant de sévérité (avec départage sur `sinistre_id`) partagé entre la fenêtre de cumul et la projection finale.",
          },
          {
            symbol: "part_pct, part_cumulee_pct",
            kind: "Variable",
            roleInExercise:
              "Poids individuel et poids cumulé (courbe de concentration Pareto) exprimés en pourcentage de la charge totale.",
          },
          {
            symbol: "tranche_reassurance",
            kind: "Variable",
            roleInExercise:
              "Classification opérationnelle séparant les sinistres conservés sous priorité ($< 5\\,000\\text{ EUR}$) et ceux impactant le traité XS ($\\ge 5\\,000\\text{ EUR}$).",
          },
        ],
        guidedCode: `-- 1. CTE calculant le total global et le cumul décroissant des sinistres
WITH sinistres_cumul AS (
    SELECT
        sinistre_id,
        nature_sinistre,
        cout_total,
        SUM(cout_total) OVER () AS charge_totale_portefeuille,
        SUM(cout_total) OVER (
            ORDER BY cout_total DESC, sinistre_id ASC
            ROWS BETWEEN ___ AND ___
        ) AS cout_cumule
    FROM sinistres
)
-- 2. Courbe de concentration Pareto (%) et segmentation réassurance XS
SELECT
    sinistre_id,
    nature_sinistre,
    ROUND(cout_total, 2) AS cout_total,
    ROUND(100.0 * cout_total / ___, 2) AS part_pct,
    ROUND(cout_cumule, 2) AS cout_cumule,
    ROUND(100.0 * cout_cumule / ___, 2) AS part_cumulee_pct,
    CASE
        WHEN cout_total < 5000.0 THEN '___'
        ELSE '___'
    END AS tranche_reassurance
FROM sinistres_cumul
ORDER BY cout_total DESC, sinistre_id ASC;`,
      },
    },

    // =========================================================================
    // CAS 5 : Tableau de Bord Comité ALM Multi-Indicateurs (macro_taux)
    // =========================================================================
    {
      id: "v3-sql-5",
      title: "5. Tableau de Bord Comité ALM Multi-Indicateurs (macro_taux)",
      category: "alm",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 30,
      description:
        "Produisez un tableau de bord trimestriel pour le comité ALM combinant pente de taux, taux souverain réel (Fisher), variation monétaire via LAG, moyenne mobile 3 trimestres du CAC 40 et régime monétaire.",
      theoryMarkdown: `
### Dynamique de la Courbe des Taux, Équation de Fisher et Régimes ALM

#### 🎓 Cours Théorique Approfondi

En gestion Actif-Passif (**ALM** — *Asset & Liability Management*), la rentabilité et la solvabilité d'un assureur vie ou d'une banque dépendent de quatre indicateurs macro-financiers suivis conjointement en comité ALM :

1. **La pente de la courbe des taux** (*Term Spread*), écart entre le taux long souverain ($y_t^{(10\\text{Y})}$, \`oat_10y\`) et le taux court monétaire ($r_t^{(3\\text{M})}$, \`euribor_3m\`) :

$$
S_t = y_t^{(10\\text{Y})} - r_t^{(3\\text{M})}
$$

Une pente positive ($S_t > 0$) rémunère la transformation de maturité ; une **inversion de courbe** ($S_t < 0$) traduit un resserrement monétaire sévère et comprime la marge d'intermédiation tout en accroissant le risque de rachat dynamique sur les fonds en euros.

2. **Le taux d'intérêt réel souverain** via l'approximation de **Fisher** (pour de faibles taux) :

$$
1 + r_t^{\\text{réel}} = \\frac{1 + y_t^{(10\\text{Y})}}{1 + \\pi_t} \\implies r_t^{\\text{réel}} \\approx y_t^{(10\\text{Y})} - \\pi_t
$$

où $\\pi_t$ est l'inflation harmonisée (\`inflation_hicp\`). Un taux réel fortement négatif érode le pouvoir d'achat des placements obligataires et pénalise les rendements réels servis aux assurés.

3. **Le choc monétaire trimestriel** $\\Delta r_t = r_t^{(3\\text{M})} - r_{t-1}^{(3\\text{M})}$ (vitesse de relèvement des taux directeurs) et la **moyenne mobile glissante d'ordre 3** sur le rendement actions CAC 40 :

$$
\\overline{\\text{CAC}}_{t, 3} = \\frac{1}{\\min(3, t)} \\sum_{j=0}^{\\min(2, t-1)} R_{t-j}^{\\text{CAC40}}
$$

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous Solvabilité II (**ORSA** — *Own Risk and Solvency Assessment*), les scénarios de stress taux/inflation analysent précisément la transition entre régimes monétaires : passage des taux négatifs (compression des produits financiers récurrents) à un choc de hausse rapide (chute de la valeur de marché des obligations, risque de rachats massifs et baisse du ratio de couverture SCR).

#### 💻 Masterclass SQL de Production

La table \`macro_taux\` comporte des trimestres ordonnés chronologiquement au format ISO \`'YYYY-QN'\` (ce qui assure que le tri lexicographique \`ORDER BY periode ASC\` coïncide exactement avec l'ordre temporel). Dans une **CTE \`indicateurs_alm\`**, on combine trois mécaniques :
- **Opérations algébriques intra-ligne** : \`oat_10y - euribor_3m\` et \`oat_10y - inflation_hicp\` ;
- **Décalage temporel \`LAG(euribor_3m, 1) OVER (ORDER BY periode ASC)\`** : calcule la variation d'un trimestre à l'autre (\`NULL\` au premier trimestre \`2020-Q1\`) ;
- **Fenêtre glissante bornée \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\`** : inclut la ligne courante et les $2$ trimestres précédents (soit $3$ trimestres au total, et $1$ puis $2$ observations aux deux premiers trimestres sans produire de \`NULL\`).

La requête externe ajoute ensuite la classification par régime monétaire via \`CASE WHEN\` sur \`euribor_3m\`.

\`\`\`sql
-- Calcul simultané de LAG et de fenêtre mobile 3 trimestres dans la CTE ALM
WITH indicateurs_alm AS (
    SELECT
        periode,
        euribor_3m,
        oat_10y,
        ROUND(oat_10y - euribor_3m, 2) AS pente_taux,
        ROUND(oat_10y - inflation_hicp, 2) AS taux_reel_oat,
        ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY periode ASC), 2) AS var_euribor_trim,
        ROUND(AVG(cac40_rendement) OVER (
            ORDER BY periode ASC
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 2) AS cac40_mm3
    FROM macro_taux
)
SELECT * FROM indicateurs_alm ORDER BY periode ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Agrégation réelle des indicateurs ALM de \`macro_taux\` par régime monétaire sur la période \`2020-Q1\` à \`2023-Q4\` ($16$ trimestres) :

\`\`\`sql
WITH r AS (
  SELECT *,
    CASE
      WHEN euribor_3m < 0.0 THEN 'Taux Négatifs'
      WHEN euribor_3m < 2.5 THEN 'Normalisation'
      ELSE 'Resserrement'
    END AS regime_monetaire
  FROM macro_taux
)
SELECT regime_monetaire,
       COUNT(*) AS nb_trimestres,
       ROUND(AVG(euribor_3m), 2) AS euribor_moy,
       ROUND(AVG(oat_10y - euribor_3m), 2) AS pente_moy,
       ROUND(AVG(oat_10y - inflation_hicp), 2) AS taux_reel_moy,
       ROUND(AVG(spread_credit_bbb), 2) AS spread_bbb_moy,
       ROUND(AVG(cac40_rendement), 2) AS cac40_moy
FROM r
GROUP BY regime_monetaire
ORDER BY euribor_moy ASC;
\`\`\`

\`\`\`text
regime_monetaire | nb_trimestres | euribor_moy | pente_moy | taux_reel_moy | spread_bbb_moy | cac40_moy
-----------------+---------------+-------------+-----------+---------------+----------------+----------
Taux Négatifs    | 10            | -0.47       | 0.69      | -2.62         | 1.09           | 0.71
Normalisation    | 2             | 1.5         | 1.41      | -6.63         | 1.88           | 4.85
Resserrement     | 4             | 3.5         | -0.35     | -1.75         | 1.59           | 3.77
\`\`\`

Ce diagnostic met en évidence les trois régimes européens 2020–2023 : $10$ trimestres de taux négatifs (pente $+0.69\\%$), $2$ trimestres de normalisation rapide où le taux réel OAT plonge à $-6.63\\%$ sous le pic d'inflation, puis $4$ trimestres de resserrement où la courbe des taux s'inverse en moyenne ($-0.35\\%$).
      `,
      taskMarkdown: `
Construisez le tableau de bord ALM à partir de \`macro_taux\` en 2 étapes :

1. **CTE \`indicateurs_alm\`** : sélectionnez \`periode\`, \`euribor_3m\`, \`oat_10y\`, \`inflation_hicp\`, \`cac40_rendement\` et calculez (arrondis à 2 décimales avec \`ROUND(..., 2)\`) :
   - \`pente_taux\` : \`ROUND(oat_10y - euribor_3m, 2)\`
   - \`taux_reel_oat\` : \`ROUND(oat_10y - inflation_hicp, 2)\`
   - \`var_euribor_trim\` : \`ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY periode ASC), 2)\`
   - \`cac40_mm3\` : \`ROUND(AVG(cac40_rendement) OVER (ORDER BY periode ASC ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2)\`
2. **Requête principale** : interrogez \`indicateurs_alm\` et retournez dans **cet ordre exact** :
   - \`periode\`, \`euribor_3m\`, \`oat_10y\`, \`pente_taux\`, \`taux_reel_oat\`, \`var_euribor_trim\`, \`cac40_mm3\`
   - \`regime_monetaire\` : \`CASE WHEN euribor_3m < 0.0 THEN 'Taux Négatifs' WHEN euribor_3m < 2.5 THEN 'Normalisation' ELSE 'Resserrement' END\`

Triez chronologiquement par \`periode ASC\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH indicateurs_alm AS (
    SELECT
        periode,
        euribor_3m,
        oat_10y,
        inflation_hicp,
        cac40_rendement,
        ROUND(oat_10y - euribor_3m, 2) AS pente_taux,
        ROUND(oat_10y - inflation_hicp, 2) AS taux_reel_oat,
        ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY periode ASC), 2) AS var_euribor_trim,
        ROUND(AVG(cac40_rendement) OVER (
            ORDER BY periode ASC
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 2) AS cac40_mm3
    FROM macro_taux
)
SELECT
    periode,
    euribor_3m,
    oat_10y,
    pente_taux,
    taux_reel_oat,
    var_euribor_trim,
    cac40_mm3,
    CASE
        WHEN euribor_3m < 0.0 THEN 'Taux Négatifs'
        WHEN euribor_3m < 2.5 THEN 'Normalisation'
        ELSE 'Resserrement'
    END AS regime_monetaire
FROM indicateurs_alm
ORDER BY periode ASC;`,
      validationQuery: `WITH indicateurs_alm AS (
    SELECT
        periode,
        euribor_3m,
        oat_10y,
        inflation_hicp,
        cac40_rendement,
        ROUND(oat_10y - euribor_3m, 2) AS pente_taux,
        ROUND(oat_10y - inflation_hicp, 2) AS taux_reel_oat,
        ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY periode ASC), 2) AS var_euribor_trim,
        ROUND(AVG(cac40_rendement) OVER (
            ORDER BY periode ASC
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 2) AS cac40_mm3
    FROM macro_taux
)
SELECT
    periode,
    euribor_3m,
    oat_10y,
    pente_taux,
    taux_reel_oat,
    var_euribor_trim,
    cac40_mm3,
    CASE
        WHEN euribor_3m < 0.0 THEN 'Taux Négatifs'
        WHEN euribor_3m < 2.5 THEN 'Normalisation'
        ELSE 'Resserrement'
    END AS regime_monetaire
FROM indicateurs_alm
ORDER BY periode ASC;`,
      datasets: [],
      hints: [
        "Dans `indicateurs_alm`, combinez les écarts directs (`oat_10y - euribor_3m` et `oat_10y - inflation_hicp`) avec deux fenêtres ordonnées par `periode ASC`.",
        "La variation trimestrielle utilise `LAG(euribor_3m, 1) OVER (ORDER BY periode ASC)` et la moyenne mobile 3 trimestres utilise `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`.",
        "Classez les régimes dans la requête externe avec `euribor_3m < 0.0` (`'Taux Négatifs'`), `< 2.5` (`'Normalisation'`), sinon `'Resserrement'`, et triez par `periode ASC`.",
      ],
      guide: {
        theoryToPracticeLink:
          "Les indicateurs ALM mêlent écarts instantanés (pente $y^{(10\\text{Y})} - r^{(3\\text{M})}$, taux réel de Fisher $y^{(10\\text{Y})} - \\pi$) et opérateurs temporels ($\\Delta r_t$ et moyenne mobile $\\overline{\\text{CAC}}_{t,3}$). La CTE \`indicateurs_alm\` calcule en une seule passe les 4 métriques quantitatives via \`LAG\` et \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\`, puis le \`SELECT\` final ajoute l'étiquetage du régime monétaire.",
        stepByStepPlan: [
          "Construire la CTE `indicateurs_alm` à partir de `macro_taux` en projetant `periode`, `euribor_3m`, `oat_10y`, `inflation_hicp` et `cac40_rendement`.",
          "Calculer `pente_taux` et `taux_reel_oat` arrondis à 2 décimales.",
          "Ajouter `var_euribor_trim` via `euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY periode ASC)` et `cac40_mm3` via `AVG(cac40_rendement) OVER (ORDER BY periode ASC ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`.",
          "Dans la requête principale, classifier `regime_monetaire` par `CASE WHEN` sur `euribor_3m` et trier par `periode ASC;`.",
        ],
        concepts: [
          {
            symbol: "indicateurs_alm",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE calculant tous les spreads, variations trimestrielles et moyennes mobiles à partir de la série `macro_taux`.",
          },
          {
            symbol: "pente_taux",
            kind: "Variable",
            roleInExercise:
              "Spread de taux `oat_10y - euribor_3m` mesurant la pente de la courbe souveraine (négative lors d'une inversion).",
          },
          {
            symbol: "taux_reel_oat",
            kind: "Variable",
            roleInExercise:
              "Approximation de Fisher `oat_10y - inflation_hicp` mesurant le rendement réel de l'OAT 10 ans.",
          },
          {
            symbol: "LAG(euribor_3m, 1)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Accède à la valeur de l'Euribor du trimestre précédent pour mesurer la variation trimestrielle `var_euribor_trim` (`NULL` sur `2020-Q1`).",
          },
          {
            symbol: "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW",
            kind: "Syntaxe",
            roleInExercise:
              "Fenêtre mobile de $3$ trimestres ($t-2, t-1, t$) calculant la moyenne mobile lissée `cac40_mm3`.",
          },
          {
            symbol: "regime_monetaire",
            kind: "Variable",
            roleInExercise:
              "Classification macro-financière (`'Taux Négatifs'`, `'Normalisation'`, `'Resserrement'`) basée sur les seuils `0.0` et `2.5` de `euribor_3m`.",
          },
        ],
        guidedCode: `-- 1. CTE ALM : spreads instantanés, LAG(1) et moyenne mobile 3 trimestres
WITH indicateurs_alm AS (
    SELECT
        periode,
        euribor_3m,
        oat_10y,
        inflation_hicp,
        cac40_rendement,
        ROUND(oat_10y - ___, 2) AS pente_taux,
        ROUND(oat_10y - ___, 2) AS taux_reel_oat,
        ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY ___ ASC), 2) AS var_euribor_trim,
        ROUND(AVG(cac40_rendement) OVER (
            ORDER BY periode ASC
            ROWS BETWEEN ___ AND ___
        ), 2) AS cac40_mm3
    FROM macro_taux
)
-- 2. Restitution et étiquetage du régime monétaire
SELECT
    periode,
    euribor_3m,
    oat_10y,
    pente_taux,
    taux_reel_oat,
    var_euribor_trim,
    cac40_mm3,
    CASE
        WHEN euribor_3m < 0.0 THEN '___'
        WHEN euribor_3m < 2.5 THEN '___'
        ELSE '___'
    END AS regime_monetaire
FROM indicateurs_alm
ORDER BY periode ASC;`,
      },
    },

    // =========================================================================
    // CAS 6 : Screener Multi-Actifs : Pic Cumulé, Drawdown Pire Séance & Volume Relatif
    // =========================================================================
    {
      id: "v3-sql-6",
      title: "6. Screener Multi-Actifs : Pic Cumulé, Drawdown Pire Séance & Volume Relatif",
      category: "data_engineering",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 30,
      description:
        "Enchaînez deux CTEs partitionnées par ticker sur marche_actions pour calculer le sommet cumulé (High-Water Mark), le drawdown journalier, le volume relatif et consolider le screener de risque.",
      theoryMarkdown: `
### High-Water Mark, Maximum Drawdown (MDD) et Volume Relatif Multi-Actifs

#### 🎓 Cours Théorique Approfondi

En gestion systématique et en contrôle des risques de marché, deux mesures dépendantes du chemin (*path-dependent*) complètent la volatilité classique :

1. **Le sommet cumulé (*High-Water Mark*, HWM) et le *Drawdown* instantané :**
Pour un actif $i$ coté aux dates $t \\in \\{1, \\dots, T\\}$ au prix de clôture $P_{i,t} > 0$, le plus haut historique atteint jusqu'à la séance $t$ s'écrit :

$$
M_{i,t} = \\max_{1 \\le s \\le t} P_{i,s}
$$

Le **drawdown journalier** $\\text{DD}_{i,t} \\le 0$ mesure la perte relative subie depuis ce pic historique, et le **Maximum Drawdown** ($\\text{MDD}_i$, ou pire drawdown) correspond au creux minimal sur toute la période :

$$
\\text{DD}_{i,t} = 100 \\times \\frac{P_{i,t} - M_{i,t}}{M_{i,t}}, \\qquad \\text{MDD}_i = \\min_{1 \\le t \\le T} \\text{DD}_{i,t}
$$

2. **Le volume relatif (*Relative Volume*, RVOL) :**
Pour détecter des anomalies de liquidité ou des cassures institutionnelles sans biais de capitalisation entre un titre très liquide (\`BNP\`, ~3M titres/jour) et un ETF (\`CW8\`, ~150k parts/jour), on normalise le volume $V_{i,t}$ par la moyenne propre du titre $\\bar{V}_i$ :

$$
\\text{RVOL}_{i,t} = \\frac{V_{i,t}}{\\bar{V}_i}, \\qquad \\bar{V}_i = \\frac{1}{T} \\sum_{s=1}^T V_{i,s}
$$

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Le Maximum Drawdown est un critère d'appétit au risque central des mandats sous contrainte de capital (CPPI, fonds à coussin, mandats institutionnels) : contrairement à la variance qui traite symétriquement hausses et baisses, le MDD capture le risque extrême de perte en capital consécutive (*tail sequence risk*).

#### 💻 Masterclass SQL de Production

Ce cas illustre un **pipeline multi-CTEs à deux étages** suivi d'une consolidation \`GROUP BY ticker\` :

1. **CTE 1 (\`fenetre_actifs\`) — Calcul des références fenêtrées** :
   - \`MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_cumule\` : calcule le *High-Water Mark* glissant **indépendamment pour chaque actif** grâce à \`PARTITION BY ticker\`.
   - \`AVG(volume) OVER (PARTITION BY ticker) AS volume_moy_titre\` : moyenne sur toute l'histoire de chaque titre.
   - \`ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rang_recence\` : numérote chaque séance en partant de la plus récente (\`rang_recence = 1\` désigne exactement la dernière date de cotation, évitant les subtilités de cadrage de \`LAST_VALUE\`).
2. **CTE 2 (\`metriques_jour\`) — Dérivation des ratios journaliers** :
   - En SQL, on ne peut pas réutiliser un alias calculé (\`pic_cumule\`, \`volume_moy_titre\`) dans une autre expression du même \`SELECT\`. Chaîner une seconde CTE permet de calculer proprement \`drawdown_jour_pct\` et \`volume_relatif = volume * 1.0 / volume_moy_titre\`.
3. **Agrégation finale (\`GROUP BY ticker\`)** :
   - \`MAX(CASE WHEN rang_recence = 1 THEN ... END)\` extrait exactement la valeur de la dernière séance (\`dernier_cours\`, \`volume_relatif_dernier\`) à l'intérieur d'un \`GROUP BY\`, car une seule ligne par ticker satisfait \`rang_recence = 1\` (toutes les autres valent \`NULL\`, ignorées par \`MAX\`).

\`\`\`sql
-- Chaînage de 2 CTEs pour respecter la portée des alias fenêtrés
WITH fenetre_actifs AS (
    SELECT date, ticker, prix_cloture, volume, rendement_journalier,
           MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_cumule,
           AVG(volume) OVER (PARTITION BY ticker) AS volume_moy_titre,
           ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rang_recence
    FROM marche_actions
),
metriques_jour AS (
    SELECT *, 100.0 * (prix_cloture - pic_cumule) / pic_cumule AS drawdown_jour_pct,
           volume * 1.0 / volume_moy_titre AS volume_relatif
    FROM fenetre_actifs
)
SELECT ticker, COUNT(*) AS nb_seances FROM metriques_jour GROUP BY ticker;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Trajectoire journalière réelle du titre \`BNP\` sur \`marche_actions\` illustrant la mécanique du *High-Water Mark* (\`pic_cumule\`), du drawdown journalier et du volume relatif :

\`\`\`sql
WITH f AS (
  SELECT date, prix_cloture, volume,
         MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_cumule,
         AVG(volume) OVER () AS vol_moy
  FROM marche_actions
  WHERE ticker = 'BNP'
)
SELECT date, prix_cloture, pic_cumule,
       ROUND(100.0 * (prix_cloture - pic_cumule) / pic_cumule, 2) AS drawdown_pct,
       volume,
       ROUND(volume * 1.0 / vol_moy, 2) AS volume_relatif
FROM f
ORDER BY date ASC;
\`\`\`

\`\`\`text
date       | prix_cloture | pic_cumule | drawdown_pct | volume  | volume_relatif
-----------+--------------+------------+--------------+---------+---------------
2024-01-02 | 62.8         | 62.8       | 0            | 3100000 | 1.04
2024-01-03 | 62.1         | 62.8       | -1.11        | 2900000 | 0.97
2024-01-04 | 62.7         | 62.8       | -0.16        | 2700000 | 0.91
2024-01-05 | 63.5         | 63.5       | 0            | 3400000 | 1.14
2024-01-08 | 63.2         | 63.5       | -0.47        | 2800000 | 0.94
\`\`\`

Sur \`BNP\`, le pic initial de $62.80\\text{ EUR}$ fixe le plancher du pire drawdown le 3 janvier ($-1.11\\%$), avant qu'un rebond sur pic de volume ($1.14\\times$ la moyenne, $3.40\\text{ M}$) ne porte le nouveau sommet cumulé à $63.50\\text{ EUR}$ le 5 janvier.
      `,
      taskMarkdown: `
Construisez le screener multi-actifs sur \`marche_actions\` en **2 CTEs chaînées** :

1. **CTE 1 \`fenetre_actifs\`** : pour chaque ligne, sélectionnez \`date\`, \`ticker\`, \`prix_cloture\`, \`volume\`, \`rendement_journalier\` et calculez par fenêtre partitionnée par \`ticker\` :
   - \`pic_cumule\` : \`MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\`
   - \`volume_moy_titre\` : \`AVG(volume) OVER (PARTITION BY ticker)\`
   - \`rang_recence\` : \`ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC)\`
2. **CTE 2 \`metriques_jour\`** : depuis \`fenetre_actifs\`, calculez :
   - \`drawdown_jour_pct\` : \`100.0 * (prix_cloture - pic_cumule) / pic_cumule\`
   - \`volume_relatif\` : \`volume * 1.0 / volume_moy_titre\`
3. **Requête principale** : regroupez \`metriques_jour\` par \`ticker\` et retournez dans **cet ordre exact** :
   - \`ticker\`
   - \`nb_seances\` : \`COUNT(*)\`
   - \`dernier_cours\` : \`ROUND(MAX(CASE WHEN rang_recence = 1 THEN prix_cloture END), 2)\`
   - \`pire_drawdown_pct\` : \`ROUND(MIN(drawdown_jour_pct), 2)\`
   - \`volume_moyen\` : \`ROUND(MAX(volume_moy_titre), 0)\`
   - \`volume_relatif_dernier\` : \`ROUND(MAX(CASE WHEN rang_recence = 1 THEN volume_relatif END), 2)\`
   - \`perf_moy_jour_pct\` : \`ROUND(AVG(100.0 * rendement_journalier), 2)\`

Triez du pire drawdown au meilleur : \`ORDER BY pire_drawdown_pct ASC, ticker ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH fenetre_actifs AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        volume,
        rendement_journalier,
        MAX(prix_cloture) OVER (
            PARTITION BY ticker
            ORDER BY date ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS pic_cumule,
        AVG(volume) OVER (PARTITION BY ticker) AS volume_moy_titre,
        ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rang_recence
    FROM marche_actions
),
metriques_jour AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        rendement_journalier,
        volume_moy_titre,
        rang_recence,
        100.0 * (prix_cloture - pic_cumule) / pic_cumule AS drawdown_jour_pct,
        volume * 1.0 / volume_moy_titre AS volume_relatif
    FROM fenetre_actifs
)
SELECT
    ticker,
    COUNT(*) AS nb_seances,
    ROUND(MAX(CASE WHEN rang_recence = 1 THEN prix_cloture END), 2) AS dernier_cours,
    ROUND(MIN(drawdown_jour_pct), 2) AS pire_drawdown_pct,
    ROUND(MAX(volume_moy_titre), 0) AS volume_moyen,
    ROUND(MAX(CASE WHEN rang_recence = 1 THEN volume_relatif END), 2) AS volume_relatif_dernier,
    ROUND(AVG(100.0 * rendement_journalier), 2) AS perf_moy_jour_pct
FROM metriques_jour
GROUP BY ticker
ORDER BY pire_drawdown_pct ASC, ticker ASC;`,
      validationQuery: `WITH fenetre_actifs AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        volume,
        rendement_journalier,
        MAX(prix_cloture) OVER (
            PARTITION BY ticker
            ORDER BY date ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS pic_cumule,
        AVG(volume) OVER (PARTITION BY ticker) AS volume_moy_titre,
        ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rang_recence
    FROM marche_actions
),
metriques_jour AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        rendement_journalier,
        volume_moy_titre,
        rang_recence,
        100.0 * (prix_cloture - pic_cumule) / pic_cumule AS drawdown_jour_pct,
        volume * 1.0 / volume_moy_titre AS volume_relatif
    FROM fenetre_actifs
)
SELECT
    ticker,
    COUNT(*) AS nb_seances,
    ROUND(MAX(CASE WHEN rang_recence = 1 THEN prix_cloture END), 2) AS dernier_cours,
    ROUND(MIN(drawdown_jour_pct), 2) AS pire_drawdown_pct,
    ROUND(MAX(volume_moy_titre), 0) AS volume_moyen,
    ROUND(MAX(CASE WHEN rang_recence = 1 THEN volume_relatif END), 2) AS volume_relatif_dernier,
    ROUND(AVG(100.0 * rendement_journalier), 2) AS perf_moy_jour_pct
FROM metriques_jour
GROUP BY ticker
ORDER BY pire_drawdown_pct ASC, ticker ASC;`,
      datasets: [],
      hints: [
        "Enchaînez deux CTEs séparées par une virgule (`WITH fenetre_actifs AS (...), metriques_jour AS (...)`) sans répéter le mot-clé `WITH`.",
        "Dans `fenetre_actifs`, utilisez `PARTITION BY ticker` sur les trois fenêtres (`MAX`, `AVG`, `ROW_NUMBER`) ; `rang_recence = 1` identifie la dernière date (`ORDER BY date DESC`).",
        "Dans la requête finale groupée par `ticker`, extrayez la valeur du dernier jour avec `MAX(CASE WHEN rang_recence = 1 THEN ... END)` et le pire drawdown avec `MIN(drawdown_jour_pct)`.",
      ],
      guide: {
        theoryToPracticeLink:
          "Le calcul de $\\text{MDD}_i = \\min_t 100 \\times \\frac{P_{i,t} - \\max_{s \\le t} P_{i,s}}{\\max_{s \\le t} P_{i,s}}$ et du volume relatif $\\text{RVOL}_{i,t} = V_{i,t} / \\bar{V}_i$ demande d'abord les références fenêtrées (\`pic_cumule\`, \`volume_moy_titre\`, \`rang_recence\`) dans \`fenetre_actifs\`, puis les ratios journaliers dans \`metriques_jour\`, et enfin l'agrégation finale par \`ticker\`.",
        stepByStepPlan: [
          "Dans la CTE 1 `fenetre_actifs`, calculer pour chaque ligne le `pic_cumule` (`MAX(...) OVER`), `volume_moy_titre` (`AVG(...) OVER`) et `rang_recence` (`ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC)`).",
          "Dans la CTE 2 `metriques_jour`, calculer `drawdown_jour_pct` et `volume_relatif` à partir des colonnes de `fenetre_actifs`.",
          "Dans le `SELECT` final, regrouper par `ticker` (`GROUP BY ticker`) et agréger `nb_seances`, `dernier_cours`, `pire_drawdown_pct`, `volume_moyen`, `volume_relatif_dernier` et `perf_moy_jour_pct`.",
          "Trier du pire drawdown au moins sévère avec `ORDER BY pire_drawdown_pct ASC, ticker ASC;`.",
        ],
        concepts: [
          {
            symbol: "fenetre_actifs, metriques_jour",
            kind: "Colonne / Table",
            roleInExercise:
              "Pipeline à deux CTEs chaînées : la 1re calcule les bornes fenêtrées, la 2e évalue les ratios dérivés par séance.",
          },
          {
            symbol: "PARTITION BY ticker",
            kind: "Syntaxe",
            roleInExercise:
              "Cloisonne indépendamment chaque actif (`TTE`, `BNP`, `MC`, `AI`, `CW8`) pour qu'aucun pic de prix ou volume moyen ne bave sur un autre titre.",
          },
          {
            symbol: "MAX(prix_cloture) OVER (... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Calcule le sommet historique courant (*High-Water Mark*) $M_{i,t}$ sans jamais utiliser les cours futurs.",
          },
          {
            symbol: "ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Assigne le rang `1` à la séance la plus récente de chaque actif, servant ensuite au filtrage conditionnel dans le `GROUP BY`.",
          },
          {
            symbol: "MAX(CASE WHEN rang_recence = 1 THEN ... END)",
            kind: "Syntaxe",
            roleInExercise:
              "Patron SQL standard pour extraire l'attribut exact de la dernière observation lors d'une consolidation `GROUP BY ticker`.",
          },
          {
            symbol: "volume * 1.0 / volume_moy_titre",
            kind: "Variable",
            roleInExercise:
              "Conversion explicite en flottant (`* 1.0`) calculant le ratio de volume relatif $\\text{RVOL}_{i,t}$ sans division entière.",
          },
          {
            symbol: "pire_drawdown_pct",
            kind: "Variable",
            roleInExercise:
              "Maximum Drawdown $\\min_t \\text{DD}_{i,t}$ exprimé en pourcentage négatif (ou nul pour `CW8`).",
          },
        ],
        guidedCode: `-- 1. CTE 1 : Calcul des bornes fenêtrées par ticker
WITH fenetre_actifs AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        volume,
        rendement_journalier,
        MAX(prix_cloture) OVER (
            PARTITION BY ___
            ORDER BY date ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS pic_cumule,
        AVG(volume) OVER (PARTITION BY ___) AS volume_moy_titre,
        ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date ___) AS rang_recence
    FROM marche_actions
),
-- 2. CTE 2 : Calcul du drawdown et du volume relatif journalier
metriques_jour AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        rendement_journalier,
        volume_moy_titre,
        rang_recence,
        100.0 * (prix_cloture - ___) / ___ AS drawdown_jour_pct,
        volume * 1.0 / ___ AS volume_relatif
    FROM fenetre_actifs
)
-- 3. Consolidation finale par titre
SELECT
    ticker,
    COUNT(*) AS nb_seances,
    ROUND(MAX(CASE WHEN rang_recence = 1 THEN prix_cloture END), 2) AS dernier_cours,
    ROUND(MIN(___), 2) AS pire_drawdown_pct,
    ROUND(MAX(volume_moy_titre), 0) AS volume_moyen,
    ROUND(MAX(CASE WHEN rang_recence = 1 THEN volume_relatif END), 2) AS volume_relatif_dernier,
    ROUND(AVG(100.0 * rendement_journalier), 2) AS perf_moy_jour_pct
FROM metriques_jour
GROUP BY ticker
ORDER BY pire_drawdown_pct ASC, ticker ASC;`,
      },
    },

    // =========================================================================
    // CAS 7 : Pipeline Multi-Tables : ASOF Join Taux Souverain + Fondamentaux
    // =========================================================================
    {
      id: "v3-sql-7",
      title: "7. Pipeline Multi-Tables : ASOF Join Taux Souverain + Métriques Fondamentales",
      category: "data_engineering",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 30,
      description:
        "Alignez à la séance du 2024-01-08 les cours d'actions (marche_actions), la dernière courbe des taux OAT disponible via ASOF Join (courbe_taux_oat) et les métriques fondamentales (portefeuilles_actifs) pour scorer le portefeuille.",
      theoryMarkdown: `
### Alignement Temporel Asynchrone (ASOF Join) et Scoring Multi-Facteurs

#### 🎓 Cours Théorique Approfondi

En ingénierie financière, les sources de données opèrent à des **fréquences d'échantillonnage hétérogènes** :
- \`marche_actions\` contient des cours quotidiens (jusqu'au \`2024-01-08\`) ;
- \`courbe_taux_oat\` publie des clôtures mensuelles de fin de mois (jusqu'au \`2023-12-31\`) ;
- \`portefeuilles_actifs\` stocke un référentiel fondamental statique par \`ticker\` (\`beta_marche\`, \`score_esg\`, \`ratio_sharpe\`).

Si l'on tente une jointure d'égalité stricte $m.\\text{date} = c.\\text{date}$ entre le flux actions et la courbe des taux, l'ensemble résultat est **vide ($\\emptyset$)** car aucune cotation actions de janvier 2024 n'existe exactement dans la table mensuelle des OAT !

On résout ce problème d'alignement asynchrone par une **jointure ASOF** (*As-Of Join*, littéralement *« à la date connue la plus récente »*). Mathématiquement, pour toute date de marché $t$, la valeur causale disponible sur la série de référence $\\mathcal{T}_c$ est :

$$
t_{\\text{ASOF}}(t) = \\max \\{ \\tau \\in \\mathcal{T}_c \\mid \\tau \\le t \\}
$$

La condition $\\tau \\le t$ garantit le **respect strict de la causalité** (zéro fuite d'information future : on ne rattache jamais un taux publié postérieurement à la séance $t$).

Une fois l'environnement de taux sans risque $y^{(10\\text{Y})}_{t_{\\text{ASOF}}}$ et la pente $y^{(10\\text{Y})} - y^{(2\\text{Y})}$ alignés avec les métriques de l'actif, on peut calculer un **score composite équipondéré ESG-Sharpe** normalisant le score ESG ($\\in [0, 100]$) à l'échelle du ratio de Sharpe :

$$
\\text{Score}_i = 0.5 \\times \\left(\\frac{\\text{ESG}_i}{100}\\right) + 0.5 \\times \\text{Sharpe}_i
$$

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> L'ASOF Join est l'opération fondamentale de valorisation *mark-to-market* en production : il permet de pricer des positions quotidiennes en récupérant la dernière courbe des taux, la dernière grille de notation de crédit ou le dernier taux de change BCE publié sans dupliquer ni interpoler abusivement les référentiels.

#### 💻 Masterclass SQL de Production

SQLite ne dispose pas d'un mot-clé dédié \`ASOF JOIN\` (contrairement à DuckDB ou Kdb+). En SQLite / ANSI SQL, le motif canonique de l'ASOF Join consiste à utiliser une **sous-requête scalaire corrélée** à l'intérieur d'une CTE \`dernier_marche\` :

\`\`\`sql
(
    SELECT c.taux_10y
    FROM courbe_taux_oat c
    WHERE c.date <= m.date        -- Contrainte causale : passé ou présent uniquement
    ORDER BY c.date DESC          -- La date la plus récente en premier
    LIMIT 1                       -- Extraction scalaire unique (max tau <= t)
) AS oat_10y_asof
\`\`\`

- L'alias \`m\` de la table externe (\`marche_actions m\`) est référencé à l'intérieur de la sous-requête (\`c.date <= m.date\`), d'où le qualificatif de sous-requête **corrélée**.
- \`ORDER BY c.date DESC LIMIT 1\` sélectionne exactement $\\max \\{\\tau \\le t\\}$, utilisant directement la clé primaire indexée sur \`courbe_taux_oat(date)\`.
- Enfin, la requête principale joint la CTE \`dernier_marche\` avec \`portefeuilles_actifs p\` sur \`ticker\`.

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Preuve pratique sur les vraies tables : 1) l'équi-jointure stricte sur \`'2024-01-08'\` échoue (\`0\` ligne), 2) l'exploration causale \`WHERE date <= '2024-01-08' ORDER BY date DESC\` identifie la courbe OAT valide la plus récente (\`'2023-12-31'\`) :

\`\`\`sql
SELECT COUNT(*) AS nb_lignes_equijoin
FROM marche_actions m
INNER JOIN courbe_taux_oat c ON m.date = c.date
WHERE m.date = '2024-01-08';

SELECT date, taux_2y, taux_10y, ROUND(taux_10y - taux_2y, 2) AS pente_10y_2y
FROM courbe_taux_oat
WHERE date <= '2024-01-08'
ORDER BY date DESC
LIMIT 3;
\`\`\`

\`\`\`text
nb_lignes_equijoin
------------------
0
date       | taux_2y | taux_10y | pente_10y_2y
-----------+---------+----------+-------------
2023-12-31 | 2.85    | 2.55     | -0.3
2023-11-30 | 3.22    | 3.02     | -0.2
2023-10-31 | 3.55    | 3.38     | -0.17
\`\`\`

Grâce à la sous-requête corrélée ASOF, les $5$ actifs cotés le \`2024-01-08\` reçoivent automatiquement les taux du \`2023-12-31\` ($\\text{OAT 10Y} = 2.55\\%$, courbe inversée de pente $10\\text{Y}-2\\text{Y} = -0.30\\%$) au lieu de disparaître du reporting !
      `,
      taskMarkdown: `
Construisez le pipeline multi-tables (\`marche_actions\` + \`courbe_taux_oat\` + \`portefeuilles_actifs\`) en 2 étapes :

1. **CTE \`dernier_marche\`** : filtrez \`marche_actions m\` sur la dernière journée disponible \`WHERE m.date = '2024-01-08'\`, sélectionnez \`m.ticker\`, \`m.date AS date_marche\`, \`m.prix_cloture\`, et récupérez par **3 sous-requêtes corrélées ASOF** (\`FROM courbe_taux_oat c WHERE c.date <= m.date ORDER BY c.date DESC LIMIT 1\`) :
   - \`date_oat_asof\` : \`c.date\`
   - \`oat_10y_asof\` : \`c.taux_10y\`
   - \`pente_10y_2y_asof\` : \`ROUND(c.taux_10y - c.taux_2y, 2)\`
2. **Requête principale** : joignez \`dernier_marche dm\` avec \`portefeuilles_actifs p\` (\`INNER JOIN ... ON dm.ticker = p.ticker\`) et retournez dans **cet ordre exact** :
   - \`ticker\` (\`dm.ticker\`), \`nom\` (\`p.nom\`), \`date_marche\` (\`dm.date_marche\`), \`date_oat_asof\` (\`dm.date_oat_asof\`)
   - \`prix_cloture\` (\`dm.prix_cloture\`), \`oat_10y_asof\` (\`dm.oat_10y_asof\`), \`pente_10y_2y_asof\` (\`dm.pente_10y_2y_asof\`)
   - \`beta_marche\` (\`p.beta_marche\`), \`score_esg\` (\`p.score_esg\`), \`ratio_sharpe\` (\`p.ratio_sharpe\`)
   - \`score_composite\` : \`ROUND(0.5 * (p.score_esg / 100.0) + 0.5 * p.ratio_sharpe, 4)\`

Triez par \`score_composite DESC, dm.ticker ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH dernier_marche AS (
    SELECT
        m.ticker,
        m.date AS date_marche,
        m.prix_cloture,
        (
            SELECT c.date
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS date_oat_asof,
        (
            SELECT c.taux_10y
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS oat_10y_asof,
        (
            SELECT ROUND(c.taux_10y - c.taux_2y, 2)
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS pente_10y_2y_asof
    FROM marche_actions m
    WHERE m.date = '2024-01-08'
)
SELECT
    dm.ticker,
    p.nom,
    dm.date_marche,
    dm.date_oat_asof,
    dm.prix_cloture,
    dm.oat_10y_asof,
    dm.pente_10y_2y_asof,
    p.beta_marche,
    p.score_esg,
    p.ratio_sharpe,
    ROUND(0.5 * (p.score_esg / 100.0) + 0.5 * p.ratio_sharpe, 4) AS score_composite
FROM dernier_marche dm
INNER JOIN portefeuilles_actifs p
    ON dm.ticker = p.ticker
ORDER BY score_composite DESC, dm.ticker ASC;`,
      validationQuery: `WITH dernier_marche AS (
    SELECT
        m.ticker,
        m.date AS date_marche,
        m.prix_cloture,
        (
            SELECT c.date
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS date_oat_asof,
        (
            SELECT c.taux_10y
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS oat_10y_asof,
        (
            SELECT ROUND(c.taux_10y - c.taux_2y, 2)
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS pente_10y_2y_asof
    FROM marche_actions m
    WHERE m.date = '2024-01-08'
)
SELECT
    dm.ticker,
    p.nom,
    dm.date_marche,
    dm.date_oat_asof,
    dm.prix_cloture,
    dm.oat_10y_asof,
    dm.pente_10y_2y_asof,
    p.beta_marche,
    p.score_esg,
    p.ratio_sharpe,
    ROUND(0.5 * (p.score_esg / 100.0) + 0.5 * p.ratio_sharpe, 4) AS score_composite
FROM dernier_marche dm
INNER JOIN portefeuilles_actifs p
    ON dm.ticker = p.ticker
ORDER BY score_composite DESC, dm.ticker ASC;`,
      datasets: [],
      hints: [
        "Dans la CTE `dernier_marche`, isolez la date `'2024-01-08'` avec `WHERE m.date = '2024-01-08'`.",
        "Chaque sous-requête scalaire ASOF sur `courbe_taux_oat c` suit le motif `(SELECT ... FROM courbe_taux_oat c WHERE c.date <= m.date ORDER BY c.date DESC LIMIT 1)`.",
        "Joignez ensuite `dernier_marche dm` à `portefeuilles_actifs p` sur `ticker`, divisez `p.score_esg` par `100.0` (flottant !) dans le score composite arrondi à 4 décimales, et triez par `score_composite DESC, dm.ticker ASC`.",
      ],
      guide: {
        theoryToPracticeLink:
          "Pour résoudre l'asynchronisme entre les cotations quotidiennes (\`2024-01-08\`) et la courbe mensuelle des OAT (\`2023-12-31\`), l'ASOF Join recherche $t_{\\text{ASOF}}(t) = \\max \\{\\tau \\in \\text{courbe\\_taux\\_oat} \\mid \\tau \\le t\\}$. En SQLite, les sous-requêtes scalaires corrélées \`WHERE c.date <= m.date ORDER BY c.date DESC LIMIT 1\` de la CTE \`dernier_marche\` réalisent cet alignement causal avant la jointure finale avec les fondamentaux \`portefeuilles_actifs\`.",
        stepByStepPlan: [
          "Créer la CTE `dernier_marche` en filtrant `marche_actions m` sur `m.date = '2024-01-08'`.",
          "Insérer les 3 sous-requêtes corrélées ASOF sur `courbe_taux_oat c` (`WHERE c.date <= m.date ORDER BY c.date DESC LIMIT 1`) pour récupérer `date_oat_asof`, `oat_10y_asof` et `pente_10y_2y_asof`.",
          "Joindre `dernier_marche dm` à `portefeuilles_actifs p` via `INNER JOIN ... ON dm.ticker = p.ticker`.",
          "Calculer `score_composite = ROUND(0.5 * (p.score_esg / 100.0) + 0.5 * p.ratio_sharpe, 4)` et trier par `score_composite DESC, dm.ticker ASC;`.",
        ],
        concepts: [
          {
            symbol: "dernier_marche",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE isolant la dernière séance de marché (`2024-01-08`) enrichie des taux OAT ASOF les plus récents.",
          },
          {
            symbol: "courbe_taux_oat c",
            kind: "Colonne / Table",
            roleInExercise:
              "Table mensuelle de la courbe souveraine française interrogée par les sous-requêtes corrélées.",
          },
          {
            symbol: "WHERE c.date <= m.date ORDER BY c.date DESC LIMIT 1",
            kind: "Syntaxe",
            roleInExercise:
              "Motif canonique d'ASOF Join causal en SQLite : sélectionne l'observation souveraine la plus récente connue à la date `m.date`.",
          },
          {
            symbol: "portefeuilles_actifs p",
            kind: "Colonne / Table",
            roleInExercise:
              "Référentiel fondamental apportant `nom`, `beta_marche`, `score_esg` et `ratio_sharpe` par `ticker`.",
          },
          {
            symbol: "pente_10y_2y_asof",
            kind: "Variable",
            roleInExercise:
              "Pente souveraine `taux_10y - taux_2y` arrondie à 2 décimales à la date ASOF (`-0.30` point de pourcentage).",
          },
          {
            symbol: "p.score_esg / 100.0",
            kind: "Paramètre",
            roleInExercise:
              "Normalisation flottante du score ESG (sur 100) dans $[0, 1]$ afin de le rendre commensurable au `ratio_sharpe` (attention : `/ 100` en entier retournerait `0` en SQLite !).",
          },
          {
            symbol: "score_composite",
            kind: "Variable",
            roleInExercise:
              "Score multi-facteurs équipondéré $0.5 \\cdot (\\text{ESG}/100) + 0.5 \\cdot \\text{Sharpe}$ classant les titres du portefeuille.",
          },
        ],
        guidedCode: `-- 1. CTE : Dernière séance de marché + sous-requêtes corrélées ASOF sur courbe_taux_oat
WITH dernier_marche AS (
    SELECT
        m.ticker,
        m.date AS date_marche,
        m.prix_cloture,
        (
            SELECT c.date
            FROM courbe_taux_oat c
            WHERE c.date <= ___
            ORDER BY c.date DESC
            LIMIT 1
        ) AS date_oat_asof,
        (
            SELECT c.taux_10y
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS oat_10y_asof,
        (
            SELECT ROUND(c.taux_10y - c.taux_2y, 2)
            FROM courbe_taux_oat c
            WHERE c.date <= m.date
            ORDER BY c.date DESC
            LIMIT 1
        ) AS pente_10y_2y_asof
    FROM marche_actions m
    WHERE m.date = '___'
)
-- 2. Jointure avec les fondamentaux et calcul du score composite ESG-Sharpe
SELECT
    dm.ticker,
    p.nom,
    dm.date_marche,
    dm.date_oat_asof,
    dm.prix_cloture,
    dm.oat_10y_asof,
    dm.pente_10y_2y_asof,
    p.beta_marche,
    p.score_esg,
    p.ratio_sharpe,
    ROUND(0.5 * (p.score_esg / ___) + 0.5 * p.ratio_sharpe, 4) AS score_composite
FROM dernier_marche dm
INNER JOIN portefeuilles_actifs p
    ON dm.ticker = p.ticker
ORDER BY score_composite DESC, dm.ticker ASC;`,
      },
    },

    // =========================================================================
    // CAS 8 : Matrice de Covariance Annualisée & Audit de Diversification en Pur SQL
    // =========================================================================
    {
      id: "v3-sql-8",
      title: "8. Matrice de Covariance Annualisée & Audit de Diversification en Pur SQL",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 30,
      description:
        "Reconstruisez en pur SQL le triangle supérieur strict des covariances annualisées (matrice_correlations + double alias portefeuilles_actifs) et auditez les meilleures paires de diversification.",
      theoryMarkdown: `
### Algèbre Bilinéaire de Markowitz : De la Corrélation à la Covariance en SQL

#### 🎓 Cours Théorique Approfondi

Dans la théorie moderne du portefeuille de **Markowitz** (1952), la variance globale d'un portefeuille de $N$ actifs pondérés par le vecteur $w = (w_1, \\dots, w_N)^\\top$ s'écrit sous forme matricielle :

$$
\\sigma_p^2 = w^\\top \\Sigma w = \\sum_{i=1}^N w_i^2 \\sigma_i^2 + 2 \\sum_{1 \\le i < j \\le N} w_i w_j \\Sigma_{ij}
$$

où la matrice de covariance $\\Sigma$ s'obtient à partir du vecteur des volatilités annualisées $\\sigma = (\\sigma_1, \\dots, \\sigma_N)^\\top$ et de la matrice de corrélation symétrique $R = (\\rho_{ij})$ via la décomposition matricielle :

$$
\\Sigma = \\operatorname{diag}(\\sigma) \\, R \\, \\operatorname{diag}(\\sigma) \\iff \\Sigma_{ij} = \\rho_{ij} \\cdot \\sigma_i \\cdot \\sigma_j
$$

**Élimination de la redondance symétrique :**
Pour $N = 5$ actifs, la table \`matrice_correlations\` stocke la matrice complète de $N^2 = 25$ paires :
- Les $N = 5$ termes diagonaux $(i = j)$, où $\\rho_{ii} = 1$ et $\\Sigma_{ii} = \\sigma_i^2$ ;
- Les $N(N-1) = 20$ paires hors-diagonale, qui se répètent symétriquement par paires $(A, B)$ et $(B, A)$ car $\\Sigma_{AB} = \\Sigma_{BA}$.

Pour auditer uniquement les **$\\binom{N}{2} = \\frac{N(N-1)}{2} = 10$ paires distinctes**, il faut filtrer sur le **triangle supérieur strict lexicographique** :

$$
\\text{actif\\_a} < \\text{actif\\_b}
$$

ce qui exclut simultanément la diagonale ($A = B$) et chaque miroir symétrique ($B > A$ ne passe qu'une seule fois sous la forme $(A, B)$).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous Solvabilité II (formule standard du SCR Marché, agrégation par matrices de corrélation entre modules Actions, Taux, Spread, Immobilier et Change : $\\text{SCR} = \\sqrt{\\sum_{i,j} \\rho_{ij} \\cdot \\text{SCR}_i \\cdot \\text{SCR}_j}$), l'audit des termes croisés $\\rho_{ij} \\sigma_i \\sigma_j$ identifie les poches concentrant le risque systématique par opposition aux couples faiblement corrélés créateurs de bénéfice de diversification.

#### 💻 Masterclass SQL de Production

Pour associer les deux volatilités $\\sigma_a$ et $\\sigma_b$ à chaque couple \`(actif_a, actif_b)\` de \`matrice_correlations\`, on réalise une **double jointure vers la même table de dimension \`portefeuilles_actifs\`** sous deux alias distincts :
- \`INNER JOIN portefeuilles_actifs pa ON mc.actif_a = pa.ticker\` fournit \`pa.volatilite\` ($\\sigma_a$) ;
- \`INNER JOIN portefeuilles_actifs pb ON mc.actif_b = pb.ticker\` fournit \`pb.volatilite\` ($\\sigma_b$).

Le filtre \`WHERE mc.actif_a < mc.actif_b\` réduit exactement les $25$ lignes de la matrice aux $10$ paires uniques dans une **CTE \`paires_covariance\`**, avant que la requête principale n'applique la grille d'audit de diversification (\`CASE WHEN\`).

\`\`\`sql
-- Double alias pa/pb + filtrage strict actif_a < actif_b (10 paires uniques sur 25)
WITH paires_covariance AS (
    SELECT
        mc.actif_a,
        mc.actif_b,
        pa.volatilite AS vol_a,
        pb.volatilite AS vol_b,
        mc.correlation,
        ROUND(mc.correlation * pa.volatilite * pb.volatilite, 6) AS cov_theorique
    FROM matrice_correlations mc
    INNER JOIN portefeuilles_actifs pa ON mc.actif_a = pa.ticker
    INNER JOIN portefeuilles_actifs pb ON mc.actif_b = pb.ticker
    WHERE mc.actif_a < mc.actif_b
)
SELECT * FROM paires_covariance ORDER BY cov_theorique ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Calcul réel en pur SQL de la variance et de la volatilité d'un portefeuille équipondéré $w_i = 0.20$ ($1/5$) sur les $25$ couples de \`matrice_correlations\` vs la moyenne naïve des volatilités individuelles :

\`\`\`sql
WITH ptf AS (
  SELECT
    SUM(0.2 * 0.2 * mc.correlation * pa.volatilite * pb.volatilite) AS variance_ptf,
    AVG(CASE WHEN mc.actif_a = mc.actif_b THEN pa.volatilite END) AS vol_moy_indiv
  FROM matrice_correlations mc
  JOIN portefeuilles_actifs pa ON mc.actif_a = pa.ticker
  JOIN portefeuilles_actifs pb ON mc.actif_b = pb.ticker
)
SELECT ROUND(variance_ptf, 6) AS variance_ptf,
       ROUND(100.0 * SQRT(variance_ptf), 2) AS vol_ptf_pct,
       ROUND(100.0 * vol_moy_indiv, 2) AS vol_moy_sans_div_pct,
       ROUND(100.0 * (vol_moy_indiv - SQRT(variance_ptf)), 2) AS gain_diversification_pct
FROM ptf;
\`\`\`

\`\`\`text
variance_ptf | vol_ptf_pct | vol_moy_sans_div_pct | gain_diversification_pct
-------------+-------------+----------------------+-------------------------
0.023031     | 15.18       | 20                   | 4.82
\`\`\`

Grâce aux corrélations imparfaites ($\\rho_{ij} < 1$), la volatilité du portefeuille équipondéré chute de $20.00\\%$ (moyenne arithmétique des volatilités) à $15.18\\%$, dégageant un **gain pur de diversification de $4.82$ points de pourcentage** !
      `,
      taskMarkdown: `
Construisez le pipeline d'audit de covariance et de diversification en 2 étapes :

1. **CTE \`paires_covariance\`** : joignez \`matrice_correlations mc\` avec deux alias de \`portefeuilles_actifs\` (\`pa\` sur \`mc.actif_a = pa.ticker\` et \`pb\` sur \`mc.actif_b = pb.ticker\`), filtrez le triangle strict avec \`WHERE mc.actif_a < mc.actif_b\`, et sélectionnez :
   - \`mc.actif_a\`, \`mc.actif_b\`
   - \`pa.volatilite AS vol_a\`, \`pb.volatilite AS vol_b\`
   - \`mc.correlation\`
   - \`ROUND(mc.correlation * pa.volatilite * pb.volatilite, 6) AS cov_theorique\`
2. **Requête principale** : interrogez \`paires_covariance\` et retournez dans **cet ordre exact** :
   - \`actif_a\`, \`actif_b\`, \`vol_a\`, \`vol_b\`, \`correlation\`, \`cov_theorique\`
   - \`niveau_diversification\` : \`CASE WHEN correlation < 0.40 THEN 'Forte diversification' WHEN correlation < 0.60 THEN 'Diversification modérée' ELSE 'Fort co-mouvement' END\`

Triez de la plus faible covariance à la plus élevée : \`ORDER BY cov_theorique ASC, actif_a ASC, actif_b ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH paires_covariance AS (
    SELECT
        mc.actif_a,
        mc.actif_b,
        pa.volatilite AS vol_a,
        pb.volatilite AS vol_b,
        mc.correlation,
        ROUND(mc.correlation * pa.volatilite * pb.volatilite, 6) AS cov_theorique
    FROM matrice_correlations mc
    INNER JOIN portefeuilles_actifs pa
        ON mc.actif_a = pa.ticker
    INNER JOIN portefeuilles_actifs pb
        ON mc.actif_b = pb.ticker
    WHERE mc.actif_a < mc.actif_b
)
SELECT
    actif_a,
    actif_b,
    vol_a,
    vol_b,
    correlation,
    cov_theorique,
    CASE
        WHEN correlation < 0.40 THEN 'Forte diversification'
        WHEN correlation < 0.60 THEN 'Diversification modérée'
        ELSE 'Fort co-mouvement'
    END AS niveau_diversification
FROM paires_covariance
ORDER BY cov_theorique ASC, actif_a ASC, actif_b ASC;`,
      validationQuery: `WITH paires_covariance AS (
    SELECT
        mc.actif_a,
        mc.actif_b,
        pa.volatilite AS vol_a,
        pb.volatilite AS vol_b,
        mc.correlation,
        ROUND(mc.correlation * pa.volatilite * pb.volatilite, 6) AS cov_theorique
    FROM matrice_correlations mc
    INNER JOIN portefeuilles_actifs pa
        ON mc.actif_a = pa.ticker
    INNER JOIN portefeuilles_actifs pb
        ON mc.actif_b = pb.ticker
    WHERE mc.actif_a < mc.actif_b
)
SELECT
    actif_a,
    actif_b,
    vol_a,
    vol_b,
    correlation,
    cov_theorique,
    CASE
        WHEN correlation < 0.40 THEN 'Forte diversification'
        WHEN correlation < 0.60 THEN 'Diversification modérée'
        ELSE 'Fort co-mouvement'
    END AS niveau_diversification
FROM paires_covariance
ORDER BY cov_theorique ASC, actif_a ASC, actif_b ASC;`,
      datasets: [],
      hints: [
        "Joignez deux fois `portefeuilles_actifs` à `matrice_correlations mc` en utilisant des alias différents : `pa` (`mc.actif_a = pa.ticker`) et `pb` (`mc.actif_b = pb.ticker`).",
        "La condition `WHERE mc.actif_a < mc.actif_b` élimine automatiquement les 5 paires diagonales (`actif_a = actif_b`) et les 10 doublons symétriques.",
        "Calculez `ROUND(mc.correlation * pa.volatilite * pb.volatilite, 6)` puis étiquetez les 3 niveaux (`< 0.40`, `< 0.60`, `>= 0.60`) dans la requête externe.",
      ],
      guide: {
        theoryToPracticeLink:
          "La formule de covariance $\\Sigma_{ab} = \\rho_{ab} \\sigma_a \\sigma_b$ croise une table de paires (\`matrice_correlations\`) et une table d'actifs (\`portefeuilles_actifs\`). Une double jointure avec deux alias (\`pa\` et \`pb\`) associée au filtre triangulaire \`mc.actif_a < mc.actif_b\` génère exactement les $\\binom{5}{2} = 10$ covariances distinctes hors-diagonale avant l'audit de diversification.",
        stepByStepPlan: [
          "Dans la CTE `paires_covariance`, partir de `matrice_correlations mc` et effectuer deux `INNER JOIN` sur `portefeuilles_actifs` (`pa` pour `actif_a`, `pb` pour `actif_b`).",
          "Filtrer le triangle strict avec `WHERE mc.actif_a < mc.actif_b` pour obtenir exactement 10 paires sans doublon ni diagonale.",
          "Projeter les volatilités `vol_a`, `vol_b`, `correlation` et calculer `cov_theorique` arrondi à 6 décimales.",
          "Dans la requête externe, classifier `niveau_diversification` selon `correlation` (`< 0.40`, `< 0.60`, sinon `'Fort co-mouvement'`) et trier par `cov_theorique ASC, actif_a ASC, actif_b ASC;`.",
        ],
        concepts: [
          {
            symbol: "paires_covariance",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE calculant la covariance annualisée sur les $10$ couples uniques d'actifs.",
          },
          {
            symbol: "pa / pb (portefeuilles_actifs)",
            kind: "Colonne / Table",
            roleInExercise:
              "Deux alias distincts d'une même table permettant de lire simultanément la volatilité de `actif_a` et celle de `actif_b` sur la même ligne.",
          },
          {
            symbol: "WHERE mc.actif_a < mc.actif_b",
            kind: "Paramètre",
            roleInExercise:
              "Prédicat de filtrage triangulaire strict qui supprime la diagonale ($\\rho = 1$) et évite de compter chaque couple deux fois (`(AI, TTE)` et `(TTE, AI)`).",
          },
          {
            symbol: "cov_theorique",
            kind: "Variable",
            roleInExercise:
              "Covariance annualisée $\\Sigma_{ab} = \\rho_{ab} \\sigma_a \\sigma_b$ arrondie à $6$ décimales.",
          },
          {
            symbol: "niveau_diversification",
            kind: "Variable",
            roleInExercise:
              "Diagnostic qualitatif issu de `CASE WHEN` selon les seuils `0.40` et `0.60` de corrélation.",
          },
          {
            symbol: "ORDER BY cov_theorique ASC, actif_a ASC, actif_b ASC",
            kind: "Syntaxe",
            roleInExercise:
              "Met en tête les couples les plus diversifiants (plus faible covariance) avec départage déterministe.",
          },
        ],
        guidedCode: `-- 1. CTE : Double jointure pa/pb et triangle supérieur strict actif_a < actif_b
WITH paires_covariance AS (
    SELECT
        mc.actif_a,
        mc.actif_b,
        pa.volatilite AS vol_a,
        pb.volatilite AS vol_b,
        mc.correlation,
        ROUND(mc.correlation * ___ * ___, 6) AS cov_theorique
    FROM matrice_correlations mc
    INNER JOIN portefeuilles_actifs pa
        ON mc.actif_a = pa.ticker
    INNER JOIN portefeuilles_actifs pb
        ON mc.actif_b = pb.ticker
    WHERE mc.actif_a ___ mc.actif_b
)
-- 2. Classification de la diversification et classement croissant par covariance
SELECT
    actif_a,
    actif_b,
    vol_a,
    vol_b,
    correlation,
    cov_theorique,
    CASE
        WHEN correlation < 0.40 THEN '___'
        WHEN correlation < 0.60 THEN '___'
        ELSE '___'
    END AS niveau_diversification
FROM paires_covariance
ORDER BY cov_theorique ASC, actif_a ASC, actif_b ASC;`,
      },
    },

    // =========================================================================
    // CAS 9 : Moteur de Backtest Momentum Causal Sans Look-Ahead Bias
    // =========================================================================
    {
      id: "v3-sql-9",
      title: "9. Moteur de Backtest Momentum Causal Sans Look-Ahead Bias",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 35,
      description:
        "Enchaînez deux CTEs sur marche_actions pour simuler une stratégie momentum causale (signal F(t-1)-mesurable via LAG), calculer le PnL journalier, puis consolider taux de réussite et performance cumulée par ticker.",
      theoryMarkdown: `
### Filtration Naturelle $\\mathcal{F}_{t-1}$, Causalité et Moteur de Backtest Multi-CTEs

#### 🎓 Cours Théorique Approfondi

En finance quantitative, une stratégie systématique sur un actif $i$ est définie par une suite de positions $\\theta_{i,t} \\in \\{-1, +1\\}$ prises sur l'intervalle $[t-1, t]$ afin de capter le rendement réalisé $r_{i,t}$. Pour que le backtest soit **physiquement exécutable** (sans utilisation frauduleuse d'information future), le processus $(\\theta_{i,t})_{t \\ge 2}$ doit être **prévisible** par rapport à la filtration naturelle $(\\mathcal{F}_t)$ :

$$
\\theta_{i,t} = \\operatorname{sgn}(r_{i,t-1}) = \\begin{cases} +1 & \\text{si } r_{i,t-1} > 0 \\\\ -1 & \\text{si } r_{i,t-1} \\le 0 \\end{cases}
$$

Le **PnL journalier causal** et le **PnL cumulé** sur les $T-1$ séances actives ($t \\ge 2$) s'écrivent :

$$
\\text{PnL}_{i,t} = \\theta_{i,t} \\cdot r_{i,t}, \\qquad \\text{PnL}_{i,\\text{cum}} = 100 \\times \\sum_{t=2}^T \\text{PnL}_{i,t}
$$

**Théorème d'illusion du Look-Ahead Bias :**
Si le développeur oublie de retarder le rendement dans le calcul du signal et utilise $\\tilde{\\theta}_{i,t} = \\operatorname{sgn}(r_{i,t})$, la stratégie devient non causale et son gain vaut :

$$
\\widetilde{\\text{PnL}}_{i,t} = \\operatorname{sgn}(r_{i,t}) \\cdot r_{i,t} = |r_{i,t}| \\ge 0
$$

Une telle erreur génère une performance strictement positive même sur du pur bruit blanc centré, invalidant intégralement le modèle ! Le taux de réussite (*Hit Ratio*) réel sur les $T-1$ séances actives vaut :

$$
\\text{HitRatio}_i = 100 \\times \\frac{\\sum_{t=2}^T \\mathbf{1}_{\\{\\text{PnL}_{i,t} > 0\\}}}{T - 1}
$$

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Conformément aux standards de validation de modèles quantitatifs (**SR 11-7** de la Fed / contrôle interne des desks *QIS* — *Quantitative Investment Strategies*), un moteur de backtest doit isoler explicitement l'étape d'extraction du signal retardé ($t-1$) de l'étape d'exécution ($t$) et exclure la première séance sans historique (\`WHERE rdt_hier IS NOT NULL\`) pour ne pas biaiser le dénominateur du *Hit Ratio*.

#### 💻 Masterclass SQL de Production

Un moteur de backtest robuste en SQL s'architecture en **2 CTEs séquentielles + 1 synthèse finale** :

1. **CTE 1 (\`signaux_retardes\`) — Couche d'information $\\mathcal{F}_{t-1}$** :
   - \`LAG(rendement_journalier, 1) OVER (PARTITION BY ticker ORDER BY date ASC) AS rdt_hier\` décale le rendement de la veille en partitionnant strictement par \`ticker\` (sans \`PARTITION BY ticker\`, le premier jour de \`BNP\` hériterait du dernier jour de \`TTE\` — contamination inter-actifs !).
2. **CTE 2 (\`trades_causaux\`) — Couche d'exécution à $t$** :
   - \`WHERE rdt_hier IS NOT NULL\` supprime le jour 1 (\`2024-01-02\`) sur chaque actif afin que \`COUNT(*)\` mesure fidèlement les $4$ séances actives ($t \\ge 2$) ;
   - Calcule \`position\` ($+1$ / $-1$) et \`pnl_jour = position * rendement_journalier\`.
3. **Synthèse finale (\`GROUP BY ticker\`)** :
   - Agrège \`nb_jours_actifs\`, \`nb_trades_gagnants\`, \`taux_reussite_pct\` et \`pnl_cumule_pct\`.

\`\`\`sql
-- Moteur de backtest multi-actifs en 2 CTEs cloisonnant signal t-1 et exécution t
WITH signaux_retardes AS (
    SELECT ticker, date, rendement_journalier,
           LAG(rendement_journalier, 1) OVER (PARTITION BY ticker ORDER BY date ASC) AS rdt_hier
    FROM marche_actions
),
trades_causaux AS (
    SELECT ticker, date, rendement_journalier,
           CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END AS position,
           (CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END) * rendement_journalier AS pnl_jour
    FROM signaux_retardes
    WHERE rdt_hier IS NOT NULL
)
SELECT ticker, COUNT(*) AS nb_jours_actifs,
       ROUND(100.0 * SUM(pnl_jour), 2) AS pnl_cumule_pct
FROM trades_causaux GROUP BY ticker;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Audit comparatif réel sur les $5$ actifs de \`marche_actions\` opposant le backtest causal $\\mathcal{F}_{t-1}$-mesurable au backtest biaisé (*look-ahead*) :

\`\`\`sql
WITH s AS (
  SELECT ticker, date, rendement_journalier AS r,
         CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END AS pos_t,
         LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (PARTITION BY ticker ORDER BY date) AS pos_hier
  FROM marche_actions
)
SELECT ticker,
       ROUND(100.0 * SUM(pos_hier * r), 2) AS pnl_causal_pct,
       ROUND(100.0 * SUM(pos_t * r), 2) AS pnl_look_ahead_pct,
       ROUND(100.0 * (SUM(pos_t * r) - SUM(pos_hier * r)), 2) AS biais_artificiel_pct
FROM s
WHERE pos_hier IS NOT NULL
GROUP BY ticker
ORDER BY pnl_causal_pct DESC, ticker ASC;
\`\`\`

\`\`\`text
ticker | pnl_causal_pct | pnl_look_ahead_pct | biais_artificiel_pct
-------+----------------+--------------------+---------------------
CW8    | 1.26           | 1.26               | 0
MC     | -1.08          | 3.24               | 4.32
AI     | -1.19          | 2.33               | 3.52
BNP    | -1.27          | 3.83               | 5.1
TTE    | -1.91          | 3.85               | 5.76
\`\`\`

Sur cette semaine de marché, les $4$ actions individuelles présentent un comportement de *mean-reversion* à court terme qui fait perdre la stratégie momentum causale (de $-1.08\\%$ à $-1.91\\%$), tandis que l'ETF diversifié \`CW8\` progresse régulièrement sur les $4$ séances ($+1.26\\%$). Un code biaisé sans \`LAG\` aurait fabriqué jusqu'à $+5.76\\%$ de profit fantôme sur \`TTE\` !
      `,
      taskMarkdown: `
Construisez le moteur de backtest momentum causal sur \`marche_actions\` en **2 CTEs chaînées** :

1. **CTE 1 \`signaux_retardes\`** : sélectionnez \`ticker\`, \`date\`, \`rendement_journalier\`, et extrayez le rendement de la veille par actif via :
   - \`LAG(rendement_journalier, 1) OVER (PARTITION BY ticker ORDER BY date ASC) AS rdt_hier\`
2. **CTE 2 \`trades_causaux\`** : interrogez \`signaux_retardes\` en filtrant **uniquement les séances actives** (\`WHERE rdt_hier IS NOT NULL\`), et calculez :
   - \`position\` : \`CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END\`
   - \`pnl_jour\` : \`(CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END) * rendement_journalier\`
3. **Requête principale** : regroupez \`trades_causaux\` par \`ticker\` et retournez dans **cet ordre exact** :
   - \`ticker\`
   - \`nb_jours_actifs\` : \`COUNT(*)\`
   - \`nb_trades_gagnants\` : \`SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END)\`
   - \`taux_reussite_pct\` : \`ROUND(100.0 * SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) / COUNT(*), 2)\`
   - \`pnl_cumule_pct\` : \`ROUND(100.0 * SUM(pnl_jour), 2)\`

Triez du meilleur PnL au moins bon : \`ORDER BY pnl_cumule_pct DESC, ticker ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH signaux_retardes AS (
    SELECT
        ticker,
        date,
        rendement_journalier,
        LAG(rendement_journalier, 1) OVER (
            PARTITION BY ticker
            ORDER BY date ASC
        ) AS rdt_hier
    FROM marche_actions
),
trades_causaux AS (
    SELECT
        ticker,
        date,
        rendement_journalier,
        CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END AS position,
        (CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END) * rendement_journalier AS pnl_jour
    FROM signaux_retardes
    WHERE rdt_hier IS NOT NULL
)
SELECT
    ticker,
    COUNT(*) AS nb_jours_actifs,
    SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) AS nb_trades_gagnants,
    ROUND(100.0 * SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS taux_reussite_pct,
    ROUND(100.0 * SUM(pnl_jour), 2) AS pnl_cumule_pct
FROM trades_causaux
GROUP BY ticker
ORDER BY pnl_cumule_pct DESC, ticker ASC;`,
      validationQuery: `WITH signaux_retardes AS (
    SELECT
        ticker,
        date,
        rendement_journalier,
        LAG(rendement_journalier, 1) OVER (
            PARTITION BY ticker
            ORDER BY date ASC
        ) AS rdt_hier
    FROM marche_actions
),
trades_causaux AS (
    SELECT
        ticker,
        date,
        rendement_journalier,
        CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END AS position,
        (CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END) * rendement_journalier AS pnl_jour
    FROM signaux_retardes
    WHERE rdt_hier IS NOT NULL
)
SELECT
    ticker,
    COUNT(*) AS nb_jours_actifs,
    SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) AS nb_trades_gagnants,
    ROUND(100.0 * SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS taux_reussite_pct,
    ROUND(100.0 * SUM(pnl_jour), 2) AS pnl_cumule_pct
FROM trades_causaux
GROUP BY ticker
ORDER BY pnl_cumule_pct DESC, ticker ASC;`,
      datasets: [],
      hints: [
        "Dans la CTE 1 `signaux_retardes`, n'oubliez pas `PARTITION BY ticker` à l'intérieur de `LAG(rendement_journalier, 1) OVER (...)` pour ne pas mélanger les rendements de deux actions différentes.",
        "Dans la CTE 2 `trades_causaux`, filtrez impérativement `WHERE rdt_hier IS NOT NULL` afin d'exclure le jour 1 sans signal causal et obtenir `nb_jours_actifs = 4`.",
        "Dans le `SELECT` final, utilisez `100.0 * SUM(...) / COUNT(*)` pour `taux_reussite_pct` et `100.0 * SUM(pnl_jour)` pour `pnl_cumule_pct`.",
      ],
      guide: {
        theoryToPracticeLink:
          "Pour imposer la mesurabilité $\\mathcal{F}_{t-1}$ ($\\theta_{i,t} = \\operatorname{sgn}(r_{i,t-1})$) sans contaminer un actif par un autre, la CTE 1 \`signaux_retardes\` extrait \`rdt_hier\` via \`LAG(...) OVER (PARTITION BY ticker ORDER BY date ASC)\`. La CTE 2 \`trades_causaux\` élimine la séance initiale sans historique (\`WHERE rdt_hier IS NOT NULL\`) et exécute $\\text{PnL}_{i,t} = \\theta_{i,t} \\cdot r_{i,t}$, avant que l'agrégation par \`ticker\` ne synthétise *Hit Ratio* et performance cumulée.",
        stepByStepPlan: [
          "Dans la CTE 1 `signaux_retardes`, extraire `rdt_hier` via `LAG(rendement_journalier, 1) OVER (PARTITION BY ticker ORDER BY date ASC)` depuis `marche_actions`.",
          "Dans la CTE 2 `trades_causaux`, filtrer `WHERE rdt_hier IS NOT NULL`, attribuer `position` (`+1` si `rdt_hier > 0`, sinon `-1`) et calculer `pnl_jour = position * rendement_journalier`.",
          "Dans le `SELECT` final, regrouper par `ticker` et compter `nb_jours_actifs` ainsi que `nb_trades_gagnants` (`pnl_jour > 0`).",
          "Calculer `taux_reussite_pct` et `pnl_cumule_pct` en pourcentages arrondis à 2 décimales, puis trier par `pnl_cumule_pct DESC, ticker ASC;`.",
        ],
        concepts: [
          {
            symbol: "signaux_retardes",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE 1 alignant chaque rendement du jour $t$ avec le rendement de la veille $r_{t-1}$ sur le même titre.",
          },
          {
            symbol: "LAG(rendement_journalier, 1) OVER (PARTITION BY ticker ORDER BY date ASC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Opérateur causal extrayant $r_{i,t-1}$ par ticker ; retourne `NULL` sur la première date (`2024-01-02`).",
          },
          {
            symbol: "trades_causaux",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE 2 simulant l'exécution réelle sur les $4$ séances actives ($t \\ge 2$) en calculant la position et le PnL journalier.",
          },
          {
            symbol: "WHERE rdt_hier IS NOT NULL",
            kind: "Paramètre",
            roleInExercise:
              "Exclut la première journée sans signal afin de ne pas fausser `COUNT(*)` dans le calcul du taux de réussite.",
          },
          {
            symbol: "position",
            kind: "Variable",
            roleInExercise:
              "Signal binaire prévisible $\\theta_t \\in \\{-1, +1\\}$ déterminé uniquement à partir de `rdt_hier`.",
          },
          {
            symbol: "pnl_jour",
            kind: "Variable",
            roleInExercise:
              "Rendement capté à la séance $t$ par la stratégie ($\\theta_t \\cdot r_t$).",
          },
          {
            symbol: "taux_reussite_pct, pnl_cumule_pct",
            kind: "Variable",
            roleInExercise:
              "Indicateurs consolidés (*Hit Ratio* et somme des PnL en pourcentage) permettant de classer les actifs.",
          },
        ],
        guidedCode: `-- 1. CTE 1 : Extraction causale du rendement de la veille par actif
WITH signaux_retardes AS (
    SELECT
        ticker,
        date,
        rendement_journalier,
        LAG(___, 1) OVER (
            PARTITION BY ___
            ORDER BY date ASC
        ) AS rdt_hier
    FROM marche_actions
),
-- 2. CTE 2 : Attribution de la position F_{t-1} et calcul du PnL sur t >= 2
trades_causaux AS (
    SELECT
        ticker,
        date,
        rendement_journalier,
        CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END AS position,
        (CASE WHEN rdt_hier > 0 THEN 1 ELSE -1 END) * ___ AS pnl_jour
    FROM signaux_retardes
    WHERE rdt_hier IS NOT ___
)
-- 3. Synthèse des performances de backtest par ticker
SELECT
    ticker,
    COUNT(*) AS nb_jours_actifs,
    SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) AS nb_trades_gagnants,
    ROUND(100.0 * SUM(CASE WHEN pnl_jour > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS taux_reussite_pct,
    ROUND(100.0 * SUM(___), 2) AS pnl_cumule_pct
FROM trades_causaux
GROUP BY ticker
ORDER BY pnl_cumule_pct DESC, ticker ASC;`,
      },
    },

    // =========================================================================
    // CAS 10 : Tableau d'Amortissement & Valeur Actuelle de Passif Obligataire (WITH RECURSIVE)
    // =========================================================================
    {
      id: "v3-sql-10",
      title: "10. Tableau d'Amortissement & Valeur Actuelle de Passif Obligataire (WITH RECURSIVE)",
      category: "alm",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 35,
      description:
        "Générez intégralement en SQL récursif (WITH RECURSIVE) l'échéancier sur 6 ans d'un engagement obligataire de 120 000 EUR amorti à tranche constante au taux fixe de 4 % et vérifiez sa valeur actuelle.",
      theoryMarkdown: `
### Équations Récursives d'Amortissement, Théorème du Prix au Pair et Duration ALM

#### 🎓 Cours Théorique Approfondi

En gestion ALM et en actuariat financier, la projection des flux de passif ou de dette obligataire obéit à une **relation de récurrence** discrète d'année en année $t = 1, \\dots, T$ ($T = 6$). Considérons un engagement de nominal initial $K_0 = 120\\,000\\text{ EUR}$ amorti par **tranche constante du capital** $A = \\frac{K_0}{T} = 20\\,000\\text{ EUR}$ au taux d'intérêt annuel fixe $i = 4\\% = 0.04$ :

- **Capital restant dû en début d'année $t$** :

$$
K_{t-1} = K_0 - (t - 1)A
$$

- **Intérêt couru, annuité totale et capital restant dû en fin d'année $t$** :

$$
I_t = i \\cdot K_{t-1}, \\qquad F_t = I_t + A, \\qquad K_t = K_{t-1} - A
$$

**Démonstration — Théorème fondamental de valorisation au pair :**
En actualisant chaque flux futur $F_t$ à son propre taux d'intérêt contractuel $i = 4\\%$, la valeur actuelle (*Present Value*, PV) du passif vaut :

$$
\\text{PV}(i) = \\sum_{t=1}^{T} \\frac{F_t}{(1 + i)^t} = \\sum_{t=1}^{T} \\frac{i K_{t-1} + (K_{t-1} - K_t)}{(1 + i)^t} = \\sum_{t=1}^{T} \\left( \\frac{K_{t-1}}{(1 + i)^{t-1}} - \\frac{K_t}{(1 + i)^t} \\right)
$$

Cette somme est **exactement télescopique** : tous les termes intermédiaires s'annulent deux à deux, et comme le capital final après la dernière échéance est nul ($K_T = 0$), on obtient rigoureusement :

$$
\\text{PV}(i) = \\frac{K_0}{(1 + i)^0} - \\frac{K_T}{(1 + i)^T} = K_0 = 120\\,000\\text{ EUR}
$$

Ce résultat universel constitue un **test d'invariant comptable et actuariel** : quel que soit le profil d'amortissement ($A_t$ constant, in fine ou annuités constantes), la somme des flux actualisés au taux facial doit reconstituer exactement le capital initial $K_0$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous **Solvabilité II** (calcul de la *Best Estimate Liability* — BEL) et **IFRS 9 / 17** (coût amorti et taux d'intérêt effectif), la génération automatisée d'échéanciers de flux de passifs et leur actualisation par la courbe des taux sans risque permettent de mesurer la **Duration de Macaulay** et de tester l'impact d'un choc de taux ($+100\\text{ bps}$) sur les fonds propres économiques.

#### 💻 Masterclass SQL de Production

En SQL standard et SQLite, l'expression \`WITH RECURSIVE\` permet de générer une série temporelle et de calculer une suite définie par récurrence **sans aucune table source** (\`FROM\` optionnel au cas de base !) :

1. **Membre d'ancrage (cas de base $t = 1$)** : une requête \`SELECT\` générant la première ligne (\`annee = 1\`, \`capital_debut = 120000.0\`, \`capital_fin = 100000.0\`, \`flux_actualise = ... / POWER(1.04, 1)\`).
2. **Opérateur \`UNION ALL\`** : relie le cas de base à la requête récursive (toujours \`UNION ALL\` pour préserver les lignes sans déduplication coûteuse).
3. **Membre récursif ($t \\to t + 1$)** : lit la ligne précédente depuis la table virtuelle \`echeancier\` elle-même, fait avancer \`annee + 1\`, transfère \`capital_fin AS capital_debut\`, recalcule \`interet\`, \`annuite_totale\`, \`flux_actualise\` via \`POWER(1.04, annee + 1)\`, et **doit impérativement comporter une condition d'arrêt** (\`WHERE annee < 6\`) pour éviter une boucle infinie !

\`\`\`sql
-- Structure canonique d'une CTE récursive d'amortissement financier
WITH RECURSIVE echeancier AS (
    -- Cas de base (t = 1)
    SELECT 1 AS annee, 120000.0 AS capital_debut, 100000.0 AS capital_fin
    UNION ALL
    -- Étape récursive (t -> t + 1) avec condition d'arrêt explicite
    SELECT annee + 1, capital_fin AS capital_debut, capital_fin - 20000.0 AS capital_fin
    FROM echeancier
    WHERE annee < 6
)
SELECT * FROM echeancier ORDER BY annee ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Audit complet exécuté dans le moteur SQLite avec la fonction \`POWER\` sur l'échéancier récursif : vérification du théorème du pair ($\\text{PV}(4\\%) = 120\\,000.00\\text{ EUR}$), calcul de la **Duration de Macaulay** et choc de taux $+100\\text{ bps}$ ($5\\%$) :

\`\`\`sql
WITH RECURSIVE ech AS (
  SELECT 1 AS annee, 120000.0 AS cap_deb, 4800.0 AS interet, 20000.0 AS amort, 24800.0 AS annuite, 100000.0 AS cap_fin
  UNION ALL
  SELECT annee + 1, cap_fin, ROUND(cap_fin * 0.04, 2), 20000.0, ROUND(cap_fin * 0.04 + 20000.0, 2), cap_fin - 20000.0
  FROM ech WHERE annee < 6
)
SELECT ROUND(SUM(interet), 2) AS total_interets,
       ROUND(SUM(annuite), 2) AS total_annuites,
       ROUND(SUM(annuite / POWER(1.04, annee)), 2) AS va_taux_4pct,
       ROUND(SUM(annee * (annuite / POWER(1.04, annee))) / SUM(annuite / POWER(1.04, annee)), 4) AS duration_macaulay_ans,
       ROUND(SUM(annuite / POWER(1.05, annee)), 2) AS va_choc_5pct
FROM ech;
\`\`\`

\`\`\`text
total_interets | total_annuites | va_taux_4pct | duration_macaulay_ans | va_choc_5pct
---------------+----------------+--------------+-----------------------+-------------
16800          | 136800         | 120000       | 3.2841                | 116302.77
\`\`\`

La somme des flux actualisés à $4\\%$ restitue **au centime près** $120\\,000.00\\text{ EUR}$ ; la duration de Macaulay s'établit à $3.2841$ ans, et une hausse de taux de $+100\\text{ bps}$ fait baisser la valeur économique de ce passif à $116\\,302.77\\text{ EUR}$ ($-3.08\\%$).
      `,
      taskMarkdown: `
Générez en pur SQL via **\`WITH RECURSIVE echeancier AS (...)\`** le tableau d'amortissement sur **6 ans** d'un emprunt initial de **$120\\,000.0\\text{ EUR}$** amorti par tranche constante du capital (**$20\\,000.0\\text{ EUR}$/an**) au taux fixe de **$4\\%$** (\`0.04\`) :

- **Cas de base (\`annee = 1\`)** :
  - \`1 AS annee\`
  - \`120000.0 AS capital_debut\`
  - \`ROUND(120000.0 * 0.04, 2) AS interet\`
  - \`20000.0 AS amortissement\`
  - \`ROUND(120000.0 * 0.04 + 20000.0, 2) AS annuite_totale\`
  - \`ROUND((120000.0 * 0.04 + 20000.0) / POWER(1.04, 1), 2) AS flux_actualise\`
  - \`120000.0 - 20000.0 AS capital_fin\`
- **Cas récursif (\`UNION ALL\`, tant que \`WHERE annee < 6\`)** :
  - \`annee + 1\`
  - \`capital_fin AS capital_debut\`
  - \`ROUND(capital_fin * 0.04, 2) AS interet\`
  - \`20000.0 AS amortissement\`
  - \`ROUND(capital_fin * 0.04 + 20000.0, 2) AS annuite_totale\`
  - \`ROUND((capital_fin * 0.04 + 20000.0) / POWER(1.04, annee + 1), 2) AS flux_actualise\`
  - \`capital_fin - 20000.0 AS capital_fin\`
- **Requête principale** : sélectionnez \`annee\`, \`capital_debut\`, \`interet\`, \`amortissement\`, \`annuite_totale\`, \`flux_actualise\`, \`capital_fin\` depuis \`echeancier\` et triez par \`annee ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL complet ci-dessous :\n",
      solutionCode: `WITH RECURSIVE echeancier AS (
    SELECT
        1 AS annee,
        120000.0 AS capital_debut,
        ROUND(120000.0 * 0.04, 2) AS interet,
        20000.0 AS amortissement,
        ROUND(120000.0 * 0.04 + 20000.0, 2) AS annuite_totale,
        ROUND((120000.0 * 0.04 + 20000.0) / POWER(1.04, 1), 2) AS flux_actualise,
        120000.0 - 20000.0 AS capital_fin
    UNION ALL
    SELECT
        annee + 1,
        capital_fin AS capital_debut,
        ROUND(capital_fin * 0.04, 2) AS interet,
        20000.0 AS amortissement,
        ROUND(capital_fin * 0.04 + 20000.0, 2) AS annuite_totale,
        ROUND((capital_fin * 0.04 + 20000.0) / POWER(1.04, annee + 1), 2) AS flux_actualise,
        capital_fin - 20000.0 AS capital_fin
    FROM echeancier
    WHERE annee < 6
)
SELECT
    annee,
    capital_debut,
    interet,
    amortissement,
    annuite_totale,
    flux_actualise,
    capital_fin
FROM echeancier
ORDER BY annee ASC;`,
      validationQuery: `WITH RECURSIVE echeancier AS (
    SELECT
        1 AS annee,
        120000.0 AS capital_debut,
        ROUND(120000.0 * 0.04, 2) AS interet,
        20000.0 AS amortissement,
        ROUND(120000.0 * 0.04 + 20000.0, 2) AS annuite_totale,
        ROUND((120000.0 * 0.04 + 20000.0) / POWER(1.04, 1), 2) AS flux_actualise,
        120000.0 - 20000.0 AS capital_fin
    UNION ALL
    SELECT
        annee + 1,
        capital_fin AS capital_debut,
        ROUND(capital_fin * 0.04, 2) AS interet,
        20000.0 AS amortissement,
        ROUND(capital_fin * 0.04 + 20000.0, 2) AS annuite_totale,
        ROUND((capital_fin * 0.04 + 20000.0) / POWER(1.04, annee + 1), 2) AS flux_actualise,
        capital_fin - 20000.0 AS capital_fin
    FROM echeancier
    WHERE annee < 6
)
SELECT
    annee,
    capital_debut,
    interet,
    amortissement,
    annuite_totale,
    flux_actualise,
    capital_fin
FROM echeancier
ORDER BY annee ASC;`,
      datasets: [],
      hints: [
        "Démarrez par `WITH RECURSIVE echeancier AS (` avec une première requête `SELECT` générant l'année `1` et `capital_debut = 120000.0` sans clause `FROM`.",
        "Reliez le membre récursif avec `UNION ALL` : chaque colonne est calculée à partir de `annee` et `capital_fin` de la ligne précédente (par exemple `POWER(1.04, annee + 1)` pour actualiser).",
        "Placez impérativement la condition d'arrêt `WHERE annee < 6` dans le membre récursif pour générer exactement les années `1` à `6` (et terminer à `capital_fin = 0`).",
      ],
      guide: {
        theoryToPracticeLink:
          "Les équations de récurrence $K_{t-1}^{\\text{déb}} = K_{t-1}^{\\text{fin}}$, $I_t = 0.04 \\, K_{t-1}$, $F_t = I_t + 20\\,000$ et $\\text{PV}_t = F_t / (1.04)^t$ se traduisent ligne à ligne dans une CTE \`WITH RECURSIVE echeancier\`. L'ancrage initialise $t=1$, \`UNION ALL\` propage l'état d'une année sur l'autre, et la somme des \`flux_actualise\` vérifie exactement le théorème du prix au pair ($120\\,000.00\\text{ EUR}$).",
        stepByStepPlan: [
          "Ouvrir la CTE récursive avec `WITH RECURSIVE echeancier AS (` et écrire le cas de base pour `annee = 1` (`120000.0` de capital initial, `20000.0` d'amortissement).",
          "Ajouter `UNION ALL` puis écrire l'étape récursive `FROM echeancier` qui incrémente `annee + 1` et affecte `capital_fin` de l'année $t$ à `capital_debut` de l'année $t+1$.",
          "Calculer `interet`, `annuite_totale` et `flux_actualise` (via `POWER(1.04, annee + 1)`), arrondis à 2 décimales.",
          "Ajouter la condition d'arrêt `WHERE annee < 6` et projeter les 7 colonnes triées par `annee ASC;`.",
        ],
        concepts: [
          {
            symbol: "WITH RECURSIVE echeancier AS (...)",
            kind: "Syntaxe",
            roleInExercise:
              "CTE auto-référencée générant dynamiquement les 6 années d'un échéancier sans table physique préalable.",
          },
          {
            symbol: "UNION ALL",
            kind: "Syntaxe",
            roleInExercise:
              "Concatène le cas de base ($t=1$) avec les itérations récursives ($t=2 \\dots 6$) sans déduplication.",
          },
          {
            symbol: "capital_debut, capital_fin",
            kind: "Variable",
            roleInExercise:
              "Variables d'état assurant la continuité comptable : le `capital_fin` de l'année $t$ devient le `capital_debut` de l'année $t+1$.",
          },
          {
            symbol: "interet, amortissement, annuite_totale",
            kind: "Variable",
            roleInExercise:
              "Composantes du flux obligataire : $I_t = 0.04 K_{t-1}$, amortissement constant $A = 20\\,000\\text{ EUR}$ et flux total $F_t = I_t + A$.",
          },
          {
            symbol: "POWER(1.04, ...)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Fonction mathématique enregistrée dans le moteur SQLite WASM calculant le facteur de capitalisation $(1 + i)^t$ pour l'actualisation.",
          },
          {
            symbol: "flux_actualise",
            kind: "Variable",
            roleInExercise:
              "Valeur actuelle $F_t / (1.04)^t$ dont la somme sur 6 ans vaut exactement $120\\,000.00\\text{ EUR}$.",
          },
          {
            symbol: "WHERE annee < 6",
            kind: "Paramètre",
            roleInExercise:
              "Condition d'arrêt obligatoire stoppant la récursion une fois la 6e année générée (`annee = 5` produit `annee + 1 = 6`).",
          },
        ],
        guidedCode: `-- 1. CTE récursive générant les 6 années d'amortissement et de flux actualisés
WITH RECURSIVE echeancier AS (
    -- Cas de base : Année 1
    SELECT
        1 AS annee,
        120000.0 AS capital_debut,
        ROUND(120000.0 * 0.04, 2) AS interet,
        20000.0 AS amortissement,
        ROUND(120000.0 * 0.04 + 20000.0, 2) AS annuite_totale,
        ROUND((120000.0 * 0.04 + 20000.0) / POWER(1.04, 1), 2) AS flux_actualise,
        120000.0 - 20000.0 AS capital_fin
    ___ ___
    -- Étape récursive : Année t + 1 depuis l'année t
    SELECT
        annee + 1,
        ___ AS capital_debut,
        ROUND(capital_fin * 0.04, 2) AS interet,
        20000.0 AS amortissement,
        ROUND(capital_fin * 0.04 + 20000.0, 2) AS annuite_totale,
        ROUND((capital_fin * 0.04 + 20000.0) / POWER(1.04, ___), 2) AS flux_actualise,
        capital_fin - 20000.0 AS capital_fin
    FROM echeancier
    WHERE annee < ___
)
-- 2. Restitution complète de l'échéancier
SELECT
    annee,
    capital_debut,
    interet,
    amortissement,
    annuite_totale,
    flux_actualise,
    capital_fin
FROM echeancier
ORDER BY annee ASC;`,
      },
    },
  ],
};
