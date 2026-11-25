import type { ConfigContext, ExpoConfig } from 'expo/config';

import identity from './identity.json' with { type: 'json' };
import version from './version.json' with { type: 'json' };

/** `brand.forest`. Expo evaluates this file in Node and cannot import the theme package. */
const splashBackground = '#1B3D29';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: identity.displayName,
  slug: identity.appName,
  scheme: `medmate-${identity.appName}`,
  version: version.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    backgroundColor: splashBackground,
  },
  ios: {
    bundleIdentifier: identity.bundleId,
    buildNumber: version.iosBuildNumber,
    supportsTablet: false,
    appleTeamId: 'NYZKB578C4',
  },
  android: {
    package: identity.bundleId,
    versionCode: version.androidVersionCode,
  },
  plugins: ['expo-font', ['expo-secure-store', { faceIDPermission: false }]],
  extra: {},
});
