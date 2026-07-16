import { useEffect, useRef, useState } from "react";
import { attachDragScroll } from "../dragScroll";
import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import iconBell from "../assets/icons/header-bell.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconBulb from "../assets/icons/bulb.svg";
import iconSparkle from "../assets/icons/sparkle.svg";
import dogCourseImg from "../assets/img/dog_course.webp";
import recordCourseImg from "../assets/img/record-course.png";
import namsanHeartImg from "../assets/img/namsan_heart.avif";
import MapBackdrop from "./MapBackdrop";
import BottomNav from "./BottomNav";

const recommendedCourses = [
  {
    id: 1,
    title: "광화문 댕댕런(8.7km)",
    desc: "북촌 돌담길을 따라 달리며\n강아지 모양 GPS 드로잉 완성!",
    duration: "35분",
    image: dogCourseImg,
    detailKey: "courseDetail:gwanghwamun",
  },
  {
    id: 2,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
    detailKey: "courseDetail:yeouidoGoguma",
  },
  {
    id: 3,
    title: "남산 하트런(8.8km)",
    desc: "남산 순환로를 한 바퀴 돌며\n하트 모양 GPS 드로잉에 도전!",
    duration: "53분",
    image: namsanHeartImg,
    detailKey: "courseDetail:namsanHeart",
  },
];

const fabClass =
  "grid size-13 place-items-center rounded-full bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.35)]";

function MusicIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={22}
      viewBox="0 0 16.0001 17.9281"
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.3">
        <path
          d="M2.80769 17.4281C4.0822 17.4281 5.11538 16.2473 5.11538 14.7907C5.11538 13.3342 4.0822 12.1534 2.80769 12.1534C1.53319 12.1534 0.5 13.3342 0.5 14.7907C0.5 16.2473 1.53319 17.4281 2.80769 17.4281Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.1923 14.1314C14.4668 14.1314 15.5 12.9506 15.5 11.4941C15.5 10.0375 14.4668 8.85669 13.1923 8.85669C11.9178 8.85669 10.8846 10.0375 10.8846 11.4941C10.8846 12.9506 11.9178 14.1314 13.1923 14.1314Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 11.4941V1.15564C15.4995 1.05475 15.4788 0.955341 15.4393 0.865056C15.4 0.774771 15.343 0.696025 15.2727 0.634881C15.2025 0.573736 15.121 0.531823 15.0343 0.512371C14.9477 0.492919 14.8583 0.496445 14.7731 0.522678L5.54231 3.45015C5.42032 3.48769 5.3125 3.56994 5.23537 3.68428C5.15825 3.79864 5.11609 3.93875 5.11538 4.08312V14.7909"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.11538 7.53801L15.5 4.2413"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function RecordPage({
  onGuideOpen,
  onStart,
  onChatbot,
  onNavigate,
  onMusicOpen,
  musicConnected = false,
}: {
  onGuideOpen?: () => void;
  onStart?: () => void;
  onChatbot?: () => void;
  onNavigate?: (key: string) => void;
  onMusicOpen?: () => void;
  musicConnected?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const middle = row.children[Math.floor(row.children.length / 2)] as HTMLElement | undefined;
    if (middle) {
      row.scrollLeft = middle.offsetLeft + middle.offsetWidth / 2 - row.clientWidth / 2;
    }

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

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-52.5 bottom-0 z-0 overflow-hidden [transform:translateZ(0)] md:rounded-b-[42px]">
        <MapBackdrop />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.7)_60%,rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-35 bg-linear-to-b from-black from-19% to-black/0" />
      </div>

      <header className="relative z-1 mb-3 mt-[calc(var(--statusbar-h)+12px)] flex h-13 items-center justify-between px-4.5">
        <div className="flex items-center">
          <button
            type="button"
            className="flex h-[21.6px] items-center gap-[4.6px]"
            aria-label="홈으로 이동"
            onClick={() => onNavigate?.("home")}
          >
            <img className="h-[21.44px] w-[17.1px]" src={logoW} alt="" />
            <span className="flex h-5.25 flex-col justify-between py-[0.3px]" aria-hidden>
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

        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-3.75 overflow-x-auto px-12.5 [&.dragging]:snap-none"
          ref={rowRef}
        >
          {recommendedCourses.map((c, i) => {
            const openDetail = () => {
              if (c.detailKey) onNavigate?.(c.detailKey);
            };
            return (
            <article
              key={c.id}
              role={c.detailKey ? "button" : undefined}
              tabIndex={c.detailKey && i === activeIdx ? 0 : undefined}
              aria-label={c.detailKey ? `${c.title} 자세히보기` : undefined}
              onClick={() => {
                if (i === activeIdx) openDetail();
              }}
              onKeyDown={(event) => {
                if (i === activeIdx && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  openDetail();
                }
              }}
              className={`relative flex h-35 w-82.5 flex-none snap-center flex-col items-center justify-center overflow-hidden rounded-card border border-white/15 bg-elevated/35 px-[18px] py-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md backdrop-saturate-140 transition-[filter,scale] duration-250 ease-[ease] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-br before:from-white/10 before:via-white/2 before:to-transparent ${
                i === activeIdx ? (c.detailKey ? "cursor-pointer" : "") : "scale-93 blur-[2px]"
              }`}
            >
              <div className="flex items-end justify-center gap-[50px]">
                <div className="flex w-44 flex-col items-start gap-2">
                  <div className="flex w-full flex-col items-start gap-2.5">
                    <div className="relative flex w-full items-start gap-2.5">
                      <p className="text-[20px] font-medium leading-[1.3] tracking-[-0.6px] whitespace-nowrap">
                        {c.title}
                      </p>
                      <button
                        type="button"
                        onClick={openDetail}
                        className={`absolute left-[222.5px] top-1/2 flex -translate-y-1/2 items-center justify-center text-[14px] leading-[1.3] tracking-[-0.42px] whitespace-nowrap text-white/70 ${
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
                    </div>
                    <p className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] whitespace-pre-line text-white/70">
                      {c.desc}
                    </p>
                  </div>
                  <p className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-white/50">
                    {c.duration}
                  </p>
                </div>
                {c.image ? (
                  <img
                    className="h-15.75 w-16 flex-none rounded-[15px] object-cover"
                    src={c.image}
                    alt={c.title}
                  />
                ) : (
                  <div className="h-15.75 w-16 flex-none rounded-[15px] bg-white/10" />
                )}
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <div className="absolute bottom-37.5 left-1/2 z-2 flex -translate-x-1/2 flex-col items-center">
        <p className="relative mb-6.25 w-66.75 animate-bubble-float rounded-[15px] bg-elevated/70 px-2.5 py-3.25 text-center text-[14px] font-medium tracking-[-0.42px] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-b-0 after:border-transparent after:border-t-15 after:border-t-elevated/70">
          러닝하기 딱 좋은 날이에요!
          <br />
          다른 코스를 원하시면 저에게 알려주세요.
        </p>

        <button type="button" className={`${fabClass} mb-7.5`} aria-label="AI 챗봇" onClick={onChatbot}>
          <img className="size-6" src={iconChatbot} alt="" />
        </button>

        <img className="absolute top-38.75 left-60 size-4" src={iconSparkle} alt="" aria-hidden />

        <div className="flex items-center gap-10">
          <button type="button" className={fabClass} aria-label="러닝 가이드" onClick={onGuideOpen}>
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
            aria-label={musicConnected ? "음악 연결됨" : "음악"}
            aria-pressed={musicConnected}
            onClick={onMusicOpen}
          >
            <MusicIcon className={musicConnected ? "text-primary-lime" : "text-white"} />
          </button>
        </div>
      </div>

      <BottomNav active="record" onNavigate={onNavigate} />
    </div>
  );
}
