import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // 部署到 GitHub Pages 时需要设置 base
  // 如果部署到 https://<USERNAME>.github.io/<REPO>/，则设置为 '/<REPO>/'
  // 如果部署到 https://<USERNAME>.github.io/，则设置为 '/'
  base: process.env.NODE_ENV === 'production' ? '/Illusion/' : '/',

  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 避免打包时的内存问题
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          'vue-vendor': ['vue', 'pinia'],
          'chart-vendor': ['echarts', 'vue-echarts'],
          'pptx-vendor': ['pptxgenjs']
        }
      }
    }
  }
})
