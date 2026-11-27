import { renderWithStore } from '../../../../../test/render';
import { dosageTitle } from '../../utils/copy';
import { DosageScreen } from './DosageScreen';

describe('DosageScreen', () => {
  it('shows the dosage title', () => {
    const view = renderWithStore(<DosageScreen />);
    expect(view.getByText(dosageTitle)).toBeTruthy();
  });
});
