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
import RunningSongPage from "./pages/RunningSongPage";
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
import LocationPermissionDialog from "./components/LocationPermissionDialog";
// ⚠️ 임시 진단용 — 원인 파악 후 이 import 와 아래 <ViewportDebug /> 삭제
import ViewportDebug from "./components/ViewportDebug";
import {
  courseDetailPages,
  feedStories,
  profileData,
  type CourseDetailKind,
  type CourseExploreKind,
  type FeedPost,
  type FeedStory,
  type MyRecord,
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
  | "songEdit"
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
  // 온보딩 완료 후 main 최초 진입 시 한 번만 노출 (App은 이 시점에 처음 마운트됨)
  const [showLocationPermission, setShowLocationPermission] = useState(true);
  // "허용" 계열 클릭 시 채워짐 — 코스 미지정 자유 러닝에서만 사용(추천코스는 항상 자체 center 사용)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  // 기록하기 음악 연결 여부 — 기록 탭을 나갔다 와도 유지, 새로고침 시에만 초기화.
  const [recordMusicConnected, setRecordMusicConnected] = useState(false);
  const [feedStoryOpen, setFeedStoryOpen] = useState(false);
  const [createdFeedPosts, setCreatedFeedPosts] = useState<FeedPost[]>([]);
  const [createdMyRecords, setCreatedMyRecords] = useState<MyRecord[]>([]);
  const [createdStory, setCreatedStory] = useState<FeedStory | null>(null);
  const [sharedHeroImage, setSharedHeroImage] = useState<string>();

  useEffect(() => initDragScroll(), [page]);

  useEffect(() => {
    document.querySelector(".phone-scroll")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  // "허용" 계열 클릭 시에만 실제 브라우저 geolocation을 호출한다(허용 안 함은 API 자체를 안 부름).
  // 거부/에러/미지원 시에도 currentLocation 은 null 로 남아 자유 러닝은 기존 하드코딩 위치로 폴백된다.
  //
  // 정확도(accuracy) 필터: 데스크톱 웹은 GPS가 없어 IP 기반으로 "도시 중심점"을 반경 수 km
  // 오차로 찍어준다(예: 서울시청 ±5000m). 이 부정확한 좌표를 하드코딩 러닝 경로에 쓰면 지도가
  // 튀므로, 오차가 큰 위치는 버리고 고정 위치로 폴백한다. 모바일 GPS(수십 m)만 실제 위치로 채택.
  const LOCATION_ACCURACY_LIMIT_M = 1000;
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationPermission(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords.accuracy <= LOCATION_ACCURACY_LIMIT_M) {
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        }
        // 오차가 크면 currentLocation 을 채우지 않아 고정 위치로 폴백된다.
        setShowLocationPermission(false);
      },
      // 더 정확한 위치를 시도하고, 10초 안에 못 잡으면 폴백.
      () => setShowLocationPermission(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

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
    const createdAt = Date.now();
    const post: FeedPost = {
      id: createdAt,
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

    const myRecord: MyRecord = {
      id: createdAt,
      image: card.image,
      distanceKm: card.distance,
      date: card.subtitle,
      caption: `${card.title} · ${card.distance}km 러닝을 완료했어요.`,
      cheers: 0,
      reposts: 0,
      comments: [],
    };

    setCreatedFeedPosts((posts) => [post, ...posts]);
    setCreatedMyRecords((records) => [myRecord, ...records]);
    setSharedHeroImage(card.image);
    setPage("feed");
  };

  const saveRunCard = (card: SharedRunCard) => {
    setSharedHeroImage(card.image);
    setPage("home");
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
          <ProfileEditPage
            onBack={() => setPage("settings")}
            onOpenSong={() => setPage("songEdit")}
          />
        </div>
      );
    }

    if (page === "songEdit") {
      return (
        <div className="phone">
          <RunningSongPage onBack={() => setPage("profileEdit")} />
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
    if (page === "challengeDetail") {
      return (
        <ChallengeDetailPage
          onBack={() => setPage("home")}
          onStartChallenge={() => {
            setSelectedRunCourseLabel(null);
            setSelectedRunCourseMap(null);
            setRecordAutoStart(true);
            setPage("record");
          }}
        />
      );
    }
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
            currentLocation={currentLocation}
            musicConnected={recordMusicConnected}
            onMusicConnected={() => setRecordMusicConnected(true)}
            onBack={() => setPage("home")}
            onChatbot={() => setChatbotOpen(true)}
            onNavigate={navigateMain}
            onShareCard={shareRunCard}
            onSaveCard={saveRunCard}
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
          <MyPage createdRecords={createdMyRecords} />
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
    <PhoneFrame
      statusBar={!chatbotOpen && clearStatusBar ? "clear" : "solid"}
      className={chatbotOpen ? "chatbot-is-open" : ""}
    >
      {rendered}
      <div
        className={`chatbot-overlay ${chatbotOpen ? "is-open" : ""}`}
        aria-hidden={!chatbotOpen || undefined}
      >
        <ChatbotPage onBack={() => setChatbotOpen(false)} />
      </div>
      {showLocationPermission && (
        <LocationPermissionDialog
          onAllow={requestCurrentLocation}
          onDeny={() => setShowLocationPermission(false)}
        />
      )}
      {/* ⚠️ 임시 진단용 — 하단 검은 띠 원인 파악 후 이 줄과 import, ViewportDebug.tsx 삭제 */}
      <ViewportDebug />
    </PhoneFrame>
  );
}
