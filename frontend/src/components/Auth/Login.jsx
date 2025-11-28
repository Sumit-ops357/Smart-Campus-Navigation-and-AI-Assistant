// src/components/Auth/Login.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import campusImg from "../../assets/campus-building.jpg";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(form);
    if (!success) return setError("Invalid email or password");
    navigate("/");
  };

  return (
    <div
      className="login-page-bg"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      <div className="login-overlay">
        <div className="auth-container login-card">
          <h2 className="auth-title">Login</h2>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="auth-footer">
            New user? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
