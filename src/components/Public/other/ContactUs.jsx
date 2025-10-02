import React, { useState } from "react";
import Footer from "../Landing Page/Footer";
import Navbar from "../Landing Page/Navbar";
import { BASE_URL } from "../../../config";

const initialState = { 
  name: "", 
  company: "",
  designation: "",
  subject: "",
  email: "", 
  phone: "", 
  message: "" 
};

const ContactForm = () => {
  const [values, setValues] = useState(initialState);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const setField = (k, v) => {
    setValues(prev => ({ ...prev, [k]: v }));
    // Clear submit status when user starts typing again
    if (submitStatus.message) {
      setSubmitStatus({ success: false, message: '' });
    }
  };

  const onBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Field validations
  const validations = {
    name: (val) => val.trim().length >= 2,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phone: (val) => val === "" || /^\+?[0-9\s-]{7,15}$/.test(val),
    message: (val) => val.trim().length >= 10,
    company: (val) => val.trim().length > 0,
    designation: (val) => val.trim().length > 0,
    subject: (val) => val.trim().length >= 5
  };

  const errors = {
    name: !validations.name(values.name) ? 'Name must be at least 2 characters' : '',
    email: !validations.email(values.email) ? 'Please enter a valid email' : '',
    phone: !validations.phone(values.phone) ? 'Please enter a valid phone number' : '',
    message: !validations.message(values.message) ? 'Message must be at least 10 characters' : '',
    company: !validations.company(values.company) ? 'Company name is required' : '',
    designation: !validations.designation(values.designation) ? 'Designation is required' : '',
    subject: !validations.subject(values.subject) ? 'Subject must be at least 5 characters' : ''
  };

  const canSubmit = (
    validations.name(values.name) &&
    validations.company(values.company) &&
    validations.designation(values.designation) &&
    validations.subject(values.subject) &&
    validations.email(values.email) &&
    validations.phone(values.phone) && // phone optional but must be valid if provided
    validations.message(values.message)
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    if (!canSubmit) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all required fields correctly.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        });
        setValues(initialState);
        setTouched({});
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-3 text-lg text-slate-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Contact Form */}
              <div className="p-6 sm:p-8">
                {submitStatus.message && !submitStatus.success && (
                  <div className={`mb-6 rounded-lg p-4 bg-red-900/30 text-red-300`}>
                    {submitStatus.message}
                  </div>
                )}

                {!submitStatus.success && (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={values.name}
                        onChange={(e) => setField("name", e.target.value)}
                        onBlur={() => onBlur("name")}
                        className={`w-full rounded-lg bg-slate-800/50 border ${touched.name && errors.name ? 'border-red-500/50' : 'border-slate-700'} px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20`}
                        placeholder="Your Full Name"
                      />
                      {touched.name && errors.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="company" className="block text-sm font-medium text-slate-300">
                        Company <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={values.company}
                        onChange={(e) => setField("company", e.target.value)}
                        onBlur={() => onBlur("company")}
                        className={`w-full rounded-lg bg-slate-800/50 border ${touched.company && errors.company ? 'border-red-500/50' : 'border-slate-700'} px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20`}
                        placeholder="Your Company"
                      />
                      {touched.company && errors.company && (
                        <p className="mt-1 text-xs text-red-400">{errors.company}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="designation" className="block text-sm font-medium text-slate-300">
                        Designation <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="designation"
                        type="text"
                        value={values.designation}
                        onChange={(e) => setField("designation", e.target.value)}
                        onBlur={() => onBlur("designation")}
                        className={`w-full rounded-lg bg-slate-800/50 border ${touched.designation && errors.designation ? 'border-red-500/50' : 'border-slate-700'} px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20`}
                        placeholder="Your Position"
                      />
                      {touched.designation && errors.designation && (
                        <p className="mt-1 text-xs text-red-400">{errors.designation}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => setField("email", e.target.value)}
                        onBlur={() => onBlur("email")}
                        className={`w-full rounded-lg bg-slate-800/50 border ${touched.email && errors.email ? 'border-red-500/50' : 'border-slate-700'} px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20`}
                        placeholder="Email"
                      />
                      {touched.email && errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                        Phone <span className="text-slate-400">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={values.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() => onBlur("phone")}
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Your Mobile"
                      />
                      {touched.phone && errors.phone && (
                        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={values.subject}
                      onChange={(e) => setField("subject", e.target.value)}
                      onBlur={() => onBlur("subject")}
                      className={`w-full rounded-lg bg-slate-800/50 border ${touched.subject && errors.subject ? 'border-red-500/50' : 'border-slate-700'} px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20`}
                      placeholder="How can we help you?"
                    />
                    {touched.subject && errors.subject && (
                      <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={values.message}
                      onChange={(e) => setField("message", e.target.value)}
                      onBlur={() => onBlur("message")}
                      rows={4}
                      className={`w-full rounded-lg bg-slate-800/50 border ${touched.message && errors.message ? 'border-red-500/50' : 'border-slate-700'} px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20`}
                      placeholder="Tell us more about your requirements..."
                    />
                    {touched.message && errors.message && (
                      <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !canSubmit}
                      className={`w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto ${(isSubmitting || !canSubmit) ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : 'Send Message'}
                    </button>
                    <p className="mt-3 text-xs text-slate-400">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-slate-900/60 p-8 sm:p-10 border-t md:border-t-0 md:border-l border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-slate-800/50 p-2.5 rounded-lg text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-slate-300">Email us</h4>
                      <p className="mt-1 text-sm text-slate-400">contact@iitgjobs.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-slate-800/50 p-2.5 rounded-lg text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-slate-300">Call us</h4>
                      <p className="mt-1 text-sm text-slate-400">?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-slate-800/50 p-2.5 rounded-lg text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-slate-300">Visit us</h4>
                      <p className="mt-1 text-sm text-slate-400"> Madan Mahal, Shiv Hari Complex, Mahanadda, Nagpur Rd, near Gulzar Hotel<br />Jabalpur, Madhya Pradesh 482002</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {submitStatus.success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/30 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M10.28 15.3a1 1 0 0 1-1.56.2l-2.5-2.5a1 1 0 1 1 1.42-1.42l1.72 1.72 5.3-5.3a1 1 0 0 1 1.42 1.42l-6.8 6.88z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Message sent!</h2>
            <p className="mt-2 text-sm text-slate-300">{submitStatus.message}</p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setSubmitStatus({ success: false, message: '' })}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ContactForm;