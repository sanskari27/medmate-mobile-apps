import { renderUi } from '../../test/render';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('renders complete, current, and upcoming steps', () => {
    const view = renderUi(
      <Stepper
        steps={[
          { label: 'Cart', state: 'complete' },
          { label: 'Address', state: 'current' },
          { label: 'Pay', state: 'upcoming' },
        ]}
      />,
    );
    expect(view.getByLabelText('Cart')).toBeTruthy();
    expect(view.getByLabelText('Address')).toBeTruthy();
    expect(view.getByLabelText('Pay')).toBeTruthy();
  });
});
