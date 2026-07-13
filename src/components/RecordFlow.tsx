import { useState } from "react";
import RecordPage from "./RecordPage";
import RunningGuidePage from "./RunningGuidePage";
import CountdownPage from "./CountdownPage";
import RunningPage from "./RunningPage";
import RunCompletePage from "./RunCompletePage";

type Screen = "record" | "guide" | "countdown" | "running" | "finished";

// 기록 탭의 화면 전환 담당:
// 기록하기 ↔ 러닝 가이드, 시작 → 카운트다운(3·2·1) → 러닝 측정
// → (일시정지에서 길게 눌러 종료) → 러닝 완료 → 뒤로가기 → 기록하기.
// 홈 히어로의 "오늘 기록 시작하기"로 진입하면(autoStart) 기록하기 화면을
// 건너뛰고 바로 카운트다운부터 시작한다.
// onTabNavigate: 기록하기 랜딩의 하단바(홈/피드/마이) 탭 전환을 App으로 위임한다.
export default function RecordFlow({
  autoStart = false,
  onTabNavigate,
}: {
  autoStart?: boolean;
  onTabNavigate?: (key: string) => void;
}) {
  const [screen, setScreen] = useState<Screen>(() => (autoStart ? "countdown" : "record"));

  if (screen === "guide") {
    return <RunningGuidePage onBack={() => setScreen("record")} />;
  }
  if (screen === "countdown") {
    return <CountdownPage onDone={() => setScreen("running")} />;
  }
  if (screen === "running") {
    return <RunningPage onEnd={() => setScreen("finished")} />;
  }
  if (screen === "finished") {
    return <RunCompletePage onBack={() => setScreen("record")} />;
  }
  return (
    <RecordPage
      onGuideOpen={() => setScreen("guide")}
      onStart={() => setScreen("countdown")}
      onTabNavigate={onTabNavigate}
    />
  );
}
