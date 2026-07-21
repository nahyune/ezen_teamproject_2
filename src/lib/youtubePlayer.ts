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

/** 음악 화면이 뜰 때 미리 호출해 플레이어를 준비시킨다.
 *  ⚠️ 중요: 준비가 안 된 상태에서 탭하면, 로드를 기다리는 사이 "사용자 제스처"
 *  컨텍스트가 끊겨 모바일이 소리를 막는다. 그래서 미리 만들어 둬야 한다. */
export function warmUpPlayer() {
  void ensurePlayer().catch(() => {
    /* 로드 실패해도 앱 동작에는 지장 없음 */
  });
}

function start(p: YTPlayer, opts: PlayOptions) {
  endedHandler = opts.onEnded ?? null;
  p.loadVideoById({
    videoId: opts.videoId,
    startSeconds: opts.startSeconds,
    endSeconds: opts.endSeconds,
  });
  // 자동 음소거 정책 해제 — 사용자 제스처 흐름 안에서 호출돼야 소리가 난다.
  p.unMute();
  p.setVolume(100);
  p.playVideo();
}

type PlayOptions = {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  onEnded?: () => void;
};

/** 사용자 제스처(탭) 안에서 호출할 것 — 그래야 모바일에서 소리가 난다.
 *  플레이어가 이미 준비돼 있으면 동기적으로 즉시 재생해 제스처 컨텍스트를 유지한다.
 *  (아직 준비 전이면 준비되는 대로 재생 — 이 경우 모바일에선 무음일 수 있어,
 *   화면 진입 시 warmUpPlayer() 로 미리 준비해두는 것이 중요하다.) */
export function playSong(opts: PlayOptions): void {
  if (player) {
    start(player, opts); // 동기 경로 — 탭 핸들러 안에서 바로 실행
    return;
  }
  void ensurePlayer().then((p) => start(p, opts));
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
