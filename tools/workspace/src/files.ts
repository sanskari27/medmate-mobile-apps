import { schemeFor } from './identity';

export type AppIdentity = {
  appName: string;
  displayName: string;
  bundleId: string;
};

export function appFiles(identity: AppIdentity): Record<string, string> {
  const { appName, displayName, bundleId } = identity;
  const scheme = schemeFor(appName);

  return {
    'identity.json': `${JSON.stringify({ appName, displayName, bundleId }, null, 2)}\n`,
    'version.json': `${JSON.stringify({ version: '1.0.0', iosBuildNumber: '1', androidVersionCode: 1 }, null, 2)}\n`,
    'package.json': packageJson(appName),
    'app.config.ts': appConfig(),
    'eas.json': easJson(),
    'src/index.ts': indexTs(),
    'src/app/App.tsx': appTsx(),
    'src/app/App.test.tsx': appTest(displayName),
    'metro.config.js': metroConfig(),
    'babel.config.js': babelConfig(),
    'tailwind.config.ts': tailwindConfig(),
    'global.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n',
    'nativewind-env.d.ts': '/// <reference types="nativewind/types" />\n\ndeclare module \'*.css\';\n',
    'tsconfig.json': tsconfig(),
    'jest.config.cjs': jestConfig(),
    'project.json': projectJson(appName),
    'README.md': readme(appName, displayName, bundleId, scheme),
    '.gitignore': 'node_modules\n.expo\nios\nandroid\ncoverage\n',
    ...sourceSkeleton(),
  };
}

function sourceSkeleton(): Record<string, string> {
  const marker = '/** Module folder. Add the implementation beside this file. */\nexport {};\n';
  const paths = [
    'src/app/navigation/index.ts',
    'src/app/providers/index.ts',
    'src/app/configuration/index.ts',
    'src/features/auth/index.ts',
    'src/features/auth/api/index.ts',
    'src/features/auth/components/index.ts',
    'src/features/auth/screens/index.ts',
    'src/features/auth/hooks/index.ts',
    'src/features/auth/store/index.ts',
    'src/features/auth/schemas/index.ts',
    'src/features/auth/types/index.ts',
    'src/features/auth/utils/index.ts',
    'src/features/dashboard/index.ts',
    'src/features/profile/index.ts',
    'src/features/notifications/index.ts',
    'src/features/settings/index.ts',
    'src/shared/components/index.ts',
    'src/shared/hooks/index.ts',
    'src/shared/utils/index.ts',
    'src/shared/constants/index.ts',
    'src/shared/types/index.ts',
    'src/shared/validators/index.ts',
    'src/shared/styles/index.ts',
    'src/store/slices/index.ts',
    'src/store/middleware/index.ts',
    'src/store/selectors/index.ts',
    'src/store/listeners/index.ts',
    'src/store/root.reducer.ts',
    'src/store/store.ts',
    'src/store/index.ts',
    'src/services/api/index.ts',
    'src/services/storage/index.ts',
    'src/services/location/index.ts',
    'src/services/notifications/index.ts',
    'src/services/permissions/index.ts',
    'src/services/analytics/index.ts',
    'src/services/network/index.ts',
    'src/hooks/index.ts',
    'src/config/index.ts',
    'src/constants/index.ts',
    'src/types/index.ts',
    'src/utils/index.ts',
  ];
  return Object.fromEntries(paths.map((file) => [file, marker]));
}

function packageJson(appName: string): string {
  return `${JSON.stringify(
    {
      name: `@medmate/${appName}`,
      version: '1.0.0',
      private: true,
      main: 'src/index.ts',
      scripts: {
        start: 'expo start',
        ios: 'expo start --ios',
        android: 'expo start --android',
        lint: 'eslint . --max-warnings 0',
        typecheck: 'tsc --noEmit',
        test: 'jest --config jest.config.cjs --coverage --forceExit',
      },
      dependencies: {
        '@expo-google-fonts/outfit': '^0.4.3',
        '@medmate/base-components': 'workspace:*',
        '@medmate/theme': 'workspace:*',
        expo: 'catalog:',
        'expo-font': '~55.0.8',
        'expo-status-bar': '~55.0.4',
        nativewind: 'catalog:',
        'react-native-css-interop': '0.2.7',
        react: 'catalog:',
        'react-native': 'catalog:',
        'react-native-reanimated': '4.2.1',
        'react-native-safe-area-context': '~5.6.2',
        'react-native-svg': '15.15.3',
        'react-native-worklets': '0.7.4',
      },
      devDependencies: {
        '@testing-library/react-native': '13.3.3',
        '@types/react': '~19.2.0',
        'babel-preset-expo': '~55.0.8',
        'jest-expo': '~55.0.22',
        'react-test-renderer': 'catalog:',
        tailwindcss: 'catalog:',
      },
    },
    null,
    2,
  )}\n`;
}

