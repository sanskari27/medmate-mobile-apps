import { View, type StyleProp, type ViewStyle } from 'react-native';
import { brand, radii } from '@medmate/theme';

import { Gradient } from '../gradient/Gradient';
import { Text } from '../text/Text';

export function artSize(
  width: number | undefined,
  height: number | undefined,
  size: number | undefined,
): { width: number; height: number } {
  return {
    width: width ?? size ?? 0,
    height: height ?? size ?? 0,
  };
}

export function ArtTile({
  size,
  width,
  height,
  radius = radii.lg,
  initials,
  photo,
  style,
}: {
  size?: number;
  width?: number;
  height?: number;
  radius?: number;
  initials?: string;
  photo?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const box = artSize(width, height, size);

  return (
    <Gradient token="art" radius={radius} style={[{ width: box.width, height: box.height }, style]}>
      {photo != null ? null : initials ? (
        <View className="flex-1 items-center justify-center">
          <Text variant="title3" color={brand.green700}>
            {initials}
          </Text>
        </View>
      ) : null}
    </Gradient>
  );
}
