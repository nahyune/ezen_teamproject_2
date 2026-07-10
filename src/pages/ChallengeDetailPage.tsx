import { StatusBar } from "../components/TopBars";
import { ChevronLeft } from "../components/Icons";
import BottomNav from "../components/BottomNav";
import challengeHero from "../assets/img/challenge1.webp";

type Props = {
  onBack: () => void;
  onNavigate?: (key: string) => void;
};

const infoCards = [
  { label: "총 거리", value: "7.7km", note: "후기 기록 기준" },
  { label: "소요 시간", value: "1:10", note: "약 1시간 10분" },
  { label: "칼로리", value: "522kcal", note: "러닝앱 기록" },
];

const steps = [
  {
    title: "GPX 경로 확인",
    desc: "출발 전에 경복궁 댕댕런 GPX를 열어 전체 루트를 먼저 훑어봐요. 골목 구간이 많아서 중간중간 지도를 확인하는 게 좋아요.",
  },
  {
    title: "러닝앱으로 기록",
    desc: "나이키 러닝 앱처럼 기록용 앱을 따로 켜두면 거리, 시간, 페이스, 칼로리를 남길 수 있어요.",
  },
  {
    title: "루트 따라 완성",
    desc: "강아지 머리와 귀, 꼬리처럼 꺾이는 지점이 많으니 급하게 달리기보다 체크하며 이동해요.",
  },
];

const walkStatColumns = [
  [
    { value: "7.7km", label: "총 거리", lime: true },
    { value: "522", label: "칼로리" },
  ],
  [
    { value: "1:09:31", label: "시간" },
    { value: "54m", label: "고도 상승" },
  ],
  [
    { value: "9'01\"", label: "평균 페이스" },
    { value: "117", label: "케이던스" },
  ],
];

const tips = [
  "카카오맵 GPX 파일은 미리 내려받아 두면 좋아요. 중간에 길을 헤매지 않으려면 출발 전에 루트를 한 번 훑고, 기록은 러닝 앱으로 따로 켜두는 방식이 안정적입니다.",
  "밤 시간대에 뛰면 광화문, 경복궁, 청계천 야경까지 함께 즐길 수 있어요. 다만 약 8km 코스라 생각보다 오래 걸리니 편한 운동화와 충분한 배터리는 꼭 챙겨주세요.",
  "강아지 모양을 완벽하게 맞추려 하기보다, 지도 위에 귀여운 흔적을 남긴다는 마음으로 천천히 즐기는 게 이 챌린지의 핵심이에요.",
];

const glassCardClass =
  "relative min-h-[94px] flex-1 min-w-0 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(29,29,29,0.2)] p-[13px_16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.28)] backdrop-blur-[14px] backdrop-saturate-[145%] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_46%,rgba(255,255,255,0))] [&>*]:relative";
