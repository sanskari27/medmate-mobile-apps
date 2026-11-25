import * as theme from './index';
import { cn } from './cn';
import {
  brand,
  colors,
  gold,
  gradients,
  mint,
  neutral,
  semantic,
  semanticDark,
  status,
  storeAccents,
} from './colors';
import { elevation } from './elevation';
import { createNativeWindPreset } from './nativewind-preset';
import { clampFontScale, metrics } from './platform';
import { gutter, hairline, radii, sectionGap, spacing } from './spacing';
import { fontFamily, fontWeight, iosType, m3Type, typeRoles } from './typography';

function collectStrings(value: unknown, found: string[]): void {
  if (typeof value === 'string') {
    found.push(value);
    return;
  }
  if (typeof value === 'number') {
    found.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectStrings(entry, found));
    return;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((entry) => collectStrings(entry, found));
  }
}

describe('public api', () => {
  it('re-exports tokens and the preset', () => {
    expect(theme.cn('a', 'b')).toBe('a b');
    expect(theme.clampFontScale(1)).toBe(1);
    expect(theme.createNativeWindPreset().darkMode).toBe('media');
    expect(theme.nativeWindPreset.darkMode).toBe('media');
    expect(theme.brand.forest).toBe('#1B3D29');
  });
});

describe('tokens', () => {
  it('keeps the light and dark semantic palettes on the same roles', () => {
    expect(Object.keys(semanticDark).sort()).toEqual(Object.keys(semantic).sort());
  });

  it('uses the 4pt grid and the shared page gutter', () => {
    expect(spacing.lg).toBe(16);
    expect(gutter).toBe(spacing.lg);
    expect(sectionGap).toBe(spacing.xxl);
    expect(hairline).toBe(1);
    expect(radii.pill).toBe(999);
  });

  it('records both platform frames and touch targets', () => {
    expect(metrics.ios.touchTarget).toBe(44);
    expect(metrics.android.touchTarget).toBe(48);
    expect(metrics.ios.width).toBe(393);
    expect(metrics.android.width).toBe(412);
  });

  it('clamps the font scale to the design range', () => {
    expect(clampFontScale(0.8)).toBe(1);
    expect(clampFontScale(1)).toBe(1);
    expect(clampFontScale(1.1)).toBe(1.1);
    expect(clampFontScale(1.3)).toBe(1.3);
    expect(clampFontScale(2)).toBe(1.3);
  });

  it('points every Outfit weight at a registered family', () => {
    expect(fontFamily[fontWeight.regular]).toBe('Outfit_400Regular');
    expect(fontFamily[fontWeight.extrabold]).toBe('Outfit_800ExtraBold');
  });

  it('resolves every type role to a token on both scales', () => {
    for (const role of Object.values(typeRoles)) {
      expect(iosType[role.ios]).toBeDefined();
      expect(m3Type[role.m3]).toBeDefined();
    }
  });
});

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
    expect(cn(['a', 'b'])).toBe('a b');
    expect(cn()).toBe('');
  });
});

describe('nativewind preset', () => {
  const preset = createNativeWindPreset();
  const blob = JSON.stringify(preset);

  it('follows the system appearance', () => {
    expect(preset.darkMode).toBe('media');
  });

  it('contains every colour, space, radius, type size, and shadow token', () => {
    const values: string[] = [];
    collectStrings(
      {
        brand,
        mint,
        gold,
        neutral,
        status,
        semantic,
        semanticDark,
        storeAccents,
        gradients,
        colors,
      },
      values,
    );
    collectStrings({ spacing, radii, elevation }, values);
    collectStrings({ iosType, m3Type, fontFamily }, values);

    for (const value of values) {
      expect(blob).toContain(value);
    }
  });

  it('exposes utility names for spacing, radius, and both type scales', () => {
    expect(preset.theme.extend.spacing.lg).toBe('16px');
    expect(preset.theme.extend.borderRadius.card).toBe('14px');
    expect(preset.theme.extend.fontSize['ios-body'][0]).toBe('17px');
    expect(preset.theme.extend.fontSize['m3-bodyLarge'][0]).toBe('16px');
    expect(preset.theme.extend.colors.semantic.text).toBe(neutral.ink);
    expect(preset.theme.extend.boxShadow.high).toContain('20, 32, 26');
  });
});
