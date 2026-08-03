/** Comma-separated social profile URLs from PUBLIC_ORG_SAME_AS at build time. */
export function parseSameAs(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.startsWith('http'));
}
