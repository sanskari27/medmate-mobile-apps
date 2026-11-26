import { act, renderHook } from '@testing-library/react-native';

import { createMemorySessionStore } from '../../../services/storage/session-store';
import { createAppStore } from '../../../store/store';
import { idleAuthApi, signedOutState, storeWrapper, testExtra } from '../../../../test/render';
import { useVerifyOtp } from './useVerifyOtp';

describe('useVerifyOtp', () => {
  it('sends the 6-digit code and ignores a second tap while it is in flight', async () => {
    let releaseVerify: (value: Awaited<ReturnType<typeof session>>) => void = () => undefined;
    let releaseSend: (mode: 'otp') => void = () => undefined;
    const authApi = idleAuthApi({
      verifyOtp: jest.fn(
        () =>
          new Promise((resolve) => {
            releaseVerify = resolve;
          }),
      ),
      sendOtp: jest.fn(
        () =>
          new Promise<'otp'>((resolve) => {
            releaseSend = resolve;
          }),
      ),
    });
    const store = createAppStore(
      testExtra(authApi, createMemorySessionStore()),
      signedOutState('9876543210'),
    );
    const { result } = renderHook(() => useVerifyOtp(), { wrapper: storeWrapper(store) });

    act(() => result.current.submit());
    expect(authApi.verifyOtp).not.toHaveBeenCalled();
    act(() => result.current.setCode('12ab345678'));
    expect(result.current.code).toBe('123456');
    expect(result.current.phoneLabel).toBe('+91 98765 43210');

    act(() => result.current.submit());
    expect(authApi.verifyOtp).toHaveBeenCalledWith('+919876543210', '123456');
    act(() => result.current.submit());
    expect(authApi.verifyOtp).toHaveBeenCalledTimes(1);
    await act(async () => {
      releaseVerify(session());
    });

    act(() => result.current.resend());
    expect(authApi.sendOtp).toHaveBeenCalledTimes(1);
    act(() => result.current.resend());
    expect(authApi.sendOtp).toHaveBeenCalledTimes(1);
    await act(async () => {
      releaseSend('otp');
    });
  });
});

function session() {
  return {
    accessToken: 'access',
    refreshToken: 'refresh',
    expiresIn: 900,
    account: {
      id: 'account-1',
      accountType: 'customer',
      phone: '+919876543210',
      displayName: null,
      pharmacyId: null,
      pharmacyRole: null,
      verificationStatus: null,
      subtypes: [],
      permissions: [],
      pinSetupRequired: false,
      disabled: false,
    },
  };
}
