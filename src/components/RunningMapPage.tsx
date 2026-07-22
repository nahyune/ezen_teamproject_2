import { useState } from "react";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import MusicPlayerBar from "./MusicPlayerBar";
import MapBackdrop from "./MapBackdrop";
import { BackButton } from "./Icons";

export const RUNNING_MAP_LOCATION = { lat: 37.5769, lng: 126.9828 }; // 경복궁과 안국역 사이
export const RUNNING_MAP_DESTINATION = { lat: 37.5795, lng: 126.9872 };
export const RUNNING_MAP_WAYPOINTS = [
  { lat: 37.5778, lng: 126.9848 },
  { lat: 37.5788, lng: 126.9861 },
];
export const RUNNING_ROUTE_DURATION_MS = 600000;

export type MapPoint = { lat: number; lng: number };

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

function Stat({ value, label }: { value: string; label: string }) {
  const paceValueOffset = label === "평균 페이스" ? " translate-x-[3px]" : "";
  const paceLabelOffset = label === "평균 페이스" ? " -translate-x-[4px]" : "";

  return (
    <div className="flex w-22 flex-col items-center gap-1 text-center text-white">
      <span className={"w-full text-center font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap tabular-nums" + paceValueOffset}>
        {value}
      </span>
      <span className={"w-full text-center text-[16px] leading-[1.3] tracking-[-0.48px]" + paceLabelOffset}>
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
  paused: boolean;
  roadPath: MapPoint[];
  routeProgress: number;
  mapCenter?: MapPoint;
  mapLevel?: number;
  markerFollowsCenter?: boolean;
  showRoutePreview?: boolean;
  onTogglePause: () => void;
  onBack: () => void;
  onMusicConnect?: () => void;
  musicConnected?: boolean;
  onChatbot?: () => void;
};

export default function RunningMapPage({
  seconds,
  distance,
  pace,
  bpm,
  paused,
  roadPath,
  routeProgress,
  mapCenter = RUNNING_MAP_LOCATION,
  mapLevel = 4,
  markerFollowsCenter = true,
  showRoutePreview = true,
  onTogglePause,
  onBack,
  onMusicConnect,
  musicConnected,
  onChatbot,
}: Props) {
  const [initialRouteProgress] = useState(routeProgress);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0">
        <MapBackdrop
          center={mapCenter}
          interactive
          level={mapLevel}
          markerPosition={roadPath[0] ?? mapCenter}
          markerVariant="orange"
          markerAnimated={!paused && roadPath.length > 1}
          markerFollowsCenter={markerFollowsCenter}
          markerPath={roadPath.length > 1 ? roadPath : undefined}
          markerPathDurationMs={RUNNING_ROUTE_DURATION_MS}
          showTraveledPath
          showRoutePreview={showRoutePreview}
          traveledPathProgress={initialRouteProgress}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.83) 0.96%, rgba(0,0,0,0.664) 9.13%, rgba(80,80,80,0.486) 21.15%, rgba(160,160,160,0.308) 32.69%, rgba(255,255,255,0) 57.69%, rgba(128,128,128,0.506) 76.92%, rgba(64,64,64,0.747) 87.02%, rgba(0,0,0,0.83) 100%)",
        }}
      />

      <BackButton
        onClick={onBack}
        className="absolute top-[calc(var(--statusbar-h)+18px)] left-[18px] z-10 drop-shadow-[0_0_4px_rgba(0,0,0,0.75)]"
      />

      <p className="absolute top-[calc(var(--statusbar-h)+18px)] left-13.75 flex min-w-[164px] items-baseline justify-center gap-1.5 leading-[0.95] whitespace-nowrap">
        <span className="font-display text-[48px] text-primary-lime tabular-nums">{distance}</span>
        <span className="text-[32px] text-[#b1b1b1]">/8km</span>
      </p>

      <div className="absolute top-[calc(var(--statusbar-h)+86px)] left-1/2 flex -translate-x-1/2 items-start gap-4 min-[390px]:gap-7">
        <Stat value={formatTime(seconds)} label="시간" />
        <Stat value={pace} label="평균 페이스" />
        <Stat value={String(bpm)} label="BPM" />
      </div>

      <div className="absolute bottom-43.75 left-1/2 h-[186px] w-30 -translate-x-1/2">
        <button
          type="button"
          className="absolute top-0 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-black shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          aria-label="AI 챗봇"
          onClick={onChatbot}
        >
          <img className="size-6" src={iconChatbot} alt="" />
        </button>
        <button
          type="button"
          className="absolute top-19 left-1/2 grid size-27.5 -translate-x-1/2 place-items-center rounded-full bg-primary-lime active:scale-[0.97]"
          aria-label={paused ? "재개" : "일시정지"}
          onClick={onTogglePause}
        >
          {paused ? (
            <svg width={22} height={26} viewBox="0 0 22 26" fill="none" aria-hidden>
              <path d="M1 1v24l20-12L1 1z" fill="#000" />
            </svg>
          ) : (
            <svg width={19} height={26} viewBox="0 0 19 26" fill="none" aria-hidden>
              <rect x="0" y="0" width="7" height="26" rx="2" fill="#000" />
              <rect x="12" y="0" width="7" height="26" rx="2" fill="#000" />
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
