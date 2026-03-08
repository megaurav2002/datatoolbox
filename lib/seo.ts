export const SITE_NAME = "DataToolbox";

const FALLBACK_SITE_URL = "https://datatoolbox.tools";

export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildMetaTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}
