import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import iconChatbot from "../assets/icons/header-chatbot.svg";
import iconBell from "../assets/icons/header-bell.svg";
import iconSettings from "../assets/icons/header-settings.svg";
import "./TopBars.css";

export function StatusBar() {
  return (
    <div className="statusbar">
      <span className="statusbar__time">10:36</span>
      <div className="statusbar__right" aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" opacity="0.4" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path
            d="M8.5 11.5l7.6-7.9a10.7 10.7 0 00-15.2 0l7.6 7.9z"
            fill="currentColor"
          />
        </svg>
        <div className="statusbar__battery">
          <div className="statusbar__battery-fill" />
        </div>
      </div>
    </div>
  );
}

type AppHeaderProps = { variant?: "default" | "settings"; onSettingsClick?: () => void };

export function AppHeader({ variant = "default", onSettingsClick }: AppHeaderProps) {
  return (
    <header className="appheader">
      <div className="appheader__logo" aria-label="W:RUN">
        <img className="appheader__logo-w" src={logoW} alt="" />
        <span className="appheader__logo-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <img className="appheader__logo-run" src={logoRun} alt="" />
      </div>
      {variant === "settings" ? (
        <button type="button" aria-label="설정" onClick={onSettingsClick}>
          <img className="appheader__icon" src={iconSettings} alt="" />
        </button>
      ) : (
        <div className="appheader__actions">
          <button type="button" aria-label="챗봇">
            <img className="appheader__icon" src={iconChatbot} alt="" />
          </button>
          <button type="button" aria-label="알림">
            <img className="appheader__icon" src={iconBell} alt="" />
          </button>
        </div>
      )}
    </header>
  );
}
