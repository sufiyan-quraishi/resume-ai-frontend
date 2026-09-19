import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During development the front-end calls /api/* and Vite proxies those
// requests to the Spring Boot backend on :8080, so no CORS setup is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // profile photos uploaded via the backend are served from here
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
