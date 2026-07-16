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
import PhoneFrame from "./components/PhoneFrame";
import SettingsPage from "./pages/SettingsPage";
import BottomNav from "./components/BottomNav";
import RunnerExplorePage from "./pages/RunnerExplorePage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import ScheduleListPage from "./pages/ScheduleListPage";
import RaceDetailPage from "./pages/RaceDetailPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import MagazineDetailPage from "./pages/MagazineDetailPage";
import RecordFlow from "./components/RecordFlow";
import ChatbotPage from "./components/ChatbotPage";
import { courseDetailPages, type CourseDetailKind, type CourseExploreKind } from "./data";
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
  | "my"
  | "settings"
  | "runners"
  | "schedule"
  | "scheduleList"
  | "race"
  | "courses"
  | "courseDetail"
  | "challengeDetail"
  | "magazineDetail"
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
    if (key === "courseDetail:gwanghwamun" || key === "courseDetail:yeouidoGoguma" || key === "courseDetail:namsanHeart" || key === "courseDetail:yeouido" || key === "courseDetail:nodulseom") {
      const detailKind = key.replace("courseDetail:", "") as CourseDetailKind;
      setCourseDetailKind(detailKind);
      setCourseDetailBackPage("record");
      setPage("courseDetail");
    }
  };

  const rendered = (() => {
    if (page === "settings") {
      return (
        <div className="phone">
          <SettingsPage onBack={() => setPage("my")} />
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
          />
        </div>
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
          onSettingsClick={() => setPage("settings")}
          onChatbotClick={() => setChatbotOpen(true)}
        />

        {page === "my" ? (
          <MyPage />
        ) : page === "feed" ? (
          <FeedPage />
        ) : (
          <main className="home">
            <HeroSection
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
            />
            <RunnerSection onViewAll={() => setPage("runners")} />
            <ScheduleSection
              onMore={() => setPage("scheduleList")}
              onOpen={() => setPage("schedule")}
            />
            <RaceSection onOpenRace={() => setPage("race")} />
            <ChallengeSection onOpenChallenge={() => setPage("challengeDetail")} />
            <MagazineSection onOpenArticle={() => setPage("magazineDetail")} />
          </main>
        )}

        <BottomNav
          active={page === "my" || page === "feed" ? page : "home"}
          onNavigate={navigateMain}
        />
      </div>
    );
  })();

  const clearStatusBar = page === "record" || (page === "courseDetail" && Boolean(runCourseMaps[courseDetailKind]));

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
