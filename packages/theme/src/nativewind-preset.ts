import { elevation, type Elevation } from './elevation';
import {
  brand,
  gold,
  gradients,
  mint,
  neutral,
  semantic,
  semanticDark,
  status,
  storeAccents,
} from './colors';
import { fontFamily, iosType, m3Type, type TypeStyle } from './typography';
import { radii, spacing } from './spacing';

function px(value: number): string {
  return `${value}px`;
}

function hexWithAlpha(hex: string, opacity: number): string {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function shadowValue(token: Elevation): string {
  const { shadowOffset, shadowRadius, shadowOpacity, shadowColor } = token;
  return `${shadowOffset.width}px ${shadowOffset.height}px ${px(shadowRadius)} ${hexWithAlpha(shadowColor, shadowOpacity)}`;
}

function fontSizeEntry(
  style: TypeStyle,
): [
  string,
  { lineHeight: string; letterSpacing: string; fontWeight: string; textTransform?: 'uppercase' },
] {
  return [
    px(style.fontSize),
    {
      lineHeight: px(style.lineHeight),
      letterSpacing: px(style.letterSpacing),
      fontWeight: style.fontWeight,
      ...(style.textTransform ? { textTransform: style.textTransform } : {}),
    },
  ];
}

function mapFontScale(scale: Record<string, TypeStyle>, prefix: string) {
  return Object.fromEntries(
    Object.entries(scale).map(([name, style]) => [`${prefix}-${name}`, fontSizeEntry(style)]),
  );
}

function gradientStops() {
  return Object.fromEntries(
    Object.entries(gradients).flatMap(([name, gradient]) =>
      gradient.colors.map((color, index) => [`${name}-${index}`, color]),
    ),
  );
}

/** Tailwind 3 preset. Apps set `darkMode: 'media'` and include `nativewind/preset` first. */
export function createNativeWindPreset() {
  return {
    darkMode: 'media' as const,
    theme: {
      extend: {
        colors: {
          brand,
          mint,
          gold,
          neutral,
          status,
          semantic,
          semanticDark,
          store: storeAccents,
          gradient: gradientStops(),
        },
        gradientDefs: gradients,
        spacing: Object.fromEntries(
          Object.entries(spacing).map(([name, value]) => [name, px(value)]),
        ),
        borderRadius: Object.fromEntries(
          Object.entries(radii).map(([name, value]) => [name, px(value)]),
        ),
        fontFamily: {
          outfit: Object.values(fontFamily),
        },
        fontSize: {
          ...mapFontScale(iosType, 'ios'),
          ...mapFontScale(m3Type, 'm3'),
        },
        boxShadow: {
          none: shadowValue(elevation.none),
          low: shadowValue(elevation.low),
          medium: shadowValue(elevation.medium),
          high: shadowValue(elevation.high),
        },
      },
    },
  };
}

export const nativeWindPreset = createNativeWindPreset();
