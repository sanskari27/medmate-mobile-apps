import { StyleSheet, View } from 'react-native';
import { Icon, Text } from '@medmate/base-components';
import { brand, neutral, radii, spacing } from '@medmate/theme';

import { promises } from '../../constants/onboarding';

export function PromiseStrip() {
  return (
    <View style={styles.row}>
      <View style={styles.wash} pointerEvents="none" />
      {promises.map((promise) => (
        <View key={promise.title} style={styles.item}>
          <Icon name={promise.icon} size={22} color={brand.gold} />
          <Text variant="caption1" color={neutral.surface} style={styles.label}>
            {promise.title}
          </Text>
          <Text variant="caption1" color={neutral.surface} style={styles.label}>
            {promise.body}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    backgroundColor: brand.forest,
    overflow: 'hidden',
  },
  wash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: neutral.surface,
    opacity: 0.08,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  label: { textAlign: 'center' },
});
