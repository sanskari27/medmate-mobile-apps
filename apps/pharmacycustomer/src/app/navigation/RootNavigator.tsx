import { type ReactNode, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, type NavigationAction } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { brand } from '@medmate/theme';

import { AddressFlow } from '../../features/address/screens/AddressFlow/AddressFlow';
import { loadAddresses } from '../../features/address/store/address.slice';
import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen/DashboardScreen';
import { LoginScreen } from '../../features/auth/screens/LoginScreen/LoginScreen';
import { OtpScreen } from '../../features/auth/screens/OtpScreen/OtpScreen';
import { TermsScreen } from '../../features/auth/screens/TermsScreen/TermsScreen';
import { challengeReset, restoreSession } from '../../features/auth/store/auth.slice';
import { useAppDispatch, useAppSelector } from '../../hooks/use-store';
import {
  selectAddressStatus,
  selectAwaitingAddressPick,
  selectSelectedAddress,
} from '../../store/selectors/address.selectors';
import {
  selectChallenge,
  selectError,
  selectStatus,
  selectTermsAccepted,
} from '../../store/selectors/auth.selectors';
import { SplashScreen } from '../splash/SplashScreen/SplashScreen';
import {
  decideRootScreen,
  dispatchStackMove,
  preventUnownedPop,
  stackMove,
  type RootScreenName,
  type RootStackParamList,
} from './root-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigatorProps = {
  /** Keep the splash up after startup, for the minimum launch duration. */
  holdSplash?: boolean;
};

export function RootNavigator({ holdSplash = false }: RootNavigatorProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const termsAccepted = useAppSelector(selectTermsAccepted);
  const addressStatus = useAppSelector(selectAddressStatus);
  const screen = useRootScreen();
  const splashBlocking = holdSplash || status === 'unknown';
  const dismissSplash = useSplashDismiss();

  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'signedIn' && termsAccepted && addressStatus === 'idle') {
      void dispatch(loadAddresses());
    }
  }, [addressStatus, dispatch, status, termsAccepted]);

  return (
    <View style={styles.root}>
      <View
        style={styles.root}
        importantForAccessibility={splashBlocking ? 'no-hide-descendants' : 'auto'}
      >
        {screen ? (
          <NavigationContainer>
            <RootStack screen={screen} />
          </NavigationContainer>
        ) : null}
      </View>
      {dismissSplash.mounted ? (
        <SplashScreen fading={!splashBlocking} onFaded={dismissSplash.dismiss} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

function RootStack({ screen }: { screen: RootScreenName }) {
  const initialRoute = useRef(screen);
  const programmatic = useRef(false);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute.current}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
        contentStyle: { backgroundColor: brand.forest },
      }}
      layout={({ state, navigation, children }) => (
        <RootLayout
          state={state}
          navigation={navigation}
          screen={screen}
          programmatic={programmatic}
        >
          {children}
        </RootLayout>
      )}
      screenListeners={{
        beforeRemove: (event) => {
          preventUnownedPop(programmatic.current, event);
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen name="Otp" component={OtpRoute} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Address" component={AddressFlow} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

function RootLayout({
  state,
  navigation,
  screen,
  programmatic,
  children,
}: {
  state: { index: number; routes: { name: RootScreenName }[] };
  navigation: { dispatch(action: NavigationAction): void };
  screen: RootScreenName;
  programmatic: { current: boolean };
  children: ReactNode;
}) {
  const current = state.routes[state.index].name;

  useEffect(() => {
    if (current === screen) return;
    const stack = state.routes.map((route) => route.name);
    programmatic.current = true;
    dispatchStackMove(navigation, stackMove(current, screen, stack, state.index));
    programmatic.current = false;
  }, [current, navigation, programmatic, screen, state.index, state.routes]);

  return children;
}

function OtpRoute() {
  const dispatch = useAppDispatch();
  return <OtpScreen onChangeNumber={() => dispatch(challengeReset())} />;
}

function useRootScreen(): RootScreenName | null {
  const status = useAppSelector(selectStatus);
  const challenge = useAppSelector(selectChallenge);
  const error = useAppSelector(selectError);
  const termsAccepted = useAppSelector(selectTermsAccepted);
  const addressStatus = useAppSelector(selectAddressStatus);
  const awaitingPick = useAppSelector(selectAwaitingAddressPick);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const otpHeld = useRef(false);
  const decision = decideRootScreen({
    status,
    challenge,
    error,
    termsAccepted,
    addressReady: addressStatus === 'ready',
    awaitingPick,
    hasSelectedAddress: selectedAddress !== null,
    otpHeld: otpHeld.current,
  });
  otpHeld.current = decision.otpHeld;
  return decision.screen;
}

function useSplashDismiss() {
  const [mounted, setMounted] = useState(true);
  const dismiss = () => setMounted(false);
  return { mounted, dismiss };
}
