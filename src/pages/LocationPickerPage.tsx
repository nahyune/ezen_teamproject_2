import { useMemo, useState } from "react";
import mapImage from "../assets/img/popular-course-detail-map.webp";
import { BackButton } from "../components/Icons";

type LocationItem = { name: string; address: string; x: number; y: number };

const locations: LocationItem[] = [
  { name: "여의도 한강공원", address: "서울 영등포구 여의동로 330", x: 24, y: 58 },
  { name: "여의도공원", address: "서울 영등포구 여의공원로 68", x: 47, y: 42 },
  { name: "한강 러너스 크루", address: "서울 영등포구 여의도동", x: 68, y: 61 },
  { name: "반포한강공원", address: "서울 서초구 신반포로11길 40", x: 78, y: 33 },
  { name: "서울숲", address: "서울 성동구 뚝섬로 273", x: 60, y: 76 },
  { name: "올림픽공원", address: "서울 송파구 올림픽로 424", x: 83, y: 70 },
  { name: "석촌호수", address: "서울 송파구 잠실동", x: 36, y: 75 },
  { name: "경복궁", address: "서울 종로구 사직로 161", x: 36, y: 24 },
];

type Props = { onBack: () => void; onSelect: (location: string) => void };

export default function LocationPickerPage({ onBack, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return locations;
    return locations.filter((item) => `${item.name} ${item.address}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="phone flex min-h-full flex-col bg-[var(--bg-app)] text-white">
      <header className="subheader">
        <BackButton onClick={onBack} />
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-semibold leading-none">위치 추가</h1>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="px-[var(--gutter)] pb-3 pt-2">
          <label className="flex h-[46px] items-center gap-2.5 rounded-[8px] bg-[#1c1c1f] px-3.5">
            <svg className="h-[18px] w-[18px] flex-none text-white/55" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="장소 검색" className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-white outline-none placeholder:text-white/40" />
          </label>
        </div>

        <div className="relative h-[250px] flex-none overflow-hidden border-y border-white/10 bg-[#d9dfd2]">
          <img src={mapImage} alt="위치 선택 지도" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-black/5" />
          {locations.slice(0, 6).map((item) => (
            <button key={item.name} type="button" className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => onSelect(item.name)} aria-label={`${item.name} 선택`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black/80 text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="10" r="1.8" fill="currentColor" />
                </svg>
              </span>
            </button>
          ))}
          <button type="button" className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]" onClick={() => onSelect("현재 위치")} aria-label="현재 위치 선택">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <section className="min-h-0 flex-1 overflow-y-auto px-[var(--gutter)]">
          <h2 className="pb-2 pt-4 text-[15px] font-medium text-white">{query ? "검색 결과" : "주변 위치"}</h2>
          {results.length > 0 ? results.map((item) => (
            <button key={item.name} type="button" className="flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left" onClick={() => onSelect(item.name)}>
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/8 text-white/70">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-[14px] font-medium text-white">{item.name}</strong>
                <span className="mt-1 block truncate text-[12px] font-normal text-white/45">{item.address}</span>
              </span>
            </button>
          )) : <p className="py-10 text-center text-[13px] font-normal text-white/40">검색 결과가 없습니다.</p>}
        </section>
      </main>
    </div>
  );
}
