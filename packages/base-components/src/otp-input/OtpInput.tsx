import { TextInput, View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Text } from '../text/Text';

export function sanitizeOtp(value: string, length: number): string {
  return value.replace(/\D/g, '').slice(0, length);
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}: {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View className="gap-xs">
      <Text variant="caption">One time code</Text>
      <TextInput
        accessibilityLabel="One time code"
        value={value}
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={length}
        onChangeText={disabled ? undefined : (next) => onChange(sanitizeOtp(next, length))}
        className="border-semantic-border px-md py-sm text-semantic-text rounded-lg border"
        placeholderTextColor={semantic.textFaint}
      />
    </View>
  );
}
