import React, { useId } from 'react';
import { FormField } from './form-field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  rows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      resize = 'vertical',
      rows = 4,
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

    const textareaStyle: React.CSSProperties = {
      width: '100%',
      borderRadius: 'var(--pcampus-radius-md)',
      border: `1px solid ${hasError ? 'var(--pcampus-color-error)' : 'var(--pcampus-color-border-strong)'}`,
      background: disabled ? 'var(--pcampus-color-surface-subtle)' : 'var(--pcampus-color-surface)',
      color: disabled ? 'var(--pcampus-color-text-disabled)' : 'var(--pcampus-color-text)',
      fontFamily: 'var(--pcampus-font-sans)',
      fontSize: 'var(--pcampus-text-base)',
      padding: 'var(--pcampus-space-4) var(--pcampus-space-5)',
      outline: 'none',
      resize,
      transition: `border-color var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
      lineHeight: 'var(--pcampus-leading-base)',
      ...style,
    };

    const textareaEl = (
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        style={textareaStyle}
        {...props}
      />
    );

    if (!label && !hint && !error) return textareaEl;

    return (
      <FormField label={label} hint={hint} error={error} htmlFor={id}>
        {textareaEl}
      </FormField>
    );
  }
);

Textarea.displayName = 'Textarea';
