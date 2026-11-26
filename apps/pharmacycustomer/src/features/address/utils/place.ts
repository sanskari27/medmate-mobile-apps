export type MapPlace = {
  city: string;
  pincode: string;
};

const reverseUrl = 'https://nominatim.openstreetmap.org/reverse';

const cityKeys = [
  'city',
  'town',
  'village',
  'municipality',
  'city_district',
  'county',
  'state_district',
] as const;

export async function readPlace(
  latitude: number,
  longitude: number,
  fetchImpl: typeof fetch = fetch,
): Promise<MapPlace | null> {
  try {
    const response = await fetchImpl(
      `${reverseUrl}?format=jsonv2&addressdetails=1&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Medmate pharmacycustomer',
        },
      },
    );
    if (!response.ok) return null;
    return mapPlace(await response.json());
  } catch {
    return null;
  }
}

function mapPlace(payload: unknown): MapPlace | null {
  if (!isRecord(payload) || !isRecord(payload.address)) return null;
  const pincode = readPincode(payload.address.postcode);
  if (!pincode) return null;
  const city = readCity(payload.address) ?? (pincode.startsWith('560') ? 'Bengaluru' : null);
  if (!city) return null;
  return { city, pincode };
}

function readCity(address: Record<string, unknown>): string | null {
  for (const key of cityKeys) {
    const value = address[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function readPincode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const digits = value.replace(/\D/g, '');
  if (!/^\d{6}$/.test(digits)) return null;
  return digits;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
