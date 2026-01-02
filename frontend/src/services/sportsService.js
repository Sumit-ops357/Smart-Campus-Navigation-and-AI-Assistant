import { API_BASE } from "../config/apiConfig";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

export async function fetchFacilities() {
  const res = await fetch(`${API_BASE}/api/sports/facilities`);
  return res.json();
}

export async function fetchMyBookings(token) {
  const res = await fetch(`${API_BASE}/api/sports/bookings`, {
    headers: getHeaders(token)
  });
  return res.json();
}

export async function createBooking(bookingData, token) {
  const res = await fetch(`${API_BASE}/api/sports/bookings`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(bookingData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create booking");
  }
  return res.json();
}

export async function cancelBooking(bookingId, token) {
  const res = await fetch(`${API_BASE}/api/sports/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: getHeaders(token)
  });
  return res.json();
}

export async function fetchPlaymateRequests() {
  const res = await fetch(`${API_BASE}/api/sports/playmates`);
  return res.json();
}

export async function createPlaymateRequest(requestData, token) {
  const res = await fetch(`${API_BASE}/api/sports/playmates`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(requestData)
  });
  return res.json();
}

export async function joinPlaymateRequest(requestId, token) {
  const res = await fetch(`${API_BASE}/api/sports/playmates/${requestId}/join`, {
    method: "POST",
    headers: getHeaders(token)
  });
  return res.json();
}

export async function fetchEquipment() {
  const res = await fetch(`${API_BASE}/api/sports/equipment`);
  return res.json();
}
