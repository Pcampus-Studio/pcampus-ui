import React from 'react';
import { Spinner } from './spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: {
    fontSize: 'var(--pcampus-text-sm)',
    padding: '0 var(--pcampus-space-4)',
    height: '32px',
    gap: 'var(--pcampus-space-1)',
  },
  md: {
    fontSize: 'var(--pcampus-text-base)',
    padding: '0 var(--pcampus-space-6)',
    height: '40px',
    gap: 'var(--pcampus-space-2)',
  },
  lg: {
    fontSize: 'var(--pcampus-text-md)',
    padding: '0 var(--pcampus-space-7)',
    height: '48px',
    gap: 'var(--pcampus-space-2)',
  },
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: {
    background: 'var(--pcampus-color-primary)',
    color: 'var(--pcampus-color-text-inverse)',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--pcampus-color-primary)',
    border: '1px solid var(--pcampus-color-primary-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--pcampus-color-text-secondary)',
    border: 'none',
  },
  destructive: {
    background: 'var(--pcampus-color-error)',
    color: 'var(--pcampus-color-text-inverse)',
    border: 'none',
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--pcampus-radius-md)',
      fontFamily: 'var(--pcampus-font-sans)',
      fontWeight: 500,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.6 : 1,
      transition: `all var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
      outline: 'none',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={baseStyle}
        {...props}
      >
        {loading ? (
          <Spinner
            size="sm"
            color={variant === 'primary' || variant === 'destructive' ? 'white' : 'primary'}
          />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
