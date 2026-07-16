import { useRef } from "react";
import { useUserProfile, fileToAvatarDataUrl } from "../lib/userProfile";
import { BackButton } from "../components/Icons";

// ── 프로필 편집 (Figma 149:71) ─────────────────────────────
// 인스타식 즉시 저장: 값 영역(투명 인풋)을 누르면 그 자리에서 바로 수정,
// 입력하는 즉시 Context+localStorage 에 반영된다. 완료 버튼 없음.
// 레벨 수정 / 키워드 수정 / 러닝곡 추가는 후속 디자인 예정 — 표시만.

/** 라벨(형광 16SB) + 투명 인풋(14 흰색) 한 줄 — 값 컬럼은 x=141(라벨 영역 123px) */
function InputRow({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center">
      <span className="btn-text w-[123px] shrink-0 text-[var(--primary-lime)]">{label}</span>
      {/* text-ellipsis: 포커스 없을 때 넘치면 뒤를 …으로. 입력 중엔 브라우저가
          커서를 따라 스크롤(앞부분이 잘림). */}
      <input
        className="body-1 min-w-0 flex-1 truncate bg-transparent text-white outline-0 placeholder:text-white/40"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/** 라벨+설명 2줄 + 우측 액션(회색 14 + 셰브런) — 레벨/목표/러닝곡 행 */
function ActionRow({
  label,
  desc,
  action,
  onAction,
}: {
  label: string;
  desc: string;
  action: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="btn-text text-[var(--primary-lime)]">{label}</span>
        <span className="body-1 text-[#8a8a8a]">{desc}</span>
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={!onAction}
        className="mt-0.5 flex shrink-0 items-center gap-2"
      >
        <span className="body-2 text-[#8a8a8a]">{action}</span>
        <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5 text-white" aria-hidden>
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default function ProfileEditPage({ onBack }: { onBack?: () => void }) {
  const { profile, updateProfile, avatarSrc } = useUserProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickAvatar = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      updateProfile({ avatar: dataUrl });
    } catch {
      // 이미지 로드 실패 시 조용히 무시 (MVP)
    }
  };

  return (
    // 배경·헤더를 설정 페이지와 통일 (bg-app + 공용 .subheader + BackButton + 중앙 타이틀)
    <div className="flex flex-col bg-[var(--bg-app)] pb-10 text-white">
      <header className="subheader gap-3">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-[-0.48px] text-white">
          프로필 편집
        </h1>
      </header>

      <div className="mt-6 flex flex-col gap-10">
        {/* 아바타 + 사진 수정 (중앙 정렬) */}
        <div className="px-[var(--gutter)]">
          <div className="mx-auto flex w-[119px] flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="프로필 사진 선택"
              className="h-[119px] w-[119px] overflow-hidden rounded-full bg-[#d9d9d9]"
            >
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-text text-[var(--primary-lime)]"
            >
              프로필 사진 수정
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onPickAvatar(e.target.files?.[0]);
                e.target.value = ""; // 같은 파일 재선택 가능하게
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* 텍스트 필드 4개 — 즉시 저장 */}
          <div className="flex flex-col gap-8 px-[var(--gutter)]">
            <InputRow label="이름" value={profile.name} onChange={(v) => updateProfile({ name: v })} />
            <InputRow
              label="사용자 이름"
              value={profile.username}
              onChange={(v) => updateProfile({ username: v })}
            />
            <InputRow
              label="소개"
              value={profile.bio}
              placeholder="소개"
              onChange={(v) => updateProfile({ bio: v })}
            />
            <InputRow
              label="활동 지역"
              value={profile.region}
              onChange={(v) => updateProfile({ region: v })}
            />
          </div>

          {/* 러닝 특화 행 — 수정 화면은 후속 디자인 예정(표시만) */}
          <div className="flex flex-col gap-8 px-[var(--gutter)]">
            <ActionRow label="러닝 레벨" desc={profile.levelDesc} action="레벨 수정" />
            <ActionRow label="목표" desc={profile.goalKeywords.join("  ")} action="키워드 수정" />
            <ActionRow
              label="나만의 대표 러닝 곡"
              desc={profile.song ? `${profile.song.title} – ${profile.song.artist}` : "대표 러닝곡을 추가해보세요."}
              action="러닝곡 추가"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
