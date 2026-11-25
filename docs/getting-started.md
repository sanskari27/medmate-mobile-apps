# Getting started

Requirements:

- Node `^20.19.4`, `^22.13.0`, `^24.3.0`, or `^25.0.0`. `.nvmrc` is `22`.
- pnpm 10 (`packageManager` is `pnpm@10.30.1`).

```bash
pnpm install
pnpm quality
```

`pnpm quality` runs lint, TypeScript, Jest with 100% coverage, and Prettier.

Other scripts:

- `pnpm create-app -- --name <appName> --display-name "<Display Name>"`
- `pnpm bump:version -- --project <name> --type patch|minor|major`
- `pnpm bump:build -- --project <appName>`
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm format`

## pnpm linker

The workspace uses pnpm's isolated linker. Expo SDK 55 supports isolated installs. If a native module fails to resolve, switch the root `pnpm-workspace.yaml` to:

```yaml
nodeLinker: hoisted
```

Then reinstall. One React and one React Native version are pinned in the pnpm catalog (`expo`, `react`, `react-native`, `nativewind`, `tailwindcss`, `react-test-renderer`).

Nx Cloud is disabled (`neverConnectToCloud`).
