const APP_NAME = /^[a-z][a-z0-9]*$/;

export function assertAppName(name: string): void {
  if (!APP_NAME.test(name)) {
    throw new Error('App name must match ^[a-z][a-z0-9]*$');
  }
}

export function bundleIdFor(appName: string): string {
  assertAppName(appName);
  return `in.medmate.${appName}`;
}

export function assertDisplayName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    throw new Error('Display name is required');
  }
  return trimmed;
}

export function schemeFor(appName: string): string {
  assertAppName(appName);
  return `medmate-${appName}`;
}
