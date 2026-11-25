import { Pressable } from 'react-native';
import { semantic } from '@medmate/theme';

import { Icon } from '../icon/Icon';
import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, () => onChange(!checked))}
      className="gap-sm flex-row items-center"
    >
      <Icon
        name={checked ? 'check' : 'box'}
        color={checked ? semantic.action : semantic.textMuted}
      />
      <Text>{label}</Text>
    </Pressable>
  );
}
