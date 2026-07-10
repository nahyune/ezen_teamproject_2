import { challenges } from "../data";
import { ChevronDown } from "./Icons";
import "./ChallengeSection.css";

type Props = {
  onOpenChallenge?: () => void;
};

export default function ChallengeSection({ onOpenChallenge }: Props) {
  return (
    <section className="challenge">
      <h2 className="challenge__title">챌린지</h2>
      <ul className="challenge__list">
        {challenges.map((c) => (
          <li key={c.name}>
            <button
              className="challenge-item"
              type="button"
              onClick={c.name === "경복궁 댕댕런" ? onOpenChallenge : undefined}
            >
            <div className="challenge-item__img">
              <img
                src={c.image}
                alt={c.name}
                style={{
                  width: c.crop.width,
                  height: c.crop.height,
                  left: c.crop.left,
                  top: c.crop.top,
                }}
              />
            </div>
            <div className="challenge-item__info">
              <p className="challenge-item__name">{c.name}</p>
              <p className="challenge-item__meta">👥 {c.participants}</p>
            </div>
            </button>
          </li>
        ))}
      </ul>
      <button className="challenge__more" type="button">
        더보기
        <ChevronDown size={16} />
      </button>
    </section>
  );
}
