import React, { useId, useRef, useEffect } from 'react';

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
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const innerRef = useRef<HTMLInputElement>(null);

    // Merge refs
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pcampus-space-1)',
          fontFamily: 'var(--pcampus-font-sans)',
        }}
      >
        <label
          htmlFor={id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--pcampus-space-3)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <input
            ref={setRef}
            type="checkbox"
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            style={{
              width: 16,
              height: 16,
              cursor: disabled ? 'not-allowed' : 'pointer',
              accentColor: 'var(--pcampus-color-primary)',
              flexShrink: 0,
            }}
            {...props}
          />
          {label && (
            <span
              style={{
                fontSize: 'var(--pcampus-text-base)',
                color: disabled ? 'var(--pcampus-color-text-disabled)' : 'var(--pcampus-color-text)',
              }}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <span
            id={`${id}-error`}
            role="alert"
            style={{ fontSize: 'var(--pcampus-text-xs)', color: 'var(--pcampus-color-error)', paddingLeft: '24px' }}
          >
            {error}
          </span>
        )}
        {!error && hint && (
          <span
            style={{ fontSize: 'var(--pcampus-text-xs)', color: 'var(--pcampus-color-text-tertiary)', paddingLeft: '24px' }}
          >
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
