import { fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

import { addressFixture } from '../../../../../test/address-fixture';
import { idleHomeApi, renderWithStore, signedInState } from '../../../../../test/render';
import { initialAddressState } from '../../../address/store/address.slice';
import type { RootState } from '../../../../store/root.reducer';
import { cartTitle, chatTitle, dosageTitle, homeTab } from '../../../home/utils/copy';
import { DashboardScreen } from './DashboardScreen';

function atHome(): RootState {
  return {
    ...signedInState(),
    address: {
      ...initialAddressState,
      status: 'ready',
      items: [addressFixture({ selected: true })],
    },
  };
}

describe('DashboardScreen', () => {
  it('opens on Home and can show Cart, Dosage, and Chat', async () => {
    const view = renderWithStore(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>,
      { homeApi: idleHomeApi(), preloadedState: atHome() },
    );
    expect(view.getByLabelText(`${homeTab}, tab, 1 of 4`)).toBeTruthy();
    fireEvent.press(view.getByLabelText(`${cartTitle}, tab, 2 of 4`));
    await waitFor(() => expect(view.getAllByText(cartTitle)).toHaveLength(2));
    fireEvent.press(view.getByLabelText(`${dosageTitle}, tab, 3 of 4`));
    await waitFor(() => expect(view.getAllByText(dosageTitle)).toHaveLength(2));
    fireEvent.press(view.getByLabelText(`${chatTitle}, tab, 4 of 4`));
    await waitFor(() => expect(view.getAllByText(chatTitle)).toHaveLength(2));
    fireEvent.press(view.getByLabelText(`${homeTab}, tab, 1 of 4`));
    expect(view.getByLabelText(`${homeTab}, tab, 1 of 4`)).toHaveProp('accessibilityState', {
      selected: true,
    });
  });
});
