/** Cache-bust hard navigation into the dashboard (same as pixel-desk-web). */
export function dashboardRedirectUrl(baseUrl: string): string {
  try {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('_cb', Date.now().toString());
    return url.toString();
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}_cb=${Date.now()}`;
  }
}
