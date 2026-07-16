import { useEffect, useState } from "react";
import { useUserProfile } from "../lib/userProfile";
import { HIGHLIGHT_SEC, durationToSec, getDefaultHighlight } from "../lib/musicApi";
import iconNote from "../assets/icons/player-note.svg";
import iconPlay from "../assets/icons/player-play.svg";
import iconNext from "../assets/icons/player-next.svg";

// ── 프로필 뮤직 바 (마이페이지) — 기록하기 MusicPlayerBar 디자인 재사용 ──────
// 인스타 프로필 뮤직처럼, 방문자가 ▶ 를 누르면 대표 러닝곡들이
// 하이라이트 30초씩 "순차 재생"된다 (소리만 — 유튜브 임베드 숨김).
// ⏭ = 다음 곡(마지막 곡이면 첫 곡으로). 재생 중에만 곡명 마퀴가 흐른다.
// 대표 러닝곡이 없으면 아무것도 렌더하지 않는다.

export default function ProfileMusicBar({ className = "" }: { className?: string }) {
  const { profile } = useUserProfile();
  const songs = profile.songs;
  const count = songs.length;

  const [index, setIndex] = useState(0); // 현재 곡 인덱스
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0); // 바뀌면 임베드 리로드(처음부터 재생)

  const song = count ? songs[Math.min(index, count - 1)] : undefined;

  // 30초 하이라이트가 끝나면 다음 곡으로, 마지막 곡이 끝나면 처음으로 되감고 정지
  useEffect(() => {
    if (!playing || !song) return;
    const t = setTimeout(() => {
      if (index + 1 < count) {
        setIndex(index + 1);
        setPlayKey((k) => k + 1);
      } else {
        setPlaying(false);
        setIndex(0);
      }
    }, HIGHLIGHT_SEC * 1000);
    return () => clearTimeout(t);
  }, [playing, index, count, song]);

  if (!song) return null;

  const nextSong = () => {
    setIndex((index + 1) % count);
    setPlayKey((k) => k + 1);
  };

  const hs = song.highlightStart ?? getDefaultHighlight(durationToSec(song.duration));
  const title = `${song.artist} – ${song.title}`;

  return (
    <div
      className={`flex h-15 items-center rounded-[50px] border border-white/12 bg-black/40 pl-3 pr-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
    >
      <span className="grid size-10 flex-none place-items-center rounded-full bg-[#34363a]">
        <img className="h-5 w-3.75" src={iconNote} alt="" />
      </span>

      {/* 곡명 마퀴: 양 끝은 마스크로 자연스럽게 사라진다 (재생 중에만 흐름) */}
      <div className="ml-3.5 min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_6%,black_78%,transparent_100%)]">
        <div
          className={`animate-music-marquee flex w-max ${
            playing ? "" : "[animation-play-state:paused]"
          }`}
        >
          <span className="pr-12 text-[13px] font-medium whitespace-nowrap text-white/85">
            {title}
          </span>
          <span className="pr-12 text-[13px] font-medium whitespace-nowrap text-white/85" aria-hidden>
            {title}
          </span>
        </div>
      </div>

      <div className="flex flex-none items-center gap-5">
        <button
          type="button"
          aria-label={playing ? "일시정지" : "재생"}
          onClick={() => {
            setPlaying((p) => !p);
            setPlayKey((k) => k + 1); // 다시 재생하면 하이라이트 처음부터
          }}
        >
          {playing ? (
            <svg width={14} height={24} viewBox="0 0 16 27" fill="none" aria-hidden>
              <rect x="0" y="0" width="5.5" height="27" rx="1.5" fill="#fff" />
              <rect x="10.5" y="0" width="5.5" height="27" rx="1.5" fill="#fff" />
            </svg>
          ) : (
            <img className="h-6 w-4" src={iconPlay} alt="" />
          )}
        </button>
        <button type="button" aria-label="다음 곡" onClick={nextSong}>
          <img className="h-4 w-5" src={iconNext} alt="" />
        </button>
      </div>

      {/* 소리 재생 — 유튜브 임베드(숨김), 현재 곡 하이라이트 30초 */}
      {playing && song.videoId && (
        <div className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0" aria-hidden>
          <iframe
            key={`${song.id}-${playKey}`}
            src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=${hs}&end=${hs + HIGHLIGHT_SEC}`}
            title={song.title}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </div>
  );
}
