import { StyleSheet } from 'react-native';
import { semantic, spacing } from '@medmate/theme';

export const homeScreenStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.page },
  body: { flex: 1 },
  status: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
});
