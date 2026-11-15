# Curriculum Complet : Économétrie, SQL & Python pour l'ALM et le Pricing

## Architecture Pédagogique : Micro-Learning Itératif & Économétrie Appliquée

Ce curriculum est conçu pour un apprentissage pas-à-pas à haute intensité de pratique. Chaque chapitre suit la répartition stricte :
- **Théorie Économétrique / Actuarielle (10%)** : Définition mathématique en LaTeX, intuition financière/assurantielle.
- **Pratique Guidée (30%)** : 2 à 3 exercices simples de prise en main syntaxique directe.
- **Pratique Intermédiaire (40%)** : 4 à 5 exercices combinant les nouvelles notions avec les acquis précédents.
- **Cas Pratique ALM / Tarification (20%)** : 1 exercice de synthèse unissant préparation SQL et modélisation Python.

---

## Progression Marche par Marche de la Syntaxe

| Chapitre | Théorie Économétrique & Risque | Syntaxe SQL Pas-à-Pas | Syntaxe Python / Pandas / Statsmodels |
| :--- | :--- | :--- | :--- |
| **Ch. 1 : Statistique Descriptive & Filtrage Élémentaire** | Échantillon vs Population, Espérance $\mathbb{E}[X]$, Écart-type $\sigma$, Asymétrie des sinistres (Log-normale/Pareto), Taux de fréquence | `SELECT`, `AS`, `FROM`, `WHERE` (`=, <, >, BETWEEN, IN, LIKE`), `IS NULL`, `ORDER BY`, `LIMIT` | `pd.read_csv()`, `.shape`, `.head()`, `.info()`, `.describe()`, `df['col']`, filtrage booléen `df[...]`, `.isna().sum()`, `np.mean()`, `np.std()` |
| **Ch. 2 : Agrégation, Conditionnement & Nettoyage de Données** | Espérance conditionnelle $\mathbb{E}[Y\|X]$, Segmentation tarifaire, Détection des valeurs aberrantes (IQR Tukey), Loss Ratio brut ($S/P$) | `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`, `GROUP BY`, `HAVING`, `CASE WHEN ... THEN ... END`, `COALESCE()`, `ROUND()` | `df.groupby()`, `.agg()`, `.fillna()`, calcul IQR ($Q_3 - Q_1$), filtres d'outliers, création de colonnes ratio, tables de contingence |
| **Ch. 3 : Modèle Linéaire Multiple (MCO / OLS & Inférence)** | $Y = X\beta + \varepsilon$, Estimateur $\hat{\beta} = (X^TX)^{-1}X^TY$, Théorème de Gauss-Markov, $R^2$, Tests de Student ($t$-stat, p-valeurs) | `INNER JOIN`, `LEFT JOIN` (conservation des polices sans sinistre), `ON`, sous-requêtes `WHERE col IN (SELECT ...)` | `sm.add_constant()`, `sm.OLS(y, X).fit()`, `model.summary()`, `model.params`, `model.pvalues`, `model.resid`, `plt.scatter`, `plt.plot` |
| **Ch. 4 : Séries Temporelles Macro & Risque de Taux (ALM)** | Stationnarité, Racine unitaire (ADF), Autocorrélation (Durbin-Watson), Sensibilité courbe des taux (OAT vs Euribor), Value-at-Risk ($VaR$) | Fonctions de fenêtrage : `LAG()`, `LEAD()`, `OVER (PARTITION BY ... ORDER BY ...)` pour variations $\Delta r_t = r_t - r_{t-1}$ | `statsmodels.tsa.stattools.adfuller`, `.diff()`, matrice de corrélation, régression dynamique, calcul percentile $VaR_{99.5\%}$ |

---

## Détail des Modules & Volume des Micro-Exercices

