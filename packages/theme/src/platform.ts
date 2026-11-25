export type PlatformKey = 'ios' | 'android';

/**
 * Clamp the system font scale.
 * Text never shrinks below the design size and may grow up to 1.3.
 */
export function clampFontScale(scale: number): number {
  if (scale < 1) return 1;
  if (scale > 1.3) return 1.3;
  return scale;
}

export const metrics = {
  ios: {
    width: 393,
    height: 852,
    statusBar: 54,
    gutter: 16,
    touchTarget: 44,
    tabBar: 68,
    homeIndicator: 34,
    tabPillHeight: 56,
    handleWidth: 134,
    type: 'ios' as const,
  },
  android: {
    width: 412,
    height: 915,
    statusBar: 24,
    gutter: 16,
    touchTarget: 48,
    tabBar: 68,
    homeIndicator: 24,
    tabPillHeight: 56,
    handleWidth: 108,
    type: 'm3' as const,
  },
} as const;

export type Metrics = (typeof metrics)['ios'] | (typeof metrics)['android'];
