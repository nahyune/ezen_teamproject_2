// 챗봇 API 클라이언트 — 프론트는 /api/chat 만 호출한다(키는 서버에만 존재).
import { runiRaceCards, runiCrewCards, runiCourseCard } from "../data";
import type { ChatMessage, MessageBlock } from "./chatTypes";
import { toAiMessages } from "./chatTypes";

/** AI에 함께 전달할 사용자 프로필 (이름 호칭·레벨 맞춤 답변용) */
export type ChatUserProfile = { name: string; levelDesc: string };

/** 대화 내역을 서버로 보내고 러니의 답변 텍스트를 받는다. (비스트리밍)
 *  ⚠️ 로컬 vite(npm run dev)엔 /api/chat 이 없어 404 — 배포 또는 `vercel dev`에서 동작. */
async function fetchAiText(messages: ChatMessage[], profile?: ChatUserProfile): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: toAiMessages(messages), profile }),
  });
  const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? `요청 실패 (${res.status})`);
  return data.text ?? "";
}

/** 유저 발화 의도에 따라 텍스트 뒤에 붙일 리치 블록을 조립한다(하이브리드 설계).
 *  AI는 자연어만 만들고, 카드·칩은 앱이 자기 데이터로 만든다.
 *  실서비스에선 실제 대회/코스 API로 교체 (지금은 목데이터). */
function enrichBlocks(userText: string, aiText: string): MessageBlock[] {
  const q = userText;
  const blocks: MessageBlock[] = [{ type: "text", text: aiText }];

  if (/대회|마라톤|레이스/.test(q)) {
    blocks.push({ type: "cards", variant: "race", items: runiRaceCards });
    blocks.push({
      type: "chips",
      items: [
        { label: "접수 오픈 알림 받기", prompt: "이 대회 접수 오픈 알림 받을래" },
        { label: "다른 대회 볼래", prompt: "다른 대회도 추천해줘" },
      ],
    });
  } else if (/크루|같이|함께 뛸/.test(q)) {
    blocks.push({ type: "cards", variant: "crew", items: runiCrewCards });
    blocks.push({
      type: "chips",
      items: [
        { label: "가입 신청하기", prompt: "이 크루 가입 신청할래" },
        { label: "다른 크루 볼래", prompt: "다른 크루도 추천해줘" },
      ],
    });
  } else if (/코스|GPS|아트|그려/.test(q)) {
    blocks.push({ type: "mapCard", ...runiCourseCard });
    blocks.push({
      type: "chips",
      items: [
        { label: "이 코스로 달리기", prompt: "이 코스로 러닝 시작할래" },
        { label: "다른 모양", prompt: "다른 모양 코스로 그려줘" },
      ],
    });
  }
  return blocks;
}

/** 유저 메시지를 보내고, 러니의 리치 답변(블록 배열)을 받는다.
 *  profile 을 넘기면 AI가 사용자 이름을 부르고 러닝 레벨에 맞춰 답한다. */
export async function sendChat(
  history: ChatMessage[],
  userInput: string,
  profile?: ChatUserProfile,
): Promise<MessageBlock[]> {
  const next: ChatMessage[] = [
    ...history,
    { role: "user", blocks: [{ type: "text", text: userInput }] },
  ];
  const aiText = await fetchAiText(next, profile);
  return enrichBlocks(userInput, aiText);
}
