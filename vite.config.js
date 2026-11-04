import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment (https://nguyenxuanhieu2903.github.io/numerology-web/)
  // Uses /numerology-web/ in production and / in development for seamless local DX
  base: mode === 'production' ? '/numerology-web/' : '/',
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
}));

