"""
Module 3 Version 2 : Simulations de Monte Carlo & Modélisation Stochastique (15 exercices Python)
"""

MODULE_3 = {
    "id": "python-monte-carlo",
    "title": "Simulations de Monte Carlo & Modélisation Stochastique",
    "subtitle": "Processus d'Itô, Pricing Dérivés, Réduction de Variance & Modèles de Taux",
    "icon": "Cpu",
    "description": "Devenez expert en simulation stochastique : algorithme de Box-Muller, factorisation de Cholesky, mouvement brownien géométrique, pricing Black-Scholes vs Monte Carlo, variables antithétiques, options exotiques et processus de Vasicek.",
    "exercises": [
        {
            "id": "v2-py-16",
            "title": "1. Génération Pseudo-Aléatoire & Algorithme de Box-Muller",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Générez des variables gaussiennes standards à partir de lois uniformes par la méthode géométrique de Box-Muller.",
            "theoryMarkdown": """### De l'Aléatoire Uniforme à la Loi Normale : La Transformation de Box-Muller

> 💡 **Rappel théorique : Pourquoi la méthode d'inversion directe est coûteuse**
> 
> La fonction de répartition d'une loi normale $\\Phi(x) = \\int_{-\\infty}^x \\frac{1}{\\sqrt{2\\pi}} e^{-u^2/2} du$ n'admet pas de primitive analytique fermée élémentaire.
> En 1958, George Box et Mervin Muller ont proposé une transformation bidimensionnelle exacte :
> 
> Soit $U_1, U_2 \\sim \\mathcal{U}(0, 1)$ indépendantes. Alors :
> $$Z_1 = \\sqrt{-2 \\ln(U_1)} \\cos(2\\pi U_2)$$
> $$Z_2 = \\sqrt{-2 \\ln(U_1)} \\sin(2\\pi U_2)$$
> sont deux variables aléatoires indépendantes suivant exactement la loi normale centrée réduite $\\mathcal{N}(0, 1)$ !
""",
            "taskMarkdown": "Soit $N = 10\\,000$ tirages uniformes `U1` et `U2` dans $]0, 1[$. Calculez `R = np.sqrt(-2.0 * np.log(U1))` et générez `Z1 = R * np.cos(2.0 * np.pi * U2)`. Calculez la moyenne empirique `moyenne_z1 = float(np.mean(Z1))` et la variance empirique `variance_z1 = float(np.var(Z1))`. Affichez les statistiques.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nU1 = np.random.uniform(1e-10, 1.0, N)\nU2 = np.random.uniform(0.0, 1.0, N)\n\n# Implémentez la transformation de Box-Muller pour obtenir Z1 :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nU1 = np.random.uniform(1e-10, 1.0, N)\nU2 = np.random.uniform(0.0, 1.0, N)\n\nR = np.sqrt(-2.0 * np.log(U1))\nZ1 = R * np.cos(2.0 * np.pi * U2)\n\nmoyenne_z1 = float(np.mean(Z1))\nvariance_z1 = float(np.var(Z1))\n\nprint(f'Moyenne empirique de Z1 : {moyenne_z1:.4f} (théorique : 0.0)')\nprint(f'Variance empirique de Z1 : {variance_z1:.4f} (théorique : 1.0)')",
            "testPythonCode": "assert 'Z1' in globals()\nassert 'moyenne_z1' in globals()\nassert 'variance_z1' in globals()\nassert len(Z1) == 10000\nassert np.isclose(moyenne_z1, 0.0, atol=0.05)\nassert np.isclose(variance_z1, 1.0, atol=0.05)",
            "hints": ["R = np.sqrt(-2.0 * np.log(U1))", "Z1 = R * np.cos(2.0 * np.pi * U2)", "moyenne_z1 = float(np.mean(Z1))", "variance_z1 = float(np.var(Z1))"],
            "datasets": []
        },
        {
            "id": "v2-py-17",
            "title": "2. Simulation de Variables Aléatoires Corrélées par Cholesky",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Générez des chocs de marché multivariés respectant une matrice de covariance cible grâce à la décomposition de Cholesky.",
            "theoryMarkdown": """### Factorisation de Cholesky : La Racine Carrée d'une Matrice

> 💡 **Rappel mathématique : Génération Gaussienne Multivariée**
> 
> Soit une matrice de variance-covariance cible $\\Sigma \\in \\mathbb{R}^{K \\times K}$ symétrique définie positive.
> Il existe une unique matrice triangulaire inférieure $L$ à éléments diagonaux strictement positifs telle que :
> $$\\Sigma = L L'$$
> 
> Si $\\mathbf{Z} = [Z_1, \\dots, Z_K]' \\sim \\mathcal{N}(\\mathbf{0}, I_K)$ est un vecteur de chocs gaussiens indépendants, alors :
> $$\\mathbf{X} = L \\mathbf{Z} \\sim \\mathcal{N}(\\mathbf{0}, \\Sigma)$$
> En effet :
> $$\\operatorname{Var}(\\mathbf{X}) = \\mathbb{E}[(L \\mathbf{Z})(L \\mathbf{Z})'] = L \\mathbb{E}[\\mathbf{Z} \\mathbf{Z}'] L' = L I_K L' = L L' = \\Sigma$$
""",
            "taskMarkdown": "À partir de la matrice de covariance cible `Sigma_cible`, calculez la matrice de Cholesky `L = np.linalg.cholesky(Sigma_cible)`. Générez $N = 50\\,000$ tirages indépendants `Z` ($3 \\times N$) avec `np.random.randn`. Construisez les variables corrélées `X = (L @ Z).T`. Calculez la matrice de covariance empirique `cov_empirique = np.cov(X, rowvar=False)`. Affichez `L` et `cov_empirique`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nSigma_cible = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.09, 0.025],\n    [0.008, 0.025, 0.06]\n])\nN = 50000\n\n# Calculez L, simulez Z, puis construisez X et cov_empirique :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nSigma_cible = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.09, 0.025],\n    [0.008, 0.025, 0.06]\n])\nN = 50000\n\nL = np.linalg.cholesky(Sigma_cible)\nZ = np.random.randn(3, N)\nX = (L @ Z).T\ncov_empirique = np.cov(X, rowvar=False)\n\nprint('Matrice de Cholesky L :\\n', np.round(L, 4))\nprint('Matrice de Covariance Empirique :\\n', np.round(cov_empirique, 4))\nprint('Écart maximal absolu :', np.max(np.abs(cov_empirique - Sigma_cible)))",
            "testPythonCode": "assert 'L' in globals()\nassert 'cov_empirique' in globals()\nassert np.allclose(L @ L.T, Sigma_cible)\nassert np.allclose(cov_empirique, Sigma_cible, atol=0.01)",
            "hints": ["L = np.linalg.cholesky(Sigma_cible)", "Z = np.random.randn(3, N)", "X = (L @ Z).T", "cov_empirique = np.cov(X, rowvar=False)"],
            "datasets": []
        },
        {
            "id": "v2-py-18",
            "title": "3. Mouvement Brownien Standard (Processus de Wiener)",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Simulez et tracez des trajectoires du processus stochastique de Wiener continu W(t).",
            "theoryMarkdown": """### Les Fondations du Calcul Stochastique : Le Processus de Wiener

> 💡 **Rappel axiomatique : Les 4 propriétés de Robert Brown & Norbert Wiener**
> 
> Un processus stochastique $\\{W_t\\}_{t \\ge 0}$ est un **mouvement brownien standard** si :
> 1. $W_0 = 0$ presque sûrement.
> 2. Les trajectoires $t \\mapsto W_t$ sont **continues partout, mais dérivables nulle part**.
> 3. Les accroissements sont indépendants : pour tout $0 \\le s < t$, $W_t - W_s$ est indépendant de $\\{W_u\\}_{u \\le s}$.
> 4. Les accroissements sont gaussiens et stationnaires :
>    $$W_t - W_s \\sim \\mathcal{N}(0, t - s)$$
> 
> **Variation Quadratique :** Sur $[0, T]$, la variation quadratique vérifie $[W]_T = T$ de manière déterministe (d'où la règle fondamentale du calcul d'Itô : $(dW_t)^2 = dt$).
""",
            "taskMarkdown": "Simulez $M = 5$ trajectoires d'un mouvement brownien sur l'horizon $T = 1.0$ an avec $N = 252$ pas de temps ($\\Delta t = T / N$). Générez les accroissements $\\Delta W = \\sqrt{\\Delta t} \\times Z$, puis appliquez la somme cumulée `np.cumsum` pour obtenir la matrice des trajectoires `W` de dimension $(M, N+1)$ démarrant à 0. Tracez les 5 trajectoires avec Matplotlib.",
            "initialCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nM = 5\nN = 252\nT = 1.0\ndt = T / N\n\n# Simulez les trajectoires W de dimension (M, N+1) :\n",
            "solutionCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nM = 5\nN = 252\nT = 1.0\ndt = T / N\ntemps = np.linspace(0, T, N + 1)\n\ndW = np.sqrt(dt) * np.random.randn(M, N)\nW = np.zeros((M, N + 1))\nW[:, 1:] = np.cumsum(dW, axis=1)\n\nplt.figure(figsize=(6, 3.5))\nfor i in range(M):\n    plt.plot(temps, W[i], lw=1.5, label=f'Trajectoire {i+1}')\nplt.axhline(0, color='black', ls='--', lw=1)\nplt.xlabel('Temps t (années)')\nplt.ylabel('W(t)')\nplt.title('Simulations du Mouvement Brownien Standard')\nplt.legend(loc='upper left', fontsize=8)\nplt.grid(True, alpha=0.3)\n\nprint(f'Moyenne finale : {np.mean(W[:, -1]):.4f}, Écart-type : {np.std(W[:, -1]):.4f}')",
            "testPythonCode": "assert 'W' in globals()\nassert W.shape == (5, 253)\nassert np.all(W[:, 0] == 0.0)",
            "hints": ["dW = np.sqrt(dt) * np.random.randn(M, N)", "W = np.zeros((M, N + 1))", "W[:, 1:] = np.cumsum(dW, axis=1)"],
            "datasets": []
        },
        {
            "id": "v2-py-19",
            "title": "4. Mouvement Brownien Géométrique (GBM) Vectorisé",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Simulez les cours boursiers selon l'EDS de Black-Scholes avec la solution exacte d'Itô.",
            "theoryMarkdown": """### Le Modèle Canonique de Black-Scholes : Le GBM

> 💡 **Rappel fondamental : L'Équation Différentielle Stochastique (EDS)**
> 
> Les cours d'actifs financiers sont modélisés par un mouvement brownien géométrique :
> $$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$
> En appliquant le **lemme d'Itô** à la fonction $f(S_t) = \\ln(S_t)$ :
> $$d\\ln(S_t) = \\frac{1}{S_t} dS_t - \\frac{1}{2} \\frac{1}{S_t^2} (dS_t)^2 = \\left( \\mu - \\frac{1}{2}\\sigma^2 \\right) dt + \\sigma dW_t$$
> 
> En intégrant, on obtient la **solution analytique exacte** (sans biais de discrétisation) :
> $$S_t = S_0 \\exp\\left( \\left( \\mu - \\frac{1}{2}\\sigma^2 \\right) t + \\sigma W_t \\right)$$
> - Espérance : $\\mathbb{E}[S_t] = S_0 e^{\\mu t}$.
> - Les cours restent strictement positifs ($S_t > 0$).
""",
            "taskMarkdown": "Pour $S_0 = 100$, un drift $\\mu = 0.08$, une volatilité $\\sigma = 0.20$ et un horizon $T = 1.0$ an, simulez $N = 100\\,000$ cours terminaux `S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * np.random.randn(N))`. Calculez l'espérance empirique `esperance_empirique = float(np.mean(S_T))` et l'espérance théorique `esperance_theorique = float(S0 * np.exp(mu * T))`. Affichez les valeurs.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nmu = 0.08\nsigma = 0.20\nT = 1.0\nN = 100000\n\n# Simulez S_T selon la formule exacte du GBM :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nmu = 0.08\nsigma = 0.20\nT = 1.0\nN = 100000\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\n\nesperance_empirique = float(np.mean(S_T))\nesperance_theorique = float(S0 * np.exp(mu * T))\n\nprint(f'Espérance empirique : {esperance_empirique:.4f}')\nprint(f'Espérance théorique : {esperance_theorique:.4f}')\nprint(f'Erreur relative : {abs(esperance_empirique - esperance_theorique) / esperance_theorique:.4%}')",
            "testPythonCode": "assert 'S_T' in globals()\nassert 'esperance_empirique' in globals()\nassert 'esperance_theorique' in globals()\nassert np.isclose(esperance_empirique, esperance_theorique, rtol=0.01)",
            "hints": ["Z = np.random.randn(N)", "S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)", "esperance_empirique = float(np.mean(S_T))", "esperance_theorique = float(S0 * np.exp(mu * T))"],
            "datasets": []
        },
        {
            "id": "v2-py-20",
            "title": "5. Pricing d'un Call Européen par Monte Carlo (Mesure Q)",
            "category": "pricing",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Évaluez la prime d'une option d'achat européenne par espérance actualisée sous la mesure risque-neutre.",
            "theoryMarkdown": """### Évaluation Risque-Neutre et Absence d'Opportunité d'Arbitrage (AOA)

> 💡 **Le Premier Théorème Fondamental de l'Évaluation des Actifs**
> 
> En finance mathématique (Harrison & Kreps 1979), le prix de marché d'un produit dérivé de payoff $H(S_T)$ est égal à son espérance actualisée sous l'unique probabilité risque-neutre $\\mathbb{Q}$ :
> $$C_0 = e^{-rT} \\mathbb{E}^{\\mathbb{Q}}[\\max(S_T - K, 0)]$$
> où sous $\\mathbb{Q}$, le taux de dérive du sous-jacent est exactement le **taux sans risque $r$** (et non $\\mu$) :
> $$S_T = S_0 \\exp\\left( \\left( r - \\frac{1}{2}\\sigma^2 \\right) T + \\sigma \\sqrt{T} Z \\right), \\quad Z \\sim \\mathcal{N}(0, 1)$$
> 
> L'estimateur de Monte Carlo est la moyenne empirique actualisée :
> $$\\hat{C}_N = \\frac{e^{-rT}}{N} \\sum_{i=1}^N \\max(S_T^{(i)} - K, 0)$$
""",
            "taskMarkdown": "Pour $S_0 = 100$, strike $K = 100$, taux sans risque $r = 0.05$, volatilité $\\sigma = 0.20$, maturité $T = 1.0$ an et $N = 100\\,000$ simulations, calculez les cours finaux `S_T`, les payoffs `payoffs = np.maximum(S_T - K, 0.0)`, et le prix estimé de l'option `prix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))`. Affichez le prix estimé.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\nN = 100000\n\n# Calculez prix_call_mc par simulation de Monte Carlo :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\nN = 100000\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs = np.maximum(S_T - K, 0.0)\nprix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))\n\nprint(f'Prix estimé du Call Européen (Monte Carlo) : {prix_call_mc:.4f} €')",
            "testPythonCode": "assert 'prix_call_mc' in globals()\nassert np.isclose(prix_call_mc, 10.45, atol=0.20)",
            "hints": ["Z = np.random.randn(N)", "S_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)", "payoffs = np.maximum(S_T - K, 0.0)", "prix_call_mc = float(np.exp(-r * T) * np.mean(payoffs))"],
            "datasets": []
        },
        {
            "id": "v2-py-21",
            "title": "6. Benchmark Analytique : Formule Fermée de Black-Scholes-Merton",
            "category": "pricing",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Codez la formule fermée de Black-Scholes pour comparer le prix théorique exact au résultat Monte Carlo.",
            "theoryMarkdown": """### La Formule Fermée de Fischer Black & Myron Scholes (1973)

> 💡 **Rappel mathématique : La Solution Exacte**
> 
> Pour une option d'achat vanille européenne (Call) :
> $$C_{\\text{BS}} = S_0 \\Phi(d_1) - K e^{-rT} \\Phi(d_2)$$
> où $\\Phi$ est la fonction de répartition de la loi normale standard $\\mathcal{N}(0, 1)$ (`scipy.stats.norm.cdf`) :
> $$d_1 = \\frac{\\ln(S_0 / K) + \\left( r + \\frac{1}{2}\\sigma^2 \\right) T}{\\sigma \\sqrt{T}}$$
> $$d_2 = d_1 - \\sigma \\sqrt{T}$$
""",
            "taskMarkdown": "À partir des mêmes paramètres ($S_0=100, K=100, r=0.05, \\sigma=0.20, T=1.0$), implémentez le calcul analytique de `d1`, `d2`, et déterminez `prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))`. Affichez `prix_bs`.",
            "initialCode": "import numpy as np\nfrom scipy.stats import norm\n\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\n\n# Calculez d1, d2 et le prix analytique Black-Scholes prix_bs :\n",
            "solutionCode": "import numpy as np\nfrom scipy.stats import norm\n\nS0 = 100.0\nK = 100.0\nr = 0.05\nsigma = 0.20\nT = 1.0\n\nd1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))\nd2 = d1 - sigma * np.sqrt(T)\nprix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))\n\nprint(f'd1 : {d1:.4f}, d2 : {d2:.4f}')\nprint(f'Prix théorique exact de Black-Scholes : {prix_bs:.4f} €')",
            "testPythonCode": "assert 'd1' in globals()\nassert 'd2' in globals()\nassert 'prix_bs' in globals()\nassert np.isclose(prix_bs, 10.4506, atol=1e-3)",
            "hints": ["d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))", "d2 = d1 - sigma * np.sqrt(T)", "prix_bs = float(S0 * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2))"],
            "datasets": []
        },
        {
            "id": "v2-py-22",
            "title": "7. Intervalle de Confiance et Vitesse de Convergence en O(1/sqrt(N))",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Quantifiez la précision de la méthode de Monte Carlo par le Théorème Central Limite (TCL).",
            "theoryMarkdown": """### Erreur Standard et Intervalle de Confiance de Monte Carlo

> 💡 **Rappel mathématique : La Vitesse de Convergence du TCL**
> 
> Soit $Y_i = e^{-rT} \\max(S_T^{(i)} - K, 0)$ les payoffs actualisés simulés.
> - **Variance empirique** : $s_N^2 = \\frac{1}{N-1} \\sum_{i=1}^N (Y_i - \\hat{C}_N)^2$.
> - **Erreur standard (Standard Error)** :
>   $$SE = \\frac{s_N}{\\sqrt{N}}$$
> 
> Par le Théorème Central Limite, pour $N$ grand, l'intervalle de confiance à **95%** de la vraie valeur est :
> $$IC_{95\\%} = \\left[ \\hat{C}_N - 1.96 \\cdot SE, \\; \\hat{C}_N + 1.96 \\cdot SE \\right]$$
> - Pour diviser l'erreur par 10, il faut multiplier $N$ par **100** !
""",
            "taskMarkdown": "Soit les payoffs actualisés simulés `payoffs_actualises`. Calculez la moyenne `prix_mc = float(np.mean(payoffs_actualises))`, l'écart-type `s_N = float(np.std(payoffs_actualises, ddof=1))`, l'erreur standard `se = float(s_N / np.sqrt(len(payoffs_actualises)))` et la demi-largeur de l'intervalle à 95% `demi_largeur = float(1.96 * se)`. Affichez l'intervalle.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs_actualises = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\n\n# Calculez prix_mc, se et demi_largeur :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\npayoffs_actualises = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\n\nprix_mc = float(np.mean(payoffs_actualises))\ns_N = float(np.std(payoffs_actualises, ddof=1))\nse = float(s_N / np.sqrt(N))\ndemi_largeur = float(1.96 * se)\n\nprint(f'Prix Monte Carlo : {prix_mc:.4f} €')\nprint(f'Erreur Standard (SE) : {se:.5f} €')\nprint(f'Intervalle de Confiance à 95% : [{prix_mc - demi_largeur:.4f} €, {prix_mc + demi_largeur:.4f} €]')",
            "testPythonCode": "assert 'prix_mc' in globals()\nassert 'se' in globals()\nassert 'demi_largeur' in globals()\nassert se > 0\nassert demi_largeur < 0.20",
            "hints": ["prix_mc = float(np.mean(payoffs_actualises))", "s_N = float(np.std(payoffs_actualises, ddof=1))", "se = float(s_N / np.sqrt(N))", "demi_largeur = float(1.96 * se)"],
            "datasets": []
        },
        {
            "id": "v2-py-23",
            "title": "8. Réduction de Variance I : Variables Antithétiques",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Doublez l'efficacité de vos calculs Monte Carlo en exploitant la symétrie de la loi normale standard.",
            "theoryMarkdown": """### Méthode des Variables Antithétiques (Antithetic Variates)

> 💡 **Rappel théorique : Exploiter la Corrélation Négative**
> 
> Si $Z \\sim \\mathcal{N}(0, 1)$, alors par symétrie axiale, $-Z \\sim \\mathcal{N}(0, 1)$.
> Pour chaque tirage gaussien $Z_i$, on génère simultanément :
> 1. La trajectoire directe avec $+Z_i \\implies Y_i^{(+)} = e^{-rT} \\max(S_T(Z_i) - K, 0)$
> 2. La trajectoire antithétique avec $-Z_i \\implies Y_i^{(-)} = e^{-rT} \\max(S_T(-Z_i) - K, 0)$
> 
> L'estimateur antithétique est la moyenne des paires appariées :
> $$\\bar{Y}_i = \\frac{Y_i^{(+)} + Y_i^{(-)}}{2}$$
> La variance de l'estimateur devient :
> $$\\operatorname{Var}(\\bar{Y}_i) = \\frac{1}{4} \\left( \\operatorname{Var}(Y^{(+)}) + \\operatorname{Var}(Y^{(-)}) + 2 \\operatorname{Cov}(Y^{(+)}, Y^{(-)}) \\right)$$
> Comme $S_T(Z)$ est une fonction croissante de $Z$, $\\operatorname{Cov}(Y^{(+)}, Y^{(-)}) < 0$, ce qui réduit drastiquement la variance !
""",
            "taskMarkdown": "Générez $N = 25\\,000$ tirages $Z$. Calculez les payoffs $Y_1$ (avec $Z$) et $Y_2$ (avec $-Z$). Formez l'estimateur antithétique `Y_anti = 0.5 * (Y1 + Y2)`. Calculez la variance standard `var_standard = float(np.var(Y1))` et la variance antithétique `var_anti = float(np.var(Y_anti))`, puis le ratio de réduction de variance `ratio_reduction = float(var_standard / var_anti)`. Affichez `ratio_reduction`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\n\n# Implémentez la méthode antithétique et calculez ratio_reduction :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\n\nZ = np.random.randn(N)\ndrift = (r - 0.5 * sigma**2) * T\nvol = sigma * np.sqrt(T)\n\nS_T1 = S0 * np.exp(drift + vol * Z)\nS_T2 = S0 * np.exp(drift - vol * Z)\n\nY1 = np.exp(-r * T) * np.maximum(S_T1 - K, 0.0)\nY2 = np.exp(-r * T) * np.maximum(S_T2 - K, 0.0)\n\nY_anti = 0.5 * (Y1 + Y2)\n\nvar_standard = float(np.var(Y1))\nvar_anti = float(np.var(Y_anti))\nratio_reduction = float(var_standard / var_anti)\n\nprint(f'Variance standard : {var_standard:.4f}')\nprint(f'Variance antithétique : {var_anti:.4f}')\nprint(f'Gain de réduction de variance : x{ratio_reduction:.2f}')",
            "testPythonCode": "assert 'var_standard' in globals()\nassert 'var_anti' in globals()\nassert 'ratio_reduction' in globals()\nassert ratio_reduction > 1.5",
            "hints": ["S_T1 = S0 * np.exp(drift + vol * Z)", "S_T2 = S0 * np.exp(drift - vol * Z)", "Y_anti = 0.5 * (Y1 + Y2)", "ratio_reduction = float(var_standard / var_anti)"],
            "datasets": []
        },
        {
            "id": "v2-py-24",
            "title": "9. Réduction de Variance II : Variables de Contrôle",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Utilisez le cours terminal du sous-jacent (dont l'espérance est connue analytiquement) comme variable de contrôle.",
            "theoryMarkdown": """### Méthode des Variables de Contrôle (Control Variates)

> 💡 **Rappel théorique : Corriger l'erreur de simulation via une variable auxiliaire**
> 
> Soit $X$ la variable d'intérêt dont on cherche $\\mathbb{E}[X]$ (ex: le payoff actualisé du Call).
> Supposons qu'il existe une variable aléatoire $Y$ fortement corrélée à $X$, dont on connaît **analytiquement l'espérance exacte $\\mathbb{E}[Y]$**.
> *(Exemple : le cours sous-jacent actualisé $Y = e^{-rT} S_T$, dont l'espérance est exactement $S_0$ !)*
> 
> On construit le nouvel estimateur contrôlé :
> $$X^*(c) = X - c (Y - \\mathbb{E}[Y])$$
> - $\\mathbb{E}[X^*] = \\mathbb{E}[X]$ (l'estimateur reste rigoureusement sans biais !).
> - Le coefficient optimal qui minimise la variance est :
>   $$c^* = \\frac{\\operatorname{Cov}(X, Y)}{\\operatorname{Var}(Y)}$$
> - La variance minimale obtenue vérifie :
>   $$\\operatorname{Var}(X^*) = \\operatorname{Var}(X) \\left( 1 - \\rho_{XY}^2 \\right)$$
""",
            "taskMarkdown": "Soit $X$ les payoffs actualisés et $Y = e^{-rT} S_T$ avec $\\mathbb{E}[Y] = S_0$. Calculez $c^* = \\operatorname{Cov}(X, Y) / \\operatorname{Var}(Y)$, puis la série contrôlée `X_ctrl = X - c_star * (Y - S0)`. Calculez le prix contrôlé `prix_ctrl = float(np.mean(X_ctrl))` et le pourcentage de réduction de variance `pct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)`. Affichez `pct_gain`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\nX = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\nY = np.exp(-r * T) * S_T\n\n# Implémentez la variable de contrôle avec Y et S0 :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 50000\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\nX = np.exp(-r * T) * np.maximum(S_T - K, 0.0)\nY = np.exp(-r * T) * S_T\n\ncov_mat = np.cov(X, Y)\nc_star = cov_mat[0, 1] / cov_mat[1, 1]\nX_ctrl = X - c_star * (Y - S0)\n\nprix_ctrl = float(np.mean(X_ctrl))\npct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)\n\nprint(f'Coefficient optimal c* : {c_star:.4f}')\nprint(f'Prix avec variable de contrôle : {prix_ctrl:.4f} €')\nprint(f'Réduction de variance obtenue : {pct_gain:.2f}%')",
            "testPythonCode": "assert 'c_star' in globals()\nassert 'X_ctrl' in globals()\nassert 'pct_gain' in globals()\nassert pct_gain > 50.0\nassert np.isclose(prix_ctrl, 10.45, atol=0.10)",
            "hints": ["cov_mat = np.cov(X, Y)", "c_star = cov_mat[0, 1] / cov_mat[1, 1]", "X_ctrl = X - c_star * (Y - S0)", "pct_gain = float((1.0 - np.var(X_ctrl) / np.var(X)) * 100)"],
            "datasets": []
        },
        {
            "id": "v2-py-25",
            "title": "10. Pricing d'un Call Asiatique (Option Dépendante du Chemin)",
            "category": "pricing",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Évaluez une option asiatique dont le payoff dépend de la moyenne arithmétique continue des cours.",
            "theoryMarkdown": """### Les Options Exotiques Dépendantes du Chemin (Path-Dependent)

> 💡 **Rappel : Le Payoff Asiatique à Moyenne Arithmétique**
> 
> Contrairement aux options européennes vanilles qui ne dépendent que du cours terminal $S_T$, une **option asiatique** a un payoff indexé sur la moyenne arithmétique observée sur la durée de vie du contrat :
> $$\\bar{S} = \\frac{1}{M} \\sum_{k=1}^M S_{t_k}$$
> $$\\text{Payoff} = \\max(\\bar{S} - K, 0)$$
> 
> **Pourquoi Monte Carlo est indispensable ?**
> La somme de variables log-normales n'est pas log-normale. Il **n'existe aucune formule analytique fermée simple** pour le Call asiatique à moyenne arithmétique ! La simulation de Monte Carlo constitue la méthode de référence de toutes les banques d'investissement.
""",
            "taskMarkdown": "Simulez $M = 252$ pas de temps pour $N = 10\\,000$ trajectoires de GBM. Calculez pour chaque trajectoire la moyenne arithmétique des cours `S_mean = np.mean(S_paths, axis=1)`. Calculez le prix du Call asiatique `prix_asiatique = float(np.exp(-r * T) * np.mean(np.maximum(S_mean - K, 0.0)))`. Affichez `prix_asiatique`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\ndt = T / M\n\n# Simulez la matrice S_paths de dimension (N, M+1) et calculez prix_asiatique :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.20, 1.0\ndt = T / M\n\nZ = np.random.randn(N, M)\ndrift = (r - 0.5 * sigma**2) * dt\nvol = sigma * np.sqrt(dt)\nlog_returns = drift + vol * Z\n\nlog_paths = np.zeros((N, M + 1))\nlog_paths[:, 1:] = np.cumsum(log_returns, axis=1)\nS_paths = S0 * np.exp(log_paths)\n\nS_mean = np.mean(S_paths, axis=1)\npayoffs_asiatiques = np.maximum(S_mean - K, 0.0)\nprix_asiatique = float(np.exp(-r * T) * np.mean(payoffs_asiatiques))\n\nprint(f'Prix du Call Asiatique à moyenne arithmétique : {prix_asiatique:.4f} €')\nprint('Note : Le prix asiatique est inférieur au Call vanille (10.45 €) car la moyenne réduit la volatilité effective.')",
            "testPythonCode": "assert 'prix_asiatique' in globals()\nassert 'S_mean' in globals()\nassert 5.0 < prix_asiatique < 7.0",
            "hints": ["S_paths = S0 * np.exp(log_paths)", "S_mean = np.mean(S_paths, axis=1)", "prix_asiatique = float(np.exp(-r * T) * np.mean(np.maximum(S_mean - K, 0.0)))"],
            "datasets": []
        },
        {
            "id": "v2-py-26",
            "title": "11. Option Barrière Knock-Out (Down-and-Out Call)",
            "category": "pricing",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Simulez une option désactivable dès que le cours franchit une barrière inférieure B.",
            "theoryMarkdown": """### Les Options à Barrière : Clauses Knock-Out & Knock-In

> 💡 **Rappel conceptuel : Le Down-and-Out Call (DOC)**
> 
> Un Call Down-and-Out confère le droit d'acheter le sous-jacent à $K$ à maturité $T$, **à la condition expresse que le cours n'ait jamais touché ni franchi la barrière $B < S_0$** pendant toute la durée de vie du contrat :
> $$\\text{Payoff} = \\max(S_T - K, 0) \\times \\mathbb{I}_{\\left\\{ \\min_{0 \\le t \\le T} S_t > B \\right\\}}$$
> Dès que $S_t \\le B$, l'option s'éteint instantanément (*knock-out*) et son payoff devient nul.
""",
            "taskMarkdown": "À partir des trajectoires `S_paths` simulées ($S_0=100, K=100, B=85$), calculez le minimum de chaque trajectoire `S_min = np.min(S_paths, axis=1)`. Filtrez les trajectoires vivantes `actifs_vivants = (S_min > B)`. Calculez le prix de l'option barrière `prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants))` et le taux de survie `taux_survie = float(np.mean(actifs_vivants) * 100)`. Affichez les résultats.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, B, r, sigma, T = 100.0, 100.0, 85.0, 0.05, 0.20, 1.0\ndt = T / M\n\n# Simulez les chemins et déterminez prix_doc et taux_survie :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 10000\nM = 252\nS0, K, B, r, sigma, T = 100.0, 100.0, 85.0, 0.05, 0.20, 1.0\ndt = T / M\n\nZ = np.random.randn(N, M)\nlog_inc = (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z\nlog_paths = np.zeros((N, M + 1))\nlog_paths[:, 1:] = np.cumsum(log_inc, axis=1)\nS_paths = S0 * np.exp(log_paths)\n\nS_min = np.min(S_paths, axis=1)\nactifs_vivants = (S_min > B)\npayoffs_doc = np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants\nprix_doc = float(np.exp(-r * T) * np.mean(payoffs_doc))\ntaux_survie = float(np.mean(actifs_vivants) * 100)\n\nprint(f'Prix du Down-and-Out Call (Barrière B={B}) : {prix_doc:.4f} €')\nprint(f'Taux de survie des contrats : {taux_survie:.2f}%')",
            "testPythonCode": "assert 'prix_doc' in globals()\nassert 'taux_survie' in globals()\nassert prix_doc < 10.45\nassert 0 < taux_survie < 100",
            "hints": ["S_min = np.min(S_paths, axis=1)", "actifs_vivants = (S_min > B)", "prix_doc = float(np.exp(-r * T) * np.mean(np.maximum(S_paths[:, -1] - K, 0.0) * actifs_vivants))"],
            "datasets": []
        },
        {
            "id": "v2-py-27",
            "title": "12. Modèle de Saut de Merton (Jump-Diffusion)",
            "category": "monte_carlo",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Simulez les krachs et discontinuités de cours en superposant un processus de Poisson composé au mouvement brownien.",
            "theoryMarkdown": """### Modèle Jump-Diffusion de Robert Merton (1976)

> 💡 **Rappel théorique : Pourquoi le mouvement brownien pur ne suffit pas**
> 
> Les cours réels présentent des sauts instantanés imprévisibles lors des annonces de banques centrales ou crises de liquidité.
> L'EDS de Merton combine diffusion continue et sauts de Poisson :
> $$\\frac{dS_t}{S_{t^-}} = (\\mu - \\lambda \\kappa) dt + \\sigma dW_t + (Y - 1) dN_t$$
> - $N_t$ : processus de Poisson d'intensité $\\lambda$ (nombre moyen de sauts par an).
> - $\\ln(Y) \\sim \\mathcal{N}(\\mu_J, \\sigma_J^2)$ : amplitude aléatoire du saut multiplicateur $Y$.
> - $\\kappa = \\mathbb{E}[Y - 1] = e^{\\mu_J + \\frac{1}{2}\\sigma_J^2} - 1$ : compensation de dérive pour préserver la martingale.
""",
            "taskMarkdown": "Pour $N = 20\\,000$, simulez le nombre de sauts sur 1 an $k_i \\sim \\text{Poisson}(\\lambda = 0.75)$. Pour chaque saut, tirez $\\ln(Y) \\sim \\mathcal{N}(\\mu_J = -0.15, \\sigma_J^2 = 0.10^2)$. Calculez la composante de saut cumulée et déterminez les prix finaux `S_T_merton`. Calculez le Kurtosis `kurtosis_merton = float(np.mean(((S_T_merton - np.mean(S_T_merton))/np.std(S_T_merton))**4))`. Affichez le Kurtosis.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 20000\nS0, r, sigma, T = 100.0, 0.05, 0.15, 1.0\nlambda_jump = 0.75\nmu_J = -0.15\nsigma_J = 0.10\n\n# Simulez S_T_merton et calculez son Kurtosis :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 20000\nS0, r, sigma, T = 100.0, 0.05, 0.15, 1.0\nlambda_jump = 0.75\nmu_J = -0.15\nsigma_J = 0.10\n\nkappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0\ndrift_corr = (r - lambda_jump * kappa - 0.5 * sigma**2) * T\n\nZ = np.random.randn(N)\nnb_sauts = np.random.poisson(lambda_jump * T, N)\n\nsomme_sauts = np.zeros(N)\nfor i in range(N):\n    if nb_sauts[i] > 0:\n        somme_sauts[i] = np.sum(np.random.normal(mu_J, sigma_J, nb_sauts[i]))\n\nS_T_merton = S0 * np.exp(drift_corr + sigma * np.sqrt(T) * Z + somme_sauts)\nz_merton = (S_T_merton - np.mean(S_T_merton)) / np.std(S_T_merton)\nkurtosis_merton = float(np.mean(z_merton**4))\n\nprint(f'Kurtosis sous Merton Jump-Diffusion : {kurtosis_merton:.4f}')\nprint(f'Excès de Kurtosis (Queues épaisses) : {kurtosis_merton - 3.0:.4f}')",
            "testPythonCode": "assert 'S_T_merton' in globals()\nassert 'kurtosis_merton' in globals()\nassert kurtosis_merton > 3.2",
            "hints": ["kappa = np.exp(mu_J + 0.5 * sigma_J**2) - 1.0", "nb_sauts = np.random.poisson(lambda_jump * T, N)", "S_T_merton = S0 * np.exp(drift_corr + sigma * np.sqrt(T) * Z + somme_sauts)"],
            "datasets": []
        },
        {
            "id": "v2-py-28",
            "title": "13. Value-at-Risk de Portefeuille Non Linéaire par Full Revaluation",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Estimez la VaR d'un book composé d'actions et d'options par réévaluation complète Monte Carlo.",
            "theoryMarkdown": """### Full Revaluation Monte Carlo : Au-delà de l'Approximation Delta-Normale

> 💡 **Rappel : L'échec des approximations linéaires (Delta-Gamma)**
> 
> Pour un portefeuille détenant des instruments optionnels non linéaires :
> $$\\Delta V \\ne \\Delta \\times \\Delta S + \\frac{1}{2} \\Gamma \\times (\\Delta S)^2$$
> Lorsque les variations de marché $\\Delta S$ sont brutales, l'approximation polynomiale de Taylor sous-estime gravement les queues de distribution.
> 
> La seule méthode rigoureuse adoptée par les salles de marché est la **réévaluation complète (Full Revaluation)** :
> À chaque scénario simulé $\\mathbf{S}^{(i)}$, on recalcule la valeur exacte du portefeuille $V(\\mathbf{S}^{(i)})$ et on en déduit la distribution de pertes $L^{(i)} = V_0 - V(\\mathbf{S}^{(i)})$.
""",
            "taskMarkdown": "Soit un portefeuille composé de 10 actions ($S_0=100$) et de la vente à découvert de 10 Calls ($K=105, C_0=7.5$). Valeur initiale $V_0 = 10 \\times 100 - 10 \\times 7.5 = 925$ €. Pour $N = 25\\,000$ scénarios simulés de $S_T$, calculez $V_T = 10 \\times S_T - 10 \\times \\max(S_T - 105, 0)$, puis les pertes $L = V_0 - V_T$. Extrayez la `var_mc_99 = float(np.percentile(L, 99))`. Affichez `var_mc_99`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, T, r, sigma = 100.0, 105.0, 0.25, 0.04, 0.22\nV0 = 10.0 * S0 - 10.0 * 7.50\n\n# Simulez S_T, calculez V_T, les pertes L et la VaR 99% :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN = 25000\nS0, K, T, r, sigma = 100.0, 105.0, 0.25, 0.04, 0.22\nV0 = 10.0 * S0 - 10.0 * 7.50\n\nZ = np.random.randn(N)\nS_T = S0 * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)\ncall_payoffs = np.maximum(S_T - K, 0.0)\nV_T = 10.0 * S_T - 10.0 * call_payoffs\npertes = V0 - V_T\n\nvar_mc_99 = float(np.percentile(pertes, 99))\n\nprint(f'Valeur initiale du portefeuille : {V0:.2f} €')\nprint(f'Value-at-Risk 99% (Full Revaluation) : {var_mc_99:.2f} €')\nprint(f'Perte maximale relative à 99% : {var_mc_99 / V0:.2%}')",
            "testPythonCode": "assert 'var_mc_99' in globals()\nassert 'pertes' in globals()\nassert var_mc_99 > 150.0",
            "hints": ["call_payoffs = np.maximum(S_T - K, 0.0)", "V_T = 10.0 * S_T - 10.0 * call_payoffs", "pertes = V0 - V_T", "var_mc_99 = float(np.percentile(pertes, 99))"],
            "datasets": []
        },
        {
            "id": "v2-py-29",
            "title": "14. Modèle de Taux d'Intérêt Stochastiques de Vasicek",
            "category": "pricing",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Simulez le taux court instantané r(t) avec retour à la moyenne (Processus d'Ornstein-Uhlenbeck).",
            "theoryMarkdown": """### Modélisation des Taux : Le Modèle de Vasicek (1977)

> 💡 **Rappel théorique : La Force de Rappel vers la Moyenne**
> 
> Contrairement aux actions qui ont une tendance haussière continue, les taux d'intérêt sont régulés par les banques centrales et oscillent autour d'un niveau d'équilibre à long terme $\\theta$ :
> $$dr_t = \\kappa (\\theta - r_t) dt + \\sigma dW_t$$
> - $\\theta$ : niveau moyen d'équilibre à long terme.
> - $\\kappa > 0$ : vitesse de retour à la moyenne (*speed of mean reversion*).
> - $\\sigma$ : volatilité instantanée des taux courts.
> 
> **Schéma de Discrétisation d'Euler-Maruyama :**
> $$r_{t+\\Delta t} = r_t + \\kappa (\\theta - r_t) \\Delta t + \\sigma \\sqrt{\\Delta t} Z_t$$
""",
            "taskMarkdown": "Pour $r_0 = 0.01$, $\\theta = 0.035$, $\\kappa = 0.50$, $\\sigma = 0.015$, horizon $T = 5.0$ ans et $N = 500$ pas de temps, simulez $M = 100$ trajectoires de taux courts. Calculez la moyenne finale de tous les scénarios `moyenne_finale_taux = float(np.mean(r_paths[:, -1]))`. Tracez les 5 premières trajectoires et la ligne horizontale $\\theta$. Affichez `moyenne_finale_taux`.",
            "initialCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nr0 = 0.01\ntheta = 0.035\nkappa = 0.50\nsigma = 0.015\nT = 5.0\nN = 500\ndt = T / N\nM = 100\n\n# Simulez r_paths de dimension (M, N+1) avec Euler-Maruyama :\n",
            "solutionCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nr0 = 0.01\ntheta = 0.035\nkappa = 0.50\nsigma = 0.015\nT = 5.0\nN = 500\ndt = T / N\nM = 100\n\nr_paths = np.zeros((M, N + 1))\nr_paths[:, 0] = r0\n\nfor t in range(N):\n    Z = np.random.randn(M)\n    r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z\n\nmoyenne_finale_taux = float(np.mean(r_paths[:, -1]))\n\ntemps = np.linspace(0, T, N + 1)\nplt.figure(figsize=(6, 3.5))\nfor i in range(5):\n    plt.plot(temps, r_paths[i] * 100, lw=1.2, alpha=0.8)\nplt.axhline(theta * 100, color='#e11d48', ls='--', lw=2, label=f'Moyenne cible theta ({theta:.1%})')\nplt.xlabel('Horizon (années)')\nplt.ylabel('Taux court (%)')\nplt.title('Modèle de Taux de Vasicek (Ornstein-Uhlenbeck)')\nplt.legend()\nplt.grid(True, alpha=0.3)\n\nprint(f'Taux moyen final simulé à 5 ans : {moyenne_finale_taux:.4%}')\nprint(f'Niveau d équilibre théorique theta : {theta:.4%}')",
            "testPythonCode": "assert 'r_paths' in globals()\nassert 'moyenne_finale_taux' in globals()\nassert np.isclose(moyenne_finale_taux, theta, atol=0.01)",
            "hints": ["r_paths[:, t + 1] = r_paths[:, t] + kappa * (theta - r_paths[:, t]) * dt + sigma * np.sqrt(dt) * Z", "moyenne_finale_taux = float(np.mean(r_paths[:, -1]))"],
            "datasets": []
        },
        {
            "id": "v2-py-30",
            "title": "15. Stress-Testing Monte Carlo & Processus de Ruine de Lundberg",
            "category": "pricing",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Évaluez la probabilité de ruine d'une institution financière confrontée à des chocs de sinistralité stochastiques.",
            "theoryMarkdown": """### Théorie de la Ruine de Cramer-Lundberg & Solvabilité II

> 💡 **Rappel fondamental : Le Processus de Surplus d'une Compagnie**
> 
> Le capital de réserve $U_t$ d'une compagnie d'assurance ou institution financière évolue selon :
> $$U_t = u + c \\cdot t - \\sum_{i=1}^{N_t} X_i$$
> - $u > 0$ : capital initial de réserve.
> - $c > 0$ : flux continu d'encaissement de primes.
> - $N_t$ : processus de Poisson modélisant le nombre de sinistres majeurs survenus.
> - $X_i \\sim \\text{Exp}(\\lambda)$ ou Lognormale : charge financière aléatoire de chaque sinistre.
> 
> **La Probabilité Ultime de Ruine :**
> $$\\psi(u) = \\mathbb{P}(\\exists t > 0 : U_t < 0)$$
> L'exigence de capital réglementaire (SCR Solvabilité II) impose que la probabilité de faillite à 1 an soit strictement inférieure à **$0.5\\%$** (seuil de confiance 99.5%).
""",
            "taskMarkdown": "Soit $u = 500\\,000$ €, $c = 80\\,000$ €/an, intensité de sinistralité $\\lambda = 5$ sinistres/an, et coût moyen d'un sinistre $X_i \\sim \\text{Exp}(\\text{mean} = 15\\,000$ €). Pour $N = 10\\,000$ scénarios simulés sur 1 an, vérifiez si à un moment quelconque le capital $U$ devient négatif. Calculez la probabilité de ruine empirique `proba_ruine = float(np.mean(ruine_detectee))`. Affichez `proba_ruine`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nN_scenarios = 10000\nu = 500000.0\nc = 80000.0\nlambda_sin = 5.0\ncout_moyen = 15000.0\n\n# Simulez les scénarios et déterminez proba_ruine :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nN_scenarios = 10000\nu = 500000.0\nc = 80000.0\nlambda_sin = 5.0\ncout_moyen = 15000.0\n\nnb_sinistres = np.random.poisson(lambda_sin, N_scenarios)\ncharge_totale = np.zeros(N_scenarios)\n\nfor i in range(N_scenarios):\n    if nb_sinistres[i] > 0:\n        charge_totale[i] = np.sum(np.random.exponential(cout_moyen, nb_sinistres[i]))\n\ncapital_fin = u + c - charge_totale\nruine_detectee = (capital_fin < 0)\nproba_ruine = float(np.mean(ruine_detectee))\n\nprint(f'Capital initial : {u:,.2f} €')\nprint(f'Charge moyenne annuelle des sinistres : {np.mean(charge_totale):,.2f} €')\nprint(f'Probabilité empirique de ruine : {proba_ruine:.4%}')\nprint(f'Conformité Solvabilité II (< 0.5%) : {proba_ruine < 0.005}')",
            "testPythonCode": "assert 'proba_ruine' in globals()\nassert 'capital_fin' in globals()\nassert 0 <= proba_ruine < 0.05",
            "hints": ["nb_sinistres = np.random.poisson(lambda_sin, N_scenarios)", "capital_fin = u + c - charge_totale", "proba_ruine = float(np.mean(capital_fin < 0))"],
            "datasets": []
        }
    ]
}
