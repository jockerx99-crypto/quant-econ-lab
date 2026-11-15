import { CourseModule } from "@/types/course";

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

> 💡 **Rappel théorique : L'opérateur de projection relationnelle**
> 
> En algèbre relationnelle de Codd, la projection $\\pi$ restreint l'ensemble des attributs retournés sans modifier le nombre de tuples (lignes) :
> $$\\pi_{\\text{police\\_id}, \\text{age}}(\\text{assures})$$
> Syntaxe générale :
> \`\`\`sql
> SELECT colonne1, colonne2 FROM nom_table;
> \`\`\`

> ⚠️ **Règle d'or d'ingénierie des données :**
> Évitez formellement l'utilisation de \`SELECT *\` en production. Projeter uniquement les champs indispensables (\`police_id\`, \`age\`) optimise la bande passante I/O, le cache mémoire du moteur de base de données et préserve les performances sur de volumineux portefeuilles d'assurés.
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
### Alias de Colonnes avec AS

> 💡 **Rappel : Renommage logique vs Schéma physique**
> 
> Le mot-clé \`AS\` attribue un libellé métier temporaire au jeu de résultats :
> \`\`\`sql
> SELECT colonne_source AS nouveau_nom FROM nom_table;
> \`\`\`
> - **Invariance physique** : L'alias ne modifie jamais le nom de la colonne dans le schéma physique de la table.
> - **Visibilité** : Dans le cycle d'exécution SQL, l'alias créé dans le \`SELECT\` n'est pas accessible dans la clause \`WHERE\` (car \`WHERE\` est évalué *avant* \`SELECT\`).

> 📊 **Sens Métier :**
> Permet d'adapter le vocabulaire technique des bases de données aux standards actuariels et comptables (*ex : renommer \`prime_annuelle\` en \`prime_nette\` ou \`cotisation_ttc\`*).
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
### Filtrage Numérique avec la clause WHERE

> 💡 **Rappel : L'opérateur de sélection (restriction)**
> 
> La clause \`WHERE\` implémente la restriction algébrique $\\sigma$ qui filtre les lignes satisfaisant un prédicat logique :
> $$\\sigma_{\\text{prime\\_annuelle} > 1000}(\\text{assures})$$
> Opérateurs de comparaison disponibles :
> - Strict : \`>\`, \`<\`
> - Large : \`>=\`, \`<=\`
> - Égalité / Inégalité : \`=\`, \`<>\` (ou \`!=\`)

> 📌 **Ordre d'exécution SQL :**
> Le moteur exécute \`FROM nom_table\` d'abord, puis applique immédiatement le filtre \`WHERE\`. Si un index B-Tree existe sur la colonne filtrée, le moteur effectue une recherche logarithmique $\\mathcal{O}(\\log N)$ plutôt qu'un balayage complet de la table (*Full Table Scan*).
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
### Filtrage Catégoriel et Chaînes de Caractères

> 💡 **Rappel : La syntaxe des littéraux en SQL ANSI**
> 
> En norme SQL, les chaînes de caractères (types \`TEXT\` ou \`VARCHAR\`) s'encadrent impérativement de **guillemets simples** :
> \`\`\`sql
> WHERE region = 'IDF'
> \`\`\`
> - Les guillemets doubles \`"..."\` sont réservés aux identifiants (noms de tables ou colonnes comportant des espaces ou caractères spéciaux).
> - Les valeurs textuelles sont sensibles ou insensibles à la casse selon le paramètre de collation de la colonne (\`COLLATE NOCASE\` en SQLite).

> 📊 **Sens Actuariel :**
> La sélection par région (\`IDF\`, \`PACA\`, etc.) constitue la première étape de l'analyse de sinistralité géographique (*zonier tarifaire*).
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
### Combinaisons Logiques (AND / OR) & Priorité

> 💡 **Rappel théorique : Priorité des opérateurs booléens**
> 
> En logique mathématique et en SQL, l'opérateur de conjonction \`AND\` a une **priorité supérieure** à la disjonction \`OR\` :
> $$A \\lor B \\land C \\iff A \\lor (B \\land C)$$
> - Pour forcer l'évaluation d'un \`OR\` avant un \`AND\`, le parenthésage est **strictement obligatoire** : \`(A OR B) AND C\`.
> - Pour cibler des conducteurs seniors au profil favorable :
> \`\`\`sql
> WHERE age > 50 AND bonus_malus <= 0.50;
> \`\`\`

> ⚠️ **Piège fréquent :**
> Sans parenthèses, une requête combinant \`OR\` et \`AND\` peut sélectionner des lignes inattendues et fausser les calculs de ratios de sinistres.
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
### Filtrage d'Ensemble avec IN (...)

> 💡 **Rappel : Simplification des disjonctions d'égalité**
> 
> Le prédicat \`IN (valeur1, valeur2, ...)\` teste l'appartenance à un ensemble discret fini :
> \`\`\`sql
> WHERE type_vehicule IN ('SUV', 'Sportive');
> \`\`\`
> C'est l'équivalent optimisé et beaucoup plus lisible de :
> \`\`\`sql
> WHERE type_vehicule = 'SUV' OR type_vehicule = 'Sportive';
> \`\`\`

> 📊 **Sens Métier :**
> Permet de regrouper des segments de véhicules présentant des distributions de risques comparables (*véhicules puissants ou à coût de réparation élevé*).
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
### Recherche de Motifs avec LIKE & Wildcards

> 💡 **Rappel : Les méta-caractères (jokers) SQL**
> 
> L'opérateur \`LIKE\` effectue un filtrage par expression de motif sur les colonnes textuelles :
> - \`%\` (pourcentage) : correspond à **0, 1 ou plusieurs caractères quelconques**.
> - \`_\` (underscore) : correspond à **exactement 1 caractère**.
> 
> Exemples classiques :
> - \`type_contrat LIKE 'Tous%'\` : commence par "Tous" (ex : 'Tous Risques').
> - \`type_contrat LIKE '%Risques'\` : se termine par "Risques".
> - \`type_contrat LIKE '%Étendu%'\` : contient "Étendu" à n'importe quelle position.
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
### Filtrage d'Intervalles avec BETWEEN ... AND ...

> 💡 **Rappel : Inclusivité des bornes en SQL**
> 
> L'opérateur \`BETWEEN min AND max\` teste l'appartenance à un intervalle fermé :
> $$x \\in [a, b] \\iff a \\le x \\le b$$
> Les deux bornes sont **inclusives** :
> \`\`\`sql
> WHERE age BETWEEN 25 AND 35;
> -- Équivalent strict à :
> WHERE age >= 25 AND age <= 35;
> \`\`\`

> ⚠️ **Attention à l'ordre des bornes :**
> La borne inférieure doit toujours précéder la borne supérieure (\`BETWEEN 25 AND 35\` et non \`BETWEEN 35 AND 25\`, sinon le prédicat est toujours faux).
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
### Ordonnancement des Résultats avec ORDER BY

> 💡 **Rappel : Absence d'ordre intrinsèque en modèle relationnel**
> 
> Par définition du modèle relationnel d'Edgar F. Codd, une table SQL est un **ensemble mathématique non ordonné** de tuples.
> - Sans clause \`ORDER BY\`, l'ordre de restitution des lignes est indéterminé et peut varier d'une exécution à l'autre selon le plan de requête.
> - Pour garantir un tri reproductible :
>   - \`ASC\` : ordre croissant (valeur par défaut si omis).
>   - \`DESC\` : ordre décroissant (du plus grand au plus petit).

> 📊 **Sens Métier :**
> Identifier rapidement les contrats les plus contributeurs au chiffre d'affaires (\`ORDER BY prime_annuelle DESC\`).
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
### Restriction du Volume avec LIMIT

> 💡 **Rappel : Pagination et Top-N Queries**
> 
> La clause \`LIMIT k\` restreint la sortie aux $k$ premières lignes générées par la requête :
> \`\`\`sql
> SELECT ... FROM ... ORDER BY ... LIMIT 5;
> \`\`\`

> ⚠️ **Règle fondamentale :**
> Un \`LIMIT\` sans \`ORDER BY\` n'a pas de sens déterministe ! Pour obtenir les "5 polices les plus chères", il est impératif d'ordonner d'abord par prime décroissante (\`ORDER BY prime_annuelle DESC\`) avant d'appliquer \`LIMIT 5\`.
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
### Dédoublonnage d'Attributs avec DISTINCT

> 💡 **Rappel : Suppression des doublons de projection**
> 
> La clause \`DISTINCT\` élimine les doublons du jeu de résultat pour ne conserver qu'une seule occurrence de chaque combinaison de valeurs :
> \`\`\`sql
> SELECT DISTINCT region FROM assures;
> \`\`\`
> - Si \`assures\` contient 100 lignes mais seulement 4 régions distinctes, la requête retournera exactement 4 lignes.
> - Coût algorithmique : le moteur effectue un tri interne ou une table de hachage temporaire $\\mathcal{O}(N \\log N)$.
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
### Fonctions d'Agrégation Scalaires : COUNT & SUM

> 💡 **Rappel : Réduction scalaire d'un ensemble**
> 
> Les fonctions d'agrégation réduisent $N$ lignes en une valeur synthétique unique :
> - \`COUNT(*)\` : compte le nombre total de lignes (y compris celles contenant des valeurs \`NULL\`).
> - \`COUNT(colonne)\` : compte uniquement les lignes où \`colonne\` est non-nulle (\`IS NOT NULL\`).
> - \`SUM(colonne)\` : calcule la somme arithmétique $\\sum_{i=1}^N x_i$.

> 📊 **Sens Actuariel :**
> \`COUNT(*)\` mesure la taille du portefeuille (exposition totale $N$) et \`SUM(prime_annuelle)\` correspond à la **prime totale encaissée** (chiffre d'affaires brut).
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
### Extrêmes de Distribution : MIN & MAX

> 💡 **Rappel : Les bornes du support empirique**
> 
> - \`MIN(colonne)\` : extrait la valeur minimale observée $\\min_{i} x_i$.
> - \`MAX(colonne)\` : extrait la valeur maximale observée $\\max_{i} x_i$.
> 
> Exemple d'utilisation conjointe :
> \`\`\`sql
> SELECT MIN(prime_annuelle) AS prime_min, MAX(prime_annuelle) AS prime_max
> FROM assures;
> \`\`\`

> 📊 **Sens Actuariel :**
> Permet de vérifier l'étendue de la tarification $[\\text{prime\\_min}, \\text{prime\\_max}]$ et de détecter d'éventuelles aberrations de souscription (*outliers* ou erreurs de saisie).
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
### Clause GROUP BY & Agrégations Partitionnées

> 💡 **Rappel théorique : L'opérateur de groupement**
> 
> En SQL relationnel, la clause \`GROUP BY\` partitionne les $N$ lignes d'une table en $K$ sous-groupes disjoints selon les valeurs uniques d'une ou plusieurs colonnes (ici la région \`region\`).
> Une fois les groupes formés, les fonctions d'agrégation (\`COUNT\`, \`SUM\`, \`AVG\`, etc.) s'appliquent indépendamment sur chaque sous-groupe pour ne renvoyer **qu'une seule ligne par modalité**.

#### Ordre d'Exécution Logique du Moteur SQL :
1. \`FROM\` : Charge la table source (\`assures\`).
2. \`WHERE\` : Filtre les lignes individuelles *avant* le groupement (optionnel).
3. \`GROUP BY\` : Partitionne les lignes par modalité de \`region\`.
4. \`HAVING\` : Filtre les groupes formés *après* l'agrégation (optionnel).
5. \`SELECT\` : Calcule les agrégats (\`COUNT(*)\`) et projette le résultat.
6. \`ORDER BY\` : Trie le résultat final.

> ⚠️ **Règle d'or impérative :**
> Toute colonne présente dans le \`SELECT\` qui n'est **pas** enveloppée dans une fonction d'agrégation (comme \`COUNT(*)\`) **DOIT impérativement figurer dans la clause GROUP BY**.
> Exemple : \`SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region;\`

> 📊 **Contexte Métier & Actuariat :**
> En tarification automobile, le \`GROUP BY region\` permet de construire le **zonier tarifaire** en mesurant l'exposition géographique (densité de contrats en Île-de-France vs province).
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
### Groupement et Moyenne : AVG() & ROUND()

> 💡 **Rappel : Espérance Conditionnelle en Base de Données**
> 
> La fonction \`AVG(colonne)\` calcule l'espérance conditionnelle empirique pour chaque groupe :
> $$\\mathbb{E}[\\text{prime} \\mid \\text{type\\_vehicule} = v] = \\frac{1}{n_v} \\sum_{i \\in v} \\text{prime}_i$$
> La fonction \`ROUND(valeur, 2)\` arrondit le résultat à deux décimales pour respecter le format monétaire en centimes.

#### 📌 Syntaxe standard :
\`\`\`sql
SELECT type_vehicule, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne
FROM assures
GROUP BY type_vehicule;
\`\`\`

> 📊 **Sens Actuariel :**
> Permet de vérifier la cohérence de la segmentation tarifaire : une catégorie 'Sportive' ou 'SUV' doit afficher une prime moyenne plus élevée qu'une 'Citadine' en raison de la sévérité accrue des dommages en cas de choc.
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
### Filtrage Post-Agrégation avec HAVING

> 💡 **Rappel fondamental : Règle WHERE vs HAVING**
> 
> - **\`WHERE\`** : Filtre les **lignes individuelles** du tableau *avant* que le groupement ne soit effectué. Il ne peut jamais contenir de fonction d'agrégation (il est interdit d'écrire \`WHERE COUNT(*) >= 2\`).
> - **\`HAVING\`** : Filtre les **groupes agrégés** *après* l'évaluation du \`GROUP BY\`. C'est le seul endroit où tester des conditions sur \`COUNT(*)\`, \`SUM(...)\`, \`AVG(...)\`.

#### 📌 Schéma mnémotechnique :
$$\\text{Lignes brutes} \\xrightarrow{\\text{WHERE}} \\text{Lignes filtrées} \\xrightarrow{\\text{GROUP BY}} \\text{Groupes} \\xrightarrow{\\text{HAVING}} \\text{Groupes retenus}$$

> ⚠️ **Piège fréquent :**
> N'utilisez pas \`HAVING\` pour filtrer des attributs de lignes individuelles si un \`WHERE\` peut le faire, car \`WHERE\` réduit le volume de données en amont et soulage le processeur.
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
### Conditionnement Logique avec CASE WHEN

> 💡 **Rappel : La structure if/then/else en SQL**
> 
> L'expression \`CASE WHEN\` permet d'évaluer des conditions ligne par ligne pour créer des indicateurs catégoriels :
> \`\`\`sql
> CASE 
>     WHEN prime_annuelle > 1000 THEN 'Élevée'
>     ELSE 'Standard'
> END AS categorie_prime
> \`\`\`

> 📊 **Sens Métier :**
> Discrétiser une variable continue (la prime en euros) en classes de risque homogènes (*classes tarifaires pour reporting de souscription*).
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
### Nettoyage et Imputation avec COALESCE()

> 💡 **Rappel : La logique ternaire et le piège du NULL**
> 
> En SQL, toute opération arithmétique avec une valeur \`NULL\` produit irrévocablement \`NULL\` :
> $$1500 + \\text{NULL} = \\text{NULL}$$
> La fonction \`COALESCE(valeur, remplacement)\` renvoie le premier argument non nul de sa liste.
> \`\`\`sql
> COALESCE(cout_corporel, 0.0) AS corporel_impute
> \`\`\`
> Si un sinistre n'a causé aucun dommage corporel (\`NULL\`), il est imputé proprement à \`0.0\`.

> ⚠️ **Règle pratique :**
> Toujours utiliser \`COALESCE\` sur les montants de sinistres avant d'effectuer des additions ou des jointures externes.
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
### Jointure Interne (INNER JOIN)

> 💡 **Rappel relationnel : L'intersection par clé**
> 
> La jointure interne combine deux tables sur la base d'une clé de correspondance :
> $$R = \\text{assures} \\bowtie_{\\text{police\\_id}} \\text{sinistres}$$
> Seules les lignes dont la clé \`police_id\` existe **à la fois** dans \`assures\` et dans \`sinistres\` sont conservées.
> - Les assurés sans aucun sinistre sont **exclus**.
> - Un assuré ayant déclaré 3 sinistres apparaîtra **3 fois** dans le résultat.

> 📌 **Syntaxe avec alias de tables :**
> \`\`\`sql
> SELECT a.police_id, a.type_vehicule, s.cout_total
> FROM assures a
> INNER JOIN sinistres s ON a.police_id = s.police_id;
> \`\`\`
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
### Préservation de l'Exposition avec LEFT JOIN

> 💡 **Rappel fondamental : Pourquoi le LEFT JOIN est vital en actuariat**
> 
> Le \`LEFT JOIN\` (jointure externe gauche) conserve **l'intégralité** des lignes de la table de gauche (\`assures\`), qu'il y ait ou non une correspondance dans la table de droite (\`sinistres\`).
> Les colonnes de la table de droite sont alors peuplées avec des valeurs \`NULL\` pour les contrats sans sinistre.

> 📊 **Sens Actuariel & Économétrique :**
> En actuariat, le dénominateur de la sinistralité est l'**exposition totale** (l'ensemble des polices souscrites, y compris celles sans sinistre). Utiliser un \`INNER JOIN\` éliminerait tous les conducteurs vertueux sans sinistre, provoquant un **biais de sélection dramatique** qui surestimerait le risque moyen.
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
### Jointures Multiples & Relations Chaînées

> 💡 **Rappel : Composition de relations relationnelles**
> 
> En base de données, les jointures peuvent se chaîner pour relier des entités distantes :
> \`\`\`sql
> FROM table_A a
> LEFT JOIN table_B b ON a.id = b.a_id
> LEFT JOIN table_C c ON a.id_autre = c.id
> \`\`\`

> ⚠️ **Attention aux doublons de jointure (Fan-out) :**
> Si une table de droite comporte plusieurs enregistrements pour une même clé, les lignes de la table de gauche seront dupliquées. Pensez à vérifier vos volumes avec \`COUNT(DISTINCT a.police_id)\`.
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
### Sous-Requêtes Scalaires dans le WHERE

> 💡 **Rappel : La sous-requête comme constante dynamique**
> 
> Une sous-requête scalaire retourne exactement **une ligne et une colonne** (une valeur atomique unique). Elle peut s'utiliser comme un opérande de comparaison dans un \`WHERE\` :
> \`\`\`sql
> SELECT police_id, prime_annuelle
> FROM assures
> WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures);
> \`\`\`

> 📌 **Exécution :**
> Le moteur évalue d'abord la sous-requête interne \`(SELECT AVG...)\` qui produit par exemple \`920.50 €\`, puis exécute la requête principale en filtrant \`WHERE prime_annuelle > 920.50\`.
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
### Tables Dérivées (Sous-Requêtes dans le FROM)

> 💡 **Rappel : Transformer une requête en table temporaire en mémoire**
> 
> Une requête SQL peut servir de source de données pour une autre requête en la plaçant dans la clause \`FROM\` :
> \`\`\`sql
> SELECT sub.region, sub.nb
> FROM (
>     SELECT region, COUNT(*) AS nb 
>     FROM assures 
>     GROUP BY region
> ) sub;
> \`\`\`
> - **Règle ANSI impérative** : Toute sous-requête dans un \`FROM\` doit obligatoirement avoir un alias (ici \`sub\`).
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
### Common Table Expressions (WITH / CTE)

> 💡 **Rappel : Les CTE pour un code SQL lisible et modulaire**
> 
> La clause \`WITH\` définit une table temporaire nommée (*Common Table Expression*) en préambule de la requête :
> \`\`\`sql
> WITH stats_region AS (
>     SELECT region, COUNT(*) AS nb_polices
>     FROM assures
>     GROUP BY region
> )
> SELECT * FROM stats_region WHERE nb_polices >= 2;
> \`\`\`
> Avantages majeurs : lisibilité exceptionnelle, maintenance aisée et réutilisation de la table temporaire dans plusieurs jointures.
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
### Ratio Sinistres / Primes (S/P ou Loss Ratio)

> 💡 **Rappel théorique : La métrique reine de l'actuariat non-vie**
> 
> Le Ratio Sinistres sur Primes ($S/P$) mesure la rentabilité technique pure d'un portefeuille d'assurance :
> $$\\text{Ratio S/P} = \\frac{\\sum \\text{Charge des sinistres}}{\\sum \\text{Primes acquises}} \\times 100$$
> - **$S/P < 100\\%$** : Le portefeuille est bénéficiaire sur le plan technique.
> - **$S/P > 100\\%$** : Le portefeuille est déficitaire (la charge des sinistres dépasse les cotisations perçues).

#### 📌 Formule SQL robuste :
\`\`\`sql
ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp
\`\`\`
Combiné avec \`LEFT JOIN\` (pour conserver les primes des contrats sans sinistre) et \`GROUP BY a.region\`.
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
### Fonctions de Fenêtrage : DENSE_RANK() OVER

> 💡 **Rappel : Agrégation vs Fenêtrage (Window Functions)**
> 
> Contrairement à \`GROUP BY\` qui compresse plusieurs lignes en une seule, une **Window Function** calcule une valeur sur une fenêtre de lignes tout en **préservant chaque ligne individuelle** :
> 
> Comparaison des fonctions de classement :
> - \`ROW_NUMBER()\` : Attribue un numéro de ligne strictement continu ($1, 2, 3, 4$).
> - \`RANK()\` : Attribue le même rang en cas d'ex-aequo, mais crée des sauts ($1, 2, 2, 4$).
> - \`DENSE_RANK()\` : Attribue le même rang en cas d'ex-aequo **sans créer de trous** ($1, 2, 2, 3$).

#### 📌 Syntaxe :
\`\`\`sql
DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout
\`\`\`
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
### Exploration d'un Panel de Séries Temporelles (.head)

> 💡 **Rappel méthodologique : Inspection préalable obligatoire**
> 
> Avant d'estimer un modèle économétrique ou de calculer des matrices de covariance, il est indispensable de vérifier la structure des données d'entrée :
> - Typage des variables (séries continues, taux, dates trimestrielles).
> - Absence de valeurs aberrantes ou manquantes.
> 
> En Pandas, \`df.head(n)\` extrait vectoriellement les $n$ premières lignes sans saturer la mémoire d'affichage.
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
### Dimensions et Degrés de Liberté (.shape)

> 💡 **Rappel économétrique : La contrainte des degrés de liberté**
> 
> Soit un échantillon de taille $T$ avec $K$ variables explicatives. Pour pouvoir estimer les paramètres par MCO et procéder à des tests statistiques valides (test de Student, test de Fisher), il faut impérativement :
> $$\\text{Degrés de liberté} = T - K - 1 > 0$$
> Si $T \\le K + 1$, le modèle est sous-déterminé et la matrice $(X'X)$ n'est pas inversible.
> 
> \`df.shape\` retourne le tuple \`(T_lignes, K_colonnes)\`.
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
### Moments d'Ordre 1 et 2 (.mean, .std)

> 💡 **Rappel théorique : Correction de Bessel pour la variance**
> 
> - **Moyenne empirique (Espérance)** :
>   $$\\bar{y} = \\frac{1}{T} \\sum_{t=1}^T y_t$$
> - **Variance sans biais et Écart-type** :
>   $$s^2 = \\frac{1}{T - 1} \\sum_{t=1}^T (y_t - \\bar{y})^2, \\quad s = \\sqrt{s^2}$$
> 
> Le diviseur $T - 1$ (au lieu de $T$) est la **correction de Bessel** : elle compense le fait que la moyenne empirique $\\bar{y}$ est elle-même estimée à partir de l'échantillon, garantissant que $E[s^2] = \\sigma^2$.
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
### Quantiles Empiriques et Événements Rares (.quantile)

> 💡 **Rappel : Mesure non-paramétrique du risque**
> 
> Le quantile empirique d'ordre $\\alpha \\in [0, 1]$ représente la valeur en deçà de laquelle se situe une proportion $\\alpha$ des observations :
> $$P(X \\le q_\\alpha) = \\alpha$$
> - $\\alpha = 0.50$ : Médiane (robuste aux valeurs extrêmes).
> - $\\alpha = 0.95$ : Seuil de surchauffe (dépassé seulement 5 % du temps).
> En gestion des risques, c'est le fondement du calcul de la **Value-at-Risk (VaR) historique**.
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
### Pente de la Courbe des Taux (Term Spread)

> 💡 **Rappel financier & macroéconomique : La structure par terme des taux**
> 
> En gestion actif-passif (ALM) et macroéconomie, la pente de la courbe des taux mesure le différentiel entre le rendement d'un actif long terme sans risque (OAT 10 ans) et le loyer de l'argent au jour le jour (Euribor 3 mois) :
> $$\\text{Pente}_t = r_{\\text{OAT\\_10Y}, t} - r_{\\text{Euribor\\_3M}, t}$$
> - **Pente normale ($> 0$)** : Les taux longs intègrent une prime de terme positive.
> - **Pente inversée ($< 0$)** : Anticipe historiquement un ralentissement économique ou une récession sous 12 à 18 mois.
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
### Taux de Variation et Rendements (.pct_change)

> 💡 **Rappel : Rendements arithmétiques vs logarithmiques**
> 
> Le taux de variation d'une série financière $P_t$ s'obtient par :
> $$R_t = \\frac{P_t - P_{t-1}}{P_{t-1}} = \\frac{P_t}{P_{t-1}} - 1$$
> La méthode \`.pct_change()\` de Pandas calcule cette variation d'une période à l'autre.
> - La première observation de la série résultante est toujours \`NaN\` (car il n'y a pas de période précédente $t-1$).
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
### Matrice de Corrélation Linéaire de Pearson

> 💡 **Rappel théorique : Le coefficient de Pearson**
> 
> Pour deux séries temporelles $X$ et $Y$, le coefficient de corrélation linéaire est normalisé entre -1 et 1 :
> $$\\rho_{X, Y} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y} \\in [-1, 1]$$
> - $\\rho = 1$ : Corrélation linéaire positive parfaite.
> - $\\rho = 0$ : Absence de relation linéaire (mais attention, il peut exister une relation non-linéaire !).
> - $\\rho = -1$ : Corrélation linéaire inverse parfaite.

> ⚠️ **Piège fondamental : Corrélation $\\ne$ Causalité !**
> En séries temporelles, deux séries non-stationnaires peuvent afficher un $\\rho > 0.90$ simplement parce qu'elles croissent toutes les deux dans le temps (*régression fallacieuse*).
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
### Analyse Graphique Bivariée (Scatter Plot)

> 💡 **Rappel économétrique : Pourquoi le graphique précède la régression**
> 
> Un coefficient de corrélation ou une régression MCO ne doit jamais être calculé à l'aveugle :
> - Détection visuelle de points aberrants (*outliers* ou points leviers) qui fausseraient la droite de régression.
> - Vérification de la linéarité de la relation (forme en cloche, seuils, saturation).
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
### Modèle de Régression Simple par les MCO (OLS)

> 💡 **Rappel théorique : Le principe des Moindres Carrés Ordinaires**
> 
> On modélise la variable expliquée $y$ en fonction de la variable explicative $x$ :
> $$y_t = \\beta_0 + \\beta_1 x_t + \\varepsilon_t$$
> L'estimateur MCO choisit $\\hat{\\beta}_0$ et $\\hat{\\beta}_1$ de manière à minimiser la somme des carrés des erreurs résiduelles (SCR) :
> $$\\min_{\\hat{\\beta}_0, \\hat{\\beta}_1} \\sum_{t=1}^T (y_t - \\hat{\\beta}_0 - \\hat{\\beta}_1 x_t)^2$$
> 
> Solutions analytiques :
> $$\\hat{\\beta}_1 = \\frac{\\sum (x_t - \\bar{x})(y_t - \\bar{y})}{\\sum (x_t - \\bar{x})^2} = \\frac{\\operatorname{Cov}(x, y)}{\\operatorname{Var}(x)}, \\quad \\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$$

> 📌 **Propriété BLUE (Théorème de Gauss-Markov) :**
> Sous les hypothèses classiques (erreurs centrées, homoscédastiques et non-autocorrélées), les MCO sont les Meilleurs Estimateurs Linéaires Sans Biais.
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
### Interprétation Économique du Coefficient Bêta

> 💡 **Rappel : Sensibilité marginale et dérivation**
> 
> Dans un modèle linéaire, la pente $\\hat{\\beta}_1$ mesure la sensibilité marginale directe :
> $$\\hat{\\beta}_1 = \\frac{\\partial y}{\\partial x}$$
> Une variation de $+1$ unité de la variable explicative $x$ entraîne une variation moyenne attendue de $\\hat{\\beta}_1$ unités de $y$, toutes choses égales par ailleurs (*ceteris paribus*).
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
### Coefficient de Détermination R² et Qualité d'Ajustement

> 💡 **Rappel théorique : La décomposition de variance (ANOVA)**
> 
> La dispersion totale des observations se décompose selon l'identité fondamentale :
> $$\\text{SCT} = \\text{SCE} + \\text{SCR}$$
> - $\\text{SCT} = \\sum (y_t - \\bar{y})^2$ : Somme des Carrés Totale (variabilité globale).
> - $\\text{SCE} = \\sum (\\hat{y}_t - \\bar{y})^2$ : Somme des Carrés Expliquée par le modèle.
> - $\\text{SCR} = \\sum e_t^2$ : Somme des Carrés des Résidus (erreurs non expliquées).
> 
> Le coefficient de détermination $R^2$ est la part de variance expliquée :
> $$R^2 = \\frac{\\text{SCE}}{\\text{SCT}} = 1 - \\frac{\\text{SCR}}{\\text{SCT}} \\in [0, 1]$$
> Dans une régression simple, $R^2 = r_{x,y}^2$ (le carré du coefficient de Pearson).
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
### Régression Multiple & Effet Ceteris Paribus

> 💡 **Rappel : Formulation Matricielle des MCO**
> 
> Pour plusieurs variables explicatives $X_1, X_2, \\dots, X_K$ :
> $$y = X \\beta + \\varepsilon$$
> L'estimateur matriciel s'écrit de manière compacte :
> $$\\hat{\\beta} = (X'X)^{-1} X' y$$
> Chaque coefficient partiel $\\beta_j$ capture l'impact spécifique de la variable $X_j$ **après avoir neutralisé l'effet de toutes les autres variables explicatives** du modèle.
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
### Diagnostic des Résidus et Orthogonalité

> 💡 **Rappel : Perturbations théoriques vs Résidus empiriques**
> 
> - $\\varepsilon_t$ : Perturbation théorique inobservable.
> - $e_t = y_t - \\hat{y}_t$ : Résidu estimé observable.
> 
> Par construction mathématique des MCO (équations normales) :
> $$\\sum_{t=1}^T e_t = 0 \\implies \\bar{e} = 0, \\quad X'e = 0$$
> Les résidus sont obligatoirement orthogonaux aux variables explicatives.
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
### Test de Normalité des Résidus de Jarque-Bera

> 💡 **Rappel théorique : Asymétrie (Skewness) et Aplatissement (Kurtosis)**
> 
> Pour que les tests $t$ de Student et $F$ de Fisher soient exacts en petits échantillons, les erreurs doivent suivre une loi normale $\\varepsilon \\sim \\mathcal{N}(0, \\sigma^2)$ :
> - **Skewness (Asymétrie)** : $S = 0$ pour une loi normale.
> - **Kurtosis (Aplatissement)** : $K = 3$ pour une loi normale.
> 
> La statistique de Jarque-Bera teste la normalité conjointe :
> $$JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\sim \\chi^2(2)$$
> Si la **p-valeur $< 0.05$**, on rejette l'hypothèse de normalité des résidus.
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
### Diagnostic d'Hétéroscédasticité (White / Breusch-Pagan)

> 💡 **Rappel : L'hypothèse d'homoscédasticité**
> 
> L'homoscédasticité impose que la variance des perturbations soit constante au cours du temps :
> $$\\operatorname{Var}(\\varepsilon_t) = \\sigma^2 = \\text{Constante} \\quad (\\forall t)$$
> Si la variance dépend du niveau des variables ou du temps, il y a **hétéroscédasticité**.
> - Conséquence : Les coefficients MCO restent sans biais mais **ne sont plus efficaces** et les écarts-types sont faux.
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
### Autocorrélation des Résidus : Test de Durbin-Watson

> 💡 **Rappel théorique : L'indépendance temporelle des erreurs**
> 
> L'hypothèse MCO exige l'absence d'autocorrélation :
> $$\\operatorname{Cov}(\\varepsilon_t, \\varepsilon_{t-1}) = 0$$
> La statistique de Durbin-Watson teste une autocorrélation d'ordre 1 :
> $$DW = \\frac{\\sum_{t=2}^T (e_t - e_{t-1})^2}{\\sum_{t=1}^T e_t^2} \\approx 2(1 - \\hat{\\rho})$$
> où $\\hat{\\rho}$ est le coefficient d'autocorrélation des résidus.
> - **$DW \\approx 2$** : Absence d'autocorrélation ($\\hat{\\rho} = 0$). Tout va bien !
> - **$DW < 1.5$** : Forte autocorrélation positive (fréquent en séries temporelles non stationnarisées).
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
### Correction d'Hétéroscédasticité et d'Autocorrélation (HAC / Newey-West)

> 💡 **Rappel : La matrice de covariance robuste**
> 
> Lorsque les résidus sont à la fois hétéroscédastiques et autocorrélés, on corrige la matrice de variance-covariance des estimateurs via l'estimateur de **Newey-West (HAC)** :
> $$\\operatorname{Var}_{\\text{HAC}}(\\hat{\\beta}) = (X'X)^{-1} \\hat{\\Omega} (X'X)^{-1}$$
> Cette correction ajuste les écarts-types des coefficients sans modifier les estimations ponctuelles $\\hat{\\beta}$, garantissant des p-valeurs fiables.
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
### Test de Stationnarité : Augmented Dickey-Fuller (ADF)

> 💡 **Rappel fondamental : Qu'est-ce qu'une série stationnaire ?**
> 
> Une série $y_t$ est stationnaire au second ordre si :
> 1. Son espérance est constante : $E[y_t] = \\mu$
> 2. Sa variance est constante et finie : $\\operatorname{Var}(y_t) = \\sigma^2$
> 3. Ses autocovariances ne dépendent que du décalage $h$ : $\\operatorname{Cov}(y_t, y_{t-h}) = \\gamma(h)$
> 
> **Hypothèses du test ADF :**
> - **$H_0$** : Présence d'une racine unitaire $\\implies$ la série est **non-stationnaire**.
> - **$H_1$** : Pas de racine unitaire $\\implies$ la série est **stationnaire**.
> 
> Règle de décision : Si la **p-valeur $< 0.05$**, on rejette $H_0$ au seuil de 5 %.
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
### Différenciation Première et Stationnarisation ($\\Delta y_t$)

> 💡 **Rappel : L'opérateur de différence première**
> 
> Si une série $y_t$ est intégrée d'ordre 1 ($I(1)$), sa différence première est stationnaire ($I(0)$) :
> $$\\Delta y_t = y_t - y_{t-1} = (1 - L) y_t$$
> où $L$ est l'opérateur retard (*Lag operator* : $L y_t = y_{t-1}$).
> En Pandas : \`df['colonne'].diff()\` calcule cette différence première.
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
### Autocorrélations Simple et Partielle (ACF & PACF)

> 💡 **Rappel théorique : La méthodologie de Box-Jenkins**
> 
> - **ACF (Autocorrelation Function)** : Mesure la corrélation globale entre $y_t$ et $y_{t-k}$.
> - **PACF (Partial Autocorrelation Function)** : Mesure la corrélation nette entre $y_t$ et $y_{t-k}$ en éliminant l'influence des retards intermédiaires $1, 2, \\dots, k-1$.
> 
> Règle de diagnostic pour les processus autorégressifs $AR(p)$ :
> La PACF se coupe brutalement après le retard $p$, tandis que l'ACF décroît exponentiellement.
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
### Processus Autorégressif d'Ordre 1 : AR(1)

> 💡 **Rappel mathématique : L'équation AR(1)**
> 
> Le modèle AR(1) exprime la valeur courante comme une fonction linéaire de la valeur passée et d'un bruit blanc :
> $$y_t = c + \\phi y_{t-1} + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\text{WN}(0, \\sigma^2)$$
> 
> Condition de stationnarité stricte :
> $$|\\phi| < 1$$
> Si $\\phi = 1$, la série est une **marche aléatoire** (non-stationnaire).
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
### Sélection de Modèles : Critères d'Information AIC & BIC

> 💡 **Rappel : Le compromis vraisemblance vs parcimonie**
> 
> Ajouter des paramètres améliore mécaniquement la vraisemblance mais augmente le risque de surapprentissage (*overfitting*). Les critères d'information pénalisent le nombre de paramètres $k$ :
> - **AIC (Akaike)** : $\\text{AIC} = 2k - 2\\ln(L)$
> - **BIC (Schwarz / Bayesien)** : $\\text{BIC} = k \\ln(T) - 2\\ln(L)$
> 
> Règle d'or : **Le meilleur modèle est celui qui minimise le critère (AIC ou BIC le plus faible).** Le BIC pénalise plus sévèrement les modèles complexes.
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
### Prévision Hors-Échantillon et Erreur de Prédiction

> 💡 **Rappel : L'espérance conditionnelle future**
> 
> La prévision à horizon 1 ($h=1$) d'un modèle AR(1) conditionnellement à l'information disponible à l'instant $T$ est :
> $$\\hat{y}_{T+1 \\mid T} = E[y_{T+1} \\mid \\mathcal{F}_T] = \\hat{c} + \\hat{\\phi} y_T$$
> L'erreur de prévision est $e_{T+1} = y_{T+1} - \\hat{y}_{T+1 \\mid T}$.
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
### Volatilité Conditionnelle et Hétéroscédasticité ARCH/GARCH

> 💡 **Rappel financier : Les faits stylisés des séries de prix**
> 
> Les rendements financiers présentent des **grappes de volatilité** (*volatility clustering* : de fortes variations sont généralement suivies de fortes variations).
> Dans un modèle ARCH(1) de Robert Engle (Prix Nobel 2003) :
> $$\\sigma_t^2 = \\omega + \\alpha_1 \\varepsilon_{t-1}^2$$
> La variance conditionnelle dépend de la magnitude du choc de la veille au carré $\\varepsilon_{t-1}^2$.
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
### Gestion des Risques : Value-at-Risk (VaR) Paramétrique

> 💡 **Rappel théorique : Définition de la Value-at-Risk**
> 
> La Value-at-Risk au seuil $\\alpha$ (ex : 5 %) représente la perte maximale tolérée avec une probabilité de $1 - \\alpha$ (95 %) sur un horizon donné :
> $$P(\\text{Perte} > \\text{VaR}_\\alpha) = \\alpha \\iff P(R_t < -\\text{VaR}_\\alpha) = \\alpha$$
> 
> Sous l'hypothèse de normalité $R_t \\sim \\mathcal{N}(\\mu, \\sigma^2)$ :
> $$\\text{VaR}_\\alpha = -(\\mu + z_\\alpha \\sigma)$$
> où $z_{0.05} = -1.645$ (pour un niveau de confiance de 95 %) et $z_{0.01} = -2.326$ (pour 99 %).
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
### Stress-Testing Macro-Financier et Résilience de Bilan

> 💡 **Rappel réglementaire : Cadres Bâle III & Solvabilité II**
> 
> Le stress-testing quantifie la résilience du bilan d'une banque ou d'une compagnie d'assurance face à des scénarios de crise extrême mais plausibles :
> - Choc de taux d'intérêt : $\\Delta r = +200$ points de base.
> - Choc boursier : baisse de $-30 \\%$ des actions.
> - Choc de sinistralité : survenance conjointe d'événements climatiques majeurs.
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
