// src/context/RouteContext.jsx
import { createContext, useContext, useState } from "react";

const RouteContext = createContext(null);

export function RouteProvider({ children }) {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState("");

  const clearRoute = () => {
    setStartLocation(null);
    setEndLocation(null);
    setRouteInfo(null);
    setRouteError("");
  };

  return (
    <RouteContext.Provider
      value={{
        startLocation,
        endLocation,
        setStartLocation,
        setEndLocation,
        routeInfo,
        setRouteInfo,
        routeError,
        setRouteError,
        clearRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const ctx = useContext(RouteContext);
  if (!ctx) {
    throw new Error("useRoute must be used inside RouteProvider");
  }
  return ctx;
}
