/**
 * Data Access Layer (DAL) - All database queries go through here
 */

/**
 * Get all albums
 * @param {Database} db
 * @returns {Array} Album objects with photos count
 */
export function getAllAlbums(db) {
  const result = db.exec(`
    SELECT a.id, a.title, a.date, a.sort_order, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    GROUP BY a.id
    ORDER BY a.date DESC, a.sort_order ASC
  `);

  if (result.length === 0) return [];

  return result[0].values.map((row) => {
    const obj = {};
    result[0].columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Get album by ID with photos
 * @param {Database} db
 * @param {string} albumId
 * @returns {Object|null} Album object or null
 */
export function getAlbumById(db, albumId) {
  const result = db.exec(
    `
    SELECT a.id, a.title, a.date, a.sort_order
    FROM albums a
    WHERE a.id = ?
  `,
    [albumId]
  );

  if (result.length === 0 || result[0].values.length === 0) return null;

  const row = result[0].values[0];
  const album = {};
  result[0].columns.forEach((col, i) => {
    album[col] = row[i];
  });

  album.photos = getPhotosByAlbumId(db, albumId);
  return album;
}

/**
 * Get photos for an album
 * @param {Database} db
 * @param {string} albumId
 * @returns {Array} Photo objects
 */
export function getPhotosByAlbumId(db, albumId) {
  const result = db.exec(
    `
    SELECT id, album_id, file_path, size
    FROM photos
    WHERE album_id = ?
    ORDER BY rowid ASC
  `,
    [albumId]
  );

  if (result.length === 0) return [];

  return result[0].values.map((row) => {
    const obj = {};
    result[0].columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Create a new album
 * @param {Database} db
 * @param {string} id
 * @param {string} title
 * @param {string} date - YYYY-MM-DD
 * @param {number} sortOrder
 */
export function createAlbum(db, id, title, date, sortOrder = 0) {
  db.run(
    'INSERT INTO albums (id, title, date, sort_order) VALUES (?, ?, ?, ?)',
    [id, title, date, sortOrder]
  );
}

/**
 * Update album
 * @param {Database} db
 * @param {string} id
 * @param {Partial<Album>} updates
 */
export function updateAlbum(db, id, updates) {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  values.push(id);

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  db.run(`UPDATE albums SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
}

/**
 * Delete album (cascades to photos)
 * @param {Database} db
 * @param {string} albumId
 */
export function deleteAlbum(db, albumId) {
  db.run('DELETE FROM albums WHERE id = ?', [albumId]);
}

/**
 * Add photos to album
 * @param {Database} db
 * @param {string} albumId
 * @param {Array<{id, file_path, size}>} photos
 */
export function addPhotos(db, albumId, photos) {
  photos.forEach((photo) => {
    db.run(
      'INSERT INTO photos (id, album_id, file_path, size) VALUES (?, ?, ?, ?)',
      [photo.id, albumId, photo.file_path, photo.size]
    );
  });
}

/**
 * Delete photo
 * @param {Database} db
 * @param {string} photoId
 */
export function deletePhoto(db, photoId) {
  db.run('DELETE FROM photos WHERE id = ?', [photoId]);
}

/**
 * Get setting value
 * @param {Database} db
 * @param {string} key
 * @param {any} defaultValue
 * @returns {any}
 */
export function getSetting(db, key, defaultValue = null) {
  const result = db.exec('SELECT value FROM settings WHERE key = ?', [key]);

  if (result.length === 0 || result[0].values.length === 0) {
    return defaultValue;
  }

  try {
    return JSON.parse(result[0].values[0][0]);
  } catch {
    return result[0].values[0][0];
  }
}

/**
 * Set setting value
 * @param {Database} db
 * @param {string} key
 * @param {any} value
 */
export function setSetting(db, key, value) {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, stringValue]);
}

/**
 * Reorder album within its date group
 * @param {Database} db
 * @param {string} albumId
 * @param {number} newSortOrder
 */
export function reorderAlbum(db, albumId, newSortOrder) {
  updateAlbum(db, albumId, { sort_order: newSortOrder });
}

/**
 * Move album to different date and update sort order
 * @param {Database} db
 * @param {string} albumId
 * @param {string} newDate - YYYY-MM-DD
 * @param {number} newSortOrder
 */
export function moveAlbum(db, albumId, newDate, newSortOrder = 0) {
  updateAlbum(db, albumId, { date: newDate, sort_order: newSortOrder });
}

/**
 * Get albums grouped by date
 * @param {Database} db
 * @param {string} groupingMode - 'day' | 'month' | 'year'
 * @returns {Array<{date, albums}>} Groups with albums
 */
export function getAlbumsGroupedByDate(db, groupingMode = 'day') {
  const query = getGroupingQuery(groupingMode);
  const result = db.exec(query);

  if (result.length === 0) return [];

  const groups = {};
  result[0].values.forEach((row) => {
    const obj = {};
    result[0].columns.forEach((col, i) => {
      obj[col] = row[i];
    });

    if (!groups[obj.group_key]) {
      groups[obj.group_key] = { date: obj.group_key, albums: [] };
    }
    groups[obj.group_key].albums.push({
      id: obj.id,
      title: obj.title,
      date: obj.date,
      sort_order: obj.sort_order,
      photo_count: obj.photo_count,
    });
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Build grouping query based on mode
 * @param {string} mode - 'day' | 'month' | 'year'
 * @returns {string} SQL query
 */
function getGroupingQuery(mode) {
  let dateFormat;
  if (mode === 'day') {
    dateFormat = 'a.date';
  } else if (mode === 'month') {
    dateFormat = "substr(a.date, 1, 7)";
  } else if (mode === 'year') {
    dateFormat = "substr(a.date, 1, 4)";
  } else {
    dateFormat = 'a.date';
  }

  return `
    SELECT ${dateFormat} as group_key, a.id, a.title, a.date, a.sort_order, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    GROUP BY ${dateFormat}, a.id
    ORDER BY a.date DESC, a.sort_order ASC
  `;
}
