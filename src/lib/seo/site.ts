import { parseSameAs } from './social';

/** Canonical site origin — override with PUBLIC_SITE_URL in production. */
export const siteUrl = (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? 'https://www.pixeldesk.in';

/** Secondary domain — 301 to siteUrl at nginx; listed in Organization schema when set. */
export const alternateSiteUrl =
  (import.meta.env.PUBLIC_ALT_SITE_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://www.thepixeldesk.com';

export const siteName = 'Pixeldesk';

export const defaultOgImage = `${siteUrl}/images/og-image.png`;

export const organization = {
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/images/logo.svg`,
  supportEmail: 'support@pixeldesk.in',
  sameAs: parseSameAs(import.meta.env.PUBLIC_ORG_SAME_AS as string | undefined),
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function canonicalFromPath(pathname: string): string {
  const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return absoluteUrl(path === '' ? '/' : path);
}
