# EAS

Each app owns an `eas.json` next to its `package.json`. Profiles:

| Profile       | Purpose                            |
| ------------- | ---------------------------------- |
| `development` | Dev client, internal distribution  |
| `preview`     | Internal distribution, Android APK |
| `production`  | Store build                        |

`autoIncrement` is `false` on every profile. `cli.appVersionSource` is `local`, so EAS reads `expo.version`, `ios.buildNumber`, and `android.versionCode` from `app.config.ts`, which reads `version.json`. Bump those with the repo scripts in [Versioning](versioning.md). Do not turn auto-increment back on or the local counter and EAS will diverge.

`submit.production` is an empty profile. Store credentials stay in EAS, not in git.

Typical commands, from the app directory:

```bash
eas init
eas build --profile development --platform all
eas build --profile preview --platform all
eas build --profile production --platform all
eas submit --profile production --platform all
```

Every profile uses the same bundle id from `identity.json`. Hermes v1 is not enabled.
