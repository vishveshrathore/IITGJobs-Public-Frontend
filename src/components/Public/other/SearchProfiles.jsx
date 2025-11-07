import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import Navbar from "../Landing Page/Navbar";
import Footer from "../Landing Page/Footer";

export default function SearchProfiles() {
  // Mode & keywords
  const [mode, setMode] = useState('general'); // 'general' | 'advanced'
  const [keyword, setKeyword] = useState('');

  // Filters
  const [jobRole, setJobRole] = useState('');
  const [currentCompanyName, setCurrentCompanyName] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [region, setRegion] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [education, setEducation] = useState('');
  const [applicationType, setApplicationType] = useState('');
  const [languages, setLanguages] = useState([]);
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // General Search specific fields
  const [basicQual, setBasicQual] = useState([]);
  const [basicReq, setBasicReq] = useState('optional');
  const [profQual, setProfQual] = useState([]);
  const [profReq, setProfReq] = useState('optional');
  const [minLevel, setMinLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [keySkill, setKeySkill] = useState('');
  const [prefIndustry, setPrefIndustry] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [appliedQs, setAppliedQs] = useState(null);

  // Advanced Search specific fields
  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [institutes, setInstitutes] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [keywordsMode, setKeywordsMode] = useState('all'); // all | any
  const [preferredCompanies, setPreferredCompanies] = useState([]);
  const [preferredCompaniesOther, setPreferredCompaniesOther] = useState('');
  const [antiCompanies, setAntiCompanies] = useState([]);
  const [antiCompaniesOther, setAntiCompaniesOther] = useState('');
  const [positionRole, setPositionRole] = useState('any'); // on | off | any

  // Option lists
  const QUAL_OPTIONS = useMemo(() => (
    ['10th','12th','Diploma','Graduation','Post Graduation','PhD','Certification']
  ), []);
  const PROF_QUAL_OPTIONS = useMemo(() => (
    ['B.Tech','M.Tech','MBA','BBA','BCA','MCA','B.Sc','M.Sc','CA','CS','Diploma']
  ), []);
  const LEVEL_OPTIONS = useMemo(() => (
    ['Entry','Junior','Mid','Senior','Lead','Manager']
  ), []);
  const DEPT_OPTIONS = useMemo(() => (
    ['Engineering','Product','Design','Sales','Marketing','HR','Finance','Operations','IT','Support']
  ), []);
  const SKILL_OPTIONS = useMemo(() => (
    ['Any','JavaScript','React','Node.js','Java','Python','SQL','DevOps','UI/UX','Excel','Communication']
  ), []);
  const INDUSTRY_OPTIONS = useMemo(() => (
    ['IT','BFSI','Healthcare','E-commerce','Manufacturing','Education','FMCG','Consulting','Telecom']
  ), []);
  const COUNTRY_OPTIONS = useMemo(() => (
    ['India','USA','UK','Canada','Australia','UAE','Singapore']
  ), []);
  const INDIAN_STATES = useMemo(() => (
    ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry']
  ), []);
  const INSTITUTE_OPTIONS = useMemo(() => (['IIT','NIT','IIM','BITS','DU','MU','Other']), []);
  const COMPANY_OPTIONS = useMemo(() => (['TCS','Infosys','Wipro','Accenture','Capgemini','HCL','Other']), []);

  // Data
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hover, setHover] = useState({ show: false, type: null, url: '', x: 0, y: 0 });
  const [view, setView] = useState({ open: false, data: null });

  const resumePreviewUrl = (url) => {
    const u = String(url || '');
    return `${BASE_URL}/api/recruitment/proxy/file?url=${encodeURIComponent(u)}`;
  };

  // Build current filters snapshot (applied with Apply button)
  const qs = useMemo(() => ({
    keyword: (mode === 'advanced' ? keyword.trim().replace(/\s+/g, '+') : keyword.trim()),
    mode,
    region: region || undefined,
    gender: gender || undefined,
    category: category || undefined,
    applicationType: applicationType || undefined,
    minExp: minExp !== '' ? Number(minExp) : undefined,
    maxExp: maxExp !== '' ? Number(maxExp) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    education: education || undefined,
    language: languages.length ? languages : undefined,
    jobRole: jobRole || undefined,
    currentCompanyName: currentCompanyName || undefined,
    currentDesignation: currentDesignation || undefined,
    // General params (backend may ignore until supported)
    basicQualification: basicQual.length ? basicQual : undefined,
    basicRequirement: basicReq || undefined,
    professionalQualification: profQual.length ? profQual : undefined,
    professionalRequirement: profReq || undefined,
    minimumLevel: minLevel || undefined,
    department: department || undefined,
    keySkill: keySkill || undefined,
    preferredIndustry: prefIndustry.length ? prefIndustry : undefined,
    country: countries.length ? countries : undefined,
    state: states.length ? states : undefined,
    // Advanced params
    ageFrom: ageFrom || undefined,
    ageTo: ageTo || undefined,
    institute: institutes.length ? institutes : undefined,
    keywords: keywords || undefined,
    keywordsMode: keywordsMode || undefined,
    preferredCompanies: preferredCompanies.length ? preferredCompanies : undefined,
    preferredCompaniesOther: preferredCompaniesOther || undefined,
    antiCompanies: antiCompanies.length ? antiCompanies : undefined,
    antiCompaniesOther: antiCompaniesOther || undefined,
    positionRole: positionRole || undefined,
  }), [keyword, mode, region, gender, category, applicationType, minExp, maxExp, fromDate, toDate, education, languages, jobRole, currentCompanyName, currentDesignation
  , basicQual, basicReq, profQual, profReq, minLevel, department, keySkill, prefIndustry, countries, states, ageFrom, ageTo, institutes, keywords, keywordsMode, preferredCompanies, preferredCompaniesOther, antiCompanies, antiCompaniesOther, positionRole]);

  useEffect(() => {
    if (!appliedQs) return; // wait until Apply is clicked
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/recruitment/filtered-search`, { params: appliedQs });
        if (!cancelled) setResults(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appliedQs]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
       <Navbar />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Recruiter Search</h1>
          
          <div className="inline-flex bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <button className={`px-3 py-1.5 text-sm ${mode==='general'?'bg-indigo-600 text-white':'text-slate-200'}`} onClick={() => setMode('general')}>General</button>
            <button className={`px-3 py-1.5 text-sm ${mode==='advanced'?'bg-indigo-600 text-white':'text-slate-200'}`} onClick={() => setMode('advanced')}>Advanced</button>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          {mode === 'general' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Basic Qualification</div>
                <div className="md:col-span-7">
                  <MultiSelectTag options={QUAL_OPTIONS} values={basicQual} setValues={setBasicQual} placeholder="Select Some Options" />
                </div>
                <div className="md:col-span-2">
                  <select value={basicReq} onChange={(e)=>setBasicReq(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 px-2 py-2 text-sm">
                    <option value="optional">Optional Requirement</option>
                    <option value="mandatory">Mandatory</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Professional Qualification</div>
                <div className="md:col-span-7">
                  <MultiSelectTag options={PROF_QUAL_OPTIONS} values={profQual} setValues={setProfQual} placeholder="Select Some Options" />
                </div>
                <div className="md:col-span-2">
                  <select value={profReq} onChange={(e)=>setProfReq(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 px-2 py-2 text-sm">
                    <option value="optional">Optional Requirement</option>
                    <option value="mandatory">Mandatory</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Minimum Level</div>
                <div className="md:col-span-9">
                  <select value={minLevel} onChange={(e)=>setMinLevel(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                    <option value="">Select an Option</option>
                    {LEVEL_OPTIONS.map(o=> <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Department</div>
                <div className="md:col-span-9">
                  <select value={department} onChange={(e)=>setDepartment(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                    <option value="">Select an Option</option>
                    {DEPT_OPTIONS.map(o=> <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Key Skills</div>
                <div className="md:col-span-9">
                  <select value={keySkill} onChange={(e)=>setKeySkill(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                    {SKILL_OPTIONS.map(o=> <option key={o} value={o === 'Any' ? '' : o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Preferred Industry</div>
                <div className="md:col-span-9">
                  <MultiSelectTag options={INDUSTRY_OPTIONS} values={prefIndustry} setValues={setPrefIndustry} placeholder="Select Some Options" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">Country</div>
                <div className="md:col-span-9">
                  <MultiSelectTag options={COUNTRY_OPTIONS} values={countries} setValues={setCountries} placeholder="Select Some Options" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 text-sm text-slate-200">State</div>
                <div className="md:col-span-9">
                  <MultiSelectTag options={INDIAN_STATES} values={states} setValues={setStates} placeholder="Select Some Options" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={()=> setAppliedQs({ ...qs })}
                  disabled={loading}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-sm disabled:opacity-60"
                >Apply</button>
                <button
                  onClick={()=>{ setBasicQual([]); setBasicReq('optional'); setProfQual([]); setProfReq('optional'); setMinLevel(''); setDepartment(''); setKeySkill(''); setPrefIndustry([]); setCountries([]); setStates([]); }}
                  className="px-3 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 text-sm"
                >Clear</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Advanced Keywords</label>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={'e.g. node react microservices'}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Job Role</label>
                <input value={jobRole} onChange={(e)=>setJobRole(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Current Company</label>
                <input value={currentCompanyName} onChange={(e)=>setCurrentCompanyName(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Designation</label>
                <input value={currentDesignation} onChange={(e)=>setCurrentDesignation(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Region / State</label>
                <input value={region} onChange={(e)=>setRegion(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Gender</label>
                <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                  <option value="">Any</option>
                  <option value="General">General</option>
                  <option value="Physical Disability">Physical Disability</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Education Level</label>
                <select value={education} onChange={(e)=>setEducation(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                  <option value="">Any</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Application Type</label>
                <select value={applicationType} onChange={(e)=>setApplicationType(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm">
                  <option value="">Any</option>
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                  <option value="college">College</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Languages Known</label>
                <MultiSelectSmall values={languages} setValues={setLanguages} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Experience (years)</label>
                <div className="flex items-center gap-3">
                  <input type="number" min={0} max={30} value={minExp} onChange={(e)=>{ const v=e.target.value; setMinExp(v===''? '': Math.max(0, Math.min(30, Number(v))).toString()); }} className="w-20 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1 text-sm" />
                  <span className="text-slate-400">to</span>
                  <input type="number" min={0} max={30} value={maxExp} onChange={(e)=>{ const v=e.target.value; setMaxExp(v===''? '': Math.max(0, Math.min(30, Number(v))).toString()); }} className="w-20 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-700 px-2 py-2 text-sm" />
                  <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-700 px-2 py-2 text-sm" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Age range (years)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={65} value={ageFrom} onChange={(e)=>setAgeFrom(e.target.value)} placeholder="From" className="w-24 rounded-lg border border-slate-600 bg-slate-700 px-2 py-2 text-sm" />
                  <span className="text-slate-400">to</span>
                  <input type="number" min={0} max={65} value={ageTo} onChange={(e)=>setAgeTo(e.target.value)} placeholder="To" className="w-24 rounded-lg border border-slate-600 bg-slate-700 px-2 py-2 text-sm" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Institutes</label>
                <MultiSelectTag options={INSTITUTE_OPTIONS} values={institutes} setValues={setInstitutes} placeholder="Select Some Options" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Keywords</label>
                <input value={keywords} onChange={(e)=>setKeywords(e.target.value)} placeholder="Type keywords separated by commas" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-300">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="kwmode" checked={keywordsMode==='all'} onChange={()=>setKeywordsMode('all')} /> Match All</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="kwmode" checked={keywordsMode==='any'} onChange={()=>setKeywordsMode('any')} /> Match at least 1</label>
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Preferred Companies</label>
                <MultiSelectTag options={COMPANY_OPTIONS} values={preferredCompanies} setValues={setPreferredCompanies} placeholder="Select Some Options" />
                <input value={preferredCompaniesOther} onChange={(e)=>setPreferredCompaniesOther(e.target.value)} placeholder="Other companies (comma separated)" className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Anti-Poaching Companies</label>
                <MultiSelectTag options={COMPANY_OPTIONS} values={antiCompanies} setValues={setAntiCompanies} placeholder="Select Some Options" />
                <input value={antiCompaniesOther} onChange={(e)=>setAntiCompaniesOther(e.target.value)} placeholder="Other companies (comma separated)" className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Position Role</label>
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="posrole" checked={positionRole==='on'} onChange={()=>setPositionRole('on')} /> On Role</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="posrole" checked={positionRole==='off'} onChange={()=>setPositionRole('off')} /> Off Role</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="posrole" checked={positionRole==='any'} onChange={()=>setPositionRole('any')} /> Any</label>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button onClick={()=> setAppliedQs({ ...qs })} disabled={loading} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-sm disabled:opacity-60">Apply</button>
                <button onClick={()=>{
                  setKeyword(''); setJobRole(''); setCurrentCompanyName(''); setCurrentDesignation(''); setRegion(''); setGender(''); setCategory(''); setEducation(''); setApplicationType(''); setLanguages([]); setMinExp(''); setMaxExp(''); setFromDate(''); setToDate('');
                  setAgeFrom(''); setAgeTo(''); setInstitutes([]); setKeywords(''); setKeywordsMode('all'); setPreferredCompanies([]); setPreferredCompaniesOther(''); setAntiCompanies([]); setAntiCompaniesOther(''); setPositionRole('any');
                }} className="px-3 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 text-sm">Clear</button>
              </div>
            </div>

          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Results ({results.length})</h2>
            <div className="text-xs text-slate-400">Mode: {mode}</div>
          </div>
          {loading ? (
            <div className="py-4">
              <ShimmerRows />
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No results</div>
          ) : (
            <div className="overflow-x-auto relative">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-700 text-slate-300">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Mobile</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Designation</th>
                    <th className="py-2 pr-4">Company</th>
                    <th className="py-2 pr-4">Photo</th>
                    <th className="py-2 pr-4">Resume</th>
                    <th className="py-2 pr-4">Intro Video</th>
                    <th className="py-2 pr-4">Actions</th>
                    <th className="py-2 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r._id} className="border-b border-slate-800 hover:bg-slate-700/30">
                      <td className="py-2 pr-4 font-medium">{r.fullName || '-'}</td>
                      <td className="py-2 pr-4">{r.email || '-'}</td>
                      <td className="py-2 pr-4">{r.mobileNumber || '-'}</td>
                      <td className="py-2 pr-4">{r.jobRole || '-'}</td>
                      <td className="py-2 pr-4">{r.currentDesignation || '-'}</td>
                      <td className="py-2 pr-4">{r.currentCompanyName || '-'}</td>
                      <td className="py-2 pr-4">
                        {r.photoUrl ? (
                          <button
                            className="text-indigo-300 hover:underline"
                            onMouseEnter={(e) => setHover({ show: true, type: 'image', url: r.photoUrl, x: e.clientX, y: e.clientY })}
                            onMouseMove={(e) => setHover((h) => ({ ...h, x: e.clientX, y: e.clientY }))}
                            onMouseLeave={() => setHover({ show: false, type: null, url: '', x: 0, y: 0 })}
                          >View</button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {r.resumeUrl ? (
                          <div className="flex items-center gap-3">
                            <button
                              className="text-indigo-300 hover:underline"
                              onMouseEnter={(e) => setHover({ show: true, type: 'pdf', url: r.resumeUrl, x: e.clientX, y: e.clientY })}
                              onMouseMove={(e) => setHover((h) => ({ ...h, x: e.clientX, y: e.clientY }))}
                              onMouseLeave={() => setHover({ show: false, type: null, url: '', x: 0, y: 0 })}
                            >Preview</button>
                            <a href={resumePreviewUrl(r.resumeUrl)} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">Open</a>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {r.videoUrl ? (
                          <button
                            className="text-indigo-300 hover:underline"
                            onMouseEnter={(e) => setHover({ show: true, type: 'video', url: r.videoUrl, x: e.clientX, y: e.clientY })}
                            onMouseMove={(e) => setHover((h) => ({ ...h, x: e.clientX, y: e.clientY }))}
                            onMouseLeave={() => setHover({ show: false, type: null, url: '', x: 0, y: 0 })}
                          >Play</button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          className="px-2 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-500"
                          onClick={() => { setHover({ show: false, type: null, url: '', x: 0, y: 0 }); setView({ open: true, data: r }); }}
                        >View</button>
                      </td>
                      <td className="py-2 pr-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {hover.show && (
                <div
                  className="fixed z-50 p-2 rounded-lg border border-slate-700 bg-slate-900/95 shadow-xl"
                  style={{ left: hover.x + 12, top: hover.y + 12, width: 320, maxHeight: 260 }}
                >
                  {hover.type === 'image' && (
                    <img src={hover.url} alt="Photo" className="w-full h-auto rounded" />
                  )}
                  {hover.type === 'pdf' && (
                    <iframe src={resumePreviewUrl(hover.url)} title="Resume" className="w-full h-[240px] rounded bg-white" />
                  )}
                  {hover.type === 'video' && (
                    <video src={hover.url} controls className="w-full h-[200px] rounded bg-black" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {view.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setView({ open: false, data: null })} />
            <div className="relative z-10 w-full max-w-5xl max-h-[85vh] overflow-auto rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">Application Details</div>
                <button onClick={() => setView({ open: false, data: null })} className="px-2 py-1 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-800 text-sm">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400">Name</div>
                  <div className="text-sm">{view.data?.fullName || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div className="text-sm">{view.data?.email || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Mobile</div>
                  <div className="text-sm">{view.data?.mobileNumber || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Gender</div>
                  <div className="text-sm">{view.data?.gender || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Category</div>
                  <div className="text-sm">{view.data?.category || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Date of Birth</div>
                  <div className="text-sm">{view.data?.dateOfBirth ? `${new Date(view.data.dateOfBirth).toLocaleDateString()} (${Math.max(0, Math.floor((Date.now() - new Date(view.data.dateOfBirth)) / (365.25*24*60*60*1000)))} yrs)` : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Nationality</div>
                  <div className="text-sm">{view.data?.nationality || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Address</div>
                  <div className="text-sm">{view.data?.address || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Region / State</div>
                  <div className="text-sm">{view.data?.region || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Application Type</div>
                  <div className="text-sm">{view.data?.applicationType || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Job Role</div>
                  <div className="text-sm">{view.data?.jobRole || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Current Designation</div>
                  <div className="text-sm">{view.data?.currentDesignation || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Current Company</div>
                  <div className="text-sm">{view.data?.currentCompanyName || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Total Experience (years)</div>
                  <div className="text-sm">{view.data?.totalWorkExperience ?? '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-slate-400">Languages Known</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Array.isArray(view.data?.languagesKnown) && view.data.languagesKnown.length ? (
                      view.data.languagesKnown.map((lg) => (
                        <span key={lg} className="px-2 py-1 rounded-md bg-slate-700 text-slate-100 text-xs border border-slate-600">{lg}</span>
                      ))
                    ) : (
                      <span className="text-sm">-</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-semibold mb-2">Education</div>
                {Array.isArray(view.data?.educationQualifications) && view.data.educationQualifications.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-slate-700 text-slate-300">
                          <th className="py-2 pr-4">Level</th>
                          <th className="py-2 pr-4">Institute</th>
                          <th className="py-2 pr-4">Subject</th>
                          <th className="py-2 pr-4">Board/University</th>
                          <th className="py-2 pr-4">From - To</th>
                          <th className="py-2 pr-4">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {view.data.educationQualifications.map((e, idx) => (
                          <tr key={idx} className="border-b border-slate-800">
                            <td className="py-2 pr-4">{e?.level || '-'}</td>
                            <td className="py-2 pr-4">{e?.institutionName || '-'}</td>
                            <td className="py-2 pr-4">{e?.subject || '-'}</td>
                            <td className="py-2 pr-4">{e?.boardOrUniversity || '-'}</td>
                            <td className="py-2 pr-4">{[e?.startYear, e?.endYear].filter(Boolean).join(' - ') || '-'}</td>
                            <td className="py-2 pr-4">{e?.grade || e?.percentage || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">No education records</div>
                )}
              </div>
              <div className="mt-4">
                <div className="font-semibold mb-2">Work Experience</div>
                {Array.isArray(view.data?.workExperience) && view.data.workExperience.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-slate-700 text-slate-300">
                          <th className="py-2 pr-4">Company</th>
                          <th className="py-2 pr-4">Position</th>
                          <th className="py-2 pr-4">From</th>
                          <th className="py-2 pr-4">To</th>
                          <th className="py-2 pr-4">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {view.data.workExperience.map((w, idx) => (
                          <tr key={idx} className="border-b border-slate-800">
                            <td className="py-2 pr-4">{w?.institutionName || w?.companyName || '-'}</td>
                            <td className="py-2 pr-4">{w?.position || w?.designation || '-'}</td>
                            <td className="py-2 pr-4">{w?.startDate ? new Date(w.startDate).toLocaleDateString() : '-'}</td>
                            <td className="py-2 pr-4">{w?.isPresent || w?.present ? 'Present' : (w?.endDate ? new Date(w.endDate).toLocaleDateString() : '-')}</td>
                            <td className="py-2 pr-4">{w?.detailJD || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">No work experience records</div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-2">References</div>
                  {Array.isArray(view.data?.references) && view.data.references.length ? (
                    <div className="space-y-2">
                      {view.data.references.map((ref, idx) => (
                        <div key={idx} className="rounded-md border border-slate-700 p-3">
                          <div className="text-sm">{ref?.name || '-'}</div>
                          <div className="text-xs text-slate-400">{ref?.relation || '-'}</div>
                          <div className="text-xs text-slate-300">{ref?.email || '-'}</div>
                          <div className="text-xs text-slate-300">{ref?.phone || '-'}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">No references</div>
                  )}
                </div>
                <div>
                  <div className="font-semibold mb-2">Social</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-slate-400">LinkedIn: </span>{view.data?.socialMedia?.linkedin ? (<a href={view.data.socialMedia.linkedin} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">{view.data.socialMedia.linkedin}</a>) : '-'}</div>
                    <div><span className="text-slate-400">GitHub: </span>{view.data?.socialMedia?.github ? (<a href={view.data.socialMedia.github} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">{view.data.socialMedia.github}</a>) : '-'}</div>
                    <div><span className="text-slate-400">Portfolio: </span>{view.data?.socialMedia?.portfolio ? (<a href={view.data.socialMedia.portfolio} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">{view.data.socialMedia.portfolio}</a>) : '-'}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">Resume</div>
                  {view.data?.resumeUrl ? (
                    <a href={resumePreviewUrl(view.data.resumeUrl)} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-slate-700 text-slate-100 text-xs border border-slate-600">Open</a>
                  ) : (
                    <span className="text-sm">-</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">Intro Video</div>
                  {view.data?.videoUrl ? (
                    <a href={view.data.videoUrl} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-slate-700 text-slate-100 text-xs border border-slate-600">Open</a>
                  ) : (
                    <span className="text-sm">-</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">Photo</div>
                  {view.data?.photoUrl ? (
                    <a href={view.data.photoUrl} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-slate-700 text-slate-100 text-xs border border-slate-600">Open</a>
                  ) : (
                    <span className="text-sm">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        <Footer />
    </div>
  );
}

function MultiSelectSmall({ values = [], setValues }) {
  const OPTIONS = useMemo(() => [
    'Hindi','English','Bengali','Telugu','Marathi','Tamil','Urdu','Gujarati','Kannada','Odia','Malayalam','Punjabi','Assamese','Maithili'
  ], []);
  const selected = new Set(values);
  const toggle = (opt) => {
    const next = new Set(selected);
    if (next.has(opt)) next.delete(opt); else next.add(opt);
    setValues(Array.from(next));
  };
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-2 py-1 rounded-md text-xs border ${selected.has(opt) ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-700 text-slate-200 border-slate-600'}`}
        >{opt}</button>
      ))}
    </div>
  );
}

