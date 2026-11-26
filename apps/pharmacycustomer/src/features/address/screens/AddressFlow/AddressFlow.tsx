import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button, Text } from '@medmate/base-components';
import { brand, semantic, spacing } from '@medmate/theme';

import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import type { CurrentPin } from '../../../../services/location';
import {
  selectAddressError,
  selectAddressStatus,
} from '../../../../store/selectors/address.selectors';
import { loadAddresses } from '../../store/address.slice';
import type { Address } from '../../types/address';
import { addressLoading, tryAgain } from '../../utils/copy';
import { AddressFormScreen } from '../AddressFormScreen/AddressFormScreen';
import { AddressListScreen } from '../AddressListScreen/AddressListScreen';

type AddressStackParamList = {
  Addresses: undefined;
  AddressForm: { address: Address | null; pin: CurrentPin | null };
};

const Stack = createNativeStackNavigator<AddressStackParamList>();

export function AddressFlow() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: brand.forest },
      }}
    >
      <Stack.Screen name="Addresses" component={AddressListRoute} />
      <Stack.Screen name="AddressForm" component={AddressFormRoute} />
    </Stack.Navigator>
  );
}

function AddressListRoute() {
  const navigation = useNavigation<NativeStackNavigationProp<AddressStackParamList, 'Addresses'>>();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAddressStatus);
  const error = useAppSelector(selectAddressError);

  if (status === 'idle' || status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: brand.forest,
        }}
      >
        <Text variant="body" color={semantic.textOnBrand}>
          {addressLoading}
        </Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.lg,
          backgroundColor: brand.forest,
        }}
      >
        <Text variant="body" color={semantic.textOnBrand}>
          {error ?? addressLoading}
        </Text>
        <Button label={tryAgain} tone="gold" onPress={() => void dispatch(loadAddresses())} />
      </View>
    );
  }

  return (
    <AddressListScreen
      onCreate={(pin) => navigation.navigate('AddressForm', { address: null, pin })}
      onEdit={(address) => navigation.navigate('AddressForm', { address, pin: null })}
    />
  );
}

function AddressFormRoute({
  route,
  navigation,
}: NativeStackScreenProps<AddressStackParamList, 'AddressForm'>) {
  return (
    <AddressFormScreen
      address={route.params.address}
      pin={route.params.pin}
      onBack={() => navigation.goBack()}
    />
  );
}
