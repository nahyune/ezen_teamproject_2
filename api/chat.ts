// Vercel 서버리스 함수 — Claude API 프록시.
// ⚠️ API 키(ANTHROPIC_API_KEY)는 이 서버 환경변수에서만 읽는다. 절대 프론트로 내려보내지 않음.
//    프론트(브라우저)는 이 /api/chat 엔드포인트만 호출한다.
// 배포: Vercel 환경변수에 ANTHROPIC_API_KEY 등록. 로컬 테스트는 `vercel dev`.
import Anthropic from "@anthropic-ai/sdk";

export const config = { runtime: "edge" };

// 챗봇 "러니" 페르소나 + 말투/형식 규칙.
const RUNI_SYSTEM = `너는 러닝 앱 "W:RUN"의 AI 러닝 어시스턴트 "러니"야.
대회 추천, GPS 아트 코스, 크루 매칭, 페이스·훈련·부상 예방을 돕는다.

[말투·형식 규칙 — 반드시 지켜]
- 짧게. 보통 2~4문장, 핵심만. 장황하게 나열하지 마. 사용자가 더 물으면 그때 자세히 답한다.
- 마크다운 기호(#, *, **, -, > 등)로 꾸미지 마. 앱이 답을 '일반 텍스트'로 그대로 보여줘서 기호가 그대로 노출된다. 목록이 필요하면 줄바꿈만으로 구분한다.
- 문단 사이는 빈 줄(줄바꿈)로 띄워 읽기 편하게.
- 그래픽 이모지(🏃, 😊, 🏅 같은 그림 이모지) 절대 쓰지 마. 대신 텍스트 이모티콘(^^;, :) 같은 것)을 한 메시지에 0~1개만, 어울릴 때만.
- 존댓말, 친근하게. 한국어로.
- 대회·코스·크루·훈련루틴 관련 답이면 앱이 카드를 함께 보여주니, 너는 짧게 소개만 하고 세부 목록은 카드에 맡겨라.
- 러닝과 무관한 요청은 한두 문장으로 정중히 러닝 주제로 유도한다.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

// 비용 폭주 방어 (포폴용 — 정상 대화는 넉넉히 허용, 남용만 차단).
const MAX_MESSAGES = 20; // 최근 N개만 모델로 전달 (그 이전 히스토리는 잘라냄)
const MAX_CHARS_PER_MESSAGE = 2000; // 메시지 1개당 글자수 상한
const MAX_TOKENS = 1024; // 응답 길이 상한
// 채팅 UX엔 빠르고 저렴한 Haiku가 유리. 배포에서 ANTHROPIC_MODEL로 교체 가능.
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

// ── 레이트 리밋 (IP당 요청 수 제한 — 스팸/남용 1차 차단) ─────────────
// edge 인스턴스 메모리 기반이라 완벽한 분산 상한은 아니지만, 단일 IP의 연타
// 스팸을 실질적으로 막아준다. 비용의 "확실한 상한"은 선불 크레딧 + 자동충전 OFF.
const RATE_LIMIT = 15; // 창(window)당 최대 요청 수
const RATE_WINDOW_MS = 60_000; // 60초
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // 가끔 만료 항목 정리 (메모리 누수 방지)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  }
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 레이트 리밋: 같은 IP가 짧은 시간에 너무 많이 요청하면 차단.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요." },
      { status: 429 },
    );
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

  // 입력 검증 + 비용 방어: 형식이 어긋나면 거절, 과한 길이는 잘라낸다.
  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string"
    ) {
      return Response.json({ error: "invalid message format" }, { status: 400 });
    }
    if (m.content.length > MAX_CHARS_PER_MESSAGE) {
      return Response.json(
        { error: `메시지는 ${MAX_CHARS_PER_MESSAGE}자를 넘을 수 없어요.` },
        { status: 400 },
      );
    }
  }
  // 최근 MAX_MESSAGES개만 모델로 전달 (오래된 히스토리는 잘라 토큰·비용 상한 유지).
  const trimmed = messages.slice(-MAX_MESSAGES);

  // 키가 없으면 명확히 알려준다(배포/로컬 설정 누락 진단용).
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not set on server" }, { status: 500 });
  }

  const client = new Anthropic(); // ANTHROPIC_API_KEY 자동 사용

  try {
    // 뼈대: 우선 비스트리밍. 추후 스트리밍(SSE/ReadableStream)으로 확장 예정.
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: RUNI_SYSTEM,
      messages: trimmed,
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
