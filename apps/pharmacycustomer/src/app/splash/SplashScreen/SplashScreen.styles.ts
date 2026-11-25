import { StyleSheet } from 'react-native';
import { brand, spacing } from '@medmate/theme';

export const splashScreenStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject },
  root: { flex: 1, backgroundColor: brand.forest },
  glow: StyleSheet.absoluteFillObject,
  lockup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: { marginTop: spacing.xxxl },
  tagline: { marginTop: spacing.xl },
  origin: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
});
