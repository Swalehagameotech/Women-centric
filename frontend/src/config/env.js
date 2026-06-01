/**
 * API base URL — set VITE_API_BASE_URL in frontend/.env (local) or on Render (production build).
 */
export const getApiBaseUrl = () => {
  const fromVite = import.meta.env.VITE_API_BASE_URL?.trim();
  const fromRuntime =
    typeof window !== 'undefined' && window.__API_BASE_URL__
      ? String(window.__API_BASE_URL__).trim()
      : '';

  const url = (fromVite || fromRuntime).replace(/\/$/, '');

  if (!url) {
    throw new Error(
      'API URL is not configured. Set VITE_API_BASE_URL on Render (frontend) to your backend URL, then redeploy.',
    );
  }

  return url;
};
