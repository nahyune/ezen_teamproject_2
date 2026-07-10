import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // 멀티 페이지: 홈(index.html) + 기록하기 미리보기(record.html)
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        record: resolve(import.meta.dirname, 'record.html'),
      },
    },
  },
})
