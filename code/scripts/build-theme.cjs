#!/usr/bin/env node
/**
 * Build dist/theme.css as raw CSS (no Tailwind compilation).
 *
 * dist/theme.css is a Tailwind v4 preset for consuming services.
 * It must NOT be compiled — services import it alongside their own
 * @import "tailwindcss" so they do the compilation themselves.
 *
 * Output: tokens/index.css + theme.css body (with @import line removed)
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const tokens = fs.readFileSync(path.join(root, 'src/tokens/index.css'), 'utf-8');
const themeSource = fs.readFileSync(path.join(root, 'src/styles/theme.css'), 'utf-8');

// Strip the @import "../tokens/index.css" line — we inline tokens above
const themeBody = themeSource.replace(/@import\s+['"]\.\.\/tokens\/index\.css['"];?\s*\n?/, '');

const banner = [
  '/**',
  ' * @pcampus-studio/ui — Tailwind v4 theme preset (raw CSS)',
  ' *',
  ' * Usage in consuming services (Tailwind v4):',
  ' *   @import "tailwindcss";',
  ' *   @source "../node_modules/@pcampus-studio/ui/dist/esm";',
  ' *   @import "@pcampus-studio/ui/dist/theme.css";',
  ' *',
  ' * Provides: --pcampus-* CSS custom properties + @theme inline utility mapping.',
  ' * Do NOT use alongside dist/index.css — they overlap.',
  ' */',
].join('\n');

const output = `${banner}\n\n${tokens}\n${themeBody}`;

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/theme.css'), output);
console.log('✓ dist/theme.css — raw CSS (tokens + @theme inline, no compilation)');
