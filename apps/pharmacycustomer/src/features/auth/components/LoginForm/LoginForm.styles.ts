import { brand, iosType, neutral, radii, spacing } from '@medmate/theme';
import { StyleSheet } from 'react-native';

export const loginFormStyles = StyleSheet.create({
  form: { flexGrow: 1 },
  body: {
    flexGrow: 1,
    gap: spacing.md,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  field: { gap: spacing.xs },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line2,
    backgroundColor: neutral.surface,
  },
  fieldBoxValid: { borderColor: brand.green },
  rule: { width: 1, height: 22, backgroundColor: neutral.line2 },
  input: {
    flex: 1,
    fontSize: iosType.body.fontSize,
    lineHeight: iosType.body.lineHeight,
    color: neutral.ink,
    paddingVertical: 0,
  },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  submit: { alignSelf: 'stretch' },
});
