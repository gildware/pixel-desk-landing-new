import { API_BASE_URL } from './api.config';

export type PlatformWhatsNewRow = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ApiSuccess<T> = {
  status: string;
  message: string;
  data: T;
};

function apiBase(): string {
  if (import.meta.env.SSR) {
    const raw =
      (import.meta.env.PUBLIC_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
    return raw || 'http://localhost:3002';
  }
  return API_BASE_URL;
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message || `Request failed (${res.status})`,
    );
  }
  const json = (await res.json()) as ApiSuccess<T> | T;
  if (json && typeof json === 'object' && 'data' in json) {
    return (json as ApiSuccess<T>).data;
  }
  return json as T;
}

export async function fetchPublicWhatsNewUpdates(): Promise<PlatformWhatsNewRow[]> {
  return publicFetch<PlatformWhatsNewRow[]>('/public/whats-new-updates');
}
