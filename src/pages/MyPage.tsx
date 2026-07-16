import { useState } from "react";
import { profileData, profileStats, highlights, myRecords, type MyRecord } from "../data";
import { useUserProfile } from "../lib/userProfile";
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
import iconHeart from "../assets/icons/icon-heart.svg";
import iconMessage from "../assets/icons/icon-message.svg";
import iconRetweet from "../assets/icons/icon-retweet.svg";

const highlightIcons: Record<string, string> = {
  streak: hlStreak,
  race: hlRace,
  course: hlCourse,
  pb: hlPb,
};

const gpsArtIcons: Record<1 | 2, string> = { 1: gpsArt1, 2: gpsArt2 };

type HighlightKey = "streak" | "race" | "course" | "pb";

const highlightDetails: Record<Exclude<HighlightKey, "streak">, Array<{ title: string; meta: string; value: string }>> = {
  race: [
    { title: "서울 하프 마라톤", meta: "2026.06.28 · 21.1km", value: "1:48:32" },
    { title: "한강 10K", meta: "2026.06.12 · 10km", value: "48:21" },
    { title: "서울 나이트런", meta: "2026.05.23 · 10km", value: "51:08" },
  ],
  course: [
    { title: "여의도 고구마런", meta: "평균 8.0km", value: "12회" },
    { title: "경복궁 야간 코스", meta: "평균 8.75km", value: "8회" },
    { title: "석촌호수 순환 코스", meta: "평균 4.8km", value: "6회" },
  ],
  pb: [
    { title: "5K", meta: "2026.06.18 · 여의도", value: "23:42" },
    { title: "10K", meta: "2026.06.12 · 한강 10K", value: "48:21" },
    { title: "하프", meta: "2026.06.28 · 서울 하프", value: "1:48:32" },
  ],
};

const julyDays = Array.from({ length: 31 }, (_, index) => index + 1);
const streakRunDays = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

