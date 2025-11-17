/**
 * Database schema and initialization
 */

export const SCHEMA = {
  albums: `
    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sort_order INTEGER DEFAULT 0
    )
  `,
  photos: `
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      album_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      size INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
    )
  `,
  settings: `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `,
  indexes: [
    'CREATE INDEX IF NOT EXISTS idx_albums_date ON albums(date DESC)',
    'CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album_id)',
  ],
};

/**
 * Initialize database with schema
 * @param {Database} db - sql.js database instance
 */
export function initializeSchema(db) {
  db.run(SCHEMA.albums);
  db.run(SCHEMA.photos);
  db.run(SCHEMA.settings);
  SCHEMA.indexes.forEach((idx) => db.run(idx));
}

/**
 * Sample data for demo/testing
 */
export const SAMPLE_DATA = {
  albums: [
    { id: 'a1', title: 'Morning walk', date: '2025-11-17', sort_order: 0 },
    { id: 'a2', title: 'Brunch', date: '2025-11-17', sort_order: 1 },
    { id: 'b1', title: 'Conference', date: '2025-11-16', sort_order: 0 },
    { id: 'c1', title: 'October trip', date: '2025-10-01', sort_order: 0 },
  ],
  photos: [
    { id: 'p1', album_id: 'a1', file_path: 'data:image/png;base64,iVBORw0KGgo=', size: 100 },
    { id: 'p2', album_id: 'a1', file_path: 'data:image/png;base64,iVBORw0KGgo=', size: 100 },
    { id: 'p3', album_id: 'a2', file_path: 'data:image/png;base64,iVBORw0KGgo=', size: 100 },
    { id: 'p4', album_id: 'b1', file_path: 'data:image/png;base64,iVBORw0KGgo=', size: 100 },
  ],
  settings: [{ key: 'grouping_mode', value: 'day' }],
};

/**
 * Load sample data into database
 * @param {Database} db - sql.js database instance
 */
export function loadSampleData(db) {
  SAMPLE_DATA.albums.forEach((album) => {
    db.run(
      'INSERT INTO albums (id, title, date, sort_order) VALUES (?, ?, ?, ?)',
      [album.id, album.title, album.date, album.sort_order]
    );
  });

  SAMPLE_DATA.photos.forEach((photo) => {
    db.run(
      'INSERT INTO photos (id, album_id, file_path, size) VALUES (?, ?, ?, ?)',
      [photo.id, photo.album_id, photo.file_path, photo.size]
    );
  });

  SAMPLE_DATA.settings.forEach((setting) => {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [
      setting.key,
      setting.value,
    ]);
  });
}
