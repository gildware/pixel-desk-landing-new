import type { BlogPost } from '../../data/blog-types';
import { sectionAnchorId } from '../../data/blog-posts';

export type PlatformBlogPostRow = {
  id: string;
  category: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string | null;
  coverImageUrl: string | null;
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

type PaginatedBlogPosts = {
  items: PlatformBlogPostRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function serverApiBase(): string {
  const raw =
    (import.meta.env.PUBLIC_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  return raw || 'http://localhost:3002';
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${serverApiBase()}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message || `Request failed (${res.status})`,
    );
  }
  const json = (await res.json()) as ApiSuccess<T>;
  return json.data;
}

function formatBlogDate(iso: string): { date: string; dateIso: string } {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', dateIso: iso };
  }
  return {
    date: parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    dateIso: parsed.toISOString().slice(0, 10),
  };
}

export function mapPlatformBlogToPost(row: PlatformBlogPostRow): BlogPost {
  const { date, dateIso } = formatBlogDate(row.createdAt);
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.shortDescription,
    date,
    dateIso,
    targetKeyword: row.category,
    imageUrl: row.imageUrl,
    coverImageUrl: row.coverImageUrl,
    fullDescription: row.fullDescription,
    readMoreVariant: 'grey',
    sections: [],
    faqs: [],
  };
}

export type BlogTocItem = {
  id: string;
  text: string;
};

export function extractTocFromHtml(html: string): BlogTocItem[] {
  const items: BlogTocItem[] = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ id: sectionAnchorId(text), text });
  }
  return items;
}

export function addHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_full, attrs: string, content: string) => {
    const text = content.replace(/<[^>]+>/g, '').trim();
    const id = sectionAnchorId(text);
    const hasId = /\bid\s*=/.test(attrs);
    if (hasId) return `<h2${attrs}>${content}</h2>`;
    return `<h2${attrs} id="${id}">${content}</h2>`;
  });
}

export async function fetchPublicBlogPosts(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedBlogPosts> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return publicFetch<PaginatedBlogPosts>(`/public/blog-posts${qs ? `?${qs}` : ''}`);
}

export async function fetchPublicBlogCategories(): Promise<string[]> {
  return publicFetch<string[]>('/public/blog-categories');
}

export async function fetchPublicBlogPostBySlug(
  slug: string,
): Promise<PlatformBlogPostRow> {
  return publicFetch<PlatformBlogPostRow>(`/public/blog-posts/${encodeURIComponent(slug)}`);
}

export async function fetchAllPublicBlogPosts(): Promise<BlogPost[]> {
  const result = await fetchPublicBlogPosts({ limit: 100 });
  return result.items.map(mapPlatformBlogToPost);
}

export function getRelatedBlogPosts(
  allPosts: BlogPost[],
  current: BlogPost,
  limit = 3,
): BlogPost[] {
  return allPosts
    .filter((entry) => entry.category === current.category && entry.slug !== current.slug)
    .slice(0, limit);
}

export function getMustReadBlogPosts(
  allPosts: BlogPost[],
  current: BlogPost,
  limit = 3,
): BlogPost[] {
  return allPosts.filter((entry) => entry.slug !== current.slug).slice(0, limit);
}
