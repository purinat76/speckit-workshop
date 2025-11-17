/**
 * Album list view - main UI renderer
 */

import * as dal from '../../db/dal.js';
import { createAlbumCard } from './albumCard.js';
import { createMoveAlbumAction, createReorderAlbumAction, applyAction } from '../../state/actions.js';
import { formatDateLabel } from '../../utils/dateFormat.js';

let draggedAlbumId = null;

/**
 * Render album list with groups
 * @param {HTMLElement} container
 * @param {Database} db
 * @param {AppState} appState
 * @param {Object} callbacks - Event callbacks
 */
export function renderAlbumList(
  container,
  db,
  appState,
  { onAlbumOpen, onDragDrop, onAlbumUpdate }
) {
  const groups = dal.getAlbumsGroupedByDate(db, appState.groupingMode);

  if (groups.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">No albums yet</div>
        <div class="empty-state-hint">Create your first album or import photos to get started</div>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  const groupsContainer = document.createElement('div');
  groupsContainer.className = 'groups-container';

  groups.forEach((group) => {
    const groupEl = document.createElement('section');
    groupEl.className = 'group';

    // Group header
    const header = document.createElement('div');
    header.className = 'group-header';

    const title = document.createElement('h2');
    title.className = 'group-title';
    title.textContent = formatDateLabel(group.date, appState.groupingMode);

    const count = document.createElement('span');
    count.className = 'group-count';
    count.textContent = `${group.albums.length} album${group.albums.length !== 1 ? 's' : ''}`;

    header.appendChild(title);
    header.appendChild(count);
    groupEl.appendChild(header);

    // Album list for this group
    const albumList = document.createElement('div');
    albumList.className = 'album-list';
    albumList.dataset.groupDate = group.date;

    // Drop handlers for group
    albumList.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      albumList.classList.add('drag-over');
    });

    albumList.addEventListener('dragleave', () => {
      albumList.classList.remove('drag-over');
    });

    albumList.addEventListener('drop', (ev) => {
      ev.preventDefault();
      albumList.classList.remove('drag-over');

      try {
        const data = JSON.parse(ev.dataTransfer.getData('application/json'));
        const { albumId } = data;

        if (albumId && albumId !== draggedAlbumId) {
          handleAlbumDropped(db, appState, albumId, group.date, null, onDragDrop);
        }
      } catch (err) {
        console.error('Drop error:', err);
      }

      draggedAlbumId = null;
    });

    // Render album cards
    group.albums.forEach((album, index) => {
      const card = createAlbumCard(album, {
        onOpen: onAlbumOpen,
        onDragStart: (id) => {
          draggedAlbumId = id;
        },
        onDragEnd: () => {
          albumList.classList.remove('drag-over');
          draggedAlbumId = null;
        },
      });

      // Drop handlers for card (insert before)
      card.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        if (draggedAlbumId !== album.id) {
          card.classList.add('drag-target');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-target');
      });

      card.addEventListener('drop', (ev) => {
        ev.preventDefault();
        card.classList.remove('drag-target');

        try {
          const data = JSON.parse(ev.dataTransfer.getData('application/json'));
          const { albumId } = data;

          if (albumId && albumId !== draggedAlbumId) {
            handleAlbumDropped(db, appState, albumId, group.date, album.id, onDragDrop);
          }
        } catch (err) {
          console.error('Drop error:', err);
        }

        draggedAlbumId = null;
      });

      albumList.appendChild(card);
    });

    groupEl.appendChild(albumList);
    groupsContainer.appendChild(groupEl);
  });

  container.appendChild(groupsContainer);
}

/**
 * Handle album drop event
 * @param {Database} db
 * @param {AppState} appState
 * @param {string} albumId - Album being dragged
 * @param {string} toDate - Target group date
 * @param {string|null} beforeAlbumId - Target album (insert before) or null
 * @param {Function} callback
 */
function handleAlbumDropped(db, appState, albumId, toDate, beforeAlbumId, callback) {
  const album = dal.getAlbumById(db, albumId);
  if (!album) return;

  const fromDate = album.date;
  let fromOrder = album.sort_order;
  let toOrder = 0;

  if (beforeAlbumId) {
    // Inserting before another album - get its sort_order
    const beforeAlbum = dal.getAlbumById(db, beforeAlbumId);
    if (beforeAlbum) {
      toOrder = beforeAlbum.sort_order;
    }
  } else {
    // Appending to group - find max sort_order
    const albums = dal.getAllAlbums(db).filter((a) => a.date === toDate);
    toOrder = albums.length > 0 ? Math.max(...albums.map((a) => a.sort_order)) + 1 : 0;
  }

  if (fromDate === toDate && fromOrder === toOrder) {
    return; // No-op
  }

  // Create action for undo/redo
  let action;
  if (fromDate === toDate) {
    // Reorder within same group
    action = createReorderAlbumAction(albumId, fromDate, fromOrder, toOrder);
  } else {
    // Move to different group
    action = createMoveAlbumAction(albumId, fromDate, toDate, fromOrder, toOrder);
  }

  // Apply action
  applyAction(db, action, true);
  appState.pushHistory(action);

  if (callback) callback();
}

/**
 * Scroll to group by date
 * @param {HTMLElement} container
 * @param {string} date
 */
export function scrollToGroup(container, date) {
  const groupList = container.querySelector(`[data-group-date="${date}"]`);
  if (groupList) {
    groupList.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