const sectionTitleClass = "text-[24px] font-semibold leading-[1.3] tracking-[-0.48px] text-white";
const bodyTextClass = "text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#a1a1a8]";
const cardClass = "flex flex-col rounded-xl bg-[#1c1c1f] px-5 py-[17px]";
const cardTitleClass = "mb-[7px] text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white";
const cardBodyClass = "text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#a1a1a8]";

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11L16 6M8 13L16 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export default function ChallengeDetailPage({ onBack, onNavigate }: Props) {
  return (
    <div className="phone min-h-screen bg-[#040405] text-[#f6f6ed]">
      <StatusBar />

      <header className="flex items-center justify-between px-[var(--gutter)] pt-[14px] pb-[20px]">
        <button
          className="grid h-6 w-6 shrink-0 place-items-center text-[#f6f6ed]"
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-center text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-[#f6f6ed]">
          챌린지
        </h1>
        <button className="grid h-6 w-6 shrink-0 place-items-center text-[#f6f6ed]" type="button" aria-label="공유하기">
          <ShareIcon />
        </button>
      </header>

      <main className="flex flex-col gap-12 px-[var(--gutter)] pb-[130px]">
        <section className="relative h-[420px] overflow-hidden rounded-[20px]">
          <img className="h-full w-full object-cover" src={challengeHero} alt="경복궁 댕댕런 GPS 아트런 경로 지도" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[15px] pt-[65px] pr-[40px] pb-[26px] pl-[15px] bg-[linear-gradient(to_top,rgba(0,0,0,0.62)_30%,rgba(0,0,0,0.33)_70%,rgba(0,0,0,0)_100%)]">
            <span className="inline-flex w-fit min-h-[31px] items-center justify-center whitespace-nowrap rounded-2xl bg-[var(--primary-lime)] px-[14px] py-[6px] text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-black">
              GPS 아트런
            </span>
            <div className="flex flex-col gap-[2px] text-white">
              <h2 className="max-w-[220px] text-[30px] font-semibold leading-[1.2] tracking-[-0.6px]">경복궁 댕댕런</h2>
              <p className="text-[14px] font-normal leading-[1.3] tracking-[-0.42px]">👥 5,234명 참여</p>
            </div>
          </div>
        </section>

        <section className="flex gap-[14px]">
          {infoCards.map((card) => (
            <article className={glassCardClass} key={card.label}>
              <p className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#a1a1a8]">{card.label}</p>
              <strong className="mt-[5px] block text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white">
                {card.value}
              </strong>
              <span className="mt-0.5 block text-[12px] font-light leading-[1.3] tracking-[-0.36px] text-[#a1a1a8]">
                {card.note}
              </span>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-[22px]">
          <div className="flex flex-col gap-[7px]">
            <h2 className={sectionTitleClass}>강아지 모양을 그리는 GPS 아트런</h2>
            <p className={bodyTextClass}>
              경복궁과 북촌, 안국 일대를 따라 달리며 지도 위에 강아지 모양 루트를 완성하는 챌린지예요. GPX 경로를
              켜두면 길치도 도전할 수 있고, 완벽한 선보다 &ldquo;오늘의 기록&rdquo;을 남기는 재미가 더 큰
              코스입니다.
            </p>
          </div>
          <div className={cardClass}>
            <p className={cardTitleClass}>길치도 가능할까?</p>
            <p className={cardBodyClass}>
              결론부터 말하면 가능해요. 카카오맵 GPX로 길을 확인하고 러닝앱은 기록용으로 함께 켜두면 훨씬 편하게
              완주할 수 있어요.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-[13px]">
          <h2 className={sectionTitleClass}>참여 방법</h2>
          <ol className="flex list-none flex-col gap-5">
            {steps.map((step) => (
              <li className="flex items-start gap-[10px]" key={step.title}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-lime)]" aria-hidden />
                <div className="flex flex-col gap-[5px]">
                  <p className="text-[16px] font-normal leading-[1.3] tracking-[-0.48px] text-white">{step.title}</p>
                  <p className={bodyTextClass}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-[7px]">
          <h2 className={sectionTitleClass}>댕댕런 8km 풍경 기록</h2>
          <p className={bodyTextClass}>
            광화문 광장을 시작으로 경복궁 담장을 지나고, 북촌 한옥마을과 안국의 골목길을 걷고 뛰며 지나가요. 마지막은
            청계천 쪽을 따라 내려오며 강아지 꼬리 부분을 완성하는 흐름이라 서울 도심 야경을 같이 즐길 수 있어요.
          </p>
        </section>

        <section className={cardClass}>
          <p className="mb-[15px] text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white">직접 걸어보니</p>
          <div className="flex items-center gap-5">
            {walkStatColumns.map((col, i) => (
              <div className="flex flex-1 min-w-0 flex-col gap-3" key={i}>
                {col.map((stat) => (
                  <div className="flex flex-col gap-[2px]" key={stat.label}>
                    <p
                      className={`whitespace-nowrap [font-family:var(--font-display)] text-[22px] font-normal leading-[25px] ${
                        stat.lime ? "text-[var(--primary-lime)]" : "text-white"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="whitespace-nowrap text-[12px] font-normal leading-[15px] text-[#a1a1a8]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[13px]">
          <h2 className={sectionTitleClass}>GPS 아트런 팁</h2>
          <ul className="flex flex-col gap-5">
            {tips.map((tip) => (
              <li className="flex items-start gap-[7px]" key={tip}>
                <span
                  className="w-[18px] shrink-0 text-center text-[14px] leading-[1.3] tracking-[-0.42px] text-[#a1a1a8]"
                  aria-hidden
                >
                  ✔
                </span>
                <p className={bodyTextClass}>{tip}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={cardClass}>
          <p className={cardTitleClass}>사용 앱 · GPX 파일</p>
          <p className={cardBodyClass}>
            카카오맵으로 GPX 경로를 따라가고, 러닝 기록 앱으로 거리와 시간을 측정해요. 코스가 익숙하지 않다면 지도
            화면을 자주 확인하는 편이 좋아요.
          </p>
        </section>

        <section className="mt-[22px] flex flex-col gap-[15px]">
          <p className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#a1a1a8]">
            <span aria-hidden>📍</span> 완주 후 지도에 남은 강아지 모양을 캡처해서 챌린지 인증으로 남겨보세요.
          </p>
          <button
            className="h-12 w-full rounded-full bg-[var(--primary-lime)] text-center text-[16px] font-semibold leading-[1.3] tracking-[-0.48px] text-black"
            type="button"
          >
            챌린지 참여하기
          </button>
        </section>
      </main>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
