import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { ServiceChip } from './ServiceChip';

describe('ServiceChip', () => {
  it('renders selected, idle, and disabled states', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <ServiceChip label="Delivery" selected onPress={onPress} />
        <ServiceChip label="Pickup" onPress={onPress} />
        <ServiceChip label="Closed" disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Delivery'));
    fireEvent.press(view.getByLabelText('Closed'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
