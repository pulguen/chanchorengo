import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['dotenv', 'mongodb']
  },
  ssr: {
    external: ['dotenv', 'mongodb']
  },
  server: {
    fs: {
      // Permitimos el acceso a las carpetas necesarias
      allow: [
        resolve(__dirname, 'src'),
        resolve(__dirname, 'public'),
        resolve(__dirname, 'node_modules')
      ]
    },
    // Proxy: redirige las peticiones que comiencen con /api al puerto 3000,
    // donde se ejecuta el backend (por ejemplo, usando vercel dev o tu servidor Node)
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['dotenv', 'mongodb']
    }
  }
})
