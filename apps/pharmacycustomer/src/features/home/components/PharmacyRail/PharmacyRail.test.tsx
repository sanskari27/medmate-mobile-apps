import { fireEvent } from '@testing-library/react-native';

import { renderWithStore } from '../../../../../test/render';
import { pharmacyInitials, type NearbyPharmacy } from '../../types/home';
import {
  deliveryMinutes,
  deliveryTimeLabel,
  distanceLabel,
  fastestLabel,
  pharmaciesAccent,
  pharmaciesEmpty,
  pharmaciesTitle,
  pharmacyFallback,
  seeAllPharmacies,
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
  it('shows an empty line when no pharmacy accepts online orders', () => {
    const view = renderWithStore(<PharmacyRail pharmacies={[]} />);
    expect(view.getByText(pharmaciesTitle)).toBeTruthy();
    expect(view.getByText(pharmaciesAccent)).toBeTruthy();
    expect(view.getByText(pharmaciesEmpty)).toBeTruthy();
    fireEvent.press(view.getByLabelText(seeAllPharmacies));

    const hidden = renderWithStore(<PharmacyRail pharmacies={[unnamed]} />);
    expect(hidden.getByText(pharmaciesEmpty)).toBeTruthy();
    expect(hidden.queryByLabelText(pharmacyFallback)).toBeNull();
  });

  it('shows online pharmacies with place, time, and the closest marked fastest', () => {
    const nearer: NearbyPharmacy = {
      ...apollo,
      pharmacyId: 'pharmacy-3',
      name: 'HealthFirst Chemist',
      address: null,
      city: 'BTM Layout',
      distanceKm: 0.8,
    };
    const blank: NearbyPharmacy = {
      ...apollo,
      pharmacyId: 'pharmacy-4',
      name: '   ',
      address: null,
      city: 'Jayanagar',
      distanceKm: 2.1,
    };
    const missingName: NearbyPharmacy = {
      ...apollo,
      pharmacyId: 'pharmacy-5',
      name: null,
      address: '',
      city: 'Koramangala',
      distanceKm: 3.2,
    };
    const tied: NearbyPharmacy = {
      ...apollo,
      pharmacyId: 'pharmacy-6',
      name: 'sri sai',
      address: '',
      city: '',
      distanceKm: 0.8,
    };
    const view = renderWithStore(
      <PharmacyRail pharmacies={[unnamed, apollo, nearer, blank, missingName, tied]} />,
    );

    fireEvent.press(view.getByLabelText('HealthFirst Chemist'));
    fireEvent.press(view.getByLabelText('Apollo'));
    fireEvent.press(view.getAllByLabelText(pharmacyFallback)[0]);
    fireEvent.press(view.getByLabelText('sri sai'));

    expect(view.getByText('HF')).toBeTruthy();
    expect(view.getByText('AP')).toBeTruthy();
    expect(view.getAllByText('PH')).toHaveLength(2);
    expect(view.getByText('SS')).toBeTruthy();
    expect(view.getByText(`BTM Layout · ${distanceLabel(0.8)}`)).toBeTruthy();
    expect(view.getByText(`12 MG Road · ${distanceLabel(1.2)}`)).toBeTruthy();
    expect(view.getByText(`Jayanagar · ${distanceLabel(2.1)}`)).toBeTruthy();
    expect(view.getByText(`Koramangala · ${distanceLabel(3.2)}`)).toBeTruthy();
    expect(view.getByText(distanceLabel(0.8))).toBeTruthy();
    expect(view.getAllByText(deliveryTimeLabel(0.8)).length).toBeGreaterThan(0);
    expect(view.getByText(deliveryTimeLabel(1.2))).toBeTruthy();
    expect(view.getByText(deliveryTimeLabel(2.1))).toBeTruthy();
    expect(view.getByText(deliveryTimeLabel(3.2))).toBeTruthy();
    expect(view.getAllByText(`· ${fastestLabel}`)).toHaveLength(1);
    expect(view.queryByText('Accepts online orders')).toBeNull();
    expect(view.queryByText('In-store only')).toBeNull();
  });
});

describe('pharmacy delivery copy', () => {
  it('counts a partial kilometre and keeps a 15 minute minimum', () => {
    expect(deliveryMinutes(0)).toBe(15);
    expect(deliveryMinutes(0.8)).toBe(15);
    expect(deliveryMinutes(1)).toBe(15);
    expect(deliveryMinutes(1.2)).toBe(20);
    expect(deliveryMinutes(2.6)).toBe(25);
    expect(deliveryTimeLabel(1.2)).toBe('● 20 min');
    expect(distanceLabel(1.2)).toBe('1.2 km');
    expect(distanceLabel(0)).toBe('0 km');
    expect(distanceLabel(1.25)).toBe('1.3 km');
  });

  it('builds initials from a name', () => {
    expect(pharmacyInitials('')).toBe('');
    expect(pharmacyInitials('HealthFirst Chemist')).toBe('HF');
    expect(pharmacyInitials('Sri Sai')).toBe('SS');
    expect(pharmacyInitials('sri sai')).toBe('SS');
    expect(pharmacyInitials('Apollo')).toBe('AP');
  });
});
