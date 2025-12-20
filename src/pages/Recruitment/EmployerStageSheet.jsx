import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/authcontext.jsx";

const getColumnText = (p, key) => {
  if (!p) return "";
  switch (key) {
    case "name":
      return p?.name || "";
    case "experience":
      return p?.experience || "";
    case "ctc":
      return p?.ctc || "";
    case "location":
      return p?.location || "";
    case "current_designation":
      return p?.current_designation || "";
    case "current_company":
      return p?.current_company || "";
    default:
      return "";
  }
};

const ColumnFilterHeader = ({
  label,
  columnKey,
  profiles,
  columnFilters,
  setColumnFilters,
  activeFilter,
  setActiveFilter,
  activeFilterSelection,
  setActiveFilterSelection,
}) => {
  const containerRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0 });
  const open = activeFilter.column === columnKey;
  const DROPDOWN_WIDTH = 260;
  const ESTIMATED_HEIGHT = 300;

  const allValues = React.useMemo(() => {
    const set = new Set();
    (profiles || []).forEach((p) => {
      const v = String(getColumnText(p, columnKey) || "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [profiles, columnKey]);

  const applied = columnFilters[columnKey] || [];
  const search = open ? activeFilter.search || "" : "";
  const lcSearch = search.toLowerCase();
  const filteredValues = lcSearch
    ? allValues.filter((v) => v.toLowerCase().includes(lcSearch))
    : allValues;

  const close = () => {
    setActiveFilter({ column: null, search: "" });
    setActiveFilterSelection([]);
  };

  const updateDropdownPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let top = rect.bottom + 6;
    if (rect.bottom + ESTIMATED_HEIGHT + 20 > window.innerHeight) {
      top = rect.top - ESTIMATED_HEIGHT - 6;
    }
    if (top < 8) top = 8;
    let left = rect.left + rect.width - DROPDOWN_WIDTH;
    if (left < 8) left = 8;
    if (left + DROPDOWN_WIDTH > window.innerWidth - 8) {
      left = window.innerWidth - DROPDOWN_WIDTH - 8;
    }
    setDropdownPos({ top, left });
  };

  const openFilter = () => {
    setActiveFilter({ column: columnKey, search: "" });
    if (applied && applied.length) {
      setActiveFilterSelection(applied);
    } else {
      setActiveFilterSelection(allValues);
    }
    setTimeout(updateDropdownPosition, 0);
  };

  const toggleValue = (value) => {
    setActiveFilterSelection((prev) => {
      const exists = prev.includes(value);
      if (exists) return prev.filter((v) => v !== value);
      return [...prev, value];
    });
  };

  const selectAll = () => {
    setActiveFilterSelection(filteredValues);
  };

  const clearSelection = () => {
    setActiveFilterSelection([]);
  };

  const applyFilter = () => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      const allSelected =
        Array.isArray(activeFilterSelection) &&
        activeFilterSelection.length > 0 &&
        activeFilterSelection.length === allValues.length;
      if (!activeFilterSelection || activeFilterSelection.length === 0 || allSelected) {
        delete next[columnKey];
      } else {
        next[columnKey] = activeFilterSelection.slice();
      }
      return next;
    });
    close();
  };

  const clearFilterCompletely = () => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[columnKey];
      return next;
    });
    close();
  };

  const hasActiveFilter = Array.isArray(applied) && applied.length > 0;

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      const containerEl = containerRef.current;
      const panelEl = panelRef.current;
      if (containerEl && containerEl.contains(e.target)) return;
      if (panelEl && panelEl.contains(e.target)) return;
      close();
    };
    const handleWindowChange = () => {
      updateDropdownPosition();
    };
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    updateDropdownPosition();
  }, [open, profiles, columnFilters]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-1">
      <span>{label}</span>
      <button
        type="button"
        onClick={open ? close : openFilter}
        className={`inline-flex h-5 w-5 items-center justify-center rounded border text-[10px] transition ${
          hasActiveFilter
            ? "bg-primary/20 text-primary border-primary/40 hover:bg-primary/30"
            : "bg-background text-muted border-border hover:bg-surface"
        }`}
        title="Filter column values"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3">
          <path fill="currentColor" d="M3 4h18v2l-7 7v5l-4 2v-7L3 6V4z" />
        </svg>
      </button>
      {hasActiveFilter && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      )}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: DROPDOWN_WIDTH,
              zIndex: 9999,
            }}
            className="rounded-2xl border border-border bg-surface-2 backdrop-blur-md p-2.5 text-xs shadow-[0_22px_55px_rgba(0,0,0,0.9)]"
          >
            <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-muted">
              <span className="uppercase tracking-[0.22em] text-[10px] text-muted">
                {label}
              </span>
              {hasActiveFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                  Filtered
                </span>
              )}
            </div>
            <div className="mb-2 flex items-center gap-1">
              <input
                type="text"
                value={open ? activeFilter.search || "" : ""}
                onChange={(e) =>
                  setActiveFilter({ column: columnKey, search: e.target.value })
                }
                placeholder="Search values"
                className="w-full rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted focus:outline-none"
              />
            </div>
            <div className="max-h-52 overflow-y-auto border-y border-white/10 py-1.5 pr-1">
              {filteredValues.length === 0 ? (
                <div className="px-1 py-1 text-muted">No values</div>
              ) : (
                filteredValues.map((v) => {
                  const checked = activeFilterSelection.includes(v);
                  return (
                    <label
                      key={v}
                      className="flex cursor-pointer items-center gap-2 px-1.5 py-1 hover:bg-white/5 rounded-md"
                    >
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-border text-primary"
                        checked={checked}
                        onChange={() => toggleValue(v)}
                      />
                      <span className="truncate" title={v}>
                        {v}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded-lg border border-border px-2.5 py-0.5 text-[11px] text-foreground hover:bg-surface-2"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="rounded-lg border border-border px-2.5 py-0.5 text-[11px] text-foreground hover:bg-surface-2"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-1">
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={clearFilterCompletely}
                    className="rounded-lg border border-destructive/60 px-2.5 py-0.5 text-[11px] text-destructive hover:bg-destructive/15"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={applyFilter}
                  className="rounded-lg border border-primary bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>,
          typeof document !== "undefined" ? document.body : undefined
        )}
    </div>
  );
};

const EmployerStageSheet = ({ job, stageKey, title }) => {
  const { getToken } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [density, setDensity] = useState("compact");
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState({ column: null, search: "" });
  const [activeFilterSelection, setActiveFilterSelection] = useState([]);
  const [selectedMap, setSelectedMap] = useState({});
  const [bulkSaving, setBulkSaving] = useState(false);
  const [remarkById, setRemarkById] = useState({});
  const [savingId, setSavingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [expandSkills, setExpandSkills] = useState({});

  const companyName = useMemo(() => {
    if (!job) return "-";
    if (job.organisationName) return job.organisationName;
    const orgVal = job.organisation;
    if (orgVal === "__other__") return job?.organisationOther || "-";
    if (orgVal && typeof orgVal === "object") {
      return orgVal.companyName || orgVal.CompanyName || orgVal.name || "-";
    }
    if (typeof orgVal === "string") {
      return orgVal.trim() || "-";
    }
    return job?.organisationOther || "-";
  }, [job]);

  const locationDisplay = useMemo(() => {
    if (!job) return "-";
    const city = job.jobCity === "__other__" ? job.jobCityOther : job.jobCity;
    if (city && job.jobState) return `${city}, ${job.jobState}`;
    return job.jobLocation || job.jobState || job.jobCity || "-";
  }, [job]);

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput), 300);
    return () => clearTimeout(t);
  }, [qInput]);

  const loadProfiles = async () => {
    if (!job?._id || !stageKey) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken?.();
      const { data } = await axios.get(`${BASE_URL}/api/recruitment/post-job-profiles/${job._id}`, {
        params: { stage: stageKey },
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const list = Array.isArray(data?.data) ? data.data : [];
      setProfiles(list);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [job?._id, stageKey]);

  const refresh = () => loadProfiles();

  const displayedProfiles = useMemo(() => {
    let list = profiles;
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((p) => [p?.name, p?.email, p?.mobile].filter(Boolean).join(" ").toLowerCase().includes(needle));
    }
    const loc = filterLocation.trim().toLowerCase();
    if (loc) {
      list = list.filter((p) => String(p?.location || "").toLowerCase().includes(loc));
    }
    const skill = filterSkill.trim().toLowerCase();
    if (skill) {
      list = list.filter((p) => {
        const s = Array.isArray(p?.skills) ? p.skills.join(" ") : String(p?.skills || "");
        return s.toLowerCase().includes(skill);
      });
    }
    const hasColumnFilters =
      columnFilters &&
      Object.values(columnFilters).some((arr) => Array.isArray(arr) && arr.length > 0);
    if (hasColumnFilters) {
      list = list.filter((p) => {
        for (const [col, selectedVals] of Object.entries(columnFilters)) {
          if (!Array.isArray(selectedVals) || selectedVals.length === 0) continue;
          const v = String(getColumnText(p, col) || "");
          if (!selectedVals.includes(v)) return false;
        }
        return true;
      });
    }
    return list;
  }, [profiles, q, filterLocation, filterSkill, columnFilters]);

  const selectedIds = useMemo(() => Object.keys(selectedMap).filter((k) => selectedMap[k]), [selectedMap]);
  const allShownSelected = useMemo(
    () => displayedProfiles.length > 0 && displayedProfiles.every((p) => selectedMap[p._id]),
    [displayedProfiles, selectedMap]
  );

  const toggleSelect = (id, val) => {
    setSelectedMap((prev) => ({ ...prev, [id]: val ?? !prev[id] }));
  };

  const selectAllShown = (val) => {
    const next = { ...selectedMap };
    displayedProfiles.forEach((p) => {
      next[p._id] = !!val;
    });
    setSelectedMap(next);
  };

  const clearSelection = () => setSelectedMap({});

  const highlight = (text, needle) => {
    const str = String(text || "");
    const n = String(needle || "").trim();
    if (!n) return str;
    const lc = str.toLowerCase();
    const ln = n.toLowerCase();
    const parts = [];
    let idx = 0;
    while (true) {
      const i = lc.indexOf(ln, idx);
      if (i === -1) {
        parts.push(str.slice(idx));
        break;
      }
      if (i > idx) parts.push(str.slice(idx, i));
      parts.push(
        <mark key={i} className="bg-yellow-200 text-foreground rounded px-0.5">
          {str.slice(i, i + n.length)}
        </mark>
      );
      idx = i + n.length;
    }
    return <span>{parts}</span>;
  };

  const renderChips = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return "-";
    return (
      <div className="flex flex-wrap gap-1">
        {arr.map((it, i) => {
          let label;
          if (it && typeof it === "object") {
            const degree = it.degree || it.qualification || it.course || "";
            const inst = it.institution || it.college || it.university || it.school || "";
            const year = it.year || it.passingYear || it.passedOut || "";
            if (degree || inst || year) {
              const main = [degree, inst && inst ? (degree ? ` at ${inst}` : inst) : ""].join("").trim();
              label = year ? `${main} (${year})`.trim() : main || JSON.stringify(it);
            } else {
              label = it.designation || it.company || it.name || JSON.stringify(it);
            }
          } else {
            label = String(it);
          }
          return (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[10px] border bg-surface-2 text-foreground/80 border-border"
              title={label}
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  const renderMixed = (v) => {
    if (v == null) return "";
    if (Array.isArray(v)) {
      const isRoleArray = v.every(
        (item) => item && typeof item === "object" && ("designation" in item || "company" in item)
      );
      if (isRoleArray) {
        return v
          .map((item) => `${item.designation || ""}${item.company ? " at " + item.company : ""}`.trim())
          .filter(Boolean)
          .join(" | ");
      }
      return v
        .map((item) => {
          if (item && typeof item === "object") {
            const degree = item.degree || item.qualification || item.course || "";
            const inst = item.institution || item.college || item.university || item.school || "";
            const year = item.year || item.passingYear || item.passedOut || "";
            if (degree || inst || year) {
              const main = [degree, inst && inst ? (degree ? ` at ${inst}` : inst) : ""].join("").trim();
              return year ? `${main} (${year})`.trim() : main || JSON.stringify(item);
            }
            if (item.designation || item.company) {
              return `${item.designation || ""}${item.company ? " at " + item.company : ""}`.trim();
            }
            return JSON.stringify(item);
          }
          return String(item);
        })
        .join(" | ");
    }
    if (typeof v === "object") {
      const degree = v.degree || v.qualification || v.course || "";
      const inst = v.institution || v.college || v.university || v.school || "";
      const year = v.year || v.passingYear || v.passedOut || "";
      if (degree || inst || year) {
        const main = [degree, inst && inst ? (degree ? ` at ${inst}` : inst) : ""].join("").trim();
        return year ? `${main} (${year})`.trim() : main || JSON.stringify(v);
      }
      if ("designation" in v || "company" in v) {
        return `${v.designation || ""}${v.company ? " at " + v.company : ""}`.trim();
      }
      return JSON.stringify(v);
    }
    return String(v);
  };

  const renderExperience = (v) => {
    if (!v) return "-";
    if (Array.isArray(v)) {
      return renderChips(v);
    }
    const s = String(v || "").trim();
    if (!s) return "-";
    const parts = s.split("|").map((part) => part.trim()).filter(Boolean);
    if (parts.length <= 1) return s;
    return renderChips(parts);
  };

  const getFileExt = (url) => {
    try {
      const u = new URL(url);
      const p = u.pathname;
      const ix = p.lastIndexOf(".");
      return ix >= 0 ? p.slice(ix + 1).toUpperCase() : "";
    } catch {
      const ix = String(url || "").lastIndexOf(".");
      return ix >= 0 ? String(url).slice(ix + 1).toUpperCase() : "";
    }
  };

  const getResumeViewUrl = (url) => {
    if (!url) return "#";
    try {
      const u = new URL(url);
      const path = u.pathname.toLowerCase();
      if (path.endsWith(".pdf")) return url;
      if (path.endsWith(".doc") || path.endsWith(".docx")) {
        return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
      }
      return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
    } catch {
      return url;
    }
  };

  const submitDecision = async (profileId, decision) => {
    if (!profileId) return;
    try {
      setSavingId(profileId);
      const token = getToken?.();
      const payload = {
        profileId,
        decision,
        remark: remarkById[profileId] || "",
      };
      await axios.post(`${BASE_URL}/api/recruitment/post-job-profiles/decision`, payload, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      await refresh();
      setToast({
        visible: true,
        message: decision === "YES" ? "Profile moved to next stage" : "Decision saved",
        type: "success",
      });
      setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 2000);
    } catch (e) {
      setToast({
        visible: true,
        message: e?.response?.data?.message || e?.message || "Failed to save decision",
        type: "error",
      });
      setTimeout(() => setToast({ visible: false, message: "", type: "error" }), 2500);
    } finally {
      setSavingId("");
    }
  };

  const bulkMoveSelected = async () => {
    if (selectedIds.length === 0) {
      setToast({ visible: true, message: "No profiles selected", type: "error" });
      setTimeout(() => setToast({ visible: false, message: "", type: "error" }), 2000);
      return;
    }
    try {
      setBulkSaving(true);
      let ok = 0,
        skipped = 0,
        fail = 0;
      for (const id of selectedIds) {
        const row = profiles.find((p) => String(p._id) === String(id));
        if (!row) {
          skipped++;
          continue;
        }
        try {
          const token = getToken?.();
          const payload = {
            profileId: id,
            decision: "YES",
            remark: remarkById[id] || "",
          };
          await axios.post(`${BASE_URL}/api/recruitment/post-job-profiles/decision`, payload, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          ok++;
        } catch (_) {
          fail++;
        }
      }
      await refresh();
      clearSelection();
      setToast({
        visible: true,
        message: `Moved: ${ok} · Skipped: ${skipped} · Failed: ${fail}`,
        type: fail ? "error" : "success",
      });
      setTimeout(() => setToast({ visible: false, message: "", type: fail ? "error" : "success" }), 2500);
    } finally {
      setBulkSaving(false);
    }
  };

  const toggleSkills = (id) => setExpandSkills((prev) => ({ ...prev, [id]: !prev[id] }));

  const deleteResume = async (profileId) => {
    if (!profileId) return;
    if (typeof window !== "undefined") {
      // Basic confirmation in browser
      // eslint-disable-next-line no-alert
      if (!window.confirm("Delete resume from Cloudinary for this candidate?")) return;
    }
    try {
      setDeletingId(profileId);
      const token = getToken?.();
      await axios.delete(`${BASE_URL}/api/recruitment/post-job-profiles/resume/${profileId}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      await refresh();
      setToast({ visible: true, message: "Resume deleted", type: "success" });
      setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 2000);
    } catch (e) {
      setToast({
        visible: true,
        message: e?.response?.data?.message || e?.message || "Delete failed",
        type: "error",
      });
      setTimeout(() => setToast({ visible: false, message: "", type: "error" }), 2500);
    } finally {
      setDeletingId("");
    }
  };

  const hasError = !!error;

  return (
    <div className="relative space-y-4 text-sm text-foreground w-full overflow-x-hidden">
      {toast.visible && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase shadow-[0_10px_30px_rgba(0,0,0,0.45)] ${
            toast.type === "success"
              ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700"
              : "bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700"
          }`}
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
            {toast.type === "success" ? "✓" : "!"}
          </span>
          {toast.message}
        </div>
      )}

      <div className="rounded-3xl border border-border bg-surface p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mb-3">
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Stage</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-white">
            <span className="text-xl font-semibold tracking-tight">{title}</span>
            <span className="text-muted">•</span>
            <span>{companyName}</span>
            <span className="text-muted">•</span>
            <span>{job?.position || "Position"}</span>
            <span className="text-muted">•</span>
            <span>{locationDisplay}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex max-w-xs flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79L20 22l2-2l-6.5-6zM10 14a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z"
                />
              </svg>
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Search candidates..."
                className="flex-1 bg-transparent text-sm placeholder:text-muted focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wide">
                Total <strong className="text-white">{profiles.length}</strong>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wide">
                Shown <strong className="text-white">{displayedProfiles.length}</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["Location", filterLocation, setFilterLocation], ["Skill", filterSkill, setFilterSkill]].map(
              ([label, value, setter]) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted shadow-inner"
                >
                  <span className="uppercase tracking-[0.3em] text-[10px]">{label}</span>
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={`Filter ${label.toLowerCase()}`}
                    className="bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none"
                  />
                </div>
              )
            )}
            <button
              type="button"
              onClick={() => {
                setQInput("");
                setFilterLocation("");
                setFilterSkill("");
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-white"
            >
              Reset
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px]">
              {["Comfort", "Compact"].map((mode) => {
                const key = mode.toLowerCase();
                const active = density === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDensity(key)}
                    className={`rounded-full px-2 py-0.5 tracking-[0.25em] transition ${
                      active ? "bg-white/20 text-white shadow" : "text-muted hover:text-foreground/80"
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-primary"
              checked={allShownSelected}
              onChange={(e) => selectAllShown(e.target.checked)}
            />
            <span>Select all (shown)</span>
          </label>
          <span className="text-muted">Selected: {selectedIds.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={bulkMoveSelected}
            disabled={bulkSaving || selectedIds.length === 0}
            className={`px-3 py-1.5 text-xs rounded ${
              bulkSaving || selectedIds.length === 0
                ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {bulkSaving ? "Moving…" : "Move Selected (YES)"}
          </button>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="w-full">
          <table className="w-full table-auto">
            <thead className="sticky top-0 z-50 bg-background/95 shadow-[0_2px_8px_rgba(0,0,0,0.85)] border-b border-white/10 table-head">
              <tr>
                <th className="px-2 py-2 text-left font-medium text-muted border-b bg-background">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={allShownSelected}
                    onChange={(e) => selectAllShown(e.target.checked)}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">#</th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">
                  <ColumnFilterHeader
                    label="Name"
                    columnKey="name"
                    profiles={profiles}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeFilterSelection={activeFilterSelection}
                    setActiveFilterSelection={setActiveFilterSelection}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b">
                  <ColumnFilterHeader
                    label="Experience"
                    columnKey="experience"
                    profiles={profiles}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeFilterSelection={activeFilterSelection}
                    setActiveFilterSelection={setActiveFilterSelection}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b">
                  <ColumnFilterHeader
                    label="CTC"
                    columnKey="ctc"
                    profiles={profiles}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeFilterSelection={activeFilterSelection}
                    setActiveFilterSelection={setActiveFilterSelection}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b">
                  <ColumnFilterHeader
                    label="Location"
                    columnKey="location"
                    profiles={profiles}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeFilterSelection={activeFilterSelection}
                    setActiveFilterSelection={setActiveFilterSelection}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b">
                  <ColumnFilterHeader
                    label="Current Role"
                    columnKey="current_designation"
                    profiles={profiles}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeFilterSelection={activeFilterSelection}
                    setActiveFilterSelection={setActiveFilterSelection}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b">
                  <ColumnFilterHeader
                    label="Current Company"
                    columnKey="current_company"
                    profiles={profiles}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeFilterSelection={activeFilterSelection}
                    setActiveFilterSelection={setActiveFilterSelection}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">Previous Roles</th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">Education</th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">Skills</th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">Resume</th>
                <th className="px-3 py-2 text-left font-medium text-muted border-b bg-background">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="animate-pulse">
                    {Array.from({ length: 16 }).map((__, j) => (
                      <td key={`skc-${i}-${j}`} className="px-3 py-2 border-b">
                        <div className="h-3 bg-muted rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayedProfiles.length === 0 ? (
                <tr>
                  <td colSpan={16} className="px-3 py-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-surface-2 border flex items-center justify-center mb-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted">
                          <path
                            fill="currentColor"
                            d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4m0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-muted">No profiles in this stage</div>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedProfiles.map((p, idx) => (
                  <tr
                    key={p._id || idx}
                    className="table-row odd:bg-background even:bg-surface-2 hover:bg-primary/5 cursor-pointer"
                    onClick={(e) => {
                      const target = e.target;
                      if (target.closest('button, a, input, textarea, select, label')) return;
                      toggleSelect(p._id);
                    }}
                  >
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-2 py-1"} border-b align-top`}>
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={!!selectedMap[p._id]}
                        onChange={(e) => toggleSelect(p._id, e.target.checked)}
                      />
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>{idx + 1}</td>
                    <td
                      className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top whitespace-normal break-words`}
                      title={p?.name || ""}
                    >
                      {highlight(p?.name || "-", q)}
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      {renderExperience(p?.experience)}
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      {p?.ctc || "-"}
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      {p?.location || "-"}
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      <span className="px-1.5 py-0.5 rounded text-[10px] border bg-surface-2 text-foreground/80 border-border">
                        {p?.current_designation || "-"}
                      </span>
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      <span className="px-1.5 py-0.5 rounded text-[10px] border bg-surface-2 text-foreground/80 border-border">
                        {p?.current_company || "-"}
                      </span>
                    </td>
                    <td
                      className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top break-words whitespace-normal`}
                    >
                      {Array.isArray(p?.previous_roles)
                        ? renderChips(
                            p.previous_roles.map((r) =>
                              (r.designation || r.company)
                                ? `${r.designation || ""}${r.company ? " at " + r.company : ""}`.trim()
                                : typeof r === "object"
                                ? JSON.stringify(r)
                                : String(r)
                            )
                          )
                        : renderMixed(p?.previous_roles) || "-"}
                    </td>
                    <td
                      className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top break-words whitespace-normal`}
                    >
                      {(() => {
                        const education = p?.education;
                        if (!education) return "-";
                        
                        let filteredEducation;
                        if (Array.isArray(education)) {
                          filteredEducation = education.filter(item => {
                            const str = typeof item === "object" ? 
                              (item.name || item.degree || item.qualification || JSON.stringify(item)) : 
                              String(item);
                            return !str.toLowerCase().includes("iti");
                          });
                        } else {
                          const str = typeof education === "object" ? 
                            (education.name || education.degree || education.qualification || JSON.stringify(education)) : 
                            String(education);
                          if (str.toLowerCase().includes("iti")) {
                            return "-";
                          }
                          filteredEducation = education;
                        }
                        
                        return Array.isArray(filteredEducation) ? 
                          renderChips(filteredEducation) : 
                          renderMixed(filteredEducation) || "-";
                      })()}
                    </td>
                    <td
                      className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top break-words whitespace-normal`}
                    >
                      {Array.isArray(p?.skills) ? (
                        (() => {
                          const expanded = !!expandSkills[p._id];
                          const all = p.skills;
                          const shown = expanded ? all : all.slice(0, 8);
                          return (
                            <div className="flex flex-wrap gap-1 items-center">
                              {shown.map((s, si) => (
                                <span
                                  key={si}
                                  className="px-2 py-0.5 rounded text-[11px] border bg-surface-2 text-foreground/80 border-border"
                                  title={String(s)}
                                >
                                  {String(s)}
                                </span>
                              ))}
                              {all.length > shown.length && (
                                <button
                                  type="button"
                                  onClick={() => toggleSkills(p._id)}
                                  className="px-2 py-0.5 text-[11px] rounded border bg-background hover:bg-surface"
                                >
                                  +{all.length - shown.length} more
                                </button>
                              )}
                              {expanded && all.length > 8 && (
                                <button
                                  type="button"
                                  onClick={() => toggleSkills(p._id)}
                                  className="px-2 py-0.5 text-[11px] rounded border bg-background hover:bg-surface"
                                >
                                  Show less
                                </button>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        p?.skills || "-"
                      )}
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      {p?.resumeUrl ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] text-foreground/80">
                            <svg viewBox="0 0 24 24" className="w-4 h-4">
                              <path
                                fill="currentColor"
                                d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V8h5.5"
                              />
                            </svg>
                            {getFileExt(p.resumeUrl)}
                          </span>
                          <a
                            href={getResumeViewUrl(p.resumeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary underline"
                          >
                            Preview
                          </a>
                          <a
                            href={p.resumeUrl}
                            download
                            className="text-xs text-primary underline"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => deleteResume(p._id)}
                            disabled={deletingId === String(p._id)}
                            className={`inline-flex items-center gap-1 text-xs ${
                              deletingId === String(p._id)
                                ? "text-destructive/60 cursor-wait"
                                : "text-destructive hover:underline"
                            }`}
                            title="Delete resume from Cloudinary"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                              <path
                                fill="currentColor"
                                d="M9 3v1H4v2h16V4h-5V3H9m-3 6h12l-1 12H7L6 9Z"
                              />
                            </svg>
                            {deletingId === String(p._id) ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className={`${density === "compact" ? "px-2 py-1" : "px-3 py-2"} border-b align-top`}>
                      {(() => {
                        const decisions = Array.isArray(p.decisions) ? p.decisions : [];
                        const last = decisions.length ? decisions[decisions.length - 1] : null;
                        const lastDec = String(last?.decision || "").toUpperCase();
                        const isNo = lastDec === "NO";

                        if (isNo) {
                          return (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border bg-destructive/10 text-destructive border-destructive/40">
                                Status: NO
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                disabled={savingId === String(p._id)}
                                onClick={() => submitDecision(p._id, "YES")}
                                className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-full text-white shadow-sm transition ${
                                  savingId === String(p._id)
                                    ? "bg-emerald-600/60 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                              >
                                <svg viewBox="0 0 24 24" className="w-4 h-4">
                                  <path
                                    fill="currentColor"
                                    d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z"
                                  />
                                </svg>
                                <span>
                                  {savingId === String(p._id)
                                    ? "Saving…"
                                    : stageKey === "InterviewStatus"
                                    ? "Approved"
                                    : "YES"}
                                </span>
                              </button>
                              <button
                                disabled={savingId === String(p._id)}
                                onClick={() => submitDecision(p._id, "NO")}
                                className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-full text-white shadow-sm transition ${
                                  savingId === String(p._id)
                                    ? "bg-rose-600/70 cursor-wait"
                                    : "bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 hover:shadow-lg hover:-translate-y-0.5"
                                }`}
                              >
                                <svg viewBox="0 0 24 24" className="w-4 h-4">
                                  <path
                                    fill="currentColor"
                                    d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m5 11H7v-2h10z"
                                  />
                                </svg>
                                <span>
                                  {savingId === String(p._id)
                                    ? "Saving…"
                                    : stageKey === "InterviewStatus"
                                    ? "Not Approved"
                                    : "NO"}
                                </span>
                              </button>
                            </div>
                            <input
                              type="text"
                              value={remarkById[p._id] || ""}
                              onChange={(e) =>
                                setRemarkById((prev) => ({
                                  ...prev,
                                  [p._id]: e.target.value,
                                }))
                              }
                              placeholder="Add remark (visible with decision)"
                              className="w-full max-w-xs text-xs px-2 py-1 border rounded bg-background"
                            />
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasError && (
        <div className="mt-2 text-sm text-destructive bg-destructive/10 border border-destructive/40 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-40 pointer-events-none">
          <div className="mx-auto max-w-7xl pointer-events-auto">
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border bg-surface shadow-lg">
              <div className="text-xs text-foreground/80">{selectedIds.length} selected</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={bulkMoveSelected}
                  disabled={bulkSaving || selectedIds.length === 0}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded ${
                    bulkSaving || selectedIds.length === 0
                      ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path
                      fill="currentColor"
                      d="M5 12h12.17l-4.59-4.59L13 6l7 7-7 7-1.41-1.41L17.17 14H5z"
                    />
                  </svg>
                  {bulkSaving ? "Moving…" : "Move Selected (YES)"}
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-3 py-1.5 text-xs rounded border bg-background hover:bg-surface"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployerStageSheet;
