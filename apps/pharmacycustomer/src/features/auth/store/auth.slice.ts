import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { errorDetail } from '../../../services/api/problem';
import type { SessionStore } from '../../../services/storage/session-store';
import type { Session } from '../../../types/session';
import { OTP_LENGTH } from '../../../constants/auth';
import { isIndianMobile, nationalDigits, toE164 } from '../../../utils/phone';
import type { AuthApi } from '../api/auth.api';
import { pinModeMessage } from '../utils/copy';
import type { OtpMode } from '../types/auth';

export type AppExtra = {
  authApi: AuthApi;
  sessionStore: SessionStore;
};

type Challenge = 'idle' | 'sending' | 'codeSent' | 'verifying';
type Status = 'unknown' | 'signedOut' | 'signedIn';

export type AuthState = {
  status: Status;
  session: Session | null;
  phone: string;
  challenge: Challenge;
  error: string | null;
};

type ThunkConfig = {
  state: { auth: AuthState };
  extra: AppExtra;
  rejectValue: string;
};

export const initialAuthState: AuthState = {
  status: 'unknown',
  session: null,
  phone: '',
  challenge: 'idle',
  error: null,
};

export const sendOtp = createAsyncThunk<OtpMode, void, ThunkConfig>(
  'auth/sendOtp',
  async (_argument, api) => {
    const digits = api.getState().auth.phone;
    if (!isIndianMobile(digits)) return api.rejectWithValue('Enter an Indian mobile number');
    try {
      return await api.extra.authApi.sendOtp(toE164(digits));
    } catch (error) {
      return api.rejectWithValue(errorDetail(error));
    }
  },
);

export const verifyOtp = createAsyncThunk<Session, string, ThunkConfig>(
  'auth/verifyOtp',
  async (code, api) => {
    if (code.length !== OTP_LENGTH) return api.rejectWithValue('Enter the 6-digit code');
    const digits = api.getState().auth.phone;
    if (!isIndianMobile(digits)) return api.rejectWithValue('Enter an Indian mobile number');
    try {
      return await api.extra.authApi.verifyOtp(toE164(digits), code);
    } catch (error) {
      return api.rejectWithValue(errorDetail(error));
    }
  },
);

export const restoreSession = createAsyncThunk<Session | null, void, ThunkConfig>(
  'auth/restoreSession',
  async (_argument, api) => {
    try {
      const saved = await api.extra.sessionStore.read();
      if (!saved) return null;
      return await api.extra.authApi.refresh(saved.refreshToken);
    } catch {
      await api.extra.sessionStore.clear();
      return null;
    }
  },
);

export const signOut = createAsyncThunk<void, void, ThunkConfig>(
  'auth/signOut',
  async (_argument, api) => {
    const token = api.getState().auth.session?.refreshToken;
    if (token) {
      try {
        await api.extra.authApi.signOut(token);
      } catch {
        // Drop the local session even when the server is unreachable.
      }
    }
    await api.extra.sessionStore.clear();
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    phoneChanged(state, action: PayloadAction<string>) {
      state.phone = nationalDigits(action.payload);
      state.error = null;
    },
    challengeReset(state) {
      state.challenge = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.challenge = 'sending';
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        if (action.payload === 'otp') {
          state.challenge = 'codeSent';
          state.error = null;
          return;
        }
        state.challenge = 'idle';
        state.error = pinModeMessage;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.challenge = 'idle';
        state.error = rejectedDetail(action.payload);
      })
      .addCase(verifyOtp.pending, (state) => {
        state.challenge = 'verifying';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'signedIn';
        state.session = action.payload;
        state.challenge = 'idle';
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.challenge = 'codeSent';
        state.error = rejectedDetail(action.payload);
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.challenge = 'idle';
        state.error = null;
        if (action.payload) {
          state.status = 'signedIn';
          state.session = action.payload;
          return;
        }
        state.status = 'signedOut';
        state.session = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'signedOut';
        state.session = null;
        state.challenge = 'idle';
        state.error = null;
      });
  },
});

function rejectedDetail(payload: string | undefined): string {
  if (payload) return payload;
  return 'Something went wrong';
}

export const { phoneChanged, challengeReset } = authSlice.actions;
export const authReducer = authSlice.reducer;
