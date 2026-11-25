export type ReleaseType = 'patch' | 'minor' | 'major';

export type VersionFile = {
  version: string;
  iosBuildNumber: string;
  androidVersionCode: number;
};

export function assertReleaseType(type: string): ReleaseType {
  if (type === 'patch' || type === 'minor' || type === 'major') return type;
  throw new Error('Release type must be patch, minor, or major');
}

export function bumpSemver(version: string, type: ReleaseType): string {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Invalid semver: ${version}`);
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  if (type === 'patch') return `${major}.${minor}.${patch + 1}`;
  throw new Error(`Unknown release type: ${String(type)}`);
}

export function bumpBuildNumbers(file: VersionFile): VersionFile {
  const iosBuild = Number(file.iosBuildNumber);
  if (!Number.isInteger(iosBuild) || iosBuild < 0) {
    throw new Error('iosBuildNumber must be a non-negative integer');
  }
  if (!Number.isInteger(file.androidVersionCode) || file.androidVersionCode < 0) {
    throw new Error('androidVersionCode must be a non-negative integer');
  }

  return {
    version: file.version,
    iosBuildNumber: String(iosBuild + 1),
    androidVersionCode: file.androidVersionCode + 1,
  };
}
