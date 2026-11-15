# Chapitre 4 : 25 Micro-Exercices sur les Séries Temporelles & l'ALM

Jeu de données utilisé : `ch4_macro_alm_taux.csv` (table SQL `macro_taux`).
Colonnes : `periode`, `date`, `euribor_3m`, `oat_10y`, `inflation_hicp`, `spread_corp_bbb`, `rendement_actions_pct`.

---

### Exercice 4.1 (SQL) : Décalage Temporel avec LAG
- **Énoncé** : Affichez pour chaque date le taux `euribor_3m` actuel et celui du trimestre précédent (`euribor_prec`).
- **Setup** : Table `macro_taux`.
- **Indice** : `LAG(euribor_3m, 1) OVER (ORDER BY date)`.
- **Corrigé** :
```sql
SELECT 
    date,
    euribor_3m,
    LAG(euribor_3m, 1) OVER (ORDER BY date) AS euribor_prec
FROM macro_taux
ORDER BY date;
```
*Explication* : La clause `OVER (ORDER BY date)` garantit l'alignement chronologique de la fenêtre.

---

### Exercice 4.2 (SQL) : Variation Absolue Trimestrielle ($\Delta r_t$)
- **Énoncé** : Calculez la variation trimestrielle du taux souverain 10 ans : $\Delta \text{oat} = \text{oat}_t - \text{oat}_{t-1}$.
- **Setup** : Table `macro_taux`.
- **Indice** : `oat_10y - LAG(oat_10y, 1) OVER (ORDER BY date)`.
- **Corrigé** :
```sql
SELECT 
    date,
    oat_10y,
    ROUND(oat_10y - LAG(oat_10y, 1) OVER (ORDER BY date), 3) AS delta_oat_10y
FROM macro_taux
ORDER BY date;
```
*Explication* : La différenciation première permet de passer d'un niveau de taux à un choc de taux.

---

### Exercice 4.3 (SQL) : Anticipation Future avec LEAD
- **Énoncé** : Affichez pour chaque trimestre l'inflation actuelle et l'inflation du trimestre suivant ($t+1$).
- **Setup** : Table `macro_taux`.
- **Indice** : `LEAD(inflation_hicp, 1) OVER (ORDER BY date)`.
- **Corrigé** :
```sql
SELECT 
    periode,
    inflation_hicp,
    LEAD(inflation_hicp, 1) OVER (ORDER BY date) AS inflation_future
FROM macro_taux
ORDER BY date;
```
*Explication* : `LEAD` projette la valeur future sans nécessiter de jointure décalée.

---

### Exercice 4.4 (SQL) : Choc de Spread de Crédit
- **Énoncé** : Calculez la variation en points de base du `spread_corp_bbb` d'un trimestre sur l'autre.
- **Setup** : Table `macro_taux`.
- **Indice** : `spread_corp_bbb - LAG(spread_corp_bbb, 1) OVER (ORDER BY date)`.
- **Corrigé** :
```sql
SELECT 
    periode,
    spread_corp_bbb,
    ROUND(spread_corp_bbb - LAG(spread_corp_bbb, 1) OVER (ORDER BY date), 1) AS variation_spread_bps
FROM macro_taux
ORDER BY date;
```
*Explication* : Mesure l'élargissement ou le resserrement des spreads de crédit d'entreprises.

---

### Exercice 4.5 (SQL) : Taux de Croissance en Pourcentage
- **Énoncé** : Calculez la variation relative en pourcentage de l'indice des prix : $\frac{\text{inf}_t - \text{inf}_{t-1}}{\text{inf}_{t-1}} \times 100$.
- **Setup** : Table `macro_taux`.
- **Indice** : `(actuel - lag) / lag * 100`.
- **Corrigé** :
```sql
SELECT 
    periode,
    inflation_hicp,
    ROUND((inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY date)) 
          / LAG(inflation_hicp, 1) OVER (ORDER BY date) * 100, 2) AS inflation_acceleration_pct
FROM macro_taux
WHERE inflation_hicp IS NOT NULL
ORDER BY date;
```
*Explication* : Mesure l'accélération de l'inflation pour l'indexation des rentes viagères.

---

