import type { Address } from '../src/features/address/types/address';

export function addressFixture(overrides: Partial<Address> = {}): Address {
  return {
    id: 'address-1',
    label: 'home',
    line1: 'Flat 302, Sri Sai Residency',
    line2: '7th Cross, Jayanagar 4th Block',
    landmark: 'Near Cool Joint',
    city: 'Bengaluru',
    pincode: '560011',
    latitude: 12.9716,
    longitude: 77.5946,
    receiverName: 'Priya Sharma',
    receiverPhone: '+919845012345',
    callOnArrival: true,
    leaveWithSecurity: false,
    dontRingBell: false,
    liftNotWorking: false,
    riderNote: null,
    selected: false,
    createdAt: '2026-11-26T03:00:00Z',
    updatedAt: '2026-11-26T03:00:00Z',
    ...overrides,
  };
}
