import { StatusBar } from "../components/TopBars";
import "./ScheduleListPage.css";

type Props = {
  onBack: () => void;
  onOpenSchedule: () => void;
};

type Badge = {
  label: string;
  tone: "lime" | "limeOutline" | "orange" | "gray";
};

type ScheduleItem = {
  title: string;
  meta: string;
  badges: Badge[];
  status?: Badge;
  summary?: string;
  summaryTone?: "lime" | "orange";
  onClick?: () => void;
};

const joinedItems: Omit<ScheduleItem, "onClick">[] = [
  {
    title: "NR Crew-저녁 러닝",
    meta: "7/9(목) 19:00 · 뚝섬유원지 3번 출구",
    badges: [
      { label: "크루", tone: "limeOutline" },
      { label: "D-1", tone: "lime" },
    ],
    status: { label: "참석", tone: "lime" },
    summary: "참석 12 · 불참 3 · 미응답 5",
    summaryTone: "lime",
  },
  {
    title: "한강 마라톤 10K",
    meta: "7/25(토) 18:00 · 여의도한강공원",
    badges: [
      { label: "대회", tone: "orange" },
      { label: "D-17", tone: "lime" },
    ],
    status: { label: "접수 완료", tone: "gray" },
  },
  {
    title: "수요 정기런",
    meta: "7/15(수) 19:00 · 반포한강공원 잠수교 남단",
    badges: [
      { label: "크루", tone: "limeOutline" },
      { label: "매주 수", tone: "gray" },
    ],
    status: { label: "미정", tone: "gray" },
    summary: "참석 8 · 미응답 11",
    summaryTone: "lime",
  },
];

const interestedItems: ScheduleItem[] = [
  {
    title: "여의도 나이트런",
    meta: "8/22(토) 20:00 · 여의도 한강공원",
    badges: [{ label: "대회", tone: "orange" }],
    summary: "접수 마감 D-5",
    summaryTone: "orange",
  },
  {
    title: "춘천 마라톤",
    meta: "10/25(일) 09:00 · 춘천 공지천 일원",
    badges: [{ label: "대회", tone: "orange" }],
    summary: "접수 마감 D-18",
    summaryTone: "orange",
  },
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

function BadgeView({ badge }: { badge: Badge }) {
  return <span className={`schedule-list-badge schedule-list-badge--${badge.tone}`}>{badge.label}</span>;
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
  const Component = item.onClick ? "button" : "div";

  return (
    <Component className="schedule-list-card" type={item.onClick ? "button" : undefined} onClick={item.onClick}>
      <div className="schedule-list-card__top">
        <div className="schedule-list-card__badges">
          {item.badges.map((badge) => (
            <BadgeView badge={badge} key={`${item.title}-${badge.label}`} />
          ))}
        </div>
        {item.status && (
          <div className="schedule-list-card__status">
            <BadgeView badge={item.status} />
          </div>
        )}
      </div>
      <div className="schedule-list-card__body">
        <h2>{item.title}</h2>
        <p>{item.meta}</p>
      </div>
      {item.summary && (
        <p className={`schedule-list-card__summary schedule-list-card__summary--${item.summaryTone}`}>
          {item.summary}
        </p>
      )}
    </Component>
  );
}

export default function ScheduleListPage({ onBack, onOpenSchedule }: Props) {
  const joined = [{ ...joinedItems[0], onClick: onOpenSchedule }, ...joinedItems.slice(1)];

  return (
    <div className="phone schedule-list-page">
      <StatusBar />
      <header className="schedule-list-page__header">
        <button type="button" onClick={onBack} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <h1>내 일정</h1>
      </header>

      <main className="schedule-list-page__content">
        <div className="schedule-list-page__filters">
          <button className="schedule-list-page__filter schedule-list-page__filter--active" type="button">
            예정
          </button>
          <button className="schedule-list-page__filter" type="button">
            종료
          </button>
        </div>

        <section className="schedule-list-section">
          <h2>참여 일정</h2>
          <div className="schedule-list-section__cards">
            {joined.map((item) => (
              <ScheduleCard item={item} key={item.title} />
            ))}
          </div>
        </section>

        <section className="schedule-list-section">
          <h2>관심 대회</h2>
          <div className="schedule-list-section__cards">
            {interestedItems.map((item) => (
              <ScheduleCard item={item} key={item.title} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
