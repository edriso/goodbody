import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/goodbody/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // The UI was lifted from a monorepo where types lived in a shared
      // package; here they are a single local file.
      '@good-bodies/types': fileURLToPath(new URL('./src/types.ts', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
