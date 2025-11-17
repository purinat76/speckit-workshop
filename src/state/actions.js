/**
 * Action creators for state updates
 */

import * as dal from '../db/dal.js';

/**
 * Action types
 */
export const ACTIONS = {
  MOVE_ALBUM: 'MOVE_ALBUM',
  REORDER_ALBUM: 'REORDER_ALBUM',
  RENAME_ALBUM: 'RENAME_ALBUM',
  DELETE_ALBUM: 'DELETE_ALBUM',
  CREATE_ALBUM: 'CREATE_ALBUM',
};

/**
 * Create move album action
 * @param {string} albumId
 * @param {string} fromDate
 * @param {string} toDate
 * @param {number} fromOrder
 * @param {number} toOrder
 */
export function createMoveAlbumAction(albumId, fromDate, toDate, fromOrder, toOrder) {
  return {
    type: ACTIONS.MOVE_ALBUM,
    payload: {
      albumId,
      fromDate,
      toDate,
      fromOrder,
      toOrder,
    },
  };
}

/**
 * Create reorder album action
 * @param {string} albumId
 * @param {string} date
 * @param {number} fromOrder
 * @param {number} toOrder
 */
export function createReorderAlbumAction(albumId, date, fromOrder, toOrder) {
  return {
    type: ACTIONS.REORDER_ALBUM,
    payload: {
      albumId,
      date,
      fromOrder,
      toOrder,
    },
  };
}

/**
 * Apply action to database (for undo/redo)
 * @param {Database} db
 * @param {Object} action
 * @param {boolean} isRedo - If true, apply forward; if false, apply reverse
 */
export function applyAction(db, action, isRedo = true) {
  const { type, payload } = action;

  if (type === ACTIONS.MOVE_ALBUM) {
    const { albumId, fromDate, toDate, fromOrder, toOrder } = payload;
    if (isRedo) {
      dal.moveAlbum(db, albumId, toDate, toOrder);
    } else {
      dal.moveAlbum(db, albumId, fromDate, fromOrder);
    }
  } else if (type === ACTIONS.REORDER_ALBUM) {
    const { albumId, fromOrder, toOrder } = payload;
    if (isRedo) {
      dal.reorderAlbum(db, albumId, toOrder);
    } else {
      dal.reorderAlbum(db, albumId, fromOrder);
    }
  }
}
