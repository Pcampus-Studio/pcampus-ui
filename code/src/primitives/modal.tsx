'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { clsx } from 'clsx';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const sizeClass = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[900px]',
  full: 'max-w-full h-full rounded-none',
} as const;

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  children,
  footer,
  className,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 7)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted || typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[var(--pcampus-z-modal)] flex items-center justify-center p-8 animate-pcampus-fade-in"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'bg-pcampus-canvas rounded-pcampus-lg shadow-lg w-full max-h-[90vh] flex flex-col animate-pcampus-slide-up font-pcampus-sans border border-pcampus-hairline',
          sizeClass[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="p-6 border-b border-pcampus-hairline flex justify-between items-start gap-4">
            <div>
              {title && (
                <h2
                  id={titleId}
                  className="text-xl font-semibold text-pcampus-ink m-0"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-base text-pcampus-body mt-1 mb-0">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="bg-none border-none cursor-pointer p-1 text-pcampus-muted text-xl leading-none shrink-0 hover:text-pcampus-ink transition-colors"
            >
              ×
            </button>
          </div>
        )}
        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-pcampus-hairline flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';
