import type { StyleProp, ViewStyle } from 'react-native';

import { Button } from '../button/Button';

export function AddButton({
  label = 'ADD',
  onPress,
  disabled = false,
  style,
}: {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      label={label}
      tone="filled"
      icon="plus"
      onPress={onPress}
      disabled={disabled}
      style={style}
    />
  );
}
