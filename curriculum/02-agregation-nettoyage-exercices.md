# Chapitre 2 : 25 Micro-Exercices d'Agrégation & Nettoyage

Jeu de données utilisé : `ch2_sinistralite_flotte.csv` (table SQL `sinistres_flotte`).
Colonnes : `sinistre_id`, `police_id`, `categorie_flotte`, `region`, `nature_sinistre`, `cout_sinistre`, `prime_police`, `responsabilite_pct`.

---

### Exercice 2.1 (SQL) : Décompte Global vs Décompte Non-Nul
- **Énoncé** : Calculez le nombre total de lignes de la table et le nombre de lignes où `cout_sinistre` est renseigné (non nul).
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `COUNT(*)` compte les lignes, `COUNT(colonne)` ignore les valeurs `NULL`.
- **Corrigé** :
```sql
SELECT 
    COUNT(*) AS total_enregistrements,
    COUNT(cout_sinistre) AS total_couts_non_nuls
FROM sinistres_flotte;
```
*Explication* : La différence entre les deux révèle immédiatement le nombre de valeurs manquantes.

---

### Exercice 2.2 (SQL) : Somme et Moyenne de Charge
- **Énoncé** : Calculez la charge totale et le coût moyen des sinistres enregistrés (arrondis à 2 décimales).
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `ROUND(SUM(...), 2)` et `ROUND(AVG(...), 2)`.
- **Corrigé** :
```sql
SELECT 
    ROUND(SUM(cout_sinistre), 2) AS charge_totale,
    ROUND(AVG(cout_sinistre), 2) AS cout_moyen
FROM sinistres_flotte;
```
*Explication* : `AVG()` omet nativement les `NULL` du calcul du dénominateur.

---

### Exercice 2.3 (SQL) : Extrêmes et Écart Absolu
- **Énoncé** : Déterminez le sinistre le plus faible (`MIN`) et le sinistre le plus coûteux (`MAX`).
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `MIN(cout_sinistre)`, `MAX(cout_sinistre)`.
- **Corrigé** :
```sql
SELECT 
    MIN(cout_sinistre) AS sinistre_min,
    MAX(cout_sinistre) AS sinistre_max
FROM sinistres_flotte;
```
*Explication* : Met en évidence des anomalies éventuelles (ex: présence d'une valeur négative ou d'un pic géant).

---

### Exercice 2.4 (SQL) : Groupement Élémentaire par Région
- **Énoncé** : Calculez le nombre de sinistres et le coût moyen par `region`.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `GROUP BY region`.
- **Corrigé** :
```sql
SELECT 
    region,
    COUNT(*) AS nb_sinistres,
    ROUND(AVG(cout_sinistre), 2) AS cout_moyen
FROM sinistres_flotte
GROUP BY region;
```
*Explication* : Permet de comparer la sinistralité moyenne géographique.

---

### Exercice 2.5 (SQL) : Multi-Groupement Croisé
- **Énoncé** : Affichez la charge totale de sinistres ventilée par `region` ET par `categorie_flotte`.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `GROUP BY region, categorie_flotte`.
- **Corrigé** :
```sql
SELECT 
    region,
    categorie_flotte,
    COUNT(*) AS nb_sinistres,
    ROUND(SUM(cout_sinistre), 2) AS charge_totale
FROM sinistres_flotte
GROUP BY region, categorie_flotte;
```
*Explication* : Crée une matrice bidimensionnelle d'agrégation actuarielle.

---

### Exercice 2.6 (SQL) : Filtrage Post-Agrégation avec HAVING
- **Énoncé** : Affichez uniquement les régions ayant enregistré strictement plus de 100 sinistres.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `HAVING COUNT(*) > 100`.
- **Corrigé** :
```sql
SELECT 
    region,
    COUNT(*) AS nb_sinistres
FROM sinistres_flotte
GROUP BY region
HAVING COUNT(*) > 100;
```
*Explication* : `HAVING` évalue la condition sur le résultat agrégé de chaque groupe.

