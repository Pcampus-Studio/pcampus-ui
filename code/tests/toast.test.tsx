import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../src/primitives/toast-provider';
import { useToast } from '../src/primitives/use-toast';

const ToastTrigger: React.FC<{ variant?: 'default' | 'success' | 'error' | 'warning'; duration?: number }> = ({
  variant = 'default',
  duration,
}) => {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Test toast', variant, duration })}>
      Show toast
    </button>
  );
};

describe('Toast / useToast', () => {
  it('renders a toast on trigger', async () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
    await userEvent.click(screen.getByText('Show toast'));
    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });

  it('renders error toast with role=alert', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="error" />
      </ToastProvider>
    );
    await userEvent.click(screen.getByText('Show toast'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('queues max 3 toasts', async () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
    const btn = screen.getByText('Show toast');
    await userEvent.click(btn);
    await userEvent.click(btn);
    await userEvent.click(btn);
    await userEvent.click(btn); // 4th should evict oldest
    // only 3 visible
    expect(screen.getAllByText('Test toast').length).toBeLessThanOrEqual(3);
  });

  it('throws when useToast used outside ToastProvider', () => {
    const BrokenComponent = () => { useToast(); return null; };
    expect(() => render(<BrokenComponent />)).toThrow(
      'useToast must be used inside <ToastProvider>'
    );
  });
});
