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
import BottomNav from "./components/BottomNav";
import type { CourseDetailKind, CourseExploreKind } from "./data";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState<"home" | "courses" | "courseDetail">("home");
  const [courseExploreKind, setCourseExploreKind] = useState<CourseExploreKind>("nearby");
  const [courseDetailKind, setCourseDetailKind] = useState<CourseDetailKind>("yeouido");

  // Make every horizontal carousel draggable with the mouse (finger-swipe feel).
  useEffect(() => initDragScroll(), []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  return (
    <div className="phone">
      {screen === "home" ? (
        <>
          <AppHeader />

          <main className="home">
            <HeroSection />
            <CourseSection
              onOpenNearby={() => {
                setCourseExploreKind("nearby");
                setScreen("courses");
              }}
              onOpenPopular={() => {
                setCourseExploreKind("popular");
                setScreen("courses");
              }}
              onOpenChallenge={() => {
                setCourseExploreKind("challenge");
                setScreen("courses");
              }}
            />
            <RunnerSection />
            <ScheduleSection />
            <RaceSection />
            <ChallengeSection />
            <MagazineSection />
          </main>

          <BottomNav />
        </>
      ) : (
        screen === "courses" ? (
          <CourseExplorePage
            kind={courseExploreKind}
            onBack={() => setScreen("home")}
            onOpenDetail={(detail) => {
              setCourseDetailKind(detail);
              setScreen("courseDetail");
            }}
          />
        ) : (
          <CourseDetailPage kind={courseDetailKind} onBack={() => setScreen("courses")} />
        )
      )}
    </div>
  );
}