### Chapitre 1 : Fondations Statistiques & Filtrage Élémentaire (25 micro-exercices)
- **Partie 1 : SQL Échauffement & Filtrage (Exercices 1.1 à 1.10)**
  - 1.1 `SELECT` simple et projection de colonnes de base.
  - 1.2 Alias de colonnes avec `AS`.
  - 1.3 Filtrage numérique de base (`WHERE prime_annuelle > 500`).
  - 1.4 Filtrage catégoriel (`WHERE region = 'IDF'`).
  - 1.5 Combinaison logique `AND` / `OR` sur les critères d'âge et de bonus.
  - 1.6 Recherche par intervalle `BETWEEN 25 AND 35`.
  - 1.7 Filtrage multi-valeurs avec `IN ('Citadine', 'Berline')`.
  - 1.8 Détection de données incomplètes avec `WHERE date_permis IS NULL`.
  - 1.9 Tri simple et multiple avec `ORDER BY prime_annuelle DESC, age ASC`.
  - 1.10 Restriction d'échantillon avec `LIMIT 10`.
- **Partie 2 : Python & Pandas Exploration (Exercices 1.11 à 1.20)**
  - 1.11 Chargement et dimensions : `pd.read_csv()` et `.shape`.
  - 1.12 Inspection des premières et dernières lignes : `.head(5)` et `.tail(5)`.
  - 1.13 Types de données et valeurs non nulles : `.info()`.
  - 1.14 Statistiques descriptives univariées : `.describe()`.
  - 1.15 Sélection de colonnes uniques et Séries : `df['cout_total']`.
  - 1.16 Masque booléen simple : `df[df['age'] < 25]`.
  - 1.17 Masque booléen composé : `df[(df['bonus'] < 0.6) & (df['prime'] > 800)]`.
  - 1.18 Détection des valeurs manquantes : `df.isna().sum()`.
  - 1.19 Calculs statistiques vectorisés NumPy : `np.mean()`, `np.std()`, `np.median()`.
  - 1.20 Calculs des quantiles de sinistralité : `np.quantile(..., [0.25, 0.50, 0.75, 0.95])`.
- **Partie 3 : Pratique Intermédiaire & Cas Pratique (Exercices 1.21 à 1.25)**
  - 1.21 SQL : Extraction des assurés à haut risque (jeune conducteur + malus + sportive).
  - 1.22 Python : Calcul de l'écart interquartile (IQR) sur les coûts de sinistres.
  - 1.23 Python : Détection de l'asymétrie (skewness) de la distribution des coûts.
  - 1.24 SQL : Sélection ordonnée des sinistres majeurs non indemnisés.
  - 1.25 Cas Pratique Synthèse : Filtrage d'une cohorte d'assurés en SQL, transfert en DataFrame Pandas, calcul du taux d'exposition et statistiques d'âge.

---

### Chapitre 2 : Agrégation, Conditionnement & Nettoyage (25 micro-exercices)
- **Partie 1 : SQL Agrégations & Groupements (Exercices 2.1 à 2.10)**
  - 2.1 Comptage global : `COUNT(*)` vs `COUNT(colonne)`.
  - 2.2 Somme et moyenne : `SUM(prime_annuelle)` et `AVG(prime_annuelle)`.
  - 2.3 Extrêmes : `MIN(cout_total)` et `MAX(cout_total)`.
  - 2.4 Groupement élémentaire : `GROUP BY region`.
  - 2.5 Multi-groupement : `GROUP BY region, type_vehicule`.
  - 2.6 Filtrage post-agrégation avec `HAVING COUNT(*) > 50`.
  - 2.7 Filtrage `HAVING AVG(prime_annuelle) > 750`.
  - 2.8 Conditionnel `CASE WHEN bonus_malus < 0.8 THEN 'Bon' ELSE 'Mauvais' END`.
  - 2.9 Imputation SQL de valeur par défaut : `COALESCE(cout_total, 0)`.
  - 2.10 Calcul du ratio Sinistres à Primes ($S/P$) au niveau portefeuille.
