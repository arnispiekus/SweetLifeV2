// Shared SEO/Open Graph defaults reused by the root layout and per-page
// layouts so subpages don't lose og:image/siteName when they set their own
// `openGraph` object (Next.js replaces the whole `openGraph` object per
// segment rather than deep-merging it).
export const SITE_URL = 'https://sweetlife.cafe';

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/SweetLifeCafe_Hero_1.webp`,
  width: 1200,
  height: 630,
  alt: 'Sweet Life Cafe - Korean Cafe & Restaurant in Newry',
};
