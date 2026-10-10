/**
 * Utility to get the clean base application URL for sharing referral links,
 * QR codes, and digital ID cards.
 * Automatically adapts between:
 * 1. Custom domain: https://accindia.js.org
 * 2. GitHub Pages repo: https://accindia.github.io/acc
 * 3. Localhost / Preview URLs
 */
export function getBaseAppUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://accindia.js.org';
  }

  const origin = window.location.origin;
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // On GitHub Pages (e.g. accindia.github.io/acc)
  if (hostname.endsWith('github.io')) {
    const segments = pathname.split('/').filter(Boolean);
    // If the path contains the repo name (like /acc or /acc/docs)
    if (segments.length > 0 && segments[0] !== 'docs') {
      return `${origin}/${segments[0]}`;
    }
  }

  return origin;
}

export function getReferralUrl(sponsorId: string): string {
  const base = getBaseAppUrl();
  const cleanId = (sponsorId || 'ACC249').trim().toUpperCase();
  return `${base}/?sponsor=${cleanId}`;
}
