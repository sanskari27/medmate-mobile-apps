import { Chip, type ChipProps } from '../chip/Chip';

export function CategoryChip(props: ChipProps) {
  return <Chip {...props} selectedClass="bg-gold-100" idleClass="bg-semantic-surface" />;
}
