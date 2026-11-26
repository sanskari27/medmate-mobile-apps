import { ApiError } from '../../../services/api/problem';
import { createMemorySessionStore } from '../../../services/storage/session-store';
import { selectAccountPhone } from '../../../store/selectors/auth.selectors';
import { createAppStore } from '../../../store/store';
import { sessionFixture } from '../../../../test/session-fixture';
import { idleAuthApi, signedInState, testExtra } from '../../../../test/render';
import { pinModeMessage } from '../utils/copy';
import {
  challengeReset,
  initialAuthState,
  phoneChanged,
  restoreSession,
  sendOtp,
  signOut,
  termsAccepted,
  verifyOtp,
} from './auth.slice';

function harness(overrides: Parameters<typeof idleAuthApi>[0] = {}) {
  const sessionStore = createMemorySessionStore();
  const authApi = idleAuthApi(overrides);
  const store = createAppStore(testExtra(authApi, sessionStore));
  return { store, authApi, sessionStore };
}

describe('auth slice', () => {
  it('sends a code for an Indian mobile', async () => {
    const { store, authApi } = harness();
    await store.dispatch(sendOtp());
    expect(authApi.sendOtp).not.toHaveBeenCalled();
    expect(store.getState().auth.error).toBe('Enter an Indian mobile number');

    store.dispatch(phoneChanged('98ab76543210999'));
    expect(store.getState().auth.phone).toBe('9876543210');
    await store.dispatch(sendOtp());
    expect(authApi.sendOtp).toHaveBeenCalledWith('+919876543210');
    expect(store.getState().auth.challenge).toBe('codeSent');

    store.dispatch(challengeReset());
    expect(store.getState().auth.challenge).toBe('idle');
  });

  it('keeps the shopper on the number when the server asks for a PIN or rejects the send', async () => {
    const pin = harness({ sendOtp: jest.fn(async () => 'pin' as const) });
    pin.store.dispatch(phoneChanged('9876543210'));
    await pin.store.dispatch(sendOtp());
    expect(pin.store.getState().auth.error).toBe(pinModeMessage);

    const failed = harness({
      sendOtp: jest.fn(async () => {
        throw new ApiError(503, 'OTP unavailable', 'OTP could not be sent');
      }),
    });
    failed.store.dispatch(phoneChanged('9876543210'));
    await failed.store.dispatch(sendOtp());
    expect(failed.store.getState().auth.error).toBe('OTP could not be sent');
    failed.store.dispatch(sendOtp.rejected(null, 'request', undefined, ''));
    expect(failed.store.getState().auth.error).toBe('Something went wrong');
  });

  it('verifies a 6-digit code and stores the session', async () => {
    const { store, authApi, sessionStore } = harness();
    await store.dispatch(verifyOtp('12'));
    expect(authApi.verifyOtp).not.toHaveBeenCalled();
    store.dispatch(phoneChanged('123'));
    await store.dispatch(verifyOtp('123456'));
    expect(authApi.verifyOtp).not.toHaveBeenCalled();

    store.dispatch(phoneChanged('9876543210'));
    await store.dispatch(verifyOtp('123456'));
    expect(authApi.verifyOtp).toHaveBeenCalledWith('+919876543210', '123456');
    expect(store.getState().auth.status).toBe('signedIn');
    expect(store.getState().auth.termsAccepted).toBe(false);
    store.dispatch(termsAccepted());
    expect(store.getState().auth.termsAccepted).toBe(true);
    expect(await sessionStore.read()).toMatchObject({ accessToken: 'access' });
    expect(selectAccountPhone(store.getState())).toBe('+919876543210');
  });

  it('stays on the code when verification fails', async () => {
    const { store } = harness({
      verifyOtp: jest.fn(async () => {
        throw new ApiError(401, 'Unauthorized', 'Code was not accepted');
      }),
    });
    store.dispatch(phoneChanged('9876543210'));
    await store.dispatch(verifyOtp('123456'));
    expect(store.getState().auth.challenge).toBe('codeSent');
    expect(store.getState().auth.error).toBe('Code was not accepted');
  });

  it('restores a saved session and drops it when refresh fails', async () => {
    const saved = sessionFixture('old');
    const next = sessionFixture('new');
    const sessionStore = createMemorySessionStore();
    await sessionStore.write(saved);
    const authApi = idleAuthApi({ refresh: jest.fn(async () => next) });
    const store = createAppStore(testExtra(authApi, sessionStore));
    await store.dispatch(restoreSession());
    expect(store.getState().auth.session?.accessToken).toBe('new');
    expect(store.getState().auth.termsAccepted).toBe(true);
    expect(await sessionStore.read()).toMatchObject({ accessToken: 'new' });

    const empty = harness();
    await empty.store.dispatch(restoreSession());
    expect(empty.store.getState().auth.status).toBe('signedOut');
    expect(empty.store.getState().auth.termsAccepted).toBe(false);
    expect(selectAccountPhone(empty.store.getState())).toBe('');

    const stale = createMemorySessionStore();
    await stale.write(saved);
    const rejected = createAppStore(
      testExtra(
        idleAuthApi({
          refresh: jest.fn(async () => {
            throw new ApiError(401, 'Unauthorized', 'Session was not accepted');
          }),
        }),
        stale,
      ),
    );
    await rejected.dispatch(restoreSession());
    expect(rejected.getState().auth.status).toBe('signedOut');
    expect(await stale.read()).toBeNull();
  });

  it('signs out locally when the server accepts or rejects the refresh token', async () => {
    const sessionStore = createMemorySessionStore();
    await sessionStore.write(sessionFixture());
    const authApi = idleAuthApi();
    const store = createAppStore(testExtra(authApi, sessionStore), signedInState());
    await store.dispatch(signOut());
    expect(authApi.signOut).toHaveBeenCalledWith('refresh');
    expect(store.getState().auth.status).toBe('signedOut');
    expect(store.getState().auth.termsAccepted).toBe(false);
    expect(await sessionStore.read()).toBeNull();

    const failingStore = createMemorySessionStore();
    const failing = createAppStore(
      testExtra(
        idleAuthApi({
          signOut: jest.fn(async () => {
            throw new Error('offline');
          }),
        }),
        failingStore,
      ),
      signedInState(),
    );
    await failing.dispatch(signOut());
    expect(failing.getState().auth.status).toBe('signedOut');

    const { store: bare } = harness();
    expect(bare.getState().auth).toEqual(initialAuthState);
    await bare.dispatch(signOut());
    expect(bare.getState().auth.status).toBe('signedOut');
  });
});
