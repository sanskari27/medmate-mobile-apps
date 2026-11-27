import { StyleSheet } from 'react-native';
import { radii, semantic, spacing } from '@medmate/theme';

export const categoryGridStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  cell: {
    width: '20%',
    alignItems: 'center',
    paddingHorizontal: spacing.xxs,
    marginBottom: spacing.md,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: semantic.surfaceSunken,
  },
  label: { marginTop: spacing.xs, textAlign: 'center' },
});