---

### Exercice 2.7 (SQL) : Double Filtrage (WHERE + HAVING)
- **Énoncé** : En ne retenant que les sinistres de nature `'Collision'`, affichez les catégories de flotte ayant un coût moyen supérieur à 2 000 €.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `WHERE nature_sinistre = 'Collision'` puis `HAVING AVG(cout_sinistre) > 2000`.
- **Corrigé** :
```sql
SELECT 
    categorie_flotte,
    COUNT(*) AS nb_collisions,
    ROUND(AVG(cout_sinistre), 2) AS cout_moyen_collision
FROM sinistres_flotte
WHERE nature_sinistre = 'Collision'
GROUP BY categorie_flotte
HAVING AVG(cout_sinistre) > 2000;
```
*Explication* : `WHERE` élimine les autres natures avant le calcul, puis `HAVING` sélectionne les catégories lourdes.

---

### Exercice 2.8 (SQL) : Conditionnement CASE WHEN
- **Énoncé** : Catégorisez la sévérité des sinistres : `'Mineur'` si < 1 000 €, `'Moyen'` entre 1 000 € et 10 000 €, `'Majeur'` si > 10 000 €, et comptez le volume dans chaque classe.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `CASE WHEN ... THEN ... ELSE ... END`.
- **Corrigé** :
```sql
SELECT 
    CASE 
        WHEN cout_sinistre < 1000 THEN 'Mineur'
        WHEN cout_sinistre <= 10000 THEN 'Moyen'
        ELSE 'Majeur'
    END AS classe_severite,
    COUNT(*) AS nb_dossiers,
    ROUND(SUM(cout_sinistre), 2) AS charge_classe
FROM sinistres_flotte
WHERE cout_sinistre IS NOT NULL
GROUP BY classe_severite;
```
*Explication* : Crée une segmentation discrète sur une variable continue pour la réassurance.

---

### Exercice 2.9 (SQL) : Imputation avec COALESCE
- **Énoncé** : Remplir les coûts de sinistres manquants (`NULL`) par la valeur forfaitaire conventionnelle `0.00`.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `COALESCE(cout_sinistre, 0.00)`.
- **Corrigé** :
```sql
SELECT 
    sinistre_id,
    COALESCE(cout_sinistre, 0.00) AS cout_rectifie
FROM sinistres_flotte
ORDER BY sinistre_id
LIMIT 10;
```
*Explication* : `COALESCE` retourne le premier argument non nul.

---

### Exercice 2.10 (SQL) : Calcul du Loss Ratio Brut ($S/P$)
- **Énoncé** : Calculez le ratio global Sinistre à Prime ($S/P$) de la flotte en pourcentage : $\frac{\sum \text{cout}}{\sum \text{prime}} \times 100$.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `ROUND(SUM(cout_sinistre) / SUM(prime_police) * 100, 2)`.
- **Corrigé** :
```sql
SELECT 
    ROUND(SUM(COALESCE(cout_sinistre, 0)) / SUM(prime_police) * 100, 2) AS loss_ratio_pct
FROM sinistres_flotte
WHERE cout_sinistre >= 0;
```
*Explication* : Indicateur clé de rentabilité technique de la branche.

---

### Exercice 2.11 (Python) : GroupBy Simple Pandas
- **Énoncé** : Calculez la prime moyenne encaissée par `categorie_flotte`.
- **Setup** : `df = pd.read_csv('public/data/ch2_sinistralite_flotte.csv')`.
- **Indice** : `df.groupby('categorie_flotte')['prime_police'].mean()`.
- **Corrigé** :
```python
import pandas as pd
df = pd.read_csv('public/data/ch2_sinistralite_flotte.csv')
prime_moy = df.groupby('categorie_flotte')['prime_police'].mean()
print(prime_moy.round(2))
```
*Explication* : Opération split-apply-combine fondamentale en analyse de données.

