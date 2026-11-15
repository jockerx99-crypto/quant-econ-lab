# Chapitre 4 : Séries Temporelles Macro-Financières & Risque de Taux (ALM)

## 1. Cadre Théorique Économétrique & ALM

### 1.1 Processus Stochastiques et Stationnarité Faible
Une série temporelle $\{X_t\}_{t \in \mathbb{Z}}$ est dite **faiblement stationnaire** (au second ordre) si :
1. $\mathbb{E}[X_t] = \mu$ constant pour tout $t$.
2. $\operatorname{Var}(X_t) = \sigma^2 < \infty$ constante pour tout $t$.
3. $\operatorname{Cov}(X_t, X_{t-k}) = \gamma(k)$ ne dépend que du décalage $k$ et non de la date $t$.

Si une série macroéconomique (ex : taux Euribor ou rendement OAT 10 ans) n'est pas stationnaire (présence d'une racine unitaire), la régression directe de $Y_t$ sur $X_t$ mène au phénomène de **régression fallacieuse** (*Spurious Regression*) : le $R^2$ et les $t$-stats sont artificiellement gonflés alors qu'il n'existe aucun lien causal.

### 1.2 Test de Racine Unitaire de Dickey-Fuller Augmenté (ADF)
Pour tester la présence d'une racine unitaire :
$$\Delta X_t = \alpha + \beta t + \gamma X_{t-1} + \sum_{j=1}^p \delta_j \Delta X_{t-j} + \varepsilon_t$$
$$H_0 : \gamma = 0 \quad (\text{Racine unitaire, non stationnaire}) \quad \text{vs} \quad H_1 : \gamma < 0 \quad (\text{Stationnaire})$$
Si la p-valeur $< 0.05$, on rejette $H_0$ et la série est stationnaire. Sinon, il faut différencier la série : $\Delta X_t = X_t - X_{t-1}$.

### 1.3 Autocorrélation des Résidus et Statistique de Durbin-Watson
Sous l'hypothèse d'absence d'autocorrélation :
$$DW = \frac{\sum_{t=2}^T (e_t - e_{t-1})^2}{\sum_{t=1}^T e_t^2} \approx 2(1 - \hat{\rho})$$
- $DW \approx 2$ : Absence d'autocorrélation d'ordre 1.
- $DW < 1.5$ : Autocorrélation positive (fréquente en finance).
- $DW > 2.5$ : Autocorrélation négative.

### 1.4 Gestion Actif-Passif (ALM) et Mesure de la Value-at-Risk ($VaR$)
Pour une institution financière (banque ou assureur vie), le risque de taux d'intérêt réside dans la désensibilisation entre l'actif (obligations) et le passif (engagements de retraite/épargne).
La **Value-at-Risk** au seuil de confiance $\alpha = 99.5\%$ (norme Solvabilité II) sur horizon 1 an représente la perte maximale dépassée avec une probabilité de $0.5\%$ :
$$VaR_{99.5\%}^{\text{paramétrique}} = -(\mu - 2.576 \times \sigma)$$

---

## 2. Syntaxe SQL Pas-à-Pas (Window Functions)

### 2.1 Décalages Temporels avec `LAG()` et `LEAD()`
```sql
SELECT 
    periode,
    date,
    euribor_3m,
    -- Valeur du trimestre précédent
    LAG(euribor_3m, 1) OVER (ORDER BY date) AS euribor_lag1,
    -- Variation trimestrielle absolue (Delta)
    ROUND(euribor_3m - LAG(euribor_3m, 1) OVER (ORDER BY date), 3) AS delta_euribor
FROM macro_taux;
```

### 2.2 Moyennes Mobiles et Fenêtres Glissantes
```sql
-- Moyenne mobile glissante sur 4 trimestres (1 an)
SELECT 
    date,
    inflation_hicp,
    ROUND(AVG(inflation_hicp) OVER (
        ORDER BY date 
        ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
    ), 2) AS inflation_moyenne_mobile_4t
FROM macro_taux;
```

---

## 3. Syntaxe Python / Statsmodels Pas-à-Pas

### 3.1 Différenciation et Stationnarité
```python
import pandas as pd
from statsmodels.tsa.stattools import adfuller

df = pd.read_csv('public/data/ch4_macro_alm_taux.csv')

# Différenciation temporelle
df['oat_diff'] = df['oat_10y'].diff()

# Test ADF sur la série différenciée
result_adf = adfuller(df['oat_diff'].dropna())
print(f"Statistique ADF : {result_adf[0]:.4f}")
print(f"P-valeur        : {result_adf[1]:.4e}")
```

### 3.2 Régression Dynamique et Correction Newey-West (HAC)
```python
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']].dropna())
y = df['oat_10y'].loc[X.index]

# Modèle OLS avec erreurs standards HAC (hétéroscédasticité et autocorrélation corrigées)
modele_ts = sm.OLS(y, X).fit(cov_type='HAC', cov_kwds={'maxlags': 4})
print(modele_ts.summary())
```
