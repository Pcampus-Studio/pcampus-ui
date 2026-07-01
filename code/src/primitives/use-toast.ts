import { useContext, useCallback } from 'react';
import { ToastContext, ToastData } from './toast-context';

export type { ToastData as ToastProps };

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }

  const toast = useCallback(
    (props: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      ctx.dispatch({ type: 'ADD', toast: { ...props, id } });
    },
    [ctx]
  );

  const dismiss = useCallback(
    (id: string) => ctx.dispatch({ type: 'REMOVE', id }),
    [ctx]
  );

  return { toast, dismiss };
}
