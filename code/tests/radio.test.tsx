import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from '../src/primitives/radio';

const opts = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C (disabled)', disabled: true },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    render(<RadioGroup name="test" options={opts} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('has role radiogroup', () => {
    render(<RadioGroup name="test" options={opts} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('marks the correct option as checked', () => {
    render(<RadioGroup name="test" options={opts} value="b" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeChecked();
  });

  it('calls onChange with value when option clicked', async () => {
    const onChange = vi.fn();
    render(<RadioGroup name="test" options={opts} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('disabled option is not clickable', () => {
    render(<RadioGroup name="test" options={opts} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[2]).toBeDisabled();
  });
});
