import React from 'react';

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pcampus-space-2)',
        fontFamily: 'var(--pcampus-font-sans)',
      }}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: 'var(--pcampus-text-sm)',
            fontWeight: 500,
            color: 'var(--pcampus-color-text)',
            display: 'flex',
            gap: 'var(--pcampus-space-1)',
            alignItems: 'center',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--pcampus-color-error)' }}>*</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <span
          role="alert"
          style={{
            fontSize: 'var(--pcampus-text-xs)',
            color: 'var(--pcampus-color-error)',
          }}
        >
          {error}
        </span>
      )}
      {!error && hint && (
        <span
          style={{
            fontSize: 'var(--pcampus-text-xs)',
            color: 'var(--pcampus-color-text-tertiary)',
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
