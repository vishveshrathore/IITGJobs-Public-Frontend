import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Landing Page/Footer";
import Navbar from "../Landing Page/Navbar";
import { BASE_URL } from "../../../config";
import { useAuth } from "../../../context/authcontext.jsx";
import { toast } from "react-hot-toast";

const EmployerLoginPage = () => {
  const [identifier, setIdentifier] = useState(""); // email or mobile
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginCorporate, isAuthenticated, isCorporate, isHydrating } = useAuth();

  // If already authenticated as corporate, redirect to dashboard immediately
  useEffect(() => {
    if (!isHydrating && isAuthenticated && isCorporate) {
      navigate("/client/dashboard", { replace: true });
    }
  }, [isHydrating, isAuthenticated, isCorporate, navigate]);

  const notify = (message, type = "info") => {
    if (type === 'success') return toast.success(message);
    if (type === 'error') return toast.error(message);
    return toast(message);
  };

  const isEmail = (v) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v);
  const isPhone = (v) => /^\+?[0-9\s-]{7,15}$/.test(v);

  const validateCreds = () => {
    const e = {};
    if (!(isEmail(identifier) || isPhone(identifier))) {
      e.identifier = "Enter a valid email or mobile number.";
    }
    if (!password || password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmitCreds = async (e) => {
    e.preventDefault();
    if (!validateCreds()) return;
    setLoading(true);
    setInfo("");
    try {
      const resp = await fetch(`${BASE_URL}/api/recruitment/login/corporate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok) {
        const msg = data?.message || data?.error || `Login failed (${resp.status})`;
        setInfo("");
        notify(msg, "error");
        return;
      }

      // Save auth in context (corporate)
      if (data?.token && data?.account) {
        // remember = true for persistence; adjust as needed
        loginCorporate(data.token, data.account, true);
      }
      notify(data?.message || "Login successful", "success");
      setInfo("Login successful. Redirecting...");
      // Redirect to corporate client dashboard
      setTimeout(() => navigate("/client/dashboard", { replace: true }), 600);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <section className="relative py-16 bg-slate-900">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-900" />
        <div className="mx-auto max-w-sm px-4 sm:px-6">
          <h1 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">Employer Demo Login</h1>
          <p className="mt-2 text-center text-sm text-slate-300">Login with your email or mobile and password.</p>

          {/* Toast container */}
          <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2">
            {toast.show && (
              <div
                className={`pointer-events-auto rounded-md px-4 py-3 text-sm shadow-lg transition-all ${toast.type === 'error' ? 'bg-red-600 text-white' : toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'}`}
                role="status"
                aria-live="polite"
              >
                {toast.message}
              </div>
            )}
          </div>

          <form onSubmit={onSubmitCreds} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Email or Mobile</label>
              <input
                className="w-full rounded-lg border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="you@company.com or +91 98765 43210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          {info && <div className="mt-4 text-center text-xs text-slate-400">{info}</div>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EmployerLoginPage;