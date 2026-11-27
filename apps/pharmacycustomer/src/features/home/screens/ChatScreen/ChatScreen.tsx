import { Screen, Text } from '@medmate/base-components';

import { chatTitle } from '../../utils/copy';

export function ChatScreen() {
  return (
    <Screen>
      <Text variant="title2">{chatTitle}</Text>
    </Screen>
  );
}
