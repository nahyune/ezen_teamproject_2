import { useEffect, useState } from "react";
import readyToRunMark from "../assets/icons/ready-to-run-mark.svg";

// ── 기록 — 카운트다운 (Figma 411:5554) ──────────────────────
// 시작 버튼을 누르는 즉시 3이 뜨고, 1초 간격으로 2 → 1 로 바뀐 뒤
// onDone(러닝 화면 전환)을 호출한다. 숫자는 key 교체로 매번
// count-pop 애니메이션(작았다가 커짐)이 다시 재생된다.
export default function CountdownPage({ onDone }: { onDone: () => void }) {
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
      <p className="absolute top-54.75 left-[calc(50%+2px)] flex -translate-x-1/2 items-center gap-0.5 font-display text-[14px] tracking-[0.84px] whitespace-nowrap text-[#131408]">
        <span>READY TO RUN</span>
        <img className="h-[13.4531px] w-[12.3441px] shrink-0" src={readyToRunMark} alt="" aria-hidden />
      </p>
      <p
        key={count}
        className="animate-count-pop absolute top-[230px] left-1/2 -translate-x-1/2 font-display text-[300px] leading-[normal] text-black"
      >
        {Math.max(count, 1)}
      </p>
    </div>
  );
}
