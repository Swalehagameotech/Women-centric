/**
 * API base URL — set VITE_API_BASE_URL in frontend/.env
 * (restart `npm run dev` after changing .env)
 */
export const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!url) {
    throw new Error(
      'VITE_API_BASE_URL is missing. Add it to frontend/.env (see .env.example).',
    );
  }
  return url.replace(/\/$/, '');
};
