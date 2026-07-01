import React, { useReducer, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ToastContext, ToastData, ToastAction } from './toast-context';

export type { ToastData as ToastProps };

function toastReducer(
  state: { toasts: ToastData[] },
  action: ToastAction
): { toasts: ToastData[] } {
  switch (action.type) {
    case 'ADD':
      return { toasts: [...state.toasts, action.toast].slice(-3) }; // max 3
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

const variantStyles: Record<NonNullable<ToastData['variant']>, React.CSSProperties> = {
  default: { borderLeft: '4px solid var(--pcampus-color-neutral)' },
  success: { borderLeft: '4px solid var(--pcampus-color-success)' },
  error: { borderLeft: '4px solid var(--pcampus-color-error)' },
  warning: { borderLeft: '4px solid var(--pcampus-color-accent)' },
};

const ToastItem: React.FC<{ toast: ToastData; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const dur = toast.duration ?? 4000;
    if (dur === 0) return;
    timerRef.current = setTimeout(() => onDismiss(toast.id), dur);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      style={{
        minWidth: 300, maxWidth: 400,
        borderRadius: 'var(--pcampus-radius-lg)',
        boxShadow: 'var(--pcampus-shadow-modal)',
        background: 'var(--pcampus-color-surface)',
        padding: 'var(--pcampus-space-5) var(--pcampus-space-6)',
        display: 'flex', flexDirection: 'column', gap: 'var(--pcampus-space-2)',
        fontFamily: 'var(--pcampus-font-sans)',
        animation: `pcampus-toast-in var(--pcampus-duration-panel) var(--pcampus-ease-enter)`,
        ...variantStyles[toast.variant ?? 'default'],
      }}
    >
      <style>{`@keyframes pcampus-toast-in { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--pcampus-text-base)', color: 'var(--pcampus-color-text)' }}>
          {toast.title}
        </span>
        <button
          onClick={() => { onDismiss(toast.id); toast.onClose?.(); }}
          aria-label="Dismiss"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pcampus-color-text-tertiary)', fontSize: 16, padding: 0, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
      {toast.description && (
        <span style={{ fontSize: 'var(--pcampus-text-sm)', color: 'var(--pcampus-color-text-secondary)' }}>
          {toast.description}
        </span>
      )}
      {toast.action && (
        <button
          onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pcampus-color-primary)', fontSize: 'var(--pcampus-text-sm)', padding: 0, fontWeight: 500 }}
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });
  const handleDismiss = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), []);

  return (
    <ToastContext.Provider value={{ dispatch }}>
      {children}
      {ReactDOM.createPortal(
        <div
          aria-label="Notifications"
          style={{
            position: 'fixed',
            bottom: 'var(--pcampus-space-8)',
            right: 'var(--pcampus-space-8)',
            zIndex: 'var(--pcampus-z-toast)' as unknown as number,
            display: 'flex', flexDirection: 'column', gap: 'var(--pcampus-space-3)', alignItems: 'flex-end',
          }}
        >
          {state.toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={handleDismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
