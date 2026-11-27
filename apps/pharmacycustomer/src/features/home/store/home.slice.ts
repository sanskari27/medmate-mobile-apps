import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { errorDetail } from '../../../services/api/problem';
import { signOut, verifyOtp, type AppExtra } from '../../auth/store/auth.slice';
import type { AddressState } from '../../address/store/address.slice';
import type { AppSection, HomeCoupon, NearbyPharmacy, WalletSnapshot } from '../types/home';
import type { HomeApi } from '../api/home.api';

export type HomeStatus = 'idle' | 'loading' | 'ready' | 'failed';

export type HomeState = {
  status: HomeStatus;
  sections: AppSection[];
  pharmacies: NearbyPharmacy[];
  coupons: HomeCoupon[];
  balance: number | null;
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
  coupons: [],
  balance: null,
  error: null,
};

export async function loadOfferBanners(homeApi: HomeApi, token: string): Promise<HomeCoupon[]> {
  try {
    return await homeApi.listCoupons(token);
  } catch {
    return [];
  }
}

export const loadWallet = createAsyncThunk<number | null, void, ThunkConfig>(
  'home/wallet',
  async (_argument, api) => {
    const token = api.getState().auth.session?.accessToken;
    if (!token) return null;
    try {
      const wallet: WalletSnapshot = await api.extra.homeApi.readWallet(token);
      return wallet.balance;
    } catch {
      return null;
    }
  },
);

export const loadHome = createAsyncThunk<
  { sections: AppSection[]; pharmacies: NearbyPharmacy[]; coupons: HomeCoupon[] },
  void,
  ThunkConfig
>('home/load', async (_argument, api) => {
  const token = api.getState().auth.session?.accessToken;
  if (!token) return api.rejectWithValue('Sign in is required');
  const address = api.getState().address.items.find((item) => item.selected);
  if (!address) return api.rejectWithValue('A delivery address is required');
  try {
    const [sections, pharmacies, coupons] = await Promise.all([
      api.extra.homeApi.listSections(token),
      api.extra.homeApi.listNearby(token, address.latitude, address.longitude),
      loadOfferBanners(api.extra.homeApi, token),
    ]);
    return { sections, pharmacies, coupons };
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
        state.coupons = action.payload.coupons;
        state.error = null;
      })
      .addCase(loadWallet.fulfilled, (state, action) => {
        state.balance = action.payload;
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
