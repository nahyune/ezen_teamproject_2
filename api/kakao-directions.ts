// Vercel 서버리스 함수 — 카카오 Mobility Directions 프록시.
// 도로 경로 좌표(roads.vertexes)를 서버에서 받아 프론트에는 좌표 배열만 내려준다.
export const config = { runtime: "edge" };

type MapPoint = { lat: number; lng: number };
type DirectionRequest = {
  origin: MapPoint;
  destination: MapPoint;
  waypoints?: MapPoint[];
};
type KakaoRoad = { vertexes?: number[] };
type KakaoSection = { roads?: KakaoRoad[] };
type KakaoRoute = { sections?: KakaoSection[] };
type KakaoDirectionsResponse = { routes?: KakaoRoute[]; msg?: string; message?: string };

const env =
  (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process
    ?.env ?? {};

function validPoint(point: unknown): point is MapPoint {
  if (!point || typeof point !== "object") return false;
  const { lat, lng } = point as Record<string, unknown>;
  return typeof lat === "number" && Number.isFinite(lat) && typeof lng === "number" && Number.isFinite(lng);
}

function toLngLat(point: MapPoint) {
  return `${point.lng},${point.lat}`;
}

function extractPath(data: KakaoDirectionsResponse): MapPoint[] {
  const roads = data.routes?.[0]?.sections?.flatMap((section) => section.roads ?? []) ?? [];
  const path: MapPoint[] = [];

  for (const road of roads) {
    const vertexes = road.vertexes ?? [];
    for (let index = 0; index < vertexes.length - 1; index += 2) {
      const lng = vertexes[index];
      const lat = vertexes[index + 1];
      if (typeof lat === "number" && typeof lng === "number") path.push({ lat, lng });
    }
  }

  return path;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = env.KAKAO_REST_API_KEY ?? env.KAKAO_REST_KEY;
  if (!apiKey) {
    return Response.json({ error: "KAKAO_REST_API_KEY not set on server" }, { status: 500 });
  }

  let body: DirectionRequest;
  try {
    body = (await req.json()) as DirectionRequest;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!validPoint(body.origin) || !validPoint(body.destination)) {
    return Response.json({ error: "origin and destination are required" }, { status: 400 });
  }
  if (body.waypoints && !body.waypoints.every(validPoint)) {
    return Response.json({ error: "invalid waypoints" }, { status: 400 });
  }

  const params = new URLSearchParams({
    origin: toLngLat(body.origin),
    destination: toLngLat(body.destination),
    priority: "DISTANCE",
    summary: "false",
  });
  if (body.waypoints?.length) {
    params.set("waypoints", body.waypoints.map(toLngLat).join("|"));
  }

  try {
    const kakaoRes = await fetch(`https://apis-navi.kakaomobility.com/v1/directions?${params}`, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    });
    const data = (await kakaoRes.json()) as KakaoDirectionsResponse;
    if (!kakaoRes.ok) {
      return Response.json(
        { error: data.msg ?? data.message ?? "Kakao directions request failed" },
        { status: kakaoRes.status },
      );
    }

    const path = extractPath(data);
    if (path.length < 2) {
      return Response.json({ error: "Kakao directions returned no road vertexes" }, { status: 502 });
    }

    return Response.json({ path });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
