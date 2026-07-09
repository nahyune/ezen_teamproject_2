import iconBack from "../assets/icons/guide-back.svg";
import iconPlay from "../assets/icons/guide-play.svg";
import iconArrow from "../assets/icons/guide-arrow.svg";
import "./RunningGuidePage.css";

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

export default function RunningGuidePage({ onBack }: { onBack?: () => void }) {
  return (
    <div className="guide">
      <header className="guide__header">
        <button type="button" className="guide__back" aria-label="뒤로가기" onClick={onBack}>
          <img src={iconBack} alt="" />
        </button>
        <h1 className="guide__title">러닝 가이드</h1>
        <span className="guide__header-spacer" aria-hidden />
      </header>

      <main className="guide__body">
        <section className="guide-section">
          <h2 className="guide-section__title">가이드 런</h2>
          <ul className="guide-run__list">
            {guideRuns.map((g) => (
              <li key={g.id} className="guide-run">
                <button type="button" className="guide-run__play" aria-label={`${g.title} 재생`}>
                  <img src={iconPlay} alt="" />
                </button>
                <div className="guide-run__info">
                  <p className="guide-run__name">{g.title}</p>
                  <p className="guide-run__desc">{g.desc}</p>
                </div>
                <span className="guide-run__level">{g.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2 className="guide-section__title">진행 중인 프로그램</h2>
          <div className="guide-program">
            <div className="guide-program__row">
              <p className="guide-program__name">첫 5K 도전 · 8주 프로그램</p>
              <p className="guide-program__week">Week 2/8</p>
            </div>
            <p className="guide-program__next">다음 세션 · 달리기 1분 + 걷기 반복 (세션 5/24)</p>
            <div className="guide-program__track">
              <div className="guide-program__fill" />
            </div>
            <div className="guide-program__row">
              <button type="button" className="guide-program__cta">
                이어서 시작
              </button>
              <p className="guide-program__meta">주 3회 · 러니 음성 코칭</p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-section__head">
            <h2 className="guide-section__title">러닝 팁</h2>
            <button type="button" className="guide-section__more">
              모두 보기
            </button>
          </div>
          <ul className="guide-tip__list">
            {runningTips.map((t) => (
              <li key={t.id}>
                <button type="button" className="guide-tip">
                  <span className="guide-tip__text">{t.title}</span>
                  <img className="guide-tip__arrow" src={iconArrow} alt="" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
