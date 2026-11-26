import { addressFixture } from '../../../../test/address-fixture';
import { createAddressApi } from './address.api';
import type { AddressInput } from '../types/address';

const input: AddressInput = {
  label: 'home',
  line1: 'Flat 302',
  line2: '7th Cross',
  landmark: null,
  city: 'Bengaluru',
  pincode: '560011',
  latitude: null,
  longitude: null,
  receiverName: 'Priya',
  receiverPhone: '+919845012345',
  callOnArrival: true,
  leaveWithSecurity: false,
  dontRingBell: false,
  liftNotWorking: false,
  riderNote: null,
  selected: true,
};

function json(status: number, body: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe('createAddressApi', () => {
  it('lists, creates, updates, and selects with the customer token', async () => {
    const saved = addressFixture({ selected: true });
    const fetchImpl = jest.fn(async (inputUrl: RequestInfo | URL, init?: RequestInit) => {
      const url = String(inputUrl);
      if (url.endsWith('/addresses') && init?.method === 'GET') {
        return json(200, { addresses: [saved] });
      }
      if (url.endsWith('/addresses') && init?.method === 'POST') return json(201, { address: saved });
      if (url.endsWith('/addresses/address-1') && init?.method === 'PATCH') {
        return json(200, { address: saved });
      }
      return json(200, { address: { ...saved, selected: true } });
    }) as jest.MockedFunction<typeof fetch>;
    const api = createAddressApi('http://127.0.0.1:8080', fetchImpl);

    await expect(api.list('token')).resolves.toEqual([saved]);
    await expect(api.create('token', input)).resolves.toEqual(saved);
    await expect(api.update('token', 'address-1', input)).resolves.toEqual(saved);
    await expect(api.select('token', 'address-1')).resolves.toMatchObject({ selected: true });
    expect(fetchImpl.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer token',
    });
  });
});
