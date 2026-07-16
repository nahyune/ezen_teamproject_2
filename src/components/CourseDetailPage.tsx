import { useEffect, useState } from "react";
import { courseDetailPages, type CourseDetailKind } from "../data";
import { GWANGHWAMUN_DOG_RUN_CENTER, GWANGHWAMUN_DOG_RUN_PATH } from "../data/gwanghwamunDogRoute";
import { YEOUIDO_SWEET_POTATO_CENTER, YEOUIDO_SWEET_POTATO_PATH } from "../data/yeouidoSweetPotatoRoute";
import { NAMSAN_HEART_CENTER, NAMSAN_HEART_PATH } from "../data/namsanHeartRoute";
import { YEOUIDO_LOOP_CENTER, YEOUIDO_LOOP_PATH } from "../data/yeouidoLoopRoute";
import { NODULSEOM_CENTER, NODULSEOM_PATH } from "../data/nodulseomRoute";
import { BackButton } from "./Icons";
import MapBackdrop from "./MapBackdrop";
import "./CourseDetailPage.css";


type Props = {
  onBack: () => void;
  onStartCourse: () => void;
  kind: CourseDetailKind;
};

const mapCourseConfig: Partial<Record<CourseDetailKind, { center: { lat: number; lng: number }; path: { lat: number; lng: number }[]; level: number }>> = {
  yeouido: {
    center: YEOUIDO_LOOP_CENTER,
    path: YEOUIDO_LOOP_PATH,
    level: 5,
  },
  nodulseom: {
    center: NODULSEOM_CENTER,
    path: NODULSEOM_PATH,
    level: 5,
  },
  gwanghwamun: {
    center: GWANGHWAMUN_DOG_RUN_CENTER,
    path: GWANGHWAMUN_DOG_RUN_PATH,
    level: 6,
  },
  yeouidoGoguma: {
    center: YEOUIDO_SWEET_POTATO_CENTER,
    path: YEOUIDO_SWEET_POTATO_PATH,
    level: 6,
  },
  namsanHeart: {
    center: NAMSAN_HEART_CENTER,
    path: NAMSAN_HEART_PATH,
    level: 6,
  },
};

export default function CourseDetailPage({ onBack, onStartCourse, kind }: Props) {
  const detail = courseDetailPages[kind];
  const mapConfig = mapCourseConfig[kind];
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(() =>
    Math.max(0, detail.variants.findIndex((variant) => variant.active)),
  );

  useEffect(() => {
    setSelectedVariant(Math.max(0, courseDetailPages[kind].variants.findIndex((variant) => variant.active)));
  }, [kind]);

  return (
    <section className="course-detail">
      <div className={`course-detail__hero${mapConfig ? " course-detail__hero--map" : ""}`}>
        {mapConfig ? (
          <button
            type="button"
            className="course-detail__map-trigger"
            aria-label="지도 전체화면으로 보기"
            onClick={() => setIsMapOpen(true)}
          >
            <MapBackdrop
              center={mapConfig.center}
              level={mapConfig.level}
              markerPosition={mapConfig.path[0]}
              markerVariant="orange"
              markerPath={mapConfig.path}
              showTraveledPath
              traveledPathProgress={1}
            />
          </button>
        ) : (
          <img src={detail.image} alt="" />
        )}
      </div>

      <div className="course-detail__header-gradient" aria-hidden />
      <header className="course-detail__header">
        <BackButton onClick={onBack} label="추천 코스로 돌아가기" />
      </header>

      {isMapOpen && mapConfig && (
        <div className="course-detail__map-fullscreen">
          <MapBackdrop
            center={mapConfig.center}
            interactive
            level={mapConfig.level}
            markerPosition={mapConfig.path[0]}
            markerVariant="orange"
            markerPath={mapConfig.path}
            showTraveledPath
            traveledPathProgress={1}
          />
          <div className="course-detail__map-fullscreen-gradient" aria-hidden />
          <BackButton
            onClick={() => setIsMapOpen(false)}
            label="지도 닫기"
            className="course-detail__map-fullscreen-back"
          />
        </div>
      )}

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
          <h2 className="course-detail__section-title">난이도 선택</h2>
          <div className="course-variants">
            {detail.variants.map((variant, index) => (
              <button
                key={variant.title}
                type="button"
                className={`course-variant${selectedVariant === index ? " course-variant--active" : ""}`}
                aria-pressed={selectedVariant === index}
                onClick={() => setSelectedVariant(index)}
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
        <button className="course-detail__start" type="button" onClick={onStartCourse}>이 코스로 러닝 시작</button>
      </div>
    </section>
  );
}
