import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/typography.css'
import './index.css'
import OnboardingApp from './components/OnboardingApp.tsx'
import { UserProfileProvider } from './lib/userProfile.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 프로필(이름·아바타 등) 전역 공유 — 프로필 편집이 앱 전체·AI 챗봇에 반영됨 */}
    <UserProfileProvider>
      <OnboardingApp />
    </UserProfileProvider>
  </StrictMode>,
)
