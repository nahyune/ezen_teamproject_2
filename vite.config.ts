import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// 기록하기는 App.tsx의 한 화면으로 편입되어 단일 엔트리(index.html)만 사용한다.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
