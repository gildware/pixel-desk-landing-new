import type { FaqItem } from '../lib/seo/schema';

export type BlogSection = {
  heading: string;
  level?: 2 | 3;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  /** Optional line break markup for listing cards (plain text in detail view). */
  titleHtml?: string;
  excerpt: string;
  date: string;
  dateIso: string;
  targetKeyword: string;
  sections: BlogSection[];
  faqs: FaqItem[];
  readMoreVariant?: 'navy' | 'grey';
  /** Card thumbnail from super-admin CMS. */
  imageUrl?: string | null;
  /** Detail hero banner from super-admin CMS. */
  coverImageUrl?: string | null;
  /** Rich HTML body from super-admin CMS. */
  fullDescription?: string;
};

export type HelpGuide = {
  slug: string;
  topic: string;
  title: string;
  description: string;
  steps: { name: string; text: string }[];
  faqs: FaqItem[];
};
