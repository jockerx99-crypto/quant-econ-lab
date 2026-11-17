import { CourseModule } from "@/types/course";

export const PYTHON_SUITE_MODULE: CourseModule = {
  id: "python-econometrie-suite",
  title: "Python Économétrie : Entraînement & Ancrage (Suite)",
  subtitle: "26 exercices pratiques de répétition en Pandas, MCO, Diagnostics & Risque ALM",
  icon: "TrendingUp",
  description:
    "Seconde série d'entraînement au même niveau que le Module 2 sur les séries macroéconomiques (df) et d'actifs (df_actifs) pour ancrer Pandas, Statsmodels et les tests économétriques.",
  exercises: [
    {
      id: "py-27",
      title: "1. Résumé statistique Pandas (.describe)",
      category: "data_prep",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Générez d'un seul appel le tableau complet des statistiques descriptives sur les taux et spreads.",
      theoryMarkdown: `
### Répétition 1 : Synthèse statistique rapide avec \`.describe()\`

> 💡 **Rappel méthodologique : Vue d'ensemble des moments empiriques**
>
> En analyse exploratoire sur un DataFrame \`df\`, \`.describe()\` calcule automatiquement pour chaque colonne numérique : effectif (\`count\`), moyenne (\`mean\`), écart-type (\`std\`), minimum, quartiles ($Q_{25}, Q_{50}, Q_{75}$) et maximum :
> \`\`\`python
> resume = df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe()
> \`\`\`
      `,
      taskMarkdown:
        "Stockez \`df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe()\` dans \`resume_stats\` et affichez-le arrondi à 2 décimales.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "resume_stats = df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe()\nprint(resume_stats.round(2))",
      testPythonCode:
        "assert 'resume_stats' in globals()\nassert resume_stats.shape == (8, 3)",
      hints: ["resume_stats = df[['euribor_3m', 'oat_10y', 'spread_credit_bbb']].describe()"],
      datasets: [],
    },
    {
      id: "py-28",
      title: "2. Filtrage booléen simple (Euribor positif)",
      category: "data_prep",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Extrayez les trimestres où l'Euribor 3 mois est repassé en territoire positif.",
      theoryMarkdown: `
### Répétition 2 : Indexation booléenne Pandas (\`df[condition]\`)

> 💡 **Rappel : Équivalent Pandas du \`WHERE\` SQL**
>
> Pour filtrer les lignes vérifiant une condition numérique sur \`df\` :
> \`\`\`python
> df_pos = df[df['euribor_3m'] > 0]
> \`\`\`
> La condition \`df['euribor_3m'] > 0\` produit un vecteur booléen (\`True / False\`) qui sélectionne uniquement les trimestres concernés (remonte de taux BCE à partir de 2022-Q3).
      `,
      taskMarkdown:
        "Créez \`df_euribor_pos = df[df['euribor_3m'] > 0]\` et affichez \`df_euribor_pos[['periode', 'euribor_3m', 'oat_10y']]\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "df_euribor_pos = df[df['euribor_3m'] > 0]\nprint(df_euribor_pos[['periode', 'euribor_3m', 'oat_10y']])",
      testPythonCode:
        "assert 'df_euribor_pos' in globals()\nassert (df_euribor_pos['euribor_3m'] > 0).all() and len(df_euribor_pos) == 6",
      hints: ["df_euribor_pos = df[df['euribor_3m'] > 0]"],
      datasets: [],
    },
    {
      id: "py-29",
      title: "3. Filtrage composé Pandas (& et parenthèses)",
      category: "data_prep",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Isolez les trimestres combinant forte inflation (> 5 %) et baisse du CAC 40.",
      theoryMarkdown: `
### Répétition 3 : Combiner plusieurs conditions en Pandas

> ⚠️ **Piège syntaxique fréquent :**
> En Pandas, on n'utilise jamais \`and\` / \`or\` entre Series ! Il faut utiliser \`&\` (ET) ou \`|\` (OU) et **impérativement entourer chaque condition de parenthèses** :
> \`\`\`python
> df_stress = df[(df['inflation_hicp'] > 5.0) & (df['cac40_rendement'] < 0)]
> \`\`\`
      `,
      taskMarkdown:
        "Créez \`df_stress = df[(df['inflation_hicp'] > 5.0) & (df['cac40_rendement'] < 0)]\` et affichez les périodes sélectionnées.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "df_stress = df[(df['inflation_hicp'] > 5.0) & (df['cac40_rendement'] < 0)]\nprint(df_stress[['periode', 'inflation_hicp', 'cac40_rendement']])",
      testPythonCode:
        "assert 'df_stress' in globals()\nassert len(df_stress) == 3 and (df_stress['inflation_hicp'] > 5.0).all()",
      hints: ["N'oubliez pas les parenthèses autour de chaque test avant l'opérateur &."],
      datasets: [],
    },
    {
      id: "py-30",
      title: "4. Rendement moyen et volatilité du CAC 40 (.mean, .std)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Mesurez la performance trimestrielle moyenne et la dispersion du CAC 40.",
      theoryMarkdown: `
### Répétition 4 : Espérance et Écart-Type empiriques

> 💡 **Rappel théorique : Risque total d'un indice boursier**
>
> Pour une série de rendements trimestriels $R_t$ (\`cac40_rendement\`) :
> $$\\bar{R} = \\frac{1}{T}\\sum_{t=1}^T R_t, \\qquad \\hat{\\sigma} = \\sqrt{\\frac{1}{T-1}\\sum_{t=1}^T (R_t - \\bar{R})^2}$$
> En finance quantitative, l'écart-type \`.std()\` quantifie la volatilité totale (ici sur pas trimestriel, exprimée en points de pourcentage).
      `,
      taskMarkdown:
        "Calculez \`moy_cac = df['cac40_rendement'].mean()\` et \`vol_cac = df['cac40_rendement'].std()\` puis affichez-les.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "moy_cac = df['cac40_rendement'].mean()\nvol_cac = df['cac40_rendement'].std()\nprint(f'Moyenne CAC 40 : {moy_cac:.2f} % | Volatilité : {vol_cac:.2f} %')",
      testPythonCode:
        "assert 'moy_cac' in globals() and 'vol_cac' in globals()\nassert abs(vol_cac - df['cac40_rendement'].std()) < 1e-9",
      hints: ["Utilisez .mean() et .std() sur df['cac40_rendement']."],
      datasets: [],
    },
    {
      id: "py-31",
      title: "5. Quantiles de tension du Spread de Crédit (.quantile)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Calculez le 10e centile (marché calme) et le 90e centile (stress crédit) du spread BBB.",
      theoryMarkdown: `
### Répétition 5 : Quantiles extrêmes avec \`.quantile(q)\`

> 💡 **Rappel : Déciles empiriques**
>
> - \`q10 = s.quantile(0.10)\` : seuil sous lequel ne tombent que 10 % des observations les plus basses (spreads serrés).
> - \`q90 = s.quantile(0.90)\` : seuil dépassé uniquement par les 10 % des trimestres les plus tendus sur le marché du crédit *Corporate BBB*.
      `,
      taskMarkdown:
        "Calculez \`q10_spread = df['spread_credit_bbb'].quantile(0.10)\` et \`q90_spread = df['spread_credit_bbb'].quantile(0.90)\` et affichez-les.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "q10_spread = df['spread_credit_bbb'].quantile(0.10)\nq90_spread = df['spread_credit_bbb'].quantile(0.90)\nprint(f'Décile bas (10%) : {q10_spread:.3f} % | Décile haut (90%) : {q90_spread:.3f} %')",
      testPythonCode:
        "assert 'q10_spread' in globals() and 'q90_spread' in globals()\nassert q10_spread < q90_spread",
      hints: ["df['spread_credit_bbb'].quantile(0.10) et .quantile(0.90)"],
      datasets: [],
    },
    {
      id: "py-32",
      title: "6. Taux d'intérêt réel ex-post (Colonne dérivée)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Calculez le taux réel long via l'équation de Fisher simplifiée (OAT 10Y - Inflation).",
      theoryMarkdown: `
### Répétition 6 : Créer une variable économique dérivée

> 💡 **Rappel : Équation de Fisher (Taux nominal vs Taux réel)**
>
> En première approximation linéaire, le rendement réel ex-post d'une OAT 10 ans est l'écart entre le taux nominal et l'inflation réalisée :
> $$r_{\\text{réel}} \\approx i_{\\text{OAT 10Y}} - \\pi_{\\text{HICP}}$$
> Une colonne \`df['taux_reel']\` négative signifie une *répression financière* (érosion du pouvoir d'achat obligataire).
      `,
      taskMarkdown:
        "Créez la colonne \`df['taux_reel'] = df['oat_10y'] - df['inflation_hicp']\` et affichez \`df[['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']].head()\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "df['taux_reel'] = df['oat_10y'] - df['inflation_hicp']\nprint(df[['periode', 'oat_10y', 'inflation_hicp', 'taux_reel']].head())",
      testPythonCode:
        "assert 'taux_reel' in df.columns\nassert abs(df['taux_reel'].iloc[0] - (df['oat_10y'].iloc[0] - df['inflation_hicp'].iloc[0])) < 1e-9",
      hints: ["df['taux_reel'] = df['oat_10y'] - df['inflation_hicp']"],
      datasets: [],
    },
    {
      id: "py-33",
      title: "7. Corrélation macro-crédit-actions (.corr)",
      category: "econometrics",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Examinez la corrélation croisée entre spread de crédit, croissance du PIB et CAC 40.",
      theoryMarkdown: `
### Répétition 7 : Matrice de corrélation de Pearson

> 💡 **Rappel : Coefficient de corrélation linéaire**
>
> $$r_{X,Y} = \\frac{\\operatorname{Cov}(X, Y)}{s_X \\cdot s_Y} \\in [-1, +1]$$
> En macro-finance, l'écartement du \`spread_credit_bbb\` s'accompagne souvent de tensions sur le marché actions (\`cac40_rendement\`). Attention toutefois aux points aberrants qui peuvent influencer Pearson !
      `,
      taskMarkdown:
        "Calculez \`corr_macro = df[['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']].corr()\` et affichez-la arrondie à 3 décimales.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "corr_macro = df[['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']].corr()\nprint(corr_macro.round(3))",
      testPythonCode:
        "assert 'corr_macro' in globals()\nassert corr_macro.shape == (3, 3)",
      hints: ["df[['spread_credit_bbb', 'pib_croissance', 'cac40_rendement']].corr()"],
      datasets: [],
    },
    {
      id: "py-34",
      title: "8. Détection d'outliers bilatérale IQR sur le PIB",
      category: "data_prep",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Calculez les deux bornes de Tukey (basse et haute) sur pib_croissance pour repérer les chocs extrêmes.",
      theoryMarkdown: `
### Répétition 8 : Clôtures inférieure et supérieure de Tukey

> 💡 **Rappel : Boîte à moustaches symétrique**
>
> $$IQR = Q_{75} - Q_{25}$$
> - **Seuil bas** : $B_{\\text{bas}} = Q_{25} - 1.5 \\times IQR$
> - **Seuil haut** : $B_{\\text{haut}} = Q_{75} + 1.5 \\times IQR$
>
> Sur \`pib_croissance\`, le confinement de 2020-Q2 (\`-11.8 %\`) et le rebond mécanique de 2020-Q3 (\`+18.2 %\`) franchissent tous deux les bornes de Tukey !
      `,
      taskMarkdown:
        "Sur \`df['pib_croissance']\`, calculez \`q25\`, \`q75\`, \`iqr_pib\`, \`seuil_bas\` et \`seuil_haut\`, puis isolez \`outliers_pib\` dans \`df\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "q25 = df['pib_croissance'].quantile(0.25)\nq75 = df['pib_croissance'].quantile(0.75)\niqr_pib = q75 - q25\nseuil_bas = q25 - 1.5 * iqr_pib\nseuil_haut = q75 + 1.5 * iqr_pib\noutliers_pib = df[(df['pib_croissance'] < seuil_bas) | (df['pib_croissance'] > seuil_haut)]\nprint(f'Seuils Tukey : [{seuil_bas:.2f}, {seuil_haut:.2f}]')\nprint(outliers_pib[['periode', 'pib_croissance']])",
      testPythonCode:
        "assert 'iqr_pib' in globals() and 'outliers_pib' in globals()\nassert len(outliers_pib) >= 2",
      hints: ["seuil_bas = q25 - 1.5 * iqr_pib et seuil_haut = q75 + 1.5 * iqr_pib"],
      datasets: [],
    },
    {
      id: "py-35",
      title: "9. Agrégation Pandas .groupby sur df_actifs",
      category: "data_prep",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Utilisez df_actifs (préchargé) pour calculer le rendement espéré moyen et le bêta moyen par classe d'actif.",
      theoryMarkdown: `
### Répétition 9 : Le \`GROUP BY\` en Pandas (\`.groupby()\`)

> 💡 **Rappel : Passer du SQL à Pandas**
>
> Comme en SQL, Pandas permet de regrouper selon une colonne catégorielle puis d'agréger les variables numériques :
> \`\`\`python
> df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()
> \`\`\`
> Le DataFrame \`df_actifs\` contient les 5 actifs financiers déjà utilisés dans la base SQL (\`TTE\`, \`BNP\`, \`MC\`, \`AI\`, \`CW8\`).
      `,
      taskMarkdown:
        "Calculez \`stats_classe = df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()\` et affichez le tableau.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "stats_classe = df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()\nprint(stats_classe.round(4))",
      testPythonCode:
        "assert 'stats_classe' in globals()\nassert stats_classe.shape[1] == 2 and len(stats_classe) == 2",
      hints: ["df_actifs.groupby('classe_actif')[['rendement_espere', 'beta_marche']].mean()"],
      datasets: [],
    },
    {
      id: "py-36",
      title: "10. OLS Simple sur le Spread de Crédit (sm.OLS)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Estimez le lien linéaire entre le spread de crédit BBB et l'inflation HICP.",
      theoryMarkdown: `
### Répétition 10 : Régression simple MCO sur une nouvelle relation

> 💡 **Rappel : Ordre strict \`sm.OLS(y, X).fit()\`**
>
> On modélise l'écartement du risque de crédit corporate (\`spread_credit_bbb\`) en fonction de l'inflation (\`inflation_hicp\`) :
> $$\\text{spread\\_credit\\_bbb}_t = \\beta_0 + \\beta_1 \\cdot \\text{inflation\\_hicp}_t + \\varepsilon_t$$
> N'oubliez jamais \`sm.add_constant(...)\` autour des doubles crochets \`df[['inflation_hicp']]\` !
      `,
      taskMarkdown:
        "Construisez \`X = sm.add_constant(df[['inflation_hicp']])\`, estimez \`model_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\` et affichez \`.summary()\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']])\ny = df['spread_credit_bbb']\nmodel_spread = sm.OLS(y, X).fit()\nprint(model_spread.summary())",
      testPythonCode:
        "assert 'model_spread' in globals()\nassert len(model_spread.params) == 2",
      hints: ["model_spread = sm.OLS(df['spread_credit_bbb'], sm.add_constant(df[['inflation_hicp']])).fit()"],
      datasets: [],
    },
    {
      id: "py-37",
      title: "11. Extraction de l'ordonnée et de la pente (.params)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Extrayez individuellement alpha (const) et beta (pente de l'inflation) depuis model_spread.params.",
      theoryMarkdown: `
### Répétition 11 : Interpréter et isoler les coefficients estimés

> 💡 **Rappel : Indexation par nom dans \`model.params\`**
>
> \`model.params\` est une Series Pandas indexée par le nom des colonnes de \`X\` :
> - \`model.params['const']\` : constante $\\hat{\\beta}_0$
> - \`model.params['inflation_hicp']\` : sensibilité marginale $\\hat{\\beta}_1$ (variation du spread BBB pour $+1$ point d'inflation).
      `,
      taskMarkdown:
        "Estimez \`spread_credit_bbb ~ const + inflation_hicp\`, puis stockez \`alpha_spread = model_spread.params['const']\` et \`beta_inf = model_spread.params['inflation_hicp']\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']])\nmodel_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\nalpha_spread = float(model_spread.params['const'])\nbeta_inf = float(model_spread.params['inflation_hicp'])\nprint(f'Alpha = {alpha_spread:.4f} | Beta inflation = {beta_inf:.4f}')",
      testPythonCode:
        "assert 'alpha_spread' in globals() and 'beta_inf' in globals()\nassert beta_inf > 0",
      hints: ["Utilisez model_spread.params['const'] et model_spread.params['inflation_hicp']."],
      datasets: [],
    },
    {
      id: "py-38",
      title: "12. Test de Student et décision au seuil 5 % (.tvalues, .pvalues)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Vérifiez si l'effet de l'inflation sur le spread BBB est statistiquement significatif à 5 %.",
      theoryMarkdown: `
### Répétition 12 : Règle de décision du test de Student

> 💡 **Rappel : Hypothèse nulle $H_0 : \\beta_1 = 0$**
>
> - \`model.tvalues['inflation_hicp']\` mesure le nombre d'écarts-types séparant $\\hat{\\beta}_1$ de $0$.
> - \`model.pvalues['inflation_hicp']\` donne la probabilité d'observer un tel $t$ sous $H_0$.
> - Si \`p_val < 0.05\`, on rejette $H_0$ : le facteur macroéconomique est statistiquement significatif au seuil usuel de 5 %.
      `,
      taskMarkdown:
        "Extrayez \`t_inf = float(model_spread.tvalues['inflation_hicp'])\`, \`p_inf = float(model_spread.pvalues['inflation_hicp'])\` et le booléen \`est_significatif = bool(p_inf < 0.05)\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']])\nmodel_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\nt_inf = float(model_spread.tvalues['inflation_hicp'])\np_inf = float(model_spread.pvalues['inflation_hicp'])\nest_significatif = bool(p_inf < 0.05)\nprint(f't-stat = {t_inf:.3f} | p-val = {p_inf:.4e} | Significatif (5%) : {est_significatif}')",
      testPythonCode:
        "assert 't_inf' in globals() and 'p_inf' in globals() and 'est_significatif' in globals()\nassert est_significatif is True",
      hints: ["t_inf = model_spread.tvalues['inflation_hicp'] et p_inf = model_spread.pvalues['inflation_hicp']."],
      datasets: [],
    },
    {
      id: "py-39",
      title: "13. Intervalle de confiance des paramètres (.conf_int)",
      category: "econometrics",
      difficulty: "Intermédiaire",
      language: "python",
      durationMinutes: 8,
      description: "Calculez l'intervalle de confiance à 95 % de la pente entre l'OAT 10Y et l'Euribor 3M.",
      theoryMarkdown: `
### Répétition 13 : Quantifier l'incertitude autour de $\\hat{\\beta}$

> 💡 **Rappel : Intervalle de confiance à $95\\%$**
>
> $$IC_{95\\%}(\\beta_j) = \\left[\\hat{\\beta}_j - t_{0.975} \\cdot \\operatorname{SE}(\\hat{\\beta}_j), \\; \\hat{\\beta}_j + t_{0.975} \\cdot \\operatorname{SE}(\\hat{\\beta}_j)\\right]$$
> En Statsmodels, \`model.conf_int(alpha=0.05)\` renvoie un DataFrame contenant directement la borne inférieure (colonne \`0\`) et supérieure (colonne \`1\`). Si \`0\` n'appartient pas à l'intervalle, le paramètre est significatif au seuil de 5 % !
      `,
      taskMarkdown:
        "Estimez \`oat_10y ~ const + euribor_3m\`, puis stockez \`ic_95 = model.conf_int(alpha=0.05)\` et affichez-le.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m']])\nmodel = sm.OLS(df['oat_10y'], X).fit()\nic_95 = model.conf_int(alpha=0.05)\nprint('Intervalles de confiance à 95% :\\n', ic_95.round(4))",
      testPythonCode:
        "assert 'ic_95' in globals()\nassert ic_95.shape == (2, 2) and ic_95.loc['euribor_3m', 0] < ic_95.loc['euribor_3m', 1]",
      hints: ["ic_95 = model.conf_int(alpha=0.05)"],
      datasets: [],
    },
    {
      id: "py-40",
      title: "14. R² vs R² Ajusté lors de l'ajout d'une variable",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Comparez le pouvoir explicatif brut et ajusté entre 1 et 2 variables explicatives sur le spread.",
      theoryMarkdown: `
### Répétition 14 : Vérifier empiriquement la pénalité des degrés de liberté

> 💡 **Rappel :**
> - Modèle 1 : \`spread_credit_bbb ~ const + inflation_hicp\` ($K=1$)
> - Modèle 2 : \`spread_credit_bbb ~ const + inflation_hicp + cac40_rendement\` ($K=2$)
>
> $R^2$ augmente ou reste identique, tandis que $\\bar{R}^2$ peut **baisser** si la variable ajoutée n'apporte pas assez d'information pour compenser la perte d'un degré de liberté !
      `,
      taskMarkdown:
        "Estimez \`m1\` (\`inflation_hicp\`) et \`m2\` (\`inflation_hicp\`, \`cac40_rendement\`) sur \`spread_credit_bbb\`, puis affichez \`m1.rsquared\`, \`m1.rsquared_adj\` et \`m2.rsquared\`, \`m2.rsquared_adj\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\ny = df['spread_credit_bbb']\nm1 = sm.OLS(y, sm.add_constant(df[['inflation_hicp']])).fit()\nm2 = sm.OLS(y, sm.add_constant(df[['inflation_hicp', 'cac40_rendement']])).fit()\nprint(f'M1 -> R²: {m1.rsquared:.4f} | R² adj: {m1.rsquared_adj:.4f}')\nprint(f'M2 -> R²: {m2.rsquared:.4f} | R² adj: {m2.rsquared_adj:.4f}')",
      testPythonCode:
        "assert 'm1' in globals() and 'm2' in globals()\nassert m2.rsquared >= m1.rsquared - 1e-12",
      hints: ["Comparez .rsquared et .rsquared_adj sur m1 et m2."],
      datasets: [],
    },
    {
      id: "py-41",
      title: "15. Estimateur matriciel MCO & Somme des Carrés Résiduelle",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 12,
      description: "Recalculez à la main beta_hat = (X'X)^(-1) X'y et le SCR avec NumPy.",
      theoryMarkdown: `
### Répétition 15 : Algèbre linéaire des MCO avec NumPy

> 💡 **Rappel : Formules matricielles fondamentales**
>
> $$\\hat{\\beta} = (X'X)^{-1} X'y, \\qquad \\hat{e} = y - X\\hat{\\beta}, \\qquad SCR = \\sum_{i=1}^N \\hat{e}_i^2 = \\hat{e}'\\hat{e}$$
> En NumPy, utilisez \`@\` pour les produits matriciels et \`.T\` pour la transposition.
      `,
      taskMarkdown:
        "Pour \`spread_credit_bbb ~ const + inflation_hicp\`, convertissez \`X\` et \`y\` en tableaux NumPy (\`.values\`), calculez \`beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y\`, \`resid_np = y - X @ beta_hat\` et \`scr_np = float(np.sum(resid_np**2))\`. ",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import numpy as np\nimport statsmodels.api as sm\nX = sm.add_constant(df[['inflation_hicp']]).values\ny = df['spread_credit_bbb'].values\nbeta_hat = np.linalg.inv(X.T @ X) @ X.T @ y\nresid_np = y - X @ beta_hat\nscr_np = float(np.sum(resid_np**2))\nprint('Beta NumPy :', np.round(beta_hat, 4))\nprint(f'SCR NumPy : {scr_np:.6f}')",
      testPythonCode:
        "assert 'beta_hat' in globals() and 'scr_np' in globals()\nassert len(beta_hat) == 2 and scr_np > 0",
      hints: ["np.linalg.inv(X.T @ X) @ X.T @ y puis resid_np = y - X @ beta_hat"],
      datasets: [],
    },
    {
      id: "py-42",
      title: "16. Prédiction ponctuelle d'un scénario macro (.predict)",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Prévoyez le niveau de l'OAT 10 ans dans un scénario cible Euribor = 3.0 % et Inflation = 2.5 %.",
      theoryMarkdown: `
### Répétition 16 : Inférer une prévision avec \`model.predict()\`

> 💡 **Rappel : Inclure impérativement le \`1.0\` de la constante**
>
> Une fois le modèle \`oat_10y ~ const + euribor_3m + inflation_hicp\` ajusté, la prévision d'un scénario futur $(X_1=3.0, X_2=2.5)$ correspond à :
> $$\\hat{Y}^* = \\hat{\\beta}_0 \\cdot 1 + \\hat{\\beta}_1 \\cdot 3.0 + \\hat{\\beta}_2 \\cdot 2.5$$
> En Statsmodels : \`model.predict([1.0, 3.0, 2.5])[0]\`.
      `,
      taskMarkdown:
        "Ajustez \`model_alm = sm.OLS(df['oat_10y'], sm.add_constant(df[['euribor_3m', 'inflation_hicp']])).fit()\`, puis calculez \`prev_oat = float(model_alm.predict([1.0, 3.0, 2.5])[0])\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX = sm.add_constant(df[['euribor_3m', 'inflation_hicp']])\nmodel_alm = sm.OLS(df['oat_10y'], X).fit()\nprev_oat = float(model_alm.predict([1.0, 3.0, 2.5])[0])\nprint(f'OAT 10Y prévue (Euribor 3.0%, Inf 2.5%) : {prev_oat:.3f} %')",
      testPythonCode:
        "assert 'prev_oat' in globals()\nassert 1.0 < prev_oat < 5.0",
      hints: ["Passez [1.0, 3.0, 2.5] à model_alm.predict(...)."],
      datasets: [],
    },
    {
      id: "py-43",
      title: "17. Régression multivariée complète & Test de Fisher",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Modélisez spread_credit_bbb par euribor_3m, inflation_hicp et pib_croissance, puis testez la significativité globale F.",
      theoryMarkdown: `
### Répétition 17 : Test global de Fisher à 3 variables explicatives

> 💡 **Rappel : Hypothèse nulle conjointe**
>
> $$H_0 : \\beta_1 = \\beta_2 = \\beta_3 = 0$$
> La statistique \`model.fvalue\` et sa p-valeur \`model.f_pvalue\` testent si le bloc de variables macroéconomiques explique collectivement les variations du spread de crédit.
      `,
      taskMarkdown:
        "Estimez \`model_credit\` expliquant \`spread_credit_bbb\` par \`['euribor_3m', 'inflation_hicp', 'pib_croissance']\` (avec constante) et extrayez \`f_stat_credit = model_credit.fvalue\` et \`f_pval_credit = model_credit.f_pvalue\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nmodel_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\nf_stat_credit = float(model_credit.fvalue)\nf_pval_credit = float(model_credit.f_pvalue)\nprint(f'F-statistique : {f_stat_credit:.2f} | Prob(F) : {f_pval_credit:.4e}')",
      testPythonCode:
        "assert 'model_credit' in globals() and 'f_stat_credit' in globals()\nassert len(model_credit.params) == 4 and f_pval_credit < 0.05",
      hints: ["X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])"],
      datasets: [],
    },
    {
      id: "py-44",
      title: "18. Audit complet de Multicolinéarité (Boucle VIF)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 12,
      description: "Calculez le VIF de chacun des 3 régresseurs du modèle de crédit en une boucle.",
      theoryMarkdown: `
### Répétition 18 : Diagnostiquer chaque variable explicative

> 💡 **Rappel :**
> $$VIF_j = \\frac{1}{1 - R_j^2}$$
> Dans \`X_credit = sm.add_constant(df[cols])\`, la colonne d'indice \`0\` est la constante \`'const'\`. On boucle donc sur \`i in range(1, X_credit.shape[1])\` pour auditer chaque variable sans recalculer le VIF artificiel de l'ordonnée à l'origine.
      `,
      taskMarkdown:
        "Sur \`X_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\`, construisez un dictionnaire \`vifs = {col: round(variance_inflation_factor(X_credit.values, i), 3) ...}\` pour les 3 variables (hors constante).",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nfrom statsmodels.stats.outliers_influence import variance_inflation_factor\n\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nvifs = {\n    X_credit.columns[i]: round(float(variance_inflation_factor(X_credit.values, i)), 3)\n    for i in range(1, X_credit.shape[1])\n}\nprint('Audit VIF complet :', vifs)",
      testPythonCode:
        "assert 'vifs' in globals()\nassert set(vifs.keys()) == {'euribor_3m', 'inflation_hicp', 'pib_croissance'}",
      hints: ["Bouclez de i = 1 jusqu'à X_credit.shape[1] - 1."],
      datasets: [],
    },
    {
      id: "py-45",
      title: "19. Test de Breusch-Pagan sur le modèle de Crédit",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Testez l'homoscédasticité des résidus du modèle expliquant spread_credit_bbb.",
      theoryMarkdown: `
### Répétition 19 : Vérifier la constance de la variance des erreurs

> 💡 **Rappel : Hypothèse nulle $H_0$ d'homoscédasticité**
>
> $$H_0 : \\operatorname{Var}(\\varepsilon_t \\mid X_t) = \\sigma^2$$
> La fonction \`het_breuschpagan(resid, X)\` retourne 4 valeurs : \`(lm_stat, p_val_lm, f_stat, f_pval)\`. Si \`p_val_lm < 0.05\`, on détecte une hétéroscédasticité significative et les écarts-types MCO classiques ne sont plus fiables.
      `,
      taskMarkdown:
        "Appliquez \`het_breuschpagan(model_credit.resid, X_credit)\` sur \`spread_credit_bbb ~ const + euribor_3m + inflation_hicp + pib_croissance\` et stockez \`lm_bp, pval_bp\`. ",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nfrom statsmodels.stats.diagnostic import het_breuschpagan\n\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nmodel_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\nlm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)\nprint(f'Statistique LM Breusch-Pagan : {lm_bp:.3f} | P-valeur : {pval_bp:.4f}')",
      testPythonCode:
        "assert 'lm_bp' in globals() and 'pval_bp' in globals()\nassert 0.0 <= pval_bp <= 1.0",
      hints: ["lm_bp, pval_bp, _, _ = het_breuschpagan(model_credit.resid, X_credit)"],
      datasets: [],
    },
    {
      id: "py-46",
      title: "20. Écarts-types robustes HC3 pour petits échantillons",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Comparez les écarts-types OLS standards à l'estimateur robuste HC3 recommandé quand N est faible.",
      theoryMarkdown: `
### Répétition 20 : Correction de White / MacKinnon-White (\`HC3\`)

> 💡 **Rappel : Pourquoi préférer \`HC3\` sur $N = 16$ trimestres ?**
>
> Alors que \`HC1\` applique simplement une correction globale des degrés de liberté $\\frac{N}{N-K}$, \`HC3\` pondère chaque résidu au carré par $(1 - h_{tt})^2$ (où $h_{tt}$ est l'effet de levier de l'observation $t$), ce qui évite de sous-estimer les erreurs standards sur petits échantillons :
> \`\`\`python
> model_hc3 = sm.OLS(y, X).fit(cov_type='HC3')
> \`\`\`
      `,
      taskMarkdown:
        "Estimez \`model_std = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\` et \`model_hc3 = sm.OLS(df['spread_credit_bbb'], X_credit).fit(cov_type='HC3')\` puis comparez \`model_std.bse\` et \`model_hc3.bse\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\ny = df['spread_credit_bbb']\nmodel_std = sm.OLS(y, X_credit).fit()\nmodel_hc3 = sm.OLS(y, X_credit).fit(cov_type='HC3')\nprint('SE OLS classique :\\n', model_std.bse.round(4))\nprint('SE robustes HC3 :\\n', model_hc3.bse.round(4))",
      testPythonCode:
        "assert 'model_std' in globals() and 'model_hc3' in globals()\nassert (model_std.params == model_hc3.params).all()",
      hints: [".fit(cov_type='HC3') laisse les coefficients identiques mais corrige .bse et .pvalues."],
      datasets: [],
    },
    {
      id: "py-47",
      title: "21. Normalité des résidus : Skewness, Kurtosis & Jarque-Bera",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Contrôlez l'asymétrie, l'aplatissement et la normalité des résidus du modèle de crédit.",
      theoryMarkdown: `
### Répétition 21 : Décrypter les 4 sorties de \`jarque_bera()\`

> 💡 **Rappel :**
> \`\`\`python
> jb, pval, skew, kurt = jarque_bera(model.resid)
> \`\`\`
> - Une loi normale idéale vérifie \`skew == 0\` et \`kurt == 3\`.
> - Si \`pval > 0.05\`, on ne rejette pas l'hypothèse nulle de normalité des résidus : les seuils critiques de Student/Fisher restent valides même sur petit échantillon.
      `,
      taskMarkdown:
        "Calculez \`jb_c, pval_jb_c, skew_c, kurt_c = jarque_bera(model_credit.resid)\` et créez le booléen \`normalite_ok = bool(pval_jb_c > 0.05)\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nfrom statsmodels.stats.stattools import jarque_bera\n\nX_credit = sm.add_constant(df[['euribor_3m', 'inflation_hicp', 'pib_croissance']])\nmodel_credit = sm.OLS(df['spread_credit_bbb'], X_credit).fit()\njb_c, pval_jb_c, skew_c, kurt_c = jarque_bera(model_credit.resid)\nnormalite_ok = bool(pval_jb_c > 0.05)\nprint(f'JB={jb_c:.3f} | p={pval_jb_c:.4f} | Skew={skew_c:.2f} | Kurt={kurt_c:.2f} | Normale={normalite_ok}')",
      testPythonCode:
        "assert 'jb_c' in globals() and 'normalite_ok' in globals()\nassert jb_c >= 0",
      hints: ["jarque_bera(model_credit.resid) renvoie un tuple de 4 valeurs."],
      datasets: [],
    },
    {
      id: "py-48",
      title: "22. Autocorrélation des résidus en niveau (Durbin-Watson)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 10,
      description: "Mesurez la persistance temporelle des résidus du modèle spread_credit_bbb ~ inflation_hicp.",
      theoryMarkdown: `
### Répétition 22 : Repérer l'autocorrélation sérielle via Durbin-Watson

> 💡 **Rappel : Interprétation de la statistique $DW \\in [0, 4]$**
>
> $$DW \\approx 2(1 - \\hat{\\rho}_1)$$
> - $DW \\approx 2$ : absence d'autocorrélation d'ordre 1 ($\\hat{\\rho}_1 \\approx 0$).
> - $DW < 1.5$ : autocorrélation positive marquée (les erreurs d'aujourd'hui persistent le trimestre suivant, typique des régressions en niveau !).
      `,
      taskMarkdown:
        "Calculez \`dw_spread = float(durbin_watson(model_spread.resid))\` sur \`spread_credit_bbb ~ const + inflation_hicp\` et affichez sa valeur.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nfrom statsmodels.stats.stattools import durbin_watson\n\nX = sm.add_constant(df[['inflation_hicp']])\nmodel_spread = sm.OLS(df['spread_credit_bbb'], X).fit()\ndw_spread = float(durbin_watson(model_spread.resid))\nprint(f'Durbin-Watson (spread ~ inflation) : {dw_spread:.4f}')",
      testPythonCode:
        "assert 'dw_spread' in globals()\nassert 0.0 <= dw_spread <= 4.0",
      hints: ["durbin_watson(model_spread.resid)"],
      datasets: [],
    },
    {
      id: "py-49",
      title: "23. Test ADF en niveau vs en différence première",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 12,
      description: "Comparez le résultat du test de Dickey-Fuller Augmenté sur l'Euribor en niveau et différencié.",
      theoryMarkdown: `
### Répétition 23 : Prouver l'ordre d'intégration $I(1)$ par le test ADF

> 💡 **Rappel : Lecture de \`adfuller(serie)[1]\`**
>
> - $H_0$ : Présence d'une racine unitaire (**non-stationnaire**).
> - En niveau (\`df['euribor_3m']\`), la hausse monotone des taux génère souvent une p-valeur élevée ($> 0.05$).
> - En différence première (\`df['euribor_3m'].diff().dropna()\`), on vérifie si la variation $\\Delta r_t$ devient stationnaire !
      `,
      taskMarkdown:
        "Calculez \`pval_niv = float(adfuller(df['euribor_3m'])[1])\` et \`pval_diff = float(adfuller(df['euribor_3m'].diff().dropna())[1])\` et affichez les deux p-valeurs.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "from statsmodels.tsa.stattools import adfuller\n\npval_niv = float(adfuller(df['euribor_3m'])[1])\npval_diff = float(adfuller(df['euribor_3m'].diff().dropna())[1])\nprint(f'ADF en niveau p-val : {pval_niv:.4f}')\nprint(f'ADF en différence p-val : {pval_diff:.4f}')",
      testPythonCode:
        "assert 'pval_niv' in globals() and 'pval_diff' in globals()\nassert 0.0 <= pval_niv <= 1.0 and 0.0 <= pval_diff <= 1.0",
      hints: ["adfuller(serie)[1] extrait directement la p-valeur."],
      datasets: [],
    },
    {
      id: "py-50",
      title: "24. Modèle dynamique en différences + Newey-West (HAC)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 12,
      description: "Estimez la sensibilité des variations du spread de crédit avec écarts-types HAC.",
      theoryMarkdown: `
### Répétition 24 : Chaîne économétrique propre sur séries temporelles

> 💡 **Rappel : Combiner stationnarisation et inférence robuste**
>
> 1. Différencier les séries (\`.diff().dropna()\`) pour supprimer les tendances communes.
> 2. Ajuster avec \`cov_type='HAC', cov_kwds={'maxlags': 1}\` afin de se prémunir contre toute autocorrélation ou hétéroscédasticité résiduelle.
      `,
      taskMarkdown:
        "Créez \`df_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()\`, ajustez \`model_credit_hac\` avec \`cov_type='HAC'\` et \`cov_kwds={'maxlags': 1}\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\ndf_d = df[['spread_credit_bbb', 'inflation_hicp', 'pib_croissance']].diff().dropna()\nX_d = sm.add_constant(df_d[['inflation_hicp', 'pib_croissance']])\ny_d = df_d['spread_credit_bbb']\nmodel_credit_hac = sm.OLS(y_d, X_d).fit(cov_type='HAC', cov_kwds={'maxlags': 1})\nprint(model_credit_hac.summary())",
      testPythonCode:
        "assert 'model_credit_hac' in globals()\nassert model_credit_hac.nobs == 15",
      hints: ["cov_type='HAC', cov_kwds={'maxlags': 1}"],
      datasets: [],
    },
    {
      id: "py-51",
      title: "25. Nuage de points & Droite MCO (Matplotlib)",
      category: "econometrics",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 12,
      description: "Tracez les observations (euribor_3m, oat_10y) ainsi que la droite ajustée par les MCO.",
      theoryMarkdown: `
### Répétition 25 : Visualiser l'ajustement linéaire avec \`plt.scatter\` et \`plt.plot\`

> 💡 **Rappel : Nuage de points + Droite de régression**
>
> - \`plt.scatter(x, y)\` représente chaque trimestre réel sous forme d'un point.
> - \`plt.plot(x, model.fittedvalues)\` trace la droite $\\hat{y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 x$.
> La distance verticale entre chaque point et la droite correspond visuellement au résidu $\\hat{e}_t$.
      `,
      taskMarkdown:
        "Estimez \`oat_10y ~ const + euribor_3m\`, puis tracez le nuage \`plt.scatter(df['euribor_3m'], y)\` et la droite \`plt.plot(df['euribor_3m'], model.fittedvalues)\` avec \`plt.show()\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "import statsmodels.api as sm\nimport matplotlib.pyplot as plt\n\nX = sm.add_constant(df[['euribor_3m']])\ny = df['oat_10y']\nmodel = sm.OLS(y, X).fit()\nplt.figure(figsize=(7, 4))\nplt.scatter(df['euribor_3m'], y, color='#0284c7', label='Trimestres observés')\nplt.plot(df['euribor_3m'], model.fittedvalues, color='#e11d48', lw=2, label='Droite MCO')\nplt.xlabel('Euribor 3 mois (%)')\nplt.ylabel('OAT 10 ans (%)')\nplt.title('Relation MCO : OAT 10Y vs Euribor 3M')\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.tight_layout()\nplt.show()",
      testPythonCode:
        "assert 'model' in globals() and len(model.fittedvalues) == len(df)",
      hints: ["Utilisez plt.scatter(...) et plt.plot(df['euribor_3m'], model.fittedvalues, ...)."],
      datasets: [],
    },
    {
      id: "py-52",
      title: "26. Cas Pratique Risque : VaR Paramétrique Normale à 95 %",
      category: "alm",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 15,
      description: "Calculez la Value-at-Risk trimestrielle à 95 % d'un portefeuille investi sur le CAC 40.",
      theoryMarkdown: `
### Répétition 26 : Mettre en œuvre la formule de la VaR Paramétrique

> 💡 **Rappel théorique : Perte maximale au quantile $5\\%$**
>
> Soit un rendement $R_t \\sim \\mathcal{N}(\\mu, \\sigma^2)$ (en %) et un capital investi $V_0 = 10\\ 000\\ 000\\text{ EUR}$.
> Avec $z_{0.05} = -1.645$, la perte maximale relative au seuil de confiance de 95 % est :
> $$\\text{VaR}_{95\\%} = -(\\mu - 1.645 \\cdot \\sigma)$$
> Puis la perte en euros vaut : $\\text{VaR}_{\\text{EUR}} = \\frac{\\text{VaR}_{95\\%}}{100} \\times V_0$.

> ✏️ **Exemple chiffré rapide :**
> Si $\\mu = +2.0\\%$ et $\\sigma = 10.0\\%$ sur un trimestre :
> $$\\text{VaR}_{95\\%} = -(2.0 - 1.645 \\times 10.0) = \\mathbf{14.45\\%}$$
> Sur $10\\text{ M EUR}$, la perte trimestrielle ne dépassera pas $1\\ 445\\ 000\\text{ EUR}$ dans 95 % des cas (sous hypothèse gaussienne).
      `,
      taskMarkdown:
        "Estimez \`mu_cac = df['cac40_rendement'].mean()\` et \`sigma_cac = df['cac40_rendement'].std()\`, puis calculez \`var_pct = -(mu_cac - 1.645 * sigma_cac)\` et \`var_eur = (var_pct / 100.0) * 10_000_000\`.",
      initialCode: `# Écrivez votre code Python ci-dessous :
`,
      solutionCode:
        "mu_cac = float(df['cac40_rendement'].mean())\nsigma_cac = float(df['cac40_rendement'].std())\nvar_pct = float(-(mu_cac - 1.645 * sigma_cac))\nvar_eur = float((var_pct / 100.0) * 10_000_000)\nprint(f'Mu = {mu_cac:.2f}% | Sigma = {sigma_cac:.2f}%')\nprint(f'VaR 95% (trimestrielle) : {var_pct:.2f}% -> {var_eur:,.2f} EUR')",
      testPythonCode:
        "assert 'var_pct' in globals() and 'var_eur' in globals()\nassert 10.0 < var_pct < 30.0 and var_eur > 1_000_000",
      hints: ["var_pct = -(mu_cac - 1.645 * sigma_cac), puis (var_pct / 100.0) * 10_000_000"],
      datasets: [],
    },
  ],
};
