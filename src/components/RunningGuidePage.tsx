import { BackButton } from "./Icons";
import iconPlay from "../assets/icons/guide-play.svg";
import iconArrow from "../assets/icons/guide-arrow.svg";

const guideRuns = [
  {
    id: 1,
    title: "첫 5K 완주 가이드",
    desc: "러니 음성 코칭 · 5분",
    level: "초보",
  },
  {
    id: 2,
    title: "회복 러닝 20분",
    desc: "낮은 심박 유지 · 페이스 안내",
    level: "회복",
  },
  {
    id: 3,
    title: "마인드풀 런 25분",
    desc: "코치+명상가이드 대화 · 호흡에 집중",
    level: "회복",
  },
];

const runningTips = [
  { id: 1, title: "숨 안 차게 달리는 법 — 2:2 호흡 리듬" },
  { id: 2, title: "자세 리셋 — 시선·어깨·팔치기 3포인트 체크" },
  { id: 3, title: "오버페이스 방지 — 대화 가능한 속도 찾기" },
];

// ── 러닝 가이드 화면 (기록 탭 하위 페이지, 하단 네비 없음) ────
export default function RunningGuidePage({ onBack }: { onBack?: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더: 뒤로가기 + 가운데 타이틀 (spacer로 광학 중앙 정렬 유지) */}
      <header className="mt-3 flex items-center justify-between px-4.5 py-2.5">
        <BackButton onClick={onBack} />
        <h1 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.48px]">
          러닝 가이드
        </h1>
        <span className="size-6.5" aria-hidden />
      </header>

      <main className="flex flex-col gap-12 px-4.5 pt-6 pb-12">
        <section className="flex flex-col gap-3">
          <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.6px]">
            가이드 런
          </h2>
          <ul className="flex flex-col gap-3">
            {guideRuns.map((g) => (
              <li
                key={g.id}
                className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5"
              >
                <button
                  type="button"
                  className="grid size-10 flex-none place-items-center rounded-full bg-surface-2"
                  aria-label={`${g.title} 재생`}
                >
                  <img className="size-4.5" src={iconPlay} alt="" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[16px] leading-[1.3] tracking-[-0.48px]">{g.title}</p>
                  <p className="text-[12px] font-light leading-[1.3] tracking-[-0.36px] text-[#9a9aa3]">
                    {g.desc}
                  </p>
                </div>
                <span className="flex-none rounded-full border border-primary-lime px-2 py-0.75 text-[12px] font-light leading-[1.3] tracking-[-0.36px] text-primary-lime">
                  {g.level}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.6px]">
            진행 중인 프로그램
          </h2>
          <div className="flex flex-col gap-4 rounded-[14px] bg-[#26262a] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[16px] leading-[1.3] tracking-[-0.48px]">
                첫 5K 도전 · 8주 프로그램
              </p>
              <p className="text-[14px] leading-[1.3] tracking-[-0.42px] text-[#d6ff1e]">
                Week 2/8
              </p>
            </div>
            <p className="text-[12px] font-light leading-[1.3] tracking-[-0.36px] text-[#9a9aa1]">
              다음 세션 · 달리기 1분 + 걷기 반복 (세션 5/24)
            </p>
            <div className="h-1.5 overflow-hidden rounded-[3px] bg-[#1a1a1c]">
              {/* w-[21%]: 세션 5/24 진행률 */}
              <div className="h-full w-[21%] rounded-[3px] bg-[#d6ff1e]" />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="h-8.5 w-26.75 rounded-full bg-primary-lime text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-black"
              >
                이어서 시작
              </button>
              <p className="text-[12px] font-light leading-[1.3] tracking-[-0.36px] text-[#9a9aa1]">
                주 3회 · 러니 음성 코칭
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.6px]">
              러닝 팁
            </h2>
            <button
              type="button"
              className="text-[12px] font-light tracking-[-0.36px] text-[#d6ff1e]"
            >
              모두 보기
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {runningTips.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 rounded-[14px] bg-[#26262a] p-4 text-left"
                >
                  <span className="min-w-0 flex-1 text-[14px] font-medium leading-[1.3] tracking-[-0.42px]">
                    {t.title}
                  </span>
                  <img className="h-3 w-[6.5px] flex-none" src={iconArrow} alt="" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
