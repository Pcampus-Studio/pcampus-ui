import React from 'react';
import { clsx } from 'clsx';
import { Input } from '../primitives/input';
import { Search } from '../icons/curated';
import { Icon } from '../icons/icon';

export interface FilterPill {
  id: string;
  label: string;
  active?: boolean;
  count?: number;
}

export interface FilterBarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterPill[];
  onFilterChange?: (id: string) => void;
  trailing?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  searchPlaceholder = 'Search…',
  onSearchChange,
  filters,
  onFilterChange,
  trailing,
  className,
}) => (
  <div
    className={clsx(
      'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-pcampus-sans',
      className
    )}
  >
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center min-w-0">
      {onSearchChange && (
        <div className="w-full sm:max-w-xs">
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            size="sm"
            leftElement={<Icon icon={Search} size="sm" className="text-pcampus-muted" />}
            aria-label={searchPlaceholder}
          />
        </div>
      )}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange?.(filter.id)}
              aria-pressed={filter.active}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-pcampus-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                filter.active
                  ? 'bg-[var(--pcampus-color-primary-subtle)] border-pcampus-primary text-pcampus-primary'
                  : 'bg-pcampus-canvas border-pcampus-hairline text-pcampus-body hover:bg-pcampus-canvas-soft'
              )}
            >
              {filter.label}
              {typeof filter.count === 'number' && (
                <span
                  className={clsx(
                    'tabular-nums',
                    filter.active ? 'text-pcampus-primary' : 'text-pcampus-muted'
                  )}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
    {trailing && (
      <div className="flex flex-wrap items-center gap-2 shrink-0">{trailing}</div>
    )}
  </div>
);

FilterBar.displayName = 'FilterBar';
