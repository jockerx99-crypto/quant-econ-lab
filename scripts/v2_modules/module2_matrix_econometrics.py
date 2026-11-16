"""
Module 2 Version 2 : Algèbre Matricielle & Économétrie Financière (15 exercices Python)
"""

MODULE_2 = {
    "id": "python-finance-econometrics",
    "title": "Algèbre Matricielle & Économétrie Financière",
    "subtitle": "Matrices de Covariance, Valeurs Propres, GMVP & Modèles Factoriels",
    "icon": "TrendingUp",
    "description": "Plongez dans l'économétrie financière de pointe : calcul matriciel vectorisé, analyse spectrale, dé-bruitage de Marchenko-Pastur, optimisation de Markowitz (GMVP, Tangence), CAPM et GARCH(1,1).",
    "exercises": [
        {
            "id": "v2-py-1",
            "title": "1. Algèbre Matricielle Vectorisée en NumPy (@ & .T)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Débutant",
            "durationMinutes": 6,
            "description": "Calculez le rendement espéré et la variance d'un portefeuille de 3 actifs avec le produit matriciel.",
            "theoryMarkdown": """### Calcul Matriciel et Représentation Vectorielle des Portefeuilles

> 💡 **Rappel théorique : Formulation Matricielle de Markowitz**
> 
> Soit un portefeuille de $K$ actifs financiers :
> - Vecteur colonne des pondérations : $\\mathbf{w} = [w_1, w_2, \\dots, w_K]' \\in \\mathbb{R}^K$ avec $\\sum_{i=1}^K w_i = \\mathbf{w}' \\mathbf{1} = 1$.
> - Vecteur des espérances de rendements : $\\boldsymbol{\\mu} = [\\mu_1, \\mu_2, \\dots, \\mu_K]' \\in \\mathbb{R}^K$.
> - Matrice de variance-covariance : $\\Sigma \\in \\mathbb{R}^{K \\times K}$.
> 
> Le rendement espéré et la variance du portefeuille s'écrivent de manière compacte :
> $$\\mathbb{E}[R_p] = \\mathbf{w}' \\boldsymbol{\\mu} = \\sum_{i=1}^K w_i \\mu_i$$
> $$\\sigma_p^2 = \\operatorname{Var}(R_p) = \\mathbf{w}' \\Sigma \\mathbf{w} = \\sum_{i=1}^K \\sum_{j=1}^K w_i w_j \\sigma_{ij}$$

> 📌 **Opérateur Python Moderne `@` :**
> En Python 3.5+, l'opérateur `@` effectue le produit matriciel (équivalent à `np.matmul` ou `np.dot`).
> Pour calculer $\\mathbf{w}' \\Sigma \\mathbf{w}$ : `w.T @ Sigma @ w`.
""",
            "taskMarkdown": "Soit les poids `w = np.array([0.4, 0.35, 0.25])`, les espérances `mu = np.array([0.08, 0.10, 0.06])` et la matrice de covariance `Sigma = np.array([[0.04, 0.01, 0.005], [0.01, 0.06, 0.015], [0.005, 0.015, 0.03]])`. Calculez `rendement_espere = w @ mu`, la variance `variance_portefeuille = w @ Sigma @ w` et la volatilité `volatilite_portefeuille = np.sqrt(variance_portefeuille)`. Affichez les résultats.",
            "initialCode": "import numpy as np\n\nw = np.array([0.4, 0.35, 0.25])\nmu = np.array([0.08, 0.10, 0.06])\nSigma = np.array([\n    [0.04, 0.01, 0.005],\n    [0.01, 0.06, 0.015],\n    [0.005, 0.015, 0.03]\n])\n\n# Calculez rendement_espere, variance_portefeuille et volatilite_portefeuille :\n",
            "solutionCode": "import numpy as np\n\nw = np.array([0.4, 0.35, 0.25])\nmu = np.array([0.08, 0.10, 0.06])\nSigma = np.array([\n    [0.04, 0.01, 0.005],\n    [0.01, 0.06, 0.015],\n    [0.005, 0.015, 0.03]\n])\n\nrendement_espere = float(w @ mu)\nvariance_portefeuille = float(w @ Sigma @ w)\nvolatilite_portefeuille = float(np.sqrt(variance_portefeuille))\n\nprint(f'Rendement espéré : {rendement_espere:.4f}')\nprint(f'Variance : {variance_portefeuille:.6f}')\nprint(f'Volatilité : {volatilite_portefeuille:.4f}')",
            "testPythonCode": "assert 'rendement_espere' in globals()\nassert 'variance_portefeuille' in globals()\nassert 'volatilite_portefeuille' in globals()\nassert np.isclose(rendement_espere, 0.082, atol=1e-3)\nassert np.isclose(variance_portefeuille, 0.021025, atol=1e-4)",
            "hints": ["rendement_espere = float(w @ mu)", "variance_portefeuille = float(w @ Sigma @ w)", "volatilite_portefeuille = float(np.sqrt(variance_portefeuille))"],
            "datasets": []
        },
        {
            "id": "v2-py-2",
            "title": "2. Matrice de Variance-Covariance et Corrélation",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Estimez la matrice de variance-covariance et la matrice de corrélation à partir d'une matrice de rendements.",
            "theoryMarkdown": """### De la Matrice des Rendements Centrés à la Matrice de Corrélation

> 💡 **Rappel théorique : L'estimateur sans biais de l'échantillon**
> 
> Soit $X \\in \\mathbb{R}^{T \\times K}$ la matrice de $T$ observations de rendements pour $K$ actifs.
> 1. **Centrage des données** : $\\tilde{X} = X - \\mathbf{1}\\bar{\\mathbf{x}}'$ où $\\bar{\\mathbf{x}} = \\frac{1}{T} X' \\mathbf{1}$.
> 2. **Matrice de covariance empirique** :
>    $$\\Sigma = \\frac{1}{T-1} \\tilde{X}' \\tilde{X}$$
> 3. **Normalisation en matrice de corrélation $C$** :
>    $$C = D^{-1/2} \\Sigma D^{-1/2}$$
>    où $D = \\operatorname{diag}(\\sigma_{11}, \\sigma_{22}, \\dots, \\sigma_{KK})$ contient les variances sur la diagonale.
""",
            "taskMarkdown": "À partir des rendements simulés `X` (matrice $100 \\times 3$), calculez la matrice de covariance empirique `Sigma = np.cov(X, rowvar=False)` et la matrice de corrélation `C = np.corrcoef(X, rowvar=False)`. Affichez `Sigma` et `C`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 3) * [0.02, 0.03, 0.015]\n\n# Calculez Sigma et C avec np.cov et np.corrcoef :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 3) * [0.02, 0.03, 0.015]\n\nSigma = np.cov(X, rowvar=False)\nC = np.corrcoef(X, rowvar=False)\n\nprint('Matrice de Covariance Sigma :\\n', np.round(Sigma, 6))\nprint('Matrice de Corrélation C :\\n', np.round(C, 4))",
            "testPythonCode": "assert 'Sigma' in globals()\nassert 'C' in globals()\nassert Sigma.shape == (3, 3)\nassert C.shape == (3, 3)\nassert np.allclose(np.diag(C), 1.0)",
            "hints": ["Utilisez Sigma = np.cov(X, rowvar=False)", "C = np.corrcoef(X, rowvar=False)"],
            "datasets": []
        },
        {
            "id": "v2-py-3",
            "title": "3. Décomposition Spectrale : Valeurs & Vecteurs Propres",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Décomposez la matrice de covariance en valeurs propres et vecteurs propres (Théorème Spectral).",
            "theoryMarkdown": """### Le Théorème Spectral et la Géométrie du Risque

> 💡 **Rappel fondamental : Diagonalisation d'une Matrice Symétrique**
> 
> Toute matrice symétrique réelle $\\Sigma \\in \\mathbb{R}^{K \\times K}$ est diagonalisable dans une base orthonormée de vecteurs propres :
> $$\\Sigma = V \\Lambda V' = \\sum_{i=1}^K \\lambda_i \\mathbf{v}_i \\mathbf{v}_i'$$
> - $\\Lambda = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\dots, \\lambda_K)$ contient les **valeurs propres** (variances le long des axes principaux).
> - $V = [\\mathbf{v}_1, \\dots, \\mathbf{v}_K]$ est une matrice orthogonale ($V'V = V V' = I_K$) formée des **vecteurs propres** (directions des facteurs de risque non corrélés).
> 
> Pour qu'une matrice soit une vraie matrice de covariance admissible, elle doit être **semi-définie positive** :
> $$\\lambda_i \\ge 0 \\quad (\\forall i \\in \\{1, \\dots, K\\})$$

![Décomposition Spectrale et Ellipsoïde de Covariance](/images/theory/fig_spectral_covariance.png)

> 🔍 **Comprendre ce graphique : Géométrie de la matrice de covariance**
> 
> - **Nuage de points bivarié** : Représente la dispersion conjointe des rendements de deux actifs corrélés positivement.
> - **Ellipsoïde de dispersion (ellipse bleue)** : Délimite la zone de confiance à 95% de probabilité. L'inclinaison de l'ellipse reflète la corrélation positive entre les actifs.
> - **Vecteurs propres orthogonaux ($\\\\mathbf{v}_1, \\\\mathbf{v}_2$)** :
>   - Le grand axe $\\mathbf{v}_1$ (en rouge) s'aligne sur la plus grande dispersion : c'est la **première composante principale**, dont la longueur est proportionnelle à $\\sqrt{\\lambda_1}$.
>   - Le petit axe $\\mathbf{v}_2$ (en vert) est strictement orthogonal ($90^\\circ$) : il capture le risque résiduel décorrélé, avec une variance $\\lambda_2$.
""",
            "taskMarkdown": "À partir de la matrice `Sigma`, calculez les valeurs propres `valeurs_propres` et vecteurs propres `vecteurs_propres` avec `np.linalg.eigh(Sigma)`. Vérifiez ensuite la reconstruction `Sigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T`. Affichez les valeurs propres.",
            "initialCode": "import numpy as np\n\nSigma = np.array([\n    [0.05, 0.02, 0.01],\n    [0.02, 0.08, 0.03],\n    [0.01, 0.03, 0.04]\n])\n\n# Calculez valeurs_propres, vecteurs_propres et Sigma_reconstruite :\n",
            "solutionCode": "import numpy as np\n\nSigma = np.array([\n    [0.05, 0.02, 0.01],\n    [0.02, 0.08, 0.03],\n    [0.01, 0.03, 0.04]\n])\n\nvaleurs_propres, vecteurs_propres = np.linalg.eigh(Sigma)\nSigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T\n\nprint('Valeurs propres lambda :\\n', np.round(valeurs_propres, 6))\nprint('Reconstruction exacte :', np.allclose(Sigma, Sigma_reconstruite))",
            "testPythonCode": "assert 'valeurs_propres' in globals()\nassert 'vecteurs_propres' in globals()\nassert 'Sigma_reconstruite' in globals()\nassert np.all(valeurs_propres > 0)\nassert np.allclose(Sigma, Sigma_reconstruite)",
            "hints": ["valeurs_propres, vecteurs_propres = np.linalg.eigh(Sigma)", "Sigma_reconstruite = vecteurs_propres @ np.diag(valeurs_propres) @ vecteurs_propres.T"],
            "datasets": []
        },
        {
            "id": "v2-py-4",
            "title": "4. Test de Définie-Positivité & Projection sur le Cône PSD",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Corrigez une matrice de corrélation non définie positive en tronquant les valeurs propres négatives (Méthode de Higham).",
            "theoryMarkdown": """### Régularisation des Matrices Empiriques non Définies Positives

> 💡 **Le Cauchemar du Quant : Valeurs Propres Négatives**
> 
> En pratique, l'asynchronisme des cotations, les données manquantes ou l'utilisation de corrélations par paires (*pairwise deletion*) brisent souvent la définie-positivité d'une matrice empirique :
> $$\\exists i : \\lambda_i < 0 \\implies \\mathbf{w}' \\Sigma \\mathbf{w} < 0 \\quad (\\text{Variance de portefeuille négative !})$$
> 
> **Algorithme de Projection Spectrale (Spectral Clipping) :**
> On projette la matrice sur le cône des matrices semi-définies positives en remplaçant toute valeur propre négative par un seuil $\\epsilon > 0$ :
> $$\\Lambda_{\\text{PSD}} = \\max(\\Lambda, \\epsilon I)$$
> $$\\Sigma_{\\text{PSD}} = V \\Lambda_{\\text{PSD}} V'$$
""",
            "taskMarkdown": "Soit la matrice non définie-positive `Sigma_perturbee`. Calculez ses valeurs propres et vecteurs propres. Créez `valeurs_propres_psd = np.maximum(valeurs_propres, 1e-6)`. Reconstruisez `Sigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T`. Affichez la plus petite valeur propre avant et après correction.",
            "initialCode": "import numpy as np\n\n# Matrice empirique bruitée possédant une valeur propre négative\nSigma_perturbee = np.array([\n    [1.0, 0.9, 0.7],\n    [0.9, 1.0, 0.95],\n    [0.7, 0.95, 1.0]\n])\n\n# Régularisez la matrice sur le cône PSD :\n",
            "solutionCode": "import numpy as np\n\nSigma_perturbee = np.array([\n    [1.0, 0.9, 0.7],\n    [0.9, 1.0, 0.95],\n    [0.7, 0.95, 1.0]\n])\n\nvaleurs_propres, vecteurs_propres = np.linalg.eigh(Sigma_perturbee)\nvaleurs_propres_psd = np.maximum(valeurs_propres, 1e-6)\nSigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T\n\nprint(f'Plus petite valeur propre brute : {valeurs_propres.min():.6f}')\nprint(f'Plus petite valeur propre corrigée : {valeurs_propres_psd.min():.6f}')",
            "testPythonCode": "assert 'Sigma_psd' in globals()\nassert 'valeurs_propres_psd' in globals()\nassert np.all(valeurs_propres_psd >= 1e-6)\nassert np.all(np.linalg.eigvalsh(Sigma_psd) > 0)",
            "hints": ["valeurs_propres_psd = np.maximum(valeurs_propres, 1e-6)", "Sigma_psd = vecteurs_propres @ np.diag(valeurs_propres_psd) @ vecteurs_propres.T"],
            "datasets": []
        },
        {
            "id": "v2-py-5",
            "title": "5. Analyse en Composantes Principales (PCA) de la Courbe des Taux",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Extrayez les 3 facteurs canoniques de Litterman-Scheinkman (Niveau, Pente, Courbure) par ACP.",
            "theoryMarkdown": """### Modèle de Litterman-Scheinkman (1991) : Les Facteurs Invariants des Taux

> 💡 **Rappel fondamental : Les 3 Composantes Principales de la Courbe**
> 
> L'application de l'ACP sur la structure par terme des taux souverains (maturités 1Y à 30Y) révèle que 3 composantes orthogonales expliquent plus de **98%** de la variance totale :
> 1. **PC1 - Facteur Niveau (Level) [~80-90% de la variance]** : translation parallèle de la courbe (les vecteurs propres ont des poids quasi-constants et de même signe).
> 2. **PC2 - Facteur Pente (Slope) [~8-12% de la variance]** : rotation de la courbe (aplatissement ou pentification, poids monotones du court terme vers le long terme).
> 3. **PC3 - Facteur Courbure (Curvature) [~2-5% de la variance]** : torsion des maturités intermédiaires (forme en papillon / butterfly).

![Les 3 Composantes Principales de la Courbe des Taux](/images/theory/fig_pca_yield_curve.png)

> 🔍 **Comprendre ce graphique : Décomposition factorielle de Litterman & Scheinkman**
> 
> - **PC1 (Niveau en bleu)** : Les chargements factoriels sont strictement positifs et uniformes sur toutes les maturités (1Y à 30Y). Une hausse de PC1 décale l'ensemble de la courbe vers le haut sans la déformer.
> - **PC2 (Pente en vert)** : Les poids traversent 0 (fortement négatifs sur le 1Y-2Y, fortement positifs sur le 20Y-30Y). Une variation de PC2 fait pivoter la courbe, modélisant la pentification (*steepening*) ou l'inversion de courbe (*flattening*).
> - **PC3 (Courbure en orange)** : Forme concave en papillon (*butterfly*). Les taux moyens (5Y-10Y) bougent en opposition avec les extrémités courtes (1Y) et longues (30Y).
""",
            "taskMarkdown": "À partir des variations mensuelles des taux souverains `dX` (matrice $12 \\times 6$), calculez la matrice de covariance `cov_mat = np.cov(dX, rowvar=False)`. Extrayez les valeurs propres avec `np.linalg.eigh(cov_mat)` et triez-les par ordre décroissant. Calculez le vecteur de ratio de variance expliquée `ratio_explique = valeurs_triees / valeurs_triees.sum()` et la part cumulée des 3 premiers facteurs `pct_top3 = float(ratio_explique[:3].sum() * 100)`. Affichez `pct_top3`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(123)\n# Simulation des variations mensuelles de 6 maturités (1Y, 2Y, 5Y, 10Y, 20Y, 30Y)\n# Facteur niveau dominant + facteur pente + bruit résiduel\nlevel = np.random.randn(24, 1) * 0.25\nslope = np.random.randn(24, 1) * np.linspace(-0.15, 0.15, 6)\ndX = level + slope + np.random.randn(24, 6) * 0.03\n\n# Calculez cov_mat, valeurs_triees, ratio_explique et pct_top3 :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(123)\nlevel = np.random.randn(24, 1) * 0.25\nslope = np.random.randn(24, 1) * np.linspace(-0.15, 0.15, 6)\ndX = level + slope + np.random.randn(24, 6) * 0.03\n\ncov_mat = np.cov(dX, rowvar=False)\nevals, _ = np.linalg.eigh(cov_mat)\nvaleurs_triees = evals[::-1]\nratio_explique = valeurs_triees / valeurs_triees.sum()\npct_top3 = float(ratio_explique[:3].sum() * 100)\n\nprint('Ratios de variance expliquée :', np.round(ratio_explique, 4))\nprint(f'Variance cumulée expliquée par les 3 premiers facteurs : {pct_top3:.2f}%')",
            "testPythonCode": "assert 'ratio_explique' in globals()\nassert 'pct_top3' in globals()\nassert pct_top3 > 90.0\nassert np.isclose(ratio_explique.sum(), 1.0)",
            "hints": ["evals, _ = np.linalg.eigh(cov_mat)", "valeurs_triees = evals[::-1]", "ratio_explique = valeurs_triees / valeurs_triees.sum()", "pct_top3 = float(ratio_explique[:3].sum() * 100)"],
            "datasets": []
        },
        {
            "id": "v2-py-6",
            "title": "6. Dé-bruitage de Marchenko-Pastur (Random Matrix Theory)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Appliquez les résultats de la physique théorique (RMT) pour identifier les valeurs propres portant un vrai signal économique.",
            "theoryMarkdown": """### Théorie des Matrices Aléatoires (RMT) et Loi de Marchenko-Pastur

> 💡 **Rappel fondamental : Bruit d'Échantillonnage et Spectre Aléatoire**
> 
> Pour une matrice de $T$ observations de $N$ actifs non corrélés, le ratio $q = T / N$ gouverne la dispersion purement aléatoire des valeurs propres de la matrice de corrélation.
> La **loi de Marchenko-Pastur (1967)** démontre que les valeurs propres dues au pur bruit blanc sont bornées dans :
> $$\\lambda_{\\pm} = \\sigma^2 \\left( 1 \\pm \\sqrt{\\frac{1}{q}} \\right)^2 = \\sigma^2 \\left( 1 \\pm \\sqrt{\\frac{N}{T}} \\right)^2$$
> 
> **Règle de Décision Quantitative :**
> - **$\\lambda_i \\le \\lambda_+$** : Valeur propre compatible avec du bruit statistique $\\implies$ à éliminer ou rétrécir.
> - **$\\lambda_i > \\lambda_+$** : Valeur propre portant une information financière authentique (vrai facteur macroéconomique / sectoriel).
""",
            "taskMarkdown": "Soit $T = 500$ observations et $N = 50$ actifs ($q = 10$). Calculez la borne supérieure théorique de bruit `lambda_plus = (1.0 + np.sqrt(N / T))**2`. Pour un vecteur de valeurs propres observées `evals_obs`, comptez le nombre de vrais signaux `nb_signaux = int(np.sum(evals_obs > lambda_plus))`. Affichez `lambda_plus` et `nb_signaux`.",
            "initialCode": "import numpy as np\n\nT = 500\nN = 50\n\n# Valeurs propres observées sur un portefeuille réel (quelques facteurs de marché + bruit)\nevals_obs = np.array([12.5, 3.8, 2.1, 1.7, 1.4, 1.2, 1.1, 0.95, 0.82, 0.75])\n\n# Calculez lambda_plus et nb_signaux :\n",
            "solutionCode": "import numpy as np\n\nT = 500\nN = 50\nevals_obs = np.array([12.5, 3.8, 2.1, 1.7, 1.4, 1.2, 1.1, 0.95, 0.82, 0.75])\n\nlambda_plus = float((1.0 + np.sqrt(N / T))**2)\nnb_signaux = int(np.sum(evals_obs > lambda_plus))\n\nprint(f'Borne supérieure de bruit lambda_+ : {lambda_plus:.4f}')\nprint(f'Nombre de facteurs authentiques (signaux) : {nb_signaux}')",
            "testPythonCode": "assert 'lambda_plus' in globals()\nassert 'nb_signaux' in globals()\nassert np.isclose(lambda_plus, 1.73205, atol=0.01)\nassert nb_signaux == 3",
            "hints": ["lambda_plus = float((1.0 + np.sqrt(N / T))**2)", "nb_signaux = int(np.sum(evals_obs > lambda_plus))"],
            "datasets": []
        },
        {
            "id": "v2-py-7",
            "title": "7. Rétrécissement de Covariance : Estimateur de Ledoit-Wolf",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Combinez la matrice de covariance empirique et une cible structurée pour minimiser l'erreur quadratique moyenne.",
            "theoryMarkdown": """### Compromis Biais-Variance : Le Shrinkage de Ledoit & Wolf (2004)

> 💡 **Rappel conceptuel : Pourquoi la covariance empirique échoue en out-of-sample**
> 
> - La matrice empirique $\\Sigma_{\\text{sample}}$ est **sans biais**, mais possède une **très forte variance d'échantillonnage**, surtout quand le nombre d'actifs $K$ est grand devant $T$.
> - Une cible structurée $F$ (ex: corrélation moyenne constante ou modèle à un facteur) a un **biais**, mais une **variance quasi-nulle**.
> 
> L'estimateur de Shrinkage linéaire trouve le coefficient optimal $\\alpha^* \\in [0, 1]$ minimisant la perte de Frobenius :
> $$\\Sigma_{\\text{LW}} = (1 - \\alpha) \\Sigma_{\\text{sample}} + \\alpha F$$
""",
            "taskMarkdown": "Soit la matrice empirique `Sigma_sample` et la cible de variance constante `F = np.eye(3) * np.trace(Sigma_sample) / 3.0`. Pour une intensité de shrinkage `alpha = 0.25`, calculez la matrice rétrécie `Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F`. Affichez `Sigma_lw`.",
            "initialCode": "import numpy as np\n\nSigma_sample = np.array([\n    [0.08, 0.03, 0.01],\n    [0.03, 0.12, 0.05],\n    [0.01, 0.05, 0.06]\n])\nalpha = 0.25\n\n# Calculez la matrice cible F et la matrice rétrécie Sigma_lw :\n",
            "solutionCode": "import numpy as np\n\nSigma_sample = np.array([\n    [0.08, 0.03, 0.01],\n    [0.03, 0.12, 0.05],\n    [0.01, 0.05, 0.06]\n])\nalpha = 0.25\n\nF = np.eye(3) * (np.trace(Sigma_sample) / 3.0)\nSigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F\n\nprint('Matrice Rétrécie de Ledoit-Wolf Sigma_lw :\\n', np.round(Sigma_lw, 5))",
            "testPythonCode": "assert 'F' in globals()\nassert 'Sigma_lw' in globals()\nassert Sigma_lw.shape == (3, 3)\nassert np.isclose(np.trace(Sigma_lw), np.trace(Sigma_sample))",
            "hints": ["F = np.eye(3) * (np.trace(Sigma_sample) / 3.0)", "Sigma_lw = (1.0 - alpha) * Sigma_sample + alpha * F"],
            "datasets": []
        },
        {
            "id": "v2-py-8",
            "title": "8. Portefeuille de Variance Minimale Globale (GMVP Analytique)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Résolvez analytiquement le portefeuille GMVP de Markowitz sans requérir d'estimation des espérances de rendements.",
            "theoryMarkdown": """### Le Portefeuille de Variance Minimale Globale (GMVP)

> 💡 **Rappel mathématique : La Solution Analytique par le Lagrangien**
> 
> Le GMVP résout le problème d'optimisation quadratique suivant :
> $$\\min_{\\mathbf{w}} \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} \\quad \\text{sous la contrainte} \\quad \\mathbf{w}' \\mathbf{1} = 1$$
> 
> En écrivant le lagrangien $\\mathcal{L}(\\mathbf{w}, \\lambda) = \\frac{1}{2} \\mathbf{w}' \\Sigma \\mathbf{w} - \\lambda (\\mathbf{w}' \\mathbf{1} - 1)$, les conditions du premier ordre (KKT) donnent :
> $$\\nabla_{\\mathbf{w}} \\mathcal{L} = \\Sigma \\mathbf{w} - \\lambda \\mathbf{1} = 0 \\implies \\mathbf{w}^* = \\lambda \\Sigma^{-1} \\mathbf{1}$$
> En appliquant la contrainte $\\mathbf{1}' \\mathbf{w}^* = 1$, on obtient la solution fermée remarquable :
> $$\\mathbf{w}_{GMVP} = \\frac{\\Sigma^{-1} \\mathbf{1}}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}$$
> La variance minimale correspondante est :
> $$\\sigma^2_{GMVP} = \\frac{1}{\\mathbf{1}' \\Sigma^{-1} \\mathbf{1}}$$
""",
            "taskMarkdown": "Soit la matrice de covariance `Sigma`. Calculez l'inverse `inv_Sigma = np.linalg.inv(Sigma)`, le vecteur unitaire `ones = np.ones(3)`, le vecteur des poids optimaux `w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)` et la volatilité minimale `vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))`. Affichez les poids et la volatilité.",
            "initialCode": "import numpy as np\n\nSigma = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.06, 0.02],\n    [0.008, 0.02, 0.03]\n])\n\n# Calculez w_gmvp et vol_gmvp :\n",
            "solutionCode": "import numpy as np\n\nSigma = np.array([\n    [0.04, 0.015, 0.008],\n    [0.015, 0.06, 0.02],\n    [0.008, 0.02, 0.03]\n])\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(Sigma))\nw_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)\nvol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))\n\nprint('Poids optimaux GMVP :', np.round(w_gmvp, 4))\nprint(f'Somme des poids : {w_gmvp.sum():.4f}')\nprint(f'Volatilité minimale annualisée : {vol_gmvp:.4f}')",
            "testPythonCode": "assert 'w_gmvp' in globals()\nassert 'vol_gmvp' in globals()\nassert np.isclose(w_gmvp.sum(), 1.0)\nassert vol_gmvp > 0\nassert np.isclose(vol_gmvp, np.sqrt(w_gmvp @ Sigma @ w_gmvp))",
            "hints": ["inv_Sigma = np.linalg.inv(Sigma)", "ones = np.ones(len(Sigma))", "w_gmvp = (inv_Sigma @ ones) / (ones @ inv_Sigma @ ones)", "vol_gmvp = float(np.sqrt(1.0 / (ones @ inv_Sigma @ ones)))"],
            "datasets": []
        },
        {
            "id": "v2-py-9",
            "title": "9. Frontière Efficiente de Markowitz (Tracé & Optimisation)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Tracez la frontière efficiente (parabole dans le plan variance-espérance) à l'aide de Matplotlib.",
            "theoryMarkdown": """### Géométrie de la Frontière Efficiente de Markowitz (1952)

> 💡 **Rappel : La parabole de Merton (1972)**
> 
> En combinant deux contraintes linéaires (budget $\\mathbf{w}'\\mathbf{1} = 1$ et rendement cible $\\mathbf{w}'\\boldsymbol{\\mu} = \\mu_p$), l'ensemble des portefeuilles de variance minimale décrit une hyperbole dans le plan $(\\sigma_p, \\mu_p)$ et une parabole exacte dans le plan $(\\sigma_p^2, \\mu_p)$ :
> $$\\sigma_p^2 = \\frac{A \\mu_p^2 - 2B \\mu_p + C}{AC - B^2}$$
> où $A = \\mathbf{1}'\\Sigma^{-1}\\mathbf{1}$, $B = \\mathbf{1}'\\Sigma^{-1}\\boldsymbol{\\mu}$, $C = \\boldsymbol{\\mu}'\\Sigma^{-1}\\boldsymbol{\\mu}$.

![Frontière Efficiente de Markowitz et GMVP](/images/theory/fig_markowitz_efficient_frontier.png)

> 🔍 **Comprendre ce graphique : L'univers risque-rendement de Markowitz**
> 
> - **L'hyperbole (Markowitz Bullet)** : Délimite la frontière de tous les portefeuilles réalisables avec les actifs risqués. Tout portefeuille à l'intérieur de la zone grise offre un rendement sous-optimal pour son niveau de risque.
> - **Le point rouge (GMVP)** : Le portefeuille de variance minimale globale (*Global Minimum Variance Portfolio*). C'est le point d'inflexion extrême gauche, où le risque $\\sigma$ est minimal absolu ($1 / \\sqrt{A}$).
> - **La frontière efficiente (branche bleue supérieure)** : La demi-hyperbole située au-dessus du GMVP. C'est le lieu géométrique des portefeuilles dominants : impossible d'obtenir un meilleur rendement $\\mathbb{E}[R]$ sans accepter une volatilité $\\sigma$ plus élevée.
> - **La Capital Market Line (CML en pointillés)** : Tangente à la frontière passant par le taux sans risque $r_f$, identifiant le portefeuille de ratio de Sharpe maximal.
""",
            "taskMarkdown": "Calculez les constantes scalaires $A, B, C$. Pour une grille de 50 rendements cibles `mu_targets = np.linspace(0.05, 0.12, 50)`, calculez les variances minimales associées `var_targets = (A * mu_targets**2 - 2*B * mu_targets + C) / (A*C - B**2)`. Tracez la frontière efficiente avec `plt.plot(np.sqrt(var_targets), mu_targets)`. Affichez le déterminant $AC - B^2$.",
            "initialCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\nmu = np.array([0.06, 0.09, 0.11])\nSigma = np.array([\n    [0.02, 0.005, 0.002],\n    [0.005, 0.04, 0.01],\n    [0.002, 0.01, 0.05]\n])\n\n# Calculez A, B, C, var_targets et générez le tracé Matplotlib :\n",
            "solutionCode": "import numpy as np\nimport matplotlib.pyplot as plt\n\nmu = np.array([0.06, 0.09, 0.11])\nSigma = np.array([\n    [0.02, 0.005, 0.002],\n    [0.005, 0.04, 0.01],\n    [0.002, 0.01, 0.05]\n])\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(mu))\n\nA = float(ones @ inv_Sigma @ ones)\nB = float(ones @ inv_Sigma @ mu)\nC = float(mu @ inv_Sigma @ mu)\nDelta = A * C - B**2\n\nmu_targets = np.linspace(0.05, 0.12, 50)\nvar_targets = (A * mu_targets**2 - 2 * B * mu_targets + C) / Delta\nvols = np.sqrt(var_targets)\n\nplt.figure(figsize=(6, 4))\nplt.plot(vols * 100, mu_targets * 100, color='#0284c7', lw=2.2, label='Frontière Efficiente')\nplt.scatter([np.sqrt(1/A)*100], [B/A*100], color='#e11d48', s=60, zorder=5, label='GMVP')\nplt.xlabel('Volatilité (%)')\nplt.ylabel('Rendement Espéré (%)')\nplt.title('Frontière Efficiente de Markowitz')\nplt.legend()\nplt.grid(True, alpha=0.3)\n\nprint(f'Constantes : A={A:.2f}, B={B:.2f}, C={C:.2f}, Delta={Delta:.4f}')",
            "testPythonCode": "assert 'A' in globals()\nassert 'B' in globals()\nassert 'C' in globals()\nassert 'Delta' in globals()\nassert Delta > 0",
            "hints": ["A = float(ones @ inv_Sigma @ ones)", "B = float(ones @ inv_Sigma @ mu)", "C = float(mu @ inv_Sigma @ mu)", "Delta = A * C - B**2"],
            "datasets": []
        },
        {
            "id": "v2-py-10",
            "title": "10. Portefeuille de Tangence & Maximisation du Ratio de Sharpe",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Déterminez le portefeuille tangent à la Capital Market Line (CML) en présence d'un actif sans risque.",
            "theoryMarkdown": """### Le Théorème de Séparation de Tobin (1958) & Portefeuille de Tangence

> 💡 **Rappel théorique : La Capital Market Line (CML)**
> 
> En présence d'un actif sans risque rapportant $r_f$, la frontière efficiente devient un segment de droite reliant $r_f$ au **portefeuille de tangence $\\mathbf{w}_T$**, qui maximise la pente (le ratio de Sharpe) :
> $$\\max_{\\mathbf{w}} \\frac{\\mathbf{w}'\\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}'\\Sigma\\mathbf{w}}} \\quad \\text{sous} \\quad \\mathbf{w}'\\mathbf{1} = 1$$
> 
> La formule fermée analytique du portefeuille de tangence est :
> $$\\mathbf{w}_T = \\frac{\\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})}{\\mathbf{1}' \\Sigma^{-1} (\\boldsymbol{\\mu} - r_f \\mathbf{1})}$$
""",
            "taskMarkdown": "Pour un taux sans risque $r_f = 0.025$, calculez le vecteur des primes de risque `exces_mu = mu - rf * ones`, le vecteur de tangence `w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)` et le ratio de Sharpe optimal `sharpe_opt = float((w_tangence @ mu - rf) / np.sqrt(w_tangence @ Sigma @ w_tangence))`. Affichez `w_tangence` et `sharpe_opt`.",
            "initialCode": "import numpy as np\n\nmu = np.array([0.07, 0.09, 0.12])\nSigma = np.array([\n    [0.03, 0.008, 0.005],\n    [0.008, 0.05, 0.012],\n    [0.005, 0.012, 0.07]\n])\nrf = 0.025\n\n# Calculez w_tangence et sharpe_opt :\n",
            "solutionCode": "import numpy as np\n\nmu = np.array([0.07, 0.09, 0.12])\nSigma = np.array([\n    [0.03, 0.008, 0.005],\n    [0.008, 0.05, 0.012],\n    [0.005, 0.012, 0.07]\n])\nrf = 0.025\n\ninv_Sigma = np.linalg.inv(Sigma)\nones = np.ones(len(mu))\nexces_mu = mu - rf * ones\nw_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)\n\nmu_T = float(w_tangence @ mu)\nvol_T = float(np.sqrt(w_tangence @ Sigma @ w_tangence))\nsharpe_opt = (mu_T - rf) / vol_T\n\nprint('Poids du portefeuille de Tangence :', np.round(w_tangence, 4))\nprint(f'Rendement espéré : {mu_T:.4f}, Volatilité : {vol_T:.4f}')\nprint(f'Ratio de Sharpe maximal : {sharpe_opt:.4f}')",
            "testPythonCode": "assert 'w_tangence' in globals()\nassert 'sharpe_opt' in globals()\nassert np.isclose(w_tangence.sum(), 1.0)\nassert sharpe_opt > 0",
            "hints": ["exces_mu = mu - rf * ones", "w_tangence = (inv_Sigma @ exces_mu) / (ones @ inv_Sigma @ exces_mu)", "sharpe_opt = (float(w_tangence @ mu) - rf) / float(np.sqrt(w_tangence @ Sigma @ w_tangence))"],
            "datasets": []
        },
        {
            "id": "v2-py-11",
            "title": "11. Modèle d'Évaluation des Actifs Financiers (CAPM) : Bêta & Alpha",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Estimez le bêta de marché et l'alpha de Jensen par régression linéaire OLS.",
            "theoryMarkdown": """### Le Capital Asset Pricing Model (CAPM) de Sharpe-Lintner

> 💡 **Rappel conceptuel : Risque Systématique vs Risque Spécifique**
> 
> L'équation de régression du CAPM relie l'excès de rendement d'un actif $i$ à celui du marché $m$ :
> $$R_{i,t} - r_f = \\alpha_i + \\beta_i (R_{m,t} - r_f) + \\varepsilon_{i,t}$$
> - **$\\beta_i = \\frac{\\operatorname{Cov}(R_i, R_m)}{\\operatorname{Var}(R_m)}$** : mesure l'exposition au **risque systématique non diversifiable**.
> - **$\\alpha_i$ (Alpha de Jensen)** : surperformance anormale non expliquée par l'exposition au marché.
> - **Décomposition du risque total** :
>   $$\\operatorname{Var}(R_i) = \\beta_i^2 \\sigma_m^2 + \\sigma_{\\varepsilon}^2$$
""",
            "taskMarkdown": "À partir des excès de rendements de marché `R_m` et de l'actif `R_i`, régressez `R_i` sur une constante et `R_m` avec `sm.OLS`. Extrayez l'alpha estimé `alpha_jensen = float(model.params[0])`, le bêta `beta_capm = float(model.params[1])` et le $R^2$ `r_squared = float(model.rsquared)`. Affichez les paramètres.",
            "initialCode": "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(42)\nT = 120\nR_m = np.random.randn(T) * 0.04 + 0.005\nR_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02\n\n# Estimez le CAPM avec statsmodels OLS :\n",
            "solutionCode": "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(42)\nT = 120\nR_m = np.random.randn(T) * 0.04 + 0.005\nR_i = 0.002 + 1.25 * R_m + np.random.randn(T) * 0.02\n\nX = sm.add_constant(R_m)\nmodel = sm.OLS(R_i, X).fit()\n\nalpha_jensen = float(model.params[0])\nbeta_capm = float(model.params[1])\nr_squared = float(model.rsquared)\n\nprint(f'Alpha de Jensen : {alpha_jensen:.5f}')\nprint(f'Bêta du CAPM : {beta_capm:.4f}')\nprint(f'R-carré : {r_squared:.4f}')",
            "testPythonCode": "assert 'alpha_jensen' in globals()\nassert 'beta_capm' in globals()\nassert 'r_squared' in globals()\nassert np.isclose(beta_capm, 1.25, atol=0.15)\nassert r_squared > 0.5",
            "hints": ["X = sm.add_constant(R_m)", "model = sm.OLS(R_i, X).fit()", "alpha_jensen = float(model.params[0])", "beta_capm = float(model.params[1])"],
            "datasets": []
        },
        {
            "id": "v2-py-12",
            "title": "12. Modèle Multi-Factoriel de Fama-French à 3 Facteurs",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 10,
            "description": "Estimez les sensibilités factorielles à la prime de marché, prime de taille (SMB) et prime de valeur (HML).",
            "theoryMarkdown": """### Au-delà du Marché : Le Modèle Fama & French (1993)

> 💡 **Rappel théorique : Les Primes de Risque Systémiques**
> 
> Eugene Fama et Kenneth French (Prix Nobel 2013) ont démontré que le bêta du CAPM seul ne suffit pas à expliquer les rendements des actions. Ils introduisent 2 facteurs de risque empiriques supplémentaires :
> $$R_{i,t} - r_{f,t} = \\alpha_i + \\beta_i (R_{m,t} - r_{f,t}) + s_i \\cdot SMB_t + h_i \\cdot HML_t + \\varepsilon_{i,t}$$
> - **$SMB$ (Small Minus Big)** : prime de taille (surperformance historique des petites capitalisations boursières par rapport aux grandes).
> - **$HML$ (High Minus Low)** : prime de valeur (surperformance des actions 'Value' à fort ratio Book-to-Market par rapport aux actions 'Growth').
""",
            "taskMarkdown": "À partir des facteurs simulés `X_factors` (constante, $Mkt-RF$, $SMB$, $HML$) et des rendements `Y_port`, ajustez le modèle Fama-French avec `sm.OLS`. Extrayez les 4 coefficients `coeffs = model.params` et vérifiez que les p-valeurs `pvalues = model.pvalues` sont calculées. Affichez le résumé du modèle.",
            "initialCode": "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(99)\nT = 200\nMkt_RF = np.random.randn(T) * 0.03\nSMB = np.random.randn(T) * 0.015\nHML = np.random.randn(T) * 0.015\nY_port = 0.001 + 0.95 * Mkt_RF + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008\n\nX_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\n\n# Ajustez le modèle OLS multi-factoriel :\n",
            "solutionCode": "import numpy as np\nimport statsmodels.api as sm\n\nnp.random.seed(99)\nT = 200\nMkt_RF = np.random.randn(T) * 0.03\nSMB = np.random.randn(T) * 0.015\nHML = np.random.randn(T) * 0.015\nY_port = 0.001 + 0.95 * Mkt_RF + 0.45 * SMB - 0.20 * HML + np.random.randn(T) * 0.008\n\nX_factors = sm.add_constant(np.column_stack([Mkt_RF, SMB, HML]))\nmodel = sm.OLS(Y_port, X_factors).fit()\n\ncoeffs = model.params\npvalues = model.pvalues\n\nprint(f'Coefficients [Alpha, Mkt, SMB, HML] :\\n', np.round(coeffs, 4))\nprint(f'R2 du modèle multi-factoriel : {model.rsquared:.4f}')",
            "testPythonCode": "assert 'coeffs' in globals()\nassert 'pvalues' in globals()\nassert len(coeffs) == 4\nassert np.isclose(coeffs[1], 0.95, atol=0.10)\nassert np.isclose(coeffs[2], 0.45, atol=0.10)",
            "hints": ["model = sm.OLS(Y_port, X_factors).fit()", "coeffs = model.params", "pvalues = model.pvalues"],
            "datasets": []
        },
        {
            "id": "v2-py-13",
            "title": "13. Modélisation de la Volatilité Conditionnelle : GARCH(1,1)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Avancé",
            "durationMinutes": 12,
            "description": "Simulez un processus GARCH(1,1) de Bollerslev pour reproduire le clustering de volatilité des marchés boursiers.",
            "theoryMarkdown": """### Hétéroscédasticité Conditionnelle Auto-Régressive : Le GARCH(1,1)

> 💡 **Rappel : Le Phénomène Stylisé de Clustering de Volatilité**
> 
> Comme l'observait Benoît Mandelbrot (1963) : *"Les grandes variations sont suivies par de grandes variations, et les petites par de petites variations"*.
> Le modèle **GARCH(1,1)** de Tim Bollerslev (1986) spécifie la variance conditionnelle $\\sigma_t^2$ :
> $$\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2$$
> - $\\omega > 0$ : variance plancher à long terme.
> - $\\alpha$ : réaction aux chocs récents de marché (effet ARCH).
> - $\\beta$ : persistance de la volatilité passée (effet GARCH).
> - **Condition de stationnarité** : $\\alpha + \\beta < 1$.
> - **Volatilité inconditionnelle à long terme** :
>   $$\\sigma_L^2 = \\frac{\\omega}{1 - (\\alpha + \\beta)}$$
""",
            "taskMarkdown": "Soit les paramètres $\\omega = 0.00001$, $\\alpha = 0.08$, $\\beta = 0.90$. Calculez la variance à long terme `var_long_terme = omega / (1.0 - (alpha + beta))`. Simulez récursivement la série de variance `sigma2` sur $T=500$ périodes en démarrant à `sigma2[0] = var_long_terme` avec des innovations $\\varepsilon_t = \\sigma_t Z_t$ où $Z_t \\sim \\mathcal{N}(0, 1)$. Affichez `var_long_terme`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\nT = 500\nomega = 1e-5\nalpha = 0.08\nbeta = 0.90\n\n# Simulez la variance conditionnelle sigma2 du GARCH(1,1) :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nT = 500\nomega = 1e-5\nalpha = 0.08\nbeta = 0.90\n\nvar_long_terme = float(omega / (1.0 - (alpha + beta)))\nZ = np.random.randn(T)\nsigma2 = np.zeros(T)\neps = np.zeros(T)\n\nsigma2[0] = var_long_terme\neps[0] = np.sqrt(sigma2[0]) * Z[0]\n\nfor t in range(1, T):\n    sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]\n    eps[t] = np.sqrt(sigma2[t]) * Z[t]\n\nprint(f'Variance à long terme : {var_long_terme:.6f}')\nprint(f'Volatilité annualisée moyenne : {np.mean(np.sqrt(sigma2)) * np.sqrt(252):.2%}')",
            "testPythonCode": "assert 'var_long_terme' in globals()\nassert 'sigma2' in globals()\nassert len(sigma2) == 500\nassert np.all(sigma2 > 0)\nassert np.isclose(var_long_terme, 0.0005, atol=1e-5)",
            "hints": ["var_long_terme = float(omega / (1.0 - (alpha + beta)))", "sigma2[t] = omega + alpha * (eps[t-1]**2) + beta * sigma2[t-1]"],
            "datasets": []
        },
        {
            "id": "v2-py-14",
            "title": "14. Value-at-Risk (VaR 99%) & Expected Shortfall (CVaR)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Estimez les métriques de risque de marché réglementaires (Bâle III) : VaR et CVaR paramétriques vs historiques.",
            "theoryMarkdown": """### Mesures Cohérentes du Risque : VaR et CVaR

> 💡 **Rappel théorique : La Défaillance de Sous-Additivité de la VaR**
> 
> Pour un seuil de confiance $\\alpha = 99\\%$ ($1\\%$ de risque) :
> 1. **Value-at-Risk ($VaR_{99\\%}$)** : fractile de perte maximale tel que $\\mathbb{P}(L > VaR) = 1\\%$.
>    - *Critique majeure* : La VaR ignore l'ampleur des pertes au-delà du quantile et n'est pas sous-additive (la VaR d'un portefeuille peut dépasser la somme des VaRs !).
> 2. **Expected Shortfall ($CVaR_{99\\%}$)** : espérance conditionnelle de la perte sachant qu'elle dépasse la VaR :
>    $$CVaR_{99\\%}(L) = \\mathbb{E}[L \\mid L > VaR_{99\\%}]$$
>    Le CVaR est une mesure de risque **cohérente** au sens d'Artzner et est désormais la norme sous les accords de Bâle III / FRTB (*Fundamental Review of the Trading Book*).
""",
            "taskMarkdown": "À partir des rendements simulés `rendements`, calculez les pertes `pertes = -rendements`. Calculez la VaR historique 99% `var_hist_99 = float(np.percentile(pertes, 99))` et la CVaR historique 99% `cvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())`. Affichez `var_hist_99` et `cvar_hist_99`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(42)\n# 1000 observations de rendements journaliers avec queues épaisses (loi de Student)\nrendements = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005\n\n# Calculez var_hist_99 et cvar_hist_99 :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(42)\nrendements = np.random.standard_t(df=4, size=1000) * 0.015 - 0.0005\n\npertes = -rendements\nvar_hist_99 = float(np.percentile(pertes, 99))\ncvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())\n\nprint(f'VaR historique 99% : {var_hist_99:.4%}')\nprint(f'Expected Shortfall (CVaR) 99% : {cvar_hist_99:.4%}')",
            "testPythonCode": "assert 'var_hist_99' in globals()\nassert 'cvar_hist_99' in globals()\nassert cvar_hist_99 >= var_hist_99\nassert var_hist_99 > 0",
            "hints": ["pertes = -rendements", "var_hist_99 = float(np.percentile(pertes, 99))", "cvar_hist_99 = float(pertes[pertes >= var_hist_99].mean())"],
            "datasets": []
        },
        {
            "id": "v2-py-15",
            "title": "15. Test de Jarque-Bera & Diagnostics des Queues Épaisses (Fat Tails)",
            "category": "financial_econometrics",
            "language": "python",
            "difficulty": "Intermédiaire",
            "durationMinutes": 8,
            "description": "Testez la normalité des rendements financiers en calculant le Skewness, le Kurtosis et la statistique de Jarque-Bera.",
            "theoryMarkdown": """### Diagnostic des Moments d'Ordre Supérieur & Test de Jarque-Bera

> 💡 **Rappel mathématique : Asymétrie et Aplatissement**
> 
> Pour une série centrée-réduite $z_t = \\frac{r_t - \\bar{r}}{s}$ :
> - **Coefficient d'asymétrie (Skewness)** : $S = \\frac{1}{T} \\sum z_t^3$ (asymétrie négative fréquente en bourse = krachs plus violents que les hausses).
> - **Coefficient d'aplatissement (Kurtosis)** : $K = \\frac{1}{T} \\sum z_t^4$.
>   - Pour une loi normale : $K = 3$.
>   - Si $K > 3$ (Excess Kurtosis $K - 3 > 0$) : distribution **leptokurtique** à queues épaisses (*Fat Tails*).
> 
> **Statistique de Test de Jarque-Bera :**
> $$JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\xrightarrow{\\mathcal{L}} \\chi^2(2)$$
> Si la p-valeur $< 0.05$, on rejette formellement l'hypothèse de normalité gaussienne.

![Distribution Leptokurtique et Queues Épaisses](/images/theory/fig_fat_tails_jarque_bera.png)

> 🔍 **Comprendre ce graphique : Le leurre de l'hypothèse gaussienne en finance**
> 
> - **Courbe grise en pointillés** : Loi normale théorique $\\mathcal{N}(0, 1)$ postulée par les modèles traditionnels (Black-Scholes, CAPM standard).
> - **Courbe rouge (Loi empirique / Student-t)** : Densité réelle des rendements d'actifs financiers.
> - **Pic central acéré** : Davantage d'observations très concentrées autour de zéro que sous la loi normale.
> - **Zone hachurée rouge (Queues Épaisses)** : Au-delà de $-3\\sigma$, la probabilité d'un effondrement violent est considérablement sous-estimée par la gaussienne (par un facteur de 10 à 100). C'est ce risque extrême qui fait exploser le Kurtosis ($K > 3$).
""",
            "taskMarkdown": "À partir de la série `r`, calculez la moyenne `m`, l'écart-type `s`, puis le `skewness = float(np.mean(((r - m)/s)**3))` et le `kurtosis = float(np.mean(((r - m)/s)**4))`. Calculez la statistique de test `jb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))`. Affichez `skewness`, `kurtosis` et `jb_stat`.",
            "initialCode": "import numpy as np\n\nnp.random.seed(7)\n# Rendements financiers simulés avec sauts (loi de Student df=5)\nr = np.random.standard_t(df=5, size=500) * 0.012\n\n# Calculez skewness, kurtosis et jb_stat :\n",
            "solutionCode": "import numpy as np\n\nnp.random.seed(7)\nr = np.random.standard_t(df=5, size=500) * 0.012\n\nm = np.mean(r)\ns = np.std(r, ddof=1)\nz = (r - m) / s\n\nskewness = float(np.mean(z**3))\nkurtosis = float(np.mean(z**4))\njb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))\n\nprint(f'Skewness (Asymétrie) : {skewness:.4f}')\nprint(f'Kurtosis (Aplatissement) : {kurtosis:.4f}')\nprint(f'Statistique de Jarque-Bera : {jb_stat:.2f}')\nprint('Rejet de la normalité gaussienne :', jb_stat > 5.99)",
            "testPythonCode": "assert 'skewness' in globals()\nassert 'kurtosis' in globals()\nassert 'jb_stat' in globals()\nassert kurtosis > 3.0\nassert jb_stat > 0",
            "hints": ["z = (r - np.mean(r)) / np.std(r, ddof=1)", "skewness = float(np.mean(z**3))", "kurtosis = float(np.mean(z**4))", "jb_stat = float(len(r) / 6.0 * (skewness**2 + ((kurtosis - 3.0)**2) / 4.0))"],
            "datasets": []
        }
    ]
}
