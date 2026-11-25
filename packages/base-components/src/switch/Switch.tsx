import { Pressable } from 'react-native';
import { cn, semantic } from '@medmate/theme';

import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export function Switch({
  label,
  value,
  onValueChange,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, () => onValueChange(!value))}
      className={cn('rounded-pill px-lg py-sm', value ? 'bg-brand-green' : 'bg-neutral-surface3')}
    >
      <Text color={value ? semantic.textOnBrand : semantic.text}>{label}</Text>
    </Pressable>
  );
}
