// frontend/src/services/chatService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  // read token from scn_token
  const token = localStorage.getItem("scn_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/api/chat/sessions`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load sessions");
  return res.json();
}

export async function createSession(title) {
  const res = await fetch(`${API_BASE}/api/chat/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function fetchSession(id) {
  const res = await fetch(`${API_BASE}/api/chat/sessions/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load session");
  return res.json();
}

export async function sendChatMessage(sessionId, text) {
  const res = await fetch(
    `${API_BASE}/api/chat/sessions/${sessionId}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ text }),
    }
  );
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
