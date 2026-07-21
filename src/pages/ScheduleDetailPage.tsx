import { useState } from "react";
import { ChevronRight, BackButton } from "../components/Icons";
import SharePopup from "../components/SharePopup";
import MapBackdrop from "../components/MapBackdrop";
import scheduleImage from "../assets/img/schedule-hero.webp";
import runner1 from "../assets/img/runner1.webp";
import runner2 from "../assets/img/runner2.webp";
import runner3 from "../assets/img/runner3.webp";
import runner4 from "../assets/img/runner4.webp";
import runner5 from "../assets/img/runner5.webp";
import runner6 from "../assets/img/runner6.webp";
import course1 from "../assets/img/course1.webp";

type Props = {
  onBack: () => void;
};

const attendees = [
  { image: runner2, position: "42% 50%" },
  { image: runner3, position: "50% 35%" },
  { image: runner1, position: "45% 42%" },
  { image: runner6, position: "50% 43%" },
  { image: runner4, position: "50% 45%" },
  { image: course1, position: "50% 55%" },
  { image: runner5, position: "50% 49%" },
];

const SCHEDULE_LOCATION = { lat: 37.5316, lng: 127.0667 };

function ShareIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path
        d="M17.1 8.3L13 4.2L8.9 8.3M13 4.8V16.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M8 11.3H6.6C5.7 11.3 5 12 5 12.9V20.3C5 21.2 5.7 21.9 6.6 21.9H19.4C20.3 21.9 21 21.2 21 20.3V12.9C21 12 20.3 11.3 19.4 11.3H18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4.5 10.4L8.2 14L15.7 6.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AnimatedCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        className="animate-check-draw"
        d="M4.5 10.4L8.2 14L15.7 6.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        pathLength={1}
        strokeDasharray={1}
      />
    </svg>
  );
}

