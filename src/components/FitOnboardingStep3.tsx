import { useState, type ReactElement } from "react";
import FitOnboardingShell from "./FitOnboardingShell";

type Feature = {
  icon: ReactElement;
  title: string;
  subtitleLines: string[];
};

const features: Feature[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "기록・분석",
    subtitleLines: ["페이스, 거리, 경로를", "한눈에"],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    title: "코스 탐색",
    subtitleLines: ["내 근처 새로운", "러닝 코스 발견"],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 15.5c2.4 0.3 4 2 4 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "크루・커뮤니티",
    subtitleLines: ["함께 달릴", "러너들과 연결"],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="8" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1.2" fill="currentColor" />
        <circle cx="9" cy="14" r="1.4" fill="currentColor" />
        <circle cx="15" cy="14" r="1.4" fill="currentColor" />
      </svg>
    ),
    title: "AI 러닝 코치",
    subtitleLines: ["맞춤 훈련 계획과", "실시간 조언"],
  },
];

export default function FitOnboardingStep3({ onBack, onFinish }: { onBack?: () => void; onFinish?: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 3]));

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <FitOnboardingShell
      step={3}
      title={
        <>
          원하는 기능을
          <br />
          골라볼까요?
        </>
      }
      subtitle="선택에 맞춰 홈 화면을 구성해 드려요"
      onBack={onBack}
      onNext={onFinish}
      nextLabel="위런 시작하기"
      showSkip={false}
    >
      <div className="fit-onboarding__feature-grid">
        {features.map((f, i) => (
          <button
            key={f.title}
            type="button"
            className={`fit-onboarding__feature${selected.has(i) ? " fit-onboarding__feature--active" : ""}`}
            onClick={() => toggle(i)}
          >
            <span className="fit-onboarding__feature-top">
              <span className="fit-onboarding__feature-icon">{f.icon}</span>
              {selected.has(i) && (
                <span className="fit-onboarding__feature-check" aria-hidden>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l5 5L19 7" stroke="var(--text-on-lime)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </span>
            <span className="fit-onboarding__feature-title">{f.title}</span>
            <span className="fit-onboarding__feature-subtitle">
              {f.subtitleLines.map((line, li) => (
                <span key={line}>
                  {li > 0 && <br />}
                  {line}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </FitOnboardingShell>
  );
}
