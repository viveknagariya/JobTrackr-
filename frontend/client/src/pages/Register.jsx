import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Violet Hero Banner (Compact & Clean) */}
      <section className="auth-hero-banner text-center py-7 md:py-9 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Banner Heading */}
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
            Join JobTrackr Community
          </h1>

          {/* Banner Subtitle */}
          <p className="hero-subtitle text-xs md:text-sm font-normal max-w-xl mx-auto leading-relaxed">
            Create your candidate account to organize applications, track
            interview stages, and manage your career pipeline.
          </p>
        </div>
      </section>

      {/* 2. White Card (No Overlap, Positioned Cleanly Below) */}
      <main className="py-8 md:py-10 px-4 flex justify-center flex-1">
        <div className="w-full max-w-xl auth-card p-8 md:p-10 relative z-10 flex flex-col">
          {/* Top Center Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4 text-violet-600 shadow-xs">
            <UserPlus className="w-8 h-8 text-violet-600" />
          </div>

          {/* Card Title & Subtitle */}
          <h2 className="auth-card-title text-2xl font-black text-center tracking-tight">
            Create Your Account
          </h2>
          <p className="auth-card-subtitle text-center text-xs md:text-sm font-medium mt-1 mb-6">
            Fill in the details below to complete your registration
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 2-Column Grid for Name & Email on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name Field */}
              <div>
                <label className="auth-field-label">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                <div className="auth-input-container">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="auth-input"
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div>
                <label className="auth-field-label">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <div className="auth-input-container">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="auth-field-label">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <div className="auth-input-container">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password (min. 6 chars)"
                  className="auth-input has-eye"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Violet Submit Button with Shine Effect */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-auth-submit"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Your Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switch Link */}
          <p className="text-center text-sm font-medium text-slate-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 font-bold hover:text-violet-700 hover:underline transition-colors ml-1"
            >
              Login to Account
            </Link>
          </p>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        © 2026 JobTrackr. All rights reserved.
      </footer>
    </div>
  );
}
