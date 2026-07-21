import { useEffect, useState } from "react";
import {
  searchSongs,
  getRecommendedSongs,
  getTrendingSongs,
  loadSavedSongs,
  persistSavedSongs,
  durationToSec,
  getDefaultHighlight,
  HIGHLIGHT_SEC,
  type Song,
  type ChartEntry,
} from "../lib/musicApi";
import { playSong, pauseSong, stopSong, warmUpPlayer } from "../lib/youtubePlayer";

// ── 음악 찾기 바텀시트 (Figma 149:220) ─────────────────────────────
// 아래에서 스르륵 올라오는 오버레이. 상단 핸들 바(디자인 보완)를 탭하면 닫힌다.
// 탭: 추천 / 인기 상승(레이아웃만 — 차트 API 연결 시 표시) / 저장됨(북마크).
// 곡 행을 탭하면 하단 미리듣기 바가 떠서 인기 파트(30초)가 먼저 재생되고(인스타식),
// 미리듣기 바의 → 버튼을 눌러야 onPick 으로 확정된다. 북마크는 저장/해제(로컬 보관).

type Tab = "recommend" | "trending" | "saved";

const TABS: { key: Tab; label: string }[] = [
  { key: "recommend", label: "추천" },
  { key: "trending", label: "인기 상승" },
  { key: "saved", label: "저장됨" },
];

