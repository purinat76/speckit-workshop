/**
 * Main app component - orchestrates all UI pieces
 */

import { createHeader, updateHeader } from './controls.js';
import { renderAlbumList, scrollToGroup } from './albumList.js';
import { createModal, openModal, closeModal } from './modal.js';
import * as dal from '../db/dal.js';
import { getStorageValue, setStorageValue } from '../utils/storage.js';

/**
 * Initialize and render the app
 * @param {AppState} appState
 * @param {Database} db
 */
export function renderApp(appState, db) {
  const root = document.getElementById('app');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  // Create main layout
  root.className = 'app-layout';
  root.innerHTML = `
    <header class="app-header"></header>
    <main class="app-main">
      <div class="album-list-container"></div>
    </main>
  `;

  const headerEl = root.querySelector('.app-header');
  const mainEl = root.querySelector('.album-list-container');

  // Create modal
  const modal = createModal();
  root.appendChild(modal);

  // Create header with controls
  const header = createHeader({
    onGroupingChange: () => {
      // Cycle through grouping modes
      const modes = ['day', 'month', 'year'];
      const currentIndex = modes.indexOf(appState.groupingMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      appState.setGroupingMode(modes[nextIndex]);
      setStorageValue('grouping_mode', modes[nextIndex]);
      rerender();
    },
    onUndo: () => {
      appState.undo();
      rerender();
    },
    onRedo: () => {
      appState.redo();
      rerender();
    },
    onReset: () => {
      if (confirm('Reset all changes? This will reload the original data.')) {
        db.exec('DELETE FROM albums; DELETE FROM photos;');
        dal.loadSampleData(db);
        appState.clearHistory();
        appState.setSelectedAlbum(null);
        localStorage.clear();
        location.reload();
      }
    },
  });
  headerEl.appendChild(header);

  // Create initial album list
  const rerender = () => {
    renderAlbumList(mainEl, db, appState, {
      onAlbumOpen: (album) => {
        appState.setSelectedAlbum(album);
        openModal(modal, album);
      },
      onDragDrop: () => {
        rerender();
      },
    });
    updateHeader(header, appState);
  };

  rerender();

  // Subscribe to state changes
  appState.subscribe(() => {
    rerender();
  });

  // Restore grouping mode from storage
  const savedMode = getStorageValue('grouping_mode');
  if (savedMode && ['day', 'month', 'year'].includes(savedMode)) {
    appState.setGroupingMode(savedMode);
    rerender();
  }
}

/**
 * Clean up app state
 */
export function destroyApp() {
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = '';
  }
}
