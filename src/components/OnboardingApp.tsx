import { useEffect, useState } from "react";
import OnboardingFlow from "./OnboardingFlow";
import Login from "./Login";
import FitOnboarding from "./FitOnboarding";
import FitOnboardingStep2 from "./FitOnboardingStep2";
import FitOnboardingStep3 from "./FitOnboardingStep3";
import FitOnboardingStep4 from "./FitOnboardingStep4";
import PhoneFrame from "./PhoneFrame";
import SplashScreen from "./SplashScreen";
import App from "../App";

type Screen = "onboarding" | "login" | "fit1" | "fit2" | "fit3" | "fit4" | "main";

export default function OnboardingApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>("onboarding");

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 3300);
    return () => window.clearTimeout(timer);
  }, []);

  if (screen === "main") return <App />;

  if (showSplash) {
    return (
      <PhoneFrame>
        <SplashScreen />
      </PhoneFrame>
    );
  }

  const content = (() => {
    if (screen === "fit4") {
      return <FitOnboardingStep4 onBack={() => setScreen("fit3")} onFinish={() => setScreen("main")} />;
    }
    if (screen === "fit3") {
      return (
        <FitOnboardingStep3
          onBack={() => setScreen("fit2")}
          onNext={() => setScreen("fit4")}
          onSkip={() => setScreen("main")}
        />
      );
    }
    if (screen === "fit2") {
      return (
        <FitOnboardingStep2
          onBack={() => setScreen("fit1")}
          onNext={() => setScreen("fit3")}
          onSkip={() => setScreen("main")}
        />
      );
    }
    if (screen === "fit1") {
      return (
        <FitOnboarding
          onBack={() => setScreen("login")}
          onNext={() => setScreen("fit2")}
          onSkip={() => setScreen("main")}
        />
      );
    }
    if (screen === "login") return <Login onLogin={() => setScreen("fit1")} />;
    return <OnboardingFlow onComplete={() => setScreen("login")} />;
  })();

  // 온보딩은 전부 몰입 화면(배경 풀블리드) → 상태바 투명.
  return <PhoneFrame statusBar="clear">{content}</PhoneFrame>;
}
