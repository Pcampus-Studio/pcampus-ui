import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../src/primitives/badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['default', 'primary', 'success', 'warning', 'error', 'neutral'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders dot without text', () => {
    render(<Badge dot variant="success" />);
    // should render without crashing
    const badge = document.querySelector('span');
    expect(badge).toBeInTheDocument();
  });
});
