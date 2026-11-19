import { CourseModule } from "@/types/course";

export const PYTHON_SUITE_MODULE: CourseModule = {
  id: "python-econometrie-suite",
  title: "Python Économétrie : Entraînement & Ancrage (Suite)",
  subtitle: "26 exercices pratiques de répétition en Pandas, MCO, Diagnostics & Risque ALM",
  icon: "TrendingUp",
  description:
    "Seconde série d'entraînement au même niveau que le Module 2 sur les séries macroéconomiques (df) et d'actifs (df_actifs) pour ancrer Pandas, Statsmodels et les tests économétriques.",
  exercises: [
    {
      id: "py-27",
      title: "1. Résumé statistique Pandas (.describe)",
      category: "data_prep",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Générez d'un seul appel le tableau complet des statistiques descriptives sur les taux et spreads.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Anatomie Statistique d'un Panel Macro-Financier

Avant d'estimer une régression ou de calibrer un scénario de stress ALM (*Asset-Liability Management*), un quant commence toujours par auditer la **distribution marginale** de chaque série. Huit métriques résument à elles seules la localisation, la dispersion et l'asymétrie d'un échantillon $(x_1, \\dots, x_T)$ de taille $T$ :

- **Moyenne empirique** (moment d'ordre 1) :

$$
\\bar{x} = \\frac{1}{T} \\sum_{t=1}^T x_t
$$

- **Écart-type corrigé de Bessel** (dispersion quadratique autour de $\\bar{x}$) :

$$
s = \\sqrt{\\frac{1}{T - 1} \\sum_{t=1}^T (x_t - \\bar{x})^2}
$$

- **Statistiques d'ordre et quantiles** : en triant les observations $x_{(1)} \\le x_{(2)} \\le \\dots \\le x_{(T)}$, le minimum $x_{(1)}$, les quartiles $(Q_{25}, Q_{50}, Q_{75})$ et le maximum $x_{(T)}$ révèlent l'étendue des chocs historiques sans aucune hypothèse gaussienne.

> 💡 **Intuition ALM & Gestion des Risques : Moyenne vs Médiane ($Q_{50}$)**
>
> Comparer $\\bar{x}$ et $Q_{50}$ diagnostique immédiatement l'**asymétrie** de la série :
> - Si $\\bar{x} > Q_{50}$, la distribution présente une **queue droite étirée** (asymétrie positive). C'est typique des taux monétaires post-Covid : longtemps négatifs ($-0.57\\%$), puis relevés brutalement jusqu'à $+3.92\\%$, tirant la moyenne vers le haut bien au-dessus de la médiane.
> - Si $s \\gg \\frac{Q_{75} - Q_{25}}{1.349}$, la série subit des **chocs extrêmes** qui invalideront une hypothèse normale naïve.

### 💻 Masterclass Python

En Pandas, la sélection d'un sous-ensemble de colonnes exige des **doubles crochets** \`df[['col1', 'col2']]\` :
- \`df['col1']\` (simple crochet) renvoie une \`pd.Series\` unidimensionnelle.
- \`df[['col1', 'col2']]\` (double crochet, passant une \`list\` de chaînes) renvoie un \`pd.DataFrame\` bidimensionnel.

Point d'ingénierie critique : \`.describe()\` appelle en interne \`.std(ddof=1)\` (estimateur **sans biais** divisant par $T - 1$), alors que \`np.std()\` de NumPy utilise \`ddof=0\` par défaut ! Enfin, \`.round(2)\` et \`.T\` (transposition) améliorent la lisibilité en comité des risques.

\`\`\`python
# 1. Sélection de 3 colonnes : la liste interne ['a', 'b', 'c'] produit un DataFrame
sous_df = df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']]

# 2. .describe() calcule 8 statistiques par colonne (shape = (8, 3)) avec ddof=1
tableau = sous_df.describe()

# 3. Chaînage : arrondi à 2 décimales et accès à la ligne '50%' (médiane)
medianes = tableau.loc['50%'].round(2)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Exécution directe sur les séries macroéconomiques \`inflation_hicp\`, \`pib_croissance\` et \`cac40_rendement\` de \`df\` (avec transposition \`.T\` pour comparer facilement moyenne et médiane \`50%\`) :

\`\`\`python
tab = df[['inflation_hicp', 'pib_croissance', 'cac40_rendement']].describe().round(2).T
print(tab)
\`\`\`

\`\`\`text
                 count  mean    std   min   25%   50%    75%   max
inflation_hicp    16.0  4.20   3.43  -0.3  1.15  3.85   7.02   9.9
pib_croissance    16.0  0.42   5.84 -11.8 -0.10  0.25   0.60  18.2
cac40_rendement   16.0  1.99  11.02 -26.5 -3.22  3.40  10.32  15.6
\`\`\`

On observe immédiatement que l'écart-type du PIB ($5.84\\%$) est immense devant son écart interquartile ($0.60 - (-0.10) = 0.70\\%$), trahissant les chocs extrêmes de 2020 ($-11.8\\%$ et $+18.2\\%$).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` ($T = 16$ trimestres de \`2020-Q1\` à \`2023-Q4\`) :
1. Sélectionnez les trois colonnes \`['euribor_3m', 'oat_10y', 'spread_credit_bbb']\`.
2. Appelez \`.describe()\` et stockez le résultat exact (de dimension \`(8, 3)\`) dans la variable **\`resume_stats\`**.
3. Affichez \`resume_stats.round(2)\` avec \`print(...)\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "resume_stats = df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe()\nprint(resume_stats.round(2))",
      testPythonCode: "assert 'resume_stats' in globals()\nassert resume_stats.shape == (8, 3)",
      hints: ["resume_stats = df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe()"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la distribution de chaque série est résumée par $8$ indicateurs : effectif $T$, moyenne $\\bar{x}$, écart-type corrigé de Bessel $s$ (diviseur $T-1$), minimum, quartiles $(Q_{25}, Q_{50}, Q_{75})$ et maximum. En Python, la méthode Pandas \`.describe()\` calcule automatiquement ces $8$ lignes d'un seul coup sur le DataFrame préchargé \`df\` (qui correspond à la table \`macro_taux\`). Le test de validation vérifie que le tableau obtenu s'appelle exactement **\`resume_stats\`** et possède la dimension \`(8, 3)\` ($8$ métriques en lignes $\\times$ $3$ colonnes de taux/spread).`,
        stepByStepPlan: [
          `Sélectionnez les $3$ colonnes demandées (\`euribor_3m\`, \`oat_10y\`, \`spread_credit_bbb\`) dans le DataFrame préchargé \`df\` à l'aide de doubles crochets.`,
          `Enchaînez l'appel à \`.describe()\` sur ce sous-DataFrame et stockez le résultat (dimension \`(8, 3)\`) dans la variable \`resume_stats\`.`,
          `Affichez \`resume_stats\` arrondi à $2$ décimales avec \`.round(2)\` dans \`print(...)\`.`,
        ],
        concepts: [
          {
            symbol: "df",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame Pandas déjà préchargé en mémoire correspondant à la table `macro_taux` ($16$ trimestres de `2020-Q1` à `2023-Q4`). Aucun import ni `pd.read_csv` n'est nécessaire.",
          },
          {
            symbol: "[['euribor_3m', 'oat_10y', 'spread_credit_bbb']]",
            kind: "Syntaxe",
            roleInExercise: "Doubles crochets Pandas : les crochets externes indexent `df`, et la liste Python interne `['...', '...']` sélectionne $3$ colonnes pour renvoyer un `DataFrame` 2D (et non une `Series` 1D).",
          },
          {
            symbol: ".describe()",
            kind: "Fonction / Méthode",
            roleInExercise: "Méthode Pandas qui calcule en un appel $8$ statistiques descriptives (`count`, `mean`, `std` avec `ddof=1`, `min`, `25%`, `50%`, `75%`, `max`) pour chaque colonne numérique.",
          },
          {
            symbol: "resume_stats",
            kind: "Variable",
            roleInExercise: "DataFrame résultat de dimension `(8, 3)` exigé par `testPythonCode` (`assert resume_stats.shape == (8, 3)`).",
          },
          {
            symbol: ".round(2)",
            kind: "Fonction / Méthode",
            roleInExercise: "Arrondit les valeurs affichées à $2$ décimales pour la lisibilité en console sans altérer la précision interne de `resume_stats`.",
          },
          {
            symbol: "print(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction Python standard affichant le tableau récapitulatif dans la zone de résultats.",
          },
        ],
        guidedCode: `# Étape 1 : Sélectionner les 3 colonnes dans df (doubles crochets) et appeler .describe()
resume_stats = df[['A_COMPLETER', 'A_COMPLETER', 'A_COMPLETER']].___()

# Étape 2 : Afficher le tableau arrondi à 2 décimales
print(resume_stats.___(2))`,
      },
    },
    {
      id: "py-28",
      title: "2. Filtrage booléen simple (Euribor positif)",
      category: "data_prep",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Extrayez les trimestres où l'Euribor 3 mois est repassé en territoire positif.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Filtrage de Régime Monétaire par Fonction Indicatrice

En économétrie financière et en ALM bancaire ou assurantielle, les paramètres structurels ne sont pas invariants entre régimes économiques. La période 2020–2023 contenue dans \`df\` capture une bascule historique :
1. **Régime de taux négatifs (NIRP)** de \`2020-Q1\` à \`2022-Q2\` : l'Euribor 3 mois évolue entre $-0.57\\%$ et $-0.18\\%$.
2. **Régime de resserrement monétaire BCE** à partir de \`2022-Q3\` : l'Euribor 3 mois repasse strictement positif jusqu'à $+3.92\\%$.

Formellement, isoler un régime revient à définir une **fonction indicatrice** :

$$
\\mathbf{1}_{\\{r_t > 0\\}} =
\\begin{cases}
1 & \\text{si } r_t > 0 \\\\
0 & \\text{sinon}
\\end{cases}
$$

L'opérateur relationnel de restriction $\\sigma_{r_t > 0}(\\mathcal{D})$ extrait le sous-échantillon conditionnel $\\mathcal{D}_+ = \\{t \\in \\{1,\\dots,T\\} : r_t > 0\\}$ de taille $T_+ = \\sum_{t=1}^T \\mathbf{1}_{\\{r_t > 0\\}}$.

> 💡 **Intuition ALM : Pourquoi séparer les régimes de taux ?**
>
> En assurance-vie et en banque de détail, la marge nette d'intérêt (NIM) et le coût des garanties planchers ($0\\%$) changent brutalement de comportement dès que les taux monétaires deviennent positifs : la sensibilité de l'OAT 10 ans et la prime de crédit corporate se recalibrent sur le nouveau régime.

### 💻 Masterclass Python

L'expression \`df['euribor_3m'] > 0\` réalise une **comparaison vectorisée en C/NumPy** : elle ne renvoie pas un booléen unique, mais une \`pd.Series\` de type \`bool\` de même longueur $T$ que \`df\`. Passer ce vecteur booléen à \`df[...]\` ne garde que les lignes où le masque vaut \`True\`.

Bonne pratique d'ingénierie : si vous prévoyez de modifier ensuite le sous-DataFrame filtré, ajoutez \`.copy()\` (ou utilisez \`df.loc[masque, cols].copy()\`) pour éviter l'avertissement \`SettingWithCopyWarning\` de Pandas.

\`\`\`python
# 1. Création du masque booléen : Series de True/False alignée sur l'index de df
masque_pos = df['euribor_3m'] > 0

# 2. Comptage vectoriel des lignes retenues (True == 1, False == 0 en Python)
nb_trimestres = int(masque_pos.sum())

# 3. Filtrage et copie explicite si le sous-tableau doit être enrichi plus tard
df_filtre = df.loc[masque_pos, ['periode', 'euribor_3m', 'oat_10y']].copy()
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Comparons concrètement les niveaux moyens d'OAT 10 ans et de spread de crédit BBB entre les deux régimes monétaires sur \`df\` :

\`\`\`python
neg = df[df['euribor_3m'] <= 0]
pos = df[df['euribor_3m'] > 0]
print(f"Trimestres Euribor <= 0 : {len(neg)} | OAT moy = {neg['oat_10y'].mean():.2f}% | Spread moy = {neg['spread_credit_bbb'].mean():.2f}%")
print(f"Trimestres Euribor >  0 : {len(pos)} | OAT moy = {pos['oat_10y'].mean():.2f}% | Spread moy = {pos['spread_credit_bbb'].mean():.2f}%")
\`\`\`

\`\`\`text
Trimestres Euribor <= 0 : 10 | OAT moy = 0.23% | Spread moy = 1.09%
Trimestres Euribor >  0 : 6 | OAT moy = 3.07% | Spread moy = 1.68%
\`\`\`

Dès que l'Euribor repasse positif ($6$ trimestres sur $16$), l'OAT moyenne bondit de $0.23\\%$ à $3.07\\%$ et le spread BBB se tend de $1.09\\%$ à $1.68\\%$.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Filtrez les lignes où \`euribor_3m > 0\` et stockez le DataFrame résultant dans **\`df_euribor_pos\`** (vous devez obtenir $6$ trimestres, de \`2022-Q3\` à \`2023-Q4\`).
2. Affichez uniquement les colonnes \`['periode', 'euribor_3m', 'oat_10y']\` de \`df_euribor_pos\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "df_euribor_pos = df[df['euribor_3m'] > 0]\nprint(df_euribor_pos[['periode', 'euribor_3m', 'oat_10y']])",
      testPythonCode: "assert 'df_euribor_pos' in globals()\nassert (df_euribor_pos['euribor_3m'] > 0).all() and len(df_euribor_pos) == 6",
      hints: ["df_euribor_pos = df[df['euribor_3m'] > 0]"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, isoler le régime de resserrement monétaire revient à évaluer la fonction indicatrice $\\mathbf{1}_{\\{r_t > 0\\}}$ sur chaque trimestre et à n'extraire que le sous-échantillon $\\mathcal{D}_+$ vérifiant $r_t > 0$. En Pandas, la comparaison vectorisée \`df['euribor_3m'] > 0\` produit ce masque booléen sur \`df\` (\`macro_taux\`), que l'on passe entre crochets \`df[...]\` pour créer **\`df_euribor_pos\`** (contenant exactement les $6$ trimestres positifs de \`2022-Q3\` à \`2023-Q4\`).`,
        stepByStepPlan: [
          `Écrivez la condition vectorisée \`df['euribor_3m'] > 0\` pour construire le masque booléen des trimestres à taux monétaire strictement positif.`,
          `Filtrez \`df\` avec ce masque (\`df[...]\`) et stockez le sous-DataFrame résultant dans \`df_euribor_pos\`.`,
          `Projetez et affichez uniquement les $3$ colonnes \`['periode', 'euribor_3m', 'oat_10y']\` de \`df_euribor_pos\`.`,
        ],
        concepts: [
          {
            symbol: "df",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé correspondant à `macro_taux` ($16$ trimestres, dont $10$ à Euribor négatif et $6$ à Euribor positif).",
          },
          {
            symbol: "euribor_3m",
            kind: "Colonne / Table",
            roleInExercise: "Colonne numérique de `df` mesurant le taux monétaire Euribor 3 mois (en points de pourcentage).",
          },
          {
            symbol: "df['euribor_3m'] > 0",
            kind: "Syntaxe",
            roleInExercise: "Comparaison vectorisée : au lieu d'un booléen unique, elle renvoie une `pd.Series` de $16$ valeurs `True`/`False` alignées sur les lignes de `df`.",
          },
          {
            symbol: "df[...]",
            kind: "Syntaxe",
            roleInExercise: "Indexation booléenne Pandas ne conservant que les lignes où le masque vaut `True`. (En ingénierie, on ajoute `.copy()` si l'on compte modifier ensuite le sous-DataFrame extrait.)",
          },
          {
            symbol: "df_euribor_pos",
            kind: "Variable",
            roleInExercise: "Sous-DataFrame résultat attendu par le test de validation (doit contenir $6$ lignes toutes strictement positives sur `euribor_3m`).",
          },
          {
            symbol: "[['periode', 'euribor_3m', 'oat_10y']]",
            kind: "Syntaxe",
            roleInExercise: "Sélection finale des $3$ colonnes à imprimer pour inspecter le changement de régime de taux.",
          },
        ],
        guidedCode: `# Étape 1 : Filtrer df sur la condition euribor_3m > 0
df_euribor_pos = df[df['A_COMPLETER'] > ___]

# Étape 2 : Afficher uniquement les colonnes periode, euribor_3m et oat_10y
print(df_euribor_pos[['periode', 'A_COMPLETER', 'A_COMPLETER']])`,
      },
    },
    {
      id: "py-29",
      title: "3. Filtrage composé Pandas (& et parenthèses)",
      category: "data_prep",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Isolez les trimestres combinant forte inflation (> 5 %) et baisse du CAC 40.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Événements Conjoints de Stress Macro-Financier

La construction de scénarios adverses (*stress-tests* multivariés) exige d'identifier les périodes où **plusieurs facteurs de risque se dégradent simultanément**. En théorie des probabilités, on définit deux événements :

$$
A = \\{t : \\pi_t > 5.0\\%\\} \\quad (\\text{choc inflationniste}), \\qquad B = \\{t : R_{\\text{CAC40}, t} < 0\\%\\} \\quad (\\text{baisse actions})
$$

L'intersection $A \\cap B$ isole les trimestres de **stress stagflationniste**, dont l'indicatrice produit les poids :

$$
\\mathbf{1}_{A \\cap B}(t) = \\mathbf{1}_A(t) \\cdot \\mathbf{1}_B(t), \\qquad \\hat{\\mathbb{P}}(A \\cap B) = \\frac{1}{T} \\sum_{t=1}^T \\mathbf{1}_{A \\cap B}(t)
$$

> 💡 **Intuition Portefeuille 60/40 & ALM : Rupture de la corrélation actions/obligations**
>
> En régime normal de demande, les actions et les obligations souveraines sont négativement corrélées (les obligations amortissent les krachs boursiers). Lors d'un choc d'inflation ($\\pi_t > 5\\%$), la banque centrale relève ses taux (faisant baisser le prix des obligations) *en même temps* que les valorisations actions chutent ($R_t < 0$) : c'est le pire scénario de corrélation adverse pour un fonds diversifié.

### 💻 Masterclass Python

En Python, deux pièges syntactico-logiques majeurs guettent lors de la combinaison de filtres Pandas :
1. **\`and\` / \`or\` interdits sur des vecteurs** : les mots-clés Python \`and\` et \`or\` appellent implicitement \`bool(serie)\`, ce qui lève \`ValueError: The truth value of a Series is ambiguous\` car un vecteur de $16$ booléens n'est ni globalement \`True\` ni globalement \`False\`. On utilise impérativement les opérateurs vectoriels bit-à-bit **\`&\`** (ET), **\`|\`** (OU) et **\`~\`** (NON).
2. **Précédence des opérateurs en Python** : l'opérateur \`&\` a une priorité syntaxique **plus élevée** que les comparateurs \`<\`, \`>\`, \`==\` ! Sans parenthèses, \`df['a'] > 5 & df['b'] < 0\` est évalué comme \`df['a'] > (5 & df['b']) < 0\`, provoquant un \`TypeError\` (on ne peut pas faire un \`&\` bit-à-bit entre l'entier \`5\` et des \`float64\`!). Il faut donc **toujours encapsuler chaque condition entre parenthèses** : \`(cond1) & (cond2)\`.

\`\`\`python
# 1. Chaque prédicat est isolé entre parenthèses AVANT l'opérateur vectoriel &
cond_inf = (df['inflation_hicp'] > 5.0)
cond_cac = (df['cac40_rendement'] < 0)

# 2. Intersection booléenne vectorisée (ne JAMAIS utiliser 'and' ici)
df_joint = df[cond_inf & cond_cac]

# 3. Pour une union ou une négation : (cond1) | (cond2) et ~(cond1)
df_calme = df[~(cond_inf | cond_cac)]
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Testons sur \`df\` une conjonction alternative : taux monétaires élevés (\`euribor_3m > 2.0\`) **et** spreads de crédit tendus (\`spread_credit_bbb > 1.5\`) :

\`\`\`python
res = df[(df['euribor_3m'] > 2.0) & (df['spread_credit_bbb'] > 1.5)]
print(res[['periode', 'euribor_3m', 'spread_credit_bbb', 'inflation_hicp']])
print(f"Nombre de trimestres sélectionnés : {len(res)} / {len(df)}")
\`\`\`

\`\`\`text
    periode  euribor_3m  spread_credit_bbb  inflation_hicp
11  2022-Q4        2.06               1.80             9.2
12  2023-Q1        2.85               1.70             6.9
13  2023-Q2        3.40               1.62             5.5
14  2023-Q3        3.85               1.55             4.3
Nombre de trimestres sélectionnés : 4 / 16
\`\`\`

Les 4 trimestres retenus (\`2022-Q4\` à \`2023-Q3\`) matérialisent exactement la phase de pic de resserrement monétaire et de tensions de crédit.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Isolez les trimestres combinant une inflation strictement supérieure à $5.0\\%$ (\`df['inflation_hicp'] > 5.0\`) **et** un rendement du CAC 40 négatif (\`df['cac40_rendement'] < 0\`).
2. Stockez le sous-DataFrame dans **\`df_stress\`** (en pensant aux parenthèses obligatoires autour de chaque condition autour de \`&\`).
3. Affichez \`df_stress[['periode', 'inflation_hicp', 'cac40_rendement']]\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "df_stress = df[(df['inflation_hicp'] > 5.0) & (df['cac40_rendement'] < 0)]\nprint(df_stress[['periode', 'inflation_hicp', 'cac40_rendement']])",
      testPythonCode: "assert 'df_stress' in globals()\nassert len(df_stress) == 3 and (df_stress['inflation_hicp'] > 5.0).all()",
      hints: ["N'oubliez pas les parenthèses autour de chaque test avant l'opérateur &."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le stress stagflationniste correspond à l'intersection de deux événements $A \\cap B = \\{t : \\pi_t > 5.0\\%\\} \\cap \\{t : R_{\\text{CAC40}, t} < 0\\%\\}$, traduite par le produit d'indicatrices $\\mathbf{1}_{A \\cap B}(t) = \\mathbf{1}_A(t)\\cdot\\mathbf{1}_B(t)$. En Pandas sur \`df\` (\`macro_taux\`), cet opérateur ET logique sur des vecteurs s'écrit avec **\`&\`** (jamais \`and\`) et des parenthèses autour de chaque condition pour créer **\`df_stress\`** ($3$ trimestres attendus).`,
        stepByStepPlan: [
          `Formulez le premier prédicat entre parenthèses : \`(df['inflation_hicp'] > 5.0)\`.`,
          `Formulez le second prédicat entre parenthèses : \`(df['cac40_rendement'] < 0)\`, puis combinez-les avec l'opérateur vectoriel \`&\`.`,
          `Filtrez \`df\` avec ce masque composé, stockez le résultat dans \`df_stress\` et affichez \`['periode', 'inflation_hicp', 'cac40_rendement']\`.`,
        ],
        concepts: [
          {
            symbol: "df",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé `macro_taux` ($16$ observations trimestrielles).",
          },
          {
            symbol: "inflation_hicp / cac40_rendement",
            kind: "Colonne / Table",
            roleInExercise: "Respectivement le taux d'inflation annuel IPCH (%) et le rendement trimestriel de l'indice CAC 40 (%) dans `df`.",
          },
          {
            symbol: "& (vs and)",
            kind: "Syntaxe",
            roleInExercise: "Opérateur ET vectoriel élément par élément entre deux séries booléennes. Utiliser le mot-clé Python `and` lève `ValueError: The truth value of a Series is ambiguous`.",
          },
          {
            symbol: "(cond1) & (cond2)",
            kind: "Syntaxe",
            roleInExercise: "Parenthèses indispensables : en Python, `&` est prioritaire sur `>` et `<`. Sans parenthèses, `5.0 & df['cac40_rendement']` provoque un `TypeError`.",
          },
          {
            symbol: "df_stress",
            kind: "Variable",
            roleInExercise: "Sous-DataFrame résultat attendu par le test (`len(df_stress) == 3` et `inflation_hicp > 5.0` sur toutes les lignes).",
          },
          {
            symbol: "[['periode', 'inflation_hicp', 'cac40_rendement']]",
            kind: "Syntaxe",
            roleInExercise: "Projection finale des $3$ colonnes permettant de lire les trimestres de stress stagflationniste.",
          },
        ],
        guidedCode: `# Étape 1 : Combiner les deux conditions entre parenthèses avec & (jamais 'and')
df_stress = df[(df['A_COMPLETER'] > ___) & (df['A_COMPLETER'] < ___)]

# Étape 2 : Afficher periode, inflation_hicp et cac40_rendement
print(df_stress[['periode', 'inflation_hicp', 'cac40_rendement']])`,
      },
    },
    {
      id: "py-30",
      title: "4. Rendement moyen et volatilité du CAC 40 (.mean, .std)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Mesurez la performance trimestrielle moyenne et la dispersion du CAC 40.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Moments Empiriques, Correction de Bessel et *Volatility Drag*

Pour une série de rendements trimestriels $(R_1, \\dots, R_T)$ exprimés en pourcentage, l'espérance de rendement et le risque total sont estimés par les moments d'ordre 1 et 2 :

$$
\\bar{R} = \\frac{1}{T} \\sum_{t=1}^T R_t, \\qquad \\hat{\\sigma} = \\sqrt{\\frac{1}{T - 1} \\sum_{t=1}^T (R_t - \\bar{R})^2}
$$

**Pourquoi diviser par $T - 1$ (correction de Bessel) ?** Comme la vraie moyenne théorique $\\mu$ est inconnue et remplacée par la moyenne estimée $\\bar{R}$, la somme des carrés observés est en moyenne plus faible que autour de $\\mu$ :

$$
\\mathbb{E}\\left[\\sum_{t=1}^T (R_t - \\bar{R})^2\\right] = (T - 1)\\sigma^2 \\implies \\mathbb{E}[\\hat{\\sigma}^2] = \\sigma^2
$$

Sous l'hypothèse de rendements trimestriels indépendants et identiquement distribués (i.i.d.), la variance s'additionne linéairement avec le temps ($\\sigma_{\\text{ann}}^2 = 4\\,\\sigma_{\\text{trim}}^2$), d'où la règle d'annualisation de la racine carrée du temps :

$$
\\sigma_{\\text{ann}} = \\hat{\\sigma}_{\\text{trim}} \\times \\sqrt{4} = 2\\,\\hat{\\sigma}_{\\text{trim}}
$$

> 💡 **Intuition Portefeuille : Moyenne arithmétique vs rendement composé (*volatility drag*)**
>
> En approximation de Taylor au 2e ordre, le rendement géométrique annuel moyen vérifie $\\bar{R}_{\\text{géom}} \\approx \\bar{R}_{\\text{arith}} - \\frac{1}{2}\\sigma^2$ : plus la volatilité $\\sigma$ d'un indice est élevée, plus l'écart entre rendement moyen affiché et enrichissement composé réel se creuse.

### 💻 Masterclass Python

Attention à une divergence célèbre entre **Pandas** et **NumPy** :
- \`df['col'].std()\` utilise par défaut **\`ddof=1\`** (*Delta Degrees of Freedom*, diviseur $T - 1$).
- \`np.std(arr)\` utilise par défaut **\`ddof=0\`** (diviseur $T$, estimateur du maximum de vraisemblance biaisé sur petit échantillon).

Pour un échantillon de seulement $T = 16$ trimestres, l'écart relatif $\\sqrt{16/15} \\approx +3.3\\%$ entre \`ddof=1\` et \`ddof=0\` est loin d'être négligeable ! Utilisez aussi les f-strings \`f"{val:.2f} %"\` pour formater proprement vos sorties.

\`\`\`python
# 1. Méthodes d'agrégation sur une Series Pandas (ddof=1 par défaut pour .std)
moyenne = df['cac40_rendement'].mean()
volatilite_bessel = df['cac40_rendement'].std(ddof=1)

# 2. Comparaison explicite avec l'estimateur biaisé (ddof=0, défaut de np.std)
volatilite_mle = df['cac40_rendement'].std(ddof=0)

# 3. Conversion explicite en float Python natif pour un affichage propre
print(f"Moy={float(moyenne):.2f} % | Bessel={float(volatilite_bessel):.2f} % | MLE={float(volatilite_mle):.2f} %")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Calculons sur \`df['cac40_rendement']\` le rendement trimestriel moyen, l'impact de la correction de Bessel (\`ddof=1\` vs \`ddof=0\`) et la volatilité annualisée ($\\times \\sqrt{4}$) :

\`\`\`python
import numpy as np

r = df['cac40_rendement']
moy = r.mean()
vol_bessel = r.std(ddof=1)
vol_pop = r.std(ddof=0)
vol_ann = vol_bessel * np.sqrt(4)
print(f"Moyenne trimestrielle : {moy:.2f} %")
print(f"Volatilité (ddof=1)   : {vol_bessel:.2f} % | Volatilité (ddof=0) : {vol_pop:.2f} %")
print(f"Volatilité annualisée : {vol_ann:.2f} %")
\`\`\`

\`\`\`text
Moyenne trimestrielle : 1.99 %
Volatilité (ddof=1)   : 11.02 % | Volatilité (ddof=0) : 10.67 %
Volatilité annualisée : 22.05 %
\`\`\`

Avec une volatilité trimestrielle de $11.02\\%$ (soit $22.05\\%$ annualisée), le CAC 40 sur 2020–2023 affiche une dispersion historique élevée liée au krach et au rebond Covid.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Calculez la moyenne empirique de \`df['cac40_rendement']\` dans **\`moy_cac\`**.
2. Calculez son écart-type corrigé de Bessel (\`.std()\`) dans **\`vol_cac\`**.
3. Affichez ces deux statistiques avec un formatage lisible à 2 décimales.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "moy_cac = df['cac40_rendement'].mean()\nvol_cac = df['cac40_rendement'].std()\nprint(f'Moyenne CAC 40 : {moy_cac:.2f} % | Volatilité : {vol_cac:.2f} %')",
      testPythonCode: "assert 'moy_cac' in globals() and 'vol_cac' in globals()\nassert abs(vol_cac - df['cac40_rendement'].std()) < 1e-9",
      hints: ["Utilisez .mean() et .std() sur df['cac40_rendement']."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, l'espérance et le risque total du CAC 40 sont estimés par la moyenne empirique $\\bar{R} = \\frac{1}{T}\\sum R_t$ et l'écart-type corrigé de Bessel $\\hat{\\sigma} = \\sqrt{\\frac{1}{T-1}\\sum (R_t - \\bar{R})^2}$. Sur la colonne \`df['cac40_rendement']\` de \`df\` (\`macro_taux\`), \`.mean()\` donne **\`moy_cac\`** et \`.std()\` (qui divise par $T-1$ via \`ddof=1\` par défaut) donne **\`vol_cac\`**, vérifié exactement par \`testPythonCode\`.`,
        stepByStepPlan: [
          `Extrayez la série \`df['cac40_rendement']\` et calculez sa moyenne arithmétique avec \`.mean()\` dans la variable \`moy_cac\`.`,
          `Calculez son écart-type sans biais avec \`.std()\` (correction de Bessel \`ddof=1\` par défaut en Pandas) dans la variable \`vol_cac\`.`,
          `Affichez \`moy_cac\` et \`vol_cac\` formatés à $2$ décimales à l'aide d'une *f-string*.`,
        ],
        concepts: [
          {
            symbol: "df['cac40_rendement']",
            kind: "Colonne / Table",
            roleInExercise: "Série Pandas (`pd.Series`) extraite du DataFrame préchargé `df` contenant les $16$ rendements trimestriels du CAC 40 (%).",
          },
          {
            symbol: ".mean()",
            kind: "Fonction / Méthode",
            roleInExercise: "Méthode d'agrégation calculant la moyenne empirique $\\bar{R}$ de la série.",
          },
          {
            symbol: ".std()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule l'écart-type corrigé de Bessel (`ddof=1` par défaut, diviseur $T-1$), contrairement à `np.std()` qui utilise `ddof=0` (diviseur $T$).",
          },
          {
            symbol: "moy_cac",
            kind: "Variable",
            roleInExercise: "Scalaire flottant stockant le rendement trimestriel moyen exigé par la validation.",
          },
          {
            symbol: "vol_cac",
            kind: "Variable",
            roleInExercise: "Scalaire flottant stockant la volatilité trimestrielle, comparé à `df['cac40_rendement'].std()` par `testPythonCode`.",
          },
          {
            symbol: "f'... {var:.2f} %'",
            kind: "Syntaxe",
            roleInExercise: "Chaîne formatée (*f-string*) injectant la valeur numérique entre `{...}` avec arrondi à $2$ décimales (`:.2f`).",
          },
        ],
        guidedCode: `# Étape 1 : Calculer la moyenne trimestrielle du CAC 40
moy_cac = df['A_COMPLETER'].___()

# Étape 2 : Calculer la volatilité corrigée de Bessel (ddof=1 par défaut en Pandas)
vol_cac = df['A_COMPLETER'].___()

# Étape 3 : Afficher les deux statistiques à 2 décimales avec une f-string
print(f"Moyenne CAC 40 : {___:.2f} % | Volatilité : {___:.2f} %")`,
      },
    },
    {
      id: "py-31",
      title: "5. Quantiles de tension du Spread de Crédit (.quantile)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Calculez le 10e centile (marché calme) et le 90e centile (stress crédit) du spread BBB.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Quantiles Empiriques et Interpolation des Queues de Crédit

Sur le marché obligataire *Investment Grade*, le **spread de crédit BBB** mesure la prime de rendement exigée au-dessus du taux sans risque souverain pour compenser le risque de défaut, le risque de dégradation (*downgrade*) et l'illiquidité. Comme les spreads sont bornés inférieurement (jamais négatifs) mais peuvent exploser en crise, leur distribution est asymétrique à droite : les **quantiles empiriques** décrivent mieux ces régimes que l'écart-type.

Étant donnée la fonction de répartition empirique $\\hat{F}_T(x) = \\frac{1}{T}\\sum_{t=1}^T \\mathbf{1}_{\\{X_t \\le x\\}}$, le quantile d'ordre $\\alpha \\in (0, 1)$ est défini par l'inverse généralisé :

$$
q_\\alpha = \\inf \\{ x \\in \\mathbb{R} : \\hat{F}_T(x) \\ge \\alpha \\}
$$

Pour un échantillon fini trié $x_0 \\le x_1 \\le \\dots \\le x_{T-1}$ (indexé à partir de $0$), Pandas et NumPy utilisent par défaut l'**interpolation linéaire de Hyndman-Fan (type 7)** à la position continue $k = (T - 1)\\alpha$ :

$$
q_\\alpha = x_{\\lfloor k \\rfloor} + (k - \\lfloor k \\rfloor)\\left(x_{\\lceil k \\rceil} - x_{\\lfloor k \\rfloor}\\right)
$$

Pour $T = 16$ et $\\alpha = 0.10$, on obtient $k = 15 \\times 0.10 = 1.5$ : le 10e centile est exactement la demi-somme des 2e et 3e plus petits spreads observés ($x_1 = 0.85\\%$ et $x_2 = 0.88\\%$, soit $0.865\\%$).

> 💡 **Intuition Actuariat & Solvabilité II : Surveillance des queues de spread**
>
> Le 10e centile ($q_{0.10}$) caractérise un marché **complaisant** où la prime de risque de crédit est comprimée, tandis que le 90e centile ($q_{0.90}$) balise le seuil d'entrée en **stress crédit** servant à calibrer les réserves et les bornes d'alerte SCR Spread.

### 💻 Masterclass Python

La méthode \`.quantile(q)\` accepte soit un flottant unique (\`0.10\`, retournant un \`float\`), soit une liste de quantiles (\`[0.10, 0.50, 0.90]\`, retournant une \`pd.Series\` indexée par chaque seuil). Le paramètre \`interpolation\` permet au besoin de passer de \`'linear'\` (défaut) à \`'lower'\`, \`'higher'\` ou \`'midpoint'\` selon la norme de reporting prudentiel.

\`\`\`python
# 1. Appel vectoriel avec une liste de quantiles : retourne une Series indexée
seuils = df['spread_credit_bbb'].quantile([0.10, 0.50, 0.90])

# 2. Extraction individuelle (retourne directement un scalaire float)
q10 = df['spread_credit_bbb'].quantile(0.10)
q90 = df['spread_credit_bbb'].quantile(0.90)

# 3. Écart inter-décile D9 - D1 (mesure robuste de l'amplitude des spreads)
amplitude_d9_d1 = q90 - q10
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions numériquement les quantiles du spread BBB sur \`df\` ainsi que le calcul exact par interpolation linéaire à la position $k = 1.5$ :

\`\`\`python
import numpy as np

s = df['spread_credit_bbb']
qs = s.quantile([0.10, 0.25, 0.50, 0.75, 0.90])
print("Quantiles du spread BBB :")
print(qs.round(4))
s_sorted = np.sort(s.values)
print("3 plus bas spreads :", s_sorted[:3], "-> moyenne(0.85, 0.88) =", (s_sorted[1] + s_sorted[2]) / 2)
\`\`\`

\`\`\`text
Quantiles du spread BBB :
0.10    0.8650
0.25    0.9375
0.50    1.3250
0.75    1.6050
0.90    1.7500
Name: spread_credit_bbb, dtype: float64
3 plus bas spreads : [0.82 0.85 0.88] -> moyenne(0.85, 0.88) = 0.865
\`\`\`

Le résultat \`0.8650\` coïncide au dix-millième près avec la formule d'interpolation linéaire entre \`0.85\` et \`0.88\`.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Calculez le 10e centile de \`df['spread_credit_bbb']\` dans **\`q10_spread\`**.
2. Calculez son 90e centile dans **\`q90_spread\`**.
3. Affichez les deux seuils (arrondis à 3 décimales).`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "q10_spread = df['spread_credit_bbb'].quantile(0.10)\nq90_spread = df['spread_credit_bbb'].quantile(0.90)\nprint(f'Décile bas (10%) : {q10_spread:.3f} % | Décile haut (90%) : {q90_spread:.3f} %')",
      testPythonCode: "assert 'q10_spread' in globals() and 'q90_spread' in globals()\nassert q10_spread < q90_spread",
      hints: ["df['spread_credit_bbb'].quantile(0.10) et .quantile(0.90)"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le 10e centile $q_{0.10}$ borne les régimes calmes de crédit et le 90e centile $q_{0.90}$ fixe le seuil d'entrée en stress crédit par interpolation linéaire de Hyndman-Fan. En Pandas sur \`df['spread_credit_bbb']\`, \`.quantile(0.10)\` et \`.quantile(0.90)\` implémentent directement cette formule pour définir **\`q10_spread\`** et **\`q90_spread\`**.`,
        stepByStepPlan: [
          `Appelez \`.quantile(0.10)\` sur \`df['spread_credit_bbb']\` pour calculer le 10e centile dans \`q10_spread\`.`,
          `Appelez \`.quantile(0.90)\` sur la même colonne pour calculer le 90e centile dans \`q90_spread\`.`,
          `Affichez \`q10_spread\` et \`q90_spread\` arrondis à $3$ décimales via une *f-string*.`,
        ],
        concepts: [
          {
            symbol: "df['spread_credit_bbb']",
            kind: "Colonne / Table",
            roleInExercise: "Colonne de `df` (`macro_taux`) mesurant le spread de crédit des obligations d'entreprises BBB en pourcentage.",
          },
          {
            symbol: ".quantile(q)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule le quantile empirique d'ordre $q$ par interpolation linéaire entre les valeurs triées voisines (`interpolation='linear'` par défaut).",
          },
          {
            symbol: "0.10 / 0.90",
            kind: "Paramètre",
            roleInExercise: "Probabilités cumulées comprises entre `0` et `1` passées à `.quantile()` (`0.10` pour le 10e centile, `0.90` pour le 90e centile — jamais `10` ni `90`).",
          },
          {
            symbol: "q10_spread",
            kind: "Variable",
            roleInExercise: "Scalaire représentant le 10e centile (marché complaisant) attendu par `testPythonCode`.",
          },
          {
            symbol: "q90_spread",
            kind: "Variable",
            roleInExercise: "Scalaire représentant le 90e centile (seuil de stress crédit) devant vérifier `q10_spread < q90_spread`.",
          },
          {
            symbol: "f'... {var:.3f} %'",
            kind: "Syntaxe",
            roleInExercise: "*f-string* formatant chaque quantile à $3$ décimales (`:.3f`) pour conserver la valeur interpolée exacte (`0.865`).",
          },
        ],
        guidedCode: `# Étape 1 : Calculer le 10e centile (paramètre 0.10) du spread BBB
q10_spread = df['A_COMPLETER'].___(0.10)

# Étape 2 : Calculer le 90e centile (paramètre 0.90) du spread BBB
q90_spread = df['A_COMPLETER'].___(___)

# Étape 3 : Afficher les deux bornes à 3 décimales
print(f"Décile bas (10%) : {___:.3f} % | Décile haut (90%) : {___:.3f} %")`,
      },
    },
    {
      id: "py-32",
      title: "6. Taux d'intérêt réel ex-post (Colonne dérivée)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Calculez le taux réel long via l'équation de Fisher simplifiée (OAT 10Y - Inflation).",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Équation Exacte de Fisher vs Approximation Linéaire

En économie financière, le rendement **nominal** $i_t$ d'une obligation d'État (OAT 10 ans) rémunère l'investisseur en euros courants, mais son pouvoir d'achat réel dépend du taux d'inflation réalisé $\\pi_t$. L'**équation exacte d'Irving Fisher** établit l'identité multiplicative entre le facteur de capitalisation nominal et le pouvoir d'achat :

$$
1 + i_t = (1 + r_t^{\\text{exact}})(1 + \\pi_t) \\implies r_t^{\\text{exact}} = \\frac{1 + i_t}{1 + \\pi_t} - 1 = \\frac{i_t - \\pi_t}{1 + \\pi_t}
$$

Par un développement limité de Taylor au premier ordre au voisinage de $\\pi_t = 0$ (en utilisant $\\frac{1}{1+\\pi_t} = 1 - \\pi_t + \\mathcal{O}(\\pi_t^2)$) :

$$
r_t^{\\text{exact}} = (i_t - \\pi_t)\\left(1 - \\pi_t + \\mathcal{O}(\\pi_t^2)\\right) = \\underbrace{i_t - \\pi_t}_{r_t^{\\text{linéaire}}} - \\pi_t(i_t - \\pi_t) + \\mathcal{O}(\\pi_t^3)
$$

L'approximation linéaire $r_t \\approx i_t - \\pi_t$ n'est donc précise que lorsque l'inflation est faible ($1\\%$–$2\\%$). Lors d'un choc inflationniste à $9.9\\%$ (\`2022-Q3\`), le terme quadratique d'erreur $\\varepsilon_{\\text{Fisher}} = r_t^{\\text{lin}} - r_t^{\\text{exact}} = \\frac{\\pi_t(i_t - \\pi_t)}{1 + \\pi_t}$ dépasse $0.64$ point de pourcentage !

> 💡 **Intuition ALM : Répression financière et érosion réelle du bilan**
>
> Lorsque $r_t < 0$ (ex. OAT 10Y à $0.89\\%$ contre $7.40\\%$ d'inflation en \`2022-Q1\`), le portefeuille obligataire subit une **répression financière** : la revalorisation nominale des contrats ou des provisions ne compense pas l'inflation, érodant la richesse réelle à long terme.

### 💻 Masterclass Python

Pandas permet l'arithmétique **vectorisée colonne à colonne** (\`df['c1'] - df['c2']\`) exécutée directement en C sur les tableaux NumPy sous-jacents, sans aucune boucle \`for\` Python.

Point d'attention sur les **unités** : dans \`df\`, \`oat_10y\` et \`inflation_hicp\` sont déjà exprimées en points de pourcentage (ex. \`7.40\` pour $7.40\\%$). Pour la soustraction linéaire, les unités s'additionnent directement (\`oat_10y - inflation_hicp\`), alors que pour la formule exacte de Fisher il faut d'abord diviser par \`100\` avant d'appliquer $\\frac{i - \\pi}{1 + \\pi}$.

\`\`\`python
# 1. Approximation linéaire de Fisher (en points de pourcentage)
df_copie = df.copy()
df_copie['taux_reel_lin'] = df_copie['oat_10y'] - df_copie['inflation_hicp']

# 2. Formule exacte de Fisher : nécessite de passer en décimales (/ 100)
i_dec = df_copie['oat_10y'] / 100.0
pi_dec = df_copie['inflation_hicp'] / 100.0
df_copie['taux_reel_exact'] = ((1.0 + i_dec) / (1.0 + pi_dec) - 1.0) * 100.0
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Comparons sur quatre trimestres contrastés de \`df\` (\`2020-Q4\`, \`2022-Q1\`, \`2022-Q3\`, \`2023-Q4\`) le taux réel linéaire et le taux réel exact de Fisher :

\`\`\`python
tmp = df[['periode', 'oat_10y', 'inflation_hicp']].copy()
tmp['reel_lineaire'] = tmp['oat_10y'] - tmp['inflation_hicp']
tmp['reel_fisher_exact'] = (((1 + tmp['oat_10y']/100) / (1 + tmp['inflation_hicp']/100)) - 1) * 100
tmp['ecart_pts'] = tmp['reel_lineaire'] - tmp['reel_fisher_exact']
print(tmp.iloc[[3, 8, 10, 15]].round(3).to_string(index=False))
\`\`\`

\`\`\`text
periode  oat_10y  inflation_hicp  reel_lineaire  reel_fisher_exact  ecart_pts
2020-Q4    -0.34            -0.3          -0.04             -0.040      0.000
2022-Q1     0.89             7.4          -6.51             -6.061     -0.449
2022-Q3     2.71             9.9          -7.19             -6.542     -0.648
2023-Q4     3.10             2.9           0.20              0.194      0.006
\`\`\`

En \`2020-Q4\` ($\\pi = -0.3\\%$) et \`2023-Q4\` ($i \\approx \\pi$), l'écart entre formule linéaire et exacte est quasi nul ; au pic de \`2022-Q3\` ($\\pi = 9.9\\%$), l'approximation linéaire surestime la perte réelle de $-0.648$ point.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Appliquez l'équation de Fisher simplifiée en créant directement la colonne **\`df['taux_reel'] = df['oat_10y'] - df['inflation_hicp']\`**.
2. Affichez \`df[['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']].head()\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "df['taux_reel'] = df['oat_10y'] - df['inflation_hicp']\nprint(df[['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']].head())",
      testPythonCode: "assert 'taux_reel' in df.columns\nassert abs(df['taux_reel'].iloc[0] - (df['oat_10y'].iloc[0] - df['inflation_hicp'].iloc[0])) < 1e-9",
      hints: ["df['taux_reel'] = df['oat_10y'] - df['inflation_hicp']"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le développement au premier ordre de l'équation de Fisher donne le taux d'intérêt réel linéarisé $r_t \\approx i_t - \\pi_t$. Comme \`oat_10y\` ($i_t$) et \`inflation_hicp\` ($\\pi_t$) sont toutes deux exprimées en points de pourcentage dans \`df\` (\`macro_taux\`), une simple soustraction vectorisée colonne à colonne crée la nouvelle colonne **\`df['taux_reel']\`** vérifiée par \`testPythonCode\`.`,
        stepByStepPlan: [
          `Soustrayez la colonne \`df['inflation_hicp']\` de \`df['oat_10y']\` de façon vectorisée (sans boucle \`for\`).`,
          `Affectez directement ce résultat dans une nouvelle colonne nommée \`taux_reel\` sur \`df\` (\`df['taux_reel'] = ...\`).`,
          `Affichez les $5$ premières lignes (\`.head()\`) des colonnes \`['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']\`.`,
        ],
        concepts: [
          {
            symbol: "df",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé `macro_taux` dans lequel vous ajoutez ici une colonne calculée.",
          },
          {
            symbol: "oat_10y / inflation_hicp",
            kind: "Colonne / Table",
            roleInExercise: "Colonnes numériques de `df` déjà exprimées en pourcentage (ex. `0.89` et `7.40` en `2022-Q1`).",
          },
          {
            symbol: "df['taux_reel'] = ...",
            kind: "Syntaxe",
            roleInExercise: "Affectation de colonne Pandas : crée `'taux_reel'` dans `df.columns`, nom exact exigé par les assertions de validation.",
          },
          {
            symbol: "- (soustraction vectorisée)",
            kind: "Syntaxe",
            roleInExercise: "Opère ligne par ligne simultanément sur les $16$ trimestres à la vitesse du C/NumPy.",
          },
          {
            symbol: ".head()",
            kind: "Fonction / Méthode",
            roleInExercise: "Renvoie les $5$ premières lignes du DataFrame (par défaut $n=5$) pour inspecter rapidement les valeurs calculées.",
          },
          {
            symbol: "[['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']]",
            kind: "Syntaxe",
            roleInExercise: "Doubles crochets limitant l'affichage console aux $4$ colonnes pertinentes.",
          },
        ],
        guidedCode: `# Étape 1 : Créer la colonne dérivée 'taux_reel' sur df (équation de Fisher simplifiée)
df['A_COMPLETER'] = df['A_COMPLETER'] - df['A_COMPLETER']

# Étape 2 : Afficher les 5 premières lignes des colonnes clés avec .head()
print(df[['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']].___())`,
      },
    },
    {
      id: "py-33",
      title: "7. Corrélation macro-crédit-actions (.corr)",
      category: "econometrics",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Examinez la corrélation croisée entre spread de crédit, croissance du PIB et CAC 40.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Corrélation de Pearson, Inégalité de Cauchy-Schwarz et Limites

En gestion multi-actifs et en modélisation macro-crédit, mesurer la co-évolution entre facteurs de marché permet d'évaluer le potentiel de **diversification**. Le coefficient de corrélation linéaire de Pearson entre deux séries $(X_t)$ et $(Y_t)$ normalise leur covariance empirique par le produit de leurs écarts-types :

$$
r_{X,Y} = \\frac{\\sum_{t=1}^T (X_t - \\bar{X})(Y_t - \\bar{Y})}{\\sqrt{\\sum_{t=1}^T (X_t - \\bar{X})^2}\\sqrt{\\sum_{t=1}^T (Y_t - \\bar{Y})^2}} = \\frac{\\langle \\tilde{X}, \\tilde{Y} \\rangle}{\\|\\tilde{X}\\|_2 \\, \\|\\tilde{Y}\\|_2} \\in [-1, +1]
$$

L'encadrement dans $[-1, +1]$ découle directement de l'**inégalité de Cauchy-Schwarz** : $r_{X,Y}$ s'interprète géométriquement comme le **cosinus de l'angle** $\\theta$ entre les vecteurs centrés $\\tilde{X}$ et $\\tilde{Y}$ dans $\\mathbb{R}^T$.

> ⚠️ **Limites critiques en Finance Quantitative :**
> 1. **Sensibilité aux outliers** : un seul point extrême (comme le confinement 2020-Q2 à $-11.8\\%$ de PIB ou 2020-Q1 à $-26.5\\%$ sur le CAC 40) peut écraser ou inverser la corrélation linéaire de Pearson. Il est sain de la confronter à la **corrélation de rangs de Spearman** ($\\rho_S$), robuste aux chocs extrêmes.
> 2. **Linéarité uniquement** : $r_{X,Y} = 0$ n'implique pas l'indépendance si la relation est quadratique ou à seuil.
> 3. **Non-causalité & tendances** : deux séries non stationnaires peuvent afficher $|r| > 0.90$ sans aucun lien économique réel.

### 💻 Masterclass Python

Sur un sous-DataFrame de $K$ variables numériques, \`.corr()\` calcule la matrice symétrique $(K \\times K)$ des corrélations par paires (avec \`1.0\` sur la diagonale). L'argument \`method\` permet de basculer instantanément entre \`'pearson'\` (linéaire, défaut), \`'spearman'\` (monotone sur les rangs) et \`'kendall'\` (concordance $\\tau$).

\`\`\`python
# 1. Sélection des variables macro-financières à auditer
variables = ['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']

# 2. Matrice de corrélation linéaire de Pearson (défaut)
corr_p = df[variables].corr(method='pearson')

# 3. Extraction d'un couple spécifique dans la matrice retournée
corr_spread_pib = corr_p.loc['spread_credit_bbb', 'pib_croissance']
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Comparons la matrice de **Pearson** et celle de **Spearman** (sur rangs) pour mesurer l'impact des chocs extrêmes de 2020 sur le lien spread crédit / croissance du PIB :

\`\`\`python
cols = ['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']
print("Corrélation de Pearson :")
print(df[cols].corr(method='pearson').round(3))
print("\\nCorrélation de Spearman (rangs) :")
print(df[cols].corr(method='spearman').round(3))
\`\`\`

\`\`\`text
Corrélation de Pearson :
                   spread_credit_bbb  pib_croissance  cac40_rendement
spread_credit_bbb              1.000          -0.183           -0.095
pib_croissance                -0.183           1.000           -0.067
cac40_rendement               -0.095          -0.067            1.000

Corrélation de Spearman (rangs) :
                   spread_credit_bbb  pib_croissance  cac40_rendement
spread_credit_bbb              1.000          -0.314           -0.068
pib_croissance                -0.314           1.000           -0.094
cac40_rendement               -0.068          -0.094            1.000
\`\`\`

En passant aux rangs de Spearman (insensibles à l'amplitude $+18.2\\%$ / $-11.8\\%$ du PIB), la relation négative entre croissance du PIB et spread de crédit BBB passe de $-0.183$ à $-0.314$, révélant le vrai lien contra-cyclique masqué par le rebond mécanique de 2020-Q3.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Calculez la matrice de corrélation de Pearson sur les colonnes \`['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']\` et stockez-la dans **\`corr_macro\`**.
2. Affichez \`corr_macro.round(3)\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "corr_macro = df[['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']].corr()\nprint(corr_macro.round(3))",
      testPythonCode: "assert 'corr_macro' in globals()\nassert corr_macro.shape == (3, 3)",
      hints: ["df[['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']].corr()"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le coefficient de corrélation linéaire de Pearson $r_{X,Y} \\in [-1, +1]$ mesure l'alignement géométrique (cosinus de l'angle) entre deux séries centrées. Sur un sous-DataFrame à $3$ colonnes de \`df\` (\`macro_taux\`), la méthode Pandas \`.corr()\` calcule toutes les corrélations par paires en une seule passe et renvoie la matrice symétrique $(3 \\times 3)$ attendue dans **\`corr_macro\`**.`,
        stepByStepPlan: [
          `Sélectionnez les $3$ colonnes \`['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']\` dans \`df\` avec doubles crochets.`,
          `Appelez \`.corr()\` (qui utilise Pearson par défaut) et affectez la matrice résultante $(3 \\times 3)$ à \`corr_macro\`.`,
          `Affichez \`corr_macro.round(3)\` dans \`print(...)\`.`,
        ],
        concepts: [
          {
            symbol: "df",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé `macro_taux` contenant les $16$ observations trimestrielles.",
          },
          {
            symbol: "[['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']]",
            kind: "Syntaxe",
            roleInExercise: "Doubles crochets sélectionnant les $3$ variables macro-financières sous forme de `DataFrame` (condition nécessaire pour obtenir une matrice carrée avec `.corr()`).",
          },
          {
            symbol: ".corr()",
            kind: "Fonction / Méthode",
            roleInExercise: "Méthode Pandas calculant la matrice de corrélation linéaire de Pearson (`method='pearson'` par défaut) avec `1.0` sur la diagonale.",
          },
          {
            symbol: "corr_macro",
            kind: "Variable",
            roleInExercise: "Matrice de corrélation $(3 \\times 3)$ exigée par `testPythonCode` (`assert corr_macro.shape == (3, 3)`).",
          },
          {
            symbol: ".round(3)",
            kind: "Fonction / Méthode",
            roleInExercise: "Arrondit les coefficients de corrélation à $3$ décimales lors de l'affichage.",
          },
        ],
        guidedCode: `# Étape 1 : Sélectionner les 3 colonnes dans df et calculer la matrice de corrélation
corr_macro = df[['A_COMPLETER', 'A_COMPLETER', 'A_COMPLETER']].___()

# Étape 2 : Afficher la matrice arrondie à 3 décimales
print(corr_macro.___(3))`,
      },
    },
    {
      id: "py-34",
      title: "8. Détection d'outliers bilatérale IQR sur le PIB",
      category: "data_prep",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Calculez les deux bornes de Tukey (basse et haute) sur pib_croissance pour repérer les chocs extrêmes.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Détection Robuste d'Outliers par Clôtures de Tukey

Pourquoi éviter le classique Z-score ($|x_t - \\bar{x}| > 2.5\\,s$) pour détecter des anomalies sur une série macroéconomique ? À cause de l'**effet de masquage** (*masking effect*) : une ou deux observations extrêmes (comme le choc Covid de 2020-Q2 à $-11.8\\%$ et le rebond de 2020-Q3 à $+18.2\\%$) gonflent énormément $\\bar{x}$ et $s$, ce qui réduit artificiellement les Z-scores de tous les points et masque les anomalies modérées !

John Tukey (1977) propose des seuils non-paramétriques fondés sur les quartiles, dotés d'un **point de rupture (*breakdown point*) de $25\\%$** (insensibles tant que moins d'un quart des données sont extrêmes) :

