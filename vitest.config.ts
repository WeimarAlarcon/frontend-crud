// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: './tests/setup.ts', // Configuración global opcional
  },
  resolve: {
    alias: {
      src: join(__dirname, 'src'),
    },
  },
});
