import type { ReactNode } from "react";import { BackButton } from "./Icons";
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
    // min-h-full = 폰 프레임 높이 기준 (min-h-dvh 는 브라우저 창 기준이라 프레임을 넘쳐 스크롤을 만들었음).
    // 콘텐츠가 프레임보다 길어지는 예외 상황에만 그만큼 스크롤이 생긴다.
    <div className="self-start w-full max-w-[var(--frame-width)] min-h-full mx-auto bg-[var(--bg-app)] flex flex-col">
      {/* 상단(뒤로가기·진행표시~선택지)만 상태바 높이만큼 내림. 하단 버튼은 그 아래
          flex-1 스페이서가 차이를 흡수해 제자리에 유지된다. (모바일 0 / 웹 52px) */}
      <div className="flex-1 flex flex-col px-[var(--gutter)] pt-[var(--statusbar-h)]">
        <div className="flex items-center justify-between h-10 mt-2 [@media(max-height:700px)]:mt-1">
          <BackButton onClick={onBack} className="-ml-[6px]" />

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
