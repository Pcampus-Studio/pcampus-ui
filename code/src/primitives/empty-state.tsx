import React from 'react';
import { clsx } from 'clsx';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center gap-4 py-12 px-8 font-pcampus-sans',
        className
      )}
    >
      {icon && (
        <span className="text-5xl text-pcampus-muted leading-none">
          {icon}
        </span>
      )}
      <h3 className="m-0 text-lg font-semibold text-pcampus-ink">
        {title}
      </h3>
      {description && (
        <p className="m-0 text-base text-pcampus-body max-w-[400px]">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-pcampus-primary text-pcampus-on-primary border-none rounded-pcampus-md py-3 px-6 text-base font-medium cursor-pointer font-pcampus-sans hover:bg-pcampus-primary-hover transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
