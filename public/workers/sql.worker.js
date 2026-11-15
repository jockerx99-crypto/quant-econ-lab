/* eslint-disable no-restricted-globals */
// SQL.js (SQLite WASM) Web Worker for QuantEcon Lab
// Runs completely isolated from the UI main thread

let SQL = null;
let db = null;
let isReady = false;
let isInitializing = false;

// Seed realistic actuarial & econometric datasets
const SEED_SQL = `
-- Table des polices d'assurance (Portefeuille Auto / MRH)
CREATE TABLE IF NOT EXISTS assures (
    police_id INTEGER PRIMARY KEY,
    assure_id TEXT NOT NULL,
    age INTEGER NOT NULL,
    sexe TEXT NOT NULL,
    region TEXT NOT NULL,
    type_contrat TEXT NOT NULL,
    bonus_malus REAL NOT NULL,
    anciennete_permis INTEGER NOT NULL,
    type_vehicule TEXT NOT NULL,
    puissance_fiscale INTEGER NOT NULL,
    usage TEXT NOT NULL,
    prime_annuelle REAL NOT NULL,
    date_souscription DATE NOT NULL
);

-- Table des sinistres enregistrés
CREATE TABLE IF NOT EXISTS sinistres (
    sinistre_id INTEGER PRIMARY KEY,
    police_id INTEGER NOT NULL,
    date_survenance DATE NOT NULL,
    date_declaration DATE NOT NULL,
    nature_sinistre TEXT NOT NULL,
    cout_dommages_materiels REAL NOT NULL,
    cout_corporel REAL NOT NULL,
    cout_total REAL NOT NULL,
    responsabilite_pct REAL NOT NULL,
    statut_dossier TEXT NOT NULL,
    FOREIGN KEY(police_id) REFERENCES assures(police_id)
);

-- Table des séries macroéconomiques & financières (ALM)
CREATE TABLE IF NOT EXISTS macro_taux (
    periode TEXT PRIMARY KEY,
    euribor_3m REAL NOT NULL,
    oat_10y REAL NOT NULL,
    spread_credit_bbb REAL NOT NULL,
    inflation_hicp REAL NOT NULL,
    pib_croissance REAL NOT NULL,
    cac40_rendement REAL NOT NULL
);

-- Insertion du portefeuille d'assurés
INSERT INTO assures VALUES
(1001, 'CLI-8021', 28, 'M', 'IDF', 'Tous Risques', 0.90, 6, 'Citadine', 5, 'Trajet Travail', 850.50, '2021-03-15'),
(1002, 'CLI-4412', 45, 'F', 'Auvergne-Rhône-Alpes', 'Tiers Étendu', 0.50, 23, 'Berline', 7, 'Privé', 620.00, '2019-06-10'),
(1003, 'CLI-9923', 22, 'M', 'PACA', 'Tiers Simple', 1.05, 3, 'Citadine', 4, 'Trajet Travail', 1150.00, '2022-01-20'),
(1004, 'CLI-1289', 58, 'M', 'IDF', 'Tous Risques', 0.50, 38, 'SUV', 9, 'Tous Déplacements', 1340.20, '2018-11-05'),
(1005, 'CLI-7331', 34, 'F', 'Nouvelle-Aquitaine', 'Tous Risques', 0.72, 12, 'Berline', 6, 'Privé', 710.80, '2020-08-14'),
(1006, 'CLI-5541', 67, 'F', 'Bretagne', 'Tiers Étendu', 0.50, 47, 'Citadine', 4, 'Privé', 490.00, '2017-04-22'),
(1007, 'CLI-2349', 24, 'M', 'IDF', 'Tous Risques', 1.15, 4, 'Sportive', 11, 'Trajet Travail', 2100.00, '2022-05-18'),
(1008, 'CLI-6102', 41, 'M', 'Grand Est', 'Tous Risques', 0.60, 19, 'Monospace', 7, 'Tous Déplacements', 890.30, '2019-10-30'),
(1009, 'CLI-3891', 52, 'F', 'Occitanie', 'Tiers Étendu', 0.54, 30, 'Berline', 6, 'Privé', 645.00, '2018-02-12'),
(1010, 'CLI-9014', 31, 'M', 'Hauts-de-France', 'Tous Risques', 0.85, 9, 'Citadine', 5, 'Trajet Travail', 780.00, '2021-07-01'),
(1011, 'CLI-4720', 29, 'F', 'IDF', 'Tiers Simple', 0.95, 7, 'Citadine', 4, 'Trajet Travail', 920.00, '2021-12-05'),
(1012, 'CLI-8451', 63, 'M', 'Normandie', 'Tous Risques', 0.50, 42, 'Berline', 8, 'Privé', 810.00, '2016-09-19');

-- Insertion des sinistres
INSERT INTO sinistres VALUES
(501, 1001, '2021-08-14', '2021-08-16', 'Collision', 1450.00, 0.00, 1450.00, 100.0, 'Clos'),
(502, 1003, '2022-04-02', '2022-04-03', 'Bris de Glace', 420.00, 0.00, 420.00, 0.0, 'Clos'),
(503, 1003, '2022-11-19', '2022-11-20', 'Collision', 3800.00, 1200.00, 5000.00, 100.0, 'Clos'),
(504, 1004, '2020-01-15', '2020-01-16', 'Vol', 18500.00, 0.00, 18500.00, 0.0, 'Clos'),
(505, 1007, '2022-09-08', '2022-09-09', 'Collision', 7200.00, 4500.00, 11700.00, 80.0, 'En cours'),
(506, 1008, '2021-03-22', '2021-03-25', 'Incendie', 9400.00, 0.00, 9400.00, 0.0, 'Clos'),
(507, 1010, '2022-02-11', '2022-02-12', 'Bris de Glace', 380.00, 0.00, 380.00, 0.0, 'Clos'),
(508, 1011, '2022-06-30', '2022-07-02', 'Collision', 2100.00, 0.00, 2100.00, 50.0, 'Clos');

-- Insertion des séries macroéconomiques trimestrielles
INSERT INTO macro_taux VALUES
('2020-Q1', -0.42, -0.15, 1.25, 0.70, -5.4, -26.5),
('2020-Q2', -0.38, -0.08, 1.40, 0.30, -11.8, 12.3),
('2020-Q3', -0.48, -0.22, 1.10, 0.20, 18.2, -2.7),
('2020-Q4', -0.52, -0.34, 0.95, -0.30, -1.4, 15.6),
('2021-Q1', -0.54, -0.12, 0.88, 1.30, 0.5, 9.3),
('2021-Q2', -0.54, 0.14, 0.82, 1.90, 1.2, 7.2),
('2021-Q3', -0.55, 0.02, 0.85, 3.40, 3.3, 0.4),
('2021-Q4', -0.57, 0.20, 0.90, 5.00, 0.6, 9.7),
('2022-Q1', -0.50, 0.89, 1.15, 7.40, -0.1, -8.7),
('2022-Q2', -0.18, 1.92, 1.60, 8.60, 0.5, -9.5),
('2022-Q3', 0.95, 2.71, 1.95, 9.90, 0.3, -2.5),
('2022-Q4', 2.06, 3.12, 1.80, 9.20, 0.1, 12.2),
('2023-Q1', 2.85, 2.95, 1.70, 6.90, 0.2, 13.1),
('2023-Q2', 3.40, 3.15, 1.62, 5.50, 0.6, 1.1),
('2023-Q3', 3.85, 3.40, 1.55, 4.30, -0.1, -4.8),
('2023-Q4', 3.92, 3.10, 1.48, 2.90, 0.1, 5.7);

-- Table des cours d'actions et indices (CAC40, Énergie, Finance, Luxe, ETF World)
CREATE TABLE IF NOT EXISTS marche_actions (
    id INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    ticker TEXT NOT NULL,
    nom_societe TEXT NOT NULL,
    secteur TEXT NOT NULL,
    prix_ouverture REAL NOT NULL,
    prix_haut REAL NOT NULL,
    prix_bas REAL NOT NULL,
    prix_cloture REAL NOT NULL,
    volume INTEGER NOT NULL,
    rendement_journalier REAL NOT NULL
);

INSERT INTO marche_actions VALUES
(1, "2024-01-02", "TTE", "TotalEnergies", "Énergie", 61.20, 62.10, 60.90, 61.80, 2500000, 0.0098),
(2, "2024-01-03", "TTE", "TotalEnergies", "Énergie", 61.80, 62.50, 61.50, 62.40, 2100000, 0.0097),
(3, "2024-01-04", "TTE", "TotalEnergies", "Énergie", 62.40, 62.80, 61.70, 62.00, 1900000, -0.0064),
(4, "2024-01-05", "TTE", "TotalEnergies", "Énergie", 62.00, 63.10, 61.90, 63.00, 2800000, 0.0161),
(5, "2024-01-08", "TTE", "TotalEnergies", "Énergie", 63.00, 63.50, 62.30, 62.60, 2200000, -0.0063),
(6, "2024-01-02", "BNP", "BNP Paribas", "Finance", 62.50, 63.20, 62.00, 62.80, 3100000, 0.0048),
(7, "2024-01-03", "BNP", "BNP Paribas", "Finance", 62.80, 63.00, 61.90, 62.10, 2900000, -0.0111),
(8, "2024-01-04", "BNP", "BNP Paribas", "Finance", 62.10, 62.90, 61.80, 62.70, 2700000, 0.0097),
(9, "2024-01-05", "BNP", "BNP Paribas", "Finance", 62.70, 63.80, 62.50, 63.50, 3400000, 0.0128),
(10, "2024-01-08", "BNP", "BNP Paribas", "Finance", 63.50, 64.10, 63.00, 63.20, 2800000, -0.0047),
(11, "2024-01-02", "MC", "LVMH", "Luxe", 730.0, 742.0, 728.0, 738.0, 450000, 0.0110),
(12, "2024-01-03", "MC", "LVMH", "Luxe", 738.0, 745.0, 732.0, 735.0, 410000, -0.0041),
(13, "2024-01-04", "MC", "LVMH", "Luxe", 735.0, 748.0, 734.0, 744.0, 480000, 0.0122),
(14, "2024-01-05", "MC", "LVMH", "Luxe", 744.0, 755.0, 740.0, 752.0, 520000, 0.0108),
(15, "2024-01-08", "MC", "LVMH", "Luxe", 752.0, 758.0, 746.0, 748.0, 390000, -0.0053),
(16, "2024-01-02", "AI", "Air Liquide", "Industrie", 175.0, 177.5, 174.2, 176.8, 620000, 0.0103),
(17, "2024-01-03", "AI", "Air Liquide", "Industrie", 176.8, 178.0, 175.5, 177.2, 580000, 0.0023),
(18, "2024-01-04", "AI", "Air Liquide", "Industrie", 177.2, 178.5, 176.0, 176.5, 540000, -0.0040),
(19, "2024-01-05", "AI", "Air Liquide", "Industrie", 176.5, 179.2, 176.2, 178.9, 690000, 0.0136),
(20, "2024-01-08", "AI", "Air Liquide", "Industrie", 178.9, 180.1, 178.2, 179.5, 490000, 0.0034),
(21, "2024-01-02", "CW8", "Amundi MSCI World", "ETF", 445.0, 448.2, 444.0, 447.5, 150000, 0.0056),
(22, "2024-01-03", "CW8", "Amundi MSCI World", "ETF", 447.5, 449.0, 446.0, 448.1, 130000, 0.0013),
(23, "2024-01-04", "CW8", "Amundi MSCI World", "ETF", 448.1, 451.0, 447.8, 450.4, 170000, 0.0051),
(24, "2024-01-05", "CW8", "Amundi MSCI World", "ETF", 450.4, 453.5, 449.5, 452.8, 190000, 0.0053),
(25, "2024-01-08", "CW8", "Amundi MSCI World", "ETF", 452.8, 454.0, 451.2, 453.2, 120000, 0.0009);

-- Table des caractéristiques des actifs de portefeuille (Markowitz / CAPM)
CREATE TABLE IF NOT EXISTS portefeuilles_actifs (
    ticker TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    secteur TEXT NOT NULL,
    classe_actif TEXT NOT NULL,
    rendement_espere REAL NOT NULL,
    volatilite REAL NOT NULL,
    beta_marche REAL NOT NULL,
    score_esg INTEGER NOT NULL,
    ratio_sharpe REAL NOT NULL
);

INSERT INTO portefeuilles_actifs VALUES
("TTE", "TotalEnergies SE", "Énergie", "Action", 0.085, 0.22, 0.95, 78, 0.25),
("BNP", "BNP Paribas SA", "Finance", "Action", 0.092, 0.26, 1.25, 74, 0.24),
("MC", "LVMH Moët Hennessy", "Luxe", "Action", 0.115, 0.21, 1.05, 86, 0.40),
("AI", "Air Liquide SA", "Industrie", "Action", 0.078, 0.16, 0.75, 92, 0.30),
("CW8", "Amundi MSCI World ETF", "Diversifié", "ETF", 0.082, 0.15, 1.00, 80, 0.35);

-- Table de la matrice de corrélation pairwise
CREATE TABLE IF NOT EXISTS matrice_correlations (
    actif_a TEXT NOT NULL,
    actif_b TEXT NOT NULL,
    correlation REAL NOT NULL,
    PRIMARY KEY(actif_a, actif_b)
);

INSERT INTO matrice_correlations VALUES
("TTE", "TTE", 1.00), ("TTE", "BNP", 0.45), ("TTE", "MC", 0.28), ("TTE", "AI", 0.32), ("TTE", "CW8", 0.55),
("BNP", "TTE", 0.45), ("BNP", "BNP", 1.00), ("BNP", "MC", 0.40), ("BNP", "AI", 0.35), ("BNP", "CW8", 0.62),
("MC", "TTE", 0.28), ("MC", "BNP", 0.40), ("MC", "MC", 1.00), ("MC", "AI", 0.52), ("MC", "CW8", 0.70),
("AI", "TTE", 0.32), ("AI", "BNP", 0.35), ("AI", "MC", 0.52), ("AI", "AI", 1.00), ("AI", "CW8", 0.65),
("CW8", "TTE", 0.55), ("CW8", "BNP", 0.62), ("CW8", "MC", 0.70), ("CW8", "AI", 0.65), ("CW8", "CW8", 1.00);

-- Table de la courbe des taux d'intérêt souverains OAT (Analyse Spectrale & PCA)
CREATE TABLE IF NOT EXISTS courbe_taux_oat (
    date DATE PRIMARY KEY,
    taux_1y REAL NOT NULL,
    taux_2y REAL NOT NULL,
    taux_5y REAL NOT NULL,
    taux_10y REAL NOT NULL,
    taux_20y REAL NOT NULL,
    taux_30y REAL NOT NULL
);

INSERT INTO courbe_taux_oat VALUES
("2023-01-31", 2.65, 2.70, 2.68, 2.78, 3.02, 3.05),
("2023-02-28", 3.12, 3.20, 3.05, 3.10, 3.28, 3.25),
("2023-03-31", 3.25, 3.15, 2.85, 2.88, 3.10, 3.12),
("2023-04-30", 3.40, 3.25, 2.90, 2.92, 3.15, 3.18),
("2023-05-31", 3.55, 3.32, 2.92, 2.94, 3.12, 3.15),
("2023-06-30", 3.75, 3.50, 3.05, 3.08, 3.25, 3.28),
("2023-07-31", 3.85, 3.58, 3.10, 3.15, 3.32, 3.35),
("2023-08-31", 3.88, 3.52, 3.08, 3.12, 3.30, 3.32),
("2023-09-30", 3.95, 3.65, 3.28, 3.42, 3.65, 3.68),
("2023-10-31", 3.90, 3.55, 3.20, 3.38, 3.62, 3.64),
("2023-11-30", 3.70, 3.22, 2.82, 3.02, 3.28, 3.30),
("2023-12-31", 3.45, 2.85, 2.50, 2.55, 2.85, 2.88);

`;


