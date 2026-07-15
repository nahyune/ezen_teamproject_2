import type { ReactNode } from "react";
import { StatusBarArea } from "./TopBars";
import { BackButton } from "./Icons";

export default function FitOnboardingShell({
  step,
  title,
  subtitle,
  onBack,
  onNext,
  onSkip,
  nextLabel = "다음",
  showSkip = true,
  children,
}: {
  step: 1 | 2 | 3 | 4;
  title: ReactNode;
  subtitle: string;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
  children: ReactNode;
}) {
  return (
    // h-full = 폰 프레임 높이에 고정 (min-h-full 이면 콘텐츠가 넘칠 때 이 컨테이너 자체가
    // 늘어나면서 헤더·CTA까지 함께 스크롤돼 버림 — h-full + 아래 리스트 영역만 overflow-y-auto
    // 로 분리해서 헤더/타이틀/CTA는 고정, 리스트만 안에서 스크롤되게 한다.)
    <div className="self-start w-full max-w-[var(--frame-width)] h-full mx-auto bg-[var(--bg-app)] flex flex-col">
      <StatusBarArea />

      <div className="flex-1 min-h-0 flex flex-col px-[var(--gutter)]">
        <div className="shrink-0 flex items-center justify-between h-10 mt-2 [@media(max-height:700px)]:mt-1">
          <BackButton onClick={onBack} className="-ml-[6px]" />

          <div className="flex items-center gap-2.5 font-display text-base leading-none" aria-hidden>
            <span className={step === 1 ? "text-primary-lime" : "text-white/30"}>01</span>
            <span className="w-4.5 h-px bg-white/25" />
            <span className={step === 2 ? "text-primary-lime" : "text-white/30"}>02</span>
            <span className="w-4.5 h-px bg-white/25" />
            <span className={step === 3 ? "text-primary-lime" : "text-white/30"}>03</span>
            <span className="w-4.5 h-px bg-white/25" />
            <span className={step === 4 ? "text-primary-lime" : "text-white/30"}>04</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
          <h1 className="mt-7 [@media(max-height:700px)]:mt-3.5 text-[28px] font-bold leading-[1.3] tracking-[-0.6px] text-white">
            {title}
          </h1>
          <p className="mt-2.5 [@media(max-height:700px)]:mt-1.5 text-sm text-(--text-muted)">{subtitle}</p>

          {children}
          <div className="h-6 [@media(max-height:700px)]:h-2" />
        </div>

        <div className="shrink-0 flex flex-col items-center gap-3.5 pb-3.5 [@media(max-height:700px)]:gap-2 [@media(max-height:700px)]:pb-2">
          <button
            className="w-full h-[58px] [@media(max-height:700px)]:h-[46px] rounded-[29px] bg-primary-lime text-black text-[17px] font-bold tracking-[-0.34px] active:scale-[0.99]"
            type="button"
            onClick={onNext}
          >
            {nextLabel}
          </button>
          {/* Always reserve the skip link's space, even when hidden, so the
              button above sits at the same position on every step. */}
          <button
            className="text-sm text-[var(--text-muted)]"
            type="button"
            onClick={onSkip}
            aria-hidden={!showSkip || undefined}
            style={showSkip ? undefined : { visibility: "hidden", pointerEvents: "none" }}
          >
            나중에 할게요
          </button>
          <div className="w-[134px] h-[5px] rounded-[3px] bg-white mt-1 [@media(max-height:700px)]:mt-0.5" />
        </div>
      </div>
    </div>
  );
}
