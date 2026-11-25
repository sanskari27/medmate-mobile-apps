import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import { Screen, Text } from '@medmate/base-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      {fontsLoaded ? (
        <Screen>
          <Text>Hello World</Text>
        </Screen>
      ) : (
        <Screen>
          <Text>Loading</Text>
        </Screen>
      )}
    </SafeAreaProvider>
  );
}
