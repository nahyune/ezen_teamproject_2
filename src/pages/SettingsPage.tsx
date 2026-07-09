import { Fragment, useState } from "react";
import { settingsGroups, defaultSettingsToggles } from "../data";
import chevronLeft from "../assets/icons/settings-chevron-left.svg";
import chevronRight from "../assets/icons/settings-chevron-right.svg";
import "./SettingsPage.css";

type Props = {
  onBack?: () => void;
};

export default function SettingsPage({ onBack }: Props) {
  const [toggles, setToggles] = useState(defaultSettingsToggles);

  return (
    <div className="settings">
      <header className="settings-header">
        <button
          type="button"
          className="settings-header__back"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <img src={chevronLeft} alt="" />
        </button>
        <h1 className="settings-header__title">설정</h1>
      </header>

      <div className="settings-content">
        {settingsGroups.map((group) => (
          <section key={group.title} className="settings-group">
            <p className="settings-group__title">{group.title}</p>
            <div className="settings-card">
              {group.rows.map((row, i) => (
                <Fragment key={row.label}>
                  {i > 0 && <div className="settings-card__divider" />}
                  <div className="settings-row">
                    <span className="settings-row__label">{row.label}</span>
                    {row.kind === "toggle" ? (
                      <button
                        type="button"
                        className={`settings-row__toggle${
                          toggles[row.key] ? " settings-row__toggle--on" : ""
                        }`}
                        aria-pressed={toggles[row.key]}
                        aria-label={row.label}
                        onClick={() =>
                          setToggles((prev) => ({ ...prev, [row.key]: !prev[row.key] }))
                        }
                      >
                        <span className="settings-row__toggle-thumb" />
                      </button>
                    ) : (
                      <span className="settings-row__right">
                        {row.value && <span className="settings-row__value">{row.value}</span>}
                        {row.kind === "nav" && (
                          <img className="settings-row__chevron" src={chevronRight} alt="" />
                        )}
                      </span>
                    )}
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
        ))}

        <div className="settings-actions">
          <button type="button" className="settings-actions__logout">
            로그아웃
          </button>
          <button type="button" className="settings-actions__delete">
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
