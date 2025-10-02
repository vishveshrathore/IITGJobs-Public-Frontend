import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Public/Landing Page/Navbar";
import Footer from "../../../components/Public/Landing Page/Footer";
import LockImg from "../../../assets/Lock.jpg";
import { BASE_URL } from "../../../config";
import { useAuth } from "../../../context/authcontext.jsx";

const AttritationGrid = () => {
  const navigate = useNavigate();
  const { loginCorporate: authLoginCorporate, logout: authLogout, isCorporate, isHydrating } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Derive auth state from context
  const authed = !!isCorporate && !isHydrating;

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const identifier = email.trim();
      const pwd = password.trim();
      if (!identifier || !pwd) {
        setError("Please enter email/mobile and password");
        return;
      }
      const resp = await fetch(`${BASE_URL}/api/recruitment/login/corporate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier, password: pwd }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data?.success === false) {
        const msg = data?.message || `Login failed (${resp.status})`;
        setError(msg);
        return;
      }
      // Store corporate login in AuthContext (persists to storage inside context)
      try {
        authLoginCorporate({ token: data.token, account: data.account }, true);
      } catch (_) {}
      setShowLogin(false);
      // Redirect to ConfidentialData page after successful login
      navigate("/confidential-data");
    } catch (err) {
      setError("Network error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    authLogout();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100">
      <Navbar />
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            {/* <h1 className="text-2xl font-bold">Access Confidential Data</h1> */}
            {authed ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/confidential-data')}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-500"
                >
                  Access Confidential Data
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold hover:bg-indigo-500"
              >
                Login
              </button>
            )}
          </div>

          {/* Grid Wrapper */}
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4">
            {/* The Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left: Image */}
              <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950/60 flex items-center justify-center p-2">
                <img
                  src={LockImg}
                  alt="Locked Preview"
                  loading="eager"
                  decoding="async"
                  className="h-auto w-full max-h-[600px] object-contain rounded-md shadow-md"
                />
              </div>

              {/* Right: Some demo metrics/text */}
              <div className="space-y-3">
                <h1 className="text-lg font-semibold">HR Alert Report</h1>
                <p className="text-sm text-slate-300">Explore attrition signals, HR alerts, and retention recommendations.</p>
              </div>
            </div>

            {/* Lock Overlay when not authed */}
            {!authed && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="rounded-xl border border-slate-700 bg-slate-800/90 p-6 text-center shadow-xl">
                  <div className="mb-3 text-lg font-semibold">Login required</div>
                  <p className="mb-4 text-sm text-slate-300">Please login to access confidential data</p>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
            <div className="mb-3 text-lg font-semibold">Login</div>
            {error && (
              <div className="mb-3 rounded-md border border-red-700 bg-red-900/30 p-2 text-sm text-red-300">
                {error}
              </div>
            )}
            <form onSubmit={onLogin} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AttritationGrid;
