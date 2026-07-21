import { useMemo, useRef, useState } from "react";
import {
  HIGHLIGHT_SEC,
  durationToSec,
  getDefaultHighlight,
  getPopularPoints,
  type Song,
} from "../lib/musicApi";

// ── 대표곡 하이라이트 30초 설정 오버레이 (Figma 149:344) ──────────────
// 인스타식: 형광 30초 창은 "중앙 고정·크기 고정"이고, 그 밑으로 음파 스트립을
// 좌우로 드래그해 구간을 고른다(곡이 길어도 창 크기가 안 깨짐).
// 재생하면 창 안이 형광으로 차오르고, 멈추거나 구간을 옮기면 초기화된다.
// 타임라인 바의 점 = 많이 듣는 구간(현재 휴리스틱 — musicApi 참고), 최초 선택도 그 지점.

const WINDOW_W = 96; // 형광 창 고정 폭(px) — 항상 이 크기
const BAR_PITCH = 7; // 음파 막대 간격(px): 막대 3px + 여백 4px

/** videoId 시드로 고정된 가짜 음파 막대 높이들 (곡마다 모양이 달라 보이게) */
function waveHeights(seed: string, count: number): number[] {
  let h = 2166136261;
  for (const ch of seed) h = (h * 16777619) ^ ch.charCodeAt(0);
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    arr.push(10 + (h % 24)); // 10~33px
  }
  return arr;
}

