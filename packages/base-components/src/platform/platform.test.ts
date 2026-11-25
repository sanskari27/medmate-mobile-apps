import { resolvePlatformKey } from './platform';

describe('resolvePlatformKey', () => {
  it('honours an explicit override', () => {
    expect(resolvePlatformKey('android', 'ios')).toBe('ios');
    expect(resolvePlatformKey('ios', 'android')).toBe('android');
  });

  it('falls back to the runtime and treats web as iOS', () => {
    expect(resolvePlatformKey('android', undefined)).toBe('android');
    expect(resolvePlatformKey('ios', undefined)).toBe('ios');
    expect(resolvePlatformKey('web', 'other')).toBe('ios');
  });
});
