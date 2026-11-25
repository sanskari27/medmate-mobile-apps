import { useId, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { gradients, type GradientToken } from '@medmate/theme';

export function gradientStops(
  token: GradientToken,
  colors: readonly string[] | undefined,
): readonly string[] {
  return colors ?? gradients[token].colors;
}

export function stopOffset(index: number, count: number): number {
  return index / Math.max(count - 1, 1);
}

export function Gradient({
  token = 'art',
  colors,
  radius = 0,
  style,
  children,
}: {
  token?: GradientToken;
  colors?: readonly string[];
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const id = useId().replace(/:/g, '');
  const stops = gradientStops(token, colors);

  return (
    <View
      style={[{ overflow: 'hidden', borderRadius: radius, backgroundColor: stops[0] }, style]}
    >
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            {stops.map((color, index) => (
              <Stop
                key={`${id}-${index}`}
                offset={stopOffset(index, stops.length)}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}
