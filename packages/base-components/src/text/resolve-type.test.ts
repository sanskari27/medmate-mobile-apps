import { resolveType } from './resolve-type';

describe('resolveType', () => {
  it('resolves roles and platform tokens, including cross-platform fallbacks', () => {
    expect(resolveType('sectionTitle', 'ios').fontSize).toBe(22);
    expect(resolveType('sectionTitle', 'android').fontSize).toBe(22);
    expect(resolveType('largeTitle', 'ios').fontSize).toBe(34);
    expect(resolveType('displaySmall', 'android').fontSize).toBe(36);
    expect(resolveType('largeTitle', 'android').fontSize).toBe(34);
    expect(resolveType('displaySmall', 'ios').fontSize).toBe(36);
    expect(resolveType('missing' as 'body', 'ios').fontSize).toBe(17);
  });
});
