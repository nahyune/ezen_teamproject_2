import { useEffect, useRef, useState, type FormEvent, type UIEvent } from "react";
import { feedStories, feedPosts, suggestedCrews } from "../data";
import type { FeedStory, FeedPost } from "../data";
import iconHeart from "../assets/icons/icon-heart.svg";
import iconMessage from "../assets/icons/icon-message.svg";
import iconRetweet from "../assets/icons/icon-retweet.svg";
import sweetPotatoCourseSticker from "../assets/img/feed-yeouido-sweet-potato-map.webp";
import hangangStoryImage from "../assets/img/feed-story-hangang.webp";
import recoveryFoodStoryImage from "../assets/img/feed-story-recovery-food.webp";
import ahnHangangCrewStoryImage from "../assets/img/feed-story-ahn-hangang-crew.webp";
import tokyoSushiStoryImage from "../assets/img/feed-story-tokyo-sushi.webp";
import tokyoKomazawaStoryImage from "../assets/img/feed-story-tokyo-komazawa.webp";

/* 아이콘은 BottomNav와 동일하게 mask 방식 - text 색으로 아이콘 색 제어 */
const maskIconClass =
  "inline-block bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]";

const avatarPlaceholderClass = "rounded-full bg-[#26262a]"; // 저화질 프로필 미사용 시 자리만
/* 스토리 레일 */

function StoryCircle({ story, onOpen, onCreateStory, hasUnreadStory = false }: { story: FeedStory; onOpen?: () => void; onCreateStory?: () => void; hasUnreadStory?: boolean }) {
  return (
    <li className="flex w-[76px] shrink-0 flex-col items-center gap-2">
      <div className="relative h-[78px] w-[78px]">
        <button
          type="button"
          className="flex h-[78px] w-[78px] items-center justify-center"
          onClick={onOpen}
          disabled={!onOpen}
          aria-label={`${story.name} 스토리 보기`}
        >
          {hasUnreadStory ? (
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
                <img
                  src={story.image}
                  alt=""
                  className={`h-full w-full object-cover ${story.state === "me" ? "scale-[1.08]" : ""}`}
                />
              ) : (
                <div className={`h-full w-full ${avatarPlaceholderClass}`} />
              )}
            </div>
          )}
        </button>
        {story.state === "me" && (
          <button
            type="button"
            className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-[var(--primary-orange)] text-xs font-bold leading-none text-black"
            onClick={onCreateStory}
            aria-label="스토리 올리기"
          >
            +
          </button>
        )}
      </div>
      <span
        className={`subtitle-2 whitespace-nowrap ${
          hasUnreadStory ? "text-[var(--text-strong)]" : "text-[var(--text-soft)]"
        }`}
      >
        {story.name}
      </span>
    </li>
  );
}

function StoryRail({
  stories,
  viewed,
  onOpenStory,
  onCreateStory,
}: {
  stories: FeedStory[];
  viewed: Set<string>;
  onOpenStory: (story: FeedStory) => void;
  onCreateStory?: () => void;
}) {
  return (
    <ul className="no-scrollbar mb-5 flex gap-3.5 overflow-x-auto px-[var(--gutter)] pb-3.5 pt-2">
      {stories.map((s) => {
        const hasUnreadStory = (s.state === "new" || Boolean(s.storyImage)) && !viewed.has(s.name);
        return (
          <StoryCircle
            key={s.name}
            story={s}
            hasUnreadStory={hasUnreadStory}
            onOpen={s.state === "new" || s.storyImage ? () => onOpenStory(s) : undefined}
            onCreateStory={s.state === "me" ? onCreateStory : undefined}
          />
        );
      })}
    </ul>
  );
}

/* 피드 카드 */

