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
export type LoadingBlock = { type: "loading"; label?: string }; // "러니가 …하고 있어요"

/** 대회/코스 카드 (가로 스크롤 카드 로우) — 목업 03(대회)/09(크루) */
export type RaceCard = {
  badge?: string; // 예: "D-3", "모집중"
  title: string;
  meta?: string; // 예: "07-25(토) · 10km · 접수중"
  image?: string;
};
export type CardsBlock = { type: "cards"; variant: "race" | "crew"; items: RaceCard[] };

/** 지도 코스 카드 — 목업 06 (GPS 아트) */
export type MapCardBlock = {
  type: "mapCard";
  title: string;
  meta?: string; // 예: "4.6km · 쉬움 · 예상 32분"
  image?: string; // 지도 썸네일
};

/** 진행 배너 — 목업 04 (회고 인터뷰 3/5) */
export type ProgressBlock = { type: "progress"; title: string; step: number; total: number };

/** 케어/경고 카드 — 목업 07 (무리 말리기) */
export type CareCardBlock = {
  type: "careCard";
  text: string;
  stats?: { label: string; value: string; warn?: boolean }[];
};

/** 에러 + 재시도 — 목업 08 */
export type ErrorBlock = { type: "error"; text: string };

export type MessageBlock =
  | TextBlock
  | ChipsBlock
  | LoadingBlock
  | CardsBlock
  | MapCardBlock
  | ProgressBlock
  | CareCardBlock
  | ErrorBlock;

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
