import React from 'react';
import { clsx } from 'clsx';
import { Card } from '../primitives/card';
import { ArrowDownRight, ArrowUpRight } from '../icons/curated';
import { Icon } from '../icons/icon';

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  /** Relative change, e.g. "+12%" or "-3.4%". */
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
  hint?: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  delta,
  deltaDirection = 'neutral',
  hint,
  className,
}) => {
  const deltaTone =
    deltaDirection === 'up'
      ? 'text-pcampus-success'
      : deltaDirection === 'down'
        ? 'text-pcampus-error'
        : 'text-pcampus-muted';

  return (
    <Card
      padding="md"
      className={clsx('flex flex-col gap-3 font-pcampus-sans', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-pcampus-muted">
          {label}
        </span>
        {icon && (
          <span className="text-pcampus-muted [&_svg]:text-current">{icon}</span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-3xl font-semibold leading-none text-pcampus-ink tabular-nums">
          {value}
        </span>
        {delta && (
          <span className={clsx('inline-flex items-center gap-0.5 text-xs font-medium', deltaTone)}>
            {deltaDirection === 'up' && <Icon icon={ArrowUpRight} size="xs" />}
            {deltaDirection === 'down' && <Icon icon={ArrowDownRight} size="xs" />}
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="m-0 text-xs text-pcampus-muted">{hint}</p>}
    </Card>
  );
};

KpiCard.displayName = 'KpiCard';