/** 북마크 아이콘 — 표지(61px)보다 작게 20px. filled=저장됨 / stroke=미저장 */
function BookmarkIcon({ filled, className = "h-5 w-4" }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={className} aria-hidden>
      <path
        d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v16l-6.5-4.6L1.5 18.5v-16Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 곡 한 행 — 표지 61 r10 + 제목16/아티스트·시간14 + 북마크. rank 주면 순위 컬럼 표시 */
function SongRow({
  song,
  rank,
  delta,
  saved,
  previewing,
  onPick,
  onToggleSave,
}: {
  song: Song;
  rank?: number;
  delta?: "up" | "down";
  saved: boolean;
  /** 지금 하단 바에서 미리듣기 중인 곡 — 제목 형광 표시 */
  previewing?: boolean;
  onPick: () => void;
  onToggleSave: () => void;
}) {
  return (
    <li className="flex items-center gap-3">
      {/* 순위 컬럼 (인기 상승 탭) — API 데이터가 오면 여기 표시됨 */}
      {rank !== undefined && (
        <div className="flex w-6 shrink-0 flex-col items-center gap-0.5">
          <span className="body-1 text-white">{rank}</span>
          {delta === "up" && (
            <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 text-[#2ecc40]" aria-hidden>
              <path d="M5 0l5 6H0z" fill="currentColor" />
            </svg>
          )}
          {delta === "down" && (
            <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 text-[#ff4136]" aria-hidden>
              <path d="M5 6L0 0h10z" fill="currentColor" />
            </svg>
          )}
        </div>
      )}

      <button type="button" onClick={onPick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        {/* 표지 — API 연결 시 thumbnail 표시, 없으면 회색 플레이스홀더 */}
        {song.thumbnail ? (
          <img src={song.thumbnail} alt="" className="h-[61px] w-[61px] shrink-0 rounded-[10px] object-cover" />
        ) : (
          <div className="h-[61px] w-[61px] shrink-0 rounded-[10px] bg-[#dedede]" />
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <span className={`body-1 truncate ${previewing ? "text-[var(--primary-lime)]" : "text-white"}`}>
            {song.title}
          </span>
          <span className="body-2 truncate text-[#9a9aa1]">
            {song.artist}
            {song.duration ? ` · ${song.duration}` : ""}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onToggleSave}
        aria-label={saved ? "저장 해제" : "저장"}
        className="shrink-0 p-1 text-white"
      >
        <BookmarkIcon filled={saved} />
      </button>
    </li>
  );
}

export default function MusicSearchSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  /** 곡 선택 (대표 러닝곡 추가/교체) */
  onPick: (song: Song) => void;
}) {
  const [tab, setTab] = useState<Tab>("recommend");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);
  const [recommended, setRecommended] = useState<Song[]>([]);
  // 추천 페이지네이션 — 50개씩, "더 보기"를 누르면 다음 50개를 이어 붙인다.
  const [recoHasMore, setRecoHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [trending, setTrending] = useState<ChartEntry[]>([]);
  const [saved, setSaved] = useState<Song[]>(loadSavedSongs);
  // 미리듣기 — 곡 행을 탭하면 하단 바에서 인기 파트 30초 재생 (인스타식)
  const [preview, setPreview] = useState<Song | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  // 열릴 때 추천(첫 50개)·차트 로드 + 검색·미리듣기 초기화 (닫힐 때도 재생 정지)
  useEffect(() => {
    setPreview(null);
    setPreviewPlaying(false);
    stopSong(); // 시트를 열고 닫을 때 이전 미리듣기 소리를 끊는다
    if (!open) return;
    warmUpPlayer(); // 곡 행 탭 순간 즉시 재생되도록 미리 준비
    setQuery("");
    setTab("recommend");
    getRecommendedSongs(0).then(({ songs, hasMore }) => {
      setRecommended(songs);
      setRecoHasMore(hasMore);
    });
    getTrendingSongs().then(setTrending);
  }, [open]);

  /** 인기 파트(30초) 미리듣기 — 곡 행 탭 핸들러 안에서 바로 재생을 호출해야
   *  모바일에서 음소거되지 않는다. */
  const startPreview = (song: Song) => {
    setPreview(song);
    setPreviewPlaying(true);
    if (!song.videoId) return;
    const hs = song.highlightStart ?? getDefaultHighlight(durationToSec(song.duration));
    playSong({
      videoId: song.videoId,
      startSeconds: hs,
      endSeconds: hs + HIGHLIGHT_SEC,
      onEnded: () => setPreviewPlaying(false),
    });
  };

  // 더 보기 — 현재 개수를 offset 으로 다음 50개 요청 (API 연결 후에도 동일)
  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const { songs, hasMore } = await getRecommendedSongs(recommended.length);
      setRecommended((prev) => [...prev, ...songs]);
      setRecoHasMore(hasMore);
    } finally {
      setLoadingMore(false);
    }
  };

  // 검색 (디바운스 300ms) — 입력 중이면 탭 대신 검색 결과 표시
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        setResults(await searchSongs(q));
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const isSaved = (song: Song) => saved.some((s) => s.id === song.id);
  const toggleSave = (song: Song) => {
    const next = isSaved(song) ? saved.filter((s) => s.id !== song.id) : [...saved, song];
    setSaved(next);
    persistSavedSongs(next);
  };

  const rowProps = (song: Song) => ({
    song,
    saved: isSaved(song),
    previewing: preview?.id === song.id,
    // 행 탭 = 바로 추가가 아니라 미리듣기 (확정은 하단 바의 → 버튼)
    onPick: () => startPreview(song),
    onToggleSave: () => toggleSave(song),
  });

  const searchMode = query.trim().length > 0;

  return (
    <>
      {/* 백드롭 — 탭하면 닫힘 */}
      <div
        className={`fixed inset-0 z-[130] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* 시트 — 상태바 아래에서 시작, 아래에서 스르륵 */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[var(--statusbar-h)] z-[131] flex flex-col rounded-t-[20px] bg-[#191b1f] transition-transform duration-300 ${
          open ? "translate-y-0" : "invisible translate-y-full"
        }`}
        role="dialog"
        aria-label="음악 찾기"
        aria-hidden={!open || undefined}
      >
        {/* 핸들 바 — 디자인 보완: 시트 상단 중앙, 탭하면 닫힘 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex w-full shrink-0 justify-center pb-2 pt-3"
        >
          <span className="h-1 w-10 rounded-full bg-white/25" />
        </button>

        {/* 검색 인풋 */}
        <div className="shrink-0 px-[var(--gutter)] pt-1">
          <input
            className="body-1 h-[47px] w-full rounded-[12px] bg-[#2a3036] px-4 text-white outline-0 placeholder:text-[#9a9aa1]"
            placeholder="음악 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* 칩 탭 — 활성: 흰 배경/검정 글씨 */}
        <div className="mt-6 flex shrink-0 gap-2 px-[var(--gutter)]">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`body-1 h-[35px] rounded-[8px] px-3 ${
                tab === key && !searchMode ? "bg-white text-black" : "bg-[#2a3036] text-[#9a9aa1]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 목록 영역 */}
        <div className="mt-6 flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)] pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {searchMode ? (
            searching ? (
              <p className="body-2 text-[#9a9aa1]">검색 중…</p>
            ) : results.length ? (
              <ul className="flex flex-col gap-5">
                {results.map((song) => (
                  <SongRow key={song.id} {...rowProps(song)} />
                ))}
              </ul>
            ) : (
              <p className="body-2 text-[#9a9aa1]">검색 결과가 없어요.</p>
            )
          ) : tab === "recommend" ? (
            <>
              <ul className="flex flex-col gap-5">
                {recommended.map((song) => (
                  <SongRow key={song.id} {...rowProps(song)} />
                ))}
              </ul>
              {/* 더 보기 — 레퍼런스처럼 목록 맨 아래 행, 누르면 50개 추가 */}
              {recoHasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="mt-5 flex w-full items-center justify-between py-2"
                >
                  <span className="body-1 text-white">{loadingMore ? "불러오는 중…" : "더 보기"}</span>
                  <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5 text-[#9a9aa1]" aria-hidden>
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </>
          ) : tab === "trending" ? (
            trending.length ? (
              <ul className="flex flex-col gap-5">
                {trending.map(({ rank, delta, song }) => (
                  <SongRow key={song.id} rank={rank} delta={delta} {...rowProps(song)} />
                ))}
              </ul>
            ) : (
              // 레이아웃만 준비 — 음악 API 연결 시 순위+등락 화살표로 채워짐
              <p className="body-2 mt-10 text-center text-[#9a9aa1]">
                인기 차트는 음악 API 연결 후 표시돼요.
              </p>
            )
          ) : saved.length ? (
            <ul className="flex flex-col gap-5">
              {saved.map((song) => (
                <SongRow key={song.id} {...rowProps(song)} />
              ))}
            </ul>
          ) : (
            /* 저장됨 빈 상태 — 레퍼런스(이미지4) 응용 */
            <div className="flex flex-col items-center gap-2 pt-24 text-center">
              <span className="mb-2 grid h-[72px] w-[72px] place-items-center rounded-full bg-[#2a3036] text-white">
                <BookmarkIcon filled={false} className="h-6 w-5" />
              </span>
              <p className="text-lg font-semibold tracking-[-0.36px] text-white">저장한 오디오 없음</p>
              <p className="body-2 text-[#9a9aa1]">즐겨 찾는 오디오를 저장하여 더 간편하게 이용하세요.</p>
            </div>
          )}
        </div>

        {/* 미리듣기 바 (인스타식) — 인기 파트 30초 재생 중, → 로 곡 확정 */}
        {preview && (
          <div className="shrink-0 px-3 pb-4 pt-1">
            <div className="flex items-center gap-3 rounded-2xl bg-[#2a3036] p-2.5">
              {preview.thumbnail ? (
                <img src={preview.thumbnail} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="h-11 w-11 shrink-0 rounded-lg bg-[#dedede]" />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="body-1 truncate text-white">{preview.title}</span>
                <span className="body-2 truncate text-[#9a9aa1]">{preview.artist}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (previewPlaying) {
                    pauseSong();
                    setPreviewPlaying(false);
                  } else {
                    startPreview(preview); // 탭 안에서 직접 재생 → 모바일 소리 확보
                  }
                }}
                aria-label={previewPlaying ? "일시정지" : "재생"}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black"
              >
                {previewPlaying ? (
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
              {/* → 확정 — 공용 꺽쇠 아이콘, 곡 추가 + 하이라이트 설정으로 이동 */}
              <button
                type="button"
                onClick={() => onPick(preview)}
                aria-label="이 곡으로 선택"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black"
              >
                <svg viewBox="0 0 14 14" fill="none" className="h-4 w-4" aria-hidden>
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 미리듣기 소리는 공용 유튜브 플레이어(lib/youtubePlayer)가 담당 —
          곡 행·▶ 탭 핸들러 안에서 직접 호출해야 모바일에서 음소거되지 않는다. */}
    </>
  );
}
