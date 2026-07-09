import { StatusBar } from "../components/TopBars";
import { ChevronRight } from "../components/Icons";
import scheduleImage from "../assets/img/schedule-hero.png";
import runner1 from "../assets/img/runner1.png";
import runner2 from "../assets/img/runner2.png";
import runner3 from "../assets/img/runner3.png";
import runner4 from "../assets/img/runner4.png";
import runner5 from "../assets/img/runner5.png";
import runner6 from "../assets/img/runner6.png";
import course1 from "../assets/img/course1.png";
import "./ScheduleDetailPage.css";

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

function BackIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path
        d="M16.1 6.4L9.5 13L16.1 19.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

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

export default function ScheduleDetailPage({ onBack }: Props) {
  return (
    <div className="phone schedule-page">
      <StatusBar />
      <header className="schedule-page__header">
        <button type="button" onClick={onBack} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <button type="button" aria-label="공유하기">
          <ShareIcon />
        </button>
      </header>

      <main className="schedule-page__content">
        <section className="schedule-page__hero">
          <img src={scheduleImage} alt="" />
          <div className="schedule-page__hero-shade" />
        </section>

        <section className="schedule-page__intro">
          <div className="schedule-page__badges">
            <span className="schedule-page__badge schedule-page__badge--outline">크루</span>
            <span className="schedule-page__badge schedule-page__badge--filled">D-1</span>
          </div>
          <h1>NR Crew-저녁 러닝</h1>
          <p>2026년 7월 9일 (목) 19:00</p>
        </section>

        <section className="schedule-page__cards">
          <div className="schedule-info-card">
            <div className="schedule-info-row">
              <span className="schedule-info-row__label">장소</span>
              <strong>뚝섬유원지 3번 출구</strong>
              <button type="button">
                지도 보기
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="schedule-info-row">
              <span className="schedule-info-row__label">코스</span>
              <strong>뚝섬 → 잠실대교 왕복 6km</strong>
            </div>
            <div className="schedule-info-row">
              <span className="schedule-info-row__label">페이스</span>
              <strong>6'30&quot; 그룹런</strong>
            </div>
          </div>

          <div className="schedule-attendees-card">
            <div className="schedule-attendees-card__head">
              <strong>참석자</strong>
              <span>참석 12 · 불참 3 · 미응답 5</span>
            </div>
            <div className="schedule-attendees-card__avatars">
              {attendees.map((attendee, index) => (
                <img
                  key={`${attendee.image}-${index}`}
                  src={attendee.image}
                  alt=""
                  style={{ objectPosition: attendee.position }}
                />
              ))}
              <span>+5</span>
            </div>
          </div>

          <div className="schedule-notice-card">
            <strong>크루 공지</strong>
            <p>우천 시 당일 17시에 취소 공지 드려요.</p>
            <p>짐 보관은 3번 출구 편의점 앞에서 가능합니다.</p>
          </div>
        </section>
      </main>

      <div className="schedule-rsvp">
        <button className="schedule-rsvp__no" type="button">
          불참
        </button>
        <button className="schedule-rsvp__yes" type="button">
          <CheckIcon />
          참석
        </button>
      </div>
    </div>
  );
}
