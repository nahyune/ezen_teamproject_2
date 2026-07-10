import { useState } from "react";
import OnboardingFlow from "./OnboardingFlow";
import Login from "./Login";
import FitOnboarding from "./FitOnboarding";
import FitOnboardingStep2 from "./FitOnboardingStep2";
import FitOnboardingStep3 from "./FitOnboardingStep3";

type Screen = "onboarding" | "login" | "fit1" | "fit2" | "fit3";

export default function OnboardingApp() {
  const [screen, setScreen] = useState<Screen>("onboarding");

  if (screen === "fit3") return <FitOnboardingStep3 onBack={() => setScreen("fit2")} />;
  if (screen === "fit2")
    return <FitOnboardingStep2 onBack={() => setScreen("fit1")} onNext={() => setScreen("fit3")} onSkip={() => setScreen("fit3")} />;
  if (screen === "fit1")
    return <FitOnboarding onBack={() => setScreen("login")} onNext={() => setScreen("fit2")} onSkip={() => setScreen("fit2")} />;
  if (screen === "login") return <Login onLogin={() => setScreen("fit1")} />;
  return <OnboardingFlow onComplete={() => setScreen("login")} />;
}
