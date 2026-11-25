import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn, gutter } from '@medmate/theme';

export function Screen({ children, className }: { children?: ReactNode; className?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('bg-semantic-page flex-1', className)}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: gutter }}
    >
      {children}
    </View>
  );
}
