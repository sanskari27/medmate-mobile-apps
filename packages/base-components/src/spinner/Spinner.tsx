import { ActivityIndicator, View } from 'react-native';
import { semantic } from '@medmate/theme';

export function Spinner({
  size = 'small',
  label = 'Loading',
}: {
  size?: 'small' | 'large';
  label?: string;
}) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size={size === 'large' ? 'large' : 'small'} color={semantic.action} />
    </View>
  );
}
