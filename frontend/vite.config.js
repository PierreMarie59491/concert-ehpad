// frontend/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',             // racine du projet frontend
  publicDir: 'public',   // dossier des assets statiques
  server: {
    port: 5173,          // port local
  },
  build: {
    outDir: 'dist',      // dossier de build
    emptyOutDir: true,
  }
})
