import { renderUi } from '../../test/render';
import { IconTile } from './IconTile';

describe('IconTile', () => {
  it('renders the icon label', () => {
    const view = renderUi(<IconTile icon="pill" label="Medicine" />);
    expect(view.getByLabelText('Medicine')).toBeTruthy();
  });
});
