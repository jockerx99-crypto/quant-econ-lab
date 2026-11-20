import { CourseModule } from "@/types/course";

export const V3_PYTHON_CASES_MODULE: CourseModule = {
  id: "v3-py-cases",
  title: "Cas Réels Python : Actuariat, ALM, Quant & Risques",
  subtitle:
    "Mini-Projets End-to-End : Pricing IARD, Immunisation ALM, Markowitz, CAPM, Black-Scholes & Solvabilité II",
  icon: "TrendingUp",
  description:
    "10 études de cas complètes inspirées de missions réelles en direction technique IARD, ALM bancaire/assurance, gestion quantitative et modélisation des risques. Chaque projet structure un pipeline Python complet avec fonctions réutilisables, démonstrations mathématiques, diagnostics statistiques et assertions industrielles.",
  exercises: [
    // =========================================================================
    // CAS 1 : PIPELINE ACTUARIEL IARD END-TO-END
    // =========================================================================
    {
      id: "v3-py-1",
      title: "1. Pipeline Actuariel IARD End-to-End (df_assures & df_sinistres)",
      category: "pricing",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 25,
      description:
        "Construisez un pipeline actuariel complet fusionnant sans duplication (anti-fan-out) les polices df_assures et les sinistres df_sinistres pour calculer fréquence, coût moyen, prime pure et ratio S/P par région.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Modèle Fréquence-Sévérité & Piège du Fan-Out Relationnel

#### Intuition Économique & Enjeux de Direction Technique IARD
En assurance dommages (Auto, MRH), les données résident dans deux tables à granularité différente : la table des **polices** (\`df_assures\`, 1 ligne = 1 contrat souscrit) et le registre des **sinistres** (\`df_sinistres\`, 0, 1 ou plusieurs dossiers par contrat). Fusionner naïvement ces deux tables avant agrégation provoque une erreur critique appelée **fan-out** (*explosion de cardinalité*) : une police ayant déclaré $2$ sinistres voit sa \`prime_annuelle\` comptée deux fois ! À l'inverse, ignorer les contrats sans sinistre lors d'une jointure interne (\`inner\`) surestime artificiellement la fréquence en éliminant les zéros.

Le suivi de la rentabilité technique repose sur le **Ratio Sinistres à Primes ($S/P$)** et la décomposition de la **Prime Pure** : un segment régional dont le $S/P > 100\\%$ détruit les fonds propres de l'assureur avant même d'intégrer les frais de gestion et d'acquisition.

#### Démonstration Mathématique Formelle
Soit un portefeuille de $M$ polices indexées par $i \\in \\{1, \\dots, M\\}$, chacune associée à une prime acquise $P_i > 0$, à un nombre de sinistres $N_i \\in \\mathbb{N}$ et à une charge totale $S_i = \\sum_{k=1}^{N_i} X_{i,k}$ (avec la convention $S_i = 0$ lorsque $N_i = 0$).

1. **Hypothèse d'indépendance Fréquence-Sévérité (Modèle Collectif) :**
   Si la sévérité $X_{i,k}$ est indépendante du nombre de sinistres $N_i$ et identiquement distribuée selon une loi d'espérance $\\mathbb{E}[X]$, l'espérance de charge par police (la **Prime Pure** $PP$) se factorise par la loi de l'espérance totale :
   $$PP = \\mathbb{E}[S_i] = \\mathbb{E}\\big[\\mathbb{E}[S_i \\mid N_i]\\big] = \\mathbb{E}[N_i \\cdot \\mathbb{E}[X]] = \\underbrace{\\mathbb{E}[N_i]}_{\\text{Fréquence } f} \\times \\underbrace{\\mathbb{E}[X]}_{\\text{Coût moyen } CM}$$

2. **Estimateurs Empiriques Sans Biais sur le Portefeuille :**
   En notant $N_{\\text{tot}} = \\sum_{i=1}^M N_i$ et $S_{\\text{tot}} = \\sum_{i=1}^M S_i$ :
   $$\\hat{f} = \\frac{N_{\\text{tot}}}{M}, \\qquad \\widehat{CM} = \\frac{S_{\\text{tot}}}{N_{\\text{tot}}} \\quad (N_{\\text{tot}} > 0), \\qquad \\widehat{PP} = \\hat{f} \\times \\widehat{CM} = \\frac{S_{\\text{tot}}}{M}$$

3. **Ratio Sinistres sur Primes ($S/P$) :**
   $$S/P = \\frac{\\sum_{i=1}^M S_i}{\\sum_{i=1}^M P_i} = \\frac{\\widehat{PP}}{\\bar{P}}$$
   Dans une région $g$ sans aucun sinistre ($N_g = 0$), le coût moyen conditionnel n'est pas défini numériquement ($0/0$) : on applique une convention sécurisée ($CM_g = 0$) pour éviter la propagation de \`NaN\` ou \`inf\` dans les tableaux de bord.

### 💻 Masterclass Python & Ingénierie Pandas

* **Architecture Anti-Fan-Out (\`groupby\` avant \`merge\`) :** On agrège d'abord \`df_sinistres\` au grain exact \`police_id\` avec \`.groupby('police_id', as_index=False).agg(...)\` afin de garantir l'unicité de la clé de jointure à droite.
* **Imputation sémantique des \`NaN\` :** En actuariat, un \`NaN\` issu d'un \`LEFT JOIN\` sur une table de sinistres signifie **zéro sinistre** ($0.0$), jamais une donnée manquante à supprimer ! De même, \`cout_corporel\` vaut \`NaN\` lorsqu'un accident est purement matériel.
* **Non-mutation des sources :** Travailler sur \`sin_df.copy()\` préserve l'intégrité du DataFrame global \`df_sinistres\` entre plusieurs exécutions.
* **Division sécurisée \`np.where\` :** \`np.where(cond, num / den, 0.0)\` évite les \`ZeroDivisionError\` ou \`NaN\` sur les régions à sinistralité nulle.

\`\`\`python
import pandas as pd

# Illustration directe du piège du fan-out sur df_assures (12 polices) et df_sinistres (8 dossiers)
merge_naif = pd.merge(df_assures, df_sinistres, on='police_id', how='left')

# Pipeline propre : pré-agrégation au grain police_id AVANT la jointure à gauche
sin_agg = df_sinistres.groupby('police_id', as_index=False).agg(
    nb_sin=('sinistre_id', 'count'),
    cout_sin=('cout_total', 'sum')
)
merge_propre = pd.merge(df_assures, sin_agg, on='police_id', how='left').fillna({'nb_sin': 0, 'cout_sin': 0.0})

print(f"Lignes merge naïf : {len(merge_naif)} | Primes gonflées : {merge_naif['prime_annuelle'].sum():,.2f} EUR")
print(f"Lignes merge propre : {len(merge_propre)} | Primes exactes : {merge_propre['prime_annuelle'].sum():,.2f} EUR")
print(f"Police 1003 (2 sinistres) -> nb_sin={int(merge_propre.loc[merge_propre['police_id']==1003, 'nb_sin'].iloc[0])}, cout={merge_propre.loc[merge_propre['police_id']==1003, 'cout_sin'].iloc[0]:,.2f} EUR")
print(f"NaN initiaux dans cout_corporel : {df_sinistres['cout_corporel'].isna().sum()} / {len(df_sinistres)}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Lignes merge naïf : 13 | Primes gonflées : 12,456.80 EUR
Lignes merge propre : 12 | Primes exactes : 11,306.80 EUR
Police 1003 (2 sinistres) -> nb_sin=2, cout=5,420.00 EUR
NaN initiaux dans cout_corporel : 6 / 8
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir des DataFrames préchargés \`df_assures\` (12 contrats) et \`df_sinistres\` (8 sinistres), implémentez un pipeline IARD complet respectant exactement les noms suivants :

1. **Fonction de pré-agrégation \`preparer_sinistres_par_police(sin_df)\`** :
   - Copie \`sin_df\`, impute les \`NaN\` de \`cout_corporel\` à \`0.0\`, puis agrège par \`police_id\` (\`as_index=False\`) avec les colonnes \`nb_sinistres\`, \`cout_total_sinistres\` et \`cout_corporel_total\`.
2. **Jointure à gauche & Imputation (\`df_portefeuille\`)** :
   - Fusionnez \`df_assures\` et le résultat de \`preparer_sinistres_par_police(df_sinistres)\` via \`pd.merge(..., on='police_id', how='left')\`.
   - Imputez les \`NaN\` des 3 colonnes agrégées à \`0.0\` et convertissez \`nb_sinistres\` en \`int\`.
3. **Indicateurs globaux du portefeuille** :
   - \`frequence_moyenne\` (float : total sinistres / nombre de polices)
   - \`cout_moyen_sinistre\` (float : coût total / total sinistres)
   - \`prime_pure_moyenne\` (float : \`frequence_moyenne * cout_moyen_sinistre\`)
   - \`sp_global\` (float : coût total sinistres / total des primes annuelles)
4. **Tableau régional \`sp_par_region\`** :
   - Agrégez \`df_portefeuille\` par \`region\` (\`as_index=False\`) avec \`nb_polices\`, \`nb_sinistres\`, \`primes_totales\`, \`sinistres_totaux\`.
   - Ajoutez \`frequence\`, \`cout_moyen\` (sécurisé à \`0.0\` si \`nb_sinistres == 0\` via \`np.where\`), \`prime_pure\` et \`ratio_sp\`, puis triez par \`ratio_sp\` décroissant (\`.reset_index(drop=True)\`).`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import pandas as pd

def preparer_sinistres_par_police(sin_df):
    """Pré-agrège la table sinistres au grain police_id pour éviter tout fan-out."""
    sin_clean = sin_df.copy()
    sin_clean['cout_corporel'] = sin_clean['cout_corporel'].fillna(0.0)
    return sin_clean.groupby('police_id', as_index=False).agg(
        nb_sinistres=('sinistre_id', 'count'),
        cout_total_sinistres=('cout_total', 'sum'),
        cout_corporel_total=('cout_corporel', 'sum'),
    )

sin_agg = preparer_sinistres_par_police(df_sinistres)

df_portefeuille = pd.merge(df_assures, sin_agg, on='police_id', how='left')
for col in ['nb_sinistres', 'cout_total_sinistres', 'cout_corporel_total']:
    df_portefeuille[col] = df_portefeuille[col].fillna(0.0)
df_portefeuille['nb_sinistres'] = df_portefeuille['nb_sinistres'].astype(int)

nb_polices = len(df_portefeuille)
total_sinistres = int(df_portefeuille['nb_sinistres'].sum())
total_cout = float(df_portefeuille['cout_total_sinistres'].sum())
total_primes = float(df_portefeuille['prime_annuelle'].sum())

frequence_moyenne = float(total_sinistres / nb_polices)
cout_moyen_sinistre = float(total_cout / total_sinistres)
prime_pure_moyenne = float(frequence_moyenne * cout_moyen_sinistre)
sp_global = float(total_cout / total_primes)

sp_par_region = df_portefeuille.groupby('region', as_index=False).agg(
    nb_polices=('police_id', 'count'),
    nb_sinistres=('nb_sinistres', 'sum'),
    primes_totales=('prime_annuelle', 'sum'),
    sinistres_totaux=('cout_total_sinistres', 'sum'),
)
sp_par_region['frequence'] = sp_par_region['nb_sinistres'] / sp_par_region['nb_polices']
sp_par_region['cout_moyen'] = np.where(
    sp_par_region['nb_sinistres'] > 0,
    sp_par_region['sinistres_totaux'] / sp_par_region['nb_sinistres'],
    0.0,
)
sp_par_region['prime_pure'] = sp_par_region['sinistres_totaux'] / sp_par_region['nb_polices']
sp_par_region['ratio_sp'] = sp_par_region['sinistres_totaux'] / sp_par_region['primes_totales']
sp_par_region = sp_par_region.sort_values('ratio_sp', ascending=False).reset_index(drop=True)

print(f"Polices : {nb_polices} | Sinistres : {total_sinistres} | Primes : {total_primes:,.2f} EUR | Charge : {total_cout:,.2f} EUR")
print(f"Fréquence : {frequence_moyenne:.4f} | Coût moyen : {cout_moyen_sinistre:,.2f} EUR | Prime pure : {prime_pure_moyenne:,.2f} EUR")
print(f"Ratio S/P global : {sp_global:.2%}")
print()
print("--- Tableau S/P par région ---")
print(sp_par_region[['region', 'nb_polices', 'nb_sinistres', 'prime_pure', 'ratio_sp']].to_string(index=False))`,
      testPythonCode: `assert 'preparer_sinistres_par_police' in globals() and callable(preparer_sinistres_par_police)
assert len(df_portefeuille) == 12
assert df_portefeuille['nb_sinistres'].isna().sum() == 0
assert df_portefeuille['cout_total_sinistres'].sum() == 48950.0
assert np.isclose(frequence_moyenne, 8.0 / 12.0, atol=1e-6)
assert np.isclose(cout_moyen_sinistre, 6118.75, atol=1e-4)
assert np.isclose(prime_pure_moyenne, 48950.0 / 12.0, atol=1e-4)
assert np.isclose(sp_global, 48950.0 / 11306.80, atol=1e-6)
assert len(sp_par_region) == 9
assert sp_par_region.loc[0, 'region'] == 'Grand Est'
assert np.isclose(sp_par_region.loc[0, 'ratio_sp'], 9400.0 / 890.30, atol=1e-5)`,
      datasets: [],
      hints: [
        "Pré-agrège d'abord df_sinistres avec sin_clean.groupby('police_id', as_index=False).agg(nb_sinistres=('sinistre_id', 'count'), cout_total_sinistres=('cout_total', 'sum'), cout_corporel_total=('cout_corporel', 'sum')).",
        "Fusionne ensuite avec pd.merge(df_assures, sin_agg, on='police_id', how='left'), puis impute les NaN à 0.0.",
        "Dans sp_par_region, utilise np.where(sp_par_region['nb_sinistres'] > 0, sp_par_region['sinistres_totaux'] / sp_par_region['nb_sinistres'], 0.0) pour éviter toute division par zéro."
      ],
      guide: {
        theoryToPracticeLink:
          "La formule actuarielle $PP = \\mathbb{E}[N] \\times \\mathbb{E}[X]$ exige d'observer l'ensemble des $M=12$ contrats exposés au risque (y compris les $5$ contrats sans sinistre dont $N_i = 0, S_i = 0$). Pré-agréger \`df_sinistres\` par \`police_id\` garantit l'absence de duplication lors du \`pd.merge(..., how='left')\` et assure l'exactitude de la masse de primes ($11\\,306.80\\text{ EUR}$) au dénominateur de \`sp_global\`.",
        stepByStepPlan: [
          "Définir `preparer_sinistres_par_police(sin_df)` : copier `sin_df`, remplacer les `NaN` de `cout_corporel` par `0.0`, et grouper par `police_id`.",
          "Exécuter la jointure à gauche `pd.merge(df_assures, sin_agg, on='police_id', how='left')` dans `df_portefeuille` et imputer les `NaN` à `0.0`.",
          "Calculer les 4 KPIs scalaires globaux : `frequence_moyenne`, `cout_moyen_sinistre`, `prime_pure_moyenne` et `sp_global`.",
          "Construire `sp_par_region` via `.groupby('region', as_index=False).agg(...)`, calculer fréquence, coût moyen sécurisé par `np.where`, prime pure et `ratio_sp`, puis trier par `ratio_sp` décroissant."
        ],
        concepts: [
          {
            symbol: "df_assures / df_sinistres",
            kind: "Colonne / Table",
            roleInExercise: "DataFrames préchargés en mémoire Pyodide contenant respectivement les $12$ contrats d'assurance auto et les $8$ sinistres déclarés."
          },
          {
            symbol: "preparer_sinistres_par_police(sin_df)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction réutilisable qui nettoie \`cout_corporel\` et réduit \`df_sinistres\` au grain unique \`police_id\` avant la jointure."
          },
          {
            symbol: ".groupby('police_id', as_index=False).agg(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Agrégation nommée Pandas évitant que la clé \`police_id\` ne passe en index et produisant directement des colonnes propres."
          },
          {
            symbol: "pd.merge(..., how='left')",
            kind: "Fonction / Méthode",
            roleInExercise: "Jointure relationnelle à gauche conservant toutes les polices de \`df_assures\`, même celles sans sinistre ($N_i = 0$)."
          },
          {
            symbol: ".fillna(0.0)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit les valeurs manquantes \`NaN\` (absence de dommage corporel ou de sinistre déclaré) en zéros arithmétiques."
          },
          {
            symbol: "np.where(cond, x, y)",
            kind: "Fonction / Méthode",
            roleInExercise: "Opérateur ternaire vectorisé NumPy renvoyant \`x\` si \`cond\` est vrai et \`0.0\` sinon, protégeant \`cout_moyen\` sur les régions sans sinistre."
          },
          {
            symbol: "sp_global / sp_par_region",
            kind: "Variable",
            roleInExercise: "Variables finales vérifiées par les tests : flottant du ratio $S/P$ global ($432.93\\%$) et DataFrame régional trié de $9$ lignes."
          }
        ],
        guidedCode: `import numpy as np
import pandas as pd

# Étape 1 : Fonction de pré-agrégation anti-fan-out sur df_sinistres
def preparer_sinistres_par_police(sin_df):
    """Pré-agrège la table sinistres au grain police_id pour éviter tout fan-out."""
    sin_clean = sin_df.copy()
    sin_clean['cout_corporel'] = sin_clean['cout_corporel'].fillna(0.0)
    return sin_clean.groupby('police_id', as_index=False).agg(
        nb_sinistres=('sinistre_id', 'count'),
        cout_total_sinistres=(___, 'sum'),
        cout_corporel_total=('cout_corporel', 'sum'),
    )

sin_agg = preparer_sinistres_par_police(df_sinistres)

# Étape 2 : Jointure à gauche avec df_assures et imputation des NaN à 0.0
df_portefeuille = pd.merge(df_assures, sin_agg, on='police_id', how=___)
for col in ['nb_sinistres', 'cout_total_sinistres', 'cout_corporel_total']:
    df_portefeuille[col] = df_portefeuille[col].fillna(0.0)
df_portefeuille['nb_sinistres'] = df_portefeuille['nb_sinistres'].astype(int)

# Étape 3 : KPIs actuariels globaux
nb_polices = len(df_portefeuille)
total_sinistres = int(df_portefeuille['nb_sinistres'].sum())
total_cout = float(df_portefeuille['cout_total_sinistres'].sum())
total_primes = float(df_portefeuille['prime_annuelle'].sum())

frequence_moyenne = float(___)
cout_moyen_sinistre = float(___)
prime_pure_moyenne = float(___)
sp_global = float(___)

# Étape 4 : Tableau de bord S/P par région
sp_par_region = df_portefeuille.groupby('region', as_index=False).agg(
    nb_polices=('police_id', 'count'),
    nb_sinistres=('nb_sinistres', 'sum'),
    primes_totales=('prime_annuelle', 'sum'),
    sinistres_totaux=('cout_total_sinistres', 'sum'),
)
sp_par_region['frequence'] = sp_par_region['nb_sinistres'] / sp_par_region['nb_polices']
sp_par_region['cout_moyen'] = np.where(
    sp_par_region['nb_sinistres'] > 0,
    ___,
    0.0,
)
sp_par_region['prime_pure'] = sp_par_region['sinistres_totaux'] / sp_par_region['nb_polices']
sp_par_region['ratio_sp'] = ___
sp_par_region = sp_par_region.sort_values('ratio_sp', ascending=False).reset_index(drop=True)

print(f"Ratio S/P global : {sp_global:.2%} | Prime pure moyenne : {prime_pure_moyenne:,.2f} EUR")
print(sp_par_region[['region', 'nb_polices', 'nb_sinistres', 'ratio_sp']].to_string(index=False))`
      }
    },

    // =========================================================================
    // CAS 2 : MODÉLISATION TARIFAIRE & ÉCARTS PRIMES COMMERCIALES VS TECHNIQUES
    // =========================================================================
    {
      id: "v3-py-2",
      title: "2. Modélisation Tarifaire & Écarts Primes Commerciales vs Techniques",
      category: "pricing",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 30,
      description:
        "Estimez un modèle tarifaire linéaire par OLS sur df_assures avec variable indicatrice Tous Risques, codez un moteur de devis evaluer_tarif et détectez les polices les plus sous-tarifées.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Tarification A Priori, Variables Indicatrices & Anti-Sélection

#### Intuition Économique & Enjeux Commerciaux
En assurance auto, le tarif facturé au client (la **prime commerciale** $P_i$) s'écarte souvent de la **prime technique modélisée** $\\hat{P}_i$ à la suite de remises commerciales, d'écrêtements ou de grilles tarifaires obsolètes. Or, selon le mécanisme d'**anti-sélection** (Akerlof / Rothschild-Stiglitz), les assurés largement **sous-tarifés** ($P_i - \\hat{P}_i \\ll 0$) restent fidèles à la compagnie et consomment du capital, tandis que les assurés **sur-tarifés** ($P_i - \\hat{P}_i \\gg 0$) résilient vers la concurrence !

Auditer les résidus du modèle de tarification permet donc à la direction technique d'identifier précisément les contrats à revaloriser au renouvellement.

#### Démonstration Mathématique Formelle
Considérons le modèle linéaire multivarié expliquant la prime annuelle $y_i = \\text{prime\\_annuelle}_i$ à partir de $p=4$ variables de risque observées à la souscription (âge, coefficient bonus-malus, puissance fiscale et variable indicatrice $D_i = \\mathbb{1}_{\\{\\text{type\\_contrat}_i = \\text{Tous Risques}\\}} \\in \\{0, 1\\}$) :
$$y_i = \\beta_0 + \\beta_1 \\text{age}_i + \\beta_2 \\text{crm}_i + \\beta_3 \\text{cv}_i + \\beta_4 D_i + \\varepsilon_i$$

1. **Estimateur MCO (Moindres Carrés Ordinaires) :**
   Sous la matrice de design $X \\in \\mathbb{R}^{n \\times 5}$ contenant la colonne constante $\\mathbf{1}_n$ et les $4$ facteurs, le vecteur $\\hat{\\boldsymbol{\\beta}} = (X'X)^{-1} X' \\mathbf{y}$ annule le gradient de la somme des carrés des résidus $\\|\\mathbf{y} - X\\boldsymbol{\\beta}\\|_2^2$.

2. **Propriété d'Équilibre Tarifaire Global (Orthogonalité) :**
   La première condition normale ($\\mathbf{1}_n' (\\mathbf{y} - X\\hat{\\boldsymbol{\\beta}}) = 0$) garantit que la somme des écarts commerciaux est **rigoureusement nulle** :
   $$\\sum_{i=1}^n e_i = \\sum_{i=1}^n \\left(P_i - \\hat{P}_i\\right) = 0 \\iff \\frac{1}{n} \\sum_{i=1}^n \\hat{P}_i = \\frac{1}{n} \\sum_{i=1}^n P_i$$
   Le modèle reproduit exactement la masse globale de primes, tout en révélant les subventions croisées individuelles via le signe et l'amplitude de chaque résidu $e_i$.

3. **Interprétation des coefficients :**
   $\\hat{\\beta}_3$ chiffre le surcoût marginal par cheval fiscal supplémentaire (*toutes choses égales par ailleurs*), et $\\hat{\\beta}_4$ mesure le saut de prime lié à la formule Tous Risques par rapport aux formules Tiers.

### 💻 Masterclass Python & Ingénierie Statsmodels

* **Encodage binaire (\`dummy variable\`) :** L'expression \`(df_tarif['type_contrat'] == 'Tous Risques').astype(int)\` convertit une série booléenne \`True/False\` en entiers \`1/0\` exploitables par l'algèbre matricielle de \`statsmodels\`.
* **Constante explicite \`sm.add_constant\` :** Contrairement aux formules \`R\` ou \`patsy\`, \`sm.OLS(y, X)\` n'ajoute **pas** d'ordonnée à l'origine automatiquement : oublier \`sm.add_constant(X)\` force la droite de régression à passer par zéro et biaise tous les coefficients ainsi que $\\sum e_i = 0$ !
* **Séparation Estimation / Inférence (\`def evaluer_tarif\`) :** En production, on découple l'ajustement du modèle (\`.fit()\`) de la fonction de devis appelée en temps réel sur un nouveau prospect en lui passant \`modele_tarif.params\`.

\`\`\`python
import statsmodels.api as sm

# Modèle tarifaire simplifié sur df_assures pour illustrer l'ajout de constante et l'analyse des résidus
df_ex2 = df_assures.copy()
df_ex2['est_sportive'] = (df_ex2['type_vehicule'] == 'Sportive').astype(int)

X_ex2 = sm.add_constant(df_ex2[['bonus_malus', 'puissance_fiscale', 'est_sportive']])
mod_ex2 = sm.OLS(df_ex2['prime_annuelle'], X_ex2).fit()

print(f"R2 modèle jouet : {mod_ex2.rsquared:.4f}")
print({k: round(float(v), 2) for k, v in mod_ex2.params.items()})
print(f"Écart max (+) : {mod_ex2.resid.max():+.2f} EUR | Écart min (-) : {mod_ex2.resid.min():+.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
R2 modèle jouet : 0.8924
{'const': -795.94, 'bonus_malus': 1155.51, 'puissance_fiscale': 141.06, 'est_sportive': 15.47}
Écart max (+) : +288.87 EUR | Écart min (-) : -171.57 EUR
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir du DataFrame préchargé \`df_assures\`, construisez et auditez le modèle de tarification linéaire complet :

1. **Copie & Variable indicatrice (\`df_tarif\`)** :
   - Copiez \`df_assures\` dans \`df_tarif\` et créez la colonne \`est_tous_risques = (df_tarif['type_contrat'] == 'Tous Risques').astype(int)\`.
2. **Estimation OLS (\`modele_tarif\`, \`r2_tarif\`)** :
   - Construisez \`X = sm.add_constant(df_tarif[['age', 'bonus_malus', 'puissance_fiscale', 'est_tous_risques']])\` et \`y = df_tarif['prime_annuelle']\`.
   - Estimez \`modele_tarif = sm.OLS(y, X).fit()\` et stockez \`r2_tarif = float(modele_tarif.rsquared)\`.
3. **Fonction de devis \`evaluer_tarif(age, bonus_malus, puissance, tous_risques, params)\`** :
   - Écrivez cette fonction pour qu'elle retourne en \`float\` la prime prédite par les paramètres OLS (\`params['const'] + params['age'] * age + ...\`).
4. **Détection des anomalies tarifaires (\`polices_sous_tarifees\`)** :
   - Ajoutez \`df_tarif['prime_modele'] = modele_tarif.predict(X)\` et \`df_tarif['ecart'] = df_tarif['prime_annuelle'] - df_tarif['prime_modele']\`.
   - Triez \`df_tarif\` par \`ecart\` **croissant** (\`ascending=True\`, \`.reset_index(drop=True)\`) dans \`polices_sous_tarifees\` pour isoler en tête les contrats les plus sous-tarifés.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import pandas as pd
import statsmodels.api as sm

def evaluer_tarif(age, bonus_malus, puissance, tous_risques, params):
    """Calcule la prime théorique linéaire à partir des paramètres OLS estimés."""
    return float(
        params['const']
        + params['age'] * age
        + params['bonus_malus'] * bonus_malus
        + params['puissance_fiscale'] * puissance
        + params['est_tous_risques'] * tous_risques
    )

df_tarif = df_assures.copy()
df_tarif['est_tous_risques'] = (df_tarif['type_contrat'] == 'Tous Risques').astype(int)

colonnes_x = ['age', 'bonus_malus', 'puissance_fiscale', 'est_tous_risques']
X = sm.add_constant(df_tarif[colonnes_x])
y = df_tarif['prime_annuelle']

modele_tarif = sm.OLS(y, X).fit()
r2_tarif = float(modele_tarif.rsquared)

df_tarif['prime_modele'] = modele_tarif.predict(X)
df_tarif['ecart'] = df_tarif['prime_annuelle'] - df_tarif['prime_modele']

polices_sous_tarifees = df_tarif.sort_values('ecart', ascending=True).reset_index(drop=True)

profil_test = evaluer_tarif(30, 0.85, 6, 1, modele_tarif.params)
print(f"R² du modèle tarifaire : {r2_tarif:.4f}")
print("Coefficients estimés :")
print(modele_tarif.params.round(2))
print()
print(f"Prime technique profil test (30 ans, CRM 0.85, 6 CV, Tous Risques) : {profil_test:.2f} EUR")
print()
print("Top 3 polices les plus sous-tarifées (écart négatif) :")
print(polices_sous_tarifees[['police_id', 'assure_id', 'prime_annuelle', 'prime_modele', 'ecart']].head(3).to_string(index=False))`,
      testPythonCode: `assert 'evaluer_tarif' in globals() and callable(evaluer_tarif)
assert np.isclose(r2_tarif, 0.9239, atol=1e-3)
assert 'prime_modele' in df_tarif.columns and 'ecart' in df_tarif.columns
assert np.isclose(df_tarif['ecart'].sum(), 0.0, atol=1e-6)
assert int(polices_sous_tarifees.loc[0, 'police_id']) == 1012
assert polices_sous_tarifees.loc[0, 'ecart'] < -150.0
p0 = df_tarif.iloc[0]
pred0 = evaluer_tarif(p0['age'], p0['bonus_malus'], p0['puissance_fiscale'], p0['est_tous_risques'], modele_tarif.params)
assert np.isclose(pred0, p0['prime_modele'], atol=1e-6)`,
      datasets: [],
      hints: [
        "Créez l'indicatrice avec (df_tarif['type_contrat'] == 'Tous Risques').astype(int) et n'oubliez pas sm.add_constant(df_tarif[colonnes_x]).",
        "Dans evaluer_tarif(..., params), multipliez chaque caractéristique par la clé correspondante dans params ('const', 'age', 'bonus_malus', 'puissance_fiscale', 'est_tous_risques').",
        "Les polices sous-tarifées ont un écart = prime_annuelle - prime_modele très négatif : utilisez .sort_values('ecart', ascending=True)."
      ],
      guide: {
        theoryToPracticeLink:
          "L'estimation MCO $\\hat{\\boldsymbol{\\beta}} = (X'X)^{-1}X'\\mathbf{y}$ s'implémente via \`sm.OLS(y, X).fit()\` après ajout de l'ordonnée à l'origine \`sm.add_constant\`. La fonction \`evaluer_tarif\` applique directement le produit scalaire $\\mathbf{x}'\\hat{\\boldsymbol{\\beta}}$, tandis que le tri croissant des résidus \`ecart = prime_annuelle - prime_modele\` révèle en premier la police \`1012\` sous-tarifée de $-158.37\\text{ EUR}$.",
        stepByStepPlan: [
          "Implémenter la fonction `evaluer_tarif(age, bonus_malus, puissance, tous_risques, params)` retournant la combinaison linéaire en `float`.",
          "Copier `df_assures` dans `df_tarif` et créer la variable indicatrice `est_tous_risques`.",
          "Construire la matrice `X` avec `sm.add_constant(...)` et estimer `modele_tarif = sm.OLS(y, X).fit()`, puis extraire `r2_tarif`.",
          "Calculer `prime_modele` via `.predict(X)` et `ecart = prime_annuelle - prime_modele`.",
          "Trier `df_tarif` par `ecart` croissant dans `polices_sous_tarifees` et vérifier une prédiction avec `evaluer_tarif`."
        ],
        concepts: [
          {
            symbol: "df_assures",
            kind: "Colonne / Table",
            roleInExercise: "Table préchargée des $12$ assurés contenant les variables explicatives (\`age\`, \`bonus_malus\`, \`puissance_fiscale\`, \`type_contrat\`) et la cible \`prime_annuelle\`."
          },
          {
            symbol: "est_tous_risques",
            kind: "Colonne / Table",
            roleInExercise: "Variable binaire \`0/1\` créée par \`.astype(int)\` mesurant l'effet marginal de la couverture Tous Risques."
          },
          {
            symbol: "sm.add_constant(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Ajoute une colonne \`const\` égale à $1$ indispensable pour estimer l'ordonnée à l'origine $\\beta_0$ et assurer $\\sum e_i = 0$."
          },
          {
            symbol: "sm.OLS(y, X).fit()",
            kind: "Fonction / Méthode",
            roleInExercise: "Ajuste la régression linéaire par moindres carrés ordinaires et retourne l'objet résultat contenant \`.params\`, \`.rsquared\` et \`.predict()\`."
          },
          {
            symbol: "evaluer_tarif(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Moteur de tarification encapsulant la formule linéaire pour scorer n'importe quel prospect à partir de \`params\`."
          },
          {
            symbol: "modele_tarif.params",
            kind: "Paramètre",
            roleInExercise: "Série Pandas indexée par le nom des variables (\`'const'\`, \`'age'\`, etc.) stockant les coefficients estimés $\\hat{\\beta}_j$."
          },
          {
            symbol: "polices_sous_tarifees",
            kind: "Variable",
            roleInExercise: "DataFrame trié par \`ecart\` croissant ; sa ligne \`0\` désigne le contrat le plus déficitaire (\`police_id = 1012\`)."
          }
        ],
        guidedCode: `import numpy as np
import pandas as pd
import statsmodels.api as sm

# Étape 1 : Fonction métier de devis à partir des paramètres estimés
def evaluer_tarif(age, bonus_malus, puissance, tous_risques, params):
    """Calcule la prime théorique linéaire à partir des paramètres OLS estimés."""
    return float(
        params['const']
        + params['age'] * age
        + params['bonus_malus'] * ___
        + params['puissance_fiscale'] * ___
        + params['est_tous_risques'] * ___
    )

# Étape 2 : Préparation de la copie et encodage de la variable indicatrice
df_tarif = df_assures.copy()
df_tarif['est_tous_risques'] = (df_tarif['type_contrat'] == 'Tous Risques').astype(int)

# Étape 3 : Matrice X avec constante et estimation OLS
colonnes_x = ['age', 'bonus_malus', 'puissance_fiscale', 'est_tous_risques']
X = sm.add_constant(df_tarif[colonnes_x])
y = df_tarif['prime_annuelle']

modele_tarif = sm.OLS(y, X).fit()
r2_tarif = float(modele_tarif.rsquared)

# Étape 4 : Prédictions, écarts commerciaux et tri des polices sous-tarifées
df_tarif['prime_modele'] = modele_tarif.predict(___)
df_tarif['ecart'] = df_tarif['prime_annuelle'] - ___

polices_sous_tarifees = df_tarif.sort_values('ecart', ascending=___).reset_index(drop=True)

print(f"R² du modèle tarifaire : {r2_tarif:.4f}")
print(polices_sous_tarifees[['police_id', 'assure_id', 'prime_annuelle', 'prime_modele', 'ecart']].head(4).to_string(index=False))`
      }
    },

    // =========================================================================
    // CAS 3 : MOTEUR D'IMMUNISATION OBLIGATAIRE (DURATION, CONVEXITÉ, +300 BPS)
    // =========================================================================
    {
      id: "v3-py-3",
      title: "3. Moteur d'Immunisation Obligataire : Duration, Convexité & Stress +300 bps",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 25,
      description:
        "Programmez une librairie de valorisation obligataire (prix exact, duration de Macaulay, duration modifiée, convexité) et quantifiez l'erreur d'ordre 1 vs ordre 2 sur un portefeuille de 50 M EUR face à un choc de +300 bps.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Développement de Taylor Obligataire & Immunisation ALM

#### Intuition Économique & Choc Historique de Taux
Entre 2021 et 2023, la courbe des taux européens a subi un relèvement brutal de plus de $+300\\text{ bps}$ ($+3\\%$). Pour une banque ou un assureur vie détenant un portefeuille d'obligations souveraines de valeur $V_0 = 50\\,000\\,000\\text{ EUR}$, mesurer la perte latente uniquement avec la **duration modifiée** (approximation linéaire tangente) surestime la baisse de valeur lors d'une hausse de taux et sous-estime le gain lors d'une baisse de taux ! C'est la **convexité positive** ($\\mathcal{C} > 0$) des obligations classiques sans option qui amortit les chocs sévères.

En gestion Actif-Passif (ALM), le théorème d'immunisation de **Redington (1952)** impose trois conditions face aux mouvements parallèles de taux : égalité des valeurs ($V_A = V_L$), égalité des durations modifiées ($D_A^* = D_L^*$), et **convexité de l'actif supérieure à celle du passif** ($\\mathcal{C}_A > \\mathcal{C}_L$).

#### Démonstration Mathématique Formelle
Soit une obligation versant des flux annuels certains $CF_t$ aux échéances $t \\in \\{1, \\dots, T\\}$ valorisée au taux actuariel annuel $y$ :
$$P(y) = \\sum_{t=1}^T CF_t (1 + y)^{-t}$$

1. **Dérivée première & Durations :**
   $$\\frac{dP}{dy} = -\\sum_{t=1}^T t \\cdot CF_t (1 + y)^{-t-1} = -\\frac{1}{1+y} \\sum_{t=1}^T t \\cdot \\frac{CF_t}{(1+y)^t}$$
   En définissant la **Duration de Macaulay** (barycentre temporel des flux actualisés) $D_{\\text{Mac}} = \\frac{1}{P(y)} \\sum_{t=1}^T t \\cdot \\frac{CF_t}{(1+y)^t}$ et la **Duration Modifiée** $D^* = \\frac{D_{\\text{Mac}}}{1+y}$, on obtient :
   $$\\frac{1}{P(y)} \\frac{dP}{dy} = -D^*$$

2. **Dérivée seconde & Convexité :**
   En dérivant une seconde fois par rapport à $y$ :
   $$\\frac{d^2P}{dy^2} = \\sum_{t=1}^T t(t + 1) \\cdot CF_t (1 + y)^{-t-2} > 0 \\implies \\mathcal{C} = \\frac{1}{P(y)} \\frac{d^2P}{dy^2} = \\frac{1}{P(y)(1+y)^2} \\sum_{t=1}^T t(t + 1) \\frac{CF_t}{(1+y)^t}$$

3. **Approximation de Taylor à l'Ordre 2 pour un Portefeuille $V_0$ :**
   $$\\frac{\\Delta V}{V_0} = \\frac{P(y_0 + \\Delta y) - P(y_0)}{P(y_0)} \\approx \\underbrace{-D^* \\Delta y}_{\\text{Ordre 1 (tangente)}} + \\underbrace{\\frac{1}{2} \\mathcal{C} (\\Delta y)^2}_{\\text{Terme convexe } > 0}$$

### 💻 Masterclass Python & Ingénierie NumPy

* **Vectorisation temporelle sans boucle :** \`np.arange(1, len(cf) + 1, dtype=float)\` génère le vecteur $[1, 2, \\dots, T]$ en une instruction ; l'actualisation \`cf / ((1.0 + taux) ** t)\` s'exécute en C sans boucle \`for\`.
* **Tuple Unpacking propre :** \`metriques_taux(flux, taux)\` retourne un quadruplet \`(prix, mac_dur, mod_dur, convexite)\` directement déballable en une ligne.
* **Tracé multi-courbes Matplotlib :** Visualiser la courbe exacte face à la tangente (Ordre 1) et la parabole (Ordre 2) rend tangible l'écart de $-538\\,810\\text{ EUR}$ à $+300\\text{ bps}$.

\`\`\`python
import numpy as np

# Exemple jouet : obligation 3 ans, coupon 5%, taux initial 4%, choc +200 bps
cf3 = np.array([5.0, 5.0, 105.0])
t3 = np.arange(1, 4, dtype=float)
y0_3, dy_3 = 0.04, 0.02

pv3 = cf3 / ((1.0 + y0_3) ** t3)
P3 = float(np.sum(pv3))
dmac3 = float(np.sum(t3 * pv3) / P3)
dmod3 = dmac3 / (1.0 + y0_3)
conv3 = float(np.sum(t3 * (t3 + 1.0) * pv3) / (P3 * (1.0 + y0_3) ** 2))

P3_choc = float(np.sum(cf3 / ((1.0 + y0_3 + dy_3) ** t3)))
rel_exact = (P3_choc - P3) / P3
rel_ord1 = -dmod3 * dy_3
rel_ord2 = -dmod3 * dy_3 + 0.5 * conv3 * (dy_3 ** 2)

print(f"P(4%)={P3:.4f} EUR | D_Mac={dmac3:.4f} | D*={dmod3:.4f} | C={conv3:.4f}")
print(f"Choc +200 bps : Exact={rel_exact:.4%} | Ordre1={rel_ord1:.4%} | Ordre2={rel_ord2:.4%}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
P(4%)=102.7751 EUR | D_Mac=2.8615 | D*=2.7514 | C=10.4127
Choc +200 bps : Exact=-5.3010% | Ordre1=-5.5028% | Ordre2=-5.2946%
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

Construisez le moteur obligataire et évaluez un choc parallèle de $+300\\text{ bps}$ sur un portefeuille de $V_0 = 50\\,000\\,000\\text{ EUR}$ investi dans une obligation de maturité $5$ ans à coupon annuel $4\\%$ et nominal $100\\text{ EUR}$ (\`flux = [4.0, 4.0, 4.0, 4.0, 104.0]\`, taux initial \`taux_init = 0.03\`, choc \`dy = 0.03\`) :

1. **Fonction \`prix_obligation(flux, taux)\`** : retourne en \`float\` la somme actualisée $\\sum_{t=1}^T \\frac{CF_t}{(1+\\text{taux})^t}$.
2. **Fonction \`metriques_taux(flux, taux)\`** : retourne le tuple \`(prix, mac_dur, mod_dur, convexite)\` de 4 flottants selon les formules à capitalisation annuelle discrète.
3. **Calcul des 3 scénarios sur \`V0 = 50_000_000.0\` et \`dy = 0.03\`** :
   - \`prix_init, mac_dur, mod_dur, convexite = metriques_taux(flux, taux_init)\`
   - \`prix_choc = prix_obligation(flux, taux_init + dy)\`
   - \`delta_v_exact = float(V0 * (prix_choc / prix_init - 1.0))\`
   - \`delta_v_dur = float(V0 * (-mod_dur * dy))\` (Ordre 1)
   - \`delta_v_dur_conv = float(V0 * (-mod_dur * dy + 0.5 * convexite * (dy ** 2)))\` (Ordre 2)
4. **Graphique Matplotlib** : tracez la variation de valeur exacte vs Ordre 1 et Ordre 2 sur une grille de taux allant de $0.5\\%$ à $8\\%$.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def prix_obligation(flux, taux):
    """Actualise une séquence annuelle de flux CF_t (t=1..T) au taux actuariel y."""
    cf = np.asarray(flux, dtype=float)
    t = np.arange(1, len(cf) + 1, dtype=float)
    return float(np.sum(cf / ((1.0 + taux) ** t)))

def metriques_taux(flux, taux):
    """Retourne (prix, duration_macaulay, duration_modifiee, convexite) d'une obligation."""
    cf = np.asarray(flux, dtype=float)
    t = np.arange(1, len(cf) + 1, dtype=float)
    pv = cf / ((1.0 + taux) ** t)
    prix = float(np.sum(pv))
    mac_dur = float(np.sum(t * pv) / prix)
    mod_dur = float(mac_dur / (1.0 + taux))
    convexite = float(np.sum(t * (t + 1.0) * pv) / (prix * ((1.0 + taux) ** 2)))
    return prix, mac_dur, mod_dur, convexite

flux = [4.0, 4.0, 4.0, 4.0, 104.0]
taux_init = 0.03
V0 = 50_000_000.0
dy = 0.03

prix_init, mac_dur, mod_dur, convexite = metriques_taux(flux, taux_init)
prix_choc = prix_obligation(flux, taux_init + dy)

delta_v_exact = float(V0 * (prix_choc / prix_init - 1.0))
delta_v_dur = float(V0 * (-mod_dur * dy))
delta_v_dur_conv = float(V0 * (-mod_dur * dy + 0.5 * convexite * (dy ** 2)))

grille_y = np.linspace(0.005, 0.08, 80)
grille_dy = grille_y - taux_init
val_exacte = np.array([V0 * (prix_obligation(flux, y) / prix_init - 1.0) for y in grille_y])
val_ord1 = V0 * (-mod_dur * grille_dy)
val_ord2 = V0 * (-mod_dur * grille_dy + 0.5 * convexite * (grille_dy ** 2))

plt.figure(figsize=(6.5, 3.8))
plt.plot(grille_y * 100, val_exacte / 1e6, color='#0f172a', lw=2.2, label='Revalorisation Exacte')
plt.plot(grille_y * 100, val_ord1 / 1e6, color='#e11d48', ls='--', lw=1.8, label='Ordre 1 (Duration)')
plt.plot(grille_y * 100, val_ord2 / 1e6, color='#0284c7', ls='-.', lw=1.8, label='Ordre 2 (Duration + Convexité)')
plt.axvline((taux_init + dy) * 100, color='#f59e0b', ls=':', lw=1.5, label='Choc +300 bps (6%)')
plt.axhline(0, color='#78716c', lw=0.8)
plt.xlabel('Taux actuariel (%)')
plt.ylabel('Variation de valeur (M EUR)')
plt.title('Immunisation ALM : Exact vs Taylor Ordre 1 & Ordre 2')
plt.legend(fontsize=8)
plt.grid(True, alpha=0.3)

print(f"Prix initial (y=3%) : {prix_init:.4f} EUR | Prix choc (y=6%) : {prix_choc:.4f} EUR")
print(f"Duration Macaulay : {mac_dur:.4f} ans | Duration Modifiée : {mod_dur:.4f} | Convexité : {convexite:.4f}")
print(f"Variation Exacte           : {delta_v_exact:,.2f} EUR")
print(f"Approximation Ordre 1 (D*) : {delta_v_dur:,.2f} EUR (erreur = {delta_v_dur - delta_v_exact:,.2f} EUR)")
print(f"Approximation Ordre 2 (C)  : {delta_v_dur_conv:,.2f} EUR (erreur = {delta_v_dur_conv - delta_v_exact:,.2f} EUR)")`,
      testPythonCode: `assert 'prix_obligation' in globals() and 'metriques_taux' in globals()
assert np.isclose(prix_init, 104.579707, atol=1e-4)
assert np.isclose(mac_dur, 4.6393, atol=1e-3)
assert np.isclose(mod_dur, 4.5042, atol=1e-3)
assert np.isclose(convexite, 25.5680, atol=1e-2)
assert np.isclose(delta_v_exact, -6217475.22, atol=5.0)
assert np.isclose(delta_v_dur, -6756285.63, atol=5.0)
assert np.isclose(delta_v_dur_conv, -6181005.56, atol=5.0)
assert abs(delta_v_dur_conv - delta_v_exact) < abs(delta_v_dur - delta_v_exact) * 0.1`,
      datasets: [],
      hints: [
        "Utilisez t = np.arange(1, len(cf) + 1, dtype=float) et pv = cf / ((1.0 + taux) ** t) dans les deux fonctions.",
        "Rappelez-vous que mod_dur = mac_dur / (1.0 + taux) et convexite = np.sum(t * (t + 1.0) * pv) / (prix * ((1.0 + taux) ** 2)).",
        "La variation relative exacte du portefeuille est (prix_choc / prix_init - 1.0) multipliée par V0."
      ],
      guide: {
        theoryToPracticeLink:
          "Les deux dérivées du prix $P(y) = \\sum_{t=1}^T CF_t(1+y)^{-t}$ deviennent deux sommes pondérées vectorisées sur \`pv = cf / ((1+taux)**t)\` : \`mac_dur\` utilise le poids $t$, et \`convexite\` utilise $t(t+1)/(1+y)^2$. Sur un choc de $+300\\text{ bps}$, la tangente (\`delta_v_dur = -6.76 M EUR\`) surestime la perte réelle (\`-6.22 M EUR\`) de plus de $538\\text{ k EUR}$, alors que l'ordre 2 (\`-6.18 M EUR\`) tombe à moins de $37\\text{ k EUR}$ de la valeur exacte.",
        stepByStepPlan: [
          "Écrire `prix_obligation(flux, taux)` en convertissant `flux` via `np.asarray(..., dtype=float)` et en actualisant avec `t = np.arange(1, len(cf) + 1)`.",
          "Écrire `metriques_taux(flux, taux)` retournant le tuple `(prix, mac_dur, mod_dur, convexite)`.",
          "Évaluer les métriques initiales à `taux_init = 0.03` puis le nouveau prix à `taux_init + 0.03`.",
          "Calculer `delta_v_exact`, `delta_v_dur` et `delta_v_dur_conv` sur `V0 = 50_000_000.0`.",
          "Tracer la comparaison exact vs Taylor Ordre 1 & Ordre 2 avec Matplotlib."
        ],
        concepts: [
          {
            symbol: "prix_obligation(flux, taux)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction réutilisable actualisant une séquence arbitraire de flux annuels au taux actuariel \`taux\`."
          },
          {
            symbol: "metriques_taux(flux, taux)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule en une seule passe \`prix\`, \`mac_dur\`, \`mod_dur\` et \`convexite\`."
          },
          {
            symbol: "np.arange(1, len(cf) + 1)",
            kind: "Fonction / Méthode",
            roleInExercise: "Génère le vecteur des maturités $[1, 2, 3, 4, 5]$ pour vectoriser l'actualisation et les moments temporels."
          },
          {
            symbol: "delta_v_exact",
            kind: "Variable",
            roleInExercise: "Perte exacte en euros obtenue par réévaluation complète à $6\\%$ ($-6\\,217\\,475.22\\text{ EUR}$)."
          },
          {
            symbol: "delta_v_dur / delta_v_dur_conv",
            kind: "Variable",
            roleInExercise: "Approximations de Taylor d'ordre 1 ($-D^*\\Delta y V_0$) et d'ordre 2 (intégrant $+\\frac{1}{2}\\mathcal{C}(\\Delta y)^2 V_0$)."
          },
          {
            symbol: "plt.plot(...) / plt.axvline(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonctions Matplotlib traçant les 3 courbes de sensibilité P&L et matérialisant le choc de $+300\\text{ bps}$."
          }
        ],
        guidedCode: `import numpy as np
import matplotlib.pyplot as plt

# Étape 1 : Fonction de pricing obligataire
def prix_obligation(flux, taux):
    """Actualise une séquence annuelle de flux CF_t (t=1..T) au taux actuariel y."""
    cf = np.asarray(flux, dtype=float)
    t = np.arange(1, len(cf) + 1, dtype=float)
    return float(np.sum(___))

# Étape 2 : Fonction retournant (prix, mac_dur, mod_dur, convexite)
def metriques_taux(flux, taux):
    """Retourne (prix, duration_macaulay, duration_modifiee, convexite) d'une obligation."""
    cf = np.asarray(flux, dtype=float)
    t = np.arange(1, len(cf) + 1, dtype=float)
    pv = cf / ((1.0 + taux) ** t)
    prix = float(np.sum(pv))
    mac_dur = float(np.sum(t * pv) / prix)
    mod_dur = float(___)
    convexite = float(___)
    return prix, mac_dur, mod_dur, convexite

# Étape 3 : Calculs de sensibilité sur V0 = 50 M EUR et dy = +300 bps
flux = [4.0, 4.0, 4.0, 4.0, 104.0]
taux_init = 0.03
V0 = 50_000_000.0
dy = 0.03

prix_init, mac_dur, mod_dur, convexite = metriques_taux(flux, taux_init)
prix_choc = prix_obligation(flux, taux_init + dy)

delta_v_exact = float(V0 * (___))
delta_v_dur = float(V0 * (___))
delta_v_dur_conv = float(V0 * (___))

# Étape 4 : Graphique comparatif Exact vs Ordre 1 & Ordre 2
grille_y = np.linspace(0.005, 0.08, 80)
grille_dy = grille_y - taux_init
val_exacte = np.array([V0 * (prix_obligation(flux, y) / prix_init - 1.0) for y in grille_y])
val_ord1 = V0 * (-mod_dur * grille_dy)
val_ord2 = V0 * (-mod_dur * grille_dy + 0.5 * convexite * (grille_dy ** 2))

plt.figure(figsize=(6.5, 3.8))
plt.plot(grille_y * 100, val_exacte / 1e6, color='#0f172a', lw=2.2, label='Revalorisation Exacte')
plt.plot(grille_y * 100, val_ord1 / 1e6, color='#e11d48', ls='--', lw=1.8, label='Ordre 1 (Duration)')
plt.plot(grille_y * 100, val_ord2 / 1e6, color='#0284c7', ls='-.', lw=1.8, label='Ordre 2 (Duration + Convexité)')
plt.axvline((taux_init + dy) * 100, color='#f59e0b', ls=':', lw=1.5, label='Choc +300 bps (6%)')
plt.xlabel('Taux actuariel (%)')
plt.ylabel('Variation de valeur (M EUR)')
plt.title('Immunisation ALM : Exact vs Taylor Ordre 1 & Ordre 2')
plt.legend(fontsize=8)
plt.grid(True, alpha=0.3)

print(f"Exact : {delta_v_exact:,.2f} EUR | Ordre 1 : {delta_v_dur:,.2f} EUR | Ordre 2 : {delta_v_dur_conv:,.2f} EUR")`
      }
    },

    // =========================================================================
    // CAS 4 : AUDIT ÉCONOMÉTRIQUE DE COMITÉ ALM (df)
    // =========================================================================
    {
      id: "v3-py-4",
      title: "4. Audit Économétrique de Comité ALM sur Série Macroéconomique (df)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 35,
      description:
        "Auditez un modèle explicatif des variations trimestrielles de l'OAT 10 ans (df) : stationnarité ADF avant/après différenciation, VIFs, Breusch-Pagan, Jarque-Bera et comparaison OLS vs HC3 vs HAC (Newey-West).",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Régression Fallacieuse, Robustesse Sandwich & Validation ALM

#### Intuition Économique & Exigences des Auditeurs Internes (ACPR / BCE)
En Comité ALM (*Asset-Liability Committee*), modéliser les taux souverains \`oat_10y\` en **niveau** en fonction de l'\`euribor_3m\` et de l'\`inflation_hicp\` produit souvent un $R^2 > 0.98$ spectaculaire... mais économétriquement faux ! Ce phénomène de **régression fallacieuse** (Granger & Newbold, 1974) survient dès que des séries non stationnaires $I(1)$ partagent une tendance commune, faisant chuter la statistique de Durbin-Watson bien en dessous de $2$ et invalidant tous les tests de Student.

La démarche d'audit rigoureuse impose :
1. Tester la racine unitaire par **Augmented Dickey-Fuller (ADF)** en niveau et passer en **différences premières** $\\Delta y_t = y_t - y_{t-1}$.
2. Contrôler l'absence de multicolinéarité excessive via les **VIF** (*Variance Inflation Factors*).
3. Vérifier l'homoscédasticité (**Breusch-Pagan**) et la normalité des résidus (**Jarque-Bera**).
4. Comparer les écarts-types naïfs OLS face aux estimateurs robustes à l'hétéroscédasticité (**White HC3**, recommandé sur petits échantillons $N < 50$) et à l'autocorrélation (**Newey-West HAC**).

#### Démonstration Mathématique Formelle
1. **Test ADF et puissance sur petit échantillon ($T=16$) :**
   Le test ADF estime $\\Delta z_t = \\alpha + \\gamma z_{t-1} + \\sum_{j=1}^p \\delta_j \\Delta z_{t-j} + \\varepsilon_t$ sous $H_0 : \\gamma = 0$ (racine unitaire). Sur $T = 16$ trimestres, fixer \`maxlag=1\` évite la sur-paramétrisation automatique du critère AIC (qui consommerait jusqu'à $6$ retards sur $16$ points) et permet de constater la non-stationnarité en niveau ($p > 0.20$ pour les $4$ séries).

2. **Facteur d'Inflation de la Variance (VIF) :**
   Pour chaque régresseur $X_j$ régressé sur les autres variables explicatives **et la constante** (coefficient $R_j^2$), la variance de $\\hat{\\beta}_j$ est amplifiée par :
   $$\\operatorname{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum_t (x_{tj} - \\bar{x}_j)^2} \\cdot \\underbrace{\\frac{1}{1 - R_j^2}}_{\\text{VIF}_j \\ge 1}$$

3. **Matrices Sandwich \`HC3\` et \`HAC\` :**
   Sous hétéroscédasticité/autocorrélation $\\operatorname{Var}(\\boldsymbol{\\varepsilon} \\mid X) = \\Omega$, l'estimateur MCO reste sans biais mais sa matrice de covariance devient $(X'X)^{-1} (X' \\Omega X) (X'X)^{-1}$. \`HC3\` pondère chaque résidu au carré par $(1 - h_{tt})^{-2}$ (où $h_{tt}$ est le levier), tandis que \`HAC\` (Newey-West, noyau de Bartlett de largeur \`maxlags=2\`) inclut les autocovariances $e_t e_{t-k}$ pondérées par $1 - \\frac{k}{L+1}$.

### 💻 Masterclass Python & Ingénierie Économétrique

* **Piège critique de \`variance_inflation_factor(X.values, idx)\` :** La fonction de \`statsmodels\` suppose impérativement que la matrice \`X\` contienne la colonne de \`1\` (\`'const'\`), sans quoi $R_j^2$ est calculé sans centrage et les VIF sont faux ! On exclut ensuite \`'const'\` uniquement lors du stockage final dans \`vifs_dict\`.
* **Construction d'un tableau de bord comparatif :** Regrouper \`.params\`, \`.bse\` et \`.pvalues\` des 3 modèles (\`mod_ols\`, \`mod_hc3\`, \`mod_hac\`) dans un \`pd.DataFrame\` permet de lire instantanément la sensibilité des p-valeurs au choix de covariance.

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

# Démonstration de la régression fallacieuse en niveau vs différences premières sur df
X_lvl = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
m_lvl = sm.OLS(df['oat_10y'], X_lvl).fit()

df_d = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()
X_d = sm.add_constant(df_d[['euribor_3m', 'inflation_hicp']])
m_d_ols = sm.OLS(df_d['oat_10y'], X_d).fit()
m_d_hac = sm.OLS(df_d['oat_10y'], X_d).fit(cov_type='HAC', cov_kwds={'maxlags': 2})

print(f"Niveaux (T=16) : R2={m_lvl.rsquared:.4f} | DW={durbin_watson(m_lvl.resid):.3f} (autocorrélation!)")
print(f"Diff 1re (T=15): R2={m_d_ols.rsquared:.4f} | DW={durbin_watson(m_d_ols.resid):.3f}")
print(f"SE(euribor_3m) -> OLS={m_d_ols.bse['euribor_3m']:.4f} vs HAC={m_d_hac.bse['euribor_3m']:.4f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Niveaux (T=16) : R2=0.9841 | DW=1.403 (autocorrélation!)
Diff 1re (T=15): R2=0.6302 | DW=1.962
SE(euribor_3m) -> OLS=0.1675 vs HAC=0.0903
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir du DataFrame macroéconomique préchargé \`df\` ($16$ trimestres de \`macro_taux\`), réalisez l'audit économétrique complet expliquant les variations trimestrielles \`oat_10y\` par celles de \`euribor_3m\`, \`inflation_hicp\` et \`spread_credit_bbb\` :

1. **Audit ADF (\`adf_audit\`)** :
   - Pour chaque colonne de \`['oat_10y', 'euribor_3m', 'inflation_hicp', 'spread_credit_bbb']\`, stockez dans \`adf_audit[col]\` le dictionnaire \`{'p_niveau': ..., 'p_diff': ...}\` via \`float(adfuller(..., maxlag=1)[1])\`.
2. **Modèles OLS, HC3 et HAC** :
   - Créez \`df_diff = df[cols_alm].diff().dropna()\`, \`X = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp', 'spread_credit_bbb']])\` et \`y = df_diff['oat_10y']\`.
   - Estimez \`mod_ols = sm.OLS(y, X).fit()\`, \`mod_hc3 = sm.OLS(y, X).fit(cov_type='HC3')\` et \`mod_hac = sm.OLS(y, X).fit(cov_type='HAC', cov_kwds={'maxlags': 2})\`.
3. **Diagnostics (\`vifs_dict\`, \`bp_pvalue\`, \`jb_pvalue\`)** :
   - Calculez \`vifs_dict\` pour les $3$ régresseurs (hors \`'const'\`) via \`variance_inflation_factor(X.values, idx)\`.
   - Calculez \`bp_pvalue = float(het_breuschpagan(mod_ols.resid, X)[1])\` et \`jb_pvalue = float(jarque_bera(mod_ols.resid)[1])\`.
4. **Tableau récapitulatif \`rapport_modeles\`** :
   - DataFrame indexé par les variables de \`X\` contenant les colonnes \`'coef'\`, \`'se_ols'\`, \`'se_hc3'\`, \`'se_hac'\`, \`'pval_ols'\`, \`'pval_hc3'\` et \`'pval_hac'\`.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy.stats import jarque_bera
from statsmodels.tsa.stattools import adfuller
from statsmodels.stats.diagnostic import het_breuschpagan
from statsmodels.stats.outliers_influence import variance_inflation_factor

cols_alm = ['oat_10y', 'euribor_3m', 'inflation_hicp', 'spread_credit_bbb']

adf_audit = {}
for col in cols_alm:
    p_niv = float(adfuller(df[col], maxlag=1)[1])
    p_dif = float(adfuller(df[col].diff().dropna(), maxlag=1)[1])
    adf_audit[col] = {'p_niveau': p_niv, 'p_diff': p_dif}

df_diff = df[cols_alm].diff().dropna()
exog_cols = ['euribor_3m', 'inflation_hicp', 'spread_credit_bbb']
X = sm.add_constant(df_diff[exog_cols])
y = df_diff['oat_10y']

mod_ols = sm.OLS(y, X).fit()
mod_hc3 = sm.OLS(y, X).fit(cov_type='HC3')
mod_hac = sm.OLS(y, X).fit(cov_type='HAC', cov_kwds={'maxlags': 2})

vifs_dict = {
    col: float(variance_inflation_factor(X.values, idx))
    for idx, col in enumerate(X.columns)
    if col != 'const'
}

bp_pvalue = float(het_breuschpagan(mod_ols.resid, X)[1])
_, jb_pvalue = jarque_bera(mod_ols.resid)
jb_pvalue = float(jb_pvalue)

rapport_modeles = pd.DataFrame({
    'coef': mod_ols.params,
    'se_ols': mod_ols.bse,
    'se_hc3': mod_hc3.bse,
    'se_hac': mod_hac.bse,
    'pval_ols': mod_ols.pvalues,
    'pval_hc3': mod_hc3.pvalues,
    'pval_hac': mod_hac.pvalues,
})

print("--- Audit Stationnarité ADF (maxlag=1) ---")
for c, res in adf_audit.items():
    print(f"{c:18s} | p_niveau = {res['p_niveau']:.4f} | p_diff = {res['p_diff']:.4f}")
print()
print(f"R² = {mod_ols.rsquared:.4f} | Breusch-Pagan p = {bp_pvalue:.4f} | Jarque-Bera p = {jb_pvalue:.4f}")
print("VIFs :", {k: round(v, 3) for k, v in vifs_dict.items()})
print()
print("--- Comparatif OLS vs HC3 vs HAC (maxlags=2) ---")
print(rapport_modeles.round(4))`,
      testPythonCode: `assert set(adf_audit.keys()) == {'oat_10y', 'euribor_3m', 'inflation_hicp', 'spread_credit_bbb'}
assert all(adf_audit[c]['p_niveau'] > 0.05 for c in adf_audit)
assert set(vifs_dict.keys()) == {'euribor_3m', 'inflation_hicp', 'spread_credit_bbb'}
assert all(1.0 < v < 3.0 for v in vifs_dict.values())
assert np.isclose(bp_pvalue, 0.6874, atol=1e-3)
assert np.isclose(jb_pvalue, 0.6882, atol=1e-3)
assert isinstance(rapport_modeles, pd.DataFrame)
assert set(['coef', 'se_ols', 'se_hc3', 'se_hac']).issubset(rapport_modeles.columns)
assert np.isclose(rapport_modeles.loc['euribor_3m', 'coef'], 0.3899, atol=1e-3)
assert np.isclose(rapport_modeles.loc['spread_credit_bbb', 'se_hac'], 0.3295, atol=1e-3)`,
      datasets: [],
      hints: [
        "Passez maxlag=1 à adfuller(df[col], maxlag=1)[1] et adfuller(df[col].diff().dropna(), maxlag=1)[1] pour éviter la sur-paramétrisation AIC sur 16 trimestres.",
        "Utilisez .fit(cov_type='HC3') puis .fit(cov_type='HAC', cov_kwds={'maxlags': 2}) sur le même modèle sm.OLS(y, X).",
        "Pour les VIFs, passez X.values (qui inclut 'const') à variance_inflation_factor(X.values, idx), puis filtrez if col != 'const'."
      ],
      guide: {
        theoryToPracticeLink:
          "Sur les $16$ trimestres de \`df\`, l'audit ADF en niveau confirme la présence de racines unitaires ($p > 0.22$). Travailler sur \`df_diff = df[cols_alm].diff().dropna()\` ($T=15$) élimine la dérive stochastique tout en maintenant des VIFs sains ($< 2.0$), une homoscédasticité validée (\`bp_pvalue = 0.6874\`) et des résidus gaussiens (\`jb_pvalue = 0.6882\`).",
        stepByStepPlan: [
          "Boucler sur `cols_alm` pour remplir `adf_audit[col]` avec les p-valeurs `adfuller(..., maxlag=1)[1]` en niveau et en différence première.",
          "Construire `df_diff = df[cols_alm].diff().dropna()`, puis `X = sm.add_constant(...)` et `y = df_diff['oat_10y']`.",
          "Estimer les trois spécifications `mod_ols`, `mod_hc3` (`cov_type='HC3'`) et `mod_hac` (`cov_type='HAC', cov_kwds={'maxlags': 2}`).",
          "Calculer `vifs_dict` avec `variance_inflation_factor(X.values, idx)` pour les 3 exogènes, ainsi que `bp_pvalue` et `jb_pvalue`.",
          "Assembler le DataFrame `rapport_modeles` regroupant coefficients, erreurs-types et p-valeurs des 3 méthodes."
        ],
        concepts: [
          {
            symbol: "df",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé des $16$ trimestres macroéconomiques (\`2020-Q1\` à \`2023-Q4\`) de la table \`macro_taux\`."
          },
          {
            symbol: "adfuller(..., maxlag=1)",
            kind: "Fonction / Méthode",
            roleInExercise: "Test de racine unitaire de Dickey-Fuller augmenté ; l'indice \`[1]\` extrait directement la p-valeur."
          },
          {
            symbol: ".diff().dropna()",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule les variations trimestrielles $\\Delta X_t = X_t - X_{t-1}$ et supprime la première ligne \`NaN\`."
          },
          {
            symbol: "cov_type='HC3' / 'HAC'",
            kind: "Paramètre",
            roleInExercise: "Options de \`.fit()\` activant les matrices de covariance robustes de White (\`HC3\`) et Newey-West (\`HAC\` avec \`cov_kwds={'maxlags': 2}\`)."
          },
          {
            symbol: "variance_inflation_factor(X.values, idx)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule $\\text{VIF}_j = 1 / (1 - R_j^2)$ à partir du tableau NumPy complet incluant \`const\`."
          },
          {
            symbol: "het_breuschpagan / jarque_bera",
            kind: "Fonction / Méthode",
            roleInExercise: "Tests diagnostiques sur \`mod_ols.resid\` vérifiant respectivement l'homoscédasticité et la normalité des résidus."
          },
          {
            symbol: "rapport_modeles",
            kind: "Variable",
            roleInExercise: "DataFrame de synthèse comparant les erreurs-types et p-valeurs entre OLS, HC3 et HAC."
          }
        ],
        guidedCode: `import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy.stats import jarque_bera
from statsmodels.tsa.stattools import adfuller
from statsmodels.stats.diagnostic import het_breuschpagan
from statsmodels.stats.outliers_influence import variance_inflation_factor

cols_alm = ['oat_10y', 'euribor_3m', 'inflation_hicp', 'spread_credit_bbb']

# Étape 1 : Audit ADF avant / après différenciation
adf_audit = {}
for col in cols_alm:
    p_niv = float(adfuller(df[col], maxlag=1)[1])
    p_dif = float(adfuller(df[col].diff().dropna(), maxlag=1)[1])
    adf_audit[col] = {'p_niveau': p_niv, 'p_diff': p_dif}

# Étape 2 : Préparation en différences premières et estimation des 3 modèles
df_diff = df[cols_alm].diff().dropna()
exog_cols = ['euribor_3m', 'inflation_hicp', 'spread_credit_bbb']
X = sm.add_constant(df_diff[exog_cols])
y = df_diff['oat_10y']

mod_ols = sm.OLS(y, X).fit()
mod_hc3 = sm.OLS(y, X).fit(cov_type=___)
mod_hac = sm.OLS(y, X).fit(cov_type=___, cov_kwds={'maxlags': ___})

# Étape 3 : VIFs et diagnostics des résidus
vifs_dict = {
    col: float(variance_inflation_factor(X.values, idx))
    for idx, col in enumerate(X.columns)
    if col != 'const'
}

bp_pvalue = float(het_breuschpagan(mod_ols.resid, X)[1])
_, jb_pvalue = jarque_bera(mod_ols.resid)
jb_pvalue = float(jb_pvalue)

# Étape 4 : Tableau comparatif final
rapport_modeles = pd.DataFrame({
    'coef': mod_ols.params,
    'se_ols': mod_ols.bse,
    'se_hc3': ___,
    'se_hac': ___,
    'pval_ols': mod_ols.pvalues,
    'pval_hc3': mod_hc3.pvalues,
    'pval_hac': mod_hac.pvalues,
})

print(f"R² = {mod_ols.rsquared:.4f} | BP p = {bp_pvalue:.4f} | JB p = {jb_pvalue:.4f}")
print(rapport_modeles.round(4))`
      }
    },

    // =========================================================================
    // CAS 5 : PCA COMPLÈTE SUR LA COURBE OAT (df_taux)
    // =========================================================================
    {
      id: "v3-py-5",
      title: "5. Analyse Spectrale (PCA) sur la Courbe des Taux OAT (df_taux)",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 30,
      description:
        "Réalisez une Analyse en Composantes Principales (PCA) sur les variations mensuelles des 6 maturités souveraines OAT (df_taux) pour extraire les facteurs Niveau, Pente et Courbure et visualiser leurs déformations.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Décomposition Spectrale & Facteurs de Litterman-Scheinkman

#### Intuition Économique & Enjeux de Couverture Obligataire
Un portefeuille obligataire est exposé à $K = 6$ points de courbe (\`1Y, 2Y, 5Y, 10Y, 20Y, 30Y\`) qui ne bougent jamais de manière indépendante. Suivre 6 sensibilités isolées est lourd et redondant. En 1991, **Litterman et Scheinkman** ont démontré qu'environ **$99\\%$ de la variance des mouvements de courbe** se résume à $3$ facteurs orthogonaux interprétables économiquement :
- **PC1 — Niveau (Shift) :** translation quasi-parallèle de toute la courbe (~$92\\%$ de variance).
- **PC2 — Pente (Twist) :** basculement entre taux courts et taux longs (~$6\\%$ de variance).
- **PC3 — Courbure (Butterfly) :** bombement du ventre 5Y–10Y contre les extrémités 1Y et 30Y (~$1\\%$ de variance).

#### Démonstration Mathématique Formelle
Soit $\\Delta Y \\in \\mathbb{R}^{T \\times 6}$ la matrice des variations mensuelles de taux et $\\Sigma = \\operatorname{Cov}(\\Delta Y) \\in \\mathbb{R}^{6 \\times 6}$ sa matrice de covariance empirique symétrique semi-définie positive ($\\Sigma = \\Sigma'$).

1. **Théorème Spectral :**
   Il existe une base orthonormée de vecteurs propres $\\mathbf{v}_1, \\dots, \\mathbf{v}_6 \\in \\mathbb{R}^6$ ($V'V = I_6$) et des valeurs propres réelles positives $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_6 \\ge 0$ telles que :
   $$\\Sigma = V \\Lambda V' = \\sum_{k=1}^6 \\lambda_k \\mathbf{v}_k \\mathbf{v}_k'$$

2. **Optimisation de Variance & Conservation de Trace :**
   Le premier axe principal $\\mathbf{v}_1$ résout $\\max_{\\|\\mathbf{v}\\|_2=1} \\mathbf{v}'\\Sigma\\mathbf{v} = \\lambda_1$. Chaque axe suivant maximise la variance dans l'orthogonal des précédents. Par invariance de la trace sous similitude orthogonale :
   $$\\sum_{k=1}^6 \\operatorname{Var}(\\Delta Y_k) = \\operatorname{Tr}(\\Sigma) = \\operatorname{Tr}(V \\Lambda V') = \\operatorname{Tr}(\\Lambda) = \\sum_{k=1}^6 \\lambda_k$$
   La part de variance expliquée par la composante $k$ vaut donc exactement $r_k = \\frac{\\lambda_k}{\\sum_{j=1}^6 \\lambda_j}$.

3. **Convention d'orientation des vecteurs propres :**
   Si $\\mathbf{v}_k$ est vecteur propre unitaire, $-\\mathbf{v}_k$ l'est aussi ! Par convention financière, on oriente $\\mathbf{v}_1$ positif en moyenne (choc haussier de niveau), $\\mathbf{v}_2$ croissant du court au long (pentification) et $\\mathbf{v}_3$ positif sur le ventre $5\\text{Y}$ (courbure).

### 💻 Masterclass Python & Ingénierie NumPy

* **\`np.linalg.eigh\` vs \`np.linalg.eig\` :** Pour une matrice symétrique comme $\\Sigma$, \`eigh\` (*Hermitian/symmetric*) garantit des valeurs propres **réelles** sans partie imaginaire parasite (\`+0j\`) et une précision numérique optimale. Attention : \`eigh\` trie par ordre **croissant** (\`lambda_min\` en premier) ! Il faut donc inverser l'ordre via \`np.argsort(eigvals)[::-1]\`.
* **Attention aux taux en variations :** Faire une PCA sur les *niveaux* de taux mélange niveaux moyens et dynamiques ; en gestion des risques ALM, on travaille toujours sur les **variations mensuelles** \`.diff().dropna()\`.

\`\`\`python
import numpy as np

# Vérification spectrale sur 3 maturités clés de df_taux : 2Y, 10Y et 30Y
d_sub = df_taux[['taux_2y', 'taux_10y', 'taux_30y']].diff().dropna()
S_sub = d_sub.cov().values

vals, vecs = np.linalg.eigh(S_sub)
idx = np.argsort(vals)[::-1]
vals, vecs = vals[idx], vecs[:, idx]
if vecs[:, 0].sum() < 0:
    vecs[:, 0] *= -1

print(f"Trace(Sigma) = {np.trace(S_sub):.6f} | Somme valeurs propres = {np.sum(vals):.6f}")
print("Parts de variance (2Y/10Y/30Y) :", np.round(vals / vals.sum() * 100, 2))
print("V' V orthogonale (max écart à I_3) :", f"{np.max(np.abs(vecs.T @ vecs - np.eye(3))):.2e}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Trace(Sigma) = 0.170062 | Somme valeurs propres = 0.170062
Parts de variance (2Y/10Y/30Y) : [94.49  5.07  0.44]
V' V orthogonale (max écart à I_3) : 4.44e-16
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir du DataFrame préchargé \`df_taux\` ($12$ dates mensuelles de \`courbe_taux_oat\` en 2023), extrayez les 3 facteurs principaux de la courbe souveraine :

1. **Variations mensuelles & Covariance** :
   - Sélectionnez les $6$ maturités \`maturites_cols = ['taux_1y', 'taux_2y', 'taux_5y', 'taux_10y', 'taux_20y', 'taux_30y']\`.
   - Calculez \`d_taux = df_taux[maturites_cols].diff().dropna()\` et la matrice de covariance \`Sigma_taux = d_taux.cov().values\`.
2. **Décomposition spectrale triée & orientée** :
   - Appelez \`eigvals, eigvecs = np.linalg.eigh(Sigma_taux)\` et triez valeurs et vecteurs propres par ordre **décroissant** (\`idx_desc = np.argsort(eigvals)[::-1]\`).
   - Imposez les conventions d'orientation : \`eigvecs[:, 0].sum() > 0\` (Niveau), \`eigvecs[-1, 1] - eigvecs[0, 1] > 0\` (Pente) et \`eigvecs[2, 2] > 0\` (Courbure $5\\text{Y}$).
3. **Indicateurs attendus (\`var_expliquee_top3\`, \`loadings_3\`)** :
   - \`var_expliquee_top3\` : vecteur NumPy de longueur $3$ des parts de variance expliquée ($\\lambda_k / \\sum \\lambda_j$) pour les 3 premiers facteurs.
   - \`loadings_3\` : DataFrame $(6 \\times 3)$ indexé par \`maturites_cols\` avec colonnes \`['PC1_Niveau', 'PC2_Pente', 'PC3_Courbure']\`.
4. **Graphique Matplotlib** : tracez les 3 profils de déformation en fonction des maturités numériques \`[1, 2, 5, 10, 20, 30]\`.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

maturites_cols = ['taux_1y', 'taux_2y', 'taux_5y', 'taux_10y', 'taux_20y', 'taux_30y']
maturites_ans = [1, 2, 5, 10, 20, 30]

d_taux = df_taux[maturites_cols].diff().dropna()
Sigma_taux = d_taux.cov().values

eigvals, eigvecs = np.linalg.eigh(Sigma_taux)
idx_desc = np.argsort(eigvals)[::-1]
eigvals = eigvals[idx_desc]
eigvecs = eigvecs[:, idx_desc]

if eigvecs[:, 0].sum() < 0:
    eigvecs[:, 0] *= -1.0
if eigvecs[-1, 1] - eigvecs[0, 1] < 0:
    eigvecs[:, 1] *= -1.0
if eigvecs[2, 2] < 0:
    eigvecs[:, 2] *= -1.0

ratios_variance = eigvals / np.sum(eigvals)
var_expliquee_top3 = ratios_variance[:3]

loadings_3 = pd.DataFrame(
    eigvecs[:, :3],
    index=maturites_cols,
    columns=['PC1_Niveau', 'PC2_Pente', 'PC3_Courbure'],
)

plt.figure(figsize=(6.5, 3.8))
for col, couleur in zip(loadings_3.columns, ['#0f172a', '#0284c7', '#e11d48']):
    plt.plot(maturites_ans, loadings_3[col], marker='o', lw=2, color=couleur, label=col)
plt.axhline(0, color='#78716c', ls='--', lw=1)
plt.xlabel('Maturité OAT (années)')
plt.ylabel('Poids propre (Loading)')
plt.title(f'PCA Courbe OAT : Top 3 = {var_expliquee_top3.sum():.2%} de variance')
plt.legend()
plt.grid(True, alpha=0.3)

print("Part de variance expliquée Top 3 (Niveau, Pente, Courbure) :", np.round(var_expliquee_top3 * 100, 2))
print(f"Variance cumulée Top 3 : {var_expliquee_top3.sum():.4%}")
print()
print("--- Vecteurs Propres (Loadings) ---")
print(loadings_3.round(4))`,
      testPythonCode: `assert len(var_expliquee_top3) == 3
assert np.isclose(var_expliquee_top3[0], 0.9280, atol=1e-3)
assert np.isclose(var_expliquee_top3[1], 0.0622, atol=1e-3)
assert np.isclose(var_expliquee_top3[2], 0.0075, atol=1e-3)
assert var_expliquee_top3.sum() > 0.995
assert loadings_3.shape == (6, 3)
assert np.allclose(loadings_3.values.T @ loadings_3.values, np.eye(3), atol=1e-8)
assert np.all(np.abs(loadings_3.iloc[:, 0]) > 0.25)`,
      datasets: [],
      hints: [
        "Calculez d_taux = df_taux[maturites_cols].diff().dropna() puis Sigma_taux = d_taux.cov().values.",
        "np.linalg.eigh retourne les valeurs propres par ordre croissant : inversez l'ordre avec idx_desc = np.argsort(eigvals)[::-1].",
        "Stockez eigvecs[:, :3] dans loadings_3 et vérifiez que loadings_3.values.T @ loadings_3.values est égal à np.eye(3)."
      ],
      guide: {
        theoryToPracticeLink:
          "La diagonalisation spectrale $\\Sigma_{\\text{taux}} = V \\Lambda V'$ appliquée aux $11$ variations mensuelles de \`df_taux\` révèle immédiatement la structure de Litterman-Scheinkman : \`PC1_Niveau\` explique $92.80\\%$ de la variance (poids tous positifs entre $0.32$ et $0.46$), \`PC2_Pente\` explique $6.22\\%$ (bascule de $-0.65$ sur 1Y à $+0.41$ sur 30Y) et \`PC3_Courbure\` explique $0.75\\%$ (pic à $+0.73$ sur le 5Y), soit $99.77\\%$ cumulés.",
        stepByStepPlan: [
          "Extraire les variations mensuelles `d_taux` sur les 6 colonnes `taux_1y` à `taux_30y` et calculer la covariance `Sigma_taux`.",
          "Appeler `np.linalg.eigh(Sigma_taux)` et trier `eigvals` et colonnes de `eigvecs` par ordre décroissant.",
          "Normaliser le signe de PC1 (Niveau), PC2 (Pente) et PC3 (Courbure) pour l'interprétation financière.",
          "Calculer `var_expliquee_top3` et construire le DataFrame `loadings_3` de dimension `(6, 3)`.",
          "Tracer les 3 courbes de loadings sur `[1, 2, 5, 10, 20, 30]` ans avec Matplotlib."
        ],
        concepts: [
          {
            symbol: "df_taux",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé des $12$ mois de 2023 contenant les taux OAT français de $1$ an à $30$ ans."
          },
          {
            symbol: "d_taux.cov().values",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la matrice de variance-covariance empirique $(6 \\times 6)$ des variations mensuelles de taux (avec $T-1 = 10$ degrés de liberté)."
          },
          {
            symbol: "np.linalg.eigh(Sigma_taux)",
            kind: "Fonction / Méthode",
            roleInExercise: "Diagonalise la matrice symétrique réelle en garantissant des valeurs propres réelles et des vecteurs propres orthogonaux."
          },
          {
            symbol: "np.argsort(eigvals)[::-1]",
            kind: "Syntaxe",
            roleInExercise: "Retourne les indices triant les valeurs propres de la plus grande ($\\lambda_1$) à la plus petite ($\\lambda_6$)."
          },
          {
            symbol: "var_expliquee_top3",
            kind: "Variable",
            roleInExercise: "Vecteur NumPy des parts de variance expliquée par PC1, PC2 et PC3 ($[0.9280, 0.0622, 0.0075]$)."
          },
          {
            symbol: "loadings_3",
            kind: "Variable",
            roleInExercise: "DataFrame $(6 \\times 3)$ des trois premiers vecteurs propres orthonormés vérifiant $V_3'V_3 = I_3$."
          }
        ],
        guidedCode: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

maturites_cols = ['taux_1y', 'taux_2y', 'taux_5y', 'taux_10y', 'taux_20y', 'taux_30y']
maturites_ans = [1, 2, 5, 10, 20, 30]

# Étape 1 : Variations mensuelles et matrice de covariance (6 x 6)
d_taux = df_taux[maturites_cols].diff().dropna()
Sigma_taux = d_taux.cov().values

# Étape 2 : Décomposition spectrale et tri décroissant
eigvals, eigvecs = np.linalg.eigh(___)
idx_desc = np.argsort(eigvals)[::-1]
eigvals = eigvals[idx_desc]
eigvecs = eigvecs[:, idx_desc]

# Étape 3 : Orientation financière conventionnelle (Niveau +, Pente croissante, Courbure 5Y +)
if eigvecs[:, 0].sum() < 0:
    eigvecs[:, 0] *= -1.0
if eigvecs[-1, 1] - eigvecs[0, 1] < 0:
    eigvecs[:, 1] *= -1.0
if eigvecs[2, 2] < 0:
    eigvecs[:, 2] *= -1.0

# Étape 4 : Variance expliquée et DataFrame des loadings
ratios_variance = eigvals / np.sum(eigvals)
var_expliquee_top3 = ratios_variance[:3]

loadings_3 = pd.DataFrame(
    eigvecs[:, :3],
    index=maturites_cols,
    columns=['PC1_Niveau', 'PC2_Pente', 'PC3_Courbure'],
)

# Étape 5 : Visualisation des 3 facteurs de déformation
plt.figure(figsize=(6.5, 3.8))
for col, couleur in zip(loadings_3.columns, ['#0f172a', '#0284c7', '#e11d48']):
    plt.plot(maturites_ans, loadings_3[col], marker='o', lw=2, color=couleur, label=col)
plt.axhline(0, color='#78716c', ls='--', lw=1)
plt.xlabel('Maturité OAT (années)')
plt.ylabel('Poids propre (Loading)')
plt.title(f'PCA Courbe OAT : Top 3 = {var_expliquee_top3.sum():.2%} de variance')
plt.legend()
plt.grid(True, alpha=0.3)

print("Variance expliquée Top 3 (%) :", np.round(var_expliquee_top3 * 100, 2))
print(loadings_3.round(4))`
      }
    },

    // =========================================================================
    // CAS 6 : OPTIMISEUR MARKOWITZ RÉEL SUR df_actifs
    // =========================================================================
    {
      id: "v3-py-6",
      title: "6. Optimiseur de Portefeuille Markowitz Réel sur df_actifs",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 35,
      description:
        "Reconstruisez la matrice de covariance à 5 actifs (df_actifs et corrélations cibles), résolvez analytiquement le GMVP et le portefeuille Tangent (rf = 3%), comparez au 1/N et tracez la frontière efficiente.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Optimisation Analytique de Markowitz (GMVP & Tangence)

#### Intuition Économique & Enjeux d'Allocation Stratégique
En allocation d'actifs institutionnelle, construire un portefeuille ne se résume pas à classer les actifs par **Ratio de Sharpe individuel**. Grâce à la corrélation imparfaite ($\\rho_{ij} < 1$), combiner des actifs risqués permet au **portefeuille de Variance Minimale Globale (GMVP)** d'afficher une volatilité strictement inférieure à celle de l'actif le moins volatil de l'univers ! De plus, en présence d'un taux sans risque $r_f = 3\\%$, le théorème de séparation de **Tobin (1958)** montre qu'un seul portefeuille risqué — le **portefeuille Tangent** — maximise le Ratio de Sharpe et domine tout autre portefeuille combiné au cash.

#### Démonstration Mathématique Formelle
Soient $K=5$ actifs d'espérances $\\boldsymbol{\\mu} \\in \\mathbb{R}^5$, de volatilités $\\boldsymbol{\\sigma} \\in \\mathbb{R}_{>0}^5$ et de matrice de corrélation $R \\in \\mathbb{R}^{5 \\times 5}$.

1. **Reconstruction de la Matrice de Covariance $\\Sigma$ :**
   En posant $D_\\sigma = \\operatorname{diag}(\\sigma_1, \\dots, \\sigma_5)$, on obtient $\\Sigma_{ij} = \\sigma_i \\sigma_j R_{ij}$, soit matriciellement :
   $$\\Sigma = D_\\sigma R D_\\sigma$$

2. **Portefeuille de Variance Minimale Globale (GMVP) :**
   Minimiser $\\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w}$ sous contrainte $\\mathbf{w}' \\mathbf{1} = 1$ via le lagrangien $\\mathcal{L}(\\mathbf{w}, \\lambda) = \\frac{1}{2}\\mathbf{w}'\\Sigma\\mathbf{w} - \\lambda(\\mathbf{w}'\\mathbf{1} - 1)$ annule $\\Sigma \\mathbf{w} = \\lambda \\mathbf{1}$, d'où :
   $$\\mathbf{w}_{\\text{GMVP}} = \\frac{\\Sigma^{-1} \\mathbf{1}}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}, \\qquad \\sigma_{\\text{GMVP}} = \\frac{1}{\\sqrt{A}} \\quad \\text{avec } A = \\mathbf{1}' \\Sigma^{-1} \\mathbf{1}$$

3. **Portefeuille Tangent (Sharpe Maximum) :**
   Maximiser le ratio de Sharpe $\\frac{\\mathbf{w}'(\\boldsymbol{\\mu} - r_f \\mathbf{1})}{\\sqrt{\\mathbf{w}'\\Sigma\\mathbf{w}}}$ revient à résoudre les conditions d'optimalité donnant :
   $$\\mathbf{w}_{\\text{Tan}} = \\frac{\\Sigma^{-1}(\\boldsymbol{\\mu} - r_f \\mathbf{1})}{\\mathbf{1}' \\Sigma^{-1}(\\boldsymbol{\\mu} - r_f \\mathbf{1})}$$

4. **Frontière Efficiente Hyperbolique (Invariants $A, B, C, \\Delta$) :**
   Avec $A = \\mathbf{1}'\\Sigma^{-1}\\mathbf{1}$, $B = \\mathbf{1}'\\Sigma^{-1}\\boldsymbol{\\mu}$, $C = \\boldsymbol{\\mu}'\\Sigma^{-1}\\boldsymbol{\\mu}$ et $\\Delta = AC - B^2 > 0$, la variance minimale atteignable pour un rendement cible $\\mu_p$ est la parabole :
   $$\\sigma_p^2(\\mu_p) = \\frac{A \\mu_p^2 - 2 B \\mu_p + C}{\\Delta}$$

### 💻 Masterclass Python & Ingénierie Matricielle

* **\`np.diag(vols)\` :** Transforme le vecteur 1D des volatilités en matrice diagonale $5 \\times 5$, permettant l'expression lisible \`Sigma = D_sigma @ R_cible @ D_sigma\`.
* **Éviter \`np.float64(...)\` dans les dicts :** Un cast explicite \`round(float(v), 4)\` garantit des sorties identiques et propres quelle que soit la version de NumPy.
* **Comparatif structuré :** Transposer un dictionnaire de tuples dans \`pd.DataFrame({...}, index=['Rendement', 'Volatilite', 'Sharpe']).T\` génère un tableau directement indexé par stratégie.

\`\`\`python
import numpy as np

# Sous-univers à 3 actifs de df_actifs : TTE, MC et AI
sub_a = df_actifs[df_actifs['ticker'].isin(['TTE', 'MC', 'AI'])].reset_index(drop=True)
R3 = np.array([[1.0, 0.28, 0.32], [0.28, 1.0, 0.52], [0.32, 0.52, 1.0]])
D3 = np.diag(sub_a['volatilite'].values)
S3 = D3 @ R3 @ D3
invS3 = np.linalg.inv(S3)
u3 = np.ones(3)

w_g = (invS3 @ u3) / (u3 @ invS3 @ u3)
vol_g = float(np.sqrt(w_g @ S3 @ w_g))

print("Actifs :", list(sub_a['ticker']), "| Vols :", list(sub_a['volatilite']))
print("Poids GMVP (3 actifs) :", {t: round(float(w), 4) for t, w in zip(sub_a['ticker'], w_g)})
print(f"Volatilité GMVP : {vol_g:.2%} < min(vol_i) = {sub_a['volatilite'].min():.2%}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Actifs : ['TTE', 'MC', 'AI'] | Vols : [0.22, 0.21, 0.16]
Poids GMVP (3 actifs) : {'TTE': 0.2473, 'MC': 0.1641, 'AI': 0.5886}
Volatilité GMVP : 14.39% < min(vol_i) = 16.00%
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir du DataFrame préchargé \`df_actifs\` (ordonné \`['TTE', 'BNP', 'MC', 'AI', 'CW8']\`) et du taux sans risque \`rf = 0.03\`, implémentez l'optimiseur analytique de Markowitz :

1. **Matrice de corrélation \`R_cible\` & Covariance \`Sigma\`** :
   - Définissez \`R_cible\` ($5 \\times 5$) avec les corrélations exactes de \`matrice_correlations\` :
     \`TTE\`: \`[1.00, 0.45, 0.28, 0.32, 0.55]\`, \`BNP\`: \`[0.45, 1.00, 0.40, 0.35, 0.62]\`, \`MC\`: \`[0.28, 0.40, 1.00, 0.52, 0.70]\`, \`AI\`: \`[0.32, 0.35, 0.52, 1.00, 0.65]\`, \`CW8\`: \`[0.55, 0.62, 0.70, 0.65, 1.00]\`.
   - Calculez \`Sigma = np.diag(vols) @ R_cible @ np.diag(vols)\` et \`inv_Sigma = np.linalg.inv(Sigma)\`.
2. **Poids optimaux & Équipondéré** :
   - Calculez \`w_gmvp\`, \`w_tan\` (pour \`rf = 0.03\`) et \`w_eq = ones / 5\`.
3. **Fonction \`evaluer_portefeuille(w, mu, Sigma, rf=0.03)\`** :
   - Retourne le tuple \`(r_p, vol_p, sharpe)\` en flottants Python.
4. **Comparatif \`comparaison_ptf\` & Graphique Matplotlib** :
   - Construisez \`comparaison_ptf\` (DataFrame indexé par \`['GMVP', 'Tangence', 'Equipondere']\` avec colonnes \`['Rendement', 'Volatilite', 'Sharpe']\`).
   - Tracez la frontière efficiente complète via les invariants $(A, B, C, \\Delta)$ avec les $5$ actifs et les $3$ portefeuilles.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def evaluer_portefeuille(w, mu, Sigma, rf=0.03):
    """Calcule (rendement_espere, volatilite, ratio_sharpe) d'un portefeuille pondéré w."""
    r_p = float(w @ mu)
    vol_p = float(np.sqrt(w @ Sigma @ w))
    sharpe = float((r_p - rf) / vol_p)
    return r_p, vol_p, sharpe

tickers = list(df_actifs['ticker'])
mu = df_actifs['rendement_espere'].to_numpy(dtype=float)
vols = df_actifs['volatilite'].to_numpy(dtype=float)

# Ordre des tickers dans df_actifs : TTE, BNP, MC, AI, CW8
R_cible = np.array([
    [1.00, 0.45, 0.28, 0.32, 0.55],
    [0.45, 1.00, 0.40, 0.35, 0.62],
    [0.28, 0.40, 1.00, 0.52, 0.70],
    [0.32, 0.35, 0.52, 1.00, 0.65],
    [0.55, 0.62, 0.70, 0.65, 1.00],
])

D_sigma = np.diag(vols)
Sigma = D_sigma @ R_cible @ D_sigma
inv_Sigma = np.linalg.inv(Sigma)
ones = np.ones(len(tickers))
rf = 0.03

w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)
excess = mu - rf * ones
w_tan = (inv_Sigma @ excess) / (ones @ inv_Sigma @ excess)
w_eq = ones / len(tickers)

comparaison_ptf = pd.DataFrame(
    {
        'GMVP': evaluer_portefeuille(w_gmvp, mu, Sigma, rf),
        'Tangence': evaluer_portefeuille(w_tan, mu, Sigma, rf),
        'Equipondere': evaluer_portefeuille(w_eq, mu, Sigma, rf),
    },
    index=['Rendement', 'Volatilite', 'Sharpe'],
).T

A = float(ones @ inv_Sigma @ ones)
B = float(ones @ inv_Sigma @ mu)
C = float(mu @ inv_Sigma @ mu)
Delta = A * C - B ** 2
mu_grid = np.linspace(0.07, 0.12, 80)
vol_grid = np.sqrt((A * mu_grid ** 2 - 2 * B * mu_grid + C) / Delta)

plt.figure(figsize=(6.5, 4.0))
plt.plot(vol_grid * 100, mu_grid * 100, color='#0284c7', lw=2.2, label='Frontière Markowitz')
plt.scatter(vols * 100, mu * 100, color='#78716c', s=45, label='Actifs individuels')
for i, tk in enumerate(tickers):
    plt.annotate(tk, (vols[i] * 100 + 0.25, mu[i] * 100), fontsize=8)
for nom, col in [('GMVP', '#10b981'), ('Tangence', '#e11d48'), ('Equipondere', '#f59e0b')]:
    row = comparaison_ptf.loc[nom]
    plt.scatter([row['Volatilite'] * 100], [row['Rendement'] * 100], color=col, s=75, zorder=5, label=nom)
plt.xlabel('Volatilité annualisée (%)')
plt.ylabel('Rendement espéré (%)')
plt.title('Optimisation Markowitz : GMVP vs Tangence vs 1/N')
plt.legend(fontsize=8)
plt.grid(True, alpha=0.3)

print("Poids GMVP     :", {tk: round(float(v), 4) for tk, v in zip(tickers, w_gmvp)})
print("Poids Tangence :", {tk: round(float(v), 4) for tk, v in zip(tickers, w_tan)})
print()
print("--- Comparatif des Portefeuilles ---")
print(comparaison_ptf.round(4))`,
      testPythonCode: `assert 'evaluer_portefeuille' in globals() and callable(evaluer_portefeuille)
assert np.isclose(w_gmvp.sum(), 1.0, atol=1e-8)
assert np.isclose(w_tan.sum(), 1.0, atol=1e-8)
assert np.isclose(comparaison_ptf.loc['GMVP', 'Volatilite'], 0.138182, atol=1e-4)
assert np.isclose(comparaison_ptf.loc['Tangence', 'Sharpe'], 0.4373, atol=1e-3)
assert np.isclose(comparaison_ptf.loc['Equipondere', 'Rendement'], 0.0904, atol=1e-4)
assert comparaison_ptf.loc['GMVP', 'Volatilite'] < comparaison_ptf.loc['Equipondere', 'Volatilite']
assert comparaison_ptf.loc['Tangence', 'Sharpe'] >= comparaison_ptf['Sharpe'].max() - 1e-8`,
      datasets: [],
      hints: [
        "Construisez Sigma = np.diag(vols) @ R_cible @ np.diag(vols), puis inv_Sigma = np.linalg.inv(Sigma).",
        "GMVP : (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones). Tangence : remplacez ones au numérateur et second facteur par (mu - 0.03 * ones).",
        "Pour la frontière efficiente, calculez A, B, C, Delta = A*C - B**2 puis vol_grid = np.sqrt((A * mu_grid**2 - 2*B*mu_grid + C) / Delta)."
      ],
      guide: {
        theoryToPracticeLink:
          "En combinant les $5$ actifs de \`df_actifs\` via $\\Sigma = D_\\sigma R_{\\text{cible}} D_\\sigma$, les formules analytiques de Markowitz montrent que le \`GMVP\` abaisse le risque à $13.82\\%$ (sous le minimum individuel de \`CW8\` à $15.0\\%$) tandis que le portefeuille \`Tangence\` hisse le Sharpe à $0.4373$ contre $0.3980$ pour l'équipondéré \`1/N\`.",
        stepByStepPlan: [
          "Écrire `evaluer_portefeuille(w, mu, Sigma, rf=0.03)` retournant `(r_p, vol_p, sharpe)`.",
          "Extraire `mu` et `vols` de `df_actifs`, saisir la matrice symétrique `R_cible` (5x5) et calculer `Sigma = D_sigma @ R_cible @ D_sigma`.",
          "Résoudre analytiquement `w_gmvp`, `w_tan` et `w_eq` à l'aide de `inv_Sigma = np.linalg.inv(Sigma)`.",
          "Assembler le DataFrame `comparaison_ptf` en appelant `evaluer_portefeuille` sur les 3 allocations.",
          "Calculer les constantes `A, B, C, Delta` et tracer la frontière efficiente et les portefeuilles dans Matplotlib."
        ],
        concepts: [
          {
            symbol: "df_actifs",
            kind: "Colonne / Table",
            roleInExercise: "DataFrame préchargé des $5$ actifs (\`TTE, BNP, MC, AI, CW8\`) fournissant \`rendement_espere\` et \`volatilite\`."
          },
          {
            symbol: "np.diag(vols)",
            kind: "Fonction / Méthode",
            roleInExercise: "Crée la matrice diagonale $D_\\sigma$ permettant de convertir la matrice de corrélation \`R_cible\` en covariance \`Sigma\`."
          },
          {
            symbol: "np.linalg.inv(Sigma)",
            kind: "Fonction / Méthode",
            roleInExercise: "Inverse la matrice de covariance symétrique définie positive $(5 \\times 5)$ pour résoudre les multiplicateurs de Lagrange."
          },
          {
            symbol: "w_gmvp / w_tan / w_eq",
            kind: "Variable",
            roleInExercise: "Vecteurs de pondération $(5,)$ sommant à $1.0$ pour le GMVP, la Tangence ($r_f=3\\%$) et l'équipondéré \`1/N\`."
          },
          {
            symbol: "evaluer_portefeuille(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Helper factorisé retournant le triplet \`(Rendement, Volatilite, Sharpe)\` de n'importe quel vecteur de poids."
          },
          {
            symbol: "comparaison_ptf",
            kind: "Variable",
            roleInExercise: "DataFrame comparatif $(3 \\times 3)$ validant que \`GMVP\` minimise la volatilité et \`Tangence\` maximise le Sharpe."
          }
        ],
        guidedCode: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Étape 1 : Helper d'évaluation rendement / risque / Sharpe
def evaluer_portefeuille(w, mu, Sigma, rf=0.03):
    """Calcule (rendement_espere, volatilite, ratio_sharpe) d'un portefeuille pondéré w."""
    r_p = float(w @ mu)
    vol_p = float(np.sqrt(w @ Sigma @ w))
    sharpe = float((r_p - rf) / vol_p)
    return r_p, vol_p, sharpe

# Étape 2 : Extraction df_actifs et construction de Sigma = D * R * D
tickers = list(df_actifs['ticker'])
mu = df_actifs['rendement_espere'].to_numpy(dtype=float)
vols = df_actifs['volatilite'].to_numpy(dtype=float)

R_cible = np.array([
    [1.00, 0.45, 0.28, 0.32, 0.55],
    [0.45, 1.00, 0.40, 0.35, 0.62],
    [0.28, 0.40, 1.00, 0.52, 0.70],
    [0.32, 0.35, 0.52, 1.00, 0.65],
    [0.55, 0.62, 0.70, 0.65, 1.00],
])

D_sigma = np.diag(vols)
Sigma = ___
inv_Sigma = np.linalg.inv(Sigma)
ones = np.ones(len(tickers))
rf = 0.03

# Étape 3 : Calcul analytique des vecteurs de poids optimaux
w_gmvp = ___
excess = mu - rf * ones
w_tan = ___
w_eq = ones / len(tickers)

# Étape 4 : Tableau comparatif et frontière efficiente
comparaison_ptf = pd.DataFrame(
    {
        'GMVP': evaluer_portefeuille(w_gmvp, mu, Sigma, rf),
        'Tangence': evaluer_portefeuille(w_tan, mu, Sigma, rf),
        'Equipondere': evaluer_portefeuille(w_eq, mu, Sigma, rf),
    },
    index=['Rendement', 'Volatilite', 'Sharpe'],
).T

A = float(ones @ inv_Sigma @ ones)
B = float(ones @ inv_Sigma @ mu)
C = float(mu @ inv_Sigma @ mu)
Delta = A * C - B ** 2
mu_grid = np.linspace(0.07, 0.12, 80)
vol_grid = np.sqrt((A * mu_grid ** 2 - 2 * B * mu_grid + C) / Delta)

plt.figure(figsize=(6.5, 4.0))
plt.plot(vol_grid * 100, mu_grid * 100, color='#0284c7', lw=2.2, label='Frontière Markowitz')
plt.scatter(vols * 100, mu * 100, color='#78716c', s=45, label='Actifs individuels')
for nom, col in [('GMVP', '#10b981'), ('Tangence', '#e11d48'), ('Equipondere', '#f59e0b')]:
    row = comparaison_ptf.loc[nom]
    plt.scatter([row['Volatilite'] * 100], [row['Rendement'] * 100], color=col, s=75, zorder=5, label=nom)
plt.xlabel('Volatilité annualisée (%)')
plt.ylabel('Rendement espéré (%)')
plt.title('Optimisation Markowitz : GMVP vs Tangence vs 1/N')
plt.legend(fontsize=8)
plt.grid(True, alpha=0.3)

print(comparaison_ptf.round(4))`
      }
    },

    // =========================================================================
    // CAS 7 : ATTRIBUTION FACTORIELLE CAPM & CONTRIBUTION MARGINALE AU RISQUE
    // =========================================================================
    {
      id: "v3-py-7",
      title: "7. Attribution Factorielle CAPM & Décomposition du Risque Marginal (df_marche)",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 30,
      description:
        "Pivotez les cotations journalières df_marche, estimez par OLS le modèle CAPM des 4 actions face à CW8 et décomposez exactement la volatilité d'un portefeuille selon le théorème d'Euler (MCR / TCR).",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Modèle CAPM & Décomposition d'Euler du Risque

#### Intuition Économique & Budget de Risque en Gestion d'Actifs
Deux gérants peuvent détenir chacun $25\\%$ de capital dans 4 actions (\`TTE, BNP, MC, AI\`) tout en concentrant en réalité plus de $60\\%$ du **risque** sur deux valeurs cycliques ! En gestion quantitative et en allocation *Risk Parity* (ERC), il est indispensable de distinguer la **pondération en capital** ($w_i$) de la **contribution réelle au risque** ($\\text{TCR}_i$), tout en mesurant l'exposition directionnelle de chaque titre au facteur de marché (\`CW8\`) par le $\\beta$ du CAPM.

#### Démonstration Mathématique Formelle
1. **Régression Factorielle CAPM (Sharpe, 1964) :**
   Pour chaque action $i$, on estime par OLS sur les rendements journaliers contre le benchmark \`CW8\` ($R_{M,t}$) :
   $$R_{i,t} = \\alpha_i + \\beta_i R_{M,t} + \\varepsilon_{i,t}, \\qquad \\hat{\\beta}_i = \\frac{\\operatorname{Cov}(R_i, R_M)}{\\operatorname{Var}(R_M)}$$
   Le $R^2$ de la régression mesure la part de variance totale expliquée par le risque systématique de marché, le complément $1 - R^2$ représentant le risque idiosyncratique diversifiable.

2. **Homogénéité de Degré 1 & Théorème d'Euler :**
   La fonction de volatilité du portefeuille $\\sigma_p(\\mathbf{w}) = \\sqrt{\\mathbf{w}' \\Sigma \\mathbf{w}}$ vérifie $\\sigma_p(\\lambda \\mathbf{w}) = \\lambda \\sigma_p(\\mathbf{w})$ pour tout $\\lambda > 0$. D'après le théorème d'Euler pour les fonctions positivement homogènes de degré 1 :
   $$\\sigma_p(\\mathbf{w}) = \\sum_{i=1}^K w_i \\frac{\\partial \\sigma_p}{\\partial w_i}$$

3. **MCR, TCR et Part en Pourcentage :**
   En différentiant $\\sigma_p(\\mathbf{w}) = (\\mathbf{w}'\\Sigma\\mathbf{w})^{1/2}$, le vecteur des **Contributions Marginales au Risque (MCR)** vaut :
   $$\\text{MCR} = \\nabla_{\\mathbf{w}} \\sigma_p = \\frac{\\Sigma \\mathbf{w}}{\\sqrt{\\mathbf{w}'\\Sigma\\mathbf{w}}} = \\frac{\\Sigma \\mathbf{w}}{\\sigma_p}$$
   La **Contribution Totale au Risque (TCR)** de l'actif $i$ est $\\text{TCR}_i = w_i \\cdot \\text{MCR}_i$, garantissant l'identité comptable exacte $\\sum_{i=1}^K \\text{TCR}_i = \\sigma_p$ et donc des parts $\\frac{\\text{TCR}_i}{\\sigma_p} \\times 100$ sommant à $100\\%$ !

### 💻 Masterclass Python & Ingénierie Pandas

* **Passage format long $\\to$ large (\`.pivot\`) :** \`df_marche\` contient $25$ lignes empilées ($5$ dates $\\times$ $5$ tickers). \`df_marche.pivot(index='date', columns='ticker', values='rendement_journalier')\` aligne immédiatement les $5$ séries temporelles côte à côte sur l'index des dates.
* **Accumulation propre en boucle :** Stocker les résultats de régression par ticker dans un dictionnaire \`capm_rows[tk] = {'alpha': ..., 'beta': ..., 'r2': ...}\` puis appeler \`pd.DataFrame(capm_rows).T\` évite le coûteux \`pd.concat\` itératif.
* **Audit d'Euler :** Vérifier \`np.isclose(tcr.sum(), vol_ptf)\` constitue un test unitaire mathématique infaillible.

\`\`\`python
import numpy as np
import statsmodels.api as sm

# Équivalence analytique Cov/Var vs OLS sur MC vs CW8, puis identité d'Euler sur 2 actifs
piv = df_marche.pivot(index='date', columns='ticker', values='rendement_journalier')
cov_mc_cw8 = np.cov(piv['MC'], piv['CW8'], ddof=1)
beta_cov = cov_mc_cw8[0, 1] / cov_mc_cw8[1, 1]
beta_ols = sm.OLS(piv['MC'], sm.add_constant(piv['CW8'])).fit().params['CW8']

S2 = piv[['TTE', 'AI']].cov().values
w2 = np.array([0.6, 0.4])
vol2 = float(np.sqrt(w2 @ S2 @ w2))
tcr2 = w2 * (S2 @ w2) / vol2

print(f"Beta(MC) -> Cov/Var = {beta_cov:.4f} | OLS = {beta_ols:.4f}")
print(f"Euler 2 actifs -> sum(TCR)={tcr2.sum():.6f} vs vol_p={vol2:.6f} | Part TTE={tcr2[0]/vol2:.2%}, AI={tcr2[1]/vol2:.2%}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Beta(MC) -> Cov/Var = 3.7498 | OLS = 3.7498
Euler 2 actifs -> sum(TCR)=0.008571 vs vol_p=0.008571 | Part TTE=70.79%, AI=29.21%
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir du DataFrame boursier préchargé \`df_marche\` ($25$ cotations), réalisez l'attribution factorielle CAPM et la décomposition du risque d'un portefeuille équipondéré sur les $4$ actions (\`['TTE', 'BNP', 'MC', 'AI']\`) :

1. **Pivot des rendements (\`returns_pivot\`)** :
   - Pivotez \`df_marche\` avec \`index='date'\`, \`columns='ticker'\`, \`values='rendement_journalier'\`.
2. **Estimation CAPM (\`betas_capm\`)** :
   - Régressez chaque action de \`actions = ['TTE', 'BNP', 'MC', 'AI']\` sur \`sm.add_constant(returns_pivot['CW8'])\` par \`sm.OLS\`.
   - Stockez les résultats dans le DataFrame \`betas_capm\` indexé par \`actions\` avec les colonnes \`['alpha', 'beta', 'r2']\`.
3. **Décomposition d'Euler (\`vol_ptf\`, \`mcr\`, \`tcr\`, \`pct_contrib_risque\`)** :
   - Pour \`poids_ptf = np.array([0.25, 0.25, 0.25, 0.25])\` et \`Sigma_4 = returns_pivot[actions].cov().values\` :
   - Calculez \`vol_ptf = float(np.sqrt(poids_ptf @ Sigma_4 @ poids_ptf))\`, \`mcr = (Sigma_4 @ poids_ptf) / vol_ptf\`, \`tcr = poids_ptf * mcr\`, puis \`pct_contrib_risque = pd.Series((tcr / vol_ptf) * 100.0, index=actions)\` sommant à \`100.0\`.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import pandas as pd
import statsmodels.api as sm

returns_pivot = df_marche.pivot(index='date', columns='ticker', values='rendement_journalier')
actions = ['TTE', 'BNP', 'MC', 'AI']

X_mkt = sm.add_constant(returns_pivot['CW8'])
capm_rows = {}
for tk in actions:
    fit = sm.OLS(returns_pivot[tk], X_mkt).fit()
    capm_rows[tk] = {
        'alpha': float(fit.params['const']),
        'beta': float(fit.params['CW8']),
        'r2': float(fit.rsquared),
    }

betas_capm = pd.DataFrame(capm_rows).T

poids_ptf = np.array([0.25, 0.25, 0.25, 0.25])
Sigma_4 = returns_pivot[actions].cov().values

vol_ptf = float(np.sqrt(poids_ptf @ Sigma_4 @ poids_ptf))
mcr = (Sigma_4 @ poids_ptf) / vol_ptf
tcr = poids_ptf * mcr
pct_contrib_risque = pd.Series((tcr / vol_ptf) * 100.0, index=actions)

print("--- Modèle Factoriel CAPM (vs CW8) ---")
print(betas_capm.round(4))
print()
print(f"Volatilité journalière du portefeuille : {vol_ptf:.4%}")
print(f"Somme des TCR (théorème d'Euler)       : {tcr.sum():.4%}")
print()
print("--- Contribution en % au Risque Total ---")
print(pct_contrib_risque.round(2))`,
      testPythonCode: `assert list(betas_capm.index) == ['TTE', 'BNP', 'MC', 'AI']
assert set(['alpha', 'beta', 'r2']).issubset(betas_capm.columns)
assert np.isclose(betas_capm.loc['BNP', 'beta'], 3.8536, atol=1e-3)
assert np.isclose(betas_capm.loc['MC', 'r2'], 0.9837, atol=1e-3)
assert np.isclose(tcr.sum(), vol_ptf, atol=1e-10)
assert np.isclose(pct_contrib_risque.sum(), 100.0, atol=1e-6)
assert np.isclose(pct_contrib_risque['BNP'], 28.85, atol=0.1)`,
      datasets: [],
      hints: [
        "Transformez le tableau long avec df_marche.pivot(index='date', columns='ticker', values='rendement_journalier').",
        "Dans la boucle sur actions, X_mkt = sm.add_constant(returns_pivot['CW8']), puis fit.params['CW8'] donne le bêta.",
        "La contribution marginale vaut (Sigma_4 @ poids_ptf) / vol_ptf, la contribution totale vaut poids_ptf * mcr, et pct_contrib_risque = (tcr / vol_ptf) * 100.0."
      ],
      guide: {
        theoryToPracticeLink:
          "Bien que chaque action pèse exactement $25\\%$ en capital, \`pct_contrib_risque\` prouve que \`BNP\` (bêta $= 3.85$) consomme $28.85\\%$ du risque total tandis qu'\`AI\` (bêta $= 1.02$) n'en représente que $18.76\\%$. Le contrôle \`tcr.sum() == vol_ptf\` valide exactement le théorème d'Euler.",
        stepByStepPlan: [
          "Pivoter `df_marche` par `date` et `ticker` sur `rendement_journalier` dans `returns_pivot`.",
          "Boucler sur `['TTE', 'BNP', 'MC', 'AI']` pour ajuster `sm.OLS` contre `CW8` (avec constante) et former `betas_capm`.",
          "Extraire `Sigma_4 = returns_pivot[actions].cov().values` et définir `poids_ptf = np.array([0.25, 0.25, 0.25, 0.25])`.",
          "Calculer `vol_ptf`, `mcr`, `tcr` et `pct_contrib_risque` (en pourcentage sommant à `100.0`)."
        ],
        concepts: [
          {
            symbol: "df_marche",
            kind: "Colonne / Table",
            roleInExercise: "Table préchargée des $25$ cotations journalières ($5$ séances $\\times$ $5$ tickers dont l'ETF benchmark \`CW8\`)."
          },
          {
            symbol: ".pivot(index=..., columns=..., values=...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Restructure le DataFrame long en matrice chronologique $(5 \\times 5)$ alignée par date."
          },
          {
            symbol: "betas_capm",
            kind: "Variable",
            roleInExercise: "DataFrame $(4 \\times 3)$ regroupant \`alpha\`, \`beta\` et \`r2\` estimés par \`sm.OLS\` face à \`CW8\`."
          },
          {
            symbol: "Sigma_4",
            kind: "Variable",
            roleInExercise: "Matrice de covariance $(4 \\times 4)$ des rendements journaliers des $4$ actions."
          },
          {
            symbol: "mcr / tcr",
            kind: "Variable",
            roleInExercise: "Vecteurs des Contributions Marginales ($\\Sigma\\mathbf{w}/\\sigma_p$) et Totales ($w_i \\cdot \\text{MCR}_i$) vérifiant $\\sum \\text{TCR}_i = \\sigma_p$."
          },
          {
            symbol: "pct_contrib_risque",
            kind: "Variable",
            roleInExercise: "Série Pandas des parts de risque en pourcentage ($\\text{TCR}_i / \\sigma_p \\times 100$) sommant exactement à $100\\%$."
          }
        ],
        guidedCode: `import numpy as np
import pandas as pd
import statsmodels.api as sm

# Étape 1 : Pivot long -> large par date et ticker
returns_pivot = df_marche.pivot(index='date', columns='ticker', values='rendement_journalier')
actions = ['TTE', 'BNP', 'MC', 'AI']

# Étape 2 : Estimation CAPM par OLS face à CW8
X_mkt = sm.add_constant(returns_pivot['CW8'])
capm_rows = {}
for tk in actions:
    fit = sm.OLS(returns_pivot[tk], X_mkt).fit()
    capm_rows[tk] = {
        'alpha': float(fit.params['const']),
        'beta': float(___),
        'r2': float(fit.rsquared),
    }

betas_capm = pd.DataFrame(capm_rows).T

# Étape 3 : Décomposition du risque marginal et total (Euler)
poids_ptf = np.array([0.25, 0.25, 0.25, 0.25])
Sigma_4 = returns_pivot[actions].cov().values

vol_ptf = float(np.sqrt(___))
mcr = (___) / vol_ptf
tcr = poids_ptf * mcr
pct_contrib_risque = pd.Series((___) * 100.0, index=actions)

print(betas_capm.round(4))
print(f"Volatilité : {vol_ptf:.4%} | Somme TCR : {tcr.sum():.4%}")
print(pct_contrib_risque.round(2))`
      }
    },

    // =========================================================================
    // CAS 8 : MOTEUR MULTI-MODÈLES DE VaR & EXPECTED SHORTFALL À 99 %
    // =========================================================================
    {
      id: "v3-py-8",
      title: "8. Moteur Multi-Modèles de VaR & Expected Shortfall à 99 %",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 30,
      description:
        "Développez une fonction audit_risque_tail comparant sur un capital de 10 M EUR la VaR et l'Expected Shortfall à 99 % selon 3 approches : Gaussienne, Cornish-Fisher (asymétrie & kurtosis) et Historique.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Cornish-Fisher & Expected Shortfall Cohérente

#### Intuition Économique & Limites de la VaR Gaussienne
Une **VaR paramétrique gaussienne** suppose des rendements symétriques et sans queues épaisses ($S = 0$, $K - 3 = 0$). Or, les portefeuilles d'actifs réels (actions, crédit corporate, options vendues) subissent des krachs brutaux : **asymétrie négative des rendements** ($S_R < 0$, soit asymétrie *positive* des pertes $S_L = -S_R > 0$) et **excès de kurtosis positif** ($K_{\\text{exc}} = K - 3 > 0$). À $99\\%$, la normale sous-estime drastiquement le capital nécessaire, exposant l'institution à des faillites lors des régimes extrêmes.

#### Démonstration Mathématique Formelle
Travaillons sur la distribution des **pertes relatives** $L = -R$ de moyenne $\\mu_L$, écart-type $\\sigma_L$, asymétrie $S_L$ et excès de kurtosis $K_{\\text{exc}}$. Pour un niveau de confiance $\\alpha = 0.99$ (quantile gaussien $z_\\alpha = \\Phi^{-1}(\\alpha) \\approx 2.3263$) et un capital $C$ :

1. **Modèle Gaussien Paramétrique :**
   $$\\operatorname{VaR}_{\\alpha}^{\\mathcal{N}} = (\\mu_L + z_\\alpha \\sigma_L) C, \\qquad \\operatorname{CVaR}_{\\alpha}^{\\mathcal{N}} = \\left(\\mu_L + \\sigma_L \\frac{\\varphi(z_\\alpha)}{1 - \\alpha}\\right) C$$

2. **Expansion de Cornish-Fisher (1937) :**
   Le développement de Cornish-Fisher corrige le quantile normal $z_u$ (pour tout $u \\in [\\alpha, 1[$) par les moments d'ordre 3 et 4 de la perte :
   $$z_{\\text{CF}}(u) = z_u + \\frac{1}{6}(z_u^2 - 1)S_L + \\frac{1}{24}(z_u^3 - 3z_u)K_{\\text{exc}} - \\frac{1}{36}(2z_u^3 - 5z_u)S_L^2$$
   On obtient immédiatement $\\operatorname{VaR}_{\\alpha}^{\\text{CF}} = (\\mu_L + z_{\\text{CF}}(\\alpha)\\sigma_L) C$.
   Pour l'**Expected Shortfall Cornish-Fisher**, plutôt qu'une troncature analytique de Gram-Charlier pouvant parfois violer $\\text{CVaR} \\ge \\text{VaR}$ sous fort kurtosis, on applique directement le théorème fondamental d'**Acerbi-Tasche** par intégration numérique des quantiles Cornish-Fisher dans la queue $[\\alpha, 1[$ :
   $$\\operatorname{CVaR}_{\\alpha}^{\\text{CF}} = \\frac{1}{1 - \\alpha} \\int_{\\alpha}^{1} \\operatorname{VaR}_u^{\\text{CF}} \\, du$$

3. **Modèle Historique / Empirique :**
   Sans hypothèse paramétrique, $\\operatorname{VaR}_{\\alpha}^{\\text{Hist}} = q_{\\alpha}(L) \\cdot C$ et $\\operatorname{CVaR}_{\\alpha}^{\\text{Hist}} = \\mathbb{E}[L \\mid L \\ge q_{\\alpha}(L)] \\cdot C$.

### 💻 Masterclass Python & Ingénierie NumPy / SciPy

* **Signe de l'asymétrie en convention perte :** Si les rendements $R$ ont un skew négatif ($S_R < 0$, queue gauche lourde), les pertes $L = -R$ ont un skew **positif** ($S_L = -S_R > 0$), ce qui augmente bien $z_{\\text{CF}}$ vers la droite ! Toujours utiliser \`skew(..., bias=False)\` et \`kurtosis(..., fisher=True, bias=False)\` pour l'excès de kurtosis non biaisé.
* **Quadrature vectorisée d'Acerbi-Tasche :** Évaluer \`u_grid = niveau + (1.0 - niveau) * (np.arange(0.5, 2000) / 2000)\` calcule l'intégrale de queue en moins d'une milliseconde sans aucune boucle Python.

\`\`\`python
import numpy as np
from scipy.stats import norm, skew, kurtosis

# Effet multiplicateur de Cornish-Fisher sur une série asymétrique à queues épaisses
np.random.seed(123)
z_ex8 = np.random.standard_t(df=6, size=3000)
L_ex8 = -(0.0005 + 0.012 * z_ex8 - 0.001 * (z_ex8 ** 2 - 1.0))

S_L = float(skew(L_ex8, bias=False))
K_L = float(kurtosis(L_ex8, fisher=True, bias=False))
za = float(norm.ppf(0.99))
zcf = za + (za**2 - 1)*S_L/6 + (za**3 - 3*za)*K_L/24 - (2*za**3 - 5*za)*(S_L**2)/36

print(f"Skew(pertes)={S_L:+.4f}, Excès Kurtosis={K_L:.4f}")
print(f"z_0.99 (Gauss) = {za:.4f} vs z_CF = {zcf:.4f} (facteur x{zcf/za:.2f})")
print(f"VaR 99% Gauss = {L_ex8.mean()+za*L_ex8.std(ddof=1):.4%} | CF = {L_ex8.mean()+zcf*L_ex8.std(ddof=1):.4%} | Hist = {np.quantile(L_ex8, 0.99):.4%}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Skew(pertes)=+1.1052, Excès Kurtosis=3.9952
z_0.99 (Gauss) = 2.3263 vs z_CF = 3.6134 (facteur x1.55)
VaR 99% Gauss = 3.3936% | CF = 5.2888% | Hist = 4.4609%
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

Écrivez un moteur d'audit des risques extrêmes et testez-le sur une série asymétrique de Student ($N = 5\\,000$, \`seed = 42\`) pour un portefeuille de \`capital = 10_000_000.0\` EUR au niveau \`niveau = 0.99\` :

1. **Fonction \`audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0)\`** :
   - Convertissez en pertes \`pertes = -np.asarray(rendements, dtype=float)\`, calculez \`mu_L\`, \`sig_L\` (\`ddof=1\`), \`skew_L = float(skew(pertes, bias=False))\` et \`xkurt = float(kurtosis(pertes, fisher=True, bias=False))\`.
   - **Gaussien** : \`var_gauss\` et \`cvar_gauss\` (formule analytique $\\varphi(z_\\alpha)/(1-\\alpha)$).
   - **Cornish-Fisher** : \`var_cf\` via $z_{\\text{CF}}(\\alpha)$, et \`cvar_cf\` par intégrale numérique d'Acerbi-Tasche sur \`m_grid = 2000\` points dans $[\\alpha, 1[$.
   - **Historique** : \`var_hist\` via \`np.quantile(pertes, niveau)\` et \`cvar_hist\` via la moyenne des pertes $\\ge q_{\\text{hist}}$.
   - Retournez le dictionnaire contenant exactement les $8$ clés : \`'var_gauss'\`, \`'cvar_gauss'\`, \`'var_cf'\`, \`'cvar_cf'\`, \`'var_hist'\`, \`'cvar_hist'\`, \`'skewness'\` (des rendements, soit \`-skew_L\`), \`'excess_kurtosis'\`.
2. **Exécution sur la série Student réaliste** :
   - Générez \`np.random.seed(42)\`, \`z_stud = np.random.standard_t(df=5, size=5000)\`, \`rendements = 0.0004 + 0.011 * z_stud - 0.0006 * (z_stud ** 2 - 1.0)\`.
   - Stockez le résultat dans \`resultat_tail = audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0)\`.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
from scipy.stats import norm, skew, kurtosis

def audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0):
    """Compare VaR et CVaR en euros (Gaussienne, Cornish-Fisher, Historique)."""
    pertes = -np.asarray(rendements, dtype=float)
    mu_L = float(np.mean(pertes))
    sig_L = float(np.std(pertes, ddof=1))
    skew_L = float(skew(pertes, bias=False))
    xkurt = float(kurtosis(pertes, fisher=True, bias=False))

    # 1. Approche Gaussienne paramétrique
    z_a = float(norm.ppf(niveau))
    var_gauss = float((mu_L + z_a * sig_L) * capital)
    cvar_gauss = float((mu_L + sig_L * norm.pdf(z_a) / (1.0 - niveau)) * capital)

    # 2. Approche Cornish-Fisher (VaR par quantile ajusté, CVaR par intégrale d'Acerbi-Tasche)
    def z_cornish_fisher(z):
        return (
            z
            + (z ** 2 - 1.0) * skew_L / 6.0
            + (z ** 3 - 3.0 * z) * xkurt / 24.0
            - (2.0 * z ** 3 - 5.0 * z) * (skew_L ** 2) / 36.0
        )

    z_cf = float(z_cornish_fisher(z_a))
    var_cf = float((mu_L + z_cf * sig_L) * capital)

    m_grid = 2000
    u_grid = niveau + (1.0 - niveau) * (np.arange(0.5, m_grid) / m_grid)
    z_cf_grid = z_cornish_fisher(norm.ppf(u_grid))
    cvar_cf = float(np.mean(mu_L + z_cf_grid * sig_L) * capital)

    # 3. Approche Historique / Empirique
    q_hist = float(np.quantile(pertes, niveau))
    var_hist = float(q_hist * capital)
    cvar_hist = float(np.mean(pertes[pertes >= q_hist]) * capital)

    return {
        'var_gauss': var_gauss,
        'cvar_gauss': cvar_gauss,
        'var_cf': var_cf,
        'cvar_cf': cvar_cf,
        'var_hist': var_hist,
        'cvar_hist': cvar_hist,
        'skewness': float(-skew_L),
        'excess_kurtosis': xkurt,
    }

np.random.seed(42)
z_stud = np.random.standard_t(df=5, size=5000)
rendements = 0.0004 + 0.011 * z_stud - 0.0006 * (z_stud ** 2 - 1.0)

resultat_tail = audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0)
print(f"Skewness rendements : {resultat_tail['skewness']:+.4f} | Excès Kurtosis : {resultat_tail['excess_kurtosis']:.4f}")
print(f"Gaussienne     -> VaR 99% : {resultat_tail['var_gauss']:,.2f} EUR | CVaR 99% : {resultat_tail['cvar_gauss']:,.2f} EUR")
print(f"Cornish-Fisher -> VaR 99% : {resultat_tail['var_cf']:,.2f} EUR | CVaR 99% : {resultat_tail['cvar_cf']:,.2f} EUR")
print(f"Historique     -> VaR 99% : {resultat_tail['var_hist']:,.2f} EUR | CVaR 99% : {resultat_tail['cvar_hist']:,.2f} EUR")`,
      testPythonCode: `assert 'audit_risque_tail' in globals() and callable(audit_risque_tail)
for k in ['var_gauss', 'cvar_gauss', 'var_cf', 'cvar_cf', 'var_hist', 'cvar_hist', 'skewness', 'excess_kurtosis']:
    assert k in resultat_tail
assert resultat_tail['cvar_gauss'] > resultat_tail['var_gauss']
assert resultat_tail['cvar_cf'] > resultat_tail['var_cf']
assert resultat_tail['cvar_hist'] > resultat_tail['var_hist']
assert resultat_tail['var_cf'] > resultat_tail['var_gauss']
assert resultat_tail['var_hist'] > resultat_tail['var_gauss']
assert np.isclose(resultat_tail['var_cf'], 529002.14, atol=50.0)
assert np.isclose(resultat_tail['cvar_cf'], 727661.24, atol=50.0)`,
      datasets: [],
      hints: [
        "Passez toujours aux pertes positives pertes = -np.asarray(rendements) : l'asymétrie des pertes vaut skew_L = float(skew(pertes, bias=False)) (> 0 ici).",
        "Pour la CVaR Cornish-Fisher, appliquez l'intégrale d'Acerbi-Tasche en moyennant mu_L + z_cornish_fisher(norm.ppf(u_grid)) * sig_L sur u_grid dans [niveau, 1[.",
        "Vérifiez que toutes les VaR et CVaR sont multipliées par capital = 10_000_000.0 et que 'skewness' vaut -skew_L."
      ],
      guide: {
        theoryToPracticeLink:
          "Sur les $5\\,000$ tirages asymétriques à queues épaisses ($S_R = -0.92$, $K_{\\text{exc}} = 4.17$), la VaR gaussienne ($337\\,405\\text{ EUR}$) sous-estime massivement la perte extrême face à l'approche historique ($453\\,588\\text{ EUR}$) et à Cornish-Fisher ($529\\,002\\text{ EUR}$). L'intégration d'Acerbi-Tasche sur la grille \`u_grid\` garantit strictement \`cvar_cf > var_cf\` ($727\\,661\\text{ EUR} > 529\\,002\\text{ EUR}$).",
        stepByStepPlan: [
          "Définir `audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0)` et convertir les rendements en pertes `pertes = -np.asarray(rendements)`.",
          "Estimer les quatre premiers moments de `pertes` (`mu_L`, `sig_L`, `skew_L`, `xkurt`).",
          "Calculer la VaR et l'ES paramétriques gaussiennes (`var_gauss`, `cvar_gauss`).",
          "Définir la correction `z_cornish_fisher(z)` puis calculer `var_cf` en `z_a` et `cvar_cf` par moyenne sur la grille `u_grid` dans `[niveau, 1[`.",
          "Calculer `var_hist` et `cvar_hist` par quantile empirique et filtrage booléen, retourner le dictionnaire complet et l'appeler sur la série simulée."
        ],
        concepts: [
          {
            symbol: "audit_risque_tail(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Moteur complet retournant le dictionnaire comparatif des $3$ méthodes de VaR/CVaR en euros."
          },
          {
            symbol: "skew(..., bias=False) / kurtosis(..., fisher=True, bias=False)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonctions \`scipy.stats\` calculant l'asymétrie et l'excès de kurtosis ($K - 3$) corrigés du biais d'échantillon."
          },
          {
            symbol: "norm.ppf / norm.pdf",
            kind: "Fonction / Méthode",
            roleInExercise: "Quantile $\\Phi^{-1}(u)$ et densité $\\varphi(z)$ de la loi normale standard nécessaires à la VaR/CVaR paramétrique et à Cornish-Fisher."
          },
          {
            symbol: "z_cornish_fisher(z)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction locale vectorisée transformant tout quantile normal $z_u$ en quantile ajusté des moments d'ordre 3 et 4."
          },
          {
            symbol: "u_grid",
            kind: "Variable",
            roleInExercise: "Grille uniforme de $2\\,000$ points dans $[\\alpha, 1[$ évaluant numériquement l'intégrale de queue d'Acerbi-Tasche."
          },
          {
            symbol: "resultat_tail",
            kind: "Variable",
            roleInExercise: "Dictionnaire résultat contenant les $8$ clés contrôlées par les assertions."
          }
        ],
        guidedCode: `import numpy as np
from scipy.stats import norm, skew, kurtosis

# Étape 1 : Fonction d'audit des queues de distribution
def audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0):
    """Compare VaR et CVaR en euros (Gaussienne, Cornish-Fisher, Historique)."""
    pertes = -np.asarray(rendements, dtype=float)
    mu_L = float(np.mean(pertes))
    sig_L = float(np.std(pertes, ddof=1))
    skew_L = float(skew(pertes, bias=False))
    xkurt = float(kurtosis(pertes, fisher=True, bias=False))

    # Gaussienne
    z_a = float(norm.ppf(niveau))
    var_gauss = float((mu_L + z_a * sig_L) * capital)
    cvar_gauss = float((mu_L + sig_L * norm.pdf(z_a) / (1.0 - niveau)) * capital)

    # Cornish-Fisher
    def z_cornish_fisher(z):
        return (
            z
            + (z ** 2 - 1.0) * skew_L / 6.0
            + (z ** 3 - 3.0 * z) * xkurt / 24.0
            - (2.0 * z ** 3 - 5.0 * z) * (skew_L ** 2) / 36.0
        )

    z_cf = float(z_cornish_fisher(z_a))
    var_cf = float((___) * capital)

    m_grid = 2000
    u_grid = niveau + (1.0 - niveau) * (np.arange(0.5, m_grid) / m_grid)
    z_cf_grid = z_cornish_fisher(norm.ppf(u_grid))
    cvar_cf = float(np.mean(___) * capital)

    # Historique
    q_hist = float(np.quantile(pertes, niveau))
    var_hist = float(q_hist * capital)
    cvar_hist = float(np.mean(pertes[___]) * capital)

    return {
        'var_gauss': var_gauss, 'cvar_gauss': cvar_gauss,
        'var_cf': var_cf, 'cvar_cf': cvar_cf,
        'var_hist': var_hist, 'cvar_hist': cvar_hist,
        'skewness': float(-skew_L), 'excess_kurtosis': xkurt,
    }

# Étape 2 : Simulation Student asymétrique et audit complet
np.random.seed(42)
z_stud = np.random.standard_t(df=5, size=5000)
rendements = 0.0004 + 0.011 * z_stud - 0.0006 * (z_stud ** 2 - 1.0)

resultat_tail = audit_risque_tail(rendements, niveau=0.99, capital=10_000_000.0)
print(resultat_tail)`
      }
    },

    // =========================================================================
    // CAS 9 : LIBRAIRIE BLACK-SCHOLES-MERTON & SOLVEUR VOLATILITÉ IMPLICITE
    // =========================================================================
    {
      id: "v3-py-9",
      title: "9. Librairie Black-Scholes-Merton : Grecs & Solveur de Volatilité Implicite",
      category: "monte_carlo",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 35,
      description:
        "Codez une librairie analytique complète Black-Scholes-Merton (prix + 5 Grecs Delta, Gamma, Vega, Theta, Rho), vérifiez la parité Call-Put et inversez la volatilité implicite par Newton-Raphson.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Équation de Black-Scholes-Merton, Grecs & Inversion de Newton

#### Intuition Économique & Quotidien d'un Desk Dérivés
Sur un marché d'options, les prix sont cotés en euros, mais les traders raisonnent et gèrent leurs livres en **volatilité implicite** ($\\sigma_{\\text{imp}}$) et en **sensibilités (Grecs)** : $\\Delta$ pour la couverture directionnelle en action, $\\Gamma$ pour la convexité du PnL, $\\mathcal{V}$ (Vega) pour l'exposition à la volatilité, $\\Theta$ pour l'érosion temporelle et $\\rho$ pour le taux sans risque. Puisqu'il n'existe pas de formule fermée inversant $C_{\\text{BS}}(\\sigma) = C_{\\text{marché}}$, on exploite la stricte positivité du Vega ($\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma} > 0$) pour appliquer la **méthode de Newton-Raphson** et converger à $10^{-8}$ près en 3 à 4 itérations !

#### Démonstration Mathématique Formelle
Sous mesure risque-neutre $\\mathbb{Q}$ ($dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$), posons :
$$d_1 = \\frac{\\ln(S/K) + (r + \\frac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}}, \\qquad d_2 = d_1 - \\sigma\\sqrt{T}$$

1. **Prix & Parité Call-Put :**
   $$C = S \\Phi(d_1) - K e^{-rT}\\Phi(d_2), \\qquad P = K e^{-rT}\\Phi(-d_2) - S\\Phi(-d_1)$$
   Grâce à $\\Phi(x) + \\Phi(-x) = 1$, la différence donne sans arbitrage $C - P = S - K e^{-rT}$.

2. **Les 5 Grecs Analytiques (avec $\\varphi(d_1) = \\frac{1}{\\sqrt{2\\pi}}e^{-d_1^2/2}$) :**
   L'identité $S \\varphi(d_1) = K e^{-rT} \\varphi(d_2)$ simplifie les dérivées en annulant les termes en $\\partial d_1$ et $\\partial d_2$ :
   $$\\Delta_{\\text{Call}} = \\Phi(d_1), \\qquad \\Delta_{\\text{Put}} = \\Phi(d_1) - 1, \\qquad \\Gamma = \\frac{\\varphi(d_1)}{S \\sigma \\sqrt{T}}, \\qquad \\mathcal{V} = S \\sqrt{T} \\varphi(d_1)$$
   $$\\Theta_{\\text{Call}} = -\\frac{S\\varphi(d_1)\\sigma}{2\\sqrt{T}} - r K e^{-rT}\\Phi(d_2), \\qquad \\rho_{\\text{Call}} = T K e^{-rT}\\Phi(d_2)$$

3. **Algorithme de Newton-Raphson pour $\\sigma_{\\text{imp}}$ :**
   En cherchant la racine de $f(\\sigma) = V_{\\text{BS}}(\\sigma) - V_{\\text{marché}} = 0$, la récurrence s'écrit :
   $$\\sigma_{k+1} = \\sigma_k - \\frac{V_{\\text{BS}}(\\sigma_k) - V_{\\text{marché}}}{\\mathcal{V}(\\sigma_k)}$$
   Sa convergence est **quadratique** ($|\\epsilon_{k+1}| \\propto |\\epsilon_k|^2$) car $V_{\\text{BS}}$ est $C^\\infty$ et quasi-linéaire en $\\sigma$ près de la monnaie.

### 💻 Masterclass Python & Ingénierie Numérique

* **Factorisation de \`sqrt_T\` et \`disc_K\` :** Calculer une seule fois \`sqrt_T = np.sqrt(T)\`, \`pdf_d1 = norm.pdf(d1)\` et \`disc_K = K * np.exp(-r * T)\` évite les calculs redondants et clarifie les formules.
* **Garde-fous du solveur itératif :** Protéger la division par \`res['vega'] < 1e-12\` (options profondément hors ou dans la monnaie) et borner \`sigma = max(1e-5, ...)\` empêche toute divergence vers des volatilités négatives.

\`\`\`python
import numpy as np
from scipy.stats import norm

# Démonstration de la convergence quadratique de Newton-Raphson sur un Call ATM
S9, K9, T9, r9, sig_vrai = 100.0, 100.0, 1.0, 0.02, 0.32
def bs_call(sig):
    d1 = (np.log(S9 / K9) + (r9 + 0.5 * sig**2) * T9) / (sig * np.sqrt(T9))
    d2 = d1 - sig * np.sqrt(T9)
    px = S9 * norm.cdf(d1) - K9 * np.exp(-r9 * T9) * norm.cdf(d2)
    vg = S9 * np.sqrt(T9) * norm.pdf(d1)
    return px, vg

c_mkt, _ = bs_call(sig_vrai)
sig_k = 0.15
for k in range(1, 6):
    px, vg = bs_call(sig_k)
    ecart = px - c_mkt
    print(f"Iter {k} : sigma={sig_k:.8f} | erreur prix={ecart:+.3e} | Vega={vg:.4f}")
    sig_k = sig_k - ecart / vg
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Iter 1 : sigma=0.15000000 | erreur prix=-6.639e+00 | Vega=39.0378
Iter 2 : sigma=0.32005636 | erreur prix=+2.193e-03 | Vega=38.9187
Iter 3 : sigma=0.32000000 | erreur prix=-4.191e-09 | Vega=38.9188
Iter 4 : sigma=0.32000000 | erreur prix=+0.000e+00 | Vega=38.9188
Iter 5 : sigma=0.32000000 | erreur prix=+0.000e+00 | Vega=38.9188
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

Implémentez la librairie Black-Scholes-Merton complète et testez-la sur un contrat \`S=100.0, K=105.0, T=0.5, r=0.03\` :

1. **Fonction \`bs_prix_grecs(S, K, T, r, sigma, option='call')\`** :
   - Supporte \`option='call'\` et \`option='put'\` (lève \`ValueError\` sinon).
   - Retourne un dictionnaire contenant exactement les 6 clés en \`float\` : \`'prix'\`, \`'delta'\`, \`'gamma'\`, \`'vega'\`, \`'theta'\` (annuel) et \`'rho'\`.
2. **Parité Call-Put (\`call_res\`, \`put_res\`, \`parite_ok\`)** :
   - Évaluez \`call_res\` et \`put_res\` pour \`sigma_ref = 0.25\`, puis vérifiez \`parite_ok = bool(np.isclose(call_res['prix'] - put_res['prix'], S - K * np.exp(-r * T), atol=1e-10))\`.
3. **Solveur \`vol_implicite_newton(prix_marche, S, K, T, r, option='call', tol=1e-8, max_iter=100)\`** :
   - Initialisez à \`sigma = 0.20\`, itérez avec le Vega analytique de \`bs_prix_grecs\`, arrêtez dès \`abs(ecart) < tol\` et retournez \`float(sigma)\`.
4. **Application sur prix coté \`prix_cote = 6.85\`** :
   - Calculez \`sigma_imp = vol_implicite_newton(prix_cote, S, K, T, r, option='call')\` et vérifiez le re-pricing exact.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
from scipy.stats import norm

def bs_prix_grecs(S, K, T, r, sigma, option='call'):
    """Calcule le prix Black-Scholes-Merton et les 5 Grecs analytiques."""
    sqrt_T = np.sqrt(T)
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * sqrt_T)
    d2 = d1 - sigma * sqrt_T
    pdf_d1 = norm.pdf(d1)
    disc_K = K * np.exp(-r * T)

    if option == 'call':
        prix = S * norm.cdf(d1) - disc_K * norm.cdf(d2)
        delta = norm.cdf(d1)
        theta = -(S * pdf_d1 * sigma) / (2.0 * sqrt_T) - r * disc_K * norm.cdf(d2)
        rho = T * disc_K * norm.cdf(d2)
    elif option == 'put':
        prix = disc_K * norm.cdf(-d2) - S * norm.cdf(-d1)
        delta = norm.cdf(d1) - 1.0
        theta = -(S * pdf_d1 * sigma) / (2.0 * sqrt_T) + r * disc_K * norm.cdf(-d2)
        rho = -T * disc_K * norm.cdf(-d2)
    else:
        raise ValueError("option doit être 'call' ou 'put'")

    gamma = pdf_d1 / (S * sigma * sqrt_T)
    vega = S * sqrt_T * pdf_d1

    return {
        'prix': float(prix),
        'delta': float(delta),
        'gamma': float(gamma),
        'vega': float(vega),
        'theta': float(theta),
        'rho': float(rho),
    }

def vol_implicite_newton(prix_marche, S, K, T, r, option='call', tol=1e-8, max_iter=100):
    """Inverse la formule BSM par la méthode de Newton-Raphson via le Vega analytique."""
    sigma = 0.20
    for _ in range(max_iter):
        res = bs_prix_grecs(S, K, T, r, sigma, option=option)
        ecart = res['prix'] - prix_marche
        if abs(ecart) < tol:
            return float(sigma)
        if res['vega'] < 1e-12:
            raise ValueError("Vega trop faible pour converger.")
        sigma = max(1e-5, sigma - ecart / res['vega'])
    return float(sigma)

S, K, T, r, sigma_ref = 100.0, 105.0, 0.5, 0.03, 0.25
call_res = bs_prix_grecs(S, K, T, r, sigma_ref, option='call')
put_res = bs_prix_grecs(S, K, T, r, sigma_ref, option='put')
parite_ok = bool(np.isclose(call_res['prix'] - put_res['prix'], S - K * np.exp(-r * T), atol=1e-10))

prix_cote = 6.85
sigma_imp = vol_implicite_newton(prix_cote, S, K, T, r, option='call')
prix_recalcule = bs_prix_grecs(S, K, T, r, sigma_imp, option='call')['prix']

print("Call BSM :", {k: round(v, 4) for k, v in call_res.items()})
print("Put  BSM :", {k: round(v, 4) for k, v in put_res.items()})
print(f"Parité Call-Put vérifiée : {parite_ok}")
print(f"Prix coté = {prix_cote:.2f} EUR -> Vol implicite = {sigma_imp:.6%} (recalcul = {prix_recalcule:.8f})")`,
      testPythonCode: `assert 'bs_prix_grecs' in globals() and 'vol_implicite_newton' in globals()
assert parite_ok is True
assert np.isclose(call_res['prix'], 5.575977, atol=1e-5)
assert np.isclose(call_res['delta'] - put_res['delta'], 1.0, atol=1e-10)
assert np.isclose(call_res['gamma'], put_res['gamma'], atol=1e-10)
assert np.isclose(call_res['vega'], put_res['vega'], atol=1e-10)
assert abs(bs_prix_grecs(100.0, 105.0, 0.5, 0.03, sigma_imp)['prix'] - 6.85) < 1e-6
assert np.isclose(sigma_imp, 0.295309, atol=1e-5)`,
      datasets: [],
      hints: [
        "Gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T)) et Vega = S * np.sqrt(T) * norm.pdf(d1) sont identiques pour le Call et le Put.",
        "Attention aux signes de Theta et Rho pour le Put : + r * disc_K * norm.cdf(-d2) pour Theta, et -T * disc_K * norm.cdf(-d2) pour Rho.",
        "Dans vol_implicite_newton, mettez à jour sigma = max(1e-5, sigma - ecart / res['vega']) jusqu'à abs(ecart) < tol."
      ],
      guide: {
        theoryToPracticeLink:
          "Les $5$ Grecs analytiques vérifient exactement les symétries de parité : $\\Delta_{\\text{Call}} - \\Delta_{\\text{Put}} = 1$, $\\Gamma_{\\text{Call}} = \\Gamma_{\\text{Put}}$ et $\\mathcal{V}_{\\text{Call}} = \\mathcal{V}_{\\text{Put}}$. L'utilisation du Vega exact $\\mathcal{V} = S\\sqrt{T}\\varphi(d_1)$ dans \`vol_implicite_newton\` retrouve $\\sigma_{\\text{imp}} = 29.5309\\%$ sur le prix coté $6.85\\text{ EUR}$ avec une erreur de réévaluation inférieure à $10^{-8}$.",
        stepByStepPlan: [
          "Implémenter `bs_prix_grecs(S, K, T, r, sigma, option='call')` avec calcul partagé de `d1`, `d2`, `pdf_d1`, `disc_K` et branche `call`/`put`.",
          "Calculer `call_res` et `put_res` à `sigma_ref = 0.25` et contrôler `parite_ok` via `np.isclose`.",
          "Implémenter `vol_implicite_newton(prix_marche, S, K, T, r, ...)` itérant par pas de Newton `-ecart / vega`.",
          "Résoudre `sigma_imp` pour `prix_cote = 6.85` et vérifier que `bs_prix_grecs(..., sigma_imp)['prix']` reproduit `6.85`."
        ],
        concepts: [
          {
            symbol: "bs_prix_grecs(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule en une passe le prix théorique BSM et les 5 Grecs analytiques retournés sous forme de dictionnaire."
          },
          {
            symbol: "d1, d2",
            kind: "Variable",
            roleInExercise: "Quantiles normalisés de Black-Scholes-Merton pilotant la probabilité risque-neutre d'exercice $\\Phi(d_2)$ et le Delta $\\Phi(d_1)$."
          },
          {
            symbol: "parite_ok",
            kind: "Variable",
            roleInExercise: "Booléen vérifiant la relation d'absence d'arbitrage $C - P = S - K e^{-rT}$ à $10^{-10}$ près."
          },
          {
            symbol: "vol_implicite_newton(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Solveur itératif de Newton-Raphson exploitant la dérivée analytique \`vega\` pour inverser le prix coté en volatilité."
          },
          {
            symbol: "tol=1e-8 / max_iter=100",
            kind: "Paramètre",
            roleInExercise: "Critère de précision de convergence sur le prix et borne de sécurité anti-boucle infinie."
          },
          {
            symbol: "sigma_imp",
            kind: "Variable",
            roleInExercise: "Volatilité implicite retrouvée ($0.295309$) reproduisant exactement le prix coté de $6.85\\text{ EUR}$."
          }
        ],
        guidedCode: `import numpy as np
from scipy.stats import norm

# Étape 1 : Fonction complète de pricing et Grecs BSM
def bs_prix_grecs(S, K, T, r, sigma, option='call'):
    """Calcule le prix Black-Scholes-Merton et les 5 Grecs analytiques."""
    sqrt_T = np.sqrt(T)
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * sqrt_T)
    d2 = d1 - sigma * sqrt_T
    pdf_d1 = norm.pdf(d1)
    disc_K = K * np.exp(-r * T)

    if option == 'call':
        prix = S * norm.cdf(d1) - disc_K * norm.cdf(d2)
        delta = norm.cdf(d1)
        theta = -(S * pdf_d1 * sigma) / (2.0 * sqrt_T) - r * disc_K * norm.cdf(d2)
        rho = T * disc_K * norm.cdf(d2)
    elif option == 'put':
        prix = ___
        delta = norm.cdf(d1) - 1.0
        theta = -(S * pdf_d1 * sigma) / (2.0 * sqrt_T) + r * disc_K * norm.cdf(-d2)
        rho = -T * disc_K * norm.cdf(-d2)
    else:
        raise ValueError("option doit être 'call' ou 'put'")

    gamma = pdf_d1 / (S * sigma * sqrt_T)
    vega = ___

    return {
        'prix': float(prix), 'delta': float(delta), 'gamma': float(gamma),
        'vega': float(vega), 'theta': float(theta), 'rho': float(rho),
    }

# Étape 2 : Solveur de volatilité implicite par Newton-Raphson
def vol_implicite_newton(prix_marche, S, K, T, r, option='call', tol=1e-8, max_iter=100):
    """Inverse la formule BSM par la méthode de Newton-Raphson via le Vega analytique."""
    sigma = 0.20
    for _ in range(max_iter):
        res = bs_prix_grecs(S, K, T, r, sigma, option=option)
        ecart = res['prix'] - prix_marche
        if abs(ecart) < tol:
            return float(sigma)
        if res['vega'] < 1e-12:
            raise ValueError("Vega trop faible pour converger.")
        sigma = max(1e-5, sigma - ___)
    return float(sigma)

# Étape 3 : Contrôle de parité Call-Put et inversion sur prix coté
S, K, T, r, sigma_ref = 100.0, 105.0, 0.5, 0.03, 0.25
call_res = bs_prix_grecs(S, K, T, r, sigma_ref, option='call')
put_res = bs_prix_grecs(S, K, T, r, sigma_ref, option='put')
parite_ok = bool(np.isclose(call_res['prix'] - put_res['prix'], ___, atol=1e-10))

prix_cote = 6.85
sigma_imp = vol_implicite_newton(prix_cote, S, K, T, r, option='call')
print(f"Parité OK : {parite_ok} | Sigma implicite (C=6.85) : {sigma_imp:.6%}")`
      }
    },

    // =========================================================================
    // CAS 10 : MODÈLE INTERNE SOLVABILITÉ II (RUINE, SCR 99.5 % & STOP-LOSS)
    // =========================================================================
    {
      id: "v3-py-10",
      title: "10. Modèle Interne Solvabilité II : Ruine Pluriannuelle, SCR 99.5 % & Stop-Loss",
      category: "monte_carlo",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 40,
      description:
        "Simulez 10 000 années de sinistralité composée Poisson x Log-Normale, chiffrez la probabilité de ruine (1 an et 5 ans) et le SCR 99.5 %, puis optimisez le capital par un traité de réassurance Stop-Loss.",
      theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Modèle Collectif Solvabilité II, Ruine & Stop-Loss

#### Intuition Économique & Pilotage du Capital Réglementaire
En assurance IARD et réassurance, la sinistralité annuelle résulte de deux sources d'aléa : combien de sinistres surviennent (fréquence) et combien coûte chacun d'eux (sévérité). Lorsque les sinistres suivent une loi **Log-Normale à queue lourde**, quelques événements extrêmes génèrent une envolée spectaculaire du quantile à $99.5\\%$ (niveau bicentenaire). Sous la Directive **Solvabilité II** (Article 101), l'assureur doit détenir des fonds propres égaux au **SCR (*Solvency Capital Requirement*)** correspondant à la Value-at-Risk à $99.5\\%$ de la perte sur un an.

Souscrire un traité de réassurance **Stop-Loss** (en excédent de perte annuel global, limitant la charge nette conservée à une rétention $R$) permet de **tronquer la queue droite**, d'abaisser massivement le SCR et de réduire le risque de ruine sur un horizon pluriannuel !

#### Démonstration Mathématique Formelle
1. **Modèle Collectif du Risque :**
   La charge annuelle agrégée est $S = \\sum_{j=1}^{N} X_j$, avec $N \\sim \\text{Poisson}(\\lambda)$ indépendant des sévérités $X_j \\stackrel{\\text{i.i.d.}}{\\sim} \\text{LogNormal}(\\mu_{\\ln}, \\sigma_{\\ln})$ :
   $$\\mathbb{E}[X] = \\exp\\left(\\mu_{\\ln} + \\frac{\\sigma_{\\ln}^2}{2}\\right), \\qquad \\mathbb{E}[S] = \\lambda \\mathbb{E}[X], \\qquad \\operatorname{Var}(S) = \\lambda \\mathbb{E}[X^2]$$

2. **Capital de Solvabilité Requis (SCR 99.5 %) :**
   En mesurant l'écart inattendu au-dessus du *Best Estimate* $\\mathbb{E}[S]$ :
   $$\\text{SCR}_{99.5\\%} = Q_{0.995}(S) - \\mathbb{E}[S]$$

3. **Processus de Surplus de Cramér-Lundberg & Ruine Pluriannuelle :**
   Partant de réserves initiales $U_0$ et encaissant des primes annuelles $P$, le surplus à la fin de l'année $t \\in \\{1, \\dots, H\\}$ vaut $U_t = U_0 + \\sum_{k=1}^t (P - S_k)$. Il y a **ruine sur l'horizon $H$** si $\\min_{1 \\le t \\le H} U_t < 0$ (et ruine à $1$ an si $S_1 > U_0 + P$).

4. **Effet d'un Traité Stop-Loss de Rétention $R$ :**
   La charge nette conservée par la cédante est $S_{\\text{net}} = \\min(S, R)$, la cession au réassureur vaut $(S - R)^+ = \\max(S - R, 0)$, facturée avec un chargement $\\theta = 25\\%$ soit $P_{\\text{réass}} = (1 + \\theta)\\mathbb{E}[(S - R)^+]$.

### 💻 Masterclass Python & Ingénierie Monte Carlo

* **Simulation composée sécurisée :** Dans \`[np.random.lognormal(mu_ln, sig_ln, size=n).sum() if n > 0 else 0.0 for n in frequences]\`, tester \`if n > 0\` protège le cas où une année tire $0$ sinistre et accélère les tirages.
* **Ruine pluriannuelle sans boucle :** En remodelant les $10\\,000$ années indépendantes en $2\\,000$ trajectoires de $5$ ans via \`.reshape(2000, 5)\`, \`np.cumsum(primes - trajectoires, axis=1)\` calcule toutes les trajectoires de surplus instantanément !
* **Vectorisation Stop-Loss :** \`np.minimum(charges_brutes, retention)\` écrête les $10\\,000$ scénarios en une opération C.

\`\`\`python
import numpy as np

# Démonstration : à espérance égale, la sévérité Log-Normale fait exploser le SCR 99.5% vs Poisson pur
np.random.seed(7)
N_ex10, lam_ex10, mu_s, sig_s = 5000, 20.0, 10.0, 1.0
esp_sev = np.exp(mu_s + 0.5 * sig_s ** 2)
freqs10 = np.random.poisson(lam_ex10, size=N_ex10)

charge_det = freqs10 * esp_sev
charge_ln = np.array([np.random.lognormal(mu_s, sig_s, size=n).sum() if n > 0 else 0.0 for n in freqs10])

scr_det = np.quantile(charge_det, 0.995) - np.mean(charge_det)
scr_ln = np.quantile(charge_ln, 0.995) - np.mean(charge_ln)

print(f"Espérance -> Déterministe={charge_det.mean():,.0f} EUR | LogNormale={charge_ln.mean():,.0f} EUR")
print(f"SCR 99.5% -> Poisson pur={scr_det:,.0f} EUR | Poisson x LogNormale={scr_ln:,.0f} EUR (x{scr_ln/scr_det:.2f})")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Espérance -> Déterministe=726,078 EUR | LogNormale=722,422 EUR
SCR 99.5% -> Poisson pur=472,334 EUR | Poisson x LogNormale=893,693 EUR (x1.89)
\`\`\`
      `,
      taskMarkdown: `**🎯 Laboratoire Pratique :**

Construisez le modèle interne Solvabilité II complet et mesurez l'impact d'un traité Stop-Loss sur le SCR et la probabilité de ruine :

1. **Simulation composée (\`simuler_charges_annuelles\`)** :
   - Écrivez \`simuler_charges_annuelles(n_sim=10_000, lam=25.0, mu_ln=10.0, sigma_ln=1.1, seed=42)\` générant \`charges_brutes\` ($10\\,000$ années Poisson $\\times$ Log-Normale).
2. **Paramètres bilan & Risque Brut** :
   - Fixez \`capital_initial = 350_000.0\`, \`primes_annuelles = 1_100_000.0\`, \`retention = 1_200_000.0\`.
   - Calculez \`charge_moyenne_brut\`, \`prob_ruine_brut\` (1 an : \`charges_brutes > capital_initial + primes_annuelles\`), \`prob_ruine_5ans_brut\` (sur \`charges_brutes.reshape(2000, 5)\`) et \`scr_brut = float(np.quantile(charges_brutes, 0.995) - charge_moyenne_brut)\`.
3. **Réassurance Stop-Loss & Gain de Capital** :
   - Calculez \`charges_nettes = np.minimum(charges_brutes, retention)\` et la prime cédée \`prime_reassurance = float(np.mean(charges_brutes - charges_nettes) * 1.25)\`.
   - Calculez \`scr_net\`, \`prob_ruine_nette\`, \`prob_ruine_5ans_nette\` (avec primes nettes \`primes_annuelles - prime_reassurance\`) et \`reduction_scr_pct = float((scr_brut - scr_net) / scr_brut * 100.0)\`.
4. **Histogramme Matplotlib** : comparez les distributions brute et nette avec les deux lignes \`VaR 99.5%\`.`,
      initialCode: "# Rédigez votre script complet ci-dessous :\n",
      solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def simuler_charges_annuelles(n_sim=10_000, lam=25.0, mu_ln=10.0, sigma_ln=1.1, seed=42):
    """Simule N années de sinistralité composée Poisson(lam) x LogNormale(mu_ln, sigma_ln)."""
    np.random.seed(seed)
    frequences = np.random.poisson(lam, size=n_sim)
    return np.array([
        np.random.lognormal(mu_ln, sigma_ln, size=n).sum() if n > 0 else 0.0
        for n in frequences
    ], dtype=float)

charges_brutes = simuler_charges_annuelles(n_sim=10_000, lam=25.0, mu_ln=10.0, sigma_ln=1.1, seed=42)

capital_initial = 350_000.0
primes_annuelles = 1_100_000.0
retention = 1_200_000.0

charge_moyenne_brut = float(np.mean(charges_brutes))
prob_ruine_brut = float(np.mean(charges_brutes > capital_initial + primes_annuelles))
scr_brut = float(np.quantile(charges_brutes, 0.995) - charge_moyenne_brut)

# Ruine pluriannuelle sur 2 000 trajectoires de 5 ans
trajectoires_brut = charges_brutes.reshape(2000, 5)
reserves_brut = capital_initial + np.cumsum(primes_annuelles - trajectoires_brut, axis=1)
prob_ruine_5ans_brut = float(np.mean(np.min(reserves_brut, axis=1) < 0.0))

# Traité Stop-Loss global avec chargement de réassurance de 25 %
charges_nettes = np.minimum(charges_brutes, retention)
cessions = charges_brutes - charges_nettes
prime_reassurance = float(np.mean(cessions) * 1.25)

scr_net = float(np.quantile(charges_nettes, 0.995) - np.mean(charges_nettes))
prob_ruine_nette = float(np.mean(charges_nettes > capital_initial + primes_annuelles - prime_reassurance))
trajectoires_net = charges_nettes.reshape(2000, 5)
reserves_net = capital_initial + np.cumsum((primes_annuelles - prime_reassurance) - trajectoires_net, axis=1)
prob_ruine_5ans_nette = float(np.mean(np.min(reserves_net, axis=1) < 0.0))

reduction_scr_pct = float((scr_brut - scr_net) / scr_brut * 100.0)

plt.figure(figsize=(6.5, 3.8))
plt.hist(charges_brutes / 1e6, bins=60, range=(0, 3.5), alpha=0.55, color='#e11d48', label='Charge Brute')
plt.hist(charges_nettes / 1e6, bins=60, range=(0, 3.5), alpha=0.65, color='#0284c7', label='Charge Nette (Stop-Loss 1.2M)')
plt.axvline(np.quantile(charges_brutes, 0.995) / 1e6, color='#9f1239', ls='--', lw=1.8, label='VaR 99.5% Brute')
plt.axvline(np.quantile(charges_nettes, 0.995) / 1e6, color='#0369a1', ls=':', lw=2.0, label='VaR 99.5% Nette')
plt.xlabel('Charge annuelle de sinistres (M EUR)')
plt.ylabel('Nombre de scénarios')
plt.title(f'Modèle Interne Solvabilité II : Réduction SCR = {reduction_scr_pct:.1f}%')
plt.legend(fontsize=8)
plt.grid(True, alpha=0.3)

print(f"Brut -> Moyenne : {charge_moyenne_brut:,.2f} EUR | SCR 99.5% : {scr_brut:,.2f} EUR")
print(f"Brut -> Ruine 1 an : {prob_ruine_brut:.2%} | Ruine 5 ans : {prob_ruine_5ans_brut:.2%}")
print(f"Stop-Loss (rétention 1.2M, prime {prime_reassurance:,.2f} EUR) -> SCR Net : {scr_net:,.2f} EUR")
print(f"Net  -> Ruine 1 an : {prob_ruine_nette:.2%} | Ruine 5 ans : {prob_ruine_5ans_nette:.2%}")
print(f"Gain de réduction du SCR : {reduction_scr_pct:.2f}%")`,
      testPythonCode: `assert 'simuler_charges_annuelles' in globals() and len(charges_brutes) == 10_000
assert np.isclose(charge_moyenne_brut, 1006778.67, atol=10.0)
assert np.isclose(scr_brut, 1233246.89, atol=10.0)
assert np.isclose(prob_ruine_brut, 0.1035, atol=1e-4)
assert np.isclose(scr_net, 264780.59, atol=10.0)
assert np.isclose(reduction_scr_pct, 78.53, atol=0.1)
assert prob_ruine_nette < prob_ruine_brut
assert prob_ruine_5ans_nette < prob_ruine_5ans_brut`,
      datasets: [],
      hints: [
        "Dans simuler_charges_annuelles, appelez np.random.seed(seed), tirez frequences = np.random.poisson(lam, size=n_sim), puis sommez np.random.lognormal(mu_ln, sigma_ln, size=n) si n > 0.",
        "Pour la ruine à 5 ans sans boucle, reshapez charges_brutes en (2000, 5) et utilisez np.cumsum(..., axis=1) puis np.min(..., axis=1) < 0.0.",
        "Le Stop-Loss tronque via np.minimum(charges_brutes, 1_200_000.0) et prime_reassurance vaut np.mean(charges_brutes - charges_nettes) * 1.25."
      ],
      guide: {
        theoryToPracticeLink:
          "La combinaison Poisson($\\lambda=25$) $\\times$ Log-Normale($10.0, 1.1$) génère une espérance de $1\\,006\\,779\\text{ EUR}$ mais une VaR $99.5\\%$ de $2\\,240\\,026\\text{ EUR}$, soit un SCR brut de $1\\,233\\,247\\text{ EUR}$ et $10.35\\%$ de ruine à 1 an ($27.85\\%$ sur 5 ans). Le traité Stop-Loss à $1.2\\text{ M EUR}$ (coûtant $89\\,449\\text{ EUR}$) ramène le SCR net à $264\\,781\\text{ EUR}$, soit **$78.53\\%$ de réduction de capital** !",
        stepByStepPlan: [
          "Implémenter `simuler_charges_annuelles(n_sim=10_000, lam=25.0, mu_ln=10.0, sigma_ln=1.1, seed=42)`.",
          "Calculer en brut `charge_moyenne_brut`, `prob_ruine_brut` (1 an), `prob_ruine_5ans_brut` (via `.reshape(2000, 5)` et `np.cumsum`) et `scr_brut`.",
          "Appliquer le Stop-Loss via `np.minimum(charges_brutes, retention)` et chiffrer `prime_reassurance` avec un chargement de $25\\%$.",
          "Recalculer `scr_net`, `prob_ruine_nette`, `prob_ruine_5ans_nette` et le gain `reduction_scr_pct`.",
          "Tracer les histogrammes brut vs net avec les seuils VaR $99.5\\%$ dans Matplotlib."
        ],
        concepts: [
          {
            symbol: "simuler_charges_annuelles(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Générateur de scénarios composés Poisson-LogNormale retournant un vecteur NumPy de $10\\,000$ charges annuelles."
          },
          {
            symbol: "np.random.poisson / np.random.lognormal",
            kind: "Fonction / Méthode",
            roleInExercise: "Tirent respectivement le nombre annuel de sinistres ($\\lambda=25$) et leurs montants individuels à queue lourde."
          },
          {
            symbol: ".reshape(2000, 5) & np.cumsum(..., axis=1)",
            kind: "Fonction / Méthode",
            roleInExercise: "Simule $2\\,000$ trajectoires de réserves sur $5$ ans sans boucle Python pour détecter la ruine pluriannuelle."
          },
          {
            symbol: "np.minimum(charges_brutes, retention)",
            kind: "Fonction / Méthode",
            roleInExercise: "Modélise exactement le plafond contractuel d'un traité Stop-Loss global à $1.2\\text{ M EUR}$."
          },
          {
            symbol: "scr_brut / scr_net",
            kind: "Variable",
            roleInExercise: "Capital Solvabilité II ($Q_{0.995} - \\mathbb{E}[S]$) avant ($1.23\\text{ M EUR}$) et après réassurance ($0.26\\text{ M EUR}$)."
          },
          {
            symbol: "reduction_scr_pct",
            kind: "Variable",
            roleInExercise: "Pourcentage d'économie de capital réglementaire apporté par le traité Stop-Loss ($78.53\\%$)."
          }
        ],
        guidedCode: `import numpy as np
import matplotlib.pyplot as plt

# Étape 1 : Fonction de simulation Fréquence-Sévérité (Poisson x LogNormale)
def simuler_charges_annuelles(n_sim=10_000, lam=25.0, mu_ln=10.0, sigma_ln=1.1, seed=42):
    """Simule N années de sinistralité composée Poisson(lam) x LogNormale(mu_ln, sigma_ln)."""
    np.random.seed(seed)
    frequences = np.random.poisson(lam, size=n_sim)
    return np.array([
        np.random.lognormal(mu_ln, sigma_ln, size=n).sum() if n > 0 else 0.0
        for n in frequences
    ], dtype=float)

charges_brutes = simuler_charges_annuelles(n_sim=10_000, lam=25.0, mu_ln=10.0, sigma_ln=1.1, seed=42)

# Étape 2 : Risque brut (Moyenne, Ruine 1 an & 5 ans, SCR 99.5%)
capital_initial = 350_000.0
primes_annuelles = 1_100_000.0
retention = 1_200_000.0

charge_moyenne_brut = float(np.mean(charges_brutes))
prob_ruine_brut = float(np.mean(charges_brutes > ___))
scr_brut = float(np.quantile(charges_brutes, 0.995) - ___)

trajectoires_brut = charges_brutes.reshape(2000, 5)
reserves_brut = capital_initial + np.cumsum(primes_annuelles - trajectoires_brut, axis=1)
prob_ruine_5ans_brut = float(np.mean(np.min(reserves_brut, axis=1) < 0.0))

# Étape 3 : Traité Stop-Loss et mesure du gain SCR / Ruine
charges_nettes = np.minimum(charges_brutes, ___)
cessions = charges_brutes - charges_nettes
prime_reassurance = float(np.mean(cessions) * 1.25)

scr_net = float(np.quantile(charges_nettes, 0.995) - np.mean(charges_nettes))
prob_ruine_nette = float(np.mean(charges_nettes > capital_initial + primes_annuelles - prime_reassurance))
trajectoires_net = charges_nettes.reshape(2000, 5)
reserves_net = capital_initial + np.cumsum((primes_annuelles - prime_reassurance) - trajectoires_net, axis=1)
prob_ruine_5ans_nette = float(np.mean(np.min(reserves_net, axis=1) < 0.0))

reduction_scr_pct = float(___)

# Étape 4 : Distribution Brute vs Nette Stop-Loss
plt.figure(figsize=(6.5, 3.8))
plt.hist(charges_brutes / 1e6, bins=60, range=(0, 3.5), alpha=0.55, color='#e11d48', label='Charge Brute')
plt.hist(charges_nettes / 1e6, bins=60, range=(0, 3.5), alpha=0.65, color='#0284c7', label='Charge Nette (Stop-Loss 1.2M)')
plt.axvline(np.quantile(charges_brutes, 0.995) / 1e6, color='#9f1239', ls='--', lw=1.8, label='VaR 99.5% Brute')
plt.axvline(np.quantile(charges_nettes, 0.995) / 1e6, color='#0369a1', ls=':', lw=2.0, label='VaR 99.5% Nette')
plt.xlabel('Charge annuelle (M EUR)')
plt.ylabel('Fréquence')
plt.title(f'Solvabilité II : Réduction SCR = {reduction_scr_pct:.1f}%')
plt.legend(fontsize=8)
plt.grid(True, alpha=0.3)

print(f"SCR Brut : {scr_brut:,.2f} EUR | SCR Net : {scr_net:,.2f} EUR | Réduction : {reduction_scr_pct:.2f}%")`
      }
    },
  ],
};
