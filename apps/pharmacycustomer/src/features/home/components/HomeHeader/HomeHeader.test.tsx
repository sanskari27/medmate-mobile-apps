import { fireEvent } from '@testing-library/react-native';

import { renderWithStore } from '../../../../../test/render';
import { deliveryUnit, deliveryWindow, profileLabel, searchLabel } from '../../utils/copy';
import { HomeHeader } from './HomeHeader';

describe('HomeHeader', () => {
  it('shows the delivery window and opens the address picker from the address row', () => {
    const onAddressPress = jest.fn();
    const view = renderWithStore(
      <HomeHeader
        addressLabel="Home"
        addressLine="Flat 302, Sri Sai Residency"
        addressActionLabel="Deliver to Home"
        onAddressPress={onAddressPress}
      />,
    );
    expect(view.getByText(deliveryWindow)).toBeTruthy();
    expect(view.getByText(deliveryUnit)).toBeTruthy();
    expect(view.getByText('Home')).toBeTruthy();
    expect(view.getByText('Flat 302, Sri Sai Residency')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Deliver to Home'));
    expect(onAddressPress).toHaveBeenCalledTimes(1);
    fireEvent.press(view.getByLabelText(searchLabel));
    fireEvent.press(view.getByLabelText(profileLabel));
  });
});