- **Partie 2 : Python GroupBy, Outliers & Nettoyage (Exercices 2.11 à 2.20)**
  - 2.11 Groupement simple : `df.groupby('region')['prime'].mean()`.
  - 2.12 Multi-agrégation : `df.groupby('type_vehicule').agg({'prime': ['mean', 'count']})`.
  - 2.13 Imputation de valeurs manquantes par la médiane : `.fillna(df['prime'].median())`.
  - 2.14 Suppression de lignes nulles aberrantes : `.dropna(subset=['police_id'])`.
  - 2.15 Détection des outliers par la règle des 3 sigmas : $|x - \mu| > 3\sigma$.
  - 2.16 Détection des outliers par l'intervalle interquartile de Tukey : $x > Q_3 + 1.5 \times IQR$.
  - 2.17 Écrêtement (*winsorization*) des sinistres exceptionnels.
  - 2.18 Création d'une variable indicatrice (Dummy) : `(df['age'] < 25).astype(int)`.
  - 2.19 Normalisation Min-Max des variables de prime.
  - 2.20 Calcul des fréquences de sinistres par segment conducteur.
- **Partie 3 : Pratique Intermédiaire & Cas Pratique (Exercices 2.21 à 2.25)**
  - 2.21 SQL : Matrice de tarification par segment d'âge et bonus-malus.
  - 2.22 Python : Nettoyage d'une table polluée d'assurés (outliers, valeurs négatives).
  - 2.23 SQL : Calcul du $S/P$ par région avec exclusion des fraudes présumées.
  - 2.24 Python : Calcul de la sévérité moyenne après écrêtement des sinistres extrêmes.
  - 2.25 Cas Pratique Synthèse : Nettoyage complet SQL/Pandas de la sinistralité d'une flotte automobile et calcul des primes pures segmentées.

---

### Chapitre 3 : Modèle Linéaire Multiple & MCO (25 micro-exercices)
- **Partie 1 : SQL Jointures & Réconciliation (Exercices 3.1 à 3.10)**
  - 3.1 `INNER JOIN` de base entre `assures` et `sinistres`.
  - 3.2 `LEFT JOIN` et explication du maintien des polices sans sinistre.
  - 3.3 Comptage distinct d'assurés avec et sans réclamation.
  - 3.4 Jointure avec filtrage temporel sur la date de survenance.
  - 3.5 Jointure multi-tables : `assures`, `sinistres`, et `macro_taux`.
  - 3.6 Sous-requête scalaire dans le `SELECT`.
  - 3.7 Sous-requête filtrante avec `WHERE police_id IN (...)`.
  - 3.8 Sous-requête corrélée avec `EXISTS`.
  - 3.9 Agrégation pré-jointure via CTE (`WITH sinistres_agg AS (...)`).
  - 3.10 Création de la table aplatie d'entraînement économétrique.
- **Partie 2 : Python Statsmodels & Régression OLS (Exercices 3.11 à 3.20)**
  - 3.11 Ajout de la constante : `sm.add_constant(X)`.
  - 3.12 Régression linéaire simple : $Y = \beta_0 + \beta_1 X + \varepsilon$.
  - 3.13 Lecture du résumé économétrique : `model.summary()`.
  - 3.14 Extraction et interprétation de $\hat{\beta}$ : `model.params`.
  - 3.15 Test de Student individuel : $t$-statistiques et p-valeurs `model.pvalues`.
  - 3.16 Qualité d'ajustement globale : $R^2$ et $R^2$ ajusté.
  - 3.17 Régression linéaire multiple (taux souverain 10 ans vs Euribor 3M + inflation).
  - 3.18 Extraction du vecteur des résidus $e_i = y_i - \hat{y}_i$ : `model.resid`.
  - 3.19 Calcul de la variance résiduelle $\hat{\sigma}^2 = \frac{e^Te}{n - k - 1}$.
  - 3.20 Tracé de la droite de régression et des points observés avec Matplotlib.
