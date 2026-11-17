import { CourseModule } from "@/types/course";

export const SQL_SUITE_MODULE: CourseModule = {
  id: "sql-actuariat-suite",
  title: "SQL Actuariat : Entraînement & Ancrage (Suite)",
  subtitle: "26 exercices pratiques de répétition pour automatiser les fondamentaux SQL",
  icon: "Database",
  description:
    "Seconde série d'entraînement intensif au même niveau que le Module 1 sur les tables assures, sinistres et macro_taux afin d'ancrer durablement chaque clause SQL.",
  exercises: [
    {
      id: "sql-27",
      title: "1. Projection sur la table sinistres (SELECT)",
      category: "data_prep",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Extrayez les colonnes essentielles d'identification et de coût depuis sinistres.",
      theoryMarkdown: `
### Répétition 1 : Projection ciblée sur \`sinistres\`

> 💡 **Rappel théorique : Cibler la table et les attributs**
>
> En SQL, l'ordre minimal d'une requête de lecture est toujours :
> \`\`\`sql
> SELECT colonne1, colonne2, colonne3
> FROM nom_table;
> \`\`\`
> - Choisir uniquement les colonnes utiles évite de charger les champs textuels ou nullables inutiles en mémoire.
> - Sur la table \`sinistres\`, la clé primaire est \`sinistre_id\`, et la charge totale indemnisée est \`cout_total\`.
      `,
      taskMarkdown:
        "Écrivez une requête qui sélectionne \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis la table \`sinistres\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres;",
      validationQuery: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres;",
      hints: ["SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres;"],
      datasets: [],
    },
    {
      id: "sql-28",
      title: "2. Calcul arithmétique & Alias (AS)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Calculez l'équivalent mensuel de la prime annuelle et nommez la colonne.",
      theoryMarkdown: `
### Répétition 2 : Expression arithmétique et Alias \`AS\`

> 💡 **Rappel : Créer des colonnes calculées à la volée**
>
> SQL permet d'appliquer des opérations arithmétiques (\`+\`, \`-\`, \`*\`, \`/\`) directement dans le \`SELECT\` et d'arrondir avec \`ROUND(valeur, decimales)\` :
> \`\`\`sql
> SELECT police_id, ROUND(prime_annuelle / 12, 2) AS prime_mensuelle
> FROM assures;
> \`\`\`
> Sans \`AS\`, le moteur génère un nom technique illisible (comme \`ROUND(prime_annuelle / 12, 2)\`). Nommer systématiquement les indicateurs calculés facilite l'exploitation en reporting ou Python.
      `,
      taskMarkdown:
        "Sélectionnez \`police_id\`, \`prime_annuelle\` et \`ROUND(prime_annuelle / 12, 2) AS prime_mensuelle\` depuis \`assures\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT police_id, prime_annuelle, ROUND(prime_annuelle / 12, 2) AS prime_mensuelle FROM assures;",
      validationQuery:
        "SELECT police_id, prime_annuelle, ROUND(prime_annuelle / 12, 2) AS prime_mensuelle FROM assures;",
      hints: ["Utilisez ROUND(prime_annuelle / 12, 2) AS prime_mensuelle"],
      datasets: [],
    },
    {
      id: "sql-29",
      title: "3. Valeurs uniques d'une dimension (SELECT DISTINCT)",
      category: "data_prep",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Listez une seule fois chaque formule de contrat présente en portefeuille.",
      theoryMarkdown: `
### Répétition 3 : Dédoublonner avec \`SELECT DISTINCT\`

> 💡 **Rappel : Explorer les modalités d'une variable catégorielle**
>
> Avant de rédiger un filtre \`WHERE\` sur un texte (par ex. \`'Tous Risques'\` vs \`'tous risques'\`), vérifiez toujours les libellés exacts existants grâce à \`DISTINCT\` :
> \`\`\`sql
> SELECT DISTINCT colonne
> FROM table
> ORDER BY colonne ASC;
> \`\`\`

> 📊 **Sens Actuariel :**
> Permet d'auditer rapidement les formules tarifaires (\`type_contrat\`), les régions ou les natures de sinistres sans risque de faute de frappe.
      `,
      taskMarkdown:
        "Affichez les valeurs distinctes de \`type_contrat\` depuis \`assures\`, triées par ordre alphabétique croissant (\`ORDER BY type_contrat ASC\`).",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT DISTINCT type_contrat FROM assures ORDER BY type_contrat ASC;",
      validationQuery: "SELECT DISTINCT type_contrat FROM assures ORDER BY type_contrat ASC;",
      hints: ["SELECT DISTINCT type_contrat FROM assures ORDER BY type_contrat ASC;"],
      datasets: [],
    },
    {
      id: "sql-30",
      title: "4. Filtrage de sinistres graves (WHERE >=)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Isolez les dossiers sinistres dont le coût total atteint ou dépasse 5 000 €.",
      theoryMarkdown: `
### Répétition 4 : Seuils de sinistres graves avec \`WHERE\`

> 💡 **Rappel : Opérateurs \`>\` vs \`>=\`**
>
> En actuariat non-vie, on distingue fréquemment les sinistres *attritionnels* (fréquents et peu coûteux) des sinistres *graves* dépassant un seuil réglementaire ou de réassurance (par ex. $5\\ 000\\text{ EUR}$) :
> - \`> 5000\` exclut un dossier à exactement \`5000.00\`.
> - \`>= 5000\` inclut la borne \`5000.00\`.
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` pour les dossiers dont \`cout_total >= 5000\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total >= 5000;",
      validationQuery:
        "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total >= 5000;",
      hints: ["WHERE cout_total >= 5000;"],
      datasets: [],
    },
    {
      id: "sql-31",
      title: "5. Exclusion d'une catégorie (WHERE !=)",
      category: "data_prep",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Excluez les contrats d'entrée de gamme ('Tiers Simple') de la sélection.",
      theoryMarkdown: `
### Répétition 5 : Opérateur d'inégalité (\`!=\` ou \`<>\`)

> 💡 **Rappel : Exclure un libellé exact**
>
> Pour écarter une catégorie précise tout en conservant toutes les autres (ici \`'Tous Risques'\` et \`'Tiers Étendu'\`), on écrit indifféremment :
> \`\`\`sql
> WHERE type_contrat != 'Tiers Simple'
> -- ou en SQL ANSI strict :
> WHERE type_contrat <> 'Tiers Simple'
> \`\`\`
> Attention : \`!=\` ne retient jamais les valeurs \`NULL\` (inexistantes ici car \`type_contrat\` est \`NOT NULL\`).
      `,
      taskMarkdown:
        "Sélectionnez \`police_id\`, \`age\`, \`type_contrat\` et \`prime_annuelle\` depuis \`assures\` lorsque \`type_contrat != 'Tiers Simple'\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT police_id, age, type_contrat, prime_annuelle FROM assures WHERE type_contrat != 'Tiers Simple';",
      validationQuery:
        "SELECT police_id, age, type_contrat, prime_annuelle FROM assures WHERE type_contrat != 'Tiers Simple';",
      hints: ["WHERE type_contrat != 'Tiers Simple';"],
      datasets: [],
    },
    {
      id: "sql-32",
      title: "6. Ciblage multicritère jeune conducteur (AND)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Identifiez les permis récents conduisant un véhicule d'au moins 5 CV fiscaux.",
      theoryMarkdown: `
### Répétition 6 : Conjonction logique \`AND\`

> 💡 **Rappel : Intersection de deux ensembles**
>
> L'opérateur \`AND\` impose que **toutes** les conditions soient vraies simultanément pour qu'une ligne soit retenue :
> $$\\text{Critère}_1 \\land \\text{Critère}_2$$

> 📊 **Sens Actuariel :**
> Croiser faible ancienneté de permis (\`anciennete_permis < 10\`) et puissance fiscale élevée (\`puissance_fiscale >= 5\`) permet d'isoler un segment à risque tarifaire potentiellement élevé.
      `,
      taskMarkdown:
        "Sélectionnez \`police_id\`, \`anciennete_permis\`, \`puissance_fiscale\` et \`prime_annuelle\` depuis \`assures\` pour \`anciennete_permis < 10 AND puissance_fiscale >= 5\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT police_id, anciennete_permis, puissance_fiscale, prime_annuelle FROM assures WHERE anciennete_permis < 10 AND puissance_fiscale >= 5;",
      validationQuery:
        "SELECT police_id, anciennete_permis, puissance_fiscale, prime_annuelle FROM assures WHERE anciennete_permis < 10 AND puissance_fiscale >= 5;",
      hints: ["WHERE anciennete_permis < 10 AND puissance_fiscale >= 5;"],
      datasets: [],
    },
    {
      id: "sql-33",
      title: "7. Priorité logique AND / OR avec parenthèses",
      category: "data_prep",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 8,
      description: "Combinez une disjonction entre parenthèses avec une condition de prime minimale.",
      theoryMarkdown: `
### Répétition 7 : Maîtriser les parenthèses autour de \`OR\`

> ⚠️ **Règle vitale de logique SQL :**
> \`AND\` est toujours évalué **avant** \`OR\`.
> Écrire \`A OR B AND C\` signifie \`A OR (B AND C)\` — ce qui laisserait passer toute ligne vérifiant \`A\` même si \`C\` est faux !
>
> Pour exiger « (\`usage = 'Tous Déplacements'\` **OU** \`puissance_fiscale >= 9\`) **ET** \`prime_annuelle > 850\` », les parenthèses sont indispensables :
> \`\`\`sql
> WHERE (usage = 'Tous Déplacements' OR puissance_fiscale >= 9)
>   AND prime_annuelle > 850
> \`\`\`
      `,
      taskMarkdown:
        "Sélectionnez \`police_id\`, \`usage\`, \`puissance_fiscale\` et \`prime_annuelle\` depuis \`assures\` pour \`(usage = 'Tous Déplacements' OR puissance_fiscale >= 9) AND prime_annuelle > 850\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT police_id, usage, puissance_fiscale, prime_annuelle FROM assures WHERE (usage = 'Tous Déplacements' OR puissance_fiscale >= 9) AND prime_annuelle > 850;",
      validationQuery:
        "SELECT police_id, usage, puissance_fiscale, prime_annuelle FROM assures WHERE (usage = 'Tous Déplacements' OR puissance_fiscale >= 9) AND prime_annuelle > 850;",
      hints: ["Entourez la clause OR de parenthèses avant le AND prime_annuelle > 850."],
      datasets: [],
    },
    {
      id: "sql-34",
      title: "8. Filtrage par liste de natures (IN)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 5,
      description: "Extrayez les sinistres majeurs liés au Vol ou à l'Incendie.",
      theoryMarkdown: `
### Répétition 8 : Appartenance à un ensemble discret (\`IN\`)

> 💡 **Rappel : Lisibilité et maintenance**
>
> \`WHERE col IN ('Val1', 'Val2', 'Val3')\` est strictement équivalent à une succession de \`OR\`, tout en étant bien plus court et lisible :
> \`\`\`sql
> WHERE nature_sinistre IN ('Vol', 'Incendie')
> \`\`\`
> On peut aussi utiliser \`NOT IN (...)\` pour exclure toute une liste de garanties.
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` lorsque \`nature_sinistre IN ('Vol', 'Incendie')\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre IN ('Vol', 'Incendie');",
      validationQuery:
        "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre IN ('Vol', 'Incendie');",
      hints: ["WHERE nature_sinistre IN ('Vol', 'Incendie');"],
      datasets: [],
    },
    {
      id: "sql-35",
      title: "9. Filtrage d'intervalle macroéconomique (BETWEEN)",
      category: "alm",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Isolez les trimestres où l'inflation HICP se situe entre 2.0 % et 6.0 %.",
      theoryMarkdown: `
### Répétition 9 : Intervalle fermé avec \`BETWEEN\`

> 💡 **Rappel : Bornes inclusives**
>
> L'opérateur \`BETWEEN a AND b\` sélectionne toute valeur vérifiant $a \\le x \\le b$.
> \`\`\`sql
> WHERE inflation_hicp BETWEEN 2.0 AND 6.0
> \`\`\`
> En ALM et suivi macroéconomique (\`macro_taux\`), cela permet d'identifier rapidement des régimes d'inflation intermédiaire entre déflation et choc inflationniste.
      `,
      taskMarkdown:
        "Sélectionnez \`periode\`, \`inflation_hicp\` et \`oat_10y\` depuis \`macro_taux\` avec \`inflation_hicp BETWEEN 2.0 AND 6.0\`, ordonnés par \`periode ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT periode, inflation_hicp, oat_10y FROM macro_taux WHERE inflation_hicp BETWEEN 2.0 AND 6.0 ORDER BY periode ASC;",
      validationQuery:
        "SELECT periode, inflation_hicp, oat_10y FROM macro_taux WHERE inflation_hicp BETWEEN 2.0 AND 6.0 ORDER BY periode ASC;",
      hints: ["WHERE inflation_hicp BETWEEN 2.0 AND 6.0 ORDER BY periode ASC;"],
      datasets: [],
    },
    {
      id: "sql-36",
      title: "10. Extraction par année de survenance (LIKE)",
      category: "data_prep",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Filtrez les sinistres survenus au cours de l'année 2022 via un motif textuel.",
      theoryMarkdown: `
### Répétition 10 : Recherche par motif avec \`LIKE\` et \`%\`

> 💡 **Rappel : Les jokers SQL (\`%\` et \`_\`)**
>
> L'opérateur \`LIKE\` compare une chaîne à un motif :
> - \`%\` remplace **zéro, un ou plusieurs caractères** quelconques.
> - \`_\` remplace exactement **un seul caractère**.
>
> Pour extraire tous les sinistres survenus en 2022 (\`'2022-04-02'\`, \`'2022-11-19'\`, etc.) :
> \`\`\`sql
> WHERE date_survenance LIKE '2022-%'
> \`\`\`

> 📊 **Sens Actuariel :**
> Isoler un *exercice de survenance* (ici 2022) est la première brique de construction des triangles de liquidation (Chain Ladder).
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`date_survenance\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` où \`date_survenance LIKE '2022-%'\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, date_survenance, nature_sinistre, cout_total FROM sinistres WHERE date_survenance LIKE '2022-%';",
      validationQuery:
        "SELECT sinistre_id, date_survenance, nature_sinistre, cout_total FROM sinistres WHERE date_survenance LIKE '2022-%';",
      hints: ["WHERE date_survenance LIKE '2022-%';"],
      datasets: [],
    },
    {
      id: "sql-37",
      title: "11. Isoler les sinistres corporels (IS NOT NULL)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Identifiez les dossiers ayant réellement entraîné un préjudice corporel renseigné.",
      theoryMarkdown: `
### Répétition 11 : Tester la présence de \`NULL\` (\`IS NULL\` / \`IS NOT NULL\`)

> ⚠️ **Piège SQL classique :**
> On n'écrit **jamais** \`col = NULL\` ni \`col != NULL\` ! En logique ternaire SQL, toute comparaison avec \`NULL\` retourne \`UNKNOWN\` (donc aucune ligne !).
>
> Utilisez obligatoirement :
> - \`WHERE cout_corporel IS NULL\` (valeur manquante)
> - \`WHERE cout_corporel IS NOT NULL\` (valeur présente)
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`police_id\`, \`cout_corporel\` et \`cout_total\` depuis \`sinistres\` lorsque \`cout_corporel IS NOT NULL\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, police_id, cout_corporel, cout_total FROM sinistres WHERE cout_corporel IS NOT NULL;",
      validationQuery:
        "SELECT sinistre_id, police_id, cout_corporel, cout_total FROM sinistres WHERE cout_corporel IS NOT NULL;",
      hints: ["WHERE cout_corporel IS NOT NULL;"],
      datasets: [],
    },
    {
      id: "sql-38",
      title: "12. Top 4 des plus gros sinistres (ORDER BY & LIMIT)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Classez les dossiers par coût total décroissant et ne gardez que les 4 plus graves.",
      theoryMarkdown: `
### Répétition 12 : Tri décroissant (\`ORDER BY DESC\`) & \`LIMIT\`

> 💡 **Rappel : Identifier les queues de distribution (*Top Losses*)**
>
> \`ORDER BY\` s'exécute toujours à la fin de la requête, juste avant \`LIMIT\`.
> \`\`\`sql
> SELECT sinistre_id, nature_sinistre, cout_total
> FROM sinistres
> ORDER BY cout_total DESC
> LIMIT 4;
> \`\`\`
> En gestion des risques IARD, quelques dossiers extrêmes concentrent souvent l'essentiel de la charge totale (loi de Pareto).
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\`, triés par \`cout_total DESC\` avec \`LIMIT 4\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres ORDER BY cout_total DESC LIMIT 4;",
      validationQuery:
        "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres ORDER BY cout_total DESC LIMIT 4;",
      hints: ["ORDER BY cout_total DESC LIMIT 4;"],
      datasets: [],
    },
    {
      id: "sql-39",
      title: "13. Bilan global des sinistres (COUNT, SUM, AVG)",
      category: "pricing",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 8,
      description: "Calculez le nombre total de sinistres, leur charge totale et le coût moyen d'un dossier.",
      theoryMarkdown: `
### Répétition 13 : Agrégats fondamentaux (\`COUNT\`, \`SUM\`, \`AVG\`)

> 💡 **Rappel : Sévérité moyenne**
>
> Le coût moyen d'un sinistre (*sévérité*) s'écrit :
> $$\\text{Coût Moyen} = \\frac{1}{N_{\\text{sin}}} \\sum_{i=1}^{N_{\\text{sin}}} \\text{cout\\_total}_i$$
> On utilise \`ROUND(..., 2)\` autour de \`SUM\` et \`AVG\` pour afficher des montants propres au centime d'euro près.
      `,
      taskMarkdown:
        "Calculez \`COUNT(*) AS nb_sinistres\`, \`ROUND(SUM(cout_total), 2) AS charge_totale\` et \`ROUND(AVG(cout_total), 2) AS cout_moyen\` sur la table \`sinistres\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT COUNT(*) AS nb_sinistres, ROUND(SUM(cout_total), 2) AS charge_totale, ROUND(AVG(cout_total), 2) AS cout_moyen FROM sinistres;",
      validationQuery:
        "SELECT COUNT(*) AS nb_sinistres, ROUND(SUM(cout_total), 2) AS charge_totale, ROUND(AVG(cout_total), 2) AS cout_moyen FROM sinistres;",
      hints: ["Respectez les alias : nb_sinistres, charge_totale, cout_moyen."],
      datasets: [],
    },
    {
      id: "sql-40",
      title: "14. Amplitude historique des taux & inflation (MIN, MAX)",
      category: "alm",
      language: "sql",
      difficulty: "Débutant",
      durationMinutes: 6,
      description: "Relevez les bornes extrêmes atteintes par l'Euribor 3 mois et le pic d'inflation.",
      theoryMarkdown: `
### Répétition 14 : Extrêmes empiriques (\`MIN\`, \`MAX\`)

> 💡 **Rappel : Calibrer les scénarios de stress**
>
> Sur une période historique (\`2020-Q1\` à \`2023-Q4\`), \`MIN\` et \`MAX\` mesurent l'étendue des chocs observés :
> $$\\text{Étendue} = \\max(X) - \\min(X)$$
> Entre taux négatifs (\`-0.57 %\`) et resserrement monétaire rapide (\`+3.92 %\`), l'Euribor 3M illustre un choc de plus de $440\\text{ bps}$.
      `,
      taskMarkdown:
        "Sélectionnez \`MIN(euribor_3m) AS euribor_min\`, \`MAX(euribor_3m) AS euribor_max\` et \`MAX(inflation_hicp) AS inflation_max\` depuis \`macro_taux\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT MIN(euribor_3m) AS euribor_min, MAX(euribor_3m) AS euribor_max, MAX(inflation_hicp) AS inflation_max FROM macro_taux;",
      validationQuery:
        "SELECT MIN(euribor_3m) AS euribor_min, MAX(euribor_3m) AS euribor_max, MAX(inflation_hicp) AS inflation_max FROM macro_taux;",
      hints: ["MIN(euribor_3m) AS euribor_min, MAX(euribor_3m) AS euribor_max, MAX(inflation_hicp) AS inflation_max"],
      datasets: [],
    },
    {
      id: "sql-41",
      title: "15. Effectifs et prime moyenne par contrat (GROUP BY)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Comparez le nombre de polices et la prime moyenne selon le type de contrat.",
      theoryMarkdown: `
### Répétition 15 : Segmentation par dimension avec \`GROUP BY\`

> 💡 **Rappel : Règle d'or de cohérence du \`GROUP BY\`**
>
> Toute colonne figurant dans le \`SELECT\` **sans** être encapsulée dans une fonction d'agrégation (\`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`) doit impérativement figurer dans le \`GROUP BY\`.
>
> On vérifie ainsi que les contrats \`'Tous Risques'\` présentent logiquement une prime moyenne supérieure aux formules \`'Tiers Étendu'\` ou \`'Tiers Simple'\`.
      `,
      taskMarkdown:
        "Calculez pour chaque \`type_contrat\` : \`COUNT(*) AS nb_polices\` et \`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne\` depuis \`assures\`, groupés par \`type_contrat\` et ordonnés par \`prime_moyenne DESC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT type_contrat, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_contrat ORDER BY prime_moyenne DESC;",
      validationQuery:
        "SELECT type_contrat, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_contrat ORDER BY prime_moyenne DESC;",
      hints: ["GROUP BY type_contrat ORDER BY prime_moyenne DESC;"],
      datasets: [],
    },
    {
      id: "sql-42",
      title: "16. Sinistralité par nature d'événement (GROUP BY)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Ventilez le nombre de dossiers et le coût cumulé par nature de sinistre.",
      theoryMarkdown: `
### Répétition 16 : Identifier les périls les plus coûteux

> 💡 **Rappel : Fréquence vs Sévérité par garantie**
>
> Regrouper \`sinistres\` par \`nature_sinistre\` permet de comparer le poids financier total (\`SUM(cout_total)\`) de chaque garantie (*Collision*, *Vol*, *Incendie*, *Bris de Glace*).
      `,
      taskMarkdown:
        "Sélectionnez \`nature_sinistre\`, \`COUNT(*) AS nb_dossiers\` et \`ROUND(SUM(cout_total), 2) AS cout_cumule\` depuis \`sinistres\`, groupés par \`nature_sinistre\` et ordonnés par \`cout_cumule DESC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT nature_sinistre, COUNT(*) AS nb_dossiers, ROUND(SUM(cout_total), 2) AS cout_cumule FROM sinistres GROUP BY nature_sinistre ORDER BY cout_cumule DESC;",
      validationQuery:
        "SELECT nature_sinistre, COUNT(*) AS nb_dossiers, ROUND(SUM(cout_total), 2) AS cout_cumule FROM sinistres GROUP BY nature_sinistre ORDER BY cout_cumule DESC;",
      hints: ["GROUP BY nature_sinistre ORDER BY cout_cumule DESC;"],
      datasets: [],
    },
    {
      id: "sql-43",
      title: "17. Segments significatifs par usage (GROUP BY & HAVING)",
      category: "data_prep",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Ne conservez que les types d'usage regroupant au moins 3 polices.",
      theoryMarkdown: `
### Répétition 17 : \`WHERE\` vs \`HAVING\`

> ⚠️ **Ne confondez jamais les deux clauses :**
> - \`WHERE\` filtre les **lignes brutes** avant tout regroupement.
> - \`HAVING\` filtre les **groupes agrégés** après \`GROUP BY\` (ici \`HAVING COUNT(*) >= 3\` pour éviter d'analyser des segments de taille statistiquement trop faible).
      `,
      taskMarkdown:
        "Affichez \`usage\`, \`COUNT(*) AS nb_polices\` et \`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne\` depuis \`assures\`, groupés par \`usage\` avec \`HAVING COUNT(*) >= 3\`, ordonnés par \`usage ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT usage, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY usage HAVING COUNT(*) >= 3 ORDER BY usage ASC;",
      validationQuery:
        "SELECT usage, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY usage HAVING COUNT(*) >= 3 ORDER BY usage ASC;",
      hints: ["Utilisez HAVING COUNT(*) >= 3 après GROUP BY usage."],
      datasets: [],
    },
    {
      id: "sql-44",
      title: "18. Profilage Bonus-Malus multi-tranches (CASE WHEN)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Catégorisez chaque assuré selon son Coefficient de Réduction-Majoration (CRM).",
      theoryMarkdown: `
### Répétition 18 : \`CASE WHEN\` à plusieurs branches

> 💡 **Rappel : Ordre d'évaluation des branches**
>
> SQL évalue les conditions \`WHEN\` dans l'ordre et s'arrête à la première vraie :
> \`\`\`sql
> CASE
>   WHEN bonus_malus = 0.50 THEN 'Bonus Max'
>   WHEN bonus_malus < 1.0  THEN 'Bonus Standard'
>   ELSE 'Malus'
> END AS profil_crm
> \`\`\`
> En assurance auto française, le coefficient $0.50$ correspond au bonus maximal à 50 %.
      `,
      taskMarkdown:
        "Sélectionnez \`police_id\`, \`bonus_malus\` et la colonne calculée \`profil_crm\` ('Bonus Max' si \`= 0.50\`, 'Bonus Standard' si \`< 1.0\`, sinon 'Malus') depuis \`assures\`, ordonnés par \`police_id ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT police_id, bonus_malus, CASE WHEN bonus_malus = 0.50 THEN 'Bonus Max' WHEN bonus_malus < 1.0 THEN 'Bonus Standard' ELSE 'Malus' END AS profil_crm FROM assures ORDER BY police_id ASC;",
      validationQuery:
        "SELECT police_id, bonus_malus, CASE WHEN bonus_malus = 0.50 THEN 'Bonus Max' WHEN bonus_malus < 1.0 THEN 'Bonus Standard' ELSE 'Malus' END AS profil_crm FROM assures ORDER BY police_id ASC;",
      hints: ["Terminez la structure par END AS profil_crm et triez par police_id ASC."],
      datasets: [],
    },
    {
      id: "sql-45",
      title: "19. Comptage conditionnel (SUM + CASE WHEN)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Comptez sur une seule ligne le total de sinistres et le nombre de sinistres graves (>= 5 000 €).",
      theoryMarkdown: `
### Répétition 19 : L'astuce du \`SUM(CASE WHEN ... THEN 1 ELSE 0 END)\`

> 💡 **Rappel : Compter une sous-population sans \`WHERE\`**
>
> En combinant \`SUM\` et un indicateur binaire \`1 / 0\`, on calcule simultanément un total global et un sous-effectif ciblé :
> \`\`\`sql
> COUNT(*) AS total_dossiers,
> SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves
> \`\`\`
> C'est la technique standard en SQL pour produire des taux d'incidence (fréquence de sinistres graves, taux de défaut, etc.).
      `,
      taskMarkdown:
        "Calculez \`COUNT(*) AS total_dossiers\` et \`SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves\` sur \`sinistres\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT COUNT(*) AS total_dossiers, SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves FROM sinistres;",
      validationQuery:
        "SELECT COUNT(*) AS total_dossiers, SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves FROM sinistres;",
      hints: ["SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves"],
      datasets: [],
    },
    {
      id: "sql-46",
      title: "20. Audit arithmétique avec COALESCE sur valeurs nulles",
      category: "data_prep",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 8,
      description: "Vérifiez que cout_dommages_materiels + cout_corporel imputé reconstitue bien cout_total.",
      theoryMarkdown: `
### Répétition 20 : Éviter le piège de l'addition avec \`NULL\`

> ⚠️ **Règle fondamentale :**
> En SQL, \`1450.00 + NULL\` donne **\`NULL\`** (et non \`1450.00\`) !
>
> En enveloppant la colonne nullable dans \`COALESCE(cout_corporel, 0.0)\`, l'addition retrouve un comportement sûr :
> $$\\text{Total reconstitué} = \\text{Dommages matériels} + \\text{COALESCE}(\\text{Corporel}, 0.0)$$
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`cout_dommages_materiels\`, \`COALESCE(cout_corporel, 0.0) AS corporel_net\` et \`ROUND(cout_dommages_materiels + COALESCE(cout_corporel, 0.0), 2) AS total_reconstitue\` depuis \`sinistres\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, cout_dommages_materiels, COALESCE(cout_corporel, 0.0) AS corporel_net, ROUND(cout_dommages_materiels + COALESCE(cout_corporel, 0.0), 2) AS total_reconstitue FROM sinistres;",
      validationQuery:
        "SELECT sinistre_id, cout_dommages_materiels, COALESCE(cout_corporel, 0.0) AS corporel_net, ROUND(cout_dommages_materiels + COALESCE(cout_corporel, 0.0), 2) AS total_reconstitue FROM sinistres;",
      hints: ["Utilisez COALESCE(cout_corporel, 0.0) à deux endroits : seul puis dans l'addition."],
      datasets: [],
    },
    {
      id: "sql-47",
      title: "21. Sinistres en Île-de-France (INNER JOIN + WHERE)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Croisez assures et sinistres pour extraire uniquement les dossiers de la région IDF.",
      theoryMarkdown: `
### Répétition 21 : Jointure interne filtrée avec alias de tables

> 💡 **Rappel : Préfixer chaque colonne avec l'alias de table (\`a.\` et \`s.\`)**
>
> Dès qu'une requête relie plusieurs tables, préfixez systématiquement les colonnes ambiguës (comme \`a.police_id = s.police_id\`).
> \`\`\`sql
> FROM assures a
> INNER JOIN sinistres s ON a.police_id = s.police_id
> WHERE a.region = 'IDF'
> ORDER BY s.sinistre_id ASC;
> \`\`\`
      `,
      taskMarkdown:
        "Joignez \`assures a\` et \`sinistres s\` via \`INNER JOIN\` sur \`police_id\` pour \`a.region = 'IDF'\`. Affichez \`s.sinistre_id\`, \`a.police_id\`, \`a.type_vehicule\`, \`s.nature_sinistre\` et \`s.cout_total\`, triés par \`s.sinistre_id ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT s.sinistre_id, a.police_id, a.type_vehicule, s.nature_sinistre, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id WHERE a.region = 'IDF' ORDER BY s.sinistre_id ASC;",
      validationQuery:
        "SELECT s.sinistre_id, a.police_id, a.type_vehicule, s.nature_sinistre, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id WHERE a.region = 'IDF' ORDER BY s.sinistre_id ASC;",
      hints: ["INNER JOIN sinistres s ON a.police_id = s.police_id WHERE a.region = 'IDF'"],
      datasets: [],
    },
    {
      id: "sql-48",
      title: "22. Fréquence et charge par contrat (LEFT JOIN & COUNT)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 12,
      description: "Comptez le vrai nombre de sinistres (y compris 0) et la charge totale de chacun des 12 contrats.",
      theoryMarkdown: `
### Répétition 22 : Piège subtil entre \`COUNT(*)\` et \`COUNT(s.sinistre_id)\` après un \`LEFT JOIN\`

> ⚠️ **Nuance cruciale :**
> Après un \`LEFT JOIN assure a LEFT JOIN sinistres s\` :
> - Une police sans sinistre produit tout de même **1 ligne** (avec \`s.sinistre_id = NULL\`).
> - \`COUNT(*)\` renverrait \`1\` (Faux !).
> - \`COUNT(s.sinistre_id)\` ignore les \`NULL\` et renvoie correctement **\`0\`** !
      `,
      taskMarkdown:
        "Via \`LEFT JOIN\`, affichez pour chaque police : \`a.police_id\`, \`a.prime_annuelle\`, \`COUNT(s.sinistre_id) AS nb_sinistres\` et \`ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police\`, groupés par \`a.police_id, a.prime_annuelle\` et ordonnés par \`a.police_id ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT a.police_id, a.prime_annuelle, COUNT(s.sinistre_id) AS nb_sinistres, ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.police_id, a.prime_annuelle ORDER BY a.police_id ASC;",
      validationQuery:
        "SELECT a.police_id, a.prime_annuelle, COUNT(s.sinistre_id) AS nb_sinistres, ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.police_id, a.prime_annuelle ORDER BY a.police_id ASC;",
      hints: ["Utilisez COUNT(s.sinistre_id) et non COUNT(*)."],
      datasets: [],
    },
    {
      id: "sql-49",
      title: "23. Anti-jointure : Contrats sans aucun sinistre",
      category: "data_prep",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Identifiez les assurés indemnes à l'aide d'un LEFT JOIN filtré sur NULL.",
      theoryMarkdown: `
### Répétition 23 : Patron d'Anti-Jointure (\`LEFT JOIN ... WHERE droite.id IS NULL\`)

> 💡 **Rappel : Trouver les absents d'une relation**
>
> En conservant toutes les polices à gauche (\`LEFT JOIN\`) puis en ne gardant que les lignes où la clé de droite est restée \`NULL\`, on isole exactement les contrats **n'ayant jamais déclaré de sinistre** :
> \`\`\`sql
> SELECT a.police_id
> FROM assures a
> LEFT JOIN sinistres s ON a.police_id = s.police_id
> WHERE s.sinistre_id IS NULL;
> \`\`\`
      `,
      taskMarkdown:
        "Sélectionnez \`a.police_id\`, \`a.age\`, \`a.region\` et \`a.prime_annuelle\` pour les assurés n'ayant aucun sinistre (\`WHERE s.sinistre_id IS NULL\`), triés par \`a.police_id ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT a.police_id, a.age, a.region, a.prime_annuelle FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.sinistre_id IS NULL ORDER BY a.police_id ASC;",
      validationQuery:
        "SELECT a.police_id, a.age, a.region, a.prime_annuelle FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.sinistre_id IS NULL ORDER BY a.police_id ASC;",
      hints: ["LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.sinistre_id IS NULL"],
      datasets: [],
    },
    {
      id: "sql-50",
      title: "24. Sinistres supérieurs à la moyenne (Sous-requête scalaire)",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 10,
      description: "Filtrez les dossiers dépassant le coût moyen empirique sans écrire la valeur en dur.",
      theoryMarkdown: `
### Répétition 24 : Comparaison dynamique via sous-requête scalaire

> 💡 **Rappel : Interdiction des agrégats directs dans \`WHERE\`**
>
> \`WHERE cout_total > AVG(cout_total)\` déclenche une erreur SQL car \`WHERE\` s'exécute ligne par ligne avant \`AVG\`.
> La sous-requête entre parenthèses est évaluée **une fois** avant le filtre principal :
> \`\`\`sql
> WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres)
> \`\`\`
      `,
      taskMarkdown:
        "Sélectionnez \`sinistre_id\`, \`police_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` pour les dossiers avec \`cout_total > (SELECT AVG(cout_total) FROM sinistres)\`, triés par \`cout_total DESC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT sinistre_id, police_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres) ORDER BY cout_total DESC;",
      validationQuery:
        "SELECT sinistre_id, police_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres) ORDER BY cout_total DESC;",
      hints: ["Comparez cout_total > (SELECT AVG(cout_total) FROM sinistres)."],
      datasets: [],
    },
    {
      id: "sql-51",
      title: "25. Ratio S/P par type de contrat (LEFT JOIN & COALESCE)",
      category: "pricing",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 15,
      description: "Calculez le Loss Ratio S/P (en %) pour chaque formule tarifaire.",
      theoryMarkdown: `
### Répétition 25 : Segmentation du Loss Ratio S/P par garantie

> 💡 **Rappel : Formule du S/P agrégé**
>
> Comme au Module 1 (Ex. 24), nous croisons l'exposition complète (\`LEFT JOIN\`) et l'imputation \`COALESCE\` :
> $$\\text{Ratio S/P} = \\frac{\\sum \\text{COALESCE}(s.\\text{cout\\_total}, 0)}{\\sum a.\\text{prime\\_annuelle}} \\times 100$$

> ⚠️ **Note de production actuarielle :**
> Lorsqu'un même contrat possède plusieurs sinistres (ex. \`police_id = 1003\` avec 2 sinistres), un \`LEFT JOIN\` direct duplique sa ligne (et donc sa prime) dans le dénominateur. En production, on pré-agrège souvent \`sinistres\` par \`police_id\` dans une sous-requête ou CTE. Ici, pour rester strictement sur le même schéma que M1 Ex. 24, utilisez le \`LEFT JOIN\` direct suivi de \`GROUP BY a.type_contrat\`.
      `,
      taskMarkdown:
        "Calculez \`a.type_contrat\` et \`ROUND(SUM(COALESCE(s.cout_total, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp\` via \`LEFT JOIN\` et \`GROUP BY a.type_contrat\`, ordonnés par \`ratio_sp DESC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT a.type_contrat, ROUND(SUM(COALESCE(s.cout_total, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.type_contrat ORDER BY ratio_sp DESC;",
      validationQuery:
        "SELECT a.type_contrat, ROUND(SUM(COALESCE(s.cout_total, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.type_contrat ORDER BY ratio_sp DESC;",
      hints: ["GROUP BY a.type_contrat ORDER BY ratio_sp DESC;"],
      datasets: [],
    },
    {
      id: "sql-52",
      title: "26. Pente des taux & variation d'inflation (LAG)",
      category: "alm",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 15,
      description: "Calculez simultanément le spread 10Y-3M et la variation trimestrielle de l'inflation.",
      theoryMarkdown: `
### Répétition 26 : Combiner indicateur instantané et fenêtre \`LAG()\`

> 💡 **Rappel : Mesurer la dynamique macroéconomique**
>
> À chaque trimestre $t$ de \`macro_taux\`, on calcule :
> 1. La pente instantanée des taux : $\\text{Pente}_t = \\text{OAT}_{10Y,t} - \\text{Euribor}_{3M,t}$
> 2. La variation trimestrielle d'inflation : $\\Delta \\pi_t = \\pi_t - \\pi_{t-1}$ grâce à \`LAG(inflation_hicp, 1) OVER (ORDER BY periode)\`.
      `,
      taskMarkdown:
        "Affichez \`periode\`, \`ROUND(oat_10y - euribor_3m, 2) AS pente_taux\`, \`inflation_hicp\` et \`ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation\` depuis \`macro_taux\`, triés par \`periode ASC\`.",
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode:
        "SELECT periode, ROUND(oat_10y - euribor_3m, 2) AS pente_taux, inflation_hicp, ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation FROM macro_taux ORDER BY periode ASC;",
      validationQuery:
        "SELECT periode, ROUND(oat_10y - euribor_3m, 2) AS pente_taux, inflation_hicp, ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation FROM macro_taux ORDER BY periode ASC;",
      hints: ["Utilisez ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation"],
      datasets: [],
    },
  ],
};
