# Versioning

Apps store release data in `version.json`:

```json
{
  "version": "1.0.0",
  "iosBuildNumber": "1",
  "androidVersionCode": 1
}
```

Packages store their version in `package.json`.

```bash
pnpm bump:version -- --project theme --type patch
pnpm bump:version -- --project consumers --type minor
pnpm bump:build -- --project consumers
```

- `patch`, `minor`, and `major` follow semver. An app bump changes only `version.json`. A package bump changes `package.json`.
- `bump:build` adds one to `iosBuildNumber` and `androidVersionCode`. It refuses packages.
- Project lookup order is `apps/<name>`, then `packages/<name>`, then `tools/<name>`.
- The commands do not commit, tag, or push.

`--type` must be `patch`, `minor`, or `major`. Build counters must be non-negative integers.
