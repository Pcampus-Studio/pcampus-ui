import React from 'react';
import { clsx } from 'clsx';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumb,
  className,
}) => (
  <header
    className={clsx(
      'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between font-pcampus-sans',
      className
    )}
  >
    <div className="flex flex-col gap-1 min-w-0">
      {breadcrumb && (
        <div className="text-xs text-pcampus-muted mb-1">{breadcrumb}</div>
      )}
      <h1 className="m-0 text-2xl font-semibold tracking-tight text-pcampus-ink">
        {title}
      </h1>
      {subtitle && (
        <p className="m-0 text-sm text-pcampus-muted max-w-2xl">{subtitle}</p>
      )}
    </div>
    {actions && (
      <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
    )}
  </header>
);

PageHeader.displayName = 'PageHeader';
