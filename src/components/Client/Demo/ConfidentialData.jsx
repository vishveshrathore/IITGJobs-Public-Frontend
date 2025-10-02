import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useAuth } from "../../../context/authcontext.jsx";
import Footer from "../../Public/Landing Page/Footer.jsx";

const ConfidentialData = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const user = getUser();
  const userEmail = user?.email || "";
  const [open, setOpen] = useState(false);
  const [targetPath, setTargetPath] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [globalVerified, setGlobalVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [rows, setRows] = useState([]);
  const [currentView, setCurrentView] = useState(null); // 'demo' | 'service' | null

  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/recruitment/getCompanies/all`);
        setCompanies(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        setMessage(e?.response?.data?.message || e?.message || "Failed to load companies");
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Hydrate verified flag from storage (persist until logout clears storage)
  useEffect(() => {
    if (!userEmail) { setVerified(false); return; }
    const globalKey = `public_access_verified_global:${userEmail}`;
    const globalVal = localStorage.getItem(globalKey);
    if (globalVal === '1') {
      setVerified(true);
      setGlobalVerified(true);
      setMessage('Already verified.');
      // Preselect last used company if present
      const lastKey = `public_access_last_company:${userEmail}`;
      const last = localStorage.getItem(lastKey);
      if (last) setCompanyId(last);
      return;
    }
    if (companyId) {
      const perKey = `public_access_verified:${userEmail}:${companyId}`;
      const perVal = localStorage.getItem(perKey);
      setVerified(perVal === '1');
      if (perVal === '1') setMessage('Already verified for this company.');
    } else {
      setVerified(false);
    }
  }, [userEmail, companyId]);

  const fetchData = async (view, chosenId, chosenName) => {
    try {
      setTableLoading(true);
      setTableError("");
      setRows([]);
      const base = `${BASE_URL}/api/recruitment`;
      let url = "";
      if (view === 'demo') {
        url = `${base}/parsed-profiles/top-ctc?companyId=${encodeURIComponent(chosenId)}${chosenName ? `&companyName=${encodeURIComponent(chosenName)}` : ''}`;
      } else {
        url = `${base}/parsed-profiles/all-alpha?companyId=${encodeURIComponent(chosenId)}${chosenName ? `&companyName=${encodeURIComponent(chosenName)}` : ''}`;
      }
      const resp = await fetch(url, { credentials: 'include' });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data?.success === false) {
        throw new Error(data?.message || `Request failed (${resp.status})`);
      }
      const list = Array.isArray(data?.data) ? data.data : [];
      // Normalize to required columns (+ demo 'Date' fields if present)
      const mapped = list.map((d) => ({
        name: d.name || "",
        designation: d.current_designation || d.designation || "",
        location: d.location || "",
        company: d.current_company || d.company || "",
        date1: d.date1 || "",
        date2: d.date2 || "",
        date3: d.date3 || "",
        date4: d.date4 || "",
      }));
      setRows(mapped);
    } catch (e) {
      setTableError(e?.message || "Failed to load data");
    } finally {
      setTableLoading(false);
    }
  };

  // Render helper for demo 'Date' cells
  const renderDate = (val) => {
    const s = String(val || '');
    const hasTick = s.includes('✓');
    const isRed = s.toLowerCase().includes('red');
    if (hasTick) {
      return <span className={isRed ? 'text-red-400' : 'text-emerald-400'}>✓</span>;
    }
    return null;
  };

  const proceed = (path) => {
    // determine view from path
    const view = path.includes('/client/demo') ? 'demo' : 'service';
    setCurrentView(view);
    if (verified) {
      // Use current company if chosen, else try last company
      const lastKey = `public_access_last_company:${userEmail}`;
      const chosen = companyId || localStorage.getItem(lastKey);
      if (chosen) {
        // Persist for next time and fetch table
        try { localStorage.setItem(lastKey, chosen); } catch (_) {}
        const comp = companies.find((c) => c._id === chosen);
        const cname = comp?.companyName || comp?.name || '';
        fetchData(view, chosen, cname);
        return;
      }
      // Verified but no company yet: open modal without OTP UI
      setTargetPath(path);
      setOpen(true);
      return;
    }
    // Not verified yet: open modal with OTP flow
    setTargetPath(path);
    setOpen(true);
  };

  const sendOtp = async () => {
    try {
      setSending(true);
      setMessage("");
      if (!userEmail) throw new Error("No email found in session. Please login.");
      await axios.post(`${BASE_URL}/api/recruitment/public/send-otp`, { email: userEmail, companyId });
      setMessage("Submit OTP to see demo data");
    } catch (e) {
      setMessage(e?.response?.data?.message || e?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setVerifying(true);
      setMessage("");
      if (!userEmail) throw new Error("No email found in session. Please login.");
      const { data } = await axios.post(`${BASE_URL}/api/recruitment/public/verify-otp`, { email: userEmail, companyId, otp });
      if (data?.success) {
        setVerified(true);
        setMessage("Verified! You can access the data now.");
        try {
          const key = `public_access_verified:${userEmail}:${companyId}`;
          localStorage.setItem(key, '1');
          const globalKey = `public_access_verified_global:${userEmail}`;
          localStorage.setItem(globalKey, '1');
          const lastKey = `public_access_last_company:${userEmail}`;
          localStorage.setItem(lastKey, companyId || '');
        } catch (_) {}
        if (companyId) {
          // small delay so user can see success, then fetch data and close modal
          const comp = companies.find((c) => c._id === companyId);
          const cname = comp?.companyName || comp?.name || '';
          setTimeout(() => {
            const view = (targetPath || '').includes('/client/demo') ? 'demo' : (currentView || 'service');
            setCurrentView(view);
            fetchData(view, companyId, cname);
            setOpen(false);
          }, 400);
        }
      } else {
        setMessage(data?.message || "Failed to verify OTP");
      }
    } catch (e) {
      setMessage(e?.response?.data?.message || e?.message || "Failed to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100">
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/70 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            onClick={() => navigate('/attrition-grid')}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            ← Back
          </button>
        </div>
      </div>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-white">Access Confidential Data</h1>
          <p className="mt-2 text-sm text-slate-400">Choose an option to proceed.</p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {/* Demo Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl transition hover:border-blue-500"
            >
              <button onClick={() => proceed('/client/demo')} className="flex w-full items-center gap-4 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/40 text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M2.25 13.5A2.25 2.25 0 0 1 4.5 11.25h15a2.25 2.25 0 0 1 2.25 2.25v4.125A2.625 2.625 0 0 1 19.125 20.25H4.875A2.625 2.625 0 0 1 2.25 17.625V13.5Z" />
                    <path d="M8.25 7.125C8.25 6.089 9.089 5.25 10.125 5.25h3.75c1.036 0 1.875.839 1.875 1.875V9h-7.5V7.125Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Demo</h3>
                  <p className="mt-1 text-sm text-slate-400">Report of Last 24 hours</p>
                </div>
              </button>
            </motion.div>

            {/* Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.12 }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl transition hover:border-emerald-500"
            >
              <button onClick={() => proceed('/client/service')} className="flex w-full items-center gap-4 text-left">
                <div className="flex h-12 w-15 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25Zm.75 14.25a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5ZM12 6a3.75 3.75 0 0 0-3.75 3.75.75.75 0 0 0 1.5 0A2.25 2.25 0 1 1 12 12a.75.75 0 0 0-.75.75v.375a.75.75 0 0 0 1.5 0v-.085A3.75 3.75 0 0 0 12 6Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Service</h3>
                  <p className="mt-1 text-sm text-slate-400">Report of Last one week</p>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"> {/* Darker modal overlay */}
          <div className="w-full max-w-lg rounded-lg bg-slate-800 p-6 shadow-2xl text-slate-100 border border-slate-700"> {/* Darker modal content */}
            <h2 className="text-lg font-semibold text-white">Select Company & Verify Email</h2>
            <p className="mt-1 text-xs text-slate-400">Choose your company and verify via OTP to access Demo/Service.</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs mb-1 text-slate-300">Company</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled className="bg-slate-700">{companiesLoading ? 'Loading companies…' : 'Select a company'}</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id} className="bg-slate-700">{c.companyName || c.name || 'Unnamed Company'}</option>
                  ))}
                </select>
              </div>
              {!globalVerified && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={sendOtp}
                    disabled={!companyId || !userEmail || sending}
                    className={`text-sm px-3 py-2 rounded transition-colors ${(!companyId || !userEmail || sending) ? 'bg-blue-800/60 cursor-not-allowed text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  >
                    {sending ? 'Sending…' : 'Send OTP'}
                  </button>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="flex-1 text-sm px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-200 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={!otp || !companyId || !userEmail || verifying}
                    className={`text-sm px-3 py-2 rounded transition-colors ${(!otp || !companyId || !userEmail || verifying) ? 'bg-emerald-800/60 cursor-not-allowed text-slate-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                  >
                    {verifying ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              )}
              {message && <div className="text-xs text-slate-400">{message}</div>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded border border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200">Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Results Table */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        {currentView && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-xl"> {/* Darker table container */}
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-200">{currentView === 'demo' ? '' : 'All Profiles (Service)'}</div>
              <button
                onClick={() => {
                  // refetch with current selection if any
                  const lastKey = `public_access_last_company:${userEmail}`;
                  const chosen = companyId || localStorage.getItem(lastKey);
                  const comp = companies.find((c) => c._id === chosen);
                  const cname = comp?.companyName || comp?.name || '';
                  if (chosen) fetchData(currentView, chosen, cname);
                }}
                className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
              >
                Refresh
              </button>
            </div>
            {tableError && <div className="mb-2 rounded border border-red-700 bg-red-900/30 p-2 text-sm text-red-300">{tableError}</div>}
            {tableLoading ? (
              <div className="py-6 text-sm text-slate-400">Loading…</div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-900 border-b border-slate-700"> {/* Darker table header */}
                    <tr>
                      <th className="px-4 py-3 text-gray-200">Name</th>
                      <th className="px-4 py-3 text-gray-200">Designation</th>
                      <th className="px-4 py-3 text-gray-200">Location</th>
                      <th className="px-4 py-3 text-gray-200">Company</th>
                      {(currentView === 'demo' || currentView === 'service') && (
                        <>
                          <th className="px-4 py-3 text-gray-200">Date</th>
                          <th className="px-4 py-3 text-gray-200">Date</th>
                          <th className="px-4 py-3 text-gray-200">Date</th>
                          <th className="px-4 py-3 text-gray-200">Date</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={(currentView === 'demo' || currentView === 'service') ? 8 : 4} className="px-4 py-4 text-center text-gray-500 bg-slate-800">
                          No data available.
                        </td>
                      </tr>
                    ) : (
                      rows.map((r, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-slate-700 ${
                            idx % 2 === 0 ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-900 hover:bg-slate-800"
                          } transition-colors`}
                        >
                          <td className="px-4 py-2 text-gray-300">{r.name}</td>
                          <td className="px-4 py-2 text-gray-300">{r.designation}</td>
                          <td className="px-4 py-2 text-gray-300">{r.location}</td>
                          <td className="px-4 py-2 text-gray-300">{r.company}</td>
                          {(currentView === 'demo' || currentView === 'service') && (
                            <>
                              <td className="px-4 py-2 text-gray-300">{renderDate(r.date1)}</td>
                              <td className="px-4 py-2 text-gray-300">{renderDate(r.date2)}</td>
                              <td className="px-4 py-2 text-gray-300">{renderDate(r.date3)}</td>
                              <td className="px-4 py-2 text-gray-300">{renderDate(r.date4)}</td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ConfidentialData;