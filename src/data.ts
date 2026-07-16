// All home-screen content, extracted from the Figma "메인 홈" frame.
import hero from "./assets/img/hero.webp";
import course1 from "./assets/img/course1.webp";
import course2 from "./assets/img/100img.png";
import course3 from "./assets/img/course3.webp";
import courseThumbSeoul from "./assets/img/course-thumb-seoul.webp";
import courseThumbNamsan from "./assets/img/course-thumb-namsan.webp";
import courseDetailMap from "./assets/img/course-detail-map.webp";
import popularCourseMain from "./assets/img/popular-course-main.webp";
import popularCourseSeokchon from "./assets/img/popular-course-seokchon.webp";
import popularCourseHangang from "./assets/img/popular-course-hangang.webp";
import popularCourseDetailMap from "./assets/img/popular-course-detail-map.webp";
import challengeCourseMain from "./assets/img/challenge-course-main.webp";
import challengeCourseGwanghwamun from "./assets/img/challenge-course-gwanghwamun.webp";
import challengeCourseYeontral from "./assets/img/challenge-course-yeontral.webp";
import challengeCourseGyeongbok from "./assets/img/challenge-course-gyeongbok.webp";
import challengeCourseDetailMap from "./assets/img/challenge-course-detail-map.webp";
import runner1 from "./assets/img/runner1.webp";
import runner2 from "./assets/img/runner2.webp";
import runner3 from "./assets/img/runner3.webp";
import runner4 from "./assets/img/runner4.webp";
import runner5 from "./assets/img/runner5.webp";
import runner6 from "./assets/img/runner6.webp";
import schedule from "./assets/img/schedule-hero.webp";
import race1 from "./assets/img/race1.webp";
import race2 from "./assets/img/race2.webp";
import challenge1 from "./assets/img/challenge1.webp";
import challenge2 from "./assets/img/challenge2.webp";
import challenge3 from "./assets/img/challenge3.webp";
import mag1 from "./assets/img/mag1.webp";
import mag2 from "./assets/img/mag2.webp";
import mag3 from "./assets/img/mag3.webp";
import mypageAvatar from "./assets/img/mypage-avatar.webp";
import record0708 from "./assets/img/mypage-record-0708.webp";
import record0707 from "./assets/img/mypage-record-0707.webp";
import record0630 from "./assets/img/mypage-record-0630.webp";
import record0628 from "./assets/img/mypage-record-0628.webp";
import record0627 from "./assets/img/mypage-record-0627.webp";
import record0626 from "./assets/img/mypage-record-0626.webp";
import record0615 from "./assets/img/mypage-record-0615.webp";
import record0612 from "./assets/img/mypage-record-0612.webp";
import record0611 from "./assets/img/mypage-record-0611.webp";
import record0605 from "./assets/img/mypage-record-0605.webp";
import feedKomazawaPark from "./assets/img/feed-komazawa-park.webp";
import feedRunningSelfie from "./assets/img/feed-running-selfie.webp";
import feedRunningShoes from "./assets/img/feed-running-shoes.webp";
import feedAhnHangangCrew from "./assets/img/feed-story-ahn-hangang-crew.webp";
import feedStoryAvatarNoRing from "./assets/img/feed-story-avatar-no-ring.webp";
import storyDogMap from "./assets/img/img-dog-map.webp";
import storyDogRunning from "./assets/img/story-dog-running.webp";
import storyGpsArtRun from "./assets/img/story-gps-art-run.webp";

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

export type CourseRecommendation = {
  image: string;
  name: string;
  level: string;
  distance: string;
  duration: string;
  rating: string;
  nearby: string;
};

export type CourseDetailKind = "yeouido" | "nodulseom" | "gwanghwamun" | "yeouidoGoguma" | "namsanHeart";

type CourseHero = {
  image: string;
  title: string;
  distance: string;
  level: CourseRecommendation["level"];
  meta: string;
  imageBox: { width: string; height: string; left: string; top: string };
  detail?: CourseDetailKind;
};

export type CourseExploreKind = "nearby" | "popular" | "challenge";

export type CourseExploreItem = CourseRecommendation & {
  detail?: CourseDetailKind;
};

export const courseLevelColors: Record<string, string> = {
  초급자: "var(--primary-lime)",
  중급자: "#FF9F43",
  상급자: "#E8734F",
  "가본 곳": "var(--primary-lime)",
  "안 가본 곳": "#E8734F",
};