---

### Exercice 2.12 (Python) : Multi-Agrégation avec .agg()
- **Énoncé** : Pour chaque `region`, calculez le nombre de sinistres, le coût moyen et le coût maximal.
- **Setup** : DataFrame `df`.
- **Indice** : `.agg(['count', 'mean', 'max'])`.
- **Corrigé** :
```python
stats_region = df.groupby('region')['cout_sinistre'].agg(['count', 'mean', 'max'])
print(stats_region.round(2))
```
*Explication* : `.agg()` permet de générer plusieurs métriques d'un seul coup.

---

### Exercice 2.13 (Python) : Imputation par la Médiane
- **Énoncé** : Remplir les valeurs manquantes de `cout_sinistre` par la médiane de la variable.
- **Setup** : DataFrame `df`.
- **Indice** : `df['cout_sinistre'].fillna(df['cout_sinistre'].median())`.
- **Corrigé** :
```python
med = df['cout_sinistre'].median()
df['cout_impute'] = df['cout_sinistre'].fillna(med)
print("Nombre de nuls restants :", df['cout_impute'].isna().sum())
```
*Explication* : L'imputation médiane est robuste aux outliers contrairement à la moyenne.

---

### Exercice 2.14 (Python) : Nettoyage des Valeurs Négatives Invalides
- **Énoncé** : Supprimez les lignes où `cout_sinistre` est strictement négatif (erreur de saisie).
- **Setup** : DataFrame `df`.
- **Indice** : Conserver `df[df['cout_sinistre'] >= 0]`.
- **Corrigé** :
```python
df_valide = df[df['cout_sinistre'] >= 0]
print(f"Lignes avant : {len(df)} | Lignes après : {len(df_valide)}")
```
*Explication* : Élimine les anomalies évidentes avant toute modélisation financière.

---

### Exercice 2.15 (Python) : Détection d'Outliers par Règle 3-Sigma
- **Énoncé** : Identifiez les sinistres situés à plus de 3 écarts-types de la moyenne.
- **Setup** : Série `cout = df_valide['cout_sinistre'].dropna()`.
- **Indice** : `np.abs(cout - cout.mean()) > 3 * cout.std()`.
- **Corrigé** :
```python
import numpy as np
cout = df_valide['cout_sinistre'].dropna()
outliers_3sigma = cout[np.abs(cout - cout.mean()) > 3 * cout.std()]
print(f"Nombre d'outliers 3-sigma : {len(outliers_3sigma)}")
print(outliers_3sigma)
```
*Explication* : Méthode classique de contrôle qualité statistique.

---

### Exercice 2.16 (Python) : Règle Robuste de Tukey (IQR)
- **Énoncé** : Calculez le seuil haut de Tukey $Q_3 + 1.5 \times IQR$ et filtrez les sinistres extrêmes.
- **Setup** : Série `cout`.
- **Indice** : `q75 + 1.5 * (q75 - q25)`.
- **Corrigé** :
```python
q25 = cout.quantile(0.25)
q75 = cout.quantile(0.75)
iqr = q75 - q25
seuil_haut = q75 + 1.5 * iqr
outliers_tukey = cout[cout > seuil_haut]
print(f"Seuil haut IQR : {seuil_haut:.2f} € | Outliers détectés : {len(outliers_tukey)}")
```
*Explication* : Règle non paramétrique idéale pour les lois asymétriques en assurance.

---

### Exercice 2.17 (Python) : Écrêtement (Winsorization)
- **Énoncé** : Créez une variable `cout_ecrete` plafonnant tout sinistre au 95ème percentile.
- **Setup** : DataFrame `df_valide`.
- **Indice** : Utilisez `.clip(upper=seuil_95)`.
- **Corrigé** :
```python
p95 = df_valide['cout_sinistre'].quantile(0.95)
df_valide['cout_ecrete'] = df_valide['cout_sinistre'].clip(upper=p95)
print(f"Plafond p95 : {p95:.2f} €")
print(f"Coût max avant écrêtement : {df_valide['cout_sinistre'].max():.2f} €")
print(f"Coût max après écrêtement : {df_valide['cout_ecrete'].max():.2f} €")
```
*Explication* : Technique actuarielle courante pour limiter l'impact d'un sinistre exceptionnel sur le tarif de base.

