import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // En desarrollo (npm run dev) hace lo mismo que api/body.js en Vercel:
      // reenvía /api/body?id=mars a Le Système Solaire agregando el token.
      proxy: {
        '/api/body': {
          target: 'https://api.le-systeme-solaire.net',
          changeOrigin: true,
          rewrite: (path) => `/rest/bodies/${new URLSearchParams(path.split('?')[1]).get('id')}`,
          headers: { Authorization: `Bearer ${env.SOLAR_API_KEY}` },
        },
      },
    },
  }
})
