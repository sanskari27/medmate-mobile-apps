import type { Config } from 'tailwindcss';
import { nativeWindPreset } from '@medmate/theme/tailwind-preset';

export default {
  darkMode: 'media',
  content: ['./App.tsx', './src/**/*.{ts,tsx}', '../../packages/base-components/src/**/*.{ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset'), nativeWindPreset],
} satisfies Config;
