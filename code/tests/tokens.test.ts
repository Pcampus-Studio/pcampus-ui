import { describe, it, expect } from 'vitest';
import { tokens } from '../src/tokens';

describe('tokens', () => {
  it('exports pcampusColorPrimary', () => {
    expect(tokens.pcampusColorPrimary).toBeDefined();
    expect(tokens.pcampusColorPrimary).toBe('var(--pcampus-color-primary)');
  });

  it('exports pcampusColorError', () => {
    expect(tokens.pcampusColorError).toBeDefined();
  });

  it('exports pcampusColorSuccess', () => {
    expect(tokens.pcampusColorSuccess).toBeDefined();
  });

  it('exports pcampusFontSans', () => {
    expect(tokens.pcampusFontSans).toBeDefined();
  });

  it('exports pcampusSpace6', () => {
    expect(tokens.pcampusSpace6).toBe('16px');
  });

  it('exports all 7 token categories', () => {
    // color
    expect(tokens.pcampusColorPrimary).toBeDefined();
    // typography
    expect(tokens.pcampusFontSans).toBeDefined();
    // spacing
    expect(tokens.pcampusSpace1).toBeDefined();
    // border
    expect(tokens.pcampusBorderHairline).toBeDefined();
    // shadow
    expect(tokens.pcampusShadowModal).toBeDefined();
    // motion
    expect(tokens.pcampusDurationFast).toBeDefined();
    // layout/z-index
    expect(tokens.pcampusLayoutNavHeight).toBeDefined();
    expect(tokens.pcampusZModal).toBeDefined();
  });

  it('palette raw values are correct hex', () => {
    expect(tokens.pcampusBlue600).toBe('#2952A3');
    expect(tokens.pcampusGreen600).toBe('#2A7A4B');
    expect(tokens.pcampusRed600).toBe('#C0392B');
  });
});
