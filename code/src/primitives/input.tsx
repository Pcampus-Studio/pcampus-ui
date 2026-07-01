import React, { useId } from 'react';
import { clsx } from 'clsx';
import { FormField } from './form-field';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
} as const;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftElement,
      rightElement,
      size = 'md',
      id: idProp,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    const inputEl = (
      <div className="relative flex items-center w-full">
        {leftElement && (
          <span className="absolute left-3 inline-flex items-center justify-center text-pcampus-muted pointer-events-none">
            {leftElement}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={clsx(
            'w-full rounded-pcampus-md border font-pcampus-sans outline-none transition-all',
            hasError ? 'border-pcampus-error' : 'border-pcampus-hairline-strong',
            disabled ? 'bg-pcampus-canvas-soft text-pcampus-muted opacity-50' : 'bg-pcampus-canvas text-pcampus-ink',
            'focus:outline-none focus:ring-2 focus:ring-pcampus-primary focus:border-transparent',
            sizeClass[size],
            leftElement && 'pl-9',
            rightElement && 'pr-9',
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 inline-flex items-center justify-center text-pcampus-muted">
            {rightElement}
          </span>
        )}
      </div>
    );

    if (!label && !hint && !error) return inputEl;

    return (
      <FormField label={label} hint={hint} error={error} htmlFor={id}>
        {inputEl}
      </FormField>
    );
  }
);

Input.displayName = 'Input';