export type CourseExploreData = {
  sectionTitle: string;
  filters: string[];
  hero: CourseHero;
  courses: CourseExploreItem[];
};

export type CourseDetailData = {
  image: string;
  title: string;
  level: string;
  rating: string;
  location: string;
  stats: { label: string; value: string }[];
  variants: { title: string; level: string; active?: boolean }[];
  amenities: { value: string; label: string }[];
  social: string;
  reviews: string[];
};

export const courseRecommendations: CourseRecommendation[] = [
  {
    image: course1,
    name: "여의도 한 바퀴",
    level: "초급자",
    distance: "4.6km",
    duration: "약 30분",
    rating: "5.0",
    nearby: "내 위치에서 2.1km",
  },
  {
    image: course2,
    name: "반포 한강공원 코스",
    level: "초급자",
    distance: "3.8km",
    duration: "약 25분",
    rating: "4.9",
    nearby: "내 위치에서 3.5km",
  },
  {
    image: course3,
    name: "잠실 한 바퀴 코스",
    level: "초급자",
    distance: "5.2km",
    duration: "약 35분",
    rating: "4.8",
    nearby: "내 위치에서 4.0km",
  },
  {
    image: courseThumbSeoul,
    name: "서울숲 → 뚝섬 왕복",
    level: "중급자",
    distance: "6.5km",
    duration: "약 45분",
    rating: "4.8",
    nearby: "내 위치에서 4.8km",
  },
  {
    image: popularCourseMain,
    name: "뚝섬유원지 왕복",
    level: "중급자",
    distance: "5.8km",
    duration: "약 40분",
    rating: "4.7",
    nearby: "내 위치에서 3.9km",
  },
  {
    image: popularCourseSeokchon,
    name: "성수 한강 왕복",
    level: "중급자",
    distance: "7.2km",
    duration: "약 48분",
    rating: "4.9",
    nearby: "내 위치에서 5.5km",
  },
  {
    image: courseThumbNamsan,
    name: "남산 순환 코스",
    level: "상급자",
    distance: "10km",
    duration: "약 70분",
    rating: "4.7",
    nearby: "내 위치에서 6.2km",
  },
  {
    image: popularCourseHangang,
    name: "남산 둘레길 코스",
    level: "상급자",
    distance: "8.7km",
    duration: "약 60분",
    rating: "4.6",
    nearby: "내 위치에서 5.8km",
  },
  {
    image: challengeCourseGwanghwamun,
    name: "북악 스카이웨이 코스",
    level: "상급자",
    distance: "11.5km",
    duration: "약 80분",
    rating: "4.8",
    nearby: "내 위치에서 7.4km",
  },
];

