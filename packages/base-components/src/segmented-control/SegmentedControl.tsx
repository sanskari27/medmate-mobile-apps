import { Pressable, View } from 'react-native';
import { cn, semantic } from '@medmate/theme';

import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export function SegmentedControl({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View className="rounded-pill bg-neutral-surface3 p-xxs flex-row">
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={option}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={pressHandler(disabled, () => onChange(option))}
            className={cn(
              'rounded-pill px-md py-sm flex-1',
              selected ? 'bg-semantic-surface' : 'bg-transparent',
            )}
          >
            <Text color={selected ? semantic.text : semantic.textMuted}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
