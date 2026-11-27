import { combineReducers } from '@reduxjs/toolkit';

import { addressReducer } from '../features/address/store/address.slice';
import { homeReducer } from '../features/home/store/home.slice';
import { authReducer } from './slices';

export const rootReducer = combineReducers({
  auth: authReducer,
  address: addressReducer,
  home: homeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
