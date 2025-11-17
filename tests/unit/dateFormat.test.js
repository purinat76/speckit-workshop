/**
 * Tests for date formatting utilities
 */

import { describe, it, expect } from 'vitest';
import { formatDateLabel, getDatePart, getTodayDate } from '../../src/utils/dateFormat.js';

describe('dateFormat utilities', () => {
  it('should format date for day mode', () => {
    const label = formatDateLabel('2025-11-17', 'day');
    expect(label).toContain('November');
    expect(label).toContain('17');
    expect(label).toContain('2025');
  });

  it('should format date for month mode', () => {
    const label = formatDateLabel('2025-11-17', 'month');
    expect(label).toContain('November');
    expect(label).toContain('2025');
    expect(label).not.toContain('17');
  });

  it('should format date for year mode', () => {
    const label = formatDateLabel('2025-11-17', 'year');
    expect(label).toContain('2025');
  });

  it('should extract date part for day mode', () => {
    expect(getDatePart('2025-11-17', 'day')).toBe('2025-11-17');
  });

  it('should extract date part for month mode', () => {
    expect(getDatePart('2025-11-17', 'month')).toBe('2025-11');
  });

  it('should extract date part for year mode', () => {
    expect(getDatePart('2025-11-17', 'year')).toBe('2025');
  });

  it('should get today date in YYYY-MM-DD format', () => {
    const today = getTodayDate();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
