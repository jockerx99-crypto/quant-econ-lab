# Chapitre 1 : 25 Micro-Exercices d'Échauffement & Pratique

Jeu de données utilisé : `ch1_portefeuille_assures.csv` (table SQL `assures`).
Colonnes : `police_id`, `client_id`, `age`, `sexe`, `region`, `type_vehicule`, `bonus_malus`, `prime_annuelle`, `nb_sinistres`, `cout_total_sinistres`.

---

### Exercice 1.1 (SQL) : Projection Simple
- **Énoncé** : Affichez uniquement les colonnes `police_id`, `age` et `prime_annuelle` de tous les assurés.
- **Setup** : Table `assures`.
- **Indice** : Utilisez la clause `SELECT col1, col2, col3 FROM table;`.
- **Corrigé** :
```sql
SELECT police_id, age, prime_annuelle 
FROM assures;
```
*Explication* : Évite de charger toutes les colonnes (`SELECT *`), réduisant l'empreinte mémoire.

---

### Exercice 1.2 (SQL) : Alias de Colonne
- **Énoncé** : Affichez `client_id` renommé en `numero_client` et `prime_annuelle` renommée en `cotisation_ttc`.
- **Setup** : Table `assures`.
- **Indice** : Le mot-clé `AS` permet de renommer une colonne dans le résultat.
- **Corrigé** :
```sql
SELECT client_id AS numero_client, prime_annuelle AS cotisation_ttc 
FROM assures;
```
*Explication* : L'alias ne modifie pas le nom physique dans la base de données, mais le libellé du jeu de résultat.

---

### Exercice 1.3 (SQL) : Filtrage Numérique Élémentaire
- **Énoncé** : Sélectionnez les polices dont la prime annuelle est strictement supérieure à 1 000 €.
- **Setup** : Table `assures`.
- **Indice** : Clause `WHERE prime_annuelle > 1000`.
- **Corrigé** :
```sql
SELECT police_id, prime_annuelle 
FROM assures 
WHERE prime_annuelle > 1000;
```
*Explication* : La clause `WHERE` filtre les lignes avant toute restitution.

---

### Exercice 1.4 (SQL) : Filtrage Catégoriel
- **Énoncé** : Sélectionnez toutes les polices d'assurance situées dans la région `'IDF'`.
- **Setup** : Table `assures`.
- **Indice** : Les chaînes de caractères en SQL s'encadrent de guillemets simples `'...'`.
- **Corrigé** :
```sql
SELECT police_id, region, prime_annuelle 
FROM assures 
WHERE region = 'IDF';
```
*Explication* : SQLite effectue une comparaison sensible ou insensible selon le collationnement par défaut.

---

### Exercice 1.5 (SQL) : Conjonction Logique (AND)
- **Énoncé** : Isolez les conducteurs âgés de moins de 25 ans possédant un bonus-malus supérieur ou égal à 1.00 (profil jeune conducteur sans bonus).
- **Setup** : Table `assures`.
- **Indice** : Combinez deux conditions avec l'opérateur `AND`.
- **Corrigé** :
```sql
SELECT police_id, age, bonus_malus 
FROM assures 
WHERE age < 25 AND bonus_malus >= 1.00;
```
*Explication* : Les deux prédicats doivent être simultanément vrais pour que la ligne soit conservée.

---

### Exercice 1.6 (SQL) : Disjonction Logique (OR)
- **Énoncé** : Sélectionnez les polices couvrant une `'Sportive'` OU un `'SUV'`.
- **Setup** : Table `assures`.
- **Indice** : Utilisez `WHERE condition1 OR condition2`.
- **Corrigé** :
```sql
SELECT police_id, type_vehicule, prime_annuelle 
FROM assures 
WHERE type_vehicule = 'Sportive' OR type_vehicule = 'SUV';
```
*Explication* : Conserve les lignes validant au moins l'un des deux critères.

---

### Exercice 1.7 (SQL) : Opérateur IN
- **Énoncé** : Réécrivez la sélection des véhicules `'Citadine'`, `'Berline'` et `'SUV'` de manière concise sans répéter `OR`.
- **Setup** : Table `assures`.
- **Indice** : `IN ('val1', 'val2', 'val3')`.
- **Corrigé** :
```sql
SELECT police_id, type_vehicule 
FROM assures 
WHERE type_vehicule IN ('Citadine', 'Berline', 'SUV');
```
*Explication* : L'opérateur `IN` simplifie la syntaxe et optimise le plan d'exécution des moteurs SQL.

