const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Normalize URL by removing trailing slash
const normalizeUrl = (url) => url.replace(/\/$/, "");

export const API_BASE = normalizeUrl(API_BASE_URL);

/**
 * Helper to get full URL for images/assets from backend
 */
export const getBackendUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};
