import { feedStories, feedPosts, suggestedCrews } from "../data";
import type { FeedStory, FeedPost } from "../data";
import iconHeart from "../assets/icons/icon-heart.svg";
import iconMessage from "../assets/icons/icon-message.svg";
import iconRetweet from "../assets/icons/icon-retweet.svg";

/* 아이콘은 BottomNav와 동일하게 mask 방식 — text 색으로 아이콘 색 제어 */
const maskIconClass =
  "inline-block bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]";

const avatarPlaceholderClass = "rounded-full bg-[#26262a]"; // 저화질 프로필 미사용 → 자리만

/* ── 스토리 레일 ─────────────────────────────────────────── */

function StoryCircle({ story }: { story: FeedStory }) {
  return (
    <li className="flex w-[62px] shrink-0 flex-col items-center gap-[6px]">
      <div className="relative flex h-[62px] w-[62px] items-center justify-center">
        {story.state === "new" ? (
          /* 오렌지 링 = 로그인(접속) 표시 — 악센트 컬러 고정 */
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--primary-orange)] p-[2px]">
            {story.image ? (
              <img src={story.image} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className={`h-full w-full ${avatarPlaceholderClass}`} />
            )}
          </div>
        ) : (
          <div className="h-14 w-14 overflow-hidden rounded-full">
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
      </div>
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

function StoryRail() {
  return (
    <ul className="no-scrollbar flex gap-4 overflow-x-auto px-[var(--gutter)] pb-3.5 pt-2">
      {feedStories.map((s) => (
        <StoryCircle key={s.name} story={s} />
      ))}
    </ul>
  );
}

/* ── 피드 카드 (풀블리드 — 이미지가 좌우 끝까지) ─────────── */

function FeedCard({ post }: { post: FeedPost }) {
  return (
    <article>
      {/* 작성자 헤더 */}
      <div className="flex items-center justify-between px-[var(--gutter)] pb-[10px] pt-3.5">
        <div className="flex items-center gap-2.5">
          {/* 오렌지 링 = 로그인(접속) 표시 */}
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

      {/* 게시물 미디어 (336px) — 사용자가 입맛대로 편집해서 올리는 영역.
          이미지가 없는 게시물은 자리만 비워 둠 (추후 직접 교체) */}
      {post.image ? (
        <img src={post.image} alt="" className="h-[336px] w-full object-cover" />
      ) : (
        <div className="h-[336px] w-full bg-[var(--bg-elevated)]" />
      )}

      {/* 액션 + 반응 */}
      <div className="flex flex-col gap-4 px-[var(--gutter)] py-2.5">
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

/* ── 추천 크루 ───────────────────────────────────────────── */

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
              className="btn-text mt-1 rounded-full border border-[var(--primary-lime)] px-5 py-1.5 text-[var(--primary-lime)]"
            >
              응원하기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 페이지 ──────────────────────────────────────────────── */

export default function FeedPage() {
  return (
    <main className="pb-[150px]">
      <StoryRail />
      <div className="flex flex-col gap-[var(--section-gap)]">
        <FeedCard post={feedPosts[0]} />
        <SuggestedCrews />
        <FeedCard post={feedPosts[1]} />
      </div>
    </main>
  );
}
