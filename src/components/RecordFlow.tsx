import { useState } from "react";
import RecordPage from "./RecordPage";
import RunningGuidePage from "./RunningGuidePage";

// 기록 탭의 화면 전환 담당: 기록하기 ↔ 러닝 가이드.
// 나중에 앱(App/라우터)에 연결할 때는 이 컴포넌트를 마운트하면 된다.
export default function RecordFlow() {
  const [screen, setScreen] = useState<"record" | "guide">("record");

  return screen === "guide" ? (
    <RunningGuidePage onBack={() => setScreen("record")} />
  ) : (
    <RecordPage onGuideOpen={() => setScreen("guide")} />
  );
}
