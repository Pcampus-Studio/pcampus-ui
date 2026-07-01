import { createContext } from 'react';

export interface ToastData {
  id: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}

export type ToastAction =
  | { type: 'ADD'; toast: ToastData }
  | { type: 'REMOVE'; id: string };

export const ToastContext = createContext<{
  dispatch: (action: ToastAction) => void;
} | null>(null);
