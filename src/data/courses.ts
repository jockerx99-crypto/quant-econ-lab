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

![Mécanisme GROUP BY & Agrégation](/images/theory/fig_v1_sql_groupby.png)

> 🔍 **Comprendre ce graphique : Le paradigme Split - Apply - Combine**
> 
> - **Les points bleus (lignes brutes)** : Chaque point représente un contrat individuel avec sa prime d'assurance propre.
> - **Le partitionnement (\`GROUP BY\`)** : Le moteur SQL isole les contrats dans des bacs étanches par modalité de région (Nord, Sud, Ouest).
> - **L'agrégation (\`AVG()\`)** : Pour chaque bac, la fonction calcule la moyenne arithmétique et compresse toutes les lignes du groupe en **une seule barre synthétique**.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Table miniature de 4 assurés) :**
> Soit la mini-table suivante :
> - Assuré 1 : Région \`'IDF'\`, Prime $900\\text{ EUR}$
> - Assuré 2 : Région \`'PACA'\`, Prime $650\\text{ EUR}$
> - Assuré 3 : Région \`'IDF'\`, Prime $1\\ 100\\text{ EUR}$
> - Assuré 4 : Région \`'PACA'\`, Prime $750\\text{ EUR}$
>
> 1. **Partitionnement logique (\`GROUP BY region\`)** :
>    - Groupe \`'IDF'\` : $\{900, 1100\}$ ($N = 2$)
>    - Groupe \`'PACA'\` : $\{650, 750\}$ ($N = 2$)
> 2. **Agrégation indépendante (\`COUNT(*)\` et \`AVG(prime)\`)** :
>    - Groupe \`'IDF'\` : Effectif = $2$, Moyenne = $\\frac{900 + 1100}{2} = 1\\ 000\\text{ EUR}$
>    - Groupe \`'PACA'\` : Effectif = $2$, Moyenne = $\\frac{650 + 750}{2} = 700\\text{ EUR}$
> 3. **Projection finale (\`SELECT\`)** : La table résultante ne compte plus que 2 lignes (une ligne unique par modalité).
>
> 💻 **Le Pont vers le SQL :**
> C'est exactement ce que réalise le moteur avec \`SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region;\`.
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

![INNER JOIN vs LEFT JOIN en Actuariat](/images/theory/fig_v1_sql_joins.png)

> 🔍 **Comprendre ce graphique : L'importance vitale du LEFT JOIN en actuariat**
> 
> - **À gauche (INNER JOIN - Le piège)** : Seuls les assurés ayant déclaré un sinistre ont une correspondance dans la table \`sinistres\`. L'INNER JOIN élimine tous les assurés sains (en rouge), ce qui détruit le dénominateur de votre portefeuille et surévalue artificiellement la prime de risque !
> - **À droite (LEFT JOIN - La bonne pratique)** : Tous les assurés de la table de gauche sont intégralement préservés. Les conducteurs sans sinistre reçoivent des valeurs \`NULL\` (faciles à remplacer par \`0 €\` via \`COALESCE\`), garantissant une mesure sans biais de l'exposition globale.
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

![Le Loss Ratio S/P en Assurance](/images/theory/fig_v1_loss_ratio.png)

> 🔍 **Comprendre ce graphique : L'indicateur roi de la rentabilité technique**
> 
> - **La ligne rouge (Seuil 100%)** : Le point d'équilibre où l'intégralité des primes perçues est absorbée par les sinistres indemnisés.
> - **Barres vertes ($S/P < 80\\%$)** : Zone de rentabilité technique saine, permettant de couvrir les frais généraux et de dégager une marge.
> - **Barre rouge ($S/P > 100\\%$)** : Zone de déficit technique caractérisant une **sous-tarification** de la région ou une dérive de la sinistralité climatique.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul du Loss Ratio sur 3 contrats) :**
> Prenons 3 contrats de la région Occitanie :
> - Contrat 1 : Prime = $500\\text{ EUR}$, 0 sinistre (Coût = $0\\text{ EUR}$)
> - Contrat 2 : Prime = $700\\text{ EUR}$, 1 sinistre bris de glace (Coût = $400\\text{ EUR}$)
> - Contrat 3 : Prime = $800\\text{ EUR}$, 1 sinistre corporel (Coût = $1\\ 200\\text{ EUR}$)
>
> 1. **Somme des primes encaissées ($P$)** :
>    $$P = 500 + 700 + 800 = 2\\ 000\\text{ EUR}$$
> 2. **Somme des sinistres indemnisés ($S$)** :
>    $$S = 0 + 400 + 1\\ 200 = 1\\ 600\\text{ EUR}$$
> 3. **Calcul algébrique du ratio $S/P$** :
>    $$\\text{Ratio } S/P = \\frac{S}{P} = \\frac{1\\ 600}{2\\ 000} = 0.80 = \\mathbf{80.0\\%}$$
>    *(Interprétation : pour 100 € de prime collectée, 80 € repartent en indemnisation).*
>
> 💻 **Le Pont vers le SQL :**
> \`SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100\` calcule exactement ce rapport $S/P$ agrégé par région.
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

![Anatomie du Boxplot et Règle de Tukey](/images/theory/fig_v1_boxplot_tukey.png)

> 🔍 **Comprendre ce graphique : La robustesse de l'écart interquartile (IQR)**
> 
> - **La boîte centrale ($Q_1$ à $Q_3$)** : Contient exactement $50\\%$ des observations centrales du portefeuille.
> - **La barre rouge médiane ($Q_2$)** : La valeur qui sépare la population en deux parts égales (insensible aux valeurs extrêmes).
> - **Les moustaches ($\\pm 1.5 \\times IQR$)** : L'intervalle de dispersion statistique normale établi par John Tukey.
> - **Les points rouges isolés (Outliers)** : Sinistres exceptionnels (grands sinistres corporels ou industriels) à isoler pour éviter de fausser les estimations de prime pure.
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

![Principe Géométrique des Moindres Carrés Ordinaires](/images/theory/fig_v1_ols_residuals.png)

> 🔍 **Comprendre ce graphique : La minimisation des résidus au carré**
> 
> - **Les points noirs** : Observations empiriques $(X_i, Y_i)$ reliant l'âge de l'assuré à sa prime.
> - **La droite bleue ($\\hat{Y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 X$)** : L'unique droite dans l'espace qui minimise la somme des carrés des distances verticales.
> - **Les pointillés rouges ($e_i = Y_i - \\hat{Y}_i$)** : Les résidus ou erreurs d'estimation. L'élévation au carré pénalise plus fortement les grands écarts et garantit que la somme des résidus est exactement nulle ($\\sum e_i = 0$).

> ✏️ **Exemple chiffré & Résolution algébrique pas-à-pas (Toy Example sur 3 points) :**
> Soit 3 observations simples $(x, y)$ où $x$ est le taux directeur et $y$ le taux souverain :
> - Point 1 : $(x_1=1, y_1=2)$
> - Point 2 : $(x_2=2, y_2=3)$
> - Point 3 : $(x_3=3, y_3=5)$
>
> 1. **Moyennes empiriques** :
>    $$\\bar{x} = \\frac{1+2+3}{3} = 2.0, \\quad \\bar{y} = \\frac{2+3+5}{3} = \\frac{10}{3} \\approx 3.333$$
> 2. **Écarts et covariances croisées** :
>    - Point 1 : $(x_1 - \\bar{x}) = -1, \\quad (y_1 - \\bar{y}) = -1.333 \\implies (-1) \\times (-1.333) = +1.333$
>    - Point 2 : $(x_2 - \\bar{x}) = 0, \\quad (y_2 - \\bar{y}) = -0.333 \\implies 0 \\times (-0.333) = 0$
>    - Point 3 : $(x_3 - \\bar{x}) = +1, \\quad (y_3 - \\bar{y}) = +1.667 \\implies 1 \\times 1.667 = +1.667$
>    - Somme des covariances : $\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = 1.333 + 0 + 1.667 = \\mathbf{3.0}$
> 3. **Somme des carrés de $x$ (Variance)** :
>    $$\\sum (x_i - \\bar{x})^2 = (-1)^2 + 0^2 + 1^2 = 1 + 0 + 1 = \\mathbf{2.0}$$
> 4. **Calcul de la pente $\\hat{\\beta}_1$ et de la constante $\\hat{\\beta}_0$** :
>    $$\\hat{\\beta}_1 = \\frac{3.0}{2.0} = \\mathbf{1.50}$$
>    $$\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x} = 3.333 - (1.50 \\times 2.0) = 3.333 - 3.0 = \\mathbf{0.333}$$
>    L'équation optimale de régression est donc : $\\hat{y} = 0.333 + 1.50 x$.
>
> 💻 **Le Pont vers Statsmodels :**
> L'appel \`sm.OLS(y, sm.add_constant(x)).fit()\` résout exactement cette minimisation analytique des moindres carrés.
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
### Test de Significativité Individuelle (Student t-stat)

> 💡 **Rappel théorique : Test de Student sur les coefficients**
> 
> Pour chaque variable explicative, on teste si son impact marginal est significativement différent de zéro :
> - **Hypothèse nulle** : $H_0: \\beta_1 = 0$ (aucun effet sur la variable expliquée).
> - **Hypothèse alternative** : $H_1: \\beta_1 \\neq 0$ (effet statistiquement avéré).
> 
> La statistique de Student s'écrit sous $H_0$ :
> $$t = \\frac{\\hat{\\beta}_1 - 0}{\\hat{\\sigma}_{\\hat{\\beta}_1}} \\sim \\mathcal{T}(T - K - 1)$$
> Au seuil de risque usuel de $\\alpha = 5\\%$ (pour un grand échantillon, approximation normale $\\mathcal{N}(0, 1)$) :
> - Si $|t| \\ge 1.96$ (p-valeur $< 0.05$), on **rejette $H_0$** : le coefficient est statistiquement significatif.
> - Si $|t| < 1.96$ (p-valeur $\\ge 0.05$), on **ne peut pas rejeter $H_0$** : l'effet n'est pas distinguable du bruit.

![Test de Student et Zone de Rejet](/images/theory/fig_v1_student_test.png)

> 🔍 **Comprendre ce graphique : Comment décider si une variable a un impact réel**
> 
> - **La courbe en cloche** : Distribution théorique de la statistique de test sous l'hypothèse nulle $H_0: \\beta_1 = 0$ (aucun effet de la variable).
> - **La zone bleue centrale ($95\\%$)** : Si la statistique calculée $t$ tombe ici, on ne peut pas exclure que la relation observée soit due au pur hasard (p-valeur $> 0.05$).
> - **Les zones rouges extrêmes ($\\pm 1.96$)** : Si $|t| \\ge 1.96$ (p-valeur $< 0.05$), le résultat est statistiquement significatif au seuil de $5\\%$ : on rejette formellement l'absence d'effet.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul du t-stat et Décision) :**
> Soit un coefficient estimé de l'Euribor $\\hat{\\beta}_1 = 1.50$ avec un écart-type estimé $\\hat{\\sigma}_{\\hat{\\beta}_1} = 0.25$ :
>
> 1. **Calcul de la statistique $t$ empirique** :
>    $$t = \\frac{1.50 - 0}{0.25} = \\mathbf{6.0}$$
> 2. **Règle de décision au seuil critique de 5%** :
>    $$|t| = 6.0 > 1.96 \\implies \\text{Zone de rejet critique (rouge)}$$
> 3. **P-valeur associée (probabilité bilatérale)** :
>    $$p = 2 \\times \\mathbb{P}(T > 6.0) \\approx 1.2 \\times 10^{-7} < 0.05$$
>    Conclusion : L'effet de l'Euribor est **hautement significatif**, $H_0$ est rejetée avec une certitude quasi-absolue.
>
> 💻 **Le Pont vers Statsmodels :**
> \`model.tvalues['euribor_3m']\` et \`model.pvalues['euribor_3m']\` calculent automatiquement cette statistique $t$ et sa p-valeur bilatérale.
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
### Coefficient de Détermination R² et Qualité d'Ajustement (ANOVA)

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
> Pour pénaliser l'ajout artificiel de variables inutiles, le $R^2$ ajusté introduit les degrés de liberté ($N$ observations, $K$ régresseurs) :
> $$\\bar{R}^2 = 1 - \\frac{\\text{SCR} / (N - K - 1)}{\\text{SCT} / (N - 1)}$$

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul de $R^2$ et $\\bar{R}^2$) :**
> Soit un échantillon de $N=20$ trimestres avec $K=2$ variables explicatives :
> - Somme des carrés totale : $\\text{SCT} = 100.0$
> - Somme des carrés résiduelle : $\\text{SCR} = 15.0$
>
> 1. **Calcul du $R^2$ brut** :
>    $$R^2 = 1 - \\frac{15.0}{100.0} = 1 - 0.15 = \\mathbf{0.850} \\text{ (85.0% de variance expliquée)}$$
> 2. **Pénalisation des degrés de liberté ($N - K - 1 = 20 - 2 - 1 = 17$ et $N-1 = 19$)** :
>    $$\\frac{\\text{SCR} / 17}{\\text{SCT} / 19} = \\frac{15.0 / 17}{100.0 / 19} = \\frac{0.8824}{5.2632} \\approx 0.1676$$
> 3. **Calcul du $R^2$ ajusté $\\bar{R}^2$** :
>    $$\\bar{R}^2 = 1 - 0.1676 = \\mathbf{0.8324} \\text{ (83.24%)}$$
>    *(Remarquez que $\\bar{R}^2 < R^2$ : la pénalisation évite le sur-apprentissage).*
>
> 💻 **Le Pont vers Statsmodels :**
> \`model.rsquared\` et \`model.rsquared_adj\` extraient instantanément ces deux grandeurs.
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
### Inversion Matricielle & Équations Normales des MCO

> 💡 **Rappel : Perturbations théoriques vs Résidus empiriques**
> 
> - $\\varepsilon_t$ : Perturbation théorique inobservable.
> - $e_t = y_t - \\hat{y}_t$ : Résidu estimé observable.
> 
> Par construction mathématique des MCO (équations normales) :
> $$\\sum_{t=1}^T e_t = 0 \\implies \\bar{e} = 0, \\quad X'e = 0$$
> Les résidus sont obligatoirement orthogonaux aux variables explicatives.

> ✏️ **Exemple chiffré & Résolution matricielle pas-à-pas ($(X^T X)^{-1} X^T Y$) :**
> Reprenons nos 3 points : $(1, 2), (2, 3), (3, 5)$.  
> Matrice $X$ (avec constante unitaire) et vecteur $Y$ :
> $$X = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\end{pmatrix}, \\quad Y = \\begin{pmatrix} 2 \\\\ 3 \\\\ 5 \\end{pmatrix}$$
>
> 1. **Produit $X^T X$ (Matrice de Gram)** :
>    $$X^T X = \\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & 2 & 3 \\end{pmatrix} \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\end{pmatrix} = \\begin{pmatrix} 3 & 6 \\\\ 6 & 14 \\end{pmatrix}$$
> 2. **Déterminant & Inversion $(X^T X)^{-1}$** :
>    $$\\det(X^T X) = (3 \\times 14) - (6 \\times 6) = 42 - 36 = 6$$
>    $$(X^T X)^{-1} = \\frac{1}{6} \\begin{pmatrix} 14 & -6 \\\\ -6 & 3 \\end{pmatrix} = \\begin{pmatrix} 7/3 & -1 \\\\ -1 & 1/2 \\end{pmatrix}$$
> 3. **Produit $X^T Y$** :
>    $$X^T Y = \\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & 2 & 3 \\end{pmatrix} \\begin{pmatrix} 2 \\\\ 3 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 2 + 3 + 5 \\\\ 2 + 6 + 15 \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ 23 \\end{pmatrix}$$
> 4. **Vecteur final des coefficients $\\hat{\\beta} = (X^T X)^{-1} X^T Y$** :
>    $$\\hat{\\beta} = \\frac{1}{6} \\begin{pmatrix} 14 \\times 10 - 6 \\times 23 \\\\ -6 \\times 10 + 3 \\times 23 \\end{pmatrix} = \\frac{1}{6} \\begin{pmatrix} 140 - 138 \\\\ -60 + 69 \\end{pmatrix} = \\frac{1}{6} \\begin{pmatrix} 2 \\\\ 9 \\end{pmatrix} = \\begin{pmatrix} \\mathbf{0.333} \\\\ \\mathbf{1.500} \\end{pmatrix}$$
>
> 💻 **Le Pont vers NumPy :**
> L'instruction \`np.linalg.inv(X.T @ X) @ X.T @ y\` exécute exactement cette algèbre matricielle en une seule ligne.
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
### Diagnostic des Résidus : Orthogonalité et Somme Nulle

> 💡 **Rappel : Équations normales et résidus MCO**
> 
> En présence d'une constante dans le modèle, les conditions du premier ordre de minimisation des MCO imposent :
> $$\\sum_{t=1}^T e_t = 0 \\implies \\bar{e} = 0$$
> Les résidus sont également strictement orthogonaux à chaque variable explicative : $X' e = 0$.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Vérification de la somme nulle) :**
> Reprenons nos 3 points $(x, y) = (1, 2), (2, 3), (3, 5)$ avec la droite ajustée $\\hat{y} = 0.333 + 1.50 x$ :
> - Point 1 : $\\hat{y}_1 = 0.333 + 1.50(1) = 1.833 \\implies e_1 = 2 - 1.833 = \\mathbf{+0.167}$
> - Point 2 : $\\hat{y}_2 = 0.333 + 1.50(2) = 3.333 \\implies e_2 = 3 - 3.333 = \\mathbf{-0.333}$
> - Point 3 : $\\hat{y}_3 = 0.333 + 1.50(3) = 4.833 \\implies e_3 = 5 - 4.833 = \\mathbf{+0.167}$
>
> 1. **Somme des résidus** :
>    $$\\sum e_i = (+0.167) + (-0.333) + (+0.167) = \\mathbf{0.000}$$
> 2. **Moyenne des résidus** :
>    $$\\bar{e} = \\frac{0.000}{3} = \\mathbf{0.0}$$
>
> 💻 **Le Pont vers Python :**
> \`model.resid.mean()\` confirme numériquement que cette moyenne est égale à 0 aux erreurs d'arrondi machine près ($< 10^{-15}$).
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
### Régression Multivariée & Effet Ceteris Paribus

> 💡 **Rappel théorique : Formulation Matricielle des MCO**
> 
> Pour plusieurs variables explicatives $X_1, X_2, \\dots, X_K$ :
> $$y = X \\beta + \\varepsilon$$
> L'estimateur matriciel s'écrit de manière compacte :
> $$\\hat{\\beta} = (X'X)^{-1} X' y$$
> Chaque coefficient partiel $\\beta_j$ capture l'impact spécifique de la variable $X_j$ **après avoir neutralisé l'effet de toutes les autres variables explicatives** du modèle (*ceteris paribus* : toutes choses égales par ailleurs).

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Interprétation Ceteris Paribus) :**
> Considérons l'estimation multivariée des taux d'emprunt d'État (OAT 10 ans) :
> $$\\widehat{\\text{OAT}}_{10Y} = 0.50 + 0.80 \\cdot \\text{Euribor}_{3M} + 0.35 \\cdot \\text{Inflation}_{\\text{HICP}}$$
> 
> 1. **Sensibilité marginale à l'Euribor** ($\\beta_1 = 0.80$) :
>    Une hausse de $+1.0\\%$ de l'Euribor à 3 mois entraîne une hausse attendue de $+0.80$ point de pourcentage sur le taux 10 ans, **à inflation constante**.
> 2. **Sensibilité marginale à l'Inflation** ($\\beta_2 = 0.35$) :
>    Une accélération de $+1.0\\%$ de l'inflation entraîne une hausse de $+0.35$ point sur l'OAT, **à taux Euribor inchangé**.
> 3. **Scénario macroéconomique combiné** :
>    Si l'Euribor grimpe de $+0.5\\%$ et l'inflation de $+1.0\\%$ simultanément :
>    $$\\Delta \\widehat{\\text{OAT}} = 0.80 \\times (+0.5) + 0.35 \\times (+1.0) = 0.40 + 0.35 = \\mathbf{+0.75 \\text{ point}}$$
>
> 💻 **Le Pont vers Statsmodels :**
> \`model.params['euribor_3m']\` et \`model.params['inflation_hicp']\` fournissent directement ces élasticités partielles.
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
### Test de Significativité Globale du Modèle (Test F de Fisher)

> 💡 **Rappel théorique : Le test F conjoint de Fisher-Snedecor**
> 
> Alors que le test $t$ évalue chaque variable isolément, le test $F$ évalue la significativité conjointe de **toutes** les variables explicatives non constantes :
> - **Hypothèse nulle** : $H_0: \\beta_1 = \\beta_2 = \\dots = \\beta_K = 0$ (le modèle n'explique rien, $R^2 = 0$).
> - **Hypothèse alternative** : $H_1: \\exists j \\in \\{1, \\dots, K\\}, \\beta_j \\neq 0$ (au moins un coefficient n'est pas nul).
> 
> La statistique de test s'écrit à partir du $R^2$ ($K$ régresseurs, $T$ observations) :
> $$F = \\frac{\\text{SCE} / K}{\\text{SCR} / (T - K - 1)} = \\frac{R^2 / K}{(1 - R^2) / (T - K - 1)} \\sim \\mathcal{F}(K, T - K - 1)$$
> Si la **p-valeur $< 0.05$**, on rejette formellement $H_0$.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul de la statistique F) :**
> Soit un échantillon de $T=100$ trimestres avec $K=2$ prédicteurs et un $R^2 = 0.70$ :
> - Degrés de liberté du numérateur : $\\text{ddl}_1 = K = 2$
> - Degrés de liberté du dénominateur : $\\text{ddl}_2 = T - K - 1 = 100 - 2 - 1 = 97$
>
> 1. **Calcul du numérateur** :
>    $$\\frac{R^2}{K} = \\frac{0.70}{2} = 0.350$$
> 2. **Calcul du dénominateur** :
>    $$\\frac{1 - R^2}{T - K - 1} = \\frac{1 - 0.70}{97} = \\frac{0.30}{97} \\approx 0.003093$$
> 3. **Calcul de la statistique $F$** :
>    $$F = \\frac{0.350}{0.003093} = \\mathbf{113.16}$$
> 4. **Comparaison au seuil critique** :
>    La valeur critique tabulée $\\mathcal{F}_{0.05}(2, 97) \\approx 3.09$.
>    Comme $F = 113.16 \\gg 3.09$, la p-valeur est $< 10^{-20}$ : on rejette $H_0$ avec une immense certitude.
>
> 💻 **Le Pont vers Statsmodels :**
> \`model.fvalue\` et \`model.f_pvalue\` renvoient directement cette statistique et sa p-valeur conjointe.
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
### Multicolinéarité & Facteur d'Inflation de la Variance (VIF)

> 💡 **Rappel théorique : Le danger de la corrélation entre régresseurs**
> 
> Lorsque deux variables explicatives sont fortement corrélées (ex: Euribor et inflation), la matrice $(X'X)$ devient quasi-singulière. La variance des estimateurs explose :
> $$\\operatorname{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum (x_{jt} - \\bar{x}_j)^2} \\times \\frac{1}{1 - R_j^2}$$
> Le facteur d'inflation de variance s'obtient par la régression auxiliaire de $X_j$ sur les autres régresseurs :
> $$VIF_j = \\frac{1}{1 - R_j^2}$$
> - **$VIF = 1$** : Absence totale de corrélation (orthogonalité idéale).
> - **$VIF > 5$** : Présence de colinéarité modérée (attention requise).
> - **$VIF > 10$** : Forte multicolinéarité pathologique (coefficients instables, inversion matricielle imprécise).

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul du VIF) :**
> Supposons que la régression auxiliaire de l'Euribor sur l'inflation produise un $R_1^2 = 0.75$ :
>
> 1. **Calcul de la tolérance ($1 - R_1^2$)** :
>    $$\\text{Tolérance} = 1 - 0.75 = 0.25$$
> 2. **Calcul du $VIF$** :
>    $$VIF_1 = \\frac{1}{0.25} = \\mathbf{4.0}$$
> 3. **Interprétation de l'inflation de variance** :
>    L'écart-type de $\\hat{\\beta}_1$ est gonflé d'un facteur $\\sqrt{VIF} = \\sqrt{4.0} = 2.0$. Les intervalles de confiance sont deux fois plus larges que si les régresseurs étaient orthogonaux.
>
> 💻 **Le Pont vers Statsmodels :**
> \`variance_inflation_factor(X.values, i)\` calcule automatiquement le VIF pour chaque colonne de la matrice de régresseurs.
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
### Diagnostic d'Hétéroscédasticité : Test de Breusch-Pagan

> 💡 **Rappel : Hypothèse d'homoscédasticité et régression auxiliaire**
> 
> Les MCO supposent une variance des erreurs constante dans le temps : $\\mathbb{E}[\\varepsilon_t^2] = \\sigma^2$.
> Le test de Breusch-Pagan (1979) teste si la variance dépend linéairement des prédicteurs :
> - **Hypothèse nulle** : $H_0: \\sigma_t^2 = \\sigma^2$ (homoscédasticité, variance stable).
> - **Hypothèse alternative** : $H_1: \\sigma_t^2 = \\gamma_0 + \\sum \\gamma_j X_{jt}$ (hétéroscédasticité).
> 
> On estime la régression auxiliaire des résidus au carré :
> $$e_t^2 = \\gamma_0 + \\gamma_1 X_{1t} + \\dots + \\gamma_K X_{Kt} + u_t$$
> La statistique du multiplicateur de Lagrange ($LM$) suit sous $H_0$ une loi du Chi-deux :
> $$LM = T \\cdot R^2_{\\text{aux}} \\sim \\chi^2(K)$$
> Si la **p-valeur $< 0.05$**, on rejette $H_0$ : les écarts-types MCO classiques sont trompeurs et sous-estimés !

![Diagnostic d'Hétéroscédasticité](/images/theory/fig_v1_heteroscedasticity.png)

> 🔍 **Comprendre ce graphique : Homoscédasticité vs Hétéroscédasticité**
> - **Homoscédasticité (gauche)** : La dispersion des résidus reste parfaitement constante le long de l'axe des prédictions.
> - **Hétéroscédasticité (droite - en entonnoir)** : La variance s'élargit à mesure que la variable augmente, invalidant les écarts-types MCO classiques.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul de la statistique LM) :**
> Soit un échantillon de $T=120$ observations trimestrielles avec $K=2$ variables explicatives :
> - La régression auxiliaire des $e_t^2$ donne un coefficient de détermination $R^2_{\\text{aux}} = 0.10$.
>
> 1. **Calcul de la statistique $LM$** :
>    $$LM = 120 \\times 0.10 = \\mathbf{12.0}$$
> 2. **Seuil critique au degré de liberté $K=2$** :
>    Pour un seuil $\\alpha = 0.05$, la table de $\\chi^2(2)$ donne une valeur critique de $\\mathbf{5.99}$.
> 3. **Décision** :
>    Comme $LM = 12.0 > 5.99$, on a une p-valeur $p = \\mathbb{P}(\\chi^2(2) > 12.0) \\approx 0.0025 < 0.05$.
>    Conclusion : Présence avérée d'**hétéroscédasticité**. Il est impératif d'utiliser les écarts-types robustes de White !
>
> 💻 **Le Pont vers Statsmodels :**
> \`het_breuschpagan(residus, X)\` effectue cette régression auxiliaire et renvoie la statistique $LM$ et sa p-valeur.
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
### Correction d'Hétéroscédasticité : L'Estimateur Robuste de Halbert White (HC)

> 💡 **Rappel : L'Estimateur de Variance « Sandwich » (1980)**
> 
> Pour corriger les écarts-types sans imposer de forme paramétrique à l'hétéroscédasticité, Halbert White introduit la matrice robuste :
> $$\\operatorname{Var}_{\\text{HC}}(\\hat{\\beta}) = (X'X)^{-1} \\left( \\sum_{t=1}^T e_t^2 x_t x_t' \\right) (X'X)^{-1}$$
> - Le « pain » : $(X'X)^{-1}$ (identique aux MCO).
> - La « viande » : $\\sum e_t^2 x_t x_t'$ (pondération des carrés résiduels empiriques).
> - **Variante HC1** : applique une correction de petits échantillons $\\frac{T}{T - K - 1}$.
> - Les coefficients $\\hat{\\beta}$ restent rigoureusement identiques, seuls les écarts-types et p-valeurs sont corrigés.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Impact de la correction HC1) :**
> Soit un coefficient estimé $\\hat{\\beta}_1 = 0.85$ :
> - Écart-type classique MCO (naïf) : $\\hat{\\sigma}_{\\text{OLS}} = 0.30$
> - Écart-type robuste White HC1 : $\\hat{\\sigma}_{\\text{HC1}} = 0.55$
>
> 1. **Test $t$ naïf (sans correction)** :
>    $$t_{\\text{OLS}} = \\frac{0.85}{0.30} = 2.83 \\implies p \\approx 0.005 < 0.05 \\text{ (Faux positif !)}$$
> 2. **Test $t$ robuste HC1 (avec correction de White)** :
>    $$t_{\\text{HC1}} = \\frac{0.85}{0.55} = 1.55 \\implies p \\approx 0.124 > 0.05 \\text{ (Non significatif)}$$
>    Conclusion : Ignorer l'hétéroscédasticité menait à déclarer à tort un effet statistiquement significatif. L'estimateur HC1 rétablit la rigueur scientifique.
>
> 💻 **Le Pont vers Statsmodels :**
> \`model.fit(cov_type='HC1')\` recalcule instantanément la matrice de covariance sandwich.
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
### Test de Normalité des Résidus de Jarque-Bera

> 💡 **Rappel théorique : Asymétrie (Skewness) et Aplatissement (Kurtosis)**
> 
> Pour que les tests $t$ de Student et $F$ de Fisher soient rigoureusement exacts en petits échantillons, les erreurs doivent suivre une distribution normale :
> - **Skewness (Asymétrie)** : $S = 0$ pour une loi normale symétrique.
> - **Kurtosis (Aplatissement)** : $K = 3$ pour une loi normale mésokurtique.
> 
> La statistique de Jarque-Bera teste la normalité conjointe des moments d'ordre 3 et 4 :
> $$JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\sim \\chi^2(2)$$
> Si la **p-valeur $< 0.05$**, on rejette l'hypothèse de normalité des résidus.

![Asymétrie et Épaisseur des Queues](/images/theory/fig_fat_tails_jarque_bera.png)

> 🔍 **Comprendre ce graphique : Normalité vs Queues Épaisses**
> - **Courbe Gaussienne (bleue)** : Skewness = 0, Kurtosis = 3.
> - **Distribution Réelle Empirique (rouge)** : Pics pointus et queues épaisses (Kurtosis > 3), les événements extrêmes sont plus fréquents que prévu par la loi normale.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul de la statistique JB) :**
> Soit un échantillon de $T=150$ observations avec des résidus présentant un skewness $S = +0.50$ (asymétrie droite) et un kurtosis $K = 4.20$ (queues épaisses, leptokurtique) :
>
> 1. **Écart à la symétrie** :
>    $$S^2 = (0.50)^2 = 0.25$$
> 2. **Écart au kurtosis normal** :
>    $$\\frac{(K - 3)^2}{4} = \\frac{(4.20 - 3)^2}{4} = \\frac{1.44}{4} = 0.36$$
> 3. **Calcul de la statistique $JB$** :
>    $$JB = \\frac{150}{6} \\left( 0.25 + 0.36 \\right) = 25 \\times 0.61 = \\mathbf{15.25}$$
> 4. **Décision au seuil de 5%** :
>    La valeur critique $\\chi^2(2)$ à 5% est de $5.99$.
>    Comme $JB = 15.25 > 5.99$, la p-valeur est $p \\approx 0.00049 < 0.05$ : on rejette formellement l'hypothèse de normalité des résidus.
>
> 💻 **Le Pont vers Statsmodels :**
> \`jarque_bera(model.resid)\` retourne la statistique $JB$ et sa p-valeur associée.
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
### Séries Temporelles & Piège de la Régression Spurieuse

> 💡 **Rappel : Granger & Newbold (1974) et la Statistique de Durbin-Watson**
> 
> En séries temporelles, régresser deux variables non-stationnaires (ex: deux marches aléatoires $I(1)$ sans aucun lien réel) conduit à une **régression fallacieuse** (*spurious regression*) :
> - Le coefficient de détermination $R^2$ apparaît anormalement élevé ($> 0.80$).
> - Les $t$-statistiques explosent, indiquant à tort une significativité extrême.
> - Les résidus présentent une mémoire temporelle quasi-parfaite ($\\rho \\approx 1$).
> 
> La statistique de Durbin-Watson mesure l'autocorrélation d'ordre 1 des résidus :
> $$DW = \\frac{\\sum_{t=2}^T (e_t - e_{t-1})^2}{\\sum_{t=1}^T e_t^2} \\approx 2(1 - \\hat{\\rho})$$
> - **$DW \\approx 2$** : Absence d'autocorrélation ($\\hat{\\rho} = 0$, situation saine).
> - **$DW \\approx 0$** : Forte persistance positive ($\\hat{\\rho} \\to 1$, typique d'une régression spurieuse).
> - Règle pratique de Granger-Newbold : Si **$R^2 > DW$**, méfiance absolue, la régression est très probablement fallacieuse !

![Régression Spurieuse en Séries Temporelles](/images/theory/fig_v1_spurious_regression.png)

> 🔍 **Comprendre ce graphique : Le Piège de Granger-Newbold**
> - Deux marches aléatoires indépendantes dérivent au cours du temps par simple accumulation de chocs stochastiques non stationnaires.
> - L'estimation en niveau produit artificiellement un $R^2$ élevé et des résidus hautement autocorrélés ($DW \approx 0$).

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Diagnostic de Régression Fallacieuse) :**
> Soient deux séries macroéconomiques indépendantes simulées sur $T=200$ périodes. L'ajustement OLS donne :
> - $R^2 = 0.82$ (semble excellent au premier coup d'œil).
> - Coefficient d'autocorrélation résiduelle estimé : $\\hat{\\rho} = 0.985$.
>
> 1. **Calcul de la statistique de Durbin-Watson** :
>    $$DW \\approx 2(1 - 0.985) = 2 \\times 0.015 = \\mathbf{0.030}$$
> 2. **Application de la règle de Granger-Newbold** :
>    $$R^2 = 0.82 \\gg DW = 0.030$$
> 3. **Diagnostic** :
>    La corrélation observée est purement artificielle, induite par les tendances stochastiques des séries. La régression en niveau n'a aucune validité économétrique : il faut stationnariser les séries !
>
> 💻 **Le Pont vers Statsmodels :**
> \`durbin_watson(model.resid)\` calcule instantanément la valeur exacte de la statistique $DW$.
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
### Test de Racine Unitaire : Augmented Dickey-Fuller (ADF)

> 💡 **Rappel théorique : Détection de non-stationnarité stochastique**
> 
> Une série temporelle $y_t$ admet une racine unitaire si sa dynamique suit une marche aléatoire :
> $$y_t = \\rho y_{t-1} + \\varepsilon_t \\iff \\Delta y_t = \\gamma y_{t-1} + \\varepsilon_t \\quad (\\text{avec } \\gamma = \\rho - 1)$$
> Le test de Dickey-Fuller teste :
> - **Hypothèse nulle $H_0$** : $\\gamma = 0$ ($\\rho = 1$, racine unitaire $\\implies$ série non-stationnaire $I(1)$).
> - **Hypothèse alternative $H_1$** : $\\gamma < 0$ ($\\rho < 1$, série stationnaire à retour à la moyenne $I(0)$).
> 
> La statistique $t_{\\text{ADF}} = \\frac{\\hat{\\gamma}}{\\hat{\\sigma}_{\\hat{\\gamma}}}$ ne suit pas une loi de Student classique, mais la distribution asymétrique de Dickey-Fuller (valeurs critiques de MacKinnon).
> Pour rejeter $H_0$ à 5%, il faut que $t_{\\text{ADF}}$ soit **plus négative** que la valeur critique (ex: $t_{\\text{ADF}} < -2.88$ avec constante).

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul et Décision ADF) :**
> Soit la régression ADF estimée sur le taux OAT 10 ans ($T=100$) avec constante :
> $$\\Delta y_t = 0.12 - 0.04 y_{t-1} + u_t$$
> On observe $\\hat{\\gamma} = -0.04$ et un écart-type estimé $\\hat{\\sigma}_{\\hat{\\gamma}} = 0.025$ :
>
> 1. **Calcul de la statistique $t_{\\text{ADF}}$** :
>    $$t_{\\text{ADF}} = \\frac{-0.04}{0.025} = \\mathbf{-1.60}$$
> 2. **Comparaison à la valeur critique de MacKinnon (seuil 5% avec constante : -2.88)** :
>    $$-1.60 > -2.88 \\implies \\text{On est à droite du seuil critique de rejet}$$
> 3. **Décision** :
>    On **ne peut pas rejeter $H_0$** (p-valeur $\\approx 0.48 > 0.05$).
>    Conclusion : La série présente une racine unitaire ($I(1)$), elle n'est pas stationnaire en niveau.
>
> 💻 **Le Pont vers Statsmodels :**
> \`adfuller(df['oat_10y'])\` renvoie la statistique ADF, la p-valeur exacte et le dictionnaire des valeurs critiques (1%, 5%, 10%).
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
### Stationnarisation par Différenciation Première ($\\Delta y_t$)

> 💡 **Rappel : L'opérateur de différence première**
> 
> Si une série temporelle $y_t$ est intégrée d'ordre 1 ($I(1)$), sa différence première est garantie stationnaire ($I(0)$) :
> $$\\Delta y_t = y_t - y_{t-1} = (1 - L) y_t$$
> où $L$ est l'opérateur retard (*Lag operator* : $L y_t = y_{t-1}$).
> - En finance et macroéconomie, pour une variable en logarithme $\\ln(P_t)$, la différence première $\\Delta \\ln(P_t) = \\ln(P_t) - \\ln(P_{t-1})$ correspond exactement au rendement continu stationnaire.
> - Travailler sur des séries stationnaires élimine le risque de régression spurieuse et rétablit la validité des théorèmes limites d'inférence.

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Différenciation pas-à-pas) :**
> Soit une série non-stationnaire présentant une dérive temporelle :
> - Période $t=1$ : $y_1 = 10.0$
> - Période $t=2$ : $y_2 = 12.5 \\implies \\Delta y_2 = 12.5 - 10.0 = \\mathbf{+2.5}$
> - Période $t=3$ : $y_3 = 14.1 \\implies \\Delta y_3 = 14.1 - 12.5 = \\mathbf{+1.6}$
> - Période $t=4$ : $y_4 = 16.8 \\implies \\Delta y_4 = 16.8 - 14.1 = \\mathbf{+2.7}$
>
> 1. **Comportement en niveau ($y_t$)** : La série s'éloigne continuellement de son origine (moyenne non constante, variance croissante avec $t$).
> 2. **Comportement en différence ($\\Delta y_t$)** : Les accroissements oscillent autour d'une moyenne stable $\\bar{\\Delta y} \\approx +2.27$ avec une dispersion bornée : la série est devenue **parfaitement stationnaire**.
>
> 💻 **Le Pont vers Pandas :**
> \`df['oat_diff'] = df['oat_10y'].diff().dropna()\` calcule cette différence première et élimine la première observation devenue \`NaN\`.
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
### Correction de l'Autocorrélation : Estimateur HAC de Newey-West

> 💡 **Rappel théorique : Hétéroscédasticité et Autocorrélation Robustes (HAC)**
> 
> Lorsque les résidus sont à la fois hétéroscédastiques et corrélés dans le temps ($\\mathbb{E}[e_t e_{t-l}] \\neq 0$), l'estimateur de Newey et West (1987) corrige la matrice de covariance :
> $$\\hat{\\Omega}_{\\text{HAC}} = \\hat{\\Gamma}_0 + \\sum_{l=1}^L w_l \\left( \\hat{\\Gamma}_l + \\hat{\\Gamma}_l' \\right)$$
> Pour garantir que la matrice résultante soit toujours semi-définie positive, Newey-West utilise un noyau triangulaire de Bartlett :
> $$w_l = 1 - \\frac{l}{L + 1}$$
> où $L$ est le nombre maximal de retards (*bandwidth* ou *lags* pris en compte).

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Calcul des poids de Bartlett pour $L=2$) :**
> Supposons que l'on autorise une mémoire temporelle résiduelle de $L=2$ trimestres :
>
> 1. **Poids de Bartlett du retard 0 (contemporain)** :
>    $$w_0 = 1.0$$
> 2. **Poids de Bartlett du retard 1 ($l=1$)** :
>    $$w_1 = 1 - \\frac{1}{2 + 1} = 1 - \\frac{1}{3} = \\frac{2}{3} \\approx \\mathbf{0.667}$$
> 3. **Poids de Bartlett du retard 2 ($l=2$)** :
>    $$w_2 = 1 - \\frac{2}{2 + 1} = 1 - \\frac{2}{3} = \\frac{1}{3} \\approx \\mathbf{0.333}$$
> 4. **Pondération d'un autocovariance exemple** :
>    Si $\\hat{\\Gamma}_0 = 1.0$, $\\hat{\\Gamma}_1 = 0.30$, $\\hat{\\Gamma}_2 = 0.15$ :
>    $$\\hat{\\Omega}_{\\text{HAC}} = 1.0 + 2 \\times [0.667 \\times 0.30 + 0.333 \\times 0.15] = 1.0 + 2 \\times [0.200 + 0.050] = \\mathbf{1.50}$$
>    L'écart-type réel corrigé de la persistance est $\\sqrt{1.50} \\approx 1.225$ fois plus grand que l'écart-type naïf.
>
> 💻 **Le Pont vers Statsmodels :**
> \`model.fit(cov_type='HAC', cov_kwds={'maxlags': 4})\` applique automatiquement la correction robuste de Newey-West.
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

> ✏️ **Exemple chiffré & Résolution pas-à-pas (Sensibilité de Duration ALM) :**
> Soit un portefeuille obligataire institutionnel de valeur initiale $V_0 = 100\\ 000\\ 000\\text{ EUR}$ (100 M€) avec une duration modifiée $D^* = 7.0$ ans.
> La Banque Centrale relève brutalement son taux directeur de $+200\\text{ bps}$ (soit $\\Delta y = +0.02$).
>
> 1. **Approximation linéaire de Taylor (Sensibilité au 1er ordre)** :
>    $$\\frac{\\Delta V}{V_0} \\approx -D^* \\times \\Delta y$$
> 2. **Variation relative en pourcentage** :
>    $$\\frac{\\Delta V}{V_0} = -7.0 \\times (+0.02) = -0.14 = \\mathbf{-14.0\\%}$$
> 3. **Perte absolue en capital** :
>    $$\\Delta V = -14.0\\% \\times 100\\ 000\\ 000\\text{ EUR} = \\mathbf{-14\\ 000\\ 000\\text{ EUR}} \\text{ (-14 M€)}$$
>
> 💻 **Le Pont vers le Code :**
> \`perte_estimee = -duration_modifiee * choc_taux * valeur_portefeuille\` calcule directement cette perte bilancielle en une ligne.
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
