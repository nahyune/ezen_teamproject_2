import { useEffect, useState } from "react";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import RunningMapPage, {
  RUNNING_MAP_DESTINATION,
  RUNNING_MAP_LOCATION,
  RUNNING_MAP_WAYPOINTS,
  RUNNING_ROUTE_DURATION_MS,
  type MapPoint,
} from "./RunningMapPage";
import MusicConnectPage from "./MusicConnectPage";
import MusicPlayerBar from "./MusicPlayerBar";
import PausedRunPage from "./PausedRunPage";
import { BackButton } from "./Icons";

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

// 평균 페이스(초/km) → m'ss" 표기. 거리 0일 땐 0'00".
const formatPace = (secPerKm: number) => {
  if (!isFinite(secPerKm) || secPerKm <= 0) return `0'00"`;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
};

// 시뮬레이션 기준 페이스 ≈ 5'30"/km (약 3.03 m/s)
const BASE_SPEED_MPS = 1000 / 330;

const getRouteLength = (path: MapPoint[]) =>
  path.slice(1).reduce((total, point, index) => {
    const prev = path[index];
    return total + Math.hypot(point.lat - prev.lat, point.lng - prev.lng);
  }, 0);

const getPointOnRoute = (path: MapPoint[], targetDistance: number) => {
  let travelled = 0;
  for (let index = 1; index < path.length; index += 1) {
    const start = path[index - 1];
    const end = path[index];
    const segmentLength = Math.hypot(end.lat - start.lat, end.lng - start.lng);
    if (travelled + segmentLength >= targetDistance) {
      const ratio = segmentLength === 0 ? 0 : (targetDistance - travelled) / segmentLength;
      return {
        lat: start.lat + (end.lat - start.lat) * ratio,
        lng: start.lng + (end.lng - start.lng) * ratio,
      };
    }
    travelled += segmentLength;
  }
  return path[path.length - 1] ?? RUNNING_MAP_LOCATION;
};

export type RunCourseMap = {
  center: MapPoint;
  path: MapPoint[];
  level: number;
};

export type RunSummary = {
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
  mapShowRoutePreview?: boolean;
};

