import fs from 'node:fs';
import path from 'node:path';

import { appFiles } from './files';
import { assertAppName, assertDisplayName, bundleIdFor } from './identity';
import { assertReleaseType, bumpBuildNumbers, bumpSemver, type VersionFile } from './version';

export type Io = {
  root: string;
  log: (message: string) => void;
  error: (message: string) => void;
};

export function readFlag(argv: string[], flag: string): string {
  const index = argv.indexOf(flag);
  const value = index >= 0 ? argv[index + 1] : undefined;
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing ${flag}`);
  }
  return value;
}

export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

export type ProjectLocation = { kind: 'app' | 'package'; dir: string };

export function resolveProject(root: string, project: string): ProjectLocation {
  const appDir = path.join(root, 'apps', project);
  if (fs.existsSync(path.join(appDir, 'version.json'))) {
    return { kind: 'app', dir: appDir };
  }

  const packageDir = path.join(root, 'packages', project);
  if (fs.existsSync(path.join(packageDir, 'package.json'))) {
    return { kind: 'package', dir: packageDir };
  }

  const toolDir = path.join(root, 'tools', project);
  if (fs.existsSync(path.join(toolDir, 'package.json'))) {
    return { kind: 'package', dir: toolDir };
  }

  throw new Error(`Unknown project: ${project}`);
}

export function createApp(root: string, name: string, displayName: string): void {
  assertAppName(name);
  const trimmed = assertDisplayName(displayName);
  const appDir = path.join(root, 'apps', name);
  if (fs.existsSync(appDir)) {
    throw new Error(`App already exists: ${name}`);
  }

  const files = appFiles({ appName: name, displayName: trimmed, bundleId: bundleIdFor(name) });
  for (const [relative, contents] of Object.entries(files)) {
    const target = path.join(appDir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
}

export function bumpVersion(root: string, project: string, type: string): string {
  const release = assertReleaseType(type);
  const location = resolveProject(root, project);

  if (location.kind === 'app') {
    const filePath = path.join(location.dir, 'version.json');
    const current = JSON.parse(fs.readFileSync(filePath, 'utf8')) as VersionFile;
    const next = { ...current, version: bumpSemver(current.version, release) };
    fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`);
    return next.version;
  }

  const filePath = path.join(location.dir, 'package.json');
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8')) as { version: string };
  const nextVersion = bumpSemver(current.version, release);
  fs.writeFileSync(filePath, `${JSON.stringify({ ...current, version: nextVersion }, null, 2)}\n`);
  return nextVersion;
}

export function bumpBuild(root: string, project: string): string {
  const location = resolveProject(root, project);
  if (location.kind !== 'app') {
    throw new Error('Build numbers apply to apps only');
  }

  const filePath = path.join(location.dir, 'version.json');
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8')) as VersionFile;
  const next = bumpBuildNumbers(current);
  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`);
  return `${next.iosBuildNumber} ${next.androidVersionCode}`;
}

export function run(argv: string[], io: Io): number {
  const [command, ...rest] = argv;
  try {
    if (command === 'create-app') {
      const name = readFlag(rest, '--name');
      const displayName = readFlag(rest, '--display-name');
      createApp(io.root, name, displayName);
      io.log(`Created apps/${name}`);
      return 0;
    }
    if (command === 'bump-version') {
      const project = readFlag(rest, '--project');
      const type = readFlag(rest, '--type');
      io.log(bumpVersion(io.root, project, type));
      return 0;
    }
    if (command === 'bump-build') {
      const project = readFlag(rest, '--project');
      io.log(bumpBuild(io.root, project));
      return 0;
    }
    io.error('Unknown command. Use create-app, bump-version, or bump-build.');
    return 1;
  } catch (error) {
    io.error(formatError(error));
    return 1;
  }
}
