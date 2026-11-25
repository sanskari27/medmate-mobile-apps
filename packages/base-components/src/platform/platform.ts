import type { PlatformKey } from '@medmate/theme';

/** iOS, Android, or an explicit EXPO_PUBLIC_PLATFORM override. Web follows iOS. */
export function resolvePlatformKey(os: string, override: string | undefined): PlatformKey {
  if (override === 'ios' || override === 'android') return override;
  if (os === 'android') return 'android';
  return 'ios';
}
