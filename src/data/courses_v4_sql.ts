import { CourseModule } from "@/types/course";

export const V4_SQL_PORTFOLIO_MODULE: CourseModule = {
  id: "v4-sql-portfolio",
  title: "Portfolio SQL : Data Warehouse Actuariel & Quant",
  subtitle:
    "4 Projets Fil Rouge Multi-CTEs & Récursivité prêts pour un repo GitHub professionnel",
  icon: "Database",
  description:
    "Quatre projets fil rouge complets de niveau production pour votre portfolio GitHub : entrepôt actuariel IARD anti-fan-out (audit d'intégrité, délais JULIANDAY et segmentation S/P), screener quantitatif multi-actifs (volatilité glissante 5j, Max Drawdown, matrice de corrélation et scoring Quant-ESG), observatoire de la courbe des taux OAT avec stress-test ALM de Taylor à l'ordre 2, et simulateur récursif d'échéancier obligataire et de couverture actif-passif (WITH RECURSIVE).",
  exercises: [
    // =========================================================================
    // PROJET 1 : Entrepôt Actuariel IARD — Qualité Data, Délais & S/P Multi-Axes
    // =========================================================================
    {
      id: "v4-sql-1",
      title:
        "Projet 1 — Entrepôt Actuariel IARD : Data Quality, Audit Croisé, Délais & Segmentation S/P Multi-Axes",
      category: "pricing",
      language: "sql",
      difficulty: "Intermédiaire",
      durationMinutes: 45,
      description:
        "Construisez un pipeline Data Warehouse à 4 CTEs sur assures et sinistres : contrôle d'intégrité comptable (matériel + corporel - total), calcul du délai de déclaration en jours via JULIANDAY, déduplication au grain police pour éliminer le fan-out 1-N, segmentation croisée Région x Type de Contrat avec part de charge globale, DENSE_RANK() et triage CRITIQUE / SOUS_SURVEILLANCE / RENTABLE.",
      theoryMarkdown: `
### Architecture Entrepôt IARD : Qualité de Données, Isolation des Grains et Triage Technique

#### 🎓 Modèle Mathématique & Actuariel

Dans un Data Warehouse d'assurance Non-Vie (IARD), la construction d'un datamart de rentabilité technique repose sur trois invariants algébriques qui protègent les états financiers contre les biais de jointure et les anomalies comptables.

**1. Contrôle d'intégrité comptable au grain sinistre ($k$)**

Chaque dossier sinistre $k$ enregistré dans \`sinistres\` doit vérifier la décomposition additive entre dommages matériels $M_k$, dommages corporels $B_k$ (potentiellement \`NULL\` en base transactionnelle) et coût total $C_k$ :

$$
\\varepsilon_k = M_k + \\operatorname{COALESCE}(B_k, 0) - C_k, \\qquad \\mathbb{I}_{\\text{anom}}(k) = \\mathbf{1}_{\\{|\\varepsilon_k| > 0.01\\}}
$$

L'indicateur binaire $\\mathbb{I}_{\\text{anom}}(k)$ permet d'auditer automatiquement la cohérence de la chaîne de provisionnement avant toute restitution réglementaire.

**2. Délai de déclaration et pondération additive (facteur IBNR)**

Le délai de déclaration $\\Delta_k$ (en jours calendaires) mesure le temps écoulé entre la date de survenance $t_k^{\\text{surv}}$ et la date de déclaration $t_k^{\\text{decl}}$ :

$$
\\Delta_k = \\operatorname{JULIANDAY}(t_k^{\\text{decl}}) - \\operatorname{JULIANDAY}(t_k^{\\text{surv}})
$$

Pour préserver l'associativité lors du passage du grain *sinistre* au grain *police* puis au grain *segment* $g$ (*Région* $\\times$ *Type de contrat*), on stocke les **faits additifs** $(n_i, \\sum_{k \\in \\mathcal{S}_i} \\Delta_k)$ au niveau police afin de calculer la moyenne exacte pondérée par les sinistres :

$$
\\overline{\\Delta}_g = \\frac{\\sum_{i \\in g} \\sum_{k \\in \\mathcal{S}_i} \\Delta_k}{\\sum_{i \\in g} n_i}
$$

Prendre une simple moyenne des moyennes par police fausserait l'estimateur dès qu'une police présente $n_i \\ge 2$ sinistres (paradoxe d'agrégation).

**3. Éradication du *Fan-Out Trap* ($1 \\to N$) et Ratio $\\text{S/P}$ multi-axes**

Si l'on joint directement \`assures\` (grain $1$, clé \`police_id\`) avec \`sinistres\` (grain $N$), toute police $i$ ayant $n_i \\ge 2$ sinistres voit sa prime $P_i$ dupliquée $n_i$ fois. En factorisant d'abord les sinistres au grain \`police_id\` dans une CTE dédiée, la cardinalité redevient strictement $0..1$ par contrat. Pour chaque segment $g = (\\text{région}, \\text{type\\_contrat})$, le ratio Sinistres sur Primes et la contribution au risque global valent alors :

$$
\\left(\\frac{\\text{S}}{\\text{P}}\\right)_g = 100 \\times \\frac{\\sum_{i \\in g} C_i}{\\sum_{i \\in g} P_i}, \\qquad w_g^{\\text{charge}} = 100 \\times \\frac{\\sum_{i \\in g} C_i}{\\sum_{g'} \\sum_{i \\in g'} C_i}
$$

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous **Solvabilité II** (sous-module *Non-Life Premium & Reserve Risk*) et **IFRS 17** (test de contrat onéreux et *Loss Component* par cohorte annuelle), les pipelines SQL d'alimentation des triangles de liquidation et des comités tarifaires isolent systématiquement la couche *Bronze/Audit* (contrôle $\\varepsilon_k$, délais IBNR), la couche *Silver/Police* (déduplication $1:1$) et la couche *Gold/Segment* (triage \`CRITIQUE\` au-delà de $100\\%$ de $\\text{S/P}$, \`SOUS_SURVEILLANCE\` entre $70\\%$ et $100\\%$, \`RENTABLE\` en deçà).

#### 💻 Masterclass SQL d'Architecture Entrepôt

Une architecture robuste à **4 CTEs en cascade** garantit la lisibilité, la testabilité unitaire de chaque couche et l'absence d'arrondi prématuré :

1. **CTE 1 (\`audit_qualite_sinistres\`)** : nettoyage de \`cout_corporel\` via \`COALESCE(..., 0.0)\`, détection d'écart $> 0.01\\text{ EUR}$ et calcul du délai par \`JULIANDAY()\`.
2. **CTE 2 (\`sinistres_par_police\`)** : \`GROUP BY police_id\` pour ramener les faits sinistres au grain contrat tout en conservant des faits strictement additifs (\`somme_delais_j\`, \`charge_totale_police\`, \`nb_dossiers_ouverts\`).
3. **CTE 3 (\`exposition_polices\`)** : \`assures LEFT JOIN sinistres_par_police\` pour conserver $100\\%$ de l'exposition tarifaire, y compris les polices sans sinistre (\`COALESCE(..., 0)\`).
4. **CTE 4 (\`agregat_segments\`)** : \`GROUP BY region, type_contrat\` en conservant les montants bruts non arrondis pour le calcul final des ratios et de la part de charge globale via \`SUM(charge_brute) OVER ()\`.

\`\`\`sql
-- Bonne pratique Data Warehouse : ne jamais arrondir avant la couche de présentation
WITH audit_qualite_sinistres AS (
    SELECT
        sinistre_id, police_id, statut_dossier,
        COALESCE(cout_corporel, 0.0) AS cout_corporel_clean,
        cout_total,
        CASE WHEN ABS(cout_dommages_materiels + COALESCE(cout_corporel, 0.0) - cout_total) > 0.01
             THEN 1 ELSE 0 END AS flag_anomalie,
        JULIANDAY(date_declaration) - JULIANDAY(date_survenance) AS delai_declaration_j
    FROM sinistres
)
SELECT COUNT(*) AS nb_sinistres, SUM(flag_anomalie) AS anomalies, ROUND(AVG(delai_declaration_j), 2) AS delai_moy_j
FROM audit_qualite_sinistres;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Audit transactionnel réel croisant \`sinistres\` et \`assures\` pour inspecter chaque dossier individuellement (contrôle d'intégrité \`ecart_eur\`, délai de déclaration en jours et statut d'ouverture) avant agrégation par segment :

\`\`\`sql
WITH sinistres_audit AS (
    SELECT s.sinistre_id, s.police_id, a.region, a.type_contrat, s.statut_dossier,
           ROUND(s.cout_dommages_materiels + COALESCE(s.cout_corporel, 0.0) - s.cout_total, 2) AS ecart_eur,
           ROUND(JULIANDAY(s.date_declaration) - JULIANDAY(s.date_survenance), 0) AS delai_j,
           s.cout_total
    FROM sinistres s
    JOIN assures a ON s.police_id = a.police_id
)
SELECT sinistre_id, police_id, region, type_contrat, statut_dossier, ecart_eur, delai_j, cout_total
FROM sinistres_audit
ORDER BY delai_j DESC, cout_total DESC;
\`\`\`

\`\`\`text
sinistre_id | police_id | region          | type_contrat | statut_dossier | ecart_eur | delai_j | cout_total
------------+-----------+-----------------+--------------+----------------+-----------+---------+-----------
506         | 1008      | Grand Est       | Tous Risques | Clos           | 0         | 3       | 9400      
508         | 1011      | IDF             | Tiers Simple | Clos           | 0         | 2       | 2100      
501         | 1001      | IDF             | Tous Risques | Clos           | 0         | 2       | 1450      
504         | 1004      | IDF             | Tous Risques | Clos           | 0         | 1       | 18500     
505         | 1007      | IDF             | Tous Risques | En cours       | 0         | 1       | 11700     
503         | 1003      | PACA            | Tiers Simple | Clos           | 0         | 1       | 5000      
502         | 1003      | PACA            | Tiers Simple | Clos           | 0         | 1       | 420       
507         | 1010      | Hauts-de-France | Tous Risques | Clos           | 0         | 1       | 380       
\`\`\`

On observe que les $8$ dossiers présentent un écart comptable nul (\`ecart_eur = 0\`), que la police \`1003\` (\`PACA\`, \`Tiers Simple\`) concentre $2$ sinistres (\`502\` et \`503\`) et que l'incendie \`506\` en \`Grand Est\` affiche le délai de déclaration le plus long ($3$ jours).

### 📦 Export Portfolio GitHub (Architecture & README)

Structure recommandée pour publier ce projet sur GitHub en tant que mini-entrepôt actuariel industrialisé :

\`\`\`text
iard-actuarial-warehouse-sql/
├── README.md                         # Schéma en étoile, KPIs S/P, dictionnaire des colonnes & captures
├── sql/
│   ├── 01_bronze_data_quality.sql    # Contrôles d'intégrité et délais IBNR
│   ├── 02_silver_policy_exposure.sql # Déduplication 1-N au grain police_id
│   └── 03_gold_sp_segmentation.sql   # Datamart Région x Contrat + triage souscription
├── scripts/
│   └── run_warehouse.py              # Exécuteur DuckDB / SQLite + export CSV / Parquet
└── tests/
    └── test_warehouse_invariants.py  # Tests pytest : conservation des primes, 0 fan-out, unicité grain
\`\`\`

- **Passage à l'échelle (PostgreSQL / DuckDB)** : en production sur plusieurs millions de contrats, remplacez \`JULIANDAY(a) - JULIANDAY(b)\` par \`(a::date - b::date)\` sous PostgreSQL ou \`DATE_DIFF('day', b, a)\` sous DuckDB, matérialisez les couches Silver/Gold via **dbt** (\`ref()\`) et ajoutez des tests automatisés \`unique\`/\`not_null\` sur \`police_id\` dans \`schema.yml\`.
- **Questions fréquentes en entretien (Actuaire Data / Analytics Engineer)** :
  1. *Comment détecter et prouver qu'une jointure a introduit un fan-out ?* — Comparez \`COUNT(*)\` et \`SUM(prime_annuelle)\` avant et après jointure : toute divergence signale une cardinalité $1:N$ non factorisée.
  2. *Pourquoi stocker \`somme_delais_j\` plutôt que \`AVG(delai)\` dans la CTE intermédiaire ?* — Parce qu'une moyenne n'est pas additive ; seule la somme pondérée par \`nb_sinistres\` reste exacte après un second \`GROUP BY\`.
  3. *Pourquoi appliquer \`ROUND()\` uniquement dans le \`SELECT\` final ?* — Pour éviter l'accumulation d'erreurs d'arrondi dans les divisions et les sommes fenêtrées \`SUM(...) OVER ()\`.
      `,
      taskMarkdown: `
Construisez le pipeline complet à **4 CTEs** sur \`assures\` et \`sinistres\` :

1. **CTE 1 — \`audit_qualite_sinistres\`** (table \`sinistres\`) :
   - \`sinistre_id\`, \`police_id\`, \`statut_dossier\`
   - \`COALESCE(cout_corporel, 0.0) AS cout_corporel_clean\`, \`cout_total\`
   - \`flag_anomalie\` : \`1\` si \`ABS(cout_dommages_materiels + COALESCE(cout_corporel, 0.0) - cout_total) > 0.01\`, sinon \`0\`
   - \`delai_declaration_j\` : \`JULIANDAY(date_declaration) - JULIANDAY(date_survenance)\`
2. **CTE 2 — \`sinistres_par_police\`** (regroupement \`GROUP BY police_id\` sur \`audit_qualite_sinistres\`) :
   - \`police_id\`, \`COUNT(*) AS nb_sinistres\`, \`SUM(flag_anomalie) AS nb_anomalies_integrite\`, \`SUM(cout_total) AS charge_totale_police\`, \`SUM(cout_corporel_clean) AS charge_corporelle_police\`, \`SUM(delai_declaration_j) AS somme_delais_j\`, \`SUM(CASE WHEN statut_dossier = 'En cours' THEN 1 ELSE 0 END) AS nb_dossiers_ouverts\`
3. **CTE 3 — \`exposition_polices\`** : \`assures a LEFT JOIN sinistres_par_police sp ON a.police_id = sp.police_id\` en conservant \`police_id\`, \`region\`, \`type_contrat\`, \`bonus_malus\`, \`prime_annuelle\` et les $6$ indicateurs sinistres enveloppés dans \`COALESCE(..., 0)\` ou \`COALESCE(..., 0.0)\`.
4. **CTE 4 — \`agregat_segments\`** : \`GROUP BY region, type_contrat\` calculant \`nb_polices\`, \`nb_sinistres\`, \`nb_anomalies\`, \`dossiers_ouverts\`, \`ROUND(AVG(bonus_malus), 2) AS bonus_malus_moyen\`, et les totaux non arrondis \`primes_brutes\`, \`charge_brute\`, \`charge_corporelle_brute\`, \`total_delais_j\`.
5. **Requête finale** : projetez dans **cet ordre exact** les $15$ colonnes :
   - \`region\`, \`type_contrat\`, \`nb_polices\`, \`nb_sinistres\`, \`nb_anomalies\`, \`dossiers_ouverts\`, \`bonus_malus_moyen\`
   - \`primes_acquises\` : \`ROUND(primes_brutes, 2)\`
   - \`charge_totale\` : \`ROUND(charge_brute, 2)\`
   - \`part_corporelle_pct\` : \`ROUND(CASE WHEN charge_brute > 0 THEN 100.0 * charge_corporelle_brute / charge_brute ELSE 0.0 END, 2)\`
   - \`delai_moyen_decl_j\` : \`ROUND(CASE WHEN nb_sinistres > 0 THEN total_delais_j / nb_sinistres ELSE 0.0 END, 2)\`
   - \`ratio_sp_pct\` : \`ROUND(100.0 * charge_brute / primes_brutes, 2)\`
   - \`part_charge_globale_pct\` : \`ROUND(100.0 * charge_brute / SUM(charge_brute) OVER (), 2)\`
   - \`rang_risque\` : \`DENSE_RANK() OVER (ORDER BY 100.0 * charge_brute / primes_brutes DESC)\`
   - \`statut_triage\` : \`> 100.0\` $\\to$ \`'CRITIQUE'\`, \`>= 70.0\` $\\to$ \`'SOUS_SURVEILLANCE'\`, sinon \`'RENTABLE'\`

Triez par \`rang_risque ASC, primes_acquises DESC, region ASC, type_contrat ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL Portfolio complet ci-dessous :\n",
      solutionCode: `-- Pipeline Entrepôt IARD : Qualité Data, Déduplication 1-N, Délais & Segmentation S/P
WITH audit_qualite_sinistres AS (
    -- CTE 1 : Contrôle d'intégrité comptable (Matériel + Corporel - Total) et délai de déclaration
    SELECT
        sinistre_id, police_id, statut_dossier,
        COALESCE(cout_corporel, 0.0) AS cout_corporel_clean,
        cout_total,
        CASE WHEN ABS(cout_dommages_materiels + COALESCE(cout_corporel, 0.0) - cout_total) > 0.01 THEN 1 ELSE 0 END AS flag_anomalie,
        JULIANDAY(date_declaration) - JULIANDAY(date_survenance) AS delai_declaration_j
    FROM sinistres
),
sinistres_par_police AS (
    -- CTE 2 : Pré-agrégation au grain police_id (supprime le biais fan-out 1-N)
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,
        SUM(flag_anomalie) AS nb_anomalies_integrite,
        SUM(cout_total) AS charge_totale_police,
        SUM(cout_corporel_clean) AS charge_corporelle_police,
        SUM(delai_declaration_j) AS somme_delais_j,
        SUM(CASE WHEN statut_dossier = 'En cours' THEN 1 ELSE 0 END) AS nb_dossiers_ouverts
    FROM audit_qualite_sinistres
    GROUP BY police_id
),
exposition_polices AS (
    -- CTE 3 : Consolidation du portefeuille complet (LEFT JOIN conservant les polices sans sinistre)
    SELECT
        a.police_id, a.region, a.type_contrat, a.bonus_malus, a.prime_annuelle,
        COALESCE(sp.nb_sinistres, 0) AS nb_sinistres,
        COALESCE(sp.nb_anomalies_integrite, 0) AS nb_anomalies_integrite,
        COALESCE(sp.charge_totale_police, 0.0) AS charge_totale_police,
        COALESCE(sp.charge_corporelle_police, 0.0) AS charge_corporelle_police,
        COALESCE(sp.somme_delais_j, 0.0) AS somme_delais_j,
        COALESCE(sp.nb_dossiers_ouverts, 0) AS nb_dossiers_ouverts
    FROM assures a
    LEFT JOIN sinistres_par_police sp ON a.police_id = sp.police_id
),
agregat_segments AS (
    -- CTE 4 : Agrégation multi-axes (Région x Type de contrat)
    SELECT
        region, type_contrat,
        COUNT(*) AS nb_polices,
        SUM(nb_sinistres) AS nb_sinistres,
        SUM(nb_anomalies_integrite) AS nb_anomalies,
        SUM(nb_dossiers_ouverts) AS dossiers_ouverts,
        ROUND(AVG(bonus_malus), 2) AS bonus_malus_moyen,
        SUM(prime_annuelle) AS primes_brutes,
        SUM(charge_totale_police) AS charge_brute,
        SUM(charge_corporelle_police) AS charge_corporelle_brute,
        SUM(somme_delais_j) AS total_delais_j
    FROM exposition_polices
    GROUP BY region, type_contrat
)
SELECT
    region, type_contrat, nb_polices, nb_sinistres, nb_anomalies, dossiers_ouverts, bonus_malus_moyen,
    ROUND(primes_brutes, 2) AS primes_acquises,
    ROUND(charge_brute, 2) AS charge_totale,
    ROUND(CASE WHEN charge_brute > 0 THEN 100.0 * charge_corporelle_brute / charge_brute ELSE 0.0 END, 2) AS part_corporelle_pct,
    ROUND(CASE WHEN nb_sinistres > 0 THEN total_delais_j / nb_sinistres ELSE 0.0 END, 2) AS delai_moyen_decl_j,
    ROUND(100.0 * charge_brute / primes_brutes, 2) AS ratio_sp_pct,
    ROUND(100.0 * charge_brute / SUM(charge_brute) OVER (), 2) AS part_charge_globale_pct,
    DENSE_RANK() OVER (ORDER BY 100.0 * charge_brute / primes_brutes DESC) AS rang_risque,
    CASE
        WHEN 100.0 * charge_brute / primes_brutes > 100.0 THEN 'CRITIQUE'
        WHEN 100.0 * charge_brute / primes_brutes >= 70.0 THEN 'SOUS_SURVEILLANCE'
        ELSE 'RENTABLE'
    END AS statut_triage
FROM agregat_segments
ORDER BY rang_risque ASC, primes_acquises DESC, region ASC, type_contrat ASC;`,
      validationQuery: `-- Pipeline Entrepôt IARD : Qualité Data, Déduplication 1-N, Délais & Segmentation S/P
WITH audit_qualite_sinistres AS (
    -- CTE 1 : Contrôle d'intégrité comptable (Matériel + Corporel - Total) et délai de déclaration
    SELECT
        sinistre_id, police_id, statut_dossier,
        COALESCE(cout_corporel, 0.0) AS cout_corporel_clean,
        cout_total,
        CASE WHEN ABS(cout_dommages_materiels + COALESCE(cout_corporel, 0.0) - cout_total) > 0.01 THEN 1 ELSE 0 END AS flag_anomalie,
        JULIANDAY(date_declaration) - JULIANDAY(date_survenance) AS delai_declaration_j
    FROM sinistres
),
sinistres_par_police AS (
    -- CTE 2 : Pré-agrégation au grain police_id (supprime le biais fan-out 1-N)
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,
        SUM(flag_anomalie) AS nb_anomalies_integrite,
        SUM(cout_total) AS charge_totale_police,
        SUM(cout_corporel_clean) AS charge_corporelle_police,
        SUM(delai_declaration_j) AS somme_delais_j,
        SUM(CASE WHEN statut_dossier = 'En cours' THEN 1 ELSE 0 END) AS nb_dossiers_ouverts
    FROM audit_qualite_sinistres
    GROUP BY police_id
),
exposition_polices AS (
    -- CTE 3 : Consolidation du portefeuille complet (LEFT JOIN conservant les polices sans sinistre)
    SELECT
        a.police_id, a.region, a.type_contrat, a.bonus_malus, a.prime_annuelle,
        COALESCE(sp.nb_sinistres, 0) AS nb_sinistres,
        COALESCE(sp.nb_anomalies_integrite, 0) AS nb_anomalies_integrite,
        COALESCE(sp.charge_totale_police, 0.0) AS charge_totale_police,
        COALESCE(sp.charge_corporelle_police, 0.0) AS charge_corporelle_police,
        COALESCE(sp.somme_delais_j, 0.0) AS somme_delais_j,
        COALESCE(sp.nb_dossiers_ouverts, 0) AS nb_dossiers_ouverts
    FROM assures a
    LEFT JOIN sinistres_par_police sp ON a.police_id = sp.police_id
),
agregat_segments AS (
    -- CTE 4 : Agrégation multi-axes (Région x Type de contrat)
    SELECT
        region, type_contrat,
        COUNT(*) AS nb_polices,
        SUM(nb_sinistres) AS nb_sinistres,
        SUM(nb_anomalies_integrite) AS nb_anomalies,
        SUM(nb_dossiers_ouverts) AS dossiers_ouverts,
        ROUND(AVG(bonus_malus), 2) AS bonus_malus_moyen,
        SUM(prime_annuelle) AS primes_brutes,
        SUM(charge_totale_police) AS charge_brute,
        SUM(charge_corporelle_police) AS charge_corporelle_brute,
        SUM(somme_delais_j) AS total_delais_j
    FROM exposition_polices
    GROUP BY region, type_contrat
)
SELECT
    region, type_contrat, nb_polices, nb_sinistres, nb_anomalies, dossiers_ouverts, bonus_malus_moyen,
    ROUND(primes_brutes, 2) AS primes_acquises,
    ROUND(charge_brute, 2) AS charge_totale,
    ROUND(CASE WHEN charge_brute > 0 THEN 100.0 * charge_corporelle_brute / charge_brute ELSE 0.0 END, 2) AS part_corporelle_pct,
    ROUND(CASE WHEN nb_sinistres > 0 THEN total_delais_j / nb_sinistres ELSE 0.0 END, 2) AS delai_moyen_decl_j,
    ROUND(100.0 * charge_brute / primes_brutes, 2) AS ratio_sp_pct,
    ROUND(100.0 * charge_brute / SUM(charge_brute) OVER (), 2) AS part_charge_globale_pct,
    DENSE_RANK() OVER (ORDER BY 100.0 * charge_brute / primes_brutes DESC) AS rang_risque,
    CASE
        WHEN 100.0 * charge_brute / primes_brutes > 100.0 THEN 'CRITIQUE'
        WHEN 100.0 * charge_brute / primes_brutes >= 70.0 THEN 'SOUS_SURVEILLANCE'
        ELSE 'RENTABLE'
    END AS statut_triage
FROM agregat_segments
ORDER BY rang_risque ASC, primes_acquises DESC, region ASC, type_contrat ASC;`,
      datasets: [],
      hints: [
        "Dans la CTE 1 audit_qualite_sinistres, utilisez COALESCE(cout_corporel, 0.0) avant d'additionner cout_dommages_materiels et calculez le délai par JULIANDAY(date_declaration) - JULIANDAY(date_survenance).",
        "Dans sinistres_par_police, regroupez par police_id et additionnez les délais (somme_delais_j) plutôt que de prendre une moyenne, afin de préserver la pondération exacte lors du regroupement final.",
        "Protégez les divisions part_corporelle_pct et delai_moyen_decl_j avec CASE WHEN ... > 0 THEN ... ELSE 0.0 END, puis utilisez SUM(charge_brute) OVER () et DENSE_RANK() OVER (ORDER BY 100.0 * charge_brute / primes_brutes DESC).",
      ],
      guide: {
        theoryToPracticeLink:
          "Les quatre CTEs traduisent directement les couches d'un entrepôt actuariel : **Bronze** (\`audit_qualite_sinistres\` vérifiant $\\varepsilon_k = M_k + \\operatorname{COALESCE}(B_k,0) - C_k$ et $\\Delta_k$), **Silver** (\`sinistres_par_police\` réduisant le grain $N:1$ à $1:1$ puis \`exposition_polices\` conservant les $12$ contrats via \`LEFT JOIN\`) et **Gold** (\`agregat_segments\` puis le \`SELECT\` final calculant $(\\text{S/P})_g$, $w_g^{\\text{charge}}$, le rang \`DENSE_RANK()\` et le statut de triage).",
        stepByStepPlan: [
          "Écrire la CTE `audit_qualite_sinistres` sur `sinistres` pour nettoyer `cout_corporel`, détecter les écarts d'intégrité $> 0.01$ et calculer `delai_declaration_j` via `JULIANDAY`.",
          "Agréger `audit_qualite_sinistres` par `police_id` dans `sinistres_par_police` en conservant des grandeurs strictement additives (`nb_sinistres`, `charge_totale_police`, `somme_delais_j`, `nb_dossiers_ouverts`).",
          "Joindre `assures a` en `LEFT JOIN` sur `sinistres_par_police sp` dans `exposition_polices` avec `COALESCE` sur toutes les colonnes sinistres.",
          "Regrouper par `(region, type_contrat)` dans `agregat_segments` en gardant `primes_brutes` et `charge_brute` non arrondies.",
          "Calculer les $15$ colonnes finales, le fenêtrage `SUM(charge_brute) OVER ()`, `DENSE_RANK()` et le triage `CASE WHEN`, puis trier de manière déterministe.",
        ],
        concepts: [
          {
            symbol: "audit_qualite_sinistres",
            kind: "Colonne / Table",
            roleInExercise:
              "Couche Bronze contrôlant la cohérence comptable $M_k + B_k - C_k$ et mesurant le délai unitaire $\\Delta_k$ sur chaque dossier sinistre.",
          },
          {
            symbol: "JULIANDAY(date_declaration) - JULIANDAY(date_survenance)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Fonction SQLite convertissant les dates ISO en jours juliens continus afin d'obtenir le nombre exact de jours calendaires entre survenance et déclaration.",
          },
          {
            symbol: "sinistres_par_police",
            kind: "Colonne / Table",
            roleInExercise:
              "CTE Silver qui ramène la table `sinistres` au grain `police_id` et empêche la duplication des primes annuelles lors de la jointure avec `assures`.",
          },
          {
            symbol: "COALESCE(cout_corporel, 0.0)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Neutralise les valeurs `NULL` des sinistres purement matériels pour éviter qu'une addition ou un contrôle d'écart ne retourne `NULL`.",
          },
          {
            symbol: "SUM(charge_brute) OVER ()",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Somme fenêtrée globale calculant le total des sinistres du portefeuille ($48\\,950\\text{ EUR}$) sans réduire le nombre de lignes du segment.",
          },
          {
            symbol: "DENSE_RANK() OVER (ORDER BY ... DESC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Attribue un rang continu de sinistralité décroissante ; les $5$ segments à $\\text{S/P} = 0\\%$ partagent ainsi le même rang `6`.",
          },
          {
            symbol: "statut_triage",
            kind: "Variable",
            roleInExercise:
              "Drapeau décisionnel de souscription classant chaque couple `(region, type_contrat)` en `'CRITIQUE'`, `'SOUS_SURVEILLANCE'` ou `'RENTABLE'`.",
          },
        ],
        guidedCode: `-- Pipeline Entrepôt IARD : Qualité Data, Déduplication 1-N, Délais & Segmentation S/P
WITH audit_qualite_sinistres AS (
    SELECT
        sinistre_id, police_id, statut_dossier,
        COALESCE(cout_corporel, 0.0) AS cout_corporel_clean,
        cout_total,
        CASE WHEN ABS(cout_dommages_materiels + COALESCE(cout_corporel, 0.0) - cout_total) > 0.01 THEN 1 ELSE 0 END AS flag_anomalie,
        JULIANDAY(___) - JULIANDAY(___) AS delai_declaration_j
    FROM sinistres
),
sinistres_par_police AS (
    SELECT
        police_id,
        COUNT(*) AS nb_sinistres,
        SUM(flag_anomalie) AS nb_anomalies_integrite,
        SUM(cout_total) AS charge_totale_police,
        SUM(cout_corporel_clean) AS charge_corporelle_police,
        SUM(delai_declaration_j) AS somme_delais_j,
        SUM(CASE WHEN statut_dossier = 'En cours' THEN 1 ELSE 0 END) AS nb_dossiers_ouverts
    FROM audit_qualite_sinistres
    GROUP BY ___
),
exposition_polices AS (
    SELECT
        a.police_id, a.region, a.type_contrat, a.bonus_malus, a.prime_annuelle,
        COALESCE(sp.nb_sinistres, 0) AS nb_sinistres,
        COALESCE(sp.nb_anomalies_integrite, 0) AS nb_anomalies_integrite,
        COALESCE(sp.charge_totale_police, 0.0) AS charge_totale_police,
        COALESCE(sp.charge_corporelle_police, 0.0) AS charge_corporelle_police,
        COALESCE(sp.somme_delais_j, 0.0) AS somme_delais_j,
        COALESCE(sp.nb_dossiers_ouverts, 0) AS nb_dossiers_ouverts
    FROM assures a
    ___ JOIN sinistres_par_police sp ON a.police_id = sp.police_id
),
agregat_segments AS (
    SELECT
        region, type_contrat,
        COUNT(*) AS nb_polices,
        SUM(nb_sinistres) AS nb_sinistres,
        SUM(nb_anomalies_integrite) AS nb_anomalies,
        SUM(nb_dossiers_ouverts) AS dossiers_ouverts,
        ROUND(AVG(bonus_malus), 2) AS bonus_malus_moyen,
        SUM(prime_annuelle) AS primes_brutes,
        SUM(charge_totale_police) AS charge_brute,
        SUM(charge_corporelle_police) AS charge_corporelle_brute,
        SUM(somme_delais_j) AS total_delais_j
    FROM exposition_polices
    GROUP BY region, type_contrat
)
SELECT
    region, type_contrat, nb_polices, nb_sinistres, nb_anomalies, dossiers_ouverts, bonus_malus_moyen,
    ROUND(primes_brutes, 2) AS primes_acquises,
    ROUND(charge_brute, 2) AS charge_totale,
    ROUND(CASE WHEN charge_brute > 0 THEN 100.0 * charge_corporelle_brute / charge_brute ELSE 0.0 END, 2) AS part_corporelle_pct,
    ROUND(CASE WHEN nb_sinistres > 0 THEN total_delais_j / nb_sinistres ELSE 0.0 END, 2) AS delai_moyen_decl_j,
    ROUND(100.0 * charge_brute / primes_brutes, 2) AS ratio_sp_pct,
    ROUND(100.0 * charge_brute / SUM(charge_brute) OVER (), 2) AS part_charge_globale_pct,
    DENSE_RANK() OVER (ORDER BY 100.0 * charge_brute / primes_brutes DESC) AS rang_risque,
    CASE
        WHEN 100.0 * charge_brute / primes_brutes > 100.0 THEN '___'
        WHEN 100.0 * charge_brute / primes_brutes >= 70.0 THEN '___'
        ELSE '___'
    END AS statut_triage
FROM agregat_segments
ORDER BY rang_risque ASC, primes_acquises DESC, region ASC, type_contrat ASC;`,
      },
    },

    // =========================================================================
    // PROJET 2 : Screener Quantitatif Multi-Actifs & Scoring Quant-ESG
    // =========================================================================
    {
      id: "v4-sql-2",
      title:
        "Projet 2 — Screener Quantitatif Multi-Actifs : Drawdown Cumulé, Volatilité Glissante, Bêta & Scoring ESG",
      category: "financial_econometrics",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 50,
      description:
        "Concevez un screener quantitatif multi-actifs sur marche_actions, portefeuilles_actifs et matrice_correlations : moyenne et volatilité glissantes à 5 jours (sans fonction STDDEV native, via identité de Koenig-Huygens et correction de Bessel), pic historique cumulé et Max Drawdown, corrélation moyenne hors diagonale et score composite Quant-ESG classé par DENSE_RANK().",
      theoryMarkdown: `
### Screener Quantitatif Multi-Actifs : Volatilité Glissante, Max Drawdown & Score Factoriel ESG

#### 🎓 Modèle Mathématique & Économétrie Financière

La sélection systématique de titres (*Quantitative Equity & ESG Screening*) combine des métriques extraites de séries temporelles haute fréquence (\`marche_actions\`), des indicateurs fondamentaux de risque/rendement (\`portefeuilles_actifs\`) et la structure de dépendance croisée (\`matrice_correlations\`).

**1. Volatilité glissante à $W = 5$ jours en SQL pur (sans \`STDDEV\`)**

SQLite ne dispose pas de fonction fenêtrée \`STDDEV_SAMP()\`. On exploite le théorème de **Koenig-Huygens** sur la fenêtre glissante $W_t = \\{t-4, \\dots, t\\}$ de taille $n_t \\le 5$ :

$$
\\hat{\\sigma}_{i,t}^2 = \\frac{n_t}{n_t - 1} \\left( \\frac{1}{n_t}\\sum_{s \\in W_t} r_{i,s}^2 - \\left(\\frac{1}{n_t}\\sum_{s \\in W_t} r_{i,s}\\right)^2 \\right)
$$

La volatilité annualisée sur la base de $252$ séances boursières par an s'obtient alors par mise à l'échelle $\\sqrt{252}$ :

$$
\\sigma_{i,t}^{\\text{ann}} = 100 \\times \\sqrt{252 \\cdot \\max\\!\\left(0,\\; \\hat{\\sigma}_{i,t}^2\\right)}
$$

L'opérateur scalaire \`MAX(0.0, ...)\` protège contre d'éventuelles imprécisions flottantes infinitésimales ($-10^{-17}$) lorsque la variance empirique est nulle.

**2. Pic historique cumulé (*Running Peak*) et *Max Drawdown***

À chaque séance $t$, le plus haut historique atteint depuis le début de la série est une fenêtre causale \`UNBOUNDED PRECEDING AND CURRENT ROW\` :

$$
H_{i,t} = \\max_{s \\le t} P_{i,s}, \\qquad \\text{DD}_{i,t} = \\frac{P_{i,t} - H_{i,t}}{H_{i,t}} \\le 0, \\qquad \\text{MDD}_i = \\min_{t} \\text{DD}_{i,t}
$$

Contrairement à la volatilité qui pénalise symétriquement les hausses et les baisses, le *Max Drawdown* $\\text{MDD}_i$ capture le risque asymétrique de perte maximale subie du sommet au creux (*peak-to-trough*).

**3. Corrélation moyenne de diversification et Score Composite Quant-ESG**

Pour mesurer le pouvoir diversifiant d'un actif $i$ vis-à-vis du reste du portefeuille, on exclut impérativement la diagonale ($\\rho_{i,i} = 1$) :

$$
\\bar{\\rho}_i = \\frac{1}{N - 1} \\sum_{j \\neq i} \\rho_{i,j}
$$

On agrège ensuite quatre piliers normalisés dans $[0, 1]$ en un **score Quant-ESG** sur $100$ points :

$$
\\text{Score}_i = 100 \\times \\left( 0.40\\,\\frac{\\text{Sharpe}_i}{\\max_k \\text{Sharpe}_k} + 0.30\\,\\frac{\\text{ESG}_i}{100} + 0.20\\,(1 - \\bar{\\rho}_i) + 0.10\\,(1 + \\text{MDD}_i) \\right)
$$

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> En gestion institutionnelle sous contrainte **SFDR Article 8/9** et mandat **Solvabilité II** (optimisation du ratio rendement sur SCR *Market Risk*), les gérants quantitatifs combinent qualité ajustée du risque (Sharpe), durabilité (ESG), faible corrélation marginale ($1 - \\bar{\\rho}_i$) et résilience aux pertes extrêmes ($1 + \\text{MDD}_i$) afin d'éviter la concentration sur des actifs fortement bêta-dépendants.

#### 💻 Masterclass SQL d'Architecture Entrepôt

Ce pipeline exploite la complémentarité entre **fenêtrage temporel**, **agrégation matricielle** et **normalisation transversale** :

- **CTE 1 (\`stats_glissantes\`)** : calcule simultanément les moyennes glissantes \`ROWS BETWEEN 4 PRECEDING AND CURRENT ROW\` ($r$ et $r^2$), le pic cumulé \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`, et marque la dernière séance avec \`ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC)\`.
- **CTE 2 (\`drawdown_et_vol\`)** : extrait la volatilité annualisée au dernier point (\`rn_recent = 1\`) via \`SQRT(MAX(0.0, ...))\` et le pire creux \`MIN(...)\` sur l'ensemble de l'historique.
- **CTE 3 (\`corr_moyenne\`)** : filtre \`WHERE actif_a <> actif_b\` avant le \`GROUP BY actif_a\` pour éliminer la diagonale unitaire.
- **CTE 4 (\`facteurs_composites\`)** : joint les $3$ sources et utilise \`MAX(pa.ratio_sharpe) OVER ()\` pour normaliser dynamiquement le ratio de Sharpe sans constante figée en dur.

\`\`\`sql
-- Astuce SQLite : calcul d'une volatilité glissante sans STDDEV_SAMP
SELECT
    ticker,
    date,
    COUNT(*) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS n_obs,
    AVG(rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS moy_5j,
    AVG(rendement_journalier * rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS m2_5j
FROM marche_actions
WHERE ticker = 'MC';
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Trajectoire quotidienne réelle des pics historiques cumulés et des *drawdowns* journaliers sur \`BNP\` et \`MC\` dans \`marche_actions\` :

\`\`\`sql
WITH traj AS (
    SELECT
        date,
        ticker,
        prix_cloture,
        MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_cumule
    FROM marche_actions
    WHERE ticker IN ('BNP', 'MC')
)
SELECT
    date, ticker, prix_cloture, pic_cumule,
    ROUND(100.0 * (prix_cloture - pic_cumule) / pic_cumule, 2) AS drawdown_jour_pct
FROM traj
ORDER BY ticker ASC, date ASC;
\`\`\`

\`\`\`text
date       | ticker | prix_cloture | pic_cumule | drawdown_jour_pct
-----------+--------+--------------+------------+------------------
2024-01-02 | BNP    | 62.8         | 62.8       | 0                
2024-01-03 | BNP    | 62.1         | 62.8       | -1.11            
2024-01-04 | BNP    | 62.7         | 62.8       | -0.16            
2024-01-05 | BNP    | 63.5         | 63.5       | 0                
2024-01-08 | BNP    | 63.2         | 63.5       | -0.47            
2024-01-02 | MC     | 738          | 738        | 0                
2024-01-03 | MC     | 735          | 738        | -0.41            
2024-01-04 | MC     | 744          | 744        | 0                
2024-01-05 | MC     | 752          | 752        | 0                
2024-01-08 | MC     | 748          | 752        | -0.53            
\`\`\`

On lit directement que \`BNP\` touche son *Max Drawdown* le \`2024-01-03\` ($-1.11\\%$) sous le pic initial de $62.80\\text{ EUR}$, tandis que \`MC\` atteint son sommet à $752.00\\text{ EUR}$ le \`2024-01-05\` avant un repli final de $-0.53\\%$.

### 📦 Export Portfolio GitHub (Architecture & README)

Architecture conseillée pour valoriser ce screener quantitatif auprès de recruteurs *Quant Research / Asset Management* :

\`\`\`text
quant-multiasset-esg-screener/
├── README.md                       # Formules factorielles, pondérations ESG & classement final
├── sql/
│   ├── 01_rolling_risk_metrics.sql # Volatilité glissante 5j/20j/60j & Max Drawdown causal
│   ├── 02_correlation_network.sql  # Centralité et corrélation marginale hors diagonale
│   └── 03_quant_esg_scoring.sql    # Agrégation multi-facteurs & DENSE_RANK
├── scripts/
│   └── backtest_rebalance.py       # Export DuckDB vers optimiseur Markowitz SciPy
└── tests/
    └── test_no_lookahead.py        # Vérification stricte de causalité des fenêtres OVER
\`\`\`

- **Passage à l'échelle (PostgreSQL / DuckDB)** : sous DuckDB ou PostgreSQL sur $10\\text{ ans}$ d'historique journalier ($2\\,500$ séances $\\times$ $500$ actions), remplacez l'identité de Koenig-Huygens par \`STDDEV_SAMP(rendement) OVER w\` avec une clause \`WINDOW w AS (PARTITION BY ticker ORDER BY date ROWS BETWEEN 251 PRECEDING AND CURRENT ROW)\`, et partitionnez la table par année et \`ticker\`.
- **Questions fréquentes en entretien (Quant Analyst / Portfolio Engineering)** :
  1. *Quel risque mathématique comporte \`AVG(r^2) - AVG(r)^2\` sur une longue série financière ?* — Une perte de précision numérique (*catastrophic cancellation*) si les rendements ont une forte moyenne et une faible variance ; en SQL avancé on centre d'abord les données ou on utilise \`STDDEV_SAMP\` sous PostgreSQL/DuckDB.
  2. *Comment garantir l'absence de look-ahead bias dans une fenêtre SQL de backtest ?* — Toujours borner la clause de fenêtre avec \`ROWS BETWEEN ... PRECEDING AND CURRENT ROW\` (jamais \`UNBOUNDED FOLLOWING\`) et utiliser \`LAG()\` plutôt que \`LEAD()\`.
  3. *Pourquoi filtrer \`actif_a <> actif_b\` avant de calculer la corrélation moyenne ?* — Car inclure l'auto-corrélation ($\\rho_{i,i}=1$) biaiserait mécaniquement la moyenne vers le haut selon $1/N$, faussant les comparaisons entre univers de tailles différentes.
      `,
      taskMarkdown: `
Construisez le screener multi-actifs complet en **4 CTEs** sur \`marche_actions\`, \`matrice_correlations\` et \`portefeuilles_actifs\` :

1. **CTE 1 — \`stats_glissantes\`** (depuis \`marche_actions\`) : pour chaque ligne, calculez par \`PARTITION BY ticker ORDER BY date\` :
   - \`n_obs_fenetre\` : \`COUNT(*)\` sur \`ROWS BETWEEN 4 PRECEDING AND CURRENT ROW\`
   - \`r_moy_5j\` : \`AVG(rendement_journalier)\` sur \`ROWS BETWEEN 4 PRECEDING AND CURRENT ROW\`
   - \`r2_moy_5j\` : \`AVG(rendement_journalier * rendement_journalier)\` sur \`ROWS BETWEEN 4 PRECEDING AND CURRENT ROW\`
   - \`pic_historique\` : \`MAX(prix_cloture)\` sur \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
   - \`rn_recent\` : \`ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC)\`
2. **CTE 2 — \`drawdown_et_vol\`** (regroupement \`GROUP BY ticker\` sur \`stats_glissantes\`) :
   - \`dernier_prix\` : \`MAX(CASE WHEN rn_recent = 1 THEN prix_cloture END)\`
   - \`r_moy_5j\` : \`MAX(CASE WHEN rn_recent = 1 THEN r_moy_5j END)\`
   - \`vol_5j_quotidienne\` : sur \`rn_recent = 1 AND n_obs_fenetre > 1\`, \`SQRT(MAX(0.0, (n_obs_fenetre * 1.0 / (n_obs_fenetre - 1)) * (r2_moy_5j - r_moy_5j * r_moy_5j)))\`, sinon \`0.0\`
   - \`max_drawdown\` : \`MIN((prix_cloture - pic_historique) / pic_historique)\`
3. **CTE 3 — \`corr_moyenne\`** (depuis \`matrice_correlations\`) : filtrez \`WHERE actif_a <> actif_b\`, regroupez par \`actif_a AS ticker\` et calculez \`AVG(correlation) AS corr_moy_autres\`.
4. **CTE 4 — \`facteurs_composites\`** : joignez \`portefeuilles_actifs pa\`, \`drawdown_et_vol dv\` et \`corr_moyenne cm\` sur \`ticker\`, arrondissez :
   - \`dernier_prix\` à $2$ décimales, \`rdt_moy_5j_pct\` (\`dv.r_moy_5j * 100.0\`) à $3$ décimales, \`vol_5j_ann_pct\` (\`dv.vol_5j_quotidienne * SQRT(252.0) * 100.0\`) à $2$ décimales, \`max_drawdown_pct\` (\`dv.max_drawdown * 100.0\`) à $2$ décimales, \`corr_moy_portefeuille\` (\`cm.corr_moy_autres\`) à $4$ décimales
   - et calculez \`score_quant_esg_brut\` :
     \`(0.40 * (pa.ratio_sharpe / MAX(pa.ratio_sharpe) OVER ()) + 0.30 * (pa.score_esg / 100.0) + 0.20 * (1.0 - cm.corr_moy_autres) + 0.10 * (1.0 + dv.max_drawdown)) * 100.0\`
5. **Requête finale** : projetez dans **cet ordre exact** :
   \`ticker\`, \`nom\`, \`secteur\`, \`dernier_prix\`, \`rdt_moy_5j_pct\`, \`vol_5j_ann_pct\`, \`max_drawdown_pct\`, \`corr_moy_portefeuille\`, \`beta_marche\`, \`ratio_sharpe\`, \`score_esg\`, \`ROUND(score_quant_esg_brut, 2) AS score_quant_esg\`, \`DENSE_RANK() OVER (ORDER BY score_quant_esg_brut DESC) AS rang_allocation\`.

Triez par \`rang_allocation ASC, ticker ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL Portfolio complet ci-dessous :\n",
      solutionCode: `-- Screener Quantitatif Multi-Actifs : Volatilité Glissante, Drawdown, Corrélation & Score ESG
WITH stats_glissantes AS (
    -- CTE 1 : Fenêtre glissante 5 jours (moyenne, moment d'ordre 2) et pic historique cumulé
    SELECT
        date, ticker, prix_cloture, rendement_journalier,
        COUNT(*) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS n_obs_fenetre,
        AVG(rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS r_moy_5j,
        AVG(rendement_journalier * rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS r2_moy_5j,
        MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_historique,
        ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rn_recent
    FROM marche_actions
),
drawdown_et_vol AS (
    -- CTE 2 : Volatilité 5j avec correction de Bessel et Max Drawdown sur l'historique
    SELECT
        ticker,
        MAX(CASE WHEN rn_recent = 1 THEN prix_cloture END) AS dernier_prix,
        MAX(CASE WHEN rn_recent = 1 THEN r_moy_5j END) AS r_moy_5j,
        MAX(CASE
            WHEN rn_recent = 1 AND n_obs_fenetre > 1
            THEN SQRT(MAX(0.0, (n_obs_fenetre * 1.0 / (n_obs_fenetre - 1)) * (r2_moy_5j - r_moy_5j * r_moy_5j)))
            ELSE 0.0
        END) AS vol_5j_quotidienne,
        MIN((prix_cloture - pic_historique) / pic_historique) AS max_drawdown
    FROM stats_glissantes
    GROUP BY ticker
),
corr_moyenne AS (
    -- CTE 3 : Corrélation moyenne par actif hors diagonale (actif_a <> actif_b)
    SELECT
        actif_a AS ticker,
        AVG(correlation) AS corr_moy_autres
    FROM matrice_correlations
    WHERE actif_a <> actif_b
    GROUP BY actif_a
),
facteurs_composites AS (
    -- CTE 4 : Jointure avec portefeuilles_actifs et score composite multi-facteurs Quant-ESG
    SELECT
        pa.ticker, pa.nom, pa.secteur,
        ROUND(dv.dernier_prix, 2) AS dernier_prix,
        ROUND(dv.r_moy_5j * 100.0, 3) AS rdt_moy_5j_pct,
        ROUND(dv.vol_5j_quotidienne * SQRT(252.0) * 100.0, 2) AS vol_5j_ann_pct,
        ROUND(dv.max_drawdown * 100.0, 2) AS max_drawdown_pct,
        ROUND(cm.corr_moy_autres, 4) AS corr_moy_portefeuille,
        pa.beta_marche, pa.ratio_sharpe, pa.score_esg,
        (0.40 * (pa.ratio_sharpe / MAX(pa.ratio_sharpe) OVER ())
         + 0.30 * (pa.score_esg / 100.0)
         + 0.20 * (1.0 - cm.corr_moy_autres)
         + 0.10 * (1.0 + dv.max_drawdown)) * 100.0 AS score_quant_esg_brut
    FROM portefeuilles_actifs pa
    JOIN drawdown_et_vol dv ON pa.ticker = dv.ticker
    JOIN corr_moyenne cm ON pa.ticker = cm.ticker
)
SELECT
    ticker, nom, secteur, dernier_prix, rdt_moy_5j_pct, vol_5j_ann_pct,
    max_drawdown_pct, corr_moy_portefeuille, beta_marche, ratio_sharpe, score_esg,
    ROUND(score_quant_esg_brut, 2) AS score_quant_esg,
    DENSE_RANK() OVER (ORDER BY score_quant_esg_brut DESC) AS rang_allocation
FROM facteurs_composites
ORDER BY rang_allocation ASC, ticker ASC;`,
      validationQuery: `-- Screener Quantitatif Multi-Actifs : Volatilité Glissante, Drawdown, Corrélation & Score ESG
WITH stats_glissantes AS (
    -- CTE 1 : Fenêtre glissante 5 jours (moyenne, moment d'ordre 2) et pic historique cumulé
    SELECT
        date, ticker, prix_cloture, rendement_journalier,
        COUNT(*) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS n_obs_fenetre,
        AVG(rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS r_moy_5j,
        AVG(rendement_journalier * rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS r2_moy_5j,
        MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_historique,
        ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rn_recent
    FROM marche_actions
),
drawdown_et_vol AS (
    -- CTE 2 : Volatilité 5j avec correction de Bessel et Max Drawdown sur l'historique
    SELECT
        ticker,
        MAX(CASE WHEN rn_recent = 1 THEN prix_cloture END) AS dernier_prix,
        MAX(CASE WHEN rn_recent = 1 THEN r_moy_5j END) AS r_moy_5j,
        MAX(CASE
            WHEN rn_recent = 1 AND n_obs_fenetre > 1
            THEN SQRT(MAX(0.0, (n_obs_fenetre * 1.0 / (n_obs_fenetre - 1)) * (r2_moy_5j - r_moy_5j * r_moy_5j)))
            ELSE 0.0
        END) AS vol_5j_quotidienne,
        MIN((prix_cloture - pic_historique) / pic_historique) AS max_drawdown
    FROM stats_glissantes
    GROUP BY ticker
),
corr_moyenne AS (
    -- CTE 3 : Corrélation moyenne par actif hors diagonale (actif_a <> actif_b)
    SELECT
        actif_a AS ticker,
        AVG(correlation) AS corr_moy_autres
    FROM matrice_correlations
    WHERE actif_a <> actif_b
    GROUP BY actif_a
),
facteurs_composites AS (
    -- CTE 4 : Jointure avec portefeuilles_actifs et score composite multi-facteurs Quant-ESG
    SELECT
        pa.ticker, pa.nom, pa.secteur,
        ROUND(dv.dernier_prix, 2) AS dernier_prix,
        ROUND(dv.r_moy_5j * 100.0, 3) AS rdt_moy_5j_pct,
        ROUND(dv.vol_5j_quotidienne * SQRT(252.0) * 100.0, 2) AS vol_5j_ann_pct,
        ROUND(dv.max_drawdown * 100.0, 2) AS max_drawdown_pct,
        ROUND(cm.corr_moy_autres, 4) AS corr_moy_portefeuille,
        pa.beta_marche, pa.ratio_sharpe, pa.score_esg,
        (0.40 * (pa.ratio_sharpe / MAX(pa.ratio_sharpe) OVER ())
         + 0.30 * (pa.score_esg / 100.0)
         + 0.20 * (1.0 - cm.corr_moy_autres)
         + 0.10 * (1.0 + dv.max_drawdown)) * 100.0 AS score_quant_esg_brut
    FROM portefeuilles_actifs pa
    JOIN drawdown_et_vol dv ON pa.ticker = dv.ticker
    JOIN corr_moyenne cm ON pa.ticker = cm.ticker
)
SELECT
    ticker, nom, secteur, dernier_prix, rdt_moy_5j_pct, vol_5j_ann_pct,
    max_drawdown_pct, corr_moy_portefeuille, beta_marche, ratio_sharpe, score_esg,
    ROUND(score_quant_esg_brut, 2) AS score_quant_esg,
    DENSE_RANK() OVER (ORDER BY score_quant_esg_brut DESC) AS rang_allocation
FROM facteurs_composites
ORDER BY rang_allocation ASC, ticker ASC;`,
      datasets: [],
      hints: [
        "Dans stats_glissantes, utilisez ROWS BETWEEN 4 PRECEDING AND CURRENT ROW pour r_moy_5j et r2_moy_5j, et ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW pour pic_historique.",
        "Dans drawdown_et_vol, isolez la dernière date grâce à MAX(CASE WHEN rn_recent = 1 THEN ... END) et appliquez SQRT(MAX(0.0, ...)) avec la correction n_obs_fenetre / (n_obs_fenetre - 1).",
        "Dans corr_moyenne, n'oubliez pas WHERE actif_a <> actif_b avant GROUP BY actif_a ; dans facteurs_composites, normalisez Sharpe par MAX(pa.ratio_sharpe) OVER ().",
      ],
      guide: {
        theoryToPracticeLink:
          "Chaque équation du modèle se mappe directement sur une CTE : \`stats_glissantes\` calcule les moments empiriques $E[r]$ et $E[r^2]$ sur $W_t$ ainsi que $H_{i,t}$, \`drawdown_et_vol\` en déduit $\\sigma_{i,t}^{\\text{ann}} = \\sqrt{252}\\,\\hat{\\sigma}$ et $\\text{MDD}_i = \\min_t \\text{DD}_{i,t}$, \`corr_moyenne\` calcule $\\bar{\\rho}_i$ hors diagonale, et \`facteurs_composites\` synthétise les $4$ piliers en un score sur $100$ points.",
        stepByStepPlan: [
          "Calculer dans `stats_glissantes` les fenêtres glissantes à 5 jours (`n_obs_fenetre`, `r_moy_5j`, `r2_moy_5j`), le `pic_historique` cumulé et le rang chronologique inversé `rn_recent`.",
          "Réduire par `ticker` dans `drawdown_et_vol` pour obtenir `dernier_prix`, `r_moy_5j`, `vol_5j_quotidienne` (avec facteur de Bessel) et `max_drawdown`.",
          "Calculer `corr_moy_autres` dans `corr_moyenne` en excluant les auto-paires (`actif_a <> actif_b`).",
          "Joindre `portefeuilles_actifs` avec `drawdown_et_vol` et `corr_moyenne` dans `facteurs_composites` pour construire `score_quant_esg_brut`.",
          "Projeter les $13$ colonnes finales arrondies avec `DENSE_RANK() OVER (ORDER BY score_quant_esg_brut DESC)`.",
        ],
        concepts: [
          {
            symbol: "ROWS BETWEEN 4 PRECEDING AND CURRENT ROW",
            kind: "Syntaxe",
            roleInExercise:
              "Cadre physique de fenêtre glissante incluant la ligne courante et jusqu'à $4$ séances précédentes ($5$ observations maximum).",
          },
          {
            symbol: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
            kind: "Syntaxe",
            roleInExercise:
              "Cadre causal depuis la première séance disponible jusqu'à la date $t$, garantissant que `pic_historique` n'utilise aucune information future.",
          },
          {
            symbol: "SQRT(MAX(0.0, ...))",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Racine carrée sécurisée de la variance corrigée par $n/(n-1)$ pour éviter un argument négatif dû aux arrondis flottants.",
          },
          {
            symbol: "SQRT(252.0)",
            kind: "Paramètre",
            roleInExercise:
              "Facteur d'annualisation de la volatilité journalière sous hypothèse i.i.d. sur $252$ jours de bourse par an.",
          },
          {
            symbol: "WHERE actif_a <> actif_b",
            kind: "Syntaxe",
            roleInExercise:
              "Exclut la diagonale unitaire ($\\rho_{i,i} = 1$) de `matrice_correlations` afin de mesurer la corrélation moyenne envers les $4$ autres actifs.",
          },
          {
            symbol: "MAX(pa.ratio_sharpe) OVER ()",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Normalisation dynamique par le meilleur Sharpe de l'univers ($0.40$ pour LVMH), sans coder de constante magique.",
          },
          {
            symbol: "score_quant_esg_brut",
            kind: "Variable",
            roleInExercise:
              "Combinaison linéaire pondérée ($40\\%$ Sharpe relatif, $30\\%$ ESG, $20\\%$ décorrélation, $10\\%$ résilience drawdown) ramenée sur $100$.",
          },
        ],
        guidedCode: `-- Screener Quantitatif Multi-Actifs : Volatilité Glissante, Drawdown, Corrélation & Score ESG
WITH stats_glissantes AS (
    SELECT
        date, ticker, prix_cloture, rendement_journalier,
        COUNT(*) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS n_obs_fenetre,
        AVG(rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS r_moy_5j,
        AVG(rendement_journalier * rendement_journalier) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS r2_moy_5j,
        MAX(prix_cloture) OVER (PARTITION BY ticker ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pic_historique,
        ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) AS rn_recent
    FROM marche_actions
),
drawdown_et_vol AS (
    SELECT
        ticker,
        MAX(CASE WHEN rn_recent = 1 THEN prix_cloture END) AS dernier_prix,
        MAX(CASE WHEN rn_recent = 1 THEN r_moy_5j END) AS r_moy_5j,
        MAX(CASE
            WHEN rn_recent = 1 AND n_obs_fenetre > 1
            THEN SQRT(MAX(0.0, (n_obs_fenetre * 1.0 / (n_obs_fenetre - 1)) * (___ - ___ * ___)))
            ELSE 0.0
        END) AS vol_5j_quotidienne,
        MIN((prix_cloture - pic_historique) / pic_historique) AS max_drawdown
    FROM stats_glissantes
    GROUP BY ticker
),
corr_moyenne AS (
    SELECT
        actif_a AS ticker,
        AVG(correlation) AS corr_moy_autres
    FROM matrice_correlations
    WHERE actif_a ___ actif_b
    GROUP BY actif_a
),
facteurs_composites AS (
    SELECT
        pa.ticker, pa.nom, pa.secteur,
        ROUND(dv.dernier_prix, 2) AS dernier_prix,
        ROUND(dv.r_moy_5j * 100.0, 3) AS rdt_moy_5j_pct,
        ROUND(dv.vol_5j_quotidienne * SQRT(252.0) * 100.0, 2) AS vol_5j_ann_pct,
        ROUND(dv.max_drawdown * 100.0, 2) AS max_drawdown_pct,
        ROUND(cm.corr_moy_autres, 4) AS corr_moy_portefeuille,
        pa.beta_marche, pa.ratio_sharpe, pa.score_esg,
        (0.40 * (pa.ratio_sharpe / MAX(pa.ratio_sharpe) OVER ())
         + 0.30 * (pa.score_esg / 100.0)
         + 0.20 * (1.0 - cm.corr_moy_autres)
         + 0.10 * (1.0 + dv.max_drawdown)) * 100.0 AS score_quant_esg_brut
    FROM portefeuilles_actifs pa
    JOIN drawdown_et_vol dv ON pa.ticker = dv.ticker
    JOIN corr_moyenne cm ON pa.ticker = cm.ticker
)
SELECT
    ticker, nom, secteur, dernier_prix, rdt_moy_5j_pct, vol_5j_ann_pct,
    max_drawdown_pct, corr_moy_portefeuille, beta_marche, ratio_sharpe, score_esg,
    ROUND(score_quant_esg_brut, 2) AS score_quant_esg,
    DENSE_RANK() OVER (ORDER BY ___ DESC) AS rang_allocation
FROM facteurs_composites
ORDER BY rang_allocation ASC, ticker ASC;`,
      },
    },

    // =========================================================================
    // PROJET 3 : Observatoire Courbe des Taux OAT & Stress-Test ALM Taylor Ordre 2
    // =========================================================================
    {
      id: "v4-sql-3",
      title:
        "Projet 3 — Observatoire Courbe des Taux OAT, Détection d'Inversion & Stress-Test ALM Taylor Ordre 2",
      category: "alm",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 50,
      description:
        "Développez un observatoire ALM complet sur courbe_taux_oat et macro_taux : jointure calendrier mensuel-trimestriel pour extraire le taux réel 10Y, pente 2Y-10Y et courbure Butterfly en points de base, variation mensuelle via LAG(), impact obligataire par développement de Taylor à l'ordre 2 (Duration modifiée 7.0, Convexité 60.0), classification de régime (INVERSEE / PLATE / NORMALE) et classement par pire choc de taux.",
      theoryMarkdown: `
### Observatoire de la Courbe OAT, Régimes d'Inversion et Stress-Test ALM à l'Ordre 2

#### 🎓 Modèle Mathématique & Dynamique des Taux Souverains

Le pilotage d'un bilan obligataire ou d'une compagnie d'assurance Vie repose sur la décomposition géométrique de la courbe des taux (facteurs **Niveau**, **Pente**, **Courbure** de Nelson-Siegel / Litterman-Scheinkman) et l'évaluation non linéaire de sa sensibilité.

**1. Facteurs géométriques de la courbe OAT ($2\\text{Y}$, $5\\text{Y}$, $10\\text{Y}$)**

À chaque date mensuelle $t$, on extrait la **pente** (*Slope* $2\\text{Y}$–$10\\text{Y}$) et la **courbure papillon** (*Butterfly* $2\\text{Y}$–$5\\text{Y}$–$10\\text{Y}$) en points de pourcentage (puis converties en points de base via $\\times 100$) :

$$
S_t = y_t^{(10)} - y_t^{(2)}, \\qquad B_t = 2\\,y_t^{(5)} - y_t^{(2)} - y_t^{(10)}
$$

Une pente $S_t < 0$ caractérise un régime de courbe **inversée** (\`'INVERSEE'\`), signal avancé classique de durcissement monétaire restrictif ; $0 \\le S_t \\le 0.25$ correspond à une courbe **plate** (\`'PLATE'\`), et $S_t > 0.25$ à une courbe **normale** (\`'NORMALE'\`).

**2. Jointure multi-fréquence et taux réel souverain**

La courbe \`courbe_taux_oat\` étant mensuelle (\`YYYY-MM-DD\`) et \`macro_taux\` trimestrielle (\`YYYY-Q1..Q4\`), on projette chaque mois $m \\in \\{1, \\dots, 12\\}$ vers son trimestre $q = \\lfloor (m - 1) / 3 \\rfloor + 1$ afin de déduire le **taux d'intérêt réel** 10 ans (équation de Fisher approximée) :

$$
r_t^{\\text{réel}, 10\\text{Y}} = y_t^{(10)} - \\pi_q^{\\text{HICP}}
$$

**3. Développement de Taylor d'ordre 2 (Duration Modifiée + Convexité)**

Soit $\\Delta y_t = \\frac{y_t^{(10)} - y_{t-1}^{(10)}}{100}$ la variation mensuelle du taux OAT $10\\text{ ans}$ exprimée en **décimal** (car les taux en base sont stockés en pourcentage, par exemple $3.10$ pour $3.10\\%$). Pour un portefeuille obligataire de **duration modifiée** $D^* = 7.0$ et de **convexité** $C = 60.0$, l'impact relatif sur la valeur de marché $\\frac{\\Delta P}{P}$ s'approxime à l'ordre 2 par :

$$
\\left(\\frac{\\Delta P}{P}\\right)_t \\approx -D^* \\,\\Delta y_t + \\frac{1}{2}\\,C\\,(\\Delta y_t)^2 = -7.0\\,\\Delta y_t + 0.5 \\times 60.0\\,(\\Delta y_t)^2
$$

Le terme linéaire $-D^*\\Delta y_t$ représente l'effet premier ordre, tandis que la convexité positive $+\\frac{1}{2}C(\\Delta y_t)^2 \\ge 0$ **amortit les pertes** lorsque les taux montent ($\\Delta y_t > 0$) et **amplifie les gains** lorsque les taux baissent ($\\Delta y_t < 0$).

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Dans le cadre **Solvabilité II** (*Interest Rate Risk* et *Matching Adjustment*) et du suivi **IRRBB** bancaire (*Interest Rate Risk in the Banking Book*), les stress-tests historiques mensuels sur courbe OAT vérifient si l'asymétrie de convexité entre actifs obligataires et passifs garantis protège les fonds propres économiques lors de chocs brutaux de $+30\\text{ bps}$ (comme en février ou septembre $2023$).

#### 💻 Masterclass SQL d'Architecture Entrepôt

Ce pipeline à **3 CTEs + projection finale** met en œuvre trois techniques SQL clés en finance de marché :

1. **Mapping calendaire SQLite (\`SUBSTR\` + division entière)** : \`CAST(SUBSTR(date, 6, 2) AS INTEGER)\` suivi de \`((mois - 1) / 3 + 1)\` réalise exactement une division entière en SQLite pour reconstruire \`'2023-Q1'\` .. \`'2023-Q4'\`.
2. **Opérateur de retard \`LAG()\`** : \`LAG(taux_10y) OVER (ORDER BY date ASC)\` récupère le taux du mois précédent sans auto-jointure coûteuse. Pour le premier mois (\`dy_decimal IS NULL\`), un \`CASE WHEN\` attribue proprement un choc nul \`0.0\`.
3. **Séparation des unités (\`pp\`, \`bps\`, \`decimal\`, \`%\`)** : conserver \`dy_decimal = delta / 100.0\` dans une CTE dédiée garantit que les puissances \`POWER(dy_decimal, 2)\` s'appliquent bien sur des décimaux ($0.0032^2$) et non sur des points de pourcentage ($0.32^2$).

\`\`\`sql
-- Vérification de la conversion calendaire mensuelle -> trimestrielle en SQLite
SELECT DISTINCT
    date,
    SUBSTR(date, 1, 4) || '-Q' || ((CAST(SUBSTR(date, 6, 2) AS INTEGER) - 1) / 3 + 1) AS periode_trim
FROM courbe_taux_oat
ORDER BY date ASC
LIMIT 4;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Synthèse trimestrielle réelle croisant \`courbe_taux_oat\` et \`macro_taux\` pour suivre l'inversion $2\\text{Y}$–$10\\text{Y}$ et le retournement du taux réel $10\\text{ ans}$ au fil de $2023$ :

\`\`\`sql
WITH courbe_trim AS (
    SELECT
        c.date,
        SUBSTR(c.date, 1, 4) || '-Q' || ((CAST(SUBSTR(c.date, 6, 2) AS INTEGER) - 1) / 3 + 1) AS trimestre,
        c.taux_10y,
        (c.taux_10y - c.taux_2y) * 100.0 AS pente_bps,
        m.inflation_hicp,
        c.taux_10y - m.inflation_hicp AS taux_reel
    FROM courbe_taux_oat c
    JOIN macro_taux m
      ON (SUBSTR(c.date, 1, 4) || '-Q' || ((CAST(SUBSTR(c.date, 6, 2) AS INTEGER) - 1) / 3 + 1)) = m.periode
)
SELECT
    trimestre,
    ROUND(AVG(taux_10y), 2) AS oat_10y_moy_pct,
    ROUND(AVG(pente_bps), 1) AS pente_2_10_moy_bps,
    ROUND(MAX(inflation_hicp), 2) AS inflation_hicp_pct,
    ROUND(AVG(taux_reel), 2) AS taux_reel_moy_pct
FROM courbe_trim
GROUP BY trimestre
ORDER BY trimestre ASC;
\`\`\`

\`\`\`text
trimestre | oat_10y_moy_pct | pente_2_10_moy_bps | inflation_hicp_pct | taux_reel_moy_pct
----------+-----------------+--------------------+--------------------+------------------
2023-Q1   | 2.92            | -9.7               | 6.9                | -3.98            
2023-Q2   | 2.98            | -37.7              | 5.5                | -2.52            
2023-Q3   | 3.23            | -35.3              | 4.3                | -1.07            
2023-Q4   | 2.98            | -22.3              | 2.9                | 0.08             
\`\`\`

La courbe OAT est inversée en moyenne sur les $4$ trimestres (jusqu'à $-37.7\\text{ bps}$ au \`2023-Q2\`), tandis que la désinflation fait passer le taux réel moyen de $-3.98\\%$ au T1 à $+0.08\\%$ au T4.

### 📦 Export Portfolio GitHub (Architecture & README)

Structure recommandée pour présenter cet observatoire ALM de courbe de taux sur GitHub :

\`\`\`text
oat-yield-curve-alm-stress-sql/
├── README.md                       # Théorie Nelson-Siegel, équation de Taylor & graphiques d'inversion
├── sql/
│   ├── 01_curve_factors_slope.sql  # Pente 2Y-10Y, Butterfly 2Y-5Y-10Y & détection d'inversion
│   ├── 02_macro_fisher_join.sql    # Jointure temporelle OAT x HICP & taux réels
│   └── 03_taylor2_stress_test.sql  # Chocs LAG() & valorisation Duration/Convexité
├── scripts/
│   └── plot_oat_regimes.py         # Extraction SQL -> heatmap matplotlib des chocs mensuels
└── tests/
    └── test_taylor_convexity.py    # Test d'invariant : ordre 2 >= ordre 1 pour tout dy != 0
\`\`\`

- **Passage à l'échelle (PostgreSQL / DuckDB)** : sous PostgreSQL/DuckDB, remplacez l'extraction de chaîne \`SUBSTR(...)\` par \`TO_CHAR(date, 'YYYY-"Q"Q')\` (PostgreSQL) ou \`STRFTIME(date, '%Y') || '-Q' || QUARTER(date)\` (DuckDB), et utilisez une jointure \`ASOF JOIN\` native pour aligner des séries tick-by-tick ou journalières sur des publications macroéconomiques irrégulières.
- **Questions fréquentes en entretien (ALM / Fixed Income Quant)** :
  1. *Que signifie un Butterfly négatif comme $-53\\text{ bps}$ sur notre courbe OAT ?* — Ici $2 y^{(5)} - y^{(2)} - y^{(10)} < 0$ signifie que le taux $5\\text{ ans}$ est nettement inférieur à la moyenne des taux $2\\text{ ans}$ et $10\\text{ ans}$ (courbe en creux au ventre $5\\text{Y}$).
  2. *Pourquoi la convexité apporte-t-elle toujours un gain positif dans l'équation de Taylor ?* — Parce que $(\\Delta y)^2 \\ge 0$ quel que soit le signe du choc : la courbe Prix-Rendement d'une obligation sans option cachée est convexe, donc $\\frac{1}{2}C(\\Delta y)^2 \\ge 0$ améliore toujours la performance par rapport à l'approximation linéaire de duration.
  3. *Comment éviter qu'un choc nul sur la première date n'engendre un \`NULL\` dans \`ORDER BY\` ?* — En convertissant explicitement \`dy_decimal IS NULL\` en \`0.0\` avant le classement \`DENSE_RANK()\`.
      `,
      taskMarkdown: `
Construisez l'observatoire courbe OAT en **3 CTEs** sur \`courbe_taux_oat\` et \`macro_taux\` :

1. **CTE 1 — \`courbe_avec_trimestre\`** (depuis \`courbe_taux_oat\`) :
   - \`date\`, \`periode_trim\` : \`SUBSTR(date, 1, 4) || '-Q' || ((CAST(SUBSTR(date, 6, 2) AS INTEGER) - 1) / 3 + 1)\`
   - \`taux_2y\`, \`taux_5y\`, \`taux_10y\`
   - \`pente_2_10\` : \`taux_10y - taux_2y\`
   - \`courbure_butterfly\` : \`2.0 * taux_5y - taux_2y - taux_10y\`
   - \`taux_10y_prec\` : \`LAG(taux_10y) OVER (ORDER BY date ASC)\`
2. **CTE 2 — \`dynamique_taux\`** : \`courbe_avec_trimestre c LEFT JOIN macro_taux m ON c.periode_trim = m.periode\` calculant :
   - \`taux_reel_10y_pct\` : \`ROUND(c.taux_10y - m.inflation_hicp, 2)\`
   - \`pente_2_10_bps\` : \`ROUND(c.pente_2_10 * 100.0, 1)\`
   - \`butterfly_bps\` : \`ROUND(c.courbure_butterfly * 100.0, 1)\`
   - \`delta_10y_pp\` : \`c.taux_10y - c.taux_10y_prec\`
   - \`dy_decimal\` : \`(c.taux_10y - c.taux_10y_prec) / 100.0\`
3. **CTE 3 — \`stress_taylor\`** : calculez :
   - \`choc_10y_bps\` : \`ROUND(COALESCE(delta_10y_pp * 100.0, 0.0), 1)\`
   - \`impact_taylor_pct_brut\` : \`0.0\` si \`dy_decimal IS NULL\`, sinon \`(-7.0 * dy_decimal + 0.5 * 60.0 * POWER(dy_decimal, 2)) * 100.0\`
   - \`regime_courbe\` : \`< 0.0\` $\\to$ \`'INVERSEE'\`, \`<= 0.25\` $\\to$ \`'PLATE'\`, sinon \`'NORMALE'\`
4. **Requête finale** : projetez dans **cet ordre exact** :
   \`date\`, \`periode_trim\`, \`taux_2y\`, \`taux_10y\`, \`taux_reel_10y_pct\`, \`pente_2_10_bps\`, \`butterfly_bps\`, \`choc_10y_bps\`, \`ROUND(impact_taylor_pct_brut, 3) AS impact_prix_taylor_pct\`, \`regime_courbe\`, \`DENSE_RANK() OVER (ORDER BY impact_taylor_pct_brut ASC) AS rang_pire_choc\`.

Triez par \`rang_pire_choc ASC, date ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL Portfolio complet ci-dessous :\n",
      solutionCode: `-- Observatoire Courbe OAT, Régime d'Inversion & Stress-Test ALM Taylor Ordre 2
WITH courbe_avec_trimestre AS (
    -- CTE 1 : Extraction pente 2Y-10Y, courbure Butterfly, clé trimestrielle et taux t-1 via LAG
    SELECT
        date,
        SUBSTR(date, 1, 4) || '-Q' || ((CAST(SUBSTR(date, 6, 2) AS INTEGER) - 1) / 3 + 1) AS periode_trim,
        taux_2y, taux_5y, taux_10y,
        taux_10y - taux_2y AS pente_2_10,
        2.0 * taux_5y - taux_2y - taux_10y AS courbure_butterfly,
        LAG(taux_10y) OVER (ORDER BY date ASC) AS taux_10y_prec
    FROM courbe_taux_oat
),
dynamique_taux AS (
    -- CTE 2 : Croisement avec macro_taux (inflation HICP) et variation mensuelle en décimal
    SELECT
        c.date, c.periode_trim, c.taux_2y, c.taux_5y, c.taux_10y,
        ROUND(c.taux_10y - m.inflation_hicp, 2) AS taux_reel_10y_pct,
        ROUND(c.pente_2_10 * 100.0, 1) AS pente_2_10_bps,
        ROUND(c.courbure_butterfly * 100.0, 1) AS butterfly_bps,
        c.pente_2_10,
        c.taux_10y - c.taux_10y_prec AS delta_10y_pp,
        (c.taux_10y - c.taux_10y_prec) / 100.0 AS dy_decimal
    FROM courbe_avec_trimestre c
    LEFT JOIN macro_taux m ON c.periode_trim = m.periode
),
stress_taylor AS (
    -- CTE 3 : Approximation de Taylor d'ordre 2 (Duration modifiée = 7.0, Convexité = 60.0)
    SELECT
        date, periode_trim, taux_2y, taux_10y, taux_reel_10y_pct,
        pente_2_10_bps, butterfly_bps,
        ROUND(COALESCE(delta_10y_pp * 100.0, 0.0), 1) AS choc_10y_bps,
        CASE
            WHEN dy_decimal IS NULL THEN 0.0
            ELSE (-7.0 * dy_decimal + 0.5 * 60.0 * POWER(dy_decimal, 2)) * 100.0
        END AS impact_taylor_pct_brut,
        CASE
            WHEN pente_2_10 < 0.0 THEN 'INVERSEE'
            WHEN pente_2_10 <= 0.25 THEN 'PLATE'
            ELSE 'NORMALE'
        END AS regime_courbe
    FROM dynamique_taux
)
SELECT
    date, periode_trim, taux_2y, taux_10y, taux_reel_10y_pct,
    pente_2_10_bps, butterfly_bps, choc_10y_bps,
    ROUND(impact_taylor_pct_brut, 3) AS impact_prix_taylor_pct,
    regime_courbe,
    DENSE_RANK() OVER (ORDER BY impact_taylor_pct_brut ASC) AS rang_pire_choc
FROM stress_taylor
ORDER BY rang_pire_choc ASC, date ASC;`,
      validationQuery: `-- Observatoire Courbe OAT, Régime d'Inversion & Stress-Test ALM Taylor Ordre 2
WITH courbe_avec_trimestre AS (
    -- CTE 1 : Extraction pente 2Y-10Y, courbure Butterfly, clé trimestrielle et taux t-1 via LAG
    SELECT
        date,
        SUBSTR(date, 1, 4) || '-Q' || ((CAST(SUBSTR(date, 6, 2) AS INTEGER) - 1) / 3 + 1) AS periode_trim,
        taux_2y, taux_5y, taux_10y,
        taux_10y - taux_2y AS pente_2_10,
        2.0 * taux_5y - taux_2y - taux_10y AS courbure_butterfly,
        LAG(taux_10y) OVER (ORDER BY date ASC) AS taux_10y_prec
    FROM courbe_taux_oat
),
dynamique_taux AS (
    -- CTE 2 : Croisement avec macro_taux (inflation HICP) et variation mensuelle en décimal
    SELECT
        c.date, c.periode_trim, c.taux_2y, c.taux_5y, c.taux_10y,
        ROUND(c.taux_10y - m.inflation_hicp, 2) AS taux_reel_10y_pct,
        ROUND(c.pente_2_10 * 100.0, 1) AS pente_2_10_bps,
        ROUND(c.courbure_butterfly * 100.0, 1) AS butterfly_bps,
        c.pente_2_10,
        c.taux_10y - c.taux_10y_prec AS delta_10y_pp,
        (c.taux_10y - c.taux_10y_prec) / 100.0 AS dy_decimal
    FROM courbe_avec_trimestre c
    LEFT JOIN macro_taux m ON c.periode_trim = m.periode
),
stress_taylor AS (
    -- CTE 3 : Approximation de Taylor d'ordre 2 (Duration modifiée = 7.0, Convexité = 60.0)
    SELECT
        date, periode_trim, taux_2y, taux_10y, taux_reel_10y_pct,
        pente_2_10_bps, butterfly_bps,
        ROUND(COALESCE(delta_10y_pp * 100.0, 0.0), 1) AS choc_10y_bps,
        CASE
            WHEN dy_decimal IS NULL THEN 0.0
            ELSE (-7.0 * dy_decimal + 0.5 * 60.0 * POWER(dy_decimal, 2)) * 100.0
        END AS impact_taylor_pct_brut,
        CASE
            WHEN pente_2_10 < 0.0 THEN 'INVERSEE'
            WHEN pente_2_10 <= 0.25 THEN 'PLATE'
            ELSE 'NORMALE'
        END AS regime_courbe
    FROM dynamique_taux
)
SELECT
    date, periode_trim, taux_2y, taux_10y, taux_reel_10y_pct,
    pente_2_10_bps, butterfly_bps, choc_10y_bps,
    ROUND(impact_taylor_pct_brut, 3) AS impact_prix_taylor_pct,
    regime_courbe,
    DENSE_RANK() OVER (ORDER BY impact_taylor_pct_brut ASC) AS rang_pire_choc
FROM stress_taylor
ORDER BY rang_pire_choc ASC, date ASC;`,
      datasets: [],
      hints: [
        "Construisez la clé trimestrielle dans courbe_avec_trimestre avec SUBSTR(date, 1, 4) || '-Q' || ((CAST(SUBSTR(date, 6, 2) AS INTEGER) - 1) / 3 + 1) et récupérez le taux précédent via LAG(taux_10y) OVER (ORDER BY date ASC).",
        "Dans dynamique_taux, divisez (c.taux_10y - c.taux_10y_prec) par 100.0 pour obtenir dy_decimal en unité décimale (par exemple +0.0032 pour +32 bps).",
        "Dans stress_taylor, protégez le cas dy_decimal IS NULL avec 0.0, appliquez (-7.0 * dy_decimal + 0.5 * 60.0 * POWER(dy_decimal, 2)) * 100.0, et classez par rang_pire_choc ASC (ordre croissant de impact_taylor_pct_brut).",
      ],
      guide: {
        theoryToPracticeLink:
          "La CTE \`courbe_avec_trimestre\` extrait les facteurs géométriques $S_t$, $B_t$ et $y_{t-1}^{(10)}$ par \`LAG()\`; \`dynamique_taux\` croise l'inflation HICP pour obtenir $r_t^{\\text{réel},10\\text{Y}}$ et $\\Delta y_t$; enfin \`stress_taylor\` évalue l'équation de Taylor $\\left(-D^*\\Delta y_t + \\frac{1}{2}C(\\Delta y_t)^2\\right)\\times 100$ et classifie le régime de courbe.",
        stepByStepPlan: [
          "Extraire `periode_trim`, `pente_2_10`, `courbure_butterfly` et `taux_10y_prec` (`LAG`) dans `courbe_avec_trimestre`.",
          "Joindre `macro_taux` en `LEFT JOIN` sur `periode_trim = periode` dans `dynamique_taux` pour calculer `taux_reel_10y_pct`, les facteurs en `bps` et `dy_decimal`.",
          "Calculer `choc_10y_bps`, `impact_taylor_pct_brut` (avec `POWER(dy_decimal, 2)`) et `regime_courbe` dans `stress_taylor`.",
          "Projeter les $11$ colonnes finales, classer par `DENSE_RANK() OVER (ORDER BY impact_taylor_pct_brut ASC)` et trier par `rang_pire_choc ASC, date ASC`.",
        ],
        concepts: [
          {
            symbol: "LAG(taux_10y) OVER (ORDER BY date ASC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Lit la valeur du taux OAT 10 ans au mois précédent $t-1$ pour mesurer la variation mensuelle sans auto-jointure.",
          },
          {
            symbol: "SUBSTR(date, 1, 4) || '-Q' || ...",
            kind: "Syntaxe",
            roleInExercise:
              "Projette la date mensuelle `YYYY-MM-DD` sur la clé trimestrielle `YYYY-Q#` permettant la jointure avec `macro_taux`.",
          },
          {
            symbol: "pente_2_10 / courbure_butterfly",
            kind: "Variable",
            roleInExercise:
              "Facteurs de pente ($y_{10}-y_2$) et de courbure papillon ($2y_5-y_2-y_{10}$) convertis en points de base ($\\times 100$).",
          },
          {
            symbol: "dy_decimal",
            kind: "Variable",
            roleInExercise:
              "Variation mensuelle du taux 10Y en unité décimale ($\\Delta y_t = \\Delta\\% / 100$), indispensable pour l'homogénéité dimensionnelle avec $D^*=7$ et $C=60$.",
          },
          {
            symbol: "POWER(dy_decimal, 2)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Calcule $(\\Delta y_t)^2$ pour le terme quadratique de convexité $+\\frac{1}{2}C(\\Delta y_t)^2$ de l'approximation de Taylor d'ordre 2.",
          },
          {
            symbol: "regime_courbe",
            kind: "Variable",
            roleInExercise:
              "Étiquette structurelle : `'INVERSEE'` si $S_t < 0$, `'PLATE'` si $0 \\le S_t \\le 0.25$, `'NORMALE'` si $S_t > 0.25$.",
          },
          {
            symbol: "DENSE_RANK() OVER (ORDER BY impact_taylor_pct_brut ASC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Classe les mois du choc obligataire le plus négatif (rang $1$, février $2023$ à $-2.209\\%$) jusqu'au meilleur rallye (rang $12$, décembre $2023$ à $+3.356\\%$).",
          },
        ],
        guidedCode: `-- Observatoire Courbe OAT, Régime d'Inversion & Stress-Test ALM Taylor Ordre 2
WITH courbe_avec_trimestre AS (
    SELECT
        date,
        SUBSTR(date, 1, 4) || '-Q' || ((CAST(SUBSTR(date, 6, 2) AS INTEGER) - 1) / 3 + 1) AS periode_trim,
        taux_2y, taux_5y, taux_10y,
        taux_10y - taux_2y AS pente_2_10,
        2.0 * taux_5y - taux_2y - taux_10y AS courbure_butterfly,
        LAG(taux_10y) OVER (ORDER BY date ASC) AS taux_10y_prec
    FROM courbe_taux_oat
),
dynamique_taux AS (
    SELECT
        c.date, c.periode_trim, c.taux_2y, c.taux_5y, c.taux_10y,
        ROUND(c.taux_10y - m.inflation_hicp, 2) AS taux_reel_10y_pct,
        ROUND(c.pente_2_10 * 100.0, 1) AS pente_2_10_bps,
        ROUND(c.courbure_butterfly * 100.0, 1) AS butterfly_bps,
        c.pente_2_10,
        c.taux_10y - c.taux_10y_prec AS delta_10y_pp,
        (c.taux_10y - c.taux_10y_prec) / 100.0 AS dy_decimal
    FROM courbe_avec_trimestre c
    LEFT JOIN macro_taux m ON c.periode_trim = m.periode
),
stress_taylor AS (
    SELECT
        date, periode_trim, taux_2y, taux_10y, taux_reel_10y_pct,
        pente_2_10_bps, butterfly_bps,
        ROUND(COALESCE(delta_10y_pp * 100.0, 0.0), 1) AS choc_10y_bps,
        CASE
            WHEN dy_decimal IS NULL THEN 0.0
            ELSE (___ * dy_decimal + 0.5 * ___ * POWER(dy_decimal, 2)) * 100.0
        END AS impact_taylor_pct_brut,
        CASE
            WHEN pente_2_10 < 0.0 THEN '___'
            WHEN pente_2_10 <= 0.25 THEN '___'
            ELSE '___'
        END AS regime_courbe
    FROM dynamique_taux
)
SELECT
    date, periode_trim, taux_2y, taux_10y, taux_reel_10y_pct,
    pente_2_10_bps, butterfly_bps, choc_10y_bps,
    ROUND(impact_taylor_pct_brut, 3) AS impact_prix_taylor_pct,
    regime_courbe,
    DENSE_RANK() OVER (ORDER BY impact_taylor_pct_brut ASC) AS rang_pire_choc
FROM stress_taylor
ORDER BY rang_pire_choc ASC, date ASC;`,
      },
    },

    // =========================================================================
    // PROJET 4 : Simulateur Récursif Obligataire & Couverture ALM (WITH RECURSIVE)
    // =========================================================================
    {
      id: "v4-sql-4",
      title:
        "Projet 4 — Simulateur Récursif d'Échéancier Obligataire & Couverture ALM Actif-Passif (WITH RECURSIVE)",
      category: "alm",
      language: "sql",
      difficulty: "Avancé",
      durationMinutes: 50,
      description:
        "Programmez en pur SQL récursif (WITH RECURSIVE, sans table physique) un moteur complet de projection actif-passif sur 10 ans : portefeuille obligataire bi-tranches (Tranche A 50M coupon 3.2% à 5 ans, Tranche B 50M coupon 4.5% à 10 ans) adossé à une rente de passif de 12M/an sur 8 ans actualisée à y = 3.5%, calculant flux nets, gap de liquidité cumulé, valeurs actuelles, Durations de Macaulay, Gap de Duration et Ratio de Couverture ALM.",
      theoryMarkdown: `
### Moteur Récursif ALM Actif-Passif : Échéancier Multi-Tranches, Liquidité & Duration Gap

#### 🎓 Modèle Mathématique d'Appariement Actif-Passif (*Asset-Liability Management*)

Une caisse de retraite ou un assureur Vie adosse ses engagements de passif à un portefeuille d'obligations souveraines ou *Investment Grade*. L'analyse ALM mesure simultanément deux dimensions complémentaires : la **liquidité annuelle** (capacité à honorer chaque flux sans vente forcée) et l'**immunisation économique** (sensibilité relative des valeurs actuelles aux variations de taux).

**1. Génération des flux contractuels Actif ($A$) et Passif ($L$)**

L'actif est composé de deux obligations *in fine* (*bullet bonds*) de nominal $N_A = N_B = 50\\text{ M EUR}$ :
- **Tranche A** : coupon $c_A = 3.2\\%$, maturité $T_A = 5\\text{ ans}$ ($\\text{CF}_{A,t} = 1.60$ pour $t < 5$, $51.60$ pour $t = 5$, $0$ ensuite) ;
- **Tranche B** : coupon $c_B = 4.5\\%$, maturité $T_B = 10\\text{ ans}$ ($\\text{CF}_{B,t} = 2.25$ pour $t < 10$, $52.25$ pour $t = 10$).

Le passif est une suite de rentes certaines de $12.00\\text{ M EUR/an}$ versées sur $T_L = 8\\text{ ans}$ ($\\text{CF}_{L,t} = 12.00\\,\\mathbf{1}_{\\{t \\le 8\\}}$). Le flux actif total et le **gap de liquidité annuel / cumulé** s'écrivent :

$$
\\text{CF}_{t}^{\\text{actif}} = \\text{CF}_{A,t} + \\text{CF}_{B,t}, \\qquad G_t = \\text{CF}_{t}^{\\text{actif}} - \\text{CF}_{L,t}, \\qquad G_t^{\\text{cum}} = \\sum_{s=1}^{t} G_s
$$

**2. Valorisation économique, Duration de Macaulay et Ratio de Couverture**

Sous une courbe d'actualisation plate à $y = 3.5\\%$ ($1 + y = 1.035$), les valeurs actuelles (*Present Values*) annuelles et totales valent :

$$
\\text{PV}_t^{X} = \\frac{\\text{CF}_{t}^{X}}{(1 + y)^t}, \\qquad \\text{PV}^{X} = \\sum_{t=1}^{10} \\text{PV}_t^{X}, \\qquad X \\in \\{\\text{actif}, \\text{passif}\\}
$$

La **Duration de Macaulay** (barycentre temporel des flux actualisés), le **Gap de Duration** et le **Ratio de Couverture Solvabilité** s'établissent à :

$$
D_{\\text{Mac}}^{X} = \\frac{\\sum_{t=1}^{10} t \\cdot \\text{PV}_t^{X}}{\\text{PV}^{X}}, \\qquad \\Delta D_{\\text{Mac}} = D_{\\text{Mac}}^{\\text{actif}} - D_{\\text{Mac}}^{\\text{passif}}, \\qquad R_{\\text{couv}} = 100 \\times \\frac{\\text{PV}^{\\text{actif}}}{\\text{PV}^{\\text{passif}}}
$$

Un ratio $R_{\\text{couv}} > 100\\%$ garantit l'excédent économique de base, mais un $\\Delta D_{\\text{Mac}} > 0$ signifie que **l'actif est plus long que le passif** : en cas de hausse des taux, la valeur de marché de l'actif chute plus vite que celle du passif, érodant le surplus économique.

> 🏦 **Lien ALM, Risk Management & Actuariat :**
> Sous **Solvabilité II** (*Best Estimate Liability* et *Matching Adjustment*) et la norme des fonds de pension **IORP II**, le comité ALM surveille autant les **trous de trésorerie intermédiaires** ($G_t^{\\text{cum}} = -32.60\\text{ M EUR}$ à $t=4$ avant le remboursement de la Tranche A) que le **Duration Gap** ($+2.288\\text{ ans}$), afin d'éviter qu'un défaut de liquidité à court terme ou une hausse des taux de $+200\\text{ bps}$ ne contraigne l'assureur à liquider la Tranche B à perte.

#### 💻 Masterclass SQL d'Architecture Entrepôt

Ce moteur ALM pur SQL s'exécute sans lire la moindre table existante grâce à une **CTE récursive** suivie de **3 CTEs analytiques** :

1. **CTE 1 récursive (\`grille_temps\`)** : génère exactement les entiers $t = 1, 2, \\dots, 10$ avec le cas de base \`SELECT 1 AS annee\`, \`UNION ALL\` et la clause d'arrêt \`WHERE annee < 10\`.
2. **CTE 2 (\`flux_tranches\`)** : modélise les coupons et remboursements de capital via \`CASE WHEN\`.
3. **CTE 3 (\`flux_actualises\`)** : calcule les flux nets \`gap_liquidite\` et actualise chaque flux avec la fonction enregistrée \`POWER(1.035, annee)\`.
4. **CTE 4 (\`metriques_alm\`)** : combine un fenêtrage cumulatif (\`SUM(gap_liquidite) OVER (ORDER BY annee ASC)\`) et des fenêtres globales (\`OVER ()\`) pour calculer les deux \`PV\` totales et les deux durations de Macaulay sur chaque ligne sans détruire le détail annuel.

\`\`\`sql
-- Structure minimale d'une grille temporelle récursive en pur SQL
WITH RECURSIVE grille_temps AS (
    SELECT 1 AS annee
    UNION ALL
    SELECT annee + 1 FROM grille_temps WHERE annee < 10
)
SELECT annee, ROUND(1.0 / POWER(1.035, annee), 6) AS facteur_actualisation
FROM grille_temps;
\`\`\`

#### 🖥️ Exemple Exécuté (Terminal REPL SQLite)

Stress-test parallèle de courbe de taux exécuté en SQLite pur via \`WITH RECURSIVE\` et \`CROSS JOIN\` sur ce portefeuille ALM ($-100\\text{ bps}$, base $3.5\\%$, $+100\\text{ bps}$, $+200\\text{ bps}$) :

\`\`\`sql
WITH RECURSIVE grille AS (
    SELECT 1 AS annee
    UNION ALL
    SELECT annee + 1 FROM grille WHERE annee < 10
),
scenarios AS (
    SELECT 0.025 AS y, 'Choc -100 bps (2.5%)' AS scenario UNION ALL
    SELECT 0.035 AS y, 'Base ALM (3.5%)'      AS scenario UNION ALL
    SELECT 0.045 AS y, 'Choc +100 bps (4.5%)' AS scenario UNION ALL
    SELECT 0.055 AS y, 'Choc +200 bps (5.5%)' AS scenario
),
flux AS (
    SELECT
        s.scenario, s.y, g.annee,
        (CASE WHEN g.annee < 5 THEN 1.6 WHEN g.annee = 5 THEN 51.6 ELSE 0.0 END)
        + (CASE WHEN g.annee < 10 THEN 2.25 WHEN g.annee = 10 THEN 52.25 ELSE 0.0 END) AS cf_actif,
        CASE WHEN g.annee <= 8 THEN 12.0 ELSE 0.0 END AS cf_passif
    FROM grille g
    CROSS JOIN scenarios s
)
SELECT
    scenario,
    ROUND(SUM(cf_actif / POWER(1.0 + y, annee)), 2) AS pv_actif_m,
    ROUND(SUM(cf_passif / POWER(1.0 + y, annee)), 2) AS pv_passif_m,
    ROUND(SUM(cf_actif / POWER(1.0 + y, annee)) - SUM(cf_passif / POWER(1.0 + y, annee)), 2) AS surplus_alm_m,
    ROUND(100.0 * SUM(cf_actif / POWER(1.0 + y, annee)) / SUM(cf_passif / POWER(1.0 + y, annee)), 2) AS couverture_pct
FROM flux
GROUP BY scenario, y
ORDER BY y ASC;
\`\`\`

\`\`\`text
scenario             | pv_actif_m | pv_passif_m | surplus_alm_m | couverture_pct
---------------------+------------+-------------+---------------+---------------
Choc -100 bps (2.5%) | 110.38     | 86.04       | 24.34         | 128.28        
Base ALM (3.5%)      | 103.48     | 82.49       | 20.99         | 125.45        
Choc +100 bps (4.5%) | 97.15      | 79.15       | 18            | 122.74        
Choc +200 bps (5.5%) | 91.32      | 76.01       | 15.31         | 120.13        
\`\`\`

La simulation prouve la mécanique du **Duration Gap positif** ($+2.288\\text{ ans}$) : lors d'un choc de $+200\\text{ bps}$ ($3.5\\% \\to 5.5\\%$), l'actif perd $12.16\\text{ M EUR}$ ($-11.75\\%$) contre seulement $6.48\\text{ M EUR}$ ($-7.86\\%$) pour le passif, comprimant le surplus ALM de $20.99\\text{ M}$ à $15.31\\text{ M EUR}$ et le ratio de couverture de $125.45\\%$ à $120.13\\%$.

### 📦 Export Portfolio GitHub (Architecture & README)

Structure recommandée pour présenter ce moteur ALM récursif en SQL pur sur GitHub :

\`\`\`text
recursive-alm-cashflow-engine-sql/
├── README.md                         # Démonstrations Duration Macaulay, Gap Liquidité & Stress-Test
├── sql/
│   ├── 01_recursive_bond_schedule.sql # Générateur WITH RECURSIVE multi-tranches
│   ├── 02_liability_matching_alm.sql  # Adossement Actif-Passif & Durations fenêtrées
│   └── 03_parallel_rate_shocks.sql    # Matrice de stress Solvabilité II (-100/+200 bps)
├── scripts/
│   └── optimize_bond_weights.py      # Rééquilibrage des nominaux (N_A, N_B) pour annuler le Gap
└── tests/
    └── test_par_theorem_and_gaps.py  # Tests unitaires : PV au pair quand y = coupon, somme des CF
\`\`\`

- **Passage à l'échelle (PostgreSQL / DuckDB)** : sous PostgreSQL, la CTE récursive peut être remplacée avantageusement par \`GENERATE_SERIES(1, 360)\` pour des échéanciers mensuels sur $30\\text{ ans}$ (ou \`RANGE(1, 361)\` sous DuckDB), et les paramètres des obligations ($N_k, c_k, T_k$) sont stockés dans une table \`portefeuille_obligations\` jointe en \`CROSS JOIN\` / \`LEFT JOIN\` à la grille temporelle.
- **Questions fréquentes en entretien (Actuaire ALM / Trésorerie Institutionnelle)** :
  1. *Le bilan a un ratio de couverture de $125.45\\%$ ; est-il pour autant immunisé contre un risque de trésorerie ?* — Non ! Le gap de liquidité cumulé atteint $-32.60\\text{ M EUR}$ dès la $4^\\text{e}$ année et $-20.00\\text{ M EUR}$ à l'année $8$ ; sans ligne de liquidité ou réinvestissement, l'assureur ne couvre pas les rentes avant l'échéance des obligations *in fine*.
  2. *Comment réduire le Duration Gap de $+2.288\\text{ ans}$ vers zéro en gestion ALM ?* — En augmentant le poids de la Tranche A ($5\\text{ ans}$) au détriment de la Tranche B ($10\\text{ ans}$) ou en contractant un *Interest Rate Swap* payeur de taux fixe.
  3. *Quelle est la règle de sécurité impérative d'une CTE \`WITH RECURSIVE\` ?* — Toujours relier l'ancrage et le membre récursif par \`UNION ALL\` (plus performant que \`UNION\`) et inclure une condition d'arrêt monotone (\`WHERE annee < 10\`) pour éviter toute récursion infinie.
      `,
      taskMarkdown: `
Générez en pur SQL (\`WITH RECURSIVE\`, sans aucune table source) le simulateur ALM complet sur **10 ans** :

1. **CTE 1 (Récursive) — \`grille_temps\`** : générez \`annee = 1\` jusqu'à \`10\` via \`UNION ALL\` et \`WHERE annee < 10\`.
2. **CTE 2 — \`flux_tranches\`** (depuis \`grille_temps\`) :
   - \`cf_tranche_a\` : coupon $3.2\\%$ sur nominal $50.0\\text{ M}$ pour \`annee < 5\` (\`50.0 * 0.032\`), coupon + remboursement à \`annee = 5\` (\`50.0 * 0.032 + 50.0\`), sinon \`0.0\`
   - \`cf_tranche_b\` : coupon $4.5\\%$ sur nominal $50.0\\text{ M}$ pour \`annee < 10\` (\`50.0 * 0.045\`), coupon + remboursement à \`annee = 10\` (\`50.0 * 0.045 + 50.0\`), sinon \`0.0\`
   - \`cf_passif\` : \`12.0\` si \`annee <= 8\`, sinon \`0.0\`
3. **CTE 3 — \`flux_actualises\`** :
   - \`cf_actif\` = \`cf_tranche_a + cf_tranche_b\`, \`gap_liquidite\` = \`(cf_tranche_a + cf_tranche_b) - cf_passif\`
   - \`va_actif\` = \`(cf_tranche_a + cf_tranche_b) / POWER(1.035, annee)\`
   - \`va_passif\` = \`cf_passif / POWER(1.035, annee)\`
4. **CTE 4 — \`metriques_alm\`** : calculez en conservant la précision flottante :
   - \`gap_liquidite_cumule\` : \`SUM(gap_liquidite) OVER (ORDER BY annee ASC)\`
   - \`va_totale_actif\` : \`SUM(va_actif) OVER ()\`
   - \`va_totale_passif\` : \`SUM(va_passif) OVER ()\`
   - \`duration_mac_actif\` : \`SUM(annee * va_actif) OVER () / SUM(va_actif) OVER ()\`
   - \`duration_mac_passif\` : \`SUM(annee * va_passif) OVER () / SUM(va_passif) OVER ()\`
5. **Requête finale** : projetez dans **cet ordre exact** les $15$ colonnes :
   - \`annee\`
   - \`cf_tranche_a_m\`, \`cf_tranche_b_m\`, \`cf_actif_m\`, \`cf_passif_m\`, \`gap_liquidite_m\`, \`gap_cumule_m\` arrondis à $2$ décimales
   - \`va_actif_m\`, \`va_passif_m\` arrondis à $4$ décimales
   - \`pv_actif_tot_m\`, \`pv_passif_tot_m\` arrondis à $2$ décimales
   - \`dur_mac_actif\`, \`dur_mac_passif\`, \`gap_duration_ans\` (\`duration_mac_actif - duration_mac_passif\`) arrondis à $3$ décimales
   - \`ratio_couverture_pct\` : \`ROUND(100.0 * va_totale_actif / va_totale_passif, 2)\`

Triez par \`annee ASC;\`.
      `,
      initialCode: "-- Rédigez votre pipeline SQL Portfolio complet ci-dessous :\n",
      solutionCode: `-- Simulateur Récursif d'Échéancier Obligataire Multi-Tranches & Couverture ALM Actif-Passif
WITH RECURSIVE grille_temps AS (
    -- CTE 1 (Récursive) : Génération pure SQL de l'horizon annuel t = 1..10
    SELECT 1 AS annee
    UNION ALL
    SELECT annee + 1
    FROM grille_temps
    WHERE annee < 10
),
flux_tranches AS (
    -- CTE 2 : Modélisation des flux Actif (Tranche A 5y 3.2%, Tranche B 10y 4.5%) et Passif (12M/an 1..8)
    SELECT
        annee,
        CASE WHEN annee < 5 THEN 50.0 * 0.032 WHEN annee = 5 THEN 50.0 * 0.032 + 50.0 ELSE 0.0 END AS cf_tranche_a,
        CASE WHEN annee < 10 THEN 50.0 * 0.045 WHEN annee = 10 THEN 50.0 * 0.045 + 50.0 ELSE 0.0 END AS cf_tranche_b,
        CASE WHEN annee <= 8 THEN 12.0 ELSE 0.0 END AS cf_passif
    FROM grille_temps
),
flux_actualises AS (
    -- CTE 3 : Flux nets de liquidité et valeurs actuelles (courbe plate y = 3.5%)
    SELECT
        annee, cf_tranche_a, cf_tranche_b,
        cf_tranche_a + cf_tranche_b AS cf_actif,
        cf_passif,
        (cf_tranche_a + cf_tranche_b) - cf_passif AS gap_liquidite,
        (cf_tranche_a + cf_tranche_b) / POWER(1.035, annee) AS va_actif,
        cf_passif / POWER(1.035, annee) AS va_passif
    FROM flux_tranches
),
metriques_alm AS (
    -- CTE 4 : Agrégats ALM globaux par fenêtrage (PV Actif/Passif, Durations Macaulay, Gap cumulé)
    SELECT
        annee, cf_tranche_a, cf_tranche_b, cf_actif, cf_passif, gap_liquidite,
        SUM(gap_liquidite) OVER (ORDER BY annee ASC) AS gap_liquidite_cumule,
        va_actif, va_passif,
        SUM(va_actif) OVER () AS va_totale_actif,
        SUM(va_passif) OVER () AS va_totale_passif,
        SUM(annee * va_actif) OVER () / SUM(va_actif) OVER () AS duration_mac_actif,
        SUM(annee * va_passif) OVER () / SUM(va_passif) OVER () AS duration_mac_passif
    FROM flux_actualises
)
SELECT
    annee,
    ROUND(cf_tranche_a, 2) AS cf_tranche_a_m,
    ROUND(cf_tranche_b, 2) AS cf_tranche_b_m,
    ROUND(cf_actif, 2) AS cf_actif_m,
    ROUND(cf_passif, 2) AS cf_passif_m,
    ROUND(gap_liquidite, 2) AS gap_liquidite_m,
    ROUND(gap_liquidite_cumule, 2) AS gap_cumule_m,
    ROUND(va_actif, 4) AS va_actif_m,
    ROUND(va_passif, 4) AS va_passif_m,
    ROUND(va_totale_actif, 2) AS pv_actif_tot_m,
    ROUND(va_totale_passif, 2) AS pv_passif_tot_m,
    ROUND(duration_mac_actif, 3) AS dur_mac_actif,
    ROUND(duration_mac_passif, 3) AS dur_mac_passif,
    ROUND(duration_mac_actif - duration_mac_passif, 3) AS gap_duration_ans,
    ROUND(100.0 * va_totale_actif / va_totale_passif, 2) AS ratio_couverture_pct
FROM metriques_alm
ORDER BY annee ASC;`,
      validationQuery: `-- Simulateur Récursif d'Échéancier Obligataire Multi-Tranches & Couverture ALM Actif-Passif
WITH RECURSIVE grille_temps AS (
    -- CTE 1 (Récursive) : Génération pure SQL de l'horizon annuel t = 1..10
    SELECT 1 AS annee
    UNION ALL
    SELECT annee + 1
    FROM grille_temps
    WHERE annee < 10
),
flux_tranches AS (
    -- CTE 2 : Modélisation des flux Actif (Tranche A 5y 3.2%, Tranche B 10y 4.5%) et Passif (12M/an 1..8)
    SELECT
        annee,
        CASE WHEN annee < 5 THEN 50.0 * 0.032 WHEN annee = 5 THEN 50.0 * 0.032 + 50.0 ELSE 0.0 END AS cf_tranche_a,
        CASE WHEN annee < 10 THEN 50.0 * 0.045 WHEN annee = 10 THEN 50.0 * 0.045 + 50.0 ELSE 0.0 END AS cf_tranche_b,
        CASE WHEN annee <= 8 THEN 12.0 ELSE 0.0 END AS cf_passif
    FROM grille_temps
),
flux_actualises AS (
    -- CTE 3 : Flux nets de liquidité et valeurs actuelles (courbe plate y = 3.5%)
    SELECT
        annee, cf_tranche_a, cf_tranche_b,
        cf_tranche_a + cf_tranche_b AS cf_actif,
        cf_passif,
        (cf_tranche_a + cf_tranche_b) - cf_passif AS gap_liquidite,
        (cf_tranche_a + cf_tranche_b) / POWER(1.035, annee) AS va_actif,
        cf_passif / POWER(1.035, annee) AS va_passif
    FROM flux_tranches
),
metriques_alm AS (
    -- CTE 4 : Agrégats ALM globaux par fenêtrage (PV Actif/Passif, Durations Macaulay, Gap cumulé)
    SELECT
        annee, cf_tranche_a, cf_tranche_b, cf_actif, cf_passif, gap_liquidite,
        SUM(gap_liquidite) OVER (ORDER BY annee ASC) AS gap_liquidite_cumule,
        va_actif, va_passif,
        SUM(va_actif) OVER () AS va_totale_actif,
        SUM(va_passif) OVER () AS va_totale_passif,
        SUM(annee * va_actif) OVER () / SUM(va_actif) OVER () AS duration_mac_actif,
        SUM(annee * va_passif) OVER () / SUM(va_passif) OVER () AS duration_mac_passif
    FROM flux_actualises
)
SELECT
    annee,
    ROUND(cf_tranche_a, 2) AS cf_tranche_a_m,
    ROUND(cf_tranche_b, 2) AS cf_tranche_b_m,
    ROUND(cf_actif, 2) AS cf_actif_m,
    ROUND(cf_passif, 2) AS cf_passif_m,
    ROUND(gap_liquidite, 2) AS gap_liquidite_m,
    ROUND(gap_liquidite_cumule, 2) AS gap_cumule_m,
    ROUND(va_actif, 4) AS va_actif_m,
    ROUND(va_passif, 4) AS va_passif_m,
    ROUND(va_totale_actif, 2) AS pv_actif_tot_m,
    ROUND(va_totale_passif, 2) AS pv_passif_tot_m,
    ROUND(duration_mac_actif, 3) AS dur_mac_actif,
    ROUND(duration_mac_passif, 3) AS dur_mac_passif,
    ROUND(duration_mac_actif - duration_mac_passif, 3) AS gap_duration_ans,
    ROUND(100.0 * va_totale_actif / va_totale_passif, 2) AS ratio_couverture_pct
FROM metriques_alm
ORDER BY annee ASC;`,
      datasets: [],
      hints: [
        "Déclarez WITH RECURSIVE grille_temps AS (SELECT 1 AS annee UNION ALL SELECT annee + 1 FROM grille_temps WHERE annee < 10) puis chaînez simplement les CTEs suivantes sans répéter le mot-clé RECURSIVE.",
        "Dans flux_tranches, les coupons annuels valent 50.0 * 0.032 (Tranche A, T=5) et 50.0 * 0.045 (Tranche B, T=10), et le nominal +50.0 s'ajoute uniquement à l'année de maturité.",
        "Dans metriques_alm, conservez va_actif et va_passif non arrondis pour calculer SUM(annee * va_actif) OVER () / SUM(va_actif) OVER (), puis arrondissez gap_duration_ans à 3 décimales dans le SELECT final.",
      ],
      guide: {
        theoryToPracticeLink:
          "La CTE récursive \`grille_temps\` génère l'axe temporel $t = 1 \\dots 10$; \`flux_tranches\` modélise $\\text{CF}_{A,t}$, $\\text{CF}_{B,t}$ et $\\text{CF}_{L,t}$; \`flux_actualises\` calcule $G_t$ et $\\text{PV}_t^{X} = \\text{CF}_t^X / 1.035^t$; enfin \`metriques_alm\` évalue $G_t^{\\text{cum}}$, $\\text{PV}^X$, $D_{\\text{Mac}}^X$ et $R_{\\text{couv}}$ par fonctions de fenêtre.",
        stepByStepPlan: [
          "Initialiser `WITH RECURSIVE grille_temps` de `1` à `10` (`WHERE annee < 10`).",
          "Calculer dans `flux_tranches` les cash-flows des deux obligations bullet (`50M` à `3.2%` sur 5 ans, `50M` à `4.5%` sur 10 ans) et du passif (`12M` de l'année 1 à 8).",
          "Calculer dans `flux_actualises` `cf_actif`, `gap_liquidite`, `va_actif` et `va_passif` via `POWER(1.035, annee)`.",
          "Calculer dans `metriques_alm` le gap cumulé (`SUM(...) OVER (ORDER BY annee ASC)`) ainsi que les valeurs actuelles totales et durations de Macaulay (`SUM(...) OVER ()`).",
          "Projeter les $15$ colonnes arrondies avec exactitude et trier par `annee ASC`.",
        ],
        concepts: [
          {
            symbol: "WITH RECURSIVE grille_temps AS (...)",
            kind: "Syntaxe",
            roleInExercise:
              "Génère dynamiquement les $10$ pas de temps annuels en pur SQL sans recourir à une table physique.",
          },
          {
            symbol: "cf_tranche_a / cf_tranche_b",
            kind: "Variable",
            roleInExercise:
              "Flux obligataires *bullet* versant uniquement le coupon avant maturité puis coupon + remboursement du nominal ($50\\text{ M}$) à l'échéance ($T=5$ ou $T=10$).",
          },
          {
            symbol: "POWER(1.035, annee)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Calcule le facteur de capitalisation $(1 + y)^t$ pour actualiser les flux à $y = 3.5\\%$.",
          },
          {
            symbol: "SUM(gap_liquidite) OVER (ORDER BY annee ASC)",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Flux cumulé de trésorerie $G_t^{\\text{cum}}$ révélant un besoin de trésorerie maximal de $-32.60\\text{ M EUR}$ en année $4$.",
          },
          {
            symbol: "SUM(annee * va_actif) OVER () / SUM(va_actif) OVER ()",
            kind: "Fonction / Méthode",
            roleInExercise:
              "Formule exacte de la Duration de Macaulay de l'actif ($6.607\\text{ ans}$) pondérée par la valeur actuelle de chaque échéance.",
          },
          {
            symbol: "gap_duration_ans",
            kind: "Variable",
            roleInExercise:
              "Écart $D_{\\text{Mac}}^{\\text{actif}} - D_{\\text{Mac}}^{\\text{passif}} = +2.288\\text{ ans}$ mesurant l'exposition asymétrique à une hausse des taux.",
          },
          {
            symbol: "ratio_couverture_pct",
            kind: "Variable",
            roleInExercise:
              "Ratio économique $\\text{PV}^{\\text{actif}} / \\text{PV}^{\\text{passif}} = 125.45\\%$ mesurant la solvabilité du canton ALM au taux de $3.5\\%$.",
          },
        ],
        guidedCode: `-- Simulateur Récursif d'Échéancier Obligataire Multi-Tranches & Couverture ALM Actif-Passif
WITH RECURSIVE grille_temps AS (
    SELECT 1 AS annee
    ___ ___
    SELECT annee + 1
    FROM grille_temps
    WHERE annee < ___
),
flux_tranches AS (
    SELECT
        annee,
        CASE WHEN annee < 5 THEN 50.0 * 0.032 WHEN annee = 5 THEN 50.0 * 0.032 + 50.0 ELSE 0.0 END AS cf_tranche_a,
        CASE WHEN annee < 10 THEN 50.0 * 0.045 WHEN annee = 10 THEN 50.0 * 0.045 + 50.0 ELSE 0.0 END AS cf_tranche_b,
        CASE WHEN annee <= 8 THEN 12.0 ELSE 0.0 END AS cf_passif
    FROM grille_temps
),
flux_actualises AS (
    SELECT
        annee, cf_tranche_a, cf_tranche_b,
        cf_tranche_a + cf_tranche_b AS cf_actif,
        cf_passif,
        (cf_tranche_a + cf_tranche_b) - cf_passif AS gap_liquidite,
        (cf_tranche_a + cf_tranche_b) / POWER(___, annee) AS va_actif,
        cf_passif / POWER(___, annee) AS va_passif
    FROM flux_tranches
),
metriques_alm AS (
    SELECT
        annee, cf_tranche_a, cf_tranche_b, cf_actif, cf_passif, gap_liquidite,
        SUM(gap_liquidite) OVER (ORDER BY annee ASC) AS gap_liquidite_cumule,
        va_actif, va_passif,
        SUM(va_actif) OVER () AS va_totale_actif,
        SUM(va_passif) OVER () AS va_totale_passif,
        SUM(annee * va_actif) OVER () / SUM(va_actif) OVER () AS duration_mac_actif,
        SUM(annee * va_passif) OVER () / SUM(va_passif) OVER () AS duration_mac_passif
    FROM flux_actualises
)
SELECT
    annee,
    ROUND(cf_tranche_a, 2) AS cf_tranche_a_m,
    ROUND(cf_tranche_b, 2) AS cf_tranche_b_m,
    ROUND(cf_actif, 2) AS cf_actif_m,
    ROUND(cf_passif, 2) AS cf_passif_m,
    ROUND(gap_liquidite, 2) AS gap_liquidite_m,
    ROUND(gap_liquidite_cumule, 2) AS gap_cumule_m,
    ROUND(va_actif, 4) AS va_actif_m,
    ROUND(va_passif, 4) AS va_passif_m,
    ROUND(va_totale_actif, 2) AS pv_actif_tot_m,
    ROUND(va_totale_passif, 2) AS pv_passif_tot_m,
    ROUND(duration_mac_actif, 3) AS dur_mac_actif,
    ROUND(duration_mac_passif, 3) AS dur_mac_passif,
    ROUND(duration_mac_actif - duration_mac_passif, 3) AS gap_duration_ans,
    ROUND(100.0 * va_totale_actif / va_totale_passif, 2) AS ratio_couverture_pct
FROM metriques_alm
ORDER BY annee ASC;`,
      },
    },
  ],
};