$$
IQR = Q_{75} - Q_{25}, \\qquad B_{\\text{bas}} = Q_{25} - 1.5 \\times IQR, \\qquad B_{\\text{haut}} = Q_{75} + 1.5 \\times IQR
$$

**Calibrage sous loi normale :** si $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, alors $Q_{25} \\approx \\mu - 0.6745\\,\\sigma$ et $Q_{75} \\approx \\mu + 0.6745\\,\\sigma$, soit $IQR \\approx 1.349\\,\\sigma$. Les clôtures de Tukey valent alors $\\mu \\pm (0.6745 + 1.5 \\times 1.349)\\sigma \\approx \\mu \\pm 2.698\\,\\sigma$, ne classant comme outliers que $0.7\\%$ des tirages gaussiens normaux.

> 💡 **Intuition Économétrie & Actuariat : Traiter les chocs structurels Covid**
>
> Sur \`pib_croissance\`, les trimestres hors $[B_{\\text{bas}}, B_{\\text{haut}}]$ correspondent aux confinements et réouvertures de 2020–2021. En modélisation MCO ou tarifaire, ces chocs hors-régime doivent être isolés (variables indicatrices ou winsorisation) pour ne pas distordre les pentes structurelles.

### 💻 Masterclass Python

Pour filtrer les valeurs situées à l'**extérieur** d'un intervalle $[B_{\\text{bas}}, B_{\\text{haut}}]$, deux idiomes Pandas équivalents existent :
- L'union logique explicite avec \`|\` et parenthèses obligatoires : \`df[(s < seuil_bas) | (s > seuil_haut)]\`.
- La négation vectorielle \`~\` de la méthode \`.between(seuil_bas, seuil_haut)\`, très lisible en revue de code (\`inclusive='both'\` par défaut).

\`\`\`python
# 1. Calcul des quartiles et de l'écart interquartile (IQR)
q25 = df['pib_croissance'].quantile(0.25)
q75 = df['pib_croissance'].quantile(0.75)
iqr = q75 - q25

# 2. Calcul des deux clôtures de Tukey
bas = q25 - 1.5 * iqr
haut = q75 + 1.5 * iqr

# 3. Filtrage bilatéral équivalent avec ~s.between(bas, haut)
masque_outliers = ~df['pib_croissance'].between(bas, haut)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Confrontons la règle de Tukey et la méthode du Z-score ($|z| > 2.0$) sur \`df['pib_croissance']\` pour observer l'effet de masquage en direct :

\`\`\`python
pib = df['pib_croissance']
q25, q75 = pib.quantile(0.25), pib.quantile(0.75)
iqr = q75 - q25
bas, haut = q25 - 1.5 * iqr, q75 + 1.5 * iqr
z = (pib - pib.mean()) / pib.std()
print(f"Tukey [{bas:.2f}, {haut:.2f}] -> {len(df[~pib.between(bas, haut)])} outliers")
print(f"Z-score (|z| > 2.0)   -> {int((z.abs() > 2.0).sum())} outliers (std gonflée = {pib.std():.2f}%)")
print(df.loc[~pib.between(bas, haut), ['periode', 'pib_croissance']].to_string(index=False))
\`\`\`

\`\`\`text
Tukey [-1.15, 1.65] -> 5 outliers
Z-score (|z| > 2.0)   -> 2 outliers (std gonflée = 5.84%)
periode  pib_croissance
2020-Q1            -5.4
2020-Q2           -11.8
2020-Q3            18.2
2020-Q4            -1.4
2021-Q3             3.3
\`\`\`

L'écart-type gonflé à $5.84\\%$ empêche le Z-score de repérer \`2020-Q1\` ($-5.4\\%$) ou \`2021-Q3\` ($+3.3\\%$), alors que l'intervalle robuste de Tukey $[-1.15, +1.65]$ identifie proprement les $5$ trimestres de rupture Covid.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur la colonne \`df['pib_croissance']\` :
1. Calculez \`q25\` (\`.quantile(0.25)\`), \`q75\` (\`.quantile(0.75)\`) et **\`iqr_pib = q75 - q25\`**.
2. Calculez **\`seuil_bas = q25 - 1.5 * iqr_pib\`** et **\`seuil_haut = q75 + 1.5 * iqr_pib\`**.
3. Filtrez les valeurs aberrantes (strictement inférieures à \`seuil_bas\` ou strictement supérieures à \`seuil_haut\`) dans **\`outliers_pib\`** puis affichez les bornes et \`outliers_pib[['periode', 'pib_croissance']]\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "q25 = df['pib_croissance'].quantile(0.25)\nq75 = df['pib_croissance'].quantile(0.75)\niqr_pib = q75 - q25\nseuil_bas = q25 - 1.5 * iqr_pib\nseuil_haut = q75 + 1.5 * iqr_pib\noutliers_pib = df[(df['pib_croissance'] < seuil_bas) | (df['pib_croissance'] > seuil_haut)]\nprint(f'Seuils Tukey : [{seuil_bas:.2f}, {seuil_haut:.2f}]')\nprint(outliers_pib[['periode', 'pib_croissance']])",
      testPythonCode: "assert 'iqr_pib' in globals() and 'outliers_pib' in globals()\nassert len(outliers_pib) >= 2",
      hints: ["seuil_bas = q25 - 1.5 * iqr_pib et seuil_haut = q75 + 1.5 * iqr_pib"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la règle robuste de Tukey définit l'écart interquartile $IQR = Q_{75} - Q_{25}$ et les deux clôtures $B_{\\text{bas}} = Q_{25} - 1.5\\times IQR$ et $B_{\\text{haut}} = Q_{75} + 1.5\\times IQR$. Ces formules se traduisent ligne par ligne sur \`df['pib_croissance']\` en **\`iqr_pib\`**, \`seuil_bas\` et \`seuil_haut\`, puis en filtrage bilatéral avec l'opérateur OU vectoriel **\`|\`** (entre parenthèses) pour isoler les chocs Covid dans **\`outliers_pib\`**.`,
        stepByStepPlan: [
          `Calculez \`q25 = df['pib_croissance'].quantile(0.25)\`, \`q75 = df['pib_croissance'].quantile(0.75)\` et \`iqr_pib = q75 - q25\`.`,
          `Définissez les deux bornes de Tukey : \`seuil_bas = q25 - 1.5 * iqr_pib\` et \`seuil_haut = q75 + 1.5 * iqr_pib\`.`,
          `Filtrez les lignes situées hors de cet intervalle en combinant les deux tests entre parenthèses avec \`|\` dans \`outliers_pib\`.`,
          `Affichez l'intervalle \`[seuil_bas, seuil_haut]\` via une *f-string* puis \`outliers_pib[['periode', 'pib_croissance']]\`.`,
        ],
        concepts: [
          {
            symbol: "df['pib_croissance']",
            kind: "Colonne / Table",
            roleInExercise: "Colonne de `df` (`macro_taux`) mesurant la croissance trimestrielle du PIB (%), marquée par les chocs de 2020 (`-11.8%` et `+18.2%`).",
          },
          {
            symbol: ".quantile(0.25) / .quantile(0.75)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule respectivement le 1er quartile ($Q_{25}$) et le 3e quartile ($Q_{75}$) pour éviter l'effet de masquage du Z-score.",
          },
          {
            symbol: "iqr_pib",
            kind: "Variable",
            roleInExercise: "Écart interquartile ($Q_{75} - Q_{25}$) exigé par la validation (`assert 'iqr_pib' in globals()`).",
          },
          {
            symbol: "seuil_bas / seuil_haut",
            kind: "Variable",
            roleInExercise: "Bornes basse et haute de Tukey ($Q_{25} - 1.5\\,\\text{IQR}$ et $Q_{75} + 1.5\\,\\text{IQR}$) encadrant la zone normale.",
          },
          {
            symbol: "| (vs or)",
            kind: "Syntaxe",
            roleInExercise: "Opérateur OU vectoriel élément par élément pour unir les deux queues ; le mot-clé `or` échoue sur des séries booléennes Pandas.",
          },
          {
            symbol: "(cond1) | (cond2)",
            kind: "Syntaxe",
            roleInExercise: "Parenthèses obligatoires autour de chaque inégalité avant `|` afin de respecter la priorité des opérateurs Python.",
          },
          {
            symbol: "outliers_pib",
            kind: "Variable",
            roleInExercise: "Sous-DataFrame des trimestres atypiques détectés (`len(outliers_pib) >= 2`, vaut $5$ lignes sur `df`).",
          },
        ],
        guidedCode: `# Étape 1 : Calculer Q25, Q75 et l'écart interquartile iqr_pib
q25 = df['pib_croissance'].___(0.25)
q75 = df['pib_croissance'].___(0.75)
iqr_pib = ___ - ___

# Étape 2 : Calculer les bornes basse et haute de Tukey
seuil_bas = q25 - 1.5 * ___
seuil_haut = q75 + 1.5 * ___

# Étape 3 : Filtrer avec | et des parenthèses autour de chaque condition
outliers_pib = df[(df['pib_croissance'] < ___) | (df['pib_croissance'] > ___)]

# Étape 4 : Afficher les bornes et les trimestres détectés
print(f"Seuils Tukey : [{seuil_bas:.2f}, {seuil_haut:.2f}]")
print(outliers_pib[['periode', 'pib_croissance']])`,
      },
    },
    {
      id: "py-35",
      title: "9. Agrégation Pandas .groupby sur df_actifs",
      category: "data_prep",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Utilisez df_actifs (préchargé) pour calculer le rendement espéré moyen et le bêta moyen par classe d'actif.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Stratification par Classe d'Actifs et Modèle MEDAF (CAPM)

En gestion de portefeuille, le tableau \`df_actifs\` recense $5$ instruments (\`TTE\`, \`BNP\`, \`MC\`, \`AI\`, \`CW8\`) répartis en deux classes d'actifs : \`Action\` (titres vifs) et \`ETF\` (indice diversifié MSCI World). Le modèle d'équilibre des actifs financiers (MEDAF / CAPM) relie l'espérance de rendement d'un actif $i$ à son **risque systématique** $\\beta_i$ :

$$
\\mathbb{E}[R_i] = r_f + \\beta_i \\left(\\mathbb{E}[R_m] - r_f\\right) + \\alpha_i, \\qquad \\beta_i = \\frac{\\operatorname{Cov}(R_i, R_m)}{\\operatorname{Var}(R_m)}
$$

Regrouper les titres par classe $g \\in \\{\\text{Action}, \\text{ETF}\\}$ revient à appliquer l'opérateur formel **Split-Apply-Combine** sur une partition disjointe $\\mathcal{I} = \\bigsqcup_{g} \\mathcal{I}_g$ :

$$
\\bar{\\mu}_g = \\frac{1}{|\\mathcal{I}_g|} \\sum_{i \\in \\mathcal{I}_g} \\mathbb{E}[R_i], \\qquad \\bar{\\beta}_g = \\frac{1}{|\\mathcal{I}_g|} \\sum_{i \\in \\mathcal{I}_g} \\beta_i
$$

> 💡 **Intuition Allocation d'Actifs : Bêta moyen identique, efficience différente**
>
> Lorsque la poche Actions affiche un bêta moyen $\\bar{\\beta} = 1.0$ tout comme l'ETF World, comparer le rendement espéré moyen, la volatilité idiosyncratique et le ratio de Sharpe moyen permet d'auditer si la sélection de titres actifs (*stock-picking*) rémunère réellement le risque spécifique assumé.

### 💻 Masterclass Python

L'équivalent Pandas du \`GROUP BY\` SQL repose sur \`.groupby('col_groupe')\` suivi d'une projection de colonnes et d'une fonction d'agrégation :
- \`df_actifs.groupby('classe_actif')[['c1', 'c2']].mean()\` utilise \`'classe_actif'\` comme index du DataFrame résultat (d'où la shape \`(2, 2)\` ici).
- Ajouter \`as_index=False\` conserve \`'classe_actif'\` comme colonne standard (utile avant un \`.merge()\`).
- Pour calculer plusieurs métriques hétérogènes en une passe, utilisez \`.agg(alias=('col', 'func'), ...)\` (agrégation nommée introduite dans Pandas $\\ge 0.25$).

\`\`\`python
# 1. Split-Apply-Combine classique : index = classe_actif, colonnes = 2 métriques
moyennes = df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()

# 2. Agrégation nommée multi-colonnes (style SQL SELECT COUNT(*), AVG(...))
resume_complet = df_actifs.groupby('classe_actif').agg(
    nb=('ticker', 'count'),
    rend_moy=('rendement_espere', 'mean'),
    vol_moy=('volatilite', 'mean'),
)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Exécutons une synthèse multi-critères sur le DataFrame préchargé \`df_actifs\` (nombre d'actifs, rendement espéré, bêta et ratio de Sharpe moyens par classe) :

\`\`\`python
synthese = df_actifs.groupby('classe_actif').agg(
    nb_actifs=('ticker', 'count'),
    rend_moyen=('rendement_espere', 'mean'),
    beta_moyen=('beta_marche', 'mean'),
    sharpe_moyen=('ratio_sharpe', 'mean')
)
print(synthese.round(4))
\`\`\`

\`\`\`text
              nb_actifs  rend_moyen  beta_moyen  sharpe_moyen
classe_actif                                                 
Action                4      0.0925         1.0        0.2975
ETF                   1      0.0820         1.0        0.3500
\`\`\`

À bêta moyen strictement identique ($1.00$), la poche \`Action\` offre un rendement espéré moyen supérieur ($9.25\\%$ vs $8.20\\%$), mais avec un ratio de Sharpe moyen inférieur ($0.2975$ vs $0.3500$) en raison d'une volatilité idiosyncratique non diversifiée.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

À partir du DataFrame **\`df_actifs\`** déjà préchargé dans votre environnement :
1. Groupez les lignes par \`'classe_actif'\` et calculez la moyenne des colonnes \`['rendement_espere', 'beta_marche']\`.
2. Stockez le tableau résultat (dimension \`(2, 2)\`) dans **\`stats_classe\`** et affichez \`stats_classe.round(4)\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "stats_classe = df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()\nprint(stats_classe.round(4))",
      testPythonCode: "assert 'stats_classe' in globals()\nassert stats_classe.shape[1] == 2 and len(stats_classe) == 2",
      hints: ["df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la stratégie *Split-Apply-Combine* partitionne l'univers d'actifs en groupes disjoints ($\\mathcal{I}_{\\text{Action}}$ et $\\mathcal{I}_{\\text{ETF}}$) pour calculer $\\bar{\\mu}_g$ et $\\bar{\\beta}_g$. Attention à la variable d'entrée : cet exercice travaille sur le DataFrame préchargé **\`df_actifs\`** (table \`portefeuilles_actifs\`, $5$ actifs) et non sur \`df\`. Enchaîner \`.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()\` produit **\`stats_classe\`** (dimension \`(2, 2)\`).`,
        stepByStepPlan: [
          `Groupez le DataFrame préchargé \`df_actifs\` par \`'classe_actif'\` via \`.groupby('classe_actif')\`.`,
          `Sélectionnez les deux colonnes \`['rendement_espere', 'beta_marche']\` avec doubles crochets sur l'objet groupé.`,
          `Appliquez \`.mean()\` et stockez le DataFrame \`(2, 2)\` dans \`stats_classe\`, puis affichez \`stats_classe.round(4)\`.`,
        ],
        concepts: [
          {
            symbol: "df_actifs",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame Pandas déjà préchargé en mémoire correspondant à la table `portefeuilles_actifs` ($5$ titres : `TTE`, `BNP`, `MC`, `AI`, `CW8`).",
          },
          {
            symbol: "classe_actif",
            kind: "Colonne / Table",
            roleInExercise: "Colonne catégorielle de `df_actifs` contenant `2` modalités (`'Action'` et `'ETF'`), ce qui explique `len(stats_classe) == 2`.",
          },
          {
            symbol: ".groupby('classe_actif')",
            kind: "Fonction / Méthode",
            roleInExercise: "Équivalent Pandas du `GROUP BY` SQL : sépare `df_actifs` en un groupe par classe d'actif (étape *Split*).",
          },
          {
            symbol: "[['rendement_espere', 'beta_marche']]",
            kind: "Syntaxe",
            roleInExercise: "Projection de $2$ colonnes numériques sur l'objet groupé pour restreindre le calcul de la moyenne (garantit `shape[1] == 2`).",
          },
          {
            symbol: ".mean()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la moyenne arithmétique dans chaque groupe et réassemble les lignes par `classe_actif` (étapes *Apply* et *Combine*).",
          },
          {
            symbol: "stats_classe",
            kind: "Variable",
            roleInExercise: "DataFrame résultat de taille `(2, 2)` vérifié par `testPythonCode`.",
          },
        ],
        guidedCode: `# Étape 1 : Grouper df_actifs par 'classe_actif', sélectionner les 2 colonnes et calculer .mean()
stats_classe = df_actifs.___('A_COMPLETER')[['A_COMPLETER', 'A_COMPLETER']].___()

# Étape 2 : Afficher les moyennes arrondies à 4 décimales
print(stats_classe.___(4))`,
      },
    },
    {
      id: "py-36",
      title: "10. OLS Simple sur le Spread de Crédit (sm.OLS)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Estimez le lien linéaire entre le spread de crédit BBB et l'inflation HICP.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Régression MCO Simple du Spread de Crédit sur l'Inflation

Pourquoi le spread des obligations *Corporate BBB* réagit-il au niveau d'inflation ? Lorsque l'inflation $\\pi_t$ accélère, la banque centrale resserre le crédit et le coût du refinancement des entreprises grimpe. Les émetteurs notés BBB (dernier échelon *Investment Grade*) deviennent plus vulnérables au risque de défaut et de déclassement en *High Yield*, ce qui pousse les investisseurs à exiger une prime de spread plus élevée.

On postule le modèle linéaire simple :

$$
y_t = \\beta_0 + \\beta_1 x_t + \\varepsilon_t, \\qquad y_t = \\text{spread\\_credit\\_bbb}_t, \\quad x_t = \\text{inflation\\_hicp}_t
$$

L'estimateur des **Moindres Carrés Ordinaires (MCO / OLS)** minimise la somme des carrés résiduelle $S(\\beta_0, \\beta_1) = \\sum_{t=1}^T (y_t - \\beta_0 - \\beta_1 x_t)^2$. En annulant le gradient $\\nabla S(\\hat{\\beta}_0, \\hat{\\beta}_1) = \\mathbf{0}$, on obtient les solutions analytiques fermées :

$$
\\hat{\\beta}_1 = \\frac{\\sum_{t=1}^T (x_t - \\bar{x})(y_t - \\bar{y})}{\\sum_{t=1}^T (x_t - \\bar{x})^2} = \\frac{\\widehat{\\operatorname{Cov}}(x, y)}{\\widehat{\\operatorname{Var}}(x)}, \\qquad \\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}
$$

