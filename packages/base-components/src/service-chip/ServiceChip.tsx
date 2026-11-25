import { Chip, type ChipProps } from '../chip/Chip';

export function ServiceChip(props: ChipProps) {
  return <Chip {...props} selectedClass="bg-mint-100" idleClass="bg-semantic-surface" />;
}
