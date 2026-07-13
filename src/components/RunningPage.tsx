import { useEffect, useState } from "react";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import RunningMapPage from "./RunningMapPage";
import MusicConnectPage from "./MusicConnectPage";
import MusicPlayerBar from "./MusicPlayerBar";
import PausedRunPage from "./PausedRunPage";
import { ChevronLeft } from "./Icons";

const START_SECONDS = 16 * 60 + 47; // 디자인 시안의 16:47부터 시작

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap text-white">
        {value}
      </span>
      <span className="text-[16px] leading-[1.3] tracking-[-0.48px] text-[#b1b1b1]">
        {label}
      </span>
    </div>
  );
}

// ── 기록 — 러닝(음악x) (Figma 411:5257) ─────────────────────
// 카운트다운이 끝나면 뜨는 측정 화면. 시간 스탯만 1초에 1씩
// 올라가고, 일시정지 버튼으로 멈췄다 재개할 수 있다.
// 세로 간격은 시안 좌표에서 상태바(47px)를 뺀 값 기준.
export default function RunningPage({ onEnd, onBack }: { onEnd?: () => void; onBack?: () => void }) {
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [paused, setPaused] = useState(false);
  const [view, setView] = useState<"stats" | "map">("stats");
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicConnected, setMusicConnected] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [paused]);

  // 지도/일시정지/음악 뷰로 바꿔도 이 컴포넌트가 유지되므로 타이머 상태가 이어진다.
  // 음악 화면을 닫으면 열기 직전 뷰(스탯/지도/일시정지)로 그대로 돌아간다.
  if (musicOpen) {
    return (
      <MusicConnectPage
        onClose={() => setMusicOpen(false)}
        onConnect={() => {
          setMusicConnected(true);
          setMusicOpen(false);
        }}
      />
    );
  }
  // 일시정지 화면: 재개하면 멈추기 직전 뷰(스탯/지도)로 돌아간다.
  if (paused) {
    return (
      <PausedRunPage
        seconds={seconds}
        onResume={() => setPaused(false)}
        onEnd={onEnd}
        onBack={onBack}
        onMusicConnect={() => setMusicOpen(true)}
        musicConnected={musicConnected}
      />
    );
  }
  if (view === "map") {
    return (
      <RunningMapPage
        seconds={seconds}
        paused={paused}
        onTogglePause={() => setPaused(true)}
        onBack={() => setView("stats")}
        onMusicConnect={() => setMusicOpen(true)}
        musicConnected={musicConnected}
      />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center bg-[#1b1b1b] pb-17.25">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="absolute top-[18px] left-[18px] z-10 grid h-6 w-6 shrink-0 place-items-center text-white"
      >
        <ChevronLeft size={24} />
      </button>
      {/* 진행 중인 코스 칩 */}
      <button
        type="button"
        className="mt-13.25 flex h-10.25 items-center gap-3.25 rounded-card bg-black px-3 py-1.5 text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white"
        onClick={() => setView("map")}
      >
        <span className="size-1.75 rounded-full bg-primary-lime" />
        여의도 고구마런 (8km)
        <svg width={7} height={12} viewBox="0 0 7 12" fill="none" aria-hidden>
          <path
            d="M1 1l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 누적 거리 */}
      <p className="mt-15.25 flex items-baseline gap-1.25 font-display leading-[1.3] whitespace-nowrap">
        <span className="text-[128px] tracking-[-2.56px] text-primary-lime">3.42</span>
        <span className="text-[36px] tracking-[-0.72px] text-[#b1b1b1]">KM</span>
      </p>

      {/* 시간 · 평균 페이스 · BPM */}
      <div className="mt-5 flex items-start justify-center gap-11">
        <Stat value={formatTime(seconds)} label="시간" />
        <Stat value={`5'30"`} label="평균 페이스" />
        <Stat value="156" label="BPM" />
      </div>

      <div className="mt-auto flex flex-col items-center gap-5">
        <button
          type="button"
          className="grid size-14 place-items-center rounded-full bg-black"
          aria-label="AI 챗봇"
        >
          <img className="size-6" src={iconChatbot} alt="" />
        </button>

        {/* 일시정지 — 라임 글로우 (Figma 0 0 32px rgba(212,255,63,0.3)) */}
        <button
          type="button"
          className="grid size-27.5 place-items-center rounded-full bg-primary-lime shadow-[0_0_32px_0_rgba(212,255,63,0.3)] active:scale-[0.97]"
          aria-label="일시정지"
          onClick={() => setPaused(true)}
        >
          <svg width={19} height={26} viewBox="0 0 19 26" fill="none" aria-hidden>
            <rect x="0" y="0" width="7" height="26" rx="2" fill="#000" />
            <rect x="12" y="0" width="7" height="26" rx="2" fill="#000" />
          </svg>
        </button>
      </div>

      {musicConnected ? (
        <MusicPlayerBar className="mt-9.75" />
      ) : (
        <button
          type="button"
          className="mt-9.75 h-16.75 w-87.5 max-w-[calc(100%-36px)] rounded-lg bg-black text-[18px] leading-[1.3] tracking-[-0.54px] text-white"
          onClick={() => setMusicOpen(true)}
        >
          음악 연결하기
        </button>
      )}
    </div>
  );
}
