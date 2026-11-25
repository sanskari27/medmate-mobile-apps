import type { ReactNode } from 'react';
import { View } from 'react-native';
import { cn, type SpacingToken } from '@medmate/theme';

export function Stack({
  children,
  className,
  direction = 'column',
  gap = 'lg',
}: {
  children?: ReactNode;
  className?: string;
  direction?: 'row' | 'column';
  gap?: SpacingToken;
}) {
  return (
    <View className={cn(direction === 'row' ? 'flex-row' : 'flex-col', `gap-${gap}`, className)}>
      {children}
    </View>
  );
}
