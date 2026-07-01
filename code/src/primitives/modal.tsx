import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
  full: '100%',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  children,
  footer,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 7)}`;

  // Focus trap
  useEffect(() => {
    if (!open) return;

    const prevFocus = document.activeElement as HTMLElement | null;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      prevFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'var(--pcampus-backdrop-blur)',
    zIndex: 'var(--pcampus-z-modal)' as unknown as number,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--pcampus-space-8)',
    animation: `pcampus-fade-in var(--pcampus-duration-panel) var(--pcampus-ease-enter)`,
  };

  const panelStyle: React.CSSProperties = {
    background: 'var(--pcampus-color-surface)',
    borderRadius: 'var(--pcampus-radius-xl)',
    boxShadow: 'var(--pcampus-shadow-modal)',
    width: '100%',
    maxWidth: size === 'full' ? '100%' : sizeMap[size],
    maxHeight: size === 'full' ? '100%' : '90vh',
    display: 'flex',
    flexDirection: 'column',
    animation: `pcampus-slide-up var(--pcampus-duration-panel) var(--pcampus-ease-enter)`,
  };

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes pcampus-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcampus-slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        style={backdropStyle}
        onClick={closeOnBackdrop ? onClose : undefined}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          style={panelStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || description) && (
            <div
              style={{
                padding: 'var(--pcampus-space-7) var(--pcampus-space-8)',
                borderBottom: '1px solid var(--pcampus-color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--pcampus-space-4)',
              }}
            >
              <div>
                {title && (
                  <h2
                    id={titleId}
                    style={{
                      fontSize: 'var(--pcampus-text-xl)',
                      fontWeight: 600,
                      color: 'var(--pcampus-color-text)',
                      margin: 0,
                      fontFamily: 'var(--pcampus-font-sans)',
                    }}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    style={{
                      fontSize: 'var(--pcampus-text-base)',
                      color: 'var(--pcampus-color-text-secondary)',
                      margin: '4px 0 0',
                      fontFamily: 'var(--pcampus-font-sans)',
                    }}
                  >
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: 'var(--pcampus-color-text-tertiary)',
                  fontSize: 20,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          )}
          {/* Body */}
          <div
            style={{
              padding: 'var(--pcampus-space-8)',
              overflowY: 'auto',
              flex: 1,
              fontFamily: 'var(--pcampus-font-sans)',
            }}
          >
            {children}
          </div>
          {/* Footer */}
          {footer && (
            <div
              style={{
                padding: 'var(--pcampus-space-6) var(--pcampus-space-8)',
                borderTop: '1px solid var(--pcampus-color-border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--pcampus-space-3)',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

Modal.displayName = 'Modal';
