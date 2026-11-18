import { CourseModule } from "@/types/course";

export const PYTHON_ECONOMETRIE_MODULE: CourseModule = {
    id: "python-econometrie",
    title: "Python pour l'Économétrie, Risque & Pricing",
    subtitle: "MCO, Régression Multiple, Programmation Statistique & Séries Temporelles ALM",
    icon: "TrendingUp",
    description: "Apprentissage progressif de l'économétrie théorique et pratique : algèbre matricielle NumPy, modélisation OLS avec Statsmodels, décryptage complet du summary économétrique, diagnostics de résidus et séries temporelles ALM.",
    exercises: [
      {
        id: "py-1",
        title: "1. Inspection des données Pandas (.head)",
        category: "data_prep",
        language: "python",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Affichez les 3 premières lignes du DataFrame macroéconomique 'df'.",
        theoryMarkdown: `
### Exploration d'un Panel Macroéconomique & Valeur Temps de l'Argent (.head)

> 💡 **Intuition économique & ALM : Pourquoi inspecter les taux avant de modéliser ?**
> 
> En finance quantitative et en gestion actif-passif (ALM), un euro reçu demain vaut moins qu'un euro détenu aujourd'hui : c'est le principe fondamental de la **Valeur Temps de l'Argent** (*Time Value of Money*).
> - **Capitalisation** d'un capital $V_0$ placé au taux annuel $r$ sur $T$ années :
>
> $$V_T = V_0 (1 + r)^T \\quad (\\text{et en temps continu : } V_T = V_0 e^{rT})$$
>
> - **Actualisation** (*Best Estimate* d'un flux futur $CF_T$ au bilan d'un assureur ou d'une banque) :
>
> $$V_0 = \\frac{CF_T}{(1 + r)^T} = CF_T \\cdot (1 + r)^{-T}$$
>
> Dans notre dataset macroéconomique \`df\`, la colonne \`oat_10y\` représente précisément ce taux sans risque souverain à 10 ans. Une seule erreur d'unité (ex : $3.10$ saisi en points de pourcentage vs $0.031$ en décimal) ou une valeur corrompue fausserait immédiatement la valorisation actualisée de milliards d'euros d'engagements ! D'où l'inspection systématique des premières lignes avec \`.head()\`.

#### 💻 Masterclass Code : Bases Python (Variables, Listes, Dictionnaires) & Pont vers Pandas

Avant de manipuler des tableaux \`DataFrame\`, maîtrisez les trois briques natives de Python :
- **Variables & typage dynamique** (\`float\`, \`int\`, \`str\`) pour stocker taux, maturités et libellés.
- **Listes (\`list\`)** ordonnées et indexables (\`taux[-1]\` lit le dernier élément).
- **Dictionnaires (\`dict\`)** associant des clés textuelles à des valeurs : un \`pd.DataFrame\` est conceptuellement un dictionnaire de colonnes alignées sur un index commun, et \`df.head(n)\` extrait les $n$ premières lignes sans saturer l'affichage.

\`\`\`python
import pandas as pd

# 1. Variables & typage dynamique (Valeur Temps de l'Argent)
flux_terminal = 10_000.0   # float : capital à recevoir dans T ans
maturite = 10              # int : horizon en années
nom_actif = 'OAT 10 ans'   # str : libellé textuel

# 2. Liste ordonnée [ ] et Dictionnaire clé -> valeur { }
taux_recents = [2.95, 3.15, 3.40, 3.10]  # taux 2023-Q1 à 2023-Q4 (en %)
taux_2023_q4 = taux_recents[-1] / 100.0  # index -1 = dernier élément -> 0.031
contrat = {'actif': nom_actif, 'flux': flux_terminal, 'T': maturite}

# Actualisation : V_0 = CF / (1 + r)^T
valeur_actuelle = contrat['flux'] / ((1.0 + taux_2023_q4) ** contrat['T'])
print(f"VA({contrat['actif']}, r={taux_2023_q4*100:.2f}%) = {valeur_actuelle:,.2f} EUR")

# 3. Pont vers Pandas : inspection rapide des 3 premières lignes de df
print("Colonnes du DataFrame :", list(df.columns))
print(df[['periode', 'euribor_3m', 'oat_10y', 'inflation_hicp']].head(3))
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
VA(OAT 10 ans, r=3.10%) = 7,369.08 EUR
Colonnes du DataFrame : ['periode', 'euribor_3m', 'oat_10y', 'spread_credit_bbb', 'inflation_hicp', 'pib_croissance', 'cac40_rendement']
   periode  euribor_3m  oat_10y  inflation_hicp
0  2020-Q1       -0.42    -0.15             0.7
1  2020-Q2       -0.38    -0.08             0.3
2  2020-Q3       -0.48    -0.22             0.2
\`\`\`

On observe immédiatement que les taux sont exprimés en **pourcentage** (ex : \`-0.42\` signifie $-0.42\\%$, régime de taux négatifs de 2020) et qu'au taux OAT de fin 2023 ($3.10\\%$), $10\\,000\\text{ EUR}$ reçus dans $10$ ans ne valent aujourd'hui que $7\\,369.08\\text{ EUR}$.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
À partir des taux de \`2020-Q1\` (\`oat_10y = -0.15 %\`) et \`2023-Q4\` (\`oat_10y = 3.10 %\`), comprenez pourquoi une hausse des taux d'actualisation réduit mécaniquement la valeur actuelle $V_0 = CF_T / (1 + r)^T$ des flux futurs, et pourquoi vérifier l'unité des colonnes (pourcentages vs décimales) est obligatoire avant tout calcul.

**Volet 2 — Laboratoire Code Python :**
Importez \`pandas as pd\` et affichez les 3 premières lignes du DataFrame \`df\` à l'aide de \`print(df.head(3))\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import pandas as pd\nprint(df.head(3))",
        testPythonCode: "assert len(df) > 0, 'df ne doit pas être vide.'",
        hints: ["Utilisez : print(df.head(3))"],
        datasets: []
      },
      {
        id: "py-2",
        title: "2. Dimensions et Degrés de Liberté (.shape)",
        category: "data_prep",
        language: "python",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Extrayez le nombre d'observations T et le nombre de variables K.",
        theoryMarkdown: `
### Dimensions, Actualisation Multi-Flux et Degrés de Liberté (.shape)

> 💡 **Fondements mathématiques : Échéancier de flux & Inversibilité de $(X'X)$**
> 
> En gestion actif-passif (ALM), un engagement ou une obligation verse une séquence de $T$ flux futurs $(CF_1, \\dots, CF_T)$ dont la valeur actuelle s'écrit :
>
> $$V_0 = \\sum_{t=1}^T \\frac{CF_t}{(1 + r)^t}$$
>
> Lorsque nous passons à l'économétrie avec $T$ observations temporelles et $K$ variables explicatives (plus une constante, soit $K + 1$ paramètres à estimer), l'identification unique de l'estimateur MCO $\\hat{\\beta} = (X'X)^{-1}X'y$ exige que la matrice $X \\in \\mathbb{R}^{T \\times (K+1)}$ soit de **plein rang colonne** ($\\operatorname{rang}(X) = K + 1$). Une condition algébrique nécessaire pour éviter un système sous-déterminé et conserver une variance résiduelle estimable $\\hat{\\sigma}^2 = \\frac{SCR}{T - K - 1}$ est :
>
> $$\\nu = \\text{Degrés de liberté} = T - K - 1 > 0 \\iff T > K + 1$$
>
> Si $T \\le K + 1$, la matrice $(X'X)$ est singulière ($\\det(X'X) = 0$) : il existe une infinité de droites passant exactement par les points sans aucune capacité de test statistique. En pratique ALM, on vise $T \\ge 10(K + 1)$ pour garantir la stabilité des estimateurs.

#### 💻 Masterclass Code : Fonctions Python (\`def\` / \`return\`), Tuples & Décompactage

Une fonction Python (\`def\`) encapsule un calcul financier réutilisable et retourne un résultat via \`return\`. Par ailleurs, l'attribut \`df.shape\` renvoie un **tuple** immuable \`(T_lignes, K_colonnes)\` que l'on peut décompacter directement en deux variables (\`T_obs, K_cols = df.shape\`).

\`\`\`python
# 1. Définition d'une fonction réutilisable avec def / return
def actualiser_echeancier(flux_liste, taux_annuel):
    '''Calcule la somme actualisée V_0 = sum(CF_t / (1 + r)^t).'''
    somme_va = 0.0
    for t, flux in enumerate(flux_liste, start=1):  # t = 1, 2, 3...
        somme_va += flux / ((1.0 + taux_annuel) ** t)
    return somme_va

# Obligation 3 ans : coupons 1 000 EUR, nominal 10 000 EUR au taux 3.10 %
va_obligation = actualiser_echeancier([1000.0, 1000.0, 11000.0], 0.031)
print(f"Valeur actuelle de l'échéancier : {va_obligation:,.2f} EUR")

# 2. Tuple (T, K) retourné par df.shape et décompactage (unpacking)
T_obs, K_cols = df.shape
nb_regresseurs = 2  # ex : euribor_3m et inflation_hicp
ddl = T_obs - nb_regresseurs - 1
print(f"Dimensions df : ({T_obs}, {K_cols}) -> ddl avec K={nb_regresseurs} : {ddl}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Valeur actuelle de l'échéancier : 11,948.00 EUR
Dimensions df : (16, 7) -> ddl avec K=2 : 13
\`\`\`

Avec $T = 16$ trimestres et $K = 2$ régresseurs (plus constante), il reste $\\nu = 16 - 2 - 1 = 13$ degrés de liberté pour les tests de Student et de Fisher.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Identifiez le nombre d'observations $T$ et le nombre de colonnes de \`df\`. Avec $K = 2$ variables explicatives et une constante, vérifiez mentalement que les degrés de liberté $\\nu = T - K - 1$ restent strictement positifs.

**Volet 2 — Laboratoire Code Python :**
Stockez le tuple \`df.shape\` dans la variable exacte \`dimensions\` et affichez-la avec \`print('Dimensions :', dimensions)\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "dimensions = df.shape\nprint('Dimensions :', dimensions)",
        testPythonCode: "assert 'dimensions' in globals(), 'La variable dimensions doit exister.'\nassert len(dimensions) == 2, 'dimensions doit être un tuple de taille 2.'",
        hints: ["dimensions = df.shape"],
        datasets: []
      },
      {
        id: "py-3",
        title: "3. Espérance et Volatilité (.mean, .std)",
        category: "data_prep",
        language: "python",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Calculez la moyenne empirique et l'écart-type de l'OAT 10 ans.",
        theoryMarkdown: `
### Moments d'Ordre 1 et 2 : Démonstration de Bessel (.mean, .std)

> 💡 **Démonstration formelle : Pourquoi diviser la variance empirique par $T - 1$ ?**
> 
> Soit un échantillon i.i.d. $(y_1, \\dots, y_T)$ d'espérance $\\mu$ et de variance $\\sigma^2$. L'espérance empirique est $\\bar{y} = \\frac{1}{T} \\sum_{t=1}^T y_t$, avec $\\mathbb{E}[\\bar{y}] = \\mu$ et $\\operatorname{Var}(\\bar{y}) = \\frac{\\sigma^2}{T}$.
> Décomposons la somme des carrés centrés autour de $\\bar{y}$ en introduisant $\\mu$ :
>
> $$\\sum_{t=1}^T (y_t - \\bar{y})^2 = \\sum_{t=1}^T \\big[(y_t - \\mu) - (\\bar{y} - \\mu)\\big]^2 = \\sum_{t=1}^T (y_t - \\mu)^2 - T(\\bar{y} - \\mu)^2$$
>
> En prenant l'espérance mathématique des deux membres :
>
> $$\\mathbb{E}\\left[\\sum_{t=1}^T (y_t - \\bar{y})^2\\right] = \\sum_{t=1}^T \\operatorname{Var}(y_t) - T \\operatorname{Var}(\\bar{y}) = T\\sigma^2 - T\\left(\\frac{\\sigma^2}{T}\\right) = (T - 1)\\sigma^2$$
>
> Par conséquent, l'estimateur corrigé de **Bessel** $s^2 = \\frac{1}{T - 1} \\sum_{t=1}^T (y_t - \\bar{y})^2$ est **strictement sans biais** ($\\mathbb{E}[s^2] = \\sigma^2$), alors que diviser par $T$ sous-estimerait systématiquement le risque de taux ($\\text{volatilité}$) d'un facteur $\\frac{T-1}{T}$. En ALM, sous-estimer la volatilité de l'\`oat_10y\` revient à sous-provisionner le risque de dérive des taux d'actualisation !

#### 💻 Masterclass Code : Compréhensions Python vs Vectorisation Pandas (\`ddof=1\`)

Comparez le calcul en pur Python via une **compréhension de liste** à l'API Pandas. Piège classique d'ingénierie : \`.std()\` dans **Pandas** utilise par défaut \`ddof=1\` (diviseur $T-1$, sans biais), tandis que \`np.std()\` dans **NumPy** utilise par défaut \`ddof=0\` (diviseur $T$, biaisé sur petit échantillon).

\`\`\`python
import numpy as np

# 1. Fonction Python manuelle avec compréhension de liste et correction de Bessel (T - 1)
def moments_bessel(valeurs):
    T = len(valeurs)
    moyenne = sum(valeurs) / T
    variance = sum((y - moyenne) ** 2 for y in valeurs) / (T - 1)
    return moyenne, variance ** 0.5

moy_py, std_py = moments_bessel(df['oat_10y'].tolist())

# 2. Équivalent vectorisé Pandas (ddof=1 par défaut) vs NumPy (ddof=0 par défaut)
moy_pd = df['oat_10y'].mean()
std_pd = df['oat_10y'].std()               # diviseur T - 1 (sans biais)
std_np_biaise = np.std(df['oat_10y'].values)  # attention : diviseur T !

print(f"Python pur -> moyenne: {moy_py:.4f} %, écart-type (T-1): {std_py:.4f} %")
print(f"Pandas     -> .mean(): {moy_pd:.4f} %, .std(ddof=1): {std_pd:.4f} %")
print(f"NumPy ddof=0 (biaisé): {std_np_biaise:.4f} %")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Python pur -> moyenne: 1.2931 %, écart-type (T-1): 1.5246 %
Pandas     -> .mean(): 1.2931 %, .std(ddof=1): 1.5246 %
NumPy ddof=0 (biaisé): 1.4762 %
\`\`\`

Sur \`T = 16\` observations, l'oubli de la correction de Bessel (\`ddof=0\`) sous-estime la volatilité réelle de l'OAT (\`1.4762 %\` au lieu de \`1.5246 %\`).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez pourquoi le diviseur $T - 1$ (et non $T$) garantit $\\mathbb{E}[s^2] = \\sigma^2$ et pourquoi le calcul correct de l'écart-type de \`oat_10y\` conditionne la mesure du risque d'actualisation en ALM.

**Volet 2 — Laboratoire Code Python :**
Calculez et stockez exactement les deux variables suivantes : \`oat_moyenne = df['oat_10y'].mean()\` et \`oat_volatilite = df['oat_10y'].std()\`, puis affichez-les.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "oat_moyenne = df['oat_10y'].mean()\noat_volatilite = df['oat_10y'].std()\nprint(f'Moyenne OAT : {oat_moyenne:.3f} % | Volatilité : {oat_volatilite:.3f} %')",
        testPythonCode: "assert 'oat_moyenne' in globals() and 'oat_volatilite' in globals()\nassert oat_volatilite > 0",
        hints: ["Utilisez df['oat_10y'].mean() et df['oat_10y'].std()"],
        datasets: []
      },
      {
        id: "py-4",
        title: "4. Médiane et Quantiles Empiriques (.quantile)",
        category: "data_prep",
        language: "python",
        difficulty: "Débutant",
        durationMinutes: 6,
        description: "Calculez la médiane et le 95ème percentile de l'inflation.",
        theoryMarkdown: `
### Statistiques d'Ordre, Quantiles Empiriques & Risque Extrême (.quantile)

> 💡 **Définition formelle & Lien Actuariat : VaR Historique et Expected Shortfall**
> 
> Soit $(X_{(1)} \\le X_{(2)} \\le \\dots \\le X_{(T)})$ les statistiques d'ordre de l'échantillon et $F_T(x) = \\frac{1}{T}\\sum_{t=1}^T \\mathbf{1}_{\\{X_t \\le x\\}}$ la fonction de répartition empirique. Le **quantile d'ordre $\\alpha \\in [0, 1]$** est l'inverse généralisée :
>
> $$q_\\alpha = \\inf\\{x \\in \\mathbb{R} : F_T(x) \\ge \\alpha\\}$$
>
> En pratique, pour un niveau $\\alpha$ entre deux rangs discrets, Pandas interpole linéairement entre $X_{(k)}$ et $X_{(k+1)}$ pour $h = \\alpha(T - 1)$ et $k = \\lfloor h \\rfloor$.
> - **Médiane ($\\alpha = 0.50$)** : insensible aux valeurs aberrantes (point de rupture $50\\%$), elle décrit le régime central mieux que la moyenne lorsque la distribution est asymétrique.
> - **Quantile extrême ($\\alpha = 0.95$ ou $0.995$)** : fondement de la **Value-at-Risk (VaR) historique** et de l'**Expected Shortfall** ($\\text{ES}_\\alpha = \\mathbb{E}[X \\mid X \\ge q_\\alpha]$), utilisé en actuariat et ALM pour calibrer le coût des contrats ou rentes indexés sur l'inflation.

#### 💻 Masterclass Code : Tri Python (\`sorted\`), Dictionnaires & Méthodes \`.median()\` / \`.quantile()\`

En Python pur, \`sorted()\` trie une liste en $\\mathcal{O}(T \\log T)$. Pandas automatise le calcul des quantiles et permet d'isoler la queue de distribution par filtrage booléen \`serie[serie >= q95]\` pour calculer l'Expected Shortfall.

\`\`\`python
# 1. Statistiques d'ordre en Python pur avec sorted() sur une liste
inf_triee = sorted(df['inflation_hicp'].tolist())
print("Plus faibles et plus fortes inflations :", inf_triee[:2], "...", inf_triee[-2:])

# 2. Dictionnaire récapitulatif et méthodes Pandas (.median, .quantile)
serie_inf = df['inflation_hicp']
stats_inf = {
    'moyenne': round(float(serie_inf.mean()), 2),
    'mediane': round(float(serie_inf.median()), 2),
    'q95': round(float(serie_inf.quantile(0.95)), 2),
}
# Expected Shortfall (moyenne conditionnelle au-delà de la VaR 95 %)
es_95 = float(serie_inf[serie_inf >= stats_inf['q95']].mean())
print("Synthèse inflation (%) :", stats_inf)
print(f"Expected Shortfall (>= Q95) : {es_95:.2f} %")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Plus faibles et plus fortes inflations : [-0.3, 0.2] ... [9.2, 9.9]
Synthèse inflation (%) : {'moyenne': 4.2, 'mediane': 3.85, 'q95': 9.38}
Expected Shortfall (>= Q95) : 9.90 %
\`\`\`

La médiane (\`3.85 %\`) est inférieure à la moyenne (\`4.20 %\`), signe d'une asymétrie vers les chocs inflationnistes élevés (\`q95 = 9.38 %\`, culminant à \`9.90 %\` en \`2022-Q3\`).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Comparez la médiane $q_{0.50}$ et le 95e percentile $q_{0.95}$ de \`inflation_hicp\` en termes de sensibilité aux pics extrêmes de 2022 et de provisionnement du risque d'inflation.

**Volet 2 — Laboratoire Code Python :**
Calculez exactement les variables \`mediane_inf = df['inflation_hicp'].median()\` et \`q95_inf = df['inflation_hicp'].quantile(0.95)\` puis affichez-les.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "mediane_inf = df['inflation_hicp'].median()\nq95_inf = df['inflation_hicp'].quantile(0.95)\nprint(f'Médiane : {mediane_inf:.2f} % | Quantile 95% : {q95_inf:.2f} %')",
        testPythonCode: "assert 'mediane_inf' in globals() and 'q95_inf' in globals()\nassert q95_inf >= mediane_inf",
        hints: ["df['inflation_hicp'].quantile(0.95)"],
        datasets: []
      },
      {
        id: "py-5",
        title: "5. Pente de la Courbe des Taux (Slope)",
        category: "alm",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Créez la variable de pente des taux OAT 10Y - Euribor 3M.",
        theoryMarkdown: `
### Pente de la Courbe des Taux & Développement de Taylor (Term Spread)

> 💡 **Théorie financière : Structure par Terme, Anticipations & Sensibilité ALM**
> 
> La pente de la courbe des taux mesure le différentiel entre le taux souverain long terme (OAT 10 ans) et le taux monétaire court terme (Euribor 3 mois) :
>
> $$\\text{Pente}_t = r_{\\text{OAT\\_10Y}, t} - r_{\\text{Euribor\\_3M}, t}$$
>
> D'après la **Théorie des Anticipations et de la Préférence pour la Liquidité** (Hicks), un taux long terme intègre la moyenne des taux courts futurs anticipés majorée d'une prime de terme $\\pi_T$ :
>
> $$(1 + r_{0,T})^T = \\prod_{k=0}^{T-1}(1 + f_{k,k+1}) \\implies r_{0,T} \\approx \\frac{1}{T}\\sum_{k=0}^{T-1} \\mathbb{E}_0[r_{k,k+1}] + \\pi_T$$
>
> - **Pente positive ($> 0$)** : rémunération normale de l'immobilisation du capital et transformation bancaire saine (emprunt court, prêt long).
> - **Pente inversée ($< 0$)** : la banque centrale maintient des taux courts très élevés alors que le marché anticipe un ralentissement et de futures baisses de taux.
> - **Approximation de Taylor sur le prix obligataire** : pour un zéro-coupon $P(r) = (1+r)^{-T}$, $\\frac{\\Delta P}{P} \\approx -\\frac{T}{1+r}\\Delta r$ : un aplatissement ou une pentification non parallèle modifie asymétriquement l'actif long et le passif court du bilan ALM.

#### 💻 Masterclass Code : NumPy Arrays 1D, Vectorisation & Broadcasting

Contrairement à une \`list\` Python (où \`a - b\` déclenche une \`TypeError\`), un tableau **NumPy** (\`np.ndarray\`) exécute les soustractions élément par élément en langage C compilé et applique automatiquement le **broadcasting** lors de la multiplication par un scalaire (\`* 100.0\` pour convertir en points de base bps).

\`\`\`python
import numpy as np

# 1. Extraction de tableaux NumPy 1D (.values) et soustraction vectorisée
oat_arr = df['oat_10y'].values        # array 1D de dimension (16,)
eur_arr = df['euribor_3m'].values     # array 1D de dimension (16,)
pente_arr = oat_arr - eur_arr         # calcul élément par élément sans boucle for

# 2. Broadcasting scalaire : conversion en points de base (1 % = 100 bps)
pente_bps = pente_arr * 100.0

# 3. Ajout de la colonne calculée au DataFrame Pandas
df['pente_taux'] = pente_arr
print(df[['periode', 'oat_10y', 'euribor_3m', 'pente_taux']].iloc[[0, 8, 10, 14, 15]])
print(f"Pente max : {pente_bps.max():.0f} bps | Pente min (inversion) : {pente_bps.min():.0f} bps")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
    periode  oat_10y  euribor_3m  pente_taux
0   2020-Q1    -0.15       -0.42        0.27
8   2022-Q1     0.89       -0.50        1.39
10  2022-Q3     2.71        0.95        1.76
14  2023-Q3     3.40        3.85       -0.45
15  2023-Q4     3.10        3.92       -0.82
Pente max : 210 bps | Pente min (inversion) : -82 bps
\`\`\`

On observe sur les vraies données l'inversion spectaculaire de la courbe des taux européenne : d'une pente fortement positive (\`+210 bps\` au plus haut) en 2022 à une inversion prononcée de \`-82 bps\` fin 2023 (\`2023-Q4\`).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Analysez la bascule entre une pente positive (prime de terme normale) et une pente inversée (anticipation de ralentissement ou pic de resserrement monétaire) et son impact sur la marge de transformation ALM.

**Volet 2 — Laboratoire Code Python :**
Créez la nouvelle colonne \`df['pente_taux'] = df['oat_10y'] - df['euribor_3m']\` et affichez \`df[['periode', 'oat_10y', 'euribor_3m', 'pente_taux']].head()\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "df['pente_taux'] = df['oat_10y'] - df['euribor_3m']\nprint(df[['periode', 'oat_10y', 'euribor_3m', 'pente_taux']].head())",
        testPythonCode: "assert 'pente_taux' in df.columns, 'La colonne pente_taux doit exister.'",
        hints: ["df['pente_taux'] = df['oat_10y'] - df['euribor_3m']"],
        datasets: []
      },
      {
        id: "py-6",
        title: "6. Matrice de Corrélation Linéaire (.corr)",
        category: "econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Mesurez la corrélation entre les taux et l'inflation.",
        theoryMarkdown: `
### Matrice de Corrélation Linéaire de Pearson (.corr)

> 💡 **Démonstration formelle : Coefficient de Pearson, Géométrie & Inégalité de Cauchy-Schwarz**
> 
> Pour deux séries temporelles $(x_t)_{t=1}^T$ et $(y_t)_{t=1}^T$, le **coefficient de corrélation linéaire de Pearson** normalise la covariance empirique par le produit des écarts-types :
>
> $$\\rho_{X, Y} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{\\sum_{t=1}^T (x_t - \\bar{x})(y_t - \\bar{y})}{\\sqrt{\\sum_{t=1}^T (x_t - \\bar{x})^2} \\sqrt{\\sum_{t=1}^T (y_t - \\bar{y})^2}}$$
>
> En notant les vecteurs centrés $\\tilde{x} = x - \\bar{x}\\mathbf{1}$ et $\\tilde{y} = y - \\bar{y}\\mathbf{1}$ dans $\\mathbb{R}^T$, $\\rho_{X,Y}$ s'identifie exactement au **cosinus de l'angle $\\theta$** entre les deux vecteurs :
>
> $$\\rho_{X, Y} = \\frac{\\langle \\tilde{x}, \\tilde{y} \\rangle}{\\|\\tilde{x}\\|_2 \\, \\|\\tilde{y}\\|_2} = \\cos(\\theta) \\in [-1, 1]$$
>
> L'encadrement $|\\rho_{X,Y}| \\le 1$ découle directement de l'**inégalité de Cauchy-Schwarz**, avec égalité $|\\rho_{X,Y}| = 1$ si et seulement si $Y = aX + b$ ($a \\neq 0$).
>
> **Limites & Rôle en ALM / Économétrie :**
> - $\\rho = 0$ indique l'absence de relation **linéaire**, mais n'exclut pas une dépendance non-linéaire (ex : $Y = X^2$ avec $X$ symétrique donne $\\rho = 0$).
> - **Corrélation $\\neq$ Causalité** : deux séries non-stationnaires tendancielles peuvent afficher $\\rho > 0.90$ par pure dérive temporelle (*régression fallacieuse*).
> - En gestion de portefeuille (Markowitz) et en régression multivariée, la matrice de corrélation $R \\in \\mathbb{R}^{K \\times K}$ (symétrique, diagonale unitaire, semi-définie positive) mesure à la fois le potentiel de diversification et le risque de **multicolinéarité** entre variables explicatives.

#### 💻 Masterclass Code : Matrices NumPy 2D (\`np.corrcoef\`) & Pandas \`.corr()\`

Pandas calcule la matrice de corrélation par paires sur un sous-DataFrame avec \`.corr()\`. En NumPy pur sur une matrice 2D \`M\` de dimension \`(T, K)\`, il faut impérativement passer \`rowvar=False\` à \`np.corrcoef\` pour indiquer que les **variables sont en colonnes** (et les observations en lignes).

\`\`\`python
import numpy as np

# 1. Calcul vectorisé Pandas (.corr) sur un sous-DataFrame de 3 colonnes
variables = ['euribor_3m', 'oat_10y', 'inflation_hicp']
matrice_corr = df[variables].corr()
print("Matrice de corrélation Pandas (.corr) :")
print(matrice_corr.round(4))

# 2. Équivalent NumPy 2D : matrice (16, 3) avec rowvar=False (variables en colonnes)
M = df[variables].values
corr_np = np.corrcoef(M, rowvar=False)
print(f"Shape matrice M : {M.shape} | Corrélation NumPy (Euribor, OAT) : {corr_np[0, 1]:.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Matrice de corrélation Pandas (.corr) :
                euribor_3m  oat_10y  inflation_hicp
euribor_3m          1.0000   0.9024          0.3346
oat_10y             0.9024   1.0000          0.6901
inflation_hicp      0.3346   0.6901          1.0000
Shape matrice M : (16, 3) | Corrélation NumPy (Euribor, OAT) : 0.9024
\`\`\`

L'Euribor 3M et l'OAT 10Y présentent une très forte corrélation positive ($\\hat{\\rho} = 0.9024$), tandis que l'Euribor et l'inflation ne sont que modérément corrélés ($\\hat{\\rho} = 0.3346$), ce qui limite le risque de colinéarité dans la future régression multiple.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Interprétez le coefficient $\\rho \\in [-1, 1]$ comme le cosinus de l'angle entre vecteurs centrés et expliquez pourquoi une forte corrélation entre deux variables explicatives annonce un risque potentiel de multicolinéarité.

**Volet 2 — Laboratoire Code Python :**
Calculez \`matrice_corr = df[['euribor_3m', 'oat_10y', 'inflation_hicp']].corr()\` et affichez-la arrondie à 3 décimales avec \`print(matrice_corr.round(3))\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "matrice_corr = df[['euribor_3m', 'oat_10y', 'inflation_hicp']].corr()\nprint(matrice_corr.round(3))",
        testPythonCode: "assert 'matrice_corr' in globals()\nassert matrice_corr.shape == (3, 3)",
        hints: ["Utilisez : df[variables].corr()"],
        datasets: []
      },
      {
        id: "py-7",
        title: "7. Détection d'Outliers par l'IQR de Tukey",
        category: "data_prep",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Déterminez le seuil haut de Tukey sur l'inflation.",
        theoryMarkdown: `
### Détection Robuste d'Outliers par l'Écart Interquartile de Tukey (IQR)

> 💡 **Mathématiques de Tukey (1977) : Quartiles, Clôtures & Point de Rupture**
> 
> Soit $Q_{25}$ le premier quartile ($25\\%$ des observations en deçà) et $Q_{75}$ le troisième quartile ($75\\%$ en deçà). L'**écart interquartile (IQR)** mesure l'étendue des $50\\%$ centraux de la distribution :
>
> $$\\text{IQR} = Q_{75} - Q_{25}$$
>
> John Tukey définit les **clôtures statistiques normales** (*fences*) par :
>
> $$\\text{Seuil bas} = Q_{25} - 1.5 \\times \\text{IQR}, \\quad \\text{Seuil haut} = Q_{75} + 1.5 \\times \\text{IQR}$$
>
> **Lien exact avec la loi Normale :** Si $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, alors $Q_{25} = \\mu - 0.6745\\sigma$ et $Q_{75} = \\mu + 0.6745\\sigma$, d'où $\\text{IQR} \\approx 1.349\\sigma$ et :
>
> $$\\text{Seuil haut} = \\mu + (0.6745 + 1.5 \\times 1.349)\\sigma \\approx \\mu + 2.698\\sigma$$
>
> Sous normalité, environ $99.3\\%$ des données tombent dans les moustaches (seulement $\\approx 0.7\\%$ d'outliers théoriques).
> **Pourquoi l'IQR bat la règle paramétrique $\\mu \\pm 3\\sigma$ en Actuariat / ALM ?**
> Un seul sinistre catastrophique ou choc macro extrême fait exploser la moyenne $\\bar{y}$ et l'écart-type $s$, masquant d'autres anomalies (*effet de masquage*). Avec un **point de rupture (*breakdown point*) de $25\\%$**, les quartiles $Q_{25}$ et $Q_{75}$ restent totalement immunes aux valeurs aberrantes isolées.

![Anatomie du Boxplot et Règle de Tukey](/images/theory/fig_v1_boxplot_tukey.png)

> 🔍 **Comprendre ce graphique : La robustesse de l'écart interquartile (IQR)**
> 
> - **La boîte centrale ($Q_1$ à $Q_3$)** : Contient exactement $50\\%$ des observations centrales du portefeuille.
> - **La barre rouge médiane ($Q_2$)** : La valeur qui sépare la population en deux parts égales (insensible aux valeurs extrêmes).
> - **Les moustaches ($\\pm 1.5 \\times \\text{IQR}$)** : L'intervalle de dispersion statistique normale établi par John Tukey.
> - **Les points rouges isolés (Outliers)** : Sinistres exceptionnels (grands sinistres corporels ou industriels) ou chocs macroéconomiques extrêmes à isoler pour éviter de biaiser les estimations MCO ou la prime pure.

#### 💻 Masterclass Code : \`np.quantile\` / \`.quantile()\` & Masques Booléens NumPy

En NumPy, \`np.quantile(arr, [0.25, 0.75])\` extrait simultanément les deux quartiles par décompactage. Pour détecter les observations aberrantes dans un \`ndarray\` ou un \`DataFrame\`, on construit un **masque booléen vectorisé** combinant l'opérateur logique bit-à-bit \`|\` (OU) et des parenthèses obligatoires autour de chaque condition.

\`\`\`python
import numpy as np

# 1. Quartiles et règle des clôtures de Tukey sur l'inflation (via NumPy)
inf_arr = df['inflation_hicp'].values
q25, q75 = np.quantile(inf_arr, [0.25, 0.75])
iqr = q75 - q25
seuil_bas = q25 - 1.5 * iqr
seuil_haut = q75 + 1.5 * iqr
print(f"Inflation -> Q25={q25:.3f} %, Q75={q75:.3f} %, IQR={iqr:.3f} %")
print(f"Clôtures Tukey -> [{seuil_bas:.3f} %, {seuil_haut:.3f} %]")

# 2. Masque booléen vectorisé sur la croissance du PIB (chocs COVID 2020)
q25_p, q75_p = df['pib_croissance'].quantile([0.25, 0.75])
iqr_p = q75_p - q25_p
masque_outliers = (df['pib_croissance'] < q25_p - 1.5 * iqr_p) | (df['pib_croissance'] > q75_p + 1.5 * iqr_p)
print("Outliers PIB détectés :", list(zip(df.loc[masque_outliers, 'periode'], df.loc[masque_outliers, 'pib_croissance'])))
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Inflation -> Q25=1.150 %, Q75=7.025 %, IQR=5.875 %
Clôtures Tukey -> [-7.662 %, 15.838 %]
Outliers PIB détectés : [('2020-Q1', -5.4), ('2020-Q2', -11.8), ('2020-Q3', 18.2), ('2020-Q4', -1.4), ('2021-Q3', 3.3)]
\`\`\`

Sur \`inflation_hicp\` (\`max = 9.90 %\`), l'inflation élevée de 2022 s'étale sur plusieurs trimestres et gonfle l'IQR (\`5.875 %\`, seuil haut \`15.838 %\`), donc aucun trimestre ne dépasse la clôture haute ; en revanche, sur \`pib_croissance\`, la règle de Tukey identifie chirurgicalement les chocs COVID de \`2020\` (\`-11.8 %\`, \`+18.2 %\`, \`-5.4 %\`) !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez pourquoi le seuil de Tukey $Q_{75} + 1.5 \\times \\text{IQR}$ résiste aux chocs extrêmes contrairement à $\\bar{x} + 3s$, et interprétez sa correspondance ($\\approx \\mu + 2.7\\sigma$) sous loi normale.

**Volet 2 — Laboratoire Code Python :**
Pour la série \`df['inflation_hicp']\`, calculez exactement \`q25\`, \`q75\`, \`iqr = q75 - q25\` et \`seuil_haut = q75 + 1.5 * iqr\`, puis affichez \`iqr\` et \`seuil_haut\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "q25 = df['inflation_hicp'].quantile(0.25)\nq75 = df['inflation_hicp'].quantile(0.75)\niqr = q75 - q25\nseuil_haut = q75 + 1.5 * iqr\nprint(f'IQR : {iqr:.2f} % | Seuil Haut Tukey : {seuil_haut:.2f} %')",
        testPythonCode: "assert 'seuil_haut' in globals() and 'iqr' in globals()",
        hints: ["iqr = q75 - q25 puis seuil_haut = q75 + 1.5 * iqr"],
        datasets: []
      },
      {
        id: "py-8",
        title: "8. L'Ordonnée à l'Origine & sm.add_constant",
        category: "econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Adjoignez le vecteur unitaire pour la constante du modèle.",
        theoryMarkdown: `
### Rôle Algébrique & Statistique de la Constante $\\beta_0$ (sm.add_constant)

> 💡 **Démonstration formelle : Pourquoi la colonne de $1$ garantit $\\mathbb{E}[\\hat{e}_t] = 0$ ?**
> 
> Dans la régression linéaire $y_t = \\beta_0 + \\beta_1 x_t + \\varepsilon_t$, Statsmodels estime l'équation matricielle $y = X\\beta + \\varepsilon$. La matrice de design $X$ **doit contenir une colonne de $1$** pour représenter l'ordonnée à l'origine $\\beta_0$ :
>
> $$X = \\begin{pmatrix} 1 & x_1 \\\\ 1 & x_2 \\\\ \\vdots & \\vdots \\\\ 1 & x_T \\end{pmatrix} \\in \\mathbb{R}^{T \\times 2}, \\quad \\beta = \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix}$$
>
> **Preuve via les conditions du premier ordre des MCO :**
> En dérivant la somme des carrés des résidus $SCR(\\beta_0, \\beta_1) = \\sum_{t=1}^T (y_t - \\beta_0 - \\beta_1 x_t)^2$ par rapport à $\\beta_0$ :
>
> $$\\frac{\\partial SCR}{\\partial \\beta_0} = -2 \\sum_{t=1}^T (y_t - \\hat{\\beta}_0 - \\hat{\\beta}_1 x_t) = -2 \\sum_{t=1}^T \\hat{e}_t = 0 \\implies \\mathbf{1}'\\hat{e} = 0 \\implies \\frac{1}{T}\\sum_{t=1}^T \\hat{e}_t = 0$$
>
> La présence de la constante force donc mécaniquement les résidus à être **centrés en moyenne ($\\bar{\\hat{e}} = 0$)**, garantissant que $\\mathbb{E}[\\hat{e}_t] = 0$ et que la droite MCO passe exactement par le barycentre $(\\bar{x}, \\bar{y})$ via $\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1\\bar{x}$.
>
> **Le piège fatal de la régression sans constante (*Regression Through the Origin*) :**
> Contrairement à R ou \`statsmodels.formula.api\`, \`sm.OLS(y, X)\` **n'ajoute pas automatiquement la constante**. L'omettre force la droite à passer par $(0, 0)$ : si la vraie ordonnée à l'origine $\\beta_0 \\neq 0$ (ex : prime de terme positive de l'OAT lorsque l'Euribor vaut $0\\%$), l'estimateur $\\hat{\\beta}_1$ est **biaisé**, $\\bar{\\hat{e}} \\neq 0$, et l'identité ANOVA $SCT = SCE + SCR$ est brisée !

#### 💻 Masterclass Code : Construction matricielle \`np.column_stack\` vs \`sm.add_constant\`

En NumPy pur, il faut concaténer explicitement \`np.ones(len(x))\`. Statsmodels fournit \`sm.add_constant()\` qui ajoute en première position une colonne nommée \`'const'\` remplie de \`1.0\` tout en préservant l'objet \`DataFrame\` et ses noms de variables. Attention à passer un \`DataFrame\` 2D \`df[['euribor_3m']]\` (doubles crochets) pour garder le nom de colonne dans les tableaux de sortie.

\`\`\`python
import numpy as np
import statsmodels.api as sm

# 1. Construction manuelle de la matrice de design X = [1, x] en NumPy
x_arr = df['euribor_3m'].values
X_numpy = np.column_stack([np.ones(len(x_arr)), x_arr])  # shape (16, 2)

# 2. Méthode canonique Statsmodels (préserve les noms de colonnes DataFrame)
X_avec = sm.add_constant(df[['euribor_3m']])
print(X_avec.head(3))

# 3. Impact de l'omission de la constante (biais de pente et résidus non centrés)
y = df['oat_10y']
m_avec = sm.OLS(y, X_avec).fit()
m_sans = sm.OLS(y, df[['euribor_3m']]).fit()
print(f"Avec constante -> beta0={m_avec.params['const']:.4f}, beta1={m_avec.params['euribor_3m']:.4f}, moy(resid)={m_avec.resid.mean():.2e}")
print(f"Sans constante -> beta1={m_sans.params['euribor_3m']:.4f}, moy(resid)={m_sans.resid.mean():.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
   const  euribor_3m
0    1.0       -0.42
1    1.0       -0.38
2    1.0       -0.48
Avec constante -> beta0=0.6982, beta1=0.7707, moy(resid)=-3.47e-16
Sans constante -> beta1=0.9211, moy(resid)=0.5821
\`\`\`

L'oubli de \`sm.add_constant\` fait bondir artificiellement la pente estimée de \`0.7707\` à \`0.9211\` et laisse une erreur moyenne systématique de \`+0.5821 %\` dans les résidus !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Démontrez à partir de $\\frac{\\partial SCR}{\\partial \\beta_0} = 0$ pourquoi la colonne unitaire \`'const'\` est indispensable pour assurer $\\bar{\\hat{e}} = 0$ et éviter un biais sur la sensibilité $\\hat{\\beta}_1$ de l'OAT à l'Euribor.

**Volet 2 — Laboratoire Code Python :**
Importez \`statsmodels.api as sm\`, créez la matrice de design \`X = sm.add_constant(df[['euribor_3m']])\` et affichez ses premières lignes avec \`print(X.head())\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nprint(X.head())",
        testPythonCode: "assert 'X' in globals()\nassert 'const' in X.columns",
        hints: ["X = sm.add_constant(df[['euribor_3m']])"],
        datasets: []
      },
      {
        id: "py-9",
        title: "9. Estimation OLS Simple & Statsmodels",
        category: "econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Ajustez le modèle OAT 10Y en fonction de l'Euribor 3M.",
        theoryMarkdown: `
### Modèle de Régression Simple par les MCO & Théorème de Gauss-Markov

> 💡 **Démonstration & Théorème de Gauss-Markov (BLUE)**
> 
> On modélise la variable expliquée $y_t$ par $y_t = \\beta_0 + \\beta_1 x_t + \\varepsilon_t$. Les Moindres Carrés Ordinaires (MCO / OLS) minimisent la somme des carrés des résidus :
>
> $$\\min_{\\hat{\\beta}_0, \\hat{\\beta}_1} SCR(\\hat{\\beta}_0, \\hat{\\beta}_1) = \\sum_{t=1}^T (y_t - \\hat{\\beta}_0 - \\hat{\\beta}_1 x_t)^2$$
>
> En annulant les deux dérivées partielles ($\\nabla SCR = 0$), on obtient les solutions analytiques exactes :
>
> $$\\hat{\\beta}_1 = \\frac{\\sum_{t=1}^T (x_t - \\bar{x})(y_t - \\bar{y})}{\\sum_{t=1}^T (x_t - \\bar{x})^2} = \\frac{\\operatorname{Cov}(x, y)}{\\operatorname{Var}(x)}, \\quad \\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$$
>
> **Théorème de Gauss-Markov (1821 / 1900) :** Sous les hypothèses classiques $(H_1)$ linéarité, $(H_2)$ exogénéité stricte $\\mathbb{E}[\\varepsilon \\mid X] = 0$, $(H_3)$ plein rang $\\operatorname{rang}(X) = K+1$, $(H_4)$ homoscédasticité et non-autocorrélation $\\operatorname{Var}(\\varepsilon \\mid X) = \\sigma^2 I_T$, tout autre estimateur linéaire sans biais $\\tilde{\\beta} = C y$ (avec $CX = I$) s'écrit $\\tilde{\\beta} = \\hat{\\beta}_{\\text{OLS}} + D y$ avec $DX = 0$, d'où :
>
> $$\\operatorname{Var}(\\tilde{\\beta} \\mid X) = \\sigma^2 (X'X)^{-1} + \\sigma^2 D D' \\succeq \\operatorname{Var}(\\hat{\\beta}_{\\text{OLS}} \\mid X)$$
>
> L'estimateur MCO est donc **BLUE** (*Best Linear Unbiased Estimator*) : c'est l'estimateur linéaire sans biais de variance minimale.

![Principe Géométrique des Moindres Carrés Ordinaires](/images/theory/fig_v1_ols_residuals.png)

> 🔍 **Comprendre ce graphique : La minimisation des résidus au carré**
> 
> - **Les points noirs** : Observations empiriques $(X_i, Y_i)$ reliant l'âge de l'assuré à sa prime (ou le taux court au taux long).
> - **La droite bleue ($\\hat{Y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 X$)** : L'unique droite dans l'espace qui minimise la somme des carrés des distances verticales.
> - **Les pointillés rouges ($e_i = Y_i - \\hat{Y}_i$)** : Les résidus d'estimation. L'élévation au carré pénalise fortement les grands écarts et garantit $\\sum e_i = 0$.

> ✏️ **Exemple chiffré & Résolution algébrique pas-à-pas (Toy Example sur 3 points) :**
> Soit 3 observations $(1, 2), (2, 3), (3, 5)$ :
> 1. **Moyennes** : $\\bar{x} = 2.0$, $\\bar{y} = 10/3 \\approx 3.333$.
> 2. **Covariances et variance de $x$** :
>    - $\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = (-1)(-1.333) + 0(-0.333) + (+1)(+1.667) = 3.0$
>    - $\\sum (x_i - \\bar{x})^2 = (-1)^2 + 0^2 + 1^2 = 2.0$
> 3. **Solutions analytiques** : $\\hat{\\beta}_1 = 3.0 / 2.0 = \\mathbf{1.50}$ et $\\hat{\\beta}_0 = 3.333 - 1.50 \\times 2.0 = \\mathbf{0.333}$, soit $\\hat{y} = 0.333 + 1.50 x$.

#### 💻 Masterclass Code : Pipeline \`sm.OLS(y, X).fit()\` et Anatomie du \`.summary()\`

Attention à la convention d'arguments de \`statsmodels\` : la variable expliquée \`y\` (*endog*) se passe **toujours en premier**, suivie de la matrice des régresseurs \`X\` (*exog*). La méthode \`.fit()\` résout les équations normales et renvoie un objet \`RegressionResultsWrapper\` dont \`.summary()\` génère le rapport économétrique en 3 blocs (ajustement global, table des coefficients, diagnostics résiduels).

\`\`\`python
import statsmodels.api as sm

# 1. Matrice des variables explicatives X (avec constante) et vecteur cible y
X = sm.add_constant(df[['euribor_3m']])
y = df['oat_10y']

# 2. Spécification du modèle MCO (attention à l'ordre : y en premier, X en second)
ols_spec = sm.OLS(y, X)

# 3. Estimation par résolution des équations normales
model = ols_spec.fit()

# 4. Affichage du tableau complet des diagnostics
print(model.summary())
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
                            OLS Regression Results                            
==============================================================================
Dep. Variable:                oat_10y   R-squared:                       0.814
Model:                            OLS   Adj. R-squared:                  0.801
Method:                 Least Squares   F-statistic:                     61.44
Date:                Wed, 18 Nov 2026   Prob (F-statistic):           1.74e-06
Time:                        19:52:13   Log-Likelihood:                -15.460
No. Observations:                  16   AIC:                             34.92
Df Residuals:                      14   BIC:                             36.47
Df Model:                           1                                         
Covariance Type:            nonrobust                                         
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
const          0.6982      0.186      3.751      0.002       0.299       1.097
euribor_3m     0.7707      0.098      7.838      0.000       0.560       0.982
==============================================================================
Omnibus:                        4.313   Durbin-Watson:                   0.340
Prob(Omnibus):                  0.116   Jarque-Bera (JB):                3.024
Skew:                           1.059   Prob(JB):                        0.221
Kurtosis:                       2.779   Cond. No.                         2.20
==============================================================================

Notes:
[1] Standard Errors assume that the covariance matrix of the errors is correctly specified.
\`\`\`

L'Euribor 3M explique à lui seul $R^2 = 81.4\\%$ de la variance de l'OAT 10Y avec une sensibilité de \`0.7707\` ($t = 7.838$), mais le faible Durbin-Watson (\`0.340\`) suggère qu'un facteur omis (comme l'inflation) reste caché dans les résidus.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Rappelez les hypothèses qui rendent l'estimateur MCO **BLUE** (Gauss-Markov) et expliquez l'ordre des arguments dans \`sm.OLS(y, X)\`.

**Volet 2 — Laboratoire Code Python :**
Construisez \`X = sm.add_constant(df[['euribor_3m']])\` et \`y = df['oat_10y']\`, estimez le modèle dans la variable \`model = sm.OLS(y, X).fit()\`, puis affichez \`print(model.summary())\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\ny = df['oat_10y']\nmodel = sm.OLS(y, X).fit()\nprint(model.summary())",
        testPythonCode: "assert 'model' in globals()\nassert hasattr(model, 'params')",
        hints: ["model = sm.OLS(y, X).fit()"],
        datasets: []
      },
      {
        id: "py-10",
        title: "10. Interprétation des Coefficients (model.params)",
        category: "econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Extrayez et interprétez économiquement les paramètres estimés.",
        theoryMarkdown: `
### Interprétation Économique des Coefficients (model.params)

> 💡 **Sensibilité Marginale, Pass-Through Monétaire & Équilibre Structurel**
> 
> Dans la droite ajustée $\\hat{y}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_t$, chaque paramètre possède une signification financière précise :
> - **La pente $\\hat{\\beta}_1$ (dérivée partielle)** :
>
> $$\\hat{\\beta}_1 = \\frac{\\partial \\hat{y}}{\\partial x}$$
>
> Elle mesure le taux de transmission (*pass-through*) d'un choc de $+100\\text{ bps}$ ($+1$ point de pourcentage) du taux court (\`euribor_3m\`) vers le taux souverain à 10 ans (\`oat_10y\`), *ceteris paribus*. En pratique sur la courbe des taux, on observe souvent $0 < \\hat{\\beta}_1 < 1$ car le taux à 10 ans reflète la moyenne des taux courts futurs anticipés : il lisse les chocs monétaires temporaires.
> - **La constante $\\hat{\\beta}_0$** : représente le niveau moyen de l'OAT 10 ans lorsque l'Euribor vaut $0\\%$ (incorporant la prime de terme structurelle et les anticipations d'inflation à long terme).
> - **Usage ALM** : permet de paramétrer des chocs de courbe non parallèles lorsque seul le taux directeur bouge à court terme.

#### 💻 Masterclass Code : Extraction \`model.params\` & Prévision \`.predict()\`

L'attribut \`model.params\` est une \`pd.Series\` Pandas indexée par le nom exact des colonnes de \`X\` (\`'const'\`, \`'euribor_3m'\`). On accède aux valeurs par clé (\`betas['euribor_3m']\`), on peut les convertir en \`dict\` natif via \`.to_dict()\`, ou générer une prévision conditionnelle avec \`model.predict([1.0, valeur_euribor])\` (sans oublier le \`1.0\` initial pour la constante !).

\`\`\`python
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m']])
model = sm.OLS(df['oat_10y'], X).fit()

# Extraction de la Series model.params par étiquette
betas = model.params
print("Coefficients estimés :", {k: round(float(v), 4) for k, v in betas.items()})

# Utilisation pour prévoir l'OAT 10Y si l'Euribor atteint 4.50 %
oat_prevue = model.predict([1.0, 4.50])[0]
print(f"Prévision OAT 10Y (Euribor = 4.50 %) : {oat_prevue:.4f} %")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Coefficients estimés : {'const': 0.6982, 'euribor_3m': 0.7707}
Prévision OAT 10Y (Euribor = 4.50 %) : 4.1665 %
\`\`\`

Une hausse de $+1\\%$ de l'Euribor se transmet à hauteur de $+0.7707\\%$ sur l'OAT 10 ans, tandis qu'à taux monétaire nul l'OAT ressort en moyenne à $+0.6982\\%$.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Interprétez économiquement la pente $\\hat{\\beta}_1 = \\frac{\\partial \\widehat{\\text{OAT}}}{\\partial \\text{Euribor}}$ (pourquoi $\\hat{\\beta}_1 < 1$ ?) ainsi que la constante $\\hat{\\beta}_0$.

**Volet 2 — Laboratoire Code Python :**
Ajustez le modèle OAT sur Euribor (avec constante), extrayez les coefficients dans la variable \`betas = model.params\` et affichez-les.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nmodel = sm.OLS(df['oat_10y'], X).fit()\nbetas = model.params\nprint('Coefficients estimés :\\n', betas)",
        testPythonCode: "assert 'betas' in globals()\nassert 'euribor_3m' in betas",
        hints: ["betas = model.params"],
        datasets: []
      },
      {
        id: "py-11",
        title: "11. Test de Student & P-Valeur (model.pvalues)",
        category: "econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Testez l'hypothèse de nullité du coefficient H0: beta = 0.",
        theoryMarkdown: `
### Test de Significativité Individuelle : Loi de Student & P-Valeur (model.pvalues)

> 💡 **Dérivation formelle : Pivot de Student & Seuil Critique**
> 
> Sous les hypothèses de Gauss-Markov complétées par la normalité des erreurs $\\varepsilon \\sim \\mathcal{N}(0, \\sigma^2 I_T)$, l'estimateur MCO suit $\\hat{\\beta} \\sim \\mathcal{N}(\\beta, \\sigma^2 (X'X)^{-1})$. Comme $\\sigma^2$ est inconnu et estimé sans biais par $\\hat{\\sigma}^2 = \\frac{SCR}{T - K - 1}$ (telle que $\\frac{(T-K-1)\\hat{\\sigma}^2}{\\sigma^2} \\sim \\chi^2(T-K-1)$ indépendamment de $\\hat{\\beta}$), le rapport standardisé suit exactement une **loi de Student à $\\nu = T - K - 1$ degrés de liberté** :
>
> $$t_j = \\frac{\\hat{\\beta}_j - 0}{\\widehat{SE}(\\hat{\\beta}_j)} = \\frac{\\hat{\\beta}_j}{\\sqrt{\\hat{\\sigma}^2 \\big[(X'X)^{-1}\\big]_{jj}}} \\sim \\mathcal{T}(T - K - 1)$$
>
> Pour tester l'hypothèse nulle d'absence d'effet $H_0: \\beta_j = 0$ contre $H_1: \\beta_j \\neq 0$ au risque de première espèce $\\alpha = 5\\%$ :
> - La **p-valeur bilatérale** mesure la probabilité d'observer une statistique au moins aussi extrême sous $H_0$ : $p = 2\\,\\mathbb{P}\\big(|T_\\nu| \\ge |t_{\\text{obs}}|\\big)$.
> - Si $p < 0.05$ (équivalent à $|t_{\\text{obs}}| \\ge t_{1-\\alpha/2,\\nu}$, soit $1.96$ en grand échantillon et $2.145$ à $\\nu = 14$ ddl), on **rejette $H_0$** : le facteur est statistiquement significatif.

![Test de Student et Zone de Rejet](/images/theory/fig_v1_student_test.png)

> 🔍 **Comprendre ce graphique : Comment décider si une variable a un impact réel**
> 
> - **La courbe en cloche** : Distribution théorique de la statistique de test sous l'hypothèse nulle $H_0: \\beta_1 = 0$.
> - **La zone bleue centrale ($95\\%$)** : Zone de non-rejet ; les fluctuations pourraient être dues au seul hasard d'échantillonnage (p-valeur $\\ge 0.05$).
> - **Les zones rouges extrêmes ($\\pm 1.96$ asymptotique)** : Si $|t|$ tombe dans les queues rouges ($p < 0.05$), l'effet est statistiquement significatif.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Avec $\\hat{\\beta}_1 = 1.50$ et $\\widehat{SE}(\\hat{\\beta}_1) = 0.25$, on obtient $t = 1.50 / 0.25 = \\mathbf{6.0}$, bien au-delà du seuil critique ($p \\approx 1.2 \\times 10^{-7} < 0.05$) : rejet net de $H_0$.

#### 💻 Masterclass Code : Inférence Statsmodels (\`bse\`, \`tvalues\`, \`pvalues\`, \`conf_int\`)

Statsmodels expose chaque brique de la table de régression via des attributs dédiés (\`model.bse\` pour les écarts-types, \`model.tvalues\` pour les $t$-stats, \`model.pvalues\` pour les p-valeurs et \`model.conf_int()\` pour l'intervalle de confiance à $95\\%$).

\`\`\`python
import pandas as pd
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m']])
model = sm.OLS(df['oat_10y'], X).fit()

# Regroupement des statistiques d'inférence dans un tableau synthétique
ic = model.conf_int(alpha=0.05)  # intervalle de confiance bilatéral à 95 %
tableau_student = pd.DataFrame({
    'coef': model.params,
    'std_err': model.bse,
    't_stat': model.tvalues,      # égal à coef / std_err
    'p_val': model.pvalues,
    'ic_95_inf': ic[0],
    'ic_95_sup': ic[1],
})
print(tableau_student.round(4))
print(f"P-valeur exacte de l'Euribor : {model.pvalues['euribor_3m']:.4e}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
              coef  std_err  t_stat   p_val  ic_95_inf  ic_95_sup
const       0.6982   0.1861  3.7511  0.0021     0.2990     1.0974
euribor_3m  0.7707   0.0983  7.8381  0.0000     0.5598     0.9816
P-valeur exacte de l'Euribor : 1.7360e-06
\`\`\`

Avec $t = 7.8381$ et $p = 1.7360 \\times 10^{-6} \\ll 0.05$, l'Euribor 3M exerce un impact hautement significatif sur l'OAT 10Y (intervalle de confiance à $95\\%$ : $[0.5598, 0.9816]$).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Vérifiez le lien exact $t = \\hat{\\beta}_1 / \\widehat{SE}(\\hat{\\beta}_1)$ et interprétez la p-valeur bilatérale sous $H_0: \\beta_1 = 0$ pour décider de la significativité statistique.

**Volet 2 — Laboratoire Code Python :**
Ajustez le modèle simple \`oat_10y\` sur \`euribor_3m\` (avec constante), extrayez \`p_val = model.pvalues['euribor_3m']\` et affichez-la en notation scientifique.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nmodel = sm.OLS(df['oat_10y'], X).fit()\np_val = model.pvalues['euribor_3m']\nprint(f'P-valeur de l\\'Euribor : {p_val:.4e}')",
        testPythonCode: "assert 'p_val' in globals()\nassert p_val < 0.05",
        hints: ["p_val = model.pvalues['euribor_3m']"],
        datasets: []
      },
      {
        id: "py-12",
        title: "12. Qualité d'Ajustement Globale : R² vs R² Ajusté",
        category: "econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Analysez le pourcentage de variance expliqué.",
        theoryMarkdown: `
### Décomposition ANOVA Orthogonale, $R^2$ et $R^2$ Ajusté

> 💡 **Démonstration formelle : Théorème de Pythagore Économétrique ($SCT = SCE + SCR$)**
> 
> Écrivons l'écart total à la moyenne comme la somme de l'écart expliqué et du résidu : $y - \\bar{y}\\mathbf{1} = (\\hat{y} - \\bar{y}\\mathbf{1}) + e$.
> En présence d'une constante, les équations normales garantissent $\\mathbf{1}'e = 0$ et $X'e = 0$, ce qui implique $\\hat{y}'e = \\hat{\\beta}'X'e = 0$ et donc $(\\hat{y} - \\bar{y}\\mathbf{1})'e = 0$ (orthogonalité parfaite !). En prenant la norme au carré :
>
> $$\\underbrace{\\sum_{t=1}^T (y_t - \\bar{y})^2}_{SCT} = \\underbrace{\\sum_{t=1}^T (\\hat{y}_t - \\bar{y})^2}_{SCE} + \\underbrace{\\sum_{t=1}^T e_t^2}_{SCR}$$
>
> On définit alors le **coefficient de détermination** $R^2$ et le **$R^2$ ajusté de Theil** ($\\bar{R}^2$) :
>
> $$R^2 = \\frac{SCE}{SCT} = 1 - \\frac{SCR}{SCT} \\in [0, 1], \\qquad \\bar{R}^2 = 1 - \\frac{SCR / (T - K - 1)}{SCT / (T - 1)} = 1 - (1 - R^2)\\frac{T - 1}{T - K - 1}$$
>
> **Pourquoi $\\bar{R}^2$ est vital pour la sélection de modèles ALM :**
> Ajouter une variable explicative quelconque (même un pur bruit blanc !) ne peut jamais augmenter $SCR$, donc $R^2$ augmente **mécaniquement**. Au contraire, $\\bar{R}^2$ pénalise chaque régresseur ajouté par les degrés de liberté : il n'augmente que si le $|t|$-statistique de la variable ajoutée est supérieur à $1$.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Pour $N = 20$, $K = 2$, $SCT = 100.0$ et $SCR = 15.0$ :
> - $R^2 = 1 - \\frac{15.0}{100.0} = \\mathbf{0.850}$ ($85.0\\%$).
> - $\\bar{R}^2 = 1 - \\frac{15.0 / 17}{100.0 / 19} = 1 - \\frac{0.8824}{5.2632} = \\mathbf{0.8324}$ ($83.24\\% < 85.0\\%$).

#### 💻 Masterclass Code : Vérification ANOVA (\`centered_tss\`, \`ess\`, \`ssr\`) & Scores $R^2$

Statsmodels stocke directement les trois sommes de carrés de la décomposition ANOVA dans \`model.centered_tss\` ($SCT$), \`model.ess\` ($SCE$) et \`model.ssr\` ($SCR$), ainsi que \`model.rsquared\` et \`model.rsquared_adj\`.

\`\`\`python
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m']])
model = sm.OLS(df['oat_10y'], X).fit()

# Vérification numérique de l'identité ANOVA : SCT = SCE + SCR
sct = model.centered_tss
sce = model.ess
scr = model.ssr
print(f"SCT = {sct:.4f} | SCE = {sce:.4f} | SCR = {scr:.4f} | SCE+SCR = {sce + scr:.4f}")

# Extraction du R² brut et du R² ajusté des degrés de liberté
r2 = model.rsquared
r2_adj = model.rsquared_adj
print(f"R² : {r2 * 100:.2f} % | R² ajusté : {r2_adj * 100:.2f} %")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
SCT = 34.8645 | SCE = 28.3941 | SCR = 6.4704 | SCE+SCR = 34.8645
R² : 81.44 % | R² ajusté : 80.12 %
\`\`\`

On vérifie à la décimale près que $SCE + SCR = 28.3941 + 6.4704 = 34.8645 = SCT$, donnant $R^2 = 81.44\\%$ et $\\bar{R}^2 = 80.12\\%$. 
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez pourquoi $SCT = SCE + SCR$ requiert une constante dans le modèle et pourquoi seul $\\bar{R}^2$ permet de comparer équitablement des modèles ayant un nombre différent de variables explicatives.

**Volet 2 — Laboratoire Code Python :**
Estimez \`model = sm.OLS(df['oat_10y'], X).fit()\` avec constante, stockez \`r2 = model.rsquared\` et \`r2_adj = model.rsquared_adj\`, puis affichez-les en pourcentage.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nmodel = sm.OLS(df['oat_10y'], X).fit()\nr2 = model.rsquared\nr2_adj = model.rsquared_adj\nprint(f'R² : {r2 * 100:.2f} % | R² ajusté : {r2_adj * 100:.2f} %')",
        testPythonCode: "assert 'r2' in globals() and 'r2_adj' in globals()\nassert r2 > 0.70",
        hints: ["model.rsquared et model.rsquared_adj"],
        datasets: []
      },
      {
        id: "py-13",
        title: "13. Algèbre Matricielle Pure avec NumPy",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Calculez beta_hat = (X^T X)^(-1) X^T Y à la main sans Statsmodels.",
        theoryMarkdown: `
### Algèbre Matricielle MCO & Projection Orthogonale avec NumPy

> 💡 **Dérivation matricielle complète : $\\nabla_\\beta SCR = 0 \\implies \\hat{\\beta} = (X'X)^{-1}X'y$**
> 
> Soit le modèle linéaire général $y = X\\beta + \\varepsilon$ avec $y \\in \\mathbb{R}^T$, $X \\in \\mathbb{R}^{T \\times (K+1)}$ de plein rang colonne et $\\beta \\in \\mathbb{R}^{K+1}$. La somme des carrés des résidus s'écrit sous forme quadratique :
>
> $$SCR(\\beta) = (y - X\\beta)'(y - X\\beta) = y'y - 2\\beta'X'y + \\beta'X'X\\beta$$
>
> En appliquant le calcul différentiel matriciel ($\\nabla_\\beta(\\beta'a) = a$ et $\\nabla_\\beta(\\beta'A\\beta) = 2A\\beta$ pour $A$ symétrique), l'annulation du gradient donne les **équations normales** :
>
> $$\\nabla_\\beta SCR(\\beta) = -2X'y + 2X'X\\beta = 0 \\iff (X'X)\\hat{\\beta} = X'y$$
>
> La matrice hessienne $\\nabla^2_\\beta SCR(\\beta) = 2X'X$ est symétrique définie positive ($\\succ 0$) dès que $\\operatorname{rang}(X) = K + 1$, assurant l'unicité du minimum global :
>
> $$\\hat{\\beta} = (X'X)^{-1}X'y$$
>
> **Interprétation géométrique :** Le vecteur ajusté $\\hat{y} = X\\hat{\\beta} = H y$, où $H = X(X'X)^{-1}X'$ (*Hat Matrix*) est le projecteur orthogonal sur $\\operatorname{Im}(X)$ ($H' = H$ et $H^2 = H$), tandis que $e = (I_T - H)y$ appartient à l'espace orthogonal ($\\operatorname{Im}(X)^\\perp$).

> ✏️ **Exemple chiffré & Résolution matricielle pas-à-pas :**
> Sur $(1, 2), (2, 3), (3, 5)$ :
>
> $$X = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\end{pmatrix}, \\quad y = \\begin{pmatrix} 2 \\\\ 3 \\\\ 5 \\end{pmatrix} \\implies X'X = \\begin{pmatrix} 3 & 6 \\\\ 6 & 14 \\end{pmatrix}, \\quad X'y = \\begin{pmatrix} 10 \\\\ 23 \\end{pmatrix}$$
>
> Avec $\\det(X'X) = 3 \\times 14 - 36 = 6$, on obtient :
>
> $$\\hat{\\beta} = \\frac{1}{6} \\begin{pmatrix} 14 & -6 \\\\ -6 & 3 \\end{pmatrix} \\begin{pmatrix} 10 \\\\ 23 \\end{pmatrix} = \\frac{1}{6} \\begin{pmatrix} 2 \\\\ 9 \\end{pmatrix} = \\begin{pmatrix} 0.333 \\\\ 1.500 \\end{pmatrix}$$

#### 💻 Masterclass Code : NumPy Pur (\`.values\`, \`.T\`, \`@\`, \`np.linalg.inv\` vs \`solve\`)

Pour traduire $\\hat{\\beta} = (X'X)^{-1}X'y$ en algèbre NumPy :
- \`.values\` convertit un \`DataFrame\` ou une \`Series\` Pandas en tableau \`np.ndarray\` pur.
- \`.T\` effectue la transposition matricielle $X'$.
- \`@\` est l'opérateur Python du produit matriciel (\`np.matmul\`).
- \`np.linalg.inv(A)\` inverse explicitement $A = X'X$ (note d'ingénierie numérique : sur des systèmes très mal conditionnés, \`np.linalg.solve(XtX, Xty)\` résout le système linéaire sans inversion explicite pour une précision accrue).

\`\`\`python
import numpy as np
import statsmodels.api as sm

# 1. Conversion DataFrame -> tableaux NumPy purs via .values
X = sm.add_constant(df[['euribor_3m']]).values   # shape (16, 2)
y = df['oat_10y'].values                         # shape (16,)

# 2. Produit matriciel (@) et transposée (.T) pour les équations normales
XtX = X.T @ X     # matrice de Gram (2, 2)
Xty = X.T @ y     # vecteur moment (2,)

# 3. Inversion directe vs résolution linéaire stable (np.linalg.solve)
beta_numpy = np.linalg.inv(XtX) @ Xty
beta_solve = np.linalg.solve(XtX, Xty)

# 4. Vérification contre Statsmodels
beta_sm = sm.OLS(y, X).fit().params
print("Matrice X'X :\\n", np.round(XtX, 4))
print("beta_numpy :", np.round(beta_numpy, 6))
print("Écart max inv vs solve vs Statsmodels :", f"{np.max(np.abs(beta_numpy - beta_sm)):.2e}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Matrice X'X :
 [[16.     12.35  ]
 [12.35   57.3321]]
beta_numpy : [0.698217 0.770731]
Écart max inv vs solve vs Statsmodels : 4.44e-16
\`\`\`

Le calcul matriciel manuel retrouve exactement \`[0.698217, 0.770731]\` à la précision machine près (\`4.44e-16\` d'écart avec \`Statsmodels\`, qui utilise en interne la décomposition QR / SVD).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Démontrez $\\hat{\\beta} = (X'X)^{-1}X'y$ à partir de $\\nabla_\\beta SCR(\\beta) = 0$ et expliquez pourquoi la matrice $X'X$ doit être inversible ($\\det(X'X) \\neq 0$).

**Volet 2 — Laboratoire Code Python :**
Convertissez \`sm.add_constant(df[['euribor_3m']]).values\` en matrice \`X\` et \`df['oat_10y'].values\` en vecteur \`y\`, calculez \`beta_numpy = np.linalg.inv(X.T @ X) @ X.T @ y\` et affichez le résultat.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import numpy as np\nimport statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']]).values\ny = df['oat_10y'].values\nbeta_numpy = np.linalg.inv(X.T @ X) @ X.T @ y\nprint('Coefficients calculés à la main :', beta_numpy)",
        testPythonCode: "assert 'beta_numpy' in globals()\nassert len(beta_numpy) == 2",
        hints: ["np.linalg.inv(X.T @ X) @ X.T @ y"],
        datasets: []
      },
      {
        id: "py-14",
        title: "14. Diagnostic des Résidus : Propriété de Somme Nulle",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Vérifiez que la moyenne des résidus empiriques est nulle.",
        theoryMarkdown: `
### Diagnostic des Résidus : Perturbations, Projecteur $M$ & Somme Nulle

> 💡 **Distinction théorique & Propriété d'orthogonalité MCO**
> 
> Ne confondez jamais :
> - $\\varepsilon_t = y_t - X_t \\beta$ : la **perturbation théorique** inobservable ($\\operatorname{Var}(\\varepsilon \\mid X) = \\sigma^2 I_T$).
> - $e_t = y_t - X_t \\hat{\\beta}$ : le **résidu empirique** observable. En notant $M = I_T - X(X'X)^{-1}X'$, on a $e = M\\varepsilon$ avec $\\operatorname{Var}(e \\mid X) = \\sigma^2 M$ (les résidus sont hétéroscédastiques et corrélés en échantillon fini, car $\\operatorname{Var}(e_t) = \\sigma^2(1 - h_{tt})$ où $h_{tt}$ est l'effet levier).
>
> Dès que la matrice $X$ comporte une colonne de $1$, les équations normales $X'e = 0$ imposent algébriquement :
>
> $$\\sum_{t=1}^T e_t = 0 \\implies \\bar{e} = 0, \\qquad \\text{et} \\qquad \\sum_{t=1}^T x_{jt} e_t = 0 \\implies \\operatorname{Cov}(\\hat{y}, e) = 0$$
>
> **Avertissement ALM :** Obtenir $\\bar{e} = 0$ est une conséquence **algébrique automatique** de la présence de la constante ; cela vérifie l'absence d'erreur d'estimation, mais **ne prouve pas** que le modèle est bien spécifié (les résidus peuvent rester autocorrélés ou non-linéaires dans le temps).

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Sur $(1,2), (2,3), (3,5)$ avec $\\hat{y} = 0.333 + 1.50x$ : les résidus valent $e_1 = +0.167$, $e_2 = -0.333$, $e_3 = +0.167$, dont la somme est exactement $\\sum e_i = 0.000$ ($\\bar{e} = 0.0$).

#### 💻 Masterclass Code : \`model.resid\`, Orthogonalité & Epsilon Machine IEEE-754

L'attribut \`model.resid\` contient le vecteur des résidus empiriques. En arithmétique flottante \`float64\` (norme IEEE-754), une somme théoriquement nulle produit un ordre de grandeur proche de l'epsilon machine ($\\approx 10^{-16}$).

\`\`\`python
import statsmodels.api as sm

X = sm.add_constant(df[['euribor_3m']])
model = sm.OLS(df['oat_10y'], X).fit()

# 1. Extraction des résidus empiriques e = y - y_hat
residus = model.resid

# 2. Vérification de la moyenne nulle et de l'orthogonalité X'e = 0
ortho = X.values.T @ residus.values
print(f"Moyenne des résidus : {residus.mean():.6e}")
print(f"Produit scalaire X'e : [{ortho[0]:.2e}, {ortho[1]:.2e}]")

# 3. Inspection des écarts extrêmes dans l'échantillon
idx_min, idx_max = residus.idxmin(), residus.idxmax()
print(f"Min résidu : {residus[idx_min]:.4f} ({df.loc[idx_min, 'periode']}) | Max : {residus[idx_max]:.4f} ({df.loc[idx_max, 'periode']})")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Moyenne des résidus : -3.469447e-16
Produit scalaire X'e : [-5.55e-15, -3.33e-15]
Min résidu : -0.6374 (2020-Q4) | Max : 1.3605 (2022-Q2)
\`\`\`

La moyenne des résidus est nulle à $-3.47 \\times 10^{-16}$ près, mais l'écart maximal atteint $+1.3605\\%$ en \`2022-Q2\` (moment du pic inflationniste avant la remontée rapide de l'Euribor), révélant qu'une variable explicative majeure manque au modèle simple !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Distinguez la perturbation théorique $\\varepsilon_t$ du résidu estimé $e_t$ et expliquez pourquoi $\\bar{e} \\approx 10^{-16}$ découle mécaniquement des équations normales lorsque la constante est présente.

**Volet 2 — Laboratoire Code Python :**
Ajustez le modèle simple \`oat_10y ~ const + euribor_3m\`, extrayez \`residus = model.resid\` et \`moyenne_residus = residus.mean()\`, puis vérifiez numériquement que \`moyenne_residus\` est quasi-nulle ($< 10^{-4}$).`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nmodel = sm.OLS(df['oat_10y'], X).fit()\nresidus = model.resid\nmoyenne_residus = residus.mean()\nprint(f'Moyenne des résidus : {moyenne_residus:.6e}')",
        testPythonCode: "assert 'residus' in globals()\nassert abs(moyenne_residus) < 1e-4",
        hints: ["residus = model.resid puis residus.mean()"],
        datasets: []
      },
      {
        id: "py-15",
        title: "15. Régression Multivariée (Euribor + Inflation)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Estimez le modèle complet expliquant l'OAT par deux variables exogènes.",
        theoryMarkdown: `
### Régression Multivariée, Théorème de Frisch-Waugh-Lovell & Biais de Variable Omise

> 💡 **Démonstration & Fondements : L'Effet Ceteris Paribus (Équation de Fisher)**
> 
> Conformément à l'**équation de Fisher**, les taux longs nominaux intègrent à la fois le loyer de l'argent court (\`euribor_3m\`) et la prime d'inflation (\`inflation_hicp\`) :
>
> $$y_t = \\beta_0 + \\beta_1 x_{1t} + \\beta_2 x_{2t} + \\varepsilon_t \\iff y = X\\beta + \\varepsilon$$
>
> **Théorème de Frisch-Waugh-Lovell (FWL) :** Dans la régression multiple, le coefficient partiel $\\hat{\\beta}_2$ est rigoureusement égal au coefficient de la régression simple de $\\tilde{y}$ sur $\\tilde{x}_2$, où $\\tilde{y}$ et $\\tilde{x}_2$ sont les résidus purgés de l'influence linéaire de $x_1$ (et de la constante) :
>
> $$\\hat{\\beta}_2 = \\frac{\\tilde{x}_2' \\tilde{y}}{\\tilde{x}_2' \\tilde{x}_2}$$
>
> C'est la preuve algébrique exacte de l'interprétation ***ceteris paribus*** (toutes choses égales par ailleurs).
>
> **Formule du Biais de Variable Omise (OVB) :** Si l'on omet \`inflation_hicp\` (comme dans \`py-9\`), l'estimateur simple $\\hat{\\beta}_1^{\\text{court}}$ absorbe une partie de l'effet de l'inflation proportionnelle au lien entre inflation et Euribor ($\\hat{\\delta}_{21}$) :
>
> $$\\hat{\\beta}_1^{\\text{court}} = \\hat{\\beta}_1^{\\text{long}} + \\hat{\\beta}_2^{\\text{long}} \\cdot \\hat{\\delta}_{21}$$

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Avec $\\widehat{\\text{OAT}}_{10Y} = 0.50 + 0.80\\,\\text{Euribor}_{3M} + 0.35\\,\\text{Inflation}$, si l'Euribor monte de $+0.5\\%$ et l'inflation de $+1.0\\%$ simultanément, l'effet marginal combiné est $\\Delta \\widehat{\\text{OAT}} = 0.80(0.5) + 0.35(1.0) = +0.75\\text{ point}$.

#### 💻 Masterclass Code : Modèle Multivarié \`sm.add_constant(df[[...]])\` & Critères AIC/BIC

Pour inclure plusieurs régresseurs dans Statsmodels, passez une liste de colonnes \`df[['euribor_3m', 'inflation_hicp']]\` à \`sm.add_constant\`. Comparez la chute des critères d'information \`AIC\` / \`BIC\` et le bond du $\\bar{R}^2$ par rapport au modèle simple.

\`\`\`python
import statsmodels.api as sm

# 1. Matrice X multivariée : constante + deux facteurs macroéconomiques
X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
y = df['oat_10y']
model_multi = sm.OLS(y, X_multi).fit()
print(model_multi.summary())

# 2. Vérification de la formule du Biais de Variable Omise (OVB)
beta_simple = sm.OLS(y, sm.add_constant(df[['euribor_3m']])).fit().params['euribor_3m']
delta_21 = sm.OLS(df['inflation_hicp'], sm.add_constant(df[['euribor_3m']])).fit().params['euribor_3m']
ovb = model_multi.params['euribor_3m'] + model_multi.params['inflation_hicp'] * delta_21
print(f"OVB -> beta_euribor(multi) + beta_inf * delta_21 = {ovb:.4f} (beta_simple = {beta_simple:.4f})")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
                            OLS Regression Results                            
==============================================================================
Dep. Variable:                oat_10y   R-squared:                       0.984
Model:                            OLS   Adj. R-squared:                  0.982
Method:                 Least Squares   F-statistic:                     401.4
Date:                Wed, 18 Nov 2026   Prob (F-statistic):           2.07e-12
Time:                        19:52:13   Log-Likelihood:                 4.1802
No. Observations:                  16   AIC:                            -2.360
Df Residuals:                      13   BIC:                          -0.04260
Df Model:                           2                                         
Covariance Type:            nonrobust                                         
==================================================================================
                     coef    std err          t      P>|t|      [0.025      0.975]
----------------------------------------------------------------------------------
const             -0.0214      0.083     -0.256      0.802      -0.201       0.159
euribor_3m         0.6458      0.032     20.354      0.000       0.577       0.714
inflation_hicp     0.1943      0.017     11.765      0.000       0.159       0.230
==============================================================================
Omnibus:                        0.385   Durbin-Watson:                   1.403
Prob(Omnibus):                  0.825   Jarque-Bera (JB):                0.126
Skew:                          -0.199   Prob(JB):                        0.939
Kurtosis:                       2.825   Cond. No.                         8.97
==============================================================================

Notes:
[1] Standard Errors assume that the covariance matrix of the errors is correctly specified.
OVB -> beta_euribor(multi) + beta_inf * delta_21 = 0.7707 (beta_simple = 0.7707)
\`\`\`

Résultat spectaculaire : en ajoutant \`inflation_hicp\`, le $R^2$ bondit de \`0.814\` à \`0.984\` ($\\bar{R}^2 = 0.982$), l'\`AIC\` chute de \`34.92\` à \`-2.360\`, et le coefficient de l'Euribor passe de \`0.7707\` à \`0.6458\` — exactement corrigé du biais d'omission de l'inflation (\`0.6458 + 0.1943 * 0.6429 = 0.7707\`) !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez comment le théorème FWL formalise l'interprétation *ceteris paribus* et pourquoi le coefficient de l'Euribor diminue lorsque l'on ajoute l'inflation dans le modèle.

**Volet 2 — Laboratoire Code Python :**
Créez \`X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\` et \`y = df['oat_10y']\`, estimez \`model_multi = sm.OLS(y, X_multi).fit()\` et affichez \`print(model_multi.summary())\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\ny = df['oat_10y']\nmodel_multi = sm.OLS(y, X_multi).fit()\nprint(model_multi.summary())",
        testPythonCode: "assert 'model_multi' in globals()\nassert len(model_multi.params) == 3\nassert model_multi.rsquared > 0.85",
        hints: ["model_multi = sm.OLS(y, X_multi).fit()"],
        datasets: []
      },
      {
        id: "py-16",
        title: "16. Test Global de Fisher (F-Statistic)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Interprétez le test global de nullité conjointe de tous les coefficients.",
        theoryMarkdown: `
### Test de Significativité Globale : Statistique F de Fisher

> 💡 **Démonstration formelle : Test Contraint vs Non Contraint & Lien avec $R^2$**
> 
> Le test $F$ de Fisher-Snedecor vérifie si les $K$ variables explicatives du modèle expliquent **conjointement** la variance de $y$ :
> - $H_0: \\beta_1 = \\beta_2 = \\dots = \\beta_K = 0$ (modèle réduit à la seule constante : $SCR_c = SCT$).
> - $H_1: \\exists j \\in \\{1, \\dots, K\\},\\; \\beta_j \\neq 0$.
>
> En comparant la réduction de somme des carrés des résidus rapportée au nombre de contraintes $q = K$ à la variance résiduelle non biaisée du modèle complet ($SCR_{nc}/(T-K-1)$) :
>
> $$F = \\frac{(SCR_c - SCR_{nc}) / K}{SCR_{nc} / (T - K - 1)} = \\frac{SCE / K}{SCR / (T - K - 1)} = \\frac{R^2 / K}{(1 - R^2) / (T - K - 1)} \\sim \\mathcal{F}(K, T - K - 1)$$
>
> **Pourquoi ne pas se contenter de $K$ tests $t$ individuels ?**
> 1. Tester $K$ fois au seuil de $5\\%$ gonfle la probabilité globale de faux positif ($1 - 0.95^K$).
> 2. En présence de forte multicolinéarité, chaque test $t$ individuel peut échouer alors que les variables prédisent fortement $y$ ensemble ($F$ très élevé).
> 3. Dans le cas $K = 1$ (régression simple), on a exactement $F = t_1^2$.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Pour $T = 100$, $K = 2$ et $R^2 = 0.70$ :
>
> $$F = \\frac{0.70 / 2}{(1 - 0.70) / 97} = \\frac{0.350}{0.003093} = \\mathbf{113.16} \\gg \\mathcal{F}_{0.05}(2, 97) \\approx 3.09$$
>
> Rejet massif de $H_0$.

#### 💻 Masterclass Code : \`model.fvalue\`, \`model.f_pvalue\` & Tests Linéaires \`.f_test()\`

En plus de \`fvalue\` et \`f_pvalue\` (qui testent la nullité globale de tous les coefficients hors constante), Statsmodels offre \`.f_test("var1 = var2")\` pour tester n'importe quelle restriction linéaire $R\\beta = r$ en gestion des risques.

\`\`\`python
import statsmodels.api as sm

X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
model_multi = sm.OLS(df['oat_10y'], X_multi).fit()

# 1. Extraction directe de F et de sa p-valeur
f_stat = model_multi.fvalue
f_pval = model_multi.f_pvalue

# 2. Vérification analytique depuis R² (K=2, T=16 -> ddl = 2 et 13)
r2 = model_multi.rsquared
f_manuel = (r2 / 2) / ((1.0 - r2) / (len(df) - 2 - 1))
print(f"F Statsmodels : {f_stat:.4f} | Formule R² : {f_manuel:.4f} | Prob(F) : {f_pval:.4e}")

# 3. Test d'hypothèse linéaire arbitraire H0 : beta_euribor = beta_inflation
test_egalite = model_multi.f_test("euribor_3m = inflation_hicp")
print(f"Test H0 (beta_eur = beta_inf) -> F = {float(test_egalite.fvalue):.2f}, p = {float(test_egalite.pvalue):.4e}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
F Statsmodels : 401.4251 | Formule R² : 401.4251 | Prob(F) : 2.0662e-12
Test H0 (beta_eur = beta_inf) -> F = 125.08, p = 4.8416e-08
\`\`\`

Avec $F = 401.4251$ et $\\text{Prob}(F) = 2.0662 \\times 10^{-12}$, la significativité conjointe du modèle Euribor + Inflation est écrasante ; le test complémentaire rejette également l'égalité des deux sensibilités ($F = 125.08$).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Écrivez la formule reliant $F$ à $R^2$, $K$ et $T$, et expliquez pourquoi le test global de Fisher protège contre l'inflation du risque d'erreur de Type I liée aux tests multiples.

**Volet 2 — Laboratoire Code Python :**
À partir de \`model_multi\`, extrayez exactement \`f_stat = model_multi.fvalue\` et \`f_pval = model_multi.f_pvalue\` puis affichez-les.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nmodel_multi = sm.OLS(df['oat_10y'], X_multi).fit()\nf_stat = model_multi.fvalue\nf_pval = model_multi.f_pvalue\nprint(f'Statistique F : {f_stat:.2f} | Prob(F) : {f_pval:.4e}')",
        testPythonCode: "assert 'f_stat' in globals() and 'f_pval' in globals()\nassert f_pval < 0.01",
        hints: ["model_multi.fvalue et model_multi.f_pvalue"],
        datasets: []
      },
      {
        id: "py-17",
        title: "17. Diagnostic de Multicolinéarité (VIF)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Calculez le Facteur d'Inflation de la Variance (VIF).",
        theoryMarkdown: `
### Multicolinéarité & Facteur d'Inflation de la Variance (VIF)

> 💡 **Dérivation formelle : Impact de la colinéarité sur $\\operatorname{Var}(\\hat{\\beta}_j)$**
> 
> D'après le théorème de Frisch-Waugh-Lovell (ou par inversion par blocs de $(X'X)^{-1}$), la variance conditionnelle du $j$-ième coefficient MCO vaut $\\operatorname{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\tilde{x}_j'\\tilde{x}_j}$, où $\\tilde{x}_j$ est le résidu de la régression auxiliaire de $X_j$ sur les autres régresseurs. Comme $\\tilde{x}_j'\\tilde{x}_j = SCT_j (1 - R_j^2)$, il vient exactement :
>
> $$\\operatorname{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum_{t=1}^T (x_{jt} - \\bar{x}_j)^2} \\times \\underbrace{\\frac{1}{1 - R_j^2}}_{VIF_j}$$
>
> où $R_j^2$ est le coefficient de détermination de la régression de $X_j$ sur tous les autres prédicteurs (constante incluse).
> - **$VIF_j = 1$** : orthogonalité parfaite ($R_j^2 = 0$), aucune inflation de variance.
> - **$VIF_j > 5$** : multicolinéarité modérée, écarts-types gonflés d'un facteur $> \\sqrt{5} \\approx 2.24$.
> - **$VIF_j > 10$ ($R_j^2 > 0.90$)** : multicolinéarité sévère ; $(X'X)$ devient quasi-singulière (nombre de conditionnement élevé), rendant les signes et amplitudes de $\\hat{\\beta}_j$ instables à la moindre nouvelle donnée ALM.
> - **Remèdes** : supprimer une variable redondante, passer en différences premières, utiliser l'ACP ou la régression Ridge.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Si la régression auxiliaire de l'Euribor sur l'inflation donne $R_1^2 = 0.75$, la tolérance vaut $1 - 0.75 = 0.25$ et $VIF_1 = 1 / 0.25 = \\mathbf{4.0}$, doublant l'écart-type ($\\sqrt{4.0} = 2.0$) par rapport à des régresseurs orthogonaux.

#### 💻 Masterclass Code : \`variance_inflation_factor\` & Piège de la Constante

La fonction \`variance_inflation_factor(exog_matrix, exog_idx)\` attend un tableau NumPy 2D (\`X_multi.values\`) qui **doit obligatoirement contenir la colonne de constante à l'indice \`0\`** (sinon les $R_j^2$ auxiliaires sont non centrés et faux !). L'indice \`1\` correspond alors à la première variable explicative (\`'euribor_3m'\`).

\`\`\`python
import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

# 1. Audit complet du VIF sur toutes les colonnes de X_multi (avec constante en indice 0 !)
X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
vifs = {
    col: round(float(variance_inflation_factor(X_multi.values, i)), 4)
    for i, col in enumerate(X_multi.columns)
}
print("VIFs modèle sain :", vifs)

# 2. Démonstration : ajout d'une variable quasi-colinéaire à l'Euribor
X_colin = X_multi.copy()
X_colin['euribor_quasi'] = df['euribor_3m'] + np.linspace(0.0, 0.01, len(df))
vif_explose = float(variance_inflation_factor(X_colin.values, 1))
print(f"VIF Euribor avec variable quasi-colinéaire : {vif_explose:,.1f}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
VIFs modèle sain : {'const': 2.6001, 'euribor_3m': 1.1261, 'inflation_hicp': 1.1261}
VIF Euribor avec variable quasi-colinéaire : 3,052,164.5
\`\`\`

Avec un $R^2$ croisé entre \`euribor_3m\` et \`inflation_hicp\` de seulement $(0.3346)^2 \\approx 0.112$, le VIF vaut $1 / (1 - 0.112) = 1.1261 \\ll 5$ : le modèle multivarié est totalement sain ! En revanche, l'ajout d'une série quasi-colinéaire fait exploser le VIF au-delà de $3\\,000\\,000$.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Justifiez pourquoi une colinéarité forte laisse $\\hat{\\beta}_{\\text{OLS}}$ sans biais mais détruit sa précision ($\\operatorname{Var}(\\hat{\\beta}_j)$ multipliée par $VIF_j$), et pourquoi la colonne constante doit figurer dans \`X_multi\` lors du calcul.

**Volet 2 — Laboratoire Code Python :**
Importez \`variance_inflation_factor\` depuis \`statsmodels.stats.outliers_influence\`, construisez \`X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\` et calculez \`vif_euribor = variance_inflation_factor(X_multi.values, 1)\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.outliers_influence import variance_inflation_factor\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nvif_euribor = variance_inflation_factor(X_multi.values, 1)\nprint(f'VIF Euribor : {vif_euribor:.3f}')",
        testPythonCode: "assert 'vif_euribor' in globals()\nassert vif_euribor < 10.0",
        hints: ["variance_inflation_factor(X_multi.values, 1)"],
        datasets: []
      },
      {
        id: "py-18",
        title: "18. Test d'Hétéroscédasticité de Breusch-Pagan",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Vérifiez l'hypothèse d'homoscédasticité Var(e|X) = sigma^2.",
        theoryMarkdown: `
### Diagnostic d'Hétéroscédasticité : Test de Breusch-Pagan (1979)

> 💡 **Conséquences théoriques & Dérivation du Test LM ($\\chi^2(K)$)**
> 
> L'hypothèse d'homoscédasticité postule $\\operatorname{Var}(\\varepsilon_t \\mid X) = \\sigma^2$ constante dans le temps. En présence d'**hétéroscédasticité** ($\\operatorname{Var}(\\varepsilon_t \\mid X) = \\sigma_t^2$), l'estimateur $\\hat{\\beta}_{\\text{OLS}}$ reste **sans biais et convergent**, mais deux propriétés critiques s'effondrent :
> 1. Les MCO ne sont plus **BLUE** (les Moindres Carrés Généralisés sont plus efficaces).
> 2. La matrice de variance naïve $\\hat{\\sigma}^2 (X'X)^{-1}$ est **biaisée**, invalidant tous les tests $t$, $F$ et intervalles de confiance !
>
> **Test du Multiplicateur de Lagrange (Breusch-Pagan) :**
> On teste $H_0: \\sigma_t^2 = \\sigma^2$ contre $H_1: \\sigma_t^2 = \\gamma_0 + \\sum_{j=1}^K \\gamma_j X_{jt}$ en régressant le carré des résidus $e_t^2$ sur $X$ :
>
> $$e_t^2 = \\gamma_0 + \\gamma_1 X_{1t} + \\dots + \\gamma_K X_{Kt} + u_t$$
>
> Sous $H_0$, la statistique $LM$ converge asymptotiquement vers une loi du Chi-deux à $K$ degrés de liberté (version de Koenker robuste à la non-normalité) :
>
> $$LM = T \\cdot R^2_{\\text{aux}} \\xrightarrow{d} \\chi^2(K)$$
>
> Si la p-valeur est $< 0.05$, on rejette $H_0$ : l'utilisation d'écarts-types robustes (White) devient obligatoire.

![Diagnostic d'Hétéroscédasticité](/images/theory/fig_v1_heteroscedasticity.png)

> 🔍 **Comprendre ce graphique : Homoscédasticité vs Hétéroscédasticité**
> - **Homoscédasticité (gauche)** : La bande de dispersion des résidus reste stable le long des valeurs prédites.
> - **Hétéroscédasticité (droite — en entonnoir)** : La variance s'élargit avec le niveau des prédictions, faussant les écarts-types MCO classiques.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Sur $T = 120$ observations avec $K = 2$ régresseurs et $R^2_{\\text{aux}} = 0.10$ : $LM = 120 \\times 0.10 = \\mathbf{12.0} > \\chi^2_{0.95}(2) = 5.99$ ($p = 0.0025 < 0.05$), confirmant l'hétéroscédasticité.

#### 💻 Masterclass Code : \`het_breuschpagan\` & Tuple Unpacking (4 valeurs)

\`het_breuschpagan(residus, exog_het)\` attend le vecteur de résidus et la matrice complète des régresseurs **avec constante**. Elle retourne un tuple à 4 éléments \`(lm_stat, lm_pvalue, f_stat, f_pvalue)\` qu'il faut décompacter proprement.

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.diagnostic import het_breuschpagan

X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
model_multi = sm.OLS(df['oat_10y'], X_multi).fit()

# Unpacking du tuple à 4 éléments retourné par het_breuschpagan
lm_stat, p_val_bp, f_stat_bp, f_pval_bp = het_breuschpagan(model_multi.resid, X_multi)

print(f"Statistique LM (T * R²_aux) : {lm_stat:.4f} | p-valeur LM : {p_val_bp:.4e}")
print(f"Statistique F de Koenker    : {f_stat_bp:.4f} | p-valeur F  : {f_pval_bp:.4e}")
print("Diagnostic à 5 % :", "Hétéroscédasticité détectée (rejet H0)" if p_val_bp < 0.05 else "Homoscédasticité non rejetée")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Statistique LM (T * R²_aux) : 6.2725 | p-valeur LM : 4.3445e-02
Statistique F de Koenker    : 4.1913 | p-valeur F  : 3.9376e-02
Diagnostic à 5 % : Hétéroscédasticité détectée (rejet H0)
\`\`\`

Sur notre jeu de données macroéconomiques réel (\`2020-Q1\` à \`2023-Q4\`), la p-valeur de Breusch-Pagan ressort à $0.0434 < 0.05$ ($LM = 6.2725$) : l'homoscédasticité est **rejetée** au seuil de $5\\%$ ! Il faut corriger les écarts-types dès l'exercice suivant.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez pourquoi l'hétéroscédasticité ne biaise pas $\\hat{\\beta}_{\\text{OLS}}$ mais invalide ses tests d'hypothèses ($t$ et $F$), et décrivez le principe de la régression auxiliaire de Breusch-Pagan.

**Volet 2 — Laboratoire Code Python :**
Importez \`het_breuschpagan\` depuis \`statsmodels.stats.diagnostic\`, estimez \`model_multi\` et décompactez \`lm_stat, p_val_bp, f_stat, f_pval = het_breuschpagan(model_multi.resid, X_multi)\` afin de stocker et afficher \`p_val_bp\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.diagnostic import het_breuschpagan\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nmodel_multi = sm.OLS(df['oat_10y'], X_multi).fit()\nlm_stat, p_val_bp, f_stat, f_pval = het_breuschpagan(model_multi.resid, X_multi)\nprint(f'P-valeur Breusch-Pagan : {p_val_bp:.4e}')",
        testPythonCode: "assert 'p_val_bp' in globals()",
        hints: ["het_breuschpagan(model_multi.resid, X_multi)"],
        datasets: []
      },
      {
        id: "py-19",
        title: "19. Erreurs Standards Robustes de White (HC1 / HC3)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Ajustez le modèle avec la matrice de variance robuste de White.",
        theoryMarkdown: `
### Estimateur Robuste « Sandwich » d'Eicker-Huber-White (HC1 / HC3)

> 💡 **Dérivation formelle : La Matrice de Variance Asymptotique Sandwich (1980)**
> 
> Lorsque $\\operatorname{Var}(\\varepsilon \\mid X) = \\Omega = \\operatorname{diag}(\\sigma_1^2, \\dots, \\sigma_T^2)$, la vraie matrice de covariance conditionnelle de $\\hat{\\beta}_{\\text{OLS}} = (X'X)^{-1}X'y$ est :
>
> $$\\operatorname{Var}(\\hat{\\beta} \\mid X) = (X'X)^{-1} X' \\Omega X (X'X)^{-1} = (X'X)^{-1} \\left( \\sum_{t=1}^T \\sigma_t^2 x_t x_t' \\right) (X'X)^{-1}$$
>
> Halbert White (1980) démontre que même sans connaître la forme fonctionnelle de $\\sigma_t^2$, la matrice empirique centrale converge en probabilité vers la vraie « viande » du sandwich en remplaçant $\\sigma_t^2$ par le carré du résidu empirique $e_t^2$ :
> - **HC0** : $\\hat{\\Omega}_{tt} = e_t^2$ (sous-estime légèrement la variance à distance finie car $\\mathbb{E}[e_t^2] = \\sigma_t^2 (1 - h_{tt})$).
> - **HC1** : applique la correction des degrés de liberté $\\frac{T}{T - K - 1} e_t^2$ (standard économétrique par défaut).
> - **HC3** : $\\hat{\\Omega}_{tt} = \\frac{e_t^2}{(1 - h_{tt})^2}$, privilégié sur très petits échantillons ($T < 250$) avec points leviers.
>
> **Invariance essentielle :** Les coefficients estimés $\\hat{\\beta}$ restent **rigoureusement inchangés** ($\\hat{\\beta}_{\\text{HC1}} = \\hat{\\beta}_{\\text{OLS}}$) ; seuls les écarts-types, les $t$-statistiques et les p-valeurs sont corrigés.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Pour $\\hat{\\beta}_1 = 0.85$, si l'écart-type MCO naïf vaut $0.30$ ($t = 2.83$, $p = 0.005$ faux positif) alors que l'écart-type robuste HC1 vaut $0.55$ ($t = 1.55$, $p = 0.124$), la correction de White évite de conclure à tort à la significativité.

#### 💻 Masterclass Code : Option \`.fit(cov_type='HC1')\` dans Statsmodels

Dans Statsmodels, il suffit de passer l'argument nommé \`cov_type='HC1'\` (ou \`'HC3'\`) à \`.fit()\` pour substituer automatiquement la matrice de covariance sandwich à la matrice homoscédastique classique dans \`.bse\`, \`.tvalues\`, \`.pvalues\` et \`.summary()\`.

\`\`\`python
import pandas as pd
import statsmodels.api as sm

X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
y = df['oat_10y']

# Estimation classique vs estimateur Sandwich HC1 de White
m_ols = sm.OLS(y, X_multi).fit()
m_hc1 = sm.OLS(y, X_multi).fit(cov_type='HC1')

comparaison = pd.DataFrame({
    'coef_OLS': m_ols.params,
    'coef_HC1': m_hc1.params,   # strictement identiques !
    'SE_OLS': m_ols.bse,
    'SE_HC1': m_hc1.bse,        # corrigés de l'hétéroscédasticité
    't_OLS': m_ols.tvalues,
    't_HC1': m_hc1.tvalues,
})
print(comparaison.round(4))
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
                coef_OLS  coef_HC1  SE_OLS  SE_HC1    t_OLS    t_HC1
const            -0.0214   -0.0214  0.0833  0.0525  -0.2563  -0.4065
euribor_3m        0.6458    0.6458  0.0317  0.0299  20.3542  21.5863
inflation_hicp    0.1943    0.1943  0.0165  0.0180  11.7649  10.7791
\`\`\`

Les coefficients sont identiques (\`-0.0214\`, \`0.6458\`, \`0.1943\`), tandis que l'écart-type sur \`inflation_hicp\` augmente de \`0.0165\` à \`0.0180\` (ramenant $t$ de \`11.76\` à \`10.78\`), reflétant fidèlement la dispersion accrue durant le pic inflationniste de 2022.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Identifiez le « pain » $(X'X)^{-1}$ et la « viande » $\\sum e_t^2 x_t x_t'$ dans l'estimateur Sandwich, et justifiez pourquoi $\\hat{\\beta}_{\\text{HC1}}$ reste égal à $\\hat{\\beta}_{\\text{OLS}}$.

**Volet 2 — Laboratoire Code Python :**
Estimez \`model_robuste = sm.OLS(y, X_multi).fit(cov_type='HC1')\` avec \`y = df['oat_10y']\` et \`X_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\`, puis affichez \`model_robuste.bse\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\ny = df['oat_10y']\nmodel_robuste = sm.OLS(y, X_multi).fit(cov_type='HC1')\nprint('Écarts-types robustes HC1 :\\n', model_robuste.bse)",
        testPythonCode: "assert 'model_robuste' in globals()\nassert hasattr(model_robuste, 'bse')",
        hints: ["fit(cov_type='HC1')"],
        datasets: []
      },
      {
        id: "py-20",
        title: "20. Normalité des Perturbations & Test de Jarque-Bera",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Testez si les résidus suivent une loi normale gaussienne.",
        theoryMarkdown: `
### Normalité des Résidus & Test de Jarque-Bera (Skewness / Kurtosis)

> 💡 **Démonstration & Moments d'Ordre 3 et 4 : Queues Épaisses en Risque ALM**
> 
> La normalité des perturbations $\\varepsilon_t \\stackrel{\\text{iid}}{\\sim} \\mathcal{N}(0, \\sigma^2)$ assure l'exactitude à distance finie des lois de Student et de Fisher (crucial lorsque $T = 16$). En finance et actuariat, violer la normalité par excès de kurtosis (**queues épaisses / leptokurtiques**) fait sous-estimer dramatiquement la fréquence des krachs ou chocs de taux extrêmes.
>
> Soient le **Skewness** (asymétrie $S$) et le **Kurtosis** (aplatissement $K$) empiriques des résidus centrés :
>
> $$S = \\frac{\\frac{1}{T}\\sum_{t=1}^T e_t^3}{\\left(\\frac{1}{T}\\sum_{t=1}^T e_t^2\\right)^{3/2}}, \\qquad K = \\frac{\\frac{1}{T}\\sum_{t=1}^T e_t^4}{\\left(\\frac{1}{T}\\sum_{t=1}^T e_t^2\\right)^2}$$
>
> Pour une loi normale, $S = 0$ et $K = 3$. Sous $H_0$ de normalité, $\\sqrt{T/6}\\,S \\xrightarrow{d} \\mathcal{N}(0,1)$ et $\\sqrt{T/24}\\,(K - 3) \\xrightarrow{d} \\mathcal{N}(0,1)$ étant asymptotiquement indépendantes, la somme de leurs carrés suit une loi du Chi-deux à $2$ degrés de liberté (**Jarque & Bera, 1980**) :
>
> $$JB = \\frac{T}{6}\\left(S^2 + \\frac{(K - 3)^2}{4}\\right) \\xrightarrow{d} \\chi^2(2)$$
>
> Si la p-valeur est $< 0.05$ ($JB > 5.99$), on rejette l'hypothèse de normalité des perturbations.

![Asymétrie et Épaisseur des Queues](/images/theory/fig_fat_tails_jarque_bera.png)

> 🔍 **Comprendre ce graphique : Normalité vs Queues Épaisses**
> - **Courbe Gaussienne (bleue)** : Symétrie parfaite ($S = 0$) et aplatissement standard ($K = 3$).
> - **Distribution Réelle Empirique (rouge)** : Pic pointu et queues épaisses ($K > 3$), où les événements extrêmes sont bien plus fréquents qu'anticipé par un modèle gaussien.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Pour $T = 150$, $S = +0.50$ et $K = 4.20$ :
> $JB = \\frac{150}{6}\\left(0.50^2 + \\frac{(4.20 - 3)^2}{4}\\right) = 25 \\times (0.25 + 0.36) = \\mathbf{15.25} > 5.99$ ($p = 0.00049 < 0.05$), rejetant la normalité.

#### 💻 Masterclass Code : \`jarque_bera(resid)\` & Convention Kurtosis Statsmodels vs SciPy

\`jarque_bera(resid)\` retourne un tuple de 4 valeurs \`(jb_stat, p_val_jb, skew, kurt)\`. Attention : \`Statsmodels\` renvoie le **kurtosis total** ($K \\approx 3$ sous normalité), contrairement à \`scipy.stats.kurtosis\` qui renvoie par défaut l'excès de kurtosis ($K - 3 \\approx 0$).

\`\`\`python
import statsmodels.api as sm
from statsmodels.stats.stattools import jarque_bera

# Comparaison des résidus du modèle simple vs multivarié
m_simple = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m']])).fit()
m_multi = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m', 'inflation_hicp']])).fit()

# jarque_bera retourne (statistique JB, p-valeur, skewness, kurtosis_total)
jb_s, p_s, sk_s, ku_s = jarque_bera(m_simple.resid)
jb_m, p_m, sk_m, ku_m = jarque_bera(m_multi.resid)

print(f"Simple     -> JB={jb_s:.4f} | p-val={p_s:.4f} | Skew={sk_s:.4f} | Kurt={ku_s:.4f}")
print(f"Multivarié -> JB={jb_m:.4f} | p-val={p_m:.4f} | Skew={sk_m:.4f} | Kurt={ku_m:.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Simple     -> JB=3.0237 | p-val=0.2205 | Skew=1.0591 | Kurt=2.7793
Multivarié -> JB=0.1261 | p-val=0.9389 | Skew=-0.1991 | Kurt=2.8252
\`\`\`

Dans le modèle multivarié, l'ajout de l'inflation absorbe l'asymétrie positive (\`Skew\` chute de \`+1.0591\` à \`-0.1991\`), donnant $JB = 0.1261$ ($p = 0.9389$) : la normalité des résidus est parfaitement validée !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez comment le Skewness $S$ et le Kurtosis $K$ entrent dans la statistique $JB \\sim \\chi^2(2)$ et pourquoi un kurtosis $K > 3$ rend dangereuse la sous-estimation des queues en gestion des risques.

**Volet 2 — Laboratoire Code Python :**
Importez \`jarque_bera\` depuis \`statsmodels.stats.stattools\`, estimez \`model_multi\` et calculez \`jb_stat, p_val_jb, skew, kurt = jarque_bera(model_multi.resid)\`, puis affichez \`jb_stat\` et \`p_val_jb\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.stattools import jarque_bera\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nmodel_multi = sm.OLS(df['oat_10y'], X_multi).fit()\njb_stat, p_val_jb, skew, kurt = jarque_bera(model_multi.resid)\nprint(f'Statistique JB : {jb_stat:.2f} | P-valeur : {p_val_jb:.4f}')",
        testPythonCode: "assert 'p_val_jb' in globals()",
        hints: ["jarque_bera(model_multi.resid)"],
        datasets: []
      },
      {
        id: "py-21",
        title: "21. Séries Temporelles & Régression Fallacieuse",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Comprenez pourquoi deux séries non stationnaires créent une fausse causalité.",
        theoryMarkdown: `
### Séries Temporelles, Régression Fallacieuse & Statistique de Durbin-Watson

> 💡 **Théorème de Granger-Newbold (1974) / Phillips (1986) & Durbin-Watson**
> 
> En économétrie des séries temporelles, une marche aléatoire $y_t = y_{t-1} + u_t$ ($I(1)$) possède une variance non bornée qui croît linéairement avec le temps :
>
> $$\\operatorname{Var}(y_t) = t \\sigma_u^2 \\xrightarrow[t \\to \\infty]{} \\infty$$
>
> **Théorème de Phillips (1986) :** Si l'on régresse en niveau deux marches aléatoires **totalement indépendantes** ($y_t$ et $x_t$), les asymptotiques standards s'effondrent : $\\hat{\\beta}_{\\text{OLS}}$ ne converge pas vers $0$, $R^2$ reste élevé, et la statistique de Student diverge comme $|t| = \\mathcal{O}_p(\\sqrt{T}) \\to \\infty$ (**régression fallacieuse** / *spurious regression*).
>
> Pour détecter cette pathologie ou une autocorrélation sérielle d'ordre 1 ($e_t = \\rho e_{t-1} + \\eta_t$), on calcule la **statistique de Durbin-Watson** :
>
> $$DW = \\frac{\\sum_{t=2}^T (e_t - e_{t-1})^2}{\\sum_{t=1}^T e_t^2} \\approx 2(1 - \\hat{\\rho}_1) \\in [0, 4]$$
>
> - **$DW \\approx 2$** : absence d'autocorrélation ($\\hat{\\rho}_1 \\approx 0$).
> - **$DW \\approx 0$** : forte autocorrélation positive ($\\hat{\\rho}_1 \\to 1$, symptôme classique de non-stationnarité résiduelle).
> - **Règle d'or de Granger-Newbold** : si **$R^2 > DW$**, alerte rouge immédiate de régression fallacieuse !

![Régression Spurieuse en Séries Temporelles](/images/theory/fig_v1_spurious_regression.png)

> 🔍 **Comprendre ce graphique : Le Piège de Granger-Newbold**
> - Deux marches aléatoires indépendantes dérivent au cours du temps par accumulation de chocs non stationnaires.
> - La régression en niveau crée l'illusion d'une relation forte ($R^2$ élevé) alors que les résidus restent fortement autocorrélés ($DW \\approx 0$).

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Si $R^2 = 0.82$ et l'autocorrélation résiduelle vaut $\\hat{\\rho}_1 = 0.985$, alors $DW \\approx 2(1 - 0.985) = \\mathbf{0.030} \\ll R^2 = 0.82$ : la régression en niveau est fallacieuse et doit être stationnarisée.

#### 💻 Masterclass Code : \`durbin_watson(resid)\` & Comparaison Simple vs Multivarié

La fonction \`durbin_watson(model.resid)\` du module \`statsmodels.stats.stattools\` calcule directement le ratio exact sur le vecteur des résidus. Comparons nos deux modèles sur \`df\` et simulons numériquement une vraie régression fallacieuse sur deux marches aléatoires indépendantes.

\`\`\`python
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson

m_simple = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m']])).fit()
m_multi = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m', 'inflation_hicp']])).fit()

dw_simple = durbin_watson(m_simple.resid)
dw_multi = durbin_watson(m_multi.resid)
print(f"Simple     -> R²={m_simple.rsquared:.4f} vs DW={dw_simple:.4f} (R² > DW : alerte !)")
print(f"Multivarié -> R²={m_multi.rsquared:.4f} vs DW={dw_multi:.4f}")

# Illustration : deux marches aléatoires indépendantes (régression fallacieuse pure)
rng = np.random.default_rng(42)
rw1 = np.cumsum(rng.normal(size=200))
rw2 = np.cumsum(rng.normal(size=200))
m_sp = sm.OLS(rw1, sm.add_constant(rw2)).fit()
print(f"Marches aléatoires indépendantes -> faux R²={m_sp.rsquared:.4f}, DW={durbin_watson(m_sp.resid):.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Simple     -> R²=0.8144 vs DW=0.3403 (R² > DW : alerte !)
Multivarié -> R²=0.9841 vs DW=1.4031
Marches aléatoires indépendantes -> faux R²=0.5752, DW=0.1429
\`\`\`

Le modèle simple présente $R^2 = 0.8144 > DW = 0.3403$ (symptôme aigu d'erreur persistante), tandis que l'ajout de l'inflation remonte le Durbin-Watson à \`1.4031 > 0.9841\` — même s'il subsiste une autocorrélation positive modérée qui justifie de tester la stationnarité des séries !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Écrivez l'approximation $DW \\approx 2(1 - \\hat{\\rho}_1)$ et expliquez pourquoi la règle empirique $R^2 > DW$ signale une régression potentiellement fallacieuse sur des séries non stationnaires.

**Volet 2 — Laboratoire Code Python :**
Importez \`durbin_watson\` depuis \`statsmodels.stats.stattools\`, ajustez \`model_multi\` (\`oat_10y ~ const + euribor_3m + inflation_hicp\`), calculez \`dw_stat = durbin_watson(model_multi.resid)\` et affichez-le.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nfrom statsmodels.stats.stattools import durbin_watson\nX_multi = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nmodel_multi = sm.OLS(df['oat_10y'], X_multi).fit()\ndw_stat = durbin_watson(model_multi.resid)\nprint(f'Statistique Durbin-Watson : {dw_stat:.4f}')",
        testPythonCode: "assert 'dw_stat' in globals()\nassert dw_stat > 0",
        hints: ["durbin_watson(model_multi.resid)"],
        datasets: []
      },
      {
        id: "py-22",
        title: "22. Test de Racine Unitaire ADF (Dickey-Fuller Augmenté)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 15,
        description: "Testez formellement la stationnarité d'une série temporelle.",
        theoryMarkdown: `
### Test de Racine Unitaire : Augmented Dickey-Fuller (ADF)

> 💡 **Formalisation mathématique : Équation ADF & Distribution Non Standard**
> 
> Une série $y_t$ suit une marche aléatoire si $y_t = \\rho y_{t-1} + u_t$ avec $\\rho = 1$. En soustrayant $y_{t-1}$ et en ajoutant une constante $\\mu$ ainsi que $p$ retards différenciés $\\Delta y_{t-i}$ pour blanchir l'autocorrélation des erreurs $u_t$, on obtient l'équation du **test de Dickey-Fuller Augmenté (ADF)** :
>
> $$\\Delta y_t = \\mu + \\gamma y_{t-1} + \\sum_{i=1}^p \\phi_i \\Delta y_{t-i} + u_t, \\quad (\\gamma = \\rho - 1)$$
>
> - **Hypothèse nulle $H_0$** : $\\gamma = 0$ ($\\rho = 1$, présence d'une **racine unitaire**, série non-stationnaire $I(1)$).
> - **Hypothèse alternative $H_1$** : $\\gamma < 0$ ($\\rho < 1$, série **stationnaire** $I(0)$ à retour à la moyenne).
>
> **Subtilité fondamentale :** Sous $H_0$, $y_{t-1}$ est non-stationnaire ; la statistique $t_{\\text{ADF}} = \\hat{\\gamma} / \\widehat{SE}(\\hat{\\gamma})$ **ne suit pas une loi de Student** mais une fonctionnelle asymétrique du mouvement brownien ($\\frac{\\int_0^1 W_s dW_s}{\\sqrt{\\int_0^1 W_s^2 ds}}$), dont les seuils critiques de MacKinnon à $5\\%$ sont plus négatifs (ex : $-2.88$ à $-3.13$ selon $T$).
>
> **Note statistique sur la puissance en petit échantillon :** Avec seulement $T = 15$ observations trimestrielles marquées par le choc monétaire de 2022-2023, la puissance du test ADF est mécaniquement faible : même après différenciation première, un test asymptotique peut afficher $p > 0.05$ faute de recul temporel suffisant.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Si $\\Delta y_t = 0.12 - 0.04 y_{t-1} + u_t$ sur $T = 100$ avec $\\hat{\\gamma} = -0.04$ et $\\widehat{SE}(\\hat{\\gamma}) = 0.025$, alors $t_{\\text{ADF}} = -0.04 / 0.025 = \\mathbf{-1.60} > -2.88$ (seuil à $5\\%$) : on ne rejette pas $H_0$, la série en niveau reste $I(1)$.

#### 💻 Masterclass Code : \`adfuller()\` — Tuple de Sortie et \`.diff().dropna()\`

La fonction \`adfuller\` exige impérativement une série sans valeurs manquantes : l'enchaînement \`.diff().dropna()\` supprime le \`NaN\` de la première ligne créé par la différenciation. \`adfuller\` renvoie 6 éléments : \`(adf_stat, p_value, usedlag, nobs, critical_values_dict, icbest)\`.

\`\`\`python
from statsmodels.tsa.stattools import adfuller

# 1. Test ADF sur série en niveau vs série différenciée (.diff().dropna())
res_eur = adfuller(df['euribor_3m'])
res_oat_diff = adfuller(df['oat_10y'].diff().dropna())
res_cac = adfuller(df['cac40_rendement'])

print(f"Euribor 3M (niveau)     -> ADF={res_eur[0]:.4f}, p={res_eur[1]:.4f}, lags={res_eur[2]}, nobs={res_eur[3]}")
print(f"OAT 10Y (diff. prem.)   -> ADF={res_oat_diff[0]:.4f}, p={res_oat_diff[1]:.4e}, lags={res_oat_diff[2]}, nobs={res_oat_diff[3]}")
print(f"Seuils critiques OAT diff (1%, 5%, 10%) : { {k: round(float(v), 3) for k, v in res_oat_diff[4].items()} }")
print(f"CAC 40 rendement (I(0)) -> ADF={res_cac[0]:.4f}, p={res_cac[1]:.4e}")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Euribor 3M (niveau)     -> ADF=-1.5289, p=0.5192, lags=6, nobs=9
OAT 10Y (diff. prem.)   -> ADF=-2.2614, p=1.8473e-01, lags=1, nobs=13
Seuils critiques OAT diff (1%, 5%, 10%) : {'1%': -4.069, '5%': -3.127, '10%': -2.702}
CAC 40 rendement (I(0)) -> ADF=-4.3335, p=3.8849e-04
\`\`\`

On constate exactement en pratique l'effet de la taille d'échantillon : sur l'Euribor en niveau ($p = 0.5192$) comme sur l'OAT différenciée avec seulement \`nobs = 13\` observations utiles ($ADF = -2.2614 > -3.127$, $p = 0.1847$), le test manque de puissance à $T=15$ ; à l'inverse, \`cac40_rendement\` (déjà une série de rendements $I(0)$) rejette nettement la racine unitaire ($p = 3.88 \\times 10^{-4}$).
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Écrivez l'équation du test ADF avec $\\gamma = \\rho - 1$, indiquez le sens des hypothèses $H_0$ vs $H_1$ et expliquez pourquoi la statistique $t_{\\text{ADF}}$ doit être comparée aux seuils négatifs de MacKinnon (et pourquoi la puissance chute lorsque $T$ est petit).

**Volet 2 — Laboratoire Code Python :**
Importez \`adfuller\` depuis \`statsmodels.tsa.stattools\`, calculez \`serie_diff = df['oat_10y'].diff().dropna()\`, exécutez \`result_adf = adfuller(serie_diff)\` et stockez \`p_val_adf = result_adf[1]\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "from statsmodels.tsa.stattools import adfuller\nserie_diff = df['oat_10y'].diff().dropna()\nresult_adf = adfuller(serie_diff)\np_val_adf = result_adf[1]\nprint(f'P-valeur ADF sur OAT différenciée : {p_val_adf:.4e}')",
        testPythonCode: "assert 'p_val_adf' in globals() and 'result_adf' in globals()\nassert 0.0 <= p_val_adf <= 1.0, 'La p-valeur ADF doit être comprise entre 0 et 1.'",
        hints: ["result_adf[1] correspond à la p-valeur."],
        datasets: []
      },
      {
        id: "py-23",
        title: "23. Modèle Dynamique en Différences Premières (Stationnaire)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Estimez la relation instantanée entre variations de taux sans biais fallacieux.",
        theoryMarkdown: `
### Stationnarisation par Différences Premières & Modèle Dynamique

> 💡 **Démonstration formelle : Opérateur Retard $L$, Rendements & Dynamique de Court Terme**
> 
> Soit l'opérateur retard $L y_t = y_{t-1}$. La **différence première** s'écrit :
>
> $$\\Delta y_t = (1 - L) y_t = y_t - y_{t-1}$$
>
> Si $y_t$ est une marche aléatoire avec dérive $y_t = \\mu + y_{t-1} + u_t$ ($I(1)$) où $u_t$ est un bruit blanc stationnaire, sa variance croît indéfiniment avec $t$, mais sa différence première devient **strictement stationnaire ($I(0)$)** :
>
> $$\\Delta y_t = \\mu + u_t \\implies \\mathbb{E}[\\Delta y_t] = \\mu \\quad \\text{et} \\quad \\operatorname{Var}(\\Delta y_t) = \\sigma_u^2 \\quad (\\text{constantes dans le temps})$$
>
> **Interprétation financière et ALM :**
> - Pour des prix d'actifs $P_t$, la différence logarithmique $\\Delta \\ln(P_t) = \\ln(P_t / P_{t-1})$ donne le rendement continu stationnaire.
> - Pour des taux d'intérêt ($r_t$), passer aux variations trimestrielles $\\Delta r_t$ permet d'estimer la **dynamique instantanée de court terme** ($\\Delta \\text{OAT}_t = \\alpha + \\beta_1 \\Delta \\text{Euribor}_t + \\beta_2 \\Delta \\text{Inflation}_t + u_t$) tout en éliminant le risque de régression fallacieuse et d'autocorrélation résiduelle.

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Si $y = [10.0,\\; 12.5,\\; 14.1,\\; 16.8]$ dérive sans retour à la moyenne, la série différenciée $\\Delta y = [+2.5,\\; +1.6,\\; +2.7]$ oscille de manière bornée autour de $\\overline{\\Delta y} = +2.27$.

#### 💻 Masterclass Code : \`.diff().dropna()\` Multi-Colonnes en Pandas

Appliquer \`.diff().dropna()\` simultanément sur un sous-DataFrame de plusieurs colonnes garantit l'alignement strict des dates (on perd uniquement la première ligne \`2020-Q1\`, passant de $16$ à $15$ trimestres) avant de ré-estimer les MCO avec \`Statsmodels\`.

\`\`\`python
import statsmodels.api as sm

# 1. Passage en différences premières sur les 3 séries et suppression du NaN initial
df_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()
print(f"Observations : {len(df)} en niveau -> {len(df_diff)} en différences premières")

# 2. Estimation du modèle dynamique stationnaire
X_dyn = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp']])
y_dyn = df_diff['oat_10y']
model_dyn = sm.OLS(y_dyn, X_dyn).fit()
print(model_dyn.summary())
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Observations : 16 en niveau -> 15 en différences premières
                            OLS Regression Results                            
==============================================================================
Dep. Variable:                oat_10y   R-squared:                       0.630
Model:                            OLS   Adj. R-squared:                  0.569
Method:                 Least Squares   F-statistic:                     10.22
Date:                Wed, 18 Nov 2026   Prob (F-statistic):            0.00256
Time:                        19:52:13   Log-Likelihood:                 1.1097
No. Observations:                  15   AIC:                             3.781
Df Residuals:                      12   BIC:                             5.905
Df Model:                           2                                         
Covariance Type:            nonrobust                                         
==================================================================================
                     coef    std err          t      P>|t|      [0.025      0.975]
----------------------------------------------------------------------------------
const              0.0258      0.083      0.312      0.760      -0.154       0.206
euribor_3m         0.5587      0.167      3.336      0.006       0.194       0.924
inflation_hicp     0.1991      0.050      3.962      0.002       0.090       0.309
==============================================================================
Omnibus:                        4.916   Durbin-Watson:                   1.962
Prob(Omnibus):                  0.086   Jarque-Bera (JB):                2.157
Skew:                           0.707   Prob(JB):                        0.340
Kurtosis:                       4.204   Cond. No.                         3.77
==============================================================================

Notes:
[1] Standard Errors assume that the covariance matrix of the errors is correctly specified.
\`\`\`

Regardez la statistique de **Durbin-Watson** dans ce modèle dynamique : elle atteint exactement **\`1.962\`** (contre \`0.340\` en simple niveau et \`1.403\` en multivarié niveau) ! L'autocorrélation sérielle a totalement disparu, et les chocs trimestriels d'Euribor (\`+0.5587\`, $p = 0.006$) comme d'inflation (\`+0.1991\`, $p = 0.002$) restent hautement significatifs.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Distinguez ce que mesure une régression en niveau (relation d'équilibre de long terme, exposée au piège fallacieux sans cointégration) d'une régression en différences premières $\\Delta y_t$ (transmission dynamique des chocs de court terme).

**Volet 2 — Laboratoire Code Python :**
Créez \`df_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()\`, construisez \`X_dyn = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp']])\` et \`y_dyn = df_diff['oat_10y']\`, ajustez \`model_dyn = sm.OLS(y_dyn, X_dyn).fit()\` et affichez \`model_dyn.summary()\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\ndf_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()\nX_dyn = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp']])\ny_dyn = df_diff['oat_10y']\nmodel_dyn = sm.OLS(y_dyn, X_dyn).fit()\nprint(model_dyn.summary())",
        testPythonCode: "assert 'model_dyn' in globals()\nassert len(model_dyn.params) == 3",
        hints: ["model_dyn = sm.OLS(y_dyn, X_dyn).fit()"],
        datasets: []
      },
      {
        id: "py-24",
        title: "24. Correction Robuste de Newey-West (HAC)",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Corrigez à la fois l'autocorrélation et l'hétéroscédasticité temporelle.",
        theoryMarkdown: `
### Estimateur de Variance Robuste HAC de Newey-West (Noyau de Bartlett)

> 💡 **Démonstration formelle : Pourquoi le noyau triangulaire $w_l = 1 - \\frac{l}{L+1}$ ?**
> 
> Lorsque les perturbations présentent à la fois de l'hétéroscédasticité et une autocorrélation jusqu'au retard $L$ ($\\mathbb{E}[e_t e_{t-l}] \\neq 0$), la matrice centrale « viande » du sandwich doit intégrer les autocovariances croisées $\\hat{\\Gamma}_l = \\frac{1}{T}\\sum_{t=l+1}^T (e_t x_t)(e_{t-l} x_{t-l})'$ :
>
> $$\\hat{\\Omega}_{\\text{HAC}} = \\hat{\\Gamma}_0 + \\sum_{l=1}^L w_l \\left( \\hat{\\Gamma}_l + \\hat{\\Gamma}_l' \\right)$$
>
> Si l'on utilisait des poids uniformes $w_l = 1$, la matrice tronquée pourrait posséder des valeurs propres négatives (variances négatives impossibles !). Newey et West (1987) résolvent ce problème grâce au **noyau triangulaire de Bartlett**, dont la transformée spectrale est toujours positive, garantissant que $\\hat{\\Omega}_{\\text{HAC}}$ reste **semi-définie positive** :
>
> $$w_l = 1 - \\frac{l}{L + 1} \\quad \\text{pour } l = 1, \\dots, L$$
>
> Le choix de la bande passante suit typiquement la règle de Newey-West $L \\approx \\lfloor 4(T/100)^{2/9} \\rfloor$ (soit $L \\approx 2$ pour $T \\approx 15$ à $20$ trimestres).

> ✏️ **Exemple chiffré & Résolution pas-à-pas :**
> Pour $L = 2$ : $w_1 = 1 - \\frac{1}{3} = \\mathbf{0.667}$ et $w_2 = 1 - \\frac{2}{3} = \\mathbf{0.333}$. Si $\\hat{\\Gamma}_0 = 1.0$, $\\hat{\\Gamma}_1 = 0.30$ et $\\hat{\\Gamma}_2 = 0.15$, alors $\\hat{\\Omega}_{\\text{HAC}} = 1.0 + 2(0.667 \\times 0.30 + 0.333 \\times 0.15) = \\mathbf{1.50}$, multipliant l'écart-type par $\\sqrt{1.50} \\approx 1.225$.

#### 💻 Masterclass Code : \`.fit(cov_type='HAC', cov_kwds={'maxlags': 2})\`

Dans Statsmodels, l'option \`cov_type='HAC'\` s'accompagne d'un dictionnaire \`cov_kwds={'maxlags': L}\` fixant la fenêtre de Bartlett. Notez que pour les estimateurs asymptotiques robustes (\`HC\`, \`HAC\`), Statsmodels affiche par défaut des statistiques normales asymptotiques $z$ ($P > |z|$) au lieu de $t$.

\`\`\`python
import pandas as pd
import statsmodels.api as sm

df_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()
X_dyn = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp']])
y_dyn = df_diff['oat_10y']

# 1. MCO classiques vs correction Newey-West HAC avec bande passante L=2
model_ols = sm.OLS(y_dyn, X_dyn).fit()
model_hac = sm.OLS(y_dyn, X_dyn).fit(cov_type='HAC', cov_kwds={'maxlags': 2})

# 2. Comparaison des écarts-types et p-valeurs (z-statistique sous HAC)
comp = pd.DataFrame({
    'coef': model_hac.params,
    'SE_OLS': model_ols.bse,
    'SE_HAC_L2': model_hac.bse,
    'z_HAC': model_hac.tvalues,
    'p_HAC': model_hac.pvalues,
})
print(comp.round(4))
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
                  coef  SE_OLS  SE_HAC_L2   z_HAC   p_HAC
const           0.0258  0.0827     0.0548  0.4710  0.6377
euribor_3m      0.5587  0.1675     0.0903  6.1856  0.0000
inflation_hicp  0.1991  0.0503     0.0338  5.8890  0.0000
\`\`\`

Les coefficients (\`0.5587\` et \`0.1991\`) restent inchangés tandis que les écarts-types HAC ajustés confirment une significativité écrasante ($z_{\\text{euribor}} = 6.19$, $z_{\\text{inflation}} = 5.89$, $p < 10^{-4}$). *(Note : sur un si petit échantillon de $T=15$ avec quasi-absence d'autocorrélation, $DW = 1.962$, la correction asymptotique réduit même les écarts-types car les autocovariances négatives au retard 1 ou 2 compensent $\\hat{\\Gamma}_0$.)*
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Justifiez pourquoi les poids décroissants du noyau de Bartlett $w_l = 1 - \\frac{l}{L+1}$ sont indispensables pour garantir que la matrice de covariance estimée $\\hat{\\Omega}_{\\text{HAC}}$ reste semi-définie positive.

**Volet 2 — Laboratoire Code Python :**
Sur \`df_diff\` (modèle dynamique en différences premières), estimez \`model_hac = sm.OLS(y_dyn, X_dyn).fit(cov_type='HAC', cov_kwds={'maxlags': 2})\` et affichez \`print(model_hac.summary())\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\ndf_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()\nX_dyn = sm.add_constant(df_diff[['euribor_3m', 'inflation_hicp']])\ny_dyn = df_diff['oat_10y']\nmodel_hac = sm.OLS(y_dyn, X_dyn).fit(cov_type='HAC', cov_kwds={'maxlags': 2})\nprint(model_hac.summary())",
        testPythonCode: "assert 'model_hac' in globals()\nassert hasattr(model_hac, 'bse')",
        hints: ["cov_type='HAC', cov_kwds={'maxlags': 2}"],
        datasets: []
      },
      {
        id: "py-25",
        title: "25. Graphique Matplotlib : Observé vs Prédit",
        category: "econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Visualisez la qualité d'ajustement économétrique sur la série temporelle.",
        theoryMarkdown: `
### Visualisation Économétrique : Courbe Observée vs Prédite (Matplotlib)

> 💡 **Méthodologie de diagnostic visuel : Pourquoi le graphique complète le $R^2$ ?**
> 
> Deux modèles économétriques peuvent afficher exactement le même $R^2$ et les mêmes p-valeurs tout en ayant des comportements radicalement opposés (quartet d'Anscombe, ruptures structurelles non détectées). Tracer simultanément la série observée $y_t$ et les valeurs prédites $\\hat{y}_t = X\\hat{\\beta}$ (\`model.fittedvalues\`) révèle instantanément trois informations critiques pour un comité ALM :
> 1. **Suivi des points d'inflexion** : le modèle capture-t-il le retournement des taux de \`2022-Q1\` à \`2023-Q4\` sans décalage temporel (*lag*) ?
> 2. **Persistance des écarts verticaux ($e_t = y_t - \\hat{y}_t$)** : si la courbe prédite reste durablement au-dessus puis durablement en dessous de la courbe observée, c'est la signature visuelle immédiate d'une autocorrélation positive ($DW < 1.5$) ou d'une non-linéarité.
> 3. **Stabilité entre régimes** : la précision est-elle homogène en régime de taux négatifs (\`2020-2021\`) et en régime de hausse rapide (\`2022-2023\`) ?

#### 💻 Masterclass Code : Architecture Matplotlib (\`Figure\` & \`Axes\`), Styles & \`model.fittedvalues\`

Matplotlib repose sur une hiérarchie à deux niveaux :
- La **\`Figure\`** : le canevas global de l'image (taille définie par \`figsize=(largeur, hauteur)\` en pouces).
- L'**\`Axes\`** : la zone de tracé contenant les données, les graduations, le titre et la légende.
Que l'on passe par l'API objet (\`fig, ax = plt.subplots()\`) ou l'API d'état (\`plt.figure()\`, \`plt.plot(...)\`, \`plt.show()\`), \`model.fittedvalues\` fournit directement la \`pd.Series\` alignée des $\\hat{y}_t$ prête à tracer, et \`plt.tight_layout()\` empêche le rognage des étiquettes de trimestres.

\`\`\`python
import numpy as np
import pandas as pd
import statsmodels.api as sm
import matplotlib.pyplot as plt

X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])
y = df['oat_10y']
model = sm.OLS(y, X).fit()

# Préparation du graphique Observé vs Prédit (Figure & Axes)
fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(df['periode'], y, label='OAT 10Y Observée', marker='o', color='#0284c7')
ax.plot(df['periode'], model.fittedvalues, label='OAT 10Y Prédite', linestyle='--', color='#059669')
ax.set_title('Modèle Économétrique ALM : OAT 10Y vs Euribor & Inflation')
ax.legend()
fig.tight_layout()
plt.close(fig)

# Inspection chiffrée des valeurs tracées
tableau_plot = pd.DataFrame({
    'periode': df['periode'],
    'oat_observee': y,
    'oat_predite': model.fittedvalues.round(3),
    'residu': model.resid.round(3),
})
print(tableau_plot.iloc[[0, 5, 8, 10, 14, 15]].to_string(index=False))
print(f"RMSE d'ajustement : {np.sqrt(np.mean(model.resid ** 2)):.4f} %")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
periode  oat_observee  oat_predite  residu
2020-Q1         -0.15       -0.157   0.007
2021-Q2          0.14       -0.001   0.141
2022-Q1          0.89        1.093  -0.203
2022-Q3          2.71        2.516   0.194
2023-Q3          3.40        3.300   0.100
2023-Q4          3.10        3.074   0.026
RMSE d'ajustement : 0.1863 %
\`\`\`

**Lecture fidèle du graphique produit :** La courbe bleue pleine avec marqueurs ronds (\`OAT 10Y Observée\`, partant de \`-0.15 %\` en \`2020-Q1\` jusqu'au pic de \`3.40 %\` en \`2023-Q3\`) et la courbe verte pointillée (\`OAT 10Y Prédite\`) restent quasi superposées sur toute la période (\`RMSE = 0.1863 %\`), l'écart maximal n'excédant pas \`0.39 %\` lors de la poussée initiale de l'inflation en 2022.
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Expliquez comment le tracé conjoint de $y_t$ et $\\hat{y}_t$ permet de diagnostiquer visuellement une rupture de régime ou une autocorrélation des résidus, et distinguez les rôles des objets \`Figure\` et \`Axes\` en Matplotlib.

**Volet 2 — Laboratoire Code Python :**
Estimez \`model = sm.OLS(y, X).fit()\` avec \`X = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\` et \`y = df['oat_10y']\`, puis tracez \`y\` et \`model.fittedvalues\` sur le même graphique Matplotlib en terminant par \`plt.tight_layout()\` et \`plt.show()\`.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "import statsmodels.api as sm\nimport matplotlib.pyplot as plt\nX = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\ny = df['oat_10y']\nmodel = sm.OLS(y, X).fit()\nplt.figure(figsize=(9, 4))\nplt.plot(df['periode'], y, label='OAT 10Y Observée', marker='o', color='#0284c7')\nplt.plot(df['periode'], model.fittedvalues, label='OAT 10Y Prédite', linestyle='--', color='#059669')\nplt.title('Modèle Économétrique ALM : OAT 10Y vs Euribor & Inflation')\nplt.legend()\nplt.tight_layout()\nplt.show()",
        testPythonCode: "assert 'model' in globals()\nassert len(plt.get_fignums()) >= 0",
        hints: ["Remplacez '...' par 'model.fittedvalues'."],
        datasets: []
      },
      {
        id: "py-26",
        title: "26. Cas Pratique ALM : Sensibilité de Duration & VaR 99.5%",
        category: "alm",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 20,
        description: "Estimez l'impact d'un choc de taux de +200 bps sur un portefeuille obligataire de 100 M€.",
        theoryMarkdown: `
### Cas Pratique ALM : Taylor à l'Ordre 2 (Duration + Convexité) & VaR 99.5 % Solvabilité II

> 💡 **Dérivation formelle : Valorisation Obligataire & Développement de Taylor à l'Ordre 2**
> 
> Soit un portefeuille obligataire versant des flux futurs $(CF_1, \\dots, CF_n)$ actualisés au taux actuariel $y$ :
>
> $$V(y) = \\sum_{k=1}^n \\frac{CF_k}{(1 + y)^k}$$
>
> Pour quantifier l'impact d'un choc de taux $\\Delta y$ sur la valeur de marché $V_0 = V(y_0)$, appliquons un **développement de Taylor à l'ordre 2** :
>
> $$\\Delta V = V(y_0 + \\Delta y) - V(y_0) \\approx \\frac{dV}{dy}\\Delta y + \\frac{1}{2}\\frac{d^2V}{dy^2}(\\Delta y)^2$$
>
> En divisant par $V_0$ et en posant la **Duration Modifiée** $D^* = -\\frac{1}{V_0}\\frac{dV}{dy} = \\frac{1}{V_0(1+y)}\\sum_{k=1}^n k \\frac{CF_k}{(1+y)^k}$ et la **Convexité** $C = \\frac{1}{V_0}\\frac{d^2V}{dy^2} = \\frac{1}{V_0(1+y)^2}\\sum_{k=1}^n k(k+1)\\frac{CF_k}{(1+y)^k} > 0$, on obtient la formule maîtresse du risque de taux ALM :
>
> $$\\frac{\\Delta V}{V_0} \\approx \\underbrace{-D^* \\Delta y}_{\\text{Ordre 1 (linéaire)}} + \\underbrace{\\frac{1}{2} C (\\Delta y)^2}_{\\text{Ordre 2 (convexité)}}$$
>
> Comme $C > 0$ pour une obligation classique sans option, la convexité joue toujours en faveur du détenteur : elle **amortit la perte** quand les taux montent ($\\Delta y > 0$) et **amplifie le gain** quand les taux baissent ($\\Delta y < 0$).
>
> **Cadre Réglementaire Solvabilité II & Bâle III (VaR 99.5 %) :**
> Sous Solvabilité II, le **Solvency Capital Requirement (SCR)** est calibré comme la **Value-at-Risk à $99.5\\%$ à horizon 1 an**, soit le choc bicentenaire ($1$ année sur $200$, $\\alpha = 0.5\\%$). Pour une variation gaussienne $\\Delta y \\sim \\mathcal{N}(0, \\sigma_{\\text{ann}}^2)$, le choc critique vaut $z_{0.995} \\sigma_{\\text{ann}} \\approx 2.5758\\,\\sigma_{\\text{ann}}$ — un ordre de grandeur directement comparable au stress-test réglementaire standard de $+200\\text{ bps}$ ($\\Delta y = +0.02$).

> ✏️ **Exemple chiffré & Résolution pas-à-pas ($V_0 = 100\\text{ M EUR}$, $D^* = 7.0$, $C = 60$, $\\Delta y = +0.02$) :**
> 1. **Approximation linéaire (Ordre 1 — Duration)** :
>    $$\\frac{\\Delta V_{\\text{lin}}}{V_0} = -7.0 \\times (+0.02) = -0.14 = -14.0\\% \\implies \\Delta V_{\\text{lin}} = \\mathbf{-14\\,000\\,000\\text{ EUR}}$$
> 2. **Correction de convexité (Ordre 2)** :
>    $$\\frac{1}{2} C (\\Delta y)^2 = \\frac{1}{2} \\times 60 \\times (0.02)^2 = +0.012 = +1.20\\% \\implies +1\\,200\\,000\\text{ EUR}$$
> 3. **Perte nette ajustée (Ordre 2)** : $-14.0\\text{ M EUR} + 1.2\\text{ M EUR} = \\mathbf{-12\\,800\\,000\\text{ EUR}}$.

#### 💻 Masterclass Code : Ingénierie Financière Python & Calibration VaR 99.5 % sur \`df\`

En Python, les tirets bas (\`100_000_000\`) rendent les grands montants lisibles sans altérer la valeur numérique, et les f-strings (\`{val:,.2f}\`) formatent les rapports ALM. Le code ci-dessous calcule le stress Taylor Ordre 1 & Ordre 2 puis calibre le choc VaR $99.5\\%$ annuel directement à partir de la volatilité historique de l'\`oat_10y\` dans \`df\`.

\`\`\`python
import numpy as np
from scipy.stats import norm

# 1. Paramètres du portefeuille obligataire ALM
valeur_portefeuille = 100_000_000  # 100 M EUR
duration_modifiee = 7.0            # D* en années
convexite = 60.0                   # C (dérivée seconde normalisée)
choc_taux = 0.02                   # +200 bps = +0.02

# 2. Taylor Ordre 1 (Duration) vs Ordre 2 (Duration + Convexité)
perte_ordre1 = -duration_modifiee * choc_taux * valeur_portefeuille
gain_convexite = 0.5 * convexite * (choc_taux ** 2) * valeur_portefeuille
perte_ordre2 = perte_ordre1 + gain_convexite

# 3. Calibration VaR 99.5 % (Solvabilité II, 1 an) sur les chocs historiques de l'OAT
d_oat = df['oat_10y'].diff().dropna() / 100.0
sigma_annuelle = float(d_oat.std() * np.sqrt(4))
z_995 = float(norm.ppf(0.995))
choc_var_995 = z_995 * sigma_annuelle
var_995_capital = duration_modifiee * choc_var_995 * valeur_portefeuille

print(f"Perte linéaire (Taylor Ordre 1, +200 bps) : {perte_ordre1:,.2f} EUR")
print(f"Amortisseur de convexité (Ordre 2)       : +{gain_convexite:,.2f} EUR")
print(f"Perte nette ajustée (Taylor Ordre 2)     : {perte_ordre2:,.2f} EUR")
print(f"Volatilité OAT ann.={sigma_annuelle*100:.2f}% | z_99.5={z_995:.4f} -> Choc VaR 99.5% = +{choc_var_995*10000:.1f} bps")
print(f"VaR 99.5% (1 an) Solvabilité II          : {var_995_capital:,.2f} EUR")
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL sur \`df\`)

\`\`\`text
Perte linéaire (Taylor Ordre 1, +200 bps) : -14,000,000.00 EUR
Amortisseur de convexité (Ordre 2)       : +1,200,000.00 EUR
Perte nette ajustée (Taylor Ordre 2)     : -12,800,000.00 EUR
Volatilité OAT ann.=0.76% | z_99.5=2.5758 -> Choc VaR 99.5% = +197.0 bps
VaR 99.5% (1 an) Solvabilité II          : 13,793,046.82 EUR
\`\`\`

Remarquez la convergence remarquable entre théorie et données réelles : la volatilité annualisée de l'OAT 10Y (\`0.76 %\`) multipliée par le quantile Solvabilité II $z_{0.995} = 2.5758$ produit un choc VaR $99.5\\%$ de **\`+197.0 bps\`** (\`13.79 M EUR\` de perte linéaire), quasiment identique au stress-test prudentiel standard de **\`+200 bps\`** (\`-14.00 M EUR\`) !
        `,
        taskMarkdown: `**Volet 1 — Compréhension Mathématique & Métier :**
Écrivez le développement de Taylor à l'ordre 2 $\\frac{\\Delta V}{V_0} \\approx -D^* \\Delta y + \\frac{1}{2} C (\\Delta y)^2$, expliquez pourquoi la convexité $C > 0$ réduit la perte lors d'une hausse de taux, et reliez le stress de $+200\\text{ bps}$ au quantile bicentenaire VaR $99.5\\%$ de Solvabilité II.

**Volet 2 — Laboratoire Code Python :**
Définissez \`valeur_portefeuille = 100_000_000\`, \`duration_modifiee = 7.0\` et \`choc_taux = 0.02\`, puis calculez la perte au premier ordre \`perte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille\` et affichez-la.`,
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "valeur_portefeuille = 100_000_000\nduration_modifiee = 7.0\nchoc_taux = 0.02\nperte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille\nprint(f'Perte en capital estimée : {perte_estimee:,.2f} €')",
        testPythonCode: "assert 'perte_estimee' in globals()\nassert abs(perte_estimee - (-14_000_000.0)) < 1e-4",
        hints: ["perte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille"],
        datasets: []
      }
    ]
  };
