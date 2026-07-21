import { useEffect, useState } from "react";

// ⚠️ 임시 진단용 컴포넌트 — 하단 검은 띠 원인 파악이 끝나면 이 파일과
//    App.tsx 의 <ViewportDebug /> 한 줄만 지우면 완전히 제거된다.
//    (iOS standalone 에서 실제 뷰포트 값이 얼마로 계산되는지 눈으로 확인하기 위함)

/** CSS 단위/환경변수의 실제 계산값을 px 로 재서 돌려준다 */
function measure(cssValue: string): number {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;top:0;left:0;width:0;visibility:hidden;height:${cssValue}`;
  document.body.appendChild(el);
  const px = el.getBoundingClientRect().height;
  el.remove();
  return Math.round(px);
}

export default function ViewportDebug() {
  const [info, setInfo] = useState<Record<string, number | string>>({});

  useEffect(() => {
    const read = () => {
      const frame = document.querySelector(".phone-frame");
      setInfo({
        "innerH(보이는 높이)": window.innerHeight,
        "screenH(기기 화면)": window.screen.height,
        "100dvh": measure("100dvh"),
        "100vh": measure("100vh"),
        "inset-top": measure("env(safe-area-inset-top, 0px)"),
        "inset-bottom": measure("env(safe-area-inset-bottom, 0px)"),
        "프레임 실제높이": frame ? Math.round(frame.getBoundingClientRect().height) : "없음",
        "프레임 하단y": frame ? Math.round(frame.getBoundingClientRect().bottom) : "없음",
        standalone: window.matchMedia("(display-mode: standalone)").matches ? "예" : "아니오",
        DPR: window.devicePixelRatio,
      });
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
        background: "rgba(0,0,0,0.88)",
        color: "#d4ff3f",
        font: "12px/1.6 monospace",
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #d4ff3f",
        pointerEvents: "none",
        whiteSpace: "pre",
      }}
    >
      {Object.entries(info)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}
    </div>
  );
}
