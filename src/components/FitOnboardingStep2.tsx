import { useState } from "react";
import FitOnboardingShell from "./FitOnboardingShell";
import morning from "../assets/img/on5_img.png";
import night from "../assets/img/on6_img.png";
import together from "../assets/img/on7_img.png";
import alone from "../assets/img/on8_img.png";
import parkTrail from "../assets/img/on9_img.png";
import urban from "../assets/img/on10_img.png";

const styles = [
  { image: morning, label: "아침 러닝" },
  { image: night, label: "야간 러닝" },
  { image: together, label: "함께 달리기" },
  { image: alone, label: "혼자 조용히" },
  { image: parkTrail, label: "공원・트레일" },
  { image: urban, label: "도심 러닝" },
];

export default function FitOnboardingStep2({ onBack, onNext, onSkip }: { onBack?: () => void; onNext?: () => void; onSkip?: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set([1, 2]));

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
      step={2}
      title={
        <>
          어떤 러닝을
          <br />
          좋아하세요?
        </>
      }
      subtitle="여러 개 골라도 좋아요"
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
    >
      <div className="fit-onboarding__grid">
        {styles.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={`fit-onboarding__tile${selected.has(i) ? " fit-onboarding__tile--active" : ""}`}
            onClick={() => toggle(i)}
          >
            <img className="fit-onboarding__tile-img" src={s.image} alt="" />
            <div className="fit-onboarding__tile-scrim" />
            <span className="fit-onboarding__tile-label">{s.label}</span>
            {selected.has(i) && (
              <span className="fit-onboarding__tile-check" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l5 5L19 7" stroke="var(--text-on-lime)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </FitOnboardingShell>
  );
}
