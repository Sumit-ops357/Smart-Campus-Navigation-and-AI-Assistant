// src/components/Map/UserLocationTracker.jsx

import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // GPS arrow icon
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

export default function UserLocationTracker({ onMove }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported in this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];

        setPosition(newPos);
        if (onMove) onMove(newPos);
      },
      (err) => {
        console.warn("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onMove]);

  if (!position) return null;

  return <Marker position={position} icon={userIcon} />;
}
