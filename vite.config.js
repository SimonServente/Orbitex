import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // En desarrollo (npm run dev) hace lo mismo que las funciones de la carpeta api/ en Vercel
      proxy: {
        // /api/body?id=mars → Le Système Solaire, agregando el token
        '/api/body': {
          target: 'https://api.le-systeme-solaire.net',
          changeOrigin: true,
          rewrite: (path) => `/rest/bodies/${new URLSearchParams(path.split('?')[1]).get('id')}`,
          headers: { Authorization: `Bearer ${env.SOLAR_API_KEY}` },
        },
        // /api/apod → foto del día de NASA, agregando la clave
        '/api/apod': {
          target: 'https://api.nasa.gov',
          changeOrigin: true,
          rewrite: () => `/planetary/apod?thumbs=true&api_key=${env.NASA_API_KEY || 'DEMO_KEY'}`,
        },
      },
    },
  }
})
