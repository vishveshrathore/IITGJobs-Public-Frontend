import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Public/Landing Page/Navbar";
import Footer from "../../components/Public/Landing Page/Footer";
import { useAuth } from "../../context/authcontext.jsx";
import axios from "axios";
import { BASE_URL } from "../../config";

const tabs = [
  { key: "boolean", label: "Boolean Data Sheet" },
  { key: "first", label: "First LineUp Sheet" },
  { key: "final", label: "Final Lineup Sheet" },
  { key: "interview", label: "Interview Sheet" },
  { key: "selection", label: "Selection Sheet" },
  { key: "joining", label: "Joining Status" },
];

const Stat = ({ title, value }) => (
  <div className="rounded-lg border border-border bg-surface p-3">
    <div className="text-xs text-muted">{title}</div>
    <div className="text-base font-semibold">{value ?? "-"}</div>
  </div>
);

const Pill = ({ children }) => (
  <span className="px-2 py-0.5 text-[11px] rounded-full border border-border bg-surface-2 text-foreground/80">{children}</span>
);

const JobDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { user, getToken } = useAuth();
  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const [active, setActive] = useState("boolean");
  const [error, setError] = useState("");

  useEffect(() => {
    if (state?.job) return;
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        const token = getToken?.();
        const { data } = await axios.get(`${BASE_URL}/api/recruitment/post-job/${user.id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const list = Array.isArray(data?.data) ? data.data : [];
        const found = list.find(j => String(j?._id) === String(id));
        setJob(found || null);
        if (!found) setError("Job not found");
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [state?.job, id, user?.id, getToken]);

  const org = job?.organisation || {};
  const companyName = org.companyName || org.CompanyName || org.name || org || "-";
  const ctcUpper = useMemo(() => {
    const v = job?.ctcUpper;
    if (typeof v === "number") return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
    return v ?? "-";
  }, [job?.ctcUpper]);

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Position Details</h1>
          <p className="text-sm text-muted">Comprehensive view and actions for this position.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-900/20 px-3 py-2 text-sm text-red-300">{error}</div>
        )}

        {/* Summary Card */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border bg-surface-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-sm text-muted">{companyName}</div>
                <div className="mt-0.5 text-xl font-semibold">{job?.position || "-"}</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Pill>{job?.department || "Department"}</Pill>
                  <Pill>{job?.jobLocation || "Location"}</Pill>
                  <Pill>{job?.level || "Level"}</Pill>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[260px]">
                <Stat title="Openings" value={job?.positionsCount} />
                <Stat title="Experience" value={[job?.expFrom, job?.expTo].filter(Boolean).join(" – ") || "-"} />
                <Stat title="CTC Upper" value={ctcUpper} />
                <Stat title="Created" value={job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 pt-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${active===t.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-foreground/80 hover:bg-white/5'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab body */}
          <div className="p-4">
            {loading ? (
              <div className="text-sm text-muted">Loading…</div>
            ) : (
              <div className="rounded-xl border border-border bg-surface p-4 min-h-[40vh] text-sm">
                {active === "boolean" && (
                  <div>
                    <h3 className="font-semibold mb-2">Boolean Data Sheet</h3>
                    <p className="text-muted">Manage boolean dataset and parsed profile pipelines here.</p>
                  </div>
                )}
                {active === "first" && (
                  <div>
                    <h3 className="font-semibold mb-2">First LineUp Sheet</h3>
                    <p className="text-muted">Capture first lineup candidates and outcomes.</p>
                  </div>
                )}
                {active === "final" && (
                  <div>
                    <h3 className="font-semibold mb-2">Final Lineup Sheet</h3>
                    <p className="text-muted">Maintain final lineup readiness and approvals.</p>
                  </div>
                )}
                {active === "interview" && (
                  <div>
                    <h3 className="font-semibold mb-2">Interview Sheet</h3>
                    <p className="text-muted">Track interview details, panels and feedback.</p>
                  </div>
                )}
                {active === "selection" && (
                  <div>
                    <h3 className="font-semibold mb-2">Selection Sheet</h3>
                    <p className="text-muted">Record selected candidates, offers and remarks.</p>
                  </div>
                )}
                {active === "joining" && (
                  <div>
                    <h3 className="font-semibold mb-2">Joining Status</h3>
                    <p className="text-muted">Monitor joining progress and onboarding status.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
