import { semantic } from '@medmate/theme';

import { Chip, type ChipProps } from '../chip/Chip';

export function FilterChip(props: ChipProps) {
  return (
    <Chip
      {...props}
      selectedClass="bg-brand-green"
      idleClass="bg-neutral-surface3"
      selectedColor={semantic.textOnBrand}
    />
  );
}
