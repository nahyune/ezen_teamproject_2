import { useEffect, useRef, useState } from "react";
import { attachDragScroll } from "../dragScroll";
import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import iconBell from "../assets/icons/header-bell.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconBulb from "../assets/icons/bulb.svg";
import iconMusic from "../assets/icons/music.svg";
import iconSparkle from "../assets/icons/sparkle.svg";
import recordCourseImg from "../assets/img/record-course.png";
import recordMapImg from "../assets/img/record-map.png";
import { BackButton } from "./Icons";
import MusicConnectPage from "./MusicConnectPage";

const recommendedCourses = [
  {
    id: 1,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
  },
  {
    id: 2,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
  },
  {
    id: 3,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
  },
];

// 플로팅 원형 버튼(챗봇/가이드/음악) 공통 스타일
const fabClass =
  "grid size-13 place-items-center rounded-full bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.35)]";

export default function RecordPage({
  onGuideOpen,
  onStart,
  onBack,
  onChatbot,
}: {
  onGuideOpen?: () => void;
  onStart?: () => void;
  onBack?: () => void;
  onChatbot?: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [musicOpen, setMusicOpen] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    // Start on the middle card so neighbours peek in from both edges.
    const middle = row.children[Math.floor(row.children.length / 2)] as
      | HTMLElement
      | undefined;
    if (middle) {
      row.scrollLeft = middle.offsetLeft + middle.offsetWidth / 2 - row.clientWidth / 2;
    }

    // Mark the card closest to the carousel center as active (focused).
    const update = () => {
      const center = row.scrollLeft + row.clientWidth / 2;
      const cards = Array.from(row.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIdx(best);
    };

    update();
    row.addEventListener("scroll", update, { passive: true });
    const detachDrag = attachDragScroll(row);
    return () => {
      row.removeEventListener("scroll", update);
      detachDrag();
    };
  }, []);

  if (musicOpen) {
    return (
      <MusicConnectPage
        onClose={() => setMusicOpen(false)}
        onConnect={() => setMusicOpen(false)}
      />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Map backdrop: fades in from black at the top, dark vignette at the edges */}
      <div
        className="pointer-events-none absolute inset-x-0 top-52.5 bottom-0 z-0 bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_50%_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.7)_60%,rgba(0,0,0,0.85)_100%)] after:absolute after:inset-x-0 after:top-0 after:h-35 after:bg-linear-to-b after:from-black after:from-19% after:to-black/0"
        style={{ backgroundImage: `url(${recordMapImg})` }}
        aria-hidden
      />

      {/* 상단 여백 = 상태바 높이 + 기존 12px (배경 맵은 그대로 풀블리드, UI만 상태바 아래로) */}
      <header className="relative z-1 mb-3 mt-[calc(var(--statusbar-h)+12px)] flex h-13 items-center justify-between px-4.5">
        <div className="flex items-center">
          <BackButton onClick={onBack} label="홈으로 가기" className="mr-3" />
          <button
            type="button"
            className="flex h-[21.6px] items-center gap-[4.6px]"
            aria-label="홈으로 이동"
            onClick={onBack}
          >
            <img className="h-[21.44px] w-[17.1px]" src={logoW} alt="" />
            {/* The lime ":" rendered as three stacked dots, per the Figma logo */}
            <span
              className="flex h-5.25 flex-col justify-between py-[0.3px]"
              aria-hidden
            >
              <i className="block h-[3.64px] w-[4.42px] bg-primary-lime" />
              <i className="block h-[3.64px] w-[4.42px] bg-primary-lime" />
              <i className="block h-[3.64px] w-[4.42px] bg-primary-lime" />
            </span>
            <img className="h-[21.64px] w-[34.23px]" src={logoRun} alt="" />
          </button>
        </div>
        <button type="button" aria-label="알림">
          <img className="size-6" src={iconBell} alt="" />
        </button>
      </header>

      <section className="relative z-1 mt-7 flex flex-col gap-3.75">
        <header className="flex flex-col gap-1 px-4.5">
          <h2 className="text-[24px] font-semibold tracking-[-0.48px]">러닝</h2>
          <p className="text-[14px] leading-[1.3] tracking-[-0.42px]">
            AI 맞춤 추천 코스
          </p>
        </header>

        {/* side padding centers a card and lets neighbours peek at the edges;
            snapping fights the 1:1 drag tracking, so pause it while dragging */}
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-3.75 overflow-x-auto px-12.5 [&.dragging]:snap-none"
          ref={rowRef}
        >
          {recommendedCourses.map((c, i) => (
            <article
              key={c.id}
              className={`relative flex h-35 w-82.5 flex-none snap-center items-center gap-3.5 overflow-hidden rounded-card border border-white/15 bg-elevated/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md backdrop-saturate-140 transition-[filter,scale] duration-250 ease-[ease] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-br before:from-white/10 before:via-white/2 before:to-transparent pt-5.5 pr-4.5 pb-5.75 pl-4.25 ${
                i === activeIdx ? "" : "scale-93 blur-[2px]"
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[20px] font-medium leading-[1.3] tracking-[-0.6px]">
                  {c.title}
                </p>
                <p className="mt-2.5 text-[14px] tracking-[-0.42px] whitespace-pre-line text-white/70">
                  {c.desc}
                </p>
                <p className="mt-2 text-[14px] tracking-[-0.42px] text-white/50">
                  {c.duration}
                </p>
              </div>
              <button
                type="button"
                className={`absolute top-5 right-4.5 flex items-center text-[14px] tracking-[-0.42px] text-white/70 ${
                  i === activeIdx ? "visible" : "invisible"
                }`}
              >
                자세히보기
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <img
                className="h-15.75 w-16 flex-none translate-y-5 rounded-[15px] object-cover"
                src={c.image}
                alt={c.title}
              />
            </article>
          ))}
        </div>
      </section>

      <div className="absolute bottom-37.5 left-1/2 z-2 flex -translate-x-1/2 flex-col items-center">
        {/* 말풍선: 아래 25px 여백은 15px 꼬리 + 10px 간격 몫 */}
        <p className="relative mb-6.25 w-66.75 rounded-[15px] bg-elevated/70 px-2.5 py-3.25 text-center text-[14px] font-medium tracking-[-0.42px] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-b-0 after:border-transparent after:border-t-15 after:border-t-elevated/70">
          러닝하기 딱 좋은 날이에요!
          <br />
          다른 코스를 원하시면 저에게 알려주세요.
        </p>

        <button type="button" className={`${fabClass} mb-7.5`} aria-label="AI 챗봇" onClick={onChatbot}>
          <img className="size-6" src={iconChatbot} alt="" />
        </button>

        {/* sits between the chatbot button and the start button, right side */}
        <img
          className="absolute top-38.75 left-60 size-6"
          src={iconSparkle}
          alt=""
          aria-hidden
        />

        <div className="flex items-center gap-10">
          <button
            type="button"
            className={fabClass}
            aria-label="러닝 가이드"
            onClick={onGuideOpen}
          >
            <img className="size-6" src={iconBulb} alt="" />
          </button>
          <button
            type="button"
            className="size-30 rounded-full bg-primary-lime text-[24px] font-semibold tracking-[-0.48px] text-black"
            onClick={onStart}
          >
            시작
          </button>
          <button
            type="button"
            className={fabClass}
            aria-label="음악"
            onClick={() => setMusicOpen(true)}
          >
            <img className="size-6" src={iconMusic} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
