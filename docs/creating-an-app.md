# Creating an app

```bash
pnpm create-app -- --name consumers --display-name "MedMate"
```

The command writes `apps/consumers/` with:

- `identity.json` and `version.json` (`1.0.0`, iOS build `1`, Android version code `1`)
- `app.config.ts` reading those files
- `eas.json` with `development`, `preview`, and `production`
- NativeWind, Metro, Babel, and Tailwind wired to `@medmate/theme`
- Outfit font loading in `App.tsx`
- `App.test.tsx` and a Jest config with a 100% coverage threshold on `App.tsx`
- An Nx `project.json` for lint, typecheck, and test

Then install from the repo root so the new workspace package is linked:

```bash
pnpm install
```

Run the app from its directory, or with Nx after install:

```bash
pnpm exec nx start consumers
pnpm exec nx run-ios consumers
pnpm exec nx run-android consumers
```

`extra.eas.projectId` is left unset. Run `eas init` inside the app before the first cloud build. Do not commit credentials.

See [Identity](identity.md) and [EAS](eas.md).
