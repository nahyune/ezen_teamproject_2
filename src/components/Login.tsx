import { StatusBar } from "./TopBars";
import BrandLogo from "./BrandLogo";
import bgImage from "../assets/img/on4_img.png";
import runner1 from "../assets/img/runner1.png";
import runner2 from "../assets/img/runner2.png";
import runner3 from "../assets/img/runner3.png";
import "./Login.css";

export default function Login({ onLogin }: { onLogin?: () => void }) {
  return (
    <div className="login">
      <img className="login__bg" src={bgImage} alt="함께 달리는 러너들" />
      <div className="login__scrim" />

      <div className="login__statusbar">
        <StatusBar />
      </div>

      <BrandLogo className="login__logo" />

      <div className="login__content">
        <h1 className="login__title">
          <span className="login__title-line login__title-line--white">WE RUN,</span>
          <span className="login__title-line login__title-line--lime">YOU IN?</span>
        </h1>

        <div className="login__social">
          <div className="login__avatars">
            <img className="login__avatar" src={runner1} alt="" />
            <img className="login__avatar" src={runner2} alt="" />
            <img className="login__avatar" src={runner3} alt="" />
          </div>
          <span className="login__social-text">12,847명의 러너가 이미 달리는 중</span>
        </div>

        <button className="login__cta" type="button" onClick={onLogin}>
          로그인
        </button>

        <p className="login__signup">
          아직 크루가 아니라면? <button className="login__signup-link" type="button">회원가입</button>
        </p>
      </div>

      <div className="login__home-indicator" />
    </div>
  );
}
