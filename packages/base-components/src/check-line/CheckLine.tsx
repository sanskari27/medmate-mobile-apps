import { View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Icon } from '../icon/Icon';
import { Text } from '../text/Text';

export function CheckLine({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View
      className="gap-sm flex-row items-center"
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Icon
        name={checked ? 'check' : 'minus'}
        color={checked ? semantic.action : semantic.textFaint}
      />
      <Text>{label}</Text>
    </View>
  );
}
