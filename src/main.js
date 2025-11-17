/**
 * Application initialization and main entry point
 */

import { initDatabase } from './db/sqlite.js';
import { initializeSchema, loadSampleData } from './db/schema.js';
import * as dal from './db/dal.js';
import { AppState } from './state/appState.js';
import { applyAction } from './state/actions.js';
import { getStorageValue, setStorageValue } from './utils/storage.js';
import { renderApp } from './ui/app.js';

/**
 * Initialize the application
 */
async function initApp() {
  try {
    // Initialize database
    const db = await initDatabase();
    initializeSchema(db);
    loadSampleData(db);

    // Initialize state
    const appState = new AppState(db);

    // Load persisted UI preferences
    const savedGrouping = getStorageValue('grouping_mode', 'day');
    appState.setGroupingMode(savedGrouping);

    // Setup auto-save of preferences
    appState.subscribe(() => {
      setStorageValue('grouping_mode', appState.groupingMode);
      // TODO: Also save database state periodically
    });

    // Render UI
    renderApp(appState, db);

    // Log app ready
    console.log('📸 Speckit Photo Organizer initialized');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.body.innerHTML = `<div style="color: red; padding: 20px;">
      Error initializing app: ${error.message}
    </div>`;
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
