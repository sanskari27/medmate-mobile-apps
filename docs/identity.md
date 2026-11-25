# Identity

Every app has three separate names.

| Piece        | Rule                                               | Example                |
| ------------ | -------------------------------------------------- | ---------------------- |
| App name     | `^[a-z][a-z0-9]*$`. Folder, slug, and Nx project.  | `consumers`            |
| Display name | Any non-empty string. `expo.name` only.            | `MedMate`              |
| Bundle id    | Always `in.medmate.<appName>` for iOS and Android. | `in.medmate.consumers` |

The URL scheme is `medmate-<appName>`.

`apps/<appName>/identity.json` stores `appName`, `displayName`, and `bundleId`. `app.config.ts` reads that file. Do not hard-code a different bundle id in an EAS profile.

Development, preview, and production builds share one bundle id. There is no `.dev` suffix.

`create-app` trims the display name and refuses an existing directory, an invalid app name, or a blank display name.
