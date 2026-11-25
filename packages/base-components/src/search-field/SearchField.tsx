import { Pressable, View } from 'react-native';
import { semantic } from '@medmate/theme';

import { Icon } from '../icon/Icon';
import { TextField, type TextFieldProps } from '../text-field/TextField';

export function SearchField({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search',
  ...field
}: Omit<TextFieldProps, 'label' | 'placeholder'> & {
  placeholder?: string;
  onClear?: () => void;
}) {
  return (
    <View className="gap-xs flex-row items-center">
      <Icon name="search" color={semantic.textMuted} />
      <View className="flex-1">
        <TextField
          {...field}
          label="Search"
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
        />
      </View>
      {value.length > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={onClear}>
          <Icon name="x" color={semantic.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
