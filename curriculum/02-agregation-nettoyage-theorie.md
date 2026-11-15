# Chapitre 2 : Agrégation, Conditionnement & Nettoyage de Données

## 1. Cadre Théorique Économétrique & Actuariel

### 1.1 L'Espérance Conditionnelle et la Segmentation Tarifaire
En tarification actuarielle, la segmentation consiste à estimer l'espérance conditionnelle du coût de sinistre sachant les caractéristiques observables du risque :

$$\mathbb{E}[Y \mid X = x] = \int y \, f(y \mid x) \, dy$$

- $Y$ : la variable d'intérêt (ex : coût total ou nombre de sinistres).
- $X$ : le vecteur des variables de segmentation (ex : région, catégorie de véhicule, profil conducteur).

### 1.2 Détection et Traitement des Valeurs Aberrantes (*Outliers*)
Les bases de données assurantielles comportent fréquemment des anomalies de saisie (coûts négatifs dus à des annulations de provisions mal répertoriées) ou des sinistres industriels extrêmes.
- **Règle des 3 sigmas** (sous hypothèse gaussienne) :
  $$\text{Outlier si } |x_i - \bar{x}| > 3s$$
- **Règle robuste de Tukey (Intervalle Interquartile)** :
  $$\text{Borne inférieure} = Q_1 - 1.5 \times IQR, \quad \text{Borne supérieure} = Q_3 + 1.5 \times IQR$$
  avec $IQR = Q_3 - Q_1$.
- **Écrêtement (*Winsorization*)** : Remplacer toute valeur supérieure au seuil $S$ par la valeur $S$ pour stabiliser la variance lors de l'estimation tarifaire.

### 1.3 Le Loss Ratio Brut ($S/P$)
$$S/P_{\text{segment}} = \frac{\sum_{i \in \text{segment}} \text{Sinistres}_i}{\sum_{i \in \text{segment}} \text{Primes}_i}$$

---

## 2. Syntaxe SQL Pas-à-Pas (Agrégations & Groupements)

### 2.1 Fonctions d'Agrégation
```sql
SELECT 
    COUNT(*) AS total_lignes,
    COUNT(cout_sinistre) AS nb_sinistres_renseignes,
    SUM(cout_sinistre) AS charge_totale,
    AVG(cout_sinistre) AS severite_moyenne,
    MIN(cout_sinistre) AS cout_minimum,
    MAX(cout_sinistre) AS cout_maximum
FROM sinistres;
```

### 2.2 Clauses `GROUP BY` et `HAVING`
- `GROUP BY` segmente la population selon une ou plusieurs dimensions.
- `HAVING` filtre **après** le calcul de l'agrégation (alors que `WHERE` filtre les lignes élémentaires **avant** groupement).
```sql
SELECT region, COUNT(*) AS nb, AVG(cout_sinistre) AS cout_moyen
FROM sinistres
WHERE cout_sinistre > 0
GROUP BY region
HAVING COUNT(*) >= 10;
```

### 2.3 Conditionnement SQL (`CASE WHEN` & `COALESCE`)
```sql
-- Catégorisation conditionnelle
SELECT 
    police_id,
    CASE 
        WHEN prime_police > 2000 THEN 'Haut de gamme'
        WHEN prime_police BETWEEN 1000 AND 2000 THEN 'Standard'
        ELSE 'Économique'
    END AS segment_prix,
    COALESCE(cout_sinistre, 0.0) AS cout_impute
FROM sinistres;
```

---

## 3. Syntaxe Python / Pandas Pas-à-Pas

### 3.1 Groupements et Multi-Agrégations
```python
import pandas as pd

df = pd.read_csv('public/data/ch2_sinistralite_flotte.csv')

# Agrégation simple
cout_par_region = df.groupby('region')['cout_sinistre'].mean()

# Multi-agrégation avancée avec dictionnaire
synthese = df.groupby('categorie_flotte').agg({
    'sinistre_id': 'count',
    'cout_sinistre': ['sum', 'mean', 'max'],
    'prime_police': 'sum'
})
```

### 3.2 Nettoyage et Imputation
```python
# Remplacement des valeurs manquantes par la médiane
mediane_cout = df['cout_sinistre'].median()
df['cout_sinistre_impute'] = df['cout_sinistre'].fillna(mediane_cout)

# Suppression des valeurs négatives impossibles
df_propre = df[df['cout_sinistre'] >= 0]
```

### 3.3 Détection et Filtrage IQR des Outliers
```python
Q1 = df_propre['cout_sinistre'].quantile(0.25)
Q3 = df_propre['cout_sinistre'].quantile(0.75)
IQR = Q3 - Q1
borne_sup = Q3 + 1.5 * IQR

# Masque des valeurs conformes
df_sans_outliers = df_propre[df_propre['cout_sinistre'] <= borne_sup]
```
