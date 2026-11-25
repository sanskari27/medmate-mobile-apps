import { Pressable, View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Text } from '../text/Text';

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="sectionTitle">{title}</Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction}>
          <Text variant="linkLabel" color={semantic.action}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
