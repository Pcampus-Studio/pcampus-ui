import React, { useId } from 'react';
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

const sizeStyles: Record<NonNullable<SelectProps['size']>, React.CSSProperties> = {
  sm: { height: '32px', fontSize: 'var(--pcampus-text-sm)', padding: '0 var(--pcampus-space-4)' },
  md: { height: '40px', fontSize: 'var(--pcampus-text-base)', padding: '0 var(--pcampus-space-5)' },
  lg: { height: '48px', fontSize: 'var(--pcampus-text-md)', padding: '0 var(--pcampus-space-6)' },
};

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
      style,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const hasError = Boolean(error);

    const selectStyle: React.CSSProperties = {
      width: '100%',
      borderRadius: 'var(--pcampus-radius-md)',
      border: `1px solid ${hasError ? 'var(--pcampus-color-error)' : 'var(--pcampus-color-border-strong)'}`,
      background: disabled ? 'var(--pcampus-color-surface-subtle)' : 'var(--pcampus-color-surface)',
      color: disabled ? 'var(--pcampus-color-text-disabled)' : 'var(--pcampus-color-text)',
      fontFamily: 'var(--pcampus-font-sans)',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      appearance: 'none',
      paddingRight: 'var(--pcampus-space-9)',
      transition: `border-color var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
      ...sizeStyles[size],
      ...style,
    };

    const selectEl = (
      <div style={{ position: 'relative' }}>
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          style={selectStyle}
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
          style={{
            position: 'absolute',
            right: 'var(--pcampus-space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--pcampus-color-text-tertiary)',
          }}
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
