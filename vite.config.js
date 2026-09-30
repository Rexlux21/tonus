import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://rexlux21.github.io/tonus/ via GitHub Pages.
  base: '/tonus/',
})
