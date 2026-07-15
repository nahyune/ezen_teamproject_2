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
  // 챗봇(러니)은 페이지가 아니라 "항상 뒤에 살아있는 오버레이" — 열림/닫힘만 토글.
  // 닫아도 언마운트하지 않으므로 대화 내용이 유지되고, 밑의 화면(러닝 타이머 등)도 안 끊긴다.
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Make the horizontal rows on the current screen draggable with the mouse.
  useEffect(() => initDragScroll(), [page]);

  useEffect(() => {
    // 스크롤은 이제 창(window)이 아니라 폰 프레임 안(.phone-scroll)에서 일어난다.
    // 페이지 전환 시 프레임 안쪽 스크롤을 맨 위로 리셋한다.
    document.querySelector(".phone-scroll")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  // 화면별 콘텐츠를 계산한 뒤, 마지막에 PhoneFrame 하나로 감싼다(프레임 통일).
  const rendered = (() => {
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
    // 기록하기: 하단바 없이 폰 프레임에 꽉 차는 한 화면(스크롤 잠금).
    // 지도 등 움직임은 각 화면 내부에서만 일어난다.
    // StatusBarArea 를 껍데기 최상단에 한 번만 두면 기록 관련 모든 화면
    // (기록·가이드·카운트다운·측정·완료·카드 등)에 공통 적용된다
    // — 데스크톱: 가짜 상태바 / 실기기: 노치 안전영역 확보.
    return (
      <div className="relative flex h-full w-full max-w-107.5 flex-col overflow-hidden bg-black mx-auto">
        <StatusBarArea />
        <RecordFlow
          autoStart={recordAutoStart}
          onBack={() => setPage("home")}
          onChatbot={() => setChatbotOpen(true)}
          onTabNavigate={(key) => {
            // 완주 '기록 카드' 화면의 하단바에서만 사용
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
        onChatbotClick={() => setChatbotOpen(true)}
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
  })();

  return (
    <PhoneFrame>
      {rendered}
      {/* 챗봇(러니) 오버레이 — 페이지 위로 아래에서 스르륵 올라오는 창(App.css .chatbot-overlay).
          닫아도 언마운트하지 않고 프레임 아래로 밀어두기만 해서 대화·스크롤이 유지되고,
          답변이 오는 도중 닫아도 뒤에서 계속 도착한다. 새로고침 시에만 초기화. */}
      <div
        className={`chatbot-overlay ${chatbotOpen ? "is-open" : ""}`}
        aria-hidden={!chatbotOpen || undefined}
      >
        <ChatbotPage onBack={() => setChatbotOpen(false)} />
      </div>
    </PhoneFrame>
  );
}