---

### Exercice 1.8 (SQL) : Intervalle avec BETWEEN
- **Énoncé** : Sélectionnez les assurés dont l'âge est compris entre 30 et 40 ans inclus.
- **Setup** : Table `assures`.
- **Indice** : `WHERE age BETWEEN 30 AND 40`.
- **Corrigé** :
```sql
SELECT police_id, age 
FROM assures 
WHERE age BETWEEN 30 AND 40;
```
*Explication* : `BETWEEN` en SQL standard est inclusif des deux bornes ($30 \le \text{age} \le 40$).

---

### Exercice 1.9 (SQL) : Détection des Valeurs Nulles
- **Énoncé** : Identifiez les contrats pour lesquels le coefficient `bonus_malus` n'a pas été renseigné (valeur manquante).
- **Setup** : Table `assures`.
- **Indice** : N'utilisez JAMAIS `= NULL`, mais `IS NULL`.
- **Corrigé** :
```sql
SELECT police_id, client_id, bonus_malus 
FROM assures 
WHERE bonus_malus IS NULL;
```
*Explication* : En logique ternaire SQL (True, False, Unknown), `NULL = NULL` renvoie `UNKNOWN`, seul `IS NULL` est valide.

---

### Exercice 1.10 (SQL) : Tri et Limitation (Top N)
- **Énoncé** : Affichez les 5 polices ayant les primes annuelles les plus élevées.
- **Setup** : Table `assures`.
- **Indice** : `ORDER BY colonne DESC LIMIT n`.
- **Corrigé** :
```sql
SELECT police_id, type_vehicule, prime_annuelle 
FROM assures 
ORDER BY prime_annuelle DESC 
LIMIT 5;
```
*Explication* : `ORDER BY ... DESC` classe par ordre décroissant et `LIMIT 5` tronque au 5 premières lignes.

---

### Exercice 1.11 (Python) : Importation et Dimensions
- **Énoncé** : Chargez le fichier `ch1_portefeuille_assures.csv` dans une variable `df` et affichez son nombre de lignes et de colonnes.
- **Setup** : `import pandas as pd`.
- **Indice** : Utilisez `pd.read_csv()` puis l'attribut `.shape`.
- **Corrigé** :
```python
import pandas as pd
df = pd.read_csv('public/data/ch1_portefeuille_assures.csv')
print("Dimensions :", df.shape)
```
*Explication* : `.shape` est un tuple `(n_lignes, n_colonnes)`.

---

### Exercice 1.12 (Python) : Inspection Rapide des En-têtes
- **Énoncé** : Affichez les 3 premières lignes du DataFrame `df`.
- **Setup** : DataFrame `df`.
- **Indice** : Utilisez `.head(3)`.
- **Corrigé** :
```python
print(df.head(3))
```
*Explication* : Permet de vérifier rapidement le nom et le contenu des variables.

---

### Exercice 1.13 (Python) : Types et Décompte Non-Nul
- **Énoncé** : Affichez le type de données de chaque colonne et vérifiez la mémoire occupée.
- **Setup** : DataFrame `df`.
- **Indice** : Méthode `.info()`.
- **Corrigé** :
```python
df.info()
```
*Explication* : Identifie immédiatement les colonnes textuelles (`object`) et les colonnes ayant des valeurs manquantes.

---

### Exercice 1.14 (Python) : Statistiques Descriptives Univariées
- **Énoncé** : Calculez la moyenne, l'écart-type, les quartiles, le min et le max de toutes les colonnes numériques.
- **Setup** : DataFrame `df`.
- **Indice** : Méthode `.describe()`.
- **Corrigé** :
```python
stats = df.describe()
print(stats)
```
*Explication* : Fournit instantanément la synthèse des 5 nombres de Tukey.

---

