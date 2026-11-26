import { useState } from 'react';
import { View } from 'react-native';
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

type FormRoute = {
  address: Address | null;
  pin: CurrentPin | null;
};

export function AddressFlow() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAddressStatus);
  const error = useAppSelector(selectAddressError);
  const [form, setForm] = useState<FormRoute | null>(null);

  if (status === 'idle' || status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: brand.forest }}>
        <Text variant="body" color={semantic.textOnBrand}>
          {addressLoading}
        </Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, backgroundColor: brand.forest }}>
        <Text variant="body" color={semantic.textOnBrand}>
          {error ?? addressLoading}
        </Text>
        <Button label={tryAgain} tone="gold" onPress={() => void dispatch(loadAddresses())} />
      </View>
    );
  }

  if (form) {
    return (
      <AddressFormScreen
        address={form.address}
        pin={form.pin}
        onBack={() => setForm(null)}
      />
    );
  }

  return (
    <AddressListScreen
      onCreate={(pin) => setForm({ address: null, pin })}
      onEdit={(address) => setForm({ address, pin: null })}
    />
  );
}
