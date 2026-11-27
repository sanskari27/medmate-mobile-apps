import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Spinner, Text } from '@medmate/base-components';

import { addressLabel, deliverTo } from '../../../address/utils/copy';
import { reopenAddressPicker } from '../../../address/store/address.slice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { selectSelectedAddress } from '../../../../store/selectors/address.selectors';
import {
  selectHomeError,
  selectHomePharmacies,
  selectHomeSections,
  selectHomeStatus,
} from '../../../../store/selectors/home.selectors';
import { CategoryGrid } from '../../components/CategoryGrid/CategoryGrid';
import { HomeHeader } from '../../components/HomeHeader/HomeHeader';
import { PharmacyRail } from '../../components/PharmacyRail/PharmacyRail';
import type { HomeStatus } from '../../store/home.slice';
import { loadHome } from '../../store/home.slice';
import { chooseAddress, homeFailed, homeLoading, tryAgain } from '../../utils/copy';
import { homeScreenStyles as styles } from './HomeScreen.styles';

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
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedAddress);
  const status = useAppSelector(selectHomeStatus);
  const sections = useAppSelector(selectHomeSections);
  const pharmacies = useAppSelector(selectHomePharmacies);
  const error = useAppSelector(selectHomeError);
  const phase = homeBody(selected !== null, status);
  const label = selected ? addressLabel(selected.label) : chooseAddress;

  useEffect(() => {
    if (!selected) return;
    void dispatch(loadHome());
  }, [dispatch, selected]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={{ paddingTop: insets.top }}>
        <HomeHeader
          addressLabel={label}
          addressLine={selected?.line1 ?? ''}
          addressActionLabel={selected ? deliverTo(label) : chooseAddress}
          onAddressPress={() => dispatch(reopenAddressPicker())}
        />
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.body}>
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
      </ScrollView>
    </View>
  );
}
