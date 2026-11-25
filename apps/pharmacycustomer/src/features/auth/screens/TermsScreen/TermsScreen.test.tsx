import { fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithStore, signedInState } from '../../../../../test/render';
import { initialAuthState } from '../../store/auth.slice';
import { sessionFixture } from '../../../../../test/session-fixture';
import {
  ageLabel,
  healthMeaning,
  offersLabel,
  termsAgree,
  termsDecline,
  termsHeadingAccent,
  termsSignedIn,
  usageMeaning,
  whatThisMeansLabel,
} from '../../utils/copy';
import { TermsScreen } from './TermsScreen';

function pendingTerms() {
  return {
    auth: {
      ...initialAuthState,
      status: 'signedIn' as const,
      phone: '9876543210',
      session: sessionFixture(),
    },
  };
}

describe('TermsScreen', () => {
  it('explains the terms, then continues once age is confirmed', () => {
    const view = renderWithStore(<TermsScreen />, { preloadedState: pendingTerms() });

    expect(view.getByText(termsHeadingAccent)).toBeTruthy();
    expect(view.getByText(termsSignedIn('+91 98765 43210'))).toBeTruthy();
    expect(view.queryByText(healthMeaning)).toBeNull();

    fireEvent.press(view.getByLabelText(whatThisMeansLabel('Health information')));
    expect(view.getByText(healthMeaning)).toBeTruthy();
    fireEvent.press(view.getByLabelText(whatThisMeansLabel('Health information')));
    expect(view.queryByText(healthMeaning)).toBeNull();
    fireEvent.press(view.getByLabelText(whatThisMeansLabel('Usage and activity')));
    expect(view.getByText(usageMeaning)).toBeTruthy();
    fireEvent.press(view.getByLabelText(whatThisMeansLabel('Usage and activity')));
    expect(view.queryByText(usageMeaning)).toBeNull();

    fireEvent.press(view.getByLabelText(offersLabel));
    expect(view.getByLabelText(offersLabel)).toHaveProp('accessibilityState', { checked: true });

    fireEvent.press(view.getByLabelText(ageLabel));
    fireEvent.press(view.getByLabelText(termsAgree));
    expect(view.store.getState().auth.termsAccepted).toBe(false);

    fireEvent.press(view.getByLabelText(ageLabel));
    fireEvent.press(view.getByLabelText(termsAgree));
    expect(view.store.getState().auth.termsAccepted).toBe(true);
  });

  it('signs out when the shopper declines', async () => {
    const view = renderWithStore(<TermsScreen />, { preloadedState: signedInState() });
    fireEvent.press(view.getByLabelText(termsDecline));
    await waitFor(() => expect(view.store.getState().auth.status).toBe('signedOut'));
  });

  it('hides the number when the session has none', () => {
    const view = renderWithStore(<TermsScreen />, {
      preloadedState: {
        auth: {
          ...pendingTerms().auth,
          session: {
            ...sessionFixture(),
            account: { ...sessionFixture().account, phone: '' },
          },
        },
      },
    });
    expect(view.queryByText(/Signed in as/)).toBeNull();
  });
});
