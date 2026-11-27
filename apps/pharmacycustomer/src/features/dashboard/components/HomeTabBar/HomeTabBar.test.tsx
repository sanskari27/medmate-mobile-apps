import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { brand, semantic } from '@medmate/theme';

import { renderTabIcon, tabIconInk, tabInk, tabTitle } from './HomeTabBar';

describe('HomeTabBar', () => {
  it('uses the route name when a tab has no title', () => {
    expect(tabTitle(undefined, 'Home')).toBe('Home');
    expect(tabTitle('Cart', 'Cart')).toBe('Cart');
  });

  it('paints the accent label white, the chat icon gold, and the selected pill tab green', () => {
    expect(tabInk(true, false)).toBe(semantic.textOnBrand);
    expect(tabInk(true, true)).toBe(semantic.textOnBrand);
    expect(tabInk(false, true)).toBe(brand.green);
    expect(tabInk(false, false)).toBe(semantic.text);
    expect(tabIconInk(true, false)).toBe(brand.gold);
    expect(tabIconInk(true, true)).toBe(brand.gold);
    expect(tabIconInk(false, true)).toBe(brand.green);
    expect(tabIconInk(false, false)).toBe(semantic.text);
  });

  it('skips a tab that has no icon', () => {
    expect(renderTabIcon(undefined, true, brand.forest)).toBeNull();
    const icon = jest.fn<
      ReturnType<NonNullable<BottomTabNavigationOptions['tabBarIcon']>>,
      Parameters<NonNullable<BottomTabNavigationOptions['tabBarIcon']>>
    >(() => null);
    expect(renderTabIcon(icon, false, semantic.text)).toBeNull();
    expect(icon).toHaveBeenCalledWith({ focused: false, color: semantic.text, size: 20 });
  });
});
