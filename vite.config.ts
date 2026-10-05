import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// No GitHub Pages o site fica em https://<usuario>.github.io/calculadora-energetica/
// O workflow de deploy define BASE_PATH; localmente usa a raiz.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), svgr()],
  build: { outDir: 'build' },
  test: { environment: 'node' },
})
