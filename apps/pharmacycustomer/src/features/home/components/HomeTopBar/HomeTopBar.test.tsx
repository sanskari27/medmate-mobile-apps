import { fireEvent } from '@testing-library/react-native';

import { renderWithStore } from '../../../../../test/render';
import {
  alertsLabel,
  placeSummary,
  profileLabel,
  profileMark,
  rupee,
  walletAction,
  walletLabel,
} from '../../utils/copy';
import { HomeTopBar } from './HomeTopBar';

describe('HomeTopBar', () => {
  it('shows the wordmark, a blank wallet, and a fallback initial', () => {
    const onAddressPress = jest.fn();
    const view = renderWithStore(
      <HomeTopBar
        email={null}
        balance={null}
        addressLabel="Choose address"
        addressLine="   "
        addressActionLabel="Choose address"
        onAddressPress={onAddressPress}
      />,
    );
    expect(view.getByText('MedMate')).toBeTruthy();
    expect(view.getByText('Choose address')).toBeTruthy();
    expect(view.queryByText(rupee(0))).toBeNull();
    expect(view.getByText(profileMark)).toBeTruthy();
    fireEvent.press(view.getByLabelText(walletLabel));
    fireEvent.press(view.getByLabelText(alertsLabel));
    fireEvent.press(view.getByLabelText(profileLabel));
    fireEvent.press(view.getByLabelText('Choose address'));
    expect(onAddressPress).toHaveBeenCalledTimes(1);

    const blank = renderWithStore(
      <HomeTopBar
        email="   "
        balance={null}
        addressLabel="Home"
        addressLine="Flat 302"
        addressActionLabel="Deliver to Home"
        onAddressPress={jest.fn()}
      />,
    );
    expect(blank.getByText(profileMark)).toBeTruthy();
  });

  it('uses the first letter of the email and the wallet balance', () => {
    const onAddressPress = jest.fn();
    const view = renderWithStore(
      <HomeTopBar
        email="  ada@medmate.in  "
        balance={15}
        addressLabel="Home"
        addressLine="Flat 302, Sri Sai Residency"
        addressActionLabel="Deliver to Home"
        onAddressPress={onAddressPress}
      />,
    );
    expect(view.getByText('A')).toBeTruthy();
    expect(view.getByText(rupee(15))).toBeTruthy();
    expect(view.getByText(placeSummary('Home', 'Flat 302, Sri Sai Residency'))).toBeTruthy();
    fireEvent.press(view.getByLabelText(walletAction(15)));
    fireEvent.press(view.getByLabelText('Deliver to Home'));
    expect(onAddressPress).toHaveBeenCalledTimes(1);
  });
});
