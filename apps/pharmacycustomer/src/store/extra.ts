import { createAuthApi } from '../features/auth/api/auth.api';
import { configuredApiBaseUrl } from '../config/env';
import { secureSessionStore } from '../services/storage/secure-session';
import type { AppExtra } from '../features/auth/store/auth.slice';

export function defaultExtra(): AppExtra {
  return {
    authApi: createAuthApi(configuredApiBaseUrl()),
    sessionStore: secureSessionStore,
  };
}
