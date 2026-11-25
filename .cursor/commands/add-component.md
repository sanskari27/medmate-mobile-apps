---
description: Add a shared UI control with tests and docs
---

# Add component

1. Add `packages/base-components/src/<component-name>/<Component>.tsx` with a colocated `<Component>.test.tsx`, then export it from `src/index.ts`. Do not add a folder `index.ts`.
2. Use `@medmate/theme` tokens or NativeWind classes. No raw hex.
3. Add Testing Library tests for every variant, disabled state, and press handler.
4. Keep coverage at 100%.
5. Add a row to `docs/base-components.md`.
6. Leave catalogue, cart, order, pharmacy, and care screens in the app.
