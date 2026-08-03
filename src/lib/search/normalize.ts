/** Lowercase, collapse whitespace, strip punctuation for fuzzy client-side search. */
export function normalizeSearchQuery(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesSearchQuery(query: string, ...fields: string[]): boolean {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return true;
  const haystack = fields.map((field) => normalizeSearchQuery(field)).join(' ');
  return normalized.split(' ').every((term) => haystack.includes(term));
}
