import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Only proxy backend API + auth endpoints that start with /api or /auth/google
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/auth/google': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
