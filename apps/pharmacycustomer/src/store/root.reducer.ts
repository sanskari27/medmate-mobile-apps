import { combineReducers } from '@reduxjs/toolkit';

import { addressReducer } from '../features/address/store/address.slice';
import { authReducer } from './slices';

export const rootReducer = combineReducers({
  auth: authReducer,
  address: addressReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
