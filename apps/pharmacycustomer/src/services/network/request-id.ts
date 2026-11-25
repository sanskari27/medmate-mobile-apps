export function createRequestId(): string {
  return `req-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}
