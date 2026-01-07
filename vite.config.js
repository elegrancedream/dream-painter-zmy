import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 根据环境动态设置 base 路径
  // 开发环境使用根路径，生产环境使用 GitHub Pages 路径
  base: process.env.NODE_ENV === 'production'
    ? '/dream-painter-zmy/'  // GitHub Pages 路径（需要根据实际仓库名修改）
    : '/',  // 开发环境使用根路径
  server: {
    port: 3000,
    open: true,
    host: true, // 允许外部访问（用于手机测试）
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 优化构建输出
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
})