function registerCustomFunctions(database) {
  if (!database) return;
  database.create_function("LN", (x) => (x > 0 ? Math.log(x) : 0));
  database.create_function("LOG", (x) => (x > 0 ? Math.log(x) : 0));
  database.create_function("EXP", (x) => Math.exp(x));
  database.create_function("POWER", (x, y) => Math.pow(x, y));
  database.create_function("POW", (x, y) => Math.pow(x, y));
  database.create_function("SQRT", (x) => (x >= 0 ? Math.sqrt(x) : 0));
}

async function initSqlWorker() {
  if (isReady || isInitializing) return;
  isInitializing = true;

  try {
    self.postMessage({ type: 'STATUS', status: 'loading_wasm', message: 'Chargement du moteur SQLite WASM (sql.js)...' });

    // Load sql-wasm.js from local public directory
    self.importScripts('/sqljs/sql-wasm.js');

    // @ts-ignore
    SQL = await self.initSqlJs({
      locateFile: file => `/sqljs/${file}`
    });

    db = new SQL.Database();
    registerCustomFunctions(db);
    db.run(SEED_SQL);

    isReady = true;
    isInitializing = false;
    self.postMessage({ type: 'READY' });
  } catch (err) {
    isInitializing = false;
    self.postMessage({ type: 'ERROR', error: err.message || String(err) });
  }
}

