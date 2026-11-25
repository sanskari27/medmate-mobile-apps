import { View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Text } from '../text/Text';

export function FactTile({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-semantic-surfaceMuted p-md rounded-lg">
      <Text variant="caption" color={semantic.textMuted}>
        {label}
      </Text>
      <Text variant="amount">{value}</Text>
    </View>
  );
}
