import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths, so the built game works from GitHub Pages' /llama-journey/ folder as well as locally.
  base: './',
  // Listen on the local network so a phone on the same Wi-Fi can open the dev server.
  server: { host: true },
  preview: { host: true },
});
