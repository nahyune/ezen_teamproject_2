import { useEffect, useRef, useState } from "react";
import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconBell from "../assets/icons/header-bell.svg";
import iconSettings from "../assets/icons/header-settings.svg";
import { myRecords } from "../data";
import "./TopBars.css";

/**
 * 상태바 영역 — 화면 폭에 따라 다르게 동작하는 공통 컴포넌트.
 * 앱의 각 셸(.phone / 온보딩 셸) 최상단에서 이것 하나만 렌더한다.
 * - 모바일(<md, 768px): 실제 기기 상태바/노치 영역만 env(safe-area-inset-top)로
 *   확보하고 가짜 바는 숨긴다. (실기기의 진짜 상태바와 이중으로 겹치지 않도록)
 * - 테블릿+ (≥md): 폰 목업처럼 보이도록 가짜 상태바(시간·배터리)를 표시한다.
 * ※ env()가 값을 가지려면 index.html viewport 메타에 viewport-fit=cover 필요.
 */
export function StatusBarArea() {
  return (
    <div className="sticky top-0 z-[95] bg-inherit">
      <div
        className="md:hidden"
        style={{ height: "env(safe-area-inset-top, 0px)" }}
        aria-hidden
      />
      <div className="hidden md:block">
        <StatusBar />
      </div>
    </div>
  );
}

// 분이 바뀌는 순간에 맞춰 갱신하는 실제 시계 (매초 setInterval 대신 다음 분까지만 대기)
function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: number;
    const tick = () => {
      setNow(new Date());
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000));
    return () => window.clearTimeout(timer);
  }, []);

  return now;
}

export function StatusBar() {
  const now = useClock();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="statusbar">
      <span className="statusbar__time">{time}</span>
      <div className="statusbar__right" aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path
            d="M8.5 11.5l7.6-7.9a10.7 10.7 0 00-15.2 0l7.6 7.9z"
            fill="currentColor"
          />
        </svg>
        <div className="statusbar__battery">
          <div className="statusbar__battery-fill" />
        </div>
      </div>
    </div>
  );
}

type AppHeaderProps = {
  variant?: "default" | "settings" | "feed";
  onLogoClick?: () => void;
  onSettingsClick?: () => void;
  onChatbotClick?: () => void;
  onCreatePostClick?: () => void;
  onCreateStoryClick?: () => void;
};

const feedActivities = [
  {
    id: 1,
    message: "김러너님이 좋아요를 눌렀습니다.",
    time: "3분 전",
    image: myRecords[0].image,
  },
  {
    id: 2,
    message: "러너_준님이 게시물을 공유했습니다.",
    time: "18분 전",
    image: myRecords[1].image,
  },
  {
    id: 3,
    message: '메이브님이 "오늘도 멋져요!" 댓글을 달았습니다.',
    time: "32분 전",
    image: myRecords[3].image,
  },
  {
    id: 4,
    message: "pace_kim님이 좋아요를 눌렀습니다.",
    time: "1시간 전",
    image: myRecords[4].image,
  },
];

export function AppHeader({
  variant = "default",
  onLogoClick,
  onSettingsClick,
  onChatbotClick,
  onCreatePostClick,
  onCreateStoryClick,
}: AppHeaderProps) {
  const [feedPanel, setFeedPanel] = useState<"create" | "activity" | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!feedPanel) return;

    const closePanel = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setFeedPanel(null);
    };

    document.addEventListener("pointerdown", closePanel);
    return () => document.removeEventListener("pointerdown", closePanel);
  }, [feedPanel]);

  useEffect(() => setFeedPanel(null), [variant]);

  return (
    <header ref={headerRef} className="appheader">
      <button type="button" className="appheader__logo" aria-label="홈으로 이동" onClick={onLogoClick}>
        <img className="appheader__logo-w" src={logoW} alt="" />
        <span className="appheader__logo-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <img className="appheader__logo-run" src={logoRun} alt="" />
      </button>
      {variant === "settings" ? (
        <button type="button" aria-label="설정" onClick={onSettingsClick}>
          <img className="appheader__icon" src={iconSettings} alt="" />
        </button>
      ) : variant === "feed" ? (
        <div className="appheader__actions">
          <button
            type="button"
            aria-label="만들기 메뉴"
            aria-expanded={feedPanel === "create"}
            onClick={() => setFeedPanel((panel) => (panel === "create" ? null : "create"))}
          >
            <svg className="appheader__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="내 게시물 활동"
            aria-expanded={feedPanel === "activity"}
            onClick={() => setFeedPanel((panel) => (panel === "activity" ? null : "activity"))}
          >
            <svg className="appheader__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 20.5C12 20.5 4.5 15.4 4.5 10 4.5 7.5 6.5 5.6 8.7 5.6c1.5 0 2.7.8 3.3 1.9.6-1.1 1.8-1.9 3.3-1.9 2.2 0 4.2 1.9 4.2 4.4 0 5.4-7.5 10.5-7.5 10.5z"
                stroke="#f5f5f7"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {feedPanel === "create" && (
            <div className="absolute right-[42px] top-[46px] z-[110] w-[176px] overflow-hidden rounded-[8px] border border-white/10 bg-[#1c1c1f] py-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.5)]">
              <button
                type="button"
                className="flex h-11 w-full items-center gap-3 px-3.5 text-[14px] font-normal text-white hover:bg-white/7"
                onClick={() => {
                  setFeedPanel(null);
                  onCreatePostClick?.();
                }}
              >
                <svg className="h-[19px] w-[19px] flex-none" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m6.5 16 4-4 3 3 2-2 2.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="16.5" cy="8.5" r="1.4" fill="currentColor" />
                </svg>
                <span>게시물 올리기</span>
              </button>
              <button
                type="button"
                className="flex h-11 w-full items-center gap-3 px-3.5 text-[14px] font-normal text-white hover:bg-white/7"
                onClick={() => {
                  setFeedPanel(null);
                  onCreateStoryClick?.();
                }}
              >
                <svg className="h-[19px] w-[19px] flex-none" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>스토리 올리기</span>
              </button>
            </div>
          )}
          {feedPanel === "activity" && (
            <section className="absolute right-0 top-[46px] z-[110] w-[360px] max-w-[calc(100vw-36px)] overflow-hidden rounded-[8px] border border-white/10 bg-[#111113] shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
              <div className="border-b border-white/8 px-4 py-3.5">
                <h2 className="text-[17px] font-semibold text-white">내 게시물 활동</h2>
              </div>
              <ul className="max-h-[410px] overflow-y-auto py-1.5">
                {feedActivities.map((activity) => (
                  <li key={activity.id} className="flex min-h-[72px] items-center gap-3 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-normal leading-[1.45] text-white">{activity.message}</p>
                      <p className="mt-1 text-[12px] font-normal text-white/45">{activity.time}</p>
                    </div>
                    {activity.image && (
                      <img
                        src={activity.image}
                        alt=""
                        className="h-[52px] w-[52px] flex-none rounded-[4px] object-cover"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      ) : (
        <div className="appheader__actions">
          <button type="button" aria-label="챗봇" onClick={onChatbotClick}>
            <img className="appheader__icon" src={iconChatbot} alt="" />
          </button>
          <button type="button" aria-label="알림">
            <img className="appheader__icon" src={iconBell} alt="" />
          </button>
        </div>
      )}
    </header>
  );
}
