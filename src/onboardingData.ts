// Onboarding carousel content, one entry per Figma "온보딩" frame.
import on101 from "./assets/img/on101_img.png";
import on2 from "./assets/img/on2_img.png";
import on3 from "./assets/img/on3_img.png";

export type OnboardingSlideData = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  titleLines: string[];
  descLines: string[];
  cta?: string;
};

export const onboardingSlides: OnboardingSlideData[] = [
  {
    image: on101,
    imageAlt: "러닝 중 페이스와 거리를 기록하는 W:RUN 앱 화면",
    eyebrow: "GPS RUNNING TRACKER",
    titleLines: ["EVERY RUN", "COUNTS"],
    descLines: ["거리, 페이스, 경로까지 —", "당신의 모든 러닝을 자동으로 기록해요"],
  },
  {
    image: on2,
    imageAlt: "크루와 함께 달리는 러너들",
    eyebrow: "RUN TOGETHER",
    titleLines: ["NEVER RUN", "ALONE"],
    descLines: ["크루와 함께 달리고, 대회와 챌린지로", "러닝의 재미를 키워요"],
  },
  {
    image: on3,
    imageAlt: "야외에서 스트레칭하는 러너들",
    eyebrow: "AI RUNNING COACH",
    titleLines: ["YOUR OWN", "AI COACH"],
    descLines: ["훈련 계획부터 부상 예방까지,", "AI 코치에게 실시간으로 물어보세요"],
    cta: "위런 시작하기",
  },
];
