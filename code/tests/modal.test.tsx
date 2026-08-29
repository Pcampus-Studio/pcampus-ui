import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../src/primitives/modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders when open', () => {
    render(
      <Modal open onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Close test">
        <p>Content</p>
      </Modal>
    );
    await userEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Escape test">
        <p>Content</p>
      </Modal>
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('focuses the first field, not the close button', async () => {
    const { rerender } = render(
      <Modal open onClose={() => {}} title="Rename">
        <input aria-label="Name" defaultValue="Storefront" />
      </Modal>
    );
    const field = screen.getByLabelText('Name');
    expect(field).toHaveFocus();

    rerender(
      <Modal open onClose={() => {}} title="Rename">
        <input aria-label="Name" defaultValue="Storefront 2" />
      </Modal>
    );
    expect(field).toHaveFocus();
  });
});
