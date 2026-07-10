import { useEffect, useState } from "react";
import { initDragScroll } from "./dragScroll";
import { AppHeader } from "./components/TopBars";
import HeroSection from "./components/HeroSection";
import CourseSection from "./components/CourseSection";
import RunnerSection from "./components/RunnerSection";
import ScheduleSection from "./components/ScheduleSection";
import RaceSection from "./components/RaceSection";
import ChallengeSection from "./components/ChallengeSection";
import MagazineSection from "./components/MagazineSection";
import MyPage from "./pages/MyPage";
import SettingsPage from "./pages/SettingsPage";
import BottomNav from "./components/BottomNav";
import RunnerExplorePage from "./pages/RunnerExplorePage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import ScheduleListPage from "./pages/ScheduleListPage";
import RaceDetailPage from "./pages/RaceDetailPage";
import "./App.css";

type Page = "home" | "my" | "settings" | "runners" | "schedule" | "scheduleList" | "race";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  // Make every horizontal carousel draggable with the mouse (finger-swipe feel).
  useEffect(() => initDragScroll(), []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
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

  return (
    <div className="phone">
      <AppHeader
        variant={page === "my" ? "settings" : "default"}
        onSettingsClick={() => setPage("settings")}
      />

      {page === "my" ? (
        <MyPage />
      ) : (
        <main className="home">
          <HeroSection />
          <CourseSection />
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
        active={page === "my" ? "my" : "home"}
        onNavigate={(key) => {
          if (key === "home" || key === "my") setPage(key);
        }}
      />
    </div>
  );
}
