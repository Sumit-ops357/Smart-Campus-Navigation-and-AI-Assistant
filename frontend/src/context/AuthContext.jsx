// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Backend base URL (from .env or fallback)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// one axios instance we can reuse
const api = axios.create({
  baseURL: API_BASE,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load stored auth on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("scn_user");
    const storedToken = localStorage.getItem("scn_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // 🔹 LOGIN
  const loginUser = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      const { token, user } = res.data;

      setUser(user);
      setToken(token);

      localStorage.setItem("scn_user", JSON.stringify(user));
      localStorage.setItem("scn_token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user; // Return user object for immediate navigation check
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return null;
    }
  };

  // 🔹 REGISTER  (this is what was missing / wrong)
   // 🔹 REGISTER
  const registerUser = async (userData) => {
    try {
      const res = await api.post("/api/auth/register", userData);

      console.log("Register success:", res.data);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("scn_user");
    localStorage.removeItem("scn_token");
    delete api.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loginUser,
    registerUser, // 👈 IMPORTANT: now provided to context
    logout,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use anywhere
export const useAuth = () => useContext(AuthContext);
