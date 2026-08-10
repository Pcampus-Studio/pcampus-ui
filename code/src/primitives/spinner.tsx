import React from 'react';
import { clsx } from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'neutral';
  className?: string;
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 14,
  md: 20,
  lg: 28,
};

const strokeClass = {
  primary: 'stroke-[var(--pcampus-color-primary)]',
  white: 'stroke-[var(--pcampus-color-text-inverse)]',
  neutral: 'stroke-[var(--pcampus-color-neutral)]',
} as const;

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary', className }) => {
  const px = sizeMap[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
      role="status"
      className={clsx('animate-pcampus-spin shrink-0', className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className={clsx('stroke-[2.5px] [stroke-linecap:round] [stroke-dasharray:40_20]', strokeClass[color])}
      />
    </svg>
  );
};

Spinner.displayName = 'Spinner';