### Exercice 4.6 (SQL) : Moyenne Mobile Glissante sur 4 Trimestres
- **Énoncé** : Calculez la moyenne mobile annuelle (4 trimestres : 3 précédents + trimestre courant) du taux `euribor_3m`.
- **Setup** : Table `macro_taux`.
- **Indice** : `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW`.
- **Corrigé** :
```sql
SELECT 
    date,
    euribor_3m,
    ROUND(AVG(euribor_3m) OVER (
        ORDER BY date 
        ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
    ), 3) AS euribor_mm4
FROM macro_taux
ORDER BY date;
```
*Explication* : Lisse les fluctuations trimestrielles pour dégager la tendance sous-jacente.

---

### Exercice 4.7 (SQL) : Somme Cumulée des Rendements
- **Énoncé** : Calculez la somme cumulée des rendements d'actions au fil du temps.
- **Setup** : Table `macro_taux`.
- **Indice** : `SUM(rendement_actions_pct) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING)`.
- **Corrigé** :
```sql
SELECT 
    periode,
    rendement_actions_pct,
    ROUND(SUM(rendement_actions_pct) OVER (
        ORDER BY date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ), 2) AS perf_cumulee_actions
FROM macro_taux
ORDER BY date;
```
*Explication* : Trace la courbe de richesse cumulée du portefeuille d'actions.

---

### Exercice 4.8 (SQL) : Classement de Volatilité avec DENSE_RANK
- **Énoncé** : Classez les trimestres selon la magnitude du rendement boursier décroissant (`ABS(rendement_actions_pct)`).
- **Setup** : Table `macro_taux`.
- **Indice** : `DENSE_RANK() OVER (ORDER BY ABS(rendement_actions_pct) DESC)`.
- **Corrigé** :
```sql
SELECT 
    periode,
    rendement_actions_pct,
    DENSE_RANK() OVER (ORDER BY ABS(rendement_actions_pct) DESC) AS rang_choc
FROM macro_taux
ORDER BY rang_choc ASC
LIMIT 10;
```
*Explication* : Isole instantanément les trimestres de crise financière (ex: Q1 2020).

---

### Exercice 4.9 (SQL) : Détection des Régimes de Taux Négatifs
- **Énoncé** : Calculez le nombre cumulé de trimestres passés en territoire de taux négatif (`euribor_3m < 0`).
- **Setup** : Table `macro_taux`.
- **Indice** : `SUM(CASE WHEN euribor_3m < 0 THEN 1 ELSE 0 END) OVER (ORDER BY date)`.
- **Corrigé** :
```sql
SELECT 
    periode,
    euribor_3m,
    SUM(CASE WHEN euribor_3m < 0 THEN 1 ELSE 0 END) OVER (ORDER BY date) AS trimestres_negatifs_cumules
FROM macro_taux
ORDER BY date;
```
*Explication* : Caractérise la durée du régime de politique monétaire non-conventionnelle.

---

### Exercice 4.10 (SQL) : Pente de la Courbe des Taux (Spread 10Y - 3M)
- **Énoncé** : Calculez la pente de la courbe des taux souverains : $\text{Pente} = \text{OAT 10Y} - \text{Euribor 3M}$.
- **Setup** : Table `macro_taux`.
- **Indice** : `oat_10y - euribor_3m`.
- **Corrigé** :
```sql
SELECT 
    periode,
    oat_10y,
    euribor_3m,
    ROUND(oat_10y - euribor_3m, 3) AS pente_courbe_taux
FROM macro_taux
ORDER BY date;
```
*Explication* : Une pente négative (inversion de la courbe des taux) est un prédicteur historique de récession économique.

---

### Exercice 4.11 (Python) : Conversion Temporelle et Indexation
- **Énoncé** : Chargez `ch4_macro_alm_taux.csv`, convertissez `date` en DateTime et positionnez-la comme index du DataFrame.
- **Setup** : `pd.to_datetime()`, `set_index()`.
- **Indice** : `df['date'] = pd.to_datetime(df['date'])` puis `df.set_index('date')`.
- **Corrigé** :
```python
import pandas as pd

df = pd.read_csv('public/data/ch4_macro_alm_taux.csv')
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)
print(df.head(3))
```
*Explication* : Transforme le DataFrame en Série Temporelle native pour Pandas.

---

### Exercice 4.12 (Python) : Différenciation Première avec .diff()
- **Énoncé** : Calculez la variation première $\Delta X_t = X_t - X_{t-1}$ pour `oat_10y` et `euribor_3m`.
- **Setup** : DataFrame temporel `df`.
- **Indice** : `df[['oat_10y', 'euribor_3m']].diff()`.
- **Corrigé** :
```python
df_diff = df[['oat_10y', 'euribor_3m']].diff().dropna()
print(df_diff.head(5))
```
*Explication* : La première valeur devient `NaN` en raison du décalage initial.

