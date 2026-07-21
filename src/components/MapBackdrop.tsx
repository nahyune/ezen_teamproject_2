import { useEffect, useRef } from "react";

// 서울 시청(광화문 인근) 좌표 — 기본 배경 지도 중심
const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 };

type MapPoint = { lat: number; lng: number };
type MarkerVariant = "kakao" | "orange";

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;
const CENTER_PAN_INTERVAL_MS = 450;

declare global {
  interface Window {
    // 카카오맵 SDK — 별도 타입 패키지 없이 any 로 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

let sdkPromise: Promise<void> | null = null;
function loadKakaoSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps) return resolve();
    if (!KAKAO_KEY) return reject(new Error("VITE_KAKAO_MAP_KEY 가 설정되지 않았습니다"));
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => resolve());
    script.onerror = () => reject(new Error("카카오맵 SDK 로드 실패"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

function createOrangeMarker() {
  const marker = document.createElement("span");
  marker.style.cssText = [
    "display:block",
    "width:24px",
    "height:24px",
    "border-radius:9999px",
    "background:rgba(217,217,217,0.7)",
    "position:relative",
    "box-shadow:0 2px 8px rgba(0,0,0,0.25)",
  ].join(";");

  const core = document.createElement("span");
  core.style.cssText = [
    "position:absolute",
    "inset:3px",
    "border-radius:9999px",
    "background:#ff4e16",
  ].join(";");
  marker.appendChild(core);
  return marker;
}

function getPathLength(path: MapPoint[]) {
  return path.slice(1).reduce((total, point, index) => {
    const prev = path[index];
    return total + Math.hypot(point.lat - prev.lat, point.lng - prev.lng);
  }, 0);
}

function getPointOnPath(path: MapPoint[], targetDistance: number) {
  let travelled = 0;
  for (let index = 1; index < path.length; index += 1) {
    const start = path[index - 1];
    const end = path[index];
    const segmentLength = Math.hypot(end.lat - start.lat, end.lng - start.lng);
    if (travelled + segmentLength >= targetDistance) {
      const ratio = segmentLength === 0 ? 0 : (targetDistance - travelled) / segmentLength;
      return {
        lat: start.lat + (end.lat - start.lat) * ratio,
        lng: start.lng + (end.lng - start.lng) * ratio,
      };
    }
    travelled += segmentLength;
  }
  return path[path.length - 1];
}

function getPathUntil(path: MapPoint[], targetDistance: number) {
  if (path.length === 0) return [];

  const visiblePath = [path[0]];
  let travelled = 0;
  for (let index = 1; index < path.length; index += 1) {
    const start = path[index - 1];
    const end = path[index];
    const segmentLength = Math.hypot(end.lat - start.lat, end.lng - start.lng);
    if (travelled + segmentLength >= targetDistance) {
      visiblePath.push(getPointOnPath([start, end], targetDistance - travelled));
      return visiblePath;
    }
    visiblePath.push(end);
    travelled += segmentLength;
  }

  return visiblePath;
}

export default function MapBackdrop({
  center = SEOUL_CENTER,
  level = 5,
  interactive = false,
  markerPosition,
  markerVariant = "kakao",
  markerAnimated = false,
  markerFollowsCenter = false,
  markerPath,
  markerPathDurationMs = 9000,
  showTraveledPath = false,
  showRoutePreview = true,
  traveledPathProgress,
  fitPathBounds = false,
}: {
  center?: MapPoint;
  level?: number;
  interactive?: boolean;
  markerPosition?: MapPoint;
  markerVariant?: MarkerVariant;
  markerAnimated?: boolean;
  markerFollowsCenter?: boolean;
  markerPath?: MapPoint[];
  markerPathDurationMs?: number;
  showTraveledPath?: boolean;
  showRoutePreview?: boolean;
  traveledPathProgress?: number;
  fitPathBounds?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let animationFrame = 0;
    let panTimer = 0;

    loadKakaoSdk()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.replaceChildren();
        const { kakao } = window;
        const path = markerPath && markerPath.length > 0 ? markerPath : markerPosition ? [markerPosition] : [];
        const pathLength = path.length > 1 ? getPathLength(path) : 0;
        const staticProgress =
          typeof traveledPathProgress === "number" ? Math.max(0, Math.min(1, traveledPathProgress)) : null;
        const staticDistance = staticProgress !== null ? staticProgress * pathLength : 0;
        const startPoint = path[0] ?? markerPosition ?? center;
        const initialMarkerPoint =
          staticProgress !== null && path.length > 1
            ? getPointOnPath(path, staticDistance)
            : markerPosition ?? startPoint;
        const initialMapPoint = markerFollowsCenter ? initialMarkerPoint : center;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(initialMapPoint.lat, initialMapPoint.lng),
          level,
        });
        if (fitPathBounds && path.length > 0) {
          const visiblePath =
            staticProgress !== null && path.length > 1
              ? getPathUntil(path, staticDistance)
              : path;
          if (visiblePath.length > 1) {
            const bounds = new kakao.maps.LatLngBounds();
            visiblePath.forEach((point) => bounds.extend(new kakao.maps.LatLng(point.lat, point.lng)));
            map.setBounds(bounds, 42, 42, 42, 42);
          } else {
            const point = visiblePath[0];
            map.setCenter(new kakao.maps.LatLng(point.lat, point.lng));
          }
        }
        if (showTraveledPath && showRoutePreview && path.length > 1) {
          new kakao.maps.Polyline({
            map,
            path: path.map((point) => new kakao.maps.LatLng(point.lat, point.lng)),
            strokeWeight: 6,
            strokeColor: "#ff9b72",
            strokeOpacity: 0.42,
            strokeStyle: "solid",
          });
        }

        const traveledLine =
          showTraveledPath && path.length > 1
            ? new kakao.maps.Polyline({
                map,
                path: getPathUntil(path, staticDistance).map((point) => new kakao.maps.LatLng(point.lat, point.lng)),
                strokeWeight: 6,
                strokeColor: "#ff6a2a",
                strokeOpacity: 0.95,
                strokeStyle: "solid",
              })
            : null;

        if (markerFollowsCenter) {
          if (markerAnimated && path.length > 1) {
            const startedAt = performance.now();
            // 추적 모드: 지도가 내 위치(화면 중앙 고정 점)를 따라 계속 흐른다.
            // 러닝 중엔 드래그·줌을 잠가서(아래 setDraggable/Zoomable=false)
            // 자동 추적과 충돌하지 않게 한다 — 실제 러닝앱과 동일한 UX.
            const moveCenter = () => {
              if (cancelled) return;
              const progress =
                ((staticProgress ?? 0) + ((performance.now() - startedAt) % markerPathDurationMs) / markerPathDurationMs) % 1;
              const traveledDistance = progress * pathLength;
              const nextPoint = getPointOnPath(path, traveledDistance);
              if (traveledLine) {
                traveledLine.setPath(
                  getPathUntil(path, traveledDistance).map((point) => new kakao.maps.LatLng(point.lat, point.lng)),
                );
              }
              map.panTo(new kakao.maps.LatLng(nextPoint.lat, nextPoint.lng));
            };

            panTimer = window.setInterval(moveCenter, CENTER_PAN_INTERVAL_MS);
            moveCenter();
          }
        } else if (path.length > 0) {
          const marker =
            markerVariant === "orange"
              ? new kakao.maps.CustomOverlay({
                  map,
                  position: new kakao.maps.LatLng(initialMarkerPoint.lat, initialMarkerPoint.lng),
                  content: createOrangeMarker(),
                  xAnchor: 0.5,
                  yAnchor: 0.5,
                })
              : new kakao.maps.Marker({ map, position: new kakao.maps.LatLng(initialMarkerPoint.lat, initialMarkerPoint.lng) });

          const setMarkerPosition = (point: MapPoint) => {
            marker.setPosition(new kakao.maps.LatLng(point.lat, point.lng));
          };

          if (markerAnimated && path.length > 1) {
            const pathLength = getPathLength(path);
            const startedAt = performance.now();
            const animate = (now: number) => {
              if (cancelled) return;
              const progress =
                ((staticProgress ?? 0) + ((now - startedAt) % markerPathDurationMs) / markerPathDurationMs) % 1;
              const traveledDistance = progress * pathLength;
              setMarkerPosition(getPointOnPath(path, traveledDistance));
              if (traveledLine) {
                traveledLine.setPath(
                  getPathUntil(path, traveledDistance).map((point) => new kakao.maps.LatLng(point.lat, point.lng)),
                );
              }
              animationFrame = requestAnimationFrame(animate);
            };
            animationFrame = requestAnimationFrame(animate);
          }
        }

        // ⚠️ 추적 모드에서 map.setDraggable(false) 를 주면 카카오에선 프로그램 이동
        //    (panTo) 까지 멈춰 "자동 달리기"가 죽는다. 그래서 드래그는 켜 두고,
        //    사용자 조작만 아래 투명 오버레이(return)로 차단한다.
        map.setDraggable(interactive);
        map.setZoomable(interactive);
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (panTimer) window.clearInterval(panTimer);
      containerRef.current?.replaceChildren();
    };
  }, [
    center,
    interactive,
    level,
    markerPosition,
    markerVariant,
    markerAnimated,
    markerFollowsCenter,
    markerPath,
    markerPathDurationMs,
    showTraveledPath,
    showRoutePreview,
    traveledPathProgress,
    fitPathBounds,
  ]);

  return (
    <div className="relative size-full isolate" aria-hidden>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ maskImage: "linear-gradient(#000,#000)", WebkitMaskImage: "linear-gradient(#000,#000)" }}
      />
      {/* 러닝 추적 지도: 사용자 드래그·줌만 차단하는 투명 막.
          (map.setDraggable(false) 대신 이걸 써야 자동 달리기 panTo 가 살아있다.
           상단 UI 버튼들은 MapBackdrop 밖 상위 요소라 이 막에 안 가려진다.) */}
      {markerFollowsCenter && interactive ? (
        <div className="absolute inset-0" aria-hidden />
      ) : null}
      {markerFollowsCenter && markerVariant === "orange" ? (
        <span className="pointer-events-none absolute top-1/2 left-1/2 z-10 block size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9d9d9]/70 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          <span className="absolute inset-[3px] rounded-full bg-primary-orange" />
        </span>
      ) : null}
    </div>
  );
}
