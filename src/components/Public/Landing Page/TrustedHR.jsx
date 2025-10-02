
import React from "react";

const Pill = ({ children, href }) => (
  <a
    href={href}
    onClick={(e) => {
      if (href?.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-sm hover:bg-white/10"
  >
    {children}
  </a>
);

const TrustedHR = () => {
  const onAnchor = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <main className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
            30+ Years • Trusted HR Partner
          </span>
        </div>

        {/* Headline */}
        <section className="mt-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            30+ Years of Building
          </h1>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500 sm:text-5xl lg:text-6xl">
            Careers & Businesses
          </h1>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            with Trusted HR Solutions
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Recruiting right, reducing attrition, and elevating HR excellence for organizations of all sizes.
            From talent acquisition to retention strategies and HR consulting — we deliver with experience and trust.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#hire"
              onClick={(e) => onAnchor(e, "hire")}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500 transition hover:translate-y-[-1px] hover:shadow-xl hover:scale-[1.02] hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              Hire Talent
            </a>
            <a
              href="#jobs"
              onClick={(e) => onAnchor(e, "jobs")}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 hover:shadow-lg hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Find a Job
            </a>
          </div>

          {/* Pillars */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300/90">
            <Pill href="#recruitment">Recruitment Excellence</Pill>
            <Pill href="#attrition">Attrition Control</Pill>
            <Pill href="#expertise">HR Expertise</Pill>
          </div>
        </section> 
      </main>
    </div>
  );
};

export default TrustedHR;
