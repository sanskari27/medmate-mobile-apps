import { parseAppSections, parseNearbyPharmacies } from './home.schema';

const rejected = 'Home could not be read';

function section(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'section-1',
    category: 'Pain',
    position: 0,
    image: { contentType: 'image/jpeg', url: 'https://cdn.example/pain.jpg' },
    ...overrides,
  };
}

function pharmacy(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
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
    ...overrides,
  };
}

describe('home schema', () => {
  it('reads category tiles and nearby pharmacies', () => {
    expect(
      parseAppSections({ sections: [section(), section({ id: 'section-2', position: 2 })] }),
    ).toEqual([
      {
        id: 'section-1',
        category: 'Pain',
        position: 0,
        image: { contentType: 'image/jpeg', url: 'https://cdn.example/pain.jpg' },
      },
      {
        id: 'section-2',
        category: 'Pain',
        position: 2,
        image: { contentType: 'image/jpeg', url: 'https://cdn.example/pain.jpg' },
      },
    ]);
    expect(
      parseNearbyPharmacies({
        pharmacies: [
          pharmacy(),
          pharmacy({
            pharmacyId: 'pharmacy-2',
            name: null,
            address: '',
            city: null,
            state: null,
            pincode: null,
            latitude: 0,
            longitude: 0,
            distanceKm: 0,
            acceptOnlineOrders: false,
          }),
        ],
      }),
    ).toEqual([
      expect.objectContaining({
        pharmacyId: 'pharmacy-1',
        name: 'Apollo',
        distanceKm: 1.2,
        acceptOnlineOrders: true,
      }),
      expect.objectContaining({
        pharmacyId: 'pharmacy-2',
        name: null,
        address: '',
        city: null,
        distanceKm: 0,
        acceptOnlineOrders: false,
      }),
    ]);
  });

  it('rejects a payload that is not the home feed', () => {
    expect(() => parseAppSections(null)).toThrow(rejected);
    expect(() => parseAppSections([])).toThrow(rejected);
    expect(() => parseAppSections({})).toThrow(rejected);
    expect(() => parseAppSections({ sections: [null] })).toThrow(rejected);
    expect(() => parseAppSections({ sections: [section({ id: '' })] })).toThrow(rejected);
    expect(() => parseAppSections({ sections: [section({ category: 1 })] })).toThrow(rejected);
    expect(() => parseAppSections({ sections: [section({ position: '1' })] })).toThrow(rejected);
    expect(() => parseAppSections({ sections: [section({ position: 1.5 })] })).toThrow(rejected);
    expect(() => parseAppSections({ sections: [section({ position: -1 })] })).toThrow(rejected);
    expect(() => parseAppSections({ sections: [section({ image: null })] })).toThrow(rejected);
    expect(() =>
      parseAppSections({
        sections: [section({ image: { contentType: '', url: 'https://cdn.example/a.jpg' } })],
      }),
    ).toThrow(rejected);
    expect(() =>
      parseAppSections({ sections: [section({ image: { contentType: 'image/jpeg', url: '' } })] }),
    ).toThrow(rejected);

    expect(() => parseNearbyPharmacies(null)).toThrow(rejected);
    expect(() => parseNearbyPharmacies({ pharmacies: 'nope' })).toThrow(rejected);
    expect(() => parseNearbyPharmacies({ pharmacies: [null] })).toThrow(rejected);
    expect(() => parseNearbyPharmacies({ pharmacies: [pharmacy({ pharmacyId: 1 })] })).toThrow(
      rejected,
    );
    expect(() => parseNearbyPharmacies({ pharmacies: [pharmacy({ name: 1 })] })).toThrow(rejected);
    expect(() => parseNearbyPharmacies({ pharmacies: [pharmacy({ latitude: '12' })] })).toThrow(
      rejected,
    );
    expect(() =>
      parseNearbyPharmacies({ pharmacies: [pharmacy({ distanceKm: Number.NaN })] }),
    ).toThrow(rejected);
    expect(() =>
      parseNearbyPharmacies({ pharmacies: [pharmacy({ acceptOnlineOrders: 'yes' })] }),
    ).toThrow(rejected);
  });
});
