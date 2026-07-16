import { useRef, useState } from "react";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import MusicPlayerBar from "./MusicPlayerBar";
import MapBackdrop from "./MapBackdrop";
import { BackButton } from "./Icons";
import type { MapPoint } from "./RunningMapPage";

const HOLD_MS = 800; // "길게 눌러 종료" 판정 시간
const PAUSED_RUN_LOCATION = { lat: 37.5769, lng: 126.9828 }; // 경복궁과 안국역 사이
const MAP_TOP_GRADIENT_CLASS = "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent";

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

function Stat({ value, label }: { value: string; label: string }) {
  const paceValueOffset = label === "평균 페이스" ? " translate-x-[8px]" : "";

  return (
    <div className="flex w-27.5 flex-col items-center gap-1">
      <span className={"font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap text-white" + paceValueOffset}>
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
  distance: string;
  pace: string;
  bpm: number;
  calories: number;
  altitude: string;
  mapPath?: MapPoint[];
  mapProgress?: number;
  mapPosition?: MapPoint;
  mapCenter?: MapPoint;
  mapLevel?: number;
  showRoutePreview?: boolean;
  onResume: () => void;
  onEnd?: () => void;
  onBack?: () => void;
  onMusicConnect?: () => void;
  musicConnected?: boolean;
  onChatbot?: () => void;
};

export default function PausedRunPage({
  seconds,
  distance,
  pace,
  bpm,
  calories,
  altitude,
  mapPath = [],
  mapProgress = 0,
  mapPosition,
  mapCenter,
  mapLevel = 4,
  showRoutePreview = true,
  onResume,
  onEnd,
  onBack,
  onMusicConnect,
  musicConnected,
  onChatbot,
}: Props) {
  const holdTimer = useRef<number | null>(null);
  const [isHoldingEnd, setIsHoldingEnd] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const pausedMapPosition = mapPosition ?? PAUSED_RUN_LOCATION;
  const pausedMapCenter = mapCenter ?? pausedMapPosition;
  const pausedMapPath = mapPath.length > 1 ? mapPath : undefined;

  const startHold = () => {
    setIsHoldingEnd(true);
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      setIsHoldingEnd(false);
      onEnd?.();
    }, HOLD_MS);
  };
  const cancelHold = () => {
    setIsHoldingEnd(false);
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  return (
    <div className="relative flex-1 bg-[#1b1b1b]">
      <BackButton
        onClick={onBack}
        className="absolute top-[calc(var(--statusbar-h)+18px)] left-[18px] z-10 drop-shadow-[0_0_4px_rgba(0,0,0,0.75)]"
      />
      <button
        type="button"
        className="relative block h-69.25 w-full overflow-hidden text-left"
        aria-label="지도 전체화면으로 보기"
        onClick={() => setIsMapOpen(true)}
      >
        <MapBackdrop
          center={pausedMapCenter}
          level={mapLevel}
          markerPosition={pausedMapPosition}
          markerVariant="orange"
          markerPath={pausedMapPath}
          showTraveledPath
          showRoutePreview={showRoutePreview}
          traveledPathProgress={mapProgress}
        />
        <div className={MAP_TOP_GRADIENT_CLASS} />
      </button>

      {isMapOpen && (
        <div className="absolute inset-0 z-40 bg-black">
          <MapBackdrop
            center={pausedMapCenter}
            interactive
            level={mapLevel}
            markerPosition={pausedMapPosition}
            markerVariant="orange"
            markerPath={pausedMapPath}
            showTraveledPath
            showRoutePreview={showRoutePreview}
            traveledPathProgress={mapProgress}
          />
          <div className={`${MAP_TOP_GRADIENT_CLASS} z-10`} />
          <BackButton
            onClick={() => setIsMapOpen(false)}
            label="지도 닫기"
            className="absolute top-[calc(var(--statusbar-h)+18px)] left-[18px] z-20 drop-shadow-[0_0_4px_rgba(0,0,0,0.75)]"
          />
        </div>
      )}

      <div className="absolute top-77.25 left-1/2 flex w-87.5 -translate-x-1/2 flex-col gap-4">
        <div className="flex items-start justify-between">
          <Stat value={distance} label="킬로미터" />
          <Stat value={pace} label="평균 페이스" />
          <Stat value={formatTime(seconds)} label="시간" />
        </div>
        <div className="flex items-start justify-between">
          <Stat value={String(calories)} label="칼로리" />
          <Stat value={altitude} label="고도" />
          <Stat value={String(bpm)} label="BPM" />
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-76.25 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-black"
        aria-label="AI 챗봇"
        onClick={onChatbot}
      >
        <img className="size-6" src={iconChatbot} alt="" />
      </button>

      <div className="absolute bottom-[161px] left-1/2 flex -translate-x-1/2 gap-16.5">
        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            className="grid size-24 place-items-center rounded-full"
            aria-label="길게 눌러 종료"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
          >
            <span
              className={"grid size-24 transform-gpu place-items-center rounded-full bg-black transition-transform ease-out " + (isHoldingEnd ? "scale-[1.12] duration-[1100ms]" : "scale-100 duration-0")}
            >
              <span className="size-5.75 rounded-xs bg-white" />
            </span>
          </button>
          <p className="text-[14px] leading-[1.3] tracking-[-0.42px] text-[#b1b1b1]">
            길게 눌러 종료
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            className="grid size-24 place-items-center rounded-full bg-primary-lime active:scale-[0.97]"
            aria-label="이어서 달리기"
            onClick={onResume}
          >
            <svg className="translate-x-[2px]" width={22} height={26} viewBox="0 0 22 26" fill="none" aria-hidden>
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
