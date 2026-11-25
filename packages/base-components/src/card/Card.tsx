import type { ReactNode } from 'react';
import { View } from 'react-native';
import { cn, elevation } from '@medmate/theme';

export function Card({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <View
      className={cn('rounded-card bg-semantic-surface p-lg', className)}
      style={elevation.medium}
    >
      {children}
    </View>
  );
}
