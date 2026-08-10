import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const srcDir = join(root, 'src');
const themeCss = readFileSync(join(srcDir, 'styles/theme.css'), 'utf8');

const colorUtilityPrefixes = [
  'accent',
  'bg',
  'border',
  'caret',
  'decoration',
  'divide',
  'fill',
  'from',
  'outline',
  'placeholder',
  'ring',
  'shadow',
  'stroke',
  'text',
  'to',
  'via',
];

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      return listSourceFiles(path);
    }

    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });
}

function extractPcampusColorRoles(source: string): Set<string> {
  const roles = new Set<string>();
  const classPattern = new RegExp(
    String.raw`(?:^|[^a-z0-9-])(?:${colorUtilityPrefixes.join('|')})-pcampus-([a-z0-9-]+)(?:\/\d+)?`,
    'g',
  );

  for (const match of source.matchAll(classPattern)) {
    roles.add(match[1]);
  }

  return roles;
}

function extractThemeColorRoles(source: string): Set<string> {
  return new Set(
    [...source.matchAll(/--color-pcampus-([a-z0-9-]+)\s*:/g)].map((match) => match[1]),
  );
}

describe('theme preset', () => {
  it('maps every pcampus color utility used by components', () => {
    const usedRoles = new Set<string>();

    for (const file of listSourceFiles(srcDir)) {
      const source = readFileSync(file, 'utf8');
      for (const role of extractPcampusColorRoles(source)) {
        usedRoles.add(role);
      }
    }

    const mappedRoles = extractThemeColorRoles(themeCss);
    const missingRoles = [...usedRoles].filter((role) => !mappedRoles.has(role));

    expect(missingRoles).toEqual([]);
  });
});
