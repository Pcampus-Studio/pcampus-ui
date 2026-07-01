import React, { useId } from 'react';
import { clsx } from 'clsx';
import { FormField } from './form-field';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
} as const;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      placeholder,
      options,
      size = 'md',
      id: idProp,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const hasError = Boolean(error);

    const selectEl = (
      <div className="relative w-full">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={clsx(
            'w-full rounded-pcampus-md border font-pcampus-sans outline-none appearance-none pr-9 transition-all',
            hasError ? 'border-pcampus-error' : 'border-pcampus-hairline-strong',
            disabled ? 'bg-pcampus-canvas-soft text-pcampus-muted cursor-not-allowed opacity-50' : 'bg-pcampus-canvas text-pcampus-ink cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-pcampus-primary focus:border-transparent',
            sizeClass[size],
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pcampus-muted"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>
    );

    if (!label && !hint && !error) return selectEl;

    return (
      <FormField label={label} hint={hint} error={error} htmlFor={id}>
        {selectEl}
      </FormField>
    );
  }
);

Select.displayName = 'Select';
