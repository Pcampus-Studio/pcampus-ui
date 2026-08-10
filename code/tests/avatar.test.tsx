import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../src/primitives/avatar';

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<Avatar name="Nattha Pcp" />);
    expect(screen.getByText('NP')).toBeInTheDocument();
  });

  it('renders single initial for single-word name', () => {
    render(<Avatar name="Admin" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders ? for no name or src', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/img.jpg" name="User" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has aria-label with name', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByLabelText('John Doe')).toBeInTheDocument();
  });
});
