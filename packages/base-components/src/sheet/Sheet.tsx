import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../text/Text';

export function Sheet({
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
    <View className="bg-semantic-scrim absolute inset-0 justify-end" accessibilityViewIsModal>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss sheet" onPress={onClose} />
      <View className="bg-semantic-surface p-lg rounded-t-xl">
        <Text variant="title3">{title}</Text>
        {children}
      </View>
    </View>
  );
}
