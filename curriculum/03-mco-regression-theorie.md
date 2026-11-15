# Chapitre 3 : Modèle Linéaire Multiple & Moindres Carrés Ordinaires (MCO)

## 1. Cadre Théorique Économétrique

### 1.1 Formulation Matricielle du Modèle Linéaire Multiple
Soit le modèle économétrique reliant la variable expliquée $Y \in \mathbb{R}^n$ à $k$ régresseurs exogènes contenus dans la matrice $X \in \mathbb{R}^{n \times (k+1)}$ (incluant la constante unitaire) :

$$Y = X\beta + \varepsilon$$

avec :
$$\beta = \begin{pmatrix} \beta_0 \\ \beta_1 \\ \vdots \\ \beta_k \end{pmatrix}, \quad \varepsilon \sim \mathcal{N}(0, \sigma^2 I_n)$$

### 1.2 L'Estimateur OLS (Moindres Carrés Ordinaires)
Par minimisation de la somme des carrés des résidus $SSR = e^T e = (Y - X\hat{\beta})^T(Y - X\hat{\beta})$ :

$$\hat{\beta} = (X^T X)^{-1} X^T Y$$

### 1.3 Hypothèses de Gauss-Markov & Propriétés BLUE
Sous les 5 hypothèses classiques :
1. **Linéarité** dans les paramètres.
2. **Exogénéité stricte** : $\mathbb{E}[\varepsilon \mid X] = 0$.
3. **Absence de colinéarité parfaite** : $\text{rang}(X) = k+1$.
4. **Homoscédasticité** : $\operatorname{Var}(\varepsilon_i \mid X) = \sigma^2$.
5. **Absence d'autocorrélation** : $\operatorname{Cov}(\varepsilon_i, \varepsilon_j \mid X) = 0, \forall i \neq j$.

$\hat{\beta}$ est le **BLUE** (*Best Linear Unbiased Estimator*) :
$$\mathbb{E}[\hat{\beta}] = \beta, \quad \operatorname{Var}(\hat{\beta} \mid X) = \sigma^2 (X^T X)^{-1}$$

Estimateur de la variance d'erreur :
$$\hat{\sigma}^2 = \frac{e^T e}{n - k - 1}$$

### 1.4 Inférence Statistique : Tests de Student et Qualité d'Ajustement
- **Test de Student sur un coefficient** :
  $$H_0 : \beta_j = 0 \quad \text{contre} \quad H_1 : \beta_j \neq 0$$
  $$t_{\text{stat}} = \frac{\hat{\beta}_j}{\hat{\text{se}}(\hat{\beta}_j)} \sim \mathcal{T}(n - k - 1)$$
  Si la p-valeur $< 0.05$, on rejette $H_0$ au seuil de $5\%$.
- **Coefficient de détermination ($R^2$) et $R^2$ ajusté** :
  $$R^2 = 1 - \frac{\sum e_i^2}{\sum (y_i - \bar{y})^2}, \quad \bar{R}^2 = 1 - (1 - R^2)\frac{n - 1}{n - k - 1}$$

---

## 2. Syntaxe SQL Pas-à-Pas (Jointures Relationnelles)

### 2.1 `INNER JOIN` vs `LEFT JOIN`
- `INNER JOIN` ne conserve que les enregistrements présents dans les deux tables.
- `LEFT JOIN` préserve l'intégralité de la table de gauche, essentiel pour conserver les emprunteurs ou assurés n'ayant eu aucun sinistre.
```sql
-- Conservation de tous les clients avec ou sans sinistres
SELECT 
    e.client_id,
    e.secteur,
    e.score_credit,
    COALESCE(c.spread_credit_bps, 150.0) AS spread
FROM emprunteurs e
LEFT JOIN marche_credit c ON e.client_id = c.client_id;
```

### 2.2 Sous-Requêtes Filtrantes
```sql
SELECT client_id, score_credit, spread_credit_bps
FROM emprunteurs
WHERE score_credit > (SELECT AVG(score_credit) FROM emprunteurs);
```

---

## 3. Syntaxe Python / Statsmodels Pas-à-Pas

### 3.1 Estimation OLS avec Statsmodels
```python
import pandas as pd
import statsmodels.api as sm

df = pd.read_csv('public/data/ch3_tarification_credits.csv').dropna()

# 1. Définition des régresseurs et de la variable expliquée
X = df[['score_credit', 'ratio_endettement', 'chiffre_affaires_m']]
y = df['spread_credit_bps']

# 2. Ajout impératif de la constante
X = sm.add_constant(X)

# 3. Ajustement du modèle OLS
model = sm.OLS(y, X).fit()

# 4. Rapport économétrique complet
print(model.summary())
```

### 3.2 Exploitation des Résultats
```python
# Coefficients estimés
betas = model.params

# P-valeurs des tests de Student
pvalues = model.pvalues

# R-carré
r2 = model.rsquared

# Résidus empiriques (e = y - y_hat)
residus = model.resid
```
