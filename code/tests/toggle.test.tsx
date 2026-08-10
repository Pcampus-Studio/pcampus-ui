import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '../src/primitives/toggle';

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle label="Enable" />);
    expect(screen.getByText('Enable')).toBeInTheDocument();
  });

  it('has role switch', () => {
    render(<Toggle label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    render(<Toggle checked label="On" />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Toggle onChange={onChange} label="Test" />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<Toggle disabled onChange={onChange} label="Disabled" />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
