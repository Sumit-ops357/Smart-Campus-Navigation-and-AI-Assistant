// src/components/Auth/Register.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import campusImg from "../../assets/campus-building.jpg";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { success, message } = await registerUser(form);
    if (!success) {
      setError(message);
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
          <h2 className="auth-title">Register</h2>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="yours@university.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Select Role</label>
              <div className="role-selector">
                <button 
                  type="button"
                  className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'student' })}
                >
                  Student
                </button>
                <button 
                  type="button"
                  className={`role-btn ${form.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'admin' })}
                >
                  Admin
                </button>
              </div>
            </div>

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