---

### Exercice 2.18 (Python) : Création de Variable Dummy (Binaire)
- **Énoncé** : Créez une colonne indicatrice `est_responsable` valant 1 si `responsabilite_pct >= 50.0`, et 0 sinon.
- **Setup** : DataFrame `df`.
- **Indice** : `(df['responsabilite_pct'] >= 50.0).astype(int)`.
- **Corrigé** :
```python
df['est_responsable'] = (df['responsabilite_pct'] >= 50.0).astype(int)
print(df[['responsabilite_pct', 'est_responsable']].head())
```
*Explication* : Les variables binaires (dummies) sont le format requis pour les régressions économétriques.

---

### Exercice 2.19 (Python) : Table de Contingence (Crosstab)
- **Énoncé** : Construisez un tableau croisé dénombrant les sinistres par `region` et `nature_sinistre`.
- **Setup** : `pd.crosstab()`.
- **Indice** : `pd.crosstab(df['region'], df['nature_sinistre'])`.
- **Corrigé** :
```python
tableau_croise = pd.crosstab(df['region'], df['nature_sinistre'])
print(tableau_croise)
```
*Explication* : Permet d'observer les fréquences jointes de risques géographiques.

---

### Exercice 2.20 (Python) : Fréquence Relative Pondérée
- **Énoncé** : Calculez le pourcentage de responsabilité moyen par `nature_sinistre`.
- **Setup** : DataFrame `df`.
- **Indice** : `df.groupby('nature_sinistre')['responsabilite_pct'].mean()`.
- **Corrigé** :
```python
resp_moy = df.groupby('nature_sinistre')['responsabilite_pct'].mean()
print(resp_moy.round(1))
```
*Explication* : Met en évidence les natures où l'assuré est majoritairement en tort (ex: collision vs bris de glace).

---

### Exercice 2.21 (SQL Intermédiaire) : Grille Tarifaire S/P par Flotte
- **Énoncé** : Pour chaque catégorie de flotte, calculez la prime totale, la charge totale et le ratio $S/P$, ordonnés par $S/P$ décroissant.
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `SUM(cout) / SUM(prime) * 100` avec `WHERE cout_sinistre >= 0`.
- **Corrigé** :
```sql
SELECT 
    categorie_flotte,
    ROUND(SUM(prime_police), 2) AS total_primes,
    ROUND(SUM(cout_sinistre), 2) AS total_charge,
    ROUND(SUM(cout_sinistre) / SUM(prime_police) * 100, 2) AS ratio_sp_pct
FROM sinistres_flotte
WHERE cout_sinistre >= 0 AND categorie_flotte IS NOT NULL
GROUP BY categorie_flotte
ORDER BY ratio_sp_pct DESC;
```
*Explication* : Identifie instantanément les segments sous-tarifés ou déficitaires.

---

### Exercice 2.22 (Python Intermédiaire) : Pipeline Complet de Nettoyage
- **Énoncé** : Écrivez une fonction Python qui : 1/ élimine les coûts négatifs, 2/ impute les valeurs manquantes par la médiane de la catégorie, 3/ supprime les outliers au-delà du seuil de Tukey.
- **Setup** : DataFrame `df`.
- **Indice** : Combinez `.groupby()`, `transform()`, et masques booléens.
- **Corrigé** :
```python
def nettoyer_sinistres(data):
    d = data[data['cout_sinistre'] >= 0].copy()
    d['cout_impute'] = d.groupby('categorie_flotte')['cout_sinistre'].transform(lambda x: x.fillna(x.median()))
    q75 = d['cout_impute'].quantile(0.75)
    q25 = d['cout_impute'].quantile(0.25)
    seuil = q75 + 1.5 * (q75 - q25)
    return d[d['cout_impute'] <= seuil]

df_clean = nettoyer_sinistres(df)
print(f"Lignes nettoyées exploitables : {len(df_clean)}")
```
*Explication* : Standardise le pipeline de préparation de données pour l'entraînement de modèles.

