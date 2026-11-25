import { StyleSheet, View } from 'react-native';
import { Text } from '@medmate/base-components';
import { brand, gold, neutral, spacing } from '@medmate/theme';

import { tagline } from '../../constants/onboarding';

/** Split a MedMate-style name into the white lead and the gold accent. */
export function splitMark(name: string): { lead: string; accent: string } {
  if (!/^med/i.test(name) || name.length <= 3) return { lead: name, accent: '' };
  const rest = name.slice(3);
  return { lead: 'Med', accent: `${rest.charAt(0).toUpperCase()}${rest.slice(1)}` };
}

export function Wordmark({ name, size }: { name: string; size: 'large' | 'small' }) {
  const large = size === 'large';
  const { lead, accent } = splitMark(name);
  const variant = large ? 'pharmacyTitle' : 'wordmark';

  return (
    <View style={[styles.wrap, large ? styles.center : null]}>
      <Text
        variant={variant}
        color={neutral.surface}
        accessibilityRole={large ? 'header' : undefined}
      >
        {large ? lead : name}
        {large && accent ? (
          <Text variant={variant} color={brand.gold}>
            {accent}
          </Text>
        ) : null}
      </Text>
      {large ? (
        <Text variant="eyebrow" color={gold[200]} style={styles.tagline}>
          {tagline}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  center: { alignItems: 'center' },
  tagline: { textAlign: 'center', letterSpacing: 1.2 },
});
