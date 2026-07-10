import { StatusBar } from "./TopBars";
import BrandLogo from "./BrandLogo";
import type { OnboardingSlideData } from "../onboardingData";
import "./OnboardingSlide.css";

export default function OnboardingSlide({ image, imageAlt, eyebrow, titleLines, descLines }: OnboardingSlideData) {
  return (
    <div className="onboarding-slide">
      <img className="onboarding-slide__bg" src={image} alt={imageAlt} />
      <div className="onboarding-slide__scrim" />
      <div className="onboarding-slide__top-scrim" />

      <div className="onboarding-slide__statusbar">
        <StatusBar />
      </div>

      <BrandLogo className="onboarding-slide__logo" />

      <div className="onboarding-slide__copy">
        <p className="onboarding-slide__eyebrow">{eyebrow}</p>
        <h1 className="onboarding-slide__title">
          {titleLines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <p className="onboarding-slide__desc">
          {descLines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
