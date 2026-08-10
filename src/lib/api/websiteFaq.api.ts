import { API_BASE_URL as clientApiBase } from './api.config';

export type WebsiteFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type WebsiteFaqCategory = {
  category: string;
  categorySortOrder: number;
  items: WebsiteFaqItem[];
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
  return clientApiBase;
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message || `Request failed (${res.status})`,
    );
  }
  const json = (await res.json()) as ApiSuccess<T>;
  return json.data;
}

export async function fetchPublicWebsiteFaqs(): Promise<WebsiteFaqCategory[]> {
  return publicFetch<WebsiteFaqCategory[]>('/public/website-faqs');
}

export function flattenWebsiteFaqsForSearch(
  categories: WebsiteFaqCategory[],
): { q: string; a: string }[] {
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({ q: item.question, a: item.answer })),
  );
}

export type FaqAccordionItem = {
  id: string;
  q: string;
  a: string;
  open?: boolean;
};

export function mapCategoryItemsToAccordion(
  items: WebsiteFaqItem[],
  openFirst = true,
): FaqAccordionItem[] {
  return items.map((item, index) => ({
    id: item.id,
    q: item.question,
    a: item.answer,
    open: openFirst && index === 0,
  }));
}
