import { CourseModule } from "@/types/course";

export const V2_SQL_QUANT_MODULE: CourseModule = {
  id: "sql-quant",
  title: "SQL Avancé & Data Engineering Financier",
  subtitle: "Du Calcul des Rendements aux Window Functions & Arbres Stochastiques",
  icon: "Database",
  description:
    "Maîtrisez les techniques avancées de manipulation et modélisation de séries financières en SQL : log-rendements, volatilité glissante, maximum drawdown, ASOF joins et CTEs récursives.",
  exercises: [
    {
      id: "v2-sql-1",
      title: "1. Log-Rendements Journaliers (LAG & LN)",
      category: "data_engineering",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 6,
      description:
        "Calculez le rendement logarithmique journalier de l'action TotalEnergies (TTE).",
      theoryMarkdown: `
### Log-Rendements et Additivité Temporelle en Finance

#### 🎓 Cours Théorique Approfondi

En finance quantitative, pour une série de cours de clôture strictement positifs $P_t > 0$, on oppose deux définitions du rendement entre $t-1$ et $t$ :

1. **Rendement arithmétique (discret)** :

$$
R_t = \\frac{P_t - P_{t-1}}{P_{t-1}} = \\frac{P_t}{P_{t-1}} - 1
$$

2. **Rendement logarithmique (taux composé en continu)** :

$$
r_t = \\ln\\left(\\frac{P_t}{P_{t-1}}\\right) = \\ln(P_t) - \\ln(P_{t-1}) = \\ln(1 + R_t)
$$

**Démonstration 1 — Additivité temporelle exacte :**
Sur un horizon $[0, T]$, le cumul des log-rendements forme une somme télescopique qui annule tous les prix intermédiaires :

$$
\\sum_{t=1}^{T} r_t = \\sum_{t=1}^{T} \\left( \\ln(P_t) - \\ln(P_{t-1}) \\right) = \\ln(P_T) - \\ln(P_0) = \\ln\\left(\\frac{P_T}{P_0}\\right)
$$

À l'inverse, le rendement discret multi-périodes est multiplicatif ($1 + R_{0 \\to T} = \\prod_{t=1}^T (1 + R_t)$) et ne peut jamais être additionné linéairement sans erreur.

**Démonstration 2 — Développement de Taylor et ajustement de convexité :**
Au voisinage de $R_t = 0$, le développement de Taylor-Young à l'ordre 2 donne :

$$
r_t = \\ln(1 + R_t) = R_t - \\frac{1}{2} R_t^2 + \\mathcal{O}(R_t^3)
$$

Pour de faibles variations journalières ($|R_t| \\approx 1\\%$), l'écart vaut $\\frac{1}{2}(0.01)^2 = 0.00005$ ($0.5$ point de base), donc $r_t \\approx R_t$. En prenant l'espérance sur un modèle stochastique de rendement de variance $\\sigma^2$, le terme quadratique induit un **drag de volatilité** :

$$
\\mathbb{E}[r_t] \\approx \\mathbb{E}[R_t] - \\frac{1}{2}\\sigma^2
$$

C'est exactement l'ajustement $-\\frac{1}{2}\\sigma^2$ présent dans le drift du mouvement brownien géométrique de Black-Scholes ($S_T = S_0 \\exp((\\mu - \\frac{1}{2}\\sigma^2)T + \\sigma W_T)$).

![Asymétrie des Rendements](/images/theory/fig_log_vs_arithmetic_returns.png)

> 🔍 **Lecture du graphique — L'illusion de l'addition arithmétique :**
> Un capital de **100 €** qui perd **-50 %** tombe à **50 €**, puis un rebond de **+50 %** ne le remonte qu'à **75 €** (perte nette de -25 %). La somme arithmétique $-50\\% + 50\\% = 0\\%$ (orange) est fausse. La somme logarithmique $\\ln(50/100) + \\ln(75/50) = -0.6931 + 0.4055 = -0.2877 = \\ln(75/100)$ (bleu) restitue le facteur de richesse exact $e^{-0.2877} = 0.75$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous l'hypothèse de normalité $r_t \\sim \\mathcal{N}(\\mu, \\sigma^2)$, les prix suivent une loi log-normale $P_t > 0$ (excluant des cours négatifs impossibles en actions) et la **Value-at-Risk (VaR)** à horizon $H$ jours s'agrège analytiquement par $\\sigma_H = \\sqrt{H}\\sigma_1$ grâce à l'additivité des log-rendements.

#### 💻 Masterclass SQL Quantitative

En SQL analytique, le calcul d'une variation temporelle sans auto-jointure coûteuse repose sur la fonction de fenêtre \`LAG()\` :
- \`LAG(colonne, offset, valeur_defaut) OVER (PARTITION BY ... ORDER BY ...)\` accède à la ligne située \`offset\` rangs avant la ligne courante dans la partition triée.
- Sur la toute première séance ($t = 1$), il n'existe pas de ligne précédente : \`LAG()\` retourne \`NULL\`, et donc \`LN(... / NULL)\` retourne proprement \`NULL\` (aucune division par zéro silencieuse).
- En SQLite standard, \`LN()\` n'est pas toujours activée par défaut ; dans le moteur WASM de QuantEcon Lab, les fonctions mathématiques \`LN\`, \`LOG\`, \`EXP\`, \`POWER\` et \`SQRT\` sont enregistrées explicitement.
- **Bonne pratique de typage** : si \`prix_cloture\` était stocké en entier (\`INTEGER\`), SQLite réaliserait une division euclidienne tronquée ; multipliez toujours par \`1.0\` si la colonne n'est pas déjà \`REAL\`.

\`\`\`sql
SELECT
    date,
    prix_cloture,
    -- Prix de la séance précédente selon l'ordre chronologique
    LAG(prix_cloture, 1) OVER (ORDER BY date ASC) AS prix_precedent,
    -- Log-rendement continu : ln(P_t / P_{t-1}) ; vaut NULL au jour 1
    LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date ASC)) AS rendement_log
FROM marche_actions
WHERE ticker = 'TTE'      -- Filtre exécuté AVANT la fenêtre OVER(...)
ORDER BY date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur \`marche_actions\` pour \`'TTE'\` comparant le log-rendement \`r_log\`, le rendement arithmétique \`r_arith\` et la somme cumulée \`r_log_cumul\` :

\`\`\`sql
WITH rdt AS (
  SELECT date, prix_cloture,
         LAG(prix_cloture, 1) OVER (ORDER BY date) AS p_prec,
         LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS r_log,
         (prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date) - 1) AS r_arith
  FROM marche_actions
  WHERE ticker = 'TTE'
)
SELECT date, prix_cloture, ROUND(r_log, 6) AS r_log,
       ROUND(r_arith, 6) AS r_arith,
       ROUND(SUM(r_log) OVER (ORDER BY date), 6) AS r_log_cumul
FROM rdt ORDER BY date;
\`\`\`

\`\`\`text
date       | prix_cloture | r_log     | r_arith   | r_log_cumul
-----------+--------------+-----------+-----------+------------
2024-01-02 | 61.8         | NULL      | NULL      | NULL
2024-01-03 | 62.4         | 0.009662  | 0.009709  | 0.009662
2024-01-04 | 62           | -0.006431 | -0.00641  | 0.003231
2024-01-05 | 63           | 0.016     | 0.016129  | 0.019231
2024-01-08 | 62.6         | -0.006369 | -0.006349 | 0.012862
\`\`\`

Vérification de la propriété télescopique sur l'horizon complet ($P_0 = 61.80\\text{ EUR}$, $P_T = 62.60\\text{ EUR}$) :

\`\`\`sql
WITH rdt AS (
  SELECT LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS r_log,
         (prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date) - 1) AS r_arith
  FROM marche_actions WHERE ticker = 'TTE'
)
SELECT ROUND(SUM(r_log), 6) AS somme_log,
       ROUND(LN(62.60 / 61.80), 6) AS ln_PT_sur_P0,
       ROUND(SUM(r_arith), 6) AS somme_arith
FROM rdt;
\`\`\`

\`\`\`text
somme_log | ln_PT_sur_P0 | somme_arith
----------+--------------+------------
0.012862  | 0.012862     | 0.013078
\`\`\`

On vérifie à la 6e décimale que $\\sum r_t = \\ln(62.60/61.80) = 0.012862$, alors que la somme arithmétique surestime la performance de $+2.16$ points de base ($0.013078$).
      `,
      taskMarkdown:
        "À partir de la table `marche_actions` filtrée sur le ticker `'TTE'`, sélectionnez `date`, `prix_cloture` et calculez `rendement_log` défini par la formule exacte `LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log`. Triez le résultat par `date` croissante.",
      initialCode: "-- Calculez le log-rendement journalier de TTE :\n",
      solutionCode:
        "SELECT date, prix_cloture, LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
      validationQuery:
        "SELECT date, prix_cloture, LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
      hints: [
        "Utilisez LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log",
        "N'oubliez pas le filtre WHERE ticker = 'TTE'.",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-2",
      title: "2. Volatilité Glissante sur Fenêtre Mobile (ROWS BETWEEN)",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description:
        "Calculez la volatilité glissante des rendements sur une fenêtre de 3 séances pour BNP Paribas.",
      theoryMarkdown: `
### Volatilité Empirique, Identité de Koenig-Huygens et Fenêtre Mobile SQL

#### 🎓 Cours Théorique Approfondi

La **moyenne mobile** $\\bar{r}_{t,n}$ et la **volatilité empirique** $s_{t,n}$ estimées sur une fenêtre glissante de $n$ séances ($n=3$ ici) mesurent respectivement la dérive locale et la dispersion des rendements :

$$
\\bar{r}_{t,n} = \\frac{1}{n} \\sum_{i=0}^{n-1} r_{t-i}, \\qquad s_{t,n}^2 = \\frac{1}{n-1} \\sum_{i=0}^{n-1} (r_{t-i} - \\bar{r}_{t,n})^2
$$

**Pourquoi SQLite ne propose pas \`STDDEV()\` nativement, et comment la calculer en une passe :**
Contrairement à PostgreSQL ou Snowflake (\`STDDEV_SAMP(r) OVER (...)\`), **SQLite est un moteur embarqué minimaliste qui ne possède aucune fonction native \`STDDEV()\` ou \`VARIANCE()\`** (ni en agrégat, ni en fonction de fenêtre). En effet, la formule directe $\\sum (r_{t-i} - \\bar{r})^2$ exigerait de connaître $\\bar{r}$ avant de sommer les écarts au carré sur la fenêtre.

On résout cette contrainte algébriquement grâce à l'**identité de Koenig-Huygens** :

$$
\\operatorname{Var}_{\\text{pop}}(r) = \\frac{1}{n}\\sum_{i=0}^{n-1} (r_{t-i} - \\bar{r})^2 = \\left(\\frac{1}{n}\\sum_{i=0}^{n-1} r_{t-i}^2\\right) - \\bar{r}^2 = \\mathbb{E}[r^2] - \\left(\\mathbb{E}[r]\\right)^2
$$

Pour retrouver l'estimateur **sans biais (correction de Bessel)** au dénominateur $n-1$, il suffit pour $n \\ge 2$ de multiplier la variance biaisée par $\\frac{n}{n-1}$ :

$$
s_{t,n}^2 = \\frac{n}{n-1} \\left( \\mathbb{E}[r^2] - \\mathbb{E}[r]^2 \\right)
$$

Enfin, sous l'hypothèse de rendements i.i.d. (mouvement brownien où $\\operatorname{Var}(W_T) = T$), l'annualisation sur $252$ jours de bourse suit la règle de la racine carrée du temps :

$$
\\sigma_{\\text{annuelle}} = s_{t,n} \\times \\sqrt{252}
$$

**Vérification numérique pas-à-pas sur 3 rendements** ($r_1 = +2.0\\%$, $r_2 = -1.0\\%$, $r_3 = +1.4\\%$) :
1. **Moyenne mobile** : $\\mathbb{E}[r] = \\bar{r} = \\frac{2.0 - 1.0 + 1.4}{3} = \\mathbf{0.80\\%}$.
2. **Moment d'ordre 2** : $\\mathbb{E}[r^2] = \\frac{2.0^2 + (-1.0)^2 + 1.4^2}{3} = \\frac{4.0 + 1.0 + 1.96}{3} = \\mathbf{2.32}$.
3. **Variance Koenig-Huygens ($1/n$)** : $2.32 - 0.80^2 = 2.32 - 0.64 = 1.68$.
4. **Correction de Bessel ($n/(n-1) = 3/2$)** : $s^2 = \\frac{3}{2} \\times 1.68 = \\mathbf{2.52}$, soit $s_{\\text{jour}} = \\sqrt{2.52} \\approx 1.5875\\%$ et $\\sigma_{\\text{annuelle}} = 1.5875\\% \\times \\sqrt{252} \\approx \\mathbf{25.19\\%}$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> En gestion des risques de marché (modèles EWMA, VaR paramétrique dynamique, *volatility targeting*), on estime en permanence les moments glissants $\\mu_t$ et $\\sigma_t$ sur des fenêtres courtes (20j, 60j, 252j) pour adapter l'allocation de capital quand les régimes de volatilité changent (*volatility clustering*).

#### 💻 Masterclass SQL Quantitative

La clause de cadrage (*Window Frame*) contrôle exactement quelles lignes entourent la ligne courante :
- \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` définit une fenêtre **physique** contenant la ligne courante et au plus les 2 lignes précédentes (soit 3 séances de bourse effectives, même si un week-end ou un jour férié sépare deux dates).
- **Attention à \`RANGE BETWEEN\`** : \`RANGE\` travaille sur les valeurs de la colonne \`ORDER BY\` et ne supporte pas facilement \`2 PRECEDING\` sur des dates textuelles \`YYYY-MM-DD\`. Pour des fenêtres de $k$ séances de cotation, utilisez **toujours \`ROWS BETWEEN\`**.
- **Gestion des bords** : à la première date, la fenêtre ne contient que \`n = 1\` ligne ; à la deuxième, \`n = 2\` lignes. Pour éviter une division par zéro \`n - 1 = 0\` et les micro-négatifs IEEE-754 (ex: \`-1e-18\`) quand tous les rendements sont égaux, on protège la formule par \`CASE WHEN n > 1\` et \`MAX(0.0, ...)\`.

\`\`\`sql
WITH win AS (
  SELECT
      date,
      rendement_journalier AS r,
      -- Nombre réel de séances disponibles dans la fenêtre (1, 2 puis 3)
      COUNT(*) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS n,
      -- Moyenne mobile E[r] sur 3 séances
      AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS mu_3j,
      -- Moment quadratique mobile E[r^2] sur 3 séances (pour Koenig-Huygens)
      AVG(rendement_journalier * rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS e_r2
  FROM marche_actions
  WHERE ticker = 'BNP'
)
SELECT
    date,
    r,
    ROUND(mu_3j, 6) AS moyenne_mobile_3j,
    CASE WHEN n > 1
         THEN ROUND(SQRT(MAX(0.0, (e_r2 - mu_3j * mu_3j) * n / (n - 1))) * SQRT(252) * 100, 2)
         ELSE NULL
    END AS vol_ann_pct
FROM win
ORDER BY date;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur \`marche_actions\` pour \`'BNP'\` affichant simultanément la moyenne mobile \`moyenne_mobile_3j\` et la volatilité glissante annualisée \`vol_ann_pct\` (en %) calculée par Koenig-Huygens + Bessel :

\`\`\`sql
WITH win AS (
  SELECT date, rendement_journalier AS r,
         COUNT(*) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS n,
         AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS mu_3j,
         AVG(rendement_journalier * rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS e_r2
  FROM marche_actions WHERE ticker = 'BNP'
)
SELECT date, r, ROUND(mu_3j, 6) AS moyenne_mobile_3j,
       CASE WHEN n > 1
            THEN ROUND(SQRT(MAX(0.0, (e_r2 - mu_3j * mu_3j) * n / (n - 1))) * SQRT(252) * 100, 2)
            ELSE NULL END AS vol_ann_pct
FROM win ORDER BY date;
\`\`\`

\`\`\`text
date       | r       | moyenne_mobile_3j | vol_ann_pct
-----------+---------+-------------------+------------
2024-01-02 | 0.0048  | 0.0048            | NULL
2024-01-03 | -0.0111 | -0.00315          | 17.85
2024-01-04 | 0.0097  | 0.001133          | 17.26
2024-01-05 | 0.0128  | 0.0038            | 20.63
2024-01-08 | -0.0047 | 0.005933          | 14.82
\`\`\`

On observe que la volatilité annualisée 3 jours de BNP Paribas passe de $17.26\\%$ le 4 janvier à $20.63\\%$ le 5 janvier (amplitude entre $-1.11\\%$ et $+1.28\\%$), avant de refluer à $14.82\\%$ le 8 janvier.
      `,
      taskMarkdown:
        "Pour le ticker `'BNP'`, sélectionnez `date`, `rendement_journalier` et calculez la moyenne glissante `moyenne_mobile_3j` des rendements sur la fenêtre mobile des 3 dernières séances avec `AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j`. Triez par `date` croissante.",
      initialCode: "-- Calculez la moyenne mobile des rendements sur 3 jours pour BNP :\n",
      solutionCode:
        "SELECT date, rendement_journalier, AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j FROM marche_actions WHERE ticker = 'BNP' ORDER BY date;",
      validationQuery:
        "SELECT date, rendement_journalier, AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j FROM marche_actions WHERE ticker = 'BNP' ORDER BY date;",
      hints: [
        "Utilisez AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-3",
      title: "3. Détection de Signal Golden Cross (Moyennes Mobiles Croisées)",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description:
        "Identifiez les configurations de surperformance technique en comparant les moyennes rapides et lentes.",
      theoryMarkdown: `
### Analyse Technique Quantitative : Le Croisement Golden Cross

#### 🎓 Cours Théorique Approfondi

En traitement du signal financier et en gestion systématique (*Trend Following / CTA*), une moyenne mobile simple d'ordre $k$ ($SMA_k$) est un **filtre linéaire passe-bas** à réponse impulsionnelle finie (FIR) :

$$
SMA_k(t) = \\frac{1}{k} \\sum_{i=0}^{k-1} P_{t-i}
$$

**Compromis biais-variance et retard de phase :**
Si le cours bruité s'écrit $P_t = \\mu_t + \\varepsilon_t$ avec un bruit blanc $\\varepsilon_t \\sim (0, \\sigma^2)$ indépendant, la moyenne mobile réduit la variance du bruit d'un facteur $k$ :

$$
\\operatorname{Var}\\left(\\frac{1}{k}\\sum_{i=0}^{k-1}\\varepsilon_{t-i}\\right) = \\frac{\\sigma^2}{k}
$$

En contrepartie, un filtre de longueur $k$ introduit un **retard de phase (*lag*)** moyen égal à $\\frac{k-1}{2}$ séances par rapport à la tendance instantanée $\\mu_t$.

En comparant deux horizons $k_{\\text{rapide}} < k_{\\text{lente}}$ (typiquement 50j vs 200j en institutionnel, ou ici 2j vs 4j sur notre fenêtre courte), on construit un **oscillateur de momentum** :

$$
\\Delta_t = SMA_{\\text{rapide}}(t) - SMA_{\\text{lente}}(t)
$$

- **Golden Cross (Régime haussier / Signal d'achat)** : $\\Delta_t \\ge 0$, c'est-à-dire $SMA_{\\text{rapide}}(t) \\ge SMA_{\\text{lente}}(t)$. La dérivée locale du prix excède la tendance de fond.
- **Death Cross (Régime baissier / Attente ou vente)** : $\\Delta_t < 0$.

![Signal Golden Cross](/images/theory/fig_golden_cross.png)

> 🔍 **Lecture du graphique — Inertie vs impulsion de court terme :**
> La série grise brute subit un fort bruit micro-structurel. La courbe orange ($SMA_{20}$) capte l'inertie lourde du marché. Au point vert (**Golden Cross**), la courbe bleue ($SMA_5$) franchit à la hausse la $SMA_{20}$, confirmant statistiquement une accélération haussière qui surpasse la tendance historique.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Les stratégies *Trend Following* basées sur les croisements de moyennes mobiles génèrent un profil de **convexité positive (long gamma synthétique)** : elles coupent rapidement les positions en krach prolongé (*Death Cross*) et restent exposées lors des grandes tendances haussières. Leur principal coût est le **risque de *whipsaw*** (faux signaux) en marché sans tendance (*range*).

#### 💻 Masterclass SQL Quantitative

Une même requête \`SELECT\` peut évaluer **plusieurs clauses \`OVER (...)\` aux bornes différentes** sur le même jeu de données :
- \`AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)\` calcule la moyenne rapide sur 2 séances.
- \`AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)\` calcule la moyenne lente sur 4 séances.
- Pour la lisibilité et éviter la duplication de code dans le \`CASE WHEN\`, il est recommandé en production d'encapsuler \`sma_2\` et \`sma_4\` dans une **CTE (\`WITH smas AS (...)\`)** avant d'appliquer l'expression conditionnelle \`CASE WHEN sma_2 >= sma_4 THEN 'ACHAT' ELSE 'ATTENTE' END\`.
- **Effet d'amorce** : aux deux premières dates ($t=1, 2$), les deux fenêtres sont tronquées à 1 puis 2 lignes disponibles, donc \`sma_2 = sma_4\` exactement.

\`\`\`sql
WITH smas AS (
  SELECT
      date,
      prix_cloture,
      -- Fenêtre rapide de 2 séances (t-1, t)
      AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2,
      -- Fenêtre lente de 4 séances (t-3, t-2, t-1, t)
      AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4
  FROM marche_actions
  WHERE ticker = 'MC'
)
SELECT
    date,
    prix_cloture,
    sma_2,
    sma_4,
    CASE WHEN sma_2 >= sma_4 THEN 'ACHAT' ELSE 'ATTENTE' END AS signal
FROM smas
ORDER BY date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur LVMH (\`'MC'\`), puis comparaison avec BNP Paribas (\`'BNP'\`) où un véritable retournement \`ATTENTE\` $\\to$ \`ACHAT\` (Golden Cross) se produit le 5 janvier :

\`\`\`sql
-- 1) Série LVMH ('MC')
WITH smas AS (
  SELECT date, prix_cloture,
         AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2,
         AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4
  FROM marche_actions WHERE ticker = 'MC'
)
SELECT date, prix_cloture, ROUND(sma_2, 2) AS sma_2, ROUND(sma_4, 2) AS sma_4,
       CASE WHEN sma_2 >= sma_4 THEN 'ACHAT' ELSE 'ATTENTE' END AS signal
FROM smas ORDER BY date;
\`\`\`

\`\`\`text
date       | prix_cloture | sma_2 | sma_4  | signal
-----------+--------------+-------+--------+-------
2024-01-02 | 738          | 738   | 738    | ACHAT
2024-01-03 | 735          | 736.5 | 736.5  | ACHAT
2024-01-04 | 744          | 739.5 | 739    | ACHAT
2024-01-05 | 752          | 748   | 742.25 | ACHAT
2024-01-08 | 748          | 750   | 744.75 | ACHAT
\`\`\`

\`\`\`sql
-- 2) Même logique sur 'BNP' : capture d'un croisement ATTENTE -> ACHAT
WITH smas AS (
  SELECT date, prix_cloture,
         AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2,
         AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4
  FROM marche_actions WHERE ticker = 'BNP'
)
SELECT date, prix_cloture, ROUND(sma_2, 2) AS sma_2, ROUND(sma_4, 2) AS sma_4,
       CASE WHEN sma_2 >= sma_4 THEN 'ACHAT' ELSE 'ATTENTE' END AS signal
FROM smas ORDER BY date;
\`\`\`

\`\`\`text
date       | prix_cloture | sma_2 | sma_4 | signal
-----------+--------------+-------+-------+--------
2024-01-02 | 62.8         | 62.8  | 62.8  | ACHAT
2024-01-03 | 62.1         | 62.45 | 62.45 | ACHAT
2024-01-04 | 62.7         | 62.4  | 62.53 | ATTENTE
2024-01-05 | 63.5         | 63.1  | 62.77 | ACHAT
2024-01-08 | 63.2         | 63.35 | 62.88 | ACHAT
\`\`\`

Sur \`BNP\`, le repli initial fait passer \`sma_2\` ($62.40$) sous \`sma_4\` ($62.53$) le \`2024-01-04\` (\`ATTENTE\`), puis le rebond à $63.50$ le \`2024-01-05\` déclenche le croisement haussier (\`sma_2 = 63.10 >= sma_4 = 62.77\`).
      `,
      taskMarkdown:
        "Pour le ticker `'MC'` (LVMH), sélectionnez `date`, `prix_cloture`, calculez `sma_2` (moyenne sur 2 séances : `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW`) et `sma_4` (moyenne sur 4 séances : `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW`) de `prix_cloture`, puis ajoutez une colonne `signal` valant `'ACHAT'` si `sma_2 >= sma_4` et `'ATTENTE'` sinon. Triez par `date`.",
      initialCode: "-- Écrivez la requête du signal de croisement :\n",
      solutionCode:
        "SELECT date, prix_cloture, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4, CASE WHEN AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) >= AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) THEN 'ACHAT' ELSE 'ATTENTE' END AS signal FROM marche_actions WHERE ticker = 'MC' ORDER BY date;",
      validationQuery:
        "SELECT date, prix_cloture, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4, CASE WHEN AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) >= AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) THEN 'ACHAT' ELSE 'ATTENTE' END AS signal FROM marche_actions WHERE ticker = 'MC' ORDER BY date;",
      hints: [
        "Utilisez un CASE WHEN ... THEN 'ACHAT' ELSE 'ATTENTE' END.",
        "Les moyennes se calculent avec AVG(prix_cloture) OVER (...).",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-4",
      title: "4. Maximum Drawdown Cumulatif (Running Peak & Drawdown)",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 10,
      description:
        "Calculez le plus haut historique glissant et le drawdown journalier en pourcentage.",
      theoryMarkdown: `
### Mesure Asymétrique et Path-Dependent du Risque : Le Maximum Drawdown

#### 🎓 Cours Théorique Approfondi

Contrairement à la variance ou à la Value-at-Risk marginale qui ne dépendent que de la distribution des rendements journaliers (et sont invariantes par permutation des dates si les rendements sont i.i.d.), le **Drawdown** est une métrique strictement **path-dependent** (dépendante du chemin parcouru) : une suite de pertes consécutives est infiniment plus destructrice que les mêmes pertes intercalées de rebonds.

Soit $P_t$ le cours ou la valeur liquidative d'un fonds à l'instant $t$. On définit le processus croissant du **sommet historique cumulé** (*Running Maximum* ou *High Watermark*) :

$$
M_t = \\max_{0 \\le s \\le t} P_s
$$

Le **Drawdown instantané** $DD_t \\le 0$ mesure le recul relatif depuis le sommet $M_t$, et le **Maximum Drawdown ($MDD$)** est le pire creux atteint sur l'horizon $[0, T]$ :

$$
DD_t = \\frac{P_t - M_t}{M_t} \\le 0, \\qquad MDD = \\min_{0 \\le t \\le T} DD_t
$$

**Asymétrie algébrique de la récupération (*Recovery Math*) :**
Si un portefeuille subit un drawdown de profondeur $d = |DD_t| \\in [0, 1[$, la valeur restante est $P_t = M_t (1 - d)$. Pour revenir au sommet $M_t$, le rendement futur requis $R_{\\text{rec}}$ satisfait $(1 - d)(1 + R_{\\text{rec}}) = 1$, soit :

$$
R_{\\text{rec}} = \\frac{d}{1 - d}
$$

Ainsi, une chute de $-20\\%$ nécessite $+25\\%$, une chute de $-50\\%$ exige **$+100\\%$**, et une perte de $-80\\%$ exige $+400\\%$.

![Maximum Drawdown](/images/theory/fig_maximum_drawdown.png)

> 🔍 **Lecture du graphique — L'immersion sous l'eau (Underwater Chart) :**
> La ligne rouge pointillée représente le *High Watermark* $M_t$ (enveloppe supérieure non décroissante). Tant que la courbe bleue $P_t$ reste en dessous, le portefeuille est « sous l'eau » (zone ombrée rouge). L'amplitude maximale de cette zone correspond au $MDD$.

**Exemple numérique pas-à-pas** ($P_0 = 100, P_1 = 120, P_2 = 90, P_3 = 110\\text{ EUR}$) :
- À $t=0$ : $M_0 = 100 \\implies DD_0 = 0\\%$.
- À $t=1$ : $M_1 = \\max(100, 120) = 120 \\implies DD_1 = 0\\%$.
- À $t=2$ : $M_2 = 120 \\implies DD_2 = \\frac{90 - 120}{120} = -25.00\\%$.
- À $t=3$ : $M_3 = 120 \\implies DD_3 = \\frac{110 - 120}{120} \\approx -8.33\\%$.
- Globalement : $MDD = \\min(0\\%, 0\\%, -25\\%, -8.33\\%) = -25.00\\%$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Les mandats institutionnels et les stratégies *CPPI* (assurance de portefeuille) imposent des seuils stricts de *Drawdown Stop* et évaluent les gérants via le **Ratio de Calmar** $= \\frac{\\mathbb{E}[R_{\\text{ann}}]}{|MDD|}$. De plus, les commissions de surperformance des Hedge Funds ne sont prélevées que lorsque $P_t > M_t$ (*High Watermark*).

#### 💻 Masterclass SQL Quantitative

Pour calculer un agrégat cumulatif depuis l'origine de la série jusqu'à la date courante, on utilise la borne \`UNBOUNDED PRECEDING\` :
- \`MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\` balaie toutes les lignes du début de la partition jusqu'à la ligne courante incluse.
- **Précision critique sur le cadre par défaut** : si l'on écrit seulement \`OVER (ORDER BY date)\` sans préciser \`ROWS BETWEEN ...\`, SQLite (conforme au standard SQL) applique par défaut \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. En présence de dates dupliquées, \`RANGE\` agrège ensemble toutes les lignes de même date, ce qui brise un calcul path-dependent sur séries intrajournalières. Écrire explicitement \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` lève toute ambiguïté.

\`\`\`sql
WITH peaks AS (
  SELECT
      date,
      prix_cloture,
      -- High Watermark cumulatif depuis le début de la série
      MAX(prix_cloture) OVER (
          ORDER BY date ASC
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS sommet_cumule
  FROM marche_actions
  WHERE ticker = 'TTE'
)
SELECT
    date,
    prix_cloture,
    sommet_cumule,
    -- Drawdown exprimé en pourcentage (<= 0)
    ((prix_cloture - sommet_cumule) / sommet_cumule) * 100.0 AS drawdown_pct
FROM peaks
ORDER BY date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur \`marche_actions\` pour \`'TTE'\` :

\`\`\`sql
WITH peaks AS (
  SELECT date, prix_cloture,
         MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule
  FROM marche_actions WHERE ticker = 'TTE'
)
SELECT date, prix_cloture, sommet_cumule,
       ROUND(((prix_cloture - sommet_cumule) / sommet_cumule) * 100.0, 4) AS drawdown_pct
FROM peaks ORDER BY date;
\`\`\`

\`\`\`text
date       | prix_cloture | sommet_cumule | drawdown_pct
-----------+--------------+---------------+-------------
2024-01-02 | 61.8         | 61.8          | 0
2024-01-03 | 62.4         | 62.4          | 0
2024-01-04 | 62           | 62.4          | -0.641
2024-01-05 | 63           | 63            | 0
2024-01-08 | 62.6         | 63            | -0.6349
\`\`\`

Le sommet monte de $61.80$ à $62.40$ puis $63.00\\text{ EUR}$. Le pire repli ($MDD = -0.6410\\%$) intervient le \`2024-01-04\` ($62.00$ vs $62.40$), avant que la série ne marque un nouveau plus haut le 5 janvier ($DD = 0\\%$).
      `,
      taskMarkdown:
        "Pour le ticker `'TTE'`, sélectionnez `date`, `prix_cloture`, le plus haut historique `sommet_cumule` défini par `MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`, et le `drawdown_pct` calculé par `((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100`. Triez par `date`.",
      initialCode:
        "-- Calculez le sommet cumulé et le drawdown en pourcentage :\n",
      solutionCode:
        "SELECT date, prix_cloture, MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule, ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
      validationQuery:
        "SELECT date, prix_cloture, MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule, ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
      hints: [
        "MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) donne le plus haut historique.",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-5",
      title: "5. Ranking & Segmentation par Quantiles (NTILE & DENSE_RANK)",
      category: "data_engineering",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 6,
      description:
        "Classez les actifs par rendement pour la séance du 2024-01-02 en 2 groupes de performance.",
      theoryMarkdown: `
### Segmentation Factorielle en Coupe Transversale (Cross-Sectional Quantiles)

#### 🎓 Cours Théorique Approfondi

Dans la recherche factorielle (Fama-French, Carhart *Momentum*, *Low-Volatility*), les gérants quantitatifs évaluent à chaque date $t$ la performance relative des $N$ actifs d'un univers en **coupe transversale** (*cross-section*). Soient les statistiques d'ordre $r_{(1),t} \\ge r_{(2),t} \\ge \\dots \\ge r_{(N),t}$ des rendements triés par ordre décroissant.

On partitionne cet univers ordonné en $k$ quantiles de cardinalité quasi égale (quintiles $k=5$, déciles $k=10$, ou bipartition $k=2$) afin de former un portefeuille **Long/Short neutre au marché** :

$$
R_{t+1}^{\\text{L/S}} = \\frac{1}{|Q_1|}\\sum_{i \\in Q_1} R_{i,t+1} - \\frac{1}{|Q_k|}\\sum_{i \\in Q_k} R_{i,t+1}
$$

- **\`NTILE(k)\`** divise les $N$ lignes en $k$ compartiments. Lorsque $N$ n'est pas divisible par $k$ ($N = qk + r$ avec $0 \\le r < k$), SQLite place $\\lceil N/k \\rceil = q + 1$ actifs dans les $r$ premiers buckets et $\\lfloor N/k \\rfloor = q$ actifs dans les $k - r$ suivants. Avec $N=5$ et $k=2$, on obtient donc **3 actifs dans le groupe 1** et **2 actifs dans le groupe 2**.

**Comportement exact face aux ex-æquo (*ties*) :**
Supposons que deux actifs partagent exactement la même valeur classée $2^\\text{e}$ :
- \`ROW_NUMBER()\` attribue des entiers strictement distincts ($1, 2, 3, 4$) de manière arbitraire si aucun second critère de tri n'est fourni.
- \`RANK()\` attribue le même rang aux ex-æquo mais laisse un trou arithmétique ($1, 2, 2, 4$), égal au nombre de prédécesseurs $+ 1$.
- \`DENSE_RANK()\` attribue le même rang sans jamais sauter d'entier ($1, 2, 2, 3$).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Les modèles factoriels multi-actifs utilisent le classement par quantiles pour tester la monotonie des primes de risque (le rendement moyen de $Q_1$ à $Q_k$ doit croître/décroître régulièrement) et construire des indices *Smart Beta* neutres en bêta.

#### 💻 Masterclass SQL Quantitative

Les fonctions de classement sont des fonctions de fenêtre exigeant impérativement une clause \`ORDER BY\` à l'intérieur de \`OVER (...)\` :
- \`NTILE(2) OVER (ORDER BY rendement_journalier DESC)\` prend un entier positif en argument (le nombre de groupes $k$), tandis que \`RANK()\`, \`DENSE_RANK()\` et \`ROW_NUMBER()\` ne prennent aucun argument.
- Lorsqu'on classe sur plusieurs dates simultanément, il est indispensable d'ajouter \`PARTITION BY date\` dans \`OVER (PARTITION BY date ORDER BY ...)\` pour réinitialiser les quantiles à chaque séance.
- **Bonne pratique de reproductibilité** : en production, ajoutez toujours un critère secondaire déterministe (ex: \`ORDER BY rendement_journalier DESC, ticker ASC\`) pour éviter que \`NTILE\` ou \`ROW_NUMBER\` ne dépendent de l'ordre physique sur disque en cas d'égalité.

\`\`\`sql
SELECT
    ticker,
    nom_societe,
    rendement_journalier,
    -- Rang continu sans saut d'entier en cas d'ex-æquo
    DENSE_RANK() OVER (ORDER BY rendement_journalier DESC, ticker ASC) AS rang_dense,
    -- Bipartition en 2 groupes (Top 3 dans groupe 1, Bottom 2 dans groupe 2 pour N=5)
    NTILE(2) OVER (ORDER BY rendement_journalier DESC, ticker ASC) AS groupe_perf
FROM marche_actions
WHERE date = '2024-01-02'
ORDER BY rendement_journalier DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

1) Exécution réelle sur la séance du \`2024-01-02\` :

\`\`\`sql
SELECT ticker, nom_societe, rendement_journalier,
       DENSE_RANK() OVER (ORDER BY rendement_journalier DESC) AS rang_dense,
       NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf
FROM marche_actions
WHERE date = '2024-01-02'
ORDER BY rendement_journalier DESC;
\`\`\`

\`\`\`text
ticker | nom_societe       | rendement_journalier | rang_dense | groupe_perf
-------+-------------------+----------------------+------------+------------
MC     | LVMH              | 0.011                | 1          | 1
AI     | Air Liquide       | 0.0103               | 2          | 1
TTE    | TotalEnergies     | 0.0098               | 3          | 1
CW8    | Amundi MSCI World | 0.0056               | 4          | 2
BNP    | BNP Paribas       | 0.0048               | 5          | 2
\`\`\`

2) Illustration de la divergence \`ROW_NUMBER\` vs \`RANK\` vs \`DENSE_RANK\` en créant des ex-æquo via un arrondi à 2 décimales (\`0.01\` pour 4 titres et \`0.00\` pour \`BNP\`) :

\`\`\`sql
SELECT ticker, rendement_journalier,
       ROW_NUMBER() OVER (ORDER BY ROUND(rendement_journalier, 2) DESC, ticker) AS row_num,
       RANK() OVER (ORDER BY ROUND(rendement_journalier, 2) DESC) AS rang,
       DENSE_RANK() OVER (ORDER BY ROUND(rendement_journalier, 2) DESC) AS rang_dense,
       NTILE(2) OVER (ORDER BY ROUND(rendement_journalier, 2) DESC, ticker) AS bucket
FROM marche_actions WHERE date = '2024-01-02'
ORDER BY ROUND(rendement_journalier, 2) DESC, ticker;
\`\`\`

\`\`\`text
ticker | rendement_journalier | row_num | rang | rang_dense | bucket
-------+----------------------+---------+------+------------+-------
AI     | 0.0103               | 1       | 1    | 1          | 1
CW8    | 0.0056               | 2       | 1    | 1          | 1
MC     | 0.011                | 3       | 1    | 1          | 1
TTE    | 0.0098               | 4       | 1    | 1          | 2
BNP    | 0.0048               | 5       | 5    | 2          | 2
\`\`\`

Remarquez comment \`RANK()\` saute directement de \`1\` à \`5\` pour \`BNP\`, alors que \`DENSE_RANK()\` enchaîne proprement \`1\` puis \`2\`, et que \`NTILE(2)\` coupe mécaniquement entre le 3e et le 4e rang malgré l'égalité.
      `,
      taskMarkdown:
        "Pour la date `'2024-01-02'`, sélectionnez `ticker`, `nom_societe`, `rendement_journalier`, et partitionnez les actifs en 2 groupes avec `NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf`. Triez par `rendement_journalier` décroissant.",
      initialCode: "-- Segmentez les titres en 2 buckets de performance :\n",
      solutionCode:
        "SELECT ticker, nom_societe, rendement_journalier, NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf FROM marche_actions WHERE date = '2024-01-02' ORDER BY rendement_journalier DESC;",
      validationQuery:
        "SELECT ticker, nom_societe, rendement_journalier, NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf FROM marche_actions WHERE date = '2024-01-02' ORDER BY rendement_journalier DESC;",
      hints: [
        "Utilisez NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf.",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-6",
      title: "6. Jointure Temporelle Asynchrone (ASOF Join / Forward-Fill)",
      category: "data_engineering",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 10,
      description:
        "Associez à chaque séance de bourse la dernière valeur connue de la courbe des taux souverains OAT.",
      theoryMarkdown: `
### Réconciliation Multi-Fréquence et Causalité : L'Opérateur ASOF Join

#### 🎓 Cours Théorique Approfondi

En Data Engineering financier, les sources de données possèdent rarement des horodatages alignés :
- Les cours boursiers dans \`marche_actions\` sont observés à fréquence **journalière** (jours ouvrés de janvier 2024).
- La courbe des taux souverains \`courbe_taux_oat\` est publiée à fréquence **mensuelle** en fin de mois (de \`2023-01-31\` à \`2023-12-31\`).

Soient $\\mathcal{T}_A$ l'ensemble des dates actions et $\\mathcal{T}_M$ l'ensemble des dates macroéconomiques. Lorsque $\\mathcal{T}_A \\cap \\mathcal{T}_M = \\emptyset$, une jointure exacte \`INNER JOIN ON m.date = c.date\` produit **l'ensemble vide ($0$ ligne)**.

L'opérateur **ASOF Join** (*As-Of Join*, ou *Last Observation Carried Forward* — LOCF) résout cette asynchronicité de manière causale en associant à toute date $t \\in \\mathcal{T}_A$ la date d'observation disponible la plus récente qui lui est antérieure ou égale :

$$
\\tau(t) = \\max \\{ s \\in \\mathcal{T}_M : s \\le t \\}
$$

**Pourquoi la contrainte $s \\le t$ est-elle vitale contre le Look-Ahead Bias ?**
- Si l'on prenait la date macro la plus proche $|s - t|$ (sans direction) ou une interpolation linéaire entre $s_k < t < s_{k+1}$, on utiliserait à la date $t$ une observation future $s_{k+1} > t$ qui n'existait pas encore sur le marché !
- En restreignant l'ensemble candidat à $s \\le t$, le taux associé à l'instant $t$ est **$\\mathcal{F}_t$-mesurable** : il ne contient strictement que de l'information publique déjà publiée au plus tard à la date $t$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> En valorisation d'actifs hybrides, en calcul de primes de risque actions (excès de rendement $R_t - r_{f,\\tau(t)}$) ou en pilotage ALM Solvabilité II, on doit aligner des flux quotidiens de marché avec des courbes de taux EIOPA mensuelles ou des états comptables trimestriels sans jamais introduire de biais d'anticipation.

#### 💻 Masterclass SQL Quantitative

Des moteurs spécialisés comme DuckDB, Snowflake ou ClickHouse disposent d'un mot-clé dédié \`ASOF JOIN\`. En SQL ANSI et en **SQLite**, on implémente rigoureusement cette sémantique par deux patrons :
1. **Sous-requête scalaire corrélée** (pour extraire 1 indicateur macro) :
   \`(SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1)\`
   Pour chaque ligne \`m\` de la requête externe, SQLite cherche dans l'index \`PRIMARY KEY\` de \`courbe_taux_oat(date)\` la plus grande date $\\le \\text{m.date}$ grâce au tri décroissant suivi de \`LIMIT 1\`, en complexité $\\mathcal{O}(\\log N_M)$ par ligne.
2. **Patron \`JOIN\` + \`ROW_NUMBER()\`** (lorsqu'on veut récupérer plusieurs colonnes simultanément comme \`taux_1y\`, \`taux_10y\`, \`taux_30y\`) : on réalise un \`LEFT JOIN ... ON c.date <= m.date\` suivi d'un classement \`ROW_NUMBER() OVER (PARTITION BY m.id ORDER BY c.date DESC) = 1\`.

\`\`\`sql
SELECT
    m.date,
    m.ticker,
    m.prix_cloture,
    -- Sous-requête corrélée ASOF : dernier taux OAT 10 ans connu à la date m.date
    (
        SELECT c.taux_10y
        FROM courbe_taux_oat c
        WHERE c.date <= m.date       -- Causalité stricte : aucune donnée future
        ORDER BY c.date DESC         -- Plus récente publication en tête
        LIMIT 1                      -- Forward-fill (LOCF) d'une seule valeur
    ) AS dernier_taux_10y
FROM marche_actions m
WHERE m.ticker = 'AI'
ORDER BY m.date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur \`marche_actions\` (\`'AI'\`) apparié à \`courbe_taux_oat\`, en affichant aussi la date OAT sélectionnée \`date_oat_asof\` pour vérifier l'ancrage temporel :

\`\`\`sql
SELECT m.date, m.ticker, m.prix_cloture,
       (SELECT MAX(date) FROM courbe_taux_oat WHERE date <= m.date) AS date_oat_asof,
       (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y
FROM marche_actions m
WHERE m.ticker = 'AI'
ORDER BY m.date;
\`\`\`

\`\`\`text
date       | ticker | prix_cloture | date_oat_asof | dernier_taux_10y
-----------+--------+--------------+---------------+-----------------
2024-01-02 | AI     | 176.8        | 2023-12-31    | 2.55
2024-01-03 | AI     | 177.2        | 2023-12-31    | 2.55
2024-01-04 | AI     | 176.5        | 2023-12-31    | 2.55
2024-01-05 | AI     | 178.9        | 2023-12-31    | 2.55
2024-01-08 | AI     | 179.5        | 2023-12-31    | 2.55
\`\`\`

Toutes les séances de début janvier 2024 héritent proprement de la clôture OAT du \`2023-12-31\` ($2.55\\%$), dernière information observable à ces dates.
      `,
      taskMarkdown:
        "Pour les cotations de `'AI'` en janvier 2024, sélectionnez `m.date`, `m.ticker`, `m.prix_cloture` et associez via une sous-requête corrélée la dernière valeur connue du taux souverain 10 ans `(SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y`. Triez par `m.date`.",
      initialCode: "-- Effectuez la jointure temporelle asynchrone (LOCF) :\n",
      solutionCode:
        "SELECT m.date, m.ticker, m.prix_cloture, (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y FROM marche_actions m WHERE m.ticker = 'AI' ORDER BY m.date;",
      validationQuery:
        "SELECT m.date, m.ticker, m.prix_cloture, (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y FROM marche_actions m WHERE m.ticker = 'AI' ORDER BY m.date;",
      hints: [
        "Utilisez une sous-requête scalaire dans le SELECT avec WHERE date <= m.date ORDER BY date DESC LIMIT 1.",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-7",
      title: "7. Matrice de Transition Crédit (Chaîne de Markov en SQL)",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description:
        "Comptez et calculez les corrélations bilatérales pour identifier les actifs hautement corrélés (> 0.50).",
      theoryMarkdown: `
### Matrices de Corrélation, Dépendance Crédit et Chaînes de Markov

#### 🎓 Cours Théorique Approfondi

En finance quantitative et modélisation du risque de crédit, les matrices de dépendance et de transition sont stockées en base de données sous forme relationnelle normalisée $(i, j, M_{ij})$.

**1. Structure d'une matrice de corrélation $C \\in [-1, 1]^{K \\times K}$ :**
Pour deux actifs $i$ et $j$, le coefficient de Pearson vaut :

$$
\\rho_{ij} = \\frac{\\operatorname{Cov}(R_i, R_j)}{\\sigma_i \\sigma_j}
$$

$C$ est **symétrique** ($\\rho_{ij} = \\rho_{ji}$), à **diagonale unitaire** ($\\rho_{ii} = 1$) et **semi-définie positive** ($\\mathbf{w}' C \\mathbf{w} \\ge 0$). Dans la variance d'un portefeuille de Markowitz :

$$
\\sigma_p^2 = \\sum_{i=1}^K w_i^2 \\sigma_i^2 + 2 \\sum_{1 \\le i < j \\le K} w_i w_j \\sigma_i \\sigma_j \\rho_{ij}
$$

la réduction du risque par diversification provient des termes croisés $i < j$ lorsque $\\rho_{ij}$ est faible ou négatif. À l'inverse, les paires où $\\rho_{ij} > 0.50$ traduisent une **concentration factorielle cachée** : en période de stress (*correlation breakdown*), elles chutent simultanément.

**2. Lien structurel avec les chaînes de Markov en Risque de Crédit :**
Dans une matrice de transition de notations de crédit $P$ (états $S = \\{\\text{AAA}, \\text{AA}, \\dots, \\text{Défaut}\\}$), chaque entrée $P_{ij} = \\mathbb{P}(X_{t+1} = j \\mid X_t = i)$ vérifie $P_{ij} \\ge 0$ et $\\sum_j P_{ij} = 1$. Les éléments hors diagonale ($i \\ne j$) mesurent les probabilités de migration ou de défaut, et la transition à $2$ ans s'obtient directement par produit matriciel relationnel :

$$
(P^2)_{ik} = \\sum_{j \\in S} P_{ij} P_{jk}
$$

**Filtrage diagonal vs triangulaire :**
- \`actif_a != actif_b\` élimine les $K$ termes diagonaux ($\\rho_{ii} = 1$), mais conserve chaque paire en double ($(A, B)$ et $(B, A)$) lorsque la matrice complète $K \\times K$ est stockée.
- \`actif_a < actif_b\` (ordre lexicographique) extrait uniquement le triangle supérieur strict, réduisant $K(K-1)$ entrées à $\\frac{K(K-1)}{2}$ paires uniques.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous Bâle III / Solvabilité II (modèle de Vasicek asymptotique à facteur unique pour le risque de défaut et modules de corrélation SCR), l'identification des expositions fortement corrélées ($\\rho > 0.50$) permet de prévenir la fausse diversification et de calibrer les chocs de contagion inter-secteurs.

#### 💻 Masterclass SQL Quantitative

La table \`matrice_correlations\` contient les $5 \\times 5 = 25$ paires orientées entre \`TTE\`, \`BNP\`, \`MC\`, \`AI\` et \`CW8\` (clé primaire composite \`(actif_a, actif_b)\`).
- Pour inspecter toutes les corrélations croisées élevées hors diagonale, on filtre \`WHERE actif_a != actif_b AND correlation > 0.50\`.
- Pour dédoublonner une matrice symétrique en paires non ordonnées, il suffit de remplacer \`!=\` par \`<\`.
- Pour calculer une chaîne de Markov à deux pas ($P^2$) en pur SQL sur une matrice stockée en format \`(i, j, p)\`, on écrit une auto-jointure agrégée : \`SELECT a.i, b.j, SUM(a.p * b.p) FROM P a JOIN P b ON a.j = b.i GROUP BY a.i, b.j\`.

\`\`\`sql
SELECT
    actif_a,
    actif_b,
    correlation
FROM matrice_correlations
WHERE actif_a != actif_b      -- Exclut la diagonale (rho_ii = 1.00)
  AND correlation > 0.50      -- Isole les dépendances fortes (> 50 %)
ORDER BY correlation DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Dans \`matrice_correlations\`, \`actif_a != actif_b AND correlation > 0.50\` retourne $10$ lignes (5 couples symétriques), tandis que la version triangulaire supérieure \`actif_a < actif_b\` isole exactement les **5 paires distinctes** à forte co-dépendance :

\`\`\`sql
SELECT actif_a, actif_b, correlation
FROM matrice_correlations
WHERE actif_a < actif_b AND correlation > 0.50
ORDER BY correlation DESC;
\`\`\`

\`\`\`text
actif_a | actif_b | correlation
--------+---------+------------
CW8     | MC      | 0.7
AI      | CW8     | 0.65
BNP     | CW8     | 0.62
CW8     | TTE     | 0.55
AI      | MC      | 0.52
\`\`\`

Sans surprise économique, l'ETF mondial \`CW8\` est fortement corrélé ($0.55$ à $0.70$) avec chacun des 4 titres du CAC 40, tandis que \`MC\` et \`AI\` affichent une corrélation bilatérale de $0.52$.
      `,
      taskMarkdown:
        "À partir de la table `matrice_correlations`, sélectionnez `actif_a`, `actif_b` et `correlation` pour toutes les paires distinctes (`actif_a != actif_b`) dont la corrélation est strictement supérieure à `0.50`. Triez par `correlation` décroissante.",
      initialCode: "-- Isolez les paires d'actifs fortement corrélées :\n",
      solutionCode:
        "SELECT actif_a, actif_b, correlation FROM matrice_correlations WHERE actif_a != actif_b AND correlation > 0.50 ORDER BY correlation DESC;",
      validationQuery:
        "SELECT actif_a, actif_b, correlation FROM matrice_correlations WHERE actif_a != actif_b AND correlation > 0.50 ORDER BY correlation DESC;",
      hints: [
        "WHERE actif_a != actif_b AND correlation > 0.50",
        "ORDER BY correlation DESC",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-8",
      title: "8. Arbre Binomial de Cox-Ross-Rubinstein (CTE Récursive)",
      category: "pricing",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 12,
      description:
        "Générez la structure d'un arbre stochastique à 3 pas de temps en utilisant une CTE récursive.",
      theoryMarkdown: `
### Modélisation Stochastique Discrète : L'Arbre Binomial CRR en SQL

#### 🎓 Cours Théorique Approfondi

Le modèle discret de **Cox-Ross-Rubinstein (1979)** discrétise la dynamique du mouvement brownien géométrique $dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$ sur $N$ pas de temps $\\Delta t = T / N$. À chaque étape, le cours $S$ peut soit monter d'un facteur $u > 1$, soit baisser d'un facteur $d < 1$ :

$$
u = e^{\\sigma\\sqrt{\\Delta t}}, \\qquad d = \\frac{1}{u} = e^{-\\sigma\\sqrt{\\Delta t}}
$$

**Calibration par appariement des moments et absence d'arbitrage :**
Sous la probabilité risque-neutre $p \\in ]0, 1[$, l'espérance actualisée doit égaler le prix forward et la variance locale doit valoir $\\sigma^2 \\Delta t$ :

$$
p = \\frac{e^{r\\Delta t} - d}{u - d}, \\qquad d < e^{r\\Delta t} < u
$$

**Propriété de recombinaison du treillis :**
Parce que $u \\cdot d = 1$, une hausse suivie d'une baisse donne le même cours qu'une baisse suivie d'une hausse ($S_0 u d = S_0 d u = S_0$). Le nombre de nœuds à l'étape $n$ croît donc **linéairement** en $n+1$ (soit $\\frac{(N+1)(N+2)}{2}$ nœuds au lieu de $2^N$ pour un arbre non recombinant !). Après $n$ pas et $j$ hausses ($0 \\le j \\le n$), le cours au nœud $(n, j)$ vaut exactement :

$$
S_{n,j} = S_0 \\, u^j \\, d^{n-j} = S_0 \\, u^{2j - n}
$$

**Vérification sur la branche haussière pure** ($j = n$, $S_0 = 100\\text{ EUR}$, $u = 1.05$) :
- $n = 0$ : $S_{0,0} = 100.0\\text{ EUR}$.
- $n = 1$ : $S_{1,1} = 100 \\times 1.05 = 105.0\\text{ EUR}$.
- $n = 2$ : $S_{2,2} = 105 \\times 1.05 = 110.25\\text{ EUR}$.
- $n = 3$ : $S_{3,3} = 110.25 \\times 1.05 = 115.7625\\text{ EUR}$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> L'arbre binomial CRR converge en distribution vers Black-Scholes quand $N \\to \\infty$, tout en permettant l'évaluation par programmation dynamique (*backward induction*) des options américaines exerçables à tout instant et des clauses de rachat en assurance-vie épargne.

#### 💻 Masterclass SQL Quantitative

Une **CTE récursive** (\`WITH RECURSIVE\`) implémente un calcul par point fixe sans boucle procédurale \`for/while\` :
1. **Membre d'ancrage (Anchor)** : génère l'état initial ($n = 0, S_0 = 100.0$).
2. **Opérateur \`UNION ALL\`** : concatène les nouvelles générations aux précédentes (ou \`UNION\` si l'on souhaite fusionner automatiquement les nœuds recombinants à chaque niveau).
3. **Membre récursif** : référence le nom de la CTE (\`FROM arbre\`) pour calculer $n + 1$ à partir de $n$.
4. **Condition d'arrêt stricte** : \`WHERE n < 3\` est obligatoire ; sans prédicat de terminaison, la requête bouclerait indéfiniment jusqu'à saturation mémoire.

\`\`\`sql
WITH RECURSIVE arbre(n, prix) AS (
    -- 1. Ancre : racine de l'arbre à t = 0
    SELECT 0, 100.0
    UNION ALL
    -- 2. Transition récursive : branche haussière S_{n+1} = S_n * u
    SELECT n + 1, prix * 1.05
    FROM arbre
    WHERE n < 3    -- Condition d'arrêt : 3 pas de temps (n = 0, 1, 2, 3)
)
SELECT n, prix
FROM arbre
ORDER BY n ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Génération réelle d'un **treillis binomial recombinant 2D complet** \`(n, j, prix_noeud)\` pour $N = 3$ pas, $S_0 = 100$ et $u = 1.05, d = 1/1.05$ en SQLite récursif :

\`\`\`sql
WITH RECURSIVE crr(n, j, prix) AS (
  SELECT 0, 0, 100.0
  UNION ALL
  SELECT n + 1, j + 1, prix * 1.05 FROM crr WHERE n < 3 AND j = n
  UNION ALL
  SELECT n + 1, j, prix / 1.05 FROM crr WHERE n < 3
)
SELECT n, j, ROUND(prix, 4) AS prix_noeud
FROM (SELECT DISTINCT n, j, ROUND(prix, 8) AS prix FROM crr)
ORDER BY n, j DESC;
\`\`\`

\`\`\`text
n | j | prix_noeud
--+---+-----------
0 | 0 | 100
1 | 1 | 105
1 | 0 | 95.2381
2 | 2 | 110.25
2 | 1 | 100
2 | 0 | 90.7029
3 | 3 | 115.7625
3 | 2 | 105
3 | 1 | 95.2381
3 | 0 | 86.3838
\`\`\`

On retrouve exactement les $\\frac{4 \\times 5}{2} = 10$ nœuds du treillis recombinant (avec $S_{2,1} = 100$ et $S_{3,2} = 105$ recombinés à l'identique), dont la trajectoire supérieure $(0,0) \\to (1,1) \\to (2,2) \\to (3,3)$ produit \`100, 105, 110.25, 115.7625\`.
      `,
      taskMarkdown:
        "Écrivez une requête récursive `WITH RECURSIVE arbre(n, prix) AS (...)` générant les pas de temps `n` de 0 à 3 et calculant le cours de la branche haussière pour $S_0 = 100$ et un facteur multiplicatif $u = 1.05$ (où `prix = 100.0 * POWER(1.05, n)`). La sortie doit comporter les colonnes `n` et `prix`, triées par `n` croissant.",
      initialCode:
        "-- Construisez la trajectoire géométrique avec WITH RECURSIVE :\n",
      solutionCode:
        "WITH RECURSIVE arbre(n, prix) AS (SELECT 0, 100.0 UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3) SELECT n, prix FROM arbre ORDER BY n;",
      validationQuery:
        "WITH RECURSIVE arbre(n, prix) AS (SELECT 0, 100.0 UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3) SELECT n, prix FROM arbre ORDER BY n;",
      hints: [
        "Démarrez avec SELECT 0, 100.0",
        "UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-9",
      title: "9. Détection des Anomalies de Marché par Z-Score",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description:
        "Détectez les séances où le volume échangé a dépassé de 20% la moyenne globale du ticker.",
      theoryMarkdown: `
### Détection de Pics de Liquidité par Partitionnement et Z-Score

#### 🎓 Cours Théorique Approfondi

En microstructure des marchés financiers (modèles de Kyle et de *VPIN* — *Volume-Synchronized Probability of Informed Trading*), les variations extrêmes de cours et les annonces macroéconomiques s'accompagnent de **chocs de volume** (*Volume Spikes*). De plus, l'impact de marché (*slippage*) d'un ordre de taille $Q$ croît typiquement comme la racine carrée du volume relatif $\\sqrt{Q / \\bar{V}_i}$.

Il est mathématiquement impossible de comparer directement le volume brut entre deux actions de liquidité hétérogène : \`BNP\` échange en moyenne $2\\,980\\,000$ titres par jour contre $152\\,000$ parts pour l'ETF \`CW8\`. On doit donc **normaliser conditionnellement à chaque actif $i$** soit par le **ratio de volume**, soit par le **Z-Score** :

$$
\\text{Ratio}_{i,t} = \\frac{V_{i,t}}{\\mu_{V,i}}, \\qquad Z_{i,t} = \\frac{V_{i,t} - \\mu_{V,i}}{\\sigma_{V,i}}
$$

où la moyenne $\\mu_{V,i}$ et l'écart-type $\\sigma_{V,i} = \\sqrt{\\mathbb{E}[V_i^2] - \\mathbb{E}[V_i]^2}$ (par Koenig-Huygens) sont calculés **à l'intérieur de la partition de l'actif $i$**. Un ratio $> 1.15$ ($+15\\%$ au-dessus de la normale) ou $Z_{i,t} > 1.5$ signale une activité institutionnelle inhabituelle.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Les desks d'exécution algorithmique (*VWAP / TWAP*) et les fonctions de surveillance de liquidité (*Liquidity Risk* sous directives UCITS / AIFMD) détectent ces anomalies en temps réel pour ajuster la taille des tranches d'ordres et estimer les délais de liquidation en scénario de stress.

#### 💻 Masterclass SQL Quantitative

Cet exercice illustre deux concepts architecturaux majeurs du SQL analytique :
1. **\`GROUP BY ticker\` vs \`OVER (PARTITION BY ticker)\`** :
   - \`GROUP BY ticker\` **écrase** les lignes journalières en une seule ligne par actif (on perd \`date\` et \`volume\` journalier).
   - \`AVG(volume) OVER (PARTITION BY ticker)\` calcule la moyenne du ticker et la **projette sur chaque séance individuelle** sans détruire la granularité temporelle.
2. **Ordre d'exécution logique de SQL** :
   Le moteur évalue les clauses dans l'ordre strict : \`FROM\` $\\to$ \`WHERE\` $\\to$ \`GROUP BY\` $\\to$ \`HAVING\` $\\to$ **\`WINDOW (OVER)\`** $\\to$ \`SELECT\` $\\to$ \`ORDER BY\`.
   Par conséquent, écrire \`WHERE volume > 1.15 * AVG(volume) OVER (...)\` déclenche une **erreur de syntaxe** (*misuse of window function*), car \`WHERE\` s'exécute *avant* l'évaluation de la fenêtre ! Il faut donc calculer \`vol_moyen\` dans une sous-requête (ou CTE) puis filtrer \`WHERE volume > 1.15 * vol_moyen\` dans la requête englobante.

\`\`\`sql
-- Étape 1 (sous-requête) : projeter la moyenne par ticker sur chaque séance
SELECT date, ticker, volume, vol_moyen
FROM (
    SELECT
        date,
        ticker,
        volume,
        AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen
    FROM marche_actions
)
-- Étape 2 : filtrer les anomalies APRÈS calcul de la fenêtre
WHERE volume > 1.15 * vol_moyen
ORDER BY date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur \`marche_actions\` calculant simultanément le seuil \`ratio_vol > 1.15\` et le \`z_score\` par ticker (via Koenig-Huygens ; notez \`volume * 1.0 * volume\` pour éviter tout débordement d'entier 64 bits ou division entière) :

\`\`\`sql
WITH stats AS (
  SELECT date, ticker, volume,
         AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen,
         AVG(volume * 1.0 * volume) OVER (PARTITION BY ticker) AS e_v2
  FROM marche_actions
)
SELECT date, ticker, volume, CAST(vol_moyen AS INTEGER) AS vol_moyen,
       ROUND(volume / vol_moyen, 3) AS ratio_vol,
       ROUND((volume - vol_moyen) / SQRT(e_v2 - vol_moyen * vol_moyen), 2) AS z_score
FROM stats
WHERE volume > 1.15 * vol_moyen
ORDER BY date, ratio_vol DESC;
\`\`\`

\`\`\`text
date       | ticker | volume  | vol_moyen | ratio_vol | z_score
-----------+--------+---------+-----------+-----------+--------
2024-01-05 | CW8    | 190000  | 152000    | 1.25      | 1.48
2024-01-05 | TTE    | 2800000 | 2300000   | 1.217     | 1.58
2024-01-05 | AI     | 690000  | 584000    | 1.182     | 1.55
2024-01-05 | MC     | 520000  | 450000    | 1.156     | 1.49
\`\`\`

Les 4 anomalies convergent sur la même date du \`2024-01-05\`, avec des Z-scores compris entre $+1.48$ et $+1.58$ écarts-types au-dessus de la moyenne de chaque titre — caractéristique d'un flux acheteur systématique sur l'ensemble de la cote ce jour-là.
      `,
      taskMarkdown:
        "Sélectionnez `date`, `ticker`, `volume`, et la moyenne du volume par ticker `AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen` depuis `marche_actions`. Filtrez via une sous-requête les lignes où `volume > 1.15 * vol_moyen`. Triez par `date` croissante.",
      initialCode: "-- Isolez les séances de fort pic de volume :\n",
      solutionCode:
        "SELECT date, ticker, volume, vol_moyen FROM (SELECT date, ticker, volume, AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen ORDER BY date;",
      validationQuery:
        "SELECT date, ticker, volume, vol_moyen FROM (SELECT date, ticker, volume, AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen ORDER BY date;",
      hints: [
        "Enveloppez la fenêtre dans une sous-requête : FROM (SELECT ..., AVG(volume) OVER (...) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-10",
      title: "10. Ratio Rendement/Risque (Sharpe) & Classement ESG",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description:
        "Filtrez et classez les actifs de portefeuille combinant performance financière et responsabilité extra-financière.",
      theoryMarkdown: `
### Ratio de Sharpe et Screening Multi-Critères ESG

#### 🎓 Cours Théorique Approfondi

Dans la théorie moderne du portefeuille (Markowitz et Tobin), lorsque l'investisseur peut combiner un actif sans risque de rendement $r_f$ avec un actif risqué $i$ d'espérance $\\mathbb{E}[R_i]$ et de volatilité $\\sigma_i$, l'ensemble des combinaisons forme une droite dans le plan $(\\sigma, \\mathbb{E}[R])$ : la *Capital Allocation Line* (CAL) :

$$
\\mathbb{E}[R_p] = r_f + \\underbrace{\\frac{\\mathbb{E}[R_i] - r_f}{\\sigma_i}}_{SR_i} \\sigma_p
$$

Le **Ratio de Sharpe ($SR_i$)** n'est autre que la **pente de cette droite** : il mesure la prime de risque obtenue par unité de volatilité totale assumée. Maximiser le ratio de Sharpe revient à maximiser l'utilité espérée d'un investisseur averse au risque sous possibilité d'effet de levier au taux $r_f$.

**Arbitrage chiffré Sharpe vs rendement brut** ($r_f = 2\\%$) :
- **Actif A** : $\\mathbb{E}[R_A] = 12\\%$, $\\sigma_A = 25\\%$ $\\implies SR_A = \\frac{12\\% - 2\\%}{25\\%} = \\mathbf{0.40}$.
- **Actif B** : $\\mathbb{E}[R_B] = 8\\%$, $\\sigma_B = 10\\%$ $\\implies SR_B = \\frac{8\\% - 2\\%}{10\\%} = \\mathbf{0.60}$.

Bien que l'actif A affiche un rendement brut supérieur de $+400$ pdb, l'actif B est **$50\\%$ plus efficient** par unité de risque prise ($0.60 > 0.40$).

**Intégration d'une contrainte ESG (*Best-in-Class*) :**
L'investissement responsable (règlement européen SFDR Articles 8 et 9) ajoute au problème de sélection une borne extra-financière $\\text{ESG}_i \\ge \\bar{S}$ (ici $\\bar{S} = 80/100$), qui restreint l'univers admissible afin d'atténuer les risques climatiques de transition, réglementaires et réputationnels.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Les assureurs vie et fonds de pension appliquent ce double filtrage (*screening* financier $SR \\ge SR_{\\min}$ et extra-financier $\\text{ESG} \\ge 80$) pour constituer leurs univers investissables tout en quantifiant le coût éventuel de restriction de la frontière efficiente.

#### 💻 Masterclass SQL Quantitative

L'univers cible se construit par **sélection conjonctive** dans la clause \`WHERE\` :
- \`score_esg >= 80 AND ratio_sharpe >= 0.30\` exige la satisfaction simultanée des deux critères (intersection logique $A \\cap B$).
- \`ORDER BY ratio_sharpe DESC\` s'exécute **en dernier** sur le sous-ensemble filtré afin de hiérarchiser les actifs retenus du plus efficient au moins efficient.

\`\`\`sql
SELECT
    ticker,
    nom,
    rendement_espere,
    volatilite,
    ratio_sharpe,
    score_esg
FROM portefeuilles_actifs
WHERE score_esg >= 80        -- Filtre extra-financier (Best-in-Class)
  AND ratio_sharpe >= 0.30   -- Filtre d'efficience risque-rendement
ORDER BY ratio_sharpe DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Audit complet des 5 actifs de \`portefeuilles_actifs\` montrant ceux qui passent ou échouent au double filtre \`score_esg >= 80 AND ratio_sharpe >= 0.30\` :

\`\`\`sql
SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg,
       CASE WHEN score_esg >= 80 AND ratio_sharpe >= 0.30 THEN 'ELIGIBLE' ELSE 'EXCLU' END AS filtre_isr
FROM portefeuilles_actifs
ORDER BY ratio_sharpe DESC;
\`\`\`

\`\`\`text
ticker | nom                   | rendement_espere | volatilite | ratio_sharpe | score_esg | filtre_isr
-------+-----------------------+------------------+------------+--------------+-----------+-----------
MC     | LVMH Moët Hennessy    | 0.115            | 0.21       | 0.4          | 86        | ELIGIBLE
CW8    | Amundi MSCI World ETF | 0.082            | 0.15       | 0.35         | 80        | ELIGIBLE
AI     | Air Liquide SA        | 0.078            | 0.16       | 0.3          | 92        | ELIGIBLE
TTE    | TotalEnergies SE      | 0.085            | 0.22       | 0.25         | 78        | EXCLU
BNP    | BNP Paribas SA        | 0.092            | 0.26       | 0.24         | 74        | EXCLU
\`\`\`

Seuls \`MC\` ($SR=0.40, \\text{ESG}=86$), \`CW8\` ($SR=0.35, \\text{ESG}=80$) et \`AI\` ($SR=0.30, \\text{ESG}=92$) satisfont les deux seuils simultanément.
      `,
      taskMarkdown:
        "À partir de `portefeuilles_actifs`, sélectionnez `ticker`, `nom`, `rendement_espere`, `volatilite`, `ratio_sharpe`, et `score_esg`. Filtrez les actifs ayant `score_esg >= 80` et `ratio_sharpe >= 0.30`. Triez par `ratio_sharpe` décroissant.",
      initialCode: "-- Filtrez les actifs selon les critères Sharpe et ESG :\n",
      solutionCode:
        "SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg FROM portefeuilles_actifs WHERE score_esg >= 80 AND ratio_sharpe >= 0.30 ORDER BY ratio_sharpe DESC;",
      validationQuery:
        "SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg FROM portefeuilles_actifs WHERE score_esg >= 80 AND ratio_sharpe >= 0.30 ORDER BY ratio_sharpe DESC;",
      hints: [
        "WHERE score_esg >= 80 AND ratio_sharpe >= 0.30",
        "ORDER BY ratio_sharpe DESC",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-11",
      title: "11. Valeur Quotidienne d'un Portefeuille Pondéré (60/40)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description:
        "Calculez la valeur historique d'un portefeuille allouant 60% à LVMH (MC) et 40% à TotalEnergies (TTE).",
      theoryMarkdown: `
### Valorisation Multi-Actifs et Pivotement par Auto-Jointure

#### 🎓 Cours Théorique Approfondi

Soit un panier composé de $K$ actifs cotés aux prix $P_{i,t}$. En gestion de portefeuille, on distingue rigoureusement deux conventions de valorisation :

1. **Portefeuille à quantités fixes (*Buy & Hold* ou panier indiciel linéaire)** : on détient $q_i$ unités de chaque actif (ici $q_{\\text{MC}} = 0.60$ et $q_{\\text{TTE}} = 0.40$), d'où la valeur liquidative :

$$
V_t = \\sum_{i=1}^{K} q_i P_{i,t} = 0.60 \\, P_{\\text{MC}, t} + 0.40 \\, P_{\\text{TTE}, t}
$$

2. **Portefeuille à poids de richesse initiaux $w_i$ normalisé en base 100** : si l'on souhaite investir $60\\%$ du capital en \`MC\` ($60\\text{ EUR}$) et $40\\%$ en \`TTE\` ($40\\text{ EUR}$) à la date $t = 0$, les quantités initiales sont $q_i = \\frac{100 \\cdot w_i}{P_{i,0}}$ et la valeur évolue selon :

$$
V_t^{\\text{base 100}} = 100 \\left( w_1 \\frac{P_{1,t}}{P_{1,0}} + w_2 \\frac{P_{2,t}}{P_{2,0}} \\right)
$$

Dans le cas présent, comme \`MC\` cote autour de $740\\text{ EUR}$ et \`TTE\` autour de $62\\text{ EUR}$, une combinaison linéaire directe $0.60 \\, P_{\\text{MC},t} + 0.40 \\, P_{\\text{TTE},t}$ mesure la valeur exacte d'un contrat synthétique (*basket*) contenant $0.60$ action LVMH et $0.40$ action TotalEnergies.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Les produits structurés sur panier d'actions (*Worst-Of / Basket Calls*) et les mandats diversifiés 60/40 calculent quotidiennement la valeur liquidative agrégée (VL) en alignant les séries de prix sur le calendrier des jours de bourse communs afin de suivre les marges et les frais de gestion.

#### 💻 Masterclass SQL Quantitative

La table \`marche_actions\` est structurée en **format long (*tall/narrow*)** : chaque ligne contient \`(date, ticker, prix_cloture)\`, si bien que les prix de \`MC\` et \`TTE\` à une même date résident sur **deux lignes distinctes** !

Pour réaliser une opération arithmétique horizontale \`0.60 * prix_MC + 0.40 * prix_TTE\`, on effectue un **pivotement relationnel par auto-jointure (*Self-Join*)** :
- On alias \`marche_actions\` deux fois : \`m\` (pour LVMH) et \`t\` (pour TotalEnergies).
- La condition de jointure \`ON m.date = t.date\` aligne exactement les séances communes.
- Les filtres \`WHERE m.ticker = 'MC' AND t.ticker = 'TTE'\` réduisent la cardinalité à **$1:1$ par date** (sans ce filtre par ticker, \`m.date = t.date\` produirait un produit cartésien de $5 \\times 5 = 25$ combinaisons par date !).

\`\`\`sql
SELECT
    m.date,
    m.prix_cloture AS prix_mc,
    t.prix_cloture AS prix_tte,
    (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille
FROM marche_actions m
JOIN marche_actions t
  ON m.date = t.date          -- Alignement temporel exact sur les dates communes
WHERE m.ticker = 'MC'         -- Jambe 1 : LVMH (pondération 0.60)
  AND t.ticker = 'TTE'        -- Jambe 2 : TotalEnergies (pondération 0.40)
ORDER BY m.date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle de l'auto-jointure sur \`marche_actions\` pour les 5 dates communes de janvier 2024 :

\`\`\`sql
SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte,
       ROUND(0.60 * m.prix_cloture + 0.40 * t.prix_cloture, 2) AS valeur_portefeuille
FROM marche_actions m
JOIN marche_actions t ON m.date = t.date
WHERE m.ticker = 'MC' AND t.ticker = 'TTE'
ORDER BY m.date;
\`\`\`

\`\`\`text
date       | prix_mc | prix_tte | valeur_portefeuille
-----------+---------+----------+--------------------
2024-01-02 | 738     | 61.8     | 467.52
2024-01-03 | 735     | 62.4     | 465.96
2024-01-04 | 744     | 62       | 471.2
2024-01-05 | 752     | 63       | 476.4
2024-01-08 | 748     | 62.6     | 473.84
\`\`\`

Vérification au \`2024-01-02\` : $0.60 \\times 738.0 + 0.40 \\times 61.8 = 442.80 + 24.72 = 467.52\\text{ EUR}$. Le \`2024-01-03\`, la hausse de \`TTE\` ($+0.60\\text{ EUR}$) amortit partiellement la baisse de \`MC\` ($-3.0\\text{ EUR}$), limitant le recul du panier à $-1.56\\text{ EUR}$.
      `,
      taskMarkdown:
        "Pour les dates communes entre `'MC'` et `'TTE'`, joignez la table `marche_actions` à elle-même (`m` et `t` sur `m.date = t.date`) et calculez `valeur_portefeuille` définie par `(0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille`. Sélectionnez `m.date`, `m.prix_cloture AS prix_mc`, `t.prix_cloture AS prix_tte` et `valeur_portefeuille`. Triez par `m.date`.",
      initialCode: "-- Calculez la valeur quotidienne du panier 60/40 :\n",
      solutionCode:
        "SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte, (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille FROM marche_actions m JOIN marche_actions t ON m.date = t.date WHERE m.ticker = 'MC' AND t.ticker = 'TTE' ORDER BY m.date;",
      validationQuery:
        "SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte, (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille FROM marche_actions m JOIN marche_actions t ON m.date = t.date WHERE m.ticker = 'MC' AND t.ticker = 'TTE' ORDER BY m.date;",
      hints: [
        "Faites un JOIN de marche_actions avec elle-même sur m.date = t.date",
        "Filtrez WHERE m.ticker = 'MC' AND t.ticker = 'TTE'.",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-12",
      title: "12. Covariance Empirique en SQL (Somme des Co-Produits)",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 10,
      description:
        "Calculez la covariance empirique exacte entre les rendements de BNP et TTE en SQL.",
      theoryMarkdown: `
### Formule de Koenig-Huygens et Correction de Bessel ($1/T$ vs $1/(T-1)$)

#### 🎓 Cours Théorique Approfondi

En économétrie et optimisation de portefeuille de Markowitz, la **covariance** entre deux séries de rendements $X_t$ et $Y_t$ observées sur $T$ dates communes mesure leur co-mouvement linéaire :

$$
\\widehat{\\operatorname{Cov}}_{\\text{pop}}(X, Y) = \\frac{1}{T} \\sum_{t=1}^{T} (X_t - \\bar{X})(Y_t - \\bar{Y})
$$

**Dérivation de l'identité de Koenig-Huygens en une passe :**
En développant le produit centré et en utilisant la linéarité de la somme avec $\\frac{1}{T}\\sum X_t = \\bar{X}$ et $\\frac{1}{T}\\sum Y_t = \\bar{Y}$ :

$$
\\begin{aligned}
\\frac{1}{T}\\sum_{t=1}^{T} (X_t - \\bar{X})(Y_t - \\bar{Y}) &= \\frac{1}{T}\\sum_{t=1}^{T} \\left( X_t Y_t - X_t\\bar{Y} - \\bar{X}Y_t + \\bar{X}\\bar{Y} \\right) \\\\
&= \\frac{1}{T}\\sum_{t=1}^{T} X_t Y_t - \\bar{X}\\bar{Y} - \\bar{X}\\bar{Y} + \\bar{X}\\bar{Y} \\\\
&= \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y]
\\end{aligned}
$$

**Écart crucial entre estimateur biaisé $1/T$ et estimateur sans biais de Bessel $1/(T-1)$ :**
Comme $\\bar{X}$ et $\\bar{Y}$ sont estimés sur le même échantillon de taille $T$ (consommant 1 degré de liberté), l'espérance de l'estimateur en $1/T$ sous-estime la vraie covariance :

$$
\\mathbb{E}\\left[\\frac{1}{T}\\sum_{t=1}^T (X_t - \\bar{X})(Y_t - \\bar{Y})\\right] = \\frac{T-1}{T}\\operatorname{Cov}(X, Y)
$$

Pour obtenir l'estimateur **sans biais de Bessel** (diviseur $T-1$, utilisé par \`np.cov(X, Y)\` en Python ou \`COVAR_SAMP\` en PostgreSQL), on multiplie la formule de Koenig-Huygens par $\\frac{T}{T-1}$ :

$$
\\widehat{\\operatorname{Cov}}_{\\text{Bessel}}(X, Y) = \\frac{1}{T-1}\\sum_{t=1}^T (X_t - \\bar{X})(Y_t - \\bar{Y}) = \\frac{T}{T-1}\\left(\\overline{XY} - \\bar{X}\\bar{Y}\\right)
$$

Sur un grand historique ($T = 2520$ jours), l'écart $\\frac{2520}{2519}$ est inférieur à $0.04\\%$. Mais sur un petit échantillon ($T = 5$ séances ici), le facteur $\\frac{5}{4} = 1.25$ engendre un **écart de $+25\\%$** !

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Pré-calculer $\\overline{XY} - \\bar{X}\\bar{Y}$ directement dans le Data Warehouse (Snowflake, BigQuery, SQLite) évite de transférer des millions de lignes vers Python pour construire les matrices de covariance $\\Sigma$ et les bêtas $\\beta_i = \\frac{\\operatorname{Cov}(R_i, R_M)}{\\operatorname{Var}(R_M)}$.

#### 💻 Masterclass SQL Quantitative

Grâce à Koenig-Huygens, SQL calcule la covariance **en un seul balayage (*single-pass*)** via \`AVG()\` sans nécessiter de sous-requête préalable pour centrer les variables :
- \`AVG(b.rendement_journalier * t.rendement_journalier)\` calcule $\\overline{XY}$.
- \`AVG(b.rendement_journalier) * AVG(t.rendement_journalier)\` calcule $\\bar{X}\\bar{Y}$.
- \`COUNT(*)\` fournit $T$ pour appliquer si souhaité le facteur de Bessel \`* COUNT(*) / (COUNT(*) - 1.0)\`.
- **Note de stabilité numérique** : pour des rendements centrés autour de $0$, les produits sont petits ($\\sim 10^{-5}$) et la précision IEEE-754 double (64 bits) reste excellente ; pour des prix très élevés avec faible variance, on privilégie un centrage préalable pour éviter l'annulation catastrophique.

\`\`\`sql
SELECT
    -- Estimateur Koenig-Huygens (diviseur 1/T)
    (AVG(b.rendement_journalier * t.rendement_journalier)
     - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee
FROM marche_actions b
JOIN marche_actions t
  ON b.date = t.date
WHERE b.ticker = 'BNP'
  AND t.ticker = 'TTE';
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les $T = 5$ dates communes de \`BNP\` et \`TTE\`, comparant directement la covariance \`1/T\` (attendue dans l'exercice) et la covariance sans biais de Bessel \`1/(T-1)\` :

\`\`\`sql
WITH s AS (
  SELECT COUNT(*) AS T,
         AVG(b.rendement_journalier) AS mx,
         AVG(t.rendement_journalier) AS my,
         AVG(b.rendement_journalier * t.rendement_journalier) AS mxy
  FROM marche_actions b
  JOIN marche_actions t ON b.date = t.date
  WHERE b.ticker = 'BNP' AND t.ticker = 'TTE'
)
SELECT T,
       ROUND(mxy - mx * my, 10) AS cov_pop_1_T,
       ROUND((mxy - mx * my) * T / (T - 1.0), 10) AS cov_bessel_T_1
FROM s;
\`\`\`

\`\`\`text
T | cov_pop_1_T | cov_bessel_T_1
--+-------------+---------------
5 | 0.000012062 | 0.0000150775
\`\`\`

On vérifie numériquement l'écart exact de $25\\%$ sur $T=5$ : $0.000012062 \\times \\frac{5}{4} = 0.0000150775$, et en divisant par le produit des écarts-types on retrouve une corrélation empirique de $\\hat{\\rho}_{\\text{BNP,TTE}} \\approx 0.1463$.
      `,
      taskMarkdown:
        "À partir des rendements journaliers de `'BNP'` (`b`) et `'TTE'` (`t`) appariés par `date` (`b.date = t.date`), calculez la covariance empirique (formule de Koenig-Huygens au facteur $1/T$) : `AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier) AS cov_estimee`.",
      initialCode: "-- Calculez la covariance empirique en SQL :\n",
      solutionCode:
        "SELECT (AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee FROM marche_actions b JOIN marche_actions t ON b.date = t.date WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';",
      validationQuery:
        "SELECT (AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee FROM marche_actions b JOIN marche_actions t ON b.date = t.date WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';",
      hints: [
        "Utilisez AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier) AS cov_estimee",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-13",
      title: "13. Optimisation de Requêtes : EXPLAIN QUERY PLAN",
      category: "data_engineering",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 6,
      description:
        "Inspectez le plan d'exécution du moteur SQL pour analyser comment les index sont exploités.",
      theoryMarkdown: `
### Complexité Algorithmique des SGBD : B-Tree $\\mathcal{O}(\\log N)$ vs Full Scan $\\mathcal{O}(N)$

#### 🎓 Cours Théorique Approfondi

En infrastructure de données *tick-by-tick* ou carnets d'ordres (*LOB*), une table financière dépasse facilement $N = 10^8$ lignes. La latence d'une requête dépend alors radicalement de la stratégie physique choisie par l'optimiseur de requêtes (*Query Planner*) :

1. **Full Table Scan — $\\mathcal{O}(N)$** :
   Lorsqu'aucun index utilisable ne couvre la clause \`WHERE\`, le moteur doit lire séquentiellement toutes les pages de la table du début à la fin. Sur $N = 10^8$ lignes, cela implique des millions de comparaisons et des gigaoctets d'entrées/sorties (I/O).

2. **Index B-Tree / B+Tree — $\\mathcal{O}(\\log_B N)$** :
   Un index relationnel est un **arbre équilibré B-Tree** dont chaque nœud interne (une page mémoire de $4$ Ko) stocke un facteur de branchement élevé $B \\in [100, 500]$ de clés triées et de pointeurs vers les pages filles. Sa hauteur maximale satisfait :

$$
h \\le \\left\\lceil \\log_{B/2}(N) \\right\\rceil
$$

Pour $N = 10^8$ lignes et $B = 200$, $\\log_{100}(10^8) = 4$ : **4 sauts de pointeurs suffisent** pour localiser n'importe quelle cotation, contre $100\\,000\\,000$ lectures en Full Scan !

3. **Accès par Clé Primaire (\`INTEGER PRIMARY KEY\`) vs Index Secondaire vs Covering Index** :
   - En SQLite, la table elle-même est organisée physiquement en un B+Tree trié par \`rowid\` (alias de \`INTEGER PRIMARY KEY\`). Rechercher \`WHERE id = 5\` effectue une **descente directe unique** dans le B-Tree principal.
   - Un index secondaire (ex: \`CREATE INDEX idx_marche_ticker_date ON marche_actions(ticker, date)\`) stocke \`(ticker, date, rowid)\` triés lexicographiquement : il permet une recherche $\\mathcal{O}(\\log N)$ sur \`ticker\` seul ou \`(ticker, date)\` (règle du **préfixe gauche**), suivie d'un saut par \`rowid\` vers la table si d'autres colonnes comme \`prix_cloture\` sont demandées.
   - Si toutes les colonnes du \`SELECT\` figurent déjà dans l'index, SQLite annonce \`USING COVERING INDEX\` et évite tout accès à la table principale.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> En backtesting haute fréquence ou ré-évaluation réglementaire de portefeuilles de plusieurs millions de polices, auditer les plans d'exécution avec \`EXPLAIN QUERY PLAN\` avant la mise en production élimine les goulots d'étranglement $\\mathcal{O}(N)$ et prévient l'effondrement des temps de calcul batch.

#### 💻 Masterclass SQL Quantitative

L'instruction diagnostique \`EXPLAIN QUERY PLAN <requête>\` ne retourne pas les données métier, mais la trace structurée \`(id, parent, notused, detail)\` de l'optimiseur SQLite :
- \`SCAN table\` : balayage linéaire complet $\\mathcal{O}(N)$ (alerte de performance sur grande table).
- \`SEARCH table USING INTEGER PRIMARY KEY (rowid=?)\` : recherche logarithmique directe par clé primaire.
- \`SEARCH table USING INDEX nom_index (...)\` : recherche logarithmique exploitant un index B-Tree existant.
- **Piège d'indexation** : appliquer une fonction sur une colonne indexée (ex: \`WHERE SUBSTR(date, 1, 4) = '2024'\`) invalide généralement l'index B-Tree et force un \`SCAN\`; préférez toujours les bornes explicites \`WHERE date >= '2024-01-01' AND date < '2025-01-01'\`.

\`\`\`sql
-- Inspection du plan d'exécution sur la clé primaire id
EXPLAIN QUERY PLAN
SELECT *
FROM marche_actions
WHERE id = 5;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Comparaison réelle des 3 plans d'exécution sur la table \`marche_actions\` (qui possède la PK \`id\` et l'index composite \`idx_marche_ticker_date(ticker, date)\`, mais aucun index sur \`volume\`) :

\`\`\`sql
-- Cas 1 : Recherche par Primary Key (B-Tree clustered)
EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;
\`\`\`

\`\`\`text
id | parent | notused | detail
---+--------+---------+----------------------------------------------------------
2  | 0      | 33      | SEARCH marche_actions USING INTEGER PRIMARY KEY (rowid=?)
\`\`\`

\`\`\`sql
-- Cas 2 : Recherche par préfixe de l'index composite (ticker, date)
EXPLAIN QUERY PLAN SELECT date, prix_cloture FROM marche_actions WHERE ticker = 'TTE' AND date >= '2024-01-04';
\`\`\`

\`\`\`text
id | parent | notused | detail
---+--------+---------+-------------------------------------------------------------------------------
3  | 0      | 51      | SEARCH marche_actions USING INDEX idx_marche_ticker_date (ticker=? AND date>?)
\`\`\`

\`\`\`sql
-- Cas 3 : Filtre sur colonne non indexée -> Full Table Scan O(N)
EXPLAIN QUERY PLAN SELECT date, ticker, volume FROM marche_actions WHERE volume > 2000000;
\`\`\`

\`\`\`text
id | parent | notused | detail
---+--------+---------+--------------------
2  | 0      | 216     | SCAN marche_actions
\`\`\`

Le moteur passe de \`SEARCH ... USING INTEGER PRIMARY KEY\` / \`USING INDEX\` ($\\mathcal{O}(\\log N)$) à \`SCAN marche_actions\` ($\\mathcal{O}(N)$) dès que le prédicat porte sur \`volume\` non indexé.
      `,
      taskMarkdown:
        "Préfixez la requête de sélection `SELECT * FROM marche_actions WHERE id = 5;` par `EXPLAIN QUERY PLAN` pour inspecter la stratégie d'accès indexée retenue par SQLite.",
      initialCode: "-- Affichez le plan d'exécution :\n",
      solutionCode: "EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
      validationQuery:
        "EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
      hints: [
        "Écrivez simplement : EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-14",
      title: "14. Backtesting d'une Stratégie de Tendance en Pur SQL",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 10,
      description:
        "Simulez le gain d'une règle systématique : acheter si le rendement d'hier était positif, vendre sinon.",
      theoryMarkdown: `
### Backtest Causal, Mesurabilité $\\mathcal{F}_{t-1}$ et Look-Ahead Bias

#### 🎓 Cours Théorique Approfondi

En théorie des processus stochastiques appliquée à la finance, on modélise le flux d'information publique au cours du temps par une **filtration naturelle** $(\\mathcal{F}_t)_{t \\ge 0}$, où $\\mathcal{F}_t = \\sigma(P_0, P_1, \\dots, P_t, V_0, \\dots, V_t)$ représente toute l'information connue à la clôture du jour $t$.

Pour qu'une stratégie de trading systématique soit **physiquement exécutable sans don de voyance**, la position $\\theta_t$ investie durant la séance $[t-1, t]$ (pour capter le rendement $r_t$) doit impérativement être **prévisible**, c'est-à-dire **$\\mathcal{F}_{t-1}$-mesurable** :

$$
\\theta_t = \\phi(\\mathcal{F}_{t-1}), \\qquad \\text{PnL}_t = \\theta_t \\cdot r_t = \\operatorname{sgn}(r_{t-1}) \\cdot r_t
$$

où $\\operatorname{sgn}(r_{t-1}) \\in \\{-1, +1\\}$ est le signal observé à la clôture de la veille $t-1$.

**Anatomie mathématique du Look-Ahead Bias (biais d'anticipation) :**
Si un analyste oublie de décaler le signal d'un jour et multiplie le signal du jour $t$ par le rendement du même jour $t$, il simule en réalité :

$$
\\text{PnL}_t^{\\text{biaisé}} = \\operatorname{sgn}(r_t) \\cdot r_t = |r_t| \\ge 0
$$

Une telle erreur transforme mécaniquement **n'importe quelle marche aléatoire symétrique** en une courbe de profit toujours positive à ratio de Sharpe irréaliste, car elle parie systématiquement du bon côté de la clôture du jour ! Sur un backtest causal valide, l'espérance conditionnelle vaut au contraire $\\mathbb{E}[\\text{PnL}_t \\mid \\mathcal{F}_{t-1}] = \\operatorname{sgn}(r_{t-1}) \\mathbb{E}[r_t \\mid \\mathcal{F}_{t-1}]$.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> En validation des modèles (directive SR 11-7 / contrôle interne des desks quantitatifs), l'audit systématique de la mesurabilité $\\mathcal{F}_{t-1}$ des signaux (\`LAG(..., 1)\`, prix d'exécution décalés, dates de publication comptable) est le premier test bloquant avant tout déploiement de capital réel.

#### 💻 Masterclass SQL Quantitative

En SQL, l'imposition rigoureuse de la mesurabilité $\\mathcal{F}_{t-1}$ s'écrit en combinant une fonction conditionnelle \`CASE WHEN\` et la fonction de décalage temporel \`LAG(..., 1)\` :
- \`CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END\` calcule le signal à la clôture de la ligne considérée.
- Envelopper cette expression dans \`LAG(..., 1) OVER (ORDER BY date)\` décale la décision d'un rang vers le passé, garantissant que le rendement \`rendement_journalier\` du jour $t$ est multiplié uniquement par la position décidée à la clôture du jour $t-1$.
- À la toute première date ($t = 1$), \`position_hier\` vaut \`NULL\`, traduisant fidèlement qu'aucune position n'était ouverte avant l'historique disponible.

\`\`\`sql
SELECT
    date,
    rendement_journalier,
    -- Signal décidé à la clôture d'hier (F_{t-1}-mesurable)
    LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1)
        OVER (ORDER BY date ASC) AS position_hier,
    -- PnL réalisé aujourd'hui = position_hier * rendement_aujourd'hui
    (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1)
        OVER (ORDER BY date ASC) * rendement_journalier) AS pnl_journalier
FROM marche_actions
WHERE ticker = 'CW8'
ORDER BY date ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

1) Exécution réelle du backtest causal sur \`'CW8'\` :

\`\`\`sql
SELECT date, rendement_journalier,
       LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier,
       ROUND(LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier, 4) AS pnl_journalier
FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;
\`\`\`

\`\`\`text
date       | rendement_journalier | position_hier | pnl_journalier
-----------+----------------------+---------------+---------------
2024-01-02 | 0.0056               | NULL          | NULL
2024-01-03 | 0.0013               | 1             | 0.0013
2024-01-04 | 0.0051               | 1             | 0.0051
2024-01-05 | 0.0053               | 1             | 0.0053
2024-01-08 | 0.0009               | 1             | 0.0009
\`\`\`

2) Démonstration chiffrée de la catastrophe du **Look-Ahead Bias** sur \`'TTE'\` (dont les rendements alternent entre positif et négatif : $+0.98\\%, +0.97\\%, -0.64\\%, +1.61\\%, -0.63\\%$) :

\`\`\`sql
WITH s AS (
  SELECT rendement_journalier AS r,
         CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END AS pos_t,
         LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS pos_hier
  FROM marche_actions WHERE ticker = 'TTE'
)
SELECT ROUND(SUM(COALESCE(pos_hier * r, 0)), 4) AS pnl_causal,
       ROUND(SUM(pos_t * r), 4) AS pnl_look_ahead
FROM s;
\`\`\`

\`\`\`text
pnl_causal | pnl_look_ahead
-----------+---------------
-0.0191    | 0.0483
\`\`\`

Le backtest causal sans biais perd **$-1.91\\%$** (la stratégie de momentum est à contretemps à chaque retournement), tandis qu'un code oubliant \`LAG(..., 1)\` affiche faussement un gain miraculeux de **$+4.83\\%$** !
      `,
      taskMarkdown:
        "Pour le ticker `'CW8'`, sélectionnez `date`, `rendement_journalier`, la position retardée d'un jour `LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier`, et le PnL journalier `(LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier`. Triez par `date`.",
      initialCode:
        "-- Calculez le PnL de la stratégie de momentum retardée d'un jour :\n",
      solutionCode:
        "SELECT date, rendement_journalier, LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier, (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;",
      validationQuery:
        "SELECT date, rendement_journalier, LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier, (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;",
      hints: [
        "Utilisez LAG(CASE WHEN ... THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) pour la position d'hier.",
      ],
      datasets: [],
    },
    {
      id: "v2-sql-15",
      title: "15. Consolidation Multi-Devises & Agrégats Hiérarchiques",
      category: "data_engineering",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 6,
      description:
        "Produisez un reporting consolidé par secteur d'activité de l'exposition globale et du bêta moyen pondéré.",
      theoryMarkdown: `
### Consolidation Sectorielle et Linéarité des Mesures Factorielles

#### 🎓 Cours Théorique Approfondi

En algèbre relationnelle, la consolidation d'un portefeuille selon un axe analytique $G$ (secteur, classe d'actifs, devise, zone géographique) correspond à l'opérateur de regroupement et d'agrégation :

$$
\\gamma_{G, \\; \\text{COUNT}(*), \\; \\text{AVG}(\\mu), \\; \\text{AVG}(\\beta)}(\\text{portefeuilles\\_actifs})
$$

**Linéarité du bêta de marché et du rendement espéré dans le CAPM :**
Soit un portefeuille (ou une poche sectorielle $s$) regroupant $K_s$ titres de poids $w_i$ ($\\sum_{i \\in s} w_i = 1$). Par linéarité de l'espérance et de la covariance :

$$
\\mathbb{E}[R_s] = \\sum_{i \\in s} w_i \\mathbb{E}[R_i], \\qquad \\beta_s = \\frac{\\operatorname{Cov}\\left(\\sum_{i \\in s} w_i R_i, R_M\\right)}{\\operatorname{Var}(R_M)} = \\sum_{i \\in s} w_i \\beta_i
$$

**Attention à la différence entre moyenne équipondérée et pondérée par encours :**
- L'agrégat SQL \`AVG(beta_marche)\` applique implicitement des poids **équipondérés** $w_i = \\frac{1}{K_s}$, mesurant le bêta moyen des lignes détenues dans la poche.
- Lorsque les positions ont des encours ou des budgets de risque hétérogènes $V_i$, le véritable bêta pondéré de la poche s'écrit en SQL :

$$
\\beta_s^{\\text{pondéré}} = \\frac{\\sum_{i \\in s} V_i \\beta_i}{\\sum_{i \\in s} V_i}
$$

(tandis que la **volatilité** $\\sigma_s$ n'est *jamais* additive et ne peut pas s'obtenir par \`AVG(volatilite)\`, à cause des corrélations $\\rho_{ij} < 1$ !).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous Solvabilité II (*Look-Through Approach* par transparence des OPCVM et reporting QRT S.06.02), les directions des risques consolident quotidiennement le nombre de lignes, le rendement espéré et la sensibilité bêta par secteur pour contrôler les limites d'exposition et calculer les budgets de SCR Actions.

#### 💻 Masterclass SQL Quantitative

L'agrégation hiérarchique \`GROUP BY\` obéit à des règles strictes de cohérence relationnelle :
1. **Règle d'or de projection** : toute colonne figurant dans le \`SELECT\` hors fonction d'agrégation (\`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`) doit apparaître dans la clause \`GROUP BY\`.
2. **\`WHERE\` vs \`HAVING\`** : \`WHERE\` filtre les actifs individuels *avant* regroupement ; \`HAVING\` filtre les secteurs consolidés *après* agrégation (ex: \`HAVING AVG(beta_marche) > 1.0\`).
3. **Moyenne pondérée généralisée en SQL** : SQLite ne possède pas de fonction \`WEIGHTED_AVG(x, w)\`, on l'exprime exactement par \`SUM(w * x) / SUM(w)\`.

\`\`\`sql
SELECT
    secteur,
    COUNT(*) AS nb_actifs,
    AVG(rendement_espere) AS rendement_moyen,
    AVG(beta_marche) AS beta_moyen
FROM portefeuilles_actifs
GROUP BY secteur          -- Partitionne en un groupe par secteur économique
ORDER BY secteur ASC;     -- Tri alphabétique final du reporting
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

1) Reporting exact par \`secteur\` sur \`portefeuilles_actifs\` :

\`\`\`sql
SELECT secteur, COUNT(*) AS nb_actifs,
       ROUND(AVG(rendement_espere), 4) AS rendement_moyen,
       ROUND(AVG(beta_marche), 4) AS beta_moyen
FROM portefeuilles_actifs
GROUP BY secteur ORDER BY secteur;
\`\`\`

\`\`\`text
secteur    | nb_actifs | rendement_moyen | beta_moyen
-----------+-----------+-----------------+-----------
Diversifié | 1         | 0.082           | 1
Finance    | 1         | 0.092           | 1.25
Industrie  | 1         | 0.078           | 0.75
Luxe       | 1         | 0.115           | 1.05
Énergie    | 1         | 0.085           | 0.95
\`\`\`

2) Agrégation multi-lignes par \`classe_actif\` comparant la moyenne équipondérée et la moyenne pondérée par l'inverse de la volatilité ($w_i \\propto 1/\\sigma_i$, principe de *Risk Parity* naïf) :

\`\`\`sql
SELECT classe_actif, COUNT(*) AS nb_actifs,
       ROUND(AVG(rendement_espere), 4) AS rendement_moyen,
       ROUND(AVG(beta_marche), 4) AS beta_eq,
       ROUND(SUM(rendement_espere * (1.0 / volatilite)) / SUM(1.0 / volatilite), 4) AS rdt_pond_inv_vol
FROM portefeuilles_actifs
GROUP BY classe_actif ORDER BY classe_actif;
\`\`\`

\`\`\`text
classe_actif | nb_actifs | rendement_moyen | beta_eq | rdt_pond_inv_vol
-------------+-----------+-----------------+---------+-----------------
Action       | 4         | 0.0925          | 1       | 0.0915
ETF          | 1         | 0.082           | 1       | 0.082
\`\`\`

Sur la poche \`Action\` ($4$ titres), le bêta équipondéré vaut exactement $1.00$, tandis que la pondération en inverse de volatilité réduit le rendement attendu de $9.25\\%$ à $9.15\\%$ en accordant davantage de poids à \`AI\` ($\\sigma=16\\%$) qu'à \`BNP\` ($\\sigma=26\\%$).
      `,
      taskMarkdown:
        "À partir de `portefeuilles_actifs`, regroupez par `secteur` (`GROUP BY secteur`) et calculez le nombre d'actifs `COUNT(*) AS nb_actifs`, le rendement espéré moyen `AVG(rendement_espere) AS rendement_moyen`, et le bêta moyen `AVG(beta_marche) AS beta_moyen`. Triez par `secteur` alphabétique.",
      initialCode: "-- Générez le rapport consolidé par secteur :\n",
      solutionCode:
        "SELECT secteur, COUNT(*) AS nb_actifs, AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen FROM portefeuilles_actifs GROUP BY secteur ORDER BY secteur;",
      validationQuery:
        "SELECT secteur, COUNT(*) AS nb_actifs, AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen FROM portefeuilles_actifs GROUP BY secteur ORDER BY secteur;",
      hints: [
        "GROUP BY secteur ORDER BY secteur",
        "AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen",
      ],
      datasets: [],
    },
  ],
};
