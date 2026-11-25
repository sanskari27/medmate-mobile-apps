import { ApiError, errorDetail, problemDetail } from './problem';
import { requestJson } from './client';

function asFetch(
  impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): jest.MockedFunction<typeof fetch> {
  return jest.fn(impl) as jest.MockedFunction<typeof fetch>;
}

function response(status: number, text: string): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => text,
  } as Response;
}

describe('problem details', () => {
  it('reads a problem body and falls back when the body is not one', () => {
    expect(problemDetail({ title: 'Unauthorized', detail: 'Code was not accepted' }, 401)).toEqual({
      title: 'Unauthorized',
      detail: 'Code was not accepted',
    });
    expect(problemDetail({ detail: 'Code was not accepted', title: '' }, 401).title).toBe(
      'Request failed',
    );
    expect(problemDetail({ detail: 'Code was not accepted', title: 1 }, 401).title).toBe(
      'Request failed',
    );
    expect(problemDetail({ detail: '' }, 400)).toEqual({
      title: 'Request failed',
      detail: 'Request failed (400)',
    });
    expect(problemDetail({ detail: 12 }, 400).detail).toBe('Request failed (400)');
    expect(problemDetail(null, 500).detail).toBe('Request failed (500)');
    expect(problemDetail(['nope'], 500).detail).toBe('Request failed (500)');
  });

  it('describes thrown values', () => {
    expect(errorDetail(new ApiError(401, 'Unauthorized', 'Code was not accepted'))).toBe(
      'Code was not accepted',
    );
    expect(errorDetail(new Error('offline'))).toBe('offline');
    expect(errorDetail(new Error(''))).toBe('Something went wrong');
    expect(errorDetail('offline')).toBe('Something went wrong');
  });
});

describe('requestJson', () => {
  it('posts JSON and returns the body', async () => {
    const fetchImpl = asFetch(async () => response(200, JSON.stringify({ ok: true })));
    await expect(
      requestJson(
        'http://127.0.0.1:8080/',
        {
          path: '/auth/refresh',
          body: { refreshToken: 'refresh' },
          requestId: 'req-1',
          token: 'access',
        },
        fetchImpl,
      ),
    ).resolves.toEqual({ ok: true });
    expect(String(fetchImpl.mock.calls[0]?.[0])).toBe('http://127.0.0.1:8080/auth/refresh');
    expect(fetchImpl.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer access',
      'X-Request-Id': 'req-1',
    });
  });

  it('accepts an origin without a trailing slash and an empty success body', async () => {
    const fetchImpl = asFetch(async () => response(204, ''));
    await expect(
      requestJson(
        'http://127.0.0.1:8080',
        {
          path: '/auth/sign-out',
          body: { refreshToken: 'refresh' },
          requestId: 'req-2',
          empty: true,
        },
        fetchImpl,
      ),
    ).resolves.toBeUndefined();
  });

  it('throws the problem detail for a failed call', async () => {
    const fetchImpl = asFetch(async () =>
      response(401, JSON.stringify({ detail: 'Code was not accepted' })),
    );
    await expect(
      requestJson(
        'http://127.0.0.1:8080',
        { path: '/auth/otp/verify', body: {}, requestId: 'req-3' },
        fetchImpl,
      ),
    ).rejects.toMatchObject({ status: 401, detail: 'Code was not accepted' });
  });

  it('throws when an empty response is not 204', async () => {
    const fetchImpl = asFetch(async () => response(401, 'not-json'));
    await expect(
      requestJson(
        'http://127.0.0.1:8080',
        { path: '/auth/sign-out', body: {}, requestId: 'req-4', empty: true },
        fetchImpl,
      ),
    ).rejects.toMatchObject({ detail: 'Request failed (401)' });
  });

  it('uses the global fetch when a caller does not pass one', async () => {
    const original = globalThis.fetch;
    globalThis.fetch = jest.fn(async () =>
      response(200, JSON.stringify({ ok: true })),
    ) as typeof fetch;
    await expect(
      requestJson('http://127.0.0.1:8080', { path: '/health', body: {}, requestId: 'req-0' }),
    ).resolves.toEqual({ ok: true });
    globalThis.fetch = original;
  });

  it('wraps a network failure', async () => {
    const fetchImpl = asFetch(async () => {
      throw new Error('offline');
    });
    await expect(
      requestJson(
        'http://127.0.0.1:8080',
        { path: '/auth/otp/send', body: {}, requestId: 'req-5' },
        fetchImpl,
      ),
    ).rejects.toMatchObject({ status: 0, detail: 'offline' });

    const thrown = asFetch(async () => {
      throw 'offline';
    });
    await expect(
      requestJson(
        'http://127.0.0.1:8080',
        { path: '/auth/otp/send', body: {}, requestId: 'req-6' },
        thrown,
      ),
    ).rejects.toMatchObject({ detail: 'Something went wrong' });
  });
});
