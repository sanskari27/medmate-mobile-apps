import { StackActions } from '@react-navigation/native';

import {
  decideRootScreen,
  dispatchStackMove,
  preventUnownedPop,
  stackMove,
  type RootScreenInput,
} from './root-screen';

function input(overrides: Partial<RootScreenInput> = {}): RootScreenInput {
  return {
    status: 'signedOut',
    challenge: 'idle',
    error: null,
    termsAccepted: false,
    addressReady: false,
    awaitingPick: false,
    hasSelectedAddress: false,
    otpHeld: false,
    ...overrides,
  };
}

describe('decideRootScreen', () => {
  it('waits until the session is known', () => {
    expect(decideRootScreen(input({ status: 'unknown' }))).toEqual({
      screen: null,
      otpHeld: false,
    });
  });

  it('keeps the code screen through verify and resend', () => {
    expect(decideRootScreen(input({ challenge: 'codeSent' })).screen).toBe('Otp');
    expect(decideRootScreen(input({ challenge: 'verifying' })).otpHeld).toBe(true);
    expect(decideRootScreen(input({ challenge: 'sending' })).screen).toBe('Login');
    expect(decideRootScreen(input({ challenge: 'sending', otpHeld: true })).screen).toBe('Otp');
    expect(
      decideRootScreen(input({ otpHeld: true, error: 'The code could not be sent' })).screen,
    ).toBe('Otp');
    expect(decideRootScreen(input({ otpHeld: true })).screen).toBe('Login');
    expect(decideRootScreen(input({ error: 'Enter an Indian mobile number' })).otpHeld).toBe(false);
  });

  it('opens terms, the address picker, then the account', () => {
    expect(decideRootScreen(input({ status: 'signedIn' })).screen).toBe('Terms');
    expect(decideRootScreen(input({ status: 'signedIn', termsAccepted: true })).screen).toBe(
      'Address',
    );
    expect(
      decideRootScreen(
        input({
          status: 'signedIn',
          termsAccepted: true,
          addressReady: true,
          hasSelectedAddress: false,
        }),
      ).screen,
    ).toBe('Address');
    expect(
      decideRootScreen(
        input({
          status: 'signedIn',
          termsAccepted: true,
          addressReady: true,
          hasSelectedAddress: true,
          awaitingPick: true,
        }),
      ).screen,
    ).toBe('Address');
    expect(
      decideRootScreen(
        input({
          status: 'signedIn',
          termsAccepted: true,
          addressReady: true,
          hasSelectedAddress: true,
        }),
      ),
    ).toEqual({ screen: 'Dashboard', otpHeld: false });
  });
});

describe('stackMove', () => {
  it('pushes the next screen, pops back to one underneath, and replaces the rest', () => {
    expect(stackMove('Login', 'Otp', ['Login'], 0)).toEqual({ type: 'push', name: 'Otp' });
    expect(stackMove('Login', 'Otp', ['Login', 'Otp'], 0)).toEqual({ type: 'push', name: 'Otp' });
    expect(
      stackMove('Dashboard', 'Login', ['Login', 'Otp', 'Terms', 'Address', 'Dashboard'], 4),
    ).toEqual({ type: 'pop', count: 4 });
    expect(stackMove('Dashboard', 'Login', ['Address', 'Dashboard'], 1)).toEqual({
      type: 'replace',
      name: 'Login',
    });
  });
});

describe('dispatchStackMove', () => {
  it('dispatches the matching stack action', () => {
    const navigation = { dispatch: jest.fn() };
    dispatchStackMove(navigation, { type: 'push', name: 'Otp' });
    dispatchStackMove(navigation, { type: 'pop', count: 2 });
    dispatchStackMove(navigation, { type: 'replace', name: 'Login' });
    expect(navigation.dispatch).toHaveBeenNthCalledWith(1, StackActions.push('Otp'));
    expect(navigation.dispatch).toHaveBeenNthCalledWith(2, StackActions.pop(2));
    expect(navigation.dispatch).toHaveBeenNthCalledWith(3, StackActions.replace('Login'));
  });
});

describe('preventUnownedPop', () => {
  it('stops a system back and lets a session change through', () => {
    const event = { preventDefault: jest.fn() };
    preventUnownedPop(false, event);
    preventUnownedPop(true, event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});
