import { clearAuth, getApiBaseUrl, getToken } from './auth';

export const authFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearAuth();
    throw new Error(result.message || 'Session expired. Please sign in again.');
  }

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};
