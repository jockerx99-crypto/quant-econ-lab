# Chapitre 3 : 25 Micro-Exercices sur les Jointures & Modèles OLS

Jeu de données utilisé : `ch3_tarification_credits.csv` (table SQL `credits`).
Colonnes : `client_id`, `secteur`, `chiffre_affaires_m`, `ratio_endettement`, `score_credit`, `euribor_ref`, `spread_credit_bps`, `taux_pret_pct`.

---

### Exercice 3.1 (SQL) : Jointure Réflexive d'Échauffement
- **Énoncé** : En considérant la table `credits` dédoublée ou sous forme d'auto-jointure, affichez les paires de clients du même secteur ayant exactement le même score de crédit.
- **Setup** : Table `credits`.
- **Indice** : `FROM credits c1 JOIN credits c2 ON c1.secteur = c2.secteur AND c1.score_credit = c2.score_credit AND c1.client_id < c2.client_id`.
- **Corrigé** :
```sql
SELECT c1.client_id AS client_1, c2.client_id AS client_2, c1.secteur, c1.score_credit
FROM credits c1
JOIN credits c2 ON c1.secteur = c2.secteur 
               AND c1.score_credit = c2.score_credit 
               AND c1.client_id < c2.client_id;
```
*Explication* : `c1.client_id < c2.client_id` évite les doublons inversés et l'auto-appariement.

---

### Exercice 3.2 (SQL) : Simulation INNER JOIN (Portefeuille & Sinistres)
- **Énoncé** : Écrivez une jointure `INNER JOIN` entre une table fictive de contrats et une table de défauts sur la clé `client_id`.
- **Setup** : Syntaxe standard SQL.
- **Indice** : `SELECT ... FROM table_a a INNER JOIN table_b b ON a.id = b.id`.
- **Corrigé** :
```sql
SELECT c.client_id, c.secteur, c.spread_credit_bps
FROM credits c
INNER JOIN credits c_sub ON c.client_id = c_sub.client_id
WHERE c.spread_credit_bps > 200;
```
*Explication* : `INNER JOIN` ne renvoie que l'intersection stricte des clés présentes.

---

### Exercice 3.3 (SQL) : Jointure Externe Gauche (LEFT JOIN)
- **Énoncé** : Expliquez et écrivez un `LEFT JOIN` garantissant que tous les emprunteurs soient conservés même si leur spread n'est pas renseigné dans une table secondaire.
- **Setup** : Table `credits`.
- **Indice** : `LEFT JOIN table_secondaire ON ...`.
- **Corrigé** :
```sql
SELECT c.client_id, c.score_credit, COALESCE(c.spread_credit_bps, 0.0) AS spread_retenu
FROM credits c
LEFT JOIN credits ref ON c.client_id = ref.client_id;
```
*Explication* : Conserve 100% de la population d'origine, évitant le biais de sélection du survivant.

---

### Exercice 3.4 (SQL) : Sous-Requête dans la Clause WHERE
- **Énoncé** : Sélectionnez tous les dossiers dont le `score_credit` est strictement supérieur à la moyenne globale du portefeuille.
- **Setup** : Table `credits`.
- **Indice** : `WHERE score_credit > (SELECT AVG(score_credit) FROM credits)`.
- **Corrigé** :
```sql
SELECT client_id, secteur, score_credit 
FROM credits 
WHERE score_credit > (SELECT AVG(score_credit) FROM credits)
ORDER BY score_credit DESC;
```
*Explication* : La sous-requête scalaire calcule la moyenne une seule fois avant comparaison.

---

### Exercice 3.5 (SQL) : Opérateur IN avec Sous-Requête
- **Énoncé** : Isolez les clients appartenant aux secteurs dont le chiffre d'affaires total dépasse 200 millions d'euros.
- **Setup** : Table `credits`.
- **Indice** : `WHERE secteur IN (SELECT secteur FROM credits GROUP BY secteur HAVING SUM(chiffre_affaires_m) > 200)`.
- **Corrigé** :
```sql
SELECT client_id, secteur, chiffre_affaires_m 
FROM credits 
WHERE secteur IN (
    SELECT secteur 
    FROM credits 
    GROUP BY secteur 
    HAVING SUM(chiffre_affaires_m) > 200
);
```
*Explication* : Permet un filtrage multi-niveaux basé sur des agrégations sectorielles.

