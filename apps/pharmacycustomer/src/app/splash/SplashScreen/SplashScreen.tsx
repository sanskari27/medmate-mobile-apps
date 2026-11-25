import { useEffect, useId, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gradient, Text } from '@medmate/base-components';
import { brand, mint, semantic, spacing } from '@medmate/theme';

import identity from '../../../../identity.json';
import { splashScreenStyles as styles } from './SplashScreen.styles';

const tagline = 'Care · delivered in minutes';
const origin = 'Made in Bengaluru';

/** How long the splash takes to fade once launch is ready. */
export const splashFadeMs = 400;

const pulseWidth = 164;
const pulseHeight = 20;
const pulsePath = 'M0 10 H62 L70 1 L78 19 L85 7 L92 10 H164';

export type SplashScreenProps = {
  name?: string;
  /** Fade the splash out, then tell the parent it can unmount. */
  fading?: boolean;
  onFaded?: () => void;
};

/** Split a MedMate-style name into the white lead and the gold accent. */
export function splashMark(name: string): { lead: string; accent: string } {
  if (!/^med/i.test(name) || name.length <= 3) return { lead: name, accent: '' };
  const rest = name.slice(3);
  return { lead: 'Med', accent: `${rest.charAt(0).toUpperCase()}${rest.slice(1)}` };
}

function Glow() {
  const id = useId().replace(/:/g, '');

  return (
    <Svg style={styles.glow} pointerEvents="none" accessible={false}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="47%" rx="75%" ry="32%">
          <Stop offset="0" stopColor={brand.gold} stopOpacity={0.2} />
          <Stop offset="1" stopColor={brand.gold} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

export function SplashScreen({
  name = identity.displayName,
  fading = false,
  onFaded,
}: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const { lead, accent } = splashMark(name);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!fading) return undefined;
    const animation = Animated.timing(opacity, {
      toValue: 0,
      duration: splashFadeMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) onFaded?.();
    });
    return () => animation.stop();
  }, [fading, onFaded, opacity]);

  return (
    <Animated.View
      pointerEvents={fading ? 'none' : 'auto'}
      style={[styles.overlay, { opacity }]}
    >
      <Gradient token="brand" style={styles.root}>
        <StatusBar style="light" translucent />
        <Glow />
        <View style={styles.lockup}>
          <Text variant="splashWordmark" color={semantic.textOnBrand} accessibilityRole="header">
            {lead}
            {accent ? (
              <Text variant="splashWordmark" color={brand.gold}>
                {accent}
              </Text>
            ) : null}
          </Text>
          <Svg
            width={pulseWidth}
            height={pulseHeight}
            viewBox={`0 0 ${pulseWidth} ${pulseHeight}`}
            style={styles.pulse}
            accessible={false}
          >
            <Path
              d={pulsePath}
              stroke={brand.gold}
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text variant="eyebrow" color={mint[200]} style={styles.tagline}>
            {tagline}
          </Text>
        </View>
        <View style={[styles.origin, { paddingBottom: insets.bottom + spacing.xxl }]}>
          <Text variant="footnote" color={mint[300]}>
            {origin}
          </Text>
        </View>
      </Gradient>
    </Animated.View>
  );
}
