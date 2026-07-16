// 음악 API 클라이언트 — 프론트는 /api/music 만 호출한다(YouTube 키는 서버에만 존재).
// ⚠️ 로컬 vite(npm run dev)엔 /api/music 이 없어 404 — 그땐 목데이터로 폴백해
//    화면·더 보기·저장 흐름은 그대로 확인할 수 있다. 배포(또는 `vercel dev`)에선 실데이터.

export type Song = {
  id: string;
  title: string;
  artist: string;
  /** 재생 시간 표기 (예: "3:52") */
  duration?: string;
  /** 유튜브 videoId — 있으면 IFrame 플레이어로 실제 재생 가능 */
  videoId?: string;
  /** 앨범아트 URL — 없으면 회색 플레이스홀더 */
  thumbnail?: string;
  /** 프로필 하이라이트 재생 시작 지점(초) — 이 지점부터 30초만 재생 */
  highlightStart?: number;
};

/** 하이라이트 구간 길이(초) — 인스타식 프로필 대표곡 미리듣기 */
export const HIGHLIGHT_SEC = 30;

/** "3:52" → 232(초). 없거나 못 읽으면 210초(3:30) 가정 */
export function durationToSec(d?: string): number {
  if (!d) return 210;
  const sec = d.split(":").reduce((acc, p) => acc * 60 + Number(p), 0);
  return Number.isFinite(sec) && sec > 0 ? sec : 210;
}

// ── "가장 많이 듣는 구간" (A안: 휴리스틱) ────────────────────────
// 유튜브 공식 API는 Most Replayed 데이터를 제공하지 않는다.
// 대중가요 후렴이 통계적으로 곡의 30~45% 지점에 오는 점을 이용한 기본값 —
// 실데이터(비공식 히트맵 등)를 확보하면 ⚠️ 아래 두 함수만 교체하면 된다.

/** 많이 듣는 구간 후보(초) — 타임라인 바의 점 표시용. [0]이 최고 인기 지점 */
export function getPopularPoints(durationSec: number): number[] {
  return [Math.round(durationSec * 0.35), Math.round(durationSec * 0.62)];
}

/** 최초 선택 하이라이트 시작(초) — 최고 인기 지점, 끝 넘침 방지 클램프 */
export function getDefaultHighlight(durationSec: number): number {
  return Math.min(getPopularPoints(durationSec)[0], Math.max(0, durationSec - HIGHLIGHT_SEC));
}

/** 인기 상승 차트 항목 — rank 순위, delta 등락(▲/▼, 유튜브 API 미제공이라 현재 rank만) */
export type ChartEntry = { rank: number; delta?: "up" | "down"; song: Song };

// ── 서버 호출 공통 ────────────────────────────────────────────
async function fetchMusic<T>(params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params);
  const res = await fetch(`/api/music?${qs}`);
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `요청 실패 (${res.status})`);
  return data;
}

// ── 목데이터 (API 폴백 — 로컬 dev·키 미설정에서도 화면이 살아있게) ──
const RECO_POOL: [string, string][] = [
  ["이 순간이 소중해", "mellozen"],
  ["Run Boy Run", "Woodkid"],
  ["달리기", "옥상달빛"],
  ["Eye of the Tiger", "Survivor"],
  ["Runaway", "AURORA"],
  ["출발", "김동률"],
  ["Blinding Lights", "The Weeknd"],
  ["바람이 되어", "이수"],
  ["너에게 닿기를", "10CM"],
  ["비행기", "거북이"],
  ["바람이 불어오는 곳", "김광석"],
  ["집에 가고 싶다", "원예송"],
  ["여름 안에서", "듀스 (DEUX)"],
  ["Stronger", "Kanye West"],
  ["Can't Stop", "Red Hot Chili Peppers"],
  ["질풍가도", "유정석"],
];
const MOCK_TOTAL = 150;

function mockSongs(offset: number, limit: number): Song[] {
  const end = Math.min(offset + limit, MOCK_TOTAL);
  const songs: Song[] = [];
  for (let i = offset; i < end; i++) {
    const [title, artist] = RECO_POOL[i % RECO_POOL.length];
    const sec = 130 + ((i * 37) % 150); // 2:10 ~ 4:39 분산
    songs.push({
      id: `r${i}`,
      title,
      artist,
      duration: `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`,
    });
  }
  return songs;
}

// ── 검색 ──────────────────────────────────────────────────────
export async function searchSongs(query: string): Promise<Song[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const { songs } = await fetchMusic<{ songs: Song[] }>({ type: "search", q });
    return songs;
  } catch {
    // 폴백: 목데이터 필터
    const lower = q.toLowerCase();
    return mockSongs(0, MOCK_TOTAL).filter(
      (s) => s.title.toLowerCase().includes(lower) || s.artist.toLowerCase().includes(lower),
    );
  }
}

// ── 추천 (50개씩 더 보기) ─────────────────────────────────────
// 유튜브는 offset 이 아니라 pageToken 방식이라, 토큰을 모듈에 기억해두고
// offset===0(첫 페이지)이면 리셋한다 — 화면 쪽 코드는 offset 그대로 사용.
let recoNextToken: string | undefined;

export async function getRecommendedSongs(
  offset = 0,
  limit = 50,
): Promise<{ songs: Song[]; hasMore: boolean }> {
  try {
    if (offset === 0) recoNextToken = undefined;
    else if (!recoNextToken) return { songs: [], hasMore: false };
    const { songs, nextPageToken } = await fetchMusic<{ songs: Song[]; nextPageToken?: string }>(
      recoNextToken ? { type: "recommend", pageToken: recoNextToken } : { type: "recommend" },
    );
    recoNextToken = nextPageToken;
    return { songs, hasMore: !!nextPageToken };
  } catch {
    // 폴백: 목데이터 페이지네이션
    const songs = mockSongs(offset, limit);
    return { songs, hasMore: offset + limit < MOCK_TOTAL };
  }
}

// ── 인기 차트 (한국 인기 음악 50) ─────────────────────────────
export async function getTrendingSongs(): Promise<ChartEntry[]> {
  try {
    const { entries } = await fetchMusic<{ entries: ChartEntry[] }>({ type: "chart" });
    return entries;
  } catch {
    // 폴백: 빈 차트 (시트가 "API 연결 후 표시" 안내를 보여줌)
    return [];
  }
}

// ── 저장됨(북마크) — 로컬 보관 ────────────────────────────────
const SAVED_KEY = "wrun-saved-songs";

export function loadSavedSongs(): Song[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]") as Song[];
  } catch {
    return [];
  }
}

export function persistSavedSongs(songs: Song[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(songs));
  } catch {
    // 저장 실패해도 동작엔 지장 없음
  }
}
