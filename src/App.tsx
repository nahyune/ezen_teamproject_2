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
import SettingsPage from "./pages/SettingsPage";
import BottomNav from "./components/BottomNav";
import RunnerExplorePage from "./pages/RunnerExplorePage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import ScheduleListPage from "./pages/ScheduleListPage";
import RaceDetailPage from "./pages/RaceDetailPage";
import type { CourseDetailKind, CourseExploreKind } from "./data";
import "./App.css";

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
  | "courseDetail";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [courseExploreKind, setCourseExploreKind] = useState<CourseExploreKind>("nearby");
  const [courseDetailKind, setCourseDetailKind] = useState<CourseDetailKind>("yeouido");

  // Make the horizontal rows on the current screen draggable with the mouse.
  useEffect(() => initDragScroll(), [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  if (page === "settings") {
    return (
      <div className="phone">
        <SettingsPage onBack={() => setPage("my")} />
      </div>
    );
  }

  if (page === "runners") {
    return <RunnerExplorePage onBack={() => setPage("home")} />;
  }

  if (page === "schedule") {
    return <ScheduleDetailPage onBack={() => setPage("home")} />;
  }

  if (page === "scheduleList") {
    return (
      <ScheduleListPage
        onBack={() => setPage("home")}
        onOpenSchedule={() => setPage("schedule")}
      />
    );
  }

  if (page === "race") {
    return <RaceDetailPage onBack={() => setPage("home")} />;
  }

  if (page === "courses") {
    return (
      <div className="phone">
        <CourseExplorePage
          kind={courseExploreKind}
          onBack={() => setPage("home")}
          onOpenDetail={(detail) => {
            setCourseDetailKind(detail);
            setPage("courseDetail");
          }}
        />
      </div>
    );
  }

  if (page === "courseDetail") {
    return (
      <div className="phone">
        <CourseDetailPage kind={courseDetailKind} onBack={() => setPage("courses")} />
      </div>
    );
  }

  return (
    <div className="phone">
      <AppHeader
        variant={page === "my" ? "settings" : page === "feed" ? "feed" : "default"}
        onSettingsClick={() => setPage("settings")}
      />

      {page === "my" ? (
        <MyPage />
      ) : page === "feed" ? (
        <FeedPage />
      ) : (
        <main className="home">
          <HeroSection />
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
          <ChallengeSection />
          <MagazineSection />
        </main>
      )}

      <BottomNav
        active={page === "my" || page === "feed" ? page : "home"}
        onNavigate={(key) => {
          if (key === "home" || key === "my" || key === "feed") setPage(key as Page);
          // 기록 탭은 별도 페이지(record.html)로 이동한다.
          if (key === "record") window.location.href = `${import.meta.env.BASE_URL}record.html`;
        }}
      />
    </div>
  );
}
