'use strict';

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const files = ['dist/esm/index.js', 'dist/cjs/index.cjs'];
const directive = '"use client";\n';

for (const rel of files) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    throw new Error(`stamp-use-client: missing ${rel}`);
  }
  const src = readFileSync(path, 'utf8');
  if (src.startsWith('"use client"') || src.startsWith("'use client'")) {
    continue;
  }
  writeFileSync(path, directive + src);
}