---

### Exercice 4.13 (Python) : Test de Stationnarité ADF (Dickey-Fuller Augmenté)
- **Énoncé** : Réalisez le test ADF sur le niveau de `oat_10y` puis sur sa série différenciée `oat_diff`.
- **Setup** : `from statsmodels.tsa.stattools import adfuller`.
- **Indice** : Une p-valeur < 0.05 indique la stationnarité.
- **Corrigé** :
```python
from statsmodels.tsa.stattools import adfuller

p_niveau = adfuller(df['oat_10y'].dropna())[1]
p_diff = adfuller(df['oat_10y'].diff().dropna())[1]

print(f"P-valeur OAT niveau       : {p_niveau:.4f} (Non stationnaire)")
print(f"P-valeur OAT différenciée : {p_diff:.4e} (Stationnaire : I(1))")
```
*Explication* : L'OAT 10 ans est intégrée d'ordre 1 : il faut travailler en variation pour éviter la régression fallacieuse.

---

### Exercice 4.14 (Python) : Matrice d'Autocorrélation Temporelle
- **Énoncé** : Calculez l'autocorrélation d'ordre 1 ($\rho_1$) et d'ordre 4 ($\rho_4$) de la série `euribor_3m`.
- **Setup** : `df['euribor_3m'].autocorr(lag=1)`.
- **Indice** : `.autocorr(lag=...)`.
- **Corrigé** :
```python
rho_1 = df['euribor_3m'].autocorr(lag=1)
rho_4 = df['euribor_3m'].autocorr(lag=4)
print(f"Autocorrélation lag 1 : {rho_1:.4f}")
print(f"Autocorrélation lag 4 : {rho_4:.4f}")
```
*Explication* : Forte persistance caractéristique des taux d'intérêt monétaires.

---

### Exercice 4.15 (Python) : Statistique de Durbin-Watson
- **Énoncé** : Estimez la régression statique de `oat_10y` sur `euribor_3m` et calculez la statistique de Durbin-Watson des résidus.
- **Setup** : `from statsmodels.stats.stattools import durbin_watson`.
- **Indice** : `durbin_watson(model.resid)`.
- **Corrigé** :
```python
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

X = sm.add_constant(df['euribor_3m'].dropna())
y = df['oat_10y'].loc[X.index]
model_statique = sm.OLS(y, X).fit()

dw = durbin_watson(model_statique.resid)
print(f"Statistique Durbin-Watson : {dw:.4f}")
if dw < 1.5:
    print("Présence d'autocorrélation positive sévère des erreurs.")
```
*Explication* : $DW \ll 2$ alerte sur l'invalidation des écarts-types conventionnels.

---

### Exercice 4.16 (Python) : Modèle Dynamique en Différences Premières
- **Énoncé** : Régressez la variation de l'OAT ($\Delta \text{oat}_t$) sur la variation de l'Euribor ($\Delta \text{euribor}_t$) et la variation de l'inflation ($\Delta \text{inf}_t$).
- **Setup** : Séries différenciées `.diff().dropna()`.
- **Indice** : Modèle exempt de racine unitaire.
- **Corrigé** :
```python
delta_df = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()
X_dyn = sm.add_constant(delta_df[['euribor_3m', 'inflation_hicp']])
y_dyn = delta_df['oat_10y']

model_dyn = sm.OLS(y_dyn, X_dyn).fit()
print(model_dyn.summary())
```
*Explication* : Mesure la sensibilité instantanée du taux long aux chocs monétaires et inflationnistes.

---

### Exercice 4.17 (Python) : Correction Robuste Newey-West (HAC)
- **Énoncé** : Ajustez le modèle précédent avec la correction HAC de Newey-West en fixant 3 retards.
- **Setup** : `cov_type='HAC', cov_kwds={'maxlags': 3}`.
- **Indice** : Erreurs consistantes à l'hétéroscédasticité et à l'autocorrélation.
- **Corrigé** :
```python
model_hac = sm.OLS(y_dyn, X_dyn).fit(cov_type='HAC', cov_kwds={'maxlags': 3})
print("P-valeurs corrigées HAC :\n", model_hac.pvalues.round(4))
```
*Explication* : Standard de rigueur pour les publications économétriques et les stress-tests bancaires.

---

