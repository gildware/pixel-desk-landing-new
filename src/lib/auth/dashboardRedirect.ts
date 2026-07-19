/** Cache-bust hard navigation into the dashboard (same as pixel-desk-web). */
export function dashboardRedirectUrl(
  baseUrl: string,
  options?: { csrfToken?: string | null },
): string {
  try {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('_cb', Date.now().toString());
    // Hash is not sent to the server; dashboard reads it to seed CSRF cache when
    // the csrf_token cookie is not readable across subdomains.
    if (options?.csrfToken) {
      url.hash = `csrf=${encodeURIComponent(options.csrfToken)}`;
    }
    return url.toString();
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?';
    const withCb = `${baseUrl}${separator}_cb=${Date.now()}`;
    if (!options?.csrfToken) return withCb;
    return `${withCb}#csrf=${encodeURIComponent(options.csrfToken)}`;
  }
}