function runSqlQuery(id, query) {
  if (!isReady || !db) {
    self.postMessage({ id, type: 'ERROR', error: "La base de données SQL n'est pas initialisée." });
    return;
  }

  try {
    const startTime = performance.now();
    const results = db.exec(query);
    const executionTimeMs = (performance.now() - startTime).toFixed(2);

    // results is an array of { columns: string[], values: any[][] }
    const formattedTables = results.map(res => ({
      columns: res.columns,
      values: res.values,
      rowCount: res.values.length
    }));

    self.postMessage({
      id,
      type: 'RUN_RESULT',
      success: true,
      tables: formattedTables,
      executionTimeMs,
      error: null
    });
  } catch (err) {
    self.postMessage({
      id,
      type: 'RUN_RESULT',
      success: false,
      tables: [],
      error: err.message || String(err)
    });
  }
}

function validateSqlQuery(id, testConfig) {
  if (!isReady || !db) {
    self.postMessage({ id, type: 'VALIDATE_RESULT', passed: false, message: "Base SQL non prête." });
    return;
  }

  try {
    const { userQuery, validationQuery, checkFunction } = testConfig;
    
    // Execute user query
    const userResult = db.exec(userQuery);
    if (!userResult || userResult.length === 0) {
      self.postMessage({
        id,
        type: 'VALIDATE_RESULT',
        passed: false,
        message: "La requête n'a renvoyé aucun résultat."
      });
      return;
    }

    const firstTable = userResult[0];

    // If a validation query is provided to compare against
    if (validationQuery) {
      const expectedResult = db.exec(validationQuery);
      if (expectedResult && expectedResult.length > 0) {
        const expectedTable = expectedResult[0];
        
        // Compare row count
        if (firstTable.values.length !== expectedTable.values.length) {
          self.postMessage({
            id,
            type: 'VALIDATE_RESULT',
            passed: false,
            message: `Nombre de lignes différent : attendu ${expectedTable.values.length}, obtenu ${firstTable.values.length}.`
          });
          return;
        }

        // Compare values
        const userJSON = JSON.stringify(firstTable.values);
        const expectedJSON = JSON.stringify(expectedTable.values);
        if (userJSON !== expectedJSON) {
          self.postMessage({
            id,
            type: 'VALIDATE_RESULT',
            passed: false,
            message: "Les valeurs calculées ne correspondent pas exactement à la solution attendue."
          });
          return;
        }
      }
    }

    self.postMessage({
      id,
      type: 'VALIDATE_RESULT',
      passed: true,
      message: "Requête SQL validée avec succès !"
    });
  } catch (err) {
    self.postMessage({
      id,
      type: 'VALIDATE_RESULT',
      passed: false,
      message: `Erreur lors de la validation : ${err.message || String(err)}`
    });
  }
}

