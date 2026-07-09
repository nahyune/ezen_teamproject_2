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
import "./App.css";

export default function App() {
  const [page, setPage] = useState<"home" | "my" | "settings">("home");

  // Make every horizontal carousel draggable with the mouse (finger-swipe feel).
  useEffect(() => initDragScroll(), []);

  if (page === "settings") {
    return (
      <div className="phone">
        <SettingsPage onBack={() => setPage("my")} />
      </div>
    );
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
          <RunnerSection />
          <ScheduleSection />
          <RaceSection />
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
