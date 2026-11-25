import {
  PixelRatio,
  Platform,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { clampFontScale, cn, fontFamily, semantic } from '@medmate/theme';

import { resolvePlatformKey } from '../platform/platform';
import { resolveType, type TextVariant } from './resolve-type';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
  className?: string;
};

export function Text({
  variant = 'body',
  color = semantic.text,
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const metrics = resolveType(
    variant,
    resolvePlatformKey(Platform.OS, process.env.EXPO_PUBLIC_PLATFORM),
  );
  const scale = clampFontScale(PixelRatio.getFontScale());
  const typeStyle: TextStyle = {
    fontSize: metrics.fontSize * scale,
    lineHeight: metrics.lineHeight * scale,
    fontFamily: fontFamily[metrics.fontWeight],
    letterSpacing: metrics.letterSpacing * scale,
    textTransform: metrics.textTransform,
    color,
  };

  return (
    <RNText {...rest} allowFontScaling={false} className={cn(className)} style={[typeStyle, style]}>
      {children}
    </RNText>
  );
}
