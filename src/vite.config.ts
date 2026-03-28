import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: host || false,
    hmr: host ? {
	protocol: 'ws',
	host,
	port: 1421,
    } : undefined,
    watch: true,
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'cheom105' : 'safari13',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild': false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
