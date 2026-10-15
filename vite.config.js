import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        bundles: resolve(import.meta.dirname, 'bundles/index.html'),
        method: resolve(import.meta.dirname, 'method/index.html'),
        stories: resolve(import.meta.dirname, 'stories/index.html'),
        impact: resolve(import.meta.dirname, 'impact/index.html'),
        playbooks: resolve(import.meta.dirname, 'playbooks/index.html'),
        inquiry: resolve(import.meta.dirname, 'inquiry/index.html'),
      },
    },
  },
});
