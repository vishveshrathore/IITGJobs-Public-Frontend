import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Public/Landing Page/Navbar";
import Footer from "../../components/Public/Landing Page/Footer";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/authcontext.jsx";
import { toast } from "react-hot-toast";

const Recruitment = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isCorporate, isHydrating, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken?.();
      const { data } = await axios.get(`${BASE_URL}/api/recruitment/post-job/${user.id}` , {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setJobs(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || "Failed to load jobs";
      setError(msg);
      if (status === 403) toast.error(`Access denied: ${msg}`);
      else if (status === 401) toast.error(`Unauthorized: ${msg}`);
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrating) return;
    if (!isAuthenticated || !isCorporate) return;
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrating, isAuthenticated, isCorporate, user?.id]);

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Job Posts</h1>
            <p className="text-sm text-muted mt-1">All jobs posted by your employer account.</p>
          </div>
          <button
            onClick={() => fetchJobs()}
            disabled={loading}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-900/20 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-2 border-b border-border">
              <tr className="text-muted">
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Organisation</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Locations</th>
                <th className="px-4 py-3">CTC Upper</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted">Loading…</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted">No jobs found.</td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j._id} className="border-b border-border hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{j.position || "-"}</td>
                    <td className="px-4 py-3">{j.organisation?.companyName || j.organisation?.CompanyName || j.organisation || "-"}</td>
                    <td className="px-4 py-3">{j.level || "-"}</td>
                    <td className="px-4 py-3">{j.jobLocation || "-"}</td>
                    <td className="px-4 py-3">{j.ctcUpper ?? "-"}</td>
                    <td className="px-4 py-3">{j.createdAt ? new Date(j.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-primary text-xs px-2 py-1"
                          onClick={() => navigate(`/recruitment/job/${j._id}`, { state: { job: j } })}
                        >
                          View
                        </button>
                        <button className="btn btn-secondary text-xs px-2 py-1" disabled>Edit</button>
                        <button className="btn btn-outline text-xs px-2 py-1" disabled>Close</button>
                        <button className="btn btn-outline text-xs px-2 py-1" disabled>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recruitment;
