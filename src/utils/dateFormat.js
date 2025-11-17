/**
 * Date formatting utilities
 */

/**
 * Format date for display based on grouping mode
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} mode - 'day' | 'month' | 'year'
 * @returns {string} Formatted date
 */
export function formatDateLabel(dateStr, mode) {
  const date = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(date)) return dateStr;

  const opts = { timeZone: 'UTC' };
  if (mode === 'day') {
    const day = date.toLocaleDateString('en-US', { weekday: 'long', ...opts });
    const formatted = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      ...opts,
    });
    return `${day}, ${formatted}`;
  }
  if (mode === 'month') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', ...opts });
  }
  if (mode === 'year') {
    return date.toLocaleDateString('en-US', { year: 'numeric', ...opts });
  }
  return dateStr;
}

/**
 * Extract date part based on grouping mode
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} mode - 'day' | 'month' | 'year'
 * @returns {string}
 */
export function getDatePart(dateStr, mode) {
  if (mode === 'day') return dateStr;
  if (mode === 'month') return dateStr.slice(0, 7);
  if (mode === 'year') return dateStr.slice(0, 4);
  return dateStr;
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
export function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Parse YYYY-MM-DD string to Date object
 * @param {string} dateStr
 * @returns {Date}
 */
export function parseDate(dateStr) {
  return new Date(dateStr + 'T00:00:00Z');
}

/**
 * Compare two dates
 * @param {string} dateA - YYYY-MM-DD
 * @param {string} dateB - YYYY-MM-DD
 * @returns {number} -1 if A < B, 0 if equal, 1 if A > B
 */
export function compareDates(dateA, dateB) {
  const a = parseDate(dateA).getTime();
  const b = parseDate(dateB).getTime();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
