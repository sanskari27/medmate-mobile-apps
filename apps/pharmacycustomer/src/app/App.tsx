import { useEffect, useState } from 'react';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';

import { RootNavigator } from './navigation';
import { AppProviders } from './providers';

const splashMinimumMs = 1000;

export function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });
  const [splashHeld, setSplashHeld] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashHeld(false), splashMinimumMs);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProviders>
      <RootNavigator holdSplash={!fontsLoaded || splashHeld} />
    </AppProviders>
  );
}
