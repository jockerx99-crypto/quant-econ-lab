import { CourseModule } from "@/types/course";

export const V4_PY_PORTFOLIO_MODULE: CourseModule = {
  id: "v4-py-portfolio",
  title: "Portfolio Python : ALM, Markowitz, Pricing & Actuariat",
  subtitle:
    "4 Grands Projets Fil Rouge modulaires (Classes, Dataclasses, Graphiques & Tests) prêts pour GitHub",
  icon: "Award",
  description:
    "Quatre projets d'ingénierie quantitative et actuarielle conçus pour constituer un portfolio GitHub de niveau senior : moteur ALM & Solvabilité II par dataclasses et Monte Carlo corrélé, optimiseur Markowitz contraint avec shrinkage de Ledoit-Wolf et backtesting multi-actifs, librairie Black-Scholes-Merton avec Monte Carlo antithétique et solveur hybride de smile, et moteur technique IARD couplé au provisionnement Chain-Ladder.",
  exercises: [
    // =========================================================================
    // PROJET 1 : MOTEUR ALM & STRESS-TEST SOLVABILITE II D'UN ASSUREUR
    // =========================================================================
    {
      id: "v4-py-1",
      title: "Projet 1 — Moteur ALM & Stress-Test Solvabilité II d'un Assureur",
      category: "alm",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 60,
      description:
        "Architecturez un moteur ALM orienté objet (@dataclass Obligation et BilanALM) calibré sur df_taux et df_actifs, chiffrez le SCR Formule Standard (+200/-100 bps, -39% actions), contrôlez l'approximation de Taylor d'ordre 2, simulez 1 000 chocs Monte Carlo corrélés et produisez un tableau de bord Matplotlib à deux panneaux.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Gestion Actif-Passif (ALM), Solvabilité II & Modèle Interne

#### Intuition Économique & Enjeux d'un Bilan d'Assureur
Sous le référentiel prudentiel européen **Solvabilité II**, les actifs et les engagements techniques d'un assureur (*Best Estimate of Liabilities*, BEL) sont valorisés en **valeur de marché économique** (*mark-to-market* / *mark-to-model*). Les **Fonds Propres Économiques** ($E_0 = A_0 - L_0$) constituent le coussin absorbant les chocs financiers extrêmes à horizon $1$ an (quantile bicentenaire $99.5\\%$).

Lorsqu'un assureur détient un portefeuille obligataire souverain de duration supérieure à celle de son passif ($\\text{DV01}_A > \\text{DV01}_L$), une remontée brutale des taux ($+200\\text{ bps}$) déprime davantage l'actif obligataire que la provision mathématique actualisée au passif, détruisant des fonds propres. Parallèlement, la poche actions (typiquement $15\\%$ à $25\\%$ de l'actif général) subit le choc réglementaire **Actions Type 1 de $-39\\%$** (hors ajustement symétrique).

#### Démonstration Mathématique Formelle
1. **Valorisation Obligataire & Sensibilités Exactes :**
   Pour une obligation de nominal $N$, coupon annuel $c$, maturité $T$ et taux actuariel $y$, le prix $P(y)$, la duration modifiée $D^*$, la convexité $\\mathcal{C}$ et la sensibilité au point de base ($\\text{DV01}$) s'écrivent :
   $$P(y) = \\sum_{t=1}^T \\frac{CF_t}{(1+y)^t}, \\qquad D^* = \\frac{1}{P(y)(1+y)}\\sum_{t=1}^T t\\frac{CF_t}{(1+y)^t}, \\qquad \\mathcal{C} = \\frac{1}{P(y)(1+y)^2}\\sum_{t=1}^T t(t+1)\\frac{CF_t}{(1+y)^t}$$
   $$\\text{DV01} = P(y) \\cdot D^* \\cdot 10^{-4}$$

2. **Développement de Taylor d'Ordre 2 sur les Fonds Propres :**
   Sous un choc parallèle $\\Delta y$ et un rendement actions $\\Delta e$, l'approximation quadratique bilan s'exprime via les durations et convexités agrégées de l'actif ($A_0$, avec duration nulle sur les actions) et du passif ($L_0$) :
   $$\\Delta E_{\\text{T2}} \\approx A_0\\left(-D_A^* \\Delta y + \\frac{1}{2}\\mathcal{C}_A (\\Delta y)^2\\right) + A_{\\text{eq}} \\Delta e - L_0\\left(-D_L^* \\Delta y + \\frac{1}{2}\\mathcal{C}_L (\\Delta y)^2\\right)$$

3. **Agrégation du SCR Marché (Formule Standard) :**
   Les sous-modules individuels valent $\\text{SCR}_{\\text{taux}} = \\max(0, E_0 - E_{\\text{up}}, E_0 - E_{\\text{down}})$ et $\\text{SCR}_{\\text{eq}} = \\max(0, E_0 - E_{-39\\%})$. Sous Solvabilité II, la corrélation $\\rho_{\\text{mkt}}$ entre taux et actions vaut $0$ si le scénario mordant est la hausse des taux (et $0.50$ si c'est la baisse) :
   $$\\text{SCR}_{\\text{std}} = \\sqrt{\\text{SCR}_{\\text{taux}}^2 + \\text{SCR}_{\\text{eq}}^2 + 2\\rho_{\\text{mkt}}\\,\\text{SCR}_{\\text{taux}}\\,\\text{SCR}_{\\text{eq}}}, \\qquad \\text{Ratio}_{\\text{S2}} = \\frac{E_0}{\\text{SCR}_{\\text{std}}}$$

4. **Modèle Interne Monte Carlo Bivarié (Cholesky) :**
   À partir de tirages normaux indépendants $\\mathbf{Z}_0 \\sim \\mathcal{N}(\\mathbf{0}, I_2)$ et d'une corrélation taux/actions $\\rho = -0.25$, la décomposition de Cholesky $L L^\\top = R$ génère des chocs conjoints :
   $$\\Delta y_k = \\sigma_y Z_{k,1}, \\qquad \\Delta e_k = \\exp\\!\\left(\\left(\\mu_{\\text{eq}} - \\frac{1}{2}\\sigma_{\\text{eq}}^2\\right) + \\sigma_{\\text{eq}} Z_{k,2}\\right) - 1, \\qquad \\text{SCR}_{99.5\\%} = Q_{0.995}(E_0 - E_k)$$

### 💻 Masterclass Python : Architecture Modulaire & Dataclasses

* **Modélisation typée (\`@dataclass\`) :** Encapsuler chaque titre dans \`Obligation\` et le bilan complet dans \`BilanALM\` évite les dictionnaires fragiles et permet de réévaluer tout le bilan par un appel pur \`bilan.evaluer(choc_taux, choc_actions)\` sans muter l'état de base.
* **Calibration Data-Driven sur \`df_taux\` et \`df_actifs\` :** Extraire la courbe la plus récente (\`2023-12-31\`) et estimer $\\sigma_y = \\text{std}(\\Delta y_{10\\text{ans}}) \\times \\sqrt{12}$ ancre la simulation interne dans les données historiques réelles.
* **Reproductibilité moderne (\`np.random.default_rng(42)\`) :** Le générateur PCG64 garantit une isolation parfaite des tirages par rapport à l'état global NumPy.

\`\`\`python
from dataclasses import dataclass
import numpy as np

@dataclass
class ObligationMini:
    nominal: float
    coupon: float
    maturite: int
    taux: float

ob = ObligationMini(100.0, 0.035, 10, float(df_taux.sort_values('date')['taux_10y'].iloc[-1]) / 100.0)
t = np.arange(1, ob.maturite + 1, dtype=float)
cf = np.full(ob.maturite, ob.nominal * ob.coupon); cf[-1] += ob.nominal
pv = cf / ((1.0 + ob.taux) ** t)
px = float(pv.sum())
dmod = float((t * pv).sum() / px / (1.0 + ob.taux))
conv = float((t * (t + 1.0) * pv).sum() / (px * (1.0 + ob.taux) ** 2))
px_up = float((cf / ((1.0 + ob.taux + 0.02) ** t)).sum())
px_t2 = px * (1.0 - dmod * 0.02 + 0.5 * conv * (0.02 ** 2))
print(f"OAT 10Y (y={ob.taux:.2%}) -> Prix={px:.4f} EUR | D*={dmod:.4f} | Conv={conv:.2f} | DV01={px*dmod*1e-4:.4f}")
print(f"Choc +200 bps -> Exact={px_up:.4f} EUR | Taylor2={px_t2:.4f} EUR | Ecart={px_t2 - px_up:+.4f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
OAT 10Y (y=2.55%) -> Prix=108.2930 EUR | D*=8.4562 | Conv=86.23 | DV01=0.0916
Choc +200 bps -> Exact=91.7120 EUR | Taylor2=91.8456 EUR | Ecart=+0.1336 EUR
\`\`\`

### 📦 Export Portfolio GitHub (Architecture & README)

\`\`\`text
alm-solvency2-engine/
├── README.md                  # Contexte S2, formules Taylor/SCR & capture dashboard 2 panneaux
├── pyproject.toml             # Dépendances (numpy, pandas, matplotlib) & config pytest
├── assets/
│   └── alm_dashboard.png      # Graphique stress-tests + distribution MC 99.5%
├── src/
│   ├── __init__.py
│   ├── instruments.py         # @dataclass Obligation & pricer_obligation()
│   ├── balance_sheet.py       # @dataclass BilanALM (evaluer, taylor_ordre_2)
│   └── solvency_engine.py     # SCR Formule Standard & simulateur Monte Carlo Cholesky
└── tests/
    └── test_alm_engine.py     # Invariants DV01, convergence Taylor 2 et bornes SCR
\`\`\`

* **Feuille de route *scaling* hors navigateur :** Connecter un flux automatique de courbe souveraine ECB SDW / Banque de France (API SDMX) à la place de \`df_taux\`, vectoriser les portefeuilles multi-obligations par matrice creuse de cash-flows, et exécuter \`pytest --cov=src\` via GitHub Actions à chaque commit.
* **Questions classiques d'entretien Quant / Actuaire :**
  1. *Pourquoi la corrélation Solvabilité II entre taux et actions passe-t-elle de $0$ (choc hausse) à $0.50$ (choc baisse) ?* Parce qu'en régime de déflation / crise (*flight-to-quality*), la chute des actions coïncide historiquement avec une baisse des taux souverains, cumulant hausse du BEL et perte actions.
  2. *Quelle est la limite de l'approximation Taylor d'ordre 2 sur un passif d'assurance vie en euros ?* Elle suppose des flux déterministes sans optionnalité ; en présence de taux minimum garantis ou de rachats dynamiques, seule une réévaluation stochastique (*nested stochastic*) capture la convexité négative des options cachées.
  3. *Comment garantir l'absence de corrélation artificielle entre deux générateurs aléatoires en production ?* Instancier des \`np.random.Generator\` indépendants via \`default_rng(seed)\` et décomposer la matrice de corrélation cible par Cholesky avant toute projection.
      `,
      taskMarkdown: `**🎯 Cahier des Charges Portfolio (Architecture & Contrats d'API) :**

Implémentez un moteur ALM modulaire calibré sur \`df_taux\` (dernière courbe \`2023-12-31\`) et \`df_actifs\` en respectant strictement les noms suivants :

1. **\`@dataclass class Obligation\` & \`pricer_obligation(ob, choc_taux=0.0)\`** :
   - Attributs de \`Obligation\` : \`nom: str\`, \`nominal: float\`, \`taux_coupon: float\`, \`maturite: int\`, \`taux_actuariel: float\`.
   - \`pricer_obligation(ob, choc_taux=0.0)\` applique \`y = max(1e-4, ob.taux_actuariel + choc_taux)\` et retourne le quadruplet \`(prix, duration_mod, convexite, dv01)\` en \`float\`.
2. **\`@dataclass class BilanALM\`** :
   - Attributs : \`obligations_actif: List[Obligation]\`, \`poche_actions: float\`, \`passif_bel: Obligation\`.
   - Méthode \`evaluer(self, choc_taux=0.0, choc_actions=0.0)\` retournant un dictionnaire contenant \`'actif_oblig'\`, \`'actif_actions'\`, \`'actif_total'\`, \`'passif_bel'\`, \`'fonds_propres'\`, \`'dmod_actif'\`, \`'conv_actif'\`, \`'dv01_actif'\`, \`'dmod_passif'\`, \`'conv_passif'\`, \`'dv01_passif'\` et \`'gap_dv01'\`.
   - Méthode \`taylor_ordre_2(self, base, dy=0.0, de=0.0)\` calculant l'approximation quadratique des Fonds Propres à partir de \`base = bilan.evaluer()\`.
3. **Instanciation du Bilan sur \`df_taux\`** :
   - Extrayez \`y_5y\` (\`taux_5y / 100\`) et \`y_10y\` (\`taux_10y / 100\`) à la dernière date triée de \`df_taux\`.
   - Actif obligataire : \`OAT 5Y 3.0%\` (nominal \`40e6\`, coupon \`0.030\`, maturité \`5\`, taux \`y_5y\`) et \`OAT 10Y 3.5%\` (nominal \`65e6\`, coupon \`0.035\`, maturité \`10\`, taux \`y_10y\`).
   - Poche actions : \`25_000_000.0\` EUR. Passif BEL : \`BEL Vie 6Y 2.5%\` (nominal \`118e6\`, coupon \`0.025\`, maturité \`6\`, taux \`y_10y\`).
   - Stockez le bilan de base dans \`res_bilan = bilan.evaluer()\`.
4. **SCR Formule Standard & Table \`df_scenarios\`** :
   - Calculez \`scr_taux\` (pire perte sous \`+200 bps\` et \`-100 bps\`), \`scr_actions\` (choc \`-39%\`), \`scr_standard\` (avec $\\rho_{\\text{S2}} = 0.0$ si hausse dominante, sinon $0.50$) et \`solvency_ratio_base = fp0 / scr_standard\`.
   - Construisez \`df_scenarios\` (5 lignes : \`'Base'\`, \`'Taux +200 bps'\`, \`'Taux -100 bps'\`, \`'Actions -39%'\`, \`'Combine (+200/-39%)'\`) avec colonnes \`['Scenario', 'Choc_Taux_bps', 'Choc_Actions_pct', 'FP_Exact', 'FP_Taylor2', 'Delta_FP', 'Ratio_Solvabilite']\`.
5. **Monte Carlo Corrélé (1 000 tirages, \`default_rng(42)\`) & Dashboard 2 Panneaux** :
   - Calibrez \`vol_r\` annualisée sur les variations mensuelles de \`taux_10y / 100\`, \`mu_eq\` et \`vol_eq\` sur les moyennes de \`df_actifs\`, corrélez à $\\rho = -0.25$ par Cholesky sur \`1000\` tirages et calculez \`scr_995 = float(np.quantile(pertes_mc, 0.995))\`.
   - Vérifiez les invariants par \`assert\` et tracez un dashboard \`plt.subplots(1, 2)\` (sans \`plt.show()\`) comparant les 5 scénarios et la distribution Monte Carlo.`,
      initialCode: "# Rédigez votre architecture Python Portfolio ci-dessous :\n",
      solutionCode: `from dataclasses import dataclass
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

@dataclass
class Obligation:
    """Instrument obligataire à taux fixe et coupons annuels."""
    nom: str
    nominal: float
    taux_coupon: float
    maturite: int
    taux_actuariel: float

def pricer_obligation(ob: Obligation, choc_taux: float = 0.0) -> Tuple[float, float, float, float]:
    """Retourne (prix, duration_mod, convexite, dv01) sous choc parallèle de taux."""
    y = max(1e-4, ob.taux_actuariel + choc_taux)
    t = np.arange(1, ob.maturite + 1, dtype=float)
    flux = np.full(ob.maturite, ob.nominal * ob.taux_coupon, dtype=float)
    flux[-1] += ob.nominal
    pv = flux / ((1.0 + y) ** t)
    prix = float(np.sum(pv))
    duration_mod = float(np.sum(t * pv) / prix / (1.0 + y))
    convexite = float(np.sum(t * (t + 1.0) * pv) / (prix * ((1.0 + y) ** 2)))
    return prix, duration_mod, convexite, float(prix * duration_mod * 1e-4)

@dataclass
class BilanALM:
    """Bilan économique Actif-Passif Solvabilité II."""
    obligations_actif: List[Obligation]
    poche_actions: float
    passif_bel: Obligation

    def evaluer(self, choc_taux: float = 0.0, choc_actions: float = 0.0) -> Dict[str, float]:
        """Réévalue Actif, Passif BEL, Fonds Propres et sensibilités."""
        pv_ob, dv01_a, conv_num = 0.0, 0.0, 0.0
        for ob in self.obligations_actif:
            p, _, conv, dv01 = pricer_obligation(ob, choc_taux)
            pv_ob += p; dv01_a += dv01; conv_num += p * conv
        pv_act = float(self.poche_actions * (1.0 + choc_actions))
        actif_tot = pv_ob + pv_act
        pv_pas, dmod_l, conv_l, dv01_l = pricer_obligation(self.passif_bel, choc_taux)
        return {
            'actif_oblig': pv_ob, 'actif_actions': pv_act, 'actif_total': actif_tot,
            'passif_bel': pv_pas, 'fonds_propres': actif_tot - pv_pas,
            'dmod_actif': (dv01_a * 1e4) / actif_tot, 'conv_actif': conv_num / actif_tot,
            'dv01_actif': dv01_a, 'dmod_passif': dmod_l, 'conv_passif': conv_l,
            'dv01_passif': dv01_l, 'gap_dv01': dv01_a - dv01_l,
        }

    def taylor_ordre_2(self, base: Dict[str, float], dy: float = 0.0, de: float = 0.0) -> float:
        """Approximation Taylor Ordre 2 des Fonds Propres face aux chocs (dy, de)."""
        da = base['actif_total'] * (-base['dmod_actif'] * dy + 0.5 * base['conv_actif'] * dy ** 2) + base['actif_actions'] * de
        dl = base['passif_bel'] * (-base['dmod_passif'] * dy + 0.5 * base['conv_passif'] * dy ** 2)
        return float(base['fonds_propres'] + da - dl)

taux_last = df_taux.sort_values('date').iloc[-1]
y_5y, y_10y = float(taux_last['taux_5y']) / 100.0, float(taux_last['taux_10y']) / 100.0
bilan = BilanALM(
    obligations_actif=[Obligation("OAT 5Y 3.0%", 40e6, 0.030, 5, y_5y), Obligation("OAT 10Y 3.5%", 65e6, 0.035, 10, y_10y)],
    poche_actions=25_000_000.0,
    passif_bel=Obligation("BEL Vie 6Y 2.5%", 118e6, 0.025, 6, y_10y),
)
res_bilan = bilan.evaluer()
fp0 = res_bilan['fonds_propres']

e_up, e_down = bilan.evaluer(choc_taux=0.02)['fonds_propres'], bilan.evaluer(choc_taux=-0.01)['fonds_propres']
e_eq = bilan.evaluer(choc_actions=-0.39)['fonds_propres']
scr_taux = float(max(0.0, fp0 - e_up, fp0 - e_down))
scr_actions = float(max(0.0, fp0 - e_eq))
rho_s2 = 0.0 if (fp0 - e_up) >= (fp0 - e_down) else 0.50
scr_standard = float(np.sqrt(scr_taux ** 2 + scr_actions ** 2 + 2.0 * rho_s2 * scr_taux * scr_actions))
solvency_ratio_base = float(fp0 / scr_standard)

specs = [('Base', 0.0, 0.0), ('Taux +200 bps', 0.02, 0.0), ('Taux -100 bps', -0.01, 0.0),
         ('Actions -39%', 0.0, -0.39), ('Combine (+200/-39%)', 0.02, -0.39)]
rows_scen = []
for nom, dy, de in specs:
    fp_ex = bilan.evaluer(dy, de)['fonds_propres']
    rows_scen.append({
        'Scenario': nom, 'Choc_Taux_bps': int(dy * 10000), 'Choc_Actions_pct': round(de * 100, 1),
        'FP_Exact': fp_ex, 'FP_Taylor2': bilan.taylor_ordre_2(res_bilan, dy, de),
        'Delta_FP': fp_ex - fp0, 'Ratio_Solvabilite': fp_ex / scr_standard,
    })
df_scenarios = pd.DataFrame(rows_scen)
rng = np.random.default_rng(42)
vol_r = float(np.std((df_taux.sort_values('date')['taux_10y'].diff().dropna() / 100.0).to_numpy(), ddof=1) * np.sqrt(12))
mu_eq, vol_eq = float(df_actifs['rendement_espere'].mean()), float(df_actifs['volatilite'].mean())
Z = rng.standard_normal((1000, 2)) @ np.linalg.cholesky(np.array([[1.0, -0.25], [-0.25, 1.0]])).T
fp_mc = np.array([bilan.evaluer(float(vol_r * z0), float(np.exp((mu_eq - 0.5 * vol_eq ** 2) + vol_eq * z1) - 1.0))['fonds_propres'] for z0, z1 in Z])
pertes_mc = fp0 - fp_mc
scr_995 = float(np.quantile(pertes_mc, 0.995))
assert res_bilan['gap_dv01'] > 0 and scr_taux > 0 and scr_standard > scr_actions
assert abs(df_scenarios.loc[1, 'FP_Taylor2'] - df_scenarios.loc[1, 'FP_Exact']) < 100_000.0

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
x = np.arange(len(df_scenarios))
ax1.bar(x, df_scenarios['FP_Exact'] / 1e6, color=['#0f172a', '#0284c7', '#10b981', '#f59e0b', '#e11d48'], alpha=0.85, label='FP Exact')
ax1.scatter(x, df_scenarios['FP_Taylor2'] / 1e6, color='#fbbf24', edgecolor='#0f172a', zorder=5, s=55, label='Taylor Ordre 2')
ax1.axhline(scr_standard / 1e6, color='#dc2626', ls='--', lw=1.4, label=f'SCR Std ({scr_standard/1e6:.2f} M)')
ax1.set_xticks(x); ax1.set_xticklabels(df_scenarios['Scenario'], rotation=18, ha='right', fontsize=8)
ax1.set_ylabel('Fonds Propres (M EUR)'); ax1.set_title('Stress-Tests Solvabilité II : Exact vs Taylor 2')
ax1.legend(fontsize=7.5); ax1.grid(True, axis='y', alpha=0.3)
ax2.hist(pertes_mc / 1e6, bins=35, color='#0284c7', alpha=0.72, edgecolor='white')
ax2.axvline(scr_standard / 1e6, color='#f59e0b', ls='--', lw=1.8, label=f'SCR Std ({scr_standard/1e6:.2f} M)')
ax2.axvline(scr_995 / 1e6, color='#e11d48', ls=':', lw=2.0, label=f'SCR MC 99.5% ({scr_995/1e6:.2f} M)')
ax2.set_xlabel('Perte Fonds Propres à 1 an (M EUR)'); ax2.set_ylabel('Fréquence (1 000 tirages)')
ax2.set_title('Modèle Interne Monte Carlo (Taux + Actions)'); ax2.legend(fontsize=7.5); ax2.grid(True, alpha=0.3)

print(f"FP Base : {fp0:,.2f} EUR | Gap DV01 : {res_bilan['gap_dv01']:,.2f} EUR/bp | SCR Std : {scr_standard:,.2f} EUR | Ratio : {solvency_ratio_base:.2%}")
print(f"SCR MC 99.5% : {scr_995:,.2f} EUR")
print(df_scenarios[['Scenario', 'FP_Exact', 'FP_Taylor2', 'Ratio_Solvabilite']].round(4).to_string(index=False))`,
      testPythonCode: `assert 'Obligation' in globals() and 'BilanALM' in globals() and callable(pricer_obligation)
p_test, dm_test, cv_test, dv_test = pricer_obligation(Obligation('Test', 100.0, 0.04, 5, 0.03))
assert np.isclose(p_test, 104.579707, atol=1e-4) and np.isclose(dm_test, 4.5042, atol=1e-3)
assert np.isclose(dv_test, p_test * dm_test * 1e-4, atol=1e-6)
assert np.isclose(res_bilan['actif_oblig'], 111319628.76, atol=10.0)
assert np.isclose(res_bilan['passif_bel'], 117675563.34, atol=10.0)
assert np.isclose(res_bilan['fonds_propres'], 18644065.42, atol=10.0)
assert np.isclose(scr_taux, 2208439.86, atol=10.0)
assert np.isclose(scr_actions, 9750000.0, atol=1.0)
assert np.isclose(scr_standard, 9996984.88, atol=10.0)
assert np.isclose(solvency_ratio_base, 1.864969, atol=1e-4)
assert len(df_scenarios) == 5
assert list(df_scenarios.columns) == ['Scenario', 'Choc_Taux_bps', 'Choc_Actions_pct', 'FP_Exact', 'FP_Taylor2', 'Delta_FP', 'Ratio_Solvabilite']
assert scr_995 > 0.0 and np.isclose(scr_995, 11188156.79, atol=1000.0)`,
      datasets: [],
      hints: [
        "Dans pricer_obligation, actualisez flux = [nominal * coupon, ..., nominal * (1 + coupon)] avec t = np.arange(1, maturite + 1) au taux y = max(1e-4, taux_actuariel + choc_taux).",
        "Pour BilanALM.evaluer, dmod_actif = (dv01_actif * 1e4) / actif_total et conv_actif = sum(p * conv) / actif_total (les actions ont une sensibilité taux nulle).",
        "Pour le Monte Carlo corrélé, calibrez vol_r sur df_taux['taux_10y'].diff().dropna() / 100 * sqrt(12), appliquez np.linalg.cholesky([[1, -0.25], [-0.25, 1]]) avec default_rng(42) et prenez np.quantile(fp0 - fp_mc, 0.995)."
      ],
      guide: {
        theoryToPracticeLink:
          "En combinant les \`@dataclass\` \`Obligation\` et \`BilanALM\` sur la courbe du \`2023-12-31\` ($y_{5\\text{a}}=2.50\\%$, $y_{10\\text{a}}=2.55\\%$), le bilan affiche $18.64\\text{ M EUR}$ de fonds propres et un \`gap_dv01\` positif de $+13\\,596\\text{ EUR/bp}$. Le choc $+200\\text{ bps}$ ($\\text{SCR}_{\\text{taux}} = 2.21\\text{ M EUR}$) et le choc actions $-39\\%$ ($\\text{SCR}_{\\text{eq}} = 9.75\\text{ M EUR}$) donnent un $\\text{SCR}_{\\text{std}} = 10.00\\text{ M EUR}$ (ratio $186.50\\%$), tandis que le modèle interne Monte Carlo chiffre le $Q_{0.995}$ à $11.19\\text{ M EUR}$.",
        stepByStepPlan: [
          "Définir `@dataclass class Obligation` et `pricer_obligation(ob, choc_taux=0.0)` retournant `(prix, duration_mod, convexite, dv01)`.",
          "Construire `@dataclass class BilanALM` avec `evaluer()` (Actif, BEL, Fonds Propres, Gap DV01) et `taylor_ordre_2()`.",
          "Calibrer les 2 OAT et le BEL sur la dernière ligne de `df_taux`, puis calculer `res_bilan`, `scr_taux`, `scr_actions`, `scr_standard` et `solvency_ratio_base`.",
          "Générer `df_scenarios` sur les 5 scénarios et lancer 1 000 simulations Monte Carlo corrélées (`default_rng(42)`) pour `scr_995`.",
          "Vérifier les invariants par `assert` et tracer le dashboard Matplotlib à 2 panneaux (`plt.subplots(1, 2)`)."
        ],
        concepts: [
          {
            symbol: "@dataclass Obligation",
            kind: "Syntaxe",
            roleInExercise: "Structure immuable/typée modélisant chaque titre obligataire et le passif BEL avec ses paramètres contractuels."
          },
          {
            symbol: "pricer_obligation(ob, choc_taux)",
            kind: "Fonction / Méthode",
            roleInExercise: "Moteur vectorisé retournant \`(prix, duration_mod, convexite, dv01)\` sous choc parallèle de taux."
          },
          {
            symbol: "BilanALM.evaluer / taylor_ordre_2",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule l'économie exacte du bilan et la compare au développement quadratique de Taylor d'ordre 2."
          },
          {
            symbol: "df_scenarios",
            kind: "Variable",
            roleInExercise: "DataFrame de 5 scénarios prudentiels comparant \`FP_Exact\`, \`FP_Taylor2\` et \`Ratio_Solvabilite\`."
          },
          {
            symbol: "np.random.default_rng(42)",
            kind: "Fonction / Méthode",
            roleInExercise: "Générateur aléatoire reproductible utilisé avec Cholesky ($\\rho=-0.25$) pour simuler 1 000 scénarios conjoints."
          },
          {
            symbol: "scr_995 / solvency_ratio_base",
            kind: "Variable",
            roleInExercise: "Indicateurs Solvabilité II clés vérifiés par les tests : ratio de base ($186.50\\%$) et SCR interne $99.5\\%$ ($11.19\\text{ M EUR}$)."
          }
        ],
        guidedCode: `from dataclasses import dataclass
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Étape 1 : Dataclass Obligation et moteur de pricing vectorisé
@dataclass
class Obligation:
    nom: str
    nominal: float
    taux_coupon: float
    maturite: int
    taux_actuariel: float

def pricer_obligation(ob: Obligation, choc_taux: float = 0.0) -> Tuple[float, float, float, float]:
    y = max(1e-4, ob.taux_actuariel + choc_taux)
    t = np.arange(1, ob.maturite + 1, dtype=float)
    flux = np.full(ob.maturite, ob.nominal * ob.taux_coupon, dtype=float)
    flux[-1] += ob.nominal
    pv = flux / ((1.0 + y) ** t)
    prix = float(np.sum(pv))
    duration_mod = float(___)
    convexite = float(___)
    return prix, duration_mod, convexite, float(prix * duration_mod * 1e-4)

# Étape 2 : Dataclass BilanALM avec évaluation exacte et Taylor Ordre 2
@dataclass
class BilanALM:
    obligations_actif: List[Obligation]
    poche_actions: float
    passif_bel: Obligation

    def evaluer(self, choc_taux: float = 0.0, choc_actions: float = 0.0) -> Dict[str, float]:
        pv_ob, dv01_a, conv_num = 0.0, 0.0, 0.0
        for ob in self.obligations_actif:
            p, _, conv, dv01 = pricer_obligation(ob, choc_taux)
            pv_ob += p; dv01_a += dv01; conv_num += p * conv
        pv_act = float(self.poche_actions * (1.0 + choc_actions))
        actif_tot = pv_ob + pv_act
        pv_pas, dmod_l, conv_l, dv01_l = pricer_obligation(self.passif_bel, choc_taux)
        return {
            'actif_oblig': pv_ob, 'actif_actions': pv_act, 'actif_total': actif_tot,
            'passif_bel': pv_pas, 'fonds_propres': actif_tot - pv_pas,
            'dmod_actif': (dv01_a * 1e4) / actif_tot, 'conv_actif': conv_num / actif_tot,
            'dv01_actif': dv01_a, 'dmod_passif': dmod_l, 'conv_passif': conv_l,
            'dv01_passif': dv01_l, 'gap_dv01': dv01_a - dv01_l,
        }

    def taylor_ordre_2(self, base: Dict[str, float], dy: float = 0.0, de: float = 0.0) -> float:
        da = base['actif_total'] * (-base['dmod_actif'] * dy + 0.5 * base['conv_actif'] * dy ** 2) + base['actif_actions'] * de
        dl = ___
        return float(base['fonds_propres'] + da - dl)

# Étape 3 : Calibration sur df_taux, SCR Formule Standard et df_scenarios
taux_last = df_taux.sort_values('date').iloc[-1]
y_5y, y_10y = float(taux_last['taux_5y']) / 100.0, float(taux_last['taux_10y']) / 100.0
bilan = BilanALM(
    obligations_actif=[Obligation("OAT 5Y 3.0%", 40e6, 0.030, 5, y_5y), Obligation("OAT 10Y 3.5%", 65e6, 0.035, 10, y_10y)],
    poche_actions=25_000_000.0,
    passif_bel=Obligation("BEL Vie 6Y 2.5%", 118e6, 0.025, 6, y_10y),
)
res_bilan = bilan.evaluer()
fp0 = res_bilan['fonds_propres']

e_up, e_down = bilan.evaluer(choc_taux=0.02)['fonds_propres'], bilan.evaluer(choc_taux=-0.01)['fonds_propres']
e_eq = bilan.evaluer(choc_actions=-0.39)['fonds_propres']
scr_taux = float(max(0.0, fp0 - e_up, fp0 - e_down))
scr_actions = float(max(0.0, fp0 - e_eq))
rho_s2 = 0.0 if (fp0 - e_up) >= (fp0 - e_down) else 0.50
scr_standard = float(___)
solvency_ratio_base = float(fp0 / scr_standard)

specs = [('Base', 0.0, 0.0), ('Taux +200 bps', 0.02, 0.0), ('Taux -100 bps', -0.01, 0.0),
         ('Actions -39%', 0.0, -0.39), ('Combine (+200/-39%)', 0.02, -0.39)]
rows_scen = []
for nom, dy, de in specs:
    fp_ex = bilan.evaluer(dy, de)['fonds_propres']
    rows_scen.append({
        'Scenario': nom, 'Choc_Taux_bps': int(dy * 10000), 'Choc_Actions_pct': round(de * 100, 1),
        'FP_Exact': fp_ex, 'FP_Taylor2': bilan.taylor_ordre_2(res_bilan, dy, de),
        'Delta_FP': fp_ex - fp0, 'Ratio_Solvabilite': fp_ex / scr_standard,
    })
df_scenarios = pd.DataFrame(rows_scen)

# Étape 4 : Monte Carlo corrélé (1000 tirages) et Dashboard 2 panneaux
rng = np.random.default_rng(42)
vol_r = float(np.std((df_taux.sort_values('date')['taux_10y'].diff().dropna() / 100.0).to_numpy(), ddof=1) * np.sqrt(12))
mu_eq, vol_eq = float(df_actifs['rendement_espere'].mean()), float(df_actifs['volatilite'].mean())
Z = rng.standard_normal((1000, 2)) @ np.linalg.cholesky(np.array([[1.0, -0.25], [-0.25, 1.0]])).T
fp_mc = np.array([bilan.evaluer(float(vol_r * z0), float(np.exp((mu_eq - 0.5 * vol_eq ** 2) + vol_eq * z1) - 1.0))['fonds_propres'] for z0, z1 in Z])
pertes_mc = fp0 - fp_mc
scr_995 = float(___)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
ax1.bar(df_scenarios['Scenario'], df_scenarios['FP_Exact'] / 1e6, color='#0284c7', alpha=0.85)
ax1.axhline(scr_standard / 1e6, color='#dc2626', ls='--')
ax2.hist(pertes_mc / 1e6, bins=35, color='#0284c7', alpha=0.72)
ax2.axvline(scr_995 / 1e6, color='#e11d48', ls=':')
print(f"Ratio base : {solvency_ratio_base:.2%} | SCR MC 99.5% : {scr_995:,.2f} EUR")`
      }
    },

    // =========================================================================
    // PROJET 2 : OPTIMISATION MARKOWITZ CONTRAINTE & BACKTESTING MULTI-ACTIFS
    // =========================================================================
    {
      id: "v4-py-2",
      title: "Projet 2 — Moteur d'Optimisation Markowitz Contrainte & Backtesting Multi-Actifs",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 60,
      description:
        "Reconstruisez les séries de rendements depuis df_marche et df_actifs avec régularisation de Ledoit-Wolf, résolvez les portefeuilles long-only GMVP et Tangent via scipy.optimize.minimize, backtestez les stratégies sur rapport_perf et tracez la courbe cumulée ainsi que la frontière efficiente contrainte.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Optimisation Contrainte SLSQP, Shrinkage & Métriques de Risque

#### Intuition Économique & Piège de l'Estimation en Petit Échantillon
En gestion d'actifs institutionnelle, l'optimisation analytique de Markowitz sans contrainte génère souvent des poids extrêmes (positions vendeuses irréalistes) dès que la matrice de covariance empirique $\\hat{\\Sigma}_{\\text{emp}}$ est estimée sur une fenêtre courte. Dans \`df_marche\`, nous disposons de $T=5$ séances pour $K=5$ actifs : la matrice de covariance échantillonnale est **singulière** (rang $\\le 4$, valeur propre minimale nulle), et les moyennes de $5$ jours annualisées par $\\times 252$ explosent au-delà de $+100\\%$ (*Merton's Mean Blur*).

Pour bâtir un optimiseur robuste en production, on combine trois garde-fous industriels :
1. **Shrinkage convexe (Ledoit-Wolf) :** Régulariser $\\hat{\\Sigma}_{\\text{emp}}$ vers la matrice diagonale des variances stratégiques $\\Sigma_{\\text{prior}} = \\operatorname{diag}(\\boldsymbol{\\sigma}_{\\text{actifs}}^2)$ restaure la stricte définissabilité positive ($\\lambda_{\\min}(\\Sigma) > 0$).
2. **Ancrage des rendements espérés (\`df_actifs\`) :** Utiliser les espérances long terme $\\boldsymbol{\\mu}$ plutôt que le bruit journalier annualisé.
3. **Contraintes *Long-Only* ($w_i \\ge 0$) :** Imposer la positivité des pondérations transforme le programme quadratique en optimisation numérique sous contraintes résolue par **SLSQP** (*Sequential Least Squares Programming*).

#### Démonstration Mathématique Formelle
1. **Covariance Régularisée & Contraintes Convexes :**
   En notant $\\delta \\in [0, 1]$ l'intensité du *shrinkage* ($\\delta = 0.50$) et $R_j \\in \\mathbb{R}^{T \\times K}$ la matrice pivotée des rendements journaliers :
   $$\\Sigma_{\\text{reg}} = (1 - \\delta)\\left(252\\,\\widehat{\\operatorname{Cov}}(R_j)\\right) + \\delta\\,\\operatorname{diag}(\\boldsymbol{\\sigma}_{\\text{actifs}}^2)$$

2. **Programmes d'Optimisation Long-Only :**
   Sous le simplexe $\\mathcal{W} = \\{\\mathbf{w} \\in \\mathbb{R}^K : w_i \\ge 0, \\; \\sum_{i=1}^K w_i = 1\\}$ et taux sans risque $r_f = 3\\%$ :
   $$\\mathbf{w}_{\\text{GMVP}} = \\arg\\min_{\\mathbf{w} \\in \\mathcal{W}} \\mathbf{w}^\\top \\Sigma_{\\text{reg}} \\mathbf{w}, \\qquad \\mathbf{w}_{\\text{Tan}} = \\arg\\max_{\\mathbf{w} \\in \\mathcal{W}} \\frac{\\mathbf{w}^\\top \\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}^\\top \\Sigma_{\\text{reg}} \\mathbf{w}}}$$
   La frontière efficiente contrainte s'obtient en minimisant $\\mathbf{w}^\\top \\Sigma_{\\text{reg}} \\mathbf{w}$ sur $\\mathcal{W}$ sous la contrainte d'égalité supplémentaire $\\mathbf{w}^\\top \\boldsymbol{\\mu} = \\mu_{\\text{cible}}$.

3. **Métriques de Backtest & Risque Extrême :**
   Pour une série de rendements journaliers du portefeuille $r_{p,t} = \\mathbf{w}^\\top \\mathbf{r}_t$ et pertes $\\ell_t = -r_{p,t}$ :
   $$\\text{Sortino} = \\frac{\\bar{r}_{\\text{ann}} - r_f}{\\sqrt{252\\,\\frac{1}{T}\\sum_{t=1}^T \\min(r_{p,t} - r_f/252, 0)^2}}, \\qquad \\text{MDD} = \\min_t \\frac{V_t - \\max_{s \\le t} V_s}{\\max_{s \\le t} V_s}$$
   $$\\text{VaR}_{95\\%} = Q_{0.95}(\\boldsymbol{\\ell}), \\qquad \\text{ES}_{95\\%} = \\mathbb{E}[\\ell_t \\mid \\ell_t \\ge \\text{VaR}_{95\\%}] \\ge \\text{VaR}_{95\\%}$$

### 💻 Masterclass Python : Alignement des Tickers, SLSQP & Cohérence Backtest

* **Alignement explicite après \`pivot\` :** \`df_marche.pivot(...)\` trie les colonnes alphabétiquement (\`AI, BNP, CW8, MC, TTE\`) alors que \`df_actifs\` suit \`['TTE', 'BNP', 'MC', 'AI', 'CW8']\`. L'indexation \`[tickers]\` évite toute permutation silencieuse des pondérations !
* **Fermeture Python dans les boucles de contraintes :** Lors de la génération de la frontière efficiente, écrire \`lambda w, target=m_t: float(w @ mu) - target\` capture la valeur courante \`m_t\` par défaut au lieu de pointer sur la dernière itération de la boucle.
* **Subtilité petit échantillon :** Sur 5 séances haussières, l'annualisation des rendements réalisés génère des ratios de Sharpe/Sortino mécaniquement élevés — un point clé à savoir commenter face à un gérant de portefeuille.

\`\`\`python
import numpy as np

tickers_r = list(df_actifs['ticker'])
ret_r = df_marche.pivot(index='date', columns='ticker', values='rendement_journalier')[tickers_r]
S_emp = (ret_r.cov() * 252.0).to_numpy()
S_pri = np.diag(df_actifs['volatilite'].to_numpy() ** 2)
S_reg = 0.5 * S_emp + 0.5 * S_pri
eig_emp = np.linalg.eigvalsh(S_emp)
eig_reg = np.linalg.eigvalsh(S_reg)
print(f"Rang/min eig Sigma_emp (T=5, K=5) : {eig_emp.min():.3e} (singulière)")
print(f"Min/Max eig Sigma_reg (delta=0.5) : [{eig_reg.min():.4f}, {eig_reg.max():.4f}] (cond={eig_reg.max()/eig_reg.min():.2f})")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Rang/min eig Sigma_emp (T=5, K=5) : -7.079e-19 (singulière)
Min/Max eig Sigma_reg (delta=0.5) : [0.0115, 0.0532] (cond=4.62)
\`\`\`

### 📦 Export Portfolio GitHub (Architecture & README)

\`\`\`text
markowitz-backtest-engine/
├── README.md                  # Méthodologie Ledoit-Wolf, métriques risque & courbes backtest
├── requirements.txt           # numpy, pandas, scipy, matplotlib, pytest
├── assets/
│   └── efficient_frontier.png # Figure 2 panneaux : Equity Curve + Frontière Contrainte
├── src/
│   ├── data_loader.py         # Pivot aligné, annualisation & covariance régularisée
│   ├── optimizer.py           # Solveur SLSQP long-only (GMVP, Tangence, Frontière)
│   └── backtester.py          # Calcul Sortino, MaxDrawdown, VaR_95, ES_95
└── tests/
    └── test_optimizer.py      # Contraintes simplexe, définie positivité & ES >= VaR
\`\`\`

* **Feuille de route *scaling* hors navigateur :** Remplacer \`df_marche\` par un connecteur \`yfinance\` / Parquet sur 5 ans d'historique journalier, intégrer \`sklearn.covariance.LedoitWolf\` pour estimer automatiquement le $\\delta$ optimal et ajouter un *walk-forward backtest* mensuel intégrant des coûts de transaction ($10\\text{ bps}$).
* **Questions classiques d'entretien Quant / Asset Management :**
  1. *Pourquoi la matrice de covariance empirique devient-elle singulière dès que $T \\le K$ ?* Parce que $T$ observations centrées engendrent un sous-espace de dimension au plus $T-1$, laissant au moins $K - (T-1)$ valeurs propres nulles : l'inverse $\\Sigma^{-1}$ n'existe plus.
  2. *Quelle différence pratique entre VaR $95\\%$ et Expected Shortfall $95\\%$ ?* La VaR est un simple quantile (non sous-additif en général) qui ignore l'amplitude des pertes au-delà du seuil, tandis que l'ES mesure la perte moyenne conditionnelle dans la queue ($\\text{ES} \\ge \\text{VaR}$) et constitue une mesure cohérente au sens d'Artzner.
  3. *Pourquoi le portefeuille Tangent obtenu par SLSQP diffère-t-il du portefeuille analytique sans contraintes ?* Les bornes $0 \\le w_i \\le 1$ empêchent les ventes à découvert extrêmes, modifiant la frontière en une suite d'arcs quadratiques par morceaux.
      `,
      taskMarkdown: `**🎯 Cahier des Charges Portfolio (Architecture & Contrats d'API) :**

Construisez un moteur complet d'optimisation Markowitz contrainte et de backtesting multi-actifs exploitant \`df_actifs\` et \`df_marche\` :

1. **\`construire_univers_marche(df_actifs_in, df_marche_in, shrinkage=0.50)\`** :
   - Préservez l'ordre exact \`tickers = list(df_actifs_in['ticker'])\`.
   - Pivotez \`df_marche_in\` sur \`(index='date', columns='ticker', values='rendement_journalier')[tickers]\` dans \`ret_j\`.
   - Calculez \`mu_emp_ann = (ret_j.mean() * 252.0).to_numpy()\`, \`mu_strat = df_actifs_in['rendement_espere'].to_numpy()\`, et \`Sigma = (1 - shrinkage) * (ret_j.cov() * 252.0) + shrinkage * diag(volatilite^2)\`.
   - Retournez \`(tickers, ret_j, mu_strat, mu_emp_ann, Sigma)\`.
2. **\`optimiser_markowitz(mu, Sigma, rf=0.03)\` & \`calculer_frontiere_contrainte(mu, Sigma, w_gmvp, n_pts=25)\`** :
   - Utilisez \`scipy.optimize.minimize(..., method='SLSQP', bounds=[(0, 1)]*n, constraints=...)\` pour résoudre \`w_gmvp\` (variance min) et \`w_tan\` (Sharpe max), et renvoyez \`(w_gmvp, w_tan, w_eq)\`.
   - \`calculer_frontiere_contrainte\` retourne \`(vols_front, mus_front)\` le long de \`n_pts\` cibles de rendement.
3. **\`backtester_strategie(nom, w, ret_j, rf=0.03)\` & \`rapport_perf\`** :
   - Retourne \`(courbe_base100, metrics_dict)\` contenant les $7$ clés exactes : \`'Rendement'\`, \`'Volatilite'\`, \`'Sharpe'\`, \`'Sortino'\`, \`'MaxDrawdown'\`, \`'VaR_95'\` (sur pertes \`-r_p\`) et \`'ES_95'\`.
   - Assemblez \`df_courbes\` et \`rapport_perf\` indexé par \`['Tangence', 'GMVP', 'EqualWeight']\`.
4. **Invariants & Dashboard Matplotlib 2 Panneaux (\`plt.subplots(1, 2)\`)** :
   - Vérifiez par \`assert\` la positivité et somme unitaire des poids ainsi que \`ES_95 >= VaR_95\`.
   - Tracez à gauche les $3$ courbes cumulées Base 100 (\`df_courbes\`) et à droite la frontière contrainte avec les $5$ actifs et les $3$ portefeuilles (sans \`plt.show()\`).`,
      initialCode: "# Rédigez votre architecture Python Portfolio ci-dessous :\n",
      solutionCode: `from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
from scipy.optimize import minimize
import matplotlib.pyplot as plt

def construire_univers_marche(
    df_actifs_in: pd.DataFrame, df_marche_in: pd.DataFrame, shrinkage: float = 0.50
) -> Tuple[List[str], pd.DataFrame, np.ndarray, np.ndarray, np.ndarray]:
    """Reconstruit la série de rendements pivotée et la covariance annualisée régularisée."""
    df_a = df_actifs_in.copy()
    tickers = list(df_a['ticker'])
    ret_j = df_marche_in.copy().pivot(index='date', columns='ticker', values='rendement_journalier')[tickers]
    mu_emp_ann = (ret_j.mean() * 252.0).to_numpy(dtype=float)
    mu_strat = df_a['rendement_espere'].to_numpy(dtype=float)
    sigma_emp = (ret_j.cov() * 252.0).to_numpy(dtype=float)
    sigma_prior = np.diag(df_a['volatilite'].to_numpy(dtype=float) ** 2)
    sigma_reg = (1.0 - shrinkage) * sigma_emp + shrinkage * sigma_prior
    return tickers, ret_j, mu_strat, mu_emp_ann, sigma_reg

def optimiser_markowitz(mu: np.ndarray, Sigma: np.ndarray, rf: float = 0.03) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Résout GMVP et Tangence sous contraintes long-only (w_i >= 0, sum(w) = 1)."""
    n = len(mu)
    w0 = np.ones(n) / n
    bounds = [(0.0, 1.0)] * n
    cons = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0},)
    res_gmvp = minimize(lambda w: float(w @ Sigma @ w), w0, method='SLSQP', bounds=bounds, constraints=cons)
    res_tan = minimize(
        lambda w: -float((w @ mu - rf) / np.sqrt(w @ Sigma @ w + 1e-12)),
        w0, method='SLSQP', bounds=bounds, constraints=cons
    )
    if not (res_gmvp.success and res_tan.success):
        raise RuntimeError("Échec de convergence SLSQP")
    return res_gmvp.x, res_tan.x, w0

def calculer_frontiere_contrainte(mu: np.ndarray, Sigma: np.ndarray, w_gmvp: np.ndarray, n_pts: int = 25) -> Tuple[np.ndarray, np.ndarray]:
    """Calcule les couples (volatilite, rendement) le long de la frontière efficiente contrainte."""
    n = len(mu)
    bounds = [(0.0, 1.0)] * n
    mu_targets = np.linspace(float(w_gmvp @ mu), float(np.max(mu)) * 0.995, n_pts)
    vols_f, mus_f = [], []
    for m_t in mu_targets:
        cons = (
            {'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0},
            {'type': 'eq', 'fun': lambda w, target=m_t: float(w @ mu) - target},
        )
        res = minimize(lambda w: float(w @ Sigma @ w), w_gmvp, method='SLSQP', bounds=bounds, constraints=cons)
        if res.success:
            vols_f.append(float(np.sqrt(res.x @ Sigma @ res.x)))
            mus_f.append(float(res.x @ mu))
    return np.array(vols_f), np.array(mus_f)

def backtester_strategie(nom: str, w: np.ndarray, ret_j: pd.DataFrame, rf: float = 0.03) -> Tuple[pd.Series, Dict[str, float]]:
    """Backteste les poids w sur ret_j et calcule les métriques complètes de risque."""
    r_p = ret_j.to_numpy(dtype=float) @ w
    courbe = pd.Series(100.0 * np.cumprod(1.0 + r_p), index=ret_j.index, name=nom)
    r_ann = float(np.mean(r_p) * 252.0)
    vol_ann = float(np.std(r_p, ddof=1) * np.sqrt(252.0))
    sharpe = float((r_ann - rf) / vol_ann)
    downside = np.minimum(r_p - rf / 252.0, 0.0)
    dd_ann = float(np.sqrt(np.mean(downside ** 2)) * np.sqrt(252.0))
    sortino = float((r_ann - rf) / dd_ann) if dd_ann > 1e-12 else 0.0
    wealth = np.concatenate(([1.0], np.cumprod(1.0 + r_p)))
    max_dd = float(np.min((wealth - np.maximum.accumulate(wealth)) / np.maximum.accumulate(wealth)))
    pertes = -r_p
    var_95 = float(np.quantile(pertes, 0.95))
    es_95 = float(np.mean(pertes[pertes >= var_95]))
    return courbe, {'Rendement': r_ann, 'Volatilite': vol_ann, 'Sharpe': sharpe,
                    'Sortino': sortino, 'MaxDrawdown': max_dd, 'VaR_95': var_95, 'ES_95': es_95}

tickers, ret_j, mu_strat, mu_emp_ann, Sigma = construire_univers_marche(df_actifs, df_marche, shrinkage=0.50)
w_gmvp, w_tan, w_eq = optimiser_markowitz(mu_strat, Sigma, rf=0.03)

strategies = {'Tangence': w_tan, 'GMVP': w_gmvp, 'EqualWeight': w_eq}
courbes, stats = {}, {}
for nom, w in strategies.items():
    courbes[nom], stats[nom] = backtester_strategie(nom, w, ret_j, rf=0.03)
df_courbes = pd.DataFrame(courbes)
rapport_perf = pd.DataFrame(stats).T

vols_front, mus_front = calculer_frontiere_contrainte(mu_strat, Sigma, w_gmvp, n_pts=25)
assert np.all(w_gmvp >= -1e-9) and np.all(w_tan >= -1e-9)
assert np.isclose(w_gmvp.sum(), 1.0) and np.isclose(w_tan.sum(), 1.0)
assert (rapport_perf['ES_95'] >= rapport_perf['VaR_95'] - 1e-12).all()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
for nom, col in [('Tangence', '#e11d48'), ('GMVP', '#10b981'), ('EqualWeight', '#0284c7')]:
    ax1.plot(df_courbes.index, df_courbes[nom], marker='o', lw=2.0, color=col, label=nom)
ax1.set_title('Backtest Multi-Actifs (Base 100 sur df_marche)')
ax1.set_ylabel('Valeur du portefeuille'); ax1.tick_params(axis='x', rotation=18, labelsize=8)
ax1.legend(fontsize=8); ax1.grid(True, alpha=0.3)

ax2.plot(vols_front * 100, mus_front * 100, color='#0f172a', lw=2.0, label='Frontière contrainte (w>=0)')
ax2.scatter(np.sqrt(np.diag(Sigma)) * 100, mu_strat * 100, color='#78716c', s=40, label='Actifs régularisés')
for i, tk in enumerate(tickers):
    ax2.annotate(tk, (np.sqrt(Sigma[i, i]) * 100 + 0.2, mu_strat[i] * 100), fontsize=7.5)
for nom, w, col in [('Tangence', w_tan, '#e11d48'), ('GMVP', w_gmvp, '#10b981'), ('EqualWeight', w_eq, '#0284c7')]:
    ax2.scatter([np.sqrt(w @ Sigma @ w) * 100], [(w @ mu_strat) * 100], color=col, s=75, zorder=5, label=nom)
ax2.set_xlabel('Volatilité ex-ante (%)'); ax2.set_ylabel('Rendement espéré (%)')
ax2.set_title('Allocation Optimale & Frontière Markowitz')
ax2.legend(fontsize=7.5); ax2.grid(True, alpha=0.3)

print("Poids GMVP     :", {t: round(float(v), 4) for t, v in zip(tickers, w_gmvp)})
print("Poids Tangence :", {t: round(float(v), 4) for t, v in zip(tickers, w_tan)})
print(rapport_perf.round(4).to_string())`,
      testPythonCode: `assert callable(construire_univers_marche) and callable(optimiser_markowitz) and callable(backtester_strategie)
assert list(ret_j.columns) == list(df_actifs['ticker'])
assert Sigma.shape == (5, 5) and np.all(np.linalg.eigvalsh(Sigma) > 0)
assert np.isclose(w_gmvp.sum(), 1.0, atol=1e-6) and np.all(w_gmvp >= -1e-7)
assert np.isclose(w_tan.sum(), 1.0, atol=1e-6) and np.all(w_tan >= -1e-7)
assert float(np.sqrt(w_gmvp @ Sigma @ w_gmvp)) <= float(np.sqrt(w_eq @ Sigma @ w_eq)) + 1e-8
assert float((w_tan @ mu_strat - 0.03) / np.sqrt(w_tan @ Sigma @ w_tan)) >= float((w_eq @ mu_strat - 0.03) / np.sqrt(w_eq @ Sigma @ w_eq)) - 1e-6
assert list(rapport_perf.index) == ['Tangence', 'GMVP', 'EqualWeight']
assert list(rapport_perf.columns) == ['Rendement', 'Volatilite', 'Sharpe', 'Sortino', 'MaxDrawdown', 'VaR_95', 'ES_95']
assert rapport_perf.loc['GMVP', 'Volatilite'] < rapport_perf.loc['EqualWeight', 'Volatilite']
assert (rapport_perf['ES_95'] >= rapport_perf['VaR_95'] - 1e-12).all()`,
      datasets: [],
      hints: [
        "Dans construire_univers_marche, indexez impérativement la table pivotée par [tickers] pour aligner l'ordre des colonnes avec df_actifs.",
        "Dans optimiser_markowitz, utilisez scipy.optimize.minimize(..., method='SLSQP', bounds=[(0.0, 1.0)] * n, constraints={'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0}).",
        "Dans backtester_strategie, calculez MaxDrawdown sur np.concatenate(([1.0], np.cumprod(1.0 + r_p))) et ES_95 comme la moyenne de pertes[pertes >= var_95] avec pertes = -r_p."
      ],
      guide: {
        theoryToPracticeLink:
          "En combinant la covariance empirique de \`df_marche\` (singulière sur 5 séances) et la diagonale de \`df_actifs\` par shrinkage $\\delta=0.50$, toutes les valeurs propres deviennent strictement positives ($[0.0115, 0.0532]$). L'optimiseur \`SLSQP\` produit des allocations diversifiées (\`GMVP\` à $7.93\\%$ de volatilité ex-ante, \`Tangence\` à $8.96\\%$ de rendement espéré) qui surclassent l'équipondéré en backtest sur le risque réalisé (\`Volatilite\` $6.85\\%$ vs $9.35\\%$, \`MaxDrawdown\` $-0.02\\%$ vs $-0.24\\%$).",
        stepByStepPlan: [
          "Écrire `construire_univers_marche` pour pivoter `df_marche` aligné sur `tickers`, calculer `mu_emp_ann`, `mu_strat` et la matrice régularisée `Sigma`.",
          "Implémenter `optimiser_markowitz` avec `scipy.optimize.minimize` (SLSQP, bornes `[0, 1]`) pour résoudre `w_gmvp`, `w_tan` et `w_eq`.",
          "Écrire `calculer_frontiere_contrainte` pour tracer 25 portefeuilles efficients long-only entre le rendement GMVP et `max(mu)`.",
          "Implémenter `backtester_strategie` retournant la courbe Base 100 et les 7 indicateurs (`Rendement`, `Volatilite`, `Sharpe`, `Sortino`, `MaxDrawdown`, `VaR_95`, `ES_95`), puis construire `rapport_perf`.",
          "Tracer les 2 panneaux Matplotlib (courbes cumulées à gauche, frontière efficiente et actifs à droite)."
        ],
        concepts: [
          {
            symbol: "construire_univers_marche(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Extrait la matrice des rendements pivotée \`ret_j\` alignée et applique le shrinkage de Ledoit-Wolf ($\\delta=0.50$)."
          },
          {
            symbol: "scipy.optimize.minimize (SLSQP)",
            kind: "Fonction / Méthode",
            roleInExercise: "Solveur numérique sous contraintes d'égalité ($\\sum w_i = 1$) et d'inégalité ($0 \\le w_i \\le 1$)."
          },
          {
            symbol: "w_gmvp / w_tan / w_eq",
            kind: "Variable",
            roleInExercise: "Vecteurs de pondération optimaux long-only comparés à la référence équipondérée $1/N$."
          },
          {
            symbol: "backtester_strategie(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la trajectoire Base 100 et le profil complet de performance ajustée du risque et des pertes extrêmes."
          },
          {
            symbol: "rapport_perf",
            kind: "Variable",
            roleInExercise: "Tableau comparatif $(3 \\times 7)$ évaluant \`Tangence\`, \`GMVP\` et \`EqualWeight\` sur \`df_marche\`."
          },
          {
            symbol: "calculer_frontiere_contrainte",
            kind: "Fonction / Méthode",
            roleInExercise: "Résout la variance minimale pour une grille de $25$ rendements cibles afin de tracer l'enveloppe efficiente."
          }
        ],
        guidedCode: `from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
from scipy.optimize import minimize
import matplotlib.pyplot as plt

# Étape 1 : Pivot aligné et matrice de covariance régularisée (Ledoit-Wolf)
def construire_univers_marche(
    df_actifs_in: pd.DataFrame, df_marche_in: pd.DataFrame, shrinkage: float = 0.50
) -> Tuple[List[str], pd.DataFrame, np.ndarray, np.ndarray, np.ndarray]:
    df_a = df_actifs_in.copy()
    tickers = list(df_a['ticker'])
    ret_j = df_marche_in.copy().pivot(index='date', columns='ticker', values='rendement_journalier')[tickers]
    mu_emp_ann = (ret_j.mean() * 252.0).to_numpy(dtype=float)
    mu_strat = df_a['rendement_espere'].to_numpy(dtype=float)
    sigma_emp = (ret_j.cov() * 252.0).to_numpy(dtype=float)
    sigma_prior = np.diag(df_a['volatilite'].to_numpy(dtype=float) ** 2)
    sigma_reg = ___
    return tickers, ret_j, mu_strat, mu_emp_ann, sigma_reg

# Étape 2 : Solveur SLSQP Long-Only (GMVP & Tangence)
def optimiser_markowitz(mu: np.ndarray, Sigma: np.ndarray, rf: float = 0.03) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    n = len(mu)
    w0 = np.ones(n) / n
    bounds = [(0.0, 1.0)] * n
    cons = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0},)
    res_gmvp = minimize(lambda w: float(w @ Sigma @ w), w0, method='SLSQP', bounds=bounds, constraints=cons)
    res_tan = minimize(lambda w: ___, w0, method='SLSQP', bounds=bounds, constraints=cons)
    return res_gmvp.x, res_tan.x, w0

def calculer_frontiere_contrainte(mu: np.ndarray, Sigma: np.ndarray, w_gmvp: np.ndarray, n_pts: int = 25) -> Tuple[np.ndarray, np.ndarray]:
    bounds = [(0.0, 1.0)] * len(mu)
    mu_targets = np.linspace(float(w_gmvp @ mu), float(np.max(mu)) * 0.995, n_pts)
    vols_f, mus_f = [], []
    for m_t in mu_targets:
        cons = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0},
                {'type': 'eq', 'fun': lambda w, target=m_t: float(w @ mu) - target})
        res = minimize(lambda w: float(w @ Sigma @ w), w_gmvp, method='SLSQP', bounds=bounds, constraints=cons)
        if res.success:
            vols_f.append(float(np.sqrt(res.x @ Sigma @ res.x))); mus_f.append(float(res.x @ mu))
    return np.array(vols_f), np.array(mus_f)

# Étape 3 : Backtesting & Métriques complètes de risque
def backtester_strategie(nom: str, w: np.ndarray, ret_j: pd.DataFrame, rf: float = 0.03) -> Tuple[pd.Series, Dict[str, float]]:
    r_p = ret_j.to_numpy(dtype=float) @ w
    courbe = pd.Series(100.0 * np.cumprod(1.0 + r_p), index=ret_j.index, name=nom)
    r_ann = float(np.mean(r_p) * 252.0)
    vol_ann = float(np.std(r_p, ddof=1) * np.sqrt(252.0))
    sharpe = float((r_ann - rf) / vol_ann)
    downside = np.minimum(r_p - rf / 252.0, 0.0)
    dd_ann = float(np.sqrt(np.mean(downside ** 2)) * np.sqrt(252.0))
    sortino = float((r_ann - rf) / dd_ann) if dd_ann > 1e-12 else 0.0
    wealth = np.concatenate(([1.0], np.cumprod(1.0 + r_p)))
    max_dd = float(___)
    pertes = -r_p
    var_95 = float(np.quantile(pertes, 0.95))
    es_95 = float(___)
    return courbe, {'Rendement': r_ann, 'Volatilite': vol_ann, 'Sharpe': sharpe,
                    'Sortino': sortino, 'MaxDrawdown': max_dd, 'VaR_95': var_95, 'ES_95': es_95}

# Étape 4 : Exécution complète et Dashboard 2 panneaux
tickers, ret_j, mu_strat, mu_emp_ann, Sigma = construire_univers_marche(df_actifs, df_marche, shrinkage=0.50)
w_gmvp, w_tan, w_eq = optimiser_markowitz(mu_strat, Sigma, rf=0.03)
courbes, stats = {}, {}
for nom, w in [('Tangence', w_tan), ('GMVP', w_gmvp), ('EqualWeight', w_eq)]:
    courbes[nom], stats[nom] = backtester_strategie(nom, w, ret_j, rf=0.03)
df_courbes = pd.DataFrame(courbes)
rapport_perf = pd.DataFrame(stats).T
vols_front, mus_front = calculer_frontiere_contrainte(mu_strat, Sigma, w_gmvp)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
df_courbes.plot(ax=ax1, marker='o')
ax2.plot(vols_front * 100, mus_front * 100, color='#0f172a')
print(rapport_perf.round(4))`
      }
    },

    // =========================================================================
    // PROJET 3 : LIBRAIRIE PRICING BSM, GRECS, MC ANTITHETIQUE & SMILE HYBRIDE
    // =========================================================================
    {
      id: "v4-py-3",
      title: "Projet 3 — Librairie Pricing BSM, Grecs, Monte Carlo Antithétique & Solveur de Volatilité Implicite",
      category: "pricing",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 60,
      description:
        "Développez une librairie quantitative autonome de dérivés vanilles : @dataclass OptionSpec, classe BlackScholesPricer (prix exact et 5 Grecs), estimateur Monte Carlo par variables antithétiques prouvant la réduction de variance, et solveur hybride Newton-Dichotomie calibrant un smile de volatilité sur 7 strikes.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Pricing BSM, Réduction de Variance & Solveur Hybride de Smile

#### Intuition Économique & Architecture d'un Pricer de Desk Dérivés
Une librairie de pricing quantitative robuste ne se limite jamais à une formule fermée isolée : elle articule trois couches complémentaires qui se valident mutuellement :
1. **Un noyau analytique exact (\`BlackScholesPricer\`)** produisant le prix et les $5$ sensibilités ($\\Delta, \\Gamma, \\mathcal{V}, \\Theta, \\rho$) utilisées pour la couverture dynamique et les contrôles d'arbitrage (parité Call-Put).
2. **Un moteur stochastique (\`monte_carlo_antithetic\`)** indispensable dès qu'un produit devient dépendant de trajectoire. L'usage des **variables antithétiques** $(Z, -Z)$ exploite la symétrie gaussienne et la monotonie du payoff pour diviser mécaniquement la variance d'estimation sans coût de calcul supplémentaire.
3. **Un inverseur hybride (\`implied_volatility_hybrid\`)** robuste aux options profondément hors de la monnaie : lorsque le Vega s'effondre ($\\mathcal{V} \\approx 0$), Newton-Raphson pur diverge vers des volatilités négatives ; le couplage avec une **dichotomie encadrante** (*safe Newton-bisection*) garantit une convergence universelle à $10^{-8}$ près.

#### Démonstration Mathématique Formelle
1. **Formule BSM & Identités des Grecs :**
   Sous mesure risque-neutre $\\mathbb{Q}$ avec $d_1 = \\frac{\\ln(S/K) + (r + \\frac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}}$ et $d_2 = d_1 - \\sigma\\sqrt{T}$ :
   $$C = S\\Phi(d_1) - K e^{-rT}\\Phi(d_2), \\qquad P = K e^{-rT}\\Phi(-d_2) - S\\Phi(-d_1), \\qquad C - P = S - K e^{-rT}$$
   $$\\Gamma = \\frac{\\varphi(d_1)}{S\\sigma\\sqrt{T}}, \\qquad \\mathcal{V} = S\\sqrt{T}\\varphi(d_1), \\qquad \\Delta_{\\text{Call}} - \\Delta_{\\text{Put}} = 1$$

2. **Théorème de Réduction de Variance par Variables Antithétiques :**
   Soit $Y^+ = e^{-rT} h(S_T(Z))$ et $Y^- = e^{-rT} h(S_T(-Z))$ pour $Z \\sim \\mathcal{N}(0, 1)$. La moyenne appariée $\\bar{Y}_{\\text{anti}} = \\frac{1}{n/2} \\sum_{i=1}^{n/2} \\frac{Y_i^+ + Y_i^-}{2}$ conserve le même nombre total $n$ d'évaluations de trajectoires que le Monte Carlo brut, mais sa variance vaut :
   $$\\operatorname{Var}\\!\\left(\\frac{Y^+ + Y^-}{2}\\right) = \\frac{1}{2}\\operatorname{Var}(Y) + \\frac{1}{2}\\operatorname{Cov}(Y^+, Y^-) = \\frac{\\operatorname{Var}(Y)}{2}\\left(1 + \\rho(Y^+, Y^-)\\right)$$
   Comme le payoff d'un Call ou d'un Put est une fonction **monotone** de $Z$, on a $\\rho(Y^+, Y^-) < 0$, d'où une erreur standard nettement inférieure à $\\text{SE}_{\\text{std}} = \\sqrt{\\operatorname{Var}(Y)/n}$ !

3. **Algorithme Hybride Newton-Raphson + Dichotomie :**
   Maintenant un encadrement $[\\sigma_{\\text{low}}, \\sigma_{\\text{high}}]$ tel que $f(\\sigma_{\\text{low}}) \\le 0 \\le f(\\sigma_{\\text{high}})$ pour $f(\\sigma) = V_{\\text{BS}}(\\sigma) - V_{\\text{mkt}}$, l'étape candidate $\\sigma_{\\text{cand}} = \\sigma_k - \\frac{f(\\sigma_k)}{\\mathcal{V}(\\sigma_k)}$ n'est acceptée que si $\\mathcal{V}(\\sigma_k) > 10^{-8}$ et $\\sigma_{\\text{cand}} \\in (\\sigma_{\\text{low}}, \\sigma_{\\text{high}})$ ; sinon on bissecte au milieu $\\frac{1}{2}(\\sigma_{\\text{low}} + \\sigma_{\\text{high}})$.

### 💻 Masterclass Python : API Quant Modulaire & Sécurité Numérique

* **Séparation Spécification / Moteur :** Regrouper \`(S, K, T, r, sigma, option_type)\` dans \`@dataclass OptionSpec\` permet de passer le même contrat à \`BlackScholesPricer\`, \`monte_carlo_standard\` et \`monte_carlo_antithetic\`.
* **Calcul exact de l'erreur standard antithétique :** Diviser l'écart-type des moyennes de paires \`0.5 * (pay_p + pay_m)\` par \`np.sqrt(n_half)\` (et non \`n_paths\`) reflète exactement les $n/2$ paires indépendantes !
* **Graphique à double ordonnée (\`ax2.twinx()\`) :** Fusionner les poignées \`l1 + l2\` dans \`ax2.legend(...)\` permet d'afficher $\\Delta \\in [0, 1]$ et la cloche de $\\Gamma$ sur un graphe lisible sans perte d'échelle.

\`\`\`python
from dataclasses import dataclass
import numpy as np
from scipy.stats import norm

@dataclass
class OptMini:
    S: float; K: float; T: float; r: float; sigma: float

def bs_call_mini(o: OptMini) -> tuple:
    sqT = np.sqrt(o.T)
    d1 = (np.log(o.S / o.K) + (o.r + 0.5 * o.sigma**2) * o.T) / (o.sigma * sqT)
    d2 = d1 - o.sigma * sqT
    return float(o.S * norm.cdf(d1) - o.K * np.exp(-o.r * o.T) * norm.cdf(d2)), float(o.S * sqT * norm.pdf(d1))

o_otm = OptMini(100.0, 120.0, 1.0, 0.03, 0.23)
px_otm, vg_otm = bs_call_mini(o_otm)
rng = np.random.default_rng(42)
z = rng.standard_normal(5000)
drift, vt = (o_otm.r - 0.5 * o_otm.sigma**2) * o_otm.T, o_otm.sigma * np.sqrt(o_otm.T)
p_pair = np.exp(-o_otm.r * o_otm.T) * 0.5 * (np.maximum(o_otm.S*np.exp(drift+vt*z)-o_otm.K,0) + np.maximum(o_otm.S*np.exp(drift-vt*z)-o_otm.K,0))
print(f"Call OTM (K=120) -> BSM={px_otm:.4f} | Vega={vg_otm:.4f} | MC Anti (10k paths)={p_pair.mean():.4f} +/- {p_pair.std(ddof=1)/np.sqrt(5000):.4f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Call OTM (K=120) -> BSM=3.7646 | Vega=34.3458 | MC Anti (10k paths)=3.7677 +/- 0.0962
\`\`\`

### 📦 Export Portfolio GitHub (Architecture & README)

\`\`\`text
bsm-vol-smile-pricer/
├── README.md                  # Benchmark variance antithétique & capture Smile + Grecs
├── pyproject.toml             # Packaging pip install -e . & tests pytest
├── assets/
│   └── smile_greeks.png       # Dashboard 2 panneaux (Vol Smile + Profil Delta/Gamma)
├── src/bsm_lib/
│   ├── contracts.py           # @dataclass OptionSpec
│   ├── analytical.py          # BlackScholesPricer (prix + 5 Grecs + parité)
│   ├── monte_carlo.py         # monte_carlo_standard & monte_carlo_antithetic
│   └── implied_vol.py         # Solveur hybride Newton-Dichotomie
└── tests/
    └── test_pricer.py         # Parité Call-Put, réduction variance & stress deep OTM
\`\`\`

* **Feuille de route *scaling* hors navigateur :** Généraliser \`implied_volatility_hybrid\` aux surfaces $(K, T)$ complètes sur des chaînes d'options réelles (CBOE / Eurex), implémenter les variables de contrôle par le sous-jacent $S_T$ et ajouter une interpolation *SVI* sans arbitrage calendaire.
* **Questions classiques d'entretien Quant / Desk Dérivés :**
  1. *Pourquoi la méthode de Newton pure échoue-t-elle sur un Call très hors de la monnaie ($K=130, T=0.5$)?* Parce que le Vega $\\mathcal{V} = S\\sqrt{T}\\varphi(d_1)$ tend exponentiellement vers $0$, faisant exploser le pas $-f(\\sigma)/\\mathcal{V}$ hors de $\\mathbb{R}_{>0}$ : le repli dichotomique garantit la convergence monotone.
  2. *Dans le Monte Carlo antithétique à $20\\,000$ trajectoires, pourquoi divise-t-on par $\\sqrt{10\\,000}$ pour l'erreur standard ?* Parce que les $10\\,000$ paires $(Y^+, Y^-)$ constituent $10\\,000$ variables aléatoires i.i.d. (les deux membres d'une même paire étant fortement corrélés négativement).
  3. *Comment expliquer l'asymétrie du smile actions ($\\sigma_{\\text{imp}}(80) > \\sigma_{\\text{imp}}(120)$)?* C'est le *skew* actions : les investisseurs paient une prime pour se protéger contre les krachs (queue gauche épaisse et corrélation négative spot-volatilité / effet de levier).
      `,
      taskMarkdown: `**🎯 Cahier des Charges Portfolio (Architecture & Contrats d'API) :**

Implémentez une librairie autonome de pricing et de calibration du smile respectant exactement les noms suivants :

1. **\`@dataclass class OptionSpec\` & \`class BlackScholesPricer\`** :
   - Attributs de \`OptionSpec\` : \`S: float\`, \`K: float\`, \`T: float\`, \`r: float\`, \`sigma: float\`, \`option_type: str = "call"\`.
   - \`BlackScholesPricer.price_and_greeks(self, spec)\` retourne un \`dict\` avec les $6$ clés \`'prix'\`, \`'delta'\`, \`'gamma'\`, \`'vega'\`, \`'theta'\`, \`'rho'\` en \`float\`.
2. **Monte Carlo Standard vs Antithétique (\`n_paths=20000\`, \`seed=42\`)** :
   - Écrivez \`monte_carlo_standard(spec, n_paths=20000, seed=42)\` et \`monte_carlo_antithetic(spec, n_paths=20000, seed=42)\` retournant chacune \`(prix, erreur_standard)\` via \`np.random.default_rng(seed)\`.
   - Évaluez sur \`spec_atm = OptionSpec(100.0, 100.0, 1.0, 0.03, 0.22, "call")\` dans \`bs_atm\`, \`put_atm\`, \`(mc_std_px, mc_std_se)\` et \`(mc_anti_px, mc_anti_se)\` pour prouver que \`mc_anti_se < mc_std_se\`.
3. **Solveur Hybride \`implied_volatility_hybrid(market_price, S, K, T, r, option_type="call", tol=1e-8, max_iter=100)\`** :
   - Combine Newton-Raphson analytique et repli par dichotomie sur \`[1e-4, 5.0]\` si le pas sort des bornes ou si \`vega <= 1e-8\`.
   - Calibrez le smile sur \`strikes = [80, 90, 95, 100, 105, 110, 120]\` et \`vols_cibles = [0.300, 0.255, 0.235, 0.220, 0.212, 0.215, 0.230]\` dans le DataFrame \`df_smile\` (\`['Strike', 'Prix_Marche', 'Vol_Cible', 'Vol_Implicite', 'Erreur_Abs', 'Delta', 'Gamma']\`).
4. **Invariants & Dashboard Matplotlib 2 Panneaux (\`plt.subplots(1, 2)\`)** :
   - Vérifiez par \`assert\` la parité Call-Put, la réduction de variance antithétique et \`Erreur_Abs.max() < 1e-7\`.
   - Tracez à gauche le smile de volatilité calibré et à droite le profil \`Delta\` / \`Gamma\` (via \`twinx()\`) sur \`S in [70, 130]\` sans appeler \`plt.show()\`.`,
      initialCode: "# Rédigez votre architecture Python Portfolio ci-dessous :\n",
      solutionCode: `from dataclasses import dataclass
from typing import Dict, Tuple
import numpy as np
import pandas as pd
from scipy.stats import norm
import matplotlib.pyplot as plt

@dataclass
class OptionSpec:
    """Spécification complète d'une option européenne vanille."""
    S: float
    K: float
    T: float
    r: float
    sigma: float
    option_type: str = "call"

class BlackScholesPricer:
    """Moteur analytique Black-Scholes-Merton (prix et 5 Grecs)."""

    def price_and_greeks(self, spec: OptionSpec) -> Dict[str, float]:
        """Calcule prix, Delta, Gamma, Vega, Theta annuel et Rho."""
        sqrt_t = float(np.sqrt(spec.T))
        d1 = (np.log(spec.S / spec.K) + (spec.r + 0.5 * spec.sigma ** 2) * spec.T) / (spec.sigma * sqrt_t)
        d2 = d1 - spec.sigma * sqrt_t
        pdf_d1, disc_k = float(norm.pdf(d1)), float(spec.K * np.exp(-spec.r * spec.T))
        if spec.option_type == "call":
            prix = float(spec.S * norm.cdf(d1) - disc_k * norm.cdf(d2))
            delta, theta = float(norm.cdf(d1)), float(-(spec.S * pdf_d1 * spec.sigma) / (2.0 * sqrt_t) - spec.r * disc_k * norm.cdf(d2))
            rho = float(spec.T * disc_k * norm.cdf(d2))
        elif spec.option_type == "put":
            prix = float(disc_k * norm.cdf(-d2) - spec.S * norm.cdf(-d1))
            delta, theta = float(norm.cdf(d1) - 1.0), float(-(spec.S * pdf_d1 * spec.sigma) / (2.0 * sqrt_t) + spec.r * disc_k * norm.cdf(-d2))
            rho = float(-spec.T * disc_k * norm.cdf(-d2))
        else:
            raise ValueError("option_type doit être 'call' ou 'put'")
        return {
            'prix': prix, 'delta': delta, 'gamma': float(pdf_d1 / (spec.S * spec.sigma * sqrt_t)),
            'vega': float(spec.S * sqrt_t * pdf_d1), 'theta': theta, 'rho': rho,
        }

def monte_carlo_standard(spec: OptionSpec, n_paths: int = 20000, seed: int = 42) -> Tuple[float, float]:
    """Monte Carlo brut retournant (prix, erreur_standard)."""
    z = np.random.default_rng(seed).standard_normal(n_paths)
    s_t = spec.S * np.exp((spec.r - 0.5 * spec.sigma ** 2) * spec.T + spec.sigma * np.sqrt(spec.T) * z)
    pay = np.maximum(s_t - spec.K, 0.0) if spec.option_type == "call" else np.maximum(spec.K - s_t, 0.0)
    pv = np.exp(-spec.r * spec.T) * pay
    return float(np.mean(pv)), float(np.std(pv, ddof=1) / np.sqrt(n_paths))

def monte_carlo_antithetic(spec: OptionSpec, n_paths: int = 20000, seed: int = 42) -> Tuple[float, float]:
    """Monte Carlo par variables antithétiques (+z, -z) pour réduction de variance."""
    n_half = n_paths // 2
    z = np.random.default_rng(seed).standard_normal(n_half)
    drift, vol_t = (spec.r - 0.5 * spec.sigma ** 2) * spec.T, spec.sigma * np.sqrt(spec.T)
    s_p, s_m = spec.S * np.exp(drift + vol_t * z), spec.S * np.exp(drift - vol_t * z)
    if spec.option_type == "call":
        pay_p, pay_m = np.maximum(s_p - spec.K, 0.0), np.maximum(s_m - spec.K, 0.0)
    else:
        pay_p, pay_m = np.maximum(spec.K - s_p, 0.0), np.maximum(spec.K - s_m, 0.0)
    pair_pv = np.exp(-spec.r * spec.T) * 0.5 * (pay_p + pay_m)
    return float(np.mean(pair_pv)), float(np.std(pair_pv, ddof=1) / np.sqrt(n_half))

def implied_volatility_hybrid(
    market_price: float, S: float, K: float, T: float, r: float,
    option_type: str = "call", tol: float = 1e-8, max_iter: int = 100
) -> float:
    """Solveur hybride Newton-Raphson avec repli automatique par dichotomie."""
    pricer, low, high, sigma = BlackScholesPricer(), 1e-4, 5.0, 0.25
    for _ in range(max_iter):
        res = pricer.price_and_greeks(OptionSpec(S, K, T, r, sigma, option_type))
        diff = res['prix'] - market_price
        if abs(diff) < tol:
            return float(sigma)
        low, high = (max(low, sigma), high) if diff < 0.0 else (low, min(high, sigma))
        cand = sigma - diff / res['vega'] if res['vega'] > 1e-8 else 0.5 * (low + high)
        sigma = cand if (low < cand < high) else 0.5 * (low + high)
    return float(sigma)

pricer = BlackScholesPricer()
spec_atm = OptionSpec(S=100.0, K=100.0, T=1.0, r=0.03, sigma=0.22, option_type="call")
bs_atm = pricer.price_and_greeks(spec_atm)
put_atm = pricer.price_and_greeks(OptionSpec(100.0, 100.0, 1.0, 0.03, 0.22, "put"))
mc_std_px, mc_std_se = monte_carlo_standard(spec_atm, n_paths=20000, seed=42)
mc_anti_px, mc_anti_se = monte_carlo_antithetic(spec_atm, n_paths=20000, seed=42)

strikes = [80, 90, 95, 100, 105, 110, 120]
vols_cibles = [0.300, 0.255, 0.235, 0.220, 0.212, 0.215, 0.230]
rows_smile = []
for k, v_true in zip(strikes, vols_cibles):
    g = pricer.price_and_greeks(OptionSpec(100.0, float(k), 1.0, 0.03, v_true, "call"))
    iv = implied_volatility_hybrid(g['prix'], 100.0, float(k), 1.0, 0.03, "call")
    rows_smile.append({'Strike': k, 'Prix_Marche': g['prix'], 'Vol_Cible': v_true, 'Vol_Implicite': iv, 'Erreur_Abs': abs(iv - v_true), 'Delta': g['delta'], 'Gamma': g['gamma']})
df_smile = pd.DataFrame(rows_smile)
assert abs((bs_atm['prix'] - put_atm['prix']) - (100.0 - 100.0 * np.exp(-0.03))) < 1e-10
assert mc_anti_se < mc_std_se and df_smile['Erreur_Abs'].max() < 1e-7

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
ax1.plot(df_smile['Strike'], df_smile['Vol_Implicite'] * 100, marker='o', color='#0284c7', lw=2.2, label='Smile calibré (Hybride)')
ax1.axhline(22.0, color='#78716c', ls='--', lw=1.2, label='Vol plate ATM (22%)')
ax1.set_xlabel('Strike K'); ax1.set_ylabel('Volatilité Implicite (%)'); ax1.set_title('Calibration du Smile de Volatilité')
ax1.legend(fontsize=8); ax1.grid(True, alpha=0.3)
spots = np.linspace(70.0, 130.0, 61)
deltas = [pricer.price_and_greeks(OptionSpec(s, 100.0, 1.0, 0.03, 0.22, "call"))['delta'] for s in spots]
gammas = [pricer.price_and_greeks(OptionSpec(s, 100.0, 1.0, 0.03, 0.22, "call"))['gamma'] for s in spots]
l1 = ax2.plot(spots, deltas, color='#0f172a', lw=2.0, label='Delta Call')
ax2_t = ax2.twinx()
l2 = ax2_t.plot(spots, gammas, color='#e11d48', ls='--', lw=2.0, label='Gamma')
ax2.set_xlabel('Prix Spot S'); ax2.set_ylabel('Delta'); ax2_t.set_ylabel('Gamma', color='#e11d48')
ax2.set_title('Profil des Grecs (K=100, T=1a, sigma=22%)'); ax2.grid(True, alpha=0.3)
ax2.legend(l1 + l2, [l.get_label() for l in l1 + l2], loc='upper left', fontsize=8)
print(f"BSM ATM : {bs_atm['prix']:.4f} | MC Anti : {mc_anti_px:.4f} (SE={mc_anti_se:.5f}) vs Std : {mc_std_px:.4f} (SE={mc_std_se:.5f})")
print(f"Facteur réduction de variance : {(mc_std_se / mc_anti_se)**2:.2f}x")
print(df_smile.round(6).to_string(index=False))`,
      testPythonCode: `assert 'OptionSpec' in globals() and 'BlackScholesPricer' in globals()
assert callable(monte_carlo_standard) and callable(monte_carlo_antithetic) and callable(implied_volatility_hybrid)
assert np.isclose(bs_atm['prix'], 10.187131, atol=1e-4)
assert np.isclose(bs_atm['delta'] - put_atm['delta'], 1.0, atol=1e-10)
assert np.isclose(bs_atm['gamma'], put_atm['gamma'], atol=1e-10)
assert np.isclose(bs_atm['vega'], put_atm['vega'], atol=1e-10)
assert abs(mc_anti_px - bs_atm['prix']) < 0.25
assert mc_anti_se < mc_std_se
assert len(df_smile) == 7 and df_smile['Erreur_Abs'].max() < 1e-7
iv_deep = implied_volatility_hybrid(0.45, 100.0, 130.0, 0.5, 0.02, 'call')
assert abs(BlackScholesPricer().price_and_greeks(OptionSpec(100.0, 130.0, 0.5, 0.02, iv_deep, 'call'))['prix'] - 0.45) < 1e-6`,
      datasets: [],
      hints: [
        "Dans monte_carlo_antithetic, tirez n_half = n_paths // 2 normales centrées réduites avec np.random.default_rng(seed), évaluez +z et -z, puis divisez l'écart-type de pair_pv par np.sqrt(n_half).",
        "Dans implied_volatility_hybrid, maintenez un intervalle [low, high] mis à jour à chaque itération et choisissez la dichotomie 0.5 * (low + high) si vega <= 1e-8 ou si le pas de Newton sort de ]low, high[.",
        "Pour la légende combinée sur ax2 avec twinx(), récupérez l1 = ax2.plot(...) et l2 = ax2_t.plot(...) puis appelez ax2.legend(l1 + l2, [l.get_label() for l in l1 + l2])."
      ],
      guide: {
        theoryToPracticeLink:
          "Sur le Call ATM ($S=K=100, T=1, r=3\\%, \\sigma=22\\%$), le pricer analytique donne $10.1871\\text{ EUR}$ et vérifie exactement $\\Delta_{\\text{Call}} - \\Delta_{\\text{Put}} = 1$. À budget identique de $20\\,000$ évaluations, les variables antithétiques abaissent l'erreur standard de $0.11155$ à $0.08506$ (facteur de réduction de variance $\\times 1.72$), tandis que le solveur hybride retrouve tous les points du smile avec une erreur maximale inférieure à $10^{-9}$.",
        stepByStepPlan: [
          "Définir `@dataclass class OptionSpec` et `class BlackScholesPricer` avec la méthode `price_and_greeks(spec)`.",
          "Implémenter `monte_carlo_standard` et `monte_carlo_antithetic` avec `np.random.default_rng(seed)` pour comparer leurs erreurs standard.",
          "Coder `implied_volatility_hybrid` combinant pas de Newton analytique et encadrement par dichotomie.",
          "Calibrer les 7 strikes du smile dans `df_smile` et vérifier les invariants (parité Call-Put, réduction de variance, erreur < `1e-7`).",
          "Tracer le smile de volatilité (panneau gauche) et les profils Delta/Gamma sur double axe (panneau droit)."
        ],
        concepts: [
          {
            symbol: "@dataclass OptionSpec",
            kind: "Syntaxe",
            roleInExercise: "Contrat de données structurant sous-jacent, strike, maturité, taux, volatilité et type d'option."
          },
          {
            symbol: "BlackScholesPricer.price_and_greeks",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule en une passe le prix exact BSM et les 5 Grecs analytiques (\`delta, gamma, vega, theta, rho\`)."
          },
          {
            symbol: "monte_carlo_antithetic",
            kind: "Fonction / Méthode",
            roleInExercise: "Exploite l'appariement $(+Z, -Z)$ pour réduire la variance d'estimation à budget constant de $20\\,000$ trajectoires."
          },
          {
            symbol: "implied_volatility_hybrid",
            kind: "Fonction / Méthode",
            roleInExercise: "Inverse le prix marché via Newton-Raphson sécurisé par repli automatique vers la dichotomie."
          },
          {
            symbol: "df_smile",
            kind: "Variable",
            roleInExercise: "DataFrame à $7$ strikes ($[80 \\dots 120]$) synthétisant la calibration du smile et les sensibilités associées."
          },
          {
            symbol: "ax2.twinx()",
            kind: "Fonction / Méthode",
            roleInExercise: "Crée un second axe vertical sur le panneau droit pour superposer $\\Delta$ et $\\Gamma$ sans écrasement d'échelle."
          }
        ],
        guidedCode: `from dataclasses import dataclass
from typing import Dict, Tuple
import numpy as np
import pandas as pd
from scipy.stats import norm
import matplotlib.pyplot as plt

# Étape 1 : Dataclass OptionSpec & BlackScholesPricer
@dataclass
class OptionSpec:
    S: float
    K: float
    T: float
    r: float
    sigma: float
    option_type: str = "call"

class BlackScholesPricer:
    def price_and_greeks(self, spec: OptionSpec) -> Dict[str, float]:
        sqrt_t = float(np.sqrt(spec.T))
        d1 = (np.log(spec.S / spec.K) + (spec.r + 0.5 * spec.sigma ** 2) * spec.T) / (spec.sigma * sqrt_t)
        d2 = d1 - spec.sigma * sqrt_t
        pdf_d1, disc_k = float(norm.pdf(d1)), float(spec.K * np.exp(-spec.r * spec.T))
        if spec.option_type == "call":
            prix = float(spec.S * norm.cdf(d1) - disc_k * norm.cdf(d2))
            delta, theta = float(norm.cdf(d1)), float(-(spec.S * pdf_d1 * spec.sigma) / (2.0 * sqrt_t) - spec.r * disc_k * norm.cdf(d2))
            rho = float(spec.T * disc_k * norm.cdf(d2))
        elif spec.option_type == "put":
            prix = float(___)
            delta, theta = float(norm.cdf(d1) - 1.0), float(-(spec.S * pdf_d1 * spec.sigma) / (2.0 * sqrt_t) + spec.r * disc_k * norm.cdf(-d2))
            rho = float(-spec.T * disc_k * norm.cdf(-d2))
        else:
            raise ValueError("option_type doit être 'call' ou 'put'")
        return {'prix': prix, 'delta': delta, 'gamma': float(pdf_d1 / (spec.S * spec.sigma * sqrt_t)),
                'vega': float(spec.S * sqrt_t * pdf_d1), 'theta': theta, 'rho': rho}

# Étape 2 : Monte Carlo Standard vs Antithétique
def monte_carlo_standard(spec: OptionSpec, n_paths: int = 20000, seed: int = 42) -> Tuple[float, float]:
    z = np.random.default_rng(seed).standard_normal(n_paths)
    s_t = spec.S * np.exp((spec.r - 0.5 * spec.sigma ** 2) * spec.T + spec.sigma * np.sqrt(spec.T) * z)
    pay = np.maximum(s_t - spec.K, 0.0) if spec.option_type == "call" else np.maximum(spec.K - s_t, 0.0)
    pv = np.exp(-spec.r * spec.T) * pay
    return float(np.mean(pv)), float(np.std(pv, ddof=1) / np.sqrt(n_paths))

def monte_carlo_antithetic(spec: OptionSpec, n_paths: int = 20000, seed: int = 42) -> Tuple[float, float]:
    n_half = n_paths // 2
    z = np.random.default_rng(seed).standard_normal(n_half)
    drift, vol_t = (spec.r - 0.5 * spec.sigma ** 2) * spec.T, spec.sigma * np.sqrt(spec.T)
    s_p, s_m = spec.S * np.exp(drift + vol_t * z), spec.S * np.exp(drift - vol_t * z)
    if spec.option_type == "call":
        pay_p, pay_m = np.maximum(s_p - spec.K, 0.0), np.maximum(s_m - spec.K, 0.0)
    else:
        pay_p, pay_m = np.maximum(spec.K - s_p, 0.0), np.maximum(spec.K - s_m, 0.0)
    pair_pv = ___
    return float(np.mean(pair_pv)), float(np.std(pair_pv, ddof=1) / np.sqrt(n_half))

# Étape 3 : Solveur hybride Newton-Raphson + Dichotomie
def implied_volatility_hybrid(
    market_price: float, S: float, K: float, T: float, r: float,
    option_type: str = "call", tol: float = 1e-8, max_iter: int = 100
) -> float:
    pricer, low, high, sigma = BlackScholesPricer(), 1e-4, 5.0, 0.25
    for _ in range(max_iter):
        res = pricer.price_and_greeks(OptionSpec(S, K, T, r, sigma, option_type))
        diff = res['prix'] - market_price
        if abs(diff) < tol:
            return float(sigma)
        low, high = (max(low, sigma), high) if diff < 0.0 else (low, min(high, sigma))
        cand = ___
        sigma = cand if (low < cand < high) else 0.5 * (low + high)
    return float(sigma)

# Étape 4 : Calibration du smile et graphiques
pricer = BlackScholesPricer()
spec_atm = OptionSpec(S=100.0, K=100.0, T=1.0, r=0.03, sigma=0.22, option_type="call")
bs_atm = pricer.price_and_greeks(spec_atm)
put_atm = pricer.price_and_greeks(OptionSpec(100.0, 100.0, 1.0, 0.03, 0.22, "put"))
mc_std_px, mc_std_se = monte_carlo_standard(spec_atm, n_paths=20000, seed=42)
mc_anti_px, mc_anti_se = monte_carlo_antithetic(spec_atm, n_paths=20000, seed=42)

strikes = [80, 90, 95, 100, 105, 110, 120]
vols_cibles = [0.300, 0.255, 0.235, 0.220, 0.212, 0.215, 0.230]
rows_smile = []
for k, v_true in zip(strikes, vols_cibles):
    g = pricer.price_and_greeks(OptionSpec(100.0, float(k), 1.0, 0.03, v_true, "call"))
    iv = implied_volatility_hybrid(g['prix'], 100.0, float(k), 1.0, 0.03, "call")
    rows_smile.append({'Strike': k, 'Prix_Marche': g['prix'], 'Vol_Cible': v_true, 'Vol_Implicite': iv, 'Erreur_Abs': abs(iv - v_true), 'Delta': g['delta'], 'Gamma': g['gamma']})
df_smile = pd.DataFrame(rows_smile)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
ax1.plot(df_smile['Strike'], df_smile['Vol_Implicite'] * 100, marker='o', color='#0284c7')
spots = np.linspace(70.0, 130.0, 61)
deltas = [pricer.price_and_greeks(OptionSpec(s, 100.0, 1.0, 0.03, 0.22, "call"))['delta'] for s in spots]
ax2.plot(spots, deltas, color='#0f172a')
print(df_smile.round(6))`
      }
    },

    // =========================================================================
    // PROJET 4 : MOTEUR ACTUARIEL IARD & PROVISIONNEMENT CHAIN-LADDER
    // =========================================================================
    {
      id: "v4-py-4",
      title: "Projet 4 — Moteur Actuariel IARD : Tarification Fréquence-Sévérité & Provisionnement Chain-Ladder",
      category: "pricing",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 60,
      description:
        "Réunissez les deux piliers techniques de l'assurance dommages : un pipeline Fréquence-Sévérité anti-fan-out distinguant sinistralité écrêtée (attritionnelle) et brute sur df_assures et df_sinistres, et un moteur de provisionnement Chain-Ladder calculant les facteurs de développement et les réserves IBNR sur un triangle 5x5.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Tarification Écrêtée IARD & Provisionnement Chain-Ladder

#### Intuition Économique & Double Pilotage d'une Compagnie IARD
La rentabilité d'un assureur dommages (Auto, MRH, RC) repose sur deux équipes techniques complémentaires :
1. **L'Actuariat Tarification (*Pricing*)**, qui décompose la prime pure en fréquence $\\times$ sévérité sur les polices et sinistres. Afin de ne pas sur-réagir à un sinistre grave isolé (un vol à $18\\,500\\text{ EUR}$ ou un corporel lourd), les actuaires séparent la **charge attritionnelle (écrêtée sous un seuil $L = 10\\,000\\text{ EUR}$)** de la **charge pointe** mutualisée sur l'ensemble du portefeuille ou cédée en réassurance XS (*Excess of Loss*).
2. **L'Actuariat Provisionnement (*Reserving*)**, qui estime à la clôture comptable le coût des sinistres déjà survenus mais pas encore intégralement payés ou déclarés : l'**IBNR** (*Incurred But Not Reported* / *IBNER*), modélisé par la méthode de référence **Chain-Ladder** sur un triangle de liquidation $(i, j)$.

#### Démonstration Mathématique Formelle
1. **Pipeline Anti-Fan-Out & Décomposition Écrêtée :**
   Soit $M = 12$ polices, chacune associée après pré-agrégation unique par \`police_id\` à $N_i$ sinistres et aux charges brute $S_i = \\sum_{k=1}^{N_i} X_{i,k}$ et écrêtée $S_i^{(L)} = \\sum_{k=1}^{N_i} \\min(X_{i,k}, L)$ :
   $$\\hat{f} = \\frac{\\sum_{i=1}^M N_i}{M}, \\qquad \\widehat{CM}_{\\text{brut}} = \\frac{\\sum S_i}{\\sum N_i}, \\qquad \\widehat{CM}_{\\text{écrêtée}} = \\frac{\\sum S_i^{(L)}}{\\sum N_i}, \\qquad S/P = \\frac{\\sum S_i}{\\sum P_i}$$

2. **Modèle de Mack / Algorithme Chain-Ladder Déterministe :**
   Soit $C_{i, j}$ le montant cumulé payé pour l'année de survenance $i \\in \\{0, \\dots, n-1\\}$ après $j \\in \\{0, \\dots, n-1\\}$ années de développement (triangle observé pour $i + j \\le n - 1$).
   Les facteurs de passage âge à âge (*link ratios*) pondérés par le volume valent :
   $$\\hat{f}_j = \\frac{\\sum_{i=0}^{n-2-j} C_{i, j+1}}{\\sum_{i=0}^{n-2-j} C_{i, j}}, \\qquad j \\in \\{0, \\dots, n-2\\}$$
   La projection récursive du triangle inférieur s'effectue par $\\widehat{C}_{i, j} = \\widehat{C}_{i, j-1} \\cdot \\hat{f}_{j-1}$ pour $i + j \\ge n$, donnant pour chaque exercice $i$ l'ultime $\\widehat{U}_i = \\widehat{C}_{i, n-1}$ et la provision à constituer :
   $$\\text{IBNR}_i = \\widehat{U}_i - C_{i, n-1-i}, \\qquad \\text{IBNR}_{\\text{total}} = \\sum_{i=0}^{n-1} \\text{IBNR}_i$$

### 💻 Masterclass Python : Hygiène Relationnelle & Algèbre de Triangles

* **Zéro *fan-out* & zéro mutation :** Copier \`df_sinistres\` et \`df_assures\`, agréger au grain \`police_id\` avant \`pd.merge(..., how='left')\` puis imputer les \`NaN\` par \`0.0\` préserve exactement les $11\\,306.80\\text{ EUR}$ de primes acquises.
* **Masque vectorisé Chain-Ladder :** \`valid = ~np.isnan(tri[:, j]) & ~np.isnan(tri[:, j + 1])\` sélectionne automatiquement les lignes observées simultanément aux âges $j$ et $j+1$ sans indexation fragile.
* **Extraction de la diagonale courante :** \`triangle[i, n - 1 - i]\` lit le dernier cumul payé connu de chaque année de survenance $i$ pour garantir l'identité comptable \`Paye_Cumule + IBNR == Ultime\`.

\`\`\`python
import numpy as np

sin_c = df_sinistres.copy()
sin_c['cout_ecrete'] = np.minimum(sin_c['cout_total'], 10_000.0)
print(f"Sévérité brute={sin_c['cout_total'].mean():,.2f} EUR vs écrêtée (10k)={sin_c['cout_ecrete'].mean():,.2f} EUR")
tri = np.array([[1200., 1850., 2180.], [1320., 2010., np.nan], [1410., np.nan, np.nan]])
f1 = (tri[0, 1] + tri[1, 1]) / (tri[0, 0] + tri[1, 0])
f2 = tri[0, 2] / tri[0, 1]
ult_2021 = tri[2, 0] * f1 * f2
print(f"Facteurs Chain-Ladder 3x3 : f1={f1:.4f}, f2={f2:.4f} | Ultime 2021={ult_2021:.2f} | IBNR={ult_2021 - tri[2, 0]:.2f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Sévérité brute=6,118.75 EUR vs écrêtée (10k)=4,843.75 EUR
Facteurs Chain-Ladder 3x3 : f1=1.5317, f2=1.1784 | Ultime 2021=2545.02 | IBNR=1135.02
\`\`\`

### 📦 Export Portfolio GitHub (Architecture & README)

\`\`\`text
iard-pricing-reserving/
├── README.md                  # Tarification attritionnelle vs grave & méthodologie Chain-Ladder
├── pyproject.toml             # Config Black, Ruff, Pytest
├── assets/
│   └── iard_reserving.png     # Dashboard 2 panneaux (S/P régional + IBNR par cohorte)
├── src/iard/
│   ├── pricing_pipeline.py    # pipeline_technique_iard() anti-fan-out & écrêtement
│   └── chain_ladder.py        # chain_ladder_ibnr() & facteurs de liquidation
└── tests/
    └── test_iard_engine.py    # Conservation primes, bornes écrêtement & Paye + IBNR = Ultime
\`\`\`

* **Feuille de route *scaling* hors navigateur :** Migrer le module tarification vers des GLM **Poisson (fréquence) $\\times$ Gamma (sévérité)** sur le dataset public français \`freMTPL2\` ($678\\,000$ polices), et intégrer le modèle stochastique de **Mack / Bootstrap** pour quantifier la variance de l'IBNR sous Solvabilité II.
* **Questions classiques d'entretien Actuariat IARD :**
  1. *Pourquoi écrêter les sinistres graves avant de tarifer la segmentation régionale ?* Parce qu'un seul vol ou corporel grave ($18\\,500\\text{ EUR}$) biaiserait durablement le coefficient d'une petite région alors que ces pointes relèvent d'une charge mutualisée (ou réassurance XS).
  2. *Quelle hypothèse fondamentale sous-tend Chain-Ladder ?* L'indépendance des années de survenance et la stabilité temporelle des cadences de règlement (absence de dérive d'inflation ou de changement de politique de gestion des dossiers).
  3. *Comment compléter Chain-Ladder pour l'exercice le plus récent (2023) lorsqu'un facteur de queue est instable ?* En appliquant la méthode de **Bornhuetter-Ferguson**, qui pondère le payé constaté par un *loss ratio* a priori issu de la tarification.
      `,
      taskMarkdown: `**🎯 Cahier des Charges Portfolio (Architecture & Contrats d'API) :**

Implémentez un moteur complet de tarification IARD et de provisionnement Chain-Ladder respectant exactement les noms suivants :

1. **Fonction \`pipeline_technique_iard(df_ass, df_sin, seuil_ecretement=10_000.0)\`** :
   - Pré-agrège \`df_sin\` par \`police_id\` (avec \`cout_ecrete = np.minimum(cout_total, seuil_ecretement)\`), fusionne à gauche sur \`df_ass\` sans duplication, et impute les \`NaN\` à \`0.0\`.
   - Retourne le triplet \`(df_portefeuille, tarif_regions, kpis_iard)\` :
     - \`tarif_regions\` (trié par \`ratio_sp\` décroissant) contient \`['region', 'nb_polices', 'nb_sinistres', 'primes_totales', 'charge_totale', 'charge_ecretee', 'frequence', 'severite_brute', 'severite_ecretee', 'prime_pure', 'prime_pure_ecretee', 'ratio_sp']\`.
     - \`kpis_iard\` contient \`'nb_polices'\`, \`'nb_sinistres'\`, \`'frequence'\`, \`'severite_brute'\`, \`'severite_ecretee'\`, \`'prime_pure'\`, \`'prime_pure_ecretee'\`, \`'sp_global'\`.
2. **Fonction \`chain_ladder_ibnr(triangle, annees=None)\`** :
   - Calcule les facteurs âge à âge \`facteurs\` (vecteur de taille $n-1$), projette le triangle inférieur \`tri_projete\` et construit \`df_ibnr\` avec colonnes \`['Annee', 'Paye_Cumule', 'Ultime', 'IBNR', 'Pct_Developpe']\`.
   - Retourne \`(facteurs, tri_projete, df_ibnr)\`.
3. **Application sur le Triangle $5 \\times 5$ (en k EUR, \`annees_surv = [2019, 2020, 2021, 2022, 2023]\`)** :
   - \`triangle_iard = np.array([[1200, 1850, 2180, 2310, 2360], [1320, 2010, 2390, 2540, nan], [1410, 2190, 2580, nan, nan], [1550, 2380, nan, nan, nan], [1680, nan, nan, nan, nan]], dtype=float)\`.
   - Stockez \`facteurs_cl, triangle_projete, df_ibnr = chain_ladder_ibnr(triangle_iard, annees_surv)\` et \`total_ibnr = float(df_ibnr['IBNR'].sum())\`.
4. **Invariants & Dashboard Matplotlib 2 Panneaux (\`plt.subplots(1, 2)\`)** :
   - Vérifiez par \`assert\` la conservation des primes ($11\\,306.80\\text{ EUR}$), \`severite_ecretee < severite_brute\`, \`facteurs_cl > 1\` et \`IBNR_2019 == 0\`.
   - Tracez le ratio $S/P$ régional (gauche) et les barres empilées \`Paye_Cumule + IBNR\` par année (droite) sans \`plt.show()\`.`,
      initialCode: "# Rédigez votre architecture Python Portfolio ci-dessous :\n",
      solutionCode: `from typing import Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def pipeline_technique_iard(
    df_ass: pd.DataFrame, df_sin: pd.DataFrame, seuil_ecretement: float = 10_000.0
) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, float]]:
    """Fusionne polices/sinistres sans fan-out et calcule fréquence, sévérité écrêtée/brute et S/P."""
    sin_c = df_sin.copy()
    sin_c['cout_corporel'] = sin_c['cout_corporel'].fillna(0.0)
    sin_c['cout_ecrete'] = np.minimum(sin_c['cout_total'], seuil_ecretement)
    sin_agg = sin_c.groupby('police_id', as_index=False).agg(
        nb_sinistres=('sinistre_id', 'count'),
        cout_total=('cout_total', 'sum'),
        cout_ecrete=('cout_ecrete', 'sum'),
    )
    port = pd.merge(df_ass.copy(), sin_agg, on='police_id', how='left').fillna(
        {'nb_sinistres': 0, 'cout_total': 0.0, 'cout_ecrete': 0.0}
    )
    port['nb_sinistres'] = port['nb_sinistres'].astype(int)

    tarif_regions = port.groupby('region', as_index=False).agg(
        nb_polices=('police_id', 'count'),
        nb_sinistres=('nb_sinistres', 'sum'),
        primes_totales=('prime_annuelle', 'sum'),
        charge_totale=('cout_total', 'sum'),
        charge_ecretee=('cout_ecrete', 'sum'),
    )
    tarif_regions['frequence'] = tarif_regions['nb_sinistres'] / tarif_regions['nb_polices']
    tarif_regions['severite_brute'] = np.where(tarif_regions['nb_sinistres'] > 0, tarif_regions['charge_totale'] / tarif_regions['nb_sinistres'], 0.0)
    tarif_regions['severite_ecretee'] = np.where(tarif_regions['nb_sinistres'] > 0, tarif_regions['charge_ecretee'] / tarif_regions['nb_sinistres'], 0.0)
    tarif_regions['prime_pure'] = tarif_regions['charge_totale'] / tarif_regions['nb_polices']
    tarif_regions['prime_pure_ecretee'] = tarif_regions['charge_ecretee'] / tarif_regions['nb_polices']
    tarif_regions['ratio_sp'] = tarif_regions['charge_totale'] / tarif_regions['primes_totales']
    tarif_regions = tarif_regions.sort_values('ratio_sp', ascending=False).reset_index(drop=True)

    n_pol, n_sin = len(port), int(port['nb_sinistres'].sum())
    kpis = {
        'nb_polices': float(n_pol), 'nb_sinistres': float(n_sin),
        'frequence': float(n_sin / n_pol),
        'severite_brute': float(port['cout_total'].sum() / n_sin),
        'severite_ecretee': float(port['cout_ecrete'].sum() / n_sin),
        'prime_pure': float(port['cout_total'].sum() / n_pol),
        'prime_pure_ecretee': float(port['cout_ecrete'].sum() / n_pol),
        'sp_global': float(port['cout_total'].sum() / port['prime_annuelle'].sum()),
    }
    return port, tarif_regions, kpis

def chain_ladder_ibnr(triangle: np.ndarray, annees: Optional[List[int]] = None) -> Tuple[np.ndarray, np.ndarray, pd.DataFrame]:
    """Calcule les facteurs de développement Chain-Ladder, projette le triangle et chiffre l'IBNR."""
    tri = np.array(triangle, dtype=float).copy()
    n = tri.shape[0]
    if annees is None:
        annees = list(range(2019, 2019 + n))
    facteurs = np.zeros(n - 1, dtype=float)
    for j in range(n - 1):
        valid = ~np.isnan(tri[:, j]) & ~np.isnan(tri[:, j + 1])
        facteurs[j] = float(np.sum(tri[valid, j + 1]) / np.sum(tri[valid, j]))
    for i in range(1, n):
        for j in range(n - i, n):
            tri[i, j] = tri[i, j - 1] * facteurs[j - 1]
    paye_cumule = np.array([triangle[i, n - 1 - i] for i in range(n)], dtype=float)
    ultime = tri[:, -1]
    ibnr = ultime - paye_cumule
    df_ibnr = pd.DataFrame({
        'Annee': annees, 'Paye_Cumule': paye_cumule, 'Ultime': ultime,
        'IBNR': ibnr, 'Pct_Developpe': paye_cumule / ultime,
    })
    return facteurs, tri, df_ibnr

df_portefeuille, tarif_regions, kpis_iard = pipeline_technique_iard(df_assures, df_sinistres, seuil_ecretement=10_000.0)
annees_surv = [2019, 2020, 2021, 2022, 2023]
triangle_iard = np.array([
    [1200.0, 1850.0, 2180.0, 2310.0, 2360.0],
    [1320.0, 2010.0, 2390.0, 2540.0, np.nan],
    [1410.0, 2190.0, 2580.0, np.nan, np.nan],
    [1550.0, 2380.0, np.nan, np.nan, np.nan],
    [1680.0, np.nan, np.nan, np.nan, np.nan],
], dtype=float)
facteurs_cl, triangle_projete, df_ibnr = chain_ladder_ibnr(triangle_iard, annees_surv)
total_ibnr = float(df_ibnr['IBNR'].sum())

assert len(df_portefeuille) == 12 and np.isclose(df_portefeuille['prime_annuelle'].sum(), 11306.80)
assert kpis_iard['severite_ecretee'] < kpis_iard['severite_brute']
assert np.all(facteurs_cl > 1.0) and np.isclose(df_ibnr.loc[0, 'IBNR'], 0.0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
colors_sp = ['#e11d48' if sp > 1.0 else '#10b981' for sp in tarif_regions['ratio_sp']]
ax1.barh(tarif_regions['region'], tarif_regions['ratio_sp'] * 100, color=colors_sp, alpha=0.85)
ax1.axvline(100.0, color='#0f172a', ls='--', lw=1.4, label='Équilibre 100%')
ax1.invert_yaxis(); ax1.set_xlabel('Ratio S/P (%)'); ax1.set_title('Rentabilité Technique par Région (IARD)')
ax1.legend(fontsize=8); ax1.grid(True, axis='x', alpha=0.3)

ax2.bar(df_ibnr['Annee'], df_ibnr['Paye_Cumule'], color='#0284c7', label='Payé Cumulé')
ax2.bar(df_ibnr['Annee'], df_ibnr['IBNR'], bottom=df_ibnr['Paye_Cumule'], color='#f59e0b', label='IBNR')
ax2.set_xlabel('Année de survenance'); ax2.set_ylabel('Montant (k EUR)')
ax2.set_title(f'Chain-Ladder 5x5 : Total IBNR = {total_ibnr:,.1f} k EUR')
ax2.legend(fontsize=8); ax2.grid(True, axis='y', alpha=0.3)

print(f"KPIs IARD -> Fréq: {kpis_iard['frequence']:.4f} | Sév brute: {kpis_iard['severite_brute']:,.2f} | Sév écrêtée: {kpis_iard['severite_ecretee']:,.2f} | S/P: {kpis_iard['sp_global']:.2%}")
print("Facteurs Chain-Ladder :", [round(float(f), 4) for f in facteurs_cl])
print(df_ibnr.round(2).to_string(index=False))`,
      testPythonCode: `assert callable(pipeline_technique_iard) and callable(chain_ladder_ibnr)
assert len(df_portefeuille) == 12 and np.isclose(df_portefeuille['prime_annuelle'].sum(), 11306.80, atol=1e-4)
assert np.isclose(kpis_iard['frequence'], 8.0 / 12.0, atol=1e-6)
assert np.isclose(kpis_iard['severite_brute'], 6118.75, atol=1e-4)
assert np.isclose(kpis_iard['severite_ecretee'], 4843.75, atol=1e-4)
assert np.isclose(kpis_iard['prime_pure'], 48950.0 / 12.0, atol=1e-4)
assert np.isclose(kpis_iard['sp_global'], 48950.0 / 11306.80, atol=1e-6)
assert len(tarif_regions) == 9 and tarif_regions.loc[0, 'region'] == 'Grand Est'
assert len(facteurs_cl) == 4 and np.isclose(facteurs_cl[0], 1.538321, atol=1e-4)
assert np.isclose(df_ibnr.loc[0, 'IBNR'], 0.0, atol=1e-8)
assert np.isclose(total_ibnr, 2573.55, atol=0.5)
assert np.allclose(df_ibnr['Paye_Cumule'] + df_ibnr['IBNR'], df_ibnr['Ultime'], atol=1e-6)`,
      datasets: [],
      hints: [
        "Dans pipeline_technique_iard, calculez cout_ecrete = np.minimum(sin_c['cout_total'], seuil_ecretement) avant d'agréger df_sinistres par police_id, puis utilisez np.where pour sécuriser les divisions sur régions sans sinistre.",
        "Dans chain_ladder_ibnr, utilisez valid = ~np.isnan(tri[:, j]) & ~np.isnan(tri[:, j + 1]) pour calculer chaque facteur f_j = sum(tri[valid, j+1]) / sum(tri[valid, j]).",
        "La diagonale payée connue de la ligne i correspond à triangle[i, n - 1 - i], et l'IBNR vaut ultime - paye_cumule."
      ],
      guide: {
        theoryToPracticeLink:
          "Sur les $12$ contrats de \`df_assures\` et $8$ dossiers de \`df_sinistres\`, le pipeline anti-fan-out maintient exactement $11\\,306.80\\text{ EUR}$ de primes tout en montrant que l'écrêtement à $10\\,000\\text{ EUR}$ ramène la sévérité moyenne de $6\\,118.75\\text{ EUR}$ à $4\\,843.75\\text{ EUR}$. Côté provisionnement, le moteur \`chain_ladder_ibnr\` estime les facteurs $[1.5383, 1.1818, 1.0613, 1.0216]$ et dégage $2\\,573.55\\text{ k EUR}$ d'IBNR total dont $1\\,631.56\\text{ k EUR}$ pour la cohorte $2023$.",
        stepByStepPlan: [
          "Implémenter `pipeline_technique_iard(df_ass, df_sin, seuil_ecretement=10_000.0)` : pré-agréger par `police_id`, fusionner à gauche et construire `tarif_regions` + `kpis_iard`.",
          "Implémenter `chain_ladder_ibnr(triangle, annees=None)` pour estimer les facteurs âge à âge et projeter le triangle inférieur.",
          "Extraire la diagonale `Paye_Cumule`, l'ultime projeté `Ultime` et l'IBNR dans `df_ibnr`.",
          "Exécuter les deux moteurs sur `df_assures`/`df_sinistres` et `triangle_iard` ($5 \\times 5$), puis valider les invariants.",
          "Générer la figure Matplotlib à 2 panneaux (barres horizontales $S/P$ à gauche, Payé + IBNR empilés à droite)."
        ],
        concepts: [
          {
            symbol: "pipeline_technique_iard(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Pipeline modulaire IARD garantissant l'unicité des primes et séparant charge écrêtée vs brute."
          },
          {
            symbol: "np.minimum(..., seuil_ecretement)",
            kind: "Fonction / Méthode",
            roleInExercise: "Plafonne chaque sinistre individuel à $10\\,000\\text{ EUR}$ pour isoler la sinistralité attritionnelle."
          },
          {
            symbol: "tarif_regions / kpis_iard",
            kind: "Variable",
            roleInExercise: "Synthèse tarifaire régionale (9 régions) et dictionnaire global des indicateurs fréquence-sévérité."
          },
          {
            symbol: "chain_ladder_ibnr(triangle)",
            kind: "Fonction / Méthode",
            roleInExercise: "Estime les $4$ link ratios pondérés par volume, complète le triangle et chiffre les provisions IBNR."
          },
          {
            symbol: "~np.isnan(tri[:, j])",
            kind: "Syntaxe",
            roleInExercise: "Masque booléen NumPy sélectionnant exactement les exercices observés sur deux colonnes consécutives du triangle."
          },
          {
            symbol: "df_ibnr / total_ibnr",
            kind: "Variable",
            roleInExercise: "Tableau actuariel par année de survenance ($2019$–$2023$) vérifiant \`Paye_Cumule + IBNR = Ultime\`."
          }
        ],
        guidedCode: `from typing import Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Étape 1 : Pipeline Fréquence-Sévérité Anti-Fan-Out avec écrêtement
def pipeline_technique_iard(
    df_ass: pd.DataFrame, df_sin: pd.DataFrame, seuil_ecretement: float = 10_000.0
) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, float]]:
    sin_c = df_sin.copy()
    sin_c['cout_corporel'] = sin_c['cout_corporel'].fillna(0.0)
    sin_c['cout_ecrete'] = np.minimum(sin_c['cout_total'], seuil_ecretement)
    sin_agg = sin_c.groupby('police_id', as_index=False).agg(
        nb_sinistres=('sinistre_id', 'count'),
        cout_total=('cout_total', 'sum'),
        cout_ecrete=('cout_ecrete', 'sum'),
    )
    port = pd.merge(df_ass.copy(), sin_agg, on='police_id', how='left').fillna(
        {'nb_sinistres': 0, 'cout_total': 0.0, 'cout_ecrete': 0.0}
    )
    port['nb_sinistres'] = port['nb_sinistres'].astype(int)

    tarif_regions = port.groupby('region', as_index=False).agg(
        nb_polices=('police_id', 'count'), nb_sinistres=('nb_sinistres', 'sum'),
        primes_totales=('prime_annuelle', 'sum'), charge_totale=('cout_total', 'sum'), charge_ecretee=('cout_ecrete', 'sum'),
    )
    tarif_regions['frequence'] = tarif_regions['nb_sinistres'] / tarif_regions['nb_polices']
    tarif_regions['severite_brute'] = np.where(tarif_regions['nb_sinistres'] > 0, tarif_regions['charge_totale'] / tarif_regions['nb_sinistres'], 0.0)
    tarif_regions['severite_ecretee'] = ___
    tarif_regions['prime_pure'] = tarif_regions['charge_totale'] / tarif_regions['nb_polices']
    tarif_regions['prime_pure_ecretee'] = tarif_regions['charge_ecretee'] / tarif_regions['nb_polices']
    tarif_regions['ratio_sp'] = tarif_regions['charge_totale'] / tarif_regions['primes_totales']
    tarif_regions = tarif_regions.sort_values('ratio_sp', ascending=False).reset_index(drop=True)

    n_pol, n_sin = len(port), int(port['nb_sinistres'].sum())
    kpis = {
        'nb_polices': float(n_pol), 'nb_sinistres': float(n_sin),
        'frequence': float(n_sin / n_pol),
        'severite_brute': float(port['cout_total'].sum() / n_sin),
        'severite_ecretee': float(port['cout_ecrete'].sum() / n_sin),
        'prime_pure': float(port['cout_total'].sum() / n_pol),
        'prime_pure_ecretee': float(port['cout_ecrete'].sum() / n_pol),
        'sp_global': float(port['cout_total'].sum() / port['prime_annuelle'].sum()),
    }
    return port, tarif_regions, kpis

# Étape 2 : Moteur Chain-Ladder 5x5
def chain_ladder_ibnr(triangle: np.ndarray, annees: Optional[List[int]] = None) -> Tuple[np.ndarray, np.ndarray, pd.DataFrame]:
    tri = np.array(triangle, dtype=float).copy()
    n = tri.shape[0]
    if annees is None:
        annees = list(range(2019, 2019 + n))
    facteurs = np.zeros(n - 1, dtype=float)
    for j in range(n - 1):
        valid = ~np.isnan(tri[:, j]) & ~np.isnan(tri[:, j + 1])
        facteurs[j] = float(___)
    for i in range(1, n):
        for j in range(n - i, n):
            tri[i, j] = ___
    paye_cumule = np.array([triangle[i, n - 1 - i] for i in range(n)], dtype=float)
    ultime = tri[:, -1]
    ibnr = ultime - paye_cumule
    df_ibnr = pd.DataFrame({'Annee': annees, 'Paye_Cumule': paye_cumule, 'Ultime': ultime, 'IBNR': ibnr, 'Pct_Developpe': paye_cumule / ultime})
    return facteurs, tri, df_ibnr

# Étape 3 : Exécution et Dashboard 2 panneaux
df_portefeuille, tarif_regions, kpis_iard = pipeline_technique_iard(df_assures, df_sinistres, seuil_ecretement=10_000.0)
annees_surv = [2019, 2020, 2021, 2022, 2023]
triangle_iard = np.array([
    [1200.0, 1850.0, 2180.0, 2310.0, 2360.0],
    [1320.0, 2010.0, 2390.0, 2540.0, np.nan],
    [1410.0, 2190.0, 2580.0, np.nan, np.nan],
    [1550.0, 2380.0, np.nan, np.nan, np.nan],
    [1680.0, np.nan, np.nan, np.nan, np.nan],
], dtype=float)
facteurs_cl, triangle_projete, df_ibnr = chain_ladder_ibnr(triangle_iard, annees_surv)
total_ibnr = float(df_ibnr['IBNR'].sum())

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 4.0), constrained_layout=True)
ax1.barh(tarif_regions['region'], tarif_regions['ratio_sp'] * 100, color='#0284c7')
ax2.bar(df_ibnr['Annee'], df_ibnr['Paye_Cumule'], color='#0284c7', label='Payé')
ax2.bar(df_ibnr['Annee'], df_ibnr['IBNR'], bottom=df_ibnr['Paye_Cumule'], color='#f59e0b', label='IBNR')
print(df_ibnr.round(2))`
      }
    }
  ]
};
