#!/usr/bin/env python3
"""
Enrich curriculum exercises in src/data/courses.ts with deep, rigorous theoretical reminders:
- > 💡 **Rappel théorique & conceptuel**
- > 📌 **Règle d'or & Syntaxe standard**
- > 📊 **Sens Métier / Actuariel / Économétrique**
- > ⚠️ **Attention & Pièges fréquents**
- Mathematical formulas in LaTeX ($$ ... $$)
"""

import re
import sys

THEORY_ENRICHMENTS = {
    # ==========================================
    # MODULE 1 : SQL POUR L'ACTUARIAT & DATA PREP
    # ==========================================
    "sql-1": """### Projection de Colonnes en SQL

> 💡 **Rappel théorique : L'opérateur de projection relationnelle**
> 
> En algèbre relationnelle de Codd, la projection $\\pi$ restreint l'ensemble des attributs retournés sans modifier le nombre de tuples (lignes) :
> $$\\pi_{\\text{police\\_id}, \\text{age}}(\\text{assures})$$
> Syntaxe générale :
> ```sql
> SELECT colonne1, colonne2 FROM nom_table;
> ```

> ⚠️ **Règle d'or d'ingénierie des données :**
> Évitez formellement l'utilisation de `SELECT *` en production. Projeter uniquement les champs indispensables (`police_id`, `age`) optimise la bande passante I/O, le cache mémoire du moteur de base de données et préserve les performances sur de volumineux portefeuilles d'assurés.
""",

    "sql-2": """### Alias de Colonnes avec AS

> 💡 **Rappel : Renommage logique vs Schéma physique**
> 
> Le mot-clé `AS` attribue un libellé métier temporaire au jeu de résultats :
> ```sql
> SELECT colonne_source AS nouveau_nom FROM nom_table;
> ```
> - **Invariance physique** : L'alias ne modifie jamais le nom de la colonne dans le schéma physique de la table.
> - **Visibilité** : Dans le cycle d'exécution SQL, l'alias créé dans le `SELECT` n'est pas accessible dans la clause `WHERE` (car `WHERE` est évalué *avant* `SELECT`).

> 📊 **Sens Métier :**
> Permet d'adapter le vocabulaire technique des bases de données aux standards actuariels et comptables (*ex : renommer `prime_annuelle` en `prime_nette` ou `cotisation_ttc`*).
""",

    "sql-3": """### Filtrage Numérique avec la clause WHERE

> 💡 **Rappel : L'opérateur de sélection (restriction)**
> 
> La clause `WHERE` implémente la restriction algébrique $\\sigma$ qui filtre les lignes satisfaisant un prédicat logique :
> $$\\sigma_{\\text{prime\\_annuelle} > 1000}(\\text{assures})$$
> Opérateurs de comparaison disponibles :
> - Strict : `>`, `<`
> - Large : `>=`, `<=`
> - Égalité / Inégalité : `=`, `<>` (ou `!=`)

> 📌 **Ordre d'exécution SQL :**
> Le moteur exécute `FROM nom_table` d'abord, puis applique immédiatement le filtre `WHERE`. Si un index B-Tree existe sur la colonne filtrée, le moteur effectue une recherche logarithmique $\\mathcal{O}(\\log N)$ plutôt qu'un balayage complet de la table (*Full Table Scan*).
""",

    "sql-4": """### Filtrage Catégoriel et Chaînes de Caractères

> 💡 **Rappel : La syntaxe des littéraux en SQL ANSI**
> 
> En norme SQL, les chaînes de caractères (types `TEXT` ou `VARCHAR`) s'encadrent impérativement de **guillemets simples** :
> ```sql
> WHERE region = 'IDF'
> ```
> - Les guillemets doubles `"..."` sont réservés aux identifiants (noms de tables ou colonnes comportant des espaces ou caractères spéciaux).
> - Les valeurs textuelles sont sensibles ou insensibles à la casse selon le paramètre de collation de la colonne (`COLLATE NOCASE` en SQLite).

> 📊 **Sens Actuariel :**
> La sélection par région (`IDF`, `PACA`, etc.) constitue la première étape de l'analyse de sinistralité géographique (*zonier tarifaire*).
""",

    "sql-5": """### Combinaisons Logiques (AND / OR) & Priorité

> 💡 **Rappel théorique : Priorité des opérateurs booléens**
> 
> En logique mathématique et en SQL, l'opérateur de conjonction `AND` a une **priorité supérieure** à la disjonction `OR` :
> $$A \\lor B \\land C \\iff A \\lor (B \\land C)$$
> - Pour forcer l'évaluation d'un `OR` avant un `AND`, le parenthésage est **strictement obligatoire** : `(A OR B) AND C`.
> - Pour cibler des conducteurs seniors au profil favorable :
> ```sql
> WHERE age > 50 AND bonus_malus <= 0.50;
> ```

> ⚠️ **Piège fréquent :**
> Sans parenthèses, une requête combinant `OR` et `AND` peut sélectionner des lignes inattendues et fausser les calculs de ratios de sinistres.
""",

    "sql-6": """### Filtrage d'Ensemble avec IN (...)

> 💡 **Rappel : Simplification des disjonctions d'égalité**
> 
> Le prédicat `IN (valeur1, valeur2, ...)` teste l'appartenance à un ensemble discret fini :
> ```sql
> WHERE type_vehicule IN ('SUV', 'Sportive');
> ```
> C'est l'équivalent optimisé et beaucoup plus lisible de :
> ```sql
> WHERE type_vehicule = 'SUV' OR type_vehicule = 'Sportive';
> ```

> 📊 **Sens Métier :**
> Permet de regrouper des segments de véhicules présentant des distributions de risques comparables (*véhicules puissants ou à coût de réparation élevé*).
""",

    "sql-7": """### Recherche de Motifs avec LIKE & Wildcards

> 💡 **Rappel : Les méta-caractères (jokers) SQL**
> 
> L'opérateur `LIKE` effectue un filtrage par expression de motif sur les colonnes textuelles :
> - `%` (pourcentage) : correspond à **0, 1 ou plusieurs caractères quelconques**.
> - `_` (underscore) : correspond à **exactement 1 caractère**.
> 
> Exemples classiques :
> - `type_contrat LIKE 'Tous%'` : commence par "Tous" (ex : 'Tous Risques').
> - `type_contrat LIKE '%Risques'` : se termine par "Risques".
> - `type_contrat LIKE '%Étendu%'` : contient "Étendu" à n'importe quelle position.
""",

    "sql-8": """### Filtrage d'Intervalles avec BETWEEN ... AND ...

> 💡 **Rappel : Inclusivité des bornes en SQL**
> 
> L'opérateur `BETWEEN min AND max` teste l'appartenance à un intervalle fermé :
> $$x \\in [a, b] \\iff a \\le x \\le b$$
> Les deux bornes sont **inclusives** :
> ```sql
> WHERE age BETWEEN 25 AND 35;
> -- Équivalent strict à :
> WHERE age >= 25 AND age <= 35;
> ```

> ⚠️ **Attention à l'ordre des bornes :**
> La borne inférieure doit toujours précéder la borne supérieure (`BETWEEN 25 AND 35` et non `BETWEEN 35 AND 25`, sinon le prédicat est toujours faux).
""",

    "sql-9": """### Ordonnancement des Résultats avec ORDER BY

> 💡 **Rappel : Absence d'ordre intrinsèque en modèle relationnel**
> 
> Par définition du modèle relationnel d'Edgar F. Codd, une table SQL est un **ensemble mathématique non ordonné** de tuples.
> - Sans clause `ORDER BY`, l'ordre de restitution des lignes est indéterminé et peut varier d'une exécution à l'autre selon le plan de requête.
> - Pour garantir un tri reproductible :
>   - `ASC` : ordre croissant (valeur par défaut si omis).
>   - `DESC` : ordre décroissant (du plus grand au plus petit).

> 📊 **Sens Métier :**
> Identifier rapidement les contrats les plus contributeurs au chiffre d'affaires (`ORDER BY prime_annuelle DESC`).
""",

    "sql-10": """### Restriction du Volume avec LIMIT

> 💡 **Rappel : Pagination et Top-N Queries**
> 
> La clause `LIMIT k` restreint la sortie aux $k$ premières lignes générées par la requête :
> ```sql
> SELECT ... FROM ... ORDER BY ... LIMIT 5;
> ```

> ⚠️ **Règle fondamentale :**
> Un `LIMIT` sans `ORDER BY` n'a pas de sens déterministe ! Pour obtenir les "5 polices les plus chères", il est impératif d'ordonner d'abord par prime décroissante (`ORDER BY prime_annuelle DESC`) avant d'appliquer `LIMIT 5`.
""",

    "sql-11": """### Dédoublonnage d'Attributs avec DISTINCT

> 💡 **Rappel : Suppression des doublons de projection**
> 
> La clause `DISTINCT` élimine les doublons du jeu de résultat pour ne conserver qu'une seule occurrence de chaque combinaison de valeurs :
> ```sql
> SELECT DISTINCT region FROM assures;
> ```
> - Si `assures` contient 100 lignes mais seulement 4 régions distinctes, la requête retournera exactement 4 lignes.
> - Coût algorithmique : le moteur effectue un tri interne ou une table de hachage temporaire $\\mathcal{O}(N \\log N)$.
""",

    "sql-12": """### Fonctions d'Agrégation Scalaires : COUNT & SUM

> 💡 **Rappel : Réduction scalaire d'un ensemble**
> 
> Les fonctions d'agrégation réduisent $N$ lignes en une valeur synthétique unique :
> - `COUNT(*)` : compte le nombre total de lignes (y compris celles contenant des valeurs `NULL`).
> - `COUNT(colonne)` : compte uniquement les lignes où `colonne` est non-nulle (`IS NOT NULL`).
> - `SUM(colonne)` : calcule la somme arithmétique $\\sum_{i=1}^N x_i$.

> 📊 **Sens Actuariel :**
> `COUNT(*)` mesure la taille du portefeuille (exposition totale $N$) et `SUM(prime_annuelle)` correspond à la **prime totale encaissée** (chiffre d'affaires brut).
""",

    "sql-13": """### Extrêmes de Distribution : MIN & MAX

> 💡 **Rappel : Les bornes du support empirique**
> 
> - `MIN(colonne)` : extrait la valeur minimale observée $\\min_{i} x_i$.
> - `MAX(colonne)` : extrait la valeur maximale observée $\\max_{i} x_i$.
> 
> Exemple d'utilisation conjointe :
> ```sql
> SELECT MIN(prime_annuelle) AS prime_min, MAX(prime_annuelle) AS prime_max
> FROM assures;
> ```

> 📊 **Sens Actuariel :**
> Permet de vérifier l'étendue de la tarification $[\\text{prime\\_min}, \\text{prime\\_max}]$ et de détecter d'éventuelles aberrations de souscription (*outliers* ou erreurs de saisie).
""",

    "sql-14": """### Clause GROUP BY & Agrégations Partitionnées

> 💡 **Rappel théorique : L'opérateur de groupement**
> 
> En SQL relationnel, la clause `GROUP BY` partitionne les $N$ lignes d'une table en $K$ sous-groupes disjoints selon les valeurs uniques d'une ou plusieurs colonnes (ici la région `region`).
> Une fois les groupes formés, les fonctions d'agrégation (`COUNT`, `SUM`, `AVG`, etc.) s'appliquent indépendamment sur chaque sous-groupe pour ne renvoyer **qu'une seule ligne par modalité**.

#### Ordre d'Exécution Logique du Moteur SQL :
1. `FROM` : Charge la table source (`assures`).
2. `WHERE` : Filtre les lignes individuelles *avant* le groupement (optionnel).
3. `GROUP BY` : Partitionne les lignes par modalité de `region`.
4. `HAVING` : Filtre les groupes formés *après* l'agrégation (optionnel).
5. `SELECT` : Calcule les agrégats (`COUNT(*)`) et projette le résultat.
6. `ORDER BY` : Trie le résultat final.

> ⚠️ **Règle d'or impérative :**
> Toute colonne présente dans le `SELECT` qui n'est **pas** enveloppée dans une fonction d'agrégation (comme `COUNT(*)`) **DOIT impérativement figurer dans la clause GROUP BY**.
> Exemple : `SELECT region, COUNT(*) AS nb_polices FROM assures GROUP BY region;`

> 📊 **Contexte Métier & Actuariat :**
> En tarification automobile, le `GROUP BY region` permet de construire le **zonier tarifaire** en mesurant l'exposition géographique (densité de contrats en Île-de-France vs province).
""",

    "sql-15": """### Groupement et Moyenne : AVG() & ROUND()

> 💡 **Rappel : Espérance Conditionnelle en Base de Données**
> 
> La fonction `AVG(colonne)` calcule l'espérance conditionnelle empirique pour chaque groupe :
> $$\\mathbb{E}[\\text{prime} \\mid \\text{type\\_vehicule} = v] = \\frac{1}{n_v} \\sum_{i \\in v} \\text{prime}_i$$
> La fonction `ROUND(valeur, 2)` arrondit le résultat à deux décimales pour respecter le format monétaire en centimes.

#### 📌 Syntaxe standard :
```sql
SELECT type_vehicule, ROUND(AVG(prime_annuelle), 2) AS prime_moyenne
FROM assures
GROUP BY type_vehicule;
```

> 📊 **Sens Actuariel :**
> Permet de vérifier la cohérence de la segmentation tarifaire : une catégorie 'Sportive' ou 'SUV' doit afficher une prime moyenne plus élevée qu'une 'Citadine' en raison de la sévérité accrue des dommages en cas de choc.
""",

    "sql-16": """### Filtrage Post-Agrégation avec HAVING

> 💡 **Rappel fondamental : Règle WHERE vs HAVING**
> 
> - **`WHERE`** : Filtre les **lignes individuelles** du tableau *avant* que le groupement ne soit effectué. Il ne peut jamais contenir de fonction d'agrégation (il est interdit d'écrire `WHERE COUNT(*) >= 2`).
> - **`HAVING`** : Filtre les **groupes agrégés** *après* l'évaluation du `GROUP BY`. C'est le seul endroit où tester des conditions sur `COUNT(*)`, `SUM(...)`, `AVG(...)`.

#### 📌 Schéma mnémotechnique :
$$\\text{Lignes brutes} \\xrightarrow{\\text{WHERE}} \\text{Lignes filtrées} \\xrightarrow{\\text{GROUP BY}} \\text{Groupes} \\xrightarrow{\\text{HAVING}} \\text{Groupes retenus}$$

> ⚠️ **Piège fréquent :**
> N'utilisez pas `HAVING` pour filtrer des attributs de lignes individuelles si un `WHERE` peut le faire, car `WHERE` réduit le volume de données en amont et soulage le processeur.
""",

    "sql-17": """### Conditionnement Logique avec CASE WHEN

> 💡 **Rappel : La structure if/then/else en SQL**
> 
> L'expression `CASE WHEN` permet d'évaluer des conditions ligne par ligne pour créer des indicateurs catégoriels :
> ```sql
> CASE 
>     WHEN prime_annuelle > 1000 THEN 'Élevée'
>     ELSE 'Standard'
> END AS categorie_prime
> ```

> 📊 **Sens Métier :**
> Discrétiser une variable continue (la prime en euros) en classes de risque homogènes (*classes tarifaires pour reporting de souscription*).
""",

    "sql-18": """### Nettoyage et Imputation avec COALESCE()

> 💡 **Rappel : La logique ternaire et le piège du NULL**
> 
> En SQL, toute opération arithmétique avec une valeur `NULL` produit irrévocablement `NULL` :
> $$1500 + \\text{NULL} = \\text{NULL}$$
> La fonction `COALESCE(valeur, remplacement)` renvoie le premier argument non nul de sa liste.
> ```sql
> COALESCE(cout_corporel, 0.0) AS corporel_impute
> ```
> Si un sinistre n'a causé aucun dommage corporel (`NULL`), il est imputé proprement à `0.0`.

> ⚠️ **Règle pratique :**
> Toujours utiliser `COALESCE` sur les montants de sinistres avant d'effectuer des additions ou des jointures externes.
""",

    "sql-19": """### Jointure Interne (INNER JOIN)

> 💡 **Rappel relationnel : L'intersection par clé**
> 
> La jointure interne combine deux tables sur la base d'une clé de correspondance :
> $$R = \\text{assures} \\bowtie_{\\text{police\\_id}} \\text{sinistres}$$
> Seules les lignes dont la clé `police_id` existe **à la fois** dans `assures` et dans `sinistres` sont conservées.
> - Les assurés sans aucun sinistre sont **exclus**.
> - Un assuré ayant déclaré 3 sinistres apparaîtra **3 fois** dans le résultat.

> 📌 **Syntaxe avec alias de tables :**
> ```sql
> SELECT a.police_id, a.type_vehicule, s.cout_total
> FROM assures a
> INNER JOIN sinistres s ON a.police_id = s.police_id;
> ```
""",

    "sql-20": """### Préservation de l'Exposition avec LEFT JOIN

> 💡 **Rappel fondamental : Pourquoi le LEFT JOIN est vital en actuariat**
> 
> Le `LEFT JOIN` (jointure externe gauche) conserve **l'intégralité** des lignes de la table de gauche (`assures`), qu'il y ait ou non une correspondance dans la table de droite (`sinistres`).
> Les colonnes de la table de droite sont alors peuplées avec des valeurs `NULL` pour les contrats sans sinistre.

> 📊 **Sens Actuariel & Économétrique :**
> En actuariat, le dénominateur de la sinistralité est l'**exposition totale** (l'ensemble des polices souscrites, y compris celles sans sinistre). Utiliser un `INNER JOIN` éliminerait tous les conducteurs vertueux sans sinistre, provoquant un **biais de sélection dramatique** qui surestimerait le risque moyen.
""",

    "sql-21": """### Jointures Multiples & Relations Chaînées

> 💡 **Rappel : Composition de relations relationnelles**
> 
> En base de données, les jointures peuvent se chaîner pour relier des entités distantes :
> ```sql
> FROM table_A a
> LEFT JOIN table_B b ON a.id = b.a_id
> LEFT JOIN table_C c ON a.id_autre = c.id
> ```

> ⚠️ **Attention aux doublons de jointure (Fan-out) :**
> Si une table de droite comporte plusieurs enregistrements pour une même clé, les lignes de la table de gauche seront dupliquées. Pensez à vérifier vos volumes avec `COUNT(DISTINCT a.police_id)`.
""",

    "sql-22": """### Sous-Requêtes Scalaires dans le WHERE

> 💡 **Rappel : La sous-requête comme constante dynamique**
> 
> Une sous-requête scalaire retourne exactement **une ligne et une colonne** (une valeur atomique unique). Elle peut s'utiliser comme un opérande de comparaison dans un `WHERE` :
> ```sql
> SELECT police_id, prime_annuelle
> FROM assures
> WHERE prime_annuelle > (SELECT AVG(prime_annuelle) FROM assures);
> ```

> 📌 **Exécution :**
> Le moteur évalue d'abord la sous-requête interne `(SELECT AVG...)` qui produit par exemple `920.50 €`, puis exécute la requête principale en filtrant `WHERE prime_annuelle > 920.50`.
""",

    "sql-23": """### Tables Dérivées (Sous-Requêtes dans le FROM)

> 💡 **Rappel : Transformer une requête en table temporaire en mémoire**
> 
> Une requête SQL peut servir de source de données pour une autre requête en la plaçant dans la clause `FROM` :
> ```sql
> SELECT sub.region, sub.nb
> FROM (
>     SELECT region, COUNT(*) AS nb 
>     FROM assures 
>     GROUP BY region
> ) sub;
> ```
> - **Règle ANSI impérative** : Toute sous-requête dans un `FROM` doit obligatoirement avoir un alias (ici `sub`).
""",

    "sql-24": """### Common Table Expressions (WITH / CTE)

> 💡 **Rappel : Les CTE pour un code SQL lisible et modulaire**
> 
> La clause `WITH` définit une table temporaire nommée (*Common Table Expression*) en préambule de la requête :
> ```sql
> WITH stats_region AS (
>     SELECT region, COUNT(*) AS nb_polices
>     FROM assures
>     GROUP BY region
> )
> SELECT * FROM stats_region WHERE nb_polices >= 2;
> ```
> Avantages majeurs : lisibilité exceptionnelle, maintenance aisée et réutilisation de la table temporaire dans plusieurs jointures.
""",

    "sql-25": """### Ratio Sinistres / Primes (S/P ou Loss Ratio)

> 💡 **Rappel théorique : La métrique reine de l'actuariat non-vie**
> 
> Le Ratio Sinistres sur Primes ($S/P$) mesure la rentabilité technique pure d'un portefeuille d'assurance :
> $$\\text{Ratio S/P} = \\frac{\\sum \\text{Charge des sinistres}}{\\sum \\text{Primes acquises}} \\times 100$$
> - **$S/P < 100\\%$** : Le portefeuille est bénéficiaire sur le plan technique.
> - **$S/P > 100\\%$** : Le portefeuille est déficitaire (la charge des sinistres dépasse les cotisations perçues).

#### 📌 Formule SQL robuste :
```sql
ROUND(SUM(COALESCE(s.cout_total, 0)) / SUM(a.prime_annuelle) * 100, 2) AS ratio_sp
```
Combiné avec `LEFT JOIN` (pour conserver les primes des contrats sans sinistre) et `GROUP BY a.region`.
""",

    "sql-26": """### Fonctions de Fenêtrage : DENSE_RANK() OVER

> 💡 **Rappel : Agrégation vs Fenêtrage (Window Functions)**
> 
> Contrairement à `GROUP BY` qui compresse plusieurs lignes en une seule, une **Window Function** calcule une valeur sur une fenêtre de lignes tout en **préservant chaque ligne individuelle** :
> 
> Comparaison des fonctions de classement :
> - `ROW_NUMBER()` : Attribue un numéro de ligne strictement continu ($1, 2, 3, 4$).
> - `RANK()` : Attribue le même rang en cas d'ex-aequo, mais crée des sauts ($1, 2, 2, 4$).
> - `DENSE_RANK()` : Attribue le même rang en cas d'ex-aequo **sans créer de trous** ($1, 2, 2, 3$).

#### 📌 Syntaxe :
```sql
DENSE_RANK() OVER (ORDER BY SUM(COALESCE(s.cout_total, 0)) DESC) AS rang_cout
```
""",

    # ==========================================
    # MODULE 2 : PYTHON POUR L'ÉCONOMÉTRIE & ALM
    # ==========================================
    "py-1": """### Exploration d'un Panel de Séries Temporelles (.head)

> 💡 **Rappel méthodologique : Inspection préalable obligatoire**
> 
> Avant d'estimer un modèle économétrique ou de calculer des matrices de covariance, il est indispensable de vérifier la structure des données d'entrée :
> - Typage des variables (séries continues, taux, dates trimestrielles).
> - Absence de valeurs aberrantes ou manquantes.
> 
> En Pandas, `df.head(n)` extrait vectoriellement les $n$ premières lignes sans saturer la mémoire d'affichage.
""",

    "py-2": """### Dimensions et Degrés de Liberté (.shape)

> 💡 **Rappel économétrique : La contrainte des degrés de liberté**
> 
> Soit un échantillon de taille $T$ avec $K$ variables explicatives. Pour pouvoir estimer les paramètres par MCO et procéder à des tests statistiques valides (test de Student, test de Fisher), il faut impérativement :
> $$\\text{Degrés de liberté} = T - K - 1 > 0$$
> Si $T \\le K + 1$, le modèle est sous-déterminé et la matrice $(X'X)$ n'est pas inversible.
> 
> `df.shape` retourne le tuple `(T_lignes, K_colonnes)`.
""",

    "py-3": """### Moments d'Ordre 1 et 2 (.mean, .std)

> 💡 **Rappel théorique : Correction de Bessel pour la variance**
> 
> - **Moyenne empirique (Espérance)** :
>   $$\\bar{y} = \\frac{1}{T} \\sum_{t=1}^T y_t$$
> - **Variance sans biais et Écart-type** :
>   $$s^2 = \\frac{1}{T - 1} \\sum_{t=1}^T (y_t - \\bar{y})^2, \\quad s = \\sqrt{s^2}$$
> 
> Le diviseur $T - 1$ (au lieu de $T$) est la **correction de Bessel** : elle compense le fait que la moyenne empirique $\\bar{y}$ est elle-même estimée à partir de l'échantillon, garantissant que $E[s^2] = \\sigma^2$.
""",

    "py-4": """### Quantiles Empiriques et Événements Rares (.quantile)

> 💡 **Rappel : Mesure non-paramétrique du risque**
> 
> Le quantile empirique d'ordre $\\alpha \\in [0, 1]$ représente la valeur en deçà de laquelle se situe une proportion $\\alpha$ des observations :
> $$P(X \\le q_\\alpha) = \\alpha$$
> - $\\alpha = 0.50$ : Médiane (robuste aux valeurs extrêmes).
> - $\\alpha = 0.95$ : Seuil de surchauffe (dépassé seulement 5 % du temps).
> En gestion des risques, c'est le fondement du calcul de la **Value-at-Risk (VaR) historique**.
""",

    "py-5": """### Pente de la Courbe des Taux (Term Spread)

> 💡 **Rappel financier & macroéconomique : La structure par terme des taux**
> 
> En gestion actif-passif (ALM) et macroéconomie, la pente de la courbe des taux mesure le différentiel entre le rendement d'un actif long terme sans risque (OAT 10 ans) et le loyer de l'argent au jour le jour (Euribor 3 mois) :
> $$\\text{Pente}_t = r_{\\text{OAT\\_10Y}, t} - r_{\\text{Euribor\\_3M}, t}$$
> - **Pente normale ($> 0$)** : Les taux longs intègrent une prime de terme positive.
> - **Pente inversée ($< 0$)** : Anticipe historiquement un ralentissement économique ou une récession sous 12 à 18 mois.
""",

    "py-6": """### Taux de Variation et Rendements (.pct_change)

> 💡 **Rappel : Rendements arithmétiques vs logarithmiques**
> 
> Le taux de variation d'une série financière $P_t$ s'obtient par :
> $$R_t = \\frac{P_t - P_{t-1}}{P_{t-1}} = \\frac{P_t}{P_{t-1}} - 1$$
> La méthode `.pct_change()` de Pandas calcule cette variation d'une période à l'autre.
> - La première observation de la série résultante est toujours `NaN` (car il n'y a pas de période précédente $t-1$).
""",

    "py-7": """### Matrice de Corrélation Linéaire de Pearson

> 💡 **Rappel théorique : Le coefficient de Pearson**
> 
> Pour deux séries temporelles $X$ et $Y$, le coefficient de corrélation linéaire est normalisé entre -1 et 1 :
> $$\\rho_{X, Y} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y} \\in [-1, 1]$$
> - $\\rho = 1$ : Corrélation linéaire positive parfaite.
> - $\\rho = 0$ : Absence de relation linéaire (mais attention, il peut exister une relation non-linéaire !).
> - $\\rho = -1$ : Corrélation linéaire inverse parfaite.

> ⚠️ **Piège fondamental : Corrélation $\\ne$ Causalité !**
> En séries temporelles, deux séries non-stationnaires peuvent afficher un $\\rho > 0.90$ simplement parce qu'elles croissent toutes les deux dans le temps (*régression fallacieuse*).
""",

    "py-8": """### Analyse Graphique Bivariée (Scatter Plot)

> 💡 **Rappel économétrique : Pourquoi le graphique précède la régression**
> 
> Un coefficient de corrélation ou une régression MCO ne doit jamais être calculé à l'aveugle :
> - Détection visuelle de points aberrants (*outliers* ou points leviers) qui fausseraient la droite de régression.
> - Vérification de la linéarité de la relation (forme en cloche, seuils, saturation).
""",

    "py-9": """### Modèle de Régression Simple par les MCO (OLS)

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
""",

    "py-10": """### Interprétation Économique du Coefficient Bêta

> 💡 **Rappel : Sensibilité marginale et dérivation**
> 
> Dans un modèle linéaire, la pente $\\hat{\\beta}_1$ mesure la sensibilité marginale directe :
> $$\\hat{\\beta}_1 = \\frac{\\partial y}{\\partial x}$$
> Une variation de $+1$ unité de la variable explicative $x$ entraîne une variation moyenne attendue de $\\hat{\\beta}_1$ unités de $y$, toutes choses égales par ailleurs (*ceteris paribus*).
""",

    "py-11": """### Coefficient de Détermination R² et Qualité d'Ajustement

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
""",

    "py-12": """### Régression Multiple & Effet Ceteris Paribus

> 💡 **Rappel : Formulation Matricielle des MCO**
> 
> Pour plusieurs variables explicatives $X_1, X_2, \\dots, X_K$ :
> $$y = X \\beta + \\varepsilon$$
> L'estimateur matriciel s'écrit de manière compacte :
> $$\\hat{\\beta} = (X'X)^{-1} X' y$$
> Chaque coefficient partiel $\\beta_j$ capture l'impact spécifique de la variable $X_j$ **après avoir neutralisé l'effet de toutes les autres variables explicatives** du modèle.
""",

    "py-13": """### Diagnostic des Résidus et Orthogonalité

> 💡 **Rappel : Perturbations théoriques vs Résidus empiriques**
> 
> - $\\varepsilon_t$ : Perturbation théorique inobservable.
> - $e_t = y_t - \\hat{y}_t$ : Résidu estimé observable.
> 
> Par construction mathématique des MCO (équations normales) :
> $$\\sum_{t=1}^T e_t = 0 \\implies \\bar{e} = 0, \\quad X'e = 0$$
> Les résidus sont obligatoirement orthogonaux aux variables explicatives.
""",

    "py-14": """### Test de Normalité des Résidus de Jarque-Bera

> 💡 **Rappel théorique : Asymétrie (Skewness) et Aplatissement (Kurtosis)**
> 
> Pour que les tests $t$ de Student et $F$ de Fisher soient exacts en petits échantillons, les erreurs doivent suivre une loi normale $\\varepsilon \\sim \\mathcal{N}(0, \\sigma^2)$ :
> - **Skewness (Asymétrie)** : $S = 0$ pour une loi normale.
> - **Kurtosis (Aplatissement)** : $K = 3$ pour une loi normale.
> 
> La statistique de Jarque-Bera teste la normalité conjointe :
> $$JB = \\frac{T}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\sim \\chi^2(2)$$
> Si la **p-valeur $< 0.05$**, on rejette l'hypothèse de normalité des résidus.
""",

    "py-15": """### Diagnostic d'Hétéroscédasticité (White / Breusch-Pagan)

> 💡 **Rappel : L'hypothèse d'homoscédasticité**
> 
> L'homoscédasticité impose que la variance des perturbations soit constante au cours du temps :
> $$\\operatorname{Var}(\\varepsilon_t) = \\sigma^2 = \\text{Constante} \\quad (\\forall t)$$
> Si la variance dépend du niveau des variables ou du temps, il y a **hétéroscédasticité**.
> - Conséquence : Les coefficients MCO restent sans biais mais **ne sont plus efficaces** et les écarts-types sont faux.
""",

    "py-16": """### Autocorrélation des Résidus : Test de Durbin-Watson

> 💡 **Rappel théorique : L'indépendance temporelle des erreurs**
> 
> L'hypothèse MCO exige l'absence d'autocorrélation :
> $$\\operatorname{Cov}(\\varepsilon_t, \\varepsilon_{t-1}) = 0$$
> La statistique de Durbin-Watson teste une autocorrélation d'ordre 1 :
> $$DW = \\frac{\\sum_{t=2}^T (e_t - e_{t-1})^2}{\\sum_{t=1}^T e_t^2} \\approx 2(1 - \\hat{\\rho})$$
> où $\\hat{\\rho}$ est le coefficient d'autocorrélation des résidus.
> - **$DW \\approx 2$** : Absence d'autocorrélation ($\hat{\\rho} = 0$). Tout va bien !
> - **$DW < 1.5$** : Forte autocorrélation positive (fréquent en séries temporelles non stationnarisées).
""",

    "py-17": """### Correction d'Hétéroscédasticité et d'Autocorrélation (HAC / Newey-West)

> 💡 **Rappel : La matrice de covariance robuste**
> 
> Lorsque les résidus sont à la fois hétéroscédastiques et autocorrélés, on corrige la matrice de variance-covariance des estimateurs via l'estimateur de **Newey-West (HAC)** :
> $$\\operatorname{Var}_{\\text{HAC}}(\\hat{\\beta}) = (X'X)^{-1} \\hat{\\Omega} (X'X)^{-1}$$
> Cette correction ajuste les écarts-types des coefficients sans modifier les estimations ponctuelles $\\hat{\\beta}$, garantissant des p-valeurs fiables.
""",

    "py-18": """### Test de Stationnarité : Augmented Dickey-Fuller (ADF)

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
""",

    "py-19": """### Différenciation Première et Stationnarisation ($\\Delta y_t$)

> 💡 **Rappel : L'opérateur de différence première**
> 
> Si une série $y_t$ est intégrée d'ordre 1 ($I(1)$), sa différence première est stationnaire ($I(0)$) :
> $$\\Delta y_t = y_t - y_{t-1} = (1 - L) y_t$$
> où $L$ est l'opérateur retard (*Lag operator* : $L y_t = y_{t-1}$).
> En Pandas : `df['colonne'].diff()` calcule cette différence première.
""",

    "py-20": """### Autocorrélations Simple et Partielle (ACF & PACF)

> 💡 **Rappel théorique : La méthodologie de Box-Jenkins**
> 
> - **ACF (Autocorrelation Function)** : Mesure la corrélation globale entre $y_t$ et $y_{t-k}$.
> - **PACF (Partial Autocorrelation Function)** : Mesure la corrélation nette entre $y_t$ et $y_{t-k}$ en éliminant l'influence des retards intermédiaires $1, 2, \\dots, k-1$.
> 
> Règle de diagnostic pour les processus autorégressifs $AR(p)$ :
> La PACF se coupe brutalement après le retard $p$, tandis que l'ACF décroît exponentiellement.
""",

    "py-21": """### Processus Autorégressif d'Ordre 1 : AR(1)

> 💡 **Rappel mathématique : L'équation AR(1)**
> 
> Le modèle AR(1) exprime la valeur courante comme une fonction linéaire de la valeur passée et d'un bruit blanc :
> $$y_t = c + \\phi y_{t-1} + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\text{WN}(0, \\sigma^2)$$
> 
> Condition de stationnarité stricte :
> $$|\\phi| < 1$$
> Si $\\phi = 1$, la série est une **marche aléatoire** (non-stationnaire).
""",

    "py-22": """### Sélection de Modèles : Critères d'Information AIC & BIC

> 💡 **Rappel : Le compromis vraisemblance vs parcimonie**
> 
> Ajouter des paramètres améliore mécaniquement la vraisemblance mais augmente le risque de surapprentissage (*overfitting*). Les critères d'information pénalisent le nombre de paramètres $k$ :
> - **AIC (Akaike)** : $\\text{AIC} = 2k - 2\\ln(L)$
> - **BIC (Schwarz / Bayesien)** : $\\text{BIC} = k \\ln(T) - 2\\ln(L)$
> 
> Règle d'or : **Le meilleur modèle est celui qui minimise le critère (AIC ou BIC le plus faible).** Le BIC pénalise plus sévèrement les modèles complexes.
""",

    "py-23": """### Prévision Hors-Échantillon et Erreur de Prédiction

> 💡 **Rappel : L'espérance conditionnelle future**
> 
> La prévision à horizon 1 ($h=1$) d'un modèle AR(1) conditionnellement à l'information disponible à l'instant $T$ est :
> $$\\hat{y}_{T+1 \\mid T} = E[y_{T+1} \\mid \\mathcal{F}_T] = \\hat{c} + \\hat{\\phi} y_T$$
> L'erreur de prévision est $e_{T+1} = y_{T+1} - \\hat{y}_{T+1 \\mid T}$.
""",

    "py-24": """### Volatilité Conditionnelle et Hétéroscédasticité ARCH/GARCH

> 💡 **Rappel financier : Les faits stylisés des séries de prix**
> 
> Les rendements financiers présentent des **grappes de volatilité** (*volatility clustering* : de fortes variations sont généralement suivies de fortes variations).
> Dans un modèle ARCH(1) de Robert Engle (Prix Nobel 2003) :
> $$\\sigma_t^2 = \\omega + \\alpha_1 \\varepsilon_{t-1}^2$$
> La variance conditionnelle dépend de la magnitude du choc de la veille au carré $\\varepsilon_{t-1}^2$.
""",

    "py-25": """### Gestion des Risques : Value-at-Risk (VaR) Paramétrique

> 💡 **Rappel théorique : Définition de la Value-at-Risk**
> 
> La Value-at-Risk au seuil $\\alpha$ (ex : 5 %) représente la perte maximale tolérée avec une probabilité de $1 - \\alpha$ (95 %) sur un horizon donné :
> $$P(\\text{Perte} > \\text{VaR}_\\alpha) = \\alpha \\iff P(R_t < -\\text{VaR}_\\alpha) = \\alpha$$
> 
> Sous l'hypothèse de normalité $R_t \\sim \\mathcal{N}(\\mu, \\sigma^2)$ :
> $$\\text{VaR}_\\alpha = -(\\mu + z_\\alpha \\sigma)$$
> où $z_{0.05} = -1.645$ (pour un niveau de confiance de 95 %) et $z_{0.01} = -2.326$ (pour 99 %).
""",

    "py-26": """### Stress-Testing Macro-Financier et Résilience de Bilan

> 💡 **Rappel réglementaire : Cadres Bâle III & Solvabilité II**
> 
> Le stress-testing quantifie la résilience du bilan d'une banque ou d'une compagnie d'assurance face à des scénarios de crise extrême mais plausibles :
> - Choc de taux d'intérêt : $\\Delta r = +200$ points de base.
> - Choc boursier : baisse de $-30 \\%$ des actions.
> - Choc de sinistralité : survenance conjointe d'événements climatiques majeurs.
"""
}

def update_courses_file():
    path = '/Users/lucaspasqualis/quant-econ-lab/src/data/courses.ts'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified_count = 0
    for ex_id, new_theory in THEORY_ENRICHMENTS.items():
        cleaned_theory = new_theory.strip()
        # Escape for TS template literal:
        # 1. Backslashes
        t = cleaned_theory.replace('\\', '\\\\')
        # 2. Backticks
        t = t.replace('`', '\\`')
        # 3. Interpolation ${
        t = t.replace('${', '\\${')
        
        pattern = rf'(id:\s*"{re.escape(ex_id)}",[\s\S]*?theoryMarkdown:\s*`)([\s\S]*?)(`,\s*taskMarkdown:)'
        
        match = re.search(pattern, content)
        if match:
            def repl_fn(m, formatted=t):
                return m.group(1) + "\n" + formatted + "\n        " + m.group(3)
            content = re.sub(pattern, repl_fn, content, count=1)
            modified_count += 1
        else:
            print(f"Warning: Could not match exercise {ex_id}")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully enriched {modified_count} exercises in {path}!")

if __name__ == '__main__':
    update_courses_file()
