'use client';

import React, { useId, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from './button';
import { FormField } from './form-field';
import { Popover } from './popover';
import {
  addMonths,
  buildMonthGrid,
  compareIsoDate,
  firstWeekdayForLocale,
  formatIsoDateLabel,
  isIsoDateInRange,
  monthTitle,
  spanDays,
  startOfMonth,
  weekdayLabels,
  type IsoDate,
} from './date-calendar';

export type DateRangeValue = {
  start: IsoDate | null;
  end: IsoDate | null;
};

export interface DatePickerProps {
  mode?: 'single' | 'range';
  value?: IsoDate | null;
  rangeValue?: DateRangeValue;
  onChange?: (value: IsoDate | null) => void;
  onRangeChange?: (value: DateRangeValue) => void;
  locale?: string;
  minDate?: IsoDate;
  maxDate?: IsoDate;
  maxSpanDays?: number;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  firstWeekday?: number;
  className?: string;
}

const sizeClass = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
} as const;

function todayIso(): IsoDate {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'single',
  value = null,
  rangeValue,
  onChange,
  onRangeChange,
  locale = 'en-GB',
  minDate,
  maxDate,
  maxSpanDays,
  label,
  hint,
  error,
  placeholder,
  disabled = false,
  size = 'md',
  firstWeekday,
  className,
}) => {
  const triggerId = useId();
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState<IsoDate | null>(null);
  const resolvedFirst = firstWeekday ?? firstWeekdayForLocale(locale);
  const range = rangeValue ?? { start: null, end: null };
  const selected = mode === 'range' ? range.start ?? range.end : value;
  const viewSeed = selected ?? todayIso();
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(viewSeed) ?? viewSeed);

  const cells = useMemo(
    () => buildMonthGrid(viewMonth, resolvedFirst),
    [viewMonth, resolvedFirst],
  );
  const labels = useMemo(
    () => weekdayLabels(locale, resolvedFirst),
    [locale, resolvedFirst],
  );

  const display = useMemo(() => {
    if (mode === 'range') {
      if (range.start && range.end) {
        return `${formatIsoDateLabel(range.start, locale)} – ${formatIsoDateLabel(range.end, locale)}`;
      }
      if (range.start) return formatIsoDateLabel(range.start, locale);
      return placeholder ?? 'Select dates';
    }
    if (value) return formatIsoDateLabel(value, locale);
    return placeholder ?? 'Select date';
  }, [mode, range.start, range.end, value, locale, placeholder]);

  function isDisabledDay(iso: IsoDate): boolean {
    if (!isIsoDateInRange(iso, minDate, maxDate)) return true;
    if (mode === 'range' && draftStart && maxSpanDays != null) {
      const span = spanDays(draftStart, iso);
      if (span == null) return true;
      return Math.abs(span) > maxSpanDays;
    }
    return false;
  }

  function selectDay(iso: IsoDate) {
    if (isDisabledDay(iso)) return;
    if (mode === 'single') {
      onChange?.(iso);
      setOpen(false);
      return;
    }
    if (!draftStart) {
      setDraftStart(iso);
      onRangeChange?.({ start: iso, end: null });
      return;
    }
    const start = compareIsoDate(draftStart, iso) <= 0 ? draftStart : iso;
    const end = compareIsoDate(draftStart, iso) <= 0 ? iso : draftStart;
    onRangeChange?.({ start, end });
    setDraftStart(null);
    setOpen(false);
  }

  function inSelectedRange(iso: IsoDate): boolean {
    const start = mode === 'range' ? draftStart ?? range.start : value;
    const end = mode === 'range' ? range.end : value;
    if (mode === 'single') return iso === value;
    if (start && end) return isIsoDateInRange(iso, start, end);
    return iso === start;
  }

  const trigger = (
    <button
      id={triggerId}
      type="button"
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={clsx(
        'w-full rounded-pcampus-xl border font-pcampus-sans outline-none transition-all text-left',
        error ? 'border-pcampus-error' : 'border-pcampus-hairline-strong',
        disabled ? 'bg-pcampus-canvas-soft text-pcampus-muted opacity-50' : 'bg-pcampus-canvas text-pcampus-ink',
        'focus:outline-none focus:ring-2 focus:ring-pcampus-primary focus:border-transparent',
        sizeClass[size],
        className,
      )}
    >
      {display}
    </button>
  );

  const calendar = (
    <div className="flex flex-col gap-3 min-w-[17.5rem]">
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Previous month"
          onClick={() => {
            const next = addMonths(viewMonth, -1);
            if (next) setViewMonth(next);
          }}
        >
          ‹
        </Button>
        <p className="m-0 text-sm font-medium text-pcampus-ink">{monthTitle(viewMonth, locale)}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Next month"
          onClick={() => {
            const next = addMonths(viewMonth, 1);
            if (next) setViewMonth(next);
          }}
        >
          ›
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {labels.map((name) => (
          <span key={name} className="text-xs text-pcampus-muted py-1">
            {name}
          </span>
        ))}
        {cells.map((iso, index) => {
          if (!iso) {
            return <span key={`empty-${index}`} />;
          }
          const selectedDay = inSelectedRange(iso);
          const blocked = isDisabledDay(iso);
          return (
            <button
              key={iso}
              type="button"
              disabled={blocked}
              onClick={() => selectDay(iso)}
              className={clsx(
                'h-8 text-xs rounded-pcampus-xl border-none cursor-pointer font-pcampus-sans',
                selectedDay
                  ? 'bg-pcampus-primary text-pcampus-on-primary'
                  : 'bg-transparent text-pcampus-ink hover:bg-pcampus-canvas-soft',
                blocked && 'text-pcampus-muted opacity-40 cursor-not-allowed hover:bg-transparent',
              )}
            >
              {Number(iso.slice(8, 10))}
            </button>
          );
        })}
      </div>
    </div>
  );

  const field = (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (disabled) return;
        setOpen(next);
        if (!next) setDraftStart(null);
        if (next) {
          const seed = startOfMonth(selected ?? todayIso());
          if (seed) setViewMonth(seed);
        }
      }}
      trigger={trigger}
      content={calendar}
      placement="bottom"
    />
  );

  if (!label && !hint && !error) return field;

  return (
    <FormField label={label} hint={hint} error={error} htmlFor={triggerId}>
      {field}
    </FormField>
  );
};

DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps
  extends Omit<DatePickerProps, 'mode' | 'value' | 'onChange'> {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  ...props
}) => (
  <DatePicker
    {...props}
    mode="range"
    rangeValue={value}
    onRangeChange={onChange}
  />
);

DateRangePicker.displayName = 'DateRangePicker';
