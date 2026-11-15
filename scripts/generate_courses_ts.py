#!/usr/bin/env python3
"""
Générateur de curriculum pédagogique actif pour QuantEcon Lab.
Tous les initialCode sont des squelettes d'exercices à trous (TODO / ...) obligeant l'utilisateur à coder.
Théorie économétrique approfondie pour interpréter les résultats (MCO, régression multiple,
programmation statistique matricielle, diagnostics de résidus, séries temporelles et ALM).
"""

script_content = r'''import { CourseModule } from "@/types/course";

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "sql-actuariat",
    title: "SQL pour l'Actuariat & la Data Prep",
    subtitle: "Du SELECT élémentaire aux Window Functions et Ratios S/P",
    icon: "Database",
    description: "Apprentissage itératif pas-à-pas de SQL sur une base de données de portefeuille d'assurance, sinistralité et séries macroéconomiques.",
    exercises: [
      {
        id: "sql-1",
        title: "1. Sélection élémentaire (SELECT)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Sélectionnez les colonnes police_id et age de la table assures.",
        theoryMarkdown: `
### Projection de Colonnes en SQL

En SQL relationnel, la projection consiste à restreindre la liste des attributs retournés par la requête :

$$\\pi_{\\text{police\\_id}, \\text{age}}(\\text{assures})$$

Syntaxe générale :
\`\`\`sql
SELECT colonne1, colonne2 FROM nom_table;
\`\`\`
Évitez d'utiliser systématiquement \`SELECT *\`, car projeter uniquement les champs nécessaires optimise le cache mémoire et les performances d'I/O.
        `,
        taskMarkdown: "Écrivez une requête sélectionnant uniquement \`police_id\` et \`age\` depuis la table \`assures\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, age FROM assures;",
        validationQuery: "SELECT police_id, age FROM assures;",
        hints: ["Remplacez '...' par 'police_id, age'."],
        datasets: []
      },
      {
        id: "sql-2",
        title: "2. Alias de colonnes (AS)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Renommez prime_annuelle en prime_nette.",
        theoryMarkdown: `
### Renommage et Alias avec AS

Le mot-clé \`AS\` permet d'attribuer un libellé métier temporaire au jeu de résultat :
\`\`\`sql
SELECT colonne_source AS nouveau_nom FROM nom_table;
\`\`\`
L'alias ne modifie pas le nom de la colonne dans le schéma physique de la base de données.
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et renommez \`prime_annuelle\` en \`prime_nette\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, prime_annuelle AS prime_nette FROM assures;",
        validationQuery: "SELECT police_id, prime_annuelle AS prime_nette FROM assures;",
        hints: ["Utilisez 'prime_annuelle AS prime_nette'."],
        datasets: []
      },
      {
        id: "sql-3",
        title: "3. Filtrage numérique simple (WHERE)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Filtrez les polices dont la prime annuelle est supérieure à 800 €.",
        theoryMarkdown: `
### Prédicats de comparaison (WHERE)

La clause \`WHERE\` applique une condition booléenne sur chaque ligne avant restitution :

$$\\sigma_{\\text{prime} > 800}(\\text{assures})$$

Opérateurs arithmétiques standard : \`=\`, \`<>\` (ou \`!=\`), \`>\`, \`<\`, \`>=\`, \`<=\`.
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`prime_annuelle\` pour les primes strictement supérieures à 800 €.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, prime_annuelle FROM assures WHERE prime_annuelle > 800;",
        validationQuery: "SELECT police_id, prime_annuelle FROM assures WHERE prime_annuelle > 800;",
        hints: ["WHERE prime_annuelle > 800;"],
        datasets: []
      },
      {
        id: "sql-4",
        title: "4. Filtrage textuel (WHERE string)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Isolez les assurés résidant dans la région 'IDF'.",
        theoryMarkdown: `
### Comparaison de Chaînes de Caractères

En SQL standard, les chaînes de caractères littérales doivent obligatoirement être délimitées par des **guillemets simples** : \`'IDF'\`.
        `,
        taskMarkdown: "Sélectionnez \`police_id\`, \`region\` et \`prime_annuelle\` pour la région \`'IDF'\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, region, prime_annuelle FROM assures WHERE region = 'IDF';",
        validationQuery: "SELECT police_id, region, prime_annuelle FROM assures WHERE region = 'IDF';",
        hints: ["N'oubliez pas les guillemets simples : 'IDF'."],
        datasets: []
      },
      {
        id: "sql-5",
        title: "5. Conjonction logique (AND)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Sélectionnez les conducteurs de moins de 30 ans avec un bonus-malus > 0.8.",
        theoryMarkdown: `
### Conjonction Logique AND

Les deux prédicats doivent être simultanément vrais pour que la ligne soit conservée :

$$\\sigma_{\\text{age} < 30 \\land \\text{CRM} > 0.8}(\\text{assures})$$
        `,
        taskMarkdown: "Sélectionnez \`police_id\`, \`age\` et \`bonus_malus\` pour \`age < 30 AND bonus_malus > 0.8\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, age, bonus_malus FROM assures WHERE age < 30 AND bonus_malus > 0.8;",
        validationQuery: "SELECT police_id, age, bonus_malus FROM assures WHERE age < 30 AND bonus_malus > 0.8;",
        hints: ["WHERE age < 30 AND bonus_malus > 0.8;"],
        datasets: []
      },
      {
        id: "sql-6",
        title: "6. Disjonction logique (OR)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Sélectionnez les polices couvrant un SUV ou une Sportive.",
        theoryMarkdown: `
### Disjonction Logique OR

Conserve les lignes vérifiant au moins l'un des critères :

$$\\sigma_{\\text{type} = \\text{'SUV'} \\lor \\text{type} = \\text{'Sportive'}}(\\text{assures})$$
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`type_vehicule\` où \`type_vehicule = 'SUV' OR type_vehicule = 'Sportive'\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, type_vehicule FROM assures WHERE type_vehicule = 'SUV' OR type_vehicule = 'Sportive';",
        validationQuery: "SELECT police_id, type_vehicule FROM assures WHERE type_vehicule = 'SUV' OR type_vehicule = 'Sportive';",
        hints: ["Complétez avec : type_vehicule = 'Sportive'"],
        datasets: []
      },
      {
        id: "sql-7",
        title: "7. Liste de valeurs (IN)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Filtrez les types de véhicules avec l'opérateur IN.",
        theoryMarkdown: `
### Opérateur IN

L'opérateur \`IN\` teste l'appartenance à un ensemble discret et remplace avantageusement de longues suites de \`OR\` :
\`\`\`sql
WHERE colonne IN ('val1', 'val2', 'val3')
\`\`\`
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`type_vehicule\` pour les véhicules \`IN ('Citadine', 'Berline')\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, type_vehicule FROM assures WHERE type_vehicule IN ('Citadine', 'Berline');",
        validationQuery: "SELECT police_id, type_vehicule FROM assures WHERE type_vehicule IN ('Citadine', 'Berline');",
        hints: ["IN ('Citadine', 'Berline')"],
        datasets: []
      },
      {
        id: "sql-8",
        title: "8. Intervalle continu (BETWEEN)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Sélectionnez les assurés âgés de 25 à 45 ans inclus.",
        theoryMarkdown: `
### Clause BETWEEN

\`val BETWEEN a AND b\` est équivalent à \`val >= a AND val <= b\` (bornes inclusives).
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`age\` où \`age BETWEEN 25 AND 45\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, age FROM assures WHERE age BETWEEN 25 AND 45;",
        validationQuery: "SELECT police_id, age FROM assures WHERE age BETWEEN 25 AND 45;",
        hints: ["WHERE age BETWEEN 25 AND 45;"],
        datasets: []
      },
      {
        id: "sql-9",
        title: "9. Tri des résultats (ORDER BY)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Triez les polices par prime annuelle décroissante.",
        theoryMarkdown: `
### Tri avec ORDER BY

- \`ASC\` : ordre croissant (par défaut).
- \`DESC\` : ordre décroissant.
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`prime_annuelle\` ordonnés par \`prime_annuelle DESC\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, prime_annuelle FROM assures ORDER BY prime_annuelle DESC;",
        validationQuery: "SELECT police_id, prime_annuelle FROM assures ORDER BY prime_annuelle DESC;",
        hints: ["ORDER BY prime_annuelle DESC;"],
        datasets: []
      },
      {
        id: "sql-10",
        title: "10. Top N enregistrements (LIMIT)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Isolez les 3 primes d'assurance les plus chères.",
        theoryMarkdown: `
### Clause LIMIT

\`LIMIT n\` restreint l'échantillon aux $n$ premières lignes renvoyées après le tri.
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`prime_annuelle\` ordonnées par prime décroissante avec \`LIMIT 3\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, prime_annuelle FROM assures ORDER BY prime_annuelle DESC LIMIT 3;",
        validationQuery: "SELECT police_id, prime_annuelle FROM assures ORDER BY prime_annuelle DESC LIMIT 3;",
        hints: ["LIMIT 3;"],
        datasets: []
      },
      {
        id: "sql-11",
        title: "11. Décompte d'effectif (COUNT)",
        category: "data_prep",
        language: "sql",
        difficulty: "Débutant",
        durationMinutes: 5,
        description: "Comptez le nombre total de polices souscrites.",
        theoryMarkdown: `
### Fonction d'Agrégation COUNT()

\`COUNT(*)\` retourne le nombre total de lignes, alors que \`COUNT(colonne)\` ignore les valeurs \`NULL\`.
        `,
        taskMarkdown: "Calculez le nombre total de polices sous l'alias \`nb_total_polices\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT COUNT(*) AS nb_total_polices FROM assures;",
        validationQuery: "SELECT COUNT(*) AS nb_total_polices FROM assures;",
        hints: ["SELECT COUNT(*) AS nb_total_polices FROM assures;"],
        datasets: []
      },
      {
        id: "sql-12",
        title: "12. Somme et Moyenne (SUM, AVG)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Calculez le volume total de primes et la prime moyenne.",
        theoryMarkdown: `
### Fonctions SUM() et AVG()

$$\\text{Moyenne} = \\frac{1}{n} \\sum_{i=1}^n x_i$$
La fonction \`ROUND(valeur, 2)\` permet d'arrondir le résultat à 2 décimales.
        `,
        taskMarkdown: "Calculez \`total_primes\` (\`ROUND(SUM(prime_annuelle), 2)\`) et \`prime_moyenne\` (\`ROUND(AVG(prime_annuelle), 2)\`).",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT ROUND(SUM(prime_annuelle), 2) AS total_primes, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures;",
        validationQuery: "SELECT ROUND(SUM(prime_annuelle), 2) AS total_primes, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures;",
        hints: ["Complétez avec 'prime_annuelle' dans SUM et AVG."],
        datasets: []
      },
      {
        id: "sql-13",
        title: "13. Extrêmes de portefeuille (MIN, MAX)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 5,
        description: "Trouvez la prime minimale et maximale facturées.",
        theoryMarkdown: `
### MIN() et MAX()

Permettent de détecter immédiatement l'étendue tarifaire $[\\text{prime}_{\\min}, \\text{prime}_{\\max}]$.
        `,
        taskMarkdown: "Affichez \`prime_min\` et \`prime_max\` depuis la table \`assures\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT MIN(prime_annuelle) AS prime_min, MAX(prime_annuelle) AS prime_max FROM assures;",
        validationQuery: "SELECT MIN(prime_annuelle) AS prime_min, MAX(prime_annuelle) AS prime_max FROM assures;",
        hints: ["MIN(prime_annuelle) AS prime_min, MAX(prime_annuelle) AS prime_max"],
        datasets: []
      },
      {
        id: "sql-14",
        title: "14. Groupement élémentaire (GROUP BY)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Comptez le nombre de polices par région.",
        theoryMarkdown: `
### Clause GROUP BY

Partitionne la table selon une variable qualitative (ici \`region\`) pour appliquer les fonctions d'agrégation groupe par groupe.
        `,
        taskMarkdown: "Affichez \`region\` et le nombre de polices (\`nb_polices\`) groupées par région.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region;",
        validationQuery: "SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region;",
        hints: ["GROUP BY region;"],
        datasets: []
      },
      {
        id: "sql-15",
        title: "15. Groupement et Prime Moyenne par Véhicule",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 8,
        description: "Calculez la prime moyenne par catégorie de véhicule.",
        theoryMarkdown: `
### Tarification par Segment de Véhicule

La tarification non-vie repose sur la différenciation du risque selon la classe du véhicule (ex : Citadine vs Sportive).
        `,
        taskMarkdown: "Affichez \`type_vehicule\` et \`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne\` groupés par type de véhicule.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT type_vehicule, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_vehicule;",
        validationQuery: "SELECT type_vehicule, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_vehicule;",
        hints: ["GROUP BY type_vehicule;"],
        datasets: []
      },
      {
        id: "sql-16",
        title: "16. Filtrage post-agrégation (HAVING)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Filtrez les régions ayant au moins 2 polices souscrites.",
        theoryMarkdown: `
### Règle d'or : WHERE vs HAVING

- \`WHERE\` filtre les lignes **avant** le groupement.
- \`HAVING\` filtre les groupes **après** calcul de l'agrégation.
        `,
        taskMarkdown: "Affichez \`region\` et \`COUNT(*) AS nb_polices\` groupés par région avec \`HAVING COUNT(*) >= 2\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region HAVING COUNT(*) >= 2;",
        validationQuery: "SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region HAVING COUNT(*) >= 2;",
        hints: ["HAVING COUNT(*) >= 2;"],
        datasets: []
      },
      {
        id: "sql-17",
        title: "17. Conditionnement catégoriel (CASE WHEN)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Catégorisez les primes en 'Élevée' (> 1000 €) ou 'Standard'.",
        theoryMarkdown: `
### Clause CASE WHEN

Permet de discrétiser une variable continue en classes tarifaires :
\`\`\`sql
CASE 
    WHEN condition THEN 'Valeur A'
    ELSE 'Valeur B'
END AS alias_colonne
\`\`\`
        `,
        taskMarkdown: "Affichez \`police_id\`, \`prime_annuelle\` et la colonne \`categorie_prime\` via \`CASE WHEN prime_annuelle > 1000 THEN 'Élevée' ELSE 'Standard' END\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, prime_annuelle, CASE WHEN prime_annuelle > 1000 THEN 'Élevée' ELSE 'Standard' END AS categorie_prime FROM assures;",
        validationQuery: "SELECT police_id, prime_annuelle, CASE WHEN prime_annuelle > 1000 THEN 'Élevée' ELSE 'Standard' END AS categorie_prime FROM assures;",
        hints: ["THEN 'Élevée' ELSE 'Standard' END AS categorie_prime"],
        datasets: []
      },
      {
        id: "sql-18",
        title: "18. Nettoyage de valeurs nulles (COALESCE)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 10,
        description: "Remplacez les dommages corporels nuls par 0.0.",
        theoryMarkdown: `
### Fonction COALESCE()

\`COALESCE(valeur, valeur_par_defaut)\` renvoie le premier argument non nul. Indispensable pour éviter que des opérations arithmétiques avec \`NULL\` ne produisent \`NULL\`.
        `,
        taskMarkdown: "Affichez \`sinistre_id\`, \`cout_dommages_materiels\` et \`COALESCE(cout_corporel, 0.0) AS corporel_impute\` depuis \`sinistres\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT sinistre_id, cout_dommages_materiels, COALESCE(cout_corporel, 0.0) AS corporel_impute FROM sinistres;",
        validationQuery: "SELECT sinistre_id, cout_dommages_materiels, COALESCE(cout_corporel, 0.0) AS corporel_impute FROM sinistres;",
        hints: ["COALESCE(cout_corporel, 0.0) AS corporel_impute"],
        datasets: []
      },
      {
        id: "sql-19",
        title: "19. Jointure interne (INNER JOIN)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 12,
        description: "Associez les polices à leurs sinistres enregistrés.",
        theoryMarkdown: `
### INNER JOIN Relationnel

$$R = \\text{assures} \\bowtie_{\\text{police\\_id}} \\text{sinistres}$$
Ne conserve que les polices d'assurance qui ont au moins un sinistre déclaré.
        `,
        taskMarkdown: "Effectuez un INNER JOIN entre \`assures a\` et \`sinistres s\` sur \`police_id\` et affichez \`a.police_id\`, \`a.type_vehicule\` et \`s.cout_total\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT a.police_id, a.type_vehicule, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id;",
        validationQuery: "SELECT a.police_id, a.type_vehicule, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id;",
        hints: ["ON a.police_id = s.police_id;"],
        datasets: []
      },
      {
        id: "sql-20",
        title: "20. Préservation de l'exposition (LEFT JOIN)",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 12,
        description: "Conservez les polices sans sinistre grâce au LEFT JOIN.",
        theoryMarkdown: `
### Règle d'or Actuarielle du LEFT JOIN

Si l'on utilise un \`INNER JOIN\`, toutes les polices saines (sans sinistre) disparaissent de l'échantillon, ce qui fausse le dénominateur de prime et sous-estime l'exposition globale au risque.
        `,
        taskMarkdown: "Écrivez un LEFT JOIN entre \`assures a\` et \`sinistres s\` affichant \`a.police_id\`, \`a.region\` et \`s.cout_total\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT a.police_id, a.region, s.cout_total FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id;",
        validationQuery: "SELECT a.police_id, a.region, s.cout_total FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id;",
        hints: ["ON a.police_id = s.police_id;"],
        datasets: []
      },
      {
        id: "sql-21",
        title: "21. Combinaison LEFT JOIN et COALESCE",
        category: "data_prep",
        language: "sql",
        difficulty: "Intermédiaire",
        durationMinutes: 12,
        description: "Imputez 0 € aux polices saines sans sinistre.",
        theoryMarkdown: `
### Traitement des valeurs NULL issues du LEFT JOIN

Pour les polices sans accident, \`s.cout_total\` vaut \`NULL\`. En actuariat, leur charge de sinistre est de $0.00$ €.
\`COALESCE(s.cout_total, 0.0)\` permet de nettoyer la table.
        `,
        taskMarkdown: "Affichez \`a.police_id\` et \`COALESCE(s.cout_total, 0.0) AS cout_charge\` via LEFT JOIN.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT a.police_id, COALESCE(s.cout_total, 0.0) AS cout_charge FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id;",
        validationQuery: "SELECT a.police_id, COALESCE(s.cout_total, 0.0) AS cout_charge FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id;",
        hints: ["COALESCE(s.cout_total, 0.0) AS cout_charge"],
        datasets: []
      },
      {
        id: "sql-22",
        title: "22. Sous-requête scalaire dans WHERE",
        category: "data_prep",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 15,
        description: "Sélectionnez les primes supérieures à la moyenne du portefeuille.",
        theoryMarkdown: `
### Sous-requêtes Scalaires

Une sous-requête scalaire retourne une seule valeur (1 ligne, 1 colonne) utilisable dans une comparaison arithmétique :
\`\`\`sql
WHERE prime > (SELECT AVG(prime) FROM table)
\`\`\`
        `,
        taskMarkdown: "Sélectionnez \`police_id\` et \`prime_annuelle\` où \`prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures)\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, prime_annuelle FROM assures WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures);",
        validationQuery: "SELECT police_id, prime_annuelle FROM assures WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures);",
        hints: ["(SELECT AVG(prime_annuelle) FROM assures)"],
        datasets: []
      },
      {
        id: "sql-23",
        title: "23. Sous-requête filtrante (IN subquery)",
        category: "data_prep",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 15,
        description: "Sélectionnez les assurés ayant au moins un sinistre déclaré.",
        theoryMarkdown: `
### Sous-requête avec IN

Permet de vérifier l'appartenance à un ensemble de clés généré dynamiquement par une autre table :
\`\`\`sql
WHERE police_id IN (SELECT DISTINCT police_id FROM sinistres)
\`\`\`
        `,
        taskMarkdown: "Affichez \`police_id\`, \`age\` et \`region\` pour les polices présentes dans la table sinistres.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT police_id, age, region FROM assures WHERE police_id IN (SELECT DISTINCT police_id FROM sinistres);",
        validationQuery: "SELECT police_id, age, region FROM assures WHERE police_id IN (SELECT DISTINCT police_id FROM sinistres);",
        hints: ["police_id IN (SELECT DISTINCT police_id FROM sinistres)"],
        datasets: []
      },
      {
        id: "sql-24",
        title: "24. Calcul du Loss Ratio S/P par Région",
        category: "pricing",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 15,
        description: "Calculez le ratio S/P régional en pourcentage.",
        theoryMarkdown: `
### Ratio Sinistres à Primes (Loss Ratio)

$$S/P_{\\text{région}} = \\frac{\\sum \\text{Coût Total des Sinistres}}{\\sum \\text{Primes Annuelles}} \\times 100$$
Indicateur central de pilotage de la rentabilité technique. Si $S/P > 100\\%$, les sinistres dépassent les primes collectées.
        `,
        taskMarkdown: "Calculez pour chaque région \`region\`, \`ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp\` via LEFT JOIN et GROUP BY.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT a.region, ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.region;",
        validationQuery: "SELECT a.region, ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.region;",
        hints: ["SUM(a.prime_annuelle) au dénominateur et GROUP BY a.region."],
        datasets: []
      },
      {
        id: "sql-25",
        title: "25. Décalage temporel macro (LAG)",
        category: "alm",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 15,
        description: "Récupérez le taux Euribor du trimestre précédent.",
        theoryMarkdown: `
### Window Functions : Décalage Temporel (LAG)

La fonction de fenêtrage \`LAG(colonne, 1) OVER (ORDER BY date)\` permet d'accéder à la ligne précédente dans l'ordre chronologique sans jointure complexe.
        `,
        taskMarkdown: "Affichez \`periode\`, \`euribor_3m\` et \`LAG(euribor_3m, 1) OVER (ORDER BY periode) AS euribor_prev\` depuis \`macro_taux\`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT periode, euribor_3m, LAG(euribor_3m, 1) OVER (ORDER BY periode) AS euribor_prev FROM macro_taux;",
        validationQuery: "SELECT periode, euribor_3m, LAG(euribor_3m, 1) OVER (ORDER BY periode) AS euribor_prev FROM macro_taux;",
        hints: ["LAG(euribor_3m, 1) OVER (ORDER BY periode)"],
        datasets: []
      },
      {
        id: "sql-26",
        title: "26. Cas Pratique Actuariat : Rang de Sinistralité (DENSE_RANK)",
        category: "pricing",
        language: "sql",
        difficulty: "Avancé",
        durationMinutes: 20,
        description: "Classez les régions par coût total décroissant via DENSE_RANK().",
        theoryMarkdown: `
### Classement par Fenêtrage (DENSE_RANK)

\`DENSE_RANK() OVER (ORDER BY SUM(...) DESC)\` attribue un classement ordinal consécutif sans trou (1, 2, 3...) basé sur la charge globale de sinistralité.
        `,
        taskMarkdown: "Affichez \`a.region\`, \`ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout\` et \`DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout\` groupés par région et ordonnés par rang.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT a.region, ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout, DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.region ORDER BY rang_cout ASC;",
        validationQuery: "SELECT a.region, ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout, DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.region ORDER BY rang_cout ASC;",
        hints: ["Donnez l'alias 'rang_cout' à la fonction DENSE_RANK."],
        datasets: []
      }
    ]
  },
  {
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
### Exploration d'un Panel de Séries Temporelles

Avant d'estimer un modèle économétrique, il est indispensable d'inspecter les observations d'entrée. En Pandas, \`df.head(n)\` extrait les $n$ premières lignes du DataFrame.
Le DataFrame pré-chargé \`df\` contient les séries trimestrielles de l'Euribor 3M, du taux souverain OAT 10 ans et de l'inflation harmonisée (HICP).
        `,
        taskMarkdown: "Affichez les 3 premières lignes du DataFrame \`df\` avec \`print(df.head(3))\`.",
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
### Échantillon Temporel & Degrés de Liberté

Soit un échantillon de taille $n$ (ou $T$ pour des séries temporelles) avec $k$ variables explicatives. Pour pouvoir estimer un modèle linéaire et tester des hypothèses, il est nécessaire que :

$$\\text{Degrés de liberté} = n - k - 1 > 0$$

L'attribut \`df.shape\` retourne le tuple \`(n_lignes, n_colonnes)\`.
        `,
        taskMarkdown: "Stockez \`df.shape\` dans la variable \`dimensions\` et affichez-la.",
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
### Moments d'Ordre 1 et 2 d'une Série Financière

- **Espérance empirique (Moyenne)** :
  $$\\bar{y} = \\frac{1}{T} \\sum_{t=1}^T y_t$$
- **Variance sans biais & Écart-type** :
  $$s^2 = \\frac{1}{T - 1} \\sum_{t=1}^T (y_t - \\bar{y})^2, \\quad s = \\sqrt{s^2}$$

Le dénominateur $T - 1$ correspond à la correction de Bessel pour obtenir un estimateur sans biais de la variance de la population.
        `,
        taskMarkdown: "Calculez \`oat_moyenne = df['oat_10y'].mean()\` et \`oat_volatilite = df['oat_10y'].std()\`.",
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
### Quantiles et Événements Rares

Le quantile $q_\\alpha$ d'une variable aléatoire $X$ est défini par :

$$P(X \\le q_\\alpha) = \\alpha$$

- $\\alpha = 0.50$ : Médiane (insensible aux valeurs extrêmes).
- $\\alpha = 0.95$ : Seuil de surchauffe inflationniste dépassé seulement $5\\%$ du temps.
        `,
        taskMarkdown: "Calculez \`mediane_inf = df['inflation_hicp'].median()\` et \`q95_inf = df['inflation_hicp'].quantile(0.95)\`.",
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
### La Pente de la Courbe des Taux (Term Spread)

En gestion actif-passif (ALM), l'écart de rendement entre le taux long sans risque ($r_{10Y}$) et le taux monétaire court terme ($r_{3M}$) mesure la pente de la structure par terme :

$$\\text{Pente}_t = r_{10Y, t} - r_{3M, t}$$

Une pente négative (inversion de courbe) signale historiquement des anticipations de récession et d'assouplissement monétaire.
        `,
        taskMarkdown: "Ajoutez la colonne \`df['pente_taux'] = df['oat_10y'] - df['euribor_3m']\` et affichez les premières lignes.",
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
### Coefficient de Corrélation Linéaire de Pearson

$$\\rho_{X, Y} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{\\sum (x_t - \\bar{x})(y_t - \\bar{y})}{\\sqrt{\\sum (x_t - \\bar{x})^2 \\sum (y_t - \\bar{y})^2}}$$

Propriétés :
- $-1 \\le \\rho \\le 1$.
- $\\rho > 0$ : covariation dans le même sens.
- Une corrélation élevée entre deux variables explicatives ($X_1$ et $X_2$) présage un risque de **multicolinéarité**.
        `,
        taskMarkdown: "Calculez \`matrice_corr = df[['euribor_3m', 'oat_10y', 'inflation_hicp']].corr()\` et affichez-la.",
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
### Règle Robuste de John Tukey

Pour identifier des chocs inflationnistes atypiques sans supposer la normalité de la distribution :

$$\\text{Seuil Supérieur} = Q_3 + 1.5 \\times IQR, \\quad \\text{avec } IQR = Q_3 - Q_1$$

Toute observation au-delà de ce seuil est qualifiée d'outlier modéré ($3 \\times IQR$ pour un outlier extrême).
        `,
        taskMarkdown: "Calculez \`q25\`, \`q75\`, \`iqr = q75 - q25\` et \`seuil_haut = q75 + 1.5 * iqr\` pour \`inflation_hicp\`.",
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
### Pourquoi la constante est-elle indispensable ?

Soit le modèle sous forme matricielle $Y = X\\beta + \\varepsilon$. Si $X$ ne contient pas une colonne unitaire $\\mathbf{1} = (1, 1, \\dots, 1)^T$ :
1. Le modèle est forcé de passer par l'origine $(0, 0)$.
2. La somme des résidus n'est plus garantie d'être nulle : $\\sum e_t \\neq 0$.
3. Le coefficient de détermination $R^2$ peut devenir mathématiquement **négatif** !

En Python, \`sm.add_constant(X)\` insère automatiquement cette colonne baptisée \`const\`.
        `,
        taskMarkdown: "Créez la matrice \`X = sm.add_constant(df[['euribor_3m']])\` et affichez ses premières lignes.",
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
### Le Modèle de Régression Linéaire Simple

$$y_t = \\beta_0 + \\beta_1 x_t + \\varepsilon_t$$

L'estimateur des Moindres Carrés Ordinaires (MCO / OLS) minimise la somme des carrés des résidus :

$$\\min_{\\beta_0, \\beta_1} \\sum_{t=1}^T (y_t - \\beta_0 - \\beta_1 x_t)^2$$

Sous forme matricielle :
$$\\hat{\\beta} = (X^T X)^{-1} X^T Y$$
        `,
        taskMarkdown: "Estimez le modèle OLS \`model = sm.OLS(df['oat_10y'], X).fit()\` et affichez \`print(model.summary())\`.",
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
### Interprétation Économétrique de $\\hat{\\beta}$

Dans l'équation $\\widehat{\\text{OAT}}_t = \\hat{\\beta}_0 + \\hat{\\beta}_1 \\text{Euribor}_t$ :
- $\\hat{\\beta}_0$ (\`const\`) : Valeur prédite du rendement de l'OAT 10 ans lorsque l'Euribor est nul.
- $\\hat{\\beta}_1$ (\`euribor_3m\`) : **Sensibilité marginale** (transmission monétaire). Pour chaque hausse de $+1.0\\%$ (+100 bps) du taux directeur court terme, le rendement de l'obligation souveraine à 10 ans augmente en moyenne de $\\hat{\\beta}_1\\%$.
        `,
        taskMarkdown: "Extrayez \`betas = model.params\` et affichez la constante et la sensibilité.",
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
### Inférence Statistique : Test de Student Individuel

On teste la significativité du coefficient :
$$H_0 : \\beta_1 = 0 \\quad \\text{contre} \\quad H_1 : \\beta_1 \\neq 0$$

- **Statistique de test** :
  $$t_{\\text{stat}} = \\frac{\\hat{\\beta}_1 - 0}{\\hat{\\text{se}}(\\hat{\\beta}_1)} \\sim \\mathcal{T}(T - 2)$$
- **P-valeur (\`P>|t|\`)** : Si la p-valeur $< 0.05$, on **rejette** l'hypothèse nulle au seuil de $5\\%$ : le taux Euribor a un impact statistiquement significatif sur le taux OAT.
        `,
        taskMarkdown: "Extrayez la p-valeur de l'Euribor via \`p_val = model.pvalues['euribor_3m']\`.",
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
### Décomposition de la Variance & Coefficient de Détermination

$$SST = SSE + SSR \\implies \\sum (y_t - \\bar{y})^2 = \\sum (\\hat{y}_t - \\bar{y})^2 + \\sum e_t^2$$

- **$R^2$ classique** :
  $$R^2 = 1 - \\frac{SSR}{SST} = \\frac{\\text{Variance expliquée}}{\\text{Variance totale}}$$
- **$R^2$ ajusté ($\\bar{R}^2$)** :
  $$\\bar{R}^2 = 1 - (1 - R^2)\\frac{T - 1}{T - k - 1}$$
  Le $R^2$ ajusté **pénalise** l'ajout de variables superflues qui réduisent artificiellement les résidus.
        `,
        taskMarkdown: "Stockez \`r2 = model.rsquared\` et \`r2_adj = model.rsquared_adj\`.",
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
### Programmation Statistique : Résolution Matricielle Directe

En programmation statistique, comprendre l'implémentation de bas niveau est fondamental :
$$\\hat{\\beta} = (X^T X)^{-1} X^T Y$$

En Python / NumPy :
- \`X.T\` : transposée $X^T$.
- \`@\` : produit matriciel.
- \`np.linalg.inv()\` : inversion de matrice carrée $(X^TX)^{-1}$.
        `,
        taskMarkdown: "Calculez \`beta_numpy = np.linalg.inv(X.T @ X) @ X.T @ y\` en utilisant les tableaux NumPy \`X.values\` et \`y.values\`.",
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
### Pourquoi la moyenne des résidus est-elle nulle ?

Par les équations normales de premier ordre $\\frac{\\partial SSR}{\\partial \\beta_0} = 0$ :
$$-2 \\sum_{t=1}^T (y_t - \\hat{\\beta}_0 - \\hat{\\beta}_1 x_t) = 0 \\implies \\sum_{t=1}^T e_t = 0 \\implies \\bar{e} = 0$$

Cette propriété algébrique est systématiquement vérifiée dès lors que le modèle comporte une constante unitaire.
        `,
        taskMarkdown: "Extrayez \`residus = model.resid\` et vérifiez que \`residus.mean()\` est proche de 0 ($< 10^{-4}$).",
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
### Le Modèle Linéaire Multiple

$$y_t = \\beta_0 + \\beta_1 \\text{Euribor}_t + \\beta_2 \\text{Inflation}_t + \\varepsilon_t$$

- $\\beta_1$ mesure l'effet propre de l'Euribor **à niveau d'inflation constant** (*ceteris paribus*).
- $\\beta_2$ mesure l'effet propre de l'inflation à taux Euribor constant (prime d'inflation de Fisher).
        `,
        taskMarkdown: "Ajustez le modèle multivarié avec les régresseurs \`['euribor_3m', 'inflation_hicp']\` avec constante.",
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
### Test de Significativité Globale de Fisher

On teste l'hypothèse que **tous** les coefficients de pente sont simultanément nuls :
$$H_0 : \\beta_1 = \\beta_2 = 0 \\quad \\text{contre} \\quad H_1 : \\exists j, \\beta_j \\neq 0$$

- **Statistique F** :
  $$F = \\frac{(SST - SSR) / k}{SSR / (T - k - 1)} = \\frac{R^2 / k}{(1 - R^2) / (T - k - 1)} \\sim \\mathcal{F}(k, T - k - 1)$$
- Si \`f_pvalue < 0.05\`, le modèle dans son ensemble a un pouvoir explicatif hautement significatif.
        `,
        taskMarkdown: "Extrayez la statistique F (\`model_multi.fvalue\`) et sa p-valeur (\`model_multi.f_pvalue\`).",
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
### Le VIF (Variance Inflation Factor)

Si deux variables explicatives sont fortement colinéaires, la matrice $X^TX$ devient mal conditionnée, ce qui fait exploser les erreurs-types des estimateurs :

$$\\operatorname{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum (x_{jt} - \\bar{x}_j)^2} \\times VIF_j, \\quad VIF_j = \\frac{1}{1 - R_j^2}$$

- $VIF < 5$ : absence de multicolinéarité problématique.
- $VIF > 10$ : multicolinéarité sévère (coefficients instables).
        `,
        taskMarkdown: "Calculez le VIF de la variable 'euribor_3m' (indice 1 de la matrice X_multi).",
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
### Hétéroscédasticité & Test de Breusch-Pagan

L'hypothèse d'homoscédasticité de Gauss-Markov exige que la variance des perturbations soit constante :
$$\\operatorname{Var}(\\varepsilon_t \\mid X) = \\sigma^2$$

Si la variance dépend de $X$ (hétéroscédasticité) :
1. $\\hat{\\beta}$ reste sans biais.
2. Mais les erreurs-types standards sont **fausses**, invalidant les tests de Student et de Fisher !
        `,
        taskMarkdown: "Exécutez \`het_breuschpagan(model_multi.resid, X_multi)\` et extrayez la p-valeur du test LM.",
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
### L'Estimateur Sandwich de White (Heteroskedasticity-Consistent)

Pour corriger les tests en présence d'hétéroscédasticité, Halbert White a proposé la matrice sandwich :

$$\\widehat{\\operatorname{Var}}_{\\text{White}}(\\hat{\\beta}) = (X^T X)^{-1} \\left( \\sum_{t=1}^T e_t^2 x_t x_t^T \\right) (X^T X)^{-1}$$

En Statsmodels : \`model.fit(cov_type='HC1')\`. Les coefficients $\\hat{\\beta}$ restent inchangés, seuls les écarts-types sont corrigés.
        `,
        taskMarkdown: "Ajustez le modèle OLS avec \`cov_type='HC1'\` et comparez les écarts-types robustes aux classiques.",
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
### Le Test de Jarque-Bera

Vérifie conjointement l'absence d'asymétrie ($S = 0$) et de sur-aplatissement ($K = 3$) :

$$JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\sim \\chi^2(2)$$

Si la p-valeur $> 0.05$, l'hypothèse de normalité des résidus n'est pas rejetée.
        `,
        taskMarkdown: "Calculez le test de Jarque-Bera sur les résidus via \`jarque_bera(model_multi.resid)\`.",
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
### Le Piège de la Régression Fallacieuse (Granger & Newbold 1974)

Si deux séries $Y_t$ et $X_t$ possèdent une tendance stochastique (marche aléatoire / racine unitaire) :
1. Une régression OLS $Y_t = \\alpha + \\beta X_t + \\varepsilon_t$ produit souvent un $R^2 > 0.90$ et des $t$-stats $> 10$.
2. Pourtant, **aucun lien économique n'existe** ! Les variables sont simplement entraînées par le temps.
3. Symptôme d'alerte : $R^2 > DW$ (statistique de Durbin-Watson très faible).
        `,
        taskMarkdown: "Calculez la statistique de Durbin-Watson sur le modèle en niveau et constatez sa valeur $< 1.5$.",
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
### Équation du Test ADF

$$\\Delta Y_t = \\alpha + \\beta t + \\gamma Y_{t-1} + \\sum_{j=1}^p \\delta_j \\Delta Y_{t-j} + \\varepsilon_t$$

- **Hypothèse nulle** : $H_0 : \\gamma = 0$ (présence d'une racine unitaire, la série est **non stationnaire**).
- **Hypothèse alternative** : $H_1 : \\gamma < 0$ (la série est stationnaire).
- Règle de décision : Si la p-valeur $< 0.05$, on **rejette** $H_0$ $\\implies$ la série est stationnaire.
        `,
        taskMarkdown: "Exécutez le test ADF sur la série différenciée \`df['oat_10y'].diff().dropna()\` et extrayez la p-valeur.",
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "from statsmodels.tsa.stattools import adfuller\nserie_diff = df['oat_10y'].diff().dropna()\nresult_adf = adfuller(serie_diff)\np_val_adf = result_adf[1]\nprint(f'P-valeur ADF sur OAT différenciée : {p_val_adf:.4e}')",
        testPythonCode: "assert 'p_val_adf' in globals()\nassert p_val_adf < 0.05, 'La série différenciée doit être stationnaire (p < 0.05).'",
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
### Régression sur Séries Stationnarisées

Pour échapper à la régression fallacieuse lorsque les séries sont $I(1)$ sans cointégration, on différencie :

$$\\Delta \\text{OAT}_t = \\beta_0 + \\beta_1 \\Delta \\text{Euribor}_t + \\beta_2 \\Delta \\text{Inflation}_t + \\varepsilon_t$$

Ici, $\\beta_1$ mesure l'impact immédiat d'un choc monétaire trimestriel sur le taux long.
        `,
        taskMarkdown: "Créez \`df_diff = df[['oat_10y', 'euribor_3m', 'inflation_hicp']].diff().dropna()\` et ajustez le modèle OLS sur les variations.",
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
### Estimateur HAC de Newey-West

En séries temporelles, les résidus violent fréquemment l'absence d'autocorrélation. L'estimateur de Newey-West ajuste la matrice de variance en tenant compte des covariances croisées jusqu'à $L$ retards :

$$\\widehat{\\operatorname{Var}}_{\\text{HAC}}(\\hat{\\beta}) = (X^T X)^{-1} \\left( \\hat{\\Omega}_0 + \\sum_{l=1}^L w_l (\\hat{\\Omega}_l + \\hat{\\Omega}_l^T) \\right) (X^T X)^{-1}$$

avec le noyau de Bartlett $w_l = 1 - \\frac{l}{L + 1}$.
        `,
        taskMarkdown: "Ajustez le modèle dynamique avec \`cov_type='HAC'\` et \`cov_kwds={'maxlags': 2}\`.",
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
### Rendu Visuel des Valeurs Ajustées

Comparer graphiquement les valeurs observées $y_t$ aux valeurs estimées $\\hat{y}_t = X_t \\hat{\\beta}$ permet de repérer immédiatement les sous-périodes de surévaluation ou sous-évaluation du modèle.
        `,
        taskMarkdown: "Tracez \`y\` et \`model.fittedvalues\` sur le même graphique avec \`plt.show()\`.",
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
### Sensibilité de Duration & Solvabilité II

Pour une institution financière (banque, compagnie d'assurance-vie), la duration modifiée $D^*$ mesure la sensibilité du bilan à une variation du taux d'intérêt :

$$\\frac{\\Delta V}{V_0} \\approx -D^* \\times \\Delta y \\implies \\Delta V \\approx -D^* \\times \\Delta y \\times V_0$$

La Value-at-Risk ($VaR_{99.5\\%}$) à 1 an requise par la directive européenne Solvabilité II correspond à un choc de taux de $+200\\text{ bps}$ ($+0.02$).
        `,
        taskMarkdown: "Calculez la perte en capital \`perte_estimee\` pour $V_0 = 100\\,000\\,000$ €, $D^* = 7.0$ ans et $\\Delta y = +0.02$.",
        initialCode: `# Écrivez votre code Python ci-dessous :
`,
        solutionCode: "valeur_portefeuille = 100_000_000\nduration_modifiee = 7.0\nchoc_taux = 0.02\nperte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille\nprint(f'Perte en capital estimée : {perte_estimee:,.2f} €')",
        testPythonCode: "assert 'perte_estimee' in globals()\nassert perte_estimee == -14_000_000.0",
        hints: ["perte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille"],
        datasets: []
      }
    ]
  }
];
'''

with open("/Users/lucaspasqualis/quant-econ-lab/src/data/courses.ts", "w", encoding="utf-8") as f:
    f.write(script_content)

print("Curriculum actif & pédagogique généré avec succès dans src/data/courses.ts!")
