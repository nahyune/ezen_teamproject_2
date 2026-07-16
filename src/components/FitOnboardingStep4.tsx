import { useState } from "react";
import FitOnboardingShell from "./FitOnboardingShell";
import runner5 from "../assets/img/runner5.webp";
import runner6 from "../assets/img/runner6.webp";
import runner1 from "../assets/img/runner1.webp";
import runner2 from "../assets/img/runner2.webp";

type CrewOption = {
  title: string;
  meta: string;
  image?: string;
  badge?: string;
};

const options: CrewOption[] = [
  { title: "성수 새벽런 크루", meta: "매일 새벽 6시", image: runner5, badge: "인기" },
  { title: "한강 브릿지런", meta: "주 3회 저녁", image: runner6 },
  { title: "여의도 러너스", meta: "토·일 오전 7시", image: runner1 },
  { title: "한강 새벽런 크루", meta: "매일 5시 50분", image: runner2 },
  { title: "나중에 정할게요", meta: "언제든 다시 선택할 수 있어요" },
];

export default function FitOnboardingStep4({ onBack, onFinish }: { onBack?: () => void; onFinish?: () => void }) {
  const [selected, setSelected] = useState(0);

  return (
    <FitOnboardingShell
      step={4}
      title={
        <>
          관심 있는
          <br />
          크루가 있나요?
        </>
      }
      subtitle="AI 러니가 함께 달리기 좋은 러닝 크루를 찾아봤어요"
      onBack={onBack}
      onNext={onFinish}
      nextLabel="위런 시작하기"
      showSkip={false}
    >
      <div className="mt-7 [@media(max-height:700px)]:mt-[14px] flex flex-col gap-3 [@media(max-height:700px)]:gap-2">
        {options.map((option, i) => {
          const active = i === selected;
          return (
            <button
              key={option.title}
              type="button"
              className={`relative flex items-center gap-3.5 py-4 px-4.5 rounded-card bg-elevated text-left ${
                active ? "border border-primary-lime" : "border border-white/6"
              }`}
              onClick={() => setSelected(i)}
            >
              <span className="relative shrink-0 w-13 h-13">
                <span className="w-full h-full rounded-full overflow-hidden bg-[#2c2c30] flex items-center justify-center">
                  {option.image ? (
                    <img className="w-full h-full object-cover" src={option.image} alt="" />
                  ) : (
                    <svg width="24" height="6" viewBox="0 0 24 6" fill="none" aria-hidden>
                      <circle cx="3" cy="3" r="3" fill="white" fillOpacity="0.6" />
                      <circle cx="12" cy="3" r="3" fill="white" fillOpacity="0.6" />
                      <circle cx="21" cy="3" r="3" fill="white" fillOpacity="0.6" />
                    </svg>
                  )}
                </span>
                {option.badge && (
                  <span className="absolute -bottom-1 -right-1.5 px-2 py-0.75 rounded-full bg-primary-lime text-[11px] font-bold text-black whitespace-nowrap">
                    {option.badge}
                  </span>
                )}
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="text-base font-semibold text-white">{option.title}</span>
                <span className="text-sm text-[var(--text-muted)]">{option.meta}</span>
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
