import SectionHeader from "./SectionHeader";
import { courses } from "../data";
import "./CourseSection.css";

type Props = {
  onOpenNearby?: () => void;
  onOpenPopular?: () => void;
  onOpenChallenge?: () => void;
};

export default function CourseSection({ onOpenNearby, onOpenPopular, onOpenChallenge }: Props) {
  return (
    <section className="courses">
      <SectionHeader title="이번주 추천코스" />
      <div className="courses__row no-scrollbar">
        {courses.map((c) => {
          const action =
            c.name === "내 근처 코스"
              ? onOpenNearby
              : c.name === "인기 코스"
                ? onOpenPopular
                : c.name === "도전 코스"
                  ? onOpenChallenge
                  : undefined;

          return (
            <button
              key={c.name}
              type="button"
              className={`course-card${action ? "" : " course-card--static"}`}
              onClick={action}
            >
              <div className="course-card__img">
                <img src={c.image} alt={c.name} />
              </div>
              <div className="course-card__body">
                <p className="course-card__title">
                  {c.name} <span className="course-card__rating">★ {c.rating}</span>
                </p>
                <p className="course-card__detail">{c.detail}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
