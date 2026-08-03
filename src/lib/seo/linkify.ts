/** Turn plain-text /features and /pricing mentions into internal links. */
export function linkifyInternalPaths(text: string): string {
  return text
    .replace(/\/features/g, '<a href="/features">features</a>')
    .replace(/\/pricing/g, '<a href="/pricing">pricing</a>');
}
