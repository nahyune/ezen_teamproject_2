import locationMapPreview from "../assets/img/location-permission-map.png";

// 온보딩 완료 직후 최초 진입 시 뜨는 iOS 스타일 위치 권한 안내 모달 (Figma 1187:528)
// "허용" 계열은 실제 geolocation 요청으로 이어지고(브라우저 네이티브 프롬프트가 뒤이어 뜬다),
// "허용 안 함"은 실제 API를 아예 호출하지 않는다.
export default function LocationPermissionDialog({
  onAllow,
  onDeny,
}: {
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-[var(--gutter)]">
      <div className="w-[270px] overflow-hidden rounded-[14px] bg-[rgba(37,37,37,0.96)] text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col items-center gap-[10px] bg-white/80 pt-[19px] backdrop-blur-xl">
          <p className="px-3 text-[13px] font-bold leading-[1.3] text-[#111]">
            "W:RUN"이(가) 위치 정보 접근을
            <br />
            요청합니다
          </p>
          <p className="px-3 text-[12px] leading-[1.3] text-[#202020]">
            위치 정보는 러닝 코스 추천과
            <br />
            기록 저장에 사용돼요
          </p>
          <div className="h-[268px] w-[286px]">
            <img src={locationMapPreview} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="h-px bg-white/15" />
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center bg-white/80 text-[15px] font-bold text-[#3487ff] backdrop-blur-xl active:bg-white/60"
          onClick={onAllow}
        >
          앱 사용 중에만 허용
        </button>

        <div className="h-px bg-white/15" />
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center bg-white/80 text-[15px] text-[#3487ff] backdrop-blur-xl active:bg-white/60"
          onClick={onAllow}
        >
          한 번만 허용
        </button>

        <div className="h-px bg-white/15" />
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center bg-white/80 text-[15px] text-[#3487ff] backdrop-blur-xl active:bg-white/60"
          onClick={onDeny}
        >
          허용 안 함
        </button>
      </div>
    </div>
  );
}
