import { useState } from "react";
import { BackButton } from "../components/Icons";
import SharePopup from "../components/SharePopup";
import raceHero from "../assets/img/race1.webp";

type Props = {
  onBack: () => void;
};

const infoCards = [
  { label: "접수 마감", value: "2026.07.22", note: "선착순 5,000명" },
  { label: "대회 장소", value: "여의도 한강공원", note: "이벤트 광장 집결" },
  { label: "코스", value: "5K · 10K · Half", note: "초보 러너도 참여 가능" },
  { label: "참가비", value: "30,000원부터", note: "기념 티셔츠 포함" },
];

const timeline = [
  { time: "17:00", title: "참가자 체크인", desc: "배번호 수령, 물품 보관, 현장 안내 확인", active: true },
  { time: "18:00", title: "10K · Half 출발", desc: "페이스 그룹별 순차 출발" },
  { time: "18:20", title: "5K 출발", desc: "초보 러너와 동반 참가자 추천 코스" },
  { time: "20:30", title: "기록 확인", desc: "완주 메달과 굿즈 수령 후 포토존 이용" },
];

const glassCardClass =
  "relative min-h-[94px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(29,29,29,0.2)] p-[13px_16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.28)] backdrop-blur-[14px] backdrop-saturate-[145%] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_46%,rgba(255,255,255,0))] [&>*]:relative";
const sectionTitleClass = "text-[24px] font-semibold leading-[1.3] tracking-[-0.48px] text-[#f6f6ed]";
const bodyTextClass = "text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-white/70";

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

function RouteMiniMap() {
  return (
    <svg className="h-[72px] w-[72px] shrink-0 basis-[72px]" width="72" height="72" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect width="80" height="80" rx="18" fill="#1D1D1D" />
      <path
        d="M17 51C26 42 30 57 39 46C46 37 49 28 62 23"
        stroke="#D4FF3F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="17" cy="51" r="3.5" fill="#D4FF3F" />
      <circle cx="62" cy="23" r="4" fill="#D4FF3F" stroke="#F6F6ED" strokeWidth="2" />
    </svg>
  );
}

