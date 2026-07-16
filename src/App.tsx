import { useEffect, useState } from "react";
import { initDragScroll } from "./dragScroll";
import { AppHeader } from "./components/TopBars";
import HeroSection from "./components/HeroSection";
import CourseSection from "./components/CourseSection";
import CourseExplorePage from "./components/CourseExplorePage";
import CourseDetailPage from "./components/CourseDetailPage";
import RunnerSection from "./components/RunnerSection";
import ScheduleSection from "./components/ScheduleSection";
import RaceSection from "./components/RaceSection";
import ChallengeSection from "./components/ChallengeSection";
import MagazineSection from "./components/MagazineSection";
import MyPage from "./pages/MyPage";
import FeedPage from "./pages/FeedPage";
import CreatePostPage, { type CreatePostDraft } from "./pages/CreatePostPage";
import CreateStoryPage, { type CreateStoryDraft } from "./pages/CreateStoryPage";
import PhoneFrame from "./components/PhoneFrame";
import SettingsPage from "./pages/SettingsPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import BottomNav from "./components/BottomNav";
import RunnerExplorePage from "./pages/RunnerExplorePage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import ScheduleListPage from "./pages/ScheduleListPage";
import RaceDetailPage from "./pages/RaceDetailPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import MagazineDetailPage from "./pages/MagazineDetailPage";
import MagazineListPage from "./pages/MagazineListPage";
import CourseRecommendListPage from "./pages/CourseRecommendListPage";
import RecordFlow from "./components/RecordFlow";
import type { SharedRunCard } from "./components/RunRecordCardPage";
import ChatbotPage from "./components/ChatbotPage";
import {
  courseDetailPages,
  feedStories,
  profileData,
  type CourseDetailKind,
  type CourseExploreKind,
  type FeedPost,
  type FeedStory,
} from "./data";
import { GWANGHWAMUN_DOG_RUN_CENTER, GWANGHWAMUN_DOG_RUN_PATH } from "./data/gwanghwamunDogRoute";
import { YEOUIDO_SWEET_POTATO_CENTER, YEOUIDO_SWEET_POTATO_PATH } from "./data/yeouidoSweetPotatoRoute";
import { NAMSAN_HEART_CENTER, NAMSAN_HEART_PATH } from "./data/namsanHeartRoute";
import { YEOUIDO_LOOP_CENTER, YEOUIDO_LOOP_PATH } from "./data/yeouidoLoopRoute";
import { NODULSEOM_CENTER, NODULSEOM_PATH } from "./data/nodulseomRoute";
import "./App.css";

type RunCourseMap = {
  center: { lat: number; lng: number };
  path: { lat: number; lng: number }[];
  level: number;
};

const runCourseMaps: Partial<Record<CourseDetailKind, RunCourseMap>> = {
  yeouido: {
    center: YEOUIDO_LOOP_CENTER,
    path: YEOUIDO_LOOP_PATH,
    level: 5,
  },
  nodulseom: {
    center: NODULSEOM_CENTER,
    path: NODULSEOM_PATH,
    level: 5,
  },
  gwanghwamun: {
    center: GWANGHWAMUN_DOG_RUN_CENTER,
    path: GWANGHWAMUN_DOG_RUN_PATH,
    level: 6,
  },
  yeouidoGoguma: {
    center: YEOUIDO_SWEET_POTATO_CENTER,
    path: YEOUIDO_SWEET_POTATO_PATH,
    level: 6,
  },
  namsanHeart: {
    center: NAMSAN_HEART_CENTER,
    path: NAMSAN_HEART_PATH,
    level: 6,
  },
};