---

### Exercice 3.6 (SQL) : CTE (Common Table Expression - WITH)
- **Énoncé** : Réécrivez la requête précédente de manière lisible en utilisant une clause `WITH`.
- **Setup** : Table `credits`.
- **Indice** : `WITH secteurs_majeurs AS (...) SELECT ...`.
- **Corrigé** :
```sql
WITH secteurs_majeurs AS (
    SELECT secteur 
    FROM credits 
    GROUP BY secteur 
    HAVING SUM(chiffre_affaires_m) > 200
)
SELECT c.client_id, c.secteur, c.chiffre_affaires_m
FROM credits c
JOIN secteurs_majeurs sm ON c.secteur = sm.secteur;
```
*Explication* : Les CTE modularisent les requêtes complexes et améliorent la lisibilité du code SQL.

---

### Exercice 3.7 (SQL) : Agrégation avec Jointure et Ratio
- **Énoncé** : Calculez le spread moyen par secteur comparé au spread moyen global.
- **Setup** : Table `credits`.
- **Indice** : Sous-requête scalaire dans le `SELECT`.
- **Corrigé** :
```sql
SELECT 
    secteur,
    ROUND(AVG(spread_credit_bps), 2) AS spread_secteur,
    ROUND((SELECT AVG(spread_credit_bps) FROM credits), 2) AS spread_global
FROM credits
GROUP BY secteur;
```
*Explication* : Permet de comparer chaque entité à un benchmark centralisé.

---

### Exercice 3.8 (SQL) : Jointure Conditionnelle Filtrée
- **Énoncé** : Sélectionnez les clients d'un secteur à risque (`ratio_endettement > 0.70`) ayant obtenu un prêt à taux préférentiel (`taux_pret_pct < 2.50`).
- **Setup** : Table `credits`.
- **Indice** : `WHERE ratio_endettement > 0.70 AND taux_pret_pct < 2.50`.
- **Corrigé** :
```sql
SELECT client_id, secteur, ratio_endettement, taux_pret_pct 
FROM credits 
WHERE ratio_endettement > 0.70 AND taux_pret_pct < 2.50;
```
*Explication* : Détection d'anomalies de souscription où le risque n'est pas rémunéré.

---

### Exercice 3.9 (SQL) : Sous-Requête Corrélée (EXISTS)
- **Énoncé** : Affichez les clients pour lesquels il existe dans le même secteur au moins une autre entreprise avec un chiffre d'affaires supérieur à 100M€.
- **Setup** : Table `credits`.
- **Indice** : `WHERE EXISTS (SELECT 1 FROM credits c2 WHERE ...)`.
- **Corrigé** :
```sql
SELECT c1.client_id, c1.secteur, c1.chiffre_affaires_m
FROM credits c1
WHERE EXISTS (
    SELECT 1 
    FROM credits c2 
    WHERE c2.secteur = c1.secteur 
      AND c2.chiffre_affaires_m > 100 
      AND c2.client_id <> c1.client_id
);
```
*Explication* : `EXISTS` s'arrête dès la première correspondance trouvée, optimisant l'exécution.

---

### Exercice 3.10 (SQL) : Aplatissement de la Table pour l'Économétrie
- **Énoncé** : Préparez le jeu de données pour Python en extrayant uniquement les lignes sans valeurs manquantes, ordonnées par `client_id`.
- **Setup** : Table `credits`.
- **Indice** : `WHERE col1 IS NOT NULL AND col2 IS NOT NULL`.
- **Corrigé** :
```sql
SELECT 
    client_id, secteur, chiffre_affaires_m, ratio_endettement,
    score_credit, euribor_ref, spread_credit_bps, taux_pret_pct
FROM credits
WHERE score_credit IS NOT NULL 
  AND ratio_endettement IS NOT NULL
ORDER BY client_id;
```
*Explication* : Prépare la matrice d'entraînement économétrique propre.

---

### Exercice 3.11 (Python) : Ajout de la Constante (sm.add_constant)
- **Énoncé** : Créez une matrice de régresseurs $X$ à partir de `score_credit` et ajoutez la colonne unitaire de constante.
- **Setup** : `import statsmodels.api as sm`.
- **Indice** : `X = sm.add_constant(df['score_credit'])`.
- **Corrigé** :
```python
import pandas as pd
import statsmodels.api as sm

df = pd.read_csv('public/data/ch3_tarification_credits.csv').dropna()
X = sm.add_constant(df['score_credit'])
print(X.head(3))
```
*Explication* : Sans constante unitaire, la droite est forcée de passer par l'origine ($y = 0$ quand $x = 0$), faussant le $R^2$.

