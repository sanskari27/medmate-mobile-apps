import { TextInput, View } from 'react-native';
import { cn, semantic } from '@medmate/theme';

import { Text } from '../text/Text';

export type TextFieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
}: TextFieldProps) {
  return (
    <View className="gap-xs">
      <Text variant="caption">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        placeholder={placeholder}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        onChangeText={disabled ? undefined : onChangeText}
        className={cn(
          'px-md py-sm text-semantic-text rounded-lg border',
          error ? 'border-semantic-danger' : 'border-semantic-border',
          disabled ? 'opacity-40' : 'opacity-100',
        )}
        placeholderTextColor={semantic.textFaint}
      />
      {error ? (
        <Text variant="caption" color={semantic.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
