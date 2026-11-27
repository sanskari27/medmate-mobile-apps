import { fireEvent } from '@testing-library/react-native';

import { addressFixture } from '../../../../../test/address-fixture';
import { idleHomeApi, renderWithStore, signedInState } from '../../../../../test/render';
import { initialAddressState } from '../../../address/store/address.slice';
import { deliverTo, labelHome } from '../../../address/utils/copy';
import type { RootState } from '../../../../store/root.reducer';
import type { AppSection, NearbyPharmacy } from '../../types/home';
import type { HomeStatus } from '../../store/home.slice';
import {
  chooseAddress,
  deliveryWindow,
  homeFailed,
  homeLoading,
  pharmaciesEmpty,
  pharmaciesTitle,
  profileLabel,
  searchLabel,
  tryAgain,
} from '../../utils/copy';
import { failureCopy, homeBody, HomeScreen } from './HomeScreen';

const section: AppSection = {
  id: 'section-1',
  category: 'Pain',
  position: 0,
  image: { contentType: 'image/jpeg', url: 'https://cdn.example/pain.jpg' },
};

const pharmacy: NearbyPharmacy = {
  pharmacyId: 'pharmacy-1',
  name: 'Apollo',
  address: '12 MG Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  latitude: 12.97,
  longitude: 77.59,
  distanceKm: 1.2,
  acceptOnlineOrders: true,
};

function withAddress(selected = true): RootState {
  return {
    ...signedInState(),
    address: {
      ...initialAddressState,
      status: 'ready',
      items: [addressFixture({ selected, label: 'home' })],
    },
  };
}

describe('HomeScreen', () => {
  it('maps the feed phase and the failure copy', () => {
    const statuses: HomeStatus[] = ['idle', 'loading', 'ready', 'failed'];
    expect(statuses.map((status) => homeBody(false, status))).toEqual([
      'idle',
      'idle',
      'idle',
      'idle',
    ]);
    expect(homeBody(true, 'failed')).toBe('failed');
    expect(homeBody(true, 'ready')).toBe('ready');
    expect(homeBody(true, 'idle')).toBe('loading');
    expect(homeBody(true, 'loading')).toBe('loading');
    expect(failureCopy(null)).toBe(homeFailed);
    expect(failureCopy('offline')).toBe('offline');
  });

  it('shows the header and opens the address picker before a delivery address is chosen', () => {
    const homeApi = idleHomeApi();
    const view = renderWithStore(<HomeScreen />, {
      homeApi,
      preloadedState: signedInState(),
    });
    expect(view.getByText(deliveryWindow)).toBeTruthy();
    expect(view.getByLabelText(chooseAddress)).toBeTruthy();
    expect(view.queryByLabelText(homeLoading)).toBeNull();
    expect(view.queryByText(pharmaciesTitle)).toBeNull();
    fireEvent.press(view.getByLabelText(chooseAddress));
    expect(view.store.getState().address.awaitingPick).toBe(true);
    fireEvent.press(view.getByLabelText(searchLabel));
    fireEvent.press(view.getByLabelText(profileLabel));
    expect(homeApi.listSections).not.toHaveBeenCalled();
  });

  it('shows category tiles and pharmacies for the selected address', async () => {
    let releaseSections: (sections: AppSection[]) => void = () => undefined;
    let releasePharmacies: (pharmacies: NearbyPharmacy[]) => void = () => undefined;
    const sections = new Promise<AppSection[]>((resolve) => {
      releaseSections = resolve;
    });
    const pharmacies = new Promise<NearbyPharmacy[]>((resolve) => {
      releasePharmacies = resolve;
    });
    const homeApi = idleHomeApi({
      listSections: jest.fn(() => sections),
      listNearby: jest.fn(() => pharmacies),
    });
    const view = renderWithStore(<HomeScreen />, {
      homeApi,
      preloadedState: withAddress(),
    });
    expect(view.getByLabelText(deliverTo(labelHome))).toBeTruthy();
    expect(view.getByText('Flat 302, Sri Sai Residency')).toBeTruthy();
    expect(view.getByLabelText(homeLoading)).toBeTruthy();

    releaseSections([section]);
    releasePharmacies([pharmacy]);
    expect(await view.findByLabelText('Pain')).toBeTruthy();
    expect(view.getByLabelText('Apollo')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Pain'));
    fireEvent.press(view.getByLabelText('Apollo'));
    fireEvent.press(view.getByLabelText(deliverTo(labelHome)));
    expect(view.store.getState().address.awaitingPick).toBe(true);
  });

  it('retries a failed load and shows an empty pharmacy line', async () => {
    const homeApi = idleHomeApi({
      listSections: jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([]),
      listNearby: jest.fn(async () => []),
    });
    const view = renderWithStore(<HomeScreen />, {
      homeApi,
      preloadedState: withAddress(),
    });
    expect(await view.findByText('offline')).toBeTruthy();
    fireEvent.press(view.getByLabelText(tryAgain));
    expect(await view.findByText(pharmaciesTitle)).toBeTruthy();
    expect(view.getByText(pharmaciesEmpty)).toBeTruthy();
    expect(view.queryByLabelText('Pain')).toBeNull();
  });
});
