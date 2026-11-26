import { act, fireEvent } from '@testing-library/react-native';

import { addressFixture } from '../../../../../test/address-fixture';
import { idleAddressApi, renderWithStore, signedInState } from '../../../../../test/render';
import type { RootState } from '../../../../store/root.reducer';
import * as Location from 'expo-location';
import {
  addAddressLabel,
  addressHeadingAccent,
  deliverTo,
  deliveringHere,
  detectLabel,
  labelHome,
  labelOther,
  labelWork,
} from '../../utils/copy';
import { AddressListScreen } from './AddressListScreen';

const permission = jest.mocked(Location.requestForegroundPermissionsAsync);
const position = jest.mocked(Location.getCurrentPositionAsync);

function ready(items: ReturnType<typeof addressFixture>[], error: string | null = null): RootState {
  return {
    ...signedInState(),
    address: { status: 'ready', items, error, awaitingPick: false },
  };
}

describe('AddressListScreen', () => {
  it('asks for a new address when none are saved', () => {
    const onCreate = jest.fn();
    const view = renderWithStore(<AddressListScreen onCreate={onCreate} onEdit={jest.fn()} />, {
      preloadedState: ready([]),
    });
    expect(view.getByText(addressHeadingAccent)).toBeTruthy();
    expect(view.getByLabelText('Deliver here')).toBeTruthy();
    fireEvent.press(view.getByLabelText(addAddressLabel));
    expect(onCreate).toHaveBeenCalledWith(null);
  });

  it('chooses a saved address, edits it, and can detect a pin', async () => {
    permission.mockResolvedValue({ status: 'granted' } as Awaited<
      ReturnType<typeof Location.requestForegroundPermissionsAsync>
    >);
    position.mockResolvedValue({
      coords: { latitude: 12.93, longitude: 77.58 },
    } as Awaited<ReturnType<typeof Location.getCurrentPositionAsync>>);
    const home = addressFixture({ selected: true, landmark: 'Near Cool Joint' });
    const work = addressFixture({
      id: 'work',
      label: 'work',
      landmark: null,
      selected: false,
    });
    const other = addressFixture({ id: 'other', label: 'other', landmark: null, selected: false });
    const onCreate = jest.fn();
    const onEdit = jest.fn();
    const addressApi = idleAddressApi();
    const view = renderWithStore(<AddressListScreen onCreate={onCreate} onEdit={onEdit} />, {
      addressApi,
      preloadedState: ready([home, work, other], 'Try a different address'),
    });

    expect(view.getByText(deliveringHere)).toBeTruthy();
    expect(view.getByText('Near Cool Joint')).toBeTruthy();
    expect(view.getByText('Try a different address')).toBeTruthy();
    fireEvent.press(view.getByLabelText(labelWork));
    expect(view.getByLabelText(deliverTo(labelWork))).toBeTruthy();
    fireEvent.press(view.getByLabelText(`Edit ${labelOther}`));
    expect(onEdit).toHaveBeenCalledWith(other);
    fireEvent.press(view.getByLabelText(deliverTo(labelWork)));
    expect(addressApi.select).toHaveBeenCalledWith('access', 'work');

    await act(async () => {
      fireEvent.press(view.getByLabelText(detectLabel));
    });
    expect(onCreate).toHaveBeenCalledWith({ latitude: 12.93, longitude: 77.58 });
    expect(view.getByText(labelHome)).toBeTruthy();
  });
});
