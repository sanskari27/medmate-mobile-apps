import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function renderUi(ui: ReactElement) {
  return render(<SafeAreaProvider>{ui}</SafeAreaProvider>);
}
