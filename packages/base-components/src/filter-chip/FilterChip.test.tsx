import { renderUi } from '../../test/render';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders an idle filter', () => {
    const view = renderUi(<FilterChip label="In stock" />);
    expect(view.getByLabelText('In stock')).toBeTruthy();
  });
});
