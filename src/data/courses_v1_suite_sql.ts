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
### Projection Relationnelle Ciblée sur la Table \`sinistres\`

#### 🎓 Cours Théorique Approfondi

En algèbre relationnelle d'Edgar F. Codd, une relation (table) $R(A_1, A_2, \\dots, A_m)$ est un ensemble mathématique de tuples définis sur un schéma de $m$ attributs. L'opérateur unaire de **projection** $\\pi_{A_{i_1}, \\dots, A_{i_k}}(R)$ restreint chaque tuple aux seuls $k$ attributs pertinents ($k \\le m$) :

$$
\\pi_{\\text{sinistre\\_id},\\,\\text{nature\\_sinistre},\\,\\text{cout\\_total}}(\\text{sinistres})
$$

En SQL, contrairement à l'algèbre pure qui élimine automatiquement les doublons, \`SELECT\` opère sur des **multi-ensembles** (*bags*) et conserve donc la multiplicité des $N$ dossiers ($|R| = 8$ lignes dans \`sinistres\`), tout en réduisant la largeur de chaque ligne extraite.

**Pourquoi est-ce critique en Actuariat & Data Engineering ?**

Dans un système d'information IARD, les tables de sinistres comportent souvent des dizaines de champs volumineux (commentaires d'experts, dates de clôture, références tierces, colonnes nullables comme \`cout_corporel\`). Dans le modèle classique **Fréquence–Sévérité** de Cramér–Lundberg, la modélisation de la sévérité individuelle $X_i$ n'a besoin que de l'identifiant du dossier, du péril (\`nature_sinistre\`) et de la charge finale (\`cout_total\`). Proscrire \`SELECT *\` garantit la stabilité des pipelines ETL en amont des GLM et diminue drastiquement les entrées/sorties disque (I/O) ainsi que l'empreinte mémoire.

#### 💻 Masterclass SQL

Le moteur SQLite résout une projection simple en deux étapes logiques : \`FROM\` localise d'abord la B-Tree de la table \`sinistres\`, puis \`SELECT\` parcourt séquentiellement les pages de données (*Sequential Scan*) et n'extrait que les colonnes demandées dans le registre de sortie.

\`\`\`sql
SELECT
  police_id,        -- Clé primaire entière (INTEGER) du contrat
  type_contrat,     -- Formule tarifaire (TEXT) : Tous Risques, Tiers...
  prime_annuelle    -- Prime pure + chargements en EUR (REAL)
FROM assures        -- Table source des 12 contrats en portefeuille
LIMIT 5;            -- Limite l'aperçu REPL aux 5 premières lignes
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT sinistre_id, date_survenance, statut_dossier FROM sinistres LIMIT 5;
sinistre_id  date_survenance  statut_dossier
-----------  ---------------  --------------
501          2021-08-14       Clos          
502          2022-04-02       Clos          
503          2022-11-19       Clos          
504          2020-01-15       Clos          
505          2022-09-08       En cours
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Projetez uniquement les trois attributs nécessaires à une étude de sévérité sur \`sinistres\`.

Écrivez une requête SQL qui sélectionne exactement les colonnes \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` (dans cet ordre) depuis la table \`sinistres\`.`,
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
### Fractionnement de Prime, Arithmétique Flottante et Alias \`AS\`

#### 🎓 Cours Théorique Approfondi

En tarification d'assurance dommages et en gestion de trésorerie ALM, les contrats sont tarifés sur une base annuelle ($P_{\\text{ann}}$), mais fréquemment acquittés par mensualités ($P_{\\text{mens}}$). En première approximation arithmétique (sans chargement de fractionnement ni actualisation intra-annuelle), la mensualité vaut :

$$
P_{\\text{mens}} = \\frac{P_{\\text{ann}}}{12}
$$

Dans un cadre financier rigoureux avec taux d'actualisation annuel $i_{\\text{ann}}$, le **taux mensuel actuariel équivalent** $i_{\\text{mens}}$ vérifie l'identité de capitalisation composée :

$$
(1 + i_{\\text{mens}})^{12} = 1 + i_{\\text{ann}} \\iff i_{\\text{mens}} = (1 + i_{\\text{ann}})^{1/12} - 1
$$

Par développement limité de Taylor à l'ordre 2 autour de $i_{\\text{ann}} = 0$ :

$$
i_{\\text{mens}} \\approx \\frac{i_{\\text{ann}}}{12} - \\frac{11}{288} i_{\\text{ann}}^2
$$

On constate que $\\frac{i_{\\text{ann}}}{12} > i_{\\text{mens}}$ : c'est pourquoi les assureurs appliquent souvent un coefficient de fractionnement commercial (de $+2\\%$ à $+4\\%$) pour couvrir le manque à gagner financier de trésorerie et le risque de résiliation infra-annuelle (lois Hamon et Lemoine). Ici, nous pratiquons le calcul arithmétique de base arrondi au centime d'euro ($2$ décimales).

#### 💻 Masterclass SQL

En SQLite, une expression arithmétique dans \`SELECT\` est évaluée ligne par ligne. **Piège d'ingénierie majeur** : si les deux opérandes d'une division \`/\` sont de type \`INTEGER\` (par ex. \`5 / 12\`), SQLite effectue une **division entière tronquée** donnant \`0\` ! Dès qu'un opérande est \`REAL\` (comme \`prime_annuelle\`, ou en écrivant \`12.0\`), la division devient flottante IEEE-754. Le mot-clé \`AS\` attribue ensuite un nom métier explicite à l'expression calculée.

\`\`\`sql
SELECT
  police_id,                                      -- Identifiant unique du contrat
  prime_annuelle,                                 -- Prime annuelle brute (REAL)
  ROUND(prime_annuelle / 4.0, 2) AS prime_trimestrielle  -- Division réelle puis arrondi à 2 décimales + alias
FROM assures                                      -- Lecture sur la table assures
LIMIT 5;                                          -- Limitation à 5 contrats pour l'exemple
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT police_id, prime_annuelle, ROUND(prime_annuelle / 4.0, 2) AS prime_trimestrielle FROM assures LIMIT 5;
police_id  prime_annuelle  prime_trimestrielle
---------  --------------  -------------------
1001       850.5           212.63             
1002       620.0           155.0              
1003       1150.0          287.5              
1004       1340.2          335.05             
1005       710.8           177.7
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Calculez l'échéance mensuelle arithmétique des contrats du portefeuille \`assures\`.

Sélectionnez exactement \`police_id\`, \`prime_annuelle\` et \`ROUND(prime_annuelle / 12, 2) AS prime_mensuelle\` depuis la table \`assures\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT police_id, prime_annuelle, ROUND(prime_annuelle / 12, 2) AS prime_mensuelle FROM assures;",
      validationQuery: "SELECT police_id, prime_annuelle, ROUND(prime_annuelle / 12, 2) AS prime_mensuelle FROM assures;",
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
### Dédoublonnage Ensembliste avec \`SELECT DISTINCT\`

#### 🎓 Cours Théorique Approfondi

En mathématiques, un ensemble ignore la multiplicité de ses éléments. Or, une projection SQL classique $\\pi_A(R)$ produit un **multi-ensemble** (*bag*) de taille $|R|$ dans lequel chaque modalité apparaît autant de fois qu'il existe de contrats dans cette catégorie. L'opérateur \`SELECT DISTINCT\` applique la réduction ensembliste $\\delta$ :

$$
\\delta(\\pi_{\\text{type\\_contrat}}(\\text{assures})) = \\{ x.\\text{type\\_contrat} \\mid x \\in \\text{assures} \\}
$$

Si la variable catégorielle possède $K$ modalités distinctes, le résultat passe de $N = 12$ lignes à exactement $K = 3$ lignes.

**Enjeu Actuariel & Préparation GLM :**

Avant d'ajuster un Modèle Linéaire Généralisé (GLM) de tarification ou d'écrire des clauses de filtrage \`WHERE\`, l'actuaire doit auditer le dictionnaire réel des modalités (*Data Quality Check*) pour repérer :
- Les variations typographiques ou d'encodage (\`'Tiers Étendu'\` avec accent vs \`'Tiers Etendu'\`, espaces superflus).
- La cardinalité $K$ du facteur (nombre de degrés de liberté $K - 1$ consommés dans la matrice de design $X$).

#### 💻 Masterclass SQL

Dans le cycle d'exécution SQL (\`FROM\` $\\to$ \`WHERE\` $\\to$ \`SELECT\` $\\to$ \`DISTINCT\` $\\to$ \`ORDER BY\`), \`DISTINCT\` s'applique **sur l'ensemble du tuple projeté** après \`SELECT\`. En interne, SQLite trie les valeurs ou construit une table de hachage temporaire (B-Tree éphémère) pour éliminer les doublons, puis applique \`ORDER BY\`.

\`\`\`sql
SELECT DISTINCT
  nature_sinistre           -- Attribut catégoriel à dédoublonner
FROM sinistres              -- Table des 8 dossiers sinistres
ORDER BY nature_sinistre ASC; -- Tri lexicographique croissant (A -> Z)
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT DISTINCT nature_sinistre FROM sinistres ORDER BY nature_sinistre ASC;
nature_sinistre
---------------
Bris de Glace  
Collision      
Incendie       
Vol
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Auditez les formules tarifaires uniques présentes en portefeuille.

Affichez les valeurs distinctes de \`type_contrat\` depuis \`assures\`, triées par ordre alphabétique croissant (\`ORDER BY type_contrat ASC\`).`,
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
### Sélection des Sinistres Graves & Seuils de Réassurance (\`WHERE >=\`)

#### 🎓 Cours Théorique Approfondi

En actuariat non-vie, la distribution des coûts de sinistres $X$ est fortement asymétrique à droite. On décompose donc la sinistralité autour d'une **priorité** (seuil de rétention $d$, ici $d = 5\\,000\\text{ EUR}$) entre :
- **Sinistres attritionnels** ($X < d$) : fréquents, prévisibles et gouvernés par la loi des grands nombres.
- **Sinistres graves** ($X \\ge d$) : rares, à forte variance, qui pilotent l'exigence en capital SCR sous Solvabilité II et justifient la souscription d'un traité de réassurance en **Excédent de Sinistre (Excess of Loss, XS)** de priorité $d$ et de portée $L$ :

$$
X = \\underbrace{\\min(X, d)}_{\\text{Charge conservée (cédante)}} + \\underbrace{\\max(0,\\, X - d)}_{\\text{Cession XS illimitée}} = (X \\land d) + (X - d)_+
$$

En algèbre relationnelle, l'extraction des sinistres graves correspond à l'opérateur de **sélection** (restriction) :

$$
\\sigma_{\\text{cout\\_total} \\ge 5000}(\\text{sinistres})
$$

