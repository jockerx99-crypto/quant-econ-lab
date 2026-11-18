import { CourseModule } from "@/types/course";

export const V2_FINANCE_ECONOMETRICS_MODULE: CourseModule = {
    id: "python-finance-econometrics",
    title: "Algèbre Matricielle & Économétrie Financière",
    subtitle: "Matrices de Covariance, Valeurs Propres, GMVP & Modèles Factoriels",
    icon: "TrendingUp",
    description: "Plongez dans l'économétrie financière de pointe : calcul matriciel vectorisé, analyse spectrale, dé-bruitage de Marchenko-Pastur, optimisation de Markowitz (GMVP, Tangence), CAPM et GARCH(1,1).",
    exercises: [
      {
        id: "v2-py-1",
        title: "1. Algèbre Matricielle Vectorisée en NumPy (@ & .T)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Débutant",
        durationMinutes: 6,
        description: "Calculez le rendement espéré et la variance d'un portefeuille de 3 actifs avec le produit matriciel.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Formulation Vectorielle de Markowitz

#### Intuition Économique & Enjeux ALM / Risk Management
En gestion d'actifs et en ALM (*Asset-Liability Management*), un portefeuille institutionnel regroupe des dizaines voire des milliers de lignes (actions, obligations souveraines, crédit corporate, immobilier). Calculer son risque par des doubles boucles scalaires est non seulement lent, mais obscurcit la structure géométrique de la diversification.

L'écriture matricielle condense l'allocation entière en deux objets : le **vecteur des poids** $\\mathbf{w}$ et la **matrice de variance-covariance** $\\Sigma$. C'est exactement ce formalisme qui gouverne l'agrégation des risques sous **Solvabilité II** (formule standard du SCR de marché $\\sqrt{\\mathbf{SCR}' C \\mathbf{SCR}}$) et l'optimisation de portefeuille.

#### Démonstration Mathématique Formelle
Soit un univers de $K$ actifs financiers de rendements aléatoires $\\mathbf{R} = [R_1, \\dots, R_K]'$ d'espérance $\\boldsymbol{\\mu} = \\mathbb{E}[\\mathbf{R}] \\in \\mathbb{R}^K$ et de matrice de covariance $\\Sigma = \\mathbb{E}[(\\mathbf{R} - \\boldsymbol{\\mu})(\\mathbf{R} - \\boldsymbol{\\mu})'] \\in \\mathbb{R}^{K \\times K}$, pondérés par $\\mathbf{w} = [w_1, \\dots, w_K]' \\in \\mathbb{R}^K$ ($\mathbf{w}'\\mathbf{1} = 1$).

1. **Linéarité de l'espérance :**
   $$\\mathbb{E}[R_p] = \\mathbb{E}\\left[\\sum_{i=1}^K w_i R_i\\right] = \\sum_{i=1}^K w_i \\mathbb{E}[R_i] = \\mathbf{w}' \\boldsymbol{\\mu}$$

2. **Bilinéarité de la covariance (Forme Quadratique) :**
   $$\\sigma_p^2 = \\operatorname{Var}\\left(\\sum_{i=1}^K w_i R_i\\right) = \\operatorname{Cov}\\left(\\sum_{i=1}^K w_i R_i, \\sum_{j=1}^K w_j R_j\\right) = \\sum_{i=1}^K \\sum_{j=1}^K w_i w_j \\sigma_{ij} = \\mathbf{w}' \\Sigma \\mathbf{w}$$
   En séparant les termes diagonaux ($i=j$) des covariances croisées ($i \\neq j$), on révèle le **mécanisme de diversification** :
   $$\\sigma_p^2 = \\sum_{i=1}^K w_i^2 \\sigma_i^2 + 2 \\sum_{1 \\le i < j \\le K} w_i w_j \\rho_{ij} \\sigma_i \\sigma_j$$

3. **Semi-définie positivité naturelle de $\\Sigma$ :**
   Pour tout vecteur $\\mathbf{w} \\in \\mathbb{R}^K$, la forme quadratique est nécessairement positive ou nulle :
   $$\\mathbf{w}' \\Sigma \\mathbf{w} = \\mathbb{E}\\left[\\left(\\mathbf{w}'(\\mathbf{R} - \\boldsymbol{\\mu})\\right)^2\\right] = \\operatorname{Var}(\\mathbf{w}'\\mathbf{R}) \\ge 0$$

> ✏️ **Exemple chiffré & Résolution matricielle pas-à-pas (Toy Example à 2 actifs) :**
>
> Soit $K=2$ actifs : $\\mathbf{w} = \\begin{pmatrix} 0.6 \\\\ 0.4 \\end{pmatrix}$, $\\boldsymbol{\\mu} = \\begin{pmatrix} 0.10 \\\\ 0.05 \\end{pmatrix}$, $\\Sigma = \\begin{pmatrix} 0.04 & 0.01 \\\\ 0.01 & 0.09 \\end{pmatrix}$.
>
> 1. **Rendement espéré $\\mathbf{w}' \\boldsymbol{\\mu}$** :
>    $$\\mathbb{E}[R_p] = 0.6 \\times 0.10 + 0.4 \\times 0.05 = 0.06 + 0.02 = \\mathbf{0.08} \\text{ (8.0\\%)}$$
>
> 2. **Produit intermédiaire $\\Sigma \\mathbf{w}$** (vecteur des covariances marginales avec le portefeuille) :
>    $$\\Sigma \\mathbf{w} = \\begin{pmatrix} 0.04 \\times 0.6 + 0.01 \\times 0.4 \\\\ 0.01 \\times 0.6 + 0.09 \\times 0.4 \\end{pmatrix} = \\begin{pmatrix} 0.028 \\\\ 0.042 \\end{pmatrix}$$
>
> 3. **Variance et volatilité finales $\\mathbf{w}' (\\Sigma \\mathbf{w})$** :
>    $$\\sigma_p^2 = 0.6 \\times 0.028 + 0.4 \\times 0.042 = \\mathbf{0.0336} \\implies \\sigma_p = \\sqrt{0.0336} \\approx \\mathbf{18.33\\%}$$

### 💻 Masterclass Python & NumPy Avancé

* **Opérateur \`@\` vs \`*\` (Hadamard) :** \`@\` appelle \`np.matmul\` (produit matriciel algébrique, délégué aux routines BLAS C/Fortran), tandis que \`*\` réalise un produit *élément par élément* avec *broadcasting*. Écrire \`w * Sigma * w\` renvoie une matrice $K \\times K$ au lieu d'un scalaire !
* **Vecteurs NumPy 1D \`(K,)\` :** Pour un tableau 1D \`w\` de forme \`(K,)\`, \`w.T\` est identique à \`w\`. NumPy interprète automatiquement \`w @ Sigma @ w\` comme $\\mathbf{w}' \\Sigma \\mathbf{w}$ sans devoir remodeler en vecteur colonne \`(K, 1)\` (attention : si \`w\` est 2D \`(K, 1)\`, \`w.T @ Sigma @ w\` renvoie une matrice \`(1, 1)\`, pas un scalaire !).
* **Transtypage \`float(...)\` :** \`w @ mu\` retourne un scalaire \`np.float64\`. Le convertir en \`float(...)\` garantit la compatibilité avec les sérialiseurs JSON, les tests stricts Python et la clarté des types.

\`\`\`python
import numpy as np

# Définition d'un portefeuille jouet à 2 actifs (tableaux 1D et 2D)
w = np.array([0.6, 0.4])                            # shape (2,)
mu = np.array([0.10, 0.05])                         # shape (2,)
Sigma = np.array([[0.04, 0.01], [0.01, 0.09]])      # shape (2, 2)

# Produits matriciels vectorisés via BLAS (@)
mu_p = float(w @ mu)                                # espérance w' mu
var_p = float(w @ Sigma @ w)                        # forme quadratique w' Sigma w
vol_p = float(np.sqrt(var_p))                       # écart-type (volatilité)

# Vérification par double boucle scalaire explicite (lente à grande échelle)
var_boucle = sum(w[i] * w[j] * Sigma[i, j] for i in range(2) for j in range(2))

print(f"w.shape = {w.shape}, Sigma.shape = {Sigma.shape}")
print(f"Rendement espere (w @ mu) : {mu_p:.4f}")
print(f"Variance (w @ Sigma @ w)  : {var_p:.6f}")
print(f"Variance (double boucle)  : {var_boucle:.6f}")
print(f"Volatilite (sqrt)         : {vol_p:.4%}")
print(f"Type (w @ Sigma @ w) : {type(w @ Sigma @ w).__name__} -> cast float : {type(var_p).__name__}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
w.shape = (2,), Sigma.shape = (2, 2)
Rendement espere (w @ mu) : 0.0800
Variance (w @ Sigma @ w)  : 0.033600
Variance (double boucle)  : 0.033600
Volatilite (sqrt)         : 18.3303%
Type (w @ Sigma @ w) : float64 -> cast float : float
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir du portefeuille à $K=3$ actifs défini dans l'éditeur (\`w = np.array([0.4, 0.35, 0.25])\`, \`mu = np.array([0.08, 0.10, 0.06])\` et la matrice \`Sigma\` symétrique $3 \\times 3$), implémentez le calcul vectorisé de :
1. \`rendement_espere = float(w @ mu)\` (espérance $\\mathbf{w}'\\boldsymbol{\\mu}$)
2. \`variance_portefeuille = float(w @ Sigma @ w)\` (forme quadratique $\\mathbf{w}'\\Sigma\\mathbf{w}$)
3. \`volatilite_portefeuille = float(np.sqrt(variance_portefeuille))\` (racine carrée $\\sigma_p$)

Affichez les trois grandeurs avec \`print\`.`,
        initialCode: "import numpy as np\n\nw = np.array([0.4, 0.35, 0.25])\nmu = np.array([0.08, 0.10, 0.06])\nSigma = np.array([\n    [0.04, 0.01, 0.005],\n    [0.01, 0.06, 0.015],\n    [0.005, 0.015, 0.03]\n])\n\n# Calculez rendement_espere, variance_portefeuille et volatilite_portefeuille :\n",
        solutionCode: "import numpy as np\n\nw = np.array([0.4, 0.35, 0.25])\nmu = np.array([0.08, 0.10, 0.06])\nSigma = np.array([\n    [0.04, 0.01, 0.005],\n    [0.01, 0.06, 0.015],\n    [0.005, 0.015, 0.03]\n])\n\nrendement_espere = float(w @ mu)\nvariance_portefeuille = float(w @ Sigma @ w)\nvolatilite_portefeuille = float(np.sqrt(variance_portefeuille))\n\nprint(f'Rendement espéré : {rendement_espere:.4f}')\nprint(f'Variance : {variance_portefeuille:.6f}')\nprint(f'Volatilité : {volatilite_portefeuille:.4f}')",
        testPythonCode: "assert 'rendement_espere' in globals()\nassert 'variance_portefeuille' in globals()\nassert 'volatilite_portefeuille' in globals()\nassert np.isclose(rendement_espere, 0.082, atol=1e-3)\nassert np.isclose(variance_portefeuille, 0.02205, atol=1e-4)",
        hints: ["rendement_espere = float(w @ mu)", "variance_portefeuille = float(w @ Sigma @ w)", "volatilite_portefeuille = float(np.sqrt(variance_portefeuille))"],
        datasets: []
      },
      {
        id: "v2-py-2",
        title: "2. Matrice de Variance-Covariance et Corrélation",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Estimez la matrice de variance-covariance et la matrice de corrélation à partir d'une matrice de rendements.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Estimateur Sans Biais & Normalisation en Corrélation

#### Intuition Économique & Enjeux Risk Management
La covariance $\\sigma_{ij}$ dépend de l'échelle des séries (pourcentage vs points de base, actions volatiles vs obligations d'État). Impossible de juger à l'œil nu si $\\sigma_{ij} = 0.0004$ traduit une liaison forte ou faible ! La **matrice de corrélation** $C$ normalise chaque actif par sa propre volatilité afin de mesurer purement la **structure de dépendance linéaire**, indépendamment des échelles.

En gestion des risques (stress-testing ALM, Value-at-Risk multi-actifs), surveiller la stabilité de $C$ est vital : lors des krachs de liquidité ou de chocs inflationnistes (comme en 2022 où taux obligataires et actions ont baissé simultanément), les corrélations historiquement négatives peuvent s'inverser brutalement (*correlation breakdown*).

#### Démonstration Mathématique Formelle
Soit $X \\in \\mathbb{R}^{T \\times K}$ une matrice contenant $T$ réalisations i.i.d. de vecteur moyen $\\boldsymbol{\\mu}$ et de vraie matrice de covariance $\\Sigma$.

1. **Opérateur de centrage matriciel :**
   Définissons la matrice de centrage $M = I_T - \\frac{1}{T} \\mathbf{1}_T \\mathbf{1}_T' \\in \\mathbb{R}^{T \\times T}$. Comme $M\\mathbf{1}_T = \\mathbf{0}$, la matrice centrée est $\\tilde{X} = M X = X - \\mathbf{1}_T \\bar{\\mathbf{x}}'$. De plus, $M$ est symétrique ($M'=M$), idempotente ($M^2 = M$), et sa trace vaut :
   $$\\operatorname{Tr}(M) = \\operatorname{Tr}(I_T) - \\frac{1}{T} \\operatorname{Tr}(\\mathbf{1}_T \\mathbf{1}_T') = T - 1$$

2. **Preuve de l'absence de biais de la correction de Bessel ($T-1$) :**
   Posons les écarts à la vraie moyenne $E = X - \\mathbf{1}_T \\boldsymbol{\\mu}'$, de sorte que $\\tilde{X} = M E$ et $\\mathbb{E}[E_{ti} E_{sj}] = \\delta_{ts} \\sigma_{ij}$. L'élément $(i, j)$ de $\\tilde{X}'\\tilde{X} = E' M' M E = E' M E$ vérifie :
   $$\\mathbb{E}\\left[(\\tilde{X}'\\tilde{X})_{ij}\\right] = \\sum_{t=1}^T \\sum_{s=1}^T M_{ts} \\mathbb{E}[E_{ti} E_{sj}] = \\sum_{t=1}^T M_{tt} \\sigma_{ij} = \\operatorname{Tr}(M) \\sigma_{ij} = (T - 1)\\sigma_{ij}$$
   Ainsi, l'estimateur empirique divisé par $T - 1$ est **rigoureusement sans biais** :
   $$\\hat{\\Sigma} = \\frac{1}{T - 1} \\tilde{X}' \\tilde{X} \\implies \\mathbb{E}[\\hat{\\Sigma}] = \\Sigma$$

3. **Normalisation matricielle en corrélation & Inégalité de Cauchy-Schwarz :**
   En notant $D = \\operatorname{diag}(\\hat{\\sigma}_{11}, \\dots, \\hat{\\sigma}_{KK})$, la matrice de corrélation est :
   $$C = D^{-1/2} \\hat{\\Sigma} D^{-1/2}, \\qquad C_{ij} = \\frac{\\hat{\\sigma}_{ij}}{\\sqrt{\\hat{\\sigma}_{ii}\\hat{\\sigma}_{jj}}}$$
   Par l'inégalité de Cauchy-Schwarz appliquée au produit scalaire empirique $\\langle \\tilde{\\mathbf{x}}_i, \\tilde{\\mathbf{x}}_j \\rangle$, on a $|C_{ij}| \\le 1$ et $C_{ii} = 1$, ainsi que l'**invariance d'échelle** : multiplier chaque colonne par $a_i > 0$ laisse $C$ strictement inchangée.

### 💻 Masterclass Python & NumPy Avancé

* **Piège critique \`rowvar=False\` :** Par défaut, \`np.cov(X)\` et \`np.corrcoef(X)\` supposent \`rowvar=True\` (chaque **ligne** est une variable et chaque colonne une observation). Avec une matrice financière standard $(T \\times K)$ où les $T$ dates sont en lignes et les $K$ actifs en colonnes, omettre \`rowvar=False\` produirait une matrice géante $T \\times T$ absurde !
* **Degrés de liberté \`ddof=1\` :** \`np.cov\` utilise \`ddof=1\` par défaut (diviseur $T - 1$), contrairement à \`np.var\` / \`np.std\` qui utilisent \`ddof=0\` par défaut.
* **Broadcasting :** \`X - X.mean(axis=0)\` soustrait un vecteur ligne \`(K,)\` de la matrice \`(T, K)\` sans aucune boucle Python ni duplication mémoire inutile.

\`\`\`python
import numpy as np

# Calcul sur le panel macroéconomique réel 'df' préchargé dans QuantEcon Lab (T=16 trimestres)
cols = ["euribor_3m", "oat_10y", "spread_credit_bbb", "cac40_rendement"]
X = df[cols].to_numpy()                             # matrice (16, 4)

# 1. Centrage par broadcasting et formule matricielle manuelle
X_c = X - X.mean(axis=0)                            # shape (16, 4)
Sigma_man = (X_c.T @ X_c) / (len(X) - 1)            # estimateur sans biais (T - 1)

# 2. Calcul natif NumPy (rowvar=False obligatoire pour colonnes = variables)
Sigma_np = np.cov(X, rowvar=False)
C_np = np.corrcoef(X, rowvar=False)

print("Variables :", cols)
print("Ecart max formule matricielle vs np.cov :", f"{np.max(np.abs(Sigma_man - Sigma_np)):.2e}")
print("Matrice de covariance (T=16, ddof=1) :\\n", np.round(Sigma_np, 4))
print("Matrice de correlation C :\\n", np.round(C_np, 4))
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Variables : ['euribor_3m', 'oat_10y', 'spread_credit_bbb', 'cac40_rendement']
Ecart max formule matricielle vs np.cov : 4.44e-16
Matrice de covariance (T=16, ddof=1) :
 [[  3.1866   2.456    0.4422   2.2743]
 [  2.456    2.3243   0.4772   0.5091]
 [  0.4422   0.4772   0.1389  -0.3892]
 [  2.2743   0.5091  -0.3892 121.5033]]
Matrice de correlation C :
 [[ 1.      0.9024  0.6645  0.1156]
 [ 0.9024  1.      0.8397  0.0303]
 [ 0.6645  0.8397  1.     -0.0947]
 [ 0.1156  0.0303 -0.0947  1.    ]]
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la matrice simulée de rendements \`X\` de dimension $100 \\times 3$ ($T=100$ observations en lignes, $K=3$ actifs en colonnes), estimez :
1. La matrice de covariance empirique sans biais \`Sigma = np.cov(X, rowvar=False)\`
2. La matrice de corrélation empirique \`C = np.corrcoef(X, rowvar=False)\`

Affichez \`Sigma\` et \`C\` arrondies pour vérifier la symétrie et la diagonale unitaire de \`C\`.`,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 3) * [0.02, 0.03, 0.015]\n\n# Calculez Sigma et C avec np.cov et np.corrcoef :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 3) * [0.02, 0.03, 0.015]\n\nSigma = np.cov(X, rowvar=False)\nC = np.corrcoef(X, rowvar=False)\n\nprint('Matrice de Covariance Sigma :\\n', np.round(Sigma, 6))\nprint('Matrice de Corrélation C :\\n', np.round(C, 4))",
        testPythonCode: "assert 'Sigma' in globals()\nassert 'C' in globals()\nassert Sigma.shape == (3, 3)\nassert C.shape == (3, 3)\nassert np.allclose(np.diag(C), 1.0)",
        hints: ["Utilisez Sigma = np.cov(X, rowvar=False)", "C = np.corrcoef(X, rowvar=False)"],
        datasets: []
      },
      {
        id: "v2-py-3",
        title: "3. Décomposition Spectrale : Valeurs & Vecteurs Propres",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Décomposez la matrice de covariance en valeurs propres et vecteurs propres (Théorème Spectral).",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Théorème Spectral & Quotient de Rayleigh

#### Intuition Économique & Enjeux de Risk Management
Dans un portefeuille corrélé, les actifs individuels ne représentent pas des sources de risque indépendantes : une hausse des taux ou un choc de liquidité frappe simultanément plusieurs classes d'actifs. La **décomposition spectrale** change de base géométrique pour exprimer la covariance dans un repère de **portefeuilles propres orthogonaux** (*eigen-portfolios*), dont les rendements sont statistiquement décorrélés deux à deux et dont les variances sont exactement les valeurs propres $\\lambda_i$.

#### Démonstration Mathématique Formelle
1. **Théorème Spectral :**
   Toute matrice symétrique réelle $\\Sigma = \\Sigma' \\in \\mathbb{R}^{K \\times K}$ est diagonalisable dans une base orthonormée de vecteurs propres réels :
   $$\\Sigma = V \\Lambda V' = \\sum_{i=1}^K \\lambda_i \\mathbf{v}_i \\mathbf{v}_i'$$
   où $\\Lambda = \\operatorname{diag}(\\lambda_1, \\dots, \\lambda_K)$ et $V = [\\mathbf{v}_1, \\dots, \\mathbf{v}_K]$ est orthogonale ($V'V = VV' = I_K$). Pour deux facteurs propres distincts $i \\neq j$, leur covariance est nulle :
   $$\\operatorname{Cov}(\\mathbf{v}_i'\\mathbf{R}, \\mathbf{v}_j'\\mathbf{R}) = \\mathbf{v}_i' \\Sigma \\mathbf{v}_j = \\lambda_j \\mathbf{v}_i' \\mathbf{v}_j = 0$$

2. **Quotient de Rayleigh & Bornes Variationnelles de Variance :**
   Pour tout vecteur de poids non nul $\\mathbf{w} \\neq \\mathbf{0}$, on définit le **quotient de Rayleigh** :
   $$R(\\Sigma, \\mathbf{w}) = \\frac{\\mathbf{w}' \\Sigma \\mathbf{w}}{\\mathbf{w}' \\mathbf{w}}$$
   En effectuant le changement de base orthogonal $\\mathbf{z} = V'\\mathbf{w}$ (qui préserve la norme euclidienne $\\mathbf{z}'\\mathbf{z} = \\mathbf{w}' V V' \\mathbf{w} = \\mathbf{w}'\\mathbf{w}$), il vient :
   $$R(\\Sigma, \\mathbf{w}) = \\frac{\\mathbf{z}' \\Lambda \\mathbf{z}}{\\mathbf{z}' \\mathbf{z}} = \\frac{\\sum_{i=1}^K \\lambda_i z_i^2}{\\sum_{i=1}^K z_i^2}$$
   Comme $\\lambda_{\\min} \\le \\lambda_i \\le \\lambda_{\\max}$ et $z_i^2 \\ge 0$, ce barycentre prouve l'encadrement fondamental :
   $$\\lambda_{\\min} \\le \\frac{\\mathbf{w}' \\Sigma \\mathbf{w}}{\\mathbf{w}' \\mathbf{w}} \\le \\lambda_{\\max}$$
   Les bornes sont exactement atteintes sur les vecteurs propres extrêmes $\\mathbf{v}_{\\min}$ et $\\mathbf{v}_{\\max}$. Pour qu'une matrice soit une covariance valide (semi-définie positive), il faut et il suffit que $\\lambda_{\\min} \\ge 0$.

![Décomposition Spectrale et Ellipsoïde de Covariance](/images/theory/fig_spectral_covariance.png)

> 🔍 **Comprendre ce graphique : Géométrie de la matrice de covariance**
>
> - **Nuage de points bivarié** : Représente la dispersion conjointe des rendements de deux actifs corrélés positivement.
> - **Ellipsoïde de dispersion (ellipse bleue)** : Délimite la zone de confiance à 95 % de probabilité. L'inclinaison de l'ellipse reflète la corrélation positive entre les actifs.
> - **Vecteurs propres orthogonaux ($\\mathbf{v}_1, \\mathbf{v}_2$)** :
>   - Le grand axe $\\mathbf{v}_1$ (en rouge) s'aligne sur la plus grande dispersion : c'est la **première composante principale**, dont la longueur est proportionnelle à $\\sqrt{\\lambda_1}$.
>   - Le petit axe $\\mathbf{v}_2$ (en vert) est strictement orthogonal ($90^\\circ$) : il capture le risque résiduel décorrélé, avec une variance $\\lambda_2$.

### 💻 Masterclass Python & NumPy Avancé

* **\`np.linalg.eigh\` vs \`np.linalg.eig\` :** Utilisez **impérativement** \`eigh\` (*Hermitian*) pour toute matrice symétrique de covariance ou corrélation ! \`eigh\` exploite la symétrie (2x plus rapide), garantit des valeurs propres strictement réelles (aucun artefact \`+0j\`), les trie automatiquement par **ordre croissant** ($\\lambda_1 \\le \\dots \\le \\lambda_K$), et assure l'orthogonalité numérique $V'V = I$ même en cas de valeurs propres proches.
* **Reconstruction & Tolérance Flottante :** \`Sigma == Sigma_reconstruite\` échoue presque toujours à cause de l'arithmétique IEEE-754 ($\\approx 10^{-16}$). Utilisez toujours \`np.allclose(A, B)\` ou la norme matricielle \`np.linalg.norm(A - B)\`.

\`\`\`python
import numpy as np

Sigma = np.array([
    [0.05, 0.02, 0.01],
    [0.02, 0.08, 0.03],
    [0.01, 0.03, 0.04]
])

# eigh() exploite la symétrie : valeurs propres triées par ordre croissant
evals, V = np.linalg.eigh(Sigma)

# Vérification du théorème spectral et des bornes du quotient de Rayleigh
w_test = np.array([1.0, 2.0, -1.0])
rayleigh = float((w_test @ Sigma @ w_test) / (w_test @ w_test))

print("Valeurs propres (tri croissant) :", np.round(evals, 6))
print("Orthogonalite ||V.T @ V - I||_F :", f"{np.linalg.norm(V.T @ V - np.eye(3)):.2e}")
print("Reconstruction ||V @ diag(L) @ V.T - S||_F :", f"{np.linalg.norm(V @ np.diag(evals) @ V.T - Sigma):.2e}")
print(f"Quotient de Rayleigh R(w_test) = {rayleigh:.6f} in [{evals[0]:.6f}, {evals[-1]:.6f}]")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Valeurs propres (tri croissant) : [0.023924 0.040955 0.10512 ]
Orthogonalite ||V.T @ V - I||_F : 3.40e-16
Reconstruction ||V @ diag(L) @ V.T - S||_F : 2.78e-17
Quotient de Rayleigh R(w_test) = 0.058333 in [0.023924, 0.105120]
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la matrice symétrique \`Sigma\` ($3 \\times 3$), effectuez sa décomposition spectrale avec \`np.linalg.eigh(Sigma)\` :
1. Stockez les valeurs propres dans \`valeurs_propres\` et la matrice orthogonale des vecteurs propres dans \`vecteurs_propres\`.
2. Vérifiez le théorème spectral en reconstruisant \`Sigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T\`.

Affichez \`valeurs_propres\` et le booléen \`np.allclose(Sigma, Sigma_reconstruite)\`.`,
        initialCode: "import numpy as np\n\nSigma = np.array([\n    [0.05, 0.02, 0.01],\n    [0.02, 0.08, 0.03],\n    [0.01, 0.03, 0.04]\n])\n\n# Calculez valeurs_propres, vecteurs_propres et Sigma_reconstruite :\n",
        solutionCode: "import numpy as np\n\nSigma = np.array([\n    [0.05, 0.02, 0.01],\n    [0.02, 0.08, 0.03],\n    [0.01, 0.03, 0.04]\n])\n\nvaleurs_propres, vecteurs_propres = np.linalg.eigh(Sigma)\nSigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T\n\nprint('Valeurs propres lambda :\\n', np.round(valeurs_propres, 6))\nprint('Reconstruction exacte :', np.allclose(Sigma, Sigma_reconstruite))",
        testPythonCode: "assert 'valeurs_propres' in globals()\nassert 'vecteurs_propres' in globals()\nassert 'Sigma_reconstruite' in globals()\nassert np.all(valeurs_propres > 0)\nassert np.allclose(Sigma, Sigma_reconstruite)",
        hints: ["valeurs_propres, vecteurs_propres = np.linalg.eigh(Sigma)", "Sigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T"],
        datasets: []
      },
      {
        id: "v2-py-4",
        title: "4. Test de Définie-Positivité & Projection sur le Cône PSD",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Corrigez une matrice de corrélation non définie positive en tronquant les valeurs propres négatives (Méthode de Higham).",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Cône des Matrices PSD & Projection Spectrale Optimale

#### Intuition Économique & Enjeux de Modélisation
Dans les salles de marché et les directions des risques, on assemble souvent une matrice de corrélation hétérogène : certaines paires proviennent de séries longues, d'autres de séries courtes (*pairwise deletion*), d'autres encore sont ajustées à la main lors de scénarios de *stress test* (par exemple imposer $\\rho_{12}=0.9$, $\\rho_{23}=0.95$, $\\rho_{13}=0.7$).

Cette matrice bricolée brise fréquemment la cohérence géométrique : si $A$ et $B$ sont corrélés à $0.90$ et $B$ et $C$ à $0.95$, l'angle maximal possible impose mathématiquement $\\rho_{AC} \\ge \\rho_{AB}\\rho_{BC} - \\sqrt{(1-\\rho_{AB}^2)(1-\\rho_{BC}^2)} \\approx 0.719$. Avec $0.70$, la matrice possède une **valeur propre négative** : le portefeuille aligné sur $\\mathbf{v}_{\\min}$ présente une variance négative, faisant planter Cholesky (\`LinAlgError\`) et exploser les optimiseurs de Markowitz !

#### Démonstration Mathématique Formelle
1. **Le Cône Convexe $\\mathcal{S}_+^K$ :**
   L'ensemble des matrices symétriques semi-définies positives $\\mathcal{S}_+^K = \\{ M \\in \\mathcal{S}^K : \\forall \\mathbf{w}, \\mathbf{w}'M\\mathbf{w} \\ge 0 \\}$ forme un **cône convexe fermé** (stable par combinaison linéaire positive $\\alpha A + \\beta B$ avec $\\alpha, \\beta \\ge 0$).

2. **Théorème de Projection Spectrale au sens de Frobenius (Higham 1988) :**
   Soit $\\Sigma = V \\Lambda V'$ une matrice symétrique quelconque (éventuellement indéfinie). Cherchons la matrice $M \\in \\mathcal{S}_+^K$ la plus proche au sens de la norme de Frobenius $\\|\\Sigma - M\\|_F$.
   Par invariance orthogonale de la norme de Frobenius (comme $V$ est orthogonale), en posant $\\tilde{M} = V' M V \\in \\mathcal{S}_+^K$ (dont les termes diagonaux vérifient $\\tilde{m}_{ii} = \\mathbf{e}_i' \\tilde{M} \\mathbf{e}_i \\ge 0$) :
   $$\\|\\Sigma - M\\|_F^2 = \\|V'(\\Sigma - M)V\\|_F^2 = \\|\\Lambda - \\tilde{M}\\|_F^2 = \\sum_{i=1}^K (\\lambda_i - \\tilde{m}_{ii})^2 + \\sum_{i \\neq j} \\tilde{m}_{ij}^2$$
   Pour minimiser cette somme de carrés sous $\\tilde{m}_{ii} \\ge 0$ :
   - Tous les termes hors diagonale doivent être nuls : $\\tilde{m}_{ij} = 0$ pour $i \\neq j$.
   - Chaque terme diagonal doit valoir $\\tilde{m}_{ii} = \\max(\\lambda_i, 0)$.

   La projection euclidienne unique sur $\\mathcal{S}_+^K$ est donc $\\Sigma_+ = V \\Lambda_+ V'$. En pratique numérique, on remplace $0$ par un plancher $\\epsilon > 0$ ($10^{-6}$) pour garantir la **définie-positivité stricte** et l'inversibilité :
   $$\\Lambda_{\\text{PSD}} = \\max(\\Lambda, \\epsilon I_K), \\qquad \\Sigma_{\\text{PSD}} = V \\Lambda_{\\text{PSD}} V'$$

### 💻 Masterclass Python & NumPy Avancé

* **\`np.maximum\` vs \`np.max\` :** \`np.max(arr)\` (ou \`arr.max()\`) est une *réduction* qui renvoie un unique scalaire, tandis que \`np.maximum(arr, 1e-6)\` est une fonction universelle (*ufunc*) qui compare **élément par élément** et retourne un vecteur de même forme.
* **\`np.linalg.eigvalsh\` :** Lorsque l'on veut uniquement tester la définie-positivité sans avoir besoin des vecteurs propres $V$, \`np.linalg.eigvalsh(M)\` est plus rapide que \`eigh(M)\`.
* **Norme de Frobenius :** \`np.linalg.norm(A - B, ord='fro')\` mesure la distance géométrique $\\sqrt{\\sum_{i,j}(A_{ij}-B_{ij})^2}$ entre la matrice bruitée et sa projection PSD.

\`\`\`python
import numpy as np

# Matrice de corrélation incohérente (violation de la borne triangulaire)
Sigma_perturbee = np.array([
    [1.0, 0.9, 0.7],
    [0.9, 1.0, 0.95],
    [0.7, 0.95, 1.0]
])

evals, V = np.linalg.eigh(Sigma_perturbee)
v_min = V[:, 0]                                     # vecteur propre associé à lambda_min
var_neg = float(v_min @ Sigma_perturbee @ v_min)    # variance négative impossible !

# Projection spectrale sur le cône défini positif (plancher epsilon = 1e-6)
evals_psd = np.maximum(evals, 1e-6)
Sigma_psd = V @ np.diag(evals_psd) @ V.T
dist_frob = float(np.linalg.norm(Sigma_perturbee - Sigma_psd, ord="fro"))

print("Valeurs propres brutes :", np.round(evals, 6))
print(f"Variance sur le vecteur propre critique v_min : {var_neg:.6f} (< 0 !)")
print("Valeurs propres PSD    :", np.round(evals_psd, 6))
print(f"Distance de Frobenius ||S_bad - S_psd||_F = {dist_frob:.6f}")
print("Nouvelle variance sur v_min :", f"{float(v_min @ Sigma_psd @ v_min):.6f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Valeurs propres brutes : [-0.006726  0.302373  2.704353]
Variance sur le vecteur propre critique v_min : -0.006726 (< 0 !)
Valeurs propres PSD    : [1.000000e-06 3.023730e-01 2.704353e+00]
Distance de Frobenius ||S_bad - S_psd||_F = 0.006727
Nouvelle variance sur v_min : 0.000001
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la matrice non définie-positive \`Sigma_perturbee\` ($3 \\times 3$), implémentez la projection spectrale sur le cône défini positif :
1. Extrayez \`valeurs_propres\` et \`vecteurs_propres\` via \`np.linalg.eigh(Sigma_perturbee)\`.
2. Tronquez les valeurs propres négatives au seuil \`1e-6\` : \`valeurs_propres_psd = np.maximum(valeurs_propres, 1e-6)\`.
3. Reconstruisez \`Sigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T\`.

Affichez la plus petite valeur propre avant et après régularisation.`,
        initialCode: "import numpy as np\n\n# Matrice empirique bruitée possédant une valeur propre négative\nSigma_perturbee = np.array([\n    [1.0, 0.9, 0.7],\n    [0.9, 1.0, 0.95],\n    [0.7, 0.95, 1.0]\n])\n\n# Régularisez la matrice sur le cône PSD :\n",
        solutionCode: "import numpy as np\n\nSigma_perturbee = np.array([\n    [1.0, 0.9, 0.7],\n    [0.9, 1.0, 0.95],\n    [0.7, 0.95, 1.0]\n])\n\nvaleurs_propres, vecteurs_propres = np.linalg.eigh(Sigma_perturbee)\nvaleurs_propres_psd = np.maximum(valeurs_propres, 1e-6)\nSigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T\n\nprint(f'Plus petite valeur propre brute : {valeurs_propres.min():.6f}')\nprint(f'Plus petite valeur propre corrigée : {valeurs_propres_psd.min():.6f}')",
        testPythonCode: "assert 'Sigma_psd' in globals()\nassert 'valeurs_propres_psd' in globals()\nassert np.all(valeurs_propres_psd >= 1e-6)\nassert np.all(np.linalg.eigvalsh(Sigma_psd) > 0)",
        hints: ["valeurs_propres_psd = np.maximum(valeurs_propres, 1e-6)", "Sigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T"],
        datasets: []
      },
      {
        id: "v2-py-5",
        title: "5. Analyse en Composantes Principales (PCA) de la Courbe des Taux",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Extrayez les 3 facteurs canoniques de Litterman-Scheinkman (Niveau, Pente, Courbure) par ACP.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : ACP de la Courbe des Taux (Litterman & Scheinkman, 1991)

#### Intuition Économique & Immunisation ALM
Un assureur vie ou une banque gère des dizaines de maturités obligataires (1Y à 30Y). La sensibilité classique (*duration de Macaulay*) suppose une déformation purement **parallèle** de la courbe des taux. En réalité, la courbe pivote (politique monétaire BCE sur le court terme vs anticipations d'inflation sur le long terme) et se tord !

L'Analyse en Composantes Principales (ACP / PCA) appliquée aux **variations** de taux $\\Delta r_t$ découvre de manière purement empirique les 3 facteurs orthogonaux qui expliquent plus de **98 %** de la dynamique de la courbe, permettant de construire des couvertures ALM (*Key Rate Durations* / immunisation factorielle) avec seulement 3 instruments.

#### Démonstration Mathématique Formelle
1. **Dérivation Lagrangienne de la 1ère Composante Principale :**
   On cherche une combinaison linéaire normalisée $PC_{1,t} = \\tilde{\\mathbf{x}}_t' \\mathbf{u}_1$ ($\\|\\mathbf{u}_1\\|^2 = 1$) maximisant la variance $\\operatorname{Var}(PC_1) = \\mathbf{u}_1' \\Sigma \\mathbf{u}_1$. Le lagrangien s'écrit :
   $$\\mathcal{L}(\\mathbf{u}_1, \\lambda_1) = \\mathbf{u}_1' \\Sigma \\mathbf{u}_1 - \\lambda_1 (\\mathbf{u}_1' \\mathbf{u}_1 - 1)$$
   La condition du premier ordre annule le gradient :
   $$\\nabla_{\\mathbf{u}_1} \\mathcal{L} = 2 \\Sigma \\mathbf{u}_1 - 2 \\lambda_1 \\mathbf{u}_1 = \\mathbf{0} \\implies \\Sigma \\mathbf{u}_1 = \\lambda_1 \\mathbf{u}_1$$
   À l'optimum, la variance capturée vaut $\\mathbf{u}_1' \\Sigma \\mathbf{u}_1 = \\lambda_1 \\mathbf{u}_1' \\mathbf{u}_1 = \\lambda_1$ : c'est la **plus grande valeur propre** $\\lambda_{(1)}$ et son vecteur propre $\\mathbf{v}_{(1)}$ !

2. **Orthogonalité séquentielle & Conservation de la Trace :**
   En ajoutant la contrainte d'orthogonalité $\\mathbf{u}_k' \\mathbf{u}_j = 0$ pour $j < k$, les axes suivants sont les vecteurs propres ordonnés $\\lambda_{(1)} \\ge \\lambda_{(2)} \\ge \\dots \\ge \\lambda_{(K)}$. Comme $\\Sigma = V \\Lambda V'$ et par invariance cyclique de la trace ($\\operatorname{Tr}(V \\Lambda V') = \\operatorname{Tr}(\\Lambda V' V) = \\operatorname{Tr}(\\Lambda)$) :
   $$\\text{Variance Totale} = \\sum_{i=1}^K \\sigma_i^2 = \\operatorname{Tr}(\\Sigma) = \\sum_{k=1}^K \\lambda_{(k)}$$
   La part de variance expliquée par les $m$ premiers facteurs est donc exactement $\\frac{\\sum_{k=1}^m \\lambda_{(k)}}{\\sum_{k=1}^K \\lambda_{(k)}}$.

![Les 3 Composantes Principales de la Courbe des Taux](/images/theory/fig_pca_yield_curve.png)

> 🔍 **Comprendre ce graphique : Décomposition factorielle de Litterman & Scheinkman**
>
> - **PC1 (Niveau en bleu)** : Les chargements factoriels sont strictement positifs et quasi-uniformes sur toutes les maturités (1Y à 30Y). Une hausse de PC1 décale l'ensemble de la courbe vers le haut sans la déformer.
> - **PC2 (Pente en vert)** : Les poids traversent 0 (négatifs sur le 1Y-2Y, positifs sur le 20Y-30Y). Une variation de PC2 fait pivoter la courbe (*steepening* ou *flattening*).
> - **PC3 (Courbure en orange)** : Forme concave en papillon (*butterfly*). Les taux intermédiaires (5Y-10Y) évoluent en opposition avec les extrémités courtes (1Y) et longues (30Y).

### 💻 Masterclass Python & NumPy Avancé

* **Retournement par slicing \`[::-1]\` :** Comme \`np.linalg.eigh\` retourne les valeurs propres en ordre **croissant**, \`evals[::-1]\` inverse le vecteur 1D en temps $\\mathcal{O}(1)$ (simple vue mémoire à pas $-1$ sans copie), et \`V[:, ::-1]\` réordonne les colonnes de vecteurs propres du plus grand au plus petit facteur !
* **Indétermination de signe :** Un vecteur propre $\\mathbf{v}$ est défini au signe près ($-\\mathbf{v}$ est aussi vecteur propre). On adopte donc souvent une convention économique (par exemple $\\mathbf{v}_1$ positif sur la somme, et $\\mathbf{v}_2$ croissant du 1Y au 30Y).
* **Différenciation Pandas :** Sur des taux non stationnaires en niveau, l'ACP s'applique aux variations mensuelles \`df_taux[cols].diff().dropna()\`.

\`\`\`python
import numpy as np

# Application réelle sur la courbe des taux OAT 2023 'df_taux' préchargée dans QuantEcon Lab
mat_cols = ["taux_1y", "taux_2y", "taux_5y", "taux_10y", "taux_20y", "taux_30y"]
dX_taux = df_taux[mat_cols].diff().dropna().to_numpy()   # variations mensuelles (11, 6)

cov_taux = np.cov(dX_taux, rowvar=False)
ev_t, V_t = np.linalg.eigh(cov_taux)

# Inversion croissant -> décroissant
ev_desc = ev_t[::-1]
V_desc = V_t[:, ::-1]

# Convention de signe économique (PC1 niveau > 0 ; PC2 pente croissante)
if V_desc[0, 0] < 0:
    V_desc[:, 0] *= -1
if V_desc[-1, 1] < V_desc[0, 1]:
    V_desc[:, 1] *= -1

ratio = ev_desc / ev_desc.sum()
cum_ratio = np.cumsum(ratio)

print("Nb variations mensuelles 2023 :", dX_taux.shape[0])
print("Variance expliquee (%) :", np.round(ratio * 100, 2))
print("Variance cumulee  (%) :", np.round(cum_ratio * 100, 2))
print("Loadings PC1 (Niveau) :", np.round(V_desc[:, 0], 3))
print("Loadings PC2 (Pente)  :", np.round(V_desc[:, 1], 3))
print("Loadings PC3 (Courb.) :", np.round(V_desc[:, 2], 3))
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Nb variations mensuelles 2023 : 11
Variance expliquee (%) : [9.28e+01 6.22e+00 7.50e-01 1.60e-01 6.00e-02 1.00e-02]
Variance cumulee  (%) : [ 92.8   99.02  99.77  99.92  99.99 100.  ]
Loadings PC1 (Niveau) : [0.321 0.431 0.405 0.456 0.423 0.401]
Loadings PC2 (Pente)  : [-0.648 -0.466 -0.046  0.23   0.374  0.411]
Loadings PC3 (Courb.) : [ 0.433 -0.066 -0.732 -0.135  0.123  0.488]
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir des variations mensuelles simulées des 6 maturités souveraines \`dX\` (matrice $24 \\times 6$ pré-générée dans l'éditeur), extrayez les composantes principales :
1. Calculez la matrice de covariance \`cov_mat = np.cov(dX, rowvar=False)\`.
2. Extrayez les valeurs propres avec \`np.linalg.eigh(cov_mat)\` puis triez-les en ordre décroissant dans \`valeurs_triees = evals[::-1]\`.
3. Calculez le vecteur des ratios de variance expliquée \`ratio_explique = valeurs_triees / valeurs_triees.sum()\` et la variance cumulée des 3 premiers facteurs en pourcentage : \`pct_top3 = float(ratio_explique[:3].sum() * 100)\`.

Affichez \`ratio_explique\` et \`pct_top3\`.`,
        initialCode: "import numpy as np\n\nnp.random.seed(123)\n# Simulation des variations mensuelles de 6 maturités (1Y, 2Y, 5Y, 10Y, 20Y, 30Y)\n# Facteur niveau dominant + facteur pente + bruit résiduel\nlevel = np.random.randn(24, 1) * 0.25\nslope = np.random.randn(24, 1) * np.linspace(-0.15, 0.15, 6)\ndX = level + slope + np.random.randn(24, 6) * 0.03\n\n# Calculez cov_mat, valeurs_triees, ratio_explique et pct_top3 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(123)\nlevel = np.random.randn(24, 1) * 0.25\nslope = np.random.randn(24, 1) * np.linspace(-0.15, 0.15, 6)\ndX = level + slope + np.random.randn(24, 6) * 0.03\n\ncov_mat = np.cov(dX, rowvar=False)\nevals, _ = np.linalg.eigh(cov_mat)\nvaleurs_triees = evals[::-1]\nratio_explique = valeurs_triees / valeurs_triees.sum()\npct_top3 = float(ratio_explique[:3].sum() * 100)\n\nprint('Ratios de variance expliquée :', np.round(ratio_explique, 4))\nprint(f'Variance cumulée expliquée par les 3 premiers facteurs : {pct_top3:.2f}%')",
        testPythonCode: "assert 'ratio_explique' in globals()\nassert 'pct_top3' in globals()\nassert pct_top3 > 90.0\nassert np.isclose(ratio_explique.sum(), 1.0)",
        hints: ["evals, _ = np.linalg.eigh(cov_mat)", "valeurs_triees = evals[::-1]", "ratio_explique = valeurs_triees / valeurs_triees.sum()", "pct_top3 = float(ratio_explique[:3].sum() * 100)"],
        datasets: []
      },
      {
        id: "v2-py-6",
        title: "6. Dé-bruitage de Marchenko-Pastur (Random Matrix Theory)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Appliquez les résultats de la physique théorique (RMT) pour identifier les valeurs propres portant un vrai signal économique.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Théorie des Matrices Aléatoires & Loi de Marchenko-Pastur

#### Intuition Économique & Piège de la Malédiction de la Dimension
Pour estimer la matrice de corrélation d'un univers de $N = 500$ actions (S&P 500), il faut estimer $\\frac{N(N-1)}{2} = 124\\,750$ paramètres libres ! Avec 2 ans de données journalières ($T = 500$), le ratio d'échantillonnage vaut $q = T / N = 1$.

Dans un tel régime, même si tous les actifs étaient **purement indépendants** (vraie matrice $C = I_N$, où toutes les valeurs propres devraient valoir $1$), la matrice empirique présente des valeurs propres dispersées loin de $1$, certaines proches de $0$ et d'autres proches de $4$. Or l'optimiseur de Markowitz inverse la matrice ($C^{-1} = V \\Lambda^{-1} V'$) : il amplifie mécaniquement ces fausses plus petites valeurs propres de pur bruit (*error maximization* de Michaud) !

#### Démonstration & Énoncé Formel (Marchenko-Pastur, 1967)
Soit $X \\in \\mathbb{R}^{T \\times N}$ une matrice de variables i.i.d. centrées de variance $\\sigma^2$ (avec $\\sigma^2 = 1$ pour une matrice de corrélation), et soit $C = \\frac{1}{T} X' X$ sa matrice de Wishart normalisée. Dans le régime asymptotique $N, T \\to \\infty$ à ratio fixe $q = T / N \\ge 1$ ($c = N / T = 1/q$), la distribution spectrale empirique des valeurs propres converge presque sûrement vers la **densité de Marchenko-Pastur** :
$$\\rho_{\\text{MP}}(\\lambda) = \\frac{q}{2\\pi \\sigma^2} \\frac{\\sqrt{(\\lambda_+ - \\lambda)(\\lambda - \\lambda_-)}}{\\lambda} \\mathbf{1}_{[\\lambda_-, \\lambda_+]}(\\lambda)$$
où les bords exacts du spectre de bruit pur (pour $\\sigma^2 = 1$) valent :
$$\\lambda_{\\pm} = \\sigma^2 \\left( 1 \\pm \\sqrt{\\frac{N}{T}} \\right)^2 = \\left( 1 \\pm \\frac{1}{\\sqrt{q}} \\right)^2$$

**Protocole de filtrage RMT (Laloux, Cizeau, Bouchaud & Potters, 1999) :**
- **Zone de bruit ($\\lambda_i \\le \\lambda_+$)** : Indiscernable d'une matrice aléatoire de Wishart. En dé-bruitage (*eigenvalue clipping*), on remplace ces valeurs propres bruitées par leur moyenne afin de préserver la trace tout en stabilisant l'inversion.
- **Zone de signal ($\\lambda_i > \\lambda_+$)** : Facteurs économiques authentiques (marché global $\\lambda_1$, facteurs sectoriels ou styles).

### 💻 Masterclass Python & NumPy Avancé

* **Masquage booléen & comptage vectorisé :** L'expression \`evals_obs > lambda_plus\` crée un tableau NumPy de booléens \`[True, True, True, False, ...]\`. En arithmétique Python/NumPy, \`True == 1\` et \`False == 0\`, donc \`int(np.sum(evals_obs > lambda_plus))\` compte instantanément les éléments dépassant le seuil sans boucle \`for\`.
* **Division flottante :** En Python 3, \`N / T\` effectue toujours une division flottante (contrairement à Python 2), et \`(1.0 + np.sqrt(N / T))**2\` retourne un \`np.float64\`, d'où l'usage de \`float(...)\`.

\`\`\`python
import numpy as np

np.random.seed(42)
T, N = 500, 50

# 1. Matrice de pur bruit blanc gaussien (aucun facteur réel)
Z_noise = np.random.randn(T, N)
C_noise = np.corrcoef(Z_noise, rowvar=False)
ev_noise = np.linalg.eigvalsh(C_noise)[::-1]

# Bornes théoriques de Marchenko-Pastur (sigma^2 = 1)
lambda_minus = float((1.0 - np.sqrt(N / T))**2)
lambda_plus = float((1.0 + np.sqrt(N / T))**2)

# 2. Matrice avec 2 vrais facteurs latents (marché + secteur) + bruit
f1 = np.random.randn(T, 1) * 1.2
f2 = np.random.randn(T, 1) * np.hstack([np.ones(25), -np.ones(25)]) * 0.6
X_sig = f1 + f2 + np.random.randn(T, N)
C_sig = np.corrcoef(X_sig, rowvar=False)
ev_sig = np.linalg.eigvalsh(C_sig)[::-1]

print(f"Bornes Marchenko-Pastur (T={T}, N={N}) : [{lambda_minus:.4f}, {lambda_plus:.4f}]")
print(f"Bruit pur -> min={ev_noise.min():.4f}, max={ev_noise.max():.4f} | Signaux > lambda_+ : {int(np.sum(ev_noise > lambda_plus))}")
print(f"Modele 2 facteurs -> top 4 evals : {np.round(ev_sig[:4], 4)} | Signaux > lambda_+ : {int(np.sum(ev_sig > lambda_plus))}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Bornes Marchenko-Pastur (T=500, N=50) : [0.4675, 1.7325]
Bruit pur -> min=0.4844, max=1.6819 | Signaux > lambda_+ : 0
Modele 2 facteurs -> top 4 evals : [25.0278  7.22    0.6661  0.5963] | Signaux > lambda_+ : 2
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

Soit un portefeuille de $N = 50$ actifs observés sur $T = 500$ séances ($q = T/N = 10$, variance unitaire $\\sigma^2 = 1$) et un vecteur de valeurs propres observées \`evals_obs\`.
1. Calculez la borne supérieure théorique de bruit blanc : \`lambda_plus = float((1.0 + np.sqrt(N / T))**2)\`.
2. Comptez le nombre de valeurs propres porteuses d'un signal économique authentique (strictement supérieures à $\\lambda_+$) dans \`nb_signaux = int(np.sum(evals_obs > lambda_plus))\`.

Affichez \`lambda_plus\` et \`nb_signaux\`.`,
        initialCode: "import numpy as np\n\nT = 500\nN = 50\n\n# Valeurs propres observées sur un portefeuille réel (quelques facteurs de marché + bruit)\nevals_obs = np.array([12.5, 3.8, 2.1, 1.7, 1.4, 1.2, 1.1, 0.95, 0.82, 0.75])\n\n# Calculez lambda_plus et nb_signaux :\n",
        solutionCode: "import numpy as np\n\nT = 500\nN = 50\nevals_obs = np.array([12.5, 3.8, 2.1, 1.7, 1.4, 1.2, 1.1, 0.95, 0.82, 0.75])\n\nlambda_plus = float((1.0 + np.sqrt(N / T))**2)\nnb_signaux = int(np.sum(evals_obs > lambda_plus))\n\nprint(f'Borne supérieure de bruit lambda_+ : {lambda_plus:.4f}')\nprint(f'Nombre de facteurs authentiques (signaux) : {nb_signaux}')",
        testPythonCode: "assert 'lambda_plus' in globals()\nassert 'nb_signaux' in globals()\nassert np.isclose(lambda_plus, 1.73205, atol=0.01)\nassert nb_signaux == 3",
        hints: ["lambda_plus = float((1.0 + np.sqrt(N / T))**2)", "nb_signaux = int(np.sum(evals_obs > lambda_plus))"],
        datasets: []
      },
      {
        id: "v2-py-7",
        title: "7. Rétrécissement de Covariance : Estimateur de Ledoit-Wolf",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Combinez la matrice de covariance empirique et une cible structurée pour minimiser l'erreur quadratique moyenne.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Compromis Biais-Variance de Ledoit & Wolf (2004)

#### Intuition Économique & Stabilité en Out-of-Sample
La matrice de covariance empirique $S$ est sans biais, mais lorsque le nombre d'actifs $N$ approche le nombre de dates $T$, sa **variance d'estimation** devient catastrophique (et si $T \\le N$, $S$ est même singulière et non inversible !). À l'inverse, une cible structurée $F$ très parcimonieuse (ex. matrice diagonale à variance moyenne constante $F = \\bar{\\sigma}^2 I_N$) a un **biais**, mais une variance d'estimation quasi nulle.

Ledoit et Wolf (2004) résolvent ce dilemme en formant une combinaison convexe entre $S$ et $F$ qui réduit drastiquement le nombre de conditionnement $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$ et améliore la performance *out-of-sample* des portefeuilles de Markowitz.

#### Démonstration Mathématique Formelle (Perte de Frobenius)
Considérons l'espace hilbertien des matrices muni du produit scalaire $\\langle A, B \\rangle_F = \\operatorname{Tr}(A' B)$ et de la norme $\\|A\\|_F^2 = \\langle A, A \\rangle_F$. On cherche l'intensité de rétrécissement $\\alpha \\in [0, 1]$ minimisant le risque quadratique espéré de $\\Sigma_{\\text{LW}}(\\alpha) = (1 - \\alpha) S + \\alpha F$ :
$$\\min_{\\alpha \\in [0, 1]} \\mathcal{R}(\\alpha) = \\mathbb{E}\\left[\\|(1 - \\alpha) S + \\alpha F - \\Sigma\\|_F^2\\right]$$
En écrivant $(1-\\alpha)S + \\alpha F - \\Sigma = (1-\\alpha)(S - \\Sigma) + \\alpha(F - \\Sigma)$ et en développant le carré scalaire :
$$\\mathcal{R}(\\alpha) = (1-\\alpha)^2 \\mathbb{E}\\left[\\|S - \\Sigma\\|_F^2\\right] + \\alpha^2 \\|F - \\Sigma\\|_F^2 + 2\\alpha(1-\\alpha)\\langle \\mathbb{E}[S] - \\Sigma, F - \\Sigma \\rangle_F$$
Puisque $S$ est sans biais ($\\mathbb{E}[S] = \\Sigma$), le terme croisé d'orthogonalité s'annule identiquement ! En annulant la dérivée $\\mathcal{R}'(\\alpha) = 0$ :
$$-2(1-\\alpha) \\mathbb{E}\\left[\\|S - \\Sigma\\|_F^2\\right] + 2\\alpha \\|F - \\Sigma\\|_F^2 = 0$$
On obtient la formule analytique exacte du coefficient optimal $\\alpha^*$ (arbitrage optimal **Variance / Biais²**) :
$$\\alpha^* = \\frac{\\mathbb{E}\\left[\\|S - \\Sigma\\|_F^2\\right]}{\\mathbb{E}\\left[\\|S - \\Sigma\\|_F^2\\right] + \\|F - \\Sigma\\|_F^2}$$
Plus la matrice empirique $S$ est bruitée (ratio $N/T$ élevé), plus $\\alpha^*$ augmente vers $1$ ; lorsque $T \\to \\infty$, $\\mathbb{E}[\\|S - \\Sigma\\|_F^2] \\to 0$ et $\\alpha^* \\to 0$.

### 💻 Masterclass Python & NumPy Avancé

* **Cible structurée à trace conservée :** \`F = np.eye(N) * (np.trace(S) / N)\` crée une matrice diagonale où chaque actif porte la variance moyenne $\\bar{\\sigma}^2 = \\frac{1}{N}\\operatorname{Tr}(S)$. Par linéarité de la trace, $\\operatorname{Tr}(\\Sigma_{\\text{LW}}) = (1-\\alpha)\\operatorname{Tr}(S) + \\alpha\\operatorname{Tr}(F) = \\operatorname{Tr}(S)$ !
* **Conditionnement \`np.linalg.cond\` :** Mesure le rapport $\\lambda_{\\max} / \\lambda_{\\min}$ d'une matrice symétrique définie positive. Un conditionnement élevé ($> 10^3$) indique que l'inversion $\\Sigma^{-1}$ va exploser numériquement.

\`\`\`python
import numpy as np

np.random.seed(42)
N, T = 30, 35                                       # régime haute dimension (N proche de T)

# Vraie matrice à 1 facteur latent + risques spécifiques
beta_true = np.random.uniform(0.5, 1.3, size=(N, 1)) * 0.10
Sigma_true = beta_true @ beta_true.T + np.diag(np.full(N, 0.04))
L_true = np.linalg.cholesky(Sigma_true)

# Échantillon empirique bruité et cible identité scalée F
X = (L_true @ np.random.randn(N, T)).T
S = np.cov(X, rowvar=False)
F = np.eye(N) * (np.trace(S) / N)

# Intensité oracle minimisant ||(1 - alpha)*S + alpha*F - Sigma_true||_F^2
alpha_oracle = float(np.clip(np.sum((S - Sigma_true) * (S - F)) / np.sum((S - F)**2), 0.0, 1.0))
Sigma_lw = (1.0 - alpha_oracle) * S + alpha_oracle * F

print(f"T={T}, N={N} | Intensite optimale alpha* = {alpha_oracle:.4f}")
print(f"Trace(S) = {np.trace(S):.6f} | Trace(Sigma_lw) = {np.trace(Sigma_lw):.6f}")
print(f"Conditionnement : cond(S) = {np.linalg.cond(S):.2f} -> cond(Sigma_lw) = {np.linalg.cond(Sigma_lw):.2f}")
print(f"Erreur Frobenius brute ||S - Sigma||_F      = {np.linalg.norm(S - Sigma_true, 'fro'):.4f}")
print(f"Erreur Frobenius retrecie ||LW - Sigma||_F  = {np.linalg.norm(Sigma_lw - Sigma_true, 'fro'):.4f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
T=35, N=30 | Intensite optimale alpha* = 0.5101
Trace(S) = 1.388372 | Trace(Sigma_lw) = 1.388372
Conditionnement : cond(S) = 1161.11 -> cond(Sigma_lw) = 7.27
Erreur Frobenius brute ||S - Sigma||_F      = 0.2329
Erreur Frobenius retrecie ||LW - Sigma||_F  = 0.1628
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la matrice empirique \`Sigma_sample\` ($3 \\times 3$) et du coefficient de rétrécissement \`alpha = 0.25\` :
1. Construisez la matrice cible diagonale à variance moyenne constante : \`F = np.eye(3) * (np.trace(Sigma_sample) / 3.0)\`.
2. Calculez la matrice rétrécie de Ledoit-Wolf : \`Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F\`.

Affichez \`Sigma_lw\` et vérifiez que la trace est conservée.`,
        initialCode: "import numpy as np\n\nSigma_sample = np.array([\n    [0.08, 0.03, 0.01],\n    [0.03, 0.12, 0.05],\n    [0.01, 0.05, 0.06]\n])\nalpha = 0.25\n\n# Calculez la matrice cible F et la matrice rétrécie Sigma_lw :\n",
        solutionCode: "import numpy as np\n\nSigma_sample = np.array([\n    [0.08, 0.03, 0.01],\n    [0.03, 0.12, 0.05],\n    [0.01, 0.05, 0.06]\n])\nalpha = 0.25\n\nF = np.eye(3) * (np.trace(Sigma_sample) / 3.0)\nSigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F\n\nprint('Matrice Rétrécie de Ledoit-Wolf Sigma_lw :\\n', np.round(Sigma_lw, 5))",
        testPythonCode: "assert 'F' in globals()\nassert 'Sigma_lw' in globals()\nassert Sigma_lw.shape == (3, 3)\nassert np.isclose(np.trace(Sigma_lw), np.trace(Sigma_sample))",
        hints: ["F = np.eye(3) * (np.trace(Sigma_sample) / 3.0)", "Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F"],
        datasets: []
      },
      {
        id: "v2-py-8",
        title: "8. Portefeuille de Variance Minimale Globale (GMVP Analytique)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Résolvez analytiquement le portefeuille GMVP de Markowitz sans requérir d'estimation des espérances de rendements.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Dérivation KKT Complète du Portefeuille GMVP

#### Intuition Économique & Robustesse Empirique
En allocation quantitative, estimer les rendements espérés $\\boldsymbol{\\mu}$ avec précision est presque impossible (*Merton's blur* : il faudrait des décennies de données pour distinguer $\\mu = 7\\%$ de $\\mu = 9\\%$). À l'inverse, la matrice de covariance $\\Sigma$ s'estime beaucoup plus fidèlement sur données haute fréquence.

Le **Global Minimum Variance Portfolio (GMVP)** élimine totalement le vecteur $\\boldsymbol{\\mu}$ : c'est le sommet gauche de l'hyperbole de Markowitz, offrant la volatilité la plus basse mathématiquement réalisable parmi tous les portefeuilles pleinement investis ($\\sum w_i = 1$). En gestion institutionnelle (*Minimum Variance Equity*, fonds défensifs ALM), le GMVP surpasse régulièrement les portefeuilles tangents hors échantillon grâce à cette absence d'erreur d'estimation sur $\\boldsymbol{\\mu}$.

#### Démonstration Mathématique Formelle (Conditions KKT)
Soit $\\Sigma \\succ 0$ symétrique définie positive. Le GMVP résout le programme quadratique strictement convexe sous contrainte d'égalité linéaire :
$$\\min_{\\mathbf{w} \\in \\mathbb{R}^K} \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} \\qquad \\text{sous la contrainte} \\qquad \\mathbf{w}' \\mathbf{1} - 1 = 0$$

Formons le **Lagrangien** avec multiplicateur $\\lambda \\in \\mathbb{R}$ :
$$\\mathcal{L}(\\mathbf{w}, \\lambda) = \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} - \\lambda (\\mathbf{w}' \\mathbf{1} - 1)$$

1. **Condition KKT du premier ordre (Stationnarité) :**
   $$\\nabla_{\\mathbf{w}} \\mathcal{L}(\\mathbf{w}, \\lambda) = \\Sigma \\mathbf{w} - \\lambda \\mathbf{1} = \\mathbf{0} \\implies \\mathbf{w}^* = \\lambda \\Sigma^{-1} \\mathbf{1}$$
2. **Contrainte primale (Saturation du budget) :**
   $$\\mathbf{1}' \\mathbf{w}^* = 1 \\implies \\lambda (\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}) = 1 \\implies \\lambda^* = \\frac{1}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}$$
3. **Condition du second ordre (Convexité stricte) :**
   Le hessien $\\nabla^2_{\\mathbf{w}\\mathbf{w}} \\mathcal{L} = \\Sigma \\succ 0$ garantit que $\\mathbf{w}_{\\text{GMVP}}$ est l'**unique minimum global** :
   $$\\mathbf{w}_{\\text{GMVP}} = \\frac{\\Sigma^{-1} \\mathbf{1}}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}, \\qquad \\sigma^2_{\\text{GMVP}} = (\\mathbf{w}_{\\text{GMVP}})' \\Sigma \\mathbf{w}_{\\text{GMVP}} = \\frac{1}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}$$
   *Propriété économique remarquable :* À l'optimum, $\\Sigma \\mathbf{w}_{\\text{GMVP}} = \\lambda^* \\mathbf{1} = \\sigma^2_{\\text{GMVP}} \\mathbf{1}$, ce qui signifie que la **covariance marginale de chaque actif avec le portefeuille GMVP est strictement identique** pour tous les titres !

> ✏️ **Exemple chiffré & Résolution algébrique pas-à-pas (Cas à 2 actifs décorrélés) :**
>
> Soit 2 actifs décorrélés de variances $\\sigma_1^2 = 0.04$ ($20\\%$) et $\\sigma_2^2 = 0.16$ ($40\\%$) :
> $$\\Sigma = \\begin{pmatrix} 0.04 & 0 \\\\ 0 & 0.16 \\end{pmatrix} \\implies \\Sigma^{-1} = \\begin{pmatrix} 25 & 0 \\\\ 0 & 6.25 \\end{pmatrix}$$
> 1. $\\Sigma^{-1} \\mathbf{1} = \\begin{pmatrix} 25 \\\\ 6.25 \\end{pmatrix}$ et dénominateur scalaire $\\mathbf{1}' \\Sigma^{-1} \\mathbf{1} = 25 + 6.25 = 31.25$.
> 2. Poids optimaux : $w_1 = \\frac{25}{31.25} = \\mathbf{0.80}$ ($80\\%$), $w_2 = \\frac{6.25}{31.25} = \\mathbf{0.20}$ ($20\\%$) (pondération inversement proportionnelle à la variance).
> 3. Variance & volatilité minimales : $\\sigma^2_{\\text{GMVP}} = \\frac{1}{31.25} = 0.032 \\implies \\sigma_{\\text{GMVP}} = \\sqrt{0.032} \\approx \\mathbf{17.89\\%}$ ($< 20\\%$ grâce à la diversification).

### 💻 Masterclass Python & NumPy Avancé

* **\`np.linalg.solve\` vs \`np.linalg.inv\` :** Calculer explicitement l'inverse matricielle \`inv(Sigma)\` puis multiplier par \`ones\` est plus lent et numériquement moins stable que de résoudre directement le système linéaire $\\Sigma \\mathbf{x} = \\mathbf{1}$ via \`np.linalg.solve(Sigma, ones)\` (factorisation LU). En grande dimension ($K = 500$), \`solve\` réduit les erreurs d'arrondi tout en donnant mathématiquement exactement la même solution normalisée $\\mathbf{x} / (\\mathbf{1}'\\mathbf{x})$.
* **\`np.ones(len(Sigma))\` :** \`len(Sigma)\` retourne le nombre de lignes $K$, générant dynamiquement le vecteur unitaire $\\mathbf{1}_K$ sans coder la dimension en dur.

\`\`\`python
import numpy as np

Sigma = np.array([
    [0.04, 0.015, 0.008],
    [0.015, 0.06, 0.02],
    [0.008, 0.02, 0.03]
])
ones = np.ones(len(Sigma))

# Résolution stable via système linéaire Sigma @ x = 1 (équivalent à inv(Sigma) @ ones)
x_solve = np.linalg.solve(Sigma, ones)
w_gmvp = x_solve / (ones @ x_solve)
var_gmvp = float(1.0 / (ones @ x_solve))
vol_gmvp = float(np.sqrt(var_gmvp))

# Vérification numérique de la condition KKT : Sigma @ w - var_gmvp * 1 == 0
kkt_res = np.max(np.abs(Sigma @ w_gmvp - var_gmvp * ones))

print("Poids GMVP (solve) :", np.round(w_gmvp, 6))
print(f"Volatilite GMVP    : {vol_gmvp:.6f} ({vol_gmvp:.2%})")
print(f"Contribution marginale Sigma @ w : {np.round(Sigma @ w_gmvp, 6)} (egalite KKT !)")
print(f"Residu KKT max     : {kkt_res:.2e}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Poids GMVP (solve) : [0.385732 0.068851 0.545417]
Volatilite GMVP    : 0.144310 (14.43%)
Contribution marginale Sigma @ w : [0.020825 0.020825 0.020825] (egalite KKT !)
Residu KKT max     : 0.00e+00
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la matrice de covariance \`Sigma\` ($3 \\times 3$) définie dans l'éditeur :
1. Calculez son inverse \`inv_Sigma = np.linalg.inv(Sigma)\` et le vecteur unitaire \`ones = np.ones(len(Sigma))\`.
2. Implémentez la formule fermée du GMVP : \`w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)\`.
3. Calculez la volatilité minimale annualisée : \`vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))\`.

Affichez les poids, la somme des poids ($1.0$) et \`vol_gmvp\`.`,
        initialCode: "import numpy as np\n\nSigma = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.06, 0.02],\n    [0.008, 0.02, 0.03]\n])\n\n# Calculez w_gmvp et vol_gmvp :\n",
        solutionCode: "import numpy as np\n\nSigma = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.06, 0.02],\n    [0.008, 0.02, 0.03]\n])\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(Sigma))\nw_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)\nvol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))\n\nprint('Poids optimaux GMVP :', np.round(w_gmvp, 4))\nprint(f'Somme des poids : {w_gmvp.sum():.4f}')\nprint(f'Volatilité minimale annualisée : {vol_gmvp:.4f}')",
        testPythonCode: "assert 'w_gmvp' in globals()\nassert 'vol_gmvp' in globals()\nassert np.isclose(w_gmvp.sum(), 1.0)\nassert vol_gmvp > 0\nassert np.isclose(vol_gmvp, np.sqrt(w_gmvp @ Sigma @ w_gmvp))",
        hints: ["inv_Sigma = np.linalg.inv(Sigma)", "ones = np.ones(len(Sigma))", "w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)", "vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))"],
        datasets: []
      },
      {
        id: "v2-py-9",
        title: "9. Frontière Efficiente de Markowitz (Tracé & Optimisation)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Tracez la frontière efficiente (parabole dans le plan variance-espérance) à l'aide de Matplotlib.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : La Parabole Analytique de Merton (1972)

#### Intuition Économique & Enjeux d'Allocation Stratégique
Le GMVP minimise le risque sans se soucier du rendement. Or, un fonds de pension ou un assureur vise un **objectif de rendement cible** $\\mu_p$ (par exemple couvrir un taux garanti technique de $3.5\\%$ + frais). Quel est le portefeuille le moins risqué permettant d'atteindre $\\mu_p$ ? En faisant varier $\\mu_p$, on trace l'enveloppe optimale de l'univers d'investissement : la **frontière de Markowitz**.

#### Démonstration Mathématique Formelle (Lagrangien à Deux Contraintes)
Pour $\\Sigma \\succ 0$ et $\\boldsymbol{\\mu}$ non colinéaire à $\\mathbf{1}$, on résout :
$$\\min_{\\mathbf{w} \\in \\mathbb{R}^K} \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} \\qquad \\text{s.c.} \\qquad \\mathbf{w}' \\boldsymbol{\\mu} = \\mu_p, \\quad \\mathbf{w}' \\mathbf{1} = 1$$

Le Lagrangien à deux multiplicateurs $(\\lambda_1, \\lambda_2)$ s'écrit :
$$\\mathcal{L}(\\mathbf{w}, \\lambda_1, \\lambda_2) = \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} - \\lambda_1 (\\mathbf{w}' \\boldsymbol{\\mu} - \\mu_p) - \\lambda_2 (\\mathbf{w}' \\mathbf{1} - 1)$$

1. **Stationnarité :** $\\nabla_{\\mathbf{w}} \\mathcal{L} = \\Sigma \\mathbf{w} - \\lambda_1 \\boldsymbol{\\mu} - \\lambda_2 \\mathbf{1} = \\mathbf{0} \\implies \\mathbf{w}^* = \\lambda_1 \\Sigma^{-1}\\boldsymbol{\\mu} + \\lambda_2 \\Sigma^{-1}\\mathbf{1}$.
2. **Système des trois scalaires de Merton :**
   Posons $A = \\mathbf{1}' \\Sigma^{-1} \\mathbf{1} > 0$, $B = \\mathbf{1}' \\Sigma^{-1} \\boldsymbol{\\mu}$, et $C = \\boldsymbol{\\mu}' \\Sigma^{-1} \\boldsymbol{\\mu} > 0$. En substituant $\\mathbf{w}^*$ dans les deux contraintes, on obtient le système $2 \\times 2$ :
   $$\\begin{pmatrix} C & B \\\\ B & A \\end{pmatrix} \\begin{pmatrix} \\lambda_1 \\\\ \\lambda_2 \\end{pmatrix} = \\begin{pmatrix} \\mu_p \\\\ 1 \\end{pmatrix}$$
   Par l'inégalité de Cauchy-Schwarz stricte (pour le produit scalaire $\\langle \\mathbf{x}, \\mathbf{y} \\rangle_{\\Sigma^{-1}} = \\mathbf{x}'\\Sigma^{-1}\\mathbf{y}$), le déterminant $\\Delta = AC - B^2 > 0$. Par inversion de Cramer :
   $$\\lambda_1 = \\frac{A\\mu_p - B}{\\Delta}, \\qquad \\lambda_2 = \\frac{C - B\\mu_p}{\\Delta}$$
3. **Équation de la Parabole et Théorème de Séparation à 2 Fonds (Black, 1972) :**
   En multipliant $\\Sigma \\mathbf{w}^* = \\lambda_1 \\boldsymbol{\\mu} + \\lambda_2 \\mathbf{1}$ à gauche par $(\\mathbf{w}^*)'$, on obtient directement la variance minimale :
   $$\\sigma_p^2 = (\\mathbf{w}^*)' \\Sigma \\mathbf{w}^* = \\lambda_1 \\mu_p + \\lambda_2 = \\frac{A \\mu_p^2 - 2B \\mu_p + C}{\\Delta}$$
   C'est une **parabole** exacte dans le plan $(\\mu_p, \\sigma_p^2)$ et une **hyperbole** dans le plan $(\\sigma_p, \\mu_p)$, de sommet le GMVP en $\\mu_{\\text{GMVP}} = \\frac{B}{A}$ et $\\sigma_{\\text{GMVP}}^2 = \\frac{1}{A}$. De plus, tout portefeuille de la frontière $\\mathbf{w}^*(\\mu_p)$ est combinaison linéaire de **deux seuls fonds** de base ($\\Sigma^{-1}\\mathbf{1}/A$ et $\\Sigma^{-1}\\boldsymbol{\\mu}/B$).

![Frontière Efficiente de Markowitz et GMVP](/images/theory/fig_markowitz_efficient_frontier.png)

> 🔍 **Comprendre ce graphique : L'univers risque-rendement de Markowitz**
>
> - **L'hyperbole (Markowitz Bullet)** : Délimite la frontière de tous les portefeuilles réalisables avec les actifs risqués. Tout portefeuille à l'intérieur de la zone grise offre un rendement sous-optimal pour son niveau de risque.
> - **Le point rouge (GMVP)** : Le portefeuille de variance minimale globale (*Global Minimum Variance Portfolio*). C'est le point d'inflexion extrême gauche, où le risque $\\sigma$ est minimal absolu ($1 / \\sqrt{A}$).
> - **La frontière efficiente (branche bleue supérieure)** : La demi-hyperbole située au-dessus du GMVP. C'est le lieu géométrique des portefeuilles dominants : impossible d'obtenir un meilleur rendement $\\mathbb{E}[R]$ sans accepter une volatilité $\\sigma$ plus élevée.
> - **La Capital Market Line (CML en pointillés)** : Tangente à la frontière passant par le taux sans risque $r_f$, identifiant le portefeuille de ratio de Sharpe maximal.

### 💻 Masterclass Python & NumPy Avancé

* **Évaluation vectorisée via \`np.linspace\` :** \`np.linspace(0.05, 0.12, 50)\` génère une grille régulière de 50 cibles de rendement. L'expression \`(A * mu_targets**2 - 2 * B * mu_targets + C) / Delta\` s'applique instantanément sur tout le tableau sans boucle.
* **Rendu Matplotlib dans Pyodide :** Ne forcez pas \`plt.show()\` de manière bloquante ; l'environnement QuantEcon Lab capture automatiquement toutes les figures actives après exécution.

\`\`\`python
import numpy as np

mu = np.array([0.06, 0.09, 0.11])
Sigma = np.array([
    [0.02, 0.005, 0.002],
    [0.005, 0.04, 0.01],
    [0.002, 0.01, 0.05]
])
ones = np.ones(len(mu))
inv_S = np.linalg.inv(Sigma)

# Calcul des 3 constantes de Merton et du déterminant Delta
A = float(ones @ inv_S @ ones)
B = float(ones @ inv_S @ mu)
C = float(mu @ inv_S @ mu)
Delta = A * C - B**2

print(f"A={A:.4f}, B={B:.4f}, C={C:.4f}, Delta={Delta:.4f}")
print(f"Sommet GMVP : mu_GMVP = {B/A:.4%}, vol_GMVP = {np.sqrt(1/A):.4%}")

# Vérification du théorème de séparation à 2 fonds sur 4 cibles de rendement
for m_t in [0.06, 0.08, 0.10, 0.12]:
    l1 = (A * m_t - B) / Delta
    l2 = (C - B * m_t) / Delta
    w_t = l1 * (inv_S @ mu) + l2 * (inv_S @ ones)
    var_parab = (A * m_t**2 - 2 * B * m_t + C) / Delta
    var_quad = float(w_t @ Sigma @ w_t)
    print(f"mu_p={m_t:.2%} -> w={np.round(w_t, 3)}, vol={np.sqrt(var_parab):.4%} (ecart quad={abs(var_parab-var_quad):.1e})")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
A=75.3194, B=5.7431, C=0.4796, Delta=3.1367
Sommet GMVP : mu_GMVP = 7.6250%, vol_GMVP = 11.5225%
mu_p=6.00% -> w=[ 0.964  0.091 -0.055], vol=14.0064% (ecart quad=4.2e-17)
mu_p=8.00% -> w=[0.506 0.235 0.259], vol=11.6681% (ecart quad=3.3e-17)
mu_p=10.00% -> w=[0.049 0.379 0.573], vol=16.3770% (ecart quad=1.0e-16)
mu_p=12.00% -> w=[-0.409  0.523  0.886], vol=24.3386% (ecart quad=1.7e-16)
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de \`mu\` et \`Sigma\` ($3 \\times 3$), implémentez le calcul analytique et le tracé Matplotlib de la frontière efficiente :
1. Calculez les constantes scalaires \`A\`, \`B\`, \`C\` et le déterminant \`Delta = A * C - B**2\`.
2. Sur une grille \`mu_targets = np.linspace(0.05, 0.12, 50)\`, évaluez les variances \`var_targets = (A * mu_targets**2 - 2 * B * mu_targets + C) / Delta\`.
3. Tracez \`np.sqrt(var_targets)\` en abscisse contre \`mu_targets\` en ordonnée avec \`plt.plot(...)\` et placez le point GMVP.

Affichez \`A\`, \`B\`, \`C\` et \`Delta\`.`,
        initialCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nmu = np.array([0.06, 0.09, 0.11])\nSigma = np.array([\n    [0.02, 0.005, 0.002],\n    [0.005, 0.04, 0.01],\n    [0.002, 0.01, 0.05]\n])\n\n# Calculez A, B, C, var_targets et générez le tracé Matplotlib :\n",
        solutionCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nmu = np.array([0.06, 0.09, 0.11])\nSigma = np.array([\n    [0.02, 0.005, 0.002],\n    [0.005, 0.04, 0.01],\n    [0.002, 0.01, 0.05]\n])\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(mu))\n\nA = float(ones @ inv_Sigma @ ones)\nB = float(ones @ inv_Sigma @ mu)\nC = float(mu @ inv_Sigma @ mu)\nDelta = A * C - B**2\n\nmu_targets = np.linspace(0.05, 0.12, 50)\nvar_targets = (A * mu_targets**2 - 2 * B * mu_targets + C) / Delta\nvols = np.sqrt(var_targets)\n\nplt.figure(figsize=(6, 4))\nplt.plot(vols * 100, mu_targets * 100, color='#0284c7', lw=2.2, label='Frontière Efficiente')\nplt.scatter([np.sqrt(1/A)*100], [B/A*100], color='#e11d48', s=60, zorder=5, label='GMVP')\nplt.xlabel('Volatilité (%)')\nplt.ylabel('Rendement Espéré (%)')\nplt.title('Frontière Efficiente de Markowitz')\nplt.legend()\nplt.grid(True, alpha=0.3)\n\nprint(f'Constantes : A={A:.2f}, B={B:.2f}, C={C:.2f}, Delta={Delta:.4f}')",
        testPythonCode: "assert 'A' in globals()\nassert 'B' in globals()\nassert 'C' in globals()\nassert 'Delta' in globals()\nassert Delta > 0",
        hints: ["A = float(ones @ inv_Sigma @ ones)", "B = float(ones @ inv_Sigma @ mu)", "C = float(mu @ inv_Sigma @ mu)", "Delta = A * C - B**2"],
        datasets: []
      },
      {
        id: "v2-py-10",
        title: "10. Portefeuille de Tangence & Maximisation du Ratio de Sharpe",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Déterminez le portefeuille tangent à la Capital Market Line (CML) en présence d'un actif sans risque.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Théorème de Séparation de Tobin (1958) & Tangence

#### Intuition Économique & Capital Market Line (CML)
Lorsqu'un investisseur peut placer ou emprunter au taux sans risque $r_f$ (fonds monétaires Ester, bons du Trésor), l'ensemble des portefeuilles efficients s'aplatit en une demi-droite : la **Capital Market Line**. Tous les investisseurs rationnels — quel que soit leur degré d'aversion au risque — détiennent **exactement le même portefeuille d'actifs risqués** (le portefeuille de tangence $\\mathbf{w}_T$) et ajustent leur risque global uniquement en dosant la proportion de cash sans risque ($w_f$) ! C'est le célèbre **théorème de séparation à un fonds risqué de Tobin (1958)**.

#### Démonstration Mathématique Formelle (Maximisation du Ratio de Sharpe)
Un portefeuille risqué $\\mathbf{w}$ ($\\mathbf{w}'\\mathbf{1} = 1$) combiné au taux $r_f$ présente la pente rendement-risque (ratio de Sharpe) :
$$S(\\mathbf{w}) = \\frac{\\mathbf{w}' \\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}' \\Sigma \\mathbf{w}}} = \\frac{\\mathbf{w}' (\\boldsymbol{\\mu} - r_f \\mathbf{1})}{\\sqrt{\\mathbf{w}' \\Sigma \\mathbf{w}}}$$
Notons que $S(c\\mathbf{w}) = S(\\mathbf{w})$ pour tout scalaire $c > 0$ (homogénéité de degré $0$) : la contrainte $\\mathbf{w}'\\mathbf{1} = 1$ n'est qu'une normalisation finale ! Annulons le gradient de $S(\\mathbf{w})$ par rapport à $\\mathbf{w}$ en notant $\\tilde{\\boldsymbol{\\mu}} = \\boldsymbol{\\mu} - r_f \\mathbf{1}$ :
$$\\nabla_{\\mathbf{w}} S(\\mathbf{w}) = \\frac{\\tilde{\\boldsymbol{\\mu}}}{\\sqrt{\\mathbf{w}'\\Sigma\\mathbf{w}}} - \\frac{\\mathbf{w}'\\tilde{\\boldsymbol{\\mu}}}{(\\mathbf{w}'\\Sigma\\mathbf{w})^{3/2}} \\Sigma \\mathbf{w} = \\mathbf{0}$$
En multipliant par $\\sqrt{\\mathbf{w}'\\Sigma\\mathbf{w}}$, il vient immédiatement :
$$\\Sigma \\mathbf{w} = \\underbrace{\\left(\\frac{\\mathbf{w}'\\Sigma\\mathbf{w}}{\\mathbf{w}'\\tilde{\\boldsymbol{\\mu}}}\\right)}_{\\text{scalaire } \\kappa} \\tilde{\\boldsymbol{\\mu}} \\implies \\mathbf{w} \\propto \\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})$$

Sous la **condition d'existence sur la branche supérieure** $\\mathbf{1}' \\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1}) = B - A r_f > 0$ (soit $\\mu_{\\text{GMVP}} > r_f$), la normalisation $\\mathbf{1}'\\mathbf{w}_T = 1$ donne la solution analytique exacte :
$$\\mathbf{w}_T = \\frac{\\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})}{\\mathbf{1}' \\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})}$$
En injectant $\\mathbf{w}_T$ dans la définition de $S(\\mathbf{w}_T)$, on obtient la formule fermée remarquable du **Sharpe maximal** :
$$S_{\\max} = \\sqrt{(\\boldsymbol{\\mu} - r_f \\mathbf{1})' \\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})} = \\sqrt{C - 2B r_f + A r_f^2}$$

### 💻 Masterclass Python & NumPy Avancé

* **Broadcasting scalaire \`mu - rf * ones\` :** En NumPy, \`mu - rf\` fonctionne également par *broadcasting* du scalaire \`rf\` sur le vecteur \`mu\`, mais écrire explicitement \`mu - rf * ones\` reflète fidèlement la formule algébrique $\\boldsymbol{\\mu} - r_f \\mathbf{1}$.
* **Vérification de la branche efficiente :** Contrôler que \`ones @ inv_Sigma @ exces_mu > 0\` protège contre le cas dégénéré où $r_f > \\mu_{\\text{GMVP}}$ (qui placerait le point de tangence sur la branche *inefficiente* inférieure de l'hyperbole !).

\`\`\`python
import numpy as np

mu = np.array([0.07, 0.09, 0.12])
Sigma = np.array([
    [0.03, 0.008, 0.005],
    [0.008, 0.05, 0.012],
    [0.005, 0.012, 0.07]
])
rf = 0.025
ones = np.ones(len(mu))
inv_S = np.linalg.inv(Sigma)

# Vecteur des primes de risque (excès de rendement)
exces_mu = mu - rf * ones
denom = float(ones @ inv_S @ exces_mu)              # B - A * rf (doit être > 0)
w_T = (inv_S @ exces_mu) / denom

mu_T = float(w_T @ mu)
vol_T = float(np.sqrt(w_T @ Sigma @ w_T))
sharpe_T = (mu_T - rf) / vol_T
sharpe_closed = float(np.sqrt(exces_mu @ inv_S @ exces_mu))

print(f"Condition existence (1' Sigma^-1 (mu - rf*1) > 0) : {denom:.4f}")
print("Poids Tangence w_T :", np.round(w_T, 4))
print(f"Rendement T = {mu_T:.4%}, Vol T = {vol_T:.4%}")
print(f"Sharpe (ratio) = {sharpe_T:.6f} | Sharpe (forme fermee) = {sharpe_closed:.6f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Condition existence (1' Sigma^-1 (mu - rf*1) > 0) : 3.0712
Poids Tangence w_T : [0.3527 0.2783 0.369 ]
Rendement T = 9.4016%, Vol T = 14.9907%
Sharpe (ratio) = 0.460390 | Sharpe (forme fermee) = 0.460390
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de \`mu\`, \`Sigma\` et du taux sans risque \`rf = 0.025\` :
1. Calculez \`inv_Sigma = np.linalg.inv(Sigma)\`, \`ones = np.ones(len(mu))\` et le vecteur des primes de risque \`exces_mu = mu - rf * ones\`.
2. Déterminez les poids du portefeuille tangent : \`w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)\`.
3. Calculez le ratio de Sharpe maximal atteint : \`sharpe_opt = float((w_tangence @ mu - rf) / np.sqrt(w_tangence @ Sigma @ w_tangence))\`.

Affichez \`w_tangence\` et \`sharpe_opt\`.`,
        initialCode: "import numpy as np\n\nmu = np.array([0.07, 0.09, 0.12])\nSigma = np.array([\n    [0.03, 0.008, 0.005],\n    [0.008, 0.05, 0.012],\n    [0.005, 0.012, 0.07]\n])\nrf = 0.025\n\n# Calculez w_tangence et sharpe_opt :\n",
        solutionCode: "import numpy as np\n\nmu = np.array([0.07, 0.09, 0.12])\nSigma = np.array([\n    [0.03, 0.008, 0.005],\n    [0.008, 0.05, 0.012],\n    [0.005, 0.012, 0.07]\n])\nrf = 0.025\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(mu))\nexces_mu = mu - rf * ones\nw_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)\n\nmu_T = float(w_tangence @ mu)\nvol_T = float(np.sqrt(w_tangence @ Sigma @ w_tangence))\nsharpe_opt = (mu_T - rf) / vol_T\n\nprint('Poids du portefeuille de Tangence :', np.round(w_tangence, 4))\nprint(f'Rendement espéré : {mu_T:.4f}, Volatilité : {vol_T:.4f}')\nprint(f'Ratio de Sharpe maximal : {sharpe_opt:.4f}')",
        testPythonCode: "assert 'w_tangence' in globals()\nassert 'sharpe_opt' in globals()\nassert np.isclose(w_tangence.sum(), 1.0)\nassert sharpe_opt > 0",
        hints: ["exces_mu = mu - rf * ones", "w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)", "sharpe_opt = (float(w_tangence @ mu) - rf) / float(np.sqrt(w_tangence @ Sigma @ w_tangence))"],
        datasets: []
      },
      {
        id: "v2-py-11",
        title: "11. Modèle d'Évaluation des Actifs Financiers (CAPM) : Bêta & Alpha",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Estimez le bêta de marché et l'alpha de Jensen par régression linéaire OLS.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : CAPM (Sharpe-Lintner) & Alpha de Jensen

#### Intuition Économique & Attribution de Performance
Comment distinguer un gérant de fonds qui génère réellement du talent (*alpha*) d'un gérant qui se contente de prendre du levier sur le marché actions (*bêta*) ? Le **CAPM** (*Capital Asset Pricing Model*) sépare le rendement excédentaire d'un actif ou d'un gérant en deux composantes orthogonales :
- La rémunération normale du **risque systématique** (non diversifiable) mesurée par $\\beta_i$.
- Le rendement anormal pur (surperformance ajustée du bêta) mesuré par l'**alpha de Jensen** $\\alpha_i$.

En ALM bancaire et assurantiel, le coût du capital des lignes d'affaires et l'évaluation de la prime de risque actions reposent directement sur l'estimation du $\\beta$ sectoriel.

#### Démonstration Mathématique Formelle
1. **De la tangence à l'équilibre du CAPM :**
   À l'équilibre de marché, tous les investisseurs détiennent le portefeuille de marché $\\mathbf{w}_M = \\mathbf{w}_T$. D'après la condition de tangence de l'exercice 10, $\\Sigma \\mathbf{w}_M = \\lambda_M (\\boldsymbol{\\mu} - r_f \\mathbf{1})$. Or la $i$-ème ligne de $\\Sigma \\mathbf{w}_M$ est $\\operatorname{Cov}(R_i, R_M)$, et en multipliant à gauche par $\\mathbf{w}_M'$ on obtient $\\sigma_M^2 = \\lambda_M (\\mathbb{E}[R_M] - r_f)$. En éliminant $\\lambda_M$ :
   $$\\mathbb{E}[R_i] - r_f = \\beta_i \\big(\\mathbb{E}[R_M] - r_f\\big), \\qquad \\beta_i = \\frac{\\operatorname{Cov}(R_i, R_M)}{\\operatorname{Var}(R_M)}$$

2. **Régression temporelle MCO & Décomposition du Risque :**
   Empiriquement, on estime le modèle linéaire par Moindres Carrés Ordinaires (OLS) :
   $$R_{i,t} - r_f = \\alpha_i + \\beta_i (R_{M,t} - r_f) + \\varepsilon_{i,t}, \\qquad \\mathbb{E}[\\varepsilon_{i,t} \\mid R_{M,t}] = 0$$
   Par orthogonalité MCO ($\\operatorname{Cov}(R_M, \\hat{\\varepsilon}_i) = 0$), la variance totale de l'actif se scinde en **risque systématique** + **risque spécifique (idiosyncratique)** :
   $$\\operatorname{Var}(R_i) = \\beta_i^2 \\sigma_M^2 + \\sigma_{\\varepsilon}^2, \\qquad R^2 = \\frac{\\beta_i^2 \\sigma_M^2}{\\operatorname{Var}(R_i)}$$
   et le **Ratio d'Information** du gérant s'écrit $IR = \\alpha_i / \\sigma_{\\varepsilon}$.

> ✏️ **Exemple chiffré & Résolution algébrique pas-à-pas (Toy Example sur 3 séances) :**
>
> Soit 3 séances d'excès de rendements pour le Marché $R_m$ et l'Actif $R_i$ :
> - Séance 1 : $R_{m,1} = +2\\%$, $R_{i,1} = +3\\%$
> - Séance 2 : $R_{m,2} = -1\\%$, $R_{i,2} = -1\\%$
> - Séance 3 : $R_{m,3} = +2\\%$, $R_{i,3} = +4\\%$
>
> 1. **Moyennes empiriques** : $\\bar{R}_m = \\frac{2 - 1 + 2}{3} = +1.0\\%$, $\\bar{R}_i = \\frac{3 - 1 + 4}{3} = +2.0\\%$.
> 2. **Variance de Marché ($T-1=2$)** : $\\operatorname{Var}(R_m) = \\frac{(2-1)^2 + (-1-1)^2 + (2-1)^2}{2} = \\frac{6}{2} = 3.0$.
> 3. **Covariance Marché-Actif** : $\\operatorname{Cov}(R_i, R_m) = \\frac{1\\cdot 1 + (-2)(-3) + 1\\cdot 2}{2} = \\frac{9}{2} = 4.5$.
> 4. **Bêta & Alpha de Jensen** :
>    $$\\beta_i = \\frac{4.5}{3.0} = \\mathbf{1.50}, \\qquad \\alpha_i = \\bar{R}_i - \\beta_i \\bar{R}_m = 2.0\\% - 1.50 \\times 1.0\\% = \\mathbf{+0.50\\%}$$

### 💻 Masterclass Python & Statsmodels Avancé

* **Piège critique \`sm.add_constant(R_m)\` :** Contrairement à \`scikit-learn\` qui ajoute une ordonnée à l'origine par défaut, \`statsmodels.api.OLS\` **n'inclut pas de constante** ! Sans \`sm.add_constant\`, la régression serait forcée de passer par $(0, 0)$ (sans alpha de Jensen) et fausserait le $R^2$ et le $\\hat{\\beta}$.
* **Attributs d'inférence du résultat \`fit()\` :** \`model.params\` contient \`[alpha, beta]\`, \`model.tvalues\` et \`model.pvalues\` testent la significativité statistique ($H_0: \\alpha = 0$ et $H_0: \\beta = 0$), et \`model.rsquared\` mesure la fraction systématique du risque.

\`\`\`python
import numpy as np
import statsmodels.api as sm

np.random.seed(42)
T = 120
R_m = np.random.randn(T) * 0.04 + 0.005
R_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02

# Ajout obligatoire de la colonne de 1 pour l'Alpha de Jensen
X = sm.add_constant(R_m)
model = sm.OLS(R_i, X).fit()

# Vérification algébrique directe : beta = Cov(R_i, R_m) / Var(R_m)
beta_cov = float(np.cov(R_i, R_m, ddof=1)[0, 1] / np.var(R_m, ddof=1))
alpha_cov = float(np.mean(R_i) - beta_cov * np.mean(R_m))

print(f"OLS params   : alpha={model.params[0]:.6f}, beta={model.params[1]:.6f}")
print(f"Cov/Var exact: alpha={alpha_cov:.6f}, beta={beta_cov:.6f}")
print(f"t-stats      : t(alpha)={model.tvalues[0]:.3f} (p={model.pvalues[0]:.3f}), t(beta)={model.tvalues[1]:.3f} (p={model.pvalues[1]:.2e})")
print(f"R2 = {model.rsquared:.4f} | Var(R_i)={np.var(R_i, ddof=1):.6f}, Beta^2*Var(Rm)+Var(eps)={model.params[1]**2*np.var(R_m, ddof=1) + np.var(model.resid, ddof=1):.6f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
OLS params   : alpha=0.003389, beta=1.303825
Cov/Var exact: alpha=0.003389, beta=1.303825
t-stats      : t(alpha)=1.832 (p=0.069), t(beta)=26.018 (p=1.05e-50)
R2 = 0.8516 | Var(R_i)=0.002735, Beta^2*Var(Rm)+Var(eps)=0.002735
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir des excès de rendements simulés \`R_m\` et \`R_i\` ($T=120$ périodes), estimez le modèle CAPM par MCO avec \`statsmodels.api\` :
1. Construisez la matrice de design avec constante \`X = sm.add_constant(R_m)\`.
2. Ajustez la régression \`model = sm.OLS(R_i, X).fit()\`.
3. Extrayez l'alpha estimé \`alpha_jensen = float(model.params[0])\`, le bêta \`beta_capm = float(model.params[1])\` et le coefficient de détermination \`r_squared = float(model.rsquared)\`.

Affichez ces trois indicateurs.`,
        initialCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(42)\nT = 120\nR_m = np.random.randn(T) * 0.04 + 0.005\nR_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02\n\n# Estimez le CAPM avec statsmodels OLS :\n",
        solutionCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(42)\nT = 120\nR_m = np.random.randn(T) * 0.04 + 0.005\nR_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02\n\nX = sm.add_constant(R_m)\nmodel = sm.OLS(R_i, X).fit()\n\nalpha_jensen = float(model.params[0])\nbeta_capm = float(model.params[1])\nr_squared = float(model.rsquared)\n\nprint(f'Alpha de Jensen : {alpha_jensen:.5f}')\nprint(f'Bêta du CAPM : {beta_capm:.4f}')\nprint(f'R-carré : {r_squared:.4f}')",
        testPythonCode: "assert 'alpha_jensen' in globals()\nassert 'beta_capm' in globals()\nassert 'r_squared' in globals()\nassert np.isclose(beta_capm, 1.25, atol=0.15)\nassert r_squared > 0.5",
        hints: ["X = sm.add_constant(R_m)", "model = sm.OLS(R_i, X).fit()", "alpha_jensen = float(model.params[0])", "beta_capm = float(model.params[1])"],
        datasets: []
      },
      {
        id: "v2-py-12",
        title: "12. Modèle Multi-Factoriel de Fama-French à 3 Facteurs",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Estimez les sensibilités factorielles à la prime de marché, prime de taille (SMB) et prime de valeur (HML).",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Modèle Multi-Factoriel de Fama & French (1993)

#### Intuition Économique & Anomalies du CAPM
Dès les années 1980, les études empiriques ont démontré que le bêta unique du CAPM échoue à expliquer pourquoi les **petites capitalisations** (*Small Caps*) et les actions **décotées** (*Value*, fort ratio valeur comptable / valeur de marché) surperforment durablement à bêta égal. Dans la lignée de l'*Arbitrage Pricing Theory* (APT) de Stephen Ross (1976), Eugene Fama et Kenneth French proposent d'ajouter au facteur marché deux portefeuilles autofinancés (*long-short zero-cost*) :
- **$SMB_t$ (*Small Minus Big*)** : facteur de taille (long petites capitalisations, short grandes capitalisations).
- **$HML_t$ (*High Minus Low*)** : facteur de style valeur (long actions *Value* à fort Book-to-Market, short actions *Growth*).

Une stratégie dite « alpha positif » sous CAPM révèle souvent en réalité un simple biais factoriel *Small-Value* gratuit une fois projetée sur Fama-French !

#### Démonstration Mathématique Formelle (Estimateur MCO Multivarié)
L'équation économétrique sur $T$ périodes s'écrit :
$$R_{i,t} - r_{f,t} = \\alpha_i + \\beta_i (R_{m,t} - r_{f,t}) + s_i \\, SMB_t + h_i \\, HML_t + \\varepsilon_{i,t}$$
En notation matricielle $\\mathbf{Y} = X \\boldsymbol{\\theta} + \\boldsymbol{\\varepsilon}$ avec $\\mathbf{Y} \\in \\mathbb{R}^T$, $X = [\\mathbf{1}, \\mathbf{MKT}, \\mathbf{SMB}, \\mathbf{HML}] \\in \\mathbb{R}^{T \\times 4}$ de plein rang colonne ($p = 4$), et $\\boldsymbol{\\theta} = [\\alpha_i, \\beta_i, s_i, h_i]'$ :

1. **Équations normales des Moindres Carrés :**
   Minimiser la somme des carrés des résidus $S(\\boldsymbol{\\theta}) = (\\mathbf{Y} - X\\boldsymbol{\\theta})'(\\mathbf{Y} - X\\boldsymbol{\\theta})$ annule le gradient :
   $$\\nabla_{\\boldsymbol{\\theta}} S(\\boldsymbol{\\theta}) = -2 X' (\\mathbf{Y} - X\\boldsymbol{\\theta}) = \\mathbf{0} \\implies \\hat{\\boldsymbol{\\theta}}_{\\text{MCO}} = (X' X)^{-1} X' \\mathbf{Y}$$

2. **Théorème de Gauss-Markov & Inférence :**
   Sous hypothèses sphériques $\\mathbb{E}[\\boldsymbol{\\varepsilon} \\mid X] = \\mathbf{0}$ et $\\operatorname{Var}(\\boldsymbol{\\varepsilon} \\mid X) = \\sigma^2 I_T$, $\\hat{\\boldsymbol{\\theta}}_{\\text{MCO}}$ est le meilleur estimateur linéaire sans biais (*BLUE*), de matrice de covariance :
   $$\\operatorname{Var}(\\hat{\\boldsymbol{\\theta}}_{\\text{MCO}} \\mid X) = \\sigma^2 (X' X)^{-1}, \\qquad \\hat{\\sigma}^2 = \\frac{\\hat{\\boldsymbol{\\varepsilon}}' \\hat{\\boldsymbol{\\varepsilon}}}{T - 4}$$
   Les statistiques de Student $t_j = \\frac{\\hat{\\theta}_j}{\\sqrt{\\hat{\\sigma}^2 [(X'X)^{-1}]_{jj}}}$ testent chaque exposition factorielle, et le $R^2$ ajusté $\\bar{R}^2 = 1 - \\frac{T-1}{T-p}(1 - R^2)$ pénalise l'ajout de facteurs non pertinents.

### 💻 Masterclass Python & NumPy Avancé

* **\`np.column_stack([...])\` :** Prend une liste de vecteurs 1D de taille \`(T,)\` et les empile proprement en colonnes pour obtenir une matrice 2D \`(T, 3)\`. C'est beaucoup plus lisible et moins sujet aux erreurs de dimensions que \`np.vstack([...]).T\` ou \`np.concatenate\`.
* **Ordre des paramètres :** \`sm.add_constant\` insère par défaut la constante en **colonne 0**. Donc \`model.params\` suit exactement l'ordre \`[alpha, beta_Mkt, s_SMB, h_HML]\`.

\`\`\`python
import numpy as np
import statsmodels.api as sm

np.random.seed(99)
T = 200
Mkt = np.random.randn(T) * 0.03
SMB = np.random.randn(T) * 0.015
HML = np.random.randn(T) * 0.015
Y = 0.001 + 0.95 * Mkt + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008

# Assemblage propre 1D -> 2D puis ajout constante -> shape (200, 4)
X = sm.add_constant(np.column_stack([Mkt, SMB, HML]))
model = sm.OLS(Y, X).fit()

# Vérification exacte par les équations normales (X'X)^-1 X'Y
beta_mco = np.linalg.inv(X.T @ X) @ X.T @ Y
model_capm = sm.OLS(Y, sm.add_constant(Mkt)).fit()

print("Design matrix shape :", X.shape)
print("OLS statsmodels     :", np.round(model.params, 5))
print("MCO (X'X)^-1 X'Y    :", np.round(beta_mco, 5))
print("p-values            :", [f"{p:.2e}" for p in model.pvalues])
print(f"R2 ajuste CAPM={model_capm.rsquared_adj:.4f} -> FF3={model.rsquared_adj:.4f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Design matrix shape : (200, 4)
OLS statsmodels     : [ 0.0023   0.95141  0.42716 -0.23368]
MCO (X'X)^-1 X'Y    : [ 0.0023   0.95141  0.42716 -0.23368]
p-values            : ['1.09e-04', '1.17e-111', '9.54e-22', '1.67e-08']
R2 ajuste CAPM=0.8697 -> FF3=0.9266
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

La matrice de design \`X_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\` et le vecteur cible \`Y_port\` ($T=200$) sont déjà préparés dans l'éditeur :
1. Ajustez la régression multiple avec \`model = sm.OLS(Y_port, X_factors).fit()\`.
2. Extrayez les 4 coefficients estimés dans \`coeffs = model.params\`.
3. Extrayez les 4 p-valeurs associées dans \`pvalues = model.pvalues\`.

Affichez \`coeffs\` et le $R^2$ du modèle multi-factoriel.`,
        initialCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(99)\nT = 200\nMkt_RF = np.random.randn(T) * 0.03\nSMB = np.random.randn(T) * 0.015\nHML = np.random.randn(T) * 0.015\nY_port = 0.001 + 0.95 * Mkt_RF + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008\n\nX_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\n\n# Ajustez le modèle OLS multi-factoriel :\n",
        solutionCode: "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(99)\nT = 200\nMkt_RF = np.random.randn(T) * 0.03\nSMB = np.random.randn(T) * 0.015\nHML = np.random.randn(T) * 0.015\nY_port = 0.001 + 0.95 * Mkt_RF + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008\n\nX_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\nmodel = sm.OLS(Y_port, X_factors).fit()\n\ncoeffs = model.params\npvalues = model.pvalues\n\nprint(f'Coefficients [Alpha, Mkt, SMB, HML] :\\n', np.round(coeffs, 4))\nprint(f'R2 du modèle multi-factoriel : {model.rsquared:.4f}')",
        testPythonCode: "assert 'coeffs' in globals()\nassert 'pvalues' in globals()\nassert len(coeffs) == 4\nassert np.isclose(coeffs[1], 0.95, atol=0.10)\nassert np.isclose(coeffs[2], 0.45, atol=0.10)",
        hints: ["model = sm.OLS(Y_port, X_factors).fit()", "coeffs = model.params", "pvalues = model.pvalues"],
        datasets: []
      },
      {
        id: "v2-py-13",
        title: "13. Modélisation de la Volatilité Conditionnelle : GARCH(1,1)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Simulez un processus GARCH(1,1) de Bollerslev pour reproduire le clustering de volatilité des marchés boursiers.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Hétéroscédasticité Conditionnelle GARCH(1,1)

#### Intuition Économique & Faits Stylisés
Contrairement à l'hypothèse de volatilité constante de Black-Scholes, les marchés réels exhibent un fort **regroupement de volatilité** (*volatility clustering*, Mandelbrot 1963) : les périodes de stress financier (2008, 2020) s'auto-entretiennent pendant des semaines avant de revenir progressivement vers un régime calme.

Le modèle **GARCH(1,1)** (*Generalized AutoRegressive Conditional Heteroskedasticity*, Tim Bollerslev 1986) est l'étalon-or des desks de Risk Management pour calculer des VaR dynamiques et des scénarios économiques générateurs (ESG) en assurance.

#### Démonstration Mathématique Formelle (Stationnarité & Prévision)
Soit une innovation de rendement $\\varepsilon_t = \\sigma_t Z_t$ avec $Z_t \\stackrel{\\text{i.i.d.}}{\\sim} \\mathcal{N}(0, 1)$ indépendant de l'information passée $\\mathcal{F}_{t-1}$. La variance conditionnelle $\\sigma_t^2 = \\operatorname{Var}(\\varepsilon_t \\mid \\mathcal{F}_{t-1})$ suit la récurrence :
$$\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2 \\qquad (\\omega > 0, \\; \\alpha \\ge 0, \\; \\beta \\ge 0)$$

1. **Condition de stationnarité en covariance ($\\alpha + \\beta < 1$) & Variance de Long Terme :**
   Par la loi des espérances itérées, $\\mathbb{E}[\\varepsilon_{t-1}^2] = \\mathbb{E}[\\mathbb{E}[\\sigma_{t-1}^2 Z_{t-1}^2 \\mid \\mathcal{F}_{t-2}]] = \\mathbb{E}[\\sigma_{t-1}^2]$. En prenant l'espérance inconditionnelle de l'équation GARCH :
   $$\\mathbb{E}[\\sigma_t^2] = \\omega + \\alpha \\mathbb{E}[\\varepsilon_{t-1}^2] + \\beta \\mathbb{E}[\\sigma_{t-1}^2] = \\omega + (\\alpha + \\beta) \\mathbb{E}[\\sigma_{t-1}^2]$$
   Pour que le processus soit faiblement stationnaire ($\\mathbb{E}[\\sigma_t^2] = \\mathbb{E}[\\sigma_{t-1}^2] = \\sigma_L^2 < \\infty$), il faut et il suffit que **$\\alpha + \\beta < 1$**, ce qui donne la variance inconditionnelle :
   $$\\sigma_L^2 = \\frac{\\omega}{1 - (\\alpha + \\beta)}$$

2. **Dynamique de retour à la moyenne & Demi-vie d'un choc :**
   Réécrivons $\\sigma_t^2 - \\sigma_L^2 = (\\alpha + \\beta)(\\sigma_{t-1}^2 - \\sigma_L^2) + \\alpha(\\varepsilon_{t-1}^2 - \\sigma_{t-1}^2)$. Comme $\\mathbb{E}_{t-1}[\\varepsilon_{t-1}^2 - \\sigma_{t-1}^2]$ est nul en moyenne à l'horizon $h \\ge 1$, la prévision de variance suit une décroissance géométrique à taux de persistance $\\alpha + \\beta$ :
   $$\\mathbb{E}_t[\\sigma_{t+h}^2] = \\sigma_L^2 + (\\alpha + \\beta)^{h-1} (\\sigma_{t+1}^2 - \\sigma_L^2), \\qquad h_{1/2} = \\frac{\\ln(0.5)}{\\ln(\\alpha + \\beta)}$$

3. **Génération endogène de queues épaisses :**
   Même avec des chocs $Z_t$ purement gaussiens ($\\mathbb{E}[Z_t^4] = 3$), dès que $\\alpha > 0$ la variance $\\sigma_t^2$ est aléatoire, et par l'inégalité stricte de Jensen ($\\mathbb{E}[(\\sigma_t^2)^2] > (\\mathbb{E}[\\sigma_t^2])^2$) :
   $$\\operatorname{Kurt}(\\varepsilon_t) = \\frac{\\mathbb{E}[\\sigma_t^4] \\cdot \\mathbb{E}[Z_t^4]}{(\\mathbb{E}[\\sigma_t^2])^2} = 3 \\frac{\\mathbb{E}[\\sigma_t^4]}{(\\mathbb{E}[\\sigma_t^2])^2} > 3$$

### 💻 Masterclass Python & NumPy Avancé

* **Pré-allocation \`np.zeros(T)\` :** La récurrence $\\sigma_t^2 = f(\\sigma_{t-1}^2, \\varepsilon_{t-1}^2)$ est **séquentielle** : impossible de la vectoriser directement sans boucle \`for\`. En revanche, il faut **toujours pré-allouer** des tableaux contigus \`sigma2 = np.zeros(T)\` et \`eps = np.zeros(T)\` avant la boucle plutôt que d'utiliser \`.append()\` sur une liste Python qui réalloue dynamiquement la mémoire.
* **Tirage vectorisé des innovations :** Générez tous les chocs $Z$ en une seule passe \`Z = np.random.randn(T)\` hors de la boucle !

\`\`\`python
import numpy as np

np.random.seed(42)
T = 2000
omega, alpha, beta = 1e-5, 0.08, 0.90

# Variance stationnaire à long terme et demi-vie d'un choc de volatilité
var_lt = omega / (1.0 - (alpha + beta))
half_life = float(np.log(0.5) / np.log(alpha + beta))

# Pré-allocation mémoire et tirage vectorisé des innovations N(0, 1)
Z = np.random.randn(T)
sigma2 = np.zeros(T)
eps = np.zeros(T)

sigma2[0] = var_lt
eps[0] = np.sqrt(sigma2[0]) * Z[0]

for t in range(1, T):
    sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]
    eps[t] = np.sqrt(sigma2[t]) * Z[t]

z_eps = (eps - eps.mean()) / eps.std(ddof=1)
kurt_garch = float(np.mean(z_eps**4))

print(f"Persistance alpha+beta = {alpha+beta:.2f} | Demi-vie choc = {half_life:.1f} jours")
print(f"Vol LT theorique annualisee : {np.sqrt(var_lt * 252):.2%}")
print(f"Vol empirique annualisee    : {np.std(eps, ddof=1) * np.sqrt(252):.2%}")
print(f"Kurtosis inconditionnel des rendements GARCH : {kurt_garch:.2f}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Persistance alpha+beta = 0.98 | Demi-vie choc = 34.3 jours
Vol LT theorique annualisee : 35.50%
Vol empirique annualisee    : 32.06%
Kurtosis inconditionnel des rendements GARCH : 3.40
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

Avec les paramètres $\\omega = 10^{-5}$, $\\alpha = 0.08$ et $\\beta = 0.90$ sur $T = 500$ périodes :
1. Calculez la variance inconditionnelle de long terme \`var_long_terme = float(omega / (1.0 - (alpha + beta)))\`.
2. Pré-allouez \`sigma2 = np.zeros(T)\` et \`eps = np.zeros(T)\`, initialisez \`sigma2[0] = var_long_terme\` et \`eps[0] = np.sqrt(sigma2[0]) * Z[0]\` avec \`Z = np.random.randn(T)\`.
3. Simulez récursivement \`sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]\` et \`eps[t] = np.sqrt(sigma2[t]) * Z[t]\` pour $t = 1, \\dots, T-1$.

Affichez \`var_long_terme\` et la volatilité annualisée moyenne.`,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nT = 500\nomega = 1e-5\nalpha = 0.08\nbeta = 0.90\n\n# Simulez la variance conditionnelle sigma2 du GARCH(1,1) :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nT = 500\nomega = 1e-5\nalpha = 0.08\nbeta = 0.90\n\nvar_long_terme = float(omega / (1.0 - (alpha + beta)))\nZ = np.random.randn(T)\nsigma2 = np.zeros(T)\neps = np.zeros(T)\n\nsigma2[0] = var_long_terme\neps[0] = np.sqrt(sigma2[0]) * Z[0]\n\nfor t in range(1, T):\n    sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]\n    eps[t] = np.sqrt(sigma2[t]) * Z[t]\n\nprint(f'Variance à long terme : {var_long_terme:.6f}')\nprint(f'Volatilité annualisée moyenne : {np.mean(np.sqrt(sigma2)) * np.sqrt(252):.2%}')",
        testPythonCode: "assert 'var_long_terme' in globals()\nassert 'sigma2' in globals()\nassert len(sigma2) == 500\nassert np.all(sigma2 > 0)\nassert np.isclose(var_long_terme, 0.0005, atol=1e-5)",
        hints: ["var_long_terme = float(omega / (1.0 - (alpha + beta)))", "sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]"],
        datasets: []
      },
      {
        id: "v2-py-14",
        title: "14. Value-at-Risk (VaR 99%) & Expected Shortfall (CVaR)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Estimez les métriques de risque de marché réglementaires (Bâle III) : VaR et CVaR paramétriques vs historiques.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Axiomes d'Artzner, VaR non Sous-Additive & CVaR Cohérente

#### Intuition Économique & Cadre Réglementaire (Bâle III / Solvabilité II)
En risque de marché bancaire et en gestion actif-passif, deux questions gouvernent les fonds propres réglementaires :
- **Value-at-Risk ($\\operatorname{VaR}_{\\alpha}$)** : *« Quelle est la perte maximale qui ne sera dépassée que dans $(1-\\alpha)$ des cas ? »* (base du SCR à $99.5\\%$ sous **Solvabilité II**).
- **Expected Shortfall ($\\operatorname{CVaR}_{\\alpha}$ ou ES)** : *« Si la barrière de la VaR est franchie, quelle est la perte moyenne dans la queue extrême ? »* (norme obligatoire sous **Bâle III / FRTB** au seuil $97.5\\%$).

#### Démonstration Mathématique Formelle (Axiomes d'Artzner et al., 1999)
Artzner, Delbaen, Eber et Heath (1999) définissent une **mesure de risque cohérente** $\\rho$ sur les pertes $L = -R$ par 4 axiomes :
1. **Monotonicité :** $L_1 \\le L_2 \\implies \\rho(L_1) \\le \\rho(L_2)$
2. **Invariance par translation :** $\\rho(L + c) = \\rho(L) + c$ (ajouter $c$ de perte certaine ou de réserve cash décale le risque de $c$)
3. **Homogénéité positive :** $\\rho(\\lambda L) = \\lambda \\rho(L)$ pour tout $\\lambda \\ge 0$
4. **Sous-additivité :** $\\rho(L_1 + L_2) \\le \\rho(L_1) + \\rho(L_2)$ (*la diversification ne doit jamais augmenter le capital réglementaire !*)

**Contre-exemple prouvant que la VaR N'EST PAS sous-additive :**
Considérons 2 obligations zéro-coupon indépendantes dont la perte vaut $L_i = 100$ en cas de défaut (probabilité $p = 0.8\\%$) et $0$ sinon, au niveau de confiance $\\alpha = 99\\%$ :
- Individuellement, $\\mathbb{P}(L_i = 0) = 99.2\\% > 99\\%$, donc $\\operatorname{VaR}_{99\\%}(L_1) = \\operatorname{VaR}_{99\\%}(L_2) = 0$.
- Pour le portefeuille diversifié $L_1 + L_2$, la probabilité d'au moins un défaut vaut :
  $$\\mathbb{P}(L_1 + L_2 \\ge 100) = 1 - (1 - 0.008)^2 = 1.5936\\% > 1\\% \\implies \\operatorname{VaR}_{99\\%}(L_1 + L_2) = 100 > 0 + 0$$

**Cohérence de la CVaR (Représentation d'Acerbi-Tasche) :**
Définie comme la moyenne des quantiles au-delà de $\\alpha$ :
$$\\operatorname{CVaR}_{\\alpha}(L) = \\frac{1}{1 - \\alpha} \\int_{\\alpha}^1 \\operatorname{VaR}_u(L) \\, du = \\mathbb{E}[L \\mid L \\ge \\operatorname{VaR}_{\\alpha}(L)] \\quad (\\text{loi continue})$$
la CVaR satisfait les 4 axiomes (notamment la sous-additivité par convexité de Rockafellar-Uryasev). Sous loi gaussienne $L \\sim \\mathcal{N}(\\mu_L, \\sigma_L^2)$, elle admet la forme fermée $\\operatorname{CVaR}_{\\alpha}^{\\mathcal{N}} = \\mu_L + \\sigma_L \\frac{\\varphi(\\Phi^{-1}(\\alpha))}{1 - \\alpha}$.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Échantillon ordonné de 10 pertes) :**
>
> Considérons 10 scénarios de pertes journalières classées par ordre croissant :
> $$L = [-1.5\\%, -0.8\\%, -0.2\\%, +0.1\\%, +0.4\\%, +0.9\\%, +1.2\\%, +1.8\\%, +2.5\\%, +4.0\\%]$$
> Pour un seuil de confiance de $90\\%$ (dernier décile) :
> 1. **Rang du quantile 90 %** : $10 \\times 0.90 = 9^{\\text{ème}}$ valeur $\\implies$ $\\operatorname{VaR}_{90\\%} = \\mathbf{+2.5\\%}$.
> 2. **Expected Shortfall (CVaR)** : moyenne des pertes extrêmes ($+2.5\\%$ et $+4.0\\%$) :
>    $$\\operatorname{CVaR}_{90\\%} = \\frac{2.5\\% + 4.0\\%}{2} = \\mathbf{+3.25\\%}$$

### 💻 Masterclass Python & NumPy Avancé

* **Convention de signe \`pertes = -rendements\` :** En risk management, on travaille sur la distribution des **pertes** positives ($L = -R$) pour lire le risque dans la queue droite à $99\\%$ (\`np.percentile(pertes, 99)\`), plutôt qu'à $1\\%$ sur les rendements négatifs.
* **Filtrage booléen \`pertes[pertes >= var]\` :** Crée en une seule instruction vectorisée le sous-vecteur contenant uniquement les sinistres de queue, dont \`.mean()\` retourne immédiatement l'espérance conditionnelle $\\mathbb{E}[L \\mid L \\ge \\operatorname{VaR}]$.

\`\`\`python
import numpy as np

# Partie A : Vérification Monte Carlo de la non-sous-additivité de la VaR 99%
np.random.seed(123)
M = 100000
L1 = np.where(np.random.rand(M) < 0.008, 100.0, 0.0)   # défaut 0.8% -> perte 100
L2 = np.where(np.random.rand(M) < 0.008, 100.0, 0.0)
L_sum = L1 + L2

var1, var2, var_sum = float(np.percentile(L1, 99)), float(np.percentile(L2, 99)), float(np.percentile(L_sum, 99))
k_tail = int(0.01 * M)                                  # 1% pires scénarios pour l'ES exacte
es1 = float(np.sort(L1)[-k_tail:].mean())
es2 = float(np.sort(L2)[-k_tail:].mean())
es_sum = float(np.sort(L_sum)[-k_tail:].mean())

print(f"[Sous-additivite] VaR99(L1)+VaR99(L2) = {var1 + var2:.1f} vs VaR99(L1+L2) = {var_sum:.1f} (NON sous-additive !)")
print(f"[Coherence ES]    ES99(L1)+ES99(L2)   = {es1 + es2:.2f} >= ES99(L1+L2) = {es_sum:.2f} (sous-additive !)")

# Partie B : Comparaison VaR/CVaR historiques vs Gaussienne sur loi de Student df=4
np.random.seed(42)
r = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005
pertes = -r
var_h = float(np.percentile(pertes, 99))
cvar_h = float(pertes[pertes >= var_h].mean())
var_g = float(pertes.mean() + 2.326347874 * pertes.std(ddof=1))
print(f"[Student df=4] VaR 99% hist = {var_h:.4%} | CVaR 99% hist = {cvar_h:.4%} | VaR 99% gauss = {var_g:.4%}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
[Sous-additivite] VaR99(L1)+VaR99(L2) = 0.0 vs VaR99(L1+L2) = 100.0 (NON sous-additive !)
[Coherence ES]    ES99(L1)+ES99(L2)   = 157.20 >= ES99(L1+L2) = 100.30 (sous-additive !)
[Student df=4] VaR 99% hist = 5.2800% | CVaR 99% hist = 7.3080% | VaR 99% gauss = 4.6641%
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la série simulée \`rendements\` (1 000 tirages à queues épaisses selon une loi de Student $\\nu = 4$) :
1. Passez en convention de pertes : \`pertes = -rendements\`.
2. Calculez la VaR historique 99 % : \`var_hist_99 = float(np.percentile(pertes, 99))\`.
3. Calculez l'Expected Shortfall historique 99 % par masquage booléen : \`cvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())\`.

Affichez \`var_hist_99\` et \`cvar_hist_99\` en pourcentage.`,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\n# 1000 observations de rendements journaliers avec queues épaisses (loi de Student)\nrendements = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005\n\n# Calculez var_hist_99 et cvar_hist_99 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nrendements = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005\n\npertes = -rendements\nvar_hist_99 = float(np.percentile(pertes, 99))\ncvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())\n\nprint(f'VaR historique 99% : {var_hist_99:.4%}')\nprint(f'Expected Shortfall (CVaR) 99% : {cvar_hist_99:.4%}')",
        testPythonCode: "assert 'var_hist_99' in globals()\nassert 'cvar_hist_99' in globals()\nassert cvar_hist_99 >= var_hist_99\nassert var_hist_99 > 0",
        hints: ["pertes = -rendements", "var_hist_99 = float(np.percentile(pertes, 99))", "cvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())"],
        datasets: []
      },
      {
        id: "v2-py-15",
        title: "15. Test de Jarque-Bera & Diagnostics des Queues Épaisses (Fat Tails)",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Testez la normalité des rendements financiers en calculant le Skewness, le Kurtosis et la statistique de Jarque-Bera.",
        theoryMarkdown: `
### 🎓 Cours Théorique Approfondi : Moments Supérieurs & Test de Jarque-Bera (1980)

#### Intuition Économique & Danger de l'Hypothèse Gaussienne
Sous l'hypothèse normale de Black-Scholes ou du CAPM standard, un krach à $-5\\sigma$ a une probabilité inférieure à $3 \\times 10^{-7}$ (soit environ une fois tous les $13\\,000$ ans sur des données journalières) ! En réalité, les rendements boursiers et de crédit affichent systématiquement une **asymétrie négative** (les baisses sont plus brutales que les hausses) et des **queues épaisses** (*Fat Tails*, loi de Student, processus à sauts) responsables de pertes extrêmes bien plus fréquentes.

Le test de **Jarque-Bera** quantifie conjointement ces deux déviations par rapport à la loi normale afin d'alerter le quant qu'une VaR paramétrique gaussienne sous-estimera gravement le risque extrême.

#### Démonstration Mathématique Formelle
Soit une série stationnaire centrée-réduite $z_t = \\frac{r_t - \\bar{r}}{s}$ de taille $T$. On définit :
- Le **coefficient d'asymétrie (Skewness)** : $S = \\frac{1}{T} \\sum_{t=1}^T z_t^3$
- Le **coefficient d'aplatissement (Kurtosis)** : $K = \\frac{1}{T} \\sum_{t=1}^T z_t^4$

1. **Moments théoriques sous $H_0 : r_t \\stackrel{\\text{i.i.d.}}{\\sim} \\mathcal{N}(\\mu, \\sigma^2)$ :**
   Pour $Z \\sim \\mathcal{N}(0, 1)$ de densité $\\varphi(z)$ vérifiant $\\varphi'(z) = -z\\varphi(z)$, par symétrie $S_0 = \\mathbb{E}[Z^3] = 0$, et une intégration par parties donne exactement le kurtosis gaussien :
   $$K_0 = \\mathbb{E}[Z^4] = \\int_{-\\infty}^{+\\infty} z^3 \\cdot \\big(z\\varphi(z)\\big)\\,dz = \\Big[-z^3 \\varphi(z)\\Big]_{-\\infty}^{+\\infty} + 3 \\int_{-\\infty}^{+\\infty} z^2 \\varphi(z)\\,dz = 3\\mathbb{E}[Z^2] = 3$$
   Dès que $K > 3$ (*Excess Kurtosis* $K - 3 > 0$), la distribution est **leptokurtique**.

2. **Loi asymptotique du test de Jarque-Bera :**
   Sous $H_0$, le théorème central limite appliqué aux moments d'ordre 3 et 4 (issus du développement de Gram-Charlier) montre que :
   $$\\sqrt{T}\\, S \\xrightarrow{\\mathcal{L}} \\mathcal{N}(0, 6), \\qquad \\sqrt{T}\\, (K - 3) \\xrightarrow{\\mathcal{L}} \\mathcal{N}(0, 24)$$
   Par parité, $\\operatorname{Cov}(Z^3, Z^4) = \\mathbb{E}[Z^7] = 0$, donc $S$ et $K$ sont **asymptotiquement indépendants**. La somme des carrés des deux statistiques normalisées converge donc vers une loi du $\\chi^2$ à 2 degrés de liberté :
   $$JB = \\left(\\frac{\\sqrt{T}\\,S}{\\sqrt{6}}\\right)^2 + \\left(\\frac{\\sqrt{T}\\,(K - 3)}{\\sqrt{24}}\\right)^2 = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\xrightarrow{\\mathcal{L}} \\chi^2(2)$$
   Comme $\\chi^2(2) \\equiv \\operatorname{Exp}(1/2)$, la p-valeur asymptotique vaut exactement $p = e^{-JB / 2}$ et le seuil de rejet à $5\\%$ vaut $-2\\ln(0.05) \\approx \\mathbf{5.991}$.

![Distribution Leptokurtique et Queues Épaisses](/images/theory/fig_fat_tails_jarque_bera.png)

> 🔍 **Comprendre ce graphique : Le leurre de l'hypothèse gaussienne en finance**
>
> - **Courbe grise en pointillés** : Loi normale théorique $\\mathcal{N}(0, 1)$ postulée par les modèles traditionnels (Black-Scholes, CAPM standard).
> - **Courbe rouge (Loi empirique / Student-t)** : Densité réelle des rendements d'actifs financiers.
> - **Pic central acéré** : Davantage d'observations très concentrées autour de zéro que sous la loi normale.
> - **Zone hachurée rouge (Queues Épaisses)** : Au-delà de $-3\\sigma$, la probabilité d'un effondrement violent est considérablement sous-estimée par la gaussienne (par un facteur de 10 à 100). C'est ce risque extrême qui fait exploser le Kurtosis ($K > 3$).

### 💻 Masterclass Python & NumPy Avancé

* **Piège \`ddof=1\` vs \`ddof=0\` :** \`np.std(r)\` divise par $T$ par défaut (\`ddof=0\`). Pour utiliser l'écart-type empirique sans biais ($T-1$), spécifiez explicitement \`np.std(r, ddof=1)\`.
* **P-valeur exacte sans SciPy :** Puisque la loi $\\chi^2(2)$ coïncide avec une exponentielle de paramètre $1/2$, \`float(np.exp(-jb_stat / 2.0))\` calcule la p-valeur analytique exacte en pur NumPy !

\`\`\`python
import numpy as np

def jarque_bera_np(x):
    n = len(x)
    # Standardisation avec correction de Bessel (ddof=1)
    z = (x - np.mean(x)) / np.std(x, ddof=1)
    s = float(np.mean(z**3))
    k = float(np.mean(z**4))
    jb = float(n / 6.0 * (s**2 + ((k - 3.0)**2) / 4.0))
    pval = float(np.exp(-jb / 2.0))                  # exact pour chi2(2)
    return s, k, jb, pval

np.random.seed(7)
r_norm = np.random.randn(500) * 0.012               # référence gaussienne
r_stud = np.random.standard_t(df=5, size=500) * 0.012
r_cac = df["cac40_rendement"].to_numpy()            # série réelle de QuantEcon Lab (T=16)

for label, serie in [("Gaussienne N(0,1)", r_norm), ("Student df=5 (T=500)", r_stud), ("CAC 40 trimestriel (df)", r_cac)]:
    s, k, jb, pval = jarque_bera_np(serie)
    print(f"{label:25s} | S={s:+.4f} | K={k:.4f} | JB={jb:6.2f} | p={pval:.4f} | Rejet 5%={jb > 5.991}")
\`\`\`

### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Gaussienne N(0,1)         | S=-0.0918 | K=2.9652 | JB=  0.73 | p=0.6948 | Rejet 5%=False
Student df=5 (T=500)      | S=-0.0647 | K=6.9239 | JB=321.12 | p=0.0000 | Rejet 5%=True
CAC 40 trimestriel (df)   | S=-0.9007 | K=3.2668 | JB=  2.21 | p=0.3311 | Rejet 5%=False
\`\`\`
        `,
        taskMarkdown: `**🎯 Laboratoire Pratique :**

À partir de la série simulée \`r\` ($T=500$ observations d'une loi de Student $\\nu = 5$) :
1. Calculez la moyenne \`m = np.mean(r)\`, l'écart-type corrigé \`s = np.std(r, ddof=1)\` et la série centrée-réduite \`z = (r - m) / s\`.
2. Calculez le Skewness \`skewness = float(np.mean(z**3))\` et le Kurtosis \`kurtosis = float(np.mean(z**4))\`.
3. Calculez la statistique de test \`jb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))\`.

Affichez \`skewness\`, \`kurtosis\`, \`jb_stat\` et indiquez si la normalité est rejetée au seuil $5\\%$ ($JB > 5.99$).`,
        initialCode: "import numpy as np\n\nnp.random.seed(7)\n# Rendements financiers simulés avec sauts (loi de Student df=5)\nr = np.random.standard_t(df=5, size=500) * 0.012\n\n# Calculez skewness, kurtosis et jb_stat :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(7)\nr = np.random.standard_t(df=5, size=500) * 0.012\n\nm = np.mean(r)\ns = np.std(r, ddof=1)\nz = (r - m) / s\n\nskewness = float(np.mean(z**3))\nkurtosis = float(np.mean(z**4))\njb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))\n\nprint(f'Skewness (Asymétrie) : {skewness:.4f}')\nprint(f'Kurtosis (Aplatissement) : {kurtosis:.4f}')\nprint(f'Statistique de Jarque-Bera : {jb_stat:.2f}')\nprint('Rejet de la normalité gaussienne :', jb_stat > 5.99)",
        testPythonCode: "assert 'skewness' in globals()\nassert 'kurtosis' in globals()\nassert 'jb_stat' in globals()\nassert kurtosis > 3.0\nassert jb_stat > 0",
        hints: ["z = (r - np.mean(r)) / np.std(r, ddof=1)", "skewness = float(np.mean(z**3))", "kurtosis = float(np.mean(z**4))", "jb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))"],
        datasets: []
      },
    ]
  };
