import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../src/primitives/alert';

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Error occurred" description="Try again later." />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Try again later.')).toBeInTheDocument();
  });

  it('has role=alert', () => {
    render(<Alert title="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders all 4 variants', () => {
    (['info', 'success', 'warning', 'error'] as const).forEach((variant) => {
      const { unmount } = render(<Alert variant={variant} title={variant} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      unmount();
    });
  });

  it('dismisses when close button clicked', async () => {
    render(<Alert dismissible title="Dismiss me" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('calls onDismiss callback', async () => {
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss} title="Alert" />);
    await userEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
