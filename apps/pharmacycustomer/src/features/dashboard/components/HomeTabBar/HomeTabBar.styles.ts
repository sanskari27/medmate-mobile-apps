import { StyleSheet } from 'react-native';
import { brand, elevation, radii, semantic, spacing } from '@medmate/theme';

const tabPillHeight = spacing.giant;

export const homeTabBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: semantic.page,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    height: tabPillHeight,
    gap: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: semantic.surface,
    padding: spacing.xs,
    ...elevation.medium,
  },
  slot: {
    flex: 1,
  },
  face: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
  },
  faceSelected: {
    backgroundColor: semantic.tintStrong,
  },
  chat: {
    width: tabPillHeight,
    height: tabPillHeight,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: radii.xxxl,
    backgroundColor: brand.forest,
    ...elevation.medium,
  },
});
