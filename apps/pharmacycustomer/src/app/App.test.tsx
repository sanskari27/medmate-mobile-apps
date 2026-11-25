import { act, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/outfit';

import { loginHeading } from '../features/auth/utils/copy';
import { splashFadeMs } from './splash/SplashScreen/SplashScreen';
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
  it('waits for Outfit', async () => {
    jest.mocked(useFonts).mockReturnValue([false, null]);
    renderApp();
    expect(await screen.findByText('Made in Bengaluru')).toBeTruthy();
    expect(screen.getByText('Mate')).toBeTruthy();
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText(loginHeading)).toBeNull();
  });

  it('shows the login screen after the splash has been up for a second', async () => {
    jest.useFakeTimers();
    try {
      jest.mocked(useFonts).mockReturnValue([true, null]);
      renderApp();
      expect(screen.getByText('Made in Bengaluru')).toBeTruthy();

      await act(async () => {
        await jest.advanceTimersByTimeAsync(999);
      });
      expect(screen.getByText('Made in Bengaluru')).toBeTruthy();

      await act(async () => {
        await jest.advanceTimersByTimeAsync(1);
      });
      expect(screen.getByText('Made in Bengaluru')).toBeTruthy();

      await act(async () => {
        await jest.advanceTimersByTimeAsync(splashFadeMs);
      });
      expect(screen.queryByText('Made in Bengaluru')).toBeNull();
      expect(screen.getByText(loginHeading)).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });
});
