import { Pressable, View } from 'react-native';

import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export function stepQuantity(value: number, delta: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value + delta));
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const minusDisabled = disabled || value <= min;
  const plusDisabled = disabled || value >= max;

  return (
    <View className="gap-sm flex-row items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={minusDisabled}
        onPress={pressHandler(minusDisabled, () => onChange(stepQuantity(value, -1, min, max)))}
      >
        <Text>−</Text>
      </Pressable>
      <Text>{String(value)}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={plusDisabled}
        onPress={pressHandler(plusDisabled, () => onChange(stepQuantity(value, 1, min, max)))}
      >
        <Text>+</Text>
      </Pressable>
    </View>
  );
}
