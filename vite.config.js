import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Disable Fast Refresh completely
      fastRefresh: false,
      // Disable React DevTools in production
      jsxRuntime: 'automatic'
    })
  ],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  define: {
    __DEV__: false,
    'process.env.NODE_ENV': '"production"'
  },
  // Force production mode
  mode: 'production'
})
