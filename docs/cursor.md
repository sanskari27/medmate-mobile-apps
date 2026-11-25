# Cursor

Rules in `.cursor/rules/` apply while working in this repo.

| Rule                          | When                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `monorepo.mdc`                | Always. Layout and dependency direction.                     |
| `identity.mdc`                | Always. Bundle id and display name.                          |
| `docs.mdc`                    | Always. Update `docs/` with behaviour changes.               |
| `typescript-react-native.mdc` | `*.ts` and `*.tsx`                                           |
| `theme-and-ui.mdc`            | `packages/**/*.ts(x)`                                        |
| `testing.mdc`                 | Test files                                                   |
| `release-eas.mdc`             | `eas.json`, `app.config.ts`, `version.json`, `identity.json` |

Commands in `.cursor/commands/`:

| Command         | Script                                      |
| --------------- | ------------------------------------------- |
| `create-app`    | `pnpm create-app`                           |
| `bump-version`  | `pnpm bump:version`                         |
| `bump-build`    | `pnpm bump:build`                           |
| `quality-check` | `pnpm quality`                              |
| `add-component` | Add a control to `@medmate/base-components` |

Each command names the doc to update.
