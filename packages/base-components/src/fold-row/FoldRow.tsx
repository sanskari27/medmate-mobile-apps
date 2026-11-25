import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../text/Text';

export function FoldRow({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        onPress={onToggle}
      >
        <Text>{title}</Text>
      </Pressable>
      {expanded ? children : null}
    </View>
  );
}
