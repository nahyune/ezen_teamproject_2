import BrandLogo from "./BrandLogo";
import type { OnboardingSlideData } from "../onboardingData";

export default function OnboardingSlide({ image, imageAlt, eyebrow, titleLines, descLines }: OnboardingSlideData) {
  return (
    // snap-always: 터치 플링이 아무리 세도 다음 슬라이드에서 반드시 멈춤 (건너뛰기 방지)
    <div className="relative shrink-0 grow-0 basis-full w-full h-full overflow-hidden bg-[var(--bg-app)] snap-start snap-always">
      <img
        className="absolute inset-0 w-full h-full object-cover object-[90%_center] [-webkit-user-drag:none] select-none"
        src={image}
        alt={imageAlt}
      />
      {/* Bottom gradient: 텍스트 가독성 + 이미지 하단 경계 제거.
          목표색을 순검정이 아니라 앱 배경색(--bg-app)으로 맞춰,
          사진 끝이 배경과 정확히 같은 색으로 녹아 단차가 안 보이게 한다. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--bg-app) 0%, var(--bg-app) 18%, color-mix(in srgb, var(--bg-app) 60%, transparent) 45%, transparent 100%)",
        }}
      />
      {/* Top gradient so the status bar/logo stay legible over bright skies etc. */}
      <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 top-0 z-[2]">
      </div>

      <BrandLogo className="absolute top-[58px] left-[var(--gutter)] z-[2]" />

      <div className="absolute left-[var(--gutter)] right-[var(--gutter)] bottom-2.25 z-[2] text-white flex flex-col gap-4">
        <p className="font-semibold text-sm leading-[1.3] tracking-[2.1px] text-primary-lime">{eyebrow}</p>
        <h1 className="font-display font-light text-[64px] leading-none text-white">
          {titleLines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <p className="text-base leading-[1.3] tracking-[-0.48px] text-white opacity-85">
          {descLines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
