import React, { useState } from "react";
import Footer from "../Landing Page/Footer";
import Navbar from "../Landing Page/Navbar";
import { BASE_URL } from "../../../config";
import { toast } from "react-hot-toast";

const initial = {
  companyName: "",
  industryType: "",
  hrName: "",
  mobile: "",
  email: "",
  designation: "",
  employeeStrength: "",
  password: "",
  location: "",
  productLine: "",
};

// Define the core gradient style for the theme
const GRADIENT_TEXT_STYLE = {
  backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #dbeafe 40%, #6366f1 100%)',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
};

const EmployerSignupPage = () => {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  // stages: 'form' | 'otp' | 'result'
  const [stage, setStage] = useState('form');

  const notify = (message, type = "info") => {
    if (type === "success") return toast.success(message);
    if (type === "error") return toast.error(message);
    return toast(message);
  };

  const setField = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const onBlur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  // Validations
  const nameValid = values.companyName.trim().length >= 2;
  const industryValid = values.industryType.trim().length >= 2;
  const hrValid = values.hrName.trim().length >= 2;
  const phoneValid = /^\+?[0-9\s-]{7,15}$/.test(values.mobile);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const designationValid = values.designation.trim().length >= 2;
  const strengthValid = values.employeeStrength === "" || /^[0-9]+$/.test(values.employeeStrength);
  const passwordValid = typeof values.password === "string" && values.password.length >= 6;
  const locationValid = values.location.trim().length >= 2;
  const productLineValid = values.productLine.trim().length >= 2;

  const canSubmit =
    nameValid &&
    industryValid &&
    hrValid &&
    phoneValid &&
    emailValid &&
    designationValid &&
    strengthValid &&
    passwordValid &&
    locationValid &&
    productLineValid;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      companyName: true,
      industryType: true,
      hrName: true,
      mobile: true,
      email: true,
      designation: true,
      employeeStrength: true,
      password: true,
      location: true,
      productLine: true,
    });
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    // Immediately hide form and show OTP modal
    setStage('otp');

    try {
      const API_BASE = BASE_URL || "";
      const url = `${API_BASE}/api/recruitment/create/corporate-account`;

      const payload = {
        companyName: values.companyName.trim(),
        industryType: values.industryType.trim(),
        hrName: values.hrName.trim(),
        mobile: values.mobile.trim(),
        email: values.email.trim(),
        designation: values.designation.trim(),
        password: values.password,
        location: values.location.trim(),
        productLine: values.productLine.trim(),
      };
      if (values.employeeStrength !== "") {
        payload.employeeStrength = Number(values.employeeStrength);
      }

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const message = data?.message || `Request failed with status ${resp.status}`;
        setError(message);
        notify(message, "error");
        // If backend fails, return to form stage
        setStage('form');
      } else {
        setSuccessMsg(data?.message || "OTP sent to your email. Please verify.");
        notify(data?.message || "OTP sent to your email. Please verify.", "success");
        // Stay in OTP stage
        setValues((s) => ({
          companyName: "",
          industryType: "",
          hrName: "",
          mobile: "",
          email: s.email,
          designation: "",
          employeeStrength: "",
          password: "",
          location: "",
          productLine: "",
        }));
        setTouched({ email: true, password: false });
      }
    } catch (err) {
      setError("Network error. Please try again.");
      notify("Network error. Please try again.", "error");
      setStage('form');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !values.email) return;
    setVerifying(true);
    setError("");
    try {
      const url = `${BASE_URL}/api/recruitment/verify/corporate`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: values.email.trim(), otp: otp.trim() }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const message = data?.message || `Verification failed (${resp.status})`;
        setError(message);
        notify(message, "error");
        setVerified(false);
        // Stay in OTP stage and let user retry
      } else {
        setVerified(true);
        setSuccessMsg(data?.message || "Email verified successfully.");
        notify(data?.message || "Email verified successfully.", "success");
        setOtp("");
        // Move to result modal stage
        setStage('result');
      }
    } catch (err) {
      setError("Network error during verification. Please try again.");
      notify("Network error during verification. Please try again.", "error");
      setVerified(false);
      // Stay in OTP stage
    } finally {
      setVerifying(false);
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100">
      <Navbar />
      <section className="relative py-16 bg-slate-900">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-900" />
        {stage === 'form' && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 p-8 rounded-2xl bg-slate-800 shadow-2xl shadow-indigo-900/40">
          <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl" style={GRADIENT_TEXT_STYLE}>
            Employer Signup
          </h1>
          <p className="mt-2 text-center text-sm text-slate-400">
            Create your employer account to post jobs and hire faster under our PPM model.
          </p>

          {/* Error and Success Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 text-red-400 border border-red-700 rounded-xl text-sm font-medium">
              Error: {error}
            </div>
          )}
          {verified && (
            <div className="mt-4 p-3 bg-emerald-900/30 text-emerald-400 border border-emerald-700 rounded-xl text-sm font-medium">
              Success: {successMsg}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            {/* Company & Industry */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Company Name</label>
                <input
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                  onBlur={() => onBlur("companyName")}
                  placeholder="--"
                  required
                />
                {touched.companyName && !nameValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid company name.</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Industry Type</label>
                <input
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.industryType}
                  onChange={(e) => setField("industryType", e.target.value)}
                  onBlur={() => onBlur("industryType")}
                  placeholder="--"
                  required
                />
                {touched.industryType && !industryValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid industry.</p>
                )}
              </div>
            </div>
            {/* Location & Product Line */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Location</label>
                <input
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.location}
                  onChange={(e) => setField("location", e.target.value)}
                  onBlur={() => onBlur("location")}
                  placeholder="--"
                  required
                />
                {touched.location && !locationValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid location.</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Product Line</label>
                <input
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.productLine}
                  onChange={(e) => setField("productLine", e.target.value)}
                  onBlur={() => onBlur("productLine")}
                  placeholder="--"
                  required
                />
                {touched.productLine && !productLineValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid product line.</p>
                )}
              </div>
            </div>

            {/* HR Name & Mobile */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">HR Name</label>
                <input
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.hrName}
                  onChange={(e) => setField("hrName", e.target.value)}
                  onBlur={() => onBlur("hrName")}
                  placeholder="--"
                  required
                />
                {touched.hrName && !hrValid && (
                  <p className="mt-1 text-xs text-red-600">Enter HR's full name.</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Mobile Number</label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  onBlur={() => onBlur("mobile")}
                  placeholder="--"
                  required
                />
                {touched.mobile && !phoneValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid phone number.</p>
                )}
              </div>
            </div>

            {/* Email & Designation */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => onBlur("email")}
                  placeholder=""
                  required
                />
                {touched.email && !emailValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid email.</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Designation</label>
                <input
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.designation}
                  onChange={(e) => setField("designation", e.target.value)}
                  onBlur={() => onBlur("designation")}
                  placeholder=""
                  required
                />
                {touched.designation && !designationValid && (
                  <p className="mt-1 text-xs text-red-600">Enter a valid designation.</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={() => onBlur("password")}
                  placeholder=""
                  required
                />
                {touched.password && !passwordValid && (
                  <p className="mt-1 text-xs text-red-600">Password must be at least 6 characters.</p>
                )}
              </div>
              <div></div>
            </div>

            {/* Employee Strength */}
            <div>
              <label className="mb-1 block text-sm font-medium">Employee Strength</label>
              <input
                className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={values.employeeStrength}
                onChange={(e) => setField("employeeStrength", e.target.value)}
                onBlur={() => onBlur("employeeStrength")}
                placeholder=""
              />
              {touched.employeeStrength && !strengthValid && (
                <p className="mt-1 text-xs text-red-600">Enter a numeric value.</p>
              )}
            </div>

            

            {/* Submit */}
            <div className="flex items-center justify-between">
              <button
                disabled={!canSubmit || loading}
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit For Demo"}
              </button>
            </div>

          </form>
        </div>
        )}

        {stage === 'otp' && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl">
              <h2 className="text-center text-2xl font-bold text-white">Verify Your Email</h2>
              <p className="mt-1 text-center text-slate-300">
                We sent a verification code to <span className="font-semibold">{values.email}</span>
              </p>
              <form onSubmit={onVerifyOtp} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="otp" className="mb-1 block text-sm font-medium">Enter OTP</label>
                  <input
                    id="otp"
                    className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    disabled={verifying || otp.trim().length < 4}
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {verifying ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStage('form'); setOtp(""); setError(""); }}
                    className="text-sm text-slate-300 hover:text-white"
                  >
                    Change email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-800 p-6 shadow-2xl text-center">
              <h3 className={`text-lg font-semibold ${verified ? 'text-emerald-400' : 'text-red-400'}`}>
                {verified ? 'Success' : 'Error'}
              </h3>
              <p className="mt-2 text-slate-200">{successMsg || error}</p>
              <button
                type="button"
                onClick={() => {
                  if (verified) {
                    window.location.assign('/');
                  } else {
                    setStage('form');
                    setValues(initial);
                    setTouched({});
                    setOtp("");
                    setVerified(false);
                    setError("");
                    setSuccessMsg("");
                  }
                }}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                {verified ? 'Go to Home' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default EmployerSignupPage;