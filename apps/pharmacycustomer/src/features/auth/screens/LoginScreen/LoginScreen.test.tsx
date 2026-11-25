import { fireEvent } from '@testing-library/react-native';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

import { idleAuthApi, renderWithStore, signedOutState } from '../../../../../test/render';
import { ApiError } from '../../../../services/api/problem';
import { loginHeading, loginHeadingAccent } from '../../utils/copy';
import { LoginScreen } from './LoginScreen';

describe('LoginScreen', () => {
  it('shows the brand and requests a code', async () => {
    const authApi = idleAuthApi();
    const view = renderWithStore(<LoginScreen />, {
      authApi,
      preloadedState: signedOutState(),
    });
    expect(view.getByText(loginHeading)).toBeTruthy();
    expect(view.getByText(loginHeadingAccent)).toBeTruthy();
    expect(view.getByText('MedMate')).toBeTruthy();
    expect(view.getByText('Care · delivered in minutes')).toBeTruthy();
    expect(view.getByText('Delivery')).toBeTruthy();
    expect(view.getByLabelText('Cough syrup')).toBeTruthy();

    fireEvent.changeText(view.getByLabelText('Mobile number'), '9876543210');
    fireEvent.press(view.getByLabelText('Get code'));
    await view.findByText("We'll send a 6-digit code to +91 98765 43210.");
    expect(authApi.sendOtp).toHaveBeenCalledWith('+919876543210');
  });

  it('shows a PIN refusal and a server error', async () => {
    const pin = renderWithStore(<LoginScreen />, {
      authApi: idleAuthApi({ sendOtp: jest.fn(async () => 'pin') }),
      preloadedState: signedOutState('9876543210'),
    });
    fireEvent.press(pin.getByLabelText('Get code'));
    expect(
      await pin.findByText('This number uses a PIN. Sign in from the pharmacy app.'),
    ).toBeTruthy();

    const failed = renderWithStore(<LoginScreen />, {
      authApi: idleAuthApi({
        sendOtp: jest.fn(async () => {
          throw new ApiError(503, 'OTP unavailable', 'OTP could not be sent');
        }),
      }),
      preloadedState: signedOutState('9876543210'),
    });
    fireEvent.press(failed.getByLabelText('Get code'));
    expect(await failed.findByText('OTP could not be sent')).toBeTruthy();
  });

  it('keeps the full page height when the keyboard shrinks the viewport', () => {
    const view = renderWithStore(<LoginScreen />, {
      authApi: idleAuthApi(),
      preloadedState: signedOutState(),
    });
    const windowHeight = Dimensions.get('window').height;
    const taller = windowHeight + 40;
    const height = () =>
      StyleSheet.flatten(view.UNSAFE_getByType(ScrollView).props.contentContainerStyle).minHeight;

    expect(height()).toBe(windowHeight);
    fireEvent(view.UNSAFE_getByType(ScrollView), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: taller } },
    });
    expect(height()).toBe(taller);
    fireEvent(view.UNSAFE_getByType(ScrollView), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: windowHeight } },
    });
    expect(height()).toBe(taller);
  });
});
