import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: appRoot,
  base: '/art/',
  plugins: [react()],
  build: {
    outDir: resolve(appRoot, '../public/art'),
    emptyOutDir: true,
  },
});
