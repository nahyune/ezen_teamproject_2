import { useState, type CSSProperties, type ReactNode } from "react";import confettiBall from "../assets/emoji/confetti-ball.svg";
import partyPopper from "../assets/emoji/party-popper.svg";
import personRunning from "../assets/emoji/person-running.svg";
import thumbsUp from "../assets/emoji/thumbs-up.svg";
import partyingFace from "../assets/emoji/partying-face.svg";
import clappingHands from "../assets/emoji/clapping-hands.svg";
import womanRunning from "../assets/emoji/woman-running.svg";
import runner1 from "../assets/img/runner1.webp";
import { BackButton } from "../components/Icons";
import runner2 from "../assets/img/runner2.webp";
import runner3 from "../assets/img/runner3.webp";
import runner4 from "../assets/img/runner4.webp";
import runner5 from "../assets/img/runner5.webp";
import runner6 from "../assets/img/runner6.webp";
import course1 from "../assets/img/course1.webp";
import race1 from "../assets/img/race1.webp";

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

const pageSectionClass = "flex flex-col";
const sectionHeadClass = "mb-[21px] flex items-center justify-between";
const sectionTitleClass = "text-[24px] font-semibold leading-none tracking-[0]";
const sectionActionClass = "text-[12px] font-normal leading-none tracking-[0] text-[var(--primary-lime)]";
const profileRowClass =
  "grid min-h-[58px] grid-cols-[58px_minmax(0,1fr)_auto_18px] items-center gap-x-[10px] max-[360px]:grid-cols-[52px_minmax(0,1fr)_auto_16px] max-[360px]:gap-x-2";
const profileAvatarClass =
  "h-[58px] w-[58px] rounded-full bg-[#222] object-cover max-[360px]:h-[52px] max-[360px]:w-[52px]";
const profileTextClass = "flex min-w-0 flex-col gap-[5px]";
const profileNameClass = "truncate text-[16px] font-medium leading-[1.05] tracking-[0] text-white";
const profileMetaClass = "truncate text-[13px] font-normal leading-[1.1] tracking-[0] text-[rgba(255,255,255,0.58)]";

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


const cheerEmojis = [
  confettiBall,
  partyPopper,
  personRunning,
  thumbsUp,
  partyingFace,
  clappingHands,
  womanRunning,
];

type CheerBurstItem = {
  id: string;
  emoji: string;
  left: number;
  delay: number;
  rotate: number;
  size: number;
};

function shuffled<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 이모지가 한꺼번에 솟지 않고 하나씩 쭈루룩 이어서 나오도록, cheerEmojis를
// 섞은 뒤 각 이모지마다 순서대로 일정 간격(step)만큼 딜레이를 늘려준다.
// 이렇게 하면 이모지 종류마다 정확히 한 번씩만 등장해 중복 없이 나오면서도,
// 등장 타이밍이 겹치지 않는다. 버튼 가운데(50%)에서 솟아오르는 느낌을 주기
// 위해 left는 중앙 근처로만 흩뿌린다.
function buildCheerBurst(): CheerBurstItem[] {
  const order = shuffled(cheerEmojis);
  const step = 0.18;
  return order.map((emoji, i) => ({
    id: `${i}`,
    emoji,
    left: 50 + (Math.random() - 0.5) * 56,
    delay: i * step,
    rotate: (Math.random() - 0.5) * 44,
    size: 20 + Math.random() * 10,
  }));
}

