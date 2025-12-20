import React, { useEffect, useMemo, useState } from "react";
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
    organisationOther: "",
    position: "",
    positionsCount: "",
    level: "",
    levelOther: "",
    expFrom: "",
    expTo: "",
    ageFrom: "",
    ageTo: "",
    department: "",
    mandatoryKeySkills: "",
    optionalKeySkills: "",
    ctcUpper: "",
    jobType: "",
    jobCity: "",
    jobCityOther: "",
    jobState: "",
    basicQualification: "",
    professionalQualification: "",
    jobDescription: "",
    responsibilities: "",
    mandatoryLanguages: [],
    targetCompaniesIds: [],
    preferredFrom: "",
    positionRole: "On Role",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Companies for organisation select
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [organisationSearch, setOrganisationSearch] = useState("");

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
    if (!String(form.position).trim()) {
      toast.error('Position/Designation is required');
      return;
    }
    setSubmitting(true);
    try {
      const token = getToken?.();

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, value == null ? "" : value);
        }
      });

      const jdFileInput = document.getElementById("jd-file-input");
      if (jdFileInput && jdFileInput.files && jdFileInput.files[0]) {
        formData.append("jobDescriptionFile", jdFileInput.files[0]);
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/recruitment/post-job`,
        formData,
        {
          withCredentials: true,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      toast.success(data?.message || 'Job posted');
      setForm({
        organisation: "",
        organisationOther: "",
        position: "",
        positionsCount: "",
        level: "",
        levelOther: "",
        expFrom: "",
        expTo: "",
        ageFrom: "",
        ageTo: "",
        department: "",
        mandatoryKeySkills: "",
        optionalKeySkills: "",
        ctcUpper: "",
        jobType: "",
        jobCity: "",
        jobCityOther: "",
        jobState: "",
        basicQualification: "",
        professionalQualification: "",
        jobDescription: "",
        responsibilities: "",
        mandatoryLanguages: [],
        targetCompaniesIds: [],
        preferredFrom: "",
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

  const indianStatesWithCities = useMemo(
    () => ({
      "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
      "Arunachal Pradesh": ["Itanagar"],
      Assam: ["Guwahati", "Silchar", "Dibrugarh"],
      Bihar: ["Patna", "Gaya", "Bhagalpur"],
      Chhattisgarh: ["Raipur", "Bhilai"],
      Goa: ["Panaji", "Margao"],
      Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
      Haryana: ["Gurugram", "Faridabad", "Panipat"],
      "Himachal Pradesh": ["Shimla", "Dharamshala"],
      Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
      Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
      Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
      "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
      Manipur: ["Imphal"],
      Meghalaya: ["Shillong"],
      Mizoram: ["Aizawl"],
      Nagaland: ["Kohima", "Dimapur"],
      Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
      Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
      Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
      Sikkim: ["Gangtok"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
      Telangana: ["Hyderabad", "Warangal"],
      Tripura: ["Agartala"],
      "Uttar Pradesh": ["Lucknow", "Noida", "Ghaziabad", "Kanpur", "Varanasi"],
      Uttarakhand: ["Dehradun", "Haridwar"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
      "Andaman and Nicobar Islands": ["Port Blair"],
      Chandigarh: ["Chandigarh"],
      "Dadra and Nagar Haveli and Daman and Diu": ["Daman"],
      Delhi: ["New Delhi"],
      Lakshadweep: ["Kavaratti"],
      "Jammu and Kashmir": ["Srinagar", "Jammu"],
      Ladakh: ["Leh"],
      "Puducherry": ["Puducherry"],
    }),
    []
  );

  const indianLanguages = useMemo(
    () => [
      "Assamese",
      "Bengali",
      "Bodo",
      "Dogri",
      "Gujarati",
      "Hindi",
      "Kannada",
      "Kashmiri",
      "Konkani",
      "Maithili",
      "Malayalam",
      "Manipuri",
      "Marathi",
      "Nepali",
      "Odia",
      "Punjabi",
      "Sanskrit",
      "Santali",
      "Sindhi",
      "Tamil",
      "Telugu",
      "Urdu",
      "English",
    ],
    []
  );

  const isOrganisationOther = form.organisation === "__other__";
  const isLevelOther = form.level === "Other";
  const isLocationRequiredJobType = ["Full time", "Part time", "Hybrid"].includes(form.jobType);

  const filteredCompanies = useMemo(() => {
    if (!organisationSearch.trim()) return companies;
    const q = organisationSearch.trim().toLowerCase();
    return companies.filter((c) => {
      const name = String(c.CompanyName || c.companyName || "").toLowerCase();
      return name.startsWith(q);
    });
  }, [companies, organisationSearch]);

  const stateOptions = useMemo(() => Object.keys(indianStatesWithCities), [indianStatesWithCities]);
  const cityOptions = useMemo(() => {
    const list = indianStatesWithCities[form.jobState] || [];
    return list;
  }, [form.jobState, indianStatesWithCities]);

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
              <input
                type="text"
                value={organisationSearch}
                onChange={(e) => setOrganisationSearch(e.target.value)}
                placeholder="Type to filter companies (e.g., A)"
                className={`${inputCls} mb-2`}
                autoComplete="off"
              />
              <select
                name="organisation"
                value={form.organisation}
                onChange={onChange}
                className={selectCls}
              >
                <option value="">Select company…</option>
                {filteredCompanies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.CompanyName || c.companyName}
                  </option>
                ))}
                <option value="__other__">Other</option>
              </select>
              {isOrganisationOther && (
                <input
                  type="text"
                  name="organisationOther"
                  placeholder="Enter organisation / company name"
                  value={form.organisationOther}
                  onChange={onChange}
                  className={`${inputCls} mt-2`}
                />
              )}
              {companiesLoading && <div className="text-xs text-muted mt-1">Loading companies…</div>}
            </Field>

            <Label>Position/Designation*</Label>
            <Field>
              <input
                type="text"
                name="position"
                placeholder="e.g., Area Sales Manager"
                autoComplete="off"
                value={form.position}
                onChange={onChange}
                className={inputCls}
              />
            </Field>

            <Label>No. of Positions*</Label>
            <Field>
              <input
                name="positionsCount"
                type="number"
                min="1"
                placeholder="e.g., 3"
                value={form.positionsCount}
                onChange={onChange}
                className={inputCls}
              />
            </Field>

            <Label>Level*</Label>
            <Field>
              <select
                name="level"
                value={form.level}
                onChange={onChange}
                className={selectCls}
              >
                <option value="">Select</option>
                <option value="Trainee">Trainee</option>
                <option value="Executive">Executive</option>
                <option value="Senior Executive">Senior Executive</option>
                <option value="Assistant Manager">Assistant Manager</option>
                <option value="Manager">Manager</option>
                <option value="Senior Manager">Senior Manager</option>
                <option value="AGM">AGM</option>
                <option value="DGM">DGM</option>
                <option value="GM">GM</option>
                <option value="AVP">AVP</option>
                <option value="VP">VP</option>
                <option value="Senior VP">Senior VP</option>
                <option value="President">President</option>
                <option value="Director">Director</option>
                <option value="CEO">CEO</option>
                <option value="Other">Other</option>
              </select>
              {isLevelOther && (
                <input
                  type="text"
                  name="levelOther"
                  placeholder="Specify level"
                  value={form.levelOther}
                  onChange={onChange}
                  className={`${inputCls} mt-2`}
                />
              )}
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
              <select
                name="department"
                value={form.department}
                onChange={onChange}
                className={selectCls}
              >
                <option value="">Select</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Operations</option>
                <option>HR</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </Field>

            <Label>Required Mandatory Key Skills</Label>
            <Field>
              <textarea
                name="mandatoryKeySkills"
                value={form.mandatoryKeySkills}
                onChange={onChange}
                className={textareaCls}
              />
            </Field>

            <Label>Required Non-Mandatory Key Skills</Label>
            <Field>
              <textarea
                name="optionalKeySkills"
                value={form.optionalKeySkills}
                onChange={onChange}
                className={textareaCls}
              />
            </Field>

            <Label>Offered CTC Upper Limit</Label>
            <Field>
              <input
                type="text"
                name="ctcUpper"
                placeholder="Enter amount (INR)"
                value={form.ctcUpper}
                onChange={onChange}
                className={inputCls}
              />
            </Field>

            <Label>Job Type</Label>
            <Field>
              <select
                name="jobType"
                value={form.jobType}
                onChange={onChange}
                className={selectCls}
              >
                <option value="">Select</option>
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
                <option value="Hybrid">Hybrid</option>
                <option value="WFH">WFH</option>
                <option value="Freelancing / Consultant">Freelancing / Consultant</option>
              </select>
            </Field>

            <Label>Job Based at*</Label>
            <Field>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  name="jobState"
                  value={form.jobState}
                  onChange={(e) => setForm((p) => ({ ...p, jobState: e.target.value, jobCity: "", jobCityOther: "" }))}
                  className={selectCls}
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <select
                  name="jobCity"
                  value={form.jobCity}
                  onChange={onChange}
                  className={selectCls}
                  disabled={!form.jobState}
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                  <option value="__other__">Other</option>
                </select>
              </div>
              {form.jobCity === "__other__" && (
                <input
                  type="text"
                  name="jobCityOther"
                  placeholder="Enter City"
                  value={form.jobCityOther}
                  onChange={onChange}
                  className={`${inputCls} mt-2`}
                />
              )}
              {isLocationRequiredJobType && (
                <p className="text-xs text-muted mt-1">
                  Location is required for Full time, Part time and Hybrid roles.
                </p>
              )}
            </Field>

            <Label>Basic Qualification*</Label>
            <Field>
              <select
                name="basicQualification"
                value={form.basicQualification}
                onChange={onChange}
                className={selectCls}
              >
                <option value="">-Any-</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Diploma</option>
              </select>
            </Field>

            <Label>Professional Qualification</Label>
            <Field>
              <input
                type="text"
                name="professionalQualification"
                placeholder="e.g., MBA, CFA, CA"
                value={form.professionalQualification}
                onChange={onChange}
                className={inputCls}
              />
            </Field>

            <Label>Detailed Job Description</Label>
            <Field>
              <textarea
                name="jobDescription"
                placeholder="Key responsibilities, requirements, KPIs…"
                value={form.jobDescription}
                onChange={onChange}
                className={textareaCls}
              />
              <div className="mt-2 flex flex-col gap-2">
                <input
                  id="jd-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className={inputCls}
                />
              </div>
            </Field>

            <Label>Responsibilities</Label>
            <Field>
              <textarea
                name="responsibilities"
                placeholder="Detailed responsibilities…"
                value={form.responsibilities}
                onChange={onChange}
                className={textareaCls}
              />
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
            <button
              type="reset"
              onClick={() =>
                setForm({
                  organisation: "",
                  organisationOther: "",
                  position: "",
                  positionsCount: "",
                  level: "",
                  levelOther: "",
                  expFrom: "",
                  expTo: "",
                  ageFrom: "",
                  ageTo: "",
                  department: "",
                  mandatoryKeySkills: "",
                  optionalKeySkills: "",
                  ctcUpper: "",
                  jobType: "",
                  jobCity: "",
                  jobState: "",
                  basicQualification: "",
                  professionalQualification: "",
                  jobDescription: "",
                  responsibilities: "",
                  mandatoryLanguages: [],
                  targetCompaniesIds: [],
                  preferredFrom: "",
                  positionRole: "On Role",
                  remarks: "",
                })
              }
              className="btn btn-outline"
            >
              Clear
            </button>
            <button type="submit" disabled={submitting || !canPost} title={!canPost ? 'Login required' : undefined} className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;

