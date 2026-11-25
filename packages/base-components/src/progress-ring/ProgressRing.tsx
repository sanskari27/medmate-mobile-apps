import { View } from 'react-native';

import { Text } from '../text/Text';

export function clampProgress(progress: number): number {
  if (progress < 0) return 0;
  if (progress > 1) return 1;
  return progress;
}

export function ProgressRing({ progress, label }: { progress: number; label: string }) {
  const value = clampProgress(progress);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      className="items-center justify-center"
    >
      <Text variant="amount">{`${Math.round(value * 100)}%`}</Text>
    </View>
  );
}
