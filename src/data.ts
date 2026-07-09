// All home-screen content, extracted from the Figma "메인 홈" frame.
import hero from "./assets/img/hero.png";
import course1 from "./assets/img/course1.png";
import course2 from "./assets/img/course2.png";
import course3 from "./assets/img/course3.png";
import runner1 from "./assets/img/runner1.png";
import runner2 from "./assets/img/runner2.png";
import runner3 from "./assets/img/runner3.png";
import runner4 from "./assets/img/runner4.png";
import runner5 from "./assets/img/runner5.png";
import runner6 from "./assets/img/runner6.png";
import schedule from "./assets/img/schedule-hero.png";
import race1 from "./assets/img/race1.png";
import race2 from "./assets/img/race2.png";
import challenge1 from "./assets/img/challenge1.png";
import challenge2 from "./assets/img/challenge2.png";
import challenge3 from "./assets/img/challenge3.png";
import mag1 from "./assets/img/mag1.png";
import mag2 from "./assets/img/mag2.png";
import mag3 from "./assets/img/mag3.png";

export const heroData = {
  title: "어제 저녁 러닝",
  meta: "26년 7월 8일 · 경복궁",
  image: hero,
  stats: [
    { label: "거리", value: "8.75 km" },
    { label: "시간", value: "41:56" },
    { label: "평균 페이스", value: "8’35”" },
  ],
};

export type Course = {
  image: string;
  name: string;
  rating: string;
  detail: string;
};

export const courses: Course[] = [
  { image: course1, name: "내 근처 코스", rating: "5.0", detail: "4.6km · 쉬움" },
  { image: course2, name: "인기 코스", rating: "4.8", detail: "6.5km · 보통" },
  { image: course3, name: "도전 코스", rating: "4.7", detail: "10km · 어려움" },
];

// `crop` mirrors each photo's position/zoom inside the 68px avatar frame in Figma.
export type Runner = {
  image: string;
  name: string;
  crop: { width: string; height: string; left: string; top: string };
};

export const runners: Runner[] = [
  { image: runner1, name: "안정은", crop: { width: "100%", height: "125%", left: "0", top: "0.1%" } },
  { image: runner2, name: "러너_준", crop: { width: "100%", height: "150%", left: "0", top: "0.3%" } },
  { image: runner3, name: "김페이스", crop: { width: "149.81%", height: "224.72%", left: "-24.62%", top: "-5.6%" } },
  { image: runner4, name: "서울원정대", crop: { width: "404.74%", height: "607.11%", left: "-138.2%", top: "-172.08%" } },
  { image: runner5, name: "위런런", crop: { width: "207.35%", height: "259.22%", left: "-58.75%", top: "-65.7%" } },
  { image: runner6, name: "김소빈", crop: { width: "177.94%", height: "266.91%", left: "-39.35%", top: "-40.57%" } },
];

export const scheduleData = {
  image: schedule,
  title: "NR Crew-저녁 러닝",
  date: "2026-07-07(화)",
  time: "18:00",
};

export const raceFilters = [
  "서울",
  "경기·인천",
  "강원",
  "충청",
  "경상",
  "전라",
  "제주",
];

export type Race = {
  image: string;
  dday: string;
  title: string;
  datetime: string;
  // optional per-image placement inside the 250×320 card (mirrors Figma)
  imageBox?: { width: string; height: string; left: string; top: string };
  bright?: boolean; // slightly brighten a dark photo
};

export const races: Race[] = [
  { image: race1, dday: "D-3", title: "한강 마라톤", datetime: "2026-07-25(토) 18:00" },
  {
    image: race2,
    dday: "D-31",
    title: "여의도 나이트런",
    datetime: "2026-08-22(토) 18:00",
    imageBox: { width: "306px", height: "382px", left: "-28px", top: "-50px" },
    bright: true,
  },
];

export type Challenge = {
  image: string;
  name: string;
  participants: string;
  // photo placement inside the 100×80 thumbnail (mirrors Figma)
  crop: { width: string; height: string; left: string; top: string };
};

export const challenges: Challenge[] = [
  {
    image: challenge1,
    name: "경복궁 댕댕런",
    participants: "5,234명 참여",
    crop: { width: "100%", height: "133.14%", left: "0", top: "-18.55%" },
  },
  {
    image: challenge2,
    name: "30일 러닝 습관 만들기",
    participants: "12,847명 참여",
    crop: { width: "100%", height: "187.5%", left: "0", top: "-0.55%" },
  },
  {
    image: challenge3,
    name: "첫 5km 완주하기",
    participants: "8,543명 참여",
    crop: { width: "153.04%", height: "286.94%", left: "-26.52%", top: "-60.7%" },
  },
];

export type Article = {
  image: string;
  title: string[];
  preview: string[];
  // optional photo placement (mirrors Figma) — used to hide a white edge on mag1
  imageBox?: { width: string; height: string; left: string; top: string };
};

export const articles: Article[] = [
  {
    image: mag1,
    title: ["런린이", "첫 러닝화 가이드"],
    preview: ["종류가 너무 많아서", "고르기 어려운 당신에게 -"],
    imageBox: { width: "101.21%", height: "100.67%", left: "0", top: "0" },
  },
  {
    image: mag2,
    title: ["러닝 시작", "전 2분, 후 3분"],
    preview: ["무릎을 지키는", "가장 짧은 루틴"],
  },
  {
    image: mag3,
    title: ["서울을", "달리는 크루들"],
    preview: ["첫 번째 크루,", "와우산30을 만나다"],
  },
];
