import { helpGuides } from '../../data/help-guides';
import type { BlogPost } from '../../data/blog-types';

export type SearchResult = {
  title: string;
  excerpt: string;
  href: string;
  type: string;
};

/** Flat index for Help Center search (guides, blog posts, and static cards). */
export function buildHelpSearchIndex(
  cards: { title: string; body: string; href: string }[],
  faqs: { q: string; a: string }[],
  blogs: Pick<BlogPost, 'title' | 'excerpt' | 'slug' | 'category'>[] = [],
): SearchResult[] {
  const fromCards = cards.map((card) => ({
    title: card.title,
    excerpt: card.body,
    href: card.href,
    type: 'Resource',
  }));

  const fromGuides = helpGuides.map((guide) => ({
    title: guide.title,
    excerpt: guide.description,
    href: `/resources/guides/${guide.slug}`,
    type: guide.topic,
  }));

  const fromBlogs = blogs.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    href: `/blogs/${post.slug}`,
    type: post.category,
  }));

  const fromFaqs = faqs.map((item) => ({
    title: item.q,
    excerpt: item.a,
    href: '#help-faq',
    type: 'FAQ',
  }));

  return [...fromCards, ...fromGuides, ...fromBlogs, ...fromFaqs];
}
