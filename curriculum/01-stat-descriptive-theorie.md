# Chapitre 1 : Statistique Descriptive & Filtrage Élémentaire

## 1. Cadre Théorique Économétrique & Actuariel

### 1.1 Population, Échantillon et Mesures de Tendance Centrale
Soit une variable aléatoire $X$ représentant une grandeur financière ou actuarielle (ex : prime d'assurance, âge du souscripteur, montant d'un sinistre) observée sur un échantillon de taille $n$ : $\{x_1, x_2, \dots, x_n\}$.

- **Espérance empirique (Moyenne)** :
  $$\bar{x} = \frac{1}{n} \sum_{i=1}^n x_i$$
- **Variance et Écart-Type empiriques** :
  $$s^2 = \frac{1}{n - 1} \sum_{i=1}^n (x_i - \bar{x})^2, \quad s = \sqrt{s^2}$$
- **Médiane et Quantiles** :
  La médiane $Q_2 = q_{0.50}$ sépare l'échantillon trié en deux moitiés égales. Le quantile $q_{\alpha}$ vérifie $P(X \le q_{\alpha}) = \alpha$.
  En assurance, le $95^{\text{ème}}$ ou $99.5^{\text{ème}}$ percentile mesure l'exposition aux événements extrêmes (fondement de la Value-at-Risk).

### 1.2 Asymétrie des Sinistres (Lois Log-Normale et Pareto)
Contrairement aux distributions gaussiennes symétriques, les charges de sinistres d'assurance automobile présentent une asymétrie droite prononcée (*positive skewness*) :
- Un grand nombre de sinistres de faible montant (bris de glace, petits accrochages urbains).
- Une minorité de sinistres très coûteux (sinistres corporels graves, incendies) qui pèsent lourdement sur la variance.

---

## 2. Syntaxe SQL Pas-à-Pas (Filtrage Atomique)

### 2.1 Projection et Sélection
```sql
-- 1. Sélection de colonnes spécifiques avec renommage
SELECT police_id, age, prime_annuelle AS prime_nette
FROM assures;
```

### 2.2 Filtrage par Conditions Élémentaires (`WHERE`)
```sql
-- 2. Opérateurs de comparaison (=, >, <, >=, <=, <>)
WHERE prime_annuelle > 800.00

-- 3. Conditions composées avec AND et OR
WHERE age < 25 AND bonus_malus > 1.00

-- 4. Intervalles continus avec BETWEEN
WHERE age BETWEEN 25 AND 35

-- 5. Listes discrètes avec IN
WHERE type_vehicule IN ('Citadine', 'Berline')

-- 6. Détection des valeurs manquantes
WHERE bonus_malus IS NULL
```

### 2.3 Tri et Échantillonnage
```sql
-- 7. Tri ascendant (défaut) ou descendant
ORDER BY prime_annuelle DESC, age ASC

-- 8. Restriction du nombre de lignes retournées
LIMIT 10;
```

---

## 3. Syntaxe Python / Pandas Pas-à-Pas

### 3.1 Chargement et Inspection
```python
import pandas as pd
import numpy as np

# Lecture du fichier CSV généré
df = pd.read_csv('public/data/ch1_portefeuille_assures.csv')

# Dimensions (lignes, colonnes)
print(df.shape)

# Aperçu des 5 premières lignes
print(df.head(5))

# Types et décompte des valeurs non nulles
print(df.info())

# Statistiques descriptives univariées
print(df.describe())
```

### 3.2 Indexation et Masques Booléens
```python
# Sélection d'une Série
ages = df['age']

# Filtrage booléen simple
jeunes = df[df['age'] < 25]

# Filtrage booléen composé (& pour AND, | pour OR)
risques_eleves = df[(df['age'] < 25) & (df['bonus_malus'] > 1.00)]

# Détection des valeurs manquantes
valeurs_nulles = df.isna().sum()
```

### 3.3 Calculs Statistiques Vectorisés (NumPy)
```python
# Moyenne et écart-type
mu = np.mean(df['prime_annuelle'].dropna())
sigma = np.std(df['prime_annuelle'].dropna(), ddof=1)

# Quantiles (25%, 50%, 75%, 95%)
quantiles = np.quantile(df['cout_total_sinistres'].dropna(), [0.25, 0.50, 0.75, 0.95])
```
