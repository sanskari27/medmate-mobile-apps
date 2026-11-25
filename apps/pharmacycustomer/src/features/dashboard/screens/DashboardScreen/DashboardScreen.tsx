import { Button, Screen, Text } from '@medmate/base-components';

import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { selectAccountPhone } from '../../../../store/selectors/auth.selectors';
import { signOut } from '../../../auth/store/auth.slice';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const phone = useAppSelector(selectAccountPhone);

  return (
    <Screen>
      <Text variant="title2">Your account</Text>
      <Text variant="body">{phone}</Text>
      <Button label="Sign out" tone="outline" onPress={() => void dispatch(signOut())} />
    </Screen>
  );
}
