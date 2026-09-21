import { defineConfig } from 'vite';
export default defineConfig({
  root: 'html',
  base: './',
  build: { outDir: '../dist', emptyOutDir: true, sourcemap: false }
});

