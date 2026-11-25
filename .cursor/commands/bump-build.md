---
description: Increment iOS build number and Android version code
---

# Bump build

1. Run `pnpm bump:build -- --project <appName>`.
2. This applies to apps only. Refuse package projects.
3. Do not commit, tag, or push unless the user asks.
4. If the command's behaviour changed, update `docs/versioning.md`.
