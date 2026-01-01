// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RouteProvider } from "./context/RouteContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RouteProvider>
          <App />
        </RouteProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
