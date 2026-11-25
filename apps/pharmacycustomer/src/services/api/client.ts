import { ApiError, errorDetail, problemDetail } from './problem';

export type JsonRequest = {
  path: string;
  body: unknown;
  token?: string;
  requestId: string;
  empty?: boolean;
};

export async function requestJson(
  baseUrl: string,
  request: JsonRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': request.requestId,
  };
  if (request.token) headers.Authorization = `Bearer ${request.token}`;

  const root = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  let response: Response;
  try {
    response = await fetchImpl(`${root}${request.path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request.body),
    });
  } catch (error) {
    throw new ApiError(0, 'Network', errorDetail(error));
  }

  const payload = await readJson(response);
  if (request.empty) {
    if (response.status === 204) return undefined;
    const problem = problemDetail(payload, response.status);
    throw new ApiError(response.status, problem.title, problem.detail);
  }
  if (!response.ok) {
    const problem = problemDetail(payload, response.status);
    throw new ApiError(response.status, problem.title, problem.detail);
  }
  return payload;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
