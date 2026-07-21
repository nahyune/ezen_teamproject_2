import MapBackdrop from "./MapBackdrop";
import { BackButton } from "./Icons";
import { RUNNING_MAP_LOCATION } from "./RunningMapPage";
import type { RunSummary } from "./RunningPage";
import shareIcon from "../assets/icons/share.svg";

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

const fallbackSummary: RunSummary = {
  seconds: 51 * 60 + 17,
  distance: "8.43",
  pace: `6'05"`,
  bpm: 162,
  calories: 512,
  altitude: "12m",
};

function Stat({ value, label, suffix }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="flex w-27.5 flex-col items-center gap-1">
      <span className="flex items-center gap-1.25 font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap text-[#3E3E3E]">
        {value}
        {suffix && (
          <span className="font-sans text-[24px] tracking-[-0.48px] text-[#ff4e16]">
            {suffix}
          </span>
        )}
      </span>
      <span className="text-[16px] leading-[1.3] tracking-[-0.48px] text-[rgba(0,0,0,0.26)]">
        {label}
      </span>
    </div>
  );
}


export default function RunCompletePage({
  summary,
  onCreateCard,
  onBack,
}: {
  summary?: RunSummary | null;
  onCreateCard?: () => void;
  onBack?: () => void;
}) {
  const result = summary ?? fallbackSummary;
  const cadence = summary ? String(Math.round(result.bpm * 1.06)) : "172";
  return (
    <div className="run-complete-page scrollbar-hidden relative flex flex-1 min-h-0 animate-run-complete-fade flex-col items-center overflow-y-auto bg-[#fafafa]">
      <div className="fixed top-0 left-0 right-0 z-10 h-[var(--statusbar-h)] bg-white" aria-hidden />
      <header className="sticky top-[var(--statusbar-h)] z-10 mt-[var(--statusbar-h)] flex h-13 w-full shrink-0 items-center justify-between border-b border-[#eeeeee] bg-white px-4.5">
        <BackButton onClick={onBack} color="text-[#0D0D0F]" />
        <button type="button" className="grid size-[26px] place-items-center" aria-label="공유하기">
          <img className="size-[26px]" src={shareIcon} alt="" />
        </button>
      </header>

      <p className="mt-3 flex w-87.5 shrink-0 items-baseline justify-start gap-1.25 pl-3 font-display leading-[1.3] whitespace-nowrap">
        <span className="text-[128px] tracking-[-2.56px] text-[#0D0D0F] tabular-nums">{result.distance}</span>
        <span className="text-[36px] tracking-[-0.72px] text-[rgba(0,0,0,0.26)]">KM</span>
      </p>

      <div className="mt-4 flex w-87.5 shrink-0 flex-col gap-4">
        <div className="flex items-start justify-between">
          <Stat value={result.pace} label="평균 페이스" />
          <Stat value={cadence} label="케이던스" />
          <Stat value={formatTime(result.seconds)} label="시간" />
        </div>
        <div className="flex items-start justify-between">
          <Stat value={String(result.calories)} label="칼로리" />
          <Stat value={result.altitude} label="고도" />
          <Stat value={String(result.bpm)} label="BPM" suffix="♡" />
        </div>
      </div>

      <div className="relative mt-8 mb-5 h-102.75 w-96.75 shrink-0 overflow-hidden rounded-card bg-white">
        <MapBackdrop
          center={result.mapCenter ?? result.mapPosition ?? RUNNING_MAP_LOCATION}
          level={result.mapLevel ?? 4}
          markerPosition={result.mapPosition ?? RUNNING_MAP_LOCATION}
          markerVariant="orange"
          markerPath={result.mapPath && result.mapPath.length > 1 ? result.mapPath : undefined}
          showTraveledPath
          showRoutePreview={result.mapShowRoutePreview ?? false}
          traveledPathProgress={result.mapProgress ?? 1}
          fitPathBounds
        />

        <span className="absolute top-4.5 left-3.75 z-10 flex h-8.25 w-33.25 items-center justify-center rounded-[5px] bg-white text-[14px] leading-[1.3] tracking-[-0.42px] text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          서울특별시, 대한민국
        </span>
      </div>

      <button
        type="button"
        onClick={onCreateCard}
        className="mb-5 h-14 w-95.5 max-w-[calc(100%-48px)] shrink-0 rounded-[28px] bg-[#d6ff1e] text-[16px] font-semibold text-[#0f120c]"
      >
        기록 카드 만들기
      </button>
    </div>
  );
}
