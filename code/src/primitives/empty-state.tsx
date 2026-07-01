import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 'var(--pcampus-space-4)',
        padding: 'var(--pcampus-space-12) var(--pcampus-space-8)',
        fontFamily: 'var(--pcampus-font-sans)',
      }}
    >
      {icon && (
        <span
          style={{
            fontSize: 48,
            color: 'var(--pcampus-color-text-tertiary)',
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}
      <h3
        style={{
          margin: 0,
          fontSize: 'var(--pcampus-text-lg)',
          fontWeight: 600,
          color: 'var(--pcampus-color-text)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pcampus-text-base)',
            color: 'var(--pcampus-color-text-secondary)',
            maxWidth: 400,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: 'var(--pcampus-color-primary)',
            color: 'var(--pcampus-color-text-inverse)',
            border: 'none',
            borderRadius: 'var(--pcampus-radius-md)',
            padding: 'var(--pcampus-space-3) var(--pcampus-space-6)',
            fontSize: 'var(--pcampus-text-base)',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--pcampus-font-sans)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
