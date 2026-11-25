# MedMate mobile apps

Nx and pnpm monorepo for Expo SDK 55 apps. Shared UI lives in `@medmate/theme` and `@medmate/base-components`. Apps are added with `pnpm create-app` and are not checked in until a product needs one.

Read [docs/README.md](docs/README.md) for architecture, identity rules, EAS, versioning, and quality gates.

```bash
pnpm install
pnpm quality
pnpm create-app -- --name consumers --display-name "MedMate"
```
