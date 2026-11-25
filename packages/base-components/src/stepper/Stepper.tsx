import { View } from 'react-native';
import { cn } from '@medmate/theme';

import { Text } from '../text/Text';

export type StepState = 'complete' | 'current' | 'upcoming';

const stepClass: Record<StepState, string> = {
  complete: 'bg-brand-green',
  current: 'bg-gold-300',
  upcoming: 'bg-neutral-surface3',
};

export function Stepper({ steps }: { steps: { label: string; state: StepState }[] }) {
  return (
    <View className="gap-sm">
      {steps.map((step) => (
        <View
          key={step.label}
          className="gap-sm flex-row items-center"
          accessibilityLabel={step.label}
        >
          <View className={cn('rounded-circle h-3 w-3', stepClass[step.state])} />
          <Text>{step.label}</Text>
        </View>
      ))}
    </View>
  );
}
