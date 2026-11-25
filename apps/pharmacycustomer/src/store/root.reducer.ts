import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './slices';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
