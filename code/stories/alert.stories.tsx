import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert } from '../src/primitives/alert';

const meta: Meta<typeof Alert> = { title: 'Primitives/Alert', component: Alert, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = { args: { variant: 'info', title: 'Information', description: 'This is an informational alert.' } };
export const Success: Story = { args: { variant: 'success', title: 'Success!', description: 'Operation completed successfully.' } };
export const Warning: Story = { args: { variant: 'warning', title: 'Warning', description: 'Please review before proceeding.' } };
export const Error: Story = { args: { variant: 'error', title: 'Error', description: 'Something went wrong. Please try again.' } };
export const Dismissible: Story = { args: { variant: 'info', title: 'Dismissible alert', description: 'Click × to dismiss.', dismissible: true } };
export const WithAction: Story = { args: { variant: 'warning', title: 'Review required', action: { label: 'View details', onClick: () => alert('clicked') } } };
