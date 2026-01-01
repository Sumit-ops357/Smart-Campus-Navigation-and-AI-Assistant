// src/components/Auth/Login.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import campusImg from "../../assets/campus-building.jpg";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUser = await loginUser(form);
    if (!loggedInUser) return setError("Invalid email or password");
    
    if (loggedInUser.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
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
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Login As</label>
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