### Exercice 4.18 (Python) : Value-at-Risk ($VaR_{99.5\%}$) Historique
- **Énoncé** : Calculez la Value-at-Risk trimestrielle à 99.5% sur le portefeuille d'actions par la méthode empirique (quantile 0.5%).
- **Setup** : Série `df['rendement_actions_pct']`.
- **Indice** : `df['rendement_actions_pct'].quantile(0.005)`.
- **Corrigé** :
```python
var_historique = -df['rendement_actions_pct'].quantile(0.005)
print(f"VaR 99.5% Historique : {var_historique:.2f} %")
```
*Explication* : Perte trimestrielle maximale dépassée une fois tous les 200 trimestres (50 ans).

---

### Exercice 4.19 (Python) : Value-at-Risk ($VaR_{99.5\%}$) Paramétrique
- **Énoncé** : Calculez la $VaR_{99.5\%}$ paramétrique sous hypothèse normale : $VaR = -(\mu - 2.576 \times \sigma)$.
- **Setup** : `mu = rendement.mean()`, `sigma = rendement.std()`.
- **Indice** : $2.576$ correspond au quantile normal $z_{0.995}$.
- **Corrigé** :
```python
rendements = df['rendement_actions_pct'].dropna()
mu = rendements.mean()
sigma = rendements.std()
var_parametrique = -(mu - 2.576 * sigma)
print(f"Moyenne : {mu:.2f} % | Écart-type : {sigma:.2f} %")
print(f"VaR 99.5% Paramétrique : {var_parametrique:.2f} %")
```
*Explication* : Formule réglementaire Solvabilité II pour l'exigence de capital de solvabilité (SCR Marché).

---

### Exercice 4.20 (Python) : Graphique Matplotlib de la Courbe des Taux
- **Énoncé** : Tracez l'évolution conjointe de l'Euribor 3M, de l'OAT 10 Ans et de l'inflation HICP de 2010 à 2024.
- **Setup** : `plt.plot()`.
- **Indice** : Utilisez des couleurs distinctes et une légende claire.
- **Corrigé** :
```python
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 4.5))
plt.plot(df.index, df['oat_10y'], label='OAT 10Y (Souverain)', color='#38bdf8', linewidth=2)
plt.plot(df.index, df['euribor_3m'], label='Euribor 3M (Monétaire)', color='#34d399', linewidth=2)
plt.plot(df.index, df['inflation_hicp'], label='Inflation HICP', color='#f59e0b', linestyle='--', linewidth=1.5)
plt.axhline(0, color='#64748b', linestyle=':', alpha=0.7)
plt.title("Dynamique des Taux & Inflation (ALM Macro)", fontsize=12)
plt.ylabel("Taux d'intérêt annuel (%)")
plt.legend()
plt.tight_layout()
plt.show()
```
*Explication* : Rendu visuel indispensable pour les comités d'investissement ALM.

---

### Exercice 4.21 (SQL Intermédiaire) : Détection des Chocs Supérieurs à 50 bps
- **Énoncé** : Isolez les trimestres où le taux OAT a varié de plus de 50 points de base en valeur absolue par rapport au trimestre précédent.
- **Setup** : CTE ou sous-requête avec `LAG`.
- **Indice** : `WHERE ABS(delta) >= 0.50`.
- **Corrigé** :
```sql
WITH variations AS (
    SELECT 
        periode,
        date,
        oat_10y,
        ROUND(oat_10y - LAG(oat_10y, 1) OVER (ORDER BY date), 3) AS variation_oat
    FROM macro_taux
)
SELECT periode, date, oat_10y, variation_oat
FROM variations
WHERE ABS(variation_oat) >= 0.50
ORDER BY ABS(variation_oat) DESC;
```
*Explication* : Identifie les chocs de taux majeurs nécessitant un rebalancement de portefeuille obligataire.

---

### Exercice 4.22 (Python Intermédiaire) : Modèle Autorégressif AR(1)
- **Énoncé** : Estimez un modèle autorégressif d'ordre 1 $r_t = c + \phi r_{t-1} + \varepsilon_t$ sur le taux Euribor avec Statsmodels.
- **Setup** : Création de la colonne décalée `df['euribor_lag'] = df['euribor_3m'].shift(1)`.
- **Indice** : `sm.OLS(df['euribor_3m'], sm.add_constant(df['euribor_lag'])).fit()`.
- **Corrigé** :
```python
df['euribor_lag'] = df['euribor_3m'].shift(1)
df_ar = df.dropna(subset=['euribor_3m', 'euribor_lag'])

X_ar = sm.add_constant(df_ar['euribor_lag'])
y_ar = df_ar['euribor_3m']

model_ar1 = sm.OLS(y_ar, X_ar).fit()
phi = model_ar1.params['euribor_lag']
print(f"Coefficient de persistance AR(1) (phi) : {phi:.4f}")
print(f"Demi-vie du choc : {np.log(0.5) / np.log(phi):.1f} trimestres")
```
*Explication* : Quantifie la vitesse de retour à la moyenne des taux d'intérêt.