export default function HighlightPicker({
  song,
  onCancel,
  onDone,
}: {
  song: Song;
  onCancel: () => void;
  /** 완료 — 선택한 시작 지점(초)을 넘긴다 */
  onDone: (startSec: number) => void;
}) {
  const durationSec = durationToSec(song.duration);
  const winSec = Math.min(HIGHLIGHT_SEC, durationSec);
  const maxStart = Math.max(0, durationSec - winSec);

  const [start, setStart] = useState(() =>
    Math.min(song.highlightStart ?? getDefaultHighlight(durationSec), maxStart),
  );
  // 열리자마자 선택 구간 미리듣기 시작. playKey 가 바뀌면 재생·채움이 처음부터 다시.
  const [playing, setPlaying] = useState(true);
  const [playKey, setPlayKey] = useState(0);
  // 드래그 중엔 소리·채움을 멈추고, 놓으면 새 구간부터 다시 재생
  const [dragging, setDragging] = useState(false);
  const dragFrom = useRef({ x: 0, start: 0 });

  // 음파 스트립: 30초 = 창 폭(WINDOW_W)으로 환산한 전체 길이(px)
  const stripW = (durationSec / winSec) * WINDOW_W;
  const bars = useMemo(
    () => waveHeights(song.videoId ?? song.id, Math.min(1200, Math.round(stripW / BAR_PITCH))),
    [song.videoId, song.id, stripW],
  );
  const dots = getPopularPoints(durationSec);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragFrom.current = { x: e.clientX, start };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    // 스트립을 왼쪽으로 끌면(dx<0) 뒤 구간으로 이동
    const dx = e.clientX - dragFrom.current.x;
    const next = dragFrom.current.start - (dx / stripW) * durationSec;
    setStart(Math.round(Math.max(0, Math.min(maxStart, next))));
  };
  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    setPlayKey((k) => k + 1); // 구간 이동 → 채움·재생 초기화(새 구간부터)
  };

  const togglePlay = () => {
    setPlaying((p) => !p);
    setPlayKey((k) => k + 1); // 다시 재생 시 선택 시작점부터
  };

  // 타임라인 바 위 현재 창 위치(%)
  const winLeftPct = (start / durationSec) * 100;
  const winWidthPct = (winSec / durationSec) * 100;
  // 스트립 이동량: 창 왼쪽 모서리에 start 지점이 오도록
  const stripShift = (start / durationSec) * stripW;

  return (
    <div className="fixed inset-0 z-[140] grid place-items-center bg-black/60 px-[var(--gutter)]">
      <div className="w-full max-w-[356px] rounded-[28px] bg-[#1a1a1c] px-5 pb-7 pt-5">
        {/* 취소 · 완료 */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={onCancel} className="btn-text text-[var(--primary-lime)]">
            취소
          </button>
          <button
            type="button"
            onClick={() => onDone(start)}
            className="btn-text text-[var(--primary-lime)]"
          >
            완료
          </button>
        </div>

        {/* 앨범아트 + 곡 정보 */}
        <div className="mt-6 flex flex-col items-center gap-1">
          {song.thumbnail ? (
            <img src={song.thumbnail} alt="" className="h-[96px] w-[96px] rounded-[18px] object-cover" />
          ) : (
            <div className="h-[96px] w-[96px] rounded-[18px] bg-white" />
          )}
          <p className="body-1 mt-4 max-w-full truncate text-white">{song.title}</p>
          <p className="body-2 max-w-full truncate text-[#8a8a8a]">{song.artist}</p>
        </div>

        {/* ⓒ30 · 타임라인(많이 듣는 지점 점 표시 + 현재 창 위치) · 재생/일시정지 */}
        <div className="mt-7 flex items-center gap-3">
          <span className="body-2 grid h-[33px] w-[33px] shrink-0 place-items-center rounded-full border border-[#6a6a6e] text-[#9a9aa1]">
            30
          </span>
          <div className="relative h-1 min-w-0 flex-1 rounded-full bg-[#4a4a4e]">
            {/* 현재 선택 창 위치 */}
            <div
              className="absolute top-1/2 h-[7px] -translate-y-1/2 rounded-full bg-white"
              style={{ left: `${winLeftPct}%`, width: `${Math.max(winWidthPct, 3)}%` }}
            />
            {/* 많이 듣는 지점 (휴리스틱 — 실데이터 확보 시 musicApi 만 교체) */}
            {dots.map((d) => (
              <span
                key={d}
                className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary-lime)]"
                style={{ left: `${(d / durationSec) * 100}%` }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "일시정지" : "재생"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-black"
          >
            {playing ? (
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden>
                <rect x="2" y="1" width="3.4" height="12" rx="1.2" fill="currentColor" />
                <rect x="8.6" y="1" width="3.4" height="12" rx="1.2" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 14 14" className="ml-0.5 h-3.5 w-3.5" aria-hidden>
                <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        {/* 음파 스트립 — 창(중앙 고정) 밑으로 음파를 좌우 드래그해 구간 선택 */}
        <div
          className="relative mt-7 h-[56px] touch-none select-none overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* 움직이는 음파 — 창 왼쪽 모서리에 start 지점이 오도록 이동.
              ⚠️ 세로 중앙은 인라인 transform 의 -50% 하나로만 처리
              (-translate-y-1/2 클래스를 같이 쓰면 Tailwind v4 의 translate 속성과
               이중 적용돼 스트립이 위로 밀린다) */}
          <div
            className="absolute top-1/2 flex items-center"
            style={{
              left: "50%",
              width: `${stripW}px`,
              transform: `translate(${-WINDOW_W / 2 - stripShift}px, -50%)`,
              gap: `${BAR_PITCH - 3}px`,
            }}
          >
            {bars.map((h, i) => (
              <span
                key={i}
                className="w-[3px] shrink-0 rounded-full bg-white"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          {/* 고정 형광 창 (중앙) — 재생 중이면 안쪽이 30초 동안 차오름 */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] border-[3px] border-[var(--primary-lime)]"
            style={{ width: `${WINDOW_W}px` }}
          >
            {playing && !dragging && (
              <div
                key={playKey}
                className="h-full bg-[var(--primary-lime)]"
                style={{ animation: `hl-fill ${winSec}s linear forwards` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 소리 재생 — 유튜브 임베드(숨김), 선택 구간 30초만. 드래그 중엔 정지 */}
      {playing && !dragging && song.videoId && (
        <div className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0" aria-hidden>
          <iframe
            key={playKey}
            src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=${start}&end=${start + winSec}`}
            title={song.title}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </div>
  );
}
