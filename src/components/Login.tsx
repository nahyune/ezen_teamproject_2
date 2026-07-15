import BrandLogo from "./BrandLogo";
import bgImage from "../assets/img/on4_img.png";
import runner1 from "../assets/img/runner1.png";
import runner2 from "../assets/img/runner2.png";
import runner3 from "../assets/img/runner3.png";

export default function Login({ onLogin }: { onLogin?: () => void }) {
  return (
    // h-full = 폰 프레임 높이에 딱 맞춤 (min-h-dvh 는 브라우저 창 기준이라 프레임을 넘쳐 스크롤을 만들었음)
    <div className="relative self-start w-full max-w-[var(--frame-width)] h-full mx-auto overflow-hidden bg-black">
      <img className="absolute inset-0 w-full h-full object-cover" src={bgImage} alt="함께 달리는 러너들" />
      {/* Bottom gradient so the headline/CTA stay legible over the photo */}
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/92 from-25% to-transparent pointer-events-none" />

      <BrandLogo className="absolute top-[58px] left-[var(--gutter)] z-[2]" />

      <div className="absolute left-[var(--gutter)] right-[var(--gutter)] bottom-9.25 z-2 flex flex-col gap-5">
        <h1 className="flex flex-col font-display text-[82px] font-normal leading-[1.05]">
          <span className="text-white">WE RUN,</span>
          <span className="text-primary-lime">YOU IN?</span>
        </h1>

        <div className="flex items-center gap-2.5">
          <div className="flex">
            <img className="w-7 h-7 rounded-full object-cover border-2 border-[var(--bg-app)] first:ml-0 -ml-2.5" src={runner1} alt="" />
            <img className="w-7 h-7 rounded-full object-cover border-2 border-[var(--bg-app)] first:ml-0 -ml-2.5" src={runner2} alt="" />
            <img className="w-7 h-7 rounded-full object-cover border-2 border-[var(--bg-app)] first:ml-0 -ml-2.5" src={runner3} alt="" />
          </div>
          <span className="text-[13px] text-[var(--text-muted)]">12,847명의 러너가 이미 달리는 중</span>
        </div>

        <button
          className="w-full h-[58px] [@media(max-height:700px)]:h-[46px] rounded-[29px] bg-primary-lime text-black text-[17px] font-bold tracking-[-0.34px] active:scale-[0.99]"
          type="button"
          onClick={onLogin}
        >
          로그인
        </button>

        <p className="-mt-1.5 text-center text-sm font-light text-(--text-muted)">
          아직 크루가 아니라면? <button className="text-primary-lime font-semibold" type="button">회원가입</button>
        </p>
      </div>

      <div className="absolute left-1/2 bottom-3.5 -translate-x-1/2 z-2 w-33.5 h-1.25 rounded-[3px] bg-white" />
    </div>
  );
}
