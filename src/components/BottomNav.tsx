import navHome from "../assets/icons/nav-home.svg";
import subHome from "../assets/icons/sub-home.svg";
import navFeed from "../assets/icons/nav-feed.svg";
import navRecord from "../assets/icons/nav-record.svg";
import navUser from "../assets/icons/nav-user.svg";

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
    <div className="fixed left-1/2 bottom-0 -translate-x-1/2 w-[430px] max-w-full z-[100] flex flex-col items-center gap-2 px-4 pb-[env(safe-area-inset-bottom,0px)] pointer-events-none">
      <nav
        className="bottom-nav pointer-events-auto w-[398px] max-w-full p-4 rounded-[100px] bg-black/8 border border-white/8 backdrop-blur-[8px] backdrop-saturate-[140%] [-webkit-backdrop-filter:blur(8px)_saturate(140%)]"
      >
        <ul className="flex items-center justify-between h-[53px]">
          {tabs.map((t) => {
            const isActive = t.key === active;
            const icon = t.key === "home" ? (isActive ? navHome : subHome) : t.icon;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  className={`flex flex-col items-center gap-[5px] w-[51px] text-xs font-medium tracking-[-0.24px] text-center whitespace-nowrap ${
                    isActive ? "text-[#d6ff1e] font-semibold" : "text-white"
                  }`}
                  onClick={() => onNavigate?.(t.key)}
                >
                  <span
                    className="w-[30px] h-[28px] bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
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
