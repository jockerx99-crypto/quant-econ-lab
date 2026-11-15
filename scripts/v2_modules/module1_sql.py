"""
Module 1 Version 2 : SQL Avancé & Data Engineering Financier (15 exercices)
"""

MODULE_1 = {
    "id": "sql-quant",
    "title": "SQL Avancé & Data Engineering Financier",
    "subtitle": "Du Calcul des Rendements aux Window Functions & Arbres Stochastiques",
    "icon": "Database",
    "description": "Maîtrisez les techniques avancées de manipulation et modélisation de séries financières en SQL : log-rendements, volatilité glissante, maximum drawdown, ASOF joins et CTEs récursives.",
    "exercises": [
        {
            "id": "v2-sql-1",
            "title": "1. Log-Rendements Journaliers (LAG & LN)",
            "category": "data_engineering",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 6,
            "description": "Calculez le rendement logarithmique journalier de l'action TotalEnergies (TTE).",
            "theoryMarkdown": """### Log-Rendements et Additivité Temporelle en Finance

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
> ```sql
> LAG(valeur, 1) OVER (PARTITION BY ticker ORDER BY date ASC)
> ```
> `LAG(colonne, 1)` permet d'accéder à la valeur de la ligne immédiatement précédente dans l'ordre chronologique.
""",
            "taskMarkdown": "Sélectionnez `date`, `prix_cloture` et calculez `rendement_log` défini comme `LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date))` depuis la table `marche_actions` pour le ticker `'TTE'`. Triez par `date` croissante.",
            "initialCode": "-- Calculez le log-rendement journalier de TTE :\n",
            "solutionCode": "SELECT date, prix_cloture, LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
            "validationQuery": "SELECT date, prix_cloture, LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
            "hints": ["Utilisez LN(prix_cloture / LAG(prix_cloture, 1) OVER (ORDER BY date)) AS rendement_log", "N'oubliez pas le filtre WHERE ticker = 'TTE'."],
            "datasets": []
        },
        {
            "id": "v2-sql-2",
            "title": "2. Volatilité Glissante sur Fenêtre Mobile (ROWS BETWEEN)",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Calculez la volatilité glissante des rendements sur une fenêtre de 3 séances pour BNP Paribas.",
            "theoryMarkdown": """### Volatilité Empirique et Cadre de Fenêtrage SQL

> 💡 **Rappel conceptuel : Volatilité et Racine Carrée du Temps**
> 
> La volatilité journalière $\\sigma_{\\text{jour}}$ mesure la dispersion des rendements autour de leur espérance :
> $$\\sigma = \\sqrt{\\frac{1}{N-1} \\sum_{t=1}^N (r_t - \\bar{r})^2}$$
> Pour annualiser une volatilité journalière, on applique la règle de la racine carrée du temps (issue du mouvement brownien où $\\operatorname{Var}(W_t) = t$) :
> $$\\sigma_{\\text{annuelle}} = \\sigma_{\\text{jour}} \\times \\sqrt{252}$$
> *(252 étant le nombre conventionnel de jours de cotation ouverts par an).*

> 📌 **Spécification de la Fenêtre Mobile SQL :**
> ```sql
> OVER (
>   ORDER BY date
>   ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
> )
> ```
> Cette clause inclut la ligne courante et les 2 lignes antérieures, soit une fenêtre glissante de 3 séances.
""",
            "taskMarkdown": "Pour le ticker `'BNP'`, sélectionnez `date`, `rendement_journalier` et calculez la moyenne glissante `moyenne_mobile_3j` des rendements sur la fenêtre mobile des 3 dernières séances (`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`). Triez par `date`.",
            "initialCode": "-- Calculez la moyenne mobile des rendements sur 3 jours pour BNP :\n",
            "solutionCode": "SELECT date, rendement_journalier, AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j FROM marche_actions WHERE ticker = 'BNP' ORDER BY date;",
            "validationQuery": "SELECT date, rendement_journalier, AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moyenne_mobile_3j FROM marche_actions WHERE ticker = 'BNP' ORDER BY date;",
            "hints": ["Utilisez AVG(rendement_journalier) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)"],
            "datasets": []
        },
        {
            "id": "v2-sql-3",
            "title": "3. Détection de Signal Golden Cross (Moyennes Mobiles Croisées)",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Identifiez les configurations de surperformance technique en comparant les moyennes rapides et lentes.",
            "theoryMarkdown": """### Analyse Technique Quantitative : Le Golden Cross

> 💡 **Rappel : Croisement de Moyennes Mobiles (Moving Average Crossover)**
> 
> En trading algorithmique et gestion quantitative de tendance (*Trend Following*), la comparaison de deux moyennes mobiles d'horizons distincts constitue un signal classique :
> - **Moyenne rapide (ex: 2 séances)** : capture la dynamique immédiate des cours.
> - **Moyenne lente (ex: 4 séances)** : filtre le bruit micro-structurel de marché.
> 
> - **Golden Cross (Signal d'achat)** : La moyenne rapide passe au-dessus de la moyenne lente ($SMA_{\\text{rapide}} > SMA_{\\text{lente}}$).
> - **Death Cross (Signal de vente)** : La moyenne rapide passe en-dessous ($SMA_{\\text{rapide}} < SMA_{\\text{lente}}$).
""",
            "taskMarkdown": "Pour le ticker `'MC'` (LVMH), calculez `sma_2` (moyenne sur 2 séances : `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW`) et `sma_4` (moyenne sur 4 séances : `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW`) de `prix_cloture`. Ajoutez une colonne `signal` valant `'ACHAT'` si `sma_2 >= sma_4` sinon `'ATTENTE'`. Triez par `date`.",
            "initialCode": "-- Écrivez la requête du signal de croisement :\n",
            "solutionCode": "SELECT date, prix_cloture, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4, CASE WHEN AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) >= AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) THEN 'ACHAT' ELSE 'ATTENTE' END AS signal FROM marche_actions WHERE ticker = 'MC' ORDER BY date;",
            "validationQuery": "SELECT date, prix_cloture, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS sma_2, AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS sma_4, CASE WHEN AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) >= AVG(prix_cloture) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) THEN 'ACHAT' ELSE 'ATTENTE' END AS signal FROM marche_actions WHERE ticker = 'MC' ORDER BY date;",
            "hints": ["Utilisez un CASE WHEN ... THEN 'ACHAT' ELSE 'ATTENTE' END.", "Les moyennes se calculent avec AVG(prix_cloture) OVER (...)."],
            "datasets": []
        },
        {
            "id": "v2-sql-4",
            "title": "4. Maximum Drawdown Cumulatif (Running Peak & Drawdown)",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Calculez le plus haut historique glissant et le drawdown journalier en pourcentage.",
            "theoryMarkdown": """### Mesure Asymétrique du Risque : Le Maximum Drawdown (MDD)

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
""",
            "taskMarkdown": "Pour le ticker `'TTE'`, sélectionnez `date`, `prix_cloture`, le plus haut historique `sommet_cumule` défini par `MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`, et le `drawdown_pct` calculé par `((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100`. Triez par `date`.",
            "initialCode": "-- Calculez le sommet cumulé et le drawdown en pourcentage :\n",
            "solutionCode": "SELECT date, prix_cloture, MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule, ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
            "validationQuery": "SELECT date, prix_cloture, MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sommet_cumule, ((prix_cloture - MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) * 100 AS drawdown_pct FROM marche_actions WHERE ticker = 'TTE' ORDER BY date;",
            "hints": ["MAX(prix_cloture) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) donne le plus haut historique."],
            "datasets": []
        },
        {
            "id": "v2-sql-5",
            "title": "5. Ranking & Segmentation par Quantiles (NTILE & DENSE_RANK)",
            "category": "data_engineering",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 6,
            "description": "Classez les actifs par rendement pour la séance du 2024-01-02 en 2 groupes de performance.",
            "theoryMarkdown": """### Segmentation Factorielle et Construction de Paniers Long/Short

> 💡 **Rappel : Les fonctions de classement NTILE et RANK**
> 
> En finance quantitative, pour construire des portefeuilles factoriels (ex: Momentum, Low Volatility), on partitionne l'univers d'investissement à chaque date en quantiles :
> - `NTILE(k)` : répartit les lignes de manière équilibrée en $k$ compartiments (buckets).
> - `DENSE_RANK()` : attribue un rang séquentiel sans saut d'entier en cas d'ex æquo.

> 📊 **Sens Financier :**
> - **Top bucket ($Q_k$)** : panier d'actifs à acheter (*Long*).
> - **Bottom bucket ($Q_1$)** : panier d'actifs à vendre à découvert (*Short*).
""",
            "taskMarkdown": "Pour la date `'2024-01-02'`, sélectionnez `ticker`, `nom_societe`, `rendement_journalier`, et partitionnez les actifs en 2 groupes avec `NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf`. Triez par `rendement_journalier` décroissant.",
            "initialCode": "-- Segmentez les titres en 2 buckets de performance :\n",
            "solutionCode": "SELECT ticker, nom_societe, rendement_journalier, NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf FROM marche_actions WHERE date = '2024-01-02' ORDER BY rendement_journalier DESC;",
            "validationQuery": "SELECT ticker, nom_societe, rendement_journalier, NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf FROM marche_actions WHERE date = '2024-01-02' ORDER BY rendement_journalier DESC;",
            "hints": ["Utilisez NTILE(2) OVER (ORDER BY rendement_journalier DESC) AS groupe_perf."],
            "datasets": []
        },
        {
            "id": "v2-sql-6",
            "title": "6. Jointure Temporelle Asynchrone (ASOF Join / Forward-Fill)",
            "category": "data_engineering",
            "language": "sql",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Associez à chaque séance de bourse la dernière valeur connue de la courbe des taux souverains OAT.",
            "theoryMarkdown": """### Le Problème Canonique des Séries Temporelles Asynchrones

> 💡 **Rappel théorique : ASOF Join (As-Of Join)**
> 
> Sur les marchés financiers, les flux de données arrivent à des fréquences hétérogènes :
> - Les cours d'actions cotent en continu ou quotidiennement (ex: `2024-01-02`).
> - Les taux directeurs, les statistiques macroéconomiques ou les courbes de taux souverains sont publiés à dates fixes ou mensuelles (ex: `2023-12-31`).
> 
> Une jointure exacte `ON a.date = b.date` renverrait zéro correspondance !
> La solution est un **ASOF Join** : associer à chaque enregistrement d'action la valeur la plus récente disponible dans la table macro ($t_{\\text{macro}} \\le t_{\\text{action}}$), selon le principe du *Last Observation Carried Forward (LOCF)*.
""",
            "taskMarkdown": "Pour les cotations de `'AI'` en janvier 2024, sélectionnez `m.date`, `m.ticker`, `m.prix_cloture` et associez via une sous-requête corrélée la dernière valeur connue du taux souverain 10 ans `(SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y`. Triez par `m.date`.",
            "initialCode": "-- Effectuez la jointure temporelle asynchrone (LOCF) :\n",
            "solutionCode": "SELECT m.date, m.ticker, m.prix_cloture, (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y FROM marche_actions m WHERE m.ticker = 'AI' ORDER BY m.date;",
            "validationQuery": "SELECT m.date, m.ticker, m.prix_cloture, (SELECT taux_10y FROM courbe_taux_oat WHERE date <= m.date ORDER BY date DESC LIMIT 1) AS dernier_taux_10y FROM marche_actions m WHERE m.ticker = 'AI' ORDER BY m.date;",
            "hints": ["Utilisez une sous-requête scalaire dans le SELECT avec WHERE date <= m.date ORDER BY date DESC LIMIT 1."],
            "datasets": []
        },
        {
            "id": "v2-sql-7",
            "title": "7. Matrice de Transition Crédit (Chaîne de Markov en SQL)",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Comptez et calculez les corrélations bilatérales pour identifier les actifs hautement corrélés (> 0.50).",
            "theoryMarkdown": """### Filtrage des Corrélations Élevées et Risque Systémique

> 💡 **Rappel conceptuel : Le Coefficient de Corrélation de Pearson**
> 
> Soit deux actifs financiers $X$ et $Y$. Le coefficient de corrélation linéaire $\\rho_{X,Y}$ est normalisé dans $[-1, 1]$ :
> $$\\rho_{X,Y} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$$
> - $\\rho = 1$ : corrélation positive parfaite (aucun gain de diversification).
> - $\\rho = 0$ : indépendance linéaire.
> - $\\rho = -1$ : couverture parfaite (*perfect hedge*).

> 📊 **Sens en Gestion de Portefeuille :**
> Deux actifs ayant $\\rho > 0.50$ partagent une forte exposition aux mêmes facteurs macroéconomiques. Les identifier permet d'éviter la fausse diversification.
""",
            "taskMarkdown": "À partir de la table `matrice_correlations`, sélectionnez `actif_a`, `actif_b` et `correlation` pour toutes les paires distinctes (`actif_a != actif_b`) dont la corrélation est strictement supérieure à `0.50`. Triez par `correlation` décroissante.",
            "initialCode": "-- Isolez les paires d'actifs fortement corrélées :\n",
            "solutionCode": "SELECT actif_a, actif_b, correlation FROM matrice_correlations WHERE actif_a != actif_b AND correlation > 0.50 ORDER BY correlation DESC;",
            "validationQuery": "SELECT actif_a, actif_b, correlation FROM matrice_correlations WHERE actif_a != actif_b AND correlation > 0.50 ORDER BY correlation DESC;",
            "hints": ["WHERE actif_a != actif_b AND correlation > 0.50", "ORDER BY correlation DESC"],
            "datasets": []
        },
        {
            "id": "v2-sql-8",
            "title": "8. Arbre Binomial de Cox-Ross-Rubinstein (CTE Récursive)",
            "category": "pricing",
            "language": "sql",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Générez la structure d'un arbre stochastique à 3 pas de temps en utilisant une CTE récursive.",
            "theoryMarkdown": """### Modélisation Stochastique Discrète : Le Modèle CRR en SQL

> 💡 **Rappel théorique : L'arbre binomial de Cox-Ross-Rubinstein (1979)**
> 
> À chaque pas de temps discret $n \\in \\{0, 1, 2, \\dots, N\\}$, le cours du sous-jacent $S_0$ peut monter avec le multiplicateur $u$ ou baisser avec $d$ :
> $$u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u} = e^{-\\sigma \\sqrt{\\Delta t}}$$
> Après $n$ pas de temps et $j$ hausses ($0 \\le j \\le n$), le prix au nœud $(n, j)$ vaut :
> $$S_{n,j} = S_0 \\times u^j \\times d^{n-j}$$

> 📌 **Puissance des CTE Récursives (`WITH RECURSIVE`) en SQL :**
> Permet d'itérer mathématiquement sans boucle procédurale pour construire des structures arborescentes ou des graphes stochastiques.
""",
            "taskMarkdown": "Écrivez une requête récursive générant les pas de temps `n` de 0 à 3 et calculant le cours théorique pour $S_0 = 100$ et un facteur multiplicatif $u = 1.05$ (supposons $d = 0.9524$), où `prix = 100.0 * POWER(1.05, n)`. La table doit comporter `n` et `prix`. Triez par `n` croissant.",
            "initialCode": "-- Construisez la trajectoire géométrique avec WITH RECURSIVE :\n",
            "solutionCode": "WITH RECURSIVE arbre(n, prix) AS (SELECT 0, 100.0 UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3) SELECT n, prix FROM arbre ORDER BY n;",
            "validationQuery": "WITH RECURSIVE arbre(n, prix) AS (SELECT 0, 100.0 UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3) SELECT n, prix FROM arbre ORDER BY n;",
            "hints": ["Démarrez avec SELECT 0, 100.0", "UNION ALL SELECT n + 1, prix * 1.05 FROM arbre WHERE n < 3"],
            "datasets": []
        },
        {
            "id": "v2-sql-9",
            "title": "9. Détection des Anomalies de Marché par Z-Score",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Détectez les séances où le volume échangé a dépassé de 20% la moyenne globale du ticker.",
            "theoryMarkdown": """### Détection des Pics de Volume et Chocs d'Information

> 💡 **Rappel théorique : Anomalies de Liquidité & Flash Events**
> 
> Les mouvements brutaux sur les cours de bourse sont quasi systématiquement accompagnés de **pics anormaux de volume** (*Volume Spikes*).
> Les quants surveillent le ratio :
> $$\\text{Volume Ratio}_t = \\frac{\\text{Volume}_t}{\\overline{\\text{Volume}}}$$
> Un ratio sensiblement supérieur à $1.0$ signale l'intervention d'investisseurs institutionnels (*Smart Money*) ou la publication de résultats d'entreprises.
""",
            "taskMarkdown": "Sélectionnez `date`, `ticker`, `volume`, et la moyenne du volume par ticker `AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen`. Filtrez les lignes où le volume dépasse 1.15 fois (`> 1.15 *`) cette moyenne par ticker via une sous-requête. Triez par `date`.",
            "initialCode": "-- Isolez les séances de fort pic de volume :\n",
            "solutionCode": "SELECT date, ticker, volume, vol_moyen FROM (SELECT date, ticker, volume, AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen ORDER BY date;",
            "validationQuery": "SELECT date, ticker, volume, vol_moyen FROM (SELECT date, ticker, volume, AVG(volume) OVER (PARTITION BY ticker) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen ORDER BY date;",
            "hints": ["Enveloppez la fenêtre dans une sous-requête : FROM (SELECT ..., AVG(volume) OVER (...) AS vol_moyen FROM marche_actions) WHERE volume > 1.15 * vol_moyen"],
            "datasets": []
        },
        {
            "id": "v2-sql-10",
            "title": "10. Ratio Rendement/Risque (Sharpe) & Classement ESG",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Débutant",
            "durationMinutes": 6,
            "description": "Filtrez et classez les actifs de portefeuille combinant performance financière et responsabilité extra-financière.",
            "theoryMarkdown": """### Investissement Socialement Responsable (ISR) & Performance Ajustée du Risque

> 💡 **Rappel conceptuel : Le Ratio de Sharpe**
> 
> Développé par William Sharpe (Prix Nobel 1990), le ratio de Sharpe mesure l'excédent de rentabilité par unité de risque total :
> $$SR = \\frac{\\mathbb{E}[R] - r_f}{\\sigma}$$
> - $SR > 0.3$ : Performance acceptable.
> - $SR > 0.5$ : Bonne performance corrigée de la volatilité.

> 📊 **Sens Métier :**
> L'intégration des critères ESG (Environnement, Social, Gouvernance) permet de réduire les risques de réputation et de transition climatique sans nécessairement dégrader le ratio de Sharpe.
""",
            "taskMarkdown": "À partir de `portefeuilles_actifs`, sélectionnez `ticker`, `nom`, `rendement_espere`, `volatilite`, `ratio_sharpe`, et `score_esg`. Filtrez les actifs ayant un `score_esg >= 80` et un `ratio_sharpe >= 0.30`. Triez par `ratio_sharpe` décroissant.",
            "initialCode": "-- Filtrez les actifs selon les critères Sharpe et ESG :\n",
            "solutionCode": "SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg FROM portefeuilles_actifs WHERE score_esg >= 80 AND ratio_sharpe >= 0.30 ORDER BY ratio_sharpe DESC;",
            "validationQuery": "SELECT ticker, nom, rendement_espere, volatilite, ratio_sharpe, score_esg FROM portefeuilles_actifs WHERE score_esg >= 80 AND ratio_sharpe >= 0.30 ORDER BY ratio_sharpe DESC;",
            "hints": ["WHERE score_esg >= 80 AND ratio_sharpe >= 0.30", "ORDER BY ratio_sharpe DESC"],
            "datasets": []
        },
        {
            "id": "v2-sql-11",
            "title": "11. Valeur Quotidienne d'un Portefeuille Pondéré (60/40)",
            "category": "pricing",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Calculez la valeur historique d'un portefeuille allouant 60% à LVMH (MC) et 40% à TotalEnergies (TTE).",
            "theoryMarkdown": """### Allocation d'Actifs Canonique : Le Portefeuille 60/40

> 💡 **Rappel : Valorisation d'un Portefeuille Multi-Actifs**
> 
> Soit $K$ actifs de prix $P_{i,t}$ détenus en quantités $q_i$. La valeur liquidative du portefeuille est :
> $$V_t = \\sum_{i=1}^K q_i P_{i,t}$$
> Si l'on normalise la valeur initiale à $V_0 = 100$ avec des poids initiaux $w_i$ ($w_1 = 0.60, w_2 = 0.40$), le cours indiciel base 100 évolue selon :
> $$V_t = 100 \\times \\left( w_1 \\frac{P_{1,t}}{P_{1,0}} + w_2 \\frac{P_{2,t}}{P_{2,0}} \\right)$$
""",
            "taskMarkdown": "Pour les dates communes entre `'MC'` et `'TTE'`, joignez les deux séries et calculez `valeur_portefeuille` définie par `0.60 * m.prix_cloture + 0.40 * t.prix_cloture`. Sélectionnez `m.date`, `m.prix_cloture AS prix_mc`, `t.prix_cloture AS prix_tte`, et `valeur_portefeuille`. Triez par `m.date`.",
            "initialCode": "-- Calculez la valeur quotidienne du panier 60/40 :\n",
            "solutionCode": "SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte, (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille FROM marche_actions m JOIN marche_actions t ON m.date = t.date WHERE m.ticker = 'MC' AND t.ticker = 'TTE' ORDER BY m.date;",
            "validationQuery": "SELECT m.date, m.prix_cloture AS prix_mc, t.prix_cloture AS prix_tte, (0.60 * m.prix_cloture + 0.40 * t.prix_cloture) AS valeur_portefeuille FROM marche_actions m JOIN marche_actions t ON m.date = t.date WHERE m.ticker = 'MC' AND t.ticker = 'TTE' ORDER BY m.date;",
            "hints": ["Faites un JOIN de marche_actions avec elle-même sur m.date = t.date", "Filtrez WHERE m.ticker = 'MC' AND t.ticker = 'TTE'."],
            "datasets": []
        },
        {
            "id": "v2-sql-12",
            "title": "12. Covariance Empirique en SQL (Somme des Co-Produits)",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Calculez la covariance empirique exacte entre les rendements de BNP et TTE en SQL.",
            "theoryMarkdown": """### Calcul Distribué de la Covariance en Base de Données

> 💡 **Rappel mathématique : Formulation de la Covariance**
> 
> La covariance empirique entre deux séries $X$ et $Y$ observées sur $T$ dates s'écrit :
> $$\\operatorname{Cov}(X, Y) = \\frac{1}{T-1} \\sum_{t=1}^T (X_t - \\bar{X})(Y_t - \\bar{Y}) = \\frac{T}{T-1} \\left( \\frac{1}{T} \\sum X_t Y_t - \\bar{X}\\bar{Y} \\right)$$
> 
> En Data Engineering moderne, pré-calculer les covariances directement dans le Data Warehouse (Snowflake, BigQuery, ClickHouse) évite de rapatrier des gigaoctets de données brutes vers l'interpréteur Python.
""",
            "taskMarkdown": "À partir des rendements journaliers de `'BNP'` et `'TTE'` appariés par `date`, calculez `AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier) AS cov_estimee`.",
            "initialCode": "-- Calculez la covariance empirique en SQL :\n",
            "solutionCode": "SELECT (AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee FROM marche_actions b JOIN marche_actions t ON b.date = t.date WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';",
            "validationQuery": "SELECT (AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier)) AS cov_estimee FROM marche_actions b JOIN marche_actions t ON b.date = t.date WHERE b.ticker = 'BNP' AND t.ticker = 'TTE';",
            "hints": ["Utilisez AVG(b.rendement_journalier * t.rendement_journalier) - AVG(b.rendement_journalier) * AVG(t.rendement_journalier) AS cov_estimee"],
            "datasets": []
        },
        {
            "id": "v2-sql-13",
            "title": "13. Optimisation de Requêtes : EXPLAIN QUERY PLAN",
            "category": "data_engineering",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 6,
            "description": "Inspectez le plan d'exécution du moteur SQL pour analyser comment les index sont exploités.",
            "theoryMarkdown": """### Performance et Indexation B-Tree en Base de Données

> 💡 **Rappel : Comment le moteur SQL résout-il vos requêtes ?**
> 
> L'instruction `EXPLAIN QUERY PLAN` expose la stratégie choisie par l'optimiseur de coût du moteur relationnel :
> - **SCAN TABLE** : Parcours séquentiel intégral de la table en $\\mathcal{O}(N)$ (très lent sur des millions de lignes).
> - **SEARCH TABLE USING INDEX** : Recherche logarithmique dans un arbre équilibré B-Tree en $\\mathcal{O}(\\log N)$.
> - **SEARCH TABLE USING PRIMARY KEY** : Accès direct en temps quasi-constant.
""",
            "taskMarkdown": "Préfixez la requête de sélection `SELECT * FROM marche_actions WHERE id = 5;` par `EXPLAIN QUERY PLAN` pour afficher le détail de l'accès indexé.",
            "initialCode": "-- Affichez le plan d'exécution :\n",
            "solutionCode": "EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
            "validationQuery": "EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;",
            "hints": ["Écrivez simplement : EXPLAIN QUERY PLAN SELECT * FROM marche_actions WHERE id = 5;"],
            "datasets": []
        },
        {
            "id": "v2-sql-14",
            "title": "14. Backtesting d'une Stratégie de Tendance en Pur SQL",
            "category": "financial_econometrics",
            "language": "sql",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Simulez le gain d'une règle systématique : acheter si le rendement d'hier était positif, vendre sinon.",
            "theoryMarkdown": """### Backtest Relationnel : Du Signal au PnL Journalier

> 💡 **Rappel méthodologique : Pas de Look-Ahead Bias !**
> 
> En finance quantitative, une erreur fatale fréquente est le **biais d'anticipation** (*Look-Ahead Bias*), consistant à utiliser l'information de l'instant $t$ pour prendre une décision applicable à l'instant $t$.
> - La position $pos_t \\in \\{+1, -1\\}$ prise à la clôture de $t-1$ ne produit ses effets que sur le rendement de la séance suivante $r_t$ :
>   $$PnL_t = pos_{t-1} \\times r_t$$
> 
> En SQL, cela se formalise rigoureusement par `LAG(signal, 1) OVER (ORDER BY date) * rendement_journalier`.
""",
            "taskMarkdown": "Pour le ticker `'CW8'`, sélectionnez `date`, `rendement_journalier`, le signal d'hier `LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier`, et le PnL journalier associé. Triez par `date`.",
            "initialCode": "-- Calculez le PnL de la stratégie de momentum retardée d'un jour :\n",
            "solutionCode": "SELECT date, rendement_journalier, LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier, (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;",
            "validationQuery": "SELECT date, rendement_journalier, LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) AS position_hier, (LAG(CASE WHEN rendement_journalier > 0 THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) * rendement_journalier) AS pnl_journalier FROM marche_actions WHERE ticker = 'CW8' ORDER BY date;",
            "hints": ["Utilisez LAG(CASE WHEN ... THEN 1 ELSE -1 END, 1) OVER (ORDER BY date) pour la position d'hier."],
            "datasets": []
        },
        {
            "id": "v2-sql-15",
            "title": "15. Consolidation Multi-Devises & Agrégats Hiérarchiques",
            "category": "data_engineering",
            "language": "sql",
            "difficulty": "Intermédiaire",
            "durationMinutes": 6,
            "description": "Produisez un reporting consolidé par secteur d'activité de l'exposition globale et du bêta moyen pondéré.",
            "theoryMarkdown": """### Agrégation et Consolidation des Portefeuilles Institutionnels

> 💡 **Rappel : Le Bêta Moyen Pondéré du Portefeuille**
> 
> Le bêta global $\\beta_p$ d'un portefeuille multi-sectoriel est la moyenne pondérée des bêtas individuels :
> $$\\beta_p = \\sum_{i=1}^K w_i \\beta_i$$
> Ce reporting est indispensable pour les comités d'allocation afin de vérifier le respect des limites de risque de marché.
""",
            "taskMarkdown": "À partir de `portefeuilles_actifs`, regroupez par `secteur` et calculez le nombre d'actifs `nb_actifs`, le rendement espéré moyen `rendement_moyen`, et le bêta moyen `beta_moyen`. Triez par `secteur` alphabétique.",
            "initialCode": "-- Générez le rapport consolidé par secteur :\n",
            "solutionCode": "SELECT secteur, COUNT(*) AS nb_actifs, AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen FROM portefeuilles_actifs GROUP BY secteur ORDER BY secteur;",
            "validationQuery": "SELECT secteur, COUNT(*) AS nb_actifs, AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen FROM portefeuilles_actifs GROUP BY secteur ORDER BY secteur;",
            "hints": ["GROUP BY secteur ORDER BY secteur", "AVG(rendement_espere) AS rendement_moyen, AVG(beta_marche) AS beta_moyen"],
            "datasets": []
        }
    ]
}
