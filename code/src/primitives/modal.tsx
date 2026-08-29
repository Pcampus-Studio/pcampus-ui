'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
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

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const FIRST_FIELD =
  'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])';

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
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevFocus = document.activeElement as HTMLElement | null;

    const queryFocusable = () => {
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes) return [] as HTMLElement[];
      return Array.from(nodes).filter((el) => {
        if (el.getAttribute('aria-hidden') === 'true') return false;
        if ((el as HTMLButtonElement | HTMLInputElement).disabled) return false;
        return true;
      });
    };

    const focusFirstField = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && panel.contains(active) && active.matches(FIRST_FIELD)) {
        return;
      }
      const field = panel.querySelector<HTMLElement>(FIRST_FIELD);
      (field ?? queryFocusable()[0])?.focus();
    };

    const raf = requestAnimationFrame(focusFirstField);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = queryFocusable();
      if (focusable.length === 0) return;

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
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      prevFocus?.focus();
    };
  }, [open, mounted]);

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
          'relative bg-pcampus-canvas rounded-pcampus-lg shadow-lg w-full max-h-[90vh] flex flex-col animate-pcampus-slide-up font-pcampus-sans border border-pcampus-hairline',
          sizeClass[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="p-6 pr-12 border-b border-pcampus-hairline">
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
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 z-[1] bg-none border-none cursor-pointer p-1 text-pcampus-muted text-xl leading-none hover:text-pcampus-ink transition-colors"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';
