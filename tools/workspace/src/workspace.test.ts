import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { appFiles } from './files';
import { assertAppName, assertDisplayName, bundleIdFor, schemeFor } from './identity';
import {
  bumpBuild,
  bumpVersion,
  createApp,
  formatError,
  readFlag,
  resolveProject,
  run,
} from './run';
import { assertReleaseType, bumpBuildNumbers, bumpSemver, type ReleaseType } from './version';

function tempRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'medmate-workspace-'));
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

describe('identity', () => {
  it('builds the bundle id and scheme from a valid app name', () => {
    expect(bundleIdFor('consumers')).toBe('in.medmate.consumers');
    expect(schemeFor('consumers')).toBe('medmate-consumers');
    expect(assertDisplayName('  MedMate  ')).toBe('MedMate');
  });

  it('rejects invalid names and blank display names', () => {
    expect(() => assertAppName('Consumers')).toThrow(/App name/);
    expect(() => assertAppName('con-sumers')).toThrow(/App name/);
    expect(() => bundleIdFor('1app')).toThrow(/App name/);
    expect(() => assertDisplayName('   ')).toThrow(/Display name/);
  });
});

describe('version math', () => {
  it('bumps semver and rejects bad input', () => {
    expect(assertReleaseType('patch')).toBe('patch');
    expect(assertReleaseType('minor')).toBe('minor');
    expect(assertReleaseType('major')).toBe('major');
    expect(() => assertReleaseType('build')).toThrow(/Release type/);
    expect(bumpSemver('1.2.3', 'patch')).toBe('1.2.4');
    expect(bumpSemver('1.2.3', 'minor')).toBe('1.3.0');
    expect(bumpSemver('1.2.3', 'major')).toBe('2.0.0');
    expect(() => bumpSemver('1.2', 'patch')).toThrow(/Invalid semver/);
    expect(() => bumpSemver('1.2.3', 'build' as ReleaseType)).toThrow(/Unknown release type/);
  });

  it('increments build numbers and rejects bad counters', () => {
    expect(
      bumpBuildNumbers({ version: '1.0.0', iosBuildNumber: '4', androidVersionCode: 4 }),
    ).toEqual({
      version: '1.0.0',
      iosBuildNumber: '5',
      androidVersionCode: 5,
    });
    expect(() =>
      bumpBuildNumbers({ version: '1.0.0', iosBuildNumber: 'x', androidVersionCode: 1 }),
    ).toThrow(/iosBuildNumber/);
    expect(() =>
      bumpBuildNumbers({ version: '1.0.0', iosBuildNumber: '-1', androidVersionCode: 1 }),
    ).toThrow(/iosBuildNumber/);
    expect(() =>
      bumpBuildNumbers({ version: '1.0.0', iosBuildNumber: '1', androidVersionCode: 1.5 }),
    ).toThrow(/androidVersionCode/);
    expect(() =>
      bumpBuildNumbers({ version: '1.0.0', iosBuildNumber: '1', androidVersionCode: -1 }),
    ).toThrow(/androidVersionCode/);
  });
});

describe('project files', () => {
  it('writes an app whose bundle id is not the display name', () => {
    const root = tempRoot();
    createApp(root, 'consumers', '  MedMate  ');
    const identity = JSON.parse(
      fs.readFileSync(path.join(root, 'apps/consumers/identity.json'), 'utf8'),
    ) as {
      displayName: string;
      bundleId: string;
    };
    const eas = fs.readFileSync(path.join(root, 'apps/consumers/eas.json'), 'utf8');
    const app = fs.readFileSync(path.join(root, 'apps/consumers/App.tsx'), 'utf8');
    expect(identity).toEqual({
      appName: 'consumers',
      displayName: 'MedMate',
      bundleId: 'in.medmate.consumers',
    });
    expect(eas).toContain('"autoIncrement": false');
    expect(eas).toContain('"buildType": "apk"');
    expect(app).toContain('identity.displayName');
    expect(fs.existsSync(path.join(root, 'apps/consumers/App.test.tsx'))).toBe(true);
    expect(() => createApp(root, 'consumers', 'Again')).toThrow(/already exists/);
    expect(() => createApp(root, 'Bad', 'Name')).toThrow(/App name/);
    expect(() => createApp(root, 'ok', '  ')).toThrow(/Display name/);
  });

  it('mentions the scheme in the generated readme', () => {
    const files = appFiles({
      appName: 'consumers',
      displayName: 'MedMate',
      bundleId: 'in.medmate.consumers',
    });
    expect(files['README.md']).toContain('medmate-consumers');
    expect(files['app.config.ts']).toContain('identity.bundleId');
  });
});

describe('bumps on disk', () => {
  it('bumps package versions and app versions and build numbers', () => {
    const root = tempRoot();
    writeJson(path.join(root, 'packages/theme/package.json'), {
      name: '@medmate/theme',
      version: '0.1.0',
    });
    writeJson(path.join(root, 'tools/workspace/package.json'), {
      name: '@medmate/workspace-tools',
      version: '0.1.0',
    });
    writeJson(path.join(root, 'apps/consumers/version.json'), {
      version: '1.0.0',
      iosBuildNumber: '1',
      androidVersionCode: 1,
    });
    writeJson(path.join(root, 'apps/consumers/package.json'), {
      name: '@medmate/consumers',
      version: '9.9.9',
    });

    expect(resolveProject(root, 'consumers').kind).toBe('app');
    expect(resolveProject(root, 'theme').kind).toBe('package');
    expect(resolveProject(root, 'workspace').kind).toBe('package');
    expect(() => resolveProject(root, 'missing')).toThrow(/Unknown project/);

    expect(bumpVersion(root, 'theme', 'minor')).toBe('0.2.0');
    expect(bumpVersion(root, 'consumers', 'patch')).toBe('1.0.1');
    expect(bumpBuild(root, 'consumers')).toBe('2 2');
    expect(() => bumpBuild(root, 'theme')).toThrow(/apps only/);
    expect(() => bumpVersion(root, 'theme', 'build')).toThrow(/Release type/);
  });
});

describe('cli', () => {
  it('reads flags', () => {
    expect(readFlag(['--name', 'consumers'], '--name')).toBe('consumers');
    expect(() => readFlag(['--name'], '--name')).toThrow(/Missing --name/);
    expect(() => readFlag(['--name', '--display-name'], '--name')).toThrow(/Missing --name/);
    expect(() => readFlag([], '--name')).toThrow(/Missing --name/);
  });

  it('formats errors', () => {
    expect(formatError(new Error('nope'))).toBe('nope');
    expect(formatError('nope')).toBe('Unknown error');
  });

  it('runs the three commands and reports failures', () => {
    const root = tempRoot();
    writeJson(path.join(root, 'packages/theme/package.json'), {
      name: '@medmate/theme',
      version: '0.1.0',
    });
    const logs: string[] = [];
    const errors: string[] = [];
    const io = {
      root,
      log: (message: string) => logs.push(message),
      error: (message: string) => errors.push(message),
    };

    expect(run(['create-app', '--name', 'consumers', '--display-name', 'MedMate'], io)).toBe(0);
    expect(run(['bump-version', '--project', 'theme', '--type', 'patch'], io)).toBe(0);
    expect(run(['bump-build', '--project', 'consumers'], io)).toBe(0);
    expect(run(['nope'], io)).toBe(1);
    expect(run(['create-app', '--name', 'Bad'], io)).toBe(1);
    expect(logs[0]).toBe('Created apps/consumers');
    expect(errors.length).toBeGreaterThan(0);
  });
});
