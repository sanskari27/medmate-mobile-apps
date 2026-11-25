import { renderUi } from '../../test/render';
import { InfoNote } from './InfoNote';

describe('InfoNote', () => {
  it('renders the note', () => {
    const view = renderUi(<InfoNote message="Keep the strip" />);
    expect(view.getByText('Keep the strip')).toBeTruthy();
  });
});
