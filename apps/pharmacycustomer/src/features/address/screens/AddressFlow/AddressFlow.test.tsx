import { fireEvent } from '@testing-library/react-native';

import { addressFixture } from '../../../../../test/address-fixture';
import { renderWithStore, signedInState } from '../../../../../test/render';
import type { AddressState } from '../../store/address.slice';
import type { RootState } from '../../../../store/root.reducer';
import {
  addAddressLabel,
  addAddressTitle,
  addressBack,
  addressHeadingAccent,
  addressLoading,
  editAddressTitle,
  labelHome,
  tryAgain,
} from '../../utils/copy';
import { AddressFlow } from './AddressFlow';

function state(address: AddressState): RootState {
  return { ...signedInState(), address };
}

describe('AddressFlow', () => {
  it('shows a loading line, then a failure, then the list and the form', async () => {
    const loading = renderWithStore(<AddressFlow />, {
      preloadedState: state({ status: 'loading', items: [], error: null, awaitingPick: false }),
    });
    expect(loading.getByText(addressLoading)).toBeTruthy();

    const idle = renderWithStore(<AddressFlow />, {
      preloadedState: state({ status: 'idle', items: [], error: null, awaitingPick: false }),
    });
    expect(idle.getByText(addressLoading)).toBeTruthy();

    const blank = renderWithStore(<AddressFlow />, {
      preloadedState: state({ status: 'failed', items: [], error: null, awaitingPick: false }),
    });
    expect(blank.getByText(addressLoading)).toBeTruthy();

    const view = renderWithStore(<AddressFlow />, {
      preloadedState: state({
        status: 'failed',
        items: [],
        error: 'Addresses could not be loaded',
        awaitingPick: false,
      }),
    });
    expect(view.getByText('Addresses could not be loaded')).toBeTruthy();
    fireEvent.press(view.getByLabelText(tryAgain));
    expect(await view.findByText(addressHeadingAccent)).toBeTruthy();

    fireEvent.press(view.getByLabelText(addAddressLabel));
    expect(view.getByText(addAddressTitle)).toBeTruthy();
    fireEvent.press(view.getByLabelText(addressBack));
    expect(view.getByText(addressHeadingAccent)).toBeTruthy();
  });

  it('opens a saved address for editing', () => {
    const view = renderWithStore(<AddressFlow />, {
      preloadedState: state({
        status: 'ready',
        items: [addressFixture()],
        error: null,
        awaitingPick: false,
      }),
    });
    fireEvent.press(view.getByLabelText(`Edit ${labelHome}`));
    expect(view.getByText(editAddressTitle)).toBeTruthy();
    fireEvent.press(view.getByLabelText(addressBack));
    expect(view.getByText(addressHeadingAccent)).toBeTruthy();
  });
});
