import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { iconGlyphs, type IconName } from './iconPaths';

export type { IconName };

export type IconProps = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

/** Stroked 24px glyph. Colour always comes from a theme token. */
export function Icon({ name, size = 24, color, strokeWidth = 1.8, style }: IconProps) {
  const glyph = iconGlyphs[name];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {glyph.paths.map((d, index) => (
        <Path
          key={`${name}-p${index}`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {glyph.circles.map((circle, index) => (
        <Circle
          key={`${name}-c${index}`}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ))}
    </Svg>
  );
}
