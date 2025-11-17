import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
  optimizeDeps: {
    include: ['sql.js'],
  },
});
