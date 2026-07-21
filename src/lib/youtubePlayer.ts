// 유튜브 IFrame Player API 공용 래퍼 — 앱 전체에서 플레이어 하나만 쓴다.
//
// 왜 필요한가: <iframe src="...&autoplay=1"> 방식은 모바일 브라우저가 "사용자가
// 직접 누른 재생"으로 보지 않아 소리를 강제로 음소거한다(재생은 되는데 무음).
// IFrame Player API 로 플레이어를 미리 만들어 두고, 사용자의 탭 핸들러 안에서
// unMute()+playVideo() 를 직접 호출하면 모바일에서도 소리가 난다.
//
// ⚠️ API 키가 필요 없다(임베드 재생은 공개 기능). 검색·차트용 YOUTUBE_API_KEY 와 무관.

type YTPlayer = {
  loadVideoById: (opts: { videoId: string; startSeconds?: number; endSeconds?: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let sdkPromise: Promise<YTNamespace> | null = null;

/** 유튜브 IFrame API 스크립트를 한 번만 로드한다. */
function loadSdk(): Promise<YTNamespace> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube IFrame API 로드 실패"));
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => reject(new Error("YouTube IFrame API 스크립트 로드 실패"));
    document.head.appendChild(tag);
  });
  return sdkPromise;
}

let player: YTPlayer | null = null;
let readyPromise: Promise<YTPlayer> | null = null;
/** 현재 재생이 끝났을 때 호출할 콜백 (재생 요청 때마다 교체) */
let endedHandler: (() => void) | null = null;

/** 플레이어를 한 번만 만들어 재사용한다. 화면 밖 1px 컨테이너에 붙인다(소리만 사용). */
function ensurePlayer(): Promise<YTPlayer> {
  if (readyPromise) return readyPromise;
  readyPromise = loadSdk().then(
    (YT) =>
      new Promise<YTPlayer>((resolve) => {
        const host = document.createElement("div");
        host.style.cssText =
          "position:fixed;bottom:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
        document.body.appendChild(host);
        const mount = document.createElement("div");
        host.appendChild(mount);

        const p = new YT.Player(mount, {
          width: "1",
          height: "1",
          playerVars: {
            playsinline: 1, // iOS 에서 전체화면으로 튀지 않게
            controls: 0,
            disablekb: 1,
          },
          events: {
            onReady: () => {
              player = p;
              resolve(p);
            },
            onStateChange: (e: { data: number }) => {
              if (e.data === YT.PlayerState.ENDED) endedHandler?.();
            },
          },
        });
      }),
  );
  return readyPromise;
}

/** 사용자 제스처(탭) 안에서 호출할 것 — 그래야 모바일에서 소리가 난다.
 *  start/end 를 주면 그 구간만 재생한다(하이라이트 30초 등). */
export async function playSong(opts: {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  onEnded?: () => void;
}): Promise<void> {
  const p = await ensurePlayer();
  endedHandler = opts.onEnded ?? null;
  p.loadVideoById({
    videoId: opts.videoId,
    startSeconds: opts.startSeconds,
    endSeconds: opts.endSeconds,
  });
  // 자동 음소거 정책 해제 — 반드시 사용자 제스처 흐름 안에서 호출돼야 한다.
  p.unMute();
  p.setVolume(100);
  p.playVideo();
}

/** 일시정지 (플레이어는 살려둬 다음 재생이 빠르다) */
export function pauseSong() {
  player?.pauseVideo();
}

/** 완전 정지 — 화면을 벗어날 때 등 */
export function stopSong() {
  endedHandler = null;
  player?.stopVideo();
}
