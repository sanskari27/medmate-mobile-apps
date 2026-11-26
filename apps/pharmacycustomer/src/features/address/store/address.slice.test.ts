import { ApiError } from '../../../services/api/problem';
import { createMemorySessionStore } from '../../../services/storage/session-store';
import { createAppStore } from '../../../store/store';
import { addressFixture } from '../../../../test/address-fixture';
import { idleAddressApi, idleAuthApi, signedInState, testExtra } from '../../../../test/render';
import { phoneChanged, signOut, termsAccepted, verifyOtp } from '../../auth/store/auth.slice';
import type { AddressInput } from '../types/address';
import { chooseAddress, loadAddresses, saveAddress } from './address.slice';

const input = {
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
} satisfies AddressInput;

describe('address slice', () => {
  it('loads, saves, and selects addresses for the signed-in customer', async () => {
    const home = addressFixture({ id: 'home', selected: false });
    const work = addressFixture({ id: 'work', label: 'work', selected: true });
    const addressApi = idleAddressApi({
      list: jest.fn(async () => [home]),
      create: jest.fn(async () => work),
      update: jest.fn(async () => ({ ...home, line1: 'Flat 1' })),
      select: jest.fn(async () => ({ ...home, selected: true })),
    });
    const store = createAppStore(
      testExtra(idleAuthApi(), createMemorySessionStore(), addressApi),
      signedInState(),
    );

    await store.dispatch(loadAddresses());
    expect(store.getState().address.status).toBe('ready');
    expect(store.getState().address.items).toEqual([home]);

    store.dispatch(termsAccepted());
    expect(store.getState().address.awaitingPick).toBe(true);
    await store.dispatch(saveAddress({ body: input }));
    expect(addressApi.create).toHaveBeenCalledWith('access', input);
    expect(store.getState().address.items.map((item) => item.id)).toEqual(['work', 'home']);
    expect(store.getState().address.items.find((item) => item.id === 'home')?.selected).toBe(false);
    expect(store.getState().address.awaitingPick).toBe(false);

    store.dispatch(termsAccepted());
    await store.dispatch(saveAddress({ id: 'home', body: { ...input, selected: false } }));
    expect(addressApi.update).toHaveBeenCalledWith('access', 'home', { ...input, selected: false });
    expect(store.getState().address.awaitingPick).toBe(true);

    await store.dispatch(chooseAddress('home'));
    expect(store.getState().address.awaitingPick).toBe(false);
    expect(store.getState().address.items[0]).toMatchObject({ id: 'home', selected: true });
    expect(store.getState().address.items.find((item) => item.id === 'work')?.selected).toBe(false);
  });

  it('keeps the failure and clears addresses when the session changes', async () => {
    const addressApi = idleAddressApi({
      list: jest.fn(async () => {
        throw new ApiError(500, 'Error', 'Addresses could not be loaded');
      }),
      create: jest.fn(async () => {
        throw new Error('offline');
      }),
      select: jest.fn(async () => {
        throw new Error('');
      }),
    });
    const store = createAppStore(
      testExtra(idleAuthApi(), createMemorySessionStore(), addressApi),
      signedInState(),
    );
    await store.dispatch(loadAddresses());
    expect(store.getState().address).toMatchObject({
      status: 'failed',
      error: 'Addresses could not be loaded',
    });

    store.dispatch(loadAddresses.rejected(new Error('x'), 'req', undefined));
    expect(store.getState().address.error).toBe('Something went wrong');

    await store.dispatch(saveAddress({ body: input }));
    expect(store.getState().address.error).toBe('offline');
    store.dispatch(saveAddress.rejected(new Error('x'), 'req', { body: input }));
    expect(store.getState().address.error).toBe('Something went wrong');

    await store.dispatch(chooseAddress('home'));
    expect(store.getState().address.error).toBe('Something went wrong');
    store.dispatch(chooseAddress.rejected(new Error('x'), 'req', 'home'));
    expect(store.getState().address.error).toBe('Something went wrong');

    const bareApi = idleAddressApi();
    const bare = createAppStore(testExtra(idleAuthApi(), createMemorySessionStore(), bareApi));
    await bare.dispatch(loadAddresses());
    expect(bare.getState().address.error).toBe('Sign in is required');
    await bare.dispatch(saveAddress({ body: input }));
    await bare.dispatch(chooseAddress('home'));
    expect(bareApi.create).not.toHaveBeenCalled();
    expect(bareApi.select).not.toHaveBeenCalled();

    store.dispatch(phoneChanged('9876543210'));
    await store.dispatch(verifyOtp('123456'));
    expect(store.getState().address).toMatchObject({ status: 'idle', items: [] });
    await store.dispatch(loadAddresses());
    await store.dispatch(signOut());
    expect(store.getState().address.status).toBe('idle');
  });
});
