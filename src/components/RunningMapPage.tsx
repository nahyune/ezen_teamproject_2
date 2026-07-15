import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconSparkle from "../assets/icons/sparkle.svg";
import runMapImg from "../assets/img/run-map.png";
import MusicPlayerBar from "./MusicPlayerBar";

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

// 지도 위라 스탯 라벨까지 전부 흰색 (러닝 화면은 라벨이 회색)
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-white">
      <span className="font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap">
        {value}
      </span>
      <span className="text-[16px] leading-[1.3] tracking-[-0.48px]">{label}</span>
    </div>
  );
}

type Props = {
  seconds: number;
  paused: boolean;
  onTogglePause: () => void;
  onBack: () => void;
  onMusicConnect?: () => void;
  musicConnected?: boolean;
  onChatbot?: () => void;
};

// ── 기록 — 지도(음악x) (Figma 411:5420) ─────────────────────
// 러닝 화면에서 코스 칩을 누르면 나오는 지도 뷰. 타이머 상태는
// RunningPage가 소유하므로 지도를 보는 동안에도 초가 계속 오른다.
// 위치 값은 시안 좌표에서 상태바(47px)를 뺀 기준.
export default function RunningMapPage({
  seconds,
  paused,
  onTogglePause,
  onBack,
  onMusicConnect,
  musicConnected,
  onChatbot,
}: Props) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* 지도 배경 + 상하 스크림 */}
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={runMapImg}
        alt=""
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.83) 0.96%, rgba(0,0,0,0.664) 9.13%, rgba(80,80,80,0.486) 21.15%, rgba(160,160,160,0.308) 32.69%, rgba(255,255,255,0) 57.69%, rgba(128,128,128,0.506) 76.92%, rgba(64,64,64,0.747) 87.02%, rgba(0,0,0,0.83) 100%)",
        }}
      />

      {/* 뒤로가기 (러닝 화면으로) */}
      <button
        type="button"
        className="absolute top-11.5 left-3.5 grid size-7.5 place-items-center text-white"
        aria-label="뒤로가기"
        onClick={onBack}
      >
        <svg width={12} height={22} viewBox="0 0 12 22" fill="none" aria-hidden>
          <path
            d="M11 1L1 11l10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 진행 거리 / 목표 거리 */}
      <p className="absolute top-9.25 left-17.25 flex items-baseline gap-1.5 leading-[0.95] whitespace-nowrap">
        <span className="font-display text-[48px] text-primary-lime">3.42</span>
        <span className="text-[32px] text-[#b1b1b1]">/8km</span>
      </p>

      {/* 시간 · 평균 페이스 · BPM — 러닝 화면과 같은 숫자가 이어진다 */}
      <div className="absolute top-27.75 left-1/2 flex -translate-x-1/2 items-start gap-11">
        <Stat value={formatTime(seconds)} label="시간" />
        <Stat value={`5'30"`} label="평균 페이스" />
        <Stat value="156" label="BPM" />
      </div>

      {/* 현재 위치 마커 — 피그마와 같은 링 달린 마커 */}
      <img
        className="absolute top-[42%] left-[40%] size-6"
        src={iconSparkle}
        alt=""
        aria-hidden
      />

      {/* 챗봇 · 일시정지 */}
      <div className="absolute bottom-43 left-1/2 flex -translate-x-1/2 flex-col items-center gap-5">
        <button
          type="button"
          className="grid size-13 place-items-center rounded-full bg-black shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          aria-label="AI 챗봇"
          onClick={onChatbot}
        >
          <img className="size-6" src={iconChatbot} alt="" />
        </button>
        <button
          type="button"
          className="grid size-30 place-items-center rounded-full border-2 border-primary-lime bg-black active:scale-[0.97]"
          aria-label={paused ? "재개" : "일시정지"}
          onClick={onTogglePause}
        >
          {paused ? (
            <svg width={22} height={26} viewBox="0 0 22 26" fill="none" aria-hidden>
              <path d="M1 1v24l20-12L1 1z" fill="#fff" />
            </svg>
          ) : (
            <svg width={19} height={26} viewBox="0 0 19 26" fill="none" aria-hidden>
              <rect x="0" y="0" width="7" height="26" rx="2" fill="#fff" />
              <rect x="12" y="0" width="7" height="26" rx="2" fill="#fff" />
            </svg>
          )}
        </button>
      </div>

      {musicConnected ? (
        <MusicPlayerBar onMap className="absolute bottom-17 left-1/2 -translate-x-1/2" />
      ) : (
        <button
          type="button"
          className="absolute bottom-16.25 left-1/2 h-16.75 w-87.5 max-w-[calc(100%-36px)] -translate-x-1/2 rounded-lg bg-black text-[18px] leading-[1.3] tracking-[-0.54px] text-white"
          onClick={onMusicConnect}
        >
          음악 연결하기
        </button>
      )}
    </div>
  );
}
