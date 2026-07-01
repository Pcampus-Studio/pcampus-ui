import React from 'react';
import { clsx } from 'clsx';

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantClass = {
  primary:   'bg-pcampus-primary text-pcampus-on-primary hover:bg-pcampus-primary-hover',
  secondary: 'border border-pcampus-hairline-strong bg-pcampus-canvas text-pcampus-ink hover:bg-pcampus-canvas-soft',
  ghost:     'text-pcampus-body hover:bg-pcampus-canvas-soft',
} as const;

const sizeClass = {
  sm: 'h-8 px-4 text-sm gap-1',
  md: 'h-10 px-6 text-base gap-2',
  lg: 'h-12 px-7 text-lg gap-2',
} as const;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-pcampus-md font-pcampus-sans font-medium',
          'cursor-pointer transition-all outline-none whitespace-nowrap',
          'focus-visible:ring-2 focus-visible:ring-pcampus-primary focus-visible:ring-offset-1',
          variantClass[variant],
          sizeClass[size],
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
