// src/components/Auth/Register.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import campusImg from "../../assets/campus-building.jpg";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear old error

    const { success, message } = await registerUser(form);

    if (!success) {
      setError(message); // show real backend message
      return;
    }

    navigate("/login");
  };

  return (
    <div
      className="login-page-bg"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      <div className="login-overlay">
        <div className="auth-container login-card">
          <h2 className="auth-title">Create Account</h2>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

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
              Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
