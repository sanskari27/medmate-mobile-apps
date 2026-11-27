import { Screen, Text } from '@medmate/base-components';

import { cartTitle } from '../../utils/copy';

export function CartScreen() {
  return (
    <Screen>
      <Text variant="title2">{cartTitle}</Text>
    </Screen>
  );
}
