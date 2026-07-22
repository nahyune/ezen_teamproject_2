import { useEffect, useState } from "react";
import kakaoLogo from "../assets/icons/Kakao_logo 1.svg";
import instagramLogo from "../assets/icons/Instagram_icon 1.svg";

// public/ 자산이라 일반 import가 아닌 루트 절대경로로 참조(PWA 홈화면 아이콘과 동일 이미지).
const werunLogo = "/app-icon.svg";

function KakaoIcon() {
  return <img src={kakaoLogo} alt="" width={32} height={32} aria-hidden />;
}

function InstagramIcon() {
  return <img src={instagramLogo} alt="" width={32} height={32} aria-hidden />;
}

function WeRunIcon() {
  // app-icon.svg는 각진 정사각형이라, 옆 카카오톡·인스타그램 아이콘과 둥글기를 맞춘다.
  return <img src={werunLogo} alt="" width={32} height={32} className="rounded-[7px]" aria-hidden />;
}

const options = [
  {
    key: "kakao",
    label: "카카오톡",
    message: "카카오톡으로 공유했어요",
    swatch: "bg-white/10",
    icon: <KakaoIcon />,
  },
  {
    key: "instagram",
    label: "인스타그램",
    message: "인스타그램으로 공유했어요",
    swatch: "bg-white/10",
    icon: <InstagramIcon />,
  },
  {
    key: "feed",
    label: "피드 업로드",
    message: "피드에 업로드했어요",
    swatch: "bg-white/10",
    icon: <WeRunIcon />,
  },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SharePopup({ open, onClose }: Props) {
  const [sharedMessage, setSharedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setSharedMessage(null);
  }, [open]);

  const handleShare = (message: string) => {
    setSharedMessage(message);
    window.setTimeout(onClose, 700);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[210] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`fixed bottom-0 left-1/2 z-[211] w-[var(--frame-width)] max-w-full -translate-x-1/2 rounded-t-[20px] bg-[#1d1d1d] pb-8 pt-3 transition-transform duration-300 ${
          open ? "translate-y-0" : "invisible translate-y-full"
        }`}
        role="dialog"
        aria-label="공유하기"
        aria-hidden={!open || undefined}
      >
        <button type="button" onClick={onClose} aria-label="닫기" className="flex w-full justify-center pb-4">
          <span className="h-1 w-10 rounded-full bg-white/25" />
        </button>

        <h2 className="px-[var(--gutter)] pb-6 text-center text-[16px] font-medium leading-[1.3] tracking-[-0.48px] text-white">
          {sharedMessage ?? "공유하기"}
        </h2>

        <div className="flex justify-center gap-9 px-[var(--gutter)]">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              className="flex flex-col items-center gap-2"
              onClick={() => handleShare(option.message)}
            >
              <span className={`grid h-16 w-16 place-items-center rounded-full ${option.swatch}`}>{option.icon}</span>
              <span className="text-[13px] font-normal leading-[1.3] tracking-[-0.39px] text-[#c8c8c8]">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
