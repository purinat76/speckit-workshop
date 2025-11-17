/**
 * Central application state and actions
 */

export class AppState {
  constructor(db) {
    this.db = db;
    this.groupingMode = 'day';
    this.selectedAlbumId = null;
    this.history = {
      undo: [],
      redo: [],
    };
    this.listeners = [];
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Called with new state when changes occur
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  notify() {
    this.listeners.forEach((listener) => listener(this));
  }

  /**
   * Get current state snapshot
   * @returns {Object}
   */
  getSnapshot() {
    return {
      groupingMode: this.groupingMode,
      selectedAlbumId: this.selectedAlbumId,
      canUndo: this.history.undo.length > 0,
      canRedo: this.history.redo.length > 0,
    };
  }

  /**
   * Set grouping mode
   * @param {string} mode - 'day' | 'month' | 'year'
   */
  setGroupingMode(mode) {
    this.groupingMode = mode;
    this.history.undo = [];
    this.history.redo = [];
    this.notify();
  }

  /**
   * Set selected album
   * @param {string|null} albumId
   */
  setSelectedAlbum(albumId) {
    this.selectedAlbumId = albumId;
    this.notify();
  }

  /**
   * Add action to history
   * @param {Object} action - { type, payload }
   */
  pushHistory(action) {
    this.history.undo.push(action);
    this.history.redo = [];
    this.notify();
  }

  /**
   * Undo last action
   * @param {Function} applyAction - Function to apply undo action
   */
  undo(applyAction) {
    if (this.history.undo.length === 0) return;

    const action = this.history.undo.pop();
    applyAction(action);
    this.history.redo.push(action);
    this.notify();
  }

  /**
   * Redo last undone action
   * @param {Function} applyAction - Function to apply redo action
   */
  redo(applyAction) {
    if (this.history.redo.length === 0) return;

    const action = this.history.redo.pop();
    applyAction(action);
    this.history.undo.push(action);
    this.notify();
  }

  /**
   * Clear all history
   */
  clearHistory() {
    this.history.undo = [];
    this.history.redo = [];
    this.notify();
  }
}
