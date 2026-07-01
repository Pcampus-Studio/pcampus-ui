import React, { useReducer, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { clsx } from 'clsx';
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

const variantBorderClass = {
  default: 'border-l-4 border-[var(--pcampus-color-neutral)]',
  success: 'border-l-4 border-pcampus-success',
  error: 'border-l-4 border-pcampus-error',
  warning: 'border-l-4 border-pcampus-warning',
} as const;

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
      className={clsx(
        'min-w-[300px] max-w-[400px] rounded-pcampus-lg shadow-lg bg-pcampus-canvas p-4 flex flex-col gap-2 font-pcampus-sans animate-pcampus-toast-in border border-pcampus-hairline',
        variantBorderClass[toast.variant ?? 'default']
      )}
    >
      <div className="flex justify-between items-start">
        <span className="font-semibold text-base text-pcampus-ink">
          {toast.title}
        </span>
        <button
          onClick={() => { onDismiss(toast.id); toast.onClose?.(); }}
          aria-label="Dismiss"
          className="bg-none border-none cursor-pointer text-pcampus-muted text-lg p-0 leading-none hover:text-pcampus-ink transition-colors"
        >
          ×
        </button>
      </div>
      {toast.description && (
        <span className="text-sm text-pcampus-body">
          {toast.description}
        </span>
      )}
      {toast.action && (
        <button
          onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}
          className="self-start bg-none border-none cursor-pointer text-pcampus-primary text-sm p-0 font-medium hover:underline"
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
          className="fixed bottom-8 right-8 z-[var(--pcampus-z-toast)] flex flex-col gap-3 items-end"
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
