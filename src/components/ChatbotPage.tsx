import { useRef, useState, type ReactNode } from "react";
import { StatusBarArea } from "./TopBars";
import { sendChat, type ChatMessage } from "../lib/chatClient";
import runiIcon from "../assets/icons/icon-chatbot.svg";

// TODO: 로그인 유저 이름으로 교체 (현재는 뼈대용 상수)
const USER_NAME = "하연";

type Suggestion = { title: string; desc: string; prompt: string; icon: ReactNode };

const suggestions: Suggestion[] = [
  {
    title: "나갈 만한 대회 찾기",
    desc: "지역·거리·날짜로 맞춤 추천",
    prompt: "이번 달에 나갈 만한 러닝 대회 추천해줘.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 13.5 7.5 21l4.5-2.5L16.5 21 15 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "GPS 아트 코스 그리기",
    desc: "오늘은 강아지 모양 어때요?",
    prompt: "GPS 아트 러닝 코스 하나 그려줘. 강아지 모양으로.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M6 20a3 3 0 0 0 3-3V9a3 3 0 0 1 6 0v6a3 3 0 0 0 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="6" cy="20" r="1.6" fill="currentColor" />
        <circle cx="18" cy="4" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "같이 뛸 크루 찾기",
    desc: "지역·페이스로 맞춤 매칭",
    prompt: "우리 동네에서 같이 뛸 러닝 크루 찾아줘.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 5.5-4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function ChatbotPage({ onBack }: { onBack?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChat(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }));
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="phone flex min-h-screen flex-col bg-[var(--bg-app)] text-white">
      <StatusBarArea />
      <header className="subheader justify-center">
        <button
          className="absolute left-[18px] top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-white"
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <img src={runiIcon} alt="" className="h-7 w-7" />
          <span className="text-[20px] font-semibold tracking-[-0.4px]">러니</span>
        </div>
        <button
          className="absolute right-[18px] top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-white/70"
          type="button"
          aria-label="더보기"
        >
          <span className="text-[22px] leading-none">···</span>
        </button>
      </header>

      {/* 대화/웰컴 영역 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-[var(--gutter)] pb-[110px]">
        {isEmpty ? (
          <div className="flex flex-col items-center pt-14 text-center">
            <img src={runiIcon} alt="" className="h-[120px] w-[120px]" />
            <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.5px]">안녕하세요, {USER_NAME}님!</h1>
            <p className="mt-2 text-[15px] leading-[1.4] text-white/60">
              대회 찾기부터 코스 그리기까지,
              <br />
              러닝에 관한 건 뭐든 물어보세요
            </p>
            <div className="mt-8 flex w-full flex-col gap-3">
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => send(s.prompt)}
                  className="flex items-center gap-4 rounded-2xl bg-[var(--bg-elevated)] px-5 py-4 text-left"
                >
                  <span className="shrink-0 text-primary-lime">{s.icon}</span>
                  <span className="flex-1">
                    <span className="block text-[16px] font-medium">{s.title}</span>
                    <span className="mt-0.5 block text-[13px] text-white/50">{s.desc}</span>
                  </span>
                  <span className="text-white/40">›</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 pt-4">
            {messages.map((m, i) => (
              <li
                key={i}
                className={
                  m.role === "user"
                    ? "max-w-[80%] self-end rounded-2xl bg-primary-lime px-4 py-2.5 text-[15px] leading-[1.45] text-black"
                    : "max-w-[85%] self-start rounded-2xl bg-[var(--bg-elevated)] px-4 py-2.5 text-[15px] leading-[1.45] text-white"
                }
              >
                {m.content}
              </li>
            ))}
            {loading && (
              <li className="max-w-[85%] self-start rounded-2xl bg-[var(--bg-elevated)] px-4 py-2.5 text-[15px] text-white/50">
                러니가 생각 중…
              </li>
            )}
          </ul>
        )}
        {error && <p className="mt-3 text-center text-[13px] text-[var(--primary-orange)]">{error}</p>}
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
            className="h-[52px] flex-1 rounded-full bg-[var(--bg-elevated)] px-5 text-[15px] text-white outline-0 placeholder:text-white/40"
            placeholder="러니에게 물어보기"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-primary-lime text-black disabled:opacity-40"
            aria-label="보내기"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
