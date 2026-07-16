export type RoutePoint = { lat: number; lng: number };

export const NODULSEOM_CENTER: RoutePoint = { lat: 37.51890, lng: 126.95870 };
export const NODULSEOM_DISTANCE_M = 1500;

// Nodulseom outer loop from OpenStreetMap's island outline, ordered to match
// the reference map: start on the north side, loop around the west head, run
// along the south edge to the southeast tail, then return along the north edge.
export const NODULSEOM_PATH: RoutePoint[] = [
  { lat: 37.5188938, lng: 126.9573709 },
  { lat: 37.5191636, lng: 126.9558598 },
  { lat: 37.5191678, lng: 126.9557095 },
  { lat: 37.5191530, lng: 126.9555513 },
  { lat: 37.5191313, lng: 126.9554232 },
  { lat: 37.5190833, lng: 126.9552863 },
  { lat: 37.5189838, lng: 126.9550957 },
  { lat: 37.5189296, lng: 126.9550166 },
  { lat: 37.5188594, lng: 126.9549468 },
  { lat: 37.5187658, lng: 126.9548972 },
  { lat: 37.5186669, lng: 126.9548597 },
  { lat: 37.5185988, lng: 126.9548503 },
  { lat: 37.5185254, lng: 126.9548512 },
  { lat: 37.5184179, lng: 126.9548690 },
  { lat: 37.5183084, lng: 126.9548995 },
  { lat: 37.5182148, lng: 126.9549371 },
  { lat: 37.5181300, lng: 126.9549938 },
  { lat: 37.5180200, lng: 126.9551107 },
  { lat: 37.5179499, lng: 126.9552177 },
  { lat: 37.5178786, lng: 126.9553430 },
  { lat: 37.5166028, lng: 126.9583817 },
  { lat: 37.5162362, lng: 126.9598585 },
  { lat: 37.5160766, lng: 126.9604594 },
  { lat: 37.5160447, lng: 126.9606632 },
  { lat: 37.5160320, lng: 126.9607933 },
  { lat: 37.5160490, lng: 126.9614169 },
  { lat: 37.5160628, lng: 126.9620834 },
  { lat: 37.5160905, lng: 126.9622162 },
  { lat: 37.5161447, lng: 126.9623141 },
  { lat: 37.5162351, lng: 126.9624375 },
  { lat: 37.5162979, lng: 126.9624844 },
  { lat: 37.5163745, lng: 126.9625193 },
  { lat: 37.5164766, lng: 126.9625421 },
  { lat: 37.5165617, lng: 126.9625331 },
  { lat: 37.5166706, lng: 126.9624695 },
  { lat: 37.5167979, lng: 126.9623584 },
  { lat: 37.5169787, lng: 126.9621599 },
  { lat: 37.5170978, lng: 126.9619802 },
  { lat: 37.5173042, lng: 126.9615859 },
  { lat: 37.5178153, lng: 126.9604766 },
  { lat: 37.5182191, lng: 126.9594927 },
  { lat: 37.5188938, lng: 126.9573709 },
];
