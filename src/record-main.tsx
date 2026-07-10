// 기록하기 화면 단독 미리보기 진입점 (dev: http://localhost:5173/record.html)
// 홈(App.tsx)에 연결하기 전까지 이 파일로 화면을 확인한다.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./record.css";
import RecordFlow from "./components/RecordFlow";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 독립 실행용 폰 프레임 — App의 .phone 대응 */}
    <div className="relative flex min-h-screen w-full max-w-107.5 flex-col bg-black">
      <RecordFlow />
    </div>
  </StrictMode>,
);
