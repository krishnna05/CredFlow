import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Register the user (Business role is default in backend)
      const res = await API.post("/auth/register", { name, email, password });
      
      // Automatically login and redirect
      login(res.data.token, res.data.user);
      navigate("/dashboard");
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create CredFlow Account</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your business name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1a1a1a", fontWeight: "bold" }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}