import { Screen, Text } from '@medmate/base-components';

import { dosageTitle } from '../../utils/copy';

export function DosageScreen() {
  return (
    <Screen>
      <Text variant="title2">{dosageTitle}</Text>
    </Screen>
  );
}
