import { View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Icon, type IconName } from '../icon/Icon';
import { Text } from '../text/Text';

export function IconTile({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View
      accessibilityLabel={label}
      className="bg-mint-50 p-md items-center justify-center rounded-lg"
    >
      <Icon name={icon} color={semantic.action} />
      <Text variant="tileLabel">{label}</Text>
    </View>
  );
}
