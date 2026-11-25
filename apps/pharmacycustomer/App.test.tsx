import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/outfit';

import { App } from './App';

jest.mock('@expo-google-fonts/outfit', () => ({
  useFonts: jest.fn(),
  Outfit_400Regular: 'Outfit_400Regular',
  Outfit_500Medium: 'Outfit_500Medium',
  Outfit_600SemiBold: 'Outfit_600SemiBold',
  Outfit_700Bold: 'Outfit_700Bold',
  Outfit_800ExtraBold: 'Outfit_800ExtraBold',
}));

function renderApp() {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <App />
    </SafeAreaProvider>,
  );
}

describe('App', () => {
  it('waits for Outfit', () => {
    jest.mocked(useFonts).mockReturnValue([false, null]);
    renderApp();
    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('shows Hello World', () => {
    jest.mocked(useFonts).mockReturnValue([true, null]);
    renderApp();
    expect(screen.getByText('Hello World')).toBeTruthy();
  });
});