function Stat({ value, label }: { value: string; label: string }) {
  const paceValueOffset = label === "평균 페이스" ? " translate-x-[3px]" : "";
  const paceLabelOffset = label === "평균 페이스" ? " -translate-x-[4px]" : "";
  const valueColor = " text-[#3E3E3E]";
  const labelColor = " text-black/26";

  return (
    <div className="flex w-22 flex-col items-center gap-1 text-center">
      <span className={"flex w-full items-center justify-center gap-1.25 text-center font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap tabular-nums" + valueColor + paceValueOffset}>
        {value}
        {label === "BPM" && (
          <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              stroke="#FF4E16"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={"w-full text-center text-[16px] leading-[1.3] tracking-[-0.48px]" + labelColor + paceLabelOffset}>
        {label}
      </span>
    </div>
  );
}

// ── 기록 — 러닝(음악x) (Figma 411:5257) ─────────────────────
// 카운트다운이 끝나면 뜨는 측정 화면. 시간 스탯만 1초에 1씩
// 올라가고, 일시정지 버튼으로 멈췄다 재개할 수 있다.
// 세로 간격은 시안 좌표에서 상태바(47px)를 뺀 값 기준.
export default function RunningPage({
  onEnd,
  onBack,
  onCancelRun,
  onChatbot,
  selectedCourseLabel,
  selectedCourseMap,
  currentLocation,
  musicConnected = false,
  onMusicConnected,
}: {
  onEnd?: (summary: RunSummary) => void;
  onBack?: () => void;
  onCancelRun?: () => void;
  onChatbot?: () => void;
  selectedCourseLabel?: string | null;
  selectedCourseMap?: RunCourseMap | null;
  /** 실제 geolocation 좌표 — 코스 미지정 자유 러닝에서만 지도 중심으로 쓰인다 */
  currentLocation?: { lat: number; lng: number } | null;
  /** 음악 연결 여부 — App 이 보관 (RecordFlow 경유, 새로고침 전까지 유지) */
  musicConnected?: boolean;
  onMusicConnected?: () => void;
}) {
  // 실제 러닝을 시작한 것처럼 모든 수치가 0에서 시작해 매초 시뮬레이션으로 오른다.
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [bpm, setBpm] = useState(0);
  const [paused, setPaused] = useState(false);
  const [view, setView] = useState<"stats" | "map">("stats");
  const [musicOpen, setMusicOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [roadPath, setRoadPath] = useState<MapPoint[]>([]);

  // 자유 러닝(코스 미지정)의 시뮬레이션 출발점 — 실제 위치가 있으면 그걸, 없으면 기존 하드코딩 지점.
  // (코스 지정 시엔 이 경로 자체가 화면에 안 쓰이므로 무관하다.)
  const runOrigin = currentLocation ?? RUNNING_MAP_LOCATION;

  useEffect(() => {
    let cancelled = false;
    // 경로 API(카카오 도로) 실패 시 쓸 폴백 경로 — 출발·경유·도착점을 잇는다.
    // KAKAO_REST_API_KEY 가 없어도(로컬 .env 미설정) 자동 달리기가 돌게 하는 안전망.
    // (도로를 정확히 따라가진 않고 직선 구간으로 이어짐)
    const fallbackRunPath: MapPoint[] = [runOrigin, ...RUNNING_MAP_WAYPOINTS, RUNNING_MAP_DESTINATION];

    fetch("/api/kakao-directions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        origin: runOrigin,
        destination: RUNNING_MAP_DESTINATION,
        waypoints: RUNNING_MAP_WAYPOINTS,
      }),
    })
      .then(async (res) => {
        const data = (await res.json()) as { path?: MapPoint[]; error?: string };
        if (!res.ok) throw new Error(data.error ?? "카카오 도로 경로를 불러오지 못했습니다");
        if (!cancelled && data.path && data.path.length > 1) setRoadPath(data.path);
        else if (!cancelled) setRoadPath(fallbackRunPath);
      })
      .catch((err) => {
        // REST 키가 없거나(로컬 .env 미설정) 요청 실패 시에도 데모가 되도록
        // 출발·경유·도착점을 잇는 폴백 경로로 자동 달리기를 돌린다(도로 추종은 안 됨).
        console.warn(err);
        if (!cancelled) setRoadPath(fallbackRunPath);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 최초 진입 시 1회만 조회(그 시점 위치 기준)
  }, []);

  useEffect(() => {
    if (paused || confirmExit) return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
      // 매초 이동 거리: 기준 페이스 ± 소폭 변동
      setDistanceKm((d) => d + (BASE_SPEED_MPS + (Math.random() - 0.5) * 0.6) / 1000);
      // 심박: 시작 후 러닝 구간(150~165)까지 서서히 오른 뒤 소폭 변동
      setBpm((b) => (b < 150 ? Math.min(150, b + 8) : 150 + Math.round(Math.random() * 15)));
    }, 1000);
    return () => clearInterval(timer);
  }, [paused, confirmExit]);

  // 파생 수치(시간·거리로 계산)
  const distance = distanceKm.toFixed(2);
  const pace = formatPace(distanceKm > 0 ? seconds / distanceKm : 0);
  const calories = Math.round(distanceKm * 62);
  const altitude = `${Math.round(distanceKm * 4)}m`;
  const routeProgress = ((seconds * 1000) % RUNNING_ROUTE_DURATION_MS) / RUNNING_ROUTE_DURATION_MS;
  const selectedPath = selectedCourseMap?.path && selectedCourseMap.path.length > 1 ? selectedCourseMap.path : null;
  const activeMapPath = selectedPath ?? (roadPath.length > 1 ? roadPath : []);
  const activeRoutePosition =
    activeMapPath.length > 1 ? getPointOnRoute(activeMapPath, routeProgress * getRouteLength(activeMapPath)) : runOrigin;
  // 코스 지정 시엔 항상 코스 center 사용(추천코스는 실제 위치를 쓰지 않음).
  // 자유 러닝(selectedCourseMap 없음)일 때만 실제 위치로, 없으면 기존 하드코딩 위치로 폴백.
  const activeMapCenter = selectedCourseMap?.center ?? runOrigin;
  const activeMapLevel = selectedCourseMap?.level ?? 4;
  const showRoutePreview = Boolean(selectedPath);
  const routeChipLabel = `${selectedCourseLabel ?? "자유 러닝"} · 지도 보기`;

  // 지도/일시정지/음악 뷰로 바꿔도 이 컴포넌트가 유지되므로 타이머 상태가 이어진다.
  // 음악 화면을 닫으면 열기 직전 뷰(스탯/지도/일시정지)로 그대로 돌아간다.
  if (musicOpen) {
    return (
      <MusicConnectPage
        onClose={() => setMusicOpen(false)}
        onConnect={() => {
          onMusicConnected?.(); // 연결 저장(App) + 대표곡 첫 곡부터 재생 시작
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
        distance={distance}
        pace={pace}
        bpm={bpm}
        calories={calories}
        altitude={altitude}
        mapPath={activeMapPath}
        mapProgress={routeProgress}
        mapPosition={activeRoutePosition}
        mapCenter={activeMapCenter}
        mapLevel={activeMapLevel}
        showRoutePreview={showRoutePreview}
        onResume={() => setPaused(false)}
        onEnd={() =>
          onEnd?.({
            seconds,
            distance,
            pace,
            bpm,
            calories,
            altitude,
            mapPath: activeMapPath,
            mapProgress: routeProgress,
            mapPosition: activeRoutePosition,
            mapCenter: activeMapCenter,
            mapLevel: activeMapLevel,
            mapShowRoutePreview: showRoutePreview,
          })
        }
        onBack={onBack}
        onMusicConnect={() => setMusicOpen(true)}
        musicConnected={musicConnected}
        onChatbot={onChatbot}
      />
    );
  }
  if (view === "map") {
    return (
      <RunningMapPage
        seconds={seconds}
        distance={distance}
        pace={pace}
        bpm={bpm}
        paused={paused}
        roadPath={activeMapPath}
        routeProgress={routeProgress}
        mapCenter={activeMapCenter}
        mapLevel={activeMapLevel}
        markerFollowsCenter
        showRoutePreview={showRoutePreview}
        onTogglePause={() => setPaused(true)}
        onBack={() => setView("stats")}
        onMusicConnect={() => setMusicOpen(true)}
        musicConnected={musicConnected}
        onChatbot={onChatbot}
      />
    );
  }

  return (
    // 상단 콘텐츠(코스칩~스탯)를 상태바 높이만큼 내림 (모바일 0 / 웹 52px)
    <div className="running-stats-page relative flex flex-1 flex-col items-center bg-[#fafafa] pt-[var(--statusbar-h)] pb-17.25">
      <BackButton
        onClick={() => setConfirmExit(true)}
        className="absolute top-[calc(var(--statusbar-h)+18px)] left-[18px] z-10"
        color="text-black"
      />

      {/* 뒤로가기 → 러닝 중단 확인 (카운트다운 화면과 동일 패턴) */}
      {confirmExit && (
        <div className="absolute inset-0 z-[220] flex items-center justify-center bg-black/70">
          <div className="w-85 rounded-3xl border border-pill-border bg-elevated px-6 pt-[67.5px] pb-8.5">
            <p className="text-center text-[20px] font-bold leading-[1.3] text-[var(--text-strong)]">
              벌써 그만 두시게요?
            </p>
            <p className="mt-4 text-center text-[14px] leading-[1.4] text-white/65">
              신발끈까지 다 묶었는데!
              <br />
              오늘 목표까지 딱 한 걸음이에요
            </p>
            <button
              type="button"
              onClick={() => setConfirmExit(false)}
              className="mt-6.5 h-13 w-full rounded-full bg-primary-lime text-[16px] font-semibold text-[#0f120c]"
            >
              계속 달릴래요
            </button>
            <button
              type="button"
              onClick={onCancelRun}
              className="mt-2.5 h-11 w-full text-[14px] text-white/50"
            >
              그만할래요
            </button>
          </div>
        </div>
      )}

      {/* 진행 중인 코스 칩 */}
      <button
        type="button"
        className="mt-13.25 flex h-10.25 items-center gap-3.25 rounded-card bg-[rgba(0,0,0,0.26)] px-3 py-1.5 text-[16px] font-medium leading-[1.3] tracking-[-0.6px] text-white"
        onClick={() => setView("map")}
      >
        <span className="size-1.75 rounded-full bg-primary-orange" />
        <span>{routeChipLabel}</span>
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
      <p className="mt-15.25 flex w-full items-baseline justify-center font-display leading-[1.3] whitespace-nowrap">
        <span className="inline-flex min-w-[296px] items-baseline justify-center gap-1.25">
          <span className="text-[128px] tracking-[-2.56px] text-[#0D0D0F] tabular-nums">
            {distance}
          </span>
          <span className="text-[36px] tracking-[-0.72px] text-[rgba(0,0,0,0.26)]">KM</span>
        </span>
      </p>

      {/* 시간 · 평균 페이스 · BPM */}
      <div className="mt-5 flex items-start justify-center gap-4 min-[390px]:gap-7">
        <Stat value={formatTime(seconds)} label="시간" />
        <Stat value={pace} label="평균 페이스" />
        <Stat value={String(bpm)} label="BPM" />
      </div>

      <div className="mt-auto flex flex-col items-center gap-5">
        <button
          type="button"
          className="grid size-14 place-items-center rounded-full bg-[#232323]"
          aria-label="AI 챗봇"
          onClick={onChatbot}
        >
          <img className="size-6" src={iconChatbot} alt="" />
        </button>

        {/* 일시정지 — 플랫 라임 원형 버튼(글로우 제거, CTA와 톤 통일) */}
        <button
          type="button"
          className="grid size-27.5 place-items-center rounded-full bg-primary-lime active:scale-[0.97]"
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
          className="mt-9.75 h-16.75 w-87.5 max-w-[calc(100%-36px)] rounded-lg bg-[#232323] text-[18px] leading-[1.3] tracking-[-0.54px] text-white"
          onClick={() => setMusicOpen(true)}
        >
          음악 연결하기
        </button>
      )}
    </div>
  );
}
