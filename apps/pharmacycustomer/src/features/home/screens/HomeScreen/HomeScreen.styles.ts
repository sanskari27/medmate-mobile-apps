import { StyleSheet } from 'react-native';
import { brand, semantic, spacing } from '@medmate/theme';

export const homeScreenStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.page },
  body: { flex: 1, backgroundColor: brand.forest },
  content: { flexGrow: 1 },
  feed: {
    flexGrow: 1,
    backgroundColor: semantic.page,
    paddingBottom: spacing.xxl,
  },
  status: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
});
