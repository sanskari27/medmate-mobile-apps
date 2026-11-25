import { Button } from '../button/Button';
import type { IconName } from '../icon/Icon';

export function OutlinePillButton({
  label,
  onPress,
  disabled = false,
  icon,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: IconName;
}) {
  return (
    <Button
      label={label}
      tone="outline"
      icon={icon ?? null}
      onPress={onPress}
      disabled={disabled}
    />
  );
}
