import { Fragment, useState } from "react";import { settingsGroups, defaultSettingsToggles } from "../data";
import { BackButton } from "../components/Icons";
import chevronRight from "../assets/icons/settings-chevron-right.svg";

type Props = {
  onBack?: () => void;
  /** "프로필 편집" 행 클릭 → 프로필 편집 페이지로 이동 */
  onOpenProfile?: () => void;
};

export default function SettingsPage({ onBack, onOpenProfile }: Props) {
  const [toggles, setToggles] = useState(defaultSettingsToggles);

  return (
    <div className="flex flex-col bg-[var(--bg-app)]">
      <header className="subheader gap-3">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-[-0.48px] text-white">
          설정
        </h1>
      </header>

      <div className="flex flex-col gap-12 pt-2 px-[18px] pb-10">
        {settingsGroups.map((group) => (
          <section key={group.title} className="flex flex-col gap-2.5">
            <p className="text-xl font-medium tracking-[-0.42px] text-primary-lime">
              {group.title}
            </p>
            <div className="bg-[#161616] rounded-2xl overflow-hidden">
              {group.rows.map((row, i) => (
                <Fragment key={row.label}>
                  {i > 0 && <div className="h-px bg-[#262626]" />}
                  <div
                    className={`flex items-center justify-between px-4 py-[17px] ${
                      row.label === "프로필 편집" ? "cursor-pointer" : ""
                    }`}
                    onClick={row.label === "프로필 편집" ? onOpenProfile : undefined}
                  >
                    <span className="text-base tracking-[-0.48px] text-white">{row.label}</span>
                    {row.kind === "toggle" ? (
                      <button
                        type="button"
                        className={`relative w-11 h-[26px] rounded-full transition-colors duration-200 ease-in-out ${
                          toggles[row.key] ? "bg-primary-lime" : "bg-[#3b3b3b]"
                        }`}
                        aria-pressed={toggles[row.key]}
                        aria-label={row.label}
                        onClick={() =>
                          setToggles((prev) => ({ ...prev, [row.key]: !prev[row.key] }))
                        }
                      >
                        <span
                          className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full transition-[transform,background-color,box-shadow] duration-200 ease-in-out ${
                            toggles[row.key]
                              ? "bg-white translate-x-[18px] shadow-[0_2px_4px_rgba(143,172,43,0.5)]"
                              : "bg-[#999999]"
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="flex items-center gap-2">
                        {row.value && (
                          <span className="text-sm tracking-[-0.42px] text-[#8a8a8a]">
                            {row.value}
                          </span>
                        )}
                        {row.kind === "nav" && (
                          <img className="w-3.5 h-3.5" src={chevronRight} alt="" />
                        )}
                      </span>
                    )}
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-col items-center gap-5 pt-2">
          <button type="button" className="text-base font-medium text-primary-orange">
            로그아웃
          </button>
          <button type="button" className="text-sm text-[#8a8a8a] underline underline-offset-2">
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
