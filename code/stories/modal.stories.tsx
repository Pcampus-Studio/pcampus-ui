import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from '../src/primitives/modal';
import { Button } from '../src/primitives/button';

const meta: Meta = { title: 'Primitives/Modal', tags: ['autodocs'] };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm action"
          description="This action cannot be undone."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p style={{ margin: 0, fontFamily: 'var(--pcampus-font-sans)', fontSize: 'var(--pcampus-text-base)', color: 'var(--pcampus-color-text-secondary)' }}>
            Are you sure you want to continue? This will permanently delete the selected item.
          </p>
        </Modal>
      </>
    );
  },
};
