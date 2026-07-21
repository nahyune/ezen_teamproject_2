import { useEffect, useState } from "react";
import { useUserProfile } from "../lib/userProfile";
import {
  HIGHLIGHT_SEC,
  durationToSec,
  getDefaultHighlight,
  type Song,
} from "../lib/musicApi";
import { playSong, pauseSong, stopSong } from "../lib/youtubePlayer";
import { BackButton } from "../components/Icons";
import MusicSearchSheet from "../components/MusicSearchSheet";
import HighlightPicker from "../components/HighlightPicker";
import playIcon from "../assets/icons/song-play.svg";
import editIcon from "../assets/icons/song-edit.svg";
import deleteIcon from "../assets/icons/song-delete.svg";
import addIcon from "../assets/icons/song-add.svg";

// ── 나만의 대표 러닝 곡 (Figma 149:151 빈 상태 / 149:184 곡 있음) ──────────
// 곡 목록은 프로필(localStorage)에 순서대로 저장되고 첫 곡이 프로필 대표곡.
// 곡 추가: 음악 찾기 시트(149:220)에서 미리듣기 → 확정하면 목록에 추가되며
// 하이라이트 30초 설정 오버레이(149:344)가 자동으로 열린다. ✏️ = 구간 재설정.
// ▶ 재생: 인스타 프로필 뮤직처럼 하이라이트 30초씩 "순차 재생" —
//   누른 곡부터 시작해 30초가 끝나면 자동으로 다음 곡, 마지막 곡이 끝나면 정지.
//   (같은 로직을 프로필(마이페이지) 뮤직 재생에도 재사용 예정)

