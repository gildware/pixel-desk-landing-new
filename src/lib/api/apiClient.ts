import { API_BASE_URL, DEFAULT_FETCH_OPTIONS } from './api.config';
import { csrfHeadersForMethod } from '../csrf';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
}

const AUTH_PATHS_NO_REFRESH = new Set([
  '/auth/refresh',
  '/auth/request-otp',
  '/auth/verify-otp',
  '/auth/logout',
]);

function shouldTryRefresh(endpoint: string): boolean {
  return !AUTH_PATHS_NO_REFRESH.has(endpoint);
}

async function postRefresh(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    ...DEFAULT_FETCH_OPTIONS,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...csrfHeadersForMethod('POST'),
    },
  });
  return res.ok;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
  didRefresh = false,
): Promise<T> {
  const method = options.method || 'GET';
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...DEFAULT_FETCH_OPTIONS,
    method,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...csrfHeadersForMethod(method),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401 && shouldTryRefresh(endpoint) && !didRefresh) {
    const refreshed = await postRefresh();
    if (refreshed) {
      return apiClient<T>(endpoint, options, true);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message || 'Something went wrong',
    );
  }

  return response.json();
}
