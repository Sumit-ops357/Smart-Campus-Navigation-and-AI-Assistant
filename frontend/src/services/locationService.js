// src/services/locationService.js

// 👉 named export: fetchLocations
export const fetchLocations = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/locations");
    if (!res.ok) {
      throw new Error("Failed to fetch locations");
    }
    return await res.json();
  } catch (err) {
    console.error("❌ Location fetch error:", err.message);
    return []; // fallback so app keeps working with static data
  }
};