export const courseExplorePages: Record<CourseExploreKind, CourseExploreData> = {
  nearby: {
    sectionTitle: "지금 내 근처",
    filters: ["전체", "초급자", "중급자", "상급자"],
    hero: {
      image: course1,
      title: "여의도 한 바퀴",
      distance: "4.6km",
      level: "초급자",
      meta: "평지 코스 · 내 위치에서 2.1km",
      imageBox: { width: "100%", height: "154.51%", left: "0.08%", top: "-54.48%" },
      detail: "yeouido",
    },
    courses: courseRecommendations.map((course) => ({
      ...course,
      detail: course.name === "여의도 한 바퀴" ? "yeouido" : undefined,
    })),
  },
  popular: {
    sectionTitle: "인기 코스",
    filters: ["전체", "초급자", "중급자", "상급자"],
    hero: {
      image: popularCourseMain,
      title: "노들섬 코스",
      distance: "4.6km",
      level: "초급자",
      meta: "평지 코스 · 내 위치에서 2.9km",
      imageBox: { width: "100%", height: "131.92%", left: "-0.01%", top: "-22.79%" },
      detail: "nodulseom",
    },
    courses: [
      {
        image: popularCourseMain,
        name: "노들섬 코스",
        level: "초급자",
        distance: "1.5km",
        duration: "약 30분",
        rating: "5.0",
        nearby: "내 위치에서 2.1km",
        detail: "nodulseom",
      },
      {
        image: course1,
        name: "여의도 벚꽃길 코스",
        level: "초급자",
        distance: "2.3km",
        duration: "약 20분",
        rating: "4.9",
        nearby: "내 위치에서 1.8km",
      },
      {
        image: course2,
        name: "반포 무지개다리 코스",
        level: "초급자",
        distance: "1.8km",
        duration: "약 22분",
        rating: "4.8",
        nearby: "내 위치에서 3.0km",
      },
      {
        image: popularCourseSeokchon,
        name: "석촌 호수 코스",
        level: "중급자",
        distance: "2.5km",
        duration: "약 15분",
        rating: "4.8",
        nearby: "내 위치에서 4.8km",
      },
      {
        image: course3,
        name: "잠실 한강공원 코스",
        level: "중급자",
        distance: "3.4km",
        duration: "약 28분",
        rating: "4.7",
        nearby: "내 위치에서 3.6km",
      },
      {
        image: courseThumbSeoul,
        name: "뚝섬 한강공원 코스",
        level: "중급자",
        distance: "2.9km",
        duration: "약 20분",
        rating: "4.9",
        nearby: "내 위치에서 4.1km",
      },
      {
        image: popularCourseHangang,
        name: "한강대교 코스",
        level: "상급자",
        distance: "8.4km",
        duration: "약 50분",
        rating: "4.7",
        nearby: "내 위치에서 6.2km",
      },
      {
        image: courseThumbNamsan,
        name: "청담대교 코스",
        level: "상급자",
        distance: "7.1km",
        duration: "약 42분",
        rating: "4.6",
        nearby: "내 위치에서 5.0km",
      },
      {
        image: challengeCourseYeontral,
        name: "성수대교 코스",
        level: "상급자",
        distance: "9.0km",
        duration: "약 55분",
        rating: "4.8",
        nearby: "내 위치에서 6.9km",
      },
    ],
  },
  challenge: {
    sectionTitle: "도전 코스",
    filters: ["전체", "가본 곳", "안 가본 곳"],
    hero: {
      image: challengeCourseMain,
      title: "광화문 댕댕런",
      distance: "7.6km",
      level: "가본 곳",
      meta: "평지 코스 · 내 위치에서 3.4km",
      imageBox: { width: "100%", height: "126.11%", left: "-0.03%", top: "-26.03%" },
      detail: "gwanghwamun",
    },
    courses: [
      {
        image: challengeCourseGwanghwamun,
        name: "광화문 댕댕런",
        level: "가본 곳",
        distance: "7.6km",
        duration: "약 45분",
        rating: "5.0",
        nearby: "내 위치에서 2.1km",
        detail: "gwanghwamun",
      },
      {
        image: course1,
        name: "익선동 골목런 코스",
        level: "가본 곳",
        distance: "3.2km",
        duration: "약 20분",
        rating: "4.7",
        nearby: "내 위치에서 1.5km",
      },
      {
        image: courseThumbNamsan,
        name: "남산 야경런 코스",
        level: "가본 곳",
        distance: "5.4km",
        duration: "약 35분",
        rating: "4.9",
        nearby: "내 위치에서 4.2km",
      },
      {
        image: challengeCourseYeontral,
        name: "연트럴파크 폭포 코스",
        level: "안 가본 곳",
        distance: "4.0km",
        duration: "약 24분",
        rating: "4.8",
        nearby: "내 위치에서 4.8km",
      },
      {
        image: challengeCourseGyeongbok,
        name: "경복궁 돌담길코스",
        level: "안 가본 곳",
        distance: "2.5km",
        duration: "약 15분",
        rating: "4.7",
        nearby: "내 위치에서 6.2km",
      },
      {
        image: popularCourseHangang,
        name: "성수동 골목런 코스",
        level: "안 가본 곳",
        distance: "3.6km",
        duration: "약 22분",
        rating: "4.6",
        nearby: "내 위치에서 3.3km",
      },
    ],
  },
};

