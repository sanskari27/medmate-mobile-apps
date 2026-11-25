import type { Session } from '../src/types/session';

export function sessionFixture(accessToken = 'access'): Session {
  return {
    accessToken,
    refreshToken: 'refresh',
    expiresIn: 900,
    account: {
      id: 'account-1',
      accountType: 'customer',
      phone: '+919876543210',
      displayName: null,
      pharmacyId: null,
      pharmacyRole: null,
      verificationStatus: null,
      subtypes: [],
      permissions: [],
      pinSetupRequired: false,
      disabled: false,
    },
  };
}
