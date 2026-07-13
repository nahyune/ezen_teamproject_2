import { useRef } from "react";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconSparkle from "../assets/icons/sparkle.svg";
import runMapImg from "../assets/img/run-map.png";
import MusicPlayerBar from "./MusicPlayerBar";
import { ChevronLeft } from "./Icons";

const HOLD_MS = 800; // "길게 눌러 종료" 판정 시간

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex w-27.5 flex-col items-center gap-1">
      <span className="font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap text-white">
        {value}
      </span>
      <span className="text-[16px] leading-[1.3] tracking-[-0.48px] text-[#b1b1b1]">
        {label}
      </span>
    </div>
  );
}

type Props = {
  seconds: number;
  onResume: () => void;
  onEnd?: () => void;
  onBack?: () => void;
  onMusicConnect?: () => void;
  musicConnected?: boolean;
};

// ── 기록 — 일시정지 (Figma 411:5468) ────────────────────────
// 러닝/지도 화면에서 일시정지 버튼을 누르면 나오는 화면.
// 종료 버튼은 길게 눌러야(HOLD_MS) 동작하고, 재개는 바로 이전 뷰로 돌아간다.
export default function PausedRunPage({
  seconds,
  onResume,
  onEnd,
  onBack,
  onMusicConnect,
  musicConnected,
}: Props) {
  const holdTimer = useRef<number | null>(null);

  const startHold = () => {
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      onEnd?.();
    }, HOLD_MS);
  };
  const cancelHold = () => {
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  return (
    <div className="relative flex-1 bg-[#1b1b1b]">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="absolute top-[18px] left-[18px] z-10 grid h-6 w-6 shrink-0 place-items-center text-white"
      >
        <ChevronLeft size={24} />
      </button>
      {/* 상단 지도 스트립 (달리던 코스 + 현재 위치) */}
      <div className="relative h-69.25 w-full overflow-hidden">
        <img
          className="h-full w-full object-cover object-[center_30%]"
          src={runMapImg}
          alt=""
          aria-hidden
        />
        {/* Top gradient so the back button stays legible over the map */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
        <img
          className="absolute top-31.5 left-47.25 size-6"
          src={iconSparkle}
          alt=""
          aria-hidden
        />
      </div>

      {/* 6개 스탯 그리드 (2행 × 3열) */}
      <div className="absolute top-79.25 left-10 flex w-87.5 flex-col gap-8">
        <div className="flex items-start justify-between">
          <Stat value="3.42" label="킬로미터" />
          <Stat value={`5'30"`} label="평균 페이스" />
          <Stat value={formatTime(seconds)} label="시간" />
        </div>
        <div className="flex items-start justify-between">
          <Stat value="248" label="칼로리" />
          <Stat value="12m" label="고도" />
          <Stat value="156" label="BPM" />
        </div>
      </div>

      {/* 챗봇 · 종료/재개 · 음악 연결하기 */}
      <button
        type="button"
        className="absolute bottom-82.25 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-black"
        aria-label="AI 챗봇"
      >
        <img className="size-6" src={iconChatbot} alt="" />
      </button>

      <div className="absolute bottom-44 left-1/2 flex -translate-x-1/2 gap-16.5">
        <div className="flex flex-col items-center gap-3.75">
          <button
            type="button"
            className="grid size-24 place-items-center rounded-full bg-black active:scale-[0.97]"
            aria-label="길게 눌러 종료"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
          >
            <span className="size-5.75 rounded-xs bg-white" />
          </button>
          <p className="text-[14px] leading-[1.3] tracking-[-0.42px] text-[#b1b1b1]">
            길게 눌러 종료
          </p>
        </div>
        <div className="flex flex-col items-center gap-3.75">
          <button
            type="button"
            className="grid size-24 place-items-center rounded-full bg-primary-lime active:scale-[0.97]"
            aria-label="이어서 달리기"
            onClick={onResume}
          >
            <svg width={22} height={26} viewBox="0 0 22 26" fill="none" aria-hidden>
              <path d="M1 1v24l20-12L1 1z" fill="#000" />
            </svg>
          </button>
          <p className="text-[14px] leading-[1.3] tracking-[-0.42px] text-[#b1b1b1]">
            이어서 달리기
          </p>
        </div>
      </div>

      {musicConnected ? (
        <MusicPlayerBar className="absolute bottom-17.25 left-1/2 -translate-x-1/2" />
      ) : (
        <button
          type="button"
          className="absolute bottom-17.25 left-1/2 h-16.75 w-87.5 max-w-[calc(100%-36px)] -translate-x-1/2 rounded-lg bg-black text-[18px] leading-[1.3] tracking-[-0.54px] text-white"
          onClick={onMusicConnect}
        >
          음악 연결하기
        </button>
      )}
    </div>
  );
}
