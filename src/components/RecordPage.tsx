import { useEffect, useRef, useState } from "react";
import { attachDragScroll } from "../dragScroll";
import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import iconBell from "../assets/icons/header-bell.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconBulb from "../assets/icons/bulb.svg";
import iconMusic from "../assets/icons/music.svg";
import iconSparkle from "../assets/icons/sparkle.svg";
import navHome from "../assets/icons/nav-home-off.svg";
import navFeed from "../assets/icons/nav-feed.svg";
import navRecord from "../assets/icons/nav-record-on.svg";
import navUser from "../assets/icons/nav-user.svg";
import recordCourseImg from "../assets/img/record-course.png";
import "./RecordPage.css";

const recommendedCourses = [
  {
    id: 1,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
  },
  {
    id: 2,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
  },
  {
    id: 3,
    title: "여의도 고구마런(8km)",
    desc: "한강을 따라 달리며 고구마 모양의\nGPS 드로잉을 완성해보아요!",
    duration: "40분",
    image: recordCourseImg,
  },
];

// The record screen owns its header/bottom-nav markup so it never has to
// modify the shared home-screen components (team boundary).
const navTabs = [
  { key: "home", label: "홈", icon: navHome, active: false },
  { key: "feed", label: "피드", icon: navFeed, active: false },
  { key: "record", label: "기록", icon: navRecord, active: true },
  { key: "my", label: "마이페이지", icon: navUser, active: false },
];

export default function RecordPage({ onGuideOpen }: { onGuideOpen?: () => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    // Start on the middle card so neighbours peek in from both edges.
    const middle = row.children[Math.floor(row.children.length / 2)] as
      | HTMLElement
      | undefined;
    if (middle) {
      row.scrollLeft = middle.offsetLeft + middle.offsetWidth / 2 - row.clientWidth / 2;
    }

    // Mark the card closest to the carousel center as active (focused).
    const update = () => {
      const center = row.scrollLeft + row.clientWidth / 2;
      const cards = Array.from(row.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIdx(best);
    };

    update();
    row.addEventListener("scroll", update, { passive: true });
    const detachDrag = attachDragScroll(row);
    return () => {
      row.removeEventListener("scroll", update);
      detachDrag();
    };
  }, []);

  return (
    <div className="record">
      <div className="record__map" aria-hidden />

      <header className="record__header">
        <div className="record__logo" aria-label="W:RUN">
          <img className="record__logo-w" src={logoW} alt="" />
          <span className="record__logo-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <img className="record__logo-run" src={logoRun} alt="" />
        </div>
        <button type="button" aria-label="알림">
          <img className="record__bell" src={iconBell} alt="" />
        </button>
      </header>

      <section className="record-course">
        <header className="record-course__head">
          <h2 className="record-course__title">러닝</h2>
          <p className="record-course__sub">AI 맞춤 추천 코스</p>
        </header>

        <div className="record-course__row no-scrollbar" ref={rowRef}>
          {recommendedCourses.map((c, i) => (
            <article
              key={c.id}
              className={`record-card${i === activeIdx ? " record-card--active" : ""}`}
            >
              <div className="record-card__info">
                <p className="record-card__title">{c.title}</p>
                <p className="record-card__desc">{c.desc}</p>
                <p className="record-card__time">{c.duration}</p>
              </div>
              <button type="button" className="record-card__more">
                자세히보기
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <img className="record-card__thumb" src={c.image} alt={c.title} />
            </article>
          ))}
        </div>
      </section>

      <div className="record__controls">
        <p className="record__bubble">
          러닝하기 딱 좋은 날이에요!
          <br />
          다른 코스를 원하시면 저에게 알려주세요.
        </p>

        <button type="button" className="record__fab record__fab--chat" aria-label="AI 챗봇">
          <img src={iconChatbot} alt="" />
        </button>

        <img className="record__sparkle" src={iconSparkle} alt="" aria-hidden />

        <div className="record__actions">
          <button
            type="button"
            className="record__fab"
            aria-label="러닝 가이드"
            onClick={onGuideOpen}
          >
            <img src={iconBulb} alt="" />
          </button>
          <button type="button" className="record__start">
            시작
          </button>
          <button type="button" className="record__fab" aria-label="음악">
            <img src={iconMusic} alt="" />
          </button>
        </div>
      </div>

      <div className="record-nav-dock">
        <nav className="record-nav">
          <ul className="record-nav__list">
            {navTabs.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  className={`record-nav__tab${t.active ? " record-nav__tab--active" : ""}`}
                >
                  <img className="record-nav__icon" src={t.icon} alt="" />
                  <span>{t.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
