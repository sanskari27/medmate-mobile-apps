import { StackActions, type NavigationAction } from '@react-navigation/native';

import type { AuthState } from '../../features/auth/store/auth.slice';

export const rootScreenNames = ['Login', 'Otp', 'Terms', 'Address', 'Dashboard'] as const;

export type RootScreenName = (typeof rootScreenNames)[number];

export type RootStackParamList = {
  Login: undefined;
  Otp: undefined;
  Terms: undefined;
  Address: undefined;
  Dashboard: undefined;
};

export type RootScreenInput = {
  status: AuthState['status'];
  challenge: AuthState['challenge'];
  error: string | null;
  termsAccepted: boolean;
  addressReady: boolean;
  awaitingPick: boolean;
  hasSelectedAddress: boolean;
  /** Stay on the code screen through resend, including a failed resend. */
  otpHeld: boolean;
};

export type RootScreenDecision = {
  screen: RootScreenName | null;
  otpHeld: boolean;
};

export function decideRootScreen(input: RootScreenInput): RootScreenDecision {
  if (input.status === 'unknown') return { screen: null, otpHeld: false };
  if (input.status === 'signedOut') return signedOutScreen(input);
  if (!input.termsAccepted) return { screen: 'Terms', otpHeld: false };
  const account = input.addressReady && !input.awaitingPick && input.hasSelectedAddress;
  if (!account) return { screen: 'Address', otpHeld: false };
  return { screen: 'Dashboard', otpHeld: false };
}

export type StackMove =
  | { type: 'push'; name: RootScreenName }
  | { type: 'pop'; count: number }
  | { type: 'replace'; name: RootScreenName };

/** Push slides in. A screen already underneath pops back. Anything else replaces. */
export function stackMove(
  from: RootScreenName,
  to: RootScreenName,
  stack: readonly RootScreenName[],
  index: number,
): StackMove {
  const toIndex = stack.lastIndexOf(to);
  if (toIndex >= 0 && toIndex < index) return { type: 'pop', count: index - toIndex };
  if (rootScreenNames.indexOf(to) > rootScreenNames.indexOf(from))
    return { type: 'push', name: to };
  return { type: 'replace', name: to };
}

export function dispatchStackMove(
  navigation: { dispatch(action: NavigationAction): void },
  move: StackMove,
): void {
  if (move.type === 'push') navigation.dispatch(StackActions.push(move.name));
  else if (move.type === 'pop') navigation.dispatch(StackActions.pop(move.count));
  else navigation.dispatch(StackActions.replace(move.name));
}

/** Block a system back that would reveal a screen the session has already left. */
export function preventUnownedPop(programmatic: boolean, event: { preventDefault(): void }): void {
  if (!programmatic) event.preventDefault();
}

function signedOutScreen(input: RootScreenInput): RootScreenDecision {
  if (input.challenge === 'codeSent' || input.challenge === 'verifying') {
    return { screen: 'Otp', otpHeld: true };
  }
  if (input.otpHeld && input.challenge === 'sending') return { screen: 'Otp', otpHeld: true };
  if (input.otpHeld && input.error !== null) return { screen: 'Otp', otpHeld: true };
  return { screen: 'Login', otpHeld: false };
}
