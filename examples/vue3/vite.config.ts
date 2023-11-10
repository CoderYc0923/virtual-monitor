import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: false,
    host: '0.0.0.0',
    port: 6658,
    cors: true,
    proxy: {
      '/getList': {
        target: 'http://localhost:3353/',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false //  设置支持https协议的代理,
      },
      '/setList': {
        target: 'http://localhost:3353/',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false //  设置支持https协议的代理,
      },
      '/cleanTracingList': {
        target: 'http://localhost:3353/',
        changeOrigin: false,
        secure: false
      },
      '/getBaseInfo': {
        target: 'http://localhost:3353'
      },
      '/getAllTracingList': {
        target: 'http://localhost:3353'
      },
      '/trackweb': {
        target: 'http://localhost:3353'
      },
      '/getSourceMap': {
        target: 'http://localhost:3353/',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false //  设置支持https协议的代理,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
