import { useEffect, useState } from "react";
import { ChevronLeft } from "./Icons";

// ── 기록 — 카운트다운 (Figma 411:5554) ──────────────────────
// 시작 버튼을 누르는 즉시 3이 뜨고, 1초 간격으로 2 → 1 로 바뀐 뒤
// onDone(러닝 화면 전환)을 호출한다. 숫자는 key 교체로 매번
// count-pop 애니메이션(작았다가 커짐)이 다시 재생된다.
export default function CountdownPage({ onDone, onBack }: { onDone: () => void; onBack?: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onDone]);

  return (
    <div className="relative flex-1 bg-primary-lime">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="absolute top-[18px] left-[18px] z-10 grid h-6 w-6 shrink-0 place-items-center text-[#131408]"
      >
        <ChevronLeft size={24} />
      </button>
      <p className="absolute top-54.75 left-1/2 -translate-x-1/2 font-display text-[14px] tracking-[0.84px] whitespace-nowrap text-[#131408]">
        READY TO RUN©
      </p>
      {/* key가 바뀔 때마다 애니메이션이 처음부터 다시 실행된다 */}
      <p
        key={count}
        className="animate-count-pop absolute top-60 left-1/2 -translate-x-1/2 font-display text-[300px] leading-[normal] text-black"
      >
        {Math.max(count, 1)}
      </p>
    </div>
  );
}
