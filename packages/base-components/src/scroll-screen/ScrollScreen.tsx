import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn, gutter } from '@medmate/theme';

export function ScrollScreen({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className={cn('bg-semantic-page flex-1', className)}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: gutter,
      }}
    >
      {children}
    </ScrollView>
  );
}
