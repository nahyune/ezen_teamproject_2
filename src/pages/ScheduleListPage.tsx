import { StatusBarArea } from "../components/TopBars";

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

const badgeToneClass: Record<Badge["tone"], string> = {
  lime: "bg-[var(--primary-lime)] text-[#0a0a0a]",
  limeOutline: "border border-[var(--primary-lime)] text-[var(--primary-lime)]",
  orange: "bg-[var(--primary-orange)] text-white",
  gray: "bg-[#2e2e2e] text-[#9c9c9c]",
};

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
  return (
    <span
      className={`inline-flex min-h-[27px] items-center justify-center whitespace-nowrap rounded-[52px] px-[10px] py-1 text-[14px] font-medium leading-[1.3] tracking-[-0.42px] max-[360px]:px-2 max-[360px]:text-[13px] ${badgeToneClass[badge.tone]}`}
    >
      {badge.label}
    </span>
  );
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
  const Component = item.onClick ? "button" : "div";

  return (
    <Component
      className="flex w-full flex-col items-start gap-[10px] rounded-2xl bg-[#1d1d1d] p-4 text-left max-[360px]:p-[14px]"
      type={item.onClick ? "button" : undefined}
      onClick={item.onClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-[6px]">
          {item.badges.map((badge) => (
            <BadgeView badge={badge} key={`${item.title}-${badge.label}`} />
          ))}
        </div>
        {item.status && (
          <div className="flex items-start gap-[6px]">
            <BadgeView badge={item.status} />
          </div>
        )}
      </div>
      <div className="flex max-w-full flex-col gap-1">
        <h2 className="max-w-full truncate text-[20px] font-medium leading-[1.3] tracking-[-0.6px] text-white">{item.title}</h2>
        <p className="max-w-full truncate text-[14px] font-normal leading-[1.3] tracking-[-0.42px] text-[#9c9c9c]">{item.meta}</p>
      </div>
      {item.summary && (
        <p
          className={`text-[14px] font-normal leading-[1.3] tracking-[-0.42px] ${
            item.summaryTone === "orange" ? "text-[var(--primary-orange)]" : "text-[var(--primary-lime)]"
          }`}
        >
          {item.summary}
        </p>
      )}
    </Component>
  );
}

export default function ScheduleListPage({ onBack, onOpenSchedule }: Props) {
  const joined = [{ ...joinedItems[0], onClick: onOpenSchedule }, ...joinedItems.slice(1)];

  return (
    <div className="phone min-h-screen bg-[#0a0a0a] text-white [&_.statusbar]:h-[52px] [&_.statusbar]:bg-black [&_.statusbar]:px-[26px]">
      <StatusBarArea />
      <header className="subheader relative">
        <button className="grid h-[26px] w-[26px] place-items-center text-white" type="button" onClick={onBack} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] font-semibold leading-[1.3] tracking-[-0.48px]">
          내 일정
        </h1>
      </header>

      <main className="flex flex-col gap-12 px-[var(--gutter)] pb-10 pt-[6px]">
        <div className="flex items-center gap-[10px]">
          <button
            className="min-h-[34px] rounded-full bg-[var(--primary-lime)] px-[14px] py-2 text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-black"
            type="button"
          >
            예정
          </button>
          <button
            className="min-h-[34px] rounded-full border border-[#404538] bg-[#1f211f] px-[14px] py-2 text-[14px] font-medium leading-[1.3] tracking-[-0.42px] text-[#f6f6ed]"
            type="button"
          >
            종료
          </button>
        </div>

        <section className="flex flex-col gap-[14px]">
          <h2 className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px]">참여 일정</h2>
          <div className="flex flex-col gap-3">
            {joined.map((item) => (
              <ScheduleCard item={item} key={item.title} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[14px]">
          <h2 className="text-[14px] font-medium leading-[1.3] tracking-[-0.42px]">관심 대회</h2>
          <div className="flex flex-col gap-3">
            {interestedItems.map((item) => (
              <ScheduleCard item={item} key={item.title} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
