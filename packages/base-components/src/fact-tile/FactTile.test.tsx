import { renderUi } from '../../test/render';
import { FactTile } from './FactTile';

describe('FactTile', () => {
  it('renders the label and value', () => {
    const view = renderUi(<FactTile label="Total" value="₹120" />);
    expect(view.getByText('₹120')).toBeTruthy();
  });
});