export const courseDetailPages: Record<CourseDetailKind, CourseDetailData> = {
  yeouido: {
    image: courseDetailMap,
    title: "여의도 한 바퀴",
    level: "초급자",
    rating: "5.0",
    location: "영등포구 여의도동 · 여의나루역 출발",
    stats: [
      { label: "거리", value: "4.6km" },
      { label: "예상 시간", value: "30-40분" },
      { label: "고도", value: "±12m" },
      { label: "노면", value: "공원길" },
    ],
    variants: [
      { title: "1바퀴 4.6km", level: "초급자", active: true },
      { title: "2바퀴 9.2km", level: "중급자" },
      { title: "반포까지 12km", level: "상급자" },
    ],
    amenities: [
      { value: "2", label: "화장실" },
      { value: "5", label: "쉼터" },
      { value: "4", label: "급수대" },
      { value: "3", label: "보관함" },
      { value: "여의나루", label: "지하철" },
    ],
    social: "이번 주 328명이 뛴 여의도 한강공원 입문 코스",
    reviews: [
      '"밤 9시 이후엔 자전거 많아요"  ★ 5.0',
      '"평지라 페이스 잡기 좋아요"  ★ 4.5',
    ],
  },
  nodulseom: {
    image: popularCourseDetailMap,
    title: "노들섬 코스",
    level: "초급자",
    rating: "5.0",
    location: "용산구 양녕로 · 노들섬 출발",
    stats: [
      { label: "거리", value: "1.5km" },
      { label: "예상 시간", value: "약 30분" },
      { label: "고도", value: "±8m" },
      { label: "노면", value: "산책로" },
    ],
    variants: [
      { title: "섬 한 바퀴 1.5km", level: "초급자", active: true },
      { title: "한강대교 연결 4km", level: "중급자" },
      { title: "반포 방향 8km", level: "상급자" },
    ],
    amenities: [
      { value: "12", label: "화장실" },
      { value: "3", label: "쉼터" },
      { value: "4", label: "급수대" },
      { value: "3", label: "보관함" },
      { value: "노들", label: "지하철" },
    ],
    social: "이번 주 500명이 뛴 노들섬 산책로 코스",
    reviews: [
      '"가볍게 몸 풀고 한강 풍경 보기 좋아요."  ★ 5.0',
      '"짧은 코스라 러닝 초반 워밍업으로 좋아요."  ★ 4.5',
    ],
  },
  yeouidoGoguma: {
    image: courseDetailMap,
    title: "여의도 고구마런",
    level: "추천",
    rating: "5.0",
    location: "영등포구 여의도동 · 여의나루역 2번 출구",
    stats: [
      { label: "거리", value: "8.0km" },
      { label: "예상 시간", value: "45-55분" },
      { label: "고도", value: "±6m" },
      { label: "노면", value: "보행로" },
    ],
    variants: [
      { title: "고구마런 8km", level: "추천", active: true },
      { title: "반고구마런 6km", level: "가볍게" },
      { title: "2바퀴 16km", level: "도전" },
    ],
    amenities: [
      { value: "여의나루", label: "지하철" },
      { value: "한강공원", label: "출발" },
      { value: "서강대교", label: "경유" },
      { value: "샛강", label: "공원" },
      { value: "63빌딩", label: "전망" },
    ],
    social: "SNS 인증 3,500건 넘은 GPS 드로잉 코스",
    reviews: [
      '"길을 익히고 뛰어야 고구마 모양이 예쁘게 나와요."  ★ 5.0',
      '"평지라 부담은 적지만 보행로가 좁은 구간은 조심해야 해요."  ★ 4.5',
    ],
  },
  namsanHeart: {
    image: courseDetailMap,
    title: "남산 하트런",
    level: "쉬움",
    rating: "4.9",
    location: "서울 · 약수 인근",
    stats: [
      { label: "거리", value: "8.8km" },
      { label: "예상 시간", value: "약 53분" },
      { label: "고도", value: "34-129m" },
      { label: "노면", value: "도심로" },
    ],
    variants: [
      { title: "하트런 8.8km", level: "쉬움", active: true },
      { title: "중거리 템포런", level: "훈련" },
      { title: "페이스 조절", level: "연습" },
    ],
    amenities: [
      { value: "28", label: "화장실" },
      { value: "21", label: "쉼터" },
      { value: "11", label: "식수대" },
      { value: "2", label: "자판기" },
      { value: "약수", label: "지하철" },
    ],
    social: "남산을 하트 모양으로 달리는 8.8km GPS 코스",
    reviews: [
      '"초보자도 편하게 달릴 수 있지만 8km 후반 페이스 조절이 좋아요."  ★ 5.0',
      '"약수·동대입구·버티고개 쪽 접근성이 좋아요."  ★ 4.5',
    ],
  },
  gwanghwamun: {
    image: challengeCourseDetailMap,
    title: "광화문 댕댕런",
    level: "가본 곳",
    rating: "5.0",
    location: "종로구 세종로 · 광화문 출발",
    stats: [
      { label: "거리", value: "8.7km" },
      { label: "예상 시간", value: "60-75분" },
      { label: "고도", value: "±43m" },
      { label: "노면", value: "보도" },
    ],
    variants: [
      { title: "1바퀴 8.7km", level: "가볍게", active: true },
      { title: "2바퀴 17.4km", level: "제대로" },
    ],
    amenities: [
      { value: "36", label: "화장실" },
      { value: "3", label: "쉼터" },
      { value: "6", label: "급수대" },
      { value: "3", label: "자판기" },
      { value: "광화문역", label: "지하철" },
    ],
    social: "이번 주 275명이 뛴 코스",
    reviews: [
      '"혼자 뛰는 줄 알았는데 크루와 함께하니 훨씬 즐거웠어요."  ★ 5.0',
      '"목표 페이스를 달성했습니다! 꾸준히 연습한 보람이 있었어요."  ★ 4.5',
    ],
  },
};

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
  {
    image: race2,
    name: "여의도 나이트런 완주",
    participants: "3,120명 참여",
    crop: { width: "100%", height: "100%", left: "0", top: "0" },
  },
  {
    image: challengeCourseYeontral,
    name: "매일 아침 10분 러닝",
    participants: "9,876명 참여",
    crop: { width: "100%", height: "100%", left: "0", top: "0" },
  },
  {
    image: popularCourseHangang,
    name: "한강 노을런 챌린지",
    participants: "6,402명 참여",
    crop: { width: "100%", height: "100%", left: "0", top: "0" },
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
  {
    image: feedRunningShoes,
    title: ["여름철 러닝화", "관리 꿀팁"],
    preview: ["땀과 먼지로부터", "러닝화를 지키는 법"],
  },
  {
    image: storyGpsArtRun,
    title: ["GPS 아트런", "코스 만드는 법"],
    preview: ["지도 위에 그림을 그리는", "새로운 러닝 놀이"],
  },
  {
    image: storyDogRunning,
    title: ["반려견과", "함께 달리는 법"],
    preview: ["댕댕이와 러닝,", "안전하게 즐기는 방법"],
  },
];

