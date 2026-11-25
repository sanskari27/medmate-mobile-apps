import { renderUi } from '../../test/render';
import { Eyebrow } from './Eyebrow';

describe('Eyebrow', () => {
  it('renders uppercase label text', () => {
    const view = renderUi(<Eyebrow>Care</Eyebrow>);
    expect(view.getByText('Care')).toBeTruthy();
  });
});
