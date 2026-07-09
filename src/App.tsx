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
import BottomNav from "./components/BottomNav";
import RunnerExplorePage from "./pages/RunnerExplorePage";
import "./App.css";

export default function App() {
  const [page, setPage] = useState<"home" | "runners">("home");

  // Make every horizontal carousel draggable with the mouse (finger-swipe feel).
  useEffect(() => initDragScroll(), []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [page]);

  if (page === "runners") {
    return <RunnerExplorePage onBack={() => setPage("home")} />;
  }

  return (
    <div className="phone">
      <AppHeader />

      <main className="home">
        <HeroSection />
        <CourseSection />
        <RunnerSection onViewAll={() => setPage("runners")} />
        <ScheduleSection />
        <RaceSection />
        <ChallengeSection />
        <MagazineSection />
      </main>

      <BottomNav />
    </div>
  );
}
