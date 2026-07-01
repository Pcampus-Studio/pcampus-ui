import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../src/primitives/checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('is accessible via role checkbox', () => {
    render(<Checkbox label="Accept" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Checkbox error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('is disabled', () => {
    render(<Checkbox disabled label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Check" onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalled();
  });
});
