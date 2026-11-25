import { customerLogin } from '../../../app/configuration/account';
import { requestJson } from '../../../services/api/client';
import { createRequestId } from '../../../services/network/request-id';
import type { Session } from '../../../types/session';
import { parseOtpMode, parseSession } from '../schemas/session.schema';
import type { OtpMode } from '../types/auth';

export type AuthApi = {
  sendOtp: (phone: string) => Promise<OtpMode>;
  verifyOtp: (phone: string, code: string) => Promise<Session>;
  refresh: (refreshToken: string) => Promise<Session>;
  signOut: (refreshToken: string) => Promise<void>;
};

export function createAuthApi(baseUrl: string, fetchImpl?: typeof fetch): AuthApi {
  const post = (path: string, body: unknown, empty?: boolean) =>
    requestJson(baseUrl, { path, body, requestId: createRequestId(), empty }, fetchImpl);

  return {
    async sendOtp(phone) {
      return parseOtpMode(await post('/auth/otp/send', { phone, ...customerLogin }));
    },
    async verifyOtp(phone, code) {
      return parseSession(await post('/auth/otp/verify', { phone, ...customerLogin, code }));
    },
    async refresh(refreshToken) {
      return parseSession(await post('/auth/refresh', { refreshToken }));
    },
    async signOut(refreshToken) {
      await post('/auth/sign-out', { refreshToken }, true);
    },
  };
}
