import React, { useId, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      hint,
      error,
      indeterminate = false,
      id: idProp,
      disabled,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const innerRef = useRef<HTMLInputElement>(null);

    const setRef = (el: HTMLInputElement | null) => {
      (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const hasError = Boolean(error);

    return (
      <div className={clsx('flex flex-col gap-1 font-pcampus-sans', className)}>
        <label
          htmlFor={id}
          className={clsx(
            'inline-flex items-center gap-3',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          )}
        >
          <input
            ref={setRef}
            type="checkbox"
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={clsx(
              'w-4 h-4 accent-pcampus-primary shrink-0',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            {...props}
          />
          {label && (
            <span
              className={clsx(
                'text-base',
                disabled ? 'text-pcampus-muted' : 'text-pcampus-ink'
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <span
            id={`${id}-error`}
            role="alert"
            className="text-xs text-pcampus-error pl-7"
          >
            {error}
          </span>
        )}
        {!error && hint && (
          <span className="text-xs text-pcampus-muted pl-7">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
