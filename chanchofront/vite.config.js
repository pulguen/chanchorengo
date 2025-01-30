import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: './', // Asegura que la app funcione en subdirectorios en producción
  build: {
    outDir: 'dist', // Directorio de salida
  },
});

