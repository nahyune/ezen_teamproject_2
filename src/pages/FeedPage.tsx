import { useEffect, useState, type UIEvent } from "react";
import { feedStories, feedPosts, suggestedCrews } from "../data";
import type { FeedStory, FeedPost } from "../data";
import iconHeart from "../assets/icons/icon-heart.svg";
import iconMessage from "../assets/icons/icon-message.svg";
import iconRetweet from "../assets/icons/icon-retweet.svg";
import sweetPotatoCourseSticker from "../assets/img/feed-yeouido-sweet-potato-map.png";
import hangangStoryImage from "../assets/img/feed-story-hangang.webp";

/* 아이콘은 BottomNav와 동일하게 mask 방식 - text 색으로 아이콘 색 제어 */
const maskIconClass =
  "inline-block bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]";

const avatarPlaceholderClass = "rounded-full bg-[#26262a]"; // 저화질 프로필 미사용 시 자리만
/* 스토리 레일 */

function StoryCircle({ story, onOpen }: { story: FeedStory; onOpen?: () => void }) {
  return (
    <li className="flex w-[76px] shrink-0 flex-col items-center gap-2">
      <button
        type="button"
        className="relative flex h-[78px] w-[78px] items-center justify-center"
        onClick={onOpen}
        aria-label={`${story.name} 스토리 보기`}
      >
        {story.state === "new" ? (
          /* 오렌지 링 = 새 스토리 표시 */
          <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-[2.5px] border-[var(--primary-orange)]">
            {story.image ? (
              <img src={story.image} alt="" className="h-[68px] w-[68px] rounded-full border border-[rgba(242,242,242,0.95)] object-cover" />
            ) : (
              <div className={`h-[68px] w-[68px] border border-[rgba(242,242,242,0.95)] ${avatarPlaceholderClass}`} />
            )}
          </div>
        ) : (
          <div className="h-[68px] w-[68px] overflow-hidden rounded-full border border-[rgba(242,242,242,0.95)]">
            {story.image ? (
              <img src={story.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className={`h-full w-full ${avatarPlaceholderClass}`} />
            )}
          </div>
        )}
        {story.state === "me" && (
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-[var(--primary-orange)] text-xs font-bold leading-none text-black">
            +
          </span>
        )}
      </button>
      <span
        className={`subtitle-2 whitespace-nowrap ${
          story.state === "new" ? "text-[var(--text-strong)]" : "text-[var(--text-soft)]"
        }`}
      >
        {story.name}
      </span>
    </li>
  );
}

function StoryRail({ onOpenStory }: { onOpenStory: () => void }) {
  return (
    <ul className="no-scrollbar mb-5 flex gap-3.5 overflow-x-auto px-[var(--gutter)] pb-3.5 pt-2">
      {feedStories.map((s) => (
        <StoryCircle key={s.name} story={s} onOpen={s.state === "new" ? onOpenStory : undefined} />
      ))}
    </ul>
  );
}

/* 피드 카드 */

function StoryViewer({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const storyOwner = feedStories[1];

  useEffect(() => {
    const showTimer = window.setTimeout(() => setIsVisible(true), 20);
    const fadeTimer = window.setTimeout(() => setIsVisible(false), 2700);
    const closeTimer = window.setTimeout(onClose, 3000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(onClose, 300);
  };

  return (
    <div
      className={`absolute left-0 right-0 top-0 z-[200] flex h-[100svh] items-start justify-center bg-black transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="스토리 닫기"
    >
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-black">
        <img
          src={hangangStoryImage}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[90] h-[170px] bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute left-4 right-4 top-4 z-[100] flex gap-1">
          <span className="h-0.5 flex-1 rounded-full bg-white" />
        </div>
        <div className="absolute left-4 right-14 top-7 z-[100] flex items-center gap-2.5">
          {storyOwner.image ? (
            <img
              src={storyOwner.image}
              alt=""
              className="h-8 w-8 rounded-full border border-white/70 object-cover"
            />
          ) : (
            <div className={`h-8 w-8 ${avatarPlaceholderClass}`} />
          )}
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[14px] font-semibold leading-none tracking-[-0.42px] text-white">
              {storyOwner.name}
            </span>
            <span className="text-[12px] font-normal leading-none tracking-[-0.36px] text-white/70">
              5분 전
            </span>
          </div>
        </div>
        <button
          type="button"
          className="absolute right-4 top-7 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          onClick={(event) => {
            event.stopPropagation();
            handleClose();
          }}
          aria-label="스토리 닫기"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.35"
            />
          </svg>
        </button>
        <p className="absolute left-6 top-[92px] z-[100] rounded-full bg-black/55 px-3 py-1.5 text-[14px] font-medium leading-none tracking-[-0.42px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          오늘은 고구마런!
        </p>
      </div>
    </div>
  );
}

function SweetPotatoCourseSticker() {
  return (
    <img
      className="pointer-events-none absolute right-4 top-[8%] h-[118px] w-[118px] rounded-[16px] object-cover drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]"
      src={sweetPotatoCourseSticker}
      alt=""
    />
  );
}

function RunStatsSticker() {
  return (
    <div className="pointer-events-none absolute bottom-8 left-6 flex flex-col gap-3 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium leading-none tracking-[-0.39px]">거리</span>
        <strong className="font-display text-[28px] font-normal leading-none tracking-normal">
          8 km
        </strong>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium leading-none tracking-[-0.39px]">시간</span>
        <strong className="font-display text-[28px] font-normal leading-none tracking-normal">
          39:12
        </strong>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium leading-none tracking-[-0.39px]">평균 페이스</span>
        <strong className="font-display text-[28px] font-normal leading-none tracking-normal">
          4'54&quot;
        </strong>
      </div>
    </div>
  );
}

function FeedCard({ post }: { post: FeedPost }) {
  const mediaItems = post.images ?? (post.image ? [post.image] : []);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handleMediaScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientWidth, scrollLeft } = event.currentTarget;
    if (clientWidth === 0) return;
    setActiveMediaIndex(Math.round(scrollLeft / clientWidth));
  };

  return (
    <article>
      {/* 작성자 헤더 */}
      <div className="flex items-center justify-between px-[var(--gutter)] pb-[10px] pt-3.5">
        <div className="flex items-center gap-2.5">
          {/* 오렌지 링 = 새 소식 표시 */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--primary-orange)] p-[2px]">
            {post.avatar ? (
              <img src={post.avatar} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className={`h-full w-full ${avatarPlaceholderClass}`} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="subtitle-1 text-[var(--text-strong)]">{post.author}</span>
            <span className="body-2 text-[var(--text-soft)]">{post.meta}</span>
          </div>
        </div>
        <button type="button" aria-label="더보기" className="title-2 leading-none text-[var(--text-soft)]">
          ···
        </button>
      </div>

      {/* 게시물 미디어 */}
      {mediaItems.length > 0 ? (
        <div className="relative">
          <div
            className="no-scrollbar flex snap-x snap-proximity touch-pan-x overflow-x-auto scroll-smooth overscroll-x-contain"
            onScroll={handleMediaScroll}
          >
            {mediaItems.map((image, index) => (
              <div
                key={`${post.id}-${image}`}
                className="relative flex aspect-[3/4] w-full flex-none snap-center items-center justify-center bg-[#1c1c1f]"
              >
                <img src={image} alt="" className="h-full w-full object-contain" />
                {post.id === 1 && index === 0 && (
                  <>
                    <RunStatsSticker />
                    <SweetPotatoCourseSticker />
                  </>
                )}
                {mediaItems.length > 1 && (
                  <span className="sr-only">
                    {index + 1} / {mediaItems.length}
                  </span>
                )}
              </div>
            ))}
          </div>
          {mediaItems.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {mediaItems.map((image, index) => (
                <span
                  key={`${post.id}-dot-${image}`}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === activeMediaIndex ? "bg-white" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[3/4] w-full bg-[#1c1c1f]" />
      )}

      {/* 액션 + 반응 */}
      <div className="flex flex-col gap-4 px-[var(--gutter)] pb-2.5 pt-4">
        <div className="flex items-center gap-5">
          <button type="button" className="flex items-center gap-1.5 text-[var(--primary-lime)]">
            <span className={`h-5 w-5 ${maskIconClass}`} style={{ maskImage: `url("${iconHeart}")`, WebkitMaskImage: `url("${iconHeart}")` }} />
            <span className="subtitle-2">응원 {post.cheers}</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 text-white">
            <span className={`h-5 w-5 ${maskIconClass}`} style={{ maskImage: `url("${iconMessage}")`, WebkitMaskImage: `url("${iconMessage}")` }} />
            <span className="subtitle-2">{post.comments}</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 text-white">
            <span className={`h-5 w-[18px] ${maskIconClass}`} style={{ maskImage: `url("${iconRetweet}")`, WebkitMaskImage: `url("${iconRetweet}")` }} />
            <span className="subtitle-2">{post.reposts}</span>
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="body-1 text-white">{post.likedBy}</p>
          <p className="body-1 text-white">{post.commentPreview}</p>
        </div>
      </div>
    </article>
  );
}

/* 추천 크루 */

function SuggestedCrews() {
  return (
    <section className="px-[var(--gutter)]">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="title-2 text-[var(--text-strong)]">추천 크루</h2>
        <button type="button" className="subtitle-2 text-[var(--text-soft)]">
          모두 보기
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {suggestedCrews.map((crew) => (
          <div
            key={crew.name}
            className="flex flex-col items-center gap-2 rounded-xl bg-[var(--bg-elevated)] pb-5 pt-6"
          >
            {crew.image ? (
              <img src={crew.image} alt="" className="h-[58px] w-[58px] rounded-full object-cover" />
            ) : (
              <div className={`h-[58px] w-[58px] ${avatarPlaceholderClass}`} />
            )}
            <span className="btn-text text-[var(--text-strong)]">{crew.name}</span>
            <span className="body-2 -mt-1 text-[var(--text-soft)]">{crew.meta}</span>
            <button
              type="button"
              className="mt-1 h-[33px] w-[94px] rounded-full border border-[var(--primary-lime)] text-[13px] font-medium leading-[1.3] tracking-[0] text-[var(--primary-lime)] max-[360px]:w-[88px] max-[360px]:text-[12px]"
            >
              응원하기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 페이지 */

export default function FeedPage() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  return (
    <main className="relative pb-[150px]">
      <StoryRail onOpenStory={() => setIsStoryOpen(true)} />
      <div className="flex flex-col gap-[var(--section-gap)]">
        <FeedCard post={feedPosts[0]} />
        <SuggestedCrews />
        <FeedCard post={feedPosts[1]} />
      </div>
      {isStoryOpen && <StoryViewer onClose={() => setIsStoryOpen(false)} />}
    </main>
  );
}
