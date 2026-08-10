import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantClass = {
  default: 'bg-pcampus-canvas-soft text-pcampus-body',
  primary: 'bg-[var(--pcampus-color-primary-subtle)] text-pcampus-primary',
  success: 'bg-[var(--pcampus-color-success-subtle)] text-pcampus-success',
  warning: 'bg-[var(--pcampus-color-accent-subtle)] text-pcampus-warning',
  error: 'bg-[var(--pcampus-color-error-subtle)] text-pcampus-error',
  neutral: 'bg-[var(--pcampus-color-neutral-subtle)] text-pcampus-body',
} as const;

const dotColorClass = {
  default: 'bg-pcampus-ink',
  primary: 'bg-pcampus-primary',
  success: 'bg-pcampus-success',
  warning: 'bg-pcampus-warning',
  error: 'bg-pcampus-error',
  neutral: 'bg-[var(--pcampus-color-neutral)]',
} as const;

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-pcampus-full font-pcampus-sans font-medium',
        size === 'sm' ? 'text-[10px] py-[2px] px-[6px] gap-1' : 'text-[11px] py-[3px] px-[8px] gap-1',
        variantClass[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-pcampus-full shrink-0',
            dotColorClass[variant]
          )}
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
