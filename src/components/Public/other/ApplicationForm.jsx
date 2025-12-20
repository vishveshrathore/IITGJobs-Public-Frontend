import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import Footer from "../Landing Page/Footer";
import Navbar from "../Landing Page/Navbar";
import { BASE_URL } from "../../../config";
import {
  FaUser,
  FaUsers,
  FaGraduationCap,
  FaBriefcase,
  FaIdCard,
  FaFileUpload,
  FaShareAlt,
  FaCheck,
  FaPlus,
  FaTrash,
  FaSpinner,
} from "react-icons/fa"

const steps = [
  { label: "Personal", icon: <FaUser /> },
  { label: "Work Experience", icon: <FaBriefcase /> },
  { label: "Education Qualifications", icon: <FaGraduationCap /> },
  { label: "Family", icon: <FaUsers /> },
  { label: "References", icon: <FaIdCard /> },
  { label: "Uploads", icon: <FaFileUpload /> },
  { label: "Social", icon: <FaShareAlt /> },
  { label: "Review", icon: <FaCheck /> },
]


const INDIAN_REGIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
]


const INDIAN_LANGUAGES = [
  "Hindi",
  "English",
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "Gujarati",
  
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
  "Rajasthani",
  "Bhojpuri",
  "Haryanvi",
  "Garhwali",
  "Kumaoni",
  "Tulu",
  "Kokborok",
  "Mizo",
  "Garo",
  "Khasi",
  "Tripuri",
  "Ladakhi",
]


