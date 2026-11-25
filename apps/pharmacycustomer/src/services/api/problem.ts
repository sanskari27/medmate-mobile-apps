import { isRecord } from '../../utils/record';

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string;

  constructor(status: number, title: string, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
  }
}

export function errorDetail(error: unknown): string {
  if (error instanceof ApiError) return error.detail;
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong';
}

export function problemDetail(body: unknown, status: number): { title: string; detail: string } {
  if (isRecord(body) && typeof body.detail === 'string' && body.detail) {
    const title = typeof body.title === 'string' && body.title ? body.title : 'Request failed';
    return { title, detail: body.detail };
  }
  return { title: 'Request failed', detail: `Request failed (${status})` };
}