type Page =
  | "home"
  | "feed"
  | "createPost"
  | "createStory"
  | "my"
  | "settings"
  | "profileEdit"
  | "runners"
  | "schedule"
  | "scheduleList"
  | "race"
  | "courses"
  | "courseDetail"
  | "challengeDetail"
  | "magazineDetail"
  | "magazineList"
  | "courseRecommendList"
  | "record";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [courseExploreKind, setCourseExploreKind] = useState<CourseExploreKind>("nearby");
  const [courseDetailKind, setCourseDetailKind] = useState<CourseDetailKind>("yeouido");
  const [courseDetailBackPage, setCourseDetailBackPage] = useState<Page>("courses");
  const [recordAutoStart, setRecordAutoStart] = useState(false);
  const [selectedRunCourseLabel, setSelectedRunCourseLabel] = useState<string | null>(null);
  const [selectedRunCourseMap, setSelectedRunCourseMap] = useState<RunCourseMap | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [feedStoryOpen, setFeedStoryOpen] = useState(false);
  const [createdFeedPosts, setCreatedFeedPosts] = useState<FeedPost[]>([]);
  const [createdStory, setCreatedStory] = useState<FeedStory | null>(null);
  const [sharedHeroImage, setSharedHeroImage] = useState<string>();

  useEffect(() => initDragScroll(), [page]);

  useEffect(() => {
    document.querySelector(".phone-scroll")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  const getRunCourseLabel = (kind: CourseDetailKind) => {
    const detail = courseDetailPages[kind];
    const distance = detail.stats.find((stat) => stat.label === "거리")?.value.replace(/\.0(?=km)/, "") ?? "";
    return distance ? `${detail.title} (${distance})` : detail.title;
  };

  const navigateMain = (key: string) => {
    if (key === "home" || key === "my" || key === "feed") setPage(key as Page);
    if (key === "record") {
      setRecordAutoStart(false);
      setSelectedRunCourseLabel(null);
      setSelectedRunCourseMap(null);
      setPage("record");
    }
    if (key.startsWith("courseDetail:")) {
      const detailKind = key.replace("courseDetail:", "") as CourseDetailKind;
      if (courseDetailPages[detailKind]) {
        setCourseDetailKind(detailKind);
        setCourseDetailBackPage("record");
        setPage("courseDetail");
      }
    }
  };

  const shareRunCard = (card: SharedRunCard) => {
    const post: FeedPost = {
      id: Date.now(),
      author: profileData.name,
      avatar: feedStories[0].image,
      meta: "방금 전 · 러닝 기록",
      image: card.image,
      images: [card.image],
      caption: `${card.title} · ${card.distance}km 러닝을 완료했어요.`,
      cheers: 0,
      comments: 0,
      reposts: 0,
      likedBy: "아직 좋아요가 없습니다",
      commentPreview: "첫 댓글을 남겨보세요",
    };

    setCreatedFeedPosts((posts) => [post, ...posts]);
    setSharedHeroImage(card.image);
    setPage("feed");
  };

  const rendered = (() => {
    if (page === "createStory") {
      const publishStory = (draft: CreateStoryDraft) => {
        setCreatedStory((current) => {
          const previousSlides = current?.storySlides ?? (current?.storyImage ? [{
            image: current.storyImage,
            text: current.storyText,
            textX: current.storyTextX,
            textY: current.storyTextY,
            textColor: current.storyTextColor,
          }] : []);
          const nextSlide = {
            image: draft.image,
            text: draft.text,
            textX: draft.textX,
            textY: draft.textY,
            textColor: draft.textColor,
          };

          return {
            name: "내 스토리",
            image: feedStories[0].image,
            state: "me",
            storyImage: current?.storyImage ?? draft.image,
            storyText: current?.storyText ?? draft.text,
            storyTextX: current?.storyTextX ?? draft.textX,
            storyTextY: current?.storyTextY ?? draft.textY,
            storyTextColor: current?.storyTextColor ?? draft.textColor,
            storySlides: [...previousSlides, nextSlide],
          };
        });
        setPage("feed");
      };

      return <CreateStoryPage onBack={() => setPage("feed")} onPublish={publishStory} />;
    }

    if (page === "createPost") {
      const publishPost = (draft: CreatePostDraft) => {
        const post: FeedPost = {
          id: Date.now(),
          author: profileData.name,
          avatar: feedStories[0].image,
          meta: draft.location ? `방금 전 · ${draft.location}` : "방금 전",
          image: draft.images[0],
          images: draft.images,
          caption: draft.caption,
          cheers: 0,
          comments: 0,
          reposts: 0,
          likedBy: "아직 좋아요가 없습니다",
          commentPreview: "첫 댓글을 남겨보세요",
        };

        setCreatedFeedPosts((posts) => [post, ...posts]);
        setPage("feed");
      };

      return <CreatePostPage onBack={() => setPage("feed")} onPublish={publishPost} />;
    }

    if (page === "settings") {
      return (
        <div className="phone">
          <SettingsPage onBack={() => setPage("my")} onOpenProfile={() => setPage("profileEdit")} />
        </div>
      );
    }

    if (page === "profileEdit") {
      return (
        <div className="phone">
          <ProfileEditPage onBack={() => setPage("settings")} />
        </div>
      );
    }

    if (page === "runners") return <RunnerExplorePage onBack={() => setPage("home")} />;
    if (page === "schedule") return <ScheduleDetailPage onBack={() => setPage("home")} />;
    if (page === "scheduleList") {
      return (
        <ScheduleListPage
          onBack={() => setPage("home")}
          onOpenSchedule={() => setPage("schedule")}
        />
      );
    }
    if (page === "race") return <RaceDetailPage onBack={() => setPage("home")} />;
    if (page === "challengeDetail") return <ChallengeDetailPage onBack={() => setPage("home")} />;
    if (page === "magazineDetail") return <MagazineDetailPage onBack={() => setPage("home")} />;
    if (page === "magazineList") {
      return (
        <MagazineListPage
          onBack={() => setPage("home")}
          onOpenArticle={() => setPage("magazineDetail")}
        />
      );
    }

    if (page === "record") {
      return (
        <div className="relative mx-auto flex h-full w-full max-w-107.5 flex-col overflow-hidden bg-black">
          <RecordFlow
            autoStart={recordAutoStart}
            selectedCourseLabel={selectedRunCourseLabel}
            selectedCourseMap={selectedRunCourseMap}
            onBack={() => setPage("home")}
            onChatbot={() => setChatbotOpen(true)}
            onNavigate={navigateMain}
            onShareCard={shareRunCard}
          />
        </div>
      );
    }

    if (page === "courseRecommendList") {
      return (
        <CourseRecommendListPage
          onBack={() => setPage("home")}
          onOpenDetail={(detail) => {
            setCourseDetailKind(detail);
            setCourseDetailBackPage("courseRecommendList");
            setPage("courseDetail");
          }}
        />
      );
    }

    if (page === "courses") {
      return (
        <div className="phone">
          <CourseExplorePage
            kind={courseExploreKind}
            onBack={() => setPage("home")}
            onOpenDetail={(detail) => {
              setCourseDetailKind(detail);
              setCourseDetailBackPage("courses");
              setPage("courseDetail");
            }}
          />
        </div>
      );
    }

    if (page === "courseDetail") {
      return (
        <div className="phone">
          <CourseDetailPage
            kind={courseDetailKind}
            onBack={() => setPage(courseDetailBackPage)}
            onStartCourse={() => {
              setSelectedRunCourseLabel(getRunCourseLabel(courseDetailKind));
              setSelectedRunCourseMap(runCourseMaps[courseDetailKind] ?? null);
              setRecordAutoStart(true);
              setPage("record");
            }}
          />
        </div>
      );
    }

    return (
      <div className="phone">
        <AppHeader
          variant={page === "my" ? "settings" : page === "feed" ? "feed" : "default"}
          onLogoClick={() => {
            if (page !== "home") {
              setPage("home");
              return;
            }
            document.querySelector(".phone-scroll")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          onSettingsClick={() => setPage("settings")}
          onChatbotClick={() => setChatbotOpen(true)}
          onCreatePostClick={() => setPage("createPost")}
          onCreateStoryClick={() => setPage("createStory")}
        />

        {page === "my" ? (
          <MyPage />
        ) : page === "feed" ? (
          <FeedPage
            onStoryOpenChange={setFeedStoryOpen}
            onCreateStory={() => setPage("createStory")}
            createdPosts={createdFeedPosts}
            createdStory={createdStory}
            onDeletePost={(postId) => {
              setCreatedFeedPosts((posts) => posts.filter((post) => post.id !== postId));
            }}
            onUpdatePost={(postId, caption) => {
              setCreatedFeedPosts((posts) =>
                posts.map((post) => (post.id === postId ? { ...post, caption } : post)),
              );
            }}
          />
        ) : (
          <main className="home">
            <HeroSection
              image={sharedHeroImage}
              onStartRecord={() => {
                setSelectedRunCourseLabel(null);
                setSelectedRunCourseMap(null);
                setRecordAutoStart(true);
                setPage("record");
              }}
            />
            <CourseSection
              onOpenNearby={() => {
                setCourseExploreKind("nearby");
                setPage("courses");
              }}
              onOpenPopular={() => {
                setCourseExploreKind("popular");
                setPage("courses");
              }}
              onOpenChallenge={() => {
                setCourseExploreKind("challenge");
                setPage("courses");
              }}
              onSeeAll={() => setPage("courseRecommendList")}
            />
            <RunnerSection
              onViewAll={() => setPage("runners")}
              onStoryOpenChange={setFeedStoryOpen}
            />
            <ScheduleSection
              onMore={() => setPage("scheduleList")}
              onOpen={() => setPage("schedule")}
            />
            <RaceSection onOpenRace={() => setPage("race")} />
            <ChallengeSection onOpenChallenge={() => setPage("challengeDetail")} />
            <MagazineSection
              onOpenArticle={() => setPage("magazineDetail")}
              onSeeAll={() => setPage("magazineList")}
            />
          </main>
        )}

        <BottomNav
          active={page === "my" || page === "feed" ? page : "home"}
          onNavigate={navigateMain}
        />
      </div>
    );
  })();

  const clearStatusBar = page === "record" || (page === "courseDetail" && Boolean(runCourseMaps[courseDetailKind])) || ((page === "feed" || page === "home") && feedStoryOpen);

  return (
    <PhoneFrame statusBar={clearStatusBar ? "clear" : "solid"}>
      {rendered}
      <div
        className={`chatbot-overlay ${chatbotOpen ? "is-open" : ""}`}
        aria-hidden={!chatbotOpen || undefined}
      >
        <ChatbotPage onBack={() => setChatbotOpen(false)} />
      </div>
    </PhoneFrame>
  );
}
