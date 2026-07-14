import iconBack from "../assets/icons/guide-back.svg";
import iconShare from "../assets/icons/share.svg";
import iconMarker from "../assets/icons/finish-marker.svg";
import routeOutline from "../assets/icons/finish-route-1.svg";
import routeLine from "../assets/icons/finish-route-2.svg";
import finishMapImg from "../assets/img/finish-map.png";

function Stat({ value, label, suffix }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="flex w-27.5 flex-col items-center gap-1">
      <span className="flex items-center gap-1.25 font-display text-[36px] leading-[1.3] tracking-[-0.72px] whitespace-nowrap text-white">
        {value}
        {suffix && (
          <span className="font-sans text-[24px] tracking-[-0.48px] text-[#b1b1b1]">
            {suffix}
          </span>
        )}
      </span>
      <span className="text-[16px] leading-[1.3] tracking-[-0.48px] text-[#b1b1b1]">
        {label}
      </span>
    </div>
  );
}

// 완주 코스 지도 위 km 뱃지 위치 (카드 기준 px)
const kmBadges = [
  { label: "1 km", left: 292, top: 242 },
  { label: "2 km", left: 263, top: 292 },
  { label: "3 km", left: 185, top: 308 },
  { label: "4 km", left: 102, top: 264 },
  { label: "5 km", left: 52, top: 195 },
  { label: "6 km", left: 31, top: 114 },
  { label: "7 km", left: 126, top: 115 },
  { label: "8 km", left: 208, top: 162 },
];

// ── 기록 — 러닝완료 (Figma 411:5563) ────────────────────────
// 일시정지 화면에서 종료 버튼을 길게 누르면 나오는 결과 화면.
// 뒤로가기(<)를 누르면 기록하기 첫 화면으로 돌아간다.
export default function RunCompletePage({
  onBack,
  onCreateCard,
}: {
  onBack?: () => void;
  onCreateCard?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center bg-black">
      <header className="mt-3 flex w-full items-center justify-between px-4.5 py-4">
        <button type="button" className="size-6.5" aria-label="뒤로가기" onClick={onBack}>
          <img className="size-full" src={iconBack} alt="" />
        </button>
        <button type="button" className="size-6.5" aria-label="공유">
          <img className="size-full" src={iconShare} alt="" />
        </button>
      </header>

      {/* 총 거리 */}
      <p className="flex items-baseline gap-1.25 font-display leading-[1.3] whitespace-nowrap">
        <span className="text-[128px] tracking-[-2.56px] text-primary-lime">8.43</span>
        <span className="text-[36px] tracking-[-0.72px] text-[#b1b1b1]">KM</span>
      </p>

      {/* 6개 스탯 그리드 (2행 × 3열) */}
      <div className="mt-5 flex w-87.5 flex-col gap-8">
        <div className="flex items-start justify-between">
          <Stat value={`6'05"`} label="평균 페이스" />
          <Stat value="172" label="케이던스" />
          <Stat value="51:17" label="시간" />
        </div>
        <div className="flex items-start justify-between">
          <Stat value="512" label="칼로리" />
          <Stat value="12m" label="고도" />
          <Stat value="162" label="BPM" suffix="♡" />
        </div>
      </div>

      {/* 완주 코스 지도 카드 — 경로/뱃지가 지도 크롭에 맞춰져 있어
          이미지는 시안과 동일한 크기·위치로 고정한다 */}
      <div className="relative mt-8.5 mb-6 h-102.75 w-96.75 overflow-hidden rounded-card bg-white">
        <img
          className="absolute -top-27.5 -left-22.75 h-183.25 w-149.5 max-w-none object-cover opacity-67"
          src={finishMapImg}
          alt=""
          aria-hidden
        />

        <span className="absolute top-4.5 left-3.75 flex h-8.25 w-33.25 items-center justify-center rounded-[5px] bg-white text-[14px] leading-[1.3] tracking-[-0.42px] text-black">
          서울특별시, 대한민국
        </span>

        {/* 달린 경로 (외곽선 + 라임 라인) */}
        <div className="absolute top-28 left-13.25 h-50.5 w-71">
          <img className="absolute inset-[-2%] size-auto max-w-none h-[104%] w-[104%]" src={routeOutline} alt="" aria-hidden />
          <img className="absolute inset-[-2%] size-auto max-w-none h-[104%] w-[104%]" src={routeLine} alt="" aria-hidden />
        </div>

        {kmBadges.map((b) => (
          <span
            key={b.label}
            className="absolute flex h-5 w-12 items-center justify-center rounded-full bg-white text-center text-[14px] font-medium leading-[1.3] tracking-[-0.42px] whitespace-nowrap text-black"
            style={{ left: b.left, top: b.top }}
          >
            {b.label}
          </span>
        ))}

        <img
          className="absolute top-45.75 left-60.75 size-6"
          src={iconMarker}
          alt=""
          aria-hidden
        />
      </div>

      <button
        type="button"
        onClick={onCreateCard}
        className="mb-7 h-14 w-95.5 max-w-[calc(100%-48px)] rounded-[28px] bg-primary-lime text-[16px] font-semibold text-[#0f120c]"
      >
        기록 카드 만들기
      </button>
    </div>
  );
}
