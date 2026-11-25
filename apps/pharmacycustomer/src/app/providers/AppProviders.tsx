import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { defaultExtra } from '../../store/extra';
import { createAppStore } from '../../store/store';

export function AppProviders({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAppStore(defaultExtra()));
  return (
    <SafeAreaProvider>
      <Provider store={store}>{children}</Provider>
    </SafeAreaProvider>
  );
}
