import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, Send } from '../src/icons';

describe('Icon', () => {
  it('renders lucide icon with currentColor sizing', () => {
    const { container } = render(
      <Icon icon={Send} size="md" className="text-pcampus-primary" data-testid="send" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('exports curated Mail icons', async () => {
    const icons = await import('../src/icons');
    // lucide-react icons are forwardRef objects
    expect(icons.Send).toBeTruthy();
    expect(icons.Search).toBeTruthy();
    expect(icons.Sparkles).toBeTruthy();
    expect(icons.FlaskConical).toBeTruthy();
  });
});