> ⚠️ **Piège d'estimation : Oublier la constante $\\beta_0$**
>
> En Statsmodels, \`sm.OLS(y, df[['x']])\` **n'inclut pas de constante automatiquement** ! Supprimer $\\beta_0$ force la droite à passer par l'origine $(0, 0)$, ce qui biaise la pente $\\hat{\\beta}_1$, détruit la somme nulle des résidus et remplace le $R^2$ centré par un $R^2$ non centré artificiellement gonflé.

### 💻 Masterclass Python

Deux règles d'or dans l'API \`statsmodels.api\` (\`import statsmodels.api as sm\`) :
1. **Ordre des arguments inversé par rapport à scikit-learn** : \`sm.OLS(endog=y, exog=X)\` attend la variable expliquée \`y\` en premier, et la matrice des régresseurs \`X\` en second.
2. **Ajout explicite de la colonne \`'const'\`** : passez toujours un DataFrame \`df[['inflation_hicp']]\` à \`sm.add_constant(...)\` pour obtenir un DataFrame \`X\` à 2 colonnes (\`const\`, \`inflation_hicp\`), puis enchaînez \`.fit()\` pour calculer l'estimation.

\`\`\`python
import statsmodels.api as sm

# 1. Construction de X avec colonne de 1.0 ('const') et de la cible y
X = sm.add_constant(df[['inflation_hicp']])
y = df['spread_credit_bbb']

# 2. Instanciation OLS(y, X) suivie de l'estimation .fit()
resultat = sm.OLS(y, X).fit()

# 3. Lecture du tableau économétrique complet (R², F-stat, t-stats, JB, DW)
print(resultat.summary())
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Mesurons concrètement l'effet catastrophique d'un oubli de \`sm.add_constant()\` sur la régression du spread BBB par rapport au modèle correctement spécifié :

\`\`\`python
import statsmodels.api as sm

X_c = sm.add_constant(df[['inflation_hicp']])
y = df['spread_credit_bbb']
m_c = sm.OLS(y, X_c).fit()
m_nc = sm.OLS(y, df[['inflation_hicp']]).fit()
print(f"Avec constante : const={m_c.params['const']:.4f}, pente={m_c.params['inflation_hicp']:.4f}, R2={m_c.rsquared:.4f}")
print(f"Sans constante : pente={m_nc.params['inflation_hicp']:.4f}, R2_non_centre={m_nc.rsquared:.4f}")
\`\`\`

\`\`\`text
Avec constante : const=1.0066, pente=0.0728, R2=0.4493
Sans constante : pente=0.2203, R2_non_centre=0.7509
\`\`\`

Sans constante, la pente est multipliée par $3$ ($0.2203$ contre $0.0728$) et le $R^2$ non centré affiche un illusoire $0.7509$ !
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Sur le DataFrame préchargé \`df\` :
1. Importez \`statsmodels.api as sm\`.
2. Construisez \`X = sm.add_constant(df[['inflation_hicp']])\` et \`y = df['spread_credit_bbb']\`.
3. Estimez **\`model_spread = sm.OLS(y, X).fit()\`** et affichez \`model_spread.summary()\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']])\ny = df['spread_credit_bbb']\nmodel_spread = sm.OLS(y, X).fit()\nprint(model_spread.summary())",
      testPythonCode: "assert 'model_spread' in globals()\nassert len(model_spread.params) == 2",
      hints: ["model_spread = sm.OLS(df['spread_credit_bbb'], sm.add_constant(df[['inflation_hicp']])).fit()"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le modèle linéaire $y_t = \\beta_0 + \\beta_1 x_t + \\varepsilon_t$ relie \`spread_credit_bbb\` ($y_t$) à \`inflation_hicp\` ($x_t$) plus une ordonnée à l'origine $\\beta_0$. En Statsmodels sur \`df\` (\`macro_taux\`), il faut **impérativement** ajouter la constante avec \`sm.add_constant(...)\` (car \`sm.OLS\` n'en met pas seul), passer \`y\` en **1er argument** et \`X\` en **2e argument** à \`sm.OLS(y, X)\`, puis appeler \`.fit()\` pour obtenir **\`model_spread\`** ($2$ paramètres).`,
        stepByStepPlan: [
          `Importez la bibliothèque économétrique avec \`import statsmodels.api as sm\`.`,
          `Construisez la matrice des régresseurs \`X = sm.add_constant(df[['inflation_hicp']])\` (ajoute la colonne \`'const'\`) et la cible \`y = df['spread_credit_bbb']\`.`,
          `Instanciez et estimez le modèle MCO via \`model_spread = sm.OLS(y, X).fit()\`, puis affichez \`model_spread.summary()\`.`,
        ],
        concepts: [
          {
            symbol: "import statsmodels.api as sm",
            kind: "Syntaxe",
            roleInExercise: "Importe Statsmodels sous son alias conventionnel `sm` (ce module n'est pas pré-importé au démarrage du notebook).",
          },
          {
            symbol: "sm.add_constant(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Insère une colonne de `1.0` nommée `'const'` pour estimer $\\beta_0$ ; sans elle, la droite passe de force par $(0, 0)$ et fausse pente et $R^2$.",
          },
          {
            symbol: "df[['inflation_hicp']]",
            kind: "Syntaxe",
            roleInExercise: "Doubles crochets conservant un `DataFrame` 2D avec le nom de colonne `'inflation_hicp'` lors du passage à `sm.add_constant()`.",
          },
          {
            symbol: "X / y",
            kind: "Variable",
            roleInExercise: "Respectivement la matrice explicative `(16, 2)` (`const` + `inflation_hicp`) et la série cible `df['spread_credit_bbb']`.",
          },
          {
            symbol: "sm.OLS(y, X)",
            kind: "Fonction / Méthode",
            roleInExercise: "Construit le modèle Moindres Carrés Ordinaires. Piège classique : `y` (expliquée) vient toujours avant `X` (explicatives).",
          },
          {
            symbol: ".fit()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule l'estimateur $\\hat{\\beta} = (X'X)^{-1}X'y$ et retourne l'objet résultat ajusté.",
          },
          {
            symbol: "model_spread",
            kind: "Variable",
            roleInExercise: "Modèle ajusté attendu par la validation (`len(model_spread.params) == 2`) et dont `.summary()` imprime le tableau économétrique.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels sous l'alias sm
import statsmodels.api as sm

# Étape 2 : Préparer X (avec constante) et la variable expliquée y
X = sm.___(df[['A_COMPLETER']])
y = df['A_COMPLETER']

# Étape 3 : Estimer model_spread = sm.OLS(y, X).fit() et afficher le résumé
model_spread = sm.OLS(___, ___).___()
print(model_spread.___())`,
      },
    },
    {
      id: "py-37",
      title: "11. Extraction de l'ordonnée et de la pente (.params)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Extrayez individuellement alpha (const) et beta (pente de l'inflation) depuis model_spread.params.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Interprétation Économique des Paramètres Estimés

Une fois le modèle $\\widehat{\\text{spread}}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 \\cdot \\pi_t$ ajusté sur données trimestrielles, chaque paramètre possède une signification financière précise en **points de pourcentage** (et en points de base, $1\\% = 100\\text{ bps}$) :

- **Ordonnée à l'origine $\\hat{\\beta}_0$ (\`const\`)** : c'est la valeur prédite du spread lorsque l'inflation vaut zéro ($\\pi_t = 0\\%$). Elle représente la **prime de risque de crédit structurelle** exigée par le marché sur une obligation BBB en environnement de stabilité des prix (environ $1.007\\%$, soit $\\approx 101\\text{ bps}$).
- **Pente marginale $\\hat{\\beta}_1$ (\`inflation_hicp\`)** : c'est la dérivée partielle du spread conditionnel par rapport à l'inflation :

$$
\\hat{\\beta}_1 = \\frac{\\partial \\, \\widehat{\\text{spread}}_t}{\\partial \\, \\pi_t} \\approx +0.0728
$$

Une accélération de $+1$ point de pourcentage d'inflation est associée en moyenne à un écartement du spread BBB de $+0.0728$ point, soit **$\\approx +7.3\\text{ bps}$**.

> 💡 **Propriété géométrique fondamentale : Passage par le barycentre**
>
> D'après la première équation normale $\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$, la droite estimée par MCO passe **toujours exactement** par le point moyen $(\\bar{x}, \\bar{y}) = (\\bar{\\pi}, \\overline{\\text{spread}})$.

### 💻 Masterclass Python

L'attribut \`model.params\` est une **\`pd.Series\`** dont l'index reprend fidèlement les noms des colonnes de \`X\` (\`'const'\`, \`'inflation_hicp'\`).

Bonne pratique d'ingénierie : \`model.params['const']\` renvoie un type NumPy \`np.float64\`. L'envelopper dans \`float(...)\` garantit un scalaire Python natif propre, indispensable pour la sérialisation JSON, les API ou les assertions strictes.

\`\`\`python
import statsmodels.api as sm

# 1. Estimation autonome du modèle
X = sm.add_constant(df[['inflation_hicp']])
model = sm.OLS(df['spread_credit_bbb'], X).fit()

# 2. Indexation par nom sur la Series .params + cast explicite en float Python
alpha = float(model.params['const'])
beta = float(model.params['inflation_hicp'])

# 3. Traduction en points de base (bps)
print(f"Prime structurelle : {alpha * 100:.1f} bps | Sensibilité : +{beta * 100:.2f} bps / pt d'inflation")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions numériquement sur \`df\` que la droite MCO passe exactement par le barycentre $(\\bar{\\pi}, \\overline{\\text{spread}})$ :

\`\`\`python
import statsmodels.api as sm

X = sm.add_constant(df[['inflation_hicp']])
m = sm.OLS(df['spread_credit_bbb'], X).fit()
alpha = float(m.params['const'])
beta = float(m.params['inflation_hicp'])
pi_moy = float(df['inflation_hicp'].mean())
sp_moy = float(df['spread_credit_bbb'].mean())
print(f"alpha = {alpha:.4f} | beta = {beta:.4f}")
print(f"alpha + beta * E[pi] = {alpha + beta * pi_moy:.4f} | E[spread] = {sp_moy:.4f}")
\`\`\`

\`\`\`text
alpha = 1.0066 | beta = 0.0728
alpha + beta * E[pi] = 1.3125 | E[spread] = 1.3125
\`\`\`

Les deux membres sont rigoureusement égaux à \`1.3125\` ($131.25\\text{ bps}$ de spread moyen sur la période).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Rédigez un **script autonome** sur \`df\` :
1. Importez \`statsmodels.api as sm\` et estimez \`model_spread = sm.OLS(df['spread_credit_bbb'], sm.add_constant(df[['inflation_hicp']])).fit()\`.
2. Extrayez **\`alpha_spread = float(model_spread.params['const'])\`** et **\`beta_inf = float(model_spread.params['inflation_hicp'])\`**.
3. Affichez ces deux paramètres.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']])\nmodel_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\nalpha_spread = float(model_spread.params['const'])\nbeta_inf = float(model_spread.params['inflation_hicp'])\nprint(f'Alpha = {alpha_spread:.4f} | Beta inflation = {beta_inf:.4f}')",
      testPythonCode: "assert 'alpha_spread' in globals() and 'beta_inf' in globals()\nassert beta_inf > 0",
      hints: ["Utilisez model_spread.params['const'] et model_spread.params['inflation_hicp']."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la droite estimée s'écrit $\\widehat{\\text{spread}}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 \\pi_t$. Attention : **chaque exercice s'exécute de manière autonome** (n'assumez pas que \`model_spread\` de l'exercice précédent existe déjà). Vous devez ré-estimer \`model_spread\` sur \`df\`, puis extraire les deux entrées de la série \`model_spread.params\` : \`'const'\` dans **\`alpha_spread\`** et \`'inflation_hicp'\` dans **\`beta_inf\`**.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\`, construisez \`X = sm.add_constant(df[['inflation_hicp']])\` et ré-estimez \`model_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\`.`,
          `Extrayez l'ordonnée à l'origine via \`float(model_spread.params['const'])\` dans \`alpha_spread\`.`,
          `Extrayez la pente via \`float(model_spread.params['inflation_hicp'])\` dans \`beta_inf\`.`,
          `Affichez les deux paramètres à $4$ décimales à l'aide d'une *f-string*.`,
        ],
        concepts: [
          {
            symbol: "import statsmodels.api as sm",
            kind: "Syntaxe",
            roleInExercise: "À inclure systématiquement car chaque laboratoire est un script indépendant devant ré-estimer `model_spread`.",
          },
          {
            symbol: "sm.add_constant(df[['inflation_hicp']])",
            kind: "Fonction / Méthode",
            roleInExercise: "Crée la colonne `'const'` à côté de `'inflation_hicp'` ; ces deux noms deviennent exactement les clés d'index de `.params`.",
          },
          {
            symbol: "model_spread",
            kind: "Variable",
            roleInExercise: "Modèle MCO `spread_credit_bbb ~ const + inflation_hicp` ré-estimé localement.",
          },
          {
            symbol: ".params",
            kind: "Paramètre",
            roleInExercise: "Attribut de type `pd.Series` contenant les coefficients estimés $\\hat{\\beta}$, indexés par `'const'` et `'inflation_hicp'`.",
          },
          {
            symbol: "float(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit le type interne NumPy (`np.float64`) renvoyé par `.params[...]` en flottant Python natif.",
          },
          {
            symbol: "alpha_spread / beta_inf",
            kind: "Variable",
            roleInExercise: "Scalaires exigés par `testPythonCode` ($\\hat{\\beta}_0 \\approx 1.0066$ et $\\hat{\\beta}_1 \\approx 0.0728 > 0$).",
          },
        ],
        guidedCode: `# Étape 1 : Ré-estimer de manière autonome le modèle OLS sur df
import statsmodels.api as sm
X = sm.add_constant(df[['A_COMPLETER']])
model_spread = sm.OLS(df['A_COMPLETER'], X).fit()

# Étape 2 : Extraire 'const' et 'inflation_hicp' depuis model_spread.params
alpha_spread = float(model_spread.params['A_COMPLETER'])
beta_inf = float(model_spread.params['A_COMPLETER'])

# Étape 3 : Afficher les deux coefficients
print(f"Alpha = {___:.4f} | Beta inflation = {___:.4f}")`,
      },
    },
    {
      id: "py-38",
      title: "12. Test de Student et décision au seuil 5 % (.tvalues, .pvalues)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Vérifiez si l'effet de l'inflation sur le spread BBB est statistiquement significatif à 5 %.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Test de Student en Petit Échantillon

Un coefficient estimé $\\hat{\\beta}_1 = +0.0728$ peut-il être le fruit du pur hasard sur $T = 16$ trimestres ? Pour en décider, on soumet le paramètre au **test de significativité individuelle de Student** :

$$
H_0 : \\beta_1 = 0 \\quad (\\text{aucun effet de l'inflation}), \\qquad H_1 : \\beta_1 \\neq 0
$$

Sous les hypothèses classiques de Gauss-Markov et normalité des erreurs $\\varepsilon \\sim \\mathcal{N}(0, \\sigma^2 I_T)$, l'estimateur de la variance résiduelle est $\\hat{s}^2 = \\frac{SCR}{T - K - 1}$ (avec $K = 1$ variable explicative, donc $\\nu = 16 - 1 - 1 = 14$ degrés de liberté). En standardisant $\\hat{\\beta}_1$ par son erreur-type estimée $\\widehat{\\operatorname{SE}}(\\hat{\\beta}_1) = \\sqrt{\\hat{s}^2 [(X'X)^{-1}]_{11}}$, la statistique suit exactement une **loi de Student à $\\nu = 14$ degrés de liberté** sous $H_0$ :

