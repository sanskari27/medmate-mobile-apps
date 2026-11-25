import { Pressable, View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Icon, type IconName } from '../icon/Icon';
import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export function ListItem({
  title,
  subtitle,
  icon,
  chevron = false,
  onPress,
  disabled = false,
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  chevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, onPress)}
      className="gap-md py-md flex-row items-center"
    >
      {icon ? <Icon name={icon} color={semantic.text} /> : null}
      <View className="flex-1">
        <Text variant="bodyStrong">{title}</Text>
        {subtitle ? (
          <Text variant="caption" color={semantic.textMuted}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {chevron ? <Icon name="chev-r" color={semantic.textMuted} /> : null}
    </Pressable>
  );
}
