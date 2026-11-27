import { fireEvent } from '@testing-library/react-native';

import { renderWithStore } from '../../../../../test/render';
import type { AppSection } from '../../types/home';
import { CategoryGrid } from './CategoryGrid';

const pain: AppSection = {
  id: 'section-1',
  category: 'Pain',
  position: 0,
  image: { contentType: 'image/jpeg', url: 'https://cdn.example/pain.jpg' },
};

describe('CategoryGrid', () => {
  it('renders nothing when there are no tiles', () => {
    const view = renderWithStore(<CategoryGrid sections={[]} />);
    expect(view.queryByRole('button')).toBeNull();
  });

  it('shows each category as a button', () => {
    const view = renderWithStore(<CategoryGrid sections={[pain]} />);
    fireEvent.press(view.getByLabelText('Pain'));
    expect(view.getByLabelText('Pain')).toBeTruthy();
  });
});
