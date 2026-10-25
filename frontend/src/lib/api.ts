const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "");

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not configured");
}

export function apiUrl(path: string) {
  return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
