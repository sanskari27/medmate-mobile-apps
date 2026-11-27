import { createMemorySessionStore } from '../../../services/storage/session-store';
import { createAppStore } from '../../../store/store';
import { addressFixture } from '../../../../test/address-fixture';
import {
  idleAuthApi,
  idleHomeApi,
  signedInState,
  signedOutState,
  testExtra,
} from '../../../../test/render';
import { initialAddressState } from '../../address/store/address.slice';
import { signOut, verifyOtp } from '../../auth/store/auth.slice';
import type { AppSection, NearbyPharmacy } from '../types/home';
import { initialHomeState, loadHome } from './home.slice';

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

function readyAddress() {
  return {
    ...signedInState(),
    address: {
      ...initialAddressState,
      status: 'ready' as const,
      items: [
        addressFixture({ id: 'other', selected: false, latitude: 1, longitude: 2 }),
        addressFixture({ selected: true, latitude: 12.9716, longitude: 77.5946 }),
      ],
    },
  };
}

describe('home slice', () => {
  it('loads sections and pharmacies for the selected address', async () => {
    const homeApi = idleHomeApi({
      listSections: jest.fn(async () => [section]),
      listNearby: jest.fn(async () => [pharmacy]),
    });
    const store = createAppStore(
      testExtra(idleAuthApi(), createMemorySessionStore(), undefined, homeApi),
      readyAddress(),
    );

    await store.dispatch(loadHome());
    expect(homeApi.listSections).toHaveBeenCalledWith('access');
    expect(homeApi.listNearby).toHaveBeenCalledWith('access', 12.9716, 77.5946);
    expect(store.getState().home).toEqual({
      status: 'ready',
      sections: [section],
      pharmacies: [pharmacy],
      error: null,
    });

    await store.dispatch(verifyOtp('123456'));
    expect(store.getState().home).toEqual(initialHomeState);
    await store.dispatch(loadHome());
    await store.dispatch(signOut());
    expect(store.getState().home.status).toBe('idle');
  });

  it('keeps the failure when the feed or the session is missing', async () => {
    const failing = idleHomeApi({
      listSections: jest.fn(async () => {
        throw new Error('offline');
      }),
    });
    const store = createAppStore(
      testExtra(idleAuthApi(), createMemorySessionStore(), undefined, failing),
      readyAddress(),
    );
    await store.dispatch(loadHome());
    expect(store.getState().home).toMatchObject({ status: 'failed', error: 'offline' });

    failing.listSections = jest.fn(async () => [section]);
    await store.dispatch(loadHome());
    expect(store.getState().home.status).toBe('ready');
    expect(store.getState().home.error).toBeNull();

    store.dispatch(loadHome.rejected(new Error('x'), 'req', undefined));
    expect(store.getState().home.error).toBe('Something went wrong');

    const signedOut = createAppStore(
      testExtra(idleAuthApi(), createMemorySessionStore()),
      signedOutState(),
    );
    await signedOut.dispatch(loadHome());
    expect(signedOut.getState().home.error).toBe('Sign in is required');

    const unselected = createAppStore(testExtra(idleAuthApi(), createMemorySessionStore()), {
      ...signedInState(),
      address: {
        ...initialAddressState,
        items: [addressFixture({ selected: false })],
      },
    });
    await unselected.dispatch(loadHome());
    expect(unselected.getState().home.error).toBe('A delivery address is required');
  });
});
