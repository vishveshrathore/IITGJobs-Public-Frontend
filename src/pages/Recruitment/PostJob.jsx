import React, { useEffect, useState } from "react";
import Navbar from "../../components/Public/Landing Page/Navbar";
import Footer from "../../components/Public/Landing Page/Footer";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/authcontext.jsx";
import { toast } from "react-hot-toast";

// Define presentational row helpers outside the component to avoid remounting inputs on each keystroke
const Label = ({ children }) => (
  <div className="text-sm text-muted py-3 px-3 bg-surface-3 border-b border-r border-border">{children}</div>
);

const Field = ({ children }) => (
  <div className="p-3 border-b border-border min-w-0">{children}</div>
);

const PostJob = () => {
  const { isAuthenticated, isCorporate, getToken } = useAuth();
  const canPost = isAuthenticated && isCorporate;
  const [form, setForm] = useState({
    organisation: "",
    position: "",
    positionsCount: "",
    level: "",
    expFrom: "",
    expTo: "",
    ageFrom: "",
    ageTo: "",
    department: "",
    keySkills: "",
    keySkillsOther: "",
    reportingTo: "",
    teamSizeLevel: "",
    ctcUpper: "",
    jobLocation: "",
    basicQualification: "",
    professionalQualification: "",
    jobDescription: "",
    responsibilities: "",
    targetIndustry: "",
    targetIndustryOther: "",
    targetCompanies: "",
    preferredFrom: "",
    antiPoaching: "",
    antiPoachingOther: "",
    positionRole: "On Role",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Companies for organisation select
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/recruitment/getCompanies/all`);
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.companies) ? data.companies : []);
        setCompanies(list);
      } catch (e) {
        console.error("Failed to load companies", e?.response?.data?.message || e?.message);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!String(form.position).trim()) return alert('Enter position/designation');
    setSubmitting(true);
    try {
      const token = getToken?.();
      const payload = { ...form };
      const { data } = await axios.post(
        `${BASE_URL}/api/recruitment/post-job`,
        payload,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      toast.success(data?.message || 'Job posted');
      setForm({
        organisation: "",
        position: "",
        positionsCount: "",
        level: "",
        expFrom: "",
        expTo: "",
        ageFrom: "",
        ageTo: "",
        department: "",
        keySkills: "",
        keySkillsOther: "",
        reportingTo: "",
        teamSizeLevel: "",
        ctcUpper: "",
        jobLocation: "",
        basicQualification: "",
        professionalQualification: "",
        jobDescription: "",
        responsibilities: "",
        targetIndustry: "",
        targetIndustryOther: "",
        targetCompanies: "",
        preferredFrom: "",
        antiPoaching: "",
        antiPoachingOther: "",
        positionRole: "On Role",
        remarks: "",
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit';
      if (status === 403) {
        toast.error(`Access denied: ${msg}`);
      } else if (status === 401) {
        toast.error(`Unauthorized: ${msg}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "input w-full";
  const selectCls = "input w-full";
  const textareaCls = "input w-full min-h-[120px]";

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Post Job</h1>
          <p className="text-sm text-muted mt-1">Share your requirement and we will source the right talent fast.</p>
          {!canPost && (
            <div className="mt-3 text-sm">
              <span className="text-muted">Please login as Employer to post a job.</span>
              {' '}
              <a href="/employer-login" className="text-brand-300 hover:underline">Login</a>
              {' '}
              <span className="text-muted">or</span>
              {' '}
              <a href="/employer-signup" className="text-brand-300 hover:underline">Create account</a>
            </div>
          )}
        </div>
        <form onSubmit={onSubmit} className="card-elevated overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            <Label>Organisation / Company*</Label>
            <Field>
              <select name="organisation" value={form.organisation} onChange={onChange} className={selectCls}>
                <option value="">Select company…</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.CompanyName || c.companyName}
                  </option>
                ))}
              </select>
              {companiesLoading && <div className="text-xs text-muted mt-1">Loading companies…</div>}
            </Field>

            <Label>Position/Designation*</Label>
            <Field>
              <input type="text" name="position" placeholder="e.g., Area Sales Manager " autoComplete="off" value={form.position} onChange={onChange} className={inputCls} />
            </Field>

            <Label>No. of Positions*</Label>
            <Field>
              <input name="positionsCount" type="number" min="1" placeholder="e.g., 3" value={form.positionsCount} onChange={onChange} className={inputCls} />
            </Field>

            <Label>Level*</Label>
            <Field>
              <select name="level" value={form.level} onChange={onChange} className={selectCls}>
                <option value="">Select</option>
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Leadership</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Note: Please click Yes to add another level.</p>
            </Field>

            <Label>Experience range</Label>
            <Field>
              <div className="flex items-center gap-2">
                <span className="text-sm">From</span>
                <select name="expFrom" value={form.expFrom} onChange={onChange} className={selectCls}>
                  <option value="">fresher</option>
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i} value={String(i)}>{i}</option>
                  ))}
                </select>
                <span className="text-sm">to</span>
                <select name="expTo" value={form.expTo} onChange={onChange} className={selectCls}>
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i} value={String(i)}>{i}</option>
                  ))}
                </select>
                <span className="text-sm">(Yrs)</span>
              </div>
            </Field>

            <Label>Age range</Label>
            <Field>
              <div className="flex items-center gap-2">
                <span className="text-sm">From</span>
                <input name="ageFrom" type="number" min="18" className={`${inputCls} w-28`} value={form.ageFrom} onChange={onChange} />
                <span className="text-sm">to</span>
                <input name="ageTo" type="number" min="18" className={`${inputCls} w-28`} value={form.ageTo} onChange={onChange} />
                <span className="text-sm">(Yrs)</span>
              </div>
            </Field>

            <Label>Department*</Label>
            <Field>
              <select name="department" value={form.department} onChange={onChange} className={selectCls}>
                <option value="">Select</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Operations</option>
                <option>HR</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </Field>

            <Label>Key Skills*</Label>
            <Field>
              <div className="space-y-2">
                <textarea name="keySkills" value={form.keySkills} onChange={onChange} className={textareaCls} />
              </div>
            </Field>

            <Label>Offered CTC Upper Limit</Label>
            <Field>
              <input type="number" name="ctcUpper" min="0" step="1000" placeholder="Upper limit in INR" value={form.ctcUpper} onChange={onChange} className={inputCls} />
            </Field>

            <Label>Job Based at*</Label>
            <Field>
              <input type="text" name="jobLocation" placeholder="City, State" value={form.jobLocation} onChange={onChange} className={inputCls} />
            </Field>

            <Label>Basic Qualification*</Label>
            <Field>
              <select name="basicQualification" value={form.basicQualification} onChange={onChange} className={selectCls}>
                <option value="">-Any-</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Diploma</option>
              </select>
            </Field>

            <Label>Professional Qualification</Label>
            <Field>
              <input type="text" name="professionalQualification" placeholder="e.g., MBA, CFA, CA" value={form.professionalQualification} onChange={onChange} className={inputCls} />
            </Field>

            <Label>Job Description</Label>
            <Field>
              <textarea name="jobDescription" placeholder="Key responsibilities, requirements, KPIs…" value={form.jobDescription} onChange={onChange} className={textareaCls} />
            </Field>

            <Label>Responsibilities</Label>
            <Field>
              <textarea name="responsibilities" placeholder="Detailed responsibilities…" value={form.responsibilities} onChange={onChange} className={textareaCls} />
            </Field>

            <Label>Target Companies</Label>
            <Field>
              <div className="space-y-2">
                <textarea name="targetCompanies" placeholder="Comma separated companies" value={form.targetCompanies} onChange={onChange} className={textareaCls} />
              </div>
            </Field>

            <Label>Candidates Preferred From</Label>
            <Field>
              <div className="space-y-2">
                <textarea name="preferredFrom" placeholder="Preferred locations/regions" value={form.preferredFrom} onChange={onChange} className={textareaCls} />
                <p className="text-xs text-muted">Note: Candidates with experience in the selected locations will be preferred.</p>
              </div>
            </Field>

            <Label>Position Role</Label>
            <Field>
              <div className="segmented">
                <button type="button" className={"" + (form.positionRole === 'On Role' ? ' active' : '')} onClick={() => setForm((p)=>({ ...p, positionRole: 'On Role' }))}>On Role</button>
                <button type="button" className={"" + (form.positionRole === 'Off Role' ? ' active' : '')} onClick={() => setForm((p)=>({ ...p, positionRole: 'Off Role' }))}>Off Role</button>
              </div>
            </Field>

            <Label>Special Remarks</Label>
            <Field>
              <textarea name="remarks" placeholder="Anything else we should know?" value={form.remarks} onChange={onChange} className={textareaCls} />
            </Field>
          </div>

          <div className="p-4 flex justify-end gap-3 bg-surface-2 border-t border-border">
            <button type="reset" onClick={() => setForm({
              organisation: "",
              position: "",
              positionsCount: "",
              level: "",
              expFrom: "",
              expTo: "",
              ageFrom: "",
              ageTo: "",
              department: "",
              keySkills: "",
              keySkillsOther: "",
              reportingTo: "",
              teamSizeLevel: "",
              ctcUpper: "",
              jobLocation: "",
              basicQualification: "",
              professionalQualification: "",
              jobDescription: "",
              responsibilities: "",
              targetIndustry: "",
              targetIndustryOther: "",
              targetCompanies: "",
              preferredFrom: "",
              antiPoaching: "",
              antiPoachingOther: "",
              positionRole: "On Role",
              remarks: "",
            })} className="btn btn-outline">Clear</button>
            <button type="submit" disabled={submitting || !canPost} title={!canPost ? 'Login required' : undefined} className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;

