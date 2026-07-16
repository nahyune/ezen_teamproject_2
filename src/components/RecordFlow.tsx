import { useState } from "react";
import RecordPage from "./RecordPage";
import RunningGuidePage from "./RunningGuidePage";
import CountdownPage from "./CountdownPage";
import RunningPage, { type RunCourseMap, type RunSummary } from "./RunningPage";
import RunCompletePage from "./RunCompletePage";
import RunRecordCardPage, { type SharedRunCard } from "./RunRecordCardPage";
import MusicConnectPage from "./MusicConnectPage";

type Screen = "record" | "guide" | "countdown" | "running" | "finished" | "card" | "music";

// 기록 탭의 화면 전환 담당:
// 기록하기 ↔ 러닝 가이드, 시작 → 카운트다운(3·2·1) → 러닝 측정
// → (일시정지에서 길게 눌러 종료) → 러닝 완료 → 뒤로가기 → 기록하기.
// 홈 히어로의 "오늘 기록 시작하기"로 진입하면(autoStart) 기록하기 화면을
// 건너뛰고 바로 카운트다운부터 시작한다.
export default function RecordFlow({
  autoStart = false,
  selectedCourseLabel,
  selectedCourseMap,
  onBack,
  onChatbot,
  onNavigate,
  onShareCard,
}: {
  autoStart?: boolean;
  selectedCourseLabel?: string | null;
  selectedCourseMap?: RunCourseMap | null;
  onBack?: () => void;
  onChatbot?: () => void;
  onNavigate?: (key: string) => void;
  onShareCard?: (card: SharedRunCard) => void;
}) {
  const [screen, setScreen] = useState<Screen>(() => (autoStart ? "countdown" : "record"));
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);
  const [recordMusicConnected, setRecordMusicConnected] = useState(false);

  if (screen === "guide") {
    return <RunningGuidePage onBack={() => setScreen("record")} />;
  }
  if (screen === "music") {
    // 음악 서비스 선택 화면. 닫기/연결 후 기록 화면으로 돌아온다.
    return (
      <MusicConnectPage
        onClose={() => setScreen("record")}
        onConnect={() => {
          setRecordMusicConnected(true);
          setScreen("record");
        }}
      />
    );
  }
  if (screen === "countdown") {
    return <CountdownPage onDone={() => setScreen("running")} />;
  }
  if (screen === "running") {
    return (
      <RunningPage
        onEnd={(summary) => {
          setRunSummary(summary);
          setScreen("finished");
        }}
        onBack={onBack}
        onCancelRun={() => {
          setRunSummary(null);
          setScreen("record");
        }}
        onChatbot={onChatbot}
        selectedCourseLabel={selectedCourseLabel}
        selectedCourseMap={selectedCourseMap}
      />
    );
  }
  if (screen === "finished") {
    return (
      <RunCompletePage
        summary={runSummary}
        onCreateCard={() => setScreen("card")}
      />
    );
  }
  if (screen === "card") {
    return <RunRecordCardPage summary={runSummary} onClose={onBack} onShare={onShareCard} />;
  }
  return (
    <RecordPage
      onGuideOpen={() => setScreen("guide")}
      onStart={() => {
        setRunSummary(null);
        setScreen("countdown");
      }}
      onChatbot={onChatbot}
      onNavigate={onNavigate}
      onMusicOpen={() => setScreen("music")}
      musicConnected={recordMusicConnected}
    />
  );
}
