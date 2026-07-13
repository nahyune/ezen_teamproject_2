import { useState } from "react";
import OnboardingFlow from "./OnboardingFlow";
import Login from "./Login";
import FitOnboarding from "./FitOnboarding";
import FitOnboardingStep2 from "./FitOnboardingStep2";
import FitOnboardingStep3 from "./FitOnboardingStep3";
import App from "../App";

type Screen = "onboarding" | "login" | "fit1" | "fit2" | "fit3" | "main";

export default function OnboardingApp() {
  const [screen, setScreen] = useState<Screen>("onboarding");

  if (screen === "main") return <App />;
  if (screen === "fit3") return <FitOnboardingStep3 onBack={() => setScreen("fit2")} onFinish={() => setScreen("main")} />;
  if (screen === "fit2")
    return <FitOnboardingStep2 onBack={() => setScreen("fit1")} onNext={() => setScreen("fit3")} onSkip={() => setScreen("main")} />;
  if (screen === "fit1")
    return <FitOnboarding onBack={() => setScreen("login")} onNext={() => setScreen("fit2")} onSkip={() => setScreen("main")} />;
  if (screen === "login") return <Login onLogin={() => setScreen("fit1")} />;
  return <OnboardingFlow onComplete={() => setScreen("login")} />;
}
