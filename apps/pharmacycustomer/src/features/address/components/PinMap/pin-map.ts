import type { AddressPin } from '../../types/address';

export const BENGALURU_PIN: AddressPin = { latitude: 12.9716, longitude: 77.5946 };

export const pinMapTestId = 'pin-map';

type MapHandle = {
  injectJavaScript: (script: string) => void;
};

export function pinMapHtml(latitude: number, longitude: number): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { margin: 0; height: 100%; width: 100%; background: #e7efe9; }
  .leaflet-control-attribution { display: none !important; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${latitude}, ${longitude}], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);
  let userGesture = false;
  map.on('dragstart', function () { userGesture = true; });
  map.on('zoomstart', function (event) {
    if (event.originalEvent) userGesture = true;
  });
  map.on('moveend', function () {
    if (!userGesture) return;
    userGesture = false;
    const center = map.getCenter();
    window.ReactNativeWebView.postMessage(JSON.stringify({
      latitude: center.lat,
      longitude: center.lng
    }));
  });
  window.setPin = function (lat, lng) {
    userGesture = false;
    map.setView([lat, lng], map.getZoom(), { animate: false });
  };
</script>
</body>
</html>`;
}

export function setPinScript(latitude: number, longitude: number): string {
  return `window.setPin(${latitude}, ${longitude}); true;`;
}

export function recenterMap(map: MapHandle | null, latitude: number, longitude: number): void {
  if (!map) return;
  map.injectJavaScript(setPinScript(latitude, longitude));
}

export function readPinMessage(data: string): AddressPin | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;
  const { latitude, longitude } = parsed;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
