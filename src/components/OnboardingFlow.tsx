import { useEffect, useRef, useState } from "react";
import { initDragScroll } from "../dragScroll";
import { onboardingSlides } from "../onboardingData";
import OnboardingSlide from "./OnboardingSlide";

function SwipeButton({ label, onComplete, hidden }: { label: string; onComplete?: () => void; hidden?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const updateDOM = (x: number, animate: boolean = false) => {
    if (!containerRef.current || !iconRef.current || !labelRef.current) return;
    const max = containerRef.current.clientWidth - iconRef.current.clientWidth - 8;
    
    const icon = iconRef.current;
    const labelEl = labelRef.current;

    icon.style.transition = animate ? 'transform 0.3s ease' : 'none';
    labelEl.style.transition = animate ? 'opacity 0.3s ease' : 'none';
    
    icon.style.transform = `translate(${x}px, -50%)`;
    labelEl.style.opacity = `${1 - (x / max)}`;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX - currentX.current;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current || !iconRef.current) return;
    const max = containerRef.current.clientWidth - iconRef.current.clientWidth - 8;
    
    let x = e.clientX - startX.current;
    if (x < 0) x = 0;
    if (x > max) x = max;
    
    currentX.current = x;
    updateDOM(x);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current || !iconRef.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const max = containerRef.current.clientWidth - iconRef.current.clientWidth - 8;
    if (currentX.current > max * 0.8) {
      currentX.current = max;
      updateDOM(max, true);
      if (onComplete) onComplete();
    } else {
      currentX.current = 0;
      updateDOM(0, true);
    }
  };

  return (
    <div
      className="relative w-[360px] max-w-full h-[65px] [@media(max-height:700px)]:h-[44px] shrink-0 flex items-center justify-center rounded-[30px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_100%)] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border border-white/18 shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)] cursor-pointer"
      ref={containerRef}
      aria-hidden={hidden || undefined}
      style={hidden ? { visibility: "hidden", pointerEvents: "none" } : undefined}
    >
      <span
        className="absolute left-1 top-1/2 -translate-y-1/2 w-[57px] h-[57px] [@media(max-height:700px)]:w-9 [@media(max-height:700px)]:h-9 shrink-0 rounded-full bg-primary-lime flex items-center justify-center"
        ref={iconRef}
        aria-hidden
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="var(--text-on-lime)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span
        className="text-center text-white font-[family-name:Noto_Sans_KR,_var(--font-sans)] text-xl font-medium tracking-[-0.6px] leading-none"
        ref={labelRef}
      >
        {label}
      </span>
    </div>
  );
}

export default function OnboardingFlow({ onComplete }: { onComplete?: () => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => initDragScroll(), []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActive(index);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="self-start w-full max-w-[var(--frame-width)] h-dvh mx-auto bg-[var(--bg-app)] flex flex-col">
      <div
        className="flex w-full flex-1 min-h-0 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        ref={viewportRef}
      >
        {onboardingSlides.map((slide) => (
          <OnboardingSlide key={slide.eyebrow} {...slide} />
        ))}
      </div>

      <div className="min-h-[160px] [@media(max-height:700px)]:min-h-[97px] flex flex-col items-center justify-between gap-[22px] [@media(max-height:700px)]:gap-[10px] pt-[22px] [@media(max-height:700px)]:pt-3 px-[var(--gutter)] pb-3 [@media(max-height:700px)]:pb-2">
        <SwipeButton
          label={onboardingSlides[active].cta ?? ""}
          onComplete={onComplete}
          hidden={!onboardingSlides[active].cta}
        />

        <div className="flex items-center gap-2" aria-hidden>
          {onboardingSlides.map((slide, i) => (
            <span
              key={slide.eyebrow}
              className={`h-2 rounded-full transition-[width,background] duration-200 ${
                i === active ? "w-6 bg-primary-lime" : "w-2 bg-white/25"
              }`}
            />
          ))}
        </div>
        <div className="w-[134px] h-[5px] rounded-[3px] bg-white" />
      </div>
    </div>
  );
}
