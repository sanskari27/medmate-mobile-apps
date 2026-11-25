import { View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Button } from '../button/Button';
import { Text } from '../text/Text';

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="gap-sm px-lg py-xxl items-center">
      <Text variant="title3">{title}</Text>
      <Text variant="body" color={semantic.textMuted}>
        {message}
      </Text>
      {actionLabel ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
