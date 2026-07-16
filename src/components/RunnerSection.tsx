import { useState } from "react";
import SectionHeader from "./SectionHeader";
import { feedStories, runners, type FeedStory } from "../data";
import { StoryViewer } from "../pages/FeedPage";
import "./RunnerSection.css";

type Props = {
  onViewAll?: () => void;
  onStoryOpenChange?: (open: boolean) => void;
};

export default function RunnerSection({ onViewAll, onStoryOpenChange }: Props) {
  const [activeStory, setActiveStory] = useState<FeedStory | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  const openStory = (story: FeedStory) => {
    setActiveStory(story);
    setViewedStories((current) => new Set(current).add(story.name));
    onStoryOpenChange?.(true);
  };

  const closeStory = () => {
    setActiveStory(null);
    onStoryOpenChange?.(false);
  };

  return (
    <section className="runners">
      <SectionHeader title="인기 러너" onAction={onViewAll} />
      <div className="runners__row no-scrollbar">
        {runners.map((r) => {
          const story = feedStories.find(
            (item) => item.image === r.image && (item.state === "new" || Boolean(item.storyImage)),
          );
          const hasUnreadStory = Boolean(story && !viewedStories.has(story.name));
          return (
          <div key={r.name} className="runner">
            <button
              type="button"
              className={`runner__ring ${hasUnreadStory ? "runner__ring--story" : ""}`}
              onClick={() => story && openStory(story)}
              aria-label={story ? `${r.name} 스토리 보기` : undefined}
            >
              <div className="runner__avatar">
                <img
                  src={r.image}
                  alt={r.name}
                  draggable={false}
                  style={{
                    width: r.crop.width,
                    height: r.crop.height,
                    left: r.crop.left,
                    top: r.crop.top,
                  }}
                />
              </div>
            </button>
            <span className="runner__name">{r.name}</span>
          </div>
          );
        })}
      </div>
      {activeStory && <StoryViewer owner={activeStory} onClose={closeStory} />}
    </section>
  );
}
