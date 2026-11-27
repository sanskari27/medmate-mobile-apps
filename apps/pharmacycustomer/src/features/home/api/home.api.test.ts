import type { AppSection, NearbyPharmacy } from '../types/home';
import { createHomeApi } from './home.api';

const section: AppSection = {
  id: 'section-1',
  category: 'Pain',
  position: 0,
  image: { contentType: 'image/jpeg', url: 'https://cdn.example/pain.jpg' },
};

const pharmacy: NearbyPharmacy = {
  pharmacyId: 'pharmacy-1',
  name: 'Apollo',
  address: '12 MG Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  latitude: 12.97,
  longitude: 77.59,
  distanceKm: 1.2,
  acceptOnlineOrders: true,
};

function json(status: number, body: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe('createHomeApi', () => {
  it('loads sections and nearby pharmacies with the customer token', async () => {
    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/api/v1/customer/app-sections')) return json(200, { sections: [section] });
      return json(200, { pharmacies: [pharmacy] });
    }) as jest.MockedFunction<typeof fetch>;
    const api = createHomeApi('http://127.0.0.1:8080', fetchImpl);

    await expect(api.listSections('token')).resolves.toEqual([section]);
    await expect(api.listNearby('token', 12.9716, 77.5946)).resolves.toEqual([pharmacy]);
    expect(String(fetchImpl.mock.calls[0]?.[0])).toBe(
      'http://127.0.0.1:8080/api/v1/customer/app-sections',
    );
    expect(String(fetchImpl.mock.calls[1]?.[0])).toBe(
      'http://127.0.0.1:8080/api/v1/customer/pharmacies/nearby?latitude=12.9716&longitude=77.5946',
    );
    expect(fetchImpl.mock.calls[0]?.[1]).toMatchObject({
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
    });
  });

  it('rejects a body the home feed cannot read', async () => {
    const fetchImpl = jest.fn(async (_input: RequestInfo | URL) => json(200, {})) as jest.MockedFunction<
      typeof fetch
    >;
    const api = createHomeApi('http://127.0.0.1:8080/', fetchImpl);
    await expect(api.listSections('token')).rejects.toThrow('Home could not be read');
    await expect(api.listNearby('token', 1, 2)).rejects.toThrow('Home could not be read');
  });
});
