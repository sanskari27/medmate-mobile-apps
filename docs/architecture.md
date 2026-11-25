# Architecture

```
apps/<appName>                 Expo application, created by create-app
packages/theme                 @medmate/theme
packages/base-components       @medmate/base-components
tools/workspace                @medmate/workspace-tools
```

`apps/` stays empty until `pnpm create-app` runs. Do not copy an Expo app in by hand. The generator is what writes the bundle id, EAS profiles, and coverage gate.

## Dependency direction

- Apps depend on `@medmate/theme` and `@medmate/base-components`.
- `@medmate/base-components` depends on `@medmate/theme` and on React Native peers.
- Packages do not depend on apps.
- `@medmate/workspace-tools` reads and writes app and package files. It is not imported by apps.

Packages expose TypeScript source (`main`, `react-native`, `source`). Metro transpiles them. There is no `dist` build.

Nx project names: `theme`, `base-components`, `workspace`, and `<appName>` once an app exists. `@nx/expo` infers `start`, `run-ios`, `run-android`, `export`, `prebuild`, `build`, and `submit` for projects that depend on `expo`.

Shared libraries are tagged `type:ui`. Tools are tagged `type:tool`. Apps are tagged `type:app`.
