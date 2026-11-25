import { createAuthApi } from './auth.api';

const sessionBody = {
  accessToken: 'access',
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

function json(status: number, body: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe('createAuthApi', () => {
  it('sends, verifies, refreshes, and signs out a customer', async () => {
    const fetchImpl = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/auth/otp/send')) return json(200, { mode: 'otp' });
      if (url.endsWith('/auth/otp/verify')) return json(200, sessionBody);
      if (url.endsWith('/auth/refresh')) return json(200, sessionBody);
      return json(204, {});
    }) as jest.MockedFunction<typeof fetch>;
    const api = createAuthApi('http://127.0.0.1:8080', fetchImpl);

    await expect(api.sendOtp('+919876543210')).resolves.toBe('otp');
    await expect(api.verifyOtp('+919876543210', '123456')).resolves.toMatchObject({
      accessToken: 'access',
      account: { accountType: 'customer' },
    });
    await expect(api.refresh('refresh')).resolves.toMatchObject({ refreshToken: 'refresh' });
    await expect(api.signOut('refresh')).resolves.toBeUndefined();

    const bodies = fetchImpl.mock.calls.map((call) => JSON.parse(String(call[1]?.body)));
    expect(bodies[0]).toEqual({
      phone: '+919876543210',
      accountType: 'customer',
      purpose: 'login',
    });
    expect(bodies[1]).toMatchObject({ code: '123456', accountType: 'customer' });
    expect(bodies[2]).toEqual({ refreshToken: 'refresh' });
    expect(bodies[3]).toEqual({ refreshToken: 'refresh' });
    const headers = fetchImpl.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(headers['X-Request-Id']).toMatch(/^req-\d+-\d+$/);
    expect(headers.Authorization).toBeUndefined();
  });

  it('surfaces a rejected code and a body that is not a mode', async () => {
    const denied = jest.fn(async () =>
      json(401, { title: 'Unauthorized', detail: 'Code was not accepted' }),
    ) as unknown as jest.MockedFunction<typeof fetch>;
    const api = createAuthApi('http://127.0.0.1:8080', denied);
    await expect(api.verifyOtp('+919876543210', '000000')).rejects.toMatchObject({
      detail: 'Code was not accepted',
    });

    const unexpected = jest.fn(async () => json(200, { mode: 'email' })) as unknown as jest.MockedFunction<
      typeof fetch
    >;
    const other = createAuthApi('http://127.0.0.1:8080', unexpected);
    await expect(other.sendOtp('+919876543210')).rejects.toThrow('Code could not be sent');
  });
});