export default function ApplicationForm() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toasts, setToasts] = useState([])
  const [navDir, setNavDir] = useState(0)
  const [validation, setValidation] = useState({ step: 0, errors: [] })
  const [uploadProgress, setUploadProgress] = useState(0)
  const cancelSourceRef = useRef(null)
  const [showRestore, setShowRestore] = useState(false)
  const [restorable, setRestorable] = useState(null)

  const pushToast = (type, message, ttl = 4000) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl)
  }

  // Helpers for CTC amount/unit handling
  const rupFromAmtUnit = (amt, unit) => {
    const n = Number(amt) || 0
    return unit === 'Cr' ? Math.round(n * 10000000) : Math.round(n * 100000)
  }
  const toShortCTC = (rupees) => {
    const v = Number(rupees) || 0
    if (v >= 10000000) return `${(v / 10000000).toFixed(2)} Cr`
    return `${(v / 100000).toFixed(2)} L`
  }

  // Local UI state for CTC inputs (does not affect payload shape)
  const [currentCTCAmount, setCurrentCTCAmount] = useState("")
  const [currentCTCUnit, setCurrentCTCUnit] = useState("L")
  const [expectedCTCAmount, setExpectedCTCAmount] = useState("")
  const [expectedCTCUnit, setExpectedCTCUnit] = useState("L")
  const [currentIsPresent, setCurrentIsPresent] = useState(false)

  useEffect(() => {
    // Initialize CTC inputs from existing numeric values
    const initFromValue = (val) => {
      const v = Number(val) || 0
      if (v >= 10000000) {
        return { amt: (v / 10000000).toFixed(2), unit: 'Cr' }
      }
      return { amt: (v / 100000).toFixed(2), unit: 'L' }
    }
    const cur = initFromValue(form.currentCTC)
    setCurrentCTCAmount(cur.amt)
    setCurrentCTCUnit(cur.unit)
    const exp = initFromValue(form.expectedCTC)
    setExpectedCTCAmount(exp.amt)
    setExpectedCTCUnit(exp.unit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  

    const initialForm = {
      applicationType: "",
      photo: null,
      resume: null,
      introVideo: null,
      requestTranscription: false,
      fullName: "",
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      motherOccupation: "",
      dateOfBirth: "",
      gender: "",
      category: "",
      religion: "",
      nationality: "",
      languagesKnown: [],
      maritalStatus: "",
      spouseName: "",
      children: 0,
      address: "",
      addressPincode: "",
      permanentAddress: "",
      permanentAddressPincode: "",
      mobileNumber: "",
      emergencyMobileNumber: "",
      email: "",
      experienceType: "",
      educationQualifications: [
        {
          level: "Graduation",
          examType: "Regular",
          medium: "English",
          subject: "",
          boardOrUniversity: "",
          institutionName: "",
          yearOfPassing: "",
          percentageOrCGPA: "",
        },
      ],
      totalWorkExperience: 0,
      expectedCTC: 0,
      jobRole: "",
      jobLevel: "",
      currentCompanyName: "",
      currentDesignation: "",
      currentStartDate: "",
      currentEndDate: "",
      currentCTC: 0,
      currentDetailJD: "",
      workExperience: [
        {
          serialNo: 1,
          institutionName: "",
          designation: "",
          level: "",
          jobRole: "",
          startDate: "",
          endDate: "",
          netMonthlySalary: "",
          detailJD: "",
        },
      ],
      socialMedia: {
        linkedin: "",
        facebook: "",
        instagram: "",
      },
      references: [
        {
          name: "",
          designation: "",
          contact: "",
        },
      ],
    }

  const [form, setForm] = useState(initialForm)
  const resumeRef = useRef(null)
  const photoRef = useRef(null)
  const videoRef = useRef(null)

  // Recording state for Intro Video
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaStreamRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const [recordLowBandwidth, setRecordLowBandwidth] = useState(true)

  // Recording helpers for Intro Video (max 60 seconds)
  const startRecording = async () => {
    try {
      const constraints = recordLowBandwidth
        ? { video: { width: { ideal: 640 }, height: { ideal: 360 } }, audio: true }
        : { video: true, audio: true }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaStreamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm"
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" })
        const file = new File([blob], "intro.webm", { type: blob.type })
        setField("introVideo", file)
        if (videoRef.current) videoRef.current.srcObject = null
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop())
          mediaStreamRef.current = null
        }
        setIsRecording(false)
        setRecordingTime(0)
      }
      recorderRef.current = recorder
      recorder.start(100)
      setIsRecording(true)
      setRecordingTime(0)
    } catch (err) {
      pushToast("error", "Unable to access camera/microphone.")
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop()
    }
  }

  const resetRecording = () => {
    setField("introVideo", null)
    if (videoRef.current) videoRef.current.srcObject = null
  }

  // Tick timer and auto-stop at 60s
  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => {
      setRecordingTime((t) => {
        if (t + 1 >= 60) {
          clearInterval(id)
          stopRecording()
          return 60
        }
        return t + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop()
      } catch {}
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
    }
  }, [])

  // Keyboard hotkeys Alt+→ and Alt+←
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        if (!currentStepHasErrors()) {
          setNavDir(1)
          setStep((s) => Math.min(steps.length - 1, s + 1))
        }
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        setNavDir(-1)
        setStep((s) => Math.max(0, s - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, form])

  // Autosave to localStorage with debounce and restore prompt
  useEffect(() => {
    try {
      const saved = localStorage.getItem('application_form_draft')
      if (saved) {
        setRestorable(JSON.parse(saved))
        setShowRestore(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem('application_form_draft', JSON.stringify({ form, step }))
      } catch {}
    }, 400)
    return () => clearTimeout(id)
  }, [form, step])

  const restoreDraft = () => {
    if (restorable) {
      setForm(restorable.form || initialForm)
      setStep(restorable.step || 0)
      setShowRestore(false)
      pushToast('success', 'Draft restored')
    }
  }
  const discardDraft = () => {
    try { localStorage.removeItem('application_form_draft') } catch {}
    setShowRestore(false)
    setRestorable(null)
  }

  // Per-step validation
  const validateForStep = (s, f) => {
    const errs = []
    if (s === 0) {
      if (!f.fullName) errs.push('Full Name is required')
      if (!f.dateOfBirth) errs.push('Date of Birth is required')
      if (!f.gender) errs.push('Gender is required')
      if (!f.category) errs.push('Category is required')
    } else if (s === 1) {
      if (f.experienceType === 'experienced') {
        const one = f.workExperience?.[0] || {}
        if (!one.institutionName) errs.push('At least one work entry requires Company Name')
        if (!one.designation) errs.push('At least one work entry requires Designation')
      }
    } else if (s === 2) {
      const e0 = f.educationQualifications?.[0] || {}
      if (!e0.level) errs.push('Education: Level is required')
      if (!e0.institutionName && !e0.boardOrUniversity) errs.push('Education: Institution/Board is required')
    } else if (s === 3) {
      if (!f.mobileNumber) errs.push('Mobile Number is required')
      if (!f.email) errs.push('Email is required')
    }
    return errs
  }

  const currentStepHasErrors = () => {
    const errs = validateForStep(step, form)
    setValidation({ step, errors: errs })
    return errs.length > 0
  }

  const computeDetailsList = (tier, collegeType) => {
    const DETAILS_BY_TIER = { /* Tier data can be added here if needed */ }
    const DETAILS_OPTIONS = { /* Options data can be added here if needed */ }
    if (tier && DETAILS_BY_TIER[tier] && DETAILS_BY_TIER[tier][collegeType]) {
      return DETAILS_BY_TIER[tier][collegeType]
    }
    return DETAILS_OPTIONS[collegeType] || ["Other"]
  }

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const setNestedArrayItem = (arrayKey, index, fieldKey, value) => {
    setForm((prev) => {
      const arr = [...prev[arrayKey]]
      arr[index] = { ...arr[index], [fieldKey]: value }
      return { ...prev, [arrayKey]: arr }
    })
  }

  const addArrayItem = (arrayKey, template) => setForm((prev) => ({ ...prev, [arrayKey]: [...prev[arrayKey], template] }))
  const removeArrayItem = (arrayKey, index) => setForm((prev) => ({ ...prev, [arrayKey]: prev[arrayKey].filter((_, i) => i !== index) }))
  const handleLanguagesChange = (text) => setField("languagesKnown", text.split(",").map((s) => s.trim()).filter(Boolean))
  const handleFileChange = (key, file) => {
    setField(key, file)
    if (key === "introVideo" && file) {
      generateIntroThumbnail(file)
    }
  }

  const [introThumb, setIntroThumb] = useState("")
  const generateIntroThumbnail = async (file) => {
    try {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      video.src = url
      video.crossOrigin = 'anonymous'
      await video.play().catch(() => {})
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2)
      await new Promise((res) => video.onseeked = res)
      const canvas = document.createElement('canvas')
      canvas.width = 320
      canvas.height = Math.round((video.videoHeight / video.videoWidth) * 320) || 180
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
      setIntroThumb(dataUrl)
      URL.revokeObjectURL(url)
    } catch (e) { console.warn('Thumbnail generation failed', e) }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setUploadProgress(0)
      if (!form.fullName || !form.email || !form.mobileNumber || !form.dateOfBirth) {
        pushToast("error", "Please fill required fields: Full Name, Email, Mobile, Date of Birth.")
        setStep(1); setLoading(false); return
      }
      if (!form.gender || !form.category) {
        pushToast("error", "Please choose Gender and Category.")
        setStep(1); setLoading(false); return
      }
      // Validate educationCategory only if present in the form
      if (form.applicationType === "college" && form.educationCategory) {
        const ec = form.educationCategory
        if (!ec.category || !ec.collegeType || !ec.details) {
          pushToast("error", "Please complete the Education Category fields.")
          setStep(1); setLoading(false); return
        }
      }

      const fd = new FormData()
      if (form.photo) fd.append("photo", form.photo)
      if (form.resume) fd.append("resume", form.resume)
      if (form.introVideo) fd.append("introVideo", form.introVideo)
      if (introThumb) fd.append("introThumbnail", introThumb)
      const skip = ["photo", "resume", "introVideo"]
      Object.keys(form).forEach((key) => {
        if (skip.includes(key)) return
        const value = form[key]
        if (value === null || value === undefined) fd.append(key, "")
        else if (Array.isArray(value) || typeof value === "object") fd.append(key, JSON.stringify(value))
        else fd.append(key, value)
      })
      const CancelToken = axios.CancelToken
      cancelSourceRef.current = CancelToken.source()
      const res = await axios.post(
        `${BASE_URL}/api/recruitment/apply`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          cancelToken: cancelSourceRef.current.token,
          onUploadProgress: (e) => {
            if (!e.total) return
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          },
        }
      )
      setForm(initialForm)
      setStep(0)
      if (resumeRef.current) resumeRef.current.value = ""
      if (photoRef.current) photoRef.current.value = ""
      if (videoRef.current) videoRef.current.srcObject = null
      setSubmitted(true)
      pushToast("success", "Submitted Successfully")
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message || err)
      pushToast("error", "Submission failed. Please check the console for details.")
    } finally {
      setLoading(false)
      cancelSourceRef.current = null
      setUploadProgress(0)
    }
  }

  function StepHeader() {
    const percent = Math.min(100, Math.round((step / (steps.length - 1)) * 100))
    return (
      <div className="mb-8">
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-4 px-2">
          {steps.map((s, i) => {
            const state = i === step ? "active" : i < step ? "done" : "todo"
            const base = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm transition-colors"
            const cls = state === "active"
              ? "border-indigo-500 bg-indigo-500/10 text-indigo-200 shadow-[0_0_0_1px_rgba(99,102,241,.2)]"
              : state === "done"
              ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-200"
              : "border-slate-600 bg-slate-700/40 text-slate-300"
            return (
              <button
                key={i}
                type="button"
                aria-current={i === step ? "step" : undefined}
                className={`${base} ${cls}`}
                onClick={() => { setNavDir(i > step ? 1 : -1); setStep(i) }}
              >
                <span className="text-sm">{s.icon}</span>
                <span className="font-medium tracking-wide">{s.label}</span>
              </button>
            )
          })}
        </div>
        <div className="relative mx-auto w-full max-w-3xl h-2 rounded-full bg-slate-700/60 overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
    )
  }

  
  
  function Navigation() {
    return (
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => { setNavDir(-1); setStep((s) => Math.max(0, s - 1)) }}
          className="btn btn-secondary"
          disabled={step === 0 || loading}
          aria-label="Go to previous step"
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => { setNavDir(1); setStep((s) => Math.min(steps.length - 1, s + 1)) }}
            className="btn btn-primary"
            disabled={loading}
            aria-label="Go to next step"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
            aria-busy={loading}
            aria-label="Submit application"
          >
            {loading ? <FaSpinner className="animate-spin" /> : null}
            <span>{loading ? "Submitting..." : "Submit"}</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center py-8 px-4 text-foreground">
      
      {submitted ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 text-center max-w-lg">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-100">Submitted Successfully</h2>
            <p className="text-slate-300 mb-6">
              Thank you — your application has been received. We'll contact you shortly.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm(initialForm)
                  setStep(0)
                  if (resumeRef.current) resumeRef.current.value = ""
                  if (photoRef.current) photoRef.current.value = ""
                }}
                className="btn btn-primary"
              >
                Submit Another
              </button>
              <a href="/" className="btn btn-secondary">
                Go Home
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <ToastContainer toasts={toasts} />
      {loading && <FullscreenLoader progress={uploadProgress} />}
      
      <div className="w-full max-w-5xl">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-100">Application Form</h1>
          <p className="text-slate-300">Recruitment</p>
        </header>

        <StepHeader />

        {(() => {
          const variants = {
            enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
          }
          const transition = { type: 'spring', stiffness: 300, damping: 30, mass: 0.5 }
          return (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                custom={navDir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8"
              >
          {/* ================================================================== */}
          {/* ========= THIS IS THE SECTION THAT WAS MISSING =================== */}
          {/* ================================================================== */}

          {step === 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Personal Details</h2>

              {form.applicationType === "college" && (
                <div className="mt-0 mb-6 border border-slate-700 rounded-lg p-4 bg-slate-800/50 col-span-2">
                  <h3 className="font-semibold mb-3 text-slate-200">Education Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Fields for Education Category */}
                  </div>
                </div>
              )}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name *" value={form.fullName} onChange={(v) => setField("fullName", v)} />
                <Input label="Date of Birth *" type="date" value={form.dateOfBirth} onChange={(v) => setField("dateOfBirth", v)} />
                <Input label="Gender *" as="select" value={form.gender} onChange={(v) => setField("gender", v)}>
                  <option value="">Select</option> <option value="Male">Male</option> <option value="Female">Female</option>
                </Input>

                <Input label="Category *" as="select" value={form.category} onChange={(v) => setField("category", v)}>
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="Physical Disability">Physical Disability</option>
                </Input>

                <Input label="Religion" value={form.religion} onChange={(v) => setField("religion", v)} />
                <Input label="Nationality" value={form.nationality} onChange={(v) => setField("nationality", v)} />

                <Input label="State" as="select" value={form.region} onChange={(v) => setField("region", v)}>
                  <option value="">Select State</option>
                  {INDIAN_REGIONS.map((region) => (<option key={region} value={region}>{region}</option>))}
                </Input>

                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">Languages Known</label>
                  <MultiSelect
                    options={INDIAN_LANGUAGES}
                    value={form.languagesKnown}
                    onChange={(vals) => setField("languagesKnown", vals)}
                    placeholder="Type to search languages..."
                  />
                </div>

                <Input label="Marital Status" as="select" value={form.maritalStatus} onChange={(v) => setField("maritalStatus", v)}>
                  <option value="Unmarried">Unmarried</option> <option value="Married">Married</option>
                </Input>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Family Details & Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Father's Name" value={form.fatherName} onChange={(v) => setField("fatherName", v)} />
                <Input label="Father's Occupation" value={form.fatherOccupation} onChange={(v) => setField("fatherOccupation", v)} />
                <Input label="Mother's Name" value={form.motherName} onChange={(v) => setField("motherName", v)} />
                <Input label="Mother's Occupation" value={form.motherOccupation} onChange={(v) => setField("motherOccupation", v)} />
                <Input label="Present Address" value={form.address} onChange={(v) => setField("address", v)} />
                <Input label="Address Pincode" value={form.addressPincode} onChange={(v) => setField("addressPincode", v)} />
                <Input label="Permanent Address" value={form.permanentAddress} onChange={(v) => setField("permanentAddress", v)} />
                <Input label="Permanent Address Pincode" value={form.permanentAddressPincode} onChange={(v) => setField("permanentAddressPincode", v)} />
                <Input label="Mobile Number *" value={form.mobileNumber} onChange={(v) => setField("mobileNumber", v)} />
                <Input label="Emergency Mobile Number" value={form.emergencyMobileNumber} onChange={(v) => setField("emergencyMobileNumber", v)} />
                <Input label="Email *" type="email" value={form.email} onChange={(v) => setField("email", v)} />
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-200">Education Qualifications</h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("educationQualifications", {
                      level: "Graduation",
                      examType: "Regular",
                      medium: "English",
                      subject: "",
                      boardOrUniversity: "",
                      institutionName: "",
                      yearOfPassing: "",
                      percentageOrCGPA: "",
                    })
                  }
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  <FaPlus /> Add Education
                </button>
              </div>

              <div className="space-y-4">
                {form.educationQualifications.map((edu, idx) => (
                  <div key={idx} className="border border-slate-700 rounded p-4 bg-slate-800/50">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium mb-2 text-slate-200"> # {idx + 1}</h3>
                      <button type="button" onClick={() => removeArrayItem("educationQualifications", idx)} className="text-red-400 hover:text-red-300">
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input as="select" label="Level" value={edu.level} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "level", v)}>
                        <option value="10th">10th</option>
                        <option value="12th">12th</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Post Graduation">Post Graduation</option>
                        <option value="PhD">PhD</option>
                      </Input>
                      <Input as="select" label="Exam Type" value={edu.examType} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "examType", v)}>
                        <option value="Regular">Regular</option>
                        <option value="Correspondence">Correspondence</option>
                        <option value="Private">Private</option>
                      </Input>
                      <Input as="select" label="Medium" value={edu.medium} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "medium", v)}>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </Input>
                      <Input label="Subject" value={edu.subject} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "subject", v)} />
                      <Input label="Board / University" value={edu.boardOrUniversity} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "boardOrUniversity", v)} />
                      <Input label="Institute Name" value={edu.institutionName} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "institutionName", v)} />
                      <Input label="Year of Passing" type="number" min="0" max={new Date().getFullYear()} value={edu.yearOfPassing} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "yearOfPassing", Math.max(0, Math.min(new Date().getFullYear(), Number(v))))} />
                      <Input label="Percentage or CGPA" value={edu.percentageOrCGPA} onChange={(v) => setNestedArrayItem("educationQualifications", idx, "percentageOrCGPA", v)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Work Experience</h2>
              <div className="mb-6">
                <Input label="Experience Type *" as="select" value={form.experienceType} onChange={(v) => setField("experienceType", v)}>
                  <option value="">Select Experience Type</option>
                  <option value="fresher">Fresher</option>
                  <option value="experienced">Experienced</option>
                </Input>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Total Work Experience (years)</label>
                <input type="number" min="0" max="100" className="w-48 rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm" value={form.totalWorkExperience} onChange={(e) => setField("totalWorkExperience", Math.max(0, Math.min(100, Number(e.target.value))))} />
              </div>
              <h3 className="text-lg font-medium text-slate-200">Work Experience Details</h3>
              {form.experienceType === "experienced" && (
                <>
                  <div className="mt-6 border border-slate-700 rounded p-4 bg-slate-800/50">
                    <h3 className="text-lg font-medium text-slate-200 mb-3">Current / Last Company</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input label="Company Name" value={form.currentCompanyName} onChange={(v) => setField("currentCompanyName", v)} />
                      <Input label="Designation" value={form.currentDesignation} onChange={(v) => setField("currentDesignation", v)} />
                      <Input label="Level" value={form.jobLevel} onChange={(v) => setField("jobLevel", v)} />
                      <Input label="Job Role" value={form.jobRole} onChange={(v) => setField("jobRole", v)} />
                      <Input label="Start Date" type="date" value={form.currentStartDate} onChange={(v) => setField("currentStartDate", v)} />
                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-300">End Date</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="date"
                            value={form.currentEndDate || ""}
                            onChange={(e) => setField("currentEndDate", e.target.value)}
                            disabled={currentIsPresent}
                            className="rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                          <label className="inline-flex items-center gap-2 text-slate-300 text-sm">
                            <input
                              type="checkbox"
                              checked={currentIsPresent}
                              onChange={(e) => {
                                const on = e.target.checked
                                setCurrentIsPresent(on)
                                if (on) setField("currentEndDate", "")
                              }}
                            />
                            Present
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-300">Current CTC</label>
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={currentCTCAmount}
                            onChange={(e) => {
                              const amt = e.target.value
                              setCurrentCTCAmount(amt)
                              setField("currentCTC", rupFromAmtUnit(amt, currentCTCUnit))
                            }}
                            className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          />
                          <select
                            value={currentCTCUnit}
                            onChange={(e) => {
                              const unit = e.target.value
                              setCurrentCTCUnit(unit)
                              setField("currentCTC", rupFromAmtUnit(currentCTCAmount, unit))
                            }}
                            className="rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-2 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="L"> L </option>
                            <option value="Cr">Cr</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-slate-300">Expected CTC</label>
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={expectedCTCAmount}
                            onChange={(e) => {
                              const amt = e.target.value
                              setExpectedCTCAmount(amt)
                              setField("expectedCTC", rupFromAmtUnit(amt, expectedCTCUnit))
                            }}
                            className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          />
                          <select
                            value={expectedCTCUnit}
                            onChange={(e) => {
                              const unit = e.target.value
                              setExpectedCTCUnit(unit)
                              setField("expectedCTC", rupFromAmtUnit(expectedCTCAmount, unit))
                            }}
                            className="rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-2 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="L">L</option>
                            <option value="Cr">Cr</option>
                          </select>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-slate-300">Detail JD</label>
                        <textarea
                          value={form.currentDetailJD}
                          onChange={(e) => setField("currentDetailJD", e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("workExperience", {
                          serialNo: form.workExperience.length + 1,
                          institutionName: "",
                          designation: "",
                          level: "",
                          jobRole: "",
                          startDate: "",
                          endDate: "",
                          netMonthlySalary: "",
                          detailJD: "",
                        })
                      }
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                      <FaPlus /> Add More Work Experience
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.workExperience.map((job, idx) => (
                      <div key={idx} className="border border-slate-700 rounded p-4 bg-slate-800/50">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium mb-2 text-slate-200"> # {idx + 1}</h3>
                          <button type="button" onClick={() => removeArrayItem("workExperience", idx)} className="text-red-400 hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input label="Company Name" value={job.institutionName} onChange={(v) => setNestedArrayItem("workExperience", idx, "institutionName", v)} />
                          <Input label="Designation" value={job.designation} onChange={(v) => setNestedArrayItem("workExperience", idx, "designation", v)} />
                          <Input label="Level" value={job.level} onChange={(v) => setNestedArrayItem("workExperience", idx, "level", v)} />
                          <Input label="Job Role" value={job.jobRole} onChange={(v) => setNestedArrayItem("workExperience", idx, "jobRole", v)} />
                          <Input label="Start Date" type="date" value={job.startDate} onChange={(v) => setNestedArrayItem("workExperience", idx, "startDate", v)} />
                          <Input label="End Date" type="date" value={job.endDate} onChange={(v) => setNestedArrayItem("workExperience", idx, "endDate", v)} />
                          <Input label="CTC" type="number" min="0" value={job.netMonthlySalary} onChange={(v) => setNestedArrayItem("workExperience", idx, "netMonthlySalary", Math.max(0, Number(v)))} />
                          <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-slate-300">Detail JD</label>
                            <textarea
                              value={job.detailJD || ""}
                              onChange={(e) => setNestedArrayItem("workExperience", idx, "detailJD", e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </> 
              )}
            </section>
          )}

          {step === 4 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-200">References</h2>
                <button type="button" onClick={() => addArrayItem("references", { name: "", designation: "", contact: "" })} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500">
                  <FaPlus /> Add Reference
                </button>
              </div>
              <div className="space-y-4">
                {form.references.map((ref, idx) => (
                  <div key={idx} className="border border-slate-700 rounded p-4 bg-slate-800/50">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium mb-2 text-slate-200">Reference #{idx + 1}</h3>
                      <button type="button" onClick={() => removeArrayItem("references", idx)} className="text-red-400 hover:text-red-300">
                        <FaTrash />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input label="Name" value={ref.name} onChange={(v) => setNestedArrayItem("references", idx, "name", v)} />
                      <Input label="Company Name" value={ref.Comapanyname} onChange={(v) => setNestedArrayItem("references", idx, "Comapnyname", v)} />
                      <Input label="Designation" value={ref.designation} onChange={(v) => setNestedArrayItem("references", idx, "designation", v)} />
                      <Input label="Contact Number" value={ref.contact} onChange={(v) => setNestedArrayItem("references", idx, "contact", v)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 5 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Uploads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">Resume (pdf/doc/docx/jpg/png/jpeg - Max 10MB)</label>
                  <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => handleFileChange("resume", e.target.files?.[0])} className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm" />
                  {form.resume && <p className="text-sm mt-2 text-slate-300">{form.resume.name}</p>}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">Photograph (jpg/png/jpeg - Max 10MB)</label>
                  <input ref={photoRef} type="file" accept="image/*" onChange={(e) => handleFileChange("photo", e.target.files?.[0])} className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm" />
                  {form.photo && <p className="text-sm mt-2 text-slate-300">{form.photo.name}</p>}
                </div>
                <div className="md:col-span-2 border border-slate-700 rounded-lg p-4 bg-slate-800/50">
                  <h3 className="font-medium text-slate-200 mb-2">Intro Video (max 1 minute)</h3>
                  <p className="text-slate-400 text-sm mb-3">For faster response, keep it short and clear</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-slate-300">Upload Intro Video (mp4/webm)</label>
                      <input type="file" accept="video/*" onChange={(e) => {
                        const f = e.target.files?.[0] || null
                        if (f && f.size > 50 * 1024 * 1024) { pushToast("error", "Intro video must be 50MB or smaller."); return }
                        handleFileChange("introVideo", f)
                      }} className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm" />
                      {form.introVideo && <p className="text-sm mt-2 text-slate-300">{form.introVideo.name}</p>}
                      {form.introVideo && (
                        <video className="mt-3 w-full rounded-lg border border-slate-700" controls src={URL.createObjectURL(form.introVideo)} />
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-slate-300">Record Intro Video</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input id="lowbw" type="checkbox" checked={recordLowBandwidth} onChange={(e) => setRecordLowBandwidth(e.target.checked)} />
                          <label htmlFor="lowbw" className="text-slate-300 text-sm">Faster upload: record in low-bandwidth (360p)</label>
                        </div>
                        <video ref={videoRef} className="w-full rounded-lg border border-slate-700 bg-black" autoPlay muted playsInline />
                        <div className="flex items-center gap-3">
                          {!isRecording ? (
                            <button type="button" onClick={startRecording} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">Start Recording</button>
                          ) : (
                            <button type="button" onClick={stopRecording} className="px-3 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-500 transition-colors">Stop</button>
                          )}
                          <button type="button" onClick={resetRecording} className="px-3 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">Clear</button>
                          <span className="text-slate-300 text-sm">{recordingTime}s / 60s</span>
                        </div>
                        <p className="text-slate-400 text-xs">Tips: quiet place, good lighting, camera at eye level. Aim for 30–60 seconds.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 6 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Social Profiles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="LinkedIn URL" value={form.socialMedia.linkedin} placeholder="https://linkedin.com/in/username" onChange={(v) => setField("socialMedia", { ...form.socialMedia, linkedin: v })} />
                <Input label="Facebook URL" value={form.socialMedia.facebook} placeholder="https://facebook.com/username" onChange={(v) => setField("socialMedia", { ...form.socialMedia, facebook: v })} />
                <Input label="Instagram URL" value={form.socialMedia.instagram} placeholder="https://instagram.com/username" onChange={(v) => setField("socialMedia", { ...form.socialMedia, instagram: v })} />
              </div>
            </section>
          )}
          
          {step === 7 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Review & Submit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ReviewSection title="Personal">
                    <ReviewRow label="Full Name" value={form.fullName} />
                    <ReviewRow label="Date of Birth" value={form.dateOfBirth} />
                    <ReviewRow label="Gender" value={form.gender} />
                    <ReviewRow label="Category" value={form.category} />
                    <div className="mt-3 text-right">
                      <button onClick={() => setStep(0)} className="text-sm text-indigo-400 hover:underline">Edit</button>
                    </div>
                  </ReviewSection>
                </div>
                <div className="space-y-4">
                  <ReviewSection title="Family & Contact">
                    <ReviewRow label="Mobile" value={form.mobileNumber} />
                    <ReviewRow label="Email" value={form.email} />
                    <div className="mt-3 text-right">
                      <button onClick={() => setStep(3)} className="text-sm text-indigo-400 hover:underline">Edit</button>
                    </div>
                  </ReviewSection>

                  <ReviewSection title="Education">
                    {form.educationQualifications.map((e, i) => (
                      <div key={i} className="border border-slate-700 rounded p-3">
                        <div className="font-medium text-slate-200">{e.level} — {e.boardOrUniversity || e.institutionName}</div>
                        <div className="text-sm text-slate-300">{e.subject || "-"} • {e.yearOfPassing || "-"} • {e.percentageOrCGPA || "-"}</div>
                      </div>
                    ))}
                    <div className="mt-3 text-right">
                      <button onClick={() => setStep(2)} className="text-sm text-indigo-400 hover:underline">Edit</button>
                    </div>
                  </ReviewSection>

                  <ReviewSection title="Work">
                    <ReviewRow label="Experience Type" value={form.experienceType} />
                    {form.experienceType === "experienced" && (
                      <div className="grid grid-cols-1 gap-2">
                        <ReviewRow label="Total Experience (years)" value={String(form.totalWorkExperience)} />
                        <ReviewRow label="Company Name" value={form.currentCompanyName} />
                        <ReviewRow label="Designation" value={form.currentDesignation} />
                        <ReviewRow label="Level" value={form.jobLevel} />
                        <ReviewRow label="Job Role" value={form.jobRole} />
                        <ReviewRow label="Start Date" value={form.currentStartDate} />
                        <ReviewRow label="End Date" value={form.currentEndDate || "Present"} />
                        <ReviewRow label="Current CTC" value={toShortCTC(form.currentCTC)} />
                        <ReviewRow label="Expected CTC" value={toShortCTC(form.expectedCTC)} />
                      </div>
                    )}
                    {form.experienceType === "experienced" && form.workExperience.map((w, i) => (
                      <div key={i} className="border border-slate-700 rounded p-3">
                        <div className="font-medium text-slate-200">{w.designation || "-"} @ {w.institutionName || "-"}</div>
                        <div className="text-sm text-slate-300">{w.startDate || "-"} → {w.endDate || "Present"} • ₹{w.netMonthlySalary || "-"}</div>
                      </div>
                    ))}
                    <div className="mt-3 text-right">
                      <button onClick={() => setStep(1)} className="text-sm text-indigo-400 hover:underline">Edit</button>
                    </div>
                  </ReviewSection>

                  <ReviewSection title="References">
                    {form.references.map((r, i) => (
                      <div key={i} className="p-2">
                        <div className="font-medium text-slate-200">{r.name || "-"}</div>
                        <div className="text-sm text-slate-300">{r.designation || "-"} • {r.contact || "-"}</div>
                      </div>
                    ))}
                    <div className="mt-3 text-right">
                      <button onClick={() => setStep(4)} className="text-sm text-indigo-400 hover:underline">Edit</button>
                    </div>
                  </ReviewSection>

                  <ReviewSection title="Uploads & Social">
                    <div className="grid grid-cols-1 gap-2">
                      <ReviewRow label="Photo" value={form.photo ? form.photo.name : "No file"} />
                      <ReviewRow label="Resume" value={form.resume ? form.resume.name : "No file"} />
                      <ReviewRow label="Intro Video" value={form.introVideo ? form.introVideo.name : "No file"} />
                      <ReviewRow label="LinkedIn" value={form.socialMedia.linkedin} />
                      <ReviewRow label="Facebook" value={form.socialMedia.facebook} />
                      <ReviewRow label="Instagram" value={form.socialMedia.instagram} />
                    </div>
                    <div className="mt-3 text-right">
                      <button onClick={() => setStep(5)} className="text-sm text-indigo-400 hover:underline mr-3">Edit Uploads</button>
                      <button onClick={() => setStep(6)} className="text-sm text-indigo-400 hover:underline">Edit Social</button>
                    </div>
                  </ReviewSection>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-4">If everything looks good, click Submit.</p>
            </section>
          )}
                <Navigation />
              </motion.div>
            </AnimatePresence>
          )
        })()}
      </div>
    </div>
    <Footer/>
</>
  )
}


function MultiSelect({ options = [], value = [], onChange, placeholder = "" }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const normalized = options.map((o) => (typeof o === 'string' ? o : String(o)))
  const selected = new Set(value)
  const filtered = normalized.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  const toggle = (opt) => {
    const next = new Set(selected)
    if (next.has(opt)) next.delete(opt); else next.add(opt)
    onChange(Array.from(next))
  }
  const removeTag = (opt) => {
    const next = value.filter((v) => v !== opt)
    onChange(next)
  }

  return (
    <div ref={wrapRef} className="w-full">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-2 py-2">
        {value.map((v) => (
          <span key={v} className="inline-flex items-center gap-2 rounded-md bg-slate-600 text-slate-100 px-2 py-1 text-xs">
            {v}
            <button type="button" onClick={() => removeTag(v)} className="text-slate-300 hover:text-white">×</button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] bg-transparent text-slate-200 placeholder-slate-400 outline-none text-sm px-1"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className="mt-1 max-h-56 overflow-auto rounded-lg border border-slate-600 bg-slate-800 shadow-lg">
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
  )
}

function Input({ label, value, onChange, type = "text", as = "input", children, ...props }) {
  const handle = (e) => {
    if (onChange) onChange(e.target ? e.target.value : e)
  }
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-slate-300">{label}</label>
      {as === "input" && (
        <input
          type={type}
          value={value || ""}
          onChange={handle}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          {...props}
        />
      )}
      {as === "select" && (
        <select
          value={value || ""}
          onChange={handle}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          {...props}
        >
          {children}
        </select>
      )}
    </div>
  )
}

function ReviewSection({ title, children }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-md font-semibold mb-2 text-slate-200">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <div className="text-slate-400 flex-shrink-0">{label}</div>
      <div className="font-medium text-slate-100 text-right break-words">{value || "-"}</div>
    </div>
  )
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full px-4 py-3 rounded-md shadow-lg text-sm font-semibold text-white ${
            t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-slate-700"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

function FullscreenLoader({ progress = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-96">
        <FaSpinner className="text-4xl text-indigo-500 animate-spin" />
        <div className="text-lg font-semibold text-slate-200">Submitting Application</div>
        <div className="w-full">
          <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 text-right text-sm text-slate-300">{pct}%</div>
        </div>
        <div className="text-xs text-slate-400 text-center">
          Please wait while we securely upload your files and details.
        </div>
      </div>
    </div>
  )
}