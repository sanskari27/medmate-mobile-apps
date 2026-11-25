jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const Pass = ({ children }: { children?: unknown }) => children;
  return {
    SafeAreaProvider: Pass,
    SafeAreaView: Pass,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

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
