const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  return res.json();
}
