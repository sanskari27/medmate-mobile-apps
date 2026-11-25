import { Pressable } from 'react-native';
import { cn, semantic } from '@medmate/theme';

import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  selectedColor?: string;
};

export function Chip({
  label,
  selected = false,
  onPress,
  disabled = false,
  selectedColor,
  selectedClass,
  idleClass,
}: ChipProps & {
  selectedClass: string;
  idleClass: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, onPress)}
      className={cn('rounded-pill px-md py-xs', selected ? selectedClass : idleClass)}
    >
      <Text
        variant="filterLabel"
        color={selected ? (selectedColor ?? semantic.action) : semantic.text}
      >
        {label}
      </Text>
    </Pressable>
  );
}
