import { StyleSheet } from 'react-native';
import { hairline, radii, semantic, spacing } from '@medmate/theme';

export const pharmacyRailStyles = StyleSheet.create({
  root: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: { paddingHorizontal: spacing.lg },
  row: { paddingHorizontal: spacing.lg },
  empty: { paddingHorizontal: spacing.lg },
  card: {
    width: 220,
    gap: spacing.xs,
    marginRight: spacing.md,
    padding: spacing.lg,
    borderWidth: hairline,
    borderColor: semantic.border,
    borderRadius: radii.xl,
    backgroundColor: semantic.surface,
  },
});
