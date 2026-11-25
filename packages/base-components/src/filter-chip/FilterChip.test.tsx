import { semantic } from '@medmate/theme';

import { renderUi } from '../../test/render';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders idle and selected filters', () => {
    const view = renderUi(
      <>
        <FilterChip label="In stock" />
        <FilterChip label="Delivery" selected />
      </>,
    );
    expect(view.getByLabelText('In stock')).toBeTruthy();
    expect(view.getByText('Delivery').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: semantic.textOnBrand })]),
    );
  });
});
