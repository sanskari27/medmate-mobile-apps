import { act, fireEvent } from '@testing-library/react-native';

import { ApiError } from '../../../../services/api/problem';
import { idleAuthApi, renderWithStore, signedOutState } from '../../../../../test/render';
import { sessionFixture } from '../../../../../test/session-fixture';
import { otpHeadingAccent, otpHeadingLead, otpSafety } from '../../utils/copy';
import { OtpScreen } from './OtpScreen';

describe('OtpScreen', () => {
  it('verifies a code, resends it after the wait, and goes back to the number', async () => {
    jest.useFakeTimers();
    try {
      let release: (value: ReturnType<typeof sessionFixture>) => void = () => undefined;
      let releaseSend: (mode: 'otp') => void = () => undefined;
      const authApi = idleAuthApi({
        verifyOtp: jest.fn(
          () =>
            new Promise((resolve) => {
              release = resolve;
            }),
        ),
        sendOtp: jest.fn(
          () =>
            new Promise<'otp'>((resolve) => {
              releaseSend = resolve;
            }),
        ),
      });
      const onChangeNumber = jest.fn();
      const view = renderWithStore(<OtpScreen onChangeNumber={onChangeNumber} />, {
        authApi,
        preloadedState: signedOutState('9876543210'),
      });

      expect(view.getByText(otpHeadingLead, { exact: false })).toBeTruthy();
      expect(view.getByText(otpHeadingAccent)).toBeTruthy();
      expect(view.getByText('Sent by SMS to +91 98765 43210')).toBeTruthy();
      expect(view.getByText('10:00')).toBeTruthy();
      expect(view.getByText('Resend in 0:30')).toBeTruthy();
      expect(view.getByText(otpSafety)).toBeTruthy();
      expect(view.queryByText(/Demo build/)).toBeNull();
      fireEvent.press(view.getByLabelText('Verify and continue'));
      fireEvent.press(view.getByLabelText('Resend code'));
      expect(authApi.verifyOtp).not.toHaveBeenCalled();
      expect(authApi.sendOtp).not.toHaveBeenCalled();

      fireEvent.changeText(view.getByLabelText('Verification code'), '123456');
      fireEvent.press(view.getByLabelText('Verify and continue'));
      fireEvent.press(view.getByLabelText('Verify and continue'));
      expect(authApi.verifyOtp).toHaveBeenCalledTimes(1);
      await act(async () => {
        release(sessionFixture());
      });

      act(() => {
        jest.advanceTimersByTime(21_000);
      });
      expect(view.getByText('Resend in 0:09')).toBeTruthy();
      act(() => {
        jest.advanceTimersByTime(9_000);
      });
      fireEvent.press(view.getByLabelText('Resend code'));
      fireEvent.press(view.getByLabelText('Resend code'));
      expect(authApi.sendOtp).toHaveBeenCalledTimes(1);
      expect(view.getByText('Resend in 0:30')).toBeTruthy();
      await act(async () => {
        releaseSend('otp');
      });

      act(() => {
        jest.advanceTimersByTime(OTP_WAIT_PAST_EXPIRY);
      });
      expect(view.getByText(/Code expired/)).toBeTruthy();
      fireEvent.press(view.getByLabelText('Resend code'));
      expect(authApi.sendOtp).toHaveBeenCalledTimes(2);

      fireEvent.press(view.getByLabelText('Back'));
      fireEvent.press(view.getByLabelText('Wrong number? Change it'));
      expect(onChangeNumber).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('reads the code from a MedMate login SMS', () => {
    const view = renderWithStore(<OtpScreen onChangeNumber={jest.fn()} />, {
      authApi: idleAuthApi(),
      preloadedState: signedOutState('9876543210'),
    });
    const field = view.getByLabelText('Verification code');
    expect(field.props.textContentType).toBe('oneTimeCode');
    expect(field.props.autoComplete).toBe('sms-otp');
    fireEvent.changeText(
      field,
      '200928 is your MedMate login OTP, valid for 10 minutes. Never share this OTP with anyone, including MedMate staff. - MedMate India Technology Pvt Ltd',
    );
    expect(view.getByDisplayValue('200928')).toBeTruthy();
  });

  it('shows a rejected code', async () => {
    const view = renderWithStore(<OtpScreen onChangeNumber={jest.fn()} />, {
      authApi: idleAuthApi({
        verifyOtp: jest.fn(async () => {
          throw new ApiError(401, 'Unauthorized', 'Code was not accepted');
        }),
      }),
      preloadedState: signedOutState('9876543210'),
    });
    fireEvent.changeText(view.getByLabelText('Verification code'), '123456');
    await act(async () => {
      fireEvent.press(view.getByLabelText('Verify and continue'));
      await Promise.resolve();
    });
    expect(view.getByText('Code was not accepted')).toBeTruthy();
  });
});

const OTP_WAIT_PAST_EXPIRY = 601_000;