// ── 마이페이지 ──────────────────────────────────────────────
export const profileData = {
  avatar: mypageAvatar,
  name: "김러너",
  level: "10K RUNNER",
  bio: "화 · 목 저녁, 한강에서 달려요",
  streakDays: 12,
};

export const profileStats = {
  records: 42,
  totalDistanceKm: 318,
  followers: 128,
  monthlyGoal: { label: "7월 목표 60km", currentKm: 42.5, percent: 71 },
};

export type Highlight = { key: string; label: string };
export const highlights: Highlight[] = [
  { key: "streak", label: "연속기록" },
  { key: "race", label: "대회기록" },
  { key: "course", label: "코스" },
  { key: "pb", label: "PB" },
];

export type MyRecord = {
  image?: string;
  gpsArt?: 1 | 2;
  distanceKm: string;
  date: string;
  caption: string;
  cheers: number;
  reposts: number;
  comments: Array<{ author: string; text: string }>;
  pb?: boolean;
};

const myRecordComments = [
  [
    { author: "안정은", text: "오늘 페이스 정말 좋았어요!" },
    { author: "러너_준", text: "다음 러닝도 응원할게요." },
  ],
  [
    { author: "김페이스", text: "코스가 너무 좋아 보여요." },
    { author: "도쿄원정대", text: "완주 수고했어요!" },
  ],
  [
    { author: "서울원정대", text: "기록이 점점 좋아지네요." },
    { author: "안정은", text: "다음에는 같이 달려요!" },
  ],
];

