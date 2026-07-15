import {
  courseExplorePages,
  type CourseDetailKind,
  type CourseExploreItem,
  type CourseExploreKind,
} from "../data";
import { BackButton, SearchIcon } from "./Icons";import "./CourseExplorePage.css";

type Props = {
  onBack: () => void;
  onOpenDetail: (detail: CourseDetailKind) => void;
  kind: CourseExploreKind;
};

export default function CourseExplorePage({ onBack, onOpenDetail, kind }: Props) {
  const page = courseExplorePages[kind];

  const renderCourseCard = (course: CourseExploreItem) => {
    const content = (
      <>
        <div className="course-list__thumb">
          <img src={course.image} alt="" />
        </div>
        <div className="course-list__info">
          <div className="course-list__title-row">
            <h3 className="course-list__title">{course.name}</h3>
            <span className="course-list__level">{course.level}</span>
          </div>
          <p className="course-list__meta">
            {course.distance} · {course.duration} · ★ {course.rating}
          </p>
          <p className="course-list__nearby">{course.nearby}</p>
        </div>
      </>
    );

    return course.detail ? (
      <button key={course.name} type="button" className="course-list__card" onClick={() => onOpenDetail(course.detail!)}>
        {content}
      </button>
    ) : (
      <article key={course.name} className="course-list__card">
        {content}
      </article>
    );
  };

  return (
    <section className="course-explore">
      <header className="subheader justify-between">
        <BackButton onClick={onBack} />
        <h1 className="course-explore__page-title">추천 코스</h1>
        <button className="course-explore__icon-btn" type="button" aria-label="검색">
          <SearchIcon size={24} />
        </button>
      </header>

      <main className="course-explore__content">
        <section className="nearby-course">
          <h2 className="course-explore__section-title">{page.sectionTitle}</h2>
          {page.hero.detail ? (
            <button className="nearby-course__card" type="button" onClick={() => onOpenDetail(page.hero.detail!)}>
              <div className="nearby-course__image">
                <img src={page.hero.image} alt="" style={page.hero.imageBox} />
              </div>
              <div className="nearby-course__info">
                <div className="nearby-course__title-row">
                  <h3 className="nearby-course__title">
                    {page.hero.title} · {page.hero.distance}
                  </h3>
                  <span className="nearby-course__level">{page.hero.level}</span>
                </div>
                <p className="nearby-course__meta">{page.hero.meta}</p>
              </div>
            </button>
          ) : (
            <article className="nearby-course__card">
              <div className="nearby-course__image">
                <img src={page.hero.image} alt="" style={page.hero.imageBox} />
              </div>
              <div className="nearby-course__info">
                <div className="nearby-course__title-row">
                  <h3 className="nearby-course__title">
                    {page.hero.title} · {page.hero.distance}
                  </h3>
                  <span className="nearby-course__level">{page.hero.level}</span>
                </div>
                <p className="nearby-course__meta">{page.hero.meta}</p>
              </div>
            </article>
          )}
        </section>

        <div className="course-filters no-scrollbar">
          {page.filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`course-filter${index === 0 ? " course-filter--active" : ""}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="course-list">
          {page.courses.map(renderCourseCard)}
        </section>
      </main>
    </section>
  );
}
