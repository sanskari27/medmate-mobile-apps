import { View } from 'react-native';

import { Text } from '../text/Text';

export function InfoNote({ message }: { message: string }) {
  return (
    <View className="bg-mint-50 px-lg py-md rounded-lg">
      <Text variant="caption">{message}</Text>
    </View>
  );
}
