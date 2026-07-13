import { useEffect, useState } from "react";
import { initDragScroll } from "./dragScroll";
import { AppHeader, StatusBarArea } from "./components/TopBars";
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
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import MagazineDetailPage from "./pages/MagazineDetailPage";
import RecordFlow from "./components/RecordFlow";
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
  | "courseDetail"
  | "challengeDetail"
  | "magazineDetail"
  | "record";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [courseExploreKind, setCourseExploreKind] = useState<CourseExploreKind>("nearby");
  const [courseDetailKind, setCourseDetailKind] = useState<CourseDetailKind>("yeouido");
  // 기록 탭 진입 시 카운트다운부터 바로 시작할지 여부(홈 히어로 "오늘 기록 시작하기").
  const [recordAutoStart, setRecordAutoStart] = useState(false);

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

  if (page === "challengeDetail") {
    return <ChallengeDetailPage onBack={() => setPage("home")} />;
  }

  if (page === "magazineDetail") {
    return (
      <MagazineDetailPage onBack={() => setPage("home")} />
    );
  }

  if (page === "record") {
    // 기록하기 전용 폰 프레임(구 record-main.tsx 대응). 랜딩 화면의 하단바는
    // RecordFlow → RecordPage 내부에서 공통 BottomNav로 렌더된다.
    return (
      <div className="relative flex min-h-screen w-full max-w-107.5 flex-col bg-black mx-auto">
        <RecordFlow
          autoStart={recordAutoStart}
          onBack={() => setPage("home")}
          onTabNavigate={(key) => {
            if (key === "record") return;
            setRecordAutoStart(false);
            if (key === "home" || key === "my" || key === "feed") setPage(key as Page);
          }}
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
      <StatusBarArea />
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
          {/* 오늘 기록 시작하기 → 기록 화면으로 전환해 바로 카운트다운 시작 */}
          <HeroSection
            onStartRecord={() => {
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
        onNavigate={(key) => {
          if (key === "home" || key === "my" || key === "feed") setPage(key as Page);
          // 기록 탭도 같은 SPA 안의 화면으로 전환한다(문서 리로드 없음).
          if (key === "record") {
            setRecordAutoStart(false);
            setPage("record");
          }
        }}
      />
    </div>
  );
}
