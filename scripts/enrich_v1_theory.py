#!/usr/bin/env python3
"""
Enrichit src/data/courses.ts (Version 1) avec les 8 graphiques explicatifs Matplotlib
et leurs fiches d'interprétation pédagogiques sous chaque graphique.
"""

import re

COURSES_PATH = '/Users/lucaspasqualis/quant-econ-lab/src/data/courses.ts'

with open(COURSES_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

EXERCISE_INSERTS = {
    "sql-14": """![Mécanisme GROUP BY & Agrégation](/images/theory/fig_v1_sql_groupby.png)

> 🔍 **Comprendre ce graphique : Le paradigme Split - Apply - Combine**
> 
> - **Les points bleus (lignes brutes)** : Chaque point représente un contrat individuel avec sa prime d'assurance propre.
> - **Le partitionnement (`GROUP BY`)** : Le moteur SQL isole les contrats dans des bacs étanches par modalité de région (Nord, Sud, Ouest).
> - **L'agrégation (`AVG()`)** : Pour chaque bac, la fonction calcule la moyenne arithmétique et compresse toutes les lignes du groupe en **une seule barre synthétique**.""",

    "sql-20": """![INNER JOIN vs LEFT JOIN en Actuariat](/images/theory/fig_v1_sql_joins.png)

> 🔍 **Comprendre ce graphique : L'importance vitale du LEFT JOIN en actuariat**
> 
> - **À gauche (INNER JOIN - Le piège)** : Seuls les assurés ayant déclaré un sinistre ont une correspondance dans la table `sinistres`. L'INNER JOIN élimine tous les assurés sains (en rouge), ce qui détruit le dénominateur de votre portefeuille et surévalue artificiellement la prime de risque !
> - **À droite (LEFT JOIN - La bonne pratique)** : Tous les assurés de la table de gauche sont intégralement préservés. Les conducteurs sans sinistre reçoivent des valeurs `NULL` (faciles à remplacer par `0 €` via `COALESCE`), garantissant une mesure sans biais de l'exposition globale.""",

    "sql-24": """![Le Loss Ratio S/P en Assurance](/images/theory/fig_v1_loss_ratio.png)

> 🔍 **Comprendre ce graphique : L'indicateur roi de la rentabilité technique**
> 
> - **La ligne rouge (Seuil 100%)** : Le point d'équilibre où l'intégralité des primes perçues est absorbée par les sinistres indemnisés.
> - **Barres vertes ($S/P < 80\%$)** : Zone de rentabilité technique saine, permettant de couvrir les frais généraux et de dégager une marge.
> - **Barre rouge ($S/P > 100\%$)** : Zone de déficit technique caractérisant une **sous-tarification** de la région ou une dérive de la sinistralité climatique.""",

    "py-7": """![Anatomie du Boxplot et Règle de Tukey](/images/theory/fig_v1_boxplot_tukey.png)

> 🔍 **Comprendre ce graphique : La robustesse de l'écart interquartile (IQR)**
> 
> - **La boîte centrale ($Q_1$ à $Q_3$)** : Contient exactement $50\%$ des observations centrales du portefeuille.
> - **La barre rouge médiane ($Q_2$)** : La valeur qui sépare la population en deux parts égales (insensible aux valeurs extrêmes).
> - **Les moustaches ($\pm 1.5 \\times IQR$)** : L'intervalle de dispersion statistique normale établi par John Tukey.
> - **Les points rouges isolés (Outliers)** : Sinistres exceptionnels (grands sinistres corporels ou industriels) à isoler pour éviter de fausser les estimations de prime pure.""",

    "py-9": """![Principe Géométrique des Moindres Carrés Ordinaires](/images/theory/fig_v1_ols_residuals.png)

> 🔍 **Comprendre ce graphique : La minimisation des résidus au carré**
> 
> - **Les points noirs** : Observations empiriques $(X_i, Y_i)$ reliant l'âge de l'assuré à sa prime.
> - **La droite bleue ($\hat{Y} = \hat{\beta}_0 + \hat{\beta}_1 X$)** : L'unique droite dans l'espace qui minimise la somme des carrés des distances verticales.
> - **Les pointillés rouges ($e_i = Y_i - \hat{Y}_i$)** : Les résidus ou erreurs d'estimation. L'élévation au carré pénalise plus fortement les grands écarts et garantit que la somme des résidus est exactement nulle ($\sum e_i = 0$).""",

    "py-11": """![Test de Student et Zone de Rejet](/images/theory/fig_v1_student_test.png)

> 🔍 **Comprendre ce graphique : Comment décider si une variable a un impact réel**
> 
> - **La courbe en cloche** : Distribution théorique de la statistique de test sous l'hypothèse nulle $H_0: \beta_1 = 0$ (aucun effet de la variable).
> - **La zone bleue centrale ($95\%$)** : Si la statistique calculée $t$ tombe ici, on ne peut pas exclure que la relation observée soit due au pur hasard (p-valeur $> 0.05$).
> - **Les zones rouges extrêmes ($\pm 1.96$)** : Si $|t| \ge 1.96$ (p-valeur $< 0.05$), le résultat est statistiquement significatif au seuil de $5\%$ : on rejette formellement l'absence d'effet.""",

    "py-18": """![Homoscédasticité vs Hétéroscédasticité](/images/theory/fig_v1_heteroscedasticity.png)

> 🔍 **Comprendre ce graphique : Quand les hypothèses OLS s'effondrent**
> 
> - **Graphique de gauche (Homoscédasticité - Idéal)** : Les résidus forment une bande horizontale régulière de largeur constante autour de 0. Les écarts-types d'OLS sont fiables.
> - **Graphique de droite (Hétéroscédasticité - En entonnoir)** : La dispersion des erreurs augmente avec les valeurs prédites $\hat{Y}$ (fréquent en actuariat où les gros contrats ont une variance de sinistralité beaucoup plus forte). Les tests de Student ordinaires deviennent invalides et nécessitent une correction robuste de White (HC).""",

    "py-21": """![Le Piège de la Régression Fallacieuse](/images/theory/fig_v1_spurious_regression.png)

> 🔍 **Comprendre ce graphique : L'illusion de corrélation temporelle**
> 
> - **Deux séries indépendantes** : La courbe bleue et la courbe jaune ont été générées par deux tirages aléatoires totalement distincts et sans aucun lien causal.
> - **Le piège de la tendance stochastique** : Parce que les deux séries dérivent avec le temps (processus intégrés $I(1)$), une régression OLS naïve affichera un $R^2 > 0.80$ et un t-stat spectaculaire !
> - **Le réflexe économétrique** : Toujours tester la présence d'une racine unitaire (test ADF) et passer aux différences premières $\Delta Y_t = Y_t - Y_{t-1}$ pour stationnariser les séries avant de régresser."""
}

for ex_id, block in EXERCISE_INSERTS.items():
    # Escape backticks for TypeScript template literal
    escaped_block = block.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    pattern = rf'(id:\s*\"{ex_id}\".*?theoryMarkdown:\s*`)(.*?)(`\s*,\s*taskMarkdown)'
    
    def make_repl(b):
        def repl(m):
            prefix = m.group(1)
            body = m.group(2).rstrip()
            suffix = m.group(3)
            return prefix + body + "\n\n" + b + "\n        " + suffix
        return repl
    
    new_text, count = re.subn(pattern, make_repl(escaped_block), text, count=1, flags=re.DOTALL)
    if count != 1:
        raise RuntimeError(f"Could not insert graphic for {ex_id}")
    text = new_text
    print(f"Inséré avec succès pour {ex_id}")

with open(COURSES_PATH, 'w', encoding='utf-8') as f:
    f.write(text)

print("Version 1 (courses.ts) enrichie avec succès avec les 8 figures pédagogiques !")
