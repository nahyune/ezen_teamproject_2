// 챗봇 메시지 모델 — "메시지 = 블록들의 배열".
// 텍스트뿐 아니라 칩(퀵리플)·카드·위젯 같은 리치 블록을 담기 위한 그릇.
//
// 설계 원칙 (하이브리드 (가)안):
//  - 카드/칩/위젯 같은 리치 블록은 **앱이 자기 데이터로** 만들어 붙인다.
//  - AI(Claude)는 자연어 "텍스트"만 생성한다 (api/chat).
//  - 그래서 AI로 보낼 때는 blocks 에서 text 만 뽑아 보낸다(toAiMessages).

export type ChipItem = { label: string; prompt: string };

// ── 블록 종류 (필요하면 여기에 추가) ──────────────────────────
export type TextBlock = { type: "text"; text: string };
export type ChipsBlock = { type: "chips"; items: ChipItem[] };
export type LoadingBlock = { type: "loading" }; // "러니가 …하고 있어요"
/** 대회/코스 등 리치 카드 — 뼈대: 최소 필드만. 추후 실제 데이터 스키마로 확장. */
export type CardBlock = {
  type: "card";
  variant?: "race" | "course";
  title: string;
  meta?: string;
  badge?: string; // 예: "D-3"
  image?: string;
};

export type MessageBlock = TextBlock | ChipsBlock | LoadingBlock | CardBlock;

export type ChatMessage = {
  role: "user" | "assistant";
  blocks: MessageBlock[];
};

// ── AI 전송용(텍스트만) ───────────────────────────────────────
export type AiMessage = { role: "user" | "assistant"; content: string };

/** 리치 메시지 배열 → AI로 보낼 텍스트-only 배열로 변환 (칩·카드는 제외). */
export function toAiMessages(messages: ChatMessage[]): AiMessage[] {
  return messages
    .map((m) => ({
      role: m.role,
      content: m.blocks
        .filter((b): b is TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim(),
    }))
    .filter((m) => m.content.length > 0);
}

// 간단 생성 헬퍼
export const userText = (text: string): ChatMessage => ({ role: "user", blocks: [{ type: "text", text }] });
export const botText = (text: string): ChatMessage => ({ role: "assistant", blocks: [{ type: "text", text }] });
