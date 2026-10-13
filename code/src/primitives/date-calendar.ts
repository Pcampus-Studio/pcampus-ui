const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export type IsoDate = string;

export type DateParts = { year: number; month: number; day: number };

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function parseIsoDate(value: string): DateParts | null {
  const m = ISO_RE.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function formatIsoDate(parts: DateParts): IsoDate {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function toUtcDate(parts: DateParts): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

export function compareIsoDate(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function isIsoDateInRange(
  date: string,
  start: string | null | undefined,
  end: string | null | undefined,
): boolean {
  if (start && compareIsoDate(date, start) < 0) return false;
  if (end && compareIsoDate(date, end) > 0) return false;
  return true;
}

export function addDays(iso: string, days: number): IsoDate | null {
  const parts = parseIsoDate(iso);
  if (!parts) return null;
  const next = toUtcDate(parts);
  next.setUTCDate(next.getUTCDate() + days);
  return formatIsoDate({
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  });
}

export function addMonths(iso: string, months: number): IsoDate | null {
  const parts = parseIsoDate(iso);
  if (!parts) return null;
  const next = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1));
  return formatIsoDate({
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: 1,
  });
}

export function startOfMonth(iso: string): IsoDate | null {
  const parts = parseIsoDate(iso);
  if (!parts) return null;
  return formatIsoDate({ year: parts.year, month: parts.month, day: 1 });
}

export function daysInMonth(iso: string): number {
  const parts = parseIsoDate(iso);
  if (!parts) return 0;
  return new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate();
}

/** 0 = Sunday … 6 = Saturday, matching `Date#getUTCDay`. */
export function isoWeekday(iso: string): number | null {
  const parts = parseIsoDate(iso);
  if (!parts) return null;
  return toUtcDate(parts).getUTCDay();
}

export function firstWeekdayForLocale(locale: string): number {
  try {
    const loc = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay: number };
    };
    const first = loc.weekInfo?.firstDay;
    if (typeof first === 'number') {
      return first === 7 ? 0 : first;
    }
  } catch {
    // Intl.Locale or weekInfo may be missing.
  }
  if (locale.toLowerCase().startsWith('en-us')) return 0;
  return 1;
}

export function weekdayLabels(locale: string, firstWeekday: number): string[] {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: 'UTC',
  });
  return Array.from({ length: 7 }, (_, i) => {
    const jsDay = (firstWeekday + i) % 7;
    const noon = new Date(Date.UTC(2026, 0, 4 + jsDay));
    return formatter.format(noon);
  });
}

export function formatIsoDateLabel(iso: string, locale: string): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    dateStyle: 'medium',
  }).format(toUtcDate(parts));
}

export function monthTitle(iso: string, locale: string): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(toUtcDate({ ...parts, day: 1 }));
}

export function spanDays(start: string, end: string): number | null {
  const a = parseIsoDate(start);
  const b = parseIsoDate(end);
  if (!a || !b) return null;
  const ms = toUtcDate(b).getTime() - toUtcDate(a).getTime();
  return Math.round(ms / 86400000);
}

export function buildMonthGrid(
  viewMonth: string,
  firstWeekday: number,
): Array<IsoDate | null> {
  const start = startOfMonth(viewMonth);
  if (!start) return [];
  const weekday = isoWeekday(start);
  if (weekday == null) return [];
  const leading = (weekday - firstWeekday + 7) % 7;
  const count = daysInMonth(start);
  const cells: Array<IsoDate | null> = [];
  for (let i = 0; i < leading; i += 1) cells.push(null);
  for (let day = 1; day <= count; day += 1) {
    const parts = parseIsoDate(start);
    if (!parts) break;
    cells.push(formatIsoDate({ ...parts, day }));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
