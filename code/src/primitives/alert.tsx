import React, { useState } from 'react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<AlertProps['variant']>, React.CSSProperties> = {
  info: {
    background: 'var(--pcampus-color-primary-subtle)',
    border: '1px solid var(--pcampus-color-primary-border)',
    borderLeft: '4px solid var(--pcampus-color-primary)',
    color: 'var(--pcampus-color-primary)',
  },
  success: {
    background: 'var(--pcampus-color-success-subtle)',
    border: '1px solid var(--pcampus-color-success)',
    borderLeft: '4px solid var(--pcampus-color-success)',
    color: 'var(--pcampus-color-success)',
  },
  warning: {
    background: 'var(--pcampus-color-accent-subtle)',
    border: '1px solid var(--pcampus-color-accent-light)',
    borderLeft: '4px solid var(--pcampus-color-accent)',
    color: 'var(--pcampus-color-accent)',
  },
  error: {
    background: 'var(--pcampus-color-error-subtle)',
    border: '1px solid var(--pcampus-color-error)',
    borderLeft: '4px solid var(--pcampus-color-error)',
    color: 'var(--pcampus-color-error)',
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  action,
  dismissible = false,
  onDismiss,
  children,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const vStyle = variantStyles[variant];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pcampus-space-2)',
        borderRadius: 'var(--pcampus-radius-md)',
        padding: 'var(--pcampus-space-5) var(--pcampus-space-6)',
        fontFamily: 'var(--pcampus-font-sans)',
        position: 'relative',
        ...vStyle,
      }}
    >
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          style={{
            position: 'absolute', top: 'var(--pcampus-space-3)', right: 'var(--pcampus-space-3)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'inherit', fontSize: 16, lineHeight: 1, opacity: 0.6, padding: 0,
          }}
        >
          ×
        </button>
      )}
      {title && (
        <span style={{ fontWeight: 600, fontSize: 'var(--pcampus-text-base)', color: 'inherit' }}>
          {title}
        </span>
      )}
      {description && (
        <span style={{ fontSize: 'var(--pcampus-text-sm)', color: 'inherit', opacity: 0.85 }}>
          {description}
        </span>
      )}
      {children}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer',
            color: 'inherit', fontSize: 'var(--pcampus-text-sm)', padding: 0, fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
