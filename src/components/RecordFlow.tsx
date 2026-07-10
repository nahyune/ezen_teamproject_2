import { useState } from "react";
import RecordPage from "./RecordPage";
import RunningGuidePage from "./RunningGuidePage";
import CountdownPage from "./CountdownPage";
import RunningPage from "./RunningPage";

// 기록 탭의 화면 전환 담당:
// 기록하기 ↔ 러닝 가이드, 시작 → 카운트다운(3·2·1) → 러닝 측정.
export default function RecordFlow() {
  const [screen, setScreen] = useState<"record" | "guide" | "countdown" | "running">(
    "record",
  );

  if (screen === "guide") {
    return <RunningGuidePage onBack={() => setScreen("record")} />;
  }
  if (screen === "countdown") {
    return <CountdownPage onDone={() => setScreen("running")} />;
  }
  if (screen === "running") {
    return <RunningPage />;
  }
  return (
    <RecordPage
      onGuideOpen={() => setScreen("guide")}
      onStart={() => setScreen("countdown")}
    />
  );
}
