import { act, fireEvent, waitFor } from '@testing-library/react-native';

import { pinMapTestId } from '../../features/address/components/PinMap/pin-map';
import { RootNavigator } from './RootNavigator';
import { ApiError } from '../../services/api/problem';
import { createMemorySessionStore } from '../../services/storage/session-store';
import { addressFixture } from '../../../test/address-fixture';
import { idleAddressApi, idleAuthApi, renderWithStore, signedOutState } from '../../../test/render';
import { sessionFixture } from '../../../test/session-fixture';
import { splashFadeMs } from '../splash/SplashScreen/SplashScreen';
import {
  loginHeading,
  otpHeading,
  termsAgree,
  termsHeadingAccent,
} from '../../features/auth/utils/copy';
import {
  addAddressLabel,
  addressHeadingAccent,
  deliverTo,
  labelHome,
  line1Label,
  line2Label,
  receiverNameLabel,
  saveAndDeliver,
  useMyNumber,
} from '../../features/address/utils/copy';

describe('RootNavigator', () => {
  it('keeps the splash while the launch hold is on', () => {
    jest.useFakeTimers();
    try {
      const view = renderWithStore(<RootNavigator holdSplash />, {
        authApi: idleAuthApi(),
        preloadedState: signedOutState(),
      });
      act(() => {
        jest.advanceTimersByTime(splashFadeMs);
      });
      expect(view.getByText('Made in Bengaluru')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('fades the splash once the session is known', () => {
    jest.useFakeTimers();
    try {
      const view = renderWithStore(<RootNavigator />, {
        authApi: idleAuthApi(),
        preloadedState: signedOutState(),
      });
      expect(view.getByText('Made in Bengaluru')).toBeTruthy();
      act(() => {
        jest.advanceTimersByTime(splashFadeMs);
      });
      expect(view.queryByText('Made in Bengaluru')).toBeNull();
      expect(view.getByText(loginHeading)).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('walks from the number to the account and back', async () => {
    const view = renderWithStore(<RootNavigator />, { authApi: idleAuthApi() });
    expect(await view.findByText(loginHeading)).toBeTruthy();

    fireEvent.changeText(view.getByLabelText('Mobile number'), '9876543210');
    fireEvent.press(view.getByLabelText('Get code'));
    expect(await view.findByText(otpHeading)).toBeTruthy();

    fireEvent.press(view.getByLabelText('Resend code'));
    expect(await view.findByText(otpHeading)).toBeTruthy();

    fireEvent.press(view.getByLabelText('Wrong number? Change it'));
    expect(view.getByText(loginHeading)).toBeTruthy();

    fireEvent.press(view.getByLabelText('Get code'));
    expect(await view.findByText(otpHeading)).toBeTruthy();
    fireEvent.changeText(view.getByLabelText('Verification code'), '123456');
    fireEvent.press(view.getByLabelText('Verify and continue'));
    expect(await view.findByText(termsHeadingAccent)).toBeTruthy();
    fireEvent.press(view.getByLabelText(termsAgree));
    expect(await view.findByText(addressHeadingAccent)).toBeTruthy();
    fireEvent.press(view.getByLabelText(addAddressLabel));
    fireEvent.changeText(view.getByLabelText(line1Label), 'Flat 302, Sri Sai Residency');
    fireEvent.changeText(view.getByLabelText(line2Label), '7th Cross, Jayanagar 4th Block');
    fireEvent.changeText(view.getByLabelText(receiverNameLabel), 'Priya Sharma');
    fireEvent.press(view.getByLabelText(useMyNumber));
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ address: { city: 'Bengaluru', postcode: '560011' } }),
    })) as typeof fetch;
    fireEvent(view.getByTestId(pinMapTestId), 'message', {
      nativeEvent: { data: JSON.stringify({ latitude: 12.95, longitude: 77.61 }) },
    });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(await view.findByText('Your account')).toBeTruthy();

    fireEvent.press(view.getByLabelText('Sign out'));
    expect(await view.findByText(loginHeading)).toBeTruthy();
  });

  it('stays on the address picker after terms when one address is already selected', async () => {
    const view = renderWithStore(<RootNavigator />, {
      authApi: idleAuthApi(),
      addressApi: idleAddressApi({
        list: jest.fn(async () => [addressFixture({ selected: true })]),
      }),
    });
    expect(await view.findByText(loginHeading)).toBeTruthy();
    fireEvent.changeText(view.getByLabelText('Mobile number'), '9876543210');
    fireEvent.press(view.getByLabelText('Get code'));
    expect(await view.findByText(otpHeading)).toBeTruthy();
    fireEvent.changeText(view.getByLabelText('Verification code'), '123456');
    fireEvent.press(view.getByLabelText('Verify and continue'));
    expect(await view.findByText(termsHeadingAccent)).toBeTruthy();
    fireEvent.press(view.getByLabelText(termsAgree));
    expect(await view.findByText(addressHeadingAccent)).toBeTruthy();
    expect(view.queryByText('Your account')).toBeNull();

    fireEvent.press(view.getByLabelText(deliverTo(labelHome)));
    expect(await view.findByText('Your account')).toBeTruthy();
  });

  it('opens the account when a saved session still refreshes', async () => {
    const sessionStore = createMemorySessionStore();
    await sessionStore.write(sessionFixture());
    const view = renderWithStore(<RootNavigator />, {
      sessionStore,
      authApi: idleAuthApi({ refresh: jest.fn(async () => sessionFixture('restored')) }),
      addressApi: idleAddressApi({
        list: jest.fn(async () => [addressFixture({ selected: true })]),
      }),
    });
    expect(await view.findByText('Your account')).toBeTruthy();
    expect(view.getByText('+919876543210')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Sign out'));
    expect(await view.findByText(loginHeading)).toBeTruthy();
  });

  it('returns to login when the saved session is refused', async () => {
    const sessionStore = createMemorySessionStore();
    await sessionStore.write(sessionFixture());
    const view = renderWithStore(<RootNavigator />, {
      sessionStore,
      authApi: idleAuthApi({
        refresh: jest.fn(async () => {
          throw new ApiError(401, 'Unauthorized', 'Session was not accepted');
        }),
      }),
    });
    expect(await view.findByText(loginHeading)).toBeTruthy();
  });
});
