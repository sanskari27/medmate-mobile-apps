import { Platform, Pressable } from 'react-native';
import { metrics, semantic } from '@medmate/theme';

import { Icon, type IconName } from '../icon/Icon';
import { resolvePlatformKey } from '../platform/platform';
import { pressHandler } from '../press/press';

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  disabled = false,
}: {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const platform = resolvePlatformKey(Platform.OS, process.env.EXPO_PUBLIC_PLATFORM);
  const target = metrics[platform].touchTarget;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, onPress)}
      className="items-center justify-center"
      style={{ minWidth: target, minHeight: target }}
    >
      <Icon name={icon} color={disabled ? semantic.textFaint : semantic.text} />
    </Pressable>
  );
}
