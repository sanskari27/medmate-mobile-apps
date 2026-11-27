import { renderWithStore } from '../../../../../test/render';
import { cartTitle } from '../../utils/copy';
import { CartScreen } from './CartScreen';

describe('CartScreen', () => {
  it('shows the cart title', () => {
    const view = renderWithStore(<CartScreen />);
    expect(view.getByText(cartTitle)).toBeTruthy();
  });
});
