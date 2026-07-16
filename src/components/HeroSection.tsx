import { heroData } from "../data";
import route from "../assets/icons/route.svg";
import "./HeroSection.css";

export default function HeroSection({
  onStartRecord,
  image = heroData.image,
}: {
  onStartRecord?: () => void;
  image?: string;
}) {
  return (
    <section className="hero">
      <div className="hero__card">
        <img className="hero__bg" src={image} alt="" />
        <div className="hero__tint" />
        <div className="hero__scrim" />
        <img className="hero__route" src={route} alt="" />

        <div className="hero__head">
          <h1 className="hero__title">{heroData.title}</h1>
          <p className="hero__meta">{heroData.meta}</p>
        </div>

        <ul className="hero__stats">
          {heroData.stats.map((s) => (
            <li key={s.label} className="hero__stat">
              <span className="hero__stat-label">{s.label}</span>
              <span className="hero__stat-value">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="hero__cta" type="button" onClick={onStartRecord}>
        오늘 기록 시작하기
      </button>
    </section>
  );
}
