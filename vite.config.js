import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base ensures full portability on GitHub Pages (/repository-name/) or any static host
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        result: resolve(__dirname, 'result.html')
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});

