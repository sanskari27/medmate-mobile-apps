import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Spinner, Text } from '@medmate/base-components';

import { addressLabel, deliverTo } from '../../../address/utils/copy';
import { reopenAddressPicker } from '../../../address/store/address.slice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { selectSelectedAddress } from '../../../../store/selectors/address.selectors';
import {
  selectHomeBalance,
  selectHomeCoupons,
  selectHomeError,
  selectHomePharmacies,
  selectHomeSections,
  selectHomeStatus,
} from '../../../../store/selectors/home.selectors';
import type { Session } from '../../../../types/session';
import { CategoryGrid } from '../../components/CategoryGrid/CategoryGrid';
import { HomeHero } from '../../components/HomeHero/HomeHero';
import { HomeTopBar } from '../../components/HomeTopBar/HomeTopBar';
import { PharmacyRail } from '../../components/PharmacyRail/PharmacyRail';
import type { HomeStatus } from '../../store/home.slice';
import { loadHome, loadWallet } from '../../store/home.slice';
import { chooseAddress, homeFailed, homeLoading, tryAgain } from '../../utils/copy';
import { homeScreenStyles as styles } from './HomeScreen.styles';

export function headerEmail(session: Session | null): string | null {
  if (session === null) return null;
  return session.account.email;
}

export type HomePhase = 'idle' | 'loading' | 'ready' | 'failed';

export function homeBody(hasAddress: boolean, status: HomeStatus): HomePhase {
  if (!hasAddress) return 'idle';
  if (status === 'failed') return 'failed';
  if (status === 'ready') return 'ready';
  return 'loading';
}

export function failureCopy(error: string | null): string {
  return error ?? homeFailed;
}

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const selected = useAppSelector(selectSelectedAddress);
  const status = useAppSelector(selectHomeStatus);
  const sections = useAppSelector(selectHomeSections);
  const pharmacies = useAppSelector(selectHomePharmacies);
  const coupons = useAppSelector(selectHomeCoupons);
  const balance = useAppSelector(selectHomeBalance);
  const error = useAppSelector(selectHomeError);
  const phase = homeBody(selected !== null, status);
  const label = selected ? addressLabel(selected.label) : chooseAddress;

  useEffect(() => {
    void dispatch(loadWallet());
  }, [dispatch, session]);

  useEffect(() => {
    if (!selected) return;
    void dispatch(loadHome());
  }, [dispatch, selected]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <HomeTopBar
        email={headerEmail(session)}
        balance={balance}
        addressLabel={label}
        addressLine={selected?.line1 ?? ''}
        addressActionLabel={selected ? deliverTo(label) : chooseAddress}
        onAddressPress={() => dispatch(reopenAddressPicker())}
      />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <HomeHero
          coupons={coupons}
          onSearchPress={() => undefined}
          onCategoryPress={() => undefined}
        />
        <View style={styles.feed}>
          {phase === 'loading' ? (
            <View style={styles.status}>
              <Spinner label={homeLoading} />
            </View>
          ) : null}
          {phase === 'failed' ? (
            <View style={styles.status}>
              <Text variant="body">{failureCopy(error)}</Text>
              <Button label={tryAgain} tone="outline" onPress={() => void dispatch(loadHome())} />
            </View>
          ) : null}
          {phase === 'ready' ? (
            <View>
              <CategoryGrid sections={sections} />
              <PharmacyRail pharmacies={pharmacies} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