### Exercice 1.15 (Python) : Extraction de Série et Moyenne
- **Énoncé** : Extrayez la colonne `age` sous forme de Série Pandas et calculez son âge moyen.
- **Setup** : DataFrame `df`.
- **Indice** : `df['age'].mean()`.
- **Corrigé** :
```python
age_moyen = df['age'].mean()
print(f"Âge moyen : {age_moyen:.2f} ans")
```
*Explication* : `.mean()` ignore par défaut les valeurs manquantes `NaN`.

---

### Exercice 1.16 (Python) : Filtrage Booléen Simple
- **Énoncé** : Créez un sous-ensemble `df_idf` contenant uniquement les assurés de la région `'IDF'`.
- **Setup** : DataFrame `df`.
- **Indice** : `df[df['colonne'] == 'valeur']`.
- **Corrigé** :
```python
df_idf = df[df['region'] == 'IDF']
print(f"Nombre d'assurés en IDF : {len(df_idf)}")
```
*Explication* : Le masque booléen `df['region'] == 'IDF'` filtre les index correspondants.

---

### Exercice 1.17 (Python) : Filtrage Booléen Composé
- **Énoncé** : Filtrez les assurés de moins de 25 ans ayant une prime supérieure à 800 €.
- **Setup** : DataFrame `df`.
- **Indice** : Utilisez l'opérateur bitwise `&` avec chaque condition entre parenthèses `(c1) & (c2)`.
- **Corrigé** :
```python
jeunes_primes_hautes = df[(df['age'] < 25) & (df['prime_annuelle'] > 800)]
print("Effectif :", len(jeunes_primes_hautes))
```
*Explication* : Les parenthèses sont obligatoires en Python en raison de la priorité des opérateurs bitwise.

---

### Exercice 1.18 (Python) : Diagnostic des Valeurs Manquantes
- **Énoncé** : Comptez le nombre exact de valeurs nulles dans chaque colonne du DataFrame.
- **Setup** : DataFrame `df`.
- **Indice** : Combinez `.isna()` et `.sum()`.
- **Corrigé** :
```python
nulls_par_colonne = df.isna().sum()
print(nulls_par_colonne)
```
*Explication* : `isna()` convertit chaque cellule en booléen, `sum()` somme les `True` (1).

---

### Exercice 1.19 (Python) : Calculs Vectorisés avec NumPy
- **Énoncé** : Calculez la médiane et l'écart-type de `prime_annuelle` en utilisant `np.nanmedian` et `np.nanstd`.
- **Setup** : `import numpy as np`.
- **Indice** : `np.nanmedian(df['prime_annuelle'])`.
- **Corrigé** :
```python
import numpy as np
mediane = np.nanmedian(df['prime_annuelle'])
ecart_type = np.nanstd(df['prime_annuelle'], ddof=1)
print(f"Médiane : {mediane:.2f} € | Écart-type : {ecart_type:.2f} €")
```
*Explication* : `np.nan...` ignore automatiquement les NaN sans nécessiter de `.dropna()` préalable.

---

### Exercice 1.20 (Python) : Quantiles d'Exposition aux Risques
- **Énoncé** : Calculez le 90ème et le 99ème percentile du coût des sinistres pour évaluer les charges extrêmes.
- **Setup** : DataFrame `df['cout_total_sinistres']`.
- **Indice** : Utilisez `np.nanquantile(serie, [0.90, 0.99])`.
- **Corrigé** :
```python
q90, q99 = np.nanquantile(df['cout_total_sinistres'], [0.90, 0.99])
print(f"Quantile 90% : {q90:.2f} € | Quantile 99% : {q99:.2f} €")
```
*Explication* : Mesure empirique du risque de queue (tail risk) en tarification actuarielle.

---

### Exercice 1.21 (SQL Intermédiaire) : Détection des Profils à Haut Risque
- **Énoncé** : Sélectionnez les polices avec au moins 1 sinistre (`nb_sinistres > 0`), un coût total supérieur à 5 000 €, ordonnées par coût décroissant.
- **Setup** : Table `assures`.
- **Indice** : Combinez `WHERE nb_sinistres > 0 AND cout_total_sinistres > 5000 ORDER BY ...`.
- **Corrigé** :
```sql
SELECT police_id, client_id, nb_sinistres, cout_total_sinistres 
FROM assures 
WHERE nb_sinistres > 0 AND cout_total_sinistres > 5000 
ORDER BY cout_total_sinistres DESC;
```
*Explication* : Isole la sinistralité lourde qui dégrade la marge technique.

