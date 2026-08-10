import React, { useId } from 'react';
import { clsx } from 'clsx';
import { FormField } from './form-field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  rows?: number;
}

const resizeClass = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
} as const;

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
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const hasError = Boolean(error);

    const textareaEl = (
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={clsx(
          'w-full rounded-pcampus-md border font-pcampus-sans text-sm p-3 outline-none transition-all',
          hasError ? 'border-pcampus-error' : 'border-pcampus-hairline-strong',
          disabled ? 'bg-pcampus-canvas-soft text-pcampus-muted opacity-50' : 'bg-pcampus-canvas text-pcampus-ink',
          'focus:outline-none focus:ring-2 focus:ring-pcampus-primary focus:border-transparent',
          resizeClass[resize],
          className
        )}
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
