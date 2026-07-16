import { useState } from "react";
import { challenges } from "../data";
import { ChevronDown } from "./Icons";
import "./ChallengeSection.css";

type Props = {
  onOpenChallenge?: () => void;
};

const collapsedCount = 3;

export default function ChallengeSection({ onOpenChallenge }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleChallenges = expanded ? challenges : challenges.slice(0, collapsedCount);

  return (
    <section className="challenge">
      <h2 className="challenge__title">챌린지</h2>
      <ul className="challenge__list">
        {visibleChallenges.map((c) => (
          <li key={c.name}>
            <button
              className="challenge-item"
              type="button"
              onClick={onOpenChallenge}
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
      {challenges.length > collapsedCount && (
        <button
          className="challenge__more"
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "닫기" : "더보기"}
          <ChevronDown size={16} className={expanded ? "rotate-180" : undefined} />
        </button>
      )}
    </section>
  );
}
