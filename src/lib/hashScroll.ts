import GithubSlugger from 'github-slugger';

const HEADING_SELECTOR = '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6';

function normalizeHash(hashValue: string): string {
  return decodeURIComponent(hashValue.replace(/^#/, '')).trim();
}

function hashCandidates(normalizedHash: string): string[] {
  return Array.from(new Set([
    normalizedHash,
    normalizedHash.toLowerCase(),
    normalizedHash.replace(/\s+/g, '-'),
    normalizedHash.toLowerCase().replace(/\s+/g, '-'),
    `user-content-${normalizedHash}`,
    `user-content-${normalizedHash.toLowerCase().replace(/\s+/g, '-')}`
  ]));
}

function cleanHeadingText(headingText: string): string {
  return headingText
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u200D\uFE0F]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createHeadingSlug(slugger: GithubSlugger, headingText: string): string {
  const cleaned = cleanHeadingText(headingText);
  const rawSlug = slugger.slug(cleaned || headingText);
  return rawSlug.replace(/^-+|-+$/g, '');
}

function findHeadingByGithubSlug(normalizedHash: string): HTMLElement | null {
  const headings = Array.from(document.querySelectorAll<HTMLElement>(HEADING_SELECTOR));
  if (!headings.length) return null;

  const rawSlugger = new GithubSlugger();
  const cleanedSlugger = new GithubSlugger();
  for (const heading of headings) {
    const text = heading.textContent?.trim() || '';
    const rawSlug = rawSlugger.slug(text);
    const cleanedSlug = createHeadingSlug(cleanedSlugger, text);
    if (rawSlug === normalizedHash || cleanedSlug === normalizedHash) return heading;
  }

  return null;
}

export function findHashTarget(hashValue: string): HTMLElement | null {
  const normalizedHash = normalizeHash(hashValue);
  if (!normalizedHash) return null;

  for (const candidate of hashCandidates(normalizedHash)) {
    const byId = document.getElementById(candidate);
    if (byId) return byId;
  }

  return findHeadingByGithubSlug(normalizedHash);
}

export function scrollToHash(hashValue: string, smooth = true): boolean {
  const target = findHashTarget(hashValue);
  if (!target) return false;

  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  return true;
}
