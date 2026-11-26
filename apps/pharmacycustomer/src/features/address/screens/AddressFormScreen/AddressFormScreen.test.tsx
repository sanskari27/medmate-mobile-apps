import { act, fireEvent, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { addressFixture } from '../../../../../test/address-fixture';
import { idleAddressApi, renderWithStore, signedInState } from '../../../../../test/render';
import { ApiError } from '../../../../services/api/problem';
import type { RootState } from '../../../../store/root.reducer';
import {
  addAddressTitle,
  addressBack,
  callOnArrivalLabel,
  detectLocationLabel,
  dontRingBellLabel,
  editAddressTitle,
  labelOther,
  labelWork,
  landmarkLabel,
  leaveWithSecurityLabel,
  liftNotWorkingLabel,
  line1Label,
  line1Required,
  line2Label,
  mapLabel,
  pinRequired,
  noteLabel,
  notePlaceholder,
  pinDenied,
  placeUnread,
  serviceNote,
  receiverNameLabel,
  receiverPhoneLabel,
  saveAndDeliver,
  useMyNumber,
} from '../../utils/copy';
import { pinMapTestId } from '../../components/PinMap/pin-map';
import { AddressFormScreen } from './AddressFormScreen';

const permission = jest.mocked(Location.requestForegroundPermissionsAsync);
const position = jest.mocked(Location.getCurrentPositionAsync);
const granted = { status: 'granted' } as Awaited<
  ReturnType<typeof Location.requestForegroundPermissionsAsync>
>;

function sheet(): RootState {
  return signedInState();
}

function placeResponse(city: string, postcode: string, ok = true): Response {
  return {
    ok,
    json: async () => ({ address: { city, postcode } }),
  } as Response;
}

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(placeResponse('Bengaluru', '560011'));
  global.fetch = fetchMock as typeof fetch;
});

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
    expect(view.getByLabelText(detectLocationLabel)).toBeTruthy();
    fireEvent(view.getByLabelText(mapLabel), 'touchStart');
    fireEvent(view.getByLabelText(mapLabel), 'touchEnd');
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(view.getByText(line1Required)).toBeTruthy();
    expect(view.getByText(pinRequired)).toBeTruthy();
    expect(onBack).not.toHaveBeenCalled();

    fireEvent.changeText(view.getByLabelText(line1Label), 'Flat 302');
    fireEvent.changeText(view.getByLabelText(line2Label), '7th Cross');
    fireEvent.changeText(view.getByLabelText(landmarkLabel), 'Near Cool Joint');
    fireEvent.changeText(view.getByLabelText(receiverPhoneLabel), '9845012345');
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
    fireEvent.press(view.getByLabelText(detectLocationLabel));
    expect(await view.findByText(pinDenied)).toBeTruthy();
    permission.mockResolvedValueOnce(granted);
    position.mockResolvedValueOnce({
      coords: { latitude: 12.93, longitude: 77.58 },
    } as Awaited<ReturnType<typeof Location.getCurrentPositionAsync>>);
    fireEvent.press(view.getByLabelText(detectLocationLabel));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(async () => {
      await Promise.all(fetchMock.mock.results.map((result) => result.value as Promise<unknown>));
    });
    expect(view.queryByText(serviceNote)).toBeNull();
    fireEvent(view.getByTestId(pinMapTestId), 'message', {
      nativeEvent: { data: JSON.stringify({ latitude: 12.95, longitude: 77.61 }) },
    });
    await act(async () => {
      await Promise.all(fetchMock.mock.results.map((result) => result.value as Promise<unknown>));
    });
    expect(view.queryByText(serviceNote)).toBeNull();

    fireEvent.press(view.getByLabelText(saveAndDeliver));
    await waitFor(() => expect(addressApi.create).toHaveBeenCalled());
    expect(addressApi.create).toHaveBeenCalledWith(
      'access',
      expect.objectContaining({
        label: 'other',
        city: 'Bengaluru',
        pincode: '560011',
        landmark: 'Near Cool Joint',
        receiverPhone: '+919876543210',
        selected: true,
        latitude: 12.95,
        longitude: 77.61,
        callOnArrival: false,
        leaveWithSecurity: true,
      }),
    );
    expect(onBack).not.toHaveBeenCalled();
  });

  it('updates a saved address and reports a rejected save', async () => {
    const onBack = jest.fn();
    const addressApi = idleAddressApi({
      update: jest.fn(async () => {
        throw new ApiError(
          400,
          'Bad request',
          'We deliver across Bengaluru (pincodes starting 560)',
        );
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
    expect(view.queryByText(serviceNote)).toBeNull();
    fireEvent.press(view.getByLabelText(addressBack));
    expect(onBack).toHaveBeenCalledTimes(1);

    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(
      await view.findByText('We deliver across Bengaluru (pincodes starting 560)'),
    ).toBeTruthy();
    expect(addressApi.update).toHaveBeenCalledWith(
      'access',
      'address-1',
      expect.objectContaining({ selected: true, city: 'Bengaluru', pincode: '560011' }),
    );
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns to the list after saving an address that stays unselected', async () => {
    const onBack = jest.fn();
    const addressApi = idleAddressApi({
      update: jest.fn(async () => addressFixture({ selected: false })),
    });
    const view = renderWithStore(
      <AddressFormScreen
        address={addressFixture({ selected: false })}
        pin={null}
        onBack={onBack}
      />,
      { addressApi, preloadedState: sheet() },
    );
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    await waitFor(() => expect(onBack).toHaveBeenCalled());
    expect(addressApi.update).toHaveBeenCalledWith(
      'access',
      'address-1',
      expect.objectContaining({ selected: false }),
    );
  });

  it('reads the city from the opening pin and ignores an older lookup', async () => {
    let resolveFirst: (value: Response) => void = () => undefined;
    fetchMock.mockReset();
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveFirst = resolve;
        }),
    );
    fetchMock.mockResolvedValue(placeResponse('Bengaluru', '560011'));
    const onBack = jest.fn();
    const addressApi = idleAddressApi();
    const view = renderWithStore(
      <AddressFormScreen
        address={null}
        pin={{ latitude: 12.93, longitude: 77.58 }}
        onBack={onBack}
      />,
      { addressApi, preloadedState: sheet() },
    );
    fireEvent.changeText(view.getByLabelText(line1Label), 'Flat 302');
    fireEvent.changeText(view.getByLabelText(line2Label), '7th Cross');
    fireEvent.changeText(view.getByLabelText(receiverNameLabel), 'Priya Sharma');
    fireEvent.changeText(view.getByLabelText(receiverPhoneLabel), '9845012345');
    fireEvent(view.getByTestId(pinMapTestId), 'message', {
      nativeEvent: { data: JSON.stringify({ latitude: 12.95, longitude: 77.61 }) },
    });
    await act(async () => {
      await fetchMock.mock.results[1]?.value;
    });
    expect(view.queryByText(serviceNote)).toBeNull();
    await act(async () => {
      resolveFirst(placeResponse('Mumbai', '400001'));
    });
    expect(view.queryByText(serviceNote)).toBeNull();
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    await waitFor(() => expect(addressApi.create).toHaveBeenCalled());
    expect(addressApi.create).toHaveBeenCalledWith(
      'access',
      expect.objectContaining({ city: 'Bengaluru', pincode: '560011', latitude: 12.95 }),
    );
  });

  it('keeps a pin outside Bengaluru from being saved', async () => {
    fetchMock.mockResolvedValue(placeResponse('Mumbai', '400001'));
    const addressApi = idleAddressApi();
    const view = renderWithStore(
      <AddressFormScreen address={null} pin={null} onBack={jest.fn()} />,
      { addressApi, preloadedState: sheet() },
    );
    fireEvent.changeText(view.getByLabelText(line1Label), 'Flat 302');
    fireEvent.changeText(view.getByLabelText(line2Label), '7th Cross');
    fireEvent.changeText(view.getByLabelText(receiverNameLabel), 'Priya Sharma');
    fireEvent.changeText(view.getByLabelText(receiverPhoneLabel), '9845012345');
    fireEvent(view.getByTestId(pinMapTestId), 'message', {
      nativeEvent: { data: JSON.stringify({ latitude: 19.07, longitude: 72.87 }) },
    });
    await act(async () => {
      await Promise.all(fetchMock.mock.results.map((result) => result.value as Promise<unknown>));
    });
    expect(view.getByText(serviceNote)).toBeTruthy();
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(view.getAllByText(serviceNote)).toHaveLength(1);
    expect(addressApi.create).not.toHaveBeenCalled();
    fetchMock.mockResolvedValue(placeResponse('Bengaluru', '560011'));
    fireEvent(view.getByTestId(pinMapTestId), 'message', {
      nativeEvent: { data: JSON.stringify({ latitude: 12.97, longitude: 77.59 }) },
    });
    await act(async () => {
      await Promise.all(fetchMock.mock.results.map((result) => result.value as Promise<unknown>));
    });
    expect(view.queryByText(serviceNote)).toBeNull();
  });

  it('asks the shopper to move the map when the pin cannot be read', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    const view = renderWithStore(
      <AddressFormScreen address={null} pin={{ latitude: 12.97, longitude: 77.59 }} onBack={jest.fn()} />,
      { preloadedState: sheet() },
    );
    expect(await view.findByText(placeUnread)).toBeTruthy();
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(view.getAllByText(placeUnread)).toHaveLength(1);
  });

  it('asks to move the map when save happens before the pin is read', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));
    const view = renderWithStore(
      <AddressFormScreen
        address={null}
        pin={{ latitude: 12.97, longitude: 77.59 }}
        onBack={jest.fn()}
      />,
      { preloadedState: sheet() },
    );
    fireEvent.changeText(view.getByLabelText(line1Label), 'Flat 302');
    fireEvent.changeText(view.getByLabelText(line2Label), '7th Cross');
    fireEvent.changeText(view.getByLabelText(receiverNameLabel), 'Priya Sharma');
    fireEvent.changeText(view.getByLabelText(receiverPhoneLabel), '9845012345');
    fireEvent.press(view.getByLabelText(saveAndDeliver));
    expect(view.getByText(placeUnread)).toBeTruthy();
    expect(view.queryByText(serviceNote)).toBeNull();
  });
});
