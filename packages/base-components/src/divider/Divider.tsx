import { View } from 'react-native';
import { cn } from '@medmate/theme';

import { Text } from '../text/Text';

export function Divider({
  strong = false,
  dashed = false,
  label,
}: {
  strong?: boolean;
  dashed?: boolean;
  label?: string;
}) {
  const rule = cn(
    'h-px flex-1 border-t',
    dashed ? 'border-dashed' : 'border-solid',
    'border-semantic-border',
  );

  if (label) {
    return (
      <View className="gap-sm flex-row items-center">
        <View className={rule} />
        <Text variant="caption">{label}</Text>
        <View className={rule} />
      </View>
    );
  }

  return (
    <View
      className={cn(
        'border-t',
        strong ? 'border-semantic-borderStrong' : 'border-semantic-border',
        dashed ? 'border-dashed' : 'border-solid',
      )}
    />
  );
}