export default function RunningSongPage({
  onBack,
  songs: songsProp,
  onSongsChange,
  enableHighlight = true,
}: {
  onBack?: () => void;
  /** 외부에서 곡 목록을 관리할 때 전달 (미전달 시 프로필 대표곡 사용).
   *  기록 흐름은 마이페이지(profile.songs)와 분리된 자체 목록을 넘긴다. */
  songs?: Song[];
  onSongsChange?: (songs: Song[]) => void;
  /** 30초 하이라이트 구간 선택 UI 사용 여부 (기본 true=프로필, 기록 흐름은 false) */
  enableHighlight?: boolean;
}) {
  const { profile, updateProfile } = useUserProfile();
  const usingExternal = songsProp !== undefined;
  const songs = usingExternal ? songsProp : profile.songs;
  const setSongs = (next: Song[]) =>
    usingExternal ? onSongsChange?.(next) : updateProfile({ songs: next });

  // 음악 찾기 시트 (곡 추가)
  const [sheetOpen, setSheetOpen] = useState(false);
  // 하이라이트 30초 설정 오버레이 대상 곡 (추가 직후 자동 오픈 / ✏️로 재설정)
  const [highlightSong, setHighlightSong] = useState<Song | null>(null);
  // ▶ 재생 중인 곡 id
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 화면을 벗어나면 재생 정지 (플레이어는 앱 전체 공용이라 명시적으로 꺼줘야 한다)
  useEffect(() => () => stopSong(), []);

  /** ▶ 탭 핸들러 — 모바일에서 소리가 나려면 반드시 "사용자 탭" 안에서 재생을 호출해야 한다.
   *  하이라이트 구간(30초)이 끝나면 onEnded 로 다음 곡을 이어서 재생한다. */
  const playFrom = (song: Song) => {
    if (!song.videoId) {
      // 재생할 소스가 없으면 표시만 (목데이터 등)
      setPlayingId(song.id);
      return;
    }
    const start = song.highlightStart ?? getDefaultHighlight(durationToSec(song.duration));
    setPlayingId(song.id);
    void playSong({
      videoId: song.videoId,
      startSeconds: enableHighlight ? start : undefined,
      endSeconds: enableHighlight ? start + HIGHLIGHT_SEC : undefined,
      onEnded: () => {
        // 다음 곡으로 순차 재생 (마지막 곡이면 정지)
        const idx = songs.findIndex((s) => s.id === song.id);
        const next = songs[idx + 1];
        if (next?.videoId) playFrom(next);
        else setPlayingId(null);
      },
    });
  };

  const togglePlay = (song: Song) => {
    if (playingId === song.id) {
      pauseSong();
      setPlayingId(null);
    } else {
      playFrom(song);
    }
  };

  // 시트에서 → 로 확정 — 목록에 추가. 하이라이트 사용 시에만 구간 설정 오버레이를 연다.
  const pickSong = (song: Song) => {
    if (!songs.some((s) => s.id === song.id)) setSongs([...songs, song]);
    setSheetOpen(false);
    if (enableHighlight) setHighlightSong(song);
  };

  // 하이라이트 설정 완료 — 선택한 시작 지점 저장
  const saveHighlight = (startSec: number) => {
    if (highlightSong) {
      setSongs(
        songs.map((s) => (s.id === highlightSong.id ? { ...s, highlightStart: startSec } : s)),
      );
    }
    setHighlightSong(null);
  };

  const removeSong = (id: string) => {
    setSongs(songs.filter((s) => s.id !== id));
    if (playingId === id) setPlayingId(null);
  };

  return (
    <div className="flex flex-col bg-[var(--bg-app)] pb-10 text-white">
      <header className="subheader gap-3">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-[-0.48px] text-white">
          나만의 대표 러닝 곡
        </h1>
      </header>

      {/* 섹션 라벨 */}
      <p className="btn-text px-[var(--gutter)] text-white">프로필에 표시 중인 곡</p>

      {songs.length === 0 ? (
        /* ── 빈 상태 (149:151) ── */
        <div className="mt-12 flex flex-col items-center gap-2 px-[var(--gutter)] text-center">
          <p className="text-xl font-semibold tracking-[-0.4px] text-white">
            나만의 러닝곡을 들려주세요
          </p>
          <p className="body-2 text-[#8a8a8a]">회원님께서 러닝할 때 듣는 러닝곡을 공유해주세요.</p>
          <AddButton className="mt-5" onClick={() => setSheetOpen(true)} />
        </div>
      ) : (
        /* ── 곡 목록 (149:184) — 저장된 순서대로 ── */
        <div className="mt-9 flex flex-col gap-8">
          <ul className="flex flex-col gap-5 px-[var(--gutter)]">
            {songs.map((song) => (
              <li key={song.id} className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={playingId === song.id ? "정지" : "재생"}
                  onClick={() => togglePlay(song)}
                  className="shrink-0"
                >
                  <img src={playIcon} alt="" className="h-4 w-3.5" />
                </button>
                <span
                  className={`body-1 min-w-0 flex-1 truncate ${
                    playingId === song.id ? "text-[var(--primary-lime)]" : "text-white"
                  }`}
                >
                  {song.title}
                </span>
                <div className="flex shrink-0 items-center gap-5">
                  {/* ✏️ = 하이라이트 구간 재설정 (149:344 오버레이) — 기록 흐름에선 숨김 */}
                  {enableHighlight && (
                    <button
                      type="button"
                      aria-label="하이라이트 구간 설정"
                      onClick={() => setHighlightSong(song)}
                    >
                      <img src={editIcon} alt="" className="h-[18px] w-4" />
                    </button>
                  )}
                  <button type="button" aria-label="곡 삭제" onClick={() => removeSong(song.id)}>
                    <img src={deleteIcon} alt="" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <AddButton onClick={() => setSheetOpen(true)} />
        </div>
      )}

      {/* 재생은 공용 유튜브 플레이어(lib/youtubePlayer)가 담당한다 — 화면 밖 1px
          플레이어 하나를 재사용해, 사용자 탭 안에서 unMute+play 를 호출하므로
          모바일에서도 소리가 난다. 재생 중 표시는 곡명 형광색. */}

      {/* 음악 찾기 바텀시트 (149:220) — 미리듣기 후 → 로 확정 */}
      <MusicSearchSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onPick={pickSong} />

      {/* 하이라이트 30초 설정 오버레이 (149:344) — 기록 흐름에선 렌더 안 함 */}
      {enableHighlight && highlightSong && (
        <HighlightPicker
          song={highlightSong}
          onCancel={() => setHighlightSong(null)}
          onDone={saveHighlight}
        />
      )}
    </div>
  );
}

/** ⊕ 음악 추가하기 (형광, 중앙) */
function AddButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mx-auto flex items-center gap-2 ${className}`}
    >
      <img src={addIcon} alt="" className="h-[15px] w-[15px]" />
      <span className="btn-text text-[var(--primary-lime)]">음악 추가하기</span>
    </button>
  );
}
