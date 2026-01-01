import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../../components/Public/Landing Page/Navbar";
import Footer from "../../components/Public/Landing Page/Footer";
import { BASE_URL } from "../../config";

const JobOpenings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applyJobId, setApplyJobId] = useState(null);
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccessJobId, setApplySuccessJobId] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    experience: "",
    current_designation: "",
    current_company: "",
    skills: "",
    previous_roles: "",
    education: "",
    ctc: "",
    expected_ctc: "",
  });
  const [applyResume, setApplyResume] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${BASE_URL}/api/recruitment/public/job-openings`);
      setJobs(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load job openings";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatCTC = (value) => {
    const v = value;
    const num = typeof v === "string" ? Number(v.replace(/[^\d]/g, "")) : v;
    if (!isNaN(num) && num > 0) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(num);
    }
    return v ?? "-";
  };

  const getLocationDisplay = (job) => {
    if (job?.jobState && job?.jobCity) {
      const city = job.jobCity === "__other__" ? job.jobCityOther || "" : job.jobCity;
      return city ? `${city}, ${job.jobState}` : job.jobState;
    }
    return job?.jobLocation || "-";
  };

  const buildJobOpeningShareMailto = (job) => {
    if (!job) return "mailto:";

    const title = job.position || "Job opening";
    const orgPart = job.organisationName ? ` at ${job.organisationName}` : "";
    const loc = getLocationDisplay(job);
    const locSuffix = loc && loc !== "-" ? ` - ${loc}` : "";
    const subject = `Job opportunity: ${title}${orgPart}${locSuffix}`;

    const experienceRange = (job.expFrom || job.expTo)
      ? [job.expFrom, job.expTo].filter(Boolean).join(" – ")
      : null;

    const lines = [
      "Dear Candidate,",
      "",
      "I am sharing details of a current job opening published via IITG Jobs.",
      "",
      `Position: ${job.position || "-"}`,
      job.organisationName ? `Organisation: ${job.organisationName}` : null,
      loc && loc !== "-" ? `Location: ${loc}` : null,
      experienceRange ? `Experience Required: ${experienceRange} years` : null,
      job.level ? `Level: ${job.level}` : null,
      job.jobType ? `Type: ${job.jobType}` : null,
      job.department ? `Department: ${job.department}` : null,
      job.positionsCount != null ? `Openings: ${job.positionsCount}` : null,
      job.ctcUpper != null ? `CTC (upper range): ${formatCTC(job.ctcUpper)}` : null,
      "",
      job.jobDescription ? "Job Description (summary):" : null,
      job.jobDescription ? job.jobDescription : null,
      job.jobDescriptionFileUrl ? "" : null,
      job.jobDescriptionFileUrl ? `Full Job Description (link): ${job.jobDescriptionFileUrl}` : null,
      "",
      job.createdAt ? `Posted on: ${new Date(job.createdAt).toLocaleDateString()}` : null,
      "",
      "You can apply for this role directly through IITG Jobs.",
      "",
      "Best regards,",
      "IITG Jobs Recruitment Team",
    ]
      .filter(Boolean)
      .join("\n");

    const base = "https://mail.google.com/mail/?view=cm&fs=1";
    return `${base}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
  };

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [jobs]
  );

  const openApply = (jobId) => {
    setApplyJobId(jobId);
    setApplyError("");
    setApplySuccessJobId(null);
    setApplyModalOpen(true);
  };

  const closeApply = () => {
    setApplyModalOpen(false);
    setApplyJobId(null);
    setApplyError("");
  };

  const onApplyChange = (e) => {
    const { name, value } = e.target;
    setApplyForm((p) => ({ ...p, [name]: value }));
  };

  const onResumeChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setApplyResume(file);
  };

  const onApplySubmit = async (e, jobId) => {
    e.preventDefault();
    setApplySubmitting(true);
    setApplyError("");
    setApplySuccessJobId(null);
    try {
      const fd = new FormData();
      fd.append('name', applyForm.name);
      fd.append('email', applyForm.email);
      fd.append('mobile', applyForm.mobile);
      fd.append('location', applyForm.location);
      fd.append('experience', applyForm.experience);
      fd.append('current_designation', applyForm.current_designation);
      fd.append('current_company', applyForm.current_company);
      fd.append('skills', applyForm.skills);
      fd.append('previous_roles', applyForm.previous_roles);
      fd.append('education', applyForm.education);
      fd.append('ctc', applyForm.ctc);
      fd.append('expected_ctc', applyForm.expected_ctc);
      if (applyResume) {
        fd.append('resume', applyResume);
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/recruitment/public/job-openings/${jobId}/apply`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (data?.success) {
        setApplySuccessJobId(jobId);
        setApplyForm({
          name: "",
          email: "",
          mobile: "",
          location: "",
          experience: "",
          current_designation: "",
          current_company: "",
          skills: "",
          previous_roles: "",
          education: "",
          ctc: "",
          expected_ctc: "",
        });
        setApplyResume(null);
      }
    } catch (e2) {
      const msg = e2?.response?.data?.message || e2?.message || "Failed to submit application";
      setApplyError(msg);
    } finally {
      setApplySubmitting(false);
    }
  };

  const activeJob = sortedJobs.find((job) => String(job._id || "") === String(applyJobId || ""));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Job Openings</h1>
            <p className="text-sm text-muted mt-1">
              Explore active positions you can apply for through IITG Jobs.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchJobs}
            disabled={loading}
            className="btn btn-secondary text-sm"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-900/20 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-sm text-muted">Loading job openings…</div>
        ) : sortedJobs.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">No active job openings found.</div>
        ) : (
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-border bg-surface shadow-sm p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold break-words">
                      {job.position || "Position"}
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium">
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-muted">
                    <span className="font-medium">{job.organisationName || "Organisation"}</span>
                    {getLocationDisplay(job) && (
                      <span className="ml-1">· {getLocationDisplay(job)}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted mt-1">
                    {job.level && (
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                        Level: {job.level}
                      </span>
                    )}
                    {job.jobType && (
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                        Type: {job.jobType}
                      </span>
                    )}
                    {job.positionsCount != null && (
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                        Openings: {job.positionsCount}
                      </span>
                    )}
                    {job.department && (
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                        Department: {job.department}
                      </span>
                    )}
                    {(job.expFrom || job.expTo) && (
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                        Experience: {[job.expFrom, job.expTo].filter(Boolean).join(" – ")} yrs
                      </span>
                    )}
                    {job.ctcUpper != null && (
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                        CTC Upper: {formatCTC(job.ctcUpper)}
                      </span>
                    )}
                  </div>
                  {job.jobDescription && (
                    <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap line-clamp-4">
                      {job.jobDescription}
                    </p>
                  )}
                  {job.jobDescriptionFileUrl && (
                    <div className="mt-2 text-xs">
                      <a
                        href={job.jobDescriptionFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-300 hover:underline"
                      >
                        View Attached JD File
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-stretch justify-between min-w-[220px] gap-2">
                  <div className="text-xs text-muted text-right md:text-left">
                    {job.createdAt && (
                      <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openApply(job._id)}
                    className="btn btn-primary text-sm"
                  >
                    Apply Now
                  </button>
                  <a
                    href={buildJobOpeningShareMailto(job)}
                    className="btn btn-secondary text-sm"
                  >
                    Share via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {applyModalOpen && applyJobId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeApply();
          }}
        >
          <div className="max-w-2xl w-full rounded-2xl bg-surface shadow-xl border border-border">
            <div className="flex items-start justify-between px-4 py-3 border-b border-border">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Apply for</p>
                <h2 className="text-base sm:text-lg font-semibold">
                  {activeJob?.position || "Job Opening"}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {activeJob?.organisationName}
                  {getLocationDisplay(activeJob) && (
                    <>
                      {" "}
                      · {getLocationDisplay(activeJob)}
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={closeApply}
                className="text-xs text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form
              className="px-4 pt-3 pb-4 space-y-3 text-xs"
              onSubmit={(e) => onApplySubmit(e, applyJobId)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Full Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={applyForm.name}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={applyForm.email}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Mobile*</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={applyForm.mobile}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Current Location</label>
                  <input
                    type="text"
                    name="location"
                    value={applyForm.location}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">Total Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={applyForm.experience}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., 3 years"
                  />
                </div>
                <div>
                  <label className="block mb-1">Current Designation</label>
                  <input
                    type="text"
                    name="current_designation"
                    value={applyForm.current_designation}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">Current Company</label>
                  <input
                    type="text"
                    name="current_company"
                    value={applyForm.current_company}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">Key Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={applyForm.skills}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., Sales, Excel, Communication"
                  />
                </div>
                <div>
                  <label className="block mb-1">Previous Roles</label>
                  <input
                    type="text"
                    name="previous_roles"
                    value={applyForm.previous_roles}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., Sales Executive at ABC, Team Lead at XYZ"
                  />
                </div>
                <div>
                  <label className="block mb-1">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={applyForm.education}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., B.Com, MBA"
                  />
                </div>
                <div>
                  <label className="block mb-1">Current CTC</label>
                  <input
                    type="text"
                    name="ctc"
                    value={applyForm.ctc}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., 450000"
                  />
                </div>
                <div>
                  <label className="block mb-1">Expected CTC</label>
                  <input
                    type="text"
                    name="expected_ctc"
                    value={applyForm.expected_ctc}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., 550000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1">Resume (PDF / DOC / DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={onResumeChange}
                    className="input w-full text-xs"
                  />
                </div>
              </div>
              {applyError && (
                <div className="text-red-400 text-[11px]">{applyError}</div>
              )}
              {applySuccessJobId === applyJobId && !applyError && (
                <div className="text-emerald-400 text-[11px]">
                  Application submitted successfully.
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeApply}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applySubmitting}
                  className="btn btn-primary text-xs"
                >
                  {applySubmitting ? "Submitting…" : "Submit Application"}
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

export default JobOpenings;
