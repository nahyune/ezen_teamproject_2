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
      <div className="mt-7 [@media(max-height:700px)]:mt-[14px] grid grid-cols-2 gap-[14px] [@media(max-height:700px)]:gap-2">
        {styles.map((s, i) => {
          const active = selected.has(i);
          return (
            <button
              key={s.label}
              type="button"
              className={`relative aspect-[16/10] rounded-2xl overflow-hidden bg-elevated border-[1px] ${
                active ? "border-primary-lime shadow-[0_0_20px_rgba(212,255,63,0.25)]" : "border-transparent"
              }`}
              onClick={() => toggle(i)}
            >
              <img
                className={`absolute inset-0 w-full h-full object-cover ${active ? "" : "brightness-[0.55]"}`}
                src={s.image}
                alt=""
              />
              <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/75 from-10% to-transparent pointer-events-none" />
              <span
                className={`absolute left-3 bottom-[10px] text-sm font-semibold tracking-[-0.3px] ${
                  active ? "text-primary-lime" : "text-white"
                }`}
              >
                {s.label}
              </span>
              {active && (
                <span
                  className="absolute top-[10px] right-[10px] w-[22px] h-[22px] rounded-full bg-primary-lime flex items-center justify-center"
                  aria-hidden
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l5 5L19 7" stroke="var(--text-on-lime)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
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