Le choix entre l'inégalité large \`>=\` et l'inégalité stricte \`>\` est juridiquement déterminant : un dossier à exactement $5\\,000\\text{ EUR}$ (comme le sinistre \`503\`) est inclus avec \`>=\` et exclu avec \`>\`.

#### 💻 Masterclass SQL

La clause \`WHERE\` évalue un prédicat booléen ligne par ligne immédiatement après \`FROM\`. Seules les lignes pour lesquelles le prédicat vaut \`TRUE\` sont transmises à la projection \`SELECT\`.

\`\`\`sql
SELECT
  sinistre_id,        -- Identifiant du dossier
  nature_sinistre,    -- Péril (Collision, Bris de Glace, etc.)
  cout_total          -- Montant total du sinistre (REAL)
FROM sinistres
WHERE cout_total < 5000; -- Sélection complémentaire : sinistres attritionnels (< 5 000 EUR)
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total < 5000;
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
501          Collision        1450.0    
502          Bris de Glace    420.0     
507          Bris de Glace    380.0     
508          Collision        2100.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Isolez les dossiers qualifiés de sinistres graves à partir du seuil inclusif de $5\\,000\\text{ EUR}$.

Sélectionnez \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` uniquement pour les dossiers dont \`cout_total >= 5000\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total >= 5000;",
      validationQuery: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total >= 5000;",
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
### Complément Ensembliste et Exclusion Catégorielle (\`WHERE !=\`)

#### 🎓 Cours Théorique Approfondi

En théorie des ensembles, exclure une modalité $v$ d'un attribut $A$ revient à former le complément relatif dans la table $R$ :

$$
\\sigma_{A \\neq v}(R) = R \\setminus \\sigma_{A = v}(R)
$$

Attention toutefois : en SQL, cette égalité ensembliste n'est exacte que lorsque la colonne $A$ est contrainte \`NOT NULL\`. Si $A$ contient des valeurs \`NULL\`, la comparaison \`A != 'Tiers Simple'\` retourne \`UNKNOWN\`, ce qui exclut silencieusement les lignes manquantes en plus de la modalité visée ! Ici, \`type_contrat\` est \`NOT NULL\` dans le schéma.

**Application en Tarification Dommages :**

En assurance automobile, la formule \`Tiers Simple\` ne couvre que la Responsabilité Civile obligatoire envers les tiers, tandis que \`Tiers Étendu\` et \`Tous Risques\` intègrent des garanties dommages propres au véhicule assuré (Vol, Incendie, Bris de Glace, Dommages Tous Accidents). Exclure \`'Tiers Simple'\` permet donc de mesurer l'exposition exacte aux garanties dommages.

#### 💻 Masterclass SQL

SQLite accepte aussi bien l'opérateur historique \`!=\` que la norme ANSI stricte \`<>\`. Les chaînes littérales doivent impérativement être encadrées de **guillemets simples** \`'...' \` (les guillemets doubles \`"..."\` désignent des noms de colonnes/tables en SQL standard).

\`\`\`sql
SELECT
  sinistre_id,                        -- Identifiant du sinistre
  nature_sinistre,                    -- Nature du péril
  cout_total                          -- Charge associée
FROM sinistres
WHERE nature_sinistre <> 'Bris de Glace'; -- Exclut les bris de glace (opérateur ANSI <>)
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre <> 'Bris de Glace';
sinistre_id  nature_sinistre  cout_total
-----------  ---------------  ----------
501          Collision        1450.0    
503          Collision        5000.0    
504          Vol              18500.0   
505          Collision        11700.0   
506          Incendie         9400.0    
508          Collision        2100.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez l'exposition aux contrats offrant des garanties supérieures au tiers minimal.

Sélectionnez \`police_id\`, \`age\`, \`type_contrat\` et \`prime_annuelle\` depuis \`assures\` lorsque \`type_contrat != 'Tiers Simple'\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT police_id, age, type_contrat, prime_annuelle FROM assures WHERE type_contrat != 'Tiers Simple';",
      validationQuery: "SELECT police_id, age, type_contrat, prime_annuelle FROM assures WHERE type_contrat != 'Tiers Simple';",
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
### Conjonction Logique \`AND\` et Risque d'Interaction Tarifaire

#### 🎓 Cours Théorique Approfondi

En algèbre relationnelle, la conjonction logique de deux prédicats $P_1$ et $P_2$ équivaut à l'intersection de deux sous-populations :

$$
\\sigma_{P_1 \\land P_2}(R) = \\sigma_{P_1}(R) \\cap \\sigma_{P_2}(R)
$$

**Intuition Actuarielle (Effets d'Interaction en GLM) :**

Dans un tarif automobile multiplicatif de type GLM log-linéaire :

$$
\\mathbb{E}[Y \\mid x_1, x_2] = \\exp(\\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\beta_{12} x_1 x_2)
$$

certains segments combinent deux facteurs de risque dont l'effet joint dépasse la simple somme des effets marginaux ($\\beta_{12} > 0$). L'intersection entre une **faible expérience de conduite** (\`anciennete_permis < 10\`, facteur de fréquence d'accident) et une **motorisation élevée** (\`puissance_fiscale >= 5\`, facteur d'énergie cinétique $E_c = \\frac{1}{2} m v^2$ et de coût de réparation) constitue un segment critique de souscription (*young high-power drivers*).

#### 💻 Masterclass SQL

Lorsque plusieurs conditions sont liées par \`AND\`, le moteur SQL évalue souvent la condition la plus sélective (ou indexée) en premier grâce à l'évaluation paresseuse (*short-circuit evaluation*) : si la première condition est fausse pour une ligne, la seconde n'a même pas besoin d'être testée.

\`\`\`sql
SELECT
  police_id,        -- Clé primaire de la police
  age,              -- Âge du conducteur (INTEGER)
  bonus_malus,      -- Coefficient CRM (REAL)
  prime_annuelle    -- Prime facturée (REAL)
FROM assures
WHERE age > 45              -- Condition 1 : conducteur expérimenté
  AND bonus_malus = 0.50;   -- Condition 2 : bonus maximal réglementaire
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT police_id, age, bonus_malus, prime_annuelle FROM assures WHERE age > 45 AND bonus_malus = 0.50;
police_id  age  bonus_malus  prime_annuelle
---------  ---  -----------  --------------
1004       58   0.5          1340.2        
1006       67   0.5          490.0         
1012       63   0.5          810.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Identifiez le segment à risque combinant faible ancienneté de permis et puissance fiscale significative.

Sélectionnez \`police_id\`, \`anciennete_permis\`, \`puissance_fiscale\` et \`prime_annuelle\` depuis \`assures\` pour \`anciennete_permis < 10 AND puissance_fiscale >= 5\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT police_id, anciennete_permis, puissance_fiscale, prime_annuelle FROM assures WHERE anciennete_permis < 10 AND puissance_fiscale >= 5;",
      validationQuery: "SELECT police_id, anciennete_permis, puissance_fiscale, prime_annuelle FROM assures WHERE anciennete_permis < 10 AND puissance_fiscale >= 5;",
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
### Précédence des Opérateurs Booléens (\`AND\` vs \`OR\`) et Parenthésage

#### 🎓 Cours Théorique Approfondi

En logique booléenne et dans la norme ANSI SQL, l'opérateur de conjonction \`AND\` ($\\land$) possède une **priorité strictement supérieure** à l'opérateur de disjonction \`OR\` ($\\lor$), exactement comme la multiplication précède l'addition en arithmétique :

$$
A \\lor B \\land C \\equiv A \\lor (B \\land C) \\not\\equiv (A \\lor B) \\land C
$$

Par distributivité, forcer le parenthésage \`(A OR B) AND C\` revient en fait à imposer la condition $C$ aux **deux** branches :

$$
(A \\lor B) \\land C \\equiv (A \\land C) \\lor (B \\land C)
$$

**Impact en Contrôle de Souscription :**

Si un actuaire veut isoler les gros contrats ($\\text{prime} > 850\\text{ EUR}$) présentant soit un usage étendu (\`Tous Déplacements\`), soit une forte puissance ($\\ge 9\\text{ CV}$), oublier les parenthèses laisserait passer **tous** les contrats \`Tous Déplacements\` quelle que soit leur prime, faussant l'extraction de la cohorte cible !

#### 💻 Masterclass SQL

Le REPL ci-dessous prouve concrètement ce piège sur la table \`assures\` en comparant \`type_vehicule = 'Citadine' OR region = 'IDF' AND prime_annuelle > 1000\` (sans parenthèses : 7 lignes, laissant passer des Citadines à $490\\text{ EUR}$) avec la version parenthésée (3 lignes seulement au-dessus de $1\\,000\\text{ EUR}$).

\`\`\`sql
SELECT
  police_id,
  type_vehicule,
  region,
  prime_annuelle
FROM assures
WHERE (type_vehicule = 'Citadine' OR region = 'IDF') -- Parenthèses obligatoires !
  AND prime_annuelle > 1000;                         -- Appliqué aux deux branches
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT police_id, type_vehicule, region, prime_annuelle FROM assures WHERE type_vehicule = 'Citadine' OR region = 'IDF' AND prime_annuelle > 1000;
police_id  type_vehicule  region           prime_annuelle
---------  -------------  ---------------  --------------
1001       Citadine       IDF              850.5         
1003       Citadine       PACA             1150.0        
1004       SUV            IDF              1340.2        
1006       Citadine       Bretagne         490.0         
1007       Sportive       IDF              2100.0        
1010       Citadine       Hauts-de-France  780.0         
1011       Citadine       IDF              920.0

sqlite> SELECT police_id, type_vehicule, region, prime_annuelle FROM assures WHERE (type_vehicule = 'Citadine' OR region = 'IDF') AND prime_annuelle > 1000;
police_id  type_vehicule  region  prime_annuelle
---------  -------------  ------  --------------
1003       Citadine       PACA    1150.0        
1004       SUV            IDF     1340.2        
1007       Sportive       IDF     2100.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Appliquez strictement la précédence logique avec parenthèses pour isoler les contrats à forte exposition et prime supérieure à $850\\text{ EUR}$.

Sélectionnez \`police_id\`, \`usage\`, \`puissance_fiscale\` et \`prime_annuelle\` depuis \`assures\` pour \`(usage = 'Tous Déplacements' OR puissance_fiscale >= 9) AND prime_annuelle > 850\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT police_id, usage, puissance_fiscale, prime_annuelle FROM assures WHERE (usage = 'Tous Déplacements' OR puissance_fiscale >= 9) AND prime_annuelle > 850;",
      validationQuery: "SELECT police_id, usage, puissance_fiscale, prime_annuelle FROM assures WHERE (usage = 'Tous Déplacements' OR puissance_fiscale >= 9) AND prime_annuelle > 850;",
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
### Appartenance à un Ensemble Discret (\`IN\`) et Périls Majeurs

#### 🎓 Cours Théorique Approfondi

Tester l'appartenance d'un attribut $A$ à un ensemble fini de modalités $\\mathcal{E} = \\{v_1, v_2, \\dots, v_m\\}$ correspond en algèbre relationnelle à l'union des sélections élémentaires :

$$
\\sigma_{A \\in \\{v_1, \\dots, v_m\\}}(R) = \\bigcup_{k=1}^{m} \\sigma_{A = v_k}(R)
$$

Dans la nomenclature actuarielle IARD, les garanties \`'Vol'\` et \`'Incendie'\` forment un bloc homogène de **périls de dommages non-circulation** (souvent regroupés en *aléas externes / valeur vénale*), caractérisés par une **fréquence très faible** mais une **sévérité proche de la perte totale** (dans notre base : $18\\,500\\text{ EUR}$ pour le Vol et $9\\,400\\text{ EUR}$ pour l'Incendie, contre $400\\text{ EUR}$ en moyenne pour un Bris de Glace).

#### 💻 Masterclass SQL

L'opérateur \`IN ('Vol', 'Incendie')\` est syntaxiquement plus compact et maintenable que des \`OR\` en chaîne. En interne, SQLite trie la liste constante et effectue une recherche binaire $\\mathcal{O}(\\log m)$. **Attention** avec sa négation \`NOT IN (...)\` : si la liste contenait ne serait-ce qu'un \`NULL\`, \`x NOT IN ('Vol', NULL)\` renverrait \`UNKNOWN\` pour toute ligne et produirait 0 résultat !

\`\`\`sql
SELECT
  police_id,                  -- Identifiant du contrat
  region,                     -- Zonier géographique
  type_contrat,               -- Formule souscrite
  prime_annuelle              -- Prime annuelle en EUR
FROM assures
WHERE region IN ('IDF', 'PACA'); -- Sélection des deux zones urbaines denses
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT police_id, region, type_contrat, prime_annuelle FROM assures WHERE region IN ('IDF', 'PACA');
police_id  region  type_contrat  prime_annuelle
---------  ------  ------------  --------------
1001       IDF     Tous Risques  850.5         
1003       PACA    Tiers Simple  1150.0        
1004       IDF     Tous Risques  1340.2        
1007       IDF     Tous Risques  2100.0        
1011       IDF     Tiers Simple  920.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez les sinistres majeurs relevant des garanties Vol et Incendie.

Sélectionnez \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` lorsque \`nature_sinistre IN ('Vol', 'Incendie')\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre IN ('Vol', 'Incendie');",
      validationQuery: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres WHERE nature_sinistre IN ('Vol', 'Incendie');",
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
### Régimes Macroéconomiques, Équation de Fisher et Intervalle \`BETWEEN\`

#### 🎓 Cours Théorique Approfondi

L'opérateur \`BETWEEN a AND b\` sélectionne les observations appartenant à un intervalle fermé $[a, b]$ :

$$
x \\in [a, b] \\iff (a \\le x) \\land (x \\le b)
$$

**Lien Direct ALM & Taux Réels :**

En gestion actif-passif (ALM) d'assurance-vie et de provisions longues IARD, le niveau d'inflation HICP $\\pi_t$ agit sur deux canaux opposés :
1. **Passif** : revalorisation des rentes et dérive des coûts de réparation corporelle/matérielle.
2. **Actif** : rendement obligataire nominal $i_t$ (\`oat_10y\`) via la relation exacte de **Fisher** entre taux nominal $i_t$, taux réel ex-post $r_t$ et inflation $\\pi_t$ :

$$
1 + i_t = (1 + r_t)(1 + \\pi_t) \\implies r_t = \\frac{1 + i_t}{1 + \\pi_t} - 1 \\approx i_t - \\pi_t
$$

Filtrer les trimestres où $\\pi_t \\in [2.0\\%, 6.0\\%]$ isole les périodes de transition monétaire situées au-dessus de la cible de $2\\%$ de la BCE mais en deçà du choc inflationniste extrême de 2022 ($7.4\\%$ à $9.9\\%$).

#### 💻 Masterclass SQL

Dans \`BETWEEN a AND b\`, les deux bornes $a$ et $b$ sont **inclusives** et la borne inférieure doit impérativement précéder la borne supérieure ($a \\le b$ ; écrire \`BETWEEN 6.0 AND 2.0\` retourne toujours 0 ligne). On termine par \`ORDER BY periode ASC\` car les séries temporelles sont stockées au format ISO trimestriel \`'YYYY-QN'\` triable lexicographiquement.

\`\`\`sql
SELECT
  periode,            -- Trimestre ISO (ex: '2022-Q1')
  oat_10y,            -- Taux souverain français 10 ans (%)
  euribor_3m          -- Taux interbancaire court terme (%)
FROM macro_taux
WHERE oat_10y BETWEEN 0.0 AND 3.0  -- Bornes inclusives : 0.0 <= oat_10y <= 3.0
ORDER BY periode ASC;              -- Ordre chronologique garanti
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT periode, oat_10y, euribor_3m FROM macro_taux WHERE oat_10y BETWEEN 0.0 AND 3.0 ORDER BY periode ASC;
periode  oat_10y  euribor_3m
-------  -------  ----------
2021-Q2  0.14     -0.54     
2021-Q3  0.02     -0.55     
2021-Q4  0.2      -0.57     
2022-Q1  0.89     -0.5      
2022-Q2  1.92     -0.18     
2022-Q3  2.71     0.95      
2023-Q1  2.95     2.85
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Isolez les trimestres correspondant à un régime d'inflation intermédiaire entre $2.0\\%$ et $6.0\\%$ inclus.

Sélectionnez \`periode\`, \`inflation_hicp\` et \`oat_10y\` depuis \`macro_taux\` avec \`inflation_hicp BETWEEN 2.0 AND 6.0\`, ordonnés par \`periode ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT periode, inflation_hicp, oat_10y FROM macro_taux WHERE inflation_hicp BETWEEN 2.0 AND 6.0 ORDER BY periode ASC;",
      validationQuery: "SELECT periode, inflation_hicp, oat_10y FROM macro_taux WHERE inflation_hicp BETWEEN 2.0 AND 6.0 ORDER BY periode ASC;",
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
### Exercice de Survenance, Chain Ladder et Filtrage Lexical \`LIKE\`

#### 🎓 Cours Théorique Approfondi

En provisionnement non-vie (Solvabilité II / Best Estimate), les sinistres ne sont pas regroupés par date de saisie comptable mais par **exercice de survenance** $i$ (année du fait générateur \`date_survenance\`) et délai de liquidation $j$ pour construire le **triangle de Chain Ladder** des paiements cumulés $C_{i,j}$ :

$$
\\begin{array}{c|ccc}
\\text{Survenance } i & j=0 & j=1 & j=2 \\\\
\\hline
2020 & C_{2020,0} & C_{2020,1} & C_{2020,2} \\\\
2021 & C_{2021,0} & C_{2021,1} & \\cdot \\\\
2022 & C_{2022,0} & \\cdot & \\cdot
\\end{array}
$$

La différence entre \`date_declaration\` et \`date_survenance\` mesure le délai de déclaration $\\Delta_{\\text{décl}}$, à l'origine des provisions **IBNR** (*Incurred But Not Reported*). Pour extraire la ligne d'exercice de survenance $i = 2022$ depuis des dates ISO-8601 \`'YYYY-MM-DD'\`, on applique un filtre par préfixe \`LIKE '2022-%'\`.

#### 💻 Masterclass SQL

L'opérateur \`LIKE\` supporte deux jokers standards : \`%\` (zéro, un ou plusieurs caractères quelconques) et \`_\` (exactement un caractère). **Astuce de performance** : un motif préfixé comme \`'2022-%'\` (sans joker au début) permet à un optimiseur B-Tree d'effectuer une recherche par intervalle (\`>= '2022-' AND < '2022.'\`), contrairement à \`'%2022%'\` qui force un balayage complet de la table. Note : en SQLite, \`LIKE\` est insensible à la casse pour les lettres ASCII par défaut.

\`\`\`sql
SELECT
  sinistre_id,          -- Identifiant du sinistre
  date_survenance,      -- Date du fait générateur (exercice de survenance)
  date_declaration,     -- Date d'ouverture chez l'assureur (délai IBNR)
  cout_total
FROM sinistres
WHERE date_survenance LIKE '2021-%'; -- Exercice de survenance 2021 uniquement
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT sinistre_id, date_survenance, date_declaration, cout_total FROM sinistres WHERE date_survenance LIKE '2021-%';
sinistre_id  date_survenance  date_declaration  cout_total
-----------  ---------------  ----------------  ----------
501          2021-08-14       2021-08-16        1450.0    
506          2021-03-22       2021-03-25        9400.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez l'ensemble des sinistres appartenant à l'exercice de survenance \`2022\`.

Sélectionnez \`sinistre_id\`, \`date_survenance\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` où \`date_survenance LIKE '2022-%'\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, date_survenance, nature_sinistre, cout_total FROM sinistres WHERE date_survenance LIKE '2022-%';",
      validationQuery: "SELECT sinistre_id, date_survenance, nature_sinistre, cout_total FROM sinistres WHERE date_survenance LIKE '2022-%';",
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
### Logique Ternaire de Kleene (\`NULL\`) et Sinistres Corporels (\`IS NOT NULL\`)

#### 🎓 Cours Théorique Approfondi

Dans le modèle relationnel SQL, \`NULL\` n'est **pas** une valeur numérique ni une chaîne vide : c'est un marqueur d'absence d'information qui force l'usage de la **logique ternaire de Kleene** $\\mathcal{L}_3 = \\{V, F, U\\}$ (*True, False, Unknown*) :

$$
(\\text{NULL} = \\text{NULL}) \\to U, \\qquad (\\text{NULL} \\neq 0) \\to U, \\qquad (V \\land U) \\to U, \\qquad (V \\lor U) \\to V
$$

Comme une clause \`WHERE\` ne retient une ligne que si le prédicat vaut strictement $V$ (*True*), écrire \`WHERE cout_corporel != NULL\` ou \`WHERE cout_corporel = NULL\` évalue tout à $U$ et retourne **0 ligne**. Seuls \`IS NULL\` et \`IS NOT NULL\` sont des prédicats bivalents ($\\to \\{V, F\\}$).

**Sens Actuariel (Matériel vs Corporel) :**

Dans la table \`sinistres\`, \`cout_corporel\` vaut \`NULL\` lorsqu'aucune victime corporelle n'est impliquée (6 dossiers sur 8), et est renseigné dès qu'un préjudice corporel existe (2 dossiers : \`503\` et \`505\`). Isoler \`IS NOT NULL\` permet de séparer les sinistres **corporels à développement long** (rentes, consolidation médicale sur 10–20 ans, forte volatilité) des sinistres purement matériels à liquidation rapide.

#### 💻 Masterclass SQL

Le terminal SQLite ci-dessous utilise \`.nullvalue NULL\` pour rendre visibles les champs nuls (sinon SQLite affiche un blanc en mode colonne). Observez que \`IS NULL\` capture les 6 dossiers purement matériels, complément exact des dossiers corporels.

\`\`\`sql
SELECT
  sinistre_id,              -- Numéro du sinistre
  nature_sinistre,          -- Type d'événement
  cout_dommages_materiels,  -- Coût matériel (toujours NOT NULL)
  cout_corporel             -- NULL si aucun préjudice corporel
FROM sinistres
WHERE cout_corporel IS NULL; -- Prédicat bivalent testant l'absence de corporel
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT sinistre_id, nature_sinistre, cout_dommages_materiels, cout_corporel FROM sinistres WHERE cout_corporel IS NULL;
sinistre_id  nature_sinistre  cout_dommages_materiels  cout_corporel
-----------  ---------------  -----------------------  -------------
501          Collision        1450.0                   NULL         
502          Bris de Glace    420.0                    NULL         
504          Vol              18500.0                  NULL         
506          Incendie         9400.0                   NULL         
507          Bris de Glace    380.0                    NULL         
508          Collision        2100.0                   NULL
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Isolez uniquement les dossiers ayant entraîné un dommage corporel renseigné.

Sélectionnez \`sinistre_id\`, \`police_id\`, \`cout_corporel\` et \`cout_total\` depuis \`sinistres\` lorsque \`cout_corporel IS NOT NULL\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, police_id, cout_corporel, cout_total FROM sinistres WHERE cout_corporel IS NOT NULL;",
      validationQuery: "SELECT sinistre_id, police_id, cout_corporel, cout_total FROM sinistres WHERE cout_corporel IS NOT NULL;",
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
### Statistiques d'Ordre, Loi de Pareto et Top Losses (\`ORDER BY\` & \`LIMIT\`)

#### 🎓 Cours Théorique Approfondi

Soit $X_{(1)} \\le X_{(2)} \\le \\dots \\le X_{(n)}$ les **statistiques d'ordre** des coûts de sinistres. Dans les branches IARD à queue lourde (Pareto, Log-Normale), une minorité de dossiers extrêmes concentre l'essentiel de la charge financière. On mesure cette concentration par le ratio du Top-$k$ :

$$
\\text{CR}_k = \\frac{\\sum_{i=1}^{k} X_{(n - i + 1)}}{\\sum_{j=1}^{n} X_j}
$$

Dans notre portefeuille de $8$ sinistres (charge totale $48\\,950\\text{ EUR}$), les 4 plus gros dossiers (\`18 500 + 11 700 + 9 400 + 5 000 = 44 600 EUR\`) concentrent à eux seuls :

$$
\\text{CR}_4 = \\frac{44\\,600}{48\\,950} \\approx 91.11\\%
$$

de la charge totale ! Identifier ces *Top Losses* est essentiel pour le comité des sinistres graves et l'audit des cessions de réassurance.

#### 💻 Masterclass SQL

Dans l'ordre d'exécution SQL, \`ORDER BY\` s'exécute **après** \`SELECT\` et **avant** \`LIMIT\`. Lorsque \`ORDER BY ... DESC LIMIT k\` est combiné, un moteur SQL moderne utilise un tri partiel par tas (*Bounded Heap Sort*) de complexité $\\mathcal{O}(N \\log k)$ au lieu d'un tri complet $\\mathcal{O}(N \\log N)$. Attention : \`LIMIT\` sans \`ORDER BY\` retourne des lignes arbitraires selon l'ordre physique de stockage.

\`\`\`sql
SELECT
  police_id,            -- Identifiant du contrat
  type_vehicule,        -- Catégorie de véhicule
  puissance_fiscale,    -- Puissance en CV
  prime_annuelle        -- Cotisation annuelle
FROM assures
ORDER BY prime_annuelle DESC -- Tri décroissant des primes
LIMIT 4;                     -- Conservation des 4 contrats les plus chers
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT police_id, type_vehicule, puissance_fiscale, prime_annuelle FROM assures ORDER BY prime_annuelle DESC LIMIT 4;
police_id  type_vehicule  puissance_fiscale  prime_annuelle
---------  -------------  -----------------  --------------
1007       Sportive       11                 2100.0        
1004       SUV            9                  1340.2        
1003       Citadine       4                  1150.0        
1011       Citadine       4                  920.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez les 4 dossiers de sinistres les plus coûteux du portefeuille.

Sélectionnez \`sinistre_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\`, triés par \`cout_total DESC\` avec \`LIMIT 4\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres ORDER BY cout_total DESC LIMIT 4;",
      validationQuery: "SELECT sinistre_id, nature_sinistre, cout_total FROM sinistres ORDER BY cout_total DESC LIMIT 4;",
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
### Modèle Collectif, Prime Pure $F \\times C$ et Agrégats (\`COUNT\`, \`SUM\`, \`AVG\`)

#### 🎓 Cours Théorique Approfondi

Dans le modèle collectif du risque de Cramér–Lundberg, la charge totale annuelle des sinistres s'écrit comme une somme aléatoire :

$$
S = \\sum_{i=1}^{N_{\\text{sin}}} C_i
$$

Sous hypothèse d'indépendance entre la fréquence $N_{\\text{sin}}$ et la sévérité individuelle $C_i$, le théorème de Wald donne l'espérance de charge, d'où découle la **prime pure** $\\Pi_{\\text{pure}}$ rapportée aux $N_{\\text{pol}}$ polices exposées :

$$
\\Pi_{\\text{pure}} = \\underbrace{\\frac{N_{\\text{sin}}}{N_{\\text{pol}}}}_{\\text{Fréquence } F} \\times \\underbrace{\\left( \\frac{1}{N_{\\text{sin}}} \\sum_{i=1}^{N_{\\text{sin}}} C_i \\right)}_{\\text{Coût Moyen (Sévérité) } \\bar{C}} = \\frac{\\sum_{i=1}^{N_{\\text{sin}}} C_i}{N_{\\text{pol}}}
$$

Ici, les 3 agrégats \`COUNT(*)\`, \`SUM(cout_total)\` et \`AVG(cout_total)\` calculent simultanément le dénombrement $N_{\\text{sin}}$, la charge totale $S$ et la sévérité moyenne $\\bar{C}$.

#### 💻 Masterclass SQL

**Piège critique de l'agrégation SQL face aux \`NULL\`** :
- \`COUNT(*)\` compte **toutes** les lignes de la table (y compris celles ayant des champs \`NULL\`).
- \`COUNT(colonne)\`, \`SUM(colonne)\` et \`AVG(colonne)\` **excluent les \`NULL\`** aussi bien au numérateur qu'au dénominateur !
Ainsi, comme le prouve le REPL ci-dessous sur \`cout_corporel\`, \`AVG(cout_corporel)\` divise $5\\,700$ par $2$ (les 2 dossiers corporels : $2\\,850\\text{ EUR}$) et **non** par $8$ (l'ensemble des sinistres) !

\`\`\`sql
SELECT
  COUNT(*) AS total_lignes,                -- 8 dossiers sinistres au total
  COUNT(cout_corporel) AS nb_corporels,    -- Seulement 2 dossiers non nuls
  ROUND(SUM(cout_corporel), 2) AS somme_corp,
  ROUND(AVG(cout_corporel), 2) AS moy_sur_corporels -- Moyenne sur 2 dossiers (= 2850.0)
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT COUNT(*) AS total_lignes, COUNT(cout_corporel) AS nb_corporels, ROUND(SUM(cout_corporel), 2) AS somme_corp, ROUND(AVG(cout_corporel), 2) AS moy_sur_corporels FROM sinistres;
total_lignes  nb_corporels  somme_corp  moy_sur_corporels
------------  ------------  ----------  -----------------
8             2             5700.0      2850.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Produisez le bilan agrégé de sinistralité (effectif, charge totale et sévérité moyenne) sur la table \`sinistres\`.

Calculez \`COUNT(*) AS nb_sinistres\`, \`ROUND(SUM(cout_total), 2) AS charge_totale\` et \`ROUND(AVG(cout_total), 2) AS cout_moyen\` depuis \`sinistres\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT COUNT(*) AS nb_sinistres, ROUND(SUM(cout_total), 2) AS charge_totale, ROUND(AVG(cout_total), 2) AS cout_moyen FROM sinistres;",
      validationQuery: "SELECT COUNT(*) AS nb_sinistres, ROUND(SUM(cout_total), 2) AS charge_totale, ROUND(AVG(cout_total), 2) AS cout_moyen FROM sinistres;",
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
### Étendue Historique des Taux, Duration et Calibration ALM (\`MIN\`, \`MAX\`)

#### 🎓 Cours Théorique Approfondi

En Gestion Actif-Passif (ALM) et sous Solvabilité II, la calibration des scénarios de stress de taux d'intérêt repose sur l'observation des bornes historiques (étendue empirique / *range*) :

$$
\\Delta y_{\\text{hist}} = \\max_{t} y_t - \\min_{t} y_t
$$

Entre \`2020-Q1\` et \`2023-Q4\`, l'Euribor 3 mois a basculé des taux négatifs ($-0.57\\%$) vers $+3.92\\%$, soit un choc de $+449\\text{ bps}$. Pour un portefeuille obligataire de duration modifiée $D^*$ et de convexité $\\mathcal{C}$, la variation relative de valeur de marché sous un choc parallèle $\\Delta y$ s'approxime par le développement de Taylor d'ordre 2 :

$$
\\frac{\\Delta V}{V} \\approx -D^* \\Delta y + \\frac{1}{2} \\mathcal{C} (\\Delta y)^2
$$

Parallèlement, le pic d'inflation HICP ($\\max \\pi_t$) permet de dimensionner les scénarios de choc inflationniste sur les provisions techniques IARD et les frais généraux.

#### 💻 Masterclass SQL

Une requête contenant exclusivement des fonctions d'agrégation scalaires (\`MIN\`, \`MAX\`, \`COUNT\`, \`SUM\`, \`AVG\`) sans \`GROUP BY\` compresse toute la table en **exactement 1 ligne** résultante. \`MIN\` et \`MAX\` fonctionnent de façon générique sur les types \`REAL\`, \`INTEGER\` et \`TEXT\` (ordre lexicographique pour les dates ISO) en ignorant les valeurs \`NULL\`.

\`\`\`sql
SELECT
  MIN(oat_10y) AS oat_min,                          -- Plancher historique de l'OAT 10Y
  MAX(oat_10y) AS oat_max,                          -- Sommet historique de l'OAT 10Y
  ROUND(MAX(oat_10y) - MIN(oat_10y), 2) AS amplitude_oat, -- Étendue en points de %
  MAX(spread_credit_bbb) AS spread_max              -- Tension maximale sur le crédit BBB
FROM macro_taux;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT MIN(oat_10y) AS oat_min, MAX(oat_10y) AS oat_max, ROUND(MAX(oat_10y) - MIN(oat_10y), 2) AS amplitude_oat, MAX(spread_credit_bbb) AS spread_max FROM macro_taux;
oat_min  oat_max  amplitude_oat  spread_max
-------  -------  -------------  ----------
-0.34    3.4      3.74           1.95
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Relevez les bornes extrêmes du cycle monétaire et du pic inflationniste dans \`macro_taux\`.

Sélectionnez \`MIN(euribor_3m) AS euribor_min\`, \`MAX(euribor_3m) AS euribor_max\` et \`MAX(inflation_hicp) AS inflation_max\` depuis \`macro_taux\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT MIN(euribor_3m) AS euribor_min, MAX(euribor_3m) AS euribor_max, MAX(inflation_hicp) AS inflation_max FROM macro_taux;",
      validationQuery: "SELECT MIN(euribor_3m) AS euribor_min, MAX(euribor_3m) AS euribor_max, MAX(inflation_hicp) AS inflation_max FROM macro_taux;",
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
### Segmentation par Formule (\`GROUP BY\`), Variance Inter-Classes et Paradoxe de Simpson

#### 🎓 Cours Théorique Approfondi

L'opérateur de regroupement $\\gamma_{G,\\,\\text{agg}(A)}(R)$ partitionne le portefeuille selon chaque modalité $g \\in \\mathcal{G}$ (ici \`type_contrat\`) et calcule l'**espérance conditionnelle empirique** :

$$
\\hat{\\mu}_g = \\mathbb{E}[P \\mid G = g] = \\frac{1}{n_g} \\sum_{i \\in g} P_i
$$

Par la formule de décomposition de la variance (Huygens / ANOVA), la dispersion totale des primes se scinde entre variance **inter-classes** (expliquée par le facteur $G$) et variance **intra-classe** :

$$
\\operatorname{Var}(P) = \\operatorname{Var}\\big(\\mathbb{E}[P \\mid G]\\big) + \\mathbb{E}\\big[\\operatorname{Var}(P \\mid G)\\big]
$$

**Lecture Actuarielle (Effet de Structure / Paradoxe de Simpson) :**

Sur notre portefeuille, ne soyez pas surpris si la prime moyenne du \`Tiers Simple\` ($1\\,035.00\\text{ EUR}$) dépasse celle du \`Tiers Étendu\` ($585.00\\text{ EUR}$) ! C'est un **effet de structure** : les 2 contrats \`Tiers Simple\` sont souscrits par de jeunes conducteurs urbains (\`CRM\` $0.95$–$1.05$), alors que les 3 contrats \`Tiers Étendu\` sont détenus par des conducteurs seniors à bonus maximal (\`CRM\` $0.50$–$0.54$). Seule une modélisation multivariée (GLM) isole l'effet pur de la garantie.

#### 💻 Masterclass SQL

Le moteur SQL applique le paradigme *Split – Apply – Combine* : il groupe les lignes ayant la même valeur de \`type_contrat\`, applique \`COUNT(*)\` et \`AVG(prime_annuelle)\` indépendamment sur chaque groupe, puis trie les groupes avec \`ORDER BY\`. **Règle stricte** : toute colonne du \`SELECT\` non agrégée doit impérativement figurer dans \`GROUP BY\`.

\`\`\`sql
SELECT
  type_vehicule,                                  -- Dimension de segmentation
  COUNT(*) AS nb_polices,                         -- Effectif n_g de chaque strate
  ROUND(AVG(prime_annuelle), 2) AS prime_moyenne  -- Espérance conditionnelle par véhicule
FROM assures
GROUP BY type_vehicule                            -- Partitionnement en 5 strates
ORDER BY prime_moyenne DESC;                      -- Classement sur l'alias calculé dans SELECT
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT type_vehicule, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_vehicule ORDER BY prime_moyenne DESC;
type_vehicule  nb_polices  prime_moyenne
-------------  ----------  -------------
Sportive       1           2100.0       
SUV            1           1340.2       
Monospace      1           890.3        
Citadine       5           838.1        
Berline        4           696.45
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Segmentez le portefeuille par formule tarifaire (\`type_contrat\`).

Calculez pour chaque \`type_contrat\` : \`COUNT(*) AS nb_polices\` et \`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne\` depuis \`assures\`, groupés par \`type_contrat\` et ordonnés par \`prime_moyenne DESC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT type_contrat, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_contrat ORDER BY prime_moyenne DESC;",
      validationQuery: "SELECT type_contrat, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY type_contrat ORDER BY prime_moyenne DESC;",
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
### Ventilation de la Sinistralité par Péril (\`GROUP BY\` sur \`sinistres\`)

#### 🎓 Cours Théorique Approfondi

En tarification par péril (*Peril-by-Peril Pricing*), la charge totale $S_{\\text{total}}$ est décomposée selon la nature de l'événement $p \\in \\{\\text{Collision},\\, \\text{Vol},\\, \\text{Incendie},\\, \\text{Bris de Glace}\\}$ :

$$
S_{\\text{total}} = \\sum_{p \\in \\mathcal{P}} S_p = \\sum_{p \\in \\mathcal{P}} N_p \\cdot \\bar{C}_p
$$

Cette ventilation révèle deux régimes actuariels opposés :
- **Périls fréquents à sévérité modérée/mixte** : *Bris de Glace* ($2$ dossiers, $400\\text{ EUR}$ en moyenne) et *Collision* ($4$ dossiers).
- **Périls rares à sévérité extrême** : *Vol* ($1$ seul dossier à $18\\,500\\text{ EUR}$) et *Incendie* ($1$ dossier à $9\\,400\\text{ EUR}$), pour lesquels la tarification repose sur la valeur vénale du véhicule et la géolocalisation du stationnement.

#### 💻 Masterclass SQL

Remarquez que \`ORDER BY cout_cumule DESC\` utilise directement l'alias défini dans \`SELECT\`. Cela est parfaitement valide car le moteur logique évalue \`SELECT\` (étape 5) **avant** \`ORDER BY\` (étape 6) — contrairement à \`WHERE\` (étape 2) et \`GROUP BY\` (étape 3) qui ne voient pas les alias du \`SELECT\`.

\`\`\`sql
SELECT
  statut_dossier,                             -- Dimension : Clos vs En cours (PSAP)
  COUNT(*) AS nb_dossiers,                    -- Nombre de sinistres par statut
  ROUND(SUM(cout_total), 2) AS cout_cumule,   -- Charge cumulée
  ROUND(AVG(cout_total), 2) AS cout_moyen     -- Sévérité moyenne par statut
FROM sinistres
GROUP BY statut_dossier
ORDER BY cout_cumule DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT statut_dossier, COUNT(*) AS nb_dossiers, ROUND(SUM(cout_total), 2) AS cout_cumule, ROUND(AVG(cout_total), 2) AS cout_moyen FROM sinistres GROUP BY statut_dossier ORDER BY cout_cumule DESC;
statut_dossier  nb_dossiers  cout_cumule  cout_moyen
--------------  -----------  -----------  ----------
Clos            7            37250.0      5321.43   
En cours        1            11700.0      11700.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Classez les périls par coût cumulé décroissant pour identifier les principaux postes d'indemnisation.

Sélectionnez \`nature_sinistre\`, \`COUNT(*) AS nb_dossiers\` et \`ROUND(SUM(cout_total), 2) AS cout_cumule\` depuis \`sinistres\`, groupés par \`nature_sinistre\` et ordonnés par \`cout_cumule DESC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT nature_sinistre, COUNT(*) AS nb_dossiers, ROUND(SUM(cout_total), 2) AS cout_cumule FROM sinistres GROUP BY nature_sinistre ORDER BY cout_cumule DESC;",
      validationQuery: "SELECT nature_sinistre, COUNT(*) AS nb_dossiers, ROUND(SUM(cout_total), 2) AS cout_cumule FROM sinistres GROUP BY nature_sinistre ORDER BY cout_cumule DESC;",
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
### Crédibilité Statistique des Segments et Filtrage de Groupes (\`HAVING\`)

#### 🎓 Cours Théorique Approfondi

Dans la théorie actuarielle de la **crédibilité de Bühlmann**, l'estimateur empirique de prime sur un segment $k$ d'effectif $n_k$ possède une variance d'échantillonnage inversement proportionnelle à sa taille :

$$
\\operatorname{Var}(\\bar{X}_k) = \\frac{\\sigma^2}{n_k}, \\qquad Z_k = \\frac{n_k}{n_k + K}
$$

où $Z_k \\in [0, 1]$ est le facteur de crédibilité accordé à l'expérience propre du segment. Si $n_k$ est trop faible (par ex. $n_k = 1$ ou $2$), la crédibilité $Z_k$ est insuffisante pour tirer une conclusion tarifaire fiable. Imposer un effectif minimal via \`HAVING COUNT(*) >= 3\` élimine les strates sous-représentées (*minimum exposure rule*).

#### 💻 Masterclass SQL

**Pipeline strict d'exécution SQL :**

$$
\\text{FROM} \\longrightarrow \\text{WHERE (lignes)} \\longrightarrow \\text{GROUP BY} \\longrightarrow \\text{HAVING (groupes)} \\longrightarrow \\text{SELECT} \\longrightarrow \\text{ORDER BY}
$$

\`WHERE\` filtre les lignes individuelles *avant* agrégation, tandis que \`HAVING\` filtre les groupes *après* agrégation. Écrire \`WHERE COUNT(*) >= 3\` provoque immédiatement une erreur SQL (\`misuse of aggregate\`) car les groupes n'existent pas encore lors de l'étape \`WHERE\`.

\`\`\`sql
SELECT
  region,                                         -- Clé de regroupement géographique
  COUNT(*) AS nb_polices,                         -- Taille de l'exposition régionale
  ROUND(AVG(prime_annuelle), 2) AS prime_moyenne  -- Prime moyenne sur les régions crédibles
FROM assures
GROUP BY region
HAVING COUNT(*) >= 2                              -- Filtre post-agrégation sur l'effectif
ORDER BY nb_polices DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT region, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY region HAVING COUNT(*) >= 2 ORDER BY nb_polices DESC;
region  nb_polices  prime_moyenne
------  ----------  -------------
IDF     4           1302.67
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez uniquement les catégories d'\`usage\` statistiquement représentatives ($n \\ge 3$ polices).

Affichez \`usage\`, \`COUNT(*) AS nb_polices\` et \`ROUND(AVG(prime_annuelle), 2) AS prime_moyenne\` depuis \`assures\`, groupés par \`usage\` avec \`HAVING COUNT(*) >= 3\`, ordonnés par \`usage ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT usage, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY usage HAVING COUNT(*) >= 3 ORDER BY usage ASC;",
      validationQuery: "SELECT usage, COUNT(*) AS nb_polices, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures GROUP BY usage HAVING COUNT(*) >= 3 ORDER BY usage ASC;",
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
### Chaîne de Markov du Bonus-Malus (CRM) et Branchements \`CASE WHEN\`

#### 🎓 Cours Théorique Approfondi

En assurance automobile française (article A121-1 du Code des assurances), le **Coefficient de Réduction-Majoration (CRM)** $C_t \\in [0.50, 3.50]$ évolue d'une année à l'autre comme une **Chaîne de Markov discrète** déterminée par le nombre $K_t$ de sinistres responsables survenus durant l'exercice :

$$
C_{t+1} =
\\begin{cases}
\\max(0.50,\\; 0.95 \\cdot C_t) & \\text{si } K_t = 0 \\text{ (réduction de } 5\\% \\text{)} \\\\
\\min(3.50,\\; 1.25^{K_t} \\cdot C_t) & \\text{si } K_t \\ge 1 \\text{ (majoration de } +25\\% \\text{ par sinistre)}
\\end{cases}
$$

(avec une majoration réduite à $+12.5\\%$ en cas de responsabilité partagée à $50\\%$). Après $13$ années consécutives sans sinistre responsable ($0.95^{13} \\approx 0.513$, puis $0.50$), le conducteur atteint l'état plancher **Bonus Max ($C = 0.50$)** où la loi crée un fort phénomène de rétention et de sous-déclaration des petits sinistres (*hunger for bonus*).

#### 💻 Masterclass SQL

L'instruction \`CASE WHEN ... THEN ... ELSE ... END\` réalise une évaluation **séquentielle court-circuitée** : dès que la première branche \`WHEN\` est vraie, SQLite retourne son \`THEN\` et ignore les suivantes. **Attention à l'ordre** : tester \`bonus_malus = 0.50\` **impérativement avant** \`bonus_malus < 1.0\` (car $0.50 < 1.0$ !). Toujours inclure \`ELSE\` pour éviter que les cas non couverts ne produisent \`NULL\`.

\`\`\`sql
SELECT
  police_id,
  age,
  CASE
    WHEN age < 25 THEN 'Jeune (<25)'     -- Branche 1 testée en premier
    WHEN age <= 55 THEN 'Actif (25-55)'  -- Branche 2 (implique déjà age >= 25)
    ELSE 'Senior (>55)'                  -- Branche par défaut (age > 55)
  END AS tranche_age                     -- Alias de la variable discrétisée
FROM assures
ORDER BY police_id ASC
LIMIT 6;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT police_id, age, CASE WHEN age < 25 THEN 'Jeune (<25)' WHEN age <= 55 THEN 'Actif (25-55)' ELSE 'Senior (>55)' END AS tranche_age FROM assures ORDER BY police_id ASC LIMIT 6;
police_id  age  tranche_age  
---------  ---  -------------
1001       28   Actif (25-55)
1002       45   Actif (25-55)
1003       22   Jeune (<25)  
1004       58   Senior (>55) 
1005       34   Actif (25-55)
1006       67   Senior (>55)
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Segmentez l'ensemble du portefeuille en trois classes réglementaires de Bonus-Malus (\`profil_crm\`).

Sélectionnez \`police_id\`, \`bonus_malus\` et la colonne calculée \`profil_crm\` valant \`'Bonus Max'\` si \`bonus_malus = 0.50\`, \`'Bonus Standard'\` si \`bonus_malus < 1.0\`, sinon \`'Malus'\` depuis \`assures\`, ordonnés par \`police_id ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT police_id, bonus_malus, CASE WHEN bonus_malus = 0.50 THEN 'Bonus Max' WHEN bonus_malus < 1.0 THEN 'Bonus Standard' ELSE 'Malus' END AS profil_crm FROM assures ORDER BY police_id ASC;",
      validationQuery: "SELECT police_id, bonus_malus, CASE WHEN bonus_malus = 0.50 THEN 'Bonus Max' WHEN bonus_malus < 1.0 THEN 'Bonus Standard' ELSE 'Malus' END AS profil_crm FROM assures ORDER BY police_id ASC;",
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
### Fonction Indicatrice $\\mathbf{1}_A$ et Incidence Conditionnelle (\`SUM + CASE WHEN\`)

#### 🎓 Cours Théorique Approfondi

Pour tout événement de risque $A = \\{X \\ge s\\}$ (ici la survenance d'un sinistre grave $C \\ge 5\\,000\\text{ EUR}$), la probabilité d'occurrence s'exprime comme l'espérance d'une **variable indicatrice** de Bernoulli $\\mathbf{1}_A(X) \\in \\{0, 1\\}$ :

$$
p_A = \\mathbb{P}(X \\ge s) = \\mathbb{E}[\\mathbf{1}_A(X)] \\implies \\hat{p}_A = \\frac{1}{N} \\sum_{i=1}^{N} \\mathbf{1}_{\\{X_i \\ge s\\}}
$$

En combinant \`COUNT(*)\` (dénominateur $N$) et \`SUM(CASE WHEN ... THEN 1 ELSE 0 END)\` (numérateur $\\sum \\mathbf{1}_A$), on calcule en un seul balayage de table des comptages multi-critères et des **taux d'incidence conditionnels** (proportion de sinistres graves, taux de défaut Bâle III, tableaux croisés pivotés).

#### 💻 Masterclass SQL

Le patron \`SUM(CASE WHEN cond THEN 1 ELSE 0 END)\` est 100 % portable dans tous les SGBD (PostgreSQL, DuckDB, Snowflake, BigQuery, SQLite). **Précaution vitale** : n'omettez jamais \`ELSE 0\` ! Si vous écrivez \`ELSE NULL\` (ou rien), \`SUM\` renverra \`NULL\` au lieu de \`0\` dans le cas où aucune ligne ne valide la condition. Notez que \`COUNT(CASE WHEN cond THEN 1 END)\` fonctionne aussi sans \`ELSE 0\`, mais \`SUM(... 1 ELSE 0)\` est le standard lisible du marché.

\`\`\`sql
SELECT
  COUNT(*) AS total_polices,                                        -- Effectif total N = 12
  SUM(CASE WHEN region = 'IDF' THEN 1 ELSE 0 END) AS nb_idf,        -- Sous-population IDF
  SUM(CASE WHEN bonus_malus = 0.50 THEN 1 ELSE 0 END) AS nb_bonus_max -- Sous-population Bonus 50
FROM assures;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT COUNT(*) AS total_polices, SUM(CASE WHEN region = 'IDF' THEN 1 ELSE 0 END) AS nb_idf, SUM(CASE WHEN bonus_malus = 0.50 THEN 1 ELSE 0 END) AS nb_bonus_max FROM assures;
total_polices  nb_idf  nb_bonus_max
-------------  ------  ------------
12             4       4
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Dénombrez sur une seule ligne de reporting le volume total de sinistres et l'effectif des dossiers graves ($\\ge 5\\,000\\text{ EUR}$).

Calculez \`COUNT(*) AS total_dossiers\` et \`SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves\` sur la table \`sinistres\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT COUNT(*) AS total_dossiers, SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves FROM sinistres;",
      validationQuery: "SELECT COUNT(*) AS total_dossiers, SUM(CASE WHEN cout_total >= 5000 THEN 1 ELSE 0 END) AS nb_sinistres_graves FROM sinistres;",
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
### Audit Comptable, Élément Absorbant \`NULL\` et Imputation \`COALESCE\`

#### 🎓 Cours Théorique Approfondi

En algèbre SQL, \`NULL\` agit comme un **élément absorbant** pour les opérateurs arithmétiques ($+, -, \\times, /$) :

$$
x + \\text{NULL} = \\text{NULL}, \\qquad x \\times \\text{NULL} = \\text{NULL}
$$

Dans le contrôle de qualité des données exigé par Solvabilité II (*Data Quality Governance*), l'actuaire audite l'identité comptable entre le coût total déclaré et la somme de ses composantes matérielle et corporelle :

$$
C_{\\text{total},\\,i} \\stackrel{?}{=} C_{\\text{mat},\\,i} + \\text{COALESCE}(C_{\\text{corp},\\,i},\\, 0.0)
$$

**Condition de validité métier :** imputer \`NULL\` par \`0.0\` via \`COALESCE\` n'est légitime ici que parce que le schéma spécifie que \`cout_corporel = NULL\` signifie *« aucun dommage corporel »* (et non *« coût corporel survenu mais encore inconnu »*, auquel cas imputer \`0\` sous-estimerait gravement les provisions !).

#### 💻 Masterclass SQL

\`COALESCE(a, b, ...)\` (fonction standard ANSI) évalue ses arguments de gauche à droite et retourne le premier qui n'est pas \`NULL\`. Passer \`0.0\` (littéral flottant \`REAL\`) plutôt que \`0\` garantit le maintien du typage flottant de la colonne résultante.

\`\`\`sql
SELECT
  sinistre_id,
  cout_dommages_materiels + cout_corporel AS sans_coalesce, -- Donne NULL sur 6 dossiers !
  ROUND(
    cout_total - (cout_dommages_materiels + COALESCE(cout_corporel, 0.0)),
    2
  ) AS ecart_audit                                          -- Écart comptable = 0.0 partout
FROM sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT sinistre_id, cout_dommages_materiels + cout_corporel AS sans_coalesce, ROUND(cout_total - (cout_dommages_materiels + COALESCE(cout_corporel, 0.0)), 2) AS ecart_audit FROM sinistres;
sinistre_id  sans_coalesce  ecart_audit
-----------  -------------  -----------
501          NULL           0.0        
502          NULL           0.0        
503          5000.0         0.0        
504          NULL           0.0        
505          11700.0        0.0        
506          NULL           0.0        
507          NULL           0.0        
508          NULL           0.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Reconstituez la charge totale de chaque dossier sinistre en neutralisant les \`NULL\` corporels par \`0.0\`.

Sélectionnez \`sinistre_id\`, \`cout_dommages_materiels\`, \`COALESCE(cout_corporel, 0.0) AS corporel_net\` et \`ROUND(cout_dommages_materiels + COALESCE(cout_corporel, 0.0), 2) AS total_reconstitue\` depuis \`sinistres\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, cout_dommages_materiels, COALESCE(cout_corporel, 0.0) AS corporel_net, ROUND(cout_dommages_materiels + COALESCE(cout_corporel, 0.0), 2) AS total_reconstitue FROM sinistres;",
      validationQuery: "SELECT sinistre_id, cout_dommages_materiels, COALESCE(cout_corporel, 0.0) AS corporel_net, ROUND(cout_dommages_materiels + COALESCE(cout_corporel, 0.0), 2) AS total_reconstitue FROM sinistres;",
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
### Jointure Interne (\`INNER JOIN\`) et Zonier Géographique IDF

#### 🎓 Cours Théorique Approfondi

Dans un modèle relationnel normalisé de type **Schéma en Étoile**, les attributs du risque (âge, région, véhicule, prime) vivent dans la table de contrats \`assures\` (cardinalité $1$), tandis que les événements sinistres vivent dans la table de faits \`sinistres\` (cardinalité $N$). L'opérateur d'**équi-jointure interne** :

$$
\\sigma_{\\text{region} = \\text{'IDF'}}\\big(\\text{assures} \\bowtie_{\\text{police\\_id}} \\text{sinistres}\\big)
$$

ne conserve que les paires $(a, s)$ partageant la même clé \`police_id\` et satisfaisant le filtre régional.

**Précaution Actuarielle Majeure :**

Un \`INNER JOIN\` exclut automatiquement les assurés d'IDF n'ayant déclaré aucun sinistre (et duplique ceux ayant plusieurs sinistres). Il est donc parfaitement adapté pour analyser la **liste des dossiers sinistres survenus en IDF** (zonier de sévérité, coût moyen des réparations urbaines), mais **strictement proscrit** pour calculer une fréquence d'incidence ou un ratio $S/P$ !

#### 💻 Masterclass SQL

Le schéma définit un index \`idx_sinistres_police ON sinistres(police_id)\` qui permet au moteur SQLite d'exécuter la jointure en temps quasi-logarithmique plutôt que par produit cartésien $\\mathcal{O}(|A| \\times |S|)$. Préfixer chaque colonne avec l'alias de table (\`a.\` et \`s.\`) évite toute ambiguïté sur \`police_id\`.

\`\`\`sql
SELECT
  s.sinistre_id,          -- Clé issue de la table de faits sinistres (s)
  a.police_id,            -- Clé commune qualifiée explicitement via l'alias a
  a.region,               -- Attribut tarifaire issu de assures (a)
  s.nature_sinistre,
  s.cout_total
FROM assures a
INNER JOIN sinistres s
  ON a.police_id = s.police_id  -- Condition de jointure sur clé étrangère
WHERE a.type_vehicule = 'Citadine'
ORDER BY s.sinistre_id ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT s.sinistre_id, a.police_id, a.region, s.nature_sinistre, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id WHERE a.type_vehicule = 'Citadine' ORDER BY s.sinistre_id ASC;
sinistre_id  police_id  region           nature_sinistre  cout_total
-----------  ---------  ---------------  ---------------  ----------
501          1001       IDF              Collision        1450.0    
502          1003       PACA             Bris de Glace    420.0     
503          1003       PACA             Collision        5000.0    
507          1010       Hauts-de-France  Bris de Glace    380.0     
508          1011       IDF              Collision        2100.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez la sinistralité détaillée des contrats assurés en Île-de-France (\`'IDF'\`).

Joignez \`assures a\` et \`sinistres s\` via \`INNER JOIN\` sur \`police_id\` avec \`WHERE a.region = 'IDF'\`. Affichez \`s.sinistre_id\`, \`a.police_id\`, \`a.type_vehicule\`, \`s.nature_sinistre\` et \`s.cout_total\`, triés par \`s.sinistre_id ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT s.sinistre_id, a.police_id, a.type_vehicule, s.nature_sinistre, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id WHERE a.region = 'IDF' ORDER BY s.sinistre_id ASC;",
      validationQuery: "SELECT s.sinistre_id, a.police_id, a.type_vehicule, s.nature_sinistre, s.cout_total FROM assures a INNER JOIN sinistres s ON a.police_id = s.police_id WHERE a.region = 'IDF' ORDER BY s.sinistre_id ASC;",
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
### Exposition Complète (\`LEFT JOIN\`) et Piège \`COUNT(*)\` vs \`COUNT(col)\`

#### 🎓 Cours Théorique Approfondi

Pour estimer la fréquence individuelle $\\hat{\\lambda}_i = N_i$ et la charge $S_i$ sur chaque contrat $i \\in \\{1, \\dots, 12\\}$, il est impératif de conserver l'ensemble du portefeuille exposé — y compris les $5$ contrats **sains sans sinistre** ($N_i = 0$).

Si l'on utilisait un \`INNER JOIN\`, ces $5$ polices indemnes disparaîtraient (biais de troncature à zéro) : la fréquence moyenne estimée bondirait artificiellement de $\\frac{8}{12} = 0.667$ à $\\frac{8}{7} = 1.143$, soit une **surestimation de $+71.4\\%$** du risque !

La jointure externe gauche (\`LEFT OUTER JOIN\`) étend la jointure naturelle en préservant les contrats sans sinistre associés à un vecteur de valeurs \`NULL\` :

$$
\\text{assures} \\bowtie_{\\text{police\\_id}}^{\\text{LEFT}} \\text{sinistres} = (A \\bowtie S) \\cup \\big((A \\setminus \\pi_A(A \\bowtie S)) \\times \\{\\text{NULL}_S\\}\\big)
$$

#### 💻 Masterclass SQL

**Piège classique d'ingénierie SQL avec \`LEFT JOIN\` :**

Pour une police sans sinistre (comme \`1002\` ou \`1005\`), la jointure produit tout de même **1 ligne** (avec \`s.sinistre_id = NULL\`).
- \`COUNT(*)\` compte la ligne entière et renvoie **\`1\`** (Faux !).
- \`COUNT(s.sinistre_id)\` ignore les valeurs \`NULL\` et renvoie exactement **\`0\`** !
De même, \`SUM(COALESCE(s.cout_total, 0.0))\` convertit la somme vide en \`0.0 EUR\` au lieu de \`NULL\`. Le REPL ci-dessous met ce piège en évidence côte à côte.

\`\`\`sql
SELECT
  a.police_id,
  COUNT(*) AS piege_count_star,              -- Renvoie 1 à tort pour les polices saines !
  COUNT(s.sinistre_id) AS vrai_nb_sinistres, -- Ignore les NULL -> renvoie exactement 0
  COALESCE(SUM(s.cout_total), 0.0) AS charge -- Charge nulle transformée en 0.0
FROM assures a
LEFT JOIN sinistres s ON a.police_id = s.police_id
GROUP BY a.police_id
ORDER BY a.police_id
LIMIT 6;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT a.police_id, COUNT(*) AS piege_count_star, COUNT(s.sinistre_id) AS vrai_nb_sinistres, COALESCE(SUM(s.cout_total), 0.0) AS charge FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.police_id ORDER BY a.police_id LIMIT 6;
police_id  piege_count_star  vrai_nb_sinistres  charge 
---------  ----------------  -----------------  -------
1001       1                 1                  1450.0 
1002       1                 0                  0.0    
1003       2                 2                  5420.0 
1004       1                 1                  18500.0
1005       1                 0                  0.0    
1006       1                 0                  0.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Construisez le tableau complet de sinistralité (fréquence et charge) des 12 contrats du portefeuille.

Via \`LEFT JOIN\`, affichez pour chaque police : \`a.police_id\`, \`a.prime_annuelle\`, \`COUNT(s.sinistre_id) AS nb_sinistres\` et \`ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police\`, groupés par \`a.police_id, a.prime_annuelle\` et ordonnés par \`a.police_id ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT a.police_id, a.prime_annuelle, COUNT(s.sinistre_id) AS nb_sinistres, ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.police_id, a.prime_annuelle ORDER BY a.police_id ASC;",
      validationQuery: "SELECT a.police_id, a.prime_annuelle, COUNT(s.sinistre_id) AS nb_sinistres, ROUND(SUM(COALESCE(s.cout_total, 0.0)), 2) AS cout_total_police FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.police_id, a.prime_annuelle ORDER BY a.police_id ASC;",
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
### Anti-Jointure (\`LEFT JOIN ... IS NULL\`) et Portefeuille Indemne

#### 🎓 Cours Théorique Approfondi

En algèbre relationnelle, l'**anti-jointure** (*antijoin*) $A \\triangleright B$ extrait tous les éléments de $A$ n'ayant aucune correspondance dans $B$ :

$$
\\text{assures} \\triangleright_{\\text{police\\_id}} \\text{sinistres} = \\{ a \\in \\text{assures} \\mid \\nexists s \\in \\text{sinistres} : s.\\text{police\\_id} = a.\\text{police\\_id} \\}
$$

**Valeur Métier (Rétention & Calibration Poisson) :**

Sur nos $12$ contrats, $5$ n'ont déclaré aucun sinistre ($p_0 = \\frac{5}{12} \\approx 41.67\\%$). Sous modèle homogène de Poisson $N \\sim \\mathcal{P}(\\lambda)$, la probabilité de zéro sinistre vaut $p_0 = e^{-\\lambda}$, d'où une première estimation $\\hat{\\lambda} = -\\ln(5/12) \\approx 0.875$. En CRM commercial, ces assurés indemnes forment le **cœur rentable du portefeuille**, cible prioritaire des programmes de fidélisation anti-résiliation (*churn prevention*).

#### 💻 Masterclass SQL

Le patron d'anti-jointure \`LEFT JOIN sinistres s ON ... WHERE s.sinistre_id IS NULL\` est extrêmement efficace avec l'index sur \`sinistres(police_id)\`. **Règle vitale** : placez \`s.sinistre_id IS NULL\` dans la clause \`WHERE\` (exécutée *après* la jointure), **jamais** dans le \`ON\` (sinon \`LEFT JOIN\` conserverait tout de même toutes les lignes de gauche !). Autre avantage sur \`NOT IN (SELECT ...)\` : l'anti-jointure reste immunisée contre la présence de \`NULL\` dans la table de droite.

\`\`\`sql
SELECT
  a.police_id,      -- Contrat sans aucun sinistre déclaré
  a.type_contrat,   -- Formule associée
  a.bonus_malus     -- Coefficient CRM (majoritairement Bonus Max)
FROM assures a
LEFT JOIN sinistres s ON a.police_id = s.police_id
WHERE s.sinistre_id IS NULL          -- Filtre anti-jointure APRÈS LEFT JOIN
ORDER BY a.bonus_malus ASC, a.police_id ASC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT a.police_id, a.type_contrat, a.bonus_malus FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.sinistre_id IS NULL ORDER BY a.bonus_malus ASC, a.police_id ASC;
police_id  type_contrat  bonus_malus
---------  ------------  -----------
1002       Tiers Étendu  0.5        
1006       Tiers Étendu  0.5        
1012       Tous Risques  0.5        
1009       Tiers Étendu  0.54       
1005       Tous Risques  0.72
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Identifiez les assurés indemnes du portefeuille par anti-jointure.

Sélectionnez \`a.police_id\`, \`a.age\`, \`a.region\` et \`a.prime_annuelle\` depuis \`assures a\` avec \`LEFT JOIN sinistres s ON a.police_id = s.police_id\` et \`WHERE s.sinistre_id IS NULL\`, triés par \`a.police_id ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT a.police_id, a.age, a.region, a.prime_annuelle FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.sinistre_id IS NULL ORDER BY a.police_id ASC;",
      validationQuery: "SELECT a.police_id, a.age, a.region, a.prime_annuelle FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE s.sinistre_id IS NULL ORDER BY a.police_id ASC;",
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
### Asymétrie de Sévérité et Sous-Requêtes Scalaires dans \`WHERE\`

#### 🎓 Cours Théorique Approfondi

En assurance dommages, les lois de sévérité (Log-Normale, Gamma, Pareto) présentent une **asymétrie positive** (*right skewness* $\\gamma_1 > 0$) : la queue droite tire la moyenne arithmétique $\\bar{C}$ nettement au-dessus de la médiane $Q_{50}$ :

$$
Q_{50}(C) < \\mathbb{E}[C]
$$

Dans \`sinistres\`, la médiane des $8$ dossiers vaut $3\\,550\\text{ EUR}$ (moyenne entre $2\\,100$ et $5\\,000\\text{ EUR}$), mais la moyenne empirique grimpe à $\\bar{C} = \\frac{48\\,950}{8} = 6\\,118.75\\text{ EUR}$. Seuls $3$ sinistres sur $8$ ($37.5\\%$) dépassent cette moyenne, mais ils pèsent $39\\,600\\text{ EUR}$, soit **$80.90\\%$** de la charge globale !

Comparer dynamiquement chaque ligne à la moyenne globale via une **sous-requête scalaire** évite de coder un seuil en dur qui deviendrait obsolète dès l'arrivée de nouveaux dossiers.

#### 💻 Masterclass SQL

Écrire \`WHERE cout_total > AVG(cout_total)\` est syntaxiquement **interdit** car \`WHERE\` filtre ligne par ligne *avant* le calcul des agrégats. En plaçant \`(SELECT AVG(cout_total) FROM sinistres)\` entre parenthèses, la sous-requête interne (non corrélée) est évaluée **une seule fois** en amont sous forme d'un scalaire constant injecté dans le prédicat \`WHERE\`.

\`\`\`sql
SELECT
  police_id,        -- Contrat à prime supérieure à la moyenne
  type_vehicule,
  prime_annuelle
FROM assures
WHERE prime_annuelle > (            -- Sous-requête scalaire (retourne 1 ligne x 1 col = 942.23)
  SELECT AVG(prime_annuelle)
  FROM assures
)
ORDER BY prime_annuelle DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT ROUND(AVG(prime_annuelle), 2) AS prime_moyenne FROM assures;
prime_moyenne
-------------
942.23

sqlite> SELECT police_id, type_vehicule, prime_annuelle FROM assures WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures) ORDER BY prime_annuelle DESC;
police_id  type_vehicule  prime_annuelle
---------  -------------  --------------
1007       Sportive       2100.0        
1004       SUV            1340.2        
1003       Citadine       1150.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Extrayez dynamiquement les dossiers dont le coût dépasse la sévérité moyenne empirique du portefeuille.

Sélectionnez \`sinistre_id\`, \`police_id\`, \`nature_sinistre\` et \`cout_total\` depuis \`sinistres\` pour les dossiers vérifiant \`cout_total > (SELECT AVG(cout_total) FROM sinistres)\`, triés par \`cout_total DESC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT sinistre_id, police_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres) ORDER BY cout_total DESC;",
      validationQuery: "SELECT sinistre_id, police_id, nature_sinistre, cout_total FROM sinistres WHERE cout_total > (SELECT AVG(cout_total) FROM sinistres) ORDER BY cout_total DESC;",
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
### Ratio $S/P$ par Garantie et Piège du Fan-Out 1–N sur Multi-Sinistres

#### 🎓 Cours Théorique Approfondi

Le ratio Sinistres sur Primes (**Loss Ratio $S/P$**) mesure la rentabilité technique pure d'un segment tarifaire $g$ (hors frais de gestion et produits financiers) :

$$
\\text{Ratio } S/P_g = \\frac{\\sum_{i \\in g} S_i}{\\sum_{i \\in g} P_i} \\times 100\\%
$$

**Démonstration Rigoureuse du Piège du Fan-Out 1–N :**

Lorsqu'on effectue un \`LEFT JOIN\` direct entre \`assures\` (cardinalité $1$) et \`sinistres\` (cardinalité $N$), tout contrat $i$ possédant $k_i \\ge 2$ sinistres est **dupliqué $k_i$ fois** dans la table jointe. Le numérateur des sinistres $\\sum S_i$ reste exact, mais le dénominateur des primes est gonflé :

$$
\\sum_{\\text{lignes jointes}} P = \\sum_{i \\in g} \\max(1, k_i) \\cdot P_i > \\sum_{i \\in g} P_i
$$

**Vérification sur nos données réelles (\`'Tiers Simple'\`) :**
- \`police_id = 1003\` ($P = 1\\,150\\text{ EUR}$) a **$2$ sinistres** ($420 + 5\\,000 = 5\\,420\\text{ EUR}$).
- \`police_id = 1011\` ($P = 920\\text{ EUR}$) a **$1$ sinistre** ($2\\,100\\text{ EUR}$).
- **Vrai dénominateur** : $1\\,150 + 920 = 2\\,070\\text{ EUR} \\implies S/P_{\\text{réel}} = \\frac{7\\,520}{2\\,070} \\times 100 = 363.29\\%$.
- **Avec Fan-Out (\`LEFT JOIN\` direct)** : \`1150\` est compté deux fois ($1\\,150 + 1\\,150 + 920 = 3\\,220\\text{ EUR}$), produisant un ratio artificiellement abaissé à $\\frac{7\\,520}{3\\,220} \\times 100 = 233.54\\%$ !

En production actuarielle, on neutralise ce fan-out en pré-agrégeant \`sinistres\` par \`police_id\` dans une **CTE (\`WITH\`)** avant la jointure. Toutefois, pour rester strictement aligné avec la validation automatisée du Module 1 (Ex. 24), cet exercice vous demande d'implémenter le \`LEFT JOIN\` direct suivi de \`GROUP BY a.type_contrat\`.

#### 💻 Masterclass SQL

Le REPL SQLite ci-dessous illustre d'abord la duplication de la ligne \`1003\` dans \`Tiers Simple\`, puis exécute le **patron de production anti-fan-out par CTE** (donnant \`363.29 %\`), afin que vous maîtrisiez les deux approches.

\`\`\`sql
-- Patron de production (anti fan-out) par CTE :
WITH sin_agg AS (
  SELECT police_id, SUM(cout_total) AS charge_police -- 1 ligne unique par police sinistrée
  FROM sinistres
  GROUP BY police_id
)
SELECT
  a.type_contrat,
  ROUND(SUM(a.prime_annuelle), 2) AS primes_exactes, -- Aucune duplication possible
  ROUND(SUM(COALESCE(s.charge_police, 0.0)), 2) AS sinistres,
  ROUND(SUM(COALESCE(s.charge_police, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS sp_sans_fanout
FROM assures a
LEFT JOIN sin_agg s ON a.police_id = s.police_id
GROUP BY a.type_contrat
ORDER BY sp_sans_fanout DESC;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT a.police_id, a.type_contrat, a.prime_annuelle, s.sinistre_id, s.cout_total FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id WHERE a.type_contrat = 'Tiers Simple' ORDER BY a.police_id, s.sinistre_id;
police_id  type_contrat  prime_annuelle  sinistre_id  cout_total
---------  ------------  --------------  -----------  ----------
1003       Tiers Simple  1150.0          502          420.0     
1003       Tiers Simple  1150.0          503          5000.0    
1011       Tiers Simple  920.0           508          2100.0

sqlite> WITH sin_agg AS (SELECT police_id, SUM(cout_total) AS charge_police FROM sinistres GROUP BY police_id) SELECT a.type_contrat, ROUND(SUM(a.prime_annuelle), 2) AS primes_exactes, ROUND(SUM(COALESCE(s.charge_police, 0.0)), 2) AS sinistres, ROUND(SUM(COALESCE(s.charge_police, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS sp_sans_fanout FROM assures a LEFT JOIN sin_agg s ON a.police_id = s.police_id GROUP BY a.type_contrat ORDER BY sp_sans_fanout DESC;
type_contrat  primes_exactes  sinistres  sp_sans_fanout
------------  --------------  ---------  --------------
Tous Risques  7481.8          41430.0    553.74        
Tiers Simple  2070.0          7520.0     363.29        
Tiers Étendu  1755.0          0.0        0.0
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Calculez le Ratio $S/P$ (en %) par formule de contrat avec la requête \`LEFT JOIN\` directe attendue par le validateur (identique à la structure du Module 1 Ex. 24).

Sélectionnez \`a.type_contrat\` et \`ROUND(SUM(COALESCE(s.cout_total, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp\` depuis \`assures a LEFT JOIN sinistres s ON a.police_id = s.police_id\`, groupés par \`a.type_contrat\` et ordonnés par \`ratio_sp DESC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT a.type_contrat, ROUND(SUM(COALESCE(s.cout_total, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.type_contrat ORDER BY ratio_sp DESC;",
      validationQuery: "SELECT a.type_contrat, ROUND(SUM(COALESCE(s.cout_total, 0.0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp FROM assures a LEFT JOIN sinistres s ON a.police_id = s.police_id GROUP BY a.type_contrat ORDER BY ratio_sp DESC;",
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
### Dynamique de Courbe des Taux, Inversion et Différence Première (\`LAG\`)

#### 🎓 Cours Théorique Approfondi

En pilotage ALM bancaire et assurantiel, deux signaux gouvernent la gestion du bilan obligataire et le risque de rachat en assurance-vie :

1. **La pente instantanée de la courbe des taux (*Term Spread*)** :

$$
S_t = y_t^{(10\\text{Y})} - r_t^{(3\\text{M})}
$$

Une pente positive rémunère la transformation d'échéances (*maturity transformation*). Une **inversion de la courbe** ($S_t < 0$, observable dans \`macro_taux\` de \`2023-Q2\` à \`2023-Q4\` jusqu'à $-0.82\\%$) révèle un resserrement monétaire sévère où les placements monétaires à court terme rapportent plus que les obligations d'État à 10 ans, signalant historiquement un risque récessif et une pression de rachat sur les fonds en euros.

2. **L'opérateur de retard $L$ et la variation première $\\Delta \\pi_t$** :

$$
\\Delta \\pi_t = (1 - L)\\pi_t = \\pi_t - \\pi_{t-1}
$$

En économétrie des séries temporelles, cette différence première stationnarise une série intégrée $I(1)$ et détecte immédiatement les points d'inflexion : passage du choc inflationniste ($\\Delta \\pi_t > 0$ jusqu'en \`2022-Q3\` à $9.90\\%$) à la phase de désinflation ($\\Delta \\pi_t < 0$ dès \`2022-Q4\`).

#### 💻 Masterclass SQL

Contrairement à \`GROUP BY\` qui écrase plusieurs lignes en une seule, une **fonction de fenêtrage (*Window Function*)** \`LAG(colonne, 1) OVER (ORDER BY periode)\` accède à la ligne $t - 1$ tout en **conservant chaque trimestre individuel**. Sur la première date chronologique (\`2020-Q1\`), aucune ligne antérieure n'existe : \`LAG\` retourne \`NULL\`, donc \`delta_inflation\` vaut \`NULL\`. Voici son application analogue sur la table \`courbe_taux_oat\`.

\`\`\`sql
SELECT
  date,
  ROUND(taux_10y - taux_2y, 2) AS pente_10_2,       -- Spread 10Y - 2Y (courbe inversée < 0)
  taux_10y,
  ROUND(
    taux_10y - LAG(taux_10y, 1) OVER (ORDER BY date), -- Variation mensuelle t - (t-1)
    2
  ) AS delta_oat10y
FROM courbe_taux_oat
ORDER BY date ASC
LIMIT 6;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Exécution réelle sur les tables du laboratoire (\`SEED_SQL\`) :

\`\`\`text
sqlite> SELECT date, ROUND(taux_10y - taux_2y, 2) AS pente_10_2, taux_10y, ROUND(taux_10y - LAG(taux_10y, 1) OVER (ORDER BY date), 2) AS delta_oat10y FROM courbe_taux_oat ORDER BY date ASC LIMIT 6;
date        pente_10_2  taux_10y  delta_oat10y
----------  ----------  --------  ------------
2023-01-31  0.08        2.78      NULL        
2023-02-28  -0.1        3.1       0.32        
2023-03-31  -0.27       2.88      -0.22       
2023-04-30  -0.33       2.92      0.04        
2023-05-31  -0.38       2.94      0.02        
2023-06-30  -0.42       3.08      0.14
\`\`\`
`,
      taskMarkdown: `**Laboratoire Pratique :** Combinez mesure instantanée de pente des taux et variation trimestrielle d'inflation sur \`macro_taux\`.

Affichez \`periode\`, \`ROUND(oat_10y - euribor_3m, 2) AS pente_taux\`, \`inflation_hicp\` et \`ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation\` depuis \`macro_taux\`, triés par \`periode ASC\`.`,
      initialCode: `-- Écrivez votre requête SQL ci-dessous :
`,
      solutionCode: "SELECT periode, ROUND(oat_10y - euribor_3m, 2) AS pente_taux, inflation_hicp, ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation FROM macro_taux ORDER BY periode ASC;",
      validationQuery: "SELECT periode, ROUND(oat_10y - euribor_3m, 2) AS pente_taux, inflation_hicp, ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation FROM macro_taux ORDER BY periode ASC;",
      hints: ["Utilisez ROUND(inflation_hicp - LAG(inflation_hicp, 1) OVER (ORDER BY periode), 2) AS delta_inflation"],
      datasets: [],
    },
  ],
};
