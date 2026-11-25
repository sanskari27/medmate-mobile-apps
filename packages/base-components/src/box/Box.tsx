import type { ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '@medmate/theme';

export function Box({ children, className }: { children?: ReactNode; className?: string }) {
  return <View className={cn('bg-semantic-surface', className)}>{children}</View>;
}
