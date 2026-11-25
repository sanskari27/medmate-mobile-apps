import { View } from 'react-native';
import { cn } from '@medmate/theme';

import { Text } from '../text/Text';

export type BannerTone = 'info' | 'warning' | 'danger';

const bannerClass: Record<BannerTone, string> = {
  info: 'bg-mint-50',
  warning: 'bg-gold-50',
  danger: 'bg-semantic-dangerMuted',
};

export function Banner({
  title,
  message,
  tone = 'info',
}: {
  title: string;
  message: string;
  tone?: BannerTone;
}) {
  return (
    <View className={cn('gap-xxs px-lg py-md rounded-lg', bannerClass[tone])}>
      <Text variant="cardTitle">{title}</Text>
      <Text variant="caption">{message}</Text>
    </View>
  );
}
