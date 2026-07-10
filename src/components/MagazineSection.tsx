import SectionHeader from "./SectionHeader";
import { articles } from "../data";
import "./MagazineSection.css";

type Props = {
  onOpenArticle?: () => void;
};

export default function MagazineSection({ onOpenArticle }: Props) {
  return (
    <section className="magazine">
      <SectionHeader title="매거진" />
      <div className="magazine__row no-scrollbar">
        {articles.map((a) => (
          <button
            key={a.title.join("")}
            type="button"
            className="article-card"
            onClick={a.title.join("") === "런린이첫 러닝화 가이드" ? onOpenArticle : undefined}
          >
            <img className="article-card__bg" src={a.image} alt="" style={a.imageBox} />
            <div className="article-card__scrim" />
            <div className="article-card__body">
              <h3 className="article-card__title">
                {a.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p className="article-card__preview">
                {a.preview.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
