import { Dimensions } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { renderWithStore } from '../../../../../test/render';
import type { HomeCoupon } from '../../types/home';
import {
  deliveryWindow,
  offersLabel,
  searchLabel,
  sourceAction,
  sourceEyebrow,
  sourceNote,
  sourceTitle,
} from '../../utils/copy';
import { bannerPage, HomeHero, slideLabel } from './HomeHero';

const coupon: HomeCoupon = {
  id: 'coupon-1',
  title: 'Flat 25% off',
  code: 'SAVE25',
  banner: { contentType: 'image/png', url: 'https://cdn.example/save.png' },
};

describe('HomeHero', () => {
  it('maps a banner page from the scroll offset', () => {
    expect(bannerPage(0, 0)).toBe(0);
    expect(bannerPage(-20, 100)).toBe(0);
    expect(bannerPage(80, 100)).toBe(1);
    expect(slideLabel(0)).toBe('Slide 1');
  });

  it('keeps the source request as the only slide when there are no coupons', () => {
    const onSearchPress = jest.fn();
    const onCategoryPress = jest.fn();
    const view = renderWithStore(
      <HomeHero coupons={[]} onSearchPress={onSearchPress} onCategoryPress={onCategoryPress} />,
    );
    expect(view.getByText(deliveryWindow)).toBeTruthy();
    expect(view.getByText(searchLabel)).toBeTruthy();
    expect(view.getByText(sourceEyebrow)).toBeTruthy();
    expect(view.getByText(sourceTitle)).toBeTruthy();
    expect(view.getByText(sourceNote)).toBeTruthy();
    expect(view.queryByLabelText(slideLabel(0))).toBeNull();
    expect(view.getByLabelText('All').props.accessibilityState).toEqual({ selected: true });
    fireEvent.press(view.getByLabelText(searchLabel));
    expect(onSearchPress).toHaveBeenCalledTimes(1);
    fireEvent.press(view.getByLabelText(sourceAction));
    fireEvent.press(view.getByLabelText('Fever & pain'));
    expect(onCategoryPress).toHaveBeenCalledWith('Fever & pain');
    expect(view.getByLabelText('Fever & pain').props.accessibilityState).toEqual({
      selected: true,
    });
    expect(view.getByLabelText('All').props.accessibilityState).toEqual({ selected: false });
  });

  it('shows coupon banners and leaves the source request as the last slide', () => {
    const view = renderWithStore(
      <HomeHero coupons={[coupon]} onSearchPress={jest.fn()} onCategoryPress={jest.fn()} />,
    );
    expect(view.getByLabelText(coupon.title)).toBeTruthy();
    expect(view.getByText(sourceTitle)).toBeTruthy();
    expect(view.getByLabelText(slideLabel(0)).props.accessibilityState).toEqual({ selected: true });
    expect(view.getByLabelText(slideLabel(1)).props.accessibilityState).toEqual({
      selected: false,
    });
    fireEvent(view.getByLabelText(offersLabel), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: Dimensions.get('window').width } },
    });
    expect(view.getByLabelText(slideLabel(0)).props.accessibilityState).toEqual({
      selected: false,
    });
    expect(view.getByLabelText(slideLabel(1)).props.accessibilityState).toEqual({ selected: true });
  });
});
