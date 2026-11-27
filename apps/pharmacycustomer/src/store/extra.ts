import { createAddressApi } from '../features/address/api/address.api';
import { createAuthApi } from '../features/auth/api/auth.api';
import { createHomeApi } from '../features/home/api/home.api';
import { configuredApiBaseUrl } from '../config/env';
import { secureSessionStore } from '../services/storage/secure-session';
import type { AppExtra } from '../features/auth/store/auth.slice';

export function defaultExtra(): AppExtra {
  const baseUrl = configuredApiBaseUrl();
  return {
    authApi: createAuthApi(baseUrl),
    addressApi: createAddressApi(baseUrl),
    homeApi: createHomeApi(baseUrl),
    sessionStore: secureSessionStore,
  };
}
