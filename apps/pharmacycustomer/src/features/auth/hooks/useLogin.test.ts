import { act, renderHook } from '@testing-library/react-native';

import { createMemorySessionStore } from '../../../services/storage/session-store';
import { createAppStore } from '../../../store/store';
import { idleAuthApi, signedOutState, storeWrapper } from '../../../../test/render';
import { useLogin } from './useLogin';

describe('useLogin', () => {
  it('keeps digits and requests a code once the number is valid', async () => {
    let release: (mode: 'otp') => void = () => undefined;
    const authApi = idleAuthApi({
      sendOtp: jest.fn(
        () =>
          new Promise<'otp'>((resolve) => {
            release = resolve;
          }),
      ),
    });
    const store = createAppStore(
      { authApi, sessionStore: createMemorySessionStore() },
      signedOutState(),
    );
    const { result } = renderHook(() => useLogin(), { wrapper: storeWrapper(store) });

    act(() => result.current.changePhone('98765'));
    expect(result.current.displayPhone).toBe('98765');
    act(() => result.current.submit());
    expect(authApi.sendOtp).not.toHaveBeenCalled();

    act(() => result.current.changePhone('9876543210'));
    act(() => result.current.submit());
    expect(authApi.sendOtp).toHaveBeenCalledTimes(1);
    act(() => result.current.submit());
    expect(authApi.sendOtp).toHaveBeenCalledTimes(1);

    await act(async () => {
      release('otp');
    });
  });
});