export function StoryViewer({ owner, onClose }: { owner: FeedStory; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const storyOwner = owner;
  const isAhnStory = storyOwner === feedStories[1];
  const isRunnerJunStory = storyOwner === feedStories[2];
  const isTokyoStory = storyOwner === feedStories[3];
  const customStories = storyOwner.storySlides ?? (storyOwner.storyImage ? [{
    image: storyOwner.storyImage,
    text: storyOwner.storyText,
    textX: storyOwner.storyTextX,
    textY: storyOwner.storyTextY,
  }] : []);
  const isCustomStory = customStories.length > 0;
  const storyCount = isCustomStory ? customStories.length : isAhnStory || isTokyoStory ? 2 : 1;
  const activeCustomStory = customStories[storyIndex];
  const secondStoryImage = isAhnStory
    ? ahnHangangCrewStoryImage
    : isTokyoStory
      ? tokyoKomazawaStoryImage
      : null;
  const storyImage = isRunnerJunStory
      ? recoveryFoodStoryImage
      : isTokyoStory
        ? tokyoSushiStoryImage
        : hangangStoryImage;

  useEffect(() => {
    setStoryIndex(0);
    const showTimer = window.setTimeout(() => setIsVisible(true), 20);

    return () => window.clearTimeout(showTimer);
  }, [owner]);

  useEffect(() => {
    if (storyIndex < storyCount - 1) {
      const nextStoryTimer = window.setTimeout(() => setStoryIndex((index) => index + 1), 5000);
      return () => window.clearTimeout(nextStoryTimer);
    }

    const fadeTimer = window.setTimeout(() => setIsVisible(false), 4700);
    const closeTimer = window.setTimeout(onClose, 5000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
  }, [onClose, storyCount, storyIndex]);

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(onClose, 300);
  };

  const handleStoryAdvance = () => {
    if (storyCount === 1) return;
    if (storyIndex < storyCount - 1) {
      setStoryIndex((index) => index + 1);
      return;
    }
    handleClose();
  };

  return (
    // fixed = 폰 프레임 기준(프레임의 transform 이 containing block) → 스크롤 위치와
    // 무관하게 프레임 맨 위부터 꽉 참. z-150: 헤더(90)·챗봇(120) 위, 상태바 오버레이(200) 아래.
    <div
      className={`fixed inset-0 z-[150] flex items-start justify-center bg-black transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="스토리 닫기"
    >
      <div
        className="relative h-full w-full max-w-[430px] overflow-hidden bg-black"
        onClick={handleStoryAdvance}
      >
        {isCustomStory ? customStories.map((story, index) => (
          <img
            key={`${story.image}-${index}`}
            src={story.image}
            alt=""
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              storyIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        )) : (
          <img
            src={storyImage}
            alt=""
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              secondStoryImage && storyIndex === 1 ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
        {!isCustomStory && secondStoryImage && (
          <img
            src={secondStoryImage}
            alt=""
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              storyIndex === 1 ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[90] h-[170px] bg-gradient-to-b from-black/70 to-transparent" />
        {/* 스토리 UI(진행바·프로필·닫기)는 상태바 높이만큼 내려서 배치 — 이미지는 맨 위까지 꽉 참 */}
        <div className="absolute left-4 right-4 top-[calc(var(--statusbar-h)+10px)] z-[100] flex gap-1">
          {Array.from({ length: storyCount }, (_, index) => (
            <span
              key={index}
              className={`h-[1.4px] flex-1 rounded-full transition-colors duration-300 ${
                index <= storyIndex ? "bg-white" : "bg-white/35"
              }`}
            />
          ))}
        </div>
        <div className="absolute left-4 right-14 top-[calc(var(--statusbar-h)+22px)] z-[100] flex items-center gap-2.5">
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
          className="absolute right-4 top-[calc(var(--statusbar-h)+22px)] z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm"
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
        {!isCustomStory && !isRunnerJunStory && !isTokyoStory && !(isAhnStory && storyIndex === 1) && (
        <p className="absolute left-6 top-[calc(var(--statusbar-h)+86px)] z-[100] rounded-full bg-black/55 px-3 py-1.5 text-[14px] font-medium leading-none tracking-[-0.42px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          오늘은 고구마런!
        </p>
        )}
        {isCustomStory && activeCustomStory?.text && (
          <p
            className="absolute z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-pre-wrap text-center text-[22px] font-semibold leading-[1.3] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]"
            style={{ left: `${activeCustomStory.textX ?? 50}%`, top: `${activeCustomStory.textY ?? 42}%` }}
          >
            {activeCustomStory.text}
          </p>
        )}
        {isAhnStory && storyIndex === 1 && (
          <p className="absolute left-1/2 top-[34%] z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[20px] font-medium leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            크루원들이랑🤍
          </p>
        )}
        {isTokyoStory && storyIndex === 0 && (
          <p className="absolute left-1/2 top-[34%] z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[20px] font-medium leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            도쿄 도착! 스시로 시작
          </p>
        )}
        {isRunnerJunStory && (
          <p className="absolute left-1/2 top-[42%] z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[22px] font-semibold leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
            오런완💪🔥
          </p>
        )}
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

function FeedCard({
  post,
  storySeen,
  onOpenStory,
  isMine = false,
  onDeletePost,
  onUpdateCaption,
}: {
  post: FeedPost;
  storySeen?: boolean;
  onOpenStory?: () => void;
  isMine?: boolean;
  onDeletePost?: () => void;
  onUpdateCaption?: (caption: string) => void;
}) {
  const mediaItems = post.images ?? (post.image ? [post.image] : []);
  const avatarImage = isMine ? feedStories[0].image : post.avatar;
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [heartBurstKey, setHeartBurstKey] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<string[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption ?? "");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportNotice, setReportNotice] = useState(false);
  const [hidden, setHidden] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreOpen) return;
    const closeMenu = (event: PointerEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) setIsMoreOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, [isMoreOpen]);

  useEffect(() => setEditCaption(post.caption ?? ""), [post.caption]);

  const handleMediaScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientWidth, scrollLeft } = event.currentTarget;
    if (clientWidth === 0) return;
    setActiveMediaIndex(Math.round(scrollLeft / clientWidth));
  };

  const handleLike = () => {
    if (!liked) setHeartBurstKey((key) => key + 1);
    setLiked((current) => !current);
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = commentText.trim();
    if (!comment) return;
    setLocalComments((comments) => [...comments, comment]);
    setCommentText("");
  };

  const handleShare = () => {
    setShared(true);
    setIsShareOpen(false);
  };

  const handleEditSave = () => {
    onUpdateCaption?.(editCaption.trim());
    setIsEditOpen(false);
  };

  const handleReport = () => {
    setIsReportOpen(false);
    setReportNotice(true);
    window.setTimeout(() => setReportNotice(false), 1800);
  };

  if (hidden) return null;

  return (
    <article>
      {/* 작성자 헤더 */}
      <div className="flex items-center justify-between px-[var(--gutter)] pb-[10px] pt-3.5">
        <div className="flex items-center gap-2.5">
          {/* 오렌지 링 = 새 소식 표시 — 스토리를 확인한 사람은 링 제거(투명 보더로 크기 유지) */}
          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 p-[2px] ${
              !onOpenStory || storySeen ? "border-transparent" : "border-[var(--primary-orange)]"
            }`}
            onClick={onOpenStory}
            disabled={!onOpenStory}
            aria-label={onOpenStory ? `${post.author} 스토리 보기` : undefined}
          >
            {/* 스토리 레일과 동일한 얇은 흰색 테두리 — 오렌지 링이 사라져도 아바타 윤곽 유지 */}
            {avatarImage ? (
              <img
                src={avatarImage}
                alt=""
                className="h-full w-full rounded-full border border-[rgba(242,242,242,0.95)] object-cover"
              />
            ) : (
              <div
                className={`h-full w-full border border-[rgba(242,242,242,0.95)] ${avatarPlaceholderClass}`}
              />
            )}
          </button>
          <div className="flex flex-col">
            <span className="subtitle-1 text-[var(--text-strong)]">{post.author}</span>
            <span className="body-2 text-[var(--text-soft)]">{post.meta}</span>
          </div>
        </div>
        <div ref={moreMenuRef} className="relative">
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
            <div className="absolute right-0 top-7 z-[70] w-[168px] overflow-hidden rounded-[8px] border border-white/10 bg-[#1c1c1f] py-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.5)]">
              {isMine ? (
                <>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3.5 text-left text-[14px] font-normal text-white hover:bg-white/7"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setIsEditOpen(true);
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3.5 text-left text-[14px] font-medium text-[var(--primary-orange)] hover:bg-white/7"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setIsDeleteOpen(true);
                    }}
                  >
                    삭제하기
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3.5 text-left text-[14px] font-normal text-white hover:bg-white/7"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setHidden(true);
                    }}
                  >
                    이 게시물 숨기기
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3.5 text-left text-[14px] font-medium text-[var(--primary-orange)] hover:bg-white/7"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setIsReportOpen(true);
                    }}
                  >
                    신고하기
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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
                <img
                  src={image}
                  alt=""
                  className={`h-full w-full ${
                    post.id === 1 && index === 0 ? "object-cover" : "object-contain"
                  }`}
                />
                {post.id === 1 && index === 1 && (
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
          <button
            type="button"
            className={`relative flex items-center gap-1.5 transition-colors ${
              liked ? "text-[var(--primary-lime)]" : "text-white"
            }`}
            onClick={handleLike}
            aria-pressed={liked}
            aria-label="응원하기"
          >
            {heartBurstKey > 0 && (
              <span key={heartBurstKey} className="pointer-events-none absolute left-0 top-0 h-5 w-5" aria-hidden>
                {[0, 1, 2, 3, 4].map((heart) => (
                  <span
                    key={heart}
                    className="feed-heart-float absolute text-[10px] leading-none text-[var(--primary-lime)]"
                    style={{ left: `${heart * 4 - 3}px`, animationDelay: `${heart * 55}ms` }}
                  >
                    ♥
                  </span>
                ))}
              </span>
            )}
            <span className={`h-5 w-5 ${maskIconClass}`} style={{ maskImage: `url("${iconHeart}")`, WebkitMaskImage: `url("${iconHeart}")` }} />
            <span className="subtitle-2">응원 {post.cheers + (liked ? 1 : 0)}</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-white"
            onClick={() => setIsCommentOpen((open) => !open)}
            aria-expanded={isCommentOpen}
            aria-label="댓글 작성"
          >
            <span className={`h-5 w-5 ${maskIconClass}`} style={{ maskImage: `url("${iconMessage}")`, WebkitMaskImage: `url("${iconMessage}")` }} />
            <span className="subtitle-2">{post.comments + localComments.length}</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-white"
            onClick={() => setIsShareOpen(true)}
            aria-label="공유"
          >
            <span className={`h-5 w-[18px] ${maskIconClass}`} style={{ maskImage: `url("${iconRetweet}")`, WebkitMaskImage: `url("${iconRetweet}")` }} />
            <span className="subtitle-2">{post.reposts + (shared ? 1 : 0)}</span>
          </button>
        </div>
        {isCommentOpen && (
          <form className="flex items-center gap-2" onSubmit={handleCommentSubmit}>
            <input
              autoFocus
              type="text"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="댓글을 입력하세요"
              className="h-9 min-w-0 flex-1 rounded-[6px] border border-white/15 bg-[#1c1c1f] px-3 text-[14px] font-normal text-white outline-none placeholder:text-white/40 focus:border-[var(--primary-lime)]"
            />
            <button
              type="submit"
              className="h-9 px-2 text-[14px] font-medium text-[var(--primary-lime)] disabled:text-white/25"
              disabled={!commentText.trim()}
            >
              등록
            </button>
          </form>
        )}
        <div className="flex flex-col gap-1">
          {post.caption && (
            <p className="body-1 text-white">
              <strong className="font-medium">{post.author}</strong> {post.caption}
            </p>
          )}
          <p className="body-1 text-white">{post.likedBy}</p>
          <p className="body-1 text-white">{post.commentPreview}</p>
          {localComments.map((comment, index) => (
            <p key={`${post.id}-comment-${index}`} className="body-1 text-white">
              나 · {comment}
            </p>
          ))}
        </div>
      </div>
      {isShareOpen && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-6 backdrop-blur-[2px]"
          onClick={() => setIsShareOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`share-title-${post.id}`}
            className="w-full max-w-[320px] rounded-[8px] border border-white/10 bg-[#1c1c1f] px-5 pb-4 pt-5 shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p id={`share-title-${post.id}`} className="text-center text-[17px] font-medium text-white">
              공유하시겠습니까?
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-10 rounded-[6px] bg-white/8 text-[14px] font-medium text-white"
                onClick={() => setIsShareOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="h-10 rounded-[6px] bg-[var(--primary-lime)] text-[14px] font-medium text-black"
                onClick={handleShare}
              >
                공유
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-6" onClick={() => setIsEditOpen(false)}>
          <div className="w-full max-w-[330px] rounded-[8px] border border-white/10 bg-[#1c1c1f] p-5" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-[17px] font-medium text-white">게시물 수정</h2>
            <textarea
              autoFocus
              value={editCaption}
              onChange={(event) => setEditCaption(event.target.value)}
              maxLength={300}
              rows={5}
              className="mt-4 w-full resize-none rounded-[6px] border border-white/15 bg-[#111113] p-3 text-[14px] font-normal leading-[1.5] text-white outline-none focus:border-[var(--primary-lime)]"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="h-10 rounded-[6px] bg-white/8 text-[14px] font-medium text-white" onClick={() => setIsEditOpen(false)}>
                취소
              </button>
              <button type="button" className="h-10 rounded-[6px] bg-[var(--primary-lime)] text-[14px] font-medium text-black" onClick={handleEditSave}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-6" onClick={() => setIsDeleteOpen(false)}>
          <div className="w-full max-w-[320px] rounded-[8px] border border-white/10 bg-[#1c1c1f] p-5" onClick={(event) => event.stopPropagation()}>
            <p className="text-center text-[17px] font-medium text-white">게시물을 삭제하시겠습니까?</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className="h-10 rounded-[6px] bg-white/8 text-[14px] font-medium text-white" onClick={() => setIsDeleteOpen(false)}>
                취소
              </button>
              <button type="button" className="h-10 rounded-[6px] bg-[var(--primary-orange)] text-[14px] font-medium text-white" onClick={onDeletePost}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      {isReportOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-6" onClick={() => setIsReportOpen(false)}>
          <div className="w-full max-w-[320px] rounded-[8px] border border-white/10 bg-[#1c1c1f] p-5" onClick={(event) => event.stopPropagation()}>
            <p className="text-center text-[17px] font-medium text-white">이 게시물을 신고하시겠습니까?</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className="h-10 rounded-[6px] bg-white/8 text-[14px] font-medium text-white" onClick={() => setIsReportOpen(false)}>
                취소
              </button>
              <button type="button" className="h-10 rounded-[6px] bg-[var(--primary-orange)] text-[14px] font-medium text-white" onClick={handleReport}>
                신고
              </button>
            </div>
          </div>
        </div>
      )}
      {reportNotice && (
        <div className="fixed bottom-[96px] left-1/2 z-[230] -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-white px-4 py-2.5 text-[13px] font-medium text-black shadow-lg">
          신고가 접수되었습니다.
        </div>
      )}
    </article>
  );
}

/* 추천 크루 */

function SuggestedCrews() {
  const [cheeredCrews, setCheeredCrews] = useState<Set<string>>(new Set());

  const handleCrewCheer = (crewName: string) => {
    setCheeredCrews((current) => {
      if (current.has(crewName)) return current;
      const next = new Set(current);
      next.add(crewName);
      return next;
    });
  };

  return (
    <section className="px-[var(--gutter)]">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="title-2 text-[var(--text-strong)]">추천 크루</h2>
        <button type="button" className="subtitle-2 text-[var(--text-soft)]">
          모두 보기
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {suggestedCrews.map((crew) => {
          const isCheered = cheeredCrews.has(crew.name);
          return (
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
              className={`relative mt-1 h-[33px] w-[94px] rounded-full border border-[var(--primary-lime)] text-[13px] font-medium leading-[1.3] tracking-[0] transition-colors duration-200 max-[360px]:w-[88px] max-[360px]:text-[12px] ${
                isCheered ? "bg-[var(--primary-lime)] text-black" : "text-[var(--primary-lime)]"
              }`}
              onClick={() => handleCrewCheer(crew.name)}
              disabled={isCheered}
              aria-pressed={isCheered}
            >
              {isCheered && (
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" aria-hidden>
                  {[0, 1, 2, 3, 4].map((heart) => (
                    <span
                      key={heart}
                      className="feed-heart-float absolute text-[10px] leading-none text-[var(--primary-lime)]"
                      style={{ left: `${heart * 4 - 8}px`, animationDelay: `${heart * 55}ms` }}
                    >
                      ♥
                    </span>
                  ))}
                </span>
              )}
              {isCheered ? "응원했어요" : "응원하기"}
            </button>
          </div>
          );
        })}
      </div>
    </section>
  );
}

/* 페이지 */

export default function FeedPage({
  onStoryOpenChange,
  onCreateStory,
  createdPosts = [],
  createdStory,
  onDeletePost,
  onUpdatePost,
}: {
  /** 스토리 열림/닫힘을 App 에 알림 — 상태바 오버레이를 투명(clear)으로 전환하는 용도 */
  onStoryOpenChange?: (open: boolean) => void;
  onCreateStory?: () => void;
  createdPosts?: FeedPost[];
  createdStory?: FeedStory | null;
  onDeletePost?: (postId: number) => void;
  onUpdatePost?: (postId: number, caption: string) => void;
}) {
  // 현재 보고 있는 스토리(null = 닫힘) + 이번 세션에서 확인한 스토리 이름들.
  // 확인 기록은 새로고침 시 초기화된다(시연용 — 오렌지 링이 매번 복귀).
  const [activeStory, setActiveStory] = useState<FeedStory | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const stories = createdStory ? [createdStory, ...feedStories.slice(1)] : feedStories;

  const openStory = (story: FeedStory) => {
    setActiveStory(story);
    setViewedStories((prev) => new Set(prev).add(story.name));
    onStoryOpenChange?.(true);
  };

  const closeStory = () => {
    setActiveStory(null);
    onStoryOpenChange?.(false);
  };

  return (
    <main className="relative pb-[150px]">
      <StoryRail stories={stories} viewed={viewedStories} onOpenStory={openStory} onCreateStory={onCreateStory} />
      <div className="flex flex-col gap-[var(--section-gap)]">
        {createdPosts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            isMine
            storySeen={!createdStory || viewedStories.has(createdStory.name)}
            onOpenStory={createdStory ? () => openStory(createdStory) : undefined}
            onDeletePost={() => onDeletePost?.(post.id)}
            onUpdateCaption={(caption) => onUpdatePost?.(post.id, caption)}
          />
        ))}
        <FeedCard
          post={feedPosts[0]}
          storySeen={viewedStories.has(feedPosts[0].author)}
          onOpenStory={() => openStory(feedStories[1])}
        />
        <SuggestedCrews />
        <FeedCard
          post={feedPosts[1]}
          storySeen={viewedStories.has(feedPosts[1].author)}
          onOpenStory={() => openStory(feedStories[3])}
        />
      </div>
      {activeStory && <StoryViewer owner={activeStory} onClose={closeStory} />}
    </main>
  );
}