export const myRecords: MyRecord[] = [
  { image: record0708, distanceKm: "8.75", date: "7월 8일 · 경복궁", caption: "아침 공기 좋았던 경복궁 러닝. 오늘도 기분 좋게 완주!", cheers: 28, reposts: 4, comments: myRecordComments[0] },
  { image: record0707, distanceKm: "6.2", date: "7월 7일 · 여의도", caption: "여의도 한강을 따라 가볍게 달린 저녁 러닝.", cheers: 19, reposts: 2, comments: myRecordComments[1] },
  { gpsArt: 1, distanceKm: "5.0", date: "7월 5일 · GPS 아트", caption: "오늘의 GPS 아트 완성. 코스를 따라 달리는 재미가 쏠쏠해요.", cheers: 34, reposts: 7, comments: myRecordComments[2] },
  { image: record0630, distanceKm: "4.8", date: "6월 30일 · 석촌호수", caption: "석촌호수 한 바퀴, 가볍게 리듬 찾기.", cheers: 16, reposts: 1, comments: myRecordComments[0] },
  { image: record0628, distanceKm: "21.1", date: "6월 28일 · 하프 대회", caption: "첫 하프 마라톤에서 새로운 PB 달성!", cheers: 52, reposts: 9, comments: myRecordComments[1], pb: true },
  { image: record0627, distanceKm: "5.2", date: "6월 27일 · 한강공원", caption: "해 질 무렵 한강 러닝. 바람이 딱 좋았던 날.", cheers: 23, reposts: 3, comments: myRecordComments[2] },
  { image: record0626, distanceKm: "7.4", date: "6월 26일 · 도심", caption: "익숙한 도심 코스를 새로운 페이스로 달려봤어요.", cheers: 21, reposts: 2, comments: myRecordComments[0] },
  { gpsArt: 2, distanceKm: "10.0", date: "6월 21일 · GPS 아트", caption: "10km를 채우며 완성한 두 번째 GPS 아트.", cheers: 41, reposts: 8, comments: myRecordComments[1] },
  { image: record0615, distanceKm: "6.5", date: "6월 15일 · 야간런", caption: "조용한 밤거리에서 집중한 6.5km.", cheers: 14, reposts: 1, comments: myRecordComments[2] },
  { image: record0612, distanceKm: "10.0", date: "6월 12일 · 10K 대회", caption: "끝까지 페이스를 지키며 10K 완주!", cheers: 37, reposts: 6, comments: myRecordComments[0] },
  { image: record0611, distanceKm: "3.2", date: "6월 11일 · 리커버리", caption: "몸을 풀어주는 짧고 편안한 리커버리 런.", cheers: 12, reposts: 1, comments: myRecordComments[1] },
  { image: record0605, distanceKm: "12.6", date: "6월 5일 · 남산", caption: "오르막은 힘들었지만 정상에서 만난 풍경은 최고.", cheers: 31, reposts: 5, comments: myRecordComments[2] },
];

export type SettingsRow =
  | { kind: "nav"; label: string; value?: string }
  | { kind: "toggle"; label: string; key: string }
  | { kind: "static"; label: string; value: string };

export type SettingsGroup = { title: string; rows: SettingsRow[] };

export const settingsGroups: SettingsGroup[] = [
  {
    title: "계정",
    rows: [
      { kind: "nav", label: "프로필 편집" },
      { kind: "nav", label: "계정 정보", value: "werunni@kakao.com" },
      { kind: "nav", label: "계정 공개 범위", value: "전체 공개" },
    ],
  },
  {
    title: "러닝",
    rows: [
      { kind: "nav", label: "단위", value: "km" },
      { kind: "toggle", label: "음성 안내", key: "voiceGuide" },
      { kind: "toggle", label: "자동 일시정지", key: "autoPause" },
    ],
  },
  {
    title: "연동",
    rows: [{ kind: "nav", label: "웨어러블 및 건강 앱" }],
  },
  {
    title: "소통",
    rows: [
      { kind: "nav", label: "경로 프라이버시 존" },
      { kind: "nav", label: "댓글 허용 범위", value: "팔로워" },
      { kind: "nav", label: "크루 초대 허용", value: "전체" },
      { kind: "nav", label: "차단 관리", value: "0" },
    ],
  },
  {
    title: "알림",
    rows: [
      { kind: "toggle", label: "푸시 알림", key: "pushNotif" },
      { kind: "toggle", label: "소셜 알림", key: "socialNotif" },
      { kind: "toggle", label: "마케팅 수신 동의", key: "marketingNotif" },
    ],
  },
  {
    title: "정보",
    rows: [
      { kind: "nav", label: "공지사항" },
      { kind: "nav", label: "문의하기" },
      { kind: "nav", label: "이용약관" },
      { kind: "nav", label: "위치기반서비스 이용약관" },
      { kind: "nav", label: "개인정보 처리방침" },
      { kind: "static", label: "버전 정보", value: "v 1.0.0" },
    ],
  },
];

