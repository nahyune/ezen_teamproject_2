import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ── 개발용 /api 브리지 ─────────────────────────────────────────
// Vite dev 서버는 원래 서버리스 함수(api/chat.ts)를 안 돌린다. 그래서
// `npm run dev` 로컬 테스트 때 이 미들웨어가 실제 api/chat.ts 핸들러를
// 그대로 불러 처리한다. (배포는 Vercel이 api/chat.ts를 직접 실행 — 이 코드 무관)
// ※ dev 전용(apply: 'serve'). 프로덕션 빌드엔 포함되지 않음.
function devApiBridge(): Plugin {
  return {
    name: 'dev-api-bridge',
    apply: 'serve',
    configureServer(server) {
      // .env의 키를 서버(Node) 쪽 process.env에 주입 (클라이언트엔 노출 안 됨)
      const env = loadEnv('development', process.cwd(), '')
      if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
      if (env.ANTHROPIC_MODEL) process.env.ANTHROPIC_MODEL = env.ANTHROPIC_MODEL
      if (env.KAKAO_REST_API_KEY) process.env.KAKAO_REST_API_KEY = env.KAKAO_REST_API_KEY
      if (env.KAKAO_REST_KEY) process.env.KAKAO_REST_KEY = env.KAKAO_REST_KEY
      if (env.YOUTUBE_API_KEY) process.env.YOUTUBE_API_KEY = env.YOUTUBE_API_KEY

      const mountApi = (path: string, modulePath: string, method: 'POST' | 'GET' = 'POST') => {
        server.middlewares.use(path, async (req, res, next) => {
          if (req.method !== method) return next()
          try {
            // GET(music)은 본문 없이 쿼리스트링 그대로, POST(chat 등)는 JSON 본문 전달
            let body: string | undefined
            if (method === 'POST') {
              const chunks: Buffer[] = []
              for await (const c of req) chunks.push(c as Buffer)
              body = Buffer.concat(chunks).toString('utf8')
            }

            // 실제 배포 핸들러(api/*.ts)를 그대로 재사용한다.
            const mod = await server.ssrLoadModule(modulePath)
            const handler = mod.default as (req: Request) => Promise<Response>

            // originalUrl: 마운트 경로에 잘리기 전 URL (쿼리스트링 포함)
            const fullUrl = (req as typeof req & { originalUrl?: string }).originalUrl ?? path
            const webReq = new Request(`http://localhost${fullUrl}`, {
              method,
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
      }

      mountApi('/api/chat', '/api/chat.ts')
      mountApi('/api/kakao-directions', '/api/kakao-directions.ts')
      mountApi('/api/music', '/api/music.ts', 'GET')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApiBridge()],
})
