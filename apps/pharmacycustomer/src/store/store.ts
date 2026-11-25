import { configureStore } from '@reduxjs/toolkit';

import { createAuthListener } from './listeners/auth.listener';
import { rootReducer, type RootState } from './root.reducer';
import type { AppExtra } from '../features/auth/store/auth.slice';

export function createAppStore(extra: AppExtra, preloadedState?: RootState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: extra } }).prepend(createAuthListener(extra)),
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