---

### Exercice 3.12 (Python) : Régression Linéaire Simple OLS
- **Énoncé** : Estimez la relation simple $\text{spread\_credit\_bps} = \beta_0 + \beta_1 \times \text{score\_credit} + \varepsilon$.
- **Setup** : `y = df['spread_credit_bps']`, `X = sm.add_constant(df['score_credit'])`.
- **Indice** : `model = sm.OLS(y, X).fit()`.
- **Corrigé** :
```python
y = df['spread_credit_bps']
model_simple = sm.OLS(y, X).fit()
print(model_simple.summary())
```
*Explication* : Ajuste les coefficients par la méthode des Moindres Carrés Ordinaires.

---

### Exercice 3.13 (Python) : Extraction des Coefficients Estimés ($\hat{\beta}$)
- **Énoncé** : Affichez la constante $\hat{\beta}_0$ et la pente $\hat{\beta}_1$ du modèle simple.
- **Setup** : Objet `model_simple`.
- **Indice** : `model_simple.params`.
- **Corrigé** :
```python
betas = model_simple.params
print(f"Constante (beta_0) : {betas['const']:.4f}")
print(f"Pente (beta_1)     : {betas['score_credit']:.4f}")
```
*Explication* : Le signe négatif attendu confirme qu'un meilleur score de crédit réduit le spread de taux.

---

### Exercice 3.14 (Python) : P-Valeur et Test de Significativité
- **Énoncé** : Extrayez la p-valeur du coefficient `score_credit` et vérifiez si elle est statistiquement significative au seuil de 1%.
- **Setup** : `model_simple.pvalues`.
- **Indice** : `p_val < 0.01`.
- **Corrigé** :
```python
p_val = model_simple.pvalues['score_credit']
print(f"P-valeur de score_credit : {p_val:.4e}")
if p_val < 0.01:
    print("Le score de crédit est statistiquement significatif au seuil de 1% (rejet de H0).")
```
*Explication* : Une p-valeur minuscule invalide l'hypothèse nulle d'absence d'impact ($\beta_1 = 0$).

---

### Exercice 3.15 (Python) : Qualité d'Ajustement ($R^2$)
- **Énoncé** : Affichez le coefficient de détermination $R^2$ et le $R^2$ ajusté du modèle.
- **Setup** : `model_simple.rsquared`, `model_simple.rsquared_adj`.
- **Indice** : Pourcentage de variance expliqué.
- **Corrigé** :
```python
r2 = model_simple.rsquared
r2_adj = model_simple.rsquared_adj
print(f"R² = {r2 * 100:.2f} % | R² ajusté = {r2_adj * 100:.2f} %")
```
*Explication* : Mesure la part de la variabilité du spread de crédit captée par le score.

---

### Exercice 3.16 (Python) : Régression Linéaire Multiple
- **Énoncé** : Estimez le modèle multivarié expliquant `spread_credit_bps` par `score_credit`, `ratio_endettement` et `chiffre_affaires_m`.
- **Setup** : `X_multi = sm.add_constant(df[['score_credit', 'ratio_endettement', 'chiffre_affaires_m']])`.
- **Indice** : `sm.OLS(y, X_multi).fit()`.
- **Corrigé** :
```python
X_multi = sm.add_constant(df[['score_credit', 'ratio_endettement', 'chiffre_affaires_m']])
model_multi = sm.OLS(y, X_multi).fit()
print(model_multi.summary())
```
*Explication* : Isole l'effet marginal de chaque variable ceteris paribus (toutes choses égales par ailleurs).

---

### Exercice 3.17 (Python) : Extraction du Vecteur des Résidus ($e_i$)
- **Énoncé** : Extrayez les résidus empiriques $e = y - \hat{y}$ et vérifiez que leur moyenne empirique est quasi-nulle.
- **Setup** : `residus = model_multi.resid`.
- **Indice** : `residus.mean()`.
- **Corrigé** :
```python
residus = model_multi.resid
print(f"Moyenne des résidus : {residus.mean():.2e}")
print(f"Écart-type des résidus (sigma_hat) : {residus.std():.4f}")
```
*Explication* : La somme et la moyenne des résidus OLS avec constante sont mathématiquement nulles par construction matricielle.