---

### Exercice 2.23 (SQL Intermédiaire) : Agrégation avec Filtre sur la Responsabilité
- **Énoncé** : Calculez le coût moyen des sinistres où l'assuré est totalement responsable (`responsabilite_pct = 100.0`) comparé à ceux sans responsabilité (`0.0`).
- **Setup** : Table `sinistres_flotte`.
- **Indice** : `CASE WHEN responsabilite_pct = 100 THEN ...`.
- **Corrigé** :
```sql
SELECT 
    CASE 
        WHEN responsabilite_pct = 100.0 THEN 'Totalement responsable'
        WHEN responsabilite_pct = 0.0 THEN 'Non responsable'
        ELSE 'Partagée'
    END AS degre_responsabilite,
    COUNT(*) AS volume,
    ROUND(AVG(cout_sinistre), 2) AS cout_moyen
FROM sinistres_flotte
WHERE cout_sinistre >= 0
GROUP BY degre_responsabilite;
```
*Explication* : Analyse l'impact du comportement du conducteur sur la sévérité du dommage.

---

### Exercice 2.24 (Python Intermédiaire) : Normalisation Min-Max
- **Énoncé** : Normalisez la colonne `prime_police` entre 0 et 1 : $x_{\text{norm}} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$.
- **Setup** : Série `df['prime_police']`.
- **Indice** : `(x - x.min()) / (x.max() - x.min())`.
- **Corrigé** :
```python
p = df['prime_police']
p_norm = (p - p.min()) / (p.max() - p.min())
print("Min normalisé :", p_norm.min(), "| Max normalisé :", p_norm.max())
```
*Explication* : Évite la dominance des variables à grande échelle dans les algorithmes de machine learning.

---

### Exercice 2.25 (Cas Pratique de Synthèse Ch. 2) : Calcul des Primes Pures Segmentées
- **Énoncé** :
  1. En SQL, agrégez par `categorie_flotte` le nombre total de sinistres et le coût total après exclusion des données aberrantes (`cout_sinistre >= 0`).
  2. En Python, calculez la prime pure théorique par catégorie sachant une exposition hypothétique de 500 véhicules par catégorie : $PP = \frac{\text{Coût Total}}{\text{Exposition}}$.
- **Setup** : Base SQL `sinistres_flotte`.
- **Indice** : $PP = \text{Charge} / 500$.
- **Corrigé** :
*Requête SQL* :
```sql
SELECT 
    categorie_flotte,
    COUNT(*) AS nb_sinistres,
    ROUND(SUM(cout_sinistre), 2) AS charge_totale
FROM sinistres_flotte
WHERE cout_sinistre >= 0 AND categorie_flotte IS NOT NULL
GROUP BY categorie_flotte;
```
*Calcul Python de la Prime Pure* :
```python
import pandas as pd
df = pd.read_csv('public/data/ch2_sinistralite_flotte.csv')
df_clean = df[(df['cout_sinistre'] >= 0) & (df['categorie_flotte'].notna())]

charge_par_flotte = df_clean.groupby('categorie_flotte')['cout_sinistre'].sum()
exposition_par_categorie = 500 # Nombre de véhicules assurés dans chaque flotte

prime_pure = (charge_par_flotte / exposition_par_categorie).round(2)
print("=== Primes Pures Annuelles Recommandées (€) ===")
print(prime_pure)
```
*Explication* : Aboutissement de la tarification actuarielle empirique non-vie.
