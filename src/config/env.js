function normalizeUrl(value) {
  return (value || '').trim().replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeUrl(
  import.meta.env.VITE_API_BASE_URL || ''
);

export const API_DIRECT_URL = normalizeUrl(
  import.meta.env.VITE_API_DIRECT_URL ||
  API_BASE_URL
);

export function buildApiUrl(path, baseUrl = API_BASE_URL) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
