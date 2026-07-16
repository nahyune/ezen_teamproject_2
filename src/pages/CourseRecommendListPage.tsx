import { BackButton } from "../components/Icons";
import { courseExplorePages, type CourseDetailKind, type CourseExploreItem } from "../data";
import "../components/CourseExplorePage.css";

type Props = {
  onBack: () => void;
  onOpenDetail: (detail: CourseDetailKind) => void;
};

export default function CourseRecommendListPage({ onBack, onOpenDetail }: Props) {
  const courses = courseExplorePages.nearby.courses;

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
    <div className="phone bg-black text-[var(--text-primary)]">
      <header className="subheader justify-center">
        <BackButton onClick={onBack} className="absolute left-[18px] top-1/2 -translate-y-1/2" />
        <h1 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.48px]">이번주 추천코스</h1>
      </header>

      <main className="flex-1 pb-12 pt-[6px]">
        <section className="course-list">{courses.map(renderCourseCard)}</section>
      </main>
    </div>
  );
}
