import React from "react";
import Navbar from "../Landing Page/Navbar";
import Footer from "../Landing Page/Footer";

const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M4.983 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM14.477 9c-2.07 0-3.022 1.139-3.55 1.94V9H7v12h3.927v-6.52c0-1.109.799-2.42 2.354-2.42 1.554 0 2.243 1.311 2.243 2.42V21H19V14.4C19 11.51 17.187 9 14.477 9z" />
  </svg>
);

// Accent class map (avoids dynamic Tailwind strings being purged)
const accentMap = {
  indigo: {
    ring: "ring-indigo-500/40",
    dot: "bg-indigo-600",
    text: "text-indigo-300/90",
    btn: "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400",
  },
  violet: {
    ring: "ring-violet-500/40",
    dot: "bg-violet-600",
    text: "text-violet-300/90",
    btn: "bg-violet-600 hover:bg-violet-500 focus:ring-violet-400",
  },
};

const DirectorCard = ({ name, title, imgSrc, linkedin, accent = "indigo", description = "Driving strategy and excellence at IITGJobs.com Pvt. Ltd. Focused on building high-impact teams and delivering value for partners and candidates.", subtitle }) => {
  const a = accentMap[accent] || accentMap.indigo;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 backdrop-blur supports-[backdrop-filter]:bg-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-y-0.5">
      {/* Subtle shine */}
      <div className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ring-2 ${a.ring}`} />

      {/* Decorative gradient blur */}
      <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-2xl" />

      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={imgSrc}
            alt={name}
            className="h-40 w-40 rounded-full object-cover ring-4 ring-white/10 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <span
            className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full ${a.dot} text-white grid place-items-center shadow-lg`}
            aria-hidden
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v6H9V5zm1 8a1 1 0 110 2 1 1 0 010-2z" />
            </svg>
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold text-white">{name}</h3>
        <p className={`mt-1 text-sm font-medium ${a.text}`}>{title}</p>
        {subtitle && (
          <p className={`mt-0.5 text-xs font-medium ${a.text}`}>{subtitle}</p>
        )}

        <p className="mt-3 text-sm text-slate-300/80 leading-relaxed">
          {description}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors ${a.btn}`}
          >
            <LinkedInIcon className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

const OurTeam = () => {
  return (
    <>
    <Navbar />
    <section className="relative isolate">
        
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0F0F0F] via-slate-950 to-black" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-5 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_60%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Leadership Team
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Directors
          </h2>
          <p className="mt-3 text-slate-300/80">
            Meet the leaders behind IITGJobs.com Pvt. Ltd., shaping our vision and growth.
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
        <DirectorCard
            name="A.C. Shrivastava"
            title="Bussiness Director"
            imgSrc="/Awaneesh.png"
            linkedin="https://www.linkedin.com/in/a-c-shrivastava-15216642/" // TODO: replace with actual URL
            accent="violet"
          />
          <DirectorCard
            name="Gaurav Maske"
            title="Technology Director - Advisor"
            imgSrc="/Gaurav.png"
            linkedin="https://www.linkedin.com/in/gaurav-maske-2ba56516/" // TODO: replace with actual URL
            accent="indigo"
            description="Driving technology and excellence at IITGJobs.com Pvt. Ltd."
            subtitle="Principal Product Engineer, Esri, California, United States"
          />
          
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default OurTeam;

