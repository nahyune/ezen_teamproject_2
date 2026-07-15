import type { ReactNode } from "react";
import { StatusBar } from "./TopBars";

/**
 * 폰 목업 프레임.
 * - 데스크톱(≥768px): 가운데 정렬된 베젤 프레임 + 내부 스크롤로 "폰 안의 앱"처럼 보임.
 * - 모바일(≤767px): 베젤 없이 풀스크린.
 * 스타일은 App.css 의 .phone-frame / .phone-scroll / .frame-statusbar 참고.
 * 모든 화면(온보딩·홈·기록·챗봇 등)을 이 컴포넌트 하나로 감싸 프레임을 통일한다.
 *
 * 상태바(10:36) 목업은 여기서 "딱 한 번" 오버레이로 그린다(각 페이지는 안 그림).
 * - 자리를 차지하지 않는 absolute 오버레이라, 몰입 화면(기록·카운트다운)의
 *   배경색이 상태바 영역까지 꽉 찬다(밀림 현상 해결).
 * - mix-blend-difference 로 밝은/어두운 배경 모두에서 자동 대비.
 * - 데스크톱 프레임에서만 보임(실제 모바일엔 OS 상태바가 있으므로 숨김).
 */
export default function PhoneFrame({
  children,
  statusBar = "solid",
}: {
  children: ReactNode;
  /** solid = 불투명 배경(메인·연결 페이지, 스크롤 시 콘텐츠 가려짐)
   *  clear = 투명(기록·온보딩 몰입 화면, 배경이 상단까지 꽉 참) */
  statusBar?: "solid" | "clear";
}) {
  return (
    <div className="phone-frame">
      <div
        className={`frame-statusbar${statusBar === "solid" ? " frame-statusbar--solid" : ""}`}
        aria-hidden
      >
        <StatusBar />
      </div>
      <div className="phone-scroll">{children}</div>
    </div>
  );
}
