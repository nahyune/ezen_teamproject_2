import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import "./SplashScreen.css";

export default function SplashScreen() {
  return (
    <div className="splash-screen" aria-label="W:RUN splash screen">
      <div className="splash-screen__content">
        <p className="splash-screen__tagline">
          WE RUN, <span>YOU IN?</span>
        </p>
        <div className="splash-screen__logo" aria-label="W:RUN">
          <img className="splash-screen__logo-w" src={logoW} alt="" />
          <div className="splash-screen__dots" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <img className="splash-screen__logo-run" src={logoRun} alt="" />
        </div>
      </div>
    </div>
  );
}
