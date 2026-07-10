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
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
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

type AppHeaderProps = {
  variant?: "default" | "settings" | "feed";
  onSettingsClick?: () => void;
};

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
      ) : variant === "feed" ? (
        <div className="appheader__actions">
          <button type="button" aria-label="게시물 올리기">
            <svg className="appheader__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="응원 알림">
            <svg className="appheader__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 20.5C12 20.5 4.5 15.4 4.5 10 4.5 7.5 6.5 5.6 8.7 5.6c1.5 0 2.7.8 3.3 1.9.6-1.1 1.8-1.9 3.3-1.9 2.2 0 4.2 1.9 4.2 4.4 0 5.4-7.5 10.5-7.5 10.5z"
                stroke="#f5f5f7"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
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
