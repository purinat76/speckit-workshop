/**
 * Header controls component
 */

/**
 * Create header with controls
 * @param {AppState} appState
 * @param {Function} onGroupingChange - Callback for grouping mode change
 * @param {Function} onUndo - Callback for undo
 * @param {Function} onRedo - Callback for redo
 * @param {Function} onReset - Callback for reset data
 * @returns {HTMLElement}
 */
export function createHeader(appState, { onGroupingChange, onUndo, onRedo, onReset }) {
  const header = document.createElement('header');
  header.className = 'app-header';

  const title = document.createElement('h1');
  title.className = 'app-title';
  title.textContent = '📸 Speckit Photo Organizer';

  const controls = document.createElement('div');
  controls.className = 'app-controls';

  // Grouping mode button
  const groupingBtn = document.createElement('button');
  groupingBtn.className = 'btn';
  groupingBtn.id = 'grouping-btn';
  groupingBtn.title = 'Cycle grouping mode (Day → Month → Year)';
  updateGroupingButton(groupingBtn, appState.groupingMode);

  groupingBtn.addEventListener('click', () => {
    const modes = ['day', 'month', 'year'];
    const idx = modes.indexOf(appState.groupingMode);
    const nextMode = modes[(idx + 1) % modes.length];
    if (onGroupingChange) onGroupingChange(nextMode);
  });

  // Undo button
  const undoBtn = document.createElement('button');
  undoBtn.className = 'btn';
  undoBtn.id = 'undo-btn';
  undoBtn.textContent = '↶ Undo';
  undoBtn.title = 'Undo last action (Ctrl+Z)';
  undoBtn.disabled = !appState.getSnapshot().canUndo;

  undoBtn.addEventListener('click', () => {
    if (onUndo) onUndo();
  });

  // Redo button
  const redoBtn = document.createElement('button');
  redoBtn.className = 'btn';
  redoBtn.id = 'redo-btn';
  redoBtn.textContent = '↷ Redo';
  redoBtn.title = 'Redo last action (Ctrl+Y)';
  redoBtn.disabled = !appState.getSnapshot().canRedo;

  redoBtn.addEventListener('click', () => {
    if (onRedo) onRedo();
  });

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn';
  resetBtn.id = 'reset-btn';
  resetBtn.textContent = '🔄 Reset';
  resetBtn.title = 'Reset sample data';

  resetBtn.addEventListener('click', () => {
    if (confirm('Reset to sample data? This cannot be undone.')) {
      if (onReset) onReset();
    }
  });

  controls.appendChild(groupingBtn);
  controls.appendChild(undoBtn);
  controls.appendChild(redoBtn);
  controls.appendChild(resetBtn);

  header.appendChild(title);
  header.appendChild(controls);

  // Store button references for updates
  header.updateButtons = {
    grouping: groupingBtn,
    undo: undoBtn,
    redo: redoBtn,
  };

  return header;
}

/**
 * Update header buttons based on state
 * @param {HTMLElement} header
 * @param {AppState} appState
 */
export function updateHeader(header, appState) {
  if (!header.updateButtons) return;

  const { grouping, undo, redo } = header.updateButtons;

  updateGroupingButton(grouping, appState.groupingMode);

  const snapshot = appState.getSnapshot();
  undo.disabled = !snapshot.canUndo;
  redo.disabled = !snapshot.canRedo;
}

/**
 * Update grouping button text
 * @param {HTMLElement} btn
 * @param {string} mode
 */
function updateGroupingButton(btn, mode) {
  const modeText = mode.charAt(0).toUpperCase() + mode.slice(1);
  btn.textContent = `📅 Group by: ${modeText}`;
}
