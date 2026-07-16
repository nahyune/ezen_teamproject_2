// 사용자 프로필 전역 상태 — 프로필 편집에서 수정하면 앱 전체(마이페이지·챗봇 AI 등)에
// 즉시 반영되고 localStorage 에 자동 저장된다(새로고침해도 유지, 인스타식 즉시 저장).
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { profileData } from "../data";

export type UserProfile = {
  name: string; // AI 러니가 부르는 이름 · 마이페이지 표시
  username: string; // @아이디 (피드 작성자 표기)
  bio: string; // 한 줄 소개
  region: string; // 활동 지역
  /** 사용자가 업로드한 아바타(dataURL). null 이면 기본 이미지(profileData.avatar) 사용.
   *  빌드마다 해시가 바뀌는 번들 자산 경로는 저장하지 않는다. */
  avatar: string | null;
  levelDesc: string; // 러닝 레벨 설명 (예: "이제 달리기 시작한 런린이")
  goalKeywords: string[]; // 목표 키워드 (예: ["# 목표거리 완주", "# 꾸준히"])
  song: { title: string; artist: string } | null; // 나만의 대표 러닝 곡 (표시형)
};

const DEFAULT_PROFILE: UserProfile = {
  name: profileData.name,
  username: "Hayun01",
  bio: profileData.bio,
  region: "서울",
  avatar: null,
  levelDesc: "이제 달리기 시작한 런린이",
  goalKeywords: ["# 목표거리 완주", "# 꾸준히"],
  song: null,
};

const STORAGE_KEY = "wrun-profile";

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    // 필드가 추가돼도 안전하게 기본값 위에 덮어쓴다.
    return { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

type UserProfileContextValue = {
  profile: UserProfile;
  /** 일부 필드만 넘기면 병합 후 즉시 저장 (인스타식 자동 저장) */
  updateProfile: (patch: Partial<UserProfile>) => void;
  /** 업로드 아바타가 없으면 기본 이미지로 폴백된 실제 표시용 src */
  avatarSrc: string;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // 저장 실패(용량 초과 등)해도 앱 동작에는 지장 없음
    }
  }, [profile]);

  const updateProfile = (patch: Partial<UserProfile>) =>
    setProfile((prev) => ({ ...prev, ...patch }));

  return (
    <UserProfileContext.Provider
      value={{ profile, updateProfile, avatarSrc: profile.avatar ?? profileData.avatar }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}

/** 업로드 이미지를 아바타용으로 리사이즈해 dataURL 로 변환 (localStorage 용량 보호) */
export function fileToAvatarDataUrl(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      // 중앙 크롭(cover)
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했어요"));
    };
    img.src = url;
  });
}
