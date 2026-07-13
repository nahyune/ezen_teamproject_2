// Vercel 서버리스 함수 — Claude API 프록시.
// ⚠️ API 키(ANTHROPIC_API_KEY)는 이 서버 환경변수에서만 읽는다. 절대 프론트로 내려보내지 않음.
//    프론트(브라우저)는 이 /api/chat 엔드포인트만 호출한다.
// 배포: Vercel 환경변수에 ANTHROPIC_API_KEY 등록. 로컬 테스트는 `vercel dev`.
import Anthropic from "@anthropic-ai/sdk";

export const config = { runtime: "edge" };

// 챗봇 "러니" 페르소나. (뼈대 — 추후 다듬기)
const RUNI_SYSTEM = `너는 러닝 앱 "W:RUN"의 AI 러닝 어시스턴트 "러니"야.
사용자의 러닝을 돕는다: 대회 추천, GPS 아트 코스 제안, 크루 매칭, 페이스·훈련·부상 예방 조언.
답변은 한국어로, 친근하고 간결하게. 러닝과 무관한 요청은 정중히 러닝 주제로 유도한다.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let messages: ChatMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages required" }, { status: 400 });
  }

  // 키가 없으면 명확히 알려준다(배포/로컬 설정 누락 진단용).
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not set on server" }, { status: 500 });
  }

  const client = new Anthropic(); // ANTHROPIC_API_KEY 자동 사용

  try {
    // 뼈대: 우선 비스트리밍. 추후 스트리밍(SSE/ReadableStream)으로 확장 예정.
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: RUNI_SYSTEM,
      messages,
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    return Response.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