function exportTableToJson(id, tableName) {
  if (!isReady || !db) return;
  try {
    const res = db.exec(`SELECT * FROM ${tableName}`);
    if (res.length === 0) {
      self.postMessage({ id, type: 'EXPORT_RESULT', data: [] });
      return;
    }
    const cols = res[0].columns;
    const rows = res[0].values.map(val => {
      const row = {};
      cols.forEach((col, idx) => { row[col] = val[idx]; });
      return row;
    });
    self.postMessage({ id, type: 'EXPORT_RESULT', data: rows });
  } catch (err) {
    self.postMessage({ id, type: 'EXPORT_RESULT', error: err.message });
  }
}

function resetDatabase(id) {
  try {
    if (db) db.close();
    db = new SQL.Database();
    registerCustomFunctions(db);
    db.run(SEED_SQL);
    self.postMessage({ id, type: 'RESET_SUCCESS' });
  } catch (err) {
    self.postMessage({ id, type: 'ERROR', error: err.message });
  }
}

self.onmessage = async function(event) {
  const { action, id, query, testConfig, tableName } = event.data;

  switch (action) {
    case 'INIT':
      await initSqlWorker();
      break;
    case 'RUN':
      runSqlQuery(id, query);
      break;
    case 'VALIDATE':
      validateSqlQuery(id, testConfig);
      break;
    case 'EXPORT':
      exportTableToJson(id, tableName);
      break;
    case 'RESET':
      resetDatabase(id);
      break;
    default:
      console.warn('[SQL Worker] Unknown action:', action);
  }
};
