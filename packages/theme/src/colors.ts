/**
 * MedMate colour variables, taken from the Figma design system.
 * A hex literal inside a component is a bug — use these tokens.
 */

export const brand = {
  forest: '#1B3D29',
  green: '#2F7D52',
  green700: '#256B46',
  gold: '#D9A648',
  mint: '#8FD4A8',
} as const;

export const mint = {
  50: '#F4FBF6',
  100: '#E9F6EE',
  200: '#D9F0E1',
  300: '#BDE5CB',
  400: '#8FD4A8',
} as const;

export const gold = {
  50: '#FDF8EA',
  100: '#FAEDC9',
  200: '#F2D996',
  300: '#D9A648',
  ink: '#855B0C',
} as const;

export const neutral = {
  ink: '#14201A',
  ink2: '#3B4842',
  muted: '#65726B',
  faint: '#9AA59F',
  line2: '#D5DDD8',
  line: '#E7ECE9',
  surface: '#FFFFFF',
  surface2: '#F5F8F6',
  surface3: '#EDF2EF',
  page: '#F4F8F5',
} as const;

export const status = {
  red: '#C2392D',
  redBg: '#FCECE9',
} as const;

export const storeAccents = {
  ortho: { bg: '#EAF3FB', ink: '#1F5E8C' },
  baby: { bg: '#FFF1E6', ink: '#A4541B' },
  women: { bg: '#FBEFF4', ink: '#9B2F5E' },
  diabetes: { bg: '#EEF4EA', ink: '#256B46' },
  heart: { bg: '#FDECEC', ink: '#C2392D' },
  elderly: { bg: '#FDF8EA', ink: '#855B0C' },
} as const;

export type StoreAccentKey = keyof typeof storeAccents;

export const colors = {
  ...brand,
  ...mint,
  ...gold,
  ...neutral,
  ...status,
} as const;

export type Colors = typeof colors;

export const semantic = {
  page: neutral.page,
  surface: neutral.surface,
  surfaceMuted: neutral.surface2,
  surfaceSunken: neutral.surface3,
  text: neutral.ink,
  textSecondary: neutral.ink2,
  textMuted: neutral.muted,
  textFaint: neutral.faint,
  textOnBrand: '#FFFFFF',
  textOnGold: brand.forest,
  border: neutral.line,
  borderStrong: neutral.line2,
  action: brand.green,
  actionPressed: brand.green700,
  anchor: brand.forest,
  savings: gold.ink,
  savingsFill: gold[300],
  tint: mint[50],
  tintBorder: mint[200],
  tintStrong: mint[100],
  danger: status.red,
  dangerMuted: status.redBg,
  scrim: 'rgba(20, 32, 26, 0.55)',
} as const;

export type Semantic = typeof semantic;

/**
 * Dark counterpart of `semantic`. Surfaces use the existing forest and ink,
 * and text uses the light neutrals so both palettes stay in one family.
 */
export const semanticDark = {
  page: neutral.ink,
  surface: '#1C2B23',
  surfaceMuted: '#24382C',
  surfaceSunken: '#101A15',
  text: neutral.page,
  textSecondary: neutral.line2,
  textMuted: neutral.faint,
  textFaint: neutral.muted,
  textOnBrand: neutral.surface,
  textOnGold: brand.forest,
  border: neutral.ink2,
  borderStrong: neutral.muted,
  action: brand.mint,
  actionPressed: brand.green,
  anchor: brand.mint,
  savings: gold[200],
  savingsFill: gold[300],
  tint: brand.forest,
  tintBorder: brand.green700,
  tintStrong: brand.green,
  danger: status.red,
  dangerMuted: '#3A2420',
  scrim: 'rgba(0, 0, 0, 0.72)',
} as const;

export type SemanticDark = typeof semanticDark;

export const gradients = {
  brand: { colors: [brand.forest, brand.green700], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  art: { colors: [mint[50], mint[200]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  mint: { colors: [mint[50], mint[300]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  gold: { colors: ['#F7E3A8', gold[300]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  blush: { colors: ['#FFFFFF', '#F3D9E3'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  lab: { colors: [mint[100], mint[200]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
} as const;

export type GradientToken = keyof typeof gradients;
