import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { errorDetail } from '../../../services/api/problem';
import { signOut, termsAccepted, verifyOtp, type AppExtra } from '../../auth/store/auth.slice';
import type { Address, AddressInput } from '../types/address';

export type AddressStatus = 'idle' | 'loading' | 'ready' | 'failed';

export type AddressState = {
  status: AddressStatus;
  items: Address[];
  error: string | null;
  /** Stays on the picker after terms until this session confirms a delivery address. */
  awaitingPick: boolean;
};

type ThunkConfig = {
  state: { auth: { session: { accessToken: string } | null }; address: AddressState };
  extra: AppExtra;
  rejectValue: string;
};

export const initialAddressState: AddressState = {
  status: 'idle',
  items: [],
  error: null,
  awaitingPick: false,
};

export const loadAddresses = createAsyncThunk<Address[], void, ThunkConfig>(
  'address/load',
  async (_argument, api) => {
    const token = api.getState().auth.session?.accessToken;
    if (!token) return api.rejectWithValue('Sign in is required');
    try {
      return await api.extra.addressApi.list(token);
    } catch (error) {
      return api.rejectWithValue(errorDetail(error));
    }
  },
);

export const saveAddress = createAsyncThunk<
  Address,
  { id?: string; body: AddressInput },
  ThunkConfig
>('address/save', async ({ id, body }, api) => {
  const token = api.getState().auth.session?.accessToken;
  if (!token) return api.rejectWithValue('Sign in is required');
  try {
    if (id) return await api.extra.addressApi.update(token, id, body);
    return await api.extra.addressApi.create(token, body);
  } catch (error) {
    return api.rejectWithValue(errorDetail(error));
  }
});

export const chooseAddress = createAsyncThunk<Address, string, ThunkConfig>(
  'address/choose',
  async (id, api) => {
    const token = api.getState().auth.session?.accessToken;
    if (!token) return api.rejectWithValue('Sign in is required');
    try {
      return await api.extra.addressApi.select(token, id);
    } catch (error) {
      return api.rejectWithValue(errorDetail(error));
    }
  },
);

const addressSlice = createSlice({
  name: 'address',
  initialState: initialAddressState,
  reducers: {
    reopenAddressPicker(state) {
      state.awaitingPick = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadAddresses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadAddresses.fulfilled, (state, action) => {
        state.status = 'ready';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(loadAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Something went wrong';
      })
      .addCase(saveAddress.fulfilled, (state, action) => {
        state.status = 'ready';
        state.error = null;
        state.items = upsert(state.items, action.payload);
        if (action.payload.selected) state.awaitingPick = false;
      })
      .addCase(saveAddress.rejected, (state, action) => {
        state.error = action.payload ?? 'Something went wrong';
      })
      .addCase(chooseAddress.fulfilled, (state, action) => {
        state.status = 'ready';
        state.error = null;
        state.items = upsert(state.items, action.payload);
        state.awaitingPick = false;
      })
      .addCase(chooseAddress.rejected, (state, action) => {
        state.error = action.payload ?? 'Something went wrong';
      })
      .addCase(termsAccepted, (state) => {
        state.awaitingPick = true;
      })
      .addCase(verifyOtp.fulfilled, () => initialAddressState)
      .addCase(signOut.fulfilled, () => initialAddressState);
  },
});

function upsert(items: Address[], next: Address): Address[] {
  const others = items.filter((item) => item.id !== next.id);
  const cleared = next.selected ? others.map((item) => ({ ...item, selected: false })) : others;
  return [next, ...cleared];
}

export const { reopenAddressPicker } = addressSlice.actions;
export const addressReducer = addressSlice.reducer;
