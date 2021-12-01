import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'package.json': path.resolve(__dirname, 'package.json'),
    },
  },
  server: {
    port: 1234,
  },
})
