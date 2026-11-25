# NativeWind

NativeWind 4.2 uses Tailwind CSS 3. NativeWind 5 is not used; it targets Expo 57.

`@medmate/theme` exports `createNativeWindPreset()` and `nativeWindPreset` from `@medmate/theme/tailwind-preset`. The preset's `darkMode` is `media` (system appearance). Semantic colours exist as `semantic` (light) and `semanticDark`.

An app's `tailwind.config.ts` should:

```ts
import type { Config } from 'tailwindcss';
import { nativeWindPreset } from '@medmate/theme/tailwind-preset';

export default {
  darkMode: 'media',
  content: ['./App.tsx', '../../packages/base-components/src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset'), nativeWindPreset],
} satisfies Config;
```

`global.css` contains the Tailwind directives. Metro uses `withNativeWind`. Babel uses `babel-preset-expo` with `jsxImportSource: 'nativewind'` and `nativewind/babel`. Apps depend on `react-native-css-interop` directly so the JSX runtime resolves under pnpm.

Layout, colour, spacing, radius, and type utilities come from the preset (`bg-semantic-page`, `p-lg`, `rounded-card`, `text-ios-body`). Gradients, elevation shadows, and stroked icons are applied from the TypeScript tokens, because Tailwind cannot express them.

Join classes with `cn` from `@medmate/theme`. It uses `clsx` only.