- **Partie 3 : Pratique Intermédiaire & Cas Pratique (Exercices 3.21 à 3.25)**
  - 3.21 SQL : Jointure entre table macroéconomique et sinistres pour corrélation.
  - 3.22 Python : Régression de la prime facturée sur l'âge, le bonus et la puissance fiscale.
  - 3.23 Python : Test de multicolinéarité via le VIF (Variance Inflation Factor).
  - 3.24 Python : Visualisation de l'hétéroscédasticité par nuage de résidus vs valeurs ajustées.
  - 3.25 Cas Pratique Synthèse : Modèle OLS complet de tarification ALM expliquant le spread de crédit d'entreprises selon les taux sans risque et la croissance.

---

### Chapitre 4 : Séries Temporelles Macro & Risque de Taux (25 micro-exercices)
- **Partie 1 : SQL Fonctions de Fenêtrage (Window Functions) (Exercices 4.1 à 4.10)**
  - 4.1 Notion de fenêtre : `OVER ()` vide.
  - 4.2 Décalage temporel passé : `LAG(euribor_3m, 1) OVER (ORDER BY date)`.
  - 4.3 Décalage futur : `LEAD(oat_10y, 1) OVER (ORDER BY date)`.
  - 4.4 Calcul de variation absolue : $r_t - r_{t-1}$.
  - 4.5 Calcul de taux de croissance trimestriel : $\frac{x_t - x_{t-1}}{x_{t-1}} \times 100$.
  - 4.6 Moyenne mobile sur 4 trimestres : `AVG(inflation) OVER (ORDER BY date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)`.
  - 4.7 Somme cumulée temporelle : `SUM(cout) OVER (PARTITION BY annee ORDER BY date)`.
  - 4.8 Classement avec `RANK()` vs `DENSE_RANK()`.
  - 4.9 Partitionnement par classe d'actifs et classement de volatilité.
  - 4.10 Requête complète de préparation de panel temporel.
- **Partie 2 : Python Séries Temporelles & Diagnostics (Exercices 4.11 à 4.20)**
  - 4.11 Indexation temporelle et fréquence : `pd.to_datetime()`, `set_index()`.
  - 4.12 Différenciation d'ordre 1 : `df['oat_diff'] = df['oat_10y'].diff()`.
  - 4.13 Test de stationnarité Dickey-Fuller Augmenté (ADF) : `adfuller()`.
  - 4.14 Test d'autocorrélation des résidus : Statistique de Durbin-Watson.
  - 4.15 Modèle autorégressif simple $AR(1)$ avec Statsmodels.
  - 4.16 Test d'hétéroscédasticité de Breusch-Pagan / White.
  - 4.17 Correction robuste des erreurs standards (White HC1 / Newey-West HAC).
  - 4.18 Estimation de la Value-at-Risk ($VaR_{99.5\%}$) par méthode historique.
  - 4.19 Estimation de la $VaR_{99.5\%}$ paramétrique normale : $\mu - 2.576 \times \sigma$.
  - 4.20 Tracé de l'éventail de prévision et corridor de confiance à 95% avec Matplotlib.
- **Partie 3 : Pratique Intermédiaire & Cas Pratique (Exercices 4.21 à 4.25)**
  - 4.21 SQL : Détection des chocs de taux supérieurs à 50 bps par `LAG`.
  - 4.22 Python : Régression dynamique des taux avec correction Newey-West.
  - 4.23 Python : Backtesting de la Value-at-Risk sur un portefeuille obligataire.
  - 4.24 Python : Graphique QQ-plot et test de normalité de Jarque-Bera.
  - 4.25 Cas Pratique Synthèse : Stress-test ALM Solvabilité II croisant extraction de flux futurs en SQL et calcul de perte maximale en Python.

---

## Bilan du Curriculum
- **Total de chapitres** : 4 chapitres majeurs couvrant l'intégralité du spectre (statistiques descriptives $\to$ séries temporelles & inférence MCO).
- **Total de micro-exercices** : **100 micro-exercices progressifs**, accompagnés de données réalistes, d'indices débloquants et de corrigés pas-à-pas avec explication de la syntaxe.
- **Jeux de données générés** : 4 fichiers de données réalistes avec valeurs manquantes et outliers dans `scripts/` et `public/data/`.
