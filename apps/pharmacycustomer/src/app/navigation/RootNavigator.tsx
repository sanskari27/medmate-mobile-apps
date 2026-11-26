import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

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
  selectStatus,
  selectTermsAccepted,
} from '../../store/selectors/auth.selectors';
import { SplashScreen } from '../splash/SplashScreen/SplashScreen';

export type RootNavigatorProps = {
  /** Keep the splash up after startup, for the minimum launch duration. */
  holdSplash?: boolean;
};

export function RootNavigator({ holdSplash = false }: RootNavigatorProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const termsAccepted = useAppSelector(selectTermsAccepted);
  const addressStatus = useAppSelector(selectAddressStatus);
  const awaitingPick = useAppSelector(selectAwaitingAddressPick);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const [splashMounted, setSplashMounted] = useState(true);
  const dismissSplash = useCallback(() => setSplashMounted(false), []);
  const splashBlocking = holdSplash || status === 'unknown';
  const showAccount =
    status === 'signedIn' &&
    termsAccepted &&
    !awaitingPick &&
    addressStatus === 'ready' &&
    selectedAddress !== null;

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
        {showAccount ? <DashboardScreen /> : null}
        {status === 'signedIn' && termsAccepted && !showAccount ? <AddressFlow /> : null}
        {status === 'signedIn' && !termsAccepted ? <TermsScreen /> : null}
        {status === 'signedOut' ? <SignedOutNavigator /> : null}
      </View>
      {splashMounted ? <SplashScreen fading={!splashBlocking} onFaded={dismissSplash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

function SignedOutNavigator() {
  const dispatch = useAppDispatch();
  const challenge = useAppSelector(selectChallenge);
  const [step, setStep] = useState<'login' | 'otp'>('login');

  useEffect(() => {
    if (challenge === 'codeSent') setStep('otp');
  }, [challenge]);

  if (step === 'otp') {
    return (
      <OtpScreen
        onChangeNumber={() => {
          dispatch(challengeReset());
          setStep('login');
        }}
      />
    );
  }

  return <LoginScreen />;
}
