import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@medmate/base-components';
import { semantic } from '@medmate/theme';

import { CartScreen } from '../../../home/screens/CartScreen/CartScreen';
import { ChatScreen } from '../../../home/screens/ChatScreen/ChatScreen';
import { DosageScreen } from '../../../home/screens/DosageScreen/DosageScreen';
import { HomeScreen } from '../../../home/screens/HomeScreen/HomeScreen';
import { cartTitle, chatTitle, dosageTitle, homeTab } from '../../../home/utils/copy';
import { HomeTabBar } from '../../components/HomeTabBar';

export type HomeTabParamList = {
  Home: undefined;
  Cart: undefined;
  Dosage: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export function DashboardScreen() {
  return (
    <Tab.Navigator
      tabBar={HomeTabBar}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: semantic.page },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: homeTab,
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: cartTitle,
          tabBarIcon: ({ color, size }) => <Icon name="bag" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Dosage"
        component={DosageScreen}
        options={{
          title: dosageTitle,
          tabBarIcon: ({ color, size }) => <Icon name="pill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: chatTitle,
          tabBarIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
