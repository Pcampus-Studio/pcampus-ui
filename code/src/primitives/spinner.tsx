import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'neutral';
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 14,
  md: 20,
  lg: 28,
};

const colorMap: Record<NonNullable<SpinnerProps['color']>, string> = {
  primary: 'var(--pcampus-color-primary)',
  white: 'var(--pcampus-color-text-inverse)',
  neutral: 'var(--pcampus-color-neutral)',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary' }) => {
  const px = sizeMap[size];
  const stroke = colorMap[color];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
      role="status"
      style={{
        animation: `pcampus-spin var(--pcampus-duration-base) var(--pcampus-ease-linear) infinite`,
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes pcampus-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="40 20"
      />
    </svg>
  );
};

Spinner.displayName = 'Spinner';
