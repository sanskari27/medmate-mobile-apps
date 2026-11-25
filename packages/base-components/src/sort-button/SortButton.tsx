import { OutlinePillButton } from '../outline-pill-button/OutlinePillButton';

export function SortButton({
  onPress,
  disabled = false,
}: {
  onPress?: () => void;
  disabled?: boolean;
}) {
  return <OutlinePillButton label="Sort" icon="chev-d" onPress={onPress} disabled={disabled} />;
}
