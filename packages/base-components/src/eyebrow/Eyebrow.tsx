import type { ReactNode } from 'react';

import { Text } from '../text/Text';

export function Eyebrow({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <Text variant="eyebrow" className={className}>
      {children}
    </Text>
  );
}
