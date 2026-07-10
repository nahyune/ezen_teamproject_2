import type { ReactNode } from "react";
import { StatusBar } from "./TopBars";

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
  step: 1 | 2 | 3;
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
    <div className="self-start w-full max-w-[var(--frame-width)] min-h-dvh mx-auto bg-[var(--bg-app)] flex flex-col">
      <StatusBar />

      <div className="flex-1 flex flex-col px-[var(--gutter)]">
        <div className="flex items-center justify-between h-10 mt-2 [@media(max-height:700px)]:mt-1">
          <button
            className="w-8 h-8 flex items-center justify-center -ml-[6px] text-white"
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-[6px] text-[13px] font-bold tracking-[0.5px]" aria-hidden>
            <span className={step === 1 ? "text-primary-lime" : "text-[var(--text-muted)]"}>01</span>
            <span className="w-4 h-px bg-white/25" />
            <span className={step === 2 ? "text-primary-lime" : "text-[var(--text-muted)]"}>02</span>
            <span className="w-4 h-px bg-white/25" />
            <span className={step === 3 ? "text-primary-lime" : "text-[var(--text-muted)]"}>03</span>
          </div>
        </div>

        <h1 className="mt-7 [@media(max-height:700px)]:mt-[14px] text-[28px] font-bold leading-[1.3] tracking-[-0.6px] text-white">
          {title}
        </h1>
        <p className="mt-[10px] [@media(max-height:700px)]:mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>

        {children}

        <div className="flex-1 min-h-[24px] [@media(max-height:700px)]:min-h-[8px]" />

        <div className="flex flex-col items-center gap-3.5 pb-3.5 [@media(max-height:700px)]:gap-2 [@media(max-height:700px)]:pb-2">
          <button
            className="w-full h-[58px] [@media(max-height:700px)]:h-[46px] rounded-[29px] bg-primary-lime text-black text-[17px] font-bold tracking-[-0.34px] shadow-[0_0_32px_rgba(212,255,63,0.35)] active:scale-[0.99]"
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
