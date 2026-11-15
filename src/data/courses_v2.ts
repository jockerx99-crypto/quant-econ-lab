import { CourseModule } from "@/types/course";

export const COURSE_MODULES_V2: CourseModule[] = [
  {
    id: "sql-quant",
    title: "SQL Avancé & Data Engineering Financier",
    subtitle: "Du Calcul des Rendements aux Window Functions & Arbres Stochastiques",
    icon: "Database",
    description: "Maîtrisez les techniques avancées de manipulation et modélisation de séries financières en SQL : log-rendements, volatilité glissante, maximum drawdown, ASOF joins et CTEs récursives.",
    exercises: [
      {
        id: "v2-sql-1",
        title: "1. Log-Rendements Journaliers (LAG & LN)",
        category: "data_engineering",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 6,
        description: "Calculez le rendement logarithmique journalier de l'action TotalEnergies (TTE).",
        theoryMarkdown: `
### Log-Rendements et Additivité Temporelle en Finance

> 💡 **Rappel théorique : Rendement Logarithmique vs Discret**
> 
> En finance quantitative, pour un cours de clôture $P_t$, on distingue deux mesures de rendement :
> 1. **Rendement arithmétique (discret)** :
>    $$R_t = \\frac{P_t - P_{t-1}}{P_{t-1}} = \\frac{P_t}{P_{t-1}} - 1$$
> 2. **Rendement logarithmique (continu)** :
>    $$r_t = \\ln\\left(\\frac{P_t}{P_{t-1}}\\right) = \\ln(P_t) - \\ln(P_{t-1})$$

> 📊 **Pourquoi les Quants et Économètres privilégient le Log-Rendement ?**
> - **Propriété d'additivité temporelle** : Le rendement composé sur $T$ périodes est la somme exacte des rendements journaliers :
>   $$\\sum_{t=1}^T r_t = \\ln(P_T) - \\ln(P_0) = r_{0 \\to T}$$
> - **Loi Normale** : Si $r_t \\sim \\mathcal{N}(\\mu, \\sigma^2)$, alors les prix suivent une loi log-normale $P_t > 0$, interdisant les cours négatifs.
> - **Invariance d'échelle** : Pour de petites variations, $r_t \\approx R_t$.

> 📌 **Syntaxe SQL de la fonction LAG() :**
> \`\`\`sql
> LAG(valeur, 1) OVER (PARTITION BY ticker ORDER BY date ASC)
> \`\`\`
> \`LAG(colonne, 1)\` permet d'accéder à la valeur de la ligne immédiatement précédente dans l'ordre chronologique.
        `,
        taskMarkdown: "Sélectionnez `date`, `prix_cloture` et calculez `rendement_log` défini comme `LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date))` depuis la table `marche_actions` pour le ticker `'TTE'`. Triez par `date` croissante.",
        initialCode: "-- Calculez le log-rendement journalier de TTE :\n",
        solutionCode: "SELECT date, prix_cloture, LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
        validationQuery: "SELECT date, prix_cloture, LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
        hints: ["Utilisez LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log", "N'oubliez pas le filtre WHERE ticker = 'TTE'."],
        datasets: []
      },
      {
        id: "v2-sql-2",
        title: "2. Volatilité Glissante sur Fenêtre Mobile (ROWS BETWEEN)",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Calculez la volatilité glissante des rendements sur une fenêtre de 3 séances pour BNP Paribas.",
        theoryMarkdown: `
### Volatilité Empirique et Cadre de Fenêtrage SQL

> 💡 **Rappel conceptuel : Volatilité et Racine Carrée du Temps**
> 
> La volatilité journalière $\\sigma_{\\text{jour}}$ mesure la dispersion des rendements autour de leur espérance :
> $$\\sigma = \\sqrt{\\frac{1}{N-1} \\sum_{t=1}^N (r_t - \\bar{r})^2}$$
> Pour annualiser une volatilité journalière, on applique la règle de la racine carrée du temps (issue du mouvement brownien où $\\operatorname{Var}(W_t) = t$) :
> $$\\sigma_{\\text{annuelle}} = \\sigma_{\\text{jour}} \\times \\sqrt{252}$$
> *(252 étant le nombre conventionnel de jours de cotation ouverts par an).*

> 📌 **Spécification de la Fenêtre Mobile SQL :**
> \`\`\`sql
> OVER (
>   ORDER BY date
>   ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
> )
> \`\`\`
> Cette clause inclut la ligne courante et les 2 lignes antérieures, soit une fenêtre glissante de 3 séances.
        `,
        taskMarkdown: "Pour le ticker `'BNP'`, sélectionnez `date`, `rendement_journalier` et calculez la moyenne glissante `moyenne_mobile_3j` des rendements sur la fenêtre mobile des 3 dernières séances (`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`). Triez par `date`.",
        initialCode: "-- Calculez la moyenne mobile des rendements sur 3 jours pour BNP :\n",
        solutionCode: "SELECT date, rendement_journalier, AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j FROM marche_actions WHERE ticker = 'BNP' ORDER BY date;",
        validationQuery: "SELECT date, rendement_journalier, AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j FROM marche_actions WHERE ticker = 'BNP' ORDER BY date;",
        hints: ["Utilisez AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)"],
        datasets: []
      },
      {
        id: "v2-sql-3",
        title: "3. Détection de Signal Golden Cross (Moyennes Mobiles Croisées)",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Identifiez les configurations de surperformance technique en comparant les moyennes rapides et lentes.",
        theoryMarkdown: `
### Analyse Technique Quantitative : Le Golden Cross

> 💡 **Rappel : Croisement de Moyennes Mobiles (Moving Average Crossover)**
> 
> En trading algorithmique et gestion quantitative de tendance (*Trend Following*), la comparaison de deux moyennes mobiles d'horizons distincts constitue un signal classique :
> - **Moyenne rapide (ex: 2 séances)** : capture la dynamique immédiate des cours.
> - **Moyenne lente (ex: 4 séances)** : filtre le bruit micro-structurel de marché.
> 
> - **Golden Cross (Signal d'achat)** : La moyenne rapide passe au-dessus de la moyenne lente ($SMA_{\\text{rapide}} > SMA_{\\text{lente}}$).
> - **Death Cross (Signal de vente)** : La moyenne rapide passe en-dessous ($SMA_{\\text{rapide}} < SMA_{\\text{lente}}$).
        `,
        taskMarkdown: "Pour le ticker `'MC'` (LVMH), calculez `sma_2` (moyenne sur 2 séances : `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW`) et `sma_4` (moyenne sur 4 séances : `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW`) de `prix_cloture`. Ajoutez une colonne `signal` valant `'ACHAT'` si `sma_2 >= sma_4` sinon `'ATTENTE'`. Triez par `date`.",
        initialCode: "-- Écrivez la requête du signal de croisement :\n",
        solutionCode: "SELECT date, prix_cloture, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4, CASE WHEN AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) >= AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) THEN 'ACHAT' ELSE 'ATTENTE' END AS signal FROM marche_actions WHERE ticker = 'MC' ORDER BY date;",
        validationQuery: "SELECT date, prix_cloture, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4, CASE WHEN AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) >= AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) THEN 'ACHAT' ELSE 'ATTENTE' END AS signal FROM marche_actions WHERE ticker = 'MC' ORDER BY date;",
        hints: ["Utilisez un CASE WHEN ... THEN 'ACHAT' ELSE 'ATTENTE' END.", "Les moyennes se calculent avec AVG(prix_cloture) OVER (...)."],
        datasets: []
      },
      {
        id: "v2-sql-4",
        title: "4. Maximum Drawdown Cumulatif (Running Peak & Drawdown)",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Calculez le plus haut historique glissant et le drawdown journalier en pourcentage.",
        theoryMarkdown: `
### Mesure Asymétrique du Risque : Le Maximum Drawdown (MDD)

> 💡 **Rappel conceptuel : Le Drawdown**
> 
> Le Drawdown à l'instant $t$ mesure la perte en capital subie depuis le sommet historique (*High Watermark*) atteint par l'actif :
> $$M_t = \\max_{s \\le t} P_s \\quad \\text{(Plus haut cumulé)}$$
> $$DD_t = \\frac{P_t - M_t}{M_t} \\le 0$$
> Le **Maximum Drawdown ($MDD$)** est la pire perte historique enregistrée :
> $$MDD = \\min_{t \\in [0, T]} DD_t$$

> 📊 **Sens Métier en Gestion d'Actifs & Hedge Funds :**
> - Les investisseurs institutionnels imposent souvent des contraintes strictes de *Drawdown Stop* (ex: sortie obligatoire si $DD_t < -15\\%$).
> - Le **Ratio de Calmar** relie le rendement annualisé au Maximum Drawdown :
>   $$\\text{Calmar Ratio} = \\frac{\\mathbb{E}[R]}{|MDD|}$$
        `,
        taskMarkdown: "Pour le ticker `'TTE'`, sélectionnez `date`, `prix_cloture`, le plus haut historique `sommet_cumule` défini par `MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`, et le `drawdown_pct` calculé par `((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100`. Triez par `date`.",
        initialCode: "-- Calculez le sommet cumulé et le drawdown en pourcentage :\n",
        solutionCode: "SELECT date, prix_cloture, MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule, ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
        validationQuery: "SELECT date, prix_cloture, MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule, ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
        hints: ["MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) donne le plus haut historique."],
        datasets: []
      },
      {
        id: "v2-sql-5",
        title: "5. Ranking & Segmentation par Quantiles (NTILE & DENSE_RANK)",
        category: "data_engineering",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 6,
        description: "Classez les actifs par rendement pour la séance du 2024-01-02 en 2 groupes de performance.",
        theoryMarkdown: `
### Segmentation Factorielle et Construction de Paniers Long/Short

> 💡 **Rappel : Les fonctions de classement NTILE et RANK**
> 
> En finance quantitative, pour construire des portefeuilles factoriels (ex: Momentum, Low Volatility), on partitionne l'univers d'investissement à chaque date en quantiles :
> - \`NTILE(k)\` : répartit les lignes de manière équilibrée en $k$ compartiments (buckets).
> - \`DENSE_RANK()\` : attribue un rang séquentiel sans saut d'entier en cas d'ex æquo.

> 📊 **Sens Financier :**
> - **Top bucket ($Q_k$)** : panier d'actifs à acheter (*Long*).
> - **Bottom bucket ($Q_1$)** : panier d'actifs à vendre à découvert (*Short*).
        `,
        taskMarkdown: "Pour la date `'2024-01-02'`, sélectionnez `ticker`, `nom_societe`, `rendement_journalier`, et partitionnez les actifs en 2 groupes avec `NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf`. Triez par `rendement_journalier` décroissant.",
        initialCode: "-- Segmentez les titres en 2 buckets de performance :\n",
        solutionCode: "SELECT ticker, nom_societe, rendement_journalier, NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf FROM marche_actions WHERE date = '2024-01-02' ORDER BY rendement_journalier DESC;",
        validationQuery: "SELECT ticker, nom_societe, rendement_journalier, NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf FROM marche_actions WHERE date = '2024-01-02' ORDER BY rendement_journalier DESC;",
        hints: ["Utilisez NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf."],
        datasets: []
      },
      {
        id: "v2-sql-6",
        title: "6. Jointure Temporelle Asynchrone (ASOF Join / Forward-Fill)",
        category: "data_engineering",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Associez à chaque séance de bourse la dernière valeur connue de la courbe des taux souverains OAT.",
        theoryMarkdown: `
### Le Problème Canonique des Séries Temporelles Asynchrones

> 💡 **Rappel théorique : ASOF Join (As-Of Join)**
> 
> Sur les marchés financiers, les flux de données arrivent à des fréquences hétérogènes :
> - Les cours d'actions cotent en continu ou quotidiennement (ex: \`2024-01-02\`).
> - Les taux directeurs, les statistiques macroéconomiques ou les courbes de taux souverains sont publiés à dates fixes ou mensuelles (ex: \`2023-12-31\`).
> 
> Une jointure exacte \`ON a.date = b.date\` renverrait zéro correspondance !
> La solution est un **ASOF Join** : associer à chaque enregistrement d'action la valeur la plus récente disponible dans la table macro ($t_{\\text{macro}} \\le t_{\\text{action}}$), selon le principe du *Last Observation Carried Forward (LOCF)*.
        `,
        taskMarkdown: "Pour les cotations de `'AI'` en janvier 2024, sélectionnez `m.date`, `m.ticker`, `m.prix_cloture` et associez via une sous-requête corrélée la dernière valeur connue du taux souverain 10 ans `(SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y`. Triez par `m.date`.",
        initialCode: "-- Effectuez la jointure temporelle asynchrone (LOCF) :\n",
        solutionCode: "SELECT m.date, m.ticker, m.prix_cloture, (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y FROM marche_actions m WHERE m.ticker = 'AI' ORDER BY m.date;",
        validationQuery: "SELECT m.date, m.ticker, m.prix_cloture, (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y FROM marche_actions m WHERE m.ticker = 'AI' ORDER BY m.date;",
        hints: ["Utilisez une sous-requête scalaire dans le SELECT avec WHERE date <= m.date ORDER BY date DESC LIMIT 1."],
        datasets: []
      },
      {
        id: "v2-sql-7",
        title: "7. Matrice de Transition Crédit (Chaîne de Markov en SQL)",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Comptez et calculez les corrélations bilatérales pour identifier les actifs hautement corrélés (> 0.50).",
        theoryMarkdown: `
### Filtrage des Corrélations Élevées et Risque Systémique

> 💡 **Rappel conceptuel : Le Coefficient de Corrélation de Pearson**
> 
> Soit deux actifs financiers $X$ et $Y$. Le coefficient de corrélation linéaire $\\rho_{X,Y}$ est normalisé dans $[-1, 1]$ :
> $$\\rho_{X,Y} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$$
> - $\\rho = 1$ : corrélation positive parfaite (aucun gain de diversification).
> - $\\rho = 0$ : indépendance linéaire.
> - $\\rho = -1$ : couverture parfaite (*perfect hedge*).

> 📊 **Sens en Gestion de Portefeuille :**
> Deux actifs ayant $\\rho > 0.50$ partagent une forte exposition aux mêmes facteurs macroéconomiques. Les identifier permet d'éviter la fausse diversification.
        `,
        taskMarkdown: "À partir de la table `matrice_correlations`, sélectionnez `actif_a`, `actif_b` et `correlation` pour toutes les paires distinctes (`actif_a != actif_b`) dont la corrélation est strictement supérieure à `0.50`. Triez par `correlation` décroissante.",
        initialCode: "-- Isolez les paires d'actifs fortement corrélées :\n",
        solutionCode: "SELECT actif_a, actif_b, correlation FROM matrice_correlations WHERE actif_a != actif_b AND correlation > 0.50 ORDER BY correlation DESC;",
        validationQuery: "SELECT actif_a, actif_b, correlation FROM matrice_correlations WHERE actif_a != actif_b AND correlation > 0.50 ORDER BY correlation DESC;",
        hints: ["WHERE actif_a != actif_b AND correlation > 0.50", "ORDER BY correlation DESC"],
        datasets: []
      },
      {
        id: "v2-sql-8",
        title: "8. Arbre Binomial de Cox-Ross-Rubinstein (CTE Récursive)",
        category: "pricing",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Générez la structure d'un arbre stochastique à 3 pas de temps en utilisant une CTE récursive.",
        theoryMarkdown: `
### Modélisation Stochastique Discrète : Le Modèle CRR en SQL

> 💡 **Rappel théorique : L'arbre binomial de Cox-Ross-Rubinstein (1979)**
> 
> À chaque pas de temps discret $n \\in \\{0, 1, 2, \\dots, N\\}$, le cours du sous-jacent $S_0$ peut monter avec le multiplicateur $u$ ou baisser avec $d$ :
> $$u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u} = e^{-\\sigma \\sqrt{\\Delta t}}$$
> Après $n$ pas de temps et $j$ hausses ($0 \\le j \\le n$), le prix au nœud $(n, j)$ vaut :
> $$S_{n,j} = S_0 \\times u^j \\times d^{n-j}$$

> 📌 **Puissance des CTE Récursives (\`WITH RECURSIVE\`) en SQL :**
> Permet d'itérer mathématiquement sans boucle procédurale pour construire des structures arborescentes ou des graphes stochastiques.
        `,
        taskMarkdown: "Écrivez une requête récursive générant les pas de temps `n` de 0 à 3 et calculant le cours théorique pour $S_0 = 100$ et un facteur multiplicatif $u = 1.05$ (supposons $d = 0.9524$), où `prix = 100.0 * POWER(1.05, n)`. La table doit comporter `n` et `prix`. Triez par `n` croissant.",
        initialCode: "-- Construisez la trajectoire géométrique avec WITH RECURSIVE :\n",
        solutionCode: "WITH RECURSIVE arbre(n, prix) AS (SELECT 0, 100.0 UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3) SELECT n, prix FROM arbre ORDER BY n;",
        validationQuery: "WITH RECURSIVE arbre(n, prix) AS (SELECT 0, 100.0 UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3) SELECT n, prix FROM arbre ORDER BY n;",
        hints: ["Démarrez avec SELECT 0, 100.0", "UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3"],
        datasets: []
      },
      {
        id: "v2-sql-9",
        title: "9. Détection des Anomalies de Marché par Z-Score",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Détectez les séances où le volume échangé a dépassé de 20% la moyenne globale du ticker.",
        theoryMarkdown: `
### Détection des Pics de Volume et Chocs d'Information

> 💡 **Rappel théorique : Anomalies de Liquidité & Flash Events**
> 
> Les mouvements brutaux sur les cours de bourse sont quasi systématiquement accompagnés de **pics anormaux de volume** (*Volume Spikes*).
> Les quants surveillent le ratio :
> $$\\text{Volume Ratio}_t = \\frac{\\text{Volume}_t}{\\overline{\\text{Volume}}}$$
> Un ratio sensiblement supérieur à $1.0$ signale l'intervention d'investisseurs institutionnels (*Smart Money*) ou la publication de résultats d'entreprises.
        `,
        taskMarkdown: "Sélectionnez `date`, `ticker`, `volume`, et la moyenne du volume par ticker `AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen`. Filtrez les lignes où le volume dépasse 1.15 fois (`> 1.15 *`) cette moyenne par ticker via une sous-requête. Triez par `date`.",
        initialCode: "-- Isolez les séances de fort pic de volume :\n",
        solutionCode: "SELECT date, ticker, volume, vol_moyen FROM (SELECT date, ticker, volume, AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen ORDER BY date;",
        validationQuery: "SELECT date, ticker, volume, vol_moyen FROM (SELECT date, ticker, volume, AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen ORDER BY date;",
        hints: ["Enveloppez la fenêtre dans une sous-requête : FROM (SELECT ..., AVG(volume) OVER (...) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen"],
        datasets: []
      },
      {
        id: "v2-sql-10",
        title: "10. Ratio Rendement/Risque (Sharpe) & Classement ESG",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 6,
        description: "Filtrez et classez les actifs de portefeuille combinant performance financière et responsabilité extra-financière.",
        theoryMarkdown: `
### Investissement Socialement Responsable (ISR) & Performance Ajustée du Risque

> 💡 **Rappel conceptuel : Le Ratio de Sharpe**
> 
> Développé par William Sharpe (Prix Nobel 1990), le ratio de Sharpe mesure l'excédent de rentabilité par unité de risque total :
> $$SR = \\frac{\\mathbb{E}[R] - r_f}{\\sigma}$$
> - $SR > 0.3$ : Performance acceptable.
> - $SR > 0.5$ : Bonne performance corrigée de la volatilité.

> 📊 **Sens Métier :**
> L'intégration des critères ESG (Environnement, Social, Gouvernance) permet de réduire les risques de réputation et de transition climatique sans nécessairement dégrader le ratio de Sharpe.
        `,
        taskMarkdown: "À partir de `portefeuilles_actifs`, sélectionnez `ticker`, `nom`, `rendement_espere`, `volatilite`, `ratio_sharpe`, et `score_esg`. Filtrez les actifs ayant un `score_esg >= 80` et un `ratio_sharpe >= 0.30`. Triez par `ratio_sharpe` décroissant.",
        initialCode: "-- Filtrez les actifs selon les critères Sharpe et ESG :\n",
        solutionCode: "SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg FROM portefeuilles_actifs WHERE score_esg >= 80 AND ratio_sharpe >= 0.30 ORDER BY ratio_sharpe DESC;",
        validationQuery: "SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg FROM portefeuilles_actifs WHERE score_esg >= 80 AND ratio_sharpe >= 0.30 ORDER BY ratio_sharpe DESC;",
        hints: ["WHERE score_esg >= 80 AND ratio_sharpe >= 0.30", "ORDER BY ratio_sharpe DESC"],
        datasets: []
      },
      {
        id: "v2-sql-11",
        title: "11. Valeur Quotidienne d'un Portefeuille Pondéré (60/40)",
        category: "pricing",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Calculez la valeur historique d'un portefeuille allouant 60% à LVMH (MC) et 40% à TotalEnergies (TTE).",
        theoryMarkdown: `
### Allocation d'Actifs Canonique : Le Portefeuille 60/40

> 💡 **Rappel : Valorisation d'un Portefeuille Multi-Actifs**
> 
> Soit $K$ actifs de prix $P_{i,t}$ détenus en quantités $q_i$. La valeur liquidative du portefeuille est :
> $$V_t = \\sum_{i=1}^K q_i P_{i,t}$$
> Si l'on normalise la valeur initiale à $V_0 = 100$ avec des poids initiaux $w_i$ ($w_1 = 0.60, w_2 = 0.40$), le cours indiciel base 100 évolue selon :
> $$V_t = 100 \\times \\left( w_1 \\frac{P_{1,t}}{P_{1,0}} + w_2 \\frac{P_{2,t}}{P_{2,0}} \\right)$$
        `,
        taskMarkdown: "Pour les dates communes entre `'MC'` et `'TTE'`, joignez les deux séries et calculez `valeur_portefeuille` définie par `0.60 * m.prix_cloture + 0.40 * t.prix_cloture`. Sélectionnez `m.date`, `m.prix_cloture AS prix_mc`, `t.prix_cloture AS prix_tte`, et `valeur_portefeuille`. Triez par `m.date`.",
        initialCode: "-- Calculez la valeur quotidienne du panier 60/40 :\n",
        solutionCode: "SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte, (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille FROM marche_actions m JOIN marche_actions t ON m.date = t.date WHERE m.ticker = 'MC' AND t.ticker = 'TTE' ORDER BY m.date;",
        validationQuery: "SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte, (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille FROM marche_actions m JOIN marche_actions t ON m.date = t.date WHERE m.ticker = 'MC' AND t.ticker = 'TTE' ORDER BY m.date;",
        hints: ["Faites un JOIN de marche_actions avec elle-même sur m.date = t.date", "Filtrez WHERE m.ticker = 'MC' AND t.ticker = 'TTE'."],
        datasets: []
      },
      {
        id: "v2-sql-12",
        title: "12. Covariance Empirique en SQL (Somme des Co-Produits)",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Calculez la covariance empirique exacte entre les rendements de BNP et TTE en SQL.",
        theoryMarkdown: `
### Calcul Distribué de la Covariance en Base de Données

> 💡 **Rappel mathématique : Formulation de la Covariance**
> 
> La covariance empirique entre deux séries $X$ et $Y$ observées sur $T$ dates s'écrit :
> $$\\operatorname{Cov}(X, Y) = \\frac{1}{T-1} \\sum_{t=1}^T (X_t - \\bar{X})(Y_t - \\bar{Y}) = \\frac{T}{T-1} \\left( \\frac{1}{T} \\sum X_t Y_t - \\bar{X}\\bar{Y} \\right)$$
> 
> En Data Engineering moderne, pré-calculer les covariances directement dans le Data Warehouse (Snowflake, BigQuery, ClickHouse) évite de rapatrier des gigaoctets de données brutes vers l'interpréteur Python.
        `,
        taskMarkdown: "À partir des rendements journaliers de `'BNP'` et `'TTE'` appariés par `date`, calculez `AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier) AS cov_estimee`.",
        initialCode: "-- Calculez la covariance empirique en SQL :\n",
        solutionCode: "SELECT (AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee FROM marche_actions b JOIN marche_actions t ON b.date = t.date WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';",
        validationQuery: "SELECT (AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee FROM marche_actions b JOIN marche_actions t ON b.date = t.date WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';",
        hints: ["Utilisez AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier) AS cov_estimee"],
        datasets: []
      },
      {
        id: "v2-sql-13",
        title: "13. Optimisation de Requêtes : EXPLAIN QUERY PLAN",
        category: "data_engineering",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 6,
        description: "Inspectez le plan d'exécution du moteur SQL pour analyser comment les index sont exploités.",
        theoryMarkdown: `
### Performance et Indexation B-Tree en Base de Données

> 💡 **Rappel : Comment le moteur SQL résout-il vos requêtes ?**
> 
> L'instruction \`EXPLAIN QUERY PLAN\` expose la stratégie choisie par l'optimiseur de coût du moteur relationnel :
> - **SCAN TABLE** : Parcours séquentiel intégral de la table en $\\mathcal{O}(N)$ (très lent sur des millions de lignes).
> - **SEARCH TABLE USING INDEX** : Recherche logarithmique dans un arbre équilibré B-Tree en $\\mathcal{O}(\\log N)$.
> - **SEARCH TABLE USING PRIMARY KEY** : Accès direct en temps quasi-constant.
        `,
        taskMarkdown: "Préfixez la requête de sélection `SELECT * FROM marche_actions WHERE id = 5;` par `EXPLAIN QUERY PLAN` pour afficher le détail de l'accès indexé.",
        initialCode: "-- Affichez le plan d'exécution :\n",
        solutionCode: "EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
        validationQuery: "EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
        hints: ["Écrivez simplement : EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;"],
        datasets: []
      },
      {
        id: "v2-sql-14",
        title: "14. Backtesting d'une Stratégie de Tendance en Pur SQL",
        category: "financial_econometrics",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Simulez le gain d'une règle systématique : acheter si le rendement d'hier était positif, vendre sinon.",
        theoryMarkdown: `
### Backtest Relationnel : Du Signal au PnL Journalier

> 💡 **Rappel méthodologique : Pas de Look-Ahead Bias !**
> 
> En finance quantitative, une erreur fatale fréquente est le **biais d'anticipation** (*Look-Ahead Bias*), consistant à utiliser l'information de l'instant $t$ pour prendre une décision applicable à l'instant $t$.
> - La position $pos_t \\in \\{+1, -1\\}$ prise à la clôture de $t-1$ ne produit ses effets que sur le rendement de la séance suivante $r_t$ :
>   $$PnL_t = pos_{t-1} \\times r_t$$
> 
> En SQL, cela se formalise rigoureusement par \`LAG(signal, 1) OVER (ORDER BY date) * rendement_journalier\`.
        `,
        taskMarkdown: "Pour le ticker `'CW8'`, sélectionnez `date`, `rendement_journalier`, le signal d'hier `LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier`, et le PnL journalier associé. Triez par `date`.",
        initialCode: "-- Calculez le PnL de la stratégie de momentum retardée d'un jour :\n",
        solutionCode: "SELECT date, rendement_journalier, LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier, (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;",
        validationQuery: "SELECT date, rendement_journalier, LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier, (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;",
        hints: ["Utilisez LAG(CASE WHEN ... THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) pour la position d'hier."],
        datasets: []
      },
      {
        id: "v2-sql-15",
        title: "15. Consolidation Multi-Devises & Agrégats Hiérarchiques",
        category: "data_engineering",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 6,
        description: "Produisez un reporting consolidé par secteur d'activité de l'exposition globale et du bêta moyen pondéré.",
        theoryMarkdown: `
### Agrégation et Consolidation des Portefeuilles Institutionnels

> 💡 **Rappel : Le Bêta Moyen Pondéré du Portefeuille**
> 
> Le bêta global $\\beta_p$ d'un portefeuille multi-sectoriel est la moyenne pondérée des bêtas individuels :
> $$\\beta_p = \\sum_{i=1}^K w_i \\beta_i$$
> Ce reporting est indispensable pour les comités d'allocation afin de vérifier le respect des limites de risque de marché.
        `,
        taskMarkdown: "À partir de `portefeuilles_actifs`, regroupez par `secteur` et calculez le nombre d'actifs `nb_actifs`, le rendement espéré moyen `rendement_moyen`, et le bêta moyen `beta_moyen`. Triez par `secteur` alphabétique.",
        initialCode: "-- Générez le rapport consolidé par secteur :\n",
        solutionCode: "SELECT secteur, COUNT(*) AS nb_actifs, AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen FROM portefeuilles_actifs GROUP BY secteur ORDER BY secteur;",
        validationQuery: "SELECT secteur, COUNT(*) AS nb_actifs, AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen FROM portefeuilles_actifs GROUP BY secteur ORDER BY secteur;",
        hints: ["GROUP BY secteur ORDER BY secteur", "AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen"],
        datasets: []
      },
    ]
  },
  {
    id: "python-finance-econometrics",
    title: "Algèbre Matricielle & Économétrie Financière",
    subtitle: "Matrices de Covariance, Valeurs Propres, GMVP & Modèles Factoriels",
    icon: "TrendingUp",
    description: "Plongez dans l'économétrie financière de pointe : calcul matriciel vectorisé, analyse spectrale, dé-bruitage de Marchenko-Pastur, optimisation de Markowitz (GMVP, Tangence), CAPM et GARCH(1,1).",
    exercises: [
      {
        id: "v2-py-1",
        title: "1. Algèbre Matricielle Vectorisée en NumPy (@ & .T)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Débutant",
        durationMinutes: 6,
        description: "Calculez le rendement espéré et la variance d'un portefeuille de 3 actifs avec le produit matriciel.",
        theoryMarkdown: `
### Calcul Matriciel et Représentation Vectorielle des Portefeuilles

> 💡 **Rappel théorique : Formulation Matricielle de Markowitz**
> 
> Soit un portefeuille de $K$ actifs financiers :
> - Vecteur colonne des pondérations : $\\mathbf{w} = [w_1, w_2, \\dots, w_K]' \\in \\mathbb{R}^K$ avec $\\sum_{i=1}^K w_i = \\mathbf{w}' \\mathbf{1} = 1$.
> - Vecteur des espérances de rendements : $\\boldsymbol{\\mu} = [\\mu_1, \\mu_2, \\dots, \\mu_K]' \\in \\mathbb{R}^K$.
> - Matrice de variance-covariance : $\\Sigma \\in \\mathbb{R}^{K \\times K}$.
> 
> Le rendement espéré et la variance du portefeuille s'écrivent de manière compacte :
> $$\\mathbb{E}[R_p] = \\mathbf{w}' \\boldsymbol{\\mu} = \\sum_{i=1}^K w_i \\mu_i$$
> $$\\sigma_p^2 = \\operatorname{Var}(R_p) = \\mathbf{w}' \\Sigma \\mathbf{w} = \\sum_{i=1}^K \\sum_{j=1}^K w_i w_j \\sigma_{ij}$$

> 📌 **Opérateur Python Moderne \`@\` :**
> En Python 3.5+, l'opérateur \`@\` effectue le produit matriciel (équivalent à \`np.matmul\` ou \`np.dot\`).
> Pour calculer $\\mathbf{w}' \\Sigma \\mathbf{w}$ : \`w.T @ Sigma @ w\`.
        `,
        taskMarkdown: "Soit les poids `w = np.array([0.4, 0.35, 0.25])`, les espérances `mu = np.array([0.08, 0.10, 0.06])` et la matrice de covariance `Sigma = np.array([[0.04, 0.01, 0.005], [0.01, 0.06, 0.015], [0.005, 0.015, 0.03]])`. Calculez `rendement_espere = w @ mu`, la variance `variance_portefeuille = w @ Sigma @ w` et la volatilité `volatilite_portefeuille = np.sqrt(variance_portefeuille)`. Affichez les résultats.",
        initialCode: "import numpy as np\n\nw = np.array([0.4, 0.35, 0.25])\nmu = np.array([0.08, 0.10, 0.06])\nSigma = np.array([\n    [0.04, 0.01, 0.005],\n    [0.01, 0.06, 0.015],\n    [0.005, 0.015, 0.03]\n])\n\n# Calculez rendement_espere, variance_portefeuille et volatilite_portefeuille :\n",
        solutionCode: "import numpy as np\n\nw = np.array([0.4, 0.35, 0.25])\nmu = np.array([0.08, 0.10, 0.06])\nSigma = np.array([\n    [0.04, 0.01, 0.005],\n    [0.01, 0.06, 0.015],\n    [0.005, 0.015, 0.03]\n])\n\nrendement_espere = float(w @ mu)\nvariance_portefeuille = float(w @ Sigma @ w)\nvolatilite_portefeuille = float(np.sqrt(variance_portefeuille))\n\nprint(f'Rendement espéré : {rendement_espere:.4f}')\nprint(f'Variance : {variance_portefeuille:.6f}')\nprint(f'Volatilité : {volatilite_portefeuille:.4f}')",
        testPythonCode: "assert 'rendement_espere' in globals()\nassert 'variance_portefeuille' in globals()\nassert 'volatilite_portefeuille' in globals()\nassert np.isclose(rendement_espere, 0.082, atol=1e-3)\nassert np.isclose(variance_portefeuille, 0.021025, atol=1e-4)",
        hints: ["rendement_espere = float(w @ mu)", "variance_portefeuille = float(w @ Sigma @ w)", "volatilite_portefeuille = float(np.sqrt(variance_portefeuille))"],
        datasets: []
      },
      {
        id: "v2-py-2",
        title: "2. Matrice de Variance-Covariance et Corrélation",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Estimez la matrice de variance-covariance et la matrice de corrélation à partir d'une matrice de rendements.",
        theoryMarkdown: `
### De la Matrice des Rendements Centrés à la Matrice de Corrélation

> 💡 **Rappel théorique : L'estimateur sans biais de l'échantillon**
> 
> Soit $X \\in \\mathbb{R}^{T \\times K}$ la matrice de $T$ observations de rendements pour $K$ actifs.
> 1. **Centrage des données** : $\\tilde{X} = X - \\mathbf{1}\\bar{\\mathbf{x}}'$ où $\\bar{\\mathbf{x}} = \\frac{1}{T} X' \\mathbf{1}$.
> 2. **Matrice de covariance empirique** :
>    $$\\Sigma = \\frac{1}{T-1} \\tilde{X}' \\tilde{X}$$
> 3. **Normalisation en matrice de corrélation $C$** :
>    $$C = D^{-1/2} \\Sigma D^{-1/2}$$
>    où $D = \\operatorname{diag}(\\sigma_{11}, \\sigma_{22}, \\dots, \\sigma_{KK})$ contient les variances sur la diagonale.
        `,
        taskMarkdown: "À partir des rendements simulés `X` (matrice $100 \\times 3$), calculez la matrice de covariance empirique `Sigma = np.cov(X, rowvar=False)` et la matrice de corrélation `C = np.corrcoef(X, rowvar=False)`. Affichez `Sigma` et `C`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 3) * [0.02, 0.03, 0.015]\n\n# Calculez Sigma et C avec np.cov et np.corrcoef :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 3) * [0.02, 0.03, 0.015]\n\nSigma = np.cov(X, rowvar=False)\nC = np.corrcoef(X, rowvar=False)\n\nprint('Matrice de Covariance Sigma :\\n', np.round(Sigma, 6))\nprint('Matrice de Corrélation C :\\n', np.round(C, 4))",
        testPythonCode: "assert 'Sigma' in globals()\nassert 'C' in globals()\nassert Sigma.shape == (3, 3)\nassert C.shape == (3, 3)\nassert np.allclose(np.diag(C), 1.0)",
        hints: ["Utilisez Sigma = np.cov(X, rowvar=False)", "C = np.corrcoef(X, rowvar=False)"],
        datasets: []
      },
      {
        id: "v2-py-3",
        title: "3. Décomposition Spectrale : Valeurs & Vecteurs Propres",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Décomposez la matrice de covariance en valeurs propres et vecteurs propres (Théorème Spectral).",
        theoryMarkdown: `
### Le Théorème Spectral et la Géométrie du Risque

> 💡 **Rappel fondamental : Diagonalisation d'une Matrice Symétrique**
> 
> Toute matrice symétrique réelle $\\Sigma \\in \\mathbb{R}^{K \\times K}$ est diagonalisable dans une base orthonormée de vecteurs propres :
> $$\\Sigma = V \\Lambda V' = \\sum_{i=1}^K \\lambda_i \\mathbf{v}_i \\mathbf{v}_i'$$
> - $\\Lambda = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\dots, \\lambda_K)$ contient les **valeurs propres** (variances le long des axes principaux).
> - $V = [\\mathbf{v}_1, \\dots, \\mathbf{v}_K]$ est une matrice orthogonale ($V'V = V V' = I_K$) formée des **vecteurs propres** (directions des facteurs de risque non corrélés).
> 
> Pour qu'une matrice soit une vraie matrice de covariance admissible, elle doit être **semi-définie positive** :
> $$\\lambda_i \\ge 0 \\quad (\\forall i \\in \\{1, \\dots, K\\})$$
        `,
        taskMarkdown: "À partir de la matrice `Sigma`, calculez les valeurs propres `valeurs_propres` et vecteurs propres `vecteurs_propres` avec `np.linalg.eigh(Sigma)`. Vérifiez ensuite la reconstruction `Sigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T`. Affichez les valeurs propres.",
        initialCode: "import numpy as np\n\nSigma = np.array([\n    [0.05, 0.02, 0.01],\n    [0.02, 0.08, 0.03],\n    [0.01, 0.03, 0.04]\n])\n\n# Calculez valeurs_propres, vecteurs_propres et Sigma_reconstruite :\n",
        solutionCode: "import numpy as np\n\nSigma = np.array([\n    [0.05, 0.02, 0.01],\n    [0.02, 0.08, 0.03],\n    [0.01, 0.03, 0.04]\n])\n\nvaleurs_propres, vecteurs_propres = np.linalg.eigh(Sigma)\nSigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T\n\nprint('Valeurs propres lambda :\\n', np.round(valeurs_propres, 6))\nprint('Reconstruction exacte :', np.allclose(Sigma, Sigma_reconstruite))",
        testPythonCode: "assert 'valeurs_propres' in globals()\nassert 'vecteurs_propres' in globals()\nassert 'Sigma_reconstruite' in globals()\nassert np.all(valeurs_propres > 0)\nassert np.allclose(Sigma, Sigma_reconstruite)",
        hints: ["valeurs_propres, vecteurs_propres = np.linalg.eigh(Sigma)", "Sigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T"],
        datasets: []
      },
      {
        id: "v2-py-4",
        title: "4. Test de Définie-Positivité & Projection sur le Cône PSD",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Corrigez une matrice de corrélation non définie positive en tronquant les valeurs propres négatives (Méthode de Higham).",
        theoryMarkdown: `
### Régularisation des Matrices Empiriques non Définies Positives

> 💡 **Le Cauchemar du Quant : Valeurs Propres Négatives**
> 
> En pratique, l'asynchronisme des cotations, les données manquantes ou l'utilisation de corrélations par paires (*pairwise deletion*) brisent souvent la définie-positivité d'une matrice empirique :
> $$\\exists i : \\lambda_i < 0 \\implies \\mathbf{w}' \\Sigma \\mathbf{w} < 0 \\quad (\\text{Variance de portefeuille négative !})$$
> 
> **Algorithme de Projection Spectrale (Spectral Clipping) :**
> On projette la matrice sur le cône des matrices semi-définies positives en remplaçant toute valeur propre négative par un seuil $\\epsilon > 0$ :
> $$\\Lambda_{\\text{PSD}} = \\max(\\Lambda, \\epsilon I)$$
> $$\\Sigma_{\\text{PSD}} = V \\Lambda_{\\text{PSD}} V'$$
        `,
        taskMarkdown: "Soit la matrice non définie-positive `Sigma_perturbee`. Calculez ses valeurs propres et vecteurs propres. Créez `valeurs_propres_psd = np.maximum(valeurs_propres, 1e-6)`. Reconstruisez `Sigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T`. Affichez la plus petite valeur propre avant et après correction.",
        initialCode: "import numpy as np\n\n# Matrice empirique bruitée possédant une valeur propre négative\nSigma_perturbee = np.array([\n    [1.0, 0.9, 0.7],\n    [0.9, 1.0, 0.95],\n    [0.7, 0.95, 1.0]\n])\n\n# Régularisez la matrice sur le cône PSD :\n",
        solutionCode: "import numpy as np\n\nSigma_perturbee = np.array([\n    [1.0, 0.9, 0.7],\n    [0.9, 1.0, 0.95],\n    [0.7, 0.95, 1.0]\n])\n\nvaleurs_propres, vecteurs_propres = np.linalg.eigh(Sigma_perturbee)\nvaleurs_propres_psd = np.maximum(valeurs_propres, 1e-6)\nSigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T\n\nprint(f'Plus petite valeur propre brute : {valeurs_propres.min():.6f}')\nprint(f'Plus petite valeur propre corrigée : {valeurs_propres_psd.min():.6f}')",
        testPythonCode: "assert 'Sigma_psd' in globals()\nassert 'valeurs_propres_psd' in globals()\nassert np.all(valeurs_propres_psd >= 1e-6)\nassert np.all(np.linalg.eigvalsh(Sigma_psd) > 0)",
        hints: ["valeurs_propres_psd = np.maximum(valeurs_propres, 1e-6)", "Sigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T"],
        datasets: []
      },
      {
        id: "v2-py-5",
        title: "5. Analyse en Composantes Principales (PCA) de la Courbe des Taux",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Extrayez les 3 facteurs canoniques de Litterman-Scheinkman (Niveau, Pente, Courbure) par ACP.",
        theoryMarkdown: `
### Modèle de Litterman-Scheinkman (1991) : Les Facteurs Invariants des Taux

> 💡 **Rappel fondamental : Les 3 Composantes Principales de la Courbe**
> 
> L'application de l'ACP sur la structure par terme des taux souverains (maturités 1Y à 30Y) révèle que 3 composantes orthogonales expliquent plus de **98%** de la variance totale :
> 1. **PC1 - Facteur Niveau (Level) [~80-90% de la variance]** : translation parallèle de la courbe (les vecteurs propres ont des poids quasi-constants et de même signe).
> 2. **PC2 - Facteur Pente (Slope) [~8-12% de la variance]** : rotation de la courbe (aplatissement ou pentification, poids monotones du court terme vers le long terme).
> 3. **PC3 - Facteur Courbure (Curvature) [~2-5% de la variance]** : torsion des maturités intermédiaires (forme en papillon / butterfly).
        `,
        taskMarkdown: "À partir des variations mensuelles des taux souverains `dX` (matrice $12 \\times 6$), calculez la matrice de covariance `cov_mat = np.cov(dX, rowvar=False)`. Extrayez les valeurs propres avec `np.linalg.eigh(cov_mat)` et triez-les par ordre décroissant. Calculez le vecteur de ratio de variance expliquée `ratio_explique = valeurs_triees / valeurs_triees.sum()` et la part cumulée des 3 premiers facteurs `pct_top3 = float(ratio_explique[:3].sum() * 100)`. Affichez `pct_top3`.",
        initialCode: "import numpy as np\n\nnp.random.seed(123)\n# Simulation des variations mensuelles de 6 maturités (1Y, 2Y, 5Y, 10Y, 20Y, 30Y)\n# Facteur niveau dominant + facteur pente + bruit résiduel\nlevel = np.random.randn(24, 1) * 0.25\nslope = np.random.randn(24, 1) * np.linspace(-0.15, 0.15, 6)\ndX = level + slope + np.random.randn(24, 6) * 0.03\n\n# Calculez cov_mat, valeurs_triees, ratio_explique et pct_top3 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(123)\nlevel = np.random.randn(24, 1) * 0.25\nslope = np.random.randn(24, 1) * np.linspace(-0.15, 0.15, 6)\ndX = level + slope + np.random.randn(24, 6) * 0.03\n\ncov_mat = np.cov(dX, rowvar=False)\nevals, _ = np.linalg.eigh(cov_mat)\nvaleurs_triees = evals[::-1]\nratio_explique = valeurs_triees / valeurs_triees.sum()\npct_top3 = float(ratio_explique[:3].sum() * 100)\n\nprint('Ratios de variance expliquée :', np.round(ratio_explique, 4))\nprint(f'Variance cumulée expliquée par les 3 premiers facteurs : {pct_top3:.2f}%')",
        testPythonCode: "assert 'ratio_explique' in globals()\nassert 'pct_top3' in globals()\nassert pct_top3 > 90.0\nassert np.isclose(ratio_explique.sum(), 1.0)",
        hints: ["evals, _ = np.linalg.eigh(cov_mat)", "valeurs_triees = evals[::-1]", "ratio_explique = valeurs_triees / valeurs_triees.sum()", "pct_top3 = float(ratio_explique[:3].sum() * 100)"],
        datasets: []
      },
      {
        id: "v2-py-6",
        title: "6. Dé-bruitage de Marchenko-Pastur (Random Matrix Theory)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Appliquez les résultats de la physique théorique (RMT) pour identifier les valeurs propres portant un vrai signal économique.",
        theoryMarkdown: `
### Théorie des Matrices Aléatoires (RMT) et Loi de Marchenko-Pastur

> 💡 **Rappel fondamental : Bruit d'Échantillonnage et Spectre Aléatoire**
> 
> Pour une matrice de $T$ observations de $N$ actifs non corrélés, le ratio $q = T / N$ gouverne la dispersion purement aléatoire des valeurs propres de la matrice de corrélation.
> La **loi de Marchenko-Pastur (1967)** démontre que les valeurs propres dues au pur bruit blanc sont bornées dans :
> $$\\lambda_{\\pm} = \\sigma^2 \\left( 1 \\pm \\sqrt{\\frac{1}{q}} \\right)^2 = \\sigma^2 \\left( 1 \\pm \\sqrt{\\frac{N}{T}} \\right)^2$$
> 
> **Règle de Décision Quantitative :**
> - **$\\lambda_i \\le \\lambda_+$** : Valeur propre compatible avec du bruit statistique $\\implies$ à éliminer ou rétrécir.
> - **$\\lambda_i > \\lambda_+$** : Valeur propre portant une information financière authentique (vrai facteur macroéconomique / sectoriel).
        `,
        taskMarkdown: "Soit $T = 500$ observations et $N = 50$ actifs ($q = 10$). Calculez la borne supérieure théorique de bruit `lambda_plus = (1.0 + np.sqrt(N / T))**2`. Pour un vecteur de valeurs propres observées `evals_obs`, comptez le nombre de vrais signaux `nb_signaux = int(np.sum(evals_obs > lambda_plus))`. Affichez `lambda_plus` et `nb_signaux`.",
        initialCode: "import numpy as np\n\nT = 500\nN = 50\n\n# Valeurs propres observées sur un portefeuille réel (quelques facteurs de marché + bruit)\nevals_obs = np.array([12.5, 3.8, 2.1, 1.7, 1.4, 1.2, 1.1, 0.95, 0.82, 0.75])\n\n# Calculez lambda_plus et nb_signaux :\n",
        solutionCode: "import numpy as np\n\nT = 500\nN = 50\nevals_obs = np.array([12.5, 3.8, 2.1, 1.7, 1.4, 1.2, 1.1, 0.95, 0.82, 0.75])\n\nlambda_plus = float((1.0 + np.sqrt(N / T))**2)\nnb_signaux = int(np.sum(evals_obs > lambda_plus))\n\nprint(f'Borne supérieure de bruit lambda_+ : {lambda_plus:.4f}')\nprint(f'Nombre de facteurs authentiques (signaux) : {nb_signaux}')",
        testPythonCode: "assert 'lambda_plus' in globals()\nassert 'nb_signaux' in globals()\nassert np.isclose(lambda_plus, 1.73205, atol=0.01)\nassert nb_signaux == 3",
        hints: ["lambda_plus = float((1.0 + np.sqrt(N / T))**2)", "nb_signaux = int(np.sum(evals_obs > lambda_plus))"],
        datasets: []
      },
      {
        id: "v2-py-7",
        title: "7. Rétrécissement de Covariance : Estimateur de Ledoit-Wolf",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Combinez la matrice de covariance empirique et une cible structurée pour minimiser l'erreur quadratique moyenne.",
        theoryMarkdown: `
### Compromis Biais-Variance : Le Shrinkage de Ledoit & Wolf (2004)

> 💡 **Rappel conceptuel : Pourquoi la covariance empirique échoue en out-of-sample**
> 
> - La matrice empirique $\\Sigma_{\\text{sample}}$ est **sans biais**, mais possède une **très forte variance d'échantillonnage**, surtout quand le nombre d'actifs $K$ est grand devant $T$.
> - Une cible structurée $F$ (ex: corrélation moyenne constante ou modèle à un facteur) a un **biais**, mais une **variance quasi-nulle**.
> 
> L'estimateur de Shrinkage linéaire trouve le coefficient optimal $\\alpha^* \\in [0, 1]$ minimisant la perte de Frobenius :
> $$\\Sigma_{\\text{LW}} = (1 - \\alpha) \\Sigma_{\\text{sample}} + \\alpha F$$
        `,
        taskMarkdown: "Soit la matrice empirique `Sigma_sample` et la cible de variance constante `F = np.eye(3) * np.trace(Sigma_sample) / 3.0`. Pour une intensité de shrinkage `alpha = 0.25`, calculez la matrice rétrécie `Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F`. Affichez `Sigma_lw`.",
        initialCode: "import numpy as np\n\nSigma_sample = np.array([\n    [0.08, 0.03, 0.01],\n    [0.03, 0.12, 0.05],\n    [0.01, 0.05, 0.06]\n])\nalpha = 0.25\n\n# Calculez la matrice cible F et la matrice rétrécie Sigma_lw :\n",
        solutionCode: "import numpy as np\n\nSigma_sample = np.array([\n    [0.08, 0.03, 0.01],\n    [0.03, 0.12, 0.05],\n    [0.01, 0.05, 0.06]\n])\nalpha = 0.25\n\nF = np.eye(3) * (np.trace(Sigma_sample) / 3.0)\nSigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F\n\nprint('Matrice Rétrécie de Ledoit-Wolf Sigma_lw :\\n', np.round(Sigma_lw, 5))",
        testPythonCode: "assert 'F' in globals()\nassert 'Sigma_lw' in globals()\nassert Sigma_lw.shape == (3, 3)\nassert np.isclose(np.trace(Sigma_lw), np.trace(Sigma_sample))",
        hints: ["F = np.eye(3) * (np.trace(Sigma_sample) / 3.0)", "Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F"],
        datasets: []
      },
      {
        id: "v2-py-8",
        title: "8. Portefeuille de Variance Minimale Globale (GMVP Analytique)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Résolvez analytiquement le portefeuille GMVP de Markowitz sans requérir d'estimation des espérances de rendements.",
        theoryMarkdown: `
### Le Portefeuille de Variance Minimale Globale (GMVP)

> 💡 **Rappel mathématique : La Solution Analytique par le Lagrangien**
> 
> Le GMVP résout le problème d'optimisation quadratique suivant :
> $$\\min_{\\mathbf{w}} \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} \\quad \\text{sous la contrainte} \\quad \\mathbf{w}' \\mathbf{1} = 1$$
> 
> En écrivant le lagrangien $\\mathcal{L}(\\mathbf{w}, \\lambda) = \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} - \\lambda (\\mathbf{w}' \\mathbf{1} - 1)$, les conditions du premier ordre (KKT) donnent :
> $$\\nabla_{\\mathbf{w}} \\mathcal{L} = \\Sigma \\mathbf{w} - \\lambda \\mathbf{1} = 0 \\implies \\mathbf{w}^* = \\lambda \\Sigma^{-1} \\mathbf{1}$$
> En appliquant la contrainte $\\mathbf{1}' \\mathbf{w}^* = 1$, on obtient la solution fermée remarquable :
> $$\\mathbf{w}_{GMVP} = \\frac{\\Sigma^{-1} \\mathbf{1}}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}$$
> La variance minimale correspondante est :
> $$\\sigma^2_{GMVP} = \\frac{1}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}$$
        `,
        taskMarkdown: "Soit la matrice de covariance `Sigma`. Calculez l'inverse `inv_Sigma = np.linalg.inv(Sigma)`, le vecteur unitaire `ones = np.ones(3)`, le vecteur des poids optimaux `w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)` et la volatilité minimale `vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))`. Affichez les poids et la volatilité.",
        initialCode: "import numpy as np\n\nSigma = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.06, 0.02],\n    [0.008, 0.02, 0.03]\n])\n\n# Calculez w_gmvp et vol_gmvp :\n",
        solutionCode: "import numpy as np\n\nSigma = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.06, 0.02],\n    [0.008, 0.02, 0.03]\n])\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(Sigma))\nw_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)\nvol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))\n\nprint('Poids optimaux GMVP :', np.round(w_gmvp, 4))\nprint(f'Somme des poids : {w_gmvp.sum():.4f}')\nprint(f'Volatilité minimale annualisée : {vol_gmvp:.4f}')",
        testPythonCode: "assert 'w_gmvp' in globals()\nassert 'vol_gmvp' in globals()\nassert np.isclose(w_gmvp.sum(), 1.0)\nassert vol_gmvp > 0\nassert np.isclose(vol_gmvp, np.sqrt(w_gmvp @ Sigma @ w_gmvp))",
        hints: ["inv_Sigma = np.linalg.inv(Sigma)", "ones = np.ones(len(Sigma))", "w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)", "vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))"],
        datasets: []
      },
      {
        id: "v2-py-9",
        title: "9. Frontière Efficiente de Markowitz (Tracé & Optimisation)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Tracez la frontière efficiente (parabole dans le plan variance-espérance) à l'aide de Matplotlib.",
        theoryMarkdown: `
### Géométrie de la Frontière Efficiente de Markowitz (1952)

> 💡 **Rappel : La parabole de Merton (1972)**
> 
> En combinant deux contraintes linéaires (budget $\\mathbf{w}'\\mathbf{1} = 1$ et rendement cible $\\mathbf{w}'\\boldsymbol{\\mu} = \\mu_p$), l'ensemble des portefeuilles de variance minimale décrit une hyperbole dans le plan $(\\sigma_p, \\mu_p)$ et une parabole exacte dans le plan $(\\sigma_p^2, \\mu_p)$ :
> $$\\sigma_p^2 = \\frac{A \\mu_p^2 - 2B \\mu_p + C}{AC - B^2}$$
> où $A = \\mathbf{1}'\\Sigma^{-1}\\mathbf{1}$, $B = \\mathbf{1}'\\Sigma^{-1}\\boldsymbol{\\mu}$, $C = \\boldsymbol{\\mu}'\\Sigma^{-1}\\boldsymbol{\\mu}$.
        `,
        taskMarkdown: "Calculez les constantes scalaires $A, B, C$. Pour une grille de 50 rendements cibles `mu_targets = np.linspace(0.05, 0.12, 50)`, calculez les variances minimales associées `var_targets = (A * mu_targets**2 - 2*B * mu_targets + C) / (A*C - B**2)`. Tracez la frontière efficiente avec `plt.plot(np.sqrt(var_targets), mu_targets)`. Affichez le déterminant $AC - B^2$.",
        initialCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nmu = np.array([0.06, 0.09, 0.11])\nSigma = np.array([\n    [0.02, 0.005, 0.002],\n    [0.005, 0.04, 0.01],\n    [0.002, 0.01, 0.05]\n])\n\n# Calculez A, B, C, var_targets et générez le tracé Matplotlib :\n",
        solutionCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nmu = np.array([0.06, 0.09, 0.11])\nSigma = np.array([\n    [0.02, 0.005, 0.002],\n    [0.005, 0.04, 0.01],\n    [0.002, 0.01, 0.05]\n])\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(mu))\n\nA = float(ones @ inv_Sigma @ ones)\nB = float(ones @ inv_Sigma @ mu)\nC = float(mu @ inv_Sigma @ mu)\nDelta = A * C - B**2\n\nmu_targets = np.linspace(0.05, 0.12, 50)\nvar_targets = (A * mu_targets**2 - 2 * B * mu_targets + C) / Delta\nvols = np.sqrt(var_targets)\n\nplt.figure(figsize=(6, 4))\nplt.plot(vols * 100, mu_targets * 100, color='#0284c7', lw=2.2, label='Frontière Efficiente')\nplt.scatter([np.sqrt(1/A)*100], [B/A*100], color='#e11d48', s=60, zorder=5, label='GMVP')\nplt.xlabel('Volatilité (%)')\nplt.ylabel('Rendement Espéré (%)')\nplt.title('Frontière Efficiente de Markowitz')\nplt.legend()\nplt.grid(True, alpha=0.3)\n\nprint(f'Constantes : A={A:.2f}, B={B:.2f}, C={C:.2f}, Delta={Delta:.4f}')",
        testPythonCode: "assert 'A' in globals()\nassert 'B' in globals()\nassert 'C' in globals()\nassert 'Delta' in globals()\nassert Delta > 0",
        hints: ["A = float(ones @ inv_Sigma @ ones)", "B = float(ones @ inv_Sigma @ mu)", "C = float(mu @ inv_Sigma @ mu)", "Delta = A * C - B**2"],
        datasets: []
      },
      {
        id: "v2-py-10",
        title: "10. Portefeuille de Tangence & Maximisation du Ratio de Sharpe",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Déterminez le portefeuille tangent à la Capital Market Line (CML) en présence d'un actif sans risque.",
        theoryMarkdown: `
### Le Théorème de Séparation de Tobin (1958) & Portefeuille de Tangence

> 💡 **Rappel théorique : La Capital Market Line (CML)**
> 
> En présence d'un actif sans risque rapportant $r_f$, la frontière efficiente devient un segment de droite reliant $r_f$ au **portefeuille de tangence $\\mathbf{w}_T$**, qui maximise la pente (le ratio de Sharpe) :
> $$\\max_{\\mathbf{w}} \\frac{\\mathbf{w}'\\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}'\\Sigma\\mathbf{w}}} \\quad \\text{sous} \\quad \\mathbf{w}'\\mathbf{1} = 1$$
> 
> La formule fermée analytique du portefeuille de tangence est :
> $$\\mathbf{w}_T = \\frac{\\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})}{\\mathbf{1}' \\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})}$$
        `,
        taskMarkdown: "Pour un taux sans risque $r_f = 0.025$, calculez le vecteur des primes de risque `exces_mu = mu - rf * ones`, le vecteur de tangence `w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)` et le ratio de Sharpe optimal `sharpe_opt = float((w_tangence @ mu - rf) / np.sqrt(w_tangence @ Sigma @ w_tangence))`. Affichez `w_tangence` et `sharpe_opt`.",
        initialCode: "import numpy as np\n\nmu = np.array([0.07, 0.09, 0.12])\nSigma = np.array([\n    [0.03, 0.008, 0.005],\n    [0.008, 0.05, 0.012],\n    [0.005, 0.012, 0.07]\n])\nrf = 0.025\n\n# Calculez w_tangence et sharpe_opt :\n",
        solutionCode: "import numpy as np\n\nmu = np.array([0.07, 0.09, 0.12])\nSigma = np.array([\n    [0.03, 0.008, 0.005],\n    [0.008, 0.05, 0.012],\n    [0.005, 0.012, 0.07]\n])\nrf = 0.025\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(mu))\nexces_mu = mu - rf * ones\nw_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)\n\nmu_T = float(w_tangence @ mu)\nvol_T = float(np.sqrt(w_tangence @ Sigma @ w_tangence))\nsharpe_opt = (mu_T - rf) / vol_T\n\nprint('Poids du portefeuille de Tangence :', np.round(w_tangence, 4))\nprint(f'Rendement espéré : {mu_T:.4f}, Volatilité : {vol_T:.4f}')\nprint(f'Ratio de Sharpe maximal : {sharpe_opt:.4f}')",
        testPythonCode: "assert 'w_tangence' in globals()\nassert 'sharpe_opt' in globals()\nassert np.isclose(w_tangence.sum(), 1.0)\nassert sharpe_opt > 0",
        hints: ["exces_mu = mu - rf * ones", "w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)", "sharpe_opt = (float(w_tangence @ mu) - rf) / float(np.sqrt(w_tangence @ Sigma @ w_tangence))"],
        datasets: []
      },
      {
        id: "v2-py-11",
        title: "11. Modèle d'Évaluation des Actifs Financiers (CAPM) : Bêta & Alpha",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Estimez le bêta de marché et l'alpha de Jensen par régression linéaire OLS.",
        theoryMarkdown: `
### Le Capital Asset Pricing Model (CAPM) de Sharpe-Lintner

> 💡 **Rappel conceptuel : Risque Systématique vs Risque Spécifique**
> 
> L'équation de régression du CAPM relie l'excès de rendement d'un actif $i$ à celui du marché $m$ :
> $$R_{i,t} - r_f = \\alpha_i + \\beta_i (R_{m,t} - r_f) + \\varepsilon_{i,t}$$
> - **$\\beta_i = \\frac{\\operatorname{Cov}(R_i, R_m)}{\\operatorname{Var}(R_m)}$** : mesure l'exposition au **risque systématique non diversifiable**.
> - **$\\alpha_i$ (Alpha de Jensen)** : surperformance anormale non expliquée par l'exposition au marché.
> - **Décomposition du risque total** :
>   $$\\operatorname{Var}(R_i) = \\beta_i^2 \\sigma_m^2 + \\sigma_{\\varepsilon}^2$$
        `,
        taskMarkdown: "À partir des excès de rendements de marché `R_m` et de l'actif `R_i`, régressez `R_i` sur une constante et `R_m` avec `sm.OLS`. Extrayez l'alpha estimé `alpha_jensen = float(model.params[0])`, le bêta `beta_capm = float(model.params[1])` et le $R^2$ `r_squared = float(model.rsquared)`. Affichez les paramètres.",
        initialCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(42)\nT = 120\nR_m = np.random.randn(T) * 0.04 + 0.005\nR_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02\n\n# Estimez le CAPM avec statsmodels OLS :\n",
        solutionCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(42)\nT = 120\nR_m = np.random.randn(T) * 0.04 + 0.005\nR_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02\n\nX = sm.add_constant(R_m)\nmodel = sm.OLS(R_i, X).fit()\n\nalpha_jensen = float(model.params[0])\nbeta_capm = float(model.params[1])\nr_squared = float(model.rsquared)\n\nprint(f'Alpha de Jensen : {alpha_jensen:.5f}')\nprint(f'Bêta du CAPM : {beta_capm:.4f}')\nprint(f'R-carré : {r_squared:.4f}')",
        testPythonCode: "assert 'alpha_jensen' in globals()\nassert 'beta_capm' in globals()\nassert 'r_squared' in globals()\nassert np.isclose(beta_capm, 1.25, atol=0.15)\nassert r_squared > 0.5",
        hints: ["X = sm.add_constant(R_m)", "model = sm.OLS(R_i, X).fit()", "alpha_jensen = float(model.params[0])", "beta_capm = float(model.params[1])"],
        datasets: []
      },
      {
        id: "v2-py-12",
        title: "12. Modèle Multi-Factoriel de Fama-French à 3 Facteurs",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Estimez les sensibilités factorielles à la prime de marché, prime de taille (SMB) et prime de valeur (HML).",
        theoryMarkdown: `
### Au-delà du Marché : Le Modèle Fama & French (1993)

> 💡 **Rappel théorique : Les Primes de Risque Systémiques**
> 
> Eugene Fama et Kenneth French (Prix Nobel 2013) ont démontré que le bêta du CAPM seul ne suffit pas à expliquer les rendements des actions. Ils introduisent 2 facteurs de risque empiriques supplémentaires :
> $$R_{i,t} - r_{f,t} = \\alpha_i + \\beta_i (R_{m,t} - r_{f,t}) + s_i \\cdot SMB_t + h_i \\cdot HML_t + \\varepsilon_{i,t}$$
> - **$SMB$ (Small Minus Big)** : prime de taille (surperformance historique des petites capitalisations boursières par rapport aux grandes).
> - **$HML$ (High Minus Low)** : prime de valeur (surperformance des actions 'Value' à fort ratio Book-to-Market par rapport aux actions 'Growth').
        `,
        taskMarkdown: "À partir des facteurs simulés `X_factors` (constante, $Mkt-RF$, $SMB$, $HML$) et des rendements `Y_port`, ajustez le modèle Fama-French avec `sm.OLS`. Extrayez les 4 coefficients `coeffs = model.params` et vérifiez que les p-valeurs `pvalues = model.pvalues` sont calculées. Affichez le résumé du modèle.",
        initialCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(99)\nT = 200\nMkt_RF = np.random.randn(T) * 0.03\nSMB = np.random.randn(T) * 0.015\nHML = np.random.randn(T) * 0.015\nY_port = 0.001 + 0.95 * Mkt_RF + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008\n\nX_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\n\n# Ajustez le modèle OLS multi-factoriel :\n",
        solutionCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(99)\nT = 200\nMkt_RF = np.random.randn(T) * 0.03\nSMB = np.random.randn(T) * 0.015\nHML = np.random.randn(T) * 0.015\nY_port = 0.001 + 0.95 * Mkt_RF + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008\n\nX_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\nmodel = sm.OLS(Y_port, X_factors).fit()\n\ncoeffs = model.params\npvalues = model.pvalues\n\nprint(f'Coefficients [Alpha, Mkt, SMB, HML] :\\n', np.round(coeffs, 4))\nprint(f'R2 du modèle multi-factoriel : {model.rsquared:.4f}')",
        testPythonCode: "assert 'coeffs' in globals()\nassert 'pvalues' in globals()\nassert len(coeffs) == 4\nassert np.isclose(coeffs[1], 0.95, atol=0.10)\nassert np.isclose(coeffs[2], 0.45, atol=0.10)",
        hints: ["model = sm.OLS(Y_port, X_factors).fit()", "coeffs = model.params", "pvalues = model.pvalues"],
        datasets: []
      },
      {
        id: "v2-py-13",
        title: "13. Modélisation de la Volatilité Conditionnelle : GARCH(1,1)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Simulez un processus GARCH(1,1) de Bollerslev pour reproduire le clustering de volatilité des marchés boursiers.",
        theoryMarkdown: `
### Hétéroscédasticité Conditionnelle Auto-Régressive : Le GARCH(1,1)

> 💡 **Rappel : Le Phénomène Stylisé de Clustering de Volatilité**
> 
> Comme l'observait Benoît Mandelbrot (1963) : *"Les grandes variations sont suivies par de grandes variations, et les petites par de petites variations"*.
> Le modèle **GARCH(1,1)** de Tim Bollerslev (1986) spécifie la variance conditionnelle $\\sigma_t^2$ :
> $$\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2$$
> - $\\omega > 0$ : variance plancher à long terme.
> - $\\alpha$ : réaction aux chocs récents de marché (effet ARCH).
> - $\\beta$ : persistance de la volatilité passée (effet GARCH).
> - **Condition de stationnarité** : $\\alpha + \\beta < 1$.
> - **Volatilité inconditionnelle à long terme** :
>   $$\\sigma_L^2 = \\frac{\\omega}{1 - (\\alpha + \\beta)}$$
        `,
        taskMarkdown: "Soit les paramètres $\\omega = 0.00001$, $\\alpha = 0.08$, $\\beta = 0.90$. Calculez la variance à long terme `var_long_terme = omega / (1.0 - (alpha + beta))`. Simulez récursivement la série de variance `sigma2` sur $T=500$ périodes en démarrant à `sigma2[0] = var_long_terme` avec des innovations $\\varepsilon_t = \\sigma_t Z_t$ où $Z_t \\sim \\mathcal{N}(0, 1)$. Affichez `var_long_terme`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nT = 500\nomega = 1e-5\nalpha = 0.08\nbeta = 0.90\n\n# Simulez la variance conditionnelle sigma2 du GARCH(1,1) :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nT = 500\nomega = 1e-5\nalpha = 0.08\nbeta = 0.90\n\nvar_long_terme = float(omega / (1.0 - (alpha + beta)))\nZ = np.random.randn(T)\nsigma2 = np.zeros(T)\neps = np.zeros(T)\n\nsigma2[0] = var_long_terme\neps[0] = np.sqrt(sigma2[0]) * Z[0]\n\nfor t in range(1, T):\n    sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]\n    eps[t] = np.sqrt(sigma2[t]) * Z[t]\n\nprint(f'Variance à long terme : {var_long_terme:.6f}')\nprint(f'Volatilité annualisée moyenne : {np.mean(np.sqrt(sigma2)) * np.sqrt(252):.2%}')",
        testPythonCode: "assert 'var_long_terme' in globals()\nassert 'sigma2' in globals()\nassert len(sigma2) == 500\nassert np.all(sigma2 > 0)\nassert np.isclose(var_long_terme, 0.0005, atol=1e-5)",
        hints: ["var_long_terme = float(omega / (1.0 - (alpha + beta)))", "sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]"],
        datasets: []
      },
      {
        id: "v2-py-14",
        title: "14. Value-at-Risk (VaR 99%) & Expected Shortfall (CVaR)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Estimez les métriques de risque de marché réglementaires (Bâle III) : VaR et CVaR paramétriques vs historiques.",
        theoryMarkdown: `
### Mesures Cohérentes du Risque : VaR et CVaR

> 💡 **Rappel théorique : La Défaillance de Sous-Additivité de la VaR**
> 
> Pour un seuil de confiance $\\alpha = 99\\%$ ($1\\%$ de risque) :
> 1. **Value-at-Risk ($VaR_{99\\%}$)** : fractile de perte maximale tel que $\\mathbb{P}(L > VaR) = 1\\%$.
>    - *Critique majeure* : La VaR ignore l'ampleur des pertes au-delà du quantile et n'est pas sous-additive (la VaR d'un portefeuille peut dépasser la somme des VaRs !).
> 2. **Expected Shortfall ($CVaR_{99\\%}$)** : espérance conditionnelle de la perte sachant qu'elle dépasse la VaR :
>    $$CVaR_{99\\%}(L) = \\mathbb{E}[L \\mid L > VaR_{99\\%}]$$
>    Le CVaR est une mesure de risque **cohérente** au sens d'Artzner et est désormais la norme sous les accords de Bâle III / FRTB (*Fundamental Review of the Trading Book*).
        `,
        taskMarkdown: "À partir des rendements simulés `rendements`, calculez les pertes `pertes = -rendements`. Calculez la VaR historique 99% `var_hist_99 = float(np.percentile(pertes, 99))` et la CVaR historique 99% `cvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())`. Affichez `var_hist_99` et `cvar_hist_99`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\n# 1000 observations de rendements journaliers avec queues épaisses (loi de Student)\nrendements = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005\n\n# Calculez var_hist_99 et cvar_hist_99 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nrendements = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005\n\npertes = -rendements\nvar_hist_99 = float(np.percentile(pertes, 99))\ncvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())\n\nprint(f'VaR historique 99% : {var_hist_99:.4%}')\nprint(f'Expected Shortfall (CVaR) 99% : {cvar_hist_99:.4%}')",
        testPythonCode: "assert 'var_hist_99' in globals()\nassert 'cvar_hist_99' in globals()\nassert cvar_hist_99 >= var_hist_99\nassert var_hist_99 > 0",
        hints: ["pertes = -rendements", "var_hist_99 = float(np.percentile(pertes, 99))", "cvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())"],
        datasets: []
      },
      {
        id: "v2-py-15",
        title: "15. Test de Jarque-Bera & Diagnostics des Queues Épaisses (Fat Tails)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Testez la normalité des rendements financiers en calculant le Skewness, le Kurtosis et la statistique de Jarque-Bera.",
        theoryMarkdown: `
### Diagnostic des Moments d'Ordre Supérieur & Test de Jarque-Bera

> 💡 **Rappel mathématique : Asymétrie et Aplatissement**
> 
> Pour une série centrée-réduite $z_t = \\frac{r_t - \\bar{r}}{s}$ :
> - **Coefficient d'asymétrie (Skewness)** : $S = \\frac{1}{T} \\sum z_t^3$ (asymétrie négative fréquente en bourse = krachs plus violents que les hausses).
> - **Coefficient d'aplatissement (Kurtosis)** : $K = \\frac{1}{T} \\sum z_t^4$.
>   - Pour une loi normale : $K = 3$.
>   - Si $K > 3$ (Excess Kurtosis $K - 3 > 0$) : distribution **leptokurtique** à queues épaisses (*Fat Tails*).
> 
> **Statistique de Test de Jarque-Bera :**
> $$JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\xrightarrow{\\mathcal{L}} \\chi^2(2)$$
> Si la p-valeur $< 0.05$, on rejette formellement l'hypothèse de normalité gaussienne.
        `,
        taskMarkdown: "À partir de la série `r`, calculez la moyenne `m`, l'écart-type `s`, puis le `skewness = float(np.mean(((r - m)/s)**3))` et le `kurtosis = float(np.mean(((r - m)/s)**4))`. Calculez la statistique de test `jb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))`. Affichez `skewness`, `kurtosis` et `jb_stat`.",
        initialCode: "import numpy as np\n\nnp.random.seed(7)\n# Rendements financiers simulés avec sauts (loi de Student df=5)\nr = np.random.standard_t(df=5, size=500) * 0.012\n\n# Calculez skewness, kurtosis et jb_stat :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(7)\nr = np.random.standard_t(df=5, size=500) * 0.012\n\nm = np.mean(r)\ns = np.std(r, ddof=1)\nz = (r - m) / s\n\nskewness = float(np.mean(z**3))\nkurtosis = float(np.mean(z**4))\njb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))\n\nprint(f'Skewness (Asymétrie) : {skewness:.4f}')\nprint(f'Kurtosis (Aplatissement) : {kurtosis:.4f}')\nprint(f'Statistique de Jarque-Bera : {jb_stat:.2f}')\nprint('Rejet de la normalité gaussienne :', jb_stat > 5.99)",
        testPythonCode: "assert 'skewness' in globals()\nassert 'kurtosis' in globals()\nassert 'jb_stat' in globals()\nassert kurtosis > 3.0\nassert jb_stat > 0",
        hints: ["z = (r - np.mean(r)) / np.std(r, ddof=1)", "skewness = float(np.mean(z**3))", "kurtosis = float(np.mean(z**4))", "jb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))"],
        datasets: []
      },
    ]
  },
  {
    id: "python-monte-carlo",
    title: "Simulations de Monte Carlo & Modélisation Stochastique",
    subtitle: "Processus d'Itô, Pricing Dérivés, Réduction de Variance & Modèles de Taux",
    icon: "Cpu",
    description: "Devenez expert en simulation stochastique : algorithme de Box-Muller, factorisation de Cholesky, mouvement brownien géométrique, pricing Black-Scholes vs Monte Carlo, variables antithétiques, options exotiques et processus de Vasicek.",
    exercises: [
      {
        id: "v2-py-16",
        title: "1. Génération Pseudo-Aléatoire & Algorithme de Box-Muller",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Générez des variables gaussiennes standards à partir de lois uniformes par la méthode géométrique de Box-Muller.",
        theoryMarkdown: `
### De l'Aléatoire Uniforme à la Loi Normale : La Transformation de Box-Muller

> 💡 **Rappel théorique : Pourquoi la méthode d'inversion directe est coûteuse**
> 
> La fonction de répartition d'une loi normale $\\Phi(x) = \\int_{-\\infty}^x \\frac{1}{\\sqrt{2\\pi}} e^{-u^2/2} du$ n'admet pas de primitive analytique fermée élémentaire.
> En 1958, George Box et Mervin Muller ont proposé une transformation bidimensionnelle exacte :
> 
> Soit $U_1, U_2 \\sim \\mathcal{U}(0, 1)$ indépendantes. Alors :
> $$Z_1 = \\sqrt{-2 \\ln(U_1)} \\cos(2\\pi U_2)$$
> $$Z_2 = \\sqrt{-2 \\ln(U_1)} \\sin(2\\pi U_2)$$
> sont deux variables aléatoires indépendantes suivant exactement la loi normale centrée réduite $\\mathcal{N}(0, 1)$ !
        `,
        taskMarkdown: "Soit $N = 10\\,000$ tirages uniformes `U1` et `U2` dans $]0, 1[$. Calculez `R = np.sqrt(-2.0 * np.log(U1))` et générez `Z1 = R * np.cos(2.0 * np.pi * U2)`. Calculez la moyenne empirique `moyenne_z1 = float(np.mean(Z1))` et la variance empirique `variance_z1 = float(np.var(Z1))`. Affichez les statistiques.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nU1 = np.random.uniform(1e-10, 1.0, N)\nU2 = np.random.uniform(0.0, 1.0, N)\n\n# Implémentez la transformation de Box-Muller pour obtenir Z1 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nU1 = np.random.uniform(1e-10, 1.0, N)\nU2 = np.random.uniform(0.0, 1.0, N)\n\nR = np.sqrt(-2.0 * np.log(U1))\nZ1 = R * np.cos(2.0 * np.pi * U2)\n\nmoyenne_z1 = float(np.mean(Z1))\nvariance_z1 = float(np.var(Z1))\n\nprint(f'Moyenne empirique de Z1 : {moyenne_z1:.4f} (théorique : 0.0)')\nprint(f'Variance empirique de Z1 : {variance_z1:.4f} (théorique : 1.0)')",
        testPythonCode: "assert 'Z1' in globals()\nassert 'moyenne_z1' in globals()\nassert 'variance_z1' in globals()\nassert len(Z1) == 10000\nassert np.isclose(moyenne_z1, 0.0, atol=0.05)\nassert np.isclose(variance_z1, 1.0, atol=0.05)",
        hints: ["R = np.sqrt(-2.0 * np.log(U1))", "Z1 = R * np.cos(2.0 * np.pi * U2)", "moyenne_z1 = float(np.mean(Z1))", "variance_z1 = float(np.var(Z1))"],
        datasets: []
      },
      {
        id: "v2-py-17",
        title: "2. Simulation de Variables Aléatoires Corrélées par Cholesky",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Générez des chocs de marché multivariés respectant une matrice de covariance cible grâce à la décomposition de Cholesky.",
        theoryMarkdown: `
### Factorisation de Cholesky : La Racine Carrée d'une Matrice

> 💡 **Rappel mathématique : Génération Gaussienne Multivariée**
> 
> Soit une matrice de variance-covariance cible $\\Sigma \\in \\mathbb{R}^{K \\times K}$ symétrique définie positive.
> Il existe une unique matrice triangulaire inférieure $L$ à éléments diagonaux strictement positifs telle que :
> $$\\Sigma = L L'$$
> 
> Si $\\mathbf{Z} = [Z_1, \\dots, Z_K]' \\sim \\mathcal{N}(\\mathbf{0}, I_K)$ est un vecteur de chocs gaussiens indépendants, alors :
> $$\\mathbf{X} = L \\mathbf{Z} \\sim \\mathcal{N}(\\mathbf{0}, \\Sigma)$$
> En effet :
> $$\\operatorname{Var}(\\mathbf{X}) = \\mathbb{E}[(L \\mathbf{Z})(L \\mathbf{Z})'] = L \\mathbb{E}[\\mathbf{Z} \\mathbf{Z}'] L' = L I_K L' = L L' = \\Sigma$$
        `,
        taskMarkdown: "À partir de la matrice de covariance cible `Sigma_cible`, calculez la matrice de Cholesky `L = np.linalg.cholesky(Sigma_cible)`. Générez $N = 50\\,000$ tirages indépendants `Z` ($3 \\times N$) avec `np.random.randn`. Construisez les variables corrélées `X = (L @ Z).T`. Calculez la matrice de covariance empirique `cov_empirique = np.cov(X, rowvar=False)`. Affichez `L` et `cov_empirique`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nSigma_cible = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.09, 0.025],\n    [0.008, 0.025, 0.06]\n])\nN = 50000\n\n# Calculez L, simulez Z, puis construisez X et cov_empirique :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nSigma_cible = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.09, 0.025],\n    [0.008, 0.025, 0.06]\n])\nN = 50000\n\nL = np.linalg.cholesky(Sigma_cible)\nZ = np.random.randn(3, N)\nX = (L @ Z).T\ncov_empirique = np.cov(X, rowvar=False)\n\nprint('Matrice de Cholesky L :\\n', np.round(L, 4))\nprint('Matrice de Covariance Empirique :\\n', np.round(cov_empirique, 4))\nprint('Écart maximal absolu :', np.max(np.abs(cov_empirique - Sigma_cible)))",
        testPythonCode: "assert 'L' in globals()\nassert 'cov_empirique' in globals()\nassert np.allclose(L @ L.T, Sigma_cible)\nassert np.allclose(cov_empirique, Sigma_cible, atol=0.01)",
        hints: ["L = np.linalg.cholesky(Sigma_cible)", "Z = np.random.randn(3, N)", "X = (L @ Z).T", "cov_empirique = np.cov(X, rowvar=False)"],
        datasets: []
      },
      {
        id: "v2-py-18",
        title: "3. Mouvement Brownien Standard (Processus de Wiener)",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Simulez et tracez des trajectoires du processus stochastique de Wiener continu W(t).",
        theoryMarkdown: `
### Les Fondations du Calcul Stochastique : Le Processus de Wiener

> 💡 **Rappel axiomatique : Les 4 propriétés de Robert Brown & Norbert Wiener**
> 
> Un processus stochastique $\\{W_t\\}_{t \\ge 0}$ est un **mouvement brownien standard** si :
> 1. $W_0 = 0$ presque sûrement.
> 2. Les trajectoires $t \\mapsto W_t$ sont **continues partout, mais dérivables nulle part**.
> 3. Les accroissements sont indépendants : pour tout $0 \\le s < t$, $W_t - W_s$ est indépendant de $\\{W_u\\}_{u \\le s}$.
> 4. Les accroissements sont gaussiens et stationnaires :
>    $$W_t - W_s \\sim \\mathcal{N}(0, t - s)$$
> 
> **Variation Quadratique :** Sur $[0, T]$, la variation quadratique vérifie $[W]_T = T$ de manière déterministe (d'où la règle fondamentale du calcul d'Itô : $(dW_t)^2 = dt$).
        `,
        taskMarkdown: "Simulez $M = 5$ trajectoires d'un mouvement brownien sur l'horizon $T = 1.0$ an avec $N = 252$ pas de temps ($\\Delta t = T / N$). Générez les accroissements $\\Delta W = \\sqrt{\\Delta t} \\times Z$, puis appliquez la somme cumulée `np.cumsum` pour obtenir la matrice des trajectoires `W` de dimension $(M, N+1)$ démarrant à 0. Tracez les 5 trajectoires avec Matplotlib.",
        initialCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nM = 5\nN = 252\nT = 1.0\ndt = T / N\n\n# Simulez les trajectoires W de dimension (M, N+1) :\n",
        solutionCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nM = 5\nN = 252\nT = 1.0\ndt = T / N\ntemps = np.linspace(0, T, N + 1)\n\ndW = np.sqrt(dt) * np.random.randn(M, N)\nW = np.zeros((M, N + 1))\nW[:, 1:] = np.cumsum(dW, axis=1)\n\nplt.figure(figsize=(6, 3.5))\nfor i in range(M):\n    plt.plot(temps, W[i], lw=1.5, label=f'Trajectoire {i+1}')\nplt.axhline(0, color='black', ls='--', lw=1)\nplt.xlabel('Temps t (années)')\nplt.ylabel('W(t)')\nplt.title('Simulations du Mouvement Brownien Standard')\nplt.legend(loc='upper left', fontsize=8)\nplt.grid(True, alpha=0.3)\n\nprint(f'Moyenne finale : {np.mean(W[:, -1]):.4f}, Écart-type : {np.std(W[:, -1]):.4f}')",
        testPythonCode: "assert 'W' in globals()\nassert W.shape == (5, 253)\nassert np.all(W[:, 0] == 0.0)",
        hints: ["dW = np.sqrt(dt) * np.random.randn(M, N)", "W = np.zeros((M, N + 1))", "W[:, 1:] = np.cumsum(dW, axis=1)"],
        datasets: []
      },
      {
        id: "v2-py-19",
        title: "4. Mouvement Brownien Géométrique (GBM) Vectorisé",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Simulez les cours boursiers selon l'EDS de Black-Scholes avec la solution exacte d'Itô.",
        theoryMarkdown: `
### Le Modèle Canonique de Black-Scholes : Le GBM

> 💡 **Rappel fondamental : L'Équation Différentielle Stochastique (EDS)**
> 
> Les cours d'actifs financiers sont modélisés par un mouvement brownien géométrique :
> $$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$
> En appliquant le **lemme d'Itô** à la fonction $f(S_t) = \\ln(S_t)$ :
> $$d\\ln(S_t) = \\frac{1}{S_t} dS_t - \\frac{1}{2} \\frac{1}{S_t^2} (dS_t)^2 = \\left( \\mu - \\frac{1}{2}\\sigma^2 \\right) dt + \\sigma dW_t$$
> 
> En intégrant, on obtient la **solution analytique exacte** (sans biais de discrétisation) :
> $$S_t = S_0 \\exp\\left( \\left( \\mu - \\frac{1}{2}\\sigma^2 \\right) t + \\sigma W_t \\right)$$
> - Espérance : $\\mathbb{E}[S_t] = S_0 e^{\\mu t}$.
> - Les cours restent strictement positifs ($S_t > 0$).
        `,
        taskMarkdown: "Pour $S_0 = 100$, un drift $\\mu = 0.08$, une volatilité $\\sigma = 0.20$ et un horizon $T = 1.0$ an, simulez $N = 100\\,000$ cours terminaux `S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * np.random.randn(N))`. Calculez l'espérance empirique `esperance_empirique = float(np.mean(S_T))` et l'espérance théorique `esperance_theorique = float(S0 * np.exp(mu * T))`. Affichez les valeurs.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nmu = 0.08\nsigma = 0.20\nT = 1.0\nN = 100000\n\n# Simulez S_T selon la formule exacte du GBM :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nmu = 0.08\nsigma = 0.20\nT = 1.0\nN = 100000\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\n\nesperance_empirique = float(np.mean(S_T))\nesperance_theorique = float(S0 * np.exp(mu * T))\n\nprint(f'Espérance empirique : {esperance_empirique:.4f}')\nprint(f'Espérance théorique : {esperance_theorique:.4f}')\nprint(f'Erreur relative : {abs(esperance_empirique - esperance_theorique) / esperance_theorique:.4%}')",
        testPythonCode: "assert 'S_T' in globals()\nassert 'esperance_empirique' in globals()\nassert 'esperance_theorique' in globals()\nassert np.isclose(esperance_empirique, esperance_theorique, rtol=0.01)",
        hints: ["Z = np.random.randn(N)", "S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)", "esperance_empirique = float(np.mean(S_T))", "esperance_theorique = float(S0 * np.exp(mu * T))"],
        datasets: []
      },
      {
        id: "v2-py-20",
        title: "5. Pricing d'un Call Européen par Monte Carlo (Mesure Q)",
        category: "pricing",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Évaluez la prime d'une option d'achat européenne par espérance actualisée sous la mesure risque-neutre.",
        theoryMarkdown: `
### Évaluation Risque-Neutre et Absence d'Opportunité d'Arbitrage (AOA)

> 💡 **Le Premier Théorème Fondamental de l'Évaluation des Actifs**
> 
> En finance mathématique (Harrison & Kreps 1979), le prix de marché d'un produit dérivé de payoff $H(S_T)$ est égal à son espérance actualisée sous l'unique probabilité risque-neutre $\\mathbb{Q}$ :
> $$C_0 = e^{-rT} \\mathbb{E}^{\\mathbb{Q}}[\\max(S_T - K, 0)]$$
> où sous $\\mathbb{Q}$, le taux de dérive du sous-jacent est exactement le **taux sans risque $r$** (et non $\\mu$) :
> $$S_T = S_0 \\exp\\left( \\left( r - \\frac{1}{2}\\sigma^2 \\right) T + \\sigma \\sqrt{T} Z \\right), \\quad Z \\sim \\mathcal{N}(0, 1)$$
> 
> L'estimateur de Monte Carlo est la moyenne empirique actualisée :
> $$\\hat{C}_N = \\frac{e^{-rT}}{N} \\sum_{i=1}^N \\max(S_T^{(i)} - K, 0)$$
        `,
        taskMarkdown: "Pour $S_0 = 100$, strike $K = 100$, taux sans risque $r = 0.05$, volatilité $\\sigma = 0.20$, maturité $T = 1.0$ an et $N = 100\\,000$ simulations, calculez les cours finaux `S_T`, les payoffs `payoffs = np.maximum(S_T - K, 0.0)`, et le prix estimé de l'option `prix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))`. Affichez le prix estimé.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\nN = 100000\n\n# Calculez prix_call_mc par simulation de Monte Carlo :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\nN = 100000\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs = np.maximum(S_T - K, 0.0)\nprix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))\n\nprint(f'Prix estimé du Call Européen (Monte Carlo) : {prix_call_mc:.4f} €')",
        testPythonCode: "assert 'prix_call_mc' in globals()\nassert np.isclose(prix_call_mc, 10.45, atol=0.20)",
        hints: ["Z = np.random.randn(N)", "S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)", "payoffs = np.maximum(S_T - K, 0.0)", "prix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))"],
        datasets: []
      },
      {
        id: "v2-py-21",
        title: "6. Benchmark Analytique : Formule Fermée de Black-Scholes-Merton",
        category: "pricing",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Codez la formule fermée de Black-Scholes pour comparer le prix théorique exact au résultat Monte Carlo.",
        theoryMarkdown: `
### La Formule Fermée de Fischer Black & Myron Scholes (1973)

> 💡 **Rappel mathématique : La Solution Exacte**
> 
> Pour une option d'achat vanille européenne (Call) :
> $$C_{\\text{BS}} = S_0 \\Phi(d_1) - K e^{-rT} \\Phi(d_2)$$
> où $\\Phi$ est la fonction de répartition de la loi normale standard $\\mathcal{N}(0, 1)$ (\`scipy.stats.norm.cdf\`) :
> $$d_1 = \\frac{\\ln(S_0 / K) + \\left( r + \\frac{1}{2}\\sigma^2 \\right) T}{\\sigma \\sqrt{T}}$$
> $$d_2 = d_1 - \\sigma \\sqrt{T}$$
        `,
        taskMarkdown: "À partir des mêmes paramètres ($S_0=100, K=100, r=0.05, \\sigma=0.20, T=1.0$), implémentez le calcul analytique de `d1`, `d2`, et déterminez `prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))`. Affichez `prix_bs`.",
        initialCode: "import numpy as np\nfrom scipy.stats import norm\n\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\n\n# Calculez d1, d2 et le prix analytique Black-Scholes prix_bs :\n",
        solutionCode: "import numpy as np\nfrom scipy.stats import norm\n\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\n\nd1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))\nd2 = d1 - sigma * np.sqrt(T)\nprix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))\n\nprint(f'd1 : {d1:.4f}, d2 : {d2:.4f}')\nprint(f'Prix théorique exact de Black-Scholes : {prix_bs:.4f} €')",
        testPythonCode: "assert 'd1' in globals()\nassert 'd2' in globals()\nassert 'prix_bs' in globals()\nassert np.isclose(prix_bs, 10.4506, atol=1e-3)",
        hints: ["d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))", "d2 = d1 - sigma * np.sqrt(T)", "prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))"],
        datasets: []
      },
      {
        id: "v2-py-22",
        title: "7. Intervalle de Confiance et Vitesse de Convergence en O(1/sqrt(N))",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Quantifiez la précision de la méthode de Monte Carlo par le Théorème Central Limite (TCL).",
        theoryMarkdown: `
### Erreur Standard et Intervalle de Confiance de Monte Carlo

> 💡 **Rappel mathématique : La Vitesse de Convergence du TCL**
> 
> Soit $Y_i = e^{-rT} \\max(S_T^{(i)} - K, 0)$ les payoffs actualisés simulés.
> - **Variance empirique** : $s_N^2 = \\frac{1}{N-1} \\sum_{i=1}^N (Y_i - \\hat{C}_N)^2$.
> - **Erreur standard (Standard Error)** :
>   $$SE = \\frac{s_N}{\\sqrt{N}}$$
> 
> Par le Théorème Central Limite, pour $N$ grand, l'intervalle de confiance à **95%** de la vraie valeur est :
> $$IC_{95\\%} = \\left[ \\hat{C}_N - 1.96 \\cdot SE, \\; \\hat{C}_N + 1.96 \\cdot SE \\right]$$
> - Pour diviser l'erreur par 10, il faut multiplier $N$ par **100** !
        `,
        taskMarkdown: "Soit les payoffs actualisés simulés `payoffs_actualises`. Calculez la moyenne `prix_mc = float(np.mean(payoffs_actualises))`, l'écart-type `s_N = float(np.std(payoffs_actualises, ddof=1))`, l'erreur standard `se = float(s_N / np.sqrt(len(payoffs_actualises)))` et la demi-largeur de l'intervalle à 95% `demi_largeur = float(1.96 * se)`. Affichez l'intervalle.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs_actualises = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\n\n# Calculez prix_mc, se et demi_largeur :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs_actualises = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\n\nprix_mc = float(np.mean(payoffs_actualises))\ns_N = float(np.std(payoffs_actualises, ddof=1))\nse = float(s_N / np.sqrt(N))\ndemi_largeur = float(1.96 * se)\n\nprint(f'Prix Monte Carlo : {prix_mc:.4f} €')\nprint(f'Erreur Standard (SE) : {se:.5f} €')\nprint(f'Intervalle de Confiance à 95% : [{prix_mc - demi_largeur:.4f} €, {prix_mc + demi_largeur:.4f} €]')",
        testPythonCode: "assert 'prix_mc' in globals()\nassert 'se' in globals()\nassert 'demi_largeur' in globals()\nassert se > 0\nassert demi_largeur < 0.20",
        hints: ["prix_mc = float(np.mean(payoffs_actualises))", "s_N = float(np.std(payoffs_actualises, ddof=1))", "se = float(s_N / np.sqrt(N))", "demi_largeur = float(1.96 * se)"],
        datasets: []
      },
      {
        id: "v2-py-23",
        title: "8. Réduction de Variance I : Variables Antithétiques",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Doublez l'efficacité de vos calculs Monte Carlo en exploitant la symétrie de la loi normale standard.",
        theoryMarkdown: `
### Méthode des Variables Antithétiques (Antithetic Variates)

> 💡 **Rappel théorique : Exploiter la Corrélation Négative**
> 
> Si $Z \\sim \\mathcal{N}(0, 1)$, alors par symétrie axiale, $-Z \\sim \\mathcal{N}(0, 1)$.
> Pour chaque tirage gaussien $Z_i$, on génère simultanément :
> 1. La trajectoire directe avec $+Z_i \\implies Y_i^{(+)} = e^{-rT} \\max(S_T(Z_i) - K, 0)$
> 2. La trajectoire antithétique avec $-Z_i \\implies Y_i^{(-)} = e^{-rT} \\max(S_T(-Z_i) - K, 0)$
> 
> L'estimateur antithétique est la moyenne des paires appariées :
> $$\\bar{Y}_i = \\frac{Y_i^{(+)} + Y_i^{(-)}}{2}$$
> La variance de l'estimateur devient :
> $$\\operatorname{Var}(\\bar{Y}_i) = \\frac{1}{4} \\left( \\operatorname{Var}(Y^{(+)}) + \\operatorname{Var}(Y^{(-)}) + 2 \\operatorname{Cov}(Y^{(+)}, Y^{(-)}) \\right)$$
> Comme $S_T(Z)$ est une fonction croissante de $Z$, $\\operatorname{Cov}(Y^{(+)}, Y^{(-)}) < 0$, ce qui réduit drastiquement la variance !
        `,
        taskMarkdown: "Générez $N = 25\\,000$ tirages $Z$. Calculez les payoffs $Y_1$ (avec $Z$) et $Y_2$ (avec $-Z$). Formez l'estimateur antithétique `Y_anti = 0.5 * (Y1 + Y2)`. Calculez la variance standard `var_standard = float(np.var(Y1))` et la variance antithétique `var_anti = float(np.var(Y_anti))`, puis le ratio de réduction de variance `ratio_reduction = float(var_standard / var_anti)`. Affichez `ratio_reduction`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\n\n# Implémentez la méthode antithétique et calculez ratio_reduction :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\n\nZ = np.random.randn(N)\ndrift = (r - 0.5 * sigma**2) * T\nvol = sigma * np.sqrt(T)\n\nS_T1 = S0 * np.exp(drift + vol * Z)\nS_T2 = S0 * np.exp(drift - vol * Z)\n\nY1 = np.exp(-r * T) * np.maximum(S_T1 - K, 0.0)\nY2 = np.exp(-r * T) * np.maximum(S_T2 - K, 0.0)\n\nY_anti = 0.5 * (Y1 + Y2)\n\nvar_standard = float(np.var(Y1))\nvar_anti = float(np.var(Y_anti))\nratio_reduction = float(var_standard / var_anti)\n\nprint(f'Variance standard : {var_standard:.4f}')\nprint(f'Variance antithétique : {var_anti:.4f}')\nprint(f'Gain de réduction de variance : x{ratio_reduction:.2f}')",
        testPythonCode: "assert 'var_standard' in globals()\nassert 'var_anti' in globals()\nassert 'ratio_reduction' in globals()\nassert ratio_reduction > 1.5",
        hints: ["S_T1 = S0 * np.exp(drift + vol * Z)", "S_T2 = S0 * np.exp(drift - vol * Z)", "Y_anti = 0.5 * (Y1 + Y2)", "ratio_reduction = float(var_standard / var_anti)"],
        datasets: []
      },
      {
        id: "v2-py-24",
        title: "9. Réduction de Variance II : Variables de Contrôle",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Utilisez le cours terminal du sous-jacent (dont l'espérance est connue analytiquement) comme variable de contrôle.",
        theoryMarkdown: `
### Méthode des Variables de Contrôle (Control Variates)

> 💡 **Rappel théorique : Corriger l'erreur de simulation via une variable auxiliaire**
> 
> Soit $X$ la variable d'intérêt dont on cherche $\\mathbb{E}[X]$ (ex: le payoff actualisé du Call).
> Supposons qu'il existe une variable aléatoire $Y$ fortement corrélée à $X$, dont on connaît **analytiquement l'espérance exacte $\\mathbb{E}[Y]$**.
> *(Exemple : le cours sous-jacent actualisé $Y = e^{-rT} S_T$, dont l'espérance est exactement $S_0$ !)*
> 
> On construit le nouvel estimateur contrôlé :
> $$X^*(c) = X - c (Y - \\mathbb{E}[Y])$$
> - $\\mathbb{E}[X^*] = \\mathbb{E}[X]$ (l'estimateur reste rigoureusement sans biais !).
> - Le coefficient optimal qui minimise la variance est :
>   $$c^* = \\frac{\\operatorname{Cov}(X, Y)}{\\operatorname{Var}(Y)}$$
> - La variance minimale obtenue vérifie :
>   $$\\operatorname{Var}(X^*) = \\operatorname{Var}(X) \\left( 1 - \\rho_{XY}^2 \\right)$$
        `,
        taskMarkdown: "Soit $X$ les payoffs actualisés et $Y = e^{-rT} S_T$ avec $\\mathbb{E}[Y] = S_0$. Calculez $c^* = \\operatorname{Cov}(X, Y) / \\operatorname{Var}(Y)$, puis la série contrôlée `X_ctrl = X - c_star * (Y - S0)`. Calculez le prix contrôlé `prix_ctrl = float(np.mean(X_ctrl))` et le pourcentage de réduction de variance `pct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)`. Affichez `pct_gain`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\nX = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\nY = np.exp(-r * T) * S_T\n\n# Implémentez la variable de contrôle avec Y et S0 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\nX = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\nY = np.exp(-r * T) * S_T\n\ncov_mat = np.cov(X, Y)\nc_star = cov_mat[0, 1] / cov_mat[1, 1]\nX_ctrl = X - c_star * (Y - S0)\n\nprix_ctrl = float(np.mean(X_ctrl))\npct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)\n\nprint(f'Coefficient optimal c* : {c_star:.4f}')\nprint(f'Prix avec variable de contrôle : {prix_ctrl:.4f} €')\nprint(f'Réduction de variance obtenue : {pct_gain:.2f}%')",
        testPythonCode: "assert 'c_star' in globals()\nassert 'X_ctrl' in globals()\nassert 'pct_gain' in globals()\nassert pct_gain > 50.0\nassert np.isclose(prix_ctrl, 10.45, atol=0.10)",
        hints: ["cov_mat = np.cov(X, Y)", "c_star = cov_mat[0, 1] / cov_mat[1, 1]", "X_ctrl = X - c_star * (Y - S0)", "pct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)"],
        datasets: []
      },
      {
        id: "v2-py-25",
        title: "10. Pricing d'un Call Asiatique (Option Dépendante du Chemin)",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Évaluez une option asiatique dont le payoff dépend de la moyenne arithmétique continue des cours.",
        theoryMarkdown: `
### Les Options Exotiques Dépendantes du Chemin (Path-Dependent)

> 💡 **Rappel : Le Payoff Asiatique à Moyenne Arithmétique**
> 
> Contrairement aux options européennes vanilles qui ne dépendent que du cours terminal $S_T$, une **option asiatique** a un payoff indexé sur la moyenne arithmétique observée sur la durée de vie du contrat :
> $$\\bar{S} = \\frac{1}{M} \\sum_{k=1}^M S_{t_k}$$
> $$\\text{Payoff} = \\max(\\bar{S} - K, 0)$$
> 
> **Pourquoi Monte Carlo est indispensable ?**
> La somme de variables log-normales n'est pas log-normale. Il **n'existe aucune formule analytique fermée simple** pour le Call asiatique à moyenne arithmétique ! La simulation de Monte Carlo constitue la méthode de référence de toutes les banques d'investissement.
        `,
        taskMarkdown: "Simulez $M = 252$ pas de temps pour $N = 10\\,000$ trajectoires de GBM. Calculez pour chaque trajectoire la moyenne arithmétique des cours `S_mean = np.mean(S_paths, axis=1)`. Calculez le prix du Call asiatique `prix_asiatique = float(np.exp(-r * T) * np.mean(np.maximum(S_mean - K, 0.0)))`. Affichez `prix_asiatique`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\ndt = T / M\n\n# Simulez la matrice S_paths de dimension (N, M+1) et calculez prix_asiatique :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\ndt = T / M\n\nZ = np.random.randn(N, M)\ndrift = (r - 0.5 * sigma**2) * dt\nvol = sigma * np.sqrt(dt)\nlog_returns = drift + vol * Z\n\nlog_paths = np.zeros((N, M + 1))\nlog_paths[:, 1:] = np.cumsum(log_returns, axis=1)\nS_paths = S0 * np.exp(log_paths)\n\nS_mean = np.mean(S_paths, axis=1)\npayoffs_asiatiques = np.maximum(S_mean - K, 0.0)\nprix_asiatique = float(np.exp(-r * T) * np.mean(payoffs_asiatiques))\n\nprint(f'Prix du Call Asiatique à moyenne arithmétique : {prix_asiatique:.4f} €')\nprint('Note : Le prix asiatique est inférieur au Call vanille (10.45 €) car la moyenne réduit la volatilité effective.')",
        testPythonCode: "assert 'prix_asiatique' in globals()\nassert 'S_mean' in globals()\nassert 5.0 < prix_asiatique < 7.0",
        hints: ["S_paths = S0 * np.exp(log_paths)", "S_mean = np.mean(S_paths, axis=1)", "prix_asiatique = float(np.exp(-r * T) * np.mean(np.maximum(S_mean - K, 0.0)))"],
        datasets: []
      },
      {
        id: "v2-py-26",
        title: "11. Option Barrière Knock-Out (Down-and-Out Call)",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Simulez une option désactivable dès que le cours franchit une barrière inférieure B.",
        theoryMarkdown: `
### Les Options à Barrière : Clauses Knock-Out & Knock-In

> 💡 **Rappel conceptuel : Le Down-and-Out Call (DOC)**
> 
> Un Call Down-and-Out confère le droit d'acheter le sous-jacent à $K$ à maturité $T$, **à la condition expresse que le cours n'ait jamais touché ni franchi la barrière $B < S_0$** pendant toute la durée de vie du contrat :
> $$\\text{Payoff} = \\max(S_T - K, 0) \\times \\mathbb{I}_{\\left\\{ \\min_{0 \\le t \\le T} S_t > B \\right\\}}$$
> Dès que $S_t \\le B$, l'option s'éteint instantanément (*knock-out*) et son payoff devient nul.
        `,
        taskMarkdown: "À partir des trajectoires `S_paths` simulées ($S_0=100, K=100, B=85$), calculez le minimum de chaque trajectoire `S_min = np.min(S_paths, axis=1)`. Filtrez les trajectoires vivantes `actifs_vivants = (S_min > B)`. Calculez le prix de l'option barrière `prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants))` et le taux de survie `taux_survie = float(np.mean(actifs_vivants) * 100)`. Affichez les résultats.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, B, r, sigma, T = 100.0, 100.0, 85.0, 0.05, 0.20, 1.0\ndt = T / M\n\n# Simulez les chemins et déterminez prix_doc et taux_survie :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, B, r, sigma, T = 100.0, 100.0, 85.0, 0.05, 0.20, 1.0\ndt = T / M\n\nZ = np.random.randn(N, M)\nlog_inc = (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z\nlog_paths = np.zeros((N, M + 1))\nlog_paths[:, 1:] = np.cumsum(log_inc, axis=1)\nS_paths = S0 * np.exp(log_paths)\n\nS_min = np.min(S_paths, axis=1)\nactifs_vivants = (S_min > B)\npayoffs_doc = np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants\nprix_doc = float(np.exp(-r * T) * np.mean(payoffs_doc))\ntaux_survie = float(np.mean(actifs_vivants) * 100)\n\nprint(f'Prix du Down-and-Out Call (Barrière B={B}) : {prix_doc:.4f} €')\nprint(f'Taux de survie des contrats : {taux_survie:.2f}%')",
        testPythonCode: "assert 'prix_doc' in globals()\nassert 'taux_survie' in globals()\nassert prix_doc < 10.45\nassert 0 < taux_survie < 100",
        hints: ["S_min = np.min(S_paths, axis=1)", "actifs_vivants = (S_min > B)", "prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants))"],
        datasets: []
      },
      {
        id: "v2-py-27",
        title: "12. Modèle de Saut de Merton (Jump-Diffusion)",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Simulez les krachs et discontinuités de cours en superposant un processus de Poisson composé au mouvement brownien.",
        theoryMarkdown: `
### Modèle Jump-Diffusion de Robert Merton (1976)

> 💡 **Rappel théorique : Pourquoi le mouvement brownien pur ne suffit pas**
> 
> Les cours réels présentent des sauts instantanés imprévisibles lors des annonces de banques centrales ou crises de liquidité.
> L'EDS de Merton combine diffusion continue et sauts de Poisson :
> $$\\frac{dS_t}{S_{t^-}} = (\\mu - \\lambda \\kappa) dt + \\sigma dW_t + (Y - 1) dN_t$$
> - $N_t$ : processus de Poisson d'intensité $\\lambda$ (nombre moyen de sauts par an).
> - $\\ln(Y) \\sim \\mathcal{N}(\\mu_J, \\sigma_J^2)$ : amplitude aléatoire du saut multiplicateur $Y$.
> - $\\kappa = \\mathbb{E}[Y - 1] = e^{\\mu_J + \\frac{1}{2}\\sigma_J^2} - 1$ : compensation de dérive pour préserver la martingale.
        `,
        taskMarkdown: "Pour $N = 20\\,000$, simulez le nombre de sauts sur 1 an $k_i \\sim \\text{Poisson}(\\lambda = 0.75)$. Pour chaque saut, tirez $\\ln(Y) \\sim \\mathcal{N}(\\mu_J = -0.15, \\sigma_J^2 = 0.10^2)$. Calculez la composante de saut cumulée et déterminez les prix finaux `S_T_merton`. Calculez le Kurtosis `kurtosis_merton = float(np.mean(((S_T_merton - np.mean(S_T_merton))/np.std(S_T_merton))**4))`. Affichez le Kurtosis.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 20000\nS0, r, sigma, T = 100.0, 0.05, 0.15, 1.0\nlambda_jump = 0.75\nmu_J = -0.15\nsigma_J = 0.10\n\n# Simulez S_T_merton et calculez son Kurtosis :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 20000\nS0, r, sigma, T = 100.0, 0.05, 0.15, 1.0\nlambda_jump = 0.75\nmu_J = -0.15\nsigma_J = 0.10\n\nkappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0\ndrift_corr = (r - lambda_jump * kappa - 0.5 * sigma**2) * T\n\nZ = np.random.randn(N)\nnb_sauts = np.random.poisson(lambda_jump * T, N)\n\nsomme_sauts = np.zeros(N)\nfor i in range(N):\n    if nb_sauts[i] > 0:\n        somme_sauts[i] = np.sum(np.random.normal(mu_J, sigma_J, nb_sauts[i]))\n\nS_T_merton = S0 * np.exp(drift_corr + sigma * np.sqrt(T) * Z + somme_sauts)\nz_merton = (S_T_merton - np.mean(S_T_merton)) / np.std(S_T_merton)\nkurtosis_merton = float(np.mean(z_merton**4))\n\nprint(f'Kurtosis sous Merton Jump-Diffusion : {kurtosis_merton:.4f}')\nprint(f'Excès de Kurtosis (Queues épaisses) : {kurtosis_merton - 3.0:.4f}')",
        testPythonCode: "assert 'S_T_merton' in globals()\nassert 'kurtosis_merton' in globals()\nassert kurtosis_merton > 3.2",
        hints: ["kappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0", "nb_sauts = np.random.poisson(lambda_jump * T, N)", "S_T_merton = S0 * np.exp(drift_corr + sigma * np.sqrt(T) * Z + somme_sauts)"],
        datasets: []
      },
      {
        id: "v2-py-28",
        title: "13. Value-at-Risk de Portefeuille Non Linéaire par Full Revaluation",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Estimez la VaR d'un book composé d'actions et d'options par réévaluation complète Monte Carlo.",
        theoryMarkdown: `
### Full Revaluation Monte Carlo : Au-delà de l'Approximation Delta-Normale

> 💡 **Rappel : L'échec des approximations linéaires (Delta-Gamma)**
> 
> Pour un portefeuille détenant des instruments optionnels non linéaires :
> $$\\Delta V \\ne \\Delta \\times \\Delta S + \\frac{1}{2} \\Gamma \\times (\\Delta S)^2$$
> Lorsque les variations de marché $\\Delta S$ sont brutales, l'approximation polynomiale de Taylor sous-estime gravement les queues de distribution.
> 
> La seule méthode rigoureuse adoptée par les salles de marché est la **réévaluation complète (Full Revaluation)** :
> À chaque scénario simulé $\\mathbf{S}^{(i)}$, on recalcule la valeur exacte du portefeuille $V(\\mathbf{S}^{(i)})$ et on en déduit la distribution de pertes $L^{(i)} = V_0 - V(\\mathbf{S}^{(i)})$.
        `,
        taskMarkdown: "Soit un portefeuille composé de 10 actions ($S_0=100$) et de la vente à découvert de 10 Calls ($K=105, C_0=7.5$). Valeur initiale $V_0 = 10 \\times 100 - 10 \\times 7.5 = 925$ €. Pour $N = 25\\,000$ scénarios simulés de $S_T$, calculez $V_T = 10 \\times S_T - 10 \\times \\max(S_T - 105, 0)$, puis les pertes $L = V_0 - V_T$. Extrayez la `var_mc_99 = float(np.percentile(L, 99))`. Affichez `var_mc_99`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, T, r, sigma = 100.0, 105.0, 0.25, 0.04, 0.22\nV0 = 10.0 * S0 - 10.0 * 7.50\n\n# Simulez S_T, calculez V_T, les pertes L et la VaR 99% :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, T, r, sigma = 100.0, 105.0, 0.25, 0.04, 0.22\nV0 = 10.0 * S0 - 10.0 * 7.50\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\ncall_payoffs = np.maximum(S_T - K, 0.0)\nV_T = 10.0 * S_T - 10.0 * call_payoffs\npertes = V0 - V_T\n\nvar_mc_99 = float(np.percentile(pertes, 99))\n\nprint(f'Valeur initiale du portefeuille : {V0:.2f} €')\nprint(f'Value-at-Risk 99% (Full Revaluation) : {var_mc_99:.2f} €')\nprint(f'Perte maximale relative à 99% : {var_mc_99 / V0:.2%}')",
        testPythonCode: "assert 'var_mc_99' in globals()\nassert 'pertes' in globals()\nassert var_mc_99 > 150.0",
        hints: ["call_payoffs = np.maximum(S_T - K, 0.0)", "V_T = 10.0 * S_T - 10.0 * call_payoffs", "pertes = V0 - V_T", "var_mc_99 = float(np.percentile(pertes, 99))"],
        datasets: []
      },
      {
        id: "v2-py-29",
        title: "14. Modèle de Taux d'Intérêt Stochastiques de Vasicek",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Simulez le taux court instantané r(t) avec retour à la moyenne (Processus d'Ornstein-Uhlenbeck).",
        theoryMarkdown: `
### Modélisation des Taux : Le Modèle de Vasicek (1977)

> 💡 **Rappel théorique : La Force de Rappel vers la Moyenne**
> 
> Contrairement aux actions qui ont une tendance haussière continue, les taux d'intérêt sont régulés par les banques centrales et oscillent autour d'un niveau d'équilibre à long terme $\\theta$ :
> $$dr_t = \\kappa (\\theta - r_t) dt + \\sigma dW_t$$
> - $\\theta$ : niveau moyen d'équilibre à long terme.
> - $\\kappa > 0$ : vitesse de retour à la moyenne (*speed of mean reversion*).
> - $\\sigma$ : volatilité instantanée des taux courts.
> 
> **Schéma de Discrétisation d'Euler-Maruyama :**
> $$r_{t+\\Delta t} = r_t + \\kappa (\\theta - r_t) \\Delta t + \\sigma \\sqrt{\\Delta t} Z_t$$
        `,
        taskMarkdown: "Pour $r_0 = 0.01$, $\\theta = 0.035$, $\\kappa = 0.50$, $\\sigma = 0.015$, horizon $T = 5.0$ ans et $N = 500$ pas de temps, simulez $M = 100$ trajectoires de taux courts. Calculez la moyenne finale de tous les scénarios `moyenne_finale_taux = float(np.mean(r_paths[:, -1]))`. Tracez les 5 premières trajectoires et la ligne horizontale $\\theta$. Affichez `moyenne_finale_taux`.",
        initialCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nr0 = 0.01\ntheta = 0.035\nkappa = 0.50\nsigma = 0.015\nT = 5.0\nN = 500\ndt = T / N\nM = 100\n\n# Simulez r_paths de dimension (M, N+1) avec Euler-Maruyama :\n",
        solutionCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nr0 = 0.01\ntheta = 0.035\nkappa = 0.50\nsigma = 0.015\nT = 5.0\nN = 500\ndt = T / N\nM = 100\n\nr_paths = np.zeros((M, N + 1))\nr_paths[:, 0] = r0\n\nfor t in range(N):\n    Z = np.random.randn(M)\n    r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z\n\nmoyenne_finale_taux = float(np.mean(r_paths[:, -1]))\n\ntemps = np.linspace(0, T, N + 1)\nplt.figure(figsize=(6, 3.5))\nfor i in range(5):\n    plt.plot(temps, r_paths[i] * 100, lw=1.2, alpha=0.8)\nplt.axhline(theta * 100, color='#e11d48', ls='--', lw=2, label=f'Moyenne cible theta ({theta:.1%})')\nplt.xlabel('Horizon (années)')\nplt.ylabel('Taux court (%)')\nplt.title('Modèle de Taux de Vasicek (Ornstein-Uhlenbeck)')\nplt.legend()\nplt.grid(True, alpha=0.3)\n\nprint(f'Taux moyen final simulé à 5 ans : {moyenne_finale_taux:.4%}')\nprint(f'Niveau d équilibre théorique theta : {theta:.4%}')",
        testPythonCode: "assert 'r_paths' in globals()\nassert 'moyenne_finale_taux' in globals()\nassert np.isclose(moyenne_finale_taux, theta, atol=0.01)",
        hints: ["r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z", "moyenne_finale_taux = float(np.mean(r_paths[:, -1]))"],
        datasets: []
      },
      {
        id: "v2-py-30",
        title: "15. Stress-Testing Monte Carlo & Processus de Ruine de Lundberg",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Évaluez la probabilité de ruine d'une institution financière confrontée à des chocs de sinistralité stochastiques.",
        theoryMarkdown: `
### Théorie de la Ruine de Cramer-Lundberg & Solvabilité II

> 💡 **Rappel fondamental : Le Processus de Surplus d'une Compagnie**
> 
> Le capital de réserve $U_t$ d'une compagnie d'assurance ou institution financière évolue selon :
> $$U_t = u + c \\cdot t - \\sum_{i=1}^{N_t} X_i$$
> - $u > 0$ : capital initial de réserve.
> - $c > 0$ : flux continu d'encaissement de primes.
> - $N_t$ : processus de Poisson modélisant le nombre de sinistres majeurs survenus.
> - $X_i \\sim \\text{Exp}(\\lambda)$ ou Lognormale : charge financière aléatoire de chaque sinistre.
> 
> **La Probabilité Ultime de Ruine :**
> $$\\psi(u) = \\mathbb{P}(\\exists t > 0 : U_t < 0)$$
> L'exigence de capital réglementaire (SCR Solvabilité II) impose que la probabilité de faillite à 1 an soit strictement inférieure à **$0.5\\%$** (seuil de confiance 99.5%).
        `,
        taskMarkdown: "Soit $u = 500\\,000$ €, $c = 80\\,000$ €/an, intensité de sinistralité $\\lambda = 5$ sinistres/an, et coût moyen d'un sinistre $X_i \\sim \\text{Exp}(\\text{mean} = 15\\,000$ €). Pour $N = 10\\,000$ scénarios simulés sur 1 an, vérifiez si à un moment quelconque le capital $U$ devient négatif. Calculez la probabilité de ruine empirique `proba_ruine = float(np.mean(ruine_detectee))`. Affichez `proba_ruine`.",
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN_scenarios = 10000\nu = 500000.0\nc = 80000.0\nlambda_sin = 5.0\ncout_moyen = 15000.0\n\n# Simulez les scénarios et déterminez proba_ruine :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN_scenarios = 10000\nu = 500000.0\nc = 80000.0\nlambda_sin = 5.0\ncout_moyen = 15000.0\n\nnb_sinistres = np.random.poisson(lambda_sin, N_scenarios)\ncharge_totale = np.zeros(N_scenarios)\n\nfor i in range(N_scenarios):\n    if nb_sinistres[i] > 0:\n        charge_totale[i] = np.sum(np.random.exponential(cout_moyen, nb_sinistres[i]))\n\ncapital_fin = u + c - charge_totale\nruine_detectee = (capital_fin < 0)\nproba_ruine = float(np.mean(ruine_detectee))\n\nprint(f'Capital initial : {u:,.2f} €')\nprint(f'Charge moyenne annuelle des sinistres : {np.mean(charge_totale):,.2f} €')\nprint(f'Probabilité empirique de ruine : {proba_ruine:.4%}')\nprint(f'Conformité Solvabilité II (< 0.5%) : {proba_ruine < 0.005}')",
        testPythonCode: "assert 'proba_ruine' in globals()\nassert 'capital_fin' in globals()\nassert 0 <= proba_ruine < 0.05",
        hints: ["nb_sinistres = np.random.poisson(lambda_sin, N_scenarios)", "capital_fin = u + c - charge_totale", "proba_ruine = float(np.mean(capital_fin < 0))"],
        datasets: []
      },
    ]
  },
];