---

### Exercice 3.18 (Python) : Calcul Matriciel Direct de $\hat{\beta} = (X^TX)^{-1}X^TY$
- **Énoncé** : Retrouvez les coefficients OLS par calcul matriciel pur avec NumPy sans utiliser Statsmodels.
- **Setup** : `X_mat = X_multi.values`, `y_vec = y.values`.
- **Indice** : `np.linalg.inv(X.T @ X) @ X.T @ y`.
- **Corrigé** :
```python
import numpy as np

X_mat = X_multi.values
y_vec = y.values

# Formule matricielle OLS
beta_matriciel = np.linalg.inv(X_mat.T @ X_mat) @ X_mat.T @ y_vec
print("Coefficients calculés par algèbre matricielle pure :")
for name, val in zip(X_multi.columns, beta_matriciel):
    print(f"  {name:20s} : {val:.4f}")
```
*Explication* : Démontre l'équivalence exacte entre l'algèbre linéaire théorique et le solveur Statsmodels.

---

### Exercice 3.19 (Python) : Calcul des Valeurs Ajustées ($\hat{y}$)
- **Énoncé** : Calculez les prédictions du modèle $\hat{y} = X\hat{\beta}$ et comparez les 5 premières prédictions aux valeurs observées.
- **Setup** : `model_multi.fittedvalues`.
- **Indice** : `y_pred = model_multi.fittedvalues`.
- **Corrigé** :
```python
y_pred = model_multi.fittedvalues
comparaison = pd.DataFrame({'Observé': y.head(5), 'Prédit': y_pred.head(5), 'Écart': (y.head(5) - y_pred.head(5)).round(2)})
print(comparaison)
```
*Explication* : $\hat{y}$ représente le spread théorique juste selon le profil de risque de l'entreprise.

---

### Exercice 3.20 (Python) : Visualisation Graphique Matplotlib
- **Énoncé** : Tracez un nuage de points comparant `score_credit` et `spread_credit_bps` avec la droite de régression OLS superposée.
- **Setup** : `import matplotlib.pyplot as plt`.
- **Indice** : `plt.scatter()` et `plt.plot()`.
- **Corrigé** :
```python
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 4))
plt.scatter(df['score_credit'], df['spread_credit_bps'], alpha=0.5, color='#38bdf8', label='Observations')
plt.plot(df['score_credit'], model_simple.fittedvalues, color='#f43f5e', linewidth=2, label='Droite OLS')
plt.xlabel("Score de Crédit")
plt.ylabel("Spread de Crédit (bps)")
plt.title("Régression Linéaire OLS : Risque de Crédit")
plt.legend()
plt.tight_layout()
plt.show()
```
*Explication* : Confirmation visuelle de la relation inverse entre qualité de crédit et prime de risque.

---

### Exercice 3.21 (Python Intermédiaire) : Diagnostic de Multicolinéarité (VIF)
- **Énoncé** : Calculez le facteur d'inflation de la variance (VIF) pour chaque régresseur avec `statsmodels.stats.outliers_influence.variance_inflation_factor`.
- **Setup** : Matrice `X_multi`.
- **Indice** : Un VIF < 5 indique l'absence de colinéarité excessive.
- **Corrigé** :
```python
from statsmodels.stats.outliers_influence import variance_inflation_factor

vifs = [variance_inflation_factor(X_multi.values, i) for i in range(X_multi.shape[1])]
vif_df = pd.DataFrame({'Variable': X_multi.columns, 'VIF': vifs})
print(vif_df)
```
*Explication* : Valide l'hypothèse de non-colinéarité de Gauss-Markov.

---

