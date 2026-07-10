import { useEffect, useRef, useState } from "react";
import { initDragScroll } from "../dragScroll";
import { onboardingSlides } from "../onboardingData";
import OnboardingSlide from "./OnboardingSlide";
import "./OnboardingFlow.css";

function SwipeButton({ label, onComplete }: { label: string; onComplete?: () => void }) {
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
    <div className="onboarding__cta" ref={containerRef}>
      <span 
        className="onboarding__cta-icon" 
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
      <span className="onboarding__cta-label" ref={labelRef}>{label}</span>
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
    <div className="onboarding">
      <div className="onboarding__viewport no-scrollbar" ref={viewportRef}>
        {onboardingSlides.map((slide) => (
          <OnboardingSlide key={slide.eyebrow} {...slide} />
        ))}
      </div>

      <div className="onboarding__footer">
        {onboardingSlides[active].cta && (
          <SwipeButton label={onboardingSlides[active].cta!} onComplete={onComplete} />
        )}

        <div className="onboarding__dots" aria-hidden>
          {onboardingSlides.map((slide, i) => (
            <span
              key={slide.eyebrow}
              className={`onboarding__dot${i === active ? " onboarding__dot--active" : ""}`}
            />
          ))}
        </div>
        <div className="onboarding__home-indicator" />
      </div>
    </div>
  );
}
