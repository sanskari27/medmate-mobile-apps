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

## App source

Expo config stays at the app root (`app.config.ts`, `package.json`, `eas.json`, `identity.json`). `package.json` `main` is `src/index.ts`, which registers the root component. Screens and logic live under `src/`:

```
src/
  app/                  App.tsx, navigation, providers, configuration
  features/<feature>/   api, components, screens, hooks, store, schemas, types, utils
  shared/               components, hooks, utils, constants, types, validators, styles
  store/                slices, middleware, selectors, listeners, root reducer
  services/             api, storage, location, notifications, permissions, analytics, network
  hooks/  config/  constants/  types/  utils/
```

`create-app` writes this tree with an empty module file in each folder. Feature screens are added per app. A screen or control is a folder of `Name.tsx`, `Name.styles.ts`, `Name.test.tsx`, and `index.ts`.

`pharmacycustomer` opens on a forest splash (split MedMate wordmark, gold pulse, "Care · delivered in minutes", and "Made in Bengaluru") for at least 1000ms, and until Outfit has loaded and the saved session is restored. The splash then fades out. The app fills `features/auth` from the onboarding login and OTP frames. Login shows the split wordmark, three medicine cards, and promises for delivery, licensed pharmacies, and a doctor, then the mobile number. The whole login page scrolls together when the keyboard is open, so the number field stays reachable. The code step is 6 digits because pharmacy-server `Secrets.otpCode` is 6 digits. That screen uses a forest header with a back control, the SMS destination, and a control to change the number, then a white sheet with six boxes, a ten-minute expiry, resend after 30 seconds, and a safety note. The code field accepts a system one-time-code fill, and a MedMate login SMS is read down to its 6-digit code. The requests are:

- `POST /auth/otp/send` with `accountType: "customer"` and `purpose: "login"`
- `POST /auth/otp/verify` with the same fields plus `code`
- `POST /auth/refresh` with `refreshToken` on launch
- `POST /auth/sign-out` with `refreshToken`

A new customer account is created when the code is accepted. The shopper then sees Terms and Conditions before an address: age confirmation is required, and offers stay off unless ticked. Declining signs them out. Accepting terms always opens the address picker, including when a delivery address is already selected. The account opens after the shopper confirms one. A session restored on launch skips terms, then loads delivery addresses. The account opens when one address is already selected. Otherwise the shopper picks a saved address or adds one. Delivery is Bengaluru pincodes starting with 560. Detect stores a foreground location pin and does not look up an address from it. The access token, refresh token, and account are kept in the device secure store (`expo-secure-store`). `EXPO_PUBLIC_API_URL` overrides the API origin. When it is unset, the app calls `http://127.0.0.1:8080`, the local Bruno origin. PIN login is only for an approved pharmacy, so a `pin` response stays on the number screen with an error.

Address requests use the customer access token:

- `GET /api/v1/customer/addresses`
- `POST /api/v1/customer/addresses`
- `PATCH /api/v1/customer/addresses/{id}`
- `POST /api/v1/customer/addresses/{id}/select`
