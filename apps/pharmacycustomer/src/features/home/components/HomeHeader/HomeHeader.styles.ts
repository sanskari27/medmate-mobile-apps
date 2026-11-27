import { StyleSheet } from 'react-native';
import { brand, hairline, radii, semantic, spacing } from '@medmate/theme';

export const homeHeaderStyles = StyleSheet.create({
  root: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: semantic.surface,
    borderBottomWidth: hairline,
    borderBottomColor: semantic.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eta: {
    minWidth: 64,
    alignItems: 'center',
    borderRadius: radii.lg,
    backgroundColor: brand.forest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  address: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressCopy: { flex: 1 },
  search: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: semantic.surfaceSunken,
    paddingHorizontal: spacing.lg,
  },
});
