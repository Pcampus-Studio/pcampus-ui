import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from '../src/primitives/select';

const opts = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={opts} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<Select label="Category" options={opts} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('shows error', () => {
    render(<Select options={opts} error="Required" label="Category" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('is disabled', () => {
    render(<Select options={opts} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select ref={ref} options={opts} />);
    expect(ref.current?.tagName).toBe('SELECT');
  });
});
