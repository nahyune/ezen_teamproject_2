import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ── 개발용 /api/chat 브리지 ──────────────────────────────────────
// Vite dev 서버는 원래 서버리스 함수(api/chat.ts)를 안 돌린다. 그래서
// `npm run dev` 로컬 테스트 때 이 미들웨어가 실제 api/chat.ts 핸들러를
// 그대로 불러 처리한다. (배포는 Vercel이 api/chat.ts를 직접 실행 — 이 코드 무관)
// ※ dev 전용(apply: 'serve'). 프로덕션 빌드엔 포함되지 않음.
function devApiChat(): Plugin {
  return {
    name: 'dev-api-chat',
    apply: 'serve',
    configureServer(server) {
      // .env의 키를 서버(Node) 쪽 process.env에 주입 (클라이언트엔 노출 안 됨)
      const env = loadEnv('development', process.cwd(), '')
      if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
      if (env.ANTHROPIC_MODEL) process.env.ANTHROPIC_MODEL = env.ANTHROPIC_MODEL

      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const body = Buffer.concat(chunks).toString('utf8')

          // 실제 배포 핸들러(api/chat.ts)를 그대로 재사용 → 프롬프트·가드레일·제한 동일
          const mod = await server.ssrLoadModule('/api/chat.ts')
          const handler = mod.default as (req: Request) => Promise<Response>

          const webReq = new Request('http://localhost/api/chat', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-forwarded-for': req.socket.remoteAddress ?? '127.0.0.1',
            },
            body,
          })
          const response = await handler(webReq)
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(await response.text())
        } catch (err) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'dev bridge error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApiChat()],
})
