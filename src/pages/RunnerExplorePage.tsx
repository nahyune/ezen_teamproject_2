import type { CSSProperties, ReactNode } from "react";
import { StatusBar } from "../components/TopBars";
import BottomNav from "../components/BottomNav";
import runner1 from "../assets/img/runner1.png";
import runner2 from "../assets/img/runner2.png";
import runner3 from "../assets/img/runner3.png";
import runner4 from "../assets/img/runner4.png";
import runner5 from "../assets/img/runner5.png";
import runner6 from "../assets/img/runner6.png";
import course1 from "../assets/img/course1.png";
import race1 from "../assets/img/race1.png";
import "./RunnerExplorePage.css";

type Props = {
  onBack: () => void;
};

type ProfileItem = {
  image: string;
  name: string;
  meta: string;
  action?: "follow" | "cheer";
  position?: CSSProperties["objectPosition"];
};

type QuickLink = Pick<ProfileItem, "image" | "position"> & {
  label: string;
};

const quickLinks: QuickLink[] = [
  { image: runner1, label: "내 크루", position: "45% 42%" },
  { image: race1, label: "주변 러너 지도", position: "50% 34%" },
];

const recentRunner: ProfileItem = {
  image: runner1,
  name: "안정윤",
  meta: "어제 응원함 · 러닝전도사",
  position: "45% 42%",
};

const popularRunners: ProfileItem[] = [
  { image: runner2, name: "run_jiwoo", meta: "러너_지우 · 응원 12.4k", action: "follow", position: "42% 50%" },
  { image: runner3, name: "tokyo_wonjungdae", meta: "도쿄원정대 · GPS 아트", action: "follow", position: "50% 34%" },
  { image: runner4, name: "pace_kim", meta: "김페이스 · 서브3 러너", action: "follow", position: "50% 44%" },
  { image: runner5, name: "night_runner", meta: "야간러너 · 응원 8.1k", action: "follow", position: "50% 48%" },
  { image: runner6, name: "seongsu_dawn", meta: "성수 새벽런 리더", action: "follow", position: "50% 42%" },
];

const crews: ProfileItem[] = [
  { image: race1, name: "한강 러너스", meta: "멤버 324 · 서울", action: "cheer", position: "50% 36%" },
  { image: course1, name: "성수 새벽런", meta: "멤버 128 · 성수", action: "cheer", position: "50% 58%" },
  { image: runner2, name: "한강 브릿지런", meta: "멤버 96 · 여의도", action: "cheer", position: "50% 88%" },
];

function BackIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden>
      <path
        d="M15.6 5.5L8.6 12.5L15.6 19.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function Avatar({
  item,
  className,
}: {
  item: Pick<ProfileItem, "image" | "position">;
  className: string;
}) {
  return (
    <img
      className={className}
      src={item.image}
      alt=""
      style={item.position ? { objectPosition: item.position } : undefined}
    />
  );
}

function PageSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: ReactNode;
}) {
  return (
    <section className="runner-page__section">
      <div className="runner-page__section-head">
        <h2>{title}</h2>
        {action && <button type="button">{action}</button>}
      </div>
      {children}
    </section>
  );
}

function ProfileRow({ item }: { item: ProfileItem }) {
  return (
    <li className="runner-profile">
      <Avatar className="runner-profile__avatar" item={item} />
      <div className="runner-profile__text">
        <strong>{item.name}</strong>
        <span>{item.meta}</span>
      </div>
      {item.action === "follow" && (
        <button className="runner-profile__follow" type="button">
          팔로우
        </button>
      )}
      {item.action === "cheer" && (
        <button className="runner-profile__cheer" type="button">
          응원하기
        </button>
      )}
      {item.action && (
        <button className="runner-profile__dismiss" type="button" aria-label={`${item.name} 숨기기`}>
          <CloseIcon />
        </button>
      )}
    </li>
  );
}

export default function RunnerExplorePage({ onBack }: Props) {
  return (
    <div className="phone runner-page">
      <StatusBar />
      <header className="runner-page__top">
        <button className="runner-page__back" type="button" onClick={onBack} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <h1>인기 러너</h1>
      </header>

      <main className="runner-page__content">
        <input className="runner-page__search" aria-label="러너·크루 검색" placeholder="러너·크루 검색" />

        <div className="runner-page__quick">
          {quickLinks.map((item) => (
            <button className="runner-page__quick-item" type="button" key={item.label}>
              <Avatar className="runner-page__quick-avatar" item={item} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <PageSection title="최근 응원한 러너" action="전체 보기">
          <div className="runner-profile runner-profile--recent">
            <Avatar className="runner-profile__avatar" item={recentRunner} />
            <div className="runner-profile__text">
              <strong>{recentRunner.name}</strong>
              <span>{recentRunner.meta}</span>
            </div>
          </div>
        </PageSection>

        <PageSection title="인기 러너" action="모두 보기">
          <ul className="runner-page__list">
            {popularRunners.map((item) => (
              <ProfileRow key={item.name} item={item} />
            ))}
          </ul>
        </PageSection>

        <PageSection title="팔로우할 만한 크루" action="모두 보기">
          <ul className="runner-page__list">
            {crews.map((item) => (
              <ProfileRow key={item.name} item={item} />
            ))}
          </ul>
        </PageSection>
      </main>

      <BottomNav />
    </div>
  );
}
