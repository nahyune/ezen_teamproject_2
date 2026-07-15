import { useState } from "react";
import RecordPage from "./RecordPage";
import RunningGuidePage from "./RunningGuidePage";
import CountdownPage from "./CountdownPage";
import RunningPage from "./RunningPage";
import RunCompletePage from "./RunCompletePage";
import RunRecordCardPage from "./RunRecordCardPage";

type Screen = "record" | "guide" | "countdown" | "running" | "finished" | "card";

// 기록 탭의 화면 전환 담당:
// 기록하기 ↔ 러닝 가이드, 시작 → 카운트다운(3·2·1) → 러닝 측정
// → (일시정지에서 길게 눌러 종료) → 러닝 완료 → 뒤로가기 → 기록하기.
// 홈 히어로의 "오늘 기록 시작하기"로 진입하면(autoStart) 기록하기 화면을
// 건너뛰고 바로 카운트다운부터 시작한다.
export default function RecordFlow({
  autoStart = false,
  onBack,
  onChatbot,
}: {
  autoStart?: boolean;
  onBack?: () => void;
  onChatbot?: () => void;
}) {
  const [screen, setScreen] = useState<Screen>(() => (autoStart ? "countdown" : "record"));

  if (screen === "guide") {
    return <RunningGuidePage onBack={() => setScreen("record")} />;
  }
  if (screen === "countdown") {
    return <CountdownPage onDone={() => setScreen("running")} onBack={onBack} />;
  }
  if (screen === "running") {
    return <RunningPage onEnd={() => setScreen("finished")} onBack={onBack} onChatbot={onChatbot} />;
  }
  if (screen === "finished") {
    return (
      <RunCompletePage
        onBack={() => setScreen("record")}
        onCreateCard={() => setScreen("card")}
      />
    );
  }
  if (screen === "card") {
    return <RunRecordCardPage onClose={onBack} />;
  }
  return (
    <RecordPage
      onGuideOpen={() => setScreen("guide")}
      onStart={() => setScreen("countdown")}
      onBack={onBack}
      onChatbot={onChatbot}
    />
  );
}
