const configuredApi = import.meta.env.VITE_ART_API_BASE_URL;
const apiBase = (configuredApi || (import.meta.env.DEV ? 'http://localhost:4000' : 'https://api.calvinmerrell.com'))
  .replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.msg || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export function websocketUrl() {
  return `${apiBase.replace(/^http/, 'ws')}/ws`;
}
