import { describe, it, expect } from 'vitest';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  compareIsoDate,
  firstWeekdayForLocale,
  formatIsoDateLabel,
  isIsoDateInRange,
  parseIsoDate,
  spanDays,
  weekdayLabels,
} from '../src/primitives/date-calendar';

describe('date-calendar', () => {
  it('parses valid ISO dates and rejects invalid calendar days', () => {
    expect(parseIsoDate('2026-10-12')).toEqual({ year: 2026, month: 10, day: 12 });
    expect(parseIsoDate('2026-02-30')).toBeNull();
    expect(parseIsoDate('not-a-date')).toBeNull();
  });

  it('compares and ranges ISO dates without using the runtime timezone', () => {
    expect(compareIsoDate('2026-10-11', '2026-10-12')).toBe(-1);
    expect(isIsoDateInRange('2026-10-12', '2026-10-11', '2026-10-13')).toBe(true);
    expect(isIsoDateInRange('2026-10-10', '2026-10-11', '2026-10-13')).toBe(false);
    expect(spanDays('2026-10-01', '2026-10-08')).toBe(7);
  });

  it('adds days and months in UTC civil time', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addMonths('2026-10-15', 1)).toBe('2026-11-01');
  });

  it('builds a 7-column month grid starting Monday by default for en-GB', () => {
    expect(firstWeekdayForLocale('en-GB')).toBe(1);
    const grid = buildMonthGrid('2026-10-01', 1);
    expect(grid.length % 7).toBe(0);
    expect(grid.filter(Boolean).length).toBe(31);
    expect(grid[0]).toBeNull();
    expect(grid[3]).toBe('2026-10-01');
  });

  it('formats labels with Intl locale and UTC so the day does not shift', () => {
    expect(formatIsoDateLabel('2026-10-12', 'en-GB')).toMatch(/12 Oct 2026/);
    const days = weekdayLabels('en-GB', 1);
    expect(days).toHaveLength(7);
    expect(days[0].toLowerCase()).toContain('mon');
  });
});