---

### Exercice 4.23 (Python Intermédiaire) : Test de Normalité de Jarque-Bera
- **Énoncé** : Testez si les rendements d'actions suivent une distribution normale avec le test de Jarque-Bera.
- **Setup** : `from statsmodels.stats.stattools import jarque_bera`.
- **Indice** : Rejet si p-valeur < 0.05.
- **Corrigé** :
```python
from statsmodels.stats.stattools import jarque_bera

jb_stat, p_val, skew, kurtosis = jarque_bera(df['rendement_actions_pct'].dropna())
print(f"Statistique JB : {jb_stat:.2f} | P-valeur : {p_val:.4e}")
print(f"Asymétrie : {skew:.2f} | Aplatissement (Kurtosis) : {kurtosis:.2f}")
if p_val < 0.05:
    print("Normalité rejetée : queue épaisse (Fat Tails), prudence sur la VaR normale.")
```
*Explication* : Démontre pourquoi la VaR paramétrique sous-estime souvent le risque extrême réel.

---

### Exercice 4.24 (Python Intermédiaire) : QQ-Plot des Rendements Financiers
- **Énoncé** : Tracez le diagramme Quantile-Quantile (QQ-plot) des rendements boursiers face à la loi normale standard.
- **Setup** : `import statsmodels.api as sm`, `sm.qqplot()`.
- **Indice** : `sm.qqplot(..., line='s')`.
- **Corrigé** :
```python
fig = sm.qqplot(df['rendement_actions_pct'].dropna(), line='s')
plt.title("QQ-Plot des Rendements Financiers vs Loi Normale")
plt.tight_layout()
plt.show()
```
*Explication* : L'écart aux extrémités de la ligne rouge matérialise les krachs et les sauts de marché.

---

### Exercice 4.25 (Cas Pratique de Synthèse Ch. 4) : Stress-Test ALM Solvabilité II
- **Énoncé** :
  1. En SQL, calculez la variation moyenne et le choc maximal trimestriel de l'OAT 10Y.
  2. En Python, modélisez l'impact sur un portefeuille d'assurance-vie de 100 millions d'euros ayant une sensibilité (duration modifiée) $D^* = 7.5$ années face à un choc de taux à la hausse de $+200\text{ bps}$ ($+2.0\%$) :
     $$\Delta V \approx -D^* \times \Delta y \times V_0$$
- **Setup** : Portefeuille obligataire ALM.
- **Indice** : $\Delta V = -7.5 \times 0.02 \times 100\,000\,000$.
- **Corrigé** :
*Requête SQL de Diagnostic* :
```sql
SELECT 
    ROUND(AVG(ABS(oat_10y - LAG(oat_10y, 1) OVER (ORDER BY date))), 3) AS choc_moyen_absolu,
    ROUND(MAX(ABS(oat_10y - LAG(oat_10y, 1) OVER (ORDER BY date))), 3) AS choc_maximal_trimestriel
FROM macro_taux;
```
*Calcul Python de la Perte en Capital ALM* :
```python
valeur_portefeuille_initiale = 100_000_000 # 100 M€
duration_modifiee = 7.5 # ans
choc_taux = +0.02 # +200 bps

# Formule d'approximation du premier ordre (sensibilité duration)
perte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille_initiale
nouvelle_valeur = valeur_portefeuille_initiale + perte_estimee

print("=== Rapport de Stress-Test ALM (Solvabilité II) ===")
print(f"Valeur initiale de l'Actif : {valeur_portefeuille_initiale:,.2f} €")
print(f"Choc de taux simulé         : {choc_taux * 10000:.0f} bps")
print(f"Perte en capital estimée    : {perte_estimee:,.2f} € ({perte_estimee / valeur_portefeuille_initiale * 100:.1f} %)")
print(f"Valeur stressée de l'Actif  : {nouvelle_valeur:,.2f} €")
```
*Explication* : Le stress-test ALM par sensibilité de duration est l'outil fondamental de gestion des risques pour les assureurs et banques.
