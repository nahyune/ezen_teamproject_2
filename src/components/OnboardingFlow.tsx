import { useEffect, useRef, useState } from "react";
import { onboardingSlides } from "../onboardingData";
import OnboardingSlide from "./OnboardingSlide";

function SwipeButton({ label, onComplete, hidden }: { label: string; onComplete?: () => void; hidden?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const updateDOM = (x: number, animate: boolean = false) => {
    if (!containerRef.current || !iconRef.current || !labelRef.current || !fillRef.current) return;
    const max = containerRef.current.clientWidth - iconRef.current.clientWidth - 8;

    const icon = iconRef.current;
    const labelEl = labelRef.current;
    const fill = fillRef.current;

    icon.style.transition = animate ? 'transform 0.3s ease' : 'none';
    labelEl.style.transition = animate ? 'opacity 0.3s ease' : 'none';
    fill.style.transition = animate ? 'width 0.3s ease' : 'none';

    // 세로 중앙 정렬은 -translate-y-1/2(Tailwind translate 속성)가 처리하므로
    // 인라인 transform 은 가로 이동만 담당한다. (세로 -50% 를 중복 적용하면 노브가 위로 튀어오름)
    icon.style.transform = `translateX(${x}px)`;
    labelEl.style.opacity = `${1 - (x / max)}`;
    // 노브가 지나간 자리만큼 배경을 #D6FF1E로 채운다.
    // x=0일 땐 노브 너비만큼만, x=max(끝까지 드래그)일 땐 컨테이너 끝까지 꽉 차도록 선형 보간.
    const containerWidth = containerRef.current.clientWidth;
    const fillWidth = icon.clientWidth + (containerWidth - icon.clientWidth) * (x / max);
    fill.style.width = `${fillWidth}px`;
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
      className="relative w-[360px] max-w-full h-[65px] [@media(max-height:700px)]:h-[44px] shrink-0 flex items-center justify-center overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_100%)] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border border-white/18 shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)] cursor-pointer"
      ref={containerRef}
      aria-hidden={hidden || undefined}
      style={hidden ? { visibility: "hidden", pointerEvents: "none" } : undefined}
    >
      {/* 노브가 지나간 만큼 #D6FF1E 로 차오르는 진행률 채움 */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-0 rounded-full bg-[#D6FF1E]"
        ref={fillRef}
        aria-hidden
      />
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

  // 온보딩 슬라이더 전용 제스처 (공용 dragScroll 미사용):
  // - 마우스 드래그: 드래그 중에는 화면을 움직이지 않고, 놓는 순간 ±1장만 이동.
  //   (드래그 중 scrollLeft를 직접 조작하면 놓는 순간 브라우저의 스냅 복원
  //   애니메이션과 scrollTo가 서로 싸워서 뚝 끊김 — 애니메이션 소스를 하나로 유지)
  // - 터치: 네이티브 스크롤 + 슬라이드의 snap-always가 한 장씩 멈춤을 보장
  // - 탭: 오른쪽 절반 = 다음 장, 왼쪽 절반 = 이전 장 (8px 이상 움직이면 드래그로 판정)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let isDown = false;
    let didDrag = false;
    let startX = 0;
    let startIndex = 0;
    let suppressTap = false;
    let suppressTimer: number | undefined;

    const slideW = () => el.clientWidth;
    const lastIndex = onboardingSlides.length - 1;
    const goTo = (i: number) => {
      const target = Math.max(0, Math.min(lastIndex, i));
      el.scrollTo({ left: target * slideW(), behavior: "smooth" });
    };

    const onDown = (e: MouseEvent) => {
      isDown = true;
      didDrag = false;
      startX = e.pageX;
      startIndex = Math.round(el.scrollLeft / slideW());
    };

    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      if (Math.abs(e.pageX - startX) > 8) {
        didDrag = true;
        el.classList.add("dragging"); // grabbing 커서 피드백만 (화면은 안 움직임)
      }
    };

    const onUp = (e: MouseEvent) => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("dragging");
      if (!didDrag) return;
      const dx = e.pageX - startX;
      const step = dx <= -60 ? 1 : dx >= 60 ? -1 : 0;
      if (step !== 0) goTo(startIndex + step);
      // 드래그 직후 발생하는 잔여 click이 탭으로 오인되지 않게 잠시 억제
      suppressTap = true;
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        suppressTap = false;
      }, 150);
    };

    const onTap = (e: MouseEvent) => {
      if (suppressTap) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const rect = el.getBoundingClientRect();
      const index = Math.round(el.scrollLeft / slideW());
      const isLeftHalf = e.clientX < rect.left + rect.width / 2;
      goTo(isLeftHalf ? index - 1 : index + 1);
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("click", onTap);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("click", onTap);
      window.clearTimeout(suppressTimer);
    };
  }, []);

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
    // h-full = 폰 프레임 높이에 딱 맞춤 (min-h-dvh 제거 — 브라우저 창 기준이라 프레임을 넘쳐 스크롤을 만들었음)
    <div className="self-start w-full max-w-[var(--frame-width)] h-full mx-auto bg-[var(--bg-app)] flex flex-col">
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
