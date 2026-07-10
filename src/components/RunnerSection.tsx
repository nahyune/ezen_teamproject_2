import SectionHeader from "./SectionHeader";
import { runners } from "../data";
import "./RunnerSection.css";

type Props = {
  onViewAll?: () => void;
};

export default function RunnerSection({ onViewAll }: Props) {
  return (
    <section className="runners">
      <SectionHeader title="인기 러너" onAction={onViewAll} />
      <div className="runners__row no-scrollbar">
        {runners.map((r) => (
          <div key={r.name} className="runner">
            <div className="runner__ring">
              <div className="runner__avatar">
                <img
                  src={r.image}
                  alt={r.name}
                  style={{
                    width: r.crop.width,
                    height: r.crop.height,
                    left: r.crop.left,
                    top: r.crop.top,
                  }}
                />
              </div>
            </div>
            <span className="runner__name">{r.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
