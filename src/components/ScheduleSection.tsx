import SectionHeader from "./SectionHeader";
import { scheduleData } from "../data";
import "./ScheduleSection.css";

type Props = {
  onMore?: () => void;
  onOpen?: () => void;
};

export default function ScheduleSection({ onMore, onOpen }: Props) {
  return (
    <section className="schedule">
      <SectionHeader title="내 일정" action="더보기" onAction={onMore} />
      <button className="schedule__card" type="button" onClick={onOpen}>
        <img className="schedule__bg" src={scheduleData.image} alt="" />
        <div className="schedule__scrim" />
        <div className="schedule__body">
          <p className="schedule__title">NR Crew-저녁 러닝</p>
          <div className="schedule__meta">
            <span>2026-07-07(화)</span>
            <span>18:00</span>
          </div>
        </div>
      </button>
    </section>
  );
}
