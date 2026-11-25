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
    'App.tsx': appTsx(),
    'App.test.tsx': appTest(displayName),
    'index.ts': indexTs(),
    'metro.config.js': metroConfig(),
    'babel.config.js': babelConfig(),
    'tailwind.config.ts': tailwindConfig(),
    'global.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n',
    'nativewind-env.d.ts': '/// <reference types="nativewind/types" />\n',
    'tsconfig.json': tsconfig(),
    'jest.config.cjs': jestConfig(),
    'project.json': projectJson(appName),
    'README.md': readme(appName, displayName, bundleId, scheme),
    '.gitignore': 'node_modules\n.expo\nios\nandroid\ncoverage\n',
  };
}

function packageJson(appName: string): string {
  return `${JSON.stringify(
    {
      name: `@medmate/${appName}`,
      version: '1.0.0',
      private: true,
      main: 'index.ts',
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

import identity from './identity.json';
import version from './version.json';

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
  return `import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { Screen, Text } from '@medmate/base-components';

import identity from './identity.json';

export function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <Screen>
        <Text>Loading</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text>{identity.displayName}</Text>
    </Screen>
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
    <SafeAreaProvider>
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
  return `import { registerRootComponent } from 'expo';

import { App } from './App';

registerRootComponent(App);
`;
}

function metroConfig(): string {
  return `const { getDefaultConfig } = require('expo/metro-config');
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

const config: Config = {
  darkMode: 'media',
  content: ['./App.tsx', './src/**/*.{ts,tsx}', '../../packages/base-components/src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset'), nativeWindPreset as Config],
};

export default config;
`;
}

function tsconfig(): string {
  return `${JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        jsx: 'react-jsx',
        types: ['jest', 'nativewind/types'],
      },
      include: ['**/*.ts', '**/*.tsx', 'nativewind-env.d.ts'],
    },
    null,
    2,
  )}\n`;
}

function jestConfig(): string {
  return `/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/**/*.test.tsx'],
  collectCoverageFrom: ['App.tsx'],
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
};
`;
}

function projectJson(appName: string): string {
  return `${JSON.stringify(
    {
      name: appName,
      projectType: 'application',
      sourceRoot: `apps/${appName}`,
      tags: ['type:app'],
      implicitDependencies: ['theme', 'base-components'],
      targets: {
        lint: {
          executor: 'nx:run-commands',
          options: { command: `eslint apps/${appName} --max-warnings 0` },
        },
        typecheck: {
          executor: 'nx:run-commands',
          options: { command: `tsc -p apps/${appName} --noEmit` },
        },
        test: {
          executor: 'nx:run-commands',
          options: {
            command: `jest --config apps/${appName}/jest.config.cjs --coverage --forceExit`,
          },
        },
      },
    },
    null,
    2,
  )}\n`;
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
