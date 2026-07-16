import bgPhoto from "../assets/img/music-connect-bg.webp";

const services = ["Apple Music", "Spotify", "YouTube Music"];

// ── 음악연결하기 (Figma 944:130) ─────────────────────────────
// 러닝/지도 화면의 "음악 연결하기" 버튼으로 진입하는 선택 화면.
// 서비스를 고르면 onConnect로 연결 상태가 되어 미니 플레이어가 뜬다.
// 상태바는 상위 셸(App.tsx)이 이미 한 번 그리므로 여기서는 중복
// 렌더하지 않고, 시안 좌표에서 상태바+헤더(100px)를 뺀 값을 쓴다.
export default function MusicConnectPage({
  onClose,
  onConnect,
}: {
  onClose?: () => void;
  onConnect?: () => void;
}) {
  return (
    <div className="relative flex-1 overflow-hidden bg-black">
      <img src={bgPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="absolute inset-x-0 top-(--statusbar-h) flex h-12 items-center justify-end px-4.5 py-3">
        <button
          type="button"
          className="grid size-6 place-items-center"
          aria-label="닫기"
          onClick={onClose}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="absolute top-91.5 left-9.25 text-[35px] font-medium leading-[1.2] tracking-[-0.7px] whitespace-nowrap text-white">
        음악 서비스 선택
      </p>

      <div className="absolute top-127 left-9.25 flex w-85.5 flex-col gap-3">
        {services.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-[30px] bg-white py-4.25 text-center text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-[#131408]"
            onClick={onConnect}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
