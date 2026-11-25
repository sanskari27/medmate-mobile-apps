import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../text/Text';

export function Modal({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <View
      className="bg-semantic-scrim px-lg absolute inset-0 justify-center"
      accessibilityViewIsModal
    >
      <Pressable accessibilityRole="button" accessibilityLabel="Close dialog" onPress={onClose} />
      <View className="rounded-card bg-semantic-surface p-lg">
        <Text variant="title3">{title}</Text>
        {children}
      </View>
    </View>
  );
}
