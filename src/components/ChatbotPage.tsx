import { useRef, useState, type ReactNode } from "react";
import { ChatBlock } from "./ChatBlocks";
import { sendChat } from "../lib/chatClient";
import type { ChatMessage, MessageBlock } from "../lib/chatTypes";
import runiIcon from "../assets/icons/icon-chatbot.svg";
import { BackButton } from "./Icons";
import { useUserProfile } from "../lib/userProfile";


type Suggestion = { title: string; desc: string; prompt: string; icon: ReactNode };

const suggestions: Suggestion[] = [
  {
    title: "나갈 만한 대회 찾기",
    desc: "지역·거리·날짜로 맞춤 추천",
    prompt: "이번 주말에 나갈 만한 대회 있어?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]">
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 13.5 7.5 21l4.5-2.5L16.5 21 15 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "GPS 아트 코스 그리기",
    desc: "오늘은 강아지 모양 어때요?",
    prompt: "GPS 아트 코스 그려줘. 강아지 모양으로.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]">
        <path d="M6 20a3 3 0 0 0 3-3V9a3 3 0 0 1 6 0v6a3 3 0 0 0 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="6" cy="20" r="1.6" fill="currentColor" />
        <circle cx="18" cy="4" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "같이 뛸 크루 찾기",
    desc: "지역·페이스로 맞춤 매칭",
    prompt: "우리 동네에서 같이 뛸 크루 찾아줘.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 5.5-4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function ChatbotPage({ onBack }: { onBack?: () => void }) {
  const { profile } = useUserProfile(); // 프로필 편집값이 AI 호칭·응답에 반영됨
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastPrompt = useRef<string>("");

  const scrollToEnd = () =>
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }));

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    lastPrompt.current = content;

    const history = messages;
    const withUser: ChatMessage[] = [
      ...history,
      { role: "user", blocks: [{ type: "text", text: content }] },
    ];
    setMessages(withUser);
    setInput("");
    setLoading(true);
    scrollToEnd();

    try {
      const blocks = await sendChat(history, content, { name: profile.name, levelDesc: profile.levelDesc });
      setMessages([...withUser, { role: "assistant", blocks }]);
    } catch {
      const errBlock: MessageBlock = {
        type: "error",
        text: "앗, 답변을 가져오지 못했어요. 네트워크를 확인하고 다시 시도해주세요.",
      };
      setMessages([...withUser, { role: "assistant", blocks: [errBlock] }]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    // h-full: 오버레이 높이에 꽉 차게 — 대화 목록은 내부에서만 스크롤.
    // 상태바는 오버레이가 상태바 아래(top:--statusbar-h)에서 시작하므로 여기서 그리지 않는다.
    <div className="phone h-full flex flex-col bg-[var(--bg-app)] text-white">
      {/* 헤더: ‹ 뒤로 · 러니(아바타+이름) · ⋯ */}
      <header className="relative flex h-[54px] items-center justify-center px-[var(--gutter)]">
        <BackButton onClick={onBack} className="absolute left-[18px]" />
        <div className="flex items-center gap-2">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--bg-elevated)]">
            <img src={runiIcon} alt="" className="h-[17px] w-[17px]" />
          </span>
          <span className="subtitle-1 text-[var(--text-strong)]">러니</span>
        </div>
        <button
          className="absolute right-[18px] grid h-[26px] w-[26px] place-items-center text-white/70"
          type="button"
          aria-label="더보기"
        >
          <span className="text-[20px] leading-none">⋯</span>
        </button>
      </header>

      {/* 대화 / 웰컴 영역 */}
      {/* overscroll-contain: 오버레이 스크롤이 밑의 페이지로 번지지 않게.
          스크롤바는 숨기되 스크롤 기능은 유지 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)] pb-[110px] pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isEmpty ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-3 pt-[60px]">
              <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[var(--bg-elevated)]">
                <img src={runiIcon} alt="" className="h-[46px] w-[46px]" />
              </span>
              <h1 className="subtitle-1 text-[var(--text-strong)]">안녕하세요, {profile.name}님!</h1>
              <p className="body-2 text-center text-white/70">
                대회 찾기부터 코스 그리기까지,
                <br />
                러닝에 관한 건 뭐든 물어보세요
              </p>
            </div>
            <div className="mt-6 flex w-full max-w-[232px] flex-col gap-2.5">
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => send(s.prompt)}
                  className="flex items-center gap-3 rounded-[18px] bg-[var(--bg-elevated)] px-4 py-3.5 text-left"
                >
                  <span className="shrink-0 text-[var(--primary-lime)]">{s.icon}</span>
                  <span className="flex-1">
                    <span className="subtitle-2 block text-[var(--text-strong)]">{s.title}</span>
                    <span className="body-3 mt-0.5 block text-white/50">{s.desc}</span>
                  </span>
                  <span className="text-white/40">›</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {messages.map((m, mi) =>
              m.blocks.map((b, bi) => (
                <li key={`${mi}-${bi}`}>
                  <ChatBlock
                    block={b}
                    role={m.role}
                    onChip={(p) => send(p)}
                    onRetry={() => send(lastPrompt.current)}
                  />
                </li>
              )),
            )}
            {loading && (
              <li>
                <ChatBlock block={{ type: "loading", label: "러니가 생각하고 있어요…" }} role="assistant" />
              </li>
            )}
          </ul>
        )}
      </div>

      {/* 입력 바 (하단 고정) */}
      <div className="fixed bottom-0 left-1/2 w-[var(--frame-width)] max-w-full -translate-x-1/2 bg-[var(--bg-app)] px-[var(--gutter)] pb-5 pt-2">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            className="body-1 h-[46px] flex-1 rounded-full bg-[var(--bg-elevated)] px-5 text-white outline-0 placeholder:text-white/40"
            placeholder="러니에게 물어보기"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-[var(--primary-lime)] text-black disabled:opacity-40"
            aria-label="보내기"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
