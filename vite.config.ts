/// <reference types="vitest" />
import {crx} from '@crxjs/vite-plugin';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {resolve} from 'path';
import {defineConfig} from 'vite';
import manifest from './manifest.json';
import postcss from './postcss.config.js';

const srcDir = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({hot: !process.env.VITEST}), crx({manifest})],
  resolve: {
    alias: {
      src: srcDir,
    },
  },
  css: {
    postcss,
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  legacy: {
    skipWebSocketTokenCheck: true,
  },
});