function appConfig(): string {
  return `import type { ConfigContext, ExpoConfig } from 'expo/config';

import identity from './identity.json' with { type: 'json' };
import version from './version.json' with { type: 'json' };

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: identity.displayName,
  slug: identity.appName,
  scheme: \`medmate-\${identity.appName}\`,
  version: version.version,
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: identity.bundleId,
    buildNumber: version.iosBuildNumber,
    supportsTablet: false,
  },
  android: {
    package: identity.bundleId,
    versionCode: version.androidVersionCode,
  },
  plugins: ['expo-font'],
  extra: {},
});
`;
}

function easJson(): string {
  return `${JSON.stringify(
    {
      cli: { version: '>= 16.0.0', appVersionSource: 'local' },
      build: {
        development: { developmentClient: true, distribution: 'internal', autoIncrement: false },
        preview: {
          distribution: 'internal',
          autoIncrement: false,
          android: { buildType: 'apk' },
        },
        production: { autoIncrement: false },
      },
      submit: { production: {} },
    },
    null,
    2,
  )}\n`;
}

function appTsx(): string {
  return `import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import { Screen, Text } from '@medmate/base-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import identity from '../../identity.json';

export function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      {fontsLoaded ? (
        <Screen>
          <Text>{identity.displayName}</Text>
        </Screen>
      ) : (
        <Screen>
          <Text>Loading</Text>
        </Screen>
      )}
    </SafeAreaProvider>
  );
}
`;
}

function appTest(displayName: string): string {
  return `import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/outfit';

import { App } from './App';

jest.mock('@expo-google-fonts/outfit', () => ({
  useFonts: jest.fn(),
  Outfit_400Regular: 'Outfit_400Regular',
  Outfit_500Medium: 'Outfit_500Medium',
  Outfit_600SemiBold: 'Outfit_600SemiBold',
  Outfit_700Bold: 'Outfit_700Bold',
  Outfit_800ExtraBold: 'Outfit_800ExtraBold',
}));

function renderApp() {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <App />
    </SafeAreaProvider>,
  );
}

describe('App', () => {
  it('waits for Outfit', () => {
    jest.mocked(useFonts).mockReturnValue([false, null]);
    renderApp();
    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('shows the display name', () => {
    jest.mocked(useFonts).mockReturnValue([true, null]);
    renderApp();
    expect(screen.getByText(${JSON.stringify(displayName)})).toBeTruthy();
  });
});
`;
}

function indexTs(): string {
  return `import '../global.css';

import { registerRootComponent } from 'expo';

import { App } from './app/App';

registerRootComponent(App);
`;
}

function metroConfig(): string {
  return `/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
`;
}

function babelConfig(): string {
  return `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
`;
}

function tailwindConfig(): string {
  return `import type { Config } from 'tailwindcss';
import { nativeWindPreset } from '@medmate/theme/tailwind-preset';

export default {
  darkMode: 'media',
  content: ['./src/**/*.{ts,tsx}', '../../packages/base-components/src/**/*.{ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset'), nativeWindPreset],
} satisfies Config;
`;
}

function tsconfig(): string {
  return `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["jest", "nativewind/types"]
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
}
`;
}

function jestConfig(): string {
  return `/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  collectCoverageFrom: ['src/app/App.tsx'],
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
};
`;
}

function projectJson(appName: string): string {
  return `{
  "name": "${appName}",
  "projectType": "application",
  "sourceRoot": "apps/${appName}",
  "tags": ["type:app"],
  "implicitDependencies": ["theme", "base-components"],
  "targets": {
    "lint": {
      "executor": "nx:run-commands",
      "options": {
        "command": "eslint apps/${appName} --max-warnings 0"
      }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsc -p apps/${appName} --noEmit"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "jest --config apps/${appName}/jest.config.cjs --coverage --forceExit"
      }
    }
  }
}
`;
}

function readme(appName: string, displayName: string, bundleId: string, scheme: string): string {
  return `# ${displayName}

App name: \`${appName}\`

Display name: \`${displayName}\`

Bundle id and Android package: \`${bundleId}\`

URL scheme: \`${scheme}\`

The display name is independent of the bundle id. Version and build numbers live in \`version.json\`. EAS profiles share the same bundle id. Run \`eas init\` in this directory before the first cloud build. See \`docs/creating-an-app.md\` and \`docs/eas.md\`.
`;
}
