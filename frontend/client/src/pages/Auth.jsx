import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isRegister = location.pathname === "/register";

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  // Toggle between Login and Register
  const handleSwitch = (toRegister) => {
    setLoginError("");
    setRegError("");
    navigate(toRegister ? "/register" : "/login");
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSubmitting(true);
    try {
      await register(regName, regEmail, regPassword);
      navigate("/");
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`circle-wrapper ${isRegister ? "active" : ""}`} id="wrapper">
        {/* Continuous Rotating Neon Light Border */}
        <div className="glow-ring"></div>

        {/* Main Pure White Circle Container */}
        <div className="form-container">
          {/* LOGIN FORM */}
          <form className="form-box login-form" id="loginForm" onSubmit={handleLoginSubmit}>
            <h2 className="neon-title">WELCOME</h2>
            <p className="subtitle">Login to your account</p>

            {loginError && <p className="auth-error-msg">{loginError}</p>}

            <div className="input-group">
              <input
                type="email"
                required
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <input
                type={showLoginPass ? "text" : "password"}
                id="loginPass"
                required
                placeholder=" "
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <label>Password</label>
              <i
                className={`bx ${showLoginPass ? "bx-show" : "bx-hide"} toggle-pass`}
                onClick={() => setShowLoginPass((prev) => !prev)}
                role="button"
                aria-label="Toggle password visibility"
              />
            </div>

            <div className="forgot-row">
              <a href="#" className="forgot" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" disabled={loginSubmitting} className="neon-btn">
              {loginSubmitting ? "PLEASE WAIT..." : "LOGIN"}
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <span onClick={() => handleSwitch(true)}>Sign Up</span>
            </p>
          </form>

          {/* REGISTER FORM */}
          <form className="form-box register-form" id="registerForm" onSubmit={handleRegisterSubmit}>
            <h2 className="neon-title">REGISTER</h2>
            <p className="subtitle">Create your account</p>

            {regError && <p className="auth-error-msg">{regError}</p>}

            <div className="input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <label>Full Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                required
                placeholder=" "
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <input
                type={showRegPass ? "text" : "password"}
                id="regPass"
                required
                minLength={6}
                placeholder=" "
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <label>Password</label>
              <i
                className={`bx ${showRegPass ? "bx-show" : "bx-hide"} toggle-pass`}
                onClick={() => setShowRegPass((prev) => !prev)}
                role="button"
                aria-label="Toggle password visibility"
              />
            </div>

            <button type="submit" disabled={regSubmitting} className="neon-btn">
              {regSubmitting ? "PLEASE WAIT..." : "SIGN UP"}
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => handleSwitch(false)}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
