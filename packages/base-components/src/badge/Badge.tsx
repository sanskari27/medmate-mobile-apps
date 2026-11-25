import { cn } from '@medmate/theme';

import { Text } from '../text/Text';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

const badgeClass: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-surface3',
  success: 'bg-mint-100',
  warning: 'bg-gold-100',
  danger: 'bg-semantic-dangerMuted',
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <Text
      variant="tag"
      className={cn('rounded-pill px-sm py-xxs overflow-hidden', badgeClass[tone])}
    >
      {label}
    </Text>
  );
}
