import { Pressable, View } from 'react-native';
import { cn } from '@medmate/theme';

import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export type RadioOption = { label: string; value: string; disabled?: boolean };

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} className="gap-sm">
      {options.map((option) => {
        const optionDisabled = disabled || Boolean(option.disabled);
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: option.value === value, disabled: optionDisabled }}
            disabled={optionDisabled}
            onPress={pressHandler(optionDisabled, () => onChange(option.value))}
            className="gap-sm flex-row items-center"
          >
            <View
              className={cn(
                'rounded-circle h-4 w-4 border',
                option.value === value
                  ? 'border-brand-green bg-brand-green'
                  : 'border-semantic-border',
              )}
            />
            <Text>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
