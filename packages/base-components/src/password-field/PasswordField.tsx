import { Pressable, View } from 'react-native';

import { Text } from '../text/Text';
import { TextField, type TextFieldProps } from '../text-field/TextField';

export function PasswordField({
  revealed = false,
  onToggleReveal,
  ...field
}: Omit<TextFieldProps, 'secureTextEntry'> & {
  revealed?: boolean;
  onToggleReveal?: () => void;
}) {
  return (
    <View className="gap-xs">
      <TextField {...field} secureTextEntry={!revealed} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
        onPress={onToggleReveal}
      >
        <Text variant="caption">{revealed ? 'Hide' : 'Show'}</Text>
      </Pressable>
    </View>
  );
}
