import { StyleSheet } from 'react-native';
import { hairline, mint, radii, semantic, spacing } from '@medmate/theme';

const avatarSize = 44;
const cardWidth = 268;

export const pharmacyRailStyles = StyleSheet.create({
  root: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: { flex: 1 },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  row: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  empty: { paddingHorizontal: spacing.lg },
  card: {
    width: cardWidth,
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: hairline,
    borderColor: mint[200],
    borderRadius: radii.xxxl,
    backgroundColor: semantic.surface,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: radii.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  identityText: {
    flex: 1,
    gap: spacing.xxs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: { flexShrink: 1 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radii.xs,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    backgroundColor: mint[100],
  },
});
