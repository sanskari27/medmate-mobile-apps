import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Text } from '@medmate/base-components';
import { brand, gold, semantic, spacing } from '@medmate/theme';

import identity from '../../../../../identity.json';
import { splitMark } from '../../../../shared/components/Wordmark/Wordmark';
import {
  alertsLabel,
  emailInitial,
  placeSummary,
  profileLabel,
  rupee,
  walletAction,
} from '../../utils/copy';
import { homeTopBarStyles as styles } from './HomeTopBar.styles';

export type HomeTopBarProps = {
  email: string | null;
  balance: number | null;
  addressLabel: string;
  addressLine: string;
  addressActionLabel: string;
  onAddressPress: () => void;
};

export function HomeTopBar({
  email,
  balance,
  addressLabel,
  addressLine,
  addressActionLabel,
  onAddressPress,
}: HomeTopBarProps) {
  const insets = useSafeAreaInsets();
  const { lead, accent } = splitMark(identity.displayName);
  const initial = emailInitial(email);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <Text variant="wordmark" accessibilityRole="header">
            <Text variant="wordmark" color={semantic.textOnBrand}>
              {lead}
            </Text>
            <Text variant="wordmark" color={brand.gold}>
              {accent}
            </Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={addressActionLabel}
            onPress={onAddressPress}
            style={styles.address}
          >
            <Icon name="pin" size={12} color={brand.gold} />
            <Text
              variant="caption"
              color={semantic.textOnBrand}
              numberOfLines={1}
              style={styles.addressCopy}
            >
              {placeSummary(addressLabel, addressLine)}
            </Text>
            <Icon name="chev-d" size={12} color={semantic.textOnBrand} />
          </Pressable>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={walletAction(balance)}
            style={styles.wallet}
          >
            <View pointerEvents="none" style={styles.glass} />
            <Icon name="wallet" size={16} color={brand.gold} />
            {balance === null ? null : (
              <Text variant="footnoteEmphasized" color={gold[200]}>
                {rupee(balance)}
              </Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={alertsLabel}
            style={styles.bell}
          >
            <View pointerEvents="none" style={styles.glass} />
            <Icon name="bell" size={20} color={brand.gold} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={profileLabel}
            style={styles.profile}
          >
            <Text variant="headline" color={brand.forest}>
              {initial}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
