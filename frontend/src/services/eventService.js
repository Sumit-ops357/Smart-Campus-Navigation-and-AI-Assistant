const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  return res.json();
}
export async function rsvpEvent(eventId, token) {
  const res = await fetch(`${API_BASE}/api/events/${eventId}/rsvp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to RSVP");
  }
  return res.json();
}

export async function createEvent(formData, token) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: Do NOT set Content-Type for FormData, browser sets it with boundary
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to create event");
  }
  return res.json();
}

export async function fetchPendingEvents(token) {
  const res = await fetch(`${API_BASE}/api/events/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pending events");
  }
  return res.json();
}

export async function approveEvent(eventId, token) {
  const res = await fetch(`${API_BASE}/api/events/${eventId}/approve`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to approve event");
  }
  return res.json();
}

export async function fetchAdminEvents(token) {
  const res = await fetch(`${API_BASE}/api/events/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin events");
  }
  return res.json();
}
