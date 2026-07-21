import { useEffect, useState } from "react";
import RecordPage from "./RecordPage";
import RunningGuidePage from "./RunningGuidePage";
import CountdownPage from "./CountdownPage";
import RunningPage, { type RunCourseMap, type RunSummary } from "./RunningPage";
import RunCompletePage from "./RunCompletePage";
import RunRecordCardPage, { type SharedRunCard } from "./RunRecordCardPage";
import MusicConnectPage from "./MusicConnectPage";
import RunningSongPage from "../pages/RunningSongPage";
import { RecordMusicContext, type RecordMusic } from "../lib/recordMusic";
import { durationToSec, DEMO_RUN_SONGS, type Song } from "../lib/musicApi";

// 기록 흐름 전용 러닝곡 목록 저장 키 — 마이페이지(wrun-profile.songs)와 분리.
const RECORD_SONGS_KEY = "wrun-record-songs";

type Screen = "record" | "guide" | "countdown" | "running" | "finished" | "card" | "music" | "songs";

// 기록 탭의 화면 전환 담당:
// 기록하기 ↔ 러닝 가이드, 시작 → 카운트다운(3·2·1) → 러닝 측정
// → (일시정지에서 길게 눌러 종료) → 러닝 완료 → 뒤로가기 → 기록하기.
// 홈 히어로의 "오늘 기록 시작하기"로 진입하면(autoStart) 기록하기 화면을
// 건너뛰고 바로 카운트다운부터 시작한다.
//
// 음악: 연결 여부는 App 이 보관(기록 탭을 나갔다 와도 유지, 새로고침 시 초기화).
// 재생 엔진은 여기(RecordFlow)에 하나만 — "나만의 대표 러닝 곡"을 순서대로
// 풀재생하고 마지막 곡이 끝나면 처음부터 반복한다. 화면(러닝/지도/일시정지)을
// 오가도 이 컴포넌트가 유지되므로 음악이 끊기지 않는다.
export default function RecordFlow({
  autoStart = false,
  selectedCourseLabel,
  selectedCourseMap,
  currentLocation,
  musicConnected = false,
  onMusicConnected,
  onBack,
  onChatbot,
  onNavigate,
  onShareCard,
  onSaveCard,
}: {
  autoStart?: boolean;
  selectedCourseLabel?: string | null;
  selectedCourseMap?: RunCourseMap | null;
  /** 실제 geolocation 좌표 — 코스 미지정 자유 러닝에서만 지도 중심으로 쓰인다 */
  currentLocation?: { lat: number; lng: number } | null;
  /** 음악 연결 여부 — App 이 보관 (새로고침 전까지 유지) */
  musicConnected?: boolean;
  onMusicConnected?: () => void;
  onBack?: () => void;
  onChatbot?: () => void;
  onNavigate?: (key: string) => void;
  onShareCard?: (card: SharedRunCard) => void;
  onSaveCard?: (card: SharedRunCard) => void;
}) {
  const [screen, setScreen] = useState<Screen>(() => (autoStart ? "countdown" : "record"));
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);

  // ── 음악 재생 엔진 (기록 전용 러닝곡 풀재생·순차·반복) ──────────────
  // 곡 목록은 마이페이지(profile.songs)와 별개인 기록 전용 목록(localStorage)에서 온다.
  const [recordSongs, setRecordSongs] = useState<Song[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECORD_SONGS_KEY) ?? "[]") as Song[];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(RECORD_SONGS_KEY, JSON.stringify(recordSongs));
    } catch {
      // 저장 실패(용량 초과 등)해도 동작엔 지장 없음
    }
  }, [recordSongs]);
  const songs = recordSongs;
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(musicConnected); // 재진입 시 자동 이어 시작
  const [musicKey, setMusicKey] = useState(0); // 바뀌면 임베드 리로드(곡 처음부터)

  const song = songs.length ? songs[musicIndex % songs.length] : null;
  // 소리는 기록 흐름 안(기록 대기·카운트다운·러닝/지도/일시정지)에서만 낸다.
  // 연결 직후 기록 화면에서 바로 소리가 나야 하므로 record·countdown 도 포함한다.
  // (음악 선택·가이드·완료·카드 화면에선 조용 — 연결 상태만 유지)
  const musicActive =
    musicConnected &&
    musicPlaying &&
    (screen === "running" || screen === "record" || screen === "countdown");

  // 풀재생: 곡 길이만큼 지나면 다음 곡, 마지막 곡 다음은 처음(반복)
  useEffect(() => {
    if (!musicActive || !song) return;
    const t = setTimeout(() => {
      setMusicIndex((i) => (i + 1) % songs.length);
      setMusicKey((k) => k + 1);
    }, durationToSec(song.duration) * 1000);
    return () => clearTimeout(t);
  }, [musicActive, musicIndex, songs.length, song]);

  // 연결(서비스 선택) 완료 → 연결 저장 + 첫 곡부터 바로 재생.
  // 대표곡이 비어 있으면(실 음악 API 미연동 데모) 검증된 러닝곡으로 채워 실제 소리가 나게 한다.
  const connectMusic = () => {
    if (!songs.length) setRecordSongs(DEMO_RUN_SONGS);
    onMusicConnected?.();
    setMusicIndex(0);
    setMusicPlaying(true);
    setMusicKey((k) => k + 1);
  };

  const music: RecordMusic = {
    song,
    playing: musicActive,
    toggle: () => {
      setMusicPlaying((p) => !p);
      setMusicKey((k) => k + 1); // 다시 재생 시 현재 곡 처음부터
    },
    next: () => {
      if (!songs.length) return;
      setMusicIndex((i) => (i + 1) % songs.length);
      setMusicKey((k) => k + 1);
    },
  };

  const content = (() => {
    if (screen === "guide") {
      return <RunningGuidePage onBack={() => setScreen("record")} />;
    }
    if (screen === "music") {
      // 음악 서비스 선택 화면. 연결하면 마이페이지와 동일한 대표 러닝곡 목록으로 이동한다.
      return (
        <MusicConnectPage
          onClose={() => setScreen("record")}
          onConnect={() => {
            connectMusic();
            setScreen("songs");
          }}
        />
      );
    }
    if (screen === "songs") {
      // 연결 직후 뜨는 곡 목록 — 마이페이지와 같은 컴포넌트지만 기록 전용 목록을 쓰고
      // 하이라이트(30초 구간) 선택 오버레이는 끈다. 곡을 미리듣거나 추가/삭제한 뒤
      // 뒤로가기로 기록 화면에 돌아가 러닝을 시작한다.
      return (
        <RunningSongPage
          onBack={() => setScreen("record")}
          songs={recordSongs}
          onSongsChange={setRecordSongs}
          enableHighlight={false}
        />
      );
    }
    if (screen === "countdown") {
      return <CountdownPage onDone={() => setScreen("running")} />;
    }
    if (screen === "running") {
      return (
        <RunningPage
          onEnd={(summary) => {
            setRunSummary(summary);
            setScreen("finished");
          }}
          onBack={onBack}
          onCancelRun={() => {
            setRunSummary(null);
            setScreen("record");
          }}
          onChatbot={onChatbot}
          selectedCourseLabel={selectedCourseLabel}
          selectedCourseMap={selectedCourseMap}
          currentLocation={currentLocation}
          musicConnected={musicConnected}
          onMusicConnected={connectMusic}
        />
      );
    }
    if (screen === "finished") {
      return (
        <RunCompletePage
          summary={runSummary}
          onCreateCard={() => setScreen("card")}
          onBack={() => {
            setRunSummary(null);
            setScreen("record");
          }}
        />
      );
    }
    if (screen === "card") {
      return (
        <RunRecordCardPage
          summary={runSummary}
          onBack={() => setScreen("finished")}
          onClose={onBack}
          onShare={onShareCard}
          onSave={onSaveCard}
        />
      );
    }
    return (
      <RecordPage
        onGuideOpen={() => setScreen("guide")}
        onStart={() => {
          setRunSummary(null);
          setScreen("countdown");
        }}
        onChatbot={onChatbot}
        onNavigate={onNavigate}
        onMusicOpen={() => setScreen("music")}
        musicConnected={musicConnected}
      />
    );
  })();

  return (
    <RecordMusicContext.Provider value={music}>
      {content}
      {/* 풀재생 — 유튜브 임베드(숨김·소리만). 러닝 중에만 소리,
          러닝 종료·기록 탭 이탈 시 언마운트=정지 */}
      {musicActive && song?.videoId && (
        <div className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0" aria-hidden>
          <iframe
            key={`${song.id}-${musicKey}`}
            src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1`}
            title={song.title}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </RecordMusicContext.Provider>
  );
}
