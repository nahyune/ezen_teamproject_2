import { StatusBar } from "./TopBars";
import BrandLogo from "./BrandLogo";
import type { OnboardingSlideData } from "../onboardingData";

export default function OnboardingSlide({ image, imageAlt, eyebrow, titleLines, descLines }: OnboardingSlideData) {
  return (
    <div className="relative shrink-0 grow-0 basis-full w-full h-full overflow-hidden bg-black snap-start">
      <img
        className="absolute inset-0 w-full h-full object-cover object-[90%_center] [-webkit-user-drag:none] select-none"
        src={image}
        alt={imageAlt}
      />
      {/* Bottom gradient so the headline/description stay legible over the photo */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/85 from-15% to-transparent pointer-events-none" />
      {/* Top gradient so the status bar/logo stay legible over bright skies etc. */}
      <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 top-0 z-[2]">
        <StatusBar />
      </div>

      <BrandLogo className="absolute top-[58px] left-[var(--gutter)] z-[2]" />

      <div className="absolute left-[var(--gutter)] right-[var(--gutter)] bottom-[40px] z-[2] text-white flex flex-col gap-4">
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