$$
t = \\frac{\\hat{\\beta}_1 - 0}{\\widehat{\\operatorname{SE}}(\\hat{\\beta}_1)} \\sim \\mathcal{T}(14)
$$

> ⚠️ **Attention au seuil critique sur petit échantillon ($T = 16$) !**
>
> La règle mnémotechnique $|t| > 1.96$ n'est qu'une approximation asymptotique ($\\nu \\to \\infty$). À $\\nu = 14$ degrés de liberté, les queues de la loi de Student sont plus épaisses : le seuil critique exact au risque $\\alpha = 5\\%$ bilatéral vaut **$t_{0.975,\\,14} \\approx 2.145$**. La p-valeur exacte s'obtient par $p = 2\\,\\mathbb{P}(T_{14} > |t_{\\text{obs}}|)$.

![Test de Student et Zone de Rejet](/images/theory/fig_v1_student_test.png)

### 💻 Masterclass Python

Statsmodels expose directement les \`pd.Series\` \`.tvalues\`, \`.bse\` (erreurs-types) et \`.pvalues\`.

Piège Python subtil mais crucial lors des tests unitaires automatisés (\`assert est_significatif is True\`) :
- Une comparaison sur une variable NumPy comme \`model.pvalues['inflation_hicp'] < 0.05\` renvoie un objet **\`np.bool_(True)\`**, et non un \`bool\` Python natif !
- Or en Python, \`np.bool_(True) is True\` évalue à **\`False\`** (identité mémoire différente). Enveloppez toujours le test dans **\`bool(...)\`** pour obtenir un booléen Python natif.

\`\`\`python
import statsmodels.api as sm

# 1. Ré-estimation complète dans ce script autonome
X = sm.add_constant(df[['inflation_hicp']])
model = sm.OLS(df['spread_credit_bbb'], X).fit()

# 2. Extraction avec conversion explicite (float et bool Python natifs)
t_stat = float(model.tvalues['inflation_hicp'])
p_val = float(model.pvalues['inflation_hicp'])
rejet_h0 = bool(p_val < 0.05)  # Garantit 'rejet_h0 is True' en Python
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions à la main l'identité $t = \\hat{\\beta}_1 / \\widehat{\\operatorname{SE}}(\\hat{\\beta}_1)$, la p-valeur exacte via \`scipy.stats.t\` ($\\nu = 14$), et le piège \`np.bool_ is True\` :

\`\`\`python
import statsmodels.api as sm
from scipy import stats

X = sm.add_constant(df[['inflation_hicp']])
m = sm.OLS(df['spread_credit_bbb'], X).fit()
b = float(m.params['inflation_hicp'])
se = float(m.bse['inflation_hicp'])
t_calc = b / se
p_calc = float(2 * stats.t.sf(abs(t_calc), df=int(m.df_resid)))
print(f"t manuel = {t_calc:.4f} | t Statsmodels = {m.tvalues['inflation_hicp']:.4f}")
print(f"p manuel = {p_calc:.4e} | p Statsmodels = {m.pvalues['inflation_hicp']:.4e}")
print(f"Type brut np.bool_ is True : { (m.pvalues['inflation_hicp'] < 0.05) is True } | bool(...) is True : { bool(m.pvalues['inflation_hicp'] < 0.05) is True }")
\`\`\`

\`\`\`text
t manuel = 3.3795 | t Statsmodels = 3.3795
p manuel = 4.4924e-03 | p Statsmodels = 4.4924e-03
Type brut np.bool_ is True : False | bool(...) is True : True
\`\`\`

Avec $t = 3.3795 > 2.145$ ($p = 0.00449 < 0.05$), l'impact de l'inflation sur le spread BBB est hautement significatif au seuil de $5\\%$.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Chaque exercice s'exécute dans un **script autonome** : pensez à ré-estimer \`model_spread\` avant d'extraire ses statistiques !
1. Importez \`statsmodels.api as sm\` et ajustez \`model_spread = sm.OLS(df['spread_credit_bbb'], sm.add_constant(df[['inflation_hicp']])).fit()\`.
2. Extrayez **\`t_inf = float(model_spread.tvalues['inflation_hicp'])\`** et **\`p_inf = float(model_spread.pvalues['inflation_hicp'])\`**.
3. Créez le booléen Python natif **\`est_significatif = bool(p_inf < 0.05)\`** et affichez le diagnostic.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']])\nmodel_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\nt_inf = float(model_spread.tvalues['inflation_hicp'])\np_inf = float(model_spread.pvalues['inflation_hicp'])\nest_significatif = bool(p_inf < 0.05)\nprint(f't-stat = {t_inf:.3f} | p-val = {p_inf:.4e} | Significatif (5%) : {est_significatif}')",
      testPythonCode: "assert 't_inf' in globals() and 'p_inf' in globals() and 'est_significatif' in globals()\nassert est_significatif is True",
      hints: ["t_inf = model_spread.tvalues['inflation_hicp'] et p_inf = model_spread.pvalues['inflation_hicp']."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le test de Student sous $H_0 : \\beta_1 = 0$ calcule $t = \\hat{\\beta}_1 / \\widehat{\\operatorname{SE}}(\\hat{\\beta}_1)$ et sa p-valeur bilatérale selon la loi $\\mathcal{T}(14)$ ($t_{0.975,14} \\approx 2.145$). Après avoir ré-estimé **\`model_spread\`** de façon autonome sur \`df\`, vous extrayez \`.tvalues['inflation_hicp']\` dans **\`t_inf\`**, \`.pvalues['inflation_hicp']\` dans **\`p_inf\`**, et convertissez la décision \`p_inf < 0.05\` en booléen Python natif **\`est_significatif\`** via \`bool(...)\` (indispensable car \`testPythonCode\` teste \`est_significatif is True\`).`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et ré-estimez \`model_spread\` (\`spread_credit_bbb ~ const + inflation_hicp\`) sur \`df\`.`,
          `Extrayez la statistique $t$ et la p-valeur de \`'inflation_hicp'\` depuis \`.tvalues\` et \`.pvalues\` dans \`t_inf\` et \`p_inf\`.`,
          `Évaluez le rejet de $H_0$ au seuil de $5\\%$ avec \`est_significatif = bool(p_inf < 0.05)\`.`,
          `Affichez \`t_inf\`, \`p_inf\` (notation scientifique \`:.4e\`) et \`est_significatif\`.`,
        ],
        concepts: [
          {
            symbol: "model_spread",
            kind: "Variable",
            roleInExercise: "Modèle OLS `spread_credit_bbb ~ const + inflation_hicp` à ré-estimer impérativement dans ce script autonome.",
          },
          {
            symbol: ".tvalues",
            kind: "Paramètre",
            roleInExercise: "Série Pandas des statistiques $t$ de Student pour chaque régresseur (indexée par `'const'` et `'inflation_hicp'`).",
          },
          {
            symbol: ".pvalues",
            kind: "Paramètre",
            roleInExercise: "Série Pandas des p-valeurs bilatérales exactes calculées sous la loi $\\mathcal{T}(T - K - 1)$.",
          },
          {
            symbol: "t_inf / p_inf",
            kind: "Variable",
            roleInExercise: "Scalaires flottants extraits et convertis via `float(...)`, vérifiés par `testPythonCode`.",
          },
          {
            symbol: "bool(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Garantit un `bool` Python pur (`True` / `False`) plutôt qu'un `np.bool_`, indispensable pour que `assert est_significatif is True` réussisse.",
          },
          {
            symbol: "est_significatif",
            kind: "Variable",
            roleInExercise: "Booléen de décision valant `True` si `p_inf < 0.05` (rejet de $H_0$ au seuil de $5\\%$).",
          },
          {
            symbol: "{p_inf:.4e}",
            kind: "Syntaxe",
            roleInExercise: "Spécificateur de *f-string* affichant une petite p-valeur en notation scientifique (`4.4924e-03`).",
          },
        ],
        guidedCode: `# Étape 1 : Ré-estimer model_spread dans un script autonome
import statsmodels.api as sm
X = sm.add_constant(df[['inflation_hicp']])
model_spread = sm.OLS(df['spread_credit_bbb'], X).fit()

# Étape 2 : Extraire la t-stat et la p-valeur pour 'inflation_hicp'
t_inf = float(model_spread.___['A_COMPLETER'])
p_inf = float(model_spread.___['A_COMPLETER'])

# Étape 3 : Prendre la décision au seuil de 5% en booléen Python natif
est_significatif = bool(___ < 0.05)

# Étape 4 : Afficher le diagnostic complet
print(f"t-stat = {t_inf:.3f} | p-val = {p_inf:.4e} | Significatif (5%) : {est_significatif}")`,
      },
    },
    {
      id: "py-39",
      title: "13. Intervalle de confiance des paramètres (.conf_int)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Calculez l'intervalle de confiance à 95 % de la pente entre l'OAT 10Y et l'Euribor 3M.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Intervalles de Confiance MCO et Dualité avec le Test $t$

En pilotage ALM, communiquer une sensibilité ponctuelle $\\hat{\\beta}_1 = 0.771$ de l'OAT 10 ans vis-à-vis de l'Euribor 3 mois est insuffisant : le comité des risques exige un **intervalle de confiance à $95\\%$** bornant l'incertitude d'estimation dans les scénarios conservateurs et optimistes.

Sous les hypothèses gaussiennes sur un échantillon de taille $T$ avec $K$ régresseurs ($\\nu = T - K - 1$ degrés de liberté), l'intervalle de confiance bilatéral au niveau $1 - \\alpha$ est centré sur $\\hat{\\beta}_j$ :

$$
IC_{1-\\alpha}(\\beta_j) = \\left[\\hat{\\beta}_j - t_{1-\\alpha/2,\\,\\nu} \\cdot \\widehat{\\operatorname{SE}}(\\hat{\\beta}_j), \\;\\; \\hat{\\beta}_j + t_{1-\\alpha/2,\\,\\nu} \\cdot \\widehat{\\operatorname{SE}}(\\hat{\\beta}_j)\\right]
$$

**Théorème de dualité Test / Intervalle de Confiance :**

$$
0 \\notin IC_{1-\\alpha}(\\beta_j) \\iff \\left|\\frac{\\hat{\\beta}_j}{\\widehat{\\operatorname{SE}}(\\hat{\\beta}_j)}\\right| > t_{1-\\alpha/2,\\,\\nu} \\iff \\text{p-valeur}_j < \\alpha
$$

Pour \`oat_10y ~ const + euribor_3m\`, l'intervalle de la pente $[0.5598,\\, 0.9816]$ exclut strictement $0$ (pente significativement positive) et montre qu'une hausse de $+100\\text{ bps}$ sur l'Euribor 3M se transmet à l'OAT 10 ans dans une fourchette probable de $+56$ à $+98\\text{ bps}$.

### 💻 Masterclass Python

La méthode \`model.conf_int(alpha=0.05)\` retourne un **\`pd.DataFrame\`** de dimension \`(K+1, 2)\` :
- L'index contient les noms des paramètres (\`'const'\`, \`'euribor_3m'\`).
- Les colonnes sont nommées par les **entiers \`0\` (borne inférieure)** et **\`1\` (borne supérieure)** — et non par les chaînes \`'0'\` et \`'1'\` !

Pour extraire une borne précise programmatiquement, utilisez donc \`.loc['euribor_3m', 0]\` et \`.loc['euribor_3m', 1]\`.

\`\`\`python
import statsmodels.api as sm

# 1. Estimation du modèle OAT 10 ans en fonction de l'Euribor 3 mois
X = sm.add_constant(df[['euribor_3m']])
model = sm.OLS(df['oat_10y'], X).fit()

# 2. Calcul de l'IC à 95% (alpha = 0.05) -> DataFrame à colonnes entières 0 et 1
ic = model.conf_int(alpha=0.05)

# 3. Extraction des bornes basse (0) et haute (1) pour la pente
borne_inf = float(ic.loc['euribor_3m', 0])
borne_sup = float(ic.loc['euribor_3m', 1])
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions le calcul exact de la borne à $95\\%$ via le quantile de Student \`stats.t.ppf(0.975, df=14)\` et comparons à l'IC à $99\\%$ (\`alpha=0.01\`) sur \`df\` :

\`\`\`python
import statsmodels.api as sm
from scipy import stats

X = sm.add_constant(df[['euribor_3m']])
m = sm.OLS(df['oat_10y'], X).fit()
t_crit = float(stats.t.ppf(0.975, df=int(m.df_resid)))
b1 = float(m.params['euribor_3m'])
se1 = float(m.bse['euribor_3m'])
print(f"Quantile t(0.975, ddl=14) = {t_crit:.4f}")
print(f"IC 95% manuel euribor_3m  : [{b1 - t_crit*se1:.4f}, {b1 + t_crit*se1:.4f}]")
print("IC 99% Statsmodels :\\n", m.conf_int(alpha=0.01).round(4))
\`\`\`

\`\`\`text
Quantile t(0.975, ddl=14) = 2.1448
IC 95% manuel euribor_3m  : [0.5598, 0.9816]
IC 99% Statsmodels :
                  0       1
const       0.1441  1.2523
euribor_3m  0.4780  1.0634
\`\`\`

Plus le niveau de confiance exigé augmente ($95\\% \\to 99\\%$), plus le quantile critique $t_{1-\\alpha/2, 14}$ croît et plus la fourchette s'élargit ($[0.4780,\\, 1.0634]$).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Importez \`statsmodels.api as sm\` et estimez **\`model = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m']])).fit()\`**.
2. Calculez les intervalles de confiance à $95\\%$ dans **\`ic_95 = model.conf_int(alpha=0.05)\`** (shape \`(2, 2)\`).
3. Affichez \`ic_95.round(4)\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nmodel = sm.OLS(df['oat_10y'], X).fit()\nic_95 = model.conf_int(alpha=0.05)\nprint('Intervalles de confiance à 95% :\\n', ic_95.round(4))",
      testPythonCode: "assert 'ic_95' in globals()\nassert ic_95.shape == (2, 2) and ic_95.loc['euribor_3m', 0] < ic_95.loc['euribor_3m', 1]",
      hints: ["ic_95 = model.conf_int(alpha=0.05)"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, l'intervalle de confiance bilatéral à $95\\%$ s'écrit $\\hat{\\beta}_j \\pm t_{0.975,\\,14}\\cdot \\widehat{\\operatorname{SE}}(\\hat{\\beta}_j)$. En Statsmodels sur le modèle \`oat_10y ~ const + euribor_3m\` estimé sur \`df\`, la méthode \`model.conf_int(alpha=0.05)\` calcule ces deux bornes pour chaque paramètre et renvoie le DataFrame **\`ic_95\`** de taille \`(2, 2)\` (colonnes entières \`0\` et \`1\`) vérifié par \`testPythonCode\`.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et préparez \`X = sm.add_constant(df[['euribor_3m']])\`.`,
          `Estimez le modèle de courbe des taux \`model = sm.OLS(df['oat_10y'], X).fit()\`.`,
          `Calculez l'intervalle de confiance à $95\\%$ avec \`ic_95 = model.conf_int(alpha=0.05)\` et affichez \`ic_95.round(4)\`.`,
        ],
        concepts: [
          {
            symbol: "df['oat_10y'] / df[['euribor_3m']]",
            kind: "Colonne / Table",
            roleInExercise: "Respectivement le taux souverain 10 ans (cible $y$) et le taux court Euribor 3 mois (régresseur $X$) dans `df`.",
          },
          {
            symbol: "sm.add_constant(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Ajoute `'const'` à `X`, ce qui donne $2$ lignes dans `ic_95` (`'const'` et `'euribor_3m'`).",
          },
          {
            symbol: "model",
            kind: "Variable",
            roleInExercise: "Résultat de la régression OLS `oat_10y ~ const + euribor_3m` estimé dans ce script autonome.",
          },
          {
            symbol: ".conf_int(alpha=0.05)",
            kind: "Fonction / Méthode",
            roleInExercise: "Retourne un `DataFrame` `(2, 2)` indexé par les noms des paramètres et dont les colonnes sont les **entiers** `0` (borne inférieure) et `1` (borne supérieure).",
          },
          {
            symbol: "alpha=0.05",
            kind: "Paramètre",
            roleInExercise: "Niveau de risque bilatéral ($5\\%$), correspondant à un taux de confiance $1 - \\alpha = 95\\%$ (`alpha=0.01` donnerait un IC à $99\\%$).",
          },
          {
            symbol: "ic_95",
            kind: "Variable",
            roleInExercise: "DataFrame résultat exigé par `testPythonCode` (`shape == (2, 2)` et `ic_95.loc['euribor_3m', 0] < ic_95.loc['euribor_3m', 1]`).",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et ajuster oat_10y ~ const + euribor_3m
import statsmodels.api as sm
X = sm.add_constant(df[['A_COMPLETER']])
model = sm.OLS(df['A_COMPLETER'], X).fit()

# Étape 2 : Calculer les intervalles de confiance à 95% (alpha=0.05)
ic_95 = model.___(alpha=___)

# Étape 3 : Afficher le tableau arrondi à 4 décimales
print("Intervalles de confiance à 95% :\\n", ic_95.___(4))`,
      },
    },
    {
      id: "py-40",
      title: "14. R² vs R² Ajusté lors de l'ajout d'une variable",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Comparez le pouvoir explicatif brut et ajusté entre 1 et 2 variables explicatives sur le spread.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Décomposition ANOVA et Pénalité du $R^2$ Ajusté ($\\bar{R}^2$)

À partir de l'identité de décomposition de variance $SCT = SCE + SCR$, où $SCT = \\sum_{t=1}^T (y_t - \\bar{y})^2$ et $SCR = \\sum_{t=1}^T \\hat{e}_t^2$, le coefficient de détermination brut s'écrit :

$$
R^2 = 1 - \\frac{SCR}{SCT} \\in [0, 1]
$$

**Piège du surapprentissage (*overfitting*) :** ajouter une nouvelle variable explicative dans un modèle imbriqué ne peut *jamais* augmenter $SCR$, même si cette variable n'est que du pur bruit blanc ! En conséquence, $R^2$ est mécaniquement croissant avec $K$. Pour arbitrer rigoureusement entre pouvoir explicatif et parcimonie, Henri Theil introduit le **$R^2$ ajusté ($\\bar{R}^2$)** qui pénalise les degrés de liberté via les variances non biaisées :

$$
\\bar{R}^2 = 1 - \\frac{SCR / (T - K - 1)}{SCT / (T - 1)} = 1 - (1 - R^2)\\frac{T - 1}{T - K - 1}
$$

**Critère algébrique exact de variation :** lors du passage de $K$ à $K + 1$ régresseurs, $\\bar{R}^2$ n'augmente strictement que si la statistique de Student de la variable ajoutée vérifie :

$$
|t_{K+1}| > 1 \\iff \\Delta \\bar{R}^2 > 0
$$

Si $|t_{K+1}| < 1$, la perte d'un degré de liberté pèse plus lourd que la baisse marginale du $SCR$, et $\\bar{R}^2$ **diminue** !

### 💻 Masterclass Python

En Statsmodels, comparer deux modèles imbriqués (\`m1\` avec $K=1$, \`m2\` avec $K=2$) s'effectue directement via les attributs scalaires \`.rsquared\`, \`.rsquared_adj\`, mais aussi les critères d'information \`.aic\` (Akaike) et \`.bic\` (Schwarz) — que l'on cherche au contraire à **minimiser**.

\`\`\`python
import statsmodels.api as sm

y = df['spread_credit_bbb']

# 1. Modèle parcimonieux (K = 1)
m1 = sm.OLS(y, sm.add_constant(df[['inflation_hicp']])).fit()

# 2. Modèle augmenté (K = 2) : réutilise la même cible y
m2 = sm.OLS(y, sm.add_constant(df[['inflation_hicp', 'cac40_rendement']])).fit()

# 3. Audit de parcimonie (R² ajusté et AIC)
gain_r2_adj = m2.rsquared_adj - m1.rsquared_adj
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Testons sur \`df\` l'ajout du rendement trimestriel du CAC 40 (\`cac40_rendement\`) pour expliquer \`spread_credit_bbb\`, et vérifions le critère $|t| < 1$ :

\`\`\`python
import statsmodels.api as sm

y = df['spread_credit_bbb']
m1 = sm.OLS(y, sm.add_constant(df[['inflation_hicp']])).fit()
m2 = sm.OLS(y, sm.add_constant(df[['inflation_hicp', 'cac40_rendement']])).fit()
print(f"M1 (K=1) -> R2={m1.rsquared:.4f} | R2_adj={m1.rsquared_adj:.4f} | AIC={m1.aic:.2f}")
print(f"M2 (K=2) -> R2={m2.rsquared:.4f} | R2_adj={m2.rsquared_adj:.4f} | AIC={m2.aic:.2f}")
print(f"t-stat cac40_rendement dans M2 = {m2.tvalues['cac40_rendement']:.4f} (|t| < 1 => R2_adj baisse !)")
\`\`\`

\`\`\`text
M1 (K=1) -> R2=0.4493 | R2_adj=0.4099 | AIC=7.25
M2 (K=2) -> R2=0.4510 | R2_adj=0.3666 | AIC=9.20
t-stat cac40_rendement dans M2 = -0.2045 (|t| < 1 => R2_adj baisse !)
\`\`\`

$R^2$ passe très légèrement de \`0.4493\` à \`0.4510\`, mais comme $|t_{\\text{CAC40}}| = 0.2045 < 1$, $\\bar{R}^2$ **chute** de \`0.4099\` à \`0.3666\` et l'AIC se dégrade ($7.25 \\to 9.20$) : le modèle $M_1$ doit être préféré.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` (avec \`y = df['spread_credit_bbb']\`) :
1. Estimez **\`m1\`** expliquant \`y\` par \`sm.add_constant(df[['inflation_hicp']])\`.
2. Estimez **\`m2\`** expliquant \`y\` par \`sm.add_constant(df[['inflation_hicp', 'cac40_rendement']])\`.
3. Affichez \`m1.rsquared\`, \`m1.rsquared_adj\` ainsi que \`m2.rsquared\`, \`m2.rsquared_adj\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\ny = df['spread_credit_bbb']\nm1 = sm.OLS(y, sm.add_constant(df[['inflation_hicp']])).fit()\nm2 = sm.OLS(y, sm.add_constant(df[['inflation_hicp', 'cac40_rendement']])).fit()\nprint(f'M1 -> R²: {m1.rsquared:.4f} | R² adj: {m1.rsquared_adj:.4f}')\nprint(f'M2 -> R²: {m2.rsquared:.4f} | R² adj: {m2.rsquared_adj:.4f}')",
      testPythonCode: "assert 'm1' in globals() and 'm2' in globals()\nassert m2.rsquared >= m1.rsquared - 1e-12",
      hints: ["Comparez .rsquared et .rsquared_adj sur m1 et m2."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, ajouter une variable explicative réduit mécaniquement (ou maintient) $SCR$, donc $R^2$ augmente toujours, alors que le $R^2$ ajusté $\\bar{R}^2 = 1 - \\frac{SCR/(T-K-1)}{SCT/(T-1)}$ diminue si $|t_{K+1}| < 1$. Sur une même variable cible \`y = df['spread_credit_bbb']\`, estimez deux modèles imbriqués **\`m1\`** ($K=1$ : \`inflation_hicp\`) et **\`m2\`** ($K=2$ : ajout de \`cac40_rendement\`), puis comparez leurs attributs \`.rsquared\` et \`.rsquared_adj\`.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et isolez la cible commune \`y = df['spread_credit_bbb']\`.`,
          `Estimez le modèle parcimonieux \`m1\` avec \`sm.add_constant(df[['inflation_hicp']])\`.`,
          `Estimez le modèle étendu \`m2\` avec \`sm.add_constant(df[['inflation_hicp', 'cac40_rendement']])\`.`,
          `Affichez \`m1.rsquared\`, \`m1.rsquared_adj\` et \`m2.rsquared\`, \`m2.rsquared_adj\` à $4$ décimales pour observer la baisse de $\\bar{R}^2$.`,
        ],
        concepts: [
          {
            symbol: "y",
            kind: "Variable",
            roleInExercise: "Variable expliquée commune `df['spread_credit_bbb']` garantissant que `m1` et `m2` sont bien imbriqués sur exactement les mêmes $16$ observations.",
          },
          {
            symbol: "sm.add_constant(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Ajoute `'const'` à `df[['inflation_hicp']]` puis à `df[['inflation_hicp', 'cac40_rendement']]`.",
          },
          {
            symbol: "m1",
            kind: "Variable",
            roleInExercise: "Modèle OLS simple ($K=1$) attendu par `testPythonCode`.",
          },
          {
            symbol: "m2",
            kind: "Variable",
            roleInExercise: "Modèle OLS à $2$ variables ($K=2$) devant vérifier `m2.rsquared >= m1.rsquared`.",
          },
          {
            symbol: ".rsquared",
            kind: "Paramètre",
            roleInExercise: "Attribut scalaires de Statsmodels retournant le coefficient de détermination brut $R^2$ (non pénalisé).",
          },
          {
            symbol: ".rsquared_adj",
            kind: "Paramètre",
            roleInExercise: "Attribut retournant le $R^2$ ajusté $\\bar{R}^2$ qui pénalise l'ajout d'une variable peu informative ($|t| = 0.20 < 1$ ici).",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et définir la cible commune y
import statsmodels.api as sm
y = df['A_COMPLETER']

# Étape 2 : Estimer le modèle parcimonieux m1 (1 variable explicative)
m1 = sm.OLS(y, sm.add_constant(df[['A_COMPLETER']])).fit()

# Étape 3 : Estimer le modèle augmenté m2 (2 variables explicatives)
m2 = sm.OLS(y, sm.add_constant(df[['A_COMPLETER', 'A_COMPLETER']])).fit()

# Étape 4 : Comparer R² et R² ajusté des deux modèles
print(f"M1 -> R²: {m1.___:.4f} | R² adj: {m1.___:.4f}")
print(f"M2 -> R²: {m2.___:.4f} | R² adj: {m2.___:.4f}")`,
      },
    },
    {
      id: "py-41",
      title: "15. Estimateur matriciel MCO & Somme des Carrés Résiduelle",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 12,
      description: "Recalculez à la main beta_hat = (X'X)^(-1) X'y et le SCR avec NumPy.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Estimateur Matriciel des MCO et Projection Orthogonale

Sous forme vectorielle dans $\\mathbb{R}^T$, le modèle linéaire s'écrit $y = X\\beta + \\varepsilon$ avec $X \\in \\mathbb{R}^{T \\times (K+1)}$ de plein rang colonne ($\\operatorname{rang}(X) = K + 1$). La minimisation de la somme des carrés résiduelle :

$$
\\mathcal{L}(\\beta) = \\|y - X\\beta\\|_2^2 = (y - X\\beta)'(y - X\\beta) = y'y - 2\\beta'X'y + \\beta'X'X\\beta
$$

conduit, en annulant le gradient matriciel $\\nabla_\\beta \\mathcal{L}(\\hat{\\beta}) = -2X'y + 2X'X\\hat{\\beta} = \\mathbf{0}$, aux **équations normales** :

$$
X'X\\hat{\\beta} = X'y \\implies \\hat{\\beta} = (X'X)^{-1} X'y
$$

**Géométrie euclidienne :** $\\hat{y} = X\\hat{\\beta} = \\underbrace{X(X'X)^{-1}X'}_{H} y$ est la **projection orthogonale** de $y$ sur l'espace engendré par les colonnes de $X$ (*Hat matrix* $H$, symétrique et idempotente $H^2 = H$). Le vecteur des résidus $\\hat{e} = y - \\hat{y} = (I_T - H)y$ est par construction **strictement orthogonal** aux colonnes de $X$ :

$$
X'\\hat{e} = X'(I_T - H)y = (X' - X'X(X'X)^{-1}X')y = \\mathbf{0}, \\qquad SCR = \\hat{e}'\\hat{e} = \\sum_{t=1}^T \\hat{e}_t^2
$$

### 💻 Masterclass Python

En NumPy, l'opérateur \`@\` effectue le produit matriciel (PEP 465) et \`.T\` transpose une matrice :
- Conversion Pandas $\\to$ NumPy : \`.values\` ou \`.to_numpy()\` (recommandé en code moderne).
- Attention d'ingénierie numérique : bien que \`np.linalg.inv(X.T @ X) @ X.T @ y\` traduise fidèlement la formule algébrique, inverser explicitement $X'X$ élève au carré le nombre de conditionnement de $X$. En production sur grandes matrices mal conditionnées, on privilégie \`np.linalg.solve(X.T @ X, X.T @ y)\` ou une décomposition QR via \`np.linalg.lstsq(X, y, rcond=None)\`.

\`\`\`python
import numpy as np
import statsmodels.api as sm

# 1. Conversion des DataFrame/Series en tableaux NumPy 2D (16x2) et 1D (16,)
X = sm.add_constant(df[['inflation_hicp']]).to_numpy()
y = df['spread_credit_bbb'].to_numpy()

# 2. Formule fermée des MCO via inversion matricielle de Gram (X'X)
beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y

# 3. Alternative numériquement plus stable (sans inverser explicitement X'X)
beta_qr, _, _, _ = np.linalg.lstsq(X, y, rcond=None)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Calculons \`beta_hat\`, le vecteur des résidus et le $SCR$ sur \`df\`, et vérifions numériquement la condition d'orthogonalité $X'\\hat{e} = \\mathbf{0}$ :

\`\`\`python
import numpy as np
import statsmodels.api as sm

X = sm.add_constant(df[['inflation_hicp']]).to_numpy()
y = df['spread_credit_bbb'].to_numpy()
beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y
e = y - X @ beta_hat
ortho = X.T @ e
print("beta_hat (NumPy) :", np.round(beta_hat, 6))
print("X'e (orthogonalité) :", ortho)
print(f"SCR = {float(e @ e):.6f}")
\`\`\`

\`\`\`text
beta_hat (NumPy) : [1.006556 0.072844]
X'e (orthogonalité) : [-5.66213743e-15 -3.00870440e-14]
SCR = 1.147767
\`\`\`

Le produit $X'\\hat{e}$ vaut \`[-5.66e-15, -3.01e-14]\` (zéro à la précision machine IEEE-754 près) et $\\hat{\\beta}$ retrouve exactement \`[1.006556, 0.072844]\`.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` (\`spread_credit_bbb ~ const + inflation_hicp\`) :
1. Importez \`numpy as np\` et \`statsmodels.api as sm\`, puis extrayez les tableaux NumPy \`X = sm.add_constant(df[['inflation_hicp']]).values\` et \`y = df['spread_credit_bbb'].values\`.
2. Calculez **\`beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y\`**.
3. Calculez **\`resid_np = y - X @ beta_hat\`** et **\`scr_np = float(np.sum(resid_np**2))\`**, puis affichez-les.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import numpy as np\nimport statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']]).values\ny = df['spread_credit_bbb'].values\nbeta_hat = np.linalg.inv(X.T @ X) @ X.T @ y\nresid_np = y - X @ beta_hat\nscr_np = float(np.sum(resid_np**2))\nprint('Beta NumPy :', np.round(beta_hat, 4))\nprint(f'SCR NumPy : {scr_np:.6f}')",
      testPythonCode: "assert 'beta_hat' in globals() and 'scr_np' in globals()\nassert len(beta_hat) == 2 and scr_np > 0",
      hints: ["np.linalg.inv(X.T @ X) @ X.T @ y puis resid_np = y - X @ beta_hat"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la résolution matricielle des équations normales donne $\\hat{\\beta} = (X'X)^{-1}X'y$, le vecteur des résidus $\\hat{e} = y - X\\hat{\\beta}$ et la somme des carrés résiduelle $SCR = \\sum_{t=1}^T \\hat{e}_t^2$. Pour traduire exactement ces équations en NumPy, on convertit \`X\` et \`y\` avec \`.values\`, on transpose avec \`.T\`, on multiplie matriciellement avec \`@\`, on inverse avec \`np.linalg.inv(...)\` pour obtenir **\`beta_hat\`**, puis on calcule \`resid_np\` et **\`scr_np\`** via \`np.sum(resid_np**2)\`.`,
        stepByStepPlan: [
          `Importez \`numpy as np\` et \`statsmodels.api as sm\`, puis convertissez \`X = sm.add_constant(df[['inflation_hicp']]).values\` et \`y = df['spread_credit_bbb'].values\`.`,
          `Calculez \`beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y\` (vecteur de longueur $2$).`,
          `Calculez le vecteur des résidus \`resid_np = y - X @ beta_hat\`.`,
          `Sommez les carrés des résidus dans \`scr_np = float(np.sum(resid_np**2))\` et affichez \`beta_hat\` et \`scr_np\`.`,
        ],
        concepts: [
          {
            symbol: "import numpy as np",
            kind: "Syntaxe",
            roleInExercise: "Importe la bibliothèque de calcul matriciel NumPy sous son alias standard `np`.",
          },
          {
            symbol: ".values",
            kind: "Paramètre",
            roleInExercise: "Extrait le tableau NumPy (`ndarray`) sous-jacent d'un DataFrame (`shape (16, 2)`) ou d'une Series (`shape (16,)`), sans étiquettes d'index Pandas.",
          },
          {
            symbol: ".T",
            kind: "Paramètre",
            roleInExercise: "Attribut de transposition matricielle NumPy : transforme `X` `(16, 2)` en `X.T` `(2, 16)`.",
          },
          {
            symbol: "@",
            kind: "Syntaxe",
            roleInExercise: "Opérateur Python du produit matriciel (à ne pas confondre avec `*` qui multiplie terme à terme). `X.T @ X` produit une matrice carrée `(2, 2)`.",
          },
          {
            symbol: "np.linalg.inv(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule l'inverse matriciel $(X'X)^{-1}$ indispensable à la formule fermée des MCO.",
          },
          {
            symbol: "beta_hat",
            kind: "Variable",
            roleInExercise: "Vecteur NumPy de longueur $2$ (`[alpha, beta]`) vérifié par `len(beta_hat) == 2`.",
          },
          {
            symbol: "resid_np",
            kind: "Variable",
            roleInExercise: "Vecteur des $16$ résidus $\\hat{e} = y - X\\hat{\\beta}$ calculé via le produit matrice-vecteur `X @ beta_hat`.",
          },
          {
            symbol: "np.sum(...) / scr_np",
            kind: "Fonction / Méthode",
            roleInExercise: "`np.sum(resid_np**2)` additionne tous les carrés des résidus et `float(...)` stocke le $SCR$ scalaire dans `scr_np`.",
          },
        ],
        guidedCode: `# Étape 1 : Importer NumPy/Statsmodels et extraire les tableaux .values
import numpy as np
import statsmodels.api as sm
X = sm.add_constant(df[['inflation_hicp']]).___
y = df['spread_credit_bbb'].___

# Étape 2 : Calculer beta_hat = (X'X)^(-1) X'y avec .T, @ et np.linalg.inv
beta_hat = np.linalg.___(X.___ @ X) @ X.___ @ y

# Étape 3 : Calculer les résidus puis la somme des carrés résiduelle scr_np
resid_np = y - X ___ beta_hat
scr_np = float(np.___(resid_np**2))

# Étape 4 : Afficher beta_hat et scr_np
print("Beta NumPy :", np.round(beta_hat, 4))
print(f"SCR NumPy : {scr_np:.6f}")`,
      },
    },
    {
      id: "py-42",
      title: "16. Prédiction ponctuelle d'un scénario macro (.predict)",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Prévoyez le niveau de l'OAT 10 ans dans un scénario cible Euribor = 3.0 % et Inflation = 2.5 %.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Prévision Conditionnelle et Variance de l'Erreur de Prévision

Une fois estimé le modèle de courbe des taux $\\widehat{\\text{OAT}}_{10Y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 \\text{Euribor}_{3M} + \\hat{\\beta}_2 \\pi_{\\text{HICP}}$, le comité ALM souhaite évaluer le taux souverain 10 ans dans un scénario macroéconomique cible $x_* = [1,\\, 3.0,\\, 2.5]'$. La prévision ponctuelle est :

$$
\\hat{y}_* = x_*'\\hat{\\beta}
$$

**Quelle est l'incertitude exacte autour de cette prévision ?** Une réalisation future $y_* = x_*'\\beta + \\varepsilon_*$ (avec $\\varepsilon_*$ indépendant de l'échantillon d'estimation) génère une erreur de prévision $e_* = y_* - \\hat{y}_* = x_*'(\\beta - \\hat{\\beta}) + \\varepsilon_*$ combinant **deux sources d'erreur indépendantes** :
1. L'incertitude d'estimation des paramètres : $\\operatorname{Var}(x_*'\\hat{\\beta}) = \\sigma^2 \\, x_*'(X'X)^{-1} x_*$.
2. Le bruit futur irréductible : $\\operatorname{Var}(\\varepsilon_*) = \\sigma^2$.

$$
\\operatorname{Var}(e_*) = \\sigma^2 \\left( 1 + x_*'(X'X)^{-1} x_* \\right)
$$

> 💡 **Distinction clé : Moyenne conditionnelle vs Nouvelle observation**
>
> L'**intervalle de prédiction** d'un trimestre futur ($+1$ sous la variance) est toujours strictement plus large que l'**intervalle de confiance de la moyenne conditionnelle** $\\mathbb{E}[Y \\mid x_*]$. De plus, prévoir loin du nuage historique augmente quadratiquement le terme $x_*'(X'X)^{-1} x_*$ (danger d'extrapolation).

### 💻 Masterclass Python

En Statsmodels, \`model.predict(exog)\` exige un tableau respectant **l'ordre exact des colonnes de \`X\`** — incluant le \`1.0\` initial correspondant à \`'const'\`. Comme \`.predict([1.0, 3.0, 2.5])\` renvoie un \`ndarray\` à un élément, l'index \`[0]\` suivi de \`float(...)\` extrait le scalaire.

Pour obtenir également les deux intervalles d'incertitude (\`mean_ci\` et \`obs_ci\`), Statsmodels fournit \`model.get_prediction(...).summary_frame(alpha=0.05)\`.

\`\`\`python
import statsmodels.api as sm

# 1. Modèle ALM à 2 facteurs (constante en position 0, puis euribor_3m, inflation_hicp)
X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
model_alm = sm.OLS(df['oat_10y'], X).fit()

# 2. Scénario cible : [const=1.0, euribor_3m=3.0, inflation_hicp=2.5]
prev_ponctuelle = float(model_alm.predict([1.0, 3.0, 2.5])[0])

# 3. Enveloppe complète (IC moyenne vs intervalle de prédiction à 95%)
cadre_prev = model_alm.get_prediction([1.0, 3.0, 2.5]).summary_frame(alpha=0.05)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Calculons sur \`df\` la prévision ponctuelle ainsi que l'écart entre intervalle de confiance de la moyenne (\`mean_ci\`) et intervalle de prédiction d'une observation future (\`obs_ci\`) pour Euribor $= 3.0\\%$, Inflation $= 2.5\\%$ :

\`\`\`python
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
m = sm.OLS(df['oat_10y'], X).fit()
pred_df = m.get_prediction([1.0, 3.0, 2.5]).summary_frame(alpha=0.05)
print(pred_df[['mean', 'mean_se', 'mean_ci_lower', 'mean_ci_upper', 'obs_ci_lower', 'obs_ci_upper']].round(4).to_string(index=False))
\`\`\`

\`\`\`text
  mean  mean_se  mean_ci_lower  mean_ci_upper  obs_ci_lower  obs_ci_upper
2.4018   0.0989         2.1881         2.6155        1.9067        2.8969
\`\`\`

La prévision ponctuelle vaut \`2.4018 %\` ; l'intervalle de confiance de la moyenne est $[2.1881, 2.6155]\\%$, tandis que l'intervalle de prédiction d'un nouveau trimestre s'élargit à $[1.9067, 2.8969]\\%$.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Ajustez **\`model_alm = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m', 'inflation_hicp']])).fit()\`**.
2. Prévoyez le taux OAT 10 ans dans le scénario \`(Euribor = 3.0 %, Inflation = 2.5 %)\` (en n'oubliant pas le \`1.0\` de la constante) et stockez le résultat dans **\`prev_oat = float(model_alm.predict([1.0, 3.0, 2.5])[0])\`**.
3. Affichez \`prev_oat\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nmodel_alm = sm.OLS(df['oat_10y'], X).fit()\nprev_oat = float(model_alm.predict([1.0, 3.0, 2.5])[0])\nprint(f'OAT 10Y prévue (Euribor 3.0%, Inf 2.5%) : {prev_oat:.3f} %')",
      testPythonCode: "assert 'prev_oat' in globals()\nassert 1.0 < prev_oat < 5.0",
      hints: ["Passez [1.0, 3.0, 2.5] à model_alm.predict(...)."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la prévision ponctuelle pour un scénario macroéconomique $x_* = [1,\\, 3.0,\\, 2.5]'$ s'obtient par produit scalaire $\\hat{y}_* = x_*'\\hat{\\beta}$. En Statsmodels, après avoir ajusté **\`model_alm\`** (\`oat_10y ~ const + euribor_3m + inflation_hicp\`) sur \`df\`, on appelle \`model_alm.predict([1.0, 3.0, 2.5])\` — le \`1.0\` initial est **obligatoire** car \`sm.add_constant()\` place \`'const'\` en 1re colonne — et on extrait l'unique élément \`[0]\` dans **\`prev_oat\`**.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et construisez \`X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\`.`,
          `Estimez le modèle à $2$ facteurs \`model_alm = sm.OLS(df['oat_10y'], X).fit()\`.`,
          `Appelez \`model_alm.predict([1.0, 3.0, 2.5])[0]\` (dans l'ordre exact \`[const, euribor_3m, inflation_hicp]\`), convertissez en \`float\` dans \`prev_oat\` et affichez le résultat.`,
        ],
        concepts: [
          {
            symbol: "df[['euribor_3m', 'inflation_hicp']]",
            kind: "Colonne / Table",
            roleInExercise: "Sélectionne les $2$ facteurs explicatifs dans `df` : leur ordre exact (`euribor_3m` puis `inflation_hicp`) fixe celui des valeurs passées à `.predict(...)`.",
          },
          {
            symbol: "sm.add_constant(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Insère la colonne `'const'` en toute première position (`[1.0, ...]`), d'où l'obligation de commencer la liste du scénario par `1.0`.",
          },
          {
            symbol: "model_alm",
            kind: "Variable",
            roleInExercise: "Modèle OLS multivarié de la courbe des taux (`oat_10y`) estimé localement.",
          },
          {
            symbol: ".predict([1.0, 3.0, 2.5])",
            kind: "Fonction / Méthode",
            roleInExercise: "Évalue $\\hat{y}_* = \\hat{\\beta}_0 \\cdot 1.0 + \\hat{\\beta}_1 \\cdot 3.0 + \\hat{\\beta}_2 \\cdot 2.5$ et renvoie un tableau NumPy de longueur $1$.",
          },
          {
            symbol: "[0] / float(...)",
            kind: "Syntaxe",
            roleInExercise: "`[0]` extrait l'unique valeur du tableau retourné par `.predict(...)`, et `float(...)` la convertit en flottant Python natif.",
          },
          {
            symbol: "prev_oat",
            kind: "Variable",
            roleInExercise: "Taux OAT 10 ans prévu ($\\approx 2.402\\%$) vérifié par `1.0 < prev_oat < 5.0`.",
          },
        ],
        guidedCode: `# Étape 1 : Estimer model_alm sur oat_10y avec constante, euribor_3m et inflation_hicp
import statsmodels.api as sm
X = sm.add_constant(df[['A_COMPLETER', 'A_COMPLETER']])
model_alm = sm.OLS(df['A_COMPLETER'], X).fit()

# Étape 2 : Prédire le scénario [const=1.0, euribor=3.0, inflation=2.5] et extraire [0]
prev_oat = float(model_alm.___([___, ___, ___])[0])

# Étape 3 : Afficher la prévision ponctuelle
print(f"OAT 10Y prévue (Euribor 3.0%, Inf 2.5%) : {prev_oat:.3f} %")`,
      },
    },
    {
      id: "py-43",
      title: "17. Régression multivariée complète & Test de Fisher",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Modélisez spread_credit_bbb par euribor_3m, inflation_hicp et pib_croissance, puis testez la significativité globale F.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Régression Multivariée et Test F Conjoint de Fisher

On modélise le spread de crédit BBB par trois facteurs macroéconomiques simultanés : le taux court (\`euribor_3m\`), l'inflation (\`inflation_hicp\`) et la croissance du PIB (\`pib_croissance\`) :

$$
y_t = \\beta_0 + \\beta_1 x_{1t} + \\beta_2 x_{2t} + \\beta_3 x_{3t} + \\varepsilon_t
$$

Avant d'interpréter les sensibilités individuelles, le **test global de Fisher-Snedecor** arbitre l'hypothèse nulle conjointe selon laquelle le bloc de $K = 3$ prédicteurs n'apporte aucune information :

$$
H_0 : \\beta_1 = \\beta_2 = \\beta_3 = 0, \\qquad H_1 : \\exists j \\in \\{1, 2, 3\\},\\; \\beta_j \\neq 0
$$

La statistique $F$ compare la variance expliquée moyenne par régresseur à la variance résiduelle estimée sur les $T - K - 1 = 12$ degrés de liberté restants :

$$
F = \\frac{SCE / K}{SCR / (T - K - 1)} = \\frac{R^2 / K}{(1 - R^2) / (T - K - 1)} \\sim \\mathcal{F}(K,\\, T - K - 1) \\quad \\text{sous } H_0
$$

> 💡 **Pourquoi un test $F$ plutôt que 3 tests $t$ séparés ?**
>
> Enchaîner 3 tests $t$ indépendants à $5\\%$ fait grimper le risque global de faux positif (à $\\approx 1 - 0.95^3 \\approx 14.3\\%$). De plus, lorsque deux prédicteurs sont corrélés, les tests $t$ individuels peuvent paraître faibles alors que le test $F$ conjoint demeure hautement significatif.

### 💻 Masterclass Python

Statsmodels fournit directement la statistique de Fisher globale via \`.fvalue\` et sa p-valeur exacte via \`.f_pvalue\` (correspondant à la loi $\\mathcal{F}(K, T-K-1)$). Pour tester n'importe quelle contrainte linéaire personnalisée (par exemple $\\beta_1 + \\beta_2 = 1$ ou nullité d'un sous-ensemble), utilisez la méthode \`.f_test("euribor_3m = 0, inflation_hicp = 0")\`.

\`\`\`python
import statsmodels.api as sm

# 1. Spécification multivariée à K = 3 régresseurs (+ constante)
cols = ['euribor_3m', 'inflation_hicp', 'pib_croissance']
X_credit = sm.add_constant(df[cols])
model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()

# 2. Extraction directe des statistiques globales de Fisher
f_stat = float(model_credit.fvalue)
f_pval = float(model_credit.f_pvalue)

# 3. Test d'une restriction linéaire sur un sous-bloc de coefficients
test_bloc = model_credit.f_test("euribor_3m = 0, inflation_hicp = 0")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions numériquement sur \`df\` l'équivalence exacte entre $F = \\frac{R^2 / 3}{(1 - R^2) / 12}$ et \`model_credit.fvalue\`, puis examinons les p-valeurs individuelles :

\`\`\`python
import statsmodels.api as sm

X_c = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
m = sm.OLS(df['spread_credit_bbb'], X_c).fit()
f_man = (m.rsquared / 3) / ((1 - m.rsquared) / (16 - 3 - 1))
print(f"R2 = {m.rsquared:.4f} | F manuel = {f_man:.4f} | F Statsmodels = {m.fvalue:.4f} | Prob(F) = {m.f_pvalue:.4e}")
print("P-valeurs individuelles :\\n", m.pvalues.round(4))
\`\`\`

\`\`\`text
R2 = 0.6925 | F manuel = 9.0087 | F Statsmodels = 9.0087 | Prob(F) = 2.1264e-03
P-valeurs individuelles :
 const             0.0000
euribor_3m        0.0139
inflation_hicp    0.0116
pib_croissance    0.3430
dtype: float64
\`\`\`

Avec $R^2 = 0.6925$, $F = 9.0087$ ($p = 2.13 \\times 10^{-3} < 0.01$), le bloc macroéconomique explique collectivement le spread BBB, tiré par \`euribor_3m\` ($p = 0.0139$) et \`inflation_hicp\` ($p = 0.0116$).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Construisez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\` et ajustez **\`model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\`**.
2. Extrayez **\`f_stat_credit = float(model_credit.fvalue)\`** et **\`f_pval_credit = float(model_credit.f_pvalue)\`**.
3. Affichez la statistique $F$ et sa p-valeur.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nmodel_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\nf_stat_credit = float(model_credit.fvalue)\nf_pval_credit = float(model_credit.f_pvalue)\nprint(f'F-statistique : {f_stat_credit:.2f} | Prob(F) : {f_pval_credit:.4e}')",
      testPythonCode: "assert 'model_credit' in globals() and 'f_stat_credit' in globals()\nassert len(model_credit.params) == 4 and f_pval_credit < 0.05",
      hints: ["X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la régression multivariée $y_t = \\beta_0 + \\beta_1 x_{1t} + \\beta_2 x_{2t} + \\beta_3 x_{3t} + \\varepsilon_t$ est testée globalement par le test conjoint de Fisher $H_0 : \\beta_1 = \\beta_2 = \\beta_3 = 0$ via $F \\sim \\mathcal{F}(3, 12)$. En Statsmodels sur \`df\`, vous construisez \`X_credit\` ($4$ colonnes dont \`'const'\`), estimez **\`model_credit\`** sur \`spread_credit_bbb\`, puis lisez \`.fvalue\` dans **\`f_stat_credit\`** et \`.f_pvalue\` dans **\`f_pval_credit\`**.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et construisez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\`.`,
          `Estimez le modèle à $4$ paramètres \`model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\`.`,
          `Extrayez la statistique globale \`f_stat_credit = float(model_credit.fvalue)\` et sa p-valeur \`f_pval_credit = float(model_credit.f_pvalue)\`.`,
          `Affichez ces deux résultats à l'aide d'une *f-string*.`,
        ],
        concepts: [
          {
            symbol: "X_credit",
            kind: "Variable",
            roleInExercise: "Matrice explicative à $4$ colonnes (`'const'`, `'euribor_3m'`, `'inflation_hicp'`, `'pib_croissance'`) créée avec `sm.add_constant(...)`.",
          },
          {
            symbol: "model_credit",
            kind: "Variable",
            roleInExercise: "Modèle OLS multivarié du spread BBB exigé par `testPythonCode` (`len(model_credit.params) == 4`).",
          },
          {
            symbol: ".fvalue",
            kind: "Paramètre",
            roleInExercise: "Attribut flottant contenant la statistique $F = \\frac{R^2 / 3}{(1 - R^2) / 12}$ du test de nullité conjointe des $3$ facteurs.",
          },
          {
            symbol: ".f_pvalue",
            kind: "Paramètre",
            roleInExercise: "Attribut flottant donnant la p-valeur exacte de Fisher ($\\approx 2.13 \\times 10^{-3} < 0.05$) vérifiée par `testPythonCode`.",
          },
          {
            symbol: "f_stat_credit / f_pval_credit",
            kind: "Variable",
            roleInExercise: "Variables flottantes (`float(...)`) stockant la statistique $F$ et sa p-valeur.",
          },
          {
            symbol: "f'... {f_pval_credit:.4e}'",
            kind: "Syntaxe",
            roleInExercise: "*f-string* affichant `f_stat_credit` à $2$ décimales et `f_pval_credit` en format scientifique exponentiel.",
          },
        ],
        guidedCode: `# Étape 1 : Construire X_credit (constante + 3 facteurs macro) et ajuster model_credit
import statsmodels.api as sm
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
model_credit = sm.OLS(df['A_COMPLETER'], X_credit).fit()

# Étape 2 : Extraire la statistique F globale et sa p-valeur
f_stat_credit = float(model_credit.___)
f_pval_credit = float(model_credit.___)

# Étape 3 : Afficher le diagnostic du test de Fisher
print(f"F-statistique : {f_stat_credit:.2f} | Prob(F) : {f_pval_credit:.4e}")`,
      },
    },
    {
      id: "py-44",
      title: "18. Audit complet de Multicolinéarité (Boucle VIF)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 12,
      description: "Calculez le VIF de chacun des 3 régresseurs du modèle de crédit en une boucle.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Multicolinéarité, Matrice $(X'X)^{-1}$ et Facteur VIF

Si deux variables explicatives évoluent de façon quasi-colinéaire, les colonnes de $X$ deviennent presque linéairement dépendantes : le déterminant de $X'X$ tend vers $0$, son inversion $(X'X)^{-1}$ explose numériquement et il devient impossible de séparer l'effet propre (*ceteris paribus*) de chaque variable.

Par inversion par blocs de la matrice de Gram centrée $\\tilde{X}'\\tilde{X}$, la variance exacte du $j$-ième estimateur MCO s'écrit :

$$
\\operatorname{Var}(\\hat{\\beta}_j) = \\sigma^2 \\left[(X'X)^{-1}\\right]_{jj} = \\frac{\\sigma^2}{\\sum_{t=1}^T (x_{jt} - \\bar{x}_j)^2} \\times \\underbrace{\\frac{1}{1 - R_j^2}}_{VIF_j}
$$

où $R_j^2$ est le coefficient de détermination de la **régression auxiliaire** de $X_j$ sur tous les autres régresseurs. Le **Facteur d'Inflation de la Variance ($VIF_j$)** mesure donc de combien la variance de $\\hat{\\beta}_j$ est multipliée par rapport à une situation idéale d'orthogonalité ($R_j^2 = 0 \\implies VIF_j = 1$) :
- $VIF_j < 5$ : colinéarité saine / négligeable.
- $5 \\le VIF_j \\le 10$ : zone de vigilance (erreurs-types gonflées d'un facteur $\\sqrt{5} \\approx 2.24$).
- $VIF_j > 10$ ($R_j^2 > 0.90$) : multicolinéarité sévère (coefficients instables, signes potentiellement inversés).

> 💡 **Rappel théorique crucial :** la multicolinéarité ne **biaise pas** les MCO (Gauss-Markov reste vrai), elle ne fait qu'exploser la **variance** des estimateurs.

### 💻 Masterclass Python

En Python, un **dictionnaire en compréhension** (*dict comprehension*) construit élégamment un tableau d'audit en une expression idiomatique :
\`\`\`python
{cle(i): valeur(i) for i in range(1, X_credit.shape[1])}
\`\`\`
Pourquoi démarrer impérativement la boucle à **\`i = 1\`** et non à \`0\` ? Parce que dans \`X_credit = sm.add_constant(...)\`, la colonne d'indice \`0\` est \`'const'\` (vecteur de \`1\`). Calculer un VIF sur la constante n'a aucun sens statistique (les colonnes ne sont pas centrées, et \`variance_inflation_factor\` attend une matrice contenant une constante explicite pour estimer $R_j^2$ sur les indices $j \\ge 1$).

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

# 1. Matrice avec constante à l'indice 0 et 3 régresseurs aux indices 1, 2, 3
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])

# 2. Dict comprehension : clé = nom de colonne, valeur = VIF arrondi
# On parcourt i = 1, 2, 3 (en excluant l'indice 0 = 'const')
audit_vif = {
    X_credit.columns[i]: round(float(variance_inflation_factor(X_credit.values, i)), 3)
    for i in range(1, X_credit.shape[1])
}
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions numériquement sur \`df\` l'identité exacte entre \`1 / (1 - R_aux^2)\` obtenu par régression auxiliaire et \`variance_inflation_factor(X_credit.values, 1)\` :

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

X_c = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
m_aux = sm.OLS(df['euribor_3m'], sm.add_constant(df[['inflation_hicp', 'pib_croissance']])).fit()
vif_man = 1.0 / (1.0 - m_aux.rsquared)
vif_sm = variance_inflation_factor(X_c.values, 1)
print(f"R2 auxiliaire (euribor ~ inf + pib) = {m_aux.rsquared:.4f}")
print(f"VIF manuel = {vif_man:.4f} | VIF Statsmodels = {vif_sm:.4f}")
\`\`\`

\`\`\`text
R2 auxiliaire (euribor ~ inf + pib) = 0.1135
VIF manuel = 1.1280 | VIF Statsmodels = 1.1280
\`\`\`

Avec $R_{\\text{aux}}^2 = 0.1135$, tous les VIF du modèle de crédit sont voisins de $1.13 \\ll 5$ : l'orthogonalité entre taux court, inflation et PIB est excellente sur cet échantillon.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Importez \`statsmodels.api as sm\` et \`variance_inflation_factor\` depuis \`statsmodels.stats.outliers_influence\`.
2. Construisez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\`.
3. À l'aide d'un dictionnaire en compréhension bouclant sur \`range(1, X_credit.shape[1])\` (hors constante), calculez **\`vifs\`** associant chaque nom de variable (\`'euribor_3m'\`, \`'inflation_hicp'\`, \`'pib_croissance'\`) à son VIF arrondi à 3 décimales, puis affichez \`vifs\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.outliers_influence import variance_inflation_factor\n\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nvifs = {\n    X_credit.columns[i]: round(float(variance_inflation_factor(X_credit.values, i)), 3)\n    for i in range(1, X_credit.shape[1])\n}\nprint('Audit VIF complet :', vifs)",
      testPythonCode: "assert 'vifs' in globals()\nassert set(vifs.keys()) == {'euribor_3m', 'inflation_hicp', 'pib_croissance'}",
      hints: ["Bouclez de i = 1 jusqu'à X_credit.shape[1] - 1."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le Facteur d'Inflation de la Variance $VIF_j = \\frac{1}{1 - R_j^2}$ mesure de combien la variance de $\\hat{\\beta}_j$ est gonflée par la colinéarité entre régresseurs. En Python, on utilise une **compréhension de dictionnaire** \`{cle: valeur for i in range(1, X_credit.shape[1])}\` : la boucle commence volontairement à l'indice \`1\` (pour exclure l'indice \`0\` = \`'const'\`) et appelle \`variance_inflation_factor(X_credit.values, i)\` pour construire **\`vifs\`** avec exactement les $3$ clés attendues par \`testPythonCode\`.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et \`variance_inflation_factor\` depuis \`statsmodels.stats.outliers_influence\`.`,
          `Construisez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\` ($4$ colonnes : \`const\` en indice \`0\`, puis les $3$ variables aux indices \`1, 2, 3\`).`,
          `Écrivez la compréhension de dictionnaire \`vifs = {X_credit.columns[i]: round(float(variance_inflation_factor(X_credit.values, i)), 3) for i in range(1, X_credit.shape[1])}\`.`,
          `Affichez \`vifs\` avec \`print(...)\`.`,
        ],
        concepts: [
          {
            symbol: "variance_inflation_factor(exog, exog_idx)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de `statsmodels.stats.outliers_influence` qui estime la régression auxiliaire de la colonne `exog_idx` sur toutes les autres et retourne $1 / (1 - R_j^2)$.",
          },
          {
            symbol: "X_credit.values",
            kind: "Paramètre",
            roleInExercise: "Tableau NumPy 2D `(16, 4)` passé en 1er argument (cette fonction exige un tableau NumPy et non un DataFrame Pandas directement).",
          },
          {
            symbol: "range(1, X_credit.shape[1])",
            kind: "Syntaxe",
            roleInExercise: "Génère les indices `1, 2, 3` (`X_credit.shape[1]` vaut `4`). Démarrer à `1` saute la colonne `0` (`'const'`), dont le VIF n'a pas d'intérêt.",
          },
          {
            symbol: "{k: v for i in ...}",
            kind: "Syntaxe",
            roleInExercise: "Compréhension de dictionnaire Python : syntaxe compacte construisant un `dict` en une expression sans initialiser un dictionnaire vide puis assigner dans une boucle `for`.",
          },
          {
            symbol: "X_credit.columns[i]",
            kind: "Syntaxe",
            roleInExercise: "Récupère la chaîne de caractères du nom de la $i$-ème colonne (`'euribor_3m'`, `'inflation_hicp'`, `'pib_croissance'`) comme clé du dictionnaire.",
          },
          {
            symbol: "round(float(...), 3)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit le résultat NumPy en `float` Python puis l'arrondit à $3$ décimales.",
          },
          {
            symbol: "vifs",
            kind: "Variable",
            roleInExercise: "Dictionnaire résultat vérifié par `set(vifs.keys()) == {'euribor_3m', 'inflation_hicp', 'pib_croissance'}`.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et variance_inflation_factor
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

# Étape 2 : Construire X_credit (colonne 0 = 'const', colonnes 1..3 = facteurs)
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])

# Étape 3 : Construire le dict vifs en bouclant de i=1 à X_credit.shape[1] (excluant 'const')
vifs = {
    X_credit.columns[i]: round(float(variance_inflation_factor(X_credit.___, ___)), 3)
    for i in range(___, X_credit.shape[1])
}

# Étape 4 : Afficher le dictionnaire d'audit VIF
print("Audit VIF complet :", vifs)`,
      },
    },
    {
      id: "py-45",
      title: "19. Test de Breusch-Pagan sur le modèle de Crédit",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Testez l'homoscédasticité des résidus du modèle expliquant spread_credit_bbb.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Test d'Hétéroscédasticité de Breusch-Pagan

L'une des hypothèses centrales du théorème de Gauss-Markov est l'**homoscédasticité** : la variance des perturbations reste constante quelle que soit la conjoncture :

$$
H_0 : \\operatorname{Var}(\\varepsilon_t \\mid X_t) = \\sigma^2 \\quad \\forall t \\in \\{1, \\dots, T\\}
$$

Lorsque cette variance varie avec les facteurs explicatifs ($\\sigma_t^2 = f(X_t)$, par exemple lors d'épisodes de stress de marché), les MCO restent **sans biais**, mais ne sont plus les estimateurs à variance minimale (*BLUE* violé) et surtout **la formule usuelle $\\hat{s}^2(X'X)^{-1}$ des erreurs-types est fausse**, rendant les tests $t$ et $F$ trompeurs !

Breusch et Pagan (1979) — généralisés par Koenker (1981) sans hypothèse de normalité — testent $H_0$ via une **régression auxiliaire des résidus au carré** $\\hat{e}_t^2$ sur $X$ :

$$
\\hat{e}_t^2 = \\gamma_0 + \\gamma_1 x_{1t} + \\dots + \\gamma_K x_{Kt} + u_t, \\qquad LM = T \\cdot R^2_{\\text{aux}} \\xrightarrow{d} \\chi^2(K) \\quad \\text{sous } H_0
$$

Si $\\text{p-valeur} < 0.05$, on rejette $H_0$ : l'hétéroscédasticité est statistiquement détectée.

![Diagnostic d'Hétéroscédasticité](/images/theory/fig_v1_heteroscedasticity.png)

### 💻 Masterclass Python

La fonction \`het_breuschpagan(resid, exog)\` de \`statsmodels.stats.diagnostic\` renvoie un **tuple de 4 flottants** : \`(lm_stat, lm_pvalue, f_stat, f_pvalue)\`.

En Python, l'**unpacking de tuples avec variable muette \`_\`** permet d'extraire proprement les deux valeurs qui nous intéressent sans polluer l'espace de noms avec des variables inutilisées :
\`\`\`python
lm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)
\`\`\`

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.diagnostic import het_breuschpagan

# 1. Script autonome : on estime d'abord le modèle de crédit complet
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()

# 2. Unpacking des 4 sorties : on conserve LM et sa p-valeur, on ignore F via '_'
lm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions à la main sur \`df\` que la statistique LM retournée par \`het_breuschpagan\` vaut exactement $T \\times R^2_{\\text{aux}} = 16 \\times R^2_{\\text{aux}}$ :

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.diagnostic import het_breuschpagan

X_c = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
m = sm.OLS(df['spread_credit_bbb'], X_c).fit()
m_aux = sm.OLS(m.resid**2, X_c).fit()
lm_man = len(df) * m_aux.rsquared
lm_bp, pval_bp, _, _ = het_breuschpagan(m.resid, X_c)
print(f"T * R2_aux = 16 * {m_aux.rsquared:.4f} = {lm_man:.3f}")
print(f"het_breuschpagan -> LM = {lm_bp:.3f} | p-val = {pval_bp:.4f}")
\`\`\`

\`\`\`text
T * R2_aux = 16 * 0.3667 = 5.867
het_breuschpagan -> LM = 5.867 | p-val = 0.1183
\`\`\`

Avec $LM = 5.867$ et $p = 0.1183 > 0.05$, le test ne rejette pas formellement $H_0$ à $5\\%$ — mais attention : avec seulement $T = 16$ trimestres, sa puissance statistique est faible, ce qui impose d'auditer tout de même les erreurs-types robustes (\`HC3\`) !
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Rédigez un **script autonome** (ré-estimez \`X_credit\` et \`model_credit\` dans votre code) :
1. Importez \`statsmodels.api as sm\` et \`het_breuschpagan\` depuis \`statsmodels.stats.diagnostic\`.
2. Ajustez \`model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\` avec \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\`.
3. Dépaquetez les 4 valeurs renvoyées par \`het_breuschpagan(model_credit.resid, X_credit)\` pour stocker **\`lm_bp\`** et **\`pval_bp\`** (\`lm_bp, pval_bp, _, _ = ...\`) et affichez-les.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.diagnostic import het_breuschpagan\n\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nmodel_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\nlm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)\nprint(f'Statistique LM Breusch-Pagan : {lm_bp:.3f} | P-valeur : {pval_bp:.4f}')",
      testPythonCode: "assert 'lm_bp' in globals() and 'pval_bp' in globals()\nassert 0.0 <= pval_bp <= 1.0",
      hints: ["lm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le test de Breusch-Pagan vérifie l'homoscédasticité $H_0 : \\operatorname{Var}(\\varepsilon_t \\mid X_t) = \\sigma^2$ par la statistique $LM = T \\cdot R^2_{\\text{aux}} \\sim \\chi^2(K)$. Comme ce laboratoire est un **script autonome**, vous devez d'abord reconstruire \`X_credit\` et ré-estimer **\`model_credit\`**, puis appeler \`het_breuschpagan(model_credit.resid, X_credit)\` en dépaquetant ses $4$ retours via \`lm_bp, pval_bp, _, _\` pour récupérer **\`lm_bp\`** et **\`pval_bp\`**.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et \`het_breuschpagan\` depuis \`statsmodels.stats.diagnostic\`.`,
          `Ré-estimez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\` et \`model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\`.`,
          `Dépaquetez les $4$ sorties du test : \`lm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)\`.`,
          `Affichez \`lm_bp\` et \`pval_bp\` dans une *f-string*.`,
        ],
        concepts: [
          {
            symbol: "X_credit / model_credit",
            kind: "Variable",
            roleInExercise: "Objets du modèle multivarié de crédit à ré-estimer impérativement dans ce script autonome avant de tester ses résidus.",
          },
          {
            symbol: "het_breuschpagan(resid, exog_het)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de `statsmodels.stats.diagnostic` réalisant la régression auxiliaire de $\\hat{e}_t^2$ sur $X$ et renvoyant un tuple de $4$ flottants `(lm, lm_pvalue, fvalue, f_pvalue)`.",
          },
          {
            symbol: "model_credit.resid",
            kind: "Paramètre",
            roleInExercise: "Série des résidus MCO $\\hat{e}_t$ du modèle de crédit passée en 1er argument au test.",
          },
          {
            symbol: "X_credit",
            kind: "Paramètre",
            roleInExercise: "Matrice des régresseurs (avec constante) passée en 2e argument pour expliquer les carrés des résidus.",
          },
          {
            symbol: "lm_bp, pval_bp, _, _",
            kind: "Syntaxe",
            roleInExercise: "Dépaquetage (*unpacking*) d'un tuple de $4$ éléments : les deux premiers sont stockés dans `lm_bp` et `pval_bp`, tandis que les variables muettes `_` ignorent proprement les $2$ statistiques $F$ restantes.",
          },
          {
            symbol: "lm_bp / pval_bp",
            kind: "Variable",
            roleInExercise: "Statistique du multiplicateur de Lagrange ($LM \\approx 5.867$) et sa p-valeur ($\\approx 0.1183$) vérifiées par `testPythonCode`.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et het_breuschpagan
import statsmodels.api as sm
from statsmodels.stats.diagnostic import het_breuschpagan

# Étape 2 : Ré-estimer de façon autonome X_credit et model_credit
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()

# Étape 3 : Dépaqueter les 4 sorties en ignorant les 2 dernières avec _, _
lm_bp, pval_bp, ___, ___ = het_breuschpagan(model_credit.___, ___)

# Étape 4 : Afficher la statistique LM et sa p-valeur
print(f"Statistique LM Breusch-Pagan : {lm_bp:.3f} | P-valeur : {pval_bp:.4f}")`,
      },
    },
    {
      id: "py-46",
      title: "20. Écarts-types robustes HC3 pour petits échantillons",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Comparez les écarts-types OLS standards à l'estimateur robuste HC3 recommandé quand N est faible.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Estimateur Sandwich \`HC3\` et Points Leviers en Petit Échantillon

Pour garantir une inférence valide sans supposer l'homoscédasticité, Halbert White (1980) propose une famille d'estimateurs de covariance **Sandwich** :

$$
\\widehat{\\operatorname{Var}}_{\\text{HC}}(\\hat{\\beta}) = (X'X)^{-1} \\left( \\sum_{t=1}^T \\omega_t \\, \\hat{e}_t^2 \\, x_t x_t' \\right) (X'X)^{-1}
$$

Comme la variance conditionnelle des résidus MCO vérifie $\\operatorname{Var}(\\hat{e}_t \\mid X) = (1 - h_{tt})\\sigma_t^2 < \\sigma_t^2$ (où $h_{tt} = x_t'(X'X)^{-1}x_t \\in [0, 1)$ est l'**effet de levier** de l'observation $t$), l'estimateur brut \`HC0\` ($\\omega_t = 1$) sous-estime systématiquement les erreurs-types lorsque $T$ est faible.

MacKinnon et White (1985) proposent l'estimateur **\`HC3\`** — recommandé par Long & Ervin (2000) pour tout échantillon $T < 250$ — qui pondère chaque carré résiduel par le carré inverse de $(1 - h_{tt})$ :

$$
\\omega_t^{\\text{HC3}} = \\frac{1}{(1 - h_{tt})^2}
$$

> 💡 **Propriété d'invariance des coefficients :**
>
> Changer \`cov_type\` de \`'nonrobust'\` à \`'HC3'\` **ne modifie jamais** les coefficients estimés $\\hat{\\beta}$ (\`model.params\` reste strictement identique). Seules les erreurs-types (\`.bse\`), statistiques $t$, p-valeurs et intervalles de confiance sont corrigés !

### 💻 Masterclass Python

En Statsmodels, il suffit de passer l'argument \`cov_type='HC3'\` à \`.fit()\` :
\`\`\`python
model_hc3 = sm.OLS(y, X_credit).fit(cov_type='HC3')
\`\`\`
On peut également inspecter directement le levier $h_{tt}$ de chaque trimestre via \`model_std.get_influence().hat_matrix_diag\` pour comprendre quelles observations atypiques pilotent la correction \`HC3\`.

\`\`\`python
import statsmodels.api as sm

# 1. Préparation autonome de X_credit et y
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
y = df['spread_credit_bbb']

# 2. Comparaison OLS standard vs covariance robuste HC3
m_ols = sm.OLS(y, X_credit).fit()
m_hc3 = sm.OLS(y, X_credit).fit(cov_type='HC3')

# 3. Vérification : les paramètres sont identiques, seuls .bse et .pvalues changent
assert (m_ols.params == m_hc3.params).all()
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Analysons les 3 plus gros effets de levier $h_{tt}$ sur \`df\` et comparons les écarts-types \`OLS\`, \`HC1\` et \`HC3\` du modèle de crédit :

\`\`\`python
import pandas as pd
import statsmodels.api as sm

X_c = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
y = df['spread_credit_bbb']
m_std = sm.OLS(y, X_c).fit()
m_hc1 = sm.OLS(y, X_c).fit(cov_type='HC1')
m_hc3 = sm.OLS(y, X_c).fit(cov_type='HC3')
hat = m_std.get_influence().hat_matrix_diag
top_lev = pd.DataFrame({'periode': df['periode'], 'pib': df['pib_croissance'], 'h_tt': hat, 'poids_HC3': 1/(1-hat)**2}).sort_values('h_tt', ascending=False).head(3)
print("Top 3 points leviers :")
print(top_lev.round(3).to_string(index=False))
comp = pd.DataFrame({'SE_OLS': m_std.bse, 'SE_HC1': m_hc1.bse, 'SE_HC3': m_hc3.bse, 'pval_HC3': m_hc3.pvalues})
print("\\nComparaison des erreurs standards :")
print(comp.round(4))
\`\`\`

\`\`\`text
Top 3 points leviers :
periode   pib  h_tt  poids_HC3
2020-Q3  18.2 0.768     18.646
2020-Q2 -11.8 0.452      3.332
2023-Q4   0.1 0.340      2.298

Comparaison des erreurs standards :
                SE_OLS  SE_HC1  SE_HC3  pval_HC3
const           0.0933  0.1005  0.2227    0.0000
euribor_3m      0.0355  0.0253  0.0301    0.0007
inflation_hicp  0.0185  0.0195  0.0356    0.1229
pib_croissance  0.0102  0.0153  0.0487    0.8358
\`\`\`

Résultat spectaculaire : le rebond Covid de \`2020-Q3\` ($\\text{PIB} = +18.2\\%$) possède un levier $h_{tt} = 0.768$, soit un poids \`HC3\` de $\\frac{1}{(1-0.768)^2} = 18.646$ ! L'écart-type de \`pib_croissance\` quintuple ($0.0102 \\to 0.0487$) et la p-valeur de \`inflation_hicp\` passe à \`0.1229\` (non significative à $5\\%$ une fois le levier pris en compte).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Définissez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\` et \`y = df['spread_credit_bbb']\`.
2. Ajustez **\`model_std = sm.OLS(y, X_credit).fit()\`** puis **\`model_hc3 = sm.OLS(y, X_credit).fit(cov_type='HC3')\`**.
3. Comparez \`model_std.bse\` et \`model_hc3.bse\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\ny = df['spread_credit_bbb']\nmodel_std = sm.OLS(y, X_credit).fit()\nmodel_hc3 = sm.OLS(y, X_credit).fit(cov_type='HC3')\nprint('SE OLS classique :\\n', model_std.bse.round(4))\nprint('SE robustes HC3 :\\n', model_hc3.bse.round(4))",
      testPythonCode: "assert 'model_std' in globals() and 'model_hc3' in globals()\nassert (model_std.params == model_hc3.params).all()",
      hints: [".fit(cov_type='HC3') laisse les coefficients identiques mais corrige .bse et .pvalues."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la matrice Sandwich \`HC3\` pondère chaque résidu au carré par $\\omega_t = (1 - h_{tt})^{-2}$ pour corriger le biais sur petit échantillon ($T = 16$) lié aux points leviers. Dans un script autonome sur \`df\`, vous ajustez le même modèle \`spread_credit_bbb ~ const + euribor_3m + inflation_hicp + pib_croissance\` de deux manières : \`.fit()\` dans **\`model_std\`** et \`.fit(cov_type='HC3')\` dans **\`model_hc3\`**, puis vous comparez leurs erreurs-types via \`.bse\`.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\`, construisez \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\` et \`y = df['spread_credit_bbb']\`.`,
          `Estimez le modèle classique \`model_std = sm.OLS(y, X_credit).fit()\`.`,
          `Estimez le modèle corrigé des points leviers \`model_hc3 = sm.OLS(y, X_credit).fit(cov_type='HC3')\`.`,
          `Affichez \`model_std.bse.round(4)\` et \`model_hc3.bse.round(4)\` pour observer la hausse des erreurs-types.`,
        ],
        concepts: [
          {
            symbol: "X_credit / y",
            kind: "Variable",
            roleInExercise: "Matrice des régresseurs (avec constante) et variable cible `spread_credit_bbb`, à définir localement dans ce script autonome.",
          },
          {
            symbol: ".fit()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule l'estimation MCO et la covariance homoscédastique standard $\\hat{s}^2 (X'X)^{-1}$.",
          },
          {
            symbol: "cov_type='HC3'",
            kind: "Paramètre",
            roleInExercise: "Option de `.fit()` activant la matrice de covariance robuste de MacKinnon-White (`HC3`), recommandée dès que $T < 250$. Les `.params` ne changent pas.",
          },
          {
            symbol: "model_std",
            kind: "Variable",
            roleInExercise: "Modèle OLS non robuste de référence exigé par `testPythonCode`.",
          },
          {
            symbol: "model_hc3",
            kind: "Variable",
            roleInExercise: "Modèle OLS avec erreurs-types HC3 exigé par la validation (`assert (model_std.params == model_hc3.params).all()`).",
          },
          {
            symbol: ".bse",
            kind: "Paramètre",
            roleInExercise: "Attribut (`pd.Series`) contenant les erreurs-types (*Basic Standard Errors*) $\\widehat{\\operatorname{SE}}(\\hat{\\beta}_j)$ de chaque paramètre.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et préparer X_credit et y de manière autonome
import statsmodels.api as sm
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
y = df['spread_credit_bbb']

# Étape 2 : Ajuster le modèle standard puis le modèle robuste HC3
model_std = sm.OLS(y, X_credit).___()
model_hc3 = sm.OLS(y, X_credit).___(cov_type='A_COMPLETER')

# Étape 3 : Comparer les erreurs-types .bse des deux estimations
print("SE OLS classique :\\n", model_std.___.round(4))
print("SE robustes HC3 :\\n", model_hc3.___.round(4))`,
      },
    },
    {
      id: "py-47",
      title: "21. Normalité des résidus : Skewness, Kurtosis & Jarque-Bera",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Contrôlez l'asymétrie, l'aplatissement et la normalité des résidus du modèle de crédit.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Asymétrie, Kurtosis et Test de Normalité de Jarque-Bera

Sur un échantillon modeste ($T = 16$), le Théorème Central Limite ne garantit pas l'approximation gaussienne des lois d'inférence : la validité exacte des lois de Student et Fisher repose sur la normalité des perturbations $\\varepsilon_t \\sim \\mathcal{N}(0, \\sigma^2)$. Des résidus asymétriques ou à queues épaisses signalent soit des chocs extrêmes mal modélisés, soit une variable omise non linéaire.

Jarque et Bera (1980) testent conjointement la normalité via les moments empiriques centrés-réduits d'ordre 3 (**Skewness** $S$) et d'ordre 4 (**Kurtosis** $K$) des résidus :

$$
S = \\frac{\\frac{1}{T}\\sum_{t=1}^T \\hat{e}_t^3}{\\left(\\frac{1}{T}\\sum_{t=1}^T \\hat{e}_t^2\\right)^{3/2}}, \\qquad K = \\frac{\\frac{1}{T}\\sum_{t=1}^T \\hat{e}_t^4}{\\left(\\frac{1}{T}\\sum_{t=1}^T \\hat{e}_t^2\\right)^2}
$$

Pour une loi normale idéale, $S = 0$ (symétrie) et $K = 3$ (aplatissement mésokurtique). La statistique de test agrège ces deux écarts quadratiques :

$$
JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\xrightarrow{d} \\chi^2(2) \\quad \\text{sous } H_0 \\text{ (normalité)}
$$

Si la p-valeur dépasse $0.05$, on ne rejette pas l'hypothèse de normalité des résidus.

![Asymétrie et Queues Épaisses](/images/theory/fig_fat_tails_jarque_bera.png)

### 💻 Masterclass Python

La fonction \`jarque_bera(resids)\` de \`statsmodels.stats.stattools\` retourne un tuple de **4 valeurs** : \`(jb_stat, p_value, skewness, kurtosis)\`.

Point de vigilance inter-bibliothèques : \`statsmodels.stats.stattools.jarque_bera\` renvoie le **kurtosis total** ($K = 3$ pour une normale), alors que \`scipy.stats.kurtosis\` renvoie par défaut l'**excès de kurtosis** ($K - 3 = 0$ pour une normale, \`fisher=True\`) ! Pensez également à convertir la décision finale en \`bool(pval_jb_c > 0.05)\`.

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.stattools import jarque_bera

# 1. Script autonome : ré-estimation préalable de model_credit
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()

# 2. Unpacking des 4 sorties de jarque_bera (kurt est le kurtosis total, réf = 3)
jb_stat, pval_jb, skew, kurt = jarque_bera(model_credit.resid)
normalite = bool(pval_jb > 0.05)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions numériquement sur \`model_credit.resid\` la formule $JB = \\frac{16}{6}\\left(S^2 + \\frac{(K-3)^2}{4}\\right)$ et l'écart de kurtosis par rapport à $3$ :

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.stattools import jarque_bera

X_c = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
m = sm.OLS(df['spread_credit_bbb'], X_c).fit()
jb, pval, skew, kurt = jarque_bera(m.resid)
jb_man = (len(df) / 6.0) * (skew**2 + ((kurt - 3.0)**2) / 4.0)
print(f"Skew = {skew:.4f} | Kurt = {kurt:.4f} (exces = {kurt-3:.4f})")
print(f"JB manuel = {jb_man:.4f} | JB Statsmodels = {jb:.4f} | p-val = {pval:.4f}")
\`\`\`

\`\`\`text
Skew = 0.1741 | Kurt = 1.8474 (exces = -1.1526)
JB manuel = 0.9664 | JB Statsmodels = 0.9664 | p-val = 0.6168
\`\`\`

Avec $S = +0.174$, $K = 1.847$ (distribution légèrement platykurtique) et $JB = 0.9664$ ($p = 0.6168 > 0.05$), l'hypothèse de normalité des résidus du modèle de crédit n'est pas rejetée.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Rédigez un **script autonome** (ré-estimez \`model_credit\` sur \`spread_credit_bbb ~ const + euribor_3m + inflation_hicp + pib_croissance\`) :
1. Importez \`statsmodels.api as sm\` et \`jarque_bera\` depuis \`statsmodels.stats.stattools\`.
2. Appelez **\`jb_c, pval_jb_c, skew_c, kurt_c = jarque_bera(model_credit.resid)\`**.
3. Créez le booléen Python natif **\`normalite_ok = bool(pval_jb_c > 0.05)\`** et affichez le bilan complet.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.stattools import jarque_bera\n\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nmodel_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\njb_c, pval_jb_c, skew_c, kurt_c = jarque_bera(model_credit.resid)\nnormalite_ok = bool(pval_jb_c > 0.05)\nprint(f'JB={jb_c:.3f} | p={pval_jb_c:.4f} | Skew={skew_c:.2f} | Kurt={kurt_c:.2f} | Normale={normalite_ok}')",
      testPythonCode: "assert 'jb_c' in globals() and 'normalite_ok' in globals()\nassert jb_c >= 0",
      hints: ["jarque_bera(model_credit.resid) renvoie un tuple de 4 valeurs."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la statistique $JB = \\frac{T}{6}\\left(S^2 + \\frac{(K-3)^2}{4}\\right) \\sim \\chi^2(2)$ teste conjointement la symétrie ($S=0$) et l'aplatissement gaussien ($K=3$). Dans ce script autonome sur \`df\`, vous ré-estimez d'abord **\`model_credit\`** (\`spread_credit_bbb ~ const + euribor_3m + inflation_hicp + pib_croissance\`), dépaquetez les $4$ sorties de \`jarque_bera(model_credit.resid)\` dans **\`jb_c\`**, \`pval_jb_c\`, \`skew_c\`, \`kurt_c\`, et traduisez le non-rejet à $5\\%$ en **\`normalite_ok = bool(pval_jb_c > 0.05)\`**.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et \`jarque_bera\` depuis \`statsmodels.stats.stattools\`.`,
          `Ré-estimez de manière autonome \`X_credit\` et \`model_credit\` sur \`df['spread_credit_bbb']\`.`,
          `Dépaquetez les $4$ retours : \`jb_c, pval_jb_c, skew_c, kurt_c = jarque_bera(model_credit.resid)\`.`,
          `Calculez \`normalite_ok = bool(pval_jb_c > 0.05)\` et affichez les $5$ indicateurs via une *f-string*.`,
        ],
        concepts: [
          {
            symbol: "X_credit / model_credit",
            kind: "Variable",
            roleInExercise: "Modèle multivarié du spread BBB à ré-estimer en tête de ce script autonome avant d'inspecter ses résidus.",
          },
          {
            symbol: "jarque_bera(resids)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de `statsmodels.stats.stattools` calculant asymétrie, kurtosis et test $\\chi^2(2)$ et retournant un tuple de $4$ flottants.",
          },
          {
            symbol: "model_credit.resid",
            kind: "Paramètre",
            roleInExercise: "Vecteur des $16$ résidus MCO $\\hat{e}_t$ passé en entrée de `jarque_bera(...)`.",
          },
          {
            symbol: "jb_c, pval_jb_c, skew_c, kurt_c",
            kind: "Syntaxe",
            roleInExercise: "Dépaquetage (*unpacking*) en $4$ variables distinctes dans l'ordre exact de retour. Attention : `kurt_c` est le kurtosis total (référence $= 3$), et non l'excès autour de $0$.",
          },
          {
            symbol: "jb_c",
            kind: "Variable",
            roleInExercise: "Statistique $JB \\ge 0$ exigée par `testPythonCode`.",
          },
          {
            symbol: "bool(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit le booléen NumPy `pval_jb_c > 0.05` en booléen Python natif (`True`/`False`).",
          },
          {
            symbol: "normalite_ok",
            kind: "Variable",
            roleInExercise: "Décision booléenne vérifiée par la validation : `True` lorsque $p > 0.05$ (normalité non rejetée).",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et jarque_bera
import statsmodels.api as sm
from statsmodels.stats.stattools import jarque_bera

# Étape 2 : Ré-estimer X_credit et model_credit de façon autonome
X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])
model_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()

# Étape 3 : Dépaqueter les 4 sorties de jarque_bera sur les résidus
jb_c, pval_jb_c, skew_c, kurt_c = ___(model_credit.___)

# Étape 4 : Décider la normalité au seuil de 5% et afficher le bilan
normalite_ok = bool(___ > 0.05)
print(f"JB={jb_c:.3f} | p={pval_jb_c:.4f} | Skew={skew_c:.2f} | Kurt={kurt_c:.2f} | Normale={normalite_ok}")`,
      },
    },
    {
      id: "py-48",
      title: "22. Autocorrélation des résidus en niveau (Durbin-Watson)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Mesurez la persistance temporelle des résidus du modèle spread_credit_bbb ~ inflation_hicp.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Autocorrélation Sérielle et Statistique de Durbin-Watson

Sur des séries temporelles trimestrielles régressées en **niveau** (taux, spreads), les chocs macroéconomiques persistent d'un trimestre à l'autre : si le modèle sous-estime le spread à la date $t$, il tend à le sous-estimer encore à $t+1$ ($\\operatorname{Cov}(\\varepsilon_t, \\varepsilon_{t-1}) > 0$). Cette **autocorrélation d'ordre 1** invalide les écarts-types MCO classiques en les sous-estimant massivement et peut révéler une **régression fallacieuse** (*spurious regression*, Granger & Newbold 1974).

Durbin et Watson (1950) mesurent ce lien sériel à partir des écarts successifs entre résidus consécutifs :

$$
DW = \\frac{\\sum_{t=2}^T (\\hat{e}_t - \\hat{e}_{t-1})^2}{\\sum_{t=1}^T \\hat{e}_t^2} \\approx \\frac{2\\sum \\hat{e}_t^2 - 2\\sum \\hat{e}_t \\hat{e}_{t-1}}{\\sum \\hat{e}_t^2} = 2(1 - \\hat{\\rho}_1) \\in [0, 4]
$$

- **$DW \\approx 2$** ($\\hat{\\rho}_1 \\approx 0$) : absence d'autocorrélation d'ordre 1 (résidus blancs).
- **$DW < 1.5$** ($\\hat{\\rho}_1 > 0.25$) : autocorrélation positive marquée (mémoire persistante).
- **$DW \\to 0$** ($\\hat{\\rho}_1 \\to 1$) : signal fort de non-stationnarité résiduelle ; la règle empirique de Granger-Newbold stipule que dès que **$R^2 > DW$**, le modèle en niveau est suspect de corrélation fallacieuse !

![Régression Spurieuse et Autocorrélation](/images/theory/fig_v1_spurious_regression.png)

### 💻 Masterclass Python

\`durbin_watson(resid)\` de \`statsmodels.stats.stattools\` calcule directement la statistique exacte (qui est d'ailleurs aussi affichée dans le bloc inférieur du \`.summary()\`).

Limite méthodologique à connaître : le test de Durbin-Watson ne détecte que l'autocorrélation d'**ordre 1** et devient biaisé vers $2$ si la variable retardée $y_{t-1}$ figure parmi les régresseurs (modèle autorégressif). Dans ce cas, on utilise le test de **Breusch-Godfrey** (\`acorr_breusch_godfrey\`).

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

# 1. Script autonome : estimation du modèle en niveau spread ~ const + inflation
X = sm.add_constant(df[['inflation_hicp']])
model_spread = sm.OLS(df['spread_credit_bbb'], X).fit()

# 2. Calcul de la statistique DW et de l'autocorrélation empirique d'ordre 1
dw_val = float(durbin_watson(model_spread.resid))
rho1 = float(model_spread.resid.autocorr(lag=1))
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions sur le modèle en niveau \`spread_credit_bbb ~ const + inflation_hicp\` le lien exact entre $DW$, $\\hat{\\rho}_1$ et la règle d'alerte $R^2 > DW$ :

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

X = sm.add_constant(df[['inflation_hicp']])
m = sm.OLS(df['spread_credit_bbb'], X).fit()
dw = float(durbin_watson(m.resid))
rho1 = float(m.resid.autocorr(lag=1))
print(f"R2 = {m.rsquared:.4f} | Durbin-Watson = {dw:.4f} | rho_1 = {rho1:.4f}")
print(f"Approximation 2*(1 - rho_1) = {2*(1 - rho1):.4f}")
print(f"Alerte Granger-Newbold (R2 > DW) : {m.rsquared > dw}")
\`\`\`

\`\`\`text
R2 = 0.4493 | Durbin-Watson = 0.3532 | rho_1 = 0.8145
Approximation 2*(1 - rho_1) = 0.3710
Alerte Granger-Newbold (R2 > DW) : True
\`\`\`

Avec $\\hat{\\rho}_1 = 0.8145$ et $DW = 0.3532 < R^2 = 0.4493$, l'alerte de Granger-Newbold se déclenche : régresser le spread sur l'inflation en niveau laisse une très forte persistance dans les résidus.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Rédigez un **script autonome** (ré-estimez \`model_spread\` sur \`spread_credit_bbb ~ const + inflation_hicp\`) :
1. Importez \`statsmodels.api as sm\` et \`durbin_watson\` depuis \`statsmodels.stats.stattools\`.
2. Ajustez \`model_spread = sm.OLS(df['spread_credit_bbb'], sm.add_constant(df[['inflation_hicp']])).fit()\`.
3. Calculez **\`dw_spread = float(durbin_watson(model_spread.resid))\`** et affichez sa valeur.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.stattools import durbin_watson\n\nX = sm.add_constant(df[['inflation_hicp']])\nmodel_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\ndw_spread = float(durbin_watson(model_spread.resid))\nprint(f'Durbin-Watson (spread ~ inflation) : {dw_spread:.4f}')",
      testPythonCode: "assert 'dw_spread' in globals()\nassert 0.0 <= dw_spread <= 4.0",
      hints: ["durbin_watson(model_spread.resid)"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la statistique de Durbin-Watson $DW = \\frac{\\sum_{t=2}^T (\\hat{e}_t - \\hat{e}_{t-1})^2}{\\sum_{t=1}^T \\hat{e}_t^2} \\approx 2(1 - \\hat{\\rho}_1) \\in [0, 4]$ diagnostique l'autocorrélation d'ordre 1 des résidus. Comme ce script est autonome, ré-estimez d'abord **\`model_spread\`** (\`spread_credit_bbb ~ const + inflation_hicp\`) sur \`df\`, puis passez \`model_spread.resid\` à \`durbin_watson(...)\` pour stocker la statistique dans **\`dw_spread\`**.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et \`durbin_watson\` depuis \`statsmodels.stats.stattools\`.`,
          `Ré-estimez \`X = sm.add_constant(df[['inflation_hicp']])\` et \`model_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\`.`,
          `Calculez \`dw_spread = float(durbin_watson(model_spread.resid))\` et affichez sa valeur à $4$ décimales.`,
        ],
        concepts: [
          {
            symbol: "X / model_spread",
            kind: "Variable",
            roleInExercise: "Modèle simple en niveau `spread_credit_bbb ~ const + inflation_hicp`, à ré-estimer obligatoirement au début de ce script autonome.",
          },
          {
            symbol: "durbin_watson(resids)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de `statsmodels.stats.stattools` mesurant l'autocorrélation sérielle d'ordre 1 ($DW \\approx 2$ si nulle, $DW \\ll 1.5$ si persistance positive).",
          },
          {
            symbol: "model_spread.resid",
            kind: "Paramètre",
            roleInExercise: "Série chronologique des $16$ résidus MCO $\\hat{e}_t$ passée en argument à `durbin_watson(...)`.",
          },
          {
            symbol: "float(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit le scalaire NumPy retourné par `durbin_watson` en `float` Python standard.",
          },
          {
            symbol: "dw_spread",
            kind: "Variable",
            roleInExercise: "Statistique de Durbin-Watson ($\\approx 0.3532 < R^2$, alerte de Granger-Newbold) vérifiée par `0.0 <= dw_spread <= 4.0`.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et durbin_watson
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

# Étape 2 : Ré-estimer model_spread en niveau dans ce script autonome
X = sm.add_constant(df[['inflation_hicp']])
model_spread = sm.OLS(df['spread_credit_bbb'], X).fit()

# Étape 3 : Calculer la statistique DW sur model_spread.resid
dw_spread = float(___(model_spread.___))
print(f"Durbin-Watson (spread ~ inflation) : {dw_spread:.4f}")`,
      },
    },
    {
      id: "py-49",
      title: "23. Test ADF en niveau vs en différence première",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 12,
      description: "Comparez le résultat du test de Dickey-Fuller Augmenté sur l'Euribor en niveau et différencié.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Racine Unitaire et Test de Dickey-Fuller Augmenté (ADF)

Une série temporelle est **stationnaire au second ordre** ($I(0)$) si sa moyenne, sa variance et ses autocovariances sont constantes dans le temps. À l'opposé, une marche aléatoire $y_t = y_{t-1} + \\varepsilon_t$ est **intégrée d'ordre 1** ($I(1)$) : sa variance croît linéairement avec le temps ($\\operatorname{Var}(y_t) = t\\,\\sigma^2$) et chaque choc a un effet permanent.

Partant du modèle autorégressif $y_t = \\alpha + \\rho y_{t-1} + \\varepsilon_t$ et en retranchant $y_{t-1}$ aux deux membres, le **test de Dickey-Fuller Augmenté (ADF)** ajoute $p$ retards différenciés pour blanchir d'éventuelles autocorrélations de court terme :

$$
\\Delta y_t = \\alpha + \\gamma y_{t-1} + \\sum_{k=1}^p \\delta_k \\Delta y_{t-k} + \\varepsilon_t \\qquad (\\text{où } \\gamma = \\rho - 1)
$$

- **Hypothèse nulle $H_0$** : $\\gamma = 0$ ($\\rho = 1$, présence d'une **racine unitaire**, série non stationnaire).
- **Hypothèse alternative $H_1$** : $\\gamma < 0$ ($\\rho < 1$, processus stationnaire à retour vers la moyenne).

Sous $H_0$, la statistique $t_{\\text{ADF}} = \\hat{\\gamma}/\\widehat{\\operatorname{SE}}(\\hat{\\gamma})$ ne suit pas une loi de Student mais la distribution asymétrique tabulée par **MacKinnon** (des valeurs très négatives sont requises pour rejeter $H_0$).

> ⚠️ **Nuance essentielle sur petit échantillon ($T = 16$) :**
>
> La puissance statistique du test ADF est faible sur de courtes séries soumises à un basculement de régime (hausse continue de l'Euribor en 2022–2023). Ne pas rejeter $H_0$ avec $T = 16$ ne prouve pas formellement $H_0$, mais incite par prudence économétrique à modéliser les séries en **différences premières**.

### 💻 Masterclass Python

\`adfuller(serie)\` de \`statsmodels.tsa.stattools\` retourne un tuple de 6 éléments :
\`(adf_stat, p_value, usedlag, nobs, critical_values_dict, icbest)\`.
- L'indice \`[1]\` extrait directement la p-valeur de MacKinnon.
- **Piège classique sur \`.diff()\`** : \`df['euribor_3m'].diff()\` place obligatoirement un \`NaN\` à la première ligne (car $y_0 - y_{-1}$ n'existe pas). Si vous oubliez **\`.dropna()\`**, \`adfuller()\` lève immédiatement une \`MissingDataError\` !

\`\`\`python
from statsmodels.tsa.stattools import adfuller

# 1. Test ADF en niveau : indice [1] = p-valeur de MacKinnon
res_niveau = adfuller(df['euribor_3m'])
pval_niveau = float(res_niveau[1])

# 2. Différence première : .dropna() est OBLIGATOIRE pour retirer le NaN initial
serie_diff = df['euribor_3m'].diff().dropna()
pval_diff = float(adfuller(serie_diff)[1])
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Inspectons toutes les composantes retournées par \`adfuller()\` (statistique ADF, p-valeur, retards retenus \`lags\`, observations utiles \`nobs\` et seuil critique à $5\\%$) sur \`euribor_3m\` en niveau puis différencié :

\`\`\`python
from statsmodels.tsa.stattools import adfuller

res_niv = adfuller(df['euribor_3m'])
res_dif = adfuller(df['euribor_3m'].diff().dropna())
print(f"Niveau     : ADF={res_niv[0]:.3f} | p={res_niv[1]:.4f} | lags={res_niv[2]} | nobs={res_niv[3]} | critique 5%={res_niv[4]['5%']:.3f}")
print(f"Différence : ADF={res_dif[0]:.3f} | p={res_dif[1]:.4f} | lags={res_dif[2]} | nobs={res_dif[3]} | critique 5%={res_dif[4]['5%']:.3f}")
\`\`\`

\`\`\`text
Niveau     : ADF=-1.529 | p=0.5192 | lags=6 | nobs=9 | critique 5%=-3.290
Différence : ADF=-1.949 | p=0.3095 | lags=1 | nobs=13 | critique 5%=-3.127
\`\`\`

En niveau, $ADF = -1.529 > -3.290$ ($p = 0.5192$) confirme la non-stationnarité manifeste de l'Euribor. En différence première, la statistique devient plus négative ($-1.949$, $p = 0.3095$), mais la persistance des hausses de taux successives en 2022–2023 sur seulement $13$ observations exploitables limite la puissance du rejet à $5\\%$.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Importez \`adfuller\` depuis \`statsmodels.tsa.stattools\`.
2. Calculez la p-valeur en niveau **\`pval_niv = float(adfuller(df['euribor_3m'])[1])\`**.
3. Calculez la p-valeur en différence première **\`pval_diff = float(adfuller(df['euribor_3m'].diff().dropna())[1])\`** (sans oublier \`.dropna()\`).
4. Affichez les deux p-valeurs.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "from statsmodels.tsa.stattools import adfuller\n\npval_niv = float(adfuller(df['euribor_3m'])[1])\npval_diff = float(adfuller(df['euribor_3m'].diff().dropna())[1])\nprint(f'ADF en niveau p-val : {pval_niv:.4f}')\nprint(f'ADF en différence p-val : {pval_diff:.4f}')",
      testPythonCode: "assert 'pval_niv' in globals() and 'pval_diff' in globals()\nassert 0.0 <= pval_niv <= 1.0 and 0.0 <= pval_diff <= 1.0",
      hints: ["adfuller(serie)[1] extrait directement la p-valeur."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, le test ADF teste l'hypothèse nulle de racine unitaire $H_0 : \\gamma = 0$ (non-stationnarité) sur la série en niveau $y_t$ puis en différence première $\\Delta y_t = y_t - y_{t-1}$. En Python sur \`df['euribor_3m']\`, la fonction \`adfuller(...)\` retourne un tuple de $6$ éléments dont l'indice **\`[1]\`** contient la p-valeur de MacKinnon : on l'extrait directement dans **\`pval_niv\`** (niveau) et **\`pval_diff\`** (après \`.diff().dropna()\`).`,
        stepByStepPlan: [
          `Importez \`adfuller\` depuis \`statsmodels.tsa.stattools\`.`,
          `Calculez la p-valeur en niveau via \`pval_niv = float(adfuller(df['euribor_3m'])[1])\`.`,
          `Différenciez la série et supprimez le \`NaN\` initial avec \`.diff().dropna()\`, puis extrayez la p-valeur dans \`pval_diff = float(adfuller(...)[1])\`.`,
          `Affichez \`pval_niv\` et \`pval_diff\` à $4$ décimales.`,
        ],
        concepts: [
          {
            symbol: "adfuller(x)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de `statsmodels.tsa.stattools` exécutant le test de Dickey-Fuller Augmenté et retournant un tuple de $6$ éléments `(adf_stat, p_value, usedlag, nobs, crit_vals, icbest)`.",
          },
          {
            symbol: "adfuller(...)[1]",
            kind: "Syntaxe",
            roleInExercise: "Indexation directe à la position `1` du tuple (rappel : les indices Python commencent à `0`, donc `[0]` = statistique ADF et `[1]` = p-valeur de MacKinnon).",
          },
          {
            symbol: ".diff()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule les variations trimestrielles $\\Delta y_t = y_t - y_{t-1}$ ; la première ligne (`2020-Q1`) devient obligatoirement `NaN`.",
          },
          {
            symbol: ".dropna()",
            kind: "Fonction / Méthode",
            roleInExercise: "Supprime la valeur manquante `NaN` en tête produite par `.diff()` — indispensable, sinon `adfuller()` lève une `MissingDataError`.",
          },
          {
            symbol: "float(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit la p-valeur retournée en `float` Python natif.",
          },
          {
            symbol: "pval_niv / pval_diff",
            kind: "Variable",
            roleInExercise: "Les deux p-valeurs (en niveau puis en différence première) vérifiées par `0.0 <= pval <= 1.0`.",
          },
        ],
        guidedCode: `# Étape 1 : Importer adfuller depuis statsmodels.tsa.stattools
from statsmodels.tsa.stattools import adfuller

# Étape 2 : Extraire la p-valeur (indice [1]) du test ADF en niveau
pval_niv = float(___(df['A_COMPLETER'])[1])

# Étape 3 : Différencier avec .diff(), retirer le NaN avec .dropna(), puis extraire [1]
pval_diff = float(___(df['A_COMPLETER'].___().___())[1])

# Étape 4 : Afficher les deux p-valeurs
print(f"ADF en niveau p-val : {pval_niv:.4f}")
print(f"ADF en différence p-val : {pval_diff:.4f}")`,
      },
    },
    {
      id: "py-50",
      title: "24. Modèle dynamique en différences + Newey-West (HAC)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 12,
      description: "Estimez la sensibilité des variations du spread de crédit avec écarts-types HAC.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Modèle Dynamique en Différences et Covariance HAC de Newey-West

Pour purger une régression temporelle du risque fallacieux et de l'inférence biaisée, on combine deux protections complémentaires :
1. **Stationnarisation par différence première ($\\Delta$)** : on régresse les **variations trimestrielles** $\\Delta \\text{spread}_t = \\text{spread}_t - \\text{spread}_{t-1}$ sur $\\Delta \\pi_t$ et $\\Delta g_t$, mesurant la réaction instantanée du marché du crédit aux *surprises/variations* d'inflation et de croissance.
2. **Estimateur HAC (*Heteroskedasticity and Autocorrelation Consistent*) de Newey-West (1987)** : lorsque les erreurs restent à la fois hétéroscédastiques et corrélées dans le temps jusqu'à un retard $L$ ($\\mathbb{E}[\\varepsilon_t \\varepsilon_{t-l}] \\neq 0$), Newey-West généralise la matrice Sandwich de White :

$$
\\hat{\\Omega}_{\\text{HAC}} = \\hat{\\Gamma}_0 + \\sum_{l=1}^L w_l \\left(\\hat{\\Gamma}_l + \\hat{\\Gamma}_l'\\right), \\qquad \\hat{\\Gamma}_l = \\sum_{t=l+1}^T \\hat{e}_t \\hat{e}_{t-l} \\, x_t x_{t-l}'
$$

Pour garantir que $\\hat{\\Omega}_{\\text{HAC}}$ demeure **semi-définie positive** (variances toujours $\\ge 0$), on applique le **noyau triangulaire de Bartlett** :

$$
w_l = 1 - \\frac{l}{L + 1}
$$

Avec \`maxlags = 1\` ($L = 1$), l'autocovariance de rang 1 est pondérée à $w_1 = 1 - \\frac{1}{2} = 0.50$.

### 💻 Masterclass Python

Chaîner \`.diff().dropna()\` sur un DataFrame de $K$ colonnes supprime en une seule instruction la première ligne devenue \`NaN\` sur toutes les variables simultanément (passant de $16$ à $15$ observations alignées).

En passant \`cov_type='HAC', cov_kwds={'maxlags': 1}\` à \`.fit()\`, Statsmodels ajuste la matrice de covariance asymptotique et remplace automatiquement la colonne \`t\` du \`.summary()\` par une statistique normale asymptotique **\`z\`**.

\`\`\`python
import statsmodels.api as sm

# 1. Différenciation jointe : conserve 15 variations trimestrielles alignées
df_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()

# 2. Construction de X_d (avec constante) et y_d sur les séries stationnarisées
X_d = sm.add_constant(df_d[['inflation_hicp', 'pib_croissance']])
y_d = df_d['spread_credit_bbb']

# 3. Estimation avec écarts-types HAC de Newey-West (fenêtre de Bartlett L = 1)
model_hac = sm.OLS(y_d, X_d).fit(cov_type='HAC', cov_kwds={'maxlags': 1})
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Comparons sur les variations trimestrielles \`df_d\` l'OLS classique et la correction HAC de Newey-West (\`maxlags=1\`), ainsi que la statistique de Durbin-Watson après différenciation :

\`\`\`python
import pandas as pd
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

df_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()
X_d = sm.add_constant(df_d[['inflation_hicp', 'pib_croissance']])
y_d = df_d['spread_credit_bbb']
m_ols = sm.OLS(y_d, X_d).fit()
m_hac = sm.OLS(y_d, X_d).fit(cov_type='HAC', cov_kwds={'maxlags': 1})
comp = pd.DataFrame({'coef': m_ols.params, 'SE_OLS': m_ols.bse, 'SE_HAC': m_hac.bse, 'pval_HAC': m_hac.pvalues})
print(f"nobs = {int(m_hac.nobs)} | R2 = {m_hac.rsquared:.4f} | DW(diff) = {durbin_watson(m_hac.resid):.4f}")
print(comp.round(4))
\`\`\`

\`\`\`text
nobs = 15 | R2 = 0.3870 | DW(diff) = 1.0298
                  coef  SE_OLS  SE_HAC  pval_HAC
const           0.0056  0.0447  0.0458    0.9028
inflation_hicp  0.0815  0.0326  0.0270    0.0025
pib_croissance -0.0060  0.0047  0.0034    0.0749
\`\`\`

En différences premières, \`Durbin-Watson\` remonte de $0.35$ à $1.03$, et une hausse trimestrielle de $+1$ pt d'inflation continue d'écarter le spread BBB de $+0.0815$ pt ($+8.15\\text{ bps}$, $p_{\\text{HAC}} = 0.0025 < 0.01$) tandis qu'une hausse du PIB tend à le resserrer ($-0.0060$, $p = 0.0749$).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Créez **\`df_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()\`** ($15$ observations).
2. Ajustez **\`model_credit_hac\`** expliquant \`df_d['spread_credit_bbb']\` par \`sm.add_constant(df_d[['inflation_hicp', 'pib_croissance']])\` avec \`cov_type='HAC'\` et \`cov_kwds={'maxlags': 1}\`.
3. Affichez \`model_credit_hac.summary()\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\ndf_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()\nX_d = sm.add_constant(df_d[['inflation_hicp', 'pib_croissance']])\ny_d = df_d['spread_credit_bbb']\nmodel_credit_hac = sm.OLS(y_d, X_d).fit(cov_type='HAC', cov_kwds={'maxlags': 1})\nprint(model_credit_hac.summary())",
      testPythonCode: "assert 'model_credit_hac' in globals()\nassert model_credit_hac.nobs == 15",
      hints: ["cov_type='HAC', cov_kwds={'maxlags': 1}"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la régression en différences premières ($\\Delta \\text{spread}_t$ sur $\\Delta \\pi_t, \\Delta g_t$) supprime les tendances stochastiques et la matrice de Newey-West $\\hat{\\Omega}_{\\text{HAC}}$ (avec noyau de Bartlett $w_l = 1 - \\frac{l}{L+1}$, ici $L = 1$) corrige à la fois l'hétéroscédasticité et l'autocorrélation résiduelle. En Python, \`.diff().dropna()\` aligne $15$ variations dans \`df_d\`, et \`.fit(cov_type='HAC', cov_kwds={'maxlags': 1})\` produit **\`model_credit_hac\`** (\`nobs == 15\`).`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et créez \`df_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()\` ($15$ lignes).`,
          `Construisez \`X_d = sm.add_constant(df_d[['inflation_hicp', 'pib_croissance']])\` et \`y_d = df_d['spread_credit_bbb']\`.`,
          `Estimez \`model_credit_hac = sm.OLS(y_d, X_d).fit(cov_type='HAC', cov_kwds={'maxlags': 1})\` et affichez \`.summary()\`.`,
        ],
        concepts: [
          {
            symbol: "df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']]",
            kind: "Colonne / Table",
            roleInExercise: "Sous-ensemble des $3$ séries macro-crédit de `df` sélectionnées ensemble avant différenciation pour conserver leur alignement temporel.",
          },
          {
            symbol: ".diff().dropna()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la variation trimestrielle sur chaque colonne puis retire la 1re ligne (`2020-Q1`, devenue `NaN`), laissant exactement `15` observations (`nobs == 15`).",
          },
          {
            symbol: "df_d",
            kind: "Variable",
            roleInExercise: "DataFrame des $15$ variations trimestrielles stationnarisées.",
          },
          {
            symbol: "X_d / y_d",
            kind: "Variable",
            roleInExercise: "Matrice explicative (`const` + variations de `inflation_hicp` et `pib_croissance`) et cible (`df_d['spread_credit_bbb']`).",
          },
          {
            symbol: "cov_type='HAC'",
            kind: "Paramètre",
            roleInExercise: "Active l'estimateur de covariance de Newey-West robuste simultanément à l'hétéroscédasticité et à l'autocorrélation sérielle.",
          },
          {
            symbol: "cov_kwds={'maxlags': 1}",
            kind: "Paramètre",
            roleInExercise: "Dictionnaire d'arguments supplémentaires fixant la troncature maximale à $L = 1$ retard dans le noyau triangulaire de Bartlett.",
          },
          {
            symbol: "model_credit_hac",
            kind: "Variable",
            roleInExercise: "Modèle dynamique ajusté vérifié par `assert model_credit_hac.nobs == 15`.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et différencier conjointement les 3 séries (15 lignes)
import statsmodels.api as sm
df_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].___().___()

# Étape 2 : Préparer X_d (avec constante) et y_d sur les données différenciées
X_d = sm.add_constant(df_d[['A_COMPLETER', 'A_COMPLETER']])
y_d = df_d['A_COMPLETER']

# Étape 3 : Ajuster avec cov_type='HAC' et cov_kwds={'maxlags': 1}, puis afficher summary()
model_credit_hac = sm.OLS(y_d, X_d).fit(cov_type='A_COMPLETER', cov_kwds={'maxlags': ___})
print(model_credit_hac.summary())`,
      },
    },
    {
      id: "py-51",
      title: "25. Nuage de points & Droite MCO (Matplotlib)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 12,
      description: "Tracez les observations (euribor_3m, oat_10y) ainsi que la droite ajustée par les MCO.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Diagnostic Visuel de la Droite MCO et des Résidus

Le célèbre **quartet d'Anscombe (1973)** a démontré que quatre jeux de données aux géométries radicalement différentes (droite bruitée, parabole parfaite, outlier extrême, point levier isolé) peuvent produire exactement les mêmes $\\hat{\\beta}_0$, $\\hat{\\beta}_1$ et $R^2$. Visualiser le nuage $(x_t, y_t)$ superposé à la droite ajustée $\\hat{y}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_t$ est donc une étape de contrôle obligatoire.

**Lecture géométrique du graphique :**
- Chaque point bleu représente un trimestre observé $(\\text{Euribor}_{3M, t},\\, \\text{OAT}_{10Y, t})$.
- La droite rouge trace la prédiction linéaire $\\hat{y}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_t$.
- La **distance verticale** entre le point et la droite correspond exactement au résidu $\\hat{e}_t = y_t - \\hat{y}_t$ (positif au-dessus de la droite lorsque les taux longs anticipent une hausse future des taux directeurs ; négatif en dessous lorsque la courbe des taux s'aplatit ou s'inverse en fin de cycle).

> 💡 **Lecture financière sur \`df\` :**
>
> Le nuage met visuellement en évidence deux grappes : une concentration de trimestres en territoire négatif autour d'Euribor $\\approx -0.5\\%$ (\`2020-Q1\` à \`2022-Q2\`, où l'OAT décolle déjà avant la BCE en \`2022-Q2\`), puis une trajectoire d'inversion de courbe en \`2023\` lorsque l'Euribor dépasse l'OAT ($3.92\\% > 3.10\\%$).

### 💻 Masterclass Python

En Matplotlib (\`import matplotlib.pyplot as plt\`) :
- \`plt.scatter(x, y)\` trace un nuage de points indépendants sans les relier.
- \`plt.plot(x, model.fittedvalues)\` relie les points ajustés par des segments. Comme $\\hat{y}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_t$ est une droite affine, les segments sont colinéaires même si \`x\` n'est pas trié (attention : pour tracer une courbe non linéaire, il faudrait impérativement trier \`x\` d'abord !).
- Terminez toujours par les légendes, unités sur les axes, \`plt.grid(...)\`, \`plt.tight_layout()\` et \`plt.show()\` pour capturer la figure dans l'interface.

\`\`\`python
import statsmodels.api as sm
import matplotlib.pyplot as plt

# 1. Estimation de la droite MCO OAT 10Y ~ const + Euribor 3M
X = sm.add_constant(df[['euribor_3m']])
y = df['oat_10y']
model = sm.OLS(y, X).fit()

# 2. Tracé superposé : nuage de points (scatter) + droite ajustée (plot)
plt.figure(figsize=(7, 4))
plt.scatter(df['euribor_3m'], y, color='#0284c7', label='Observations')
plt.plot(df['euribor_3m'], model.fittedvalues, color='#e11d48', lw=2, label='Droite MCO')
plt.xlabel('Euribor 3 mois (%)')
plt.ylabel('OAT 10 ans (%)')
plt.legend()
plt.tight_layout()
plt.show()
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Vérifions numériquement les coordonnées exactes de la droite tracée ($\\hat{y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 x$) aux deux extrémités du nuage ainsi que les deux plus grands écarts verticaux (résidus extrêmes) :

\`\`\`python
import pandas as pd
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m']])
y = df['oat_10y']
m = sm.OLS(y, X).fit()
res_df = pd.DataFrame({'periode': df['periode'], 'euribor': df['euribor_3m'], 'oat_obs': y, 'oat_fit': m.fittedvalues, 'residu': m.resid})
print(f"Équation droite : OAT_10Y = {m.params['const']:.3f} + {m.params['euribor_3m']:.3f} * Euribor_3M")
print("Extrémités et pires résidus :")
print(res_df.iloc[[df['euribor_3m'].idxmin(), m.resid.idxmin(), m.resid.idxmax(), df['euribor_3m'].idxmax()]].round(3).to_string(index=False))
\`\`\`

\`\`\`text
Équation droite : OAT_10Y = 0.698 + 0.771 * Euribor_3M
Extrémités et pires résidus :
periode  euribor  oat_obs  oat_fit  residu
2021-Q4    -0.57     0.20    0.259  -0.059
2020-Q4    -0.52    -0.34    0.297  -0.637
2022-Q2    -0.18     1.92    0.559   1.361
2023-Q4     3.92     3.10    3.719  -0.619
\`\`\`

Sur le graphique produit par \`plt.show()\`, la droite rouge part de $(x = -0.57\\%, \\hat{y} = 0.259\\%)$ jusqu'à $(x = 3.92\\%, \\hat{y} = 3.719\\%)$. Le point le plus haut au-dessus de la droite est \`2022-Q2\` ($e = +1.361\\%$, lorsque l'OAT anticipait la remontée BCE), tandis que \`2020-Q4\` ($-0.637\\%$) et \`2023-Q4\` ($-0.619\\%$) se situent en dessous.
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` :
1. Importez \`statsmodels.api as sm\` et \`matplotlib.pyplot as plt\`.
2. Estimez **\`model = sm.OLS(y, X).fit()\`** avec \`y = df['oat_10y']\` et \`X = sm.add_constant(df[['euribor_3m']])\`.
3. Tracez le nuage de points \`plt.scatter(df['euribor_3m'], y, ...)\` et la droite MCO \`plt.plot(df['euribor_3m'], model.fittedvalues, ...)\` avec titres, légende et \`plt.show()\`.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "import statsmodels.api as sm\nimport matplotlib.pyplot as plt\n\nX = sm.add_constant(df[['euribor_3m']])\ny = df['oat_10y']\nmodel = sm.OLS(y, X).fit()\nplt.figure(figsize=(7, 4))\nplt.scatter(df['euribor_3m'], y, color='#0284c7', label='Trimestres observés')\nplt.plot(df['euribor_3m'], model.fittedvalues, color='#e11d48', lw=2, label='Droite MCO')\nplt.xlabel('Euribor 3 mois (%)')\nplt.ylabel('OAT 10 ans (%)')\nplt.title('Relation MCO : OAT 10Y vs Euribor 3M')\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.tight_layout()\nplt.show()",
      testPythonCode: "assert 'model' in globals() and len(model.fittedvalues) == len(df)",
      hints: ["Utilisez plt.scatter(...) et plt.plot(df['euribor_3m'], model.fittedvalues, ...)."],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, superposer le nuage $(x_t, y_t)$ et la droite ajustée $\\hat{y}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_t$ permet d'inspecter visuellement les résidus $\\hat{e}_t = y_t - \\hat{y}_t$ et d'éviter les pièges du quartet d'Anscombe. Après avoir ajusté **\`model\`** (\`oat_10y ~ const + euribor_3m\`) sur \`df\`, vous tracez les observations avec \`plt.scatter(df['euribor_3m'], y, ...)\` et la droite MCO avec \`plt.plot(df['euribor_3m'], model.fittedvalues, ...)\`.`,
        stepByStepPlan: [
          `Importez \`statsmodels.api as sm\` et \`matplotlib.pyplot as plt\`, puis estimez \`model = sm.OLS(y, X).fit()\` avec \`y = df['oat_10y']\` et \`X = sm.add_constant(df[['euribor_3m']])\`.`,
          `Initialisez la figure (\`plt.figure(figsize=(7, 4))\`), tracez le nuage avec \`plt.scatter(df['euribor_3m'], y, ...)\` et la droite ajustée avec \`plt.plot(df['euribor_3m'], model.fittedvalues, ...)\`.`,
          `Ajoutez les étiquettes d'axes (\`xlabel\`, \`ylabel\`), le titre (\`title\`), la légende (\`legend\`), la grille (\`grid\`), \`plt.tight_layout()\` et terminez par \`plt.show()\`.`,
        ],
        concepts: [
          {
            symbol: "import matplotlib.pyplot as plt",
            kind: "Syntaxe",
            roleInExercise: "Importe l'interface graphique `pyplot` de Matplotlib sous l'alias universel `plt`.",
          },
          {
            symbol: "model",
            kind: "Variable",
            roleInExercise: "Modèle OLS `oat_10y ~ const + euribor_3m` exigé par `testPythonCode` (`len(model.fittedvalues) == len(df)`).",
          },
          {
            symbol: "model.fittedvalues",
            kind: "Paramètre",
            roleInExercise: "Série des $16$ ordonnées ajustées $\\hat{y}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_t$ alignées sur `df['euribor_3m']`.",
          },
          {
            symbol: "plt.scatter(x, y, ...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Trace un nuage de points indépendants pour les $16$ couples trimestriels observés, sans tracer de segments entre eux.",
          },
          {
            symbol: "plt.plot(x, y_fit, ...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Relie les points `(euribor_3m, model.fittedvalues)` pour afficher la droite de régression linéaire.",
          },
          {
            symbol: "plt.xlabel / plt.ylabel / plt.legend",
            kind: "Fonction / Méthode",
            roleInExercise: "Rendent le graphique exploitable en comité des risques (noms et unités des axes, titre et identification des séries via `label=...`).",
          },
          {
            symbol: "plt.tight_layout() / plt.show()",
            kind: "Fonction / Méthode",
            roleInExercise: "Ajuste proprement les marges puis affiche et capture le graphique généré dans l'interface.",
          },
        ],
        guidedCode: `# Étape 1 : Importer statsmodels et matplotlib.pyplot, puis estimer model
import statsmodels.api as sm
import matplotlib.pyplot as plt

X = sm.add_constant(df[['euribor_3m']])
y = df['oat_10y']
model = sm.OLS(y, X).fit()

# Étape 2 : Tracer le nuage de points (scatter) et la droite MCO (plot)
plt.figure(figsize=(7, 4))
plt.___(df['euribor_3m'], y, color='#0284c7', label='Trimestres observés')
plt.___(df['euribor_3m'], model.___, color='#e11d48', lw=2, label='Droite MCO')

# Étape 3 : Habiller le graphique et l'afficher avec plt.show()
plt.xlabel('Euribor 3 mois (%)')
plt.ylabel('OAT 10 ans (%)')
plt.title('Relation MCO : OAT 10Y vs Euribor 3M')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.___()`,
      },
    },
    {
      id: "py-52",
      title: "26. Cas Pratique Risque : VaR Paramétrique Normale à 95 %",
      category: "alm",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 15,
      description: "Calculez la Value-at-Risk trimestrielle à 95 % d'un portefeuille investi sur le CAC 40.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Value-at-Risk (VaR) Paramétrique Gaussienne et Limites Prudentielles

Dans les cadres réglementaires Bâle III, Solvabilité II et UCITS, la **Value-at-Risk (VaR)** au niveau de confiance $1 - \\alpha = 95\\%$ quantifie la perte maximale qu'un portefeuille ne devrait pas dépasser sur un horizon donné (ici $1$ trimestre), sauf dans $\\alpha = 5\\%$ des pires scénarios :

$$
\\mathbb{P}\\left(R_t < -\\text{VaR}_{95\\%}\\right) = \\alpha = 0.05
$$

Sous l'hypothèse de rendements normaux $R_t \\sim \\mathcal{N}(\\mu, \\sigma^2)$ (en pourcentage), la standardisation par $\\frac{R_t - \\mu}{\\sigma} \\sim \\mathcal{N}(0, 1)$ donne avec le quantile gaussien $z_{0.05} = \\Phi^{-1}(0.05) \\approx -1.64485 \\approx -1.645$ :

$$
\\frac{-\\text{VaR}_{95\\%} - \\mu}{\\sigma} = -1.645 \\implies \\text{VaR}_{95\\%} = -\\left(\\mu - 1.645\\,\\sigma\\right)
$$

Pour un capital investi $V_0 = 10\\,000\\,000\\text{ EUR}$, la perte maximale en euros vaut :

$$
\\text{VaR}_{\\text{EUR}} = \\frac{\\text{VaR}_{95\\%}}{100} \\times V_0
$$

> ⚠️ **Critique Risk Management : Queues épaisses et Expected Shortfall ($ES_{95\\%}$)**
>
> La VaR gaussienne souffre de deux limites célèbres :
> 1. **Sous-estimation des krachs** : le krach de \`2020-Q1\` a enregistré $-26.5\\%$, perçant largement le seuil paramétrique de $16.14\\%$.
> 2. **Myopie de queue & non-cohérence** : la VaR indique la *frontière* des $5\\%$ pires cas, pas la *perte moyenne au-delà* de cette frontière, et elle n'est pas sous-additive (Artzner et al. 1999). C'est pourquoi Bâle III / FRTB privilégie l'**Expected Shortfall ($ES$)** : $ES_{95\\%} = -\\mu + \\sigma\\,\\frac{\\phi(z_{0.05})}{0.05}$.

### 💻 Masterclass Python

Bonnes pratiques Python pour le calcul financier :
- Depuis PEP 515, utilisez les tirets bas \`10_000_000\` dans les grands entiers pour éliminer les erreurs de zéro.
- Formatez les montants monétaires avec le séparateur de milliers \`,\` dans les f-strings : \`f"{var_eur:,.2f} EUR"\`.
- Pour vérifier le quantile exact $-1.6449$ ou calculer l'Expected Shortfall gaussien, exploitez \`scipy.stats.norm.ppf\` et \`norm.pdf\`.

\`\`\`python
# 1. Estimation des paramètres empiriques (en %)
mu_cac = float(df['cac40_rendement'].mean())
sigma_cac = float(df['cac40_rendement'].std())

# 2. Formule de la VaR paramétrique à 95% (z_0.05 = -1.645)
var_pct = float(-(mu_cac - 1.645 * sigma_cac))

# 3. Conversion sur un portefeuille de 10 M EUR (PEP 515 : 10_000_000)
var_eur = float((var_pct / 100.0) * 10_000_000)
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

Comparons sur \`df['cac40_rendement']\` la VaR paramétrique gaussienne à 95 %, la VaR historique empirique (5e centile) et l'Expected Shortfall gaussien :

\`\`\`python
from scipy import stats

r = df['cac40_rendement']
mu = float(r.mean())
sigma = float(r.std())
z_exact = float(stats.norm.ppf(0.05))
var_hist = -float(r.quantile(0.05))
es_gauss = -mu + sigma * float(stats.norm.pdf(z_exact) / 0.05)
print(f"mu = {mu:.2f}% | sigma = {sigma:.2f}% | z_0.05 = {z_exact:.4f}")
print(f"VaR 95% paramétrique (z=-1.645) : {-(mu - 1.645*sigma):.2f}% ({(-(mu - 1.645*sigma)/100)*10_000_000:,.2f} EUR)")
print(f"VaR 95% historique (quantile 5%) : {var_hist:.2f}%")
print(f"Expected Shortfall 95% gaussien  : {es_gauss:.2f}% ({(es_gauss/100)*10_000_000:,.2f} EUR)")
\`\`\`

\`\`\`text
mu = 1.99% | sigma = 11.02% | z_0.05 = -1.6449
VaR 95% paramétrique (z=-1.645) : 16.14% (1,613,884.34 EUR)
VaR 95% historique (quantile 5%) : 13.75%
Expected Shortfall 95% gaussien  : 20.74% (2,074,323.04 EUR)
\`\`\`

Sous hypothèse normale, la perte trimestrielle maximale à 95 % s'établit à \`16.14%\` (\`1,613,884.34 EUR\`), tandis que la perte moyenne conditionnelle dans les $5\\%$ pires trimestres (Expected Shortfall) grimpe à \`20.74%\` (\`2,074,323.04 EUR\`).
      `,
      taskMarkdown: `### 🛠️ Laboratoire Pratique

Dans un script autonome sur \`df\` pour un portefeuille de $V_0 = 10\\,000\\,000\\text{ EUR}$ exposé au CAC 40 :
1. Estimez **\`mu_cac = float(df['cac40_rendement'].mean())\`** et **\`sigma_cac = float(df['cac40_rendement'].std())\`**.
2. Calculez la VaR paramétrique relative à 95 % (avec $z_{0.05} = -1.645$) dans **\`var_pct = float(-(mu_cac - 1.645 * sigma_cac))\`**.
3. Convertissez-la en euros dans **\`var_eur = float((var_pct / 100.0) * 10_000_000)\`** et affichez le résultat.`,
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode: "mu_cac = float(df['cac40_rendement'].mean())\nsigma_cac = float(df['cac40_rendement'].std())\nvar_pct = float(-(mu_cac - 1.645 * sigma_cac))\nvar_eur = float((var_pct / 100.0) * 10_000_000)\nprint(f'Mu = {mu_cac:.2f}% | Sigma = {sigma_cac:.2f}%')\nprint(f'VaR 95% (trimestrielle) : {var_pct:.2f}% -> {var_eur:,.2f} EUR')",
      testPythonCode: "assert 'var_pct' in globals() and 'var_eur' in globals()\nassert 10.0 < var_pct < 30.0 and var_eur > 1_000_000",
      hints: ["var_pct = -(mu_cac - 1.645 * sigma_cac), puis (var_pct / 100.0) * 10_000_000"],
      datasets: [],
      guide: {
        theoryToPracticeLink: `Dans le cours, la Value-at-Risk gaussienne à $95\\%$ s'exprime par $\\text{VaR}_{95\\%} = -(\\mu - 1.645\\,\\sigma)$ en pourcentage et $\\text{VaR}_{\\text{EUR}} = \\frac{\\text{VaR}_{95\\%}}{100} \\times V_0$ en euros pour un portefeuille de $V_0 = 10\\,000\\,000\\text{ EUR}$. À partir de \`df['cac40_rendement']\` (\`macro_taux\`), vous calculez **\`mu_cac\`** et **\`sigma_cac\`** (\`.mean()\` et \`.std()\`), puis **\`var_pct\`** et **\`var_eur\`** vérifiés par \`testPythonCode\`.`,
        stepByStepPlan: [
          `Estimez la moyenne et la volatilité trimestrielles de \`df['cac40_rendement']\` dans \`mu_cac = float(...)\` et \`sigma_cac = float(...)\`.`,
          `Appliquez la formule paramétrique normale à $95\\%$ : \`var_pct = float(-(mu_cac - 1.645 * sigma_cac))\`.`,
          `Convertissez cette perte relative (en %) sur $V_0 = 10\\,000\\,000$ via \`var_eur = float((var_pct / 100.0) * 10_000_000)\`.`,
          `Affichez \`mu_cac\`, \`sigma_cac\`, \`var_pct\` et \`var_eur\` formaté avec séparateur de milliers (\`:,.2f\`).`,
        ],
        concepts: [
          {
            symbol: "df['cac40_rendement']",
            kind: "Colonne / Table",
            roleInExercise: "Colonne de `df` contenant les $16$ rendements trimestriels du CAC 40 déjà exprimés en points de pourcentage (d'où la division par `100.0` à la fin).",
          },
          {
            symbol: "mu_cac / sigma_cac",
            kind: "Variable",
            roleInExercise: "Moyenne (`.mean()`) et écart-type corrigé de Bessel (`.std()`) du CAC 40 convertis en `float`.",
          },
          {
            symbol: "1.645",
            kind: "Paramètre",
            roleInExercise: "Valeur absolue du quantile gaussien $z_{0.05} = \\Phi^{-1}(0.05) \\approx -1.645$ délimitant la queue gauche des $5\\%$ pires rendements.",
          },
          {
            symbol: "var_pct",
            kind: "Variable",
            roleInExercise: "VaR relative exprimée en perte positive ($\\approx 16.14\\%$), vérifiée par `10.0 < var_pct < 30.0`.",
          },
          {
            symbol: "10_000_000",
            kind: "Syntaxe",
            roleInExercise: "Littéral entier PEP 515 : les tirets bas `_` améliorent la lisibilité des grands montants sans changer la valeur numérique.",
          },
          {
            symbol: "var_eur",
            kind: "Variable",
            roleInExercise: "Perte maximale trimestrielle en euros ($\\approx 1\\,613\\,884.34\\text{ EUR}$) vérifiée par `var_eur > 1_000_000`.",
          },
          {
            symbol: "f'... {var_eur:,.2f} EUR'",
            kind: "Syntaxe",
            roleInExercise: "*f-string* avec virgule `,` comme séparateur de milliers et `.2f` pour $2$ décimales.",
          },
        ],
        guidedCode: `# Étape 1 : Estimer mu_cac et sigma_cac sur df['cac40_rendement']
mu_cac = float(df['A_COMPLETER'].___())
sigma_cac = float(df['A_COMPLETER'].___())

# Étape 2 : Calculer la VaR paramétrique normale à 95% (en %)
var_pct = float(-(___ - 1.645 * ___))

# Étape 3 : Convertir sur un portefeuille de 10_000_000 EUR
var_eur = float((___ / 100.0) * 10_000_000)

# Étape 4 : Afficher les paramètres et la VaR formatée
print(f"Mu = {mu_cac:.2f}% | Sigma = {sigma_cac:.2f}%")
print(f"VaR 95% (trimestrielle) : {var_pct:.2f}% -> {var_eur:,.2f} EUR")`,
      },
    },
  ],
};
