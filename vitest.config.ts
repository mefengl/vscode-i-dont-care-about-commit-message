import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/src/**', '**/node_modules/**', 'out/**'],
  },
})
