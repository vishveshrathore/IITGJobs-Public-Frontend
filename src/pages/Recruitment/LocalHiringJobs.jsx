import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Public/Landing Page/Navbar";
import Footer from "../../components/Public/Landing Page/Footer";
import { BASE_URL } from "../../config";

const buildLocalHiringShareMailto = (position) => {
  if (!position) return "mailto:";

  const title = position.name || "Local hiring role";
  const locationSuffix = position.location ? ` - ${position.location}` : "";
  const subject = `Job opportunity: ${title}${locationSuffix}`;

  const lines = [
    "Dear Candidate,",
    "",
    "I am sharing details of a current local hiring opportunity published via IITG Jobs.",
    "",
    `Position: ${position.name || "-"}`,
    position.location ? `Location: ${position.location}` : null,
    position.requiredExp ? `Experience Required: ${position.requiredExp}` : null,
    position.ctcRange ? `Compensation Range: ${position.ctcRange}` : null,
    position.requiredKeySkills ? `Key Skills: ${position.requiredKeySkills}` : null,
    "",
    position.jdText ? "Job Description (summary):" : null,
    position.jdText ? position.jdText : null,
    position.jdFileUrl ? "" : null,
    position.jdFileUrl ? `Full Job Description (link): ${position.jdFileUrl}` : null,
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

const LocalHiringJobs = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applyPositionId, setApplyPositionId] = useState(null);
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccessId, setApplySuccessId] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    mobile: "",
    experience: "",
    currentCompany: "",
    currentLocation: "",
    designation: "",
    ctc: "",
    skills: "",
  });
  const [applyResume, setApplyResume] = useState(null);

  const fetchPositions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${BASE_URL}/api/local-hiring/public/positions`);
      const items = Array.isArray(data?.data) ? data.data : [];
      setPositions(items);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load positions";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const openApply = (id) => {
    setApplyPositionId(id);
    setApplyError("");
    setApplySuccessId(null);
    setApplyModalOpen(true);
  };

  const closeApply = () => {
    setApplyModalOpen(false);
    setApplyPositionId(null);
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

  const onApplySubmit = async (e, positionId) => {
    e.preventDefault();
    setApplySubmitting(true);
    setApplyError("");
    setApplySuccessId(null);
    try {
      const fd = new FormData();
      fd.append("name", applyForm.name);
      fd.append("email", applyForm.email);
      fd.append("mobile", applyForm.mobile);
      fd.append("experience", applyForm.experience);
      fd.append("currentCompany", applyForm.currentCompany);
      fd.append("currentLocation", applyForm.currentLocation);
      fd.append("designation", applyForm.designation);
      fd.append("ctc", applyForm.ctc);
      fd.append("skills", applyForm.skills);
      if (applyResume) {
        fd.append("resume", applyResume);
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/local-hiring/public/positions/${positionId}/apply`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        setApplySuccessId(positionId);
        setApplyForm({
          name: "",
          email: "",
          mobile: "",
          experience: "",
          currentCompany: "",
          currentLocation: "",
          designation: "",
          ctc: "",
          skills: "",
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

  const activePosition = positions.find(
    (p) => String(p._id || "") === String(applyPositionId || "")
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Careers</h1>
            <p className="text-sm text-muted mt-1">
              Explore active local hiring roles published by IITG Jobs and apply directly.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchPositions}
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
          <div className="py-10 text-center text-sm text-muted">Loading positions…</div>
        ) : positions.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">No active local hiring positions found.</div>
        ) : (
          <div className="space-y-4">
            {positions.map((p) => {
              const id = String(p._id || "");
              return (
                <div
                  key={id}
                  className="rounded-2xl border border-border bg-surface shadow-sm p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold break-words">
                        {p.name || "Position"}
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium">
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-muted">
                      {p.location && <span>{p.location}</span>}
                      {p.requiredExp && <span className="ml-1">· Exp: {p.requiredExp}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted mt-1">
                      {p.ctcRange && (
                        <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                          CTC: {p.ctcRange}
                        </span>
                      )}
                      {p.requiredKeySkills && (
                        <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
                          Skills: {p.requiredKeySkills}
                        </span>
                      )}
                    </div>
                    {p.jdText && (
                      <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap line-clamp-4">
                        {p.jdText}
                      </p>
                    )}
                    {p.jdFileUrl && (
                      <div className="mt-2 text-xs">
                        <a
                          href={p.jdFileUrl}
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
                    <button
                      type="button"
                      onClick={() => openApply(id)}
                      className="btn btn-primary text-sm"
                    >
                      Apply Now
                    </button>
                    <a
                      href={buildLocalHiringShareMailto(p)}
                      className="btn btn-secondary text-sm"
                    >
                      Share via Email
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {applyModalOpen && applyPositionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeApply();
          }}
        >
          <div className="max-w-lg w-full rounded-2xl bg-surface shadow-xl border border-border">
            <div className="flex items-start justify-between px-4 py-3 border-b border-border">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Apply for</p>
                <h2 className="text-base sm:text-lg font-semibold">
                  {activePosition?.name || "Local Hiring Role"}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {activePosition?.location}
                  {activePosition?.requiredExp && (
                    <>
                      {" "}
                      · Exp: {activePosition.requiredExp}
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
              onSubmit={(e) => onApplySubmit(e, applyPositionId)}
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
                    name="currentLocation"
                    value={applyForm.currentLocation}
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
                  <label className="block mb-1">Current Company</label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={applyForm.currentCompany}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">Current Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={applyForm.designation}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., Senior Sales Executive"
                  />
                </div>
                <div>
                  <label className="block mb-1">Current CTC (optional)</label>
                  <input
                    type="text"
                    name="ctc"
                    value={applyForm.ctc}
                    onChange={onApplyChange}
                    className="input w-full text-xs"
                    placeholder="e.g., 5 LPA"
                  />
                </div>
                <div className="sm:col-span-2">
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
              {applySuccessId === applyPositionId && !applyError && (
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

export default LocalHiringJobs;
