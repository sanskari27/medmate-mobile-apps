import { fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithStore, signedInState } from '../../../../../test/render';
import { DashboardScreen } from './DashboardScreen';

describe('DashboardScreen', () => {
  it('shows the signed-in phone and signs out', async () => {
    const view = renderWithStore(<DashboardScreen />, { preloadedState: signedInState() });
    expect(view.getByText('+919876543210')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Sign out'));
    await waitFor(() => expect(view.store.getState().auth.status).toBe('signedOut'));
  });
});
