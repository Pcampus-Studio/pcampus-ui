import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToastProvider } from '../src/primitives/toast-provider';
import { useToast } from '../src/primitives/use-toast';
import { Button } from '../src/primitives/button';

const meta: Meta = { title: 'Primitives/Toast', tags: ['autodocs'] };
export default meta;

const ToastDemo: React.FC<{ variant: 'default' | 'success' | 'error' | 'warning' }> = ({ variant }) => {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => toast({ variant, title: `${variant} toast`, description: 'This is a toast notification.' })}
    >
      Show {variant} toast
    </Button>
  );
};

export const AllVariants: StoryObj = {
  render: () => (
    <ToastProvider>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <ToastDemo variant="default" />
        <ToastDemo variant="success" />
        <ToastDemo variant="error" />
        <ToastDemo variant="warning" />
      </div>
    </ToastProvider>
  ),
};
