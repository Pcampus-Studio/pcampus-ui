import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      theme: 'src/styles/theme.css',
      motion: 'src/motion/keyframes.css',
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist/esm',
    treeshake: true,
    external: ['react', 'react-dom'],
    loader: { '.css': 'copy' },
    esbuildOptions(options) {
      options.chunkNames = 'chunks/[name]-[hash]';
    },
  },
  {
    entry: {
      index: 'src/index.ts',
      theme: 'src/styles/theme.css',
      motion: 'src/motion/keyframes.css',
    },
    format: ['cjs'],
    dts: false,
    sourcemap: true,
    clean: false,
    outDir: 'dist/cjs',
    treeshake: true,
    external: ['react', 'react-dom'],
    loader: { '.css': 'copy' },
  },
]);
