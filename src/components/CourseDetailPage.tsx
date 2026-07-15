import { courseDetailPages, type CourseDetailKind } from "../data";
import { ChevronLeft } from "./Icons";
import { StatusBarArea } from "./TopBars";
import "./CourseDetailPage.css";

type Props = {
  onBack: () => void;
  kind: CourseDetailKind;
};

export default function CourseDetailPage({ onBack, kind }: Props) {
  const detail = courseDetailPages[kind];

  return (
    <section className="course-detail">
      {/* 상태바 — 지도 위에 겹치지 않고 자기 자리(검정 띠)를 차지하고,
          지도는 그 아래부터 시작. 실기기(안전영역만큼 내려옴)와 동일한 모습. */}
      <StatusBarArea />
      <div className="course-detail__hero">
        <img src={detail.image} alt="" />
      </div>

      <div className="course-detail__header-gradient" aria-hidden />
      <header className="course-detail__header">
        <button className="course-detail__back" type="button" aria-label="추천 코스로 돌아가기" onClick={onBack}>
          <ChevronLeft size={26} />
        </button>
      </header>

      <main className="course-detail__content">
        <section className="course-detail__summary">
          <div className="course-detail__title-block">
            <div className="course-detail__title-row">
              <h1 className="course-detail__title">{detail.title}</h1>
              <span className="course-detail__level">{detail.level}</span>
              <span className="course-detail__rating">★ {detail.rating}</span>
            </div>
            <p className="course-detail__location">{detail.location}</p>
          </div>

          <div className="course-detail__stats">
            {detail.stats.map((stat) => (
              <div className="course-stat" key={stat.label}>
                <span className="course-stat__label">{stat.label}</span>
                <span className="course-stat__value">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="course-detail__section">
          <h2 className="course-detail__section-title">이 장소의 다른 코스</h2>
          <div className="course-variants">
            {detail.variants.map((variant) => (
              <button
                key={variant.title}
                type="button"
                className={`course-variant${variant.active ? " course-variant--active" : ""}`}
              >
                <span className="course-variant__title">{variant.title}</span>
                <span className="course-variant__level">{variant.level}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="course-detail__section">
          <h2 className="course-detail__section-title">편의 정보</h2>
          <div className="course-amenities">
            {detail.amenities.map((amenity) => (
              <div className="course-amenity" key={amenity.label}>
                <span className="course-amenity__value">{amenity.value}</span>
                <span className="course-amenity__label">{amenity.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="course-detail__section course-detail__section--social">
          <h2 className="course-detail__section-title">러너들의 이야기</h2>
          <p className="course-detail__social">{detail.social}</p>
          <div className="course-reviews">
            {detail.reviews.map((review) => (
              <p className="course-review" key={review}>{review}</p>
            ))}
          </div>
        </section>
      </main>

      <div className="course-detail__cta">
        <button className="course-detail__route" type="button">길찾기</button>
        <button className="course-detail__start" type="button">이 코스로 러닝 시작</button>
      </div>
    </section>
  );
}
