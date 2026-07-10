import type { ReactNode } from "react";
import { StatusBar } from "./TopBars";
import "./FitOnboarding.css";

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
    <div className="fit-onboarding">
      <StatusBar />

      <div className="fit-onboarding__body">
        <div className="fit-onboarding__header">
          <button className="fit-onboarding__back" type="button" onClick={onBack} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="fit-onboarding__steps" aria-hidden>
            <span className={`fit-onboarding__step${step === 1 ? " fit-onboarding__step--active" : ""}`}>01</span>
            <span className="fit-onboarding__step-dash" />
            <span className={`fit-onboarding__step${step === 2 ? " fit-onboarding__step--active" : ""}`}>02</span>
            <span className="fit-onboarding__step-dash" />
            <span className={`fit-onboarding__step${step === 3 ? " fit-onboarding__step--active" : ""}`}>03</span>
          </div>
        </div>

        <h1 className="fit-onboarding__title">{title}</h1>
        <p className="fit-onboarding__subtitle">{subtitle}</p>

        {children}

        <div className="fit-onboarding__spacer" />

        <div className="fit-onboarding__footer">
          <button className="fit-onboarding__next" type="button" onClick={onNext}>
            {nextLabel}
          </button>
          {showSkip && (
            <button className="fit-onboarding__skip" type="button" onClick={onSkip}>
              나중에 할게요
            </button>
          )}
          <div className="fit-onboarding__home-indicator" />
        </div>
      </div>
    </div>
  );
}
