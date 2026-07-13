// 챗봇 API 클라이언트 — 프론트는 /api/chat 만 호출한다(키는 서버에만 존재).
export type ChatMessage = { role: "user" | "assistant"; content: string };

/** 대화 내역을 서버로 보내고 러니의 답변 텍스트를 받는다. (뼈대: 비스트리밍) */
export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `요청 실패 (${res.status})`);
  }
  return data.text ?? "";
}
