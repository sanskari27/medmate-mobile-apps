import { Pressable, View } from 'react-native';
import { Icon, IconButton, Text } from '@medmate/base-components';
import { semantic } from '@medmate/theme';

import { deliveryUnit, deliveryWindow, profileLabel, searchLabel } from '../../utils/copy';
import { homeHeaderStyles as styles } from './HomeHeader.styles';

export type HomeHeaderProps = {
  addressLabel: string;
  addressLine: string;
  addressActionLabel: string;
  onAddressPress: () => void;
};

export function HomeHeader({
  addressLabel,
  addressLine,
  addressActionLabel,
  onAddressPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <View style={styles.eta}>
          <Text variant="cardTitle" color={semantic.textOnBrand}>
            {deliveryWindow}
          </Text>
          <Text variant="caption" color={semantic.textOnBrand}>
            {deliveryUnit}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={addressActionLabel}
          onPress={onAddressPress}
          style={styles.address}
        >
          <View style={styles.addressCopy}>
            <Text variant="cardTitle" numberOfLines={1}>
              {addressLabel}
            </Text>
            <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
              {addressLine}
            </Text>
          </View>
          <Icon name="chev-r" color={semantic.textMuted} />
        </Pressable>
        <IconButton icon="user" accessibilityLabel={profileLabel} />
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={searchLabel} style={styles.search}>
        <Icon name="search" color={semantic.textMuted} />
        <Text variant="body" color={semantic.textMuted}>
          {searchLabel}
        </Text>
      </Pressable>
    </View>
  );
}
