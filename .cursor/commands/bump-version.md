---
description: Bump a package or app semver
---

# Bump version

1. Run `pnpm bump:version -- --project <name> --type patch|minor|major`.
2. Use the app folder name or the package folder name (`theme`, `base-components`, `workspace`).
3. Do not commit, tag, or push unless the user asks.
4. If the command's behaviour changed, update `docs/versioning.md`.
