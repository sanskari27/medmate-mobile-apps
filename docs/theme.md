# Theme

`@medmate/theme` is pure TypeScript. It does not import React Native.

Tokens, ported from the MedMate design system:

- `brand`, `mint`, `gold`, `neutral`, `status`, `storeAccents`
- `semantic` and `semanticDark` (same role names)
- `gradients` (`brand`, `art`, `mint`, `gold`, `blush`, `lab`)
- `spacing` (4pt grid), `gutter`, `sectionGap`, `radii`, `hairline`
- `fontFamily` (Outfit, one family per weight), `iosType`, `m3Type`, `typeRoles`
- `elevation` (`none`, `low`, `medium`, `high`)
- `metrics.ios` and `metrics.android` (frames, status bar, touch targets)
- `clampFontScale` keeps text between `1` and `1.3`

Apps load Outfit with `@expo-google-fonts/outfit`. The theme only names the families (`Outfit_400Regular` and the other weights).

Use semantic roles in components. Raw hex in `packages/base-components` is a bug.

`cn(...classes)` joins class names.

See [NativeWind](nativewind.md) for the Tailwind preset.
