# Testing

Coverage thresholds are 100% statements, branches, functions, and lines.

| Project                    | Runner                             | What is measured               |
| -------------------------- | ---------------------------------- | ------------------------------ |
| `@medmate/theme`           | `ts-jest`                          | `packages/theme/src`           |
| `@medmate/base-components` | `jest-expo` 55 and Testing Library | `packages/base-components/src` |
| `@medmate/workspace-tools` | `ts-jest`                          | `tools/workspace/src`          |
| Generated app              | `jest-expo`                        | `src/app/App.tsx` only         |

Excluded from coverage: config files, docs, lockfiles, the process entry `tools/workspace/bin.ts`, and the empty `apps/` tree. A generated app's `index.ts`, Metro, Babel, and Tailwind files are outside its `collectCoverageFrom`.

Theme tests assert that every token value is present on the NativeWind preset. Component tests render each control, including disabled and pressed states and accessibility labels. Tool tests create an app in a temp directory and bump version files there. They do not write into this repo's `apps/`.

`pharmacycustomer` measures every file under `src/` except `index.ts` barrels, still at 100%. A generated app measures `src/app/App.tsx` until feature code is added. Widen `collectCoverageFrom` when that code lands, and keep the threshold.

`react-test-renderer` is pinned to React 19.2.0, the same version as `react`.
