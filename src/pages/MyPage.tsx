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

const highlightIcons: Record<string, string> = {
  streak: hlStreak,
  race: hlRace,
  course: hlCourse,
  pb: hlPb,
};

const gpsArtIcons: Record<1 | 2, string> = { 1: gpsArt1, 2: gpsArt2 };

export default function MyPage() {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex items-center gap-4 pt-3.5 px-[18px] pb-1.5">
        <div className="flex-none w-[84px] h-[84px] rounded-full overflow-hidden">
          <img className="w-full h-full object-cover" src={profileData.avatar} alt="" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[7px]">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold tracking-[-0.48px] text-white">
              {profileData.name}
            </p>
            <span className="px-2.5 py-1 rounded-full bg-primary-lime font-display text-[11px] tracking-[0.33px] text-black">
              {profileData.level}
            </span>
          </div>
          <p className="text-sm tracking-[-0.42px] text-white/55">{profileData.bio}</p>
          <div className="flex items-center gap-[5px] px-2.5 py-[5px] rounded-full bg-pill border border-pill-border text-sm tracking-[-0.42px] text-[#f6f6ed]">
            <img className="w-3.5 h-3.5" src={flameIcon} alt="" />
            <span>{profileData.streakDays}일 연속 러닝 중</span>
          </div>
        </div>
      </section>

      <section className="pt-3.5 px-[18px] pb-1.5">
        <div className="flex flex-col gap-4 py-[18px] px-5 rounded-card bg-elevated">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-[26px] leading-none text-white">
                {profileStats.records}
              </p>
              <p className="text-sm tracking-[-0.42px] text-white/55">기록</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-[26px] leading-none text-white">
                {profileStats.totalDistanceKm} <span className="text-2xl">km</span>
              </p>
              <p className="text-sm tracking-[-0.42px] text-white/55">누적 거리</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-[26px] leading-none text-white">
                {profileStats.followers}
              </p>
              <p className="text-sm tracking-[-0.42px] text-white/55">팔로워</p>
            </div>
          </div>
          <div className="h-px bg-white/8" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-[-0.42px] text-white/80">
                {profileStats.monthlyGoal.label}
              </span>
              <span className="text-sm tracking-[-0.42px] text-white/55">
                <b className="font-display font-normal text-base text-primary-lime">
                  {profileStats.monthlyGoal.currentKm}
                </b>{" "}
                km · {profileStats.monthlyGoal.percent}%
              </span>
            </div>
            <div className="h-1.5 rounded-[3px] bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-[3px] bg-primary-lime"
                style={{ width: `${profileStats.monthlyGoal.percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-start justify-between pt-4 px-[26px] pb-[18px]">
        {highlights.map((h, i) => (
          <div
            key={h.key}
            className="flex flex-col items-center gap-[7px] text-xs tracking-[-0.36px] text-white/70"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-elevated border-[1.5px] border-primary-lime/70">
              <img
                className={i === 2 ? "w-[35px] h-[35px]" : "w-[26px] h-[26px]"}
                src={highlightIcons[h.key]}
                alt=""
              />
            </div>
            <span>{h.label}</span>
          </div>
        ))}
      </section>

      <div className="flex flex-col">
        <nav className="flex h-[50px]" aria-label="기록 보기 방식">
          <button
            type="button"
            className="flex-1 flex items-center justify-center border-b-2 border-primary-lime"
          >
            <img className="w-[22px] h-[22px]" src={tabHash} alt="목록" />
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center border-b-2 border-transparent"
          >
            <img className="w-[22px] h-[22px]" src={tabMap} alt="지도" />
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center border-b-2 border-transparent"
          >
            <img className="w-[22px] h-[22px]" src={tabBookmark} alt="저장됨" />
          </button>
        </nav>

        <ul className="grid grid-cols-3 gap-[2px]">
          {myRecords.map((r) => (
            <li key={r.date} className="relative aspect-square overflow-hidden bg-[#131315]">
              {r.gpsArt ? (
                <div className="absolute inset-x-[18%] inset-y-[20%]">
                  <img className="w-full h-full object-contain" src={gpsArtIcons[r.gpsArt]} alt="" />
                </div>
              ) : (
                <img className="absolute inset-0 w-full h-full object-cover" src={r.image} alt="" />
              )}
              <div className="absolute left-0 right-0 bottom-0 h-[45%] bg-linear-to-b from-black/0 to-black/85" />
              {r.pb && (
                <span className="absolute right-2 top-2 px-[7px] py-[3px] rounded-full bg-primary-lime font-display text-[9px] tracking-[0.18px] text-black">
                  PB
                </span>
              )}
              <p className="absolute left-2 bottom-[26px] flex items-baseline gap-[2px] text-[10px] tracking-[-0.3px] text-primary-lime/90">
                <b className="font-display font-normal text-[15px] text-primary-lime">
                  {r.distanceKm}
                </b>{" "}
                km
              </p>
              <p className="absolute left-2 bottom-2 text-xs tracking-[-0.36px] text-white/70 whitespace-nowrap">
                {r.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
