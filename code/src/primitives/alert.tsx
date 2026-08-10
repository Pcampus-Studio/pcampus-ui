import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const variantClass = {
  info: 'bg-[var(--pcampus-color-primary-subtle)] border border-[var(--pcampus-color-primary-border)] border-l-4 border-l-pcampus-primary text-pcampus-primary',
  success: 'bg-[var(--pcampus-color-success-subtle)] border border-pcampus-success border-l-4 border-l-pcampus-success text-pcampus-success',
  warning: 'bg-[var(--pcampus-color-accent-subtle)] border border-[var(--pcampus-color-accent-light)] border-l-4 border-l-pcampus-warning text-pcampus-warning',
  error: 'bg-[var(--pcampus-color-error-subtle)] border border-pcampus-error border-l-4 border-l-pcampus-error text-pcampus-error',
} as const;

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  action,
  dismissible = false,
  onDismiss,
  children,
  className,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={clsx(
        'flex flex-col gap-2 rounded-pcampus-md p-5 font-pcampus-sans relative',
        variantClass[variant],
        className
      )}
    >
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-inherit text-lg leading-none opacity-60 p-0 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
      {title && (
        <span className="font-semibold text-base text-inherit">
          {title}
        </span>
      )}
      {description && (
        <span className="text-sm text-inherit opacity-85">
          {description}
        </span>
      )}
      {children}
      {action && (
        <button
          onClick={action.onClick}
          className="self-start bg-transparent border-none cursor-pointer text-inherit text-sm p-0 font-semibold underline hover:no-underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
