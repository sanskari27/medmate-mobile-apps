import { parseAddressList, parseAddressResponse } from './address.schema';

function record(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'address-1',
    label: 'home',
    line1: 'Flat 302',
    line2: '7th Cross',
    landmark: null,
    city: 'Bengaluru',
    pincode: '560011',
    latitude: 12.9716,
    longitude: 77.5946,
    receiverName: 'Priya',
    receiverPhone: '+919845012345',
    callOnArrival: true,
    leaveWithSecurity: false,
    dontRingBell: false,
    liftNotWorking: false,
    riderNote: null,
    selected: true,
    createdAt: '2026-11-26T03:00:00Z',
    updatedAt: '2026-11-26T03:00:00Z',
    ...overrides,
  };
}

describe('address schema', () => {
  it('reads a list and one address', () => {
    const home = record();
    const work = record({ id: 'address-2', label: 'work', landmark: 'Temple', riderNote: 'Ring' });
    const other = record({
      id: 'address-3',
      label: 'other',
      latitude: 12.93,
      longitude: 77.58,
      selected: false,
    });
    expect(parseAddressList({ addresses: [home, work, other] })).toEqual([
      expect.objectContaining({
        label: 'home',
        landmark: null,
        latitude: 12.9716,
        longitude: 77.5946,
      }),
      expect.objectContaining({ label: 'work', landmark: 'Temple', riderNote: 'Ring' }),
      expect.objectContaining({
        label: 'other',
        latitude: 12.93,
        longitude: 77.58,
        selected: false,
      }),
    ]);
    expect(parseAddressResponse({ address: home }).id).toBe('address-1');
  });

  it('rejects a payload that is not an address', () => {
    expect(() => parseAddressList(null)).toThrow('Address was not accepted');
    expect(() => parseAddressList([])).toThrow('Address was not accepted');
    expect(() => parseAddressList({})).toThrow('Address was not accepted');
    expect(() => parseAddressList({ addresses: 'no' })).toThrow('Address was not accepted');
    expect(() => parseAddressList({ addresses: [null] })).toThrow('Address was not accepted');
    expect(() => parseAddressList({ addresses: [[]] })).toThrow('Address was not accepted');
    expect(() => parseAddressResponse(null)).toThrow('Address was not accepted');
    expect(() => parseAddressResponse({})).toThrow('Address was not accepted');
    expect(() => parseAddressList({ addresses: [record({ label: 'shop' })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ id: '' })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ line1: 1 })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ landmark: 1 })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ latitude: null })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ latitude: 'north' })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ latitude: Number.NaN })] })).toThrow(
      'Address was not accepted',
    );
    expect(() => parseAddressList({ addresses: [record({ callOnArrival: 'yes' })] })).toThrow(
      'Address was not accepted',
    );
  });
});