export const defaultSettingsToggles: Record<string, boolean> = {
  voiceGuide: true,
  autoPause: true,
  pushNotif: true,
  socialNotif: true,
  marketingNotif: false,
};

// ── Feed page (피그마 "피드 페이지/0709 수정" 프레임) ─────────────

export type FeedStory = {
  name: string;
  /** 저화질 프로필은 미사용 — image 없으면 회색 원 플레이스홀더 */
  image?: string;
  /** me = 내 스토리(+배지) · new = 새 소식(오렌지 링 = 접속 표시) · seen = 확인함 */
  state: "me" | "new" | "seen";
  storyImage?: string;
  storyText?: string;
  storyTextX?: number;
  storyTextY?: number;
  storySlides?: Array<{
    image: string;
    text?: string;
    textX?: number;
    textY?: number;
  }>;
};

export const feedStories: FeedStory[] = [
  { name: "내 스토리", image: feedStoryAvatarNoRing, state: "me" },
  { name: "안정은", image: runner1, state: "new" },
  { name: "러너_준", image: runner2, state: "new" },
  { name: "도쿄원정대", image: runner4, state: "new" },
  { name: "김페이스", image: runner3, state: "seen" },
];

export type FeedPost = {
  id: number;
  author: string;
  /** 저화질 프로필 미사용 — 없으면 회색 원 */
  avatar?: string;
  meta: string;
  /** 사용자가 편집해 올리는 게시물 이미지 (336px 영역) */
  image?: string;
  images?: string[];
  cheers: number;
  comments: number;
  reposts: number;
  likedBy: string;
  commentPreview: string;
  caption?: string;
};

export const feedPosts: FeedPost[] = [
  {
    id: 1,
    author: "안정은",
    avatar: runner1, // 스토리 레일과 동일 인물·동일 사진 (임시 — 고해상도 확보 시 교체)
    meta: "오늘 08:05 · 한강 러너스 크루 · 서울",
    image: feedAhnHangangCrew,
    images: [feedAhnHangangCrew, feedRunningSelfie, feedRunningShoes],
    cheers: 12,
    comments: 62,
    reposts: 50,
    likedBy: "JW님 외 여러 명이 좋아합니다",
    commentPreview: "메이브 · 오늘도 나오셨네요! 👏",
  },
  {
    id: 2,
    author: "도쿄원정대",
    avatar: runner4, // 스토리 레일과 동일 인물·동일 사진 (임시 — 고해상도 확보 시 교체)
    meta: "어제 · GPS 아트 · 도쿄",
    image: feedKomazawaPark,
    cheers: 12,
    comments: 62,
    reposts: 50,
    likedBy: "JW님 외 여러 명이 좋아합니다",
    commentPreview: "이하늘 · 저도 도쿄에서 달려보고 싶어요",
  },
];

export type CrewSuggestion = {
  name: string;
  meta: string;
  image?: string;
};

export const suggestedCrews: CrewSuggestion[] = [
  // 크루 이미지는 임시 (고해상도 확보 시 교체)
  { name: "성수 새벽런", meta: "응원 2.1k · 서울", image: runner5 },
  { name: "한강 브릿지런", meta: "응원 1.4k · 서울", image: runner6 },
];

// ── 챗봇 '러니' 리치 콘텐츠 목데이터 ────────────────────────────
// AI(Claude)는 텍스트만 생성하고, 카드·칩 같은 리치 블록은 앱이 이 데이터로
// 조립해 붙인다(하이브리드 설계). 실서비스에선 실제 대회/코스 API로 교체.
// 이미지는 고해상도 확보 시 채움 — 없으면 카드에서 회색 자리로 렌더.

export const runiRaceCards = [
  { badge: "D-3", title: "한강 마라톤", meta: "07-25(토) · 10km · 접수중", image: race1 },
  { badge: "D-31", title: "여의도 나이트런", meta: "08-22(토) · 10km · 접수중", image: race2 },
];

export const runiCrewCards = [
  { badge: "모집중", title: "여의도 러너스", meta: "토·일 오전 7시 · 멤버 24명", image: runner1 },
  { badge: "모집중", title: "한강 새벽런 크루", meta: "매일 5'50\" · 멤버 41명", image: runner2 },
];

export const runiCourseCard = {
  title: "경복궁 댕댕런 코스",
  meta: "4.6km · 쉬움 · 예상 32분",
  image: storyDogMap,
};
