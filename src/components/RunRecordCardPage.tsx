import cardPhoto from "../assets/img/300img.png";
import routeIcon from "../assets/icons/record-card-route.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";

type Props = {
  onClose?: () => void;
  onShare?: () => void;
};

// ── 기록 — 러닝 완료 (기록 카드) (Figma 767:314) ────────────
// "기록 카드 만들기"를 누르면 뜨는, 완주 기록을 카드 형태로 보여주는 화면.
export default function RunRecordCardPage({ onClose, onShare }: Props) {
  return (
    <div className="scrollbar-hidden relative flex flex-1 min-h-0 flex-col overflow-y-auto bg-black pb-8">
      {/* 상태바 자리 불투명 검정 띠 — 스크롤 시 콘텐츠가 뒤로 사라지고, 흰 10:36 이 위에 얹힘.
          자리를 차지해 아래 콘텐츠를 상태바 높이만큼 내린다(모바일 0 / 웹 52px). */}
      <div className="sticky top-0 z-[1] h-[var(--statusbar-h)] shrink-0 bg-black" aria-hidden />
      <p className="mt-4 px-6 font-display text-[13px] tracking-[1px] text-primary-lime">
        RUN COMPLETE
      </p>
      <h1 className="mt-1.5 px-6 text-[26px] font-bold leading-[1.3] text-[#f5f4f2]">
        여의도 고구마런
      </h1>
      <p className="mt-2 px-6 text-[12px] text-white/55">
        2026년 7월 13일 월요일 · 오전 10:19
      </p>

      <div className="mt-4.5 flex items-center gap-2.5 px-6">
        <span className="grid size-6.5 shrink-0 place-items-center rounded-full border-[1.2px] border-primary-lime bg-[#2c2c30]">
          <span
            className="size-4.5 bg-[#d6ff1e] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
            style={{ maskImage: `url("${iconChatbot}")`, WebkitMaskImage: `url("${iconChatbot}")` }}
            aria-hidden
          />
        </span>
        <p className="text-[13px] text-primary-lime">
          완주 축하해요! 기록 카드를 자동으로 만들었어요
        </p>
      </div>

      {/* 기록 카드 — 인증샷 배경 위에 코스명·날짜·스탯 오버레이 */}
      <div className="relative mx-6 mt-4 h-91 overflow-hidden rounded-card border border-primary-lime bg-elevated">
        <img
          className="absolute inset-0 h-full w-full object-cover object-top"
          src={cardPhoto}
          alt=""
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-22.75 bg-gradient-to-b from-black/0 to-black" />

        <div className="absolute left-8 top-6.5 flex flex-col gap-1 text-white">
          <p className="text-[24px] font-semibold tracking-[-0.48px]">오늘 낮 러닝</p>
          <p className="text-[14px] tracking-[-0.42px]">26년 7월 14일 · 여의도</p>
        </div>

        <img
          className="absolute left-8.5 top-24.5 h-12.5 w-14.75"
          src={routeIcon}
          alt=""
          aria-hidden
        />

        <div className="absolute left-7.75 top-38 flex flex-col gap-2.5">
          <div>
            <p className="text-[12px] text-white">거리</p>
            <p className="font-display text-[22px] tracking-[-0.44px] text-[#f5f5f7]">8.43 km</p>
          </div>
          <div>
            <p className="text-[12px] text-white">시간</p>
            <p className="font-display text-[22px] tracking-[-0.44px] text-[#f5f5f7]">51:17</p>
          </div>
          <div>
            <p className="text-[12px] text-white">평균 페이스</p>
            <p className="font-display text-[22px] tracking-[-0.44px] text-[#f5f5f7]">6'05"</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mx-6 mt-6 flex h-16 items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-pill-border bg-elevated text-[15px] font-medium text-[#f5f4f2]"
      >
        <span className="text-[22px] leading-none text-primary-lime">+</span>
        사진 추가하기
      </button>
      <p className="mt-2 text-center text-[11px] text-white/45">완주 인증샷을 카드에 추가해요</p>

      <button
        type="button"
        onClick={onShare}
        className="mx-6 mt-4 h-14 rounded-full bg-primary-lime text-[16px] font-semibold text-[#0f120c]"
      >
        피드에 공유하기
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mx-6 mt-2.5 h-14 rounded-full bg-white/20 text-[16px] text-white"
      >
        기록만 저장하고 닫기
      </button>
    </div>
  );
}
