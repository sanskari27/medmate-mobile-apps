import { renderUi } from '../../test/render';
import { CategoryChip } from './CategoryChip';

describe('CategoryChip', () => {
  it('renders a selected category', () => {
    const view = renderUi(<CategoryChip label="Vitamins" selected />);
    expect(view.getByLabelText('Vitamins')).toBeTruthy();
  });
});
