import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Public/Landing Page/Navbar";
import Footer from "../../components/Public/Landing Page/Footer";
import { useAuth } from "../../context/authcontext.jsx";
import axios from "axios";
import { BASE_URL } from "../../config";
import EmployerStageSheet from "./EmployerStageSheet";

const tabs = [
  { key: "boolean", label: "Boolean Data Sheet (C)" },
  { key: "first", label: "First LineUp Sheet" },
  { key: "final", label: "Final Lineup Sheet" },
  { key: "interview", label: "Interview Sheet" },
  { key: "selection", label: "Selection Sheet" },
  { key: "joining", label: "Joining Status" },
];

const Stat = ({ title, value }) => (
  <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-white/7 via-transparent to-white/5 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
    <div className="text-[11px] uppercase tracking-[0.2em] text-muted">{title}</div>
    <div className="mt-1 text-xl font-semibold text-foreground">{value ?? "-"}</div>
    <div className="pointer-events-none absolute inset-px rounded-2xl border border-white/5" />
  </div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-full border border-white/10 bg-white/5 text-foreground/80 backdrop-blur">
    {children}
  </span>
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
      setLoading(true);
      setError("");
      try {
        const token = getToken?.();
        const { data } = await axios.get(`${BASE_URL}/api/recruitment/post-job/by-id/${id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setJob(data?.data || null);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [state?.job, id, user?.id, getToken]);

  const org = job?.organisation || {};
  const companyName = (() => {
    // Prefer backend-computed organisationName when present
    if (job?.organisationName) return job.organisationName;

    const orgVal = job?.organisation;
    if (orgVal === "__other__") return job?.organisationOther || "-";
    if (orgVal && typeof orgVal === "object") {
      return orgVal.companyName || orgVal.CompanyName || orgVal.name || "-";
    }
    if (typeof orgVal === "string") {
      // If the string looks like an ObjectId, fall back to organisationOther or '-'
      if (/^[0-9a-fA-F]{24}$/.test(orgVal)) {
        return job?.organisationOther || "-";
      }
      return orgVal.trim() || "-";
    }
    return "-";
  })();

  const locationDisplay = useMemo(() => {
    if (job?.jobState && job?.jobCity) {
      const city = job.jobCity === "__other__" ? job.jobCityOther || "" : job.jobCity;
      return city ? `${city}, ${job.jobState}` : job.jobState;
    }
    return job?.jobLocation || "-";
  }, [job]);

  const ctcUpper = useMemo(() => {
    const v = job?.ctcUpper;
    const num = typeof v === "string" ? Number(v.replace(/[^\d]/g, "")) : v;
    if (!isNaN(num) && num > 0) {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
    }
    return v ?? "-";
  }, [job?.ctcUpper]);

  const stageKeyForTab = (key) => {
    switch (key) {
      case "boolean":
        return "BooleanDataSheet(C)";
      case "first":
        return "FirstLineup";
      case "final":
        return "FinalLineup";
      case "interview":
        return "InterviewSheet";
      case "selection":
        return "Selection";
      case "joining":
        return "JoiningStatus";
      default:
        return "BooleanDataSheet";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Position Details</h1>
          <p className="text-sm text-muted">Comprehensive view and actions for this position.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-900/20 px-3 py-2 text-sm text-red-300">{error}</div>
        )}

        {/* Summary Card */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden w-full">
          <div className="p-5 border-b border-border bg-surface-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-sm text-muted">{companyName}</div>
                <div className="mt-0.5 text-xl font-semibold">{job?.position || "-"}</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Pill>{job?.department || "Department"}</Pill>
                  <Pill>{locationDisplay}</Pill>
                  <Pill>{job?.level || "Level"}</Pill>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[260px]">
                  <Stat title="Openings" value={job?.positionsCount} />
                  <Stat title="Experience" value={[job?.expFrom, job?.expTo].filter(Boolean).join(" – ") || "-"} />
                  <Stat title="CTC Upper" value={ctcUpper} />
                  <Stat title="Created" value={job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"} />
                </div>
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
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active === t.key
                      ? 'bg-brand-600 text-white border-brand-500'
                      : 'bg-surface border-border text-foreground/80 hover:bg-white/5'
                  }`}
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
                <EmployerStageSheet
                  job={job}
                  stageKey={stageKeyForTab(active)}
                  title={tabs.find((t) => t.key === active)?.label || "Stage"}
                />
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
