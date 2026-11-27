import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { errorDetail } from '../../../services/api/problem';
import { signOut, verifyOtp, type AppExtra } from '../../auth/store/auth.slice';
import type { AddressState } from '../../address/store/address.slice';
import type { AppSection, NearbyPharmacy } from '../types/home';

export type HomeStatus = 'idle' | 'loading' | 'ready' | 'failed';

export type HomeState = {
  status: HomeStatus;
  sections: AppSection[];
  pharmacies: NearbyPharmacy[];
  error: string | null;
};

type ThunkConfig = {
  state: {
    auth: { session: { accessToken: string } | null };
    address: AddressState;
  };
  extra: AppExtra;
  rejectValue: string;
};

export const initialHomeState: HomeState = {
  status: 'idle',
  sections: [],
  pharmacies: [],
  error: null,
};

export const loadHome = createAsyncThunk<
  { sections: AppSection[]; pharmacies: NearbyPharmacy[] },
  void,
  ThunkConfig
>('home/load', async (_argument, api) => {
  const token = api.getState().auth.session?.accessToken;
  if (!token) return api.rejectWithValue('Sign in is required');
  const address = api.getState().address.items.find((item) => item.selected);
  if (!address) return api.rejectWithValue('A delivery address is required');
  try {
    const [sections, pharmacies] = await Promise.all([
      api.extra.homeApi.listSections(token),
      api.extra.homeApi.listNearby(token, address.latitude, address.longitude),
    ]);
    return { sections, pharmacies };
  } catch (error) {
    return api.rejectWithValue(errorDetail(error));
  }
});

const homeSlice = createSlice({
  name: 'home',
  initialState: initialHomeState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadHome.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadHome.fulfilled, (state, action) => {
        state.status = 'ready';
        state.sections = action.payload.sections;
        state.pharmacies = action.payload.pharmacies;
        state.error = null;
      })
      .addCase(loadHome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Something went wrong';
      })
      .addCase(verifyOtp.fulfilled, () => initialHomeState)
      .addCase(signOut.fulfilled, () => initialHomeState);
  },
});

export const homeReducer = homeSlice.reducer;
