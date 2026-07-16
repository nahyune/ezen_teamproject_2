import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { BackButton } from "../components/Icons";
import LocationPickerPage from "./LocationPickerPage";

export type CreatePostDraft = {
  images: string[];
  caption: string;
  location: string;
};

type Props = {
  onBack: () => void;
  onPublish: (draft: CreatePostDraft) => void;
};

export default function CreatePostPage({ onBack, onPublish }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isChoosingLocation, setIsChoosingLocation] = useState(false);
  const imageUrlsRef = useRef<string[]>([]);
  const publishedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!publishedRef.current) imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 5 - images.length);
    if (files.length === 0) return;

    const nextImages = files.map((file) => URL.createObjectURL(file));
    imageUrlsRef.current = [...imageUrlsRef.current, ...nextImages];
    setImages((current) => [...current, ...nextImages]);
    event.target.value = "";
  };

  const removeActiveImage = () => {
    const target = images[activeImage];
    if (!target) return;
    URL.revokeObjectURL(target);
    imageUrlsRef.current = imageUrlsRef.current.filter((url) => url !== target);
    const nextImages = images.filter((_, index) => index !== activeImage);
    setImages(nextImages);
    setActiveImage((index) => Math.max(0, Math.min(index, nextImages.length - 1)));
  };

  const handlePublish = () => {
    if (images.length === 0) return;
    publishedRef.current = true;
    onPublish({ images, caption: caption.trim(), location: location.trim() });
  };

  if (isChoosingLocation) {
    return (
      <LocationPickerPage
        onBack={() => setIsChoosingLocation(false)}
        onSelect={(nextLocation) => {
          setLocation(nextLocation);
          setIsChoosingLocation(false);
        }}
      />
    );
  }

  return (
    <div className="phone flex min-h-full flex-col bg-[var(--bg-app)] text-white">
      <header className="subheader">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-semibold leading-none">
          새 게시물
        </h1>
        <button
          type="button"
          className="ml-auto text-[15px] font-medium text-[var(--primary-lime)] disabled:text-white/25"
          disabled={images.length === 0}
          onClick={handlePublish}
        >
          공유
        </button>
      </header>

      <main className="flex flex-1 flex-col pb-10">
        {images.length > 0 ? (
          <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-[#1c1c1f]">
            <img src={images[activeImage]} alt="선택한 게시물" className="h-full w-full object-contain" />
            <button
              type="button"
              className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"
              onClick={removeActiveImage}
              aria-label="선택한 사진 삭제"
            >
              <svg className="h-4 w-4" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M4.5 4.5 13.5 13.5M13.5 4.5 4.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            {images.length > 1 && (
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-medium text-white">
                {activeImage + 1}/{images.length}
              </span>
            )}
          </div>
        ) : (
          <label className="mx-[var(--gutter)] mt-3 flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-white/20 bg-[#151517] text-white/55">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="m6.5 16 4-4 3 3 2-2 2.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16.5" cy="8.5" r="1.4" fill="currentColor" />
            </svg>
            <span className="text-[14px] font-medium">사진 선택</span>
            <span className="text-[12px] font-normal text-white/35">최대 5장</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </label>
        )}

        {images.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-[var(--gutter)] py-3">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`h-[62px] w-[62px] flex-none overflow-hidden rounded-[4px] border-2 ${
                  index === activeImage ? "border-[var(--primary-lime)]" : "border-transparent"
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`${index + 1}번째 사진 보기`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
            {images.length < 5 && (
            <label className="flex h-[62px] w-[62px] flex-none cursor-pointer items-center justify-center rounded-[4px] border border-white/15 text-white/55">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </label>
            )}
          </div>
        )}

        <div className="flex flex-col px-[var(--gutter)]">
          <label className="border-b border-white/10 py-4">
            <span className="sr-only">게시물 내용</span>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="문구를 입력하세요"
              maxLength={300}
              rows={4}
              className="w-full resize-none bg-transparent text-[15px] font-normal leading-[1.55] text-white outline-none placeholder:text-white/35"
            />
            <span className="block text-right text-[11px] text-white/30">{caption.length}/300</span>
          </label>
          <button
            type="button"
            className="flex h-[58px] w-full items-center gap-3 border-b border-white/10 text-left"
            onClick={() => setIsChoosingLocation(true)}
          >
            <svg className="h-5 w-5 flex-none text-white/65" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className={`min-w-0 flex-1 truncate text-[14px] font-normal ${location ? "text-white" : "text-white/45"}`}>
              {location || "위치 추가"}
            </span>
            <svg className="h-4 w-4 flex-none text-white/35" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="m7 4.5 4.5 4.5L7 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
