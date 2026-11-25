import { View } from 'react-native';

import { Button } from '../button/Button';
import { Text } from '../text/Text';

export function Dialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;

  return (
    <View className="rounded-card bg-semantic-surface p-lg" accessibilityViewIsModal>
      <Text variant="title3">{title}</Text>
      <Text variant="body">{message}</Text>
      <Button label={cancelLabel} tone="outline" onPress={onCancel} />
      <Button label={confirmLabel} tone="filled" onPress={onConfirm} />
    </View>
  );
}
