import { apiBaseUrl, configuredApiBaseUrl } from './env';

describe('apiBaseUrl', () => {
  it('uses the local pharmacy server when the override is blank', () => {
    expect(apiBaseUrl(undefined)).toBe('http://127.0.0.1:8080');
    expect(apiBaseUrl('   ')).toBe('http://127.0.0.1:8080');
  });

  it('trims a trailing slash', () => {
    expect(apiBaseUrl('http://example.com/')).toBe('http://example.com');
    expect(apiBaseUrl('http://example.com')).toBe('http://example.com');
  });

  it('reads EXPO_PUBLIC_API_URL', () => {
    const previous = process.env.EXPO_PUBLIC_API_URL;
    process.env.EXPO_PUBLIC_API_URL = 'http://example.com/';
    expect(configuredApiBaseUrl()).toBe('http://example.com');
    if (previous === undefined) delete process.env.EXPO_PUBLIC_API_URL;
    else process.env.EXPO_PUBLIC_API_URL = previous;
  });
});