function CheerBurst({ items }: { items: CheerBurstItem[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-1" aria-hidden>
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute"
          style={{ left: `${item.left}%`, transform: "translateX(-50%)" }}
        >
          <img
            className="animate-cheer-rise block"
            src={item.emoji}
            alt=""
            style={{
              animationDelay: `${item.delay}s`,
              rotate: `${item.rotate}deg`,
              width: `${item.size}px`,
              height: `${item.size}px`,
            }}
          />
        </span>
      ))}
    </div>
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
    <section className={pageSectionClass}>
      <div className={sectionHeadClass}>
        <h2 className={sectionTitleClass}>{title}</h2>
        {action && (
          <button className={sectionActionClass} type="button">
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ProfileRow({
  item,
  following,
  onToggleFollow,
  onRemove,
  cheered,
  burst,
  onCheer,
}: {
  item: ProfileItem;
  following?: boolean;
  onToggleFollow?: () => void;
  onRemove?: () => void;
  cheered?: boolean;
  burst?: CheerBurstItem[];
  onCheer?: () => void;
}) {
  return (
    <li className={profileRowClass}>
      <Avatar className={profileAvatarClass} item={item} />
      <div className={profileTextClass}>
        <strong className={profileNameClass}>{item.name}</strong>
        <span className={profileMetaClass}>{item.meta}</span>
      </div>
      {item.action === "follow" && (
        <button
          className={`h-[34px] w-[69px] rounded-[10px] text-[13px] font-medium tracking-[0] max-[360px]:w-16 max-[360px]:text-[12px] ${
            following
              ? "bg-[#2a2a2e] text-[rgba(255,255,255,0.48)]"
              : "bg-[var(--primary-lime)] text-black"
          }`}
          type="button"
          aria-pressed={following}
          onClick={onToggleFollow}
        >
          {following ? "팔로잉" : "팔로우"}
        </button>
      )}
      {item.action === "cheer" && (
        <div className="relative">
          <button
            className={`h-8.25 w-23.5 rounded-full border text-[13px] font-medium leading-[1.3] tracking-normal max-[360px]:w-22 max-[360px]:text-[12px] ${
              cheered
                ? "border-[#3a3a3e] bg-[#2a2a2e] text-[rgba(255,255,255,0.48)]"
                : "border-(--primary-lime) text-(--primary-lime)"
            }`}
            type="button"
            aria-pressed={cheered}
            disabled={cheered}
            onClick={onCheer}
          >
            {cheered ? "응원완료" : "응원하기"}
          </button>
          {burst && <CheerBurst items={burst} />}
        </div>
      )}
      {item.action && (
        <button
          className="grid h-[34px] w-[18px] place-items-center text-[rgba(255,255,255,0.62)]"
          type="button"
          aria-label={`${item.name} 숨기기`}
          onClick={onRemove}
        >
          <CloseIcon />
        </button>
      )}
    </li>
  );
}

export default function RunnerExplorePage({ onBack }: Props) {
  const [runners, setRunners] = useState(popularRunners);
  const [crewList, setCrewList] = useState(crews);
  const [followingNames, setFollowingNames] = useState<Set<string>>(new Set());
  const [cheeredNames, setCheeredNames] = useState<Set<string>>(new Set());
  const [celebratingBursts, setCelebratingBursts] = useState<Record<string, CheerBurstItem[]>>({});

  const cheer = (name: string) => {
    setCheeredNames((prev) => new Set(prev).add(name));
    setCelebratingBursts((prev) => ({ ...prev, [name]: buildCheerBurst() }));
    setTimeout(() => {
      setCelebratingBursts((prev) => {
        if (!(name in prev)) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }, 2000);
  };

  const toggleFollow = (name: string) => {
    setFollowingNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="phone bg-black text-[var(--text-primary)]">
      <header className="subheader justify-center">
        <BackButton onClick={onBack} className="absolute left-[18px] top-1/2 -translate-y-1/2" />
        <h1 className="text-[25px] font-semibold leading-none tracking-[0]">인기 러너</h1>
      </header>

      <main className="flex-1 px-[var(--gutter)] pb-12 pt-[14px] [&>section+section]:mt-[45px]">
        <input
          className="block h-[47px] w-full rounded-[11px] border-0 bg-[#1d1d20] px-4 text-[15px] font-medium tracking-[0] text-white outline-0 placeholder:text-white/48"
          aria-label="러너·크루 검색"
          placeholder="러너·크루 검색"
        />

        <div className="flex gap-[27px] pb-[46px] pt-12">
          {quickLinks.map((item) => (
            <button className="flex w-[73px] flex-col items-center gap-[9px]" type="button" key={item.label}>
              <Avatar className="h-[72px] w-[72px] rounded-full object-cover" item={item} />
              <span className="whitespace-nowrap text-[14px] font-medium leading-none tracking-[0]">{item.label}</span>
            </button>
          ))}
        </div>

        <PageSection title="최근 응원한 러너" action="전체 보기">
          <div className="grid min-h-[58px] grid-cols-[58px_minmax(0,1fr)] items-center gap-x-[10px]">
            <Avatar className={profileAvatarClass} item={recentRunner} />
            <div className={profileTextClass}>
              <strong className={profileNameClass}>{recentRunner.name}</strong>
              <span className={profileMetaClass}>{recentRunner.meta}</span>
            </div>
          </div>
        </PageSection>

        <PageSection title="인기 러너" action="모두 보기">
          <ul className="flex flex-col gap-6">
            {runners.map((item) => (
              <ProfileRow
                key={item.name}
                item={item}
                following={followingNames.has(item.name)}
                onToggleFollow={() => toggleFollow(item.name)}
                onRemove={() => setRunners((prev) => prev.filter((r) => r.name !== item.name))}
              />
            ))}
          </ul>
        </PageSection>

        <PageSection title="팔로우할 만한 크루" action="모두 보기">
          <ul className="flex flex-col gap-6">
            {crewList.map((item) => (
              <ProfileRow
                key={item.name}
                item={item}
                cheered={cheeredNames.has(item.name)}
                burst={celebratingBursts[item.name]}
                onCheer={() => cheer(item.name)}
                onRemove={() => setCrewList((prev) => prev.filter((c) => c.name !== item.name))}
              />
            ))}
          </ul>
        </PageSection>
      </main>
    </div>
  );
}
