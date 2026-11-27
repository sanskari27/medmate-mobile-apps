import { fireEvent } from '@testing-library/react-native';

import { renderWithStore } from '../../../../../test/render';
import type { NearbyPharmacy } from '../../types/home';
import {
  distanceLabel,
  onlineOrdersLabel,
  pharmaciesEmpty,
  pharmaciesTitle,
  pharmacyFallback,
} from '../../utils/copy';
import { PharmacyRail } from './PharmacyRail';

const apollo: NearbyPharmacy = {
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

const unnamed: NearbyPharmacy = {
  ...apollo,
  pharmacyId: 'pharmacy-2',
  name: null,
  address: null,
  city: null,
  acceptOnlineOrders: false,
  distanceKm: 0,
};

describe('PharmacyRail', () => {
  it('shows an empty line when no pharmacy is nearby', () => {
    const view = renderWithStore(<PharmacyRail pharmacies={[]} />);
    expect(view.getByText(pharmaciesTitle)).toBeTruthy();
    expect(view.getByText(pharmaciesEmpty)).toBeTruthy();
  });

  it('shows name, place, distance, and online orders', () => {
    const view = renderWithStore(<PharmacyRail pharmacies={[apollo, unnamed]} />);
    fireEvent.press(view.getByLabelText('Apollo'));
    fireEvent.press(view.getByLabelText(pharmacyFallback));
    expect(view.getByText('12 MG Road, Bengaluru')).toBeTruthy();
    expect(view.getByText(distanceLabel(1.2))).toBeTruthy();
    expect(view.getByText(distanceLabel(0))).toBeTruthy();
    expect(view.getByText(onlineOrdersLabel(true))).toBeTruthy();
    expect(view.getByText(onlineOrdersLabel(false))).toBeTruthy();
  });
});
