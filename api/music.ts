// Vercel 서버리스 함수 — YouTube Data API v3 프록시 (음악 검색·추천·차트).
// ⚠️ API 키(YOUTUBE_API_KEY)는 이 서버 환경변수에서만 읽는다. 절대 프론트로 내려보내지 않음.
//    프론트(브라우저)는 이 /api/music 엔드포인트만 호출한다.
// 배포: Vercel 환경변수에 YOUTUBE_API_KEY 등록. 로컬 테스트는 `vercel dev`.
//
// 사용법:
//   /api/music?type=search&q=달리기            → { songs }
//   /api/music?type=recommend[&pageToken=..]   → { songs, nextPageToken }  (50개씩, 더 보기용)
//   /api/music?type=chart                      → { entries }               (한국 인기 음악 50)
export const config = { runtime: "edge" };

type Song = {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  videoId?: string;
  thumbnail?: string;
};

const env =
  (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process
    ?.env ?? {};

const YT = "https://www.googleapis.com/youtube/v3";
// 추천 = 러닝 음악 검색 결과로 구성 (플레이리스트 대신 개별 곡 videoId 확보 목적)
const RECOMMEND_QUERY = "러닝할 때 듣기 좋은 노래";

// ── 할당량 보호 캐시 — 같은 요청은 30분간 유튜브에 다시 묻지 않는다.
//    (검색 1회 = 100유닛, 하루 10,000유닛이라 캐시가 실질적 방어선)
const CACHE_TTL_MS = 30 * 60_000;
const cache = new Map<string, { at: number; body: unknown }>();

function cached(key: string): unknown | null {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.body;
  return null;
}
function store(key: string, body: unknown) {
  if (cache.size > 200) cache.clear(); // 메모리 보호 (edge 인스턴스)
  cache.set(key, { at: Date.now(), body });
}

// "곡"만 노출 — 10분 초과 영상은 믹스/플레이리스트 영상으로 보고 결과에서 제외
// (대표 러닝 "곡" 컨셉 유지 + 하이라이트 30초 설정 UI가 깨지지 않게)
const MAX_SONG_SEC = 600;

/** ISO8601 재생시간(PT3M52S) → 총 초 */
function isoToSec(iso?: string): number {
  if (!iso) return 0;
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/** ISO8601 재생시간(PT3M52S) → "3:52" */
function isoToMinSec(iso: string): string | undefined {
  const total = isoToSec(iso);
  if (!total) return undefined;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** 곡 길이 필터 — 재생시간을 모르면 통과, 10분 초과(믹스)·minSec 미만(쇼츠·티저)은 제외 */
function isSongLength(v: YtVideoItem, minSec = 0): boolean {
  const sec = isoToSec(v.contentDetails?.duration);
  return sec === 0 || (sec <= MAX_SONG_SEC && sec >= minSec);
}

/** "아티스트 - Topic" 자동생성 채널명 정리 */
const cleanArtist = (name: string) => name.replace(/\s*-\s*Topic$/i, "");

type YtVideoItem = {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
  };
  contentDetails?: { duration?: string };
};

function toSong(v: YtVideoItem): Song {
  return {
    id: v.id,
    title: v.snippet.title,
    artist: cleanArtist(v.snippet.channelTitle),
    duration: v.contentDetails?.duration ? isoToMinSec(v.contentDetails.duration) : undefined,
    videoId: v.id,
    thumbnail: v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.default?.url,
  };
}

/** videoId 목록 → videos.list 로 제목·채널·재생시간·썸네일 조회 */
async function fetchVideos(ids: string[], key: string, minSec = 0): Promise<Song[]> {
  if (ids.length === 0) return [];
  const res = await fetch(
    `${YT}/videos?part=snippet,contentDetails&id=${ids.join(",")}&key=${key}`,
  );
  const data = (await res.json()) as { items?: YtVideoItem[]; error?: { message?: string } };
  if (!res.ok) throw new Error(data.error?.message ?? "videos.list failed");
  return (data.items ?? []).filter((v) => isSongLength(v, minSec)).map(toSong);
}

/** search.list — 음악 카테고리 영상 검색 → videoId 확보 후 상세 조회.
 *  opts.videoDuration "short"(4분 미만) = 믹스 영상 대신 개별 곡 위주로 받기 */
async function searchVideos(
  q: string,
  key: string,
  maxResults: number,
  pageToken?: string,
  opts?: { videoDuration?: "short" | "medium" | "long"; minSec?: number },
): Promise<{ songs: Song[]; nextPageToken?: string }> {
  const params = new URLSearchParams({
    part: "id",
    type: "video",
    videoCategoryId: "10", // 음악
    maxResults: String(maxResults),
    q,
    key,
  });
  if (pageToken) params.set("pageToken", pageToken);
  if (opts?.videoDuration) params.set("videoDuration", opts.videoDuration);
  const res = await fetch(`${YT}/search?${params}`);
  const data = (await res.json()) as {
    items?: { id?: { videoId?: string } }[];
    nextPageToken?: string;
    error?: { message?: string };
  };
  if (!res.ok) throw new Error(data.error?.message ?? "search.list failed");
  const ids = (data.items ?? []).map((i) => i.id?.videoId).filter((v): v is string => !!v);
  return { songs: await fetchVideos(ids, key, opts?.minSec ?? 0), nextPageToken: data.nextPageToken };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const key = env.YOUTUBE_API_KEY;
  if (!key) {
    return Response.json({ error: "YOUTUBE_API_KEY not set on server" }, { status: 500 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  try {
    if (type === "search") {
      const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
      if (!q) return Response.json({ error: "q required" }, { status: 400 });
      const cacheKey = `search:${q}`;
      const hit = cached(cacheKey);
      if (hit) return Response.json(hit);
      const { songs } = await searchVideos(q, key, 25);
      const body = { songs };
      store(cacheKey, body);
      return Response.json(body);
    }

    if (type === "recommend") {
      const pageToken = url.searchParams.get("pageToken") ?? "";
      const cacheKey = `recommend:${pageToken}`;
      const hit = cached(cacheKey);
      if (hit) return Response.json(hit);
      // short(4분 미만) = 믹스 영상 대신 개별 곡 / 100초 미만(쇼츠·티저) 제외
      const body = await searchVideos(RECOMMEND_QUERY, key, 50, pageToken || undefined, {
        videoDuration: "short",
        minSec: 100,
      });
      store(cacheKey, body);
      return Response.json(body);
    }

    if (type === "chart") {
      const hit = cached("chart");
      if (hit) return Response.json(hit);
      // 한국 인기 음악 차트 — mostPopular + 음악 카테고리 (등락 정보는 API 미제공 → rank만)
      const res = await fetch(
        `${YT}/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=10&regionCode=KR&maxResults=50&key=${key}`,
      );
      const data = (await res.json()) as { items?: YtVideoItem[]; error?: { message?: string } };
      if (!res.ok) throw new Error(data.error?.message ?? "chart failed");
      // 10분 초과(믹스 영상) 제외 후 순위 재부여
      const entries = (data.items ?? [])
        .filter(isSongLength)
        .map((v, i) => ({ rank: i + 1, song: toSong(v) }));
      const body = { entries };
      store("chart", body);
      return Response.json(body);
    }

    return Response.json({ error: "invalid type" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