export default function ScheduleDetailPage({ onBack }: Props) {
  const [showAttendConfirm, setShowAttendConfirm] = useState(false);
  const [attending, setAttending] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className="phone bg-[#0a0a0a] text-white">
      <header className="subheader justify-between">
        <BackButton onClick={onBack} />
        <button
          className="grid h-[26px] w-[26px] place-items-center text-white"
          type="button"
          aria-label="공유하기"
          onClick={() => setShareOpen(true)}
        >
          <ShareIcon />
        </button>
      </header>

      {isMapOpen && (
        <div className="fixed inset-y-0 left-1/2 z-[180] w-[var(--frame-width)] max-w-full -translate-x-1/2 overflow-hidden bg-black">
          <MapBackdrop
            center={SCHEDULE_LOCATION}
            interactive
            level={3}
            markerPosition={SCHEDULE_LOCATION}
            markerVariant="orange"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent"
            aria-hidden
          />
          <BackButton
            onClick={() => setIsMapOpen(false)}
            label="지도 닫기"
            className="absolute top-[calc(var(--statusbar-h)+18px)] left-[18px] z-20 drop-shadow-[0_0_4px_rgba(0,0,0,0.75)]"
          />
        </div>
      )}

      <main className="detail-section-stack flex flex-col px-[var(--gutter)] pb-[126px] pt-[10px]">
        <section className="relative h-[250px] w-full overflow-hidden rounded-[20px] bg-[#111]">
          <img className="h-full w-full object-cover object-bottom" src={scheduleImage} alt="" />
          <div className="absolute inset-0 bg-black/20" />
        </section>

        <section
          className="flex flex-col gap-[10px]"
          style={{ marginTop: "calc(14px - (var(--spacing, 2.25rem) * 18))" }}
        >
          <div className="flex gap-[6px]">
            <span className="inline-flex min-h-[27px] items-center justify-center rounded-[12px] border border-[var(--primary-lime)] px-[10px] py-1 text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[var(--primary-lime)]">
              크루
            </span>
            <span className="inline-flex min-h-[27px] items-center justify-center rounded-[12px] bg-[var(--primary-lime)] px-[10px] py-1 text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#0a0a0a]">
              D-1
            </span>
          </div>
          <h1 className="mt-1 text-[24px] font-semibold leading-[1.3] tracking-[-0.48px]">NR Crew-저녁 러닝</h1>
          <p className="text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-[#9c9c9c]">
            2026년 7월 9일 (목) 19:00
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex w-full flex-col gap-[10px] rounded-2xl bg-[#1d1d1d] p-4">
            <div className="grid min-h-[21px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-x-[11px] max-[380px]:grid-cols-[38px_minmax(0,1fr)_auto] max-[380px]:gap-x-2">
              <span className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#8a8a8a]">장소</span>
              <strong className="truncate text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white">뚝섬유원지 3번 출구</strong>
              <button
                className="inline-flex items-center justify-end whitespace-nowrap text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[var(--primary-lime)]"
                type="button"
                onClick={() => setIsMapOpen(true)}
              >
                지도 보기
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid min-h-[21px] grid-cols-[42px_minmax(0,1fr)] items-center gap-x-[11px] max-[380px]:grid-cols-[38px_minmax(0,1fr)] max-[380px]:gap-x-2">
              <span className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#8a8a8a]">코스</span>
              <strong className="truncate text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white">뚝섬 → 잠실대교 왕복 6km</strong>
            </div>
            <div className="grid min-h-[21px] grid-cols-[42px_minmax(0,1fr)] items-center gap-x-[11px] max-[380px]:grid-cols-[38px_minmax(0,1fr)] max-[380px]:gap-x-2">
              <span className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#8a8a8a]">페이스</span>
              <strong className="truncate text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white">6'30&quot; 그룹런</strong>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#1d1d1d] p-4">
            <div className="flex items-center justify-between text-[14px] leading-[1.3] tracking-[-0.42px] text-white">
              <strong className="font-medium">참석자</strong>
              <span className="font-normal text-[#9c9c9c]">참석 12 · 불참 3 · 미응답 5</span>
            </div>
            <div className="flex items-center justify-center gap-2 max-[380px]:gap-[5px]">
              {attendees.map((attendee, index) => (
                <img
                  className="h-10 w-10 rounded-full border-2 border-[var(--primary-orange)] object-cover max-[380px]:h-9 max-[380px]:w-9"
                  key={`${attendee.image}-${index}`}
                  src={attendee.image}
                  alt=""
                  style={{ objectPosition: attendee.position }}
                />
              ))}
              <span className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#8a8a8a]">+5</span>
            </div>
          </div>

          <div className="w-full rounded-2xl bg-[#1d1d1d] p-4">
            <strong className="mb-2 block text-[14px] font-medium leading-[1.3] tracking-[-0.42px]">크루 공지</strong>
            <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#9c9c9c]">우천 시 당일 17시에 취소 공지 드려요.</p>
            <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#9c9c9c]">짐 보관은 3번 출구 편의점 앞에서 가능합니다.</p>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 z-[100] flex h-[93px] w-[var(--frame-width)] max-w-full -translate-x-1/2 items-start gap-[10px] border-t border-[#262626] bg-[#0e0e0e] px-[var(--gutter)] pb-7 pt-[14px]">
        {!attending && (
          <button
            className="h-[53px] flex-1 rounded-full bg-[#1d1d1d] text-[16px] font-medium leading-[1.3] tracking-[-0.48px] text-[#9c9c9c]"
            type="button"
          >
            불참
          </button>
        )}
        <button
          className={`flex h-[53px] flex-1 items-center justify-center gap-0.5 rounded-full text-[16px] font-medium leading-[1.3] tracking-[-0.48px] ${
            attending ? "bg-[#2a2a2a] text-white/40" : "bg-[var(--primary-lime)] text-[#0a0a0a]"
          }`}
          type="button"
          disabled={attending}
          onClick={() => setShowAttendConfirm(true)}
        >
          {!attending && <CheckIcon />}
          {attending ? "참석 확정" : "참석"}
        </button>
      </div>

      {showAttendConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-[var(--gutter)]"
          onClick={() => setShowAttendConfirm(false)}
        >
          <div
            className="flex w-full max-w-[320px] flex-col items-center gap-4 rounded-2xl bg-[#1d1d1d] px-6 py-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grid h-12 w-12 animate-count-pop place-items-center rounded-full bg-[var(--primary-lime)] text-[#0a0a0a]">
              <AnimatedCheckIcon />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-[18px] font-semibold leading-[1.3] tracking-[-0.48px] text-white">참석 완료</h2>
              <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#9c9c9c]">
                이번 일정에 참석이 확정되었어요.
              </p>
            </div>
            <button
              className="h-[46px] w-full rounded-full bg-[var(--primary-lime)] text-[16px] font-medium leading-[1.3] tracking-[-0.48px] text-[#0a0a0a]"
              type="button"
              onClick={() => {
                setAttending(true);
                setShowAttendConfirm(false);
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <SharePopup open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
