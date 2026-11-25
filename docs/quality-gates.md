# Quality gates

Local and CI run the same checks.

| Gate             | Command             |
| ---------------- | ------------------- |
| ESLint           | `pnpm lint`         |
| TypeScript       | `pnpm typecheck`    |
| Jest at 100%     | `pnpm test`         |
| Prettier         | `pnpm format:check` |
| All of the above | `pnpm quality`      |

ESLint is flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react`, and `eslint-plugin-react-hooks`.

Prettier uses `prettier-plugin-tailwindcss` 0.5 so class names stay sorted for Tailwind 3.

## Git hooks

Husky runs:

- `pre-commit`: lint-staged (Prettier, then ESLint `--fix` on staged JS/TS)
- `commit-msg`: commitlint with Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, …)

`pnpm install` runs `husky`, which points Git at `.husky/`.

## CI

[`.github/workflows/quality.yml`](../.github/workflows/quality.yml) runs `pnpm quality` on pull requests and on pushes to `main` and `master`. Node comes from `.nvmrc`.

Pull requests use [`.github/pull_request_template.md`](../.github/pull_request_template.md). The checklist covers tests, docs, bundle ids, and secrets.
