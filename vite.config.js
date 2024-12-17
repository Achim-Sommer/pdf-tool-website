import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js',
          dest: 'pdfjs'
        }
      ]
    })
  ],
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
