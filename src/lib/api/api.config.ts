const RAW_API_URL =
  (import.meta.env.PUBLIC_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const USE_PROXY =
  import.meta.env.PUBLIC_USE_API_PROXY === 'true' && RAW_API_URL.startsWith('http');

/** Same resolution pattern as pixel-desk-web. */
export const API_BASE_URL = USE_PROXY
  ? '/api/proxy'
  : RAW_API_URL || 'http://localhost:3002';

export const DASHBOARD_URL =
  (import.meta.env.PUBLIC_DASHBOARD_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:5173';

export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};
