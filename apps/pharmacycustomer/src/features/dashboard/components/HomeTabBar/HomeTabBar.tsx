import { Text } from '@medmate/base-components';
import { brand, semantic, spacing } from '@medmate/theme';
import type { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { homeTabBarStyles as styles } from './HomeTabBar.styles';

const accentRoute = 'Chat';
const tabIconSize = 20;

export function tabTitle(title: string | undefined, name: string): string {
  if (title === undefined) return name;
  return title;
}

export function tabInk(accent: boolean, focused: boolean): string {
  if (accent) return semantic.textOnBrand;
  return focused ? brand.green : semantic.text;
}

export function tabIconInk(accent: boolean, focused: boolean): string {
  if (accent) return brand.gold;
  return tabInk(accent, focused);
}

export function renderTabIcon(
  icon: BottomTabNavigationOptions['tabBarIcon'],
  focused: boolean,
  color: string,
): ReactNode {
  if (icon === undefined) return null;
  return icon({ focused, color, size: tabIconSize });
}

type TabRoute = BottomTabBarProps['state']['routes'][number];

function openTab(
  navigation: BottomTabBarProps['navigation'],
  navigatorKey: string,
  route: TabRoute,
  focused: boolean,
): void {
  navigation.emit({
    type: 'tabPress',
    target: route.key,
    canPreventDefault: true,
    data: {
      behavior: {
        scrollToTop: focused,
        popToTop: focused,
      },
    },
  });
  navigation.dispatch({
    ...CommonActions.navigate(route.name, route.params),
    target: navigatorKey,
  });
}

type TabControlProps = {
  route: TabRoute;
  index: number;
  count: number;
  focused: boolean;
  accent: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
};

function TabControl({ route, index, count, focused, accent, options, onPress }: TabControlProps) {
  const label = tabTitle(options.title, route.name);
  const color = tabInk(accent, focused);
  const icon = renderTabIcon(options.tabBarIcon, focused, tabIconInk(accent, focused));
  const labelNode = (
    <Text variant="serviceTabLabel" color={color} numberOfLines={1}>
      {label}
    </Text>
  );

  if (accent) {
    return (
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={`${label}, tab, ${index + 1} of ${count}`}
        accessibilityState={{ selected: focused }}
        onPress={onPress}
        style={styles.chat}
      >
        {icon}
        {labelNode}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={`${label}, tab, ${index + 1} of ${count}`}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      style={styles.slot}
    >
      <View style={[styles.face, focused ? styles.faceSelected : null]}>
        {icon}
        {labelNode}
      </View>
    </Pressable>
  );
}

export function HomeTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const count = state.routes.length;

  return (
    <View style={[styles.bar, { paddingBottom: spacing.xxl }]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          if (route.name === accentRoute) return null;
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          return (
            <TabControl
              key={route.key}
              route={route}
              index={index}
              count={count}
              focused={focused}
              accent={false}
              options={options}
              onPress={() => openTab(navigation, state.key, route, focused)}
            />
          );
        })}
      </View>
      {state.routes.map((route, index) => {
        if (route.name !== accentRoute) return null;
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        return (
          <TabControl
            key={route.key}
            route={route}
            index={index}
            count={count}
            focused={focused}
            accent
            options={options}
            onPress={() => openTab(navigation, state.key, route, focused)}
          />
        );
      })}
    </View>
  );
}