export default function RaceDetailPage({ onBack }: Props) {
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [joined, setJoined] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="phone bg-[#232323] text-[#f6f6ed]">
      <header className="subheader justify-between">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] font-semibold leading-[1.3] tracking-[-0.48px]">
          대회 소식
        </h1>
        <button
          className="grid h-[26px] w-[26px] place-items-center text-[#f6f6ed]"
          type="button"
          aria-label="공유하기"
          onClick={() => setShareOpen(true)}
        >
          <ShareIcon />
        </button>
      </header>

      <main className="detail-section-stack flex flex-col pb-12">
        <section className="relative h-[581px] overflow-hidden after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03),rgba(0,0,0,0.42))]">
          <img className="absolute inset-0 h-full w-full object-cover object-[48%_center]" src={raceHero} alt="" />
          <div className="relative z-[1] flex h-full flex-col justify-between px-[19px] py-4">
            <span className="inline-flex min-h-[31px] w-[54px] items-center justify-center rounded-2xl bg-[var(--primary-lime)] text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-black">
              서울
            </span>
            <div className="flex flex-col items-center gap-0 text-center">
              <p className="mb-[17px] [font-family:var(--font-display)] text-[64px] leading-[0.95] text-[var(--primary-lime)]">D-3</p>
              <h2 className="mb-[3px] text-[30px] font-semibold leading-[1.2] tracking-[-0.6px] text-white">한강 마라톤</h2>
              <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-white">2026-07-25(토) 18:00 · 여의도 한강공원</p>
              <div className="mt-[15px] flex gap-[5px]" aria-hidden>
                <span className="h-[6px] w-[6px] rounded-full bg-[var(--primary-lime)]" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#f6f6ed]/45" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#f6f6ed]/45" />
              </div>
            </div>
          </div>
        </section>

        <section
          className="grid grid-cols-2 gap-x-[18px] gap-y-4 px-[var(--gutter)] max-[380px]:gap-3"
          style={{ marginTop: "calc(24px - (var(--spacing, 2.25rem) * 18))" }}
        >
          {infoCards.map((card) => (
            <article className={glassCardClass} key={card.label}>
              <p className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-white/70">{card.label}</p>
              <strong className="mt-[5px] block text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white max-[380px]:text-[18px]">
                {card.value}
              </strong>
              <span className="mt-0.5 block text-[12px] font-light leading-[1.3] tracking-[-0.36px] text-white/70">{card.note}</span>
            </article>
          ))}
        </section>

        <section className="px-[var(--gutter)]">
          <h2 className={sectionTitleClass}>일정과 코스</h2>
          <p className={`${bodyTextClass} mt-[7px] max-w-[348px]`}>
            한강을 따라 가볍게 출발하고, 야경이 켜지는 시간에 완주하는 저녁 러닝 코스예요.
          </p>
          <div className="relative mt-5 flex flex-col gap-3 pl-6 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-white/20">
            {timeline.map((item) => (
              <div
                className={`relative grid grid-cols-[60px_minmax(0,1fr)] items-start gap-2 before:absolute before:-left-[22px] before:top-[9px] before:h-[7px] before:w-[7px] before:rounded-full ${
                  item.active ? "before:bg-[var(--primary-lime)]" : "before:bg-[rgba(255,255,255,0.28)]"
                }`}
                key={item.time}
              >
                <time
                  className={`block pt-[3px] text-[14px] font-medium leading-[1.3] tracking-[-0.42px] ${
                    item.active ? "text-[var(--primary-lime)]" : "text-white/70"
                  }`}
                >
                  {item.time}
                </time>
                <div>
                  <strong className="text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white max-[380px]:text-[18px]">
                    {item.title}
                  </strong>
                  <p className={`${bodyTextClass} mt-[5px]`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-end justify-between gap-5 px-[var(--gutter)]">
          <div>
            <h2 className={sectionTitleClass}>코스 안내</h2>
            <p className={`${bodyTextClass} mt-[7px]`}>
              여의도 이벤트 광장에서 출발해 한강공원 산책로를 따라 반환하는 평지 중심 코스입니다.
              급격한 오르막이 적어서 첫 대회 참가자도 부담 없이 달릴 수 있어요.
            </p>
          </div>
          <RouteMiniMap />
        </section>

        <p className={`${bodyTextClass} px-[var(--gutter)]`}>기록칩 · 완주 메달 · 물품보관 · 현장 포토존 제공</p>

        <button
          className={`mx-[var(--gutter)] h-12 w-[calc(100%-36px)] rounded-full text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] ${
            joined ? "bg-[#2a2a2a] text-white/40" : "bg-[var(--primary-lime)] text-black"
          }`}
          type="button"
          disabled={joined}
          onClick={() => setShowJoinConfirm(true)}
        >
          {joined ? "참가 신청 완료" : "참가 신청하기"}
        </button>
      </main>

      {showJoinConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-[var(--gutter)]"
          onClick={() => setShowJoinConfirm(false)}
        >
          <div
            className="flex w-full max-w-[320px] flex-col items-center gap-4 rounded-2xl bg-[#1d1d1d] px-6 py-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grid h-12 w-12 animate-count-pop place-items-center rounded-full bg-[var(--primary-lime)] text-black">
              <AnimatedCheckIcon />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-[18px] font-semibold leading-[1.3] tracking-[-0.48px] text-white">참가 신청 완료</h2>
              <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-white/70">
                이 대회에 참가 신청이 완료되었어요.
              </p>
            </div>
            <button
              className="h-[46px] w-full rounded-full bg-[var(--primary-lime)] text-[16px] font-medium leading-[1.3] tracking-[-0.48px] text-black"
              type="button"
              onClick={() => {
                setJoined(true);
                setShowJoinConfirm(false);
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
