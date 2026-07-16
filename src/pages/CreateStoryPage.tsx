import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import { BackButton } from "../components/Icons";

export type CreateStoryDraft = {
  image: string;
  text: string;
  textX: number;
  textY: number;
};

type Props = {
  onBack: () => void;
  onPublish: (draft: CreateStoryDraft) => void;
};

export default function CreateStoryPage({ onBack, onPublish }: Props) {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 42 });
  const imageUrlRef = useRef("");
  const publishedRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (!publishedRef.current && imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    };
  }, []);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    const nextImage = URL.createObjectURL(file);
    imageUrlRef.current = nextImage;
    setImage(nextImage);
    event.target.value = "";
  };

  const handlePublish = () => {
    if (!image) return;
    publishedRef.current = true;
    onPublish({ image, text: text.trim(), textX: textPosition.x, textY: textPosition.y });
  };

  const handleTextPointerDown = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragOffsetRef.current = {
      x: event.clientX - (bounds.left + (bounds.width * textPosition.x) / 100),
      y: event.clientY - (bounds.top + (bounds.height * textPosition.y) / 100),
    };
  };

  const handleTextPointerMove = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    const x = ((event.clientX - dragOffsetRef.current.x - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - dragOffsetRef.current.y - bounds.top) / bounds.height) * 100;
    setTextPosition({
      x: Math.min(90, Math.max(10, x)),
      y: Math.min(88, Math.max(12, y)),
    });
  };

  const handleTextPointerUp = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="phone flex min-h-full flex-col bg-[var(--bg-app)] text-white">
      <header className="subheader">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-semibold leading-none">
          새 스토리
        </h1>
        <button
          type="button"
          className="ml-auto text-[15px] font-medium text-[var(--primary-lime)] disabled:text-white/25"
          disabled={!image}
          onClick={handlePublish}
        >
          공유
        </button>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-[var(--gutter)] pb-10 pt-2">
        {image ? (
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[8px] bg-[#1c1c1f]">
            <img src={image} alt="선택한 스토리" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-linear-to-b from-black/45 to-transparent" />
            {text && (
              <p
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none whitespace-pre-wrap text-center text-[22px] font-semibold leading-[1.3] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] active:cursor-grabbing"
                style={{ left: `${textPosition.x}%`, top: `${textPosition.y}%` }}
                onPointerDown={handleTextPointerDown}
                onPointerMove={handleTextPointerMove}
                onPointerUp={handleTextPointerUp}
                onPointerCancel={handleTextPointerUp}
              >
                {text}
              </p>
            )}
            <label className="absolute bottom-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
        ) : (
          <label className="flex aspect-[9/16] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-white/20 bg-[#151517] text-white/55">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] font-medium">스토리 사진 선택</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        )}

        <label className="flex items-center gap-3 rounded-[6px] border border-white/12 bg-[#1c1c1f] px-3.5 py-3">
          <span className="text-[18px] font-semibold text-white/70">Aa</span>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={60}
            placeholder="스토리에 표시할 문구"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-white outline-none placeholder:text-white/35"
          />
        </label>
      </main>
    </div>
  );
}
