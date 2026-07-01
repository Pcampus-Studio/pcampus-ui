import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { tokens } from '../src/tokens';

const meta: Meta = {
  title: 'Tokens/Palette',
  tags: ['autodocs'],
};
export default meta;

const colorTokens: Array<{ label: string; varName: string; rawKey: keyof typeof tokens }> = [
  { label: 'Primary', varName: '--pcampus-color-primary', rawKey: 'pcampusBlue600' },
  { label: 'Primary Bright', varName: '--pcampus-color-primary-bright', rawKey: 'pcampusBlue400' },
  { label: 'Primary Subtle', varName: '--pcampus-color-primary-subtle', rawKey: 'pcampusBlue100' },
  { label: 'Success', varName: '--pcampus-color-success', rawKey: 'pcampusGreen600' },
  { label: 'Error', varName: '--pcampus-color-error', rawKey: 'pcampusRed600' },
  { label: 'Accent', varName: '--pcampus-color-accent', rawKey: 'pcampusAmber600' },
  { label: 'Neutral', varName: '--pcampus-color-neutral', rawKey: 'pcampusSlate400' },
  { label: 'Surface', varName: '--pcampus-color-surface', rawKey: 'pcampusGray50' },
  { label: 'Surface Subtle', varName: '--pcampus-color-surface-subtle', rawKey: 'pcampusGray100' },
  { label: 'Text', varName: '--pcampus-color-text', rawKey: 'pcampusGray900' },
];

export const ColorPalette: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, padding: 24, fontFamily: 'var(--pcampus-font-sans)' }}>
      {colorTokens.map(({ label, varName, rawKey }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              height: 64,
              borderRadius: 'var(--pcampus-radius-md)',
              background: `var(${varName})`,
              border: '1px solid var(--pcampus-color-border)',
            }}
          />
          <span style={{ fontSize: 'var(--pcampus-text-xs)', fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 'var(--pcampus-text-2xs)', color: 'var(--pcampus-color-text-tertiary)', fontFamily: 'var(--pcampus-font-mono)' }}>
            {varName}
          </span>
          <span style={{ fontSize: 'var(--pcampus-text-2xs)', color: 'var(--pcampus-color-text-disabled)', fontFamily: 'var(--pcampus-font-mono)' }}>
            {tokens[rawKey]}
          </span>
        </div>
      ))}
    </div>
  ),
};
