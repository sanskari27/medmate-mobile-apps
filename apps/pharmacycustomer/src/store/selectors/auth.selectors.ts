import type { RootState } from '../root.reducer';
import { hasSession } from '../../types/session';

export function selectStatus(state: RootState) {
  return state.auth.status;
}

export function selectPhone(state: RootState) {
  return state.auth.phone;
}

export function selectChallenge(state: RootState) {
  return state.auth.challenge;
}

export function selectError(state: RootState) {
  return state.auth.error;
}

export function selectTermsAccepted(state: RootState) {
  return state.auth.termsAccepted;
}

export function selectAccountPhone(state: RootState): string {
  if (!hasSession(state.auth.session)) return '';
  return state.auth.session.account.phone;
}
