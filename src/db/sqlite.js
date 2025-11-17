/**
 * SQLite database wrapper using sql.js
 */

let sqlPromise;

/**
 * Load sql.js library
 * @returns {Promise<SqlJsStatic>}
 */
export async function loadSQL() {
  if (!sqlPromise) {
    sqlPromise = import('sql.js').then((SQL) => SQL.default());
  }
  return sqlPromise;
}

/**
 * Initialize database from file or create new
 * @param {Uint8Array|null} fileBuffer - Optional buffer from localStorage or file
 * @returns {Promise<Database>}
 */
export async function initDatabase(fileBuffer = null) {
  const SQL = await loadSQL();

  if (fileBuffer) {
    return new SQL.Database(fileBuffer);
  }

  return new SQL.Database();
}

/**
 * Export database to Uint8Array for storage
 * @param {Database} db
 * @returns {Uint8Array}
 */
export function exportDatabase(db) {
  return db.export();
}

/**
 * Export database to JSON for human-readable backup
 * @param {Database} db
 * @returns {Object} { tables: { tableName: [rows] } }
 */
export function databaseToJSON(db) {
  const tables = {};
  const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");

  while (stmt.step()) {
    const [tableName] = stmt.getAsObject();
    const rows = db.exec(`SELECT * FROM ${tableName}`);
    if (rows.length > 0) {
      tables[tableName] = rows[0].values.map((row) => {
        const obj = {};
        rows[0].columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      });
    }
  }
  stmt.free();

  return { tables };
}

/**
 * Import database from JSON
 * @param {Database} db
 * @param {Object} json - Object with { tables: { tableName: [rows] } }
 */
export function importDatabaseFromJSON(db, json) {
  if (!json.tables) return;

  Object.entries(json.tables).forEach(([tableName, rows]) => {
    rows.forEach((row) => {
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const placeholders = cols.map(() => '?').join(',');
      const sql = `INSERT INTO ${tableName} (${cols.join(',')}) VALUES (${placeholders})`;
      db.run(sql, vals);
    });
  });
}
