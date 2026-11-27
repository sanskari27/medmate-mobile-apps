import { brand, radii, semantic, spacing } from '@medmate/theme';
import { StyleSheet } from 'react-native';

export const homeTopBarStyles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: brand.forest,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brand: {
    flex: 1,
    gap: spacing.xs,
  },
  address: {
    minHeight: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: -6
  },
  addressCopy: { flex: 0 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wallet: {
    height: spacing.huge,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  bell: {
    width: spacing.huge,
    height: spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.circle,
    overflow: 'hidden',
  },
  glass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.textOnBrand,
    opacity: 0.14,
  },
  profile: {
    width: spacing.huge,
    height: spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.circle,
    backgroundColor: brand.gold,
  },
});
