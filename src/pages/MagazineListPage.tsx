import { BackButton } from "../components/Icons";
import { articles } from "../data";

type Props = {
  onBack: () => void;
  onOpenArticle?: () => void;
};

export default function MagazineListPage({ onBack, onOpenArticle }: Props) {
  return (
    <div className="phone bg-black text-[var(--text-primary)]">
      <header className="subheader justify-center">
        <BackButton onClick={onBack} className="absolute left-[18px] top-1/2 -translate-y-1/2" />
        <h1 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.48px]">매거진</h1>
      </header>

      <main className="flex-1 px-[var(--gutter)] pb-12 pt-[6px]">
        <div className="grid grid-cols-2 gap-3">
          {articles.map((a) => (
            <button
              key={a.title.join("")}
              type="button"
              className="relative h-[220px] overflow-hidden rounded-[20px] bg-[var(--bg-elevated)] text-left"
              onClick={onOpenArticle}
            >
              <img
                className="absolute left-0 top-0 h-full w-full max-w-none object-cover"
                src={a.image}
                alt=""
                style={a.imageBox}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(rgba(255,255,255,0) 32%, rgba(0,0,0,0.41) 51%, rgba(0,0,0,0.59) 64%, rgba(0,0,0,0.77) 100%)",
                }}
              />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-col gap-1.5 text-white">
                <h3 className="flex flex-col text-[16px] font-medium leading-[1.3] tracking-[-0.48px]">
                  {a.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className="flex flex-col text-[12px] font-normal tracking-[-0.36px] text-[#bcc3c5]">
                  {a.preview.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
