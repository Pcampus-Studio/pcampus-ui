import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
  default: {
    background: 'var(--pcampus-color-surface-subtle)',
    color: 'var(--pcampus-color-text)',
    border: '1px solid var(--pcampus-color-border)',
  },
  primary: {
    background: 'var(--pcampus-color-primary-subtle)',
    color: 'var(--pcampus-color-primary)',
    border: '1px solid var(--pcampus-color-primary-border)',
  },
  success: {
    background: 'var(--pcampus-color-success-subtle)',
    color: 'var(--pcampus-color-success)',
    border: '1px solid var(--pcampus-color-success)',
  },
  warning: {
    background: 'var(--pcampus-color-accent-subtle)',
    color: 'var(--pcampus-color-accent)',
    border: '1px solid var(--pcampus-color-accent-light)',
  },
  error: {
    background: 'var(--pcampus-color-error-subtle)',
    color: 'var(--pcampus-color-error)',
    border: '1px solid var(--pcampus-color-error)',
  },
  neutral: {
    background: 'var(--pcampus-color-neutral-subtle)',
    color: 'var(--pcampus-color-text-secondary)',
    border: '1px solid var(--pcampus-color-neutral)',
  },
};

const dotColorMap: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'var(--pcampus-color-text)',
  primary: 'var(--pcampus-color-primary)',
  success: 'var(--pcampus-color-success)',
  warning: 'var(--pcampus-color-accent)',
  error: 'var(--pcampus-color-error)',
  neutral: 'var(--pcampus-color-neutral)',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
}) => {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--pcampus-space-1)',
    borderRadius: 'var(--pcampus-radius-full)',
    fontFamily: 'var(--pcampus-font-sans)',
    fontWeight: 500,
    fontSize: size === 'sm' ? 'var(--pcampus-text-2xs)' : 'var(--pcampus-text-xs)',
    padding: size === 'sm' ? '2px 6px' : '3px 8px',
    ...variantStyles[variant],
  };

  return (
    <span style={style}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 'var(--pcampus-radius-full)',
            background: dotColorMap[variant],
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
