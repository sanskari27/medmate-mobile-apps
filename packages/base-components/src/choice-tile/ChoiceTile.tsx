import { Pressable } from 'react-native';
import { cn, semantic } from '@medmate/theme';

import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export function ChoiceTile({
  label,
  description,
  selected,
  onPress,
  disabled = false,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, onPress)}
      className={cn(
        'p-md rounded-lg border',
        selected ? 'border-brand-green bg-mint-50' : 'border-semantic-border bg-semantic-surface',
      )}
    >
      <Text variant="cardName">{label}</Text>
      {description ? (
        <Text variant="caption" color={semantic.textMuted}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
}
