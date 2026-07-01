import React, { useId } from 'react';
import { FormField } from './form-field';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<NonNullable<InputProps['size']>, React.CSSProperties> = {
  sm: { height: '32px', fontSize: 'var(--pcampus-text-sm)', padding: '0 var(--pcampus-space-4)' },
  md: { height: '40px', fontSize: 'var(--pcampus-text-base)', padding: '0 var(--pcampus-space-5)' },
  lg: { height: '48px', fontSize: 'var(--pcampus-text-md)', padding: '0 var(--pcampus-space-6)' },
};

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
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    const inputStyle: React.CSSProperties = {
      width: '100%',
      borderRadius: 'var(--pcampus-radius-md)',
      border: `1px solid ${hasError ? 'var(--pcampus-color-error)' : 'var(--pcampus-color-border-strong)'}`,
      background: disabled ? 'var(--pcampus-color-surface-subtle)' : 'var(--pcampus-color-surface)',
      color: disabled ? 'var(--pcampus-color-text-disabled)' : 'var(--pcampus-color-text)',
      fontFamily: 'var(--pcampus-font-sans)',
      outline: 'none',
      transition: `border-color var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
      paddingLeft: leftElement ? 'var(--pcampus-space-9)' : undefined,
      paddingRight: rightElement ? 'var(--pcampus-space-9)' : undefined,
      ...sizeStyles[size],
      ...style,
    };

    const inputEl = (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftElement && (
          <span
            style={{
              position: 'absolute',
              left: 'var(--pcampus-space-3)',
              display: 'flex',
              color: 'var(--pcampus-color-text-tertiary)',
              pointerEvents: 'none',
            }}
          >
            {leftElement}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          style={inputStyle}
          {...props}
        />
        {rightElement && (
          <span
            style={{
              position: 'absolute',
              right: 'var(--pcampus-space-3)',
              display: 'flex',
              color: 'var(--pcampus-color-text-tertiary)',
            }}
          >
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
