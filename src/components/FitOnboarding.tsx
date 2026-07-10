import { useState, type ReactElement } from "react";
import FitOnboardingShell from "./FitOnboardingShell";

type Level = {
  icon: ReactElement;
  title: string;
  subtitle: string;
};

const levels: Level[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 21V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M12 12C12 12 6 12 6 6C12 6 12 12 12 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 9C12 9 18 9 18 3C12 3 12 9 12 9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "이제 시작했어요",
    subtitle: "아직 5km는 조금 멀게 느껴져요",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "꾸준히 달리는 중이에요",
    subtitle: "10km 정도는 무리 없이 달려요",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C12 2 6 8 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 12 17 10.5 16 9.5C16 11 15 12 14 12C15 8 12 5 12 2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "기록에 도전하고 있어요",
    subtitle: "하프・풀코스 대회를 준비해요",
  },
];

export default function FitOnboarding({ onBack, onNext, onSkip }: { onBack?: () => void; onNext?: () => void; onSkip?: () => void }) {
  const [selected, setSelected] = useState(0);

  return (
    <FitOnboardingShell
      step={1}
      title={
        <>
          러닝, 얼마나
          <br />
          해보셨어요?
        </>
      }
      subtitle="딱 맞는 코스와 챌린지를 추천해 드려요"
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
    >
      <div className="mt-7 [@media(max-height:700px)]:mt-[14px] flex flex-col gap-3 [@media(max-height:700px)]:gap-2">
        {levels.map((level, i) => {
          const active = i === selected;
          return (
            <button
              key={level.title}
              type="button"
              className={`relative flex items-center gap-3.5 py-4.5 px-4 rounded-card border-[1.5px] text-left ${
                active ? "bg-pill border-primary-lime" : "bg-elevated border-transparent"
              }`}
              onClick={() => setSelected(i)}
            >
              <span
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  active ? "bg-primary-lime/12 text-primary-lime" : "bg-white/6 text-[var(--text-muted)]"
                }`}
              >
                {level.icon}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold text-white">{level.title}</span>
                <span className="text-[13px] text-[var(--text-muted)]">{level.subtitle}</span>
              </span>
              {active && (
                <span className="ml-auto shrink-0 w-[22px] h-[22px] rounded-full bg-primary-lime flex items-center justify-center" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l5 5L19 7" stroke="var(--text-on-lime)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </FitOnboardingShell>
  );
}
