import React from 'react';
import { clsx } from 'clsx';

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col gap-2 font-pcampus-sans', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-pcampus-ink inline-flex gap-1 items-center"
        >
          {label}
          {required && (
            <span className="text-pcampus-error">*</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <span
          role="alert"
          className="text-xs text-pcampus-error"
        >
          {error}
        </span>
      )}
      {!error && hint && (
        <span className="text-xs text-pcampus-muted">
          {hint}
        </span>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
