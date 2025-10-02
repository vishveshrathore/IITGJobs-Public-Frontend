import React from "react";

const Footer = () => {
  const year = new Date().getFullYear(); // auto updates year
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-black/85 via-slate-950/70 to-slate-900/60 py-12 text-sm text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 ring-1 ring-white/10 shadow-sm">
                <svg
                  viewBox="0 0 40 40"
                  className="h-4 w-4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="ij-footer"
                      x1="0"
                      y1="0"
                      x2="40"
                      y2="40"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#2563eb" />
                      <stop offset="1" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="20"
                    cy="20"
                    r="15.5"
                    stroke="url(#ij-footer)"
                    strokeOpacity="0.65"
                  />
                  <path
                    d="M15 11v18"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25 11v11c0 4.2-3.4 7.6-7.6 7.6"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold text-white">
                IITGJobs.com Pvt. Ltd.
              </span>
            </div>
            <p className="max-w-sm text-xs text-slate-400">
              30+ years of trusted recruitment and HR solutions. Building careers
              and empowering businesses.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</h4>
            <div className="flex flex-col gap-1">
              <a href="mailto:hr1@iitgjobs.com" className="hover:text-white">contact@iitgjobs.com</a>
              <a href="mailto:hr2@iitgjobs.com" className="hover:text-white">hr1@iitgjobs.com</a>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              
            </div>
          </div>

          {/* Office */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Office</h4>
            <address className="not-italic text-xs">
              Madan Mahal, Shiv Hari Complex, Mahanadda, Nagpur Rd, near Gulzar Hotel,
              Jabalpur, Madhya Pradesh 482002
            </address>
            <a href="https://maps.app.goo.gl/wPK7jdvnoLh4Yg4u8" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">
              View on Google Maps
            </a>
            <p className="text-xs">Hours: Mon–Sat, 10:30 AM – 7:00 PM</p>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Follow
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/iitg-jobs-pvt-ltd-/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0zM8.34 8.98h4.79v2.03h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-6.87c0-1.64-.03-3.76-2.29-3.76-2.3 0-2.65 1.79-2.65 3.64V24h-5z" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/iitg_job?igsh=aHA1NWs0ZHAzNm9s"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 13 5.51 5.51 0 0012 7.5zm0 2A3.5 3.5 0 1115.5 13 3.5 3.5 0 0112 9.5zM18 6.25a1.25 1.25 0 11-1.25 1.25A1.25 1.25 0 0118 6.25z" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-400">
          © {year} IITGJobs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
