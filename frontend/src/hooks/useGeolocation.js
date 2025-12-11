// src/hooks/useGeolocation.js
import { useEffect, useState } from "react";

export function useGeolocation(enabled) {
  const [position, setPosition] = useState(null); // { lat, lng }
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );

    return () => {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enabled]);

  return { position, error };
}
