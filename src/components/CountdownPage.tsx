import { useEffect, useState } from "react";
import { BackButton } from "./Icons";

// ── 기록 — 카운트다운 (Figma 411:5554) ──────────────────────
// 시작 버튼을 누르는 즉시 3이 뜨고, 1초 간격으로 2 → 1 로 바뀐 뒤
// onDone(러닝 화면 전환)을 호출한다. 숫자는 key 교체로 매번
// count-pop 애니메이션(작았다가 커짐)이 다시 재생된다.
export default function CountdownPage({ onDone, onBack }: { onDone: () => void; onBack?: () => void }) {
  const [count, setCount] = useState(3);
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    if (confirmExit) return;
    if (count === 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onDone, confirmExit]);

  return (
    <div className="relative flex-1 bg-primary-lime">
      <BackButton
        onClick={() => setConfirmExit(true)}
        color="text-[#131408]"
        className="absolute top-[calc(var(--statusbar-h)+18px)] left-[18px] z-10"
      />
      <p className="absolute top-54.75 left-1/2 -translate-x-1/2 font-display text-[14px] tracking-[0.84px] whitespace-nowrap text-[#131408]">
        READY TO RUN©
      </p>
      {/* key가 바뀔 때마다 애니메이션이 처음부터 다시 실행된다 */}
      <p
        key={count}
        className="animate-count-pop absolute top-[230px] left-1/2 -translate-x-1/2 font-display text-[300px] leading-[normal] text-black"
      >
        {Math.max(count, 1)}
      </p>

      {/* 뒤로가기 → 카운트다운 중단 확인 (Figma 675:189) */}
      {confirmExit && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="w-85 rounded-3xl border border-pill-border bg-elevated px-6 pt-[67.5px] pb-8.5">
            <p className="text-center text-[20px] font-bold leading-[1.3] text-[var(--text-strong)]">
              벌써 그만 두시게요?
            </p>
            <p className="mt-4 text-center text-[14px] leading-[1.4] text-white/65">
              신발끈까지 다 묶었는데!
              <br />
              오늘 목표까지 딱 한 걸음이에요
            </p>
            <button
              type="button"
              onClick={() => setConfirmExit(false)}
              className="mt-6.5 h-13 w-full rounded-full bg-primary-lime text-[16px] font-semibold text-[#0f120c]"
            >
              계속 달릴래요
            </button>
            <button
              type="button"
              onClick={onBack}
              className="mt-2.5 h-11 w-full text-[14px] text-white/50"
            >
              그만할래요
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
