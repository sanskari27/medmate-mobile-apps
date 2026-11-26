jest.mock('react-native-safe-area-context', () => {
  // Loaded inside the factory so the mock stays free of out-of-scope bindings.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const Pass = ({ children }: { children?: unknown }) => children;
  return {
    SafeAreaProvider: Pass,
    SafeAreaView: Pass,
    SafeAreaInsetsContext: React.createContext(inset),
    SafeAreaFrameContext: React.createContext(frame),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets: inset, frame },
  };
});

jest.mock('react-native-webview', () => jest.requireActual('./webview-mock'));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'denied' })),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('expo-secure-store', () => {
  const state = jest.requireActual('./secure-store-state') as typeof import('./secure-store-state');
  return {
    getItemAsync: (key: string) => Promise.resolve(state.secureMemory.get(key) ?? null),
    setItemAsync: (key: string, value: string) => {
      state.secureMemory.set(key, value);
      return Promise.resolve();
    },
    deleteItemAsync: (key: string) => {
      state.secureMemory.delete(key);
      return Promise.resolve();
    },
  };
});