### Exercice 3.22 (Python Intermédiaire) : Test d'Homoscédasticité de Breusch-Pagan
- **Énoncé** : Réalisez le test de Breusch-Pagan pour vérifier que la variance des erreurs est constante.
- **Setup** : `from statsmodels.stats.diagnostic import het_breuschpagan`.
- **Indice** : `het_breuschpagan(residus, X_multi)`.
- **Corrigé** :
```python
from statsmodels.stats.diagnostic import het_breuschpagan

lm_stat, p_val, f_stat, f_pval = het_breuschpagan(model_multi.resid, X_multi)
print(f"Statistique LM : {lm_stat:.4f} | P-valeur : {p_val:.4e}")
if p_val > 0.05:
    print("Homoscédasticité non rejetée au seuil de 5%.")
else:
    print("Présence d'hétéroscédasticité : correction de White recommandée.")
```
*Explication* : Permet de déterminer si les erreurs standards usuelles sont fiables.

---

### Exercice 3.23 (Python Intermédiaire) : Estimation avec Erreurs Robustes (White HC1)
- **Énoncé** : Ré-estimez le modèle OLS avec la matrice de variance-covariance robuste aux hétéroscédasticités `cov_type='HC1'`.
- **Setup** : `sm.OLS(y, X_multi).fit(cov_type='HC1')`.
- **Indice** : Modifie les écarts-types sans changer les coefficients $\hat{\beta}$.
- **Corrigé** :
```python
model_robuste = sm.OLS(y, X_multi).fit(cov_type='HC1')
print("Écarts-types classiques :", model_multi.bse.round(3))
print("Écarts-types robustes HC1 :", model_robuste.bse.round(3))
```
*Explication* : Protège l'économètre contre les faux rejets de l'hypothèse nulle en présence de variance résiduelle variable.

---

### Exercice 3.24 (Python Intermédiaire) : Graphique Résidus vs Valeurs Ajustées
- **Énoncé** : Tracez le nuage de points des résidus $e_i$ en fonction des prédictions $\hat{y}_i$ avec une ligne horizontale en 0.
- **Setup** : `plt.scatter(model_multi.fittedvalues, model_multi.resid)`.
- **Indice** : Un nuage sans motif particulier (entonnoir ou courbe) confirme la linéarité.
- **Corrigé** :
```python
plt.figure(figsize=(8, 4))
plt.scatter(model_multi.fittedvalues, model_multi.resid, alpha=0.5, color='#38bdf8')
plt.axhline(0, color='#f43f5e', linestyle='--', linewidth=1.5)
plt.xlabel("Valeurs Ajustées (y_hat)")
plt.ylabel("Résidus (e)")
plt.title("Diagnostic des Résidus OLS")
plt.tight_layout()
plt.show()
```
*Explication* : Le diagnostic graphique le plus universel en économétrie appliquée.

---

### Exercice 3.25 (Cas Pratique de Synthèse Ch. 3) : Grille Tarifaire ALM & Marge de Prêt
- **Énoncé** :
  1. En SQL, sélectionnez les entreprises empruntant à taux variable indexé sur Euribor (`euribor_ref > 0`).
  2. En Python, estimez le modèle complet expliquant `taux_pret_pct` par `score_credit`, `ratio_endettement` et `euribor_ref`.
  3. Prédisez le taux d'intérêt actuariel équitable pour un nouveau client ayant `score_credit = 720`, `ratio_endettement = 0.40` et `euribor_ref = 3.50`.
- **Setup** : Données `ch3_tarification_credits.csv`.
- **Indice** : `model.predict([1, 720, 0.40, 3.50])`.
- **Corrigé** :
*Requête SQL d'extraction* :
```sql
SELECT client_id, score_credit, ratio_endettement, euribor_ref, taux_pret_pct
FROM credits
WHERE euribor_ref > 0 AND score_credit IS NOT NULL
ORDER BY client_id;
```
*Modélisation et Pricing Python* :
```python
import pandas as pd
import statsmodels.api as sm

df = pd.read_csv('public/data/ch3_tarification_credits.csv').dropna()
X = sm.add_constant(df[['score_credit', 'ratio_endettement', 'euribor_ref']])
y = df['taux_pret_pct']

modele_pricing = sm.OLS(y, X).fit()
print(modele_pricing.summary())

# Prédiction pour le nouveau client
nouveau_client = [1.0, 720, 0.40, 3.50] # [const, score, endettement, euribor]
taux_recommande = modele_pricing.predict(nouveau_client)[0]

print("\n=== Tarification de Crédit ALM Recommandée ===")
print(f"Taux d'intérêt actuariel équitable : {taux_recommande:.2f} %")
```
*Explication* : L'économétrie OLS est directement mobilisée pour la tarification unitaire du risque de crédit.
