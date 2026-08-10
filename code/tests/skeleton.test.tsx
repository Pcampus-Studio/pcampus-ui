import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../src/primitives/skeleton';

describe('Skeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders multiple lines when lines prop given', () => {
    const { container } = render(<Skeleton lines={3} />);
    // Should have a wrapper with 3 children
    const wrapper = container.querySelector('span > span');
    // lines rendered inside flex container
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(3);
  });

  it('renders single block for lines=1', () => {
    const { container } = render(<Skeleton lines={1} />);
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(1);
  });
});
