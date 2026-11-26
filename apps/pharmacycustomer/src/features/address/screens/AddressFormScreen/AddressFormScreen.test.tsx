import { fireEvent, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { addressFixture } from '../../../../../test/address-fixture';
import { idleAddressApi, renderWithStore, signedInState } from '../../../../../test/render';
import { ApiError } from '../../../../services/api/problem';
import type { RootState } from '../../../../store/root.reducer';
import {
  addAddressTitle,
  addressBack,
  callOnArrivalLabel,
  detectLabel,
  dontRingBellLabel,
  editAddressTitle,
  cityLabel,
  labelOther,
  labelWork,
  landmarkLabel,
  leaveWithSecurityLabel,
  liftNotWorkingLabel,
  line1Label,
  line1Required,
  line2Label,
  locationFormBody,
  noteLabel,
  notePlaceholder,
  pinDenied,
  pinSaved,
  pincodeLabel,
  receiverNameLabel,
  receiverPhoneLabel,
  saveAndDeliver,
  useMyNumber,
  weDeliverHere,
} from '../../utils/copy';
import { AddressFormScreen } from './AddressFormScreen';

const permission = jest.mocked(Location.requestForegroundPermissionsAsync);
const position = jest.mocked(Location.getCurrentPositionAsync);
const granted = { status: 'granted' } as Awaited<
  ReturnType<typeof Location.requestForegroundPermissionsAsync>
>;

function sheet(): RootState {
  return signedInState();
}

describe('AddressFormScreen', () => {
  it('blocks an incomplete address, then saves a new one without delivering now', async () => {
    const onBack = jest.fn();
    const created = addressFixture({ selected: false });
    const addressApi = idleAddressApi({ create: jest.fn(async () => created) });
    const view = renderWithStore(<AddressFormScreen address={null} pin={null} onBack={onBack} />, {
      addressApi,
      preloadedState: sheet(),
    });

    expect(view.getByText(addAddressTitle)).toBeTruthy();
    expect(view.getByText(locationFormBody)).toBeTruthy();
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(view.getByText(line1Required)).toBeTruthy();
    expect(onBack).not.toHaveBeenCalled();

    fireEvent.changeText(view.getByLabelText(line1Label), 'Flat 302');
    fireEvent.changeText(view.getByLabelText(line2Label), '7th Cross');
    fireEvent.changeText(view.getByLabelText(landmarkLabel), 'Near Cool Joint');
    fireEvent.changeText(view.getByLabelText(cityLabel), 'Bengaluru');
    fireEvent.changeText(view.getByLabelText(pincodeLabel), '560011');
    fireEvent.changeText(view.getByLabelText(receiverPhoneLabel), '9845012345');
    expect(view.getByText(weDeliverHere)).toBeTruthy();
    fireEvent.changeText(view.getByLabelText(receiverNameLabel), 'Priya Sharma');
    fireEvent.press(view.getByLabelText(useMyNumber));
    fireEvent.press(view.getByLabelText(labelWork));
    fireEvent.press(view.getByLabelText(labelOther));
    fireEvent.press(view.getByLabelText(callOnArrivalLabel));
    fireEvent.press(view.getByLabelText(leaveWithSecurityLabel));
    fireEvent.press(view.getByLabelText(dontRingBellLabel));
    fireEvent.press(view.getByLabelText(liftNotWorkingLabel));
    fireEvent.changeText(view.getByLabelText(noteLabel), `${'gate '.repeat(40)}${notePlaceholder}`);
    expect(view.getByText('140/140')).toBeTruthy();

    permission.mockResolvedValueOnce({ status: 'denied' } as typeof granted);
    fireEvent.press(view.getByLabelText(detectLabel));
    expect(await view.findByText(pinDenied)).toBeTruthy();
    permission.mockResolvedValueOnce(granted);
    position.mockResolvedValueOnce({
      coords: { latitude: 12.93, longitude: 77.58 },
    } as Awaited<ReturnType<typeof Location.getCurrentPositionAsync>>);
    fireEvent.press(view.getByLabelText(detectLabel));
    expect(await view.findByText(pinSaved)).toBeTruthy();

    fireEvent.press(view.getByLabelText('Deliver here now'));
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    await waitFor(() => expect(onBack).toHaveBeenCalled());
    expect(addressApi.create).toHaveBeenCalledWith(
      'access',
      expect.objectContaining({
        label: 'other',
        pincode: '560011',
        receiverPhone: '+919876543210',
        selected: false,
        latitude: 12.93,
        callOnArrival: false,
        leaveWithSecurity: true,
      }),
    );
    expect(onBack).toHaveBeenCalled();
  });

  it('updates a saved address and reports a rejected save', async () => {
    const onBack = jest.fn();
    const addressApi = idleAddressApi({
      update: jest.fn(async () => {
        throw new ApiError(400, 'Bad request', 'We deliver across Bengaluru (pincodes starting 560)');
      }),
    });
    const view = renderWithStore(
      <AddressFormScreen
        address={addressFixture({
          landmark: 'Temple',
          riderNote: 'Ring',
          latitude: 12.9,
          longitude: 77.6,
          selected: true,
        })}
        pin={null}
        onBack={onBack}
      />,
      { addressApi, preloadedState: sheet() },
    );
    expect(view.getByText(editAddressTitle)).toBeTruthy();
    expect(view.getByText(pinSaved)).toBeTruthy();
    fireEvent.press(view.getByLabelText(addressBack));
    expect(onBack).toHaveBeenCalledTimes(1);

    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(
      await view.findByText('We deliver across Bengaluru (pincodes starting 560)'),
    ).toBeTruthy();
    expect(addressApi.update).toHaveBeenCalled();
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
