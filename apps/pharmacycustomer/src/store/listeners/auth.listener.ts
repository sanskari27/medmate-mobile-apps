import { createListenerMiddleware, type ThunkDispatch, type UnknownAction } from '@reduxjs/toolkit';

import { restoreSession, verifyOtp, type AppExtra } from '../../features/auth/store/auth.slice';
import type { Session } from '../../types/session';
import type { RootState } from '../root.reducer';

export function createAuthListener(extra: AppExtra) {
  const listener = createListenerMiddleware<
    RootState,
    ThunkDispatch<RootState, AppExtra, UnknownAction>,
    AppExtra
  >({ extra });
  listener.startListening({
    actionCreator: verifyOtp.fulfilled,
    effect: async (action, api) => {
      await api.extra.sessionStore.write(action.payload);
    },
  });
  listener.startListening({
    actionCreator: restoreSession.fulfilled,
    effect: async (action, api) => {
      const session: Session | null = action.payload;
      if (!session) return;
      await api.extra.sessionStore.write(session);
    },
  });
  return listener.middleware;
}
