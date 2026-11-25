import { View } from 'react-native';

import { Text } from '../text/Text';

export function avatarSize(size: 'sm' | 'md' | 'lg'): number {
  if (size === 'sm') return 32;
  if (size === 'lg') return 56;
  return 40;
}

export function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const dimension = avatarSize(size);
  return (
    <View
      accessibilityLabel={initials}
      className="rounded-circle bg-mint-100 items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <Text variant="captionStrong">{initials}</Text>
    </View>
  );
}
