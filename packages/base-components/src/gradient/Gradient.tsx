import { useId, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
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
    <View style={[{ overflow: 'hidden', borderRadius: radius }, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Defs>
          <LinearGradient id={id} x1="0.5" y1="0" x2="0.5" y2="1">
            {stops.map((color, index) => (
              <Stop
                key={`${id}-${index}`}
                offset={stopOffset(index, stops.length)}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="1" height="1" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}
