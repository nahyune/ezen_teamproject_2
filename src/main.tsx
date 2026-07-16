import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./index.css";
import OnboardingApp from "./components/OnboardingApp.tsx";
import { UserProfileProvider } from "./lib/userProfile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProfileProvider>
      <OnboardingApp />
    </UserProfileProvider>
  </StrictMode>,
);
