import { profileData, profileStats, highlights, myRecords } from "../data";
import flameIcon from "../assets/icons/mypage-flame.svg";
import hlStreak from "../assets/icons/mypage-hl-streak.svg";
import hlRace from "../assets/icons/mypage-hl-race.svg";
import hlCourse from "../assets/icons/mypage-hl-course.svg";
import hlPb from "../assets/icons/mypage-hl-pb.svg";
import tabHash from "../assets/icons/mypage-tab-hash.svg";
import tabMap from "../assets/icons/mypage-tab-map.svg";
import tabBookmark from "../assets/icons/mypage-tab-bookmark.svg";
import gpsArt1 from "../assets/icons/mypage-gps-art-1.svg";
import gpsArt2 from "../assets/icons/mypage-gps-art-2.svg";
import "./MyPage.css";

const highlightIcons: Record<string, string> = {
  streak: hlStreak,
  race: hlRace,
  course: hlCourse,
  pb: hlPb,
};

const gpsArtIcons: Record<1 | 2, string> = { 1: gpsArt1, 2: gpsArt2 };

export default function MyPage() {
  return (
    <div className="mypage">
      <section className="mypage-profile">
        <div className="mypage-profile__avatar">
          <img src={profileData.avatar} alt="" />
        </div>
        <div className="mypage-profile__identity">
          <div className="mypage-profile__name-row">
            <p className="mypage-profile__name">{profileData.name}</p>
            <span className="mypage-profile__level-pill">{profileData.level}</span>
          </div>
          <p className="mypage-profile__bio">{profileData.bio}</p>
          <div className="mypage-profile__streak-chip">
            <img className="mypage-profile__flame" src={flameIcon} alt="" />
            <span>{profileData.streakDays}일 연속 러닝 중</span>
          </div>
        </div>
      </section>

      <section className="mypage-stats">
        <div className="mypage-stats__card">
          <div className="mypage-stats__row">
            <div className="mypage-stats__stat">
              <p className="mypage-stats__value">{profileStats.records}</p>
              <p className="mypage-stats__label">기록</p>
            </div>
            <div className="mypage-stats__stat">
              <p className="mypage-stats__value">
                {profileStats.totalDistanceKm} <span className="mypage-stats__unit">km</span>
              </p>
              <p className="mypage-stats__label">누적 거리</p>
            </div>
            <div className="mypage-stats__stat">
              <p className="mypage-stats__value">{profileStats.followers}</p>
              <p className="mypage-stats__label">팔로워</p>
            </div>
          </div>
          <div className="mypage-stats__divider" />
          <div className="mypage-stats__goal">
            <div className="mypage-stats__goal-head">
              <span className="mypage-stats__goal-label">{profileStats.monthlyGoal.label}</span>
              <span className="mypage-stats__goal-val">
                <b>{profileStats.monthlyGoal.currentKm}</b> km · {profileStats.monthlyGoal.percent}%
              </span>
            </div>
            <div className="mypage-stats__goal-bar">
              <div
                className="mypage-stats__goal-fill"
                style={{ width: `${profileStats.monthlyGoal.percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mypage-highlights">
        {highlights.map((h) => (
          <div key={h.key} className="mypage-highlights__item">
            <div className="mypage-highlights__circle">
              <img src={highlightIcons[h.key]} alt="" />
            </div>
            <span>{h.label}</span>
          </div>
        ))}
      </section>

      <div className="mypage-records">
        <nav className="mypage-tabs" aria-label="기록 보기 방식">
          <button type="button" className="mypage-tabs__tab mypage-tabs__tab--active">
            <img src={tabHash} alt="목록" />
          </button>
          <button type="button" className="mypage-tabs__tab">
            <img src={tabMap} alt="지도" />
          </button>
          <button type="button" className="mypage-tabs__tab">
            <img src={tabBookmark} alt="저장됨" />
          </button>
        </nav>

        <ul className="mypage-grid">
          {myRecords.map((r) => (
            <li key={r.date} className="mypage-grid__cell">
              {r.gpsArt ? (
                <div className="mypage-grid__gps-art">
                  <img src={gpsArtIcons[r.gpsArt]} alt="" />
                </div>
              ) : (
                <img className="mypage-grid__photo" src={r.image} alt="" />
              )}
              <div className="mypage-grid__scrim" />
              {r.pb && <span className="mypage-grid__pb-badge">PB</span>}
              <p className="mypage-grid__dist">
                <b>{r.distanceKm}</b> km
              </p>
              <p className="mypage-grid__date">{r.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
