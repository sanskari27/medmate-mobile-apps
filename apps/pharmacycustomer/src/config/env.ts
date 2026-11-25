const LOCAL_API = 'http://127.0.0.1:8080';

export function apiBaseUrl(env: string | undefined): string {
  const value = env?.trim() ?? '';
  if (!value) return LOCAL_API;
  if (value.endsWith('/')) return value.slice(0, -1);
  return value;
}

export function configuredApiBaseUrl(): string {
  return apiBaseUrl(process.env.EXPO_PUBLIC_API_URL);
}
