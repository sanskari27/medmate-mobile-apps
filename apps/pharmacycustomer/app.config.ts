import type { ConfigContext, ExpoConfig } from 'expo/config';

import identity from './identity.json' with { type: 'json' };
import version from './version.json' with { type: 'json' };

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: identity.displayName,
  slug: identity.appName,
  scheme: `medmate-${identity.appName}`,
  version: version.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
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
  plugins: ['expo-font'],
  extra: {},
});
