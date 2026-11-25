---
description: Scaffold an Expo app with an in.medmate bundle id
---

# Create app

Ask for the app name and the display name if they were not provided.

1. Run `pnpm create-app -- --name <appName> --display-name "<Display Name>"`.
2. App name must match `^[a-z][a-z0-9]*$`. Display name may differ.
3. Confirm `apps/<appName>/identity.json` has bundle id `in.medmate.<appName>`.
4. Run `pnpm install` from the repo root.
5. Update `docs/creating-an-app.md` only if the generator's flags or files changed.
