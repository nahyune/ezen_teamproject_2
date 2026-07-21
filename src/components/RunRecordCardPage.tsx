import { useEffect, useMemo, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import routeIcon from "../assets/icons/record-card-route.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import cardPhoto from "../assets/img/300img.png";
import exampleSelfie from "../assets/img/feed-running-selfie.webp";
import exampleCrew from "../assets/img/feed-story-ahn-hangang-crew.webp";
import exampleShoes from "../assets/img/feed-running-shoes.webp";
import shareIcon from "../assets/icons/share.svg";
import { BackButton } from "./Icons";
import type { RunSummary } from "./RunningPage";

type Props = {
  summary?: RunSummary | null;
  onBack?: () => void;
  onClose?: () => void;
  onShare?: (card: SharedRunCard) => void;
  onSave?: (card: SharedRunCard) => void;
};

export type SharedRunCard = {
  image: string;
  title: string;
  subtitle: string;
  distance: string;
};

type DragKey = "title" | "route" | "stats";
type Position = { x: number; y: number };

const backgroundOptions = [
  { src: cardPhoto, label: "샘플" },
  { src: exampleSelfie, label: "셀피" },
  { src: exampleCrew, label: "크루런" },
  { src: exampleShoes, label: "러닝화" },
];

const formatTime = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

const formatCardDate = (date: Date) => {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const period = date.getHours() < 12 ? "오전" : "오후";
  const hour = date.getHours() % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일 · ${period} ${hour}:${minute}`;
};

const formatShortDate = (date: Date) =>
  `${String(date.getFullYear()).slice(2)}년 ${date.getMonth() + 1}월 ${date.getDate()}일 · 러닝`;

const loadCanvasImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

type RoutePoint = { lat: number; lng: number };

// 러닝 중 실제로 지나온 위경도 경로를 종횡비를 유지한 채 [0,1]×[0,1] 박스 안에
// 맞춰 넣는다. 좁은 지역이라 경도에 cos(위도) 보정만 적용한 간이 등장방형 투영으로
// 충분하다. y 는 위도가 클수록(북쪽) 화면 위로 가도록 뒤집는다.
const normalizeRoute = (path: RoutePoint[], padding = 0.14): { x: number; y: number }[] => {
  if (path.length < 2) return [];

  const cosLat = Math.cos((path[0].lat * Math.PI) / 180);
  const projected = path.map((point) => ({ x: point.lng * cosLat, y: -point.lat }));

  const xs = projected.map((p) => p.x);
  const ys = projected.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX;
  const spanY = Math.max(...ys) - minY;
  const span = Math.max(spanX, spanY) || 1e-9; // 종횡비 유지: 큰 축 기준으로 스케일
  const inner = 1 - padding * 2;
  const offX = (span - spanX) / 2; // 짧은 축은 가운데로
  const offY = (span - spanY) / 2;

  return projected.map((p) => ({
    x: padding + ((p.x - minX + offX) / span) * inner,
    y: padding + ((p.y - minY + offY) / span) * inner,
  }));
};

const getTraveledRoute = (path: RoutePoint[], progress: number) => {
  if (path.length < 2) return path;

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const segmentLengths = path.slice(1).map((point, index) => {
    const previous = path[index];
    return Math.hypot(point.lat - previous.lat, point.lng - previous.lng);
  });
  const totalLength = segmentLengths.reduce((total, length) => total + length, 0);
  const targetLength = totalLength * clampedProgress;
  const traveledPath = [path[0]];
  let traveledLength = 0;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const segmentLength = segmentLengths[index];
    const start = path[index];
    const end = path[index + 1];
    if (traveledLength + segmentLength >= targetLength) {
      const ratio = segmentLength === 0 ? 0 : (targetLength - traveledLength) / segmentLength;
      traveledPath.push({
        lat: start.lat + (end.lat - start.lat) * ratio,
        lng: start.lng + (end.lng - start.lng) * ratio,
      });
      break;
    }
    traveledPath.push(end);
    traveledLength += segmentLength;
  }

  return traveledPath;
};

export default function RunRecordCardPage({ summary, onBack, onClose, onShare, onSave }: Props) {
  const now = new Date();
  const distance = summary?.distance ?? "8.43";
  const seconds = summary?.seconds ?? 51 * 60 + 17;
  const pace = summary?.pace ?? `6'05"`;

  // 실제 달린 경로를 카드 좌표(0~1)로 정규화. 경로가 없으면(코스 미선택·API 실패 등)
  // 빈 배열 → 기존 고정 GPS 아트 아이콘으로 폴백한다.
  const routePoints = useMemo(
    () => normalizeRoute(getTraveledRoute(summary?.mapPath ?? [], summary?.mapProgress ?? 1)),
    [summary?.mapPath, summary?.mapProgress],
  );
  const hasRoutePath = routePoints.length > 1;
  const routePolyline = routePoints
    .map((point) => `${(point.x * 100).toFixed(2)},${(point.y * 100).toFixed(2)}`)
    .join(" ");
  const cardRef = useRef<HTMLDivElement>(null);
  const customBgRef = useRef("");
  const dragRef = useRef<{ key: DragKey; offsetX: number; offsetY: number } | null>(null);

  const [backgroundImage, setBackgroundImage] = useState(cardPhoto);
  const [title, setTitle] = useState("오늘의 러닝");
  const [subtitle, setSubtitle] = useState(formatShortDate(now));
  const [showRoute, setShowRoute] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [photoSectionOpen, setPhotoSectionOpen] = useState(true);
  const [textSectionOpen, setTextSectionOpen] = useState(true);
  const [elementsSectionOpen, setElementsSectionOpen] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [positions, setPositions] = useState<Record<DragKey, Position>>({
    title: { x: 22, y: 14 },
    route: { x: 22, y: 33 },
    stats: { x: 23, y: 64 },
  });

  useEffect(() => {
    return () => {
      if (customBgRef.current) URL.revokeObjectURL(customBgRef.current);
    };
  }, []);

  const setPosition = (key: DragKey, position: Position) => {
    setPositions((current) => ({
      ...current,
      [key]: {
        x: Math.min(92, Math.max(8, position.x)),
        y: Math.min(92, Math.max(8, position.y)),
      },
    }));
  };

  const startDrag = (key: DragKey, event: ReactPointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const cardBox = card.getBoundingClientRect();
    const targetBox = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      key,
      offsetX: event.clientX - (targetBox.left + targetBox.width / 2),
      offsetY: event.clientY - (targetBox.top + targetBox.height / 2),
    };
    setPosition(key, {
      x: ((event.clientX - dragRef.current.offsetX - cardBox.left) / cardBox.width) * 100,
      y: ((event.clientY - dragRef.current.offsetY - cardBox.top) / cardBox.height) * 100,
    });
  };

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    const drag = dragRef.current;
    if (!card || !drag || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const cardBox = card.getBoundingClientRect();
    setPosition(drag.key, {
      x: ((event.clientX - drag.offsetX - cardBox.left) / cardBox.width) * 100,
      y: ((event.clientY - drag.offsetY - cardBox.top) / cardBox.height) * 100,
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const chooseCustomBackground = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (customBgRef.current) URL.revokeObjectURL(customBgRef.current);
    const nextImage = URL.createObjectURL(file);
    customBgRef.current = nextImage;
    setBackgroundImage(nextImage);
    event.target.value = "";
  };

  const draggableStyle = (key: DragKey) => ({
    left: `${positions[key].x}%`,
    top: `${positions[key].y}%`,
  });

  const createSharedCardImage = async () => {
    const size = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");

    const background = await loadCanvasImage(backgroundImage);
    const scale = Math.max(size / background.naturalWidth, size / background.naturalHeight);
    const width = background.naturalWidth * scale;
    const height = background.naturalHeight * scale;
    context.drawImage(background, (size - width) / 2, (size - height) / 2, width, height);

    const gradient = context.createLinearGradient(0, size * 0.65, 0, size);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.58)");
    context.fillStyle = gradient;
    context.fillRect(0, size * 0.55, size, size * 0.45);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0,0,0,0.7)";
    context.shadowBlur = 18;
    context.fillStyle = "#ffffff";
    context.font = '600 68px "Pretendard", sans-serif';
    context.fillText(title, size * positions.title.x / 100, size * positions.title.y / 100 - 18);
    context.font = '400 38px "Pretendard", sans-serif';
    context.fillText(subtitle, size * positions.title.x / 100, size * positions.title.y / 100 + 48);

    if (showRoute) {
      context.shadowBlur = 0;
      if (hasRoutePath) {
        // 실제 달린 경로를 카드 미리보기와 동일한 정규화 좌표로 스트로크한다.
        const routeBox = 176;
        const boxX = size * positions.route.x / 100 - routeBox / 2;
        const boxY = size * positions.route.y / 100 - routeBox / 2;
        context.strokeStyle = "#D6FF1E";
        context.lineWidth = 9;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.beginPath();
        routePoints.forEach((point, index) => {
          const px = boxX + point.x * routeBox;
          const py = boxY + point.y * routeBox;
          if (index === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        });
        context.stroke();
      } else {
        const route = await loadCanvasImage(routeIcon);
        const routeWidth = 166;
        const routeHeight = 142;
        context.drawImage(
          route,
          size * positions.route.x / 100 - routeWidth / 2,
          size * positions.route.y / 100 - routeHeight / 2,
          routeWidth,
          routeHeight,
        );
      }
    }

    if (showStats) {
      const x = size * positions.stats.x / 100;
      const startY = size * positions.stats.y / 100 - 128;
      const stats = [
        ["거리", `${distance} km`],
        ["시간", formatTime(seconds)],
        ["평균 페이스", pace],
      ];
      context.shadowColor = "rgba(0,0,0,0.7)";
      context.shadowBlur = 16;
      stats.forEach(([label, value], index) => {
        const y = startY + index * 112;
        context.fillStyle = "#ffffff";
        context.font = '400 30px "Pretendard", sans-serif';
        context.fillText(label, x, y);
        context.fillStyle = "#f5f5f7";
        context.font = '600 54px "Pretendard", sans-serif';
        context.fillText(value, x, y + 48);
      });
    }

    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const shareCard = async () => {
    if (!onShare || sharing || saving) return;
    setSharing(true);
    try {
      const image = await createSharedCardImage();
      onShare({ image, title, subtitle, distance });
    } finally {
      setSharing(false);
    }
  };

  const saveCard = async () => {
    if (sharing || saving) return;
    if (!onSave) {
      onClose?.();
      return;
    }
    setSaving(true);
    try {
      const image = await createSharedCardImage();
      onSave({ image, title, subtitle, distance });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="run-record-card-page scrollbar-hidden relative flex flex-1 min-h-0 flex-col overflow-y-auto bg-[#232323] pb-8">
      <div className="fixed top-0 left-0 right-0 z-10 h-[var(--statusbar-h)] bg-[#232323]" aria-hidden />
      <header className="sticky top-[var(--statusbar-h)] z-20 mt-[var(--statusbar-h)] flex h-13 w-full shrink-0 items-center justify-between bg-[#232323] px-4.5">
        <BackButton onClick={onBack} color="text-white" />
        <button
          type="button"
          className="grid size-[26px] place-items-center"
          aria-label="공유하기"
          onClick={shareCard}
          disabled={sharing || saving}
        >
          <img className="size-[26px] brightness-0 invert" src={shareIcon} alt="" />
        </button>
      </header>
      <p className="mt-4 px-6 font-display text-[13px] tracking-[1px] text-primary-lime">
        RUN COMPLETE
      </p>
      <h1 className="mt-1.5 px-6 text-[26px] font-bold leading-[1.3] text-[#f5f4f2]">
        기록 카드 만들기
      </h1>
      <p className="mt-2 px-6 text-[12px] text-white/55">{formatCardDate(now)}</p>

      <div className="mt-4.5 flex items-center gap-2.5 px-6">
        <span className="grid size-6.5 shrink-0 place-items-center rounded-full border-[1.2px] border-primary-lime bg-[#2c2c30]">
          <span
            className="size-4.5 bg-[#d6ff1e] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
            style={{ maskImage: `url("${iconChatbot}")`, WebkitMaskImage: `url("${iconChatbot}")` }}
            aria-hidden
          />
        </span>
        <p className="text-[13px] text-primary-lime">
          사진, 문구, GPS 아트, 기록 정보를 원하는 위치로 옮겨보세요.
        </p>
      </div>

      <div
        ref={cardRef}
        // isolate: 카드가 자체 쌓임 맥락을 만들어 내부 드래그 요소(z-10)가 카드 밖으로
        // 새어나가지 않게 한다. 없으면 스크롤 시 그 요소들이 상단 헤더(z-[1]) 위로 겹친다.
        className="relative isolate mx-6 mt-4 aspect-square shrink-0 overflow-hidden rounded-card border border-primary-lime bg-elevated"
      >
        <img className="absolute inset-0 h-full w-full object-cover" src={backgroundImage} alt="" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-30 bg-gradient-to-b from-black/0 to-black/55" />

        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none flex-col gap-[1px] rounded-[8px] px-2 py-1 text-white active:cursor-grabbing"
          style={draggableStyle("title")}
          onPointerDown={(event) => startDrag("title", event)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <p className="text-[24px] font-semibold tracking-[-0.48px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {title}
          </p>
          <p className="text-[14px] tracking-[-0.42px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {subtitle}
          </p>
        </div>

        {showRoute && (
          <div
            className="absolute z-10 flex h-22 w-22 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none items-center justify-center rounded-full active:cursor-grabbing"
            style={draggableStyle("route")}
            onPointerDown={(event) => startDrag("route", event)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {hasRoutePath ? (
              <svg
                className="pointer-events-none h-16 w-16 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden
              >
                <polyline
                  points={routePolyline}
                  stroke="#D6FF1E"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <img className="pointer-events-none h-12.5 w-14.75" src={routeIcon} alt="" aria-hidden draggable={false} />
            )}
          </div>
        )}

        {showStats && (
          <div
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none flex-col gap-2.5 rounded-[10px] px-2 py-1 active:cursor-grabbing"
            style={draggableStyle("stats")}
            onPointerDown={(event) => startDrag("stats", event)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div>
              <p className="text-[12px] leading-[1.25] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">거리</p>
              <p className="font-display text-[22px] leading-[1.25] tracking-[-0.44px] text-[#f5f5f7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">{distance} km</p>
            </div>
            <div>
              <p className="text-[12px] leading-[1.25] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">시간</p>
              <p className="font-display text-[22px] leading-[1.25] tracking-[-0.44px] text-[#f5f5f7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">{formatTime(seconds)}</p>
            </div>
            <div>
              <p className="text-[12px] leading-[1.25] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">평균 페이스</p>
              <p className="font-display text-[22px] leading-[1.25] tracking-[-0.44px] text-[#f5f5f7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">{pace}</p>
            </div>
          </div>
        )}
      </div>

      <section className="mx-6 mt-5 rounded-[12px] border border-white/10 bg-[#404040] p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setPhotoSectionOpen((open) => !open)}
          aria-expanded={photoSectionOpen}
        >
          <h2 className="text-[15px] font-semibold text-white">사진 선택</h2>
          <svg
            className={`h-5 w-5 text-white/60 transition-transform ${photoSectionOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {photoSectionOpen && (
          <>
            <div className="hidden">
              <label className="cursor-pointer text-[13px] font-medium text-primary-lime">
                직접 추가
                <input type="file" accept="image/*" className="hidden" onChange={chooseCustomBackground} />
              </label>
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {backgroundOptions.map((option) => (
                <button
                  key={option.src}
                  type="button"
                  className={`relative h-[62px] w-[62px] flex-none overflow-hidden rounded-[6px] border ${
                    backgroundImage === option.src ? "border-primary-lime" : "border-white/10"
                  }`}
                  onClick={() => setBackgroundImage(option.src)}
                >
                  <img src={option.src} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-0.5 text-[10px] text-white">
                    {option.label}
                  </span>
                </button>
              ))}
              <label className="flex h-[62px] w-[62px] flex-none cursor-pointer items-center justify-center rounded-[6px] border border-dashed border-white/25 bg-[#1c1c1f] text-[28px] font-light leading-none text-primary-lime">
                +
                <input type="file" accept="image/*" className="hidden" onChange={chooseCustomBackground} />
              </label>
            </div>
          </>
        )}
      </section>

      <section className="mx-6 mt-3 rounded-[12px] border border-white/10 bg-[#404040] p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setTextSectionOpen((open) => !open)}
          aria-expanded={textSectionOpen}
        >
          <h2 className="text-[15px] font-semibold text-white">문구 편집</h2>
          <svg
            className={`h-5 w-5 text-white/60 transition-transform ${textSectionOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {textSectionOpen && (
        <>
        <label className="mt-3 block">
          <span className="mb-1 block text-[12px] text-white/45">큰 문구</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10 w-full rounded-[6px] border border-white/10 bg-[#202024] px-3 text-[14px] text-white outline-none focus:border-primary-lime"
          />
        </label>
        <label className="mt-2 block">
          <span className="mb-1 block text-[12px] text-white/45">작은 문구</span>
          <input
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            className="h-10 w-full rounded-[6px] border border-white/10 bg-[#202024] px-3 text-[14px] text-white outline-none focus:border-primary-lime"
          />
        </label>
        </>
        )}
      </section>

      <section className="mx-6 mt-3 rounded-[12px] border border-white/10 bg-[#404040] p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setElementsSectionOpen((open) => !open)}
          aria-expanded={elementsSectionOpen}
        >
          <h2 className="text-[15px] font-semibold text-white">카드 요소</h2>
          <svg
            className={`h-5 w-5 text-white/60 transition-transform ${elementsSectionOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {elementsSectionOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`h-10 rounded-full border text-[13px] font-medium ${showRoute ? "border-primary-lime bg-primary-lime text-black" : "border-white/15 text-white/60"}`}
            onClick={() => setShowRoute((value) => !value)}
          >
            GPS 아트
          </button>
          <button
            type="button"
            className={`h-10 rounded-full border text-[13px] font-medium ${showStats ? "border-primary-lime bg-primary-lime text-black" : "border-white/15 text-white/60"}`}
            onClick={() => setShowStats((value) => !value)}
          >
            기록 정보
          </button>
        </div>
        )}
      </section>

      <button
        type="button"
        onClick={shareCard}
        disabled={sharing || saving}
        className="mx-6 mt-4 flex h-14 shrink-0 items-center justify-center rounded-full bg-primary-lime text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-[#0f120c]"
      >
        {sharing ? "공유 중..." : "피드에 공유하기"}
      </button>
      <button
        type="button"
        onClick={saveCard}
        disabled={sharing || saving}
        className="mx-6 mt-2.5 flex h-14 shrink-0 items-center justify-center rounded-full bg-[#404040] text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-white"
      >
        {saving ? "저장 중..." : "기록만 저장하고 닫기"}
      </button>
    </div>
  );
}
