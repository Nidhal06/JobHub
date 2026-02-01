export function getApiBase(): string {
  const w = (window as any) || {};
  const api = w.API_URL || (w.__env && w.__env.API_URL) || '';
  if (!api) {
    return 'http://localhost:8081/api';
  }
  // Normalize: ensure it doesn't end with a slash, and append '/api' if not present
  const normalized = api.endsWith('/') ? api.slice(0, -1) : api;
  return normalized.endsWith('/api') ? normalized : normalized + '/api';
}
