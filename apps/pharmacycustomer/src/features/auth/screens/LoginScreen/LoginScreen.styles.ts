import { StyleSheet } from 'react-native';
import { brand, neutral, radii, spacing } from '@medmate/theme';

export const loginScreenStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.forest },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  hero: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sheet: {
    flexGrow: 1,
    borderTopLeftRadius: radii.huge,
    borderTopRightRadius: radii.huge,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  intro: { gap: spacing.md },
  headingLine: { lineHeight: 32 },
});