export default function MyPage() {
  // 프로필 편집(이름·소개·아바타)이 즉시 반영된다. 레벨·스트릭은 목데이터 유지.
  const { profile, avatarSrc } = useUserProfile();
  const [records, setRecords] = useState<MyRecord[]>(myRecords);
  const [selectedRecord, setSelectedRecord] = useState<MyRecord | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDistance, setEditDistance] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [activeHighlight, setActiveHighlight] = useState<HighlightKey | null>(null);

  const openRecord = (record: MyRecord) => {
    setSelectedRecord(record);
    setIsMoreOpen(false);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (!selectedRecord) return;
    setEditDistance(selectedRecord.distanceKm);
    setEditDate(selectedRecord.date);
    setEditCaption(selectedRecord.caption);
    setIsMoreOpen(false);
    setIsEditing(true);
  };

  const saveRecord = () => {
    if (!selectedRecord || !editDistance.trim() || !editDate.trim()) return;
    const updatedRecord = {
      ...selectedRecord,
      distanceKm: editDistance.trim(),
      date: editDate.trim(),
      caption: editCaption.trim(),
    };
    setRecords((current) => current.map((record) => (record === selectedRecord ? updatedRecord : record)));
    setSelectedRecord(updatedRecord);
    setIsEditing(false);
  };

  const deleteRecord = () => {
    if (!selectedRecord) return;
    setRecords((current) => current.filter((record) => record !== selectedRecord));
    setSelectedRecord(null);
    setIsMoreOpen(false);
  };
  return (
    <div className="flex flex-col gap-5 pb-[130px]">
      <section className="flex items-center gap-4 pt-3.5 px-[18px] pb-1.5">
        <div className="flex-none w-[84px] h-[84px] rounded-full overflow-hidden">
          <img className="w-full h-full object-cover" src={avatarSrc} alt="" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[7px]">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold tracking-[-0.48px] text-white">
              {profile.name}
            </p>
            <span className="px-2.5 py-1 rounded-full bg-primary-lime font-display text-[11px] tracking-[0.33px] text-black">
              {profileData.level}
            </span>
          </div>
          <p className="text-sm tracking-[-0.42px] text-white/55">{profile.bio}</p>
          <div className="inline-flex w-fit max-w-full shrink-0 self-start items-center gap-1 whitespace-nowrap rounded-full border border-pill-border bg-pill px-3.5 py-2 text-sm font-medium leading-none tracking-[-0.42px] text-[#f6f6ed]">
            <img className="w-3.5 h-3.5" src={flameIcon} alt="" />
            <span>{profileData.streakDays}일 연속 러닝 중</span>
          </div>
        </div>
      </section>

      <section className="pt-3.5 px-[18px] pb-1.5">
        <div className="flex flex-col gap-4 py-[18px] px-5 rounded-card bg-elevated">
          <div className="flex items-start justify-between px-3">
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-[26px] leading-8 text-white">
                {profileStats.records}
              </p>
              <p className="text-sm tracking-[-0.42px] text-white/55">기록</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-[26px] leading-8 text-white">
                {profileStats.totalDistanceKm} <span className="text-2xl leading-none">km</span>
              </p>
              <p className="text-sm tracking-[-0.42px] text-white/55">누적 거리</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-[26px] leading-8 text-white">
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
          <button
            type="button"
            key={h.key}
            className="flex flex-col items-center gap-[7px] text-xs tracking-[-0.36px] text-white/70"
            onClick={() => setActiveHighlight(h.key as HighlightKey)}
            aria-label={`${h.label} 자세히 보기`}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-elevated border-[1.5px] border-primary-lime/70">
              <img
                className={i === 2 ? "w-[35px] h-[35px]" : "w-[26px] h-[26px]"}
                src={highlightIcons[h.key]}
                alt=""
              />
            </div>
            <span>{h.label}</span>
          </button>
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
          {records.map((r) => (
            <li key={r.date}>
              <button
                type="button"
                className="relative block aspect-square w-full overflow-hidden bg-[#131315] text-left"
                onClick={() => openRecord(r)}
                aria-label={`${r.date} 게시물 크게 보기`}
              >
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
                  <b className="font-display font-normal text-[15px] text-primary-lime">{r.distanceKm}</b>{" "}
                  km
                </p>
                <p className="absolute left-2 bottom-2 text-xs tracking-[-0.36px] text-white/70 whitespace-nowrap">
                  {r.date}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeHighlight && (
        <div
          className="fixed inset-0 z-[220] flex items-end bg-black/65"
          onClick={() => setActiveHighlight(null)}
          role="presentation"
        >
          <section
            className="w-full rounded-t-[8px] border-t border-white/10 bg-[#151517] px-[18px] pb-[calc(42px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_45px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-10 h-1 w-10 rounded-full bg-white/20" />
            <header className="mb-8 flex items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-lime/60 bg-elevated">
                  <img src={highlightIcons[activeHighlight]} alt="" className={activeHighlight === "course" ? "h-6 w-6" : "h-5 w-5"} />
                </span>
                <div>
                  <h2 className="text-[18px] font-semibold leading-none text-white">
                    {highlights.find((item) => item.key === activeHighlight)?.label}
                  </h2>
                  <p className="mt-1.5 text-[12px] font-normal text-white/45">나의 러닝 하이라이트</p>
                </div>
              </div>
            </header>

            {activeHighlight === "streak" ? (
              <div>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="rounded-[6px] bg-elevated px-4 py-3">
                    <span className="text-[12px] font-normal text-white/45">현재 연속 기록</span>
                    <p className="mt-1 font-display text-[25px] font-normal text-primary-lime">12일</p>
                  </div>
                  <div className="rounded-[6px] bg-elevated px-4 py-3">
                    <span className="text-[12px] font-normal text-white/45">최장 연속 기록</span>
                    <p className="mt-1 font-display text-[25px] font-normal text-white">18일</p>
                  </div>
                </div>
                <div className="rounded-[6px] bg-elevated px-4 pb-4 pt-3.5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[14px] font-medium text-white">2026년 7월</h3>
                    <span className="text-[11px] font-normal text-white/40">12회 러닝</span>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-normal text-white/35">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
                    {Array.from({ length: 3 }, (_, index) => <span key={`blank-${index}`} />)}
                    {julyDays.map((day) => (
                      <span
                        key={day}
                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                          streakRunDays.has(day) ? "bg-primary-lime font-medium text-black" : "text-white/55"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[6px] bg-elevated">
                {highlightDetails[activeHighlight].map((item, index) => (
                  <div key={item.title} className={`flex items-center justify-between px-4 py-4 ${index > 0 ? "border-t border-white/8" : ""}`}>
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-[14px] font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-[12px] font-normal text-white/45">{item.meta}</p>
                    </div>
                    <strong className="flex-none font-display text-[20px] font-normal text-primary-lime">{item.value}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {selectedRecord && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 px-[18px] backdrop-blur-[2px]"
          onClick={() => {
            setSelectedRecord(null);
            setIsMoreOpen(false);
            setIsEditing(false);
          }}
          role="presentation"
        >
          <article
            className="relative w-full max-w-[394px] bg-[#101012] shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -top-10 right-0 z-20">
              <button
                type="button"
                aria-label="더보기"
                aria-expanded={isMoreOpen}
                className="title-2 leading-none text-[var(--text-soft)]"
                onClick={() => setIsMoreOpen((open) => !open)}
              >
                ···
              </button>
              {isMoreOpen && (
                <div className="absolute right-0 top-7 w-[168px] overflow-hidden rounded-[8px] border border-white/10 bg-[#1c1c1f] py-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.5)]">
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3.5 text-left text-[14px] font-normal text-white hover:bg-white/7"
                    onClick={startEditing}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3.5 text-left text-[14px] font-medium text-[var(--primary-orange)] hover:bg-white/7"
                    onClick={deleteRecord}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
            <div className="relative aspect-square w-full overflow-hidden bg-[#131315]">
              {selectedRecord.gpsArt ? (
                <div className="absolute inset-x-[18%] inset-y-[20%]">
                  <img className="h-full w-full object-contain" src={gpsArtIcons[selectedRecord.gpsArt]} alt="" />
                </div>
              ) : (
                <img className="absolute inset-0 h-full w-full object-cover" src={selectedRecord.image} alt="" />
              )}
              {selectedRecord.pb && (
                <span className="absolute left-4 top-4 rounded-full bg-primary-lime px-2.5 py-1 font-display text-[10px] tracking-[0.2px] text-black">
                  PB
                </span>
              )}
              <div className="absolute bottom-4 left-4 text-white">
                <p className="flex items-baseline gap-1 text-[13px] font-normal text-primary-lime">
                  <b className="font-display text-[30px] font-normal leading-none">{selectedRecord.distanceKm}</b> km
                </p>
                <p className="mt-1 text-[14px] font-normal text-white/75">{selectedRecord.date}</p>
              </div>
              {isEditing && (
                <div className="absolute inset-x-4 bottom-4 z-20 rounded-[8px] border border-white/10 bg-[#1c1c1f] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.55)]">
                  <p className="mb-3 text-[15px] font-medium text-white">게시물 수정</p>
                  <label className="mb-2 flex h-11 items-center gap-3 rounded-[6px] bg-white/7 px-3">
                    <span className="w-10 flex-none text-[12px] font-normal text-white/50">거리</span>
                    <input
                      value={editDistance}
                      onChange={(event) => setEditDistance(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-white outline-none"
                    />
                    <span className="text-[12px] text-white/50">km</span>
                  </label>
                  <label className="flex h-11 items-center gap-3 rounded-[6px] bg-white/7 px-3">
                    <span className="w-10 flex-none text-[12px] font-normal text-white/50">내용</span>
                    <input
                      value={editDate}
                      onChange={(event) => setEditDate(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-white outline-none"
                    />
                  </label>
                  <label className="mt-2 flex items-start gap-3 rounded-[6px] bg-white/7 px-3 py-3">
                    <span className="w-10 flex-none pt-0.5 text-[12px] font-normal text-white/50">문구</span>
                    <textarea
                      value={editCaption}
                      onChange={(event) => setEditCaption(event.target.value)}
                      rows={2}
                      className="min-w-0 flex-1 resize-none bg-transparent text-[14px] font-normal leading-[1.45] text-white outline-none"
                    />
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" className="h-10 rounded-[6px] bg-white/8 text-[14px] font-medium text-white" onClick={() => setIsEditing(false)}>
                      취소
                    </button>
                    <button type="button" className="h-10 rounded-[6px] bg-[var(--primary-lime)] text-[14px] font-medium text-black" onClick={saveRecord}>
                      저장
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-[#101012] px-4 py-3.5 text-[14px] font-normal leading-[1.5] text-white/85">
              <span className="mr-2 font-medium text-white">{profile.name}</span>
              {selectedRecord.caption}
            </div>
            <div className="flex items-center gap-5 border-t border-white/8 bg-[#101012] px-4 py-3 text-[13px] font-normal text-white/70">
              <span className="flex items-center gap-1.5">
                <img src={iconHeart} alt="" className="h-[18px] w-[18px]" />
                응원 {selectedRecord.cheers}
              </span>
              <span className="flex items-center gap-1.5">
                <img src={iconMessage} alt="" className="h-[18px] w-[18px]" />
                댓글 {selectedRecord.comments.length}
              </span>
              <span className="flex items-center gap-1.5">
                <img src={iconRetweet} alt="" className="h-[18px] w-[18px]" />
                공유 {selectedRecord.reposts}
              </span>
            </div>
            <div className="flex flex-col gap-2 border-t border-white/8 bg-[#101012] px-4 pb-4 pt-3 text-[13px] font-normal leading-[1.45] text-white/75">
              {selectedRecord.comments.map((comment, index) => (
                <p key={`${comment.author}-${index}`}>
                  <span className="mr-2 font-medium text-white">{comment.author}</span>
                  {comment.text}
                </p>
              ))}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
