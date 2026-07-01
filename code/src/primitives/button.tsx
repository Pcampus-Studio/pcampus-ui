import React from 'react';
import { clsx } from 'clsx';
import { Spinner } from './spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClass = {
  primary:     'bg-pcampus-primary text-pcampus-on-primary hover:bg-pcampus-primary-hover disabled:opacity-60',
  secondary:   'border border-pcampus-hairline-strong bg-pcampus-canvas text-pcampus-ink hover:bg-pcampus-canvas-soft disabled:opacity-60',
  ghost:       'text-pcampus-body hover:bg-pcampus-canvas-soft disabled:opacity-60',
  destructive: 'bg-pcampus-error text-pcampus-on-primary hover:opacity-90 disabled:opacity-60',
} as const;

const sizeClass = {
  sm: 'h-8 px-4 text-sm gap-1',
  md: 'h-10 px-6 text-base gap-2',
  lg: 'h-12 px-7 text-lg gap-2',
} as const;

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
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center rounded-pcampus-md font-pcampus-sans font-medium',
          'cursor-pointer transition-all outline-none whitespace-nowrap',
          'focus-visible:ring-2 focus-visible:ring-pcampus-primary focus-visible:ring-offset-1',
          variantClass[variant],
          sizeClass[size],
          isDisabled && 'cursor-not-allowed',
          className
        )}
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
