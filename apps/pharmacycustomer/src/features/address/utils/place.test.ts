import { readPlace } from './place';

function response(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('place lookup', () => {
  it('reads a city and a 6-digit pincode from the map', async () => {
    const fetchImpl = jest.fn(async () => response({ address: { city: ' Bengaluru ', postcode: '560 011' } }));
    await expect(readPlace(12.97, 77.59, fetchImpl)).resolves.toEqual({
      city: 'Bengaluru',
      pincode: '560011',
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=12.97&lon=77.59',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Medmate pharmacycustomer',
        },
      },
    );
  });

  it('uses the global fetch and falls back through locality names', async () => {
    const fetchImpl = jest.fn(async () =>
      response({ address: { city: 1, town: '  ', village: ' Mysuru ', postcode: '570001' } }),
    );
    const previous = global.fetch;
    global.fetch = fetchImpl as typeof fetch;
    try {
      await expect(readPlace(12.3, 76.6)).resolves.toEqual({ city: 'Mysuru', pincode: '570001' });
    } finally {
      global.fetch = previous;
    }
  });

  it('names Bengaluru when a 560 pincode has no locality', async () => {
    const fetchImpl = jest.fn(async () => response({ address: { postcode: '560001' } }));
    await expect(readPlace(12.97, 77.59, fetchImpl)).resolves.toEqual({
      city: 'Bengaluru',
      pincode: '560001',
    });
  });

  it('returns nothing when the spot cannot be read', async () => {
    await expect(
      readPlace(1, 2, jest.fn(async () => response({ address: { postcode: '400001' } }))),
    ).resolves.toBeNull();
    await expect(
      readPlace(1, 2, jest.fn(async () => response({ address: { city: 'Pune', postcode: '4110011' } }))),
    ).resolves.toBeNull();
    await expect(
      readPlace(1, 2, jest.fn(async () => response({ address: { city: 'Pune', postcode: 411001 } }))),
    ).resolves.toBeNull();
    await expect(readPlace(1, 2, jest.fn(async () => response(null)))).resolves.toBeNull();
    await expect(readPlace(1, 2, jest.fn(async () => response([])))).resolves.toBeNull();
    await expect(readPlace(1, 2, jest.fn(async () => response(1)))).resolves.toBeNull();
    await expect(
      readPlace(1, 2, jest.fn(async () => response({ address: null }))),
    ).resolves.toBeNull();
    await expect(
      readPlace(1, 2, jest.fn(async () => response({ address: [] }))),
    ).resolves.toBeNull();
    await expect(readPlace(1, 2, jest.fn(async () => response({}, false)))).resolves.toBeNull();
    await expect(
      readPlace(
        1,
        2,
        jest.fn(async () => {
          throw new Error('offline');
        }),
      ),
    ).resolves.toBeNull();
    await expect(
      readPlace(
        1,
        2,
        jest.fn(async () => {
          return {
            ok: true,
            json: async () => {
              throw new Error('bad json');
            },
          } as Response;
        }),
      ),
    ).resolves.toBeNull();
  });
});
