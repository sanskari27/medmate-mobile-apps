import { parseSession } from './parse-session';

const account = {
  id: 'id-1',
  accountType: 'customer',
  phone: '+919876543210',
  email: 'ada@medmate.in',
  displayName: 'Ada',
  pharmacyId: null,
  pharmacyRole: null,
  verificationStatus: null,
  subtypes: ['customer', 2],
  permissions: ['orders'],
  pinSetupRequired: true,
  disabled: false,
};

function raw(overrides: Record<string, unknown> = {}, accountOverrides?: Record<string, unknown>) {
  return {
    accessToken: ' access ',
    refreshToken: 'refresh',
    expiresIn: 900,
    account: accountOverrides === undefined ? account : { ...account, ...accountOverrides },
    ...overrides,
  };
}

describe('parseSession', () => {
  it('reads a customer session and ignores extra fields', () => {
    expect(parseSession(raw())).toMatchObject({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 900,
      account: {
        id: 'id-1',
        email: 'ada@medmate.in',
        displayName: 'Ada',
        subtypes: ['customer'],
        permissions: ['orders'],
        pinSetupRequired: true,
        disabled: false,
      },
    });
    expect(
      parseSession(
        raw(
          {},
          {
            email: null,
            displayName: null,
            subtypes: undefined,
            permissions: 'nope',
            pinSetupRequired: false,
            disabled: true,
          },
        ),
      ).account,
    ).toMatchObject({
      email: null,
      displayName: null,
      subtypes: [],
      permissions: [],
      pinSetupRequired: false,
      disabled: true,
    });
  });

  it('rejects a body that is not a session', () => {
    const broken = [
      1,
      null,
      [],
      raw({ accessToken: 1 }),
      raw({ accessToken: '   ' }),
      raw({ refreshToken: '' }),
      raw({ expiresIn: undefined }),
      raw({ expiresIn: '900' }),
      raw({ expiresIn: Number.POSITIVE_INFINITY }),
      raw({}, { id: '' }),
      raw({}, { accountType: '' }),
      raw({}, { phone: '' }),
      raw({ account: null }),
    ];
    for (const body of broken) {
      expect(() => parseSession(body)).toThrow('Session was not accepted');
    }
  });
});
