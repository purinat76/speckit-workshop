/**
 * LocalStorage wrapper for persistent state
 */

const PREFIX = 'speckit_';

/**
 * Get value from localStorage
 * @param {string} key
 * @param {any} defaultValue
 * @returns {any}
 */
export function getStorageValue(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Set value in localStorage
 * @param {string} key
 * @param {any} value
 */
export function setStorageValue(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
}

/**
 * Remove value from localStorage
 * @param {string} key
 */
export function removeStorageValue(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.error(`Error removing from localStorage:`, error);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearStorage() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (error) {
    console.error(`Error clearing localStorage:`, error);
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const testKey = PREFIX + '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
