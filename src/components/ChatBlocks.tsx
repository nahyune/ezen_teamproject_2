// 챗봇 메시지 블록 렌더러 — chatTypes의 MessageBlock 종류별 UI.
// 목업 "챗봇 01~09" 기준. 색·간격은 index.css 토큰 사용.
import type { MessageBlock, RaceCard } from "../lib/chatTypes";
import runiIcon from "../assets/icons/icon-chatbot.svg";

/* 러니 아바타 (봇 말풍선 왼쪽) */
function RuniAvatar({ size = 30 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border-[0.75px] border-[#d4ff3f] bg-[#232323]"
      style={{ width: size, height: size }}
    >
      <img src={runiIcon} alt="" style={{ width: size * 0.56, height: size * 0.56 }} />
    </span>
  );
}

/* 봇/유저 텍스트 말풍선 */
function TextBubble({ text, role }: { text: string; role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <p className="chat-body max-w-[80%] rounded-2xl bg-[#d4ff3f] px-4 py-2.5 text-[#0f120c]">
          {text}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <RuniAvatar />
      <p className="chat-body max-w-[80%] rounded-2xl bg-[#e6e6e6] px-4 py-2.5 text-[#232323]">
        {text}
      </p>
    </div>
  );
}

/* 대회/크루 가로 카드 로우 (목업 03·09)
   - race: 큰 D-day 뱃지 (하단, 사진 위)
   - crew: "모집중" 작은 태그 (상단 좌측) */
function CardRow({
  items,
  variant,
  onChip,
}: {
  items: RaceCard[];
  variant: "race" | "crew";
  onChip?: (p: string) => void;
}) {
  return (
    // 화면 양끝까지 뚫는 가로스크롤 대신, 채팅 여백(18px) 안에서 두 장을 반반 나눠
    // 가운데 배치 — 프레임 베젤 때문에 오른쪽 카드가 잘리던 문제 해결.
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((c) => (
        <button
          key={c.title}
          type="button"
          onClick={() => onChip?.(`${c.title} 자세히 알려줘`)}
          className="w-full overflow-hidden rounded-[18px] bg-[#232323] text-left"
        >
          <div className="relative h-[88px] bg-[#2c2c30]">
            {c.image && (
              <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            {/* 텍스트 가독성용 하단 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            {c.badge &&
              (variant === "race" ? (
                // 대회: 큰 D-day 뱃지 (하단 좌측)
                <span className="font-display absolute bottom-2.5 left-3 text-[30px] leading-none text-[#d4ff3f]">
                  {c.badge}
                </span>
              ) : (
                // 크루: 작은 "모집중" 태그 (상단 좌측)
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-2 py-1 text-[14px] font-medium leading-none text-[#d4ff3f]">
                  {c.badge}
                </span>
              ))}
          </div>
          <div className="flex flex-col gap-1 px-3 pb-3 pt-2.5">
            <span className="subtitle-2 text-[#f5f4f2]">{c.title}</span>
            {c.meta && <span className="body-3 text-white/60">{c.meta}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

/* 지도 코스 카드 (목업 06) */
function MapCard({ title, meta, image }: { title: string; meta?: string; image?: string }) {
  return (
    <div className="ml-[38px] overflow-hidden rounded-[18px] bg-[#232323]">
      <div className="grid h-[150px] place-items-center bg-[#2c2c30]">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="body-3 text-white/40">지도 미리보기</span>
        )}
      </div>
      <div className="flex flex-col gap-1 px-4 py-3">
        <span className="subtitle-2 text-[#f5f4f2]">{title}</span>
        {meta && <span className="body-3 text-white/60">{meta}</span>}
      </div>
    </div>
  );
}

/* 진행 배너 (목업 04 회고 인터뷰) */
function ProgressBar({ title, step, total }: { title: string; step: number; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="body-3 text-[#232323]">📖 {title}</span>
        <span className="body-3 text-[#777]">
          {step} / {total}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#e6e6e6]">
        <div
          className="h-full rounded-full bg-[#d4ff3f]"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* 케어/경고 카드 (목업 07 무리 말리기) */
function CareCard({
  text,
  stats,
}: {
  text: string;
  stats?: { label: string; value: string; warn?: boolean }[];
}) {
  return (
    <div className="flex items-start gap-2">
      <RuniAvatar />
      <div className="flex max-w-[85%] flex-col gap-2.5 rounded-2xl bg-[#e6e6e6] px-4 py-3">
        <p className="chat-body text-[#232323]">⚠️ {text}</p>
        {stats && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {stats.map((s) => (
              <span key={s.label} className="body-3 text-[#777]">
                {s.label}{" "}
                <b className={s.warn ? "text-[var(--primary-orange)]" : "text-[#232323]"}>
                  {s.value}
                </b>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 에러 + 재시도 (목업 08) */
function ErrorBubble({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-2">
      <RuniAvatar />
      <div className="flex max-w-[85%] flex-col items-start gap-2">
        <p className="chat-body rounded-2xl bg-[#e6e6e6] px-4 py-2.5 text-[#232323]">
          {text}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="btn-text rounded-full bg-[#d4ff3f] px-4 py-2 text-[#0f120c]"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

/* 칩 로우 (퀵리플) — 봇 답변 밑 알약 버튼들 */
function ChipRow({
  items,
  onChip,
}: {
  items: { label: string; prompt: string }[];
  onChip?: (p: string) => void;
}) {
  return (
    <div className="ml-[38px] flex flex-wrap gap-2">
      {items.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => onChip?.(c.prompt)}
          className="subtitle-2 rounded-full bg-[#232323] px-3.5 py-2 text-[#d4ff3f]"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

/* 로딩 (Typing) — 목업 02 */
function TypingBubble({ label }: { label?: string }) {
  return (
    <div className="flex items-start gap-2">
      <RuniAvatar />
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1 rounded-2xl bg-[#e6e6e6] px-4 py-3.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4ff3f]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
        {label && <span className="body-3 pl-1 text-[#777]">{label}</span>}
      </div>
    </div>
  );
}

/** 단일 블록 렌더 */
export function ChatBlock({
  block,
  role,
  onChip,
  onRetry,
}: {
  block: MessageBlock;
  role: "user" | "assistant";
  onChip?: (prompt: string) => void;
  onRetry?: () => void;
}) {
  switch (block.type) {
    case "text":
      return <TextBubble text={block.text} role={role} />;
    case "chips":
      return <ChipRow items={block.items} onChip={onChip} />;
    case "cards":
      return <CardRow items={block.items} variant={block.variant} onChip={onChip} />;
    case "mapCard":
      return <MapCard title={block.title} meta={block.meta} image={block.image} />;
    case "progress":
      return <ProgressBar title={block.title} step={block.step} total={block.total} />;
    case "careCard":
      return <CareCard text={block.text} stats={block.stats} />;
    case "error":
      return <ErrorBubble text={block.text} onRetry={onRetry} />;
    case "loading":
      return <TypingBubble label={block.label} />;
    default:
      return null;
  }
}
