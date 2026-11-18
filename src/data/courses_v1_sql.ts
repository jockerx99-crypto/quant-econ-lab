import { CourseModule } from "@/types/course";

export const SQL_ACTUARIAT_MODULE: CourseModule = {
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
### Projection de Colonnes en SQL (\`SELECT\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Isoler le signal utile dans des tables larges**
>
> En production actuarielle, une table de polices auto ou d'épargne-vie comporte couramment entre 80 et 200 attributs (identifiants clients, coordonnées postales, historique CRM, garanties annexes, dates d'effet et d'avenants). Lancer un \`SELECT *\` rapatrie l'intégralité de ces champs, sature la bande passante réseau entre le Data Warehouse et le moteur de modélisation (Python/R), et augmente le risque d'exposer des données personnelles (RGPD) inutiles au calcul de prime.
>
> En **algèbre relationnelle de Codd**, l'extraction ciblée d'attributs correspond à l'opérateur de **projection** $\\pi$ sur une relation $R(A_1, A_2, \\dots, A_n)$ :
>
> $$
> \\pi_{A_1, \\dots, A_k}(R) = \\{ t[A_1, \\dots, A_k] \\mid t \\in R \\}, \\quad k \\le n
> $$
>
> **Distinction théorique essentielle (Ensemble vs Multi-ensemble) :**
> - En algèbre relationnelle pure (théorie des ensembles), $\\pi$ élimine les doublons : $|\\pi(R)| \\le |R|$.
> - En **SQL** (algèbre multi-ensemble ou *bag algebra*), \`SELECT\` **conserve tous les doublons par défaut** : $|\\pi^{\\text{SQL}}(R)| = |R|$. Pour un actuaire calculant une moyenne d'âge ou de prime, cette conservation est vitale : supprimer les doublons d'âge détruirait la pondération empirique du portefeuille !

> 📊 **Lien direct Tarification & Provisionnement :**
> Lors de la préparation d'une matrice de design $X$ pour un modèle GLM fréquence/sévérité, on projette strictement la clé de contrat (\`police_id\`) et les variables tarifaires explicatives (\`age\`, \`region\`, \`bonus_malus\`, \`puissance_fiscale\`).

#### 💻 Masterclass SQL

1. **Ordre logique d'exécution minimal** : le moteur exécute d'abord \`FROM nom_table\` (identification et chargement de la source), puis \`SELECT col1, col2\` (projection des attributs retenus).
2. **Séparation par virgules** : chaque colonne projetée est séparée par \`,\`, **sans jamais placer de virgule traînante** avant le mot-clé \`FROM\`.
3. **Coût I/O & stockage colonnaire** : dans les bases analytiques modernes orientées colonnes (DuckDB, Snowflake, BigQuery, Parquet), projeter 2 colonnes sur 100 ne lit physiquement que 2 % des blocs disque.

\`\`\`sql
-- Projection ciblée de 3 attributs utiles sur la table sinistres
SELECT
    sinistre_id,       -- Clé primaire du dossier sinistre
    nature_sinistre,   -- Péril déclaré (Collision, Vol, Incendie, Bris de Glace)
    cout_total         -- Charge totale retenue pour le provisionnement
FROM sinistres         -- Table source des sinistres (exécutée en premier)
LIMIT 5;               -- Borne l'affichage aux 5 premières lignes
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres LIMIT 5;
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
501          Collision        1450.0    
502          Bris de Glace    420.0     
503          Collision        5000.0    
504          Vol              18500.0   
505          Collision        11700.0
\`\`\`

> 🔍 **Lecture actuarielle :** La projection renvoie exactement 3 colonnes sur les 10 que compte \`sinistres\`. On y lit immédiatement les sinistres \`501\` à \`505\`, avec des charges allant de \`420.0\` EUR (Bris de Glace) à \`18500.0\` EUR (Vol).
        `,
        taskMarkdown: "Depuis la table `assures`, écrivez une requête SQL projetant uniquement les colonnes `police_id` et `age` (dans cet ordre exact, sans alias ni filtre).",
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
### Alias de Colonnes & Couche Sémantique (\`AS\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Réconcilier schéma technique et langage actuariel**
>
> Les tables transactionnelles portent souvent des noms de colonnes hérités de l'ERP de gestion (\`prime_annuelle\`, \`cout_total\`, \`oat_10y\`). Dans un livrable Solvabilité II, IFRS 17 ou un tableau de bord de souscription, l'actuaire renomme ces champs pour refléter leur sens économique exact (\`prime_nette\`, \`charge_ultime\`, \`cotisation_acquise\`).
>
> En algèbre relationnelle, l'opérateur de **renommage** $\\rho_{b \\leftarrow a}(R)$ modifie l'intension (le nom d'un attribut dans le schéma de sortie) sans altérer l'extension (les valeurs des tuples) :
>
> $$
> \\rho_{b \\leftarrow a}(R) = \\{ t' \\mid \\exists t \\in R,\\ t'[b] = t[a] \\land \\forall c \\neq a,\\ t'[c] = t[c] \\}
> $$
>
> **Propriété d'invariance physique :** L'alias est purement éphémère à l'exécution de la requête ; il ne modifie jamais le schéma physique stocké sur disque.

> 📊 **Lien direct Tarification & ALM :**
> Lors d'extractions destinées à Python/Pandas (\`pd.read_sql\`), normaliser les noms de colonnes via \`AS\` évite les renommages manuels ultérieurs et prévient les collisions de noms (\`id\`, \`date\`, \`montant\`) avant une fusion de tables.

#### 💻 Masterclass SQL

1. **Portée lexicale dans le cycle d'exécution** :
   \`1. FROM\` $\\to$ \`2. WHERE\` $\\to$ \`3. GROUP BY\` $\\to$ \`4. HAVING\` $\\to$ \`5. SELECT\` (création des alias) $\\to$ \`6. ORDER BY\`.
   Conséquence impérative : **un alias créé dans \`SELECT\` est invisible dans \`WHERE\`**, car \`WHERE\` est évalué *avant* \`SELECT\`. En revanche, il est accessible dans \`ORDER BY\`.
2. **Mot-clé \`AS\` explicite** : SQL autorise parfois d'omettre \`AS\` (\`SELECT a b\`), mais c'est une **mauvaise pratique dangereuse** : une virgule oubliée entre deux colonnes (\`SELECT police_id age FROM assures\`) renomme silencieusement \`police_id\` en \`age\` au lieu de lever une erreur !
3. **Convention d'ingénierie** : utilisez toujours le \`snake_case\` ASCII sans espace ni accent (\`prime_nette\`) plutôt que des libellés entre guillemets.

\`\`\`sql
-- Renommage sémantique de colonnes techniques vers le vocabulaire sinistres
SELECT
    sinistre_id,                        -- Identifiant conservé tel quel
    cout_total AS charge_ultime,        -- Alias métier pour le coût total du sinistre
    responsabilite_pct AS part_resp     -- Alias concis pour le taux de responsabilité
FROM sinistres
LIMIT 4;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, cout_total AS charge_ultime, responsabilite_pct AS part_resp FROM sinistres LIMIT 4;
sinistre_id  charge_ultime  part_resp
-----------  -------------  ---------
501          1450.0         100.0    
502          420.0          0.0      
503          5000.0         100.0    
504          18500.0        0.0
\`\`\`

> 🔍 **Lecture actuarielle :** Les en-têtes du résultat affichent désormais \`charge_ultime\` et \`part_resp\`, tandis que les colonnes physiques \`cout_total\` et \`responsabilite_pct\` restent inchangées dans la table \`sinistres\`.
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez la colonne `police_id` et la colonne `prime_annuelle` renommée avec l'alias exact `prime_nette` (`prime_annuelle AS prime_nette`).",
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
### Filtrage Numérique & Logique Ternaire (\`WHERE\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & Réassurance : Isoler les seuils et sinistres graves**
>
> En assurance non-vie, la distribution des coûts de sinistres est fortement asymétrique : une minorité de dossiers graves concentre l'essentiel de la charge totale. La clause \`WHERE\` permet d'extraire les polices à prime élevée, de vérifier les âges légaux ou d'isoler les sinistres dépassant une priorité de réassurance $P_{\\text{XS}}$ (traité en excédent de sinistre).
>
> En algèbre relationnelle, \`WHERE\` implémente l'opérateur de **restriction (sélection)** $\\sigma_P(R)$ :
>
> $$
> \\sigma_P(R) = \\{ t \\in R \\mid P(t) = \\text{TRUE} \\}
> $$
>
> **Logique ternaire de Kleene (\`TRUE / FALSE / UNKNOWN\`) :**
> Contrairement à l'algèbre booléenne binaire classique, SQL manipule des valeurs manquantes (\`NULL\`). Toute comparaison impliquant \`NULL\` (par exemple \`cout_corporel > 1000\`) s'évalue à \`UNKNOWN\`. La règle stricte du moteur SQL est : **\`WHERE\` ne conserve que les lignes évaluées à \`TRUE\`**, rejetant à la fois \`FALSE\` et \`UNKNOWN\`.
>
> **Inégalité stricte vs large :** \`>\` ($x > s$) exclut exactement le seuil $s$, alors que \`>=\` ($x \\ge s$) l'inclut. Sur un traité de réassurance à priorité $5\\,000\\text{ EUR}$, confondre \`>\` et \`>=\` peut exclure un dossier pile au seuil.

#### 💻 Masterclass SQL

1. **Position dans le cycle logique** : \`FROM\` $\\to$ \`WHERE\` $\\to$ \`SELECT\`. Filtrer le plus tôt possible réduit le volume de lignes transmises aux étapes coûteuses (\`GROUP BY\`, \`ORDER BY\`).
2. **Index B-Tree vs Full Table Scan** : sans index, le moteur parcourt les $N$ lignes en $\\mathcal{O}(N)$. Sur une colonne indexée, un prédicat *SARGable* (\`cout_total >= 5000\`) permet un accès logarithmique $\\mathcal{O}(\\log N + k)$. À l'inverse, transformer la colonne dans le filtre (\`cout_total * 1.2 > 6000\`) neutralise l'index !
3. **Opérateurs disponibles** : \`=\`, \`<>\` (ou \`!=\`), \`>\`, \`<\`, \`>=\`, \`<=\`.

\`\`\`sql
-- Isolation des sinistres graves (>= 5 000 EUR) pour revue de réassurance
SELECT
    sinistre_id,       -- Clé du dossier
    nature_sinistre,   -- Péril responsable du choc
    cout_total         -- Montant total constaté
FROM sinistres
WHERE cout_total >= 5000;  -- Prédicat numérique large : inclut exactement 5000.0
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total >= 5000;
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
503          Collision        5000.0    
504          Vol              18500.0   
505          Collision        11700.0   
506          Incendie         9400.0
\`\`\`

> 🔍 **Lecture actuarielle :** Seuls 4 sinistres sur 8 atteignent ou dépassent \`5000.0\` EUR (dont \`503\` à exactement \`5000.0\`). Leur somme vaut $44\\,600\\text{ EUR}$ sur $48\\,950\\text{ EUR}$ au total, soit $91.1\\%$ de la charge globale concentrée sur la moitié des dossiers !
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez les colonnes `police_id` et `prime_annuelle` uniquement pour les contrats dont `prime_annuelle` est strictement supérieure à `800` (`WHERE prime_annuelle > 800`).",
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
### Filtrage Catégoriel & Littéraux Textuels (\`WHERE string\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Segmentation géographique et zonier tarifaire**
>
> En tarification automobile et habitation (MRH), les variables qualitatives (région administrative, formule de garantie, nature de sinistre) structurent la matrice de risque. La région \`'IDF'\` concentre par exemple une densité de circulation, un coût horaire de main-d'œuvre carrosserie et une fréquence de vol distincts du reste du territoire : isoler une modalité catégorielle est le premier geste de l'analyse du **zonier tarifaire**.
>
> Formellement, pour un attribut $A$ prenant ses valeurs dans un ensemble discret fini de modalités $\\mathcal{D}$, la restriction s'écrit :
>
> $$
> \\sigma_{A = c}(R) = \\{ t \\in R \\mid t[A] = c \\}, \\quad c \\in \\mathcal{D}
> $$
>
> **Collation et sensibilité à la casse :** En SQLite (collation \`BINARY\` par défaut) comme en PostgreSQL, l'égalité textuelle compare les octets exacts : \`'IDF' = 'idf'\` est \`FALSE\`, et les accents comptent (\`'Tiers Étendu'\` $\\neq$ \`'Tiers Etendu'\`). Un espace parasite en fin de chaîne (\`'IDF '\`) rompt également l'égalité stricte.

#### 💻 Masterclass SQL

1. **Guillemets simples \`'...'\` vs doubles \`"..."\`** : en norme SQL ANSI, les **guillemets simples** délimitent une valeur textuelle (\`'IDF'\`), tandis que les guillemets doubles désignent un nom d'objet (table ou colonne). Écrire \`WHERE region = "IDF"\` échoue avec \`no such column\` dans les moteurs stricts.
2. **Égalité stricte \`=\` vs motif \`LIKE\`** : utilisez toujours \`=\` lorsque la modalité exacte est connue. Le prédicat \`LIKE 'IDF%'\` (préfixe fixe) reste indexable par B-Tree, alors qu'un joker initial \`LIKE '%DF'\` impose un balayage complet de la table.
3. **Audit préalable** : en présence d'un jeu de données inconnu, vérifiez toujours les libellés exacts avec \`SELECT DISTINCT nature_sinistre FROM sinistres;\`.

\`\`\`sql
-- Extraction des dossiers de Collision pour calibrer la garantie Dommages
SELECT
    sinistre_id,     -- Identifiant du sinistre
    police_id,       -- Contrat rattaché
    cout_total       -- Coût total du sinistre
FROM sinistres
WHERE nature_sinistre = 'Collision';  -- Littéral exact entre guillemets simples
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, police_id, cout_total FROM sinistres WHERE nature_sinistre = 'Collision';
sinistre_id  police_id  cout_total
-----------  ---------  ----------
501          1001       1450.0    
503          1003       5000.0    
505          1007       11700.0   
508          1011       2100.0
\`\`\`

> 🔍 **Lecture actuarielle :** Les 4 sinistres de \`Collision\` cumulent $20\\,250\\text{ EUR}$ (soit une sévérité moyenne de $5\\,062.50\\text{ EUR}$ par choc).
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id`, `region` et `prime_annuelle` en filtrant uniquement les assurés résidant dans la région `'IDF'` (`WHERE region = 'IDF'`).",
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
### Conjonction Logique (\`AND\`) & Algèbre de Kleene

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Croisement de facteurs de risque aggravants**
>
> En souscription automobile, un seul critère suffit rarement : un jeune conducteur prudent n'a pas le même profil qu'un conducteur jeune *et* déjà malussé (\`age < 30\` et \`bonus_malus > 0.8\`). En ALM, l'actuaire identifie de même les régimes macroéconomiques conjoints, par exemple une inflation élevée (\`inflation_hicp > 5.0\`) accompagnée d'un resserrement monétaire effectif (\`euribor_3m > 0\`).
>
> En algèbre relationnelle, la conjonction de deux prédicats $P$ et $Q$ correspond à l'**intersection ensembliste** des restrictions :
>
> $$
> \\sigma_{P \\land Q}(R) = \\sigma_P(R) \\cap \\sigma_Q(R) = \\sigma_P(\\sigma_Q(R))
> $$
>
> **Table de vérité ternaire de \`AND\` (Kleene) :**
> - $\\text{TRUE} \\land \\text{TRUE} = \\text{TRUE}$ (ligne conservée)
> - $\\text{FALSE} \\land \\text{UNKNOWN} = \\text{FALSE}$ (\`FALSE\` est absorbant)
> - $\\text{TRUE} \\land \\text{UNKNOWN} = \\text{UNKNOWN}$ (ligne rejetée par \`WHERE\`)
>
> **Hiérarchie booléenne :** \`NOT\` possède la plus haute priorité, suivi de \`AND\`, puis \`OR\` ($A \\lor B \\land C \\iff A \\lor (B \\land C)$).

#### 💻 Masterclass SQL

1. **Le piège classique du « et » français sur une même colonne** : en français on demande « les assurés de IDF et PACA », mais en SQL écrire \`WHERE region = 'IDF' AND region = 'PACA'\` renvoie systématiquement **0 ligne** ($\\text{IDF} \\cap \\text{PACA} = \\emptyset$). Pour cumuler plusieurs valeurs d'une même colonne, on utilise \`OR\` ou \`IN\`.
2. **Sélectivité & Optimiseur** : \`AND\` étant commutatif sur la sortie, le moteur choisit d'évaluer en premier la condition la plus sélective ou disposant d'un index B-Tree.
3. **Validation quantitative ALM** : croiser des seuils sur \`macro_taux\` permet de dater exactement les trimestres de stress de liquidité.

\`\`\`sql
-- Identification des trimestres de choc inflationniste + taux positifs (ALM)
SELECT
    periode,          -- Trimestre d'observation (ex: 2022-Q3)
    euribor_3m,       -- Taux monétaire court terme (%)
    inflation_hicp    -- Inflation harmonisée annuelle (%)
FROM macro_taux
WHERE inflation_hicp > 5.0   -- Condition 1 : inflation supérieure à 5 %
  AND euribor_3m > 0;        -- Condition 2 : fin des taux négatifs
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT periode, euribor_3m, inflation_hicp FROM macro_taux WHERE inflation_hicp > 5.0 AND euribor_3m > 0;
periode  euribor_3m  inflation_hicp
-------  ----------  --------------
2022-Q3  0.95        9.9           
2022-Q4  2.06        9.2           
2023-Q1  2.85        6.9           
2023-Q2  3.4         5.5
\`\`\`

> 🔍 **Lecture ALM :** Exactement 4 trimestres (\`2022-Q3\` à \`2023-Q2\`) combinent inflation supérieure à $5\\%$ et Euribor 3M positif. Notez que \`2022-Q1\` et \`2022-Q2\` (inflation à $7.4\\%$ et $8.6\\%$) sont écartés car l'Euribor y était encore négatif (\`-0.5\` et \`-0.18\`).
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id`, `age` et `bonus_malus` en ne conservant que les contrats vérifiant simultanément `age < 30` et `bonus_malus > 0.8` (`WHERE age < 30 AND bonus_malus > 0.8`).",
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
### Disjonction Logique (\`OR\`) & Lois de De Morgan

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Regrouper des périls ou segments à forte sévérité**
>
> Certaines garanties ou catégories de véhicules partagent un profil de coût extrême malgré une faible fréquence : les sinistres \`Vol\` et \`Incendie\` (pertes totales), ou les véhicules \`SUV\` et \`Sportive\` (valeur à neuf et coût des pièces détachées élevés). La disjonction \`OR\` permet de réunir ces segments dans un même périmètre de surveillance.
>
> En algèbre relationnelle, la disjonction correspond à l'**union ensembliste** des restrictions :
>
> $$
> \\sigma_{P \\lor Q}(R) = \\sigma_P(R) \\cup \\sigma_Q(R)
> $$
>
> Contrairement à un empilement de requêtes via \`UNION ALL\`, un filtre \`P OR Q\` dans \`WHERE\` teste chaque tuple une seule fois : une ligne vérifiant simultanément $P$ et $Q$ n'apparaît **qu'une seule fois** (pas de duplication).
>
> **Identités de De Morgan & logique ternaire :**
> $$
> \\neg(P \\lor Q) \\iff (\\neg P) \\land (\\neg Q)
> $$
> Attention : avec \`OR\`, \`TRUE\` est absorbant : $\\text{TRUE} \\lor \\text{UNKNOWN} = \\text{TRUE}$, tandis que $\\text{FALSE} \\lor \\text{UNKNOWN} = \\text{UNKNOWN}$.

#### 💻 Masterclass SQL

1. **Danger critique de priorité sans parenthèses** : \`AND\` étant prioritaire sur \`OR\`, écrire \`WHERE region = 'IDF' AND type_vehicule = 'SUV' OR type_vehicule = 'Sportive'\` signifie \`(region = 'IDF' AND type_vehicule = 'SUV') OR type_vehicule = 'Sportive'\` — ce qui inclurait les Sportives hors Île-de-France ! Dès que vous mélangez \`AND\` et \`OR\`, **parenthésez systématiquement**.
2. **Impact sur les index** : un \`OR\` sur deux colonnes distinctes (\`age < 25 OR puissance_fiscale > 10\`) empêche souvent l'utilisation d'un index B-Tree unique et contraint le moteur à un *Full Table Scan*.
3. **Lisibilité** : lorsque les conditions portent sur la *même* colonne avec égalité (\`=\`), préférez \`IN (...)\` au-delà de 2 valeurs.

\`\`\`sql
-- Extraction des sinistres de perte totale majeure (Vol ou Incendie)
SELECT
    sinistre_id,       -- Numéro du sinistre
    nature_sinistre,   -- Péril déclaré
    cout_total         -- Charge totale du dossier
FROM sinistres
WHERE nature_sinistre = 'Vol'         -- Première modalité ciblée
   OR nature_sinistre = 'Incendie';   -- Seconde modalité (union des deux ensembles)
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre = 'Vol' OR nature_sinistre = 'Incendie';
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
504          Vol              18500.0   
506          Incendie         9400.0
\`\`\`

> 🔍 **Lecture actuarielle :** Les 2 seuls sinistres \`Vol\` (\`504\`) et \`Incendie\` (\`506\`) représentent respectivement \`18500.0\` EUR et \`9400.0\` EUR, soit plus de la moitié ($57.0\\%$) de toute la charge sinistre de la base.
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id` et `type_vehicule` pour les polices couvrant un véhicule `'SUV'` ou `'Sportive'` (`WHERE type_vehicule = 'SUV' OR type_vehicule = 'Sportive'`).",
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
### Appartenance à un Ensemble Discret (\`IN\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Consolidation de modalités tarifaires**
>
> Dans un modèle tarifaire GLM ou une étude par portefeuille, l'actuaire regroupe fréquemment plusieurs modalités qualitatives homogènes : périmètre grand public (\`'Citadine'\`, \`'Berline'\`), zones géographiques limitrophes, ou types de sinistres ciblés. L'opérateur \`IN\` exprime proprement l'appartenance à un ensemble fini discret $E$.
>
> Formellement, pour un ensemble fini $E = \\{v_1, v_2, \\dots, v_m\\}$ sans valeur \`NULL\`, le prédicat \`IN\` équivaut à une disjonction d'égalités :
>
> $$
> x \\in E \\iff \\bigvee_{j=1}^{m} (x = v_j)
> $$
>
> **Théorème piège du \`NOT IN\` face à \`NULL\` (Logique ternaire) :**
> Par les lois de De Morgan :
> $$
> x \\notin \\{v_1, \\text{NULL}\\} \\iff (x \\neq v_1) \\land (x \\neq \\text{NULL})
> $$
> Pour toute valeur $x \\neq v_1$, $(x \\neq \\text{NULL})$ s'évalue à \`UNKNOWN\`, donc l'expression globale vaut $\\text{TRUE} \\land \\text{UNKNOWN} = \\text{UNKNOWN}$ ! Conséquence : **\`WHERE col NOT IN (..., NULL)\` renvoie systématiquement 0 ligne**.

#### 💻 Masterclass SQL

1. **Optimisation moteur** : SQLite trie en interne les constantes de la liste \`IN (...)\` pour réaliser une recherche dichotomique $\\mathcal{O}(\\log m)$ par ligne (ou exploite un index B-Tree), rendant \`IN\` aussi rapide et bien plus maintenable que $m$ clauses \`OR\`.
2. **Négation sécurisée** : utilisez \`NOT IN\` uniquement sur des listes littérales garanties sans \`NULL\` ; pour exclure des résultats d'une autre table, privilégiez toujours \`NOT EXISTS\`.
3. **Exactitude des libellés** : les chaînes dans \`IN (...)\` doivent respecter exactement la casse et les accents stockés.

\`\`\`sql
-- Comparaison de deux périls extrêmes : Bris de Glace vs Vol
SELECT
    sinistre_id,       -- Clé du sinistre
    nature_sinistre,   -- Nature appartenant à la liste finie
    cout_total         -- Montant indemnisé
FROM sinistres
WHERE nature_sinistre IN ('Bris de Glace', 'Vol');  -- Équivalent strict à deux OR
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre IN ('Bris de Glace', 'Vol');
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
502          Bris de Glace    420.0     
504          Vol              18500.0   
507          Bris de Glace    380.0
\`\`\`

> 🔍 **Lecture actuarielle :** Le rapprochement montre l'écart de sévérité typique en IARD auto : les \`Bris de Glace\` (\`502\`, \`507\`) coûtent autour de $400\\text{ EUR}$ (sinistres de fréquence), face à $18\\,500\\text{ EUR}$ pour un \`Vol\` (\`504\`, sinistre d'intensité).
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id` et `type_vehicule` en filtrant les véhicules appartenant à la liste `('Citadine', 'Berline')` via l'opérateur `IN`.",
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
### Filtrage d'Intervalles Fermés (\`BETWEEN\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Tranches d'âge et exercices de survenance**
>
> L'analyse actuarielle découpe continûment le risque en intervalles : classes d'âge conducteur ($[18, 24]$, $[25, 45]$, $[46, 65]$), tranches de puissance fiscale, ou fenêtres temporelles annuelles d'exercice de survenance pour construire les triangles de liquidation Chain-Ladder.
>
> En SQL, \`x BETWEEN a AND b\` teste l'appartenance à l'**intervalle fermé** $[a, b]$ :
>
> $$
> x \\in [a, b] \\iff (x \\ge a) \\land (x \\le b)
> $$
>
> Les **deux bornes $a$ et $b$ sont incluses**. Sa négation \`x NOT BETWEEN a AND b\` équivaut strictement à $(x < a) \\lor (x > b)$.
>
> **Piège temporel sur les horodatages (\`DATETIME\`) :** Sur une colonne contenant des dates pures ISO-8601 (\`'YYYY-MM-DD'\`), \`BETWEEN '2022-01-01' AND '2022-12-31'\` couvre exactement toute l'année 2022. Mais si la colonne contient une composante horaire (\`'2022-12-31 14:30:00'\`), la borne haute \`'2022-12-31'\` équivaut à \`'2022-12-31 00:00:00'\` et exclut la journée du 31 décembre ! En production sur timestamps, on préfère l'intervalle semi-ouvert $[a, b+1[$ (\`>= '2022-01-01' AND < '2023-01-01'\`).

#### 💻 Masterclass SQL

1. **Réécriture par le moteur** : SQLite traduit directement \`BETWEEN a AND b\` en \`>= a AND <= b\`, permettant un *Index Range Scan* très rapide sur B-Tree.
2. **Ordre obligatoire des bornes** : \`BETWEEN 45 AND 25\` devient \`age >= 45 AND age <= 25\`, ce qui est toujours \`FALSE\` et retourne **0 ligne** ! Placez toujours la borne inférieure en premier.
3. **Format ISO-8601** : la norme \`'YYYY-MM-DD'\` garantit que le tri alphabétique des chaînes coïncide exactement avec l'ordre chronologique réel.

\`\`\`sql
-- Extraction de l'exercice de survenance 2022 (année civile complète)
SELECT
    sinistre_id,       -- Identifiant du sinistre
    date_survenance,   -- Date ISO-8601 (YYYY-MM-DD)
    cout_total         -- Coût du dossier
FROM sinistres
WHERE date_survenance BETWEEN '2022-01-01' AND '2022-12-31';  -- Bornes inclusives
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, date_survenance, cout_total FROM sinistres WHERE date_survenance BETWEEN '2022-01-01' AND '2022-12-31';
sinistre_id  date_survenance  cout_total
-----------  ---------------  ----------
502          2022-04-02       420.0     
503          2022-11-19       5000.0    
505          2022-09-08       11700.0   
507          2022-02-11       380.0     
508          2022-06-30       2100.0
\`\`\`

> 🔍 **Lecture actuarielle :** 5 des 8 sinistres sont survenus au cours de l'exercice 2022, pour une charge totale de $19\\,600\\text{ EUR}$ (dont le dossier \`505\` encore \`En cours\` qui nécessitera une provision PSAP).
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id` et `age` pour les conducteurs dont l'âge est compris entre 25 et 45 ans inclus (`WHERE age BETWEEN 25 AND 45`).",
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
### Ordonnancement Relationnel (\`ORDER BY\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier & Théorie relationnelle : Imposer un ordre déterministe**
>
> En vertu du modèle relationnel de Codd, une table SQL est un **multi-ensemble mathématique non ordonné**. Aucun SGBD ne garantit l'ordre de sortie d'une requête sans \`ORDER BY\` : une réorganisation physique des pages disque, un index secondaire ou une exécution parallèle peuvent permuter les lignes d'un jour à l'autre.
>
> L'opérateur de tri $\\tau_{A_1^{d_1}, \\dots, A_k^{d_k}}(R)$ transforme la relation non ordonnée en une **séquence ordonnée** selon un ordre lexicographique multi-clés ($d_j \\in \\{\\text{ASC}, \\text{DESC}\\}$).
>
> **Gestion des \`NULL\` au tri :**
> En logique SQL, l'ordre relatif de \`NULL\` dépend du SGBD ! En SQLite (et MySQL), \`NULL\` est considéré inférieur à toute valeur : il apparaît **en premier** avec \`ASC\` et **en dernier** avec \`DESC\`. (À l'inverse, PostgreSQL et Oracle placent \`NULL\` en dernier en \`ASC\` et en premier en \`DESC\` !). Depuis SQLite 3.30, \`NULLS FIRST\` et \`NULLS LAST\` permettent de lever toute ambiguïté.

#### 💻 Masterclass SQL

1. **Position dans le cycle logique** : \`FROM\` $\\to$ \`WHERE\` $\\to$ \`SELECT\` $\\to$ \`ORDER BY\`. Comme \`ORDER BY\` s'exécute **après** \`SELECT\`, c'est la première clause où vous pouvez utiliser un alias créé dans le \`SELECT\`.
2. **Coût algorithmique** : sans index trié sur la clé, \`ORDER BY\` effectue un tri complet en $\\mathcal{O}(N \\log N)$ (mémoire ou fichier temporaire sur disque).
3. **Tri multi-colonnes** : \`ORDER BY region ASC, prime_annuelle DESC\` classe d'abord par ordre alphabétique de région, puis départage les lignes d'une même région par prime décroissante.

\`\`\`sql
-- Classement complet des sinistres du plus coûteux au moins coûteux
SELECT
    sinistre_id,       -- Identifiant du dossier
    nature_sinistre,   -- Type de péril
    cout_total         -- Clé de tri numérique
FROM sinistres
ORDER BY cout_total DESC;  -- DESC = décroissant (ASC par défaut si omis)
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres ORDER BY cout_total DESC;
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
504          Vol              18500.0   
505          Collision        11700.0   
506          Incendie         9400.0    
503          Collision        5000.0    
508          Collision        2100.0    
501          Collision        1450.0    
502          Bris de Glace    420.0     
507          Bris de Glace    380.0
\`\`\`

> 🔍 **Lecture actuarielle :** Le tri décroissant met instantanément en évidence la queue de distribution des sinistres : les 3 premiers dossiers (\`504\`, \`505\`, \`506\`) dépassent chacun \`9400.0\` EUR alors que la queue basse (\`502\`, \`507\`) reste sous \`450.0\` EUR.
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id` et `prime_annuelle`, et triez toutes les lignes par `prime_annuelle` décroissante (`ORDER BY prime_annuelle DESC`).",
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
### Troncature Top-N & Déterminisme (\`LIMIT\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ERM : Audit des plus gros risques (*Large Loss Review*)**
>
> En gestion des risques et en réassurance, l'actuaire inspecte régulièrement le Top-$N$ des contrats présentant la plus forte prime ou des sinistres les plus sévères, afin de vérifier la tarification individuelle, la qualité des provisions dossier par dossier et les engagements envers les réassureurs.
>
> Formellement, la composition $\\text{Limit}_k(\\tau_A(R))$ tronque une séquence triée à ses $k$ premiers éléments.
>
> **Optimisation algorithmique (*Top-N Heap Sort*) :** Au lieu de trier intégralement $N$ millions de lignes en $\\mathcal{O}(N \\log N)$, les moteurs SQL optimisés maintiennent un tas binaire borné de taille $k$, ramenant la complexité à $\\mathcal{O}(N \\log k)$ en temps et $\\mathcal{O}(k)$ en mémoire !
>
> **Règle absolue de déterminisme :** Utiliser \`LIMIT\` sans \`ORDER BY\` n'a aucun sens statistique (le SGBD renvoie $k$ lignes arbitraires). En présence possible d'ex-aequo à la frontière du rang $k$, on ajoute toujours une clé unique en bris d'égalité (\`ORDER BY prime_annuelle DESC, police_id ASC\`).

#### 💻 Masterclass SQL

1. **Clauses finales** : \`LIMIT k\` (éventuellement suivi de \`OFFSET p\` pour sauter $p$ lignes en pagination) s'exécute en toute **dernière** position après \`ORDER BY\`.
2. **Troncature stricte vs ex-aequo** : \`LIMIT 3\` renvoie **au maximum 3 lignes**, même si la 3e et la 4e ont exactement le même montant. Si vous souhaitez inclure tous les ex-aequo du podium, utilisez une fenêtre \`DENSE_RANK()\` ou \`RANK()\`.
3. **Standard SQL** : \`LIMIT\` est standard en SQLite, PostgreSQL et MySQL (équivalent à \`FETCH FIRST 3 ROWS ONLY\` en SQL ANSI / Oracle et \`TOP 3\` en SQL Server).

\`\`\`sql
-- Extraction du podium des 3 sinistres les plus coûteux du portefeuille
SELECT
    sinistre_id,       -- Clé du sinistre
    police_id,         -- Police impliquée
    nature_sinistre,   -- Péril
    cout_total         -- Montant classé
FROM sinistres
ORDER BY cout_total DESC  -- Impératif avant LIMIT pour un Top-N déterministe
LIMIT 3;                  -- Ne conserve que les 3 premiers enregistrements
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, police_id, nature_sinistre, cout_total FROM sinistres ORDER BY cout_total DESC LIMIT 3;
sinistre_id  police_id  nature_sinistre  cout_total
-----------  ---------  ---------------  ----------
504          1004       Vol              18500.0   
505          1007       Collision        11700.0   
506          1008       Incendie         9400.0
\`\`\`

> 🔍 **Lecture actuarielle :** Ces 3 sinistres majeurs (\`18500.0\` + \`11700.0\` + \`9400.0\`) totalisent $39\\,600\\text{ EUR}$, soit $80.9\\%$ de toute la charge indemnisée ($48\\,950\\text{ EUR}$) pour seulement $37.5\\%$ des dossiers — illustration classique de la règle de Pareto en IARD.
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id` et `prime_annuelle`, triez les résultats par `prime_annuelle DESC` et limitez la sortie aux 3 primes les plus élevées (`LIMIT 3`).",
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
### Mesure d'Exposition & Agrégation de Cardinalité (\`COUNT\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Mesurer l'exposition sans double-comptage**
>
> En actuariat non-vie, toute modélisation de fréquence $\\hat{\\lambda} = \\frac{N_{\\text{sin}}}{E}$ repose sur deux décomptes exacts : le nombre de sinistres au numérateur ($N_{\\text{sin}}$) et le nombre de contrats exposés au dénominateur ($E$). Une confusion sur la façon dont SQL dénombre les lignes ou les \`NULL\` fausse immédiatement la prime pure !
>
> La fonction d'agrégation $\\gamma_{\\text{COUNT}}$ admet **trois formes aux sémantiques mathématiquement distinctes** sur une table $R$ de $n$ lignes :
> 1. **\`COUNT(*)\`** : cardinalité brute de la relation ($n$), incluant les lignes contenant des valeurs \`NULL\`.
> 2. **\`COUNT(col)\`** : compte uniquement les valeurs **non nulles** :
>    $$
>    \\text{COUNT}(\\text{col}) = \\sum_{i=1}^{n} \\mathbf{1}_{\\text{col}_i \\text{ IS NOT NULL}}
>    $$
> 3. **\`COUNT(DISTINCT col)\`** : cardinalité de l'ensemble image unique (hors \`NULL\`), éliminant les doublons multi-événements.

> 📊 **Lien direct Tarification & Provisionnement :**
> Sur la table \`sinistres\`, \`COUNT(*)\` donne le nombre de sinistres ($8$), \`COUNT(cout_corporel)\` donne le nombre de dossiers comportant un volet corporel ($2$), et \`COUNT(DISTINCT police_id)\` donne le nombre de contrats distincts touchés ($7$, car une police a sinistré 2 fois).

#### 💻 Masterclass SQL

1. **Règle d'homogénéité d'agrégation** : sans clause \`GROUP BY\`, \`COUNT()\` réduit toute la table en **une seule ligne**. Il est interdit en SQL standard de placer dans le même \`SELECT\` une colonne individuelle non agrégée (ex. \`SELECT police_id, COUNT(*)\`).
2. **Coût de \`DISTINCT\`** : \`COUNT(*)\` est très rapide, tandis que \`COUNT(DISTINCT col)\` force un tri ou une table de hachage pour dédoublonner.
3. **Table vide** : sur une table ne contenant aucune ligne après \`WHERE\`, \`COUNT(*)\` retourne \`0\` (jamais \`NULL\`).

\`\`\`sql
-- Comparaison des 3 formes de comptage sur la table sinistres
SELECT
    COUNT(*) AS nb_sinistres,                    -- Total des dossiers déclarés
    COUNT(cout_corporel) AS nb_corporels,        -- Ignore les 6 dossiers sans corporel (NULL)
    COUNT(DISTINCT police_id) AS nb_polices_sinistrees  -- Dédoublonne les polices multi-sinistrées
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT COUNT(*) AS nb_sinistres, COUNT(cout_corporel) AS nb_corporels, COUNT(DISTINCT police_id) AS nb_polices_sinistrees FROM sinistres;
nb_sinistres  nb_corporels  nb_polices_sinistrees
------------  ------------  ---------------------
8             2             7
\`\`\`

> 🔍 **Lecture actuarielle :** Le portefeuille compte \`8\` sinistres au total, dont seulement \`2\` dossiers corporels (\`503\` et \`505\`), répartis sur \`7\` polices distinctes (la police \`1003\` étant multi-sinistrée).
        `,
        taskMarkdown: "Depuis la table `assures`, comptez le nombre total de polices souscrites à l'aide de `COUNT(*)` et renommez le résultat avec l'alias exact `nb_total_polices`.",
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
### Sommes, Moyennes & Piège Statistique du \`NULL\` (\`SUM, AVG\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & Comptabilité : Masse de primes et sévérité moyenne**
>
> \`SUM\` et \`AVG\` produisent les agrégats financiers fondamentaux : le volume total de cotisations encaissées (chiffre d'affaires technique) ou de sinistres indemnisés, et la moyenne empirique (prime commerciale moyenne ou coût moyen d'un sinistre).
>
> Formellement, sur l'ensemble des $n_{\\text{nn}}$ valeurs **non nulles** d'une colonne $X$ :
>
> $$
> \\text{SUM}(X) = \\sum_{i : x_i \\neq \\text{NULL}} x_i, \\qquad \\text{AVG}(X) = \\frac{\\text{SUM}(X)}{\\text{COUNT}(X)} = \\frac{1}{n_{\\text{nn}}} \\sum_{i : x_i \\neq \\text{NULL}} x_i
> $$
>
> **Théorème de vigilance \`NULL\` :** Comme \`AVG(X)\` divise par \`COUNT(X)\` et **non par \`COUNT(*)\`**, les \`NULL\` sont écartés du dénominateur ! Sur \`sinistres\`, \`AVG(cout_corporel)\` vaut $\\frac{1200 + 4500}{2} = 2\\,850\\text{ EUR}$ (coût corporel moyen *sachant corporel*), alors que \`AVG(COALESCE(cout_corporel, 0))\` vaut $\\frac{5700}{8} = 712.50\\text{ EUR}$ (coût corporel moyen *par sinistre déclaré*) — un écart d'un facteur **4** !

> 📊 **Lien direct Tarification :**
> En assurance auto, la charge totale se décompose par la relation fondamentale $\\text{SUM}(\\text{cout}) = \\text{COUNT}(*) \\times \\text{AVG}(\\text{cout})$.

#### 💻 Masterclass SQL

1. **Table ou filtre vide** : contrairement à \`COUNT(*)\` qui renvoie \`0\`, \`SUM(col)\` et \`AVG(col)\` renvoient **\`NULL\`** si aucune ligne n'est sélectionnée ! En production, enveloppez toujours par \`COALESCE(SUM(col), 0.0)\`.
2. **Arrondi financier** : \`ROUND(valeur, 2)\` s'applique toujours *après* l'agrégation (jamais \`AVG(ROUND(...))\`) pour éviter la dérive d'arrondi.
3. **Typage SQLite** : \`AVG()\` renvoie toujours un nombre flottant \`REAL\`, même sur une colonne d'entiers comme \`age\`.

\`\`\`sql
-- Audit de charge globale et démonstration de l'impact des NULL sur AVG()
SELECT
    ROUND(SUM(cout_total), 2) AS charge_totale,           -- Masse totale indemnisée
    ROUND(AVG(cout_total), 2) AS severite_moyenne,        -- Sévérité moyenne des 8 sinistres
    ROUND(AVG(cout_corporel), 2) AS moy_corp_non_null,    -- Moyenne sur les 2 corporels seuls
    ROUND(AVG(COALESCE(cout_corporel, 0)), 2) AS moy_corp_tous  -- Moyenne rapportée aux 8 dossiers
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT ROUND(SUM(cout_total), 2) AS charge_totale, ROUND(AVG(cout_total), 2) AS severite_moyenne, ROUND(AVG(cout_corporel), 2) AS moy_corp_non_null, ROUND(AVG(COALESCE(cout_corporel, 0)), 2) AS moy_corp_tous FROM sinistres;
charge_totale  severite_moyenne  moy_corp_non_null  moy_corp_tous
-------------  ----------------  -----------------  -------------
48950.0        6118.75           2850.0             712.5
\`\`\`

> 🔍 **Lecture actuarielle :** La charge totale s'élève à \`48950.0\` EUR pour une sévérité moyenne de \`6118.75\` EUR. On observe directement le facteur 4 entre \`moy_corp_non_null\` (\`2850.0\` EUR) et \`moy_corp_tous\` (\`712.5\` EUR) selon l'inclusion ou non des \`NULL\`.
        `,
        taskMarkdown: "Depuis la table `assures`, calculez la somme totale des primes arrondie à 2 décimales sous l'alias exact `total_primes` (`ROUND(SUM(prime_annuelle), 2) AS total_primes`) et la prime moyenne arrondie à 2 décimales sous l'alias exact `prime_moyenne` (`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne`).",
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
### Bornes du Support Empirique & Qualité de Données (\`MIN, MAX\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Audit des extrêmes et contrôle de vraisemblance**
>
> Avant de calibrer un modèle de tarification ou un générateur de scénarios économiques (GSE) en ALM, l'actuaire vérifie les bornes du support empirique : aucune prime ne doit être négative ou nulle, le bonus-malus français doit rester contenu dans l'intervalle réglementaire $[0.50, 3.50]$, et l'amplitude des taux obligataires éclaire la calibration des chocs Solvabilité II.
>
> Formellement, pour les statistiques d'ordre $x_{(1)} \\le x_{(2)} \\le \\dots \\le x_{(n)}$ calculées sur les valeurs non nulles :
>
> $$
> \\text{MIN}(X) = x_{(1)}, \\qquad \\text{MAX}(X) = x_{(n)}, \\qquad \\text{Étendue} = x_{(n)} - x_{(1)}
> $$
>
> \`MIN\` et \`MAX\` opèrent sur tout type totalement ordonné : nombres (\`REAL\`, \`INTEGER\`), dates ISO (\`DATE\`) et chaînes (\`TEXT\` par ordre lexicographique), en ignorant les \`NULL\`.

> 📊 **Lien direct ALM :**
> Mesurer $\\text{MAX}(r) - \\text{MIN}(r)$ sur \`macro_taux\` quantifie l'amplitude historique réelle du cycle de taux 2020–2023 pour calibrer les stress-tests de duration obligataire.

#### 💻 Masterclass SQL

1. **Optimisation B-Tree $\\mathcal{O}(\\log N)$** : lorsque la colonne est indexée, \`MIN(col)\` et \`MAX(col)\` lisent instantanément l'extrémité gauche ou droite de l'index sans scanner la table entière.
2. **Piège d'association d'identifiant** : n'écrivez jamais \`SELECT periode, MAX(euribor_3m) FROM macro_taux\` en espérant obtenir proprement le trimestre du pic — ce mélange sans \`GROUP BY\` est interdit en SQL standard (PostgreSQL, Oracle, SQL Server). Pour récupérer la ligne associée à un extremum, utilisez \`ORDER BY col DESC LIMIT 1\` ou \`RANK()\`.
3. **Cas dégénéré** : si toutes les valeurs sont \`NULL\`, \`MIN\` et \`MAX\` renvoient \`NULL\`.

\`\`\`sql
-- Mesure de l'amplitude historique des taux courts et longs sur 2020-2023
SELECT
    MIN(euribor_3m) AS euribor_min,   -- Plancher des taux monétaires BCE
    MAX(euribor_3m) AS euribor_max,   -- Plafond atteint fin 2023
    MIN(oat_10y) AS oat_min,          -- Taux souverain 10 ans minimal
    MAX(oat_10y) AS oat_max           -- Pic de taux souverain 10 ans
FROM macro_taux;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT MIN(euribor_3m) AS euribor_min, MAX(euribor_3m) AS euribor_max, MIN(oat_10y) AS oat_min, MAX(oat_10y) AS oat_max FROM macro_taux;
euribor_min  euribor_max  oat_min  oat_max
-----------  -----------  -------  -------
-0.57        3.92         -0.34    3.4
\`\`\`

> 🔍 **Lecture ALM :** L'Euribor 3 mois a basculé de \`-0.57\` % à \`+3.92\` % (soit $+449$ points de base d'amplitude), pendant que l'OAT 10 ans progressait de \`-0.34\` % à \`+3.40\` % ($+374$ pb). Un choc d'une telle ampleur justifie une gestion active de la duration actif-passif.
        `,
        taskMarkdown: "Depuis la table `assures`, affichez la prime annuelle minimale sous l'alias exact `prime_min` (`MIN(prime_annuelle) AS prime_min`) et la prime annuelle maximale sous l'alias exact `prime_max` (`MAX(prime_annuelle) AS prime_max`).",
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
### Agrégation Partitionnée & Zonier (\`GROUP BY\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Construire le zonier et la segmentation tarifaire**
>
> En tarification automobile et MRH, une moyenne globale masque l'hétérogénéité du portefeuille. L'actuaire découpe donc la table en strates homogènes (région, tranche d'âge, péril) afin de mesurer l'exposition et la charge de sinistralité de chaque cellule tarifaire.
>
> En algèbre relationnelle étendue, \`GROUP BY\` correspond à l'opérateur de **groupement** $\\,_G \\gamma_{F(A)}(R)$. Le moteur définit la relation d'équivalence $t_1 \\sim t_2 \\iff t_1[G] = t_2[G]$ qui partitionne la table $R$ en $K$ sous-ensembles disjoints :
>
> $$
> R = \\bigsqcup_{g=1}^{K} R_g
> $$
>
> Sur chaque bloc $R_g$, chaque fonction d'agrégation (\`COUNT\`, \`SUM\`, \`AVG\`) compresse les $|R_g|$ lignes individuelles en **une seule ligne synthétique**.
> **Propriété sur \`NULL\` :** Bien que \`NULL = NULL\` soit \`UNKNOWN\` dans un \`WHERE\`, \`GROUP BY\` rassemble tous les \`NULL\` d'une colonne dans un unique groupe dédié.
>
> **Règle d'intégrité fonctionnelle :** Toute colonne projetée dans \`SELECT\` hors fonction d'agrégation **doit impérativement figurer dans \`GROUP BY\`**.

![Mécanisme GROUP BY & Agrégation](/images/theory/fig_v1_sql_groupby.png)

> 🔍 **Comprendre ce graphique : Le paradigme Split - Apply - Combine**
>
> - **Les points bleus (lignes brutes)** : Chaque point représente un contrat individuel avec sa prime d'assurance propre.
> - **Le partitionnement (\`GROUP BY\`)** : Le moteur SQL isole les contrats dans des bacs étanches par modalité de région (Nord, Sud, Ouest).
> - **L'agrégation (\`AVG()\`)** : Pour chaque bac, la fonction calcule la moyenne arithmétique et compresse toutes les lignes du groupe en **une seule barre synthétique**.

> ✏️ **Exemple chiffré pas-à-pas (Table miniature de 4 assurés) :**
> Soient 4 polices : \`IDF\` ($900\\text{ EUR}$), \`PACA\` ($650\\text{ EUR}$), \`IDF\` ($1\\,100\\text{ EUR}$), \`PACA\` ($750\\text{ EUR}$).
> 1. **Partitionnement (\`GROUP BY region\`)** : \`'IDF'\` $\\to \\{900, 1100\\}$ ($N=2$) ; \`'PACA'\` $\\to \\{650, 750\\}$ ($N=2$).
> 2. **Agrégation** : \`'IDF'\` obtient Effectif $= 2$, Moyenne $= 1\\,000\\text{ EUR}$ ; \`'PACA'\` obtient Effectif $= 2$, Moyenne $= 700\\text{ EUR}$.
> 3. **Projection finale** : exactement $K = 2$ lignes retournées.

#### 💻 Masterclass SQL

1. **Cycle d'exécution logique** : \`FROM\` $\\to$ \`WHERE\` (filtre les lignes brutes *avant* partitionnement) $\\to$ \`GROUP BY\` $\\to$ \`HAVING\` $\\to$ \`SELECT\` $\\to$ \`ORDER BY\`.
2. **Moteurs d'exécution** : selon la taille de la table et les index, SQLite utilise soit un *Sort-Group* (tri $\\mathcal{O}(N \\log N)$ puis agrégation séquentielle), soit un *Hash Aggregate* (table de hachage en mémoire en $\\mathcal{O}(N)$ dans les moteurs analytiques).
3. **Groupement multi-colonnes** : \`GROUP BY region, type_vehicule\` crée une ligne par couple observé \`(region, type_vehicule)\`.

\`\`\`sql
-- Ventilation de la fréquence de dossiers et de la charge par péril
SELECT
    nature_sinistre,                      -- Clé de partition (figure dans GROUP BY)
    COUNT(*) AS nb_sinistres,             -- Effectif des sinistres du groupe
    ROUND(SUM(cout_total), 2) AS charge_totale  -- Somme des coûts du péril
FROM sinistres
GROUP BY nature_sinistre                  -- Crée un bac par modalité unique
ORDER BY charge_totale DESC;              -- Classe les périls du plus coûteux au plus léger
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT nature_sinistre, COUNT(*) AS nb_sinistres, ROUND(SUM(cout_total), 2) AS charge_totale FROM sinistres GROUP BY nature_sinistre ORDER BY charge_totale DESC;
nature_sinistre  nb_sinistres  charge_totale
---------------  ------------  -------------
Collision        4             20250.0      
Vol              1             18500.0      
Incendie         1             9400.0       
Bris de Glace    2             800.0
\`\`\`

> 🔍 **Lecture actuarielle :** La \`Collision\` domine en charge totale (\`20250.0\` EUR sur \`4\` sinistres), suivie de très près par le \`Vol\` (\`18500.0\` EUR sur un seul dossier !), tandis que le \`Bris de Glace\` (\`800.0\` EUR) représente un sinistre de pure fréquence à faible sévérité.
        `,
        taskMarkdown: "Depuis la table `assures`, regroupez les contrats par `region` (`GROUP BY region`) et sélectionnez la colonne `region` ainsi que le nombre de polices de chaque région sous l'alias exact `nb_polices` (`COUNT(*) AS nb_polices`).",
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
### Espérance Conditionnelle & Segmentation Tarifaire (\`GROUP BY + AVG\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Vérifier le pouvoir discriminant d'une variable tarifaire**
>
> En tarification, calculer la moyenne d'une prime ou d'un coût de sinistre par segment (\`type_vehicule\`, \`type_contrat\`, tranche d'âge) revient à estimer empiriquement l'**espérance conditionnelle** :
>
> $$
> \\hat{\\mu}(v) = \\widehat{\\mathbb{E}}[\\text{prime} \\mid X = v] = \\frac{1}{n_v} \\sum_{i : x_i = v} \\text{prime}_i
> $$
>
> Le fondement mathématique de la segmentation actuarielle repose sur le **théorème de décomposition de la variance (Huygens / ANOVA)** :
>
> $$
> \\operatorname{Var}(Y) = \\underbrace{\\operatorname{Var}(\\mathbb{E}[Y \\mid X])}_{\\text{Variance expliquée inter-segments}} + \\underbrace{\\mathbb{E}[\\operatorname{Var}(Y \\mid X)]}_{\\text{Variance résiduelle intra-segment}}
> $$
>
> Plus l'écart entre $\\hat{\\mu}(\\text{Sportive})$ et $\\hat{\\mu}(\\text{Citadine})$ est important, plus la part inter-segments est grande : la variable $X$ est **statistiquement discriminante** et justifie un coefficient multiplicateur dédié dans le tarif GLM (où $\\pi(x) = \\mathbb{E}[N \\mid x] \\cdot \\mathbb{E}[C \\mid x]$).

#### 💻 Masterclass SQL

1. **Précision de l'arrondi** : appliquez toujours \`ROUND(AVG(col), 2)\` **à l'extérieur** de \`AVG\`. Écrire \`AVG(ROUND(col, 2))\` arrondit chaque observation avant sommation et accumule une erreur de troncature.
2. **Agrégats multiples dans la même passe** : calculer \`COUNT(*)\`, \`AVG(prime_annuelle)\` et \`AVG(bonus_malus)\` simultanément ne coûte qu'un seul balayage de table.
3. **Piège d'interprétation (Effet de structure)** : une formule \`Tiers Simple\` peut afficher une prime moyenne élevée si elle attire des jeunes conducteurs malussés (effet de sélection ou de structure d'âge/CRM) !

\`\`\`sql
-- Audit tarifaire croisé par formule de contrat : prime moyenne et CRM moyen
SELECT
    type_contrat,                              -- Formule souscrite (clé de groupe)
    COUNT(*) AS nb_polices,                    -- Taille de l'échantillon par formule
    ROUND(AVG(prime_annuelle), 2) AS prime_moy, -- Espérance conditionnelle de prime
    ROUND(AVG(bonus_malus), 2) AS crm_moy      -- Profil de bonus-malus moyen du segment
FROM assures
GROUP BY type_contrat
ORDER BY prime_moy DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT type_contrat, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moy, ROUND(AVG(bonus_malus), 2) AS crm_moy FROM assures GROUP BY type_contrat ORDER BY prime_moy DESC;
type_contrat  nb_polices  prime_moy  crm_moy
------------  ----------  ---------  -------
Tous Risques  7           1068.83    0.75   
Tiers Simple  2           1035.0     1.0    
Tiers Étendu  3           585.0      0.51
\`\`\`

> 🔍 **Lecture actuarielle :** Fait remarquable sur les vraies données : la formule \`Tiers Simple\` (\`1035.0\` EUR) est presque aussi chère que le \`Tous Risques\` (\`1068.83\` EUR) ! L'indicateur \`crm_moy\` révèle pourquoi : les assurés au Tiers Simple ont un bonus-malus moyen de \`1.0\` (conducteurs jeunes ou malussés), contre \`0.51\` pour le \`Tiers Étendu\`.
        `,
        taskMarkdown: "Depuis la table `assures`, regroupez les contrats par `type_vehicule` (`GROUP BY type_vehicule`) et affichez `type_vehicule` ainsi que la prime annuelle moyenne arrondie à 2 décimales sous l'alias exact `prime_moyenne` (`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne`).",
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
### Filtrage Post-Agrégation & Crédibilité Actuarielle (\`HAVING\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Crédibilité statistique des segments (\`Bühlmann\`)**
>
> En tarification et en suivi de sinistralité, interpréter une cellule ne comptant qu'un seul contrat ($n_g = 1$) est statistiquement dangereux : la variance de la fréquence empirique $\\operatorname{Var}(\\hat{\\lambda}_g) = \\frac{\\lambda_g}{n_g}$ explose lorsque $n_g$ est petit. Avant d'ajuster un tarif par région ou péril, l'actuaire applique un filtre de **volume minimal d'exposition** (crédibilité) : c'est le rôle de \`HAVING\`.
>
> En algèbre relationnelle, \`HAVING\` applique une restriction **sur la table déjà agrégée** :
>
> $$
> \\sigma_{P_{\\text{agg}}}\\!\\left(\\,_G \\gamma_{F(A)}(R)\\right)
> $$
>
> **Pipeline logique du filtrage en deux temps :**
>
> $$
> \\text{Table } R \\xrightarrow{\\text{WHERE}} \\text{Lignes retenues} \\xrightarrow{\\text{GROUP BY}} \\text{Groupes } R_g \\xrightarrow{\\text{HAVING}} \\text{Groupes crédibles}
> $$
>
> - **\`WHERE\`** teste des prédicats sur chaque **ligne individuelle** *avant* tout regroupement (interdiction d'y mettre \`COUNT(*)\` ou \`SUM()\`).
> - **\`HAVING\`** teste des prédicats sur les **groupes formés** *après* \`GROUP BY\`.

#### 💻 Masterclass SQL

1. **Règle d'optimisation (\`WHERE\` avant \`HAVING\`)** : si votre condition porte sur une colonne brute (ex. \`statut_dossier = 'Clos'\`), placez-la impérativement dans \`WHERE\`, jamais dans \`HAVING\`, pour éliminer les lignes inutiles avant le coût du tri/hachage de \`GROUP BY\`.
2. **Portabilité SQL ANSI sur les alias** : comme \`HAVING\` s'exécute **avant** \`SELECT\`, les moteurs stricts (PostgreSQL, Oracle, SQL Server) rejettent \`HAVING nb_polices >= 2\`. Répétez toujours la fonction d'agrégation complète \`HAVING COUNT(*) >= 2\`.
3. **Combinaison \`WHERE\` + \`HAVING\`** : parfaitement légale et fréquente (ex. filtrer une année dans \`WHERE\`, puis exiger un minimum de dossiers dans \`HAVING\`).

\`\`\`sql
-- Conservation des seuls périls présentant au moins 2 sinistres observés
SELECT
    nature_sinistre,                      -- Dimension de groupement
    COUNT(*) AS nb_dossiers,              -- Nombre de dossiers dans le groupe
    ROUND(SUM(cout_total), 2) AS charge_totale
FROM sinistres
GROUP BY nature_sinistre
HAVING COUNT(*) >= 2;                     -- Filtre post-agrégation sur l'effectif
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT nature_sinistre, COUNT(*) AS nb_dossiers, ROUND(SUM(cout_total), 2) AS charge_totale FROM sinistres GROUP BY nature_sinistre HAVING COUNT(*) >= 2;
nature_sinistre  nb_dossiers  charge_totale
---------------  -----------  -------------
Bris de Glace    2            800.0        
Collision        4            20250.0
\`\`\`

> 🔍 **Lecture actuarielle :** Seuls \`Bris de Glace\` (\`2\` dossiers) et \`Collision\` (\`4\` dossiers) dépassent le seuil de crédibilité de 2 observations. \`Vol\` et \`Incendie\` (1 dossier chacun) sont écartés par \`HAVING\`.
        `,
        taskMarkdown: "Depuis la table `assures`, regroupez par `region`, sélectionnez `region` et `COUNT(*) AS nb_polices`, puis filtrez avec `HAVING COUNT(*) >= 2` pour ne conserver que les régions ayant au moins 2 polices souscrites.",
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
### Discrétisation & Logique Conditionnelle (\`CASE WHEN\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Transformer du continu en classes homogènes**
>
> Les modèles actuariels et les tableaux de bord de pilotage nécessitent souvent de discrétiser des grandeurs continues : découper une prime annuelle en segments commerciaux (\`'Élevée'\` vs \`'Standard'\`), ventiler les sinistres en tranches de gravité (\`'Attritionnel'\`, \`'Moyen'\`, \`'Grave'\`) pour la réassurance, ou classer les trimestres ALM en régimes de taux (\`euribor_3m < 0\` vs \`>= 0\`).
>
> Mathématiquement, \`CASE WHEN\` construit une fonction en escalier via des indicatrices sur une partition séquentielle d'événements $A_1, \\dots, A_m$ :
>
> $$
> f(x) = \\sum_{j=1}^{m} v_j \\mathbf{1}_{x \\in A_j \\setminus \\bigcup_{k < j} A_k} + v_{\\text{else}} \\mathbf{1}_{x \\notin \\bigcup_{j=1}^{m} A_j}
> $$
>
> **Évaluation séquentielle court-circuit :** Le moteur teste chaque \`WHEN\` dans l'ordre d'écriture et retourne immédiatement le \`THEN\` de la **première** condition vraie. Si aucun \`WHEN\` n'est satisfait et que \`ELSE\` est omis, l'expression retourne \`NULL\`.

#### 💻 Masterclass SQL

1. **Piège critique de l'ordre des seuils** : si vous écrivez \`WHEN cout_total >= 1000 THEN 'Moyen' WHEN cout_total >= 5000 THEN 'Grave'\`, un sinistre à \`18500.0\` satisfait d'abord \`>= 1000\` et sera classé à tort en \`'Moyen'\` ! Pour des seuils numériques croissants, testez toujours **du plus élevé au plus bas** (ou bornez avec \`BETWEEN\`).
2. **Clauses obligatoires** : toute expression commence par \`CASE\`, enchaîne un ou plusieurs \`WHEN ... THEN ...\`, optionnellement \`ELSE ...\`, et se termine impérativement par \`END\`.
3. **Agrégation conditionnelle (Tableau croisé)** : \`SUM(CASE WHEN type_contrat = 'Tous Risques' THEN 1 ELSE 0 END)\` permet de calculer des compteurs par modalité en colonnes.

\`\`\`sql
-- Classification des sinistres par tranche de gravité actuarielle
SELECT
    sinistre_id,
    cout_total,
    CASE
        WHEN cout_total >= 5000 THEN 'Grave'         -- Évalué en premier (>= 5000)
        WHEN cout_total >= 1000 THEN 'Moyen'         -- Puis entre 1000 et 4999.99
        ELSE 'Attritionnel'                          -- Tout le reste (< 1000)
    END AS tranche_gravite
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, cout_total, CASE WHEN cout_total >= 5000 THEN 'Grave' WHEN cout_total >= 1000 THEN 'Moyen' ELSE 'Attritionnel' END AS tranche_gravite FROM sinistres;
sinistre_id  cout_total  tranche_gravite
-----------  ----------  ---------------
501          1450.0      Moyen          
502          420.0       Attritionnel   
503          5000.0      Grave          
504          18500.0     Grave          
505          11700.0     Grave          
506          9400.0      Grave          
507          380.0       Attritionnel   
508          2100.0      Moyen
\`\`\`

> 🔍 **Lecture actuarielle :** La ventilation sépare proprement les 4 sinistres \`Grave\` (\`503\`, \`504\`, \`505\`, \`506\`), 2 dossiers \`Moyen\` (\`501\`, \`508\`) et 2 \`Attritionnel\` (\`502\`, \`507\`).
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id`, `prime_annuelle` et créez une colonne avec l'alias exact `categorie_prime` valant `'Élevée'` si `prime_annuelle > 1000` et `'Standard'` sinon (`CASE WHEN prime_annuelle > 1000 THEN 'Élevée' ELSE 'Standard' END AS categorie_prime`).",
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
### Traitement des Valeurs Manquantes & Imputation (\`COALESCE\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Éviter l'effacement silencieux des sinistres matériels**
>
> Dans notre table \`sinistres\`, un sinistre sans dommage corporel enregistre \`cout_corporel = NULL\`. Si un actuaire additionne directement dommage matériel et corporel (\`cout_dommages_materiels + cout_corporel\`) sans imputation, les 6 dossiers purement matériels produisent \`NULL\` et disparaissent des sommes comptables !
>
> En logique ternaire de Kleene et en arithmétique SQL, \`NULL\` est un **élément absorbant** :
>
> $$
> \\forall x \\in \\mathbb{R}, \\quad x + \\text{NULL} = \\text{NULL}, \\qquad (x = \\text{NULL}) \\equiv \\text{UNKNOWN}
> $$
>
> La fonction variadique SQL standard \`COALESCE(e_1, e_2, \\dots, e_k)\` parcourt ses arguments de gauche à droite et retourne la **première expression non nulle** (\`IS NOT NULL\`), ou \`NULL\` si toutes le sont.
>
> **Vigilance Provisionnement (PSAP / IBNR) :** Imputer \`NULL\` à \`0.0\` n'est économiquement valide que si \`NULL\` signifie **absence avérée de préjudice corporel** (zéro structurel). Si un sinistre corporel est \`'En cours'\` d'expertise médicale et pas encore chiffré (\`NULL\` par manque d'information), remplacer \`NULL\` par \`0.0\` sous-estimerait gravement les provisions techniques !

#### 💻 Masterclass SQL

1. **Tester un \`NULL\` dans \`WHERE\`** : \`WHERE cout_corporel = NULL\` ne renvoie **jamais** aucune ligne (car \`NULL = NULL\` vaut \`UNKNOWN\`). Utilisez toujours \`IS NULL\` ou \`IS NOT NULL\`.
2. **\`COALESCE\` vs \`IFNULL\`** : privilégiez \`COALESCE\` (norme SQL ANSI reconnue partout, accepte $k \\ge 2$ arguments en cascade : \`COALESCE(val_expert, val_forfait, 0.0)\`) plutôt que \`IFNULL\` (limité à 2 arguments en SQLite/MySQL).
3. **Typage décimal** : écrivez \`0.0\` (flottant) plutôt que \`0\` (entier) pour conserver une colonne homogène \`REAL\`.

\`\`\`sql
-- Démonstration directe de la propagation du NULL vs imputation COALESCE
SELECT
    sinistre_id,
    cout_dommages_materiels,
    cout_corporel,
    cout_dommages_materiels + cout_corporel AS somme_naive,                  -- Devient NULL !
    cout_dommages_materiels + COALESCE(cout_corporel, 0.0) AS somme_corrigee -- Préserve le matériel
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, cout_dommages_materiels, cout_corporel, cout_dommages_materiels + cout_corporel AS somme_naive, cout_dommages_materiels + COALESCE(cout_corporel, 0.0) AS somme_corrigee FROM sinistres;
sinistre_id  cout_dommages_materiels  cout_corporel  somme_naive  somme_corrigee
-----------  -----------------------  -------------  -----------  --------------
501          1450.0                   NULL           NULL         1450.0        
502          420.0                    NULL           NULL         420.0         
503          3800.0                   1200.0         5000.0       5000.0        
504          18500.0                  NULL           NULL         18500.0       
505          7200.0                   4500.0         11700.0      11700.0       
506          9400.0                   NULL           NULL         9400.0        
507          380.0                    NULL           NULL         380.0         
508          2100.0                   NULL           NULL         2100.0
\`\`\`

> 🔍 **Lecture actuarielle :** Sans \`COALESCE\`, la colonne \`somme_naive\` affiche \`NULL\` sur 6 des 8 sinistres (effaçant notamment le \`Vol\` de \`18500.0\` EUR !). Avec \`COALESCE(cout_corporel, 0.0)\`, \`somme_corrigee\` reconstitue exactement \`cout_total\` sur les 8 lignes.
        `,
        taskMarkdown: "Depuis la table `sinistres`, sélectionnez `sinistre_id`, `cout_dommages_materiels` et remplacez les valeurs nulles de `cout_corporel` par `0.0` à l'aide de `COALESCE(cout_corporel, 0.0)` sous l'alias exact `corporel_impute`.",
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
### Jointure Interne & Modélisation de Sévérité (\`INNER JOIN\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Croiser caractéristiques contrat et dossiers sinistres**
>
> Une base relationnelle normalisée sépare l'entité contrat (\`assures\`, 1 ligne par police) de l'entité événement (\`sinistres\`, 0, 1 ou plusieurs lignes par police). Pour analyser l'impact de l'âge, du véhicule ou du bonus-malus sur la gravité des sinistres, il faut relier les deux tables via la clé étrangère \`police_id\`.
>
> En algèbre relationnelle, l'équijointure interne entre $R$ (\`assures\`) et $S$ (\`sinistres\`) s'écrit :
>
> $$
> R \\bowtie_{R.\\text{police\\_id} = S.\\text{police\\_id}} S = \\{ (r, s) \\in R \\times S \\mid r.\\text{police\\_id} = s.\\text{police\\_id} \\}
> $$
>
> **Conséquences de la cardinalité $1\\text{-}N$ :**
> - Les 5 polices sans sinistre (\`1002\`, \`1005\`, \`1006\`, \`1009\`, \`1012\`) sont **exclues**.
> - Une police multi-sinistrée (\`1003\`, 2 sinistres) est **dupliquée** (apparaît 2 fois).
>
> **Lien Tarification GLM :** \`INNER JOIN\` génère exactement le jeu de données requis pour estimer la **sévérité conditionnelle** $\\mathbb{E}[C \\mid N \\ge 1, X]$ (coût moyen *d'un sinistre survenu*), mais il est **impropre** pour calculer la fréquence ou la prime pure car il supprime les contrats sains !

#### 💻 Masterclass SQL

1. **Syntaxe ANSI explicite** : utilisez toujours \`FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id\`. Proscrivez l'ancienne syntaxe virgule (\`FROM assures a, sinistres s WHERE ...\`) où un oubli du \`WHERE\` déclenche silencieusement un produit cartésien $12 \\times 8 = 96$ lignes !
2. **Alias et levée d'ambiguïté** : comme \`police_id\` existe dans les deux tables, préfixez obligatoirement \`a.police_id\` (sinon SQLite lève \`ambiguous column name: police_id\`).
3. **Indexation** : l'index \`idx_sinistres_police\` sur \`sinistres(police_id)\` accélère la jointure via *Index Nested Loop* ou *Merge Join*.

\`\`\`sql
-- Croisement des caractéristiques conducteur (âge) avec chaque sinistre déclaré
SELECT
    a.police_id,        -- Préfixe obligatoire (clé présente dans les 2 tables)
    a.age,              -- Attribut issu de assures
    s.sinistre_id,      -- Attribut issu de sinistres
    s.nature_sinistre,
    s.cout_total
FROM assures a
INNER JOIN sinistres s
    ON a.police_id = s.police_id;  -- Prédicat d'équijointure
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT a.police_id, a.age, s.sinistre_id, s.nature_sinistre, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id;
police_id  age  sinistre_id  nature_sinistre  cout_total
---------  ---  -----------  ---------------  ----------
1001       28   501          Collision        1450.0    
1003       22   502          Bris de Glace    420.0     
1003       22   503          Collision        5000.0    
1004       58   504          Vol              18500.0   
1007       24   505          Collision        11700.0   
1008       41   506          Incendie         9400.0    
1010       31   507          Bris de Glace    380.0     
1011       29   508          Collision        2100.0
\`\`\`

> 🔍 **Lecture actuarielle :** Exactement \`8\` lignes (1 par sinistre) sont retournées. Observez que la police \`1003\` (conducteur de \`22\` ans) apparaît deux fois (\`502\` et \`503\`) et que les 5 polices sans sinistre ont disparu.
        `,
        taskMarkdown: "Effectuez un `INNER JOIN` entre `assures` (alias `a`) et `sinistres` (alias `s`) sur la condition `a.police_id = s.police_id`, et affichez exactement les colonnes `a.police_id`, `a.type_vehicule` et `s.cout_total`.",
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
### Préservation de l'Exposition & Biais de Sélection (\`LEFT JOIN\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Ne jamais effacer les assurés vertueux du dénominateur**
>
> En assurance non-vie, la vaste majorité des assurés ne déclarent aucun sinistre sur un exercice. Réaliser un \`INNER JOIN\` pour analyser le risque revient à ne conserver que les accidentés : c'est un **biais de troncation (biais de sélection)** dramatique qui surestime la fréquence à $100\\%$ et détruit le calcul de la prime pure !
>
> La jointure externe gauche préserve intégralement tous les tuples de la relation de gauche $R$ (\`assures\`), en peuplant les attributs de $S$ (\`sinistres\`) par \`NULL\` lorsqu'aucune correspondance n'existe :
>
> $$
> R \\bowtie^{\\text{left}}_{k} S = (R \\bowtie_{k} S) \\cup \\{ (r, \\text{NULL}_S) \\mid r \\in R \\land \\nexists s \\in S : r.k = s.k \\}
> $$
>
> **Démonstration chiffrée du biais sur nos données :**
> - Avec \`INNER JOIN\` ($8$ lignes sinistrées) : $\\frac{48\\,950}{8} = 6\\,118.75\\text{ EUR}$ mesure uniquement la **sévérité moyenne** par sinistre.
> - Avec \`LEFT JOIN\` (préservation des $12$ polices exposées) : $\\frac{48\\,950}{12} = 4\\,079.17\\text{ EUR}$ mesure le **coût pur moyen par police** ($\\text{fréquence } \\frac{8}{12} \\times \\text{sévérité } 6\\,118.75$).

![INNER JOIN vs LEFT JOIN en Actuariat](/images/theory/fig_v1_sql_joins.png)

> 🔍 **Comprendre ce graphique : L'importance vitale du LEFT JOIN en actuariat**
>
> - **À gauche (INNER JOIN - Le piège)** : Seuls les assurés ayant déclaré un sinistre ont une correspondance dans la table \`sinistres\`. L'\`INNER JOIN\` élimine tous les assurés sains (en rouge), ce qui détruit le dénominateur de votre portefeuille et surévalue artificiellement la prime de risque !
> - **À droite (LEFT JOIN - La bonne pratique)** : Tous les assurés de la table de gauche sont intégralement préservés. Les conducteurs sans sinistre reçoivent des valeurs \`NULL\` (faciles à remplacer par \`0\` EUR via \`COALESCE\`), garantissant une mesure sans biais de l'exposition globale.

#### 💻 Masterclass SQL

1. **Le piège mortel du \`WHERE\` après un \`LEFT JOIN\`** : si vous écrivez \`LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.statut_dossier = 'Clos'\`, le \`WHERE\` s'exécute *après* la jointure ! Pour les 5 polices saines, \`s.statut_dossier\` vaut \`NULL\`, donc \`NULL = 'Clos'\` vaut \`UNKNOWN\` : toutes les polices saines sont détruites et le \`LEFT JOIN\` redevient silencieusement un \`INNER JOIN\` !
2. **Solution correcte** : placez tout filtre portant sur la table de droite **dans la clause \`ON\`** (\`AND s.statut_dossier = 'Clos'\`) ou filtrez \`sinistres\` avant jointure dans une CTE.
3. **Effet de cardinalité 1-N** : 12 polices jointes à 8 sinistres produisent **13 lignes** (11 polices $\\times 1 + 1$ police \`1003\` $\\times 2$).

\`\`\`sql
-- Audit de cardinalité après LEFT JOIN : lignes résultantes vs polices vs sinistres
SELECT
    COUNT(*) AS nb_lignes,                       -- Nombre total de lignes après jointure
    COUNT(DISTINCT a.police_id) AS nb_polices_distinctes, -- Exposition réelle en polices
    COUNT(s.sinistre_id) AS nb_sinistres         -- Ignore les 5 NULL = nombre exact de sinistres
FROM assures a
LEFT JOIN sinistres s
    ON a.police_id = s.police_id;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT COUNT(*) AS nb_lignes, COUNT(DISTINCT a.police_id) AS nb_polices_distinctes, COUNT(s.sinistre_id) AS nb_sinistres FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id;
nb_lignes  nb_polices_distinctes  nb_sinistres
---------  ---------------------  ------------
13         12                     8
\`\`\`

> 🔍 **Lecture actuarielle :** Les trois compteurs (\`13\`, \`12\`, \`8\`) prouvent que les \`12\` polices sont intégralement préservées (contre \`7\` avec \`INNER JOIN\`), que \`8\` sinistres sont rattachés, et que la ligne supplémentaire (\`13 - 12 = 1\`) provient du second sinistre de la police \`1003\`.
        `,
        taskMarkdown: "Effectuez un `LEFT JOIN` entre `assures` (alias `a`) et `sinistres` (alias `s`) sur `a.police_id = s.police_id`, et sélectionnez exactement les colonnes `a.police_id`, `a.region` et `s.cout_total`.",
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
### Jointure Externe & Imputation (\`LEFT JOIN + COALESCE\`) : Maîtriser le Fan-Out 1-N

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Construire la base contrat-sinistralité exploitable**
>
> Après un \`LEFT JOIN\`, toute police saine affiche \`s.cout_total = NULL\`. Pour injecter ces données dans un modèle GLM Tweedie ou sommer la sinistralité, \`COALESCE(s.cout_total, 0.0)\` transforme chaque \`NULL\` structurel en \`0.0\` EUR.
>
> **Piège mathématique fondamental en relation $1\\text{-}N$ (Fan-Out / Duplication) :**
> Lorsqu'une police possède $m_i \\ge 2$ sinistres (comme \`1003\` avec 2 sinistres), un \`LEFT JOIN\` direct répète la ligne de \`assures\` $m_i$ fois :
> - La somme des charges \`SUM(COALESCE(s.cout_total, 0.0))\` reste **exacte** ($48\\,950\\text{ EUR}$).
> - **MAIS** sommer \`a.prime_annuelle\` sur cette table jointe compte deux fois la prime de \`1003\` ($+1\\,150\\text{ EUR}$ fantômes : $12\\,456.80\\text{ EUR}$ au lieu des $11\\,306.80\\text{ EUR}$ réels) !
>
> **Patron d'ingénierie en production :** Pour préserver la granularité **1 ligne = 1 police** sans aucune duplication de prime, on pré-agrège \`sinistres\` par \`police_id\` dans une CTE (\`WITH sin_agg AS (...)\`) *avant* d'effectuer le \`LEFT JOIN\`.

#### 💻 Masterclass SQL

1. **Test de santé d'une jointure** : vérifiez systématiquement si \`COUNT(*) = COUNT(DISTINCT a.police_id)\`. Si \`COUNT(*) > COUNT(DISTINCT a.police_id)\`, la jointure a multiplié des lignes (fan-out).
2. **Typage \`0.0\`** : dans \`COALESCE(s.cout_total, 0.0)\`, la constante flottante garantit un typage numérique cohérent dans le jeu de résultats.
3. **Architecture CTE (\`WITH ...\`)** : ramène la relation $1\\text{-}N$ à une relation $1\\text{-}1$ propre avant jointure.

\`\`\`sql
-- Patron professionnel : pré-agréger les sinistres par police avant LEFT JOIN
WITH sin_agg AS (
    SELECT
        police_id,
        COUNT(*) AS nb_sin,               -- Nombre de sinistres par contrat
        SUM(cout_total) AS cout_police    -- Charge cumulée du contrat
    FROM sinistres
    GROUP BY police_id                    -- Garantit 1 ligne max par police_id
)
SELECT
    a.police_id,
    a.prime_annuelle,                     -- Jamais dupliquée !
    COALESCE(sa.nb_sin, 0) AS nb_sin,     -- 0 pour les polices saines
    COALESCE(sa.cout_police, 0.0) AS cout_police
FROM assures a
LEFT JOIN sin_agg sa ON a.police_id = sa.police_id
ORDER BY a.police_id;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> WITH sin_agg AS (SELECT police_id, COUNT(*) AS nb_sin, SUM(cout_total) AS cout_police FROM sinistres GROUP BY police_id) SELECT a.police_id, a.prime_annuelle, COALESCE(sa.nb_sin, 0) AS nb_sin, COALESCE(sa.cout_police, 0.0) AS cout_police FROM assures a LEFT JOIN sin_agg sa ON a.police_id = sa.police_id ORDER BY a.police_id;
police_id  prime_annuelle  nb_sin  cout_police
---------  --------------  ------  -----------
1001       850.5           1       1450.0     
1002       620.0           0       0.0        
1003       1150.0          2       5420.0     
1004       1340.2          1       18500.0    
1005       710.8           0       0.0        
1006       490.0           0       0.0        
1007       2100.0          1       11700.0    
1008       890.3           1       9400.0     
1009       645.0           0       0.0        
1010       780.0           1       380.0      
1011       920.0           1       2100.0     
1012       810.0           0       0.0
\`\`\`

> 🔍 **Lecture actuarielle :** Exactement \`12\` lignes pour \`12\` polices ! La police \`1003\` reste unique avec \`nb_sin = 2\`, \`cout_police = 5420.0\` EUR et sa prime réelle \`1150.0\` EUR sans doublon, tandis que les 5 contrats sains affichent proprement \`0.0\` EUR.
        `,
        taskMarkdown: "Effectuez un `LEFT JOIN` direct entre `assures` (alias `a`) et `sinistres` (alias `s`) sur `a.police_id = s.police_id`, et sélectionnez exactement `a.police_id` puis `COALESCE(s.cout_total, 0.0)` sous l'alias exact `cout_charge`.",
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
### Comparaison à un Agrégat Dynamique (\`Sous-requête Scalaire\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD & ALM : Filtrer relativement à un benchmark dynamique**
>
> En tarification ou en surveillance des sinistres, il faut fréquemment isoler les risques dépassant la moyenne du portefeuille ($P_i > \\bar{P}$) ou les sinistres supérieurs à la sévérité moyenne ($C_i > \\bar{C}$) sans coder en dur une constante statique qui deviendrait obsolète à la clôture suivante.
>
> Pourquoi \`WHERE prime_annuelle > AVG(prime_annuelle)\` est-il **illégal** en SQL ?
> Parce que dans le cycle d'exécution (\`FROM\` $\\to$ \`WHERE\` $\\to$ \`GROUP BY\` $\\to$ \`SELECT\`), \`WHERE\` est évalué ligne par ligne **avant** toute fonction d'agrégation : la moyenne globale $\\bar{P}$ n'existe pas encore au moment où \`WHERE\` inspecte chaque ligne !
>
> Une **sous-requête scalaire** résout ce blocage en évaluant d'abord l'agrégat global (table $1 \\times 1$), puis en injectant cette constante dynamique dans la restriction :
>
> $$
> \\sigma_{x_i > \\bar{x}}(R), \\qquad \\bar{x} = \\frac{1}{N} \\sum_{j=1}^{N} x_j
> $$
> 📊 **Lien direct Provisionnement :**
> Les lois de sévérité IARD (Lognormale, Pareto) sont très asymétriques à droite : l'espérance $\\bar{C}$ est tirée vers le haut par quelques sinistres extrêmes, si bien que moins de la moitié des dossiers dépassent la moyenne !

#### 💻 Masterclass SQL

1. **Contrainte de scalarité** : une sous-requête utilisée après \`>\`, \`=\` ou dans \`SELECT\` doit retourner **exactement 1 colonne et au plus 1 ligne**. Si elle renvoie plusieurs lignes, PostgreSQL/SQL Server lève une erreur fatale (et SQLite ne retient silencieusement que la 1re ligne).
2. **Sous-requête non corrélée vs corrélée** : ici la sous-requête est indépendante de la requête externe — le moteur ne l'évalue qu'**une seule fois**.
3. **Alternative moderne** : les fonctions de fenêtre \`AVG(...) OVER ()\` permettent d'éviter un second balayage de table.

\`\`\`sql
-- Extraction des sinistres dépassant la sévérité moyenne du portefeuille
SELECT
    sinistre_id,
    nature_sinistre,
    cout_total,
    (SELECT ROUND(AVG(cout_total), 2) FROM sinistres) AS cout_moyen  -- Benchmark scalaire
FROM sinistres
WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres)          -- Filtre dynamique
ORDER BY cout_total DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total, (SELECT ROUND(AVG(cout_total), 2) FROM sinistres) AS cout_moyen FROM sinistres WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres) ORDER BY cout_total DESC;
sinistre_id  nature_sinistre  cout_total  cout_moyen
-----------  ---------------  ----------  ----------
504          Vol              18500.0     6118.75   
505          Collision        11700.0     6118.75   
506          Incendie         9400.0      6118.75
\`\`\`

> 🔍 **Lecture actuarielle :** Seuls \`3\` sinistres sur \`8\` (\`504\`, \`505\`, \`506\`) dépassent la sévérité moyenne de \`6118.75\` EUR — illustration directe de la forte asymétrie droite des coûts de sinistres.
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id` et `prime_annuelle` pour les contrats dont `prime_annuelle` est strictement supérieure à la prime moyenne du portefeuille obtenue par sous-requête scalaire (`WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures)`).",
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
### Semi-Jointure Relationnelle (\`IN subquery\` vs \`EXISTS\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : Segmenter le portefeuille sinistré sans doublons**
>
> Pour comparer le profil des assurés ayant sinistré au moins une fois face aux assurés restés sains, un \`INNER JOIN\` pose problème : il duplique les polices multi-sinistrées (\`1003\` compterait deux fois dans l'âge moyen des assurés sinistrés !). Il faut filtrer la table \`assures\` par l'existence d'au moins une correspondance dans \`sinistres\` tout en conservant le grain strict **1 ligne = 1 police**.
>
> En algèbre relationnelle, cette opération est la **semi-jointure** ($R \\ltimes S$) :
>
> $$
> R \\ltimes_{k} S = \\pi_R(R \\bowtie_{k} S) = \\{ r \\in R \\mid \\exists s \\in S,\\ r.k = s.k \\}
> $$
>
> **Piège mortel sur l'anti-jointure (\`NOT IN\` vs \`NOT EXISTS\`) :** Pour isoler à l'inverse les polices *sans* sinistre, n'utilisez jamais \`NOT IN (SELECT col FROM ...)\` si la colonne cible peut contenir \`NULL\` — un seul \`NULL\` dans la sous-requête fait retourner **0 ligne** à \`NOT IN\` ! \`NOT EXISTS\`, lui, reste 100 % immunisé contre \`NULL\`.

#### 💻 Masterclass SQL

1. **\`IN (SELECT DISTINCT ...)\` vs \`EXISTS\`** : sur une petite table ou avec \`DISTINCT\`, \`IN\` est très lisible. Sur de gros volumes, \`EXISTS (SELECT 1 FROM sinistres s WHERE s.police_id = a.police_id)\` exploite l'index \`idx_sinistres_police\` et s'arrête dès le **premier** sinistre trouvé (*short-circuit*).
2. **Pourquoi \`DISTINCT\` dans la sous-requête ?** Même si \`IN\` dédoublonne logiquement la liste de valeurs, expliciter \`DISTINCT\` clarifie l'intention et accélère parfois l'optimiseur.
3. **Invariant de cardinalité** : la semi-jointure retourne toujours au plus $|R|$ lignes (ici \`7\` polices sinistrées pour \`8\` sinistres).

\`\`\`sql
-- Comparaison actuarielle directe : sous-portefeuille sinistré vs sous-portefeuille sain
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM sinistres s WHERE s.police_id = a.police_id)
        THEN 'Sinistre'
        ELSE 'Sain'
    END AS statut_risque,
    COUNT(*) AS nb_polices,
    ROUND(AVG(a.prime_annuelle), 2) AS prime_moyenne,
    ROUND(AVG(a.age), 1) AS age_moyen
FROM assures a
GROUP BY statut_risque;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT CASE WHEN EXISTS (SELECT 1 FROM sinistres s WHERE s.police_id = a.police_id) THEN 'Sinistre' ELSE 'Sain' END AS statut_risque, COUNT(*) AS nb_polices, ROUND(AVG(a.prime_annuelle), 2) AS prime_moyenne, ROUND(AVG(a.age), 1) AS age_moyen FROM assures a GROUP BY statut_risque;
statut_risque  nb_polices  prime_moyenne  age_moyen
-------------  ----------  -------------  ---------
Sain           5           655.16         52.2     
Sinistre       7           1147.29        33.3
\`\`\`

> 🔍 **Lecture actuarielle :** Le contraste est saisissant sur le portefeuille réel : les \`7\` polices sinistrées ont un âge moyen de \`33.3\` ans (prime \`1147.29\` EUR), contre \`52.2\` ans (prime \`655.16\` EUR) pour les \`5\` polices saines — validant empiriquement l'effet de l'âge et du CRM sur la sinistralité.
        `,
        taskMarkdown: "Depuis la table `assures`, sélectionnez `police_id`, `age` et `region` pour les contrats ayant au moins un sinistre enregistré, en filtrant avec la sous-requête `WHERE police_id IN (SELECT DISTINCT police_id FROM sinistres)`.",
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
### Ratio Sinistres sur Primes ($S/P$ ou *Loss Ratio*)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier IARD : L'indicateur souverain de rentabilité technique**
>
> Le **Ratio Sinistres sur Primes ($S/P$)** mesure la part des primes acquises absorbée par l'indemnisation des sinistres :
>
> $$
> \\text{Ratio } S/P = \\frac{\\sum_{i} S_i}{\\sum_{i} P_i} \\times 100 = \\frac{\\bar{\\lambda} \\times \\bar{C}}{\\bar{P}} \\times 100
> $$
>
> En pilotage technique, on l'associe au **Ratio Combiné** ($\\text{CR} = S/P + \\text{Ratio de frais}$) :
> - **$S/P < 75\\%$** (avec ~25 % de frais généraux et d'acquisition) : portefeuille sain et rentable techniquement.
> - **$75\\% \\le S/P \\le 100\\%$** : équilibre technique fragile, dépendant des produits financiers ALM.
> - **$S/P > 100\\%$** : déficit technique pur — les primes ne couvrent même plus le coût des sinistres (sous-tarification ou dérive de sinistralité).
>
> **Note d'ingénierie actuarielle sur le fan-out :** Dans ce laboratoire, la validation attend le calcul direct \`SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100\` sur un \`LEFT JOIN\` direct. En production multi-sinistres, gardez à l'esprit qu'un \`LEFT JOIN\` non pré-agrégé duplique \`a.prime_annuelle\` pour les polices multi-sinistrées (ex. \`1003\` en \`PACA\`, donnant \`235.65\\%\` au lieu de \`471.30\\%\`) : on pré-agrège alors les sinistres par \`police_id\` dans une CTE avant jointure.

![Le Loss Ratio S/P en Assurance](/images/theory/fig_v1_loss_ratio.png)

> 🔍 **Comprendre ce graphique : L'indicateur roi de la rentabilité technique**
>
> - **La ligne rouge (Seuil 100%)** : Le point d'équilibre où l'intégralité des primes perçues est absorbée par les sinistres indemnisés.
> - **Barres vertes ($S/P < 80\\%$)** : Zone de rentabilité technique saine, permettant de couvrir les frais généraux et de dégager une marge.
> - **Barre rouge ($S/P > 100\\%$)** : Zone de déficit technique caractérisant une **sous-tarification** de la région ou une dérive de la sinistralité climatique.

> ✏️ **Exemple chiffré pas-à-pas (3 contrats en Occitanie) :**
> - Contrat 1 : Prime $= 500\\text{ EUR}$, Coût $= 0\\text{ EUR}$ ; Contrat 2 : Prime $= 700\\text{ EUR}$, Coût $= 400\\text{ EUR}$ ; Contrat 3 : Prime $= 800\\text{ EUR}$, Coût $= 1\\,200\\text{ EUR}$.
> - Primes $P = 500 + 700 + 800 = 2\\,000\\text{ EUR}$ ; Sinistres $S = 0 + 400 + 1\\,200 = 1\\,600\\text{ EUR}$.
> - **Ratio $S/P$** $= \\frac{1\\,600}{2\\,000} \\times 100 = \\mathbf{80.0\\%}$.

#### 💻 Masterclass SQL

1. **Piège de la division entière en SQLite/PostgreSQL** : diviser deux entiers (\`5 / 2\`) tronque à \`2\` (et \`400 / 1000\` vaut \`0\`) ! Multipliez systématiquement par \`100.0\` (constante \`REAL\`) ou assurez-vous qu'un opérande au moins est flottant.
2. **\`LEFT JOIN\` indispensable** : sans \`LEFT JOIN\`, les segments sans aucun sinistre ($S/P = 0.0\\%$) seraient rayés du tableau et fausseraient l'équilibre global.
3. **Exemple de référence sans fan-out** : ci-dessous par \`type_vehicule\` via CTE pré-agrégée.

\`\`\`sql
-- Calcul exact du Ratio S/P par type de véhicule sans duplication de prime
WITH sin_par_police AS (
    SELECT police_id, SUM(cout_total) AS charge
    FROM sinistres
    GROUP BY police_id
)
SELECT
    a.type_vehicule,
    COUNT(*) AS nb_polices,
    ROUND(SUM(a.prime_annuelle), 2) AS primes,
    ROUND(SUM(COALESCE(sp.charge, 0.0)), 2) AS sinistres,
    ROUND(SUM(COALESCE(sp.charge, 0.0)) * 100.0 / SUM(a.prime_annuelle), 2) AS sp_exact_pct
FROM assures a
LEFT JOIN sin_par_police sp ON a.police_id = sp.police_id
GROUP BY a.type_vehicule
ORDER BY sp_exact_pct DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> WITH sin_par_police AS (SELECT police_id, SUM(cout_total) AS charge FROM sinistres GROUP BY police_id) SELECT a.type_vehicule, COUNT(*) AS nb_polices, ROUND(SUM(a.prime_annuelle), 2) AS primes, ROUND(SUM(COALESCE(sp.charge, 0.0)), 2) AS sinistres, ROUND(SUM(COALESCE(sp.charge, 0.0)) * 100.0 / SUM(a.prime_annuelle), 2) AS sp_exact_pct FROM assures a LEFT JOIN sin_par_police sp ON a.police_id = sp.police_id GROUP BY a.type_vehicule ORDER BY sp_exact_pct DESC;
type_vehicule  nb_polices  primes  sinistres  sp_exact_pct
-------------  ----------  ------  ---------  ------------
SUV            1           1340.2  18500.0    1380.39     
Monospace      1           890.3   9400.0     1055.82     
Sportive       1           2100.0  11700.0    557.14      
Citadine       5           4190.5  9350.0     223.12      
Berline        4           2785.8  0.0        0.0
\`\`\`

> 🔍 **Lecture actuarielle :** Les \`Berline\` (4 polices, \`2785.8\` EUR de primes, \`0\` sinistre) affichent un $S/P$ de \`0.0\`%, finançant partiellement les chocs graves sur \`SUV\` (\`1380.39\`% dû au vol de \`18500\` EUR) et \`Monospace\` (\`1055.82\`% dû à l'incendie).
        `,
        taskMarkdown: "Calculez le Ratio S/P par région depuis `assures a LEFT JOIN sinistres s ON a.police_id = s.police_id` regroupé par `a.region`. Sélectionnez exactement `a.region` et l'expression `ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2)` sous l'alias exact `ratio_sp`.",
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
### Fenêtrage Temporel & Dynamique des Taux ALM (\`LAG() OVER\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier ALM & Économétrie : Mesurer la vitesse des chocs de taux**
>
> En Gestion Actif-Passif (ALM) d'un assureur vie ou IARD, le niveau instantané des taux compte moins que leur **vitesse de variation trimestrielle** $\\Delta r_t = r_t - r_{t-1}$. Une remontée brutale de l'Euribor 3M et de l'OAT 10 ans (cycle 2022–2023) déprécie rapidement la valeur de marché des portefeuilles obligataires ($\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\Delta y$) tout en déclenchant un risque de **rachat massif** sur les fonds en euros.
>
> En économétrie des séries temporelles, \`LAG\` implémente l'**opérateur de retard** (*Backshift operator* $L^k$) :
>
> $$
> L^k x_t = x_{t-k}, \\qquad \\Delta x_t = (1 - L) x_t = x_t - x_{t-1}
> $$
>
> **Différence structurante avec \`GROUP BY\` :** Une fonction de fenêtre \`OVER (...)\` **ne compresse jamais les lignes** ; elle conserve les $T = 16$ trimestres et accède à la ligne antérieure dans la fenêtre ordonnée pour aligner $x_t$ et $x_{t-1}$ sur une même ligne.

#### 💻 Masterclass SQL

1. **Signature complète** : \`LAG(expression [, offset [, defaut]]) OVER ([PARTITION BY ...] ORDER BY ...)\`.
   - \`offset = 1\` (défaut) lit la ligne immédiatement précédente ; \`LEAD()\` lit la ligne suivante.
   - Sur la première observation de la fenêtre, aucun antécédent n'existe : \`LAG\` retourne \`NULL\` (ou \`defaut\` s'il est spécifié).
2. **\`ORDER BY\` interne obligatoire** : l'ordre chronologique dans \`OVER (ORDER BY periode)\` s'appuie ici sur le format ISO triable \`'YYYY-Qn'\`.
3. **Ordre d'exécution (\`WINDOW\` après \`WHERE\`)** : si vous filtrez \`WHERE periode >= '2022-Q1'\` dans la même requête, \`'2021-Q4'\` est déjà éliminé avant le calcul de \`LAG\`, qui renvoie donc \`NULL\` sur \`'2022-Q1'\`. Pour conserver l'historique avant filtrage, placez le \`LAG\` dans une CTE.

\`\`\`sql
-- Calcul du choc trimestriel sur l'OAT 10 ans depuis 2022-Q1
SELECT
    periode,
    oat_10y,
    LAG(oat_10y, 1) OVER (ORDER BY periode) AS oat_prev,
    ROUND(oat_10y - LAG(oat_10y, 1) OVER (ORDER BY periode), 2) AS delta_oat
FROM macro_taux
WHERE periode >= '2022-Q1'   -- Exécuté AVANT la fenêtre OVER !
ORDER BY periode;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT periode, oat_10y, LAG(oat_10y, 1) OVER (ORDER BY periode) AS oat_prev, ROUND(oat_10y - LAG(oat_10y, 1) OVER (ORDER BY periode), 2) AS delta_oat FROM macro_taux WHERE periode >= '2022-Q1' ORDER BY periode;
periode  oat_10y  oat_prev  delta_oat
-------  -------  --------  ---------
2022-Q1  0.89     NULL      NULL     
2022-Q2  1.92     0.89      1.03     
2022-Q3  2.71     1.92      0.79     
2022-Q4  3.12     2.71      0.41     
2023-Q1  2.95     3.12      -0.17    
2023-Q2  3.15     2.95      0.2      
2023-Q3  3.4      3.15      0.25     
2023-Q4  3.1      3.4       -0.3
\`\`\`

> 🔍 **Lecture ALM :** Comme prévu par l'ordre d'exécution, \`2022-Q1\` affiche \`NULL\` pour \`oat_prev\` après filtrage \`WHERE\`. On observe ensuite un choc massif de \`+1.03\` point en \`2022-Q2\` suivi de \`+0.79\` point en \`2022-Q3\`, caractérisant le choc de taux le plus rapide de la décennie.
        `,
        taskMarkdown: "Depuis la table `macro_taux`, sélectionnez `periode`, `euribor_3m` et le taux Euribor du trimestre précédent calculé avec `LAG(euribor_3m, 1) OVER (ORDER BY periode)` sous l'alias exact `euribor_prev`.",
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
### Fonctions de Classement & Cycle SQL Complet (\`DENSE_RANK() OVER\`)

#### 🎓 Cours Théorique Approfondi

> 💡 **Intuition métier ERM & Actuariat : Hiérarchiser les zones de sinistralité**
>
> Pour arbitrer les budgets de prévention, réviser le zonier ou allouer le capital économique Solvabilité II par région, la direction technique classe les territoires par charge totale de sinistres décroissante. Cet exercice combine en une seule requête tout le pipeline analytique : \`LEFT JOIN\` + \`COALESCE\` + \`GROUP BY\` + \`WINDOW\` + \`ORDER BY\`.
>
> **Cycle d'exécution logique complet du moteur SQL (les 10 étapes) :**
>
> $$
> \\text{FROM} \\to \\text{JOIN} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{WINDOW} \\to \\text{SELECT} \\to \\text{DISTINCT} \\to \\text{ORDER BY} \\to \\text{LIMIT}
> $$
>
> Parce que \`WINDOW\` s'exécute **après** \`GROUP BY\`, il est parfaitement valide de classer un agrégat via \`DENSE_RANK() OVER (ORDER BY SUM(...) DESC)\` !
>
> **Comparaison formelle des 3 fonctions de rang face aux ex-aequo :**
> - **\`ROW_NUMBER()\`** : bijection stricte $\\{1, 2, \\dots, K\\}$ — brise arbitrairement les égalités ($1, 2, 3, 4, 5, 6, 7, 8$).
> - **\`RANK()\`** : rang olympique avec sauts après égalité ($1, 1, 3, 4, 5, 5, 5, 5$).
> - **\`DENSE_RANK()\`** : rang continu sans aucun trou ($1, 1, 2, 3, 4, 4, 4, 4$) — idéal lorsque plusieurs régions sans sinistre partagent \`0.0\` EUR !

#### 💻 Masterclass SQL

1. **Pourquoi \`SUM()\` dans \`OVER (ORDER BY SUM(...))\` est valide ici** : uniquement parce que la requête contient un \`GROUP BY a.region\`. La fenêtre classe les 9 lignes régionales déjà agrégées.
2. **Double \`ORDER BY\` distinct** : l'\`ORDER BY\` à l'intérieur de \`OVER (...)\` détermine le calcul du rang ; l'\`ORDER BY rang_cout ASC\` final garantit l'ordre d'affichage du jeu de résultats.
3. **Comparatif visuel** : testez simultanément les trois fonctions sur \`responsabilite_pct\` dans la table \`sinistres\` où existent deux ex-aequo à \`100.0\`% et quatre à \`0.0\`%.

\`\`\`sql
-- Comparaison directe de ROW_NUMBER, RANK et DENSE_RANK face aux ex-aequo
SELECT
    sinistre_id,
    nature_sinistre,
    responsabilite_pct,
    ROW_NUMBER() OVER (ORDER BY responsabilite_pct DESC, sinistre_id ASC) AS rn,
    RANK() OVER (ORDER BY responsabilite_pct DESC) AS rnk,
    DENSE_RANK() OVER (ORDER BY responsabilite_pct DESC) AS dense_rnk
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, responsabilite_pct, ROW_NUMBER() OVER (ORDER BY responsabilite_pct DESC, sinistre_id ASC) AS rn, RANK() OVER (ORDER BY responsabilite_pct DESC) AS rnk, DENSE_RANK() OVER (ORDER BY responsabilite_pct DESC) AS dense_rnk FROM sinistres;
sinistre_id  nature_sinistre  responsabilite_pct  rn  rnk  dense_rnk
-----------  ---------------  ------------------  --  ---  ---------
501          Collision        100.0               1   1    1        
503          Collision        100.0               2   1    1        
505          Collision        80.0                3   3    2        
508          Collision        50.0                4   4    3        
502          Bris de Glace    0.0                 5   5    4        
504          Vol              0.0                 6   5    4        
506          Incendie         0.0                 7   5    4        
507          Bris de Glace    0.0                 8   5    4
\`\`\`

> 🔍 **Lecture actuarielle :** Après les deux sinistres \`100.0\`% (\`501\`, \`503\`) classés au rang \`1\`, le sinistre \`505\` (\`80.0\`%) reçoit le rang \`3\` avec \`RANK()\` (qui saute le 2) mais reste au rang \`2\` avec \`DENSE_RANK()\` (sans trou).
        `,
        taskMarkdown: "Effectuez un `LEFT JOIN` entre `assures a` et `sinistres s` sur `a.police_id = s.police_id`, regroupez par `a.region` (`GROUP BY a.region`), sélectionnez exactement `a.region`, `ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout` et `DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout`, puis triez par `ORDER BY rang_cout ASC`.",
        initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
        solutionCode: "SELECT a.region, ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout, DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.region ORDER BY rang_cout ASC;",
        validationQuery: "SELECT a.region, ROUND(SUM(COALESCE(s.cout_total, 0)), 2) AS total_cout, DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.region ORDER BY rang_cout ASC;",
        hints: ["Donnez l'alias 'rang_cout' à la fonction DENSE_RANK."],
        datasets: []
      }
    ]
  };