---

### Exercice 1.22 (Python Intermédiaire) : Écart Interquartile (IQR)
- **Énoncé** : Calculez l'écart interquartile $IQR = Q_3 - Q_1$ de la variable `prime_annuelle`.
- **Setup** : Série `df['prime_annuelle']`.
- **Indice** : `q75 - q25` calculé via `.quantile(0.75)` et `.quantile(0.25)`.
- **Corrigé** :
```python
q25 = df['prime_annuelle'].quantile(0.25)
q75 = df['prime_annuelle'].quantile(0.75)
iqr = q75 - q25
print(f"Q1 = {q25:.2f} € | Q3 = {q75:.2f} € | IQR = {iqr:.2f} €")
```
*Explication* : L'IQR mesure la dispersion sans être sensible aux valeurs aberrantes extrêmes.

---

### Exercice 1.23 (Python Intermédiaire) : Calcul du Coefficient d'Asymétrie (Skewness)
- **Énoncé** : Calculez le coefficient d'asymétrie de Fisher-Pearson sur `cout_total_sinistres`.
- **Setup** : `df['cout_total_sinistres'].skew()`.
- **Indice** : Une valeur positive indique une queue de distribution étirée vers la droite.
- **Corrigé** :
```python
asymetrie = df['cout_total_sinistres'].skew()
print(f"Skewness des coûts : {asymetrie:.4f}")
```
*Explication* : Un skewness élevé ($> 2$) confirme le caractère leptokurtique/asymétrique des sinistres d'assurance.

---

### Exercice 1.24 (SQL Intermédiaire) : Filtrage des Polices Saines
- **Énoncé** : Sélectionnez les assurés ayant un bonus maximal (`bonus_malus = 0.50`) et aucun sinistre (`nb_sinistres = 0`), résidant en `'Bretagne'` ou `'Nouvelle-Aquitaine'`.
- **Setup** : Table `assures`.
- **Indice** : Utilisez `bonus_malus = 0.50 AND nb_sinistres = 0 AND region IN (...)`.
- **Corrigé** :
```sql
SELECT police_id, client_id, prime_annuelle 
FROM assures 
WHERE bonus_malus = 0.50 
  AND nb_sinistres = 0 
  AND region IN ('Bretagne', 'Nouvelle-Aquitaine')
ORDER BY prime_annuelle ASC;
```
*Explication* : Permet d'isoler le cœur de portefeuille le plus rentable pour fidélisation tarifaire.

---

### Exercice 1.25 (Cas Pratique de Synthèse Ch. 1) : Analyse d'Exposition et Fréquence
- **Énoncé** : 
  1. Écrivez la requête SQL qui sélectionne les polices sans valeurs manquantes sur la région et le bonus.
  2. En Python, calculez le taux de sinistralité global : $\text{Fréquence} = \frac{\sum \text{nb\_sinistres}}{\text{Nombre total de polices}}$.
- **Setup** : Base SQL `assures` et script Python.
- **Indice** : En SQL `WHERE region IS NOT NULL AND bonus_malus IS NOT NULL`. En Python `df['nb_sinistres'].sum() / len(df)`.
- **Corrigé** :
*Requête SQL d'extraction saine* :
```sql
SELECT police_id, age, region, bonus_malus, prime_annuelle, nb_sinistres, cout_total_sinistres
FROM assures
WHERE region IS NOT NULL 
  AND bonus_malus IS NOT NULL;
```
*Traitement Python* :
```python
import pandas as pd
df_clean = pd.read_csv('public/data/ch1_portefeuille_assures.csv').dropna(subset=['region', 'bonus_malus'])

exposition = len(df_clean)
total_sinistres = df_clean['nb_sinistres'].sum()
frequence_globale = total_sinistres / exposition

print(f"Exposition totale : {exposition} polices")
print(f"Total sinistres survenus : {total_sinistres}")
print(f"Taux de fréquence sinistre : {frequence_globale * 100:.2f} %")
```
*Explication* : Pose la première brique de la modélisation actuarielle : le taux de sinistralité annuel par police.
