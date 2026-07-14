import type { ReactNode } from "react";

/**
 * 폰 목업 프레임.
 * - 데스크톱(≥768px): 가운데 정렬된 베젤 프레임 + 내부 스크롤로 "폰 안의 앱"처럼 보임.
 * - 모바일(≤767px): 베젤 없이 풀스크린.
 * 스타일은 App.css 의 .phone-frame / .phone-scroll 참고.
 * 모든 화면(온보딩·홈·기록·챗봇 등)을 이 컴포넌트 하나로 감싸 프레임을 통일한다.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-frame">
      <div className="phone-scroll">{children}</div>
    </div>
  );
}
