import { CourseModule } from "@/types/course";

export const V2_MONTE_CARLO_MODULE: CourseModule = {
    id: "python-monte-carlo",
    title: "Simulations de Monte Carlo & Modélisation Stochastique",
    subtitle: "Processus d'Itô, Pricing Dérivés, Réduction de Variance & Modèles de Taux",
    icon: "Cpu",
    description: "Devenez expert en simulation stochastique : algorithme de Box-Muller, factorisation de Cholesky, mouvement brownien géométrique, pricing Black-Scholes vs Monte Carlo, variables antithétiques, options exotiques et processus de Vasicek.",
    exercises: [
      {
        id: "v2-py-16",
        title: "1. Génération Pseudo-Aléatoire & Algorithme de Box-Muller",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Générez des variables gaussiennes standards à partir de lois uniformes par la méthode géométrique de Box-Muller.",
        theoryMarkdown: `
### De l'Aléatoire Uniforme à la Loi Normale : Box-Muller & Méthode Polaire

#### 🎓 Cours Théorique Approfondi

En finance quantitative (pricing d'options, VaR Monte Carlo) comme en actuariat ALM (Générateurs de Scénarios Économiques sous Solvabilité II), les chocs de marché suivent des lois gaussiennes ou log-normales. Or, un ordinateur ne sait générer nativement que des entiers pseudo-aléatoires convertis en loi uniforme continue $\\mathcal{U}(0, 1)$ (via Mersenne Twister MT19937 ou PCG64). La fonction de répartition normale $\\Phi(x) = \\int_{-\\infty}^x \\frac{1}{\\sqrt{2\\pi}} e^{-u^2/2} du$ n'admettant pas de primitive élémentaire, l'inversion directe $\\Phi^{-1}(U)$ requiert des approximations polynomiales coûteuses.

> 💡 **Démonstration formelle : Jacobien de Box-Muller (1958) & Méthode Polaire**
> 
> Soient $Z_1, Z_2 \\stackrel{\\text{i.i.d.}}{\\sim} \\mathcal{N}(0, 1)$. Leur densité conjointe sur $\\mathbb{R}^2$ est à symétrie radiale :
> 
> $$f_{Z_1, Z_2}(z_1, z_2) = \\frac{1}{2\\pi} \\exp\\left(-\\frac{z_1^2 + z_2^2}{2}\\right)$$
> 
> Passons en coordonnées polaires $(r, \\theta) \\in ]0, +\\infty[ \\times [0, 2\\pi[$ via $z_1 = r \\cos\\theta$ et $z_2 = r \\sin\\theta$. Le déterminant jacobien de la transformation vaut :
> 
> $$J(r, \\theta) = \\det \\begin{pmatrix} \\frac{\\partial z_1}{\\partial r} & \\frac{\\partial z_1}{\\partial \\theta} \\\\ \\frac{\\partial z_2}{\\partial r} & \\frac{\\partial z_2}{\\partial \\theta} \\end{pmatrix} = \\det \\begin{pmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{pmatrix} = r(\\cos^2\\theta + \\sin^2\\theta) = r$$
> 
> La densité conjointe du couple $(R, \\Theta)$ devient donc factorisable :
> 
> $$f_{R, \\Theta}(r, \\theta) = \\frac{1}{2\\pi} r e^{-r^2/2} = \\underbrace{\\frac{1}{2\\pi}}_{\\Theta \\sim \\mathcal{U}([0, 2\\pi[)} \\times \\underbrace{r e^{-r^2/2}}_{R^2 \\sim \\text{Exp}(1/2)}$$
> 
> En posant $S = R^2$, sa fonction de répartition est $F_S(s) = 1 - e^{-s/2}$. Par méthode d'inversion avec $U_1, U_2 \\stackrel{\\text{i.i.d.}}{\\sim} \\mathcal{U}(]0, 1[)$ (et comme $1 - U_1 \\sim \\mathcal{U}(]0, 1[)$), on obtient $R^2 = -2\\ln(U_1)$ et $\\Theta = 2\\pi U_2$ :
> 
> $$Z_1 = \\sqrt{-2 \\ln(U_1)} \\cos(2\\pi U_2), \\qquad Z_2 = \\sqrt{-2 \\ln(U_1)} \\sin(2\\pi U_2)$$
> 
> **Variante Méthode Polaire de Marsaglia-Bray (1964) :** Pour éviter les appels trigonométriques $\\cos$ et $\\sin$, on tire $V_1, V_2 \\sim \\mathcal{U}(-1, 1)$ et on ne retient que les points situés dans le disque unité ouvert $W = V_1^2 + V_2^2 \\in ]0, 1[$ (taux d'acceptation égal au rapport des aires $\\pi / 4 \\approx 78.54\\%$). On pose alors $\\cos\\Theta = V_1 / \\sqrt{W}$, $\\sin\\Theta = V_2 / \\sqrt{W}$ et $W$ joue le rôle de $U_1$ :
> 
> $$Z_1 = V_1 \\sqrt{\\frac{-2 \\ln W}{W}}, \\qquad Z_2 = V_2 \\sqrt{\\frac{-2 \\ln W}{W}}$$

> ✏️ **Vigilance Risk Management / Audit de Modèles :**
> 
> Numériquement, si $U_1 = 0$, alors $\\ln(0) = -\\infty$ provoque un plantage ou un \`NaN\` dans la propagation de scénarios extrêmes : d'où la troncature stricte de la borne inférieure à \`1e-10\`. En pratique industrielle, l'audit ACPR/BCE vérifie la **reproductibilité** via une graine fixe et l'absence de corrélation parasite entre les tirages ($\\operatorname{Corr}(Z_1, Z_2) = 0$) ainsi que le **kurtosis** proche de $3$ (queues gaussiennes fidèles).

#### 💻 Masterclass Python Quantitatif

Points d'ingénierie NumPy essentiels pour la génération pseudo-aléatoire :
- **Reproductibilité (\`np.random.seed\`)** : figer la graine (\`seed(42)\` ou \`seed(123)\`) verrouille l'état interne du générateur Mersenne Twister, indispensable pour rejouer à l'identique un stress-test ou un calcul de capital réglementaire. *(En Python moderne hors code legacy, \`rng = np.random.default_rng(42)\` utilise l'algorithme PCG64, plus rapide et statistiquement supérieur).*
- **Vectorisation pure** : \`np.random.uniform(low, high, N)\` alloue un bloc mémoire contigu C en \`float64\` ; les ufuncs \`np.log\`, \`np.sqrt\`, \`np.cos\`, \`np.sin\` s'exécutent ensuite en langage machine compilé sur tout le vecteur sans boucle \`for\`.
- **Filtrage par masque booléen (Méthode Polaire)** : \`masque = (W > 0.0) & (W < 1.0)\` extrait en une seule passe les tirages acceptés dans le disque unité.
- **Moments empiriques** : \`np.var(Z, ddof=1)\` applique la correction de Bessel ($N - 1$), alors que \`np.var(Z)\` utilise par défaut \`ddof=0\` (biais négligeable pour $N = 10\\,000$).

\`\`\`python
import numpy as np

# 1. Verrouillage de la graine pour garantir la reproductibilité exacte des scénarios
np.random.seed(123)
N = 10000

# 2. Tirages uniformes sur ]0, 1] : borne basse 1e-10 pour éviter log(0) = -inf
U1 = np.random.uniform(1e-10, 1.0, N)
U2 = np.random.uniform(0.0, 1.0, N)

# 3. Transformation polaire exacte de Box-Muller (rayon R et angle 2*pi*U2)
R = np.sqrt(-2.0 * np.log(U1))
Z1 = R * np.cos(2.0 * np.pi * U2)
Z2 = R * np.sin(2.0 * np.pi * U2)

# 4. Variante Marsaglia-Bray par rejet dans le disque unité (sans cos/sin)
V1 = np.random.uniform(-1.0, 1.0, N)
V2 = np.random.uniform(-1.0, 1.0, N)
W = V1**2 + V2**2
masque = (W > 0.0) & (W < 1.0)
W_acc = W[masque]
Z_pol = V1[masque] * np.sqrt(-2.0 * np.log(W_acc) / W_acc)

# 5. Contrôle qualité : moments d'ordre 1, 2, 4 et orthogonalité entre Z1 et Z2
print(f"Box-Muller Z1 -> Moy: {np.mean(Z1):+.4f} | Var: {np.var(Z1, ddof=1):.4f} | Kurt: {np.mean(((Z1-np.mean(Z1))/np.std(Z1))**4):.4f}")
print(f"Box-Muller Z2 -> Moy: {np.mean(Z2):+.4f} | Var: {np.var(Z2, ddof=1):.4f} | Corr(Z1,Z2): {np.corrcoef(Z1, Z2)[0,1]:+.4f}")
print(f"Marsaglia     -> Taux acceptation: {np.mean(masque):.2%} (pi/4 = {np.pi/4:.2%}) | Var(Z_pol): {np.var(Z_pol, ddof=1):.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Box-Muller Z1 -> Moy: -0.0001 | Var: 1.0175 | Kurt: 2.9714
Box-Muller Z2 -> Moy: +0.0064 | Var: 0.9968 | Corr(Z1,Z2): -0.0040
Marsaglia     -> Taux acceptation: 79.14% (pi/4 = 78.54%) | Var(Z_pol): 1.0248
\`\`\`
        `,
        taskMarkdown: `
Dans ce laboratoire, implémentez le générateur de Box-Muller vectorisé à partir de $N = 10\\,000$ tirages uniformes \`U1\` (dans $[10^{-10}, 1]$) et \`U2\` (dans $[0, 1]$) déjà initialisés avec \`np.random.seed(42)\` :

1. Calculez le rayon radial \`R = np.sqrt(-2.0 * np.log(U1))\` correspondant à $\\sqrt{-2\\ln(U_1)}$.
2. Générez la première variable gaussienne standard \`Z1 = R * np.cos(2.0 * np.pi * U2)\`.
3. Calculez les estimateurs empiriques scalaires \`moyenne_z1 = float(np.mean(Z1))\` et \`variance_z1 = float(np.var(Z1))\` (vérifiez la proximité avec $0$ et $1$).
4. Affichez les statistiques calculées.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nU1 = np.random.uniform(1e-10, 1.0, N)\nU2 = np.random.uniform(0.0, 1.0, N)\n\n# Implémentez la transformation de Box-Muller pour obtenir Z1 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nU1 = np.random.uniform(1e-10, 1.0, N)\nU2 = np.random.uniform(0.0, 1.0, N)\n\nR = np.sqrt(-2.0 * np.log(U1))\nZ1 = R * np.cos(2.0 * np.pi * U2)\n\nmoyenne_z1 = float(np.mean(Z1))\nvariance_z1 = float(np.var(Z1))\n\nprint(f'Moyenne empirique de Z1 : {moyenne_z1:.4f} (théorique : 0.0)')\nprint(f'Variance empirique de Z1 : {variance_z1:.4f} (théorique : 1.0)')",
        testPythonCode: "assert 'Z1' in globals()\nassert 'moyenne_z1' in globals()\nassert 'variance_z1' in globals()\nassert len(Z1) == 10000\nassert np.isclose(moyenne_z1, 0.0, atol=0.05)\nassert np.isclose(variance_z1, 1.0, atol=0.05)",
        hints: ["R = np.sqrt(-2.0 * np.log(U1))", "Z1 = R * np.cos(2.0 * np.pi * U2)", "moyenne_z1 = float(np.mean(Z1))", "variance_z1 = float(np.var(Z1))"],
        datasets: []
      },
      {
        id: "v2-py-17",
        title: "2. Simulation de Variables Aléatoires Corrélées par Cholesky",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Générez des chocs de marché multivariés respectant une matrice de covariance cible grâce à la décomposition de Cholesky.",
        theoryMarkdown: `
### Factorisation de Cholesky : Simuler des Risques de Marché Corrélés

#### 🎓 Cours Théorique Approfondi

En gestion de portefeuille multi-actifs (Actions, Obligations OAT, Crédit Investment Grade) ou dans un Générateur de Scénarios Économiques (ALM assurance), il est irréaliste de simuler les facteurs de risque indépendamment : lors d'une crise systémique, les spreads de crédit s'écartent au moment même où les actions chutent. Il faut donc transformer des chocs gaussiens indépendants en vecteurs aléatoires respectant exactement une matrice de variance-covariance cible $\\Sigma \\in \\mathbb{R}^{K \\times K}$.

> 💡 **Démonstration formelle : Factorisation $\\Sigma = L L'$ et Propagation de Covariance**
> 
> **Théorème de Cholesky :** Soit $\\Sigma \\in \\mathbb{R}^{K \\times K}$ une matrice symétrique ($\Sigma = \\Sigma'$) et **strictement définie positive** ($\\forall \\mathbf{x} \\ne \\mathbf{0}, \\mathbf{x}' \\Sigma \\mathbf{x} > 0$, soit toutes valeurs propres $\\lambda_k > 0$). Il existe une unique matrice triangulaire inférieure $L = (\\ell_{ij})_{1 \\le j \\le i \\le K}$ à diagonale strictement positive ($\\ell_{ii} > 0$) telle que :
> 
> $$\\Sigma = L L'$$
> 
> Les coefficients se calculent récursivement colonne par colonne :
> 
> $$\\ell_{ii} = \\sqrt{\\sigma_{ii} - \\sum_{k=1}^{i-1} \\ell_{ik}^2}, \\qquad \\ell_{ij} = \\frac{1}{\\ell_{jj}} \\left( \\sigma_{ij} - \\sum_{k=1}^{j-1} \\ell_{ik} \\ell_{jk} \\right) \\quad (i > j)$$
> 
> **Cas canonique $K = 2$ (corrélation $\\rho \\in ]-1, 1[$) :**
> 
> $$\\Sigma = \\begin{pmatrix} \\sigma_1^2 & \\rho\\sigma_1\\sigma_2 \\\\ \\rho\\sigma_1\\sigma_2 & \\sigma_2^2 \\end{pmatrix} \\implies L = \\begin{pmatrix} \\sigma_1 & 0 \\\\ \\rho \\sigma_2 & \\sigma_2 \\sqrt{1 - \\rho^2} \\end{pmatrix}$$
> 
> **Preuve sur le vecteur simulé $\\mathbf{X} = L \\mathbf{Z}$ :** Soit $\\mathbf{Z} \\sim \\mathcal{N}(\\mathbf{0}, I_K)$, donc $\\mathbb{E}[\\mathbf{Z}] = \\mathbf{0}$ et $\\mathbb{E}[\\mathbf{Z}\\mathbf{Z}'] = I_K$. Par linéarité de l'espérance, $\\mathbb{E}[\\mathbf{X}] = L \\mathbb{E}[\\mathbf{Z}] = \\mathbf{0}$, et sa matrice de variance-covariance vaut :
> 
> $$\\operatorname{Var}(\\mathbf{X}) = \\mathbb{E}[\\mathbf{X} \\mathbf{X}'] = \\mathbb{E}[(L \\mathbf{Z})(L \\mathbf{Z})'] = L \\mathbb{E}[\\mathbf{Z} \\mathbf{Z}'] L' = L I_K L' = L L' = \\Sigma$$

> ✏️ **Piège ALM / Modélisation à connaître :**
> 
> Si une matrice empirique estimée par paires sur données asynchrones possède une valeur propre négative ou nulle (matrice non définie positive), \`np.linalg.cholesky\` lève une \`LinAlgError: Matrix is not positive definite\`. On régularise alors d'abord $\\Sigma$ sur le cône semi-défini positif (méthode spectrale ou de Higham) avant de factoriser.

#### 💻 Masterclass Python Quantitatif

Attention aux conventions matricielles et de dimensions entre les mathématiques (vecteurs colonnes) et NumPy :
- **Convention triangulaire** : \`np.linalg.cholesky(Sigma)\` retourne la matrice triangulaire **inférieure** $L$ vérifiant \`L @ L.T == Sigma\` *(à l'inverse de MATLAB dont \`chol()\` renvoie par défaut la triangulaire supérieure $U = L'$ !)*.
- **Produit matriciel et alignement de dimensions** : Si $L$ est de dimension $(K, K)$ et que l'on simule $N$ tirages dans \`Z = np.random.randn(K, N)\`, le produit \`L @ Z\` a pour dimension $(K, N)$. On transpose ensuite via \`.T\` vers \`X = (L @ Z).T\` de dimension $(N, K)$ (chaque ligne = 1 scénario, chaque colonne = 1 actif).
- **Le piège critique de \`rowvar=False\`** : Par défaut, \`np.cov(X)\` suppose \`rowvar=True\` (variables en lignes). Sur une matrice $(50\\,000, 3)$, oublier \`rowvar=False\` tenterait d'allouer une matrice de covariance $50\\,000 \\times 50\\,000$ ($\approx 20\\text{ Go}$ de RAM !). Avec \`rowvar=False\`, NumPy calcule directement la matrice $3 \\times 3$.

\`\`\`python
import numpy as np

np.random.seed(123)

# 1. Matrice cible 2x2 : actif 1 (vol 20%), actif 2 (vol 30%), corrélation rho = 0.40
#    cov(1, 2) = 0.40 * 0.20 * 0.30 = 0.024
Sigma = np.array([
    [0.040, 0.024],
    [0.024, 0.090]
])

# 2. Décomposition de Cholesky : L est triangulaire inférieure (L @ L.T == Sigma)
L = np.linalg.cholesky(Sigma)

# 3. Simulation de 50 000 vecteurs gaussiens indépendants en forme (K=2, N=50000)
Z = np.random.randn(2, 50000)

# 4. Application linéaire X = L @ Z puis transposition vers (N, K) = (50000, 2)
X = (L @ Z).T

# 5. Estimation empirique (rowvar=False obligatoire car les variables sont en colonnes)
cov_emp = np.cov(X, rowvar=False)
corr_emp = np.corrcoef(X, rowvar=False)[0, 1]

print("Matrice triangulaire L :\\n", np.round(L, 4))
print("Reconstruction exacte (L @ L.T == Sigma) :", np.allclose(L @ L.T, Sigma))
print("Covariance empirique :\\n", np.round(cov_emp, 5))
print(f"Corrélation cible : 0.4000 | Corrélation simulée : {corr_emp:.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Matrice triangulaire L :
 [[0.2   0.   ]
 [0.12  0.275]]
Reconstruction exacte (L @ L.T == Sigma) : True
Covariance empirique :
 [[0.04    0.02444]
 [0.02444 0.0904 ]]
Corrélation cible : 0.4000 | Corrélation simulée : 0.4064
\`\`\`
        `,
        taskMarkdown: `
À partir de la matrice de covariance cible \`Sigma_cible\` ($3 \\times 3$), implémentez la génération de chocs gaussiens corrélés :

1. Calculez le facteur triangulaire inférieur de Cholesky \`L = np.linalg.cholesky(Sigma_cible)\` tel que $L L' = \\Sigma_{\\text{cible}}$.
2. Générez $N = 50\\,000$ vecteurs gaussiens indépendants \`Z\` de dimension \`(3, N)\` via \`np.random.randn(3, N)\`.
3. Construisez la matrice des variables corrélées \`X = (L @ Z).T\` (dimension $50\\,000 \\times 3$).
4. Calculez la matrice de covariance empirique \`cov_empirique = np.cov(X, rowvar=False)\` et affichez \`L\`, \`cov_empirique\` et l'écart maximal absolu.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nSigma_cible = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.09, 0.025],\n    [0.008, 0.025, 0.06]\n])\nN = 50000\n\n# Calculez L, simulez Z, puis construisez X et cov_empirique :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nSigma_cible = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.09, 0.025],\n    [0.008, 0.025, 0.06]\n])\nN = 50000\n\nL = np.linalg.cholesky(Sigma_cible)\nZ = np.random.randn(3, N)\nX = (L @ Z).T\ncov_empirique = np.cov(X, rowvar=False)\n\nprint('Matrice de Cholesky L :\\n', np.round(L, 4))\nprint('Matrice de Covariance Empirique :\\n', np.round(cov_empirique, 4))\nprint('Écart maximal absolu :', np.max(np.abs(cov_empirique - Sigma_cible)))",
        testPythonCode: "assert 'L' in globals()\nassert 'cov_empirique' in globals()\nassert np.allclose(L @ L.T, Sigma_cible)\nassert np.allclose(cov_empirique, Sigma_cible, atol=0.01)",
        hints: ["L = np.linalg.cholesky(Sigma_cible)", "Z = np.random.randn(3, N)", "X = (L @ Z).T", "cov_empirique = np.cov(X, rowvar=False)"],
        datasets: []
      },
      {
        id: "v2-py-18",
        title: "3. Mouvement Brownien Standard (Processus de Wiener)",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Simulez et tracez des trajectoires du processus stochastique de Wiener continu W(t).",
        theoryMarkdown: `
### Les Fondations du Calcul Stochastique : Processus de Wiener & Variation Quadratique

#### 🎓 Cours Théorique Approfondi

Introduit en finance par Louis Bachelier (1900) puis formalisé par Norbert Wiener (1923), le **mouvement brownien standard** est la brique élémentaire de toute modélisation en temps continu. Il représente l'accumulation continue de chocs d'information microscopiques non prévisibles, obtenue comme limite d'échelle (théorème de Donsker) d'une marche aléatoire symétrique à pas infiniment petits.

> 💡 **Définition axiomatique & Preuve de la Variation Quadratique $(dW_t)^2 = dt$**
> 
> Un processus stochastique $\\{W_t\\}_{t \\ge 0}$ est un **mouvement brownien standard** s'il vérifie :
> 1. $W_0 = 0$ presque sûrement.
> 2. **Continuité** : les trajectoires $t \\mapsto W_t$ sont continues partout, mais **dérivables nulle part**.
> 3. **Accroissements indépendants** : pour tout $0 \\le s < t$, $W_t - W_s$ est indépendant du passé $\\mathcal{F}_s = \\sigma(W_u, u \\le s)$.
> 4. **Accroissements gaussiens stationnaires** : $W_t - W_s \\sim \\mathcal{N}(0, t - s)$ (d'où $\\mathbb{E}[W_t \\mid \\mathcal{F}_s] = W_s$ : c'est une **martingale**).
> 
> **Preuve rigoureuse de la variation quadratique $[W]_T = T$ :**
> Soit une partition régulière $0 = t_0 < t_1 < \\dots < t_N = T$ de pas $\\Delta t = T / N$, et posons la somme des carrés des accroissements :
> 
> $$Q_N = \\sum_{k=0}^{N-1} (W_{t_{k+1}} - W_{t_k})^2 = \\sum_{k=0}^{N-1} (\\Delta W_k)^2$$
> 
> Comme $\\Delta W_k = \\sqrt{\\Delta t}\\, Z_k$ avec $Z_k \\stackrel{\\text{i.i.d.}}{\\sim} \\mathcal{N}(0, 1)$, on a $\\mathbb{E}[Z_k^2] = 1$ et $\\operatorname{Var}(Z_k^2) = 2$ ($Z_k^2 \\sim \\chi_1^2$). D'où :
> 
> $$\\mathbb{E}[Q_N] = \\sum_{k=0}^{N-1} \\Delta t\\, \\mathbb{E}[Z_k^2] = N \\cdot \\frac{T}{N} = T$$
> 
> $$\\operatorname{Var}(Q_N) = \\sum_{k=0}^{N-1} (\\Delta t)^2 \\operatorname{Var}(Z_k^2) = N \\cdot \\frac{2 T^2}{N^2} = \\frac{2 T^2}{N} \\xrightarrow[N \\to \\infty]{} 0$$
> 
> Par convergence en moyenne quadratique ($L^2$), la variation quadratique converge vers la **constante déterministe $T$**, ce qui fonde la règle fondamentale du calcul d'Itô :
> 
> $$(dW_t)^2 = dt$$
> 
> Corollaire immédiat : la variation de premier ordre $\\sum |\\Delta W_k|$ diverge en $\\mathcal{O}(\\sqrt{N}) \\to +\\infty$, démontrant que le mouvement brownien oscille infiniment à toute échelle et échappe au calcul différentiel classique de Newton-Leibniz.

> ✏️ **Lien Risk Management & Scaling temporel :**
> 
> Puisque $\\operatorname{Var}(W_t) = t$, l'écart-type des fluctuations croît comme $\\sqrt{t}$ (règle de la « racine carrée du temps » utilisée sous Bâle III pour convertir une VaR 1 jour en VaR réglementaire 10 jours via $\\times \\sqrt{10}$, ou une volatilité journalière en volatilité annuelle via $\\times \\sqrt{252}$).

#### 💻 Masterclass Python Quantitatif

Pour simuler efficacement $M$ trajectoires sur $N$ pas de temps sans aucune boucle :
- **Génération 2D des accroissements** : \`dW = np.sqrt(dt) * np.random.randn(M, N)\` crée directement une matrice de dimension $(M, N)$ (lignes = trajectoires, colonnes = intervalles de temps $[t_k, t_{k+1}]$).
- **Pré-allocation de l'état initial $W_0 = 0$** : on crée \`W = np.zeros((M, N + 1))\` de largeur $N + 1$ afin que la colonne d'indice \`0\` (\`W[:, 0]\`) reste exactement à $0.0$.
- **Somme cumulée horizontale (\`axis=1\`)** : \`W[:, 1:] = np.cumsum(dW, axis=1)\` remplit les colonnes $1$ à $N$ par cumul temporel le long de chaque ligne. *(Erreur fréquente : omettre \`axis=1\` aplatit la matrice en 1D, ou \`axis=0\` sommerait entre trajectoires !)*
- **Slicing final** : \`W[:, -1]\` extrait instantanément les $M$ valeurs terminales à $t = T$.

\`\`\`python
import numpy as np

np.random.seed(123)
M, T = 5, 1.0

# Vérification numérique de la convergence de la variation quadratique [W]_T -> T = 1.0
for N_pas in [252, 2520, 25200]:
    dt = T / N_pas
    # Accroissements browniens dW ~ N(0, dt) en matrice 2D (M, N_pas)
    dW = np.sqrt(dt) * np.random.randn(M, N_pas)
    # Pré-allocation (M, N_pas + 1) pour garantir W[:, 0] == 0.0
    W = np.zeros((M, N_pas + 1))
    # Somme cumulée le long du temps (axis=1) sur les colonnes 1 à N_pas
    W[:, 1:] = np.cumsum(dW, axis=1)
    # Variation quadratique empirique moyenne sur les M trajectoires
    qv_moy = float(np.mean(np.sum(dW**2, axis=1)))
    print(f"N={N_pas:5d} | dt={dt:.6f} | [W]_T moyen={qv_moy:.5f} | W_T min={W[:,-1].min():+.3f}, max={W[:,-1].max():+.3f}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
N=  252 | dt=0.003968 | [W]_T moyen=0.98190 | W_T min=-3.015, max=+1.445
N= 2520 | dt=0.000397 | [W]_T moyen=1.00387 | W_T min=-0.022, max=+1.879
N=25200 | dt=0.000040 | [W]_T moyen=0.99701 | W_T min=-1.978, max=+0.654
\`\`\`

Sur la figure Matplotlib attendue dans l'exercice, les 5 trajectoires issues de \`W[:, 0] = 0\` diffusent continûment de $t = 0$ à $t = 1$ avec des oscillations irrégulières non dérivables en forme d'enveloppe parabolique $\\pm\\sqrt{t}$ autour de l'axe horizontal \`0\`.
        `,
        taskMarkdown: `
Simulez $M = 5$ trajectoires d'un mouvement brownien standard sur l'horizon $T = 1.0$ an discrétisé en $N = 252$ pas de temps ($\\Delta t = T / N$) :

1. Générez la matrice des accroissements gaussiens \`dW = np.sqrt(dt) * np.random.randn(M, N)\` de dimension $(5, 252)$.
2. Pré-allouez la matrice \`W = np.zeros((M, N + 1))\` de dimension $(5, 253)$ afin que \`W[:, 0]\` soit strictement nul.
3. Remplissez les pas suivants par somme cumulée temporelle \`W[:, 1:] = np.cumsum(dW, axis=1)\`.
4. Tracez les 5 trajectoires en fonction de \`temps = np.linspace(0, T, N + 1)\` avec Matplotlib.
        `,
        initialCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nM = 5\nN = 252\nT = 1.0\ndt = T / N\n\n# Simulez les trajectoires W de dimension (M, N+1) :\n",
        solutionCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nM = 5\nN = 252\nT = 1.0\ndt = T / N\ntemps = np.linspace(0, T, N + 1)\n\ndW = np.sqrt(dt) * np.random.randn(M, N)\nW = np.zeros((M, N + 1))\nW[:, 1:] = np.cumsum(dW, axis=1)\n\nplt.figure(figsize=(6, 3.5))\nfor i in range(M):\n    plt.plot(temps, W[i], lw=1.5, label=f'Trajectoire {i+1}')\nplt.axhline(0, color='black', ls='--', lw=1)\nplt.xlabel('Temps t (années)')\nplt.ylabel('W(t)')\nplt.title('Simulations du Mouvement Brownien Standard')\nplt.legend(loc='upper left', fontsize=8)\nplt.grid(True, alpha=0.3)\n\nprint(f'Moyenne finale : {np.mean(W[:, -1]):.4f}, Écart-type : {np.std(W[:, -1]):.4f}')",
        testPythonCode: "assert 'W' in globals()\nassert W.shape == (5, 253)\nassert np.all(W[:, 0] == 0.0)",
        hints: ["dW = np.sqrt(dt) * np.random.randn(M, N)", "W = np.zeros((M, N + 1))", "W[:, 1:] = np.cumsum(dW, axis=1)"],
        datasets: []
      },
      {
        id: "v2-py-19",
        title: "4. Mouvement Brownien Géométrique (GBM) Vectorisé",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Simulez les cours boursiers selon l'EDS de Black-Scholes avec la solution exacte d'Itô.",
        theoryMarkdown: `
### Le Modèle Canonique de Black-Scholes : Lemme d'Itô et Correction $-\\frac{1}{2}\\sigma^2$

#### 🎓 Cours Théorique Approfondi

Pourquoi ne modélise-t-on pas le prix d'une action par un mouvement brownien arithmétique $dS_t = \\mu dt + \\sigma dW_t$ ? Parce qu'une loi normale autorise des cours négatifs ($\\mathbb{P}(S_t < 0) > 0$), violant la responsabilité limitée des actionnaires, et suppose un risque en euros constant quel que soit le niveau du cours. En finance, les investisseurs raisonnent en **rendement relatif** $\\frac{dS_t}{S_t} = \\mu dt + \\sigma dW_t$, d'où l'Équation Différentielle Stochastique (EDS) du **Mouvement Brownien Géométrique (GBM)**.

> 💡 **Démonstration rigoureuse du Lemme d'Itô appliquée à $f(S_t) = \\ln(S_t)$**
> 
> Soit l'EDS du GBM :
> 
> $$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$
> 
> Considérons le changement de variable $f(t, S) = \\ln(S)$ de classe $C^{1, 2}$ sur $]0, +\\infty[$. Le **Lemme d'Itô** (développement de Taylor à l'ordre 2 conservant les termes d'ordre $dt$ grâce à $(dW_t)^2 = dt$, les termes $dt^2$ et $dt\\,dW_t$ étant nuls à la limite) énonce :
> 
> $$df(t, S_t) = \\frac{\\partial f}{\\partial t} dt + \\frac{\\partial f}{\\partial S} dS_t + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} (dS_t)^2$$
> 
> Calculons les dérivées partielles et la variation quadratique $(dS_t)^2$ :
> 
> $$\\frac{\\partial f}{\\partial t} = 0, \\qquad \\frac{\\partial f}{\\partial S} = \\frac{1}{S}, \\qquad \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2}$$
> 
> $$(dS_t)^2 = (\\mu S_t dt + \\sigma S_t dW_t)^2 = \\sigma^2 S_t^2 (dW_t)^2 + o(dt) = \\sigma^2 S_t^2 dt$$
> 
> En substituant dans la formule d'Itô :
> 
> $$d\\ln(S_t) = \\frac{1}{S_t}(\\mu S_t dt + \\sigma S_t dW_t) + \\frac{1}{2}\\left(-\\frac{1}{S_t^2}\\right) \\sigma^2 S_t^2 dt$$
> 
> $$d\\ln(S_t) = \\left(\\mu - \\frac{1}{2}\\sigma^2\\right) dt + \\sigma dW_t$$
> 
> En intégrant exactement entre $0$ et $t$, on obtient la **solution analytique fermée** du GBM (strictement positive et sans aucun biais de discrétisation) :
> 
> $$S_t = S_0 \\exp\\left( \\left( \\mu - \\frac{1}{2}\\sigma^2 \\right) t + \\sigma W_t \\right)$$

> ✏️ **Intuition économique du terme $-\\frac{1}{2}\\sigma^2$ (*Volatility Drag*) & Moments :**
> 
> Comme $W_t \\sim \\mathcal{N}(0, t)$, la fonction génératrice des moments donne $\\mathbb{E}[e^{\\sigma W_t}] = e^{\\frac{1}{2}\\sigma^2 t}$. La correction $-\\frac{1}{2}\\sigma^2$ dans l'exponentielle compense exactement la convexité de $\\exp(\\cdot)$ (inégalité de Jensen) afin de préserver :
> 
> $$\\mathbb{E}[S_t] = S_0 e^{\\left(\\mu - \\frac{1}{2}\\sigma^2\\right)t} \\cdot e^{\\frac{1}{2}\\sigma^2 t} = S_0 e^{\\mu t}, \\qquad \\text{Médiane}(S_t) = S_0 e^{\\left(\\mu - \\frac{1}{2}\\sigma^2\\right)t} < \\mathbb{E}[S_t]$$
> 
> En gestion d'actifs et ALM, cela explique l'érosion par la volatilité : si un actif monte de $+50\\%$ puis baisse de $-50\\%$, sa moyenne arithmétique est nulle mais son capital perd $25\\%$ ($1 - \\frac{1}{2}\\sigma^2$ sur taux composé). Plus $\\sigma$ est élevé, plus la médiane de richesse chute même si $\\mu$ reste inchangé !

#### 💻 Masterclass Python Quantitatif

Pourquoi privilégier la solution exacte d'Itô plutôt qu'Euler-Maruyama sur le GBM :
- **Absence de biais de discrétisation** : si l'on s'intéresse uniquement au prix terminal $S_T$ (options européennes, VaR à horizon fixe $T$), la formule exacte \`S0 * np.exp((mu - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)\` simule $S_T$ en **1 seule étape** avec erreur de discrétisation nulle, là où Euler ($S_{t+\\Delta t} = S_t(1 + \\mu\\Delta t + \\sigma\\sqrt{\\Delta t}Z)$) introduit une erreur d'ordre $\\Delta t$ et peut produire des cours négatifs si $\\sigma\\sqrt{\\Delta t}Z < -1$.
- **Échelle de simulation massive** : $N = 100\\,000$ trajectoires en \`float64\` n'occupent que $800\\text{ Ko}$ en RAM et s'évaluent en moins d'une milliseconde via NumPy.

\`\`\`python
import numpy as np

np.random.seed(123)
S0, mu, T, N = 100.0, 0.08, 1.0, 100000

# Un unique vecteur de chocs gaussiens standard réutilisé pour comparer deux volatilités
Z = np.random.randn(N)

for sigma in [0.20, 0.50]:
    # Formule exacte issue du lemme d'Itô (sans biais de discrétisation)
    S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    esp_theo = S0 * np.exp(mu * T)
    med_theo = S0 * np.exp((mu - 0.5 * sigma**2) * T)
    print(f"sigma={sigma:.0%} -> Moy sim: {np.mean(S_T):6.2f} (théo: {esp_theo:6.2f}) | Médiane sim: {np.median(S_T):6.2f} (théo: {med_theo:6.2f})")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
sigma=20% -> Moy sim: 108.36 (théo: 108.33) | Médiane sim: 106.22 (théo: 106.18)
sigma=50% -> Moy sim: 108.39 (théo: 108.33) | Médiane sim:  95.69 (théo:  95.60)
\`\`\`
        `,
        taskMarkdown: `
Pour un actif de prix initial $S_0 = 100$, un drift annuel $\\mu = 0.08$, une volatilité $\\sigma = 0.20$ et un horizon $T = 1.0$ an sur $N = 100\\,000$ tirages :

1. Générez $Z \\sim \\mathcal{N}(0, 1)$ de taille $N$ via \`np.random.randn(N)\`.
2. Simulez les cours terminaux selon la solution exacte d'Itô : \`S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\`.
3. Calculez l'espérance empirique \`esperance_empirique = float(np.mean(S_T))\` et comparez-la à l'espérance théorique \`esperance_theorique = float(S0 * np.exp(mu * T))\`.
4. Affichez les valeurs et l'erreur relative.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nmu = 0.08\nsigma = 0.20\nT = 1.0\nN = 100000\n\n# Simulez S_T selon la formule exacte du GBM :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nmu = 0.08\nsigma = 0.20\nT = 1.0\nN = 100000\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\n\nesperance_empirique = float(np.mean(S_T))\nesperance_theorique = float(S0 * np.exp(mu * T))\n\nprint(f'Espérance empirique : {esperance_empirique:.4f}')\nprint(f'Espérance théorique : {esperance_theorique:.4f}')\nprint(f'Erreur relative : {abs(esperance_empirique - esperance_theorique) / esperance_theorique:.4%}')",
        testPythonCode: "assert 'S_T' in globals()\nassert 'esperance_empirique' in globals()\nassert 'esperance_theorique' in globals()\nassert np.isclose(esperance_empirique, esperance_theorique, rtol=0.01)",
        hints: ["Z = np.random.randn(N)", "S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)", "esperance_empirique = float(np.mean(S_T))", "esperance_theorique = float(S0 * np.exp(mu * T))"],
        datasets: []
      },
      {
        id: "v2-py-20",
        title: "5. Pricing d'un Call Européen par Monte Carlo (Mesure Q)",
        category: "pricing",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Évaluez la prime d'une option d'achat européenne par espérance actualisée sous la mesure risque-neutre.",
        theoryMarkdown: `
### Évaluation Risque-Neutre ($\\mathbb{Q}$) & Théorème de Feynman-Kac

#### 🎓 Cours Théorique Approfondi

Pourquoi le rendement espéré $\\mu$ de l'action — si difficile à estimer économétriquement — **disparaît-il totalement** de la formule de prix d'une option ? Parce qu'en l'absence d'opportunité d'arbitrage (AOA) et en marché complet, une option se **réplique exactement** par une stratégie dynamique auto-financée en action et en actif sans risque : deux agents ayant des anticipations $\\mu$ opposées sur l'action doivent payer exactement le même coût de réplication, sinon un arbitrage sans risque existe.

> 💡 **Changement de mesure risque-neutre $\\mathbb{P} \\to \\mathbb{Q}$ & Théorème de Feynman-Kac**
> 
> Sous la mesure historique $\\mathbb{P}$, le prix actualisé $\\tilde{S}_t = e^{-rt} S_t$ vérifie par le lemme d'Itô :
> 
> $$d\\tilde{S}_t = (\\mu - r) \\tilde{S}_t dt + \\sigma \\tilde{S}_t dW_t^{\\mathbb{P}}$$
> 
> Par le **théorème de Girsanov**, en posant le ratio de Sharpe (prix du risque) $\\theta = \\frac{\\mu - r}{\\sigma}$ et le nouveau brownien $W_t^{\\mathbb{Q}} = W_t^{\\mathbb{P}} + \\theta t$, il existe une unique probabilité équivalente **risque-neutre $\\mathbb{Q}$** sous laquelle $\\tilde{S}_t$ est une martingale ($d\\tilde{S}_t = \\sigma \\tilde{S}_t dW_t^{\\mathbb{Q}}$), soit :
> 
> $$dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}} \\implies S_T = S_0 \\exp\\left( \\left( r - \\frac{1}{2}\\sigma^2 \\right) T + \\sigma \\sqrt{T} Z \\right), \\quad Z \\sim \\mathcal{N}(0, 1)$$
> 
> Tout actif dérivé de payoff $H(S_T)$ vaut alors son espérance actualisée au taux sans risque $r$ sous $\\mathbb{Q}$ :
> 
> $$C_0 = e^{-rT} \\mathbb{E}^{\\mathbb{Q}}[\\max(S_T - K, 0)] \\approx \\hat{C}_N = \\frac{e^{-rT}}{N} \\sum_{i=1}^N \\max(S_T^{(i)} - K, 0)$$
> 
> **Pont probabilités $\\leftrightarrow$ EDP (Théorème de Feynman-Kac) :** La fonction de prix $V(t, S) = e^{-r(T-t)}\\mathbb{E}^{\\mathbb{Q}}[H(S_T) \\mid S_t = S]$ est l'unique solution de l'équation aux dérivées partielles parabolique de Black-Scholes :
> 
> $$\\frac{\\partial V}{\\partial t} + r S \\frac{\\partial V}{\\partial S} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} - r V = 0, \\qquad V(T, S) = \\max(S - K, 0)$$

> ✏️ **Distinction critique en Actuariat & ALM ($\\mathbb{Q}$ vs $\\mathbb{P}$) :**
> 
> En assurance-vie sous Solvabilité II (Best Estimate des garanties planchers et participations aux bénéfices), on génère les trajectoires sous la **mesure risque-neutre $\\mathbb{Q}$** pour assurer la valorisation *Market-Consistent* des options cachées, tandis que les projections de solvabilité ORSA / VaR à 1 an utilisent la **mesure réelle $\\mathbb{P}$** avec primes de risque historiques $\\mu > r$.

#### 💻 Masterclass Python Quantitatif

Bonnes pratiques de vectorisation pour le pricing Monte Carlo :
- **\`np.maximum\` vs \`max\` Python** : la fonction native \`max(S_T - K, 0)\` échoue sur un vecteur NumPy (\`ValueError: The truth value of an array is ambiguous\`). Utilisez impérativement l'ufunc vectorisée \`np.maximum(S_T - K, 0.0)\` qui applique $\\max(\\cdot, 0)$ élément par élément en C.
- **Vérification par parité Call-Put** : sur le même tirage \`S_T\`, évaluer simultanément le Call $\\max(S_T - K, 0)$ et le Put $\\max(K - S_T, 0)$ permet de contrôler immédiatement la parité sans arbitrage $C - P = S_0 - K e^{-rT}$ (qui ne dépend que de $\\mathbb{E}^{\\mathbb{Q}}[S_T] = S_0 e^{rT}$).

\`\`\`python
import numpy as np

np.random.seed(123)
S0, K, r, sigma, T, N = 100.0, 100.0, 0.05, 0.20, 1.0, 100000

# 1. Simulation sous la mesure risque-neutre Q (drift = r, jamais mu !)
Z = np.random.randn(N)
S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)

# 2. Payoffs vectorisés par np.maximum et actualisation au taux sans risque exp(-rT)
call_mc = float(np.exp(-r * T) * np.mean(np.maximum(S_T - K, 0.0)))
put_mc = float(np.exp(-r * T) * np.mean(np.maximum(K - S_T, 0.0)))

# 3. Contrôle d'absence d'arbitrage : parité Call - Put = S0 - K * exp(-rT)
parite_theo = S0 - K * np.exp(-r * T)

print(f"Call MC : {call_mc:.4f} EUR | Put MC : {put_mc:.4f} EUR")
print(f"Parité Call-Put -> Empirique (C - P): {call_mc - put_mc:.4f} EUR vs Théorique: {parite_theo:.4f} EUR")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Call MC : 10.4715 EUR | Put MC : 5.5694 EUR
Parité Call-Put -> Empirique (C - P): 4.9021 EUR vs Théorique: 4.8771 EUR
\`\`\`
        `,
        taskMarkdown: `
Évaluez un Call européen par simulation de Monte Carlo sous la mesure risque-neutre $\\mathbb{Q}$ pour $S_0 = 100$, $K = 100$, $r = 0.05$, $\\sigma = 0.20$, $T = 1.0$ an et $N = 100\\,000$ tirages :

1. Tirez \`Z = np.random.randn(N)\` et simulez les cours terminaux \`S_T\` avec le drift risque-neutre $r - \\frac{1}{2}\\sigma^2$.
2. Calculez le vecteur des payoffs à maturité \`payoffs = np.maximum(S_T - K, 0.0)\`.
3. Actualisez la moyenne empirique pour obtenir \`prix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))\` et affichez le résultat.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\nN = 100000\n\n# Calculez prix_call_mc par simulation de Monte Carlo :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\nN = 100000\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs = np.maximum(S_T - K, 0.0)\nprix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))\n\nprint(f'Prix estimé du Call Européen (Monte Carlo) : {prix_call_mc:.4f} €')",
        testPythonCode: "assert 'prix_call_mc' in globals()\nassert np.isclose(prix_call_mc, 10.45, atol=0.20)",
        hints: ["Z = np.random.randn(N)", "S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)", "payoffs = np.maximum(S_T - K, 0.0)", "prix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))"],
        datasets: []
      },
      {
        id: "v2-py-21",
        title: "6. Benchmark Analytique : Formule Fermée de Black-Scholes-Merton",
        category: "pricing",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Codez la formule fermée de Black-Scholes pour comparer le prix théorique exact au résultat Monte Carlo.",
        theoryMarkdown: `
### La Formule Fermée de Black-Scholes-Merton (1973) : Dérivation & Probabilités $\\Phi(d_1), \\Phi(d_2)$

#### 🎓 Cours Théorique Approfondi

Avant de déployer un moteur Monte Carlo sur des options exotiques complexes, tout quant calibre et valide son générateur sur le benchmark analytique exact de Black-Scholes-Merton pour une option vanille européenne.

> 💡 **Dérivation de la formule fermée par intégration risque-neutre & sens de $\\Phi(d_1), \\Phi(d_2)$**
> 
> Décomposons l'espérance risque-neutre $C_{\\text{BS}} = e^{-rT}\\mathbb{E}^{\\mathbb{Q}}[(S_T - K)\\mathbb{I}_{\\{S_T > K\\}}]$ en deux termes :
> 
> $$C_{\\text{BS}} = \\underbrace{e^{-rT} \\mathbb{E}^{\\mathbb{Q}}[S_T \\mathbb{I}_{\\{S_T > K\\}}]}_{\\text{Terme 1 (flux actif)}} - \\underbrace{K e^{-rT} \\mathbb{Q}(S_T > K)}_{\\text{Terme 2 (paiement du strike)}}$$
> 
> **1. Probabilité d'exercice sous $\\mathbb{Q}$ (Terme 2) :** En écrivant $S_T = S_0 e^{(r - \\frac{1}{2}\\sigma^2)T + \\sigma\\sqrt{T}Z}$ avec $Z \\sim \\mathcal{N}(0, 1)$ :
> 
> $$S_T > K \\iff \\ln\\left(\\frac{S_0}{K}\\right) + \\left(r - \\frac{1}{2}\\sigma^2\\right)T + \\sigma\\sqrt{T}Z > 0 \\iff Z > -d_2$$
> 
> Par symétrie de la loi normale, $\\mathbb{Q}(Z > -d_2) = \\Phi(d_2)$, où :
> 
> $$d_2 = \\frac{\\ln(S_0 / K) + \\left( r - \\frac{1}{2}\\sigma^2 \\right) T}{\\sigma \\sqrt{T}}, \\qquad d_1 = d_2 + \\sigma\\sqrt{T} = \\frac{\\ln(S_0 / K) + \\left( r + \\frac{1}{2}\\sigma^2 \\right) T}{\\sigma \\sqrt{T}}$$
> 
> **2. Changement de numéraire par complétion du carré (Terme 1) :**
> 
> $$e^{-rT} \\int_{-d_2}^{+\\infty} S_0 e^{-\\frac{1}{2}\\sigma^2 T + \\sigma\\sqrt{T} z} \\frac{e^{-z^2/2}}{\\sqrt{2\\pi}} dz = S_0 \\int_{-d_2}^{+\\infty} \\frac{1}{\\sqrt{2\\pi}} \\exp\\left(-\\frac{(z - \\sigma\\sqrt{T})^2}{2}\\right) dz$$
> 
> En posant $u = z - \\sigma\\sqrt{T}$, la borne inférieure devient $-d_2 - \\sigma\\sqrt{T} = -d_1$, d'où la valeur exacte $S_0 \\Phi(d_1)$ et la formule finale :
> 
> $$C_{\\text{BS}} = S_0 \\Phi(d_1) - K e^{-rT} \\Phi(d_2)$$
> 
> **Interprétation financière cruciale :**
> - **$\\Phi(d_2) = \\mathbb{Q}(S_T > K)$** est la **probabilité risque-neutre d'exercice** à maturité sous le numéraire monétaire.
> - **$\\Phi(d_1) = \\Delta = \\frac{\\partial C}{\\partial S_0}$** est le **ratio de couverture Delta** (nombre d'actions à détenir pour répliquer le Call) — et mathématiquement la probabilité d'exercice sous la mesure « action » $\\mathbb{Q}^S$ (toujours $\\Phi(d_1) > \\Phi(d_2)$ car les scénarios haussiers où $S_T$ est grand pèsent davantage).

> ✏️ **Exemple chiffré & Résolution algébrique pas-à-pas :**
> 
> Prenons les paramètres exacts : $S_0 = 100\\text{ EUR}$, Strike $K = 100\\text{ EUR}$ (option à la monnaie), $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$ an.
> 1. **Terme de dérive $\\ln(S_0 / K)$ et ajustement de convexité** :
>    $$\\ln(100/100) = 0, \\qquad r + \\frac{1}{2}\\sigma^2 = 0.05 + \\frac{1}{2}(0.04) = 0.07$$
> 2. **Calcul de $d_1$ et $d_2$** :
>    $$d_1 = \\frac{0 + 0.07 \\times 1}{0.20 \\times \\sqrt{1}} = \\mathbf{0.35}, \\qquad d_2 = 0.35 - 0.20 = \\mathbf{0.15}$$
> 3. **Probabilités cumulées normales $\\Phi(d)$** :
>    $$\\Phi(0.35) \\approx 0.63683 \\quad (\\text{Delta de couverture}), \\qquad \\Phi(0.15) \\approx 0.55962 \\quad (\\mathbb{Q}(S_T > K))$$
> 4. **Facteur d'actualisation et Prix exact du Call $C_{\\text{BS}}$** :
>    $$e^{-0.05} \\approx 0.95123 \\implies C_{\\text{BS}} = 100 \\times 0.63683 - 100 \\times 0.95123 \\times 0.55962 = \\mathbf{10.451\\text{ EUR}}$$

#### 💻 Masterclass Python Quantitatif

Encapsuler le pricer analytique dans une fonction \`def bs_pricer(...)\` propre avec \`scipy.stats.norm\` :
- **\`norm.cdf(x)\` vs \`norm.pdf(x)\`** : \`cdf\` évalue la probabilité cumulée $\\Phi(x)$ nécessaire aux prix et au Delta ; \`pdf\` évalue la densité $\\varphi(x) = \\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}$ indispensable pour les Grecs de second ordre et de volatilité ($\\Gamma = \\frac{\\varphi(d_1)}{S \\sigma \\sqrt{T}}$, $\\mathcal{V} = S\\varphi(d_1)\\sqrt{T}$).
- **Typage explicite et dictionnaire de sortie** : renvoyer un \`dict\` structuré (\`call\`, \`put\`, \`delta\`, \`gamma\`, \`q_itm\`) facilite la réutilisation en calibration de volatilité implicite ou en calcul de VaR analytique.

\`\`\`python
import numpy as np
from scipy.stats import norm

def bs_pricer(S: float, K: float, r: float, sigma: float, T: float) -> dict:
    """Calcule les prix Call/Put Black-Scholes et les indicateurs clés sous Q."""
    sqrt_T = np.sqrt(T)
    # Distance normalisée en écarts-types (d1 pour le numéraire action, d2 pour le monétaire)
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrt_T)
    d2 = d1 - sigma * sqrt_T
    # Formules fermées du Call et du Put européens
    call = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    put = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    return {
        "call": call,
        "put": put,
        "delta": norm.cdf(d1),
        "gamma": norm.pdf(d1) / (S * sigma * sqrt_T),
        "q_itm": norm.cdf(d2)
    }

# Évaluation sur trois niveaux de strike (ITM, ATM, OTM)
for strike in [80.0, 100.0, 120.0]:
    res = bs_pricer(100.0, strike, 0.05, 0.20, 1.0)
    print(f"K={strike:5.1f} | Call={res['call']:6.3f} | Put={res['put']:6.3f} | Delta=Phi(d1)={res['delta']:.4f} | Q(S_T>K)=Phi(d2)={res['q_itm']:.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
K= 80.0 | Call=24.589 | Put= 0.687 | Delta=Phi(d1)=0.9286 | Q(S_T>K)=Phi(d2)=0.8972
K=100.0 | Call=10.451 | Put= 5.574 | Delta=Phi(d1)=0.6368 | Q(S_T>K)=Phi(d2)=0.5596
K=120.0 | Call= 3.247 | Put=17.395 | Delta=Phi(d1)=0.2872 | Q(S_T>K)=Phi(d2)=0.2231
\`\`\`
        `,
        taskMarkdown: `
À partir des paramètres standards ($S_0 = 100.0$, $K = 100.0$, $r = 0.05$, $\\sigma = 0.20$, $T = 1.0$) et de \`scipy.stats.norm\` :

1. Implémentez le calcul exact de \`d1\` et \`d2 = d1 - sigma * np.sqrt(T)\`.
2. Déterminez la prime théorique exacte \`prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))\`.
3. Affichez \`d1\`, \`d2\` et \`prix_bs\` (attendu proche de $10.4506$) afin de valider l'estimateur Monte Carlo de l'exercice précédent.
        `,
        initialCode: "import numpy as np\nfrom scipy.stats import norm\n\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\n\n# Calculez d1, d2 et le prix analytique Black-Scholes prix_bs :\n",
        solutionCode: "import numpy as np\nfrom scipy.stats import norm\n\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\n\nd1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))\nd2 = d1 - sigma * np.sqrt(T)\nprix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))\n\nprint(f'd1 : {d1:.4f}, d2 : {d2:.4f}')\nprint(f'Prix théorique exact de Black-Scholes : {prix_bs:.4f} €')",
        testPythonCode: "assert 'd1' in globals()\nassert 'd2' in globals()\nassert 'prix_bs' in globals()\nassert np.isclose(prix_bs, 10.4506, atol=1e-3)",
        hints: ["d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))", "d2 = d1 - sigma * np.sqrt(T)", "prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))"],
        datasets: []
      },
      {
        id: "v2-py-22",
        title: "7. Intervalle de Confiance et Vitesse de Convergence en O(1/sqrt(N))",
        category: "monte_carlo",
        language: "python",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Quantifiez la précision de la méthode de Monte Carlo par le Théorème Central Limite (TCL).",
        theoryMarkdown: `
### Erreur Standard & Vitesse de Convergence en $\\mathcal{O}(1/\\sqrt{N})$ (TCL)

#### 🎓 Cours Théorique Approfondi

Fournir un prix Monte Carlo sans intervalle de confiance est une faute professionnelle sur un desk de dérivés : comment savoir si un écart de $0.10\\text{ EUR}$ face au marché provient d'un mauvais calibrage de volatilité ou simplement du bruit statistique de la simulation ? Le **Théorème Central Limite (TCL)** quantifie universellement cette incertitude.

> 💡 **Démonstration rigoureuse : Variance d'échantillonnage & Loi asymptotique**
> 
> Soient $Y_1, \\dots, Y_N$ des réalisations i.i.d. du payoff actualisé $Y_i = e^{-rT}\\max(S_T^{(i)} - K, 0)$, de moyenne exacte $C_0 = \\mathbb{E}[Y]$ et de variance finie $\\sigma_Y^2 = \\operatorname{Var}(Y) < \\infty$.
> Par linéarité et indépendance, la variance de la moyenne empirique $\\hat{C}_N = \\frac{1}{N} \\sum_{i=1}^N Y_i$ vaut :
> 
> $$\\operatorname{Var}(\\hat{C}_N) = \\frac{1}{N^2} \\sum_{i=1}^N \\operatorname{Var}(Y_i) = \\frac{\\sigma_Y^2}{N} \\implies \\text{Écart-type}(\\hat{C}_N) = \\frac{\\sigma_Y}{\\sqrt{N}} = \\mathcal{O}\\left(\\frac{1}{\\sqrt{N}}\\right)$$
> 
> Par le **Théorème Central Limite**, la statistique centrée-réduite converge en loi vers une gaussienne standard :
> 
> $$\\frac{\\sqrt{N}(\\hat{C}_N - C_0)}{\\sigma_Y} \\xrightarrow[N \\to \\infty]{\\mathcal{L}} \\mathcal{N}(0, 1)$$
> 
> En remplaçant l'écart-type inconnu $\\sigma_Y$ par l'estimateur empirique sans biais $s_N = \\sqrt{\\frac{1}{N-1} \\sum_{i=1}^N (Y_i - \\hat{C}_N)^2}$ (théorème de Slutsky), on définit l'**Erreur Standard** $SE = \\frac{s_N}{\\sqrt{N}}$ et l'intervalle de confiance à **95\\%** ($z_{0.975} \\approx 1.96$) :
> 
> $$IC_{95\\%} = \\left[ \\hat{C}_N - 1.96 \\cdot SE, \\; \\hat{C}_N + 1.96 \\cdot SE \\right]$$

> ✏️ **Le Paradoxe Dimensionnel de Monte Carlo :**
> 
> - **Lenteur en 1D** : Pour diviser l'erreur $SE$ par $10$ (gagner une décimale de précision), il faut multiplier le nombre de simulations $N$ par **$10^2 = 100$** !
> - **Triomphe en haute dimension ($d \\ge 4$)** : Sur un panier de $d = 20$ actifs (ou un GSE multi-facteurs ALM), l'erreur d'une grille déterministe / EDP explose en $\\mathcal{O}(N^{-2/d})$ (*fléau de la dimension*), alors que la vitesse $\\mathcal{O}(1/\\sqrt{N})$ de Monte Carlo est **strictement indépendante de la dimension $d$** !

#### 💻 Masterclass Python Quantitatif

Précautions statistiques en Python :
- **Correction de Bessel (\`ddof=1\`)** : par défaut, \`np.std(arr)\` utilise \`ddof=0\` (diviseur $N$). L'estimateur sans biais de la variance $s_N^2$ impose \`ddof=1\` (diviseur $N - 1$) dans \`np.std(payoffs_actualises, ddof=1)\`.
- **Évaluation de la loi de décroissance** : en bouclant sur \`N_sim in [1000, 10000, 100000]\` (multiplication par $100$ entre le premier et le dernier), on observe directement la division de \`SE\` par $\\sqrt{100} = 10$.

\`\`\`python
import numpy as np

np.random.seed(123)
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0

# Comparaison de précision pour N = 1 000 -> 10 000 -> 100 000 (facteur x100)
for N_sim in [1000, 10000, 100000]:
    Z = np.random.randn(N_sim)
    S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    # Payoffs actualisés Y_i
    Y = np.exp(-r * T) * np.maximum(S_T - K, 0.0)
    prix = float(np.mean(Y))
    # ddof=1 pour obtenir l'écart-type empirique sans biais s_N puis SE = s_N / sqrt(N)
    se = float(np.std(Y, ddof=1) / np.sqrt(N_sim))
    print(f"N={N_sim:6d} | Prix={prix:7.4f} | SE={se:.5f} | IC95=[{prix - 1.96*se:.4f}, {prix + 1.96*se:.4f}]")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
N=  1000 | Prix= 9.9155 | SE=0.45247 | IC95=[9.0286, 10.8023]
N= 10000 | Prix=10.7196 | SE=0.14853 | IC95=[10.4285, 11.0107]
N=100000 | Prix=10.4252 | SE=0.04647 | IC95=[10.3341, 10.5163]
\`\`\`
        `,
        taskMarkdown: `
À partir du vecteur de payoffs actualisés simulés \`payoffs_actualises\` ($N = 50\\,000$), quantifiez l'incertitude statistique par le Théorème Central Limite :

1. Calculez le prix estimé \`prix_mc = float(np.mean(payoffs_actualises))\`.
2. Calculez l'écart-type empirique sans biais \`s_N = float(np.std(payoffs_actualises, ddof=1))\`.
3. Déduisez l'erreur standard \`se = float(s_N / np.sqrt(len(payoffs_actualises)))\` et la demi-largeur de l'intervalle de confiance à $95\\%$ : \`demi_largeur = float(1.96 * se)\`.
4. Affichez le prix, l'erreur standard et l'intervalle complet.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs_actualises = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\n\n# Calculez prix_mc, se et demi_largeur :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs_actualises = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\n\nprix_mc = float(np.mean(payoffs_actualises))\ns_N = float(np.std(payoffs_actualises, ddof=1))\nse = float(s_N / np.sqrt(N))\ndemi_largeur = float(1.96 * se)\n\nprint(f'Prix Monte Carlo : {prix_mc:.4f} €')\nprint(f'Erreur Standard (SE) : {se:.5f} €')\nprint(f'Intervalle de Confiance à 95% : [{prix_mc - demi_largeur:.4f} €, {prix_mc + demi_largeur:.4f} €]')",
        testPythonCode: "assert 'prix_mc' in globals()\nassert 'se' in globals()\nassert 'demi_largeur' in globals()\nassert se > 0\nassert demi_largeur < 0.20",
        hints: ["prix_mc = float(np.mean(payoffs_actualises))", "s_N = float(np.std(payoffs_actualises, ddof=1))", "se = float(s_N / np.sqrt(N))", "demi_largeur = float(1.96 * se)"],
        datasets: []
      },
      {
        id: "v2-py-23",
        title: "8. Réduction de Variance I : Variables Antithétiques",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Doublez l'efficacité de vos calculs Monte Carlo en exploitant la symétrie de la loi normale standard.",
        theoryMarkdown: `
### Méthode des Variables Antithétiques : Exploiter la Symétrie Gaussienne

#### 🎓 Cours Théorique Approfondi

Puisque la convergence en $1/\\sqrt{N}$ impose un coût quadratique en $N$, la seule façon intelligente d'accélérer un moteur Monte Carlo consiste à **réduire le numérateur $\\sigma_Y$** de l'erreur standard $\\sigma_Y / \\sqrt{N}$. La méthode des **variables antithétiques** exploite la symétrie exacte de la loi normale ($Z \\sim \\mathcal{N}(0, 1) \\implies -Z \\sim \\mathcal{N}(0, 1)$) pour compenser automatiquement chaque aléa extrême par son opposé.

> 💡 **Preuve mathématique de la réduction de variance & Condition de monotonie**
> 
> Soit $Y^{(+)} = h(Z)$ et son jumeau antithétique $Y^{(-)} = h(-Z)$. Comme $Z$ et $-Z$ ont exactement la même loi, $\\mathbb{E}[Y^{(-)}] = \\mathbb{E}[Y^{(+)}]$ et $\\operatorname{Var}(Y^{(-)}) = \\operatorname{Var}(Y^{(+)}) = \\sigma_Y^2$. L'estimateur apparié $\\bar{Y} = \\frac{1}{2}(Y^{(+)} + Y^{(-)})$ est donc **rigoureusement sans biais** et sa variance vaut :
> 
> $$\\operatorname{Var}(\\bar{Y}) = \\frac{1}{4}\\left(\\operatorname{Var}(Y^{(+)}) + \\operatorname{Var}(Y^{(-)}) + 2\\operatorname{Cov}(Y^{(+)}, Y^{(-)})\\right) = \\frac{\\sigma_Y^2}{2}\\left(1 + \\rho(Y^{(+)}, Y^{(-)})\\right)$$
> 
> **Preuve de $\\operatorname{Cov}(h(Z), h(-Z)) \\le 0$ pour toute fonction monotone $h$ :**
> Soit $h$ croissante (comme le payoff d'un Call, car $S_T(z)$ croît en $z$) et deux tirages indépendants $Z, Z'$. Comme $h$ est croissante et $z \\mapsto -z$ décroissante, les deux facteurs de $(h(Z) - h(Z'))(h(-Z) - h(-Z'))$ sont de signes opposés, donc leur produit est $\\le 0$. En développant l'espérance par indépendance :
> 
> $$0 \\ge \\mathbb{E}[(h(Z) - h(Z'))(h(-Z) - h(-Z'))] = 2\\mathbb{E}[h(Z)h(-Z)] - 2\\mathbb{E}[h(Z)]\\mathbb{E}[h(-Z)] = 2\\operatorname{Cov}(Y^{(+)}, Y^{(-)})$$
> 
> Ainsi $\\rho \\le 0$, d'où $\\operatorname{Var}(\\bar{Y}) \\le \\frac{\\sigma_Y^2}{2}$ !
> 
> **Bilan à budget CPU égal :** Une paire antithétique évalue 2 payoffs (même coût que 2 tirages i.i.d. de variance $\\sigma_Y^2 / 2$). Le gain pur à coût identique vaut $\\frac{1}{1 + \\rho}$, tandis que le ratio \`var_standard / var_anti\` $= \\frac{2}{1 + \\rho}$ compare 1 tirage simple à 1 paire.
> 
> **Contre-exemple fatal (payoff non-monotone) :** Si $h$ est paire/symétrique (ex. un *Straddle* $|S_T - K|$), alors $h(-z) \\approx h(z)$ implique $\\rho > 0$ : l'estimateur antithétique devient **moins efficace** que le Monte Carlo standard !

#### 💻 Masterclass Python Quantitatif

Implémentation optimisée en NumPy :
- **Factorisation des calculs** : pré-calculer \`drift = (r - 0.5*sigma**2)*T\` et \`vol = sigma*np.sqrt(T)\` évite de répéter l'arithmétique lors du calcul de \`S_T1\` ($+Z$) et \`S_T2\` ($-Z$).
- **Extension aux trajectoires 2D** : sur une matrice \`Z\` de forme \`(N, M)\`, il suffit de construire \`Z_sym = np.vstack([Z, -Z])\` (ou traiter les deux blocs) sans retirer de nouveaux aléas.
- **Audit systématique** : toujours vérifier le coefficient de corrélation empirique \`np.corrcoef(Y_p, Y_m)[0, 1]\` avant d'activer les variables antithétiques sur un produit exotique structuré.

\`\`\`python
import numpy as np

np.random.seed(123)
N = 25000
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0
Z = np.random.randn(N)

# Trajectoires directes (+Z) et antithétiques (-Z) à partir des mêmes aléas
S_p = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
S_m = S0 * np.exp((r - 0.5 * sigma**2) * T - sigma * np.sqrt(T) * Z)

# 1. Cas favorable : Call vanille (payoff monotone croissant en Z)
Y_p = np.exp(-r * T) * np.maximum(S_p - K, 0.0)
Y_m = np.exp(-r * T) * np.maximum(S_m - K, 0.0)
Y_anti = 0.5 * (Y_p + Y_m)
rho_call = float(np.corrcoef(Y_p, Y_m)[0, 1])
ratio_call = float(np.var(Y_p, ddof=1) / np.var(Y_anti, ddof=1))

# 2. Contre-exemple : Straddle |S_T - K| (payoff non-monotone -> corrélation positive !)
Str_p = np.exp(-r * T) * np.abs(S_p - K)
Str_m = np.exp(-r * T) * np.abs(S_m - K)
Str_anti = 0.5 * (Str_p + Str_m)
rho_str = float(np.corrcoef(Str_p, Str_m)[0, 1])
ratio_str = float(np.var(Str_p, ddof=1) / np.var(Str_anti, ddof=1))

print(f"Call Vanille -> Corr={rho_call:+.4f} | Ratio Var(Y+)/Var(Y_anti): x{ratio_call:.2f} (théo 2/(1+rho): x{2/(1+rho_call):.2f})")
print(f"Straddle     -> Corr={rho_str:+.4f} | Ratio Var(S+)/Var(S_anti): x{ratio_str:.2f} (< 2 : perte à coût CPU égal !)")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Call Vanille -> Corr=-0.5053 | Ratio Var(Y+)/Var(Y_anti): x4.08 (théo 2/(1+rho): x4.04)
Straddle     -> Corr=+0.6429 | Ratio Var(S+)/Var(S_anti): x1.23 (< 2 : perte à coût CPU égal !)
\`\`\`
        `,
        taskMarkdown: `
Implémentez la réduction de variance par variables antithétiques sur $N = 25\\,000$ tirages \`Z = np.random.randn(N)\` ($S_0=100, K=100, r=0.05, \\sigma=0.20, T=1.0$) :

1. Calculez les prix terminaux directs \`S_T1\` (avec $+Z$) et symétriques \`S_T2\` (avec $-Z$), puis les payoffs actualisés \`Y1\` et \`Y2\`.
2. Formez l'estimateur apparié \`Y_anti = 0.5 * (Y1 + Y2)\`.
3. Calculez \`var_standard = float(np.var(Y1))\`, \`var_anti = float(np.var(Y_anti))\` et le facteur d'amélioration \`ratio_reduction = float(var_standard / var_anti)\`.
4. Affichez les deux variances et le ratio obtenu.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\n\n# Implémentez la méthode antithétique et calculez ratio_reduction :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\n\nZ = np.random.randn(N)\ndrift = (r - 0.5 * sigma**2) * T\nvol = sigma * np.sqrt(T)\n\nS_T1 = S0 * np.exp(drift + vol * Z)\nS_T2 = S0 * np.exp(drift - vol * Z)\n\nY1 = np.exp(-r * T) * np.maximum(S_T1 - K, 0.0)\nY2 = np.exp(-r * T) * np.maximum(S_T2 - K, 0.0)\n\nY_anti = 0.5 * (Y1 + Y2)\n\nvar_standard = float(np.var(Y1))\nvar_anti = float(np.var(Y_anti))\nratio_reduction = float(var_standard / var_anti)\n\nprint(f'Variance standard : {var_standard:.4f}')\nprint(f'Variance antithétique : {var_anti:.4f}')\nprint(f'Gain de réduction de variance : x{ratio_reduction:.2f}')",
        testPythonCode: "assert 'var_standard' in globals()\nassert 'var_anti' in globals()\nassert 'ratio_reduction' in globals()\nassert ratio_reduction > 1.5",
        hints: ["S_T1 = S0 * np.exp(drift + vol * Z)", "S_T2 = S0 * np.exp(drift - vol * Z)", "Y_anti = 0.5 * (Y1 + Y2)", "ratio_reduction = float(var_standard / var_anti)"],
        datasets: []
      },
      {
        id: "v2-py-24",
        title: "9. Réduction de Variance II : Variables de Contrôle",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Utilisez le cours terminal du sous-jacent (dont l'espérance est connue analytiquement) comme variable de contrôle.",
        theoryMarkdown: `
### Méthode des Variables de Contrôle : Coefficient Optimal $c^*$ et Gain en $R^2$

#### 🎓 Cours Théorique Approfondi

Si votre échantillon aléatoire a tiré par hasard des cours terminaux $S_T$ légèrement trop élevés par rapport à leur espérance théorique exacte $S_0 e^{rT}$, votre estimation du Call sera également biaisée vers le haut. L'idée de la **variable de contrôle** est d'observer l'erreur de simulation commise sur une variable auxiliaire $Y$ dont l'espérance exacte $\\mathbb{E}[Y]$ est connue analytiquement (ici $Y = e^{-rT}S_T$, avec $\\mathbb{E}^{\\mathbb{Q}}[Y] = S_0$), puis de retrancher cette erreur au payoff d'intérêt $X$.

> 💡 **Démonstration du coefficient optimal $c^* = \\operatorname{Cov}(X, Y) / \\operatorname{Var}(Y)$**
> 
> Pour tout scalaire $c \\in \\mathbb{R}$, définissons l'estimateur contrôlé :
> 
> $$X^*(c) = X - c\\left(Y - \\mathbb{E}[Y]\\right)$$
> 
> 1. **Absence stricte de biais :** $\\mathbb{E}[X^*(c)] = \\mathbb{E}[X] - c(\\mathbb{E}[Y] - \\mathbb{E}[Y]) = \\mathbb{E}[X]$ quel que soit $c$.
> 2. **Minimisation quadratique de la variance :** Développons $g(c) = \\operatorname{Var}(X^*(c))$ :
> 
> $$g(c) = \\operatorname{Var}(X) - 2c \\operatorname{Cov}(X, Y) + c^2 \\operatorname{Var}(Y)$$
> 
> Cette parabole convexe ($g''(c) = 2\\operatorname{Var}(Y) > 0$) atteint son unique minimum global en $g'(c^*) = 0$ :
> 
> $$-2\\operatorname{Cov}(X, Y) + 2 c^* \\operatorname{Var}(Y) = 0 \\implies c^* = \\frac{\\operatorname{Cov}(X, Y)}{\\operatorname{Var}(Y)}$$
> 
> *(Remarquez l'analogie économétrique exacte : $c^*$ est la pente $\\hat{\\beta}_1$ de la régression MCO de $X$ sur $Y$ !)*
> 3. **Variance minimale atteinte :** En substituant $c^*$ dans $g(c)$, avec $\\rho_{XY} = \\frac{\\operatorname{Cov}(X, Y)}{\\sqrt{\\operatorname{Var}(X)\\operatorname{Var}(Y)}}$ :
> 
> $$\\operatorname{Var}(X^*(c^*)) = \\operatorname{Var}(X) - \\frac{\\operatorname{Cov}(X, Y)^2}{\\operatorname{Var}(Y)} = \\operatorname{Var}(X)\\left(1 - \\rho_{XY}^2\\right)$$
> 
> Le pourcentage de variance supprimé est donc exactement le coefficient de détermination **$R^2 = \\rho_{XY}^2$** !

> ✏️ **Application avancée aux options exotiques :**
> 
> En salle de marché, on utilise cette technique pour pricer un **Call asiatique arithmétique** ($X$, sans formule fermée) en prenant comme variable de contrôle le **Call asiatique géométrique** ($Y$, qui possède une formule fermée de Kemna-Vorst). Comme $\\rho_{XY} > 0.999$, la réduction de variance dépasse **$99.8\\%$** (équivalent à simuler $500\\times$ plus de trajectoires) !

#### 💻 Masterclass Python Quantitatif

Points d'implémentation NumPy :
- **Extraction cohérente via \`np.cov(X, Y)\`** : la matrice $2 \\times 2$ retournée contient $\\operatorname{Var}(X)$ en \`[0, 0]\`, $\\operatorname{Cov}(X, Y)$ en \`[0, 1]\` et $\\operatorname{Var}(Y)$ en \`[1, 1]\` calculées avec le même dénominateur \`N - 1\`. D'où \`c_star = cov_mat[0, 1] / cov_mat[1, 1]\`.
- **Signe de $c^*$** : pour un Call ($\\partial X / \\partial S_T > 0$), $c^* > 0$ (proche du Delta moyen) ; pour un Put ($\\partial X / \\partial S_T < 0$), $c^* < 0$ (et par parité Call-Put, $c^*_{\\text{call}} - c^*_{\\text{put}} = 1$).
- **Subtilité statistique** : estimer $c^*$ sur le même échantillon introduit un biais infinitésimal en $\\mathcal{O}(1/N)$ ; sur $N \\ge 10\\,000$, il est négligeable, sinon on estime $c^*$ sur un échantillon pilote indépendant.

\`\`\`python
import numpy as np

np.random.seed(123)
N = 50000
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0
Z = np.random.randn(N)
S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)

# Variable auxiliaire Y = exp(-rT) * S_T dont l'espérance exacte vaut S0 = 100.0
Y_ctrl = np.exp(-r * T) * S_T

for nom, X in [("Call", np.exp(-r * T) * np.maximum(S_T - K, 0.0)),
               ("Put ", np.exp(-r * T) * np.maximum(K - S_T, 0.0))]:
    # Matrice de covariance 2x2 entre le payoff X et la variable de contrôle Y_ctrl
    cov_mat = np.cov(X, Y_ctrl)
    c_opt = cov_mat[0, 1] / cov_mat[1, 1]
    r2 = (cov_mat[0, 1]**2) / (cov_mat[0, 0] * cov_mat[1, 1])
    # Ajustement sans biais de l'erreur d'échantillonnage de Y_ctrl autour de S0
    X_adj = X - c_opt * (Y_ctrl - S0)
    gain_pct = (1.0 - np.var(X_adj, ddof=1) / np.var(X, ddof=1)) * 100.0
    print(f"{nom} | c*={c_opt:+.4f} | R^2={r2*100:.2f}% | Gain var={gain_pct:.2f}% | Prix={np.mean(X_adj):.4f} EUR")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Call | c*=+0.6772 | R^2=85.70% | Gain var=85.70% | Prix=10.4483 EUR
Put  | c*=-0.3228 | R^2=57.65% | Gain var=57.65% | Prix=5.5712 EUR
\`\`\`
        `,
        taskMarkdown: `
À partir des vecteurs \`X\` (payoffs actualisés du Call) et \`Y = np.exp(-r * T) * S_T\` (dont l'espérance théorique sous $\\mathbb{Q}$ vaut exactement $S_0 = 100.0$) déjà générés :

1. Calculez la matrice de covariance \`cov_mat = np.cov(X, Y)\` et extrayez le coefficient optimal \`c_star = cov_mat[0, 1] / cov_mat[1, 1]\`.
2. Construisez la série contrôlée \`X_ctrl = X - c_star * (Y - S0)\`.
3. Calculez le prix estimé \`prix_ctrl = float(np.mean(X_ctrl))\` et le pourcentage de réduction de variance \`pct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)\`.
4. Affichez \`c_star\`, \`prix_ctrl\` et \`pct_gain\`.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\nX = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\nY = np.exp(-r * T) * S_T\n\n# Implémentez la variable de contrôle avec Y et S0 :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\nX = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\nY = np.exp(-r * T) * S_T\n\ncov_mat = np.cov(X, Y)\nc_star = cov_mat[0, 1] / cov_mat[1, 1]\nX_ctrl = X - c_star * (Y - S0)\n\nprix_ctrl = float(np.mean(X_ctrl))\npct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)\n\nprint(f'Coefficient optimal c* : {c_star:.4f}')\nprint(f'Prix avec variable de contrôle : {prix_ctrl:.4f} €')\nprint(f'Réduction de variance obtenue : {pct_gain:.2f}%')",
        testPythonCode: "assert 'c_star' in globals()\nassert 'X_ctrl' in globals()\nassert 'pct_gain' in globals()\nassert pct_gain > 50.0\nassert np.isclose(prix_ctrl, 10.45, atol=0.10)",
        hints: ["cov_mat = np.cov(X, Y)", "c_star = cov_mat[0, 1] / cov_mat[1, 1]", "X_ctrl = X - c_star * (Y - S0)", "pct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)"],
        datasets: []
      },
      {
        id: "v2-py-25",
        title: "10. Pricing d'un Call Asiatique (Option Dépendante du Chemin)",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Évaluez une option asiatique dont le payoff dépend de la moyenne arithmétique continue des cours.",
        theoryMarkdown: `
### Options Exotiques Path-Dependent : Le Call Asiatique à Moyenne Arithmétique

#### 🎓 Cours Théorique Approfondi

Sur les marchés de matières premières (kérosène pour les compagnies aériennes, métaux, électricité) et de devises, une entreprise ne s'expose pas à un cours ponctuel le 31 décembre, mais à un **flux régulier d'achats** tout au long de l'année. De plus, indexer un payoff sur la moyenne des cours empêche toute manipulation du fixing à l'échéance (*pin risk*). C'est le rôle exact des **options asiatiques**.

> 💡 **Formalisation mathématique : Pourquoi aucune formule fermée n'existe**
> 
> Sur une grille discrète $0 = t_0 < t_1 < \\dots < t_M = T$ de pas $\\Delta t = T / M$, le sous-jacent évolue exactement entre deux dates consécutives selon :
> 
> $$S_{t_{k+1}} = S_{t_k} \\exp\\left(\\left(r - \\frac{1}{2}\\sigma^2\\right)\\Delta t + \\sigma\\sqrt{\\Delta t}\\,Z_{k+1}\\right)$$
> 
> Le payoff du **Call Asiatique à moyenne arithmétique** s'écrit :
> 
> $$\\bar{S}_{\\text{arith}} = \\frac{1}{M + 1} \\sum_{k=0}^M S_{t_k}, \\qquad H_{\\text{arith}} = \\max(\\bar{S}_{\\text{arith}} - K, 0)$$
> 
> **Pourquoi Black-Scholes échoue :** Chaque $S_{t_k}$ suit une loi log-normale, mais **la somme de variables log-normales n'est pas log-normale**. Il n'existe donc aucune formule analytique fermée exacte pour le Call arithmétique ! *(À l'inverse, la moyenne géométrique $\\bar{S}_{\\text{géom}} = (\\prod S_{t_k})^{1/(M+1)} = \\exp(\\frac{1}{M+1}\\sum \\ln S_{t_k})$ reste log-normale et vérifie $\\bar{S}_{\\text{géom}} \\le \\bar{S}_{\\text{arith}}$ par inégalité AM-GM, d'où $C_{\\text{géom}} \\le C_{\\text{arith}}$).*
> 
> **Pourquoi $C_{\\text{asiatique}} < C_{\\text{vanille}}$ :** La moyenne lisse les fluctuations extrêmes du sous-jacent. Dans l'approximation brownienne continue, $\\operatorname{Var}\\left(\\frac{1}{T}\\int_0^T W_t\\,dt\\right) = \\frac{T}{3}$, ce qui réduit la volatilité effective d'un facteur $1/\\sqrt{3} \\approx 57.7\\%$ ! Moins de dispersion sur une fonction convexe $x \\mapsto \\max(x - K, 0)$ implique mécaniquement une prime nettement plus faible que celle du Call européen.

#### 💻 Masterclass Python Quantitatif

Maîtriser la **matrice de trajectoires 2D \`(N, M + 1)\`** est la compétence clé du pricing exotique en NumPy :
- **\`Z = np.random.randn(N, M)\`** : $N$ scénarios indépendants en lignes, $M$ pas de temps en colonnes.
- **\`log_paths[:, 1:] = np.cumsum(log_returns, axis=1)\`** : construit les logarithmes cumulés $\\ln(S_{t_k} / S_0)$ en conservant \`log_paths[:, 0] == 0.0\` ($S_0 e^0 = S_0$).
- **\`S_paths = S0 * np.exp(log_paths)\`** : transforme toute la matrice en prix spots en une instruction vectorisée.
- **Comprendre \`axis=1\` vs \`axis=0\`** :
  - \`np.mean(S_paths, axis=1)\` moyenne **horizontalement** le long du temps pour obtenir un vecteur de longueur $N$ (1 moyenne temporelle par trajectoire).
  - \`np.mean(S_paths, axis=0)\` calculerait au contraire l'espérance transversale à chaque date $t_k$ (longueur $M+1$).

\`\`\`python
import numpy as np

np.random.seed(123)
N, M = 10000, 252
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0
dt = T / M

# 1. Matrice 2D des log-rendements sur (N, M) puis cumul temporel sur (N, M+1)
Z = np.random.randn(N, M)
log_inc = (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z
log_paths = np.zeros((N, M + 1))
log_paths[:, 1:] = np.cumsum(log_inc, axis=1)
S_paths = S0 * np.exp(log_paths)

# 2. Moyennes par trajectoire (axis=1) : arithmétique vs géométrique
S_arith = np.mean(S_paths, axis=1)
S_geom = S0 * np.exp(np.mean(log_paths, axis=1))

# 3. Comparaison des prix actualisés : Vanille > Asiatique Arithmétique >= Géométrique
c_van = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0)))
c_ari = float(np.exp(-r * T) * np.mean(np.maximum(S_arith - K, 0.0)))
c_geo = float(np.exp(-r * T) * np.mean(np.maximum(S_geom - K, 0.0)))

print(f"Volatilité terminale : Std(S_T)={np.std(S_paths[:,-1]):.2f} > Std(S_arith)={np.std(S_arith):.2f} > Std(S_geom)={np.std(S_geom):.2f}")
print(f"Call Vanille={c_van:.4f} EUR > Asiatique Arith={c_ari:.4f} EUR >= Asiatique Géom={c_geo:.4f} EUR")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Volatilité terminale : Std(S_T)=21.69 > Std(S_arith)=12.25 > Std(S_geom)=12.11
Call Vanille=10.6337 EUR > Asiatique Arith=5.9365 EUR >= Asiatique Géom=5.7117 EUR
\`\`\`
        `,
        taskMarkdown: `
Simulez $N = 10\\,000$ trajectoires de GBM sur $M = 252$ pas de temps ($S_0 = 100, K = 100, r = 0.05, \\sigma = 0.20, T = 1.0$) :

1. Générez les incréments logarithmiques \`log_returns\` de forme \`(N, M)\`, puis construisez la matrice des trajectoires \`S_paths = S0 * np.exp(log_paths)\` de forme \`(N, M + 1)\` commençant à $S_0$.
2. Calculez la moyenne arithmétique de chaque trajectoire le long du temps : \`S_mean = np.mean(S_paths, axis=1)\`.
3. Évaluez le prix du Call asiatique \`prix_asiatique = float(np.exp(-r * T) * np.mean(np.maximum(S_mean - K, 0.0)))\` et affichez le résultat.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\ndt = T / M\n\n# Simulez la matrice S_paths de dimension (N, M+1) et calculez prix_asiatique :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\ndt = T / M\n\nZ = np.random.randn(N, M)\ndrift = (r - 0.5 * sigma**2) * dt\nvol = sigma * np.sqrt(dt)\nlog_returns = drift + vol * Z\n\nlog_paths = np.zeros((N, M + 1))\nlog_paths[:, 1:] = np.cumsum(log_returns, axis=1)\nS_paths = S0 * np.exp(log_paths)\n\nS_mean = np.mean(S_paths, axis=1)\npayoffs_asiatiques = np.maximum(S_mean - K, 0.0)\nprix_asiatique = float(np.exp(-r * T) * np.mean(payoffs_asiatiques))\n\nprint(f'Prix du Call Asiatique à moyenne arithmétique : {prix_asiatique:.4f} €')\nprint('Note : Le prix asiatique est inférieur au Call vanille (10.45 €) car la moyenne réduit la volatilité effective.')",
        testPythonCode: "assert 'prix_asiatique' in globals()\nassert 'S_mean' in globals()\nassert 5.0 < prix_asiatique < 7.0",
        hints: ["S_paths = S0 * np.exp(log_paths)", "S_mean = np.mean(S_paths, axis=1)", "prix_asiatique = float(np.exp(-r * T) * np.mean(np.maximum(S_mean - K, 0.0)))"],
        datasets: []
      },
      {
        id: "v2-py-26",
        title: "11. Option Barrière Knock-Out (Down-and-Out Call)",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Simulez une option désactivable dès que le cours franchit une barrière inférieure B.",
        theoryMarkdown: `
### Options à Barrière : Clauses Knock-Out, Parité In-Out & Biais de Discrétisation

#### 🎓 Cours Théorique Approfondi

En structuration de produits (Autocalls, Certificats Bonus, Warrants Turbo), les clients souhaitent financer des primes moins chères qu'une option vanille. Pour abaisser le prix d'un Call, l'émetteur y ajoute une **clause désactivante (*Knock-Out*)** : si le sous-jacent baisse jusqu'à toucher ou franchir une barrière inférieure $B < S_0$ à n'importe quel instant entre $0$ et $T$, le contrat est immédiatement annulé. L'investisseur abandonne les scénarios de rebond en « V » après un krach intermédiaire en échange d'une décote sur la prime initiale.

> 💡 **Formalisation mathématique : Parité In-Out & Biais de Surveillance Discrète**
> 
> Soit $M_T^{\\min} = \\min_{0 \\le t \\le T} S_t$ le minimum atteint sur toute la trajectoire.
> - **Down-and-Out Call (DOC)** : reste actif uniquement si le cours demeure strictement au-dessus de $B$ :
> 
> $$H_{\\text{DOC}} = \\max(S_T - K, 0) \\cdot \\mathbb{I}_{\\{ M_T^{\\min} > B \\}}$$
> 
> - **Down-and-In Call (DIC)** : ne s'active que si la barrière $B$ a été touchée ou enfoncée :
> 
> $$H_{\\text{DIC}} = \\max(S_T - K, 0) \\cdot \\mathbb{I}_{\\{ M_T^{\\min} \\le B \\}}$$
> 
> **Identité exacte de non-arbitrage (Parité In-Out) :** Comme $\\mathbb{I}_{\\{M_T^{\\min} > B\\}} + \\mathbb{I}_{\\{M_T^{\\min} \\le B\\}} = 1$, la détention simultanée d'un DOC et d'un DIC réplique exactement le Call vanille :
> 
> $$C_{\\text{DOC}} + C_{\\text{DIC}} = C_{\\text{Vanille}}$$
> 
> **Le piège critique du temps discret (Biais de Broadie-Glasserman-Kou) :**
> Lorsqu'on simule sur une grille discrète de $M$ pas ($S_{t_0}, \\dots, S_{t_M}$), une trajectoire continue peut passer *sous* $B$ entre $t_k$ et $t_{k+1}$ puis remonter avant $t_{k+1}$ sans être détectée ! Le taux de survie simulé diminue donc à mesure que $M$ augmente, ce qui signifie qu'une grille grossière ($M = 12$) **surestime** un Knock-Out continu. *(En production, on applique la correction de continuité $B_{\\text{eff}} = B \\exp(-\\beta\\sigma\\sqrt{\\Delta t})$ avec $\\beta \\approx 0.5826$ ou un test d'excursion par pont brownien.)*

#### 💻 Masterclass Python Quantitatif

Manipulation vectorisée d'événements path-dependent sur matrices 2D \`(N, M + 1)\` :
- **Minimum par trajectoire** : \`S_min = np.min(S_paths, axis=1)\` réduit les $M + 1$ points temporels de chaque ligne à son minimum absolu (vecteur 1D de longueur $N$).
- **Masque booléen vectorisé** : \`actifs_vivants = (S_min > B)\` produit un tableau de \`bool\` (\`True / False\`). En Python/NumPy, multiplier un float par un booléen convertit automatiquement \`True -> 1.0\` et \`False -> 0.0\`.
- **Slicing terminal** : \`S_paths[:, -1]\` extrait la colonne $t_M = T$ pour évaluer $\\max(S_T - K, 0)$, tandis que \`~actifs_vivants\` (opérateur bitwise NOT) sélectionne exactement les contrats activés pour le Down-and-In.

\`\`\`python
import numpy as np

N, S0, K, B, r, sigma, T = 10000, 100.0, 100.0, 85.0, 0.05, 0.20, 1.0

# Comparaison de l'impact de la fréquence d'observation M sur la survie et la parité In-Out
for M_steps in [12, 52, 252]:
    np.random.seed(123)
    dt = T / M_steps
    Z = np.random.randn(N, M_steps)
    log_inc = (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z
    log_paths = np.zeros((N, M_steps + 1))
    log_paths[:, 1:] = np.cumsum(log_inc, axis=1)
    S_paths = S0 * np.exp(log_paths)

    # S_min le long de chaque trajectoire (axis=1) et masque booléen des options vivantes
    alive = np.min(S_paths, axis=1) > B
    payoff_van = np.maximum(S_paths[:, -1] - K, 0.0)
    c_doc = float(np.exp(-r * T) * np.mean(payoff_van * alive))
    c_dic = float(np.exp(-r * T) * np.mean(payoff_van * (~alive)))
    print(f"M={M_steps:3d} pas | Survie={np.mean(alive)*100:5.2f}% | DOC={c_doc:.4f} | DIC={c_dic:.4f} | DOC+DIC={c_doc+c_dic:.4f}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
M= 12 pas | Survie=71.39% | DOC=10.2332 | DIC=0.1778 | DOC+DIC=10.4111
M= 52 pas | Survie=67.34% | DOC=10.2986 | DIC=0.3500 | DOC+DIC=10.6486
M=252 pas | Survie=65.26% | DOC=10.2138 | DIC=0.4199 | DOC+DIC=10.6337
\`\`\`
        `,
        taskMarkdown: `
À partir de $N = 10\\,000$ trajectoires simulées \`S_paths\` ($S_0=100, K=100$, barrière $B=85, r=0.05, \\sigma=0.20, T=1.0, M=252$) :

1. Calculez le minimum atteint par chaque trajectoire : \`S_min = np.min(S_paths, axis=1)\`.
2. Construisez le masque booléen de survie \`actifs_vivants = (S_min > B)\`.
3. Calculez le prix du Down-and-Out Call \`prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants))\` et le pourcentage de survie \`taux_survie = float(np.mean(actifs_vivants) * 100)\`.
4. Affichez \`prix_doc\` et \`taux_survie\`.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, B, r, sigma, T = 100.0, 100.0, 85.0, 0.05, 0.20, 1.0\ndt = T / M\n\n# Simulez les chemins et déterminez prix_doc et taux_survie :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, B, r, sigma, T = 100.0, 100.0, 85.0, 0.05, 0.20, 1.0\ndt = T / M\n\nZ = np.random.randn(N, M)\nlog_inc = (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z\nlog_paths = np.zeros((N, M + 1))\nlog_paths[:, 1:] = np.cumsum(log_inc, axis=1)\nS_paths = S0 * np.exp(log_paths)\n\nS_min = np.min(S_paths, axis=1)\nactifs_vivants = (S_min > B)\npayoffs_doc = np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants\nprix_doc = float(np.exp(-r * T) * np.mean(payoffs_doc))\ntaux_survie = float(np.mean(actifs_vivants) * 100)\n\nprint(f'Prix du Down-and-Out Call (Barrière B={B}) : {prix_doc:.4f} €')\nprint(f'Taux de survie des contrats : {taux_survie:.2f}%')",
        testPythonCode: "assert 'prix_doc' in globals()\nassert 'taux_survie' in globals()\nassert prix_doc < 10.45\nassert 0 < taux_survie < 100",
        hints: ["S_min = np.min(S_paths, axis=1)", "actifs_vivants = (S_min > B)", "prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants))"],
        datasets: []
      },
      {
        id: "v2-py-27",
        title: "12. Modèle de Saut de Merton (Jump-Diffusion)",
        category: "monte_carlo",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Simulez les krachs et discontinuités de cours en superposant un processus de Poisson composé au mouvement brownien.",
        theoryMarkdown: `
### Modèle Jump-Diffusion de Robert Merton (1976) : Processus de Poisson Composé

#### 🎓 Cours Théorique Approfondi

Le modèle de Black-Scholes suppose des trajectoires continues : sur un intervalle court $\\Delta t$, un actif ne peut varier que d'un ordre $\\sigma\\sqrt{\\Delta t}$ et **ne peut jamais sauter** un niveau de prix. Or les marchés financiers connaissent des discontinuités brutales (*gaps* d'ouverture lors de décisions de banques centrales, faillites bancaires ou krachs éclairs), produisant un **skew négatif** (asymétrie à gauche) et du **leptokurtosis** (queues épaisses de rendement, kurtosis $> 3$) que le GBM pur ne sait pas reproduire.

> 💡 **Formalisation mathématique : Processus de Poisson Composé & Compensateur $\\kappa$**
> 
> Robert Merton (1976) superpose au GBM continu un processus de sauts multiplicatifs piloté par un processus de Poisson $N_t \\sim \\text{Poisson}(\\lambda t)$ indépendant de $W_t$ :
> 
> $$\\frac{dS_t}{S_{t^-}} = (\\mu - \\lambda \\kappa) dt + \\sigma dW_t + (Y - 1) dN_t$$
> 
> Lorsqu'un saut survient ($dN_t = 1$), le prix est multiplié par un facteur aléatoire $Y_j > 0$ i.i.d. tel que $\\ln(Y_j) \\sim \\mathcal{N}(\\mu_J, \\sigma_J^2)$.
> 
> **Calcul exact de la compensation de dérive $\\kappa$ :**
> L'amplitude relative moyenne d'un saut vaut :
> 
> $$\\kappa = \\mathbb{E}[Y - 1] = \\mathbb{E}[e^{\\ln Y}] - 1 = \\exp\\left(\\mu_J + \\frac{1}{2}\\sigma_J^2\\right) - 1$$
> 
> Comme $\\mathbb{E}[dN_t] = \\lambda dt$, les sauts apportent une dérive moyenne égale à $\\lambda \\kappa dt$. Sous la mesure risque-neutre $\\mathbb{Q}$, pour que $e^{-rt}S_t$ demeure une martingale ($\\mathbb{E}^{\\mathbb{Q}}[S_T] = S_0 e^{rT}$), il faut soustraire $\\lambda \\kappa$ au drift continu :
> 
> $$S_T = S_0 \\exp\\left( \\left(r - \\lambda\\kappa - \\frac{1}{2}\\sigma^2\\right) T + \\sigma W_T + \\sum_{j=1}^{N_T} \\ln(Y_j) \\right)$$
> 
> **Vérification de la propriété de martingale par conditionnement sur $N_T = n$ :**
> 
> $$\\mathbb{E}\\left[\\exp\\left(\\sum_{j=1}^{N_T} \\ln Y_j\\right)\\right] = \\sum_{n=0}^{\\infty} e^{-\\lambda T} \\frac{(\\lambda T)^n}{n!} (\\mathbb{E}[Y])^n = e^{-\\lambda T} \\sum_{n=0}^{\\infty} \\frac{(\\lambda T (1 + \\kappa))^n}{n!} = e^{\\lambda \\kappa T}$$
> 
> Ce facteur $e^{\\lambda\\kappa T}$ annule exactement $e^{-\\lambda\\kappa T}$ dans le terme de dérive !

![Mouvement Brownien Géométrique vs Modèle de Saut de Merton](/images/theory/fig_gbm_vs_merton_jump.png)

> 🔍 **Comprendre ce graphique : Trajectoire continue vs discontinuités de marché**
> 
> - **Courbe bleue (GBM continu)** : Les cours fluctuent selon une trajectoire continue partout. Même en cas de baisse, le cours ne peut pas « sauter » un niveau de prix sans franchir tous les prix intermédiaires.
> - **Courbe rouge (Merton Jump-Diffusion)** : Deux discontinuités brutales surviennent (chutes quasi-verticales). Ces chocs de Poisson modélisent fidèlement les krachs éclairs (*flash crashes*) et annonces de bénéfices surprises, générant les queues épaisses observées en pratique.

#### 💻 Masterclass Python Quantitatif

Simuler un processus de Poisson composé en Python :
- **\`np.random.poisson(lambda_jump * T, N)\`** génère directement le vecteur de taille $N$ du nombre entier de sauts $k_i \\in \\{0, 1, 2, \\dots\\}$ survenus sur $[0, T]$.
- **Approche par boucle vs Astuce gaussienne 100\\% vectorisée** :
  - Une boucle \`for i in range(N): if nb_sauts[i] > 0: somme_sauts[i] = np.sum(np.random.normal(mu_J, sigma_J, nb_sauts[i]))\` est intuitive et marche pour n'importe quelle loi de saut (Double Exponentielle de Kou, Pareto, etc.).
  - Pour des sauts gaussiens $\\ln Y_j \\sim \\mathcal{N}(\\mu_J, \\sigma_J^2)$, la somme de $k$ gaussiennes i.i.d. suit exactement $\\mathcal{N}(k\\mu_J, k\\sigma_J^2)$ ! On peut donc la simuler **sans aucune boucle** en 1 ligne : \`nb_sauts * mu_J + np.sqrt(nb_sauts) * sigma_J * np.random.randn(N)\`.
- **Log-rendements vs Prix** : en économétrie des séries financières, l'asymétrie négative (*skewness*) et les queues épaisses (*kurtosis* $> 3$) du modèle de Merton se mesurent idéalement sur les **log-rendements** $\\ln(S_T / S_0)$ (sous GBM pur, le log-rendement est strictement gaussien de skewness $0$ et kurtosis $3$).

\`\`\`python
import numpy as np

np.random.seed(123)
N = 50000
S0, r, sigma, T = 100.0, 0.05, 0.15, 1.0
lam, mu_J, sig_J = 0.75, -0.15, 0.10

# Compensateur de martingale kappa = E[Y - 1]
kappa = np.exp(mu_J + 0.5 * sig_J**2) - 1.0

# 1. Diffusion continue commune (GBM pur)
Z = np.random.randn(N)
S_gbm = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)

# 2. Processus de Poisson composé 100% vectorisé : somme de k N(mu_J, sig_J^2) ~ N(k*mu_J, k*sig_J^2)
nb_sauts = np.random.poisson(lam * T, N)
somme_sauts = nb_sauts * mu_J + np.sqrt(nb_sauts) * sig_J * np.random.randn(N)
S_merton = S0 * np.exp((r - lam * kappa - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z + somme_sauts)

# 3. Audit : espérance martingale et moments d'ordre 3 & 4 des log-rendements
for label, arr in [("GBM Pur", S_gbm), ("Merton ", S_merton)]:
    lr = np.log(arr / S0)
    z_lr = (lr - np.mean(lr)) / np.std(lr)
    print(f"{label} | E[S_T]={np.mean(arr):.2f} (théo {S0*np.exp(r*T):.2f}) | Skew={np.mean(z_lr**3):+.3f} | Kurtosis={np.mean(z_lr**4):.3f}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
GBM Pur | E[S_T]=105.23 (théo 105.13) | Skew=+0.013 | Kurtosis=2.992
Merton  | E[S_T]=105.34 (théo 105.13) | Skew=-0.597 | Kurtosis=3.777
\`\`\`
        `,
        taskMarkdown: `
Simulez $N = 20\\,000$ prix terminaux à $T = 1.0$ an sous le modèle Jump-Diffusion de Merton ($S_0=100, r=0.05, \\sigma=0.15, \\lambda=0.75, \\mu_J=-0.15, \\sigma_J=0.10$) :

1. Calculez le terme compensateur \`kappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0\` et le drift corrigé \`drift_corr = (r - lambda_jump * kappa - 0.5 * sigma**2) * T\`.
2. Tirez le nombre de sauts par scénario \`nb_sauts = np.random.poisson(lambda_jump * T, N)\` et cumulez les log-sauts \`somme_sauts\` ($\\mathcal{N}(\\mu_J, \\sigma_J^2)$).
3. Calculez les prix finaux \`S_T_merton\`, puis leur kurtosis standardisé \`kurtosis_merton = float(np.mean(((S_T_merton - np.mean(S_T_merton))/np.std(S_T_merton))**4))\` et affichez le résultat.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 20000\nS0, r, sigma, T = 100.0, 0.05, 0.15, 1.0\nlambda_jump = 0.75\nmu_J = -0.15\nsigma_J = 0.10\n\n# Simulez S_T_merton et calculez son Kurtosis :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 20000\nS0, r, sigma, T = 100.0, 0.05, 0.15, 1.0\nlambda_jump = 0.75\nmu_J = -0.15\nsigma_J = 0.10\n\nkappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0\ndrift_corr = (r - lambda_jump * kappa - 0.5 * sigma**2) * T\n\nZ = np.random.randn(N)\nnb_sauts = np.random.poisson(lambda_jump * T, N)\n\nsomme_sauts = np.zeros(N)\nfor i in range(N):\n    if nb_sauts[i] > 0:\n        somme_sauts[i] = np.sum(np.random.normal(mu_J, sigma_J, nb_sauts[i]))\n\nS_T_merton = S0 * np.exp(drift_corr + sigma * np.sqrt(T) * Z + somme_sauts)\nz_merton = (S_T_merton - np.mean(S_T_merton)) / np.std(S_T_merton)\nkurtosis_merton = float(np.mean(z_merton**4))\n\nprint(f'Kurtosis sous Merton Jump-Diffusion : {kurtosis_merton:.4f}')\nprint(f'Excès de Kurtosis (Queues épaisses) : {kurtosis_merton - 3.0:.4f}')",
        testPythonCode: "assert 'S_T_merton' in globals()\nassert 'kurtosis_merton' in globals()\nassert kurtosis_merton > 3.05",
        hints: ["kappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0", "nb_sauts = np.random.poisson(lambda_jump * T, N)", "S_T_merton = S0 * np.exp(drift_corr + sigma * np.sqrt(T) * Z + somme_sauts)"],
        datasets: []
      },
      {
        id: "v2-py-28",
        title: "13. Value-at-Risk de Portefeuille Non Linéaire par Full Revaluation",
        category: "financial_econometrics",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Estimez la VaR d'un book composé d'actions et d'options par réévaluation complète Monte Carlo.",
        theoryMarkdown: `
### Full Revaluation Monte Carlo : Limites de la VaR Delta-Gamma sur Positions Gamma-Négatives

#### 🎓 Cours Théorique Approfondi

Sous Bâle III (FRTB), la mesure des risques de marché sur un portefeuille contenant des dérivés (options vendues, barrières, produits structurés) ne peut plus se contenter d'une matrice de sensibilités linéaires. Dès qu'un book porte de la **convexité négative (Short Gamma)** — comme un *Covered Call*, une vente de *Put OTM* ou un *Short Straddle* —, ses pertes s'accélèrent violemment lors des chocs de queue que la VaR paramétrique ignore.

> 💡 **Pourquoi Delta-Normale et Delta-Gamma échouent face au Full Revaluation**
> 
> Le développement de Taylor de la variation de valeur d'un portefeuille $V(t, S)$ sur un pas $\\Delta t$ vaut :
> 
> $$\\Delta V \\approx \\Delta \\cdot \\Delta S + \\frac{1}{2} \\Gamma \\cdot (\\Delta S)^2 + \\Theta \\cdot \\Delta t$$
> 
> 1. **Faillite de la VaR Delta-Normale ($\\Delta V \\approx \\Delta \\cdot \\Delta S$)** : Pour un *Short Straddle* delta-neutre ($\\Delta \\approx 0$), la VaR Delta-Normale prédit un risque quasi-nul alors que le vendeur perd sur tout fort mouvement haussier ou baissier ! Pour une vente de Put OTM ($\\Gamma < 0$), elle suppose une perte linéaire et sous-estime massivement la queue gauche.
> 2. **Limites de la VaR Delta-Gamma sur grands chocs** : L'approximation quadratique est **purement locale autour de $S_0$**. Sur une vente de Put OTM ($K < S_0$), $\\Gamma_0$ est encore modeste en $S_0$, mais lorsque le spot chute vers le strike $K$, le Gamma négatif explose ($\\text{Speed} = \\frac{\\partial \\Gamma}{\\partial S} > 0$) : la parabole de Taylor sous-estime alors encore le risque extrême ! Inversement, à l'approche de l'échéance où le payoff devient linéaire par morceaux (kink en $K$), la parabole quadratique surestime localement la courbure loin de $S_0$.
> 3. **Méthode de Référence (Full Revaluation Monte Carlo)** : On simule $N$ scénarios complets $S_h^{(i)}$, on applique le pricer **exact** $V(S_h^{(i)})$ (sans approximation de Taylor), puis on calcule les pertes $L^{(i)} = V_0 - V(S_h^{(i)})$ :
> 
> $$\\operatorname{VaR}_{99\\%} = q_{0.99}(L), \\qquad \\operatorname{ES}_{99\\%} = \\mathbb{E}\\left[L \\mid L \\ge \\operatorname{VaR}_{99\\%}\\right]$$

> ✏️ **Lien Réglementaire (VaR vs Expected Shortfall) :**
> 
> La $\\operatorname{VaR}_{99\\%}$ ne mesure que le *seuil* franchi dans les $1\\%$ pires scénarios, sans indiquer la gravité moyenne de la perte au-delà de ce seuil. C'est pourquoi Bâle III / FRTB privilégie désormais l'**Expected Shortfall ($\\operatorname{ES}$)**, mesure de risque sous-additive et sensible aux pertes extrêmes (*tail risk*).

#### 💻 Masterclass Python Quantitatif

Bonnes pratiques de calcul de VaR sur portefeuille mixte :
- **Convention de signe des pertes** : en définissant \`pertes = V0 - V_T\`, une perte financière est **positive** ; la VaR à $99\\%$ correspond donc au **99ème percentile haut** \`np.percentile(pertes, 99)\` (et non au 1er percentile).
- **Expected Shortfall en une ligne** : \`pertes[pertes >= var99].mean()\` sélectionne par indexation booléenne les $1\\%$ pires scénarios de queue et calcule leur moyenne conditionnelle.
- **Comparaison chiffrée** : le script ci-dessous compare sur une vente de $10$ Puts OTM ($K = 88$, horizon Bâle $h = 10$ jours) la VaR Delta-Normale, la VaR Delta-Gamma et la VaR Full Revaluation exacte.

\`\`\`python
import numpy as np
from scipy.stats import norm

def bs_put(S, K, r, sigma, T):
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

np.random.seed(123)
N = 50000
S0, K, T_opt, h, r, sigma = 100.0, 88.0, 0.25, 10.0 / 252.0, 0.04, 0.22

# Book Short Gamma : vente à découvert de 10 Puts OTM (K=88, maturité 3 mois, horizon VaR 10j)
V0 = -10.0 * bs_put(S0, K, r, sigma, T_opt)
d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T_opt) / (sigma * np.sqrt(T_opt))
delta = -10.0 * (norm.cdf(d1) - 1.0)
gamma = -10.0 * norm.pdf(d1) / (S0 * sigma * np.sqrt(T_opt))

# Scénarios de marché à h = 10 jours puis réévaluation complète vs Taylor ordre 1 et 2
S_h = S0 * np.exp((r - 0.5 * sigma**2) * h + sigma * np.sqrt(h) * np.random.randn(N))
dS = S_h - S0
V_h = -10.0 * bs_put(S_h, K, r, sigma, T_opt - h)

L_full = V0 - V_h
L_dn = -(delta * dS)
L_dg = -(delta * dS + 0.5 * gamma * dS**2)
var99 = float(np.percentile(L_full, 99))
es99 = float(L_full[L_full >= var99].mean())

print(f"Short 10 Puts OTM (K=88, h=10j) | Delta={delta:+.3f} | Gamma={gamma:+.4f}")
print(f"VaR 99% Delta-Normale : {np.percentile(L_dn, 99):6.2f} EUR (sous-estime de {(1 - np.percentile(L_dn,99)/var99)*100:.1f}%)")
print(f"VaR 99% Delta-Gamma   : {np.percentile(L_dg, 99):6.2f} EUR")
print(f"VaR 99% Full Reval MC : {var99:6.2f} EUR | ES 99% : {es99:6.2f} EUR")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Short 10 Puts OTM (K=88, h=10j) | Delta=+0.954 | Gamma=-0.1542
VaR 99% Delta-Normale :   9.18 EUR (sous-estime de 46.4%)
VaR 99% Delta-Gamma   :  16.33 EUR
VaR 99% Full Reval MC :  17.15 EUR | ES 99% :  22.22 EUR
\`\`\`
        `,
        taskMarkdown: `
Soit un portefeuille Covered Call composé de $10$ actions ($S_0 = 100$) et de la vente à découvert de $10$ Calls ($K = 105$, prime initiale $C_0 = 7.50\\text{ EUR}$), soit $V_0 = 10 \\times 100 - 10 \\times 7.50 = 925.0\\text{ EUR}$ ($T = 0.25, r = 0.04, \\sigma = 0.22, N = 25\\,000$) :

1. Simulez les cours à échéance \`S_T\` par GBM exact à partir de \`Z = np.random.randn(N)\`.
2. Réévaluez intégralement le portefeuille sur chaque scénario : \`call_payoffs = np.maximum(S_T - K, 0.0)\` puis \`V_T = 10.0 * S_T - 10.0 * call_payoffs\`.
3. Calculez les pertes \`pertes = V0 - V_T\` et extrayez la VaR à $99\\%$ : \`var_mc_99 = float(np.percentile(pertes, 99))\`.
4. Affichez \`V0\`, \`var_mc_99\` et la perte relative \`var_mc_99 / V0\`.
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, T, r, sigma = 100.0, 105.0, 0.25, 0.04, 0.22\nV0 = 10.0 * S0 - 10.0 * 7.50\n\n# Simulez S_T, calculez V_T, les pertes L et la VaR 99% :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, T, r, sigma = 100.0, 105.0, 0.25, 0.04, 0.22\nV0 = 10.0 * S0 - 10.0 * 7.50\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\ncall_payoffs = np.maximum(S_T - K, 0.0)\nV_T = 10.0 * S_T - 10.0 * call_payoffs\npertes = V0 - V_T\n\nvar_mc_99 = float(np.percentile(pertes, 99))\n\nprint(f'Valeur initiale du portefeuille : {V0:.2f} €')\nprint(f'Value-at-Risk 99% (Full Revaluation) : {var_mc_99:.2f} €')\nprint(f'Perte maximale relative à 99% : {var_mc_99 / V0:.2%}')",
        testPythonCode: "assert 'var_mc_99' in globals()\nassert 'pertes' in globals()\nassert var_mc_99 > 145.0",
        hints: ["call_payoffs = np.maximum(S_T - K, 0.0)", "V_T = 10.0 * S_T - 10.0 * call_payoffs", "pertes = V0 - V_T", "var_mc_99 = float(np.percentile(pertes, 99))"],
        datasets: []
      },
      {
        id: "v2-py-29",
        title: "14. Modèle de Taux d'Intérêt Stochastiques de Vasicek",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 10,
        description: "Simulez le taux court instantané r(t) avec retour à la moyenne (Processus d'Ornstein-Uhlenbeck).",
        theoryMarkdown: `
### Modélisation des Taux Courts : Processus d'Ornstein-Uhlenbeck (Vasicek 1977)

#### 🎓 Cours Théorique Approfondi

Contrairement au cours d'une action qui croît exponentiellement en tendance, un taux d'intérêt ne peut ni tendre vers $+\\infty$ ni dériver indéfiniment : sous l'action des banques centrales et des cycles d'inflation, les taux oscillent autour d'un niveau d'équilibre macroéconomique $\\theta$ grâce à une **force de rappel élastique**. Le modèle d'Oldrich Vasicek (1977) est la pierre angulaire de la valorisation obligataire et des modèles ALM de taux.

> 💡 **Résolution analytique du processus d'Ornstein-Uhlenbeck & Moments conditionnels**
> 
> Le taux court instantané $r_t$ suit l'EDS :
> 
> $$dr_t = \\kappa (\\theta - r_t) dt + \\sigma dW_t$$
> 
> où $\\theta$ est le niveau d'équilibre long terme, $\\kappa > 0$ la vitesse de rappel (*mean reversion speed*, demi-vie $t_{1/2} = \\frac{\\ln 2}{\\kappa}$) et $\\sigma$ la volatilité absolue en points de base.
> 
> **Résolution exacte par facteur intégrant $e^{\\kappa t}$ :** Posons $Y_t = e^{\\kappa t} r_t$. Comme $e^{\\kappa t}$ est déterministe à variation finie :
> 
> $$d(e^{\\kappa t} r_t) = \\kappa e^{\\kappa t} r_t dt + e^{\\kappa t} dr_t = \\kappa \\theta e^{\\kappa t} dt + \\sigma e^{\\kappa t} dW_t$$
> 
> En intégrant entre $0$ et $t$, puis en multipliant par $e^{-\\kappa t}$, on obtient la solution exacte gaussienne :
> 
> $$r_t = r_0 e^{-\\kappa t} + \\theta\\left(1 - e^{-\\kappa t}\\right) + \\sigma \\int_0^t e^{-\\kappa(t - s)} dW_s$$
> 
> Par propriété de martingale de l'intégrale d'Itô et par isométrie d'Itô, ses deux moments conditionnels exacts valent :
> 
> $$\\mathbb{E}[r_t \\mid r_0] = r_0 e^{-\\kappa t} + \\theta\\left(1 - e^{-\\kappa t}\\right) \\xrightarrow[t \\to \\infty]{} \\theta$$
> 
> $$\\operatorname{Var}(r_t \\mid r_0) = \\sigma^2 \\int_0^t e^{-2\\kappa(t - s)} ds = \\frac{\\sigma^2}{2\\kappa}\\left(1 - e^{-2\\kappa t}\\right) \\xrightarrow[t \\to \\infty]{} \\frac{\\sigma^2}{2\\kappa}$$
> 
> **Schéma numérique d'Euler-Maruyama :** Pour les EDS sans solution fermée (ou pour une simulation pas-à-pas générique), on discrétise directement l'EDS sur pas $\\Delta t$ :
> 
> $$r_{t + \\Delta t} = r_t + \\kappa(\\theta - r_t)\\Delta t + \\sigma\\sqrt{\\Delta t}\\,Z_t, \\qquad Z_t \\sim \\mathcal{N}(0, 1)$$

> ✏️ **Propriété ALM / Risk (Taux Négatifs vs CIR) :**
> 
> Comme $r_t$ est gaussien dans le modèle de Vasicek, $\\mathbb{P}(r_t < 0) > 0$ (un atout majeur pour modéliser les taux européens négatifs de 2014–2022, mais problématique si l'on souhaite garantir $r_t \\ge 0$, auquel cas on utilise le modèle racine carrée de Cox-Ingersoll-Ross $dr_t = \\kappa(\\theta - r_t)dt + \\sigma\\sqrt{r_t}dW_t$).

![Processus de Vasicek et Retour à la Moyenne](/images/theory/fig_vasicek_mean_reversion.png)

> 🔍 **Comprendre ce graphique : La force de rappel vers l'équilibre long terme**
> 
> - **Ligne rouge pointillée ($\\theta = 3.5\\%$)** : Le taux d'équilibre macroéconomique vers lequel le système converge.
> - **Point de départ ($r_0 = 1.0\\%$)** : Les taux courts débutent en territoire historiquement bas.
> - **Convergence progressive des scénarios** : Même si le bruit stochastique $\\sigma dW_t$ génère des fluctuations erratiques, le drift $\\kappa(\\theta - r_t)$ tire continuellement les trajectoires vers le haut. À l'horizon 5 ans, la distribution se stabilise dans une bande stationnaire autour de $\\theta$.

#### 💻 Masterclass Python Quantitatif

Pourquoi utiliser une boucle temporelle \`for t in range(N):\` vectorisée sur $M$ :
- **Dépendance d'état du drift** : contrairement au GBM où les log-rendements étaient indépendants, ici l'incrément à la date $t$ dépend de la position courante $r_t$ via $\\kappa(\\theta - r_t)$. On itère donc séquentiellement sur les $N$ pas de temps, mais chaque itération met à jour **en une seule opération vectorielle** les $M$ trajectoires simultanément via \`Z = np.random.randn(M)\`.
- **Audit de discrétisation** : comparer la moyenne et l'écart-type simulés à $T = 5$ ans avec les moments analytiques exacts permet de vérifier immédiatement que le pas $\\Delta t$ est suffisamment fin.

\`\`\`python
import numpy as np

np.random.seed(123)
r0, theta, kappa, sigma, T, N_pas, M = 0.01, 0.035, 0.50, 0.015, 5.0, 500, 1000
dt = T / N_pas

# Matrice (M, N_pas + 1) initialisée à r0 sur la colonne 0
r_paths = np.zeros((M, N_pas + 1))
r_paths[:, 0] = r0

# Boucle temporelle sur N_pas, mais vectorisée sur les M scénarios à chaque pas
for t in range(N_pas):
    Z = np.random.randn(M)
    r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z

# Comparaison avec les moments conditionnels analytiques exacts du processus O-U
esp_exact = r0 * np.exp(-kappa * T) + theta * (1.0 - np.exp(-kappa * T))
std_exact = np.sqrt((sigma**2 / (2.0 * kappa)) * (1.0 - np.exp(-2.0 * kappa * T)))

print(f"Demi-vie ln(2)/kappa = {np.log(2)/kappa:.2f} ans | Cible long terme theta = {theta:.2%}")
print(f"T={T} ans -> Moyenne sim: {np.mean(r_paths[:, -1]):.4%} (analytique: {esp_exact:.4%})")
print(f"T={T} ans -> Écart-type sim: {np.std(r_paths[:, -1], ddof=1):.4%} (analytique: {std_exact:.4%})")
print(f"Trajectoires passant sous 0% : {np.mean(np.min(r_paths, axis=1) < 0):.2%}")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Demi-vie ln(2)/kappa = 1.39 ans | Cible long terme theta = 3.50%
T=5.0 ans -> Moyenne sim: 3.2952% (analytique: 3.2948%)
T=5.0 ans -> Écart-type sim: 1.5649% (analytique: 1.4949%)
Trajectoires passant sous 0% : 35.30%
\`\`\`

Dans le graphique Matplotlib de votre exercice, les 5 trajectoires issues de \`1.0%\` remontent progressivement vers la ligne rouge horizontale \`theta = 3.5%\` tout en oscillant dans un corridor stationnaire de volatilité bornée.
        `,
        taskMarkdown: `
Simulez $M = 100$ trajectoires de taux courts sur $T = 5.0$ ans ($N = 500$ pas de temps, $\\Delta t = T / N$) selon le processus de Vasicek ($r_0 = 0.01, \\theta = 0.035, \\kappa = 0.50, \\sigma = 0.015$) :

1. Initialisez \`r_paths = np.zeros((M, N + 1))\` avec \`r_paths[:, 0] = r0\`.
2. Appliquez le schéma d'Euler-Maruyama pas à pas sur \`t in range(N)\` avec \`Z = np.random.randn(M)\`.
3. Calculez la moyenne finale des taux à l'horizon 5 ans : \`moyenne_finale_taux = float(np.mean(r_paths[:, -1]))\`.
4. Tracez les 5 premières trajectoires en pourcentage (\`r_paths[i] * 100\`) et la droite cible \`theta * 100\`, puis affichez \`moyenne_finale_taux\`.
        `,
        initialCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nr0 = 0.01\ntheta = 0.035\nkappa = 0.50\nsigma = 0.015\nT = 5.0\nN = 500\ndt = T / N\nM = 100\n\n# Simulez r_paths de dimension (M, N+1) avec Euler-Maruyama :\n",
        solutionCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nr0 = 0.01\ntheta = 0.035\nkappa = 0.50\nsigma = 0.015\nT = 5.0\nN = 500\ndt = T / N\nM = 100\n\nr_paths = np.zeros((M, N + 1))\nr_paths[:, 0] = r0\n\nfor t in range(N):\n    Z = np.random.randn(M)\n    r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z\n\nmoyenne_finale_taux = float(np.mean(r_paths[:, -1]))\n\ntemps = np.linspace(0, T, N + 1)\nplt.figure(figsize=(6, 3.5))\nfor i in range(5):\n    plt.plot(temps, r_paths[i] * 100, lw=1.2, alpha=0.8)\nplt.axhline(theta * 100, color='#e11d48', ls='--', lw=2, label=f'Moyenne cible theta ({theta:.1%})')\nplt.xlabel('Horizon (années)')\nplt.ylabel('Taux court (%)')\nplt.title('Modèle de Taux de Vasicek (Ornstein-Uhlenbeck)')\nplt.legend()\nplt.grid(True, alpha=0.3)\n\nprint(f'Taux moyen final simulé à 5 ans : {moyenne_finale_taux:.4%}')\nprint(f'Niveau d équilibre théorique theta : {theta:.4%}')",
        testPythonCode: "assert 'r_paths' in globals()\nassert 'moyenne_finale_taux' in globals()\nassert np.isclose(moyenne_finale_taux, theta, atol=0.01)",
        hints: ["r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z", "moyenne_finale_taux = float(np.mean(r_paths[:, -1]))"],
        datasets: []
      },
      {
        id: "v2-py-30",
        title: "15. Stress-Testing Monte Carlo & Processus de Ruine de Lundberg",
        category: "pricing",
        language: "python",
        difficulty: "Avancé",
        durationMinutes: 12,
        description: "Évaluez la probabilité de ruine d'une institution financière confrontée à des chocs de sinistralité stochastiques.",
        theoryMarkdown: `
### Théorie Actuarielle de la Ruine de Cramér-Lundberg & Norme Solvabilité II

#### 🎓 Cours Théorique Approfondi

Au cœur de l'actuariat non-vie et de la régulation prudentielle européenne (**Solvabilité II**, Directive 2009/138/CE), le modèle collectif de **Filip Lundberg (1903) et Harald Cramér (1930)** décrit la dynamique stochastique des réserves d'un assureur confronté simultanément à un flux continu de primes et à des sinistres aléatoires en fréquence et en sévérité.

> 💡 **Formalisation du Processus de Surplus, Chargement de Sécurité & Norme Solvabilité II**
> 
> Le capital libre (surplus) $U_t$ d'une compagnie évolue selon :
> 
> $$U_t = u + c \\cdot t - S_t, \\qquad S_t = \\sum_{i=1}^{N_t} X_i$$
> 
> - $u > 0$ : fonds propres initiaux de réserve.
> - $c > 0$ : taux annuel d'encaissement des primes commerciales.
> - $N_t \\sim \\text{Poisson}(\\lambda t)$ : nombre aléatoire de sinistres sur $[0, t]$.
> - $X_i \\stackrel{\\text{i.i.d.}}{\\sim} \\text{Exp}$ (de moyenne $\\mu = \\mathbb{E}[X_i]$) : coût unitaire aléatoire des sinistres, indépendant de $N_t$.
> 
> **Moments composés (Formules de Wald) :**
> 
> $$\\mathbb{E}[S_t] = \\lambda t \\mu, \\qquad \\operatorname{Var}(S_t) = \\lambda t \\mathbb{E}[X_1^2] = 2 \\lambda t \\mu^2 \\quad (\\text{pour } X_1 \\sim \\text{Exp})$$
> 
> **Condition de profit net & Chargement de sécurité $\\eta$ :**
> Si $c \\le \\lambda \\mu$, la ruine survient avec probabilité $1$ en horizon infini. L'assureur doit donc facturer une prime pure majorée d'un chargement $\\eta > 0$ tel que $c = (1 + \\eta)\\lambda\\mu$. *(Avec $\\lambda = 5$, $\\mu = 15\\,000\\text{ EUR}$ et $c = 80\\,000\\text{ EUR}$, la prime pure vaut $75\\,000\\text{ EUR}$ et $\\eta = \\frac{5\\,000}{75\\,000} \\approx 6.67\\%$.)*
> 
> **Probabilité de ruine & Inégalité de Lundberg :**
> La probabilité de ruine en temps infini $\\psi(u) = \\mathbb{P}(\\exists t > 0 : U_t < 0)$ vérifie la borne exponentielle $\\psi(u) \\le e^{-R u}$ (exacte dans le cas exponentiel : $\\psi_\\infty(u) = \\frac{1}{1+\\eta} \\exp(-\\frac{\\eta}{1+\\eta}\\frac{u}{\\mu})$).
> 
> **Exigence réglementaire Solvabilité II (Pilier 1) :**
> Le **SCR (*Solvency Capital Requirement*)** correspond au niveau de capital initial $u$ garantissant que la probabilité de ruine à horizon **1 an** soit strictement inférieure au seuil prudentiel de **$0.5\\%$** (niveau de confiance $99.5\\%$, soit un événement bicentenaire) :
> 
> $$\\mathbb{P}(\\text{ruine sur } [0, 1]) < 0.5\\%$$

> ✏️ **Nuance Actuarielle Critique (Ruine à $T=1$ vs Ruine Infra-Annuelle) :**
> 
> Vérifier seulement $U_1 < 0$ à la fin de l'année peut **sous-estimer** le risque réel ! Si plusieurs gros sinistres frappent dès février alors que seulement $\\frac{2}{12} c$ de primes ont été encaissés, la compagnie fait faillite en cours d'année ($\\inf_{0 \\le t \\le 1} U_t < 0$) même si les primes d'été l'auraient théoriquement remise à flot en décembre.

#### 💻 Masterclass Python Quantitatif

Points d'attention en actuariat sous NumPy :
- **Le piège classique de \`np.random.exponential(scale)\`** : contrairement à certains manuels qui paramètrent la loi exponentielle par son taux $\\theta = 1/\\mu$, NumPy prend le **paramètre d'échelle \`scale\` égal à la moyenne $\\mu$** (\`cout_moyen = 15000.0\`). Passer \`1/15000\` produirait des sinistres minuscules et fausserait totalement la solvabilité !
- **Calibration directe du SCR à $99.5\\%$** : \`np.percentile(charges - c, 99.5)\` estime en une seule ligne le capital initial minimum requis pour respecter le seuil réglementaire $\\mathbb{P}(\\text{ruine}) < 0.5\\%$ sur l'année.
- **Modélisation infra-annuelle** : grâce à la propriété conditionnelle du processus de Poisson (sachant $N_1 = k$, les instants de sinistres sont uniformes ordonnés sur $[0, 1]$), \`instants = np.sort(np.random.uniform(0.0, 1.0, k))\` permet de détecter instantanément toute faillite en cours d'année.

\`\`\`python
import numpy as np

np.random.seed(123)
N_sim = 50000
# Stress-test avec un capital volontairement tendu (u = 120 000 EUR) pour mesurer l'écart infra-annuel
u, c, lam_sin, cout_moy = 120000.0, 80000.0, 5.0, 15000.0
eta = (c / (lam_sin * cout_moy)) - 1.0

nb_sin = np.random.poisson(lam_sin, N_sim)
charges = np.zeros(N_sim)
ruine_infra = np.zeros(N_sim, dtype=bool)

for i in range(N_sim):
    k = nb_sin[i]
    if k > 0:
        # Attention : np.random.exponential attend l'échelle = moyenne (cout_moy)
        couts = np.random.exponential(cout_moy, k)
        charges[i] = np.sum(couts)
        # Instants d'arrivée ordonnés sur [0, 1] pour détecter la ruine infra-annuelle
        instants = np.sort(np.random.uniform(0.0, 1.0, k))
        if np.any(u + c * instants - np.cumsum(couts) < 0.0):
            ruine_infra[i] = True

ruine_fin = (u + c - charges) < 0.0
scr_995 = float(np.percentile(charges - c, 99.5))

print(f"Chargement eta = {eta:.2%} | Charge moy: {np.mean(charges):,.0f} EUR (théo {lam_sin*cout_moy:,.0f} EUR)")
print(f"Ruine en fin d'année P(U_1 < 0)     : {np.mean(ruine_fin):.3%}")
print(f"Ruine infra-annuelle P(inf U_t < 0) : {np.mean(ruine_infra):.3%}")
print(f"SCR Solvabilité II (99.5% à 1 an)   : {scr_995:,.0f} EUR (vs u={u:,.0f} EUR)")
\`\`\`

#### 🖥️ Exemple Exécuté (\`python3\`)

\`\`\`text
Chargement eta = 6.67% | Charge moy: 74,833 EUR (théo 75,000 EUR)
Ruine en fin d'année P(U_1 < 0)     : 1.606%
Ruine infra-annuelle P(inf U_t < 0) : 2.564%
SCR Solvabilité II (99.5% à 1 an)   : 153,390 EUR (vs u=120,000 EUR)
\`\`\`
        `,
        taskMarkdown: `
Simulez un stress-test actuariel de Cramér-Lundberg sur $N_{\\text{scenarios}} = 10\\,000$ années avec capital initial $u = 500\\,000\\text{ EUR}$, primes annuelles $c = 80\\,000\\text{ EUR/an}$, intensité $\\lambda = 5.0$ sinistres/an et coût moyen exponentiel \`cout_moyen = 15000.0\` :

1. Générez le nombre annuel de sinistres par scénario : \`nb_sinistres = np.random.poisson(lambda_sin, N_scenarios)\`.
2. Pour chaque scénario $i$, cumulez la charge sinistre exponentielle (\`np.random.exponential(cout_moyen, nb_sinistres[i])\`) dans \`charge_totale[i]\`.
3. Calculez le surplus de fin d'année \`capital_fin = u + c - charge_totale\`, le vecteur booléen \`ruine_detectee = (capital_fin < 0)\` et la probabilité de ruine \`proba_ruine = float(np.mean(ruine_detectee))\`.
4. Affichez la charge moyenne, \`proba_ruine\` et vérifiez la conformité Solvabilité II (\`proba_ruine < 0.005\`).
        `,
        initialCode: "import numpy as np\n\nnp.random.seed(42)\nN_scenarios = 10000\nu = 500000.0\nc = 80000.0\nlambda_sin = 5.0\ncout_moyen = 15000.0\n\n# Simulez les scénarios et déterminez proba_ruine :\n",
        solutionCode: "import numpy as np\n\nnp.random.seed(42)\nN_scenarios = 10000\nu = 500000.0\nc = 80000.0\nlambda_sin = 5.0\ncout_moyen = 15000.0\n\nnb_sinistres = np.random.poisson(lambda_sin, N_scenarios)\ncharge_totale = np.zeros(N_scenarios)\n\nfor i in range(N_scenarios):\n    if nb_sinistres[i] > 0:\n        charge_totale[i] = np.sum(np.random.exponential(cout_moyen, nb_sinistres[i]))\n\ncapital_fin = u + c - charge_totale\nruine_detectee = (capital_fin < 0)\nproba_ruine = float(np.mean(ruine_detectee))\n\nprint(f'Capital initial : {u:,.2f} €')\nprint(f'Charge moyenne annuelle des sinistres : {np.mean(charge_totale):,.2f} €')\nprint(f'Probabilité empirique de ruine : {proba_ruine:.4%}')\nprint(f'Conformité Solvabilité II (< 0.5%) : {proba_ruine < 0.005}')",
        testPythonCode: "assert 'proba_ruine' in globals()\nassert 'capital_fin' in globals()\nassert 0 <= proba_ruine < 0.05",
        hints: ["nb_sinistres = np.random.poisson(lambda_sin, N_scenarios)", "capital_fin = u + c - charge_totale", "proba_ruine = float(np.mean(capital_fin < 0))"],
        datasets: []
      },
    ]
  };
