import { render, type RenderOptions } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import type { AddressApi } from '../src/features/address/api/address.api';
import { initialAddressState } from '../src/features/address/store/address.slice';
import type { AuthApi } from '../src/features/auth/api/auth.api';
import {
  initialAuthState,
  type AppExtra,
  type AuthState,
} from '../src/features/auth/store/auth.slice';
import { createMemorySessionStore, type SessionStore } from '../src/services/storage/session-store';
import type { RootState } from '../src/store/root.reducer';
import { createAppStore, type AppStore } from '../src/store/store';
import { addressFixture } from './address-fixture';
import { sessionFixture } from './session-fixture';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function idleAuthApi(overrides: Partial<AuthApi> = {}): AuthApi {
  return {
    sendOtp: jest.fn(async () => 'otp' as const),
    verifyOtp: jest.fn(async () => sessionFixture()),
    refresh: jest.fn(async () => sessionFixture()),
    signOut: jest.fn(async () => undefined),
    ...overrides,
  };
}

export function idleAddressApi(overrides: Partial<AddressApi> = {}): AddressApi {
  return {
    list: jest.fn(async () => []),
    create: jest.fn(async () => addressFixture({ selected: true })),
    update: jest.fn(async () => addressFixture({ selected: true })),
    select: jest.fn(async () => addressFixture({ selected: true })),
    ...overrides,
  };
}

export function testExtra(
  authApi: AuthApi,
  sessionStore: SessionStore,
  addressApi: AddressApi = idleAddressApi(),
): AppExtra {
  return { authApi, sessionStore, addressApi };
}

export function signedOutState(phone = ''): RootState {
  return {
    auth: { ...initialAuthState, status: 'signedOut', phone },
    address: initialAddressState,
  };
}

export function signedInState(phone = '9876543210'): RootState {
  return {
    auth: {
      ...initialAuthState,
      status: 'signedIn',
      phone,
      termsAccepted: true,
      session: sessionFixture(),
    },
    address: initialAddressState,
  };
}

export function renderWithStore(
  ui: ReactElement,
  options?: {
    authApi?: AuthApi;
    addressApi?: AddressApi;
    sessionStore?: SessionStore;
    preloadedState?: RootState;
    renderOptions?: RenderOptions;
  },
) {
  const sessionStore = options?.sessionStore ?? createMemorySessionStore();
  const authApi = options?.authApi ?? idleAuthApi();
  const addressApi = options?.addressApi ?? idleAddressApi();
  const store = createAppStore(
    testExtra(authApi, sessionStore, addressApi),
    options?.preloadedState,
  );
  const view = render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Provider store={store}>{ui}</Provider>
    </SafeAreaProvider>,
    options?.renderOptions,
  );
  return { store, authApi, addressApi, sessionStore, ...view };
}

export function storeWrapper(store: AppStore) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

export function authState(overrides: Partial<AuthState> = {}): AuthState {
  return { ...initialAuthState, ...overrides };
}
