import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync } from 'node:fs';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    entry: { index: 'src/index.ts' },
  },
  clean: true,
  sourcemap: false,
  splitting: false,
  minify: false,
  target: 'node18',
  outDir: 'dist',

  async onSuccess() {
    const cliPath = 'dist/cli.js';
    const content = readFileSync(cliPath, 'utf-8');
    if (!content.startsWith('#!')) {
      writeFileSync(cliPath, `#!/usr/bin/env node\n${content}`);
    }
  },
});