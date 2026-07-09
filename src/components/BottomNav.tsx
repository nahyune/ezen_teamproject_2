import navHome from "../assets/icons/nav-home.svg";
import subHome from "../assets/icons/sub-home.svg";
import navFeed from "../assets/icons/nav-feed.svg";
import navRecord from "../assets/icons/nav-record.svg";
import navUser from "../assets/icons/nav-user.svg";
import "./BottomNav.css";

const tabs = [
  { key: "home", label: "홈", icon: subHome },
  { key: "feed", label: "피드", icon: navFeed },
  { key: "record", label: "기록", icon: navRecord },
  { key: "my", label: "마이페이지", icon: navUser },
];

type Props = {
  active?: string;
  onNavigate?: (key: string) => void;
};

export default function BottomNav({ active = "home", onNavigate }: Props) {
  return (
    <div className="nav-dock">
      <nav className="bottomnav">
        <ul className="bottomnav__list">
          {tabs.map((t) => {
            const isActive = t.key === active;
            const icon = t.key === "home" ? (isActive ? navHome : subHome) : t.icon;
            return (
            <li key={t.key}>
              <button
                type="button"
                className={`bottomnav__tab${isActive ? " bottomnav__tab--active" : ""}`}
                onClick={() => onNavigate?.(t.key)}
              >
                <span
                  className="bottomnav__icon"
                  style={{
                    WebkitMaskImage: `url("${icon}")`,
                    maskImage: `url("${icon}")`,
                  }}
                />
                <span>{t.label}</span>
              </button>
            </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