function ShimmerRows() {
  const rows = new Array(6).fill(0);
  return (
    <div className="space-y-2">
      {rows.map((_, i) => (
        <div key={i} className="w-full h-10 rounded-md bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
      ))}
    </div>
  );
}

function MultiSelectTag({ options = [], values = [], setValues, placeholder = 'Select Some Options' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const normalized = useMemo(() => options.map(o => (typeof o === 'string' ? o : String(o))), [options]);
  const filtered = useMemo(() => normalized.filter(o => o.toLowerCase().includes(query.toLowerCase())), [normalized, query]);
  const selected = new Set(values);

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const toggle = (opt) => {
    const next = new Set(selected);
    if (next.has(opt)) next.delete(opt); else next.add(opt);
    setValues(Array.from(next));
  };
  const removeTag = (opt) => {
    setValues(values.filter(v => v !== opt));
  };

  return (
    <div ref={wrapRef} className="w-full">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-600 bg-slate-700 px-2 py-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded bg-slate-600 text-slate-100 px-2 py-1 text-xs">
            {v}
            <button type="button" onClick={() => removeTag(v)} className="text-slate-300 hover:text-white">×</button>
          </span>
        ))}
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 min-w-[140px] bg-transparent text-slate-200 placeholder-slate-400 outline-none text-sm"
        />
      </div>
      {open && (
        <div className="mt-1 max-h-60 overflow-auto rounded-md border border-slate-600 bg-slate-800 shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-300">No matches</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`w-full text-left px-3 py-2 text-sm ${selected.has(opt) ? 'bg-indigo-600/20 text-indigo-200' : 'text-slate-200 hover:bg-slate-700'}`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
