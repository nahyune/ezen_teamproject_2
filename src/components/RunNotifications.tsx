import { useEffect, useRef, useState } from "react";
import iconBell from "../assets/icons/header-bell.svg";
import runningShoeImg from "../assets/img/shoe-nike-pegasus41.webp";

export default function RunNotifications({
  iconClassName = "size-6",
  unreadBorderClassName = "border-black",
  variant = "light",
}: {
  iconClassName?: string;
  unreadBorderClassName?: string;
  variant?: "light" | "dark";
}) {
  const notificationRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    if (!open) return;

    const closeNotifications = (event: PointerEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", closeNotifications);
    return () => document.removeEventListener("pointerdown", closeNotifications);
  }, [open]);

  return (
    <div ref={notificationRef} className="relative flex">
      <button
        type="button"
        className="relative"
        aria-label="알림"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setHasUnread(false);
        }}
      >
        <img className={iconClassName} src={iconBell} alt="" />
        {hasUnread && (
          <span className={`absolute -right-0.5 -top-0.5 size-2 rounded-full border bg-[var(--primary-orange)] ${unreadBorderClassName}`} />
        )}
      </button>

      {open && (
        <section className={`absolute right-0 top-[36px] z-[120] w-[360px] max-w-[calc(100vw-36px)] overflow-hidden rounded-[8px] border ${variant === "dark" ? "border-white/10 bg-[#151517] text-white shadow-[0_16px_42px_rgba(0,0,0,0.6)]" : "border-black/8 bg-white text-black shadow-[0_16px_42px_rgba(0,0,0,0.15)]"}`}>
          <div className={`flex h-12 items-center justify-between border-b px-4 ${variant === "dark" ? "border-white/8" : "border-black/8"}`}>
            <h2 className="text-[17px] font-semibold">알림</h2>
            <span className="text-[12px] font-medium text-primary-lime">알림 2개</span>
          </div>
          <ul className="py-1.5">
            <li className="flex gap-3 px-4 py-3">
              <span className={`grid size-11 flex-none place-items-center rounded-full text-primary-lime ${variant === "dark" ? "bg-[#242426]" : "bg-black"}`}>
                <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.64 5.64l1.56 1.56M16.8 16.8l1.56 1.56M18.36 5.64 16.8 7.2M7.2 16.8l-1.56 1.56" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[14px] font-semibold">오늘 러닝 날씨</h3>
                  <span className="size-1.5 flex-none rounded-full bg-[var(--primary-orange)]" />
                </div>
                <p className={`mt-1 text-[13px] leading-[1.45] ${variant === "dark" ? "text-white/65" : "text-black/65"}`}>
                  19°C · 미세먼지 좋음<br />오후 8시부터 약한 비가 예상돼요.
                </p>
                <p className={`mt-1.5 text-[11px] ${variant === "dark" ? "text-white/35" : "text-black/35"}`}>방금 전</p>
              </div>
            </li>
            <li className={`flex gap-3 border-t px-4 py-3 ${variant === "dark" ? "border-white/7" : "border-black/7"}`}>
              <span className="grid size-11 flex-none place-items-center overflow-hidden rounded-full bg-white/90">
                <img src={runningShoeImg} alt="" className="h-9 w-9 object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[14px] font-semibold">러닝화 교체 시기</h3>
                  <span className="size-1.5 flex-none rounded-full bg-[var(--primary-orange)]" />
                </div>
                <p className={`mt-1 text-[13px] leading-[1.45] ${variant === "dark" ? "text-white/65" : "text-black/65"}`}>
                  페가수스 41의 누적 거리가 452km예요. 교체 시기를 확인해보세요.
                </p>
                <p className={`mt-1.5 text-[11px] ${variant === "dark" ? "text-white/35" : "text-black/35"}`}>오늘</p>
              </div>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
